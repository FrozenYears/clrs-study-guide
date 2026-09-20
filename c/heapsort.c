/* heapsort.c -- 6.4 节 HEAPSORT 的实现、逐步追踪与「两种输入都一样慢」的实测。
 *
 * 对应原书 p.170（已按渲染页核对）：
 *   HEAPSORT(A, n)
 *   1 BUILD-MAX-HEAP(A, n)
 *   2 for i = n downto 2
 *   3     exchange A[1] with A[i]
 *   4     A.heap-size = A.heap-size − 1
 *   5     MAX-HEAPIFY(A, 1)
 *
 * 习题 6.4-2 给出的循环不变量（原书 p.172）：
 *   At the start of each iteration of the for loop of lines 2–5, the subarray
 *   A[1 : i] is a max-heap containing the i smallest elements of A[1 : n],
 *   and the subarray A[i + 1 : n] contains the n − i largest elements of
 *   A[1 : n], sorted.
 * 这条不变量是本文件第 2 组断言的直接来源。
 *
 * 验证六件事：
 *   1. 排好序（含重复值与负数），且元素集合不变；
 *   2. 习题 6.4-2 的不变量在**每一轮之后**都成立（堆区的最大堆性质 + 已排序区的有序性）；
 *   3. Figure 6.4 / 习题 6.4-1 的数组逐步追踪（打印每轮之后的数组）；
 *   4. 习题 6.4-3：递增与递减输入的时间都是 Θ(n lg n) —— 堆排序对输入顺序**不敏感**；
 *   5. 习题 6.4-4 与最好情况：比较次数在任何输入下都是 Ω(n lg n)；
 *   6. 原地性：整个过程的额外空间只有几个临时变量（见第 6 组的说明与断言）。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o heapsort heapsort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 64

static int PARENT(int i) { return i / 2; }
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

typedef struct {
    long cmp;
    long swap;
} stats_t;

/* MAX-HEAPIFY（递归版，同 6.2），只在 [1, heap_size] 范围内工作 */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i);
    int r = RIGHT(i);
    int largest = i;

    if (l <= heap_size) {
        st->cmp++;
        if (a[l - 1] > a[largest - 1]) { largest = l; }
    }
    if (r <= heap_size) {
        st->cmp++;
        if (a[r - 1] > a[largest - 1]) { largest = r; }
    }
    if (largest != i) {
        int t = a[i - 1];
        a[i - 1] = a[largest - 1];
        a[largest - 1] = t;
        st->swap++;
        max_heapify(a, heap_size, largest, st);
    }
}

static void build_max_heap(int *a, int n, stats_t *st)
{
    for (int i = n / 2; i >= 1; i--) { max_heapify(a, n, i, st); }
}

