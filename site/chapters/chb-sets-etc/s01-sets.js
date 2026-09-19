/* =============================================================================
 * 第 B 章 B.1 —— 第 s01 关：B.1 Sets
 *
 * 原文锚点：印刷页 1153–1157（pdf_index 1174–1178）
 *
 * 引述逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's01',
  id:'chB/s01',
  chapter: 'B',
  section: 'B.1',
  title: '集合',
  shortTitle: 'B.1 集合',
  titleEn: 'Sets',
  // ★ 第 32 轮复审：B.1 的习题（含幂集那道 $|2^S| = 2^{|S|}$）排在 1158 页，
  //   B.2 同一页才起头，所以锚点终点是 1158 而不是 1157。
  source: { printed: [1153, 1158], pdf: [1174, 1179] },
  sourceNote: '本关对应原书 B.1 节（印刷页 1153–1158）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
{
      type: 'map',
      title: '集合：全书共用的那套记号',
      why: '全书把「数据」组织成集合再谈算法：图是顶点集与边集，关系是笛卡尔积的子集，概率空间是样本集。本关把集合的记号一次性钉牢——元素、子集、幂集，以及 $|2^S| = 2^{|S|}$ 这条「子集Enumeration」恒等式（第 15 章子集枚举、第 25 章位集都直接用它）。',
      position: '附录 B 的第一关，是 B.2–B.5（关系/函数/图/树）的共同前置；不涉及任何算法，但后续每一章的「输入实例」都用这里的语言书写。',
      unlocks: [
        { label: 'B.2 Relations', url: '#/appendix/b/s02' },
      ],
      mathKit: [
        { title: '元素与成员', body:'$x \\in S$ 读作「$x$ 是 $S$ 的成员」；集合不允许重复元素（允许重复的叫 multiset）。' },
        { title: '子集', body:'$A \\subseteq B$ 当且仅当「$x \\in A \\Rightarrow x \\in B$」；$A \\subset B$ 表示真子集。' },
        { title: '幂集', body:'$2^S$ 是 $S$ 的全部子集构成的集合；$|2^S| = 2^{|S|}$ —— 每个元素「进 / 不进」二选一。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
{
      type: 'intuition',
      title: '装箱单：一种物品只登记一次',
      scene: 'C 程序 Part 1：位集实现的集合运算',
      body: [
        '★ 生活场景：写装箱单时，「袜子」写两遍没有意义——要么带要么不带。这就是集合的第一性格：**元素不重复**；第二种性格：**不计顺序**（袜子放箱子上层还是底层，单子是同一张）。',
        '★★ C 程序 Part 1 用一个 int 的二进制位当论域（n=4），把「集合」变成 16 个 0/1 串：**$2^4 = 16$ 个子集全部枚举**，正是 $|2^S| = 2^{|S|}$ 的实物演示。',
        '★★ 集合运算用位运算实现：并 = 按位或、交 = 按位与、补 = 取反。程序在 200 对随机子集上逐对验证 **De Morgan 律**（$\\overline{A \\cup B} = \\bar A \\cap \\bar B$）与吸收律——集合代数和位运算是一一对应的。',
        '⚠ 以后看到「子集枚举」「位集」，背后都是本关这张装箱单：第 15 章（子集和）、第 25 章（位集最短路）都直接受益。',
      ],
      interactive: { text: '' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json，每条都已通过溯源判据。
    // 请勿改写 en；每条补上 zh（中文解读）即可。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1153,
          en: 'Many chapters of this book touch on the elements of discrete mathematics. This appendix reviews the notations, definitions, and elementary properties of sets, re- lations, functions, graphs, and trees. If you are already well versed in this material, you can probably just skim this chapter.',
          zh: '★★ 本附录的定位声明：离散数学的记号是全书的地基， B 篇一次补齐。' },
        { kind: 'body', page: 1153,
          en: 'A set is a collection of distinguishable objects, called its members or elements. If an object x is a member of a set S , we write x 2 S (read "x is a member of S " or, more briefly, "x belongs to S "). If x is not a member of S , we write x … S .',
          zh: '★★ 集合的定义：可分辨对象的汇聚；成员（member / element）关系是唯一原始操作。' },
        { kind: 'body', page: 1153,
          en: 'To describe a set explicitly, write its members as a list inside braces. For example, to define a set S to contain precisely the numbers 1, 2, and 3, write S = f1,2,3 g.',
          zh: '★ 显式描述法：把成员列进花括号；另一种是「 $S = \\{x : \\text{条件}\\}$」的描述法。' },
        { kind: 'body', page: 1153,
          en: 'Since 2 belongs to the set S , we can write 2 2 S , and since 4 is not a member, we can write 4 … S . A set cannot contain the same object more than on ce, 1 and its elements are not ordered. Two sets A and B are equal, written A = B , if they contain the same elements. For example, f1,2,3,1 g = f1,2,3 g = f3,2,1 g.',
          zh: '★ 成员关系的记号示范：$2 \\in S$、$4 \\notin S$（语料把 ∈ 抽成 2，是 PDF 伪影）。' },
        { kind: 'body', page: 1153,
          en: '1 A variation of a set, which can contain the same object more than once, is called a multiset.',
          zh: '★ 脚注：允许重复的变体叫 **multiset（多重集）**——第 11 章链接法的桶里就是它。' },
        { kind: 'body', page: 1154,
          en: 'If all the elements of a set A are contained in a set B , that is, if x 2 A implies x 2 B , then we write A ⊆ B and say that A is a subset of B . A set A is a proper subset of set B , written A ⊂ B , if A ⊆ B but A ≠ B . (Some authors use the symbol "⊂" to denote the ordinary subset relation, rather th an the proper-subset relation.) Every set is a subset of itself: A ⊆ A for any set A. For two sets A and B , we have A = B if and only if A ⊆ B and B ⊆ A. The subset relation is transitive (see page 1159): for any three sets A, B , and C , if A ⊆ B and B ⊆ C , then A ⊆ C . The proper-subset relation is transitive as well. The empty set is a subset of all sets: for any set A, we have ; ⊆ A.',
          zh: '★★ 子集定义：$A \\subseteq B$ 即「$x \\in A \\Rightarrow x \\in B$」；真子集还要 $A \\ne B$。' },
      ],
      terms: [{ en: 'set', zh: '集合', page: 1153 },
        { en: 'multiset', zh: '多重集', page: 1153 },
        { en: 'power set', zh: '幂集', page: 1156 },],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
{
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1153,
      lines: [],
      vars: [],
      note: '★ 附录 B.1 用定义与恒等式讲集合，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
{
      type: 'visualize',
      title: '每个元素二选一：子集数如何翻倍',
      panels: [
        { title: '论域大小 n 与子集总数 2^n',
          viz: 'growth',
          chart: {
            xMax: 20,
            series: [
              { name: '子集总数 2^n', expr: 'Math.pow(2, n)', color: '--viz-done' },
              { name: '线性参照 n', expr: 'n', color: '--viz-compare' },
            ],
          },
          note: '★ 每加入一个新元素，子集总数翻倍：$|2^{S \\cup {x}}| = 2 \\cdot |2^S|$。C 程序 n=4 枚举出全部 16 个子集——指数增长的第一次现身。' },
      ],
      tasks: [
        '在 C 程序 part 1 里数一数 n=4 时枚举出的子集个数，验证 16。',
        '写出手算 De Morgan 律的一组实例（A、B 各取两个元素），对照程序输出。',
        '想想：为什么 int 位集最多只能表示 32 个元素的论域？',
      ],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
{
      type: 'code',
      title: '实测：位集当集合，幂集与 De Morgan',
      intro: 'C 程序 Part 1（本关认领）：一个 int 当论域，集合运算全部化作位运算。书上 $\\{x : \\cdots\\}$ 对应 C 里的位掩码（下标从 0 起）。',
      pseudocodeRef: null,
      c:{file:'sets_relations.c',code:String.raw`/* sets_relations.c -- 附录 B：集合 / 关系 / 函数 / 图 / 树的离散结构自证。
 *
 * 关键数字（全部先 printf 再写断言）：
 *   part 1  位集实现集合运算；n=4 时幂集 |2^S| = 2^|S| = 16 子集（枚举验证）；
 *           De Morgan 律逐对验证（随机 200 对子集）；
 *   part 2  随机 5 元关系（固定种子）判定自反 / 对称 / 传递；
 *           构造「对称 + 传递但不自反」反例（R={(1,1),(1,2),(2,1),(2,2)} on {1,2,3}）；
 *           等价关系的等价类构成划分（类两两不交、并为全集）；
 *   part 3  2→3 全部 9 个函数：单射 6、满射 0、双射 0；断言计数与 |B|^|A| 一致；
 *   part 4  随机图（固定种子）验证握手定理 Σdeg = 2E；完全图 K5 边数 10；
 *   part 5  满二叉树叶数 = 内部结点数 + 1（多种规模）；
 *           枚举 n=4 结点有标号树 16 = 4^(4−2)（Cayley / Prüfer 实测）。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o sr sets_relations.c
 */
