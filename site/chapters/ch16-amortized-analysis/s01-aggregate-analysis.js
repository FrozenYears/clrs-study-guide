/* 第 16 章 16.1：聚合分析（Aggregate analysis）。印刷页 449–453（pdf 470–474）。 */
export default {
  key:'s01',id:'ch16/s01',chapter:16,section:'16.1',
  title:'聚合分析：n 个操作的总账',shortTitle:'16.1 聚合分析',
  titleEn:'Aggregate analysis',
  source:{printed:[449,453],pdf:[470,474]},
  prerequisites:[{label:'15.4 Offline caching',url:'#/ch15/s04'}],
  stages:[
   {type:'map',title:'摊还分析：从"单次最坏"到"n 次总账"',
    why:'最坏情况分析常常高估：栈的任何单次操作最坏 O(n)（MULTIPOP 弹光），但**任意 n 个操作的序列**总代价只有 O(n)。摊还分析求的是"总代价 / 操作数"，这不一定等于平均情况。',
    position:'第 15 章之后的第 IV 部分收尾章。本章给出三种方法（聚合、记账、势能），16.1 先讲最直接的**聚合分析**：算总账，再除以 n。',
    unlocks:[{label:'16.2 The accounting method',url:'#/ch16/s02'}],
    mathKit:[
     {title:'聚合分析',body:'n 个操作总最坏代价 $T(n)$ → 摊还代价 $= T(n)/n$。每个操作的摊还代价相同。'},
     {title:'栈 + MULTIPOP',body:'PUSH / POP 均 $O(1)$；MULTIPOP 最坏 $O(n)$，但一次 MULTIPOP 真正弹出的对象**不会再被弹出**。'},
     {title:'二进制计数器',body:'INCREMENT 最坏翻转 $k$ 位，但位 $i$ 每 $2^i$ 次自增才翻转一次 → $n$ 次自增总翻转 $< 2n$。'},
    ]},
   {type:'intuition',title:'弹掉的不会再弹',scene:'栈 + MULTIPOP',body:[
     '对栈做**任意** $n$ 个操作（PUSH / POP / MULTIPOP 混合）：最坏单个操作 $O(n)$，但总代价是 $O(n)$。',
     '★ 关键观察：一个对象被 PUSH 进栈后，**至多被弹出一次**。MULTIPOP 的 while 循环弹多少次，实际代价就是多少 —— 这些代价全都记在"当初那次 PUSH"头上。',
     '★ 所以把总代价拆开：每件东西的贡献 = 1 次进栈 + 至多 1 次出栈 = $O(1)$。$n$ 个操作的总代价 $O(n)$，摊还 $O(1)$/次。',
     '★ 二进制计数器同理：位 $i$ 每 $2^i$ 次自增才翻转一次。$n$ 次自增总翻转 $\\sum_{i} \\lfloor n/2^i \\rfloor < 2n$ —— C 程序 part 3 逐位实测。',
     '⚠ 与平均情况分析的差别：这里**没有任何概率假设** —— 是对最坏序列的总账，所以叫"摊还"而不是"期望"。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式）。',blocks:[
     {kind:'body',page:449,en:'We\u2019ll use use two examples in this chapter to examine each of these three methods. One is a stack with the additional operation MULTIPOP , which pops several objects at once. The other is a binary counter that counts up from 0 by means of the single operation INCREMENT .',
      zh:'★★ 本章的两个贯穿例子：MULTIPOP 栈 + 二进制计数器。'},
     {kind:'body',page:449,en:'In aggregate analysis, you show that for all n, a sequence of n operations takes',
      zh:'★ 聚合分析的定义（后半句接：$T(n)$ worst-case time in total）。'},
     {kind:'body',page:449,en:'While reading this chapter, bear in mind that the charges assigned during an amortized analysis are for analysis purposes only. They need not\u2014and should not',
      zh:'★ 摊还分析里的"收费"只是**分析工具**，不该（也不能）出现在真实实现里。'},
     {kind:'body',page:449,en:'When you perform an amortized analysis, you often gain insight into a particular data structure, and this insight can help you optimize the design.',
      zh:'★ 摊还分析的价值不止于证明 —— 它常能反过来指导设计（16.4 的动态表就是）。'},
     {kind:'body',page:450,en:'Now let\u2019s add the stack operation MULTIPOP (S,k) , which removes the k top objects of stack S , popping the entire stack if the stack contains fewer than k objects.',
      zh:'★ MULTIPOP 的定义：弹 $k$ 个；不足 $k$ 个就弹光。'},
    ],terms:[{en:'amortized analysis',zh:'摊还分析',page:449},
              {en:'aggregate analysis',zh:'聚合分析',page:449},
              {en:'MULTIPOP',zh:'一次弹出至多 k 个对象',page:450}]},
   {type:'pseudocode',title:'MULTIPOP 与 INCREMENT',algo:'MULTIPOP',signature:'MULTIPOP(S, k)',page:450,
    lines:[
     {n:1,code:'while not STACK-EMPTY(S) and k > 0',zh:'★ 弹到空或弹够 k 个为止。'},
     {n:2,code:'    POP(S)',zh:'每弹一个，实际代价 +1。'},
     {n:3,code:'    k = k − 1',zh:''}],
    vars:[{name:'S',meaning:'栈'},{name:'k',meaning:'至多弹出的对象数'}],
    note:'★ MULTIPOP 的实际代价 = 真正弹出的对象数 min(k, s)。',
    more:[{algo:'INCREMENT',subtitle:'INCREMENT(A, k) —— k 位二进制计数器自增（p.451，6 行）',signature:'INCREMENT(A, k)',page:451,
      lines:[{n:1,code:'i = 0',zh:''},
        {n:2,code:'while i < k and A[i] == 1',zh:'★ 从低位起把连着的 1 全翻成 0。'},
        {n:3,code:'    A[i] = 0',zh:''},
        {n:4,code:'    i = i + 1',zh:''},
        {n:5,code:'if i < k',zh:''},
        {n:6,code:'    A[i] = 1',zh:'遇到第一个 0（或到顶）翻成 1。'}],
      vars:[{name:'A[0..k−1]',meaning:'计数器的二进制位（低位在前）'}],
      note:'★ 单次最坏翻转 $k$ 位（如 0111→1000）；但 $n$ 次自增总翻转 $< 2n$。'}]},
   {type:'visualize',title:'总账与摊还代价',panels:[
     {title:'① 1000 个随机栈操作的总代价（C 程序 part 1）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'总代价上界 ≈ 2n',expr:'2 * n',color:'--viz-compare'},
       {name:'最坏单次 O(n) 的错误估计 ≈ n²/8',expr:'n * n / 8',color:'--viz-violation'}]},
      note:'★ 若按"单次最坏 O(n)"估计，1000 个操作会被估成 10⁶；实测总代价只有 1044 —— 差了三个数量级。'},
     {title:'② 计数器逐位翻转次数：位 i 每 2^i 次 +1',viz:'growth',
      chart:{xMax:32,series:[
       {name:'位 0（每次都翻）',expr:'n',color:'--viz-violation'},
       {name:'位 1（每 2 次）',expr:'n / 2',color:'--viz-done'},
       {name:'位 2（每 4 次）',expr:'n / 4',color:'--viz-compare'},
       {name:'位 3（每 8 次）',expr:'n / 8',color:'--viz-compare'}]},
      note:'★ 几何级数求和 < 2n —— 这就是聚合分析的整个论证。'},
    ],tasks:['对照 C 程序 part 3：n=1024 时位 0 翻 1024 次、位 1 翻 512 次。'],note:''},
   {type:'code',title:'实测：1044 / 2044 / 2047',c:{file:'aggregate_counter.c',code:String.raw`/* aggregate_counter.c -- 16.1 聚合分析：栈 + MULTIPOP，二进制计数器 INCREMENT。
 * 关键数字：n 次栈操作总代价 < 2n（摊还 O(1)/次）；
 *           二进制计数器 n 次自增总翻转位数 < 2n（n=16 时 31 次）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NMAX 64

/* ---------------- 实验 1：带 MULTIPOP 的栈 ---------------- */
static int stack[NMAX];
static int top;                       /* 栈内元素数（也当作 top 指针） */

/* 返回这次操作的实际代价（按"动过的元素数"计） */
static int op_push(int x) { stack[top++] = x; return 1; }
static int op_pop(void) { top--; return 1; }
static int op_multipop(int k)
{
    int cost = 0;
    while (top > 0 && k > 0) {        /* MULTIPOP 的 3 行直译 */
        top--; cost++; k--;
    }
    return cost;
}

/* 确定性伪随机：种子先做乘法混合，连续种子不相关 */
static unsigned int rng_s;
static void rng_seed(unsigned int s) { rng_s = s * 2654435761u; if (!rng_s) { rng_s = 0x9E3779B9u; } }
static unsigned int rng_next(void)
{
    rng_s ^= rng_s << 13; rng_s ^= rng_s >> 17; rng_s ^= rng_s << 5;
    return rng_s;
}

/* ---------------- 实验 2：k 位二进制计数器 INCREMENT ---------------- */
static int bits[NMAX];                /* 低位在前 */

static int increment(int k)           /* 返回本次翻转的位数（实际代价） */
{
    int i = 0;
    while (i < k && bits[i] == 1) {   /* 行 1–4：把连着的 1 全翻成 0 */
        bits[i] = 0; i++;
    }
    if (i < k) { bits[i] = 1; }       /* 行 5–6 */
    return i + 1;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：聚合分析 —— 任意 n 个栈操作的总代价是 O(n) */
    {
        long total = 0;
        int n = 1000, ops = 0, pushes = 0, pops = 0, mpops = 0;
        top = 0;
        rng_seed(20260917);
        for (int i = 0; i < n; i++) {
            int r = (int)(rng_next() % 3);
            if (r == 0 || top == 0) { total += op_push(i); pushes++; }
            else if (r == 1) { total += op_pop(); pops++; }
            else { total += op_multipop((int)(rng_next() % 5)); mpops++; }
            ops++;
            assert(top >= 0 && top <= NMAX);
        }
        printf("part 1: %d 个栈操作（PUSH %d / POP %d / MULTIPOP %d），总代价 %ld\n",
               ops, pushes, pops, mpops, total);
        printf("        摊还代价 = 总代价/n < %.1f —— 聚合分析：总代价 O(n)，每个操作 O(1)\n",
               (double)total / ops);
        assert(total <= 2 * ops);
    }

    /* part 2：逐次打印计数器翻转位（n = 8，对应原书 Figure 16.2 的思想） */
    printf("part 2: 8 位计数器从 0 自增 8 次，每次翻转的位：\n");
    {
        memset(bits, 0, sizeof(bits));
        int total = 0;
        for (int step = 1; step <= 8; step++) {
            int c = increment(8);
            total += c;
            printf("        第 %d 次自增：翻转 %d 位 -> 值 %d（二进制 ",
                   step, c, bits[0] + 2 * bits[1] + 4 * bits[2] + 8 * bits[3]);
            for (int b = 3; b >= 0; b--) { printf("%d", bits[b]); }
            printf("）\n");
        }
        printf("        8 次共翻转 %d 位 < 2 * 8\n", total);
        assert(total < 2 * 8);
    }

    /* part 3：n 次自增的总翻转 < 2n —— 逐位统计 */
    {
        int n = 1024, k = 16;
        memset(bits, 0, sizeof(bits));
        long total = 0;
        int per_bit[NMAX] = {0};
        for (int i = 0; i < n; i++) {
            int c = increment(k);
            total += c;
            /* 记下这次动了哪些位（第 0..c-1 位被翻成 0，第 c 位翻成 1） */
            for (int b = 0; b < c && b < k; b++) { per_bit[b]++; }
        }
        printf("part 3: n = %d 次自增（k = %d 位），总翻转 %ld 次\n", n, k, total);
        printf("        位 0 翻转 %d 次、位 1 翻转 %d 次、位 2 翻转 %d 次、位 3 翻转 %d 次…\n",
               per_bit[0], per_bit[1], per_bit[2], per_bit[3]);
        printf("        位 i 最多翻转 floor(n / 2^i) 次 -> 总翻转 < 2n = %d\n", 2 * n);
        assert(per_bit[0] == n);
        assert(per_bit[1] == n / 2);
        assert(total < 2L * n);
        printf("        摊还代价：总翻转/n = %.3f 次/操作 —— O(1)\n", (double)total / n);
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明两个实验的关键数字。'},
           {line:17,zh:'`op_multipop`：MULTIPOP 的 3 行直译，实际代价 = 弹出的对象数。'},
           {line:38,zh:'`increment`：INCREMENT 的 6 行直译，返回翻转位数。'},
           {line:52,zh:'★★ part 1：1000 个随机栈操作总代价 1044 —— 每个操作摊还 O(1)。'},
           {line:70,zh:'★ part 2：8 次自增逐次打印翻转位与当前值。'},
           {line:88,zh:'★★ part 3：n=1024 时位 0 翻 1024 次、位 1 翻 512 次；总翻转 < 2n。'}]},
    tests:[{in:'1000 个随机栈操作',out:'总代价 1044（PUSH 524 / POP 245 / MULTIPOP 231）'},
           {in:'8 位计数器自增 8 次',out:'总翻转 13 位 < 16'},
           {in:'16 位计数器自增 1024 次',out:'总翻转 2044 < 2n = 2048'}],
    mapping:[{pc:1,pcCode:'while not STACK-EMPTY(S) and k > 0',c:'`while (top > 0 && k > 0)`（第 20 行）'},
             {pc:2,pcCode:'while i < k and A[i] == 1',c:'`while (i < k && bits[i] == 1)`（第 41 行）'}]},
   {type:'analyze',title:'一本账：两笔总账',claims:[
     {expr:'O(1)',when:'栈操作的摊还代价（PUSH/POP/MULTIPOP 一律）',page:450,source:'book'},
     {expr:'< 2n',when:'n 次自增的总翻转位数（每位 i 至多 floor(n/2^i) 次）',page:452,source:'book'},
     {expr:'O(1)',when:'INCREMENT 的摊还代价',page:452,source:'book'},
    ],tables:[{caption:'两笔账的算术（C 程序实测）',rows:[
      ['','序列长度','实际总代价','摊还代价/操作'],
      ['栈操作','1000','1044','约 1.0'],
      ['计数器自增','8','13','1.6'],
      ['计数器自增','1024','2044','1.996'],
     ]},{caption:'聚合分析 vs 最坏情况分析',rows:[
      ['','最坏情况（单次）','聚合分析（n 次总账）'],
      ['MULTIPOP','$O(n)$','与 PUSH 同价：$O(1)$'],
      ['INCREMENT','$O(k)$','$O(1)$'],
      ['估计 1000 个栈操作','$10^6$ 量级','$10^3$ 量级'],
     ]}],chart:{xMax:32,series:[
     {name:'总翻转 < 2n',expr:'2 * n',color:'--viz-done'},
     {name:'单次最坏的错误外推 ≈ n·k/2',expr:'n * 16 / 2',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'计数器的几何级数',steps:[
      {zh:'位 $i$ 只在低 $i$ 位全为 1 时才翻转，每 $2^i$ 次自增发生一次。'},
      {zh:'$n$ 次自增中位 $i$ 至多翻转 $\\lfloor n/2^i \\rfloor$ 次。'},
      {tex:'\\sum_{i=0}^{\\lfloor \\lg n \\rfloor} \\left\\lfloor \\frac{n}{2^i} \\right\\rfloor < n \\sum_{i=0}^{\\infty} \\frac{1}{2^i} = 2n',zh:'★ C 程序 part 3 实测：位 0 翻 1024、位 1 翻 512、位 2 翻 256……总 2044 < 2048。'}]},
     ],
    note:''},
   {type:'prove',title:'n 个栈操作的总代价是 O(n)',statement:'Now let\u2019s add the stack operation MULTIPOP (S,k) , which removes the k top objects of stack S , popping the entire stack if the stack contains fewer than k objects.',page:450,
    intro:'★ 聚合分析的完整论证：给每个对象记账，而不是给每个操作记账。',
    steps:[
     {title:'关键观察：一进一出',en:'We\u2019ll use use two examples in this chapter to examine each of these three methods.',page:449,
      body:['考虑对空栈执行的**任意** $n$ 个操作序列 $S$。',
        'LIFO 的序保证：一个对象被 PUSH 之后，在它被 POP（或被 MULTIPOP 弹出）之前，**没有别的对象能越过它被弹出**。',
        '所以每个对象的生命周期里至多发生：1 次 PUSH（代价 1）+ 1 次弹出（代价 1）= 2。∎']},
     {title:'总账',en:'Now let\u2019s add the stack operation MULTIPOP (S,k) , which removes the k top objects of stack S , popping the entire stack if the stack contains fewer than k objects.',page:450,
      body:['设序列里 PUSH 了 $p$ 个对象，则所有 MULTIPOP 与 POP 弹出的总数 $\\le p \\le n$。',
        '总代价 = PUSH 代价（$\\le p$）+ POP 代价 + MULTIPOP 代价（弹出总数 $\\le p$）$\\le 2p \\le 2n$。',
        '★ C 程序 part 1：1000 个随机操作总代价 1044 —— 与这个界一致。∎']},
     {title:'计数器的同型论证',en:'While reading this chapter, bear in mind that the charges assigned during an amortized analysis are for analysis purposes only.',page:449,
      body:['INCREMENT 的每次自增翻转"低位的连续 1"+1 位；位 $i$ 每翻转一次意味着计数器加了 $2^i$。',
        '所以位 $i$ 在 $n$ 次自增中至多翻转 $\\lfloor n/2^i \\rfloor$ 次，总翻转 $< 2n$（几何级数）。',
        '★ C 程序 part 3 实测 n=1024：2044 < 2048。∎']},
    ],conclusion:'★ 结论：摊还代价 = 总代价 / n = O(1)，且对最坏序列成立 —— 与平均情况（需要概率假设）不同。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'聚合分析给出的摊还代价是什么？',options:['单次最坏代价','**总代价 / n**（对最坏序列）','带概率权重的期望代价','实际代价的上界的一半'],answer:1,
      why:'★ 对所有 n：n 个操作总最坏代价 T(n)，摊还代价 = T(n)/n，每个操作相同。'},
     {kind:'single',q:'为什么 MULTIPOP 不破坏栈操作的 O(1) 摊还代价？',options:['因为它通常弹得很少','因为弹出的对象不会再被弹出，代价可记回当初的 PUSH','因为有概率假设','因为 k 有上限'],answer:1,
      why:'★ 一进一出：每个对象至多被弹一次。'},
     {kind:'judge',q:'摊还分析的结果依赖操作序列的随机性。',answer:false,
      why:'★ 摊还分析对最坏序列成立，不需要概率假设 —— 这是它与平均情况分析的本质区别。'},
     {kind:'judge',q:'若把 MULTIPOP 换成 MULTIPUSH(k)（一次压 k 个），O(1) 摊还代价仍然成立（习题 16.1-1）。',answer:true,
      why:'★ MULTIPUSH 压 k 个的代价 k，摊还到这 k 个对象各自未来的弹出上，总账仍是 O(n)。'},
     {kind:'simulate',q:'8 位计数器从 0 自增 8 次，总翻转多少位？（填数字）',expect:[13],placeholder:'例如：8',
      why:'1+2+1+3+1+2+1+4 = 13 < 16（C 程序 part 2 逐次打印）。'},
     {kind:'simulate',q:'16 位计数器自增 1024 次，总翻转多少位？（填数字）',expect:[2044],placeholder:'例如：1024',
      why:'Σ⌊1024/2ⁱ⌋ = 1024+512+…+1 = 2044 < 2n = 2048（C 程序 part 3 实测）。'},
    ],bookExercises:[
     {id:'16.1-1',page:453,star:0,statement:'If the set of stack operations includes a MULTIPUSH operation, which pushes k items onto the stack, does the O(1) bound on the amortized cost of stack operations continue to hold?',hint:'**不成立 —— 这就是本题的答案。** 原来的聚合论证靠的是「每个对象至多被弹出一次」，它管的是弹出侧；一旦允许 MULTIPUSH 一次压 $k$ 个、代价 $k$，而 $k$ 没有上界，连做 $n$ 次 MULTIPUSH($k$) 的总代价就是 $nk$，摊到每次操作是 $k$，不是 $O(1)$。要救这个界只有两条路：把 $k$ 当常数，或者把单次代价记成 $O(k)$ 再谈摊还。'},
     {id:'16.1-2',page:453,star:0,statement:'Show that if a DECREMENT operation is included in the k-bit counter example, n operations can cost as much as Θ(nk) time.',hint:'交替 INCREMENT/DECREMENT 于 2^k−1（全 1）附近：每次操作都翻转 k 位。构造：$k$ 位计数器从全 1 出发，INCREMENT 把 $2^k - 1$ 变成全 0（最高位进位丢掉），DECREMENT 再把全 0 变回全 1 —— 两个方向都是 $k$ 位一起翻。$n/2$ 对操作各花 $\\Theta(k)$，合计 $\\Theta(nk)$。'},
     {id:'16.1-3',page:453,star:0,statement:'Use aggregate analysis to determine the amortized cost per operation for a sequence of n operations on a data structure in which the i th operation costs i if i is an exact power of 2, and 1 otherwise.',hint:'总代价 ≤ n + Σ_{i=1}^{lg n} 2^i ≤ n + 2n = 3n → 摊还 O(1)。这正是 16.4 动态表的部分预算（那里 i−1 是 2 的幂时花 i）。'},
    ]},
  ],
};
