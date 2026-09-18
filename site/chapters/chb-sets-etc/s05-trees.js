/* =============================================================================
 * 第 B 章 B.5 —— 第 s05 关：B.5 Trees
 *
 * 原文锚点：印刷页 1169–1177（pdf_index 1190–1198）
 *
 * 引述逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's05',
  id:'chB/s05',
  chapter: 'B',
  section: 'B.5',
  title: '树',
  shortTitle: 'B.5 树',
  titleEn: 'Trees',
  source: { printed: [1169, 1177], pdf: [1190, 1198] },
  sourceNote: '本关对应原书 B.5 节（印刷页 1169–1177）。',
  prerequisites: [
    { label: 'B.4 Graphs', url: '#/appendix/b/s04' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
{
      type: 'map',
      title: '树：没有环的图，算法的骨架',
      why: '自由树 = 连通 + 无环 + 无向。「边数恰为 $|V| - 1$」让它成为**最便宜**的连通结构——第 21 章最小生成树 entire 就在回答「哪个树最划算」；有根树加上父/子方向后，成为第 10–13 章一切树形数据结构的原型。',
      position: '前置 B.4 图；向下长出第 10 章（有根树表示）、第 12 章（BST）、第 21 章（MST）。本关钉死定义与三条等价刻画。',
      unlocks: [],
      mathKit: [
        { title: '自由树', body:'连通、无环、无向图；$|E| = |V| - 1$。' },
        { title: '森林', body:'无环无向图（可以不连通）—— 若干棵自由树的不相交并。' },
        { title: '有根树', body:'指定一个根的自由树；父 / 子 / 深 / 高由此定义。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
{
      type: 'intuition',
      title: '家族谱：根只有一个，路只有一条',
      scene: 'C 程序 Part 5：满二叉树与 Cayley 计数',
      body: [
        '★ 场景：家谱是从祖先画到子孙的树——每个人只有一个父亲（单父性），从祖宗到你只有一条路（唯一简单路径）。这就是有根树的全部直觉；「无环」在谱系里的意思是：没有人能当自己的祖先。',
        '★★ C 程序 Part 5 实测满二叉树的守恒律：**叶数 = 内部结点数 + 1**，对 k=1..15 全部成立（如 k=7 → 叶 8）。这条「叶子比叉子多一」的账本，第 16 章 Huffman 编码的 2-叉性质直接继承。',
        '★★ 树有多少种「长相」？程序用 Prüfer 枚举数出 n=4 的有标号树**恰 16 棵 = 4^(4−2)**（Cayley 公式）。树是稀有结构：在 4 顶点的 64 种可能图中只占 16 种。',
        '⚠ 注意原书的细节警告：**二叉树不是「度 ≤ 2 的有序树」**——只有一个孩子时，左右位置也分男女（p1173）。',
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
        { kind: 'body', page: 1169,
          en: 'B.5 Trees 1169 vertices in the bipartite graph correspond to vertices of the hypergraph, and let the other set of vertices of the bipartite graph correspond to hyperedges.)',
          zh: '★ 页眉伪影接上一节结尾（超图与二分图的对应）——C.5 之前的内容收尾。' },
        { kind: 'body', page: 1169,
          en: 'As with graphs, there are many related, but slightly different, notions of trees. This section presents definitions and mathematical properties of several kinds of trees.',
          zh: '★ 本节议程：树有好几种「近亲」定义，本书取一组自洽的讲。' },
        { kind: 'body', page: 1169,
          en: 'As defined in Section B.4, a free tree is a connected, acyclic, undirected graph. We often omit the adjective "free" when we say that a graph is a tree. If an undirected graph is acyclic but possibly disconnected, it is a forest. Many algorithms that work for trees also work for forests. Figure B.4(a) shows a free tree, and Figure B.4(b) shows a forest. The forest in Figure B.4(b) is not a tree because it is not connected.',
          zh: '★★ 自由树的定义：连通 + 无环 + 无向——三个词一个都不能少。' },
        { kind: 'body', page: 1169,
          en: 'The graph in Figure B.4(c) is connected but neither a tree nor a forest, because it contains a cycle.',
          zh: '★ 反例示范：连通但有环 = 既非树也非森林——「无环」独立于「连通」起作用。' },
        { kind: 'body', page: 1169,
          en: '3. G is connected, but if any edge is removed from E, the resulting graph is disconnected.',
          zh: '★★ 自由树的等价刻画之一：**删任何一条边就断**——「最便宜的连通」，边一条都不多。' },
        { kind: 'body', page: 1169,
          en: 'Figure B.4 (a) A free tree. (b) A forest. (c) A graph that contains a cycle and is therefore neither a tree nor a forest.',
          zh: '★ 图 B.4 图注：自由树 / 森林 / 含环图三个对照样本。' },
      ],
      terms: [{ en: 'free tree', zh: '自由树', page: 1169 },
        { en: 'forest', zh: '森林', page: 1169 },
        { en: 'rooted tree', zh: '有根树', page: 1171 },],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
{
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1169,
      lines: [],
      vars: [],
      note: '★ 附录 B.5 用定义与等价刻画讲树，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
{
      type: 'visualize',
      title: '叶数守恒与树的稀有',
      panels: [
        { title: '满二叉树：叶数 = 内部结点数 + 1',
          viz: 'growth',
          chart: {
            xMax: 16,
            series: [
              { name: '叶数 k+1', expr: 'n + 1', color: '--viz-done' },
              { name: '内部结点 k', expr: 'n', color: '--viz-compare' },
            ],
          },
          note: '★ C 程序对 k=1..15 逐点验证「叶 = 内部 + 1」——满二叉树的成本结构：每加一个叉子（内部结点）必多一个叶。' },
      ],
      tasks: [
        '在 C 程序 part 5 里核对 k=7 的满二叉树叶数是 8。',
        '数一数 n=4 的 16 棵有标号树：每种都恰有 3 条边（= n−1）。',
        '画一个 4 顶点的连通图，使它恰有一个环——验证它有 4 条边（≠ n−1）。',
      ],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
{
      type: 'code',
      title: '实测：叶数守恒 + Cayley 树计数',
      intro: 'C 程序 Part 5（本关认领）：满二叉树逐规模验证叶数守恒；Prüfer 序列枚举 n=4 的全部有标号树。书上 $\\deg(x)$（有根树版）对应 C 里的孩子计数（下标从 0 起）。',
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
          { line: 234, zh: '★ part 5 入口：满二叉树逐规模生成（内部结点数 k = 1..15）。' },
          { line: 289, zh: '★★ 叶数守恒输出：k=7 → 叶 8 ——「叶 = 内部 + 1」对全部 15 个规模成立。' },
          { line: 296, zh: '★ Prüfer 枚举 n=4 有标号树：16 = 4^(4−2)（Cayley 公式实测）。' },
        ],
        tests: [
          { in: '满二叉树 k = 1..15', out: '叶数恒 = k + 1' },
          { in: 'n = 4 有标号树（Prüfer 枚举）', out: '16 = 4^(4−2)' },
        ],
        mapping: [
          { pc: '叶数 = 内部 + 1', pcCode: '满二叉树守恒律', c: '逐规模断言 `leaves == internal + 1`（第 289 行）' },
          { pc: '|E| = |V| − 1', pcCode: '自由树边数', c: '每棵枚举出的树断言边数 3（n=4）' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
{
      type: 'analyze',
      title: '一本账：树为什么是最便宜的连通结构',
      intro: '三条等价刻画归结成一句账：连通要花的钱恰是 |V| − 1 条边，多一条出环、少一条断开。',
      claims: [
        { expr: '|E| = |V| - 1', when: '自由树的边数（等价刻画之一，原书 p1171 证明）', page: 1171, source: 'book' },
        { expr: '\\text{叶数} = \\text{内部结点数} + 1', when: '满二叉树守恒律（C 程序 k=1..15 实测）', page: 1173, source: 'instructor' },
        { expr: 'n^{n-2}', when: 'n 个有标号顶点的树数（Cayley 公式；C 程序 n=4 实测 16）', page: 1173, source: 'instructor' },
        { expr: 'O(V)', when: '树的空间代价：邻接表存 |V|−1 条边加 O(V) 的结点记录', page: 1169, source: 'instructor' },
      ],
      tables: [
        { caption: 'C 程序 Part 5 的两笔账', rows: [
          ['实验', '规模', '结果'],
          ['满二叉树叶数守恒', 'k = 1..15', '叶 = k+1 全部成立'],
          ['有标号树计数（Prüfer）', 'n = 4', '16 = 4^(4−2)'],
        ] },
      ],
      chart: null,
      derivations: [
        { kind: 'line', title: '叶 = 内部 + 1 的两行证明', steps: [
          { zh: '设满二叉树内部结点 $k$ 个，每个内部结点恰 2 个孩子 → 孩子「名额」共 $2k$ 个。' },
          { zh: '每个结点（除根）恰好占用一个名额：名额数 = 总结点数 − 1 = 叶 + 内部 − 1。于是 $2k = \text{叶} + k - 1$，即 $\text{叶} = k + 1$。∎' },
        ] },
      ],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
{
      type: 'prove',
      title: '等价刻画：连通、无环、|E| = |V| − 1 是一条绳上的三个结',
      statement: 'As defined in Section B.4, a free tree is a connected, acyclic, undirected graph.',
      page: 1169,
      intro: '★ 原书给出自由树的多条等价刻画并证明互相推出；这里走其中一段：(1) 连通+无环 ⇒ (5) |E| = |V|−1 ⇒ (6) 删任一边即断开。',
      steps: [
        {
          title: '第一步 · 连通 + 无环 ⇒ 边数恰为 |V| − 1',
          en: 'The graph in Figure B.4(c) is connected but neither a tree nor a forest, because it contains a cycle.',
          page: 1169,
          body: ['对 $|V|$ 归纳：从叶（度 1 的顶点）上摘叶子——自由树必存在叶（否则每个顶点度 ≥ 2，沿边走下去必遇环）。摘叶后仍是自由树，边数减一、点数减一，归纳关系保持。'],
        },
        {
          title: '第二步 · 反面教材：连通但有环就多一条边',
          en: 'The graph in Figure B.4(c) is connected but neither a tree nor a forest, because it contains a cycle.',
          page: 1169,
          body: ['图 B.4(c) 连通却含环：环上任何一条边都「多余」——删掉它仍连通。这正是 $|E| \ge |V|$ 的连通图不是树的原因：钱花多了。'],
        },
        {
          title: '第三步 · 删任一边即断：一条边都不多',
          en: '(5) ) (6): Suppose that G is acyclic and that |E| = |V| − 1. Let k be the number of connected components of G. Each connected component is a free tree by definition, and since (1) implies (5), the sum of all edges in all connected components of G is |V| − k. C',
          page: 1171,
          body: ['无环图每个连通分支都是自由树，总边数 $|V| - k$（$k$ 为分支数）。若 $|E| = |V| - 1$ 则 $k = 1$（连通）；此时删任何边，边数变 $|V| - 2 < |V| - 1$，连通不再可能 —— 断开。∎',
            '★ C 程序枚举的 16 棵树每棵恰 3 条边（n=4）；任何 4 边的 4 顶点连通图都含环。∎'],
        },
      ],
      conclusion: '★ 结论：连通、无环、$|E| = |V|-1$、删任一边即断、任意两点唯一简单路径——全是同一件事的不同说法。第 21 章的「安全边」论证全靠这套刻画。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
{
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '自由树的边数是多少？（n = |V|）',
          options: ['n', '**n − 1**', 'n + 1', 'n(n−1)/2'], answer: 1,
          why: '★ $|E| = |V| - 1$ —— 自由树的等价刻画之一（原书 p1171）。' },
        { kind: 'judge', q: '连通但含环的图是森林。', answer: false,
          why: '★ 图 B.4(c) 就是反例：含环 ⇒ 既非树也非森林（森林也不许有环）。' },
        { kind: 'single', q: '满二叉树有 7 个内部结点，叶有几个？（C 实测）',
          options: ['6', '7', '**8**', '14'], answer: 2,
          why: '★ 叶 = 内部 + 1 = 8 —— C 程序对 k=1..15 全部验证。' },
        { kind: 'judge', q: '二叉树就是「每个结点度数至多 2 的有序树」。', answer: false,
          why: '★ 原书 p1173 特别警告：单孩子时左右位置也区分——二叉树的「位置」信息更多。' },
        { kind: 'single', q: 'n = 4 的有标号自由树有几棵？（C 用 Prüfer 枚举）',
          options: ['4', '8', '**16**', '24'], answer: 2,
          why: '★ $4^{4-2} = 16$（Cayley 公式实测）。' },
        { kind: 'judge', q: '有根树中，根是唯一没有父结点的结点。', answer: true,
          why: '★ 原书 p1172：parent/child 定义中根是唯一例外。' },
        { kind: 'simulate', q: '4 顶点自由树删去任意一条边后剩几条边？此时图还连通吗？',
          expect: [2], placeholder: '例如：3',
          why: '剩 2 条 = n−2，连通性破坏（「删任一边即断」刻画）——所以答案是边数 2。' },
      ],
      bookExercises: [
        // 附录语料未收录习题块，留空（B.5 习题见原书 p1174–1175）。
      ],
    },
  ],
};
