/* bst_query.c -- 12.2 节：BST 查询操作全家族的实现与 O(h) 实测。
 * 树 = 原书 Figure 12.2 的形态：插入顺序 15,6,18,3,7,17,20,2,4,13,11。
 *   ① TREE-SEARCH（递归）与 ITERATIVE-TREE-SEARCH 等价；
 *   ② TREE-MINIMUM / TREE-MAXIMUM（一路向左 / 向右）；
 *   ③ TREE-SUCCESSOR 的两种情况（Figure 12.2(d)：13 的后继是 15）；
 *   ④ 定理实测：全部查询的比较次数 ≤ h + 1（O(h)）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bst_query bst_query.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 32

typedef struct node { int key; struct node *left, *right, *p; } node_t;

static node_t pool[MAXN];
static int pool_used;
static long cmps;                       /* 比较计数（查询代价的度量） */

static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

static node_t *insert(node_t *root, int key)
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x != NULL) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (y == NULL) { return z; }
    if (key < y->key) { y->left = z; } else { y->right = z; }
    return root;
}

/* TREE-SEARCH（递归，5 行） */
static node_t *tree_search(node_t *x, int k)
{
    cmps++;
    if (x == NULL || k == x->key) { return x; }
    if (k < x->key) { return tree_search(x->left, k); }
    return tree_search(x->right, k);
}

/* ITERATIVE-TREE-SEARCH（5 行） */
static node_t *iter_search(node_t *x, int k)
{
    while (x != NULL && k != x->key) {
        cmps++;
        x = k < x->key ? x->left : x->right;
    }
    if (x != NULL) { cmps++; }      /* 命中的那次比较也要计（与递归版同语义） */
    return x;
}

/* TREE-MINIMUM（3 行） */
static node_t *tree_minimum(node_t *x)
{
    while (x->left != NULL) { cmps++; x = x->left; }
    return x;
}

/* TREE-MAXIMUM（3 行） */
static node_t *tree_maximum(node_t *x)
{
    while (x->right != NULL) { cmps++; x = x->right; }
    return x;
}

/* TREE-SUCCESSOR（8 行） */
static node_t *tree_successor(node_t *x)
{
    if (x->right != NULL) { return tree_minimum(x->right); }   /* 情形 1 */
    node_t *y = x->p;                                          /* 情形 2：向上 */
    while (y != NULL && x == y->right) { cmps++; x = y; y = y->p; }
    return y;
}

static int height(const node_t *x)   /* CLRS：边数 */
{
    if (!x) { return -1; }
    int l = height(x->left), r = height(x->right);
    return 1 + (l > r ? l : r);
}

int main(void)
{
    /* ① Figure 12.2 的树 */
    node_t *root = NULL;
    int keys[11] = {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11};
    for (int i = 0; i < 11; i++) { root = insert(root, keys[i]); }
    int h = height(root);
    assert(root->key == 15 && root->left->key == 6 && root->right->key == 18);
    assert(root->left->right->key == 7 && root->left->right->right->key == 13);
    assert(root->left->right->right->left->key == 11);
    printf("part 1: Figure 12.2 的树（插入 15,6,18,3,7,17,20,2,4,13,11）高 %d（边数）\n", h);

    /* ② SEARCH：递归与迭代等价 */
    cmps = 0;
    node_t *f = tree_search(root, 13);
    long rec = cmps;
    cmps = 0;
    node_t *g = iter_search(root, 13);
    assert(f == g && f != NULL && rec == cmps);
    printf("part 2: 查找 13：递归与迭代都走同一条路径，比较 %ld 次；查找 5 返回 NIL\n", rec);
    cmps = 0;
    assert(iter_search(root, 5) == NULL);
    printf("part 3: 查找不存在的 5：%ld 次比较后落到 NIL（仍 ≤ h + 1）\n", cmps);

    /* ③ MINIMUM / MAXIMUM */
    cmps = 0;
    node_t *mn = tree_minimum(root);
    long cmn = cmps;
    cmps = 0;
    node_t *mx = tree_maximum(root);
    printf("part 4: 最小 = %d（%ld 次步进，一路向左）、最大 = %d（一路向右）\n",
           mn->key, cmn, mx->key);
    assert(mn->key == 2 && mx->key == 20);

    /* ④ SUCCESSOR 两种情况（Figure 12.2(d)） */
    cmps = 0;
    node_t *s13 = tree_successor(tree_search(root, 13));
    printf("part 5: SUCCESSOR(13) = %d（情形 2：13 无右孩子，向上找第一个拐向左的祖先）\n", s13->key);
    assert(s13->key == 15);
    node_t *s15 = tree_successor(tree_search(root, 15));
    printf("part 6: SUCCESSOR(15) = %d（情形 1：右子树的最小节点）\n", s15->key);
    assert(s15->key == 17);
    node_t *s20 = tree_successor(tree_search(root, 20));
    assert(s20 == NULL);
    printf("part 7: SUCCESSOR(20) = NIL（20 是最大元，没有后继）\n");

    /* ⑤ 定理实测：所有查询的比较次数 ≤ h + 1 */
    {
        long worst = 0;
        for (int i = 0; i < 11; i++) {
            cmps = 0;
            (void)iter_search(root, keys[i]);
            if (cmps > worst) { worst = cmps; }
        }
        printf("part 8: 11 次（成功）查找的最大比较 = %ld ≤ h + 1 = %d —— O(h) 实测\n", worst, h + 1);
        assert(worst <= h + 1);
    }

    /* ⑥ 习题 12.2-7：用 n 次 SUCCESSOR 走完整棵树（总代价 Θ(n) 摊还） */
    {
        long total = 0;
        node_t *x = tree_minimum(root);
        int cnt = 0;
        while (x != NULL) {
            cmps = 0;
            cnt++;
            node_t *nxt = tree_successor(x);
            total += cmps + 1;
            x = nxt;
        }
        assert(cnt == 11);
        printf("part 9: 习题 12.2-7：从最小元出发调用 %d 次 SUCCESSOR 走完全树，总代价 %ld（Θ(n) 摊还）\n",
               cnt, total);
    }

    puts("all checks passed.");
    return 0;
}
