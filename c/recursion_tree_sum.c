/* recursion_tree_sum.c -- 4.4 节的数值实验：把递归树算成账。
 *
 * 书中对应（第 4 版）：
 *   p.95-97  例 1（图 4.1）：T(n) = 3T(n/4) + n^2，逐层展开、逐层求和，
 *            几何级数（公比 3/16 < 1）收敛 -> T(n) = O(n^2)；
 *   p.98-100 例 2（图 4.2）：T(n) = T(n/3) + T(2n/3) + n，树是歪的
 *            （高度 Theta(lg n)），但**每一层的合计仍是 n**，
 *            内部结点总代价 O(n lg n)，叶子 Theta(n) -> T(n) = O(n lg n)。
 *
 * 与书中公式的对应：
 *   part 1  取 n = 64 = 4^3，树恰好 3 层就到叶（叶 27 = 3^3 个）。
 *           逐层代价 4096 / 768 / 144 = n^2 · (3/16)^i，内部合计 5008，
 *           上界 (16/13)·n^2 = 5041.2 —— 无穷几何级数的和。
 *   part 2  取 n = 81 = 3^4，沿最重的路径（每次取 2n/3）树最深，
 *           逐层合计恒为 n（二项恒等式），内部总代价 / (n lg n) -> 1/lg(3/2) ≈ 1.71。
 *
 * 书中伪代码下标从 1 开始，本实现从 0 开始，对应关系 A[i-1] <-> 书中的 A[i]。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o recursion_tree_sum recursion_tree_sum.c
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

/* ---- 例 1：T(n) = 3T(n/4) + n^2，把每一层的合计记进 levels[] ---- */
static long level_sum[64];

static long internal_total(long n, long depth)
{
    long here = n * n;                       /* 本结点的代价 c·(size)^2，取 c = 1 */
    level_sum[depth] += here;
    if (n <= 1) {
        return here;                          /* 叶子：Theta(1)，不再展开 */
    }
    long total = here;
    for (long k = 0; k < 3; k++) {            /* 3 个子问题，规模 n/4 */
        total += internal_total(n / 4, depth + 1);
    }
    return total;
}

/* 叶子个数：3^(log_4 n) —— 原书 p.97 说它等于 n^(log_4 3) */
static long leaf_count(long n)
{
    if (n <= 1) {
        return 1;
    }
    long c = 0;
    for (long k = 0; k < 3; k++) {
        c += leaf_count(n / 4);
    }
    return c;
}

/* ---- 例 2：T(n) = T(n/3) + T(2n/3) + n，返回内部结点的总代价 ---- */
static long irregular_total(long n)
{
    if (n < 1) {
        return 0;
    }
    long here = n;                            /* 本结点代价 c·size，取 c = 1 */
    if (n == 1) {
        return here;                          /* 叶子：Theta(1) */
    }
    return here + irregular_total(n / 3) + irregular_total(2 * n / 3);
}

int main(void)
{
    /* ---- part 1: 均匀树 T(n) = 3T(n/4) + n^2，n = 64 = 4^3 ----
     * 每下一层，层合计乘 3/16（几何衰减，公比 < 1 -> 级数收敛）。 */
    const long n1 = 64;
    (void)internal_total(n1, 0);              /* 顺带把 level_sum[] 填好 */
    long leaves = leaf_count(n1);

    printf("part 1: T(n) = 3T(n/4) + n^2,  n = %ld = 4^3\n", n1);
    printf("  %-7s %-9s %-14s %-16s\n", "depth", "#nodes", "node size", "level total");
    const char *sizes[4] = { "n", "n/4", "n/16", "n/64" };
    long expect = n1 * n1;
    for (long d = 0; d <= 3; d++) {
        long nodes = 1;
        for (long k = 0; k < d; k++) nodes *= 3;
        printf("  %-7ld %-9ld %-14s %-16ld\n", d, nodes, sizes[d], level_sum[d]);
        assert(level_sum[d] == expect);       /* 层合计 = n^2 (3/16)^d */
        expect = expect * 3 / 16;             /* 下一层 = 上一层 × 3/16 */
    }
    assert(leaves == 27);                     /* 叶子数 = 3^3 = n^(log_4 3) */

    long internal = level_sum[0] + level_sum[1] + level_sum[2];
    printf("  internal total = %ld,  (16/13) n^2 = %.1f  ->  O(n^2)\n",
           internal, 16.0 / 13.0 * (double)(n1 * n1));
    assert(internal * 13 <= 16L * n1 * n1);   /* 内部合计 <= (16/13) n^2 */
    printf("  leaf total = %ld * Theta(1) = Theta(n^(log_4 3)) = Theta(n^0.79)\n\n",
           leaves);

    /* ---- part 2: 歪树 T(n) = T(n/3) + T(2n/3) + n ----
     * 每一层的合计仍是 n（二项恒等式 (1/3 + 2/3)^d = 1），
     * 内部结点总代价 = n × (内部层数) ≈ n · lg n / lg(3/2)。 */
    printf("part 2: T(n) = T(n/3) + T(2n/3) + n   (unbalanced)\n");
    printf("  %-10s %-18s %-14s %-12s\n", "n", "internal total", "height h", "total/(n(h+1))");
    for (long n = 81; n <= 729; n *= 3) {
        long total = irregular_total(n);
        /* 书上 p.99 的论证：树高 h = ceil(log_{3/2}(n/n_0))，每层合计 <= n，
         * 故内部结点总代价 <= n(h+1) = O(n lg n)。这里逐项验证这个上界。 */
        long h = 0;
        double s = (double)n;
        while (s > 1.0) {                     /* 最重的路径：每次乘 2/3 */
            s *= 2.0 / 3.0;
            h++;
        }
        long bound = n * (h + 1);
        printf("  %-10ld %-18ld %-14ld %-12.4f\n", n, total, h,
               (double)total / (double)bound);
        assert(total <= bound);               /* O(n lg n) 的上界成立 */
    }
    printf("  ->  internal cost is O(n lg n);  leaves are Theta(n)\n");
    printf("  ->  T(n) = O(n lg n) + Theta(n) = O(n lg n)\n");

    printf("\nall checks passed.\n");
    return 0;
}
