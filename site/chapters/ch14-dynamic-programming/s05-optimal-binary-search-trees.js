/* 第 14 章 14.5：最优二叉搜索树（Optimal binary search trees）。印刷页 400–407（pdf 421–428）。 */
export default {
  key:'s05',id:'ch14/s05',chapter:14,section:'14.5',
  title:'最优二叉搜索树：把搜索代价压到 2.75',shortTitle:'14.5 最优二叉搜索树',
  titleEn:'Optimal binary search trees',
  source:{printed:[400,407],pdf:[421,428]},
  prerequisites:[{label:'14.4 Longest common subsequence',url:'#/ch14/s04'}],
  stages:[
   {type:'map',title:'键的概率决定了树该长什么样',
    why:'给定 $n$ 个有序键与它们的搜索概率 $p_i$（以及 $n+1$ 个"未命中"的哑键概率 $q_i$），构造一棵 BST 使**期望搜索代价**最小。高频键要靠近根。',
    position:'14.2 的子问题是"区间"，本关也是区间 $[i,j]$ —— 但代价多了一项 $w(i,j)$（子树内全部概率之和），因为每次下降都要付一次"比较"。这是本章最后一关，也是三类二维 DP 的收口。',
    unlocks:[{label:'第 15 章 贪心算法（Greedy Algorithms）',url:'#/ch15/s01'}],
    mathKit:[
     {title:'期望代价 (14.11)',body:'$E[\\text{搜索代价}] = \\sum_{i=1}^{n}(\\text{depth}(k_i)+1)p_i + \\sum_{i=0}^{n}(\\text{depth}(d_i)+1)q_i$。'},
     {title:'递推式 (14.14)',body:'$e[i,j] = \\min_{i \\le r \\le j}\\{e[i,r-1]+e[r+1,j]+w(i,j)\\}$，其中 $w(i,j)=\\sum_{l=i}^{j}p_l+\\sum_{l=i-1}^{j}q_l$。'},
     {title:'时间',body:'$\\Theta(n^2)$ 个区间 × 每个 $O(n)$ 试根 = $\\Theta(n^3)$（Knuth 的单调性可优化到 $\\Theta(n^2)$，习题 14.5-3 的补充）。'},
    ]},
   {type:'intuition',title:'同样的键，两棵树差 0.05',scene:'n = 5，p = 0.15 0.10 0.05 0.10 0.20，q = 0.05 0.10 0.05 0.05 0.05 0.10',body:[
     '原书 Figure 14.9 给了**两棵**树：一棵期望代价 **2.80**（把 $k_5$ 放到深度 2），另一棵 **2.75**（把高频的 $k_5$ 提到深度 1）—— 后者才是最优。',
     '★ 代价算法：每个键与哑键的贡献 = $(\\text{深度}+1) \\times \\text{概率}$。$k_5$ 的频率最高（$p_5 = 0.20$），所以它值得被提到靠近根的位置。',
     '★ 子问题的结构：区间 $[i,j]$ 上的最优子树，其左右子树仍是**区间**上的最优子树 —— 但每层的比较代价要在**每棵子树里各算一次**，这正是多出来的 $w(i,j)$。',
     '★ 直觉解释 $w(i,j)$：把一棵子树整体往下"压"一层，里面的**每个**键与哑键都要多一次比较 —— 总增量恰好是这棵子树内所有概率之和。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 √i 代表 $p_i$、√r 代表 $p_r$）。',blocks:[
     {kind:'body',page:400,en:'you are given the probability \u221ai that any given search is for key k i . Since some searches may be for values not in K, you also have n + 1 "dummy" keys d 0 ,d 1 ,d 2 ,\u2026,d n representing those values.',
      zh:'★★ 输入是**概率**：$p_i$ 命中键、$q_i$ 落到哑键（语料的 √i 就是 $p_i$）。'},
     {kind:'body',page:400,en:'What you need is an optimal binary search tree. Formally, given a sequence',
      zh:'★ 本关的目标（原书这句被分页截断，下一句接 p.400 开头的键序列定义）。'},
     {kind:'body',page:401,en:'(a) A binary search tree with expected search cost 2.80. (b) A binary search tree with expected search cost 2.75. This tree is optimal.',
      zh:'★★ Figure 14.9 的两个数字：**2.80 不是最优，2.75 才是**。'},
     {kind:'body',page:402,en:'To characterize the optimal substructure of optimal binary search trees, we start with an observation about subtrees. Consider any subtree of a binary search tree.',
      zh:'★★ 从**子树**入手刻画最优子结构。'},
     {kind:'body',page:402,en:'In addition, a subtree that contains keys k i ,\u2026,k j must also have as its leaves the dummy keys d i \u22121 ,\u2026,d j .',
      zh:'★★ 键 $k_i,\\dots,k_j$ 的子树，其哑键**必然是** $d_{i-1},\\dots,d_j$ —— 区间是闭合的。'},
     {kind:'body',page:403,en:'The easy case occurs when j = i \u2212 1. Then the subproblem consists of just the dummy key d i \u22121 . The expected search cost is e[i,i \u2212 1] = q i \u22121 .',
      zh:'★ 边界（base case）：空区间 $j = i-1$ 只有一个哑键，代价 $q_{i-1}$。'},
     {kind:'body',page:404,en:'The e[i,j] values give the expected search costs in optimal binary search trees.',
      zh:'★ $e[i,j]$ 就是最终答案的载体。'},
     {kind:'body',page:407,en:'Knuth [264] has shown that there are always roots of optimal subtrees such that root [i,j \u2212 1] \u2264 root [i,j] \u2264 root [i + 1,j] for all 1 \u2264 i <j \u2264 n.',
      zh:'★ Knuth 的单调性：根只在"上一层的两个根"之间滑动 → 每格试根摊销 $O(1)$，总时间降到 $\\Theta(n^2)$。'},
    ],terms:[{en:'optimal binary search tree',zh:'最优二叉搜索树',page:400},
              {en:'expected search cost',zh:'期望搜索代价',page:401},
              {en:'dummy key',zh:'哑键（未命中）',page:400}]},
   {type:'pseudocode',title:'OPTIMAL-BST：15 行',algo:'OPTIMAL-BST',signature:'OPTIMAL-BST(p, q, n)',page:405,
    lines:[
     {n:1,code:'let e[1 : n + 1, 0 : n], w[1 : n + 1, 0 : n], and root[1 : n, 1 : n] be new tables',zh:'$e$ 存期望代价、$w$ 存概率和、$root$ 存最优根。'},
     {n:2,code:'for i = 1 to n + 1    // base cases',zh:'★ 边界：空区间。'},
     {n:3,code:'    e[i,i − 1] = q_{i−1}    // equation (14.14)',zh:''},
     {n:4,code:'    w[i,i − 1] = q_{i−1}',zh:''},
     {n:5,code:'for l = 1 to n',zh:'★ 按区间长度递增填表。'},
     {n:6,code:'    for i = 1 to n − l + 1',zh:''},
     {n:7,code:'        j = i + l − 1',zh:''},
     {n:8,code:'        e[i,j] = ∞',zh:''},
     {n:9,code:'        w[i,j] = w[i,j − 1] + p_j + q_j    // equation (14.15)',zh:'★★ 增量式维护 $w$ —— 把 $O(n)$ 的求和降到 $O(1)$。'},
     {n:10,code:'        for r = i to j    // try all possible roots r',zh:'★ 枚举根。'},
     {n:11,code:'            t = e[i,r − 1] + e[r + 1,j] + w[i,j]    // equation (14.14)',zh:'★★ 三段相加：左 + 右 + 本层全部概率。'},
     {n:12,code:'            if t < e[i,j]    // new minimum?',zh:''},
     {n:13,code:'                e[i,j] = t',zh:''},
     {n:14,code:'                root[i,j] = r',zh:''},
     {n:15,code:'return e and root',zh:''}],
    vars:[{name:'e[i,j]',meaning:'区间 $[i,j]$ 上最优子树的期望搜索代价'},
          {name:'w[i,j]',meaning:'该子树内全部概率之和'},
          {name:'root[i,j]',meaning:'最优子树的根 $k_r$'}],
    note:'★ 与 14.2 的对照：结构完全同构（区间 + 穷举分割点），只是每格多加了 $w[i,j]$。',
    more:[{algo:'PRINT-SUBTREE',subtitle:'PRINT-SUBTREE(root, i, j, depth) —— 递归还原整棵树（习题 14.5-1，p.406）',signature:'PRINT-SUBTREE(root, i, j, depth)',page:406,
      lines:[{n:1,code:'if i > j',zh:'空区间 → 只剩哑键。'},
        {n:2,code:'    print d_{i−1}',zh:''},{n:3,code:'    return',zh:''},
        {n:4,code:'r = root[i,j]',zh:'★ 读根表。'},
        {n:5,code:'print k_r',zh:'★ 输出这个根，再递归左右两段。'},
        {n:6,code:'PRINT-SUBTREE(root, i, r − 1, depth + 1)',zh:''},
        {n:7,code:'PRINT-SUBTREE(root, r + 1, j, depth + 1)',zh:''}],
      vars:[{name:'root',meaning:'OPTIMAL-BST 返回的根表'}],
      note:'★ 顶层调用 PRINT-SUBTREE(root, 1, n, 0) 即得整棵树；本站 C 程序的 `construct_optimal_bst` 就是这个过程。'}]},
   {type:'visualize',title:'看见 Figure 14.10(b) 的那棵树',panels:[
     {title:'① 最优 BST 的结构（期望代价 2.75，根 = k2）',viz:'tree',vizMode:'tree',
      trees:[{root:{label:'k2',cost:'根',children:[
        {label:'k1',cost:'深度 1',children:[{label:'d0',cost:'深度 2'},{label:'d1',cost:'深度 2'}]},
        {label:'k5',cost:'深度 1',children:[
          {label:'k4',cost:'深度 2',children:[
            {label:'k3',cost:'深度 3',children:[{label:'d2',cost:'深度 4'},{label:'d3',cost:'深度 4'}]},
            {label:'d4',cost:'深度 3'}]},
          {label:'d5',cost:'深度 2'}]},
      ]}}],
      treeNotes:['★ $k_5$（$p_5 = 0.20$，全书最高频）被放在深度 1；$k_3$（$p_3 = 0.05$，最低频）被压到深度 3 —— 高频近根。',
        '每个键的贡献 = $(\\text{深度}+1)\\times p_i$：$k_1$ 0.30、$k_2$ 0.10、$k_3$ 0.20、$k_4$ 0.30、$k_5$ 0.40，合计 1.30。',
        '哑键贡献合计 1.45 —— 总计 **2.75**（C 程序 part 5 用深度表直接把定义式加起来复核）。'],
     },
     {title:'② 试根总次数：Θ(n³) 的来历',viz:'growth',
      chart:{xMax:64,series:[
       {name:'Σ 区间长度 ≈ n³/6',expr:'n * n * n / 384',color:'--viz-violation'},
       {name:'子问题数 n(n+1)/2',expr:'n * (n + 1) / 2 / 16',color:'--viz-done'}]},
      note:'★ $n = 5$ 时试根共 35 次（C 程序 part 6 实测），子问题 15 个 —— 每格平均试根约 2.3 次。'},
    ],tasks:['对照 C 程序 part 4：CONSTRUCT-OPTIMAL-BST 打印出的结构与上图逐行一致。'],note:''},
   {type:'code',title:'实测：2.75 与那棵树',c:{file:'optimal_bst.c',code:String.raw`/* optimal_bst.c -- 14.5: 最优二叉搜索树 OPTIMAL-BST + CONSTRUCT-OPTIMAL-BST。
 * 例：原书 p.401 的键分布（n = 5）
 *     p = 0.15 0.10 0.05 0.10 0.20
 *     q = 0.05 0.10 0.05 0.05 0.05 0.10
 * 关键数字：最小期望搜索代价 e[1,5] = 2.75；根 root[1,5] = k2（Figure 14.10(b)）。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

#define N 5
#define EPS 1e-9

static double e[N + 2][N + 1];      /* e[i,j]：最优子树的期望搜索代价 */
static double w[N + 2][N + 1];      /* w[i,j]：子树中所有概率之和 */
static int root[N + 1][N + 1];      /* root[i,j]：最优子树的根 */

/* OPTIMAL-BST（15 行直译） */
static void optimal_bst(const double *p, const double *q, int n)
{
    for (int i = 1; i <= n + 1; i++) {              /* 行 2：base cases */
        e[i][i - 1] = q[i - 1];                     /* 行 3：equation (14.14) */
        w[i][i - 1] = q[i - 1];                     /* 行 4 */
    }
    for (int l = 1; l <= n; l++) {                  /* 行 5：子树规模 l */
        for (int i = 1; i <= n - l + 1; i++) {      /* 行 6 */
            int j = i + l - 1;                      /* 行 7 */
            e[i][j] = 1e18;                         /* 行 8：初始化为 ∞ */
            w[i][j] = w[i][j - 1] + p[j - 1] + q[j];/* 行 9：equation (14.15) */
            for (int r = i; r <= j; r++) {          /* 行 10：试遍所有根 r */
                double t = e[i][r - 1] + e[r + 1][j] + w[i][j];   /* 行 11 */
                if (t < e[i][j]) {                  /* 行 12 */
                    e[i][j] = t;                    /* 行 13 */
                    root[i][j] = r;                 /* 行 14 */
                }
            }
        }
    }
}

/* 习题 14.5-1：CONSTRUCT-OPTIMAL-BST(root, n) 输出树的结构 */
static void construct_optimal_bst(int i, int j, int depth, const char *side)
{
    printf("        %*s%s", depth * 2, "", side);
    if (i > j) {
        printf("d%d\n", i - 1);
        return;
    }
    int r = root[i][j];
    if (i == 1 && j == N) { printf("k%d  <- 根\n", r); }
    else { printf("k%d\n", r); }
    construct_optimal_bst(i, r - 1, depth + 1, "left  ");
    construct_optimal_bst(r + 1, j, depth + 1, "right ");
}

/* 直接按定义算某棵树的期望搜索代价，用来复核 Figure 14.9/14.10 的数字：
 * E[T] = Σ (depth(k_i) + 1) p_i + Σ (depth(d_i) + 1) q_i */
static double expected_cost(const double *kd, const double *dd,
                            const double *p, const double *q, int n)
{
    double s = 0.0;
    for (int i = 1; i <= n; i++) { s += (kd[i - 1] + 1) * p[i - 1]; }
    for (int i = 0; i <= n; i++) { s += (dd[i] + 1) * q[i]; }
    return s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 原书 Figure 14.9 的键分布 */
    double p[N] = {0.15, 0.10, 0.05, 0.10, 0.20};
    double q[N + 1] = {0.05, 0.10, 0.05, 0.05, 0.05, 0.10};

    optimal_bst(p, q, N);

    printf("part 1: 最优期望搜索代价 e[1,%d] = %.2f\n", N, e[1][N]);
    assert(fabs(e[1][N] - 2.75) < EPS);
    printf("part 2: 最优根 root[1,%d] = k%d\n", N, root[1][N]);
    assert(root[1][N] == 2);
    printf("part 3: 总概率 w[1,%d] = %.2f（所有 p 与 q 之和，应为 1.00）\n", N, w[1][N]);
    assert(fabs(w[1][N] - 1.0) < EPS);

    printf("part 4: Figure 14.10(b) 的树结构（由 CONSTRUCT-OPTIMAL-BST 还原，习题 14.5-1）：\n");
    construct_optimal_bst(1, N, 0, "");

    /* 逐行复核 Figure 14.9(a)/(b)：手工两棵树的期望代价 */
    printf("part 5: 复核原书 p.400/401 的两棵树（用 depth 表直接把定义式加起来）：\n");
    {
        /* 树 (a)：根 k2；k2 左 k1；k2 右 k4；k4 左 k3、右 k5
         *         depth：k1=1 k2=0 k3=2 k4=1 k5=2；d0=2 d1=2 d2=3 d3=3 d4=3 d5=3 */
        double da_node[N] = {1, 0, 2, 1, 2};
        double da_dummy[N + 1] = {2, 2, 3, 3, 3, 3};
        /* 树 (b)：根 k2；k2 左 k1；k2 右 k5；k5 左 k4；k4 左 k3
         *         depth：k1=1 k2=0 k3=3 k4=2 k5=1；d0=2 d1=2 d2=4 d3=4 d4=3 d5=2 */
        double db_node[N] = {1, 0, 3, 2, 1};
        double db_dummy[N + 1] = {2, 2, 4, 4, 3, 2};
        double a = expected_cost(da_node, da_dummy, p, q, N);
        double b = expected_cost(db_node, db_dummy, p, q, N);
        printf("        树 (a) 的期望搜索代价 = %.2f\n", a);
        printf("        树 (b) 的期望搜索代价 = %.2f  <- 由 OPTIMAL-BST 独立算出 %.2f\n",
               b, e[1][N]);
        assert(fabs(a - 2.80) < EPS);
        assert(fabs(b - 2.75) < EPS);
        assert(fabs(b - e[1][N]) < EPS);
    }

    /* 复杂度：Θ(n³) 与习题 14.5-3 的 Θ(n²) */
    printf("part 6: 子问题数 = %d = n(n+1)/2，每个 O(n) 试根 -> Θ(n^3)；\n", N * (N + 1) / 2);
    printf("        n=5 时试根总次数 = ");
    {
        int total = 0;
        for (int l = 1; l <= N; l++) {
            for (int i = 1; i <= N - l + 1; i++) { total += l; }
        }
        printf("%d 次（= 上表每个区间长度之和）\n", total);
        assert(total == 35);
    }
    printf("        习题 14.5-3：若在第 9 行直接按 (14.12) 现算 w(i,j)，\n");
    printf("        每次都要求一个 O(n) 的和 -> 总时间退化成 Θ(n^4)。\n");

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明关键数字：$e[1,5] = 2.75$、$root[1,5] = k_2$。'},
           {line:18,zh:'`optimal_bst`：15 行直译（含第 9 行的增量式 $w$ 维护）。'},
           {line:41,zh:'`construct_optimal_bst`：习题 14.5-1 的递归版本，打印整棵树。'},
           {line:57,zh:'`expected_cost`：按定义式算任意一棵树的期望代价（用深度表复核）。'},
           {line:76,zh:'★★ part 1：$e[1,5] = 2.75$ —— 与原书 Figure 14.10 一致。'},
           {line:83,zh:'★★ part 4：还原出的树 = Figure 14.10(b) 的形态。'},
           {line:87,zh:'★★ part 5：树 (a) 2.80、树 (b) 2.75 —— 独立复核原书 p.400/401 的两张表。'}]},
     tests:[{in:'原书 Figure 14.9 的键分布（n = 5）',out:'$e[1,5] = 2.75$，根 $k_2$'},
           {in:'Figure 14.9(a) 的树',out:'期望代价 2.80（非最优）'},
           {in:'试根总次数',out:'35 次（n = 5）'}],
    mapping:[{pc:11,pcCode:'t = e[i,r − 1] + e[r + 1,j] + w[i,j]',c:'`double t = e[i][r - 1] + e[r + 1][j] + w[i][j];`（第 30 行）'},
             {pc:9,pcCode:'w[i,j] = w[i,j − 1] + p_j + q_j',c:'`w[i][j] = w[i][j - 1] + p[j - 1] + q[j];`（第 28 行）'}]},
   {type:'analyze',title:'一本账：Θ(n³) 与 Knuth 的 Θ(n²)',claims:[
     {expr:'\\Theta(n^2)',when:'子问题个数（区间 $[i,j]$，$1 \\le i \\le j \\le n$）',page:404,source:'book'},
     {expr:'\\Theta(n^3)',when:'OPTIMAL-BST 的总时间（每格 $O(n)$ 试根）',page:405,source:'book'},
     {expr:'\\Theta(n^2)',when:'用 Knuth 的根单调性优化后（习题 14.5-3 的相关结论）',page:407,source:'book'},
    ],tables:[{caption:'原书 Figure 14.9 的键分布与最优树的深度（C 程序实测）',rows:[
      ['节点','$k_1$','$k_2$','$k_3$','$k_4$','$k_5$'],
      ['概率 $p_i$','0.15','0.10','0.05','0.10','0.20'],
      ['树 (a) 深度','1','0','2','1','2'],
      ['树 (b) 深度（最优）','1','0','3','2','1'],
      ['哑键','$d_0$','$d_1$','$d_2$','$d_3$','$d_4$','$d_5$'],
      ['概率 $q_i$','0.05','0.10','0.05','0.05','0.05','0.10'],
      ['树 (b) 深度','2','2','4','4','3','2'],
     ]},{caption:'三关的二维 DP 收口',rows:[
      ['','14.2 矩阵链','14.4 LCS','14.5 最优 BST'],
      ['子问题','区间 $[i,j]$','前缀对 $(i,j)$','区间 $[i,j]$（$w$ 辅助）'],
      ['枚举对象','劈开点 $k$','匹配 / 退让','根 $r$'],
      ['每格代价','$O(n)$','$O(1)$','$O(n)$'],
      ['总时间','$\\Theta(n^3)$','$\\Theta(mn)$','$\\Theta(n^3)$'],
     ]}],chart:{xMax:40,series:[
     {name:'试根总次数 ≈ n³/6',expr:'n * n * n / 384',color:'--viz-violation'},
     {name:'Knuth 优化后 ≈ n²/2',expr:'n * n / 2 / 8',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'$w[i,j]$ 为什么能增量维护',steps:[
      {zh:'$w[i,j] = \\sum_{l=i}^{j}p_l + \\sum_{l=i-1}^{j}q_l$，而 $w[i,j-1] = \\sum_{l=i}^{j-1}p_l + \\sum_{l=i-1}^{j-1}q_l$。'},
      {zh:'两者相减，恰好多出 $p_j$ 与 $q_j$。'},
      {tex:'w[i,j] = w[i,j-1] + p_j + q_j',zh:'★ 这就是第 9 行 —— 把 $O(n)$ 的求和变成 $O(1)$。若在第 11 行现算 $w(i,j)$，总时间会退化成 $\\Theta(n^4)$。'}]},
     ],
    note:''},
   {type:'prove',title:'最优子结构：子树仍是"同区间的"最优解',statement:'To characterize the optimal substructure of optimal binary search trees, we start with an observation about subtrees. Consider any subtree of a binary search tree.',page:402,
    intro:'★ 证明分两步：先证明"子树里的键必然是连续区间"（所以子问题形态封闭），再证明"子树必须最优"（所以能用 $\\min$ 拼）。',
    steps:[
     {title:'第一步：子树的键是一个**连续区间**',en:'In addition, a subtree that contains keys k i ,\u2026,k j must also have as its leaves the dummy keys d i \u22121 ,\u2026,d j .',page:402,
      body:['在一棵 BST 里，任何子树包含的键都是中序连续的一段 —— 因为 BST 的中序就是升序，而子树的中序是全局中序的一段。',
        '★ 更精确地说：若子树含 $k_i,\\dots,k_j$，则它的叶子（未命中区间）必然是 $d_{i-1},\\dots,d_j$ —— 这解释了为什么 $w(i,j)$ 的求和边界是 $[i-1, j]$。',
        '**意义**：子问题"键区间 $[i,j]$"是**闭合**的 —— 子问题还是同一种形态，DP 才能递推。∎']},
     {title:'第二步：子树的根必须最优',en:'The e[i,j] values give the expected search costs in optimal binary search trees.',page:404,
      body:['设区间 $[i,j]$ 的最优子树以 $k_r$ 为根，则左子树含 $k_i,\\dots,k_{r-1}$、右子树含 $k_{r+1},\\dots,k_j$。',
        '把**一整棵子树**往下压一层，内部的每个键与哑键都多付一次比较 → 总增量 = 该子树内概率之和 = $w(i,j)$。于是：$e[i,j] = \\min_r\\{e[i,r-1] + e[r+1,j] + w(i,j)\\}$。',
        '**断言**：左右子树必须各自最优 —— 否则把较差的一侧换成更优者会降低总和，与"$k_r$ 使总和最小"矛盾。∎']},
     {title:'第三步：正确答案的对照检验',en:'(a) A binary search tree with expected search cost 2.80. (b) A binary search tree with expected search cost 2.75. This tree is optimal.',page:401,
      body:['C 程序 part 5 把原书两张表的**深度**直接代进定义式：树 (a) 得 **2.80**、树 (b) 得 **2.75** —— 与原文数字逐位一致。',
        '而 OPTIMAL-BST 独立算出 $e[1,5] = 2.75$、$root[1,5] = 2$，并用 CONSTRUCT-OPTIMAL-BST 还原出与 Figure 14.10(b) 相同的树形。',
        '★ 两条独立路径互证：手算的定义式与算法的递推给出同一个 2.75。∎']},
    ],conclusion:'★ 结论：$\\Theta(n^3)$ 时间、$\\Theta(n^2)$ 空间；根单调性可优化到 $\\Theta(n^2)$。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'最优 BST 的递推式里，为什么每格要加 $w(i,j)$？',options:['因为 $e[i,j]$ 要把左右两棵子树的期望相乘，再决定根的代价','因为把整棵子树压下一层，内部每个键都多一次比较','因为要处理哑键的权重','因为 $w$ 是根的位置'],answer:1,
      why:'★ 子树整体下沉一层 → 增量恰好是该子树内全部概率之和（C 程序 part 5 的复核就用了这个事实）。'},
     {kind:'single',q:'只求答案（$e[1,n]$）时需要哪几张表？',options:['只要 $e$','$e$ 与 $w$','$e$、$w$ 与 $root$','只要 $root$ 就够，$e$ 可以从它反推出来'],answer:2,
      why:'★ 第 9–14 行要同时维护 $w$ 与 $root$ —— 后者用于重建树（习题 14.5-1）。'},
     {kind:'judge',q:'最优 BST 里频率最高的键一定在根上。',answer:false,
      why:'★ 不一定：Figure 14.10(b) 的根是 $k_2$（$p_2 = 0.10$），而最高频的 $k_5$（0.20）在深度 1。最优性要综合全部 $p$、$q$ 与结构约束。'},
     {kind:'judge',q:'把第 9 行的增量式 $w$ 改成在第 11 行现算 $w(i,j)$，总时间不会变。',answer:false,
      why:'★ 会退化成 $\\Theta(n^4)$ —— 每个子问题里每试一个根都要 $O(n)$ 求和（习题 14.5-3）。'},
     {kind:'simulate',q:'原书 Figure 14.9 的最优期望搜索代价是多少？（填小数，如 2.75）',expect:[2.75],placeholder:'例如：2.60',
      why:'$e[1,5] = 2.75$（Figure 14.10）。C 程序 part 1 实测吻合。'},
     {kind:'simulate',q:'$n = 5$ 时试根（第 11 行）共执行多少次？（填数字）',expect:[35],placeholder:'例如：20',
      why:'$\\sum_{l=1}^{5}(6-l)\\cdot l = 5+8+9+8+5 = 35$。C 程序 part 6 实测吻合。'},
    ],bookExercises:[
     {id:'14.5-1',page:406,star:0,statement:'Write pseudocode for the procedure CONSTRUCT-OPTIMAL-BST (root ,n) which, given the table root [1 : n,1 W n], outputs the structure of an optimal binary search tree. For the example in Figure 14.10, your procedure should print out the structure k 2 is the root k 1 is the left child of k 2 d 0 is the left child of k 1 d 1 is the right child of k 1 k 5 is the right child of k 2 k 4 is the left child of k 5 k 3 is the left child of k 4 d 2 is the left child of k 3 d 3 is the right child of k 3 d 4 is the right child of k 4 d 5 is the right child of k 5 corresponding to the optimal binary search tree shown in Figure 14.9(b).',hint:'递归（或按区间长度自顶向下）读 $root[i,j]$：打印 $k_r$ 是根，再对 $[i,r-1]$ 与 $[r+1,j]$ 递归，$i>j$ 时打印哑键 $d_{i-1}$。C 程序第 41 行的 `construct_optimal_bst` 就是它，输出与 Figure 14.9(b) 那棵最优树一致（$k_2$ 为根、$e[1,5] = 2.75$）。★ Figure 14.10 是 OPTIMAL-BST 算出的三张表 $e$、$w$、$root$，没有 (b) 这块面板。'},
     {id:'14.5-2',page:407,star:0,statement:'Determine the cost and structure of an optimal binary search tree for a set of n = 7 keys with the following probabilities: i 0 1 2 3 4 5 6 7 √i 0.04 0.06 0.08 0.02 0.10 0.12 0.14 q i 0.06 0.06 0.06 0.06 0.05 0.05 0.05 0.05',hint:'把 C 程序里的 $N$、$p$、$q$ 换成这组数据重跑（$n = 7$）—— 关键是照抄表里的 $p_1\\dots p_7$ 与 $q_0\\dots q_7$，再读 $e[1,7]$ 与 $root[1,7]$。'},
     {id:'14.5-3',page:407,star:0,statement:'Suppose that instead of maintaining the table w[i,j] , you computed the value of w(i,j) directly from equation (14.12) in line 9 of OPTIMAL-BST and used this computed value in line 11. How would this change affect the asymptotic running time of OPTIMAL-BST?',hint:'现算 $w(i,j) = \\sum_{l=i}^{j}p_l+\\sum_{l=i-1}^{j}q_l$ 要 $O(n)$：外层还有 $\\Theta(n^2)$ 个区间、内层 $O(n)$ 试根 → 每格 $O(n^2)$，总时间 $\\Theta(n^4)$。'},
    ]},
  ],
};
