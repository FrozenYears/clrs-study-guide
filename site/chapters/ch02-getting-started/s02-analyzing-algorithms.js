/* =============================================================================
 * 第 2 章 · 2.2 分析算法（Analyzing algorithms）—— 从"能跑"到"多快"
 *
 * 原文锚点：印刷页 25–34（pdf_index 46–55）
 * 本关是 2.1 与 2.3 之间的桥：2.1 让你看到算法怎么工作，2.3 要比较两个算法谁快，
 * 而"快慢"这门语言正是在 2.2 定义出来的。全书后面的复杂度分析都以本关为起点。
 *
 * 排版与记法约定（原书第 4 版，本关严格照抄）：
 *   · 子数组用 A[p : q]（冒号），不是 A[p : q]
 *   · 伪代码用 = 表示赋值（第 4 版已不再用 ←）
 *   · 注释用 //
 *   · 序列用 ⟨5, 2, 4, 6, 1, 3⟩
 *   · 式 (2.1) 是最好情况，式 (2.2) 是最坏情况，附录式 (A.2) 是 Σ 求和公式
 *
 * 所有 en 字段是原书英文原文；所有 zh 字段是本站讲解，以 data-kind="note" 呈现。
 * 凡本站补充的推导或记号（例如把 n(n+1)/4 拿来画平均情况曲线）都显式标注。
 * ========================================================================== */

/* C 实现（与 c/count_ops.c 完全一致，可直接编译运行）。
 * 用 String.raw 保留反斜杠与缩进，避免转义字符被解释。 */
const C_IMPL = String.raw`/*
 * count_ops.c — 计数版插入排序（CLRS 第 4 版 2.2 节「分析算法」的 C 实现）
 *
 * 2.2 节不做新算法，做的是"数次数"。这份实现把书里的两个量真的数出来：
 *
 *   t_i   = 第 5 行 while 的判断，在 i 取某个值时被执行了多少次
 *   Σt_i  = 上面那个量对 i = 2 .. n 的求和（本文件记作 t5）
 *   搬移   = 第 6 行 A[j + 1] = A[j] 的执行次数，等于 Σ(t_i − 1)
 *
 * 注意搬移只数第 6 行。第 8 行的落位 A[j + 1] = key 每轮执行一次、
 * 一共 n − 1 次，它是"把 key 放回去"而不是"元素移位"，本文件不计入搬移 ——
 * 页面上的计数器也按这个口径分开显示（Σt_i 与"触发搬移"是两个量）。
 *
 * 下标约定：书上从 1 开始（A[1 .. n]），本文件从 0 开始。
 *   书中 A[i] ↔ 本文件 a[i - 1]，书上所有下标减 1 即可。
 *   书上第 5 行 while j > 0 and A[j] > key
 *              ↔ 本文件 while (j >= 0 && a[j] > key)
 *   注意 j >= 0 而不是 j > 0 —— 这是这个算法最常见的 bug。
 *
 * 本文件刻意让 while 的条件写法与书上一字不差，只在进入循环前和每轮循环
 * 体结束时各 +1 一次，从而精确等于"条件被判断的次数"：
 *   · 每轮循环体执行后回到循环头，必然再判断一次；
 *   · 最后一次判断（条件为假、循环退出）同样是"一次判断"，必须计入 ——
 *     这正是 t_i 定义里最容易少算的那一次。
 *
 * 编译（本机无 gcc，未实测）：
 *   gcc -std=c99 -Wall -Wextra -o count_ops count_ops.c && ./count_ops
 */
#include <stdio.h>
#include <assert.h>

/* 插入排序，顺手统计两个量。返回排序后的 Σt_i。 */
static long insertion_sort_counted(int a[], int n, long *moves_out)
{
    long t5 = 0;        /* Σ t_i：第 5 行 while 条件被判断的总次数 */
    long moves = 0;     /* 第 6 行被执行的总次数 */

    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;

        t5++;                                   /* 进入循环前的第一次判断 */
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            moves++;
            j--;
            t5++;                               /* 回到循环头，再判断一次 */
        }
        a[j + 1] = key;
    }

    *moves_out = moves;
    return t5;
}

static void fill_descending(int a[], int n)
{
    for (int i = 0; i < n; i++) {
        a[i] = n - i;
    }
}

static void check_correct(const char *name, int a[], int n, const int expected[])
{
    long moves = 0;
    (void)insertion_sort_counted(a, n, &moves);
    for (int i = 0; i < n; i++) {
        assert(a[i] == expected[i]);
    }
    printf("ok: %s\n", name);
}

int main(void)
{
    /* ---- 1. 排序结果仍然正确（与插入排序本身一致） ---- */
    {
        int a[] = {5, 2, 4, 6, 1, 3};
        int e[] = {1, 2, 3, 4, 5, 6};
        check_correct("sort fig2.2", a, 6, e);
    }
    {
        int a[] = {6, 5, 4, 3, 2, 1};
        int e[] = {1, 2, 3, 4, 5, 6};
        check_correct("sort reverse6", a, 6, e);
    }
    {
        int a[] = {2, 2, 1, 1, 3, 3};
        int e[] = {1, 1, 2, 2, 3, 3};
        check_correct("sort duplicates", a, 6, e);
    }
    {
        int a[] = {42};
        int e[] = {42};
        check_correct("sort single", a, 1, e);
    }

    /* ---- 2. 逐轮 t_i：原书 Figure 2.2 的数组 ⟨5, 2, 4, 6, 1, 3⟩ ---- */
    {
        int a[] = {5, 2, 4, 6, 1, 3};
        int n = 6;
        long t5 = 0, moves = 0;
        long ti[6] = {0};

        /* 逐轮手动展开，把 t_2 .. t_6 打出来，与正文表格逐格对照 */
        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;
            long c = 1;                      /* 进入循环前的第一次判断 */
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                moves++;
                j--;
                c++;
            }
            a[j + 1] = key;
            ti[i] = c;                       /* ti[1] 对应书中的 t_2 */
            t5 += c;
        }

        printf("\nfig2.2  <5,2,4,6,1,3> 逐轮 t_i：");
        for (int i = 1; i < n; i++) {
            printf(" t_%d=%ld", i + 1, ti[i]);
        }
        printf("\n           Σt_i = %ld（本站按第 29 页 t_i 的定义逐轮算出；原书未印这张表）\n", t5);
        printf("           搬移 = %ld = Σ(t_i − 1)\n", moves);
        assert(t5 == 14);
        assert(moves == 9);
    }

    /* ---- 3. 最好情况：输入已排序，t_i = 1，Σt_i = n − 1 ---- */
    for (int n = 1; n <= 8; n++) {
        int a[16];
        long moves = 0;
        for (int i = 0; i < n; i++) a[i] = i + 1;      /* 已排序 */
        long t5 = insertion_sort_counted(a, n, &moves);
        assert(t5 == (n >= 1 ? n - 1 : 0));            /* Σt_i = n − 1 */
        assert(moves == 0);
        printf("best  n=%d  Σt_i=%-3ld  搬移=%-3ld  （书上 (2.1) 式：n − 1 = %d）\n",
               n, t5, moves, n - 1);
    }

    /* ---- 4. 最坏情况：输入完全逆序，t_i = i，Σt_i = n(n+1)/2 − 1 ---- */
    for (int n = 1; n <= 8; n++) {
        int a[16];
        long moves = 0;
        fill_descending(a, n);
        long t5 = insertion_sort_counted(a, n, &moves);
        long expect_t5 = (long)n * (n + 1) / 2 - 1;    /* 附录 A 式 (A.2) */
        long expect_moves = (long)n * (n - 1) / 2;     /* Σ(t_i − 1) */
        assert(t5 == expect_t5);
        assert(moves == expect_moves);
        printf("worst n=%d  Σt_i=%-3ld  搬移=%-3ld  （书上 (2.2) 式的分子：%ld / %ld）\n",
               n, t5, moves, expect_t5, expect_moves);
    }

    /* ---- 5. 增长趋势：n 翻倍，Σt_i 约变四倍（二次函数） ---- */
    printf("\n最坏情况随 n 的增长（Σt_i = n(n+1)/2 − 1）：\n");
    for (int n = 100; n <= 1600; n *= 2) {
        int a[2048];
        long moves = 0;
        fill_descending(a, n);
        long t5 = insertion_sort_counted(a, n, &moves);
        long expect = (long)n * (n + 1) / 2 - 1;
        assert(t5 == expect);
        printf("  n=%-5d  Σt_i=%-9ld  n²/2≈%-9ld  比值 Σt_i/n² = %.4f\n",
               n, t5, (long)n * n / 2, (double)t5 / ((double)n * n));
    }

    printf("\nALL COUNT-OPS TESTS PASSED\n");
    return 0;
}
`;

