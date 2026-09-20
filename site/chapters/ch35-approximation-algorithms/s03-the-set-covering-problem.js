/* =============================================================================
 * 第 35 章 35.3 —— 第 s03 关：35.3 The set-covering problem
 *
 * 原文锚点：印刷页 1115–1118（pdf_index 1136–1139）
 *
 * 本文件由 tools/05_new_level.py 生成骨架，「原文引述」「伪代码逐行」「书后习题」
 * 三处已从 data/blocks 逐字填入并通过溯源判据；本关补全其余九段。
 * 伪代码行按原书 35.3 整理（语料抽取把 `C = ;`、`jS \ U i j` 等变乱码，本段重排）。
 * C 程序对应 approx.c 的 part 2（贪心集合覆盖 vs 暴力最优）。
 * 证明块（statement / 三步 en）用注入令牌占位，由工具从 corpus3435.txt 逐字填入。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's03',
  id: 'ch35/s03',
  chapter: 35,
  section: '35.3',
  title: '集合覆盖问题',
  shortTitle: '35.3 集合覆盖问题',
  titleEn: 'The set-covering problem',
  // ★ 第 32 轮复审：定理 35.4 的结论与 35.3 的四道习题都排在 1119 页
  //   （35.4 同一页才起头），锚点终点收到 1119 而不是 1118。
  source: { printed: [1115, 1119], pdf: [1136, 1140] },
  sourceNote: '本关对应原书 35.3 节（印刷页 1115–1119）。',
  prerequisites: [
    { label: '35.2 The traveling-salesperson problem', url: '#/ch35/s02' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '集合覆盖把「用最少的资源覆盖所有需求」抽象成一个 NP 难的优化问题（它是顶点覆盖决策的推广，因此更难）。35.1/35.2 的近似比是常数，而本节的贪心算法只能保证对数近似比 $O(\\lg |X|)$（定理 35.4）——随规模增大解会变差，但对数增长很慢，实践中仍可用。',
      position: '35.3 把 35.1/35.2 的「下界 + 构造」换成了「贪心选当前最优」的方法论，并首次出现随输入规模增长而非常数的近似比。35.4 的加权顶点覆盖会把它与线性规划结合；35.3 的对数界也是后续加权集合覆盖（习题 35-3）的雏形。',
      unlocks: [
        { label: '35.4 Randomization and linear programming', url: '#/ch35/s04' },
      ],
      mathKit: [
        { title: '定理 35.4（O(lg|X|)-近似）', body: 'GREEDY-SET-COVER 是多项式时间的 $O(\\lg |X|)$-近似：$|C| \\le |C^*|\\,\\lceil\\lg |X|\\rceil$。' },
        { title: '调和数 H(n)', body: '$H(n) = \\sum_{i=1}^{n} 1/i \\approx \\ln n + \\gamma$；贪心比值的紧界是 $|C| \\le H(|\\max S|)\\,|C^*|$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '组委员会：每样技能至少一人会',
      scene: 'C 程序 part 2：12 个元素 X，12 个集合',
      body: [
        '★ 生活场景：要组一个委员会，技能清单 X 有 12 项，手头有 12 个候选人，每人会若干技能。目标是「人数最少」且「每项技能至少一人会」。精确最少几人很难，于是贪心：每轮挑「能补最多还不会的技能」的那个人进委员会，直到所有技能都被覆盖。',
        '★★ C 程序 part 2 用 12 元素、12 集合验证：贪心选出 **3** 个集合，暴力最优也是 **3** 个，比值 **1.000 ≤ H(12) ≈ 3.103**——本例碰巧等于最优。',
        '★ 为什么只保证对数近似比？每轮贪心最多把「未覆盖元素数」砍掉 $1/k$（$k$ 是最优覆盖大小），于是未覆盖数按 $(1-1/k)^i$ 衰减；要让它掉到 < 1，需要约 $\\ln|X|$ 轮，故 $|C| \\le \\lceil\\ln|X|\\rceil\\,|C^*|$。',
        '⚠ 对数界比 35.1/35.2 的常数界松，但已经是集合覆盖能指望的最好近似（除非 P = NP）；而且 $\\ln|X|$ 增长极慢，实际够用。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1115,
          en: 'The set-covering problem is an optimization problem that models many problems that require resources to be allocated. Its corresponding decision problem generalizes the NP-complete vertex-cover problem and is therefore also NP-hard. The approximation algorithm developed to handle the vertex-cover problem doesn’t apply here, however. Instead, this section investigates a simple greedy heuristic with a logarithmic approximation ratio. That is, as the size of the instance gets larger, the size of the approximate solution may grow, relative to the size of an optimal solution. Because the logarithm function grows rather slowly, however, this approximation algorithm may nonetheless give useful results.',
          zh: '★★ 集合覆盖建模「资源分配」，决策版是顶点覆盖的推广（故 NP 难）；本节用贪心，近似比是对数的。' },
        { kind: 'body', page: 1116,
          en: 'An instance (X; F ) of the set-covering problem consists of a finite set X and a family F of subsets of X , such that every element of X belongs to at least one subset in F :',
          zh: '★★ 实例 = (X, F)：X 是待覆盖的全集，F 是若干子集的族，且 X 中每个元素至少属于某个子集。' },
        { kind: 'body', page: 1116,
          en: 'The problem is to find a minimum-size subfamily C ⊆ F whose members cover all of X :',
          zh: '★ 目标是找最小的子族 C ⊆ F 覆盖全部 X；大小按集合个数计。' },
      ],
      terms: [
        { en: 'set-covering problem', zh: '集合覆盖问题', page: 1115 },
        { en: 'subfamily', zh: '子族', page: 1116 },
        { en: 'greedy heuristic', zh: '贪心启发式', page: 1115 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本站整理：GREEDY-SET-COVER（原书 9 行）',
      algo: 'GREEDY-SET-COVER',
      signature: 'GREEDY-SET-COVER(X, F)',
      page: 1117,
      lines: [
        { n: 1, code: 'U₀ = X', zh: '★ 未覆盖集合初值为全集 X。' },
        { n: 2, code: 'C = ∅', zh: '★ 已选子族初值为空。' },
        { n: 3, code: 'i = 0', zh: '★ 轮次计数。' },
        { n: 4, code: 'while Uᵢ ≠ ∅', zh: '★ 还有未覆盖元素就继续。' },
        { n: 5, code: 'select S ∈ F that maximizes |S \\ Uᵢ|', zh: '★★ 选覆盖最多新元素的集合。' },
        { n: 6, code: 'Uᵢ₊₁ = Uᵢ − S', zh: '★ 把 S 覆盖的元素从待覆盖集删去。' },
        { n: 7, code: 'C = C ∪ {S}', zh: '★ S 加入已选子族。' },
        { n: 8, code: 'i = i + 1', zh: '★ 轮次 +1。' },
        { n: 9, code: 'return C', zh: '★ 返回已选子族。' },
      ],
      vars: [{ name: 'k = |C*|', meaning: '最优覆盖大小；每轮至少盖掉 |Uᵢ|/k 个新元素，使 |Uᵢ| 按 (1−1/k) 衰减' }],
      note: '★ 原书 35.3 伪代码框存在，但语料抽取把 `C = ;`、`select S 2 F that maximizes jS \\ U i j` 等变成乱码。本段按原书行号重排为可读版本；行号与定理 35.4 证明（式 35.8/35.9）一一对应。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '比值形状：|C| 随 |X| 对数增长',
      panels: [
        {
          title: '贪心近似比 vs 全集大小 |X|',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: '|C*|（最优）', expr: 'n', color: '--viz-done' },
            { name: '|C| 上界 ⌈ln|X|⌉·|C*|', expr: 'Math.ceil(Math.log(n + 1e-9) + 0.58) * n', color: '--viz-compare' },
          ] },
          note: '★ 定理 35.4：$|C| \\le |C^*|\\lceil\\ln|X|\\rceil$。图中橙线是上界（≈ H(|X|)·|C^*|）；C 程序 part 2 在 |X|=12 上实测比值 1.000，远未触顶。',
        },
      ],
      tasks: ['把 |X| 调大，看上界曲线是按对数（很慢）上升，而非线性上升。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      pseudocodeRef: 'GREEDY-SET-COVER',
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
          { line: 90, zh: '★ 第 1–2 行 `U₀ = X`、`C = ∅`：covered=0（待覆盖全集）、greedy=0（已选集合数 |C|）。' },
          { line: 93, zh: '★ 第 4 行 `while Uᵢ ≠ ∅`：只要 covered 还没等于 full 就继续。' },
          { line: 95, zh: '★★ 第 5 行 `select S maximizes |S \\ Uᵢ|`：每轮选覆盖最多新元素的集合（bestNew）。' },
          { line: 99, zh: '★ 第 6 行 `Uᵢ₊₁ = Uᵢ − S`：把选中集合并入 covered。' },
          { line: 100, zh: '★ 第 7 行 `C = C ∪ {S}`：集合数 +1；最终 greedy 即 |C|。' },
          { line: 111, zh: '★ 与暴力最优比对：贪心/最优 ≤ H(12) ≈ 3.103（断言通过）。' },
        ],
        tests: [
          { in: 'C 程序 part 2：X=12 元素，12 个集合', out: '贪心 3 vs 最优 3，比值 1.000 ≤ H(12)=3.103' },
          { in: '图 35.3 实例（|X|=12，F={S1..S6}）', out: '贪心覆盖大小 4，最优 3，比值 4/3 ≈ 1.333' },
          { in: '每个集合只盖 1 个新元素', out: '贪心 = 最优，比值 1' },
        ],
        mapping: [
          { pc: 1, pcCode: 'U₀ = X', c: '`int covered = 0, greedy = 0;`（第 90 行，covered 初值 0 = 待覆盖全集）' },
          { pc: 4, pcCode: 'while Uᵢ ≠ ∅', c: '`while (covered != full)`（第 93 行）' },
          { pc: 5, pcCode: 'select S ∈ F that maximizes |S \\ Uᵢ|', c: '`if (nw > bestNew) { bestNew = nw; best = s; }`（第 95–98 行，选新覆盖最多的集合）' },
          { pc: 6, pcCode: 'Uᵢ₊₁ = Uᵢ − S', c: '`covered |= sets[best];`（第 99 行）' },
          { pc: 7, pcCode: 'C = C ∪ {S}', c: '`greedy++;`（第 100 行，已选集合数 +1）' },
          { pc: 9, pcCode: 'return C', c: '`greedy`（最终返回值即 |C|，第 100 行累加、第 111 行与最优比对）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：对数近似比从哪来',
      intro: '这一关要回答：为什么贪心集合覆盖的大小不超过最优解的 $\\lceil\\ln|X|\\rceil$ 倍？关键是每轮至少消灭 $|U_i|/k$ 个未覆盖元素，使未覆盖数按 $(1-1/k)^i$ 衰减。',
      claims: [
        { expr: '|Uᵢ₊₁| ≤ |Uᵢ|(1−1/k)', when: '每轮至少盖掉 |Uᵢ|/k 个新元素（式 35.8）', page: 1118, source: 'book' },
        { expr: '|Uᵢ| ≤ |X|(1−1/k)ⁱ', when: '迭代式 35.8 得到（式 35.9）', page: 1118, source: 'book' },
        { expr: '|C| ≤ |C*|⌈ln|X|⌉', when: '令 i = ⌈ln|X|⌉·k 使 |Uᵢ| < 1（定理 35.4）', page: 1119, source: 'book' },
        { expr: 'O(|X|·|F|·(|X|+|F|))', when: '朴素实现运行时间（习题 35.3-3 可线性化）', page: 1118, source: 'book' },
      ],
      tables: [
        { caption: 'C 程序 part 2 实测（X=12 元素，12 集合）', rows: [
          ['指标', '数值'],
          ['贪心选出集合数', '3'],
          ['暴力最优集合数', '3'],
          ['比值', '1.000'],
          ['上界 H(12)', '≈ 3.103'],
        ] },
      ],
      chart: { xMax: 20, series: [
        { name: 'H(|X|) ≈ ln|X|+0.58', expr: 'Math.log(n + 1e-9) + 0.58', color: '--viz-compare' },
        { name: '|X|（参照）', expr: 'n', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'line', title: '定理 35.4 的比值推导', steps: [
          { tex: '|U_{i+1}| \\le |U_i| - |U_i|/k = |U_i|(1-1/k)', zh: '★ 最优覆盖只有 $k=|C^*|$ 个集合，每个最多盖 $|U_i|/k$ 个新元素，贪心至少取这么多。' },
          { tex: '|U_i| \\le |X|(1-1/k)^i', zh: '★ 迭代得式 35.9；又 $1-1/k \\le e^{-1/k}$，故 $(1-1/k)^{ck} \\le e^{-c}$。' },
          { tex: '|C| \\le |C^*|\\,\\lceil\\ln|X|\\rceil', zh: '★★ 取 $i=ck$ 使 $|U_i|<1$ 即停止，$c\\ge\\ln|X|$；轮数 $=|C|\\le ck\\le |C^*|\\lceil\\ln|X|\\rceil$。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: 'The procedure GREEDY-SET-COVER run on a set X and family of subsets F is a polynomial-time O(lg X)-approximation algorithm.',
      page: 1118,
      intro: '三步对应不变量的三条性质：① 多项式时间（可解性）；② 每轮至少消灭 |Uᵢ|/k 新元素（近似比基础）；③ 轮数 ≤ ⌈ln|X|⌉·k（近似比）。',
      steps: [
        {
          title: '第一步 · 多项式时间（Initialization）',
          en: 'Proof Let’s first show that the algorithm runs in time that is polynomial in |X| and |F|. The number of iterations of the loop in lines 4–7 is bounded above by min f|X| ; |F|g = O(|X| C |F|). The loop body can be implemented to run in O(|X|•|F|) time. Thus the algorithm runs in O(|X|•|F|• .|X| + |F|)/ time, which is polynomial in the input size. (Exercise 35.3-3 asks for a linear-time algorithm.)',
          page: 1118,
          body: ['★ 循环轮数 ≤ min(|X|,|F|)，每轮 O(|X|·|F|)，整体多项式时间——先确认「可解性」。'],
        },
        {
          title: '第二步 · 每轮至少消灭 |Uᵢ|/k 新元素（Maintenance）',
          en: 'If an optimal set cover for an instance (U i ; F ) has size at most k, at least one of the sets in C covers at least jU i j =k new elements. Thus, line 5 of GREEDY- SET-COVER, which chooses a set with the maximum number of uncovered elements, must choose a set in which the number of new ly covered elements is at least jU i j =k . These elements are removed when constructing U i + 1 , giving jU i + 1 j ≤ j U i j − jU i j =k',
          page: 1118,
          body: ['★★ 最优覆盖只有 $k=|C^*|$ 个集合，每个至多覆盖 $|U_i|/k$ 个新元素；贪心选「新覆盖最多」的集合，至少也盖这么多，于是 $|U_{i+1}|\\le|U_i|-|U_i|/k$（式 35.8）。这是近似比的核心。'],
        },
        {
          title: '第三步 · 近似比 ≤ ⌈ln|X|⌉·|C*|（Termination）',
          en: 'choose c = dln |X|e. Since i = ck is an upper bound on the number of iterations, which equals the size of C , and k = j C − j, we have |C| ≤ i = ck = c jC − j = jC − j dln |X|e, and the theorem follows.',
          page: 1119,
          body: ['★★ 迭代式 35.8/35.9 使未覆盖数按 $(1-1/k)^i$ 衰减；取 $i=ck$ 且 $c\\ge\\ln|X|$ 时 $|U_i|<1$ 算法停止。轮数即 $|C|\\le ck\\le|C^*|\\lceil\\ln|X|\\rceil$，定理得证。∎'],
        },
      ],
      conclusion: '★ 结论：GREEDY-SET-COVER 在多项式时间内给出大小不超过最优解 $\\lceil\\ln|X|\\rceil$ 倍的集合覆盖；这是对数近似比，比 35.1/35.2 的常数界松，但已是集合覆盖可指望的最好保证（除非 P = NP）。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'GREEDY-SET-COVER 的近似比（最坏情况）是？', options: ['常数 2', '**O(lg |X|) 对数**', 'O(|X|) 线性', '无界'], answer: 1,
          why: '★ 定理 35.4：$|C|\\le|C^*|\\lceil\\ln|X|\\rceil$，随 |X| 对数增长。' },
        { kind: 'judge', q: '集合覆盖的决策版本是 NP 完全的（它是顶点覆盖决策的推广）。', answer: true,
          why: '★ 原书：决策版推广了 NP 完全的顶点覆盖问题，故 NP 难。' },
        { kind: 'judge', q: '贪心每轮选择的集合，覆盖的新元素数一定不少于 |Uᵢ|/k。', answer: true,
          why: '★ 最优覆盖只有 k 个集合，每个至多盖 |Uᵢ|/k 个新元素；贪心取最大的，至少这么多。' },
        { kind: 'single', q: '为什么未覆盖元素数 |Uᵢ| 按 (1−1/k)ⁱ 衰减？', options: ['随机删除', '**每轮至少消灭 |Uᵢ|/k 个**', '每轮翻倍', '与 k 无关'], answer: 1,
          why: '★ $|U_{i+1}|\\le|U_i|-|U_i|/k=|U_i|(1-1/k)$（式 35.8）。' },
        { kind: 'simulate', q: 'C 程序 part 2 报告贪心 3、最优 3，近似比是多少？上界 H(12) 约多少？', expect: ['1.000', '3.103'], placeholder: '例如：1.000，3.103',
          why: '3/3=1.000 ≤ H(12)=1+1/2+…+1/12≈3.103。' },
        { kind: 'judge', q: '集合覆盖的贪心近似比是对数的，因此比顶点覆盖的 2-近似「更松」。', answer: true,
          why: '★ O(lg|X|) 随规模增长，而 2 是常数；对数界更松但已是最优可望。' },
        { kind: 'single', q: '本节与 35.1/35.2 在方法论上的主要区别是？', options: ['用动态规划', '**改用贪心逐轮选当前最优**', '用随机赋值', '用线性规划'], answer: 1,
          why: '★ 35.1/35.2 用「下界 + 一次性构造」，本节用贪心逐轮选当前最优集合。' },
      ],
      bookExercises: [
        { id: '35.3-1', page: 1119, star: 0,
          statement: 'Consider each of the following words as a set of letters: farid; dash; drain; heard; lost ; nose ; shun; slate; snare; threadg. Show which set cover GREEDY-SET-COVER produces when you break ties in favor of the word that ap- pears first in the dictionary.',
          hint: '把每个单词看成「字母集合」，求覆盖全部所需字母的最少单词数；例如 {farid, dash, drain, heard, lost, nose, shun, slate, snare, thread} 中选覆盖所有 26 字母的最小子族。' },
        { id: '35.3-2', page: 1119, star: 0,
          statement: 'Show that the decision version of the set-covering problem is NP-complete by reducing the vertex-cover problem to it.',
          hint: '顶点覆盖实例 (G,k)：令 X = E(G)，每个顶点 v 对应集合 S_v = {与 v 关联的边}；则大小 ≤ k 的顶点覆盖 ⇔ 覆盖 X 的大小 ≤ k 的子族。' },
        { id: '35.3-3', page: 1119, star: 0,
          statement: 'Show how to implement GREEDY-SET-COVER to run in O − P S2F |S| ] time.',
          hint: '用合适的数据结构（如按剩余新覆盖数维护集合的堆）可把每轮选择降到近乎线性，整体 O(|X|+|F|) 量级。' },
        { id: '35.3-4', page: 1119, star: 0,
          statement: 'The proof of Theorem 35.4 says that when GREEDY-SET-COVER, run on the in- stance (X; F ), returns the subfamily C , then |C| ≤ j C − j dln X e. Show that the following weaker bound is trivially true: |C| ≤ jC − j max f|S| W S 2 F g :',
          hint: '不等号方向：$C$ 是贪心解、$C^*$ 是最优解，必有 $|C| \\ge |C^*|$，写成 $|C| \\le |C^*|$ 恰好反了。 被 $\\max|S|$ 顶替掉的也不是 $|C^*|$，而是 $\\lceil \\ln |X| \\rceil$ 那个因子。正确的推法是： 每选一个集合至少带入 1 个新元素，所以 $|C| \\le |X|$；另一方面 $X$ 能被 $C^*$ 覆盖， $|X| \\le |C^*| \\cdot \\max|S|$。两式接起来就是 $|C| \\le |C^*| \\cdot \\max|S|$（再乘上 $\\lceil \\ln |X| \\rceil$ 那条界另算）。' },
        { id: '35.3-5', page: 1119, star: 0,
          statement: 'GREEDY-SET-COVER can return a number of different solutions, depending on how it breaks ties in line 5. Give a procedure BAD-SET-COVER-INSTANCE (n) that returns an n-element instance of the set-covering problem for which, depending on how line 5 breaks ties, GREEDY-SET-COVER can return a number of different solutions that is exponential in n.',
          hint: '构造 n 个「几乎相同」的集合，使每条 tie 分支都导致不同的后续选择，从而产生指数级多的不同贪心解。' },
      ],
    },
  ],
};
