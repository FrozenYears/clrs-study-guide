/* 第 5 章 5.4.1：生日悖论。原文锚点：印刷页 140–143。 */

export default {
  key: 's04', id: 'ch05/s04', chapter: 5, section: '5.4',
  title: '生日悖论：23 人为何就够', shortTitle: '5.4.1 生日悖论',
  titleEn: 'The birthday paradox',
  source: { printed: [140, 143], pdf: [161, 164] },
  sourceNote: '本关对应原书 5.4.1 节（印刷页 140–143）。5.4 节还含球与盒、连胜、在线最大三个例子。',
  prerequisites: [{ label: '5.2 Indicator random variables', url: '#/ch05/s02' }],
  stages: [
    { type: 'map', title: '用概率反驳直觉：23 人就够',
      why: '“至少两人同生日”的概率比直觉高得多。这一关把概率分析与指示器随机变量两件套，用在同一个反直觉结果上。',
      position: '5.3 讲随机化算法；本关是 5.4 的第一个例子，分别用补事件与指示器得到“概率≥1/2 要 23 人”“期望≥1 对要 28 人”；后续 5.4.2–5.4.4 是球与盒、连胜、在线最大。',
      unlocks: [{ label: '5.4.2 Balls and bins（球与盒）', url: '#/ch05/s05' }],
      mathKit: [
        { title: '补事件', body: '$P(A)=1-P(\\overline{A})$；算“至少一对相同”不如先算“全不同”再取补。' },
        { title: '指示器', body: '事件 $A$ 发生取 1、否则取 0；$E[I_A]=P(A)$。' },
        { title: '线性期望', body: '$E[\\sum X_{ij}]=\\sum E[X_{ij}]$，不要求各对相互独立。' },
      ],
    },
    { type: 'intuition', title: '教室里的“同月同日”赌局',
      scene: '你和 22 个同学围坐，打赌“屋里至少两人同一天生日”',
      body: [
        '直觉会说：一年 365 天，要凑出一对相同，怎么也得上百人吧？但书上的结论是：只要 23 人，这个概率就超过一半。',
        '关键在“任意两人”的组合数：23 人之间有 $\\binom{23}{2}=253$ 对，每对都有 $1/365$ 的概率撞上。机会积少成多，远快于你的直觉。',
        '本关用两条路线逼近它：一条走概率（补事件），一条走期望（指示器）。两者所需人数不同，但都随 $\\sqrt{n}$ 增长。',
      ],
      interactive: { text: '阶段 5 把 23 个生日排成卡片，逐人进场；看第几个进门时第一次撞上。' },
    },
    { type: 'source', title: '书上是怎么说的',
      lead: '原文保留 PDF 抽取后的记号与空格（花括号被抽成 f g、下标排成 $b_i$、根号抽成 p）；中文解读只负责把每一步连起来。',
      blocks: [
        { kind: 'body', page: 140, en: 'Our first example is the birthday paradox. How many people must there be in a room before there is a 50% chance that two of them were born on the same day of the year? The answer is surprisingly few. The paradox is that it is in fact far fewer than the number of days in a year, or even half the number of days in a year, as we shall see.',
          zh: '先抛问题：要多少人，屋里才“至少一半概率”出现一对同生日？★ 反直觉点在于答案（23）远小于 365，甚至小于 182；书用“paradox”不是真矛盾，而是直觉错得离谱。' },
        { kind: 'body', page: 140, en: '1,2,…,k , where k is the number of people in the room. We ignore the issue of leap years and assume that all years have n = 365 days. For i = 1,2,…,k , let b i be the day of the year on which person i ’s birthday falls, where 1 ≤ b i ≤ n.',
          zh: '建立模型：把人编号 1..k，忽略闰年，一年 $n=365$ 天；用 $b_i$ 记第 $i$ 个人的生日（书中底数记成 $b i$）。★ 下标从 1 开始，与后面 C 的 0 基数组不同，看代码时要换算。' },
        { kind: 'body', page: 140, en: 'We also assume that birthdays are uniformly distributed across the n days of the year, so that Pr fb i = r g = 1/n for i = 1,2,…,k and r = 1,2,…,n .',
          zh: '两个建模假设：生日**均匀**分布（每天概率 $1/n$），且各人独立。★ 没有“均匀”这个前提，后面的乘积公式不成立；真实人口有季节聚集，会让概率更高。' },
        { kind: 'body', page: 140, en: 'The probability that two given people, say i and j , have matching birthdays depends on whether the random selection of birthdays is independent. We assume from now on that birthdays are independent, so that the probability that i ’s birthday and j ’s birthday both fall on day r is Pr fb i = r and b j = r g = Pr fb i = r g Pr fb j = r g',
          zh: '一对特定的人 $(i,j)$ 同一天生日的概率，靠“独立”才等于各自概率相乘。★ 书里先确认要依赖独立性，再写下 $P(b_i=r\\land b_j=r)=P(b_i=r)P(b_j=r)=1/n^2$，于是任一给定对相同的概率为 $1/n$。' },
        { kind: 'body', page: 141, en: 'We can analyze the probability of at least 2 out of k people having matching birthdays by looking at the complementary event. The probability that at least two of the birthdays match is 1 minus the probability that all the birthdays are different.',
          zh: '第一条路线：直接算“至少一对相同”很难，转而算其**补事件**“全部互不相同”，再用 1 减。★ 这是全章最常用的一招——正面难算就取补。' },
        { kind: 'body', page: 141, en: 'Pr fB k g = Pr fB k−1 g Pr fA k j B k−1 g ; (5.8) where we take Pr fB 1 g = Pr fA 1 g = 1 as an initial condition. In other words, the probability that b 1 ,b 2 ,…,b k are distinct birthdays equals the probability that b 1 ,b 2 ,…,b k−1 are distinct birthdays multiplied by the probability that b k ≠ b i for i = 1,2,…,k − 1, given that b 1 ,b 2 ,…,b k−1 are distinct.',
          zh: '核心递推式 (5.8)：把“$k$ 人全不同”拆成“前 $k-1$ 人全不同”乘“在前 $k-1$ 人已不同的条件下，第 $k$ 人与前面都不同”。★ $B_k=A_k\\cap B_{k-1}$，所以直接用条件概率相乘；初始 $P(B_1)=P(A_1)=1$。' },
        { kind: 'body', page: 141, en: 'If b 1 ,b 2 ,…,b k−1 are distinct, the conditional probability that b k ≠ b i for i = 1,2,…,k − 1 is Pr fA k j B k−1 g = (n − k + 1)/n, since out of the n days, n − (k − 1) days are not taken. We iteratively apply the recurrence (5.8) to obtain Pr fB k g = Pr fB k−1 g Pr fA k j B k−1 g',
          zh: '条件概率的具体值是 $(n-k+1)/n$：前 $k-1$ 人已占 $k-1$ 天，剩下 $n-(k-1)$ 天可用。★ 把 (5.8) 反复代入，就得到 $P(B_k)=\\prod_{i=1}^{k}(n-i+1)/n$——这一步是阶段 8 要正式证的部分。' },
        { kind: 'body', page: 142, en: '… For n = 365, we must have k ≥ 23. Thus, if at least 23 people are in a room, the probability is at least 1/2 that at least two people have the same birthday.',
          zh: '结论：当 $n=365$ 时，解得 $k\\ge 23$ 就能让“全不同”的概率 $\\le 1/2$，即“至少一对相同”的概率 $\\ge 1/2$。★ 这就是著名结论——不是约 23，而是**不少于** 23 就过半。' },
        { kind: 'definition', page: 142, en: 'Indicator random variables afford a simpler but approximate analysis of the birthday paradox. For each pair (i,j) of the k people in the room, define the indicator random variable X ij , for 1 ≤ i <j ≤ k, by X ij = I fperson i and person j have the same birthdayg',
          zh: '第二条路线：给每一对 $(i,j)$（书中记成 $X ij$）定义一个指示器，两人同生日取 1、否则取 0。★ 这里说“approximate（近似）”是因为它算的是**期望对数**而非“至少一对”的概率，结论人数会略有不同。' },
        { kind: 'body', page: 142, en: 'E [X ij ] = Pr fperson i and person j have the same birthdayg',
          zh: '由 Lemma 5.1，指示器期望等于它所指事件的概率，即 $E[X_{ij}]=1/n$。★ 这一步把“概率”翻译成“期望”，是为了后面套线性期望。' },
        { kind: 'body', page: 142, en: 'Letting X be the random variable that counts the number of pairs of individuals having the same birthday, we have',
          zh: '把总数 $X$ 定义为所有 $X_{ij}$ 之和：$X=\\sum_{1\\le i<j\\le k}X_{ij}$。它数的是“同生日对数”，不是“是否至少有一对”。' },
        { kind: 'body', page: 143, en: '… For n = 365, if k = 28, the expected number of pairs with the same birthday is .28 • 27/=.2 • 365/ − 1:0356.',
          zh: '结论：当 $n=365$、$k=28$ 时，$E[X]=28\\cdot 27/(2\\cdot 365)\\approx 1.0356\\ge 1$。★ 期望至少 1 对要 28 人，比概率过半的 23 人略多——两种方法人数不同，但都随 $\\sqrt{365}\\approx 19$ 同量级。' },
      ],
      terms: [
        { en: 'birthday paradox', zh: '生日悖论', page: 140 },
        { en: 'uniformly distributed', zh: '均匀分布', page: 140 },
        { en: 'complementary event', zh: '补事件', page: 141 },
        { en: 'indicator random variable', zh: '指示器随机变量', page: 142 },
        { en: 'linearity of expectation', zh: '期望的线性', page: 142 },
      ],
    },
    { type: 'pseudocode', title: '教学整理：把“撞生日对数”写成计数循环',
      algo: 'BIRTHDAY-PAIRS', signature: 'BIRTHDAY-PAIRS(b, k)', page: 142,
      lines: [
        { n: 1, code: 'X = 0', zh: '用 X 累计已经发现的同生日对数。' },
        { n: 2, code: 'for i = 1 to k', zh: '按进门顺序逐个人检查；书中下标从 1 开始。' },
        { n: 3, code: 'if b[i] 在 b[1 : i-1] 中出现过', zh: '把第 i 个人的生日和前面所有人的生日逐一比较；书中把这一段记为下标片段 $b[1:i-1]$。' },
        { n: 4, code: 'X = X + 1', zh: '发现一次重复，对数加 1。' },
        { n: 5, code: 'return X', zh: '返回整轮总共撞上的对数。' },
      ],
      vars: [
        { name: 'b', meaning: '生日序列，b[i] 是第 i 个人的生日（1..365）' },
        { name: 'k', meaning: '房间里的总人数' },
        { name: 'X', meaning: '已经确认的同生日对数' },
      ],
      note: '这是教学整理，不是原书独立程序块；原书结论与公式在阶段 3 引述（5.4 节没有单独伪代码清单）。行号对应算法生成器 birthday-collisions 的逐帧含义。',
    },
    { type: 'visualize', title: '逐人进场，看第一次撞生日', viz: 'array', vizMode: 'cards',
      algorithm: 'birthday-collisions', pseudocodeRef: 'BIRTHDAY-PAIRS',
      input: { array: [101, 222, 34, 56, 77, 12, 300, 88, 145, 200, 33, 67, 190, 250, 41, 99, 180, 5, 265, 130, 18, 310, 77] },
      countLabels: { collisions: { label: '撞生日', unit: '对' } },
      invariants: [{ label: '已确认的撞生日对数 X 等于前面出现过重复的次数' }],
      presets: [
        { name: '经典 23 人（约 50%）', array: [101, 222, 34, 56, 77, 12, 300, 88, 145, 200, 33, 67, 190, 250, 41, 99, 180, 5, 265, 130, 18, 310, 77] },
        { name: '无重复 10 人', array: [3, 17, 28, 41, 52, 66, 79, 91, 104, 115] },
        { name: '很早撞上 8 人', array: [10, 20, 10, 30, 40, 50, 60, 70] },
        { name: '25 人（含两对）', array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 2, 21, 22, 3] },
      ],
      tasks: [
        '播放“经典 23 人”预设，记录第几个人进门时第一次出现“撞生日”。',
        '切换到“无重复 10 人”，确认整轮 X 始终为 0、cmp（比较次数）为 45。',
        '把“25 人（含两对）”跑完，对比 cmp（比较次数）与 collisions（撞生日）的差值。',
      ],
    },
    { type: 'code', title: '用 C 蒙特卡洛验证两条结论',
      intro: '程序同时算精确概率、指示器期望、蒙特卡洛经验值，并断言边界；近似公式只做区间比对，不钉死精确值。',
      pseudocodeRef: 'BIRTHDAY-PAIRS',
      c: { file: 'birthday_paradox.c', code: String.raw`/* birthday_paradox.c -- 5.4.1 生日悖论的蒙特卡洛验证。
 *
 * 书中伪代码下标从 1 开始（b[1], b[2], …, b[k]），C 数组从 0 开始
 * （b[0], b[1], …, b[k-1]）。因此伪代码的 b[i] 对应 C 的 b[i-1]，
 * 下面的 count_collisions 用 0 基循环逐对比较，等价于 BIRTHDAY-PAIRS。
 *
 * 验证内容：
 *   1) 精确相撞概率 P(k) = 1 - ∏_{i=0}^{k-1}(1 - i/n)；k=23 时 ≥ 1/2。
 *   2) 指示器期望 E[X] = C(k,2)/n；k=28, n=365 时 ≥ 1。
 *   3) 蒙特卡洛经验概率落在精确值附近（区间断言，不钉死近似值）。
 *   4) 近似公式 1 - e^{-k(k-1)/(2n)} 与精确值之差在容差内。
 */

#include <assert.h>
#include <math.h>
#include <stdio.h>

static double exact_collision_prob(int k, int n)
{
    double p_distinct = 1.0;
    for (int i = 0; i < k; i++) {
        p_distinct *= (double)(n - i) / (double)n;
    }
    return 1.0 - p_distinct;
}

static double approx_collision_prob(int k, int n)
{
    double exponent = -(double)k * (double)(k - 1) / (2.0 * (double)n);
    return 1.0 - exp(exponent);
}

static double expected_pairs(int k, int n)
{
    return (double)k * (double)(k - 1) / (2.0 * (double)n);
}

/* 简单线性同余发生器，避免依赖平台随机实现。 */
static unsigned long rng_state = 123456789UL;
static int next_day(int n)
{
    rng_state = rng_state * 6364136223846793005UL + 1442695040888963407UL;
    return (int)(rng_state % (unsigned long)n) + 1; /* 落在 1..n */
}

static double empirical_collision_prob(int k, int n, int trials)
{
    int hits = 0;
    for (int t = 0; t < trials; t++) {
        int seen[366] = {0}; /* 标记 1..365 是否出现过 */
        int collided = 0;
        for (int i = 0; i < k && !collided; i++) {
            int day = next_day(n);
            if (seen[day]) {
                collided = 1;
            } else {
                seen[day] = 1;
            }
        }
        hits += collided;
    }
    return (double)hits / (double)trials;
}

/* 对应教学伪代码 BIRTHDAY-PAIRS：统计一组确定性生日里的相撞对数。 */
static int count_collisions(const int *b, int k)
{
    int X = 0;
    for (int i = 1; i < k; i++) {      /* 书中视角的第 i+1 个人 b[i] */
        for (int j = 0; j < i; j++) {  /* 与前面 b[0..i-1] 比较 */
            if (b[i] == b[j]) {
                X++;
            }
        }
    }
    return X;
}

static void close_to(double actual, double expected, double tol)
{
    assert(fabs(actual - expected) <= tol);
}

int main(void)
{
    const int n = 365;

    /* 1) 精确概率：k=23 时确实 ≥ 1/2（由模型直接推出，非近似）。 */
    double p23 = exact_collision_prob(23, n);
    assert(p23 >= 0.5);
    assert(p23 <= 0.51);

    /* 2) 指示器期望：k=28 时 E[X] = 28*27/(2*365) ≈ 1.0356 ≥ 1。 */
    double e28 = expected_pairs(28, n);
    assert(e28 >= 1.0);
    assert(e28 <= 1.1);

    /* 3) 蒙特卡洛经验概率落在精确值附近（不钉死，用区间）。 */
    int trials = 200000;
    double emp23 = empirical_collision_prob(23, n, trials);
    close_to(emp23, p23, 0.03);

    /* 4) 近似公式与精确值之差在容差内（它只是近似，不要求相等）。 */
    double approx23 = approx_collision_prob(23, n);
    close_to(approx23, p23, 0.02);

    /* 5) 确定性计数与伪代码一致：[1,1,1] 三人间有 C(3,2)=3 对相撞。 */
    int trip[3] = {1, 1, 1};
    assert(count_collisions(trip, 3) == 3);

    /* 6) 23 人确定性序列（与可视化预设一致）：第 23 人撞上第 5 人的生日。 */
    int room23[23] = {101, 222, 34, 56, 77, 12, 300, 88, 145, 200,
                      33, 67, 190, 250, 41, 99, 180, 5, 265, 130,
                      18, 310, 77};
    assert(count_collisions(room23, 23) == 1);

    printf("P(collision | k=23, n=365)   = %.4f\n", p23);
    printf("approx 1 - e^{-k(k-1)/(2n)}  = %.4f\n", approx23);
    printf("E[pairs | k=28, n=365]       = %.4f\n", e28);
    printf("empirical (trials=%d)        = %.4f\n", trials, emp23);
    puts("birthday paradox checks passed.");
    return 0;
}
`, notes: [{ line: 18, zh: 'exact_collision_prob 直接按模型算精确概率，不依赖近似。' }, { line: 66, zh: 'count_collisions 是伪代码 BIRTHDAY-PAIRS 的 0 基实现。' }],
        tests: [{ in: '[1,1,1]', out: '3' }, { in: '[101,222,34,56,77,12,300,88,145,200,33,67,190,250,41,99,180,5,265,130,18,310,77]', out: '1' }] },
      mapping: [
        { pc: 1, pcCode: 'X = 0', c: '`int X = 0;` 在 count_collisions 里初始化计数。' },
        { pc: 2, pcCode: 'for i = 1 to k', c: '`for (int i = 1; i < k; i++)` 逐人（外循环）。' },
        { pc: 3, pcCode: 'if b[i] 在 b[1 : i-1] 中出现过', c: '`for (int j = 0; j < i; j++) if (b[i] == b[j])` 与前面逐一比较。' },
        { pc: 4, pcCode: 'X = X + 1', c: '`X++;` 命中一次重复就加 1。' },
        { pc: 5, pcCode: 'return X', c: '`return X;` 返回总对数。' },
      ],
    },
    { type: 'analyze', title: '两种分析，两个阈值',
      intro: '第一条路线给“概率”，第二条路线给“期望对数”；前者在 k=23 过半，后者在 k=28 期望≥1，二者都随 √n 增长。',
      claims: [
        { expr: 'P(至少一对相同) ≥ 1/2 当 k ≥ 23', when: '补事件路线下的临界人数', page: 142, source: 'book' },
        { expr: 'Pr{B_k} ≤ e^{−k(k−1)/(2n)}', when: 'k 人生日全不同的概率上界', page: 142, source: 'book' },
        { expr: 'E[X] = C(k,2)/n = k(k−1)/(2n)', when: '指示器给出的期望同生日对数', page: 142, source: 'book' },
        { expr: 'E[X] ≥ 1 当 k(k−1) ≥ 2n', when: '期望至少 1 对的临界条件', page: 143, source: 'book' },
        { expr: 'k = 28 ⇒ E[X] ≈ 1.0356 ≥ 1', when: 'n = 365 时的具体值', page: 143, source: 'book' },
        { expr: '两种所需人数均为 Θ(√n)', when: '概率法与指示器法渐近一致', page: 143, source: 'book' },
      ],
      tables: [{ caption: '两种路线对照', rows: [['路线', '算什么', '临界人数 (n=365)'], ['补事件概率', 'P(至少一对相同)', '23（≥1/2）'], ['指示器期望', 'E[同生日对数]', '28（≥1）']] }],
      chart: { xMax: 60, series: [
        { name: '至少一对同生日的概率 ≈ 1 − e^{−k(k−1)/(2·365)}', expr: '1 - Math.exp(-n*(n-1)/(2*365))', color: '--viz-active' },
        { name: '期望同生日对数 E[X] = C(k,2)/365', expr: 'n*(n-1)/(2*365)', color: '--viz-done' },
      ] },
      derivations: [{ kind: 'product', title: '从递推到上界 e^{−k(k−1)/(2n)}', steps: [
        { tex: 'Pr\\{B_k\\} = \\prod_{i=1}^{k} \\frac{n-i+1}{n} = \\prod_{i=1}^{k}\\left(1-\\frac{i-1}{n}\\right)', zh: '把 (5.8) 反复代入，得到全不同概率的连乘积。' },
        { tex: '1 + x \\le e^x \\quad\\Rightarrow\\quad 1-\\frac{i-1}{n} \\le e^{-(i-1)/n}', zh: '用基本不等式 $1+x\\le e^x$（取 $x=-(i-1)/n$）；这是原书 p141→142 收尾的关键一步。' },
        { tex: 'Pr\\{B_k\\} \\le \\prod_{i=1}^{k} e^{-(i-1)/n} = e^{-\\sum_{i=1}^{k}(i-1)/n} = e^{-k(k-1)/(2n)}', zh: '把指数相乘变成指数相加，指数里的和就是 $\\sum_{i=1}^{k}(i-1)=k(k-1)/2$。' },
        { tex: 'P(\\text{至少一对相同}) = 1-Pr\\{B_k\\} \\ge 1 - e^{-k(k-1)/(2n)}', zh: '取补得到“至少一对”的下界。' },
        { tex: '1 - e^{-k(k-1)/(2n)} \\ge \\tfrac12 \\iff k(k-1) \\ge 2n\\ln 2', zh: '令下界 ≥ 1/2，解得 $k(k-1)\\ge 2n\\ln 2$；代入 $n=365$ 得 $k\\ge 23$。' },
      ] }],
      note: '近似公式 $1-e^{-k(k-1)/(2n)}$ 只是上界取指数后的近似；精确概率比它略大，所以 k=23 时真实概率约 0.507。',
    },
    { type: 'prove', title: '为什么全不同的概率等于那个连乘积',
      statement: 'We can analyze the probability of at least 2 out of k people having matching birthdays by looking at the complementary event. The probability that at least two of the birthdays match is 1 minus the probability that all the birthdays are different.',
      page: 141,
      intro: '证明把“k 人全不同”写成条件概率的连乘积，再逐次代入得到闭合形式；最后用 $1+x\\le e^x$ 收尾。',
      steps: [
        { title: '初始化 · 定义分解', en: 'A i is the event that person i ’s birthday is different from person j ’s for all j < i . Since we can write B k = A k \\ B k−1 , we obtain from equation (C.18) on page 1189 the recurrence', page: 141, body: ['先定义 $A_i$：第 $i$ 个人的生日与前 $i-1$ 人都不同。', '把“$k$ 人全不同”写成 $B_k=A_1\\cap A_2\\cap\\cdots\\cap A_k$；由于第 $k$ 人只和前面比较，有 $B_k=A_k\\cap B_{k-1}$，这正是递推的出发点。'] },
        { title: '保持 · 递推式', en: 'Pr fB k g = Pr fB k−1 g Pr fA k j B k−1 g ; (5.8) where we take Pr fB 1 g = Pr fA 1 g = 1 as an initial condition. In other words, the probability that b 1 ,b 2 ,…,b k are distinct birthdays equals the probability that b 1 ,b 2 ,…,b k−1 are distinct birthdays multiplied by the probability that b k ≠ b i for i = 1,2,…,k − 1, given that b 1 ,b 2 ,…,b k−1 are distinct.', page: 141, body: ['由条件概率定义直接得到 (5.8)；初始条件 $P(B_1)=P(A_1)=1$（一个人必然“全不同”）。', '右端就是把“前 $k-1$ 人已不同”的概率，乘以“在此条件下第 $k$ 人避开前面所有生日”的概率。'] },
        { title: '终止 · 代入闭合', en: 'If b 1 ,b 2 ,…,b k−1 are distinct, the conditional probability that b k ≠ b i for i = 1,2,…,k − 1 is Pr fA k j B k−1 g = (n − k + 1)/n, since out of the n days, n − (k − 1) days are not taken. We iteratively apply the recurrence (5.8) to obtain Pr fB k g = Pr fB k−1 g Pr fA k j B k−1 g', page: 141, body: ['条件概率的分母是 $n$，分子是“未被前 $k-1$ 人占用的天数” $n-(k-1)=n-k+1$，所以 $P(A_k|B_{k-1})=(n-k+1)/n$。', '反复代入 (5.8) 即得 $P(B_k)=\\prod_{i=1}^{k}(n-i+1)/n$；再用 $1+x\\le e^x$（$x=-(i-1)/n$）放缩，得到 $P(B_k)\\le e^{-k(k-1)/(2n)}$。'] },
      ],
      conclusion: '于是“至少一对相同”的概率 $\\ge 1-e^{-k(k-1)/(2n)}$；代入 $n=365$ 得 $k\\ge 23$ 时过半。',
    },
    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '房间里至少有多少人时，“至少一对同生日”的概率超过 1/2？', options: ['20 人', '23 人', '28 人', '30 人'], answer: 1, why: '原书结论：n=365 时 k≥23 即过半（精确约 0.507）。' },
        { kind: 'judge', q: '“生日悖论”里的“悖论”是指所需人数远小于 365（甚至小于 182）。', answer: true, why: '原书明说 far fewer than the number of days in a year。' },
        { kind: 'single', q: '用指示器随机变量，k 个人的期望同生日对数是多少？', options: ['k/365', 'C(k,2)/365', 'k²/365', '1/365'], answer: 1, why: '每对 $E[X_{ij}]=1/n$，共 $\\binom{k}{2}$ 对，线性期望得 $C(k,2)/n$。' },
        { kind: 'judge', q: '原书用指示器法得到的人数（使 E[X]≥1）比用概率法得到的人数（使 P≥1/2）更大。', answer: true, why: '28 > 23；指示器法算的是期望对数而非“至少一对”的概率。' },
        { kind: 'simulate', q: 'n=365、k=28 时，期望同生日对数 E[X] 约为多少？', expect: [1.0356, 1.04], placeholder: '例如：1.0356', why: 'E[X]=28·27/(2·365)≈1.0356。' },
        { kind: 'single', q: '近似公式 1 − e^{−k(k−1)/(2n)} ≥ 1/2 推出 k(k−1) ≥ ?', options: ['2n', '2n ln 2', 'n', 'n ln 2'], answer: 1, why: '由 $e^{-k(k-1)/(2n)}\\le 1/2$ 取对数得 $k(k-1)\\ge 2n\\ln 2$。' },
        { kind: 'judge', q: '概率法（23 人）与指示器法（28 人）所需人数，渐近都是 Θ(√n)。', answer: true, why: '原书末句：两种方法人数相同渐近地是 $\\Theta(\\sqrt{n})$。' },
      ],
      bookExercises: [
        { id: '5.4-1', page: 152, star: 0, preview: true,
          statement: 'How many people must there be in a room before the probability that someone has the same birthday as you do is at least 1/2? How many people must there be before the probability that at least two people have a birthday on July 4 is greater than 1/2?',
          hint: '第一问把自己和别人区分开：至少一人与你同生日 = 1 − (364/365)^m，解 m。第二问考虑“July 4 是否被至少两人占据”，用泊松/二项近似。' },
        { id: '5.4-2', page: 152, star: 0, preview: true,
          statement: 'How many people must there be in a room before the probability that two people have the same birthday is at least 0:99? For that many people, what is the expected number of pairs of people who have the same birthday?',
          hint: '别用 5.4-1 的式子：那道是「有人与**我**同生日」，可以用 $1-(364/365)^m$；本题是「**任意**两人同生日」，事件之间不独立。按 5.4 的乘积走：$\\Pr\\{\\text{全不同}\\}=\\prod_{k=1}^{m-1}(1-k/365)$，再用 $1-x\\le e^{-x}$（原书式 (3.14)，p.66）压成 $1-e^{-\\binom{m}{2}/365}$ 去解 $\\ge 0.99$；这一串放缩原书在 p.141–142 对 $\\Pr\\{B_k\\}$ 做过（式 (5.8) 之后），照搬即可。★ 本版第 5 章只有引理 5.1–5.4，没有编号定理，别去找「定理 5.14」。第二问才是指示器随机变量：$\\binom{m}{2}$ 对，每对同生日的概率 $1/365$，期望 $=\\binom{m}{2}/365$。' },
      ],
    },
  ],
};
