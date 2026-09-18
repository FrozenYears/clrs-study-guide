/* 第 14 章 14.4：最长公共子序列（Longest common subsequence）。印刷页 393–399（pdf 414–420）。 */
export default {
  key:'s04',id:'ch14/s04',chapter:14,section:'14.4',
  title:'最长公共子序列：前缀对上的递推',shortTitle:'14.4 最长公共子序列',
  titleEn:'Longest common subsequence',
  source:{printed:[393,399],pdf:[414,420]},
  prerequisites:[{label:'14.3 Elements of dynamic programming',url:'#/ch14/s03'}],
  stages:[
   {type:'map',title:'两个序列的相似度怎么量',
    why:'给定两个序列 $X$、$Y$，求最长的公共子序列 —— 注意是**子序列**（不要求连续），不是子串。这是 DNA 比对、diff、拼写检查的共同骨架。',
    position:'14.1 的子问题是"长度"（一维），14.2 是"区间"（二维 $n^2$ 个），本关是**前缀对** $(i,j)$ —— 同样是二维，但状态含义是"两个序列各取多长"。',
    unlocks:[{label:'14.5 Optimal binary search trees',url:'#/ch14/s05'}],
    mathKit:[
     {title:'递推式 (14.9)',body:'$c[i,j] = c[i-1,j-1]+1$（当 $x_i = y_j$），否则 $c[i,j] = \\max(c[i-1,j],\\,c[i,j-1])$。'},
     {title:'子问题数',body:'$(m+1)(n+1) = \\Theta(mn)$ 个 —— 书中原话：只有 $\\Theta(mn)$ 个**不同**子问题。'},
     {title:'总时间',body:'每个子问题 $O(1)$ → 总时间 $\\Theta(mn)$（对比：暴力枚举子序列是指数级）。'},
    ]},
   {type:'intuition',title:'子序列不是子串',scene:'X = ⟨A,B,C,B,D,A,B⟩，Y = ⟨B,D,C,A,B,A⟩',body:[
     '**子序列** = 把原序列删掉 0 个或多个元素后剩下的（保持相对顺序）；**子串**要求连续。',
     '例：$X = \\langle A,B,C,B,D,A,B\\rangle$、$Y = \\langle B,D,C,A,B,A\\rangle$。它们的一个 LCS 是 $\\langle B,C,B,A\\rangle$，长度 **4** —— 注意 BCBA 的下标在原串里并不连续。',
     '★ 子问题怎么定？**前缀对**：$c[i,j]$ = $X$ 的前 $i$ 个字符与 $Y$ 的前 $j$ 个字符的 LCS 长度。$m \\times n$ 张表，每格 $O(1)$。',
     '★ 决策只有三种：$x_i = y_j$ 就匹配（左上角 $+1$）；否则两种退让 —— 丢掉 $x_i$ 或丢掉 $y_j$，取较大者。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 ⟨x 1 ,x 2 ,…,x m⟩ 的空格是原书的下标排版）。',blocks:[
     {kind:'body',page:394,en:'A subsequence of a given sequence is just the given sequence with 0 or more elements left out.',
      zh:'★★ **子序列**的定义：删掉 0 个或多个元素，剩下的还是原序列的一部分。'},
     {kind:'body',page:395,en:'The LCS problem has an optimal-substructure property, however, as the following theorem shows. As we\u2019ll see, the natural classes of subproblems correspond to pairs of "prefixes" of the two input sequences.',
      zh:'★★ **子问题 = 前缀对** —— 本关的建模核心。'},
     {kind:'body',page:395,en:'The way that Theorem 14.1 characterizes longest common subsequences says that an LCS of two sequences contains within it an LCS of prefixes of the two sequences. Thus, the LCS problem has an optimal-substructure property. A recursive solution also has the over',
      zh:'★★ LCS 满足**最优子结构**，而且递归解也有**重叠子问题**性质（原书下一句被分页截断）。'},
     {kind:'body',page:396,en:'\u0398(mn) distinct subproblems (computing c[i,j] for 0 \u2264 i \u2264 m and 0 \u2264 j \u2264 n), dynamic programming can compute the solutions bottom up.',
      zh:'★★ 只有 $\\Theta(mn)$ 个**不同**子问题 —— 所以自底向上可行。'},
     {kind:'body',page:396,en:'Based on equation (14.9), you could write an exponential-time recursive algorithm to compute the length of an LCS of two sequences.',
      zh:'★ 直接按递推式写递归 → 指数时间（重复子问题）。'},
     {kind:'body',page:399,en:'You can, however, reduce the asymptotic space requirements for LCS-LENGTH , since it needs only two rows of table c at a time: the row being computed and the previous row.',
      zh:'★ 空间优化：滚动数组 —— 只要两行（习题 14.4-4 进一步压到 $\\min(m,n)$）。'},
    ],terms:[{en:'longest common subsequence',zh:'最长公共子序列',page:394},
              {en:'subsequence',zh:'子序列（不要求连续）',page:394},
              {en:'prefix',zh:'前缀',page:395}]},
   {type:'pseudocode',title:'LCS-LENGTH：16 行填表',algo:'LCS-LENGTH',signature:'LCS-LENGTH(X, Y)',page:397,
    lines:[
     {n:1,code:'let b[1 : m, 1 : n] and c[0 : m, 0 : n] be new tables',zh:'$c$ 存长度、$b$ 存方向（重建时用）。'},
     {n:2,code:'for i = 1 to m',zh:''},
     {n:3,code:'    c[i,0] = 0',zh:''},
     {n:4,code:'for j = 0 to n',zh:''},
     {n:5,code:'    c[0,j] = 0',zh:'★ 边界：任一方为空 → LCS 长 0。'},
     {n:6,code:'for i = 1 to m    // compute table entries in row-major order',zh:'★ 行主序填表。'},
     {n:7,code:'    for j = 1 to n',zh:''},
     {n:8,code:'        if x_i == y_j',zh:'★ 字符相同。'},
     {n:9,code:'            c[i,j] = c[i − 1,j − 1] + 1',zh:'左上角 + 1。'},
     {n:10,code:'            b[i,j] = "↖"',zh:''},
     {n:11,code:'        elseif c[i − 1,j] ≥ c[i,j − 1]',zh:'否则比上方与左方。'},
     {n:12,code:'            c[i,j] = c[i − 1,j]',zh:''},
     {n:13,code:'            b[i,j] = "↑"',zh:''},
     {n:14,code:'        else c[i,j] = c[i,j − 1]',zh:''},
     {n:15,code:'            b[i,j] = "←"',zh:''},
     {n:16,code:'return c and b',zh:''}],
    vars:[{name:'c[i,j]',meaning:'$X_i$ 与 $Y_j$ 的 LCS 长度'},{name:'b[i,j]',meaning:'重建 LCS 时的方向箭头'}],
    note:'★ 表中箭头（原书用 ↖ ↑ ← 三个符号，语料把它们抽成了伪影如 <"= ）—— 本关按原书的三个方向重写，含义与 Figure 14.8 一致。',
    more:[{algo:'PRINT-LCS',subtitle:'PRINT-LCS(b, X, i, j) —— 8 行重建一个 LCS（p.397）',signature:'PRINT-LCS(b, X, i, j)',page:397,
      lines:[{n:1,code:'if i == 0 or j == 0',zh:''},{n:2,code:'    return    // the LCS has length 0',zh:''},
        {n:3,code:'if b[i,j] == "↖"',zh:''},{n:4,code:'    PRINT-LCS(b, X, i − 1, j − 1)',zh:'先递归再打印 → 正序。'},
        {n:5,code:'    print x_i    // same as y_j',zh:''},
        {n:6,code:'elseif b[i,j] == "↑"',zh:''},{n:7,code:'    PRINT-LCS(b, X, i − 1, j)',zh:''},
        {n:8,code:'else PRINT-LCS(b, X, i, j − 1)',zh:''}],
      vars:[{name:'b',meaning:'LCS-LENGTH 返回的方向表'}],note:'★ 重建耗时 $O(m+n)$：每步至少让 $i$ 或 $j$ 减一。'}]},
   {type:'visualize',title:'指数与 Θ(mn) 的距离',panels:[
     {title:'暴力枚举所有子序列 vs DP 填表（C 程序实测）',viz:'growth',
      chart:{xMax:24,series:[
       {name:'枚举子序列 ≈ 2^n / 64',expr:'Math.pow(2, n) / 64',color:'--viz-violation'},
       {name:'DP ≈ n² / 64',expr:'n * n / 64',color:'--viz-done'}]},
      note:'★ n = 12 时 DP 只要 144 格，枚举要 4096 条子序列 —— 而且 n 再大一点枚举就完全不可行。'},
    ],tasks:['对照 C 程序 part 2：$m = 7$、$n = 6$ 时表只有 $8 \\times 7 = 56$ 格。'],note:''},
   {type:'code',title:'实测：c 表与 BCBA',c:{file:'lcs.c',code:String.raw`/* lcs.c -- 14.4: 最长公共子序列 LCS-LENGTH + PRINT-LCS。
 * 例：X = <A,B,C,B,D,A,B>，Y = <B,D,C,A,B,A>（原书 p.396 的例子）
 * 关键数字：LCS 长度 c[7,6] = 4，序列 = BCBA。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define MMAX 16
#define NMAX 16

static int c[MMAX + 1][NMAX + 1];       /* c[i,j]：X_i 与 Y_j 的 LCS 长度 */
static char b[MMAX + 1][NMAX + 1];      /* b[i,j]：'-' 左上、'^' 上、'<' 左 */

/* LCS-LENGTH（16 行直译） */
static void lcs_length(const char *x, const char *y, int m, int n)
{
    for (int i = 1; i <= m; i++) { c[i][0] = 0; }        /* 行 2–3 */
    for (int j = 0; j <= n; j++) { c[0][j] = 0; }        /* 行 4–5 */
    for (int i = 1; i <= m; i++) {                       /* 行 6：行主序填表 */
        for (int j = 1; j <= n; j++) {                   /* 行 7 */
            if (x[i - 1] == y[j - 1]) {                  /* 行 8 */
                c[i][j] = c[i - 1][j - 1] + 1;           /* 行 9 */
                b[i][j] = '-';                           /* 行 10 */
            }
            else if (c[i - 1][j] >= c[i][j - 1]) {       /* 行 11 */
                c[i][j] = c[i - 1][j];                   /* 行 12 */
                b[i][j] = '^';                           /* 行 13 */
            }
            else {                                       /* 行 14–15 */
                c[i][j] = c[i][j - 1];
                b[i][j] = '<';
            }
        }
    }
}

/* PRINT-LCS（8 行直译，输出顺序即正序） */
static void print_lcs(const char *x, int i, int j)
{
    if (i == 0 || j == 0) { return; }                    /* 行 1–2 */
    if (b[i][j] == '-') {                                /* 行 3 */
        print_lcs(x, i - 1, j - 1);                      /* 行 4 */
        printf("%c", x[i - 1]);                          /* 行 5 */
    }
    else if (b[i][j] == '^') { print_lcs(x, i - 1, j); } /* 行 6–7 */
    else { print_lcs(x, i, j - 1); }                     /* 行 8 */
}

/* 习题 14.4-2 的思路：只用 c 表、不用 b 表，O(m+n) 重建一个 LCS */
static void rebuild_without_b(const char *x, const char *y, int m, int n, char *out)
    {
        int k = 0, i = m, j = n;    while (i > 0 && j > 0) {
        if (x[i - 1] == y[j - 1]) { out[k++] = x[i - 1]; i--; j--; }
        else if (c[i - 1][j] >= c[i][j - 1]) { i--; }
        else { j--; }
    }
    out[k] = '\0';
    for (int a = 0, z = k - 1; a < z; a++, z--) {        /* 反向得到正序 */
        char t = out[a]; out[a] = out[z]; out[z] = t;
    }
}

static int memo_c[MMAX + 1][NMAX + 1];
static long memo_calls;

/* 习题 14.4-3：LCS-MEMO —— 与 LCS-LENGTH 同构，只是改成递归 + 查表 */
static int lcs_memo(const char *x, int i, const char *y, int j)
{
    memo_calls++;
    if (i == 0 || j == 0) { return 0; }
    if (memo_c[i][j] >= 0) { return memo_c[i][j]; }
    int r;
    if (x[i - 1] == y[j - 1]) { r = lcs_memo(x, i - 1, y, j - 1) + 1; }
    else {
        int up = lcs_memo(x, i - 1, y, j);
        int left = lcs_memo(x, i, y, j - 1);
        r = (up >= left) ? up : left;
    }
    memo_c[i][j] = r;
    return r;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    const char *x = "ABCBDAB";
    const char *y = "BDCABA";
    int m = (int)strlen(x);
    int n = (int)strlen(y);

    /* 习题 14.4-2 的方法不用 b 表，先算 c 表 */
    lcs_length(x, y, m, n);

    printf("part 1: X = <%c,%c,%c,%c,%c,%c,%c>，Y = <%c,%c,%c,%c,%c,%c>\n",
           x[0], x[1], x[2], x[3], x[4], x[5], x[6],
           y[0], y[1], y[2], y[3], y[4], y[5]);
    printf("part 2: LCS 长度 c[%d,%d] = %d；一个 LCS = ", m, n, c[m][n]);
    print_lcs(x, m, n);
    printf("\n");
    assert(c[m][n] == 4);

    {
        char out[MMAX + 1];
        rebuild_without_b(x, y, m, n, out);
        printf("part 3: 习题 14.4-2 的做法（只用 c 表）重建得到 = %s（长度 %d）\n",
               out, (int)strlen(out));
        assert(strlen(out) == 4);
    }

    /* 打印完整 c 表（Figure 14.8 的形状：8 行 × 7 列） */
    printf("part 4: c 表（行 i = 0..%d，列 j = 0..%d）：\n", m, n);
    printf("        j    ");
    for (int j = 0; j <= n; j++) { printf("%3d", j); }
    printf("\n        y_j      ");
    for (int j = 0; j < n; j++) { printf("%2c ", y[j]); }
    printf("\n");
    for (int i = 0; i <= m; i++) {
        if (i == 0) { printf("        i=%2d      ", i); }
        else { printf("        i=%2d %c  ", i, x[i - 1]); }
        for (int j = 0; j <= n; j++) { printf("%3d", c[i][j]); }
        printf("\n");
    }

    /* 习题 14.4-3：记忆化版本（真正递归 + 查表，与自底向上答案一致） */
    printf("part 5: 习题 14.4-3 的记忆化版本：\n");
    {
        memset(memo_c, -1, sizeof(memo_c));
        memo_calls = 0;
        int memo = lcs_memo(x, m, y, n);
        printf("        LCS-MEMO(X,7,Y,6) = %d（调用 %ld 次），与自底向上的 %d 一致：%s\n",
               memo, memo_calls, c[m][n], (memo == c[m][n]) ? "是" : "否");
        assert(memo == c[m][n] && memo == 4);
    }

    /* 习题 14.4-1：另一组序列，实测 LCS 长度与序列 */
    printf("part 6: 习题 14.4-1 的两组序列：\n");
    {
        static const char *a = "10010101";
        static const char *d = "010110110";
        lcs_length(a, d, 8, 9);
        printf("        <1,0,0,1,0,1,0,1> 与 <0,1,0,1,1,0,1,1,0> 的 LCS 长度 = %d\n", c[8][9]);
        printf("        一个 LCS = ");
        print_lcs(a, 8, 9);
        printf("\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明关键数字：$c[7,6] = 4$，序列 BCBA。'},
           {line:15,zh:'`lcs_length`：16 行直译，行主序双层循环 = $\\Theta(mn)$。'},
           {line:38,zh:'`print_lcs`：8 行递归重建。'},
           {line:50,zh:'`rebuild_without_b`：习题 14.4-2 的做法（只用 $c$ 表，$O(m+n)$）。'},
           {line:67,zh:'`lcs_memo`：习题 14.4-3 的记忆化版本。'},
           {line:97,zh:'★★ part 2：$c[7,6] = 4$、LCS = BCBA —— 与原书 Figure 14.8 逐格一致。'},
           {line:111,zh:'★ part 4：打印完整的 $c$ 表（$8 \\times 7$）—— 也就是 Figure 14.8 的那张表。'},
           {line:129,zh:'★ part 6：习题 14.4-1 的两组 01 序列，实测 LCS 长度 6。'}]},
    tests:[{in:'X = ⟨A,B,C,B,D,A,B⟩、Y = ⟨B,D,C,A,B,A⟩',out:'LCS = BCBA，长度 4'},
           {in:'习题 14.4-2 的做法（只用 c 表）',out:'同样得到 BCBA'},
           {in:'习题 14.4-1 的 01 序列',out:'长度 6（如 100110）'}],
    mapping:[{pc:8,pcCode:'if x_i == y_j',c:'`if (x[i - 1] == y[j - 1])`（第 21 行）'},
             {pc:11,pcCode:'elseif c[i − 1,j] ≥ c[i,j − 1]',c:'`else if (c[i - 1][j] >= c[i][j - 1])`（第 25 行）'}]},
   {type:'analyze',title:'一本账：为什么是 Θ(mn)',claims:[
     {expr:'\\Theta(mn)',when:'不同的子问题个数（$0 \\le i \\le m$、$0 \\le j \\le n$）',page:396,source:'book'},
     {expr:'\\Theta(mn)',when:'LCS-LENGTH 的总时间（每格 $O(1)$）',page:397,source:'book'},
     {expr:'O(\\min(m,n))',when:'只求长度时的空间（习题 14.4-4）',page:399,source:'book'},
    ],tables:[{caption:'$X = \\langle A,B,C,B,D,A,B\\rangle$、$Y = \\langle B,D,C,A,B,A\\rangle$ 的 $c$ 表（C 程序实测，= Figure 14.8）',rows:[
      ['i \\ j','—','B','D','C','A','B','A'],
      ['0','0','0','0','0','0','0','0'],
      ['A','0','0','0','0','1','1','1'],
      ['B','0','1','1','1','1','2','2'],
      ['C','0','1','1','2','2','2','2'],
      ['B','0','1','1','2','2','3','3'],
      ['D','0','1','2','2','2','3','3'],
      ['A','0','1','2','2','3','3','4'],
      ['B','0','1','2','2','3','4','4'],
     ]},{caption:'三种二维 DP 的对照',rows:[
      ['','14.2 矩阵链','14.4 LCS','14.5 最优 BST'],
      ['子问题','区间 $[i,j]$','前缀对 $(i,j)$','区间 $[i,j]$ + 哑键'],
      ['子问题数','$\\Theta(n^2)$','$\\Theta(mn)$','$\\Theta(n^2)$'],
      ['每格代价','$O(n)$','$O(1)$','$O(n)$'],
      ['总时间','$\\Theta(n^3)$','$\\Theta(mn)$','$\\Theta(n^3)$'],
     ]}],chart:{xMax:20,series:[
     {name:'子问题数 (m+1)(n+1) ≈ n²',expr:'n * n',color:'--viz-done'},
     {name:'每格只做 O(1) 工作（线性参照）',expr:'8 * n',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'每格 O(1) 从哪来',steps:[
      {zh:'第 8–15 行只做了常数次比较与赋值 —— 没有内层循环。'},
      {zh:'外层两层循环共 $(m+1)(n+1)$ 格。'},
      {tex:'\\Theta(mn) \\times O(1) = \\Theta(mn)',zh:'★ 与 14.2 的差别就在"每格代价"：那边 $O(n)$，这边 $O(1)$。'}]},
     ],
    note:''},
   {type:'prove',title:'Theorem 14.1：三种情况覆盖了全部可能',statement:'The way that Theorem 14.1 characterizes longest common subsequences says that an LCS of two sequences contains within it an LCS of prefixes of the two sequences.',page:395,
    intro:'★ Theorem 14.1 (Optimal substructure of an LCS) 把"匹配 / 不匹配"分成三种情况，正好对应递推式的三行。',
    steps:[
     {title:'情况 1：x_m = y_n',en:'Theorem 14.1 implies that you should examine either one or two subproblems when finding an LCS of X = \u27e8x 1 ,x 2 ,\u2026,x m\u27e9 and Y = \u27e8y 1 ,y 2 ,\u2026,y n\u27e9.',page:395,
      body:['**结论**：$x_m = y_n$ 时，LCS 一定以这一对相同字符**结尾**，于是 $c[m,n] = c[m-1,n-1] + 1$。',
        '**证明**：设 $Z$ 是 $X_m$ 与 $Y_n$ 的一个 LCS。若 $z_k \\ne x_m$，则把 $x_m(=y_n)$ 接到 $Z$ 后面会得到更长的公共子序列，矛盾 —— 所以 $z_k = x_m = y_n$，且 $Z_{k-1}$ 必是 $X_{m-1}$ 与 $Y_{n-1}$ 的 LCS。∎',
        '★ C 程序 part 2 实测：$X$ 的第 7 个字符 B 与 $Y$ 的第 6 个字符 A 不同 —— 走情况 2/3。']},
     {title:'情况 2/3：x_m ≠ y_n',en:'A subsequence of a given sequence is just the given sequence with 0 or more elements left out.',page:394,
      body:['若 $z_k \\ne x_m$，则 $Z$ 是 $X_{m-1}$ 与 $Y_n$ 的公共子序列；若 $z_k \\ne y_n$，则 $Z$ 是 $X_m$ 与 $Y_{n-1}$ 的公共子序列。',
        '两者至少有一个成立，于是只需看**其中一个或两个**子问题 —— 这就解释了两条分支（$\\uparrow$ 与 $\\leftarrow$）。',
        '★ 原书强调 "either one or two subproblems"：$x_m = y_n$ 时**一个**（左上），否则**两个**（上、左）。∎']},
     {title:'正确答案的对照检验',en:'\u0398(mn) distinct subproblems (computing c[i,j] for 0 \u2264 i \u2264 m and 0 \u2264 j \u2264 n), dynamic programming can compute the solutions bottom up.',page:396,
      body:['C 程序把 $X = \\langle A,B,C,B,D,A,B\\rangle$、$Y = \\langle B,D,C,A,B,A\\rangle$ 的 $c$ 表整张打印出来：$c[7,6] = 4$，右上角即答案。',
        '用 $b$ 表重建得到 **BCBA**；只用 $c$ 表（习题 14.4-2 的做法）也得到 **BCBA** —— 两条路径互证。',
        '★ 输出与 Figure 14.8 的表逐格一致（含 $c[1,4] = 1$、$c[5,2] = 2$ 这些拐点）。∎']},
    ],conclusion:'★ 结论：$\Theta(mn)$ 时间、$\Theta(mn)$ 空间（只求长度可压到 $O(\\min(m,n))$）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'$c[i,j]$ 的定义是？',options:['**$X$ 的前 $i$ 个与 $Y$ 的前 $j$ 个字符的 LCS 长度**','$X[i]$ 到 $Y[j]$ 的最短编辑距离','$X$ 与 $Y$ 的最长公共子串长度','第 $i$ 行第 $j$ 列的字符是否相同'],answer:0,
      why:'★ 前缀对 —— 这是 LCS 的建模核心（原书 p.396）。'},
     {kind:'single',q:'$x_i \\ne y_j$ 时 $c[i,j]$ 怎么算？',options:['$c[i-1,j-1]$','$\\max(c[i-1,j],\\,c[i,j-1])$','$c[i-1,j]+c[i,j-1]$','$0$'],answer:1,
      why:'★ 两种退让取较大者：丢掉 $x_i$ 或丢掉 $y_j$。'},
     {kind:'judge',q:'LCS 问题要求公共部分在原序列中连续。',answer:false,
      why:'★ 那是**子串**。子序列只要求相对顺序（原书 p.394：删掉 0 个或多个元素）。'},
     {kind:'judge',q:'LCS-LENGTH 的时间与空间都是 $\\Theta(mn)$。',answer:true,
      why:'★ 时间 $\\Theta(mn)$（每格 $O(1)$）；空间也是 $\\Theta(mn)$（$b$ 与 $c$ 两张表）—— 只求长度可降到两行，甚至 $O(\\min(m,n))$（习题 14.4-4）。'},
     {kind:'simulate',q:'$X = \\langle A,B,C,B,D,A,B\\rangle$、$Y = \\langle B,D,C,A,B,A\\rangle$ 的 LCS 长度是多少？（填数字）',expect:[4],placeholder:'例如：3',
      why:'$c[7,6] = 4$，一个 LCS 是 BCBA。C 程序 part 2 实测吻合。'},
     {kind:'simulate',q:'$m = 7$、$n = 6$ 时 $c$ 表有多少个格子？（填数字）',expect:[56],placeholder:'例如：40',
      why:'$(m+1)(n+1) = 8 \\times 7 = 56$ —— C 程序 part 2 打印的表正好 56 格。'},
    ],bookExercises:[
     {id:'14.4-1',page:399,star:0,statement:'Determine an LCS of \u27e81,0,0,1,0,1,0,1\u27e9 and \u27e80,1,0,1,1,0,1,1,0\u27e9.',hint:'照 LCS-LENGTH 手工填表，或直接跑 C 程序 part 6 —— 实测长度为 **6**，一个答案是 100110（注意不是子串）。'},
     {id:'14.4-2',page:399,star:0,statement:'Give pseudocode to reconstruct an LCS from the completed c table and the original sequences X = \u27e8x 1 ,x 2 ,\u2026,x m\u27e9 and Y = \u27e8y 1 ,y 2 ,\u2026,y n\u27e9 in',hint:'从 $c[m,n]$ 倒着走：若 $x_i = y_j$ 就记下这个字符并同时减 $i$、$j$；否则往 $c$ 值较大的那一侧退。每步至少减一个下标 → $O(m+n)$。C 程序的 `rebuild_without_b` 就是它（第 49 行）。'},
     {id:'14.4-3',page:399,star:0,statement:'Give a memoized version of LCS-LENGTH that runs in O(mn) time.',hint:'把递推式写成递归 `LCS-MEMO(X,i,Y,j)`，进函数先查表；每个 $(i,j)$ 只真正算一次 → $\\Theta(mn)$。C 程序第 66 行的 `lcs_memo` 实测调用 42 次得到同样的 4。'},
     {id:'14.4-4',page:399,star:0,statement:'Show how to compute the length of an LCS using only 2 \u2022 min fm,n g entries in the c table plus O(1) additional space. Then show how to do the same thing, but using min fm,n g entries plus O(1) additional space.',hint:'滚动数组：算第 $i$ 行时只需第 $i-1$ 行，所以两行足够（原书 p.399 的说法）；进一步只保留一行，用一个临时变量存"左上角"的旧值，就能把空间降到 $\\min(m,n)+O(1)$。'},
     {id:'14.4-5',page:399,star:0,statement:'Give an O(n 2 )-time algorithm to find the longest monotonically increasing subsequence of a sequence of n numbers.',hint:'把原序列 $A$ 与它的**排序后**版本 $A^{\\prime}$ 求 LCS —— 单调递增子序列必然是某个排序序的子序列，而 LCS 的 $\\Theta(n^2)$ 正好符合要求。'},
    ]},
  ],
};
