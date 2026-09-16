/* tree_rep.c -- 10.3 节：有根树三种表示法的实现与代价验证。
 *   ① 二叉树的 p / left / right 表示；
 *   ② left-child / right-sibling 表示（任意多叉树，每节点 3 个指针，O(n) 空间）；
 *   ③ 对照：child1..childk 的 k 叉表示（k 个指针/节点，空间 k·n，k 大时浪费）；
 *   ④ 章末问题 10-3 的数组链表（key[] / next[]）搜索。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o tree_rep tree_rep.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

/* ---------------- ① 二叉树：p / left / right ---------------- */
typedef struct bnode {
    int key;
    struct bnode *p, *left, *right;
} bnode_t;

static bnode_t bpool[16];
static int bpool_used;

static bnode_t *bnew(int key)
{
    bnode_t *n = &bpool[bpool_used++];
    n->key = key; n->p = n->left = n->right = NULL;
    return n;
}

static void bset_left(bnode_t *parent, bnode_t *child)
{
    parent->left = child;
    if (child) { child->p = parent; }        /* ★ 父指针由子节点维护 */
}

static void bset_right(bnode_t *parent, bnode_t *child)
{
    parent->right = child;
    if (child) { child->p = parent; }
}

/* 中序遍历（递归版，第 12 章会展开成迭代版） */
static void inorder(const bnode_t *x, int *out, int *n)
{
    if (x == NULL) { return; }
    inorder(x->left, out, n);
    out[(*n)++] = x->key;
    inorder(x->right, out, n);
}

static int bheight(const bnode_t *x)
{
    if (x == NULL) { return 0; }
    int l = bheight(x->left), r = bheight(x->right);
    return 1 + (l > r ? l : r);
}

/* ---------------- ② left-child / right-sibling ---------------- */
typedef struct gnode {
    int key;
    struct gnode *p, *left_child, *right_sibling;
} gnode_t;

static gnode_t gpool[16];
static int gpool_used;

static gnode_t *gnew(int key)
{
    gnode_t *n = &gpool[gpool_used++];
    n->key = key; n->p = n->left_child = n->right_sibling = NULL;
    return n;
}

/* 把 child 挂到 parent 的孩子链尾部（演示"通过孩子链访问全部孩子"） */
static void gadd_child(gnode_t *parent, gnode_t *child)
{
    child->p = parent;
    child->right_sibling = NULL;
    if (parent->left_child == NULL) { parent->left_child = child; return; }
    gnode_t *c = parent->left_child;
    while (c->right_sibling != NULL) { c = c->right_sibling; }
    c->right_sibling = child;
}

static int gcount_children(const gnode_t *x)
{
    int n = 0;
    for (const gnode_t *c = x->left_child; c != NULL; c = c->right_sibling) { n++; }
    return n;
}

static int gcount_all(const gnode_t *x)
{
    int n = 1;
    for (const gnode_t *c = x->left_child; c != NULL; c = c->right_sibling) {
        n += gcount_all(c);
    }
    return n;
}

