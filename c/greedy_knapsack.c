/* greedy_knapsack.c -- 15.2: 贪心策略的要素（Elements of the greedy strategy）。
 * 用「背包问题」对照：分数背包（fractional）贪心可得最优；0-1 背包贪心失败，需 DP。
 * 原书 p.429 的例子：W = 50，物品 (价值, 重量) 为
 *   item1 (60, 10)  value/weight = 6
 *   item2 (100, 20) value/weight = 5
 *   item3 (120, 30) value/weight = 4
 * 分数背包贪心最优值 = 240；0-1 最优值 = 220（取 item2+item3）；0-1 贪心只得到 160。 */
#include <assert.h>
#include <stdio.h>

#define M 3
#define W 50

typedef struct { int v; int w; } Item;

static Item items[M] = {{60, 10}, {100, 20}, {120, 30}};

/* 分数背包：按 value/weight 降序，能拿多少拿多少（原书 p.429）。返回总价值（整数运算）。 */
static int fractional_knapsack(void)
{
    /* 简单选择排序：按 v/w 降序（等价于按 v*w2 与 v2*w 比，避免浮点） */
    int order[M];
    for (int i = 0; i < M; i++) { order[i] = i; }
    for (int i = 0; i < M; i++) {
        for (int j = i + 1; j < M; j++) {
            /* order[i] 的 v/w 是否小于 order[j] 的 v/w */
            long lhs = (long)items[order[i]].v * items[order[j]].w;
            long rhs = (long)items[order[j]].v * items[order[i]].w;
            if (lhs < rhs) { int t = order[i]; order[i] = order[j]; order[j] = t; }
        }
    }
    int cap = W, total = 0;
    for (int i = 0; i < M; i++) {
        int k = order[i];
        if (items[k].w <= cap) {
            total += items[k].v;          /* 整件拿走 */
            cap -= items[k].w;
        } else {
            total += items[k].v * cap / items[k].w;   /* 拿一部分 */
            cap = 0;
            break;
        }
    }
    return total;
}

/* 0-1 背包的「贪心」：同样按 value/weight 降序，但只能整件拿。用于说明它会失败。 */
static int greedy_01(void)
{
    int order[M];
    for (int i = 0; i < M; i++) { order[i] = i; }
    for (int i = 0; i < M; i++) {
        for (int j = i + 1; j < M; j++) {
            long lhs = (long)items[order[i]].v * items[order[j]].w;
            long rhs = (long)items[order[j]].v * items[order[i]].w;
            if (lhs < rhs) { int t = order[i]; order[i] = order[j]; order[j] = t; }
        }
    }
    int cap = W, total = 0;
    for (int i = 0; i < M; i++) {
        int k = order[i];
        if (items[k].w <= cap) { total += items[k].v; cap -= items[k].w; }
    }
    return total;
}

/* 0-1 背包的动态规划：O(nW)（原书 Exercise 15.2-2）。返回最优价值。 */
static int dp_01(void)
{
    int dp[W + 1];
    for (int w = 0; w <= W; w++) { dp[w] = 0; }
    for (int i = 0; i < M; i++) {
        for (int w = W; w >= items[i].w; w--) {
            int take = dp[w - items[i].w] + items[i].v;
            if (take > dp[w]) { dp[w] = take; }
        }
    }
    return dp[W];
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    int frac = fractional_knapsack();
    printf("part 1: 分数背包贪心（按 value/weight 降序）最优值 = %d\n", frac);
    assert(frac == 240);

    int g01 = greedy_01();
    printf("part 2: 0-1 背包「贪心」只得到 = %d（次优，说明贪心对 0-1 不成立）\n", g01);
    assert(g01 == 160);

    int opt = dp_01();
    printf("part 3: 0-1 背包 DP（O(nW)）最优值 = %d（取 item2 + item3）\n", opt);
    assert(opt == 220);
    assert(opt > g01);

    puts("all checks passed.");
    return 0;
}
