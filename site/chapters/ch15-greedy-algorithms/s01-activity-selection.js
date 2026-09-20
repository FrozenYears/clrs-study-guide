/* 第 15 章 15.1：活动选择问题（An activity-selection problem）。印刷页 418–425（pdf 439–446）。 */
export default {
  key:'s01',id:'ch15/s01',chapter:15,section:'15.1',
  title:'活动选择：选最早结束的那个',shortTitle:'15.1 活动选择',
  titleEn:'An activity-selection problem',
  source:{printed:[418,425],pdf:[439,446]},
  prerequisites:[{label:'14.5 Optimal binary search trees',url:'#/ch14/s05'}],
  stages:[
   {type:'map',title:'从 DP 到贪心的分水岭',
    why:'有 $n$ 个活动争用同一间教室，每个活动有开始时间 $s_i$ 与结束时间 $f_i$，求最大的**互不相容**活动子集。14 章说这是 DP（$\\Theta(n^3)$），本章说只要一个 $\\Theta(n\\lg n)$ 的贪心就够。',
    position:'第 14 章的 DP 是"到处试"，本章的贪心是"一次定"。本关先证明**为什么只试一个选择就够**（定理 15.1），下一关（15.2）把这条经验提炼成判据。',
    unlocks:[{label:'15.2 Elements of the greedy strategy',url:'#/ch15/s02'}],
    mathKit:[
     {title:'相容',body:'$a_i$ 与 $a_j$ 相容 $\\iff$ $s_i \\ge f_j$ 或 $s_j \\ge f_i$（半开区间 $[s_i,f_i)$ 不重叠）。'},
     {title:'贪心选择',body:'在 $S_k$ 里取**结束时间最早**的活动 $a_m$ —— 定理 15.1 说它一定属于某个最优解。'},
     {title:'时间',body:'预排序 $O(n\\lg n)$ + 一次扫描 $\\Theta(n)$；对比 DP 的 $\\Theta(n^3)$。'},
    ]},
   {type:'intuition',title:'11 个活动，最多能上几节课',scene:'Figure 15.1：a1..a11',body:[
     '原书 Figure 15.1 的 11 个活动按结束时间排好了序：$f = 4,5,6,7,9,9,10,11,12,14,16$。',
     '★ 贪心的动作极其简单：**永远选第一个结束的活动**，然后从所有"开始时间 ≥ 它的结束时间"的活动里继续这么做。',
     'C 程序实测：选出 $\\{a_1,a_4,a_8,a_{11}\\}$ —— **4 个**。而暴力枚举全部 $2^{11} = 2048$ 个子集，最大相容子集也正好是 4 个。',
     '★ 为什么"最早结束"安全？因为它给后面**留下最多时间** —— 这个占用区间在所有可行选择里是"最靠左"的。',
     '⚠ 换一个贪心就立刻失效：按"最早开始时间"选，反例 [0,6]、[1,4]、[4,7] 只能选 1 个，而最优是 2 个（C 程序 part 4）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 fa 1 ,a 4 ,a 8 ,a 11 g 代表 $\\{a_1,a_4,a_8,a_{11}\\}$）。',blocks:[
     {kind:'body',page:418,en:'For example, consider the set of activities in Figure 15.1. The subset fa 3 ,a 9 ,a 11 g consists of mutually compatible activities. It is not a maximum subset, however, since the subset fa 1 ,a 4 ,a 8 ,a 11 g is larger.',
      zh:'★★ 原书直接给出答案：$\\{a_1,a_4,a_8,a_{11}\\}$ 才是最大的。'},
     {kind:'body',page:420,en:'One big question remains: Is this intuition correct? Is the greedy choice\u2014in which you choose the first activity to finish\u2014always part of some optimal solution?',
      zh:'★★ 本关要回答的唯一问题：**最早结束的贪心选择是否总在某个最优解里**？'},
     {kind:'body',page:421,en:'Consider any nonempty subproblem S k , and let a m be an activity in S k with the earliest finish time. Then a m is included in some maximum-size subset of mutually compatible activities of S k .',
      zh:'★★ **Theorem 15.1** —— 最早结束者可选。这就是贪心的许可证。'},
     {kind:'body',page:419,en:'This way of characterizing optimal substructure suggests that you can solve the activity-selection problem by dynamic programming.',
      zh:'★ 先按 DP 走一遍（$\\Theta(n^3)$），再说明贪心为什么更快 —— 原书的推进顺序。'},
     {kind:'body',page:424,en:'Like the recursive version, GREEDY-ACTIVITY-SELECTOR schedules a set of n activities in \u0398(n) time, assuming that the activities were already sorted initially by their finish times.',
      zh:'★ 时间：扫描 $\\Theta(n)$；若含排序则 $\\Theta(n\\lg n)$。'},
    ],terms:[{en:'activity-selection problem',zh:'活动选择问题',page:418},
              {en:'mutually compatible',zh:'互不相容（区间不重叠）',page:418},
              {en:'greedy choice',zh:'贪心选择',page:420}]},
   {type:'pseudocode',title:'GREEDY-ACTIVITY-SELECTOR：7 行',algo:'GREEDY-ACTIVITY-SELECTOR',signature:'GREEDY-ACTIVITY-SELECTOR(s, f)',page:424,
    lines:[
     {n:1,code:'A = {a_1}',zh:'★ 第一个活动**总是**被选（它结束最早）。'},
     {n:2,code:'k = 1',zh:'$k$ 记住最近被选中的活动。'},
     {n:3,code:'for m = 2 to n',zh:''},
     {n:4,code:'    if s_m ≥ f_k    // is a_m in S_k?',zh:'★ 与已选者相容吗？（输入已按 $f$ 排序）'},
     {n:5,code:'        A = A ∪ {a_m}    // yes, so choose it',zh:'★ 相容就选 —— 它必然是剩余里结束最早的。'},
     {n:6,code:'        k = m    // and continue from there',zh:''},
     {n:7,code:'return A',zh:''}],
    vars:[{name:'A',meaning:'已选活动集合'},{name:'k',meaning:'最近一次选中活动的下标'}],
    note:'★ 全算法只有一次循环、没有回溯 —— 这就是贪心的形状：**每步做完决定就不再回头**。',
    more:[{algo:'RECURSIVE-ACTIVITY-SELECTOR',subtitle:'RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n) —— 递归版本（p.422，6 行）',signature:'RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n)',page:422,
      lines:[{n:1,code:'m = k + 1',zh:''},
        {n:2,code:'while m ≤ n and s_m < f_k    // find the first activity in S_k to finish',zh:'★ 往后找第一个相容者。'},
        {n:3,code:'    m = m + 1',zh:''},
        {n:4,code:'if m ≤ n',zh:''},
        {n:5,code:'    return {a_m} ∪ RECURSIVE-ACTIVITY-SELECTOR(s, f, m, n)',zh:''},
        {n:6,code:'else return ∅',zh:''}],
      vars:[{name:'k',meaning:'上一个被选中的活动'}],
      note:'★ 初始调用 RECURSIVE-ACTIVITY-SELECTOR(s, f, 0, n)，其中虚拟活动 $a_0$ 的 $f_0 = 0$。C 程序 part 2 实测两版结果相同。'}]},
   {type:'visualize',title:'贪心的代价曲线',panels:[
     {title:'贪心 $\\Theta(n\\lg n)$ vs DP $\\Theta(n^3)$（同一问题）',viz:'growth',
      chart:{xMax:64,series:[
       {name:'贪心 + 排序 ≈ n lg n',expr:'n * Math.log2(n)',color:'--viz-done'},
       {name:'DP ≈ n³ / 64',expr:'n * n * n / 64',color:'--viz-violation'}]},
      note:'★ $n = 11$ 时贪心只做 10 次比较（C 程序 part 5）；$n$ 越大差距越悬殊 —— 这就是"发现贪心"的价值。'},
    ],tasks:['对照 C 程序 part 1–part 3：贪心结果与暴力枚举的最优解都是 4 个活动。'],note:''},
   {type:'code',title:'实测：{a1,a4,a8,a11} 与暴力验证',c:{file:'activity_selection.c',code:String.raw`/* activity_selection.c -- 15.1: 活动选择 GREEDY-ACTIVITY-SELECTOR。
 * 数据：原书 Figure 15.1 的 11 个活动（按结束时间已排序）
 * 关键数字：贪心选出 {a1, a4, a8, a11}，共 4 个；暴力枚举 2^11 个子集独立验证最大值也是 4。
 * 另附习题 15.1-3 的反例：按"最早开始时间"选会退化。 */
#include <assert.h>
#include <stdio.h>

#define N 11

/* Figure 15.1：a1..a11 的 s 与 f（下标 1..N） */
static const int s[N + 1] = {0, 1, 3, 0, 5, 3, 5, 6, 7, 8, 2, 12};
static const int f[N + 1] = {0, 4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};

static int selected[N + 1];

/* GREEDY-ACTIVITY-SELECTOR（7 行直译；输入已按结束时间升序） */
static int greedy_activity_selector(int *out)
{
    int cnt = 0;
    int k = 1;                                   /* 行 2：k = 1 */
    out[cnt++] = 1;                              /* 行 1：A = {a1} */
    for (int m = 2; m <= N; m++) {               /* 行 3 */
        if (s[m] >= f[k]) {                      /* 行 4：a_m 是否与 a_k 相容？ */
            out[cnt++] = m;                      /* 行 5 */
            k = m;                               /* 行 6 */
        }
    }
    return cnt;                                  /* 行 7 */
}

/* 两个半开区间是否相交（[s_a, f_a) 与 [s_b, f_b)） */
static int i_conflicts(int sa, int fa, int sb, int fb)
{
    return sa < fb && sb < fa;
}

/* RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n)：递归版本，结果个数应与贪心一致 */
static int rec_activity_selector(int k, int n, int *out, int cnt)
{
    int m = k + 1;                               /* 行 1 */
    while (m <= n && s[m] < f[k]) { m = m + 1; } /* 行 2–3 */
    if (m <= n) {                                /* 行 4 */
        out[cnt++] = m;                          /* 行 5：把 a_m 并进答案 */
        return rec_activity_selector(m, n, out, cnt);
    }
    return cnt;                                  /* 行 6 */
}

/* 独立验证：暴力枚举全部 2^11 个子集，求最大相容子集大小 */
static int brute_force_max(void)
{
    int best = 0;
    for (int mask = 0; mask < (1 << N); mask++) {
        int ok = 1, cnt = 0, last_f = 0;
        for (int i = 1; i <= N && ok; i++) {
            if (!(mask & (1 << (i - 1)))) { continue; }
            if (s[i] < last_f) { ok = 0; break; }   /* 与上一个选中活动冲突 */
            last_f = f[i];
            cnt++;
        }
        if (ok && cnt > best) { best = cnt; }
    }
    return best;
}

/* 习题 15.1-3 的反例：按"最早开始时间"贪心
 * 规则：在尚未被排除的活动里挑开始时间最早的那个，然后排除与它冲突的全部活动。 */
static int earliest_start_greedy(const int *st, const int *ft, int n, int *out)
{
    int avail[N + 1];
    for (int i = 1; i <= n; i++) { avail[i] = 1; }
    int cnt = 0;
    while (1) {
        int pick = -1;
        for (int i = 1; i <= n; i++) {
            if (!avail[i]) { continue; }
            if (pick < 0 || st[i] < st[pick]) { pick = i; }   /* 开始时间最早者胜出 */
        }
        if (pick < 0) { break; }
        out[cnt++] = pick;
        avail[pick] = 0;
        for (int j = 1; j <= n; j++) {
            if (i_conflicts(st[pick], ft[pick], st[j], ft[j])) { avail[j] = 0; }
        }
    }
    return cnt;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：贪心 = {a1, a4, a8, a11} */
    int cnt = greedy_activity_selector(selected);
    printf("part 1: 贪心选出的活动 = {");
    for (int i = 0; i < cnt; i++) { printf("a%d%s", selected[i], i + 1 < cnt ? ", " : ""); }
    printf("}，共 %d 个\n", cnt);
    assert(cnt == 4 && selected[0] == 1 && selected[1] == 4
           && selected[2] == 8 && selected[3] == 11);

    /* part 2：递归版本给出同一组答案 */
    {
        int rec[N + 1];
        int rc = rec_activity_selector(0, N, rec, 0);
        printf("part 2: 递归版本（含虚拟活动 a0，f0 = 0）= {");
        for (int i = 0; i < rc; i++) { printf("a%d%s", rec[i], i + 1 < rc ? ", " : ""); }
        printf("}，共 %d 个 —— 与迭代版本一致\n", rc);
        assert(rc == cnt);
        for (int i = 0; i < rc; i++) { assert(rec[i] == selected[i]); }
    }

    /* part 3：独立验证 —— 暴力枚举全部子集 */
    {
        int best = brute_force_max();
        printf("part 3: 暴力枚举 2^11 = %d 个子集，最大相容子集 = %d 个\n", 1 << N, best);
        assert(best == cnt);
        printf("        贪心确实取到最优 —— 这不是巧合，而是 Theorem 15.1（最早结束者可选）保证的。\n");
    }

    /* part 4：为什么不能按"最早开始"选（习题 15.1-3 的构造） */
    {
        /* 三个活动：长活动 a1=[0,6] 最早开始，但它挡住了 a2=[1,4] 与 a3=[4,7] */
        static const int st[4] = {0, 0, 1, 4};
        static const int ft[4] = {0, 6, 4, 7};
        int out[4];
        int c1 = earliest_start_greedy(st, ft, 3, out);
        printf("part 4: 反例 —— 活动 [0,6]、[1,4]、[4,7]：\n");
        printf("        按最早开始贪心只选到 %d 个（选了 [0,6] 就被挡住）\n", c1);
        printf("        而最优是 [1,4] + [4,7] = 2 个\n");
        assert(c1 == 1);
        printf("        ★ 关键差别：最早结束（f 最小）才是安全的贪心选择。\n");
    }

    /* part 5：运行时间 —— 排序后 Θ(n) */
    printf("part 5: GREEDY-ACTIVITY-SELECTOR 只扫一遍：n = %d 时 10 次比较；\n", N);
    printf("        加上预排序 O(n lg n)，总时间 Θ(n lg n)。DP 版本要 Θ(n^3)（习题 15.1-1）。\n");

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明关键数字：贪心 4 个活动，暴力枚举也确认最优是 4 个。'},
           {line:17,zh:'`greedy_activity_selector`：7 行直译，一次扫描 $\\Theta(n)$。'},
           {line:38,zh:'`rec_activity_selector`：递归版本（第 1–6 行）。'},
           {line:50,zh:'`brute_force_max`：**独立验证** —— 枚举全部 $2^{11}$ 个子集。'},
           {line:68,zh:'`earliest_start_greedy`：习题 15.1-3 的反例贪心（按最早开始）。'},
           {line:95,zh:'★★ part 1：输出 $\\{a_1,a_4,a_8,a_{11}\\}$，与原文 p.418 逐字一致。'},
           {line:115,zh:'★★ part 3：暴力枚举 2048 个子集 → 最大也是 4 个（贪心确实最优）。'},
           {line:127,zh:'★★ part 4：最早开始的反例只能选 1 个，而最优 2 个 —— 贪心选择必须选对。'}]},
    tests:[{in:'Figure 15.1 的 11 个活动',out:'$\\{a_1,a_4,a_8,a_{11}\\}$（4 个）'},
           {in:'暴力枚举全部 2048 个子集',out:'最大相容子集 = 4 个（独立验证）'},
           {in:'反例 [0,6] [1,4] [4,7]',out:'最早开始贪心 1 个 vs 最优 2 个'}],
    mapping:[{pc:4,pcCode:'if s_m ≥ f_k',c:'`if (s[m] >= f[k])`（第 23 行）'},
             {pc:6,pcCode:'k = m',c:'`k = m;`（第 25 行）'}]},
   {type:'analyze',title:'一本账：为什么贪心够用',claims:[
     {expr:'\\Theta(n)',when:'贪心选择的时间（已排序时的一次扫描）',page:424,source:'book'},
     {expr:'\\Theta(n^3)',when:'活动选择的 DP 解法（习题 15.1-1 要求的 $c[i,j]$ 递推）',page:419,source:'book'},
     {expr:'\\Theta(n\\lg n)',when:'含预排序的总时间',page:424,source:'book'},
    ],tables:[{caption:'贪心 vs DP：同一问题的两条路线',rows:[
      ['','DP（14 章思路）','贪心（15 章）'],
      ['子问题','$S_{ij}$（区间，$\\Theta(n^2)$ 个）','$S_k$（后缀，一个）'],
      ['每步决策','枚举 $a_k$ 试所有可能','只取结束最早者'],
      ['时间','$\\Theta(n^3)$','$\\Theta(n\\lg n)$'],
      ['需要证明什么','最优子结构','最优子结构 **+** 贪心选择性质'],
      ['C 程序实测','—','4 个活动（暴力枚举一致）'],
     ]}],chart:{xMax:40,series:[
     {name:'贪心：n lg n',expr:'n * Math.log2(n)',color:'--viz-done'},
     {name:'DP：n³ / 64',expr:'n * n * n / 64',color:'--viz-violation'},
     {name:'暴力：2^n / 4096',expr:'Math.pow(2, n) / 4096',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'为什么最早结束者是安全的',steps:[
      {zh:'设 $S_k$ 是"在 $a_k$ 结束后开始"的活动集合，$a_m$ 是其中结束最早者。'},
      {zh:'任取 $S_k$ 的一个最大解 $A$，设其首个活动为 $a_j$：因为 $f_m \\le f_j$，把 $a_j$ 换成 $a_m$ 不会与 $A$ 的其余活动冲突。'},
      {tex:'|A \\setminus \\{a_j\\} \\cup \\{a_m\\}| = |A|',zh:'★ 所以存在包含 $a_m$ 的最优解（定理 15.1）。C 程序 part 3 用暴力枚举验证了这条结论的实例。'}]},
     ],
    note:''},
   {type:'prove',title:'定理 15.1：最早结束者一定可选',statement:'Consider any nonempty subproblem S k , and let a m be an activity in S k with the earliest finish time. Then a m is included in some maximum-size subset of mutually compatible activities of S k .',page:421,
    intro:'★ 这是本章第一个贪心正确性证明，套路是**交换论证**（exchange argument）。',
    steps:[
     {title:'设出最优解与它的首个活动',en:'One big question remains: Is this intuition correct? Is the greedy choice\u2014in which you choose the first activity to finish\u2014always part of some optimal solution?',page:420,
      body:['把活动按结束时间排好序，于是 $f_1 \\le f_2 \\le \\cdots \\le f_n$，$a_1$ 结束最早。',
        '设 $S_k$ 非空，$a_m$ 是其中结束最早者；设 $A$ 是 $S_k$ 的一个**最大**相容子集。',
        '若 $a_m \\in A$ 则已证；否则设 $A$ 中最早结束的活动是 $a_j$。']},
     {title:'交换：把 a_j 换成 a_m',en:'This way of characterizing optimal substructure suggests that you can solve the activity-selection problem by dynamic programming.',page:419,
      body:['因为 $a_m$ 是 $S_k$ 中结束最早者，所以 $f_m \\le f_j$。',
        '$A$ 里其余活动都满足 $s \\ge f_j \\ge f_m$ —— 说明它们与 $a_m$ **也**相容。',
        '于是 $A^{\\prime} = (A \\setminus \\{a_j\\}) \\cup \\{a_m\\}$ 仍是相容子集，且 $|A^{\\prime}| = |A|$（仍是最大）。',
        '★ 关键：交换不会减少大小，也不破坏相容性 —— 这就是"贪心选择安全"的含义。∎']},
     {title:'实测与独立验证',en:'Like the recursive version, GREEDY-ACTIVITY-SELECTOR schedules a set of n activities in \u0398(n) time, assuming that the activities were already sorted initially by their finish times.',page:424,
      body:['C 程序 part 1：贪心得到 $\\{a_1,a_4,a_8,a_{11}\\}$，4 个活动。',
        'C 程序 part 3：暴力枚举 $2^{11} = 2048$ 个子集，最大相容子集也 = 4 —— 与贪心一致。',
        '★ 注意定理只保证"**存在**一个包含 $a_m$ 的最优解"，而贪心每一步都做这样的选择，所以最终得到的就是最优解。∎']},
    ],conclusion:'★ 结论：贪心选择性质成立 → 每步只需考虑一个选择 → $\\Theta(n\\lg n)$（含排序）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'活动选择的贪心策略是？',options:['选开始时间最早的','选**结束时间**最早的','选持续时间最短的','选与其他活动冲突最少的'],answer:1,
      why:'★ 定理 15.1：最早结束的活动一定属于某个最优解。C 程序 part 4 给出了"最早开始"失效的反例。'},
     {kind:'single',q:'输入已按结束时间排序时，GREEDY-ACTIVITY-SELECTOR 的时间是？',options:['$\\Theta(n^2)$','$\\Theta(n)$','$\\Theta(n\\lg n)$','$\\Theta(n^3)$'],answer:1,
      why:'★ 只有一次 for 循环（第 3–6 行）—— $\\Theta(n)$；含排序则 $\\Theta(n\\lg n)$。'},
     {kind:'judge',q:'活动选择问题必须用动态规划才能求最优解。',answer:false,
      why:'★ 贪心就够（$\\Theta(n\\lg n)$）；DP 也对（$\\Theta(n^3)$，习题 15.1-1），只是慢得多。'},
     {kind:'judge',q:'贪心的正确性靠"交换论证"：把最优解里的某个选择换成贪心选择，解不会变差。',answer:true,
      why:'★ 本关定理 15.1 的证明就是这个套路。'},
     {kind:'simulate',q:'Figure 15.1 的 11 个活动上，贪心能选出几个活动？（填数字）',expect:[4],placeholder:'例如：3',
      why:'$\\{a_1,a_4,a_8,a_{11}\\}$ —— 4 个（原书 p.418 + C 程序 part 1）。'},
     {kind:'simulate',q:'暴力枚举 $2^{11}$ 个子集后，最大相容子集是几个？',expect:[4],placeholder:'例如：5',
      why:'也是 4 —— C 程序 part 3 实测，与贪心一致。'},
    ],bookExercises:[
     {id:'15.1-1',page:424,star:0,statement:'Give a dynamic-programming algorithm for the activity-selection problem, based on recurrence (15.2). Have your algorithm compute the sizes c[i,j] as defined above and also produce the maximum-size subset of mutually compatible activities.',hint:'题干指定照**递推 (15.2)** 来做，而 (15.2) 是对 $S_{ij}$ 里**所有** $a_k$ 取最大值： $c[i,j] = \\max_{a_k \\in S_{ij}} \\{c[i,k] + c[k,j] + 1\\}$（$S_{ij}$ 空则为 0）。 表项 $\\Theta(n^2)$ 个、每项枚举 $O(n)$ 个 $k$ → $\\Theta(n^3)$。 「只枚举一个 $k$（结束最早者）」是**贪心**的选择，不是动态规划 —— 原书 p.419 那段说明讲的正是反面： 不知道最优解含哪个 $a_k$ 时，就得把 $S_{ij}$ 里每个都试一遍。要复原方案就另存一张 $s[i,j]$ 表记取到的 $k$， 最后递归打印。'},
     {id:'15.1-2',page:425,star:0,statement:'Suppose that instead of always selecting the first activity to finish, you instead select the last activity to start that is compatible with all previously selected activi- ties. Describe how this approach is a greedy algorithm, and prove that it yields an optimal solution.',hint:'对称论证：把时间轴翻转（$s^{\\prime} = -f$、$f^{\\prime} = -s$），"最后开始"就变成"最早结束"，于是同一套交换论证照搬 —— 结论同样最优。'},
     {id:'15.1-3',page:425,star:0,statement:'Not just any greedy approach to the activity-selection problem produces a max- imum-size set of mutually compatible activities. Give an example to show that the approach of selecting the activity of least dur ation from among those that are compatible with previously selected activities does not work. Do the same for the approaches of always selecting the compatible activity that overlaps the fewest other remaining activities and always selecting the compatible remaining activity with the earliest start time.',hint:'C 程序 part 4 就构造了一个：[0,6]（最早开始）、[1,4]、[4,7] —— 按最早开始选只得 1 个，而 [1,4]+[4,7] 是 2 个。要点是最早开始者可能又长又早，把后面全挡住。'},
     {id:'15.1-4',page:425,star:0,statement:'You are given a set of activities to schedule among a large number of lecture halls, where any activity can take place in any lecture hall. You wish to schedule all the activities using as few lecture halls as possible. Give an efficient greedy algorithm to determine which activity should use which lecture hall. (This problem is also known as the interval-graph coloring problem. It is mod- eled by an interval graph whose vertices are the given activities and whose edges connect incompatible activities. The smallest number of colors required to color every vertex so that no two adjacent vertices have the same color corresponds to finding the fewest lecture halls needed to schedule all of the given activities.)',hint:'这是**区间图着色**：所需最少教室数 = 任意时刻同时进行的活动数最大值。扫描端点：开始 +1、结束 −1，取历史最大值即可（贪心的另一种用法）。'},
     {id:'15.1-5',page:425,star:0,statement:'Consider a modification to the activity-selection problem in which each activity a i has, in addition to a start and finish time, a value v i . The objective is no longer to maximize the number of activities scheduled, but instead to maximize the total value of the activities scheduled. That is, the goal is to choose a set A of compatible activities such that P a k 2A v k is maximized. Give a polynomial-time algorithm for this problem.',hint:'带权时贪心失效（要回到 DP：$c[i,j] = \\max(c[i,k]+c[k,j]+v_k)$ 或按结束时间 DP）。可以构造反例：一个高价值的长活动 vs 两个低价值短活动。'},
    ]},
  ],
};
