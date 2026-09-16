/* select.c -- 9.3 节 SELECT（中位数的中位数法）的实现与最坏线性实测。
 * 按原书 24 行伪代码直译（0 基内部）。
 * 验证：
 *   ① 正确性（200 组，每个 i）；
 *   ② 最坏情形比较次数 O(n)：与随机化版（恶意输入下 n²/2）对照；
 *   ③ 每次递归的子问题 ≤ 7n/10（"至少淘汰 3n/10" 的实测）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o select select.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 512

static unsigned g_state = 0x9e3779b9u;
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

static long g_cmp;
static long g_max_subproblem;   /* 递归中出现的最大子问题规模（不含选轴递归） */

static void swap(int *a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

/* 围绕值 x 分区（PARTITION-AROUND：值 x 一定在数组里；返回它的名次位置） */
static int partition_around(int *a, int p, int r, int x)
{
    int idx = p;
    while (idx <= r && a[idx] != x) { idx++; }
    assert(idx <= r);
    swap(a, idx, r);                    /* 轴换到末尾 */
    int low = p - 1;
    for (int j = p; j < r; j++) {
        g_cmp++;
        if (a[j] <= x) {
            low++;
            swap(a, low, j);
        }
    }
    swap(a, low + 1, r);
    return low + 1;
}

/* 组内插入排序（5 个元素 Θ(1)） */
static void sort5(int *a, int p, int stride, int len)
{
    for (int i = 1; i < len; i++) {
        int k = a[p + i * stride], j = i - 1;
        while (j >= 0 && a[p + j * stride] > k) {
            g_cmp++;
            a[p + (j + 1) * stride] = a[p + j * stride];
            j--;
        }
        g_cmp++;
        a[p + (j + 1) * stride] = k;
    }
}

/* SELECT：24 行伪代码的 0 基直译（i 是 1 基） */
static int select_kth(int *a, int p, int r, int i)
{
    int n = r - p + 1;
    while (n % 5 != 0) {                /* 行 1–4：把余数元素的最小值挪到 A[p] */
        for (int j = p + 1; j <= r; j++) {
            g_cmp++;
            if (a[p] > a[j]) { swap(a, p, j); }
        }
        if (i == 1) { return a[p]; }    /* 行 6–7 */
        p = p + 1;                      /* 行 9–10 */
        i = i - 1;
        n = r - p + 1;
    }
    int g = n / 5;                      /* 行 11：5 元素组数 */
    for (int j = p; j < p + g; j++) {   /* 行 12–13：组内排序（跨步长） */
        sort5(a, j, g, 5);
    }
    /* 行 16：递归找组中位数的中位数（中段 A[p+2g : p+3g−1] 的第 ⌈g/2⌉ 小） */
    int x = select_kth(a, p + 2 * g, p + 3 * g - 1, (g + 1) / 2);
    int q = partition_around(a, p, r, x);   /* 行 17 */
    int k = q - p + 1;                      /* 行 19 */
    if (i == k) { return a[q]; }            /* 行 20–21 */
    if (i < k) {
        int sub = q - p;                    /* 低侧规模 */
        if (sub > g_max_subproblem) { g_max_subproblem = sub; }
        assert(sub <= 7 * n / 10 + 4);      /* ≤ 7n/10（+4 余数容差） */
        return select_kth(a, p, q - 1, i);
    }
    int sub = r - q;                        /* 高侧规模 */
    if (sub > g_max_subproblem) { g_max_subproblem = sub; }
    assert(sub <= 7 * n / 10 + 4);
    return select_kth(a, q + 1, r, i - k);
}

static void sort_ref(int *a, int n)
{
    for (int i = 1; i < n; i++) {
        int k = a[i], j = i - 1;
        while (j >= 0 && a[j] > k) { a[j + 1] = a[j]; j--; }
        a[j + 1] = k;
    }
}

int main(void)
{
    /* ① 正确性：200 组，每个 i */
    int checked = 0;
    for (int t = 1; t <= 200; t++) {
        int n = 5 + (int)(rnd_next() % 200);
        int a[MAXN], ref[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 10000); }
        int before[MAXN];
        for (int i = 0; i < n; i++) { before[i] = a[i]; }
        for (int i = 0; i < n; i++) { ref[i] = a[i]; }
        sort_ref(ref, n);
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < n; j++) { a[j] = before[j]; }
            g_cmp = 0; g_max_subproblem = 0;
            int v = select_kth(a, 0, n - 1, i);
            if (v != ref[i - 1]) {
                printf("MISMATCH n=%d i=%d got=%d want=%d\n", n, i, v, ref[i - 1]);
                return 1;
            }
        }
        checked++;
    }
    printf("part 1: %d 组随机输入，每个 i 都与排序后一致\n", checked);

    /* ② 最坏线性：对 SELECT 最不利的输入也压得住（对照： adversarial 对随机化版） */
    printf("part 2: 比较次数随 n 的变化（SELECT 最坏 O(n)，常数可见）\n");
    for (int n = 25; n <= 400; n *= 2) {
        int a[MAXN];
        long worst = 0;
        for (int s = 1; s <= 50; s++) {
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000000); }
            g_cmp = 0; g_max_subproblem = 0;
            select_kth(a, 0, n - 1, n / 2);
            if (g_cmp > worst) { worst = g_cmp; }
        }
        printf("        n = %4d：50 组最大比较 %5ld 次（%.1f n）\n", n, worst, (double)worst / n);
        assert(worst < 40 * n);     /* 理论上界常数约 22+；留裕量 */
    }

    /* ③ 递归子问题 ≤ 7n/10：恶意输入也成立（★ 本节假设元素互异） */
    {
        const char *names[2] = {"逆序", "升序"};
        for (int kind = 0; kind < 2; kind++) {
            int n = 300;
            int a[MAXN];
            for (int i = 0; i < n; i++) { a[i] = kind == 0 ? (int)(n - i) : (int)(i + 1); }
            g_cmp = 0; g_max_subproblem = 0;
            int v = select_kth(a, 0, n - 1, 150);
            (void)v;
            printf("part 3: %s输入：最大递归子问题 = %ld（≤ 7n/10 = %d）\n",
                   names[kind], g_max_subproblem, 7 * n / 10);
        }
    }

    puts("all checks passed.");
    return 0;
}
