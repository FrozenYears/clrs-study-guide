/* =============================================================================
 * 第 34 章 34.3 —— 第 s03 关：34.3 NP-completeness and reducibility
 *
 * 原文锚点：印刷页 1061–1071（pdf_index 1082–1092）
 *
 * 引述已逐字保留（未改写）；其余段已人工填写完毕。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's03',
  id: 'ch34/s03',
  chapter: 34,
  section: '34.3',
  title: 'NP 完全性与可归约性',
  shortTitle: '34.3 NP 完全性与可归约性',
  titleEn: 'NP-completeness and reducibility',
  source: { printed: [1061, 1071], pdf: [1082, 1092] },
  sourceNote: '本关对应原书 34.3 节（印刷页 1061–1071）。',
  prerequisites: [
    { label: '34.2 Polynomial-time verification', url: '#/ch34/s02' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '归约：比较问题「难度」的尺子',
      why: '★★ 这一关引入「多项式时间可归约」$L_1 \\le_P L_2$，并用它定义 NP 完全性：若某 NP 完全问题能在多项式时间解决，则 NP 中一切问题都能。',
      position: '34.3 承接 34.2 的 NP，给出归约与 NPC 的正式定义；为 34.4（用归约证明 NP 完全）与 34.5（具体归约实例）奠基。C 程序 part4 把「3-SAT → CLIQUE」这条归约真实跑通。',
      unlocks: [
        { label: '34.4 NP-completeness proofs', url: '#/ch34/s04' },
      ],
      mathKit: [
        {title:'多项式时间归约', body:'$L_1 \\le_P L_2$：存在多项式时间可算函数 $f$ 使 $x\\in L_1 \\iff f(x)\\in L_2$。归约把 $L_1$ 的实例「翻译」成 $L_2$ 的实例。'},
        {title:'NP 完全定义', body:'语言 $L$ 是 NP 完全当且仅当：(1) $L\\in\\text{NP}$；(2) 对所有 $L^\\prime\\in\\text{NP}$ 有 $L^\\prime\\le_P L$。仅满足 (2) 则称 $L$ 是 NP-hard。'},
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '把线性方程「归约」成二次方程',
      scene: '你只会解二次方程，却碰到一个一次方程 $ax + b = 0$。',
      body: [
        '★ 原书给的例子：把一次方程 $ax + b = 0$（解 $x = -b/a$）改写成二次 $ax^2 + bx + 0 = 0$。二次方程公式能直接给出解，于是「解一次」被「归约」成了「解二次」——你没真正为一次方程写新算法，而是把它翻译成了你会的问题。',
        '★★ C 程序 part4 跑的是同一思路的硬核版：把 3-CNF 公式归约成图。可满足公式 $(v_1\\lor\\neg v_2\\lor v_3)\\land(\\neg v_1\\lor v_2\\lor\\neg v_3)\\land(v_2\\lor v_3\\lor\\neg v_1)$ 归约出的图，最大团恰好是 **3**（= 子句数）；而故意锁死的不可满足公式 $(v_1)\\land(\\neg v_1)$ 归约出的图最大团只有 **1**（< 2）。归约把「公式可满足」翻译成了「图有大小为 k 的团」。',
        '★★ 归约的威力：只要翻译是多项式时间，且「yes/no」答案保持，那么破解目标问题（CLIQUE）就等价于破解源问题（3-SAT）。这正是 34.4/34.5 证明 NP 完全的方法论。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1061,
          en: 'Perhaps the most compelling reason why theoretical computer scientists believe that P ≠ NP comes from the existence of the class of NP-complete problems. This class has the intriguing property that if any NP-complete problem can be solved in polynomial time, then every problem in NP has a polynomial-time solution, that is, PDNP. Despite decades of study, though, no polynomial-time algorithm has ever been discovered for any NP-complete problem.',
          zh: '★★ NP 完全类的存在是「P ≠ NP」最有力的直觉：只要一个 NP 完全问题有多项式解法，全 NP 都有；但几十年来一个都没找到。' },
        { kind: 'body', page: 1061,
          en: 'The language HAM-CYCLE is one NP-complete problem. If there were an algorithm to decide HAM-CYCLE in polynomial time, then every problem in NP could be solved in polynomial time. The NP-complete languages are, in a sense, the "hardest" languages in NP. In fact, if NP − P turns out to be nonempty, we will be able to say with certainty that HAM-CYCLE 2 NP − P.',
          zh: '★ HAM-CYCLE 是一个 NP 完全问题；若它可多项式判定，则全 NP 都可——NP 完全语言是 NP 里「最难」的。' },
        { kind: 'body', page: 1061,
          en: 'This section starts by showing how to compare the relative "hardness" of languages using a precise notion called "polynomial-time reducibility." It then formally defines the NP-complete languages, finishing by sketching a proof that one such language, called CIRCUIT-SAT, is NP-complete. Sections 34.4 and 34.5 will use the notion of reducibility to show that many other problems are NP-complete.',
          zh: '★ 本节先用「多项式时间可归约」比较语言难度，再形式定义 NP 完全，并勾勒 CIRCUIT-SAT 的 NP 完全性证明。' },
        { kind: 'body', page: 1061,
          en: 'One way that sometimes works for solving a problem is to recast it as a different problem. We call that strategy "reducing" one problem to another. Think of a problem Q as being reducible to another problem Q 0 if any instance of Q can be recast as an instance of Q 0 , and the solution to the instance of Q 0 provides a solution to the instance of Q. For example, the problem of solving linear equations in an indeterminate x reduces to the problem of solving quadratic equations. Given a linear-equation instance ax + b = 0 (with solution x = −b/a), you can transform it to the quadratic equation ax 2 C bx + 0 = 0. This quadratic equation has the solutions x = .−b ˙ p b 2 − 4ac/=2a , where c = 0, so that p b 2 − 4ac = b. The',
          zh: '★ 「归约」即把问题 Q 改写成问题 Q′，使 Q′ 的解给出 Q 的解；例子：一次方程归约成二次方程。' },
        { kind: 'body', page: 1062,
          en: 'Returning to our formal-language framework for decision problems, we say that a language L 1 is polynomial-time reducible to a language L 2 , written L 1 ≤ P L 2 , if there exists a polynomial-time computable function f W f0,1 g − ! f0,1 g − such that for all x 2 f0,1 g − , x 2 L 1 if and only if f(x) 2 L 2 : (34.1)',
          zh: '★★ 形式定义：存在多项式时间可算函数 $f$ 使对所有 $x$ 有 $x\\in L_1 \\iff f(x)\\in L_2$（式 34.1）——这就是 $\\le_P$。' },
        { kind: 'body', page: 1062,
          en: 'We call the function f the reduction function, and a polynomial-time algorithm F that computes f is a reduction algorithm.',
          zh: '★ $f$ 叫归约函数；计算它的多项式时间算法 $F$ 叫归约算法。' },
      ],
      terms: [
        { en: 'polynomial-time reducible', zh: '多项式时间可归约', page: 1062 },
        { en: 'reduction function', zh: '归约函数', page: 1062 },
        { en: 'NP-complete', zh: 'NP 完全', page: 1063 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 原书 34.3 没有给出伪代码框（归约以散文与图 34.4/34.5 描述）。保留空阶段满足九段式。
    {
      type: 'pseudocode',
      title: '本节原书未给出伪代码',
      algo: null,
      signature: '',
      page: 1061,
      lines: [],
      vars: [],
      note: '原书 34.3 用散文与图 34.4/34.5 描述归约；「3-SAT → CLIQUE」的归约构造见 C 程序 part4 的双重循环。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '归约是多项式的，求解是指数的',
      panels: [
        { title: '归约图规模（3k 顶点）vs 暴力枚举 2^k',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: '3k（归约图顶点数，多项式）', expr: '3*n', color: '--viz-compare' },
            { name: '2^k（暴力枚举赋值，指数）', expr: 'Math.pow(2,n)', color: '--viz-done' },
          ] },
          note: '★ 把 k 条子句的 3-CNF 归约成 3k 个顶点的图：归约本身是多项式的；但「从零求解」SAT 仍要枚举 $2^k$ 个赋值。part4 取 k = 3。' },
      ],
      tasks: ['对照 C 程序 part4：把子句数 k 代入，看归约图顶点数（3k）为何只随 k 线性增长。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: 'C 程序 c/np.c 的 part4 把「3-SAT → CLIQUE」归约真实实现：可满足公式 ↦ 大小为子句数的团。',
      pseudocodeRef: null,
      c:{file:'np.c',code:String.raw`/* np.c -- 34 章：NP 完全性（SAT 暴力 / 验证 vs 求解 / 团与覆盖的互补 / 3SAT→CLIQUE 归约）。
 * part 1  2^n 枚举：16 变量的 3-CNF，种下可满足赋值 → 暴力找到它，打印尝试次数；
 * part 2  验证 O(n+m) vs 求解 O(2^n·m)：同一个公式的两条路；
 * part 3  团/独立集/顶点覆盖的互补关系（n=12 随机图，全部暴力）；
 * part 4  3-SAT → CLIQUE 归约：构造图上找大小 m 的团 ⟺ 公式可满足（一真一假两个实例）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o np np.c */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NV 16
