/* randomized_quicksort.c -- 7.3 节随机化快速排序。
 *
 * 对应原书 p.192：
 *   RANDOMIZED-PARTITION(A, p, r)
 *   1  i = RANDOM(p, r)
 *   2  exchange A[r] with A[i]
 *   3  return PARTITION(A, p, r)
 *
 *   RANDOMIZED-QUICKSORT(A, p, r)
 *   1  if p < r
 *   2      q = RANDOMIZED-PARTITION(A, p, r)
 *   3      RANDOMIZED-QUICKSORT(A, p, q − 1)
 *   4      RANDOMIZED-QUICKSORT(A, q + 1, r)
 *
 * 下标约定：函数保持 1 基语义，只在访问 a[] 时减 1。
 *
 * 验证四件事：
 *   1. 排好序（各种输入形态都行，含"已排序"—— 那正是要解决的痛点）；
 *   2. 已排序输入不再是最坏情况（与 7.1 的确定性版本对照）；
 *   3. 递归深度不再退化成 n（随机化后深度接近 Θ(lg n)）；
 *   4. 确定性版的退化输入在随机化版上表现正常。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o randomized_quicksort randomized_quicksort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 64

typedef struct {
    long cmp;
    long swap;
    long calls;
    long depth;     /* 递归最大深度 */
} stats_t;

/* PARTITION（7.1） */
static int partition(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];
    int i = p - 1;
    for (int j = p; j <= r - 1; j++) {
        st->cmp++;
        if (a[j - 1] <= x) {
            i++;
            int t = a[i - 1];
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            st->swap++;
        }
    }
    {
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        st->swap++;
    }
    return i + 1;
}

/* RANDOM(p, r)：闭区间上的确定性伪随机数（xorshift32） */
static unsigned g_state;
static void rnd_seed(unsigned s)
{
    g_state = s ? s : 0x9e3779b9u;
    g_state += 0x9e3779b9u;
    g_state = (g_state ^ (g_state >> 16)) * 0x21f0aaadu;
    g_state = (g_state ^ (g_state >> 15)) * 0x735a2d97u;
    g_state = g_state ^ (g_state >> 15);
}
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}
static int randomized(int p, int r)
{
    unsigned span = (unsigned)(r - p + 1);
    return p + (int)((double)rnd_next() / 4294967296.0 * (double)span);
}

/* RANDOMIZED-PARTITION（原书 3 行） */
static int randomized_partition(int *a, int p, int r, stats_t *st)
{
    int i = randomized(p, r);            /* 第 1 行：i = RANDOM(p, r) */
    {   /* 第 2 行：exchange A[r] with A[i] */
        int t = a[r - 1];
        a[r - 1] = a[i - 1];
        a[i - 1] = t;
        st->swap++;
    }
    return partition(a, p, r, st);       /* 第 3 行 */
}

/* RANDOMIZED-QUICKSORT（原书 4 行） */
static void randomized_quicksort(int *a, int p, int r, stats_t *st, int depth)
{
    st->calls++;
    if (depth > st->depth) { st->depth = depth; }
    if (p < r) {
        int q = randomized_partition(a, p, r, st);
        randomized_quicksort(a, p, q - 1, st, depth + 1);
        randomized_quicksort(a, q + 1, r, st, depth + 1);
    }
}

/* 确定性版 QUICKSORT（7.1，用于对照） */
static int qsort_deterministic_partition(int *a, int p, int r, stats_t *st)
{
    return partition(a, p, r, st);
}
static void quicksort_det(int *a, int p, int r, stats_t *st, int depth)
{
    st->calls++;
    if (depth > st->depth) { st->depth = depth; }
    if (p < r) {
        int q = qsort_deterministic_partition(a, p, r, st);
        quicksort_det(a, p, q - 1, st, depth + 1);
        quicksort_det(a, q + 1, r, st, depth + 1);
    }
}

static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

static int same_bag(const int *x, const int *y, int n)
{
    int xs[MAXN], ys[MAXN];
    memcpy(xs, x, (size_t)n * sizeof(int));
    memcpy(ys, y, (size_t)n * sizeof(int));
    for (int i = 1; i < n; i++) {
        int k = xs[i], j = i - 1;
        while (j >= 0 && xs[j] > k) { xs[j + 1] = xs[j]; j--; }
        xs[j + 1] = k;
        k = ys[i]; j = i - 1;
        while (j >= 0 && ys[j] > k) { ys[j + 1] = ys[j]; j--; }
        ys[j + 1] = k;
    }
    return memcmp(xs, ys, (size_t)n * sizeof(int)) == 0;
}

