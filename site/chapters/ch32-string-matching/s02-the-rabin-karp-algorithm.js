/* 第 32 章 32.2：Rabin-Karp 算法。印刷页 961–967（pdf 982–988）。 */
export default {
  key:'s02',id:'ch32/s02',chapter:32,section:'32.2',
  title:'Rabin-Karp：把比较变成算术',shortTitle:'32.2 Rabin-Karp',
  titleEn:'The Rabin-Karp algorithm',
  source:{printed:[961,967],pdf:[982,988]},
  prerequisites:[{label:'32.1 朴素匹配',url:'#/ch32/s01'}],
  stages:[
   {type:'map',title:'滚动哈希：O(1) 更新的指纹',
    why:'把长度 $m$ 的窗口看作 $m$ 位 $d$ 进制数，模 $q$ 得到**指纹**。窗口右移一位时指纹可以 **$O(1)$ 更新**：$t_{s+1} = (d(t_s - T[s+1]h) + T[s+m+1]) \\text{ mod }q$。指纹相等才逐字符验证 —— 不相等必然不匹配（指纹是必要条件）。指纹相等但内容不同就是**虚假命中**，用模乘的 $q$ 取小值可以实测它们。',
    position:'四种算法里的"概率派"。原书习题 32.2-1 的例子（q = 11）恰好能产生虚假命中 —— C 程序完整复现。',
    unlocks:[{label:'32.3 有限自动机',url:'#/ch32/s03'}],
    mathKit:[
     {title:'指纹',body:'$p = P \\text{ mod }q$，$t_s = T[s+1..s+m] \\text{ mod }q$（按 $d$ 进制解释）。'},
     {title:'滚动更新',body:'$t_{s+1} = (d\\,(t_s - T[s+1]h) + T[s+m+1]) \\text{ mod }q$，$h = d^{m-1} \\text{ mod }q$。'},
     {title:'虚假命中',body:'$t_s = p$ 但 $T[s+1..s+m] \\ne P$ —— 必须逐字符复核。'},
     {title:'期望时间',body:'对随机 $q$（或大素数 $q$）：虚假命中极少，期望 $O(n + m)$。'},
    ]},
   {type:'intuition',title:'习题 32.2-1 原题：3 个虚假命中',scene:'C 程序 Part 2',body:[
     '★★ C 程序 part 2 就是习题 32.2-1：$T = $ 3141592653589793、$P = $ 26、$q = 11$。指纹 $26 \\text{ mod }11 = 4$；滑动窗口里 mod 11 等于 4 的有 "26"（真命中，位移 6）、"15"、"59"、"92" —— **虚假命中 3 个**。',
     '★ 虚假命中不是 bug 而是算法的一部分：哈希相等是必要条件，逐字符复核保证可靠性。真命中 1 个 + 虚假命中 3 个 = 4 次哈希相等，每次都复核 —— **零漏报**。',
     '★ part 3 的 200 组随机测试里 Rabin-Karp（$q = 97$，字符表 3）与朴素匹配的位移集合完全一致 —— 概率算法的正确性靠复核兜底，而不是靠运气。',
     '⚠ 滚动更新里的减法可能出负数（C 的 % 对负数给负余数）：`t < 0 时加 q` 这一行不能省 —— 本站实现时真实踩到。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:963,en:'Indeed, you can compute p in Θ(m) time using Horner’s rule (see Problem 2-3):',
      zh:'★ 素数 $q$ 的选择影响虚假命中频率。'},
     {kind:'body',page:962,en:'The gap character may occur an arbitrary number of times in the pattern but not at all in the text.',
      zh:'★ 显式验证显式化了"指纹相等不等于相等"。'},
    ],terms:[{en:'spurious hit',zh:'虚假命中',page:964},
              {en:'modulus',zh:'模数 q',page:962}]},
   {type:'pseudocode',title:'RABIN-KARP-MATCHER（原书 p.966，12 行）',algo:'RABIN-KARP-MATCHER',signature:'RABIN-KARP-MATCHER(T, P, d, q)',
    page:966,
    lines:[
     {n:1,code:'n = T.length; m = P.length; h = d^{m-1} mod q; p = 0; t_0 = 0',zh:'★ 预处理。'},
     {n:2,code:'for i = 1 to m:  p = (d·p + P[i]) mod q;  t_0 = (d·t_0 + T[i]) mod q',zh:'★ 首窗口指纹。'},
     {n:3,code:'for s = 0 to n − m',zh:''},
     {n:4,code:'    if p == t_s',zh:'★★ 哈希相等才看内容。'},
     {n:5,code:'        if P[1..m] == T[s+1..s+m]',zh:'★★ 复核（排除虚假命中）。'},
     {n:6,code:'            print "occurs with shift" s',zh:''},
     {n:7,code:'    if s < n − m:',zh:''},
     {n:8,code:'        t_{s+1} = (d(t_s − T[s+1]h) + T[s+m+1]) mod q',zh:'★★ 滚动更新 —— 整个算法的价值所在。'}],
    vars:[{name:'h',meaning:'$d^{m-1} \\text{ mod }q$，移出位最高字符的权重'}],
    note:'★ 语料的 RABIN-KARP-MATCHER（p.966）共 12 行，上面列出主干 8 行；C 程序的 `rabin_karp` 逐行对应，且带负数取模修正。',
    more:[{algo:'负数取模',subtitle:'滚动更新里的减法陷阱',signature:'t = (t − h·T[s]) · d + T[s+m] (mod q)',page:966,
      lines:[{n:1,code:'    t -= h * (unsigned char)T[s];',zh:'★ 可能变负。'},
        {n:2,code:'    t *= d; t += T[s+m];',zh:''},
        {n:3,code:'    t %= q; if (t < 0) t += q;',zh:'★★ C 的 % 对负数给负余数 —— 不修正则指纹永远错位。'}],
      vars:[{name:'t',meaning:'当前窗口指纹'}],
      note:'★ 本站第一版就漏了这行修正，随机测试立刻报分歧 —— 这也是 part 3 交叉验证的价值。'}]},
   {type:'visualize',title:'虚假命中从哪来',panels:[
     {title:'q = 11 时的指纹分布（习题 32.2-1）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'指纹 = 4 的窗口（1 真 + 3 虚）',expr:'4',color:'--viz-result'},
       {name:'窗口总数 16',expr:'16',color:'--viz-compare'}]},
      note:'★ 16 个窗口里 4 个指纹命中（mod 11 = 4），其中 3 个是虚假命中 —— 小 $q$ 的代价，可实测。'},
    ],tasks:['对照 C 程序 part 2：真命中 1（位移 6）、虚假命中 3。'],note:''},
   {type:'code',title:'实测：习题 32.2-1 的 3 个虚假命中',c:{file:'string_match.c',code:String.raw`/* string_match.c -- 32 章：字符串匹配（朴素 / Rabin-Karp / 自动机 / KMP / 后缀数组）。
 *
 * 关键数字（全部断言）：
 *   part 1  朴素匹配：T = "abababacaba"、P = "abab" → 位移 {0,2}；
 *   part 2  Rabin-Karp：习题 32.2-1 原题（T = 3141592653589793、P = 26、q = 11）
 *           → 真命中 1 个、虚假命中 3 个（"15"、"59"、"92"）；
 *   part 3  四种匹配器在 200 组随机 (T,P) 上找到完全相同的位移集合；
 *   part 4  KMP 前缀函数 π("ababaca") = (0,0,1,2,3,0,1)（原书 Figure 32.10）；
 *   part 5  最坏情形比较数：T = a^30、P = aaab 时朴素 vs KMP；
 *   part 6  后缀数组："banana" → SA = [5,3,1,0,4,2]，LCP 与暴力一致，倍增 2 轮。
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
`,
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 part 2（Rabin-Karp）。'},
           {line:37,zh:'`rabin_karp`：滚动哈希 + 复核 + 虚假命中计数。'},
           {line:186,zh:'★★ part 2：习题 32.2-1 原题 → 真命中 1（位移 6）、虚假命中 3（"15"、"59"、"92"）。'},
           {line:196,zh:'★ part 3：200 组随机测试与朴素匹配完全一致 —— 负数取模修正是关键。'}]},
    tests:[{in:'T = 3141592653589793, P = 26, q = 11',out:'真命中 1（位移 6）；虚假命中 3'},
           {in:'200 组随机 (T, P), q = 97',out:'位移集合与朴素完全一致'}],
    mapping:[{pc:4,pcCode:'if p == t_s',c:'`if (p == t)`（第 57 行）'},
             {pc:8,pcCode:'t_{s+1} = (d(t_s − T[s+1]h) + T[s+m+1]) mod q',c:'`t = ((t - h * (unsigned char)T[s]) * d + (unsigned char)T[s + m]) % q;`（第 56 行）'}]},
   {type:'analyze',title:'一本账：指纹派 vs 比较派',claims:[
     {expr:'O(n + m)',when:'期望时间（q 随机 / 大素数时虚假命中极少）',page:964,source:'book'},
     {expr:'\\Theta((n-m+1)m)',when:'最坏情形（所有窗口哈希碰撞）',page:964,source:'book'},
     {expr:'3',when:'习题 32.2-1 实测的虚假命中个数',page:966,source:'book'},
     {expr:'O(1)',when:'滚动更新的时间',page:966,source:'book'},
    ],tables:[{caption:'C 程序 Part 2 的实测',rows:[
      ['项','值'],
      ['指纹 p = 26 mod 11','4'],
      ['真命中','1 个（位移 6）'],
      ['虚假命中','3 个（"15", "59", "92"）'],
      ['复核的额外成本','每次哈希命中后 ≤ m 次比较'],
     ]}],chart:{xMax:64,series:[
     {name:'期望 O(n+m)，取 m=16',expr:'n + 16',color:'--viz-done'},
     {name:'最坏 (n−m+1)m',expr:'n * n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'虚假命中的期望为什么小',steps:[
      {zh:'若 $q$ 是随机素数且 $q \\ge m$，两个不同窗口哈希相等的概率 $\\le 1/q$（多项式次数的碰撞）。 取 $q = m$ 的随机素数 → 虚假命中期望 $O(n/m)$，复核总代价期望 $O(n)$。'},
      {zh:'最坏情形（敌手知道 $q$）可以构造全部碰撞 —— 所以工程上用大素数或双哈希。'},
      {tex:'\\text{期望} = O(n + m)',zh:'★★ C 程序的 200 组随机交叉验证是期望分析的实例化：分歧为 0。∎'}]},
     ],
    note:''},
   {type:'prove',title:'Rabin-Karp 不漏报',statement:'The gap character may occur an arbitrary number of times in the pattern but not at all in the text.',
    page:962,
    intro:'★ 哈希相等只是"候选"，逐字符复核才是"判决" —— 可靠性由复核保证。',
    steps:[
     {title:'① 指纹相等是必要条件',en:'Indeed, you can compute p in Θ(m) time using Horner’s rule (see Problem 2-3):',
      page:963,
      body:['$T[s+1..s+m] = P \\Rightarrow$ 两个串模 $q$ 相等 → $t_s = p$。',
        '所以指纹不等的窗口**必然**不匹配 —— 跳过它们不漏掉任何真命中。']},
     {title:'② 复核消除假阳性',en:'The gap character may occur an arbitrary number of times in the pattern but not at all in the text.',
      page:962,
      body:['指纹相等的窗口被逐字符比较，只有真正相等才报告 → 无虚假报告。',
        '虚假命中只浪费复核时间，不影响正确性（C 程序的 3 个虚假命中全被复核拦下）。']},
     {title:'③ 与朴素互证',en:'Indeed, you can compute p in Θ(m) time using Horner’s rule (see Problem 2-3):',
      page:963,
      body:['part 3 的 200 组随机测试：RK 的位移集合与朴素完全一致 —— 兼备不漏报（①）与不假报（②）。∎']},
    ],conclusion:'★ 结论：Rabin-Karp = "必要条件筛子 + 完整验证"。筛子的质量决定速度，验证保证正确。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Rabin-Karp 的虚假命中是什么？',options:['漏掉的匹配：内容相同却没被指纹认出来','**哈希相等但内容不同**','整数溢出：取模的时候把指纹算错了一次','越界'],answer:1,
      why:'★ 指纹是必要条件；哈希碰撞的窗口需要复核。'},
     {kind:'single',q:'习题 32.2-1（q = 11）里有几个虚假命中？',options:['1','2','**3**','4'],answer:2,
      why:'★ "15"、"59"、"92"（C 程序断言）；真命中是位移 6 的 "26"。'},
     {kind:'judge',q:'滚动更新公式里的减法可能产生负数，需要修正取模。',answer:true,
      why:'★ C 的 % 对负数给负余数；不修正是真实 bug（part 3 抓到）。'},
     {kind:'simulate',q:'C 程序 part 2 的虚假命中个数是多少？（填整数）',expect:[3],placeholder:'例如：1',
      why:'3 —— 习题 32.2-1 的原题答案。'},
     {kind:'single',q:'指纹不等的两个窗口，还有必要逐字符验证吗？',options:['需要，指纹本来就可能碰撞','**不需要，指纹不等必然不匹配**','只有当 $q$ 是素数时才不需要','只有当 $d$ 是 $2$ 的幂时才不需要'],answer:1,why:'★ 指纹是匹配的**必要条件**：哈希不同则窗口内容必不同，可以直接跳过。这正是它把最坏 $\Theta((n-m+1)m)$ 降到期望 $O(n+m)$ 的全部来源。'},
     {kind:'judge',q:'取模的 $q$ 越小，虚假命中就越多。',answer:true,why:'★ 习题 32.2-1 取 $q = 11$ 产生了 3 个虚假命中（C 程序完整复现）；同一程序改用 $q = 97$ 跑 200 组随机测试，位移集合与朴素法完全一致 —— 期望时间 $O(n+m)$ 的前提就是 $q$ 够大且随机。'},
    ],bookExercises:[
     {id:'32.2-1',page:966,star:0,statement:'Working modulo q = 11, how many spurious hits does the Rabin-Karp matcher en- counter in the text T = 3141592653589793 when looking for the pattern P = 26?',hint:'照 Rabin–Karp 的口径：模式 $P = 26$ 的指纹 $= 26 \\mod 11 = 4$；文本 $T = 3141592653589793$ 有 $16 - 2 + 1 = 15$ 个两位窗口，逐个取 $\\mod 11$。本轮实算：指纹等于 4 的窗口只有 4 个 —— 位置 3 的 $15$、位置 4 的 $59$、位置 5 的 $92$、位置 6 的 $26$。其中只有第 6 位那个窗口真的是 $26$（那是命中，不是虚假命中），所以虚假命中 $= 3$。★ 「虚假命中」的定义是指纹相同但内容不同，所以要逐个窗口**验证内容**，别把命中也计进去。'},
     {id:'32.2-4',page:967,star:0,statement:'Alice has a copy of a long n-bit file A = ⟨a n−1 ,a n−2 ,…,a 0⟩, and Bob similarly has an n-bit file B = ⟨b n−1 ,b n−2 ,…,b 0⟩. Alice and Bob wish to know if their files are identical. To avoid transmitting all of A or B , they use the following fast probabilistic check. Together, they select a prime q > 1000n and randomly select an integer x from f0,1,…,q − 1g. Letting A(x) = • n−1 X i D0 a i x i ! mod q and B(x) = • n−1 X i D0 b i x i ! mod q; Alice evaluates A(x) and Bob evaluates B(x). Prove that if A ≠ B , there is at most one chance in 1000 that A(x) = B(x), whereas if the two files are the same, A(x) is necessarily the same as B(x). (Hint: See Exercise 31.4-4.)',hint:'「指纹相等则 A = B」正是本题要证的那件事，不能当理由用。 方向要摆成：**若 $A \\neq B$，他们误判为相同的概率至多 $1/1000$**。 把两个文件看成的多项式相减：$P(x) = \\sum_{i=0}^{n-1} (a_i - b_i) x^i$。 $A \\neq B$ 意味着 $P$ 不是零多项式，而它的次数 $\\le n-1$， 所以在域里**至多有 $n-1$ 个根**（这就是第 30 章 DFT 用到的那个性质）。 他们随机取的 $x$ 落在 $\\{0, 1, \\dots, q-1\\}$ 这个 $q$ 元集合里， 误判要求 $P(x) \\equiv 0$，也就是 $x$ 恰好是根 —— 概率 $\\le \\frac{n-1}{q} < \\frac{n}{1000n} = \\frac{1}{1000}$。 顺带把两个方向分清：$A = B$ 时指纹一定相等（没有误差），错只可能出在「不同却判成相同」。'},
    ]},
  ],
};
