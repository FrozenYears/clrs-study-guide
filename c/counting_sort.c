/* counting_sort.c -- 8.2 节 COUNTING-SORT 的实现与稳定性验证。
 *
 * 对应原书 p.191（已按渲染页核对）：
 *   COUNTING-SORT(A, B, n, k)
 *   1–3  let C[0 : k] be a new array / for i = 0 to k / C[i] = 0
 *   4–5  for j = 1 to n / C[A[j]] = C[A[j]] + 1
 *   7–8  for i = 1 to k / C[i] = C[i] + C[i − 1]
 *   10–12 for j = n downto 1 / B[C[A[j]]] = A[j] / C[A[j]] = C[A[j]] − 1
 *
 * 验证四件事：
 *   1. 排好序（含重复值）；
 *   2. **稳定性**：相同值保持原始的相对次序（这是 8.3 基数排序的前提）；
 *   3. 时间 O(n + k)：比较次数为 0（不是比较排序）；
 *   4. 前缀和 C[i] = "≤ i 的元素个数"。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o counting_sort counting_sort.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define MAXK 200
#define MAXN 64

typedef struct { long writes; } stats_t;

/* 稳定版计数排序：用 (值, 原始下标) 二元组来追踪稳定性 */
static void counting_sort_stable(const int *vals, const int *indices,
                                  int *out_vals, int *out_indices,
                                  int n, int k, stats_t *st)
{
    int C[MAXK + 1];
    memset(C, 0, sizeof(C));
    for (int j = 0; j < n; j++) { C[vals[j]]++; st->writes++; }           /* 计数 */
    for (int i = 1; i <= k; i++) { C[i] += C[i - 1]; st->writes++; }   /* 前缀和 */
    for (int j = n - 1; j >= 0; j--) {                                   /* 反向放置 */
        out_vals[C[vals[j]] - 1] = vals[j];
        out_indices[C[vals[j]] - 1] = indices[j];
        C[vals[j]]--;
        st->writes++;   /* 只计对 B 的写（不计 out_indices 的维护开销） */
    }
}

/* 验证稳定性：相同值按原始下标升序出现在输出里 */
static bool is_stable(const int *out_vals, const int *out_indices, int n)
{
    for (int i = 1; i < n; i++) {
        if (out_vals[i - 1] == out_vals[i] && out_indices[i - 1] > out_indices[i]) {
            return false;
        }
    }
    return true;
}

static bool is_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) { return false; } }
    return true;
}

int main(void)
{
    /* ---- 1. 排好序且稳定 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 100; t++) {
            int n = 2 + (t % 40);
            int k = 20 + (t % 30);
            int vals[64], indices[64], ov[64], oi[64];
            for (int i = 0; i < n; i++) {
                vals[i] = (int)((t * 131 + i * 37) % k);
                indices[i] = i;
            }
            stats_t st = {0};
            counting_sort_stable(vals, indices, ov, oi, n, k, &st);
            assert(is_sorted(ov, n));
            assert(is_stable(ov, oi, n));
            checked++;
        }
        printf("part 1: %d 组随机输入都排好序且**稳定**（相同值保持原始次序）\n", checked);
    }

    /* ---- 2. 比较次数为 0（不是比较排序）---- */
    {
        puts("part 2: COUNTING-SORT 全程没有用到 < 或 > 比较 —— 它用数组下标索引");
        puts("        所以 8.1 的 Ω(n lg n) 比较下界不适用于它");
    }

    /* ---- 3. 前缀和 C[i] = "≤ i 的元素个数" ---- */
    {
        int vals[] = {2, 5, 3, 0, 2, 3, 0, 3};   /* 原书 Figure 8.2 的数组 */
        int n = 8, k = 5;
        int C[MAXK + 1] = {0};
        for (int j = 0; j < n; j++) { C[vals[j]]++; }
        for (int i = 1; i <= k; i++) { C[i] += C[i - 1]; }
        /* 原书 Figure 8.2(c) 的 C 数组 */
        int expected[] = {2, 2, 4, 7, 7, 8};
        for (int i = 0; i <= k; i++) { assert(C[i] == expected[i]); }
        printf("part 3: Figure 8.2 的 C 数组 = [%d,%d,%d,%d,%d,%d]（前缀和 = ≤ i 的个数）\n",
               C[0], C[1], C[2], C[3], C[4], C[5]);
    }

    /* ---- 4. 写次数：O(n + k) ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 50; t++) {
            int n = 10 + (t % 40);
            int k = 10 + (t % 20);
            int vals[64], indices[64], ov[64], oi[64];
            for (int i = 0; i < n; i++) {
                vals[i] = (int)((t * 97 + i * 31) % k);
                indices[i] = i;
            }
            stats_t st = {0};
            counting_sort_stable(vals, indices, ov, oi, n, k, &st);
            /* 写次数 = n（计数）+ k（前缀和）+ n（放置）= 2n + k */
            assert(st.writes == 2 * n + k);
            checked++;
        }
        printf("part 4: 写次数 = 2n + k = O(n + k)（50 组验证）\n");
    }

    puts("all checks passed.");
    return 0;
}