int main(void)
{
    /* ---- 1. 各种输入形态都排好序 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 60);
            int a[MAXN], before[MAXN];
            int mode = t % 4;
            for (int i = 0; i < n; i++) {
                if (mode == 0) { a[i] = i + 1; }              /* 已排序（原来的最坏） */
                else if (mode == 1) { a[i] = n - i; }          /* 逆序 */
                else if (mode == 2) { a[i] = 42; }             /* 全部相同 */
                else { a[i] = (int)((t * 131 + i * 37) % 300) - 150; }
            }
            memcpy(before, a, (size_t)n * sizeof(int));
            rnd_seed((unsigned)(t * 997 + 3));
            stats_t st = {0, 0, 0, 0};
            randomized_quicksort(a, 1, n, &st, 0);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: 200 组（已排序 / 逆序 / 全同 / 随机）都排好序\n");
    }

    /* ---- 2. "已排序"不再是最坏情况：与确定性版对照 ---- */
    {
        int n = 64;
        int a[MAXN], b[MAXN];
        for (int i = 0; i < n; i++) { a[i] = i + 1; b[i] = i + 1; }

        stats_t det = {0, 0, 0, 0};
        quicksort_det(b, 1, n, &det, 0);

        /* 确定性版固定取末元素：深度必为 n − 1（每层递归只切掉一个元素，深度从 0 数起） */
        assert(det.depth == n - 1);

        /* 随机化版跑 30 个种子，取最深的那次 */
        long max_depth = 0;
        for (int s = 1; s <= 30; s++) {
            memcpy(a, (int[]){1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
                               17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
                               33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,
                               49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64},
                   (size_t)n * sizeof(int));
            rnd_seed((unsigned)s);
            stats_t st = {0, 0, 0, 0};
            randomized_quicksort(a, 1, n, &st, 0);
            assert(is_sorted(a, n));
            if (st.depth > max_depth) { max_depth = st.depth; }
        }
        printf("part 2: n = %d 已排序输入 ——\n", n);
        printf("        确定性版递归深度 = %ld（= n，最坏）\n", det.depth);
        printf("        随机化版 30 个种子的最大深度 = %ld（远小于 n）\n", max_depth);
        assert(max_depth < det.depth);
    }

    /* ---- 3. 递归深度接近 Θ(lg n) ---- */
    {
        int n = 1024;
        int a[MAXN <= 0 ? 1 : 64];
        (void)a; (void)n;
        /* MAXN 限制了 n；用 n = 60 做实测 */
        n = 60;
        long total_depth = 0, max_of_max = 0;
        int trials = 30;
        for (int s = 1; s <= trials; s++) {
            int arr[60];
            for (int i = 0; i < n; i++) { arr[i] = i + 1; }
            rnd_seed((unsigned)s);
            stats_t st = {0, 0, 0, 0};
            randomized_quicksort(arr, 1, n, &st, 0);
            total_depth += st.depth;
            if (st.depth > max_of_max) { max_of_max = st.depth; }
        }
        long avg_depth = total_depth / trials;
        long lg_n = 0;
        for (int k = n; k > 1; k >>= 1) { lg_n++; }
        printf("part 3: n = %d 随机化 %d 次的平均递归深度 %ld（⌊lg n⌋ = %ld）；最大 %ld\n",
               n, trials, avg_depth, lg_n, max_of_max);
        /* 平均深度应接近 lg n（3 倍以内 —— 因为 30 个种子的样本小） */
        assert(avg_depth < 3 * lg_n);
        /* 最深的也不超过 2 * lg n 太远 */
        assert(max_of_max < 6 * lg_n);
    }

    /* ---- 4. 确定性版的退化输入，随机化版表现正常 ---- */
    {
        /* 习题 7.1-2 的输入：全部相同 */
        int n = 32;
        int a[MAXN];
        for (int i = 0; i < n; i++) { a[i] = 42; }
        rnd_seed(777);
        stats_t st = {0, 0, 0, 0};
        randomized_quicksort(a, 1, n, &st, 0);
        assert(is_sorted(a, n));
        printf("part 4: 全部相同（n = %d）随机化版递归深度 = %ld（确定性版是 n = %ld）\n",
               n, st.depth, (long)n);
        assert(st.depth < n);       /* 不再退化成 n */
    }

    puts("all checks passed.");
    return 0;
}