/* 驱动页面动画的 JS 生成器节选（与 site/assets/algorithms/insertion-sort.js 一致）。
 * 本关阶段 5 的「可选」标签页会展示它，说明"同一份代码既是实现、又是动画数据源"。 */
const ENGINE_EXCERPT = String.raw`export function* insertionSort(A) {
  const a = A.slice();                 // 0 基工作副本（不动原数组）
  const n = a.length;
  const counts = { cmp: 0, move: 0, line5: 0 };

  for (let bi = 2; bi <= n; bi++) {        // bi = 书中 i（1 基）
    const key = a[bi - 1];
    let bj = bi - 1;                        // bj = 书中 j（1 基）

    // 第 5 行：while j > 0 and A[j] > key
    // ★ 忠于书中 2.2 的 tᵢ 定义：tᵢ = 「第 5 行被求值的次数」，含最后一次为假的那次。
    //   所以这里把条件显式拆成两步，先计数再判断，而不是写成 while (…)。
    //   （若写成 while (cond)，最后一次失败判断就落在循环外，会少数 n−1 次。）
    for (;;) {
      counts.line5++;
      if (!(bj > 0 && a[bj - 1] > key)) break;
      counts.cmp++;
      yield frame(5, { highlight: { compare: [bj, bi] } });   // 第 5 行被求值
      a[bj] = a[bj - 1];                                      // 第 6 行
      counts.move++;
      yield frame(6, { highlight: { move: [bj + 1] } });
      bj--;                                                   // 第 7 行
      yield frame(7, { pointers: { j: bj } });
    }
    a[bj] = key;                                              // 第 8 行
    counts.move++;
    yield frame(8, { highlight: { active: [bj + 1], sortedPrefix: bi } });
  }
}`;

