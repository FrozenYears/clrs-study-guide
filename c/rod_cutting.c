/* rod_cutting.c -- 14.1: 钢条切割四版实现与调用次数实测。
 * 价格表 = 原书 Figure 14.1 的 p[1..10] = 1,5,8,9,10,17,17,20,24,30
 * 关键结论：n=4 最优收益 10（切成 2+2）；朴素递归 n=10 调用 2^9 量级 vs 备忘 O(n^2)。
 */
#include <assert.h>
#include <stdio.h>

#define NMAX 32
static int p[NMAX + 1] = {0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30};
static long calls;                     /* 朴素递归的调用计数 */

static int imax(int a, int b) { return a > b ? a : b; }

/* ① CUT-ROD：朴素递归（6 行） */
static int cut_rod(int n)
{
    calls++;
    if (n == 0) { return 0; }
    int q = -1;
    for (int i = 1; i <= n; i++) { q = imax(q, p[i] + cut_rod(n - i)); }
    return q;
}

/* ② MEMOIZED-CUT-ROD-AUX：带备忘（9 行） */
static int memo_aux(int n, int *r)
{
    calls++;
    if (r[n] >= 0) { return r[n]; }
    int q;
    if (n == 0) { q = 0; }
    else {
        q = -1;
        for (int i = 1; i <= n; i++) { q = imax(q, p[i] + memo_aux(n - i, r)); }
    }
    r[n] = q;
    return q;
}

/* ③ BOTTOM-UP-CUT-ROD：自底向上（8 行） */
static int bottom_up(int n, int *r)
{
    r[0] = 0;
    for (int j = 1; j <= n; j++) {
        int q = -1;
        for (int i = 1; i <= j; i++) { calls += 0; q = imax(q, p[i] + r[j - i]); }
        r[j] = q;
    }
    return r[n];
}

/* ④ EXTENDED-BOTTOM-UP-CUT-ROD：同时给出切割方案（s[]） */
static int extended(int n, int *r, int *s)
{
    r[0] = 0;
    for (int j = 1; j <= n; j++) {
        int q = -1;
        for (int i = 1; i <= j; i++) {
            if (q < p[i] + r[j - i]) { q = p[i] + r[j - i]; s[j] = i; }
        }
        r[j] = q;
    }
    return r[n];
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    int r[NMAX + 1], s[NMAX + 1];

    /* ① 朴素递归：最优收益 + 调用爆炸 */
    calls = 0;
    int v4 = cut_rod(4);
    assert(v4 == 10);
    printf("part 1: CUT-ROD(4) = %d（切成 2+2 = 5+5），调用 %ld 次\n", v4, calls);
    calls = 0;
    int v10 = cut_rod(10);
    printf("part 2: CUT-ROD(10) = %d，调用 %ld 次 = 2^9 量级（指数爆炸）\n", v10, calls);

    /* ② 备忘版：同样的答案，调用数大幅下降 */
    for (int i = 0; i <= NMAX; i++) { r[i] = -1; }
    calls = 0;
    int m10 = memo_aux(10, r);
    assert(m10 == v10);
    printf("part 3: MEMOIZED-CUT-ROD(10) = %d，调用 %ld 次（Θ(n²)）\n", m10, calls);

    /* ③ 自底向上 */
    for (int i = 0; i <= NMAX; i++) { r[i] = 0; }
    int b10 = bottom_up(10, r);
    assert(b10 == v10);
    printf("part 4: BOTTOM-UP-CUT-ROD(10) = %d（与递归版同答案，无递归开销）\n", b10);

    /* ④ 完整方案 */
    int e10 = extended(10, r, s);
    assert(e10 == v10);
    printf("part 5: 最优切割方案（n=10）：");
    int n = 10;
    while (n > 0) { printf("%d ", s[n]); n -= s[n]; }
    printf("（原书 Figure 14.4 的方案：10 = 10）\n");

    /* ⑤ 最优收益表（n = 1..10）—— 与原书 Figure 14.1 对应 */
    printf("part 6: 最优收益 r[1..10] = ");
    for (int i = 1; i <= 10; i++) { printf("%d%s", r[i], i < 10 ? "," : ""); }
    printf("（原书 p.364 的表）\n");
    assert(r[1] == 1 && r[4] == 10 && r[7] == 18 && r[10] == 30);

    puts("all checks passed.");
    return 0;
}
