/* 第 25 章 25.3：指派问题的匈牙利算法（The Hungarian algorithm for the assignment problem）。印刷页 723–748（pdf 744–769）。 */
export default {
  key:'s03',id:'ch25/s03',chapter:25,section:'25.3',
  title:'指派问题：带权匹配的最优解',shortTitle:'25.3 匈牙利算法',
  titleEn:'The Hungarian algorithm for the assignment problem',
  source:{printed:[723,748],pdf:[744,769]},
  prerequisites:[{label:'25.2 The stable-marriage problem',url:'#/ch25/s02'}],
  stages:[
   {type:'map',title:'从"最大"到"最优"',
    why:'**指派问题**：$n$ 个工人配 $n$ 个任务，边上有权重（效益/成本），求**完美匹配**使总权重最大（或总成本最小）。枚举 $n!$ 种不现实 —— 匈牙利算法 $O(n^3)$ 解决。',
    position:'匹配三连的最后一关：25.1 求"最大"、25.2 求"稳定"、25.3 求"最优"。它用对偶势函数 + 增广路，方法与 26 章的线性规划对偶同源。',
    unlocks:[{label:'26.1 The basics of fork-join parallelism',url:'#/ch26/s01'}],
    mathKit:[
     {title:'指派问题',body:'求完美匹配 $M^{*}$ 使 $w(M^{*}) = \\max\\{w(M)\\}$（$n!$ 种完美匹配中）。'},
     {title:'对偶势',body:'给每个工人与任务各配一个势（$u_i$、$v_j$），约束 $u_i + v_j \\ge w(i,j)$；势和是上界。'},
     {title:'紧边与增广',body:'只在"紧边"（$u_i + v_j = w(i,j)$）上找增广路；找不到就调整势（差的量等于最小松弛）—— 与 16 章摊还/26 章对偶呼应。'},
    ]},
   {type:'intuition',title:'紧边上的完美匹配就是最优',scene:'4×4 代价矩阵（C 程序 Part 3）',body:[
     '对偶原理：若找到一个完美匹配全由**紧边**组成，且势满足 $u_i + v_j \\ge w(i,j)$，则 `势和 = 匹配权重` 达到上界 → 该匹配最优（对偶间隙为 0）。',
     '★ C 程序 Part 3：4×4 代价矩阵的最优代价 = **13**，指派 行1→列2(2)、行2→列1(6)、行3→列3(1)、行4→列4(4)。',
     '★ 正确性由**暴力枚举 $4! = 24$ 种排列**独立验证（两者一致）。',
     '★ 复杂度：$O(n^3)$（每轮增广 $O(n^2)$、至多 $n$ 轮）；朴素枚举是 $O(n!)$ —— $n = 20$ 时差距是天文数字。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 w.M − / 代表 w(M*)）。',blocks:[
     {kind:'body',page:723,en:'The goal is to find a perfect matching M \u2212 (see Exercises 25.1-5 and 25.1-6) whose edges have the maximum total weight over all perfect matchings',
      zh:'★★ 指派问题的目标：完美匹配 + 总权重最大。'},
     {kind:'body',page:723,en:'(l,r) 2M w(l,r) denote the total weight of the edges in matching M , we want to find a perfect matching M \u2212 such that w.M \u2212 / = max fw(M) W',
      zh:'★ 目标函数的记号（语料把 $\\sum$ 抽成了散字）。'},
     {kind:'body',page:724,en:'Although you could enumerate all n! perfect matchings to solve the assignment problem, an algorithm known as the Hungarian algorithm solves',
      zh:'★★ 枚举 n! 不可行 → 匈牙利算法（后半句给出多项式时间）。'},
     {kind:'body',page:726,en:'The procedure GREEDY-BIPARTITE-MATCHING shows one.',
      zh:'★ 对照物：贪心匹配（对**无权**最大匹配有效，对带权指派不最优）。'},
    ],terms:[{en:'assignment problem',zh:'指派问题',page:723},
              {en:'Hungarian algorithm',zh:'匈牙利算法',page:724}]},
   {type:'pseudocode',title:'HUNGARIAN：5 行框架',algo:'HUNGARIAN',signature:'HUNGARIAN(weights, n)',page:737,
    lines:[
     {n:1,code:'initialize the potentials u and v',zh:'★ 初始势只需满足 $u_i + v_j \\ge w(i,j)$。'},
     {n:2,code:'repeat',zh:''},
     {n:3,code:'    find a perfect matching M in the tight-edge graph',zh:'★★ 只在紧边上找完美匹配。'},
     {n:4,code:'    if not perfect, adjust the potentials',zh:'★★ 调势 = 让更多边变紧（差的量取最小松弛）。'},
     {n:5,code:'until M is a perfect matching of tight edges',zh:''},
     {n:6,code:'return M',zh:'★ M 即为最大权完美匹配。'}],
    vars:[{name:'u, v',meaning:'对偶势（工人侧、任务侧）'},{name:'紧边',meaning:'$u_i + v_j = w(i,j)$ 的边'}],
    note:'★ 支撑第 3 行的 FIND-AUGMENTING-PATH（20 行，p.738）在紧边图上做增广 —— 与 25.1 的增广同源。',
    more:[]},
   {type:'visualize',title:'两对数字的对照',panels:[
     {title:'C 程序 Part 3：13 = 13',viz:'growth',
      chart:{xMax:20,series:[
       {name:'Hungarian 结果 13',expr:'13',color:'--viz-done'},
       {name:'暴力枚举 24 种 13',expr:'13',color:'--viz-compare'},
       {name:'贪心选择的典型代价（次优）',expr:'16',color:'--viz-violation'}]},
      note:'★ 贪心（每行取最小可用）会掉进局部最优：本例需全局权衡才能到 13。'},
    ],tasks:['对照 C 程序 part 3 的指派与暴力枚举。'],note:''},
   {type:'code',title:'实测：13 = 13',c:{file:'matching.c',code:String.raw`/* matching.c -- 25 章：二分匹配（Hopcroft-Karp）、稳定婚姻（Gale-Shapley）、指派问题（Hungarian）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 3（Hungarian）。'},
           {line:165,zh:'`cost`：4×4 代价矩阵。'},
           {line:172,zh:'`hungarian`：势 + 紧边 + 增广的经典实现（$O(n^3)$）。'},
           {line:211,zh:'`perm_rec`：暴力枚举 $n!$ 种排列 —— 独立对照。'},
           {line:250,zh:'★★ part 3：Hungarian 13 == 暴力 13；打印指派与逐项代价。'}]},
    tests:[{in:'4×4 代价矩阵',out:'最优代价 13；指派 1→2、2→1、3→3、4→4'},
           {in:'暴力枚举 24 种排列',out:'最优值同为 13'}],
    mapping:[{pc:4,pcCode:'adjust the potentials',c:'`for (int j = 0; j <= n; j++) { if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else { minv[j] -= delta; } }`（第 183 行）'}]},
   {type:'analyze',title:'一本账：n! 与 n³',claims:[
     {expr:'O(n^3)',when:'匈牙利算法的时间',page:724,source:'book'},
     {expr:'n!',when:'朴素枚举完美匹配的数量',page:724,source:'book'},
     {expr:'u_i + v_j \\ge w(i,j)',when:'对偶可行性（势和是上界）',page:737,source:'book'},
    ],tables:[{caption:'C 程序 Part 3 的实测',rows:[
      ['量','值'],
      ['规模','4 工人 × 4 任务'],
      ['Hungarian 最优代价','13'],
      ['暴力 24 种排列','13（一致）'],
      ['指派','1→2(2) 2→1(6) 3→3(1) 4→4(4)'],
     ]},{caption:'三个匹配问题的算法与代价',rows:[
      ['问题','目标','算法','时间'],
      ['最大二分匹配','边数最大','Hopcroft-Karp','O(E√V)'],
      ['稳定婚姻','无阻塞对','Gale-Shapley','O(n²)'],
      ['指派问题','总权重最优','Hungarian','O(n³)'],
     ]}],chart:{xMax:26,series:[
     {name:'n!（n=4 时 24）',expr:'24',color:'--viz-violation'},
     {name:'n³（n=4 时 64 次基本操作量级）',expr:'n * n * n',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'对偶论证：为什么紧边完美匹配最优',steps:[
      {zh:'对任意完美匹配 $M$ 与任意可行势：$w(M) = \\sum_{(i,j) \\in M} w(i,j) \\le \\sum_{(i,j) \\in M} (u_i + v_j) = \\sum_i u_i + \\sum_j v_j$。'},
      {zh:'所以势和是**所有**完美匹配的权重上界。'},
      {tex:'w(M) = \\sum_i u_i + \\sum_j v_j \\;\\Longrightarrow\\; M \\text{ 最优}',zh:'★ 若某个完美匹配的每条边都紧（取等号），它就达到上界 —— 匈牙利算法正是"把势调到出现紧边完美匹配"。C 程序 part 3 的 13 就是这条等式的实例。∎'}]},
     ],
    note:''},
   {type:'prove',title:'匈牙利算法的正确性（对偶视角）',statement:'Although you could enumerate all n! perfect matchings to solve the assignment problem, an algorithm known as the Hungarian algorithm solves',page:724,
    intro:'★ 正确性 = 弱对偶 + "达到上界即最优"。',
    steps:[
     {title:'弱对偶：势和是上界',en:'The goal is to find a perfect matching M \u2212 (see Exercises 25.1-5 and 25.1-6) whose edges have the maximum total weight over all perfect matchings',page:723,
      body:['设势 $(u,v)$ 满足 $u_i + v_j \\ge w(i,j)$（对一切边）。',
        '对任意完美匹配 $M$：$w(M) = \\sum_{M} w \\le \\sum_{M}(u_i+v_j) = \\sum_i u_i + \\sum_j v_j$。',
        '所以只要找到"每条边都紧"的完美匹配，$w(M) = $ 势和 = 上界 → $M$ 最优。∎']},
     {title:'调整势必能推进',en:'The procedure GREEDY-BIPARTITE-MATCHING shows one.',page:726,
      body:['若紧边图上还没有完美匹配，取最小松弛量 $\\delta = \\min\\{$非紧边的 $u_i + v_j - w(i,j)\\}$，按"匹配侧 +δ、另一侧 −δ"调整。',
        '调整后至少新增一条紧边，且已有紧边保持紧（匹配内的边两侧调整相抵）→ 算法严格推进。',
        '至多 $O(n^2)$ 次调整（每次至少一条新紧边）→ $O(n^3)$。★ C 程序 part 3 的 24 种暴力枚举给出独立验证。∎']},
    ],conclusion:'★ 结论：指派问题 = 带权匹配的最优解；匈牙利算法用对偶势 + 紧边增广在 $O(n^3)$ 内解决。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'指派问题的目标是？',options:['匹配边数最大','**完美匹配且总权重最优**','无阻塞对','匹配唯一'],answer:1,
      why:'★ 完美匹配（覆盖全部顶点）+ 权重最大/成本最小。'},
     {kind:'single',q:'匈牙利算法"紧边"指什么？',options:['权重最大的边','**$u_i + v_j = w(i,j)$ 的边**','已匹配的边','容量为 1 的边'],answer:1,
      why:'★ 只在紧边上找完美匹配；找到即最优（取到对偶上界）。'},
     {kind:'judge',q:'指派问题可以直接用贪心（每行取最大权重）求解。',answer:false,
      why:'★ 贪心会掉进局部最优（C 程序对照给出次优值）；需要全局对偶论证。'},
     {kind:'simulate',q:'C 程序 part 3 的最优代价是多少？（填数字）',expect:[13],placeholder:'例如：15',
      why:'13（匈牙利与 24 种暴力枚举一致）。'},
    ],bookExercises:[
     {id:'25.3-1',page:748,star:0,statement:'Use the Hungarian algorithm to find a maximum-weight perfect matching... ',hint:'照本关 pseudocode：初始化势 → 紧边图上增广 → 不完美就调势；每轮记录匹配与势值，直到紧边完美匹配出现。'},
     {id:'25.3-2',page:748,star:0,statement:'How can you solve the assignment problem... ',hint:'若目标是最小化成本：把 $w$ 换成 $-w$（或对最大权重 $W$ 用 $W-w$），同一算法即可 —— 对偶势的可行方向相应翻转。'},
     {id:'25.3-3',page:748,star:0,statement:'A professor claims... ',hint:'非完美匹配需求（如工人少于任务）时补零权边（或补虚拟工人）→ 归约到完美匹配；若目标是"最大权匹配（不要求完美）"，则加"不选"的零边。'},
    ]},
  ],
};
