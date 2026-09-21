/* =============================================================================
 * 第 34 章 34.5 —— 第 s05 关：34.5 NP-complete problems
 *
 * 原文锚点：印刷页 1080–1103（pdf_index 1101–1124）
 *
 * 引述已逐字保留（未改写）；其余段已人工填写完毕。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's05',
  id: 'ch34/s05',
  chapter: 34,
  section: '34.5',
  title: 'NP 完全问题',
  shortTitle: '34.5 NP 完全问题',
  titleEn: 'NP-complete problems',
  source: { printed: [1080, 1103], pdf: [1101, 1124] },
  sourceNote: '本关对应原书 34.5 节（印刷页 1080–1103）。',
  prerequisites: [
    { label: '34.4 NP-completeness proofs', url: '#/ch34/s04' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '具体的 NPC 问题：团 / 独立集 / 顶点覆盖',
      why: '★★ 这一关把两步法落到具体图论问题：CLIQUE 是 NPC（Theorem 34.11），而独立集、顶点覆盖与它两两互补——一个归约全解决。',
      position: '34.5 是本章收口：用 34.4 的方法论证明一连串图论 NPC 问题；CLIQUE、独立集、顶点覆盖的互补关系由 C 程序 part3 实测，3-SAT→CLIQUE 由 part4 实测。下一章（35）继续这套归约。',
      unlocks: [
        { label: '35.1 Polynomial approximation', url: '#/ch35/s01' },
      ],
      mathKit: [
        {title:'Theorem 34.11', body:'团问题（CLIQUE）是 NP 完全的：CLIQUE $\\in\\text{NP}$，且 $\\text{3-CNF-SAT}\\le_P\\text{CLIQUE}$。'},
        {title:'互补关系', body:'对图 $G$：$\\omega(G)=\\alpha(\\bar G)$（最大团 = 补图最大独立集）；最小顶点覆盖 $|VC| = n - \\alpha(G)$。这三条问题彼此多项式归约。'},
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一张随机图里：团、独立集、顶点覆盖是同一枚硬币的三面',
      scene: '给你一张 12 个顶点的随机图，问「最大的全连接小团体」有多大。',
      body: [
        '★ 团（clique）是两两都有边的顶点集；独立集是两两都**没有**边的顶点集；顶点覆盖是「每条边都挨着」的顶点集。听起来三个不同问题，其实是一件事的三种说法。',
        '★★ C 程序 part3 在 n = 12 的随机图上暴力算清：最大团 $\\omega(G) = 3$，最大独立集 $\\alpha(G) = 5$，补图最大独立集 $\\alpha(\\bar G) = 3$，最小顶点覆盖 $= 7$。验证两条互补：$\\omega(G) = \\alpha(\\bar G) = 3$，且 $VC = n - \\alpha = 12 - 5 = 7$。',
        '★★ C 程序 part4 再演示「从公式到图」的归约：可满足的 3 子句公式归约出的图最大团 = **3**（= 子句数）；锁死的不可满足公式归约图最大团 = **1**（< 2）。于是 CLIQUE 与 3-SAT 同样难——Theorem 34.11 的实战版。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1080,
          en: 'Describe how to use this algorithm to find satisfying assignments in polynomial time.',
          zh: '★ 34.5 开篇承接 34.4 的 3-CNF-SAT 归约，转入「如何借助归约在多项式时间内找满足赋值」等方法论。' },
        { kind: 'body', page: 1080,
          en: 'NP-complete problems arise in diverse domains: boolean logic, graphs, arithmetic, network design, sets and partitions, storage and retrieval, sequencing and scheduling, mathematical programming, algebra and number theory, games and puzzles, automata and language theory, program optimization, biology, chemistry, physics, and more. This section uses the reduction methodology to provide NPcompleteness proofs for a variety of problems drawn from graph theory and set partitioning.',
          zh: '★★ NP 完全问题遍布逻辑、图、数论、游戏、生物等几乎所有领域；本节用归约证明一批图论与集合划分问题的 NP 完全性。' },
        { kind: 'body', page: 1081,
          en: 'Figure 34.13 outlines the structure of the NP-completeness proofs in this section and Section 34.4. We prove each language in the figure to be NP-complete by reduction from the language that points to it. At t he root is CIRCUIT-SAT, which we proved NP-complete in Theorem 34.7. This section concludes with a recap of reduction strategies.',
          zh: '★ 图 34.13 画出归约树：每个语言都从「指向它的」已知 NPC 语言归约而来；根是 CIRCUIT-SAT。' },
        { kind: 'body', page: 1081,
          en: 'A clique in an undirected graph G = (V,E) is a subset V 0 ⊆ V of vertices, each pair of which is connected by an edge in E. In other words, a clique is a complete subgraph of G. The size of a clique is the number of vertices it contains. The clique problem is the optimization problem of finding a clique of maximum size in a graph. The corresponding decision problem asks simply whether a clique of a given size k exists in the graph. The formal definition is CLIQUE = fhG,k i W G is a graph containing a clique of size kg :',
          zh: '★★ 团 = 两两有边的顶点子集（完全子图）。CLIQUE 决策问题：图是否含大小为 k 的团。' },
        { kind: 'body', page: 1081,
          en: 'A naive algorithm for determining whether a graph G = (V,E) with |V| vertices contains a clique of size k lists all k-subsets of V and checks each one to see whether it forms a clique. The running time of this algorithm is Ω.k 2 ã |V| k ä',
          zh: '★ 朴素算法枚举所有 k-子集并检查，运行时间 $\\Omega\\!\\left(\\binom{|V|}{k}\\right)$——指数级。' },
        { kind: 'body', page: 1081,
          en: '/, which is polynomial if k is a constant. In general, however, k could be near |V| =2, in which case the algorithm runs in superpolynomial time. In deed, an efficient algorithm for the clique problem is unlikely to exist.',
          zh: '★ 若 k 是常数则多项式；但一般 k 可达 $|V|/2$，于是超多项式——团问题很可能没有高效算法（即 NPC）。' },
      ],
      terms: [
        { en: 'clique', zh: '团（完全子图）', page: 1081 },
        { en: 'vertex cover', zh: '顶点覆盖', page: 1084 },
        { en: 'independent set', zh: '独立集', page: 1099 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 原书 34.5 没有给出伪代码框（归约以散文与图 34.13/34.14/34.15 描述）。
    // 骨架曾误填一段 CNF-SA 占位，此处清空为空阶段以满足九段式顺序。
    {
      type: 'pseudocode',
      title: '本节原书未给出伪代码',
      algo: null,
      signature: '',
      page: 1081,
      lines: [],
      vars: [],
      note: '原书 34.5 用散文与图 34.13–34.15 描述 CLIQUE / VERTEX-COVER 归约；相关暴力与归约见 C 程序 part3/part4。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '归约是多项式的，团 / 覆盖仍是难的',
      panels: [
        { title: '3-SAT → CLIQUE：归约图规模 = 3k（多项式）',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: '3k（归约图顶点数）', expr: '3*n', color: '--viz-compare' },
            { name: '2^k（暴力枚举赋值）', expr: 'Math.pow(2,n)', color: '--viz-done' },
          ] },
          note: '★ part4：k 条子句归约成 3k 顶点图（多项式）；但求解 SAT 仍要枚举 $2^k$。可满足公式 → 团大小 3（= k）。' },
        { title: '团 / 独立集 / 顶点覆盖：暴力都 2^n',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: '2^n（枚举顶点子集）', expr: 'Math.pow(2,n)', color: '--viz-done' },
            { name: 'n^2（多项式下界）', expr: 'n*n', color: '--viz-compare' },
          ] },
          note: '★ part3 实测：ω(G)=3, α(G)=5, α(Ḡ)=3, 最小覆盖=7；三者两两互补，故同样难——都需指数级暴力。' },
      ],
      tasks: ['对照 C 程序 part3/part4：验证 ω(G)=α(Ḡ) 与 VC=n−α；再放 k=3 看归约团大小。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: 'C 程序 c/np.c 的 part3（团/独立集/顶点覆盖互补）与 part4（3-SAT → CLIQUE）把本节两个核心结论跑成真数字。',
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
        { line: 143, zh: '★ part3：w = max_clique(adj, 12) 暴力求最大团（枚举 $2^{12}$ 个顶点子集）。' },
        { line: 148, zh: '★ part3：a = max_indep(adj, 12)，ai = max_indep(g, 12)（g 为补图），vc = min_vc(adj, 12)。' },
        { line: 150, zh: '★★ 互补断言 ω(G) = α(Ḡ)：assert(w == ai)。' },
        { line: 151, zh: '★★ 互补断言 VC = n − α：assert(vc == 12 - a)。' },
        { line: 158, zh: '★ part4：公式 F[3][3]——已知 NPC 的 3-CNF-SAT 实例。' },
        { line: 170, zh: '★ part4：w = max_clique(g, 9) 在被归约出的 9 顶点图上求最大团。' },
        { line: 173, zh: '★★ 可满足 → 最大团 = 3（= 子句数），assert 通过。' },
        { line: 190, zh: '★ 不可满足实例 → 最大团 w2 = 1 < 2，assert 通过。' },
      ],
      tests: [
        { in: 'part3 n=12 随机图', out: 'ω=3, α=5, α(Ḡ)=3, 最小覆盖=7' },
        { in: 'part4 可满足 3 子句公式', out: '归约图最大团 = 3（= 子句数）' },
      ],
      mapping: [
        { pc: 1, pcCode: 'part3：暴力求最大团 / 独立集 / 覆盖', c: '`int w = max_clique(adj, 12);`（第 143 行）' },
        { pc: 2, pcCode: 'part4：选已知 NPC（3-SAT）并归约成图', c: '`int F[3][3] = {{1, -2, 3}, {-1, 2, -3}, {2, 3, -1}};`（第 158 行）' },
        { pc: 3, pcCode: 'part4：答案保持——可满足 ⟺ 团大小 = k', c: '`assert(w == 3);`（第 173 行）' },
      ] },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：团、独立集、覆盖彼此等价地难',
      intro: '这一关要讲清：CLIQUE 是 NPC；团 / 独立集 / 顶点覆盖三者在互补意义下互相归约，难度相同。',
      claims: [
        { expr: '\\text{CLIQUE}\\in NPC', when: 'Theorem 34.11', page: 1082, source: 'book' },
        { expr: '\\omega(G)=\\alpha(\\bar G)', when: '最大团 = 补图最大独立集（part3 实测）', page: 1083, source: 'instructor' },
        { expr: '|VC|=n-\\alpha', when: '顶点覆盖与独立集互补（part3 实测）', page: 1084, source: 'instructor' },
        { expr: '3\\text{-CNF-SAT}\\le_P\\text{CLIQUE}', when: 'Theorem 34.11 的归约（part4 实测）', page: 1082, source: 'book' },
      ],
      tables: [
        { caption: 'C 程序 part3 实测（n = 12 随机图）', rows: [
          ['量', '值', '互补关系'],
          ['最大团 $\\omega(G)$', '3', '$= \\alpha(\\bar G)$'],
          ['最大独立集 $\\alpha(G)$', '5', '—'],
          ['补图最大独立集 $\\alpha(\\bar G)$', '3', '$= \\omega(G)$'],
          ['最小顶点覆盖', '7', '$= 12 - 5 = n - \\alpha$'],
        ] },
        { caption: 'C 程序 part4 实测（3-SAT → CLIQUE）', rows: [
          ['公式实例', '归约图最大团', '是否可满足'],
          ['$(v_1\\lor\\neg v_2\\lor v_3)\\land(\\neg v_1\\lor v_2\\lor\\neg v_3)\\land(v_2\\lor v_3\\lor\\neg v_1)$', '3（= 子句数）', '是'],
          ['$(v_1)\\land(\\neg v_1)$（锁死）', '1（< 2）', '否'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '为何团与独立集互补', steps: [
          { zh: '在补图 $\\bar G$ 中，原图的边变成非边、非边变成边。' },
          { tex: '\\omega(G) = \\max\\{|S|: S\\subseteq V,\\ \\forall u\\neq v\\in S,\\ (u,v)\\in E\\}', zh: '团的定义。' },
          { zh: '在 $\\bar G$ 中，「两两有边」恰好变成「两两无边」= 独立集；故 $\\omega(G)=\\alpha(\\bar G)$。又每条边至少一端在覆盖中，故最小覆盖 $= n - \\alpha(G)$。part3 用 n=12 随机图双重验证了这两条。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: 'Theorem 34.11：团问题是 NP 完全的',
      statement: 'The clique problem is NP-complete.',
      page: 1082,
      intro: '★ 三步：证 CLIQUE ∈ NP（Init）→ 给出 3-CNF-SAT ≤ₚ CLIQUE 的归约（Maint）→ 证答案保持「可满足 ⟺ 有大小为 k 的团」（Term）。',
      steps: [
        { title: '第一步 · 证 CLIQUE ∈ NP',
          en: 'Proof First, we show that CLIQUE 2 NP. For a given graph G = (V,E) , use the set V 0 ⊆ V of vertices in the clique as a certificate for G. To check whether V 0 is a clique in polynomial time, check whether, for each pair u,v 2 V 0 , the edge (u,v) belongs to E.',
          page: 1082,
          body: [
            '★ 证书取「团的顶点集」$V^0\\subseteq V$。',
            '★ 验证只需检查 $\\binom{|V^0|}{2}$ 对边是否都在 $E$ 中，多项式时间，故 CLIQUE $\\in$ NP。',
          ] },
        { title: '第二步 · 给出归约 3-CNF-SAT ≤ₚ CLIQUE',
          en: 'We will construct a graph G such that Ω is satisfiable if and only if G contains a clique of size k.',
          page: 1082,
          body: [
            '★ 归约：对 3-CNF 公式 $\\Omega = C_1\\land\\cdots\\land C_k$，每子句 $C_r$ 的三个文字各成一个顶点。',
            '★ 仅当「不同子句、且文字不互补」时连边；于是图有大小为 k 的团 ⟺ 每子句恰取一真文字 ⟺ $\\Omega$ 可满足。',
          ] },
        { title: '第三步 · 答案保持（团 ⟹ 满足赋值）',
          en: 'Conversely, suppose that G contains a clique V 0 of size k. No edges in G connect vertices in the same triple, and so V 0 contains exactly one vertex per triple. If v r i 2 V 0 , then assign 1 to the corresponding literal l r i . Since G contains no edges between inconsistent literals, no literal and its complement are both assigned 1. Each clause is satisfied, and so Ω is satisfied. (Any variables that do not correspond to a vertex in the clique may be set arbitrarily.)',
          page: 1082,
          body: [
            '★ 若图有大小为 k 的团：因同子句内不连边，团恰含每子句一个顶点。',
            '★ 给这些文字赋 1；图无「互补文字」之间的边，故不会同时赋 1 与 0 给同一变量——每子句满足，$\\Omega$ 可满足。',
            '★★ 结合正向（可满足 ⟹ 有大小为 k 的团）与反向，归约答案保持，故 CLIQUE 是 NP-hard；又 CLIQUE ∈ NP，于是 CLIQUE ∈ NPC。∎',
          ] },
      ],
      conclusion: '★ 结论：CLIQUE ∈ NPC（Theorem 34.11）。再借互补性，独立集、顶点覆盖也依次为 NPC——图论里这一大家族问题「同样难」。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: '团问题（CLIQUE）是 NP 完全的。', answer: true,
          why: '★ Theorem 34.11：CLIQUE ∈ NP 且 3-CNF-SAT ≤ₚ CLIQUE。' },
        { kind: 'judge', q: '对图 G，最大团的大小等于补图最大独立集的大小：ω(G) = α(Ḡ)。', answer: true,
          why: '★ 互补性：在补图中「两两有边」正是原图「两两无边」；part3 实测 ω(G)=3=α(Ḡ)。' },
        { kind: 'single', q: 'C 程序 part3 在 n = 12 随机图上，最小顶点覆盖的大小是多少？',
          options: ['3', '5', '7', '12'], answer: 2,
          why: '★ part3 打印「ω(G)=3, α(G)=5, α(Ḡ)=3, 最小覆盖=7」；且 VC = n − α = 12 − 5 = 7。' },
        { kind: 'single', q: 'C 程序 part4 中，可满足的 3 子句公式归约出的图最大团是多少？',
          options: ['1', '2', '3', '9'], answer: 2,
          why: '★ part4 打印「可满足公式（3 子句）→ 归约图的最大团 = 3（= 子句数）」。' },
        { kind: 'judge', q: '最小顶点覆盖的大小等于 n 减去最大独立集的大小：|VC| = n − α(G)。', answer: true,
          why: '★ 互补性：覆盖取「独立集的补集」即覆盖所有边；part3 实测 7 = 12 − 5。' },
        { kind: 'simulate', q: 'C 程序 part4 中，不可满足公式 (v1)∧(¬v1) 归约出的图，最大团大小是多少？',
          expect: [1], placeholder: '例如：0',
          why: '★ part4 打印「不可满足公式 → 归约图的最大团 = 1 < 2」；因两子句文字互补，无法同时入选团。' },
        { kind: 'judge', q: '3-CNF-SAT ≤ₚ CLIQUE 这条归约保持了答案（可满足 ⟺ 有大小为 k 的团）。', answer: true,
          why: '★ Theorem 34.11 的归约构造保证双向答案保持；part4 用一真一假两个实例双重确认。' },
      ],
      bookExercises: [
        { id: '34.5-1', page: 1098, star: 0,
          statement: 'The subgraph-isomorphism problem takes two undirected graphs G 1 and G 2 , and asks whether G 1 is isomorphic to a subgraph of G 2 . Show that the subgraphisomorphism problem is NP-complete.',
          hint: '两个方向都要：属于 NP（证书是顶点对应表，验证同 34.2-1 的三步）加 NP 难（从 CLIQUE 归约）。归约写法：给定 $\\langle G, k\\rangle$，令 $G_1 = K_k$（$k$ 个点的完全图），$G_2 = G$。则 $G$ 含大小 $k$ 的团 $\\iff$ $G_1$ 同构于 $G_2$ 的某个子图。构造规模：$K_k$ 的边数 $\\binom{k}{2} \\le k^2$，多项式。★ 方向别写反：是「团 $\\iff$ 子图同构」，两边都用「存在单射保持边」这一句话对齐。' },
        { id: '34.5-2', page: 1098, star: 0,
          statement: 'Given an integer m × n matrix A and an integer m-vector b, the 0-1 integerprogramming problem asks whether there exists an integer n-vector x with elements in the set f0,1 g such that Ax ≤ b. Prove that 0-1 integer programming is NP-complete. (Hint: Reduce from 3-CNF-SAT.)',
          hint: '归约自 3-CNF-SAT。变量方向：$x_i$ 对应整数向量里第 $i$ 个分量，要求它 0/1 —— 0-1 整数规划的「$x \\in \\{0,1\\}^n$」正合用。子句方向：一条子句写成**一条**不等式。用 $x_i$ 表示文字 $x_i$、用 $1 - x_i$ 表示 $\\neg x_i$，子句是真 $\\iff$ 这些 0/1 量之和 $\\ge 1$。例：$(x_1 \\vee \\neg x_2 \\vee \\neg x_3) \\iff x_1 + (1 - x_2) + (1 - x_3) \\ge 1$，整理成 $-x_1 + x_2 + x_3 \\le 2$ 这种 $Ax \\le b$ 形状。★ 别忘了把 $0 \\le x_i \\le 1$ 也写成不等式（题干只说元素取自 $\\{0,1\\}$，而本题的输入只有 $A$ 与 $b$，所以整数性加这两条约束就够定 0/1）。' },
        { id: '34.5-3', page: 1098, star: 0,
          statement: 'The integer linear-programming problem is like the 0-1 integer-programming problem given in Exercise 34.5-2, except that the values of the vector x may be any integers rather than just 0 or 1. Assuming that the 0-1 integer-programming problem is NP-hard, show that the integer linear-programming problem is NPcomplete.',
          hint: '两件事分开做：NP 难：0-1 整数规划是它的特例（同一个 $A$、$b$，允许变量取任意整数只会让可行域变大），更准确地说是「0-1 情形加上 $0 \\le x_i \\le 1$ 约束后的实例完全相同」，所以那个归约原封不动搬过来就是 NP-hard。属于 NP：证书是整数向量 $x$，验证 $Ax \\le b$ 逐行做加法乘法，多项式时间；但要补一句「存在解时就有各位都是多项式位长的解」，否则证书本身的编码长度可能是指数的，NP 的成员资格就不成立。★ 这题的分量全在后半句：光写「特例已 NP-hard 所以它也 NP-hard」只完成一半。' },
        { id: '34.5-4', page: 1098, star: 0,
          statement: 'Show how to solve the subset-sum problem in polynomial time if the target value t is expressed in unary.',
          hint: '子集和的动规本来就是 $O(nt)$：$s[i, j]$ = 「前 $i$ 个数能否凑出 $j$」。它不是多项式是因为 $t$ 以**二进制**写时值可以达 $2^{\\text{位数}}$。题设一元表示 ⟹ 输入长度本身 $\\ge t$，于是 $O(nt) \\le O(n \\cdot |输入|)$ 是多项式。★ 答题要写两行：一行给动规与它的 $O(nt)$ 时间，一行说明「一元编码下 $t$ 就是输入规模的一部分」，这才叫「在多项式时间内」。顺手交代答案重建：$s$ 表带前驱标记，回溯即得子集。' },
        { id: '34.5-5', page: 1098, star: 0,
          statement: 'The set-partition problem takes as input a set S of numbers. The question is whether the numbers can be partitioned into two set s A and A = S − A such that P x2A x = P x2 A x . Show that the set-partition problem is NP-complete.',
          hint: '从 SUBSET-SUM 归约：给定 (S, t)，构造新集合 $S^{\\prime} = S \\cup \\{2t - \\sum S\\}$，则存在和为 t 的子集 ⟺ $S^{\\prime}$ 可平分。' },
        { id: '34.5-6', page: 1098, star: 0,
          statement: 'Show that the hamiltonian-path problem is NP-complete.',
          hint: '「加一个与所有顶点相连的新顶点」这个构造**反方向不成立**： 取 $G$ 为路径 $a - b - c$，它没有哈密顿环；加一个全连接点 $s$ 之后 $s, a, b, c$ 就是一条哈密顿路径 （$s \\to a \\to b \\to c$ 边都在），可 $G$ 依然无环 —— 新图只保证存在一条哈密顿路径，封不成环。 正确的归约是把某个顶点 $v$ **拆成两个** $v’$、$v’’$：各继承 $v$ 的一条入边与一条出边， 再问「$v’$ 到 $v’’$ 的哈密顿路径」（HAM-PATH 的两个端点必须指定，这一点也别忘了写）。 环被拆开成路径的两端，两个方向才都对得上。' },
        { id: '34.5-7', page: 1098, star: 0,
          statement: 'The longest-simple-cycle problem is the problem of determining a simple cycle (no repeated vertices) of maximum length in a graph. Formulate a related decision problem, and show that the decision problem is NP-complete.',
          hint: '先给判定版本：$\\langle G, \\ell \\rangle \\in$ LONGEST-SIMPLE-CYCLE $\\iff$ $G$ 里有长度 $\\ge \\ell$ 的简单环。属于 NP：证书是那个环的顶点序列，验证「相邻点有边 + 无重复 + 长度 $\\ge \\ell$」。NP 难：从 HAM-CYCLE 归约，$\\langle G \\rangle \\mapsto \\langle G, |V| \\rangle$。$G$ 有哈密顿环 $\\iff$ $G$ 有长度 $\\ge |V|$ 的简单环（简单环长度至多 $|V|$，等于 $|V|$ 就是覆盖所有点）。构造只是复制图并写上 $|V|$，显然多项式。★ 优化问题是「related decision problem」这一问的答案，别忘了把「用判定 oracle 二分开环长 $\\to$ 最长环」那句也写上一句更完整。' },
        { id: '34.5-8', page: 1099, star: 0,
          statement: 'In the half 3-CNF satisfiability problem, the input is a 3-CNF formula Ω with n variables and m clauses, where m is even. The question is whether there exists a truth assignment to the variables of Ω such that exactly half the clauses evaluate to 0 and exactly half the clauses evaluate to 1. Prove that the half 3-CNF satisfiability problem is NP-complete.',
          hint: '「把公式复制一份、对其中一份整体取反」这条走不通：取反之后每个子句变成「三个文字全假才算 0」，跟原子句的真假并不互补，凑不出「恰好一半为 1」。 正确的证明骨架是两步： ① 属于 NP：证书就是赋值，验证时数一遍为真的子句条数即可。 ② NP 难：从 3-CNF-SAT 归约，把**每个子句换成一小块子句**，块的大小取偶数 $2h$， 并满足三个条件——不管新变元怎么赋值，块内为真的条数**永不超过** $h$； 原子句能被满足时**恰好**能取到 $h$；原子句全假时**取不到** $h$。 于是「整份公式恰有一半为真」被逐块逼成「每块都取到自己的上界」 也就是「每个原子句都被满足」。 注意上界那条不能省：只要某块能超过一半，各块就能互相抵消， 「一半」就不再等价于「全满足」了。 （本轮在「每条子句都是三个不同文字的析取」这个范围内，穷举过「2 条或 4 条一组、含 1~2 个新变元」的所有组合， 没有一组满足上面三条——所以这块要么用更多子句、要么允许文字重复， 别急着交一个两三条的版本。）' },
        { id: '34.5-9', page: 1099, star: 0,
          statement: 'The proof that VERTEX-COVER ≤ PHAM-CYCLE assumes that the graph G given as input to the vertex-cover problem has no isolated vertices. Show how the reduction in the proof can break down if G has an isolated vertex.',
          hint: '题干要的是「归约**在哪个方向**坏掉」，给个小实例最省事。 按 p.1086-1088 的构造，$G’$ 的顶点只有两类：每个子句 gadget 的 12 个顶点， 外加 $k$ 个选择器顶点 $s_1,\\dots,s_k$；**孤立顶点不产生任何 gadget**。 取 $G$ 只有一个孤立顶点 $u$、$k = 1$：$\\{u\\}$ 是大小 1 的点覆盖（yes 实例）， 但造出来的 $G’$ 只有一个孤立的选择器 $s_1$、没有任何 gadget 可串， 哈密顿环根本不存在——「有覆盖 $\\Rightarrow$ 有哈密顿环」这一向直接断掉。 一般地说：证明里把覆盖顶点 $u$ 翻译成「环穿过 $u$ 的那条 gadget 路径」， 而 $u$ 孤立时这条路径是空的，选择器顶点两侧都没有边可走， 环就没法把它「用掉」。 这也正是原文要先去掉孤立顶点的原因：去掉它们不改变点覆盖的最小大小。' },
        { id: '34-1', page: 1099, star: 0,
          statement: 'Independent set An independent set of a graph G = (V,E) is a subset V 0 ⊆ V of vertices such that each edge in E is incident on at most one vertex in V 0 . The independent-set problem is to find a maximum-size independent set in G. a. Formulate a related decision problem for the independent-set problem, and prove that it is NP-complete. (Hint: Reduce from the clique problem.) b. You are given a "black-box" subroutine to solve the decision problem you de- fined in part (a). Give an algorithm to find an independent set of maximum size. The running time of your algorithm should be polynomial in |V| and |E|, counting queries to the black box as a single step. Although the independent-set decision problem is NP-complete, certain special cases are polynomial-time solvable. c. Give an efficient algorithm to solve the independent-set problem when each ver- tex in G has degree 2. Analyze the running time, and prove that your algorithm works correctly. d. Give an efficient algorithm to solve the independent-set problem when G is bipartite. Analyze the running time, and prove that your algorithm works cor- rectly. …',
          hint: '题干有 (a)(b)(c)(d) 四问（(c)(d) 在关卡里被省略号截断，但原题确实有），四问都要给落点。 (a) 判定版：INDEPENDENT-SET $= \\{\\langle G, k \\rangle : G$ 有大小至少 $k$ 的独立集$\\}$。 属于 NP：证书就是那 $k$ 个顶点，逐条边查「两端是否都在集合里」即可。 NP 难直接搬 CLIQUE：$V’$ 在 $G$ 里两两相连 $\\iff$ $V’$ 在补图 $\\bar{G}$ 里互不相邻， 所以归约只做一件事——取补图。 (b) 有判定黑箱就要最大独立集：先对 $k$ 在 $1 \\dots |V|$ 上二分（$O(\\lg n)$ 次调用）定出最大值 $k^{*}$； 再逐个把顶点钉下来——还剩 $r$ 个名额时，对候选 $v$ 问「$G - N[v]$（删掉 $v$ 及它全部邻居）里 有没有大小 $r-1$ 的独立集」，有就把 $v$ 收进答案、在 $G - N[v]$ 上继续找剩下的 $r-1$ 个。 正确性：$v$ 一旦入选，它的邻居就都不能要了，所以在 $G - N[v]$ 上补 $r-1$ 个既是必要也是充分的。 (c) 每个点度数都是 $2$ 时，$G$ 是若干条不相交的链和圈的并。 链上自左向右做两步递推（「取当前点」与「不取当前点」各记一个最优值）就是 $O(n)$； 圈多一步：先猜「第一个点取不取」分别跑两次，取不取的分支会退化成链。 各分量相加即得全局答案，总时间 $O(|V| + |E|)$。 (d) 二部图：用 Kőnig 定理——二部图的最小点覆盖等于最大匹配，而它可以多项式求出（原书没给这条编号定理；能引的是 24.4 的流网络构造、推论 24.11「最大匹配基数 = 对应网络的最大流量」与最大流最小割定理 24.6。★ 24.5 只是「任何流量不超过任何割的容量」那条推论，不是 Kőnig）， 而「独立集」与「点覆盖」互为补集（$S$ 独立 $\\iff$ $V - S$ 覆盖所有边）， 所以最大独立集 $= V - $（最小点覆盖）。跑一遍最大匹配即可，不用另证 NP 完全。' },
        { id: '34-2', page: 1100, star: 0,
          statement: 'Bonnie and Clyde Bonnie and Clyde have just robbed a bank. They have a bag of money and want to divide it up. For each of the following scenario s, either give a polynomial-time algorithm to divide the money or prove that the problem of dividing the money in the manner described is NP-complete. The input in each case is a list of the n items in the bag, along with the value of each. a. The bag contains n coins, but only two different denominations: some coins are worth x dollars, and some are worth y dollars. Bonnie and Clyde wish to divide the money exactly evenly. b. The bag contains n coins, with an arbitrary number of different denominations, but each denomination is a nonnegative exact power of 2, so that the possible denominations are 1 dollar, 2 dollars, 4 dollars, etc. Bonnie and Clyde wish to divide the money exactly evenly. c. The bag contains n checks, which are, in an amazing coincidence, made out to "Bonnie or Clyde." They wish to divide the checks s o that they each get the exact same amount of money. d. The bag contains n checks as in part (c), but this time Bonnie and Cly de are willing to accept a split in which the difference is no larger than 100 dollars.',
          hint: '先把题干读对：这是**分一袋钱**的问题，四个小问各自要「给多项式算法」或「证明 NP 完全」， 跟图上的路径、双人追逐没有半点关系。四问的落点： (a) 只有两种面值 $x$、$y$：设分给 Bonnie $i$ 枚 $x$ 币、$j$ 枚 $y$ 币，要求 $xi + yj = \\frac{1}{2}(x \\cdot n_x + y \\cdot n_y)$，且 $0 \\le i \\le n_x$、$0 \\le j \\le n_y$ 为整数 —— 二元一次丢番图方程，用扩展欧几里得判有无解、有解就枚举可行区间里的那一个，多项式时间。 (b) 面值都是 2 的幂：按位处理（从大到小贪心，或直接把总额看成二进制 —— 每种面值的硬币数就是该位的账）， 多项式时间。 (c) 支票写「Bonnie 或 Clyde」：这就是 **SUBSET-SUM** 换了层皮 ——「给 Bonnie 的那些支票」的和要等于总额一半； 属于 NP（证书是这一子集），把 SUBSET-SUM 的实例原样当作输入即得硬的一面。 (d) 允许差额不超过 100：**仍然 NP 完全**，而且归约就一行技巧 —— 把 (c) 里每张支票的金额都乘 201。这样任意两堆的差额都是 201 的倍数， 「差额 $\\le 100$」只能取 0，于是本题与 (c) 等价（而它是 NP 完全的）。 写 (a)(b) 时记得顺带说明「怎么真的把硬币分下去」，不是只判存在。' },
        { id: '34-3', page: 1100, star: 0,
          statement: 'Graph coloring Mapmakers try to use as few colors as possible when coloring countries on a map, subject to the restriction that if two countries sh are a border, they must have dif- ferent colors. You can model this problem with an undirected graph G = (V,E) in which each vertex represents a country and vertices whose respective countries share a border are adjacent. Then, a k-coloring is a function c W V ! f1,2,…,k g such that c(u) ≠ c(v) for every edge (u,v) 2 E. In other words, the numbers 1,2,…,k represent the k colors, and adjacent vertices must have different col- ors. The graph-coloring problem is to determine the minimum number of colors needed to color a given graph. a. Give an efficient algorithm to determine a 2-coloring of a graph, if one exists. b. Cast the graph-coloring problem as a decision problem. Show that your deci- sion problem is solvable in polynomial time if and only if the graph-coloring problem is solvable in polynomial time. c. Let the language 3-COLOR be the set of graphs that can be 3-colored. Show that if 3-COLOR is NP-complete, then your decision problem from part (b) is NP-complete.',
          hint: '这题只有 (a)(b)(c) 三问，而且 (c) **不要**你自己证 NPC——它只假设 3-COLOR 是 NPC， 让你推出 (b) 的判定问题也是。三问各要的东西： (a) 2-着色就是判二分图：从任一未着色顶点起 BFS/DFS，按到起点的距离奇偶染色； 遇到一条边两端同色就报告「无 2-着色」。$O(V+E)$。 (b) 判定版：GRAPH-COLORING $= \\{\\langle G, k \\rangle : G$ 有 $k$-着色$\\}$。 两个方向都要给：判定版有多项式算法 $\\Rightarrow$ 优化版也有—— 对 $k = 1 \\dots |V|$ 二分查出最小的 $k$，再逐顶点试色（把顶点固定成某色后重新问判定版） 就能把着色本身构造出来；反过来优化版有多项式算法 $\\Rightarrow$ 判定版只要 比一比「$G$ 的最少着色数」与 $k$。 (c) 属于 NP：证书是着色函数，逐边检查 $c(u) \\ne c(v)$。 NP 难：归约就是 $G \\mapsto \\langle G, 3\\rangle$ —— $G \\in$ 3-COLOR $\\iff \\langle G,3\\rangle \\in$ GRAPH-COLORING，显然多项式时间。 所以「3-COLOR 是 NPC」这条假设一给，判定版就跟着是 NPC，不用碰 3-CNF-SAT。' },
        { id: '34-4', page: 1102, star: 0,
          statement: 'Scheduling with profits and deadlines You have one computer and a set of n tasks fa 1 ,a 2 ,…,a n g requiring time on the computer. Each task a j requires t j time units on the computer (its processing time), yields a profit of √j , and has a deadline d j . The computer can process only one task at a time, and task a j must run without interruption for t j consecutive time units. If task a j completes by its deadline d j , you receive a profit √j . If instead task a j completes after its deadline, you receive no profit. As an optimization problem, given the processing times, profits, and deadlines for a set of n tasks, you wish to find a schedule that completes all the tasks and returns the greatest amount of profit. The processing times, profits, and deadlines are all nonnegative numbers. a. State this problem as a decision problem. b. Show that the decision problem is NP-complete. c. Give a polynomial-time algorithm for the decision problem, assuming that all processing times are integers from 1 to n. (Hint: Use dynamic programming.) d. Give a polynomial-time algorithm for the optimization problem, assuming that all processing times are integers from 1 to n.',
          hint: '四问都要答，别只说「是 NPC」。 (a) 判定版：给定 $(t_j, p_j, d_j)$ 和目标 $P$，问是否存在一个调度使 按期完成的任务总收益 $\\ge P$。 (b) 属于 NP：证书就是任务的排列，模拟一遍算出总收益即可。 NP 难用 SUBSET-SUM：给定整数 $s_1,\\dots,s_n$ 和目标 $t$， 造 $n$ 个任务 $t_j = p_j = s_j$、$d_j = t$，再加一个任务 $t_0 = p_0 = t$、$d_0 = 2t$， 取 $P = 2t$。 正向：若有子集和恰为 $t$，先跑这批任务（在 $t$ 时刻前全部完成，收益 $t$）， 再跑 $a_0$（$2t$ 时刻完成，正好赶上 $d_0$），总收益 $2t$。 反向：$a_0$ 至多贡献 $t$，所以要在 $t$ 前完成的那批任务收益至少 $t$； 而这批任务的总处理时间 $\\le t$、收益又等于处理时间，于是只能恰好等于 $t$ —— 那批任务的下标就是一个和为 $t$ 的子集。 (c) 处理时间都是 $1 \\dots n$ 的整数时，总时间至多 $n^2$，可以按时间做 DP： 把任务按截止期升序排，$D[i][\\tau]$ = 只考虑前 $i$ 个任务、总处理时间不超过 $\\tau$ 时 能拿到的最大收益；转移是「不放第 $i$ 个」或「把它排在最后」（仅当 $\\tau \\le d_i$ 时才算收益）。 状态 $O(n^3)$，多项式。 (d) 优化版直接取 $\\max_\\tau D[n][\\tau]$；或者对 $P$ 二分、反复调用 (c)。' },
      ],
    },
  ],
};
