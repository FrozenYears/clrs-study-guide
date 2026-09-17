/* order_statistics.c -- 17.1 动态顺序统计：OS-SELECT / OS-RANK。
 * 用普通 BST 演示 size 域的维护与两个查询（平衡性由红黑树保证，本程序聚焦"扩张"本身）。
 * 关键数字：OS-SELECT / OS-RANK 的递归/循环都沿树下降一层 -> O(h)；
 *           rank(os_select(k)) == k 往返一致（C 程序逐个验证）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NN 32

typedef struct node {
    int key;
    int size;                 /* ★ 扩张的属性：以本结点为根的子树结点数 */
    struct node *left, *right, *p;
} node_t;

static node_t pool[NN];
static int pool_n;
static node_t *root;

/* BST 插入（简化：不含旋转；size 由 step 2 维护） */
static node_t *bst_insert(int key)
{
    node_t *y = NULL, *x = root;
    while (x) { y = x; x = (key < x->key) ? x->left : x->right; }
    node_t *z = &pool[pool_n++];
    memset(z, 0, sizeof(*z));
    z->key = key; z->size = 1; z->p = y;
    if (!y) { root = z; }
    else if (key < y->key) { y->left = z; }
    else { y->right = z; }
    /* 步骤 4：沿祖先链更新 size —— O(h) */
    node_t *a = z->p;
    while (a) { a->size++; a = a->p; }
    return z;
}

/* OS-SELECT（6 行直译）：返回以 x 为根的子树中第 i 小的结点 */
static node_t *os_select(node_t *x, int i)
{
    int r = (x->left ? x->left->size : 0) + 1;      /* 行 1 */
    if (i == r) { return x; }                        /* 行 2–3 */
    else if (i < r) { return os_select(x->left, i); }/* 行 4–5 */
    else { return os_select(x->right, i - r); }      /* 行 6 */
}

/* OS-RANK（7 行直译）：返回 x 在整棵树中的秩 */
static int os_rank(node_t *x)
{
    int r = (x->left ? x->left->size : 0) + 1;       /* 行 1 */
    node_t *y = x;                                   /* 行 2 */
    while (y != root) {                              /* 行 3 */
        if (y == y->p->right) {                      /* 行 4 */
            r += (y->p->left ? y->p->left->size : 0) + 1;   /* 行 5 */
        }
        y = y->p;                                    /* 行 6 */
    }
    return r;                                        /* 行 7 */
}

/* 验证：size 属性 = 1 + 左 size + 右 size（递归） */
static int check_size(node_t *x)
{
    if (!x) { return 0; }
    int ls = check_size(x->left);
    int rs = check_size(x->right);
    assert(x->size == 1 + ls + rs);
    return x->size;
}

/* 中序收集（用于对照） */
static int inorder[NN], in_n;
static void walk(node_t *x)
{
    if (!x) { return; }
    walk(x->left);
    inorder[in_n++] = x->key;
    walk(x->right);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 建树：按层序给出的键，得到一棵平衡 BST（对应 Figure 17.1 的键集） */
    static const int keys[] = {26, 38, 30, 41, 20, 35, 43};
    int n = (int)(sizeof(keys) / sizeof(keys[0]));
    node_t *nodes[NN];
    for (int i = 0; i < n; i++) { nodes[i] = bst_insert(keys[i]); }

    printf("part 1: 插入 %d 个键后，根的 size = %d（应为 %d）\n", n, root->size, n);
    assert(root->size == n);
    assert(check_size(root) == n);
    printf("        递归校验：每个结点 size == 1 + left.size + right.size ✓\n");

    in_n = 0;
    walk(root);
    printf("part 2: 中序 = ");
    for (int i = 0; i < in_n; i++) { printf("%d%s", inorder[i], i + 1 < in_n ? ", " : "\n"); }

    /* OS-SELECT：第 k 小 */
    printf("part 3: OS-SELECT 逐个取第 k 小：");
    for (int k = 1; k <= n; k++) {
        node_t *x = os_select(root, k);
        printf("%d%s", x->key, k < n ? ", " : "\n");
        assert(x->key == inorder[k - 1]);
    }
    printf("        与中序逐位一致 —— OS-SELECT 正确\n");

    /* OS-RANK：往返一致 rank(os_select(k)) == k */
    printf("part 4: OS-RANK 往返验证：");
    for (int k = 1; k <= n; k++) {
        node_t *x = os_select(root, k);
        int r = os_rank(x);
        printf("%d%s", r, k < n ? ", " : "\n");
        assert(r == k);
    }
    printf("        rank(os_select(k)) == k 对全部 k 成立\n");

    /* 单步演示：OS-RANK(nodes[35]) 沿祖先链的三步（对应原书 p.484 的手工过程） */
    {
        node_t *x = nodes[5];            /* key 35 */
        int r = os_rank(x);
        printf("part 5: OS-RANK(key=35) = %d（20,26,30 之后第 4 小；沿祖先链累加左侧子树贡献）\n", r);
        assert(r == 4);
        printf("        途中每个 y==y.p.right 的步子把 y.p 的左子树 size + 1 加进 r。\n");
    }

    puts("all checks passed.");
    return 0;
}
