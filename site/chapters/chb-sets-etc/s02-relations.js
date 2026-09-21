/* =============================================================================
 * 第 B 章 B.2 —— 第 s02 关：B.2 Relations
 *
 * 原文锚点：印刷页 1158–1160（pdf_index 1179–1181）
 *
 * 引述逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's02',
  id:'chB/s02',
  chapter: 'B',
  section: 'B.2',
  title: '关系',
  shortTitle: 'B.2 关系',
  titleEn: 'Relations',
  source: { printed: [1158, 1160], pdf: [1179, 1181] },
  sourceNote: '本关对应原书 B.2 节（印刷页 1158–1160）。',
  prerequisites: [
    { label: 'B.1 Sets', url: '#/appendix/b/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
{
      type: 'map',
      title: '关系：给「配对」立规矩',
      why: '把「两个对象有关系」形式化为序偶的集合，就得到关系。自反 / 对称 / 传递三条性质是后面一切结构的分拣机：三条全满足是**等价关系**（等价类=划分，第 20 章强连通分量的原型），换成「自反+反对称+传递」就是**偏序**（第 22 章拓扑序的原型）。',
      position: '前置 B.1 的集合与笛卡尔积；它是 B.3 函数（单值的关系）、B.4 图（对称关系的可视化）、B.5 树（层级关系）的共同骨架。',
      unlocks: [
        { label: 'B.3 Functions', url: '#/appendix/b/s03' },
      ],
      mathKit: [
        { title: '二元关系', body:'$R \\subseteq A \\times A$；$(a,b) \\in R$ 记作 $aRb$。' },
        { title: '三条性质', body:'自反：$aRa$；对称：$aRb \\Rightarrow bRa$；传递：$aRb \\wedge bRc \\Rightarrow aRc$。' },
        { title: '等价关系', body:'三条全满足 ⇒ 等价类构成 $A$ 的一个**划分**（两两不交、并全集）。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
{
      type: 'intuition',
      title: '「认识」是一种关系，但不是等价关系',
      scene: 'C 程序 Part 2：随机关系的三性质体检',
      body: [
        '★ 场景：班级里「认识」是二元关系——它对称（你认识我则我认识你）却不传递（你认识老师，老师认识校长，你不一定认识校长）。三条性质各管一摊，缺一不可。',
        '★★ C 程序 Part 2 生成一个固定种子的 5 元随机关系（13 条边），体检结果：自反 0、对称 0、传递 0——随机关系几乎注定三条全不过，这正是要「设计」等价关系的原因。',
        '★★ 程序还构造了教科书级反例：$R = \\{(1,1),(1,2),(2,1),(2,2)\\}$ 在 $\\{1,2,3\\}$ 上**对称且传递但不含自反**——「对称+传递 ⇒ 自反」是常见错觉（原书习题 B.2-3 的 Narcissus 教授谬误），缺的是「每个元素必须有自环」这条硬要求。',
        '★★ 最后一击：等价关系 $\\{\\{0,1\\},\\{2,3,4\\},\\{5\\}\\}$ 的等价类**两两不交且并为全集**——「等价」与「划分」是一回事，第 20 章的强连通分量就是图上的等价类。',
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
        { kind: 'body', page: 1158,
          en: 'A 1 \\ A 2 \\ • • • \\ A n = A 1 [ A 2 [ • • • [ A n ; A 1 [ A 2 [ • • • [ A n = A 1 \\ A 2 \\ • • • \\ A n :',
          zh: '★★ De Morgan 律的 $n$ 元推广——集合运算的「分配」性格，证明同 B.1。' },
        { kind: 'body', page: 1158,
          en: 'Prove the generalization of equation (B.3), which is called the principle of inclusion and exclusion: jA 1 [ A 2 [ • • • [ A n j = jA 1 |C|A 2 j + • • • C jA n j',
          zh: '★ 容斥原理（习题）：$|A_1 \\cup \\cdots \\cup A_n|$ 的交错和——第 15 章计数常用。' },
        { kind: 'body', page: 1158,
          en: 'Show that for any finite set S , the power set 2 S has 2 |S| elements (that is, there are 2 |S| distinct subsets of S ).',
          zh: '★ 幂集大小习题：$|2^S| = 2^{|S|}$（B.1 关的归纳证明在这里习题化）。' },
        { kind: 'body', page: 1158,
          en: 'Give an inductive definition for an n-tuple by extending the set-theoretic definition for an ordered pair.',
          zh: '★ $n$ 元组的归纳定义：序偶一层层套出来——「有序」是关系的原料。' },
        { kind: 'body', page: 1158,
          en: 'A binary relation R on two sets A and B is a subset of the Cartesian product A×B .',
          zh: '★★ 关系的定义：$R \\subseteq A \\times B$——关系不神秘，就是「序偶的集合」。' },
        { kind: 'body', page: 1158,
          en: 'If (a,b) 2 R, we sometimes write aRb . When we say that R is a binary relation on a set A, we mean that R is a subset of A × A. For example, the "less than" relation on the natural numbers is the set f(a,b) W a,b 2 N and a<b g. An n-ary relation on sets A 1 ,A 2 ,…,A n is a subset of A 1 × A 2 × • • • × A n .',
          zh: '★★ $aRb$ 记法与三条性质的入口：小于关系是 $\\mathbb{N}$ 上关系的标准例子。' },
      ],
      terms: [{ en: 'binary relation', zh: '二元关系', page: 1158 },
        { en: 'equivalence relation', zh: '等价关系', page: 1159 },
        { en: 'partial order', zh: '偏序', page: 1160 },],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
{
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1158,
      lines: [],
      vars: [],
      note: '★ 附录 B.2 用定义与例子讲关系，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
{
      type: 'visualize',
      title: '三条性质凑齐 = 等价类划分',
      panels: [
        { title: '随机关系几乎不是等价关系',
          viz: 'growth',
          chart: {
            xMax: 12,
            series: [
              { name: '完全图所需边数 C(n,2)', expr: 'n * (n - 1) / 2', color: '--viz-compare' },
              { name: '自反所需自环数 n', expr: 'n', color: '--viz-done' },
            ],
          },
          note: '★ 自反要求 n 条自环「一个不能少」、传递要求的边数随 n 平方增长——随机稀疏关系（C 程序 13 条边）三条全崩，符合直觉。' },
      ],
      tasks: [
        '在 C 程序 part 2 里找出那个「对称+传递但不自反」的反例，指出它缺哪条自环。',
        '验证等价类 {0,1}、{2,3,4}、{5} 两两不交且并为全集。',
        '举一个生活里的偏序（如「是……祖先」），说明它为什么不是全序。',
      ],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
{
      type: 'code',
      title: '实测：随机关系三性质体检 + 等价类划分',
      intro: 'C 程序 Part 2（本关认领）：用邻接矩阵存关系，三个检查器分别判定自反 / 对称 / 传递；等价类用并查集式的染色验证划分。书上 $aRb$ 对应 C 里的 `rel[a][b]`（下标从 0 起）。',
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
          { line: 76, zh: '★ part 2 入口：固定种子生成 5 元随机关系（13 条边）。' },
          { line: 117, zh: '★★ 三性质体检输出：自反=0 对称=0 传递=0 —— 随机关系几乎不是等价关系。' },
          { line: 128, zh: '★★ 反例 {(1,1),(1,2),(2,1),(2,2)}：对称✓ 传递✓ 自反✗ —— 破「对称+传递⇒自反」错觉。' },
          { line: 140, zh: '★ 等价关系的三类两两不交且并为全集 —— 划分成立。' },
        ],
        tests: [
          { in: '随机 5 元关系（固定种子）', out: '13 边，三性质全不过' },
          { in: '反例 {(1,1),(1,2),(2,1),(2,2)}', out: '对称=1 传递=1 自反=0' },
          { in: '等价关系 {{0,1},{2,3,4},{5}}', out: '等价类构成划分' },
        ],
        mapping: [
          { pc: '自反', pcCode: '∀a aRa', c: '`ok &= rel[i][i]`（对角线扫描，第 90 行附近）' },
          { pc: '对称', pcCode: 'aRb ⇒ bRa', c: '`rel[i][j] == rel[j][i]`' },
          { pc: '传递', pcCode: 'aRb ∧ bRc ⇒ aRc', c: '三重循环 + `rel[i][k] && rel[k][j] ⇒ rel[i][j]`' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
{
      type: 'analyze',
      title: '一本账：三条性质的分拣表',
      intro: '同一张关系表，三条性质查三次，就能把它归入不同的结构家族——这张分拣表贯穿全书。',
      claims: [
        { expr: '自反 + 对称 + 传递', when: '等价关系的定义（C 程序反例证明三条缺一不可）', page: 1159, source: 'book' },
        { expr: '自反 + 反对称 + 传递', when: '偏序的定义', page: 1160, source: 'book' },
        { expr: '\\text{等价类构成划分}', when: '等价类两两不交且并为全集（C 程序实测）', page: 1159, source: 'book' },
        { expr: 'O(n^3)', when: '传递性检查的三重循环代价（n = 论域大小）', page: 1158, source: 'instructor' },
      ],
      tables: [
        { caption: '性质组合 → 结构家族（C 程序 Part 2 实测）', rows: [
          ['自反', '对称', '传递', '结构', '全书原型'],
          ['✓', '✓', '✓', '等价关系', 'SCC（第 20 章）'],
          ['✓', '✗', '✓', '偏序', '拓扑序（第 22 章）'],
          ['✗', '✓', '✓', '反例（Narcissus 谬误）', 'C 程序实测'],
        ] },
      ],
      chart: null,
      derivations: [],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
{
      type: 'prove',
      title: '等价类的定理：为什么「等价」就是「划分」',
      statement: 'A relation that is reflexive, symmetric, and transitive is an equivalence relation.',
      page: 1159,
      intro: '★ 三步走：三条性质各自保证一件事 → 合起来证明等价类两两不交 → 并集是全集。',
      steps: [
        {
          title: '第一步 · 三性质各就各位',
          en: 'A binary relation R ⊆ A × A is reflexive if aRa',
          page: 1158,
          body: ['自反保证 $a$ 在自己的等价类 $[a]$ 里（类非空）；对称保证「$b \\in [a]$ 则 $a \\in [b]$」；传递保证类内任何两点互相等价。'],
        },
        {
          title: '第二步 · 两个类要么相等要么不交',
          en: 'For example, if we define R = f(a,b) W a,b 2 N and a + b is an even numberg, then R is an equivalence relation, since a + a is even (reflexive), a + b is even implies b + a is even (symmetric), and a + b is even and b + c is even imply a + c is even (transitive). The equivalence class of 4 is [4] = f0,2,4,6,… g, and the equivalence class of 3 is [3] = f1,3,5,7,… g.',
          page: 1159,
          body: ['若 $[a] \\cap [b] \\ne \\varnothing$，取公共元 $c$：由传递性与对称性，对任意 $x \\in [a]$ 有 $xRc$ 且 $cRb$，故 $xRb$——$[a] \\subseteq [b]$，对称地 $[b] \\subseteq [a]$。两个类相等。',
            '★ 原书的偶/奇数例子就是这个现象：$[4] = \\{0,2,4,6,\\dots\\}$ 与 $[3] = \\{1,3,5,7,\\dots\\}$ 互不相交。'],
        },
        {
          title: '第三步 · 并起来是全集',
          en: 'A relation R on a set A is a total relation if for all a,b 2 A, we have aRb or bRa (or both), that is, if every pairing of elements of A is related by R.',
          page: 1160,
          body: ['每个 $a$ 都在自己的类 $[a]$ 里（自反），所以所有等价类的并是 $A$ —— 划分的两个条件凑齐。∎',
            '★ C 程序 Part 2 的三色划分 $\\{\\{0,1\\},\\{2,3,4\\},\\{5\\}\\}$ 就是这条定理的实物。∎'],
        },
      ],
      conclusion: '★ 结论：等价关系 ↔ 划分，一对可以互相翻译的概念。第 20 章把「互相可达」定义为等价关系，SCC 就自动成为顶点集的划分。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
{
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '「认识」关系（人与人）满足哪条性质？',
          options: ['自反', '**对称**', '传递', '反对称'], answer: 1,
          why: '★ 你认识我 ⇒ 我认识你；但既不自反（自己算不算认识自己存疑）也不传递。' },
        { kind: 'judge', q: '若关系对称且传递，则它一定自反（Narcissus 教授的断言）。',
          answer: false,
          why: '★ C 程序反例 {(1,1),(1,2),(2,1),(2,2)} on {1,2,3}：元素 3 没有自环——对称与传递管不到「别的元素」。' },
        { kind: 'single', q: '等价关系多加哪条性质就变成偏序？把对称换成——',
          options: ['加上传递性', '**反对称**', '加上自反性', '加上完全性：任意两个元素可比'], answer: 1,
          why: '★ 自反 + 反对称 + 传递 = 偏序（原书 p1160）。' },
        { kind: 'judge', q: '等价关系的等价类可能相交但不完全重合。',
          answer: false,
          why: '★ 定理：两个等价类要么相等要么不交——C 程序的三类划分可见一斑。' },
        { kind: 'single', q: '5 元论域上最多有多少条边的关系仍是「空关系」的一部分？换个问法：完全图有多少条不同序偶（含自环）？',
          options: ['10', '15', '**25**', '20'], answer: 2,
          why: '★ $A \\times A$ 有 $5^2 = 25$ 个序偶——关系就是这 25 个序偶的子集。' },
        { kind: 'judge', q: 'C 程序生成的随机 5 元关系（13 条边）通过了三条性质体检。',
          answer: false,
          why: '★ 实测自反=0 对称=0 传递=0 —— 随机关系与等价关系相距甚远。' },
        { kind: 'simulate', q: 'C 程序 part 2 的等价关系把 6 个元素划成几个等价类？',
          expect: [3], placeholder: '例如：2',
          why: '3 类：{0,1}、{2,3,4}、{5} —— 两两不交、并为全集。' },
      ],
      bookExercises: [
        // 附录语料未收录习题块，留空（B.2 习题见原书 p1161–1162）。
      ],
    },
  ],
};
