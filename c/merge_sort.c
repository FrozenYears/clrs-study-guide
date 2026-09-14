/*
 * merge_sort.c — 归并排序（CLRS 第 4 版 MERGE-SORT / MERGE 的 C 实现）
 *
 * 书中下标从 1 开始；本实现从 0 开始。对应关系（以 MERGE(A, p, q, r) 为例，
 * p/q/r 均以 1 基传入）：
 *   书中 A[p : q]            ↔ 本文件 a[p-1 .. q-1]
 *   书中 A[q+1 : r]          ↔ 本文件 a[q .. r-1]
 *   书中 L[0 : nL-1] / R[..] ↔ 本文件 L[0 .. nL-1] / R[..]（与原书 L/R 同为 0 基）
 *   书第 13 行 if L[i] <= R[j]  ↔  同样
 * 第 4 版 MERGE 不使用 ∞ 哨兵，而是 "复制 + 剩余复制循环"（第 20–27 行）。
 * 顶层入口：sort_into(a, n) 在整段 a[0 .. n-1] 上排序。
 */
#include <stdio.h>
#include <assert.h>
#include <stdlib.h>

static void merge(int a[], int p, int q, int r)
{
    int nL = q - p + 1;                 /* 书第 1 行 */
    int nR = r - q;                     /* 书第 2 行 */
    int *L = malloc((size_t)nL * sizeof(int));
    int *R = malloc((size_t)nR * sizeof(int));
    for (int i = 0; i < nL; i++) L[i] = a[p - 1 + i];   /* 书第 4–5 行 */
    for (int j = 0; j < nR; j++) R[j] = a[q + j];       /* 书第 6–7 行 */
    int i = 0, j = 0, k = p;                            /* 书第 8–10 行 */
    while (i < nL && j < nR) {                          /* 书第 12 行 */
        if (L[i] <= R[j]) { a[k - 1] = L[i]; i++; }     /* 书第 13–15 行 */
        else { a[k - 1] = R[j]; j++; }                  /* 书第 16–17 行 */
        k++;                                            /* 书第 18 行 */
    }
    while (i < nL) { a[k - 1] = L[i]; i++; k++; }        /* 书第 20–23 行 */
    while (j < nR) { a[k - 1] = R[j]; j++; k++; }        /* 书第 24–27 行 */
    free(L);
    free(R);
}

static void merge_sort(int a[], int p, int r)
{
    if (p >= r) return;                 /* 书第 1–2 行 */
    int q = (p + r) / 2;                /* 书第 3 行：1 基下 q = floor((p + r) / 2) */
    merge_sort(a, p, q);                /* 书第 4 行 */
    merge_sort(a, q + 1, r);            /* 书第 5 行 */
    merge(a, p, q, r);                  /* 书第 7 行 */
}

static void sort_into(int a[], int n)
{
    if (n > 0) merge_sort(a, 1, n);     /* 1 基闭区间 [1, n] */
}

static void check(const char *name, int a[], int n, const int expected[])
{
    sort_into(a, n);
    for (int i = 0; i < n; i++) assert(a[i] == expected[i]);
    printf("ok: %s\n", name);
}

int main(void)
{
    int a1[] = {5, 2, 4, 6, 1, 3};
    int e1[] = {1, 2, 3, 4, 5, 6};
    check("fig2.2", a1, 6, e1);

    int a2[] = {6, 5, 4, 3, 2, 1};
    int e2[] = {1, 2, 3, 4, 5, 6};
    check("reverse6", a2, 6, e2);

    int a3[] = {12, 3, 7, 9, 14, 6, 11, 2};
    int e3[] = {2, 3, 6, 7, 9, 11, 12, 14};
    check("fig2.4", a3, 8, e3);

    int a4[] = {2, 4, 6, 7, 1, 2, 3, 5};   /* 原书 Figure 2.3 的 L+R 合并 */
    int e4[] = {1, 2, 2, 3, 4, 5, 6, 7};
    check("fig2.3-merge", a4, 8, e4);

    int a5[] = {42};
    int e5[] = {42};
    check("single", a5, 1, e5);

    int a6[1] = {7};
    check("empty", a6, 0, a6);

    printf("ALL MERGE-SORT TESTS PASSED\n");
    return 0;
}