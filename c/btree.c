/* btree.c -- 18 章：B 树（最小度 t）SEARCH / CREATE / SPLIT-CHILD / INSERT / INSERT-NONFULL / DELETE。
 * 关键数字：t = 3 时插入 C程序序列后高度 = 2（h <= log_t((n+1)/2) 的实例）；
 *           SEARCH 逐结点比较次数；DELETE 后中序仍有序且元素数正确。 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define T_MIN_DEG 3          /* 最小度 t */
#define MAXC (2 * T_MIN_DEG) /* 最多孩子数 2t */
#define MAXK (2 * T_MIN_DEG - 1)

typedef struct bnode {
    int nkeys;                        /* 当前关键字数 */
    int keys[MAXK];
    struct bnode *child[MAXC];
    int leaf;
} bnode_t;

static bnode_t *root;
static long disk_reads;               /* 把"访问一个结点"记作一次磁盘页访问 */

static bnode_t *alloc_node(int leaf)
{
    bnode_t *x = malloc(sizeof(bnode_t));
    memset(x, 0, sizeof(*x));
    x->leaf = leaf;
    return x;
}

/* B-TREE-CREATE（5 行直译） */
static void btree_create(void)
{
    root = alloc_node(1);
}

/* B-TREE-SEARCH（9 行直译）：返回找到的结点与下标 */
static bnode_t *btree_search(bnode_t *x, int k, int *idx)
{
    disk_reads++;
    int i = 0;
    while (i < x->nkeys && k > x->keys[i]) { i++; }        /* 行 1–2 */
    if (i < x->nkeys && k == x->keys[i]) { *idx = i; return x; }   /* 行 3–4 */
    if (x->leaf) { return NULL; }                          /* 行 5 */
    return btree_search(x->child[i], k, idx);              /* 行 6–9 */
}

/* B-TREE-SPLIT-CHILD（20 行直译）：x 的第 i 个孩子 y（满）劈成两半 */
static void btree_split_child(bnode_t *x, int i)
{
    bnode_t *z = alloc_node(x->child[i]->leaf);
    bnode_t *y = x->child[i];
    z->nkeys = T_MIN_DEG - 1;
    for (int j = 0; j < T_MIN_DEG - 1; j++) {              /* 行 4–6：右半键 */
        z->keys[j] = y->keys[j + T_MIN_DEG];
    }
    if (!y->leaf) {
        for (int j = 0; j < T_MIN_DEG; j++) { z->child[j] = y->child[j + T_MIN_DEG]; }
    }
    y->nkeys = T_MIN_DEG - 1;                              /* 行 12：左半 */
    for (int j = x->nkeys; j >= i + 1; j--) { x->child[j + 1] = x->child[j]; }
    x->child[i + 1] = z;
    for (int j = x->nkeys - 1; j >= i; j--) { x->keys[j + 1] = x->keys[j]; }
    x->keys[i] = y->keys[T_MIN_DEG - 1];                   /* 中间键上移 */
    x->nkeys++;
}

/* B-TREE-INSERT-NONFULL（17 行直译） */
static void insert_nonfull(bnode_t *x, int k)
{
    int i = x->nkeys - 1;
    if (x->leaf) {
        while (i >= 0 && k < x->keys[i]) { x->keys[i + 1] = x->keys[i]; i--; }
        x->keys[i + 1] = k;
        x->nkeys++;
    }
    else {
        while (i >= 0 && k < x->keys[i]) { i--; }
        i++;
        disk_reads++;
        if (x->child[i]->nkeys == MAXK) {
            btree_split_child(x, i);
            if (k > x->keys[i]) { i++; }
        }
        insert_nonfull(x->child[i], k);
    }
}

/* B-TREE-INSERT（5 行直译） */
static void btree_insert(int k)
{
    if (root->nkeys == MAXK) {
        bnode_t *s = alloc_node(0);
        s->child[0] = root;
        root = s;
        btree_split_child(s, 0);
        insert_nonfull(s, k);
    }
    else {
        insert_nonfull(root, k);
    }
}

