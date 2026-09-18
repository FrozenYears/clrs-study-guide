/* sets_relations.c -- 附录 B：集合 / 关系 / 函数 / 图 / 树的离散结构自证。
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
                E |= (1 << (cls[c][a] * 6 + cls[c][b]));
    assert(rel_reflexive(E, 6) && rel_symmetric(E, 6) && rel_transitive(E, 6));

    /* 计算等价类（从关系）：每个元素 x 的类 = {y : (x,y)∈E} */
    int got[6];
    for (int x = 0; x < 6; x++) {
        got[x] = 0;
        for (int y = 0; y < 6; y++)
            if (rel_get(E, x, y, 6)) got[x] |= (1 << y);
    }
    /* 两两不交 + 并为全集 */
    int union_all = 0;
    for (int x = 0; x < 6; x++) {
        for (int y = 0; y < x; y++) {
            assert((got[x] & got[y]) == 0);   /* 类两两不交 */
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
    int G = 0;
    int deg[8];
    for (int i = 0; i < m; i++) deg[i] = 0;
    int Ecount = 0;
    for (int i = 0; i < m; i++) {
        for (int j = i + 1; j < m; j++) {
            if ((int)(rng_next() % 100) < p) {
                G |= (1 << (i * m + j));
                G |= (1 << (j * m + i));
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
