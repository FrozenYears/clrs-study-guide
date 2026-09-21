/* 第 5 章 5.4.2：球与箱（balls and bins）。原文锚点：印刷页 143–144。 */

export default {
  key: 's05', id: 'ch05/s05', chapter: 5, section: '5.4',
  title: '球与箱：什么时候每个箱子都有球', shortTitle: '5.4.2 球与箱',
  titleEn: 'Balls and bins',
  source: { printed: [143, 144], pdf: [164, 165] },
  sourceNote: '本关对应原书 5.4.2 节（印刷页 143–144）。',
  prerequisites: [{ label: '5.4.1 生日悖论', url: '#/ch05/s04' }],
  stages: [
    { type: 'map', title: '把「随机分配」变成可算的期望值',
      why: '哈希、负载均衡、缓存冲突，本质都是「把 n 个随机对象丢进 b 个槽」——这一关给出这类问题三个最常用期望的闭式答案。',
      position: '5.2 用指示器和线性期望算出平均招聘人数；本关把同一套工具用在「球落入箱子」上，得到二项分布、几何分布与优惠券收集者三个结论；5.4.3 再处理连续正面最长 streak。',
      unlocks: [{ label: '5.4.3 最长 streak', url: '#/ch05/s06' }],
      mathKit: [
        { title: '二项分布', body: '投 $n$ 次、每次成功概率 $p$，成功次数服从 $b(k; n, p)$，期望 $np$。' },
        { title: '几何分布', body: '首次成功所需的试验次数服从参数 $p$ 的几何分布，期望 $1/p$。' },
        { title: '调和数', body: '$H_b=\\sum_{i=1}^b 1/i = \\ln b + O(1)$。' },
      ],
    },
    { type: 'intuition', title: '往一格格鸽棚里随机撒豆子', scene: '你闭着眼把豆子一把把丢进标好号的鸽棚，每个棚被砸中的概率都一样',
      body: ['三个问题立刻浮现：某一格大概会接住几颗？要砸中某个指定的棚，平均得丢几把？要让每个棚都至少接住一颗，又得丢多少把？', '第 5.4.2 节给的就是这三个问题的答案，而且都不需要新工具——指示器和线性期望就够。'],
      interactive: { text: '阶段 5 的动画把「每次投掷落进哪个箱」画成一排柱子：柱高 = 该箱已接住的球数。观察命中空箱的累计次数 hits 怎么爬到 b。' }, },
    { type: 'source', title: '书上是怎么说的', lead: '原文保留 PDF 抽取后的记号与空格（例如 $b(kI n,1/b)$ 是修复后的 $b(k; n, 1/b)$）；中文解读只负责把三步连起来。', blocks: [
      { kind: 'body', page: 143, en: 'Consider a process in which you randomly toss identical balls into b bins, numbered 1,2,…,b . The tosses are independent, and on each toss the ball is equally likely to end up in any bin. The probability that a tossed ball lands in any given bin is 1/b. If we view the ball-tossing process as a sequence of Bernoulli trials (see', zh: '模型起点：b 个等可能、独立的箱子。★ 关键假设是「每次投掷独立且均匀」——后面所有闭式答案都建立在这条 i.i.d. 上，一旦哈希不是均匀函数，结论就要重新算。' },
      { kind: 'body', page: 143, en: '• How many balls fall in a given bin? The number of balls that fall in a given bin follows the binomial distribution b(kI n,1/b) . If you toss n balls, equation (C.41) on page 1199 tells us that the expected number of balls that fall in the given bin is n/b.', zh: '问题一：给定箱子的球数服从二项分布 $b(k; n, 1/b)$，期望 $n/b$。★ 容易误读成「每个箱子恰好 $n/b$ 个」——那是期望，不是确定值；实际是围绕 $n/b$ 的二项波动。' },
      { kind: 'body', page: 143, en: 'The number of tosses until the given bin receives a ball follows the geometric distribution with probability 1/b and, by equation (C.36) on page 1197, the expected number of tosses until success is 1=.1/b/ = b.', zh: '问题二：指定箱子首次被命中所需投掷数服从参数 $1/b$ 的几何分布，期望 $b$。★ 书里 $1=.1/b/ = b$ 是修复后的 $1/(1/b)=b$；直觉上「平均每 $b$ 次才轮中一次指定箱」，所以期望是 $b$ 次。' },
      { kind: 'body', page: 143, en: '• How many balls must you toss until every bin contains at least one ball? Let us call a toss in which a ball falls into an empty bin a "hit." We want to know the expected number n of tosses required to get b hits.', zh: '问题三引入「命中空箱（hit）」这个巧妙的概念：只有落进空箱的投掷才算一次 hit。要集齐 b 箱，就等价于累积 b 次 hit。★ 这个重新分段是整节最关键的技巧——把难以直接求和的「全部命中」拆成 b 段。' },
      { kind: 'body', page: 144, en: 'Using the hits, we can partition the n tosses into stages. The i th stage consists of the tosses after the (i − 1)st hit up to and including the i th hit. The first stage consists of the first toss, since you are guaranteed to have a hit when all bins are empty. For each toss during the i th stage, i − 1 bins contain balls and b − i + 1 bins are empty. Thus, for each toss in the i th stage, the probability of obtaining a hit is (b − i + 1)/b.', zh: '第 i 段开始时已有 $i-1$ 个箱非空，所以空箱剩 $b-i+1$ 个，单次命中概率 $(b-i+1)/b$。★ 注意概率随段数下降——越往后越难命中新箱，这正是「全中」比「单中」慢得多的根源。' },
      { kind: 'body', page: 144, en: 'It therefore takes approximately b ln b tosses before we can expect that every bin has a ball. This problem is also known as the coupon collector’s problem, which says that if you are trying to collect each o f b different coupons, then you should expect to acquire approximately b ln b randomly obtained coupons in order to succeed.', zh: '结论：集齐 b 箱（优惠券收集者问题）期望约 $b\\ln b$ 次。★ 别把它和问题二的 $b$ 混为一谈：单箱只要 $b$ 次，全箱却要 $b\\ln b$ 次——差了一个 $\\ln b$ 因子，来自调和级数求和。' },
    ], terms: [{ en: 'balls and bins', zh: '球与箱模型', page: 143 }, { en: 'binomial distribution', zh: '二项分布', page: 143 }, { en: 'geometric distribution', zh: '几何分布', page: 143 }, { en: 'Bernoulli trials', zh: '伯努利试验', page: 143 }, { en: 'coupon collector’s problem', zh: '优惠券收集者问题', page: 144 }, { en: 'hashing', zh: '哈希（冲突分析）', page: 143 }] },
    { type: 'pseudocode', title: '教学整理：把「全部命中」拆成 b 段', algo: 'BALLS-AND-BINS', signature: 'BALLS-AND-BINS(b, n)', page: 143,
      lines: [
        { n: 1, code: 'for j = 1 to b:  B[j] = 0', zh: '先把 b 个箱子的计数都清零。' },
        { n: 2, code: 'hits = 0', zh: '命中空箱的累计次数，从 0 开始。' },
        { n: 3, code: 'for t = 1 to n', zh: '依次投出 n 个球。' },
        { n: 4, code: 'r = 第 t 个球落入的箱子', zh: '本关动画的输入就是这个 r 的序列。' },
        { n: 5, code: 'B[r] = B[r] + 1', zh: '对应箱子计数加一。' },
        { n: 6, code: 'if B[r] = 1', zh: '这次加一后恰好为 1，说明这是个空箱首次被命中。' },
        { n: 7, code: 'hits = hits + 1', zh: '命中空箱计数加一。' },
        { n: 8, code: 'return B', zh: '返回每个箱子的装载量分布。' },
      ],
      vars: [{ name: 'B[j]', meaning: '第 j 号箱子当前接住的球数' }, { name: 'hits', meaning: '已命中（非空）的箱子累计数' }, { name: 'r', meaning: '第 t 个球落进的箱子编号' }],
      note: '这是一份教学整理，不是原书独立的程序伪代码块；原书结论与公式在阶段 3 引述。' },
    { type: 'visualize', title: '看柱高怎么涨、hits 怎么爬到 b', viz: 'array',
      algorithm: 'balls-bins', pseudocodeRef: 'BALLS-AND-BINS',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2] },
      countLabels: { throws: { label: '已投掷', unit: '次' }, hits: { label: '命中空箱', unit: '次' }, maxLoad: { label: '最高箱装载', unit: '个' } },
      invariants: [{ label: '累计命中次数 hits 始终等于当前非空箱子的个数' }],
      presets: [
        { name: 'b=8 投 17 个（看箱箱有球约几次）', array: [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2] },
        { name: 'b=8 只投 8 个（空箱还挺多）', array: [1, 2, 3, 4, 1, 2, 3, 8] },
        { name: 'b=16 投 40 个（最高装载开始长高）', array: [7, 8, 5, 14, 3, 4, 1, 10, 15, 16, 13, 6, 11, 12, 9, 2, 7, 8, 5, 14, 3, 4, 1, 10, 15, 16, 13, 6, 11, 12, 9, 2, 7, 8, 5, 14, 3, 4, 1, 10] },
      ],
      tasks: ['在 b=8、投 17 个的预设里，数一数 hits 在哪一次投掷爬到 8（即每个箱都有球）。', '切到「只投 8 个」的预设，为什么还有箱子是空的？预期空箱数约几个？', '切到 b=16、投 40 个，观察最高箱装载 maxLoad 比前两组大了多少。'] },
    { type: 'code', title: '用 C 蒙特卡洛自证三个期望', intro: '程序用固定种子的 LCG 产生确定性随机序列，分别验证「给定箱期望 n/b」「指定箱首次命中期望 b」「集齐 b 箱期望 b·H_b ≈ b ln b」，断言只要求经验均值落在理论值 ±10% 内。',
      pseudocodeRef: 'BALLS-AND-BINS',
      c: { file: 'balls_and_bins.c', code: String.raw`/* balls_and_bins.c -- 5.4.2 球与箱（balls and bins）的数值自证。
 *
 * 书中约定下标从 1 开始（箱子编号为 1, 2, …, b），C 数组下标从 0 开始，
 * 因此本程序里 bin 变量取 0..b-1，对应书中的第 bin+1 号箱。
 *
 * 用固定种子的线性同余发生器（LCG）产生确定性伪随机序列：
 *     state = state * 6364136223846793005 + 1442695040888963407   (模 2^64)
 * 不依赖标准库的 rand()，保证结果可复现。
 *
 * 蒙特卡洛验证三件事（见原书 p143-144）：
 *   1) 给定箱子里的球数 ~ 二项分布 b(k; n, 1/b)，期望为 n/b；
 *   2) 指定箱子首次被命中所需投掷数的期望 ≈ b（几何分布，参数 1/b）；
 *   3) 每个箱子都至少落进一个球所需投掷数的期望 ≈ b·H_b ≈ b(ln b + γ)
 *      —— 这就是优惠券收集者问题（coupon collector's problem），即 b ln b + O(b)。
 *
 * 断言一律用区间（经验均值落在理论值的 ±10% 内），不要求精确相等。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o balls_and_bins balls_and_bins.c
 */

#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <stdint.h>

#define MAX_B 4096          /* 本程序支持的最大箱子数（栈上固定缓冲，避免变长数组）*/
#define SEED  0x12345678ULL /* 固定种子，保证每次运行结果一致 */

/* ---- 确定性伪随机数（64 位线性同余发生器）---- */
static uint64_t lcg_state = SEED;

static void lcg_seed(uint64_t s)
{
    lcg_state = s;
}

static uint64_t lcg_next(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return lcg_state;
}

/* 返回 [0, b) 中的均匀整数；取高 32 位以减少低位的线性同余偏差。 */
static int lcg_bin(int b)
{
    uint64_t r = lcg_next() >> 32;
    return (int)(r % (uint64_t)b);
}

/* 第 n 个调和数 H_n = sum_{i=1..n} 1/i。 */
static double harmonic(int n)
{
    double s = 0.0;
    for (int i = 1; i <= n; i++)
        s += 1.0 / (double)i;
    return s;
}

/* 蒙特卡洛：在 b 个箱子里各投 n 个球，统计「落入 0 号箱」的球数，
 * 返回其经验均值。理论期望为 n/b。 */
static double mean_in_given_bin(int b, int n, long trials)
{
    double total = 0.0;
    for (long t = 0; t < trials; t++) {
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (lcg_bin(b) == 0)
                count++;
        }
        total += (double)count;
    }
    return total / (double)trials;
}

/* 一次模拟：把球随机投进 b 个箱子，直到指定的 0 号箱首次被命中。
 * 返回投掷次数（几何分布，期望 b）。 */
static long toss_until_first_hit(int b)
{
    long tosses = 0;
    for (;;) {
        int bin = lcg_bin(b);
        tosses++;
        if (bin == 0)
            return tosses;
    }
}

/* 蒙特卡洛：指定箱首次被命中所需投掷数的经验均值。理论期望为 b。 */
static double mean_first_hit(int b, long trials)
{
    double total = 0.0;
    for (long t = 0; t < trials; t++)
        total += (double)toss_until_first_hit(b);
    return total / (double)trials;
}

/* 蒙特卡洛：把球随机投进 b 个箱子，直到每个箱子至少落进一个球，
 * 返回所需投掷数的经验均值。理论期望为 b·H_b（优惠券收集者问题）。 */
static double mean_all_hit(int b, long trials)
{
    assert(b >= 1 && b <= MAX_B);
    double total = 0.0;
    for (long t = 0; t < trials; t++) {
        int hit_count[MAX_B];
        for (int i = 0; i < b; i++)
            hit_count[i] = 0;
        int hits = 0;
        long tosses = 0;
        while (hits < b) {
            int bin = lcg_bin(b);
            tosses++;
            if (hit_count[bin] == 0)
                hits++;
            hit_count[bin]++;
        }
        total += (double)tosses;
    }
    return total / (double)trials;
}

int main(void)
{
    const double TOL = 0.10;   /* 经验均值与理论值的允许相对偏差 ±10% */

    /* 1) 给定箱子球数的期望 ≈ n/b（二项分布 b(k; n, 1/b) 的均值）*/
    lcg_seed(SEED);
    {
        int b = 20, n = 200;
        double expect = (double)n / (double)b;
        double mean = mean_in_given_bin(b, n, 50000);
        printf("given bin : b=%-4d n=%-4d  E=n/b=%.3f  empirical=%.3f\n",
               b, n, expect, mean);
        assert(fabs(mean - expect) <= TOL * expect);
    }

    /* 2) 指定箱首次命中期望 ≈ b（几何分布）*/
    lcg_seed(SEED);
    {
        int bvals[3] = {50, 200, 1000};
        for (int k = 0; k < 3; k++) {
            int b = bvals[k];
            double mean = mean_first_hit(b, 30000);
            printf("first hit : b=%-4d  E=b=%.1f  empirical=%.2f\n", b, (double)b, mean);
            assert(fabs(mean - (double)b) <= TOL * (double)b);
        }
    }

    /* 3) 集齐 b 箱期望 ≈ b·H_b（优惠券收集者问题，b ln b + O(b)）*/
    lcg_seed(SEED);
    {
        int bvals[3] = {20, 100, 500};
        for (int k = 0; k < 3; k++) {
            int b = bvals[k];
            double expect = (double)b * harmonic(b);
            double mean = mean_all_hit(b, 30000);
            printf("all hit   : b=%-4d  E=b*H_b=%.2f  empirical=%.2f\n", b, expect, mean);
            assert(fabs(mean - expect) <= TOL * expect);
        }
    }

    puts("balls and bins checks passed.");
    return 0;
}
`,
        notes: [
          { line: 44, zh: 'lcg_bin 产 [0, b) 的均匀整数，对应书中「球等可能落进任一箱」。' },
          { line: 99, zh: 'mean_all_hit 模拟「投到每个箱都非空」并统计投掷数，是优惠券收集者问题的直接实现。' },
          { line: 107, zh: 'hits 与伪代码里的 hits 对应：累计命中空箱次数。' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'for j = 1 to b:  B[j] = 0', c: '`for (int i = 0; i < b; i++) hit_count[i] = 0;` 把 b 个箱计数清零。' },
        { pc: 2, pcCode: 'hits = 0', c: '`int hits = 0;` 命中空箱计数归零。' },
        { pc: 3, pcCode: 'for t = 1 to n', c: '`while (hits < b)` 逐次投掷直到集齐 b 箱。' },
        { pc: 4, pcCode: 'r = 第 t 个球落入的箱子', c: '`int bin = lcg_bin(b);` 本次落进的箱子编号。' },
        { pc: 5, pcCode: 'B[r] = B[r] + 1', c: '`hit_count[bin]++;` 该箱计数加一。' },
        { pc: 6, pcCode: 'if B[r] = 1', c: '`if (hit_count[bin] == 0)` 判断是否首次命中空箱。' },
        { pc: 7, pcCode: 'hits = hits + 1', c: '`hits++;` 命中空箱计数加一。' },
        { pc: 8, pcCode: 'return B', c: '`total += (double)tosses;` 累计本次模拟的投掷总数，最后求均值。' },
      ] },
    { type: 'analyze', title: '三个期望，三条闭式', intro: '原书 p143–144 直接给出三个结论；它们都来自「独立均匀投掷」这一个假设，用二项分布 / 几何分布 / 线性期望即可推出。',
      claims: [
        { expr: 'b(k; n, 1/b)', when: '给定箱子的球数所服从的分布', page: 143, source: 'book' },
        { expr: 'E[给定箱球数] = n/b', when: '二项分布均值', page: 143, source: 'book' },
        { expr: 'E[指定箱首次命中] = b', when: '几何分布（参数 1/b）的期望', page: 143, source: 'book' },
        { expr: 'E[集齐 b 箱] = b ln b + O(b)', when: '优惠券收集者问题：期望投掷数', page: 144, source: 'book' },
      ],
      tables: [{ caption: '三问对照', rows: [['问题', '分布 / 工具', '期望'], ['给定箱球数', '二项 $b(k; n, 1/b)$', '$n/b$'], ['指定箱首次命中', '几何（参数 $1/b$）', '$b$'], ['集齐所有箱', '优惠券收集者', '$b\\ln b + O(b)$']] }],
      chart: { xMax: 50, series: [
        { name: 'b ln b', expr: 'n * Math.log(n)' },
        { name: 'b·H_b ≈ b(ln b + γ)', expr: 'n * (Math.log(n) + 0.5772156649)' },
        { name: 'b', expr: 'n' },
      ] },
      derivations: [{ kind: 'summation', title: '从分段到调和级数', steps: [
        { tex: '\\text{按命中空箱把投掷分 } b \\text{ 段，第 } i \\text{ 段成功概率 } \\frac{b-i+1}{b}', zh: '第 i 段开始时已有 $i-1$ 个箱非空，空箱剩 $b-i+1$ 个。' },
        { tex: 'E[n_i] = \\frac{b}{b-i+1}', zh: '每段都是几何分布，期望是成功概率的倒数。' },
        { tex: 'E[n] = \\sum_{i=1}^{b} E[n_i] = \\sum_{i=1}^{b} \\frac{b}{b-i+1} = b\\sum_{j=1}^{b}\\frac1j = b H_b', zh: '用线性期望（即使各段相关也成立），换元 $j=b-i+1$ 得到 $b$ 乘调和数。' },
        { tex: 'b H_b = b(\\ln b + O(1))', zh: '由公式 (A.9) 的调和界 $H_b = \\ln b + O(1)$，得到 $b\\ln b + O(b)$。公式 (A.14) 给出更紧的 $H_b = \\ln b + \\gamma + O(1/b)$。' },
      ] }],
      note: '问题一、二是单箱视角；问题三才是全箱视角，代价从 $b$ 升到 $b\\ln b$，差一个 $\\ln b$ 因子。' },
    { type: 'prove', title: '为什么集齐 b 箱要 b ln b 次', statement: 'It therefore takes approximately b ln b tosses before we can expect that every bin has a ball.', page: 144,
      intro: '证明就是「分段 + 几何期望 + 线性期望 + 调和级数」四步，逐字引述取自原书 p144。',
      steps: [
        { title: '第一步 · 按命中空箱分段', en: 'Using the hits, we can partition the n tosses into stages. The i th stage consists of the tosses after the (i − 1)st hit up to and including the i th hit. The first stage consists of the first toss, since you are guaranteed to have a hit when all bins are empty. For each toss during the i th stage, i − 1 bins contain balls and b − i + 1 bins are empty. Thus, for each toss in the i th stage, the probability of obtaining a hit is (b − i + 1)/b.', page: 144, body: ['把 $n$ 次投掷按「第几次命中空箱」切成 $b$ 段。', '第 $i$ 段里空箱还有 $b-i+1$ 个，所以单次命中概率是 $(b-i+1)/b$。'] },
        { title: '第二步 · 各段是几何分布', en: 'Let n i denote the number of tosses in the i th stage. The number of tosses required to get b hits is n = P b i D1 n i . Each random variable n i has a geometric distribution with probability of success (b − i + 1)/b and thus, by equation (C.36), we have', page: 144, body: ['每段投掷数 $n_i$ 都是几何分布，成功概率 $(b-i+1)/b$。', '于是 $E[n_i] = b/(b-i+1)$。'] },
        { title: '第三步 · 线性期望求和得调和级数', en: 'D b(ln b + O(1)) (by equation (A.9) on page 1142) .', page: 144, body: ['由线性期望，$E[n]=\\sum_{i=1}^b E[n_i] = b\\sum_{j=1}^b 1/j = b H_b$。', '再用 $H_b = \\ln b + O(1)$（公式 (A.9)，更紧见 (A.14)），即得 $b\\ln b + O(b)$。'] },
      ],
      conclusion: '所以「每个箱子都至少落进一个球」的期望投掷数为 $b\\ln b + O(b)$，这就是优惠券收集者问题的答案。' },
    { type: 'drill', title: '检验一下', items: [
        { kind: 'judge', q: '给定箱子里接住的球数服从二项分布 b(k; n, 1/b)。', answer: true, why: '每次投掷独立且以 1/b 落进该箱，n 次即二项分布。' },
        { kind: 'single', q: '指定箱子首次被命中，所需投掷数的期望是多少？', options: ['1/b', 'b', 'ln b', 'b ln b'], answer: 1, why: '几何分布期望是成功概率的倒数，即 1/(1/b)=b。' },
        { kind: 'judge', q: '要让每个箱子都至少接住一个球，期望投掷数约为 b ln b。', answer: true, why: '优惠券收集者问题，来自对 b 段几何期望求和得到 b·H_b ≈ b ln b。' },
        { kind: 'single', q: '集齐 b 张不同优惠券，期望次数约为？', options: ['b', 'b²', 'b ln b', 'ln b'], answer: 2, why: '即球与箱问题三，期望 b ln b + O(b)。' },
        { kind: 'single', q: '把 n 次投掷按「命中空箱」分段后，第 i 段（已有 i−1 箱非空）单次命中空箱的概率是？', options: ['1/b', '(b−i+1)/b', 'i/b', '(b−i)/b'], answer: 1, why: '此时空箱剩 b−i+1 个，占全部 b 箱的 (b−i+1)/b。' },
        { kind: 'simulate', q: 'b=4 时，集齐 4 箱的理论期望是 b·H₄ = 4×(1+1/2+1/3+1/4)，约等于多少？', expect: [8.333, 8.33], placeholder: '例如：8.333', why: 'H₄ = 25/12 ≈ 2.0833，乘以 4 得 8.333。' },
        { kind: 'judge', q: '球与箱模型可用于分析哈希表的冲突分布。', answer: true, why: '原书明确指出该模型对分析 hashing（第 11 章）特别有用。' },
      ],
      bookExercises: [
        { id: '5.4-3', page: 153, star: 0, preview: true,
          statement: 'You toss balls into b bins until some bin contains two balls. Each toss is independent, and each ball is equally likely to end up in any bin. What is the expected number of ball tosses?',
          hint: '记 $T$ = 第一次出现「某个箱子里有 2 个球」的投掷序号。$T > k$ 意味着前 $k$ 球全落在不同箱子：$\\Pr[T > k] = \\frac{b(b-1)\\cdots(b-k+1)}{b^k}$，而 $E[T] = \\sum_{k \\ge 0} \\Pr[T > k]$。这就是 5.4.1 生日问题的等待时间版本（那里问「概率」，这里问「期望投几次」），首项是 $\\Theta(\\sqrt{b})$，量级与 $\\sqrt{\\pi b / 2}$ 一致。★ 本轮把求和直接算了：$b = 2$ 得 $2.5$；$b = 365$ 得 $24.617$（$\\sqrt{\\pi b/2} = 23.944$）；$b = 10^4$ 得 $125.999$，两者之差随 $b$ 增大收敛到约 $0.667$。' },
      ] },
  ],
};
