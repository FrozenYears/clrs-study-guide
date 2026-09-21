/* =============================================================================
 * 第 35 章 35.4 —— 第 s04 关：35.4 Randomization and linear programming
 *
 * 原文锚点：印刷页 1119–1123（pdf_index 1140–1144）
 *
 * 「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入并通过溯源判据；
 * 本关补全其余九段。证明块（statement / 三步 en）用注入令牌占位，由工具从
 * corpus3435.txt 逐字填入。C 程序对应 approx_rand.c（part1 随机 MAX-3-CNF、
 * part2 加权顶点覆盖的 LP 舍入）。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's04',
  id: 'ch35/s04',
  chapter: 35,
  section: '35.4',
  title: '随机化与线性规划',
  shortTitle: '35.4 随机化与线性规划',
  titleEn: 'Randomization and linear programming',
  source: { printed: [1119, 1123], pdf: [1140, 1144] },
  sourceNote: '本关对应原书 35.4 节（印刷页 1119–1123）。',
  prerequisites: [
    { label: '35.3 The set-covering problem', url: '#/ch35/s03' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why: '35.1–35.3 用的是「贪心 / 一次构造」的确定性近似。本节换两种更强大的工具：随机化与线性规划。随机赋值让 MAX-3-CNF 拿到期望 8/7-近似（定理 35.5）；把顶点覆盖写成 0-1 整数规划再松弛成线性规划、最后舍入，得到加权顶点覆盖的 2-近似（定理 35.6）。',
      position: '35.4 是整章方法论的升级：从「构造解」走向「先求下界（LP 松弛）再舍入」。它把 35.1 的无权顶点覆盖推广到带权情形，并为 35.5 的 FPTAS（也靠「放宽度量」）埋下伏笔。',
      unlocks: [
        { label: '35.5 The subset-sum problem', url: '#/ch35/s05' },
      ],
      mathKit: [
        { title: '定理 35.5（随机化 8/7-近似）', body: '随机独立赋值使每条子句以 $7/8$ 概率满足，故 $E[Y]=7m/8$，近似比 $\\le 8/7$。' },
        { title: '定理 35.6（LP 舍入 2-近似）', body: '加权顶点覆盖：解 LP 松弛 $x(v)\\in[0,1]$，舍入规则 $x(v)\\ge 1/2\\Rightarrow v\\in C$，得 $w(C)\\le 2\\cdot w(C^*)$。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '抽签与「先估后舍」',
      scene: 'C 程序：part1 MAX-3-CNF（m=20,n=15,T=400000）E/m=0.8749；part2 K3 LP 舍入 w(C)=3=2×1.5',
      body: [
        '★ 随机化场景：一道逻辑题有 20 条「三个文字的」子句，你懒得推理，干脆给每个变量抛硬币决定真假。一条子句只要三个文字里有一个为真就满足；三个全为假的概率只有 $(1/2)^3=1/8$，所以每条子句「命中」概率高达 $7/8$。抛很多次取平均，满足的子句数期望就是 $7m/8$——这已经是一个随机化 8/7-近似。',
        '★★ C 程序 part 1 用固定种子做 40 万次随机试验（m=20,n=15）：期望满足子句占比 E/m = **0.8749**，逼近理论值 7/8=0.8750，断言 E/m ≥ 0.85 通过。',
        '★ 线性规划场景（加权顶点覆盖）：普通「每条边取两端」在带权时可能很糟。改为先给每个顶点一个分数 $x(v)\\in[0,1]$，要求「每条边两端分数和 ≥ 1」（这是原整数规划的下界），再按比例「≥1/2 就入选」舍入成 0/1 解。',
        '★★ C 程序 part 2 用三角形 K3、权重全 1 演示：LP 最优解 $x(v)=0.5$，目标值 1.50；舍入后三顶点全入选，$w(C)=3=2×1.5$——正好卡在 2 倍界上，说明这个界是紧的。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1119,
          en: 'choose c = dln |X|e. Since i = ck is an upper bound on the number of iterations, which equals the size of C , and k = j C − j, we have |C| ≤ i = ck = c jC − j = jC − j dln |X|e, and the theorem follows.',
          zh: '★ 这段其实是 35.3 定理 35.4 证明的收尾（印在 35.4 页首），顺带收口集合覆盖的对数近似比。' },
        { kind: 'body', page: 1119,
          en: 'GREEDY-SET-COVER produces when you break ties in favor of the word that appears first in the dictionary.',
          zh: '★ 仍是 35.3 的题外话：集合覆盖按字典序打破平局时输出确定。' },
        { kind: 'body', page: 1119,
          en: 'This section studies two useful techniques for designing approximation algorithms: randomization and linear programming. It starts with a simple randomized algorithm for an optimization version of 3-CNF satisfiability, and then it shows how to design an approximation algorithm for a weighted version of the vertex-cover problem based on linear programming. This section only scratches the surface of these two powerful techniques. The chapter notes give references for further study of these areas.',
          zh: '★★ 本节主题句：用「随机化」与「线性规划」两件武器；先随机化 MAX-3-CNF，再 LP 解加权顶点覆盖。' },
        { kind: 'body', page: 1120,
          en: 'Just as some randomized algorithms compute exact solutions, some randomized algorithms compute approximate solutions. We say th at a randomized algorithm for a problem has an approximation ratio of Ω(n) if, for any input of size n, the expected cost C of the solution produced by the randomized algorithm is within a factor of Ω(n) of the cost C − of an optimal solution: max ï C',
          zh: '★★ 随机化近似比定义：针对「期望代价」而言，要求 $E[C]\\le ρ(n)\\,C^*$。' },
        { kind: 'body', page: 1120,
          en: 'We call a randomized algorithm that achieves an approximation ratio of Ω(n) a randomized −.n/-approximation algorithm. In other words, a randomized approximation algorithm is like a deterministic approximation algorithm, except that the approximation ratio is for an expected cost.',
          zh: '★ 达到 $ρ(n)$ 近似比的随机算法叫随机化 $ρ(n)$-近似算法；与确定性算法的唯一区别是「比值看期望」。' },
        { kind: 'body', page: 1120,
          en: 'A particular instance of 3-CNF satisfiability, as defined in Section 34.4, may or may not be satisfiable. In order to be satisfiable, there must exist an assignment of the variables so that every clause evaluates to 1. If an instance is not satisfiable, you might instead want to know how "close" to satisfiable it is, that is, find an assignment of the variables that satisfies as many clauses as possible. We call the resulting maximization problem MAX-3-CNF satisfiability. The input to MAX-3-CNF satisfiability is the same as for 3-CNF satisfiability, and the goal is to return an assignment of the variables that maximizes the number of clauses evaluating to 1. You might be surprised that randomly setting each variable to 1 with probability 1/2 and to 0 with probability 1/2 yields a randomized 8/7-approximation algorithm, but we’re about to see why. Recall that the definition of 3-CNF satisfiability from Section 34.4 requires each clause to consist of exactly three distinct literals. We now further assume that no clause contains both a variable and its negation. Exercise 35.4-1 asks you to remove this last assumption.',
          zh: '★★ MAX-3-CNF：最大化被满足的子句数。随机独立赋值（每变量 1/2 概率取真）竟是 8/7-近似——下面证明了原因。' },
      ],
      terms: [
        { en: 'randomized approximation algorithm', zh: '随机化近似算法', page: 1120 },
        { en: 'MAX-3-CNF satisfiability', zh: 'MAX-3-CNF 可满足性', page: 1120 },
        { en: 'linear-programming relaxation', zh: '线性规划松弛', page: 1121 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本站整理：APPROX-MIN-WEIGHT-VC（原书 6 行）',
      algo: 'APPROX-MIN-WEIGHT-VC',
      signature: 'APPROX-MIN-WEIGHT-VC(G, w)',
      page: 1123,
      lines: [
        { n: 1, code: 'C = ∅', zh: '★ 覆盖初始化为空。' },
        { n: 2, code: 'compute x̂, an optimal solution to the linear-programming relaxation (35.15)–(35.18)', zh: '★ 求解 LP 松弛，得到每个顶点 v 的分数解 x̂(v) ∈ [0,1]（下界）。' },
        { n: 3, code: 'for each vertex v ∈ V', zh: '★ 扫描每个顶点。' },
        { n: 4, code: 'if x̂(v) ≥ 1/2', zh: '★★ 分数解 ≥ 1/2 的顶点入覆盖（舍入规则）。' },
        { n: 5, code: 'C = C ∪ {v}', zh: '★ 把 v 加入覆盖。' },
        { n: 6, code: 'return C', zh: '★ 返回构造出的加权覆盖。' },
      ],
      vars: [{ name: 'x̂(v)', meaning: 'LP 松弛分数解；舍入规则 x̂(v) ≥ 1/2 ⇒ v ∈ C，保证每条边被覆盖且 w(C) ≤ 2·目标值' }],
      note: '★ 原书 35.4 伪代码框存在，但语料抽取把 `C = ∅` 抽成 `+ = ;`、`C = C ∪ {v}` 抽成 `+ = C [ fvg`、(35.15)–(35.18) 抽成 `(35.15)3(35.18)`。本段按原书行号重排为可读版本；行号与定理 35.6 证明一一对应。C 程序 part 2 用 K3（权全 1）演示这条流程。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '两个比值：8/7 与 2',
      panels: [
        {
          title: '随机化 MAX-3-CNF：期望满足子句占比 = 7/8',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: '最优满足子句数上界 m', expr: 'n', color: '--viz-done' },
            { name: '期望满足子句数 E[Y] = 7/8·m', expr: '0.875 * n', color: '--viz-compare' },
          ] },
          note: '★ 定理 35.5：随机赋值使每条子句以 7/8 概率满足，故 $E[Y]=7m/8$，近似比 ≤ 8/7。C 程序 part 1（m=20, n=15, T=400000）实测 E/m = 0.8749，断言 ≥ 0.85 通过。',
        },
        {
          title: 'LP 舍入：w(C) ≤ 2·目标值',
          viz: 'growth',
          chart: { xMax: 3, series: [
            { name: 'LP 松弛目标值', expr: 'n', color: '--viz-done' },
            { name: 'w(C) 上界 2·目标值', expr: '2 * n', color: '--viz-compare' },
          ] },
          note: '★ 定理 35.6：舍入后 $w(C)\\le 2\\times$ LP 目标值。C 程序 part 2：K3（权全 1）LP 解 $x(v)=0.5$，目标值 1.50，舍入得 $w(C)=3=2×1.5$，界 2 紧。',
        },
      ],
      tasks: ['把 m 调大，看 E[Y] 曲线是否始终贴着 7/8·m（即比值 8/7 与规模无关）。', '在 LP 面板里把目标值调大，看 w(C) 是否永远 ≤ 它的两倍。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      pseudocodeRef: 'APPROX-MIN-WEIGHT-VC',
      c:{file:'approx_rand.c',code:String.raw`/* approx_rand.c -- 35 章 35.4：随机化与线性规划两个主题。
 * part 1  随机化 MAX-3-CNF（定理 35.5）：固定种子生成 m 条子句的 3-CNF 实例，
 *         随机赋值重复大量试验，打印「满足子句数的期望 / m」，断言比值 ≥ 7/8 − 容差。
 * part 2  LP 舍入（定理 35.6）：三角形图 K3、权重全 1：LP 松弛最优解 x(v)=1/2
 *         （手工给定，断言它满足全部约束 x(u)+x(v)≥1 且目标值 1.5），
 *         舍入（x̂≥1/2 入覆盖）得 C=3 个顶点，断言 w(C)=3=2×1.5（界 2 是紧的实例）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o approx_rand approx_rand.c -lm */