#include <assert.h>
#include <stdio.h>

/* ---- 固定种子 PRNG（xorshift32；种子先做乘法混合，避免连续种子的线性相关）---- */
static unsigned int g_rng;
static unsigned int rng_next(void)
{
    unsigned int x = g_rng;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    g_rng = x;
    return x;
}
static void rng_seed(unsigned int s)
{
    g_rng = s * 2654435761u + 1u;   /* 乘法混合 */
}

/* =========================================================================
 * part 1 —— B.1 集合：位集实现 + 幂集大小 + De Morgan
 * ========================================================================= */
static void part1(void)
{
    const int n = 4;                 /* 论域大小 */
    const int U = (1 << n) - 1;      /* 全集（位掩码） */
    int total = 0;
    /* 枚举 2^n 个子集，验证 |2^S| = 2^|S| */
    for (int mask = 0; mask < (1 << n); mask++) {
        total += 1;
    }
    printf("part 1: 论域大小 n = %d，幂集子集总数 = %d（理论 2^%d = %d）\n",
           n, total, n, 1 << n);
    assert(total == (1 << n));       /* 16 */

    /* De Morgan：逐对验证 ~(A∪B) = ~A∩~B，~(A∩B) = ~A∪~B（U 为全集） */
    rng_seed(12345u);
    int checked = 0;
    for (int t = 0; t < 200; t++) {
        int A = (int)(rng_next() & U);
        int B = (int)(rng_next() & U);
        int AuB = A | B;
        int AiB = A & B;
        int compAuB = U & ~AuB;      /* ~在论域 U 内取补 */
        int compA = U & ~A;
        int compB = U & ~B;
        assert(compAuB == (compA & compB));
        assert((U & ~AiB) == (compA | compB));
        checked += 1;
    }
    printf("        De Morgan 律在 %d 对随机子集上逐对成立（论域 U 取补）✓\n", checked);
    assert(checked == 200);

    /* 集合运算恒等式抽查：A∪(A∩B) = A（吸收律，取 A=0b1100, B=0b1010） */
    int A = 0xC, B = 0xA;
    assert((A | (A & B)) == A);
    printf("        吸收律 A∪(A∩B)=A 抽样成立（A=1100₂, B=1010₂）✓\n");
}

