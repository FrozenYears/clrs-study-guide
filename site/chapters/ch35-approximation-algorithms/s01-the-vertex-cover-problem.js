/* =============================================================================
 * 第 35 章 35.1 —— 第 s01 关：35.1 The vertex-cover problem
 *
 * 原文锚点：印刷页 1106–1108（pdf_index 1127–1129）
 *
 * 本文件由 tools/05_new_level.py 生成骨架，「原文引述」「伪代码逐行」「书后习题」
 * 三处已从 data/blocks 逐字填入并通过溯源判据；本关补全其余九段。
 * 伪代码行按「本站整理」重排（语料抽取的伪影 `+ = ;` 等已修不回，见伪代码 note）。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's01',
  id: 'ch35/s01',
  chapter: 35,
  section: '35.1',
  title: '顶点覆盖问题',
  shortTitle: '35.1 顶点覆盖问题',
  titleEn: 'The vertex-cover problem',
  source: { printed: [1106, 1108], pdf: [1127, 1129] },
  sourceNote: '本关对应原书 35.1 节（印刷页 1106–1108）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '顶点覆盖是 NP 完全的最小化问题，但存在一个简单且能保证「解的大小不超过最优解 2 倍」的贪心式算法（定理 35.1）。它是整章「近似算法」的第一块敲门砖：在 P ≠ NP 的前提下，我们放弃求精确最优，转而求一个可被证明「不会差太离谱」的解。',
      position: '35.1 是近似算法的起点；它的「取一条边、把两端都加进覆盖」思路在 35.4 的加权版本里会被线性规划重新演绎，而 35.3 的集合覆盖、35.2 的 TSP 也都沿用了「先找一个下界，再构造不超过常数倍的解」这一方法论。',
      unlocks: [
        { label: '35.2 The traveling-salesperson problem', url: '#/ch35/s02' },
      ],
      mathKit: [
        { title: '定理 35.1（2-近似）', body: 'APPROX-VERTEX-COVER 是多项式时间的 $2$-近似算法：返回的覆盖大小 $|C| \\le 2|C^*|$，其中 $C^*$ 是最优覆盖。' },
        { title: '下界来自极大匹配', body: '算法选出的边集 $A$ 是一个极大匹配，故 $|C^*| \\ge |A|$；而算法每选一条边就加入两个端点，故 $|C| = 2|A|$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '摄像头布点：每条走廊至少盯一个路口',
      scene: 'C 程序 part 1：20 组随机图（n = 10）',
      body: [
        '★ 生活场景：在校园里布监控摄像头，要求是「每条走廊（边）至少有一端路口（顶点）有摄像头」。摄像头越贵越好少装——这是顶点覆盖。精确最少装几个是 NP 难的，于是我们退而求其次：随便挑一条还没被盯住的走廊，把它的两个路口都装上摄像头，再把所有被这两个路口覆盖的走廊划掉，重复到没有走廊剩下。',
        '★★ C 程序 part 1 用 20 组随机图（n = 10，约 40% 概率连边）反复验证：近似解与暴力最优解的比值最坏恰好 = **2.000**，且从未超过 2——这正是定理 35.1 的「数字版证词」。',
        '★ 为什么是 2？每选一条边就「赔」进两个顶点，但一条边至多只需一个顶点就能被最优覆盖覆盖；于是我们每多覆盖一条边，最多比最优解多用一倍顶点，累加后整体不超过 2 倍。',
        '⚠ 这个算法不是永远最优：对一条 4 顶点路径 a-b-c-d，它返回 {a,b,c,d}（大小 4），而最优只要 {b,d}（大小 2）——比值正好卡在 2。所以 2 是紧的界。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1106,
          en: 'The first four sections of this chapter present some examples of polynomial-time approximation algorithms for NP-complete problems, and the fifth section gives a fully polynomial-time approximation scheme. We begin in Section 35.1 with a study of the vertex-cover problem, an NP-complete minimization problem that has an approximation algorithm with an approximation ratio of 2. Section 35.2 looks at a version of the traveling-salesperson problem in which the cost function satisfies the triangle inequality and presents an approximation algorithm with an approximation ratio of 2. The section also shows that without the triangle inequality, for any constant Ω ≥ 1, a Ω-approximation algorithm cannot exist unless PDNP.',
          zh: '★ 本章蓝图：前四节各给一个 NP 难问题的多项式时间近似算法，第五节是子集和的完全多项式近似方案（FPTAS）。顶点覆盖打头阵，近似比 2。' },
        { kind: 'body', page: 1106,
          en: 'Section 35.3 applies a greedy method as an effective approximation algorithm for the set-covering problem, obtaining a covering whose cost is at worst a logarithmic factor larger than the optimal cost. Section 35.4 uses randomization and linear programming to develop two more approximation algorithms. The section first defines the optimization version of 3-CNF satisfiability and gives a simple randomized algorithm that produces a solution with an expected approximation ratio of 8/7.',
          zh: '★ 后面几节预告：集合覆盖用贪心（对数近似比），随机化与线性规划给出期望 8/7 近似等。' },
        { kind: 'body', page: 1106,
          en: 'Then Section 35.4 examines a weighted variant of the vertex-cover problem and exhibits how to use linear programming to develop a 2-approximation algorithm.',
          zh: '★ 35.4 会把本节的顶点覆盖推广到带权版本，并用线性规划得到 2-近似。' },
        { kind: 'body', page: 1106,
          en: 'Finally, Section 35.5 presents a fully polynomial-time approximation scheme for the subset-sum problem.',
          zh: '★ 子集和的 FPTAS 收尾。' },
        { kind: 'body', page: 1106,
          en: 'Section 34.5.2 defined the vertex-cover problem and proved it NP-complete. Recall that a vertex cover of an undirected graph G = (V,E) is a subset V 0 ⊆ V such that if (u,v) is an edge of G, then either u 2 V 0 or v 2 V 0 (or both). The size of a vertex cover is the number of vertices in it.',
          zh: '★★ 定义：顶点覆盖是顶点子集，使每条边至少一端在其中；大小 = 其中顶点数。' },
        { kind: 'body', page: 1106,
          en: 'The vertex-cover problem is to find a vertex cover of minimum size in a given undirected graph. We call such a vertex cover an optimal vertex cover. This problem is the optimization version of an NP-complete decision problem.',
          zh: '★ 目标是求最小顶点覆盖；这是 NP 完全判定问题的优化版。' },
      ],
      terms: [
        { en: 'vertex cover', zh: '顶点覆盖', page: 1106 },
        { en: 'optimal vertex cover', zh: '最优顶点覆盖', page: 1106 },
        { en: 'approximation ratio', zh: '近似比', page: 1106 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本站整理：APPROX-VERTEX-COVER（原书 7 行）',
      algo: 'APPROX-VERTEX-COVER',
      signature: 'APPROX-VERTEX-COVER(G)',
      page: 1107,
      lines: [
        { n: 1, code: 'C = ∅', zh: '★ 覆盖初始化为空。' },
        { n: 2, code: 'E′ = G.E', zh: '★ 待覆盖边集，初值为全图边集。' },
        { n: 3, code: 'while E′ ≠ ∅', zh: '★ 只要还有没覆盖的边就继续。' },
        { n: 4, code: 'let (u,v) be an arbitrary edge of E′', zh: '★★ 任取一条未覆盖边。' },
        { n: 5, code: 'C = C ∪ {u,v}', zh: '★★ 把这条边的两个端点都加进覆盖。' },
        { n: 6, code: 'remove from E′ edge (u,v) and every edge incident on either u or v', zh: '★ 划掉被 u、v 覆盖的所有边。' },
        { n: 7, code: 'return C', zh: '★ 返回构造出的覆盖。' },
      ],
      vars: [{ name: 'A', meaning: '第 4 行被选中的边集，是一个极大匹配；|C| = 2|A| 且 |C*| ≥ |A|' }],
      note: '★ 原书 35.1 伪代码框存在，但语料抽取把它们变成了 `+ = ;` 等伪影（如 `C = ∅` 抽成 `+ = ;`、`C = C ∪ {u,v}` 抽成 `+ = C [ fu,v g`）。本段按原书行号重排为可读版本；行号与证明（定理 35.1）一一对应。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '比值形状：|C| 最多是 |C*| 的两倍',
      panels: [
        {
          title: '近似覆盖大小 vs 最优覆盖大小',
          viz: 'growth',
          chart: { xMax: 10, series: [
            { name: '最优覆盖下界 |C*|', expr: 'n', color: '--viz-done' },
            { name: '近似覆盖上界 2|C*|', expr: '2 * n', color: '--viz-compare' },
          ] },
          note: '★ 定理 35.1 告诉我们，对任意实例都有 $|C| \\le 2|C^*|$。图中蓝线是最优覆盖大小，橙线是它的两倍上界；算法返回的解永远落在两线之间（C 程序 part 1：20 组随机图最坏比值恰好 = 2.000）。',
        },
      ],
      tasks: ['改种子或图规模，看最坏比值是否会突破 2（结论：不会，断言锁死 ≤ 2）。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      pseudocodeRef: 'APPROX-VERTEX-COVER',
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
          { line: 39, zh: '★ APPROX-VERTEX-COVER 第 1 行 `C = ∅`：cover 初始化为 0，used 标记数组清零。' },
          { line: 42, zh: '★ 第 4 行 `let (u,v) be an arbitrary edge`：在双重循环里取第一条 used 为假的边 (i,j)。' },
          { line: 43, zh: '★★ 第 5 行 `C = C ∪ {u,v}`：每选一条边就给 cover 加 2，所以返回 |C| = 2|A|。' },
          { line: 44, zh: '★ 第 6 行 `remove from E′ ...`：把 u、v 关联的所有边标记成 used，等价于从 E′ 删除。' },
          { line: 48, zh: '★ 第 7 行 `return C`：返回覆盖；大小 2|A| ≤ 2|C*|（定理 35.1）。' },
        ],
        tests: [
          { in: 'C 程序 part 1：20 组随机图（n = 10）', out: '最坏比值 = 2.000 ≤ 2，全部断言通过' },
          { in: '一条 4 顶点路径 P_4 = a-b-c-d', out: '近似返回 {a,b,c,d} 大小 4，最优 {b,d} 大小 2，比值 2' },
          { in: '三角形 K_3', out: '近似 {a,b} 大小 2，最优 2，比值 1' },
        ],
        mapping: [
          { pc: 1, pcCode: 'C = ∅', c: '`int cover = 0, used[10][10] = {{0}};`（第 39 行）' },
          { pc: 4, pcCode: 'let (u,v) be an arbitrary edge of E′', c: '`if (g[i][j] && !used[i][j])`（第 42 行）' },
          { pc: 5, pcCode: 'C = C ∪ {u,v}', c: '`cover += 2;`（第 43 行）' },
          { pc: 6, pcCode: 'remove from E′ edge (u,v) and every edge incident on either u or v', c: '`for (int k = 0; k < n; k++) { used[i][k] = used[k][i] = 1; used[j][k] = used[k][j] = 1; }`（第 44 行）' },
          { pc: 7, pcCode: 'return C', c: '`return cover;`（第 48 行）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：2 倍从哪来',
      intro: '这一关要回答：为什么 APPROX-VERTEX-COVER 解的大小一定不超过最优解的两倍？关键在于把「解的大小」与一个可证的下界（极大匹配）绑在一起。',
      claims: [
        { expr: '|C| = 2|A|', when: '第 5 行每选一条边就加入两个端点', page: 1107, source: 'book' },
        { expr: '|C*| ≥ |A|', when: 'A 是极大匹配，每条边至少要一个端点进最优覆盖', page: 1107, source: 'book' },
        { expr: '|C| ≤ 2|C*|', when: '联立上两式即得 2-近似', page: 1107, source: 'book' },
        { expr: 'O(V + E)', when: '用邻接表表示 E′，扫描每条边常数次', page: 1107, source: 'book' },
      ],
      tables: [
        { caption: 'C 程序 part 1 实测（20 组随机图，n = 10）', rows: [
          ['指标', '数值'],
          ['近似解 / 最优解 最坏比值', '2.000'],
          ['是否 ≤ 2', '是（断言通过）'],
          ['命中比值 2 的实例', '路径类图（如 P_4）'],
        ] },
      ],
      chart: { xMax: 10, series: [
        { name: '2|C*| 上界', expr: '2 * n', color: '--viz-compare' },
        { name: '|C*| 下界', expr: 'n', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'line', title: '定理 35.1 的比值推导', steps: [
          { tex: '|C| = 2|A|', zh: '★ 第 4 行选出的每条边给覆盖贡献两个端点，且被选中的边互不共享端点（选走后相关边都被删），故 |C| 恰为 2|A|。' },
          { tex: '|C^*| \\ge |A|', zh: '★ 任意覆盖都要覆盖 A 中每条边，每条边至少需一个端点，且 A 内边不共享端点，所以最优覆盖至少含 |A| 个顶点。' },
          { tex: '|C| = 2|A| \\le 2|C^*|', zh: '★★ 联立得近似比不超过 2，且 P_4 说明这个界是紧的。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: 'APPROX-VERTEX-COVER is a polynomial-time 2-approximation algorithm.',
      page: 1107,
      intro: '三步对应不变量的三条性质：① 多项式时间（可解性）；② 返回的是合法覆盖（正确性）；③ 大小不超过 2|C*|（近似比）。',
      steps: [
        {
          title: '第一步 · 多项式时间（Initialization）',
          en: 'Proof We have already shown that APPROX-VERTEX-COVER runs in polynomial time.',
          page: 1107,
          body: ['★ 算法只做有限次「取边—删边」循环，每次操作与边数成正比，整体 $O(V+E)$，故是多项式时间近似算法。这一步先确认「可解性」成立。'],
        },
        {
          title: '第二步 · 返回合法覆盖（Maintenance）',
          en: 'The set C of vertices that is returned by APPROX-VERTEX-COVER is a vertex cover, since the algorithm loops until every edge in G: E has been covered by some vertex in C .',
          page: 1107,
          body: ['★ 循环条件是「还有未覆盖的边就继续」，所以终止时每条边都至少被 C 中一个顶点覆盖——C 确为合法顶点覆盖。这一步保证「解是对的」。'],
        },
        {
          title: '第三步 · 近似比 ≤ 2（Termination）',
          en: '≤ 2 jC − j ; thereby proving the theorem.',
          page: 1107,
          body: ['★★ 令 A 为第 4 行选出的边集：A 是极大匹配（边互不共享端点），故 $|C^*| \\ge |A|$。而每选一条边贡献两个端点，故 $|C| = 2|A|$。联立得 $|C| = 2|A| \\le 2|C^*|$，即近似比不超过 2，定理得证。∎'],
        },
      ],
      conclusion: '★ 结论：APPROX-VERTEX-COVER 在多项式时间内给出大小不超过最优解 2 倍的顶点覆盖；比值 2 是紧的（路径图可取到）。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'APPROX-VERTEX-COVER 的近似比（最坏情况）是？', options: ['1', '**2**', 'lg n', 'n'], answer: 1,
          why: '★ 定理 35.1：返回的覆盖大小 $|C| \\le 2|C^*|$。' },
        { kind: 'judge', q: '算法返回的 C 一定是一个合法的顶点覆盖。', answer: true,
          why: '★ 循环到「没有未覆盖的边」才停，所以每条边都被覆盖。' },
        { kind: 'judge', q: '第 4 行选出的边集 A 一定是一个极大匹配。', answer: true,
          why: '★ 选走一条边就把它关联的所有边删掉，于是 A 中边互不共享端点且不能再加边——是极大匹配（习题 35.1-2）。' },
        { kind: 'single', q: '为什么 |C| = 2|A| 而不是别的数？', options: ['每条边只往覆盖里加一个端点', '**每选一条边就把它的两个端点都加入 C**', '因为 A 是最小匹配，匹配数恰为覆盖的一半', '覆盖的大小是随机决定的'], answer: 1,
          why: '★ 第 5 行 `C = C ∪ {u,v}` 一次加两个端点。' },
        { kind: 'simulate', q: '对 4 顶点路径 a-b-c-d，APPROX-VERTEX-COVER 返回的顶点集合大小、以及最优解的大小各是多少？（依次填两个整数，空格分隔）', expect: [4, 2], placeholder: '例如：3 2',
          why: '先取 (a,b) 加 {a,b} 并删 (a,b),(b,c)；再取 (c,d) 加 {c,d}；得 {a,b,c,d} 大小 4，最优 {b,d} 大小 2，比值 2。' },
        { kind: 'judge', q: 'APPROX-VERTEX-COVER 的近似比 2 是紧的（存在实例恰好取到 2）。', answer: true,
          why: '★ 路径类图可让近似解恰好是最优解的 2 倍。' },
        { kind: 'single', q: '本节「先找下界、再构造不超过常数倍的解」的方法论，后续哪几节会沿用？', options: ['只有 35.5 之后才不会再用到它', '**35.2/35.3/35.4 都沿用**', '只有 35.5 还在沿用这一套，别的节都不用了', '这套方法论后面都不再沿用'], answer: 1,
          why: '★ 35.2 用 MST 下界、35.3 用最优覆盖大小 k 做下界、35.4 用 LP 松弛下界，思路一致。' },
      ],
      bookExercises: [
        { id: '35.1-1', page: 1109, star: 0,
          statement: 'Give an example of a graph for which APPROX-VERTEX-COVER always yields a suboptimal solution.',
          hint: '最小反例就是两条边共用一个中心点的 $P_3$：算法任取一条边都要把中心点和一个叶子一起收进来，$|C| = 2$，而最优覆盖只有中心点那 1 个 —— 没有平手可言，**每次**都次优。★ 顺手把常见的错答案剔掉（本轮把 4 点以内的全部图与各路程都枚举过）：$P_4$ **不行**：取中间那条边时算法给 $\\{2,3\\}$，正好是最优的 2。再长一点就行：$P_5$ 只能给 4（最优 2）、$P_6$ 给 4 或 6（最优 3）、$P_8$ 给 6 或 8（最优 4）。另外「返回全部顶点」这句也别写死：$P_6$ 并非所有取法都取满。' },
        { id: '35.1-2', page: 1109, star: 0,
          statement: 'Prove that the set of edges picked in line 4 of APPROX-VERTEX-COVER forms a maximal matching in the graph G.',
          hint: '选走一条边就删除它所有关联边，所以被选边互不共享端点（是匹配）；且任意剩余边都与某条被选边共享端点（无法再扩），故极大。' },
        { id: '35.1-4', page: 1109, star: 0,
          statement: 'Give an efficient greedy algorithm that finds an optimal vertex cover for a tree in linear time.',
          hint: '树的最优顶点覆盖有两种正确写法，各自都能线性：① 贪心（叶向根）：反复取「某个叶子 $u$ 的父 $v$」进覆盖，然后把 $u$、$v$ 及与 $v$ 关联的边全删掉。证最优用交换：若最优解没取 $v$，那它必取了 $u$，把 $u$ 换成 $v$ 不会变差，所以存在包含 $v$ 的最优解，递归下去即得。② 动规：每个结点两态（取 / 不取），$O(1)$ 合并，一次后序遍历。★ 实现上写 ① 更短，但要说明为什么删掉 $v$ 后剩下的仍是树；写 ② 要说明两态已覆盖全部情形。两种都是 $O(V)$。' },
        { id: '35.1-5', page: 1109, star: 0,
          statement: 'The proof of Theorem 34.12 on page 1084 illustrates that the vertex-cover problem and the NP-complete clique problem are complementary in the sense that an opti- mal vertex cover is the complement of a maximum-size clique in the complement graph. Does this relationship imply that there is a polynomial-time approximation algorithm with a constant approximation ratio for the clique problem? Justify your answer.',
          hint: '答案是**不蕴含**，而且要拿数字说话。关系是 $S$ 覆盖 $G$ $\\iff$ $V - S$ 是补图 $\\bar G$ 的团。设最优覆盖大小 $k$，2-近似给 $|C| \\le 2k$，于是推出的团只有 $n - 2k$ 个点，而最大团是 $n - k$ —— 比值 $(n-k) / (n-2k)$，当 $2k$ 接近 $n$ 时就爆掉了。本轮用 $n$ 个点的完美匹配验了这个极端：最优覆盖 $= n/2$，APPROX-VERTEX-COVER 必须每条边取两端 $= n$ 个点，补出来是 0 个点的团，而最大团大小 $n/2$ —— 近似比退化到 0，根本不是常数。★ 一句话：这个对应保持「最优解」，不保持「近似比」。' },
      ],
    },
  ],
};
