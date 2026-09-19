/* =============================================================================
 * 第 34 章 34.4 —— 第 s04 关：34.4 NP-completeness proofs
 *
 * 原文锚点：印刷页 1072–1079（pdf_index 1093–1100）
 *
 * 引述已逐字保留（未改写）；其余段已人工填写完毕。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's04',
  id: 'ch34/s04',
  chapter: 34,
  section: '34.4',
  title: 'NP 完全性的证明',
  shortTitle: '34.4 NP 完全性的证明',
  titleEn: 'NP-completeness proofs',
  source: { printed: [1072, 1079], pdf: [1093, 1100] },
  sourceNote: '本关对应原书 34.4 节（印刷页 1072–1079）。',
  prerequisites: [
    { label: '34.3 NP-completeness and reducibility', url: '#/ch34/s03' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '用已知 NPC 证明新 NPC：两步法',
      why: '★★ 这一关给出证明某语言是 NP 完全的「标准配方」：Lemma 34.8 说，只要从一个已知 NPC 语言归约过去就够——不必从全 NP 逐一归约。',
      position: '34.4 承接 34.3 的归约与 NPC 定义，把方法论落到「证明 SAT / 3-CNF-SAT 是 NPC」；为 34.5 的一连串具体归约（CLIQUE、VERTEX-COVER…）提供模板。C 程序 part4 就是这条方法论的一次实战。',
      unlocks: [
        { label: '34.5 NP-complete problems', url: '#/ch34/s05' },
      ],
      mathKit: [
        {title:'Lemma 34.8', body:'若 $L_0\\in\\text{NPC}$ 且 $L_0\\le_P L$，则 $L$ 是 NP-hard；若再有 $L\\in\\text{NP}$，则 $L\\in\\text{NPC}$。'},
        {title:'两步法', body:'证 $L\\in\\text{NPC}$：(1) 证 $L\\in\\text{NP}$；(2) 证 NP-hard——选一个已知 NPC 语言 $L_0$，给出多项式时间归约 $f$ 使 $x\\in L_0\\iff f(x)\\in L$。'},
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '证「难」不必从全人类比，只需拽一个已知的难兄',
      scene: '你要向人证明「爬珠峰很难」——不需要让所有人去试，只要指出「登过 K2 的人也都登得过珠峰」就够了。',
      body: [
        '★ 直证一个问题是 NP 完全，最笨的办法是把 NP 里**每一个**语言都归约到它——不可行。Lemma 34.8 告诉我们捷径：只要从**一个**已知 NPC 语言（如 CIRCUIT-SAT / SAT）归约过去，就自动把全 NP 都「顺带」归约到了它（因为 ≤ₚ 传递）。',
        '★★ C 程序 part4 就是用这条捷径的范例：把 3-CNF-SAT（已知 NPC）归约成 CLIQUE。可满足公式 $(v_1\\lor\\neg v_2\\lor v_3)\\land(\\neg v_1\\lor v_2\\lor\\neg v_3)\\land(v_2\\lor v_3\\lor\\neg v_1)$ 归约出的图最大团 = **3**（= 子句数）；锁死的不可满足公式归约图最大团 = **1**（< 2）。一次归约，答案保持。',
        '★★ 而「从零求解」仍是指数的：part1 里 16 变量要枚举 $2^{16} = 65536$ 个赋值。归约法绕开了「逐个证明」，直接借力已知 NPC——这就是 34.4/34.5 的全部技巧。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1072,
          en: 'C = f (x) based on knowledge of x , A, and k. Professor Sartre observes that the string x is input to F , but only the existence of A, k, and the constant factor implicit in the O(n k ) running time is known to F (since the language L belongs to NP), not their actual values. Thus, the professor concludes that F cannot possibly construct the circuit C and that the language CIRCUIT-SAT is not necessarily',
          zh: '★ 一段情境讨论：归约算法 F 只知「存在」多项式验证器，不知其具体值——这说明 CIRCUIT-SAT 未必能被简单构造出来（铺垫为何归约法才是正道）。' },
        { kind: 'body', page: 1072,
          en: 'The proof that the circuit-satisfiability problem is NP-complete showed directly that L ≤ PCIRCUIT-SAT for every language L 2 NP. This section shows how to prove that languages are NP-complete without directly reducing every language in NP to the given language. We’ll explore examples of this methodology by proving that various formula-satisfiability problems are NP-complete. Section 34.5 provides many more examples.',
          zh: '★ 34.3 是「从全 NP 直归约」；本节改为「从单一已知 NPC 归约」的方法论，并用公式可满足性问题演示。' },
        { kind: 'body', page: 1072,
          en: 'The following lemma provides a foundation for showing that a given language is NP-complete.',
          zh: '★ 引子：下面 Lemma 34.8 是证明 NP 完全的基石。' },
        { kind: 'body', page: 1072,
          en: 'If L is a language such that L 0 ≤ P L for some L 0 2 NPC, then L is NP-hard. If, in addition, we have L 2 NP, then L 2 NPC.',
          zh: '★★ Lemma 34.8：只要从一个已知 NPC 语言 $L_0$ 归约到 $L$，则 $L$ 是 NP-hard；若 $L\\in NP$ 则 $L\\in NPC$。' },
        { kind: 'body', page: 1073,
          en: 'In other words, by reducing a known NP-complete language L 0 to L, we implicitly reduce every language in NP to L. Thus, Lemma 34.8 provides a method for proving that a language L is NP-complete:',
          zh: '★ 因为 ≤ₚ 传递，从单一 $L_0$ 归约就「隐式」把全 NP 都归约到了 $L$——不必逐个证。' },
        { kind: 'body', page: 1073,
          en: '2. Prove that L is NP-hard: a. Select a known NP-complete language L 0 . b. Describe an algorithm that computes a function f mapping every instance x 2 f0; 1g − of L 0 to an instance f (x) of L. c. Prove that the function f satisfies x 2 L 0 if and only if f (x) 2 L for all x 2 f0; 1g − . d. Prove that the algorithm computing f runs in polynomial time.',
          zh: '★★ 两步法的第 2 步（证 NP-hard）细化为四小步：选题、给归约函数、证答案保持、证多项式时间。' },
      ],
      terms: [
        { en: 'NP-hard', zh: 'NP 难', page: 1072 },
        { en: 'reduction algorithm', zh: '归约算法', page: 1072 },
        { en: 'known NP-complete language', zh: '已知的 NP 完全语言', page: 1073 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 原书 34.4 没有给出伪代码框（方法论以散文与图 34.10/34.11 描述）。保留空阶段满足九段式。
    {
      type: 'pseudocode',
      title: '本节原书未给出伪代码',
      algo: null,
      signature: '',
      page: 1072,
      lines: [],
      vars: [],
      note: '原书 34.4 用散文与图 34.10/34.11 讲归约方法论；「3-SAT → CLIQUE」的归约构造见 C 程序 part4。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '一条归约，胜过逐一归约',
      panels: [
        { title: '一次多项式归约 vs 从全 NP 逐一归约',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: '一条归约（O(n^k)）', expr: 'n*n', color: '--viz-compare' },
            { name: '从全 NP 逐一归约（不可行）', expr: 'Math.pow(2,n)', color: '--viz-done' },
          ] },
          note: '★ Lemma 34.8 的精髓：证明 NPC 只需「一条」多项式归约（借助 ≤ₚ 的传递性）；不必去归约 NP 里每一个语言。part4 正是这条方法论的实战。' },
      ],
      tasks: ['对照 C 程序 part4：它只做「3-SAT → CLIQUE」一条归约，就足以证明 CLIQUE 是 NPC。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: 'C 程序 c/np.c 的 part4 是两步法的实战：把已知 NPC 的 3-SAT 归约成 CLIQUE，并用 part1 的 2^n 提醒「从零求解」的指数代价。',
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
        { line: 118, zh: '★ part1 的暴力枚举：for 循环上界 $1ULL << NV = 2^{16}$，提醒「从零求解」是指数的。' },
        { line: 158, zh: '★ 选已知 NPC（3-CNF-SAT）的实例：3 条子句公式 $F[3][3]$。' },
        { line: 160, zh: '★★ 归约算法 F：对每对「不同子句、非互补」文字连边，构造归约图（多项式时间）。' },
        { line: 170, zh: '★ 在归约图上求最大团：w = max_clique(g, 9)。' },
        { line: 173, zh: '★★ 可满足 → 最大团 = 3（= 子句数），答案保持，断言通过。' },
        { line: 190, zh: '★ 不可满足实例 → 最大团 w2 = 1 < 2，答案保持，断言通过。' },
      ],
      tests: [
        { in: '已知 NPC：3-SAT，归约到 CLIQUE', out: '可满足公式 → 团大小 = 3 = 子句数' },
        { in: '从零求解 SAT（对照）', out: '最坏枚举 $2^{16} = 65536$ 个赋值' },
      ],
      mapping: [
        { pc: 1, pcCode: '选一个已知 NPC 语言 L₀（3-SAT）', c: '`int F[3][3] = {{1, -2, 3}, {-1, 2, -3}, {2, 3, -1}};`（第 158 行）' },
        { pc: 2, pcCode: '给出多项式时间归约 f（构造图）', c: '`for (int c2 = c + 1; c2 < 3; c2++)`（第 162 行）' },
        { pc: 3, pcCode: '答案保持：可满足 ⟺ 有大小为 k 的团', c: '`assert(w == 3);`（第 173 行）' },
      ] },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：一步法胜过全归约',
      intro: '这一关要讲清：Lemma 34.8 让「证明 NPC」变成「找一条归约」；而求解本身仍指数。',
      claims: [
        { expr: 'L_0\\in NPC,\\ L_0\\le_P L \\Rightarrow L\\in NPC', when: 'Lemma 34.8', page: 1072, source: 'book' },
        { expr: '\\text{只需一条多项式归约}', when: '两步法：从单一已知 NPC 归约即够（≤ₚ 传递）', page: 1073, source: 'book' },
        { expr: '2^n', when: '从零求解仍指数（part1 实测 $2^{16}$）', page: 1072, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 part4 / part1 实测', rows: [
          ['环节', '代价'],
          ['归约 3-SAT → CLIQUE（一次）', '多项式时间构造 9 顶点图'],
          ['可满足公式的归约图最大团', '3（= 子句数）'],
          ['不可满足公式的归约图最大团', '1（< 2）'],
          ['从零求解 SAT（对照）', '枚举 $2^{16} = 65536$ 个赋值'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '为什么一条归约就够', steps: [
          { zh: '已知 $L_0\\in\\text{NPC}$，故对所有 $L^{\\prime}\\in\\text{NP}$ 有 $L^{\\prime}\\le_P L_0$（NPC 定义）。' },
          { tex: 'L^\\prime\\le_P L_0\\ \\text{且}\\ L_0\\le_P L \\Rightarrow L^\\prime\\le_P L', zh: '≤ₚ 传递（习题 34.3-2）。' },
          { zh: '于是「从 $L_0$ 一条归约」就隐式把全 NP 都归约到了 $L$——不必逐个证。这正是 Lemma 34.8。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: 'Lemma 34.8：从单一已知 NPC 归约即证 NPC',
      statement: 'If L is a language such that L 0 ≤ P L for some L 0 2 NPC, then L is NP-hard. If, in addition, we have L 2 NP, then L 2 NPC.',
      page: 1072,
      intro: '★ 三步：用传递性证 NP-hard（Init）→ 两步法第 1 步「证 L∈NP」（Maint）→ 第 2 步「证 NP-hard」四小步（Term）。',
      steps: [
        { title: '第一步 · 由传递性证 NP-hard',
          en: 'Proof Since L 0 is NP-complete, for all L 00 2 NP, we have L 00 ≤ P L 0 . By supposition, we have L 0 ≤ P L, and thus by transitivity (Exercise 34.3-2), we have L 00 ≤ P L, which shows that L is NP-hard. If L 2 NP, we also have L 2 NPC.',
          page: 1072,
          body: [
            '★ 因 $L_0\\in\\text{NPC}$，对所有 $L^{\\prime}\\in\\text{NP}$ 有 $L^{\\prime}\\le_P L_0$。',
            '★ 又已知 $L_0\\le_P L$，由 ≤ₚ 传递得 $L^{\\prime}\\le_P L$ 对所有 $L^{\\prime}\\in\\text{NP}$ 成立 → $L$ 是 NP-hard；若 $L\\in NP$ 则 $L\\in\\text{NPC}$。',
          ] },
        { title: '第二步 · 两步法 (1) 证 L ∈ NP',
          en: '1. Prove L 2 NP.',
          page: 1073,
          body: [
            '★ 证明 $L\\in\\text{NP}$：找一个多项式时间验证算法，证书长度多项式有界。',
            '★ 例如 CLIQUE 的证书是「团的顶点集」，验证只需检查 $\\binom{k}{2}$ 对边，多项式时间。',
          ] },
        { title: '第三步 · 两步法 (2) 证 NP-hard',
          en: '2. Prove that L is NP-hard: a. Select a known NP-complete language L 0 . b. Describe an algorithm that computes a function f mapping every instance x 2 f0; 1g − of L 0 to an instance f (x) of L. c. Prove that the function f satisfies x 2 L 0 if and only if f (x) 2 L for all x 2 f0; 1g − . d. Prove that the algorithm computing f runs in polynomial time.',
          page: 1073,
          body: [
            '★ (a) 选一个已知 NPC 语言 $L_0$（如 3-SAT / CIRCUIT-SAT）。',
            '★ (b)(c) 给多项式时间归约函数 $f$，并证 $x\\in L_0\\iff f(x)\\in L$（答案保持）。',
            '★★ (d) 证计算 $f$ 的算法多项式时间。四小步齐备即证 $L$ 是 NP-hard，结合第 2 步得 $L\\in\\text{NPC}$。∎',
          ] },
      ],
      conclusion: '★ 结论：Lemma 34.8 + 两步法把「证明 NPC」化简为「找一条多项式归约」——34.5 的全部实例都照此办理。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: 'Lemma 34.8：若 L₀ ∈ NPC 且 L₀ ≤ₚ L，则 L ∈ NPC（当 L ∈ NP）。', answer: true,
          why: '★ 34.4 原文：由 ≤ₚ 传递，从单一已知 NPC 归约即把全 NP 归约到 L。' },
        { kind: 'judge', q: '用 Lemma 34.8 证明 L 是 NPC，需要从 NP 中每一个语言都归约到 L。', answer: false,
          why: '★ 不需要：只需从「一个」已知 NPC 语言归约过去；传递性自动覆盖全 NP。' },
        { kind: 'single', q: '两步法证 L ∈ NPC，第 2 步（证 NP-hard）不含以下哪一项？',
          options: ['选已知 NPC 语言 L₀', '给多项式时间归约 f', '证 x∈L₀ ⟺ f(x)∈L', '重新证明 P ≠ NP'], answer: 3,
          why: '★ 第 2 步四小步是：选题 / 给 f / 证答案保持 / 证多项式时间；不涉及 P≠NP。' },
        { kind: 'single', q: 'C 程序 part4 中，可满足的 3 子句公式归约出的图最大团是多少？',
          options: ['1', '2', '3（= 子句数）', '9'], answer: 2,
          why: '★ part4 打印「可满足公式（3 子句）→ 归约图的最大团 = 3（= 子句数）」。' },
        { kind: 'judge', q: '归约函数 f 必须把「答案」保持：x∈L₀ 当且仅当 f(x)∈L。', answer: true,
          why: '★ 两步法第 2(c) 步：答案保持是归约成立的必要条件。' },
        { kind: 'simulate', q: 'C 程序 part1 从零求解 SAT（n = 16 变量）最坏要枚举多少个赋值？',
          expect: [65536], placeholder: '例如：1024',
          why: '$2^{16} = 65536$；part1 第 118 行循环上界 `1ULL << NV`。这正是「从零求解」的指数代价，归约法正是为避开它。' },
        { kind: 'judge', q: '若归约算法 F 不是多项式时间，Lemma 34.8 仍然成立。', answer: false,
          why: '★ 两步法第 2(d) 步要求 f 多项式时间计算；否则归约不能保证目标问题的难度结论。' },
      ],
      bookExercises: [
        { id: '34.4-1', page: 1079, star: 0,
          statement: 'Consider the straightforward (nonpolynomial-time) reduction in the proof of Theorem 34.9. Describe a circuit of size n that, when converted to a formula by this method, yields a formula whose size is exponential in n.',
          hint: '门输出 fan-out ≥2 时，同一子公式被多处引用；朴素展开会把共享子公式复制指数多次，使公式规模达指数。' },
        { id: '34.4-2', page: 1080, star: 0,
          statement: 'Show the 3-CNF formula that results upon using the method of Theorem 34.10 on the formula (34.3).',
          hint: '按定理 34.10 的「解析树 + 每节点引入变量 + 每子公式转 3-CNF」步骤，对公式 (34.3) 逐节点写出对应的 3-CNF 子句。' },
        { id: '34.4-3', page: 1080, star: 0,
          statement: 'Professor Jagger proposes to show that SAT ≤ P 3-CNF-SAT by using only the truth-table technique in the proof of Theorem 34.10, and not the other steps. That is, the professor proposes to take the boolean form ula Ω, form a truth table for its variables, derive from the truth table a formula in 3-DNF that is equivalent to :Ω, and then negate and apply DeMorgan’s laws to produce a 3-CNF formula equivalent to Ω. Show that this strategy does not yield a polynomial-time reduction.',
          hint: '真值表有 $2^n$ 行，对 n 个变量是指数的；仅用真值表法无法在多项式时间内构造归约。' },
        { id: '34.4-4', page: 1080, star: 0,
          statement: 'Show that the problem of determining whether a boolean formula is a tautology is complete for co-NP. (Hint: See Exercise 34.3-7.)',
          hint: '重言式 ∈ co-NP；其补（非重言式 = 可满足）与 SAT 归约互证，故对 co-NP 完全（见 34.3-7）。' },
        { id: '34.4-5', page: 1080, star: 0,
          statement: 'Show that the problem of determining the satisfiability of boolean formulas in disjunctive normal form is polynomial-time solvable.',
          hint: 'DNF 可满足当且仅当存在一项其所有文字彼此不冲突（无 $x$ 与 $\\neg x$ 同现）；逐项检查多项式时间。' },
        { id: '34.4-6', page: 1080, star: 0,
          statement: 'Someone gives you a polynomial-time algorithm to decide formula satisfiability. Describe how to use this algorithm to find satisfying assignments in polynomial time.',
          hint: '若 SAT 有多项式时间算法，则因 SAT 是 NPC 且 SAT ≤ₚ 各 NPC 问题，全 NPC 乃至全 NP 都落入 P，即 P = NP。' },
        { id: '34.4-7', page: 1080, star: 0,
          statement: 'Let 2-CNF-SAT be the set of satisfiable boolean formulas in CNF with exactly two literals per clause. Show that 2-CNF-SAT 2 P. Make your algorithm as efficient as possible. (Hint: Observe that x _ y is equivalent to :x ! y . Reduce 2-CNF-SAT to an efficiently solvable problem on a directed graph.)',
          hint: '把 $x\\lor y$ 写成 $\\neg x\\to y$，建蕴含图；2-SAT 可满足 ⟺ 不存在变量 $x$ 使 $x$ 与 $\\neg x$ 在同一强连通分量；SCC 可线性时间求解。' },
      ],
    },
  ],
};