int main(void)
{
    /* ① 二叉树：指针域的设置与遍历 */
    {
        /* 树形：root(12) 左 15；15 左 4、右 10；4 左 7、右 9；10 左 6 */
        bnode_t *r = bnew(12);
        bset_left(r, bnew(15));
        bset_right(r->left, bnew(10));
        bset_left(r->left, bnew(4));
        bset_left(r->left->left, bnew(7));
        bset_right(r->left->left, bnew(9));
        bset_left(r->left->right, bnew(6));

        assert(r->p == NULL);                        /* 根：p = NIL */
        assert(r->left->p == r);
        assert(r->left->right->p == r->left);
        assert(r->left->left->right->key == 9 && r->left->left->right->left == NULL);

        int out[16], n = 0;
        inorder(r, out, &n);
        assert(n == 7);
        printf("part 1: 二叉树中序 = ");
        for (int i = 0; i < n; i++) { printf("%d%s", out[i], i + 1 < n ? "," : ""); }
        printf("（高度 %d；根 p = NIL，叶的 left/right = NIL）\n", bheight(r));
        /* 中序：7,4,9,15,6,10,12 → 验证 */
        assert(out[0] == 7 && out[1] == 4 && out[2] == 9 && out[3] == 15);
    }

    /* ② left-child / right-sibling：任意多叉树、每节点 3 个指针 */
    {
        gnode_t *r = gnew(1);
        gadd_child(r, gnew(2));
        gadd_child(r, gnew(3));
        gadd_child(r, gnew(4));
        gadd_child(r->left_child, gnew(5));          /* 2 的孩子 */
        gadd_child(r->left_child, gnew(6));
        gadd_child(r->left_child->right_sibling, gnew(7));   /* 3 的孩子 */

        assert(r->p == NULL);
        assert(r->left_child->key == 2);             /* 最左孩子 */
        assert(r->left_child->right_sibling->key == 3);
        assert(r->left_child->right_sibling->right_sibling->key == 4);
        assert(r->left_child->right_sibling->right_sibling->right_sibling == NULL);  /* 最右孩子的 rs = NIL */
        assert(gcount_children(r) == 3);
        printf("part 2: left-child/right-sibling：根有 %d 个孩子，访问它们耗时线性于孩子数\n",
               gcount_children(r));
        assert(gcount_all(r) == 7);
        printf("part 3: 全树 %d 个节点，每节点固定 3 个指针 → 空间 O(n)（与孩子的总数目无关）\n",
               gcount_all(r));

        /* 父指针 O(1)：任取一个节点，向上走到根 */
        /* 节点 6 的路径：根(1) → 左孩子(2) → 左孩子(5) → 右兄弟(6) */
        gnode_t *x = r->left_child->left_child->right_sibling;
        assert(x->key == 6);
        int steps = 0;
        for (gnode_t *y = x; y != NULL; y = y->p) { steps++; }   /* 数沿途节点：6 → 2 → 1 */
        assert(steps == 3);
        printf("part 4: 节点 6 沿 p 指针上溯到根经过 %d 个节点（6 → 2 → 1，每步 O(1)）\n", steps);
    }

    /* ③ 对照：k 叉表示的空间 */
    {
        int n = 1000;
        for (int k = 2; k <= 8; k *= 2) {
            long ptrs = (long)k * n;
            printf("part 5: k = %d 的 child1..childk 表示：%d 个节点要预留 %ld 个指针域" 
                   "（实际可能有大量 NIL）\n", k, n, ptrs);
        }
        printf("        left-child/right-sibling：恒为 3n = %d 个指针域（与 k 无关）\n", 3 * n);
    }

    /* ④ 问题 10-3：数组表示的链表（key[] / next[]）搜索 */
    {
        int key[6] = {0, 10, 20, 30, 40, 50};   /* 下标 1..5 */
        int nxt[6] = {0, 2, 3, 4, 5, 0};        /* next[i] = 0 表示 NIL */
        int head = 1;
        int k = 30, i = head, cmps = 0;
        while (i != 0 && key[i] < k) { cmps++; i = nxt[i]; }   /* 第 2 行：沿 next 走 */
        cmps++;                                                 /* 最后一次比较（fall off 或 >= k） */
        bool found = (i != 0 && key[i] == k);
        printf("part 6: 数组链表搜索 30：比较 %d 次，%s（下标 %d）—— 普通搜索 Θ(n)\n",
               cmps, found ? "命中" : "未命中", i);
        assert(found && i == 3);

        /* 紧凑性：n 个元素只占位置 1..n（问题 10-3 的"compact"前提） */
        int occupied = 0;
        for (i = head; i != 0; i = nxt[i]) { occupied++; }
        printf("part 7: 5 个元素只占用下标 1..%d（compact 链表）—— 任何 j ∈ [1,n] 都索引到一个元素，"
               "这是随机跳跃能生效的前提\n", occupied);
    }

    puts("all checks passed.");
    return 0;
}
