/* =============================================================================
 * 第 1 章 1.1 —— 第 s01 关：1.1 Algorithms
 *
 * 原文锚点：印刷页 5–11（pdf_index 26–32）
 *
 * 引述全部逐字取自 data/blocks/part-i-foundations__ch01.json，每条都通过闸门溯源判据
 * （含语料排版伪影，如 in- stance / out- puts 的断字，一律照抄，不要"顺手修正"）。
 * 本节原书没有伪代码框，pseudocode 段按闸门要求保留为空（规则 5）。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's01',
  id: 'ch01/s01',
  chapter: 1,
  section: '1.1',
  title: '算法是什么',
  shortTitle: '1.1 算法是什么',
  titleEn: 'Algorithms',
  source: { printed: [5, 11], pdf: [26, 32] },
  sourceNote: '本关对应原书 1.1 节（印刷页 5–11）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '这一关不教算法，它定义整本书的语言',
      why: '后面 148 关都在做同一件事：给一个问题，造一个过程，证明它对，再算它多快。这件事里有四个词必须先钉死 —— **算法**、**问题实例**、**正确**、**效率**。它们看着像常识，其实是全书唯一一处「什么叫对」的正式定义；没这一页，第 2 章的循环不变量、第 3 章的渐进记号、第 34 章的 NP 完全都没有落点。',
      position: '这是全书第一关，没有前置。它往上什么都不依赖，往下给三样东西铺路：1.2 把「算法是一种技术」讲透（效率为什么能和速度、内存平起平坐），2.1 出现你第一个真正要证的算法，3.1 开始给「快」下定义。',
      unlocks: [
        { label: '1.2 算法是一种技术', url: '#/ch01/s02' },
        { label: '2.1 插入排序：第一个完整算法', url: '#/ch02/s01' },
      ],
      mathKit: [
        {
          title: '$n!$ 有多快：为什么「试遍所有可能」不是办法',
          body: '$n!$ 读作 $n$ 的阶乘，就是 $n \\times (n-1) \\times \\cdots \\times 2 \\times 1$。它比任何指数函数还长得快：$10! = 3628800$，$20! \\approx 2.4 \\times 10^{18}$。本站阶段 6 的 C 程序会把这几个数当场打出来。原书 p.8 举的零件清单问题有 $n!$ 种可能次序，所以「全部生成再逐个检查」这条路只在零件极少时才走得通。',
        },
        {
          title: '$\\lg n$ 是什么：本站默认的底数是 2',
          body: '$\\lg n$ 是以 2 为底的对数：$\\lg 1024 = 10$，因为 $2^{10} = 1024$。它回答的是「每次砍一半，能砍几次」。第 3 章会证明底数只差常数倍，所以渐进记号里写 $\\lg$ 还是 $\\log$ 不影响结论；但本站的曲线图一律按 2 为底画。',
        },
      ],
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '先被「笨办法」逼一次',
      scene: '桌上有六张写着数字的卡片：31、41、59、26、41、58。要求把它们排成从小到大的顺序。',
      body: [
        '最老实的想法是：六个数字一共有多少种排法？穷举出来，一种一种看是不是有序的。C 程序数给你看：**720 种**，其中有序的只有 2 种（那两个 41 可以互换，于是同一串有序结果被数了两遍）。也就是说，你 720 次尝试里 718 次是白费的。',
        '把六张换成六十张呢？$60!$ 是一个 82 位数 —— 穷举这条路当场死掉。可问题并没有变难，变的是**方法**：换一个过程（比如第 2 章的插入排序），六张牌和六千张牌只是时间差别，不是可行与不可行的差别。',
        '这就是 1.1 真正想说的事：**答案的多少与对错，取决于你规定的过程**。同一个「排序问题」，配一个正确的过程就是解，配一个错误的过程可能给你一个看着很像、其实没排好的结果 —— 而且它照样会停机，照样一张卡片都不丢。',
        '所以这一关要练三个判断：一个过程是不是**良定义**的（换个人照着做，结果一样吗）；它是不是对**每一个**实例都成立（而不是恰好这几个数字行）；以及「快」凭什么算一种技术优点。',
      ],
      interactive: {
        text: '先别急着看下面。拿这六个数字自己试 30 秒：你能不能想出一个「一定排得对」的做法，并且说清为什么它一定对？—— 说不清很正常，这正是第 2 章要解决的东西。这一关只要求你把「什么叫排对了」写清楚。',
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
          kind: 'body', page: 5,
          en: 'Informally, an algorithm is any well-defined computational procedure that takes some value, or set of values, as input and produces some value, or set of values, as output in a finite amount of time. An algorithm is thus a sequence of computational steps that transform the input into the output.',
          zh: '★ 定义里三个词是分量的：**well-defined**（每一步都精确到人或机器不会有第二种理解）、**input → output**（它是一个映射，不是「一套心得」）、**finite amount of time**（必须停机）。注意原书说 informally —— 这一版本刻意不给形式化定义，因为「什么是有效过程」属于可计算性理论，本书假定它成立。',
        },
        {
          kind: 'body', page: 5,
          en: 'You can also view an algorithm as a tool for solving a well-specified computational problem. The statement of the problem specifies in general terms the desired input/output relationship for problem instances, typically of arbitrarily large size.',
          zh: '★ 这里把「问题」和「算法」拆成两层：问题陈述给的是**输入/输出的关系**，而且明说实例「通常可以任意大」。这半句是后面所有复杂度分析的根 —— 正因为规模无界，我们才谈 $n$ 的函数，而不是谈「我这台机器上跑了 3 秒」。',
        },
        {
          kind: 'body', page: 5,
          en: 'Thus, given the input sequence ⟨31,41,59,26,41,58⟩, a correct sorting algorithm returns as output the sequence ⟨26,31,41,41,58,59⟩. Such an input sequence is called an instance of the sorting problem. In general, an instance of a problem 1 consists of the input (satisfying whatever constraints are imposed in the problem statement) needed to compute a solution to the problem.',
          zh: '★★ 全书第一个具体实例，请记住这串数字：阶段 5 的动画、阶段 6 的 C 程序、闯关区 1.1-1 都用它。注意「instance（实例）」是术语，指**一次具体的输入**，不是「例子」的随口说法 —— 正确性要求对**每个实例**成立，这个量词后面要反复用到。',
        },
        {
          kind: 'body', page: 6,
          en: 'An algorithm for a computational problem is correct if, for every problem in- stance provided as input, it halts—finishes its computing in finite time—and out- puts the correct solution to the problem instance. A correct algorithm solves the given computational problem. An incorrect algorithm might not halt at all on some input instances, or it might halt with an incorrect answer. Contrary to what you might expect, incorrect algorithms can sometimes be useful, if you can control their error rate. We’ll see an example of an algorithm with a controllable error rate in Chapter 31 when we study algorithms for finding large prime numbers. Ordinarily, however, we’ll concern ourselves only with correct algorithms.',
          zh: '★★ 本关最重要的一段。正确 = **停机** + **答案对** + **对每个实例都如此**，三条缺一不可。原书还顺手把「错误算法」分成两种失败：根本不停机，或者停机但答错。阶段 6 的 C 程序演的是第二种：一个单趟相邻交换的过程，元素一个不丢、也停了机，可答案错 —— 这种失败最阴，因为它看起来像成功。末尾那句「错误算法若能把错误率控住也有用」不是客套，第 31 章的素数判定就靠它。',
        },
        {
          kind: 'body', page: 6,
          en: 'An algorithm can be specified in English, as a computer program, or even as a hardware design. The only requirement is that the specification must provide a precise description of the computational procedure to be followed.',
          zh: '★ 这一句解释了本书为什么敢用自然语言 + 伪代码而不是某种编程语言：**规定只有一条 —— 描述必须精确**。后面你会看到同一件事的三种写法：书上的伪代码、本站的 JS 生成器（驱动动画）、本站的 C 程序（真跑并断言）。三者必须一致，这也是本站逐字节比对它们的原因。',
        },
        {
          kind: 'body', page: 8,
          en: '1. They have many candidate solutions, the overwhelming majority of which do not solve the problem at hand. Finding one that does, or one that is "best," without explicitly examining each possible solution, can present quite a challenge.',
          zh: '★★ 上面那个「720 个排列里只有 2 个有序」就是这条的定量版。原书把有趣算法问题的共性归成两条，这是第一条：**候选解海量，绝大多数没用**。算法的价值就在于不逐一检查也能找到那个（或足够好的那个）。第二条是「有实际应用」，见下一段。',
        },
        {
          kind: 'body', page: 9,
          en: 'This book also presents several data structures. A data structure is a way to store and organize data in order to facilitate access and modifications. Using the appropriate data structure or structures is an important part of algorithm design. No single data structure works well for all purposes, and so you should know the strengths and limitations of several of them.',
          zh: '★ 算法与数据结构是同一件事的两面：过程决定你要什么样的存取，存取方式反过来决定过程能多快。注意「没有一种数据结构适合所有目的」—— 这句话是第 10–19 章存在的理由，也是 1.1-3 那道题要你亲手体会的。',
        },
        {
          kind: 'body', page: 11,
          en: 'For many important real-world examples, however, the input actually arrives over time, and the algorithm must decide how to proceed without knowing what data will arrive in the future.',
          zh: '★ 全书的默认假设是「输入一开始就全在手上」，这一句把例外挑了出来：输入随时间到达，你还得当场决定。这类算法叫 **online algorithm**，第 27 章专讲。它和后面「多核」（p.10）、「NP 完全」（p.9）一起，构成 1.1 末尾对「本书还管这些」的预告。',
        },
      ],
      terms: [
        { en: 'algorithm', zh: '算法（良定义的计算过程）', page: 5 },
        { en: 'instance', zh: '实例（一次具体的输入）', page: 5 },
        { en: 'correct', zh: '正确（对每个实例都停机且答对）', page: 6 },
        { en: 'data structure', zh: '数据结构', page: 9 },
        { en: 'NP-complete', zh: 'NP 完全（没人找到高效算法，也没人证明不存在）', page: 9 },
        { en: 'traveling-salesperson problem', zh: '旅行商问题', page: 10 },
        { en: 'online algorithm', zh: '在线算法（输入随时间到达）', page: 11 },
      ],
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    {
      type: 'pseudocode',
      title: '本节在原书里没有伪代码框',
      algo: null,
      signature: '',
      page: 5,
      lines: [],
      vars: [],
      note: '★ 1.1 只给定义和例子，全书第一个伪代码框在 2.1（INSERTION-SORT）。这里不放伪代码是有意的：本关的「过程」由阶段 5 的动画与阶段 6 的 C 程序承担 —— 一个正确、一个错误，跑在同一串数字上，正好把「良定义」这件事演出来。',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着一个正确的过程把这串数字排好',
      viz: 'array',
      algorithm: 'insertion-sort',
      pseudocodeRef: null,
      input: { array: [31, 41, 59, 26, 41, 58] },
      invariants: [
        { label: '屏幕上出现的永远是原来那 6 个数字，不多不少（输出必须是输入的一个排列）' },
      ],
      presets: [
        { name: '原书 1.1 的实例 ⟨31,41,59,26,41,58⟩', array: [31, 41, 59, 26, 41, 58] },
        { name: '已经有序（最好情况）', array: [26, 31, 41, 41, 58, 59] },
        { name: '完全逆序（最坏情况）', array: [59, 58, 41, 41, 31, 26] },
        { name: '全部相同（退化实例）', array: [41, 41, 41, 41, 41, 41] },
      ],
      tasks: [
        '选「原书 1.1 的实例」，一路单步走到结束，把最终数组和阶段 3 引文里的 ⟨26,31,41,41,58,59⟩ 对一遍 —— 一模一样，这就是「正确」的含义。',
        '中途随便停在哪一步，数一数屏幕上的六个数：还是原来那六个吗？「输出是输入的排列」是排序问题定义里最硬的一条，动画每一步都必须守住它。',
        '换成「全部相同」再走一遍。一个只在一堆不同数字上成立的「算法」不算正确 —— 1.1 的措辞是 for every problem instance。',
      ],
      note: '★ 这里跑的是第 2 章才正式讲的插入排序，本关借它只为演示「一个良定义的过程长什么样」。不要在这里关心它多快 —— 那要等 2.2 节。',
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '一份正确、一份错误：把「正确性」变成能跑的断言',
      intro: '1.1 的定义是三条：对**每个**实例、**停机**、**答案对**。这份 C 程序三段各测一条：part 1 用插入排序在原书实例上产出书上那串输出；part 2 用「单趟相邻交换」演另一种失败 —— 它停机、元素一个不丢，可答案错；part 3 把「候选解海量」数出来（720 个排列里只有 2 个有序）。对照时只看一件事：**书上每个下标减 1**。',
      pseudocodeRef: null,
      c: {
        file: 'sorting_and_correctness.c',
        code: String.raw`/*
 * sorting_and_correctness.c — CLRS 1.1：同一个问题，一个正确算法与一个错误算法
 *
 * 1.1 给的定义只有两句话：算法必须对**每一个**实例停机并输出正确的解；
 * 错误算法「可能根本不停机，或者停机时给出错的答案」。
 * 本程序把这两句话变成可执行的断言：
 *   part 1  正确算法（插入排序）在原书 1.1 的实例上产出书里给的那串输出；
 *   part 2  一个「看起来很像」的错误算法（单趟相邻交换）在同一实例上失败；
 *   part 3  把「候选解有多少、其中能用的有几个」数出来 —— 这就是 1.1 说的
 *           「绝大多数候选解并不解决问题」。
 * 关键数字一律 printf 出来，不靠断言去兜没想到的情形（关卡编写手册 坑 19）。
 */