#include <assert.h>
#include <math.h>
#include <stdio.h>

/* xorshift32：线性同余+取模会把洗牌洗歪（低位周期仅 2），这里用 xorshift32，
 * 且主循环每取一个随机位都重新推进状态，避免连续种子的相关性。 */
static unsigned int rs = 0x9e3779b9u;
static unsigned int rnd32(void) {
    rs ^= rs << 13; rs ^= rs >> 17; rs ^= rs << 5;
    return rs;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：随机化 MAX-3-CNF（定理 35.5） ===== */
    {
        const int m = 20;          /* 子句数 */
        const int n = 15;          /* 变量数 */
        /* 固定种子生成 m 条子句：每条 3 个互异变量，且不含变量及其否定同现 */
        int cls[20][3];
        rs = 0x1234abcdU;
        for (int c = 0; c < m; c++) {
            int used[15] = {0};
            for (int k = 0; k < 3; k++) {
                int v;
                do { v = (int)(rnd32() % (unsigned)n); } while (used[v]);
                used[v] = 1;
                cls[c][k] = v;
            }
        }
        const long T = 400000L;     /* 试验次数 */
        long total = 0;
        for (long t = 0; t < T; t++) {
            int asg[15];
            for (int i = 0; i < n; i++) { asg[i] = (int)(rnd32() & 1u); }
            int sat = 0;
            for (int c = 0; c < m; c++) {
                int ok = 0;
                for (int k = 0; k < 3; k++) { if (asg[cls[c][k]] == 1) { ok = 1; break; } }
                if (ok) { sat++; }
            }
            total += sat;
        }
        double exp_per = (double)total / (double)T;     /* 期望满足子句数 */
        double ratio = exp_per / (double)m;              /* 满足子句数的期望 / m */
        printf("part 1: MAX-3-CNF 随机赋值：满足子句数期望 = %.4f（共 %d 条），E/m = %.4f\n",
               exp_per, m, ratio);
        printf("        定理 35.5 预测 E/m = 7/8 = 0.8750；断言 E/m ≥ 0.85 ✓\n");
        assert(ratio >= 0.85 - 1e-9);
        /* 随机化 8/7-近似：最优满足子句数 ≤ m，故近似比 ≤ m / E[Y] ≤ 8/7 */
    }

    /* ===== part 2：LP 舍入（定理 35.6）===== */
    {
        /* 三角形 K3，权重全 1；LP 松弛最优解 x(v) = 1/2（对称，手工给定） */
        const int V = 3;
        const double x[3] = {0.5, 0.5, 0.5};   /* x̂(v) */
        /* 断言：(a) 每条边满足 x(u)+x(v) ≥ 1；(b) 目标值 = Σ w(v)x(v) = 1.5 */
        double obj = 0.0;
        for (int i = 0; i < V; i++) {
            for (int j = i + 1; j < V; j++) {
                assert(x[i] + x[j] >= 1.0 - 1e-9);   /* K3 三条边都满足 */
            }
            obj += 1.0 * x[i];
        }
        printf("part 2: K3 权全 1：LP 松弛最优解 x(v)=0.5，目标值 = %.2f（应 = 3×0.5 = 1.5）\n", obj);
        assert(fabs(obj - 1.5) < 1e-9);
        /* 舍入：x̂(v) ≥ 1/2 的顶点入覆盖 → 三个顶点全入 */
        int cover = 0;
        for (int i = 0; i < V; i++) { if (x[i] >= 0.5) { cover++; } }
        int wC = cover;   /* 权重全 1 */
        printf("        舍入后覆盖 C 含 %d 个顶点，w(C) = %d = 2 × 1.5（界 2 是紧的）✓\n", cover, wC);
        assert(wC == 3 && wC == (int)(2.0 * obj));  /* w(C) = 2 × 1.5 = 3 */
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 25, zh: '★ 子句数 m = 20（第 25 行）。' },
          { line: 26, zh: '★ 变量数 n = 15（第 26 行）。' },
          { line: 29, zh: '★ 固定种子 rs = 0x1234abcdU，保证可复现（第 29 行）。' },
          { line: 39, zh: '★ 试验次数 T = 400000（第 39 行）。' },
          { line: 54, zh: '★ 打印期望满足子句数 E[Y] 与 E/m（第 54 行）。' },
          { line: 57, zh: '★ 断言 E/m ≥ 0.85（定理 35.5 的 7/8=0.875 容差内，第 57 行）。' },
          { line: 65, zh: '★★ 第 2 行 `compute x̂`：手工给定 LP 最优解 x(v)=0.5（第 65 行）。' },
          { line: 70, zh: '★ 第 4 行 `if x̂(v) ≥ 1/2`：断言每条边满足 x(u)+x(v) ≥ 1（第 70 行）。' },
          { line: 74, zh: '★ 打印 LP 目标值 = 1.50（第 74 行）。' },
          { line: 78, zh: '★★ 第 3、5 行 `for` / `C = C ∪ {v}`：舍入 cover++（第 78 行）。' },
          { line: 81, zh: '★ 第 6 行 `return C`：断言 w(C)=3=2×1.5（第 81 行）。' },
        ],
        tests: [
          { in: 'C 程序 part 1：m=20, n=15, T=400000', out: 'E/m = 0.8749 ≥ 0.85，断言通过' },
          { in: 'C 程序 part 2：K3 权全 1，x(v)=0.5', out: '目标值 1.50，w(C)=3=2×1.5' },
        ],
        mapping: [
          { pc: 1, pcCode: 'C = ∅', c: '`int cover = 0;`（第 77 行）' },
          { pc: 2, pcCode: 'compute x̂, an optimal solution to the LP relaxation (35.15)–(35.18)', c: '`const double x[3] = {0.5, 0.5, 0.5};`（第 65 行，手工给定 LP 最优解）' },
          { pc: 3, pcCode: 'for each vertex v ∈ V', c: '`for (int i = 0; i < V; i++)`（第 68、78 行）' },
          { pc: 4, pcCode: 'if x̂(v) ≥ 1/2', c: '`if (x[i] >= 0.5)`（第 78 行）' },
          { pc: 5, pcCode: 'C = C ∪ {v}', c: '`cover++;`（第 78 行）' },
          { pc: 6, pcCode: 'return C', c: '`wC = cover;`（第 79 行，返回 w(C)）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：8/7 与 2 从哪来',
      intro: '这一关要回答两件事：随机赋值为什么给 8/7 近似（期望视角），以及 LP 舍入为什么给 2-近似（最坏视角，且紧）。',
      claims: [
        { expr: 'E[Y_i] = 7/8', when: '三个文字独立，全为 0 才不满足，概率 (1/2)^3 = 1/8', page: 1121, source: 'book' },
        { expr: '近似比 ≤ 8/7', when: '最多 m 条可满足，E[Y] = 7m/8', page: 1121, source: 'book' },
        { expr: 'w(C) ≤ 2·w(C*)', when: 'x̂(v) ≥ 1/2 入覆盖，每条边两端至少一端入选', page: 1123, source: 'book' },
        { expr: 'O(V + E + LP)', when: 'APPROX-MIN-WEIGHT-VC 运行时间（LP 可多项式解）', page: 1123, source: 'book' },
        { expr: 'O(T·m·n)', when: 'part 1 随机试验 T=400000 次', page: 1120, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 approx_rand.c 实测', rows: [
          ['指标', '数值'],
          ['part 1 期望满足子句占比 E/m', '0.8749'],
          ['定理 35.5 预测', '7/8 = 0.8750'],
          ['part 2 LP 目标值', '1.50'],
          ['part 2 w(C)', '3 = 2 × 1.5'],
        ] },
      ],
      chart: { xMax: 20, series: [
        { name: '7/8·m', expr: '0.875 * n', color: '--viz-compare' },
        { name: 'm（上界）', expr: 'n', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'line', title: '定理 35.5 的期望推导', steps: [
          { tex: 'E[Y_i] = 1 - (1/2)^3 = 7/8', zh: '★ 三个文字独立，全为 0 才不满足，概率 1/8。' },
          { tex: 'E[Y] = \\sum_{i=1}^{m} E[Y_i] = 7m/8', zh: '★ 由期望线性性。' },
          { tex: 'approx\\_ratio \\le m / (7m/8) = 8/7', zh: '★★ 最优最多满足 m 条，故近似比 ≤ 8/7。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: 'Given an instance of MAX-3-CNF satisfiability with n variables x 1 ,x 2 ,…,x n and m clauses, the randomized algorithm that independently sets each variable to 1 with probability 1/2 and to 0 with probability 1/2 is a randomized 8/7-approximation algorithm.',
      page: 1120,
      intro: '三步对应定理 35.5 证明：① 设定指示变量（可分析性）；② 单条子句满足概率 7/8（核心）；③ 近似比 ≤ 8/7（结论）。',
      steps: [
        {
          title: '第一步 · 设定指示变量（Init）',
          en: 'Proof Suppose that each variable is independently set to 1 with probability 1/2 and to 0 with probability 1/2. Define, for i = 1,2,…,m , the indicator random variable',
          page: 1120,
          body: ['★ 为每个子句 $i$ 定义指示变量 $Y_i=I\\{\\text{子句 }i\\text{ 被满足}\\}$。只要求出每个 $Y_i$ 的期望，再用期望线性性求和即可。'],
        },
        {
          title: '第二步 · 单条子句满足概率 7/8（Maint）',
          en: 'Thus, we have Pr fclause i is satisfiedg = 1 − 1/8 = 7/8, and Lemma 5.1 on page 130 gives E [Y i ] = 7/8. Let Y be the number of satisfied clauses overall, so that Y = Y 1 + Y 2 + • • • + Y m . Then, we have',
          page: 1121,
          body: ['★★ 因无文字重复、且无变量与其否定同现，三个文字赋值独立。一条子句仅当三文字全为 0 才不满足，概率 $(1/2)^3=1/8$，故满足概率 $7/8$，由引理 5.1 得 $E[Y_i]=7/8$。令 $Y$ 为总满足子句数，$Y=Y_1+\\cdots+Y_m$。'],
        },
        {
          title: '第三步 · 近似比 ≤ 8/7（Term）',
          en: 'Since m is an upper bound on the number of satisfied clauses, the approximation ratio is at most m=.7m/8/ = 8/7.',
          page: 1121,
          body: ['★★ 因最多 $m$ 条可满足，近似比至多为 $m/(7m/8)=8/7$。C 程序 part 1 实测 $E/m=0.8749$ 印证了这一期望。∎'],
        },
      ],
      conclusion: '★ 结论：随机独立赋值是一个随机化 8/7-近似算法（定理 35.5）；它针对「期望满足子句数」，不保证单次运行一定好，但大量独立重复取平均即可逼近。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '随机化 MAX-3-CNF 的近似比（期望意义）是？', options: ['1', '**8/7**', '2', 'lg n'], answer: 1,
          why: '★ 定理 35.5：随机赋值使 $E[Y]=7m/8$，近似比 ≤ 8/7。' },
        { kind: 'judge', q: '一条子句被满足的概率（独立随机赋值）是 7/8。', answer: true,
          why: '★ 三文字独立，仅全 0 才不满足，概率 1/8，故满足 7/8。' },
        { kind: 'judge', q: '随机化近似算法的「近似比」针对的是解的期望代价，而不是单次运行。', answer: true,
          why: '★ 原书定义：比值针对 $E[C]$ 与 $C^*$ 之比。' },
        { kind: 'single', q: '为什么 E[Y_i] = 7/8 而不是别的数？', options: ['因为子句满足的概率等于 1 减去全 0 的概率；全 0 的概率是 $1/2$', '**三文字独立、全 0 概率 1/8，故满足 7/8**', '随机均匀', '1/2'], answer: 1,
          why: '★ $(1/2)^3=1/8$ 为不满足概率。' },
        { kind: 'simulate', q: 'C 程序 part 1（m=20, n=15, T=400000）报告 E/m 是多少？断言下限是多少？', expect: ['0.8749', '0.85'], placeholder: '例如：0.8749，0.85',
          why: '满足子句数期望 = 17.4983，E/m = 0.8749 ≥ 0.85 通过。' },
        { kind: 'judge', q: '35.4 的 LP 舍入（加权顶点覆盖）近似比是 2，且对 K3 取到紧界。', answer: true,
          why: '★ C 程序 part 2：K3 权全 1，LP 解 0.5，舍入后 w(C)=3=2×1.5。' },
        { kind: 'single', q: '本节引入的两大近似技术是？', options: ['分治与动态规划，也就是本书前面章节的两大技术', '**随机化与线性规划**', '贪心与回溯', '哈希与并查集'], answer: 1,
          why: '★ 原书主题句：randomization and linear programming。' },
      ],
      bookExercises: [
        { id: '35.4-1', page: 1124, star: 0,
          statement: 'Show that even if a clause is allowed to contain bo th a variable and its negation, randomly setting each variable to 1 with probability 1/2 and to 0 with probability 1/2 still yields a randomized 8/7-approximation algorithm.',
          hint: '要证的只有一件事：一条子句**不被满足**的概率 $\\le 1/8$。子句里有 3 个文字时，若三个文字涉及的变量互不相同，唯一让它为 0 的那一种取值概率就是 $1/8$；有变量重复出现（比如两次 $x$）时约束更紧，不满足的概率只会更小。★ 关键是题干放宽的那一条：子句里同时含 $x$ 与 $\\neg x$ 时，这条子句**恒为真**，不满足的概率是 0 —— 也仍然 $\\le 1/8$。所以期望满足数 $\\ge \\frac78 m \\ge \\frac78 \\text{OPT}$，$8/7$ 近似照旧成立，推导一个字都不用改。' },
        { id: '35.4-2', page: 1124, star: 0,
          statement: 'The MAX-CNF satisfiability problem is like the MAX-3-CNF satisfiability problem, except that it does not restrict each clause to have exactly three literals. Give a randomized 2-approximation algorithm for the MAX-CNF satisfiability problem.',
          hint: '还是随机赋值，只是每条子句被满足的概率变高了：含 $k$ 个文字的子句要全为 0 才不被满足，概率 $\\le (1/2)^k \\le 1/2$（$k \\ge 1$）。令 $X_j$ = 第 $j$ 条子句被满足的指示器，$E[X_j] \\ge 1/2$，于是满足数的期望 $\\ge m/2 \\ge \\text{OPT}/2$（$\\text{OPT} \\le m$）。算法：独立抛硬币赋值，然后把为真的子句数报出来即可（要**输出**赋值就取随机那次）。★ 与 35.4-1 的区别只在 $1/8 \\to 1/2$，所以 $8/7 \\to 2$；顺手说明为什么不能对「子句长短不一」再抠出更好的界。' },
        { id: '35.4-3', page: 1124, star: 0,
          statement: 'In the MAX-CUT problem, the input is an unweighted undirected graph G = (V,E). We define a cut (S,V − S) as in Chapter 21 and the weight of a cut as the number of edges crossing the cut. The goal is to find a cut of maximum weight. Suppose that each vertex v is randomly and independently placed into S with probability 1/2 and into V − S with probability 1/2. Show that this algorithm is a randomized 2-approximation algorithm.',
          hint: '随机把每个顶点独立以 1/2 概率放入 S；每条边以 1/2 概率成为割边，期望割边数 = |E|/2，而最大割 ≥ |E|/2，故是 2-近似。' },
        { id: '35.4-4', page: 1124, star: 0,
          statement: 'Show that the constraints in line (35.17) are redundant in the sense that remov- ing them from the linear-programming relaxation in lines (35.15)3(35.18) yields a linear program for which any optimal solution x must satisfy x(v) ≤ 1 for each v 2 V .',
          hint: '整根缩放在这里**会破坏约束**：边约束是 $x(u) + x(v) \\ge 1$（式 35.16）， 所有分量同时乘以 $\\beta < 1$ 会让某条本来刚好 $1.1 + 1.1$ 的边变成 $0.11 + 0.11 < 1$，不再可行。 正确做法是**逐个削**：把任何 $x(v) > 1$ 的分量单独下调到 1。 边约束仍成立（另一端 $x(u) \\ge 0$，于是 $1 + x(u) \\ge 1$）， 而目标函数系数全为正，改小的那个分量只会让总值变小 —— 于是可以假定 $0 \\le x(v) \\le 1$。' },
      ],
    },
  ],
};
