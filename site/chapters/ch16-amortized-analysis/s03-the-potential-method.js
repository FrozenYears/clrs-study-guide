/* 第 16 章 16.3：势能法（The potential method）。印刷页 456–460（pdf 477–481）。 */
export default {
  key:'s03',id:'ch16/s03',chapter:16,section:'16.3',
  title:'势能法：把存款写成函数 Φ(D)',shortTitle:'16.3 势能法',
  titleEn:'The potential method',
  source:{printed:[456,460],pdf:[477,481]},
  prerequisites:[{label:'16.2 The accounting method',url:'#/ch16/s02'}],
  stages:[
   {type:'map',title:'记账法的连续版本',
    why:'记账法把钱记在**一个个对象**上；势能法把全部存款打包成一个**数据结构状态的函数** $\\Phi(D_i)$ —— 不用追着每个对象算，只需挑一个漂亮的势函数。',
    position:'三种方法的最后一种，也是最强大的（16.4 的动态表靠它分析收缩）。它把"信用总额"换成了 $\\Phi(D_i) - \\Phi(D_0)$。',
    unlocks:[{label:'16.4 Dynamic tables',url:'#/ch16/s04'}],
    mathKit:[
     {title:'摊还代价 (16.2)',body:'$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$：实际代价 + 势能变化。'},
     {title:'望远镜求和',body:'$\\sum \\hat{c}_i = \\sum c_i + \\Phi(D_n) - \\Phi(D_0)$ —— 中间项全部相消。'},
     {title:'上界条件',body:'只要 $\\Phi(D_n) \\ge \\Phi(D_0)$，总摊还就是总实际的上界。'},
    ]},
   {type:'intuition',title:'Φ = s：栈的三种操作定价',scene:'MULTIPOP 栈',body:[
     '取势函数 $\\Phi(D) = s$（栈内对象数），起始空栈 $\\Phi(D_0) = 0$。',
     '★ **PUSH**：实际 1，$\\Delta\\Phi = (s+1) - s = 1$ → 摊还 $2$（与记账法的定价一致！）',
     '★ **POP**：实际 1，$\\Delta\\Phi = -1$ → 摊还 $0$。**MULTIPOP(k)**：实际 $k^{\\prime}$，$\\Delta\\Phi = -k^{\\prime}$ → 摊还 $0$。',
     '★ 恒等式逐次精确成立（C 程序 part 2）：3000 个随机操作 $\\sum \\hat{c} = 3142 = 3136 + 6$ —— 尾项就是 $\\Delta\\Phi$。',
     '★ 势函数挑得越"贴合"，上界越紧：换成 $\\Phi = s^2$，上界依然成立（part 3 实测 104 ≥ 100），但松了。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 y c i 代表 ĉᵢ、C 代表 +）。',blocks:[
     {kind:'body',page:456,en:'The amortized cost y c i of the i th operation with respect to potential function \u02c6 is defined by y c i = c i C \u02c6(D i ) \u2212 \u02c6(D i \u22121 ): (16.2)',
      zh:'★★ 定义式 (16.2)：摊还 = 实际 + 势能变化（语料把 ĉᵢ 抽成 y c i、+ 抽成 C）。'},
     {kind:'body',page:456,en:'The amortized cost of each operation is therefore its actual cost plus the change in potential due to the operation. By equation (16.2), the total amortized cost of the n operations is n X i D1 y c i = n X i D1',
      zh:'★ 每个操作的摊还 = 实际 + 势能变化；总摊还的望远镜求和从此式出发。'},
     {kind:'body',page:457,en:'If you can define a potential function \u02c6 so that \u02c6(D n ) \u2265 \u02c6(D 0 ), then the total amortized cost P n i D1 y c i gives an upper bound on the total actual cost P n i D1 c i .',
      zh:'★★ 上界条件：$\\Phi(D_n) \\ge \\Phi(D_0)$（语料的 P n i D1 就是 Σᵢ₌₁ⁿ）。'},
     {kind:'body',page:457,en:'The total amortized cost of n operations with respect to \u02c6 therefore represents an upper bound on the actual cost.',
      zh:'★ 上界结论。'},
     {kind:'body',page:457,en:'Now let\u2019s compute the amortized costs of the various stack operations. If the i th operation on a stack containing s objects is a PUSH operation, then the potential difference is \u02c6(D i ) \u2212 \u02c6(D i \u22121 ) = (s + 1) \u2212 s',
      zh:'★ 栈例子的第一步：PUSH 的势能差 = 1。'},
    ],terms:[{en:'potential method',zh:'势能法',page:456},
              {en:'potential function',zh:'势函数 Φ(D)',page:456}]},
   {type:'pseudocode',title:'势能法的三步',algo:'POTENTIAL-METHOD',signature:'用势函数做摊还分析（本站按原书整理）',page:457,
    lines:[
     {n:1,code:'1. 选势函数 Φ(D)，且 Φ(D0) = 0',zh:'★ 初始势归零是最常见的归一化。'},
     {n:2,code:'2. 每个操作算 ĉi = ci + Φ(Di) − Φ(Di−1)',zh:'★ 按 (16.2) 逐操作算摊还价。'},
     {n:3,code:'3. 验证 Φ(Dn) >= Φ(D0)',zh:'★★ 这一步给出上界的合法性。'},
     {n:4,code:'结论: Σĉi = Σci + Φ(Dn) − Φ(D0)',zh:'望远镜求和 —— 精确恒等式，不是近似。'}],
    vars:[{name:'Dᵢ',meaning:'第 i 次操作后的数据结构状态'},{name:'Φ',meaning:'从状态到非负实数的函数'}],
    note:'★ 记账法把存款记在对象上；势能法把它折算成"整个状态"的函数 —— 对象级明细换全局视角。',
    more:[]},
   {type:'visualize',title:'势能曲线与三种方法的统一',panels:[
     {title:'① 同一序列，两个势函数（C 程序 part 2/3）',viz:'growth',
      chart:{xMax:120,series:[
       {name:'Φ = s：Σ摊还 = 3142（n=3000 段内）',expr:'2 * n',color:'--viz-done'},
       {name:'Φ = s²：上界更陡',expr:'n * n / 96',color:'--viz-violation'}]},
      note:'★ 两个势函数都满足 Φ(Dn) ≥ Φ(D0)，都是合法上界；线性势的上界紧得多。'},
     {title:'② 三种方法同框',viz:'growth',
      chart:{xMax:24,series:[
       {name:'聚合：总账/n（平价）',expr:'2',color:'--viz-compare'},
       {name:'记账：PUSH=2 其余 0（平均 2）',expr:'2',color:'--viz-done'},
       {name:'势能：Φ=s 时 PUSH=2 其余 0',expr:'2',color:'--viz-violation'}]},
      note:'★ 对栈而言三种方法给出同一个答案 —— 摊还代价 2 / 0 / 0。方法不同，数字一致。'},
    ],tasks:['对照 C 程序 part 2 的恒等式与 part 3 的反事实。'],note:''},
   {type:'code',title:'实测：恒等式逐次成立',c:{file:'potential_stack.c',code:String.raw`/* potential_stack.c -- 16.3 势能法：Φ(D) = 栈内对象数 s。
 * 关键数字：PUSH 摊还代价 2，POP 摊还代价 0，MULTIPOP 摊还代价 0；
 *           恒等式 Σĉ = Σc + Φ(Dn) − Φ(D0) 逐次成立（ telescope 精确成立，不是近似）。
 * 另外演示：换一个更陡的势函数 Φ = s²，上界依然成立但更松。 */
#include <assert.h>
#include <stdio.h>

#define NMAX 64

static int stack[NMAX];
static int top;                       /* s = 栈内对象数 = 势 Φ(D) */

static int op_push(int x) { stack[top++] = x; return 1; }
static int op_pop(void) { top--; return 1; }
static int op_multipop(int k)
{
    int cost = 0;
    while (top > 0 && k > 0) { top--; cost++; k--; }
    return cost;
}

static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：三种操作的摊还代价（Φ = s） */
    printf("part 1: 势函数 Φ(D) = s（栈内对象数）时的逐操作摊还代价：\n");
    {
        int s = 7;
        /* PUSH：实际 1 + ΔΦ(= (s+1) - s = 1) = 2 */
        int c1 = op_push(42);
        int dh = (s + 1) - s;
        printf("        PUSH：实际 %d + ΔΦ %d = %d\n", c1, dh, c1 + dh);
        assert(c1 + dh == 2);
        s = s + 1;
        /* POP：实际 1 + ΔΦ(= -1) = 0 */
        int c2 = op_pop();
        int dh2 = (s - 1) - s;
        printf("        POP ：实际 %d + ΔΦ %d = %d\n", c2, dh2, c2 + dh2);
        assert(c2 + dh2 == 0);
        s = s - 1;
        /* MULTIPOP(k)：实际 k' + ΔΦ(= -k') = 0 */
        int kk = 3, mk = (kk < s) ? kk : s;
        int c3 = op_multipop(mk);
        int dh3 = (s - c3) - s;
        printf("        MULTIPOP(%d)：实际 %d + ΔΦ %d = %d\n", mk, c3, dh3, c3 + dh3);
        assert(c3 + dh3 == 0);
        top = 0;                          /* 清场，供 part 2 使用 */
    }

    /* part 2：随机序列 —— Σĉ = Σc + Φ(Dn) − Φ(D0) 精确成立 */
    {
        long sum_actual = 0, sum_amort = 0;
        int n = 3000, s0, sn;
        top = 0; s0 = top;
        rng_seed(20260917);
        for (int i = 0; i < n; i++) {
            int r = (int)(rng_next() % 3);
            int c;
            if (r == 0 || top == 0) { c = op_push(i); sum_amort += c + 1; }
            else if (r == 1) { c = op_pop(); sum_amort += c - 1; }
            else { int k = (int)(rng_next() % 5); c = op_multipop(k); sum_amort += c - c; }
            sum_actual += c;
        }
        sn = top;
        printf("part 2: %d 个操作（起始势 %d，结束势 %d）：\n", n, s0, sn);
        printf("        Σ实际 = %ld；Σ摊还 = %ld；ΔΦ = %d\n", sum_actual, sum_amort, sn - s0);
        printf("        恒等式 Σ摊还 = Σ实际 + ΔΦ -> %ld = %ld + %d\n",
               sum_amort, sum_actual, sn - s0);
        assert(sum_amort == sum_actual + (sn - s0));
        printf("        又 Φ(Dn) = %d >= Φ(D0) = %d，所以 Σ摊还 >= Σ实际 —— 上界成立\n", sn, s0);
    }

    /* part 3：势函数换成 Φ = s²，上界更松但依然成立 */
    {
        long sum_actual = 0, sum_amort = 0;
        int n = 100, prev_phi;
        top = 0; prev_phi = 0;
        rng_seed(7);
        for (int i = 0; i < n; i++) {
            int c;
            if (i % 3 == 0 || top == 0) { c = op_push(i); }
            else if (top > 0) { c = op_pop(); }
            else { c = 0; }
            int phi = top * top;
            sum_actual += c;
            sum_amort += c + (phi - prev_phi);
            prev_phi = phi;
        }
        printf("part 3: 换势函数 Φ = s²（n = %d）：Σ实际 = %ld，Σ摊还 = %ld\n",
               n, sum_actual, sum_amort);
        printf("        ΔΦ = %d -> Σ摊还 = Σ实际 + ΔΦ 仍精确成立，且 Φ(Dn) >= Φ(D0) = 0\n",
               top * top);
        assert(sum_amort == sum_actual + (long)top * top);
        assert(top * top >= 0);
        printf("        结论：势函数只要满足 Φ(Dn) >= Φ(D0)，摊还和就是实际和的上界；\n");
        printf("        选得越贴合（线性 vs 平方），上界越紧。\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明关键数字：PUSH 摊还 2、POP/MULTIPOP 摊还 0。'},
           {line:50,zh:'★★ part 1：逐操作算 ĉ = c + ΔΦ（PUSH 2 / POP 0 / MULTIPOP 0）。'},
           {line:74,zh:'★★ part 2：3000 个随机操作 Σĉ = 3142 = 3136 + 6（ΔΦ），精确成立。'},
           {line:96,zh:'★ part 3：Φ = s² 的上界更松（104 vs 100）但依然合法。'}]},
    tests:[{in:'PUSH（Φ = s）',out:'实际 1 + ΔΦ 1 = 摊还 2'},
           {in:'3000 个随机操作',out:'Σĉ 3142 = Σc 3136 + ΔΦ 6'},
           {in:'Φ = s² 的对照',out:'Σĉ 104 ≥ Σc 100，上界更松'}],
    mapping:[{pc:2,pcCode:'ĉi = ci + Φ(Di) − Φ(Di−1)',c:'`sum_amort += c + (phi - prev_phi);`（第 68 行）'},
             {pc:3,pcCode:'验证 Φ(Dn) >= Φ(D0)',c:'`assert(top * top >= 0);`（第 92 行，Φ = s² 的终态判据）'}]},
   {type:'analyze',title:'一本账：三种方法一张表',claims:[
     {expr:'2',when:'PUSH 的摊还代价（Φ = s）',page:457,source:'book'},
     {expr:'0',when:'POP / MULTIPOP 的摊还代价（Φ = s）',page:457,source:'book'},
     {expr:'\\Phi(D_n) \\ge \\Phi(D_0)',when:'势函数合法的充要条件（给出上界）',page:457,source:'book'},
    ],tables:[{caption:'三种摊还分析方法的对照',rows:[
      ['','聚合','记账','势能'],
      ['视角','n 次总账 ÷ n','钱记在每个对象上','存款 = 全局函数 Φ(D)'],
      ['各操作摊还价','全部相同','可以不同','可以不同（由 ΔΦ 决定）'],
      ['关键动作','算总账','验证信用 ≥ 0','验证 Φ(Dn) ≥ Φ(D0)'],
      ['适合场景','代价均匀','付费对象明确','状态变化平滑（如动态表）'],
     ]},{caption:'栈例子的三个视角（同一答案）',rows:[
      ['','PUSH','POP','MULTIPOP'],
      ['聚合','O(1)','O(1)','O(1)'],
      ['记账','2 元','0 元','0 元'],
      ['势能 Φ=s','2','0','0'],
     ]}],chart:{xMax:16,series:[
     {name:'Φ = s（线性，贴合）',expr:'n',color:'--viz-done'},
     {name:'Φ = s²（过陡，上界松）',expr:'n * n / 8',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'望远镜求和的推导',steps:[
      {zh:'按 (16.2) 逐项写出：$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$。'},
      {zh:'对 $i$ 求和，中间的 $\\Phi$ 项两两相消（telescope）。'},
      {tex:'\\sum_{i=1}^{n} \\hat{c}_i = \\sum_{i=1}^{n} c_i + \\Phi(D_n) - \\Phi(D_0)',zh:'★ C 程序 part 2 的断言正是这条恒等式：3142 = 3136 + 6。'}]},
     ],
    note:''},
   {type:'prove',title:'上界的成立条件',statement:'If you can define a potential function \u02c6 so that \u02c6(D n ) \u2265 \u02c6(D 0 ), then the total amortized cost P n i D1 y c i gives an upper bound on the total actual cost P n i D1 c i .',page:457,
    intro:'★ 势能法的正确性只有一步：望远镜求和 + 终态条件。',
    steps:[
     {title:'望远镜求和（恒等式）',en:'The amortized cost of each operation is therefore its actual cost plus the change in potential due to the operation.',page:456,
      body:['按定义 $\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$ 对每个操作求和：',
        '$\\sum_{i=1}^{n} \\hat{c}_i = \\sum_{i=1}^{n} c_i + \\big(\\Phi(D_n) - \\Phi(D_{n-1})\\big) + \\cdots + \\big(\\Phi(D_1) - \\Phi(D_0)\\big)$。',
        '中间项全部相消，得 $\\sum \\hat{c}_i = \\sum c_i + \\Phi(D_n) - \\Phi(D_0)$ —— **精确恒等式**。∎']},
     {title:'加终态条件得上界',en:'The total amortized cost of n operations with respect to \u02c6 therefore represents an upper bound on the actual cost.',page:457,
      body:['若 $\\Phi(D_n) \\ge \\Phi(D_0)$，则 $\\sum \\hat{c}_i \\ge \\sum c_i$。',
        '通常把 $\\Phi(D_0) = 0$ 与"$\\Phi \\ge 0$ 对一切状态成立"作为设计目标 —— 这样无论序列多长终态条件自动满足。',
        '★ C 程序 part 2/3 两条断言分别验证了恒等式与 $\\Phi(D_n) \\ge 0$。∎']},
     {title:'与记账法的对应',en:'Now let\u2019s compute the amortized costs of the various stack operations. If the i th operation on a stack containing s objects is a PUSH operation, then the potential difference is \u02c6(D i ) \u2212 \u02c6(D i \u22121 ) = (s + 1) \u2212 s',page:457,
      body:['势能 $\\Phi(D_i) - \\Phi(D_0)$ 恰好就是记账法里的**信用总额**（栈：$s$ 元）。',
        '所以"信用 ≥ 0"与"$\\Phi \\ge 0$"是同一条不变量的两种记法 —— 记账是离散逐对象、势能是全局函数。',
        '★ 栈例子两种方法都给出 PUSH 摊还 2、POP/MULTIPOP 摊还 0（C 程序 part 1）。∎']},
    ],conclusion:'★ 结论：势能法 = 选一个非负且初始为 0 的 Φ，摊还代价自动带上"预付/透支"的语义；16.4 的动态表是它最重要的应用。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'势能法中摊还代价的定义式是？',options:['$\\hat{c}_i = c_i$','$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$','$\\hat{c}_i = \\Phi(D_i)$','$\\hat{c}_i = c_i \\cdot \\Phi(D_i) - \\Phi(D_{i-1})$'],answer:1,
      why:'★ 式 (16.2)：实际代价加势能变化。'},
     {kind:'single',q:'总摊还 ≥ 总实际 成立的条件是？',options:['Φ 处处为 0','$\\Phi(D_n) \\ge \\Phi(D_0)$','$\\Phi(D_i)$ 随 $i$ 单调递减，越往后势能越小','操作序列随机'],answer:1,
      why:'★ 由望远镜求和：Σĉ = Σc + Φ(Dn) − Φ(D0)。'},
     {kind:'judge',q:'势能法给出的 Σĉ = Σc + ΔΦ 是近似式。',answer:false,
      why:'★ 是精确恒等式 —— 中间势能项两两相消。'},
     {kind:'judge',q:'对栈取 Φ = s² 仍然是合法的势函数（只是上界更松）。',answer:true,
      why:'★ 只要 Φ ≥ 0 且 Φ(D0)=0，上界就成立；C 程序 part 3 实测 104 ≥ 100。'},
     {kind:'simulate',q:'Φ = s 时 PUSH 的摊还代价是多少？（填数字）',expect:[2],placeholder:'例如：1',
      why:'实际 1 + ΔΦ 1 = 2（原书 p.457 与 C 程序 part 1）。'},
     {kind:'simulate',q:'3000 个随机操作中 Σĉ − Σc = ？（C 程序 part 2，填数字）',expect:[6],placeholder:'例如：0',
      why:'= Φ(Dn) − Φ(D0) = 6 − 0 = 6（结束时栈里剩 6 件对象）。'},
    ],bookExercises:[
     {id:'16.3-1',page:459,star:0,statement:'Suppose you have a potential function ˆ such that ˆ(D i ) ≥ ˆ(D 0 ) for all i , but ˆ(D 0 ) ≠ 0. Show that there exists a potential function ˆ 0 such that ˆ 0 (D 0 ) = 0, ˆ 0 (D i ) ≥ 0 for all i ≥ 1, and the amortized costs using ˆ 0 are the same as the amortized costs using ˆ.',hint:'这题要你**造**一个势函数，不是在讨论单调性。一行就够：$\\Phi’(D_i) = \\Phi(D_i) - \\Phi(D_0)$。 三条挨个验：$\\Phi’(D_0) = 0$ ✓；题设 $\\Phi(D_i) \\ge \\Phi(D_0)$ 给出 $\\Phi’(D_i) \\ge 0$ ✓； 摊还代价 $\\hat{c}_i = c_i + \\Phi’(D_i) - \\Phi’(D_{i-1})$，而平移量 $\\Phi(D_0)$ 在差分里相消， 所以与用 $\\Phi$ 时完全相同 ✓ —— 势函数本来就只能定义到相差一个常数。'},
     {id:'16.3-2',page:459,star:0,statement:'Redo Exercise 16.1-3 using a potential method of analysis.',hint:'16.1-3（i 为 2 的幂时代价 i）：取 Φ(D) = 2i′（i′ 为已执行操作数中"未来最近的 2 的幂"距离）不好直接写；标准做法是 Φ(D) = 2e，e 为自上次 2 的幂以来的操作计数，保证每次操作的 ĉ ≤ 3。'},
     {id:'16.3-3',page:459,star:0,statement:'Consider an ordinary binary min-heap data structure supporting the instructions INSERT and EXTRACT-MIN that, when there are n items in the heap, implements each operation in O(lg n) worst-case time. Give a potential function ˆ such that the amortized cost of INSERT is O(lg n) and the amortized cost of EXTRACT-MIN is O(1), and show that your potential function yields these amortized time bounds. Note that in the analysis, n is the number of items currently in the heap, and you do not know a bound on the maximum number of items that can ever be stored in the heap.',hint:'先看清题干要的方向，它和直觉相反：要 INSERT 摊还 $O(\\lg n)$、EXTRACT-MIN 摊还 $O(1)$ —— 也就是**插入时攒钱、删除最小值时花钱**，而不是给插入省钱。设 $n$ 为当前堆中元素个数， 取势函数 $\\Phi = K \\lg(n!)$（$K$ 是「任一单次操作实际代价都不超过 $K\\lg n$」里的那个常数； 等价的说法是：第 $i$ 个进堆的元素预先存下 $K\\lg i$ 份信用）。 插入：$\\Phi$ 增加 $K\\lg(n+1)$，摊还代价 $\\le K\\lg n + K\\lg(n+1) = O(\\lg n)$ ✓。 EXTRACT-MIN：$\\Phi$ 减少 $K\\lg n$，恰好抵掉它逐层下沉的实际代价，摊还 $\\le 0$，当然是 $O(1)$ ✓。 $\\Phi \\ge 0$、空堆时为 0，两条前提都满足。题干那句「不知道堆的最大容量」是提醒： $\\Phi$ 只能依赖**当前**的 $n$，不能拿一个容量上界做文章。'},
     {id:'16.3-4',page:460,star:0,statement:'What is the total cost of executing n of the stack operations PUSH, POP, and MULTIPOP , assuming that the stack begins with s 0 objects and finishes with s n objects?',hint:'三行互相否定的写法收不了口，直接按定义数一次就清楚了。 设 $p$ = PUSH 次数、$q$ = POP 次数、MULTIPOP 一共弹掉 $m$ 个对象，$n = p + q + (\\text{MULTIPOP 次数})$。 实际代价 $= p + q + m$（PUSH、POP 各 1，MULTIPOP 按弹掉的对象数计）。 栈内对象数的净变化：$s_n = s_0 + p - q - m$，即 $q + m = s_0 + p - s_n$。 两式合起来：**总代价 $= s_0 - s_n + 2p$**，于是 $\\le 2n + s_0 - s_n$。 拿势能法复核同一件事：取 $\\Phi = $ 栈内对象数，PUSH 摊还 $1 + 1 = 2$、POP 摊还 $1 - 1 = 0$、 MULTIPOP 摊还 $k - k = 0$，累加得 $\\le 2p$，与上面完全一致。 （自检用 $s_0 = 5$、一次 MULTIPOP 弹 5：总代价 5，$s_0 - s_n + 2p = 5 - 0 + 0 = 5$ ✓）'},
     {id:'16.3-5',page:460,star:0,statement:'Show how to implement a queue with two ordinary stacks (Exercise 10.1-7) so that the amortized cost of each ENQUEUE and each DEQUEUE operation is O(1).',hint:'两个栈 in/out：ENQUEUE 压入 in（O(1)）；DEQUEUE 从 out 弹，out 空时把 in 整体倒入 out。取 Φ = in 栈的对象数：倒栈的代价 k 恰被这 k 个对象攒下的势能支付 → 两操作摊还 O(1)。'},
     {id:'16.3-6',page:460,star:0,statement:'Design a data structure to support the following two operations for a dynamic multiset S of integers, which allows duplicate values: INSERT(S,x) inserts x into S . DELETE-LARGER-HALF (S) ⌈eletes the largest d|S| /2⌉ elements from S . Explain how to implement this data structure so that any sequence of m INSERT and DELETE-LARGER-HALF operations runs in O(m) time. Your implementation should also include a way to output the elements of S in O(|S|) time.',hint:'题干只给了两个操作：INSERT 与 DELETE-LARGER-HALF，没有 SEARCH/MIN/MAX， 也没有「DELETE-MALLER-THAN(k)」这种操作 —— 那是另一道题的框架，照它做会跑偏。 正解要的是**均摊线性**，不需要有序结构：用一个数组存元素并记 $|S|$。 DELETE-LARGER-HALF 要删掉最大的一半，先线性求出第 $\\lfloor |S|/2 \\rfloor + 1$ 小的元素（用第 9 章的 SELECT 或直接划分）， 把它之后的那些就地丢掉 —— 这一趟是 $O(|S|)$。★ 阈值别写成第 $\\lceil |S|/2 \\rceil$ 小：$|S| = 4$ 时那样会删掉 3 个，而题干只删 $\\lceil 4/2 \\rceil = 2$ 个。另外这是**多重集**，有重复键时不能只按「值不小于阈值」截断（会多删或少删），要按划分后的位置保留最小的 $\\lfloor |S|/2 \\rfloor$ 个。 代价账按 16.1 的聚合法算：每个元素**被插入时**收 2 元， 将来它至多在一次 DELETE-LARGER-HALF 里被「扫过 + 删除」各一次，正好用掉这 2 元； 而没有被删过的那一半（留在集合里的）不会额外花钱。于是 $m$ 个操作总代价 $O(m)$。 输出全部元素：直接顺序扫一遍数组，$O(|S|)$ ✓（不需要排序输出）。'},
    ]},
  ],
};
