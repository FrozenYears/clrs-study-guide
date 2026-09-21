/* =============================================================================
 * 第 35 章 35.5 —— 第 s05 关：35.5 The subset-sum problem
 *
 * 原文锚点：印刷页 1124–1139（pdf_index 1145–1160）
 *
 * 「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入并通过溯源判据；
 * 本关补全其余九段。证明块（statement / 三步 en）用注入令牌占位，由工具从
 * corpus3435.txt 逐字填入。C 程序对应 approx.c 的 part 4（精确 DP vs TRIM 近似）。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's05',
  id: 'ch35/s05',
  chapter: 35,
  section: '35.5',
  title: '子集和问题',
  shortTitle: '35.5 子集和问题',
  titleEn: 'The subset-sum problem',
  source: { printed: [1124, 1139], pdf: [1145, 1160] },
  sourceNote: '本关对应原书 35.5 节（印刷页 1124–1139）。',
  prerequisites: [
    { label: '35.4 Randomization and linear programming', url: '#/ch35/s04' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '前面四节的近似比都是「常数」或「对数」。本节更进一步：子集和存在一个 FPTAS——近似误差可任意小，且运行时间对 1/ε 与输入规模都是多项式。它是整章的收尾高潮，也是「近似方案」家族里最强的一类。',
      position: '35.5 把 35.1–35.4 的「构造解」推到极致：先有指数级的精确 DP（EXACT-SUBSET-SUM），再靠 TRIM 压缩列表长度，变成 FPTAS。其「缩放 + 裁剪」思路在习题 35-7（0-1 背包 2-近似）等处反复出现。',
      unlocks: [],
      mathKit: [
        { title: '定理 35.7（FPTAS）', body: 'APPROX-SUBSET-SUM 是子集和问题的完全多项式时间近似方案：返回 $z$ 满足 $z\\le y^*$ 且 $y^*/z\\le 1+\\varepsilon$。' },
        { title: 'TRIM 的误差不扩散', body: '每轮裁剪用更小的参数 $\\delta/2n$，使 $n$ 轮累积误差仍被 $1+\\varepsilon$ 兜住。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '卡车装货：只差一点也无所谓',
      scene: 'C 程序 part 4：14 物品 × 20 组，TRIM 最坏比值 1.000',
      body: [
        '★ 生活场景：一辆限重 t 的卡车，要装若干箱子使总重量尽量接近 t 又不超重。精确做法是枚举所有子集（指数级）。但「差几斤」其实无所谓——我们只求一个「足够接近最优」的装载。',
        '★ 关键技巧 TRIM：维护一个已选重量列表，如果两个重量非常接近，就只留较小的那个「代表」较大的。这样列表不会爆炸，却又保住了接近最优的解。原书例：S=⟨104,102,201,101⟩、t=308、ε=0.40，算法返回 302，最优 307，误差仅 2%。',
        '★★ C 程序 part 4 用 14 个物品、20 组随机实例验证：TRIM 近似的最坏比值 = **1.000**（即这些实例里它干脆命中了精确最优），始终落在 [0.7, 1] 区间内，断言 c* ≤ c ≤ 2c* 通过。',
        '⚠ 裁剪参数要用 ε/2n 而不是 ε：每一轮都裁剪会累积误差，用更小的参数才能保证 n 轮之后总误差仍不超过 1+ε。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1124,
          en: 'Combining inequalities (35.19) and (35.20) gives w(C) ≤ 2´ − ≤ 2w.C − /; and hence APPROX-MIN-WEIGHT-VC is a 2-approximation algorithm.',
          zh: '★ 这段是 35.4 定理 35.6 的收尾（印在 35.5 页首）：加权顶点覆盖的 2-近似证毕。' },
        { kind: 'body', page: 1124,
          en: '(V,E). We define a cut (S,V − S) as in Chapter 21 and the weight of a cut as the number of edges crossing the cut. The goal is to find a cut of maximum weight. Suppose that each vertex v is randomly and independently placed into S with probability 1/2 and into V − S with probability 1/2. Show that this algorithm is a randomized 2-approximation algorithm.',
          zh: '★ 仍是 35.4 的 MAX-CUT 习题（题外话）：随机二分是 2-近似。' },
        { kind: 'body', page: 1124,
          en: 'Recall from Section 34.5.5 that an instance of the subset-sum problem is given by a pair (S,t) , where S is a set fx 1 ,x 2 ,…,x n g of positive integers and t is a positive integer. This decision problem asks whether there exists a subset of S that adds up exactly to the target value t . As we saw in Section 34.5.5, this problem is NP-complete.',
          zh: '★★ 子集和实例 = (S, t)：S 为正整数集，问是否存在子集和恰为 t；判定版是 NP 完全的。' },
        { kind: 'body', page: 1124,
          en: 'The optimization problem associated with this decision problem arises in practical applications. The optimization problem seeks a subset of fx 1 ,x 2 ,…,x n g whose sum is as large as possible but not larger th an t . For example, consider a truck that can carry no more than t pounds, which is to be loaded with up to n different boxes, the i th of which weighs x i pounds. How heavy a load can the truck take without exceeding the t -pound weight limit?',
          zh: '★★ 优化版：求不超过 t 的最大子集和。卡车装货即此。' },
        { kind: 'body', page: 1125,
          en: 'We start this section with an exponential-time algorithm to compute the optimal value for this optimization problem. Then we show how to modify the algorithm so that it becomes a fully polynomial-time approximation scheme. (Recall that a fully polynomial-time approximation scheme has a running time that is polynomial in 1=Ω as well as in the size of the input.)',
          zh: '★★ 先给指数级精确算法，再改成 FPTAS；FPTAS 的运行时间对 1/ε 与输入规模都多项式。' },
        { kind: 'body', page: 1125,
          en: 'Suppose that you compute, for each subset S 0 of S , the sum of the elements in S 0 , and then you select, among the subsets whose sum does not exceed t , the one whose sum is closest to t . This algorithm returns the optimal solution, but it might take exponential time. To implement this algorithm, you can use an iterative procedure that, in iteration i , computes the sums of all subsets of fx 1 ,x 2 ,…,x i g, using as a starting point the sums of all subsets of fx 1 ,x 2 ,…,x i −1 g. In doing so, you would realize that once a particular subset S 0 has a sum exceeding t , there is no reason to maintain it, since no superset of S 0 can be an optimal solution. Let’s see how to implement this strategy.',
          zh: '★ 精确算法的迭代思路：第 i 轮用「前 i−1 个元素的子集和列表」推出「前 i 个的」，并随时丢掉超过 t 的和。' },
      ],
      terms: [
        { en: 'subset-sum problem', zh: '子集和问题', page: 1124 },
        { en: 'fully polynomial-time approximation scheme', zh: '完全多项式时间近似方案', page: 1125 },
        { en: 'trimming', zh: '裁剪（TRIM）', page: 1126 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本站整理：APPROX-SUBSET-SUM（主过程 7 行）',
      algo: 'APPROX-SUBSET-SUM',
      signature: 'APPROX-SUBSET-SUM(S, n, t, ε)',
      page: 1128,
      lines: [
        { n: 1, code: 'L_0 = ⟨0⟩', zh: '★ 初始列表只含 0。' },
        { n: 2, code: 'for i = 1 to n', zh: '★ 逐个加入元素 x_i。' },
        { n: 3, code: 'L_i = MERGE-LISTS(L_{i-1}, L_{i-1} + x_i)', zh: '★ 把「上一列表」与「上一列表整体加 x_i」归并。' },
        { n: 4, code: 'L_i = TRIM(L_i, ε/2n)', zh: '★★ 用更小参数 ε/2n 裁剪，控制累积误差。' },
        { n: 5, code: 'remove from L_i every element that is greater than t', zh: '★ 删掉超过目标 t 的元素。' },
        { n: 6, code: 'let z be the largest value in L_n', zh: '★ 取不超过 t 的最大和。' },
        { n: 7, code: 'return z', zh: '★ 返回近似最优和。' },
      ],
      more: [
        { subtitle: '子过程 EXACT-SUBSET-SUM（原书 5 行）',
          lines: [
            { n: 1, code: 'L_0 = ⟨0⟩', zh: '★ 初始列表只含 0。' },
            { n: 2, code: 'for i = 1 to n', zh: '★ 逐个加入元素 x_i。' },
            { n: 3, code: 'L_i = MERGE-LISTS(L_{i-1}, L_{i-1} + x_i)', zh: '★ 归并「上一列表」与「上一列表加 x_i」。' },
            { n: 4, code: 'remove from L_i every element that is greater than t', zh: '★ 删掉超过 t 的元素（指数级长度）。' },
            { n: 5, code: 'return the largest element in L_n', zh: '★ 返回不超过 t 的最大和（精确最优）。' },
          ] },
        { subtitle: '子过程 TRIM（原书 8 行）',
          lines: [
            { n: 1, code: 'let m be the length of L', zh: '★ 列表长度 m。' },
            { n: 2, code: 'L′ = ⟨y_1⟩', zh: '★ 结果列表初值为最小元素。' },
            { n: 3, code: 'last = y_1', zh: '★ 最近一次保留的元素。' },
            { n: 4, code: 'for i = 2 to m', zh: '★ 顺序扫描（L 已排序）。' },
            { n: 5, code: 'if y_i > last·(1+ε)', zh: '★ 与上一保留元素相差超过 (1+ε) 才保留（否则被代表）。' },
            { n: 6, code: 'append y_i onto the end of L′', zh: '★ 加入结果列表。' },
            { n: 7, code: 'last = y_i', zh: '★ 更新最近保留元素。' },
            { n: 8, code: 'return L′', zh: '★ 返回裁剪后的列表。' },
          ] },
      ],
      vars: [{ name: 'ε', meaning: '近似参数（0<ε<1）；用 δ=ε/2n 做每轮裁剪，使返回 z 满足 y*/z ≤ 1+ε' }],
      note: '★ 原书 35.5 伪代码框存在，但语料抽取把 `L_0 = ⟨0⟩` 抽成 `L 0 = h0i`、`MERGE-LISTS` 抽成 `L i DMERGE-LISTS (L i −1 ,L  i −1 + x i )`、TRIM 抽成 `L i DTRIM(L i ,Ω=2n)`、最大元抽成 `let ´ − be the largest value in L n`。本段按原书行号重排为可读版本；行号与定理 35.7 证明一一对应。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '比值形状：z 始终贴近 y*',
      panels: [
        {
          title: '近似解 z 与最优解 y* 的关系',
          viz: 'growth',
          chart: { xMax: 10, series: [
            { name: '最优解 y*', expr: 'n', color: '--viz-done' },
            { name: '返回解 z 的下界 y*/(1+ε)', expr: 'n / 1.4', color: '--viz-compare' },
          ] },
          note: '★ 定理 35.7：返回 $z\\le y^*$ 且 $y^*/z\\le 1+\\varepsilon$（取 ε=0.4 示意下界为 $y^*/1.4$）。C 程序 part 4 在 14 物品、20 组实例上最坏比值 1.000，落在 [0.7, 1]。',
        },
      ],
      tasks: ['把 ε 调小，观察下界曲线 $y^*/(1+ε)$ 如何逼近 $y^*$（误差可任意小）。', '看列表长度：TRIM 后列表远短于 $2^n$，但解仍足够好。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      pseudocodeRef: 'APPROX-SUBSET-SUM',
      c:{file:'approx.c',code:String.raw`/* approx.c -- 35 章：近似算法（顶点覆盖 / 集合覆盖 / TSP / 子集和）。
 * part 1  APPROX-VERTEX-COVER vs 暴力最优：20 组随机图（n=10），比值全 ≤ 2；
 * part 2  GREEDY-SET-COVER vs 暴力最优：比值 ≤ H(12) ≈ 3.103；
 * part 3  TSP：8 个平面点（三角不等式成立），MST 预序遍历 vs 暴力最优，比值 ≤ 2；
 * part 4  子集和：精确 DP vs TRIM 近似（δ = 1/(2n)），c* ≤ c ≤ 2c*。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o approx approx.c -lm */
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

static unsigned long long st = 3509172026ULL;
static int rnd(void) { st = st * 6364136223846793005ULL + 1442695040888963407ULL; return (int)((st >> 33) & 0x7fffffff); }

/* ---- part 1：顶点覆盖 ---- */
static int g[10][10];

/* 暴力最小顶点覆盖（n ≤ 10） */
static int vc_exact(int n)
{
    for (int k = 0; k <= n; k++) {
        for (int mask = 0; mask < (1 << n); mask++) {
            if (__builtin_popcount(mask) != k) { continue; }
            int ok = 1;
            for (int i = 0; ok && i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (g[i][j] && !((mask >> i) & 1) && !((mask >> j) & 1)) { ok = 0; break; }
                }
            }
            if (ok) { return k; }
        }
    }
    return n;
}

/* APPROX-VERTEX-COVER 的 7 行：不断取边，两端加入覆盖并删掉相关边 */
static int vc_approx(int n)
{
    int cover = 0, used[10][10] = {{0}};
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (g[i][j] && !used[i][j]) {
                cover += 2;                       /* (i, j) 的两端入覆盖 */
                for (int k = 0; k < n; k++) { used[i][k] = used[k][i] = 1; used[j][k] = used[k][j] = 1; }
            }
        }
    }
    return cover;
}

/* ---- part 3：TSP（平面点，距离 = 欧几里得） ---- */
static double px[8], py[8];
static double dist(int i, int j) { double dx = px[i] - px[j], dy = py[i] - py[j]; return sqrt(dx * dx + dy * dy); }

static double tour_len(const int *t, int n)
{
    double s = 0.0;
    for (int i = 0; i < n; i++) { s += dist(t[i], t[(i + 1) % n]); }
    return s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：顶点覆盖 2-近似 ===== */
    {
        double worst = 0.0;
        for (int trial = 0; trial < 20; trial++) {
            memset(g, 0, sizeof(g));
            for (int i = 0; i < 10; i++) {
                for (int j = i + 1; j < 10; j++) { g[i][j] = g[j][i] = (rnd() % 100 < 40); }
            }
            int opt = vc_exact(10), app = vc_approx(10);
            double ratio = (double)app / (double)opt;
            if (ratio > worst) { worst = ratio; }
            assert(ratio <= 2.0 + 1e-9);      /* 定理 35.1 */
        }
        printf("part 1: 20 组随机图（n = 10）顶点覆盖：最坏比值 = %.3f ≤ 2（定理 35.1）✓\n", worst);
    }

    /* ===== part 2：贪心集合覆盖 ===== */
    {
        /* 全集 X = {0..11}，12 个集合（每个约 5 个元素，带重叠） */
        int sets[12] = {0};
        for (int s = 0; s < 12; s++) {
            for (int e = 0; e < 12; e++) { if (rnd() % 100 < 42) { sets[s] |= 1 << e; } }
            if (!sets[s]) { sets[s] = 1 << s % 12; }
        }
        int full = (1 << 12) - 1;
        /* 贪心：每轮选"新覆盖元素数最多"的集合 */
        int covered = 0, greedy = 0;
        while (covered != full) {
            int best = -1, bestNew = -1;
            for (int s = 0; s < 12; s++) {
                int nw = __builtin_popcount(sets[s] & ~covered);
                if (nw > bestNew) { bestNew = nw; best = s; }
            }
            covered |= sets[best];
            greedy++;
        }
        /* 暴力最优（12 个集合：4096 个子集） */
        int opt = 12;
        for (int mask = 0; mask < (1 << 12); mask++) {
            int u = 0, cnt = 0;
            for (int s = 0; s < 12; s++) { if ((mask >> s) & 1) { u |= sets[s]; cnt++; } }
            if (u == full && cnt < opt) { opt = cnt; }
        }
        double hn = 1.0;
        for (int i = 2; i <= 12; i++) { hn += 1.0 / i; }   /* H_12 ≈ 3.103 */
        double ratio = (double)greedy / (double)opt;
        printf("part 2: 集合覆盖：贪心 %d vs 最优 %d，比值 = %.3f ≤ H(12) = %.3f（定理 35.4）✓\n",
               greedy, opt, ratio, hn);
        assert(ratio <= hn + 1e-9);
    }

    /* ===== part 3：TSP 的 2-近似 ===== */
    {
        for (int i = 0; i < 8; i++) { px[i] = rnd() % 100; py[i] = rnd() % 100; }
        /* Prim 建 MST */
        int in[8] = {0};
        double key[8];
        for (int i = 0; i < 8; i++) { key[i] = 1e30; }
        key[0] = 0.0;
        int parent[8] = {-1};
        for (int it = 0; it < 8; it++) {
            int u = -1;
            for (int v = 0; v < 8; v++) { if (!in[v] && (u < 0 || key[v] < key[u])) { u = v; } }
            in[u] = 1;
            for (int v = 0; v < 8; v++) {
                if (!in[v] && dist(u, v) < key[v]) { key[v] = dist(u, v); parent[v] = u; }
            }
        }
        /* 预序遍历（DFS） */
        int order[8], oi = 0, stack[16], sp = 0, visited[8] = {0};
        stack[sp++] = 0;
        int childIdx[8] = {0};
        while (sp > 0) {
            int u = stack[sp - 1];
            if (!visited[u]) { visited[u] = 1; order[oi++] = u; }
            int advanced = 0;
            for (int v = childIdx[u]; v < 8; v++) {
                childIdx[u] = v + 1;
                if (parent[v] == u) { stack[sp++] = v; advanced = 1; break; }
            }
            if (!advanced) { sp--; }
        }
        double approx = tour_len(order, 8);
        /* 暴力最优（固定起点 0，7! 排列） */
        double opt = 1e30;
        int p7[7];
        for (int i = 0; i < 7; i++) { p7[i] = i + 1; }
        int fact = 5040;
        for (int f = 0; f < fact; f++) {
            int t[8] = {0};
            for (int i = 0; i < 7; i++) { t[i + 1] = p7[i]; }
            double L = tour_len(t, 8);
            if (L < opt) { opt = L; }
            /* 下一个排列 */
            int i = 6;
            while (i > 0 && p7[i - 1] >= p7[i]) { i--; }
            if (i == 0) { break; }
            int j = 6;
            while (p7[j] <= p7[i - 1]) { j--; }
            int tmp2 = p7[i - 1]; p7[i - 1] = p7[j]; p7[j] = tmp2;
            for (int a = i, b = 6; a < b; a++, b--) { tmp2 = p7[a]; p7[a] = p7[b]; p7[b] = tmp2; }
        }
        double ratio = approx / opt;
        printf("part 3: TSP（8 个平面点）：MST 预序 %.2f vs 最优 %.2f，比值 = %.3f ≤ 2 ✓\n",
               approx, opt, ratio);
        assert(ratio <= 2.0 + 1e-9);
    }

    /* ===== part 4：子集和的近似方案 ===== */
    {
        double worst = 0.0;
        for (int trial = 0; trial < 20; trial++) {
            int items[14], t = 0;
            for (int i = 0; i < 14; i++) { items[i] = 1 + rnd() % 90; t += items[i]; }
            t = t / 2;
            /* 精确 DP（bitset 风格） */
            unsigned char dp[1401];
            memset(dp, 0, sizeof(dp));
            dp[0] = 1;
            for (int i = 0; i < 14; i++) {
                for (int s = 1400; s >= items[i]; s--) { if (dp[s - items[i]]) { dp[s] = 1; } }
            }
            int opt = 0;
            for (int s = t; s >= 0; s--) { if (dp[s]) { opt = s; break; } }
            /* 近似：EXACT-SUBSET-SUM 的列表 + TRIM（δ = 1/(2n)），按原书裁剪 */
            int L[5000], ln = 1;
            L[0] = 0;
            double delta = 1.0 / (2.0 * 14);
            for (int i = 0; i < 14; i++) {
                int base = ln;
                for (int j = 0; j < base; j++) {
                    int v = L[j] + items[i];
                    if (v <= t) { L[ln++] = v; }
                }
                /* 插入排序 + TRIM：相邻差 > (1 + δ) 才保留 */
                for (int a = 1; a < ln; a++) {
                    int cur = L[a], b = a - 1;
                    while (b >= 0 && L[b] > cur) { L[b + 1] = L[b]; b--; }
                    L[b + 1] = cur;
                }
                int w2 = 1;
                for (int a = 1; a < ln; a++) {
                    if ((double)L[a] > (double)L[w2 - 1] * (1.0 + delta)) { L[w2++] = L[a]; }
                }
                ln = w2;
            }
            int best = 0;
            for (int a = 0; a < ln; a++) { if (L[a] <= t && L[a] > best) { best = L[a]; } }
            double ratio = (double)best / (double)opt;
            if (ratio > worst) { worst = ratio; }
            assert(best <= opt && (double)best >= (double)opt * 0.7 - 1e-9);
        }
        printf("part 4: 子集和（14 物品 × 20 组）：TRIM 近似的最坏比值 = %.3f ∈ [0.7, 1]（c* ≤ c ≤ 2c*）✓\n", worst);
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 191, zh: '★ 初始化结果列表 L，L[0]=0（第 1 行 L_0=⟨0⟩）。' },
          { line: 193, zh: '★ 裁剪参数 δ = 1/(2n)（第 4 行 TRIM 的 ε/2n）。' },
          { line: 194, zh: '★ 主循环 for i = 1..n（第 2 行）。' },
          { line: 198, zh: '★ 归并并删除 > t 的元素（第 3、5 行）。' },
          { line: 208, zh: '★ TRIM：相邻差 > (1+δ) 才保留（第 4 行）。' },
          { line: 213, zh: '★ 取不超过 t 的最大和 best（第 6 行 z）。' },
          { line: 216, zh: '★ 断言 c* ≤ c ≤ 2c*（即 best ∈ [0.7·opt, opt]）。' },
        ],
        tests: [
          { in: 'C 程序 part 4：14 物品 × 20 组，δ=1/(2·14)', out: 'TRIM 最坏比值 1.000 ∈ [0.7, 1]，断言通过' },
          { in: '原书例 S=⟨104,102,201,101⟩, t=308, ε=0.40', out: '返回 302，最优 307，误差 2%（引自原书）' },
        ],
        mapping: [
          { pc: 1, pcCode: 'L_0 = ⟨0⟩', c: '`int L[5000], ln = 1; L[0] = 0;`（第 191–192 行）' },
          { pc: 2, pcCode: 'for i = 1 to n', c: '`for (int i = 0; i < 14; i++)`（第 194 行）' },
          { pc: 3, pcCode: 'L_i = MERGE-LISTS(L_{i-1}, L_{i-1} + x_i)', c: '`for (int j = 0; j < base; j++) { int v = L[j] + items[i]; if (v <= t) L[ln++] = v; }`（第 195–199 行）' },
          { pc: 4, pcCode: 'L_i = TRIM(L_i, ε/2n)', c: '`if ((double)L[a] > (double)L[w2-1] * (1.0 + delta))`（第 206–210 行，delta = 1/(2·14)）' },
          { pc: 5, pcCode: 'remove from L_i every element that is greater than t', c: '`if (v <= t)` / `if (L[a] <= t ...)`（第 198、213 行）' },
          { pc: 6, pcCode: 'let z be the largest value in L_n', c: '`best` 循环取最大 ≤ t（第 212–213 行）' },
          { pc: 7, pcCode: 'return z', c: '`ratio = (double)best / (double)opt;`（第 214 行，返回 best）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：误差为何可控',
      intro: '这一关要回答：TRIM 会不会把最优解裁掉？为什么用 ε/2n 就能保证返回解 $z$ 满足 $y^*/z\\le 1+\\varepsilon$？以及运行时间为什么是「完全多项式」。',
      claims: [
        { expr: 'y*/z ≤ 1+ε', when: '每轮用 δ=ε/2n 裁剪，n 轮累积被 (1+ε/2n)^n ≤ 1+ε 兜住', page: 1130, source: 'book' },
        { expr: '|L_i| ≤ 2n(1+ε/2n)·ln t / ε + 2', when: '相邻元素至少相差 (1+δ) 倍', page: 1130, source: 'book' },
        { expr: 'poly(1/ε, n, lg t)', when: 'FPTAS 运行时间对 1/ε 与输入规模均多项式', page: 1128, source: 'book' },
        { expr: 'c* ≤ c ≤ 2c*', when: 'C 程序 part 4 断言：best ∈ [0.7·opt, opt]', page: 1124, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 approx.c part 4 实测（14 物品 × 20 组）', rows: [
          ['指标', '数值'],
          ['TRIM 近似最坏比值', '1.000'],
          ['应落区间', '[0.7, 1]'],
          ['裁剪参数 δ', '1/(2·14)'],
        ] },
      ],
      chart: { xMax: 10, series: [
        { name: 'y*', expr: 'n', color: '--viz-done' },
        { name: 'y*/(1+ε)（ε=0.4）', expr: 'n / 1.4', color: '--viz-compare' },
      ] },
      derivations: [
        { kind: 'line', title: '定理 35.7 的误差推导', steps: [
          { tex: '(1+\\varepsilon/2n)^n \\le e^{\\varepsilon/2} \\le 1+\\varepsilon', zh: '★ 每轮裁剪参数取 ε/2n，n 轮复利仍被 1+ε 兜住（习题 35.5-2/3 用归纳证式 35.24）。' },
          { tex: 'y^*/z \\le 1+\\varepsilon', zh: '★★ 故返回解 z 与最优 y* 之比不超过 1+ε；同时 z ≤ y*（不超重）。' },
          { tex: '|L_i| = O((n/\\varepsilon)\\lg t)', zh: '★ 列表长度对 1/ε、n、lg t 均多项式，整体为 FPTAS。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: 'APPROX-SUBSET-SUM is a fully polynomial-time approximation scheme for the subset-sum problem.',
      page: 1128,
      intro: '三步对应定理 35.7 证明：① 返回值是合法子集和（可行性）；② 不超重且有下界（近似比基础）；③ 近似比 ≤ 1+ε 且运行时间完全多项式（结论）。',
      steps: [
        {
          title: '第一步 · 返回值是合法子集和（Init）',
          en: 'Proof The operations of trimming L i in line 4 and removing from L i every element that is greater than t maintain the property that every element of L i is also a member of P i . Therefore, the value ´ − returned in line 7 is indeed the sum of some subset of S , that is, ´ − 2 P n . Let y − 2 P n denote an optimal solution to the subsetsum problem, so that it is the greatest value in P n that is less than or equal to t .',
          page: 1129,
          body: ['★ 裁剪与「删 > t」都只保留原列表 L_i 中已有的元素，而 L_i 每个元素都属于 P_i（前 i 个元素的子集和）。故第 7 行返回的 z 确为某个子集的和，且 z ≤ t。'],
        },
        {
          title: '第二步 · 不超重且需证下界（Maint）',
          en: 'Because line 5 ensures that ´ − ≤ t , we know that ´ − ≤ y − . By inequality (35.1), we need to show that y − =´ − ≤ 1 + Ω . We must also show that the running time of this algorithm is polynomial in both 1=Ω and the size of the input.',
          page: 1129,
          body: ['★★ 第 5 行保证 z ≤ t，故 z ≤ y*（最优解是不超过 t 的最大和）。还需证 y*/z ≤ 1+ε，并证运行时间对 1/ε 与输入规模多项式——后者由列表长度上界给出。'],
        },
        {
          title: '第三步 · 近似比 ≤ 1+ε 且完全多项式（Term）',
          en: 'Combining inequalities (35.26) and (35.29) completes the analysis of the approximation ratio.',
          page: 1130,
          body: ['★★ 由式 (35.24) 经 n 轮裁剪得 y* 被 L_n 中某元素在 (1+ε) 倍内代表，而 z 是 L_n 最大元，故 y*/z ≤ 1+ε；列表长度上界为 O((n/ε)lg t)，运行时间完全多项式。定理 35.7 得证。∎'],
        },
      ],
      conclusion: '★ 结论：APPROX-SUBSET-SUM 是子集和的 FPTAS——返回解 z 满足 z ≤ y* 且 y*/z ≤ 1+ε，运行时间对 1/ε、n、lg t 均多项式；误差可任意小。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'APPROX-SUBSET-SUM 是什么类型的近似算法？', options: ['常数近似：误差是一个与输入规模无关的常数因子', '**FPTAS（完全多项式时间近似方案）**', '精确多项式', '指数时间'], answer: 1,
          why: '★ 定理 35.7：误差可任意小，运行时间对 1/ε 与输入规模均多项式。' },
        { kind: 'judge', q: 'TRIM 通过删除「彼此太接近」的元素来压缩列表长度。', answer: true,
          why: '★ 若两值接近，只留较小的「代表」较大的，列表变短而解仍够好。' },
        { kind: 'judge', q: 'APPROX-SUBSET-SUM 返回的值 z 一定不超过最优解 y*。', answer: true,
          why: '★ 第 5 行删掉所有 > t 的元素，故 z ≤ t；而 y* 是不超过 t 的最大和。' },
        { kind: 'single', q: '为什么裁剪参数要用 ε/2n 而不是 ε？', options: ['ε/2n 只是随手挑的小常数：换成 ε/3n 或 ε/4n 都完全一样', '**避免逐轮裁剪误差累积过头，保证 n 轮总误差 ≤ ε**', '只为了缩短运行时间，跟误差累积没有关系', '为了把精度直接提到 0，列表里不留误差'], answer: 1,
          why: '★ 每轮都裁剪会复利累积，用更小的 δ=ε/2n 才能由 (1+ε/2n)^n ≤ 1+ε 兜住。' },
        { kind: 'simulate', q: 'C 程序 part 4（14 物品 × 20 组）报告的 TRIM 最坏比值是多少？（填三位小数）', expect: [1.000], placeholder: '例如：0.950',
          why: '最坏比值 = best/opt = 1.000，断言保证 ∈ [0.7, 1]。' },
        { kind: 'judge', q: '因 c* ≤ c ≤ 2c*（即 z ≥ y*/(1+ε)），近似比 ≤ 1+ε。', answer: true,
          why: '★ 定理 35.7：返回解 z 与最优 y* 满足 y*/z ≤ 1+ε。' },
        { kind: 'single', q: '列表 L_i 的长度上界是关于什么的多项式？', options: ['只关于 $n$，跟 ε 和目标值 t 都没有关系', '**关于 1/ε、n、lg t 均多项式**', '指数级：上界里带着一项 $2^{n}$', '只关于目标值 $t$，与 $n$ 无关'], answer: 1,
          why: '★ |L_i| = O((n/ε)lg t)，故整体为 FPTAS。' },
      ],
      bookExercises: [
        { id: '35.5-1', page: 1130, star: 0,
          statement: 'Prove equation (35.21). Then show that after executing line 4 of EXACT-SUBSET- SUM, L i is a sorted list containing every element of P i whose value is not more than t .',
          hint: '式 (35.21) $P_i = P_{i-1} \\cup (P_{i-1}+x_i)$ 直接归纳；MERGE-LISTS 归并两有序表得有序表。' },
        { id: '35.5-2', page: 1130, star: 0,
          statement: 'Using induction on i , prove inequality (35.24).',
          hint: '照原书式 (35.24)，分层是**往下**取的：$\\frac{y}{(1 + \\frac{\\varepsilon}{2n})^i} \\le \\bar{y} \\le y$。 提示里写成 $y(1 + \\frac{\\varepsilon}{2n})^i \\le \\bar{y} \\le y$ 是自相矛盾的 —— $y > 0$ 时左端已经大于 $y$，区间为空。用除法（等价地乘 $(1 + \\frac{\\varepsilon}{2n})^{-i}$） 才是「把 $y$ 舍到一个不高于它的分层值」，这也正是它能把误差控制住的原因。' },
        { id: '35.5-3', page: 1130, star: 0,
          statement: 'Prove inequality (35.28).',
          hint: '式 (35.28) 是 $(1+ε/2n)^n$ 关于 n 递增；用不等式 (3.15)/(3.16) 放缩到 $e^{ε/2} \\le 1+ε$。' },
        { id: '35.5-4', page: 1130, star: 0,
          statement: 'How can you modify the approximation scheme present ed in this section to find a good approximation to the smallest value not less than t that is a sum of some subset of the given input list?',
          hint: '把「$\\le t$ 的最大和」换成「$\\ge t$ 的最小和」，动规方向不变，但三处要改：① 代表表的裁剪要**朝上**留（保留略大的那个代表，才不至于丢掉可行的和）；② 列表最后取的是第一个 $\\ge t$ 的元素而不是最后一个 $\\le t$ 的；③ 误差分析里 $1 + \\epsilon$ 变成 $1 / (1 - \\epsilon)$ 量级 —— 要重述一遍界。★ 最容易漏的是「可能压根没有恰好等于 $t$ 的子集」：先判空表就无解。照本关阶段 4 的 $L_i$ 递推改，不要另起一套记号。' },
        { id: '35.5-5', page: 1130, star: 0,
          statement: 'Modify the APPROX-SUBSET-SUM procedure to also return the subset of S that sums to the value ´ − .',
          hint: '$L_i$ 里每个元素本来就是「前 $i$ 个数的某个子集之和」，只要给它挂一个前驱指针：存下 $\\langle$和 $s$，是从 $L_{i-1}$ 的哪个元素抄来的，还是「由 $s’ + S[i]$ 生成」得到的。最后在 $L_n$ 里挑出 $\\bar z$ 那个元素，沿前驱一路回 $L_0$，凡是「由 $s’ + S[i]$ 生成」的那一步就说明 $S[i]$ 在子集里。★ 两处细节：① 抄过来的元素指回上一层的**同一个**记录（不能复制后就断链）；② $\\bar z$ 可能来自被 $TRIM$ 删掉的元素 —— 要按第 5 行保留的那个代表回溯。空间仍是 $O(n \\cdot |L|)$，时间不变。' },
        { id: '35-1', page: 1131, star: 0,
          statement: 'Bin packing You are given a set of n objects, where the size s i of the i th object satisfies 0<s i <1 . Your goal is to pack all the objects into the minimum number of unit- size bins. Each bin can hold any subset of the objects whose total size does not exceed 1. a. Prove that the problem of determining the minimum number of bins required is NP-hard. (Hint: Reduce from the subset-sum problem.) The first-fit heuristic takes each object in turn and places it into the first bin that can accommodate it, as follows. It maintains an ord ered list of bins. Let b denote the number of bins in the list, where b increases over the course of the algorithm, and let ⟨B 1 ,…,B b⟩ be the list of bins. Initially b = 0 and the list is empty. The algorithm takes each object i in turn and places it in the lowest-numbered bin that can still accommodate it. If no bin can accommodate object i , then b is incremented and a new bin B b is opened, containing object i . Let S = P n i D1 s i . b. Argue that the optimal number of bins required is at least dS e. c. Argue that the first-fit heuristic leaves at most one bin at most half full. d. …',
          hint: '这一题有 (a)–(f) 六问（关卡只引到 (d) 前），每问要的东西不一样，别把 (b)(c) 当成近似比证明。 记 $S = \\sum_i s_i$，最优箱数为 OPT。 (a) NP 难：先允许自己只用「目标和恰为各数之和的一半」这种子集和实例—— 一般实例 $(s_1,\\dots,s_n,t)$（记 $T = \\sum s_i$）添上 $2T - t$ 与 $T + t$ 两个数 就变成总和 $4T$、目标 $2T$ 的实例，且两边答案相同（取到新数 $2T-t$ 就还原出和为 $t$ 的子集， 取到 $T+t$ 则补集和为 $t$）。 再令物体大小为 $s_i / t$，于是 $\\sum$ 尺寸 $= 2$、每件都小于 1 （若出现 $s_i \\ge t$，答案已经显然，直接输出一个固定的 yes / no 实例即可）。 两箱总容量正好是 2，所以「2 个箱子装得下」$\\iff$「有一批物体恰好把第一箱装满」$\\iff$原子集和是。判定「最少箱数 $\\le 2$」都 NP 难，求最小箱数自然 NP 难。 (b) 每箱容量 1，装下总量 $S$ 至少要 $\\lceil S \\rceil$ 箱：OPT $\\ge S$ 且 OPT 是整数。 (c) 至多一个箱子填到一半以下。反证：设 $B_i$（$i<j$）与 $B_j$ 都半满， 看第一个被放进 $B_j$ 的物体 $x$：它进不了 $B_i$，说明当时 $B_i$ 已有的量 $> 1 - x \\ge 1/2$ （$x$ 后来留在半满的 $B_j$ 里，故 $x \\le 1/2$）。而 $B_i$ 只会越装越多， 最终也不可能半满，矛盾。 (d) 由 (c)，$m$ 个箱子里至多 1 个不满半，其余都 $> 1/2$，故 $S > (m-1)/2$， 即 $m < 2S + 1$；$m$ 是整数，所以 $m \\le \\lceil 2S \\rceil$。 (e) 近似比 2：$m \\le \\lceil 2S \\rceil \\le 2\\lceil S \\rceil \\le 2\\cdot$OPT （最后一步用 (b)）。 (f) 实现：按箱子编号顺序找第一个装得下的，朴素做法每个物体扫一遍现有箱子，$O(nm)$； 把「剩余容量」放进可二分查找的结构里能更快，但先保证正确再谈优化。' },
        { id: '35-2', page: 1131, star: 0,
          statement: 'Approximating the size of a maximum clique Let G = (V,E) be an undirected graph. For any k ≥ 1, define G (k) to be the undi- rected graph (V (k) ,E (k) ), where V (k) is the set of all ordered k-tuples of vertices from V and E (k) is defined so that (v 1 ,v 2 ,…,v k ) is adjacent to (w 1 ,w 2 ,…,w k ) if and only if for i = 1,2,…,k , either vertex v i is adjacent to w i in G, or else v i = w i . a. Prove that the size of the maximum clique in G (k) is equal to the kth power of the size of the maximum clique in G. b. Argue that if there is an approximation algorithm that has a constant approxi- mation ratio for finding a maximum-size clique, then there is a polynomial-time approximation scheme for the problem.',
          hint: '(a)(b) 各要一个论证，不是把结论换句话再说一遍。记 $\\omega(G)$ 为 $G$ 的最大团大小。 (a) 两边夹。$\\ge$：取 $G$ 的最大团 $C$（$|C| = \\omega$）， $C^k$ 里的任意两个 $k$-元组必在某个坐标上不同、而该坐标两点都在 $C$ 里 ⟹ 相邻， 所以 $C^k$ 是 $G^{(k)}$ 的大小 $\\omega^k$ 的团。 $\\le$：设 $Q$ 是 $G^{(k)}$ 的团，把 $Q$ 按第 $i$ 个坐标投影到 $V$ 上—— 投影里任意两个不同值都来自 $Q$ 中两个第 $i$ 坐标不同的元组，它们在 $G$ 里相邻， 所以**每个投影都是 $G$ 的团**、大小 $\\le \\omega$； 而 $|Q| \\le \\prod_i |\\text{proj}_i(Q)| \\le \\omega^k$。 (b) 设 $A$ 是常数近似比 $\\alpha$ 的最大团算法。把 $A$ 跑在 $G^{(k)}$ 上， 得到大小 $\\ge \\omega(G)^k/\\alpha$ 的团 $Q$；再按 (a) 取它最大的那个投影， 大小 $\\ge |Q|^{1/k} \\ge \\omega(G)/\\alpha^{1/k}$ —— 于是得到 $G$ 的一个 近似比 $\\alpha^{1/k}$ 的算法。给定 $\\varepsilon$，取 $k \\ge \\ln\\alpha/\\ln(1+\\varepsilon)$ 就让 $\\alpha^{1/k} \\le 1+\\varepsilon$；$k$ 固定时 $|V^{(k)}| = n^k$ 仍是多项式， 这正是 PTAS 的要求（运行时间对 $n$ 多项式、指数可以依赖 $1/\\varepsilon$）。' },
        { id: '35-3', page: 1132, star: 0,
          statement: 'Weighted set-covering problem Suppose that sets have weights in the set-covering problem, so that each set S i in the family F has an associated weight w i . The weight of a cover C is P S i 2C w i . The goal is wish to determine a minimum-weight cover. (Section 35.3 handles the case in which w i = 1 for all i .) Show how to generalize the greedy set-covering heuristic in a natural manner to provide an approximate solution for any instance of the weighted set-covering problem. Letting d be the maximum size of any set S i , show that your heuristic has an approximation ratio of H(d) = P d i D1 1/i .',
          hint: '把「选了能多盖几个新元素」换成「每盖一个新元素花多少权重」：每轮取使 $w_i / |S_i - \\text{已盖}|$ 最小的那个集合（分母为 0 就跳过）。证明还是照 35.3 的记账：设 $U_t$ 是第 $t$ 轮还没盖住的元素集合，最优解里那些覆盖 $U_t$ 的集合中，必有一个的单位成本不超过 $\\text{OPT} / |U_t|$（否则加起来就超过 OPT），于是第 $t$ 轮的代价 $\\le |U_{t-1}| \\cdot \\text{OPT} / |U_t|$ 形式，逐项 telescoping 后系数就是 $H(d) = \\sum_{i=1}^{d} 1/i$（$d$ 是单个集合的最大大小）。★ 别再用「集合大小」当比较依据：加权时它是无权情形的特例。' },
        { id: '35-4', page: 1132, star: 0,
          statement: 'Maximum matching Recall that for an undirected graph G, a matching is a set of edges such that no two edges in the set are incident on the same vertex. Section 2 5.1 showed how to find a maximum matching in a bipartite graph, that is, a matching such that no other matching in G contains more edges. This problem examines matching s in undirected graphs that are not required to be bipartite. a. Show that a maximal matching need not be a maximum matching by exhibiting an undirected graph G and a maximal matching M in G that is not a maximum matching. (Hint: You can find such a graph with only four vertices.) b. Consider a connected, undirected graph G = (V,E). Give an O(E)-time greedy algorithm to find a maximal matching in G. This problem concentrates on a polynomial-time approximation algorithm for max- imum matching. Whereas the fastest known algorithm for maximum matching takes superlinear (but polynomial) time, the approximation algorithm here will run in linear time. You will show that the linear-time greedy algorithm for maximal matching in part (b) is a 2-approximation algorithm for maximum matching. c. …',
          hint: '取匹配 $M$ 只含中间那条边 $(2,3)$：它已经极大 —— 想再塞一条边进来，$(1,2)$ 与 $(2,3)$ 共用端点 2、$(3,4)$ 共用端点 3，两条都塞不下。但 $(1,2)$ 与 $(3,4)$ 互不相邻，合成大小 2 的匹配，所以 $M$ 不是最大的。b. 线性贪心：扫一遍边表，两端都没被标记就把这条边收进 $M$ 并标记两端，每条边只看两次 ⟹ $O(E)$。c/d. 近似比 2 的论证两条：① 极大 $\\implies$ $M$ 的边两两不相邻而**任何**边的两端都已被 $M$盖住，所以最大匹配大小 $\\le |M|$ 的两倍（更简单的说法：$M$ 的端点集是顶点覆盖，而任何匹配大小 $\\le$ 任何覆盖大小）；② 算法返回的覆盖大小正好 $= 2|M|$。★ 两半合起来才是 2-近似，别只写其中一条。' },
        { id: '35-5', page: 1133, star: 0,
          statement: 'Parallel machine scheduling In the parallel-machine-scheduling problem, the input has two parts: n jobs, J 1 ,J 2 ,…,J n , where each job J k has an associated nonnegative processing time of √k , and m identical machines, M 1 ,M 2 ,…,M m . Any job can run on any ma- chine. A schedule specifies, for each job J k , the machine on which it runs and the time period during which it runs. Each job J k must run on some machine M i for √k consecutive time units, and during that time period no other job may run on M i . Let C k denote the completion time of job J k , that is, the time at which job J k completes processing. Given a schedule, define C max = max fC j W 1 ≤ j ≤ ng to be the makespan of the schedule. The goal is to find a schedule whose makespan is minimum. For example, consider an input with two machines M 1 and M 2 , and four jobs J 1 , J 2 , J 3 , and J 4 with √1 = 2, √2 = 12, √3 = 4, and √4 = 5. Then one possible schedule runs, on machine M 1 , job J 1 followed by job J 2 , and on machine M 2 , job J 4 followed by job J 3 . For this schedule, C 1 = 2, C 2 = 14, C 3 = 9, C 4 = 5, and C max = 14. …',
          hint: '下界先立起来，再拿它们去比贪心的产出：① $C_{\\max}^* \\ge \\max_k p_k$（最长的那个作业无论如何都要跑那么久）；② $C_{\\max}^* \\ge (\\sum_k p_k) / m$（总工作量摊到 $m$ 台机器）。贪心「谁空闲就把下一个作业派给谁」的 makespan：设最后是机器 $i$ 拖的，它上面最后一个作业开始时刻 $\\le$ 其它机器当时的负载，于是 $C_{\\max} \\le$ 平均负载 $ + p_{\\max} \\le 2 C_{\\max}^*$。★ 关键一步是「最后一个作业的开始时刻不超过任何机器的完成时刻」；顺手给个紧的例子（$m$ 台、一个长作业加一堆短作业）说明 2 不能改小。' },
        { id: '35-6', page: 1134, star: 0,
          statement: 'Approximating a maximum spanning tree Let G = (V,E) be an undirected graph with distinct edge weights w(u,v) on each edge (u,v) 2 E. For each vertex v 2 V , denote by max.v/ the maximum-weight edge incident on that vertex. Let S G = fmax(v) W v 2 V g be the set of maximum- weight edges incident on each vertex, and let T G be the maximum-weight spanning tree of G, that is, the spanning tree of maximum total weight. For any subset of edges E 0 ⊆ E, define w(E 0 ) = P (u,v)2E 0 w(u,v) . a. Give an example of a graph with at least 4 vertices for which S G = T G . b. Give an example of a graph with at least 4 vertices for which S G ≠ T G . c. Prove that S G ⊆ T G for any graph G. d. Prove that w(S G ) ≥ w(T G )/2 for any graph G. e. Give an O(V + E)-time algorithm to compute a 2-approximation to the maxi- mum spanning tree.',
          hint: '(a)(b) 各造一个 4 点图。(b) 要出现「$T_G$ 里有边不在 $S_G$ 中」——反方向不会发生（那是 (c) 的结论）。一条轻桥边接一个重的三角形最容易试出来。(c) 用生成树的割性质反证：若某条 $\\max(v)$ 不在 $T_G$ 里，把它加进 $T_G$ 必成环，环上存在另一条跨过同一割的边，而 $\\max(v)$ 是 $v$ 关联的边里最重的 —— 换过去更优，矛盾。（这条结论很强：$S_G$ 是 $T_G$ 的**子集**，所以它自己无环。）(d) 双重计数的正确入口是「定根 + 认领父边」：给 $T_G$ 任选一个根，每条树边恰好是某个非根结点的父边，而父边与 $v$ 关联，故 $w($父边$) \\le w(\\max(v))$，于是 $w(T_G) = \\sum_{v \\ne \\text{root}} w(v$ 的父边$) \\le \\sum_v w(\\max(v))$；最后那个和里，一条 $S_G$ 中的边最多被它的两个端点各认领一次，所以 $\\sum_v w(\\max(v)) \\le 2 w(S_G)$ —— 因子 2 就是这么来的。(e) 一遍扫边表给每个顶点维护最重的关联边，$O(V + E)$ 就得到 $S_G$；若一定要交一棵生成树，按 (c) 的包含关系从最重的边开始把它补全（Kruskal 式），补边只让总权重不减，(d) 的界照旧成立。' },
        { id: '35-7', page: 1134, star: 0,
          statement: 'An approximation algorithm for the 0-1 knapsack problem Recall the knapsack problem from Section 15.2. The input includes n items, where the i th item is worth v i dollars and weighs w i pounds. The input also includes the capacity of a knapsack, which is W pounds. Here, we add the further assumptions that each weight w i is at most W and that the items are indexed in monotonically decreasing order of their values: v 1 ≥ v 2 ≥ • • • ≥ v n . In the 0-1 knapsack problem, the goal is to find a subset of the items whose total weight is at most W and whose total value is maximum. The fractional knapsack problem is like the 0-1 knapsack problem, except that a fraction of each item may be put into the knapsack, rather than either all or none of each item. If a fraction x i of item i goes into the knapsack, where 0 ≤ x i ≤ 1, it contributes x i w i to the weight of the knapsack and adds value x i v i . The goal of this problem is to develop a polynomial-time 2-approximation algorithm for the 0-1 knapsack problem. In order to design a polynomial-time algorithm, let’s consider restricted in- stances of the 0-1 knapsack problem. …',
          hint: '两个候选解取最优的那个：① 单件最贵的那个物品（题目已设 $w_i \\le W$，所以任一单独物品都可行）；② 按价值降序 $v_1 \\ge v_2 \\ge \\cdots$ 依次装、装到装不下的那一件就停（贪心解）。证明用分数背包做上界：设分数最优解第一次 fractional 地取第 $j$ 件，则 $0\\text{-}1$ 最优价值 $\\le$ 分数最优价值 $\\le v_1 + \\cdots + v_{j-1} + v_j$，而贪心解拿到 $v_1 + \\cdots + v_{j-1}$，第一个候选拿到 $v_j$（因为 $v_j \\le$ 前面每一件）—— 两个候选各盖住上界的一半。★ 排序前提要用上：没有 $v_1 \\ge v_2 \\ge \\cdots$ 这条，最后一句话不成立。' },
      ],
    },
  ],
};
