/* 第 15 章 15.2：贪心策略的要素（Elements of the greedy strategy）。印刷页 426–431（pdf 447–452）。 */
export default {
  key:'s02',id:'ch15/s02',chapter:15,section:'15.2',
  title:'贪心策略的两把钥匙：贪心选择与最优子结构',shortTitle:'15.2 贪心策略的要素',
  titleEn:'Elements of the greedy strategy',
  source:{printed:[426,431],pdf:[447,452]},
  prerequisites:[{label:'15.1 An activity-selection problem',url:'#/ch15/s01'}],
  stages:[
   {type:'map',title:'怎么判断一个贪心能不能用',
    why:'15.1 的成功不是运气：它满足**贪心选择性质**（局部最优能拼出全局最优）与**最优子结构**。本关把这两条判据讲清楚，并用背包问题给出**否证**：分数背包贪心成立，0-1 背包不成立。',
    position:'第 14 章的 DP 与本章的贪心是同一枚硬币的两面：DP 先解全部子问题再挑，贪心先挑再解剩下的**一个**子问题。本关给出二者的分界判据。',
    unlocks:[{label:'15.3 Huffman codes',url:'#/ch15/s03'}],
    mathKit:[
     {title:'贪心选择性质',body:'可以**先做局部最优选择**，之后无需回溯 —— 因为存在一个包含该选择的最优解。'},
     {title:'最优子结构',body:'做了贪心选择后剩下的**单个**子问题，其最优解与贪心选择拼起来仍是全局最优。'},
     {title:'对照',body:'DP：自底向上、每步枚举多个选择；贪心：自顶向下、每步只做一个选择、不回退。'},
    ]},
   {type:'intuition',title:'同一道背包题，贪心为什么有时灵有时不灵',scene:'W = 50，物品 (60,10)、(100,20)、(120,30)',body:[
     '**分数背包**：可以拿"金粉"（部分物品）。按单位价值 $v_i/w_i$ 降序拿 → 得 **240**，这就是最优。',
     '**0-1 背包**：只能整件拿（"金锭"）。同一个贪心顺序拿到 160（装了 1、2 号，3 号放不下）—— 而真正的最优是 **220**（2 号 + 3 号）。',
     '★ 差别的根源：分数背包里"拿一部分"这一步**保证**剩余容量被榨干；0-1 背包里做贪心选择会**浪费**容量（剩下 20 磅却放不下 30 磅的 3 号）。',
     '★ 所以判据是：做完贪心选择后，剩下的子问题是否**仍是同一种问题的最优解**？0-1 背包里不是（剩余容量 20 的背包，最优解与原问题结构不同）。',
     'C 程序三个数字并排：分数贪心 240 / 0-1 贪心 160 / 0-1 的 DP 220 —— 一眼看出贪心在 0-1 上失效。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 t he 是原书的断词伪影）。',blocks:[
     {kind:'body',page:427,en:'How can you tell whether a greedy algorithm will solve a particular optimization problem? No way works all the time, but the greedy-choice property and optimal substructure are the two key ingredients.',
      zh:'★★ 判据只有两条：**贪心选择性质 + 最优子结构**。'},
     {kind:'body',page:427,en:'The first key ingredient is the greedy-choice property: you can assemble a globally optimal solution by making locally optimal (greedy) choices.',
      zh:'★★ 贪心选择性质的定义：局部最优选择能拼出全局最优解。'},
     {kind:'body',page:427,en:'A dynamic-programming algorithm proceeds bottom up, whereas a greedy strategy usually progresses top down, making one greedy choice after another, reducing each given problem instance to a smaller one.',
      zh:'★★ DP 自底向上、贪心自顶向下 —— 这是两者最直观的分野。'},
     {kind:'body',page:428,en:'The 0-1 knapsack problem is the following. A thief robbing a store wants to take the most valuable load that can be carried in a knapsack capable of carrying at most W pounds of loot.',
      zh:'★ 0-1 背包：每件只能**整件拿或不拿**。'},
     {kind:'body',page:429,en:'Although the problems are similar, a greedy strategy works to solve the fractional knapsack problem, but not the 0-1 problem.',
      zh:'★★ 本关的核心对照句：贪心对分数背包成立，对 0-1 不成立。'},
     {kind:'body',page:429,en:'You can think of an item in the 0-1 knapsack problem as being like a gold ingot and an item in the fractional knapsack problem as more like gold dust.',
      zh:'★ 金锭 vs 金粉 —— 原书的比喻：能不能切开决定了贪心是否可行。'},
     {kind:'body',page:429,en:'Obeying a greedy strategy, the thief begins by taking as much as possible of t he item with the greatest value per pound.',
      zh:'★ 分数背包的贪心规则：按单位价值 $v_i/w_i$ 从高到低尽量拿。'},
    ],terms:[{en:'greedy-choice property',zh:'贪心选择性质',page:427},
              {en:'optimal substructure',zh:'最优子结构',page:426},
              {en:'0-1 knapsack problem',zh:'0-1 背包（整件取舍）',page:428},
              {en:'fractional knapsack problem',zh:'分数背包（可切分）',page:429}]},
   {type:'pseudocode',title:'贪心算法的五步设计法',algo:'GREEDY-STRATEGY',signature:'设计一个贪心算法的五个步骤',page:426,
    lines:[
     {n:1,code:'1. Determine the optimal substructure of the problem.',zh:'★ 先看子问题结构 —— 这一步与 DP 完全一样。'},
     {n:2,code:'2. Develop a recursive solution.',zh:'★ 先写出**正确但慢**的递归解（DP 的老路）。'},
     {n:3,code:'3. Show that if you make the greedy choice, only one subproblem remains.',zh:'★★ 从"多个子问题"缩到"只剩一个" —— 这正是贪心的定义。'},
     {n:4,code:'4. Prove that it is always safe to make the greedy choice.',zh:'★★ 交换论证：存在包含该贪心选择的最优解。'},
     {n:5,code:'5. Develop a recursive algorithm that implements the greedy strategy.',zh:'★ 最后把它写成迭代或递归的贪心算法。'},
     {n:6,code:'6. Convert the recursive algorithm to an iterative one.',zh:'★ 15.1 的 RECURSIVE → GREEDY 就是这一步。'}],
    vars:[{name:'greedy choice',meaning:'每步唯一确定的选择（如"最早结束""单位价值最高""频率最小的两个"）'}],
    note:'★ 原书把第 5 步写作"开发实现贪心策略的递归算法"，第 6 步再转迭代（p.426 的清单）。本站把两步并列，因为它们是一条直线上的两步。',
    more:[]},
   {type:'visualize',title:'三个数字的对照',panels:[
     {title:'同一道背包题：贪心 vs 最优（原书 p.429 的例子）',viz:'growth',
      chart:{xMax:8,series:[
       {name:'分数背包贪心 = 240（最优）',expr:'240',color:'--viz-done'},
       {name:'0-1 背包 DP = 220（最优）',expr:'220',color:'--viz-compare'},
       {name:'0-1 背包贪心 = 160（次优）',expr:'160',color:'--viz-violation'}]},
      note:'★ 三条水平线：分数背包上贪心与最优重合；0-1 背包上贪心低了 60（约 27%）。'},
    ],tasks:['对照 C 程序 part 1–part 3 的三个实测数字。'],note:''},
   {type:'code',title:'实测：240 / 160 / 220',c:{file:'greedy_knapsack.c',code:String.raw`/* greedy_knapsack.c -- 15.2: 贪心策略的要素（Elements of the greedy strategy）。
 * 用「背包问题」对照：分数背包（fractional）贪心可得最优；0-1 背包贪心失败，需 DP。
 * 原书 p.429 的例子：W = 50，物品 (价值, 重量) 为
 *   item1 (60, 10)  value/weight = 6
 *   item2 (100, 20) value/weight = 5
 *   item3 (120, 30) value/weight = 4
 * 分数背包贪心最优值 = 240；0-1 最优值 = 220（取 item2+item3）；0-1 贪心只得到 160。 */
#include <assert.h>
#include <stdio.h>

#define M 3
#define W 50

typedef struct { int v; int w; } Item;

static Item items[M] = {{60, 10}, {100, 20}, {120, 30}};

/* 分数背包：按 value/weight 降序，能拿多少拿多少（原书 p.429）。返回总价值（整数运算）。 */
static int fractional_knapsack(void)
{
    /* 简单选择排序：按 v/w 降序（等价于按 v*w2 与 v2*w 比，避免浮点） */
    int order[M];
    for (int i = 0; i < M; i++) { order[i] = i; }
    for (int i = 0; i < M; i++) {
        for (int j = i + 1; j < M; j++) {
            /* order[i] 的 v/w 是否小于 order[j] 的 v/w */
            long lhs = (long)items[order[i]].v * items[order[j]].w;
            long rhs = (long)items[order[j]].v * items[order[i]].w;
            if (lhs < rhs) { int t = order[i]; order[i] = order[j]; order[j] = t; }
        }
    }
    int cap = W, total = 0;
    for (int i = 0; i < M; i++) {
        int k = order[i];
        if (items[k].w <= cap) {
            total += items[k].v;          /* 整件拿走 */
            cap -= items[k].w;
        } else {
            total += items[k].v * cap / items[k].w;   /* 拿一部分 */
            cap = 0;
            break;
        }
    }
    return total;
}

/* 0-1 背包的「贪心」：同样按 value/weight 降序，但只能整件拿。用于说明它会失败。 */
static int greedy_01(void)
{
    int order[M];
    for (int i = 0; i < M; i++) { order[i] = i; }
    for (int i = 0; i < M; i++) {
        for (int j = i + 1; j < M; j++) {
            long lhs = (long)items[order[i]].v * items[order[j]].w;
            long rhs = (long)items[order[j]].v * items[order[i]].w;
            if (lhs < rhs) { int t = order[i]; order[i] = order[j]; order[j] = t; }
        }
    }
    int cap = W, total = 0;
    for (int i = 0; i < M; i++) {
        int k = order[i];
        if (items[k].w <= cap) { total += items[k].v; cap -= items[k].w; }
    }
    return total;
}

/* 0-1 背包的动态规划：O(nW)（原书 Exercise 15.2-2）。返回最优价值。 */
static int dp_01(void)
{
    int dp[W + 1];
    for (int w = 0; w <= W; w++) { dp[w] = 0; }
    for (int i = 0; i < M; i++) {
        for (int w = W; w >= items[i].w; w--) {
            int take = dp[w - items[i].w] + items[i].v;
            if (take > dp[w]) { dp[w] = take; }
        }
    }
    return dp[W];
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    int frac = fractional_knapsack();
    printf("part 1: 分数背包贪心（按 value/weight 降序）最优值 = %d\n", frac);
    assert(frac == 240);

    int g01 = greedy_01();
    printf("part 2: 0-1 背包「贪心」只得到 = %d（次优，说明贪心对 0-1 不成立）\n", g01);
    assert(g01 == 160);

    int opt = dp_01();
    printf("part 3: 0-1 背包 DP（O(nW)）最优值 = %d（取 item2 + item3）\n", opt);
    assert(opt == 220);
    assert(opt > g01);

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明三个关键数字与物品数据。'},
           {line:19,zh:'`fractional_knapsack`：按 $v/w$ 降序拿，能拿多少拿多少（用交叉相乘避免浮点）。'},
           {line:48,zh:'`greedy_01`：同样的贪心顺序，但只能整件拿 —— 用来演示失效。'},
           {line:68,zh:'`dp_01`：0-1 背包的 $O(nW)$ DP（习题 15.2-2）。'},
           {line:86,zh:'★★ part 1：分数背包贪心 = **240**（最优）。'},
           {line:90,zh:'★★ part 2：0-1 背包贪心 = **160** —— 次优，贪心失效的直接证据。'},
           {line:94,zh:'★★ part 3：0-1 背包 DP = **220**（取 item2 + item3）—— 真最优。'}]},
    tests:[{in:'W = 50，(60,10) (100,20) (120,30)',out:'分数背包贪心 240；0-1 贪心 160；0-1 DP 220'},
           {in:'容量利用率',out:'贪心剩 20 磅装不下 30 磅的 item3、DP 恰好填满 50 磅'}],
    mapping:[{pc:3,pcCode:'只有一个子问题（贪心）',c:'`if (items[k].w <= cap) { total += items[k].v; cap -= items[k].w; }`（第 35–37 行）'},
             {pc:2,pcCode:'递归/DP 解（0-1 需要）',c:'`int take = dp[w - items[i].w] + items[i].v;`（第 74 行）'}]},
   {type:'analyze',title:'一本账：两条判据的对照表',claims:[
     {expr:'\\Theta(n\\lg n)',when:'按单位价值排序 + 线性扫描（分数背包贪心）',page:429,source:'book'},
     {expr:'O(nW)',when:'0-1 背包的 DP 时间（把重量当成"状态"维度）',page:430,source:'book'},
     {expr:'\\Theta(n^3)',when:'活动选择的 DP 解法（对照 15.1）',page:419,source:'book'},
    ],tables:[{caption:'何时能用贪心：三个例子的横向对照',rows:[
      ['','活动选择（15.1）','分数背包','0-1 背包'],
      ['贪心选择','最早结束的活动','单位价值最高的物品','（同左）'],
      ['贪心成立？','成立（定理 15.1）','成立','**不成立**'],
      ['剩下的子问题个数','1 个（$S_k$）','1 个（更小的容量）','仍要看两种取舍'],
      ['正确解法','贪心 $\\Theta(n\\lg n)$','贪心 $\\Theta(n\\lg n)$','DP $O(nW)$'],
      ['反例','最早开始的反例','—','C 程序：160 < 220'],
     ]}],chart:{xMax:32,series:[
     {name:'贪心：n lg n',expr:'n * Math.log2(n)',color:'--viz-done'},
     {name:'0-1 背包 DP：n·W（W=50 固定）',expr:'50 * n',color:'--viz-compare'},
     {name:'活动选择 DP：n³ / 64',expr:'n * n * n / 64',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'为什么 0-1 背包的子问题不再是"一个"',steps:[
      {zh:'分数背包：拿走 $\\min(w_i, W)$ 的量后，剩余容量 $W^{\\prime} < W$ —— 子问题是"容量更小的同一个问题"。'},
      {zh:'0-1 背包：对第 $i$ 件做决定后，**,还要考虑"不拿它"的那一支**，因为可能拿了它反而占位。'},
      {tex:'\\text{贪心} \\Leftrightarrow \\text{每步只剩一个子问题}',zh:'★ 这就是判据的机械形式；0-1 背包每步有两条分支，所以退回 DP。'}]},
     ],
    note:''},
   {type:'prove',title:'为什么分数背包的贪心是对的',statement:'Obeying a greedy strategy, the thief begins by taking as much as possible of t he item with the greatest value per pound.',page:429,
    intro:'★ 证明用交换论证，与 15.1 的定理 15.1 同构；而对 0-1 背包，证明会**卡住**，卡住的位置就是失效的原因。',
    steps:[
     {title:'分数背包：贪心选择安全',en:'Although the problems are similar, a greedy strategy works to solve the fractional knapsack problem, but not the 0-1 problem.',page:429,
      body:['设物品按 $v_1/w_1 \\ge v_2/w_2 \\ge \\cdots$ 排序，贪心先装满 1 号。',
        '**断言**：存在一个最优解，其中"1 号的取用比例"与贪心相同 —— 因为把别的物品挤出来换成 1 号，单位重量的价值不会下降。',
        '于是可以"剪掉"贪心拿走的量，问题缩小为容量更小的同类子问题。∎']},
     {title:'0-1 背包：同一步论证为何失效',en:'You can think of an item in the 0-1 knapsack problem as being like a gold ingot and an item in the fractional knapsack problem as more like gold dust.',page:429,
      body:['**断言失效点**：把 1 号整个拿走会浪费容量（$W - w_1$ 可能小于任何剩余物品的重量），而"换成别的物品"又必须整件整件地换。',
        '反例（C 程序）：$W = 50$，物品 (60,10)、(100,20)、(120,30)。贪心按 $v/w$ 拿 1 号 + 2 号 = 160，剩 20 磅放不下 3 号；最优是 2 号 + 3 号 = 220。',
        '★ 结论：0-1 背包**不满足**贪心选择性质，必须用 DP（$O(nW)$）。∎']},
     {title:'两条判据的操作化',en:'How can you tell whether a greedy algorithm will solve a particular optimization problem? No way works all the time, but the greedy-choice property and optimal substructure are the two key ingredients.',page:427,
      body:['**贪心选择性质**：能找到一个"局部最优选择"，且存在包含它的最优解（通常用交换论证证明）。',
        '**最优子结构**：做完这个选择后，剩下的问题是**同一种问题**（只小一号）。',
        '★ 判定流程：先按 DP 写递归（第 2 步）→ 观察每步是否只剩**一个**子问题（第 3 步）→ 若能，就试着证明第 4 步；证不出来（或找到反例）就退回 DP。∎']},
    ],conclusion:'★ 结论：贪心 = 最优子结构 + 贪心选择性质；两者缺一，就用 DP。C 程序用 240 / 160 / 220 三个数字把这条判据钉住了。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'贪心算法的两条判据是？',options:['最优子结构 + 无后效性','贪心选择性质 + 最优子结构','多项式时间 + 线性空间','单调性 + 交换性'],answer:1,
      why:'★ 原书 p.427：the greedy-choice property and optimal substructure. C 程序用活动选择（成立）与 0-1 背包（不成立）各演示一次。'},
     {kind:'single',q:'贪心与 DP 在推进方向上的区别是？',options:['贪心自底向上，DP 自顶向下','贪心自顶向下，DP 自底向上','两者都自底向上','两者都自顶向下'],answer:1,
      why:'★ 原书 p.427 的对照句 —— 但注意备忘递归（14.3）是 DP 的自顶向下变体。'},
     {kind:'judge',q:'0-1 背包问题可以用"按单位价值贪心"求最优。',answer:false,
      why:'★ 反例：$W = 50$、(60,10)、(100,20)、(120,30) 上贪心得 160 < 最优 220（C 程序 part 2/3）。'},
     {kind:'judge',q:'分数背包的贪心选择性质可以用交换论证证明。',answer:true,
      why:'★ 本关 prove 阶段的第一步；关键是"多拿一点单位价值更高的物品"不会让解变差。'},
     {kind:'simulate',q:'原书 p.429 的例子中，分数背包的最优值是多少？（填数字）',expect:[240],placeholder:'例如：200',
      why:'按 $v/w$ 降序：60 + 100 + (20/30)×120 = **240**（C 程序 part 1）。'},
     {kind:'simulate',q:'同一例子的 0-1 背包最优值是多少？（填数字）',expect:[220],placeholder:'例如：200',
      why:'item2 + item3 = 100 + 120 = **220**，重量 20 + 30 = 50 恰好装满（C 程序 part 3）。'},
    ],bookExercises:[
     {id:'15.2-1',page:430,star:0,statement:'Prove that the fractional knapsack problem has the greedy-choice property.',hint:'交换论证：设最优解里单位价值最高的物品 $i$ 取用量少于"应取量"，则把某件单位价值不高于 $i$ 的物品的取用量换成 $i$（总重量不变），价值不会下降；重复此交换即可得到包含贪心量的最优解。'},
     {id:'15.2-2',page:430,star:0,statement:'Give a dynamic-programming solution to the 0-1 knapsack problem that runs in O(nW) time, where n is the number of items and W is the maximum weight of items that the thief can put in the knapsack.',hint:'设 $c[i,w]$ 为"前 $i$ 件、容量 $w$"的最优价值：$c[i,w] = \\max(c[i-1,w],\\, c[i-1,w-w_i]+v_i)$（$w \\ge w_i$ 时）。C 程序第 68 行的 `dp_01` 就是它的滚动数组版本。'},
     {id:'15.2-3',page:430,star:0,statement:'Suppose that in a 0-1 knapsack problem, the order of the items when sorted by increasing weight is the same as their order when sorted by decreasing value. Give an efficient algorithm to find an optimal solution to this variant of the knapsack problem, and argue that your algorithm is correct.',hint:'题干说的是「按重量**递增**排」与「按价值**递减**排」是同一个顺序 —— 即越重越**不**值钱。 于是最优解必取「按重量递增的一段前缀」：若解里有较重的 $j$ 却不装更轻且更值钱的 $i$， 把 $j$ 换成 $i$ 会更轻、更值钱，矛盾。所以从最轻的开始依次装，装到下一个会超容量就停 —— 这一段前缀就是最优解，$O(n)$（要先排序则 $O(n\\lg n)$）。 注意是「越轻越值」，别把单调方向记成「越重越值」，那样前缀取的正好是最差的一批。'},
     {id:'15.2-4',page:430,star:0,statement:'Professor Gekko has always dreamed of inline skating across North Dakota. The professor plans to cross the state on highway U.S. 2, which runs from Grand Forks, on the eastern border with Minnesota, to Williston, near the western border with Montana. The professor can carry two liters of water and can skate m miles before running out of water. (Because North Dakota is relatively flat, the professor does not have to worry about drinking water at a greater rate on uphill sections than on flat or downhill sections.) The professor will start in Grand Forks with two full liters of water. The professor has an official North Dakota state map, which shows all the places along U.S. 2 to refill water and the distances between these locations. The professor’s goal is to minimize the number of water stops along the route across the state. Give an efficient method by which the professor can determine which water stops to make. Prove that your strategy yields an optimal solution, and give its running time.',hint:'这是"沿途补给最少停靠"问题：贪心地开到**不加油就到不了的最远加油站**再加（与活动选择同型：每步都要最大化剩余空间）。'},
     {id:'15.2-5',page:431,star:0,statement:'Describe an efficient algorithm that, given a set fx 1 ,x 2 ,…,x n g of points on the real line, determines the smallest set of unit-length closed intervals that contains all of the given points. Argue that your algorithm is correct.',hint:'排序后贪心：取当前最左未覆盖点 $x$，放一个 $[x, x+1]$ 区间（或 $[x, x+1)$ 视开闭而定）覆盖尽量多的点，跳过已覆点重复 —— $O(n\\lg n)$，正确性靠"最左点必须被某个区间覆盖"的交换论证。'},
     {id:'15.2-7',page:431,star:0,statement:'You are given two sets A and B , each containing n positive integers. You can choose to reorder each set however you like. After reordering, let a i be the i th element of set A, and let b i be the i th element of set B . You then receive a payoff of Q n i D1 a i b i . Give an algorithm that maximizes your payoff. Prove that your algorithm maximizes the payoff, and state its running time, omitting the time for reordering the sets.',hint:'目标是最大化 $\\prod a_i^{b_i}$。由不等式知同序配对最优（重排不等式），即把两集合都升序后对应配对 —— 可用交换论证：若 $a_1 \\le a_2$、$b_1 \\le b_2$ 而配对交叉，换成同序不会变小。'},
    ]},
  ],
};