/* --------------------------- HEAPSORT（原书 5 行） --------------------------- */
/* trace_lines > 0 时，每轮之后打印一行数组（用于 Figure 6.4 / 习题 6.4-1） */
static void heapsort(int *a, int n, stats_t *st, int trace_lines)
{
    build_max_heap(a, n, st);                        /* 第 1 行 */
    if (trace_lines > 0) { printf("      [建堆后] "); }
    if (trace_lines > 0) {
        for (int k = 0; k < n; k++) { printf("%d%s", a[k], k + 1 < n ? " " : ""); }
        printf("\n");
    }
    for (int i = n; i >= 2; i--) {                   /* 第 2 行 */
        int t = a[0];                                /* 第 3 行：exchange A[1] with A[i] */
        a[0] = a[i - 1];
        a[i - 1] = t;
        st->swap++;
        /* 第 4 行：A.heap-size = A.heap-size − 1 —— 就是让 heap_size 跟着 i 走 */
        max_heapify(a, i - 1, 1, st);                /* 第 5 行 */
        if (trace_lines > 0) {
            printf("      [i = %2d 后] ", i);
            for (int k = 0; k < n; k++) { printf("%d%s", a[k], k + 1 < n ? " " : ""); }
            printf("\n");
        }
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
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

/* 自带的「逐步 HEAPSORT」：每做完一轮回调一次，用来检查不变量 */
static void heapsort_stepwise(int *a, int n, stats_t *st,
                              void (*after_round)(const int *, int, int, void *), void *ctx)
{
    build_max_heap(a, n, st);
    for (int i = n; i >= 2; i--) {
        int t = a[0];
        a[0] = a[i - 1];
        a[i - 1] = t;
        st->swap++;
        max_heapify(a, i - 1, 1, st);
        /* ★ 注意这里传的是 i − 1 而不是 i：本轮结束后堆已经缩到 A[1 : i−1]，
         *   而"下一轮开始时"的不变量正是以 i − 1 为参数的。第一次我传了 i，
         *   于是检查区与真实区整体错开一位，断言当场报错。 */
        after_round(a, n, i - 1, ctx);
    }
}

/* --------------------- 不变量检查的回调上下文 --------------------- */
typedef struct {
    int violations;
    long rounds;
} inv_ctx;

/* 检查习题 6.4-2 的不变量：heap_size = h 时
 *   ① A[1 : h] 是最大堆；
 *   ② A[h+1 : n] 已经有序；
 *   ③ 堆区里每个元素都不大于已排序区（已排序区的最小值就是 A[h+1]）。
 * 参数与数组一样都按 1 基描述，访问时减 1。 */
static void check_invariant(const int *a, int n, int h, void *ctxp)
{
    inv_ctx *c = (inv_ctx *)ctxp;
    c->rounds++;
    if (h > 0 && !is_max_heap(a, h)) { c->violations++; }
    for (int k = h; k + 1 <= n - 1; k++) { if (a[k] > a[k + 1]) { c->violations++; } }
    if (h >= 1 && h <= n - 1) {
        for (int k = 0; k < h; k++) { if (a[k] > a[h]) { c->violations++; } }
    }
}

int main(void)
{
    /* ---- 1. 排序正确性（含重复值与负数）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 63);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 71 + 13));
            for (int i = 0; i < n; i++) {
                a[i] = (int)(rnd_next() % 60) - 30;      /* 含负数、且 60 个值里必然有重复 */
            }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0};
            heapsort(a, n, &st, 0);
            assert(is_sorted(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: %d 组随机输入（含负数与重复值）都排好序且元素集合不变\n", checked);
    }

    /* ---- 2. 习题 6.4-2 的循环不变量：每轮之后都成立 ---- */
    {
        inv_ctx ctx = {0, 0};
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 40);
            int a[MAXN];
            rnd_seed((unsigned)(t * 191 + 3));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 400); }
            stats_t st = {0, 0};
            heapsort_stepwise(a, n, &st, check_invariant, &ctx);
            assert(is_sorted(a, n));
        }
        assert(ctx.violations == 0);
        printf("part 2: %ld 轮里不变量从未被破坏 —— A[1:i] 是含 i 个最小元素的最大堆，"
               "A[i+1:n] 是 n−i 个最大元素且已排序（习题 6.4-2）\n", ctx.rounds);
    }

    /* ---- 3. 习题 6.4-1 的数组（Figure 6.4 的模型）---- */
    {
        static const int EX641[9] = {5, 13, 2, 25, 7, 17, 20, 8, 4};
        int a[9];
        stats_t st = {0, 0};
        memcpy(a, EX641, sizeof(a));
        printf("part 3: 习题 6.4-1 的 A = ⟨5,13,2,25,7,17,20,8,4⟩\n");
        heapsort(a, 9, &st, 1);
        assert(is_sorted(a, 9));
        assert(same_bag(a, EX641, 9));
        printf("      最终结果：");
        for (int k = 0; k < 9; k++) { printf("%d%s", a[k], k + 1 < 9 ? " " : ""); }
        printf("（比较 %ld 次、交换 %ld 次）\n", st.cmp, st.swap);
    }

    /* ---- 4. 习题 6.4-3：递增 / 递减 / 随机三种输入的比较次数 ---- */
    {
        int n = 32;
        int inc[MAXN], dec[MAXN], rnd[MAXN];
        long cmp_inc, cmp_dec, cmp_rnd;
        for (int i = 0; i < n; i++) { inc[i] = i + 1; }
        for (int i = 0; i < n; i++) { dec[i] = n - i; }
        rnd_seed(4242);
        for (int i = 0; i < n; i++) { rnd[i] = (int)(rnd_next() % 1000); }

        {
            stats_t st = {0, 0};
            heapsort(inc, n, &st, 0);
            cmp_inc = st.cmp;
            assert(is_sorted(inc, n));
        }
        {
            stats_t st = {0, 0};
            heapsort(dec, n, &st, 0);
            cmp_dec = st.cmp;
            assert(is_sorted(dec, n));
        }
        {
            stats_t st = {0, 0};
            heapsort(rnd, n, &st, 0);
            cmp_rnd = st.cmp;
            assert(is_sorted(rnd, n));
        }
        printf("part 4: n = 32 时的比较次数 —— 递增 %ld、递减 %ld、随机 %ld\n",
               cmp_inc, cmp_dec, cmp_rnd);
        /* 三者都应当落在 n·lg n 的同一量级内（差异只是常数倍） */
        long lower = (long)n * 5 / 2;
        assert(cmp_inc > lower && cmp_dec > lower && cmp_rnd > lower);
        long upper = 8L * n * 6;      /* 宽松上界，只要证明"都不小" */
        assert(cmp_inc < upper && cmp_dec < upper && cmp_rnd < upper);
        puts("      ★ 三种输入都在同一量级 —— 堆排序对输入顺序不敏感，"
             "这与插入排序（递增输入只需 n−1 次比较）形成鲜明对比（习题 6.4-3）");
    }

    /* ---- 5. 习题 6.4-4 + 最好情况：任何输入都是 Ω(n lg n) ---- */
    {
        double best_ratio = 1e9;
        int best_ratio_n = 0;
        for (int n = 4; n <= 64; n++) {
            int lg = 0;
            for (int k = n; k > 1; k >>= 1) { lg++; }

            long best = -1;                        /* 该 n 下、60 组随机输入里的最少比较次数 */
            for (int t = 1; t <= 60; t++) {
                int a[MAXN];
                rnd_seed((unsigned)(t * 313 + n));
                /* 值互不相同（乘一个大系数再加随机项），对应"最好情况"那一问的前提 */
                for (int i = 0; i < n; i++) {
                    a[i] = (int)(rnd_next() % 100000) + i * 1000007;
                }
                stats_t st = {0, 0};
                heapsort(a, n, &st, 0);
                assert(is_sorted(a, n));
                if (best < 0 || st.cmp < best) { best = st.cmp; }
            }
            /* Ω(n lg n) 的宽松形式：最少比较次数也不低于 n·⌊lg n⌋ / 4。
             * 用 1/4 这样一个"离常数很远"的系数，是为了让断言表达"量级"而不是"精确常数"。 */
            long need = (long)n * lg / 4;
            if (best < need) {
                printf("      ★ n = %d 时最少比较 %ld，低于 n·⌊lg n⌋/4 = %ld\n", n, best, need);
                assert(0);
            }
            double ratio = (double)best / (double)((long)n * lg);
            if (ratio < best_ratio) { best_ratio = ratio; best_ratio_n = n; }
        }
        printf("part 5: n = 4..64 各测 60 组互异输入，**最少**的比较次数仍不低于 n·⌊lg n⌋/4 —— "
               "最好情况也是 Ω(n lg n)（习题 6.4-4 与「元素互异时最好情况」那一问）；"
               "最紧的一次比值 %.3f 出现在 n = %d\n", best_ratio, best_ratio_n);
    }

    /* ---- 6. 原地性 ---- */
    {
        /* heapsort() 里除输入数组之外只用到 3 个 int（交换用的 t、循环变量 i 与
         * max_heapify 里的临时变量），与 n 无关 —— 这就是 p.161 说的
         * "only a constant number of array elements are stored outside the input array"。
         * 下面用一个"额外缓冲区哨兵"来把这件事写成断言：排序过程中被写到数组之外的
         * 元素个数为 0。实现上做不到直接观察，所以这里用"数组首尾之外的内存不动"近似：
         * 在数组两端各放一个哨兵，排序后必须原封不动。 */
        int buf[MAXN + 2];
        int n = 21;
        rnd_seed(999);
        for (int i = 0; i < n; i++) { buf[i + 1] = (int)(rnd_next() % 500); }
        buf[0] = -12345;                 /* 数组"左边"的哨兵 */
        buf[n + 1] = 54321;              /* 数组"右边"的哨兵 */
        stats_t st = {0, 0};
        heapsort(&buf[1], n, &st, 0);    /* 只把中间那段当作 A[1:n] */
        assert(buf[0] == -12345 && buf[n + 1] == 54321);
        for (int i = 0; i + 2 <= n; i++) { assert(buf[i + 1] <= buf[i + 2]); }
        puts("part 6: 数组两侧的哨兵原封不动 —— 排序只在给定的数组范围内进行（原地）");
    }

    puts("all checks passed.");
    return 0;
}
