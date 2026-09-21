/* =============================================================================
 * 第 2 章 · 2.1 插入排序（Insertion sort）—— 金标准关卡
 *
 * 原文锚点：印刷页 17–24（pdf_index 38–45）
 * 本文件是「九段式关卡」的参考实现。后续所有关卡都照这个结构写。
 *
 * 忠实度约定：
 *   - 所有 en 字段是**原书英文原文**（已按本文档第 0 节说明修正过字形编码）。
 *   - 所有 zh 字段是本站的中文讲解，一律以 data-kind="note" 呈现。
 *   - 所有结论都带页码；凡本站补充推导的，标 source:'instructor'。
 *   - 标注 preview:true 的内容出自后续小节（2.2，印刷页 25 起），此处只作预告。
 * ========================================================================== */

/* C 实现（与 c/insertion_sort.c 一致，可直接编译运行）
 * 用 String.raw 保留反斜杠，避免 \n 被当成换行。 */
const C_IMPL = String.raw`/*
 * insertion_sort.c — 插入排序（CLRS 第 4 版 INSERTION-SORT 的 C 实现）
 *
 * 书中伪代码下标从 1 开始（A[1 .. n]），本实现从 0 开始。
 * 对应关系（新手最容易翻车的点）：书中的 A[i] ↔ 本文件的 a[i-1]。
 *   书第 2 行  key = A[i]        →  key = a[i-1]
 *   书第 4 行  j = i - 1          →  j = i - 1
 *   书第 5 行  while j > 0 and A[j] > key
 *                             →  while (j >= 0 && a[j] > key)
 *   书第 6 行  A[j + 1] = A[j]    →  a[j + 1] = a[j]
 *   书第 8 行  A[j + 1] = key     →  a[j + 1] = key
 * 即：把书上所有下标都减 1 即可。循环不变量 A[1..i-1] 已排序 ↔ a[0..i-1] 已排序。
 */
#include <stdio.h>
#include <assert.h>

void insertion_sort(int a[], int n)
{
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

static void check(const char *name, int a[], int n, const int expected[])
{
    insertion_sort(a, n);
    for (int i = 0; i < n; i++) {
        assert(a[i] == expected[i]);
    }
    printf("ok: %s\n", name);
}

int main(void)
{
    int a1[] = {5, 2, 4, 6, 1, 3};
    int e1[] = {1, 2, 3, 4, 5, 6};
    check("fig2.2", a1, 6, e1);

    int a2[] = {6, 5, 4, 3, 2, 1};
    int e2[] = {1, 2, 3, 4, 5, 6};
    check("reverse6", a2, 6, e2);

    int a3[] = {12, 3, 7, 9, 14, 6, 11, 2};
    int e3[] = {2, 3, 6, 7, 9, 11, 12, 14};
    check("fig2.4", a3, 8, e3);

    int a4[] = {2, 2, 1, 1, 3, 3};
    int e4[] = {1, 1, 2, 2, 3, 3};
    check("duplicates", a4, 6, e4);

    int a5[] = {42};
    int e5[] = {42};
    check("single", a5, 1, e5);

    int a6[1] = {7};
    check("empty", a6, 0, a6);   /* n = 0：循环不执行，直接通过 */

    printf("ALL INSERTION-SORT TESTS PASSED\n");
    return 0;
}
`;

/* 驱动动画的那份实现（默认折叠，不干扰主线） */
const ENGINE_EXCERPT = String.raw`export function* insertionSort(A) {
  const a = A.slice();
  const n = a.length;
  const counts = { cmp: 0, move: 0, line5: 0 };

  yield frame(1, { highlight: { sortedPrefix: 1 } });   // 第 1 行：i = 2
  for (let bi = 2; bi <= n; bi++) {                     // bi 就是书里的 i
    const key = a[bi - 1];
    let bj = bi - 1;
    yield frame(2, { pointers: { i: bi, key: bi } });   // 第 2 行：key = A[i]
    yield frame(4, { pointers: { i: bi, j: bj } });     // 第 4 行：j = i − 1

    // 第 5 行。★ 把条件拆成两步，是为了忠于书里 tᵢ 的定义：
    //   tᵢ = 第 5 行被求值的次数，含最后一次为假的那次判断。
    for (;;) {
      counts.line5++;
      if (!(bj > 0 && a[bj - 1] > key)) break;
      counts.cmp++;
      yield frame(5, { highlight: { compare: [bj, bi] } });
      a[bj] = a[bj - 1];                                // 第 6 行
      counts.move++;
      yield frame(6, { highlight: { move: [bj + 1] } });
      bj--;                                             // 第 7 行
      yield frame(7, { pointers: { j: bj } });
    }
    a[bj] = key;                                        // 第 8 行
    counts.move++;
    yield frame(8, { highlight: { active: [bj + 1], sortedPrefix: bi } });
  }
}`;

