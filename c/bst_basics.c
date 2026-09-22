/* bst_basics.c -- 12.1 节：BST 的定义、中序遍历与访问计数。
 *   ① 用插入法构建原书 Figure 12.1(a) 的树（key 集合 {2,5,5,6,7,8}，含重复 key 5）；
 *   ② 中序遍历输出升序（Theorem 12.1 的前提）；
 *   ③ 访问计数证明 Θ(n)：每个节点恰好被"进入"常数次；
 *   ④ 对照：升序插入同一组 key → 退化成链（呼应 12.3 末尾与第 13 章）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bst_basics bst_basics.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 32

typedef struct node {
    int key;
    struct node *left, *right, *p;
} node_t;

static node_t pool[MAXN];
static int pool_used;
static long visits;                     /* INORDER-TREE-WALK 的节点访问计数 */

static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

/* TREE-INSERT 的核心（12.3 才正式给出，这里先用） */
static node_t *insert(node_t *root, int key)
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x != NULL) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (y == NULL) { return z; }
    if (key < y->key) { y->left = z; } else { y->right = z; }
    return root;
}

/* INORDER-TREE-WALK（4 行的直译）+ 访问计数 */
static void inorder(node_t *x, int *out, int *n)
{
    visits++;                           /* 进入一次 = 一次节点访问 */
    if (x == NULL) { return; }          /* 行 1：x ≠ NIL 才继续 */
    inorder(x->left, out, n);           /* 行 2 */
    out[(*n)++] = x->key;               /* 行 3：print x.key */
    inorder(x->right, out, n);          /* 行 4 */
}

/* 校验 BST 性质：左子树全 ≤ x.key ≤ 右子树全（对每个节点递归成立） */
static int check_bst(const node_t *x, const node_t *lo, const node_t *hi)
{
    if (x == NULL) { return 1; }
    if (lo && x->key < lo->key) { return 0; }
    if (hi && x->key > hi->key) { return 0; }
    return check_bst(x->left, lo, x) && check_bst(x->right, x, hi);
}

/* 高度按 CLRS 定义 = 到叶的最长路径的【边数】（空树 −1，单节点 0）。
 * 原书 Figure 12.1(a) 说 "height 2"：3 层的树 = 2 条边。 */
static int height(const node_t *x)
{
    if (!x) { return -1; }
    int l = height(x->left), r = height(x->right);
    return 1 + (l > r ? l : r);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);   /* 崩溃时也不丢输出 */
    /* ① Figure 12.1(a)：插入 6,5,7,2,8,5 → 高 2 的树（含重复 key 5） */
    node_t *root = NULL;
    int order[6] = {6, 5, 7, 2, 8, 5};
    for (int i = 0; i < 6; i++) { root = insert(root, order[i]); }
    assert(root->key == 6);
    assert(root->left->key == 5 && root->right->key == 7);
    assert(root->left->left->key == 2 && root->left->right->key == 5);
    assert(root->right->right->key == 8);
    assert(height(root) == 2);
    printf("part 1: 插入 6,5,7,2,8,5 → 根 6、左子树 {2,5,5}、右子树 {7,8}，高 %d（Figure 12.1(a) 的形态）\n",
           height(root));

    /* ② 中序遍历：升序（含重复 key） */
    int out[MAXN], n = 0;
    visits = 0;
    inorder(root, out, &n);
    assert(n == 6);
    int expected[6] = {2, 5, 5, 6, 7, 8};
    for (int i = 0; i < 6; i++) { assert(out[i] == expected[i]); }
    printf("part 2: 中序遍历 = 2,5,5,6,7,8（升序，与原书 Figure 12.1 的例子一致）\n");
    assert(check_bst(root, NULL, NULL));
    printf("part 3: BST 性质逐节点校验通过（含重复 key 5 的两个位置都合法）\n");

    /* ③ Theorem 12.1：访问计数 = Θ(n)。空子树也计入（对应 T(0) = c） */
    {
        /* 6 个节点 + 7 个空指针 = 13 次进入（每节点 2 子 + 根补 1） */
        printf("part 4: 6 节点的树，INORDER-TREE-WALK 进入 %ld 次（节点 6 + 空子树 7 = 2n+1，Θ(n)）\n", visits);
        assert(visits == 2 * 6 + 1);
    }

    /* ④ 对照：升序插入退化成链 */
    {
        pool_used = 0;
        node_t *chain = NULL;
        int keys[6] = {2, 5, 5, 6, 7, 8};
        for (int i = 0; i < 6; i++) { chain = insert(chain, keys[i]); }
        assert(height(chain) == 5);     /* 6 个节点的链高 5 = n−1 */
        printf("part 5: 升序插入同一组 key → 高 %d = n−1（线性链）—— 同一组 key，两种形态\n", height(chain));
    }

    puts("all checks passed.");
    return 0;
}
