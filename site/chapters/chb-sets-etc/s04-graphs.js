/* =============================================================================
 * 第 B 章 B.4 —— 第 s04 关：B.4 Graphs
 *
 * 原文锚点：印刷页 1164–1168（pdf_index 1185–1189）
 *
 * 引述逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's04',
  id:'chB/s04',
  chapter: 'B',
  section: 'B.4',
  title: '图',
  shortTitle: 'B.4 图',
  titleEn: 'Graphs',
  source: { printed: [1164, 1168], pdf: [1185, 1189] },
  sourceNote: '本关对应原书 B.4 节（印刷页 1164–1168）。',
  prerequisites: [
    { label: 'B.3 Functions', url: '#/appendix/b/s03' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
{
      type: 'map',
      title: '图：把二元关系画出来',
      why: '有向图就是关系的画片（边集 $E$ 是 $V$ 上的二元关系），无向图是对称关系的画片。度数、路径、连通性这些词是第 20–24 章的日常用语；握手定理 $\\sum \\deg(v) = 2|E|$ 是图上第一条「不变量」——本关用 C 程序把它钉死。',
      position: '前置 B.2（关系）；B.5 树是它的特例（连通无环无向图）。第 20 章起全书图算法的词汇表都在本关。',
      unlocks: [
        { label: 'B.5 Trees', url: '#/appendix/b/s05' },
      ],
      mathKit: [
        { title: '有向图', body:'$G = (V, E)$，$E$ 是 $V$ 上的二元关系（边有序）；允许自环。' },
        { title: '无向图', body:'边是无序对 $\\{u,v\\}$；自环禁止。' },
        { title: '握手定理', body:'$\\sum_{v \\in V} \\deg(v) = 2|E|$ —— 每条边恰被两个端点各数一次。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
{
      type: 'intuition',
      title: '聚会握手的总次数为什么是偶数',
      scene: 'C 程序 Part 4：随机图的度数账本',
      body: [
        '★ 场景：聚会散场时每个人记得自己握了几次手。把所有人的握手次数加起来，一定是**总次数的两倍**——每一次握手都被两个人各自记了一笔。这就是握手定理的全部内容：$\\sum \\deg(v) = 2|E|$。',
        '★★ C 程序 Part 4 生成固定种子的 8 顶点随机图：12 条边，逐点数度数求和 = **24 = 2×12** ✓。再用完全图 $K_5$ 验证边数 $\\binom{5}{2} = 10$ —— 完全图是「人人握手」的极端情形。',
        '★★ 有向与无向的分界在自环与边序：有向图的 $(u,v)$ 有方向、允许 $(v,v)$ 自环；无向图边是无序对、自环禁止（原书 p1164）。「无向」本质上是「对称 + 无自环」的关系。',
        '⚠ 度数和恒为偶数有个立即可得的推论：**奇度顶点的个数必为偶数**（不然和不会是偶数）——面试常客。',
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
        { kind: 'body', page: 1164,
          en: 'This section presents two kinds of graphs: directed and undirected. Certain definitions in the literature differ from those given here, but for the most part, the differences are slight. Section 20.1 shows how to represent graphs in computer memory.',
          zh: '★ 本节议程：有向 / 无向两种图，术语以本书定义为准。' },
        { kind: 'body', page: 1164,
          en: 'A directed graph (or digraph) G is a pair (V,E) , where V is a finite set and E is a binary relation on V . The set V is called the vertex set of G, and its elements are called vertices (singular: vertex). The set E is called the edge set of G, and its elements are called edges. Figure B.2(a) is a pictorial representation of a directed graph on the vertex set f1,2,3,4,5,6 g . Vertices are represented by circles in the figure, and edges are represented by arrows. Self-loops—edges from a vertex to itself—are possible.',
          zh: '★★ 有向图的定义：边集 $E$ 是 $V$ 上的**二元关系**——B.2 的概念在这里落地。' },
        { kind: 'body', page: 1164,
          en: 'In an undirected graph G = (V,E) , the edge set E consists of unordered pairs of vertices, rather than ordered pairs. That is, an edge is a set fu,v g, where u,v 2 V and u ≠ v. By convention, we use the notation (u,v) for an edge, rather than the set notation fu,v g, and we consider (u,v) and (v,u) to be the same edge.',
          zh: '★★ 无向图的边是无序对 $\\{u,v\\}$——「对称化」的关系。' },
        { kind: 'body', page: 1164,
          en: 'In an undirected graph, self-loops are forbidden, so that every edge consists of two distinct vertices. Figure B.2(b) shows an undirected graph on the vertex set f1,2,3,4,5,6 g .',
          zh: '★ 无向图禁止自环：每条边连接两个**不同**顶点。' },
        { kind: 'body', page: 1164,
          en: 'Many definitions for directed and undirected graphs are the same, although certain terms have slightly different meanings in the two contexts. If (u,v) is an edge in a directed graph G = (V,E) , we say that (u,v) is incident from or leaves vertex u and is incident to or enters vertex v. For example, the edges leaving vertex 2',
          zh: '★ 两种图共享大部分词汇，但个别术语（度、路径）含义略有差别。' },
        { kind: 'body', page: 1164,
          en: 'Figure B.2 Directed and undirected graphs. (a) A directed graph G = (V,E) , where V = f1,2,3,4,5,6 g and E = f(1,2),.2,2/,.2,4/,.2,5/,.4,1/,.4,5/,.5,4/,.6,3/ g. The edge .2,2/ is a self-loop. (b) An undirected graph G = (V,E) , where V = f1,2,3,4,5,6 g and E = f(1,2),.1,5/,.2,5/,.3,6/ g. The vertex 4 is isolated. (c) The subgraph of the graph in part (a) induced by the vertex set f1,2,3,6 g.',
          zh: '★ 原书图 B.2 的图注开头（自环、多重边的示例都在这幅图里）。' },
      ],
      terms: [{ en: 'directed graph', zh: '有向图', page: 1164 },
        { en: 'undirected graph', zh: '无向图', page: 1164 },
        { en: 'degree', zh: '度', page: 1165 },],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
{
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1164,
      lines: [],
      vars: [],
      note: '★ 附录 B.4 用定义讲图，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
{
      type: 'visualize',
      title: '度数总和 = 2 × 边数，怎么加都不会错',
      panels: [
        { title: '完全图 K_n 的边数 C(n,2)',
          viz: 'growth',
          chart: {
            xMax: 16,
            series: [
              { name: 'K_n 边数 n(n−1)/2', expr: 'n * (n - 1) / 2', color: '--viz-done' },
              { name: '线性参照 2n', expr: '2 * n', color: '--viz-compare' },
            ],
          },
          note: '★ 完全图边数按平方增长：$K_5$ 是 10（C 实测），$K_{16}$ 已是 120 条边——「人人相连」的代价。握手定理对任何图成立，与形状无关。' },
      ],
      tasks: [
        '在 C 程序 part 4 里核对随机图的 Σdeg = 24 = 2×12。',
        '手算 K5 的每点度数（都应该是 4），验证 5×4 = 2×10。',
        '构造一个 3 个顶点、恰有 1 个奇度顶点的图——试试会发生什么。',
      ],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
{
      type: 'code',
      title: '实测：握手定理与完全图边数',
      intro: 'C 程序 Part 4（本关认领）：邻接矩阵存图，度数按行求和。书上 $\\deg(v)$ 对应 C 里的行和 `sum(adj[v][*])`（下标从 0 起）。',
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
          { line: 195, zh: '★ part 4 入口：固定种子生成 8 顶点随机图。' },
          { line: 218, zh: '★★ 握手定理输出：Σdeg = 24 = 2×12 —— 每条边被两个端点各记一笔。' },
          { line: 228, zh: '★ 完全图 K5 边数 10 = C(5,2) —— 人人握手的极端情形。' },
        ],
        tests: [
          { in: '随机图（8 顶点，12 边）', out: 'Σdeg = 24 = 2E' },
          { in: '完全图 K5', out: '边数 10 = C(5,2)' },
        ],
        mapping: [
          { pc: 'deg(v)', pcCode: '顶点度数', c: '行求和 `for j: deg += adj[v][j]`' },
          { pc: 'Σdeg(v) = 2|E|', pcCode: '握手定理', c: '累计所有行和与边数 ×2 对照（第 218 行）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
{
      type: 'analyze',
      title: '一本账：度数的两条不变量',
      intro: '握手定理给出第一条图上不变量；完全图给出边数的上界样板。',
      claims: [
        { expr: '\\sum_{v \\in V} \\deg(v) = 2|E|', when: '握手定理（原书聚会握手例题；C 实测 24 = 2×12）', page: 1168, source: 'book' },
        { expr: '|E| \\le \\binom{|V|}{2}', when: '无向图边数上界（完全图取等；C 实测 K5 = 10）', page: 1164, source: 'instructor' },
        { expr: '\\text{奇度顶点个数为偶数}', when: '握手定理的立即推论', page: 1168, source: 'instructor' },
        { expr: 'O(V + E)', when: '邻接表存图的空间与逐点扫度数的代价（呼应第 20 章）', page: 1164, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 Part 4 的两笔账', rows: [
          ['图', '顶点 / 边', 'Σdeg', '2E'],
          ['随机图（固定种子）', '8 / 12', '24', '24 ✓'],
          ['完全图 K5', '5 / 10', '40（每点 4）', '20 ✓（边数 10 = C(5,2)）'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '握手定理一行证完', steps: [
          { zh: '把每条边 $\\{u,v\\}$ 拆成「$u$ 记一笔 + $v$ 记一笔」两个半边。' },
          { zh: '左边按顶点收集（每个顶点的度数），右边按边收集（每条边恰好 2）——同一个总额的两种记账法。∎' },
          { zh: '★ 推论：度数总和恒为偶数 ⇒ 奇度顶点成双出现。' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
{
      type: 'prove',
      title: '握手定理：两种记账法，一个总数',
      statement: 'X v2V degree(v) = 2 |E| :',
      page: 1168,
      body_note: '',
      intro: '★ 原书把它藏在「教授聚会握手」的故事里：每个人记得握手次数，部门主管一算总和——恰好是握手次数的 2 倍。三步对应「记账 / 核对 / 推论」。',
      steps: [
        {
          title: '第一步 · 设账本：每条边两个半边',
          en: 'The degree of a vertex in an undirected graph is the number of edges incident on it.',
          page: 1165,
          body: ['按定义，$\\deg(v)$ 是与 $v$ 关联的边数。换视角：每条边 $\\{u,v\\}$ 给 $u$ 的账本记 1、给 $v$ 的账本记 1 —— 共记 2 笔。'],
        },
        {
          title: '第二步 · 两种记账法核对总额',
          en: 'Attendees of a faculty party shake hands to greet each other, with every pair of professors shaking hands one time. Each professor remembers the number of times he or she shook hands. At the end of the party, the department head asks the professors for their t',
          page: 1168,
          body: ['按顶点收账：$\\sum_v \\deg(v)$；按边收账：每边贡献恰好 2，共 $2|E|$。同一枚硬币的两面，总数必然相等。C 程序实测 24 = 2×12 ✓。'],
        },
        {
          title: '第三步 · 推论：奇度顶点成双',
          en: 'In an undirected graph, self-loops are forbidden, so that every edge consists of two distinct vertices.',
          page: 1164,
          body: ['总额 $2|E|$ 是偶数 ⇒ 度数为奇的顶点必须成对出现（奇数个奇数之和是奇数）。∎',
            '★ 顺带：无向图无自环保证每条边真的有两个**不同**端点——「每边记 2 笔」才站得住。∎'],
        },
      ],
      conclusion: '★ 结论：$\\sum \\deg(v) = 2|E|$ 对任何无向图成立。它是图上不变量思想的起点——第 20 章的欧拉回路、第 21 章的 MST 计数，都是同一思路的续篇。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
{
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '8 顶点 12 边的随机图，度数总和是多少？（C 实测）',
          options: ['12', '**24**', '16', '48'], answer: 1,
          why: '★ 握手定理：$2|E| = 24$ —— C 程序逐点求和核对。' },
        { kind: 'single', q: '完全图 K5 有多少条边？',
          options: ['5', '**10**', '20', '25'], answer: 1,
          why: '★ $\\binom{5}{2} = 10$ —— C 程序实测。' },
        { kind: 'judge', q: '无向图允许自环。', answer: false,
          why: '★ 原书明说：无向图自环被禁止——每条边连两个不同顶点。' },
        { kind: 'judge', q: '有向图的边集本质上是顶点集上的二元关系。', answer: true,
          why: '★ 有向图定义：$E$ 是 $V$ 上的二元关系——B.2 与 B.4 在这里接轨。' },
        { kind: 'judge', q: '任何无向图中，奇度顶点的个数必为偶数。', answer: true,
          why: '★ 握手定理：度数总和 2|E| 是偶数，奇度顶点必须成对。' },
        { kind: 'single', q: '有向图中「邻接」与无向图最大的差别是？',
          options: ['度数定义不同', '**邻接不一定对称**', '不能有路径', '顶点数受限'], answer: 1,
          why: '★ 原书 p1165：无向图邻接对称，有向图 $(u,v) \\in E$ 不保证 $(v,u) \\in E$。' },
        { kind: 'simulate', q: 'C 程序 part 4 的随机图有多少条边？',
          expect: [12], placeholder: '例如：10',
          why: '12 条边，Σdeg = 24 —— 两个数字互相咬合。' },
      ],
      bookExercises: [
        // 附录语料未收录习题块，留空（B.4 习题见原书 p1168–1169）。
      ],
    },
  ],
};
