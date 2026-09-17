/* interval_tree.c -- 17.3 区间树：以 low 为键、维护 max 域，INTERVAL-SEARCH。
 * 关键数字：max(x) = max(x.high, left.max, right.max)（递归校验）；
 *           对 9 个区间做枚举查询：有重叠必命中、无重叠必返回 nil（与暴力对照一致）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NN 16

typedef struct {
    int low, high;            /* 区间 [low, high]（闭区间） */
} interval_t;

typedef struct node {
    interval_t it;
    int max;                  /* ★ 扩张属性：子树中所有区间的最大右端点 */
    struct node *left, *right, *p;
} node_t;

static node_t pool[NN];
static int pool_n;
static node_t *root;

static void update_max(node_t *x)
{
    int m = x->it.high;
    if (x->left && x->left->max > m) { m = x->left->max; }
    if (x->right && x->right->max > m) { m = x->right->max; }
    x->max = m;
}

static node_t *it_insert(interval_t iv)
{
    node_t *y = NULL, *x = root;
    while (x) { y = x; x = (iv.low < x->it.low) ? x->left : x->right; }
    node_t *z = &pool[pool_n++];
    memset(z, 0, sizeof(*z));
    z->it = iv; z->max = iv.high; z->left = z->right = NULL; z->p = y;
    if (!y) { root = z; }
    else if (iv.low < y->it.low) { y->left = z; }
    else { y->right = z; }
    node_t *a = z;
    while (a) { update_max(a); a = a->p; }    /* 沿祖先链更新 max —— O(h) */
    return z;
}

static int overlaps(interval_t a, interval_t b)
{
    return a.low <= b.high && b.low <= a.high;
}

/* INTERVAL-SEARCH（6 行直译） */
static node_t *interval_search(interval_t i)
{
    node_t *x = root;
    while (x && !overlaps(i, x->it)) {
        if (x->left && x->left->max >= i.low) {
            x = x->left;                 /* 左子树里有潜在重叠 */
        }
        else { x = x->right; }           /* 左子树不可能重叠 */
    }
    return x;
}

/* 递归校验 max 不变量 */
static int check_max(node_t *x)
{
    if (!x) { return 0; }
    int lm = check_max(x->left);
    int rm = check_max(x->right);
    int expect = x->it.high;
    if (lm > expect) { expect = lm; }
    if (rm > expect) { expect = rm; }
    assert(x->max == expect);
    return x->max;
}

/* 暴力对照：是否存在任何区间与 i 重叠 */
static int brute_overlaps(interval_t i, const interval_t *ivs, int n)
{
    for (int j = 0; j < n; j++) {
        if (overlaps(i, ivs[j])) { return 1; }
    }
    return 0;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* Figure 17.4 的 9 个区间 */
    static const interval_t ivs[NN] = {
        {0, 3}, {5, 8}, {6, 10}, {8, 9}, {15, 23},
        {16, 21}, {17, 19}, {19, 20}, {25, 30},
    };
    int n = 9;
    for (int j = 0; j < n; j++) { it_insert(ivs[j]); }

    printf("part 1: 插入 %d 个区间后，max 不变量：", n);
    assert(check_max(root) == 30);
    printf("根.max = %d（= 30，[25,30] 的右端点）✓\n", root->max);

    printf("part 2: 中序（按 low 排序）：");
    {
        node_t *stk[NN]; int sp = 0, cnt = 0;
        node_t *x = root;
        while (x || sp) {
            while (x) { stk[sp++] = x; x = x->left; }
            x = stk[--sp];
            printf("[%d,%d] ", x->it.low, x->it.high);
            cnt++;
            x = x->right;
        }
        printf("（%d 个）\n", cnt);
        assert(cnt == n);
    }

    /* part 3：单步查询 */
    {
        interval_t q = {14, 14};
        node_t *r = interval_search(q);
        printf("part 3: 查询 [14,14] -> %s", r ? "" : "nil\n");
        if (r) {
            printf("[%d,%d]\n", r->it.low, r->it.high);
            assert(overlaps(q, r->it));
        }
        assert(r == NULL);   /* [14,14] 与 9 个区间都不相交 */
        printf("        [14,14] 与任何区间都不相交 -> 正确返回 nil\n");
    }
    {
        interval_t q = {9, 11};
        node_t *r = interval_search(q);
        printf("        查询 [9,11] -> ");
        if (r) {
            printf("[%d,%d]", r->it.low, r->it.high);
            assert(overlaps(q, r->it));
            printf("（有重叠：9 <= %d 且 %d <= 11）\n", r->it.high, r->it.low);
        } else {
            printf("nil\n");
            assert(0);
        }
    }

    /* part 4：枚举查询 —— 有重叠必命中、无重叠必 nil（与暴力对照逐次一致） */
    {
        int hits = 0, queries = 0;
        for (int a = 0; a < 40; a += 2) {
            interval_t q = {a, a + 1};
            node_t *r = interval_search(q);
            int expect = brute_overlaps(q, ivs, n);
            int got = (r != NULL);
            if (got) {
                hits++;
                assert(overlaps(q, r->it));
            }
            assert(got == expect);
            queries++;
        }
        printf("part 4: 查询 [a,a+1]，a = 0,2,...,38 共 %d 次：命中 %d 次，其余正确返回 nil\n",
               queries, hits);
        printf("        与暴力枚举逐次一致 —— INTERVAL-SEARCH 的正确性得到独立验证\n");
    }

    puts("all checks passed.");
    return 0;
}
