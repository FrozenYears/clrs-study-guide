/*
 * count_ops.c — 计数版插入排序（CLRS 第 4 版 2.2 节「分析算法」的 C 实现）
 *
 * 2.2 节不做新算法，做的是"数次数"。这份实现把书里的两个量真的数出来：
 *
 *   t_i   = 第 5 行 while 的判断，在 i 取某个值时被执行了多少次
 *   Σt_i  = 上面那个量对 i = 2 .. n 的求和（本文件记作 t5）
 *   搬移   = 第 6 行 A[j + 1] = A[j] 的执行次数，等于 Σ(t_i − 1)
 *
 * 注意搬移只数第 6 行。第 8 行的落位 A[j + 1] = key 每轮执行一次、
 * 一共 n − 1 次，它是"把 key 放回去"而不是"元素移位"，本文件不计入搬移 ——
 * 页面上的计数器也按这个口径分开显示（Σt_i 与"触发搬移"是两个量）。
 *
 * 下标约定：书上从 1 开始（A[1 .. n]），本文件从 0 开始。
 *   书中 A[i] ↔ 本文件 a[i - 1]，书上所有下标减 1 即可。
 *   书上第 5 行 while j > 0 and A[j] > key
 *              ↔ 本文件 while (j >= 0 && a[j] > key)
 *   注意 j >= 0 而不是 j > 0 —— 这是这个算法最常见的 bug。
 *
 * 本文件刻意让 while 的条件写法与书上一字不差，只在进入循环前和每轮循环
 * 体结束时各 +1 一次，从而精确等于"条件被判断的次数"：
 *   · 每轮循环体执行后回到循环头，必然再判断一次；
 *   · 最后一次判断（条件为假、循环退出）同样是"一次判断"，必须计入 ——
 *     这正是 t_i 定义里最容易少算的那一次。
 *
 * 编译（本机无 gcc，未实测）：
 *   gcc -std=c99 -Wall -Wextra -o count_ops count_ops.c && ./count_ops
 */
#include <stdio.h>
#include <assert.h>

/* 插入排序，顺手统计两个量。返回排序后的 Σt_i。 */
static long insertion_sort_counted(int a[], int n, long *moves_out)
{
    long t5 = 0;        /* Σ t_i：第 5 行 while 条件被判断的总次数 */
    long moves = 0;     /* 第 6 行被执行的总次数 */

    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;

        t5++;                                   /* 进入循环前的第一次判断 */
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            moves++;
            j--;
            t5++;                               /* 回到循环头，再判断一次 */
        }
        a[j + 1] = key;
    }

    *moves_out = moves;
    return t5;
}

static void fill_descending(int a[], int n)
{
    for (int i = 0; i < n; i++) {
        a[i] = n - i;
    }
}

static void check_correct(const char *name, int a[], int n, const int expected[])
{
    long moves = 0;
    (void)insertion_sort_counted(a, n, &moves);
    for (int i = 0; i < n; i++) {
        assert(a[i] == expected[i]);
    }
    printf("ok: %s\n", name);
}

int main(void)
{
    /* ---- 1. 排序结果仍然正确（与插入排序本身一致） ---- */
    {
        int a[] = {5, 2, 4, 6, 1, 3};
        int e[] = {1, 2, 3, 4, 5, 6};
        check_correct("sort fig2.2", a, 6, e);
    }
    {
        int a[] = {6, 5, 4, 3, 2, 1};
        int e[] = {1, 2, 3, 4, 5, 6};
        check_correct("sort reverse6", a, 6, e);
    }
    {
        int a[] = {2, 2, 1, 1, 3, 3};
        int e[] = {1, 1, 2, 2, 3, 3};
        check_correct("sort duplicates", a, 6, e);
    }
    {
        int a[] = {42};
        int e[] = {42};
        check_correct("sort single", a, 1, e);
    }

    /* ---- 2. 逐轮 t_i：原书 Figure 2.2 的数组 ⟨5, 2, 4, 6, 1, 3⟩ ---- */
    {
        int a[] = {5, 2, 4, 6, 1, 3};
        int n = 6;
        long t5 = 0, moves = 0;
        long ti[6] = {0};

        /* 逐轮手动展开，把 t_2 .. t_6 打出来，与正文表格逐格对照 */
        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;
            long c = 1;                      /* 进入循环前的第一次判断 */
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                moves++;
                j--;
                c++;
            }
            a[j + 1] = key;
            ti[i] = c;                       /* ti[1] 对应书中的 t_2 */
            t5 += c;
        }

        printf("\nfig2.2  <5,2,4,6,1,3> 逐轮 t_i：");
        for (int i = 1; i < n; i++) {
            printf(" t_%d=%ld", i + 1, ti[i]);
        }
        printf("\n           Σt_i = %ld（本站按第 29 页 t_i 的定义逐轮算出；原书未印这张表）\n", t5);
        printf("           搬移 = %ld = Σ(t_i − 1)\n", moves);
        assert(t5 == 14);
        assert(moves == 9);
    }

    /* ---- 3. 最好情况：输入已排序，t_i = 1，Σt_i = n − 1 ---- */
    for (int n = 1; n <= 8; n++) {
        int a[16];
        long moves = 0;
        for (int i = 0; i < n; i++) a[i] = i + 1;      /* 已排序 */
        long t5 = insertion_sort_counted(a, n, &moves);
        assert(t5 == (n >= 1 ? n - 1 : 0));            /* Σt_i = n − 1 */
        assert(moves == 0);
        printf("best  n=%d  Σt_i=%-3ld  搬移=%-3ld  （书上 (2.1) 式：n − 1 = %d）\n",
               n, t5, moves, n - 1);
    }

    /* ---- 4. 最坏情况：输入完全逆序，t_i = i，Σt_i = n(n+1)/2 − 1 ---- */
    for (int n = 1; n <= 8; n++) {
        int a[16];
        long moves = 0;
        fill_descending(a, n);
        long t5 = insertion_sort_counted(a, n, &moves);
        long expect_t5 = (long)n * (n + 1) / 2 - 1;    /* 附录 A 式 (A.2) */
        long expect_moves = (long)n * (n - 1) / 2;     /* Σ(t_i − 1) */
        assert(t5 == expect_t5);
        assert(moves == expect_moves);
        printf("worst n=%d  Σt_i=%-3ld  搬移=%-3ld  （书上 (2.2) 式的分子：%ld / %ld）\n",
               n, t5, moves, expect_t5, expect_moves);
    }

    /* ---- 5. 增长趋势：n 翻倍，Σt_i 约变四倍（二次函数） ---- */
    printf("\n最坏情况随 n 的增长（Σt_i = n(n+1)/2 − 1）：\n");
    for (int n = 100; n <= 1600; n *= 2) {
        int a[2048];
        long moves = 0;
        fill_descending(a, n);
        long t5 = insertion_sort_counted(a, n, &moves);
        long expect = (long)n * (n + 1) / 2 - 1;
        assert(t5 == expect);
        printf("  n=%-5d  Σt_i=%-9ld  n²/2≈%-9ld  比值 Σt_i/n² = %.4f\n",
               n, t5, (long)n * n / 2, (double)t5 / ((double)n * n));
    }

    printf("\nALL COUNT-OPS TESTS PASSED\n");
    return 0;
}
