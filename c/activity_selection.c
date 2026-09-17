/* activity_selection.c -- 15.1: 活动选择 GREEDY-ACTIVITY-SELECTOR。
 * 数据：原书 Figure 15.1 的 11 个活动（按结束时间已排序）
 * 关键数字：贪心选出 {a1, a4, a8, a11}，共 4 个；暴力枚举 2^11 个子集独立验证最大值也是 4。
 * 另附习题 15.1-3 的反例：按"最早开始时间"选会退化。 */
#include <assert.h>
#include <stdio.h>

#define N 11

/* Figure 15.1：a1..a11 的 s 与 f（下标 1..N） */
static const int s[N + 1] = {0, 1, 3, 0, 5, 3, 5, 6, 7, 8, 2, 12};
static const int f[N + 1] = {0, 4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};

static int selected[N + 1];

/* GREEDY-ACTIVITY-SELECTOR（7 行直译；输入已按结束时间升序） */
static int greedy_activity_selector(int *out)
{
    int cnt = 0;
    int k = 1;                                   /* 行 2：k = 1 */
    out[cnt++] = 1;                              /* 行 1：A = {a1} */
    for (int m = 2; m <= N; m++) {               /* 行 3 */
        if (s[m] >= f[k]) {                      /* 行 4：a_m 是否与 a_k 相容？ */
            out[cnt++] = m;                      /* 行 5 */
            k = m;                               /* 行 6 */
        }
    }
    return cnt;                                  /* 行 7 */
}

/* 两个半开区间是否相交（[s_a, f_a) 与 [s_b, f_b)） */
static int i_conflicts(int sa, int fa, int sb, int fb)
{
    return sa < fb && sb < fa;
}

/* RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n)：递归版本，结果个数应与贪心一致 */
static int rec_activity_selector(int k, int n, int *out, int cnt)
{
    int m = k + 1;                               /* 行 1 */
    while (m <= n && s[m] < f[k]) { m = m + 1; } /* 行 2–3 */
    if (m <= n) {                                /* 行 4 */
        out[cnt++] = m;                          /* 行 5：把 a_m 并进答案 */
        return rec_activity_selector(m, n, out, cnt);
    }
    return cnt;                                  /* 行 6 */
}

/* 独立验证：暴力枚举全部 2^11 个子集，求最大相容子集大小 */
static int brute_force_max(void)
{
    int best = 0;
    for (int mask = 0; mask < (1 << N); mask++) {
        int ok = 1, cnt = 0, last_f = 0;
        for (int i = 1; i <= N && ok; i++) {
            if (!(mask & (1 << (i - 1)))) { continue; }
            if (s[i] < last_f) { ok = 0; break; }   /* 与上一个选中活动冲突 */
            last_f = f[i];
            cnt++;
        }
        if (ok && cnt > best) { best = cnt; }
    }
    return best;
}

/* 习题 15.1-3 的反例：按"最早开始时间"贪心
 * 规则：在尚未被排除的活动里挑开始时间最早的那个，然后排除与它冲突的全部活动。 */
static int earliest_start_greedy(const int *st, const int *ft, int n, int *out)
{
    int avail[N + 1];
    for (int i = 1; i <= n; i++) { avail[i] = 1; }
    int cnt = 0;
    while (1) {
        int pick = -1;
        for (int i = 1; i <= n; i++) {
            if (!avail[i]) { continue; }
            if (pick < 0 || st[i] < st[pick]) { pick = i; }   /* 开始时间最早者胜出 */
        }
        if (pick < 0) { break; }
        out[cnt++] = pick;
        avail[pick] = 0;
        for (int j = 1; j <= n; j++) {
            if (i_conflicts(st[pick], ft[pick], st[j], ft[j])) { avail[j] = 0; }
        }
    }
    return cnt;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：贪心 = {a1, a4, a8, a11} */
    int cnt = greedy_activity_selector(selected);
    printf("part 1: 贪心选出的活动 = {");
    for (int i = 0; i < cnt; i++) { printf("a%d%s", selected[i], i + 1 < cnt ? ", " : ""); }
    printf("}，共 %d 个\n", cnt);
    assert(cnt == 4 && selected[0] == 1 && selected[1] == 4
           && selected[2] == 8 && selected[3] == 11);

    /* part 2：递归版本给出同一组答案 */
    {
        int rec[N + 1];
        int rc = rec_activity_selector(0, N, rec, 0);
        printf("part 2: 递归版本（含虚拟活动 a0，f0 = 0）= {");
        for (int i = 0; i < rc; i++) { printf("a%d%s", rec[i], i + 1 < rc ? ", " : ""); }
        printf("}，共 %d 个 —— 与迭代版本一致\n", rc);
        assert(rc == cnt);
        for (int i = 0; i < rc; i++) { assert(rec[i] == selected[i]); }
    }

    /* part 3：独立验证 —— 暴力枚举全部子集 */
    {
        int best = brute_force_max();
        printf("part 3: 暴力枚举 2^11 = %d 个子集，最大相容子集 = %d 个\n", 1 << N, best);
        assert(best == cnt);
        printf("        贪心确实取到最优 —— 这不是巧合，而是 Theorem 15.1（最早结束者可选）保证的。\n");
    }

    /* part 4：为什么不能按"最早开始"选（习题 15.1-3 的构造） */
    {
        /* 三个活动：长活动 a1=[0,6] 最早开始，但它挡住了 a2=[1,4] 与 a3=[4,7] */
        static const int st[4] = {0, 0, 1, 4};
        static const int ft[4] = {0, 6, 4, 7};
        int out[4];
        int c1 = earliest_start_greedy(st, ft, 3, out);
        printf("part 4: 反例 —— 活动 [0,6]、[1,4]、[4,7]：\n");
        printf("        按最早开始贪心只选到 %d 个（选了 [0,6] 就被挡住）\n", c1);
        printf("        而最优是 [1,4] + [4,7] = 2 个\n");
        assert(c1 == 1);
        printf("        ★ 关键差别：最早结束（f 最小）才是安全的贪心选择。\n");
    }

    /* part 5：运行时间 —— 排序后 Θ(n) */
    printf("part 5: GREEDY-ACTIVITY-SELECTOR 只扫一遍：n = %d 时 10 次比较；\n", N);
    printf("        加上预排序 O(n lg n)，总时间 Θ(n lg n)。DP 版本要 Θ(n^3)（习题 15.1-1）。\n");

    puts("all checks passed.");
    return 0;
}
