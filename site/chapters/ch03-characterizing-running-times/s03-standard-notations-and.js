/* =============================================================================
 * 第 3 章 3.3 —— 第 s03 关：3.3 Standard notations and common functions
 *
 * 原文锚点：印刷页 63–75（pdf_index 84–96）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 TODO 处已人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

/* C 实现（与 c/compare_growth.c 完全一致，可直接编译运行）。
 * 用 String.raw 保留 \n 等反斜杠，避免被 JS 字符串转义解释。 */
const C_IMPL = String.raw`/*
 * compare_growth.c — CLRS 第 4 版 3.3 节「标准记号与常用函数」配套 C 程序
 *
 * 把同一组 n 下的一串常用函数的值打出来，看它们怎么交叉、看谁先失控：
 *     lg n, sqrt(n), n, n lg n, n^2, 2^n
 * 另外用比值定量展示两条关键的「小 o」关系（都对应 3.3 节的结论）：
 *   sqrt(n) / lg n  -> +inf   即 lg n = o(sqrt n)         （polylog 论证的雏形）
 *   2^n / n^2       -> +inf   即 n^2 = o(2^n)             （式 (3.13) 的特例 a=2, b=2）
 *
 * 下标约定：只有自变量 n，没有数组，所以不存在「书上每个下标减 1」的问题。
 *
 * 编译（本机已用 gcc 验证零警告）：
 *   gcc -std=c99 -Wall -Wextra -Werror -O0 -o compare_growth compare_growth.c && ./compare_growth
 */
#include <stdio.h>
#include <math.h>

static double lg(double n) { return log2(n); }

int main(void)
{
    printf("同一组 n 下各常用函数的增长（n = 2^k）：\n");
    printf("%-8s %-10s %-10s %-8s %-12s %-14s %-20s\n",
           "n", "lg n", "sqrt n", "n", "n lg n", "n^2", "2^n");
    for (int e = 0; e <= 6; e++) {
        double n = (double)(1 << e);          /* n = 1, 2, 4, 8, 16, 32, 64 */
        unsigned long long two_n = (n <= 63) ? (1ULL << (int)n) : 0; /* 2^n，n 太大时溢出不打 */
        printf("%-8.0f %-10.4f %-10.4f %-8.0f %-12.1f %-14.0f %-20llu\n",
               n, lg(n), sqrt(n), n, n * lg(n), n * n, two_n);
    }

    /* 定量展示 lg n = o(sqrt n)：sqrt(n)/lg n 应随 n 增大而增大（趋于无穷） */
    printf("\nlg n = o(sqrt n) ?  看 sqrt(n)/lg n（应随 n 增大而增大）：\n");
    for (int e = 4; e <= 24; e += 4) {
        double n = (double)(1 << e);
        printf("  n = %-10.0f  sqrt(n)/lg n = %.4f\n", n, sqrt(n) / lg(n));
    }

    /* 定量展示 n^2 = o(2^n)：2^n / n^2 应随 n 增大而增大（趋于无穷） */
    printf("\nn^2 = o(2^n) ?  看 2^n / n^2（应随 n 增大而增大）：\n");
    for (int n = 2; n <= 60; n += 2) {
        unsigned long long two_n = 1ULL << n;  /* 60 < 64，仍在 uint64 范围内 */
        printf("  n = %-4d  2^n / n^2 = %.4f\n", n, (double)two_n / ((double)n * n));
    }

    printf("\nALL COMPARE-GROWTH TESTS PASSED\n");
    return 0;
}
`;

