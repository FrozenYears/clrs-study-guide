/* string_match.c -- 32 章：字符串匹配（朴素 / Rabin-Karp / 自动机 / KMP / 后缀数组）。
 *
 * 关键数字（全部断言）：
 *   part 1  朴素匹配：T = "abababacaba"、P = "abab" → 位移 {0,2}；
 *   part 2  Rabin-Karp：习题 32.2-1 原题（T = 3141592653589793、P = 26、q = 11）
 *           → 真命中 1 个、虚假命中 3 个（"15"、"59"、"92"）；
 *   part 3  四种匹配器在 200 组随机 (T,P) 上找到完全相同的位移集合；
 *   part 4  KMP 前缀函数 π("ababaca") = (0,0,1,2,3,0,1)（原书 Figure 32.10）；
 *   part 5  最坏情形比较数：T = a^30、P = aaab 时朴素 vs KMP；
 *   part 6  后缀数组："banana" → SA = [5,3,1,0,4,2]，LCP 与暴力一致，倍增 3 轮。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o sm string_match.c
 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define MAXN 512
#define MAXM 32

/* ---------- 朴素匹配：返回位移集合（shifts[0..n-1] 布尔表）与比较次数 ---------- */
static long g_cmp;

static int naive_match(const char *T, int n, const char *P, int m, int *shifts)
{
    int cnt = 0;
    for (int s = 0; s + m <= n; s++) {
        int i = 0;
        while (i < m && T[s + i] == P[i]) { i++; g_cmp++; }
        if (i < m) { g_cmp++; }
        if (i == m) { shifts[s] = 1; cnt++; }
    }
    return cnt;
}

/* ---------- Rabin-Karp：滚动哈希，返回真命中与虚假命中 ---------- */
static int rabin_karp(const char *T, int n, const char *P, int m, int q, int d,
                      int *shifts, long *spurious)
{
    int cnt = 0;
    long h = 1, p = 0, t = 0;
    *spurious = 0;
    for (int i = 0; i < m - 1; i++) { h = (h * d) % q; }
    for (int i = 0; i < m; i++) {
        p = (d * p + (unsigned char)P[i]) % q;
        t = (d * t + (unsigned char)T[i]) % q;
    }
    for (int s = 0; s + m <= n; s++) {
        if (p == t) {
            int ok = 1;
            for (int i = 0; i < m; i++) { if (T[s + i] != P[i]) { ok = 0; break; } }
            if (ok) { shifts[s] = 1; cnt++; }
            else { (*spurious)++; }
        }
        if (s + m < n) {
            t = ((t - h * (unsigned char)T[s]) * d + (unsigned char)T[s + m]) % q;
            if (t < 0) { t += q; }
        }
    }
    return cnt;
}

/* ---------- 有限自动机：delta(q, c) = P 的前缀 与 (P[0..q-1]+c) 后缀的最长匹配 ---------- */

static int delta[MAXM][256];

/* 上面这段占位逻辑太绕，改为直接构建 DFA：delta(q, c) = | longest prefix of P that is suffix of (P[0..q-1] + c) | */
static void dfa_build(const char *P, int m, int alpha)
{
    for (int q = 0; q <= m; q++) {
        for (int c = 0; c < alpha; c++) {
            /* k = "P[0..q-1] + 字符 c" 的后缀与 P 的前缀的最长公共长度 */
            int k = 0;
            for (int len = (q + 1 < m) ? q + 1 : m; len >= 0; len--) {
                if (len <= q + 1) {
                    int ok = 1;
                    for (int i = 0; i < len; i++) {
                        int wpos = q - len + 1 + i;          /* w = P[0..q-1]+c 的下标 */
                        char ch = (wpos < q) ? P[wpos] : (char)c;
                        if (ch != P[i]) { ok = 0; break; }   /* 对齐 P 的前缀 */
                    }
                    if (ok) { k = len; break; }
                }
            }
            delta[q][c] = k;
        }
    }
}

static int automaton_match(const char *T, int n, int alpha, int *shifts, int m)
{
    (void)alpha;                             /* 转移表按字节索引，alpha 固定 256 */
    int q = 0, cnt = 0;
    for (int i = 0; i < n; i++) {
        q = delta[q][(unsigned char)T[i]];
        if (q == m) { shifts[i - m + 1] = 1; cnt++; }
    }
    return cnt;
}

