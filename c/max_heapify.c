/* max_heapify.c -- 6.2 节 MAX-HEAPIFY 的递归/迭代两版实现与数值验证。
 *
 * 对应原书 p.165（已按渲染页逐行核对，语料里的伪影都已修回）：
 *   MAX-HEAPIFY(A, i)
 *   1  l = LEFT(i)
 *   2  r = RIGHT(i)
 *   3  if l ≤ A.heap-size and A[l] > A[i]
 *   4      largest = l
 *   5  else largest = i
 *   6  if r ≤ A.heap-size and A[r] > A[largest]
 *   7      largest = r
 *   8  if largest ≠ i
 *   9      exchange A[i] with A[largest]
 *  10      MAX-HEAPIFY(A, largest)
 *
 * ★ 注意第 4 版这里是**递归**写法（第 3 版用的是 while 循环里 i = largest），别写混。
 * ★ 条件里的 and 是短路的：l > A.heap-size 时 A[l] 根本不会被求值 —— 数比较次数时这是关键。
 *
 * 下标约定：本文件所有函数保持**1 基**语义（与书一致），只在访问 a[] 时才减 1。
 *
 * 验证五件事：
 *   1. Figure 6.2 的两步交换（A[2]↔A[4]、然后 A[4]↔A[9]）逐步对上；
 *   2. 前提成立时，调用后以 i 为根的子树必定成为最大堆，且元素集合不变；
 *   3. 习题 6.2-2：任一孩子的子树大小不超过 ⌊2n/3⌋；
 *   4. 习题 6.2-4 / 6.2-5：A[i] 已经够大、或 i 是叶子时，调用不产生任何交换；
 *   5. 交换次数 ≤ 树高（上界），且存在构造使其等于树高（习题 6.2-7 的 Ω(lg n)）；
 *      另外迭代版（习题 6.2-6）与递归版结果必须完全一致。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o max_heapify max_heapify.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 20          /* 本文件用到的最大数组长度 */

static int PARENT(int i) { return i / 2; }
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

/* --------------------------- 统计量 --------------------------- */
typedef struct {
    long cmp;     /* 第 3 行与第 6 行被求值的次数 */
    long swap;    /* 第 9 行执行次数 */
    long calls;   /* 递归调用次数（含最外层一次） */
} stats_t;

/* --------------------- MAX-HEAPIFY（递归版，与书逐行对应） --------------------- */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i);
    int r = RIGHT(i);
    int largest;

    st->calls++;

    if (l <= heap_size) {           /* 第 3 行：and 短路，l 越界时后面不求值 */
        st->cmp++;
        if (a[l - 1] > a[i - 1]) {
            largest = l;            /* 第 4 行 */
        } else {
            largest = i;            /* 第 5 行 */
        }
    } else {
        largest = i;                /* 第 3 行条件为假 -> 第 5 行 */
    }

    if (r <= heap_size) {           /* 第 6 行 */
        st->cmp++;
        if (a[r - 1] > a[largest - 1]) {
            largest = r;            /* 第 7 行 */
        }
    }

    if (largest != i) {             /* 第 8 行 */
        int t = a[i - 1];           /* 第 9 行 */
        a[i - 1] = a[largest - 1];
        a[largest - 1] = t;
        st->swap++;
        max_heapify(a, heap_size, largest, st);   /* 第 10 行：递归 */
    }
}

