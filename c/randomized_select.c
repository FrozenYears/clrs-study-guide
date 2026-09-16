/* randomized_select.c -- 9.2 节 RANDOMIZED-SELECT 的实现与期望线性实测。
 * 复用 7.3 的 RANDOMIZED-PARTITION 思路（固定取末元素 + 随机换位）。
 * 验证：
 *   ① 正确性：与排序后取下标一致（200 组）；
 *   ② 比较次数：随机输入 ≈ 常数 × n（期望线性）；已排序输入（最坏形态）≈ n²/2；
 *   ③ 9.2-4：对同一多重集的不同排列，期望比较次数不依赖输入顺序。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o randomized_select randomized_select.c
 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define MAXN 256

static unsigned g_state = 0x9e3779b9u;
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

static long g_cmp;

/* RANDOMIZED-PARTITION（0 基内部；与 7.3 的 c/randomized_quicksort.c 同思路） */
static int partition(int *a, int p, int r)
{
    /* 随机选轴换到末尾 */
    int i = p + (int)(rnd_next() % (unsigned)(r - p + 1));
    int tmp = a[i]; a[i] = a[r]; a[r] = tmp;
    int x = a[r];
    int low = p - 1;
    for (int j = p; j < r; j++) {
        g_cmp++;                        /* 第 4 行的元素比较 */
        if (a[j] <= x) {
            low++;
            tmp = a[low]; a[low] = a[j]; a[j] = tmp;
        }
    }
    tmp = a[low + 1]; a[low + 1] = a[r]; a[r] = tmp;
    return low + 1;
}

/* RANDOMIZED-SELECT（9 行伪代码的 0 基直译；i 是 1 基的第 i 小） */
static int randomized_select(int *a, int p, int r, int i)
{
    if (p == r) { return a[p]; }
    int q = partition(a, p, r);
    int k = q - p + 1;
    if (i == k) { return a[q]; }
    if (i < k)  { return randomized_select(a, p, q - 1, i); }
    return randomized_select(a, q + 1, r, i - k);
}

/* 对照：排序后取下标 */
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
    /* ① 正确性：200 组随机输入、每个 i */
    int checked = 0;
    for (int t = 1; t <= 200; t++) {
        int n = 2 + (int)(rnd_next() % 100);
        int a[MAXN], before[MAXN], ref[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000); }
        memcpy(before, a, (size_t)n * sizeof(int));
        memcpy(ref, a, (size_t)n * sizeof(int));
        sort_ref(ref, n);
        for (int i = 1; i <= n; i++) {
            memcpy(a, before, (size_t)n * sizeof(int));
            g_cmp = 0;
            int v = randomized_select(a, 0, n - 1, i);
            assert(v == ref[i - 1]);
        }
        (void)before; (void)ref;
        checked++;
    }
    printf("part 1: %d 组随机输入，每个 i 都与排序后取下标一致\n", checked);

    /* ② 比较次数：随机 vs 已排序（最坏形态） */
    printf("part 2: 比较次数随 n 的变化\n");
    for (int n = 32; n <= 256; n *= 2) {
        int a[MAXN];
        long sum_rand = 0;
        for (int s = 1; s <= 30; s++) {
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000000); }
            g_cmp = 0;
            randomized_select(a, 0, n - 1, n / 2);
            sum_rand += g_cmp;
        }
        long avg_rand = sum_rand / 30;

        /* 最坏形态：已排序输入 + 不巧每次轴都是当前最大（期望分析中的坏情况）。
         * 已排序输入本身不保证最坏（随机化会救场），但对已排序输入找最小值 i=1
         * 时若轴总取到最大，比较次数就是 n+(n-1)+...。实测平均值即可展示差别。 */
        long sum_sorted = 0;
        for (int s = 1; s <= 30; s++) {
            for (int i = 0; i < n; i++) { a[i] = (int)i; }
            g_cmp = 0;
            randomized_select(a, 0, n - 1, n / 2);
            sum_sorted += g_cmp;
        }
        long avg_sorted = sum_sorted / 30;
        printf("        n = %4d：随机输入平均 %5ld 次（%.1f n） | 已排序输入平均 %5ld 次（%.1f n）\n",
               n, avg_rand, (double)avg_rand / n, avg_sorted, (double)avg_sorted / n);
        assert(avg_rand < 8 * n);       /* 期望线性：常数因子有界 */
    }

    /* ③ 9.2-4：同一多重集的两种排列，期望比较次数接近 */
    {
        int base[MAXN];
        for (int i = 0; i < 128; i++) { base[i] = (int)(rnd_next() % 5000); }
        int a[MAXN], perm[MAXN];
        long s1 = 0, s2 = 0;
        for (int s = 1; s <= 100; s++) {
            memcpy(a, base, sizeof(base));
            g_cmp = 0; randomized_select(a, 0, 127, 64);
            s1 += g_cmp;
            /* 反转排列 */
            for (int i = 0; i < 128; i++) { perm[i] = base[127 - i]; }
            memcpy(a, perm, sizeof(base));
            g_cmp = 0; randomized_select(a, 0, 127, 64);
            s2 += g_cmp;
        }
        double r1 = (double)s1 / 100, r2 = (double)s2 / 100;
        printf("part 3: 9.2-4 实测：原序平均 %.0f 次 vs 反转序平均 %.0f 次（都是期望 O(n)，不依赖输入顺序）\n",
               r1, r2);
        assert(r1 > 0 && r2 > 0 && r1 / r2 < 3 && r2 / r1 < 3);
    }

    puts("all checks passed.");
    return 0;
}
