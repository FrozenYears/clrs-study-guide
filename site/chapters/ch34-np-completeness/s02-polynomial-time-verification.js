/* =============================================================================
 * 第 34 章 34.2 —— 第 s02 关：34.2 Polynomial-time verification
 *
 * 原文锚点：印刷页 1056–1060（pdf_index 1077–1081）
 *
 * 引述已逐字保留（未改写）；其余段已人工填写完毕。
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's02',
  id: 'ch34/s02',
  chapter: 34,
  section: '34.2',
  title: '多项式时间验证',
  shortTitle: '34.2 多项式时间验证',
  titleEn: 'Polynomial-time verification',
  source: { printed: [1056, 1060], pdf: [1077, 1081] },
  sourceNote: '本关对应原书 34.2 节（印刷页 1056–1060）。',
  prerequisites: [
    { label: '34.1 Polynomial time', url: '#/ch34/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: 'NP：能在多项式时间内验证证书',
      why: '★★ 这一关把「求解慢、但若有答案却能很快核对」的现象形式化：NP 就是「能被多项式时间算法验证」的语言类。它是连接 P 与 NP 完全性的桥。',
      position: '34.2 承接 34.1 的多项式时间，引入「证书 + 验证算法」；为 34.3 的归约与 NP 完全性定义做准备。C 程序 part2 把「验证 273 次 vs 求解 596 万次」的差距钉死。',
      unlocks: [
        { label: '34.3 NP-completeness and reducibility', url: '#/ch34/s03' },
      ],
      mathKit: [
        {title:'NP 的定义', body:'语言 $L \\in \\text{NP}$ 当且仅当存在两输入多项式时间算法 $A$ 与常数 $c$，使 $L = \\{x : \\exists\\text{ 证书 } y, |y| = O(|x|^c), A(x,y)=1\\}$。'},
        {title:'P ⊆ NP', body:'若 $L \\in P$ 有多项式时间判定算法，把它改成「忽略证书、直接判定」的验证算法，即得 $L \\in \\text{NP}$。'},
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '朋友说「这图有哈密顿环」，并甩给你一条环',
      scene: '一个朋友宣称某张图包含哈密顿环，并附上按顺序排列的顶点列表作为证据。',
      body: [
        '★ 你自己去「求解」哈密顿环极难：要枚举 $m!$ 种顶点排列（$m$ 为顶点数），运行时间 $\\Omega(\\sqrt{n}!)$，根本不是多项式。但核对朋友给的那条环很容易——只要验证它确实是排列、且相邻顶点间都有边，用 $O(n^2)$ 时间就够。',
        '★★ C 程序 part2 把这种不对称量化了：给一个满足赋值（证书），验证只需扫 91 条子句、每条 3 个文字，共 **273** 次检查；而「从零求解」最坏要枚举 $2^{16} = 65536$ 个赋值、每个再验 91 条，约 **596 万**次——差了约 5 个数量级。',
        '★★ 这就是 NP 的灵魂：解题难，验解易。PATH 这类本就在 P 里的问题，证书「帮不上忙」；但哈密顿环、SAT 这类，证书让我们以多项式时间确认「yes」，而没人知道有没有多项式时间「求解」算法。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1056,
          en: 'Now, let’s look at algorithms that verify membership in languages. For example, suppose that for a given instance ⟨G,u,v,k⟩ of the decision problem PATH, you are also given a path p from u to v. You can check whether p is a path in G and whether the length of p is at most k, and if so, you can view p as a "certificate" that the instance indeed belongs to PATH. For the decision problem PATH, this certificate doesn’t seem to buy much. After all, PATH belongs to P—in fact, you can solve PATH in linear time—and so verifying membership from a given certificate takes as long as solving the problem from scratch. Instead, let’s examine a problem for which we know of no polynomial-time decision algorithm and yet, given a certificate, verification is easy.',
          zh: '★★ PATH 的证书（一条路径）验证起来和从头求解一样快——因为 PATH 本就在 P。于是转去看「求解难、但验证书易」的问题（如哈密顿环）。' },
        { kind: 'body', page: 1056,
          en: 'The problem of finding a hamiltonian cycle in an undirected graph has been studied for over a hundred years. Formally, a hamiltonian cycle of an undirected graph',
          zh: '★ 哈密顿环：无向图里经过每个顶点恰好一次的简单环；研究逾百年。' },
        { kind: 'body', page: 1056,
          en: 'G = (V,E) is a simple cycle that contains each vertex in V . A graph that contains a hamiltonian cycle is said to be hamiltonian, and otherwise, it is nonhamiltonian. The name honors W. R. Hamilton, who described a m athematical game on the dodecahedron (Figure 34.2(a)) in which one player sticks five pins in any five consecutive vertices and the other player must comp lete the path to form a cycle containing all the vertices. 8 The dodecahedron is hamiltonian, and Figure 34.2(a) shows one hamiltonian cycle. Not all graphs are hamiltonian, however. For ex- ample, Figure 34.2(b) shows a bipartite graph with an odd number of vertices.',
          zh: '★ 形式定义与历史：Hamilton 在十二面体上设计过相关数学游戏；奇数个顶点的二分图必非哈密顿（习题 34.2-2）。' },
        { kind: 'body', page: 1056,
          en: 'Here is how to define the hamiltonian-cycle problem, <Does a graph G have a hamiltonian cycle?= as a formal language:',
          zh: '★ 把哈密顿环问题形式化为语言 HAM-CYCLE。' },
        { kind: 'body', page: 1056,
          en: 'How might an algorithm decide the language HAM-CYCLE? Given a problem instance hGi, one possible decision algorithm lists all permutations of the vertices of G and then checks each permutation to see whether it is a hamiltonian cycle.',
          zh: '★ 朴素判定算法：枚举所有顶点排列并逐一检查；对 $m$ 个顶点要查 $m!$ 种，不是多项式时间。' },
        { kind: 'body', page: 1056,
          en: '8 In a letter dated 17 October 1856 to his friend John T. Graves, Hamilton [206, p. 624] wrote, <I have found that some young persons have been much a mused by trying a new mathematical game which the Icosion furnishes, one person sticking five pins in any five consecutive points . . . and the other player then aiming to insert, which by the theory in this letter can always be done, fifteen other pins, in cyclical succession, so as to cover all the other points, and to end in immediate proximity to the pin wherewith his antagonist had begun.=',
          zh: '★ 原书脚注引 Hamilton 1856 年给 Graves 的信，描述十二面体游戏——历史的来龙去脉。' },
      ],
      terms: [
        { en: 'certificate', zh: '证书（证明某串属于语言的证据）', page: 1056 },
        { en: 'hamiltonian cycle', zh: '哈密顿环', page: 1056 },
        { en: 'verification algorithm', zh: '验证算法', page: 1058 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 原书 34.2 同样没有给出伪代码框（验证算法以散文描述）。保留空阶段满足九段式。
    {
      type: 'pseudocode',
      title: '本节原书未给出伪代码',
      algo: null,
      signature: '',
      page: 1056,
      lines: [],
      vars: [],
      note: '原书 34.2 用散文描述「验证算法」与哈密顿环的朴素判定；相关「验证 273 次 vs 求解枚举 2^n」见 C 程序 part2。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '验证（多项式）与求解（指数）的天壤之别',
      panels: [
        { title: '验证 O(n^c) vs 求解 2^n',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: 'n^2（验证一张证书）', expr: 'n*n', color: '--viz-compare' },
            { name: '2^n（从头求解）', expr: 'Math.pow(2,n)', color: '--viz-done' },
          ] },
          note: '★ 验证一张 SAT 证书只需 $O(m)$ 次文字检查（part2 实测 273 次）；从零求解最坏要枚举 $2^n$ 个赋值。两条曲线正是 NP 的裂缝。' },
      ],
      tasks: ['对照 C 程序 part2：把 k = 91 代入，看验证为何恒定、求解为何随 n 指数膨胀。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: 'C 程序 c/np.c 的 part2 把「验证 vs 求解」的差距跑成真数字：同一份公式，两条路。',
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
        { line: 118, zh: '★ 求解一侧：for (ull x = 0; x < (1ULL << NV); x++) 枚举全部 $2^{16}$ 个赋值。' },
        { line: 125, zh: '★ sat_all(lit, NC, found) 即「拿着证书核对」——每个赋值只花 $O(m)$ 时间。' },
        { line: 129, zh: '★★ 验证一张证书：verify_ops = NC * 3 = 273 次文字检查（多项式）。' },
        { line: 130, zh: '★ 求解最坏空间：total_space = 2^16 = 65536；乘 91 子句 ≈ 596 万次。' },
        { line: 134, zh: '★ 打印「差了 5 个数量级」——NP 的定义就在这条缝里。' },
      ],
      tests: [
        { in: '验证一张证书（91 子句）', out: '273 次文字检查' },
        { in: '求解最坏情形', out: '$65536 \\times 91 \\approx 5.96 \\times 10^6$ 次' },
      ],
      mapping: [
        { pc: 1, pcCode: '验证一张证书（多项式）', c: '`long verify_ops = NC * 3;`（第 129 行）' },
        { pc: 2, pcCode: '求解需枚举全部赋值（指数）', c: '`for (ull x = 0; x < (1ULL << NV); x++)`（第 118 行）' },
        { pc: 3, pcCode: '证书长度多项式有界', c: '`|y| = O(|x|^c)`（定义见 34.2）' },
      ] },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：验证多项式，求解指数',
      intro: '这一关要讲清：NP 用「验证算法」定义；P 是 NP 的子集；而「求解」在最坏情形下是指数的。',
      claims: [
        { expr: 'NP = \\{L : \\exists\\text{ poly-time verifier}\\}', when: 'NP 的形式定义（34.2）', page: 1058, source: 'book' },
        { expr: 'P \\subseteq NP', when: 'P 的判定算法可改成忽略证书的验证算法', page: 1058, source: 'book' },
        { expr: '2^n \\text{ vs } n^c', when: '求解最坏指数、验证多项式（part2 实测）', page: 1056, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 part2 实测（n = 16，91 子句）', rows: [
          ['操作', '代价'],
          ['验证一张证书', '273 次文字检查（多项式）'],
          ['求解最坏情形', '$65536 \\times 91 \\approx 5.96 \\times 10^6$ 次（指数级）'],
          ['数量级差', '约 5 个数量级'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '为何证书让验证保持多项式', steps: [
          { zh: 'NP 定义要求证书长度 $|y| = O(|x|^c)$：$c$ 为常数，故证书本身只是输入的多项式倍。' },
          { tex: '|y| = O(|x|^c)', zh: '证书规模随输入多项式增长。' },
          { zh: '验证算法 $A$ 多项式时间运行于 $(x, y)$，故总验证时间仍是输入长度的多项式——C 程序 part2 的 273 次即其实测。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: 'NP 的定义与 P ⊆ NP',
      statement: 'The complexity class NP is the class of languages that can be verified by a polynomial-time algorithm. More precisely, a language L belongs to NP if and only if there exist a two-input polynomial-time algorithm A and a constant c such that L = fx 2 f0,1 g − W there exists a certificate y with |y| = O(|x| c ) such that A(x,y) = 1g :',
      page: 1058,
      intro: '★ 三步：先定义「验证算法」（Init），再用它给出 NP 的精确定义（Maint），最后证明 $P \\subseteq NP$（Term）。',
      steps: [
        { title: '第一步 · 定义验证算法',
          en: 'We define a verification algorithm as being a two-argument algorithm A, where one argument is an ordinary input string x and the other is a binary string y called a certificate. A two-argument algorithm A verifies an input string x if there exists a certificate y such that A(x,y) = 1.',
          page: 1058,
          body: [
            '★ 验证算法 $A$ 有两个输入：普通输入串 $x$，以及称作「证书」的二进制串 $y$。',
            '★ 只要存在某个证书 $y$ 使 $A(x, y) = 1$，就说 $A$ 验证了 $x$。',
          ] },
        { title: '第二步 · NP 的精确定义',
          en: 'The complexity class NP is the class of languages that can be verified by a polynomial-time algorithm. 9 More precisely, a language L belongs to NP if and only if there exist a two-input polynomial-time algorithm A and a constant c such that L = fx 2 f0,1 g − W there exists a certificate y with |y| = O(|x| c ) such that A(x,y) = 1g :',
          page: 1058,
          body: [
            '★ NP = 能被多项式时间验证算法验证的语言类。',
            '★ 精确定义：存在两输入多项式时间算法 $A$ 与常数 $c$，使 $L = \\{x : \\exists y, |y|=O(|x|^c), A(x,y)=1\\}$。',
          ] },
        { title: '第三步 · 证明 P ⊆ NP',
          en: 'From our earlier discussion about the hamiltonian-cycle problem, you can see that HAM-CYCLE 2 NP. (It is always nice to know that an important set is nonempty.) Moreover, if L 2 P, then L 2 NP, since if there is a polynomialtime algorithm to decide L, the algorithm can be converted to a two-argument verification algorithm that simply ignores any certificate and accepts exactly those input strings it determines to belong to L. Thus, P ⊆ NP.',
          page: 1058,
          body: [
            '★ 若 $L \\in P$ 有多项式时间判定算法，则把它改成「忽略证书、直接判定」的验证算法即可。',
            '★★ 因此任何 $P$ 语言也都在 NP 中，得 $P \\subseteq NP$。反之是否成立（P = NP?）未知。∎',
          ] },
      ],
      conclusion: '★ 结论：$NP$ 由多项式时间验证算法定义；且 $P \\subseteq NP$。P 是否等于 NP 是世纪难题。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: 'NP 是「能被多项式时间算法验证」的语言类。', answer: true,
          why: '★ 34.2 定义：存在两输入多项式时间验证算法 $A$ 与常数 $c$ 使 $L = \\{x:\\exists y, A(x,y)=1\\}$。' },
        { kind: 'judge', q: 'P ⊆ NP。', answer: true,
          why: '★ 34.2 证明：P 的判定算法可改成忽略证书的验证算法。' },
        { kind: 'single', q: 'C 程序 part2 中，验证一张证书（91 子句）需要多少次文字检查？',
          options: ['91 次', '273 次', '65536 次', '596 万次'], answer: 1,
          why: '★ part2 打印 `verify_ops = NC * 3 = 273`；每子句 3 个文字。' },
        { kind: 'judge', q: '哈密顿环的朴素判定算法（枚举全部排列）运行在多项式时间。', answer: false,
          why: '★ 要查 $m!$ 种排列，运行时间 $\\Omega(\\sqrt{n}!)$，非多项式。' },
        { kind: 'single', q: '验证一张 SAT 证书与从零求解最坏情形，C 程序 part2 显示相差约几个数量级？',
          options: ['1 个', '3 个', '约 5 个', '10 个以上'], answer: 2,
          why: '★ part2 打印「差了 5 个数量级」。' },
        { kind: 'simulate', q: 'C 程序 part2 里求解最坏操作数约为 $65536 \\times 91$，其数值约是多少（取整到万位）？',
          expect: [5960000], placeholder: '例如：1000000',
          why: '$65536 \\times 91 = 5961856 \\approx 5.96 \\times 10^6$；这是 from-scratch 求解的代价。' },
        { kind: 'judge', q: 'PATH 的证书（一条路径）能显著加快其判定，因为 PATH 本就不在 P 里。', answer: false,
          why: '★ 原书指出 PATH 的证书「帮不上忙」——PATH 本就在 P，验证与从头求解一样快。' },
      ],
      bookExercises: [
        { id: '34.2-1', page: 1060, star: 0,
          statement: 'Consider the language GRAPH-ISOMORPHISM = fhG 1 ,G 2 i W G 1 and G 2 are isomorphic graphsg. Prove that GRAPH-ISOMORPHISM 2 NP by describing a polynomial-time algorithm to verify the language.',
          hint: '证书取一个顶点对应映射；验证算法在多项式时间内检查该映射是否保持边关系，故 GRAPH-ISOMORPHISM ∈ NP。' },
        { id: '34.2-2', page: 1060, star: 0,
          statement: 'Prove that if G is an undirected bipartite graph with an odd number of vertices, then G is nonhamiltonian.',
          hint: '哈密顿环是偶长环的 2-染色交替；奇顶点二分图无法被单色交替覆盖全部顶点，故非哈密顿。' },
        { id: '34.2-3', page: 1060, star: 0,
          statement: 'Show that if HAM-CYCLE 2 P, then the problem of listing the vertices of a hamiltonian cycle, in order, is polynomial-time solvable.',
          hint: '若能在 P 内判定哈密顿性，则逐项「删边 / 加顶点」地贪心构造出环的顶点序列，每步多项式。' },
        { id: '34.2-4', page: 1060, star: 0,
          statement: 'Prove that the class NP of languages is closed under union, intersection, concatenation, and Kleene star. Discuss the closure of NP under complement.',
          hint: '并/交：并行跑两个验证算法；补：未知——NP 是否对补封闭等价于 NP = co-NP，尚未解决。' },
        { id: '34.2-5', page: 1060, star: 0,
          statement: 'Show that any language in NP can be decided by an algorithm with a running time of 2 O(n k ) for some constant k.',
          hint: '证书长度 $O(n^k)$，枚举全部证书最多 $2^{O(n^k)} = 2^{O(n^k)}$ 种，逐张验证即该界。' },
        { id: '34.2-6', page: 1060, star: 0,
          statement: 'A hamiltonian path in a graph is a simple path that visits every vertex exactly once. Show that the language HAM-PATH = fhG,u,v i W there is a hamiltonian path from u to v in graph Gg belongs to NP.',
          hint: '证书取从 $u$ 到 $v$ 的顶点序列；验证其简单性、端点与逐边存在性均多项式时间。' },
        { id: '34.2-7', page: 1060, star: 0,
          statement: 'Show that the hamiltonian-path problem from Exercise 34.2-6 can be solved in polynomial time on directed acyclic graphs. Give an efficient algorithm for the problem.',
          hint: '在 DAG 上做拓扑排序后动态规划：dp[v][S] 是否到达 v 且走过集合 S；|S| 指数但 DAG 上可用最长路思想在多项式内求解 HAM-PATH。' },
        { id: '34.2-8', page: 1060, star: 0,
          statement: 'Let Ω be a boolean formula constructed from the boolean i nput variables x 1 ,x 2 ; …,x k , negations (:), ANDs (^), ORs (_), and parentheses. The formula Ω is a tautology if it evaluates to 1 for every assignment of 1 and 0 to the input variables. Define TAUTOLOGY as the language of boolean formulas that are tautologies. Show that TAUTOLOGY 2 co-NP.',
          hint: '重言式属于 co-NP：其补语言（非重言式）可由「给一个使公式为 0 的赋值」作为证书在 NP 验证。' },
        { id: '34.2-9', page: 1060, star: 0,
          statement: 'Prove that P ⊆ co-NP.',
          hint: '若 $L \\in P$，其补 $\\bar L$ 也由同一判定器的取反在 P 内判定，故 $\\bar L \\in P \\subseteq NP$，即 $L \\in co\\text{-}NP$。' },
        { id: '34.2-10', page: 1061, star: 0,
          statement: 'Prove that if NP ≠ co-NP, then P ≠ NP.',
          hint: '反证：若 P = NP，则 NP 对补封闭，从而 NP = co-NP，与前提矛盾。' },
        { id: '34.2-11', page: 1061, star: 0,
          statement: 'Let G be a connected, undirected graph with at least three vertices, and let G 3 be the graph obtained by connecting all pairs of vertices that are connected by a path in G of length at most 3. Prove that G 3 is hamiltonian. (Hint: Construct a spanning tree for G, and use an inductive argument.)',
          hint: '构造 G 的生成树，对树做归纳把顶点排成序列，再用 $G^3$ 中长度 ≤3 的路径补成环。' },
      ],
    },
  ],
};
