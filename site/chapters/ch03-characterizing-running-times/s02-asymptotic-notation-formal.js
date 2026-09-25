/* =============================================================================
 * 第 3 章 3.2 —— 第 s02 关：3.2 Asymptotic notation: formal definitions
 *
 * 原文锚点：印刷页 53–62（pdf_index 74–83）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 TODO 处已人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

/* C 实现（与 c/growth_stats.c 完全一致，可直接编译运行）。
 * 用 String.raw 保留 \n 等反斜杠，避免被 JS 字符串转义解释。 */
const C_IMPL = String.raw`/*
 * growth_stats.c — CLRS 第 4 版 3.2 节「渐进记号的形式定义」配套 C 程序
 *
 * 对应原书 3.1 节（印刷页 50–51）给出的例子多项式：
 *     f(n) = 7 n^3 + 100 n^2 - 20 n + 6
 * 我们用真实数字验证两件事：
 *   1) 当 n 变大时，f(n) 由最高阶项 7 n^3 主导（比值 f(n)/(7 n^3) → 1）；
 *   2) 按 3.2 节 Θ 的形式定义，f(n) = Θ(n^3)：
 *      存在 c1, c2 > 0 与 n0，使对所有 n >= n0 都有 c1 n^3 <= f(n) <= c2 n^3。
 *
 * 本文件只有一个自变量 n，没有数组，所以不存在「书上每个下标减 1」的问题。
 * 函数头注释写清与书中公式的对应关系（p.50 的例子、3.2 的 Θ 定义）。
 *
 * 编译（本机已用 gcc 验证零警告）：
 *   gcc -std=c99 -Wall -Wextra -Werror -O0 -o growth_stats growth_stats.c && ./growth_stats
 */
#include <stdio.h>
#include <assert.h>

/* 原书 3.1 节例子的多项式：f(n) = 7 n^3 + 100 n^2 - 20 n + 6 */
static long long f(long long n)
{
    return 7LL * n * n * n + 100LL * n * n - 20LL * n + 6LL;
}

/* 最高阶项 7 n^3 —— 书上 p.50 说「它的最高阶项是 7 n^3」 */
static long long leading(long long n)
{
    return 7LL * n * n * n;
}

int main(void)
{
    printf("f(n) = 7 n^3 + 100 n^2 - 20 n + 6  主导项验证\n");
    printf("%-6s %-22s %-18s %-12s %-12s\n",
           "n", "f(n)", "7 n^3 (leading)", "f/(7n^3)", "低阶/(7n^3)");
    for (long long n = 1; n <= 1024; n *= 2) {
        long long fn = f(n);
        long long lead = leading(n);
        double ratio = (double)fn / (double)lead;          /* 应趋于 1 */
        double lower = (double)(fn - lead) / (double)lead; /* 低阶项占比，应趋于 0 */
        printf("%-6lld %-22lld %-18lld %-12.6f %-12.6f\n", n, fn, lead, ratio, lower);
    }

    /* 用 Θ 的形式定义（3.2 节）直接证明 f(n) = Θ(n^3)。
     * 取 c1 = 6, c2 = 8, n0 = 100：
     *   6 n^3 <= 7 n^3 + 100 n^2 - 20 n + 6 <= 8 n^3   对所有 n >= 100
     * 上界：需 100 n^2 - 20 n + 6 <= n^3，即 n^3 - 100 n^2 + 20 n - 6 >= 0。
     *       在 n = 100 时：1e6 - 1e6 + 2000 - 6 = 1994 > 0，且左侧随 n 单调增。
     * 下界：需 7 n^3 + 100 n^2 - 20 n + 6 >= 6 n^3，即 n^3 + 100 n^2 - 20 n + 6 >= 0，
     *       对所有 n >= 1 显然成立。
     */
    const long long c1 = 6, c2 = 8, n0 = 100;
    printf("\nTheta(n^3) 形式定义验证（取 c1=%lld, c2=%lld, n0=%lld）：\n", c1, c2, n0);
    printf("%-8s %-22s %-18s %-18s %s\n", "n", "c1 n^3", "f(n)", "c2 n^3", "6n^3<=f<=8n^3");
    for (long long n = n0; n <= 100000; n += 997) {
        long long fn = f(n);
        assert(c1 * n * n * n <= fn);
        assert(fn <= c2 * n * n * n);
        if (n <= 1000 || n == 100000) {
            printf("%-8lld %-22lld %-18lld %-18lld %s\n",
                   n, c1 * n * n * n, fn, c2 * n * n * n, "yes");
        }
    }
    printf("ALL GROWTH-STATS TESTS PASSED\n");
    return 0;
}
`;

