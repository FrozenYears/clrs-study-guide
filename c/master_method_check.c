/* master_method_check.c -- 4.5 节的数值实验：用数值验证主方法三种情况。
 *
 * 书中对应（第 4 版）：
 *   p.101-102  主方法描述 T(n) = aT(n/b) + f(n)（递归式 4.16）
 *   p.103      主定理（Theorem 4.1）三种情况
 *   p.104      例：9T(n/3)+n（情况 1）、T(2n/3)+1（情况 2）、3T(n/4)+n lg n（情况 3）
 *   p.105      归并排序 2T(n/2)+Θ(n)（情况 2）、矩阵乘法 8T(n/2)+Θ(1)（情况 1）、
 *              Strassen 7T(n/2)+Θ(n²)（情况 1）
 *
 * 取 a=2, b=2（即归并排序的形状），分母函数分别取三种情况，逐层求和：
 *   情况 1  f(n)=1   叶子主导   ->  T(n) = Θ(n)
 *   情况 2  f(n)=n   每层平摊   ->  T(n) = Θ(n lg n)
 *   情况 3  f(n)=n²  根主导     ->  T(n) = Θ(n²)
 *
 * 与 4.4 节递归树的对应：分母在叶子处被吞（情况 1）、逐层平摊（情况 2）、
 * 根处压倒（情况 3）。C 程序把三种结局都算成具体的数。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o master_method_check master_method_check.c
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

/* 情况 k 的总代价：递归树的逐层求和。
 * a=b=2 时树高 floor(lg n)，第 d 层有 2^d 个结点、每个代价 f(n / 2^d)。
 * 递归到底层 n=1 时叶子代价 T(1)=1。 */
static long total_cost(long n, int kase)
{
    if (n <= 1) {
        return 1;
    }
    long here;
    switch (kase) {
    case 1:  here = 1;         break;   /* f(n) = Theta(1)  */
    case 2:  here = n;         break;   /* f(n) = Theta(n)  */
    case 3:  here = n * n;     break;   /* f(n) = Theta(n^2)*/
    default: here = 0;         break;
    }
    return here + total_cost(n / 2, kase) + total_cost(n - n / 2, kase);
}

int main(void)
{
    const long n = 1024;   /* 2^10，树高 10 */
    double lg_n = log2((double)n);
    printf("master recurrence: T(n) = 2T(n/2) + f(n),  n = %ld = 2^10\n\n", n);

    /* ---- 情况 1：f(n) = Θ(1)，叶子主导 ---- */
    long t1 = total_cost(n, 1);
    printf("case 1:  f(n) = Theta(1)\n");
    printf("  total = %ld,  n = %ld,  total/n = %.4f  ->  Theta(n)\n\n",
           t1, n, (double)t1 / (double)n);
    assert(t1 == n * 2 - 1);  /* 满二叉树结点总数 = 2n - 1 */
    assert(t1 / n == 2 || t1 / n == 1);  /* 渐近 O(n) 且 Omega(n) */

    /* ---- 情况 2：f(n) = Θ(n)，逐层平摊 ---- */
    long t2 = total_cost(n, 2);
    printf("case 2:  f(n) = Theta(n)\n");
    printf("  total = %ld,  n lg n = %.0f,  total/(n lg n) = %.4f  ->  Theta(n lg n)\n\n",
           t2, n * lg_n, (double)t2 / (double)(n * lg_n));
    assert(t2 > n && t2 < 3L * n * (long)lg_n);

    /* ---- 情况 3：f(n) = Θ(n²)，根主导 ---- */
    long t3 = total_cost(n, 3);
    printf("case 3:  f(n) = Theta(n^2)\n");
    printf("  total = %ld,  n^2 = %ld,  total/n^2 = %.4f  ->  Theta(n^2)\n\n",
           t3, n * n, (double)t3 / ((double)n * n));
    assert(t3 > (long)(0.9 * n * n) && t3 < (long)(4.0 * n * n));

    /* ---- 与书上例子的对应（p.104-105）----
     * 归并排序  2T(n/2)+Θ(n)   -> 情况 2 -> Θ(n lg n)    (p.104)
     * 矩阵乘法  8T(n/2)+Θ(1)   -> 情况 1 -> Θ(n^3)       (p.105)
     * Strassen  7T(n/2)+Θ(n²)  -> 情况 1 -> Θ(n^lg7)     (p.105)
     * （a,b 不同所以本程序取 a=b=2 统一演示；三种结局的形状一致。） */
    printf("book examples (p.104-105):\n");
    printf("  merge sort   2T(n/2)+Theta(n)   case 2  -> Theta(n lg n)\n");
    printf("  matrix mult  8T(n/2)+Theta(1)   case 1  -> Theta(n^3)\n");
    printf("  Strassen     7T(n/2)+Theta(n^2) case 1  -> Theta(n^lg7)\n");

    printf("\nall checks passed.\n");
    return 0;
}
