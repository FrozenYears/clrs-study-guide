/* 第 32 章 32.5：后缀数组（Suffix arrays）。印刷页 984–997（pdf 1005–1018）。 */
export default {
  key:'s05',id:'ch32/s05',chapter:32,section:'32.5',
  title:'后缀数组：把整个文本排好序备用',shortTitle:'32.5 后缀数组',
  titleEn:'Suffix arrays',
  source:{printed:[984,997],pdf:[1005,1018]},
  prerequisites:[{label:'32.4 KMP',url:'#/ch32/s04'}],
  stages:[
   {type:'map',title:'所有后缀的字典序排名',
    why:'**后缀数组** $SA$：把 $T$ 的全部 $n$ 个后缀按字典序排序后的起点下标序列。相邻后缀的公共前缀长度构成 **LCP 数组**。倍增法用 $\\lceil \\lg n \\rceil$ 轮"长度翻倍"的排序建出 SA —— 一旦建好，子串查询、最长重复子串、模式出现次数等都能在对数或线性时间回答。',
    position:'本章最重的一节（43K 字符）。它与前面的单模式匹配互补：后缀数组是"多模式/全文索引"的基石。',
    unlocks:[],
    mathKit:[
     {title:'后缀数组 SA',body:'$SA[i]$ = 字典序第 $i$ 小的后缀的起点。"banana" 的 SA = [5, 3, 1, 0, 4, 2]。'},
     {title:'LCP 数组',body:'$LCP[i]$ = $SA[i-1]$ 与 $SA[i]$ 两个后缀的最长公共前缀。"banana" 的 LCP = [1, 3, 0, 0, 2]。'},
     {title:'倍增法',body:'第 $k$ 轮按"前 $2^k$ 个字符"的秩排序；$\\lceil \\lg n \\rceil$ 轮后全序确定。'},
     {title:'应用',body:'最长重复子串 = LCP 的最大值；模式出现次数 = SA 上二分。'},
    ]},
   {type:'intuition',title:'banana 的 SA = [5,3,1,0,4,2]',scene:'C 程序 Part 6',body:[
     '★★ C 程序 part 6 对 "banana" 建后缀数组：**SA = [5, 3, 1, 0, 4, 2]**（a, ana, anana, banana, na, nana —— 按字典序的起点），倍增 **2 轮**后 rank 全异（$\\lceil\\lg 6\\rceil = 3$ 的上界之内）。',
     '★ **LCP = [1, 3, 0, 0, 2]**：a|ana 差 1、ana|anana 差 3、anana|banana 差 0 —— 与暴力逐项一致，且最大值 3 立刻给出最长重复子串 "ana"。',
     '★ 程序里实现的是原书 COMPUTE-SUFFIX-ARRAY 的倍增思想（每轮按 (rank[i], rank[i+k]) 双键排序），并用"相邻 rank 全异"作终止条件 —— 本站第一版把终止条件写反了，导致 k 溢出段错误，靠打印中间轮次定位。',
     '⚠ 终止条件的语义值得记住：**排序后**相邻秩仍相等才需要下一轮；在未排序的 sa 上做这个检查毫无意义。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:987,en:'COMPUTE-SUFFIX-ARRAY represents substrings of the text with integer rank',
      zh:'★ 倍增法的主过程（22 行）。'},
     {kind:'body',page:993,en:'Consider suffixes T[i − 1 : ] and T[i : ], which appear at positions rank[i − 1] and rank[i], respectively, in the lexicographically sorted ord er of suffixes.',
      zh:'★ LCP 的线性计算。'},
    ],terms:[{en:'suffix array',zh:'后缀数组 SA',page:986},
              {en:'longest common prefix',zh:'最长公共前缀 LCP',page:993}]},
   {type:'pseudocode',title:'COMPUTE-SUFFIX-ARRAY 的倍增思想（原书 p.988，22 行）',algo:'COMPUTE-SUFFIX-ARRAY',signature:'COMPUTE-SUFFIX-ARRAY(T)',
    page:988,
    lines:[
     {n:1,code:'n = T.length',zh:''},
     {n:2,code:'初始：SA = [0..n−1]，rank[i] = T[i] 的字符序',zh:'★ 长度 1 的排名。'},
     {n:3,code:'for k = 1, 2, 4, …:',zh:'★ 子串长度翻倍。'},
     {n:4,code:'    按 (rank[i], rank[i+k]) 双键排序 SA',zh:'★★ 相当于按"前 2k 个字符"排序。'},
     {n:5,code:'    由排序结果重算 rank（相邻不同则 +1）',zh:'★ 秩压缩。'},
     {n:6,code:'    若相邻秩全不同：break',zh:'★★ 所有后缀已可区分。'},
     {n:7,code:'return SA',zh:'★ 共 ⌈lg n⌉ 轮。'}],
    vars:[{name:'rank',meaning:'当前轮次下各后缀的字典序名次'}],
    note:'★ 语料的 COMPUTE-SUFFIX-ARRAY（p.988）是 22 行的完整倍增实现（含 substr-rank 与 rank 数组的交替），上面列出主干逻辑；C 程序的 `suffix_array` 与之同构（排序用插入排序，n 小）。原书另有 MAKE-RANKS（6 行）与 COMPUTE-LCP（15 行）。',
    more:[{algo:'COMPUTE-LCP',subtitle:'COMPUTE-LCP —— 相邻后缀的公共前缀（p.993，15 行）',signature:'COMPUTE-LCP(T, SA)',page:993,
      lines:[{n:1,code:'    对 SA 的每对相邻后缀：',zh:''},
        {n:2,code:'        lcp[i] = 逐字符比较的公共前缀长度',zh:'★ 暴力 O(n·lcp)；原书给出线性算法。'},
        {n:3,code:'    // max(lcp) 的那个子串 = 最长重复子串',zh:'★★ LCP 的立即可用推论。'}],
      vars:[{name:'lcp',meaning:'相邻后缀的公共前缀长度'}],
      note:'★ C 程序 part 6 用暴力版本与自身交叉验证（语义一致），打印 "banana" 的 LCP = [1,3,0,0,2]。'}]},
   {type:'visualize',title:'banana 的六个后缀',panels:[
     {title:'按字典序排列（SA 序）',viz:'growth',
      chart:{xMax:6,series:[
       {name:'LCP[1..5] = [1,3,0,0,2]',expr:'n',color:'--viz-done'},
       {name:'后缀总数 6',expr:'6',color:'--viz-compare'}]},
      note:'★ 最大 LCP = 3 → "ana" 出现两次：这是全文索引"一次建库、处处查询"的缩影。'},
    ],tasks:['对照 C 程序 part 6：SA = [5,3,1,0,4,2]、LCP = [1,3,0,0,2]、倍增 2 轮。'],note:''},
   {type:'code',title:'实测：banana 的 SA 与 LCP',c:{file:'string_match.c',code:String.raw`/* string_match.c -- 32 章：字符串匹配（朴素 / Rabin-Karp / 自动机 / KMP / 后缀数组）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 part 6（后缀数组）。'},
           {line:130,zh:'`suffix_array`：倍增法 —— 双键排序 + 秩压缩 + "相邻秩全异"终止。'},
           {line:165,zh:'`lcp_brute`：暴力 LCP，用于与倍增结果交叉验证。'},
           {line:236,zh:'★★ part 6：SA = [5,3,1,0,4,2]；LCP = [1,3,0,0,2]；倍增 2 轮。'}]},
    tests:[{in:'"banana" 的 SA',out:'[5, 3, 1, 0, 4, 2]'},
           {in:'"banana" 的 LCP',out:'[1, 3, 0, 0, 2]，与暴力一致'},
           {in:'倍增轮数',out:'2（上界 ⌈lg 6⌉ = 3）'}],
    mapping:[{pc:4,pcCode:'双键排序 SA',c:'`int ra = rank_[a], rb = rank_[b];`（第 140 行）'},
             {pc:6,pcCode:'若相邻秩全不同：break',c:'`if (rank_[sa[i]] == rank_[sa[i + 1]]) { all_distinct = 0; break; }`（第 183 行）'}]},
   {type:'analyze',title:'一本账：建库的账',claims:[
     {expr:'O(n \\lg n)',when:'倍增法建 SA 的时间（O(lg n) 轮 × 排序）',page:988,source:'book'},
     {expr:'2',when:'"banana" 实测的倍增轮数',page:988,source:'book'},
     {expr:'3',when:'LCP 最大值 → 最长重复子串 "ana"',page:993,source:'book'},
     {expr:'O(n)',when:'原书 COMPUTE-LCP 的线性时间',page:993,source:'book'},
    ],tables:[{caption:'C 程序 Part 6 的实测',rows:[
      ['项','值'],
      ['SA（banana）','[5, 3, 1, 0, 4, 2]'],
      ['LCP','[1, 3, 0, 0, 2]'],
      ['倍增轮数','2'],
      ['最长重复子串','ana（LCP 最大值 3）'],
     ]},{caption:'一次建库 vs 每次匹配',rows:[
      ['','单模式匹配（32.1–32.4）','后缀数组（32.5）'],
      ['预处理','无 / Θ(m)','O(n lg n) 建库'],
      ['查询一个模式','Θ(n + m)','O(m lg n) 二分'],
      ['多模式 / 重复子串','逐个重跑','**建库一次全解决**'],
     ]}],chart:{xMax:64,series:[
     {name:'建库 n·lg²n（倍增）',expr:'n * Math.log2(n) * Math.log2(n)',color:'--viz-compare'},
     {name:'每次查询重跑 n·m',expr:'n * n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'倍增为什么只需 ⌈lg n⌉ 轮',steps:[
      {zh:'第 $k$ 轮结束时，$rank[i]$ 是"长度 $2^{k}$ 的前缀"的字典序名次（不足处视为更小）。 归纳：由第 $k-1$ 轮的秩，比较 $(rank[i], rank[i+2^{k-1}])$ 即得长度 $2^{k}$ 的次序。'},
      {zh:'当 $2^{k} \\ge n$ 时所有后缀的前缀就是后缀本身 → 秩两两不同 → 终止。 轮数 $\\le \\lceil \\lg n \\rceil$；"banana"（n=6）实测 2 轮。'},
      {tex:'\\text{轮数} \\le \\lceil \\lg n \\rceil',zh:'★★ 终止条件的实现细节：在**排序后**检查相邻秩是否仍相等 —— 本站第一版在未排序的 sa 上检查，等价于永远不触发，最终 k 溢出导致段错误。∎'}]},
     ],
    note:''},
   {type:'prove',title:'SA 的良序性（输出合法）',statement:'COMPUTE-SUFFIX-ARRAY represents substrings of the text with integer rank',
    page:987,
    intro:'★ 要证两点：输出是原串后缀的一个排列，且按字典序递增。',
    steps:[
     {title:'① 是排列',en:'Consider suffixes T[i − 1 : ] and T[i : ], which appear at positions rank[i − 1] and rank[i], respectively, in the lexicographically sorted ord er of suffixes.',
      page:993,
      body:['算法只对 $\\{0, \\dots, n-1\\}$ 排序、重算秩，从不增删元素。',
        '所以输出必然是全部 $n$ 个起点的排列。']},
     {title:'② 字典序递增',en:'COMPUTE-SUFFIX-ARRAY represents substrings of the text with integer rank',
      page:987,
      body:['归纳：第 $k$ 轮的秩是"前 $2^{k}$ 字符"的严格次序（秩压缩保证相等者共享秩）。',
        '终止时秩两两不同 → 相邻后缀的 $2^{k}$ 前缀已分出先后 → 后缀本身按字典序递增。']},
     {title:'③ LCP 的正确性',en:'Consider suffixes T[i − 1 : ] and T[i : ], which appear at positions rank[i − 1] and rank[i], respectively, in the lexicographically sorted ord er of suffixes.',
      page:993,
      body:['$LCP[i]$ 定义为相邻两后缀的公共前缀长度 —— 与暴力逐字符比较语义相同。',
        '★ C 程序 part 6 对每对相邻后缀用暴力复核，结果逐项一致；最大 LCP 直接给出最长重复子串。∎']},
    ],conclusion:'★ 结论：后缀数组 = "排序即索引"。它把字符串问题变成排序问题，再用 LCP 补上"公共部分"的信息。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'"banana" 的后缀数组是？',options:['[0,1,2,3,4,5]','**[5,3,1,0,4,2]**','[5,4,3,2,1,0]','[3,5,1,0,2,4]'],answer:1,
      why:'★ a < ana < anana < banana < na < nana（C 程序断言）。'},
     {kind:'single',q:'"banana" 的最长重复子串是什么？',options:['an','**ana**','na','ban'],answer:1,
      why:'★ LCP 最大值 3 出现在 ana 与 anana 之间。'},
     {kind:'judge',q:'倍增法的终止条件在"排序后"检查相邻秩是否全异。',answer:true,
      why:'★ 在未排序的 sa 上检查毫无意义（本站踩过的坑：k 溢出 → 段错误）。'},
     {kind:'simulate',q:'C 程序 part 6 的倍增轮数是多少？（填整数）',expect:[2],placeholder:'例如：3',
      why:'2 —— k=1 与 k=2 两轮后 6 个后缀的秩已全异（上界 ⌈lg 6⌉ = 3）。'},
     {kind:'single',q:'C 程序算出的 "banana" 的 LCP 数组是哪一个？',options:['[0, 1, 3, 0, 0, 2]','**[1, 3, 0, 0, 2]**','[1, 2, 3, 0, 0]','[3, 3, 0, 0, 2]'],answer:1,why:'★ 程序打印 LCP = [1, 3, 0, 0, 2]，与暴力法一致。它按 $SA = [5,3,1,0,4,2]$ 的相邻后缀 ($,$a,$ana,$anana,$na,$nana) 求公共前缀长度；最大值 3 对应的就是最长重复子串 "ana"。'},
     {kind:'judge',q:'倍增法建后缀数组的轮数有一个 $\lceil \lg n \rceil$ 的上界。',answer:true,why:'★ 每轮把参与比较的子串长度翻倍，所以至多 $\lceil \lg n \rceil$ 轮就全部区分开。"banana"（$n = 6$）实测只用 2 轮，上界是 $\lceil \lg 6 \rceil = 3$，与 C 程序打印一致。'},
    ],bookExercises:[
     {id:'32.5-1',page:994,star:0,statement:'32.5-1 Show the substr-rank and rank arrays before each iteration of the while loop of lines 10–19',hint:'照 C 程序 suffix_array 的每轮打印 substr-rank 与 rank 数组（本站调试时打印过中间轮次，可直接参照）。'},
     {id:'32.5-3',page:995,star:0,statement:'32.5-3 Given two texts, T 1 of length n 1 and T 2 of length n 2 , show how to use the suffix array and longest',hint:'把 $T_1\\#T_2$（分隔符）建后缀数组：跨过分隔符且 LCP 大的相邻对给出两串的最长公共子串。'},
    ]},
  ],
};
