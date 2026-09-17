/* dp_elements.c -- 14.3: DP 的两大要素（最优子结构 + 重叠子问题）。
 * 实验：同一问题用「朴素递归」与「带备忘」两种写法，对比实际调用次数。
 * 关键数字：钢条切割 n=10 时朴素 1024 次 vs 备忘 56 次（同一答案 30）。
 * 矩阵链 n=4 时 RECURSIVE-MATRIX-CHAIN 27 次 vs MEMOIZED 21 次。 */
#include <assert.h>
#include <stdio.h>

#define NMAX 24
#define INF 1000000000

static long calls;                 /* 调用计数器 */

/* ---------- 14.1 的钢条切割：朴素递归 ---------- */
static int price[NMAX + 1] = {0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30};

static int cut_rod_naive(const int *p, int n)
{
    calls++;                                   /* 行 1–2 之外的调用计一次 */
    if (n == 0) { return 0; }                  /* 行 2–3 */
    int q = -INF;
    for (int i = 1; i <= n; i++) {             /* 行 4–5 */
        int t = p[i] + cut_rod_naive(p, n - i); /* 行 6 */
        if (t > q) { q = t; }                  /* 行 7 */
    }
    return q;                                  /* 行 8 */
}

/* ---------- 14.1 的钢条切割：自上而下 + 备忘 ---------- */
static int memo[NMAX + 1];

static int cut_rod_memo_aux(const int *p, int n)
{
    calls++;
    if (memo[n] >= 0) { return memo[n]; }
    int q = (n == 0) ? 0 : -INF;
    for (int i = 1; i <= n; i++) {
        int t = p[i] + cut_rod_memo_aux(p, n - i);
        if (t > q) { q = t; }
    }
    memo[n] = q;
    return q;
}

static int cut_rod_memo(const int *p, int n)
{
    for (int i = 0; i <= n; i++) { memo[i] = -1; }
    return cut_rod_memo_aux(p, n);
}

/* ---------- 14.3 的矩阵链：RECURSIVE / MEMOIZED-MATRIX-CHAIN ---------- */
static int mc_m[NMAX][NMAX];

static int recursive_matrix_chain(const int *p, int i, int j)
{
    calls++;
    if (i == j) { return 0; }                  /* 行 2–3：长度 1 的链 */
    int q = INF;
    for (int k = i; k < j; k++) {              /* 行 5–6 */
        int t = recursive_matrix_chain(p, i, k)
              + recursive_matrix_chain(p, k + 1, j)
              + p[i - 1] * p[k] * p[j];
        if (t < q) { q = t; }
    }
    return q;
}

static int lookup_chain(const int *p, int i, int j)
{
    calls++;
    if (mc_m[i][j] < INF) { return mc_m[i][j]; }
    if (i == j) { mc_m[i][j] = 0; }
    else {
        int q = INF;
        for (int k = i; k < j; k++) {
            int t = lookup_chain(p, i, k) + lookup_chain(p, k + 1, j)
                  + p[i - 1] * p[k] * p[j];
            if (t < q) { q = t; }
        }
        mc_m[i][j] = q;
    }
    return mc_m[i][j];
}

static int memoized_matrix_chain(const int *p, int n)
{
    for (int i = 1; i <= n; i++) {
        for (int j = i; j <= n; j++) { mc_m[i][j] = INF; }
    }
    return lookup_chain(p, 1, n);
}

/* ---------- 14.3 的反例：无权重最长简单路径（Figure 14.6 的有向 4 圈）---------- */
/* 顶点 0=q, 1=r, 2=s, 3=t；边 q->s->t->r->q */
static const int lsp_adj[4][1] = {{2}, {0}, {3}, {1}};
static int lsp_best;

static void lsp_dfs(int u, int goal, int visited[4], int depth)
{
    if (u == goal) {                      /* 抵达终点即停：再加点就重复 goal 了 */
        if (depth > lsp_best) { lsp_best = depth; }
        return;
    }
    for (int e = 0; e < 1; e++) {         /* 每点出度 1 */
        int w = lsp_adj[u][e];
        if (!visited[w]) {
            visited[w] = 1;
            lsp_dfs(w, goal, visited, depth + 1);
            visited[w] = 0;
        }
    }
}

