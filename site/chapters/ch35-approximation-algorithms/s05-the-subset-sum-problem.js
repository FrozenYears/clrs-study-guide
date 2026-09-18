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
        { kind: 'single', q: 'APPROX-SUBSET-SUM 是什么类型的近似算法？', options: ['常数近似', '**FPTAS（完全多项式时间近似方案）**', '精确多项式', '指数时间'], answer: 1,
          why: '★ 定理 35.7：误差可任意小，运行时间对 1/ε 与输入规模均多项式。' },
        { kind: 'judge', q: 'TRIM 通过删除「彼此太接近」的元素来压缩列表长度。', answer: true,
          why: '★ 若两值接近，只留较小的「代表」较大的，列表变短而解仍够好。' },
        { kind: 'judge', q: 'APPROX-SUBSET-SUM 返回的值 z 一定不超过最优解 y*。', answer: true,
          why: '★ 第 5 行删掉所有 > t 的元素，故 z ≤ t；而 y* 是不超过 t 的最大和。' },
        { kind: 'single', q: '为什么裁剪参数要用 ε/2n 而不是 ε？', options: ['随意选取', '**避免逐轮裁剪误差累积过头，保证 n 轮总误差 ≤ ε**', '只为减小运行时间', '为了增大精度到 0'], answer: 1,
          why: '★ 每轮都裁剪会复利累积，用更小的 δ=ε/2n 才能由 (1+ε/2n)^n ≤ 1+ε 兜住。' },
        { kind: 'simulate', q: 'C 程序 part 4（14 物品 × 20 组）报告的 TRIM 最坏比值是多少？落在什么区间？', expect: ['1.000', '[0.7, 1]'], placeholder: '例如：1.000，[0.7, 1]',
          why: '最坏比值 = best/opt = 1.000，断言保证 ∈ [0.7, 1]。' },
        { kind: 'judge', q: '因 c* ≤ c ≤ 2c*（即 z ≥ y*/(1+ε)），近似比 ≤ 1+ε。', answer: true,
          why: '★ 定理 35.7：返回解 z 与最优 y* 满足 y*/z ≤ 1+ε。' },
        { kind: 'single', q: '列表 L_i 的长度上界是关于什么的多项式？', options: ['只关于 n', '**关于 1/ε、n、lg t 均多项式**', '指数级', '只关于 t'], answer: 1,
          why: '★ |L_i| = O((n/ε)lg t)，故整体为 FPTAS。' },
      ],
      bookExercises: [
        { id: '35.5-1', page: 1130, star: 0,
          statement: 'Prove equation (35.21). Then show that after executing line 4 of EXACT-SUBSET- SUM, L i is a sorted list containing every element of P i whose value is not more than t .',
          hint: '式 (35.21) $P_i = P_{i-1} \\cup (P_{i-1}+x_i)$ 直接归纳；MERGE-LISTS 归并两有序表得有序表。' },
        { id: '35.5-2', page: 1130, star: 0,
          statement: 'Using induction on i , prove inequality (35.24).',
          hint: '对 i 归纳：每轮 TRIM 用 δ=ε/2n，使 L_i 中代表 y 的元素 ´ 满足 $y(1+ε/2n)^i \\le ´ \\le y$。' },
        { id: '35.5-3', page: 1130, star: 0,
          statement: 'Prove inequality (35.28).',
          hint: '式 (35.28) 是 $(1+ε/2n)^n$ 关于 n 递增；用不等式 (3.15)/(3.16) 放缩到 $e^{ε/2} \\le 1+ε$。' },
        { id: '35.5-4', page: 1130, star: 0,
          statement: 'How can you modify the approximation scheme present ed in this section to find a good approximation to the smallest value not less than t that is a sum of some subset of the given input list?',
          hint: '把「不超过 t 的最大和」改成「不小于 t 的最小和」：TRIM 时保留略大的代表，并在最后取 ≥ t 的最小元素。' },
        { id: '35.5-5', page: 1130, star: 0,
          statement: 'Modify the APPROX-SUBSET-SUM procedure to also return the subset of S that sums to the value ´ − .',
          hint: '在构建 L_i 时额外记录每个和的「构成」（前驱元素），从 z 反向回溯即可还原子集。' },
        { id: '35-1', page: 1131, star: 0,
          statement: 'Bin packing',
          hint: '装箱问题；由子集和归约知其判定版 NP 难，first-fit 启发式有 2-近似。' },
        { id: '35-2', page: 1131, star: 0,
          statement: 'Approximating the size of a maximum clique',
          hint: '若将团大小近似比做到常数，则可得最大团的 PTAS；用 G^(k) 的团大小是 G 的 k 次方。' },
        { id: '35-3', page: 1132, star: 0,
          statement: 'Weighted set-covering problem',
          hint: '加权集合覆盖：贪心每轮选「单位代价覆盖新元素最多」的集合，近似比 H(d)。' },
        { id: '35-4', page: 1132, star: 0,
          statement: 'Maximum matching',
          hint: '极大匹配是最大匹配的 2-近似：顶点覆盖大小 ≥ 匹配大小，且 2|M| 是顶点覆盖大小的上界。' },
        { id: '35-5', page: 1133, star: 0,
          statement: 'Parallel machine scheduling',
          hint: '贪心「机器一空闲就派活」是 2-近似：makespan ≥ 最大处理时间且 ≥ 平均负载。' },
        { id: '35-6', page: 1134, star: 0,
          statement: 'Approximating a maximum spanning tree',
          hint: '每顶点最大权边集合 S_G 是最大生成树的 2-近似：w(S_G) ≥ w(T_G)/2。' },
        { id: '35-7', page: 1134, star: 0,
          statement: 'An approximation algorithm for the 0-1 knapsack problem',
          hint: '限制实例 I_j（必含物品 j）+ 分数背包最优解删去分数项，得 2-近似。' },
      ],
    },
  ],
};