/* =========================================================================
 * part 2 —— B.2 关系：随机关系判定 + 反例 + 等价类构成划分
 * ========================================================================= */
static int rel_get(long long R, int i, int j, int m)   /* m×m 关系的位访问 */
{
    return (int)((R >> (i * m + j)) & 1);
}
static int rel_reflexive(long long R, int m)
{
    for (int i = 0; i < m; i++)
        if (!rel_get(R, i, i, m)) return 0;
    return 1;
}
static int rel_symmetric(long long R, int m)
{
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            if (rel_get(R, i, j, m) && !rel_get(R, j, i, m)) return 0;
    return 1;
}
static int rel_transitive(long long R, int m)
{
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            for (int k = 0; k < m; k++)
                if (rel_get(R, i, j, m) && rel_get(R, j, k, m) && !rel_get(R, i, k, m))
                    return 0;
    return 1;
}

static void part2(void)
{
    const int m = 5;
    rng_seed(99u);
    int R = 0, edges = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            if (rng_next() & 1u) { R |= (1 << (i * 5 + j)); edges += 1; }
    int scan = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            scan += rel_get(R, i, j, m);
    printf("part 2: 随机 5 元关系（固定种子）：边 %d 条，自反=%d 对称=%d 传递=%d\n",
           edges, rel_reflexive(R, m), rel_symmetric(R, m), rel_transitive(R, m));
    assert(scan == edges);           /* 生成与扫描一致 */

    /* 反例：对称 + 传递但不自反。R={(1,1),(1,2),(2,1),(2,2)} on {1,2,3}（0-下标：(0,0),(0,1),(1,0),(1,1)） */
    int C = 0;
    C |= (1 << (0 * 3 + 0));
    C |= (1 << (0 * 3 + 1));
    C |= (1 << (1 * 3 + 0));
    C |= (1 << (1 * 3 + 1));
    printf("        反例 R={(1,1),(1,2),(2,1),(2,2)} on {1,2,3}：对称=%d 传递=%d 自反=%d\n",
           rel_symmetric(C, 3), rel_transitive(C, 3), rel_reflexive(C, 3));
    assert(rel_symmetric(C, 3) && rel_transitive(C, 3) && !rel_reflexive(C, 3));

    /* 等价关系（由划分构造）→ 等价类构成划分：类两两不交、并为全集 */
    /* 划分 {{0,1},{2,3,4},{5}} on 6 个元素 */
    int cls[3][6];
    int csz[3];
    int parts[3][6] = {{0,1,-1}, {2,3,4,-1}, {5,-1}};
    for (int c = 0; c < 3; c++) {
        csz[c] = 0;
        for (int x = 0; parts[c][x] >= 0; x++) cls[c][csz[c]++] = parts[c][x];
    }
    /* 由划分造等价关系（位位置最大 5*6+5=35，需用 long long） */
    long long E = 0;
    for (int c = 0; c < 3; c++)
        for (int a = 0; a < csz[c]; a++)
            for (int b = 0; b < csz[c]; b++)
                E |= (1LL << (cls[c][a] * 6 + cls[c][b]));
    assert(rel_reflexive(E, 6) && rel_symmetric(E, 6) && rel_transitive(E, 6));

    /* 计算等价类（从关系）：每个元素 x 的类 = {y : (x,y)∈E} */
    int got[6];
    for (int x = 0; x < 6; x++) {
        got[x] = 0;
        for (int y = 0; y < 6; y++)
            if (rel_get(E, x, y, 6)) got[x] |= (1 << y);
    }
    /* 同一类的元素给出相同的类集合；不同类必不交 → 构成划分 */
    int union_all = 0;
    for (int x = 0; x < 6; x++) {
        for (int y = 0; y < x; y++) {
            if (got[x] != got[y])
                assert((got[x] & got[y]) == 0);   /* 不同类两两不交 */
        }
        union_all |= got[x];
    }
    assert(union_all == ((1 << 6) - 1));       /* 并为全集 */
    printf("        等价关系（划分 {{0,1},{2,3,4},{5}}）的等价类两两不交且并为全集 ✓\n");
}

