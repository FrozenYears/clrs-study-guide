/* matching.c -- 25 章：二分匹配（Hopcroft-Karp）、稳定婚姻（Gale-Shapley）、指派问题（Hungarian）。
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
