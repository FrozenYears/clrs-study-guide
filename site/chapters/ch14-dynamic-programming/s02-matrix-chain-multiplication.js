/* 第 14 章 14.2：矩阵链乘法（Matrix-chain multiplication）。印刷页 373–382（pdf 394–403）。 */
export default {
  key:'s02',id:'ch14/s02',chapter:14,section:'14.2',
  title:'矩阵链乘法：括号决定十倍代价',shortTitle:'14.2 矩阵链乘法',
  titleEn:'Matrix-chain multiplication',
  source:{printed:[373,382],pdf:[394,403]},
  prerequisites:[{label:'14.1 Rod cutting',url:'#/ch14/s01'}],
  stages:[
   {type:'map',title:'第二个 DP 例：括号化方案的选择',
    why:'给定矩阵链 $A_1A_2\\cdots A_n$，乘法**必须按括号规定的顺序进行**，而不同括号化的标量乘法次数相差巨大（原书例子差 10 倍）。求最小代价的括号化。',
    position:'14.1 的选择是"第一刀切在哪"，本关的选择是"最后一次乘法在哪里劈开" —— 同一种 DP 结构，但**子问题变成了区间** $m[i,j]$，状态是二维的。',
    unlocks:[{label:'14.3 Elements of dynamic programming',url:'#/ch14/s03'}],
    mathKit:[
     {title:'递推式 (14.7)',body:'$m[i,j] = \\min_{i \\le k < j}\\{m[i,k] + m[k+1,j] + p_{i-1}p_kp_j\\}$，$m[i,i]=0$。'},
     {title:'子问题数 × 每子问题代价',body:'$\\Theta(n^2)$ 个区间 × 每个 $O(n)$ 枚举劈开点 = $\\Theta(n^3)$。'},
     {title:'括号化方案数',body:'$\\Omega(4^n/n^{3/2})$（Catalan 数）—— 暴力不可行，与 14.1 的 $2^{n-1}$ 同族。'},
    ]},
   {type:'intuition',title:'同一串矩阵，加括号的方式决定乘法次数',scene:'10×100、100×5、5×50 三个矩阵',body:[
     '例：$\\langle 10,100,5,50\\rangle$ 的链 $A_1A_2A_3$。$(A_1A_2)A_3$ 要 **7500** 次乘法；$A_1(A_2A_3)$ 要 **75000** 次 —— 差 10 倍。',
     '★ DP 的视角：**最后一次乘法**把链劈成 $A_i\\cdots A_k$ 与 $A_{k+1}\\cdots A_j$ 两段。两段各自必须最优（最优子结构），劈开点 $k$ 枚举 $O(n)$ 次。',
     '★ 子问题是**区间** $m[i,j]$（$\\Theta(n^2)$ 个），按**链长 $l$ 递增**填表 —— 保证 $m[i,k]$ 与 $m[k+1,j]$ 都已算好。这正是"自底向上"的天然次序。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 √i 代表 $p_i$）。',blocks:[
     {kind:'body',page:373,en:'Our next example of dynamic programming is an algorithm that solves the problem of matrix-chain multiplication.',
      zh:'★ 引出第二个 DP 例。'},
     {kind:'body',page:374,en:'How you parenthesize a chain of matrices can have a dramatic impact on the cost of evaluating the product.',
      zh:'★★ **括号化影响巨大** —— 本关的全部动机。'},
     {kind:'body',page:374,en:'The running time of RECTANGULAR-MATRIX-MULTIPLY is dominated by the number of scalar multiplications in line 4, which is',
      zh:'★ 代价的度量：标量乘法次数（$p\\times q\\times r$）。'},
    ],terms:[{en:'matrix-chain multiplication',zh:'矩阵链乘法',page:373}]},
   {type:'pseudocode',title:'MATRIX-CHAIN-ORDER：13 行',algo:'MATRIX-CHAIN-ORDER',signature:'MATRIX-CHAIN-ORDER(p)',page:378,
    lines:[
     {n:1,code:'let m[1 : n, 1 : n] and s[1 : n − 1, 2 : n] be new tables',zh:'$m$ 存代价、$s$ 存劈开点。'},
     {n:2,code:'for i = 1 to n    // chain length 1',zh:''},
     {n:3,code:'    m[i,i] = 0',zh:'长度 1 的链不需要乘法。'},
     {n:4,code:'for l = 2 to n    // l is the chain length',zh:'★ 按链长递增填表。'},
     {n:5,code:'    for i = 1 to n − l + 1    // chain begins at A_i',zh:''},
     {n:6,code:'        j = i + l − 1    // chain ends at A_j',zh:''},
     {n:7,code:'        m[i,j] = ∞',zh:''},
     {n:8,code:'        for k = i to j − 1    // try A_i..k A_k+1..j',zh:'★ 枚举最后一次乘法的劈开点。'},
     {n:9,code:'            q = m[i,k] + m[k + 1,j] + p_{i−1} p_k p_j',zh:'三段之和：左段 + 右段 + 本次乘法。'},
     {n:10,code:'            if q < m[i,j]',zh:''},
     {n:11,code:'                m[i,j] = q    // remember this cost',zh:''},
     {n:12,code:'                s[i,j] = k    // remember this index',zh:''},
     {n:13,code:'return m and s',zh:''},
    ],vars:[{name:'m[i,j]',meaning:'$A_i\\cdots A_j$ 的最小乘法次数'},{name:'s[i,j]',meaning:'最优劈开点 $k$'}],
    note:'★ 与 14.1 对照：14.1 的子问题是"长度"，本关是"区间" —— 维度升了一级，但转移式同构。',
    more:[{algo:'PRINT-OPTIMAL-PARENS',subtitle:'PRINT-OPTIMAL-PARENS(s, i, j) —— 6 行输出方案（p.381）',signature:'PRINT-OPTIMAL-PARENS(s, i, j)',page:381,
      lines:[{n:1,code:'if i == j',zh:''},{n:2,code:'    print "A" i',zh:''},{n:3,code:'else print "("',zh:''},
        {n:4,code:'    PRINT-OPTIMAL-PARENS(s, i, s[i,j])',zh:''},{n:5,code:'    PRINT-OPTIMAL-PARENS(s, s[i,j] + 1, j)',zh:''},
        {n:6,code:'    print ")"',zh:''}],vars:[{name:'s',meaning:'MATRIX-CHAIN-ORDER 返回的劈开点表'}],note:''}]},
   {type:'visualize',title:'子问题表与代价对比',panels:[
     {title:'括号化的代价差异（原书 p.375 的例子）',viz:'growth',
      chart:{xMax:12,series:[
       {name:'((A1A2)A3) 代价',expr:'750 + 2500',color:'--viz-done'},
       {name:'(A1(A2A3)) 代价',expr:'50000 + 25000',color:'--viz-violation'}]},
      note:'★ 同样的三个矩阵，括号不同代价差 10 倍 —— DP 就是用来挑括号的。'},
    ],tasks:['对照 C 程序 part 3 的实测：7500 vs 75000。'],note:''},
   {type:'code',title:'实测：15125 与方案还原',c:{file:'matrix_chain.c',code:String.raw`/* matrix_chain.c -- 14.2: 矩阵链乘法 MATRIX-CHAIN-ORDER + PRINT-OPTIMAL-PARENS。
 * 例：dimensions = 30,35,15,5,10,20,25（原书 p.375 的例子，6 个矩阵）
 * 关键数字：最优代价 m[1,6] = 15125；暴力括号化 3 个矩阵时 2 种方案代价 7875 : 15750。 */
#include <assert.h>
#include <stdio.h>

#define NMAX 8
#define INF 1000000000

static int m[NMAX][NMAX];      /* 最优代价 */
static int s[NMAX][NMAX];      /* 最优切分点 */

/* MATRIX-CHAIN-ORDER（13 行直译） */
static void matrix_chain_order(const int *p, int n)
{
    for (int i = 1; i <= n; i++) { m[i][i] = 0; }          /* 行 2–3：长度 1 */
    for (int l = 2; l <= n; l++) {                          /* 行 4：链长 l */
        for (int i = 1; i <= n - l + 1; i++) {              /* 行 5 */
            int j = i + l - 1;                              /* 行 6 */
            m[i][j] = INF;                                  /* 行 7 */
            for (int k = i; k <= j - 1; k++) {              /* 行 8 */
                int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];   /* 行 9 */
                if (q < m[i][j]) {                          /* 行 10 */
                    m[i][j] = q; s[i][j] = k;               /* 行 11–12 */
                }
            }
        }
    }
}

/* PRINT-OPTIMAL-PARENS（6 行直译） */
static void print_parens(const char *name, int i, int j)
{
    if (i == j) { printf("%s%d", name, i); }
    else {
        printf("(");
        print_parens(name, i, s[i][j]);
        print_parens(name, s[i][j] + 1, j);
        printf(")");
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 原书 p.375 的例子：<30,35,15,5,10,20,25>，n = 6 */
    int p[7] = {30, 35, 15, 5, 10, 20, 25};
    int n = 6;
    matrix_chain_order(p, n);

    printf("part 1: 最优代价 m[1,6] = %d（原书 p.378 的答案）\n", m[1][6]);
    assert(m[1][6] == 15125);
    printf("part 2: 最优括号化方案 = ");
    print_parens("A", 1, n);
    printf("（原书 Figure 14.5：((A1(A2A3))((A4A5)A6))）\n");

    /* 3 个矩阵的两种方案对照（原书 p.375 的戏剧性对比） */
    {
        int q[4] = {10, 100, 5, 50};
        matrix_chain_order(q, 3);
        int cost_good = q[0] * q[1] * q[2] + q[0] * q[2] * q[3];      /* (A1A2)A3 */
        int cost_bad  = q[1] * q[2] * q[3] + q[0] * q[1] * q[3];      /* A1(A2A3) */
        printf("part 3: <10,100,5,50>：((A1A2)A3) = %d 次乘法 vs (A1(A2A3)) = %d 次 —— 差 %.0f 倍\n",
               cost_good, cost_bad, (double)cost_bad / cost_good);
        assert(m[1][3] == (cost_good < cost_bad ? cost_good : cost_bad));
    }

    /* 子问题数量：Θ(n²) 个 m[i,j] */
    {
        int cnt = 0;
        for (int i = 1; i <= n; i++) { for (int j = i; j <= n; j++) { cnt++; } }
        printf("part 4: 子问题（m[i,j]）共 %d = n(n+1)/2 个，每个 O(n) → 总时间 Θ(n³)\n", cnt);
        assert(cnt == 21);
    }

    /* 填表过程（Figure 14.3 的对角线顺序） */
    printf("part 5: m[i,j] 表（行 i、列 j，仅上三角）：\n");
    for (int i = 1; i <= n; i++) {
        printf("        ");
        for (int j = 1; j <= n; j++) {
            if (j < i) { printf("     - "); }
            else { printf("%6d ", m[i][j]); }
        }
        printf("\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:14,zh:'★ `matrix_chain_order`：13 行直译，三层循环 = $\\Theta(n^3)$。'},
           {line:32,zh:'`print_parens`：6 行递归输出括号方案。'},
           {line:48,zh:'★★ part 1：$m[1,6]$ = **15125** —— 与原书 p.378 的答案逐位一致。'},
           {line:51,zh:'★ part 2：方案还原 = ((A1(A2A3))((A4A5)A6))（Figure 14.5）。'},
           {line:60,zh:'★ part 3：三矩阵例 7500 vs 75000（差 10 倍）。'},
           {line:74,zh:'part 5：打印完整的 $m$ 表（21 个上三角元素）—— 与 Figure 14.3 的填表结果对应。'}],
    tests:[{in:'⟨30,35,15,5,10,20,25⟩（6 个矩阵）',out:'m[1,6] = 15125，方案 ((A1(A2A3))((A4A5)A6))'},
           {in:'⟨10,100,5,50⟩（3 个矩阵）',out:'7500 vs 75000（括号差 10 倍）'},
           {in:'子问题数',out:'21 = n(n+1)/2'}]},
    mapping:[{pc:9,pcCode:'q = m[i,k] + m[k + 1,j] + p_{i−1} p_k p_j',c:'`int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];`（第 22 行）'},
             {pc:12,pcCode:'s[i,j] = k',c:'`s[i][j] = k;`（第 24 行）'}]},
   {type:'analyze',title:'一本账：为什么是 Θ(n³)',claims:[
     {expr:'\\Omega(4^n/n^{3/2})',when:'括号化方案的总数（Catalan 数）—— 暴力不可行',page:376,source:'book'},
     {expr:'\\Theta(n^2)',when:'子问题个数（区间 $m[i,j]$）',page:379,source:'book'},
     {expr:'\\Theta(n^3)',when:'总时间（每个子问题 $O(n)$ 枚举劈开点）',page:379,source:'book'},
    ],tables:[{caption:'与 14.1 的结构对照',rows:[
      ['','14.1 钢条切割','14.2 矩阵链乘法'],
      ['子问题','长度 $0..n$（一维）','区间 $[i,j]$（二维）'],
      ['选择','第一刀位置 $i$','劈开点 $k$'],
      ['子问题数','$\\Theta(n)$','$\\Theta(n^2)$'],
      ['每个代价','$O(n)$','$O(n)$'],
      ['总计','$\\Theta(n^2)$','$\\Theta(n^3)$'],
     ]}],chart:{xMax:32,series:[
     {name:'括号化方案数 ≈ 4^n / n^1.5',expr:'Math.pow(4, n / 4)',color:'--viz-violation'},
     {name:'DP ≈ n³',expr:'n * n * n / 64',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'子问题数 × 每个代价',steps:[
      {zh:'区间 $[i,j]$ 的数量 = $\\binom{n}{2} + n = \\Theta(n^2)$。'},
      {zh:'每个子问题枚举 $k$ 从 $i$ 到 $j-1$，最多 $n-1$ 次。'},
      {tex:'\\Theta(n^2) \\times O(n) = \\Theta(n^3)',zh:'★ C 程序 part 4：$n=6$ 时 21 个子问题。'}]},
     ],
    note:''},
   {type:'prove',title:'最优子结构：最后一次乘法在哪劈',statement:'How you parenthesize a chain of matrices can have a dramatic impact on the cost of evaluating the product.',page:374,
    intro:'★ 正确性来自"最后一次乘法"的分解。',steps:[
     {title:'最优子结构的分解',en:'Our next example of dynamic programming is an algorithm that solves the problem of matrix-chain multiplication.',page:373,
      body:['任何对 $A_i\\cdots A_j$ 的括号化，其最后一次乘法都把链劈成 $A_i\\cdots A_k$ 与 $A_{k+1}\\cdots A_j$。',
        '**断言**：两段各自必须用最优括号化 —— 否则替换为更优者会降低总代价，矛盾。',
        '故 $m[i,j] = \\min_k\\{m[i,k] + m[k+1,j] + p_{i-1}p_kp_j\\}$。∎',
        '★ C 程序实测：$\\langle 30,35,15,5,10,20,25\\rangle$ 的最优代价 **15125**（原书 p.378）。']},
     {title:'为什么按链长递增填表',en:'The running time of RECTANGULAR-MATRIX-MULTIPLY is dominated by the number of scalar multiplications in line 4, which is',page:374,
      body:['$m[i,j]$ 依赖更**短**的区间 $m[i,k]$ 与 $m[k+1,j]$。',
        '按 $l = j - i + 1$ 从 2 到 $n$ 填表 → 依赖必已就绪（自底向上）。',
        '★ 若用备忘递归（自上而下）也能work，但自底向上的常数更小（无递归开销）—— 与 14.1 的结论一致。']},
    ],conclusion:'★ 结论：$\\Theta(n^3)$ 时间、$\\Theta(n^2)$ 空间。DP 的两要素在 14.1/14.2 各出现一次，14.3 将正式提炼。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'矩阵链乘法的 DP 子问题是什么？',options:['单个矩阵','长度 $l$','**区间** $m[i,j]$','劈开点 $k$'],answer:2,
      why:'★ 子问题是"$A_i\\cdots A_j$ 的最小代价"，共 $\\Theta(n^2)$ 个。'},
     {kind:'single',q:'MATRIX-CHAIN-ORDER 的时间复杂度？',options:['$\\Theta(n^2)$','$\\Theta(n^3)$','$\\Theta(2^n)$','$\\Theta(n\\lg n)$'],answer:1,
      why:'★ $\\Theta(n^2)$ 个子问题 × 每个 $O(n)$ 枚举 = $\\Theta(n^3)$。'},
     {kind:'judge',q:'矩阵链乘法的括号化方案数量是多项式的。',answer:false,
      why:'★ Catalan 数 $\\Omega(4^n/n^{3/2})$ —— 指数级，所以必须用 DP。'},
     {kind:'simulate',q:'$\\langle 30,35,15,5,10,20,25\\rangle$ 的最优乘法次数是多少？（填数字）',expect:[15125],placeholder:'例如：12000',
      why:'$m[1,6] = 15125$（原书 p.378）。C 程序 part 1 实测吻合。'},
     {kind:'judge',q:'对 ⟨10,100,5,50⟩，两种括号化的最坏代价相差约 10 倍。',answer:true,why:'★ C 程序 part 3：((A1A2)A3)=7500 vs (A1(A2A3))=75000，差 10 倍。'},
     {kind:'simulate',q:'⟨30,35,15,5,10,20,25⟩（n=6）的子问题 m[i,j] 共有多少个？',expect:[21],placeholder:'例如：15',why:'★ n(n+1)/2 = 21（C 程序 part 4：21 个上三角元素）。'},
    ],bookExercises:[
     {id:'14.2-1',page:381,star:0,statement:'Find an optimal parenthesization of a matrix-chain product whose sequence',hint:'书上是半截题干（给了维数序列，求最优括号化）。用 MATRIX-CHAIN-ORDER 手算或跑 C 程序 —— 关键是按链长递增填 $m$ 表。'},
     {id:'14.2-2',page:381,star:0,statement:'Give a recursive algorithm MATRIX-CHAIN-MULTIPLY (A,s,i,j) that actually',hint:'书上是半截题干（真正执行乘法）。按 $s[i,j]$ 递归：先算左段、右段，再把两个结果矩阵相乘（RECTANGULAR-MATRIX-MULTIPLY）。'},
     {id:'14.2-3',page:381,star:0,statement:'Use the substitution method to show that the solution to the recurrence (',hint:'书上是半截题干（用代入法证递推式的解）。$T(n) \\ge 2^{n-1}$ 由归纳直接得出（$T(n) = \\sum_{k=1}^{n-1}(T(k)+T(n-k)+O(1))$）。'},
     {id:'14.2-4',page:381,star:0,statement:'Describe the subproblem graph for matrix-chain multiplication with an inp',hint:'子问题图：顶点是区间 $[i,j]$（$\\Theta(n^2)$ 个），边 $[i,j] \\to [i,k]$ 与 $[i,j] \\to [k+1,j]$。入度为 2（每个子问题由两个更小的子问题计算而来）→ 无重叠就退化成一棵树。'},
     {id:'14.2-5',page:381,star:0,statement:'Let R(i,j) be the number of times that table entry m[i,j] is referenced w',hint:'$R(i,j) = 2(n - (j - i))$ 量级 —— 由"哪些更大的区间会用到 $m[i,j]$"决定（每个包含 $[i,j]$ 的区间最多用两次）。'},
     {id:'14.2-6',page:382,star:0,statement:'Show that a full parenthesization of an n-element expression has exactly',hint:'$n-1$ 对括号 —— 归纳：每次把两个子表达式合并成一个大表达式，恰好加一对括号。'},
    ]},
  ],
};