export default {
  key: 's01',
  id: 'ch02/s01',
  chapter: 2,
  section: '2.1',
  title: '插入排序',
  shortTitle: '2.1 插入排序',
  titleEn: 'Insertion sort',
  source: { printed: [17, 24], pdf: [38, 45] },
  prerequisites: [],
  sourceNote:
    '本关对应原书 2.1 节（印刷页 17–24）。阶段 7 的复杂度结论出自 2.2 节（印刷页 25 起），此处标为「预告」，完整推导是下一关。',

  stages: [
    /* ================= 阶段 0 · 位置感 ================= */
    {
      type: 'map',
      title: '先看清这一关的位置',
      why:
        '排序是整本书最省力的入口。它的问题陈述一句话就懂，却足够让你第一次遇到三样东西：' +
        '循环不变量（怎么证明算法对）、渐进记号（怎么描述快慢）、递归式（怎么分析分治）。' +
        '后面第 3 章、第 4 章都会回头拿插入排序当例子。',
      position:
        '这是全书第一个算法，位于第 2 章第 1 节。它在知识地图上没有前置依赖 —— ' +
        '你只需要会写 C 的数组和 for 循环就能开始。',
      unlocks: [
        { label: '2.2 分析算法：算出它到底多快', url: '#/ch02/s02' },
        { label: '2.3 分治法与归并排序', url: '#/ch02/s03' },
        { label: '附录 A 求和（Σ 记号）', url: '#/appendix/a/s01' },
      ],
      mathKit: [
        {
          title: 'Σ 记号（阶段 6 会用到，先在这打个底）',
          body:
            'Σ 就是「把一串东西加起来」的简写。$\\sum_{i=2}^{n} t_i$ 读作：' +
            '让 $i$ 从 2 一直取到 $n$，把每个 $t_i$ 都加起来。' +
            '例如 $\\sum_{i=2}^{4} i = 2 + 3 + 4 = 9$。' +
            '它只是记号，没有新数学，别被吓住。',
        },
      ],
    },

    /* ================= 阶段 1 · 直觉入口 ================= */
    {
      type: 'intuition',
      title: '你早就会这个算法了',
      scene: '整理一手扑克牌',
      body: [
        '原书用的就是这个类比。想象牌摊在桌上，你的左手是空的：拿起第一张牌，握在左手；' +
          '然后每次从桌上摸一张，用手里的这张牌和左手上已有的牌**从右往左**比，' +
          '找到合适的位置插进去。',
        '左边那叠牌始终是从小到大排好的 —— 这就是整个算法唯一的秘密。' +
          '你不需要记住任何新东西，插入排序只是把"整理牌"这个动作精确地写了下来。',
        '下面这副牌就是原书 Figure 2.2 用的例子：$\\langle 5, 2, 4, 6, 1, 3 \\rangle$。' +
          '自己点一遍，感受一下每一次"插进去"的动作。',
      ],
      interactive: {
        kind: 'cards-hand',
        cards: [5, 2, 4, 6, 1, 3],
        prompt: '从桌上点一张牌，把它插进左手。',
      },
    },

    /* ================= 阶段 2 · 原文精读 ================= */
    {
      type: 'source',
      title: '书上是怎么说的',
      lead:
        '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。' +
        '原文一律照抄，不做任何改写。',
      blocks: [
        {
          kind: 'definition',
          page: 17,
          en:
            'Input: A sequence of n numbers ⟨a₁, a₂, …, aₙ⟩.\n' +
            'Output: A permutation (reordering) ⟨a′₁, a′₂, …, a′ₙ⟩ of the input sequence ' +
            'such that a′₁ ≤ a′₂ ≤ ⋯ ≤ a′ₙ.',
          zh:
            '这是「排序问题」的形式化陈述，注意两个要点：' +
            '① 输入是一串数，输出是**同一串数的重新排列**（permutation）—— 不能多、不能少、不能改；' +
            '② 输出必须满足那个 ≤ 链。把这个定义记住，后面证正确性时你就知道要证什么了。',
        },
        {
          kind: 'definition',
          page: [17, 18],
          en:
            'The numbers to be sorted are also known as the keys. Although the problem is ' +
            'conceptually about sorting a sequence, the input comes in the form of an array ' +
            'with n elements. When we want to sort numbers, it’s often because they are the ' +
            'keys associated with other data, which we call satellite data. Together, a key ' +
            'and satellite data form a record.',
          zh:
            '这一段在区分「排的东西」和「跟着一起搬的东西」。' +
            '比如你要按学号排序一张成绩表：学号是 key，姓名和成绩是 satellite data，' +
            '合起来是一条 record。算法只比较 key，但搬动时整条记录要跟着走。' +
            '书里后面说"通常只关注 key"，是因为搬动开销不影响渐进阶。',
        },
        {
          kind: 'remark',
          page: 18,
          en:
            'We start with insertion sort, which is an efficient algorithm for sorting a ' +
            'small number of elements. Insertion sort works the way you might sort a hand of ' +
            'playing cards. Start with an empty left hand and the cards in a pile on the ' +
            'table. Pick up the first card in the pile and hold it with your left hand. Then, ' +
            'with your right hand, remove one card at a time from the pile, and insert it into ' +
            'the correct position in your left hand.',
          zh:
            '注意原文的一个措辞：efficient algorithm for sorting a **small** number of elements。' +
            '书上在这里就埋了伏笔 —— 插入排序适合小规模数据，这一点到 2.3 节（归并排序）' +
            '和后面的实际工程用法里还会再出现。',
        },
        {
          kind: 'remark',
          page: [21, 22],
          en:
            'Indentation indicates block structure. For example, the body of the for loop ' +
            'that begins on line 1 consists of lines 2–8, and the body of the while loop that ' +
            '… begins on line 5 contains lines 6–7 but not line 8.',
          zh:
            '这是阅读全书伪代码的第一条规矩：**缩进就是花括号**。' +
            '因此下面那张伪代码表里，第 2–8 行在 for 里面，第 6–7 行在 while 里面，' +
            '而第 8 行虽然在 while 之后，却仍然在 for 里面 —— 这是最容易看错的一处。',
        },
        {
          kind: 'remark',
          page: [22, 23],
          en:
            'Although many programming languages enforce 0-origin indexing for arrays ' +
            '(0 is the smallest valid index), we choose whichever indexing scheme is clearest ' +
            'for human readers to understand. Because people usually start counting at 1, not ' +
            '0, most—but not all—of the arrays in this book use 1-origin indexing. …\n' +
            'If you are implementing an algorithm that we specify using 1-origin indexing, ' +
            'but you’re writing in a programming language that enforces 0-origin indexing ' +
            '(such as C, C++, Java, Python, or JavaScript), then give yourself credit for ' +
            'being able to adjust. You can either always subtract 1 from each index or ' +
            'allocate each array with one extra position and just ignore position 0.',
          zh:
            '★ 对你有用的正是第二段。你有 C 基础，一定会被"书上从 1 开始、C 从 0 开始"绊到。' +
            '书上给了两个做法：**每个下标都减 1**，或者**多开一格、把 0 号位空着不用**。' +
            '本站后面所有 C 代码统一用第一种（下标减 1），并在阶段 6 给你完整的对应表。',
        },
        {
          kind: 'remark',
          page: 23,
          en:
            'The notation ":" denotes a subarray. Thus, A[i : j] indicates the subarray ' +
            'of A consisting of the elements A[i], A[i + 1], …, A[j].',
          zh:
            '`A[1 : i − 1]` 这种写法会反复出现，它就是"从第 1 个到第 i−1 个元素"这一段连续区间，' +
            '**两头都包含**。注意这个冒号记法 `A[i : j]` 是第 4 版的写法（第 3 版用的是 `A[i .. j]`，' +
            '你在别处看到过别奇怪）。',
        },
        {
          kind: 'figure-caption',
          page: 20,
          en:
            'Figure 2.2 The operation of INSERTION-SORT(A, n), where A initially contains the ' +
            'sequence ⟨5, 2, 4, 6, 1, 3⟩ and n = 6. Array indices appear above the rectangles, ' +
            'and values stored in the array positions appear within the rectangles. (a)–(e) ' +
            'The iterations of the for loop of lines 1–8. In each iteration, the blue ' +
            'rectangle holds the key taken from A[i], which is compared with the values in tan ' +
            'rectangles to its left in the test of line 5. Orange arrows show array values ' +
            'moved one position to the right in line 6, and blue arrows indicate where the key ' +
            'moves to in line 8. (f) The final sorted array.',
          zh:
            '这张图就是阶段 5 那张动画的原型。把它当成对照表：' +
            '**蓝色方块** = 第 2 行取出的 key；**褐色方块** = 第 5 行被比较的元素；' +
            '**橙色箭头** = 第 6 行的右移；**蓝色箭头** = 第 8 行的落位。' +
            '等一下看动画时，你就能一一对上。',
        },
        {
          kind: 'definition',
          page: 20,
          en:
            'Loop invariants help us understand why an algorithm is correct. When you’re using ' +
            'a loop invariant, you need to show three things:\n' +
            'Initialization: It is true prior to the first iteration of the loop.\n' +
            'Maintenance: If it is true before an iteration of the loop, it remains true ' +
            'before the next iteration.\n' +
            'Termination: The loop terminates, and when it terminates, the invariant—usually ' +
            'along with the reason that the loop terminated—gives us a useful property that ' +
            'helps show that the algorithm is correct.',
          zh:
            '这是「循环不变量」的定义，也是全书证明算法的通用套路，请当成模板背下来。' +
            '用一个类比记：**多米诺骨牌**。' +
            'Initialization = 第一张牌会倒；Maintenance = 每张倒下都会推倒下一张；' +
            'Termination = 牌倒完了，于是我们就得到了结论。' +
            '三者缺一不可 —— 少了 Termination，你可能只证明了"过程中一直对"，却没证明"最后对"。',
        },
        {
          kind: 'theorem',
          page: 20,
          en:
            'At the start of each iteration of the for loop of lines 1–8, the subarray ' +
            'A[1 : i − 1] consists of the elements originally in A[1 : i − 1], but in ' +
            'sorted order.',
          zh:
            '这就是插入排序的循环不变量，逐字对照原文读两遍，注意它说了**两件事**：' +
            '① A[1 : i−1] 里的元素**本来就是**原来那几个（没有凭空多出、也没有丢掉）；' +
            '② 它们现在**已经排好序**。第二点容易看到，第一点常常被忽略，但证 Termination 时靠的就是它。',
        },
      ],
      terms: [
        { en: 'insertion sort', zh: '插入排序', page: 17 },
        { en: 'key', zh: '关键字（用来比较的那个值）', page: 17 },
        { en: 'satellite data', zh: '卫星数据（跟着 key 一起走的附加数据）', page: 17 },
        { en: 'record', zh: '记录（key + 卫星数据）', page: 17 },
        { en: 'permutation', zh: '排列 / 重排', page: 17 },
        { en: 'loop invariant', zh: '循环不变量', page: 20 },
        { en: 'Initialization / Maintenance / Termination', zh: '初始化 / 保持 / 终止', page: 20 },
        { en: '1-origin indexing', zh: '从 1 开始的下标', page: [22, 23] },
        { en: 'subarray A[i : j]', zh: '子数组（两头都包含）', page: 23 },
      ],
    },

    /* ================= 阶段 3 · 伪代码骨架 ================= */
    {
      type: 'pseudocode',
      title: '逐行拆开这 8 行',
      algo: 'INSERTION-SORT',
      signature: 'INSERTION-SORT(A, n)',
      page: 18,
      lines: [
        { n: 1, code: 'for i = 2 to n', zh: 'i 是「现在要插哪一张牌」。从第 2 张开始，因为只有 1 张牌时天然有序。注意循环结束时 i 会变成 n + 1（书上 p.22 专门讲了这一点）。' },
        { n: 2, code: '    key = A[i]', zh: '把当前这张牌先拿出来攥在手里，记作 key。为什么要先拿出来？因为下一步右移会覆盖掉 A[i] 这个位置。' },
        { n: 3, code: '    // Insert A[i] into the sorted subarray A[1 : i − 1].', zh: '注释行。书上 p.29 明确说「注释不是可执行语句，不计时间」，所以原书 p.30 的代价表里它的 cost 记 0（times 仍是 $n-1$）。' },
        { n: 4, code: '    j = i − 1', zh: 'j 从左边那叠牌的**最右边**开始，准备往左找位置。' },
        { n: 5, code: '    while j > 0 and A[j] > key', zh: '★ 两个条件缺一不可：j > 0 是防止越界（牌看完了就停），A[j] > key 是判断"这张牌要不要给它让位"。注意 and 是短路的：j = 0 时后面的 A[j] 根本不会被求值，这条细节在阶段 6 数 tᵢ 时非常关键。' },
        { n: 6, code: '        A[j + 1] = A[j]', zh: '比 key 大的元素整体右移一格，给 key 腾位置。这正是 Figure 2.2 里橙色箭头画的动作。' },
        { n: 7, code: '        j = j − 1', zh: '继续往左看下一张。' },
        { n: 8, code: '    A[j + 1] = key', zh: '退出 while 时，j 要么是 0，要么 A[j] ≤ key。两种情况下 key 的正确位置都恰好是 j + 1。把 key 放下，这一轮结束 —— 此时 A[1 : i] 已经有序。' },
      ],
      vars: [
        { name: 'A', meaning: '待排序的数组，`A[1 : n]` 存放 n 个值（书上从 1 开始编号）' },
        { name: 'n', meaning: '数组里元素的个数，也就是问题的"规模"' },
        { name: 'i', meaning: '本轮要插入的元素下标。循环结束后它的值是 `n + 1`' },
        { name: 'key', meaning: '本轮被拿在手里、等待插入的那个值，等于 `A[i]` 的原值' },
        { name: 'j', meaning: '在已排序区间 `A[1 : i − 1]` 里从右往左扫描的下标' },
      ],
      note:
        '读这段伪代码时请特别留意第 8 行的缩进层级：它在 while 循环**外面**，但在 for 循环**里面**。' +
        '缩进搞错，算法就完全变了（会变成每轮只搬一次）。',
    },

    /* ================= 阶段 4 · 动手看见 ================= */
    {
      type: 'visualize',
      title: '看着它一步步跑',
      viz: 'array',
      algorithm: 'insertion-sort',
      pseudocodeRef: 'INSERTION-SORT',
      input: { array: [5, 2, 4, 6, 1, 3] },
      invariants: [{ label: 'A[1 : i − 1] 是原来的那些元素，且已排序' }],
      presets: [
        { name: '原书 Figure 2.2 的数组', array: [5, 2, 4, 6, 1, 3] },
        { name: '已经排好序（最好情况）', array: [1, 2, 3, 4, 5, 6] },
        { name: '完全逆序（最坏情况）', array: [6, 5, 4, 3, 2, 1] },
        { name: '原书习题 2.1-1 的数组', array: [31, 41, 59, 26, 41, 58] },
      ],
      tasks: [
        '先选「原书 Figure 2.2 的数组」，一路单步走完，数一数第 5 行一共被求值了几次。',
        '换成「已经排好序」，观察每轮 while 是不是只看一眼就退出来了。',
        '再换成「完全逆序」，看看计数器的数字涨得多快 —— 记住这个感觉，阶段 7 要拿它数次数。',
      ],
    },

    /* ================= 阶段 5 · 双轨实现 ================= */
    {
      type: 'code',
      title: '从伪代码到 C',
      intro:
        '对照时只看一件事：**书上每个下标减 1**。书上 `A[i]`，C 里就是 `a[i-1]`。' +
        '书上代码一个字符都不用改，包括 `while` 的两个条件顺序都不能换。',
      pseudocodeRef: 'INSERTION-SORT',
      c: {
        file: 'insertion_sort.c',
        code: C_IMPL,
        notes: [
          { line: 4, zh: 'for 的初值是 `i = 1` 而不是书上的 2 —— 因为 C 下标从 0 开始，书上的 A[2] 就是 a[1]。循环次数仍然是 n − 1 次，与书上完全一致。' },
          { line: 6, zh: '`int j = i - 1` 对应书上第 4 行的 `j = i − 1`。这里的 i 是 C 的下标，比书上小 1，所以这个减法在两边形式一样但含义差 1，心里要有数。' },
          { line: 7, zh: '★ 最关键的改动：书上 `while j > 0`，C 里必须是 `j >= 0`。因为 C 数组允许下标 0，而书上把 0 当作"越界哨兵"。写错成 `j > 0` 会漏掉第一个元素，这是这个算法最常见的 bug。' },
          { line: 12, zh: '`a[j + 1] = key` 与书上第 8 行逐字对应，下标不用再额外减 —— 因为 j 本身已经是减过 1 的。' },
        ],
        tests: [
          { in: '[5, 2, 4, 6, 1, 3]', out: '[1, 2, 3, 4, 5, 6]' },
          { in: '[6, 5, 4, 3, 2, 1]', out: '[1, 2, 3, 4, 5, 6]（最坏情况）' },
          { in: '[12, 3, 7, 9, 14, 6, 11, 2]', out: '[2, 3, 6, 7, 9, 11, 12, 14]' },
          { in: '[2, 2, 1, 1, 3, 3]', out: '[1, 1, 2, 2, 3, 3]（含重复元素）' },
          { in: '[42]', out: '[42]（单元素）' },
          { in: 'n = 0', out: '空数组，循环不执行，直接通过' },
        ],
      },
      mapping: [
        { pc: 1, pcCode: 'for i = 2 to n', c: 'for (int i = 1; i < n; i++)' },
        { pc: 2, pcCode: 'key = A[i]', c: 'int key = a[i];' },
        { pc: 3, pcCode: '// 注释', c: '（不译，注释不占时间）' },
        { pc: 4, pcCode: 'j = i − 1', c: 'int j = i - 1;' },
        { pc: 5, pcCode: 'while j > 0 and A[j] > key', c: 'while (j >= 0 && a[j] > key)' },
        { pc: 6, pcCode: 'A[j + 1] = A[j]', c: 'a[j + 1] = a[j];' },
        { pc: 7, pcCode: 'j = j − 1', c: 'j--;' },
        { pc: 8, pcCode: 'A[j + 1] = key', c: 'a[j + 1] = key;' },
      ],
      engine: {
        lang: 'js',
        code: ENGINE_EXCERPT,
        note:
          '这份 JS 生成器就是页面上动画的数据源。`counts.line5` 恰好就是阶段 6 要讲的 Σtᵢ。',
      },
    },

    /* ================= 阶段 6 · 复杂度（预告） ================= */
    {
      type: 'analyze',
      title: '先数一数：这一步到底跑了多少次',
      intro:
        '这一节先不推导公式，只做一件你能亲手验证的事：**数次数**。' +
        '而"数"的那个量，书里给了名字，叫 tᵢ。',
      claims: [
        {
          expr: '\\Sigma_{i=2}^{n} t_i = \\dfrac{n(n+1)}{2} - 1',
          when: '最坏情况：输入完全逆序，tᵢ = i',
          page: [30, 31],
          preview: true,
          source: 'book',
        },
        {
          expr: 'T(n) = an + b',
          when: '最好情况：输入已排序，tᵢ = 1，运行时间是 n 的线性函数',
          page: [30],
          preview: true,
          source: 'book',
        },
        {
          expr: '\\Theta(n^2)',
          when: '最坏情况 → 二次函数；结合渐进记号即得此结论（第 3 章正式定义）',
          page: [31],
          preview: true,
          source: 'book',
        },
      ],
      tables: [
        {
          caption: 'Figure 2.2 的逐轮手工统计（数组 ⟨5, 2, 4, 6, 1, 3⟩，n = 6）',
          rows: [
            ['i = 2', 't₂ = 2', true],
            ['i = 3', 't₃ = 2', true],
            ['i = 4', 't₄ = 1', true],
            ['i = 5', 't₅ = 5', true],
            ['i = 6', 't₆ = 4', true],
            ['合计', 'Σtᵢ = 2 + 2 + 1 + 5 + 4 = 14', true],
          ],
        },
        {
          caption: '原书 p.30 的代价表（每条语句的代价与执行次数，逐字照录）',
          rows: [
            ['第 1 行 for i = 2 to n', 'c₁ · n', true],
            ['第 2 行 key = A[i]', 'c₂ · (n − 1)', true],
            ['第 3 行 // 注释', '0 · (n − 1)', true],
            ['第 4 行 j = i − 1', 'c₄ · (n − 1)', true],
            ['第 5 行 while …', 'c₅ · Σtᵢ', true],
            ['第 6 行 A[j + 1] = A[j]', 'c₆ · Σ(tᵢ − 1)', true],
            ['第 7 行 j = j − 1', 'c₇ · Σ(tᵢ − 1)', true],
            ['第 8 行 A[j + 1] = key', 'c₈ · (n − 1)', true],
          ],
        },
      ],
      chart: {
        xMax: 16,
        series: [
          { name: '最好情况 Σtᵢ = n − 1', color: '--viz-done', expr: 'n - 1' },
          { name: '最坏情况 Σtᵢ = n(n+1)/2 − 1', color: '--viz-compare', expr: 'n*(n+1)/2 - 1' },
        ],
      },
      derivations: [
        {
          title: '为什么最坏情况是 n(n+1)/2 − 1',
          steps: [
            {
              zh: '最坏情况（数组完全逆序）下，每一轮手里那张牌都要一路走到最左边，' +
                  '所以第 5 行会被反复求值 —— 书里把次数记作 tᵢ，此时 tᵢ = i。',
            },
            {
              tex: '\\sum_{i=2}^{n} i = \\left(\\sum_{i=1}^{n} i\\right) - 1 = \\frac{n(n+1)}{2} - 1',
              zh: '把 i 从 2 加到 n，等于从 1 加到 n 再减掉那个 1。' +
                  '这一步用的是附录 A 的公式 (A.2)（印刷页 1141），原书 p.31 就是这么写的。',
            },
            {
              zh: '代回原书 p.31 的 T(n) 表达式，你会得到一个关于 n 的二次式，' +
                  '即 $T(n) = an^2 + bn + c$。因为 n² 项占主导，所以最坏情况是二次的。',
            },
          ],
        },
      ],
      note:
        '★ 两件事要说清楚。' +
        '第一，上面带「预告」标记的结论出自 **2.2 节（印刷页 25 起）**，' +
        '完整的 T(n) 推导是下一关「2.2 分析算法」的内容，这里只给你一个抓手。' +
        '第二，注意 tᵢ 的定义是「**第 5 行被求值的次数**」，' +
        '而每轮 while 退出时那次"求值为假"的判断**也要算进去** —— ' +
        '所以 Σtᵢ 比"真正发生了搬移的比较次数"多 n − 1 次。' +
        '这就是为什么阶段 4 的计数器把「第 5 行求值 Σtᵢ」和「触发搬移」分开显示。',
    },

    /* ================= 阶段 7 · 正确性 ================= */
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement:
        'At the start of each iteration of the for loop of lines 1–8, the subarray ' +
        'A[1 : i − 1] consists of the elements originally in A[1 : i − 1], but in ' +
        'sorted order.',
      page: 20,
      intro:
        '下面三步逐条对应循环不变量的三个性质，正文是原书 p.21 的论证思路，' +
        '中文是本站的展开与补白。',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: 'We start by showing that the loop invariant holds before the first loop iteration, when i = 2.',
          page: 21,
          body: [
            '第一次进入循环时 i = 2，那么 `A[1 : i − 1]` 就是 `A[1 : 1]` —— 只有一个元素。',
            '一个元素的数组当然是有序的（书上原话反问："how could a subarray with just one value not be sorted?"），' +
              '而且这个元素本来就是原来在 A[1] 的那个。两件事都成立，初始化这一步完成。',
            '书上 p.21 脚注 2 补了一个细节：for 循环的"首次迭代前"指的是**给 i 赋了 2 之后、第一次判断 i ≤ n 之前**。',
          ],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: 'Next, we tackle the second property: showing that each iteration maintains the loop invariant.',
          page: 21,
          body: [
            '这一轮做的事情是：把 `A[i−1], A[i−2], A[i−3] …` 依次右移一格，' +
              '直到找到 `A[i]` 该待的位置（书上注明是第 4–7 行），然后把 key 放进去（第 8 行）。',
            '搬完之后，`A[1 : i]` 里的元素正是原先 `A[1 : i]` 那几个，而且已经有序。' +
              '下一轮 i 加 1，于是不变量在"下一轮开始前"依然成立。',
            '书在这里做了一件有意思的事（原书 p.21）：他说严格证明 while 循环（第 5–7 行）也有自己的不变量，' +
              '但**现在先不陷进那种形式主义**，先用非形式化的论证带过。' +
              '这是本书的一个风格 —— 先把直觉立住，形式化留到需要时。',
          ],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: 'Finally, we examine loop termination. The loop variable i starts at 2 and increases by 1 in each iteration.',
          page: 21,
          body: [
            'i 从 2 开始，每轮加 1，一旦 i 超过 n 循环就停 —— 也就是 **i 等于 n + 1 时停**。',
            '把 i = n + 1 代进不变量：`A[1 : n]` 里是原来的那些元素，而且已经排好序。' +
              '这正是"排序问题"定义要求的输出（阶段 3 的第一条原文）。',
            '**算法正确。** 注意这一步为什么必要：只有前两步，你只证明了"过程中一直对"，' +
              '而"最后也对"必须靠循环真的会停 + 停的时候不变量说什么。',
          ],
        },
      ],
      conclusion:
        '三步走完，插入排序的正确性就证完了。这套「初始化 → 保持 → 终止」是模板，' +
        '后面第 2.1-2、2.1-4 题都要求你自己套一遍 —— 那正是我们在闯关区留给你的练习。' +
        '书上也说，这个方法会在全书反复使用。',
    },

    /* ================= 阶段 8 · 闯关测验 ================= */
    {
      type: 'drill',
      title: '检验一下',
      items: [
        {
          kind: 'judge',
          q: '插入排序只用了常数额外空间，所以它是「原地排序（in-place）」。',
          answer: true,
          why:
            '它只用了 i、j、key 三个变量，与 n 无关。不过要注意：这一点最好自己能从伪代码看出来，' +
            '而不是当成结论背 —— 看第 2 行，key 只存了一个元素。',
        },
        {
          kind: 'single',
          q: '在原书 Figure 2.2 的数组 ⟨5, 2, 4, 6, 1, 3⟩ 上，i = 3 那一轮，第 5 行被求值了几次？',
          options: ['1 次', '2 次', '3 次', '4 次'],
          answer: 1,
          why:
            'i = 3 时 key = 4，j 从 2 开始：先判断 A[2] = 5 > 4 成立（第 1 次求值），搬移；' +
            'j 变成 1，再判断 A[1] = 2 > 4 不成立（第 2 次求值），退出。' +
            '所以 t₃ = 2。注意那次**不成立**的求值也算一次 —— 这正是 tᵢ 定义里最容易数错的地方。',
        },
        {
          kind: 'single',
          q: '当 i = 6 时，循环不变量说的是哪个子数组已经有序？',
          options: ['A[1 : 6]', 'A[1 : 5]', 'A[1 : 4]', 'A[6 : 6]'],
          answer: 1,
          why:
            '不变量说的是 A[1 : i − 1]。i = 6 时就是 A[1 : 5]。' +
            '换句话说，进入这一轮之前，前 5 个元素已经排好了，这一轮的工作是把第 6 个插进去。',
        },
        {
          kind: 'judge',
          q: '伪代码第 3 行是一条注释，在原书 p.30 的代价表中它的执行次数记作 0。',
          answer: false,
          why:
            '陷阱题。原文 p.30 的表中，第 3 行的 **cost 是 0**，但 **times 是 n − 1**（因为它跟着循环走 n−1 次）。' +
            '书上的原话是"注释不是可执行语句，所以假设它们不花时间"（p.29），' +
            '也就是 cost 为 0，所以代价乘积 c₃·(n−1) = 0，对总时间没有贡献。',
        },
        {
          kind: 'simulate',
          q: '在 ⟨5, 2, 4, 6, 1, 3⟩ 上，i = 4 那一轮结束后，数组是什么？（用空格分隔）',
          expect: [2, 4, 5, 6, 1, 3],
          placeholder: '例如：2 4 5 6 1 3',
          why:
            'i = 4 时 key = 6。比较 A[3] = 5 > 6 不成立，所以一次都没搬，key 原地放回。' +
            '此时 A[1 : 4] = ⟨2, 4, 5, 6⟩ 有序。你可以回阶段 5 用单步验证。',
        },
        {
          kind: 'judge',
          q: '循环不变量必须证明 Initialization 和 Maintenance 就足够了，Termination 是多余的。',
          answer: false,
          why:
            '错。缺了 Termination 就只能推出"过程中一直成立"，推不出"结束时成立"。' +
            '书里甚至说第三条或许是最重要的（p.20 之后那段），因为你要靠它把不变量接到最终结论上。',
        },
      ],
      bookExercises: [{
          id: '2.1-1',
          page: 24,
          star: 0,
          statement:
            'Using Figure 2.2 as a model, illustrate the operation of INSERTION-SORT on an ' +
            'array initially containing the sequence ⟨31, 41, 59, 26, 41, 58⟩.',
          hint:
            '阶段 4 的下拉框里已经有这个数组，切成「原书习题 2.1-1 的数组」，一步步单步走完，' +
            '每一步抄下来，就是这道题的答案。注意这组数据里有重复的 41 —— 想想重复值会影响什么。',
        },
        {
          id: '2.1-2',
          page: 24,
          star: 0,
          statement:
            'Consider the procedure SUM-ARRAY on the facing page. It computes the sum of the n numbers in array A[1 : n]. State a loop invariant for this procedure, and use its initialization, maintenance, and termination properties to show that the SUM- ARRAY procedure returns the sum of the numbers in A[1 : n].',
          hint:
            'SUM-ARRAY 的伪代码在原书印刷页 25。照抄阶段 8 的三步模板就行。' +
            '关键是写出正确的不变量：试着写成「进入第 i 轮时，sum 等于 A[1 : i−1] 的和」，' +
            '然后你会发现 Termination 时 i = n + 1，结论自然就是全部的和。',
        },
        {
          id: '2.1-3',
          page: 25,
          star: 0,
          statement:
            'Rewrite the INSERTION-SORT procedure to sort into monotonically decreasing ' +
            'instead of monotonically increasing order.',
          hint:
            '只需要动第 5 行的比较方向。但别急着改成 A[j] < key 就交卷 —— ' +
            '请顺手检查一下：循环不变量变成什么了？初始化和保持还成立吗？',
        },
        {
          id: '2.1-4',
          page: 25,
          star: 0,
          statement:
            'Consider the searching problem: Input: A sequence of n numbers ⟨a₁, a₂, …, aₙ⟩ ' +
            'stored in array A[1 : n] and a value x. Output: An index i such that x equals ' +
            'A[i] or the special value NIL if x does not appear in A. Write pseudocode for ' +
            'linear search, which scans through the array from beginning to end, looking for ' +
            'x. Using a loop invariant, prove that your algorithm is correct. Make sure that ' +
            'your loop invariant fulfills the three necessary properties.',
          hint:
            '不变量可以写成「进入第 i 轮时，x 不在 A[1 : i−1] 中」。' +
            '然后仔细想 Termination 那一步为什么能得出正确结论 —— 这道题的价值全在那儿，' +
            '因为返回值有 NIL 和下标两种可能，得分开讨论。',
        },
        {
          id: '2.1-5',
          page: 25,
          star: 0,
          statement:
            'Consider the problem of adding two n-bit binary integers a and b, stored in two n-element arrays A[0 : n − 1] and B[0 : n − 1], where each element is either 0 or 1, a = P n−1 i D0 A[i] • 2 i , and b = P n−1 i D0 B[i] • 2 i . The sum c = a + b of the two integers should be stored in binary form in an (n + 1)-element array C[0 : n], where c = P n i D0 C[i] • 2 i . Write a procedure ADD-BINARY-INTEGERS that takes as input arrays A and B , along with the length n, and returns array C holding the sum.',
          hint:
            '就是小学的竖式加法，唯一的新东西是**进位 carry**。建议从低位往高位扫（i 从 0 到 n−1），' +
            '每轮算 A[i] + B[i] + carry，把和模 2 放进 C[i]，把和除以 2 作为新的 carry。' +
            '别忘了最后 C[n] 要放最后的进位 —— 这正是答案数组为什么是 n+1 位。' +
            '注意本题的数组是从 0 开始编号的，这是原书少数使用 0-origin 的地方。',
        },
      ],
    },
  ],
};