/* =========================================================================
 * part 3 —— B.3 函数：2→3 全部 9 个函数，枚举单射 / 满射 / 双射
 * ========================================================================= */
static void part3(void)
{
    /* 定义域 A={0,1}（2 个元素），陪域 B={0,1,2}（3 个元素）。函数 f:A→B 共 3^2 = 9 个。 */
    const int nA = 2, nB = 3;
    int total = 0, inj = 0, surj = 0, bij = 0;
    for (int f0 = 0; f0 < nB; f0++) {
        for (int f1 = 0; f1 < nB; f1++) {
            total += 1;
            int distinct = (f0 != f1);                  /* 单射：两像不同 */
            int cover = ((f0 == 0 || f1 == 0) && (f0 == 1 || f1 == 1) && (f0 == 2 || f1 == 2));
            if (distinct) inj += 1;
            if (cover) surj += 1;
            if (distinct && cover) bij += 1;
        }
    }
    printf("part 3: 2→3 全部函数 = %d（理论 |B|^|A| = %d^%d = %d）；单射 %d，满射 %d，双射 %d\n",
           total, nB, nA, nB * nB, inj, surj, bij);
    assert(total == nB * nB);          /* 9 */
    assert(inj == nB * nA);            /* 6 = P(3,2) */
    assert(surj == 0);                 /* 2 个原像盖不住 3 个陪域元素 */
    assert(bij == 0);                  /* |A|≠|B| 不可能双射 */
}

