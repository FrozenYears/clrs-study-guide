/* 第 16 章 16.2：记账法（The accounting method）。印刷页 453–456（pdf 474–477）。 */
export default {
  key:'s02',id:'ch16/s02',chapter:16,section:'16.2',
  title:'记账法：给操作预付存款',shortTitle:'16.2 记账法',
  titleEn:'The accounting method',
  source:{printed:[453,456],pdf:[474,477]},
  prerequisites:[{label:'16.1 Aggregate analysis',url:'#/ch16/s01'}],
  stages:[
   {type:'map',title:'给每个操作定一个价',
    why:'聚合分析把总账均摊到每个操作头上（大家一个价）。**记账法**更进一步：给不同操作定**不同的**摊还价 —— 贵的操作多收点，把多收的钱"存"进数据结构，替未来便宜的（甚至免费的）操作买单。',
    position:'16.1 的三选一变成了"定价策略"：关键要求是**信用永不透支** —— 总摊还 ≥ 总实际。16.3 的势能法是它的连续版本。',
    unlocks:[{label:'16.3 The potential method',url:'#/ch16/s03'}],
    mathKit:[
     {title:'摊还代价 ĉᵢ',body:'对第 $i$ 个操作收 $\\hat{c}_i$ 元；若 $\\hat{c}_i > c_i$（实际代价），多收的存为**信用**；若 $\\hat{c}_i < c_i$，用信用补差价。'},
     {title:'不变量',body:'任何时刻信用总额 $\\ge 0$ —— 否则定价失败。'},
     {title:'结论',body:'$\\sum_{i=1}^{n} \\hat{c}_i \\ge \\sum_{i=1}^{n} c_i$：总摊却是总实际的上界。'},
    ]},
   {type:'intuition',title:'PUSH 交 2 元，POP 免费',scene:'栈 + MULTIPOP 的记账方案',body:[
     '定价：**PUSH 收 2 元**（1 元付当下入栈，1 元存在这件对象上），**POP 收 0 元**，**MULTIPOP 收 0 元**。',
     '★ 为什么够用：POP/MULTIPOP 弹出的每件对象，身上都带着当初存的 1 元 —— 弹出要花的 1 元由这笔存款支付。',
     '★ 信用不变量：任何时刻信用总额 = 栈内对象数（每件 1 元）≥ 0。C 程序 part 2 在 2000 个随机操作上逐步验证了这一点（最低信用 0，从未透支）。',
     '★ 反面教材（part 3）：若 PUSH 只收 1 元，100 次 PUSH 后一次 MULTIPOP(100) 就把账打穿 —— 差 100 元。定价必须"预付未来的账"。',
     '★ 与聚合分析的对照：聚合给所有操作同一个价（总账/n）；记账法允许不同操作不同价 —— 信息更多，也更贴近"谁在花钱"。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 an alysis 是原书的断词伪影）。',blocks:[
     {kind:'body',page:454,en:'To illustrate the accounting method of amortized an alysis, we return to the stack example. Recall that the actual costs of the operations were',
      zh:'★ 回到栈的例子：先摆出实际代价，再定价。'},
     {kind:'body',page:455,en:'Moreover, the MULTIPOP operation also incurs no charge, since it\u2019s just repeated',
      zh:'★★ MULTIPOP 也收 0 元 —— 它只是重复的 POP，每个弹出对象的存款已就位（后半句：pops）。'},
     {kind:'body',page:449,en:'While reading this chapter, bear in mind that the charges assigned during an amortized analysis are for analysis purposes only. They need not\u2014and should not',
      zh:'★ 再次强调：定价只活在分析里，不进真实实现。'},
    ],terms:[{en:'accounting method',zh:'记账法',page:453},
              {en:'credit',zh:'信用（预付的存款）',page:454}]},
   {type:'pseudocode',title:'记账法的定价单',algo:'ACCOUNTING-SCHEME',signature:'栈操作的摊还定价（本站按原书整理）',page:455,
    lines:[
     {n:1,code:'PUSH    : 摊还价 2',zh:'★ 1 元付入栈，1 元存到这件对象上。'},
     {n:2,code:'POP     : 摊还价 0',zh:'花的是对象身上那 1 元存款。'},
     {n:3,code:'MULTIPOP: 摊还价 0',zh:'同上 —— 弹 k 个就动用 k 元存款。'},
     {n:4,code:'不变量: 信用总额 = 栈内对象数 >= 0',zh:'★★ 定价合法的判据：永不透支。'},
     {n:5,code:'结论  :  Σĉi >= Σci  对任意操作序列成立',zh:''}],
    vars:[{name:'ĉᵢ',meaning:'给第 i 个操作定的摊还价'},{name:'cᵢ',meaning:'第 i 个操作的实际代价'}],
    note:'★ 定价是分析工具（原书 p.449 的提醒）：不修改真实实现，不真的收费。',
    more:[]},
   {type:'visualize',title:'信用曲线',panels:[
     {title:'① 2000 个随机操作的账本（C 程序 part 2）',viz:'growth',
      chart:{xMax:2400,series:[
       {name:'总摊还 = 3n 上界',expr:'2 * n',color:'--viz-done'},
       {name:'最坏序列的错误估计 n²',expr:'n * n / 2000',color:'--viz-violation'}]},
      note:'★ 实测：总摊还 2078 = 总实际 2078 + 剩余信用 0 —— 每一分钱都有去向。'},
     {title:'② PUSH 定价 1 元 vs 2 元',viz:'growth',
      chart:{xMax:120,series:[
       {name:'记 2 分时的总摊还 ≈ 2n',expr:'2 * n',color:'--viz-done'},
       {name:'记 1 分时的总摊还 ≈ n（不够付）',expr:'n',color:'--viz-violation'},
       {name:'100 PUSH + MULTIPOP(100) 的实际 200',expr:'200',color:'--viz-compare'}]},
      note:'★ C 程序 part 3：100 次 PUSH + MULTIPOP(100)，实际 200；记 1 分只收 100 —— 透支 100。'},
    ],tasks:['对照 C 程序 part 2 的逐操作信用断言（credit == top）。'],note:''},
   {type:'code',title:'实测：信用永不透支',c:{file:'accounting_stack.c',code:String.raw`/* accounting_stack.c -- 16.2 记账法：给栈操作定摊还价。
 * 关键数字：PUSH 记 2 分（1 分干活 + 1 分存栈里），POP 与 MULTIPOP 都记 0 分；
 *           信用不变量：任何时刻栈内每件东西恰有 1 分存款 —— 总信用 >= 0。
 *           于是总摊还代价 >= 总实际代价。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NMAX 64
#define CHARGE_PUSH 2        /* PUSH 的摊还价 */
#define CHARGE_POP 0         /* POP 的摊还价 */
#define CHARGE_MP 0          /* MULTIPOP 的摊还价 */

static int stack[NMAX];
static int top;
static long credit;              /* 栈内存款总额 = top（每件 1 分） */

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

    /* part 1：单步记账演示 —— PUSH 时收 2 分、花 1 分、存 1 分 */
    {
        long charged = 0, actual = 0;
        top = 0; credit = 0;
        actual += op_push(7); charged += CHARGE_PUSH; credit += CHARGE_PUSH - 1;
        printf("part 1: PUSH 摊还价 2 分 = 1 分实际代价 + 1 分存进栈里 -> 栈内信用 %ld\n", credit);
        actual += op_pop(); charged += CHARGE_POP; credit -= 1;
        printf("        POP 摊还价 0 分，但实际要花 1 分 —— 用栈里那 1 分存款支付 -> 剩信用 %ld\n", credit);
        assert(credit == 0 && charged >= actual);
    }

    /* part 2：随机操作序列 —— 信用永不透支，总摊还 >= 总实际 */
    {
        long charged = 0, actual = 0, min_credit = 0;
        int n = 2000;
        top = 0; credit = 0;
        rng_seed(20260917);
        for (int i = 0; i < n; i++) {
            int r = (int)(rng_next() % 3);
            if (r == 0 || top == 0) {
                actual += op_push(i); charged += CHARGE_PUSH;
                credit += CHARGE_PUSH - 1;
            } else if (r == 1) {
                actual += op_pop(); charged += CHARGE_POP;
                credit -= 1;
            } else {
                int k = (int)(rng_next() % 5);
                int c = op_multipop(k);
                actual += c; charged += CHARGE_MP;
                credit -= c;
            }
            if (credit < min_credit) { min_credit = credit; }
            assert(credit == top);            /* 栈内每件东西恰 1 分存款 */
            assert(credit >= 0);              /* 信用不变量：不许透支 */
        }
        printf("part 2: %d 个操作的记账账本：\n", n);
        printf("        总摊还代价 %ld 分；总实际代价 %ld；最低信用 %ld（从未透支）\n",
               charged, actual, min_credit);
        assert(charged >= actual);
        printf("        剩余信用 %ld = 栈里还有 %d 件东西各自带 1 分 -> 总摊还 >= 总实际仍成立\n",
               credit, top);
        assert(charged == actual + credit);
    }

    /* part 3：为什么 PUSH 必须记 2 分 —— 记 1 分会透支 */
    {
        long charged = 0, actual = 0;
        int n = 100;                /* 全 PUSH：等下一波 MULTIPOP 全吐出来 */
        for (int i = 0; i < n; i++) { actual += op_push(i); charged += 1; }
        /* 现在一次性 MULTIPOP(n)：实际代价 n，但只有 0 分存款 */
        actual += op_multipop(n); charged += 0;
        printf("part 3: 若 PUSH 只记 1 分：%d 次 PUSH 后做一次 MULTIPOP(%d)，\n", n, n);
        printf("        总摊还 %ld < 总实际 %ld —— 透支 %ld 分，记账法失效\n",
               charged, actual, actual - charged);
        assert(charged < actual);
        printf("        所以 PUSH 必须记 2 分：多出的 1 分正是替未来的 POP/MULTIPOP 预付的。\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明定价与不变量。'},
           {line:11,zh:'`CHARGE_PUSH = 2`：定价就这一处 —— 其余操作都是 0。'},
           {line:16,zh:'`credit`：信用总额，恒等于栈内对象数（每件 1 元）。'},
           {line:38,zh:'★★ part 1：单步演示 PUSH 收 2 元、POP 用存款。'},
           {line:48,zh:'★★ part 2：2000 个随机操作，逐步断言 credit == top 且 credit >= 0。'},
           {line:52,zh:'★ part 2 的结论：总摊还 = 总实际 + 剩余信用 —— 精确的收支平衡。'},
           {line:76,zh:'★★ part 3：PUSH 只记 1 分的反例 —— MULTIPOP(100) 让账面透支 100。'}]},
    tests:[{in:'单次 PUSH 后 POP',out:'收 2 花 1 存 1；POP 花 0 摊还（用存款 1）'},
           {in:'2000 个随机操作',out:'总摊还 2078 = 总实际 2078 + 信用 0；最低信用 0'},
           {in:'100 PUSH + MULTIPOP(100)，若 PUSH 记 1 分',out:'透支 100 元 —— 定价失败'}],
    mapping:[{pc:4,pcCode:'不变量: 信用总额 >= 0',c:'`assert(credit == top); assert(credit >= 0);`（第 62–63 行）'},
             {pc:1,pcCode:'PUSH: 摊还价 2',c:'`actual += op_push(i); charged += CHARGE_PUSH; credit += CHARGE_PUSH - 1;`（第 54–56 行）'}]},
   {type:'analyze',title:'一本账：定价的三条约束',claims:[
     {expr:'2',when:'PUSH 的摊还价（元）',page:455,source:'book'},
     {expr:'0',when:'POP 与 MULTIPOP 的摊还价（元）',page:455,source:'book'},
     {expr:'\\sum \\hat{c}_i \\ge \\sum c_i',when:'记账法的一般结论（信用不透支）',page:454,source:'book'},
    ],tables:[{caption:'三种摊还价的对比（同一栈）',rows:[
      ['','实际代价','摊还价','多收/补差'],
      ['PUSH','1','2','多收 1 → 存到对象上'],
      ['POP','1','0','用对象身上那 1 元'],
      ['MULTIPOP(k)','k','0','动用 k 元存款'],
      ['k 位计数器 INCREMENT','最坏 k','见 16.2-3','习题：RESET 也收 O(1)'],
     ]},{caption:'聚合 vs 记账',rows:[
      ['','聚合分析','记账法'],
      ['摊还价','所有操作同一个','每个操作可不同'],
      ['视角','总账 ÷ n','预付与存款'],
      ['栈的答案','O(1)/次','PUSH 2、POP 0、MULTIPOP 0'],
      ['适合场景','各操作代价相近','代价分布悬殊、想看清谁付费'],
     ]}],chart:{xMax:64,series:[
     {name:'记账方案的总摊还 ≈ 2n',expr:'2 * n',color:'--viz-done'},
     {name:'实际总代价的界 ≈ 2n（两条线重合）',expr:'2 * n',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'总摊还 ≥ 总实际的代数',steps:[
      {zh:'每次操作后，信用变化 = $\\hat{c}_i - c_i$（多收为正、补差为负）。'},
      {zh:'$n$ 次操作后：信用总额 $= \\sum_i (\\hat{c}_i - c_i)$。'},
      {tex:'\\text{信用} \\ge 0 \\;\\Longrightarrow\\; \\sum_{i=1}^{n} \\hat{c}_i \\ge \\sum_{i=1}^{n} c_i',zh:'★ C 程序 part 2：2078 = 2078 + 0（序列结束时栈恰好空）。'}]},
     ],
    note:''},
   {type:'prove',title:'定价合法 = 信用永不透支',statement:'Moreover, the MULTIPOP operation also incurs no charge, since it\u2019s just repeated',page:455,
    intro:'★ 记账法的正确性论证就是验证不变量 —— 对任意操作序列，信用总额恒 ≥ 0。',
    steps:[
     {title:'不变量的构造',en:'To illustrate the accounting method of amortized an alysis, we return to the stack example.',page:454,
      body:['定义信用总额 = 栈内对象数（每件对象恰好携带 1 元存款）。',
        '**PUSH**：收 2 元，花 1 元，存 1 元到新对象 → 信用 +1，而栈内对象数 +1 → 不变量保持。',
        '**POP**：收 0 元，花 1 元 —— 用被弹对象自带的存款 → 信用 −1，对象数 −1 → 保持。∎']},
     {title:'MULTIPOP 的逐对象支付',en:'Moreover, the MULTIPOP operation also incurs no charge, since it\u2019s just repeated',page:455,
      body:['MULTIPOP 弹出 $k^{\\prime}$ 个对象：收 0 元，实际花 $k^{\\prime}$ 元。',
        '每弹一件就用掉它身上那 1 元 → 信用 −$k^{\\prime}$，对象数 −$k^{\\prime}$ → 不变量保持。',
        '★ C 程序 part 2 在 2000 个随机操作后断言 `credit == top` 且 `credit >= 0`（最低信用 0）。∎']},
     {title:'由不变量到上界',en:'While reading this chapter, bear in mind that the charges assigned during an amortized analysis are for analysis purposes only.',page:449,
      body:['$n$ 次操作后：$\\sum \\hat{c}_i = \\sum c_i + \\text{信用}$，而信用 = 栈内对象数 ≥ 0。',
        '所以 $\\sum \\hat{c}_i \\ge \\sum c_i$ —— 总摊还是总实际的上界。',
        '★ 反例（part 3）说明不变量不能省：定价 1 元时信用可以为负，"上界"随之失效。∎']},
    ],conclusion:'★ 结论：记账法 = 设计一套使信用不透支的定价；此时总摊还 ≥ 总实际。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'栈的记账方案里，PUSH 收多少钱？为什么？',options:['1 元，够付入栈','**2 元**，多出的 1 元替未来弹出预付','0 元，反正总账是 O(n)','k 元，看栈多大'],answer:1,
      why:'★ 多收的 1 元存在对象身上，POP/MULTIPOP 时替它付弹出的代价。'},
     {kind:'single',q:'记账法合法的判据是？',options:['每个操作摊还价相同','任何时刻信用总额 ≥ 0','总摊还 = 总实际','信用按操作序号递减'],answer:1,
      why:'★ 信用透支 = 总摊还 < 总实际 = 定价失败。'},
     {kind:'judge',q:'记账法给出的摊还价必须写进真实实现（如真的收费）。',answer:false,
      why:'★ 原书 p.449 的提醒：收费只为分析服务，不进实现。'},
     {kind:'judge',q:'记账法允许不同操作有不同的摊还价。',answer:true,
      why:'★ 这正是它比聚合分析精细的地方：PUSH 2 元、POP/MULTIPOP 0 元。'},
     {kind:'simulate',q:'2000 个随机操作后（C 程序 part 2），总摊还与总实际各是多少？总摊还 − 总实际 = ？（填数字）',expect:[0],placeholder:'例如：100',
      why:'2078 − 2078 = 0：序列结束时栈空，信用清零 —— 收支精确平衡。'},
     {kind:'simulate',q:'若 PUSH 只记 1 元，100 次 PUSH + MULTIPOP(100) 透支多少元？（填数字）',expect:[100],placeholder:'例如：50',
      why:'实际 200，只收 100 → 透支 100（C 程序 part 3）。'},
    ],bookExercises:[
     {id:'16.2-1',page:455,star:0,statement:'You perform a sequence of PUSH and POP operations on a stack whose size never exceeds k. After every k operations, a copy of the entire stack is made automat- ically, for backup purposes. Show that the cost of n stack operations, including copying the stack, is O(n) by assigning suitable amortized costs to the various stack operations.',hint:'复制整栈的代价 k 由 k 次操作分摊：给每次操作多收 1 元（PUSH 收 3、POP 收 1）即可 —— 每 k 次操作恰好攒够 k 元付一次复制。'},
     {id:'16.2-2',page:456,star:0,statement:'Redo Exercise 16.1-3 using an accounting method of analysis.',hint:'16.1-3 的代价序列（i 为 2 的幂时花 i）：给每个操作收 3 元。奇数元 spend 1 元、存 2 元；2 的幂次操作把攒的钱一次花光 —— 用"信用 ≥ 0"逐段验证。'},
     {id:'16.2-3',page:456,star:0,statement:'You wish not only to increment a counter but also t o reset it to 0 (i.e., make all bits in it 0). Counting the time to examine or modify a bit as Θ(1), show how to implement a counter as an array of bits so that any sequence of n INCREMENT and RESET operations takes O(n) time on an initially zero counter. (Hint: Keep a pointer to the high-order 1.)',hint:'RESET 收 O(1)：与 16.1-2 的 DECREMENT 不同，RESET 一次清掉的所有位都是"低位连续 1"——只有值 2^j − 1 时才动 j 位。做法：记录最高 1 位的位置 h，RESET 只需清到 h 并维护 h；给 INCREMENT 多收 1 元为 RESET 存款。'},
    ]},
  ],
};
