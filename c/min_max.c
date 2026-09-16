/* min_max.c -- 9.1 节：最小值与最大值的比较次数实测。
 * 验证三个断言：
 *   ① MINIMUM 恰好用 n − 1 次比较（且这是下界）；
 *   ② 分别找 min 和 max 用 2n − 2 次；
 *   ③ 成对处理法最多 3⌊n/2⌋ 次（奇数 3⌊n/2⌋，偶数 3n/2 − 2）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o min_max min_max.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 256

static unsigned g_state = 0x9e3779b9u;
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

/* ① 独立找最小值：恰好 n − 1 次比较 */
static long g_cmp;

static int find_min(const int *a, int n)
{
    int min = a[0];
    for (int i = 1; i < n; i++) {
        g_cmp++;                        /* 比较 min > A[i] */
        if (min > a[i]) { min = a[i]; }
    }
    return min;
}

/* ② 独立找 min 和 max：2n − 2 次 */
static void find_min_max_naive(const int *a, int n, int *mn, int *mx)
{
    int min = a[0], max = a[0];
    for (int i = 1; i < n; i++) {
        g_cmp++; if (min > a[i]) { min = a[i]; }
        g_cmp++; if (max < a[i]) { max = a[i]; }
    }
    *mn = min; *mx = max;
}

/* ③ 成对处理法：≤ 3⌊n/2⌋ 次（伪代码没有给——书上是文字描述，这里照文字实现） */
static void find_min_max_paired(const int *a, int n, int *mn, int *mx)
{
    int min, max, i = 1;
    if (n % 2 == 1) {
        min = max = a[0];               /* 奇数：第一个元素同时当两者 */
    } else {
        g_cmp++;                        /* 偶数：先比 1 次 */
        if (a[0] < a[1]) { min = a[0]; max = a[1]; }
        else             { min = a[1]; max = a[0]; }
        i = 2;
    }
    for (; i + 1 < n; i += 2) {
        int lo, hi;
        g_cmp++;                        /* 对内比较 1 次 */
        if (a[i] < a[i + 1]) { lo = a[i]; hi = a[i + 1]; }
        else                 { lo = a[i + 1]; hi = a[i]; }
        g_cmp++; if (lo < min) { min = lo; }
        g_cmp++; if (hi > max) { max = hi; }
    }
    *mn = min; *mx = max;
}

int main(void)
{
    int checked = 0;
    long cmp_naive_max = 0, cmp_paired_max = 0;
    for (int t = 1; t <= 200; t++) {
        int n = 2 + (int)(rnd_next() % 120);
        int a[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 1000); }

        /* ① MINIMUM 恰好 n − 1 次 */
        g_cmp = 0;
        int mn1 = find_min(a, n);
        assert(g_cmp == n - 1);

        /* ② 分别找 = 2n − 2 */
        g_cmp = 0;
        int mn2, mx2;
        find_min_max_naive(a, n, &mn2, &mx2);
        assert(g_cmp == 2 * n - 2);
        if (g_cmp > cmp_naive_max) { cmp_naive_max = g_cmp; }

        /* ③ 成对法 ≤ 3⌊n/2⌋ */
        g_cmp = 0;
        int mn3, mx3;
        find_min_max_paired(a, n, &mn3, &mx3);
        int bound = 3 * (n / 2);
        assert(g_cmp <= bound);
        if (g_cmp > cmp_paired_max) { cmp_paired_max = g_cmp; }

        /* 结果一致 */
        assert(mn1 == mn2 && mn2 == mn3);
        assert(mx2 == mx3);
        checked++;
    }
    printf("part 1: %d 组输入\n", checked);
    printf("part 2: MINIMUM 恰好 n−1 次比较（每次都验证）\n");
    printf("part 3: 独立找 min+max = 2n−2（最大实测 %ld 次）\n", cmp_naive_max);
    printf("part 4: 成对法 ≤ 3⌊n/2⌋（最大实测 %ld 次）—— 节省约 25%%\n", cmp_paired_max);

    /* 对照表：n = 10 时三种方法的比较次数 */
    {
        int a[10] = {3, 41, 52, 26, 38, 57, 9, 49, 4, 12};
        g_cmp = 0; find_min(a, 10);
        long c1 = g_cmp;
        g_cmp = 0; int mn, mx; find_min_max_naive(a, 10, &mn, &mx);
        long c2 = g_cmp;
        g_cmp = 0; find_min_max_paired(a, 10, &mn, &mx);
        long c3 = g_cmp;
        printf("part 5: n = 10 对照：找 min %ld 次 | 独立找两者 %ld 次 | 成对法 %ld 次（偶数 = 3n/2−2 = 13 ≤ 3⌊n/2⌋ = 15）\n",
               c1, c2, c3);
        assert(c1 == 9 && c2 == 18 && c3 == 13);
    }

    puts("all checks passed.");
    return 0;
}