static int longest_simple_path(int u, int goal)
{
    int visited[4] = {0, 0, 0, 0};
    visited[u] = 1;
    lsp_best = -1;
    lsp_dfs(u, goal, visited, 0);
    return lsp_best;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：重叠子问题的代价 —— 钢条切割 n=10 */
    calls = 0;
    int a = cut_rod_naive(price, 10);
    long naive10 = calls;
    calls = 0;
    int b = cut_rod_memo(price, 10);
    long memo10 = calls;
    printf("part 1: CUT-ROD(10) 朴素递归 %ld 次调用；MEMOIZED %ld 次调用；答案同为 %d\n",
           naive10, memo10, a);
    assert(a == b && a == 30);
    assert(naive10 == 1024);   /* 2^10 */
    assert(memo10 == 56);      /* 1 + 10 + 45 */

    /* part 2：指数 vs 线性 —— 调用次数增长的实测 */
    printf("part 2: 朴素递归调用次数 c(n) = 2^n：\n");
    for (int n = 4; n <= 14; n += 5) {
        calls = 0;
        (void)cut_rod_naive(price, n);
        long c = calls;
        long pow2 = 1;
        for (int k = 0; k < n; k++) { pow2 *= 2; }
        printf("        n=%2d -> %6ld 次（2^%d = %ld）\n", n, c, n, pow2);
        assert(c == pow2);
    }
    printf("        n=14 时已是 16384 次；n=30 需要约 10 亿次 —— 这就是「重叠子问题」的代价。\n");

    /* part 3：子问题图的规模 —— 备忘后真正被算的子问题只有 n+1 个 */
    {
        int distinct = 0;
        for (int i = 0; i <= 10; i++) { if (memo[i] >= 0 || i == 0) { distinct++; } }
        printf("part 3: 备忘后真正求解的子问题只有 n+1 = %d 个（其余 %ld 次全是查表命中）\n",
               distinct, memo10 - (long)distinct);
        assert(distinct == 11);
    }

    /* part 4：矩阵链 —— 同一个递归式，加不加备忘差多少 */
    {
        int p6[7] = {30, 35, 15, 5, 10, 20, 25};
        int p4[5] = {30, 35, 15, 5, 10};
        calls = 0;
        int r4 = recursive_matrix_chain(p4, 1, 4);
        long rc4 = calls;
        calls = 0;
        int m4 = memoized_matrix_chain(p4, 4);
        long mc4 = calls;
        printf("part 4: n=4 时 RECURSIVE-MATRIX-CHAIN %ld 次调用 vs MEMOIZED %ld 次；答案同为 %d\n",
               rc4, mc4, r4);
        assert(r4 == m4);
        assert(rc4 == 27);
        printf("part 4: 而 n=6（原书 p.375 的链）备忘录版本仍然只算 n(n+1)/2 = 21 个子问题\n");
        calls = 0;
        int m6 = memoized_matrix_chain(p6, 6);
        printf("        MEMOIZED-MATRIX-CHAIN(6) = %ld 次调用，代价 %d\n", calls, m6);
        assert(m6 == 15125);
    }

    /* part 5：最优子结构的反例 —— 无权重最长简单路径（原书 Figure 14.6） */
    printf("part 5: 无权重最长简单路径不满足最优子结构（Figure 14.6 的有向 4 圈）：\n");
    {
        printf("        边集 q->s->t->r->q（4 个顶点、4 条边）\n");
        int qt = longest_simple_path(0, 3);
        int qr = longest_simple_path(0, 1);
        int rt = longest_simple_path(1, 3);
        printf("        q->t 的最长简单路径 = %d 条边；q->r = %d 条边；r->t = %d 条边\n", qt, qr, rt);
        printf("        两个子问题的「最优解」拼起来需要 %d 条边，而 4 个顶点上任何简单\n",
               qr + rt);
        printf("        路径最多 3 条边 —— 拼接得到的 q-s-t-r-q-s-t 重复了顶点，非法。\n");
        assert(qt == 2 && qr == 3 && rt == 3);
        printf("        结论：两个子问题不独立（一条路径用掉的顶点会毁掉另一条）——DP 不适用。\n");
    }

    puts("all checks passed.");
    return 0;
}
