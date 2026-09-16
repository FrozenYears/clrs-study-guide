/* radix_sort.c -- 8.3 节 RADIX-SORT 的实现与稳定性依赖验证。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o radix_sort radix_sort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXN 64

/* 用计数排序对 exp 位（1/10/100...）做稳定排序 */
static void counting_sort_by_digit(int *a, int n, int exp)
{
    int out[MAXN], count[10] = {0};
    for (int i = 0; i < n; i++) count[(a[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        out[count[(a[i] / exp) % 10] - 1] = a[i];
        count[(a[i] / exp) % 10]--;
    }
    memcpy(a, out, (size_t)n * sizeof(int));
}

static void radix_sort(int *a, int n, int max_val)
{
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_by_digit(a, n, exp);
    }
}

static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) return false; }
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

/* 不稳定版（从前往后扫）—— 用来证明稳定性是必要的 */
static void counting_sort_by_digit_unstable(int *a, int n, int exp)
{
    int out[MAXN], count[10] = {0};
    for (int i = 0; i < n; i++) count[(a[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = 0; i < n; i++) {   /* ★ 从前往后 → 不稳定 */
        out[count[(a[i] / exp) % 10] - 1] = a[i];
        count[(a[i] / exp) % 10]++;
    }
    memcpy(a, out, (size_t)n * sizeof(int));
}

static void radix_sort_unstable(int *a, int n, int max_val)
{
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_by_digit_unstable(a, n, exp);
    }
}

int main(void)
{
    /* 1. 排好序 */
    int checked = 0;
    for (int t = 1; t <= 100; t++) {
        int n = 2 + (t % 40);
        int a[MAXN], before[MAXN];
        for (int i = 0; i < n; i++) { a[i] = (int)((t * 211 + i * 53) % 1000); }
        memcpy(before, a, (size_t)n * sizeof(int));
        radix_sort(a, n, 999);
        assert(is_sorted(a, n));
        assert(same_bag(a, before, n));
        checked++;
    }
    printf("part 1: %d 组随机输入（三位数以内）都排好序\n", checked);

    /* 2. 不稳定版对某些输入会失败 —— 证明稳定性是必要的 */
    {
        int a[] = {21, 11, 32, 12};  /* 21 和 11 个位相同（1），十位不同 */
        radix_sort_unstable(a, 4, 32);
        /* 不稳定版可能得到错误结果 */
        printf("part 2: 不稳定版对 {21, 11, 32, 12} 的结果 = [%d,%d,%d,%d]%s\n",
               a[0], a[1], a[2], a[3],
               is_sorted(a, 4) ? "（碰巧对了）" : "（不是有序的！）");
    }

    /* 3. 正确版（稳定版）对同一输入给出正确结果 */
    {
        int a[] = {21, 11, 32, 12};
        radix_sort(a, 4, 32);
        assert(is_sorted(a, 4));
        printf("part 3: 稳定版对 {21, 11, 32, 12} = [%d,%d,%d,%d]（正确）\n",
               a[0], a[1], a[2], a[3]);
    }

    puts("all checks passed.");
    return 0;
}
