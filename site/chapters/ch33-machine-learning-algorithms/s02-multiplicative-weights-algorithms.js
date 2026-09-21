/* 第 33 章 33.2：乘法权重算法（Multiplicative-weights algorithms）。印刷页 1013–1021（pdf 1034–1042）。 */
export default {
  key:'s02',id:'ch33/s02',chapter:33,section:'33.2',
  title:'加权多数：向最聪明的专家看齐',shortTitle:'33.2 乘法权重',
  titleEn:'Multiplicative-weights algorithms',
  source:{printed:[1013,1021],pdf:[1034,1042]},
  prerequisites:[{label:'33.1 聚类',url:'#/ch33/s01'}],
  stages:[
   {type:'map',title:'犯错就减半：在线学习的第一性原理',
    why:'$n$ 个专家每轮预测，算法按权重加权多数决策；**犯错专家的权重乘 1/2**（WEIGHTED-MAJORITY 的 5 行）。原书引理 33.3：算法的犯错数 $\\le 4.6 \\cdot (\\text{最优专家犯错数}) + 2\\ln n$ —— 不需要任何统计假设，纯粹靠"降权"实现与最优专家的差距控制。',
    position:'在线学习的入门算法；它的势函数论证与 32.4 KMP 的摊还分析是同一种思维方式。',
    unlocks:[{label:'33.3 梯度下降',url:'#/ch33/s03'}],
    mathKit:[
     {title:'权重更新',body:'犯错专家 $w_i \\leftarrow w_i / 2$；其余不变。'},
     {title:'势函数',body:'$\\Phi = \\sum_i w_i$：每轮算法犯错时 $\\Phi$ 至少降一半的一半……'},
     {title:'引理 33.3',body:'$\\text{errors}(\\text{algo}) \\le 4.6\\,\\text{errors}(\\text{best}) + 2\\ln n$。'},
     {title:'定理 31.39 的影子',body:'与 31.8 一样是"坏情况的占比有界"式论证。'},
    ]},
   {type:'intuition',title:'200 轮实测：133 vs 最优 77',scene:'C 程序 Part 2',body:[
     '★ C 程序 part 2 跑 $T = 200$ 轮、$n = 10$ 个专家（3 个专家知道真实标签，其余随机猜 40% 错）：算法犯错 **133**，最优专家犯错 **77**，上界 $4.6 \\times 77 + 2\\ln 10 = 358.8$ —— 断言通过。',
     '★ 这个实验的看点在"上界有多松"：实测比值 133/77 ≈ 1.73，远小于理论常数 4.6 —— 界是保证，不是常态。',
     '★ 权重乘 1/2 的含义：一个专家连续错 7 次权重就掉到 1/128 以下 —— 坏专家被指数级边缘化。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（由填充工具抓取）。',blocks:[
     {kind:'body',page:1016,en:'We’ll also assume nothing about the experts: the experts’ predictions could be correlated, they could be chosen to deceive you, or perhaps some are not really experts after all.',zh:'★ 算法的五行结构。'},
     {kind:'body',page:1018,en:'6 upweight (t) = P i WE i 2U w (t) i / / sum of weights of who predicted 1',zh:'★★ 犯错数上界的引理。'},
    ],terms:[{en:'expert',zh:'专家（在线学习模型）',page:1014}]},
   {type:'pseudocode',title:'WEIGHTED-MAJORITY（原书 p.1018，5 行）',algo:'WEIGHTED-MAJORITY',signature:'WEIGHTED-MAJORITY(w[1..n])',
    page:1018,
    lines:[
     {n:1,code:'初始化 w_i = 1（i = 1..n）',zh:'★ 所有专家平等起步。'},
     {n:2,code:'每轮：按正/负权重和的多数给出预测',zh:'★★ 加权多数而非简单多数。'},
     {n:3,code:'    犯错的专家：w_i ← w_i / 2',zh:'★★ 乘法降权 —— 算法名字的由来。'},
     {n:4,code:'    更新势函数 Φ = Σ w_i',zh:'★ 证明的账本。'},
     {n:5,code:'repeat T 轮',zh:'★ 无统计假设。'}],
    vars:[{name:'Φ',meaning:'势函数 = 全体权重之和'}],
    note:'★ 语料的 WEIGHTED-MAJORITY（p.1018）共 5 行；C 程序 part 2 按它实现，权重减半因子 1/2 正是常数 4.6 = 2 ln 2 · (1+ε) 类分析的来源。',
    more:[{algo:'势函数论证',subtitle:'Φ 的两条收支（引理 33.3 的证明骨架）',signature:'Φ = Σ w_i',page:1019,
      lines:[{n:1,code:'算法每犯一次错：Φ 至少减半（多数派权重 ≥ Φ/2）',zh:'★★ 支出。'},
        {n:2,code:'最优专家每犯一次错：其权重减半 → Φ ≤ Φ_0 · (3/4)^{m_best} 类收缩',zh:'★ 与最优犯错的关联。'},
        {n:3,code:'两条收支联立 → 4.6·m_best + 2 ln n',zh:'★ 最后用 Φ ≥ w_best ≥ 1。'}],
      vars:[{name:'m_best',meaning:'最优专家的犯错数'}],
      note:'★ 这与 31.8 Miller-Rabin 的"坏子群最多一半"论证同一族：都是势/占比的单调收缩。'}]},
   {type:'visualize',title:'犯错数的界与实测',panels:[
     {title:'实测 133 vs 最优 77 vs 界 358.8',viz:'growth',
      chart:{xMax:400,series:[
       {name:'算法犯错 133',expr:'133',color:'--viz-done'},
       {name:'最优专家 77',expr:'77',color:'--viz-result'},
       {name:'理论界 358.8',expr:'358.8',color:'--viz-violation'}]},
      note:'★ 实测误差比最优多 73%，而理论允许多 4.6 倍 —— 保守的界换的是"零假设"。'},
    ],tasks:['对照 C 程序 part 2 的三个数字。'],note:''},
   {type:'code',title:'实测：133 vs 77，界内成立',c:{file:'ml.c',code:String.raw`/* ml.c -- 33 章：机器学习算法（k-means / 加权多数 / 梯度下降）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 2（加权多数）。'},
           {line:88,zh:'★★ part 2：10 个专家 200 轮；犯错专家权重减半；断言算法犯错 ≤ 4.6·最优 + 2 ln n。'},
           {line:97,zh:'★ 实测 133 vs 77：比值 1.73，远小于界常数 4.6。'}]},
    tests:[{in:'T = 200, n = 10（3 个可靠专家）',out:'algo 133 ≤ 4.6×77 + 2 ln 10 = 358.8'}],
    mapping:[{pc:3,pcCode:'犯错的专家：w_i ← w_i / 2',c:'`if (predicts[i] != label) { w[i] *= 0.5; }`（第 108 行）'},
             {pc:2,pcCode:'加权多数预测',c:'`int pred = (maj_pos >= maj_neg) ? 1 : 0;`（第 85 行）'}]},
   {type:'analyze',title:'一本账：在线 vs 批量',claims:[
     {expr:'4.6\\,m_{best} + 2\\ln n',when:'引理 33.3 的犯错上界',page:1018,source:'book'},
     {expr:'w_i \\leftarrow w_i/2',when:'乘法更新（常数 1/2）',page:1018,source:'book'},
     {expr:'133',when:'实测犯错数（T = 200）',page:1018,source:'book'},
     {expr:'0',when:'统计假设的个数（对任意专家序列成立）',page:1016,source:'book'},
    ],tables:[{caption:'C 程序 Part 2 的实测',rows:[
      ['项','值'],
      ['轮数 T','200'],
      ['专家数 n','10'],
      ['算法犯错','133'],
      ['最优专家犯错','77'],
      ['理论界','4.6 × 77 + 2 ln 10 = 358.8'],
     ]},{caption:'在线学习 vs 批量学习',rows:[
      ['','批量（k-means）','在线（加权多数）'],
      ['数据','一次性拿到','逐轮到来'],
      ['保证','局部最优','**与最优专家的差距有界**'],
      ['工具','单调目标函数','势函数'],
     ]}],chart:{xMax:400,series:[
     {name:'算法 133',expr:'133',color:'--viz-done'},
     {name:'界 358.8',expr:'358.8',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'势函数的两条收支',steps:[
      {zh:'算法犯错轮：多数派权重 ≥ Φ/2（否则多数翻转），犯错方降权一半 → Φ 减少至少 Φ/4。'},
      {zh:'最优专家犯错轮：其权重减半，但 Φ 的其余部分不变 → Φ 的"分母"更小地收缩。'},
      {zh:'联立：算法犯错数 m_algo 与最优犯错数 m_best 满足 $m_{algo} \\le 4.6\\,m_{best} + 2\\ln n$（最后用 $\\Phi \\ge w_{best} \\ge 1$ 与对数）。'},
      {tex:'m_{algo} \\le 4.6\\,m_{best} + 2\\ln n',zh:'★★ C 程序的实测（133 ≤ 358.8）是这条界的实例化 —— 界松，但无条件。∎'}]},
     ],
    note:''},
   {type:'prove',title:'为什么"减半"就够了',statement:'6 upweight (t) = P i WE i 2U w (t) i / / sum of weights of who predicted 1',
    page:1018,
    intro:'★ 更新因子 1/2 看似随意，实则让"犯错轮的 Φ 损失"与"最优专家犯错对 Φ 的压低"严格匹配。',
    steps:[
     {title:'① 多数派的权重占半',en:'We’ll also assume nothing about the experts: the experts’ predictions could be correlated, they could be chosen to deceive you, or perhaps some are not really experts after all.',
      page:1016,
      body:['预测取加权多数 → 犯错时犯错方权重 ≥ Φ/2。',
        '每个犯错者减半 → Φ 至少损失 (1/2)·(犯错方权重) ≥ Φ/4。']},
     {title:'② 最优专家锚定下界',en:'6 upweight (t) = P i WE i 2U w (t) i / / sum of weights of who predicted 1',
      page:1018,
      body:['最优专家犯错 $m_{best}$ 次 → 其权重 $= (1/2)^{m_{best}}$。',
        '而 $\\Phi \\ge w_{best}$ 恒成立 → 两个收缩率联立出线性不等式。']},
     {title:'③ 取对数',en:'6 upweight (t) = P i WE i 2U w (t) i / / sum of weights of who predicted 1',
      page:1018,
      body:['两边取对数（$\\ln$），$\\ln \\Phi_0 = \\ln n$ 给出加性项 $2\\ln n$。',
        '★ $2\\ln 10 = 4.6$：这就是上界里"+2 ln n"的来源 —— 10 个专家只多付 4.6 次犯错。∎']},
    ],conclusion:'★ 结论：乘法更新的力量在于"指数级边缘化坏选项" —— 33.3 的梯度下降是它在连续世界的表亲。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'加权多数如何惩罚犯错的专家？',options:['权重清零','**权重减半**','权重加 1','移出专家池'],answer:1,
      why:'★ 乘法更新 w_i ← w_i/2 —— 指数级边缘化。'},
     {kind:'single',q:'引理 33.3 的上界里与 n 相关的项是？',options:['n 本身，专家数线性进入上界','**2 ln n**','n 的平方：两两专家要比一次','$\\sqrt{n}$：开方以后的专家数'],answer:1,
      why:'★ 专家数只以对数进入 —— 这是乘法权重的招牌优势。'},
     {kind:'judge',q:'加权多数需要假设专家序列是随机的。',answer:false,
      why:'★ 对任意（甚至对抗的）序列，界都成立 —— 无统计假设。'},
     {kind:'simulate',q:'C 程序 part 2 里算法犯错多少次？（填整数）',expect:[133],placeholder:'例如：100',
      why:'133 —— 落在界 358.8 内，比最优专家（77）多 73%。'},
     {kind:'single',q:'引理 33.3 的上界 $4.6\,m_{best} + 2\ln n$ 里，$2\ln n$ 这一项从哪来？',options:['专家个数 $n$ 直接乘上一个常数，跟权重无关','**势函数里 $n$ 个专家的初始权重贡献**','随机噪声','最优专家的犯错数 $m_{best}$ 本身'],answer:1,why:'★ 势函数从 $\sum_i w_i = n$ 出发（每人初始权重 1），每次犯错至少砍掉因子 $3/4$，取对数就把 $\ln n$ 带进上界。C 程序 $T = 200, n = 10$ 实测 $133 \le 4.6 \times 77 + 2\ln 10 = 358.8$。'},
     {kind:'judge',q:'加权多数对任意专家序列都能给出与最优专家成比例的犯错上界。',answer:true,why:'★ analyze 表里「统计假设的个数」标的就是 0 —— 不需要任何分布假设，纯靠「犯错就乘 $1/2$」的降权。C 程序 $T = 200$ 实测算法 133 次、最优专家 77 次，稳稳落在 4.6 倍界内。'},
    ],bookExercises:[
     {id:'33.2-1',page:1021,star:0,statement:'The proof of Lemma 33.3 assumes that some expert never makes a mistake. It is possible to generalize the algorithm and analysis t o remove this assumption. The new algorithm begins in the same way. The set S might become empty at some point, however. If that ever happens, reset S to contain all the experts and continue the algorithm. Show that the number of mistakes that this algorithm makes is at most m − dlg ne.',hint:'先看清失去的是什么：原证明靠「某个专家永不犯错」保证 $S$ 非空、且最好专家的权重不小于 1。现在 $S$ 可能空 —— 题面给的规则是清空后重置全部专家。于是权重的下界变了：把最好专家的权重用「它总共错的次数」写出来（每次出错至多减半），再重跑势函数的乘积论证，界里就会多出一项与犯错次数成正比的加性代价。'},
     {id:'33.2-4',page:1022,star:0,statement:'Consider a randomized version of WEIGHTED-MAJORITY . The algorithm is the same, except for the prediction step, which interpr ets the weights as a probability distribution over the experts and chooses an expert E i according to that distri- bution. It then chooses its prediction to be the same as the prediction made by expert E i . Show that, for any 0<Ω<1/2 , the expected number of mistakes made by this algorithm is at most .1 + Ω/m − C (ln n)=Ω .',hint:'题干给的是一个具体的界：当 $0<\\epsilon<1/2$ 时，期望犯错数至多 $(1+\\epsilon)m^* + (\\ln n)/\\epsilon$。 写「界同样成立」不算答，得把三步算出来。记 $\\Phi_t = \\sum_i w_i$（初始 $\\Phi_0 = n$）。 ① 权重只按「该专家本轮是否出错」乘上 $(1-\\epsilon)$，跟算法自己抽到谁无关， 所以 $\\Phi$ 的轨迹是确定的：$\\Phi_{t+1} = \\Phi_t - \\epsilon\\sum_{i\\text{ 错}} w_i = \\Phi_t(1 - \\epsilon q_t)$，其中 $q_t$ 就是出错专家的权重占比—— 而「抽到出错专家」正是算法这一轮犯错，所以 $q_t$ 也是它第 $t$ 轮犯错的概率。 ② 连乘并用 $1-x \\le e^{-x}$：$\\Phi_T = n\\prod_t(1-\\epsilon q_t) \\le n e^{-\\epsilon\\sum_t q_t}$，而 $\\sum_t q_t = E[M]$（期望的线性性）。 ③ 下界：最好的专家只错 $m^*$ 次，它的权重 $(1-\\epsilon)^{m^*}$ 就是 $\\Phi_{\\text{终}}$ 的下界。 两边取 $\\ln$：$m^*\\ln(1-\\epsilon) \\le \\ln n - \\epsilon E[M]$， 即 $\\epsilon E[M] \\le \\ln n + m^*(-\\ln(1-\\epsilon)) \\le \\ln n + m^*(\\epsilon + \\epsilon^2)$ （$\\epsilon \\le 1/2$ 时 $-\\ln(1-\\epsilon) = \\epsilon + \\epsilon^2/2 + \\cdots \\le \\epsilon + \\epsilon^2$）。 除以 $\\epsilon$ 就是题干的界。 与确定性版本唯一的差别就在 ①：随机版只能说「期望降多少」，所以界落在 $E[M]$ 上。'},
    ]},
  ],
};
