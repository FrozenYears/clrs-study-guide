/* =============================================================================
 * 第 1 章 1.2 —— 第 s02 关：1.2 Algorithms as a technology
 *
 * 原文锚点：印刷页 12–16（pdf_index 33–37）
 *
 * 引述全部逐字取自语料并通过闸门溯源判据（含语料排版伪影：c 1 / n 2 的空格、
 * = oes 里被吃掉的首字母等，一律照抄，不要"顺手修正"）。
 * 本节原书没有伪代码框，pseudocode 段按闸门要求保留为空（规则 5）。
 * ========================================================================== */

export default {
  key: 's02',
  id: 'ch01/s02',
  chapter: 1,
  section: '1.2',
  title: '算法是一种技术',
  shortTitle: '1.2 算法是一种技术',
  titleEn: 'Algorithms as a technology',
  source: { printed: [12, 16], pdf: [33, 37] },
  sourceNote: '本关对应原书 1.2 节（印刷页 12–16）。',
  prerequisites: [
    { label: '1.1 算法是什么（正确性与实例这两个词在这里要被用上）', url: '#/ch01/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '换一台快 1000 倍的机器，还是换一个更好的算法？',
      why: '1.1 定义了「什么叫对」，这一关回答「为什么要为快慢操心」。它给的答案不是口号，而是一笔可算的账：一台快 1000 倍的机器配差算法，输给一台慢机器配好算法，而且是 17 倍（规模再大 10 倍就变成 150 倍）。把这件事想清楚，你才会明白为什么本书花 1300 页讲算法而不是讲调参 —— **算法本身就是一种技术，和硬件、语言、框架平级**。',
      position: '前置是 1.1（要用到「实例」「正确」这两个词）。这一关往后直接顶到两处：2.1 与 2.3 会真的给出 $c_1n^2$ 与 $c_2n\\lg n$ 这两个式子并证明它们，3.1 则把「$\\lg n$ 最终小于 $n$」这件事形式化成渐进记号。本章 Problem 1-1 那张「给定时间能解多大的问题」的表，也归在本关。',
      unlocks: [
        { label: '2.1 插入排序：n² 那一边的来路', url: '#/ch02/s01' },
        { label: '2.3 归并排序：n lg n 那一边的来路', url: '#/ch02/s03' },
      ],
      mathKit: [
        {
          title: '$\\lg n$ 与 $n$ 的差距有多大：代入几个数感受一下',
          body: '$\\lg n$ 是「$n$ 能被我折半几次」。$\\lg 1000 \\approx 10$、$\\lg 10^6 \\approx 20$、$\\lg 10^9 \\approx 30$ —— 输入翻一百万倍，$\\lg n$ 只从 20 涨到 40。所以 $n\\lg n$ 与 $n^2$ 的差距会随 $n$ 越拉越开，这正是本关交叉点论证的全部直觉来源。',
        },
        {
          title: '常数因子 $c_1$、$c_2$ 是什么',
          body: '同一台机器上，「跑一遍要执行多少条指令」里的「多少」就是常数因子。原书 p.12 特意假设插入排序的 $c_1$ 比归并排序的 $c_2$ 小（它更简单），也就是说**对小的那一方有利的前提已经给足了**，结论仍然被 $n$ 的函数形式翻盘。本关阶段 6 的 C 程序把交叉点算成具体数字。',
        },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '一台好机器救不了一个坏办法',
      scene: '你要处理 1000 万条记录。同事说：申请一台快 1000 倍的服务器就行；你说：不，我换个算法。',
      body: [
        '原书 p.13 把这场争论摆成一道算术题。快机器 A 跑插入排序（$2n^2$ 条指令，每秒能执行 $10^{10}$ 条），慢机器 B 跑归并排序（$50n\\lg n$ 条指令，每秒只有 $10^7$ 条 —— 硬件差 1000 倍），而且 A 的代码是「世上最熟练的程序员用机器语言手写」，B 的代码是「普通程序员用高级语言加一个不高效的编译器」。条件全部偏向 A。',
        '结果：处理 1000 万个数，A 要 20000 秒（5.56 小时），B 要 1163 秒（不到 20 分钟）。B 赢 17 倍。',
        '更关键的是**规模一变大，差距自己会变大**：换成 1 亿个数，A 要 23 天，B 不到 4 小时 —— 差距从 17 倍涨到 150 倍。这不是巧合，是因为 $n^2$ 与 $n\\lg n$ 的比是 $n/\\lg n$，它随 $n$ 单调上涨、无上界。',
        '所以「算法是一种技术」这句话的实际含义是：**在买机器这件事之外，还有一条提升性能的路线，而且这条路线的收益不被硬件天花板卡住**。你换一次算法，收益是永久且随规模放大的。',
      ],
      interactive: {
        text: '先自己估一下：如果 A 的机器再快 100 倍（每秒 $10^{12}$ 条指令），它跑插入排序处理 1 亿个数还需要多久？能追平 B 吗？—— 估完再看阶段 6 的 C 程序 part 2，答案可能和你直觉相反（快 100 倍仍要 5.5 小时，而 B 不到 4 小时）。',
      },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自语料，每条都已通过溯源判据。请勿改写 en。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        {
          kind: 'body', page: 12,
          en: 'If computers were infinitely fast and computer memory were free, would you have any reason to study algorithms? The answer is yes, if for no other reason than that you would still like to be certain that your solution method terminates and does so with the correct answer.',
          zh: '★ 开篇是一个反设问：假设机器无限快、内存免费，还要不要学算法？原书答「要」，理由不是效率而是 1.1 那两条 —— **会停机、答案对**。这句先把本关的定位钉住：效率是学算法的第二个理由，第一个理由在上一关。',
        },
        {
          kind: 'body', page: 12,
          en: 'Of course, computers may be fast, but they are not infinitely fast. Computing time is therefore a bounded resource, which makes it precious. Although the saying goes, "Time is money," time is even more valuable than money: you can get back money after you spend it, but once time is spent, you can never get it back. Memory may be inexpensive, but it is neither infinite nor free. You should choose algorithms that use the resources of time and space efficiently.',
          zh: '★★ 本关的论点句：时间与空间都是**有界资源**，所以要挑「把这两种资源用得省」的算法。注意它把 space（内存）和 time 并列 —— 这就是 1.1-2 要你举的其他效率度量，本书第 6、7 章讲 in-place 时会回来找它。',
        },
        {
          kind: 'body', page: 12,
          en: 'Different algorithms devised to solve the same problem often differ dramatically in their efficiency. These differences can be much more significant than differences due to hardware and software.',
          zh: '★★ 两句话把本关的标题立起来：**同一问题的不同算法，效率差异可以比硬件和软件的差异更大**。下一段给出量化的样子（$c_1n^2$ 与 $c_2n\\lg n$），p.13 给出算例（17 倍），p.13 末尾给出结论（算法应当与硬件并列为一种技术）。',
        },
        {
          kind: 'body', page: 12,
          en: 'As an example, Chapter 2 introduces two algorithms for sorting. The first, known as insertion sort, takes time roughly equal to c 1 n 2 to sort n items, where c 1 is a constant that does not depend on n. That is, it takes time roughly proportional to n 2 . The second, merge sort, takes time roughly equal to c 2 n lg n, where lg n stands for log 2 n and c 2 is another constant that also does not depend on n. Insertion sort typically has a smaller constant factor than merge sort, so that c 1 < c 2 .',
          zh: '★★ 这里第一次出现全书最重要的两个式子：$c_1n^2$（插入排序）与 $c_2n\\lg n$（归并排序）。请注意原书特意补的最后一句：插入排序的**常数更小**。这是故意把有利条件给足 —— 连这样都会被函数形式翻盘，说服力才够。',
        },
        {
          kind: 'body', page: 12,
          en: 'We’ll see that the constant factors can have far less of an impact on the running time than the dependence on the input size n. Let’s write insertion sort’s running time as c 1 n • n and merge sort’s running time as c 2 n • lg n. Then we see that where insertion sort has a factor of n in its running time, merge sort has a factor of lg n, which is much smaller. For example, when n is 1000, lg n is approximately 10, and when n is 1,000,000, lg n is approximately only 20. Although insertion sort usually runs faster than merge sort for small input sizes, once the input size n becomes large enough, merge sort’s advantage of lg n versus n more than compensates for the difference in constant factors. No matter how much smaller c 1 is than c 2 , there is always a crossover point beyond which merge sort is faster.',
          zh: '★★★ 本关的核心论证，一句话一句拆：① 把两个式子写成 $c_1n\\bullet n$ 与 $c_2n\\bullet\\lg n$，于是差别集中在「一个因子是 $n$、另一个是 $\\lg n$」；② 代数字感受：$n=1000$ 时 $\\lg n\\approx10$，$n=10^6$ 时 $\\lg n$ 才 20；③ 结论那句 **No matter how much smaller $c_1$ is than $c_2$** —— 常数差距多大都没关系，交叉点一定存在。这句话就是阶段 8 要证的东西。',
        },
        {
          kind: 'body', page: 13,
          en: 'By using an algorithm whose running time grows more slowly, even with a poor compiler, computer B runs more than 17 times faster than computer A! The advantage of merge sort is even more pronounced when sorting 100 million numbers: where insertion sort takes more than 23 days, merge sort takes under four hours.',
          zh: '★★ 17 倍、23 天、4 小时 —— 这三个数是本关的骨架，阶段 6 的 C 程序把它们原样复算出来（实测比值 17.2 与 150.5）。注意后半句：**规模从 1000 万涨到 1 亿，优势从 17 倍涨到 150 倍**，这正是「函数形式压过常数」的动态版本。',
        },
        {
          kind: 'body', page: 13,
          en: 'The example above shows that you should consider algorithms, like computer hardware, as a technology. Total system performance depends on choosing efficient algorithms as much as on choosing fast hardware. Just as rapid advances are being made in other computer technologies, they are being made in algorithms as well.',
          zh: '★★ 标题句。它把「算法」从「编程技巧」提到「技术选型」的位置：系统总性能 = 硬件选择 × 算法选择，两者同量级。这句话也是本书存在的正当性 —— 换算法是一条与换机器并列、且不被硬件天花板限制的路。',
        },
        {
          kind: 'body', page: 14,
          en: 'Moreover, even an application that does not require algorithmic content at the application level relies heavily upon algorithms. = oes the application rely on fast hardware? The hardware design used algorithms. Does the application rely on graphical user interfaces? The design of any GUI relies on algorithms. Does the application rely on networking? Routing in networks relies heavily on algorithms.',
          zh: '★ 面对「现代技术这么多，算法还重要吗」的反问，原书用一连串排比回答：你以为绕开了算法，其实你脚下的每一层都用着它 —— 芯片设计、图形界面、网络路由。⚠ 引文里「= oes」是语料的排版伪影（原为 Does），本站照抄不改（规则：引述逐字，伪影一起留）。',
        },
        {
          kind: 'body', page: 14,
          en: 'Machine learning can be thought of as a method for performing algorithmic tasks without explicitly designing an algorithm, but instead inferring patterns from data and thereby automatically learning a solution. At first glance, machine learning, which automates the process of algorithmic design, may seem to make learning about algorithms obsolete. The opposite is true, however. Machine learning is itself a collection of algorithms, just under a different name.',
          zh: '★★ 第 4 版新增的这一段，专门处理「有机器学习还需要学算法吗」。原书的两条理由：① 机器学习**本身就是一堆算法**，只是换了名字；② 它成功的领域恰恰是「人类说不清正确算法是什么」的领域（视觉、翻译），而在人类已经理解的问题上（本书绝大多数问题），专门设计的高效算法通常更强。后半段见 p.14 的数据科学那一句。',
        },
        {
          kind: 'body', page: 15,
          en: 'Furthermore, with the ever-increasing capacities of computers, we use them to solve larger problems than ever before. As we saw i n the above comparison between insertion sort and merge sort, it is at larger problem sizes that the differences in efficiency between algorithms become particularly prominent.',
          zh: '★ 收尾把「机器越来越强」这件看似削弱算法价值的事，反过来变成加强算法价值的理由：机器让我们去解更大的问题，而**差距恰恰在大尺度上才显出来**。⚠「i n」是语料断词伪影，照抄。',
        },
      ],
      terms: [
        { en: 'insertion sort', zh: '插入排序（$c_1n^2$ 那一边）', page: 12 },
        { en: 'merge sort', zh: '归并排序（$c_2n\\lg n$ 那一边）', page: 12 },
        { en: 'constant factor', zh: '常数因子（不随 $n$ 变的那部分开销）', page: 12 },
        { en: 'crossover point', zh: '交叉点（两种算法耗时相等的规模）', page: 12 },
        { en: 'bounded resource', zh: '有界资源（时间与空间）', page: 12 },
        { en: 'machine learning', zh: '机器学习（本身是一堆算法）', page: 14 },
        { en: 'data science', zh: '数据科学（算法是其基础）', page: 14 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 12,
      lines: [],
      vars: [],
      note: '★ 1.2 只比较两个运行时间式子，不引入新过程 —— 它引用的插入排序与归并排序分别在第 2.1 与 2.3 关才有伪代码。本关的「可执行部分」是阶段 6 那个算交叉点与时间预算表的 C 程序。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '两条曲线什么时候分道扬镳',
      panels: [
        {
          title: '$n^2$ 与 $n\\lg n$：交叉点之后差距只会更大',
          viz: 'growth',
          chart: {
            xMax: 64,
            caption: '本关的全部论点在这一张图上：一条是 n²，一条是 n lg n（都取常数 1，先把 c₁、c₂ 的差别剥掉）',
            series: [
              { name: 'n lg n（归并排序的形状）', color: '--viz-done', expr: 'n * Math.log2(n)' },
              { name: 'n^2（插入排序的形状）', color: '--viz-compare', expr: 'n * n' },
            ],
          },
        },
        {
          title: '把常数差 1000 倍也画进来：$2n^2$ 与 $50n\\lg n$',
          viz: 'growth',
          chart: {
            xMax: 64,
            caption: '原书 p.13 的两个式子（指令数口径）。c₂ 比 c₁ 大 25 倍，可交叉点仍然出现 —— 这就是阶段 8 要证的那句「no matter how much smaller」。',
            series: [
              { name: '50 n lg n（机器 B）', color: '--viz-done', expr: '50 * n * Math.log2(n)' },
              { name: '2 n^2（机器 A）', color: '--viz-compare', expr: '2 * n * n' },
            ],
          },
        },
      ],
      tasks: [
        '看第一块面板：$n$ 多大之后 $n^2$ 明显甩开 $n\\lg n$？把鼠标停在几处，读一下两条线的比值。',
        '第二块面板里 $50n\\lg n$ 一开始在 $2n^2$ **上方**（常数吃了亏）。找到它被反超的那个 $n$ —— 阶段 6 的 C 程序 part 1 会给出精确答案。',
        '想一想：如果把第二块里的 50 换成 5000（编译器再烂 100 倍），交叉点会往左还是往右移？移得远吗？',
      ],
      note: '★ 曲线的纵轴会按最大值自动缩放，所以看的是**形状**与**先后**，不是绝对数值。要绝对数值请看阶段 6 的表。',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '把 17 倍、23 天、交叉点全部算出来',
      intro: '本关没有伪代码可对照，C 程序算的是**账**：part 1 求两道习题的交叉点（1.2-2 的 $8n^2$ vs $64n\\lg n$、1.2-3 的 $100n^2$ vs $2^n$），part 2 复算原书 p.13 那台快 1000 倍的机器 A 与慢机器 B，part 3 把本章 Problem 1-1 的「给定时间能解多大的问题」整张表打出来。全部只用整数与浮点四则运算，$\\lg$ 用反复平方法自算，不链接 math 库。',
      pseudocodeRef: null,
      c: {
        file: 'technology_crossover.c',
        code: String.raw`/*
 * technology_crossover.c — CLRS 1.2：算法作为技术，交叉点与「能解多大的问题」
 *
 * 1.2 的论点是：常数因子的差距，迟早被 n 的函数差距碾过去。本程序把这句话
 * 变成三段可执行的账：
 *   part 1  两道习题的交叉点（1.2-2 的 8n² vs 64n lg n、1.2-3 的 100n² vs 2ⁿ）；
 *   part 2  原书 p.13 那笔账：快 1000 倍的机器 A + 插入排序  vs  慢机器 B + 归并排序；
 *   part 3  本章 Problem 1-1 的表：给定时间预算 t（微秒），每种 f(n) 最多能解多大。
 * 只用整数与浮点的加减乘除，不链接 math 库（lg 用反复平方法自己算）。
 * 关键数字一律 printf（关卡编写手册 坑 19），断言只兜住已经算对的那几条。
 */
#include <stdio.h>

#define CAP 1000000000000000000ULL   /* 10^18：超过它一律按「溢出」处理 */

/* Problem 1-1 表头的时间预算，单位微秒 */
static const unsigned long long BUDGET[7] = {
  1000000ULL,            /* 1 秒 */
  60000000ULL,           /* 1 分 */
  3600000000ULL,         /* 1 小时 */
  86400000000ULL,        /* 1 天 */
  2592000000000ULL,      /* 1 月（30 天） */
  31536000000000ULL,     /* 1 年（365 天） */
  3153600000000000ULL    /* 1 世纪 */
};
static const char *BUDGET_NAME[7] = {
  "1 秒", "1 分", "1 小时", "1 天", "1 月", "1 年", "1 世纪"
};
static const char *FN_NAME[7] = { "lg n", "sqrt(n)", "n", "n lg n", "n^2", "n^3", "2^n" };

/* ceil(log2 n)，n >= 1；纯整数 */
static unsigned long long log2ceil(unsigned long long n) {
  unsigned long long k = 0, p = 1;
  while (p < n) { p <<= 1; k++; }
  return k;
}

/* 反复平方求 log2 r，r ∈ [1,2) → 结果 ∈ [0,1)。只用乘除与比较。 */
static double log2_frac(double r) {
  double frac = 0.0, w = 0.5;
  int i;
  for (i = 0; i < 52; i++) {
    r = r * r;                 /* 每平方一次，log2 翻倍；越过 2 就记一位 */
    if (r >= 2.0) { frac += w; r /= 2.0; }
    w *= 0.5;
  }
  return frac;
}

/* lg n（双精度），纯靠位移 + 反复平方 */
static double lg(unsigned long long n) {
  unsigned long long k = 0;
  double r;
  if (n < 2) return 0.0;
  while ((1ULL << (k + 1)) <= n && k + 1 < 63) k++;
  r = (double)n / (double)(1ULL << k);
  return (double)k + log2_frac(r);
}

static unsigned long long mul_sat(unsigned long long a, unsigned long long b) {
  if (a == 0 || b == 0) return 0;
  if (a > CAP / b) return CAP + 1;
  return a * b;
}

static unsigned long long pow_sat(unsigned long long base, int e) {
  unsigned long long v = 1;
  int i;
  for (i = 0; i < e; i++) {
    if (v > CAP / base) return CAP + 1;
    v *= base;
  }
  return v;
}

static unsigned long long pow2_sat(unsigned long long k) {
  if (k >= 64) return CAP + 1;
  if ((1ULL << k) > CAP) return CAP + 1;
  return 1ULL << k;
}

/* 七个 f(n) 的溢出安全求值 */
static unsigned long long eval_f(int which, unsigned long long n) {
  switch (which) {
    case 0: return log2ceil(n);                  /* lg n */
    case 1: return n;                            /* sqrt(n)：反解走闭式，见 max_n */
    case 2: return n;                            /* n */
    case 3: return mul_sat(n, log2ceil(n));      /* n lg n */
    case 4: return mul_sat(n, n);                /* n^2 */
    case 5: return mul_sat(mul_sat(n, n), n);    /* n^3 */
    default: return pow2_sat(n);                 /* 2^n */
  }
}

/* 二分求最大的 n（1 <= n <= 10^18）使 f(n) <= t */
static unsigned long long max_n(int which, unsigned long long t) {
  unsigned long long lo = 1, hi = CAP, ans = 0;
  if (which == 1) {                       /* sqrt(n) <= t  <=>  n <= t^2 */
    if (t > 1000000000ULL) return CAP + 1;
    return t * t;
  }
  while (lo <= hi) {
    unsigned long long mid = lo + (hi - lo) / 2;
    if (eval_f(which, mid) <= t) {
      ans = mid;
      if (mid == hi) break;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

int main(void) {
  int i;

  printf("part 1  两个交叉点\n");
  /* 1.2-2：8n^2 < 64n lg n  <=>  n < 8 lg n  <=>  2^(n/8) < n  <=>  2^n < n^8。
     最后一步是纯整数判据，不用浮点、不用 lg 的精度。 */
  {
    int first = 0, last = 0;
    for (i = 2; i <= 62; i++) {
      unsigned long long lhs = pow2_sat((unsigned long long)i);
      unsigned long long rhs = pow_sat((unsigned long long)i, 8);
      if (lhs < rhs) { if (!first) first = i; last = i; }
    }
    printf("  1.2-2  8n^2 < 64n lg n（即 2^n < n^8）的 n 区间: %d .. %d\n", first, last);
    printf("        边界实测：n=%d 时 2^n=%llu vs n^8=%llu（插入排序快）\n",
           last, pow2_sat((unsigned long long)last), pow_sat((unsigned long long)last, 8));
    printf("        n=%d 时 2^n=%llu vs n^8=%llu（归并排序反超）\n",
           last + 1, pow2_sat((unsigned long long)(last + 1)),
           pow_sat((unsigned long long)(last + 1), 8));
    if (first != 2 || last != 43) { printf("FAIL part 1 1.2-2 区间不是 2..43\n"); return 1; }
  }
  /* 1.2-3：100n^2 < 2^n 的最小 n（纯整数） */
  {
    int hit = 0;
    unsigned long long p = 2;
    for (i = 1; i <= 60; i++) {
      unsigned long long q = 100ULL * (unsigned long long)i * (unsigned long long)i;
      if (q < p) {
        hit = i;
        printf("  1.2-3  100n^2 < 2^n 的最小 n: %d（%llu < %llu）；上一格 n=%d 是 %llu vs %llu\n",
               i, q, p, i - 1,
               100ULL * (unsigned long long)(i - 1) * (unsigned long long)(i - 1), p >> 1);
        break;
      }
      p <<= 1;
    }
    if (hit != 15) { printf("FAIL part 1 1.2-3 最小 n 不是 15\n"); return 1; }
  }

  printf("\npart 2  原书 p.13：机器 A（快 1000 倍）+ 插入排序  vs  机器 B + 归并排序\n");
  printf("        A：2n^2 条指令、每秒 10^10 条；B：50n lg n 条、每秒 10^7 条\n");
  for (i = 0; i < 2; i++) {
    unsigned long long items = i == 0 ? 10000000ULL : 100000000ULL;
    double secA = 2.0 * (double)items * (double)items / 1.0e10;
    double secB = 50.0 * (double)items * lg(items) / 1.0e7;
    printf("  n = %llu:  A %.0f 秒（%.2f 小时 / %.2f 天）   B %.0f 秒（%.2f 小时）   比值 %.1f 倍\n",
           items, secA, secA / 3600.0, secA / 86400.0, secB, secB / 3600.0, secA / secB);
    if (i == 0) {
      if ((int)(secA + 0.5) != 20000 || (int)(secB + 0.5) != 1163) {
        printf("FAIL part 2 与书上给的 20000 秒 / 1163 秒不符\n");
        return 1;
      }
      printf("  OK 与 p.13 一致：A 超过 5.5 小时，B 不到 20 分钟（书上说 B 快 17 倍以上）\n");
    } else {
      if (!(secA > 23 * 86400.0 && secB < 4 * 3600.0)) {
        printf("FAIL part 2 n=10^8 时不满足「A 超 23 天、B 不到 4 小时」\n");
        return 1;
      }
      printf("  OK 规模翻 10 倍，好算法的优势从 17 倍涨到 150 倍：问题越大越占便宜\n");
    }
  }

  printf("\npart 3  Problem 1-1：给定时间预算（微秒），各 f(n) 最多能解多大的问题\n");
  printf("  %-10s", "预算");
  for (i = 0; i < 7; i++) printf("%-12s", FN_NAME[i]);
  printf("\n");
  for (i = 0; i < 7; i++) {
    int j;
    printf("  %-9s", BUDGET_NAME[i]);
    for (j = 0; j < 7; j++) {
      unsigned long long v = max_n(j, BUDGET[i]);
      char buf[32];
      if (v > CAP) snprintf(buf, sizeof buf, ">1e18");
      else if (v >= CAP) snprintf(buf, sizeof buf, ">=1e18");
      else snprintf(buf, sizeof buf, "%llu", v);
      printf("%22s", buf);
    }
    printf("\n");
  }
  if (max_n(4, BUDGET[0]) != 1000ULL) { printf("FAIL part 3 n^2 在 1 秒内应为 1000\n"); return 1; }
  if (max_n(5, BUDGET[0]) != 100ULL) { printf("FAIL part 3 n^3 在 1 秒内应为 100\n"); return 1; }
  if (max_n(6, BUDGET[0]) != 19ULL) { printf("FAIL part 3 2^n 在 1 秒内应为 19\n"); return 1; }
  if (max_n(2, BUDGET[0]) != 1000000ULL) { printf("FAIL part 3 n 在 1 秒内应为 10^6\n"); return 1; }
  printf("  OK 抽查四格与手算一致（1 秒 = 10^6 微秒：n=10^6、n^2=1000、n^3=100、2^n=19）\n");
  printf("  注：lg n 与 sqrt(n) 两列在 1 秒预算下分别是 2^1000000 与 10^12 —— 前者远超 10^18，\n");
  printf("      表里按「>=1e18」处理。这正是 1.2 想让你看见的事：lg n 增长慢到几乎没有约束。\n");

  printf("\n全部断言通过\n");
  return 0;
}
`,
      },
      mapping: [],
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '这一关的全部算术：两个式子、三个数、一张表',
      intro: '1.2 不做渐近分析（那是第 3 章），它只做一件事：把「$n^2$ 与 $n\\lg n$ 的差距」换算成秒、小时、天。下面每条都标了出处；带 instructor 的是本站 C 程序实测的数字。',
      claims: [
        {
          expr: 'c_1 n^2',
          when: '插入排序的运行时间（$c_1$ 是与 $n$ 无关的常数）。完整的推导在第 2.1–2.2 关，这里按原书 p.12 的口径引用',
          page: 12, source: 'book',
        },
        {
          expr: 'c_2 n \\lg n',
          when: '归并排序的运行时间。完整的推导在第 2.3 关',
          page: 12, source: 'book',
        },
        {
          expr: '20000\\ \\text{秒} > 1163\\ \\text{秒}',
          when: '原书 p.13 的算例：$n=10^7$ 时机器 A（$2n^2$、$10^{10}$ 条/秒）与机器 B（$50n\\lg n$、$10^7$ 条/秒）。本站 C 程序 part 2 复算得 20000 与 1163，比值 17.2 倍',
          page: 13, source: 'book',
        },
        {
          expr: '\\frac{n^2}{n\\lg n} = \\frac{n}{\\lg n} \\to \\infty',
          when: '为什么「规模越大、好算法越占便宜」：比值随 $n$ 无上界。本站实测 $n=10^7$ 时 17.2 倍、$n=10^8$ 时 150.5 倍（C 程序 part 2），与书上「23 天 vs 不到 4 小时」一致',
          page: 13, source: 'instructor',
        },
        {
          expr: '8n^2 < 64n\\lg n \\iff 2^n < n^8',
          when: '1.2-2 的解法：两边同除 $8n$ 得 $n < 8\\lg n$，再指数化就得到**纯整数**判据。C 程序 part 1 实测区间 $2 \\le n \\le 43$',
          page: 15, source: 'instructor',
        },
      ],
      tables: [
        {
          // ★ kvTable 只渲染两列（r[0] 是行首、r[1] 是单元格，r[2] 只是「等宽」标记），
          //   所以一行一个 f(n)，三档预算写进同一格；完整 7×7 表交给阶段 6 的 C 程序。
          //   caption 是纯文本，不能放 $…$。
          caption: '本站 C 程序 part 3 复算的 Problem 1-1：各 f(n) 在给定时间预算内最多能解多大的 n',
          rows: [
            ['lg n', '1 秒 ≥10¹⁸（2^1000000）｜ 1 世纪 ≥10¹⁸', true],
            ['√n', '1 秒 10¹² ｜ 1 小时 >10¹⁸', true],
            ['n', '1 秒 10⁶ ｜ 1 天 8.64×10¹⁰ ｜ 1 世纪 3.15×10¹⁵', true],
            ['n lg n', '1 秒 62500 ｜ 1 天 2700000000 ｜ 1 世纪 6.86×10¹³', true],
            ['n²', '1 秒 1000 ｜ 1 天 293938 ｜ 1 世纪 5.6×10⁷', true],
            ['n³', '1 秒 100 ｜ 1 天 4420 ｜ 1 世纪 146645', true],
            ['2ⁿ', '1 秒 19 ｜ 1 天 36 ｜ 1 世纪 51', true],
          ],
        },
      ],
      chart: {
        xMax: 64,
        series: [
          { name: 'n lg n', color: '--viz-done', expr: 'n * Math.log2(n)' },
          { name: 'n^2', color: '--viz-compare', expr: 'n * n' },
          { name: '2^n', color: '--viz-active', expr: 'Math.pow(2, n)' },
        ],
      },
      derivations: [
        {
          kind: 'line',
          title: '为什么交叉点一定存在（不依赖 $c_1$、$c_2$ 的具体值）',
          steps: [
            {
              zh: '要比较的是 $c_1n^2$ 与 $c_2n\\lg n$。两边同除 $n$（$n\\ge1$，不改变不等号），比的就是 $c_1n$ 与 $c_2\\lg n$。',
            },
            {
              zh: '再写成比值：$\\dfrac{c_1n^2}{c_2n\\lg n} = \\dfrac{c_1}{c_2}\\cdot\\dfrac{n}{\\lg n}$。左边那个因子是**固定的常数**，右边那个因子 $n/\\lg n$ 随 $n$ 单调上升且没有上界。',
            },
            {
              zh: '所以无论 $c_1/c_2$ 多小，只要把 $n$ 推得足够大，乘积迟早超过 1 —— 那一刻之后归并排序恒胜。这就是 p.12 那句 No matter how much smaller 的全部内容，也是 1.2-2、1.2-3 两道习题的通用解法：把常数挪到一边，剩下解 $n/\\lg n$ 或 $2^n/n^k$ 的增长。',
            },
          ],
        },
      ],
      note: '★ 表里 $\\lg n$ 那一列「$\\ge10^{18}$」不是算不出来，而是 $2^{10^6}$ 远超任何可表示的数 —— 这本身就是个笑话式的结论：以 $\\lg n$ 增长的算法， practically 没有时间约束。原书 Problem 1-1 要的就是你去把每一列的量级差别看清楚。',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '证「交叉点一定存在」',
      statement: 'No matter how much smaller c 1 is than c 2 , there is always a crossover point beyond which merge sort is faster.',
      page: 12,
      intro: '★ 这是本关唯一一句带「always」的断言，原书没给证明，留在这里补。三步走：先把常数剥到一边，再证明剩下的那个因子无上界，最后用「无上界」造出交叉点。',
      steps: [
        {
          title: '第一步 · 把常数因子挪到一边',
          en: 'Insertion sort typically has a smaller constant factor than merge sort, so that c 1 < c 2 .',
          page: 12,
          body: [
            '设 $c_1/c_2 = k$（$0 < k < 1$，因为插入排序常数更小）。要问的是：$c_1n^2$ 什么时候被 $c_2n\\lg n$ 反超？两边同除 $c_2n$（$n\\ge1$）后，问题变成 $kn < \\lg n$ 何时无效，即 $n/\\lg n > 1/k$ 何时成立。',
            '**关键**：$k$ 是常数，$1/k$ 也是常数。于是要证的不再是「某个不等式」，而是「一个函数能超过任意给定的常数」。',
          ],
        },
        {
          title: '第二步 · 证明 n/lg n 无上界',
          en: 'For example, when n is 1000, lg n is approximately 10, and when n is 1,000,000, lg n is approximately only 20.',
          page: 12,
          body: [
            '取 $n = 2^m$，则 $n/\\lg n = 2^m/m$。$m$ 翻倍时分子平方、分子翻倍而分母只加 1 —— 具体地，$2^{m}/m$ 随 $m$ 单调增且趋于无穷。',
            '原书给的两个数就是这条的抽样：$n$ 从 $10^3$ 涨到 $10^6$（一千倍），$\\lg n$ 只从 10 涨到 20（两倍）。比值 $n/\\lg n$ 因此从 100 涨到 50000。',
            '写成一句话：**指数增长压过线性增长**，所以 $n/\\lg n$ 可以超过任何给定的 $1/k$。',
          ],
        },
        {
          title: '第三步 · 造出交叉点并收尾',
          en: 'Although insertion sort usually runs faster than merge sort for small input sizes, once the input size n becomes large enough, merge sort’s advantage of lg n versus n more than compensates for the difference in constant factors.',
          page: 12,
          body: [
            '由第二步，存在 $N$ 使 $n \\ge N$ 时 $n/\\lg n > 1/k$，即 $c_1n^2 > c_2n\\lg n$ —— 归并排序更快。这个 $N$ 就是「交叉点」，它依赖 $k$（常数差距越大，$N$ 越靠后），但**一定存在**。',
            '★ 本站 C 程序 part 1 把这件事算成具体数字：$8n^2$ vs $64n\\lg n$（即 $k = 1/8$）的交叉点在 $n = 43$ 与 $44$ 之间 —— $n=43$ 时 $2^{43} = 8796093022208 < 43^8 = 11688200277601$，$n=44$ 时 $2^{44} = 17592186044416 > 44^8 = 14048223625216$，不等号当场翻向。',
          ],
        },
      ],
      conclusion: '★ 结论：对任意固定的常数差距 $c_1 \\ll c_2$，都存在一个规模 $N$，使 $n \\ge N$ 后归并排序恒胜。这就是「算法是一种技术」的数学内容 —— 函数形式的优势不会被常数抵消，只会被推迟。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'single',
          q: '原书 p.13 的算例里，机器 A 比 B 快 1000 倍、代码还是「最熟练程序员手写机器语言」，跑 $2n^2$；B 跑 $50n\\lg n$。$n=10^7$ 时谁赢、赢多少？',
          options: ['A 赢，约 17 倍', 'B 赢，约 17 倍', '两者接近，差距在 2 倍以内', '无法判断，取决于常数'],
          answer: 1,
          why: 'B 赢，17 倍以上：A 要 20000 秒（5.56 小时），B 只要 1163 秒（不到 20 分钟）。本站 C 程序 part 2 复算出 17.2 倍。硬件与代码的 1000 倍优势，被 $n$ 与 $\\lg n$ 的差距吃掉了。',
        },
        {
          kind: 'judge',
          q: '把规模从 1000 万涨到 1 亿，好算法（归并排序）的优势会变得更明显。',
          answer: true,
          why: '实测：$n=10^7$ 时 17.2 倍，$n=10^8$ 时 150.5 倍（C 程序 part 2）。因为比值是 $\\dfrac{c_1}{c_2}\\cdot\\dfrac{n}{\\lg n}$，后一个因子随 $n$ 单调上升。原书的说法是「23 天 vs 不到 4 小时」。',
        },
        {
          kind: 'single',
          q: '1.2-2：插入排序 $8n^2$、归并排序 $64n\\lg n$。插入排序在哪些 $n$ 上更快？',
          options: ['$2 \\le n \\le 43$', '$n \\le 8$：过了个位数就该换归并', '所有 $n$：系数 $8$ 恒小于 $64$', '$n \\ge 44$：大 $n$ 只看渐进阶'],
          answer: 0,
          why: '$8n^2 < 64n\\lg n$ 同除 $8n$ 得 $n < 8\\lg n$，再指数化成**纯整数**判据 $2^n < n^8$。C 程序 part 1 实测成立区间是 $2 \\le n \\le 43$（$n=44$ 时不等号翻向）。',
        },
        {
          kind: 'single',
          q: '1.2-3：$100n^2$ 与 $2^n$ 同机比较，最小的 $n$ 使前者更快是？',
          options: ['$n = 10$', '$n = 14$', '$n = 15$', '$n = 20$'],
          answer: 2,
          why: '$n=15$：$100\\times15^2 = 22500 < 32768 = 2^{15}$。再往前一格 $n=14$ 是 $19600 > 16384$，还不成立（C 程序 part 1 把两格都打了出来）。这题的教训是**指数一旦开始输就再也追不回来**，但起点比想象晚。',
        },
        {
          kind: 'judge',
          q: '按原书 p.14 的说法，机器学习之所以让「学算法」变得过时，是因为它自己不需要算法。',
          answer: false,
          why: '原书说的是相反的话：Machine learning is itself a collection of algorithms, just under a different name。而且它成功的领域恰恰是「人类说不清正确算法是什么」的领域；在人类已理解的问题上，专门设计的高效算法通常更强。',
        },
        {
          kind: 'single',
          q: 'Problem 1-1 的表里（本站 C 程序 part 3 复算）：1 秒 = $10^6$ 微秒内，$n^2$ 与 $2^n$ 两种算法分别最大能解多大的 $n$？',
          options: ['$10^3$ 与 $19$', '$10^6$ 与 $10^2$', '$10^{12}$ 与 $10^6$', '$60000$ 与 $1000$'],
          answer: 0,
          why: '$n^2 \\le 10^6 \\Rightarrow n = 1000$；$2^n \\le 10^6 \\Rightarrow n = 19$（$2^{19}=524288$，$2^{20}$ 就超了）。对照 $n$ 那一列是 $10^6$：指数算法在 1 秒里只能处理 19 个元素 —— 这张表的价值就是把「量级」变成肉眼可见的差距。',
        },
        {
          kind: 'judge',
          q: '原书认为：即使机器无限快、内存免费，学习算法仍然有理由。',
          answer: true,
          why: '见 p.12 开头那句反设问，理由是**你仍然要保证方法会停机、且给出正确答案** —— 这是 1.1 的「正确性」，与效率无关。效率只是学算法的第二个理由。',
        },
        {
          kind: 'single',
          q: '「算法应当与硬件并列地被视为一种技术」这个论点的直接推论是？',
          options: [
            '买更快的机器永远比改算法划算：硬件换代不用重写代码，也不用重新设计',
            '系统总性能同时取决于算法选择与硬件选择，且改算法的收益随规模放大',
            '只要算法够好硬件就无所谓：同一份代码在任何机器上的相对快慢是同一个数',
            '算法的重要性只在教科书里成立：真实系统的瓶颈都在网络与 I/O 上',
          ],
          answer: 1,
          why: 'p.13 的原话是 Total system performance depends on choosing efficient algorithms as much as on choosing fast hardware。注意别滑到第三个选项：硬件仍然重要，只是**不再是唯一的一条路**，而且它的收益会被硬件天花板卡住（p.10 的多核那段）。',
        },
      ],
      bookExercises: [
        {
          id: '1.2-1', page: 15, star: 0,
          statement: 'Give an example of an application that requires algorithmic content at the application level, and discuss the function of the algorithms involved.',
          hint: '「应用层就需要算法」是关键限定 —— 别挑「底层碰巧用到算法」的那种（那是 p.14 排比句反驳的对象）。抓手：把你选的应用拆成几个动作，问「哪一步不做对就整个功能不成立」。导航（找路 = 最短路）、压缩（变长编码）、拼写纠正（编辑距离）、排班（约束优化）都是干净例子。写的时候说清算法在这里**负责什么**：是保证正确，还是把不可行的穷举变成可行。',
        },
        {
          id: '1.2-2', page: 15, star: 0,
          statement: 'Suppose that for inputs of size n on a particular computer, insertion sort runs in 8n 2 steps and merge sort runs in 64n lg n steps. For which values of n does insertion sort beat merge sort?',
          hint: '先化简再解：两边同除 $8n$（$n\\ge1$）得到 $n < 8\\lg n$，这个式子没法代数解，但**判据可以完全整数化** —— 两边取 2 的幂得 $2^n < n^8$，从此只需逐个 $n$ 试。本站 C 程序 part 1 就是用这个判据算的，答案是 $2 \\le n \\le 43$；你要检查的是自己有没有把「同除 $8n$」的方向搞对，以及边界 $n=43$、$44$ 两侧各代一次确认翻向。',
        },
        {
          id: '1.2-3', page: 15, star: 0,
          statement: 'What is the smallest value of n such that an algorithm whose running time is 100n 2 runs faster than an algorithm whose running time is 2 n on the same machine?',
          hint: '和 1.2-2 同一套路：$100n^2 < 2^n$，左边多项式、右边指数，所以成立区间是某个 $n$ 之后、且**不会回头**。逐格手算到翻向即可（$n=10$ 时 $10^4$ vs $1024$ 还差得远；$n=14$ 是 $19600$ vs $16384$，仍不成立；$n=15$ 是 $22500$ vs $32768$，成立）。⚠ 这题最容易答成 14 —— 差一格就答错，务必代两个边界各算一次。',
        },
        {
          id: '1-1', page: 15, star: 0,
          statement: 'Comparison of running times',
          hint: '这是本章的 Problem（原题还带一张表：对每个 $f(n)$ 与时间 $t$，求在 $t$ 内能解的最大 $n$）。做法是把每一列反解：$n\\le t$、$n^2\\le t\\Rightarrow n\\le\\sqrt t$、$n^3\\le t\\Rightarrow n\\le t^{1/3}$、$2^n\\le t\\Rightarrow n\\le\\lg t$、$\\lg n\\le t\\Rightarrow n\\le 2^t$；只有 $n\\lg n\\le t$ 没有闭式，取整试或二分。⚠ 单位先统一成**微秒**（1 秒 = $10^6$、1 世纪 $\\approx 3.15\\times10^{15}$）。本站阶段 6 的 C 程序 part 3 把整张表打出来了，可以拿来对答案 —— 但请先自己填，尤其注意 $\\lg n$ 那一列会大到无法表示，这恰恰是本题想让你体会的。',
        },
      ],
    },
  ],
};