export default {
  key: 's02',
  id: 'ch03/s02',
  chapter: 3,
  section: '3.2',
  title: '渐进记号的形式定义',
  shortTitle: '3.2 渐进记号的形式定义',
  titleEn: 'Asymptotic notation: formal definitions',
  source: { printed: [53, 62], pdf: [74, 83] },
  sourceNote:
    '本关对应原书 3.2 节（印刷页 53–62）。第 3.1 节只是**非正式地**使用 Θ/O/Ω' +
    '（"roughly proportional when n is large"），这一节把五个记号——Θ、O、Ω、o、ω——' +
    '全部写成带常数 $c_1,c_2,n_0$ 的严格集合定义，并列出它们的代数性质' +
    '（传递性、自反性、对称性、三分性）与一条核心定理 Theorem 3.1。' +
    '全书的复杂度断言从此都以这一节的定义为准。',
  prerequisites: [
    { label: '3.1 O-notation, Ω-notation, and Θ-notation', url: '#/ch03/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '这一关要把「差不多」说精确',
      why:
        '第 3.1 节你学会了用 Θ 表示"当 n 很大时大致成正比"。但"大致"到底是多松？' +
        '两个函数差 100 倍常数算不算"同一量级"？"从某一刻起"是从哪一刻开始？' +
        '这一关给每个记号配上一组**正的常数** $c_1,c_2$ 和一个**起点** $n_0$，' +
        '把"差不多"钉死成"对所有 $n \\ge n_0$ 都满足这个不等式"。' +
        '钉死之后，后面整本书的"$T(n)=\\Theta(n\\lg n)$"才是有据可依的陈述，而不是模糊的直觉。',
      position:
        '第 3 章第 2 节（印刷页 53–62）。它的前置是 3.1 的非正式记号；' +
        '它直接喂给 3.3（标准函数与记号的关系），并间接喂给第 4 章（解递归式要用 Θ 套上去）。' +
        '一句话：这一关是"复杂度语言"的语法书，后面所有算法都讲这门语言。',
      unlocks: [
        { label: '3.3 Standard notations and common functions', url: '#/ch03/s03' },
        // 预告后面章节（检查会以 WARN 提示该章尚未构建，属正常）：
        { label: '第 4 章 分治法（递归式将套用本关的 Θ 定义）', url: '#/ch04/s01' },
      ],
      mathKit: [
        {
          title: '集合记号 { f(n) : … }',
          body:
            '原书这一节把每个记号都定义成一个**函数集合**：例如 $O(g(n))$ 是' +
            '"所有被 $g(n)$ 的某个常数倍从上方压住的函数"组成的集合。' +
            '所以写 $f(n)=O(g(n))$ 时，严格说是"$f(n)$ 属于这个集合"——' +
            '原书在 3.2 末尾专门点名这是"proper notational abuse"（把集合成员关系写成等号）。' +
            '新手最常翻的车就是忘了 $O$ 是一族函数，而不是一个具体的值。',
        },
        {
          title: '不等式三件套：上界 / 下界 / 夹逼',
          body:
            '$f(n) \\le c\\,g(n)$ 是"被压住"（上界）；$f(n) \\ge c\\,g(n)$ 是"托住"（下界）；' +
            '$c_1 g(n) \\le f(n) \\le c_2 g(n)$ 是"两头夹住"（紧界 Θ）。' +
            '这一节的全部定义，本质上就是给这三种不等式各配一个"从 $n_0$ 之后恒成立"的开关。',
        },
        {
          title: '常数 $n_0$ 的含意',
          body:
            '$n_0$ 是"从某个足够大的规模起"的那个起点。**任何**更大的起点也照样成立——' +
            '它说的是"最终趋势"，而不是"在 $n_0$ 那一点第一次变真"。' +
            '所以同一个界可以有无穷多个合法的 $(c_1,c_2,n_0)$ 组合，原书常说"for some constants"。',
        },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '对方问你"凭什么"的时候',
      scene: '你给别人写："这段程序是 $O(n^2)$ 的。"对方反问："凭什么？"',
      body:
        '"凭什么"问的正是这一关要补的东西。你心里想的是："当数据量很大时，它的耗时最多是 $n^2$ 的若干倍。"' +
        '但"若干倍"到底是几倍？"很大时"是从多大的 $n$ 算起？含糊的说法经不起追问。' +
        '这一关给你一套**可验证的承诺**：你说 $f(n)=O(g(n))$，等于承诺' +
        '"存在某个常数 $c$ 和某个起点 $n_0$，使得对所有 $n\\ge n_0$ 都有 $0\\le f(n)\\le c\\,g(n)$"。' +
        '对方只要挑出一对 $(c,n_0)$ 就能检验你的话——这才叫"证明"，而不是"感觉"。' +
        '类比：说"我家到公司打车费不超过 50 块"（$O(50)$），是在承诺"存在封顶价 50，' +
        '不管怎么绕（只要 $n$ 别太小）都不超"。说"恰好 50 块上下浮动"（Θ），则是更紧的承诺：' +
        '既不超过 50，也不低于某个下限。Θ 比 O 多了一句"也托得住"。' +
        '下面进入正文：先把第 3.1 节用插入排序得到的结论，正式改写成这套带常数的语言。',
      // body 为单字符串（用 + 拼接多段），无数组括号
      interactive: {
        text:
          '先做个预测：对 $f(n)=n^2+10n$，你能不能找到一对 $(c,n_0)$ 使得' +
          '对所有 $n\\ge n_0$ 都有 $n^2 \\le n^2+10n \\le c\\,n^2$？' +
          '把猜的 $c$ 与 $n_0$ 记住——阶段 5 的滑杆会让你亲手把这两个数拖出来，' +
          '看"从某一刻起一直夹住"到底长什么样。',
      },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自 data/blocks/part-i-foundations__ch03.json，每条都已通过溯源判据。
    // 请勿改写 en；每条已补上 zh（中文解读）。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 53,
          en: 'n/3 positions one position at a time, by at least n/3 executions of line 6. Because at least n/3 values have to pass through at least n/3 positions, the time taken by INSERTION-SORT in the worst case is at least proportional to (n/3).n/3/ = n 2/9, which is Ω(n 2 ).',
          zh: '这是 3.1 节对插入排序最坏情况的下界论证（保留作本节的动机）。它想说：最坏情况下比较次数"至少正比于 $n^2/9$"，所以记作 $\\Omega(n^2)$。注意这里的 $1/9$ 只是具体常数，Θ 记号会把它吸收掉——重要的是"平方级"这个量级，而不是前面的系数。新手常卡在 $n^2/9$ 这个数上，其实它只是推导顺带算出来的，与本关定义的 $\\Omega$ 无关。' },
        { kind: 'body', page: 53,
          en: 'Because we have shown that INSERTION-SORT runs in O(n 2 ) time in all cases and that there is an input that makes it take Ω(n 2 ) time, we can conclude that the worst-case running time of INSERTION-SORT is Θ(n 2 ). It does not matter that the constant factors for upper and lower bounds might differ. What matters is that we have characterized the worst-case running time to within constant factors',
          zh: '这句话点出 Θ 的精髓：**上界常数与下界常数可以不一样**。只要"存在一个上界常数"且"存在（另一个）下界常数"，就足以说最坏情况是 $\\Theta(n^2)$。"to within constant factors"（只差常数倍）是 Θ 的全部承诺。这正好对应阶段 1 说的"两头夹住"，且两头用的 $c_1,c_2$ 不必相等。' },
        { kind: 'body', page: 53,
          en: '(discounting lower-order terms). This argument does not show that INSERTION- SORT runs in Θ(n 2 ) time in all cases. Indeed, we saw in Chapter 2 that the bestcase running time is Θ(n).',
          zh: '关键提醒：**这个 $\\Theta(n^2)$ 只是最坏情况（worst case）的结论**。原书特意说"并不表示所有情况都是 $\\Theta(n^2)$"——因为最好情况（已排序输入）只有 $\\Theta(n)$。新手最大的误区就是把"最坏情况 Θ"误读成"算法整体 Θ"。渐近记号必须挂在具体情形（最坏 / 最好 / 平均）上，不能脱离情形空谈。' },
        { kind: 'body', page: 53,
          en: 'Having seen asymptotic notation informally, let’s get more formal. The notations we use to describe the asymptotic running time of a n algorithm are defined in terms of functions whose domains are typically the set N of natural numbers or the set R of real numbers. Such notations are convenient for describing a runningtime function T(n). This section defines the basic asymptotic notations and also introduces some common "proper" notational abuses.',
          zh: '这是本节的"转场句"，也是本关的总纲。它预告两件事：(1) 记号定义在函数 $f:\\mathbb{N}\\to\\mathbb{R}$ 上（所以渐近记号说的是"函数族之间的关系"，不是具体数值）；(2) 结尾会点名"proper notational abuses"——比如把集合成员关系写成 $f(n)=\\Theta(g(n))$ 这种等号。本阶段末尾的"伪代码"卡会把这五个记号统一列成集合写法。' },
        { kind: 'body', page: 54,
          en: '(a) (b) (c) n n n n 0 n 0 n 0 f(n) = Θ(g(n)) f(n) = O(g(n)) f(n) = Ω(g(n)) f(n) f(n) f(n) cg(n) cg(n) c 1 g(n) c 2 g(n)',
          zh: '这是原书 Figure 3.2 的图注（OCR 把三幅子图压成了一行）。它画的正是三个阶段 5 要你亲手拖出来的东西：(a) Θ——曲线被夹在 $c_1g$ 与 $c_2g$ 之间；(b) O——曲线被压在 $c\\,g$ 下方；(c) Ω——曲线被托在 $c\\,g$ 上方。三条竖线 $n_0$ 标出"从这儿往右才保证成立"。阶段 5 的 band 滑杆就是这张图的互动版。' },
        { kind: 'body', page: 54,
          en: 'We write f(n) = Θ(g(n)) if there exist positive constants n 0 , c 1 , and c 2 such that at and to the right of n 0 , the value of f(n) always lies between c 1 g(n) and c 2 g(n) inclusive.',
          zh: 'Θ 的正式定义（本关最重要的一句话）。逐词拆解：**positive constants**——$c_1,c_2,n_0$ 都必须是正常数；**at and to the right of $n_0$**——"从 $n_0$ 起、含 $n_0$ 往右全部成立"，这正是阶段 1 说的"最终趋势"；**always lies between … inclusive**——夹逼且端点可取等。新手三个易错点：① 把 $n_0$ 当成"第一次成立的点"（其实更大也行）；② 以为 $c_1=c_2$（不必）；③ 漏掉"inclusive"（端点等号是允许的，比如 $f(n)=n^2$ 对 $g(n)=n^2$ 取 $c_1=c_2=1$ 即可）。' },
      ],
      terms: [
        { en: 'asymptotic notation', zh: '渐进记号', page: 53 },
        { en: 'Θ-notation', zh: 'Θ 记号（紧界）', page: 54 },
        { en: 'O-notation', zh: 'O 记号（渐进上界）', page: 54 },
        { en: 'Ω-notation', zh: 'Ω 记号（渐进下界）', page: 55 },
        { en: 'o-notation', zh: 'o 记号（严格上界 / 小 o）', page: 60 },
        { en: 'ω-notation', zh: 'ω 记号（严格下界 / 小 ω）', page: 61 },
        { en: 'transitivity', zh: '传递性', page: 62 },
        { en: 'trichotomy', zh: '三分性', page: 62 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 本节没有算法伪代码，但原书把五个记号都写成"集合定义"。这里把它们整理成一张
    // 可在页面上点开的"定义卡"，方便随时回查。这些不是 en 原文引述，而是本关对正文
    // 定义的标准符号化重述（与阶段 3 的逐字引述互补）。
    {
      type: 'pseudocode',
      title: '把五个记号写成集合',
      algo: 'ASYMPTOTIC-SETS',
      signature: 'Θ/O/Ω/o/ω 都是函数集合',
      page: 54,
      lines: [
        { n: 1, code: 'Θ(g(n)) = { f(n) : ∃ c1,c2,n0>0 s.t. 0 ≤ c1·g(n) ≤ f(n) ≤ c2·g(n), ∀ n ≥ n0 }',
          zh: '紧界：被 $c_1g$ 与 $c_2g$ 从两边夹住（原书 p54）。' },
        { n: 2, code: 'O(g(n)) = { f(n) : ∃ c,n0>0 s.t. 0 ≤ f(n) ≤ c·g(n), ∀ n ≥ n0 }',
          zh: '上界：只要求被 $c\\,g$ 从上方压住（原书 p54，Figure 3.2(b)）。' },
        { n: 3, code: 'Ω(g(n)) = { f(n) : ∃ c,n0>0 s.t. 0 ≤ c·g(n) ≤ f(n), ∀ n ≥ n0 }',
          zh: '下界：只要求托在 $c\\,g$ 上方（原书 p55，Figure 3.2(c)）。' },
        { n: 4, code: 'o(g(n)) = { f(n) : ∀ c>0, ∃ n0 s.t. 0 ≤ f(n) < c·g(n), ∀ n ≥ n0 }',
          zh: '小 o（严格上界）：对任何常数 $c$ 最终都压得住，即 $\\lim_{n\\to\\infty} f(n)/g(n)=0$（原书 p60）。' },
        { n: 5, code: 'ω(g(n)) = { f(n) : ∀ c>0, ∃ n0 s.t. 0 ≤ c·g(n) < f(n), ∀ n ≥ n0 }',
          zh: '小 ω（严格下界）：对任何常数 $c$ 最终都托得住，即 $\\lim_{n\\to\\infty} g(n)/f(n)=0$（原书 p61）。' },
        { n: 6, code: 'f(n)=Θ(g(n)) ⇔ f(n)=O(g(n)) 且 f(n)=Ω(g(n))',
          zh: 'Theorem 3.1（原书 p56）：Θ 就是 O 与 Ω 的交集。阶段 8 会证它。' },
      ],
      vars: [
        { name: 'c1, c2', meaning: '夹逼用的两个正常数（可不同）' },
        { name: 'n0', meaning: '保证不等式成立的起点' },
        { name: 'c', meaning: '单边上 / 下界用的正常数' },
      ],
      note: '注意：原书把 $f(n)=\\Theta(g(n))$ 这种"等号"明确称为 notational abuse——$\\Theta(g(n))$ 是一个集合，$f(n)$ 是其中一员。但全书都这么写，你也要习惯。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '拖出那组常数，看"夹住"长什么样',
      viz: 'growth',
      algorithm: null,
      pseudocodeRef: null,
      chart: {
        xMax: 32,
        caption: 'f(n)=n²+10n 被夹在 n²（下界 c₁=1）与 2n²（上界 c₂=2）之间，n≥10 起恒成立 → Θ(n²)',
        series: [
          { name: 'f(n) = n² + 10n', expr: 'n * n + 10 * n', color: '--viz-active' },
          { name: 'g(n) = n²（下界 c₁·g）', expr: 'n * n', color: '--viz-done' },
        ],
        band: {
          g: 'n * n',
          c: 2,
          n0: 10,
          label: 'c₂·n² = 2n²（上界）',
        },
      },
      note:
        '拖动面板上的两个滑杆：把 $c$ 调大、把 $n_0$ 右移，观察虚线 $c\\cdot g(n)$ 是否从某一刻起' +
        '一直压在 $f(n)$ 上方。这条虚线 + 那条竖线 $n_0$，正是原书 Figure 3.2(b) 想让你"看见"的东西。' +
        '对 $f(n)=n^2+10n$，取 $c_2=2$、$n_0=10$ 就够：因为 $n^2+10n\\le 2n^2 \\iff n\\ge 10$。' +
        '下界那根实线 $n^2$ 则对应 $c_1=1$（对所有 $n\\ge1$ 都成立）。两头一夹，$f(n)=\\Theta(n^2)$。',
      tasks: [
        '把 $n_0$ 拖到 5，看 $f(n)$ 是否仍被 $2n^2$ 压住——为什么在 $n<10$ 时漏出去了？',
        '试着把 $c_2$ 改成 1.5，找最小的 $n_0$ 使"从那以后一直压住"成立。',
      ],
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '用 C 数出"主导项"',
      intro:
        '本节没有数组、没有下标，所以不存在"书上每个下标减 1"的问题——这里只有一个自变量 $n$。' +
        '这份 C 程序做两件事：① 打印 $f(n)/(7n^3)$ 随 $n$ 增大趋近于 1，证明低阶项被"吃掉"；' +
        '② 用断言直接按 Θ 的形式定义验证 $f(n)=7n^3+100n^2-20n+6=\\Theta(n^3)$' +
        '（取 $c_1=6,c_2=8,n_0=100$）。函数头注释写清了与书 p.50 例子、3.2 定义的对应。',
      pseudocodeRef: null,
      c: {
        file: 'growth_stats.c',
        code: C_IMPL,
        notes: [
          { line: 21, zh: 'f(n) 原函数：最高阶项 7n³ 主导，低阶项 100n²−20n+6 随 n 增大占比趋零。' },
          { line: 27, zh: 'leading(n)=7n³：书 p.50 说的"最高阶项"。' },
          { line: 53, zh: '取 (c1,c2,n0)=(6,8,100)：任何更大的 n0 也成立，这里只演示一组。' },
          { line: 58, zh: 'assert 直接落地 Θ 定义的下界 c1·n³ ≤ f(n)。' },
          { line: 59, zh: 'assert 落地 Θ 定义的上界 f(n) ≤ c2·n³。' },
        ],
      },
      mapping: [],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '五个记号与一条核心定理',
      intro: '这一关的"复杂度结论"就是五个记号各自的精确定义，以及它们之间的关系。下面每条都给了原书页码出处。',
      claims: [
        { expr: 'f(n) = Θ(g(n))', when: '∃ c1,c2,n0>0 使 c1·g(n) ≤ f(n) ≤ c2·g(n) 对所有 n≥n0', page: [54], source: 'book' },
        { expr: 'f(n) = O(g(n))', when: '上界：∃ c,n0>0 使 0 ≤ f(n) ≤ c·g(n) 对所有 n≥n0', page: [54], source: 'book' },
        { expr: 'f(n) = Ω(g(n))', when: '下界：∃ c,n0>0 使 0 ≤ c·g(n) ≤ f(n) 对所有 n≥n0', page: [55], source: 'book' },
        { expr: 'f(n) = o(g(n))', when: '严格上界（小 o）：lim_{n→∞} f(n)/g(n) = 0', page: [60], source: 'book' },
        { expr: 'f(n) = ω(g(n))', when: '严格下界（小 ω）：lim_{n→∞} g(n)/f(n) = 0', page: [61], source: 'book' },
        { expr: 'f(n)=Θ(g(n)) ⇔ f(n)=O(g(n)) 且 f(n)=Ω(g(n))', when: 'Theorem 3.1', page: [56], source: 'book' },
        { expr: 'O/Ω/Θ 具传递性、自反性；Θ 对称；O 与 Ω 反对称；o/ω 具三分性对照', when: '代数性质', page: [62], source: 'book' },
      ],
      tables: [
        { caption: '五个记号一览（g 固定，f 是待分类的函数）',
          rows: [
            ['Θ(g(n))', 'c₁g ≤ f ≤ c₂g，对所有 n≥n₀', '紧界（上下都夹）', true],
            ['O(g(n))', 'f ≤ c·g，对所有 n≥n₀', '渐进上界', true],
            ['Ω(g(n))', 'c·g ≤ f，对所有 n≥n₀', '渐进下界', true],
            ['o(g(n))', 'f < c·g 对一切 c>0 最终成立', '严格上界（lim=0）', false],
            ['ω(g(n))', 'c·g < f 对一切 c>0 最终成立', '严格下界（lim=0）', false],
          ] },
      ],
      chart: {
        xMax: 32,
        caption: 'f(n)=7n³+100n²−20n+6 与它的主导项 7n³ 几乎重合 → Θ(n³)',
        series: [
          { name: 'f(n)=7n³+100n²−20n+6', expr: '7*n*n*n + 100*n*n - 20*n + 6', color: '--viz-active' },
          { name: '7n³（主导项）', expr: '7*n*n*n', color: '--viz-done' },
        ],
      },
      derivations: [
        { kind: 'set-membership', title: '用形式定义验证 f(n)=7n³+100n²−20n+6 = Θ(n³)',
          steps: [
            { tex: '取\\ c_1=6,\\ c_2=8,\\ n_0=100', zh: '这是阶段 6 程序里实际 assert 的一组常数，下面证它们满足定义。' },
            { tex: '下界:\\ 7n^3+100n^2-20n+6 \\ge 6n^3 \\iff n^3+100n^2-20n+6\\ge0', zh: '对所有 $n\\ge1$ 显然成立，故 $c_1n^3\\le f(n)$ 对所有 $n\\ge n_0$ 成立。' },
            { tex: '上界:\\ 7n^3+100n^2-20n+6 \\le 8n^3 \\iff n^3-100n^2+20n-6\\ge0', zh: '在 $n=100$ 时等于 $1994>0$，且左侧随 $n$ 单调增，故对所有 $n\\ge100$ 成立。' },
            { tex: '\\therefore\\ f(n)=\\Theta(n^3)', zh: '上下界同时成立，按 p54 的 Θ 定义即得。★ 这是本站按定义逐步推出的（source: instructor），程序已用断言验证。' },
          ] },
      ],
      note: '小 o / 小 ω 是 O / Ω 的"严格版"：例如 $2n^2=O(n^2)$ 但 $2n^2\\neq o(n^2)$（比值不趋于 0）；而 $n=o(n^2)$ 成立。',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    // 本节没有循环不变量，本关用"证明 Theorem 3.1"来充当正确性论证：
    // Θ 与（O 且 Ω）互为充要。statement 是中文重述（非 en 字段，不进溯源比对），
    // 三步为双向证明，en 字段略去，直接写中文展开。
    {
      type: 'prove',
      title: '凭什么 Θ 就是"上下都夹"',
      statement:
        'Theorem 3.1（原书 p56）：对任意两个函数 $f(n)$ 与 $g(n)$，' +
        '$f(n)=\\Theta(g(n))$ 当且仅当 $f(n)=O(g(n))$ 且 $f(n)=\\Omega(g(n))$。',
      page: 56,
      intro:
        '这条定理把阶段 4 第 6 行的集合关系变成"充要"，是全书最常用的一句话。' +
        '下面分正向、反向两步证。每一步都只用阶段 3/4 的正式定义，不引入新概念。',
      steps: [
        {
          title: '第一步 · 正向（Θ ⇒ O 且 Ω）',
          page: 56,
          body: [
            '假设 $f(n)=\\Theta(g(n))$。按 p54 定义，存在正常数 $c_1,c_2,n_0$ 使' +
              '$c_1g(n)\\le f(n)\\le c_2g(n)$ 对所有 $n\\ge n_0$ 成立。',
            '右半边 $f(n)\\le c_2g(n)$ 恰好就是 $O(g(n))$ 的定义（取常数 $c=c_2$ 与同一 $n_0$），' +
              '所以 $f(n)=O(g(n))$。',
            '左半边 $c_1g(n)\\le f(n)$ 恰好就是 $\\Omega(g(n))$ 的定义（取常数 $c=c_1$ 与同一 $n_0$），' +
              '所以 $f(n)=\\Omega(g(n))$。',
            '两个方向同时得到，正向成立。',
          ],
        },
        {
          title: '第二步 · 反向（O 且 Ω ⇒ Θ）',
          page: 56,
          body: [
            '假设 $f(n)=O(g(n))$ 且 $f(n)=\\Omega(g(n))$。',
            '由 $O$ 得：存在 $c_2>0,n_2$ 使对所有 $n\\ge n_2$ 有 $f(n)\\le c_2g(n)$。',
            '由 $\\Omega$ 得：存在 $c_1>0,n_1$ 使对所有 $n\\ge n_1$ 有 $c_1g(n)\\le f(n)$。',
            '取 $n_0=\\max(n_1,n_2)$。对所有 $n\\ge n_0$，上面两个不等式同时成立，' +
              '即 $c_1g(n)\\le f(n)\\le c_2g(n)$——这正是 $\\Theta(g(n))$ 的定义（取这两个 $c_1,c_2$ 与 $n_0$）。',
            '反向成立。两步合起来即 Theorem 3.1。',
          ],
        },
        {
          title: '第三步 · 收束',
          page: 56,
          body: [
            '结论：只要你能分别证出 $f=O(g)$ 与 $f=\\Omega(g)$，就自动得到 $f=\\Theta(g)$——' +
              '而且上下界可以（也常常）用不同的常数。',
            '反过来，若你只想说"最坏情况不超过某量级"，用 $O$ 就够了，不必强求 $\\Theta$；' +
              '但一旦 $\\Theta$ 成立，说明你把这个函数"夹"紧了，信息量比单独的 $O$ 或 $\\Omega$ 都大。',
          ],
        },
      ],
      conclusion:
        'Theorem 3.1 证毕。它让"求 Θ"这件事被拆成"求上界 + 求下界"两个更小的问题——' +
        '这正是第 4 章解递归式时反复用的套路：先套出 $O$，再套出 $\\Omega$，合起来就是 $\\Theta$。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'judge',
          q: '若 $f(n)=O(g(n))$，则表示当 $n$ 足够大时，$f(n)$ 的增长最终被 $g(n)$ 的某个常数倍压住。',
          answer: true,
          why:
            '对。这正是 p54 的 $O$ 定义：存在 $c,n_0>0$ 使对所有 $n\\ge n_0$ 有 $0\\le f(n)\\le c\\,g(n)$。' +
            '关键是"最终"（从 $n_0$ 起）与"常数倍"，与具体系数无关。',
        },
        {
          kind: 'single',
          q: '若 $f(n)=7n^3+100n^2-20n+6$，则 $f(n)$ 属于下列哪个集合？',
          options: ['$\\Theta(n^2)$', '$\\Theta(n^3)$', '$\\Theta(n)$', '$o(n^3)$'],
          answer: 1,
          why:
            '最高阶项是 $7n^3$，低阶项随 $n$ 增大被吃掉，故 $f(n)=\\Theta(n^3)$（阶段 6 程序已用断言验证）。' +
            '注意它不是 $o(n^3)$，因为 $f(n)/n^3\\to7\\neq0$。',
        },
        {
          kind: 'judge',
          q: '$\\Theta$ 记号要求上界与下界用同一个常数 $c$。',
          answer: false,
          why:
            '错。p54 的定义用 $c_1,c_2$ 两个**可不同**的正常数夹住：$c_1g(n)\\le f(n)\\le c_2g(n)$。' +
            '插入排序最坏情况就是上界常数与下界常数不同的典型例子。',
        },
        {
          kind: 'single',
          q: '为什么说"算法的运行时间至少是 $O(n^2)$"这句话没意义？',
          options: ['因为 $O$ 是上界不是下界', '因为 $n^2$ 太小', '因为没给 $n_0$', '因为 $\\Theta$ 更强'],
          answer: 0,
          why:
            '原书习题 3.2-2 点名这个病句：$O$ 表示"不超过"，说"至少是不超过"自相矛盾。' +
            '想表达下界应当用 $\\Omega(n^2)$。',
        },
        {
          kind: 'judge',
          q: '$o(g(n))$ 是 $O(g(n))$ 的真子集（更小、更紧的一族）。',
          answer: true,
          why:
            '对。$o$ 是"严格上界"：$f=o(g)$ 必推出 $f=O(g)$，但反之不成立（如 $2n^2=O(n^2)$ 却不是 $o(n^2)$）。',
        },
        {
          kind: 'single',
          q: '根据 Theorem 3.1，$f(n)=\\Theta(g(n))$ 等价于？',
          options: ['$f=O(g)$ 或 $f=\\Omega(g)$', '$f=O(g)$ 且 $f=\\Omega(g)$', '$f=o(g)$', '$f=\\omega(g)$'],
          answer: 1,
          why:
            '正是 p56 的定理：Θ 是 O 与 Ω 的交集，需要上下界同时成立（且常数可不同）。',
        },
        {
          kind: 'judge',
          q: '$n = o(n^2)$ 成立。',
          answer: true,
          why:
            '对。$n/n^2 = 1/n \\to 0$，满足小 o 的极限定义（p60）。这是"线性慢于平方"的严格说法。',
        },
        {
          kind: 'single',
          q: '对 $f(n)=3n^2+2n+1$，下列哪个断言正确？',
          options: ['$f=\\Theta(n^2)$', '$f=\\Theta(n)$', '$f=O(n)$', '$f=\\Omega(n^3)$'],
          answer: 0,
          why:
            '最高阶项 $3n^2$ 主导，故 $f(n)=\\Theta(n^2)$。取 $c_1=3,c_2=6,n_0=1$ 即可验证：' +
            '$3n^2\\le 3n^2+2n+1\\le 6n^2$ 对 $n\\ge1$ 成立。',
        },
      ],
      bookExercises: [
        { id: '3.2-1', page: 62, star: 0,
          statement: 'Let f(n) and g(n) be asymptotically nonnegative functions. Using the basic definition of Θ-notation, prove that max ff(n),g(n) g = Θ(f(n) + g(n)).',
          hint: '按定义分别证上下界：下界取 $c_1=1/2$（因 $\\max\\ge$ 任一项 $\\ge$ 两项和的一半）；上界取 $c_2=1$（因 $\\max\\le$ 两项和）。找使两式对所有 $n\\ge n_0$ 成立的 $n_0$。' },
        { id: '3.2-2', page: 62, star: 0,
          statement: 'Explain why the statement, "The running time of algorithm A is at least O(n 2 )," is meaningless.',
          hint: '$O$ 是"上界"，"至少"是下界语义，二者矛盾。要表达下界该用 $\\Omega(n^2)$。想清楚"at least"修饰的是谁。' },
        { id: '3.2-3', page: 62, star: 0,
          statement: 'Is 2 n + 1 = O(2 n )? Is 2 2n = O(2 n )?',
          hint: '第一问：提取 $2^{n+1}=2\\cdot2^n$，常数倍成立 → 是。第二问：$2^{2n}=(2^n)^2$，与 $2^n$ 之比是 $2^n\\to\\infty$，不是常数倍 → 否（其实是 $\\omega$）。' },
        { id: '3.2-4', page: 62, star: 0,
          statement: 'Prove Theorem 3.1.',
          hint: '定理 3.1 就是本关阶段 8 三步证的这条，照它的骨架自己写一遍：正向：$f(n)=\\Theta(g(n))$ 给出 $c_1,c_2,n_0$，使得 $c_1 g(n)\\le f(n)\\le c_2 g(n)$ 对一切 $n\\ge n_0$ 成立。右半截单独拿出来就是 $O(g(n))$ 的定义（见证 $c_2,n_0$），左半截单独拿出来就是 $\\Omega(g(n))$ 的定义（见证 $c_1,n_0$）。反向：$O$ 给 $(c_1,n_1)$、$\\Omega$ 给 $(c_2,n_2)$，两者的起点不一样，必须取 $n_0$ 为二者较大者才能同时成立；$\\Theta$ 要求的两个常数正好由两边各自提供，且都严格为正。' },
        { id: '3.2-5', page: 63, star: 0,
          statement: 'Prove that the running time of an algorithm is Θ(g(n)) if and only if its worst-case running time is O(g(n)) and its best-case running time is Ω(g(n)).',
          hint: '把"最坏情况 $=O(g)$"与"最好情况 $=\\Omega(g)$"代入：最坏给上界、最好给下界，合起来正是 Θ 的夹逼。注意必须分别挂在 worst / best 上，不能混。' },
        { id: '3.2-6', page: 63, star: 0,
          statement: 'Prove that o(g(n)) \\ !.g(n)/ is the empty set.',
          hint: '反证：设 $f$ 同时属于两者。$o$ 说「对任意 $c>0$，最终 $f(n)\\le c\\,g(n)$」，$\\omega$ 说「对任意 $c>0$，最终 $f(n)\\ge c\\,g(n)$ 且比值趋于 $\\infty$」。取同一个 $c$ 就撞上了。注意本题要比的是严格下界 $\\omega$（比值发散），不是 $\\Omega$（只要 $f/g\\ge c$）—— 后者与 $o$ 的交集也空，但那是另一道题。' },
        { id: '3.2-7', page: 63, star: 0,
          statement: 'We can extend our notation to the case of two parameters n and m that can go to 1 independently at different rates. For a given function g(n,m) , we denote by O(g(n,m)) the set of functions O(g(n,m)) = ff(n,m) W there exist positive constants c , n 0 , and m 0 such that 0 ≤ f(n,m) ≤ cg(n,m) for all n ≥ n 0 or m ≥ m 0 g : Give corresponding definitions for Ω(g(n; m)) and Θ(g(n,m)) .',
          hint: '照抄题面给的连接词，别自己换：原书 $O(g(n,m))$ 的条件是「对所有 $n\\ge n_0$ **或** $m\\ge m_0$」，也就是要在两个半平面的并集上都成立。$\\Omega$ 与 $\\Theta$ 沿用同一种量词，只把不等号换向（$\\Omega$）或两头都夹（$\\Theta$）。写完拿一个会变号的 $f$ 检验一下 $\\Theta$ 是否还等价于「$O$ 且 $\\Omega$」。' },
      ],
    },
  ],
};
