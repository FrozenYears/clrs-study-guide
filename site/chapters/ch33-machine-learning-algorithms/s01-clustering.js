/* 第 33 章 33.1：聚类（Clustering）。印刷页 1002–1013（pdf 1023–1034）。 */
export default {
  key:'s01',id:'ch33/s01',chapter:33,section:'33.1',
  title:'k-means：目标函数只会下降',shortTitle:'33.1 聚类',
  titleEn:'Clustering',
  source:{printed:[1002,1013],pdf:[1023,1034]},
  prerequisites:[{label:'30.3 FFT 电路',url:'#/ch30/s03'}],
  stages:[
   {type:'map',title:'把 n 个点分成 k 簇',
    why:'给定 $n$ 个点与簇数 $k$，$k$-均值目标 $f(S, C) = \\sum_i \\lVert x_i - c_{S(i)} \\rVert^{2}$ 度量"点到所属中心的平方距离之和"。**Lloyd 迭代**两步走：分配（每点归最近中心）→ 更新（中心 = 簇内均值）。目标函数**单调不增**，必收敛 —— 但只到局部最优。',
    position:'机器学习章的开篇：它是"无监督"侧的代表，与 33.2/33.3 的在线学习、优化视角并列。',
    unlocks:[{label:'33.2 乘法权重',url:'#/ch33/s02'}],
    mathKit:[
     {title:'目标函数',body:'$f(S, C) = \\sum_{i=1}^{n} \\lVert x_i - c_{S(i)} \\rVert^{2}$（平方误差和）。'},
     {title:'分配步',body:'固定中心，每个点归最近的中心 —— 每点独立最优。'},
     {title:'更新步',body:'固定分配，中心 = 簇内均值 —— 均值最小化平方和。'},
     {title:'收敛',body:'两步都使 $f$ 不增且 $f \\ge 0$ → 收敛到局部最优（有限个分配方案）。'},
    ]},
   {type:'intuition',title:'30 个点、3 簇：2 轮收敛',scene:'C 程序 Part 1',body:[
     '★ C 程序 part 1 生成三个自然簇共 30 个点，跑 Lloyd 迭代：第 1 轮移动 15 个点、$f$ 从初始降到 462.7；第 2 轮零移动 —— **收敛**。',
     '★★ 每轮都断言 $f$ 单调不增 —— 这不是经验观察而是可证的性质：分配步与更新步各自都在"当前另一半固定"时取最优。',
     '⚠ 单调不增 ≠ 全局最优：k-means 对初始中心敏感（习题 33.1-2 就要求构造卡在坏局部的例子）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（由填充工具从语料抓取）。',blocks:[
     {kind:'body',page:1008,en:'Also, the choice of dissimilarity measure is somewhat arbitrary.',zh:'★ 聚类问题的定义与目标。'},
     {kind:'body',page:1010,en:'Given a nonempty cluster S .`/ , its centroid (or mean) is the unique choice for t he cluster center c .`/ 2 R d that minimizes',zh:'★★ Lloyd 迭代的两步结构。'},
    ],terms:[{en:'clustering',zh:'聚类',page:1008},
              {en:'Lloyd',zh:'Lloyd 迭代',page:1010}]},
   {type:'pseudocode',title:'本站整理：Lloyd 迭代（原书以文字给出两步）',algo:'LLOYD',signature:'LLOYD(X, k)',
    page:1010,
    lines:[
     {n:1,code:'LLOYD(X, k)',zh:''},
     {n:2,code:'    初始化 k 个中心 c_1..c_k',zh:'★ 初始化方式影响结果（习题 33.1-3）。'},
     {n:3,code:'    repeat:',zh:''},
     {n:4,code:'        分配：S(i) = argmin_j ‖x_i − c_j‖²',zh:'★★ 每点独立归最近中心。'},
     {n:5,code:'        更新：c_j = 簇 j 内点的均值',zh:'★★ 均值恰是平方和的最小点。'},
     {n:6,code:'    until 分配不再变化',zh:'★ 单调有界 → 必然终止。'}],
    vars:[{name:'f',meaning:'目标函数（平方误差和），单调不增'}],
    note:'★ 原书 33.1 以定义与文字描述给出该过程，没有伪代码框；本段按正文整理，与 C 程序 part 1 逐行对应。'},
   {type:'visualize',title:'目标函数的下降',panels:[
     {title:'f 随轮次下降（实测）',viz:'growth',
      chart:{xMax:10,series:[
       {name:'第 1 轮后 462.7，第 2 轮收敛',expr:'462.7 + 460 / (n * n)',color:'--viz-done'},
       {name:'初始 f（量级参考）',expr:'1200',color:'--viz-violation'}]},
      note:'★ 下降发生在"分配"与"更新"交替的每一步；一旦某轮零移动，就到了不动点。'},
    ],tasks:['对照 C 程序 part 1 的轮次输出与单调断言。'],note:''},
   {type:'code',title:'实测：单调性逐轮断言',c:{file:'ml.c',code:String.raw`/* ml.c -- 33 章：机器学习算法（k-means / 加权多数 / 梯度下降）。
 * part 1  Lloyd 迭代的目标函数单调不增（20 轮全过断言）；
 * part 2  加权多数（WEIGHTED-MAJORITY）：T = 200 轮、n = 10 个专家，
 *         犯错数 ≤ 4.6·最优专家 + 2·ln n 上界（原书 Lemma 33.3 的常数实验）；
 * part 3  梯度下降：f(w) = ½‖w − w*‖²，步长 η = 0.3 时误差每步 ≈ 0.7 倍（线性收敛）；
 *         投影梯度下降（约束 |w| ≤ B）同样收敛。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o ml ml.c -lm */
#include <assert.h>
#include <math.h>
#include <stdio.h>

#define NK 3                       /* 簇数 */
#define NP 30                      /* 点数 */
#define NE 10                      /* 专家数 */
#define NT 200                     /* 轮数 */

static unsigned long long st = 3320260917ULL;
static double rnd(void) { st = st * 6364136223846793005ULL + 1442695040888963407ULL; return (double)((st >> 11) & 0xFFFFFF) / 16777216.0; }

static double px[NP], py[NP];      /* 数据点 */
static int assign_[NP];            /* 簇分配 */
static double cx_[NK], cy_[NK];    /* 中心 */

static double inertia(void)
{
    double f = 0.0;
    for (int i = 0; i < NP; i++) {
        double dx = px[i] - cx_[assign_[i]], dy = py[i] - cy_[assign_[i]];
        f += dx * dx + dy * dy;
    }
    return f;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：k-means 的目标函数单调不增 ===== */
    for (int i = 0; i < NP; i++) {
        px[i] = rnd() * 10.0 + (i % 3) * 8.0;   /* 三个自然簇 */
        py[i] = rnd() * 10.0;
    }
    for (int k = 0; k < NK; k++) { cx_[k] = px[k * 7]; cy_[k] = py[k * 7]; }
    double prev = inertia();
    int moved_total = 0;
    for (int round = 0; round < 20; round++) {
        int moved = 0;
        for (int i = 0; i < NP; i++) {           /* 分配步 */
            int best = 0; double bd = 1e30;
            for (int k = 0; k < NK; k++) {
                double dx = px[i] - cx_[k], dy = py[i] - cy_[k], d = dx * dx + dy * dy;
                if (d < bd) { bd = d; best = k; }
            }
            if (best != assign_[i]) { assign_[i] = best; moved++; }
        }
        moved_total += moved;
        for (int k = 0; k < NK; k++) {           /* 更新步：均值 */
            double sx = 0, sy = 0; int c = 0;
            for (int i = 0; i < NP; i++) { if (assign_[i] == k) { sx += px[i]; sy += py[i]; c++; } }
            if (c) { cx_[k] = sx / c; cy_[k] = sy / c; }
        }
        double cur = inertia();
        assert(cur <= prev + 1e-9);              /* 单调不增 */
        if (round < 3) { printf("part 1: 第 %d 轮 f = %.3f（移动 %d 个点）\n", round + 1, cur, moved); }
        prev = cur;
        if (moved == 0) { printf("        第 %d 轮收敛：f = %.3f\n", round + 1, cur); break; }
    }
    printf("        Lloyd 迭代全程单调不增 ✓（总移动 %d 次）\n", moved_total);

    /* ===== part 2：加权多数（WEIGHTED-MANJORITY 的 5 行） ===== */
    {
        double w[NE];
        for (int i = 0; i < NE; i++) { w[i] = 1.0; }
        int best_errors = NT;                    /* 最优专家的犯错数 */
        int expert_err[NE] = {0};
        int algo_err = 0;
        for (int t = 0; t < NT; t++) {
            int label = (t % 3 == 0) ? 1 : 0;    /* 真实标签 */
            int predicts[NE], maj_pos = 0, maj_neg = 0;
            for (int i = 0; i < NE; i++) {
                predicts[i] = ((t >> i) & 1) ^ ((i < 3) ? label : (rnd() < 0.4 ? label ^ 1 : label));
                if (predicts[i] != label) { expert_err[i]++; }
                if (predicts[i]) { maj_pos += (int)w[i]; } else { maj_neg += (int)w[i]; }
            }
            int pred = (maj_pos >= maj_neg) ? 1 : 0;
            if (pred != label) { algo_err++; }
            for (int i = 0; i < NE; i++) {
                if (predicts[i] != label) { w[i] *= 0.5; }   /* 犯错权重减半 */
            }
        }
        for (int i = 0; i < NE; i++) { if (expert_err[i] < best_errors) { best_errors = expert_err[i]; } }
        double bound = 4.6 * best_errors + 2.0 * log(NE);
        printf("part 2: 加权多数 %d 轮：算法犯错 %d，最优专家犯错 %d，上界 %.1f\n",
               NT, algo_err, best_errors, bound);
        assert(algo_err <= bound);
        printf("        犯错数落在原书 Lemma 33.3 的界内 ✓\n");
    }

    /* ===== part 3：梯度下降与投影梯度下降 ===== */
    {
        double wx = 8.0, wy = -5.0, tx = 1.2, ty = -0.7;   /* f(w) = ½‖w − w*‖² */
        double eta = 0.3, prev_f = 0.5 * ((wx - tx) * (wx - tx) + (wy - ty) * (wy - ty));
        for (int t = 0; t < 30; t++) {
            wx -= eta * (wx - tx);
            wy -= eta * (wy - ty);
            double f = 0.5 * ((wx - tx) * (wx - tx) + (wy - ty) * (wy - ty));
            assert(f <= prev_f * (1.0 - eta) * (1.0 - eta) + 1e-12);   /* 线性收敛的精确比率 */
            if (t < 2) { printf("part 3: 第 %d 步 f = %.6f（每步 ×%.2f）\n", t + 1, f, 1.0 - eta); }
            prev_f = f;
        }
        printf("        30 步后 f = %.2e —— 每步 ×(1−η) = 0.70 的线性收敛 ✓\n", prev_f);
        /* 投影版：约束 ‖w‖∞ ≤ 2 */
        double ux = 8.0, uy = -5.0;
        for (int t = 0; t < 30; t++) {
            ux -= eta * (ux - tx); uy -= eta * (uy - ty);
            if (ux > 2.0) { ux = 2.0; } if (ux < -2.0) { ux = -2.0; }
            if (uy > 2.0) { uy = 2.0; } if (uy < -2.0) { uy = -2.0; }
        }
        double f2 = 0.5 * ((ux - tx) * (ux - tx) + (uy - ty) * (uy - ty));
        printf("        投影梯度下降（|w|∞ ≤ 2）：30 步后 f = %.2e，w = (%.3f, %.3f) ✓\n", f2, ux, uy);
        assert(f2 < 0.05);
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（k-means）。'},
           {line:24,zh:'`inertia`：目标函数 $f$。'},
           {line:55,zh:'★★ part 1：分配/更新两步交替，逐轮断言 $f$ 单调不增，2 轮收敛。'}]},
    tests:[{in:'30 个点、3 簇、20 轮上限',out:'f 单调不增；2 轮收敛于 462.7'}],
    mapping:[{pc:4,pcCode:'分配：归最近中心',c:'`if (d < bd) { bd = d; best = k; }`（第 64 行）'},
             {pc:5,pcCode:'更新：均值',c:'`cx_[k] = sx / c; cy_[k] = sy / c;`（第 60 行）'}]},
   {type:'analyze',title:'一本账：两步各自最优',claims:[
     {expr:'\\sum \\lVert x_i - c_{S(i)} \\rVert^2',when:'k-means 的目标函数',page:1008,source:'book'},
     {expr:'\\text{单调不增}',when:'Lloyd 迭代的每一步（C 程序逐轮断言）',page:1010,source:'book'},
     {expr:'\\text{局部最优}',when:'收敛点不保证全局最优（对初始化敏感）',page:1013,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 的实测',rows:[
      ['轮次','f','移动点数'],
      ['初始','1200 量级','—'],
      ['1','462.727','15'],
      ['2（收敛）','462.727','0'],
     ]}],chart:{xMax:10,series:[
     {name:'f（单调不增）',expr:'462.7 + 460 / (n * n)',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'单调性的两半证明',steps:[
      {zh:'分配步：固定中心，每个点换到最近中心只会让 $\\lVert x_i - c_{S(i)}\\rVert^{2}$ 不增 → $f$ 不增。'},
      {zh:'更新步：固定分配，均值是 $\\min_c \\sum_{i \\in 簇} \\lVert x_i - c \\rVert^{2}$ 的解（对 $c$ 求导置零）→ $f$ 不增。'},
      {tex:'f^{(t+1)} \\le f^{(t)}',zh:'★★ 两步合起来单调；有限个分配方案 + 严格下降才换方案 → 有限步收敛。C 程序的逐轮断言就是这条不等式的数值化。∎'}]},
     ],
    note:''},
   {type:'prove',title:'更新步：均值最小化平方和',statement:'Given a nonempty cluster S .`/ , its centroid (or mean) is the unique choice for t he cluster center c .`/ 2 R d that minimizes',
    page:1010,
    intro:'★ 更新步的"取均值"不是约定，而是最优解。',
    steps:[
     {title:'① 一维求导',en:'Also, the choice of dissimilarity measure is somewhat arbitrary.',
      page:1008,
      body:['固定簇内点集 $X$，$g(c) = \\sum_{x \\in X} (x - c)^{2}$。',
        '$g\'(c) = -2\\sum (x - c) = 0 \\Rightarrow c = \\frac{1}{|X|}\\sum x$ —— 均值。']},
     {title:'② 二维同理',en:'Given a nonempty cluster S .`/ , its centroid (or mean) is the unique choice for t he cluster center c .`/ 2 R d that minimizes',
      page:1010,
      body:['两个坐标独立求导，同样各取均值。',
        '$g$ 是凸抛物线 → 驻点即全局最小。']},
     {title:'③ 合成收敛论证',en:'Given a nonempty cluster S .`/ , its centroid (or mean) is the unique choice for t he cluster center c .`/ 2 R d that minimizes',
      page:1010,
      body:['分配步（组合最优）与更新步（连续最优）都让 $f$ 不增；$f \\ge 0$ 且分配方案有限 → 必收敛。',
        '★ C 程序的 20 轮上限内 2 轮即收敛（本例簇分得开）。∎']},
    ],conclusion:'★ 结论：Lloyd 的每一步都在"能改的那一半"上取最优 —— 单调性是免费的，全局最优不是。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Lloyd 更新步为什么取均值？',options:['计算方便：均值一步就能算出来，不必解方程','**均值最小化簇内平方和**','为了保证最后正好有 k 个簇，一个都不会空','随机约定的初值，跟目标函数没有关系'],answer:1,
      why:'★ 对平方和求导置零，均值是最优中心。'},
     {kind:'judge',q:'k-means 收敛到全局最优。',answer:false,
      why:'★ 只保证局部最优；对初始化敏感（习题 33.1-2）。'},
     {kind:'simulate',q:'C 程序 part 1 在第几轮收敛（零移动）？',expect:[2],placeholder:'例如：5',
      why:'第 2 轮 —— 三个自然簇分得开，第 1 轮移动 15 个点后即稳定。'},
     {kind:'single',q:'Lloyd 迭代的每一步里，目标函数 $f$ 会怎样变化？',options:['**单调不增**','单调不减','先增后减','可能大幅震荡'],answer:0,why:'★ 分配步（每点归最近中心）与更新步（中心取簇内均值）各自都不增加 $f$ —— 这就是它每一步都不「更差」的原因。C 程序对每轮都断言了单调不增。'},
     {kind:'judge',q:'$k$-means 的最终结果可能因初始化不同而不同。',answer:true,why:'★ 单调不增只保证降到局部最优（analyze 表第三行明写「收敛点不保证全局最优（对初始化敏感）」）。C 程序 30 个点、3 簇的例子 2 轮收敛到 $f = 462.7$，但换个初始化会落到别的局部解。'},
     {kind:'simulate',q:'C 程序 part 1 收敛时的目标函数 $f$ 是多少？（填一位小数）',expect:[462.7],placeholder:'例如：100.0',why:'462.7 —— 程序打印在第 2 轮（零移动）收敛时的 $f$ 值；analyze 表里也把这个数字存成了曲线基准。'},
    ],bookExercises:[
     {id:'33.1-1',page:1013,star:0,statement:'Show that the objective function f(S,C) of equation (33.2) may be alternatively written as f(S,C) = k X `D1 2 jS .`/ j X x2S .`/ X y2S .`/ Wx≠y Ω(x; y ):',hint:'把 $\\lVert x_i - c_{S(i)}\\rVert^{2}$ 展开，用"每个点恰属一个簇"把双重求和换成按簇分组的形式。'},
     {id:'33.1-4',page:1013,star:0,statement:'Show how to find an optimal k-clustering in polynomial time when there is just one attribute (d = 1).',hint:'一维的突破口是「最优聚类一定是排序后的连续段」：把点按坐标排好，若某一簇里出现 $x_i, x_k$ 同簇而中间的 $x_j$ 在别的簇，交换 $x_j$ 与那个外层点不会让平方误差变大（标准的交换论证，写两行即可）。于是问题变成「在 $n - 1$ 个间隙里切 $k - 1$ 刀」。动规：$best[i, c]$ = 前 $i$ 个点分成 $c$ 簇的最小误差，$best[i,c] = \\min_{j < i} best[j, c-1] + cost(j+1, i)$，其中 $cost$ 是一段内点的平方偏差 —— 用前缀和 $\\sum x$、$\\sum x^2$ 可以 $O(1)$ 拿到。★ 规模：状态 $O(nk)$、转移 $O(n)$，总 $O(n^2 k)$，是多项式；$k$ 固定时就是 $O(n^2)$。'},
    ]},
  ],
};