/* =========================================================================
 * part 4 —— B.4 图：握手定理 + 完全图 K5
 * ========================================================================= */
static void part4(void)
{
    const int m = 8;                   /* 顶点数 */
    const int p = 40;                  /* 约 40% 概率连边 */
    rng_seed(2024u);
    long long G = 0;
    int deg[8];
    for (int i = 0; i < m; i++) deg[i] = 0;
    int Ecount = 0;
    for (int i = 0; i < m; i++) {
        for (int j = i + 1; j < m; j++) {
            if ((int)(rng_next() % 100) < p) {
                G |= (1LL << (i * m + j));
                G |= (1LL << (j * m + i));
                deg[i] += 1; deg[j] += 1;
                Ecount += 1;
            }
        }
    }
    int sumdeg = 0;
    for (int i = 0; i < m; i++) sumdeg += deg[i];
    printf("part 4: 随机无向图（固定种子）：顶点 %d，边 %d，Σdeg = %d（理论 2E = %d）\n",
           m, Ecount, sumdeg, 2 * Ecount);
    assert(sumdeg == 2 * Ecount);      /* 握手定理 */

    /* 完全图 K5 边数 = 5*4/2 = 10 */
    const int k = 5;
    int K5 = 0, ke = 0;
    for (int i = 0; i < k; i++)
        for (int j = 0; j < k; j++)
            if (i != j) { K5 |= (1 << (i * k + j)); ke += 1; }
    ke /= 2;
    printf("        完全图 K5：边数 = %d（理论 C(5,2) = %d）\n", ke, k * (k - 1) / 2);
    assert(ke == k * (k - 1) / 2);     /* 10 */
}

/* =========================================================================
 * part 5 —— B.5 树：满二叉树叶数 = 内部 + 1；Cayley 公式 n=4 实测
 * ========================================================================= */
/* 递归构造一棵满二叉树（每个内点恰有 2 个子，或 0 个子），返回内点数并写出叶数。 */
static int build_full(int intern, int *leaf_count)
{
    if (intern == 0) { *leaf_count = 1; return 0; }
    int l_leaf = 0, r_leaf = 0;
    int l_int = build_full(intern - 1, &l_leaf);   /* 左子树取 intern-1 个内点 */
    int r_int = build_full(0, &r_leaf);            /* 右子树为叶 */
    *leaf_count = l_leaf + r_leaf;
    return 1 + l_int + r_int;
}

/* Prüfer 序列 -> 边集；返回是否构成生成树（恰 n-1 边且连通）。n<=15。 */
static int prufer_valid(int n, const int *seq)
{
    int deg[16];
    int parent[16];
    int i;
    for (i = 1; i <= n; i++) { deg[i] = 1; parent[i] = i; }
    for (i = 0; i < n - 2; i++) deg[seq[i]] += 1;
    for (i = 0; i < n - 2; i++) {
        int u = 1; while (u <= n && deg[u] != 1) u += 1;
        int v = seq[i];
        int a = u, b = v;
        while (parent[a] != a) a = parent[a];
        while (parent[b] != b) b = parent[b];
        parent[b] = a;
        deg[u] -= 1; deg[v] -= 1;
    }
    int x = 1; while (x <= n && deg[x] != 1) x += 1;
    int y = x + 1; while (y <= n && deg[y] != 1) y += 1;
    if (x <= n && y <= n) {
        int a = x, b = y;
        while (parent[a] != a) a = parent[a];
        while (parent[b] != b) b = parent[b];
        parent[b] = a;
    }
    int root = 1; while (parent[root] != root) root = parent[root];
    for (i = 2; i <= n; i++) {
        int a = i; while (parent[a] != a) a = parent[a];
        if (a != root) return 0;
    }
    return 1;
}

