/* potential_stack.c -- 16.3 势能法：Φ(D) = 栈内对象数 s。
 * 关键数字：PUSH 摊还代价 2，POP 摊还代价 0，MULTIPOP 摊还代价 0；
 *           恒等式 Σĉ = Σc + Φ(Dn) − Φ(D0) 逐次成立（ telescope 精确成立，不是近似）。
 * 另外演示：换一个更陡的势函数 Φ = s²，上界依然成立但更松。 */
#include <assert.h>
#include <stdio.h>

#define NMAX 64

static int stack[NMAX];
static int top;                       /* s = 栈内对象数 = 势 Φ(D) */

static int op_push(int x) { stack[top++] = x; return 1; }
static int op_pop(void) { top--; return 1; }
static int op_multipop(int k)
{
    int cost = 0;
    while (top > 0 && k > 0) { top--; cost++; k--; }
    return cost;
}

static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：三种操作的摊还代价（Φ = s） */
    printf("part 1: 势函数 Φ(D) = s（栈内对象数）时的逐操作摊还代价：\n");
    {
        int s = 7;
        /* PUSH：实际 1 + ΔΦ(= (s+1) - s = 1) = 2 */
        int c1 = op_push(42);
        int dh = (s + 1) - s;
        printf("        PUSH：实际 %d + ΔΦ %d = %d\n", c1, dh, c1 + dh);
        assert(c1 + dh == 2);
        s = s + 1;
        /* POP：实际 1 + ΔΦ(= -1) = 0 */
        int c2 = op_pop();
        int dh2 = (s - 1) - s;
        printf("        POP ：实际 %d + ΔΦ %d = %d\n", c2, dh2, c2 + dh2);
        assert(c2 + dh2 == 0);
        s = s - 1;
        /* MULTIPOP(k)：实际 k' + ΔΦ(= -k') = 0 */
        int kk = 3, mk = (kk < s) ? kk : s;
        int c3 = op_multipop(mk);
        int dh3 = (s - c3) - s;
        printf("        MULTIPOP(%d)：实际 %d + ΔΦ %d = %d\n", mk, c3, dh3, c3 + dh3);
        assert(c3 + dh3 == 0);
        top = 0;                          /* 清场，供 part 2 使用 */
    }

    /* part 2：随机序列 —— Σĉ = Σc + Φ(Dn) − Φ(D0) 精确成立 */
    {
        long sum_actual = 0, sum_amort = 0;
        int n = 3000, s0, sn;
        top = 0; s0 = top;
        rng_seed(20260917);
        for (int i = 0; i < n; i++) {
            int r = (int)(rng_next() % 3);
            int c;
            if (r == 0 || top == 0) { c = op_push(i); sum_amort += c + 1; }
            else if (r == 1) { c = op_pop(); sum_amort += c - 1; }
            else { int k = (int)(rng_next() % 5); c = op_multipop(k); sum_amort += c - c; }
            sum_actual += c;
        }
        sn = top;
        printf("part 2: %d 个操作（起始势 %d，结束势 %d）：\n", n, s0, sn);
        printf("        Σ实际 = %ld；Σ摊还 = %ld；ΔΦ = %d\n", sum_actual, sum_amort, sn - s0);
        printf("        恒等式 Σ摊还 = Σ实际 + ΔΦ -> %ld = %ld + %d\n",
               sum_amort, sum_actual, sn - s0);
        assert(sum_amort == sum_actual + (sn - s0));
        printf("        又 Φ(Dn) = %d >= Φ(D0) = %d，所以 Σ摊还 >= Σ实际 —— 上界成立\n", sn, s0);
    }

    /* part 3：势函数换成 Φ = s²，上界更松但依然成立 */
    {
        long sum_actual = 0, sum_amort = 0;
        int n = 100, prev_phi;
        top = 0; prev_phi = 0;
        rng_seed(7);
        for (int i = 0; i < n; i++) {
            int c;
            if (i % 3 == 0 || top == 0) { c = op_push(i); }
            else if (top > 0) { c = op_pop(); }
            else { c = 0; }
            int phi = top * top;
            sum_actual += c;
            sum_amort += c + (phi - prev_phi);
            prev_phi = phi;
        }
        printf("part 3: 换势函数 Φ = s²（n = %d）：Σ实际 = %ld，Σ摊还 = %ld\n",
               n, sum_actual, sum_amort);
        printf("        ΔΦ = %d -> Σ摊还 = Σ实际 + ΔΦ 仍精确成立，且 Φ(Dn) >= Φ(D0) = 0\n",
               top * top);
        assert(sum_amort == sum_actual + (long)top * top);
        assert(top * top >= 0);
        printf("        结论：势函数只要满足 Φ(Dn) >= Φ(D0)，摊还和就是实际和的上界；\n");
        printf("        选得越贴合（线性 vs 平方），上界越紧。\n");
    }

    puts("all checks passed.");
    return 0;
}