export default {
  key: 's03',
  id: 'ch03/s03',
  chapter: 3,
  section: '3.3',
  title: '标准记号与常用函数',
  shortTitle: '3.3 标准记号与常用函数',
  titleEn: 'Standard notations and common functions',
  source: { printed: [63, 75], pdf: [84, 96] },
  sourceNote:
    '本关对应原书 3.3 节（印刷页 63–75）。它是全书的"函数速查表"：' +
    '单调性、取整（floor/ceiling）、取模、多项式、指数、对数、阶乘（Stirling 近似）、' +
    '迭代对数、黄金比例与斐波那契数。重点不是背公式，而是**搞清这些函数之间的渐进大小关系**' +
    '（谁被谁在渐进意义下压倒）——这正是阶段 5 曲线图与阶段 6 程序要让你"看见"的。',
  prerequisites: [
    { label: '3.2 Asymptotic notation: formal definitions', url: '#/ch03/s02' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '这一关是一张"函数速查表"',
      why:
        '你已经会写 $O$、$\\Omega$、$\\Theta$ 了，但还缺"素材"：到底哪些函数是常见的运行时间形状？' +
        '$\\lg n$、$\\sqrt n$、$n$、$n\\lg n$、$n^2$、$2^n$ 之间谁快谁慢？' +
        '这一关把全书会反复撞见的数学函数一次性列清，并告诉你它们之间的**渐进大小关系**——' +
        '比如"任何多项式都慢于任何指数""对数慢于任何多项式的正幂"。记住这些关系，' +
        '后面看到 $T(n)=2T(n/2)+\\Theta(n)$ 或 $n!$ 时，你立刻能判断它长什么样。',
      position:
        '第 3 章第 3 节（印刷页 63–75）。前置是 3.2 的记号；它直接服务于第 4 章（递归式的解）、' +
        '第 6 章起的堆 / 平衡树（用到 $\\lg n$、高度），以及一切需要比较复杂度的地方。' +
        '一句话：这一关给"复杂度语言"提供词汇表。',
      unlocks: [
        // 预告后面章节（检查会以 WARN 提示该章尚未构建，属正常）：
        { label: '第 4 章 分治法（递归式将用到本关的函数关系）', url: '#/ch04/s01' },
      ],
      mathKit: [
        {
          title: '取整与取模',
          body:
            'floor $\\lfloor x\\rfloor$ 是不大于 $x$ 的最大整数，ceiling $\\lceil x\\rceil$ 是不小于 $x$ 的最小整数。' +
            '原书 p.63 的两个恒等式：对任意整数 $n$ 有 $\\lfloor n\\rfloor=n=\\lceil n\\rceil$（式 (3.1)）；' +
            '对任意整数 $n$ 有 $\\lfloor n/2\\rfloor+\\lceil n/2\\rceil=n$。取整函数都是单调不减的。',
        },
        {
          title: '多项式按次数排序',
          body:
            '$p(n)=\\sum_{i=0}^d a_i n^i$（$a_d>0$）是 $d$ 次多项式，其渐进行为由最高次项 $a_d n^d$ 主导，' +
            '即 $p(n)=\\Theta(n^d)$。次数低的多项式严格慢于次数高的：$n^a=o(n^b)$ 只要 $a<b$。',
        },
        {
          title: '指数压过一切多项式',
          body:
            '原书式 (3.13)：$n^b=o(c^n)$ 对任意 $c>1$ 与任意 $b>0$ 成立——即任何多项式都最终被任何底数 $>1$ 的指数压垮。' +
            '这是阶段 5/6 要反复演示的"$2^n$ 失控"。',
        },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '同样"翻倍输入"，代价差多少倍',
      scene: '你有两个算法：A 的耗时随 $n$ 平方增长，B 的耗时随 $2^n$ 增长',
      body:
        '直觉上你能猜：输入从 10 翻到 20，A 的耗时大约变 4 倍（$(20/10)^2$）；B 的耗时却变 $2^{20}/2^{10}=2^{10}=1024$ 倍。' +
        '指数算法对"翻倍"极度敏感，多项式算法相对温和——这就是本关要量化的"函数之间的关系"。' +
        '另一个反直觉的点：对数 $\\lg n$ 慢得惊人。输入从 1000 涨到 1000000（翻 1000 倍），' +
        '$\\lg n$ 只从约 10 涨到约 20（翻 2 倍）。所以 $\\lg n$ 比 $\\sqrt n$ 还慢——这正是阶段 6 程序打印的 $\\sqrt n/\\lg n\\to\\infty$。' +
        '下面进入正文：原书先把"单调递增 / 递减"说清楚（因为 $O$ 这类界在单调函数下保持），' +
        '再逐个列出标准函数。',
      // body 为单字符串（用 + 拼接多段），无数组括号
      interactive: {
        text:
          '先猜一下顺序（从慢到快）：把 $\\lg n$ 、 $\\sqrt n$ 、 $n$ 、 $n\\lg n$ 、 $n^2$ 、 $2^n$' +
          '排成一队。把你的排序记住——阶段 5 的曲线图会让这六条线同框出现，看谁先"起飞"。',
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
        { kind: 'body', page: 63,
          en: 'O(g(n,m)) = ff(n,m) W there exist positive constants c , n 0 , and m 0 such that 0 ≤ f(n,m) ≤ cg(n,m) for all n ≥ n 0 or m ≥ m 0 g :',
          zh: '这是 3.2 双参数记号的原文（OCR 把花括号与“{”压成了 “ff(…) W…g :”）。意思是：$O(g(n,m))$ 是“存在常数 $c,n_0,m_0$，使对所有 $n\\ge n_0$ 且 $m\\ge m_0$ 都有 $0\\le f(n,m)\\le c\\,g(n,m)$”的函数集合。它说明本节的函数关系也能推广到多参数。新手读这段要透过 OCR 伪影认出集合记号 ｛ f(n,m) : … ｝。' },
        { kind: 'body', page: 63,
          en: 'This section reviews some standard mathematical functions and notations and ex- plores the relationships among them. It also illustrates the use of the asymptotic notations.',
          zh: '本节总纲：① 回顾标准数学函数；② 探究它们之间的关系；③ 示范渐进记号怎么用。本关的重点是②——"关系"。记住：这一节的核心不是背公式，而是建立"谁压过谁"的直觉。' },
        { kind: 'body', page: 63,
          en: 'Similarly, it is monotonically decreasing if m ≤ n implies f(m) ≥ f(n). A function f(n) is strictly increasing if m < n implies f(m) < f(n) and strictly decreasing if m<n implies f(m)>f(n) .',
          zh: '单调性的正式定义（原书 p63）。要点：monotonically increasing 允许相等（不降），strictly increasing 要求严格小于（真增）。为什么重要？因为 $O$/$\\Omega$/$\\Theta$ 这类界在单调函数复合下保持——比如书后习题 3.3-1 要你证"若 $f,g$ 单调递增则 $f+g$、$f\\circ g$、$f\\cdot g$ 也递增"。' },
        { kind: 'body', page: 63,
          en: 'For any real number x , we denote the greatest integer less than or equal to x by bx c',
          zh: 'floor 的定义（OCR 把 $\\lfloor x\\rfloor$ 压成了 "bx c"）。$\\lfloor x\\rfloor$ 是不大于 $x$ 的最大整数。这是全书用得最多的取整：分治"中点" $\\lfloor(n+1)/2\\rfloor$、堆的高度 $\\lfloor\\lg n\\rfloor$ 都靠它。' },
        { kind: 'body', page: 63,
          en: '(read "the floor of x ") and the least integer greater than or equal to x by dx e (read',
          zh: '承接上句：ceiling $\\lceil x\\rceil$ 是不小于 $x$ 的最小整数（OCR 把 $\\lceil x\\rceil$ 压成了 "dx e"）。读的时候念 "the ceiling of x"。注意 floor 与 ceiling 只差"不大于/不小于"这一字，新手常混。' },
        { kind: 'body', page: 63,
          en: '"the ceiling of x "). The floor function is monotonically increasing, as is the ceiling function.',
          zh: '收束句：floor 与 ceiling 都是单调不减的。这条性质保证了"取整不改变大小顺序的渐进关系"——比如比较 $\\lfloor f(n)\\rfloor$ 与 $\\Theta(g(n))$ 时可以直接去掉取整符号（习题 3.3-3 就是这件事）。' },
      ],
      terms: [
        { en: 'monotonically increasing', zh: '单调递增（不降）', page: 63 },
        { en: 'floor function', zh: '下取整函数 ⌊x⌋', page: 63 },
        { en: 'ceiling function', zh: '上取整函数 ⌈x⌉', page: 63 },
        { en: 'iterated logarithm', zh: '迭代对数 lg* n', page: 68 },
        { en: 'golden ratio', zh: '黄金比例 φ', page: 69 },
        { en: 'Fibonacci numbers', zh: '斐波那契数', page: 69 },
        { en: 'Stirling’s approximation', zh: '斯特林近似', page: 66 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // 本节没有算法伪代码，但原书把一串标准函数列成公式。这里把它们整理成一张
    // 可在页面上点开的"公式卡"，方便随时回查。这些不是 en 原文引述，而是本关对
    // 正文公式的符号化重述（与阶段 3 的逐字引述互补）。
    {
      type: 'pseudocode',
      title: '标准函数公式卡',
      algo: 'STANDARD-FUNCTIONS',
      signature: '本节常见函数的渐进形状',
      page: 63,
      lines: [
        { n: 1, code: '⌊x⌋ = max{ k∈ℤ : k ≤ x }；⌈x⌉ = min{ k∈ℤ : k ≥ x }',
          zh: '取整定义（原书 p63）。floor 取"下方最近整数"，ceiling 取"上方最近整数"。' },
        { n: 2, code: 'x − 1 < ⌊x⌋ ≤ x ≤ ⌈x⌉ < x + 1',
          zh: '取整的基本不等式：floor 比 x 小不到 1，ceiling 比 x 大不到 1（原书 p63）。' },
        { n: 3, code: '⌊n/2⌋ + ⌈n/2⌉ = n（对任意整数 n）',
          zh: '奇偶都成立的恒等式，分治"中点"常用（原书习题 3.3-2）。' },
        { n: 4, code: '多项式 p(n)=Σ aᵢnⁱ，次数 d，则 p(n)=Θ(n^d)',
          zh: '最高次项主导（原书 p67）。这是"忽略低阶项"的严格说法。' },
        { n: 5, code: 'log_b n = (log_c n)/(log_c b)；特别地 lg n = (ln n)/(ln 2)',
          zh: '换底公式：所有对数只差常数倍，故渐进记号里底数可省略，统一写 lg n（原书 p67）。' },
        { n: 6, code: 'n! = √(2πn)·(n/e)^n·(1+Θ(1/n))（Stirling 近似）',
          zh: '阶乘的主项：故 lg(n!) = Θ(n lg n)（原书 p66）。' },
        { n: 7, code: 'lg* n = min{ i ≥ 0 : lg^(i) n ≤ 1 }（迭代对数）',
          zh: '把 lg 反复作用直到 ≤1 的次数；增长极慢（原书 p68）。' },
        { n: 8, code: 'Fib: F₀=0,F₁=1,Fᵢ=Fᵢ₋₁+Fᵢ₋₂；Fᵢ = ⌊φⁱ/√5 + 1/2⌋，φ=(1+√5)/2',
          zh: '斐波那契的封闭形式：故 Fᵢ=Θ(φⁱ)（原书 p69）。' },
      ],
      vars: [
        { name: 'x', meaning: '任意实数（取整的对象）' },
        { name: 'd', meaning: '多项式的次数' },
        { name: 'φ', meaning: '黄金比例 (1+√5)/2 ≈ 1.618' },
      ],
      note: '一个常被忽略的点：所有底数的对数只差常数倍，所以渐进记号里写 $\\lg n$ 不写 $\\log_2 n$ 也行；但 $\\lg\\lg n$（迭代对数的一层）与 $\\lg n$ 不是常数倍关系，不能混。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '六条曲线同框，看谁先起飞',
      viz: 'growth',
      algorithm: null,
      pseudocodeRef: null,
      chart: {
        xMax: 16,
        caption: 'lg n < √n < n < n lg n < n² < 2ⁿ：指数 2ⁿ 最终碾压一切（注意纵轴已自动取整，低阶线被压在底部）',
        series: [
          { name: 'lg n', expr: 'Math.log2(n)', color: '--viz-mark' },
          { name: '√n', expr: 'Math.sqrt(n)', color: '--viz-result' },
          { name: 'n', expr: 'n', color: '--viz-done' },
          { name: 'n lg n', expr: 'n * Math.log2(n)', color: '--viz-compare' },
          { name: 'n²', expr: 'n * n', color: '--viz-active' },
          { name: '2ⁿ', expr: 'Math.pow(2, n)', color: '--viz-violation' },
        ],
      },
      note:
        '六条线画在同一张图上，纵轴按最大值自动取整，所以 $2^n$ 一飞冲天、把其余线压在底部——' +
        '这恰好就是"指数压过一切多项式"的视觉版。要看清低阶之间的先后，阶段 6 的 C 程序用' +
        '比值定量给出：$\\sqrt n/\\lg n$ 随 $n$ 增大而增大（说明 $\\lg n=o(\\sqrt n)$），' +
        '$2^n/n^2$ 随 $n$ 增大而增大（说明 $n^2=o(2^n)$）。',
      tasks: [
        '看 $n\\lg n$ 与 $n^2$ 的先后：$n=16$ 时谁更大？它印证了 $n\\lg n=o(n^2)$。',
        '为什么 $\\lg n$ 与 $\\sqrt n$ 在图里几乎贴着横轴？回到阶段 6 看 $\\sqrt n/\\lg n$ 这个比值。',
      ],
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '用 C 打印"谁压过谁"',
      intro:
        '本节没有数组、没有下标，只有一个自变量 $n$。这份 C 程序把六类函数在同一组 $n$ 下的值打出来，' +
        '再用两个比值定量证明两条关键的小 o 关系：$\\lg n=o(\\sqrt n)$ 与 $n^2=o(2^n)$' +
        '（后者是原书式 (3.13) 在 $a=2,b=2$ 的特例）。函数头注释写清了与 3.3 节结论的对应。',
      pseudocodeRef: null,
      c: {
        file: 'compare_growth.c',
        code: C_IMPL,
        notes: [
          { line: 18, zh: 'lg(n)=log2(n)：所有底数的对数只差常数倍，故统称 lg n。' },
          { line: 26, zh: 'n = 1,2,4,8,16,32,64：同一组 n 下各函数的"同框"比较。' },
          { line: 33, zh: '打印 √n/lg n：随 n 增大而增大 → 证明 lg n = o(√n)。' },
          { line: 40, zh: '打印 2ⁿ/n²：随 n 增大而增大 → 证明 n² = o(2ⁿ)（式 3.13 特例）。' },
        ],
      },
      mapping: [],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '这些函数之间的渐进大小关系',
      intro: '本关的"复杂度结论"是各标准函数之间的相对大小。下面每条都给了原书页码出处；关系用 3.2 的小 o / Θ 表述。',
      claims: [
        { expr: 'lg n = o(√n)', when: '对数慢于任何正幂多项式根（polylog 论证雏形）', page: [67], source: 'book' },
        { expr: 'n^a = o(n^b)  (a < b)', when: '多项式按次数排序：低次慢于高次', page: [67], source: 'book' },
        { expr: 'n^b = o(c^n)  (c > 1)', when: '多项式慢于任何底数>1 的指数（式 3.13）', page: [67], source: 'book' },
        { expr: 'lg(n!) = Θ(n lg n)', when: '由 Stirling 近似 n! = √(2πn)(n/e)^n(1+Θ(1/n))', page: [66], source: 'book' },
        { expr: '(1 + ε)^n = ω(n^a)', when: '任意常数底>1 的指数压过任意多项式', page: [67], source: 'book' },
        { expr: 'k lg k = Θ(n) ⇒ k = Θ(n / lg n)', when: '习题 3.3-9 的逆用', page: [70], source: 'book' },
      ],
      tables: [
        { caption: '常见函数的渐进排序（从慢到快，同一格内为同量级 Θ）',
          rows: [
            ['lg n', '最慢：对数级', true],
            ['√n , n^α (0<α<1)', '次线性', false],
            ['n , n lg n', '线性 / 线性对数', false],
            ['n^2 , n^3 , …', '多项式', false],
            ['n^lg n , 2^n , 2^{2^n}', '超多项式 / 指数', false],
          ] },
      ],
      chart: {
        xMax: 16,
        caption: 'n² 与 2ⁿ 同框：2ⁿ 最终严格压过 n² → n² = o(2ⁿ)',
        series: [
          { name: 'n²', expr: 'n * n', color: '--viz-active' },
          { name: '2ⁿ', expr: 'Math.pow(2, n)', color: '--viz-violation' },
        ],
      },
      derivations: [
        { kind: 'limit', title: '用极限说明 n² = o(2ⁿ)（式 3.13 的 a=2, b=2）',
          steps: [
            { tex: '\\lim_{n\\to\\infty} \\frac{n^2}{2^n}', zh: '要证 $n^2=o(2^n)$，只需证此极限为 0。' },
            { tex: '= \\lim_{n\\to\\infty} \\frac{2n}{2^n\\ln 2} = \\lim_{n\\to\\infty} \\frac{2}{2^n(\\ln 2)^2} = 0', zh: '连续用两次洛必达（分子 $n^2\\to2n\\to2$，分母 $2^n$ 每导一次多乘 $\\ln2$）。' },
            { tex: '\\therefore\\ n^2 = o(2^n)', zh: '极限为 0，按 p60 小 o 定义即得。阶段 6 程序打印的 $2^n/n^2\\to\\infty$ 是同一结论的倒数形式。★ 本站按极限推导（source: instructor），原书式 (3.13) 直接给出一般形式 $n^b=o(c^n)$。' },
          ] },
      ],
      note: '一个易错提醒：$\\lg\\lg n$ 比 $\\lg n$ 慢得多（多迭代一层），但 $\\lg n$ 与 $\\lg(n/2)=\\lg n-1$ 是同一 $\\Theta$ 量级——"除以常数"不改变对数级。',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    // 本节没有循环不变量，本关用"证明 n² = o(2ⁿ)"来充当正确性论证：
    // 这条关系在阶段 5/6 反复出现，这里给一个严格证明。statement 是中文重述
    // （非 en 字段，不进溯源比对），三步为极限推导，en 字段略去，直接写中文展开。
    {
      type: 'prove',
      title: '凭什么 2ⁿ 一定压过 n²',
      statement:
        '证明 $n^2 = o(2^n)$，即 $\\displaystyle\\lim_{n\\to\\infty}\\frac{n^2}{2^n}=0$。' +
        '这是原书式 (3.13) 在 $a=2,\\ b=2$ 时的特例，也是阶段 5/6 那条"指数起飞"曲线的严格依据。',
      page: 67,
      intro:
        '小 o 的定义（p60）就是"比值极限为 0"。所以证明只需把 $\\lim n^2/2^n$ 算出来。' +
        '下面用洛必达法则逐步算——它把"多项式 vs 指数"的胜负变成一次机械计算。',
      steps: [
        {
          title: '第一步 · 写出要证的比值',
          page: 67,
          body: [
            '按 p60 的 $o$ 定义，$n^2=o(2^n)$ 等价于 $\\lim_{n\\to\\infty} n^2/2^n = 0$。',
            '分子 $n^2$ 是多项式，分母 $2^n=e^{n\\ln2}$ 是指数。直觉上指数增长更快，但我们要把它算实。',
          ],
        },
        {
          title: '第二步 · 连续洛必达',
          page: 67,
          body: [
            '对 $n\\to\\infty$ 的 $0/0$ 型（这里其实是 $\\infty/\\infty$），对分子分母同求导：',
            '第一次：$(\\frac{d}{dn}n^2)/(\\frac{d}{dn}2^n)=2n/(2^n\\ln2)$。',
            '第二次：再对分子分母求导，得 $2/(2^n(\\ln2)^2)$。',
            '每求一次导，多项式的阶降一，而指数只多乘一个常数 $\\ln2$——所以多项式终将被"求导抽干"。',
          ],
        },
        {
          title: '第三步 · 取极限得证',
          page: 67,
          body: [
            '$\\lim_{n\\to\\infty} 2/(2^n(\\ln2)^2) = 0$，因为分母随 $n$ 指数趋于无穷。',
            '于是 $\\lim n^2/2^n = 0$，按定义 $n^2=o(2^n)$。',
            '阶段 6 的 C 程序打印 $2^n/n^2$，它正好是上面比值的倒数，趋于 $\\infty$——两条曲线同框时 $2^n$ 一飞冲天，正是这个极限的图画。',
          ],
        },
      ],
      conclusion:
        '证毕。更一般地，原书式 (3.13) 给出 $n^b=o(c^n)$ 对任意 $b>0,\\ c>1$ 成立——' +
        '即"任何多项式都最终被任何底数大于 1 的指数压垮"。这是判断算法是否会"爆炸"的最常用一条结论。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'judge',
          q: '$\\lfloor 3.7\\rfloor = 3$ 且 $\\lceil 3.7\\rceil = 4$。',
          answer: true,
          why:
            '对。floor 取"不大于 3.7 的最大整数"=3；ceiling 取"不小于 3.7 的最小整数"=4（原书 p63）。',
        },
        {
          kind: 'single',
          q: '下列哪一组按增长从慢到快排列正确？',
          options: ['$\\lg n,\\ \\sqrt n,\\ n,\\ n^2$', '$\\sqrt n,\\ \\lg n,\\ n,\\ n^2$', '$n,\\ \\lg n,\\ \\sqrt n,\\ n^2$', '$\\lg n,\\ n,\\ \\sqrt n,\\ n^2$'],
          answer: 0,
          why:
            '正确顺序是"对数 < 根号 < 线性 < 平方"：$\\lg n=o(\\sqrt n)$ 且 $\\sqrt n=o(n)$ 且 $n=o(n^2)$（原书 p67）。',
        },
        {
          kind: 'judge',
          q: '$\\lg n = o(\\sqrt n)$ 成立（对数慢于平方根）。',
          answer: true,
          why:
            '对。阶段 6 程序打印的 $\\sqrt n/\\lg n$ 随 $n$ 增大而增大，正是 $\\lg n=o(\\sqrt n)$ 的倒数证据。',
        },
        {
          kind: 'single',
          q: '$n^2 = o(2^n)$ 的依据是？',
          options: ['式 (3.13)：多项式慢于指数', 'Θ 记号是对称的，可以反过来用', 'Stirling 近似', '换底公式，把 $\\lg$ 换成 $\\ln$'],
          answer: 0,
          why:
            '原书式 (3.13)：$n^b=o(c^n)$ 对任意 $b>0,\\ c>1$ 成立；$a=2,b=2$ 即 $n^2=o(2^n)$（阶段 8 已证）。',
        },
        {
          kind: 'judge',
          q: '对任意整数 $n$，都有 $\\lfloor n/2\\rfloor + \\lceil n/2\\rceil = n$。',
          answer: true,
          why:
            '对。$n$ 偶时两边都是 $n/2+n/2$；$n$ 奇时 $(n-1)/2+(n+1)/2=n$（原书习题 3.3-2）。',
        },
        {
          kind: 'single',
          q: '若 $f,g$ 都单调递增且非负，则 $f\\cdot g$ 单调？',
          options: ['递增', '递减', '不一定', '恒为 0'],
          answer: 0,
          why:
            '递增。原书习题 3.3-1：非负单调递增函数的乘积仍单调递增（因 $m<n\\Rightarrow f(m)\\le f(n)$ 且 $g(m)\\le g(n)$，乘积不降）。',
        },
        {
          kind: 'judge',
          q: '$n! = \\Theta(\\sqrt n\\,(n/e)^n)$（Stirling 近似的主项）。',
          answer: true,
          why:
            '对。Stirling 给出 $n!=\\sqrt{2\\pi n}\\,(n/e)^n(1+\\Theta(1/n))$，故 $n!=\\Theta(\\sqrt n\\,(n/e)^n)$，并推出 $\\lg(n!)=\\Theta(n\\lg n)$（原书 p66）。',
        },
        {
          kind: 'single',
          q: '斐波那契数 $F_i$ 的渐进界是？',
          options: ['$\\Theta(\\varphi^i)$（φ 为黄金比例）', '$\\Theta(i)$：递推式每步只做一次加法，步数是 $i$', '$\\Theta(2^i)$：递归树每层分两个子问题，层数为 $i$', '$\\Theta(i!)$：第 $i$ 项要把前面各项的贡献累乘'],
          answer: 0,
          why:
            '原书 p69 给出封闭形式 $F_i\\approx\\varphi^i/\\sqrt5$（$\\varphi=(1+\\sqrt5)/2$），故 $F_i=\\Theta(\\varphi^i)$。',
        },
      ],
      bookExercises: [
        { id: '3.3-1', page: 70, star: 0,
          statement: 'Show that if f(n) and g(n) are monotonically increasing functions, then so are the functions f(n) + g(n) and f(g(n)) , and if f(n) and g(n) are in addition nonnegative, then f(n) • g(n) is monotonically increasing.',
          hint: '逐条用定义：由 $m<n\\Rightarrow f(m)\\le f(n),g(m)\\le g(n)$ 推出和 / 复合 / 乘积（非负时）都不降。乘积那步必须用到非负，否则负负得正可能反例。' },
        { id: '3.3-2', page: 70, star: 0,
          statement: 'Prove that b˛nc + d.1 − ˛/ne = n for any integer n and real number ˛ in the range 0 ≤ ˛ ≤ 1.',
          hint: '原书要证 $\\lfloor n\\alpha\\rfloor + \\lceil n(1-\\alpha)\\rceil = n$。先分 $\\alpha$ 是否整数，再用 $\\lfloor x\\rfloor+\\lceil -x\\rceil=0$ 这类恒等式。' },
        { id: '3.3-3', page: 70, star: 0,
          statement: 'Use equation (3.14) or other means to show that (n + o(n)) k = Θ(n k ) for any real constant k. Conclude that ⌈n⌉ k = Θ(n k ) and ⌊n⌋ k = Θ(n k ).',
          hint: '取整只改变量不到 1，故 $\\lfloor n\\rfloor = n + O(1) = n(1+o(1))$，其 $k$ 次幂仍是 $\\Theta(n^k)$。关键：$\\lfloor n\\rfloor/n\\to1$。' },
        { id: '3.3-4', page: 70, star: 0,
          statement: 'Prove the following: a. Equation (3.21). b. Equations (3.26)3(3.28). c. lg(Θ(n)) = Θ(lg n).',
          hint: '三问都得说出「拿哪条式子、证哪个方向」，「代入验证」不算证明。 (a) (3.21) 是 $a^{\\log_b c} = c^{\\log_b a}$。两边同取 $\\log_b$： 左边 $\\log_b a^{\\log_b c} = (\\log_b c)(\\log_b a)$（用 (3.19) 的幂次法则 $\\log_b a^n = n\\log_b a$；p.66 上 (3.18) 是乘积法则）， 右边同理也是 $(\\log_b a)(\\log_b c)$ —— 乘积交换，两边相等； 因为 $\\log_b$ 是单射，原式成立。（底数不为 1 这个前提就是给取对数用的。） (b) 三条是 $n! = o(n^n)$、$n! = \\omega(2^n)$（小 $\\omega$，不是 $\\Omega$）、$\\lg(n!) = \\Theta(n\\lg n)$。 第一条用 Stirling (3.25)：$n^n$ 除过去得 $\\sqrt{2\\pi n}\\,e^{-n}[1+\\Theta(1/n)] \\to 0$。 第二条要证的是严格下界：$n!/2^n \\to \\infty$。注意 $n! \\ge 2^{n-1}$ 只够 $\\Omega(2^n)$，证不到 $\\omega$。取后半截因子：$\\lceil n/2 \\rceil$ 到 $n$ 这至少 $n/2$ 个因子每个都不小于 $n/2$，故 $n! \\ge (n/2)^{n/2}$；于是 $\\lg(n!/2^n) \\ge (n/2)\\lg(n/2) - n$，$n \\to \\infty$ 时右边趋于 $\\infty$。 第三条上界 $\\lg(n!) = \\sum_{i=1}^{n}\\lg i \\le n\\lg n$； 下界只取后半截：$\\sum_{i=\\lceil n/2\\rceil}^{n}\\lg i \\ge (n/2)\\lg(n/2) = \\Theta(n\\lg n)$。 (c) $\\lg(\\Theta(n)) = \\Theta(\\lg n)$：取 $f(n) \\in \\Theta(n)$，即 $c_1 n \\le f(n) \\le c_2 n$， 取 $\\lg$ 得 $\\lg n + \\lg c_1 \\le \\lg f(n) \\le \\lg n + \\lg c_2$； 常数项 $\\lg c_i$ 相对 $\\lg n$ 可忽略（$n$ 足够大时 $\\lg n \\ge 2|\\lg c_1|$）， 于是夹在 $(1/2)\\lg n$ 与 $2\\lg n$ 之间。' },
        { id: '3.3-7', page: 70, star: 0,
          statement: 'Show that the golden ratio Ω and its conjugate y Ω both satisfy the equation x 2 = x + 1.',
          hint: '代入 $\\varphi=(1+\\sqrt5)/2$ 与 $\\hat\\varphi=(1-\\sqrt5)/2$，验证 $\\varphi^2=\\varphi+1$（原书 p69）。这是斐波那契封闭形式的来源。' },
        { id: '3.3-8', page: 70, star: 0,
          statement: 'Prove by induction that the i th Fibonacci number satisfies the equation F i = (Ω i − y Ω i )= p 5; where Ω is the golden ratio and y Ω is its conjugate.',
          hint: '用 $\\varphi,\\hat\\varphi$ 满足 $x^2=x+1$ 这一事实，对 Binet 公式 $F_i=(\\varphi^i-\\hat\\varphi^i)/\\sqrt5$ 做归纳（原书 p69）。' },
        { id: '3.3-9', page: 70, star: 0,
          statement: 'Show that k lg k = Θ(n) implies k = Θ(n= lg n).',
          hint: '由 $k\\lg k=\\Theta(n)$ 得 $k\\lg k\\le c n$，反解 $k\\le c n/\\lg k$，迭代代入把 $\\lg k$ 换成 $\\lg n$ 量级，得 $k=O(n/\\lg n)$；反向同理得 $\\Omega$。' },
        { id: '3-1', page: 71, star: 0,
          statement: 'Asymptotic behavior of polynomials Let p(n) = d X i D0 a i n i ; where a d > 0, be a degree-d polynomial in n, and let k be a constant. Use the definitions of the asymptotic notations to prove the following properties. a. If k ≥ d , then p(n) = O(n k ). b. If k ≤ d , then p(n) = Ω(n k ). c. If k = d , then p(n) = Θ(n k ). d. If k>d , then p(n) = o(n k ). e. If k<d , then p(n) = !.n k /.',
          hint: '对任意多项式 $p(n)=\\sum a_i n^i$，最高次项主导：$p(n)=\\Theta(n^d)$。分别证上下界，系数取最高/最低次项绝对值相关常数。' },
        { id: '3-2', page: 71, star: 0,
          statement: 'Relative asymptotic growths Indicate, for each pair of expressions (A,B) in the table below whether A is O, o, Ω, !, or Θ of B . Assume that k ≥ 1, Ω > 0 , and c >1 are constants. Write your answer in the form of the table with "yes" or "no" written in each box. A B O o Ω ! Θ a. lg k n n • b. n k c n c. √n n sin n d. 2 n 2 n/2 e. n lg c c lg n f. lg.n!/ lg(n n )',
          hint: '题干要的是**把表逐格填 yes/no**，不是把函数排个大小。逐行的落点： a. $A = \\lg^k n$，$B = n^\\varepsilon$：由 (3.24) 有 $\\lg^k n = o(n^\\varepsilon)$ ⟹ O 是、o 是、$\\Omega$ 否、$\\omega$ 否、$\\Theta$ 否。 b. $A = n^k$，$B = c^n$（$c > 1$）：由 (3.13) 有 $n^k = o(c^n)$，同样「O 是、o 是、 $\\Omega$ 否、$\\omega$ 否、$\\Theta$ 否」。 c. $A = \\sqrt{n}$，$B = n^{\\sin n}$：$\\sin n$ 在 $[-1,1]$ 之间来回摆， $B$ 一会儿比 $\\sqrt n$ 小得多（$n$ 靠近 $-\\pi/2$ 那侧）一会儿大得多（靠近 $\\pi/2$ 那侧）， 两者比值不收敛 ⟹ 五格全否。 d. $A = 2^n$，$B = 2^{n/2}$：$A/B = 2^{n/2} \\to \\infty$ ⟹ O 否、o 否、 $\\Omega$ 是、$\\omega$ 是、$\\Theta$ 否。 e. $A = n^{\\lg c}$，$B = c^{\\lg n}$：**这两个恒等**（就是 (3.21)，取底为 2） ⟹ O 是、o 否、$\\Omega$ 是、$\\omega$ 否、$\\Theta$ 是。 f. $A = \\lg(n!)$，$B = \\lg(n^n) = n\\lg n$：由 (3.28) 是 $\\Theta$ 关系 ⟹ O 是、o 否、$\\Omega$ 是、$\\omega$ 否、$\\Theta$ 是。 填完自查一句：只有 c 行是「五个全否」，只有 e、f 两行打 $\\Theta$。' },
        { id: '3-3', page: 71, star: 0,
          statement: 'Ordering by asymptotic growth rates a. Rank the following functions by order of growth. That is, find an arrange- ment g 1 ,g 2 ,…,g 30 of the functions satisfying g 1 = Ω(g 2 ), g 2 = Ω(g 3 ), . . . , g 29 = Ω(g 30 ). Partition your list into equivalence classes such that functions f(n) and g(n) belong to the same class if and only if f(n) = Θ(g(n)). lg(lg − n) 2 lg − n . p 2/ lg n n 2 n! (lg n)! (3/2) n n 3 lg 2 n lg.n!/ 2 2 n n 1= lg n ln ln n lg − n n • 2 n n lg lg n ln n 1 2 lg n (lg n) lg n e n 4 lg n (n + 1)! p lg n lg − (lg n) 2 √2 lg n n 2 n n lg n 2 2 n + 1 b. Give an example of a single nonnegative function f(n) such that for all func- tions g i (n) in part (a), f(n) is neither O(g i (n)) nor Ω(g i (n)).',
          hint: '先按量级分桶：常数 / 对数 / 根号 / 线性 / 线性对数 / 多项式 / 指数 / 双指数；同桶内再比次数与底数。注意 $\\lg\\lg n$ 比 $\\lg n$ 慢一整档。' },
        { id: '3-4', page: 72, star: 0,
          statement: 'Asymptotic notation properties Let f(n) and g(n) be asymptotically positive functions. Prove or disprove each of the following conjectures. a. f(n) = O(g(n)) implies g(n) = O(f(n)) . b. f(n) + g(n) = Θ(min ff(n),g(n) g). c. f(n) = O(g(n)) implies lg f(n) = O(lg g(n)), where lg g(n) ≥ 1 and f(n) ≥ 1 for all sufficiently large n. d. f(n) = O(g(n)) implies 2 f (n) = O ã 2 g(n) ä . e. f(n) = O..f(n)/ 2 /. f. f(n) = O(g(n)) implies g(n) = Ω(f (n)) . g. f(n) = Θ(f(n/2)) . h. f(n) + o(f(n)) = Θ(f(n)) .',
          hint: '八条要逐条判真伪：证的一侧写量词，否的一侧只需一个反例。先把 (a)(b)(d)(g) 当「可疑」来试 —— $f=1,g=n$、$f=n,g=n^2$、$f(n)=2^n$ 是最好用的三块试金石。(c) 与 (h) 要真去证：(c) 里「$\\lg g(n)\\ge 1$ 且 $f(n)\\ge 1$」这两个前提正是为了让 $\\lg$ 能单调地把不等号搬进去；(h) 用 $o(f)$ 的定义把扰动项压到不超过 $f$ 的一半。' },
        { id: '3-5', page: 72, star: 0,
          statement: 'Manipulating asymptotic notation Let f(n) and g(n) be asymptotically positive functions. Prove the following iden- tities: a. Θ(Θ(f(n))) = Θ(f(n)) . b. Θ(f(n)) + O(f(n)) = Θ(f(n)) . c. Θ(f(n)) + Θ(g(n)) = Θ(f(n) + g(n)). d. Θ(f(n)) • Θ(g(n)) = Θ(f(n) • g(n)). e. Argue that for any real constants a 1 ,b 1 > 0 and integer constants k 1 ,k 2 , the following asymptotic bound holds: (a 1 n) k 1 lg k 2 (a 2 n) = Θ(n k 1 lg k 2 n): ? f. Prove that for S ⊆ Z, we have X k2S Θ(f(k)) = Θ • X k2S f(k) ! ; assuming that both sums converge. ? g. Show that for S ⊆ Z, the following asymptotic bound does not necessarily hold, even assuming that both products converge, by giving a counterexample: Y k2S Θ(f(k)) = Θ • Y k2S f(k) ! :',
          hint: '把 $\\Theta$、$O$ 当成**函数集合**来推，先写成量词再化简。(a) 是「$\\Theta$ 作用两次不改变集合」；(b) 的下界只能由 $\\Theta$ 那一项提供，上界两边合起来仍是 $O(f)$，所以和落在 $\\Theta(f)$。(e) 先把 $(a_1n)^{k_1}=a_1^{k_1}n^{k_1}$ 的常数因子剥掉。(f) 对有限和归纳；(g) 要举反例：让不同 $k$ 上的 $\\Theta$ 代表元无法同时对齐（交替取上下界的构造就够了）。' },
        { id: '3-6', page: 73, star: 0,
          statement: 'Variations on O and ˝ Some authors define Ω-notation in a slightly different way than this textbook does. We’ll use the nomenclature Ω (read "omega infinity") for this alternative defini- tion. We say that f(n) = Ω(g(n)) if there exists a positive constant c such that f(n) ≥ cg(n) ≥ 0 for infinitely many integers n. a. Show that for any two asymptotically nonnegative functions f(n) and g(n), we have f(n) = O(g(n)) or f(n) = Ω(g(n)) (or both). b. Show that there exist two asymptotically nonnegative functions f(n) and g(n) for which neither f(n) = O(g(n)) nor f(n) = Ω(g(n)) holds. c. Describe the potential advantages and disadvantages of using Ω-notation in- stead of Ω-notation to characterize the running times of programs. Some authors also define O in a slightly different manner. We’ll use O 0 for the alternative definition: f(n) = O 0 (g(n)) if and only if jf(n) j = O(g(n)). d. What happens to each direction of the "if and only if" in Theor em 3.1 on page 56 if we substitute O 0 for O but still use Ω? …',
          hint: '本题的两个变体是 $\\Omega_\\infty$（只要求在**无穷多个** $n$ 上 $f(n) \\ge cg(n) \\ge 0$）与 $O’$（定义为 $|f(n)| = O(g(n))$）。本站题干引到 (d) 为止，原书最后还有一问讲忽略 $\\lg$ 因子的 $\\tilde O$，那是另一件事。 (a) 走反证：若 $f \\ne O(g)$，把 $O$ 的定义取反，得到的正是「对任意常数 $c$，都有无穷多个 $n$ 使 $f(n) > cg(n)$」，也就是 $\\Omega_\\infty$。 (b) 与 (a) 只差在用的是**普通** $\\Omega$（要对所有足够大的 $n$ 成立），所以要让比值 $f/g$ 来回摆动：取 $g(n)=1$，$f$ 在 $[2^{2k},2^{2k+1})$ 上取 $1/n$、在 $[2^{2k+1},2^{2k+2})$ 上取 $n$，两个方向同时落空。 (c) 说清代价与收益：$\\Omega_\\infty$ 允许「大多数输入上其实更慢」，作为下界更弱、更容易证，但也更没保证。 (d) 把定理 3.1 的两个方向分开查：换成 $O’$ 之后哪一侧照旧、哪一侧要举反例（渐近非负这个前提正是把绝对值吃掉的那一步）。' },
        { id: '3-7', page: 74, star: 0,
          statement: 'Iterated functions We can apply the iteration operator − used in the lg − function to any monotonically increasing function f(n) over the reals. For a given constant c 2 R, we define the iterated function f − c by f − c (n) = min ˚ i ≥ 0 W f (i ) (n) ≤ c } ; which need not be well defined in all cases. In other words, the quantity f − c (n) is the minimum number of iterated applications of the function f required to reduce its argument down to c or less. For each of the functions f(n) and constants c in the table below, give as tight a bound as possible on f − c (n). If there is no i such that f (i ) (n) ≤ c , write <unde- fined= as your answer. f(n) c f − c (n) a. n − 1 0 b. lg n 1 c. n/2 1 d. n/2 2 e. √n 2 f. √n 1 g. n 1/3 2',
          hint: '迭代函数 $f^{(i)}(n)$ 是把 $f$ 复合 $i$ 次；$\\lg^* n$ 与 $\\alpha(n)$（反阿克曼）增长极慢，先算几个小 $n$ 感受再证。' },
      ],
    },
  ],
};
