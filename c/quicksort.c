/* quicksort.c -- 7.1 节 QUICKSORT 与 PARTITION 的实现、不变量与实测。
 *
 * 对应原书 p.183-184（已按渲染页逐行核对，缩进按书补齐）：
 *   QUICKSORT(A, p, r)
 *   1  if p < r
 *   2      // Partition the subarray around the pivot, which ends up in A[q].
 *   3      q = PARTITION(A, p, r)
 *   4      QUICKSORT(A, p, q − 1)     // recursively sort the low side
 *   5      QUICKSORT(A, q + 1, r)     // recursively sort the high side
 *
 *   PARTITION(A, p, r)
 *   1  x = A[r]                       // the pivot
 *   2  i = p − 1                      // highest index into the low side
 *   3  for j = p to r − 1             // process each element other than the pivot
 *   4      if A[j] ≤ x                // does this element belong on the low side?
 *   5          i = i + 1              // index of a new slot in the low side
 *   6          exchange A[i] with A[j]     // put this element there
 *   7  exchange A[i + 1] with A[r]    // pivot goes just to the right of the low side
 *   8  return i + 1                   // new index of the pivot
 *
 * ★ 原书 p.184 给出了 PARTITION 的**循环不变量**（三条：低侧 ≤ x、高侧 > x、A[r] = x）
 *   以及完整的初始化/保持/终止论证 —— 本文件把它变成每一轮都可执行的检查。
 *
 * 验证六件事：
 *   1. PARTITION 之后：A[q] 是轴、左侧全部 ≤ 轴、右侧全部 > 轴，元素集合不变；
 *   2. 习题 7.1-3：PARTITION 在 n 个元素上恰好做 r − p 次比较 = Θ(n)；
 *   3. PARTITION 的循环不变量在**每一轮之后**都成立（原书 p.184 的三条）；
 *   4. 习题 7.1-2：全部元素相同时 q 返回 r —— 这正是最坏情况的成因；
 *   5. QUICKSORT 排好序（含重复与负数），且习题 7.1-1 的数组可逐步追踪；
 *   6. 习题 7.1-4：改成降序排序只需把第 4 行的 ≤ 反成 ≥（两种方向都实现并对照）。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o quicksort quicksort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 32

typedef struct {
    long cmp;      /* 第 4 行被求值的次数（PARTITION）/ 递归调用里的比较次数 */
    long swap;     /* 第 6 行与第 7 行的交换次数 */
    long calls;    /* QUICKSORT 被调用的次数（含立即返回的空调用） */
} stats_t;

/* ---------------------- PARTITION（原书 8 行） ---------------------- */
static int partition(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];                    /* 第 1 行：x = A[r]（轴） */
    int i = p - 1;                       /* 第 2 行：i = p − 1 */
    for (int j = p; j <= r - 1; j++) {   /* 第 3 行 */
        st->cmp++;
        if (a[j - 1] <= x) {             /* 第 4 行 */
            i++;                         /* 第 5 行 */
            int t = a[i - 1];            /* 第 6 行：exchange A[i] with A[j] */
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            st->swap++;
        }
    }
    {   /* 第 7 行：exchange A[i + 1] with A[r] */
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        st->swap++;
    }
    return i + 1;                        /* 第 8 行：return i + 1 */
}

