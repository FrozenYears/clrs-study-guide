/* 第 5 章 5.2：指示器随机变量。原文锚点：印刷页 130–133。 */

export default {
  key: 's02', id: 'ch05/s02', chapter: 5, section: '5.2',
  title: '指示器随机变量：数清招聘次数', shortTitle: '5.2 指示器随机变量',
  titleEn: 'Indicator random variables',
  source: { printed: [130, 133], pdf: [151, 154] },
  sourceNote: '本关对应原书 5.2 节（印刷页 130–133）。',
  prerequisites: [{ label: '5.1 The hiring problem', url: '#/ch05/s01' }],
  stages: [
    { type: 'map', title: '把一次复杂计数拆成许多个 0/1 事件',
      why: '指示器随机变量把事件编码成 0 或 1；把它们相加，就能直接计算招聘次数、正面次数等总量的期望。',
      position: '5.1 建立招聘问题与随机排列模型；本关用指示器和线性期望得到平均招聘次数；5.3 再分析随机化算法。',
      unlocks: [{ label: '5.3 Randomized algorithms', url: '#/ch05/s03' }],
      mathKit: [
        { title: '指示器', body: '事件 $A$ 发生时 $I_A=1$，否则 $I_A=0$。' },
        { title: '线性期望', body: '$E[X_1+\\cdots+X_n]=E[X_1]+\\cdots+E[X_n]$，不要求独立。' },
        { title: '调和级数', body: '$H_n=\\sum_{i=1}^n1/i=\\ln n+O(1)$。' },
      ],
    },
    { type: 'intuition', title: '每次招聘都亮一盏小灯', scene: '把每位候选人旁边放一盏灯：被聘用亮 1，没被聘用亮 0',
      body: ['总招聘人数就是所有灯的亮度之和。单盏灯的期望亮度等于它亮起的概率。', '在随机排列中，第 $i$ 位候选人成为前 $i$ 人中的最佳者的概率是 $1/i$；把这些概率相加，就得到平均招聘人数 $H_n$。'],
      interactive: { text: '阶段 5 的曲线同时画出 $H_n$ 与 $\\ln n$；拖动输入规模，观察两者越来越接近。' }, },
    { type: 'source', title: '书上是怎么说的', lead: '原文保留 PDF 抽取后的记号与空格；中文解读只负责把每一步连起来。', blocks: [
      { kind: 'body', page: 130, en: 'In order to analyze many algorithms, including the hiring problem, we use indicator random variables. Indicator random variables provide a convenient method for converting between probabilities and expectations. Given a sample space S and an event A, the indicator random variable I fAg associated with event A is defined as I fAg =', zh: '先定义一个只取 0 和 1 的变量，把概率问题转换成期望问题。' },
      { kind: 'body', page: 130, en: 'As a simple example, let us determine the expected number of heads obtained when flipping a fair coin. The sample space for a single coin flip is S = fH,T g, with Pr fH g = Pr fT g = 1/2. We can then define an indicator random variable X H , associated with the coin coming up heads, which i s the event H . This variable counts the number of heads obtained in this flip, and it is 1 if the coin comes up heads and 0 otherwise. We write', zh: '一次公平抛硬币中，正面事件的指示器就是“正面为 1、反面为 0”。' },
      { kind: 'body', page: 130, en: 'The expected number of heads obtained in one flip of the coin is simply the ex- pected value of our indicator variable X H :', zh: '正面数的期望就是这个指示器的期望。' },
      { kind: 'body', page: 130, en: 'Thus the expected number of heads obtained by one flip of a fair coin is 1/2. As the following lemma shows, the expected value of an indicator random variable associated with an event A is equal to the probability that A occurs.', zh: '指示器的基本结论：期望值等于事件发生的概率。' },
      { kind: 'body', page: 131, en: 'Although indicator random variables may seem cumber some for an application such as counting the expected number of heads on a flip of a single coin, they are useful for analyzing situations that perform repeated random trials. In', zh: '单次试验看似多此一举，但重复试验中它能让计数保持清晰。' },
      { kind: 'body', page: 131, en: 'Appendix C, for example, indicator random variables provide a simple way to determine the expected number of heads in n coin flips. One option is to consider separately the probability of obtaining 0 heads, 1 head, 2 heads, etc. to arrive at the result of equation (C.41) on page 1199. Alternati vely, we can employ the simpler method proposed in equation (C.42), which uses indicator random variables implicitly. Making this argument more explicit, let X i be the indicator random variable associated with the event in which the i th flip comes up heads:', zh: '把每次抛硬币的正面事件分别记为 $X_i$，总正面数就是这些变量之和。' },
      { kind: 'body', page: 131, en: 'By Lemma 5.1, the expectation of each of the random variables is E [X i ] = 1/2 for i = 1,2,…,n . Then we can compute the sum of the expectations: P n i D1 E [X i ] = n/2. But equation (5.2) calls for the expectation of the sum, not the sum of the ex- pectations. How can we resolve this conundrum? Linearity of expectation, equation (C.24) on page 1192, to the rescue: the expectation of the sum always equals the sum of the expectations. Linearity of expectation applies even when there is dependence among the random variables. Combining in dicator random variables with linearity of expectation gives us a powerful technique to compute expected values when multiple events occur. We now can compute the expected number of heads:', zh: '线性期望把“和的期望”换成“期望的和”，即使变量彼此相关也成立。' },
      { kind: 'body', page: 132, en: 'To use indicator random variables, instead of computing E [X ] by defining just one variable denoting the number of times you hire a new office assistant, think of the process of hiring as repeated random trials and define n variables indicating whether each particular candidate is hired. In part icular, let X i be the indicator random variable associated with the event in which the i th candidate is hired. Thus, X i = I fcandidate i is hiredg', zh: '招聘问题中，$X_i$ 表示第 $i$ 位候选人是否被聘用，$X$ 是全部 $X_i$ 的和。' },
      { kind: 'body', page: 132, en: 'Candidate i is hired, in line 6, exactly when candidate i is better than each of candidates 1 through i − 1. Because we have assumed that the candidates arrive in a random order, the first i candidates have appeared in a random order. Any one of these first i candidates is equally likely to be the best qualified so far. Candidate i has a probability of 1/i of being better qualified than candidates 1 through i − 1 and thus a probability of 1/i of being hired. By Lemma 5.1, we conclude that E [X i ] = 1/i : (5.4)', zh: '前 $i$ 人中每个人成为最佳者的机会相同，所以第 $i$ 人被聘用的概率和期望都是 $1/i$。' },
      { kind: 'body', page: 133, en: 'Even though you interview n people, you actually hire only approximately ln n of them, on average. We summarize this result in the following lemma.', zh: '面试仍是 $n$ 次，但平均招聘人数只有约 $\\ln n$。' },
    ], terms: [{ en: 'indicator random variable', zh: '指示器随机变量', page: 130 }, { en: 'linearity of expectation', zh: '期望的线性', page: 131 }, { en: 'harmonic series', zh: '调和级数', page: 133 }] },
    { type: 'pseudocode', title: '教学整理：把总数写成指示器之和', algo: null, signature: 'EXPECTED-HIRES(n)', page: 132,
      lines: [
        { n: 1, code: 'X = 0', zh: '用 X 累加实际招聘次数。' },
        { n: 2, code: 'for i = 1 to n', zh: '为每个候选人定义一个指示器 $X_i$。' },
        { n: 3, code: 'X_i = I{candidate i is hired}', zh: '被聘用取 1，否则取 0。' },
        { n: 4, code: 'E[X] = Σ E[X_i]', zh: '应用线性期望，不需要独立性。' },
        { n: 5, code: 'E[X_i] = 1 / i', zh: '随机排列使第 $i$ 人成为前缀最佳者的概率为 $1/i$。' },
        { n: 6, code: 'E[X] = Σ(i=1..n) 1 / i = H_n', zh: '得到调和数，并用 $H_n=\\ln n+O(1)$ 估计增长。' },
      ], vars: [{ name: 'X_i', meaning: '第 i 位候选人是否被聘用的指示器' }, { name: 'X', meaning: '总招聘人数，X = X₁ + … + Xₙ' }, { name: 'H_n', meaning: '第 n 个调和数，Σ(1/i)' }], note: '这是一份教学整理，不是原书独立的程序伪代码块；原书结论与公式均在阶段 3 引述。' },
    { type: 'visualize', title: '看见调和级数慢慢追上 ln n', viz: 'growth', chart: { xMax: 64, series: [{ name: 'Hₙ ≈ ln n + γ', expr: 'Math.log(n) + 0.5772156649', color: '--viz-active' }, { name: 'ln n', expr: 'Math.log(n)', color: '--viz-done' }] }, note: '曲线用 $H_n\\approx\\ln n+\\gamma$ 展示渐近关系；实际调和和由阶段 6 的 C 程序直接计算。', invariants: [], presets: [], tasks: ['把 n 从 8 拖到 64，比较两条曲线的垂直距离。', '估算 n=16 时的平均招聘人数，并与最坏情况 n 比较。', '解释为什么线性期望不需要候选人是否被聘用相互独立。'] },
    { type: 'code', title: '用 C 计算调和和与期望招聘人数', intro: '程序计算调和和与公平抛硬币的期望正面数；断言把小规模结果钉死。', pseudocodeRef: 'EXPECTED-HIRES', c: { file: 'indicator_random_variables.c', code: String.raw`/* indicator_random_variables.c -- 5.2 节指示器随机变量的数值验证。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

static double harmonic_sum(int n)
{
    double total = 0.0;
    for (int i = 1; i <= n; i++) {
        total += 1.0 / (double)i;
    }
    return total;
}

static double expected_heads(int n)
{
    return (double)n / 2.0;
}

static void close_to(double actual, double expected)
{
    assert(fabs(actual - expected) < 1e-9);
}

int main(void)
{
    close_to(harmonic_sum(1), 1.0);
    close_to(harmonic_sum(2), 1.5);
    close_to(harmonic_sum(5), 2.283333333333333);
    close_to(expected_heads(10), 5.0);
    close_to(harmonic_sum(10), 2.928968253968254);
    printf("H_10 = %.12f\n", harmonic_sum(10));
    printf("E[heads in 10 flips] = %.1f\n", expected_heads(10));
    puts("indicator random variables checks passed.");
    return 0;
}
`, }, mapping: [{ pc: 1, pcCode: 'X = 0', c: '`double total = 0.0;` 初始化期望和。' }, { pc: 2, pcCode: 'for i = 1 to n', c: '`for (int i = 1; i <= n; i++)`。' }, { pc: 3, pcCode: 'X_i = I{candidate i is hired}', c: '`1.0 / i` 是指示器期望。' }, { pc: 4, pcCode: 'E[X] = Σ E[X_i]', c: '`total += ...` 体现线性期望。' }, { pc: 5, pcCode: 'E[X_i] = 1 / i', c: '`1.0 / (double)i` 避免整数除法。' }, { pc: 6, pcCode: 'E[X] = Σ(i=1..n) 1 / i = H_n', c: '`harmonic_sum` 返回 Hₙ。' }] },
    { type: 'analyze', title: '从概率到平均招聘成本', intro: '先为每次可能招聘定义指示器，再逐项取期望；最后用调和级数估计总量。', claims: [{ expr: 'E[X_i] = 1/i', when: '第 i 位候选人被聘用的期望指示器', page: 132, source: 'book' }, { expr: 'E[X] = H_n = ln n + O(1)', when: '总招聘人数的期望', page: 133, source: 'book' }, { expr: 'O(c_h ln n)', when: '随机排列下的平均招聘成本', page: 133, source: 'book' }, { expr: 'O(c_h n)', when: '严格递增顺序的最坏招聘成本', page: 127, source: 'book', preview: true }], tables: [{ caption: '关键等式', rows: [['对象', '结果'], ['指示器', '$E[X_A]=Pr(A)$'], ['总招聘人数', '$X=ΣX_i$'], ['期望招聘人数', '$E[X]=Σ1/i=H_n$'], ['平均招聘成本', '$O(c_h ln n)$']] }], chart: { xMax: 32, series: [{ name: 'Hₙ', expr: 'Math.log(n) + 0.5772156649' }, { name: 'ln n', expr: 'Math.log(n)' }] }, derivations: [{ kind: 'summation', title: '招聘次数的期望', steps: [{ tex: 'X=\\sum_{i=1}^{n}X_i', zh: '把每个候选人是否被聘用作为一项。' }, { tex: 'E[X]=\\sum_{i=1}^{n}E[X_i]', zh: '使用线性期望，不要求独立。' }, { tex: 'E[X]=\\sum_{i=1}^{n}\\frac1i=H_n=\\ln n+O(1)', zh: '调和级数给出平均招聘人数的增长量级。' }] }], note: '面试费用仍是固定的 $c_i n$；本节计算的是招聘费用这一随机部分。' },
    { type: 'prove', title: '为什么指示器期望就是概率', statement: 'Then E [X A ] = Pr fAg.', page: 130, intro: '证明只展开指示器的两个可能取值：事件发生时贡献 1，不发生时贡献 0。', steps: [{ title: '第一步 · 定义取值', en: 'Given a sample space S and an event A in the sample space S , let X A = I fAg.', page: 130, body: ['$X_A$ 只可能取 1 或 0。'] }, { title: '第二步 · 展开期望', en: 'E [X A ] = E [I fAg]', page: 130, body: ['按离散期望定义，把两个取值乘以各自概率。'] }, { title: '第三步 · 化简', en: 'D Pr fAg ; where A denotes S − A, the complement of A.', page: 130, body: ['0 项消失，剩下的就是事件 $A$ 的概率。'] }], conclusion: '因此，数一组事件的期望发生次数时，可以直接把每个事件的概率相加。' },
    { type: 'drill', title: '检验一下', items: [{ kind: 'single', q: '事件 A 的指示器随机变量在 A 发生时取什么值？', options: ['−1', '0', '1', 'Pr(A)'], answer: 2, why: '定义规定发生取 1。' }, { kind: 'judge', q: 'E[I_A] = Pr(A)。', answer: true, why: '这是 Lemma 5.1。' }, { kind: 'single', q: 'n 次公平抛硬币的正面数期望是多少？', options: ['1/2', 'n/2', 'n', 'H_n'], answer: 1, why: '每次正面期望为 1/2，线性期望给出 n/2。' }, { kind: 'judge', q: '应用线性期望必须证明变量独立。', answer: false, why: '线性期望即使变量相关也成立。' }, { kind: 'single', q: '随机排列下，第 i 位候选人被聘用的概率是多少？', options: ['1/n', '1/2', '1/i', 'i/n'], answer: 2, why: '前 i 位中任何一位成为最佳者的机会相同。' }, { kind: 'simulate', q: 'n=4 时，期望招聘人数 H₄ 是多少？', expect: [2.0833333333, 2.08], placeholder: '例如：2.0833', why: 'H₄=1+1/2+1/3+1/4。' }, { kind: 'single', q: '随机排列下平均招聘成本的量级是？', options: ['O(c_h)', 'O(c_h ln n)', 'O(c_h n²)', 'O(c_i n)'], answer: 1, why: 'E[X]=H_n=ln n+O(1)。' }], bookExercises: [{ id: '5.2-1', page: 133, star: 0, statement: 'In HIRE-ASSISTANT, assuming that the candidates are presented in a random order, what is the probability that you hire exactly one time? What is the probability that you hire exactly n times?', hint: '「雇 Exactly once」$\\iff$ 第 1 位就是全体里最好的 —— 随机顺序下首位是最佳的概率 $1/n$。「雇 Exactly n times」$\\iff$ 每来一个都刷新纪录，即简历按名次严格递增到达 —— $n!$ 个到达顺序里只有 1 个满足，概率 $1/n!$。★ 自查用小情形：$n = 3$ 穷举 6 个排列，雇一次 2 个、雇三次 1 个，正是 $1/3$ 与 $1/6$（本轮枚举核过）。' }, { id: '5.2-2', page: 133, star: 0, statement: 'In HIRE-ASSISTANT, assuming that the candidates are presented in a random order, what is the probability that you hire exactly twice?', hint: '先翻译成「前缀最大值恰好出现两次」，再按全局最佳出现的位置 $m$ 分类：$m$ 必须是 $\\ge 2$（否则只有一次），且第 1 位得是前 $m-1$ 人里最好的 —— 前面若再出现一个新高，雇佣就成三次了。于是 $\\Pr = \\sum_{m=2}^{n} \\frac{1}{n} \\cdot \\frac{1}{m-1} = \\frac{H_{n-1}}{n}$，其中 $H_{n-1} = \\sum_{k=1}^{n-1} 1/k = \\lg n + O(1)$。★ 本轮拿 $n = 2..7$ 的全部排列穷举对过，逐点与公式一致。' }, { id: '5.2-3', page: 133, star: 0, statement: 'Use indicator random variables to compute the expected value of the sum of n dice.', hint: '对第 $i$ 枚骰子用「至少为 $k$」这组指示器：$X_i = \\sum_{k=1}^{6} X_{ik}$，其中 $X_{ik} = 1$ 当且仅当第 $i$ 枚 $\\ge k$，于是 $E[X_i] = \\sum_k \\Pr[X_{ik} = 1] = \\frac{6+5+4+3+2+1}{6} = 3.5$。总和的期望 $= \\sum_i E[X_i] = \\frac{7n}{2}$。★ 这里不要求独立（期望可加性不要求），但要点明指示器**覆盖**了每个可能点数。' }, { id: '5.2-4', page: 134, star: 0, statement: 'This exercise asks you to (partly) verify that line arity of expectation holds even if the random variables are not independent. Consid er two 6-sided dice that are rolled independently. What is the expected value of the sum? Now consider the case where the first die is rolled normally and then the second die is set equal to the value shown on the first die. What is the expected value of the sum? Now consider the case where the first die is rolled normally and the second die is set equal to 7 minus the value of the first die. What is the expected value of the sum?', hint: '两种情形分开算，再对比：独立：$E[X] = E[Y] = 3.5$，可加性给 $E[X+Y] = 7$。第二枚抄第一枚：$X + Y = 2X$，$E[2X] = 2 \\times 3.5 = 7$ —— 一样。★ 结论正是题干要的那句话：期望的可加性**不依赖独立**。顺手对照：方差就不行了，独立时 $V[X+Y] = V[X]+V[Y]$，抄写时 $V[2X] = 4V[X]$。' }, { id: '5.2-5', page: 134, star: 0, statement: 'Use indicator random variables to solve the following problem, which is known as the hat-check problem. Each of n customers gives a hat to a hat-check person at a restaurant. The hat-check person gives the hats back to the customers in a random order. What is the expected number of customers who get back their own hat?', hint: '给每位顾客一个指示器 $X_i = [第 i 位拿回自己的帽子]$。固定 $i$：$n!$ 种还帽顺序里有 $(n-1)!$ 种把第 $i$ 顶还给他，故 $\\Pr[X_i = 1] = 1/n$，$E[X_i] = 1/n$，总和 $E[X] = n \\cdot 1/n = 1$。★ 别绕进去算「至少一人拿对」的容斥（那是另一个问题，答案是 $1 - 1/e$ 量级）；这里各 $X_i$ **不独立**，但期望可加性不需要独立。' }, { id: '5.2-6', page: 134, star: 0, statement: 'Let A[1 : n] be an array of n distinct numbers. If i <j and A[i ] > A[j ], then the pair (i,j) is called an inversion of A. (See Problem 2-4 on page 47 for more on inversions.) Suppose that the elements of A form a uniform random permutation of ⟨1,2,…,n⟩. Use indicator random variables to compute the expected number of inversions.', hint: '对每一对位置 $i < j$ 立指示器 $X_{ij} = [A[i] > A[j]]$，逆序总数 $X = \\sum_{i<j} X_{ij}$。随机排列里这两个位置上的两个数谁大谁小等可能，故 $E[X_{ij}] = 1/2$；$E[X] = \\binom{n}{2} / 2 = \\frac{n(n-1)}{4}$。★ 要点在「只对一对位置取期望」：位置数不是随机的，随机性被推到每对身上。' }] },
  ],
};