#define NC 91                     /* 3-CNF 子句数（每变量 ~6 条，保证超定但可满足） */

typedef unsigned long long ull;
static unsigned long long st = 3409172026ULL;
static int rnd(void) { st = st * 6364136223846793005ULL + 1442695040888963407ULL; return (int)((st >> 33) & 0x7fffffff); }

static int lit[NC][3];            /* 子句的文字（1..NV 正，负数取反） */

/* 子句在赋值 x（bit i = 变量 i+1）下是否满足 */
static int sat_clause(const int *cl, ull x)
{
    for (int j = 0; j < 3; j++) {
        int v = cl[j], var = (v < 0 ? -v : v) - 1, want = v > 0;
        if (((x >> var) & 1) == (ull)want) { return 1; }
    }
    return 0;
}

static int sat_all(const int cls[][3], int m, ull x)
{
    for (int c = 0; c < m; c++) { if (!sat_clause(cls[c], x)) { return 0; } }
    return 1;
}

static int adj[12][12];           /* 无向图（0/1） */

/* 暴力求最大团（n ≤ 12：2^n 枚举点集） */
static int max_clique(const int g[][12], int n)
{
    int best = 0;
    for (ull mask = 0; mask < (1ULL << n); mask++) {
        int size = 0, ok = 1;
        int vs[12];
        for (int i = 0; i < n; i++) { if ((mask >> i) & 1) { vs[size++] = i; } }
        for (int i = 0; ok && i < size; i++) {
            for (int j = i + 1; j < size; j++) { if (!g[vs[i]][vs[j]]) { ok = 0; break; } }
        }
        if (ok && size > best) { best = size; }
    }
    return best;
}