/* 习题 7.1-4：把第 4 行的 ≤ 反成 ≥，就得到降序排序用的分区 */
static int partition_desc(int *a, int p, int r, stats_t *st)
{
    int x = a[r - 1];
    int i = p - 1;
    for (int j = p; j <= r - 1; j++) {
        st->cmp++;
        if (a[j - 1] >= x) {
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

/* ---------------------- QUICKSORT（原书 5 行） ---------------------- */
static void quicksort(int *a, int p, int r, stats_t *st)
{
    st->calls++;
    if (p < r) {                                  /* 第 1 行 */
        int q = partition(a, p, r, st);           /* 第 3 行 */
        quicksort(a, p, q - 1, st);               /* 第 4 行：low side */
        quicksort(a, q + 1, r, st);               /* 第 5 行：high side */
    }
}

/* 习题 7.1-4：降序版（只有第 3 行换了分区函数） */
static void quicksort_desc(int *a, int p, int r, stats_t *st)
{
    st->calls++;
    if (p < r) {
        int q = partition_desc(a, p, r, st);
        quicksort_desc(a, p, q - 1, st);
        quicksort_desc(a, q + 1, r, st);
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

static bool is_sorted_desc(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] < a[i]) { return false; } }
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

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
}

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

/* 习题 7.1-1 的逐步追踪：每次交换后打印一行 */
static void trace_partition(const int *src, int n)
{
    int a[MAXN];
    memcpy(a, src, (size_t)n * sizeof(int));
    int p = 1, r = n;
    int x = a[r - 1];
    int i = p - 1;
    print_array("习题 7.1-1 初始：", a, n);
    for (int j = p; j <= r - 1; j++) {
        if (a[j - 1] <= x) {
            i++;
            int t = a[i - 1];
            a[i - 1] = a[j - 1];
            a[j - 1] = t;
            printf("      A[%d] ≤ 轴：交换后 ", j);
            print_array("", a, n);
        }
    }
    {
        int t = a[i];
        a[i] = a[r - 1];
        a[r - 1] = t;
        printf("      轴归位后 ");
        print_array("", a, n);
    }
}

int main(void)
{
    /* ---- 1. PARTITION 的结论（p.184 的不变量在循环结束时的形态）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 28);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 401 + 9));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 300); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            int q = partition(a, 1, n, &st);
            assert(q >= 1 && q <= n);
            assert(a[q - 1] == before[n - 1]);          /* A[q] 是轴 */
            for (int k = 1; k <= q - 1; k++) { assert(a[k - 1] <= a[q - 1]); }
            for (int k = q + 1; k <= n; k++) { assert(a[k - 1] > a[q - 1]); }
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: 200 组输入分区后都满足「A[q] 是轴、左侧 ≤ 轴、右侧 > 轴」，元素集合不变\n");
    }

    /* ---- 2. 习题 7.1-3：比较次数恰好是 r − p，即 Θ(n) ---- */
    {
        int all_ok = 1;
        for (int n = 1; n <= 28; n++) {
            int a[MAXN];
            rnd_seed((unsigned)(n * 77 + 1));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 100); }
            stats_t st = {0, 0, 0};
            (void)partition(a, 1, n, &st);
            /* r − p = n − 1；PARTITION 在第 4 行上恰好做 n − 1 次比较 */
            if (st.cmp != n - 1) { all_ok = 0; }
        }
        assert(all_ok);
        puts("part 2: n = 1..28 的比较次数都恰好等于 r − p = n − 1（习题 7.1-3 的 Θ(n)）");
    }

    /* ---- 3. 循环不变量：每一轮之后都成立（原书 p.184 的三条）---- */
    {
        long rounds = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 28);
            int a[MAXN];
            rnd_seed((unsigned)(t * 233 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200); }
            int x = a[n - 1];
            /* 下面这一段用 **0 基** 下标模拟书上第 3–6 行（书是 1 基）：
             *   书的 i = p − 1 = 0（1 基）→ 0 基是 −1（"区间外"）
             *   书的 j 从 p 到 r − 1 → 0 基从 0 到 n − 2
             * 写错过一次（把 i 初始化成 0、j 从 1 开始），断言当场报 a[n−1] != x。 */
            int i = -1;
            for (int j = 0; j <= n - 2; j++) {
                if (a[j] <= x) {
                    i++;
                    int t2 = a[i]; a[i] = a[j]; a[j] = t2;
                }
                /* 不变量（按 1 基）：① A[1..i+1] 全部 ≤ x；② A[i+2..j+1] 全部 > x；
                 * ③ A[n] = x。换算成 0 基就是下面三行。 */
                for (int k = 0; k <= i; k++) { assert(a[k] <= x); }
                for (int k = i + 1; k <= j; k++) { assert(a[k] > x); }
                assert(a[n - 1] == x);
                rounds++;
            }
        }
        printf("part 3: %ld 轮里循环不变量（①低侧 ≤ x ②高侧 > x ③A[r] = x）从未被破坏\n", rounds);
    }

    /* ---- 4. 习题 7.1-2：全部相同时 q = r ---- */
    {
        for (int n = 1; n <= 20; n++) {
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = 42; }
            stats_t st = {0, 0, 0};
            int q = partition(a, 1, n, &st);
            assert(q == n);
        }
        puts("part 4: 全部元素相同时 q = r（习题 7.1-2）—— 每次分区都是 0 : (n−1)，最坏情况的成因");
    }

    /* ---- 5. 习题 7.1-1 的逐步追踪 ---- */
    {
        static const int EX711[12] = {13, 19, 9, 5, 12, 8, 7, 4, 21, 2, 6, 11};
        int a[MAXN];
        memcpy(a, EX711, sizeof(EX711));
        trace_partition(EX711, 12);
        stats_t st = {0, 0, 0};
        int q = partition(a, 1, 12, &st);
        assert(a[q - 1] == 11);
        assert(same_bag(a, EX711, 12));
        printf("      轴 11 落在下标 %d；共 %ld 次比较、%ld 次交换\n", q, st.cmp, st.swap);
    }

    /* ---- 6. QUICKSORT：排序正确性 + 调用次数随输入形态变化 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 120; t++) {
            int n = 1 + (t % 30);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 613 + 17));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200) - 100; }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            quicksort(a, 1, n, &st);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 6a: %d 组随机输入（含负数）都排好序且元素集合不变\n", checked);

        /* 习题 7.1-4：降序版 */
        {
            int a[MAXN];
            rnd_seed(4242);
            for (int i = 0; i < 20; i++) { a[i] = (int)(rnd_next() % 100); }
            stats_t st = {0, 0, 0};
            quicksort_desc(a, 1, 20, &st);
            assert(is_sorted_desc(a, 20));
            puts("part 6b: 把第 4 行的 ≤ 反成 ≥（习题 7.1-4）→ 排成降序，结构一字不改");
        }

        /* 最坏 vs 一般：递增输入 + 固定取末元素当轴 → 每层只切掉一个元素 */
        {
            int n = 24;
            int asc[MAXN], rnd[MAXN];
            for (int i = 0; i < n; i++) { asc[i] = i + 1; }
            stats_t s1 = {0, 0, 0};
            quicksort(asc, 1, n, &s1);
            assert(is_sorted(asc, n));
            assert(s1.calls == 2 * n - 1);      /* 非空 n 次 + 空 n−1 次 = 2n − 1 */

            rnd_seed(31337);
            for (int i = 0; i < n; i++) { rnd[i] = (int)(rnd_next() % 1000); }
            stats_t s2 = {0, 0, 0};
            quicksort(rnd, 1, n, &s2);
            assert(is_sorted(rnd, n));
            printf("part 6c: n = %d 时递增输入调用 %ld 次（最坏形态：每层只切掉一个元素），"
                   "随机输入调用 %ld 次\n", n, s1.calls, s2.calls);
            assert(s1.calls > s2.calls);         /* 最坏形态的调用次数明显更多 */
        }
    }

    puts("all checks passed.");
    return 0;
}
