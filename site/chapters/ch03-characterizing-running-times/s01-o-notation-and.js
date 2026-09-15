/* =============================================================================
 * 第 3 章 3.1 —— O-notation, Ω-notation, and Θ-notation
 *
 * 原文锚点：印刷页 50–52（pdf_index 71–73）
 *
 * 所有 en 引述逐字取自 data/pages_fixed.jsonl（印刷页 50–52），并已通过
 * tools/04_verify_level.py 的连续性溯源判据。要改引述，先回原文核对。
 * ========================================================================== */

export default {
  key: 's01',
  id: 'ch03/s01',
  chapter: 3,
  section: '3.1',
  title: '三种渐进记号：给增长速率起名字',
  shortTitle: '3.1 三种渐进记号',
  titleEn: 'O-notation, Ω-notation, and Θ-notation',
  source: { printed: [50, 52], pdf: [71, 73] },
  sourceNote: '本关对应原书 3.1 节（印刷页 50–52）。',
  prerequisites: [{ label: '2.2 分析算法', url: '#/ch02/s02' }],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '先看清这一关的位置',
      why:
        '第 2 章分析插入排序时，我们写出了一长串带常数 $c_1 \\dots c_8$ 的算式，' +
        '然后亲手把低阶项和系数扔掉，剩下 $\\Theta(n^2)$。但那个「扔」的动作是拍脑袋做的——' +
        '凭什么能扔？扔完之后剩下的东西叫什么？这一节就是给这套动作起正式的名字：' +
        '$O$、$\\Omega$、$\\Theta$。全书后面每一次复杂度讨论用的都是这套语言。',
      position:
        '前置：2.2 节的算法分析（那串代价算式）与 2.3 节的归并排序。' +
        '本关给三个记号的**直觉**定义，3.2 节给出带量词的形式定义，3.3 节是常用函数速查表。' +
        '第 4 章解递归式、以及后面每一章的「某某算法是 $\\Theta(\\cdot)$」都建立在这套记号上。',
      unlocks: [
        { label: '3.2 渐进记号：形式定义', url: '#/ch03/s02' },
        { label: '3.3 标准记号与常用函数', url: '#/ch03/s03' },
      ],
      mathKit: [
        {
          title: '最高阶项（leading term）',
          body:
            '多项式里次数最高的那一项。$n$ 越大它越压倒一切——' +
            '这是「扔掉低阶项」合理性的全部来源。例：$7n^3+100n^2-20n+6$ 的最高阶项是 $7n^3$。',
        },
        {
          title: '常数因子',
          body:
            '渐进记号允许差一个正常数倍：$3n^2$ 与 $100n^2$ 是同一个 $\\Theta(n^2)$。' +
            '因为换台机器、换个语言，常数就变了——它与「算法本身有多快」无关。',
        },
        {
          title: '充分大的 n（threshold）',
          body:
            '「对一切 $n \\ge n_0$ 成立」——$n_0$ 是某个门槛。小 $n$ 时的反例不要紧，' +
            '我们只关心增长趋势。书上说 $n_0$ 的存在性是定义的一部分。',
        },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '三种说法，三种承诺',
      scene:
        '描述一个人有多高：「不超过 2 米」「至少 1 米 5」「正好 1 米 75」——三种说法，三种承诺强度',
      body: [
        '假设你给一个排序程序写说明书。你可以说：**「它最多不会比 $n^2$ 慢」**——这是一个上界，' +
        '不管输入多离谱都不会更糟；也可以说**「至少存在一些输入让它慢到 $n^2$」**——这是下界；' +
        '如果两句话都成立，你就能拍板：**「它就是 $n^2$ 量级的」**。',
        '这三个说法分别叫 $O$、$\\Omega$、$\\Theta$。注意它们的精确度不同：说「不超过 2 米」的人，' +
        '并没有说这个人到底多高——$O(n^4)$ 也是 $7n^3+100n^2-20n+6$ 的合法上界，只是没什么用。',
        '起名字的时候会故意扔掉两样东西：**低阶项**和**最高阶项的系数**。' +
        '所以这些名字是「粗糙」的——但正因为粗糙，它们才与机器、编译器、语言无关，' +
        '才能用来比较两个算法本身。',
        '还有一个容易忽略的点：这套记号不只用于运行时间。书上特别提醒，' +
        '它刻画的是**一般函数**——空间占用、甚至与算法无关的函数都可以套。',
      ],
      interactive: {
        text:
          '想亲眼看到「扔掉低阶项」是什么意思，直接去阶段 5：拖动 $c$ 与 $n_0$ 两个滑杆，' +
          '看 $7n^3+100n^2-20n+6$ 从什么时候开始被 $c \\cdot n^3$ 永远压住。',
      },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自 data/blocks/part-i-foundations__ch03.json，每条都已通过溯源判据。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 50,
          en: 'When we analyzed the worst-case running time of insertion sort in Chapter 2, we started with the complicated expression',
          zh:
            '回忆 2.2 节：我们把每行的代价 $c_k$ 乘上执行次数 $t_i$ 再求和，得到一条长式子。' +
            '书上说「从这条式子开始」——注意它接下来不是继续精确计算，而是**做减法**。' },
        { kind: 'body', page: 50,
          en: 'We then discarded the lower-order terms (c 1 + c 2 + c 4 + c 5/2 − c 6/2 − c 7/2 + c 8 )n and c 2 + c 4 + c 5 + c 8 , and we also ignored the coefficient c 5/2 + c 6/2 + c 7/2 of n 2 . That left just the factor n 2 , which we put into Θ-notation as Θ(n 2 ). We use this style to characterize running times of algorithms: discard the lower-order terms and the coefficient of the leading term, and use a notation that focuses on the rate of growth of the running time.',
          zh:
            '这一段就是「扔」的正式描述，扔了两样东西：①**低阶项**（一次项与常数项）；②**最高阶项的系数**。' +
            '留下 $n^2$ 这个「增长率」。★ 关键句是最后一句：focuses on the **rate of growth**——' +
            '渐进记号刻画的是增长率，不是运行时间的数值。第 3 章后面所有内容都在把这句话变成可操作的规则。' },
        { kind: 'body', page: 50,
          en: 'Θ-notation is not the only such "asymptotic notation." In this section, we’ll see other forms of asymptotic notation as well. We start with intuitive looks at these notations, revisiting insertion sort to see how we can apply them. In the next section, we’ll see the formal definitions of our asymptotic notations, along with conventions for using them.',
          zh:
            '结构预告：本节给**直觉**（继续用插入排序当例子），3.2 节给**形式定义**（集合与量词）。' +
            '★ 为什么直觉要先行：形式定义里的量词（「存在 $c$ 与 $n_0$，对一切 $n \\ge n_0$」）' +
            '对新手非常反直觉——先在例子里见过它，3.2 就只是「把刚才的话说严谨」。' },
        { kind: 'body', page: 50,
          en: 'Before we get into specifics, bear in mind that the asymptotic notations we’ll see are designed so that they characterize functions in general. It so happens that the functions we are most interested in denote the running times of algorithms. But asymptotic notation can apply to functions that characterize some other aspect of algorithms (the amount of space they use, for example), or even to functions that have nothing whatsoever to do with algorithms.',
          zh:
            '★ 容易忽略但很重要：$O/\\Omega/\\Theta$ 刻画的是**函数**，不是算法。' +
            '运行时间只是碰巧是我们最关心的函数——空间占用（第 3 章末与第 IV 部分）、' +
            '甚至完全与算法无关的函数都能套。这也解释了为什么定义写在「函数」上而不是「算法」上。' },
        { kind: 'body', page: 50,
          en: 'O-notation characterizes an upper bound on the asymptotic behavior of a function.',
          zh:
            '$O$（大 O，读 big-oh）= **上界**。一句话：这个函数**长得不会比某个速率更快**。' +
            '注意书上的用词是 "an upper bound"（一个上界）——上界不唯一，下面马上用例子说明。' },
        { kind: 'body', page: 50,
          en: 'In other words, it says that a function grows no faster than a certain rate, based on the highest-order term. Consider, for example, the function 7n 3 + 100n 2 − 20n + 6.',
          zh:
            '书上紧接着给了本章的明星例子 $f(n) = 7n^3+100n^2-20n+6$。' +
            '请记住它——整个 3.1 节的 $O/\\Omega/\\Theta$ 都拿这一个函数做示范，' +
            '阶段 5 的曲线图里也能亲手拖它。' },
        { kind: 'body', page: 51,
          en: 'Ω-notation characterizes a lower bound on the asymptotic behavior of a function.',
          zh:
            '$\\Omega$（大 Omega）= **下界**：这个函数**至少长得和某个速率一样快**。' +
            '下界在算法学里的意义不同于上界：上界是「算法不会更糟」的承诺，' +
            '下界往往是「问题本身至少这么难」的证据——第 8 章的 NP 完全理论全靠它。' },
        { kind: 'body', page: 51,
          en: 'Θ-notation characterizes a tight bound on the asymptotic behavior of a function. It says that a function grows precisely at a certain rate, based—once again—on the highest-order term. Put another way, Θ-notation characterizes the rate of growth of the function to within a constant factor from above and to within a constant factor from below. These two constant factors need not be equal.',
          zh:
            '$\\Theta$（Theta）= **紧界**：上下各差一个常数因子地「夹住」。' +
            '★ 两个常数**不必相等**——上面夹用 $c_2$、下面夹用 $c_1$，各自独立。' +
            '这就是为什么「$3n^2$ 与 $100n^2$ 同阶」：一个从上面夹、一个从下面夹，都行。' },
        { kind: 'body', page: 51,
          en: 'If you can show that a function is both O(f(n))  and Ω(f (n)) for some func- tion f(n) , then you have shown that the function is Θ(f(n)) .',
          zh:
            '★ 本节最常用的定理雏形：**上界 + 下界 ⇒ 紧界**。（3.2 节会把它写成正式的定理。）' +
            '实操套路因此固定下来：证一个 $O$、证一个 $\\Omega$、宣布 $\\Theta$。' +
            '阶段 8 的插入排序下界论证就是「另一半」。' },
        { kind: 'body', page: 52,
          en: 'These observations suffice to deduce an O(n 2 ) running time for any case of INSERTION-SORT, giving us a blanket statement that covers all inputs.',
          zh:
            '注意这里的推理方式：**完全不看输入内容**。外层固定跑 $n-1$ 次、' +
            '内层至多 $i-1$ 次、每次常数时间——三条观察拼出 $O(n^2)$，' +
            '而且书上说这是 blanket statement（覆盖一切输入的「毯子」式结论）。' +
            '这就是 $O$ 的典型用法：一个上界管住所有情况。' },
        { kind: 'body', page: 52,
          en: 'With a little creativity, we can also see that the worst-case running time of INSERTION-SORT is Ω(n 2 ).',
          zh:
            '★ 书上用词是 "with a little creativity"（需要一点创造性）——' +
            '因为**下界论证的难点不同**：$O(n^2)$ 只要把最坏情况封顶，' +
            '$\\Omega(n^2)$ 却要证明「对每个 $n$ 都存在足够坏的输入」。' +
            '那个「坏输入」得自己构造出来——就是图 3.1。阶段 8 一步步拆它。' },
      ],
      terms: [
        { en: 'upper bound', zh: '上界：不会比它更快（$O$）', page: 50 },
        { en: 'lower bound', zh: '下界：至少与它一样快（$\\Omega$）', page: 51 },
        { en: 'tight bound', zh: '紧界：上下同时夹住（$\\Theta$）', page: 51 },
        { en: 'rate of growth', zh: '增长率：渐进记号真正刻画的东西', page: 50 },
        { en: 'highest-order term', zh: '最高阶项：决定增长率的那一项', page: 50 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // lines 的 n / code 逐字取自 data/blocks，行号即原书行号。
    {
      type: 'pseudocode',
      title: '重读这 8 行：这次只看「跑多少次」',
      algo: 'INSERTION-SORT',
      signature: 'INSERTION-SORT',
      page: 51,
      lines: [
        { n: 1, code: 'for i = 2 to n', zh: '固定跑 n − 1 次，与输入内容无关——这就是「外层是 for」的意义。' },
        { n: 2, code: 'key = A[i]', zh: '常数时间。' },
        { n: 3, code: '/ / Insert A[i] into the sorted subarray A[1 : i − 1].', zh: '注释行，不耗时。' },
        { n: 4, code: 'j = i − 1', zh: '常数时间。' },
        { n: 5, code: 'while j >0 and A[j]>  key', zh: '★ 唯一「看输入脸色」的行：执行 0 到 i − 1 次，由数据决定。' },
        { n: 6, code: 'A[j + 1] = A[j]', zh: '搬移。图 3.1 的下界论证全靠这一行——值往右挪一格，就是它执行了一次。' },
        { n: 7, code: 'j = j − 1', zh: '常数时间。' },
        { n: 8, code: 'A[j + 1] = key', zh: '常数时间。' },
      ],
      vars: [
        { name: 'n', meaning: '输入规模（数组元素个数）' },
        { name: 'i', meaning: '外层循环变量：当前要把 A[i] 插入前缀' },
        { name: 'key', meaning: '本轮待插入的值 A[i] 的副本' },
        { name: 'j', meaning: '内层扫描指针，从 i − 1 递减到 0' },
      ],
      note:
        '书上在这里重印这段伪代码，不是为了再讲一遍算法——是为了示范：' +
        '**不求和也能读出量级**。先找「与输入无关的循环」（外层 for），' +
        '再找「与输入相关的循环」（内层 while），上下界就都有了。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '把「上界」看得见：拖出那个 c 和 n₀',
      viz: 'growth',
      chart: {
        xMax: 32,
        series: [
          { name: 'f(n) = 7n³+100n²−20n+6', expr: '7*n**3 + 100*n*n - 20*n + 6', color: '--viz-active' },
        ],
        band: { g: 'n*n*n', c: 12, n0: 20, label: 'c·n³' },
      },
      note:
        '实线是书上 p.50 的 $f(n)$，虚线是 $c \\cdot n^3$。' +
        '把 $c$ 拖到 12、$n_0$ 拖到 20，判定条会变绿：**对一切 $n \\ge 20$ 都有 $f(n) \\le 12n^3$**。' +
        '再试试 $c = 5$——判定会告诉你它在哪一点失效。这就是 $O(n^3)$ 定义里那两个常数的来历。',
      tasks: [
        '把 $c$ 固定在 12，拖 $n_0$：找到**最小的** $n_0$ 使判定变绿（答案见阶段 7 的表）。',
        '把 $n_0$ 固定在 20，拖 $c$：找到最小的 $c$。为什么 $c$ 再小就不行了？（提示：算 $f(20)/20^3$）',
        '换一个问题：$c \\cdot n^2$ 能当上界吗？把 band 的 $g$ 改成 $n*n$ 再拖拖看——这就是「$7n^3$ 不是 $O(n^2)$」的图形版。',
      ],
      invariants: [],
      presets: [],
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '用 C 把「渐进」算出来',
      intro:
        '本关没有新算法，所以这段 C 程序做的事是**数值验证**书上三句话：' +
        '① $f(n)/n^3 \\to 7$（低阶项被淹没）；② $f(n) \\le 12n^3$ 对一切 $n \\ge 20$ 成立（上界真的存在）；' +
        '③ 插入排序最坏情况的步数 $/n^2 \\to 1/2$（$\\Theta(n^2)$）。' +
        '断言失败程序会立刻停——「存在常数 c 与 n₀」是被程序验证过的，不是嘴上说的。',
      pseudocodeRef: 'INSERTION-SORT',
      c: {
        file: 'asymptotic_check.c',
        code: String.raw`/* asymptotic_check.c -- 3.1 节的数值实验：把「渐进记号」算给你看。
 *
 * 书中对应（第 4 版）：
 *   p.50  例子 f(n) = 7n^3 + 100n^2 - 20n + 6，它是 O(n^3)；
 *   p.52  插入排序任何输入的运行时间是 O(n^2)；
 *   p.52  图 3.1 的构造给出最坏情况 Omega(n^2)，于是最坏情况是 Theta(n^2)。
 *
 * 与书中公式的对应：
 *   part 1  直接算 f(n)/n^3：低阶项 100n^2 - 20n + 6 随 n 增大被淹没，比值 -> 7。
 *           这就是「扔掉低阶项和系数」的数值含义。
 *   part 2  验证上界：对区间内每个 n 都检查 f(n) <= 12 n^3（书上说存在常数 c 与
 *           n_0 使一切 n >= n_0 成立，这里把 c 与 n_0 都真的找出来）。
 *   part 3  插入排序最坏情况（逆序输入）的内层循环次数是 n(n-1)/2，
 *           比值 steps/n^2 -> 1/2，这就是最坏情况 Theta(n^2) 的数值版本。
 *
 * 书中伪代码下标从 1 开始，本实现从 0 开始，对应关系 A[i-1] <-> 书中的 A[i]。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o asymptotic_check asymptotic_check.c
 */
#include <assert.h>
#include <stdio.h>

/* 原书 p.50 例子的多项式：f(n) = 7n^3 + 100n^2 - 20n + 6 */
static double f(long n)
{
    return 7.0 * n * n * n + 100.0 * n * n - 20.0 * n + 6.0;
}

/* 插入排序在最坏情况（逆序输入）下的内层循环执行次数。
 * 书上 p.52 的推导：外层跑 n-1 次，第 i 轮内层至多 i-1 次，
 * 总计 sum_{i=2..n} (i-1) = n(n-1)/2 —— 也就是 2.2 节求和式的封闭形式。 */
static long worst_case_steps(long n)
{
    return n * (n - 1) / 2;
}

int main(void)
{
    /* ---- part 1: 低阶项被淹没，f(n)/n^3 -> 7 ---- */
    printf("part 1: f(n) = 7n^3 + 100n^2 - 20n + 6,  f(n)/n^3 -> 7\n");
    printf("  %-10s %-14s %-12s\n", "n", "f(n)", "f(n)/n^3");
    for (long n = 1; n <= 4096; n *= 2) {
        printf("  %-10ld %-14.0f %-12.4f\n", n, f(n), f(n) / ((double)n * n * n));
    }

    /* ---- part 2: 上界真的存在——c = 12, n_0 = 20 ----
     * 对 [20, 64] 的每个 n 断言 f(n) <= 12 n^3；只要有一个不成立程序就停。 */
    for (long n = 20; n <= 64; n++) {
        assert(f(n) <= 12.0 * n * n * n);
    }
    printf("\npart 2: f(n) <= 12 n^3 for every n in [20, 64]  ->  f(n) is O(n^3)\n");

    /* ---- part 3: 插入排序最坏情况 steps/n^2 -> 1/2 ---- */
    printf("\npart 3: insertion sort worst case,  steps/n^2 -> 1/2\n");
    printf("  %-10s %-14s %-12s\n", "n", "steps", "steps/n^2");
    for (long n = 100; n <= 800; n *= 2) {
        long steps = worst_case_steps(n);
        printf("  %-10ld %-14ld %-12.4f\n", n, steps, (double)steps / ((double)n * n));
    }
    assert(worst_case_steps(100) == 4950);
    assert(worst_case_steps(6) == 15);

    printf("\nall checks passed.\n");
    return 0;
}
`,
      },
      mapping: [
        { line: 5, c: 'while 循环的判断：A[j] > key（书中第 5 行）' },
        { line: 6, c: '内层循环体：A[j + 1] = A[j] 的搬移次数，就是 part 3 数的 steps' },
        { line: 1, c: '外层 for：跑 n − 1 次，对应 worst_case_steps 求和式的上限' },
      ],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '书上的每句话，落成一条条可查的结论',
      intro:
        '本关的「复杂度」其实是在练习**读**：把书上每一句渐进结论抄下来、标上页码。' +
        '以后写关卡、读论文，都要能做这个动作。',
      claims: [
        { expr: '7n^3+100n^2-20n+6 \\in O(n^3)', when: '最高阶项是 7n³，增长不快于 n³', page: 50, source: 'book' },
        { expr: '7n^3+100n^2-20n+6 \\in O(n^c)\\ (c \\ge 3)', when: '上界不唯一：O(n⁴)、O(n⁵)… 也都对', page: 50, source: 'book' },
        { expr: '7n^3+100n^2-20n+6 \\in \\Omega(n^3)', when: '最高阶项至少与 n³ 一样快；也是 Ω(n²)、Ω(n)', page: 51, source: 'book' },
        { expr: 'O(f(n)) \\wedge \\Omega(f(n)) \\Rightarrow \\Theta(f(n))', when: '上界 + 下界 ⇒ 紧界（3.2 节给正式定理）', page: 51, source: 'book' },
        { expr: '7n^3+100n^2-20n+6 \\in \\Theta(n^3)', when: '既是 O(n³) 又是 Ω(n³)', page: 51, source: 'book' },
        { expr: 'INSERTION-SORT \\in O(n^2)', when: '内层至多迭代 (n−1)·(n−1) 次，对任何输入', page: 52, source: 'book' },
        { expr: 'INSERTION-SORT \\ 最坏情况 \\in \\Omega(n^2)', when: '图 3.1 的 n/3 构造（阶段 8 逐步拆解）', page: 52, source: 'book' },
        { expr: 'INSERTION-SORT \\ 最坏情况 \\in \\Theta(n^2)', when: '上界与下界都是 n²', page: 51, source: 'book' },
      ],
      tables: [
        {
          caption: '三种记号的分工（本关全部结论的骨架）',
          rows: [
            ['O(f(n))', '上界：增长**不快于** f(n)', '「最多这么糟」；一个上界管住所有输入', 'p.50'],
            ['Ω(f(n))', '下界：增长**至少与** f(n) 一样快', '「至少存在这么坏的输入」；问题的固有难度', 'p.51'],
            ['Θ(f(n))', '紧界：上下**同时**夹住', '「就是这个量级」；两者各证一个即得', 'p.51'],
          ],
        },
        {
          caption: '同一个函数，一串上界——上界不唯一（书上 p.50 的原话展开）',
          rows: [
            ['O(n³)', '最紧的自然上界', true],
            ['O(n⁴)', '更松，但正确——函数增长慢于 n⁴', true],
            ['O(n⁵)、O(n⁶)…', '照旧成立', true],
            ['O(n^c)，任意常数 c ≥ 3', '书上的general 形式', true],
          ],
        },
        {
          caption: '下界论证的三个数（图 3.1）',
          rows: [
            ['前 n/3 个位置', '被 n/3 个**最大值**占据（构造的坏输入）', true],
            ['中间 n/3 个位置', '每个最大值都必须**逐格穿过**这里', true],
            ['后 n/3 个位置', '排序后它们的目的地', true],
            ['(n/3)·(n/3) = n²/9', '第 6 行至少执行的搬移次数 → Ω(n²)', true],
          ],
        },
      ],
      chart: {
        xMax: 32,
        series: [
          { name: 'n', expr: 'n' },
          { name: 'n lg n', expr: 'n * Math.log2(n)' },
          { name: 'n²', expr: 'n * n' },
          { name: 'n³', expr: 'n * n * n' },
        ],
      },
      derivations: [
        {
          kind: 'summation',
          title: '下界的算术：(n/3)·(n/3) = n²/9',
          steps: [
            { tex: '\\frac{n}{3}\\ \\text{个值} \\times \\frac{n}{3}\\ \\text{个位置} = \\frac{n^2}{9}', zh: '每个最大值穿过中间 n/3 个位置，共 n/3 个最大值。' },
            { tex: '\\frac{n^2}{9} = \\frac{1}{9} n^2 \\in \\Omega(n^2)', zh: '常数 1/9 就是定义里的那个 c——渐进记号对它视而不见。' },
            { tex: 'O(n^2) \\wedge \\Omega(n^2) \\Rightarrow \\Theta(n^2)', zh: '结合 p.52 的上界，最坏情况收口为紧界。' },
          ],
        },
      ],
      note:
        '书上说形式定义在 3.2 节——那里会把「存在 c 与 n₀」写成量词，' +
        '并把 O/Ω/Θ 定义成**函数的集合**。本关的每个结论到时都能重新推一遍。',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    // 3.1 的「证明」不是循环不变量，而是图 3.1 的下界论证——同样三步走。
    {
      type: 'prove',
      title: '凭什么说最坏情况是 Ω(n²)',
      statement:
        'By saying that the worst-case running time of an algorithm is Ω(n 2 ), we mean that for every input size n above a certain threshold, there is at least one input of size n for which the algorithm takes at least cn 2 time, for some positive constant c . It does not necessarily mean that the algorithm takes at least cn 2 time for all inputs.',
      page: 52,
      intro:
        '这段话本身就是「要证的东西」，而且有个新手最容易踩的坑：**Ω 是对每个 n 存在一个坏输入**，' +
        '不是所有输入都坏。所以证明的形状是「构造」：对每个 n，亲手造出一个足够坏的输入。' +
        '下面三步就是那个构造，分别对应「观察规律 → 造输入 → 数次数」。',
      steps: [
        {
          title: '第一步 · 观察：往右挪 k 格 ⇔ 第 6 行跑 k 次',
          en: 'For a value to end up to the right of where it started, it must have been moved in line 6. In fact, for a value to end up k positions to the right of where it started, line 6 must have executed k times.',
          page: 52,
          body: [
            '把「运行时间」翻译成「第 6 行执行了多少次」——这是整个论证的**度量衡**。' +
            '第 6 行是唯一把值往右搬的代码，所以值的位移量恰好等于它的执行次数，一丝不差。',
            '★ 为什么这一步重要：它把「时间」变成了「可以数的东西」。' +
            '接下来不用谈秒、不用谈常数 c，只需要数格子。',
          ],
        },
        {
          title: '第二步 · 构造：把大的值全部放到左边',
          en: 'Suppose that in the input to INSERTION-SORT, the n/3 largest values occupy the first n/3 array positions A[1 : n/3]. (It does not matter what relative order they have within the first n/3 positions.) Once the array has been sorted, each of these n/3 values ends up somewhere in the last n/3 positions A[2n/3 + 1 : n].',
          page: 52,
          body: [
            '这就是那个「坏输入」：把 $n/3$ 个最大的值塞进数组前 $1/3$。' +
            '书上特意说**它们内部相对顺序随意**——论证对任何顺序都成立，这让它更强。',
            '排序之后这些值必须去数组的后 $1/3$（$A[2n/3+1 : n]$）。' +
            '换句话说：每个最大值都要**整体向右迁移 $2n/3$ 个位置**。',
          ],
        },
        {
          title: '第三步 · 数次数：n/3 个值 × 中间 n/3 个位置',
          en: 'Figure 3.1 The Ω(n 2 ) lower bound for insertion sort. If the first n/3 positions contain the n/3 largest values, each of these values must move through each of the middle n/3 positions, one position at a time, to end up somewhere in the last n/3 positions.',
          page: 52,
          body: [
            '从「必须挪 $2n/3$ 格」还能挤出更强的结论：这些值要**逐格**穿过中间那 $n/3$ 个位置。' +
            '所以第 6 行的执行次数至少是 $(n/3) \\times (n/3) = n^2/9$。',
            '按第一步的度量衡，这就是**时间**的下界：至少 $\\frac{1}{9}n^2$ 次搬移。' +
            '$\\frac{1}{9}$ 就是定义里那个正常数 $c$——渐进记号对它视而不见，所以结论写成 $\\Omega(n^2)$。',
            '★ 与上界合流：$O(n^2)$（对一切输入）+ $\\Omega(n^2)$（存在坏输入）' +
            '$\\Rightarrow$ 最坏情况 $\\Theta(n^2)$。这正是 2.2 节求和法算出的同一个答案，' +
            '但这次**没有算任何求和式**。',
          ],
        },
      ],
      conclusion:
        '于是插入排序的最坏情况运行时间是 $\\Theta(n^2)$，且这次我们**没有求和**：' +
        '上界来自「数循环」（外层 $n-1$ × 内层至多 $n-1$），下界来自「构造坏输入」。' +
        '★ 记住这个两段式套路——第 8 章证明问题的下界时，用的还是它，只是「构造坏输入」' +
        '那一步会换成归约。另外，图 3.1 用 $n/3$ 只是让算术干净；习题 3.1-1 让你把它推广到任意 $n$。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'single',
          q: '函数 f(n) = 7n³ + 100n² − 20n + 6 的最高阶项是哪个？',
          options: ['100n²', '7n³', '−20n', '6'],
          answer: 1,
          why:
            '最高阶项 = 次数最高的项 = $7n^3$。它决定增长率：$n$ 足够大时，' +
            '$100n^2$ 在它面前越来越可以忽略（阶段 6 的 C 程序第一部分把这个「忽略」算成了具体数字）。',
        },
        {
          kind: 'judge',
          q: 'f(n) = 7n³ + 100n² − 20n + 6 是 O(n³)，所以它不可能是 O(n⁴)。',
          answer: false,
          why:
            '错。书上说得很明白：因为它增长慢于 $n^4$，说它是 $O(n^4)$ 也完全正确，' +
            '而且 $O(n^5)$、$O(n^6)$……乃至 $O(n^c)$（$c \\ge 3$）都对（p.50）。' +
            '★ 上界不唯一——越松的上界越「没用」，但不是「错」。',
        },
        {
          kind: 'single',
          q: '下列哪个**不是** f(n) = 7n³ + 100n² − 20n + 6 的上界？',
          options: ['O(n³)', 'O(n⁴)', 'O(n²)', 'O(n¹⁰)'],
          answer: 2,
          why:
            '$O(n^2)$ 不成立：$n$ 足够大时 $7n^3$ 会远超任何 $c \\cdot n^2$（三次压不过二次）。' +
            '阶段 5 的滑杆就是让你亲眼看到这件事——把 $g$ 换成 $n^2$ 后判定永远变不了绿。',
        },
        {
          kind: 'single',
          q: '已知一个函数既是 O(f(n)) 又是 Ω(f(n))，能推出什么？',
          options: ['它是 O(f(n)²)', '它是 Θ(f(n))', '它是 Ω(f(n)²)', '什么都推不出'],
          answer: 1,
          why:
            '书上 p.51 的原话：两者都成立，就得到 $\\Theta(f(n))$（下一节会写成定理）。' +
            '这也是日常证 Θ 的标准流程：上界、下界各证一半。',
        },
        {
          kind: 'judge',
          q: '「INSERTION-SORT 的最坏情况运行时间是 Ω(n²)」意味着它的每一个输入都至少要花 cn² 时间。',
          answer: false,
          why:
            '错。书上 p.52 特别强调：对每个 $n$，只是**存在**一个坏输入花至少 $cn^2$，' +
            '"It does not necessarily mean that the algorithm takes at least cn² time for all inputs." ' +
            '已排序的输入就跑得很快（$\\Theta(n)$）。',
        },
        {
          kind: 'simulate',
          q: '按图 3.1 的构造取 n = 9（前 3 个位置放 3 个最大值）。这 3 个值至少要穿过中间 3 个位置——第 6 行至少执行多少次？（填一个数字）',
          expect: [9],
          placeholder: '例如：12',
          why:
            '$(n/3) \\times (n/3) = 3 \\times 3 = 9$，也就是 $n^2/9 = 81/9 = 9$。' +
            '这个 9 里有常数 $1/9$ 的影子——渐进记号把它吸收成 $\\Omega(n^2)$。',
        },
        {
          kind: 'judge',
          q: '渐进记号只能用来刻画算法的运行时间。',
          answer: false,
          why:
            '错。书上 p.50 专门提醒：它刻画的是**一般的函数**——空间占用也行，' +
            '甚至 "functions that have nothing whatsoever to do with algorithms"（与算法毫无关系的函数）也行。',
        },
        {
          kind: 'single',
          q: 'INSERTION-SORT 的最坏情况运行时间用渐进记号表示是？',
          options: ['O(n²)', 'Ω(n²)', 'Θ(n²)', 'Θ(n)'],
          answer: 2,
          why:
            '$\\Theta(n^2)$：p.52 给了任何输入的 $O(n^2)$，图 3.1 给了最坏情况的 $\\Omega(n^2)$，' +
            '两者合流（p.51 的规则）。注意单独答 $O$ 或 $\\Omega$ 都「对但不满分」——' +
            '书上的原话就是 "characterize its Θ(n²) worst-case running time"。',
        },
      ],
      bookExercises: [
        { id: '3.1-1', page: 53, star: 0,
          statement: 'Modify the lower-bound argument for insertion sort to handle input sizes that are not necessarily a multiple of 3.',
          hint: '图 3.1 用 n/3 只是为了让三段等长、算术干净。试试 ⌊n/3⌋：余数放到哪一段都行，' +
                '论证里那个「每值穿过每位置」的乘积会变成 ⌊n/3⌋·⌈…⌉ 之类——它依然是 Ω(n²)，' +
                '因为常数和低阶项都被渐进记号吸收了。' },
        { id: '3.1-2', page: 53, star: 0,
          statement: 'Using reasoning similar to what we used for insertion sort, analyze the running time of the selection sort algorithm from Exercise 2.2-2.',
          hint: '选择排序（习题 2.2-2）每轮都在剩余部分里找最小值再交换。' +
                '关键观察：内层的比较次数**只由剩余长度决定**，与输入内容无关——' +
                '所以上界论证都不需要「构造坏输入」，直接数就能得到 Θ(n²)。' },
        { id: '3.1-3', page: 53, star: 0,
          statement: 'Suppose that ˛ is a fraction in the range 0 < ˛ < 1. Show how to generalize the lower-bound argument for insertion sort to consider an input in which the ˛n largest values start in the first ˛n positions. What additional restriction do you need to put on ˛? What value of ˛ maximizes the number of times that the ˛n largest values must pass through each of the middle .1 − 2˛/n array positions?',
          hint: '把图 3.1 里的 n/3 换成 αn 重跑一遍：乘积变成 αn·(1−2α)n。' +
                '「额外的限制」来自中间那段必须存在（1−2α > 0）；' +
                '最大化就是求 α(1−2α) 的最大值——初中二次函数顶点。' },
      ],
    },
  ],
};
