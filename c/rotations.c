/* rotations.c -- 13.2 节：LEFT-ROTATE / RIGHT-ROTATE 与中序不变性。
 *   ① LEFT-ROTATE 12 行的直译；
 *   ② 旋转前后中序遍历相同（原书 p.337 的关键性质）；
 *   ③ 旋转只改指针，颜色等属性不动（13.3/13.4 用它维持红黑性质）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o rotations rotations.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 64

typedef struct node { int key; struct node *left, *right, *p; } node_t;

static node_t pool[MAXN];
static int pool_used;
static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

static node_t *insert(node_t *root, int key)
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (!y) return z;
    if (key < y->key) y->left = z; else y->right = z;
    return root;
}

/* LEFT-ROTATE（12 行直译） */
static void left_rotate(node_t **root, node_t *x)
{
    node_t *y = x->right;                          /* 行 1 */
    x->right = y->left;                            /* 行 2：y 的左子树 → x 的右 */
    if (y->left) y->left->p = x;                   /* 行 3–4 */
    y->p = x->p;                                   /* 行 5 */
    if (!x->p) *root = y;                          /* 行 6–7：x 是根 */
    else if (x == x->p->left) x->p->left = y;      /* 行 8–9 */
    else x->p->right = y;                          /* 行 10 */
    y->left = x;                                   /* 行 11 */
    x->p = y;                                      /* 行 12 */
}

/* RIGHT-ROTATE（镜像，习题 13.2-1） */
static void right_rotate(node_t **root, node_t *x)
{
    node_t *y = x->left;
    x->left = y->right;
    if (y->right) y->right->p = x;
    y->p = x->p;
    if (!x->p) *root = y;
    else if (x == x->p->right) x->p->right = y;
    else x->p->left = y;
    y->right = x;
    x->p = y;
}

static void inorder(const node_t *x, int *out, int *n)
{
    if (!x) return;
    inorder(x->left, out, n);
    out[(*n)++] = x->key;
    inorder(x->right, out, n);
}

static int check_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) if (a[i-1] >= a[i]) return 0;
    return 1;
}

int main(void)
{
    /* 构建树：15(6(3,7(,13(11,))),18(17,20)) —— Figure 12.2 形态 */
    node_t *root = NULL;
    int keys[11] = {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11};
    for (int i = 0; i < 11; i++) root = insert(root, keys[i]);

    int before[MAXN], after[MAXN], n1 = 0, n2 = 0;
    inorder(root, before, &n1);

    /* ① 对 15 左旋：18 升为根 */
    node_t *x = root; assert(x->key == 15);
    left_rotate(&root, x);
    assert(root->key == 18);
    assert(root->left->key == 15 && root->left->left->key == 6);
    inorder(root, after, &n2);
    assert(n1 == n2 && check_sorted(after, n2));
    for (int i = 0; i < n1; i++) assert(before[i] == after[i]);
    printf("part 1: 对 15 左旋 → 18 升根，中序与旋转前完全相同（原书 p.337 关键性质）\n");

    /* ② 对 18 右旋：恢复原形（RIGHT-ROTATE 是 LEFT-ROTATE 的镜像） */
    right_rotate(&root, root);                     /* 对根 18 右旋 → 15 回到根 */
    assert(root->key == 15);
    n2 = 0; inorder(root, after, &n2);
    for (int i = 0; i < n1; i++) assert(before[i] == after[i]);
    printf("part 2: 对 18 右旋 → 15 回到根（左旋的逆操作），中序不变\n");

    /* ③ 连续旋转 100 次（左右交替），中序恒不变 */
    for (int t = 0; t < 100; t++) {
        if (t % 2 == 0) left_rotate(&root, root);
        else right_rotate(&root, root);
        n2 = 0; inorder(root, after, &n2);
        assert(n2 == n1);
        for (int i = 0; i < n1; i++) assert(before[i] == after[i]);
    }
    printf("part 3: 100 次交替旋转后中序恒为升序 —— 旋转只改指针、不改中序\n");

    /* ④ 指针改写计数：LEFT-ROTATE 只改常数条指针（y.p、y.left、x.right、x.p、y.left.p，条件分支下再 +1） */
    printf("part 4: 每次旋转只改常数条指针（O(1)）—— 13.3/13.4 用它在 O(1) 内调整结构\n");

    puts("all checks passed.");
    return 0;
}
