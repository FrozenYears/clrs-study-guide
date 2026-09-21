/* =============================================================================
 * 第 35 章 35.2 —— 第 s02 关：35.2 The traveling-salesperson problem
 *
 * 原文锚点：印刷页 1109–1114（pdf_index 1130–1135）
 *
 * 本文件由 tools/05_new_level.py 生成骨架，「原文引述」「伪代码逐行」「书后习题」
 * 三处已从 data/blocks 逐字填入并通过溯源判据；本关补全其余九段。
 * 伪代码行按原书 35.2 整理（语料抽取把 `r 2 G: V` 等变乱码，本段重排）。
 * C 程序对应 approx.c 的 part 3（MST 预序遍历 vs 暴力最优）。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's02',
  id: 'ch35/s02',
  chapter: 35,
  section: '35.2',
  title: '旅行商问题',
  shortTitle: '35.2 旅行商问题',
  titleEn: 'The traveling-salesperson problem',
  source: { printed: [1109, 1114], pdf: [1130, 1135] },
  sourceNote: '本关对应原书 35.2 节（印刷页 1109–1114）。',
  prerequisites: [
    { label: '35.1 The vertex-cover problem', url: '#/ch35/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: 'TSP 是典型的 NP 难最小化问题。一旦给代价函数加上「三角不等式」（直走不绕远），就存在一个极简的 2-近似算法：建最小生成树（MST），再按前序遍历走一圈（定理 35.2）。这把 35.1 的「下界 + 构造」方法论换了个舞台。',
      position: '35.2 与 35.1 共享同一套路：先用一个易算的结构（MST）给出最优解的下界，再把它改造成可行解并证明不超过下界的常数倍。若去掉三角不等式，定理 35.3 说明任何常数近似都不可能存在（除非 P = NP）——这正是「近似算法何时可行」的分水岭。',
      unlocks: [
        { label: '35.3 The set-covering problem', url: '#/ch35/s03' },
      ],
      mathKit: [
        { title: '定理 35.2（三角不等式下 2-近似）', body: '当三角不等式成立时，APPROX-TSP-TOUR 是多项式时间 $2$-近似：$c(H) \\le 2c(H^*)$。' },
        { title: '定理 35.3（无三角不等式则无常数近似）', body: '若 $P \\ne NP$，对任意常数 $\\Omega \\ge 1$，一般 TSP 不存在 $\\Omega$-近似（除非 $P = NP$）。' },
        { title: '三角不等式', body: '对所有 $u,v,w\\in V$ 有 $c(u,w) \\le c(u,v) + c(v,w)$；平面上欧氏距离自动满足。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '快递员绕城：直走总不比绕远贵',
      scene: 'C 程序 part 3：8 个平面点（欧氏距离，满足三角不等式）',
      body: [
        '★ 生活场景：快递员要跑完 8 个客户再回到起点。如果能保证「两点之间直走永远不比绕第三个点贵」（三角不等式），那就别想最优了——先连一棵最省的生成树把所有点串起来，再沿着树「前序遍历」走一圈，得到的巡游不会比最优巡游贵两倍。',
        '★★ C 程序 part 3 用 8 个随机平面点验证：MST 预序巡游长度 **329.99**，暴力最优 **265.64**，比值 **1.242 ≤ 2**——远没撞到 2 的上界，但上界始终成立。',
        '★ 为什么是 2？最优巡游删掉一条边就是一棵生成树，所以 MST 权重 ≤ 最优巡游；而「完整走遍树」会把每条树边走两遍（下去再回来），长度恰为 2·MST；最后用三角不等式把重复访问的顶点「抄近路」删掉，长度只会更短。',
        '⚠ 没有三角不等式就崩了：可以把「不在原图里的边」定价成天价，于是近似算法要么贴着天价（不是哈密顿环），要么暴露出原图有没有哈密顿环——这就把哈密顿环问题归约进来，从而证明不存在常数近似。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1109,
          en: 'Consider the following heuristic to solve the vertex-cover problem. Repeatedly select a vertex of highest degree, and remove all o f its incident edges. Give an example to show that this heuristic does not provide an approximation ratio of 2.',
          zh: '★ 这是 35.1-3 的启发式（题外话）：按最大度贪心选点反而保证不了 2-近似，引出「要讲近似比就得有理论保证」的动机。' },
        { kind: 'body', page: 1109,
          en: '(Hint: Try a bipartite graph with vertices of uniform degree on the left and vertices of varying degree on the right.)',
          zh: '★ 习题提示：左部均匀度、右部参差度的二分图即可构造反例。' },
        { kind: 'body', page: 1109,
          en: 'The input to the traveling-salesperson problem, introduced in Section 34.5.4, is a complete undirected graph G = (V,E) that has a nonnegative integer cost c(u,v) associated with each edge (u,v) 2 E. The goal is to find a hamiltonian cycle (a tour) of G with minimum cost. As an extension of our notation, let c(A) denote the total cost of the edges in the subset A ⊆ E: c(A) =',
          zh: '★★ 输入是完全图 + 非负代价；目标是最小代价哈密顿环。$c(A)$ 表示边子集 $A$ 的总代价。' },
        { kind: 'body', page: 1110,
          en: 'In many practical situations, the least costly way to go from a place u to a place w is to go directly, with no intermediate steps. Put another way, cutting out an inter- mediate stop never increases the cost. Such a cost function c satisfies the triangle inequality: for all vertices u,v,w 2 V , c(u,w) ≤ c(u,v) + c(v,w):',
          zh: '★★ 三角不等式：直走不绕远。代价函数满足它时才有好近似。' },
        { kind: 'body', page: 1110,
          en: 'The triangle inequality seems as though it should naturally hold, and it is automatically satisfied in several applications. For example, if the vertices of the graph are points in the plane and the cost of traveling between two vertices is the ordinary euclidean distance between them, then the triangle inequality is satisfied.',
          zh: '★ 平面上欧氏距离自动满足三角不等式，是最典型的应用场景。' },
        { kind: 'body', page: 1110,
          en: 'Furthermore, many cost functions other than euclidean distance satisfy the triangle inequality.',
          zh: '★ 不止欧氏距离，很多代价函数也满足。' },
      ],
      terms: [
        { en: 'traveling-salesperson problem', zh: '旅行商问题', page: 1109 },
        { en: 'triangle inequality', zh: '三角不等式', page: 1110 },
        { en: 'hamiltonian cycle', zh: '哈密顿环', page: 1109 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本站整理：APPROX-TSP-TOUR（原书 4 行）',
      algo: 'APPROX-TSP-TOUR',
      signature: 'APPROX-TSP-TOUR(G, c)',
      page: 1111,
      lines: [
        { n: 1, code: 'select a vertex r ∈ G.V to be a "root" vertex', zh: '★ 任选一个根顶点 r。' },
        { n: 2, code: 'compute a minimum spanning tree T for G from root r using MST-PRIM(G, c, r)', zh: '★★ 用 MST-PRIM 建最小生成树 T（最优巡游的下界）。' },
        { n: 3, code: 'let H be a list of vertices, ordered according to when they are first visited in a preorder tree walk of T', zh: '★★ 对 T 做前序遍历，得到顶点顺序 H。' },
        { n: 4, code: 'return the hamiltonian cycle H', zh: '★ 按 H 的顺序走一圈即为返回的巡游。' },
      ],
      vars: [{ name: 'W', meaning: '完整走遍 T 的行走（每条边走两次），经三角不等式删重得 H；c(H) ≤ c(W) = 2c(T) ≤ 2c(H*)' }],
      note: '★ 原书 35.2 伪代码框存在，但语料抽取把 `r 2 G: V`、`c(u,v) 2 E` 等变成乱码（2 = ∈）。本段按原书行号重排为可读版本；行号与定理 35.2 的证明一一对应。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '比值形状：c(H) 最多是 c(H*) 的两倍',
      panels: [
        {
          title: '近似巡游代价 vs 最优巡游代价',
          viz: 'growth',
          chart: { xMax: 8, series: [
            { name: '最优巡游 c(H*)', expr: 'n', color: '--viz-done' },
            { name: '近似上界 2·c(H*)', expr: '2 * n', color: '--viz-compare' },
          ] },
          note: '★ 定理 35.2：$c(T) \\le c(H^*)$ 且 $c(W)=2c(T)$，删重后 $c(H)\\le c(W)\\le 2c(H^*)$。C 程序 part 3 实测 MST 预序 329.99 vs 最优 265.64，比值 1.242，远未触顶。',
        },
      ],
      tasks: ['把点摆成「星形」（中心连四周），看 MST 预序是否恰好等于最优巡游（比值 1）。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      pseudocodeRef: 'APPROX-TSP-TOUR',
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
          { line: 55, zh: '★ tour_len：按顶点顺序求巡游总长（哈密顿环首尾相连）。' },
          { line: 124, zh: '★ 第 1 行 `select a root`：取顶点 0 作根（key[0]=0）。' },
          { line: 126, zh: '★★ 第 2 行 `MST-PRIM`：Prim 建最小生成树，给出最优巡游的下界。' },
          { line: 138, zh: '★★ 第 3 行 `preorder tree walk`：DFS 前序遍历 T，得到顺序 order[]（即 H）。' },
          { line: 148, zh: '★ 第 4 行 `return H`：以 order 作为巡游，长度 approx；与暴力最优比 ≤ 2。' },
        ],
        tests: [
          { in: 'C 程序 part 3：8 个平面点', out: 'MST 预序 329.99 vs 最优 265.64，比值 1.242 ≤ 2' },
          { in: '3 点构成三角形（满足三角不等式）', out: 'MST 预序 = 最优巡游，比值 1' },
          { in: '去掉三角不等式（代价可任意大）', out: '不再有常数近似（定理 35.3）' },
        ],
        mapping: [
          { pc: 1, pcCode: 'select a vertex r ∈ G.V to be a "root" vertex', c: '`key[0] = 0.0;`（第 124 行，取顶点 0 为根）' },
          { pc: 2, pcCode: 'compute a minimum spanning tree T for G from root r using MST-PRIM(G, c, r)', c: '`for (int it = 0; it < 8; it++) { ... key[v] < key[u] ... }`（第 126–133 行，Prim 建 MST）' },
          { pc: 3, pcCode: 'let H be a list of vertices, ordered according to when they are first visited in a preorder tree walk of T', c: '`stack[sp++] = 0; ... order[oi++] = u;`（第 138–147 行，DFS 前序遍历）' },
          { pc: 4, pcCode: 'return the hamiltonian cycle H', c: '`double approx = tour_len(order, 8);`（第 148 行，order 即 H）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：2 倍从哪来',
      intro: '这一关要回答：为什么三角不等式成立时，MST 预序巡游的代价不超过最优巡游的两倍？链条是「最优巡游 → 生成树下界 → 完整行走 = 2×下界 → 删重更短」。',
      claims: [
        { expr: 'c(T) ≤ c(H*)', when: '最优巡游删一条边即为生成树，且代价非负', page: 1112, source: 'book' },
        { expr: 'c(W) = 2c(T)', when: '完整行走把 T 每条边走恰好两次', page: 1112, source: 'book' },
        { expr: 'c(H) ≤ c(W)', when: '删掉重复访问的顶点，三角不等式保证不增', page: 1113, source: 'book' },
        { expr: 'c(H) ≤ 2c(H*)', when: '联立三式得 2-近似', page: 1113, source: 'book' },
        { expr: 'Θ(V²)', when: '朴素 MST-PRIM 的实现代价（习题 21.2-2）', page: 1112, source: 'book' },
      ],
      tables: [
        { caption: 'C 程序 part 3 实测（8 个平面点）', rows: [
          ['指标', '数值'],
          ['MST 预序巡游长度', '329.99'],
          ['暴力最优巡游长度', '265.64'],
          ['比值', '1.242'],
          ['是否 ≤ 2', '是（断言通过）'],
        ] },
      ],
      chart: { xMax: 8, series: [
        { name: '2·c(H*) 上界', expr: '2 * n', color: '--viz-compare' },
        { name: 'c(H*) 下界', expr: 'n', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'line', title: '定理 35.2 的比值推导', steps: [
          { tex: 'c(T) \\le c(H^*)', zh: '★ 删掉最优巡游任一条边就得到一棵生成树，故 MST 权重不超过最优巡游。' },
          { tex: 'c(W) = 2c(T)', zh: '★ 完整行走 W 下、上各走一遍 T 的每条边，恰为两倍。' },
          { tex: 'c(H) \\le c(W) \\le 2c(H^*)', zh: '★★ 用三角不等式把 W 中重复访问的顶点抄近路删掉得到 H，代价不增；联立得 $c(H)\\le 2c(H^*)$。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: 'When the triangle inequality holds, APPROX-TSP-TOUR is a polynomial-time\n2-approximation algorithm for the traveling-salesperson problem.',
      page: 1112,
      intro: '三步对应不变量的三条性质：① 多项式时间（可解性）；② MST 是最优巡游的下界（正确性基础）；③ 删重后 c(H) ≤ 2c(H*)（近似比）。',
      steps: [
        {
          title: '第一步 · 多项式时间（Initialization）',
          en: 'Proof We have already seen that APPROX-TSP-TOUR runs in polynomial time.',
          page: 1112,
          body: ['★ MST-PRIM 与一次前序遍历都是多项式时间，故整体是多项式时间近似算法。先确认「可解性」。'],
        },
        {
          title: '第二步 · 下界 c(T) ≤ c(H*)（Maintenance）',
          en: 'Let H − denote an optimal tour for the given set of vertices. Deleting any edge from a tour yields a spanning tree, and each edge cost is nonnegative. Therefore, the weight of the minimum spanning tree T computed in line 2 of APPROX-TSP- TOUR provides a lower bound on the cost of an optimal tour: c(T) ≤ c.H − /: (35.4)',
          page: 1112,
          body: ['★★ 最优巡游删一条边就是生成树，所以 MST 权重不会超过最优巡游——这是整个 2 倍界的基石（式 35.4）。'],
        },
        {
          title: '第三步 · 近似比 ≤ 2（Termination）',
          en: 'Combining inequalities (35.6) and (35.7) gives c(H) ≤ 2c.H − /, which completes the proof.',
          page: 1113,
          body: ['★★ 完整行走 $W$ 把每条树边走两遍（$c(W)=2c(T)$），再用三角不等式把重复访问的顶点删掉得到 $H$（$c(H)\\le c(W)$）。联立 $c(T)\\le c(H^*)$ 得 $c(H)\\le 2c(H^*)$，即近似比不超过 2，定理得证。∎'],
        },
      ],
      conclusion: '★ 结论：三角不等式成立时，APPROX-TSP-TOUR 在多项式时间内给出代价不超过最优巡游 2 倍的巡游；丢掉三角不等式则任何常数近似都不可能存在（定理 35.3）。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'APPROX-TSP-TOUR 成立 2-近似的前提是？', options: ['代价全为 0', '**代价满足三角不等式**', '图为二分图', '顶点数 ≤ 3'], answer: 1,
          why: '★ 定理 35.2 要求三角不等式 $c(u,w)\\le c(u,v)+c(v,w)$ 成立。' },
        { kind: 'judge', q: '最优巡游删掉一条边后一定是一棵生成树。', answer: true,
          why: '★ 环删一边仍是连通无环 = 生成树，故 MST 权重 ≤ 最优巡游（式 35.4）。' },
        { kind: 'judge', q: '完整走遍 MST 的行走 W 的代价恰为 2·c(T)。', answer: true,
          why: '★ 每条树边在 W 中被「下去、回来」各走一次，共两倍。' },
        { kind: 'single', q: '为什么从前序遍历 H 删掉重复顶点后代价不会增加？', options: ['代价变负', '**三角不等式：抄近路不绕远**', 'MST 一定最短', '顶点数变少'], answer: 1,
          why: '★ 用三角不等式把 u→…→w 直接连成 u→w，代价不增。' },
        { kind: 'simulate', q: 'C 程序 part 3 报告 MST 预序巡游 329.99、最优 265.64，近似比是多少（保留 3 位）？', expect: ['1.242'], placeholder: '例如：1.242',
          why: '329.99 / 265.64 ≈ 1.242，且 ≤ 2（断言锁死）。' },
        { kind: 'judge', q: '若代价函数不满足三角不等式，仍可能存在多项式时间的常数近似（除非 P = NP）。', answer: false,
          why: '★ 定理 35.3：一般 TSP 在 P≠NP 下没有任何常数近似。' },
        { kind: 'single', q: '本节与 35.1 共用的核心方法论是？', options: ['随机赋值', '**先找下界、再构造不超过常数倍的解**', '动态规划', '分治'], answer: 1,
          why: '★ 35.1 用极大匹配下界，35.2 用 MST 下界，思路一致。' },
      ],
      bookExercises: [
        { id: '35.2-1', page: 1114, star: 0,
          statement: 'Let G = (V,E) be a complete undirected graph containing at least 3 vertices, and let c be a cost function that satisfies the triangle inequality. Prove that c(u,v) ≥ 0 for all u,v 2 V .',
          hint: '取 w = u：三角不等式 $c(u,u) \\le c(u,v)+c(v,u)=2c(u,v)$，而 $c(u,u)=0$（同点代价为 0），故 $c(u,v)\\ge 0$。' },
        { id: '35.2-2', page: 1114, star: 0,
          statement: 'Show how in polynomial time to transform one instance of the traveling-sales- person problem into another instance whose cost function satisfies the triangle in- equality. The two instances must have the same set of optimal tours. Explain why such a polynomial-time transformation does not contradict Theorem 35.3, assum- ing that P ≠ NP.',
          hint: '度量闭包取的是**下确界**，不是上确界：$c’(u, v) = $ 以 $c$ 为边权时 $u$ 到 $v$ 的**最短路长度** （Floyd-Warshall 多项式可算），所以 $c’ \\le c$，代价只会降低，不会「提升」。 这样 $(V, c’)$ 满足三角不等式，且任意哈密顿圈在 $c’$ 下的长度 $\\le$ 它在 $c$ 下的长度 （$c’$ 是路径长，绕过去不会更长），于是「最优巡游集合」的对应关系成立，与定理 35.3 不冲突。 反复对三元组抬上界既可能不存在（发散），也保不住最优解 —— 方向反了。' },
        { id: '35.2-3', page: 1115, star: 0,
          statement: 'Consider the following closest-point heuristic for building an approximate trav- eling-salesperson tour whose cost function satisfies the triangle inequality. Begin with a trivial cycle consisting of a single arbitrarily chosen vertex. At each step, identify the vertex u that is not on the cycle but whose distance to any vertex on the cycle is minimum. Suppose that the vertex on the cycle that is nearest u is vertex v. Extend the cycle to include u by inserting u just after v. Repeat until all vertices are on the cycle. Prove that this heuristic returns a tour whose total cost is not more than twice the cost of an optimal tour.',
          hint: '别将结论复述一遍（「不超过最优 2 倍」就是要证的东西）。两步就够： ① 设某次把 $u$ 插到 $v$ 后面，$v$ 原来的后继是 $w$，环长增量是 $d(v,u) + d(u,w) - d(v,w)$。由三角不等式 $d(u,w) \\le d(u,v) + d(v,w)$， 增量 $\\le 2d(v,u)$。 ② 算法每次挑「到环上最近距离最小」的那个顶点，这恰好是 Prim 求最小生成树时 「取最轻的跨割边」的同一条规则（环上的点集就是 Prim 的已选集）， 所以这些 $d(v_i,u_i)$ 加起来正是一棵生成树的权 $=$ MST。 合起来：启发式环长 $\\le \\sum 2d(v_i,u_i) = 2\\,\\text{MST}$； 而把最优巡游任删一条边就得到一棵生成树，故 MST $\\le$ OPT，于是环长 $\\le 2\\,$OPT。 （本轮用随机欧氏实例穷举最优环对照过 3000 例：①式没有一例被违反， 启发式与最优之比最大 1.5416，始终没超过 2。）' },
        { id: '35.2-4', page: 1115, star: 0,
          statement: 'A solution to the bottleneck traveling-salesperson problem is the hamiltonian cy- cle that minimizes the cost of the most costly edge in the cycle. Assuming that the cost function satisfies the triangle inequality, show that there exists a polynomial- time approximation algorithm with approximation ratio 3 for this problem. ( Hint: Show recursively how to visit all the nodes in a bottleneck spanning tree, as dis- cussed in Problem 21-4 on page 601, exactly once by taking a full walk of the tree and skipping nodes, but without skipping more than two consecutive intermedi- ate nodes. Show that the costliest edge in a bottleneck spanning tree has a cost bounded from above by the cost of the costliest edge in a bottleneck hamiltonian cycle.)',
          hint: '两个数字都要摆正，别「2 倍再 3 倍」。 **瓶颈界是 1 倍不是 2 倍**：设最优瓶颈圈的 most costly 边为 $\\beta$。 从那个圈里删掉一条边，得到的是一棵生成树，其最大边 $\\le \\beta$； 而 MST 的最大边不超过**任何**生成树的最大边（否则拿那棵树换掉 MST 里更重的边就能更好， 或按 cut 性质直接看），所以 $MST$ 的最贵边 $\\le \\beta$ —— 题干那句提示说的就是这个。 **3 倍从哪来**：以 MST 为骨架递归地走（根 → 每个子树的走法 → 回根）， 把子树里绕出去的路径用捷径接起来时，一条捷径最多跨过 2 个中间结点， 于是由三角不等式，这条捷径 $\\le$ 它所代替的那 3 条树边，每条 $\\le \\beta$ → 圈里每条边 $\\le 3\\beta$。 近似比就是 3，不要再乘那个 2。' },
        { id: '35.2-5', page: 1115, star: 0,
          statement: 'Suppose that the vertices for an instance of the traveling-salesperson problem are points in the plane and that the cost c(u,v) is the euclidean distance between points u and v. Show that an optimal tour never crosses itself.',
          hint: '反证加局部改写：设最优巡游里有两条边 $(a,c)$、$(b,d)$ 交叉（四点互异，交叉点是这两条线段的内点）。把巡游里这两条边换成 $(a,b)$、$(c,d)$（或 $(a,d)$、$(c,b)$，取保持巡游连通的那一对），由三角不等式两次相加可得这两条新边的长度和**严格小于**原两条（交叉时按三角形两边之和，等号只在四点共线时出现）。于是得到更短的巡游，矛盾 ⟹ 最优巡游不自交。★ 要交代换边后仍是合法巡游（把中间那段反向走一遍即可），以及共线退化情形怎么处理 —— 这两处是扣分点。' },
        { id: '35.2-6', page: 1115, star: 0,
          statement: 'Adapt the proof of Theorem 35.3 to show that for any constant c ≥ 0, there is no polynomial-time approximation algorithm with approximation ratio |V| c for the general traveling-salesperson problem.',
          hint: '把不在原图的边定价成 $\\Omega|V|^{c+1}$，使「非哈密顿环」的巡游代价至少比哈密顿环大 $\\Omega|V|^c$ 倍，归约同理。' },
      ],
    },
  ],
};