export default {
  key: 's02',
  id: 'ch02/s02',
  chapter: 2,
  section: '2.2',
  title: '分析算法',
  shortTitle: '2.2 分析算法',
  titleEn: 'Analyzing algorithms',
  source: { printed: [25, 34], pdf: [46, 55] },
  prerequisites: [
    { label: '2.1 插入排序', url: '#/ch02/s01' },
  ],
  sourceNote:
    '本关对应原书 2.2 节（印刷页 25–34）。它在 2.1 与 2.3 之间架了一座桥：2.1 已经证明' +
    '插入排序是**对的**，但"多快"还没有语言来描述。2.2 先把这门语言造出来（RAM 模型、' +
    '语句代价 c_k、t_i、T(n)），再把它简化成一个能用来比较算法的记号（Θ），' +
    '最后指出一个贯穿全书的取舍：**常规分析只看最坏情况**。',

  stages: [
    /* ================= 阶段 0 · 位置感 ================= */
    {
      type: 'map',
      title: '这一关要解决什么问题',
      why:
        '2.1 结束的时候，你手里只有一个"对"的算法，却没有任何办法说它**快还是慢**。' +
        '现在把问题换一换：不问"这段代码在一台机器上跑了多少毫秒"，而问' +
        '"它做了多少次基本操作，这个次数怎么随输入规模增长"。' +
        '这门语言一旦建立，你就能在**不写一行代码**的情况下判断：' +
        '这段程序在数据量变大时会先撑不住。2.3 节正是靠它才敢说"归并排序优于插入排序"。',
      position:
        '第 2 章第 2 节（印刷页 25–34），夹在 2.1 插入排序与 2.3 设计算法之间。' +
        '它是全书分析部分的起点：你现在只在这里**非正式地**用 Θ 记号，' +
        '第 3 章会给出它的严格定义，第 4 章教你怎么解递归式（也就是 2.3 那张递归树的公式化版本）。',
      unlocks: [
        { label: '2.3 分治法与归并排序（本关的结论在那里被用上）', url: '#/ch02/s03' },
        { label: '第 3 章 渐进记号：Θ 的严格定义', url: '#/ch03/s01' },
        { label: '附录 A 求和（式 (A.2) 就在那里）', url: '#/appendix/a/s01' },
      ],
      mathKit: [
        {
          title: 'Σ 记号（本关用来数总次数）',
          body:
            '$\\sum_{i=2}^{n} t_i$ 读作：让 $i$ 从 2 一直取到 $n$，把每个 $t_i$ 加起来。' +
            '本关会反复出现三种：$\\sum_{i=2}^{n} 1 = n-1$、$\\sum_{i=2}^{n} i$、' +
            '$\\sum_{i=2}^{n}(i-1)$。它们没有新数学，只是"把一串东西加起来"的简写。',
        },
        {
          title: '式 (A.2)：从 1 加到 n 的闭式',
          body:
            '附录 A 的式 (A.2) 给出 $\\sum_{i=1}^{n} i = \\dfrac{n(n+1)}{2}$。' +
            '本关最坏情况的两个求和都靠它化简 —— 原书 p.31 是明写"by equation (A.2) on page 1141"的。' +
            '把 $n = 100$ 代进去验一下：$100 \\times 101 / 2 = 5050$，和高斯小时候算的一样。',
        },
        {
          title: 'Θ 的"非正式"读法（第 3 章才给严格定义）',
          body:
            '原书 p.33 的原话是：think of Θ-notation as saying "roughly proportional when n is large"。' +
            '也就是"当 n 很大时大致成正比"。所以 $\\Theta(n^2)$ = "大致正比于 $n^2$"。' +
            '**注意**：这只是本章的暂用读法，第 3 章会把 Θ 定义成一套严格的集合关系。',
        },
      ],
    },

    /* ================= 阶段 1 · 直觉入口 ================= */
    {
      type: 'intuition',
      title: '为什么不能直接掐秒表',
      scene: '你写了两版排序程序，想知道哪版快',
      body: [
        '最直觉的做法：跑一遍，看用时。书上 p.28 正是从这个想法写起的，然后立刻给你泼了一盆冷水 —— ' +
          '你测出来的那个数字，只说明了"插入排序**在你这台机器上、这个输入下、这份实现里、' +
          '这个编译器下、链的这几个库下、后台刚好还在跑这些任务的情况下**跑了多久"。' +
          '换台电脑、换个输入、甚至同一台机器再跑一遍，数字都可能不一样。',
        '所以书换了一个问题：**不测时间，数操作**。' +
          '不问"跑了几毫秒"，而问"执行了多少条指令、访问了多少次数据"。' +
          '这个量只取决于算法本身和输入的规模，与机器无关 —— 于是它就能用来比较算法了。',
        '但"数操作"需要一个前提：得先约定一台"标准机器"，规定好每条指令花多少时间，' +
          '否则连"一次操作"都定义不清。书上 p.26 约定的这台机器叫 **RAM 模型**' +
          '（random-access machine）：指令一条接一条执行、没有并发，每条指令与每次数据访问' +
          '都花**同样多**的常数时间。',
        '有了这台机器，本关的核心就只剩三个量，全部定义在 p.29 那一页之内：' +
          '**c_k**（第 k 行执行一次的代价，是个常数）、' +
          '**t_i**（第 5 行那一行被判断了几次）、' +
          '**T(n)**（总的运行时间 = 各行的「代价 × 次数」之和）。',
        '这里最反直觉、也最容易数错的是 t_i。' +
          '书上明确说：循环"正常退出"（因为循环头的判断为假）时，' +
          '**判断的次数比循环体多一次**。也就是说，那次"发现条件不成立、于是退出"的判断，' +
          '也算一次，必须计数。本关后面所有的表格与计数器都按这个口径来。',
      ],
      interactive: {
        text:
          '先做个预测：原书 Figure 2.2 用的数组是 $\\langle 5, 2, 4, 6, 1, 3 \\rangle$（n = 6）。' +
          '凭直觉猜一下 $\\sum_{i=2}^{6} t_i$ 大概是多少 —— 是 6 左右、15 左右，还是 30 左右？' +
          '把猜的数字记住，阶段 3 会给出精确答案，阶段 4 你可以亲手一步步数出来。',
      },
    },

    /* ================= 阶段 2 · 原文精读 ================= */
    {
      type: 'source',
      title: '书上是怎么说的',
      lead:
        '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。' +
        '原文一律照抄，不做任何改写。这一节的定义密度很高，是全书的分析基础，值得逐字读。',
      blocks: [
        {
          kind: 'remark',
          page: 25,
          en:
            'Analyzing an algorithm has come to mean predicting the resources that the ' +
            'algorithm requires. You might consider resources such as memory, communication ' +
            'bandwidth, or energy consumption. Most often, however, you’ll want to measure ' +
            'computational time.',
          zh:
            '先明确"分析算法"到底在分析什么：**资源**。内存、带宽、能耗都算资源，' +
            '但本书绝大多数时候只关心**计算时间**。所以本关讲的"分析"，' +
            '狭义上就是"预测运行时间"。',
        },
        {
          kind: 'definition',
          page: 26,
          en:
            'Before you can analyze an algorithm, you need a model of the technology that it ' +
            'runs on, including the resources of that technology and a way to express their ' +
            'costs. Most of this book assumes a generic one-processor, random-access machine ' +
            '(RAM) model of computation as the implementation technology, with the ' +
            'understanding that algorithms are implemented as computer programs. In the RAM ' +
            'model, instructions execute one after another, with no concurrent operations. ' +
            'The RAM model assumes that each instruction takes the same amount of time as any ' +
            'other instruction and that each data access—using the value of a variable or ' +
            'storing into a variable—takes the same amount of time as any other data access. ' +
            'In other words, in the RAM model each instruction or data access takes a constant ' +
            'amount of time—even indexing into an array.',
          zh:
            '★ 这是全书分析的**地基**：RAM 模型。三句话记住它：' +
            '① 指令一条接一条跑，没有并发；' +
            '② 每条指令花的时间**一样多**；' +
            '③ 每次数据访问（读变量、写变量、**数组下标取值**）花的时间也**一样多**。' +
            '第 ③ 条里"even indexing into an array"（连数组下标访问也算常数时间）特别值得留意 —— ' +
            '它有前提，书上在 p.26 的脚注 9 里补了：假设同一数组的每个元素占同样的字节数、' +
            '且存在连续内存里。你在 C 里刚好天天面对这件事，所以不难接受。',
        },
        {
          kind: 'remark',
          page: 27,
          en:
            'Yet we must be careful not to abuse the RAM model. For example, what if a RAM had ' +
            'an instruction that sorts? Then you could sort in just one step. Such a RAM would ' +
            'be unrealistic, since such instructions do not appear in real computers. Our ' +
            'guide, therefore, is how real computers are designed. The RAM model contains ' +
            'instructions commonly found in real computers: arithmetic (such as add, subtract, ' +
            'multiply, divide, remainder, floor, ceiling), data movement (load, store, copy), ' +
            'and control (conditional and unconditional branch, subroutine call and return).',
          zh:
            '这段话在划红线：**别滥用 RAM 模型**。书上举了一个很妙的例子 —— ' +
            '如果一台"机器"自带一条"排序"指令，那排序就是一步的事，O(1) 了，' +
            '但这种机器现实中不存在。所以判断标准是"**真实计算机有没有这条指令**"。' +
            'RAM 模型只收录真实机器常见的指令：算术（加减乘除、取余、向下取整、向上取整）、' +
            '数据搬运（读、写、复制）、控制（条件/无条件跳转、子程序调用与返回）。',
        },
        {
          kind: 'remark',
          page: 27,
          en:
            'The RAM model does not account for the memory hierarchy that is common in ' +
            'contemporary computers. It models neither caches nor virtual memory. … Moreover, ' +
            'RAM-model analyses are usually excellent predictors of performance on actual ' +
            'machines.',
          zh:
            '必须诚实地指出 RAM 模型**忽略**了什么：现代计算机的内存层次结构 —— 它不建缓存模型，' +
            '也不建虚拟内存模型。这在真实程序里有时会有明显影响（第 11.5 节和若干习题会讨论）。' +
            '但书上给了结论：RAM 模型的分析通常能非常准确地预测真实机器上的性能。' +
            '这也是本关后面所有推导能站得住的原因。',
        },
        {
          kind: 'definition',
          page: 28,
          en:
            'The best notion for input size depends on the problem being studied. For many ' +
            'problems, such as sorting or computing discrete Fourier transforms, the most ' +
            'natural measure is the number of items in the input—for example, the number n of ' +
            'items being sorted. For many other problems, such as multiplying two integers, ' +
            'the best measure of input size is the total number of bits needed to represent ' +
            'the input in ordinary binary notation.',
          zh:
            '**输入规模（input size）**不是固定的一个数，要看问题。' +
            '排序、DFT 这类问题用"元素的个数 n"；整数乘法这类问题用"表示输入需要多少比特"。' +
            '遇到图的时候（书上紧接着说）要用"顶点数 + 边数"两个数。' +
            '本关分析的插入排序属于前者，规模就是 n。',
        },
        {
          kind: 'definition',
          page: 29,
          en:
            'The running time of an algorithm on a particular input is the number of ' +
            'instructions and data accesses executed. How we account for these costs should be ' +
            'independent of any particular computer, but within the framework of the RAM ' +
            'model. For the moment, let us adopt the following view. A constant amount of time ' +
            'is required to execute each line of our pseudocode. One line might take more or ' +
            'less time than another line, but we’ll assume that each execution of the kth line ' +
            'takes c_k time, where c_k is a constant.',
          zh:
            '两个定义一起给出。' +
            '① **运行时间** = 执行的指令与数据访问的**次数**。注意是"次数"，不是"秒"。' +
            '② 每执行一次第 k 行伪代码，花的时间记作 **c_k**，是个常数；' +
            '不同行的 c_k 可以不同（比如除法通常比加法慢），但每行自己的 c_k 固定。' +
            '这正是 2.1 里那句话的精确版本 —— 当时说"每行花常数时间"，现在给这个常数起了名字。',
        },
        {
          kind: 'definition',
          page: 29,
          en:
            'For each i = 2, 3, …, n, let t_i denote the number of times the while loop test in ' +
            'line 5 is executed for that value of i. When a for or while loop exits in the ' +
            'usual way—because the test in the loop header comes up FALSE—the test is executed ' +
            'one time more than the loop body. Because comments are not executable statements, ' +
            'assume that they take no time.',
          zh:
            '★ 本关最重要的定义：**t_i**。它是"当 i 取某个值时，**第 5 行**（那条 while）' +
            '被**求值**了多少次"。三处细节全都埋在原文里，一个都不能漏：' +
            '① **求值的次数**不等于"循环体执行的次数" —— ' +
            '循环正常退出时（判断为假），判断次数比循环体多一次；' +
            '② 那次"为假、于是退出"的判断**也要算**，这是最容易少数的地方；' +
            '③ 注释不是可执行语句，**不花时间**（所以后面代价表里第 3 行的 cost 是 0，' +
            '但它的 times 仍是 n − 1 —— 它跟着循环走了那么多次）。',
        },
        {
          kind: 'definition',
          page: 29,
          en:
            'The running time of the algorithm is the sum of running times for each statement ' +
            'executed. A statement that takes c_k steps to execute and executes m times ' +
            'contributes c_k m to the total running time. We usually denote the running time of ' +
            'an algorithm on an input of size n by T(n).',
          zh:
            '把上面所有零件拼起来：**总时间 = Σ（每行的代价 × 每行的执行次数）**，' +
            '这个总量记作 **T(n)**。' +
            '这条规则看着平淡，但它是后面整张代价表的算法依据 —— ' +
            '阶段 3 里每一格都是"这一行的 c_k × 它跑了多少次"。' +
            '顺带记住：T 是 n 的函数，因为我们关心的是"规模变大时它会怎样"。',
        },
        {
          kind: 'remark',
          page: [31, 32],
          en:
            'For the remainder of this book, though, we’ll usually (but not always) ' +
            'concentrate on finding only the worst-case running time, that is, the longest ' +
            'running time for any input of size n. Why? Here are three reasons: ' +
            '• The worst-case running time of an algorithm gives an upper bound on the running ' +
            'time for any input. … • For some algorithms, the worst case occurs fairly often. … ' +
            '• The "average case" is often roughly as bad as the worst case.',
          zh:
            '这里埋了本书后续所有分析的一个**取舍**：以后一般只看最坏情况。' +
            '书上给了三条理由（阶段 7 会逐一展开）：最坏情况给出了**对任意输入的上界**、' +
            '最坏情况**经常真的会发生**、以及平均情况**往往和最坏情况差不多糟**。' +
            '注意原文里的 "usually (but not always)" —— 平均情况分析后面还会回来（第 5 章等）。',
        },
        {
          kind: 'remark',
          page: 33,
          en:
            'Let’s now make one more simplifying abstraction: it is the rate of growth, or ' +
            'order of growth, of the running time that really interests us. We therefore ' +
            'consider only the leading term of a formula (e.g., an²), since the lower-order ' +
            'terms are relatively insignificant for large values of n. We also ignore the ' +
            'leading term’s constant coefficient, since constant factors are less significant ' +
            'than the rate of growth in determining computational efficiency for large inputs.',
          zh:
            '★ 全书最关键的一次"简化"。' +
            'T(n) 那个带 c₁…c₈ 的公式虽然精确，却没法拿来比较两个算法。' +
            '所以做两步丢弃：**① 只保留最高阶项**（大 n 时低阶项不重要）；' +
            '**② 连最高阶项的系数也丢掉**（系数不影响增长快慢）。' +
            '对插入排序的最坏情况来说，丢了这两样之后只剩下 $n^2$ —— ' +
            '这就是 $\\Theta(n^2)$ 的来历。注意"丢掉"不是"不重要"，' +
            '而是"在比较大 n 的效率时，它不如增长阶重要"。',
        },
        {
          kind: 'remark',
          page: 33,
          en:
            'We usually consider one algorithm to be more efficient than another if its ' +
            'worst-case running time has a lower order of growth. Due to constant factors and ' +
            'lower-order terms, an algorithm whose running time has a higher order of growth ' +
            'might take less time for small inputs than an algorithm whose running time has a ' +
            'lower order of growth. But on large enough inputs, an algorithm whose worst-case ' +
            'running time is Θ(n²), for example, takes less time in the worst case than an ' +
            'algorithm whose worst-case running time is Θ(n³). Regardless of the constants ' +
            'hidden by the Θ-notation, there is always some number, say n₀, such that for all ' +
            'input sizes n ≥ n₀, the Θ(n²) algorithm beats the Θ(n³) algorithm in the worst case.',
          zh:
            '这段话同时说清了"为什么可以只看增长阶"和"它的代价是什么"。' +
            '**代价**：增长阶高的算法，在**小输入**上完全可能比增长阶低的算法更快' +
            '（常数项和低阶项在 n 小的时候占主导）。' +
            '**道理**：但一定存在某个规模 $n_0$，只要 $n \\ge n_0$，低增长阶的那个就永远赢。' +
            '这个"存在 $n_0$"的说法在本章是直觉，第 3 章的 Θ/O 定义会把它形式化。',
        },
      ],
      terms: [
        { en: 'RAM model (random-access machine)', zh: '随机存取机模型：本书分析的机器假设', page: 26 },
        { en: 'running time', zh: '运行时间（执行的指令与数据访问的**次数**）', page: 29 },
        { en: 'input size', zh: '输入规模（排序问题里就是元素个数 n）', page: 28 },
        { en: 'c_k', zh: '第 k 行执行一次的代价，是个常数', page: 29 },
        { en: 't_i', zh: '第 5 行被求值的次数（含最后那次为假的判断）', page: 29 },
        { en: 'T(n)', zh: '规模为 n 的输入上的运行时间', page: 29 },
        { en: 'best case', zh: '最好情况（插入排序里 = 输入已排序）', page: 30 },
        { en: 'worst case', zh: '最坏情况（插入排序里 = 输入逆序）', page: 30 },
        { en: 'average case', zh: '平均情况（书上说 "often roughly as bad as the worst case"）', page: [31, 32] },
        { en: 'order of growth / rate of growth', zh: '增长阶（只保留最高阶项、丢掉系数）', page: 33 },
        { en: 'Θ-notation', zh: 'Θ 记号："当 n 很大时大致成正比"', page: 33 },
      ],
    },

    /* ================= 阶段 3 · 伪代码骨架 ================= */
    {
      type: 'pseudocode',
      title: '把代价标在每一行上',
      lead:
        '算法一个字都没变 —— 和 2.1 是同一段 INSERTION-SORT。2.2 做的事是**在它旁边加两列**：' +
        'cost（这一行跑一次的代价）和 times（这一行跑了多少次）。' +
        '下面点开每一行，看它在原书 p.30 那张表里对应什么。',
      algo: 'INSERTION-SORT',
      signature: 'INSERTION-SORT(A, n)',
      page: [18, 30],
      lines: [
        { n: 1, code: 'for i = 2 to n', zh: 'cost = c₁，times = n。★ 注意这里为什么是 **n** 而不是 n − 1：书上把 for 的"循环头判断"也算作这一行的一次执行，i 从 2 试到 n，最后还要再判一次 i = n + 1 才退出 —— 一共 n 次。这是全表唯一一处"次数比直觉多 1"的行。' },
        { n: 2, code: '    key = A[i]', zh: 'cost = c₂，times = n − 1。循环体真的跑了 n − 1 轮（i = 2, 3, …, n）。' },
        { n: 3, code: '    // Insert A[i] into the sorted subarray A[1 : i − 1].', zh: 'cost = **0**，times = n − 1。★ 这条最容易被误读。它是注释，书上 p.29 明说"注释不是可执行语句，不花时间"，所以 cost 是 0；但它挂在 for 循环体里，**次数仍然记 n − 1**。代价乘积 0 × (n − 1) = 0，对总时间没有贡献。' },
        { n: 4, code: '    j = i − 1', zh: 'cost = c₄，times = n − 1。' },
        { n: 5, code: '    while j > 0 and A[j] > key', zh: 'cost = c₅，times = **Σtᵢ**（i 从 2 加到 n）。★ 全表最特殊的一行 —— 别的行次数都是 n 或 n − 1 这样固定的，只有它取决于**输入的具体排列**。tᵢ 的定义就是"这一行被求值了几次"。' },
        { n: 6, code: '        A[j + 1] = A[j]', zh: 'cost = c₆，times = Σ(tᵢ − 1)。为什么减 1？因为每一轮的 tᵢ 次判断里，恰好有一次是"为假、退出"的判断，那次没有执行循环体。所以循环体执行了 tᵢ − 1 次。' },
        { n: 7, code: '        j = j − 1', zh: 'cost = c₇，times = Σ(tᵢ − 1)，和第 6 行绑在一起走。' },
        { n: 8, code: '    A[j + 1] = key', zh: 'cost = c₈，times = n − 1。缩进要看清：它在 while **外面**，但在 for **里面**，所以每轮恰好执行一次。' },
      ],
      vars: [
        { name: 'c₁ … c₈', meaning: '每行执行一次的代价。都是常数，但彼此可以不相等（在真实机器上，取余往往比加法慢就是这个道理）' },
        { name: 'tᵢ', meaning: '当 i 取某个值时，第 5 行被**求值**了几次。第 5 行是唯一一行"次数随输入排列变化"的语句' },
        { name: 'Σtᵢ', meaning: '把 tᵢ 对 i = 2, 3, …, n 全部加起来，也就是第 5 行总共被求值多少次' },
        { name: 'T(n)', meaning: '总运行时间 = Σ（每行 cost × 该行 times）。它最终会被化简成 $an + b$（最好）或 $an^2 + bn + c$（最坏）' },
      ],
      note:
        '★ 用法说明：这张表不是让你背。' +
        '它的意义是——**任何一个算法，你都可以这样摆出一张表，然后逐格乘加**。' +
        '阶段 6 会带你走完这一步，你会看到那串带 c₁…c₈ 的式子有多难看，' +
        '于是就会明白为什么书上紧接着要做"只保留最高阶项"的简化。' +
        '原文这张表在印刷页 30。',
    },

    /* ================= 阶段 4 · 动手看见 ================= */
    {
      type: 'visualize',
      title: '数一遍：Σtᵢ 到底是多少',
      viz: 'array',
      algorithm: 'insertion-sort',
      pseudocodeRef: 'INSERTION-SORT',
      input: { array: [5, 2, 4, 6, 1, 3] },
      invariants: [{ label: 'A[1 : i − 1] 是原来的那些元素，且已排序' }],
      presets: [
        { name: '原书 Figure 2.2 的数组（Σtᵢ = 14）', array: [5, 2, 4, 6, 1, 3] },
        { name: '已经排好序 · 最好情况（Σtᵢ = 5）', array: [1, 2, 3, 4, 5, 6] },
        { name: '完全逆序 · 最坏情况（Σtᵢ = 20）', array: [6, 5, 4, 3, 2, 1] },
        { name: '逆序 n = 8：Σtᵢ 一下子跳到 35', array: [8, 7, 6, 5, 4, 3, 2, 1] },
        { name: '原书习题 2.1-1 的数组 ⟨31, 41, 59, 26, 41, 58⟩', array: [31, 41, 59, 26, 41, 58] },
      ],
      tasks: [
        '先选「原书 Figure 2.2 的数组」，一路单步走完。计数器里「第 5 行求值 Σtᵢ」最后停在 **14** —— 这就是阶段 1 让你猜的那个数。',
        '换成「已经排好序」，看 Σtᵢ 只涨到 **5 = n − 1**。每一轮的 while 都是"看一眼就退出"，所以 tᵢ 恒等于 1 —— 这正是书上 (2.1) 式的由来。',
        '再换成「完全逆序」，Σtᵢ 涨到 **20**。它等于 $n(n+1)/2 - 1 = 6 \\times 7/2 - 1$，也正是 2.1 里你已经见过的那条最坏情况公式。',
        '最后换成 n = 8 的逆序：Σtᵢ 从 20 跳到 **35**。n 只涨了 1/3，Σtᵢ 却涨了 3/4 —— 这就是"二次"的手感，也是阶段 6 那条曲线想让你建立的感觉。',
        '★ 顺手验证一个易错点：注意「第 5 行求值 Σtᵢ」与「触发搬移」**不是同一个数**。前者含每轮最后那次为假的判断，所以恰好比后者多 n − 1 次。',
      ],
    },

    /* ================= 阶段 5 · 双轨实现 ================= */
    {
      type: 'code',
      title: '从伪代码到 C：把计数器写进代码',
      intro:
        '这一关没有新算法，所以"从伪代码到 C"要换个做法：**把书上那两个量真的数出来**。' +
        '这份 C 和 2.1 那份的算法一字不差，只在关键位置插了几个计数器。' +
        '对照时仍然只看一件事：**书上每个下标减 1**。',
      pseudocodeRef: 'INSERTION-SORT',
      c: {
        file: 'count_ops.c',
        code: C_IMPL,
        notes: [
          { line: 38, zh: '对应书第 1 行。`i` 从 1 开始（不是书上的 2），因为 C 的下标从 0 起 —— 书上的 A[2] 就是 a[1]。循环仍是 n − 1 轮，与书上一致。' },
          { line: 42, zh: '★ 本站加的计数器 1：**进入 while 之前的第一次判断**。书上的 tᵢ 是"第 5 行被求值的次数"，而第一次求值发生在进入循环体之前，所以必须在这里先记一次。' },
          { line: 43, zh: '★ 对应书第 5 行，一字未改：`while (j >= 0 && a[j] > key)`。把它和书上的 `while j > 0 and A[j] > key` 并排看 —— 唯一的差别是 `j >= 0`（C 允许下标 0，书上把 0 当越界哨兵）。写成 `j > 0` 会漏掉第一个元素，这是这个算法最常见的 bug。' },
          { line: 44, zh: '对应书第 6 行。每执行一次就说明循环体真的跑了一轮 —— 这就是"搬移"。' },
          { line: 47, zh: '★ 本站加的计数器 2：**每轮循环体执行后回到循环头，又判断了一次**。它在 `j--` 之后、回到 while 之前的位置，所以顺序上完全等价于"再测一次条件"。' },
          { line: 49, zh: '对应书第 8 行。缩进与书上一致：它在 while 外面、在 for 里面，每轮恰好执行一次。注意它**不计入搬移** —— 它是"把 key 放回去"，不是"元素移位"。' },
          { line: 66, zh: '为什么计数器能保证精确？`t5++` 出现两次：一次在进循环前，一次在每轮循环体末尾。前者覆盖"第一次判断"，后者覆盖"每次回到循环头"。而"判断为假、于是退出"的那一次，正是后者里的某一次 —— 所以它被算进去了，不会少 n − 1 次。' },
          { line: 111, zh: '用断言把书上的结论钉死：最坏情况 Σtᵢ 必须等于 $n(n+1)/2 - 1$，搬移必须等于 $n(n-1)/2$。两个公式都出自原书 p.31（借助附录式 (A.2)）。' },
          { line: 128, zh: '增长趋势：n 从 100 翻倍到 1600，打印 Σtᵢ / n² 的比值。它会稳定趋近 **0.5** —— 这正是"$\\Theta(n^2)$"最直观的含义：不是等于某个函数，而是**比值趋于常数**。' },
        ],
        tests: [
          { in: '[5, 2, 4, 6, 1, 3]（Figure 2.2）', out: 'Σtᵢ = 14，搬移 = 9' },
          { in: '[1, 2, 3, 4, 5, 6]（最好情况）', out: 'Σtᵢ = 5 = n − 1，搬移 = 0' },
          { in: '[6, 5, 4, 3, 2, 1]（最坏情况）', out: 'Σtᵢ = 20 = n(n+1)/2 − 1，搬移 = 15 = n(n−1)/2' },
          { in: '[8 … 1]（n = 8 逆序）', out: 'Σtᵢ = 35 = 8 × 9/2 − 1' },
          { in: 'n = 100 逆序', out: 'Σtᵢ = 5049，Σtᵢ/n² = 0.5049' },
          { in: 'n = 1600 逆序', out: 'Σtᵢ = 1 280 799，Σtᵢ/n² = 0.5003（趋近 0.5）' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'for i = 2 to n', c: 'for (int i = 1; i < n; i++)' },
        { pc: 2, pcCode: 'key = A[i]', c: 'int key = a[i];' },
        { pc: 3, pcCode: '// 注释', c: '（不译，注释不占时间；代价表里 cost = 0）' },
        { pc: 4, pcCode: 'j = i − 1', c: 'int j = i - 1;' },
        { pc: 5, pcCode: 'while j > 0 and A[j] > key', c: 'while (j >= 0 && a[j] > key)  ← 两侧各有一个 t5++ 在数它被判断了几次' },
        { pc: 6, pcCode: 'A[j + 1] = A[j]', c: 'a[j + 1] = a[j];  moves++;' },
        { pc: 7, pcCode: 'j = j − 1', c: 'j--;' },
        { pc: 8, pcCode: 'A[j + 1] = key', c: 'a[j + 1] = key;  （不计入 moves）' },
      ],
      engine: {
        lang: 'js',
        code: ENGINE_EXCERPT,
        note:
          '页面上的动画就由这份 JS 生成器驱动，其中的 `counts.line5` 恰好就是书上 2.2 的 Σtᵢ。' +
          '注意它与上面 C 的 `t5` 用的是**同一个技巧**：把 while 的条件拆成"先计数、再判断"，' +
          '从而把最后一次为假的判断也算进去。',
      },
    },

    /* ================= 阶段 6 · 复杂度 ================= */
    {
      type: 'analyze',
      title: '最好、最坏、平均：三个答案',
      intro:
        '阶段 3 给了你一张表，这一阶段做两件事：把表**乘加成一个公式**，再把公式**砍到能比较' +
        '的形状**。砍完之后你会发现：即使丢掉一堆细节，剩下的东西反而更有用。',
      claims: [
        {
          expr: 'T(n) = (c_1 + c_2 + c_4 + c_5 + c_8)n - (c_2 + c_4 + c_5 + c_8)',
          when: '最好情况（输入已排序，tᵢ = 1）—— 书上式 (2.1)，p.30',
          page: 30,
          source: 'book',
        },
        {
          expr: 'T(n) = an + b',
          when: '式 (2.1) 的简写形式：a、b 是依赖 c_k 的常数。书上原话是 "The running time is thus a linear function of n"',
          page: 30,
          source: 'book',
        },
        {
          expr: 'T(n) = \\left(\\frac{c_5}{2} + \\frac{c_6}{2} + \\frac{c_7}{2}\\right)n^2 + \\left(c_1 + c_2 + c_4 + \\frac{c_5}{2} - \\frac{c_6}{2} - \\frac{c_7}{2} + c_8\\right)n - (c_2 + c_4 + c_5 + c_8)',
          when: '最坏情况（输入逆序，tᵢ = i）—— 书上式 (2.2)，p.31。注意平方项的系数只由 c₅、c₆、c₇ 组成',
          page: 31,
          source: 'book',
        },
        {
          expr: 'T(n) = an^2 + bn + c',
          when: '式 (2.2) 的简写形式。书上原话是 "The running time is thus a quadratic function of n"',
          page: 31,
          source: 'book',
        },
        {
          expr: '\\Theta(n) \\; / \\; \\Theta(n^2)',
          when: '最好情况是线性、最坏情况是二次。书上是 roughly proportional 的用法，严格定义在第 3 章',
          page: 33,
          source: 'book',
        },
        {
          expr: '\\Theta(n^2)',
          when: '平均情况的结论：tᵢ 约为 i/2，但求和之后**仍然是二次函数**，与最坏情况同阶（p.32）',
          page: [32],
          source: 'book',
        },
      ],
      tables: [
        {
          caption: '原书 p.30 的代价表（逐字照录；这是本关的核心一张表）',
          rows: [
            ['第 1 行　for i = 2 to n', 'c₁ · n', true],
            ['第 2 行　key = A[i]', 'c₂ · (n − 1)', true],
            ['第 3 行　// 注释', '0 · (n − 1)', true],
            ['第 4 行　j = i − 1', 'c₄ · (n − 1)', true],
            ['第 5 行　while j > 0 and A[j] > key', 'c₅ · Σtᵢ', true],
            ['第 6 行　A[j + 1] = A[j]', 'c₆ · Σ(tᵢ − 1)', true],
            ['第 7 行　j = j − 1', 'c₇ · Σ(tᵢ − 1)', true],
            ['第 8 行　A[j + 1] = key', 'c₈ · (n − 1)', true],
            ['合计 T(n)', 'c₁n + c₂(n−1) + c₄(n−1) + c₅Σtᵢ + c₆Σ(tᵢ−1) + c₇Σ(tᵢ−1) + c₈(n−1)', true],
          ],
        },
        {
          caption: 'Figure 2.2 的数组 ⟨5, 2, 4, 6, 1, 3⟩ 逐轮统计（本站按书中定义手工数出）',
          rows: [
            ['i = 2　key = 2', 't₂ = 2', true],
            ['i = 3　key = 4', 't₃ = 2', true],
            ['i = 4　key = 6', 't₄ = 1（一次都没搬）', true],
            ['i = 5　key = 1', 't₅ = 5（一路搬到最左）', true],
            ['i = 6　key = 3', 't₆ = 4', true],
            ['合计', 'Σtᵢ = 2 + 2 + 1 + 5 + 4 = 14', true],
            ['合计搬移', 'Σ(tᵢ − 1) = 1 + 1 + 0 + 4 + 3 = 9', true],
          ],
        },
        {
          caption: '三种情况对照（同一张表，只换了 Σtᵢ 的取值）',
          rows: [
            ['最好情况（已排序）', 'tᵢ = 1', 'Σtᵢ = n − 1', 'T(n) = an + b　线性　Θ(n)', true],
            ['平均情况（随机）', 'tᵢ ≈ i / 2', 'Σtᵢ ≈ n(n+1)/4', '仍是二次　Θ(n²)', true],
            ['最坏情况（逆序）', 'tᵢ = i', 'Σtᵢ = n(n+1)/2 − 1', 'T(n) = an² + bn + c　二次　Θ(n²)', true],
            ['本站补充', '——', '平均那一行的 Σtᵢ 是把书上的 tᵢ ≈ i/2 逐项相加得到的', '书上只写了结论是二次函数，没给这个中间式', false],
          ],
        },
        {
          caption: 'p.32 那个"只看主导项"的数值例子：n²/100 + 100n + 17 微秒',
          rows: [
            ['系数对比', 'n² 项的系数 1/100 与 n 项的系数 100，相差 4 个数量级', true],
            ['交叉点', '当 n 超过 10 000 时，n²/100 开始压过 100n', true],
            ['n = 100 时', 'n²/100 = 100，100n = 10 000 —— 低阶项还赢着', false],
            ['n = 10 000 时', 'n²/100 = 1 000 000，100n = 1 000 000 —— 打平', false],
            ['n = 100 000 时', 'n²/100 = 100 000 000，100n = 10 000 000 —— 高阶项赢 10 倍', false],
            ['书上补一句', '10 000 看起来很大，但比一个普通城镇的人口还少；现实问题的输入往往更大', true],
          ],
        },
      ],
      chart: {
        xMax: 16,
        series: [
          { name: '最好情况：Σtᵢ = n − 1（线性）', color: '--viz-done', expr: 'n - 1' },
          { name: '平均情况：Σtᵢ ≈ n(n+1)/4（二次，但常数小一半）', color: '--viz-active', expr: 'n*(n+1)/4 - 1' },
          { name: '最坏情况：Σtᵢ = n(n+1)/2 − 1（二次）', color: '--viz-compare', expr: 'n*(n+1)/2 - 1' },
        ],
      },
      derivations: [
        {
          title: '① 最好情况：为什么 tᵢ = 1，以及 T(n) = an + b（式 2.1）',
          steps: [
            {
              zh:
                '最好情况是"输入已经排好序"。这时每一轮要插的 key，都已经大于等于 ' +
                'A[1 : i − 1] 里的全部元素。于是 while 的条件 `j > 0 and A[j] > key` ' +
                '**第一次求值就为假**（哪怕 j > 0 成立，A[j] > key 也不成立），循环立刻退出。',
            },
            {
              tex: 't_i = 1 \\quad \\text{for } i = 2, 3, \\dots, n \\qquad \\Longrightarrow \\qquad \\sum_{i=2}^{n} t_i = n - 1',
              zh:
                '所以 tᵢ 恒等于 1（注意：**不是 0** —— 那次为假的判断算一次求值），' +
                '整个 Σtᵢ 就是 n − 1。这也解释了阶段 4 里"已排序"那组的 Σtᵢ 为什么正好停在 5。',
            },
            {
              zh:
                '把 Σtᵢ = n − 1 与 Σ(tᵢ − 1) = 0 代回代价表，那些"Σ"就都消失了，' +
                '只剩下一个不含 Σ 的一次式 —— 这就是书上 p.30 的式 (2.1)：' +
                '$T(n) = (c_1 + c_2 + c_4 + c_5 + c_8)n - (c_2 + c_4 + c_5 + c_8)$。',
            },
            {
              zh:
                '式 (2.1) 里没有任何二次项，所以它是 n 的**线性函数**：' +
                '写成 $an + b$，其中 $a = c_1 + c_2 + c_4 + c_5 + c_8$。' +
                '两边除以 n 就能看出它的意义：$T(n)/n \\to a$，也就是"每多一个元素，时间大约多 a"。',
            },
          ],
        },
        {
          title: '② 最坏情况：tᵢ = i，用附录式 (A.2) 求和（式 2.2）',
          steps: [
            {
              zh:
                '最坏情况是"输入完全逆序"。这时每一轮要插的 key 比左边**所有**元素都小，' +
                '所以 j 会一路走到 0 才停。书上原话：the while loop exits only when j reaches 0。' +
                'j 从 i − 1 一路降到 0，一共判断了 i 次 —— 所以 tᵢ = i。',
            },
            {
              tex: '\\sum_{i=2}^{n} i = \\left(\\sum_{i=1}^{n} i\\right) - 1 = \\frac{n(n+1)}{2} - 1',
              zh:
                '第一个求和：把 i 从 2 加到 n，等于从 1 加到 n 再减掉那个 1。' +
                '原书 p.31 标注这一步用的是 equation (A.2)（印刷页 1141），也就是 $\\sum_{i=1}^{n} i = n(n+1)/2$。' +
                '验一下 n = 6：$6 \\times 7/2 - 1 = 20$ —— 与阶段 4「完全逆序」那组一致。',
            },
            {
              tex: '\\sum_{i=2}^{n} (i - 1) = \\sum_{i=1}^{n-1} i = \\frac{n(n-1)}{2}',
              zh:
                '第二个求和（也就是**搬移次数**）：书上同样用 (A.2)。' +
                '关键是这个替换——把 $i$ 从 2 到 n 的 $(i-1)$ 加起来，' +
                '正好就是 $i$ 从 1 到 n−1 的 $i$ 加起来（只是换了字母）。' +
                '验一下 n = 6：$6 \\times 5/2 = 15$ —— 与阶段 4 的搬移计数一致。',
            },
            {
              zh:
                '把这两个和代回代价表，你会得到书上 p.31 的式 (2.2)，' +
                '整理之后平方项的系数是 $(c_5 + c_6 + c_7)/2$，一次项是 $c_1 + c_2 + c_4 + (c_5 - c_6 - c_7)/2 + c_8$，' +
                '常数项是 $-(c_2 + c_4 + c_5 + c_8)$。写成 $T(n) = an^2 + bn + c$。' +
                '这就是"二次函数"的由来。',
            },
            {
              zh:
                '★ 一个值得停下来看的事实：**最好情况与最坏情况的差别，全都来自 Σtᵢ 的取值**。' +
                '代价表里其他行的次数（n、n − 1）都是固定的，只有第 5、6、7 行挂着 Σ。' +
                '所以"输入的好坏"在数学上就是"Σtᵢ 是大还是小"。',
            },
          ],
        },
        {
          title: '③ 平均情况：为什么它和最坏情况同阶',
          steps: [
            {
              zh:
                '书上 p.32 的论证很短。假设输入是 n 个**随机排列**的数，' +
                '那么在 $A[1 : i - 1]$ 这段已经排好的子数组里，大约一半元素比 $A[i]$ 小、一半比它大。' +
                '因此平均来说，$A[i]$ 只会和这段子数组的**一半**比较 —— 也就是 $t_i \\approx i/2$。',
            },
            {
              tex: '\\sum_{i=2}^{n} \\frac{i}{2} = \\frac{1}{2}\\sum_{i=2}^{n} i \\approx \\frac{n(n+1)}{4}',
              zh:
                '把 $t_i \\approx i/2$ 逐项加起来。（这一步的中间式是**本站补充**的，' +
                '书上只给结论没给这个式子。）结果仍然是 $n$ 的二次式，' +
                '只是系数比最坏情况小了一半左右。这就是阶段 6 那张图里中间那条曲线。',
            },
            {
              zh:
                '书上因此说 "The resulting average-case running time turns out to be a quadratic ' +
                'function of the input size, just like the worst-case running time."' +
                '**注意这句话的分量**：平均情况与最坏情况**同阶**（都是 $\\Theta(n^2)$）。' +
                '这正是 p.31 第三条理由"平均情况往往和最坏情况差不多糟"的出处。',
            },
            {
              zh:
                '书的最后还留了一句重要提醒：平均情况分析的作用是**受限的**，' +
                '因为"什么才算平均输入"往往说不清楚。于是通常额外假设"同样规模的所有输入等可能"，' +
                '或者改用**随机化算法**来做概率分析（第 5 章展开）。' +
                '这句话预备了后面一整章的内容，本章只需记住"平均 ≈ 最坏"这个量级结论。',
            },
          ],
        },
        {
          title: '④ 最后一步简化：丢掉低阶项与系数，剩下的才是重点',
          steps: [
            {
              zh:
                '式 (2.1)、(2.2) 虽然精确，却带着 c₁…c₈ 一堆常数，没法拿来做比较。' +
                '书上做两次丢弃：**只留最高阶项**（大 n 时低阶项相对不重要），' +
                '以及**连最高阶项的系数也丢掉**（系数不改变增长的性质）。',
            },
            {
              tex: 'T(n) = an^2 + bn + c \\quad \\xrightarrow{\\;\\text{丢低阶与系数}\\;} \\quad n^2 \\quad \\Longrightarrow \\quad \\Theta(n^2)',
              zh:
                '对插入排序的最坏情况，丢弃之后只剩 $n^2$。' +
                '这就是"插入排序最坏情况是 $\\Theta(n^2)$"这句话的全部来历 —— 它不是说 T(n) 等于 n²，' +
                '而是说 T(n) **长成 n² 的样子**。',
            },
            {
              zh:
                '为什么要丢掉系数？书上的数值例子最说明问题：' +
                '一台机器上跑 $n^2/100 + 100n + 17$ 微秒。' +
                'n² 项的系数是 1/100、n 项的系数是 100，差了四个数量级，看起来小得可以忽略。' +
                '但 n 超过 10 000 之后，$n^2/100$ 就开始压过 $100n$。' +
                '如果是一个真实问题（n 往往远大于 10 000），起决定作用的就是那个"系数很小"的平方项。',
            },
            {
              zh:
                '所以"丢系数"不是因为它小，而是因为**在足够大的 n 面前，任何常数系数都会被增长阶打败**。' +
                '这也是阶段 4 里那个比值的意义：n 从 100 到 1600，$\\Sigma t_i / n^2$ 从 0.5049 稳定滑向 0.5 —— ' +
                '比值趋于常数，就是"同阶"的可观测形式。',
            },
          ],
        },
      ],
      note:
        '★ 三条提醒。' +
        '第一，本关所有的 $\\Theta$ 都是**非正式**用法（书上 p.33 明确说了"本章先用非正式的定义，第 3 章给严格定义"），' +
        '所以这里不说 $T(n) \\in \\Theta(n^2)$ 这种集合写法。' +
        '第二，"平均情况的 $n(n+1)/4$"是本站由书上 p.32 的 $t_i \\approx i/2$ 推出的中间式，' +
        '书上只给结论（二次函数），已经在上面的表里标成「本站补充」—— 别把它当成原文引用。' +
        '第三，2.1 阶段 6 出现的结论在本关**被完整证明了**：' +
        '当时带"预告"标记的 $\\Sigma t_i = n(n+1)/2 - 1$ 与 $\\Theta(n^2)$，源头都在这里。',
    },

    /* ================= 阶段 7 · 论证 ================= */
    {
      type: 'prove',
      title: '凭什么只看最坏情况就够',
      statement:
        'For the remainder of this book, though, we’ll usually (but not always) concentrate ' +
        'on finding only the worst-case running time, that is, the longest running time for ' +
        'any input of size n. Why? Here are three reasons:',
      page: [31],
      intro:
        '这一阶段论证的不是算法本身正确（那是 2.1 的事），而是一个**方法论选择**：' +
        '为什么要盯住最坏情况，而不是平均情况或者最好情况。' +
        '书上在 p.31–32 给了三条理由，下面逐条读原文、逐条展开。' +
        '中文里的数字例子是本站补充的，用来让这三条理由变得可验证。',
      steps: [
        {
          title: '理由一 · 最坏情况是对任意输入的上界',
          en:
            'The worst-case running time of an algorithm gives an upper bound on the running ' +
            'time for any input. If you know it, then you have a guarantee that the algorithm ' +
            'never takes any longer. You need not make some educated guess about the running ' +
            'time and hope that it never gets much worse. This feature is especially important ' +
            'for real-time computing, in which operations must complete by a deadline.',
          page: [31],
          body: [
            '这条理由的关键词是 **guarantee**（保证）。' +
            '知道最坏情况，你得到的是一句"绝不会更慢"的承诺，而不是"大概不会太慢"的猜测。' +
            '书上用 upper bound（上界）来描述它 —— 这个词在第 3 章会被严格定义成 $O$ 记号。',
            '原文特意点了 **real-time computing**（实时计算）：' +
            '这类系统里操作必须在一个截止时间前完成。' +
            '这时候"平均很快"没用，你需要的正是"最坏也不会超时"这条保证。' +
            '你在 C 里写过的那些"这行代码够不够快"的判断，本质上就是在问同一个问题。',
            '顺带体会一下三条理由之间的关系：理由一说明最坏情况的**信息价值最高**（它覆盖所有输入），' +
            '理由二和三说明它**出现得也够频繁**。合起来才构成"只看它就够"的结论。',
          ],
        },
        {
          title: '理由二 · 有些算法里，最坏情况真的经常发生',
          en:
            'For some algorithms, the worst case occurs fairly often. For example, in searching ' +
            'a database for a particular piece of information, the searching algorithm’s worst ' +
            'case often occurs when the information is not present in the database. In some ' +
            'applications, searches for absent information may be frequent.',
          page: [31, 32],
          body: [
            '这条反驳的是"最坏情况只是极端个案，现实中碰不到"这种想法。' +
            '书上的例子很实际：在数据库里查一条信息，**最坏情况恰恰对应"这条信息根本不在库里"**。' +
            '而在很多应用里，"查不到"这件事发生得一点都不少。',
            '注意这条理由没有一般性 —— 原文说的是 "For **some** algorithms"。' +
            '它是在说明：最坏情况并不总是稀有事件，所以不能简单地用"概率低"来把它排除掉。',
          ],
        },
        {
          title: '理由三 · 平均情况往往和最坏情况同阶',
          en:
            'The "average case" is often roughly as bad as the worst case. Suppose that you run ' +
            'insertion sort on an array of n randomly chosen numbers. How long does it take to ' +
            'determine where in subarray A[1 : i − 1] to insert element A[i]? On average, half ' +
            'the elements in A[1 : i − 1] are less than A[i], and half the elements are greater. ' +
            'On average, therefore, A[i] is compared with just half of the subarray ' +
            'A[1 : i − 1], and so t_i is about i/2. The resulting average-case running time ' +
            'turns out to be a quadratic function of the input size, just like the worst-case ' +
            'running time.',
          page: [32],
          body: [
            '★ 这条最有力，因为它直接把"平均情况"这个选项**从量级上排除了**。' +
            '论证只有一行：随机输入下大约一半元素比 $A[i]$ 小，所以 $t_i \\approx i/2$；' +
            '但把它加起来之后**仍然是二次函数**，与最坏情况同阶。',
            '换句话说：你花大力气去算平均情况，得到的还是 $\\Theta(n^2)$ —— ' +
            '与最坏情况只差一个常数因子（约 2 倍）。' +
            '既然量级一样，那多花的那份力气就不值了，直接用最坏情况的结论更省事。',
            '这也是阶段 6 那张图想传达的：最好情况那条线（$n-1$）被远远甩开，' +
            '而平均与最坏两条线**并排走**，只差常数倍。' +
            '书上最后补了一句限定：平均情况分析的作用是**受限的**，' +
            '因为"什么算平均输入"常常说不清；真需要时得靠等可能假设或随机化算法（第 5 章）。' +
            '注意原文里的 "usually (but not always)" —— 本书并没把平均情况分析一笔勾销。',
          ],
        },
      ],
      conclusion:
        '三条理由合起来，就得到了 2.2 节的那个方法论结论：**以后默认分析最坏情况**。' +
        '但请把这条结论连同它的边界一起记住 —— 它靠的是"同阶"这个量级判断，' +
        '所以当常数因子真的重要时（比如 $n$ 很小、或者两个算法同阶），' +
        '这个结论就不够用了，那时平均情况分析会回来。' +
        '下面的闯关区里，习题 **2.2-3** 正是让你亲手算一次平均情况，' +
        '习题 **2.2-4** 则反过来问你：怎么把一个排序算法的**最好情况**做好？' +
        '—— 两道题从两个方向检验你是不是真的理解了这三条理由。',
    },

    /* ================= 阶段 8 · 闯关测验 ================= */
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'judge',
          q: '本章所说的「运行时间」，指的是执行了多少条指令与多少次数据访问，与具体机器无关。',
          answer: true,
          why:
            '这是 p.29 的定义："the number of instructions and data accesses executed"。' +
            '它刻意不涉及秒数，就是为了让不同机器上的结论能通用。' +
            '代价 c_k 还是"某种机器上的代价"，但 tᵢ、Σtᵢ 这些**次数**是完全客观的。',
        },
        {
          kind: 'single',
          q: '在原书 Figure 2.2 的数组 ⟨5, 2, 4, 6, 1, 3⟩ 上，$\\sum_{i=2}^{6} t_i$ 等于多少？',
          options: ['12', '13', '14', '20'],
          answer: 2,
          why:
            '逐轮是 t₂ = 2、t₃ = 2、t₄ = 1、t₅ = 5、t₆ = 4，合计 **14**。' +
            '容易错的地方有两处：一是 t₄ = 1 而不是 0（i = 4 时 key = 6，第一次判断就为假，' +
            '但那次为假的判断要算一次）；二是别把它和最坏情况的 20 搞混 —— 20 属于完全逆序的 6 个元素。' +
            '回阶段 4 选第一组预设，单步走完就是 14。',
        },
        {
          kind: 'single',
          q: '最好情况下，每一轮的 $t_i$ 等于多少？',
          options: ['0', '1', 'i', 'n − 1'],
          answer: 1,
          why:
            '最好情况是输入已排序，while 的条件**第一次求值就为假**，循环立刻退出，所以每轮恰好求值 1 次。' +
            '注意不是 0 —— "一次也没判断"是不可能的，你至少得判断一次才知道该退出。' +
            '这就是书上 (2.1) 式里 $\\sum t_i = n - 1$ 的来源。',
        },
        {
          kind: 'judge',
          q: '随机输入下，插入排序的平均情况与最坏情况是同一个量级（都是 $\\Theta(n^2)$）。',
          answer: true,
          why:
            '书上 p.32 的结论：$t_i \\approx i/2$，加起来**仍然**是二次函数，' +
            '所以平均情况和最坏情况同阶（只差约 2 倍的常数因子）。' +
            '这正是"只看最坏情况"的第三条理由，也是本关阶段 7 的重点。',
        },
        {
          kind: 'simulate',
          q: '在 ⟨5, 2, 4, 6, 1, 3⟩ 上，i = 5 那一轮的**结束时**，数组是什么？（用空格分隔）',
          expect: [1, 2, 4, 5, 6, 3],
          placeholder: '例如：1 2 3 4 5 6',
          why:
            'i = 5 时 key = A[5] = 1，它是当前最小的元素，所以 j 一路从 4 走到 0，' +
            '把 2、4、5、6 全部向右推一格，最后把 1 放在 A[1]。' +
            '结果是 ⟨1, 2, 4, 5, 6, 3⟩ —— 注意此时 A[1 : 5] 已有序，但 3 还在最后。' +
            '这一轮的 t₅ = 5（含最后那次为假的判断），是 Figure 2.2 里最费劲的一轮。',
        },
        {
          kind: 'single',
          q: '若某算法在某台机器上的运行时间是 $n^2/100 + 100n + 17$ 微秒，从 n 大到什么程度起，$n^2/100$ 这一项开始主导 $100n$？',
          options: ['n = 100', 'n = 1 000', 'n = 10 000', '永远不会'],
          answer: 2,
          why:
            '这是原书 p.32 的数值例子。解 $n^2/100 = 100n$ 得 $n = 10\\,000$。' +
            '书上特意补了一句：10 000 看着大，但比一个普通城镇的人口还少，' +
            '现实问题的输入往往远超这个数 —— 所以那个"系数很小"的平方项最终会赢。' +
            '这就是"丢掉系数只看增长阶"能成立的实证依据。',
        },
        {
          kind: 'judge',
          q: '一个 $\\Theta(n^2)$ 的算法，在任何输入规模上都一定比 $\\Theta(n^3)$ 的算法快。',
          answer: false,
          why:
            '陷阱题，原文在 p.33 明确否定了这一点："Due to constant factors and lower-order terms, ' +
            'an algorithm whose running time has a higher order of growth **might take less time for ' +
            'small inputs**"。' +
            '正确的说法是：**存在某个规模 $n_0$**，只要 $n \\ge n_0$，$\\Theta(n^2)$ 的那个就永远赢。' +
            '小输入上，常数项和低阶项占主导，增长阶高的一方完全可能更快 —— ' +
            '这也是为什么真实工程里小数组常常用插入排序（第 2.3 节末尾和第 4 章都会回到这一点）。',
        },
      ],
      bookExercises: [
        {
          id: '2.2-1',
          page: 33,
          star: 1,
          statement:
            'Express the function n³/1000 + 100n² − 100n + 3 in terms of Θ-notation.',
          hint:
            '照抄阶段 6 第 ④ 项的两次丢弃：先扔低阶项，再扔最高阶项的系数。' +
            '最高阶项是 $n^3/1000$，丢掉系数后剩 $n^3$，所以答案写成 $\\Theta(n^3)$。' +
            '这道题的价值是让你动手做一次"丢"的动作 —— 别只想，写下来。' +
            '顺便注意：$-100n$ 这种负系数项也一并丢掉，符号不影响增长阶。',
        },
        {
          id: '2.2-2',
          page: 33,
          star: 2,
          statement:
            'Consider sorting n numbers stored in array A[1 : n] by first finding the smallest ' +
            'element of A[1 : n] and exchanging it with the element in A[1]. Then find the ' +
            'smallest element of A[2 : n], and exchange it with A[2]. Then find the smallest ' +
            'element of A[3 : n], and exchange it with A[3]. Continue in this manner for the ' +
            'first n − 1 elements of A. Write pseudocode for this algorithm, which is known as ' +
            'selection sort. What loop invariant does this algorithm maintain? Why does it need ' +
            'to run for only the first n − 1 elements, rather than for all n elements? Give the ' +
            'worst-case running time of selection sort in Θ-notation. Is the best-case running ' +
            'time any better?',
          hint:
            '这题是 2.1 与 2.2 的合练，分四小问，别漏。' +
            '① 伪代码：外层 i 从 1 到 n − 1，内层 j 从 i + 1 到 n 找最小值，然后交换。' +
            '② 不变量照 2.1 阶段 7 的三步模板写，建议取「进入第 i 轮时，A[1 : i − 1] 是' +
            '原数组里最小的 i − 1 个元素且已排序」。' +
            '③ 为什么只跑到 n − 1：最后一轮结束后，剩下的那 1 个元素**必然**已经是最大的，' +
            '只能待在原位 —— 这一问靠不变量来说反而最清楚。' +
            '④ 最坏与最好：★ 这是本题的核心考点。找最小值**无论如何都要把整段扫一遍**，' +
            '所以比较次数与输入排列无关，最好情况**并不更好**。' +
            '这一点和插入排序形成鲜明对照（插入排序最好情况是线性的），值得在笔记里对照着记。',
        },
        {
          id: '2.2-3',
          page: [33, 34],
          star: 2,
          statement:
            'Consider linear search again (see Exercise 2.1-4). How many elements of the input ' +
            'array need to be checked on the average, assuming that the element being searched ' +
            'for is equally likely to be any element in the array? How about in the worst case? ' +
            'Using Θ-notation, give the average-case and worst-case running times of linear ' +
            'search. Justify your answers.',
          hint:
            '先回到 2.1 的习题 2.1-4 把线性查找的伪代码写出来（你当时写过一遍）。' +
            '设元素出现在每个位置的概率相等，那么检查次数的期望是 ' +
            '$(1 + 2 + \\cdots + n)/n = (n+1)/2$ —— 这就是平均情况，是**线性**的。' +
            '最坏情况是"检查完全部 n 个才发现不在"（或恰好在最后），也是线性的。' +
            '关键结论：**两者同阶**，都是 $\\Theta(n)$。' +
            '把它和插入排序（平均与最坏同为二次）对照，你会发现"平均与最坏同阶"是个反复出现的模式 —— ' +
            '这正是阶段 7 三条理由的又一处佐证。',
        },
        {
          id: '2.2-4',
          page: 34,
          star: 1,
          statement:
            'How can you modify any sorting algorithm to have a good best-case running time?',
          hint:
            '这题问的是"怎样才能让最好情况真的好"。提示只有一句：**先花很小的代价检查输入是不是已经有序**。' +
            '如果一开始就发现已经排好，那最好的做法就是什么都不做、当场返回。' +
            '想一想这个检查本身要花多少次比较（一次线性扫描，$\\Theta(n)$），' +
            '再想想它把最好情况从原来的阶降到了多少。' +
            '注意题目说的是 "any sorting algorithm" —— 所以答案应该是加在算法外面的一个通用手段，' +
            '而不是去改某个具体算法的内部。',
        },
      ],
    },
  ],
};
