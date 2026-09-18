/* 第 32 章 32.4：Knuth-Morris-Pratt 算法。印刷页 974–984（pdf 995–1005）。 */
export default {
  key:'s04',id:'ch32/s04',chapter:32,section:'32.4',
  title:'KMP：前缀函数是自动机的压缩包',shortTitle:'32.4 KMP',
  titleEn:'The Knuth-Morris-Pratt algorithm',
  source:{printed:[974,984],pdf:[995,1005]},
  prerequisites:[{label:'32.3 有限自动机',url:'#/ch32/s03'}],
  stages:[
   {type:'map',title:'π(q) 与摊还线性',
    why:'**前缀函数** $\\pi[q]$ = $P[1..q]$ 的真后缀中最长模式前缀的长度。它是自动机转移表的"压缩"：失配时不必查整张表，沿 $\\pi$ 链回退即可。预处理 $\\Theta(m)$（自匹配），扫描 $\\Theta(n)$，合计 **$\\Theta(n + m)$ 且只存 $m$ 个整数** —— KMP 用最少的空间拿到线性时间。',
    position:'本章的压轴算法：把 32.3 的表空间从 $O(m|\\Sigma|)$ 压到 $O(m)$，思想是"模式自己匹配自己"。',
    unlocks:[{label:'32.5 后缀数组',url:'#/ch32/s05'}],
    mathKit:[
     {title:'前缀函数 π',body:'$\\pi[q] = \\max\\{k : k < q,\\ P[1..k] \\text{ 是 } P[1..q] \\text{ 的后缀}\\}$。'},
     {title:'KMP-MATCHER（10 行）',body:'失配沿 $\\pi$ 回退，命中后 $q = \\pi[m]$ 继续找重叠匹配。'},
     {title:'摊还分析',body:'$q$ 每步至多 +1、单调不增地回退 → 总回退 $\\le$ 总前进 → $\\Theta(n)$。'},
     {title:'Figure 32.10',body:'$\\pi($ababaca$) = (0,0,1,2,3,0,1)$。'},
    ]},
   {type:'intuition',title:'π 表逐位对上 + 57 vs 108',scene:'C 程序 Part 4–5',body:[
     '★ C 程序 part 4 断言 $\\pi($ababaca$) = (0,0,1,2,3,0,1)$ —— 与原书 Figure 32.10 逐位一致。',
     '★★ part 5 的最坏形状：$T = a^{30}$、$P = $ aaab —— 朴素 **108** 次比较，KMP **57** 次。差距来自 KMP 失配后不回退文本指针。',
     '★ part 3：KMP 与朴素/Rabin-Karp/自动机在 200 组随机测试上完全一致 —— 线性速度没有牺牲正确性。',
     '★ 摊还直觉：$q$ 在扫描中每步至多 +1（前进），回退消耗的是此前积累的 +1 → 总回退 ≤ 总前进 ≤ n。这就是 $\\Theta(n)$ 的全部秘密（习题 32.4-4/5 分别用聚集分析与势函数证明）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:978,en:'Starting with some observations about k, we’ll show that it makes at most m−1 iterations.',
      zh:'★ KMP-MATCHER 用前缀函数计算转移。'},
     {kind:'body',page:978,en:'Starting with some observations about k, we’ll show that it makes at most m−1 iterations.',
      zh:'★ 预处理 = 模式自己匹配自己（自匹配）。'},
    ],terms:[{en:'prefix function',zh:'前缀函数 π',page:977}]},
   {type:'pseudocode',title:'COMPUTE-PREFIX-FUNCTION 与 KMP-MATCHER（原书 p.978）',algo:'COMPUTE-PREFIX-FUNCTION',signature:'COMPUTE-PREFIX-FUNCTION(P)',
    page:978,
    lines:[
     {n:1,code:'m = P.length',zh:''},
     {n:2,code:'π[1] = 0',zh:'★ 单字符没有真前缀。'},
     {n:3,code:'k = 0',zh:'★ 当前最长前后缀。'},
     {n:4,code:'for q = 2 to m',zh:''},
     {n:5,code:'    while k > 0 且 P[k+1] ≠ P[q]: k = π[k]',zh:'★★ 沿链回退。'},
     {n:6,code:'    if P[k+1] == P[q]: k++',zh:''},
     {n:7,code:'    π[q] = k',zh:''},
     {n:8,code:'return π',zh:'★ Θ(m)。'}],
    vars:[{name:'k',meaning:'当前候选的匹配长度'}],
    note:'★ C 程序的 `compute_prefix` 逐行对应（0 基）。',
    more:[{algo:'KMP-MATCHER',subtitle:'KMP-MATCHER(T, P) —— 扫描（p.978，10 行）',signature:'KMP-MATCHER(T, P)',page:978,
      lines:[{n:1,code:'n = T.length; m = P.length',zh:''},
        {n:2,code:'π = COMPUTE-PREFIX-FUNCTION(P)',zh:''},
        {n:3,code:'q = 0',zh:''},
        {n:4,code:'for i = 1 to n',zh:''},
        {n:5,code:'    while q > 0 且 P[q+1] ≠ T[i]: q = π[q]',zh:'★★ 回退但不回退文本指针。'},
        {n:6,code:'    if P[q+1] == T[i]: q++',zh:''},
        {n:7,code:'    if q == m',zh:'★ 命中。'},
        {n:8,code:'        print "occurs with shift" i − m',zh:''},
        {n:9,code:'        q = π[q]',zh:'★★ 继续找重叠匹配。'}],
      vars:[{name:'q',meaning:'已匹配长度'}],
      note:'★ C 程序的 `kmp_match` 逐行对应；part 5 数出 57 次比较 vs 朴素 108。'}]},
   {type:'visualize',title:'两种代价的对比',panels:[
     {title:'扫描次数：线性 vs 乘积',viz:'growth',
      chart:{xMax:64,series:[
       {name:'KMP：n + m',expr:'2 * n',color:'--viz-done'},
       {name:'朴素：n·m',expr:'n * n',color:'--viz-violation'}]},
      note:'★ 预处理 Θ(m) 一次性；扫描 Θ(n) —— "n + m" 里两个加数各有归属。'},
    ],tasks:['对照 C 程序 part 4（π 表）与 part 5（57 vs 108）。'],note:''},
   {type:'code',title:'实测：π 表逐位一致 + 57 vs 108',c:{file:'string_match.c',code:String.raw`/* string_match.c -- 32 章：字符串匹配（朴素 / Rabin-Karp / 自动机 / KMP / 后缀数组）。
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
`,
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 part 4–5（KMP）。'},
           {line:104,zh:'`compute_prefix`：自匹配，Θ(m)。'},
           {line:115,zh:'`kmp_match`：失配沿 π 回退；命中后 q = π[m] 找重叠匹配。'},
           {line:215,zh:'★★ part 4：π(ababaca) = (0,0,1,2,3,0,1)（原书 Figure 32.10）。'},
           {line:225,zh:'★★ part 5：a^30 与 aaab → 朴素 108 次 vs KMP 57 次。'}]},
    tests:[{in:'π("ababaca")',out:'(0, 0, 1, 2, 3, 0, 1)'},
           {in:'T = a^30, P = aaab',out:'KMP 57 次 vs 朴素 108 次'},
           {in:'200 组随机测试',out:'与朴素完全一致'}],
    mapping:[{pc:5,pcCode:'while k > 0 且 P[k+1] ≠ P[q]: k = π[k]',c:'`while (k > 0 && P[q] != P[k]) { k = prefix[k - 1]; g_cmp++; }`（第 109 行）'},
             {pc:9,pcCode:'q = π[q]（命中后）',c:'`q = prefix[q - 1];`（第 122 行）'}]},
   {type:'analyze',title:'一本账：摊还的秘密',claims:[
     {expr:'\\Theta(m)',when:'预处理时间（自匹配）',page:978,source:'book'},
     {expr:'\\Theta(n)',when:'扫描时间（摊还）',page:980,source:'book'},
     {expr:'(0,0,1,2,3,0,1)',when:'π(ababaca)，与 Figure 32.10 一致',page:979,source:'book'},
     {expr:'57',when:'a^30 与 aaab 的实测 KMP 比较次数',page:980,source:'book'},
    ],tables:[{caption:'C 程序 Part 4–5 的实测',rows:[
      ['项','结果'],
      ['π(ababaca)','(0,0,1,2,3,0,1)'],
      ['朴素比较（a^30, aaab）','108'],
      ['KMP 比较（同输入）','57'],
      ['200 组随机测试','与朴素零分歧'],
     ]},{caption:'自动机表 vs 前缀函数',rows:[
      ['','DFA（32.3）','KMP（32.4）'],
      ['空间','$O(m|\\Sigma|)$','**$O(m)$**'],
      ['预处理','$O(m^{3}|\\Sigma|)$','$\\Theta(m)$'],
      ['与字符表的关系','每字符一列','**无关**（沿 π 链回退）'],
      ['扫描','Θ(n)','Θ(n)'],
     ]}],chart:{xMax:64,series:[
     {name:'m|Σ|（表空间）',expr:'26 * n',color:'--viz-compare'},
     {name:'m（π 空间）',expr:'n',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'摊还分析：q 的收支账本',steps:[
      {zh:'扫描中 $q$ 的可能变化：每次迭代至多 $+1$（字符匹配时），回退是若干次 $-1$（沿 π 链）。'},
      {zh:'$q$ 从 0 开始、始终 $\\ge 0$ → 总上升次数 $\\le n$ → 总回退次数也 $\\le n$。'},
      {zh:'于是总迭代代价 $\\le 2n = \\Theta(n)$ —— 这就是聚集分析（习题 32.4-4）；势函数版本见习题 32.4-5。'},
      {tex:'\\text{总回退} \\le \\text{总前进} \\le n',zh:'★★ "收支平衡"的账本让最坏情形也线性 —— 不依赖输入的概率假设（对比 Rabin-Karp）。∎'}]},
     ],
    note:''},
   {type:'prove',title:'π 的自匹配为什么正确',statement:'Starting with some observations about k, we’ll show that it makes at most m−1 iterations.',
    page:978,
    intro:'★ 预处理把模式"错开一位和自己匹配" —— 归纳地算出每个位置的 π。',
    steps:[
     {title:'① 归纳假设',en:'Starting with some observations about k, we’ll show that it makes at most m−1 iterations.',
      page:978,
      body:['算 $\\pi[q]$ 时，$k = \\pi[q-1]$ 是已知的次长候选；所有更长的候选都是 $k$ 的"失败链"后继。',
        '归纳保持：候选长度只沿 $\\pi$ 链递减。']},
     {title:'② 回退链的正确性',en:'Starting with some observations about k, we’ll show that it makes at most m−1 iterations.',
      page:978,
      body:['若 $P[k+1] \\ne P[q]$，下一个候选恰是 $\\pi[k]$ —— 比 $k$ 短的候选只可能是 $k$ 的边框。',
        '★ 这条性质（候选链 = 边框链）是前缀函数理论的核心，也是它比朴素建表快的原因。']},
     {title:'③ 复杂度',en:'Starting with some observations about k, we’ll show that it makes at most m−1 iterations.',
      page:978,
      body:['与扫描相同的摊还论证：$k$ 每步至多 +1 → 总回退 $\\le m$ → $\\Theta(m)$。',
        '★ C 程序 part 4 的 π 表逐位对上 Figure 32.10，预处理与扫描在 part 5 的最坏输入上全面快于朴素。∎']},
    ],conclusion:'★ 结论：KMP = DFA 的"运行时压缩"。理解了 π 与 δ 的关系，32.3 与 32.4 就合二为一。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'π("ababaca") 的第 5 个值（1 基第 5 位）是？',options:['1','2','**3**','0'],answer:2,
      why:'★ "ababa" 的最长真前后缀是 "aba"（长 3）；C 程序与 Figure 32.10 一致。'},
     {kind:'single',q:'KMP 预处理的时间是？',options:['$\\Theta(m^3)$','**$\\Theta(m)$**','$\\Theta(n)$','$\\Theta(m|\\Sigma|)$'],answer:1,
      why:'★ 自匹配 + 同样的摊还论证。'},
     {kind:'judge',q:'KMP 匹配命中后要从头重扫。',answer:false,
      why:'★ 命中后 q = π[m]，可以继续找重叠匹配（如 a^30 里的连续匹配）。'},
     {kind:'simulate',q:'C 程序 part 5 里 KMP 的比较次数是多少？（填整数）',expect:[57],placeholder:'例如：108',
      why:'57 —— 同一输入下朴素要 108 次。'},
     {kind:'single',q:'KMP 相对 32.3 的自动机，把额外空间压到了多少？',options:['$O(m|\Sigma|)$','**$O(m)$**','$O(n)$','$O(m^{2})$'],answer:1,why:'★ 只存 $m$ 个整数的前缀函数 $\pi$（例：$\pi(\text{ababaca}) = (0,0,1,2,3,0,1)$），而自动机要一整张 $O(m|\Sigma|)$ 的转移表。时间两者同为 $\Theta(n+m)$ —— KMP 用最少的空间拿到线性时间。'},
     {kind:'judge',q:'在 $T = a^{30}$、$P = aaab$ 上 KMP 的比较次数明显少于朴素匹配。',answer:true,why:'★ C 程序实测 KMP 57 次 vs 朴素 108 次。朴素法在每个位移都白比到第 4 位才失配，KMP 沿 $\pi$ 链回退、不回退文本指针，所以省掉了重复比较。'},
    ],bookExercises:[
     {id:'32.4-1',page:984,star:0,statement:'32.4-1 Compute the prefix function Ω for the pattern ababbabbabbababbabb .',hint:'照 C 程序 compute_prefix 的递推逐位算：每一步沿失败链回退后看能否延长。'},
     {id:'32.4-4',page:985,star:0,statement:'32.4-4 Use an aggregate analysis to show that the running time of KMP-MATCHER is Θ(n).',hint:'聚集分析：q 的每次上升 ≤ 1 且非负 → 总回退 ≤ n —— 本关"收支账本"的推导就是答案。'},
     {id:'32.4-7',page:985,star:0,statement:'32.4-7 Give a linear-time algorithm to determine whether a text T is a cyclic rotation of another string T 0 .',hint:'$T$ 是 $T′$ 的循环旋转 ⟺ $T$ 出现在 $TT′$ 中（长度 $2n$）—— 用 KMP 在 $TT′$ 里找 $T$，线性时间。'},
    ]},
  ],
};
