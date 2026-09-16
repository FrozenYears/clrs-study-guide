/* 第 5 章 5.4.3：连续正面（Streaks）。原文锚点：印刷页 144–150。 */

export default {
  key: 's06', id: 'ch05/s06', chapter: 5, section: '5.4',
  title: '连续正面：最长连胜的期望是 Θ(lg n)', shortTitle: '5.4.3 连续正面',
  titleEn: 'Streaks',
  source: { printed: [144, 150], pdf: [165, 171] },
  sourceNote: '本关对应原书 5.4.3 节（印刷页 144–150）。本节数学密集，上界与下界两半都有大量带馅求和，分段器切成了许多十来字符的小块，因此可用的长引述较少，已在阶段 3 中逐条标注页码与省略。',
  prerequisites: [{ label: '5.4.1 生日悖论（s04）', url: '#/ch05/s04' }],
  stages: [
    { type: 'map', title: '把「最长连续正面」的期望钉在 Θ(lg n)',
      why: '抛 n 次公平硬币，最长连续正面有多长？这个问题把指示器、布尔不等式、切块独立三件套用到了极致，也是 Θ 记号在概率里的经典亮相。',
      position: '5.2 用指示器算期望；本关把同一工具升级到「随机序列里的连续段」；结论 Θ(lg n) 会反复出现在随机算法的分析中。',
      unlocks: [{ label: '5.4 下一段（s07）', url: '#/ch05/s07' }],
      mathKit: [
        { title: '指示器', body: '事件 $A$ 发生时 $I_A=1$，否则为 $0$；其期望等于事件发生的概率。' },
        { title: '布尔不等式', body: '任意有限个事件的并集概率不超过各事件概率之和：$\\text{Pr}(\\text{至少一个 }A_i)\\le\\sum_i\\text{Pr}(A_i)$。' },
        { title: '尾界 $1+x\\le e^x$', body: '对任意实数 $x$ 有 $1+x\\le e^x$；用它把连乘折成指数，方便估计「全部失败」的概率。' },
      ],
    },
    { type: 'intuition', title: '抛硬币，记你的最长连胜', scene: '你连续抛一枚公平硬币，每当正面就给连胜 +1，翻到反面就清零；你关心整局结束时的「最长连胜」是多少。',
      body: [
        '直觉上 n 翻倍，你可能会以为最长连胜也翻倍。但真实情况是：n 从 16 翻到 32，最长连胜只从大约 3 长到大约 4——只多了约 1。',
        '原因很朴素：连胜 k 次的概率是 $1/2^k$。只要 k 比 $\\lg n$ 大一点点，整局里「出现这么长一段」的概率就骤降到很小，于是期望被卡在 $\\Theta(\\lg n)$。',
      ],
      interactive: { text: '阶段 5 的动画让你亲手走一遍序列，看着 best 只在破纪录时跳动；阶段 7 的曲线把「n 翻倍、best 只 +1」画了出来。' },
    },
    { type: 'source', title: '书上是怎么说的', lead: '原文保留 PDF 抽取后的记号：花括号写作 f…g、等号写作 D、下标写作 A i、省略号写作 …。中文解读只负责把每一步连起来，并点出易错处。',
      blocks: [
        { kind: 'body', page: 144,
          en: 'Suppose that you flip a fair coin n times. What is the longest streak of consecutive heads that you expect to see? We\u2019ll prove upper and lower bounds separately to show that the answer is \u0398(lg n).',
          zh: '★ 全节的结论就这一句：最长连续正面（streak）的期望是 $\\Theta(\\lg n)$，且原书**分上界与下界两半分别证明**。别把 $\\Theta$ 当成某一侧的界。' },
        { kind: 'body', page: 145,
          en: 'We first prove that the expected length of the longest streak of heads is O(lg n).',
          zh: '★ 先证上界 $O(\\lg n)$：原书取 $k=2\\lceil\\lg n\\rceil$，用布尔不等式把「所有起点」的概率加起来，得到期望不超过 $O(\\lg n)$。' },
        { kind: 'body', page: 145,
          en: 'The probability that each coin flip is a head is 1/2. Let A i k be the event that a streak of heads of length at least k begins with the i th coin flip or, more precisely, the event that the k consecutive coin flips i,i + 1,\u2026,i + k \u2212 1 yield only heads, where 1 \u2264 k \u2264 n and 1 \u2264 i \u2264 n \u2212k + 1.',
          zh: '★ 这是全节的枢纽定义：$A_{i,k}$ 表示「从第 $i$ 次起连续 $k$ 次都是正面」。因为每次抛掷独立，$\\text{Pr}(A_{i,k})=1/2^k$。注意下标范围 $1\\le i\\le n-k+1$——起点不能太靠后，否则摆不下 $k$ 次。' },
        { kind: 'body', page: 145,
          en: 'Pr fA i,2dlg ne g (by Boole\u2019s inequality (C.21) on page 1190)',
          zh: '★ 代入 $k=2\\lceil\\lg n\\rceil$ 后，单点概率 $1/2^{2\\lceil\\lg n\\rceil}\\le 1/n^2$；原书直接点明这里用布尔不等式（Boole\u2019s inequality）把各起点的事件并起来。语料把花括号写作 f…g、$\\lceil\\lg n\\rceil$ 写作 dlg ne。' },
        { kind: 'body', page: 147,
          en: 'Let\u2019s now prove a complementary lower bound: \u2026 To prove this bound, we look for streaks of length s by partitioning the n flips into approximately n/s groups of s flips each. If we choose s = \u230a(lg n)/2\u230b, we\u2019ll see that it is likely that at least one of these groups comes up all heads, which means that it\u2019s likely that the longest streak has length at least s = \u03a9(lg n). We\u2019ll then show that the longest streak has expected length \u03a9(lg n).',
          zh: '★ 下界 $\\Omega(\\lg n)$ 走另一条路：把 $n$ 次抛掷切成约 $n/s$ 段、每段长 $s$ 的**互不相交**块（原书取 $s=\\lfloor(\\lg n)/2\\rfloor$），只要有一段全正面就说明最长连胜至少 $s$。语料开头把 $\\Omega(\\lg n)$ 抽成了 ].lg n/.，已用 … 跨过。' },
        { kind: 'body', page: 147,
          en: 'Let\u2019s partition the n coin flips into at least \u2026 groups of \u230a(lg n)/2\u230b consecutive flips and bound the probability that no group comes up all heads. By equation (5.9), the probability that the group starting in position i comes up all heads is Pr fA i,\u230a(lg n)/2\u230b g = 1',
          zh: '★ 各块由互不相交、相互独立的抛掷组成，所以「某块全正面」的概率是 $1/2^s$（语料把 $1/2^{\\lfloor(\\lg n)/2\\rfloor}$ 抽成了「= 1」加下一行的 $2^{\\dots}$，此处用 … 跨过中间的乱码）。块数约为 $\\lfloor n/\\lfloor(\\lg n)/2\\rfloor\\rfloor$。' },
        { kind: 'body', page: 148,
          en: 'For this argument, we used inequality (3.14), 1 + x \u2264 e x , on page 66 and the fact, which you may verify, that .2n= lg n \u2212 1/= \u221an \u2265 ln n for sufficiently large n.',
          zh: '★ 关键一步：用尾界 $1+x\\le e^x$ 把「所有块都失败」的概率折成 $e^{-\\lfloor n/s\\rfloor/\\sqrt{n}}$；再代入 $s=\\lfloor(\\lg n)/2\\rfloor$ 得到指数里的系数 $\\ge\\ln n$，于是全失败概率 $=O(1/n)$。语料把 $\\le$ 写作 $\\le$、$\\sqrt{n}$ 写作 \u221an、$\\ge$ 写作 $\\ge$。' },
        { kind: 'body', page: 149,
          en: 'If c is large, the expected number of streaks of length c lg n is small, and we conclude that they are unlikely to occur. On the other hand, if c = 1/2, then we obtain E [X .1/2/ lg n ] = \u0398(1/n 1/2\u22121 ) = \u0398(n 1/2 ), and we expect there to be numerous streaks of length .1/2/ lg n. Therefore, one streak of such a length is likely to occur. We can conclude that the expected length of the longest streak is \u0398(lg n).',
          zh: '★ 收尾：用指示器 $X_{i,k}=I\\{A_{i,k}\\}$ 数「长度至少 $k$ 的连续段」的个数。当 $k=c\\lg n$ 时，期望个数约为 $n^{1-c}$；取 $c=1/2$ 时它很大，说明「出现一段长约 $\\frac12\\lg n$ 的正面」很可能发生，从而合起来仍是 $\\Theta(\\lg n)$。' },
      ],
      terms: [
        { en: 'streak', zh: '连续段 / 连续正面', page: 144 },
        { en: 'Boole\u2019s inequality', zh: '布尔不等式', page: 145 },
        { en: 'mutually independent', zh: '相互独立', page: 145 },
        { en: 'indicator random variable', zh: '指示器随机变量', page: 149 },
        { en: 'linearity of expectation', zh: '期望的线性', page: 149 },
      ] },
    { type: 'pseudocode', title: '教学整理：边走边记最长连续正面', algo: 'LONGEST-STREAK', signature: 'LONGEST-STREAK(flips, n)', page: 145,
      lines: [
        { n: 1, code: 'best = 0', zh: '最长连续正面的当前纪录，初始为 0。' },
        { n: 2, code: 'cur = 0', zh: '从当前位置往前数的连续正面长度，初始为 0。' },
        { n: 3, code: 'for i = 1 to n', zh: '从第 1 次抛到第 n 次，逐次扫描（动画里 i 从 1 开始）。' },
        { n: 4, code: 'if flip(i) = H', zh: '如果第 i 次是正面（H）。' },
        { n: 5, code: 'cur = cur + 1', zh: '连续长度加 1。' },
        { n: 6, code: 'else cur = 0', zh: '否则（翻到反面 T）当前连续长度清零。' },
        { n: 7, code: 'if cur > best', zh: '若刚刷新了连续长度纪录。' },
        { n: 8, code: 'best = cur', zh: '更新最长连续正面纪录。' },
        { n: 9, code: 'return best', zh: '返回整局的最长连续正面长度。' },
      ],
      vars: [
        { name: 'best', meaning: '已经出现过的最长连续正面长度' },
        { name: 'cur', meaning: '从当前位置往前数的连续正面长度' },
        { name: 'flip(i)', meaning: '第 i 次抛掷的结果，H 表示正面、T 表示反面' },
      ],
      note: '这是一份教学整理，不是原书独立的程序伪代码块；原书结论与公式在阶段 3 引述。行号与已注册的生成器 site/assets/algorithms/streaks.js 逐行对应。' },
    { type: 'visualize', title: '看见「边走边记最长连续」', viz: 'array', vizMode: 'cards',
      algorithm: 'streaks', pseudocodeRef: 'LONGEST-STREAK',
      input: { array: [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0] },
      countLabels: { flips: { label: '已抛掷', unit: '次' }, cur: { label: '当前连续正面', unit: '次' }, best: { label: '最长连续正面', unit: '次' } },
      invariants: [
        { label: 'best 始终是已经出现过的最长连续正面长度' },
        { label: 'cur 只在翻到反面时清零' },
      ],
      presets: [
        { name: 'n = 16，最长连续 3', array: [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0] },
        { name: 'n = 32，含一段至少 5 连正面', array: [0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1] },
        { name: 'n = 32，全都是短段（对照）', array: [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1] },
      ],
      tasks: [
        '把 n = 16 的序列走完，读出 best 的最终值，并确认它等于真实的最长连续正面。',
        '对比 n = 16 与 n = 32 两组预设，最长连续正面各是多少？n 翻倍后它只增加了约多少？',
        '为什么「n 翻倍、best 只增加约 1」？结合阶段 7 的曲线与 $\\Theta(\\lg n)$ 结论解释。',
      ] },
    { type: 'code', title: '用 C 蒙特卡洛验证：期望 ≈ lg n', intro: '程序自带 64 位线性同余随机数发生器（不依赖 rand()），对多组 n 做蒙特卡洛，测「n 次抛掷中最长连续正面的经验均值」，并验证它随 n 增长近似 lg n、且 n 翻倍时均值只增加约 1。',
      pseudocodeRef: 'LONGEST-STREAK',
      c: {
        file: 'streaks.c',
        code: String.raw`/* streaks.c -- 5.4.3 连续正面（Streaks）的蒙特卡洛数值验证。
 *
 * 书中约定：教学伪代码 LONGEST-STREAK 的下标从 1 开始，
 * 即 flip(i) 表示「第 i 次抛掷」；C 数组下标从 0 开始。
 * 因此 flips[0] 对应书中的 flip(1)，遍历 i = 0 .. n-1，
 * 对应关系为 flips[i] <-> flip(i+1)。
 *
 * 本程序不依赖标准库的 rand()，而是自带一个 64 位线性同余发生器（LCG），
 * 这样结果可复现，也不会因平台实现不同而产生差异。
 */

#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

/* ---- 自带的 64 位 LCG 伪随机数发生器 ---- */
static unsigned long long g_state = 88172645463325252ULL;

static void lcg_seed(unsigned long long seed)
{
    g_state = seed ? seed : 88172645463325252ULL;
}

/* 返回 [0, 2^64) 上的均匀整数 */
static unsigned long long lcg_next(void)
{
    g_state = g_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return g_state;
}

/* 生成一次公平抛硬币：返回 1（正面 H）或 0（反面 T） */
static int flip_once(void)
{
    return (int)(lcg_next() >> 63);
}

/* ---- 与伪代码 LONGEST-STREAK 对应的 C 实现 ----
 * 输入 flips[0..n-1]，1 = 正面（H），0 = 反面（T）。
 * 返回最长连续正面的长度。
 * 伪代码行号与本站阶段 4 一一对应：
 *   1 best = 0            -> int best = 0;
 *   2 cur = 0             -> int cur = 0;
 *   3 for i = 1 to n      -> for (int i = 0; i < n; i++)
 *   4 if flip(i) = H      -> if (flips[i] == 1)
 *   5 cur = cur + 1       -> cur = cur + 1;
 *   6 else cur = 0        -> cur = 0;
 *   7 if cur > best       -> if (cur > best)
 *   8 best = cur          -> best = cur;
 *   9 return best         -> return best;
 */
static int longest_streak(const int *flips, int n)
{
    int best = 0;
    int cur = 0;
    for (int i = 0; i < n; i++) {
        if (flips[i] == 1) {
            cur = cur + 1;
        } else {
            cur = 0;
        }
        if (cur > best) {
            best = cur;
        }
    }
    return best;
}

/* 用 LCG 生成 n 次抛掷，写入调用方已分配的 flips 数组 */
static void generate_flips(int *flips, int n)
{
    for (int i = 0; i < n; i++) {
        flips[i] = flip_once();
    }
}

/* 蒙特卡洛：做 trials 次试验，返回最长连续正面的经验均值 */
static double monte_carlo_mean(int n, long trials)
{
    double sum = 0.0;
    int *flips = NULL;
    if (n > 0) {
        flips = (int *)malloc((size_t)n * sizeof(int));
    }
    for (long t = 0; t < trials; t++) {
        generate_flips(flips, n);
        sum += (double)longest_streak(flips, n);
    }
    if (flips != NULL) {
        free(flips);
    }
    return sum / (double)trials;
}

/* 断言：经验均值落在 log2(n) 附近的合理区间（即 Θ(lg n) 的数值体现）。
 * 已知 E[最长连续正面] ≈ lg n − 2/3，下面给一个宽松但非平凡的界。 */
static void check_growth(int n, long trials)
{
    double mean = monte_carlo_mean(n, trials);
    double lg = log2((double)n);
    assert(mean > lg - 2.5);
    assert(mean < lg + 0.8);
    printf("  n = %5d  lg n = %6.2f  经验均值 = %6.3f  (差 %+.3f)\n",
           n, lg, mean, mean - lg);
}

int main(void)
{
    const int ns[] = {16, 32, 64, 128, 256, 512, 1024, 2048, 4096};
    const int m = (int)(sizeof(ns) / sizeof(ns[0]));
    const long trials = 100000L;

    lcg_seed(123456789ULL);

    printf("5.4.3 Streaks —— 最长连续正面的期望 ≈ lg n（蒙特卡洛验证）\n");
    printf("每组试验次数 = %ld\n\n", trials);
    printf("%-8s %-10s %-12s %s\n", "n", "lg n", "经验均值", "与 lg n 之差");

    for (int i = 0; i < m; i++) {
        check_growth(ns[i], trials);
    }

    /* 验证「n 翻倍，最长段只增加约 1」：比较相邻两组的经验均值 */
    printf("\n翻倍检查（相邻 n 的均值差应接近 1）：\n");
    for (int i = 1; i < m; i++) {
        double a = monte_carlo_mean(ns[i - 1], trials);
        double b = monte_carlo_mean(ns[i], trials);
        printf("  n=%d -> n=%d : 均值 %+.3f -> %+.3f （差 %+.3f）\n",
               ns[i - 1], ns[i], a, b, b - a);
        assert(b - a > 0.4 && b - a < 1.6);
    }

    /* 验证「n 不同但 ⌊lg n⌋ 相同，经验均值接近」：
     * n=1000 与 n=1500 的 ⌊lg n⌋ 都是 9，期望应相近。 */
    printf("\n同 ⌊lg n⌋ 检查（n=1000 与 n=1500）：\n");
    {
        double m1 = monte_carlo_mean(1000, trials);
        double m2 = monte_carlo_mean(1500, trials);
        printf("  n=1000 均值 %.3f, n=1500 均值 %.3f（差 %.3f）\n", m1, m2, m1 - m2);
        assert(fabs(m1 - m2) < 1.0);
    }

    printf("\nstreaks.c 全部检查通过。\n");
    return 0;
}
`,
        notes: [
          { line: 1, zh: '文件头用中文说明：书中伪代码下标从 1 开始，C 从 0 开始，flips[i] 对应 flip(i+1)。' },
          { line: 55, zh: 'longest_streak 与伪代码 LONGEST-STREAK 逐行对应（见阶段 4）。' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'best = 0', c: '`int best = 0;` 初始化最长纪录。' },
        { pc: 2, pcCode: 'cur = 0', c: '`int cur = 0;` 初始化当前连续长度。' },
        { pc: 3, pcCode: 'for i = 1 to n', c: '`for (int i = 0; i < n; i++)`：C 下标从 0，故遍历 0..n-1。' },
        { pc: 4, pcCode: 'if flip(i) = H', c: '`if (flips[i] == 1)`：1 表示正面 H。' },
        { pc: 5, pcCode: 'cur = cur + 1', c: '`cur = cur + 1;` 连续长度加 1。' },
        { pc: 6, pcCode: 'else cur = 0', c: '`cur = 0;` 翻到反面则清零。' },
        { pc: 7, pcCode: 'if cur > best', c: '`if (cur > best)`：判断是否破纪录。' },
        { pc: 8, pcCode: 'best = cur', c: '`best = cur;` 更新纪录。' },
        { pc: 9, pcCode: 'return best', c: '`return best;` 返回结果。' },
      ] },
    { type: 'analyze', title: '上界 O(lg n)、下界 Ω(lg n)，合起来 Θ(lg n)', intro: '上界走「布尔不等式把各起点并起来」一路（p145–147），下界走「切块独立 + 指示器 + 1+x≤e^x」一路（p147–150）。两条路夹出 Θ(lg n)。',
      claims: [
        { expr: 'O(\\lg n)', when: '最长连续正面的期望上界', page: 145, source: 'book' },
        { expr: '\\Omega(\\lg n)', when: '最长连续正面的期望下界', page: 147, source: 'book' },
        { expr: '\\Theta(\\lg n)', when: '合起来：期望最长连续正面', page: 149, source: 'book' },
      ],
      tables: [
        { caption: '两路对照', rows: [
          ['路线', '关键工具', '结论'],
          ['上界', '布尔不等式（Boole）', '期望 $\\le O(\\lg n)$'],
          ['下界', '切块独立 + $1+x\\le e^x$', '期望 $\\ge \\Omega(\\lg n)$'],
          ['合起来', '上下界夹逼', '期望 $=\\Theta(\\lg n)$'],
        ] },
      ],
      chart: {
        xMax: 256,
        series: [
          { name: 'lg n = log₂ n（理论量级）', expr: 'Math.log2(n)', color: '--viz-done' },
          { name: 'n（对照：增长快得多）', expr: 'n', color: '--viz-compare' },
        ],
      },
      derivations: [
        { kind: 'summation', title: '上界：布尔不等式一路', steps: [
          { tex: '\\text{Pr}(A_{i,2\\lceil\\lg n\\rceil}) = 1/2^{2\\lceil\\lg n\\rceil} \\le 1/n^2', zh: '取 $k=2\\lceil\\lg n\\rceil$，单一起点出现这么长一段正面的概率是 $1/2^k$，被 $1/n^2$ 压住。' },
          { tex: '\\text{Pr}(\\text{某处出现}\\ge 2\\lceil\\lg n\\rceil\\text{连正面}) \\le \\sum_{i=1}^{n} \\text{Pr}(A_{i,k})', zh: '★ 用布尔不等式把最多 $n$ 个起点（事件）并起来：并集概率不超过各概率之和。' },
          { tex: '\\le n \\cdot (1/n^2) = 1/n', zh: '于是「出现超过 $2\\lceil\\lg n\\rceil$ 连正面」的概率已不超过 $1/n$，期望被卡在 $O(\\lg n)$。' },
        ] },
        { kind: 'summation', title: '下界：切块独立一路', steps: [
          { tex: '\\text{块数} = \\lfloor n/\\lfloor(\\lg n)/2\\rfloor\\rfloor,\\quad s = \\lfloor(\\lg n)/2\\rfloor', zh: '把 $n$ 次抛掷切成约 $n/s$ 段、每段长 $s$ 的互不相交块。' },
          { tex: '\\text{Pr}(\\text{某块全正面}) = 1/2^s', zh: '每块内部独立，$s$ 次全是正面的概率就是 $1/2^s$。' },
          { tex: '\\text{Pr}(\\text{全失败}) \\le (1 - 1/\\sqrt{n})^{\\lfloor n/s\\rfloor} \\le e^{-\\lfloor n/s\\rfloor/\\sqrt{n}}', zh: '★ 各块独立，全部失败的概率用尾界 $1+x\\le e^x$ 折成指数。' },
          { tex: '\\lfloor n/s\\rfloor/\\sqrt{n} \\ge \\ln n', zh: '代入 $s=\\lfloor(\\lg n)/2\\rfloor$，指数里的系数不小于 $\\ln n$，于是全失败概率 $=O(1/n)$。' },
          { tex: 'E[\\text{最长连胜}] \\ge \\Omega(\\lg n)', zh: '至少一段全正面的概率 $=1-O(1/n)$，期望下界为 $\\Omega(\\lg n)$。' },
        ] },
      ],
      note: '两条路合起来：上界 $O(\\lg n)$ 与下界 $\\Omega(\\lg n)$ 夹出期望 $\\Theta(\\lg n)$。阶段 6 的 C 程序用蒙特卡洛把这条曲线在数值上坐实。' },
    { type: 'prove', kind: 'bounds-squeeze', statement: 'Suppose that you flip a fair coin n times. What is the longest streak of consecutive heads that you expect to see? We\u2019ll prove upper and lower bounds separately to show that the answer is \u0398(lg n).', page: 144,
      title: '上下界夹逼，而不是循环不变量', intro: '这一节没有循环不变量可证：它是对「期望」的上下界论证。三步分别是：① 定义事件 $A_{i,k}$ 并算概率（原书 p145）；② 用布尔不等式给上界（p145）；③ 用切块独立 + 指示器给下界（p147）。引述均逐字取自原书。',
      steps: [
        { title: '第一步 · 定义事件并算概率', en: 'The probability that each coin flip is a head is 1/2. Let A i k be the event that a streak of heads of length at least k begins with the i th coin flip or, more precisely, the event that the k consecutive coin flips i,i + 1,\u2026,i + k \u2212 1 yield only heads, where 1 \u2264 k \u2264 n and 1 \u2264 i \u2264 n \u2212k + 1.', page: 145,
          body: ['定义 $A_{i,k}$ 为「从第 $i$ 次起连续 $k$ 次都是正面」。', '因为每次抛掷相互独立，$\\text{Pr}(A_{i,k})=1/2^k$；这是上界与下界两路共同的起点。'] },
        { title: '第二步 · 布尔不等式给上界', en: 'We first prove that the expected length of the longest streak of heads is O(lg n).', page: 145,
          body: ['取 $k=2\\lceil\\lg n\\rceil$，则单点概率 $\\le 1/n^2$。', '用布尔不等式把最多 $n$ 个起点并起来，得到「出现超过此长度的连续正面」概率 $\\le 1/n$，从而期望上界为 $O(\\lg n)$。'] },
        { title: '第三步 · 切块独立给下界', en: 'Let\u2019s partition the n coin flips into at least \u2026 groups of \u230a(lg n)/2\u230b consecutive flips and bound the probability that no group comes up all heads. By equation (5.9), the probability that the group starting in position i comes up all heads is Pr fA i,\u230a(lg n)/2\u230b g = 1', page: 147,
          body: ['把序列切成约 $n/s$ 段、每段长 $s=\\lfloor(\\lg n)/2\\rfloor$ 的互不相交块，块间独立。', '每块全正面的概率为 $1/2^s$；用 $1+x\\le e^x$ 估计「全部失败」的概率 $=O(1/n)$，于是至少一段全正面很可能发生，期望下界为 $\\Omega(\\lg n)$。'] },
      ],
      conclusion: '上界 $O(\\lg n)$ 与下界 $\\Omega(\\lg n)$ 同时成立，故期望最长连续正面为 $\\Theta(\\lg n)$。' },
    { type: 'drill', title: '检验一下', items: [
        { kind: 'judge', q: '抛 n 次公平硬币，最长连续正面的期望是 Θ(lg n)。', answer: true, why: '原书 5.4.3 上界 O(lg n)、下界 Ω(lg n) 夹逼得到 Θ(lg n)。' },
        { kind: 'single', q: '事件 A_{i,k} 表示「从第 i 次起连续 k 次都是正面」，其概率是？', options: ['1/2', '1/2^k', 'k/2', '1/n'], answer: 1, why: '每次抛掷独立，连续 k 次正面的概率为 $(1/2)^k$。' },
        { kind: 'single', q: '上界 O(lg n) 一路，原书取 k 等于多少来套布尔不等式？', options: ['⌈lg n⌉', '2⌈lg n⌉', '⌊(lg n)/2⌋', 'lg n / 2'], answer: 1, why: '取 $k=2\\lceil\\lg n\\rceil$ 时单点概率 $\\le 1/n^2$，并起来 $\\le 1/n$。' },
        { kind: 'judge', q: '下界 Ω(lg n) 一路需要把 n 次抛掷切成互不相交、相互独立的块。', answer: true, why: '切块后才能对各块用「全正面」概率相乘（独立），再用 1+x≤e^x 折指数。' },
        { kind: 'single', q: '下界一路里，每段长度 s 取多少？', options: ['⌈lg n⌉', '2⌈lg n⌉', '⌊(lg n)/2⌋', 'n/2'], answer: 2, why: '原书取 $s=\\lfloor(\\lg n)/2\\rfloor$，让「至少一段全正面」很可能发生。' },
        { kind: 'judge', q: 'n 翻倍时，最长连续正面的期望大约只增加 1。', answer: true, why: '因为期望量级是 lg n，而 $\\lg(2n)=\\lg n+1$，这正是阶段 5/7 曲线的直观含义。' },
        { kind: 'simulate', q: '在序列 [1,0,1,1,1,0,1,0] 上，LONGEST-STREAK 返回多少？', expect: [3, 3], placeholder: '例如：3', why: '最长连续正面出现在第 3–5 次（三个 1 连在一起），长度为 3。' },
        { kind: 'single', q: '原书把「所有块都失败」的概率折成指数，用的是哪个不等式？', options: ['三角不等式', '1 + x ≤ e^x', '柯西不等式', '马尔可夫不等式'], answer: 1, why: '用尾界 $1+x\\le e^x$ 把 $(1-1/\\sqrt{n})^{\\lfloor n/s\\rfloor}$ 折成 $e^{-\\lfloor n/s\\rfloor/\\sqrt{n}}$。' },
      ],
      bookExercises: [] },
  ],
};