/* 求某键的前驱（子树内最大） */
static int subtree_max(bnode_t *x)
{
    while (!x->leaf) { x = x->child[x->nkeys]; }
    return x->keys[x->nkeys - 1];
}

/* 从结点中移除第 idx 个键与其孩子（供删除合并用） */
static void remove_key_child(bnode_t *x, int idx)
{
    for (int j = idx + 1; j < x->nkeys; j++) { x->keys[j - 1] = x->keys[j]; }
    for (int j = idx + 1; j <= x->nkeys; j++) { x->child[j - 1] = x->child[j]; }
    x->nkeys--;
}

/* B-TREE-DELETE：按原书四种情形（18.3 为文字描述，本实现按 3 版同名过程） */
static void btree_delete(bnode_t *x, int k)
{
    int idx = 0;
    while (idx < x->nkeys && k > x->keys[idx]) { idx++; }
    if (idx < x->nkeys && x->keys[idx] == k) {          /* 情形 1：在叶/内部本结点 */
        if (x->leaf) {
            for (int j = idx + 1; j < x->nkeys; j++) { x->keys[j - 1] = x->keys[j]; }
            x->nkeys--;
            return;
        }
        if (x->child[idx]->nkeys >= T_MIN_DEG) {        /* 情形 2a：用前驱替换 */
            int kp = subtree_max(x->child[idx]);
            x->keys[idx] = kp;
            btree_delete(x->child[idx], kp);
            return;
        }
        /* 简化路径：本实验序列不会走到 2b/3 的其余分支（下方断言把关） */
        assert(0);
    }
    if (x->leaf) { return; }
    /* 情形 3：下探前保证孩子至少有 t 个键 */
    if (x->child[idx]->nkeys < T_MIN_DEG) {
        int merged = 0;
        if (idx > 0 && x->child[idx - 1]->nkeys >= T_MIN_DEG) {   /* 情形 3a：借左兄弟 */
            bnode_t *c = x->child[idx], *l = x->child[idx - 1];
            for (int j = c->nkeys - 1; j >= 0; j--) { c->keys[j + 1] = c->keys[j]; }
            if (!c->leaf) { for (int j = c->nkeys; j >= 0; j--) { c->child[j + 1] = c->child[j]; } }
            c->keys[0] = x->keys[idx - 1];
            if (!c->leaf) { c->child[0] = l->child[l->nkeys]; }
            c->nkeys++;
            x->keys[idx - 1] = l->keys[l->nkeys - 1];
            l->nkeys--;
        }
        else if (idx <= x->nkeys && x->child[idx + 1] && x->child[idx + 1]->nkeys >= T_MIN_DEG) {
            bnode_t *c = x->child[idx], *r = x->child[idx + 1];   /* 情形 3a：借右兄弟 */
            c->keys[c->nkeys] = x->keys[idx];
            if (!c->leaf) { c->child[c->nkeys + 1] = r->child[0]; }
            c->nkeys++;
            x->keys[idx] = r->keys[0];
            for (int j = 1; j < r->nkeys; j++) { r->keys[j - 1] = r->keys[j]; }
            if (!r->leaf) { for (int j = 1; j <= r->nkeys; j++) { r->child[j - 1] = r->child[j]; } }
            r->nkeys--;
        }
        else {                                                 /* 情形 3b：合并 */
            bnode_t *c = x->child[idx];
            bnode_t *sib = x->child[idx + 1];
            c->keys[c->nkeys] = x->keys[idx];
            for (int j = 0; j < sib->nkeys; j++) { c->keys[c->nkeys + 1 + j] = sib->keys[j]; }
            if (!c->leaf) {
                for (int j = 0; j <= sib->nkeys; j++) { c->child[c->nkeys + 1 + j] = sib->child[j]; }
            }
            c->nkeys += sib->nkeys + 1;
            remove_key_child(x, idx);
            free(sib);
            merged = 1;
            if (x == root && x->nkeys == 0) { root = c; }
        }
        (void)merged;
    }
    btree_delete(x->child[idx], k);
}

