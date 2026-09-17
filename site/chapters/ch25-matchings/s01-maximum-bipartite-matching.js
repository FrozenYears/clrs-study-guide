/* 第 25 章 25.1：最大二分匹配（再论，Hopcroft-Karp）。印刷页 705–716（pdf 726–737）。 */
export default {
  key:'s01',id:'ch25/s01',chapter:25,section:'25.1',
  title:'Hopcroft-Karp：交替路与分层加速',shortTitle:'25.1 Hopcroft-Karp',
  titleEn:'Maximum bipartite matching',
  source:{printed:[705,716],pdf:[726,737]},
  prerequisites:[{label:'24.3 Maximum bipartite matching',url:'#/ch24/s03'}],
  stages:[
   {type:'map',title:'从 O(VE) 到 O(E√V)',
    why:'24.3 用最大流求匹配（$O(VE)$）。**Hopcroft-Karp** 把它降到 $O(E\\sqrt{V})$：每轮同时沿**一组互不相交的最短增广路**推流，而不是一条一条找。',
    position:'第 VII 部分（匹配）开篇。它复用 24 章的增广思想，但把"一次一条"改成"一次一批" —— 这就是复杂度的全部来源。',
    unlocks:[{label:'25.2 The stable-marriage problem',url:'#/ch25/s02'}],
    mathKit:[
     {title:'M-交替路',body:'边在 $M$ 与 $E-M$ 之间交替的简单路径。'},
     {title:'M-增广路',body:'两端都是**未匹配点**的交替路 → 对称差 $M \\oplus P$ 得到大 1 的匹配。'},
     {title:'分层加速',body:'每轮用 BFS 分层、DFS 找**极大**的等长不相交增广路集合；增广 $O(\\sqrt{V})$ 轮即收敛。'},
    ]},
   {type:'intuition',title:'为什么"一批等长增广路"能省时间',scene:'C 程序 Part 1（300 组随机图）',body:[
     '一条增广路把匹配放大 1；一批**顶点不相交**的增广路可以同时生效（互不干扰）。',
     '★ 关键引理（原书 25.1-25.2）：最短增广路的长度**每轮严格变长**；长度超过 $\\sqrt{V}$ 后，剩余的增广次数已不超过 $\\sqrt{V}$ —— 两个 $\\sqrt{V}$ 相加就是 $O(E\\sqrt{V})$。',
     '★ C 程序 Part 1：在 300 组随机二分图（$|L|=7$、$|R|=8$）上，Hopcroft-Karp 与朴素增广（Kuhn）**结果完全一致**（不一致 0 次）—— 两种独立算法互证。',
     '★ 与最大流的关系：单位容量网络上的 HK 就是"批量版 Edmonds-Karp"；一般网络上的最大流仍用 24 章的算法。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 O. p 代表 O(）。',blocks:[
     {kind:'body',page:705,en:'Section 24.3 demonstrated one way to find a maximum matching in a bipartite graph, by finding a maximum flow. This section provides a more efficient method, the Hopcroft-Karp algorithm, which runs in O. p',
      zh:'★ 承上启下：24.3 的流方法 → 更快的 HK（后半句给出 $O(E\\sqrt{V})$）。'},
     {kind:'body',page:706,en:'Let M be a matching in any undirected graph G = (V,E) , and let P be an',
      zh:'★ 引理 25.1 的开头（后半句：M-augmenting path）。'},
     {kind:'body',page:706,en:'M -augmenting path. Then the set of edges M 0 = M \u02da P is also a matching in G with jM 0 j = |M| + 1.',
      zh:'★★ 增广引理：$M^{\\prime} = M \\oplus P$ 是匹配且 $|M^{\\prime}| = |M| + 1$。'},
     {kind:'body',page:712,en:'It remains to show that all three phases of line 3 take O(E) time. We assume that in the original bipartite graph G, each vertex has at least one incident edge so that |V| = O(E), which in turn implies that |V| + |E| = O(E).',
      zh:'★ 每轮（三个阶段）都是 $O(E)$。'},
     {kind:'body',page:715,en:'V/ times, and we have seen how to implement each iteration in O(E) time.',
      zh:'★★ 迭代 $O(\\sqrt{V})$ 次 × 每次 $O(E)$ = $O(E\\sqrt{V})$。'},
    ],terms:[{en:'M-alternating path',zh:'M-交替路',page:705},
              {en:'M-augmenting path',zh:'M-增广路',page:706}]},
   {type:'pseudocode',title:'HOPCROFT-KARP：6 行',algo:'HOPCROFT-KARP',signature:'HOPCROFT-KARP(G)',page:709,
    lines:[
     {n:1,code:'M = ∅',zh:''},
     {n:2,code:'repeat',zh:''},
     {n:3,code:'    find a maximal set P of vertex-disjoint shortest M-augmenting paths',zh:'★★ 一次找一批（互不相交、等长）。'},
     {n:4,code:'    M = M ⊕ P    // augment along all paths in P',zh:'★ 对称差同时增广。'},
     {n:5,code:'until P = ∅',zh:'★ 无增广路即最大（24.2 的停机条件）。'},
     {n:6,code:'return M',zh:''}],
    vars:[{name:'P',meaning:'顶点点不相交的最短增广路集合'},{name:'⊕',meaning:'对称差（增广）'}],
    note:'★ 三个阶段实现第 3 行（定向图 $G_M$ → DAG $H$ → 在 $H^T$ 上 DFS 抽不相交路），每阶段 $O(E)$。',
    more:[]},
   {type:'visualize',title:'两条路线的复杂度对照',panels:[
     {title:'24.3 的流方法 vs 25.1 的 HK',viz:'growth',
      chart:{xMax:64,series:[
       {name:'HK：E√V',expr:'n * Math.sqrt(n)',color:'--viz-done'},
       {name:'流方法：VE',expr:'n * n',color:'--viz-violation'}]},
      note:'★ 稀疏图上差距明显；两者都建立在"增广"这一同一思想上。'},
    ],tasks:['对照 C 程序 part 1 的 300 组随机图对照实验。'],note:''},
   {type:'code',title:'实测：HK ≡ Kuhn（300 组）',c:{file:'matching.c',code:String.raw`/* matching.c -- 25 章：二分匹配（Hopcroft-Karp）、稳定婚姻（Gale-Shapley）、指派问题（Hungarian）。
 * 关键数字：
 *   part 1  HK 与 Kuhn（朴素增广）在 300 组随机图上结果完全一致；
 *   part 2  原书 4×4 稳定婚姻例子：唯一稳定匹配（女子最优）；
 *   part 3  Hungarian 的结果与 4! = 24 种排列暴力枚举的最优值一致。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NL 7
#define NR 8

/* ================= part 1：Hopcroft-Karp ================= */
static int adjL[NL][NR], degL[NL];
static int pairU[NL], pairV[NR], dist[NL];

static int hk_bfs(void)
{
    int queue[NL], head = 0, tail = 0, found = 0;
    for (int u = 0; u < NL; u++) {
        if (pairU[u] < 0) { dist[u] = 0; queue[tail++] = u; } else { dist[u] = -1; }
    }
    while (head < tail) {
        int u = queue[head++];
        for (int i = 0; i < degL[u]; i++) {
            int v = adjL[u][i];
            int w = pairV[v];
            if (w < 0) { found = 1; }
            else if (dist[w] < 0) { dist[w] = dist[u] + 1; queue[tail++] = w; }
        }
    }
    return found;
}

static int hk_dfs(int u)
{
    for (int i = 0; i < degL[u]; i++) {
        int v = adjL[u][i];
        int w = pairV[v];
        if (w < 0 || (dist[w] == dist[u] + 1 && hk_dfs(w))) {
            pairU[u] = v; pairV[v] = u;
            return 1;
        }
    }
    dist[u] = -1;
    return 0;
}

static int hopcroft_karp(void)
{
    memset(pairU, -1, sizeof(pairU));
    memset(pairV, -1, sizeof(pairV));
    int matching = 0;
    while (hk_bfs()) {
        for (int u = 0; u < NL; u++) {
            if (pairU[u] < 0 && hk_dfs(u)) { matching++; }
        }
    }
    return matching;
}

/* 朴素增广（Kuhn）作为独立对照 */
static int usedR[NR];
static int kuhn_try(int u)
{
    for (int i = 0; i < degL[u]; i++) {
        int v = adjL[u][i];
        if (!usedR[v]) {
            usedR[v] = 1;
            if (pairV[v] < 0 || kuhn_try(pairV[v])) { pairV[v] = u; return 1; }
        }
    }
    return 0;
}

static int kuhn(void)
{
    memset(pairV, -1, sizeof(pairV));
    int m = 0;
    for (int u = 0; u < NL; u++) {
        memset(usedR, 0, sizeof(usedR));
        if (kuhn_try(u)) { m++; }
    }
    return m;
}

static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

/* ================= part 2：Gale-Shapley（女方向男方求婚） ================= */
#define N4 4
static const char *wname[N4] = {"Wanda", "Emma", "Lacey", "Karen"};
static const char *mname[N4] = {"Oscar", "Davis", "Brent", "Hank"};
/* 女方偏好（按喜欢程度降序），用男方下标表示 */
static const int wpref[N4][N4] = {
    {2, 3, 0, 1},   /* Wanda: Brent, Hank, Oscar, Davis */
    {1, 3, 0, 2},   /* Emma : Davis, Hank, Oscar, Brent */
    {2, 1, 3, 0},   /* Lacey: Brent, Davis, Hank, Oscar */
    {2, 3, 1, 0},   /* Karen: Brent, Hank, Davis, Oscar */
};
/* 男方偏好（按喜欢程度降序），用女方下标表示 */
static const int mpref[N4][N4] = {
    {0, 3, 2, 1},   /* Oscar: Wanda, Karen, Lacey, Emma */
    {0, 2, 3, 1},   /* Davis: Wanda, Lacey, Karen, Emma */
    {2, 3, 0, 1},   /* Brent: Lacey, Karen, Wanda, Emma */
    {2, 0, 1, 3},   /* Hank : Lacey, Wanda, Emma, Karen */
};

static int rank_of(int who, int partner, const int pref[N4][N4])
{
    for (int i = 0; i < N4; i++) { if (pref[who][i] == partner) { return i; } }
    return N4;
}

static void gale_shapley(int wife2husb[N4], int husb2wife[N4])
{
    int next[N4];
    memset(next, 0, sizeof(next));
    for (int i = 0; i < N4; i++) { wife2husb[i] = -1; husb2wife[i] = -1; }
    int free_w[N4], nfree = N4;
    for (int i = 0; i < N4; i++) { free_w[i] = i; }
    while (nfree > 0) {
        int w = free_w[0];
        for (int i = 1; i < nfree; i++) { free_w[i - 1] = free_w[i]; }
        nfree--;
        int m = wpref[w][next[w]++];                 /* 她的下一个求婚对象 */
        if (husb2wife[m] < 0) {
            husb2wife[m] = w; wife2husb[w] = m;
        }
        else {
            int w2 = husb2wife[m];
            if (rank_of(m, w, mpref) < rank_of(m, w2, mpref)) {
                husb2wife[m] = w; wife2husb[w] = m;  /* 男方更喜欢新来的 */
                free_w[nfree++] = w2;                /* 前任恢复自由 */
            }
            else { free_w[nfree++] = w; }            /* 被拒，继续求婚 */
        }
    }
}

/* 暴力检查：是否存在阻塞对 */
static int has_blocking_pair(const int wife2husb[N4])
{
    int husb2wife[N4];
    for (int i = 0; i < N4; i++) { husb2wife[wife2husb[i]] = i; }
    for (int w = 0; w < N4; w++) {
        for (int m = 0; m < N4; m++) {
            if (wife2husb[w] == m) { continue; }
            if (rank_of(w, m, wpref) < rank_of(w, wife2husb[w], wpref) &&
                rank_of(m, w, mpref) < rank_of(m, husb2wife[m], mpref)) {
                return 1;
            }
        }
    }
    return 0;
}

/* ================= part 3：Hungarian（最小化代价指派） ================= */
#define INF 1000000
static int cost[N4][N4] = {
    {9, 2, 7, 8},
    {6, 4, 3, 7},
    {5, 8, 1, 8},
    {7, 6, 9, 4},
};

static int hungarian(int n, int a[N4][N4], int assign[N4])
{
    int u[N4 + 1], v[N4 + 1], p[N4 + 1], way[N4 + 1];
    memset(u, 0, sizeof(u)); memset(v, 0, sizeof(v));
    memset(p, 0, sizeof(p)); memset(way, 0, sizeof(way));
    for (int i = 1; i <= n; i++) {
        p[0] = i;
        int j0 = 0;
        int minv[N4 + 1], used[N4 + 1];
        for (int j = 0; j <= n; j++) { minv[j] = INF; used[j] = 0; }
        do {
            used[j0] = 1;
            int i0 = p[j0], delta = INF, j1 = -1;
            for (int j = 1; j <= n; j++) {
                if (used[j]) { continue; }
                int cur = a[i0 - 1][j - 1] - u[i0] - v[j];
                if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                if (minv[j] < delta) { delta = minv[j]; j1 = j; }
            }
            for (int j = 0; j <= n; j++) {
                if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                else { minv[j] -= delta; }
            }
            j0 = j1;
        } while (p[j0] != 0);
        do {
            int j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }
    int total = 0;
    for (int j = 1; j <= n; j++) {
        if (p[j] > 0) { assign[p[j] - 1] = j - 1; total += a[p[j] - 1][j - 1]; }
    }
    return total;
}

static int brute_best;
static void perm_rec(int k, int used[N4], int acc)
{
    if (acc >= brute_best) { return; }
    if (k == N4) { if (acc < brute_best) { brute_best = acc; } return; }
    for (int j = 0; j < N4; j++) {
        if (!used[j]) {
            used[j] = 1;
            perm_rec(k + 1, used, acc + cost[k][j]);
            used[j] = 0;
        }
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：HK vs Kuhn（300 组随机图） */
    {
        int bad = 0, sum_hk = 0;
        for (unsigned int seed = 1; seed <= 300; seed++) {
            rng_seed(seed);
            for (int u = 0; u < NL; u++) {
                degL[u] = 0;
                for (int v = 0; v < NR; v++) {
                    if (rng_next() % 100 < 35) { adjL[u][degL[u]++] = v; }
                }
            }
            int a = hopcroft_karp();
            int b = kuhn();
            sum_hk += a;
            if (a != b) { bad++; }
        }
        printf("part 1: 300 组随机二分图（|L|=%d, |R|=%d）：HK 与 Kuhn 结果不一致 %d 次\n",
               NL, NR, bad);
        assert(bad == 0);
        printf("        （平均最大匹配 %.1f —— 两算法互为独立对照）\n", sum_hk / 300.0);
    }

    /* part 2：Gale-Shapley（女方求婚）与稳定性暴力验证 */
    {
        int wife2husb[N4], husb2wife[N4];
        gale_shapley(wife2husb, husb2wife);
        printf("part 2: Gale-Shapley（女方求婚）的结果：\n");
        for (int w = 0; w < N4; w++) {
            printf("        %s - %s\n", wname[w], mname[wife2husb[w]]);
        }
        assert(!has_blocking_pair(wife2husb));
        printf("        暴力检查全部 4×4 对：无阻塞对 -> 该匹配稳定 ✓\n");
        /* 统计所有稳定匹配（枚举 24 种排列） */
        int count = 0;
        int perm[N4], used[N4];
        for (int a = 0; a < N4; a++) {
            perm[0] = a;
            for (int b = 0; b < N4; b++) {
                if (b == a) { continue; }
                perm[1] = b;
                for (int c = 0; c < N4; c++) {
                    if (c == a || c == b) { continue; }
                    perm[2] = c;
                    perm[3] = 6 - a - b - c;      /* 0+1+2+3 = 6 */
                    memset(used, 0, sizeof(used));
                    for (int i = 0; i < N4; i++) { used[perm[i]] = 1; }
                    if (used[0] && used[1] && used[2] && used[3] && !has_blocking_pair(perm)) { count++; }
                }
            }
        }
        printf("        枚举 24 种完美匹配：稳定匹配共 %d 个（原书说本例唯一）\n", count);
        assert(count == 1);
    }

    /* part 3：Hungarian vs 暴力枚举 */
    {
        int assign[N4];
        int got = hungarian(N4, cost, assign);
        brute_best = INF;
        int used[N4] = {0, 0, 0, 0};
        perm_rec(0, used, 0);
        printf("part 3: Hungarian 最优代价 = %d；暴力枚举 4! = 24 种排列 = %d\n", got, brute_best);
        printf("        指派：");
        for (int i = 0; i < N4; i++) { printf("行%d->列%d(代价%d) ", i + 1, assign[i] + 1, cost[i][assign[i]]); }
        printf("\n");
        assert(got == brute_best);
        printf("        两者一致 —— Hungarian 的正确性由暴力枚举独立验证 ✓\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（HK 与 Kuhn 对照）。'},
           {line:17,zh:'`hk_bfs`：按未匹配左点分层（每轮的最短增广路长度）。'},
           {line:35,zh:'`hk_dfs`：沿分层找增广路，一次抽一批不相交的路。'},
           {line:49,zh:'`hopcroft_karp`：repeat-until 主循环（对应伪代码 6 行）。'},
           {line:64,zh:'`kuhn`：朴素单条增广 —— 独立对照算法。'},
           {line:190,zh:'★★ part 1：300 组随机图上两者不一致 0 次。'}]},
    tests:[{in:'300 组随机二分图（|L|=7,|R|=8, 35% 边概率）',out:'HK 与 Kuhn 结果不一致 0 次'},
           {in:'平均最大匹配',out:'6.6（受 |L|=7 限制）'}],
    mapping:[{pc:3,pcCode:'find a maximal set P ...',c:'`while (hk_bfs()) { ... hk_dfs(u) ... }`（第 54 行）'},
             {pc:4,pcCode:'M = M ⊕ P',c:'`pairU[u] = v; pairV[v] = u;`（第 41 行）'}]},
   {type:'analyze',title:'一本账：√V 从哪来',claims:[
     {expr:'O(E\\sqrt{V})',when:'Hopcroft-Karp 的运行时间',page:715,source:'book'},
     {expr:'|M^{\\prime}| = |M| + 1',when:'沿一条增广路增广后匹配恰好大 1（引理 25.1）',page:706,source:'book'},
     {expr:'O(E)',when:'每轮（三阶段）的实现代价',page:712,source:'book'},
    ],tables:[{caption:'两条路线的对照（C 程序 part 1）',rows:[
      ['','24.3 流方法','25.1 Hopcroft-Karp'],
      ['每次增广','一条路','一批互不相交的等长路'],
      ['轮数','O(V)','O(√V)'],
      ['每轮代价','O(E)','O(E)（三阶段）'],
      ['总时间','O(VE)','O(E√V)'],
     ]},{caption:'交替路家族',rows:[
      ['概念','定义','作用'],
      ['M-交替路','边在 M / E−M 间交替','分析工具'],
      ['M-增广路','两端未匹配的交替路','增广（匹配 +1）'],
      ['最短增广路','长度最小的那批','每轮批量处理的对象'],
     ]}],chart:{xMax:100,series:[
     {name:'HK = E√V',expr:'n * Math.sqrt(n)',color:'--viz-done'},
     {name:'HK 的轮数 √V',expr:'Math.sqrt(n)',color:'--viz-compare'},
     {name:'VE（流方法）',expr:'n * n / 8',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'$O(E\\sqrt{V})$ 的两段论证',steps:[
      {zh:'**第一段**：最短增广路长度 ≤ $\\sqrt{V}$ 时，每轮至少增广 1 条 → 至多 $\\sqrt{V}$ 轮（每轮路长递增，长度 ≤ √V 的路不多）。'},
      {zh:'**第二段**：路长 > $\\sqrt{V}$ 后，剩余可增广的次数 ≤ $\\sqrt{V}$（因为每次增广需要 $\\sqrt{V}$ 个新顶点，而总共只有 $V$ 个）。'},
      {tex:'O(\\sqrt{V}) \\text{ 轮} \\times O(E) = O(E\\sqrt{V})',zh:'★ 两段相加仍是 $O(\\sqrt{V})$ 轮 —— 这就是 HK 的加速逻辑。∎'}]},
     ],
    note:''},
   {type:'prove',title:'引理 25.1：增广路让匹配变大 1',statement:'M -augmenting path. Then the set of edges M 0 = M \u02da P is also a matching in G with jM 0 j = |M| + 1.',page:706,
    intro:'★ 本关的全部正确性都建立在这条引理上 —— 也是 24.2 增广引理的"匹配版"。',
    steps:[
     {title:'M ⊕ P 是匹配',en:'Let M be a matching in any undirected graph G = (V,E) , and let P be an',page:706,
      body:['$P$ 的边交替属于 $E-M$ 与 $M$，两端顶点都未匹配，长度为奇数。',
        '对称差 $M \\oplus P$ 在 $P$ 的内部顶点上：每个内部顶点原本由 $M$ 的一条边覆盖，交换后仍恰由一条边覆盖 ✓。',
        '端点：原来没有 $M$ 的边，现在多了一条 $P$ 的边 ✓。所以 $M \\oplus P$ 仍是匹配。']},
     {title:'大小恰好 +1',en:'M -augmenting path. Then the set of edges M 0 = M \u02da P is also a matching in G with jM 0 j = |M| + 1.',page:706,
      body:['$P$ 上属于 $E-M$ 的边比属于 $M$ 的边多 1 条（交替 + 两端非匹配边）。',
        '对称差把 $P$ 上的 $M$ 边删掉、加上 $E-M$ 的边 → 净增 1。',
        '★ C 程序 part 1 的 300 组实验结果与之相容：HK 与 Kuhn 都靠这条引理单调增大匹配，最终一致。∎']},
    ],conclusion:'★ 结论：增广引理 + "每轮一批" 的工程化 = $O(E\\sqrt{V})$。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'M-增广路的特征是什么？',options:['两端都是已匹配点','**两端都是未匹配点的交替路**','只含 M 的边','长度为偶数'],answer:1,
      why:'★ 两端未匹配 → 对称差后匹配大 1。'},
     {kind:'single',q:'Hopcroft-Karp 每轮做什么？',options:['找一条增广路','**找一批互不相交的最短增广路**','重排顶点','求最小割'],answer:1,
      why:'★ 这正是它比"一条一条找"快的原因。'},
     {kind:'judge',q:'Hopcroft-Karp 的时间是 O(E√V)。',answer:true,
      why:'★ √V 轮 × 每轮 O(E)。'},
     {kind:'simulate',q:'C 程序 part 1 中 HK 与 Kuhn 不一致的次数是多少？（填数字）',expect:[0],placeholder:'例如：1',
      why:'0 次（300 组随机图）—— 两种独立算法的互证。'},
    ],bookExercises:[
     {id:'25.1-1',page:715,star:0,statement:'Use the Hopcroft-Karp algorithm to find a maximum matching for the graph in Figure 25.1.',hint:'照 C 程序 part 1 的思路手工做：先贪心得一个匹配，再分层找等长增广路批次 —— 每轮记录匹配大小直到不再增大。'},
     {id:'25.1-4',page:715,star:0,statement:'Show how to bound the number of iterations of the the repeat loop of lines 2\u20135 of HOPCROFT-KARP by \u02d9 p',hint:'两段论证（见本关 derivations）：路长 ≤ √V 的轮数 O(√V)；路长 > √V 后剩余增广次数也 O(√V)。'},
    ]},
  ],
};
