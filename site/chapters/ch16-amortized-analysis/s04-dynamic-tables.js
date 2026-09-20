/* 第 16 章 16.4：动态表（Dynamic tables）。印刷页 460–480（pdf 481–501）。 */
export default {
  key:'s04',id:'ch16/s04',chapter:16,section:'16.4',
  title:'动态表：扩张与收缩的平衡术',shortTitle:'16.4 动态表',
  titleEn:'Dynamic tables',
  source:{printed:[460,480],pdf:[481,501]},
  prerequisites:[{label:'16.3 The potential method',url:'#/ch16/s03'}],
  stages:[
   {type:'map',title:'摊还分析的第一个"工程应用"',
    why:'动态数组（C++ 的 vector、Python 的 list）何时倍增、何时收缩？这一节用势能法算出：只插入时每次插入摊还代价 **3**；插入+删除并存时，收缩线必须放在 **1/4**（而不是 1/2），否则会来回抖动。',
    position:'本章前三种方法的汇合点：聚合给出总账、记账解释 3 元定价、势能证明收缩方案。这也是全书反复出现的设计课：**摊还分析反过来指导参数选择**。',
    unlocks:[{label:'第 17 章 数据结构的扩张',url:'#/ch17/s01'}],
    mathKit:[
     {title:'装载因子',body:'$\\alpha = num / size \\in [0, 1]$。只插入时 $\\alpha \\ge 1/2$（倍增策略）。'},
     {title:'扩张',body:'$num = size$ 时新表取 $2 \\cdot size$ 槽，逐个搬旧元素 —— 单次最坏 $\\Theta(n)$。'},
     {title:'摊还代价',body:'只插入：每次 **3**（记账 1+2 或势能 $\\Phi = 2 \\cdot num - size$）；插删混合、1/4 收缩：均 $O(1)$。'},
    ]},
   {type:'intuition',title:'倍增的账：为什么恰好是 3',scene:'从空表开始连续插入',body:[
     '第 $i$ 次插入只在 $i-1$ 是 2 的幂时触发扩张（搬到 $i-1$ 个元素 + 插入 1 个）。C 程序 part 1：n=1024 时基本插入总数 **2047**，扩张恰好 10 次（i−1 = 1,2,…,512）。',
     '★ 聚合账：搬家总数 $1+2+\\cdots+512 = 1023 < n$ → 总代价 $< 3n$。',
     '★ 记账：每次插入收 **3 元** —— 1 元付当下，1 元存到自己身上（未来搬家时付），1 元存给空槽（预付未来的扩张）。扩张瞬间正好花光积蓄：C 程序 part 2 实测 9 次扩张后信用都回到 3。',
     '★ 势能：$\\Phi = 2 \\cdot num - size$（$\\alpha \\ge 1/2$ 时）≥ 0。每次插入摊还 = 1 + ΔΦ ≤ 3；扩张那次的巨额实际代价被**负的** ΔΦ 抵消。',
     '⚠ 若在 $\\alpha < 1/2$ 就收缩，删到半满再插一个就会"收缩→扩张→收缩"来回抖 —— 收缩线必须放在 **1/4**（part 4 实测：1/4 方案 0 次重组织，1/2 方案同一序列 206 次）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式）。',blocks:[
     {kind:'body',page:461,en:'A common heuristic allocates a new table with twice as many slots as the old one. If the only table operations are insertions, then the load factor of the table is always at least 1/2, and thus the amount of wasted space never exceeds half the total space in the table.',
      zh:'★★ 倍增启发式：只插入时 $\\alpha \\ge 1/2$，浪费空间不超过一半。'},
     {kind:'body',page:462,en:'TABLE-INSERT operations. Specifically, the i th operation causes an expansion only when i − 1 is an exact power of 2. The amortized cost of an operation is in fact O(1), as an aggregate analysis shows.',
      zh:'★★ 扩张时机：i − 1 是 2 的幂；聚合分析给出 O(1) 摊还。'},
     {kind:'body',page:463,en:'Then the table holds m/2 items, and it contains no credit. Each call of TABLE- INSERT charges $3. The elementary insertion that occurs immediately costs $1.',
      zh:'★★ 记账：扩张后表内有 m/2 件东西、信用为 0；每次插入收 3 元。'},
     {kind:'body',page:466,en:'The problem with this strategy is that after the table expands, not enough deletions occur to pay for a contraction. Likewise, after the table contracts, not enough insertions take place to pay for an expansion.',
      zh:'★★ 1/2 收缩为何失败：扩张后删不够付收缩，收缩后插不够付扩张。'},
     {kind:'body',page:466,en:'An expansion or contraction should exhaust all the built-up potential, so that immediately after expansion or contraction, when the load factor is 1/2, the table\u2019s potential is 0. Figure 16.5 shows the idea. As the load factor deviates from 1/2, the 1/2',
      zh:'★★ 设计原则：扩张/收缩应该**正好耗尽**积累的势能 —— 势函数要以 1/2 为零点。'},
     {kind:'body',page:466,en:'\u2022 the load factor of the dynamic table is bounded below by a positive constant, as well as above by 1, and \u2022 the amortized cost of a table operation is bounded above by a constant.',
      zh:'★ 好方案的两大收益：装载因子被夹在正常数与 1 之间；摊还代价被常数夹住。'},
    ],terms:[{en:'dynamic table',zh:'动态表（可扩张数组）',page:460},
              {en:'load factor',zh:'装载因子 α = num/size',page:460},
              {en:'expansion',zh:'扩张（倍增）',page:461}]},
   {type:'pseudocode',title:'TABLE-INSERT：11 行',algo:'TABLE-INSERT',signature:'TABLE-INSERT(T, x)',page:462,
    lines:[
     {n:1,code:'if T.size == 0',zh:'★ 空表先给 1 个槽。'},
     {n:2,code:'    allocate T.table with 1 slot',zh:''},
     {n:3,code:'    T.size = 1',zh:''},
     {n:4,code:'if T.num == T.size',zh:'★★ 装满 -> 触发扩张。'},
     {n:5,code:'    allocate new-table with 2 • T.size slots',zh:'新表容量翻倍。'},
     {n:6,code:'    insert all items in T.table into new-table',zh:'★★ 逐个搬 —— 这就是巨额代价所在。'},
     {n:7,code:'    free T.table',zh:''},
     {n:8,code:'    T.table = new-table',zh:''},
     {n:9,code:'    T.size = 2 • T.size',zh:''},
     {n:10,code:'insert x into T.table',zh:''},
     {n:11,code:'T.num = T.num + 1',zh:''}],
    vars:[{name:'T.num',meaning:'表内元素数'},{name:'T.size',meaning:'槽数'}],
    note:'★ 单次最坏 Θ(n)（扩张搬家），但摊还 O(1) —— 本章三法的会师点。',
    more:[{algo:'TABLE-DELETE',subtitle:'TABLE-DELETE(T, x) + 1/4 收缩（本站按原书 16.4.3 的方案整理）',signature:'收缩线：num == size/4',page:466,
      lines:[{n:1,code:'删除 x（省略具体查找）',zh:''},
        {n:2,code:'T.num = T.num − 1',zh:''},
        {n:3,code:'if T.num == T.size / 4',zh:'★ 收缩线 1/4 —— 与扩张线 1/2 隔开距离。'},
        {n:4,code:'    逐个搬到 size/2 的新表',zh:''},
        {n:5,code:'    T.size = T.size / 2',zh:''}],
      vars:[{name:'α',meaning:'装载因子 num/size'}],
      note:'★ 收缩后 α 恰为 1/2：与扩张后相同 —— 势能回到 0（原书 p.466 的"耗尽势能"原则）。'}]},
   {type:'visualize',title:'看见抖动与稳定',panels:[
     {title:'① n=1024 次插入的基本插入总数（C 程序 part 1）',viz:'growth',
      chart:{xMax:16,series:[
       {name:'实际总代价 ≈ 2n',expr:'2 * n',color:'--viz-done'},
       {name:'记账收 3n',expr:'3 * n',color:'--viz-compare'},
       {name:'最坏外推 n²/2',expr:'n * n / 2',color:'--viz-violation'}]},
      note:'★ 实测 2047：介于 n 与 3n 之间；若按单次最坏 O(n) 估就是 50 万 —— 差 250 倍。'},
     {title:'② 1/4 收缩 vs 1/2 收缩：同一串交替插删（C 程序 part 4）',viz:'growth',
      chart:{xMax:220,series:[
       {name:'1/4 收缩（书）：重组织 0 次',expr:'0',color:'--viz-done'},
       {name:'1/2 收缩（错误）：206 次且线性增长',expr:'n',color:'--viz-violation'}]},
      note:'★ 1/2 收缩在 α≈1/2 处每次插删都扩张+收缩 —— 摊还 O(1) 被破坏。'},
    ],tasks:['对照 C 程序 part 2：每次扩张后信用恰好回到 3。'],note:''},
   {type:'code',title:'实测：2047 / 1535 / 206',c:{file:'dynamic_tables.c',code:String.raw`/* dynamic_tables.c -- 16.4 动态表：扩张与收缩的摊还分析。
 * 关键数字：
 *   part 1  只插入（倍增）：n=1024 次插入的基本插入总数 = 2047 < 3n，摊还 O(1)；
 *   part 2  记账：每次 TABLE-INSERT 记 3 元，信用永不透支；
 *   part 3  势能 Φ = 2*num - size：插入摊还代价 <= 3，恒等式逐次成立；
 *   part 4  收缩阈值：书里的 1/4 方案在交替插删下 0 次重组织；
 *           错误的 1/2 收缩方案会被同一操作序列打爆（来回抖动）。 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int *cur;              /* 当前表 */
static int size;              /* 槽位数 */
static int num;               /* 元素数 */
static long elementary;       /* 基本插入（逐个搬元素）计数 */
static long reorg;            /* 扩张/收缩次数 */

static void table_insert(int x)          /* TABLE-INSERT 的 11 行直译 */
{
    if (num == size) {                   /* 行 4：装满 -> 倍增扩张（行 5–9） */
        int *nt = malloc(sizeof(int) * 2 * size);
        memcpy(nt, cur, sizeof(int) * num);
        for (int i = 0; i < num; i++) { nt[i] = cur[i]; elementary++; }   /* 行 6：逐个搬 */
        free(cur); cur = nt; size = 2 * size;
        reorg++;
    }
    cur[num++] = x; elementary++;        /* 行 10–11 */
}

static void table_delete_1_4(void)       /* 删除 + 1/4 阈值收缩（书的方案） */
{
    num--;
    if (num > 0 && num == size / 4) {    /* 装载因子掉到 1/4 -> 减半 */
        int *nt = malloc(sizeof(int) * size / 2);
        for (int i = 0; i < num; i++) { nt[i] = cur[i]; elementary++; }
        free(cur); cur = nt; size = size / 2;
        reorg++;
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：只插入 —— 第 i 次操作仅当 i-1 是 2 的幂时才扩张 */
    {
        int n = 1024;
        size = 1; num = 0; elementary = 0; reorg = 0;
        cur = malloc(sizeof(int));
        for (int i = 1; i <= n; i++) {
            long before = elementary;
            table_insert(i);
            if (elementary > before + 1) {   /* 这次触发了扩张 */
                printf("        第 %4d 次插入触发扩张：搬 %d 个旧元素\n", i, i - 1);
                assert(((i - 1) & (i - 2)) == 0);   /* i-1 是 2 的幂 */
            }
        }
        printf("part 1: n = %d 次插入：基本插入总数 %ld = n + 搬家 %ld，摊还 %.2f 次/插入\n",
               n, elementary, elementary - n, (double)elementary / n);
        printf("        搬家总数 %ld = 1+2+4+...+512 < n -> 总代价 < 3n = %d，摊还 O(1)\n",
               elementary - n, 3 * n);
        assert(elementary == 2L * n - 1);
        assert(reorg == 10);
        printf("        扩张恰好发生在 i-1 = 1,2,4,...,512 的插入上（共 %ld 次）\n", reorg);
        free(cur);
    }

    /* part 2：记账 —— 每次 TABLE-INSERT 收 3 元 */
    {
        int n = 512;
        long actual = 0, credit = 0, min_credit = 1L << 30;
        int expansions = 0;
        size = 1; num = 0; elementary = 0;
        cur = malloc(sizeof(int));
        for (int i = 1; i <= n; i++) {
            long before = elementary;
            table_insert(i);
            int expanded = (elementary > before + 1);
            actual += elementary - before;
            credit = 3L * i - actual;        /* 已收总额 - 已花总额 */
            if (credit < min_credit) { min_credit = credit; }
            assert(credit >= 2);             /* 信用不变量：永不透支 */
            if (expanded) {
                expansions++;
                assert(credit == 3);         /* 扩张恰好花光全部积蓄，只剩刚收的 3 元 */
            }
        }
        printf("part 2: 记账法（每次插入收 3 元，n = %d）：\n", n);
        printf("        总收 %ld 元，实花 %ld 元，最终信用 %ld，最低信用 %ld\n",
               3L * n, actual, credit, min_credit);
        printf("        %d 次扩张恰好把积蓄花光 —— 每次扩张后信用都回到 3\n", expansions);
        assert(expansions == 9);
        free(cur);
    }

    /* part 3：势能 Φ = 2*num - size（纯插入时恒 >= 0） */
    {
        int n = 512;
        size = 1; num = 0; elementary = 0;
        cur = malloc(sizeof(int));
        long sum_actual = 0, sum_amort = 0;
        int prev_phi = 0;
        for (int i = 1; i <= n; i++) {
            long before = elementary;
            table_insert(i);
            int c = (int)(elementary - before);
            int phi = 2 * num - size;
            sum_actual += c;
            sum_amort += c + (phi - prev_phi);   /* 摊还 = 实际 + ΔΦ */
            prev_phi = phi;
            assert(phi >= 0);
        }
        printf("part 3: 势能法（Φ = 2*num - size）：\n");
        printf("        Σ实际 = %ld，Σ摊还 = %ld（恒等式逐次精确成立）\n", sum_actual, sum_amort);
        printf("        每次插入摊还代价 <= 3（1 元干活 + 势能增量最多 2）\n");
        assert(sum_amort == sum_actual + prev_phi);
        assert(sum_amort <= 3L * n);
        free(cur);
    }

    /* part 4：收缩阈值 —— 1/4 收缩稳，1/2 收缩抖
     * 抖动场景（书 p.466 的警告）：表在「半满多一点」处做交替插删。 */
    {
        int i;
        /* 方案 A（书）：先插 33 个（size=64，num=33，α 略高于 1/2），再交替删/插 */
        size = 1; num = 0; elementary = 0; reorg = 0;
        cur = malloc(sizeof(int));
        for (i = 1; i <= 33; i++) { table_insert(i); }
        long reorg_after_fill = reorg;
        for (i = 0; i < 200; i++) {
            if (i % 2 == 0 && num > 0) { table_delete_1_4(); }
            else { table_insert(1000 + i); }
        }
        printf("part 4: 插到 num=33（size=64，α≈1/2）后交替「删一插一」200 次：\n");
        printf("        1/4 收缩方案（书）：重组织 %ld 次 —— 稳定，无抖动\n",
               reorg - reorg_after_fill);
        assert(reorg - reorg_after_fill == 0);

        /* 方案 B（错误）：num == size/2 就减半 —— 同一序列来回抖 */
        {
            int cc_size = 1, cc_num = 0;
            long cc_reorg = 0;
            for (i = 0; i < 33; i++) {
                if (cc_num == cc_size) { cc_size *= 2; cc_reorg++; }
                cc_num++;
            }
            for (i = 0; i < 200; i++) {
                if (i % 2 == 0 && cc_num > 0) {
                    cc_num--;
                    if (cc_num == cc_size / 2) { cc_size /= 2; cc_reorg++; }
                } else {
                    if (cc_num == cc_size) { cc_size *= 2; cc_reorg++; }
                    cc_num++;
                }
            }
            printf("        1/2 收缩方案（错误）：同一序列重组织 %ld 次 —— 每对插删都扩张+收缩\n",
                   cc_reorg);
            assert(cc_reorg >= 200);
            printf("        这正是书 p.466 的警告：收缩线必须与扩张线隔开足够距离（1/2 vs 1/4）。\n");
        }
        free(cur);
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明四组关键数字。'},
           {line:19,zh:'`table_insert`：TABLE-INSERT 的 11 行直译（含逐个搬家计数）。'},
           {line:31,zh:'`table_delete_1_4`：删除 + 1/4 阈值收缩。'},
           {line:45,zh:'★★ part 1：n=1024 → 基本插入 2047 = n + 搬家 1023；扩张 10 次（i−1 均为 2 的幂）。'},
           {line:66,zh:'★★ part 2：记账 3 元/次 —— 9 次扩张后信用都恰好回到 3。'},
           {line:88,zh:'★★ part 3：势能 Φ = 2·num − size，Σĉ = Σc + Φ(Dn)，每次插入摊还 ≤ 3。'},
           {line:118,zh:'★★ part 4：1/4 收缩 0 次重组织 vs 1/2 收缩 206 次 —— 抖动的实测。'}]},
    tests:[{in:'n = 1024 只插入',out:'基本插入 2047 < 3n；扩张 10 次（i−1 = 1..512）'},
           {in:'记账 3 元/次，n = 512',out:'9 次扩张后信用均回到 3；最低信用 2'},
           {in:'num=33/64 处交替插删 200 次',out:'1/4 收缩 0 次重组织；1/2 收缩 206 次'}],
    mapping:[{pc:4,pcCode:'if T.num == T.size',c:'`if (num == size)`（第 21 行）'},
             {pc:6,pcCode:'insert all items in T.table into new-table',c:'`for (int i = 0; i < num; i++) { nt[i] = cur[i]; elementary++; }`（第 24 行）'}]},
   {type:'analyze',title:'一本账：三法合一',claims:[
     {expr:'3',when:'只插入时 TABLE-INSERT 的摊还代价（记账与势能一致）',page:463,source:'book'},
     {expr:'\\alpha \\ge 1/2',when:'倍增策略下装载因子的下界',page:461,source:'book'},
     {expr:'O(1)',when:'1/4 收缩方案下 TABLE-INSERT 与 TABLE-DELETE 的摊还代价',page:466,source:'book'},
    ],tables:[{caption:'C 程序的四组实测（n = 1024 / 512 / 200）',rows:[
      ['实验','关键数字','验证的命题'],
      ['只插入','基本插入 2047 < 3n；扩张 10 次','聚合分析：摊还 O(1)'],
      ['记账 3 元','9 次扩张后信用都 = 3','信用永不透支'],
      ['势能 Φ=2num−size','Σĉ = 1535 = Σc + Φ(Dn)','每插入摊还 ≤ 3'],
      ['收缩阈值','1/4：0 次；1/2：206 次','1/2 收缩会抖动'],
     ]},{caption:'收缩线放哪里？',rows:[
      ['收缩阈值','交替插删的重组织','摊还代价'],
      ['α < 1/2 收缩','每次插删 2 次 → Θ(n) 摊还','失效'],
      ['α < 1/4 收缩（书）','0 次','O(1)'],
     ]}],chart:{xMax:40,series:[
     {name:'倍增后 num（阶梯 = 扩张时机）',expr:'Math.pow(2, Math.floor(Math.log2(n + 1) + 1)) / 2',color:'--viz-done'},
     {name:'若无扩张：线性增长',expr:'n',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'为什么每次插入摊还恰好 3（势能法）',steps:[
      {zh:'$\\Phi = 2 \\cdot num - size$（$\\alpha \\ge 1/2$ 时 $\\Phi \\ge 0$，扩张/收缩后恰为 0）。'},
      {zh:'普通插入：$c=1$，$\\Delta\\Phi = 2$ → 摊还 $3$。'},
      {tex:'\\hat{c} = i + \\big(\\Phi(D_{i}) - \\Phi(D_{i-1})\\big) = i + (2 - (i-1)) = 3',zh:'★ 扩张那次：实际 $i$，但 $\\Delta\\Phi = 2 - (i-1) \\le 0$ —— 巨额代价被势能回落抵消，摊还仍是 3。'}]},
     ],
    note:''},
   {type:'prove',title:'势能法证明：摊还代价被常数夹住',statement:'An expansion or contraction should exhaust all the built-up potential, so that immediately after expansion or contraction, when the load factor is 1/2, the table\u2019s potential is 0.',page:466,
    intro:'★ 这是全书最漂亮的势能证明之一：势函数以 1/2 为零点设计，让扩张/收缩自动"耗尽"势能。',
    steps:[
     {title:'势函数的设计',en:'A common heuristic allocates a new table with twice as many slots as the old one.',page:461,
      body:['插删混合时 $\\alpha$ 可上可下。取',
        '$\\Phi(T) = 2 \\cdot num - size$（$\\alpha \\ge 1/2$）；$\\Phi(T) = size/2 - num$（$\\alpha < 1/2$）。',
        '设计意图（原书 p.466）：**扩张/收缩后 $\\alpha = 1/2$，此时 $\\Phi = 0$** —— 装载因子偏离 1/2 越远，攒的势能越多，正好够付下一次重组织。∎']},
     {title:'TABLE-INSERT 的摊还代价 ≤ 3',en:'TABLE-INSERT operations. Specifically, the i th operation causes an expansion only when i − 1 is an exact power of 2.',page:462,
      body:['不扩张（$\\alpha \\in [1/2, 1)$）：$c = 1$，$num$ 加一 → $\\Delta\\Phi = 2$ → $\\hat{c} = 3$。',
        '触发扩张（$\\alpha = 1$，$num = size = m$）：$c = m + 1$（搬 $m$ 个 + 插 1 个）；扩张后 $num = m+1, size = 2m$ → $\\Phi$ 从 $m$ 变成 $2$，$\\Delta\\Phi = 2 - m$。',
        '$\\hat{c} = (m+1) + (2-m) = 3$ —— **恰好也是 3**！巨额实际代价被势能回落抵消。∎']},
     {title:'TABLE-DELETE 的摊还代价 ≤ 2，以及 1/2 收缩的反例',en:'The problem with this strategy is that after the table expands, not enough deletions occur to pay for a contraction. Likewise, after the table contracts, not enough insertions take place to pay for an expansion.',page:466,
      body:['删除（不收缩）：$c = 1$，$num$ 减一。若 $\\alpha$ 仍在 $[1/2, 1]$，$\\Delta\\Phi = -2$ → $\\hat{c} = -1$（可为负，攒势能）。若跨过 1/2 线，势函数切换分支，$\\Delta\\Phi = 1$ → $\\hat{c} = 2$。',
        '收缩触发（$\\alpha$ 掉到 $1/4$）：$c = num + 1$，收缩后 $\\Phi = 0$，$\\Delta\\Phi = -\\Phi_{before}$ → $\\hat{c} \\le 2$（详细计算见原书 p.467）。',
        '★ 反例（C 程序 part 4）：若在 $\\alpha < 1/2$ 就收缩，num=33/64 起交替插删 → 206 次重组织；1/4 方案同一序列 0 次 —— 这就是"两条线必须隔开"的定量含义。∎']},
    ],conclusion:'★ 结论：倍增 + 1/4 收缩下，INSERT/DELETE 摊还代价均 O(1)，且装载因子被夹在 [1/4, 1]。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'只插入的动态表，每次 TABLE-INSERT 的摊还代价是？',options:['1','**3**','O(lg n)','O(n)'],answer:1,
      why:'★ 记账（1+2 元）与势能（1 + ΔΦ ≤ 2）都给出 3。'},
     {kind:'single',q:'插删混合时，收缩线为什么放 1/4 而不是 1/2？',options:['节省内存','**避免在 α≈1/2 处插删来回触发扩张/收缩**','让装载因子保持 1','为了配合倍增'],answer:1,
      why:'★ 1/2 收缩会在半满处抖动；1/4 留出缓冲带（C 程序 part 4：0 次 vs 206 次）。'},
     {kind:'judge',q:'n=1024 次插入（从空表开始）的基本插入总数是 2047。',answer:true,
      why:'★ n=1024 + 搬家 1023（=1+2+…+512）；C 程序 part 1 实测。'},
     {kind:'judge',q:'扩张的那一次插入，其摊还代价远大于 3。',answer:false,
      why:'★ 恰好也是 3：实际 i 元 + 势能回落 (2−(i−1)) = 3 —— 势能法最精彩的一步。'},
     {kind:'simulate',q:'1024 次插入共触发多少次扩张？（填数字）',expect:[10],placeholder:'例如：9',
      why:'i−1 ∈ {1,2,4,…,512}，共 10 个 2 的幂（C 程序 part 1）。'},
     {kind:'simulate',q:'num=33/size=64 起交替插删 200 次，1/2 收缩方案重组织多少次？（填数字）',expect:[206],placeholder:'例如：100',
      why:'含初始 6 次扩张；交替段 200 次重组织（每对插删一次收缩+一次扩张）—— C 程序 part 4 实测 206。'},
    ],bookExercises:[
     {id:'16.4-1',page:470,star:0,statement:'Using the potential method, analyze the amortized cost of the first table insertion.',hint:'首次插入要付**两笔**，不是一笔：表为空时 $\\text{TABLE-INSERT}$ 要先分配一张 $\\text{size} = 1$ 的表， 再把元素放进去 —— 实际代价 $c_1 = 2$（这是本题唯一容易漏的地方，题干专挑它问就是因为它是边界）。 势函数 $\\Phi = 2\\cdot\\text{num} - \\text{size}$：插入前空表 $\\Phi_0 = 2\\cdot 0 - 0 = 0$； 插入后 $\\text{num} = 1$、$\\text{size} = 1$，$\\Phi_1 = 2 - 1 = 1$，$\\Delta\\Phi = 1$。 摊还代价 $\\hat{c}_1 = c_1 + \\Delta\\Phi = 2 + 1 = 3$ ✓ 正好落在定理 16.2 给其余情形证出来的那个界上， 所以「$\\le 3$」这条对整条操作序列统一成立，首次插入不是例外。'},
     {id:'16.4-2',page:470,star:0,statement:'You wish to implement a dynamic, open-address hash table. Why might you con- sider the table to be full when its load factor reaches some value ˛ that is strictly less than 1? Describe briefly how to make insertion into a dynamic, open-address hash table run in such a way that the expected value of the amortized cost per insertion is O(1). Why is the expected value of the actual cost per insertion not necessarily O(1) for all insertions?',hint:'三问都要答，第三问才是这道题的目的。 (1) $\\alpha$ 越接近 1，成功/不成功查找的期望探测次数越糟（$(1/\\alpha)\\ln(1/(1-\\alpha))$ 型）， 所以把「满」定在 $\\alpha < 1$ 的阈值上才保得住 $O(1)$ 探测。 (2) 动态表 + 阈值：到阈值就重建一个双倍大的表并把所有元素重新散列进去。 用势能法（$\\Phi$ 记「已付而未花掉的搬迁费」，或照 16.4 的 $\\Phi = 2\\cdot\\text{num} - \\text{size}$ 改阈值重推） 可得**摊还**期望代价 $O(1)$：一次重建的 $\\Theta(\\text{num})$ 由之前每次插入攒下的信用付清。 (3) 但**单次实际代价的期望**不是 $O(1)$：触发重建的那次插入实际花 $\\Theta(\\text{num})$， 而它是不是「下一次」并不由随机散列函数决定（重建时机由表长与元素数确定）， 随机性只能打散「哪个键撞哪里」，打不散「何时必须搬家」。 所以那一次的期望实际代价仍是 $\\Theta(n)$ —— 摊还界与逐次期望界的区别正在这里。'},
     {id:'16.4-3',page:471,star:0,statement:'Discuss how to use the accounting method to analyze both the insertion and dele- tion operations, assuming that the table doubles in size when its load factor ex- ceeds 1 and the table halves in size when its load factor goes below 1/4.',hint:'与 16.2 的栈同理：INSERT 收 3 元（1 干活 + 2 存款），DELETE 收 2 元（1 干活 + 1 存款）……关键是验证"每个元素与每个空槽的存款额"满足不透支；16.4-4 进一步讨论 2/3 收缩。'},
     {id:'16.4-4',page:471,star:0,statement:'Suppose that instead of contracting a table by halving its size when its load factor drops below 1/4, you contract the table by multiplying its size by 2/3 when its load factor drops below 1/3. Using the potential function ˆ(T) = j2.T: num − T: size/2/j ; show that the amortized cost of a TABLE-DELETE that uses this strategy is bounded above by a constant.',hint:'收缩到 α = (1/3)÷(2/3) = 1/2：仍在扩张线 1/2 之外？不 —— 恰好压在 1/2 上，交替插删时：删到 1/3 → 收缩回 1/2 → 插一个就 α>1/2 但未到 1……需要具体算：该方案插删交替时不会立即抖，但安全余量比 1/4 小。'},
    ]},
  ],
};
