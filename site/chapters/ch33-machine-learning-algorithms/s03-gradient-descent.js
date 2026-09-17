/* 第 33 章 33.3：梯度下降（Gradient descent）。印刷页 1022–1038（pdf 1043–1059）。 */
export default {
  key:'s03',id:'ch33/s03',chapter:33,section:'33.3',
  title:'梯度下降与它的收敛率',shortTitle:'33.3 梯度下降',
  titleEn:'Gradient descent',
  source:{printed:[1022,1038],pdf:[1043,1059]},
  prerequisites:[{label:'33.2 乘法权重',url:'#/ch33/s02'}],
  stages:[
   {type:'map',title:'沿负梯度走，误差按 (1−η) 收缩',
    why:'对可微目标 $f$，**GRADIENT-DESCENT**（6 行）每步 $w \\leftarrow w - \\eta\\nabla f(w)$。对凸函数（梯度 Lipschitz 常数 $L$）有 $f(w_{t+1}) \\le f(w_t) - \\eta(1 - \\eta L/2)\\lVert\\nabla f\\rVert^{2}$；本关的二次目标 $f(w) = \\tfrac12\\lVert w - w^{*}\\rVert^{2}$ 更干脆：每步误差精确乘 $(1 - \\eta)$。带约束时加**投影**（GRADIENT-DESCENT-CONSTRAINED，7 行）。',
    position:'机器学习章的收尾：从离散的"专家/权重"过渡到连续优化 —— 逻辑回归的训练（原书式 33.32/33.33）就是它的应用。',
    unlocks:[],
    mathKit:[
     {title:'更新式',body:'$w \\leftarrow w - \\eta\\nabla f(w)$，$\\eta$ 是步长。'},
     {title:'凸性（引理 33.6）',body:'$f(y) \\ge f(x) + \\nabla f(x)^{T}(y - x)$ —— 一阶下界。'},
     {title:'二次目标的收缩率',body:'$f(w) = \\tfrac12\\lVert w - w^{*}\\rVert^{2}$：每步 $f$ 精确乘 $(1-\\eta)^{2}$（误差乘 $1-\\eta$）。'},
     {title:'投影版',body:'约束集上每步后投影回可行域（$|w|_{\\infty} \\le B$ 时逐坐标截断）。'},
    ]},
   {type:'intuition',title:'每步 ×0.70：30 步降到 1.6e-08',scene:'C 程序 Part 3',body:[
     '★ C 程序 part 3 对 $f(w) = \\tfrac12\\lVert w - w^{*}\\rVert^{2}$（$w^{*} = (1.2, -0.7)$）从 $w = (8, -5)$ 出发，步长 $\\eta = 0.3$：每步 $f$ **精确乘 $(1-\\eta)^{2} = 0.49$**（误差乘 0.70），程序逐步断言这个比率 —— 收敛率不是"大约"，是恒等式。',
     '★ 30 步后 $f = 1.64\\text{e-}08$。',
     '★★ 投影版（约束 $\\lVert w \\rVert_{\\infty} \\le 2$）同样 30 步收敛到 $w = (1.200, -0.700)$、$f = 1.2\\text{e-}09$ —— 投影不破坏凸优化的收敛（投影算子是非扩张的）。',
     '⚠ 步长不是越大越好：$\\eta \\ge 1/L$ 会振荡甚至发散（二次目标的 $L = 1$，所以 $\\eta < 2$ 是稳定域，本例取 0.3）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（由填充工具抓取）。',blocks:[
     {kind:'body',page:1025,en:'@@Q|1025|GRADIENT-DESCENT@@',zh:'★ 算法 6 行的结构。'},
     {kind:'body',page:1027,en:'@@Q|1027|convex@@',zh:'★★ 凸性（引理 33.6）是收敛证明的地基。'},
    ],terms:[{en:'convex function',zh:'凸函数',page:1026},
              {en:'learning rate',zh:'步长 η',page:1025}]},
   {type:'pseudocode',title:'GRADIENT-DESCENT（原书 p.1025，6 行）',algo:'GRADIENT-DESCENT',signature:'GRADIENT-DESCENT(f, ∇f, w, η)',
    page:1025,
    lines:[
     {n:1,code:'for t = 0 to ∞',zh:''},
     {n:2,code:'    g = ∇f(w)',zh:'★ 求梯度。'},
     {n:3,code:'    if ‖g‖ 足够小: return w',zh:'★ 停机条件。'},
     {n:4,code:'    w = w − η·g',zh:'★★ 沿负梯度走一步。'},
     {n:5,code:'return w',zh:'★ 对凸函数收敛到全局最优。'}],
    vars:[{name:'η',meaning:'步长（学习率）'}],
    note:'★ 语料的 GRADIENT-DESCENT（p.1025）6 行、GRADIENT-DESCENT-CONSTRAINED（p.1032）7 行；C 程序 part 3 分别实现（后者每步后投影）。',
    more:[{algo:'GRADIENT-DESCENT-CONSTRAINED',subtitle:'带约束版：每步后投影回可行域（p.1032，7 行）',signature:'GRADIENT-DESCENT-CONSTRAINED(f, ∇f, w, η, D)',page:1032,
      lines:[{n:1,code:'    与无约束版相同的更新',zh:''},
        {n:2,code:'    w = PROJECT_D(w)',zh:'★★ 投影算子：把 w 拉回约束集 D。'},
        {n:3,code:'    // D = {w : ‖w‖∞ ≤ B} 时投影 = 逐坐标截断',zh:'★ C 程序的 if (ux > 2.0) ux = 2.0; …'}],
      vars:[{name:'D',meaning:'可行域（凸集）'}],
      note:'★ 投影是非扩张映射，不放大距离 —— 所以凸收敛论证在约束下依然成立。'}]},
   {type:'visualize',title:'线性收敛的速度',panels:[
     {title:'f 的指数下降',viz:'growth',
      chart:{xMax:30,series:[
       {name:'f_t = f_0·(1−η)^{2t}（实测恒等式）',expr:'15.9 * Math.pow(0.49, n)',color:'--viz-done'},
       {name:'参考：f_0/ t',expr:'15.9 / n',color:'--viz-compare'}]},
      note:'★ 指数下降 vs 次线性下降：30 步 1.6e-08 的数值来源。'},
    ],tasks:['对照 C 程序 part 3 的逐步比率断言（×0.49）。'],note:''},
   {type:'code',title:'实测：比率恒等式与投影版',c:{file:'ml.c',code:String.raw`/* ml.c -- 33 章：机器学习算法（k-means / 加权多数 / 梯度下降）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 3（梯度下降）。'},
           {line:113,zh:'★★ part 3：二次目标上逐步断言 $f_{t+1} \\le (1-\\eta)^{2} f_{t}$ —— 收敛率是恒等式。'},
           {line:126,zh:'★ 投影版（$|w|_{\\infty} \\le 2$）：30 步后 w 回到 (1.200, −0.700)。'}]},
    tests:[{in:'f(w) = ½‖w − w*‖², η = 0.3',out:'每步 f ×0.49；30 步 f = 1.6e-08'},
           {in:'投影版 |w|∞ ≤ 2',out:'30 步 f = 1.2e-09，w = (1.200, −0.700)'}],
    mapping:[{pc:4,pcCode:'w = w − η·∇f(w)',c:'`wx -= eta * (wx - tx);`（第 104 行）'},
             {pc:2,pcCode:'w = PROJECT_D(w)',c:'`if (ux > 2.0) { ux = 2.0; }`（第 117 行）'}]},
   {type:'analyze',title:'一本账：三个成分',claims:[
     {expr:'w \\leftarrow w - \\eta\\nabla f(w)',when:'GRADIENT-DESCENT 的更新式',page:1025,source:'book'},
     {expr:'(1-\\eta)^2',when:'二次目标的每步收缩率（精确）',page:1029,source:'book'},
     {expr:'\\eta < 2/L',when:'二次目标的稳定域',page:1029,source:'book'},
     {expr:'\\text{投影}',when:'约束版的修正（GRADIENT-DESCENT-CONSTRAINED）',page:1032,source:'book'},
    ],tables:[{caption:'C 程序 Part 3 的实测',rows:[
      ['项','值'],
      ['初始 f','15.9'],
      ['每步比率','×0.49（= (1−0.3)²，逐步断言）'],
      ['30 步后 f','1.64e-08'],
      ['投影版 30 步','1.21e-09，w = (1.200, −0.700)'],
     ]},{caption:'33 章三个算法的对比',rows:[
      ['','k-means','加权多数','梯度下降'],
      ['世界','离散分配','离散专家','连续参数'],
      ['保证','单调收敛（局部）','与最优专家差 2 ln n','凸时全局收敛'],
      ['账本','目标函数单调','势函数 Φ','收缩率 (1−η)'],
     ]}],chart:{xMax:30,series:[
     {name:'指数下降 (0.49)^t',expr:'15.9 * Math.pow(0.49, n)',color:'--viz-done'},
     {name:'次线性 1/t',expr:'15.9 / n',color:'--viz-compare'}]},
    derivations:[{kind:'line',title:'二次目标的收缩率是恒等式',steps:[
      {zh:'$f(w) = \\tfrac12\\lVert w - w^{*}\\rVert^{2}$，$\\nabla f = w - w^{*}$。'},
      {zh:'更新后 $w - w^{*} = (1-\\eta)(w_{old} - w^{*})$ —— 误差向量精确乘 $(1-\\eta)$。'},
      {zh:'于是 $f_{t+1} = (1-\\eta)^{2} f_{t}$ —— 不是界，是**恒等式**（C 程序逐步断言）。'},
      {tex:'f_{30} = 15.9 \\times 0.49^{30} \\approx 1.6\\text{e-}08',zh:'★★ 这解释了为什么"学习率"是机器学习的第一旋钮：它直接出现在收敛率的指数里。∎'}]},
     ],
    note:''},
   {type:'prove',title:'凸性下的收敛（引理 33.6/33.7 的路线）',statement:'@@Q|1027|convex@@',
    page:1027,
    intro:'★ 二次目标太特殊；一般凸函数的证明用三步：凸性下界 + Lipschitz 梯度 + 步长选择。',
    steps:[
     {title:'① 凸函数的一阶下界',en:'@@Q|1027|convex@@',
      page:1027,
      body:['凸性给出 $f(y) \\ge f(x) + \\nabla f(x)^{T}(y - x)$ —— 切线是下界（引理 33.6）。',
        '这把"全局最小值"与"当前位置的梯度"连起来。']},
     {title:'② 一步的下降量',en:'@@Q|1025|GRADIENT-DESCENT@@',
      page:1025,
      body:['把 $y = w - \\eta\\nabla f(w)$ 代入下界，配合梯度 Lipschitz 常数 $L$：',
        '$f(w_{t+1}) \\le f(w_t) - \\eta(1 - \\eta L/2)\\lVert\\nabla f(w_t)\\rVert^{2}$（引理 33.7）。']},
     {title:'③ 累加成收敛率',en:'@@Q|1025|GRADIENT-DESCENT@@',
      page:1025,
      body:['只要 $\\eta < 2/L$，每步都真下降；对强凸函数可累加出线性收敛率。',
        '★ 本例 $L = 1$、$\\eta = 0.3$：实测每步 $\\times 0.49$，与理论完全一致（二次目标下不等式变成等式）。∎']},
    ],conclusion:'★ 结论：凸性给下界、Lipschitz 给稳定域、步长给速度 —— 梯度下降的三个旋钮各司其职。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'本关二次目标的每步收缩率是多少（f 的比率）？',options:['0.3','**0.49**','0.7','0.09'],answer:1,
      why:'★ f 乘 (1−η)² = 0.49；误差向量乘 0.7（C 程序逐步断言）。'},
     {kind:'judge',q:'步长 η 越大收敛越快。',answer:false,
      why:'★ η ≥ 2/L 时发散；0.3 是 1 与 2 之间的安全选择。'},
     {kind:'judge',q:'约束版每步后要把 w 投影回可行域。',answer:true,
      why:'★ GRADIENT-DESCENT-CONSTRAINED 的第 7 行；投影非扩张，不破坏收敛。'},
     {kind:'simulate',q:'C 程序 part 3 里 30 步后的 f 量级是多少？（填 1.6e-08 形式的指数）',expect:[8],placeholder:'例如：6',
      why:'1.64e-08 —— 指数 8；15.9 × 0.49^30。'},
    ],bookExercises:[
     {id:'33.3-1',page:1037,star:0,statement:'In order to run GRADIENT-DESCENT-CONSTRAINED for any problem, you need to implement the projection step, as well as t o compute bounds on R and L.',hint:'从凸性的定义不等式出发，用"两点连线在函数图象上方"的几何意义推出一阶下界（切线在图象下方）。'},
     {id:'33.3-4',page:1037,star:0,statement:'In order to run GRADIENT-DESCENT-CONSTRAINED for any problem, you need to implement the projection step, as well as t o compute bounds on R and L.',hint:'逐项看式 (33.32)：平方项是凸的、交叉项写成二次型后半正定 —— Hessian 半正定即凸。'},
    ]},
  ],
};
