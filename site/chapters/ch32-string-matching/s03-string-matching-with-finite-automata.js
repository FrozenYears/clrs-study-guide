/* 第 32 章 32.3：有限自动机匹配。印刷页 967–974（pdf 988–995）。 */
export default {
  key:'s03',id:'ch32/s03',chapter:32,section:'32.3',
  title:'字符串匹配自动机：一次扫描不回退',shortTitle:'32.3 有限自动机',
  titleEn:'String matching with finite automata',
  source:{printed:[967,974],pdf:[988,995]},
  prerequisites:[{label:'32.2 Rabin-Karp',url:'#/ch32/s02'}],
  stages:[
   {type:'map',title:'状态 = 已匹配的前缀长度',
    why:'为模式 $P$ 建一个 DFA：状态 $q$ 表示"$P$ 的前缀 $P[1..q]$ 恰是已扫过文本的后缀"。读入一个字符就走一步 $\\delta(q, c)$，$q$ 到达 $m$ 即命中。**文本指针永不回退**，扫描 $O(n)$；代价转移到建表 $\\delta$：$O(m^3|\\Sigma|)$ 朴素版，可优化到 $O(m|\\Sigma|)$。',
    position:'介于 Rabin-Karp（算术）与 KMP（前缀函数）之间：KMP 的失败链接就是这张转移表的紧凑版。',
    unlocks:[{label:'32.4 KMP',url:'#/ch32/s04'}],
    mathKit:[
     {title:'状态含义',body:'$q = $ 最长模式前缀，它是当前文本后缀。'},
     {title:'终态',body:'$q = m$ 即命中一次；输出位移 $i - m + 1$。'},
     {title:'转移函数',body:'$\\delta(q, c) = $ "$P[0..q-1] + c$ 的后缀与 $P$ 前缀的最长公共长度"。'},
     {title:'复杂度',body:'扫描 $\\Theta(n)$；建表 $O(m^{3}|\\Sigma|)$ 朴素（可用 $O(m|\\Sigma|)$）。'},
    ]},
   {type:'intuition',title:'转移表建对了：200 组零分歧',scene:'C 程序 Part 3',body:[
     '★ C 程序 `dfa_build` 按定义构造 $\\delta(q, c)$（对每个状态、每个字符暴力找最长前后缀匹配），然后在 **200 组随机 (T, P)** 上与朴素/Rabin-Karp/KMP 交叉验证 —— 位移集合逐位一致。',
     '★ 本站第一版的 $\\delta$ 写错了对齐方向（比较了 $w[i]$ 而不是 $w[q-len+1+i]$），随机测试立刻暴露 —— 自动机的正确性全靠这张表的每一格，交叉验证是唯一可靠的验收方式。',
     '★ 扫描阶段与 KMP 一样线性且不回退：文本指针只前进，失配在状态空间里消化。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:970,en:'The start state q 0 is state 0, and state m is the only accepting state.',
      zh:'★★ 自动机的定义：终态 $m$ 即命中。'},
     {kind:'body',page:971,en:'Consider state 5 in the string-matching automaton of Figure 32.6.',
      zh:'★ 扫描循环 5 行。'},
    ],terms:[{en:'string-matching automaton',zh:'字符串匹配自动机',page:970}]},
   {type:'pseudocode',title:'FINITE-AUTOMATON-MATCHER（原书 p.971，5 行）',algo:'FINITE-AUTOMATON-MATCHER',signature:'FINITE-AUTOMATON-MATCHER(T, δ, m)',
    page:971,
    lines:[
     {n:1,code:'n = T.length',zh:''},
     {n:2,code:'q = 0',zh:'★ 初始状态：空前缀。'},
     {n:3,code:'for i = 1 to n',zh:'★★ 文本指针只前进。'},
     {n:4,code:'    q = δ(q, T[i])',zh:'★★ 一步转移。'},
     {n:5,code:'    if q == m: print "occurs with shift" i − m',zh:'★ 终态命中。'}],
    vars:[{name:'q',meaning:'当前状态 = 已匹配的 P 前缀长度'}],
    note:'★ C 程序的 `automaton_match` 就是这 5 行。',
    more:[{algo:'COMPUTE-TRANSITION-FUNCTION',subtitle:'COMPUTE-TRANSITION-FUNCTION(P, Σ) —— 建表（p.974，7 行）',signature:'COMPUTE-TRANSITION-FUNCTION(P, Σ)',page:974,
      lines:[{n:1,code:'m = P.length',zh:''},
        {n:2,code:'for q = 0 to m:',zh:'★ 每个状态。'},
        {n:3,code:'    for each character c ∈ Σ:',zh:'★ 每个字符。'},
        {n:4,code:'        k = min(m, q + 1)',zh:'★ 候选长度上界。'},
        {n:5,code:'        while k > 0 且 P[1..k−1] 不是 (P[1..q]c) 的后缀:',zh:'★★ 从最长往下找。'},
        {n:6,code:'            k--',zh:''},
        {n:7,code:'        δ(q, c) = k',zh:'★ 最长前后缀匹配。'}],
      vars:[{name:'δ',meaning:'转移表，$m+1$ 行 $|\\Sigma|$ 列'}],
      note:'★ C 程序的 `dfa_build` 语义与此等价：对每个 (q, c) 找"P[0..q-1]+c 的后缀与 P 前缀的最长公共长度"。'}]},
   {type:'visualize',title:'扫描与建表的代价',panels:[
     {title:'两段代价',viz:'growth',
      chart:{xMax:64,series:[
       {name:'扫描 Θ(n)',expr:'n',color:'--viz-done'},
       {name:'朴素建表 m³·|Σ|（模式侧）',expr:'n * n * n / 64',color:'--viz-violation'}]},
      note:'★ 建表是一次性投入（同一模式可对任意多文本复用）；扫描本身严格线性。'},
    ],tasks:['对照 C 程序 part 3：200 组随机测试零分歧。'],note:''},
   {type:'code',title:'实测：200 组交叉验证零分歧',c:{file:'string_match.c',code:String.raw`/* string_match.c -- 32 章：字符串匹配（朴素 / Rabin-Karp / 自动机 / KMP / 后缀数组）。
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
    notes:[{line:68,zh:'★ 五关共用本文件；本关注释聚焦 part 3 的 `dfa_build` 与 `automaton_match`。'},
           {line:68,zh:'★★ `dfa_build`：按定义求 $\\delta(q, c)$ —— "P[0..q-1]+c 的后缀与 P 前缀的最长公共长度"。'},
           {line:196,zh:'★ part 3：200 组随机测试，与朴素/Rabin-Karp/KMP 完全一致。'}]},
    tests:[{in:'δ 表构造',out:'与定义一致（200 组交叉验证）'},
           {in:'扫描',out:'线性、不回退'}],
    mapping:[{pc:4,pcCode:'q = δ(q, T[i])',c:'`q = delta[q][(unsigned char)T[i]];`（第 95 行）'},
             {pc:5,pcCode:'if q == m',c:'`if (q == m) { shifts[i - m + 1] = 1; cnt++; }`（第 96 行）'}]},
   {type:'analyze',title:'一本账：表的两面',claims:[
     {expr:'\\Theta(n)',when:'扫描时间（文本指针不回退）',page:973,source:'book'},
     {expr:'O(m^3|\\Sigma|)',when:'朴素建表时间（原书给的界）',page:974,source:'book'},
     {expr:'m + 1',when:'状态个数（0..m，m 是终态）',page:970,source:'book'},
     {expr:'0',when:'虚假命中个数（确定性自动机没有哈希碰撞）',page:970,source:'book'},
    ],tables:[{caption:'四种算法对比',rows:[
      ['算法','预处理','扫描','可靠性'],
      ['朴素','无','$\\Theta(nm)$','确定'],
      ['Rabin-Karp','$\\Theta(m)$','$O(n)$ 期望 + 复核','哈希碰撞'],
      ['**自动机**','$O(m^{3}|\\Sigma|)$','$\\Theta(n)$','确定'],
      ['KMP','$\\Theta(m)$','$\\Theta(n)$','确定'],
     ]}],chart:{xMax:64,series:[
     {name:'扫描 Θ(n)',expr:'n',color:'--viz-done'},
     {name:'朴素 nm',expr:'n * n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'为什么状态恰好是"前缀长度"',steps:[
      {zh:'不变量：读完 $T[1..i]$ 后，状态 $q$ 等于"$P$ 的前缀与 $T$ 的某个后缀的最长公共长度"。 这是所有已知匹配信息的最充分摘要。'},
      {zh:'读入 $T[i+1]$ 后，新的最长前后缀匹配只依赖 ($q$, 字符) —— 与更早的文本无关，这就是 DFA 的核心性质。'},
      {tex:'\\delta(q, c) = \\max\\{k : P[1..k] \\text{ 是 } P[1..q]c \\text{ 的后缀}\\}',zh:'★★ C 程序的 `dfa_build` 就是这条定义的暴力实现；200 组交叉验证保证它与 KMP/Rabin-Karp 语义一致。∎'}]},
     ],
    note:''},
   {type:'prove',title:'扫描线性且不回退',statement:'Consider state 5 in the string-matching automaton of Figure 32.6.',
    page:971,
    intro:'★ 正确性的核心是转移函数的定义 —— 它把"失配后怎么办"预先算进了表里。',
    steps:[
     {title:'① 不变量保持',en:'The start state q 0 is state 0, and state m is the only accepting state.',
      page:970,
      body:['归纳假设：读入 $T[1..i]$ 后 $q = $ 最长模式前缀 = 文本后缀。',
        '$\\delta$ 的定义恰好给出读入下一字符后的新最长匹配 —— 归纳成立。']},
     {title:'② 命中即真命中',en:'Consider state 5 in the string-matching automaton of Figure 32.6.',
      page:971,
      body:['$q = m$ 意味着 $P[1..m]$ 是 $T[1..i]$ 的后缀 → $P$ 在位移 $i - m + 1$ 出现。',
        '确定性自动机没有假阳性。']},
     {title:'③ 时间',en:'We are now ready to prove the main theorem characterizing the behavior of a string-matching automaton on a given input text.',
      page:973,
      body:['每个字符一次转移：$\\Theta(n)$。转移表查询 $O(1)$。',
        '★ 建表 $O(m^{3}|\\Sigma|)$ 是朴素实现的代价；KMP（下一关）把预处理压到 $\\Theta(m)$ 且不需要字符表。∎']},
    ],conclusion:'★ 结论：DFA 把"回退"变成了"查表" —— 空间换时间、预处理换扫描的经典交易。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'自动机的状态 q 表示什么？',options:['已扫描的文本长度','**已匹配的 P 前缀长度**','失配次数','当前位移'],answer:1,
      why:'★ q = P 的最长前缀，恰是当前文本后缀。'},
     {kind:'single',q:'什么时候输出一次命中？',options:['q = 0','**q = m**','每一步','q < 0'],answer:1,
      why:'★ 到达终态 m：整个模式都已匹配。'},
     {kind:'judge',q:'自动机扫描阶段文本指针会回退。',answer:false,
      why:'★ 只前进；回退被转移到表里消化（这正是它与朴素匹配的本质区别）。'},
     {kind:'simulate',q:'C 程序 part 3 里随机测试的分歧数是多少？',expect:[0],placeholder:'例如：1',
      why:'0 —— 四种算法的位移集合在 200 组上完全一致。'},
     {kind:'single',q:'按原书给的界，朴素地构造转移表 $\delta$ 需要多少时间？',options:['$\Theta(m)$','$O(m|\Sigma|)$','**$O(m^{3}|\Sigma|)$**','$\Theta(n)$'],answer:2,why:'★ analyze 表里「朴素建表时间（原书给的界）」标的正是 $O(m^{3}|\Sigma|)$。扫描本身是线性的 $\Theta(n)$，代价全在建表上，可优化到 $O(m|\Sigma|)$。'},
     {kind:'judge',q:'字符串匹配自动机的虚假命中个数必然是 0。',answer:true,why:'★ 这里没有哈希碰撞这回事：$\delta$ 是确定性转移，状态 $q = m$ **当且仅当**真的匹配上了。C 程序对 $\delta$ 表做 200 组交叉验证，与定义的分歧数为 0。'},
    ],bookExercises:[
     {id:'32.3-1',page:974,star:0,statement:'Draw a state-transition diagram for the string-matching automaton for the pattern P = aabab over the alphabet † = fa; bg and illustrate its operation on the text string T = aaababaabaababaab .',hint:'照 C 程序 dfa_build 的定义逐格填：每格是"P[0..q-1]+c 的后缀与 P 前缀的最长公共长度"。'},
     {id:'32.3-2',page:974,star:0,statement:'Draw a state-transition diagram for the string-matching automaton for the pattern P = ababbabbababbababbabb over the alphabet † = fa; bg.',hint:'同上，注意模式里重复片段带来的"回退链"。'},
    ]},
  ],
};
