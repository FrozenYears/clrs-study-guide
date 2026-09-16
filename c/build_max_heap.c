/* build_max_heap.c -- 6.3 节 BUILD-MAX-HEAP 的实现与「线性时间」的实测。
 *
 * 对应原书 p.167（已按渲染页核对）：
 *   BUILD-MAX-HEAP(A, n)
 *   1 A.heap-size = n
 *   2 for i = ⌊n/2⌋ downto 1
 *   3     MAX-HEAPIFY(A, i)
 *
 * 循环不变量（原书 p.167）：
 *   At the start of each iteration of the for loop of lines 2–3,
 *   each node i + 1, i + 2, …, n is the root of a max-heap.
 *
 * 本文件要证的是一句容易被当成"显然"的话：**建堆是 O(n)，不是 O(n lg n)**。
 * 办法是照原书 p.169 的思路按高度分层求和，并且实测每一层的结点数与代价。
 *
 * 验证六件事：
 *   1. 结果一定是合法的最大堆，且元素集合不变（大量随机输入）；
 *   2. 循环不变量在**每一次迭代之后**都成立（逐轮检查 i+1..n 是否都是堆根）；
 *   3. 习题 6.3-1 的数组 ⟨5,3,17,10,84,19,6,22,9⟩ 建堆后根是 84；
 *   4. 习题 6.3-4：高度为 h 的结点数不超过 ⌈n/2^{h+1}⌉；
 *   5. 按高度分层的实际总代价 Σ_h cnt(h)·h 不超过 2n —— 这就是 O(n) 的来源；
 *   6. 习题 6.3-3：把循环**倒过来**（从 1 走到 ⌊n/2⌋）建不出堆 —— 用反例说话。
 *
 * 下标约定：所有函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o build_max_heap build_max_heap.c
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
    long calls;
} stats_t;

/* --------------------- MAX-HEAPIFY（递归版，同 6.2） --------------------- */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i);
    int r = RIGHT(i);
    int largest = i;

    st->calls++;
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

/* --------------------- BUILD-MAX-HEAP（原书 3 行） --------------------- */
static void build_max_heap(int *a, int n, stats_t *st)
{
    for (int i = n / 2; i >= 1; i--) {   /* 第 2 行：从 ⌊n/2⌋ 倒着走到 1 */
        max_heapify(a, n, i, st);        /* 第 3 行 */
    }
}

/* 习题 6.3-3 的对照实验：把循环方向反过来，从 1 正着走到 ⌊n/2⌋ */
static void build_max_heap_forward(int *a, int n, stats_t *st)
{
    for (int i = 1; i <= n / 2; i++) {
        max_heapify(a, n, i, st);
    }
}

/* --------------------------- 工具 --------------------------- */
static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

/* 结点 i 的高度：到某个叶子的最长向下路径的边数 */
static int node_height(int i, int n)
{
    int h = 0, j = i;
    while (LEFT(j) <= n) { j = LEFT(j); h++; }
    return h;
}

/* heap_height + 1：树的层数 */
static int heap_levels(int n) { return n <= 0 ? 0 : node_height(1, n) + 1; }

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

/* 确定性伪随机（xorshift32 + 种子混合） */
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

