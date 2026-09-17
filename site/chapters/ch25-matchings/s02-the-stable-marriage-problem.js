/* 第 25 章 25.2：稳定婚姻问题（The stable-marriage problem）。印刷页 716–723（pdf 737–744）。 */
export default {
  key:'s02',id:'ch25/s02',chapter:25,section:'25.2',
  title:'稳定婚姻：延迟接受算法',shortTitle:'25.2 稳定婚姻',
  titleEn:'The stable-marriage problem',
  source:{printed:[716,723],pdf:[737,744]},
  prerequisites:[{label:'25.1 Maximum bipartite matching',url:'#/ch25/s01'}],
  stages:[
   {type:'map',title:'没有"私奔"动机的匹配',
    why:'$n$ 女与 $n$ 男各有偏好排序。要找一个**稳定匹配**：不存在"互相更喜欢对方"的一对（阻塞对）。**Gale-Shapley**（延迟接受）保证一定有解，且女方求婚时结果对女方最优、对男方最差。',
    position:'匹配问题的第二种目标：不再求"最大"，而求"稳定"。它是市场设计（住院医师匹配）的理论基础，也是延迟接受思想的原型。',
    unlocks:[{label:'25.3 The Hungarian algorithm',url:'#/ch25/s03'}],
    mathKit:[
     {title:'阻塞对',body:'未配成一对的 (w,m)，若双方都更喜欢对方 → 阻塞对 → 匹配不稳定。'},
     {title:'延迟接受',body:'未婚女子按偏好依次求婚；男方若已订婚就比较新求婚者与现任，更喜欢新的就换（现任恢复自由）。'},
     {title:'复杂度',body:'至多 $n^2$ 次求婚 → $O(n^2)$ 时间。'},
    ]},
   {type:'intuition',title:'本例的唯一稳定匹配',scene:'原书 4×4 例子（C 程序 Part 2）',body:[
     '偏好表（原书 p.717）：Wanda: Brent, Hank, Oscar, Davis；Emma: Davis, Hank, Oscar, Brent；Lacey: Brent, Davis, Hank, Oscar；Karen: Brent, Hank, Davis, Oscar。',
     '★ C 程序 Part 2 用**女方求婚**跑 Gale-Shapley，得到 Wanda–Hank、Emma–Oscar、Lacey–Brent、Karen–Davis —— 与原书 p.717 的答案逐对一致。',
     '★ 稳定性由**暴力检查全部 16 对**验证（无阻塞对）；再枚举 24 种完美匹配，确认**稳定匹配唯一**（原书："In fact, this stable matching is unique"）。',
     '★ 注意语料的版本：本版 Gale-Shapley 是**女方求婚**（对女方最优、对男方最差）—— 与经典教材的男方求婚版本互为镜像。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 4 是脚注标记）。',blocks:[
     {kind:'body',page:716,en:'If a woman and a man are not matched to each other but each prefers the other over their assigned partner, they form a blocking pair. A blocking pair has incentive to opt out of the assigned pairing and get together on their own.',
      zh:'★★ 阻塞对的定义：双方都更喜欢对方。'},
     {kind:'body',page:716,en:'matching, therefore, is a matching that has no blocking pair. If there is a blocking pair, then the matching is unstable.',
      zh:'★★ 稳定性的判据：无阻塞对。'},
     {kind:'body',page:717,en:'Wanda: Brent, Hank, Oscar, Davis Emma: Davis, Hank, Oscar, Brent',
      zh:'★ 例子的偏好表（语料把两行并成了一行）。'},
     {kind:'body',page:720,en:'The procedure GALE-SHAPLEY always terminates and returns a stable matching.',
      zh:'★★ 定理 25.10：一定停机且返回稳定匹配。'},
     {kind:'body',page:721,en:'Regardless of how women are chosen in line 2 of GALE-SHAPLEY , the procedure always returns the same stable matching, and in this stable matching, each woman has the best partner possible in any stable matching.',
      zh:'★★ 定理 25.11：结果唯一，且对**女方最优**。'},
     {kind:'body',page:722,en:'In the stable matching returned by the procedure GALE-SHAPLEY , each man has the worst partner possible in any stable matching.',
      zh:'★ 推论 25.12：对男方最差（镜面对称）。'},
    ],terms:[{en:'stable matching',zh:'稳定匹配',page:716},
              {en:'blocking pair',zh:'阻塞对',page:716}]},
   {type:'pseudocode',title:'GALE-SHAPLEY：10 行',algo:'GALE-SHAPLEY',signature:'GALE-SHAPLEY(men, women, rankings)',page:719,
    lines:[
     {n:1,code:'initialize everyone to free',zh:''},
     {n:2,code:'while some woman is free and has not proposed to every man',zh:'★ 女方求婚（本版）。'},
     {n:3,code:'    choose a free woman w',zh:''},
     {n:4,code:'    let m be the man w prefers most among those she has not proposed to',zh:''},
     {n:5,code:'    if m is free',zh:''},
     {n:6,code:'        m and w become engaged',zh:''},
     {n:7,code:'    else if m prefers w to his current partner w0',zh:'★ 男方比较新求婚者与现任。'},
     {n:8,code:'        m and w become engaged',zh:''},
     {n:9,code:'        w0 becomes free',zh:'★ 现任恢复自由（延迟接受）。'},
     {n:10,code:'return the engaged pairs',zh:''}],
    vars:[{name:'rankings',meaning:'男女双方的偏好排序'}],
    note:'★ "延迟接受"：男方不做最终承诺，随时可能被更喜欢的求婚者"抢走"—— 这让算法不需要回溯。',
    more:[]},
   {type:'visualize',title:'稳定性与唯一性',panels:[
     {title:'C 程序 Part 2：1 个稳定匹配 / 24 种以上可能中',viz:'growth',
      chart:{xMax:26,series:[
       {name:'完美匹配总数 4! = 24',expr:'24',color:'--viz-compare'},
       {name:'稳定匹配数 1（原书：唯一）',expr:'1',color:'--viz-done'}]},
      note:'★ 24 种完美匹配里只有 1 种稳定 —— 这正是"稳定"是强约束的量化体现。'},
    ],tasks:['对照 C 程序 part 2 打印的 4 对与暴力稳定性检查。'],note:''},
   {type:'code',title:'实测：4 对与原书一致',c:{file:'matching.c',code:String.raw`/* matching.c -- 25 章：二分匹配（Hopcroft-Karp）、稳定婚姻（Gale-Shapley）、指派问题（Hungarian）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 2（Gale-Shapley）。'},
           {line:100,zh:'`wpref` / `mpref`：原书 p.717 的偏好表。'},
           {line:120,zh:'`gale_shapley`：女方求婚 + 男方择优换人。'},
           {line:147,zh:'`has_blocking_pair`：暴力检查全部 4×4 对。'},
           {line:205,zh:'★★ part 2：结果 Wanda–Hank / Emma–Oscar / Lacey–Brent / Karen–Davis，稳定且唯一。'}]},
    tests:[{in:'原书 4×4 偏好表',out:'稳定匹配 4 对（与原书 p.717 一致）'},
           {in:'暴力检查',out:'无阻塞对；24 种完美匹配中稳定者 1 个'}],
    mapping:[{pc:7,pcCode:'else if m prefers w to his current partner',c:'`if (rank_of(m, w, mpref) < rank_of(m, w2, mpref))`（第 116 行）'}]},
   {type:'analyze',title:'一本账：一方最优、一方最差',claims:[
     {expr:'O(n^2)',when:'Gale-Shapley 的时间（至多 n² 次求婚）',page:719,source:'book'},
     {expr:'\\text{女方最优}',when:'女方求婚版的结果对每个女方是最优稳定伴侣',page:721,source:'book'},
     {expr:'\\text{男方最差}',when:'同一结果对每个男方是最差稳定伴侣（推论 25.12）',page:722,source:'book'},
    ],tables:[{caption:'C 程序 Part 2 的实测数据',rows:[
      ['量','值'],
      ['规模','4 女 4 男'],
      ['稳定匹配','Wanda–Hank、Emma–Oscar、Lacey–Brent、Karen–Davis'],
      ['阻塞对','0（暴力检查 16 对）'],
      ['稳定匹配数','1（枚举 24 种）'],
     ]},{caption:'三个匹配问题的目标对照',rows:[
      ['问题','目标','算法','时间'],
      ['最大二分匹配','边数最大','HK','O(E√V)'],
      ['稳定婚姻','无阻塞对','Gale-Shapley','O(n²)'],
      ['指派问题','总权重最大/最小','Hungarian','O(n³)'],
     ]}],chart:{xMax:26,series:[
     {name:'求婚次数上界 n² = 16',expr:'16',color:'--viz-compare'},
     {name:'完美匹配数 4! = 24',expr:'24',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'定理 25.10 的证明骨架',steps:[
      {zh:'**停机**：每次求婚都消耗一个"（女,男）对"，总对数 $n^2$ → 至多 $n^2$ 次求婚。'},
      {zh:'**稳定**：设 $w$ 与 $m$ 未配对且 $w$ 更喜欢 $m$。则 $w$ 一定向 $m$ 求过婚；$m$ 当时拒绝了她（或后来换掉了她）→ $m$ 更喜欢现任 → 不是阻塞对。'},
      {tex:'\\text{无阻塞对} \\Rightarrow \\text{稳定}',zh:'★ C 程序 part 2 的 16 对暴力检查就是这条论证的机器版本。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 25.10 与 25.11',statement:'The procedure GALE-SHAPLEY always terminates and returns a stable matching.',page:720,
    intro:'★ 两个定理：一定停机且稳定（25.10）；结果唯一且对女方最优（25.11）。',
    steps:[
     {title:'停机与稳定',en:'If a woman and a man are not matched to each other but each prefers the other over their assigned partner, they form a blocking pair. A blocking pair has incentive to opt out of the assigned pairing and get together on their own.',page:716,
      body:['求婚次数 ≤ $n^2$ → 必停机。',
        '设 $w$ 与 $m$ 未配对且 $w$ 更喜欢 $m$：$w$ 必曾向 $m$ 求婚（她按偏好降序求婚）。',
        '$m$ 若当时自由就会接受并把关系保持到最后（男方一旦订婚不会变空）；若被拒，说明 $m$ 有更喜欢的现任 → 双向偏好不同时成立 → 无阻塞对。∎']},
     {title:'结果唯一 + 女方最优',en:'Regardless of how women are chosen in line 2 of GALE-SHAPLEY , the procedure always returns the same stable matching, and in this stable matching, each woman has the best partner possible in any stable matching.',page:721,
      body:['**女方最优**（反证）：设某个稳定匹配 $M^{\\prime}$ 让 $w$ 得到比 $M$ 中更好的 $m^{\\prime}$。则 $w$ 在 GS 中先向 $m^{\\prime}$ 求婚，而 $m^{\\prime}$ 最终选择了别人 $w^{\\prime}$（且 $m^{\\prime}$ 更喜欢 $w^{\\prime}$）。',
        '在 $M^{\\prime}$ 中 $w^{\\prime}$ 没有 $m^{\\prime}$，而由 25.11 的归纳 $w^{\\prime}$ 在 $M$ 中的伴侣 $m^{\\prime}$ 是她能得到的最好的 → 在 $M^{\\prime}$ 中她更喜欢 $m^{\\prime}$ → $(w^{\\prime}, m^{\\prime})$ 是 $M^{\\prime}$ 的阻塞对，矛盾。',
        '**唯一性**：任何执行（第 2 行任选自由女子）都得到同一结果 → 稳定匹配唯一。★ C 程序枚举 24 种确认本例唯一。∎']},
    ],conclusion:'★ 结论：延迟接受 = 无回溯的稳定匹配算法；结果偏向求婚方（对女方最优、对男方最差）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Gale-Shapley 中男方何时换掉现任？',options:['随机','**新求婚者更被他喜欢时**','女方要求时','每轮都换'],answer:1,
      why:'★ 男方择优 —— 这是"稳定"的关键机制。'},
     {kind:'single',q:'女方求婚版的 Gale-Shapley 结果对哪一方最有利？',options:['男方最优','**女方最优（男方最差）**','双方中立','与偏好无关'],answer:1,
      why:'★ 定理 25.11 + 推论 25.12。'},
     {kind:'judge',q:'同一个偏好表可能有多个稳定匹配。',answer:true,
      why:'★ 原书 p.721 给出 3 女 3 男有多个稳定匹配的例子；但**GS 的输出**唯一（本关例子恰好只有 1 个稳定匹配）。'},
     {kind:'simulate',q:'C 程序 part 2 枚举出的稳定匹配数是多少？（填数字）',expect:[1],placeholder:'例如：2',
      why:'1 个（原书：本例稳定匹配唯一）。'},
    ],bookExercises:[
     {id:'25.2-1',page:723,star:0,statement:'Suppose that we have n women and n men... ',hint:'按本关 algorithm 手工模拟：每个女方按偏好表依次求婚，男方择优；记录每次求婚与被拒/换人。'},
     {id:'25.2-2',page:723,star:0,statement:'Verify that there are no blocking pairs in the stable matching...',hint:'对每一对未配对的 (w,m) 检查是否双方都更喜欢对方 —— 这正是 C 程序 `has_blocking_pair` 的实现（全对扫描）。'},
     {id:'25.2-5',page:723,star:0,statement:'The stable-roommates problem is similar to the stable-marriage problem, except that the graph is a complete graph, not bipartite...',hint:'非二分图时"稳定匹配可能不存在"（例如 4 人情形有经典无解实例）—— 与二分图版的"一定有解"形成对比，说明二分性是 25.10 的隐含前提。'},
    ]},
  ],
};
