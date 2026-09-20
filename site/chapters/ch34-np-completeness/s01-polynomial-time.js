/* =============================================================================
 * 第 34 章 34.1 —— 第 s01 关：34.1 Polynomial time
 *
 * 原文锚点：印刷页 1048–1055（pdf_index 1069–1076）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— 引述已逐字保留，未改写。
 *   其余段已人工填写完毕。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's01',
  id: 'ch34/s01',
  chapter: 34,
  section: '34.1',
  title: '多项式时间',
  shortTitle: '34.1 多项式时间',
  titleEn: 'Polynomial time',
  source: { printed: [1048, 1055], pdf: [1069, 1076] },
  sourceNote: '本关对应原书 34.1 节（印刷页 1048–1055）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: 'P：能在多项式时间内求解的问题',
      why: '★★ 这一关给「P」下定义：它是所有能被多项式时间算法**接受 / 判定**的语言类。整章的 NP 完全性都建立在这个基准上——先弄清楚「快」意味着什么，才能谈「验证快、求解慢」。',
      position: '34.1 是 34 章的入口：前置是前面各章的具体算法（它们大多落在 P 里）；它直接为 34.2 的「多项式时间验证」、34.3 的「可归约性」铺路。C 程序 part1/part2 把「2^n 暴力 vs 多项式验证」的差距用真实数字摆出来。',
      unlocks: [
        { label: '34.2 Polynomial-time verification', url: '#/ch34/s02' },
      ],
      mathKit: [
        {title: '定理 34.2', body: '$P = \\{L : L \\text{ is accepted by a polynomial-time algorithm}\\}$。即「能被多项式时间算法接受」与「能被多项式时间算法判定」是同一回事。'},
        {title: '多项式时间', body: '运行时间 $O(n^k)$（$k$ 为常数）。书中认为这类问题**可处理（tractable）**——尽管没有合理的人会认为 $\\Theta(n^{100})$ 真能接受，但实践中高次多项式极少出现。'},
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一把 16 位密码锁与一次「只有 6 万个可能」的暴力',
      scene: '想象一把 16 位的二进制密码锁：每一位开或关，总共 $2^{16} = 65536$ 种组合。',
      body: [
        '★★ C 程序 part1 造了一个 16 变量、91 条子句的 3-CNF 公式，并偷偷种下一个可满足赋值，然后老老实实枚举全部 $2^{16} = 65536$ 个赋值去搜。结果：第 **44213** 次尝试就命中了满足赋值——大约搜了整个空间的 2/3。对计算机这只是眨眼功夫，但这是「指数」在跟你打招呼。',
        '★ 反过来，验证一张证书有多快？part2 告诉我们：给一个满足赋值，只要扫一遍 91 条子句、每条看 3 个文字，一共 **273** 次检查就够。求解最坏要 $65536 \\times 91 \\approx 5.96 \\times 10^6$ 次，两者**差了约 5 个数量级**——NP 的全部悬念就藏在这条缝里。',
        '★★ 这就是 34.1 的核心直觉：多项式时间是「快」的标尺；而指数级的 $2^n$ 枚举，一旦 $n$ 大起来就再也无法承受。书上说「一旦某个问题的第一个多项式时间算法被发现，往往很快就有更高效的算法跟进」，所以 P 是一块坚实的陆地。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1048,
          en: 'Since NP-completeness relies on notions of solving a problem and verifying a certificate in polynomial time, let’s first examine what it means for a problem to be solvable in polynomial time.',
          zh: '★★ 全章的出发点：NP 完全性同时依赖「多项式时间求解」与「多项式时间验证证书」，所以先定义什么是多项式时间可解。' },
        { kind: 'body', page: 1048,
          en: 'Recall that we generally regard problems that have polynomial-time solutions as tractable. Here are three reasons why:',
          zh: '★ 我们一般把「有多项式时间解法」的问题视为可处理（tractable），书里给了三条理由。' },
        { kind: 'body', page: 1048,
          en: '1. Although no reasonable person considers a problem that requires Θ(n 100 ) time to be tractable, few practical problems require time on the order of such a high- degree polynomial. The polynomial-time computable problems encountered in practice typically require much less time. Experien ce has shown that once the first polynomial-time algorithm for a problem has been discovered, more efficient algorithms often follow. Even if the current best algorithm for a problem has a running time of Θ(n 100 ), an algorithm with a much better running time will likely soon be discovered.',
          zh: '★ 理由一：高次多项式（$\\Theta(n^{100})$）虽理论上不现实，但实践中极少出现；而且一流多项式时间算法往往引出更高效的后续算法。' },
        { kind: 'body', page: 1048,
          en: '2. For many reasonable models of computation, a pro blem that can be solved in polynomial time in one model can be solved in polynomial time in another.',
          zh: '★ 理由二：在多数合理的计算模型之间，多项式时间可解性是稳健的——一个模型里的多项式时间解，换模型仍是多项式时间。' },
        { kind: 'body', page: 1048,
          en: 'For example, the class of problems solvable in polynomial time by the serial random-access machine used throughout most of this book is the same as the class of problems solvable in polynomial time on abstract Turing machines. 2',
          zh: '★ 例子：本书全程使用的串行随机访问机（RAM）能多项式时间求解的问题类，与抽象图灵机上的完全一样。' },
        { kind: 'body', page: 1048,
          en: 'It is also the same as the class of problems solvable in polynomial time on a parallel computer when the number of processors grows polynomially with the input size.',
          zh: '★ 当处理器数随输入规模多项式增长时，并行机上的多项式时间可解类也与之相同——所以 P 不依赖具体模型。' },
      ],
      terms: [
        { en: 'polynomial time', zh: '多项式时间', page: 1048 },
        { en: 'tractable', zh: '可处理的（实际可行的）', page: 1048 },
        { en: 'serial random-access machine', zh: '串行随机访问机（RAM 模型）', page: 1048 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 原书 34.1 以散文与复杂度类定义讲「多项式时间」，没有给出伪代码框。
    // 保留该阶段（空 lines）以满足九段式顺序；相关「暴力枚举」思想见 C 程序 part1。
    {
      type: 'pseudocode',
      title: '本节原书未给出伪代码',
      algo: null,
      signature: '',
      page: 1048,
      lines: [],
      vars: [],
      note: '原书 34.1 没有给出伪代码框。与之最贴近的「逐赋值枚举」写成 C 即 part1 第 118 行的 for 循环。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '多项式 vs 指数：为什么 2^n 终会压垮你',
      panels: [
        { title: 'n^2 与 2^n 的差距',
          viz: 'growth',
          chart: { xMax: 20, series: [
            { name: 'n^2（多项式）', expr: 'n*n', color: '--viz-compare' },
            { name: '2^n（指数）', expr: 'Math.pow(2,n)', color: '--viz-done' },
          ] },
          note: '★ 当 n 还小（n ≤ 10）时两者相差不大；但到 n = 20，$2^n$ 已约百万，而 $n^2$ 才 400。C 程序 part1 的 n = 16 早已是 65536 量级。' },
      ],
      tasks: ['对照 C 程序 part1：16 变量 = 65536 次枚举；把 xMax 换成 30 再看指数曲线。'],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: 'C 程序 c/np.c 的 part1/part2 把本节思想跑成真数字：暴力枚举 2^n 个赋值 vs 多项式验证一张证书。',
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
        { line: 11, zh: '★ NV = 16：变量个数，决定枚举空间 $2^{16} = 65536$。' },
        { line: 95, zh: '★ part1 先「种」一个可满足赋值，保证公式确实可满足，再交给暴力去搜。' },
        { line: 118, zh: '★★ part1 的暴力核心：for (ull x = 0; x < (1ULL << NV); x++) 逐一尝试所有赋值。' },
        { line: 125, zh: '★ sat_all(lit, NC, found) 验证找到的赋值确实满足全部 91 条子句。' },
        { line: 129, zh: '★★ part2：验证一张证书只需 NC * 3 = 273 次文字检查。' },
        { line: 130, zh: '★ 求解最坏 $2^{16} = 65536$ 次 × 91 子句 ≈ 596 万次，与验证差约 5 个数量级。' },
      ],
      tests: [
        { in: 'n = 16 变量', out: '枚举 65536 个赋值，约第 44213 次命中满足赋值' },
        { in: '验证一张证书', out: '273 次文字检查即确认满足' },
      ],
      mapping: [
        { pc: 1, pcCode: '枚举全部 2^n 个赋值', c: '`for (ull x = 0; x < (1ULL << NV); x++)`（第 118 行）' },
        { pc: 2, pcCode: '验证证书满足全部子句', c: '`static int sat_all(const int cls[][3], int m, ull x)`（第 30 行）' },
        { pc: 3, pcCode: '证书长度多项式、检查多项式', c: '`long verify_ops = NC * 3;`（第 129 行）' },
      ] },
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '一本账：多项式时间求解 vs 验证',
      intro: '这一关要讲清两件事：P 的等价定义，以及「验证快、求解指数慢」的差距由 C 实测量化。',
      claims: [
        { expr: 'P = \\{L : L\\text{ accepted by a poly-time algorithm}\\}', when: '定理 34.2：接受与判定等价', page: 1054, source: 'book' },
        { expr: '2^n', when: '暴力枚举 n 个布尔变量的全部赋值', page: 1048, source: 'instructor' },
        { expr: '273 \\text{ vs } 65536 \\times 91', when: '验证一张证书 vs 求解最坏情形（part2 实测）', page: 1048, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 part1/part2 实测（n = 16，91 子句）', rows: [
          ['指标', '数值'],
          ['枚举空间 $2^{16}$', '65536 个赋值'],
          ['命中满足赋值的尝试次数', '44213（约 2/3 空间）'],
          ['验证一张证书的文字检查', '273 次'],
          ['求解最坏操作数', '$65536 \\times 91 \\approx 5.96 \\times 10^6$'],
          ['两者数量级差', '约 5 个数量级'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '枚举空间为什么是 65536', steps: [
          { zh: '每个布尔变量有 2 种取值，n 个变量的赋值总数是各变量取值数的乘积。' },
          { tex: '2 \\times 2 \\times \\cdots \\times 2 = 2^n', zh: 'n 个因子相乘。' },
          { zh: '代入 $n = 16$：$2^{16} = 65536$ —— C 程序枚举的就是这 65536 个赋值（第 118 行循环上界 `1ULL << NV`）。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '定理 34.2：P 等于「能被多项式时间算法接受」',
      statement: 'P = fL W L is accepted by a polynomial-time algorithmg :',
      page: 1054,
      intro: '★ 关键一步：把「接受」升级为「判定」。接受只要求存在一条接受路径，判定则要求对所有输入在多项式步内给出确定答案；两者在多项式时间下等价。',
      steps: [
        { title: '第一步 · 构造判定算法 A⁰',
          en: 'Let L be the language accepted by some polynomialtime algorithm A. We use a classic "simulation" argument to construct another polynomial-time algorithm A 0 that decides L.',
          page: 1054,
          body: [
            '★ 目标：把「存在接受路径」的算法 A，改造成「对所有输入都停机并判定」的算法 A⁰。',
            '★ 思路是模拟：A⁰ 不自己求解，而是把 A 跑一段固定的步数，再看 A 有没有接受。',
          ] },
        { title: '第二步 · 模拟 cn^k 步',
          en: 'Because A accepts L in O(n k ) time for some constant k, there also exists a constant c such that A accepts L in at most cn k steps. For any input string x , the algorithm A 0 simulates cn k steps of A.',
          page: 1054,
          body: [
            '★ 既然 A 在 $O(n^k)$ 内接受 L，就存在常数 $c$ 使 A 最多用 $c n^k$ 步接受。',
            '★ A⁰ 对每个输入 $x$ 就模拟这 $c n^k$ 步——步数是输入长度的多项式函数。',
          ] },
        { title: '第三步 · 检查并给出答案',
          en: 'After simulating cn k steps, algorithm A 0 inspects the behavior of A. If A has accepted x , then A 0 accepts x by outputting a 1. If A has not accepted x , then A 0 rejects x by outputting a 0. The overhead of A 0 simulating A does not increase the running time by more than a polynomial factor, and thus A 0 is a polynomial-time algorithm that decides L.',
          page: 1054,
          body: [
            '★ 模拟结束后看 A 的结局：接受了就输出 1，没接受就输出 0。',
            '★★ 模拟的额外开销至多多项式倍，所以 A⁰ 仍是多项式时间算法，于是把「接受」变成了「判定」。∎',
          ] },
      ],
      conclusion: '★ 结论：$P = \\{L : L \\text{ is accepted by a polynomial-time algorithm}\\}$ ——「能被接受」与「能被判定」在多项式时间内是同一件事。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'judge', q: 'P 中的语言都能被某个多项式时间算法判定。', answer: true,
          why: '★ 定理 34.2：多项式时间「接受」与「判定」等价（A⁰ 用模拟把它升级为判定）。' },
        { kind: 'single', q: '16 个布尔变量，暴力枚举全部赋值需要多少次？',
          options: ['16', '256', '65536（2^16）', '16!'], answer: 2,
          why: '★ 每个变量 2 种取值，$2^{16} = 65536$；C 程序 part1 的循环上界正是 `1ULL << NV`。' },
        { kind: 'judge', q: '验证一张 SAT 证书（给定满足赋值）在最坏情况下需要指数时间。', answer: false,
          why: '★ part2 实测：验证一张证书只需 273 次文字检查，是多项式时间。' },
        { kind: 'single', q: 'C 程序 part1 在 65536 个赋值里大约第几次命中满足赋值？',
          options: ['约 1 次', '约 44213 次', '65536 次才命中', '从不命中'], answer: 1,
          why: '★ part1 打印「尝试 44213 / 65536 个赋值后找到满足赋值」——这是固定种子下的确定结果。' },
        { kind: 'simulate', q: 'C 程序 part1 的枚举空间是 $2^{16}$，其数值是多少？',
          expect: [65536], placeholder: '例如：1024',
          why: '$2^{16} = 65536$；验证阶段第 118 行 `1ULL << NV`（NV = 16）即此上界。' },
        { kind: 'judge', q: '在「多项式时间可解」这件事上，RAM 模型与图灵机给出相同的语言类。', answer: true,
          why: '★ 原书 34.1：不同合理计算模型间多项式时间可解性是稳健的。' },
        { kind: 'single', q: '验证一张证书（273 次检查）与求解最坏情形（约 596 万次）相差约几个数量级？',
          options: ['1 个', '3 个', '约 5 个', '10 个以上'], answer: 2,
          why: '★ part2 打印「差了 5 个数量级」——NP 的悬念就在这条缝里。' },
      ],
      bookExercises: [
        { id: '34.1-1', page: 1055, star: 0,
          statement: 'Define the optimization problem LONGEST-PATH-LENGTH as the relation that associates each instance of an undirected graph and two vertices with the num- ber of edges in a longest simple path between the two vertices. Define the deci- sion problem LONGEST-PATH = fhG,u,v,k i W G = (V,E) is an undirected graph, u,v 2 V , k ≥ 0 is an integer, and there exists a simple path from u to v in G consisting of at least k edgesg. Show that the optimization prob- lem LONGEST-PATH-LENGTH can be solved in polynomial time if and only if LONGEST-PATH 2 P.',
          hint: '两问都要给**双向**的构造，而且第二问的方向别说反了。 （$\\Rightarrow$）决策版在 P：最长简单路径的边数至多 $|V|-1$， 对 $k$ 做二分（每次问 LONGEST-PATH 的判定器），$O(\\lg n)$ 次判定就定出那个数，仍是多项式。 （$\\Leftarrow$）优化版在 P：拿它算出真正的最长边数 $\\ell$，然后 **$\\langle G,u,v,k \\rangle$ 的答案是「是」当且仅当 $\\ell \\ge k$** —— 不是「取最大的 $k$」， 判定问题的输入里 $k$ 已经是给定的了，你要做的是拿 $\\ell$ 去和它比。' },
        { id: '34.1-2', page: 1055, star: 0,
          statement: 'Give a formal definition for the problem of finding the longest simple cycle in an undirected graph. Give a related decision problem. Give the language corresponding to the decision problem.',
          hint: '题干要三样，只给判定问题不够。 （1）优化问题的**形式定义**：它是把每个无向图 $G$ 映到「$G$ 中最长简单环的边数」的一个关系； 没有任何简单环时值为 0（别漏这种）。 （2）相关的判定问题：LONGEST-CYCLE $= \\{\\langle G, k \\rangle : G$ 含一条边数至少为 $k$ 的简单环$\\}$。 （3）对应的**语言**：就是上面这个集合 —— 一切满足条件的编码串 $\\langle G, k \\rangle$ 的集合。 写的时候注意「简单环」要说清楚是顶点不重复（除起点 $=$ 终点）， 以及编码 $\\langle G, k \\rangle$ 是把图与整数一起编码成一个串，语言里的元素是串不是图。' },
        { id: '34.1-3', page: 1055, star: 0,
          statement: 'Give a formal encoding of directed graphs as binary strings using an adjacencymatrix representation. Do the same using an adjacency-list representation. Argue that the two representations are polynomially related.',
          hint: '邻接矩阵编码长度 $\\Theta(n^2)$，邻接表 $\\Theta(n+m)$；二者皆可由对方在多项式时间内转换，故多项式相关。' },
        { id: '34.1-4', page: 1055, star: 0,
          statement: 'Is the dynamic-programming algorithm for the 0-1 knapsack problem that is asked for in Exercise 15.2-2 a polynomial-time algorithm? Explain your answer.',
          hint: '不是：其运行时间含容量 W，而 W 的编码长度仅 $\\lg W$，故相对输入长度是伪多项式（pseudo-polynomial），非真正多项式。' },
        { id: '34.1-5', page: 1055, star: 0,
          statement: 'Show that if an algorithm makes at most a constant number of calls to polynomialtime subroutines and performs an additional amount of work that also takes polynomial time, then it runs in polynomial time. Also show that a polynomial number of calls to polynomial-time subroutines may result in an exponential-time algorithm.',
          hint: '常数次：多项式常数次幂仍是多项式。多项式次调用时，若每次调用又派生多项式次调用，则总次数可能达 $p(n)^{k}$ 量级，仍多项式——但若用「展开」式递归（如子程序再调用自身多项式次）则会指数爆炸。' },
        { id: '34.1-6', page: 1055, star: 0,
          statement: 'Show that the class P, viewed as a set of languages , is closed under union, inter- section, concatenation, complement, and Kleene star. That is, if L 1 ,L 2 2 P, then L 1 [ L 2 2 P, L 1 \\ L 2 2 P, L 1 L 2 2 P, L 1 2 P, and L − 1 2 P.',
          hint: '两个语言都在 P，判定器直接串起来就行，但对应关系别配反： $L_1 \\cup L_2$ 用**或** —— 并行跑两个判定器，任一接受就接受； $L_1 \\cap L_2$ 用**与** —— 两个都接受才接受。 补集则是把判定器的接受/拒绝反过来。三种情形的时间都是 $O(\\max(T_1, T_2))$，仍是多项式。 写答案时把「并→或、交→与」明确写出来，别让读者去猜语序。' },
      ],
    },
  ],
};