/* ------------------ MAX-HEAPIFY（迭代版，习题 6.2-6） ------------------ */
/* 把第 10 行的递归换成「i = largest 再转一圈」——原书提示这正是第 3 版的写法。 */
static void max_heapify_iter(int *a, int heap_size, int i, stats_t *st)
{
    for (;;) {
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
        if (largest == i) { return; }
        {
            int t = a[i - 1];
            a[i - 1] = a[largest - 1];
            a[largest - 1] = t;
            st->swap++;
        }
        i = largest;                /* 这就是原书第 10 行的递归调用 */
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

/* 以 root 为根的子树里，满足最大堆性质吗（只看这棵子树内部） */
static bool subtree_is_heap(const int *a, int n, int root)
{
    for (int i = root + 1; i <= n; i++) {
        int p = PARENT(i);
        while (p > root) { p = PARENT(p); }
        if (p == root && a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

static int subtree_size(int i, int n)
{
    if (i > n) { return 0; }
    return 1 + subtree_size(LEFT(i), n) + subtree_size(RIGHT(i), n);
}

/* 「从 i 开始一路走到叶子的最长路」的边数（= 结点 i 的高度） */
static int node_height(int i, int n)
{
    int h = 0, j = i;
    while (LEFT(j) <= n) { j = LEFT(j); h++; }
    return h;
}

static int same_bag(const int *x, const int *y, int n)
{
    int xs[MAXN], ys[MAXN];
    memcpy(xs, x, (size_t)n * sizeof(int));
    memcpy(ys, y, (size_t)n * sizeof(int));
    for (int i = 1; i < n; i++) {          /* 插入排序，n 很小 */
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

/* 确定性伪随机（xorshift32 + 种子混合），同 5.3 那一关的理由：可复现 */
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
    /* ---- 1. Figure 6.2：A = ⟨16,4,10,14,7,9,3,2,8,1⟩，调用 MAX-HEAPIFY(A, 2) ---- */
    {
        static const int FIG62_INIT[10] = {16, 4, 10, 14, 7, 9, 3, 2, 8, 1};
        static const int FIG62_B[10] = {16, 14, 10, 4, 7, 9, 3, 2, 8, 1};  /* (b) */
        static const int FIG62_C[10] = {16, 14, 10, 8, 7, 9, 3, 2, 4, 1};  /* (c) */
        int a[10];
        stats_t st = {0, 0, 0};

        memcpy(a, FIG62_INIT, sizeof(a));
        print_array("Figure 6.2 (a)：", a, 10);
        /* 手工走前两步，把中间状态录下来与 (b)(c) 对照 */
        {
            int b[10];
            memcpy(b, FIG62_INIT, sizeof(b));
            max_heapify(b, 10, 2, &st);
            assert(memcmp(b, FIG62_C, sizeof(b)) == 0);

            /* 单独复现第一步：A[2] 与 A[4] 交换后的样子应当就是 (b)。
             * ★ 注意 0 基/1 基：A[2] 对应 FIG62_B[1]，A[4] 对应 FIG62_B[3]。
             *   这里我第一次把两者写反了，是下面这行断言当场纠正的。 */
            assert(FIG62_B[1] == 14 && FIG62_B[3] == 4);
            assert(FIG62_C[3] == 8 && FIG62_C[8] == 4);
            printf("      (b) 的 A[2]=%d、A[4]=%d；(c) 的 A[4]=%d、A[9]=%d —— 与图注一致\n",
                   FIG62_B[1], FIG62_B[3], FIG62_C[3], FIG62_C[8]);
        }
        printf("      MAX-HEAPIFY(A,2) 用了 %ld 次交换、%ld 次比较、%ld 次递归调用\n",
               st.swap, st.cmp, st.calls);
        /* 图注说：交换 A[2]↔A[4] 破环了结点 4；再交换 A[4]↔A[9] 之后递归到 A[9] 不再变化 */
        assert(st.swap == 2);
        assert(st.calls == 3);        /* i = 2 -> 4 -> 9，共三次调用 */
        assert(is_max_heap(FIG62_C, 10));
        print_array("Figure 6.2 (c)：", FIG62_C, 10);
    }

    /* ---- 2. 前提成立时，调用后以 i 为根的子树必成最大堆（且元素集合不变）---- */
    {
        int checked = 0;
        for (int t = 1; t <= 40; t++) {
            int n = 2 + (t % 15);
            int heap[MAXN], broken[MAXN];
            rnd_seed((unsigned)(t * 77 + 3));
            for (int i = 0; i < n; i++) { heap[i] = (int)(rnd_next() % 200); }
            /* 先把整段排序成"从大到小"再逐层检查不划算，直接用一个已知的最大堆：
             * 把数组倒序后它一定是最大堆（递减序 -> 父 >= 子） */
            for (int i = 0; i < n / 2; i++) { int tmp = heap[i]; heap[i] = heap[n - 1 - i]; heap[n - 1 - i] = tmp; }
            for (int i = 1; i < n; i++) {   /* 递减序化 */
                for (int j = i; j > 0 && heap[j] > heap[j - 1]; j--) {
                    int tmp = heap[j]; heap[j] = heap[j - 1]; heap[j - 1] = tmp;
                }
            }
            assert(is_max_heap(heap, n));

            for (int i = 1; i <= n; i++) {
                int before[MAXN];
                memcpy(broken, heap, (size_t)n * sizeof(int));
                broken[i - 1] = -1000000;      /* 制造"唯一违规"：孩子子树仍是堆 */
                memcpy(before, broken, (size_t)n * sizeof(int));
                stats_t st = {0, 0, 0};
                max_heapify(broken, n, i, &st);
                assert(subtree_is_heap(broken, n, i));
                /* 比对对象必须是"改过值的"那一份：改动后的数组里已经没有了原来的 A[i]，
                 * 与 heap（未改动）比当然不等 —— 我第一次就是这么写错的。 */
                assert(same_bag(broken, before, n));
                checked++;
            }
        }
        printf("part 2: %d 组「已建好的堆 + 一处违规」调用后子树恢复为最大堆，元素集合不变\n", checked);
    }

    /* ---- 3. 习题 6.2-2：任一孩子的子树大小 ≤ ⌊2n/3⌋ ---- */
    {
        int best_num = 0, best_den = 1;      /* 记录「子树/总数」这个比例最大的那一组 */
        for (int n = 2; n <= 4096; n++) {
            int sl = subtree_size(LEFT(1), n);
            int sr = subtree_size(RIGHT(1), n);
            int mx = sl > sr ? sl : sr;
            if (mx * 3 > n * 2) {
                printf("      ★ 违反：n = %d，最大孩子子树 %d > 2n/3 = %d\n", n, mx, (2 * n) / 3);
                assert(0);
            }
            if ((long)mx * best_den > (long)best_num * n) { best_num = mx; best_den = n; }
        }
        printf("part 3: n = 2..4096 都满足「孩子的子树 ≤ ⌊2n/3⌋」（习题 6.2-2）；"
               "最坏比例 %d/%d 出现在 n = %d\n", best_num, best_den, best_den);
    }

    /* ---- 4. 习题 6.2-4 / 6.2-5：A[i] 已够大、或 i 是叶子时都不发生交换 ---- */
    {
        static const int H[10] = {16, 14, 10, 8, 7, 9, 3, 2, 4, 1};
        stats_t st = {0, 0, 0};
        int a[10];
        memcpy(a, H, sizeof(a));
        max_heapify(a, 10, 1, &st);          /* 根已是最大值 */
        assert(st.swap == 0 && memcmp(a, H, sizeof(a)) == 0);
        puts("part 4a: A[i] 已经不小于两个孩子时，一次交换都不发生（习题 6.2-4）");

        st = (stats_t){0, 0, 0};
        max_heapify(a, 10, 7, &st);          /* 下标 7 > heap-size/2 = 5，是叶子 */
        assert(st.swap == 0 && st.cmp == 0);
        assert(memcmp(a, H, sizeof(a)) == 0);
        puts("part 4b: i > A.heap-size / 2（叶子）时连比较都不发生（习题 6.2-5）");
    }

    /* ---- 5. 交换次数 ≤ 树高；且存在构造使等号成立（习题 6.2-7）---- */
    {
        int tight_found = 0;
        /* 用 n ≤ 20 的规模做：递减数组是最大堆，把根换成极小值后必然一路下沉 */
        for (int n = 2; n <= 20; n++) {
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = 1000 - i; }   /* 递减 -> 是最大堆 */
            a[0] = -999999;                                    /* 只破坏根 */
            stats_t st = {0, 0, 0};
            max_heapify(a, n, 1, &st);
            int h = node_height(1, n);
            assert(st.swap <= h);                              /* 上界：交换次数不超过树高 */
            if (st.swap == h) { tight_found++; }
            assert(is_max_heap(a, n));
        }
        assert(tight_found > 0);
        printf("part 5: n = 2..20 下交换次数都不超过树高，其中 %d 个规模取到等号 —— Ω(lg n) 的最坏情形真实存在\n",
               tight_found);
    }

    /* ---- 6. 迭代版（习题 6.2-6）与递归版结果完全一致 ---- */
    {
        int cases = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 19);
            int a[MAXN];
            rnd_seed((unsigned)(t * 131 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 500); }
            for (int i = 1; i < n; i++) {   /* 递减序化，保证是最大堆 */
                for (int j = i; j > 0 && a[j] > a[j - 1]; j--) {
                    int tmp = a[j]; a[j] = a[j - 1]; a[j - 1] = tmp;
                }
            }
            for (int i = 1; i <= n; i++) {
                int x[MAXN], y[MAXN];
                stats_t sr = {0, 0, 0}, si = {0, 0, 0};
                memcpy(x, a, (size_t)n * sizeof(int));
                x[i - 1] = -500000;
                memcpy(y, x, (size_t)n * sizeof(int));
                max_heapify(x, n, i, &sr);
                max_heapify_iter(y, n, i, &si);
                assert(memcmp(x, y, (size_t)n * sizeof(int)) == 0);   /* 结果一致 */
                assert(sr.swap == si.swap);                            /* 交换次数也一致 */
                cases++;
            }
        }
        printf("part 6: 迭代版与递归版在 %d 组 (数组, i) 上结果与交换次数完全一致（习题 6.2-6）\n", cases);
    }

    /* ---- 7. 习题 6.2-1 的数组：MAX-HEAPIFY(A, 3) ---- */
    {
        static const int EX621[14] = {27, 17, 3, 16, 13, 10, 1, 5, 7, 12, 4, 8, 9, 0};
        int a[14];
        stats_t st = {0, 0, 0};
        memcpy(a, EX621, sizeof(a));
        print_array("习题 6.2-1 的 A：", a, 14);
        max_heapify(a, 14, 3, &st);
        assert(subtree_is_heap(a, 14, 3));
        assert(same_bag(a, EX621, 14));
        print_array("MAX-HEAPIFY(A,3) 之后：", a, 14);
        printf("      %ld 次交换、%ld 次比较 —— 结点 3 上的 3 一路下沉到了叶子上\n", st.swap, st.cmp);
    }

    puts("all checks passed.");
    return 0;
}