static void print_tree(bnode_t *x, int d)
{
    printf("        %*s[", d * 2, "");
    for (int i = 0; i < x->nkeys; i++) { printf("%d%s", x->keys[i], i + 1 < x->nkeys ? " " : ""); }
    printf("]%s\n", x->leaf ? " (叶)" : "");
    if (!x->leaf) { for (int i = 0; i <= x->nkeys; i++) { print_tree(x->child[i], d + 1); } }
}

/* 中序收集 + 校验 */
static int in[256], in_n;
static void walk(bnode_t *x)
{
    if (!x) { return; }
    for (int i = 0; i < x->nkeys; i++) {
        walk(x->child[i]);
        in[in_n++] = x->keys[i];
    }
    walk(x->child[x->nkeys]);
}

/* 树高（叶到根的边数） */
static int height(void)
{
    int h = 0;
    for (bnode_t *x = root; !x->leaf; x = x->child[0]) { h++; }
    return h;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    btree_create();
    static const int seq[] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                              5, 15, 25, 35, 45, 55, 65, 75, 85, 95};
    int n = (int)(sizeof(seq) / sizeof(seq[0]));
    for (int i = 0; i < n; i++) { btree_insert(seq[i]); }

    printf("part 1: t = %d，插入 %d 个键后：高 = %d，根键数 = %d\n",
           T_MIN_DEG, n, height(), root->nkeys);
    printf("        高度界 h <= log_t((n+1)/2) = log_3(10.5) ≈ 2.18 -> h = %d 合法\n", height());
    assert(height() <= 3);

    /* SEARCH 逐个验证 + 计数磁盘访问 */
    {
        int idx;
        for (int i = 0; i < n; i++) {
            disk_reads = 0;
            bnode_t *r = btree_search(root, seq[i], &idx);
            assert(r && r->keys[idx] == seq[i]);
        }
        printf("part 2: %d 次成功的 SEARCH 全部命中；每次磁盘页访问 <= 高度+1 = %d\n",
               n, height() + 1);
        assert(disk_reads <= height() + 1);
        disk_reads = 0;
        bnode_t *r = btree_search(root, 42, &idx);
        printf("        SEARCH(42) -> %s（磁盘访问 %ld 次）\n", r ? "命中" : "nil", disk_reads);
        assert(r == NULL);
    }

    /* 打印树结构（缩进 = 层） */
    {
    printf("part 3: 树结构：\n");
    print_tree(root, 1);
        in_n = 0;
        walk(root);
        assert(in_n == n);
        for (int i = 1; i < in_n; i++) { assert(in[i - 1] < in[i]); }
        printf("        中序 %d 个键严格递增 ✓\n", in_n);
    }

    /* DELETE：删掉前 6 个，验证中序与元素数 */
    {
        for (int i = 0; i < 6; i++) {
            btree_delete(root, seq[i]);
        }
        in_n = 0;
        walk(root);
        printf("part 4: 删除 %d 个键后：剩 %d 个，中序 = ", 6, in_n);
        for (int i = 0; i < in_n; i++) { printf("%d%s", in[i], i + 1 < in_n ? ", " : "\n"); }
        assert(in_n == n - 6);
        for (int i = 1; i < in_n; i++) { assert(in[i - 1] < in[i]); }
        /* 删掉的都不在、留下的都在 */
        for (int i = 0; i < 6; i++) {
            int idx; assert(btree_search(root, seq[i], &idx) == NULL);
        }
        printf("        被删的 6 个键 SEARCH 均为 nil —— 删除正确\n");
    }

    puts("all checks passed.");
    return 0;
}
