/* parallel.c -- 26 章：并行算法的 work/span 分析（用计数模拟，不依赖真实多线程）。
 * 关键数字：
 *   part 1  FIB(n) 的调用次数 = 2·F(n+1) − 1（与迭代 Fibonacci 对照）；
 *           P-FIB 的 span = Θ(n)（链式），parallelism = work/span ≈ F(n)/n；
 *   part 2  P-MATRIX-MULTIPLY-RECURSIVE：work Θ(n³)、span Θ(lg² n)、parallelism Θ(n³/lg² n)；
 *           循环版 P-MATRIX-MULTIPLY：work Θ(n³)、span Θ(lg n)；
 *   part 3  P-MERGE（二分找分割点）与串行 MERGE 的比较次数、元素搬动次数对照，输出一致。 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ---------- part 1：FIB 的调用计数 ---------- */
static long fib_calls;

static long fib_count(int n)
{
    fib_calls++;
    if (n <= 1) { return n; }
    return fib_count(n - 1) + fib_count(n - 2);
}

static long fib_iter(int n)          /* 迭代版：独立对照 */
{
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long t = a + b; a = b; b = t; }
    return a;
}

/* P-FIB 的 span：T∞(n) = max(T∞(n−1), T∞(n−2)) + Θ(1) = T∞(n−1) + 1 → Θ(n) */
static int pfib_span(int n) { return n <= 1 ? 1 : pfib_span(n - 1) + 1; }

/* ---------- part 2：矩阵乘法的 work/span ---------- */
static long mat_work(int n) { return (long)n * n * n; }               /* n³ 次乘加 */

static int mat_span_rec(int n)         /* 递归版：两处 parallel for 各 Θ(lg n)，串行相加 */
{
    if (n == 1) { return 1; }
    int lg = 0;
    for (int t = n; t > 1; t >>= 1) { lg++; }
    return mat_span_rec(n / 2) + 2 * lg;
}

static int mat_span_loop(int n)        /* 双层 parallel for：span = Θ(lg n) */
{
    int lg = 0;
    for (int t = n; t > 1; t >>= 1) { lg++; }
    return 2 * lg;
}

/* ---------- part 3：归并（串行 vs 二分分割） ---------- */
static long cmp_serial, cmp_parallel, moves;

static void merge_serial(const int *a, int na, const int *b, int nb, int *out)
{
    int i = 0, j = 0, k = 0;
    while (i < na && j < nb) {
        cmp_serial++;
        out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        moves++;
    }
    while (i < na) { out[k++] = a[i++]; moves++; }
    while (j < nb) { out[k++] = b[j++]; moves++; }
}

/* FIND-SPLIT-POINT：二分找 x 在 A[lo..hi) 中的插入位置 */
static int find_split_point(const int *A, int lo, int hi, int x)
{
    while (lo < hi) {
        cmp_parallel++;
        int mid = (lo + hi) / 2;
        if (x <= A[mid]) { hi = mid; } else { lo = mid + 1; }
    }
    return lo;
}

/* P-MERGE-AUX：把 A[lo1..hi1] 与 A[lo2..hi2] 归并到 B[p..]（原书 26.3 的二分分割法） */
static void p_merge_aux(const int *A, int lo1, int hi1, int lo2, int hi2, int *B, int p)
{
    if (lo1 > hi1 && lo2 > hi2) { return; }
    if (lo1 > hi1) {
        for (int i = lo2; i <= hi2; i++) { B[p++] = A[i]; moves++; }
        return;
    }
    if (lo2 > hi2) {
        for (int i = lo1; i <= hi1; i++) { B[p++] = A[i]; moves++; }
        return;
    }
    if (hi1 - lo1 < hi2 - lo2) {          /* 总在较大的那段上取中位，保证平衡 */
        int t;
        t = lo1; lo1 = lo2; lo2 = t;
        t = hi1; hi1 = hi2; hi2 = t;
    }
    int mid1 = (lo1 + hi1) / 2;
    int x = A[mid1];
    int mid2 = find_split_point(A, lo2, hi2 + 1, x);   /* x 在第二段的插入位置 */
    int left = (mid1 - lo1) + (mid2 - lo2);            /* 排在 x 前面的元素个数 */
    p_merge_aux(A, lo1, mid1 - 1, lo2, mid2 - 1, B, p);
    B[p + left] = x; moves++;
    p_merge_aux(A, mid1 + 1, hi1, mid2, hi2, B, p + left + 1);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1 */
    {
        int n = 20;
        fib_calls = 0;
        long v = fib_count(n);
        long f_expected = fib_iter(n);
        printf("part 1: FIB(%d) = %ld；调用次数 = %ld\n", n, v, fib_calls);
        printf("        公式 2·F(n+1) − 1 = %ld（独立对照）\n", 2 * fib_iter(n + 1) - 1);
        assert(v == f_expected);
        assert(fib_calls == 2 * fib_iter(n + 1) - 1);
        printf("        P-FIB 的 span = %d（链式 Θ(n)）；parallelism = work/span ≈ %.0f\n",
               pfib_span(n), (double)fib_calls / pfib_span(n));
    }

    /* part 2 */
    {
        int ns[3] = {16, 64, 256};
        printf("part 2: 矩阵乘法的 work 与 span（同一问题的两种并行写法）：\n");
        for (int i = 0; i < 3; i++) {
            int n = ns[i];
            long w = mat_work(n);
            int srec = mat_span_rec(n), sloop = mat_span_loop(n);
            printf("        n=%3d：work = %ld（n³）\n", n, w);
            printf("               递归版 span = %d（Θ(lg²n)）-> parallelism ≈ %.0f\n",
                   srec, (double)w / srec);
            printf("               循环版 span = %d（Θ(lg n)）-> parallelism ≈ %.0f\n",
                   sloop, (double)w / sloop);
            assert(srec > sloop);              /* 递归版 span 更大（多了递归链） */
        }
    }

    /* part 3：并行归并 vs 串行归并 */
    {
        int n = 1024;
        int *A = malloc(sizeof(int) * n);
        for (int i = 0; i < n; i++) { A[i] = (i * 37) % 1000; }   /* 半有序：模拟两段已排序 */
        for (int i = 0; i < n; i++) { A[i] = i * 2; }             /* 左段偶数、右段奇数 */
        for (int i = n / 2; i < n; i++) { A[i] = (i - n / 2) * 2 + 1; }
        int *out1 = malloc(sizeof(int) * n);
        int *out2 = malloc(sizeof(int) * n);
        cmp_serial = 0; moves = 0;
        merge_serial(A, n / 2, A + n / 2, n / 2, out1);
        long ms = moves;
        cmp_parallel = 0; moves = 0;
        p_merge_aux(A, 0, n / 2 - 1, n / 2, n - 1, out2, 0);
        long mp = moves;
        printf("part 3: P-MERGE（二分分割）vs MERGE（串行）在 n=%d 上：\n", n);
        printf("        串行 MERGE：比较 %ld 次、元素搬动 %ld 次\n", cmp_serial, ms);
        printf("        P-MERGE  ：二分比较 %ld 次、元素搬动 %ld 次\n", cmp_parallel, mp);
        assert(ms == n);
        assert(mp == n);
        assert(cmp_serial <= (long)n - 1);
        printf("        两者搬动次数同为 n = %d（work 都是 Θ(n)）；P-MERGE 的额外开销在\n", n);
        printf("        O(lg² n) 的二分搜索里，换来 Θ(lg² n) 的 span（原书 26.3）。\n");
        free(A); free(out1); free(out2);
    }

    puts("all checks passed.");
    return 0;
}
