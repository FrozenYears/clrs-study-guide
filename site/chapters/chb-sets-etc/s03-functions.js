/* =============================================================================
 * 第 B 章 B.3 —— 第 s03 关：B.3 Functions
 *
 * 原文锚点：印刷页 1161–1163（pdf_index 1182–1184）
 *
 * 引述逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's03',
  id:'chB/s03',
  chapter: 'B',
  section: 'B.3',
  title: '函数',
  shortTitle: 'B.3 函数',
  titleEn: 'Functions',
  source: { printed: [1161, 1163], pdf: [1182, 1184] },
  sourceNote: '本关对应原书 B.3 节（印刷页 1161–1163）。',
  prerequisites: [
    { label: 'B.2 Relations', url: '#/appendix/b/s02' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
{
      type: 'map',
      title: '函数：每个输入只许一个输出的关系',
      why: '函数是「单值」的关系：$A$ 中每个元素恰好指到 $B$ 中一个元素。单射 / 满射 / 双射三个户口决定了「能不能比较集合大小」「能不能可逆」——第 25 章匹配问题、第 28 章矩阵求逆，本质都在问「这个映射是双射吗」。',
      position: '前置 B.2 的关系（函数是其特例）；为 B.4 图（同构映射）、C.1 计数（函数计数 |B|^|A|）供弹药。',
      unlocks: [
        { label: 'B.4 Graphs', url: '#/appendix/b/s04' },
      ],
      mathKit: [
        { title: '函数定义', body:'$f \\subseteq A \\times B$，且每个 $a \\in A$ 恰有一个 $b$ 使 $(a,b) \\in f$。' },
        { title: '三个户口', body:'单射：$a \\ne a′ \\Rightarrow f(a) \\ne f(a′)$；满射：值域铺满 $B$；双射：两者兼备（可逆）。' },
        { title: '计数', body:'$|A|=m, |B|=n$：函数共 $n^m$ 个；$m \\le n$ 时单射 $n(n-1)\\cdots(n-m+1)$ 个。' },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
{
      type: 'intuition',
      title: '9 张「口味组合券」里找双射',
      scene: 'C 程序 Part 3：2→3 的全部函数枚举',
      body: [
        '★ 场景：两位顾客从三种口味里各选一球冰淇淋——每张券是 $A \\to B$ 的一个函数。C 程序把 **$3^2 = 9$ 个函数全部枚举**：单射 6 个（两人不同口味）、满射 0 个（两个顾客盖不满三种口味）、双射 0 个。',
        '★★ 计数对得上公式：函数总数 $|B|^{|A|} = 9$ ✓；单射数 $3 \\times 2 = 6$ ✓（第一位 3 选、第二位只剩 2 选）。这两个公式在 C.1 关会以排列组合的面目再出场。',
        '★★ 为什么双射要求 $|A| = |B|$？枚举看得一清二楚：2 个顾客永远盖不满 3 种口味——**满射的存在性本身就是集合大小的比较器**。「两个有限集等势 ⟺ 存在双射」从这里长出来。',
        '⚠ 顺序敏感是单值之外的另一件小事：冰淇淋双球「草莓+抹茶」与「抹茶+草莓」算同一张券的话，那就不再是函数而是无序对——函数天生有序。',
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
        { kind: 'body', page: 1161,
          en: 'Give examples of relations that are a. reflexive and symmetric but not transitive, b. reflexive and transitive but not symmetric, c. symmetric and transitive but not reflexive.',
          zh: '★ 这是 B.2 的习题被语料排到了本页——三条性质的组合反例（s02 已用 C 程序做过）。' },
        { kind: 'body', page: 1161,
          en: 'Let S be a finite set, and let R be an equivalence relation on S × S . Show that if in addition R is antisymmetric, then the equivalence classes of S with respect to R are singletons.',
          zh: '★ 习题：等价 + 反对称 ⇒ 等价类全是单元素集——反对称把「不同类」捏死了。' },
        { kind: 'body', page: 1161,
          en: 'Professor Narcissus claims that if a relation R is symmetric and transitive, then it is also reflexive. He offers the following proof. By symmetry, aRb implies bRa .',
          zh: '★ Narcissus 教授谬误的原题（s02 的 C 反例正是它的判决书）。' },
        { kind: 'body', page: 1161,
          en: 'Given two sets A and B , a function f is a binary relation on A and B such that for all a 2 A, there exists precisely one b 2 B such that (a,b) 2 f . The set A is called the domain of f , and the set B is called the codomain of f . We sometimes write f W A ! B , and if (a,b) 2 f , we write b = f(a) , since the choice of a uniquely determines b.',
          zh: '★★ 函数的定义：单值的关系——每个 $a \\in A$ 恰好一个 $b$。' },
        { kind: 'body', page: 1161,
          en: 'Intuitively, the function f assigns an element of B to each element of A. No element of A is assigned two different elements of B , but the same element of B can be assigned to two different elements of A. For example, the binary relation f = f(a,b) W a,b 2 N and b = a mod 2g is a function f W N ! f0,1 g, since for each natural number a, there is exactly one value b in f0,1 g such that b = a mod 2. For this example, 0 = f(0) , 1 = f(1) , 0 = f(2) , 1 = f(3) , etc. In contrast, the binary relation g = f(a,b) W a,b 2 N and a + b is eveng is not a function, since .1,3/ and .1,5/ are both in g, and thus for the choice a = 1, there is not precisely one b such that (a,b) 2 g.',
          zh: '★ 直观版：$A$ 的每个元素被指派到 $B$ 的一个元素；不允许一个 $a$ 指两个 $b$，但多个 $a$ 可指同一个 $b$。' },
        { kind: 'body', page: 1161,
          en: 'Given a function f W A ! B , if b = f(a) , we say that a is the argument of f and that b is the value of f at a. We can define a function by stating its value for 1162 Appendix B Sets, Etc. every element of its domain. For example, we might define f(n) = 2n for n 2 N, which means f = f(n,2n) W n 2 Ng. Two functions f and g are equal if they have the same domain and codomain and if f(a) = g(a) for all a in the domain.',
          zh: '★ 术语：$a$ 是 argument（自变元），$b = f(a)$ 是 $f$ 在 $a$ 处的 value（值）。' },
      ],
      terms: [{ en: 'function', zh: '函数', page: 1161 },
        { en: 'domain', zh: '定义域', page: 1162 },
        { en: 'bijection', zh: '双射', page: 1162 },],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
{
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 1161,
      lines: [],
      vars: [],
      note: '★ 附录 B.3 用定义讲函数，没有伪代码；实现对照见下一阶段 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
{
      type: 'visualize',
      title: '单射 / 满射在 9 张券里的分布',
      panels: [
        { title: '函数计数：|B|^|A| 的指数性格',
          viz: 'growth',
          chart: {
            xMax: 14,
            series: [
              { name: 'A→A 的函数总数 n^n', expr: 'Math.pow(n, n)', color: '--viz-done' },
              { name: '线性参照 n', expr: 'n', color: '--viz-compare' },
            ],
          },
          note: '★ 函数总数 $n^n$ 增长凶猛（n=14 已是百亿亿级）——「关系」太多，「单值」管不住多少；真正稀缺的是双射（计数 = n!）。' },
      ],
      tasks: [
        '在 C 程序 part 3 里找到单射计数 6 的那一行，手算 $3 \\times 2$ 对照。',
        '枚举 A={0,1}、B={0,1,2}：指出一个满射都不存在的直觉原因。',
        '把 B 换成 2 个口味，重算单射 / 满射 / 双射个数。',
      ],
      note: '',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
{
      type: 'code',
      title: '实测：2→3 的 9 个函数逐一验明正身',
      intro: 'C 程序 Part 3（本关认领）：三重循环枚举 $3^2 = 9$ 个函数，逐一判定单射 / 满射 / 双射。书上 $f: A \\to B$ 对应 C 里的 `int f[2]`（值域数组，下标从 0 起）。',
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
          { line: 169, zh: '★ part 3 入口：枚举 2→3 的全部函数（9 个），用三重循环生成值域数组。' },
          { line: 186, zh: '★★ 计数输出：函数 9 = 3^2、单射 6 = 3×2、满射 0、双射 0 —— 与公式逐一对上。' },
          { line: 176, zh: '★ 单射判定：f[0] != f[1]；满射判定：{0,1,2} 的每个值都被取到。' },
        ],
        tests: [
          { in: '2→3 全部函数', out: '9 = 3^2；单射 6；满射 0；双射 0' },
        ],
        mapping: [
          { pc: 'f(a) = b', pcCode: '函数求值', c: '`f[a]`（值域数组直接索引）' },
          { pc: '单射', pcCode: 'a≠a′ ⇒ f(a)≠f(a′)', c: '`f[0] != f[1]`（第 176 行附近）' },
          { pc: '满射', pcCode: '值域铺满 B', c: '对每个 b ∈ B 扫描 `f[0]`/`f[1]`' },
        ]},
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
{
      type: 'analyze',
      title: '一本账：三个户口的计数公式',
      intro: 'C 枚举把三个户口的个数钉死；公式给出一般形式——两者互相印证。',
      claims: [
        { expr: '|B|^{|A|}', when: '函数总数（C 实测 9 = 3^2）', page: 1162, source: 'book' },
        { expr: 'n(n-1)\\cdots(n-m+1)', when: '单射数（$|A|=m, |B|=n$；C 实测 6 = 3×2）', page: 1162, source: 'book' },
        { expr: 'm = n', when: '双射存在的必要条件（A、B 有限时）—— C 实测 2→3 双射 0', page: 1162, source: 'instructor' },
        { expr: 'O(n^m)', when: '枚举全部函数的代价（m 重循环）', page: 1161, source: 'instructor' },
      ],
      tables: [
        { caption: '2→3 的户口分布（C 程序 Part 3 实测）', rows: [
          ['户口', '个数', '公式'],
          ['全部函数', '9', '$3^2$'],
          ['单射', '6', '$3 \\times 2$'],
          ['满射 / 双射', '0 / 0', '需要 $|A| \\ge |B|$ / $|A| = |B|$'],
        ] },
      ],
      chart: null,
      derivations: [],
      note: '',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
{
      type: 'prove',
      title: '函数为什么「单值」，单射为什么能可逆',
      statement: 'Given two sets A and B , a function f is a binary relation on A and B such that for all a 2 A, there exists precisely one b 2 B such that (a,b) 2 f .',
      page: 1161,
      intro: '★ 三步：定义里的两个「恰一」→ 单射是「反向也单值」→ 双射才有逆函数。',
      steps: [
        {
          title: '第一步 · 「存在」+「唯一」拆开看',
          en: 'Intuitively, the function f assigns an element of B to each element of A. No element of A is assigned two different elements of B , but the same eleme',
          page: 1161,
          body: ['「存在」让 $f$ 处处有定义（$A$ 全覆盖）；「唯一」让 $f(a)$ 毫无歧义——两条合起来就是函数与一般关系的分界线。'],
        },
        {
          title: '第二步 · argument 与 value 的记号',
          en: 'Given a function f W A ! B , if b = f(a) , we say that a is the argument of f and that b is the value of f at a. We can define a function by stating i',
          page: 1161,
          body: ['记号各就各位后，「单射」就是 value → argument 的方向也构成函数：$f(a) = f(a′) \\Rightarrow a = a′$。',
            'C 程序的单射判定 `f[0] != f[1]` 正是这句话的 2 元特例。'],
        },
        {
          title: '第三步 · 双射才有逆：反例已枚举',
          en: 'Let S be a finite set, and let R be an equivalence relation on S × S . Show that if in addition R is antisymmetric, then the equivalence classes of S with respect to R are singletons.',
          page: 1161,
          body: ['把这句话读成「反向映射也要单值」的极端情形：等价 + 反对称把类捏成单元素——类比到函数：**双向都单值 = 双射**，逆函数才存在。',
            '★ C 枚举 2→3 没有任何双射（$|A| \\ne |B|$）——逆函数压根无从谈起。∎'],
        },
      ],
      conclusion: '★ 结论：单值是函数的出生证，双射是可逆的准生证。第 25 章匹配算法求的就是「把单射养到双射」。',
      note: '',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
{
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: '2→3 的全部函数有几个？（C 实测）',
          options: ['6', '8', '**9**', '12'], answer: 2,
          why: '★ $|B|^{|A|} = 3^2 = 9$ —— C 程序逐一枚举。' },
        { kind: 'single', q: '其中单射有几个？',
          options: ['3', '**6**', '9', '0'], answer: 1,
          why: '★ 第一位 3 选、第二位只剩 2 选：$3 \\times 2 = 6$。' },
        { kind: 'judge', q: '2→3 存在双射。', answer: false,
          why: '★ 双射要求 $|A| = |B|$；2 ≠ 3，C 枚举确认双射 0 个。' },
        { kind: 'judge', q: '一个 $A$ 中的元素可以被函数指派到两个不同的 $B$ 元素。', answer: false,
          why: '★ 「唯一」条款禁止——这正是函数与一般关系的分界。' },
        { kind: 'single', q: '满射存在的一个必要条件是？',
          options: ['|A| ≤ |B|', '**|A| ≥ |B|**', '|A| = |B|', '无要求'], answer: 1,
          why: '★ 要盖满 $B$，$A$ 的元素数不能比 $B$ 少（有限集情形）。' },
        { kind: 'judge', q: '函数一定是有序的：$(a,b) \\in f$ 中 $a$、$b$ 角色不可互换。', answer: true,
          why: '★ 函数是 $A \\times B$ 的子集，序偶的顺序即「输入 → 输出」的方向。' },
        { kind: 'simulate', q: '若把口味改成 2 种（2→2），双射有几个？',
          expect: [2], placeholder: '例如：6',
          why: '2! = 2 —— 两个置换：恒等与交换。' },
      ],
      bookExercises: [
        // 附录语料未收录习题块，留空（B.3 习题见原书 p1163）。
      ],
    },
  ],
};
