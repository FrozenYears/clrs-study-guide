/*
 * insertion_sort.c — 插入排序（CLRS 第 4 版 INSERTION-SORT 的 C 实现）
 *
 * 书中伪代码下标从 1 开始（A[1 .. n]），本实现从 0 开始。
 * 对应关系（新手最容易翻车的点）：书中的 A[i] ↔ 本文件的 a[i-1]。
 *   书第 2 行  key = A[i]        →  key = a[i-1]
 *   书第 4 行  j = i - 1          →  j = i - 1
 *   书第 5 行  while j > 0 and A[j] > key
 *                             →  while (j >= 0 && a[j] > key)
 *   书第 6 行  A[j + 1] = A[j]    →  a[j + 1] = a[j]
 *   书第 8 行  A[j + 1] = key     →  a[j + 1] = key
 * 即：把书上所有下标都减 1 即可。循环不变量 A[1..i-1] 已排序 ↔ a[0..i-1] 已排序。
 */
#include <stdio.h>
#include <assert.h>

void insertion_sort(int a[], int n)
{
    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}

static void check(const char *name, int a[], int n, const int expected[])
{
    insertion_sort(a, n);
    for (int i = 0; i < n; i++) {
        assert(a[i] == expected[i]);
    }
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

    int a4[] = {2, 2, 1, 1, 3, 3};
    int e4[] = {1, 1, 2, 2, 3, 3};
    check("duplicates", a4, 6, e4);

    int a5[] = {42};
    int e5[] = {42};
    check("single", a5, 1, e5);

    int a6[1] = {7};
    check("empty", a6, 0, a6);   /* n = 0：循环不执行，直接通过 */

    printf("ALL INSERTION-SORT TESTS PASSED\n");
    return 0;
}
