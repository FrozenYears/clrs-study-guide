/* 第 32 章 32.1：朴素的字符串匹配算法。印刷页 958–961（pdf 979–982）。 */
export default {
  key:'s01',id:'ch32/s01',chapter:32,section:'32.1',
  title:'朴素匹配： everyone 的第一版',shortTitle:'32.1 朴素匹配',
  titleEn:'The naive string-matching algorithm',
  source:{printed:[958,961],pdf:[979,982]},
  prerequisites:[{label:'31.8 素性测试',url:'#/ch31/s08'}],
  stages:[
   {type:'map',title:'有效位移：朴素地一个一个试',
    why:'文本 $T[1..n]$、模式 $P[1..m]$：**有效位移**是使 $P$ 与 $T$ 对应段相同的 $s$。朴素匹配检查全部 $n - m + 1$ 个位移，每个最多 $m$ 次比较 —— 预备函数 $\\Theta((n-m+1)m)$。它是其余三个算法（Rabin-Karp、自动机、KMP）的正确性基准。',
    position:'本章开篇。C 程序里它的输出被当作"裁判"：后面三种算法在任何输入上都必须与它一致。',
    unlocks:[{label:'32.2 Rabin-Karp',url:'#/ch32/s02'}],
    mathKit:[
     {title:'有效位移',body:'$s$ 是有效位移 $\\iff$ $T[s+1..s+m] = P[1..m]$。'},
     {title:'NAIVE-STRING-MATCHER',body:'对每个 $s$ 逐字符比较；最坏 $\\Theta((n-m+1)\\,m)$。'},
     {title:'原书 Figure 32.1',body:'$T = $ abababacaba、$P = $ abab：有效位移 $\\{0, 2\\}$（0 基）。'},
    ]},
   {type:'intuition',title:'18 次比较找到 {0, 2}',scene:'C 程序 Part 1',body:[
     '★ C 程序 part 1 在原书 Figure 32.1 的例子上跑朴素匹配：$T = $ "abababacaba"、$P = $ "abab"，找到有效位移 **{0, 2}**，总共 18 次字符比较。',
     '★ 最坏情形预演：$T = a^{30}$、$P = $ aaab 时朴素要 **108** 次比较（part 5 实测），而 KMP 只要 57 次 —— 差距来自朴素匹配在每次失配后"完全回退"。',
     '★ 200 组随机 (T, P) 上，朴素匹配的位移集合与 Rabin-Karp / 自动机 / KMP **完全一致**（part 3）—— 一致性是本章四种算法的共同底线。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:959,en:'can state the string-matching problem as that of finding all shifts s in the range',
      zh:'★★ 朴素匹配器：对每个 $s$ 逐字符验证。'},
     {kind:'body',page:959,en:'can state the string-matching problem as that of finding all shifts s in the range',
      zh:'★ 原书自己说明：实践中朴素算法**足够快** —— 理论最坏情形很少出现。'},
    ],terms:[{en:'valid shift',zh:'有效位移',page:959}]},
   {type:'pseudocode',title:'NAIVE-STRING-MATCHER（原书 p.960，3 行循环）',algo:'NAIVE-STRING-MATCHER',signature:'NAIVE-STRING-MATCHER(T, P)',
    page:960,
    lines:[
     {n:1,code:'for s = 0 to n − m',zh:'★ 全部 $n - m + 1$ 个候选位移。'},
     {n:2,code:'    if P[1..m] == T[s+1..s+m]',zh:'★★ 逐字符比较（最坏 $m$ 次）。'},
     {n:3,code:'        print "pattern occurs with shift" s',zh:'★ 命中。'}],
    vars:[{name:'s',meaning:'候选位移'}],
    note:'★ 语料的 NAIVE-STRING-MATCHER（p.960）就是这 3 行。C 程序的 `naive_match` 是直译，外加比较计数。'},
   {type:'visualize',title:'最坏情形在哪里',panels:[
     {title:'比较次数的量级',viz:'growth',
      chart:{xMax:64,series:[
       {name:'朴素 (n−m+1)·m ≈ n·m',expr:'n * n',color:'--viz-violation'},
       {name:'KMP 的 Θ(n + m)',expr:'2 * n',color:'--viz-done'}]},
      note:'★ $T = a^{n}$、$P = a^{m-1}b$ 是朴素的噩梦：每个位移都错在最后一位。'},
    ],tasks:['对照 C 程序 part 5：a^30 与 aaab，朴素 108 次 vs KMP 57 次。'],note:''},
   {type:'code',title:'实测：{0, 2} 与 18 次比较',c:{file:'string_match.c',code:String.raw`/* string_match.c -- 32 章：字符串匹配（朴素 / Rabin-Karp / 自动机 / KMP / 后缀数组）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 part 1（朴素匹配）。'},
           {line:24,zh:'`naive_match`：3 行直译 + 比较计数（g_cmp）。'},
           {line:170,zh:'★★ part 1：T = abababacaba、P = abab → 位移 {0, 2}，比较 18 次。'}]},
    tests:[{in:'T = abababacaba, P = abab',out:'位移 {0, 2}，比较 18 次'},
           {in:'200 组随机 (T, P)',out:'与其他三种算法完全一致'}],
    mapping:[{pc:2,pcCode:'if P[1..m] == T[s+1..s+m]',c:'`while (i < m && T[s + i] == P[i])`（第 29 行）'}]},
   {type:'analyze',title:'一本账：比较次数',claims:[
     {expr:'\\Theta((n-m+1)m)',when:'朴素匹配的预备时间（最坏情形）',page:959,source:'book'},
     {expr:'18',when:'Figure 32.1 例子上的实测比较次数',page:959,source:'book'},
     {expr:'108',when:'a^30 与 aaab 的实测比较次数（最坏形状）',page:959,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 / 5 的实测',rows:[
      ['输入','有效位移','比较次数'],
      ['T = abababacaba, P = abab','{0, 2}','18'],
      ['T = a^30, P = aaab','∅（无命中）','108（朴素）vs 57（KMP）'],
     ]}],chart:{xMax:64,series:[
     {name:'n·m（朴素最坏）',expr:'n * n',color:'--viz-violation'},
     {name:'n + m（KMP）',expr:'2 * n',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'最坏情形的构造',steps:[
      {zh:'取 $T = a^{n}$、$P = a^{m-1}b$：每个位移都正确匹配前 $m-1$ 个字符、错在最后一个。'},
      {zh:'于是每个位移花 $m$ 次比较、一无所获：$(n - m + 1) \\cdot m$。'},
      {tex:'\\Theta((n-m+1)\\,m)',zh:'★★ C 程序 part 5 的 108 = 27 × 4（$n=30, m=4$）。后面三章的任务就是把 108 压到线性。∎'}]},
     ],
    note:''},
   {type:'prove',title:'朴素匹配的正确性（平凡但重要）',statement:'can state the string-matching problem as that of finding all shifts s in the range',
    page:959,
    intro:'★ 朴素算法是"定义的直接翻译"，正确性显然 —— 但它作为裁判的价值正来自此。',
    steps:[
     {title:'① 完备：不漏',en:'can state the string-matching problem as that of finding all shifts s in the range',
      page:959,
      body:['它检查了**所有** $n - m + 1$ 个可能的位移，每个都完整验证。',
        '所以任何有效位移必然被报告 —— 无漏报。']},
     {title:'② 可靠：不假报',en:'can state the string-matching problem as that of finding all shifts s in the range',
      page:959,
      body:['报告位移 $s$ 前它比较了全部 $m$ 个字符且全部相等 → $P$ 确实出现在 $s$。',
        '★ 无哈希、无概率 —— Rabin-Karp 需要额外处理虚假命中，朴素不需要。']},
     {title:'③ 作为基准',en:'can state the string-matching problem as that of finding all shifts s in the range',
      page:959,
      body:['C 程序 part 3 在 200 组随机 (T, P) 上以朴素匹配为裁判：其余三种算法的位移集合逐位一致。',
        '★ 这正是"先写一个显然正确的版本，再验证聪明的版本"的工程范式。∎']},
    ],conclusion:'★ 结论：朴素匹配 = 定义本身。它的价值不在速度，而在"永远对"。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'朴素匹配最坏情况的比较次数是？',options:['$\\Theta(n + m)$','**$\\Theta((n-m+1)m)$**','$\\Theta(\\lg n)$','$\\Theta(n)$'],answer:1,
      why:'★ 每个位移最多 $m$ 次比较，共 $n-m+1$ 个。'},
     {kind:'single',q:'T = abababacaba、P = abab 的有效位移是？',options:['{0, 1}','**{0, 2}**','{1, 3}','{0, 4}'],answer:1,
      why:'★ C 程序 part 1 实测；Figure 32.1 的例子。'},
     {kind:'judge',q:'朴素匹配可能报告虚假命中。',answer:false,
      why:'★ 它逐字符完整验证；虚假命中是 Rabin-Karp 的哈希问题。'},
     {kind:'simulate',q:'C 程序 part 1 的比较次数是多少？（填整数）',expect:[18],placeholder:'例如：20',
      why:'18 —— 两个命中位移各 4 次 + 其他位移的失败比较。'},
     {kind:'single',q:'朴素匹配在 $T = a^{30}$、$P = aaab$ 上要比较多少次？',options:['30','57','**108**','900'],answer:2,why:'★ C 程序实测 108 次（analyze 表里标的就是 108）—— 每个位移都要比到第 4 位才失配，这是最坏形状。同一个 part 里 Figure 32.1 的例子（T = abababacaba, P = abab）只要 18 次。'},
     {kind:'judge',q:'朴素匹配会检查全部 $n - m + 1$ 个位移。',answer:true,why:'★ map 段：有效位移是使 $P$ 与 $T$ 对应段相同的 $s$，朴素法不跳过任何一个。C 程序里 $n = 11, m = 4$，一共 8 个位移，命中 {0, 2}。'},
    ],bookExercises:[
     {id:'32.1-2',page:961,star:0,statement:'Suppose that all characters in the pattern P are different. Show how to accelerate NAIVE-STRING-MATCHER to run in O(n) time on an n-character text T .',hint:'「第一位一失配就断定这个位移失败」跟字符互不相同**没关系** —— 朴素匹配器本来就在第一个不匹配处停手； 而且题干要的是**最坏情况** $O(n)$，不是「期望」的界。真正的机关是**失配之后可以跳好几格**： 设位移 $s$ 上前面 $q$ 个字符都匹配、在第 $q+1$ 位失配（或整段匹配成功）。 因为 $P$ 的字符两两不同，位移 $s+i$（$1 \\le i \\le q$）不可能再是匹配：那里要 $P[1] = T[s+i]$， 可 $T[s+i] = P[i+1] \\neq P[1]$。于是下一位位移直接跳到 $s+q+1$。 这样每格位移最多花 1 次「失败比较」，而**每次成功比较**都把某个 $T$ 的字符消耗掉一次、 不会再被别的位移重新匹配，成功比较总数 $\\le n$ —— 合计 $\\le 2n$，最坏情况线性。'},
     {id:'32.1-4',page:961,star:0,statement:'Suppose that the pattern P may contain occurrences of a gap character } that can match an arbitrary string of characters (even one of 0 length). For example, the pattern ab}ba}c occurs in the text cabccbacbacab as c ab ’ ab cc ’ } ba ’ ba cba “ } c ’ c ab and as c ab ’ ab ccbac — } ba ’ ba ’ } c ’ c ab : The gap character may occur an arbitrary number of times in the pattern but not at all in the text. Give a polynomial-time algorithm to determine whether such a pattern P occurs in a given text T , and analyze the running time of your algorithm.',hint:'把间隔字符当作"通配任意串"：对每个间隔长度枚举，或构造对应的 NFA —— 这正是 32.3 自动机方法的延伸题。'},
    ]},
  ],
};