#include <stdio.h>

#define N 6

static int eq(const int *a, const int *b, int n) {
  for (int i = 0; i < n; i++) {
    if (a[i] != b[i]) return 0;
  }
  return 1;
}

static int is_sorted(const int *a, int n) {
  for (int i = 1; i < n; i++) {
    if (a[i - 1] > a[i]) return 0;
  }
  return 1;
}

/* a 是否还是 src 的那些元素（允许重复值：逐个配对标记） */
static int is_permutation(int *a, const int *src, int n) {
  int used[N];
  for (int i = 0; i < n; i++) used[i] = 0;
  for (int i = 0; i < n; i++) {
    int found = 0;
    for (int j = 0; j < n; j++) {
      if (!used[j] && a[i] == src[j]) { used[j] = 1; found = 1; break; }
    }
    if (!found) return 0;
  }
  return 1;
}

static int inversions(const int *a, int n) {
  int c = 0;
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (a[i] > a[j]) c++;
    }
  }
  return c;
}

static void show(const char *tag, const int *a, int n) {
  printf("%s", tag);
  for (int i = 0; i < n; i++) {
    printf(" %d", a[i]);
    if (i + 1 < n) printf(",");
  }
  printf("\n");
}

/* 正确算法：插入排序。伪代码下标 1 基，C 数组 0 基 —— 全部减 1 */
static void insertion_sort(int *a, int n) {
  for (int i = 1; i < n; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}

/* 错误算法：从左到右做一趟相邻交换。它只处理「逆序对互不相干」的情形 */
static void one_pass_swap(int *a, int n) {
  for (int i = 0; i + 1 < n; i++) {
    if (a[i] > a[i + 1]) {
      int t = a[i];
      a[i] = a[i + 1];
      a[i + 1] = t;
    }
  }
}

/* ---- part 3：穷举 N! 个排列，数有几个真的有序 ---- */
static int perm_total;
static int perm_sorted;
static int perm_used[N];
static int perm_cur[N];

static void permute(const int *src, int n, int depth) {
  if (depth == n) {
    perm_total++;
    if (is_sorted(perm_cur, n)) perm_sorted++;
    return;
  }
  for (int i = 0; i < n; i++) {
    if (perm_used[i]) continue;
    perm_used[i] = 1;
    perm_cur[depth] = src[i];
    permute(src, n, depth + 1);
    perm_used[i] = 0;
  }
}

static unsigned long long factorial(int n) {
  unsigned long long f = 1;
  for (int i = 2; i <= n; i++) f *= (unsigned long long)i;
  return f;
}

int main(void) {
  const int input[N] = {31, 41, 59, 26, 41, 58};  /* 原书 1.1 的实例 */
  const int want[N] = {26, 31, 41, 41, 58, 59};   /* 原书给的正确输出 */
  int a[N];
  int b[N];
  int i;

  for (i = 0; i < N; i++) { a[i] = input[i]; b[i] = input[i]; }

  printf("part 1  正确算法（插入排序）在原书实例上\n");
  show("  输入    :", input, N);
  show("  期望    :", want, N);
  printf("  逆序对  : %d\n", inversions(input, N));
  insertion_sort(a, N);
  show("  实际    :", a, N);
  printf("  排序后逆序对: %d\n", inversions(a, N));
  if (!eq(a, want, N)) {
    printf("FAIL part 1 正确算法没产出书上那一串\n");
    return 1;
  }
  if (!is_permutation(a, input, N)) {
    printf("FAIL part 1 输出已经不是输入的排列\n");
    return 1;
  }
  printf("  OK 停机、输出是原数组的重排、且与书上逐位相同\n");

  printf("\npart 2  错误算法（单趟相邻交换）在同一个实例上\n");
  one_pass_swap(b, N);
  show("  实际    :", b, N);
  printf("  排序后逆序对: %d（应为 0）\n", inversions(b, N));
  printf("  仍是原数组的重排: %s\n", is_permutation(b, input, N) ? "是" : "否");
  printf("  有序吗: %s\n", is_sorted(b, N) ? "是" : "否");
  if (is_sorted(b, N)) {
    printf("FAIL part 2 这个算法本该是错的，却在原书实例上排对了\n");
    return 1;
  }
  if (!is_permutation(b, input, N)) {
    printf("FAIL part 2 错误算法连元素都不该弄丢\n");
    return 1;
  }
  printf("  OK 它停机了、元素一个不少，但答案错 —— 这正是 1.1 说的第二种失败\n");

  printf("\npart 3  候选解有多少，其中能用的有几个\n");
  permute(input, N, 0);
  printf("  穷举排列数: %d（= %llu = %d!）\n", perm_total,
         factorial(N), N);
  printf("  其中有序的: %d\n", perm_sorted);
  /* 实测是 2 而不是 1：实例里有两个 41，同一串有序结果被两个下标排列各产出一次。
     这正是「按位置穷举」与「按结果计数」的区别 —— 数字先跑出来才看得见。 */
  if (perm_total != (int)factorial(N) || perm_sorted != 2) {
    printf("FAIL part 3 计数与预期不符\n");
    return 1;
  }
  printf("  → %d 个候选解里只有 %d 个是答案（两个 41 可互换，故同一串结果被数了两次）\n",
         perm_total, perm_sorted);
  printf("  n! 的增长：");
  for (i = 5; i <= 20; i += 5) printf("%d!=%llu  ", i, factorial(i));
  printf("\n");
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
      title: '「快」为什么算一种技术优点',
      intro: '1.1 只给了一句效率的定义，没有算任何算法的运行时间。这里要做的是一件更基础的事：把「同一个问题、不同过程、代价差多少个数量级」这笔账立起来，后面每一关的复杂度分析都挂在这句话上。',
      claims: [
        {
          expr: 'T(n)',
          when: '原书 p.9：效率的**通常**度量就是 speed —— 算法产出结果要花多长时间，记作 $T(n)$。注意是 usual 而不是唯一，1.1-2 要你想出别的度量',
          page: 9, source: 'book',
        },
        {
          expr: 'n!',
          when: '候选解的数量级。原书 p.8 的零件清单问题有 $n!$ 种可能次序，「阶乘比任何指数函数还快」，所以不能逐个生成再验证',
          page: 8, source: 'book',
        },
        {
          expr: '6! = 720,\\ 10! = 3628800,\\ 20! \\approx 2.43 \\times 10^{18}',
          when: '本站 C 程序 part 3 实测打出的数字（不是书上的），用来把「海量候选解」变成可感知的量',
          page: 8, source: 'instructor',
        },
        {
          expr: '\\text{NP-complete}',
          when: '原书 p.9 给的三条理由之一：没人找到高效算法，也没人证明它不存在。这一条是第 34 章的入口，本关只需要知道「有些问题我们就是不知道有没有快办法」',
          page: 9, source: 'book',
        },
      ],
      tables: [
        {
          caption: '1.1 举的六个例子分别落到本书哪一章（原书 p.6–11 的指引）',
          rows: [
            ['排序', '第 2、3、6–8 章', true],
            ['基因组 / DNA 序列比对', '第 14 章（动态规划）', true],
            ['互联网路由与检索', '第 22、11、32 章', true],
            ['电子商务的加密与签名', '第 31 章（数论算法）', true],
            ['资源分配（线性规划）', '第 29 章', true],
            ['离散傅里叶变换 / FFT', '第 30 章', true],
          ],
        },
      ],
      chart: {
        xMax: 16,
        caption: 'n! 与 2ⁿ、n lg n 同框：阶乘最终碾压一切指数',
        series: [
          { name: 'n lg n', color: '--viz-done', expr: 'n * Math.log2(n)' },
          { name: '2^n', color: '--viz-compare', expr: 'Math.pow(2, n)' },
          { name: 'n!（斯特林近似 $n^n e^{-n}$）', color: '--viz-active', expr: 'Math.exp(n * Math.log(n) - n)' },
        ],
      },
      derivations: [
        {
          kind: 'line',
          title: '为什么「720 个里只有 2 个有序」而不是「只有 1 个」',
          steps: [
            {
              zh: '穷举的是**下标的排列**：6 个位置放 6 张卡片，共 $6! = 720$ 种放法（C 程序实测就是这个数）。',
            },
            {
              zh: '实例里有两个 41。把这两张 41 互换位置，得到的**数组**完全相同，但在「按位置穷举」的口径下算两种放法 —— 所以有序的那一串被数了两次。',
            },
            {
              zh: '结论：$720$ 个候选解里有 2 个产出正确答案。若按**结果**而不是按位置计数，则是 1 个。这个差别在第 C 章讲排列计数时还会再遇到一次。',
            },
          ],
        },
      ],
      note: '★ 本关没有任何「运行时间为多少」的结论 —— 一个算法都还没学。上面这几条只回答一件事：为什么「过程不同，代价差若干个数量级」值得当成一门技术来研究。这正是下一关 1.2 的标题。',
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    {
      type: 'prove',
      title: '把「正确」拆成三条可检查的性质',
      statement: 'An algorithm for a computational problem is correct if, for every problem in- stance provided as input, it halts—finishes its computing in finite time—and out- puts the correct solution to the problem instance.',
      page: 6,
      intro: '★ 这一关没有定理要证，但有一句定义值得逐字拆开 —— 因为全书后面每次说「这个算法是正确的」，用的都是这三条。下面三步对应定义里的三个成分：量词范围、停机、答案对。',
      steps: [
        {
          title: '第一步 · 量词：对每一个实例',
          en: 'for every problem in- stance provided as input',
          page: 6,
          body: [
            '这是最容易漏掉的一条。在六个数字上排对了，不叫正确；在「已经有序」「完全逆序」「全部相同」这些边界上也排对，才算。阶段 5 的四组预设就是按这个标准挑的。',
            '写代码时的对应物是：任何「在我的样例上没问题」的断言都不算证据。本站的 C 程序因此把断言写成对具体数组的逐位比较，而不是打印出来肉眼看。',
          ],
        },
        {
          title: '第二步 · 停机：有限时间内算完',
          en: 'it halts—finishes its computing in finite time',
          page: 6,
          body: [
            '原书把「有限时间」写进定义，是为了排除那种「越想越深、永远不给答案」的过程。注意它在这里只要求**会停**，不要求停得快 —— 快慢是阶段 7 与第 2、3 章的事。',
            '定义里那句 in a finite amount of time 在 1.1 开头出现过一次（算法定义本身），这里再强调一遍，因为下一句就要谈不满足它的后果。',
          ],
        },
        {
          title: '第三步 · 答案对：输出满足问题陈述的关系',
          en: 'out- puts the correct solution to the problem instance. A correct algorithm solves the given computational problem.',
          page: 6,
          body: [
            '「对」是对**问题陈述**而言的：排序问题要求输出是输入的一个排列且单调递增。两条都得满足 —— 只满足「有序」而丢了元素（比如把两个 41 排成一个）也是错。',
            '★ 原书紧接着给出反面：An incorrect algorithm might not halt at all on some input instances, or it might halt with an incorrect answer. 两种失败里，第二种才危险。本站 C 程序的 part 2 就是它：单趟相邻交换在 ⟨31,41,59,26,41,58⟩ 上停机、元素一个不丢，输出却是 ⟨31,41,26,41,58,59⟩，还剩 2 对逆序 —— 跑起来「看着挺像回事」，答案是错的。',
          ],
        },
      ],
      conclusion: '★ 三条合起来才是「正确」：对所有实例、会停机、输出满足问题陈述。原书最后还留了一句反直觉的话 —— 错误算法若能控制错误率也有用（第 31 章的素数判定就是一例），但本书默认只谈正确算法。',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'judge',
          q: '一个过程在输入上永远停机、元素一个不丢，但偶尔给出没排好的数组 —— 按 1.1 的定义它就不是正确的算法。',
          answer: true,
          why: '正确要求三条同时成立：对每个实例、停机、**输出正确解**。阶段 6 的 part 2 就是这个情形：停了机、也没丢元素，可还剩 2 对逆序，所以不正确。',
        },
        {
          kind: 'judge',
          q: '1.1 说算法必须「在有限时间内」给出输出，因此它也要求算法必须足够快。',
          answer: false,
          why: '「会停」和「停得快」是两件事。定义只要求有限时间（可计算性），快慢是效率问题，属于阶段 7 与第 2、3 章。原书把这两条分得很清。',
        },
        {
          kind: 'single',
          q: '按本站 C 程序 part 3 的实测：对实例 ⟨31,41,59,26,41,58⟩ 穷举全部下标排列，其中产出有序数组的有几种？',
          options: ['1 种', '2 种', '6 种', '720 种'],
          answer: 1,
          why: '是 **2 种**，不是 1 种：$6! = 720$ 个排列里，有序的那一串被数了两次，因为实例里有两个 41，互换它们的位置得到同一个数组但算不同排列。这正是「先跑数字再下结论」的价值 —— 想当然会答 1。',
        },
        {
          kind: 'single',
          q: '下面哪一种**不是** 1.1 里给出的「算法可以是」的形式？',
          options: ['用英语写的描述，只要精确到没有歧义', '计算机程序', '硬件设计', '某个具体编程语言的库函数'],
          answer: 3,
          why: '原话是 An algorithm can be specified in English, as a computer program, or even as a hardware design，唯一的条件是描述必须精确。它刻意不绑定任何语言或库 —— 这也是本书能用伪代码的理由。',
        },
        {
          kind: 'single',
          q: '原书 p.8 把「有趣的算法问题」的第一条共性说成什么？',
          options: [
            '答案无法验证',
            '候选解极多，绝大多数不解决问题',
            '必须用上递归，否则根本写不出对应的算法',
            '只能在多核机器上加速',
          ],
          answer: 1,
          why: '就是阶段 3 引的那条：They have many candidate solutions, the overwhelming majority of which do not solve the problem at hand。720 个排列里 2 个有用，是它的定量版。',
        },
        {
          kind: 'judge',
          q: '按 1.1 末尾的说法，「输入一开始就全部在手边」这个假设适用于所有重要的现实问题。',
          answer: false,
          why: '恰恰相反：原书说对许多重要问题，输入是随时间到达的，算法必须在不知道未来的情况下当场决定 —— 这类叫 online algorithm，第 27 章讲。数据中心调度、互联网路由、急诊分诊都是例子。',
        },
        {
          kind: 'single',
          q: '「没有一种数据结构适合所有目的」这句话的含义是？',
          options: [
            '所以应该尽量不用数据结构：结构越简单越不容易出错，效率损失交给更快的机器补回来',
            '所以要掌握好几种，知道各自 strengths 与 limitations',
            '所以本书只讲一种最通用的',
            '所以数据结构比算法更重要：把数据存对了，算法怎么写都不会差到哪里去',
          ],
          answer: 1,
          why: '原话是 you should know the strengths and limitations of several of them。选对表示是算法设计的一部分，这也是第 10–19 章存在的原因，以及 1.1-3 要你做的事。',
        },
        {
          kind: 'simulate',
          q: '手工执行「单趟相邻交换」：从左到右，遇到 a[i] > a[i+1] 就交换，每个位置只看一次。对 ⟨5, 2, 4, 1⟩ 的结果是什么？（用空格分隔）',
          expect: [2, 4, 1, 5],
          placeholder: '例如：2 4 1 5',
          why: '逐对看：(5,2) 交换 → ⟨2,5,4,1⟩；(5,4) 交换 → ⟨2,4,5,1⟩；(5,1) 交换 → ⟨2,4,1,5⟩。它把最大值一路推到了末尾，但前面仍然乱着（还剩 2 对逆序）。一趟不够 —— 这就是阶段 6 part 2 的机制，也是为什么「看起来像算法」不等于正确。',
        },
      ],
      bookExercises: [
        {
          id: '1.1-1', page: 11, star: 0,
          statement: 'Describe your own real-world example that requires sorting. Describe one that requires finding the shortest distance between two points.',
          hint: '两问要各给一个**具体场景**，别停在「排序很有用」这一层。排序那问的好例子有个共同点：数据本身是别的对象的属性（成绩、时间戳、文件大小），排完还得把附属信息一起搬 —— 这正是 1.1 说的 keys 与 satellite data。最短距离那问，挑一个「绕路代价真实存在」的场景（导航、网络跳数、管道铺设），并说清谁是点、谁是边。',
        },
        {
          id: '1.1-2', page: 11, star: 0,
          statement: 'Other than speed, what other measures of efficiency might you need to consider in a real-world setting?',
          hint: '回到阶段 7 那条引文：原书说的是 **usual** measure，不是唯一 measure。挨个想这些资源：内存与磁盘占用（本书第 6 章讲过 in-place 的价值）、能耗（手机与数据中心都在乎）、网络带宽、代码复杂度与可维护性、以及钱。加分项：找一个「快但不可接受」的例子 —— 比如用十倍的内存换两倍的速度的场景。',
        },
        {
          id: '1.1-3', page: 11, star: 0,
          statement: 'Select a data structure that you have seen, and discuss its strengths and limitations.',
          hint: '挑一个你真用过的（数组、链表、栈、队列、哈希表、二叉搜索树都行），然后**按一对一对写**：什么操作它快、什么操作它慢、什么情况下它会退化。别只写优点 —— 阶段 3 那句引文要的是 strengths **and** limitations。有个抓手：先说它「擅长的那一两个操作」，再说「为了保住这两个操作，它在别的操作上付了什么代价」。',
        },
        {
          id: '1.1-4', page: 11, star: 0,
          statement: 'How are the shortest-path and traveling-salesperson problems given above similar? How are they different?',
          hint: '相似之处从**问题陈述的形式**找：两者的输入是不是一张带权图？两者的输出是不是一串边？不同之处从**要求覆盖多少点**找：一个只要两点之间的路，另一个要求每个地址都到、还得回到起点。想清这一点，你就能解释为什么前者有高效算法（第 22 章）而后者是 NP 完全的（第 34 章）原书 p.10 讲 NP 完全问题时有一句正好说的是这件事："a small change to the problem statement can cause a big change to the efficiency of the best known algorithm"（本关阶段 3 没收录这句，要回原书 p.10 看）。',
        },
        {
          id: '1.1-5', page: 11, star: 0,
          statement: 'Suggest a real-world problem in which only the best solution will do. Then come up with one in which "approximately" the best solution is good enough.',
          hint: '判据是**代价函数**：近似解带来的额外成本会不会要命。第一问挑那种「差一点都不行」的（例如手术路径、航天器轨道、密码学里的精确整数分解）。第二问挑「差 5% 无所谓，但要得快」的 —— 原书 p.10 已经给了一个：旅行商问题的近似算法（第 35 章）。加分项：说清你为什么能容忍那个误差（是省下的时间更值钱，还是根本不知道最优解长什么样）。',
        },
        {
          id: '1.1-6', page: 11, star: 0,
          statement: 'Describe a real-world problem in which sometimes the entire input is available before you need to solve the problem, but other times the input is not entirely available in advance and arrives over time.',
          hint: '同一个问题的两种情形，关键是**输入到达的方式**变了。抓手是原书 p.11 给的三个例子（数据中心作业调度、互联网流量路由、急诊分诊）：把「提前排好的一周值班表」和「半夜陆续送进来的病人」放在一起比 —— 同一套决策规则，前一种可以全局优化，后一种必须当场拍板且无法回头。写的时候说清：哪种情况下你能等到信息齐全？不能等的话，代价是什么？',
        },
      ],
    },
  ],
};
