/* aggregate_counter.c -- 16.1 聚合分析：栈 + MULTIPOP，二进制计数器 INCREMENT。
 * 关键数字：n 次栈操作总代价 < 2n（摊还 O(1)/次）；
 *           二进制计数器 n 次自增总翻转位数 < 2n（n=16 时 31 次）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NMAX 64

/* ---------------- 实验 1：带 MULTIPOP 的栈 ---------------- */
static int stack[NMAX];
static int top;                       /* 栈内元素数（也当作 top 指针） */

/* 返回这次操作的实际代价（按"动过的元素数"计） */
static int op_push(int x) { stack[top++] = x; return 1; }
static int op_pop(void) { top--; return 1; }
static int op_multipop(int k)
{
    int cost = 0;
    while (top > 0 && k > 0) {        /* MULTIPOP 的 3 行直译 */
        top--; cost++; k--;
    }
    return cost;
}

/* 确定性伪随机：种子先做乘法混合，连续种子不相关 */
static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

/* ---------------- 实验 2：k 位二进制计数器 INCREMENT ---------------- */
static int bits[NMAX];                /* 低位在前 */

static int increment(int k)           /* 返回本次翻转的位数（实际代价） */
{
    int i = 0;
    while (i < k && bits[i] == 1) {   /* 行 1–4：把连着的 1 全翻成 0 */
        bits[i] = 0; i++;
    }
    if (i < k) { bits[i] = 1; }       /* 行 5–6 */
    return i + 1;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：聚合分析 —— 任意 n 个栈操作的总代价是 O(n) */
    {
        long total = 0;
        int n = 1000, ops = 0, pushes = 0, pops = 0, mpops = 0;
        top = 0;
        rng_seed(20260917);
        for (int i = 0; i < n; i++) {
            int r = (int)(rng_next() % 3);
            if (r == 0 || top == 0) { total += op_push(i); pushes++; }
            else if (r == 1) { total += op_pop(); pops++; }
            else { total += op_multipop((int)(rng_next() % 5)); mpops++; }
            ops++;
            assert(top >= 0 && top <= NMAX);
        }
        printf("part 1: %d 个栈操作（PUSH %d / POP %d / MULTIPOP %d），总代价 %ld\n",
               ops, pushes, pops, mpops, total);
        printf("        摊还代价 = 总代价/n < %.1f —— 聚合分析：总代价 O(n)，每个操作 O(1)\n",
               (double)total / ops);
        assert(total <= 2 * ops);
    }

    /* part 2：逐次打印计数器翻转位（n = 8，对应原书 Figure 16.2 的思想） */
    printf("part 2: 8 位计数器从 0 自增 8 次，每次翻转的位：\n");
    {
        memset(bits, 0, sizeof(bits));
        int total = 0;
        for (int step = 1; step <= 8; step++) {
            int c = increment(8);
            total += c;
            printf("        第 %d 次自增：翻转 %d 位 -> 值 %d（二进制 ",
                   step, c, bits[0] + 2 * bits[1] + 4 * bits[2] + 8 * bits[3]);
            for (int b = 3; b >= 0; b--) { printf("%d", bits[b]); }
            printf("）\n");
        }
        printf("        8 次共翻转 %d 位 < 2 * 8\n", total);
        assert(total < 2 * 8);
    }

    /* part 3：n 次自增的总翻转 < 2n —— 逐位统计 */
    {
        int n = 1024, k = 16;
        memset(bits, 0, sizeof(bits));
        long total = 0;
        int per_bit[NMAX] = {0};
        for (int i = 0; i < n; i++) {
            int c = increment(k);
            total += c;
            /* 记下这次动了哪些位（第 0..c-1 位被翻成 0，第 c 位翻成 1） */
            for (int b = 0; b < c && b < k; b++) { per_bit[b]++; }
        }
        printf("part 3: n = %d 次自增（k = %d 位），总翻转 %ld 次\n", n, k, total);
        printf("        位 0 翻转 %d 次、位 1 翻转 %d 次、位 2 翻转 %d 次、位 3 翻转 %d 次…\n",
               per_bit[0], per_bit[1], per_bit[2], per_bit[3]);
        printf("        位 i 最多翻转 floor(n / 2^i) 次 -> 总翻转 < 2n = %d\n", 2 * n);
        assert(per_bit[0] == n);
        assert(per_bit[1] == n / 2);
        assert(total < 2L * n);
        printf("        摊还代价：总翻转/n = %.3f 次/操作 —— O(1)\n", (double)total / n);
    }

    puts("all checks passed.");
    return 0;
}
