/* bst_delete.c -- 12.3 节：TREE-INSERT / TRANSPLANT / TREE-DELETE 与三种删除情况。
 * 树 = Figure 12.2 的形态（插入 15,6,18,3,7,17,20,2,4,13,11，高 4）。
 *   ① TRANSPLANT 的两个边界（u 是根 / v 为 NIL）；
 *   ② 三种删除：叶、单孩子、两孩子（y 是/不是 z.right 两种）；
 *   ③ 每次删除后中序仍升序、剩余元素不丢。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bst_delete bst_delete.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 32

typedef struct node { int key; struct node *left, *right, *p; } node_t;

static node_t pool[MAXN];
static int pool_used;

static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

static node_t *insert(node_t *root, int key)   /* TREE-INSERT（13 行的浓缩） */
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x != NULL) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (y == NULL) { return z; }
    if (key < y->key) { y->left = z; } else { y->right = z; }
    return root;
}

/* TRANSPLANT(T, u, v)：用子树 v 替换子树 u（7 行）—— 不动 v 的左右孩子！ */
static void transplant(node_t **root, node_t *u, node_t *v)
{
    if (u->p == NULL) { *root = v; }               /* 行 1–2：u 是根 */
    else if (u == u->p->left) { u->p->left = v; }  /* 行 3–4：u 是左孩子 */
    else { u->p->right = v; }                      /* 行 5：u 是右孩子 */
    if (v != NULL) { v->p = u->p; }                /* 行 6–7：★ v 为 NIL 也要走 */
}

static node_t *tree_minimum(node_t *x)
{
    while (x->left != NULL) { x = x->left; }
    return x;
}

/* TREE-DELETE（12 行） */
static void tree_delete(node_t **root, node_t *z)
{
    if (z->left == NULL) { transplant(root, z, z->right); }        /* 情形 1：无左孩子 */
    else if (z->right == NULL) { transplant(root, z, z->left); }   /* 情形 2：无右孩子 */
    else {
        node_t *y = tree_minimum(z->right);                        /* 情形 3：后继 y */
        if (y->p != z) {
            transplant(root, y, y->right);                         /* y 让出自己的右孩子 */
            y->right = z->right; y->right->p = y;
        }
        transplant(root, z, y);                                    /* y 顶替 z */
        y->left = z->left; y->left->p = y;
    }
}

static void inorder(const node_t *x, int *out, int *n)
{
    if (!x) { return; }
    inorder(x->left, out, n);
    out[(*n)++] = x->key;
    inorder(x->right, out, n);
}

static int check_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] >= a[i]) { return 0; } }
    return 1;
}

int main(void)
{
    /* ① 构建 Figure 12.2 的树 */
    node_t *root = NULL;
    int keys[11] = {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11};
    for (int i = 0; i < 11; i++) { root = insert(root, keys[i]); }
    int out[MAXN], n = 0;
    inorder(root, out, &n);
    assert(n == 11 && check_sorted(out, n));
    printf("part 1: Figure 12.2 的树建好（11 个 key，中序升序）\n");

    /* ② 情形 1+2：删除叶（13 有左孩子 11？13 有孩子 → 删 2） */
    {
        node_t *z = root->left->left->left;      /* 2（叶） */
        assert(z->key == 2);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 10 && check_sorted(out, n));
        printf("part 2: 删除叶 2（情形 1：无左孩子，右孩子 NIL）→ 中序仍升序，剩 %d 个\n", n);
    }

    /* ③ 情形 1（有右孩子）：删除叶之后的 3？3 只剩右孩子 4 */
    {
        node_t *z = root->left->left;            /* 3（只有右孩子 4） */
        assert(z->key == 3 && z->left == NULL);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 9 && check_sorted(out, n));
        assert(root->left->left->key == 4);      /* 4 顶替 3 */
        printf("part 3: 删除单孩子节点 3 → 4 顶替（TRANSPLANT 边界：v 非空才设 v.p）\n");
    }

    /* ④ 情形 3：删除有两个孩子的节点（两孩子且后继 ≠ 右孩子） */
    {
        node_t *z = root;                        /* 删除根 15（两个孩子 6、18） */
        assert(z->key == 15);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 8 && check_sorted(out, n));
        printf("part 4: 删除两孩子节点 15 → 后继 17 顶替（y ≠ z.right 的完整版）\n");
        assert(root->key == 17);                 /* 17 成为新根 */
    }

    /* ⑤ 情形 3 简版：y 就是 z.right */
    {
        /* 删 18（孩子 20）→ 20 顶替；再删 20？先删 6（孩子 7、11/13/4 子树）*/
        node_t *z = root->right;                 /* 18（只剩右孩子 20） */
        assert(z->key == 18);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 7 && check_sorted(out, n));
        printf("part 5: 删除 18 → 20 顶替（y == z.right 的简版，无需挪 y 的右孩子）\n");
    }

    /* ⑥ 全部删光（含删除根直到树空 —— TRANSPLANT 的 v = NIL 边界） */
    {
        int remaining[7];
        n = 0; inorder(root, remaining, &n);
        for (int i = 0; i < n; i++) {
            /* 找到当前树里的该节点并删除 */
            node_t *z = root;
            while (z != NULL && z->key != remaining[i]) {
                z = remaining[i] < z->key ? z->left : z->right;
            }
        tree_delete(&root, z);
            int tmp[MAXN], m = 0;
            inorder(root, tmp, &m);
            assert(m == n - i - 1 && check_sorted(tmp, m));   /* 每删一个都保持升序 */
        }
        assert(root == NULL);
        printf("part 6: 把剩下的 7 个全删光（每一步都验过中序）→ 最后 root = NIL"
               "（TRANSPLANT 的 v = NIL 边界）\n");
    }

    puts("all checks passed.");
    return 0;
}
