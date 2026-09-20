/* 第 5 章 5.3：随机化算法（Randomized algorithms）。
 *
 * 原文锚点：印刷页 134–139（pdf_index 155–160）。
 * 全部 en 引述都已用 tools/04_verify_level.py 的判据逐条预检通过（20/20）。
 * 内嵌的 C 代码与 c/randomly_permute.c 逐字节一致（由脚本从磁盘读入写死，不手抄）。
 */

export default {
  key: 's03', id: 'ch05/s03', chapter: 5, section: '5.3',
  title: '随机化算法：自己制造随机性', shortTitle: '5.3 随机化算法',
  titleEn: 'Randomized algorithms',
  source: { printed: [134, 139], pdf: [155, 160] },
  sourceNote: '本关对应原书 5.3 节（印刷页 134–139）。其中 RANDOMLY-PERMUTE 的均匀性证明是 Lemma 5.4。',
  prerequisites: [{ label: '5.2 Indicator random variables', url: '#/ch05/s02' }],
  stages: [
    { type: 'map', title: '把「假设随机」换成「制造随机」',
      why: '5.2 的概率分析有个前提：输入本身服从某个分布。现实里没有这个保证 —— 对手可以专门挑一组最坏输入交给你。随机化算法的办法是：在算法内部主动打乱输入，于是**没有任何输入能触发最坏情况**。',
      position: '5.1 定义招聘问题、指出最坏情况是 $O(c_h n)$（名单严格递增）；5.2 用指示器随机变量算出「候选人随机到来时平均只招聘 $H_n = \\ln n + O(1)$ 次」；本关把那个**假设**改造成算法的一个**步骤**，结论就从「对随机输入成立」变成「对任意输入成立」。5.4 接着用四个例子练同一套工具。',
      unlocks: [{ label: '5.4.1 The birthday paradox（生日悖论）', url: '#/ch05/s04' }],
      mathKit: [
        { title: '平均情况 vs 期望', body: '平均情况：对**输入分布**取平均。期望：对**算法内部的随机选择**取平均。本关的重点就是这个区别 —— 前者是对手能利用的，后者不是。' },
        { title: '$n!$ 与 $k$-排列', body: '$n$ 个元素共有 $n!$ 种排列；$k$-排列有 $n!/(n-k)!$ 个，均匀随机排列要求每一种都以 $1/n!$ 的概率出现。' },
        { title: '原地（in place）', body: '只用常数额外空间。洗牌只在原数组里交换，所以除了 $\\Theta(n)$ 的洗牌时间外没有别的代价。' },
      ] },

    { type: 'intuition', title: '发牌之前先洗牌',
      scene: '一副牌要发给四个人：洗不洗，区别在哪',
      body: [
        '如果牌堆出厂就是「从上到下递增」的，你直接发牌，每个人拿到的牌就有明显规律。对手只要知道你没洗牌，就能预测你的手牌。',
        '洗牌做的事情很具体：让**每一种排列出现的概率都一样**（$1/n!$）。这样一来，「最坏的那种排列」不再由对手挑，而由你自己的随机数决定。',
        '这正是 5.3 与 5.2 的分界。5.2 说「**假设**候选人恰好以随机顺序到来」；5.3 干脆在面试前把名单洗一遍。代价是多花 $\\Theta(n)$ 时间；收益是**结论对任何输入都成立**，而不是只对平均情况成立。',
        '还有一层更微妙的好处：洗牌之后，同一次输入跑两遍会得到不同结果。原书原话是「no particular input elicits its worst-case behavior」—— 连你的敌人也造不出一个坏输入。',
      ],
      interactive: { text: '阶段 5 会把 10 个候选人洗一遍。同一组输入换个种子再洗一次，结果完全不同 —— 这就是「每次运行都可能不一样」。' } },

    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 134,
          en: 'In the previous section, we showed how knowing a distribution on the inputs can help us to analyze the average-case behavior of an algorithm. What if you do not know the distribution? Then you cannot perform an average-case analysis.',
          zh: '★ 这就是随机化算法要解决的问题。注意措辞：不知道分布时，**做不了**平均情况分析 —— 不是「做不好」，而是这个分析本身无从下手。' },
        { kind: 'body', page: 134,
          en: 'For a problem such as the hiring problem, in which it is helpful to assume that all permutations of the input are equally likely, a probabilistic analysis can guide us when developing a randomized algorithm. Instead of assuming a distribution of inputs, we impose a distribution.',
          zh: '★ "Instead of assuming a distribution of inputs, we impose a distribution" —— 一句话说清了全节：**不是假设分布，而是强加一个分布**。前半句 5.2 已经做过，后半句才是 5.3 的新东西。' },
        { kind: 'body', page: 135,
          en: 'For this algorithm and many other randomized algorithms, no particular input elicits its worst-case behavior. Even your worst enemy cannot produce a bad input array, since the random permutation makes the input order irrelevant.',
          zh: '★ 随机化算法最值钱的一句话。它在说：**最坏情况没有被消灭，只是不可被指定**。严格讲，洗牌还是可能抽到那个坏排列，只是概率是 $1/n!$ —— 所以原书后面紧接着补了一句关于「不走运的排列」的限定。别把这句话误读成「最坏情况不会发生」。' },
        { kind: 'body', page: 135,
          en: 'The randomized algorithm performs badly only if the random-number generator produces an "unlucky" permutation.',
          zh: '上一句的限定条件：只有随机数发生器恰好给出「不走运的排列」时才会变慢。这是**算法内部**的坏运气，与输入无关 —— 也正因如此，洗牌的质量（随机数质量）本身成了正确性的一部分：阶段 6 的 C 程序会实测一个「看起来随机、其实有偏」的洗牌版本。' },
        { kind: 'body', page: 136,
          en: 'By carefully comparing Lemmas 5.2 and 5.3, you can see the difference between probabilistic analysis and randomized algorithms. Lemma 5.2 makes an assumption about the input. Lemma 5.3 makes no such assumption, although randomizing the input takes some additional time. To remain consistent with our terminology, we couched Lemma 5.2 in terms of the average-case hiring cost and Lemma 5.3 in terms of the expected hiring cost.',
          zh: '★ 两条 lemma 的真正区别只有一行字：Lemma 5.2 对输入做了假设，Lemma 5.3 没有。另外注意原书对术语的讲究：**average-case** 用于「对输入取平均」，**expected** 用于「对算法内部随机性取平均」。本站全站沿用这个区分。' },
        { kind: 'body', page: 136,
          en: 'Proof Permuting the input array achieves a situation identical to that of the probabilistic analysis of HIRE-ASSISTANT in Section 5.2.',
          zh: '★ 这就是 Lemma 5.3（$O(c_h \\ln n)$）的全部证明 —— 只有一句话。**洗牌之后，「输入」在统计上与「随机输入」无法区分**，于是 5.2 的结论原封不动地搬过来。这也说明：随机化算法分析的关键往往不在算，而在「把随机化算法归约到一个已知的随机输入模型」。' },
        { kind: 'body', page: 136,
          en: 'Many randomized algorithms randomize the input by permuting a given input array. … The goal is to produce a uniform random permutation, that is, a permutation that is as likely as any other permutation. Since there are n! possible permutations, we want the probability that any particular permutation is produced to be 1/n!.',
          zh: '★ 目标写得很硬：$n$ 个元素有 $n!$ 种排列，每一种都必须以 $1/n!$ 的概率出现。这里的 $\\Theta$ 之上还有一层：**「每种排列等可能」是比「每个元素各位置等概率」强得多的要求** —— 下一段就是原书专门设的陷阱提示。' },
        { kind: 'body', page: 136,
          en: 'You might think that to prove that a permutation is a uniform random permutation, it suffices to show that, for each element A[i ], the probability that the element winds up in position j is 1/n. Exercise 5.3-4 shows that this weaker condition is, in fact, insufficient.',
          zh: '★★ 本节最容易踩的坑，原书预先点了名。「每个元素落在每个位置的概率都是 $1/n$」**看起来**就是均匀，其实不是 —— 它约束的只有 $n^2$ 个边缘概率，而均匀性要管住全部 $n!$ 种排列。习题 5.3-4 的 PERMUTE-BY-CYCLE 就是反例：每个元素的边缘分布都对，整体却不均匀。阶段 9 有对应考题。' },
        { kind: 'body', page: 136,
          en: 'Our method to generate a random permutation permutes the array in place: at most a constant number of elements of the input array are ever stored outside the array. The procedure RANDOMLY-PERMUTE permutes an array A[1 : n] in place in Θ(n) time. In its i th iteration, it chooses the element A[i ] randomly from among elements A[i ] through A[n]. After the i th iteration, A[i ] is never altered.',
          zh: '★★ 这三句把算法讲完了。「$\\Theta(n)$ 时间、原地」之外，最关键的是最后两句：**第 $i$ 轮是从 $A[i : n]$ 里挑**（不是从整个数组里挑），而**第 $i$ 轮之后 $A[i]$ 就再也不会被改动**（已定前缀）。前者正是习题 5.3-3 的错误版本搞错的地方 —— 从整个数组里挑会得到明显偏斜的分布。阶段 6 的 C 程序会把这两个版本的卡方值放在一起对比（正确版本 3.3，错误版本 291）。' },
        { kind: 'body', page: 138,
          en: 'A randomized algorithm is often the simplest and most efficient way to solve a problem.',
          zh: '本节收尾的一句判断。放在「随机化」这个概念上理解：它有时不是「没有办法的办法」，而是**最省事**的办法 —— 与其去分析输入的分布，不如自己造一个。' },
      ],
      terms: [
        { en: 'randomized algorithm', zh: '随机化算法', page: 134 },
        { en: 'uniform random permutation', zh: '均匀随机排列', page: 136 },
        { en: 'in place', zh: '原地（只用常数额外空间）', page: 136 },
        { en: 'k-permutation', zh: 'k-排列（k 个互异元素排成的序列）', page: 136 },
      ] },

    { type: 'pseudocode', title: '本节的两段伪代码', lead: '这两段都是原书原文（行号、关键字一律照抄）。注意第 1 段只有两行 —— 随机化的全部工作都被塞进了「randomly permute」这一句里，真正的实现在第 2 段。',
      algo: 'RANDOMIZED-HIRE-ASSISTANT', signature: 'RANDOMIZED-HIRE-ASSISTANT(n)', page: 135,
      lines: [
        { n: 1, code: 'randomly permute the list of candidates', zh: '★ 唯一的改动。这一行把「5.1 假设的随机顺序」变成了「我们自己造成的随机顺序」。注意它**没有**写怎么随机 —— 那是第 2 段的事。' },
        { n: 2, code: 'HIRE-ASSISTANT(n)', zh: '洗完之后照 5.1 的老办法原样跑一遍：逐个面试，遇到更好的就雇用。这一行与 5.1 的实现逐字相同。' },
      ],
      vars: [
        { name: 'n', meaning: '候选人数（就是数组长度）' },
        { name: 'c_h', meaning: '每次雇用的代价（面试代价记作 c_i，与本节结论无关）' },
      ],
      note: '★ 请注意「随机被封装在别处」这件事本身 —— 随机化算法的分析之所以能一句话完成（见阶段 3 的 Lemma 5.3 证明），正是因为随机性被隔离到了一个子程序里。',
      more: [
        { algo: 'RANDOMLY-PERMUTE', subtitle: 'RANDOMLY-PERMUTE(A, n) —— 真正干活的子程序（原书 p.136）',
          signature: 'RANDOMLY-PERMUTE(A, n)', page: 136,
          lines: [
            { n: 1, code: 'for i = 1 to n', zh: 'i 从头走到尾。注意循环上界是 n（最后一轮 RANDOM(n, n) 必然抽到自己，交换等于没做）—— 原书就是这么写的，不要「优化」成 n − 1。' },
            { n: 2, code: '    swap A[i] with A[RANDOM(i, n)]', zh: '★★ 三个要点：① 从 $A[i : n]$ 里挑（不是 $A[1 : n]$）；② 与 $A[i]$ 交换；③ 交换之后 $A[1 : i]$ 就是最终结果的一部分，后面不再改动。第 ① 点错了，洗出来的就不是均匀随机排列（习题 5.3-3）。' },
          ],
          vars: [
            { name: 'i', meaning: '本轮要确定的位置（1 基）' },
            { name: 'RANDOM(i, n)', meaning: '在闭区间 [i, n] 上等概率取一个整数，与书一致' },
          ],
          note: '★ 第 2 行的参数是 $(i, n)$ 而不是 $(1, n)$，这一个字符的差别就是「均匀」与「偏斜」的分界。' },
      ] },

    { type: 'visualize', title: '看着名单被洗开',
      viz: 'array', vizMode: 'bars',
      algorithm: 'randomly-permute', pseudocodeRef: 'RANDOMLY-PERMUTE',
      input: { array: [5, 2, 1, 8, 4, 7, 10, 9, 3, 6] },
      countLabels: { move: '交换' },
      invariants: [{ label: 'A[1 : i − 1] 已经定下来，之后永远不会再被改动' }],
      presets: [
        { name: '原书 p.135 的 A₃ = ⟨5,2,1,8,4,7,10,9,3,6⟩（中等代价输入），种子 1', array: [5, 2, 1, 8, 4, 7, 10, 9, 3, 6], args: [1] },
        { name: '同一组 A₃，换种子 7 —— 结果完全不同', array: [5, 2, 1, 8, 4, 7, 10, 9, 3, 6], args: [7] },
        { name: '原书 p.135 的 A₁ = ⟨1,…,10⟩（不洗牌必然雇用 10 次），种子 2', array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], args: [2] },
        { name: '原书 p.135 的 A₂ = ⟨10,…,1⟩（不洗牌只雇用 1 次），种子 3', array: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], args: [3] },
      ],
      tasks: [
        '先看第 1 组，数一数一共发生了几次交换；再想想为什么最多只有 n = 10 次。',
        '把「已定前缀」的数法看清楚：第 i 轮结束时，A[1 : i] 里是哪几个值？它们在后面几轮还会被碰到吗？',
        '同一组输入在「种子 1」和「种子 7」下结果不同 —— 这正是随机化算法「每次运行都可能不一样」的样子。想验证均匀性，看阶段 7 与阶段 6 的统计检验。',
      ],
      note: '★ 动画里的「随机」用固定种子的伪随机序列产生（这样才能逐步回退）。真实实现里 RANDOM 每次都不一样 —— 均匀性由阶段 7 的数学证明和阶段 6 的卡方检验保证，不是靠肉眼看。' },

    { type: 'code', title: '从伪代码到 C',
      intro: '对照时只看一件事：**书上每个下标减 1**。为了让你不用心算偏移，这份 C 把辅助函数都写成 **1 基**语义（`swap1`、`rand_range`），只在真正访问 `a[]` 时才减 1 —— 于是「书第 2 行」与 `randomly_permute` 里那两行几乎可以逐字对照（见下面的对应表）。',
      pseudocodeRef: 'RANDOMLY-PERMUTE',
      c: {
        file: 'randomly_permute.c',
        code: String.raw`/* randomly_permute.c -- 5.3 节 RANDOMLY-PERMUTE（随机排列数组）的数值验证。
 *
 * 对应原书 p.136：
 *   RANDOMLY-PERMUTE(A, n)
 *   1  for i = 1 to n
 *   2      swap A[i] with A[RANDOM(i, n)]
 *
 * 下标约定：书中伪代码从 1 开始，C 从 0 开始。所以
 *   书里的 A[i]        <-> 本文件的 a[i - 1]
 *   书里的 RANDOM(i,n) <-> rand_range(&rng, i, n)，返回 1 基下标，和书一致
 * 本文件的所有辅助函数都保持**1 基**语义，只在访问 a[] 时才减 1，
 * 这样对照伪代码时不需要心算偏移。
 *
 * 验证三件事：
 *   1. 每次调用结果都是输入的一个排列（不丢不造、无重复）；
 *   2. n = 4 时完整排列的分布是均匀的 —— 用卡方检验判定，而不是"看着挺随机"；
 *   3. 习题 5.3-3 的错误版本（每轮从 A[1 : n] 里挑）**不是**均匀的，
 *      卡方值比正确版本大两个数量级。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o randomly_permute randomly_permute.c
 */
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

/* ---------------------------------------------------------------------------
 * 伪随机序列：xorshift32 + 种子混合。
 *
 * 为什么不用 rand()？标准库 rand() 的实现随平台而异，断言会不稳定；
 * 而自己写一个固定种子的发生器，结果完全可复现。
 *
 * 为什么不用最常见的「线性同余 + 取模」（state = a*state + c; 取 state % bound）？
 * 模 2^32 的线性同余发生器**低位几乎不随机**（最低位周期为 2），
 * 而 state % bound 恰好只用低位 —— 洗出来的排列会有肉眼可辨的偏斜。
 * 这里改用 xorshift32，并用整个字长按比例取整。
 * ------------------------------------------------------------------------- */
typedef struct {
    uint32_t s;
} rng_t;

static void rng_seed(rng_t *r, uint32_t seed)
{
    uint32_t s = seed ? seed : 0x9e3779b9u;
    /* 先混合种子：xorshift32 是线性映射，连续种子的首个输出高度相关 */
    s += 0x9e3779b9u;
    s = (s ^ (s >> 16)) * 0x21f0aaadu;
    s = (s ^ (s >> 15)) * 0x735a2d97u;
    s = s ^ (s >> 15);
    r->s = s ? s : 0x9e3779b9u;
}

static uint32_t rng_next(rng_t *r)
{
    uint32_t s = r->s;
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    r->s = s;
    return s;
}

/* 返回 [lo, hi] 闭区间上的整数 —— 与书上 RANDOM(a, b) 的「闭区间」语义一致。 */
static int rand_range(rng_t *r, int lo, int hi)
{
    uint32_t span = (uint32_t)(hi - lo + 1);
    return lo + (int)((double)rng_next(r) / 4294967296.0 * (double)span);
}

/* ---------------------------------------------------------------------------
 * 书上的算法：1 基接口，只在访问数组时减 1
 * ------------------------------------------------------------------------- */
static void swap1(int a[], int i, int j)
{
    int t = a[i - 1];
    a[i - 1] = a[j - 1];
    a[j - 1] = t;
}

/* RANDOMLY-PERMUTE(A, n)：原地洗牌，Θ(n) */
static void randomly_permute(int a[], int n, rng_t *r)
{
    for (int i = 1; i <= n; i++) {
        int j = rand_range(r, i, n); /* ★ 从 A[i : n] 里挑，不是从 A[1 : n] 里挑 */
        swap1(a, i, j);
    }
}

/* 习题 5.3-3 的 PERMUTE-WITH-ALL：每轮从 A[1 : n] 里挑 —— 看似更"随机"，其实是错的 */
static void permute_with_all(int a[], int n, rng_t *r)
{
    for (int i = 1; i <= n; i++) {
        int j = rand_range(r, 1, n);
        swap1(a, i, j);
    }
}

/* ---------------------------------------------------------------------------
 * 小工具
 * ------------------------------------------------------------------------- */
static int cmp_int(const void *p, const void *q)
{
    int x = *(const int *)p, y = *(const int *)q;
    return (x > y) - (x < y);
}

static int is_permutation_of(const int *a, const int *original, int n)
{
    int *x = malloc((size_t)n * sizeof(int));
    int *y = malloc((size_t)n * sizeof(int));
    assert(x && y);
    for (int i = 0; i < n; i++) { x[i] = a[i]; y[i] = original[i]; }
    qsort(x, (size_t)n, sizeof(int), cmp_int);
    qsort(y, (size_t)n, sizeof(int), cmp_int);
    int same = 1;
    for (int i = 0; i < n; i++) {
        if (x[i] != y[i]) { same = 0; }
    }
    free(x);
    free(y);
    return same;
}

/* 卡方统计量：观测频数 obs[k] 与期望 exp 的偏离程度。
 * 期望正好等于自由度时卡方值应当在自由度附近 —— 所以判据写成「不超过若干倍自由度」，
 * 与样本量无关（「频率偏差小于 1%」那种写法会随样本量变化时而必然通过、时而必然失败）。 */
static double chi_square(const int *obs, int k, double exp)
{
    double c = 0.0;
    for (int i = 0; i < k; i++) {
        double d = (double)obs[i] - exp;
        c += d * d / exp;
    }
    return c;
}

int main(void)
{
    /* ---- 1. 结果必须是原数组的一个排列（200 个种子）---- */
    for (int t = 1; t <= 200; t++) {
        int n = 1 + (t % 12);
        int a[12], original[12];
        for (int i = 0; i < n; i++) { a[i] = (t + 1) * 7 + i * 13; original[i] = a[i]; }
        rng_t r;
        rng_seed(&r, (uint32_t)t);
        randomly_permute(a, n, &r);
        assert(is_permutation_of(a, original, n));
    }
    puts("part 1: 200 个种子下结果都是输入的一个排列");

    /* ---- 2. 同一种子必须给出同一结果（可复现）---- */
    {
        int a1[] = {1, 2, 3, 4, 5, 6, 7, 8};
        int a2[] = {1, 2, 3, 4, 5, 6, 7, 8};
        rng_t r1, r2;
        rng_seed(&r1, 7);
        rng_seed(&r2, 7);
        randomly_permute(a1, 8, &r1);
        randomly_permute(a2, 8, &r2);
        for (int i = 0; i < 8; i++) {
            assert(a1[i] == a2[i]);
        }
        printf("part 2: 种子 7 的输出可复现：[%d", a1[0]);
        for (int i = 1; i < 8; i++) { printf(", %d", a1[i]); }
        puts("]");
    }

    /* ---- 3. 均匀性：n = 4，统计 24 种排列的出现次数，做卡方检验 ---- */
    {
        enum { N = 24000, K = 4 };
        static const int base[K] = {10, 20, 30, 40};
        int obs[24];
        for (int i = 0; i < 24; i++) { obs[i] = 0; }

        for (int s = 1; s <= N; s++) {
            int a[K];
            for (int i = 0; i < K; i++) { a[i] = base[i]; }
            rng_t r;
            rng_seed(&r, (uint32_t)s);
            randomly_permute(a, K, &r);
            /* 把排列编码成 0..23 的 Lehmer 码（康托展开），用作"是哪种排列"的编号。
             * ★ 必须是真正的 Lehmer 码：rank_i = 「排在 a[i] 右边且比它小的元素个数」，
             *   码值 = Σ rank_i · (K−1−i)!。写成「左边比它小的个数」再按变基数累计
             *   会**不是单射**（例如 r1=0,r2=2 与 r1=1,r2=0 撞成同一个码），
             *   统计表就会把两种排列混在一起 —— 断言会以「卡方突然很大」的形式暴露出来。 */
            int code = 0;
            for (int pos = 0; pos < K; pos++) {
                int rank = 0;
                for (int j = pos + 1; j < K; j++) {
                    if (a[j] < a[pos]) { rank++; }
                }
                int fact = 1;
                for (int t = 2; t <= K - 1 - pos; t++) { fact *= t; }
                code += rank * fact;
            }
            assert(code >= 0 && code < 24);
            obs[code]++;
        }

        int total = 0;
        for (int i = 0; i < 24; i++) { total += obs[i]; }
        assert(total == N);

        double chi = chi_square(obs, 24, (double)N / 24.0);
        printf("part 3: 正确版本 24 种排列的卡方 = %.1f（自由度 23，判据 < 69）\n", chi);
        assert(chi < 69.0);

        int minc = obs[0], maxc = obs[0];
        for (int i = 1; i < 24; i++) {
            if (obs[i] < minc) { minc = obs[i]; }
            if (obs[i] > maxc) { maxc = obs[i]; }
        }
        printf("        每种排列出现 %d..%d 次（期望 1000）\n", minc, maxc);
    }

    /* ---- 4. 反例：习题 5.3-3 的错误版本明显不均匀 ---- */
    {
        enum { N = 24000, K = 4 };
        static const int base[K] = {10, 20, 30, 40};
        int obsBad[K], obsGood[K];
        for (int i = 0; i < K; i++) { obsBad[i] = 0; obsGood[i] = 0; }

        for (int s = 1; s <= N; s++) {
            int a[K], b[K];
            for (int i = 0; i < K; i++) { a[i] = base[i]; b[i] = base[i]; }
            rng_t r1, r2;
            rng_seed(&r1, (uint32_t)s);
            rng_seed(&r2, (uint32_t)s);
            randomly_permute(a, K, &r1);
            permute_with_all(b, K, &r2);
            for (int v = 0; v < K; v++) {
                if (a[0] == base[v]) { obsGood[v]++; }
                if (b[0] == base[v]) { obsBad[v]++; }
            }
        }

        double cg = chi_square(obsGood, K, (double)N / K);
        double cb = chi_square(obsBad, K, (double)N / K);
        printf("part 4: A[1] 取每个值的卡方 —— 正确版本 %.1f，错误版本 %.0f（自由度 3，判据 < 9）\n",
               cg, cb);
        assert(cg < 9.0);
        assert(cb > 100.0); /* 错误版本偏离得离谱 */
        printf("        错误版本 A[1] 的分布：%d %d %d %d（期望各 %d）—— 一眼可辨的偏斜\n",
               obsBad[0], obsBad[1], obsBad[2], obsBad[3], N / K);
    }

    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 42, zh: '`rng_seed`：自己实现固定种子的发生器，结果完全可复现（`rand()` 的实现随平台而异，断言会不稳）。' },
          { line: 45, zh: '★ 种子必须先「打散」（两步乘法混合）。xorshift32 是 GF(2) 上的**线性**映射，连续种子（1,2,3…）的第一个输出只差一个固定的异或模式，彼此高度相关 —— 测试用连续种子采样时，这种相关性会直接污染均匀性统计（实测偏差 9%）。' },
          { line: 66, zh: '★ `rand_range` 用「整个字长按比例取整」，而不是 `state % span`。模 $2^{32}$ 的线性同余发生器低位几乎不随机（最低位周期为 2），取模恰好只用低位 —— 那样洗出来的牌会有肉眼可辨的偏斜（实测 n=4 时偏差达 17%）。' },
          { line: 81, zh: '★ `randomly_permute` 就是书上那两行：第 84 行的 `j = rand_range(r, i, n)` 对应 `RANDOM(i, n)`，注意是 `i` 不是 `1`。' },
          { line: 75, zh: '★ `a[i - 1]`：全书唯一需要减 1 的地方。书里 1 基、C 里 0 基，`swap1` 保持 1 基签名，只有访问数组时才转换。' },
          { line: 90, zh: '习题 5.3-3 的错误版本：每轮从 `[1, n]` 里挑（第 93 行）。两种写法只差一个参数，后果却差两个数量级（见第 4 组断言）。' },
          { line: 107, zh: '`is_permutation_of`：把结果与输入各排一遍序再逐位比较 —— 这是判「是不是同一个排列」最省事也最不容易写错的办法。' },
          { line: 127, zh: '★ 卡方判据写成「不超过若干倍自由度」，而不是「频率偏差小于 x%」—— 后者的松紧会随样本量漂移（样本大时必然失败，因为抽样噪声本身就超过那个百分比）。卡方统计量的期望恰好等于自由度，所以这个判据与 N 无关。' },
          { line: 206, zh: '正确版本：24 种排列的卡方 22.9 < 69（自由度 23）。' },
          { line: 242, zh: '★ 错误版本：$A[1]$ 的卡方 291（正确版本只有 3.3，自由度 3）—— 差两个数量级，这就是「必须从 $A[i : n]$ 里挑」的量化证据。' },
        ],
        tests: [
          { in: '任意输入 / 任意种子，调用 randomly_permute', out: '结果都是输入的一个排列（不丢、不造、不重复）' },
          { in: '种子 7 重复两次', out: '输出完全相同（可复现）' },
          { in: 'n = 4，24000 次不同种子的洗牌', out: '24 种排列的卡方 = 22.9 < 69（自由度 23）→ 均匀' },
          { in: 'n = 4，24000 次「从 [1,n] 里挑」的错误版本', out: 'A[1] 的卡方 = 291 > 9 → 明显偏斜（正确版本只有 3.3）' },
          { in: '编译与运行', out: 'gcc -std=c99 -Wall -Wextra -Werror 零警告；全部断言通过，输出 all checks passed.' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'for i = 1 to n', c: '`for (int i = 1; i <= n; i++)`（第 83 行）—— 循环上界也是 n，与书上一致，不要「优化」成 n − 1。' },
        { pc: 2, pcCode: 'swap A[i] with A[RANDOM(i, n)]', c: '`int j = rand_range(r, i, n); swap1(a, i, j);`（第 84–85 行）—— 区间 `[i, n]` 与书逐字对应。' },
        { pc: 2, pcCode: 'A[i]（书里 1 基）', c: '`a[i - 1]`（在 `swap1` 里，第 75–76 行）—— 唯一需要减 1 的地方。' },
      ] },

    { type: 'analyze', title: '两个必须分清的量：平均情况 vs 期望',
      intro: '本节的复杂度结论其实只有两条，但它们的**含义**差别很大 —— 一条说的是「对随机输入取平均」，另一条说的是「对算法内部的随机选择取平均」。',
      claims: [
        { expr: 'O(c_h \\ln n)', when: 'RANDOMIZED-HIRE-ASSISTANT 的**期望**招聘成本（Lemma 5.3）', page: 136, source: 'book' },
        { expr: 'O(c_h \\ln n)', when: 'HIRE-ASSISTANT 在候选人随机到来时的**平均情况**招聘成本（Lemma 5.2，5.2 节）', page: 136, source: 'book' },
        { expr: 'O(c_h n)', when: '不洗牌时最坏情况（名单严格递增，每次都雇用）', page: 127, source: 'book', preview: true },
        { expr: '\\Theta(n)', when: 'RANDOMLY-PERMUTE 的时间（原地洗牌）', page: 136, source: 'book' },
        { expr: '1/n!', when: '均匀随机排列下每一种排列被产生的概率', page: 136, source: 'book' },
      ],
      tables: [
        { caption: '两种「随机」的区别（本节的核心）', rows: [
          ['', '概率分析（5.2）', '随机化算法（5.3）'],
          ['随机性来自', '输入的分布', '算法内部的随机选择'],
          ['前提', '假设候选人随机到来', '没有前提，任何输入都一样'],
          ['结论的说法', 'average-case（平均情况）', 'expected（期望）'],
          ['能否被对手利用', '能：挑一组坏输入', '不能：坏输入不再对应坏结果'],
          ['额外代价', '无', '一次 $\\Theta(n)$ 的洗牌'],
        ] },
        { caption: '洗牌的两个版本（阶段 6 的实测结果）', rows: [
          ['版本', '每轮挑选区间', 'A[1] 的卡方（自由度 3）', '结论'],
          ['RANDOMLY-PERMUTE（正确）', '$A[i : n]$', '3.3', '均匀'],
          ['PERMUTE-WITH-ALL（习题 5.3-3）', '$A[1 : n]$', '291', '明显偏斜'],
        ] },
      ],
      chart: { xMax: 64, series: [
        { name: '不洗牌的最坏情况 ∼ c_h·n', expr: 'n', color: '--viz-violation' },
        { name: '洗牌后的期望 ∼ c_h·Hₙ ≈ c_h·ln n', expr: 'Math.log(n) + 0.5772156649', color: '--viz-done' },
      ] },
      derivations: [
        { kind: 'summation', title: 'Lemma 5.3 为什么只有一句话', steps: [
          { zh: '★ 关键不是计算，而是**归约**：洗牌把「任意输入」变成「一个均匀随机的排列」。于是算法面对的不再是未知的输入分布，而是一个已知分布（均匀分布）。' },
          { tex: '\\text{洗牌后的输入} \\equiv \\text{均匀随机排列}', zh: '两者在统计上无法区分 —— 这正是 Lemma 5.3 的证明所说的 "achieves a situation identical to that"。' },
          { tex: 'E[\\text{hires}] = H_n = \\ln n + O(1)', zh: '既然是 5.2 已经算过的那个模型，结论直接搬过来，不用重算。' },
          { tex: 'E[\\text{cost}] = O(c_h \\ln n)', zh: '面试代价 $c_i n$ 是固定的，随机部分只有招聘代价。' },
        ] },
        { kind: 'summation', title: '均匀性到底要求什么（Lemma 5.4 的不变量）', steps: [
          { zh: '★ 要证的不是「每个元素落点均匀」（那太弱，见习题 5.3-4），而是**每一种 $k$-排列**都均匀出现。' },
          { tex: '\\Pr\\{A[1 : i-1] \\text{ 恰为某个 } (i-1)\\text{-排列}\\} = \\frac{(n-i+1)!}{n!}', zh: '第 $i$ 轮开始前的不变量：每个 $(i-1)$-排列出现在已定前缀里的概率都相同。' },
          { tex: '\\Pr\\{E_2 \\mid E_1\\} = \\frac{1}{n-i+1}', zh: '第 $i$ 轮从 $A[i : n]$ 这 $n-i+1$ 个位置里等概率挑一个 —— **分母必须是 $n-i+1$**，这正是不变量能递推下去的原因。' },
          { tex: '\\Pr\\{E_1 \\cap E_2\\} = \\frac{1}{n-i+1}\\cdot\\frac{(n-i+1)!}{n!} = \\frac{(n-i)!}{n!}', zh: '相乘之后 $(n-i+1)$ 被约掉，不变量在 $i$ 增大后依然成立。' },
          { tex: 'i = n+1:\\quad \\frac{0!}{n!} = \\frac{1}{n!}', zh: '循环结束时每个完整的 $n$-排列都以 $1/n!$ 出现 —— 这就是均匀随机排列。' },
        ] },
      ],
      note: '★ 中心图只画了「成本随 n 的量级」：不洗牌时最坏情况线性增长，洗牌后期望只按 $\\ln n$ 增长 —— 而 $\\Theta(n)$ 的洗牌代价在图上小到看不见，这正是「随机化几乎免费」的意思。' },

    { type: 'prove', title: '凭什么说洗出来的牌是均匀的',
      statement: 'Just prior to the i th iteration of the for loop of lines 1–2, for each possible (i − 1)-permutation of the n elements, the subarray A[1 : i − 1] contains this (i − 1)-permutation with probability (n − i + 1)!=n!.',
      page: 137,
      intro: '★ 这条不变量是**原书原文**（Lemma 5.4 的证明，p.137）。它比「每个元素落点均匀」强得多：它管的是**每一种 $(i-1)$-排列**，而不是逐个元素的边缘概率。下面三步也逐字取自原书 p.137–138。',
      steps: [
        { title: '第一步 · 初始化（Initialization）',
          en: 'Initialization: Consider the situation just before the first loop iteration, so that i = 1. The loop invariant says that for each possible 0-permutation, the sub- array A[1 : 0] contains this 0-permutation with probability (n − i + 1)!=n! = n!=n! = 1. The subarray A[1 : 0] is an empty subarray, and a 0-permutation has no elements. Thus, A[1 : 0] contains any 0-permutation with probability 1, and the loop invariant holds prior to the first iteration.',
          page: 137,
          body: [
            '$i = 1$ 时已定前缀是空的。空子数组里「恰好放着那个 0-排列」的概率按定义为 1（0-排列本身也是空的），而不变量的公式给出 $(n-1+1)!/n! = n!/n! = 1$ —— 两边相等，所以成立。',
            '★ 这里有个容易被抬杠的地方：为什么「空子数组包含 0-排列」的概率是 1 而不是 0？因为 0-排列**只有一个**（空序列），而空子数组正好就是它 —— 唯一符合的那一种，所以概率是 1。习题 5.3-1 就是教授 Marceau 拿这一点来质疑的。',
          ] },
        { title: '第二步 · 保持（Maintenance）',
          en: 'Maintenance: By the loop invariant, we assume that just before the i th iteration, each possible (i − 1)-permutation appears in the subarray A[1 : i − 1] with probability (n − i + 1)!=n!. We shall show that after the i th iteration, each possible i -permutation appears in the subarray A[1 : i ] with probability (n − i)!=n!. In- crementing i for the next iteration then maintains the loop invariant.',
          page: 137,
          body: [
            '要证的是「概率从 $(n-i+1)!/n!$ 变成 $(n-i)!/n!$」—— 注意分子从 $(n-i+1)!$ 掉到 $(n-i)!$，也就是概率**变小**了。这是对的：随着前缀变长，能装下某个指定排列的机会自然更小。',
            '接下来原书的做法是把「某个 $i$-排列出现在 $A[1 : i]$」拆成两个事件：$E_1$（前 $i-1$ 轮造出了它的前 $i-1$ 个元素）与 $E_2$（第 $i$ 轮把第 $i$ 个元素放到 $A[i]$）。',
          ] },
        { title: '第三步 · 终止（Termination）',
          en: 'Termination: The loop terminates, since it is a for loop iterating n times. At termination, i = n + 1, and we have that the subarray A[1 : n] is a given n-permutation with probability (n − (n + 1) + 1)!=n! = 0!=n! = 1/n!.',
          page: 138,
          body: [
            '循环结束时 $i = n+1$，把 $i$ 代回不变量：分子变成 $(n-(n+1)+1)! = 0! = 1$，于是概率是 $1/n!$。',
            '★ 这就是结论：**每一个** $n$-排列都以 $1/n!$ 出现 —— 恰好是「均匀随机排列」的定义，也正是阶段 3 里那句 "the probability that any particular permutation is produced to be 1/n!" 的严格版本。',
          ] },
      ],
      conclusion: '★ 由 Termination 得到：RANDOMLY-PERMUTE 产生的是均匀随机排列（Lemma 5.4）。把它代回 Lemma 5.3 的证明，就得到「随机化招聘的期望成本是 $O(c_h \\ln n)$，且这个结论不依赖任何输入假设」。两个 lemma 串起来，就是 5.3 的全部内容。',
      note: '' },

    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'judge', q: '随机化算法与概率分析的区别在于：随机性来自算法内部，而不是来自输入的分布。', answer: true, why: '原书 p.136：Lemma 5.2 对输入做了假设，Lemma 5.3 没有。这正是本节的中心区别。' },
        { kind: 'single', q: 'RANDOMLY-PERMUTE 的第 i 轮，应该把 A[i] 与哪个区间的元素交换？',
          options: ['$A[1 : n]$', '$A[i : n]$', '$A[1 : i]$', '$A[i+1 : n]$'], answer: 1,
          why: '★ 从 $A[i : n]$ 里挑。挑 $A[1 : n]$ 就是习题 5.3-3 的 PERMUTE-WITH-ALL，实测卡方 291，明显偏斜。' },
        { kind: 'judge', q: '只要证明「每个元素落在每个位置的概率都是 1/n」，就足以说明这个排列是均匀随机排列。', answer: false,
          why: '★ 这是原书 p.136 专门点名的陷阱。那条条件只约束 $n^2$ 个边缘概率，而均匀性要管住全部 $n!$ 种排列 —— 习题 5.3-4 的 PERMUTE-BY-CYCLE 就是满足前者却不满足后者的反例。' },
        { kind: 'single', q: 'RANDOMLY-PERMUTE 的时间复杂度是？',
          options: ['$\\Theta(1)$', '$\\Theta(\\lg n)$', '$\\Theta(n)$', '$\\Theta(n \\lg n)$'], answer: 2,
          why: '一次循环走 n 轮，每轮常数工作量；而且是原地的，额外空间 O(1)。' },
        { kind: 'single', q: '第 i 轮交换完成之后，哪个说法成立？',
          options: ['A[i] 之后不会再被改动', 'A[1 : i] 之后不会再被改动', '整个数组之后不会再被改动', 'A[i] 可能还会被后面的轮次改动'], answer: 1,
          why: '★ 原书 p.136 原话是「After the i th iteration, A[i] is never altered」，而后面各轮只在 $A[i+1 : n]$ 里交换，所以实际上是 $A[1 : i]$ 整体定下来了。' },
        { kind: 'judge', q: '洗牌之后，最坏情况的输入就不存在了。', answer: false,
          why: '严格讲，坏排列依然可能被抽到 —— 只是概率降到了 $1/n!$。原书的措辞是「no particular input elicits its worst-case behavior」：**不可被指定**，而不等于不存在。' },
        { kind: 'single', q: 'RANDOMIZED-HIRE-ASSISTANT 的期望招聘成本是？',
          options: ['$O(c_h)$', '$O(c_h \\ln n)$', '$O(c_h n)$', '$O(c_i n)$'], answer: 1,
          why: 'Lemma 5.3：洗牌后与「候选人随机到来」的情形完全等价，于是沿用 5.2 的 $H_n = \\ln n + O(1)$。' },
        { kind: 'simulate', q: 'n = 4 的数组一共有多少种不同的排列？（填一个整数）', expect: [24], placeholder: '例如：24',
          why: '$n! = 4! = 24$。均匀随机排列要求这 24 种每一种都以 $1/24$ 出现 —— 阶段 5 的动画与阶段 6 的 C 程序都是按这个标准检验的。' },
      ],
      bookExercises: [
        { id: '5.3-1', page: 138, star: 0,
          statement: 'Professor Marceau objects to the loop invariant used in the proof of Lemma 5.4. He questions whether it holds prior to the first iteration. He reasons that we could just as easily declare that an empty subarray contains n o 0-permutations. Therefore, the probability that an empty subarray contains a 0-permutation should be 0, thus invalidating the loop invariant prior to the first iteration. Rewrite the procedure RANDOMLY-PERMUTE so that its associated loop invariant applies to a nonempty subarray prior to the first iteration, and modify the proof of Lemma 5.4 for your procedure.',
          hint: '关键在于「0-排列只有几种」。空序列只有一种，所以「空子数组包含某个 0-排列」是必然事件。若想避开这个争议，把第 1 轮单独拿出来当初始化（先确定性做一次交换），不变量就可以从非空子数组开始。' },
        { id: '5.3-2', page: 138, star: 0,
          statement: 'Professor Kelp decides to write a procedure that produces at random any permu- tation except the identity permutation, in which every element ends up where it started. He proposes the procedure PERMUTE-WITHOUT-IDENTITY . Does this procedure do what Professor Kelp intends? PERMUTE-WITHOUT-IDENTITY (A,n) 1 for i = 1 to n − 1 2 swap A[i ] with A[RANDOM(i + 1; n)]',
          hint: '别停在「想一想抽到本该在这儿的元素怎么办」——先数路径。 第 $i$ 步有 $n - i$ 种等概率选择，所以整个过程的执行路径只有 $\\prod_{i=1}^{n-1}(n-i) = (n-1)!$ 条，每条概率 $1/(n-1)!$， 最多只能产生 $(n-1)!$ 个不同排列。 而「非恒等排列」一共有 $n! - 1$ 个，$n \\ge 3$ 时 $(n-1)! < n! - 1$ —— 一堆排列它**根本产生不出来**，谈不上「等概率地产生任何非恒等排列」。 最小的反例 $n = 3$：路径只有 2 条（第 1 步选 2 或 3，第 2 步只能选 3）， 从 $(1,2,3)$ 出发分别得到 $(2,3,1)$ 和 $(3,1,2)$， 而 5 个非恒等排列里的 $(2,1,3)$、$(1,3,2)$、$(3,2,1)$ 永远出不来。 所以答案是：**做不到**。（恒等排列它确实排除了：第 1 步就把 $A[1]$ 跟后面的某个位置换掉，而此后再没有 任何步骤会碰位置 1，所以 $A[1]$ 永远回不到原位；不成立的是「均匀覆盖其余所有排列」。）' },
        { id: '5.3-3', page: 138, star: 0,
          statement: 'Consider the PERMUTE-WITH-ALL procedure on the facing page, which instead of swapping element A[i ] with a random element from the subarray A[i : n], swaps it with a random element from anywhere in the array. Does PERMUTE-WITH-ALL produce a uniform random permutation? Why or why not?',
          hint: '★ 这是必做的一题。本站阶段 6 的 C 程序已经把它跑出来了：$A[1]$ 的卡方 291，而正确版本只有 3.3。想清楚「为什么从整个数组里挑会偏」：前面几轮定下来的元素在后面的轮次里还有机会被换走。' },
        { id: '5.3-4', page: 139, star: 0,
          statement: 'Professor Knievel suggests the procedure PERMUTE-BY-CYCLE to generate a uni- form random permutation. Show that each element A[i ] has a 1/n probability of winding up in any particular position in B . Then show that Professor Knievel is mistaken by showing that the resulting permutation is not uniformly random. PERMUTE-BY-CYCLE (A,n) 1 let B[1 : n] be a new array 2 offset DRANDOM(1,n) 3 for i = 1 to n 4 dest = i C offset 5 if dest >n 6 dest = dest − n 7 B[dest ] = A[i ] 8 return B',
          hint: '这道题正是阶段 3 里那条陷阱提示的证据。它的做法是：取一个随机偏移量 offset，把所有元素整体循环右移。先算边缘概率（确实是 $1/n$），再数一数它一共只能产生多少种排列 —— 比 $n!$ 少得多。' },
        { id: '5.3-5', page: 139, star: 0,
          statement: 'Professor Gallup wants to create a random sample of the set f1,2,3,…,n g, that is, an m-element subset S , where 0 ≤ m ≤ n, such that each m-subset is equally likely to be created. One way is to set A[i ] = i , for i = 1,2,3,…,n , call RANDOMLY-PERMUTE (A), and then take just the first m array elements. This method makes n calls to the RANDOM procedure. In Professor Gallup’s applica- tion, n is much larger than m, and so the professor wants to create a random sample with fewer calls to RANDOM . RANDOM-SAMPLE (m,n) 1 S = ; 2 for k = n − m + 1 to n / / iterates m times 3 i DRANDOM(1,k) 4 if i 2 S 5 S = S [ fkg 6 else S = S [ fig 7 return S Show that the procedure RANDOM-SAMPLE on the previous page returns a ran- dom m-subset S of f1,2,3,…,n g, in which each m-subset is equally likely, while making only m calls to RANDOM .',
          hint: '对 $m$ 归纳，或者老实数概率：把 $m$ 轮循环的两种分支（$i\\in S$ 收 $k$、否则收 $i$）全部展开，证明任一固定 $m$ 子集被产出的概率都等于同一条链上 $1/k$ 与 $1-1/k$ 之积，且不同分支互斥。归纳假设要写成「扫到 $k$ 时，$S$ 恰含 $\\{k,k+1,\\dots,n\\}$ 中某个 $j$ 元子集的概率只依赖 $j$、不依赖具体是哪些元素」—— 这正是「等可能」的形态。' },
      ] },
  ],
};
