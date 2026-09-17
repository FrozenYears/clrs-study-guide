/* activity_selection.c -- 15.1: 活动选择（Activity-selection problem）。
 * 数据来自原书 Figure 15.1 的 11 个活动（按结束时间已排序）。
 * 关键数字：贪心选出 {a1, a4, a8, a11}，共 4 个活动。 */
#include <assert.h>
#include <stdio.h>

#define N 11

/* 下标 1..11 为真实活动；下标 0 为虚构的 a0（f0 = 0），使子问题 S0 = 全部活动。
 * 原书 Figure 15.1：i       1  2  3  4  5  6  7  8  9 10 11
 *                      s_i   1  3  0  5  3  5  6  7  8  2 12
 *                      f_i   4  5  6  7  9  9 10 11 12 14 16 */
static int s[N + 1] = {0, 1, 3, 0, 5, 3, 5, 6, 7, 8, 2, 12};
static int f[N + 1] = {0, 4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};

/* GREEDY-ACTIVITY-SELECTOR：迭代版（原书 p.424）。
 * 返回选中的活动个数，并把选中的下标写入 sel[0..]。 */
static int greedy_select(int *sel)
{
    int count = 0;
    int k = 1;                 /* 先选结束时间最早的活动 a1 */
    sel[count++] = 1;
    for (int m = 2; m <= N; m++) {
        if (s[m] >= f[k]) {    /* a_m 与已选的最后一个兼容？ */
            sel[count++] = m;
            k = m;
        }
    }
    return count;
}

/* RECURSIVE-ACTIVITY-SELECTOR：递归版（原书 p.422）的等价实现。
 * 从子问题 S_k 出发，返回选中的活动个数（顺序与迭代版相反）。 */
static int recursive_select(int k, int *sel)
{
    int m = k + 1;
    while (m <= N && s[m] < f[k]) { m++; }   /* 找 S_k 中第一个结束的活动 */
    if (m <= N) {
        int cnt = recursive_select(m, sel);
        sel[cnt] = m;
        return cnt + 1;
    }
    return 0;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    int sel[N];
    int n = greedy_select(sel);
    printf("part 1: GREEDY-ACTIVITY-SELECTOR 选中 %d 个活动：", n);
    for (int i = 0; i < n; i++) { printf("a%d%s", sel[i], i + 1 < n ? "," : ""); }
    printf("（原书 Figure 15.1 的最优解）\n");
    assert(n == 4);
    /* 逐位核对贪心选出的正是 {a1, a4, a8, a11} */
    assert(sel[0] == 1 && sel[1] == 4 && sel[2] == 8 && sel[3] == 11);

    int rsel[N];
    int r = recursive_select(0, rsel);   /* 子问题 S0 = 全部活动 */
    printf("part 2: RECURSIVE-ACTIVITY-SELECTOR 同样选中 %d 个活动：", r);
    for (int i = 0; i < r; i++) { printf("a%d%s", rsel[i], i + 1 < r ? "," : ""); }
    printf("\n");
    assert(r == 4);
    /* 递归版顺序相反，只核对「集合」相同 */
    int want[4] = {1, 4, 8, 11};
    for (int i = 0; i < 4; i++) {
        int found = 0;
        for (int j = 0; j < r; j++) { if (rsel[j] == want[i]) { found = 1; break; } }
        assert(found);
    }

    /* 另一个最大子集 {a2, a4, a9, a11} 大小也是 4 —— 说明最优解不唯一 */
    printf("part 3: 活动总数 n = %d；贪心给出的最大子集大小为 %d\n", N, n);
    assert(N == 11);

    puts("all checks passed.");
    return 0;
}