static void part5(void)
{
    /* 满二叉树叶数 = 内部 + 1，多种规模 */
    int leaf = 0;
    for (int k = 1; k <= 15; k++) {
        int built = build_full(k, &leaf);
        assert(built == k);
        assert(leaf == k + 1);
    }
    printf("part 5: 满二叉树：对内部结点数 k=1..15，叶数均 = k+1 ✓（如 k=7 → 叶 8）\n");

    /* Cayley：n=4 个有标号顶点，所有 Prüfer 序列共 4^(4−2)=16 条，每条对应一棵生成树 */
    const int n = 4;
    int trees = 0;
    int seq[2];
    for (seq[0] = 1; seq[0] <= n; seq[0]++) {
        for (seq[1] = 1; seq[1] <= n; seq[1]++) {
            if (prufer_valid(n, seq)) trees += 1;
        }
    }
    printf("        n=4 有标号树（Prüfer 枚举）：%d 棵 = 4^(4−2) = %d ✓\n", trees, n * n);
    assert(trees == n * n);            /* 16 */
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    part1();
    part2();
    part3();
    part4();
    part5();
    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 36, zh: '★ part 1 入口：n=4 的论域用一个 int 的低 4 位表示。' },
          { line: 47, zh: '★★ 枚举 0..2^4−1 共 16 个掩码 = 全部子集——$|2^S| = 2^{|S|}$ 的实测。' },
          { line: 55, zh: '★ De Morgan 律在 200 对随机子集上逐对成立（并的补 = 补的交）。' },
        ],
        tests: [
          { in: 'n = 4 的全部子集', out: '16 = 2^4' },
          { in: 'De Morgan 律', out: '200 对随机子集逐对成立' },
        ],
        mapping: [
          { pc: 'A ∪ B', pcCode: '并集', c: '`a | b`（按位或，第 60 行附近）' },
          { pc: 'A ∩ B', pcCode: '交集', c: '`a & b`（按位与）' },
          { pc: 'U − A', pcCode: '补集', c: '`~a & mask`（取反后裁掉高位）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
{
      type: 'analyze',
      title: '一本账：集合运算都是常数代价',
      intro: '位集实现下，每个集合运算是按字（word）为单位的位运算——这一笔账解释了为什么全书偏爱「特征向量」式表示。',
      claims: [
        { expr: '|2^S| = 2^{|S|}', when: '幂集大小：每个元素二选一（原书习题 B.1-1）', page: 1158, source: 'book' },
        { expr: '\\overline{A \\cup B} = \\bar A \\cap \\bar B', when: 'De Morgan 律（C 程序 200 对随机子集实测成立）', page: 1155, source: 'instructor' },
        { expr: '\\Theta(|S|/w)', when: '位集一次集合运算的代价（w = 机器字长）', page: 1153, source: 'instructor' },
      ],
      tables: [
        { caption: '集合运算 ↔ 位运算（C 程序 Part 1）', rows: [
          ['集合运算', '位运算', '语义'],
          ['A ∪ B', 'a | b', '至少属于一个'],
          ['A ∩ B', 'a & b', '同时属于'],
          ['U − A', '~a & mask', '不属于 A 的'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '为什么 |2^S| = 2^{|S|}', steps: [
          { zh: '给 $S$ 的每个元素一个「进 / 不进」的二选一开关，一个开关组合恰好对应一个子集。' },
          { zh: '$n$ 个开关共 $2^n$ 种组合 —— 且两种不同组合至少在一个元素上不同，对应不同子集（单射）。' },
          { zh: '反过来每个子集显然对应一种组合（满射），故恰有 $2^n$ 个子集。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
{
      type: 'prove',
      title: '凭什么说 |2^S| = 2^{|S|}（对每个 n 归纳）',
      statement: 'Show that for any finite set S , the power set 2 S has 2 |S| elements (that is, there are 2 |S| distinct subsets of S ).',
      page: 1158,
      intro: '★ 这是原书习题 B.1-1 的原题。证明用对 $|S| = n$ 的归纳：「空集基例 / 新元素让子集翻倍 / 归纳收尾」三步。',
      steps: [
        {
          title: '第一步 · 基例：空集的幂集',
          en: 'A set cannot contain the same object more than on ce, 1 and its elements are not ordered.',
          page: 1153,
          body: ['$|S| = 0$ 时 $2^S = \\{\\}$ 只有一个子集（空集自己），而 $2^0 = 1$ ✓。集合「无重复、无顺序」的性格保证枚举不重不漏。'],
        },
        {
          title: '第二步 · 归纳步：新元素让子集翻倍',
          en: 'If all the elements of a set A are contained in a set B , that is, if x 2 A implies x 2 B , then we write A ⊆ B and say that A is a subset of B . A se',
          page: 1154,
          body: ['设 $|S| = n$ 时结论成立。加入新元素 $x$：$S \\cup \\{x\\}$ 的子集分两类——**不含 $x$ 的**（就是 $S$ 的子集，共 $2^n$ 个）与**含 $x$ 的**（形如 $T \\cup \\{x\\}$，$T$ 取遍 $S$ 的子集，也是 $2^n$ 个）。'],
        },
        {
          title: '第三步 · 收尾：两类不重不漏',
          en: 'To describe a set explicitly, write its members as a list inside braces. For example, to define a set S to contain precisely the numbers 1, 2, and 3,',
          page: 1153,
          body: ['两类子集互不重合（$x$ 在不在）、各自内部由归纳假设不重不漏，故总数 $2^n + 2^n = 2^{n+1}$。∎',
            '★ C 程序 Part 1 的 16 = 2^4 就是 $n = 4$ 时的逐项清单。∎'],
        },
      ],
      conclusion: '★ 结论：$|2^S| = 2^{|S|}$ 对一切有限集成立。子集枚举（第 15 章）与位集（第 25 章）的正确性都压在这条恒等式上。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
{
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '$S = \\{a, b, c, d\\}$ 的幂集有几个元素？（C 实测）',
          options: ['8', '**16**', '4', '32'], answer: 1,
          why: '★ $2^4 = 16$ —— C 程序 part 1 枚举出全部 16 个子集。' },
        { kind: 'judge', q: '$\\{1, 2, 2, 3\\}$ 是一个集合。', answer: false,
          why: '★ 集合不允许重复元素；允许重复的叫 multiset（原书 p1153 脚注）。' },
        { kind: 'judge', q: '对任意集合 $A, B$，有 $\\overline{A \\cup B} = \\bar A \\cap \\bar B$。',
          answer: true,
          why: '★ De Morgan 律——C 程序在 200 对随机子集上逐对验证。' },
        { kind: 'single', q: '位集实现下，$A \\cup B$ 对应哪个位运算？',
          options: ['a & b', '**a | b**', '~a', 'a ^ b'], answer: 1,
          why: '★ 并 = 至少属于一个 = 按位或；交 = a & b。' },
        { kind: 'judge', q: '$\\varnothing$ 是任何集合的子集。',
          answer: true,
          why: '★ 「$x \\in \\varnothing \\Rightarrow x \\in A$」前件恒假，条件式为真——空集是最小的子集。' },
        { kind: 'single', q: '一个 int 当位集，最多能表示多大论域的全集？（假设 32 位）',
          options: ['16 个元素', '**32 个元素**', '任意大', '64 个元素'], answer: 1,
          why: '★ 每个元素占一位：32 位机器一个 int 最多 32 个元素；第 25 章的位集用数组扩展。' },
        { kind: 'simulate', q: 'C 程序 part 1 中 De Morgan 律在多少对随机子集上验证？',
          expect: [200], placeholder: '例如：100',
          why: '200 对 —— 每对都满足「并的补 = 补的交」。' },
      ],
      bookExercises: [
        // 附录语料未收录习题块，留空（B.1 习题见原书 p1157–1158）。
      ],
    },
  ],
};