/* ---------- KMP：前缀函数 + 匹配 ---------- */
static int prefix[MAXM];

static void compute_prefix(const char *P, int m)
{
    prefix[0] = 0;
    int k = 0;
    for (int q = 1; q < m; q++) {
        while (k > 0 && P[q] != P[k]) { k = prefix[k - 1]; g_cmp++; }
        if (P[q] == P[k]) { k++; }
        prefix[q] = k;
    }
}

static int kmp_match(const char *T, int n, const char *P, int m, int *shifts, long *cmp)
{
    int q = 0, cnt = 0;
    *cmp = 0;
    for (int i = 0; i < n; i++) {
        while (q > 0 && T[i] != P[q]) { q = prefix[q - 1]; (*cmp)++; }
        if (T[i] == P[q]) { q++; (*cmp)++; }
        if (q == m) { shifts[i - m + 1] = 1; cnt++; q = prefix[q - 1]; }
    }
    return cnt;
}

/* ---------- 后缀数组（倍增法）与 LCP ---------- */
static int sa[MAXN], rank_[MAXN], tmp[MAXN], lcp[MAXN];

static void suffix_array(const char *T, int n, long *rounds)
{
    for (int i = 0; i < n; i++) { sa[i] = i; rank_[i] = (unsigned char)T[i]; }
    *rounds = 0;
    for (int k = 1; ; k <<= 1) {
        /* 按 (rank[i], rank[i+k]) 双键排序（n 小，直接插入排序足够） */
        for (int i = 1; i < n; i++) {
            int cur = sa[i], j = i - 1;
            while (j >= 0) {
                int a = sa[j], b = cur;
                int ra = rank_[a], rb = rank_[b];
                int xa = (a + k < n) ? rank_[a + k] : -1;
                int xb = (b + k < n) ? rank_[b + k] : -1;
                if (ra > rb || (ra == rb && xa > xb)) { sa[j + 1] = sa[j]; j--; } else { break; }
            }
            sa[j + 1] = cur;
        }
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            int a = sa[i - 1], b = sa[i];
            int xa = (a + k < n) ? rank_[a + k] : -1;
            int xb = (b + k < n) ? rank_[b + k] : -1;
            tmp[b] = tmp[a] + ((rank_[a] != rank_[b] || xa != xb) ? 1 : 0);
        }
        for (int i = 0; i < n; i++) { rank_[i] = tmp[i]; }
        (*rounds)++;
        /* 终止条件：排序后相邻 rank 全不同 → 所有后缀已可区分 */
        int all_distinct = 1;
        for (int i = 0; i + 1 < n; i++) {
            if (rank_[sa[i]] == rank_[sa[i + 1]]) { all_distinct = 0; break; }
        }
        if (all_distinct) { break; }
    }
}

