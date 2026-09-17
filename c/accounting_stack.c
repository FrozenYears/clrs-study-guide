/* accounting_stack.c -- 16.2 记账法：给栈操作定摊还价。
 * 关键数字：PUSH 记 2 分（1 分干活 + 1 分存栈里），POP 与 MULTIPOP 都记 0 分；
 *           信用不变量：任何时刻栈内每件东西恰有 1 分存款 —— 总信用 >= 0。
 *           于是总摊还代价 >= 总实际代价。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NMAX 64
#define CHARGE_PUSH 2        /* PUSH 的摊还价 */
#define CHARGE_POP 0         /* POP 的摊还价 */
#define CHARGE_MP 0          /* MULTIPOP 的摊还价 */

static int stack[NMAX];
static int top;
static long credit;              /* 栈内存款总额 = top（每件 1 分） */

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

    /* part 1：单步记账演示 —— PUSH 时收 2 分、花 1 分、存 1 分 */
    {
        long charged = 0, actual = 0;
        top = 0; credit = 0;
        actual += op_push(7); charged += CHARGE_PUSH; credit += CHARGE_PUSH - 1;
        printf("part 1: PUSH 摊还价 2 分 = 1 分实际代价 + 1 分存进栈里 -> 栈内信用 %ld\n", credit);
        actual += op_pop(); charged += CHARGE_POP; credit -= 1;
        printf("        POP 摊还价 0 分，但实际要花 1 分 —— 用栈里那 1 分存款支付 -> 剩信用 %ld\n", credit);
        assert(credit == 0 && charged >= actual);
    }

    /* part 2：随机操作序列 —— 信用永不透支，总摊还 >= 总实际 */
    {
        long charged = 0, actual = 0, min_credit = 0;
        int n = 2000;
        top = 0; credit = 0;
        rng_seed(20260917);
        for (int i = 0; i < n; i++) {
            int r = (int)(rng_next() % 3);
            if (r == 0 || top == 0) {
                actual += op_push(i); charged += CHARGE_PUSH;
                credit += CHARGE_PUSH - 1;
            } else if (r == 1) {
                actual += op_pop(); charged += CHARGE_POP;
                credit -= 1;
            } else {
                int k = (int)(rng_next() % 5);
                int c = op_multipop(k);
                actual += c; charged += CHARGE_MP;
                credit -= c;
            }
            if (credit < min_credit) { min_credit = credit; }
            assert(credit == top);            /* 栈内每件东西恰 1 分存款 */
            assert(credit >= 0);              /* 信用不变量：不许透支 */
        }
        printf("part 2: %d 个操作的记账账本：\n", n);
        printf("        总摊还代价 %ld 分；总实际代价 %ld；最低信用 %ld（从未透支）\n",
               charged, actual, min_credit);
        assert(charged >= actual);
        printf("        剩余信用 %ld = 栈里还有 %d 件东西各自带 1 分 -> 总摊还 >= 总实际仍成立\n",
               credit, top);
        assert(charged == actual + credit);
    }

    /* part 3：为什么 PUSH 必须记 2 分 —— 记 1 分会透支 */
    {
        long charged = 0, actual = 0;
        int n = 100;                /* 全 PUSH：等下一波 MULTIPOP 全吐出来 */
        for (int i = 0; i < n; i++) { actual += op_push(i); charged += 1; }
        /* 现在一次性 MULTIPOP(n)：实际代价 n，但只有 0 分存款 */
        actual += op_multipop(n); charged += 0;
        printf("part 3: 若 PUSH 只记 1 分：%d 次 PUSH 后做一次 MULTIPOP(%d)，\n", n, n);
        printf("        总摊还 %ld < 总实际 %ld —— 透支 %ld 分，记账法失效\n",
               charged, actual, actual - charged);
        assert(charged < actual);
        printf("        所以 PUSH 必须记 2 分：多出的 1 分正是替未来的 POP/MULTIPOP 预付的。\n");
    }

    puts("all checks passed.");
    return 0;
}