/* 暴力求最大独立集 */
static int max_indep(const int g[][12], int n)
{
    int best = 0;
    for (ull mask = 0; mask < (1ULL << n); mask++) {
        int size = 0, ok = 1;
        int vs[12];
        for (int i = 0; i < n; i++) { if ((mask >> i) & 1) { vs[size++] = i; } }
        for (int i = 0; ok && i < size; i++) {
            for (int j = i + 1; j < size; j++) { if (g[vs[i]][vs[j]]) { ok = 0; break; } }
        }
        if (ok && size > best) { best = size; }
    }
    return best;
}

/* 暴力求最小顶点覆盖 */
static int min_vc(const int g[][12], int n)
{
    for (int k = 0; k <= n; k++) {
        for (ull mask = 0; mask < (1ULL << n); mask++) {
            if ((int)__builtin_popcountll(mask) != k) { continue; }
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

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：暴力 SAT（2^n 枚举）===== */
    {
        /* 先种一个可满足赋值，再按它生成子句（保证可满足） */
        ull planted = (ull)rnd() & 0xFFFF;
        for (int c = 0; c < NC; c++) {
            int var[3], neg[3];
            var[0] = 1 + rnd() % NV;
            neg[0] = !((planted >> (var[0] - 1)) & 1);   /* 第一个文字按 planted 定符号：子句必被满足 */
            for (int j = 1; j < 3; j++) {
                var[j] = 1 + rnd() % NV;
                neg[j] = rnd() % 2;
            }
            for (int j = 0; j < 3; j++) { lit[c][j] = neg[j] ? -var[j] : var[j]; }
        }
        /* 若公式被 planted 意外绕开，直接塞一个满足它的子句 */
        if (!sat_all(lit, NC, planted)) {
            lit[0][0] = 1; lit[0][1] = -1; lit[0][2] = 2;   /* 兜底再检查 */
            if (!sat_all(lit, NC, planted)) {
                /* 造一个必然由 planted 满足的子句：任取变量，按 planted 定符号 */
                for (int j = 0; j < 3; j++) {
                    lit[0][j] = (int)(((planted >> j) & 1) ? (j + 1) : -(j + 1));
                }
                assert(sat_all(lit, NC, planted));
            }
        }
        ull found = 0; int tries = 0;
        for (ull x = 0; x < (1ULL << NV); x++) {
            tries++;
            if (sat_all(lit, NC, x)) { found = x; break; }
        }
        printf("part 1: 暴力 SAT（n = %d 变量，%d 子句）：\n", NV, NC);
        printf("        尝试 %d / %llu 个赋值后找到满足赋值 ✓\n", tries, 1ULL << NV);
        assert(found != 0 || sat_all(lit, NC, 0));
        assert(sat_all(lit, NC, found));
        printf("        验证该赋值满足全部 %d 条子句 ✓\n", NC);

        /* ===== part 2：验证 vs 求解 ===== */
        long verify_ops = NC * 3;                        /* 每子句 3 个文字 */
        ull total_space = (1ULL << NV);
        printf("part 2: 验证一张证书：%ld 次文字检查；求解：最坏 %llu × %d 次\n",
               verify_ops, total_space, NC);
        assert(verify_ops < 1000 && total_space > 60000);
        printf("        差了 5 个数量级 —— NP 的定义就在这条缝里 ✓\n");
    }

    /* ===== part 3：团 / 独立集 / 顶点覆盖的互补 ===== */
    {
        memset(adj, 0, sizeof(adj));
        for (int i = 0; i < 12; i++) {
            for (int j = i + 1; j < 12; j++) { adj[i][j] = adj[j][i] = (rnd() % 100 < 45); }
        }
        int w = max_clique(adj, 12);
        int g[12][12];
        for (int i = 0; i < 12; i++) {
            for (int j = 0; j < 12; j++) { g[i][j] = (i == j) ? 0 : 1 - adj[i][j]; }
        }
        int a = max_indep(adj, 12), ai = max_indep(g, 12), vc = min_vc(adj, 12);
        printf("part 3: n = 12 随机图：ω(G) = %d，α(G) = %d，α(Ḡ) = %d，最小覆盖 = %d\n", w, a, ai, vc);
        assert(w == ai);                    /* ω(G) = α(Ḡ) */
        assert(vc == 12 - a);               /* VC = n − α */
        printf("        ω(G) = α(Ḡ) 与 VC = n − α 两条互补关系全部成立 ✓\n");
    }

    /* ===== part 4：3-SAT → CLIQUE 归约 ===== */
    {
        /* 公式：(v1 ∨ ¬v2 ∨ v3) ∧ (¬v1 ∨ v2 ∨ ¬v3) ∧ (v2 ∨ v3 ∨ ¬v1) */
        int F[3][3] = {{1, -2, 3}, {-1, 2, -3}, {2, 3, -1}};
        int g[12][12] = {{0}};
        for (int c = 0; c < 3; c++) {
            for (int j = 0; j < 3; j++) {
                for (int c2 = c + 1; c2 < 3; c2++) {
                    for (int j2 = 0; j2 < 3; j2++) {
                        int v1 = F[c][j], v2 = F[c2][j2];
                        if (v1 != -v2) { g[c * 3 + j][c2 * 3 + j2] = g[c2 * 3 + j2][c * 3 + j] = 1; }
                    }
                }
            }
        }
        int w = max_clique(g, 9);
        /* 公式可满足（v1=1, v2=1, v3=1 不行；试 v1=0: 子句2 需 v2 或 v3… 手算：v2=1,v3=1,v1=0 满足三条） */
        printf("part 4: 3-SAT → CLIQUE：可满足公式（3 子句）→ 归约图的最大团 = %d（= 子句数）✓\n", w);
        assert(w == 3);
        /* 不可满足实例：(v1) 与 (not v1) —— 两条 3-CNF 子句锁死 */
        int F2[2][3] = {{1, 1, 1}, {-1, -1, -1}};
        static int g2[12][12];
        memset(g2, 0, sizeof(g2));
        for (int c = 0; c < 2; c++) {
            for (int j = 0; j < 3; j++) {
                for (int c2 = c + 1; c2 < 2; c2++) {
                    for (int j2 = 0; j2 < 3; j2++) {
                        int v1 = F2[c][j], v2 = F2[c2][j2];
                        if (v1 != -v2) { g2[c * 3 + j][c2 * 3 + j2] = g2[c2 * 3 + j2][c * 3 + j] = 1; }
                    }
                }
            }
        }
        int w2 = max_clique(g2, 6);
        printf("        不可满足公式（v1 与 not v1 锁死）-> 归约图的最大团 = %d < 2\n", w2);
        assert(w2 < 2);
    }

    puts("all checks passed.");
    return 0;
}
`,
      notes: [
        { line: 158, zh: '★ 公式 $F[3][3]$：3 条子句、每条 3 个文字。' },
        { line: 160, zh: '★★ 归约核心：对每对「不同子句、非互补」的文字连边，构造归约图。' },
        { line: 170, zh: '★ w = max_clique(g, 9)：在 9 顶点（3 子句 × 3 文字）图上求最大团。' },
        { line: 173, zh: '★★ 可满足公式 → 最大团 = 3（恰等于子句数），断言通过。' },
        { line: 175, zh: '★ 不可满足实例：(v1) 与 (¬v1) 锁死。' },
        { line: 190, zh: '★★ 不可满足 → 最大团 w2 = 1 < 2，断言通过。' },
      ],
      tests: [
        { in: '可满足 3 子句公式', out: '归约图最大团 = 3（= 子句数）' },
        { in: '不可满足 (v1) ∧ (¬v1)', out: '最大团 = 1 < 2' },
      ],
      mapping: [
        { pc: 1, pcCode: '按子句构造归约图的顶点与边', c: '`for (int c = 0; c < 3; c++)`（第 160 行）' },
        { pc: 2, pcCode: '在归约图上求大小为 k 的团', c: '`int w = max_clique(g, 9);`（第 170 行）' },
        { pc: 3, pcCode: '答案保持：可满足 ⟺ 有大小为 k 的团', c: '`assert(w == 3);`（第 173 行）' },
      ] },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：归约保持难度，NPC 是最难的',
      intro: '这一关要讲清：归约关系传递；NP 完全 = 在 NP 中且「人人都能归约到它」。',
      claims: [
        { expr: 'L_1 \\le_P L_2 \\Rightarrow (L_2\\in P \\Rightarrow L_1\\in P)', when: 'Lemma 34.3：归约保持「在 P 中」', page: 1062, source: 'book' },
        { expr: '\\le_P \\text{ 是传递关系}', when: 'Exercise 34.3-2：归约关系传递', page: 1062, source: 'book' },
        { expr: '\\text{团大小}=k \\iff \\text{3-CNF 可满足}', when: 'part4 归约正确性（C 实测）', page: 1062, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 part4 实测（3-SAT → CLIQUE）', rows: [
          ['公式实例', '归约图最大团', '是否可满足'],
          ['$(v_1\\lor\\neg v_2\\lor v_3)\\land(\\neg v_1\\lor v_2\\lor\\neg v_3)\\land(v_2\\lor v_3\\lor\\neg v_1)$', '3（= 子句数）', '是'],
          ['$(v_1)\\land(\\neg v_1)$（锁死）', '1（< 2）', '否'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '归约如何保持答案', steps: [
          { zh: '归约函数 $f$ 把 $L_1$ 的实例 $x$ 翻译成 $L_2$ 的实例 $f(x)$，且 $x\\in L_1 \\iff f(x)\\in L_2$（式 34.1）。' },
          { tex: 'x\\in L_1 \\iff f(x)\\in L_2', zh: '答案严格保持。' },
          { zh: 'part4 中：可满足赋值给每子句挑一个为真文字 → 这些顶点跨子句两两有边 → 大小为 k 的团；反之团大小为 k 则每子句恰取一真文字 → 可满足。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: 'Lemma 34.3：归约保持「在 P 中」',
      statement: 'If L 1 ,L 2 ⊆ f0,1 g − are languages such that L 1 ≤ P L 2 , then L 2 2 P implies L 1 2 P. x',
      page: 1062,
      intro: '★ 三步：构造判定器 A₁（Init）→ 用归约 + A₂ 回答（Maint）→ 正确性与多项式时间（Term）。',
      steps: [
        { title: '第一步 · 构造判定器 A¹',
          en: 'Proof Let A 2 be a polynomial-time algorithm that decides L 2 , and let F be a polynomial-time reduction algorithm that computes the reduction function f . We show how to construct a polynomial-time algorithm A 1 that decides L 1 .',
          page: 1062,
          body: [
            '★ 已知：A₂ 在多项式时间判定 L₂；F 在多项式时间计算归约函数 $f$（即 $L_1\\le_P L_2$）。',
            '★ 目标：用它们拼出一个多项式时间判定 L₁ 的算法 A₁。',
          ] },
        { title: '第二步 · 归约 + A² 回答',
          en: 'Figure 34.5 illustrates how we construct A 1 . For a given input x 2 f0,1 g − , algorithm A 1 uses F to transform x into f(x) , and then it uses A 2 to test whether f(x) 2 L 2 . Algorithm A 1 takes the output from algorithm A 2 and produces that answer as its own output.',
          page: 1063,
          body: [
            '★ 对输入 $x$，A₁ 先用 F 把它翻译成 $f(x)$。',
            '★ 再用 A₂ 判定 $f(x)$ 是否属于 L₂，把 A₂ 的答案直接作为 A₁ 对 $x$ 的答案。',
          ] },
        { title: '第三步 · 正确性与多项式时间',
          en: 'The correctness of A 1 follows from condition (34.1). The algorithm runs in polynomial time, since both F and A 2 run in polynomial time (see Exercise 34.1-5).',
          page: 1063,
          body: [
            '★ 正确性来自式 (34.1)：$x\\in L_1 \\iff f(x)\\in L_2$，故 A₁ 的答案与 A₂ 一致。',
            '★★ F 与 A₂ 都多项式时间，串联仍多项式时间；于是若 $L_2\\in P$ 则 $L_1\\in P$。∎',
          ] },
      ],
      conclusion: '★ 结论：归约把难度向下传递——能快解目标问题，就能快解源问题。这正是用「归约到已知 NPC 问题」证明新问题是 NPC 的根本依据。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: '若 L₁ ≤ₚ L₂ 且 L₂ ∈ P，则 L₁ ∈ P。', answer: true,
          why: '★ Lemma 34.3：归约保持「在 P 中」；用归约算法 + L₂ 的判定器即可判定 L₁。' },
        { kind: 'judge', q: '多项式时间归约关系 ≤ₚ 是传递的。', answer: true,
          why: '★ 习题 34.3-2：若 L₁≤ₚL₂ 且 L₂≤ₚL₃，则串联归约得 L₁≤ₚL₃。' },
        { kind: 'single', q: 'C 程序 part4 中，可满足的 3 子句公式归约出的图，最大团是多少？',
          options: ['1', '2', '3', '9'], answer: 2,
          why: '★ part4 打印「可满足公式（3 子句）→ 归约图的最大团 = 3（= 子句数）」。' },
        { kind: 'judge', q: 'C 程序 part4 中，不可满足公式 (v1)∧(¬v1) 归约出的图最大团小于 2。', answer: true,
          why: '★ part4 打印「不可满足公式 → 归约图的最大团 = 1 < 2」。' },
        { kind: 'single', q: '语言 L 是 NP 完全，需要满足哪两条？',
          options: ['L ∈ P 且所有 L′ ∈ NP 可归约到 L', 'L ∈ NP 且所有 L′ ∈ NP 可归约到 L', 'L 是 NP-hard 即可', '存在归约 L ≤ₚ SAT'], answer: 1,
          why: '★ 定义：NP 完全 = (1) $L\\in NP$；(2) 对所有 $L^\\prime\\in NP$ 有 $L^\\prime\\le_P L$。' },
        { kind: 'simulate', q: 'C 程序 part4 把 3 条子句的 3-CNF 归约成图，图的顶点数是多少（每子句 3 个文字顶点）？',
          expect: [9], placeholder: '例如：6',
          why: '★ 每子句 3 个文字各成一个顶点，3 子句共 $3\\times 3 = 9$ 个顶点；part4 中 `max_clique(g, 9)`。' },
        { kind: 'judge', q: '归约函数 f 必须能在多项式时间内计算，且保持答案（x∈L₁ ⟺ f(x)∈L₂）。', answer: true,
          why: '★ 式 (34.1) 的定义：多项式时间可算 + 答案保持，二者缺一不可。' },
      ],
      bookExercises: [
        { id: '34.3-1', page: 1071, star: 0,
          statement: 'Verify that the circuit in Figure 34.8(b) is unsatisfiable.',
          hint: '图 34.8(b) 只有 $x_1, x_2, x_3$ 三个输入（同图 (a) 的标注），所以「验证不可满足」的完整做法就是列一张 8 行的表：每行代一组赋值，自底向上把每个门的输出标在结点上，看最后一行有没有输出 1。★ 想少算几行，就顺着约束推：从输出端要求 1 倒推每个门的输入必须是哪些值，推到某个内部结点上出现「既要 0 又要 1」就到此为止 —— 这等于把 8 行压成一行的矛盾。两种写法都算答案，但表法更不容易漏。' },
        { id: '34.3-2', page: 1071, star: 0,
          statement: 'Show that the ≤ P relation is a transitive relation on languages. That is, show that if L 1 ≤ P L 2 and L 2 ≤ P L 3 , then L 1 ≤ P L 3 .',
          hint: '两个归约各有自己的多项式时间函数：$f$ 把 $x$ 变成 $f(x)$ 使 $x \\in L_1 \\iff f(x) \\in L_2$，$g$ 把 $y$ 变成 $g(y)$ 使 $y \\in L_2 \\iff g(y) \\in L_3$。取复合 $h(x) = g(f(x))$，两条链拼起来：$x \\in L_1 \\iff f(x) \\in L_2 \\iff g(f(x)) \\in L_3$。时间：$g$ 的输入长度不超过 $f$ 的输出长度，而 $|f(x)| \\le p(n)$，于是算 $h$ 的时间 $\\le p(n) + q(p(n))$，仍是 $n$ 的多项式。★ 别漏这一步：多项式复合多项式还是多项式，要显式写一句。' },
        { id: '34.3-3', page: 1071, star: 0,
          statement: 'Prove that L ≤ P L if and only if L ≤ P L.',
          hint: '关卡里这句题干被文本层削掉了两条补集横线，看着像「$L \\le_P L$ 当且仅当 $L \\le_P L$」，于是很容易当成自反性来答——那不是原题。 原书 p.1071 印的是：证明 $L \\le_P \\bar{L}$ 当且仅当 $\\bar{L} \\le_P L$。 证明只有一行：归约的定义是「$x \\in L \\iff f(x) \\in \\bar{L}$」， 把两边同时取反就得到「$x \\in \\bar{L} \\iff f(x) \\in L$」—— **同一个** $f$ 就是另一个方向的归约。所以两个方向互为逆否，谁都不比谁难， 不需要另外构造 $f’$。' },
        { id: '34.3-4', page: 1071, star: 0,
          statement: 'Show that an alternative proof of Lemma 34.5 can use a satisfying assignment as a certificate. Which certificate makes for an easier proof?',
          hint: '两问都要落到判断上，「看侧重哪头」不算答案。 第一问（用满足赋值当证书怎么证）：证书是 $n$ 位赋值 $a$。验证器按拓扑序给每个门算值 （输入门取 $a$ 的对应位，与门/或门/非门看已算出的前件），最后检查输出门是否为 1； 每一步都是常数时间，故总时间 $O(\\text{门数})$，多项式 —— 这给出 $\\text{CIRCUIT-SAT} \\in NP$。 第二问（哪个更好证）：**给每条线赋值的那个证书更好证**。因为验证时根本不用「按序算」， 只需对每个门做一次局部检查（它的值是否等于输入门的值按该门运算算出来的结果）， 连拓扑序都不用讲；也不用论证「我算的值与电路真实值一致」这种归纳。 代价是证书更长（线数而非输入位数）。 结论：局部一致性 ⟹ 整体正确，这一向的推理更短， 所以「用全部线的值」是更容易的那个证明；满足赋值胜在证书小。' },
        { id: '34.3-5', page: 1071, star: 0,
          statement: 'The proof of Lemma 34.6 assumes that the working storage for algorithm A occupies a contiguous region of polynomial size. Wher e does the proof exploit this assumption? Argue that this assumption does not involve any loss of generality.',
          hint: '证明里用到「连续」的地方就一处：电路的每个时间片要能把「配置」写成一条定长比特串 —— 程序计数器、输入、工作单元按**固定地址**排在一起，下一片只需局部连线就能算出下一状态。不失一般性的论证：给机器换一个「带地址翻译」的等价实现 —— 每个逻辑单元对应一个固定编号（把散落的物理地址映射回连续编号），这一步只让每片大小乘一个常数因子（多项式不变），而 $O(n^k)$ 片、每片多项式大小的电路规模照旧是多项式。★ 答题要把「哪里用了连续性」点名（配置编码 + 片间连线），再给「重排地址」这一手。' },
        { id: '34.3-6', page: 1072, star: 0,
          statement: 'A language L is complete for a language class C with respect to polynomial-time reductions if L 2 C and L 0 ≤ P L for all L 0 2 C . Show that ; and f0; 1g − are the only languages in P that are not complete for P with respect to polynomial-time reductions.',
          hint: '结论要证两件事，缺一不可，别只报「它们没得归约」。 **这两者确实不完全**：若 $L’ \\le_p \\emptyset$，则 $x \\in L’ \\iff f(x) \\in \\emptyset$ 恒假， 于是 $L’ = \\emptyset$ —— 任何**非空**语言都归约不到 $\\emptyset$； 同理 $L’ \\le_p \\{0,1\\}^{*}$ 逼出 $L’ = \\Sigma^{*}$，所以任何**非全**语言都归约不到它。 **其余的 P 语言都完全**：设 $L \\in P$、$L \\ne \\emptyset$、$L \\ne \\Sigma^{*}$， 取定一个串 $y_1$ 满足 $y_1 \\in L$、一个串 $y_0$ 满足 $y_0 \\notin L$（两者存在就是这两个条件的意思）。 对任意 $L’ \\in P$，用它的多项式判定器 $M’$ 定义归约 $f(x) = y_1$（若 $M’$ 接受 $x$）否则 $f(x) = y_0$ —— 可多项式时间计算， 且 $x \\in L’ \\iff f(x) \\in L$ 由构造直接成立。 $y_0, y_1$ 是**固定的常数串**，写进归约程序里，不需要「找出」它们。' },
        { id: '34.3-7', page: 1072, star: 0,
          statement: 'Show that, with respect to polynomial-time reductions (see Exercise 34.3-6), L is complete for NP if and only if L is complete for co-NP.',
          hint: '要用的是 34.3-6 那条「归约保持补」：$A \\le_p B \\implies \\bar{A} \\le_p \\bar{B}$（同一个归约函数，因为 $x \\notin A \\iff f(x) \\notin B$）。两个方向分开证：($\\Rightarrow$) 设 $L$ 对 NP 完全。$\\overline{L} \\in$ co-NP 由 $L \\in NP$ 直接有。任取 $L’ \\in$ co-NP，则 $\\bar{L’} \\in NP$，完全性给 $\\bar{L’} \\le_p L$；两边取补得 $L’ \\le_p \\overline{L}$ —— 这就是「$\\overline{L}$ 对 co-NP 完全」的第二半。($\\Leftarrow$) 设 $\\overline{L}$ 对 co-NP 完全。$L \\in NP$ 由 $\\overline{L} \\in$ co-NP 直接有。任取 $L’ \\in NP$，则 $\\bar{L’} \\in$ co-NP，完全性给 $\\bar{L’} \\le_p \\overline{L}$；再取补得 $L’ \\le_p L$。★ 全程只搬补集、不引入新构造；每一步注明用的是定义还是 34.3-6。' },
        { id: '34.3-8', page: 1072, star: 0,
          statement: 'The reduction algorithm F in the proof of Lemma 34.6 constructs the circuit C = f (x) based on knowledge of x , A, and k. Professor Sartre observes that the string x is input to F , but only the existence of A, k, and the constant factor implicit in the O(n k ) running time is known to F (since the language L belongs to NP), not their actual values. Thus, the professor concludes that F cannot possi- bly construct the circuit C and that the language CIRCUIT-SAT is not necessarily NP-hard. Explain the flaw in the professor’s reasoning.',
          hint: '教授的漏洞在「$F$ 必须知道 $A$、$k$ 的具体值才能造电路」。归约的定义允许 $F$ 用**存在性**给出的信息：$L \\in NP$ 的意思是存在某个 $A$、某个常数，使 $A$ 在 $n^k$ 时间内判定 $L$。$F$ 在构造时固定用这个 $A$（它是语言 $L$ 的属性，与输入 $x$ 无关），要造多少片电路，只要按 $|x|^{k}$ 的上界铺 $T(n)$ 份 $M$ 的级联即可 —— 多铺几片不影响可满足性（接受后可以自锁），所以「不知道紧确常数」不妨碍构造。★ 关键区分：归约函数必须**可计算**且多项式时间，不要求「无提示地推出 $A$」；存在性给的是一个固定的 $A$，$F$ 可以把它当作程序的一部分写死。' },
      ],
    },
  ],
};