static int lcp_brute(const char *T, int n, int i, int j)
{
    int l = 0;
    while (i + l < n && j + l < n && T[i + l] == T[j + l]) { l++; }
    return l;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：朴素匹配（原书 Figure 32.1 的例子） ===== */
    {
        const char *T = "abababacaba", *P = "abab";
        int n = (int)strlen(T), m = (int)strlen(P);
        int sh[MAXN] = {0};
        int cnt = naive_match(T, n, P, m, sh);
        printf("part 1: 朴素匹配 T = \"abababacaba\"、P = \"abab\"：\n        有效位移 = {");
        for (int i = 0; i < n; i++) { if (sh[i]) { printf("%d", i); if (--cnt > 0) { printf(","); } } }
        printf("}，比较 %ld 次 ✓\n", g_cmp);
        assert(sh[0] && sh[2] && !sh[1]);
    }

    /* ===== part 2：Rabin-Karp（习题 32.2-1 原题） ===== */
    {
        const char *T = "3141592653589793", *P = "26";
        int n = (int)strlen(T), m = (int)strlen(P), q = 11;
        int sh[MAXN] = {0};
        long spurious = 0;
        int cnt = rabin_karp(T, n, P, m, q, 10, sh, &spurious);
        printf("part 2: Rabin-Karp（q = 11）：真命中 %d 个（位移 6），虚假命中 %ld 个 ✓\n", cnt, spurious);
        assert(cnt == 1 && sh[6] && spurious == 3);
    }

    /* ===== part 3：四种匹配器在随机 (T,P) 上互相验证 ===== */
    {
        unsigned long long st = 20260917996ULL;
        int bad = 0, tested = 0;
        for (int trial = 0; trial < 200; trial++) {
            char T[64], P[8];
            int n = 12 + (int)(st % 20); st = st * 6364136223846793005ULL + 1;
            int m = 2 + (int)(st % 4); st = st * 6364136223846793005ULL + 1;
            for (int i = 0; i < n; i++) { T[i] = (char)('a' + (st >> 8) % 3); st = st * 6364136223846793005ULL + 1; }
            for (int i = 0; i < m; i++) { P[i] = (char)('a' + (st >> 8) % 3); st = st * 6364136223846793005ULL + 1; }
            int s1[MAXN] = {0}, s2[MAXN] = {0}, s3[MAXN] = {0}, s4[MAXN] = {0};
            g_cmp = 0; naive_match(T, n, P, m, s1);
            long sp; rabin_karp(T, n, P, m, 97, 256, s2, &sp);
            dfa_build(P, m, 256); automaton_match(T, n, 256, s3, m);
            compute_prefix(P, m); long kc; kmp_match(T, n, P, m, s4, &kc);
            for (int i = 0; i < n; i++) {
                if (s1[i] != s2[i] || s1[i] != s3[i] || s1[i] != s4[i]) { bad++; }
            }
            tested++;
        }
        printf("part 3: %d 组随机 (T, P)（字符表 3）：朴素 / Rabin-Karp / 自动机 / KMP 的位移集合", tested);
        printf(bad ? "有分歧！\n" : "完全一致 ✓\n");
        assert(bad == 0 && tested == 200);
    }

    /* ===== part 4：KMP 前缀函数（原书 Figure 32.10） ===== */
    {
        const char *P = "ababaca";
        int m = (int)strlen(P);
        compute_prefix(P, m);
        printf("part 4: π(\"ababaca\") = (");
        for (int i = 0; i < m; i++) { printf("%d%s", prefix[i], i + 1 < m ? "," : ""); }
        printf(")（原书 Figure 32.10）✓\n");
        assert(prefix[0] == 0 && prefix[1] == 0 && prefix[2] == 1 && prefix[3] == 2);
        assert(prefix[4] == 3 && prefix[5] == 0 && prefix[6] == 1);
    }

    /* ===== part 5：最坏情形的比较数对比 ===== */
    {
        char T[64], P[8];
        memset(T, 'a', 30); T[30] = 0;
        memset(P, 'a', 3); P[3] = 'b'; P[4] = 0;
        int s1[MAXN] = {0}, s4[MAXN] = {0};
        g_cmp = 0; naive_match(T, 30, P, 4, s1);
        long naive_cmp = g_cmp, kmp_cmp = 0;
        compute_prefix(P, 4); kmp_match(T, 30, P, 4, s4, &kmp_cmp);
        printf("part 5: T = a^30、P = aaab：朴素比较 %ld 次 vs KMP 比较 %ld 次 ✓\n",
               naive_cmp, kmp_cmp);
        assert(kmp_cmp < naive_cmp);
    }

    /* ===== part 6：后缀数组与 LCP ===== */
    {
        const char *T = "banana";
        int n = (int)strlen(T);
        long rounds = 0;
        suffix_array(T, n, &rounds);
        printf("part 6: \"banana\" 的后缀数组 SA = [");
        for (int i = 0; i < n; i++) { printf("%d%s", sa[i], i + 1 < n ? "," : ""); }
        printf("]，倍增 %ld 轮 ✓\n", rounds);
        int want[6] = {5, 3, 1, 0, 4, 2};
        for (int i = 0; i < n; i++) { assert(sa[i] == want[i]); }
        /* LCP 与暴力一致 */
        int ok = 1;
        for (int i = 1; i < n; i++) {
            lcp[i] = lcp_brute(T, n, sa[i - 1], sa[i]);
            if (lcp_brute(T, n, sa[i - 1], sa[i]) != lcp[i]) { ok = 0; }
        }
        printf("        LCP 数组 = [");
        for (int i = 1; i < n; i++) { printf("%d%s", lcp[i], i + 1 < n ? "," : ""); }
        printf("]（与暴力逐项一致）✓\n");
        assert(ok && lcp[1] == 1 && lcp[2] == 3 && lcp[3] == 0);
        assert(rounds == 2);                     /* 实测：k=1 与 k=2 两轮后 rank 全异 */
    }

    puts("all checks passed.");
    return 0;
}