int main(void)
{
    /* ---- 1. 结果一定是合法的最大堆，且元素集合不变 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 1 + (t % 60);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 37 + 11));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            build_max_heap(a, n, &st);
            assert(is_max_heap(a, n));
            assert(same_bag(a, before, n));
            checked++;
        }
        printf("part 1: %d 组随机输入建堆后都是合法最大堆、元素集合不变\n", checked);
    }

    /* ---- 2. 循环不变量：**每一轮之后** i+1..n 都必须是堆根 ---- */
    {
        int rounds = 0;
        for (int t = 1; t <= 40; t++) {
            int n = 2 + (t % 40);
            int a[MAXN];
            rnd_seed((unsigned)(t * 91 + 5));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 700); }
            stats_t st = {0, 0, 0};
            for (int i = n / 2; i >= 1; i--) {
                max_heapify(a, n, i, &st);
                /* 本轮结束：对每个 j >= i，以 j 为根的子树都要满足堆性质 */
                for (int j = i; j <= n; j++) {
                    for (int k = j; k <= n; k++) {
                        int p = PARENT(k);
                        while (p > j) { p = PARENT(p); }
                        if (p == j && a[PARENT(k) - 1] < a[k - 1]) {
                            printf("      ★ 不变量被破坏：n=%d, i=%d, j=%d, k=%d\n", n, i, j, k);
                            assert(0);
                        }
                    }
                }
                rounds++;
            }
            assert(is_max_heap(a, n));
        }
        printf("part 2: %d 轮迭代后 i+1..n 都是堆根 —— 循环不变量逐轮成立（原书 p.167）\n", rounds);
    }

    /* ---- 3. 习题 6.3-1 ---- */
    {
        static const int EX631[9] = {5, 3, 17, 10, 84, 19, 6, 22, 9};
        int a[9];
        stats_t st = {0, 0, 0};
        memcpy(a, EX631, sizeof(a));
        print_array("习题 6.3-1 的 A：", a, 9);
        build_max_heap(a, 9, &st);
        print_array("建堆之后：", a, 9);
        assert(is_max_heap(a, 9));
        assert(a[0] == 84);
        printf("      根 A[1] = %d（应当是 84）；外层调用 ⌊9/2⌋ = 4 次，"
               "含递归共 %ld 次调用、%ld 次交换\n", a[0], st.calls, st.swap);
        assert(st.calls >= 4);            /* 4 次外层调用，另有若干次递归调用 */
    }

    /* ---- 4. 习题 6.3-4：高度为 h 的结点数 ≤ ⌈n/2^{h+1}⌉ ---- */
    {
        int checked = 0, worst = 0;
        for (int n = 1; n <= 4096; n++) {
            int levels = heap_levels(n);
            for (int h = 0; h < levels; h++) {
                int cnt = 0;
                for (int i = 1; i <= n; i++) { if (node_height(i, n) == h) { cnt++; } }
                /* ceil(n / 2^(h+1))，用整数算：(n + 2^(h+1) - 1) / 2^(h+1) */
                long den = 1L << (h + 1);
                long bound = (n + den - 1) / den;
                assert(cnt <= bound);
                if (cnt > worst) { worst = cnt; }
                checked++;
            }
        }
        printf("part 4: (n, h) 共 %d 组都满足「高度 h 的结点数 ≤ ⌈n/2^{h+1}⌉」（习题 6.3-4）\n", checked);
    }

    /* ---- 5. 线性时间：按高度分层的实际总代价 ≤ 2n ---- */
    {
        int all_ok = 1;
        double worst_ratio = 0.0;
        int worst_n = 0;
        for (int n = 1; n <= 4096; n++) {
            long total = 0;
            int levels = heap_levels(n);
            for (int h = 0; h < levels; h++) {
                int cnt = 0;
                for (int i = 1; i <= n; i++) { if (node_height(i, n) == h) { cnt++; } }
                total += (long)cnt * h;      /* 高度 h 的结点上，MAX-HEAPIFY 的代价是 O(h) */
            }
            /* 原书 p.169 的界：Σ_h ⌈n/2^{h+1}⌉·h ≤ (n/2)·Σ_h h/2^h ≤ 2n */
            if (total > 2L * n) { all_ok = 0; }
            double ratio = (double)total / (double)n;
            if (ratio > worst_ratio) { worst_ratio = ratio; worst_n = n; }
        }
        assert(all_ok);
        printf("part 5: n = 1..4096 都满足「分层总代价 Σ_h cnt(h)·h ≤ 2n」；"
               "∑h/2^h = 2 这个常数把建堆钉在 O(n)（最坏比值 %.4f 出现在 n = %d）\n",
               worst_ratio, worst_n);
    }

    /* ---- 6. 习题 6.3-3：把循环方向倒过来建不出堆 ---- */
    {
        int failures = 0, tried = 0;
        for (int t = 1; t <= 200; t++) {
            int n = 4 + (t % 30);
            int a[MAXN];
            rnd_seed((unsigned)(t * 53 + 17));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 500); }
            stats_t st = {0, 0, 0};
            build_max_heap_forward(a, n, &st);
            tried++;
            if (!is_max_heap(a, n)) { failures++; }
        }
        printf("part 6: 把循环改成 i = 1 to ⌊n/2⌋（正着走）时，%d/%d 组建不出最大堆 —— 这就是"
               "为什么必须**从下往上**（习题 6.3-3）\n", failures, tried);
        assert(failures > tried / 2);     /* 绝大多数都失败，不是偶然 */
    }

    puts("all checks passed.");
    return 0;
}
