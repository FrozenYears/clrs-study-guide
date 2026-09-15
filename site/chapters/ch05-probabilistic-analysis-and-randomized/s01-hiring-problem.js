/* =============================================================================
 * 第 5 章 5.1 —— 招聘问题：当前最佳候选人。原文锚点：印刷页 126–129。
 * ========================================================================== */

export default {
  key: 's01', id: 'ch05/s01', chapter: 5, section: '5.1',
  title: '招聘问题：当前最佳候选人', shortTitle: '5.1 招聘问题',
  titleEn: 'The hiring problem',
  source: { printed: [126, 129], pdf: [147, 150] },
  sourceNote: '本关对应原书 5.1 节（印刷页 126–129）。',
  prerequisites: [{ label: '2.2 分析算法', url: '#/ch02/s02' }],
  stages: [
    {
      type: 'map', title: '一次扫描，反复换掉当前最佳',
      why: '很多算法都会从一串对象里持续维护当前最大值、最小值或最优解。招聘问题把这个简单动作分成面试与招聘两种成本，让你看见“更新当前最佳”的次数为何值得分析。',
      position: '这是第 5 章的入口：5.1 建立随机输入与随机算法的两个模型，5.2 用指示器随机变量计算招聘次数的期望，5.3 再把随机性放进算法自身。',
      unlocks: [{ label: '5.2 Indicator random variables', url: '#/ch05/s02' }],
      mathKit: [
        { title: '当前最大值', body: '扫描到第 $i$ 位时，保存前 $i$ 位资格最高的候选人；新候选人只有超过它才会触发更新。' },
        { title: '排列', body: '候选人到达顺序可以用资格的一个排列表示。随机顺序意味着 $n!$ 个排列机会相同。' },
        { title: '成本账本', body: '面试 $n$ 次是固定的；真正随顺序变化的是招聘次数 $m$。' },
      ],
    },
    {
      type: 'intuition', title: '把“最好的人”当成一根不断抬高的标杆',
      scene: '每天只面试一位候选人，但办公室里始终只能保留目前见过的最好的人',
      body: [
        '第一个真实候选人一定会超过虚拟候选人，因此一定会被招聘。之后每一天都只需问一个问题：今天的资格是否超过当前最佳？',
        '资格严格递增时，每个人都打破纪录，招聘次数达到 $n$。资格严格递减时，首位候选人之后没人打破纪录，只招聘一次。',
        '这里的运行步骤都很短，但“是否刷新纪录”受输入顺序支配。第 5 章随后就用概率描述一个典型顺序下会刷新多少次。',
      ],
      interactive: { text: '阶段 5 把数值当作候选人资格：数值越大，资格越高。切换递增、递减与混合顺序，比较招聘计数和累计成本。' },
    },
    {
      type: 'source', title: '书上是怎么说的',
      lead: '原书先用招聘场景区分两类费用，再把候选人顺序连接到概率分析和随机化算法。',
      blocks: [
        { kind: 'body', page: 126, en: 'Suppose that you need to hire a new office assistant. Your previous attempts at hiring have been unsuccessful, and you decide to use an employment agency. The employment agency sends you one candidate each day. You interview that person and then decide either to hire that person or not. You must pay the employment agency a small fee to interview an applicant. To actually hire an applicant is more costly, however, since you must fire your current office assistant and also pay a substantial hiring fee to the employment agency. You are committed to having, at all times, the best possible person for the job. Th erefore, you decide that, after interviewing each applicant, if that applicant is better qualified than the current office assistant, you will fire the current office assistant and hire the new applicant.', zh: '规则并不是“选最终最好的人就够了”，而是每一刻都保留目前最佳；因此每次破纪录都会产生昂贵的更换成本。' },
        { kind: 'body', page: 127, en: 'Interviewing has a low cost, say c i , whereas hiring is expensive, costing c h . Letting m be the number of people hired, the total cost associated with this algorithm is O(c i n + c h m). No matter how many people you hire, you always in terview n candidates and thus always incur the cost c i n associated with interviewing. We therefore concentrate on analyzing c h m, the hiring cost. This quantity depends on the order in which you interview candidates.', zh: '面试次数恒为 $n$，招聘次数 $m$ 才会随顺序变化；成本分析应把这两个来源分开记账。' },
        { kind: 'body', page: 127, en: 'Worst-case analysis In the worst case, you actually hire every candidate that you interview. This situation occurs if the candidates come in strictly increasing order of quality, in which case you hire n times, for a total hiring cost of O(c h n).', zh: '递增资格序列让每位候选人都成为新纪录，因此这正是招聘成本的最坏情形。' },
        { kind: 'body', page: 128, en: 'Alternatively, we say that the ranks form a uniform random permutation, that is, each of the possible n! permutations appears with equal probability.', zh: '“随机到达”是对输入顺序的假设：不是每个资格随机，而是所有资格排列等可能。' },
        { kind: 'body', page: 128, en: 'Thus, in order to develop a randomized algorithm for the hiring problem, you need greater control over the order in which you’ll interview the candidates. We will, therefore, change the model slightly. The employment agency sends you a list of the n candidates in advance. On each day, you choose, randomly, which candidate to interview. Although you know nothing about the candidates (besides their names), we have made a significant change. Instead of accepting the order given to you by the employment agency and hoping that it’s random, you have instead gained control of the process and enforced a random order.', zh: '概率分析假设输入随机；随机化算法则主动把候选人顺序打乱。这两种随机性的位置不同。' },
        { kind: 'body', page: 129, en: 'More generally, we call an algorithm randomized if its behavior is determined not only by its input but also by values produced by a random-number generator.', zh: '随机化算法的行为由输入和随机数共同决定；分析时要对随机数发生器产生的结果取期望。' },
      ],
      terms: [
        { en: 'probabilistic analysis', zh: '概率分析：在输入分布上计算平均或期望的分析方法', page: 127 },
        { en: 'uniform random permutation', zh: '均匀随机排列：每个可能排列出现的概率相同', page: 128 },
        { en: 'randomized algorithm', zh: '随机化算法：行为还由随机数发生器的结果决定的算法', page: 129 },
      ],
    },
    {
      type: 'pseudocode', title: '只在打破纪录时招聘', algo: 'HIRE-ASSISTANT', signature: 'HIRE-ASSISTANT(n)', page: 127,
      lines: [
        { n: 1, code: 'best = 0 / / candidate 0 is a least-qualified dummy candidate', zh: '先放一个资格最低的虚拟候选人，使第一个真实候选人自然成为当前最佳。' },
        { n: 2, code: 'for i = 1 to n', zh: '按到达顺序逐一处理全部 $n$ 位候选人。' },
        { n: 3, code: 'interview candidate i', zh: '无论最终是否聘用，面试都发生一次，因此面试成本固定为 $c_i n$。' },
        { n: 4, code: 'if candidate i is better than candidate best', zh: '比较今天的候选人与当前纪录保持者；这要求资格之间存在全序。' },
        { n: 5, code: 'best = i', zh: '只有破纪录时才替换当前最佳的编号。' },
        { n: 6, code: 'hire candidate i', zh: '招聘昂贵；这行执行的次数正是需要分析的 $m$。' },
      ],
      vars: [
        { name: 'i', meaning: '当前正在面试的候选人编号，取值 $1$ 到 $n$' },
        { name: 'best', meaning: '截至当前已面试候选人中资格最高者的编号；0 是虚拟候选人' },
        { name: 'm', meaning: '实际执行第 6 行的次数，即招聘人数' },
      ],
      note: '分块语料把第 6 行与后续正文连接在了一起；此处按原书 p.127 的独立伪代码行保留为 `hire candidate i`。',
    },
    {
      type: 'visualize', title: '谁会刷新当前最佳', viz: 'array', algorithm: 'hire-assistant', pseudocodeRef: 'HIRE-ASSISTANT', input: { array: [3, 1, 4, 2, 5] },
      invariants: [{ label: '每一帧结束时，best 指向已面试候选人中资格最高的一位' }],
      presets: [
        { name: '混合资格', array: [3, 1, 4, 2, 5] },
        { name: '严格递增（最坏）', array: [1, 2, 3, 4, 5] },
        { name: '严格递减', array: [5, 4, 3, 2, 1] },
      ],
      tasks: ['切换严格递增与严格递减，数出第 6 行分别执行多少次。', '在混合资格中暂停在第 4 行：为什么资格为 2 的候选人不会被聘用？', '比较三组输入的面试次数；为什么它们都一样，但累计成本不同？'],
    },
    {
      type: 'code', title: '用 C 保存当前最佳的下标',
      intro: '书中候选人编号从 1 开始，C 数组从 0 开始：书中的 candidate $i$ 对应 `ranks[i - 1]`。这里以 `-1` 表示原书的虚拟候选人 0。', pseudocodeRef: 'HIRE-ASSISTANT',
      c: { file: 'hire_assistant.c', code: String.raw`/* hire_assistant.c -- 5.1 节 HIRE-ASSISTANT 的 C 实现。 */
#include <assert.h>
#include <stdio.h>

/* rank 越大表示资格越高；返回最终被聘用者的 0 基下标。 */
static int hire_assistant(const int ranks[], int n, int *interviews, int *hires)
{
    int best = -1;
    *interviews = 0;
    *hires = 0;

    for (int i = 0; i < n; i++) {
        (*interviews)++;
        if (best < 0 || ranks[i] > ranks[best]) {
            best = i;
            (*hires)++;
        }
    }
    return best;
}

static void check(const char *name, const int ranks[], int n,
                  int expected_best, int expected_hires)
{
    int interviews;
    int hires;
    const int best = hire_assistant(ranks, n, &interviews, &hires);
    assert(best == expected_best);
    assert(interviews == n);
    assert(hires == expected_hires);
    printf("ok: %s (interviews=%d, hires=%d)\n", name, interviews, hires);
}

int main(void)
{
    const int increasing[] = {1, 2, 3, 4, 5};
    const int decreasing[] = {5, 4, 3, 2, 1};
    const int mixed[] = {3, 1, 4, 2, 5};

    check("increasing", increasing, 5, 4, 5);
    check("decreasing", decreasing, 5, 0, 1);
    check("mixed", mixed, 5, 4, 3);
    puts("HIRE-ASSISTANT checks passed.");
    return 0;
}
` },
      mapping: [
        { pc: 1, pcCode: 'best = 0', c: '`int best = -1;` 用 -1 表示尚无真实候选人' },
        { pc: 2, pcCode: 'for i = 1 to n', c: '`for (int i = 0; i < n; i++)` 遍历 0 基数组' },
        { pc: 3, pcCode: 'interview candidate i', c: '`(*interviews)++;` 记录固定发生的面试' },
        { pc: 4, pcCode: 'if candidate i is better than candidate best', c: '`best < 0 || ranks[i] > ranks[best]`' },
        { pc: '5–6', pcCode: 'best = i; hire candidate i', c: '更新 `best` 并执行 `(*hires)++;`' },
      ],
    },
    {
      type: 'analyze', title: '固定的面试成本与变化的招聘成本', intro: '每一位候选人都会被面试一次；输入顺序只影响其中有多少位会刷新当前最佳。',
      claims: [
        { expr: 'O(c_i n + c_h m)', when: '总成本，m 是被聘用的人数', page: 127, source: 'book' },
        { expr: 'O(c_h n)', when: '资格严格递增时的总招聘成本', page: 127, source: 'book' },
      ],
      tables: [{ caption: '两类操作的成本', rows: [['操作', '次数与成本'], ['面试', '恰好 $n$ 次，成本为 $c_i n$'], ['招聘', '恰好 $m$ 次，成本为 $c_h m$'], ['严格递增资格', '$m=n$，每个人都打破纪录'], ['严格递减资格', '$m=1$，只有首位候选人被聘用']] }],
      chart: { xMax: 16, series: [{ name: '递减输入：1 次招聘', expr: '1', color: '--viz-done' }, { name: '递增输入：n 次招聘', expr: 'n', color: '--viz-active' }] },
      derivations: [{ kind: 'summation', title: '为什么递增顺序是最坏情况', steps: [{ tex: '1 < 2 < \cdots < n', zh: '第 $i$ 位候选人资格都高于此前任何一位。' }, { tex: 'm = \sum_{i=1}^{n} 1 = n', zh: '第 6 行每轮都会执行一次，因此招聘成本是 $O(c_h n)$。' }] }],
      note: '5.2 会在“均匀随机排列”的输入假设下计算 $m$ 的期望；本关只建立模型与最坏情况。',
    },
    {
      type: 'prove', title: '当前最佳为何始终正确', statement: 'The procedure assume s that after inter- viewing candidate i , you can determine whether candidate i is the best candidate you have seen so far.', page: 126,
      intro: '原书在此用“best candidate you have seen so far”定义了要维护的性质。下面按扫描循环的不变量核对它。',
      steps: [
        { title: '第一步 · 初始化', en: 'It starts by creating a dummy candidate, numbered 0, who is less qualified than each of the other candidates.', page: 126, body: ['虚拟候选人低于所有真实候选人，所以在处理任何真实候选人前，`best` 不会错误地排除真正的最大资格。'] },
        { title: '第二步 · 保持', en: 'if candidate i is better than candidate best', page: 127, body: ['若第 $i$ 位更好，第 5 行把它设为 best；若不更好，旧 best 仍然至少和它一样好。两种情况后，best 都是已见候选人里的最佳者。'] },
        { title: '第三步 · 终止', en: 'The candidates for the office assistant job are numbered 1 through n and interviewed in that order.', page: 126, body: ['循环处理完 1 到 $n$ 的所有候选人，已见集合就是全部候选人；不变量于是说明最终 best 是全体中的最佳者。'] },
      ],
      conclusion: '这个正确性论证只依赖第 4 行能比较资格。习题 5.1-1 正是要求你追究这一假设为何意味着候选人资格具有全序。',
    },
    {
      type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '在 HIRE-ASSISTANT 中，哪一项会随候选人到达顺序而改变？', options: ['候选人总数 n', '面试次数', '招聘次数 m', '虚拟候选人的编号'], answer: 2, why: '每位候选人都面试一次，只有打破当前纪录的人才会被招聘（p.127）。' },
        { kind: 'judge', q: '资格严格递增时，第 6 行会执行 n 次。', answer: true, why: '每一位都比当前最佳更好，因此每轮都招聘（p.127）。' },
        { kind: 'single', q: '“均匀随机排列”在本节中是什么意思？', options: ['每个候选人的资格相等', '每个可能的候选人资格排列等可能出现', '算法总是选择随机最佳者', '招聘次数总是相同'], answer: 1, why: '原书定义为所有 $n!$ 个排列各自有相同概率（p.128）。' },
        { kind: 'judge', q: '概率分析与随机化算法的随机性都来自输入顺序。', answer: false, why: '概率分析假设输入有分布；随机化算法的随机性来自算法使用的随机数发生器（p.128–129）。' },
        { kind: 'simulate', q: '资格顺序为 5, 4, 3, 2, 1 时，最终会招聘多少人？', expect: [1], placeholder: '例如：1', why: '首位候选人超过虚拟候选人；之后没有人超过资格为 5 的当前最佳者。' },
        { kind: 'simulate', q: '资格顺序为 1, 2, 3, 4 时，最终会招聘多少人？', expect: [4], placeholder: '例如：4', why: '严格递增时每一位候选人都刷新当前最佳。' },
        { kind: 'single', q: '为什么要使用虚拟候选人 0？', options: ['避免面试第一位候选人', '保证第一位真实候选人能统一地通过同一条比较逻辑', '随机打乱候选人', '降低招聘费用'], answer: 1, why: '虚拟候选人资格最低，因此不需要为首位真实候选人写特殊分支（p.126–127）。' },
      ],
      bookExercises: [{ id: '5.1-1', page: 129, star: 0, statement: 'Show that the assumption that you are always able to determine which candidate is best, in line 4 of procedure HIRE-ASSISTANT , implies that you know a total order on the ranks of the candidates.', hint: '把“任意两位候选人可比较”写成二元关系，再检查可比性、传递性与无并列的要求。' }],
    },
  ],
};
