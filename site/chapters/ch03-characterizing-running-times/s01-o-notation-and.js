/* =============================================================================
 * 第 3 章 3.1 —— 第 s01 关：3.1 O-notation, Ω-notation, and Θ-notation
 *
 * 原文锚点：印刷页 50–52（pdf_index 71–73）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 `【TODO …】` 处需人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's01',
  id: 'ch03/s01',
  chapter: 3,
  section: '3.1',
  title: '【TODO 中文标题】',
  shortTitle: '3.1 【TODO 中文标题】',
  titleEn: 'O-notation, Ω-notation, and Θ-notation',
  source: { printed: [50, 52], pdf: [71, 73] },
  sourceNote: '本关对应原书 3.1 节（印刷页 50–52）。',
  prerequisites: [],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '【TODO 标题，如「先看清这一关的位置」】',
      why: '【TODO 为什么学这一关：这一节解决什么问题，为什么值得先学】',
      position: '【TODO 知识地图上的位置：前置是什么，为后面哪些章节铺路】',
      unlocks: [
        { label: '3.2 Asymptotic notation: formal definitions', url: '#/ch03/s02' },
        // 想预告后面章节也能这么写（闸门会以 WARN 提示该章尚未构建，属正常）：
        // { label: '第 4 章 分治法', url: '#/ch04/s01' },
      ],
      mathKit: [],        // 【TODO 本节用到的数学工具，2–3 条】
    },

    // ——— 阶段 2 直觉入口 ———————————————————————————————————————
    {
      type: 'intuition',
      title: '【TODO 标题】',
      scene: '【TODO 一个具体的生活场景，一句话（原书没有类比时也要自己造一个）】',
      body: [
        '【TODO 2–4 段中文，把生活场景接到本节内容上】',
      ],
      interactive: { text: '【TODO 可选：这里放一段动手玩的小交互说明；要换成翻牌演示就写 { kind: \'cards-hand\', cards: [...], prompt: \'…\' }】' },
    },

    // ——— 阶段 3 原文精读 ———————————————————————————————————————
    // 下面的 en 与 page 逐字取自 data/blocks/part-i-foundations__ch03.json，每条都已通过溯源判据。
    // 请勿改写 en；每条补上 zh（中文解读）即可。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 50,
          en: 'When we analyzed the worst-case running time of insertion sort in Chapter 2, we started with the complicated expression',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 50,
          en: 'We then discarded the lower-order terms (c 1 + c 2 + c 4 + c 5/2 − c 6/2 − c 7/2 + c 8 )n and c 2 + c 4 + c 5 + c 8 , and we also ignored the coefficient c 5/2 + c 6/2 + c 7/2 of n 2 . That left just the factor n 2 , which we put into Θ-notation as Θ(n 2 ). We use this style to characterize running times of algorithms: discard the lower-order terms and the coefficient of the leading term, and use a notation that focuses on the rate of growth of the running time.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 50,
          en: 'Θ-notation is not the only such "asymptotic notation." In this section, we’ll see other forms of asymptotic notation as well. We start with intuitive looks at these notations, revisiting insertion sort to see how we can apply them. In the next section, we’ll see the formal definitions of our asymptotic notations, along with conventions for using them.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 50,
          en: 'Before we get into specifics, bear in mind that the asymptotic notations we’ll see are designed so that they characterize functions in general. It so happens that the functions we are most interested in denote the running times of algorithms. But asymptotic notation can apply to functions that characterize some other aspect of algorithms (the amount of space they use, for example), or even to functions that have nothing whatsoever to do with algorithms.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 50,
          en: 'O-notation characterizes an upper bound on the asymptotic behavior of a function.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 50,
          en: 'In other words, it says that a function grows no faster than a certain rate, based on the highest-order term. Consider, for example, the function 7n 3 + 100n 2 − 20n + 6.',
          zh: '【TODO 中文解读】' },
      ],
      terms: [],       // 【TODO 术语卡：{ en: '英文', zh: '中文', page: 页码 }】
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // lines 的 n / code 逐字取自 data/blocks，行号即原书行号。
    // 点行展开中文：给需要解释的行补 zh 字段（不补则该行不可点）。
    {
      type: 'pseudocode',
      title: '逐行拆开这 8 行',
      algo: 'INSERTION-SORT',
      signature: 'INSERTION-SORT',
      page: 51,
      lines: [
        { n: 1, code: 'for i = 2 to n' },
        { n: 2, code: 'key = A[i]' },
        { n: 3, code: '/ / Insert A[i] into the sorted subarray A[1 : i − 1].' },
        { n: 4, code: 'j = i − 1' },
        { n: 5, code: 'while j >0 and A[j]>  key' },
        { n: 6, code: 'A[j + 1] = A[j]' },
        { n: 7, code: 'j = j − 1' },
        { n: 8, code: 'A[j + 1] = key' },
      ],
      vars: [],        // 【TODO 变量表：{ name: 'i', meaning: '…' }】
      note: '',        // 【TODO 可选：一句总结，如「注意循环结束时 i = n + 1」】
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着它一步步跑',
      viz: 'array',       // 'array' | 'tree'（见 site/assets/viz/）
      algorithm: null,    // 【TODO 算法生成器名（见 site/assets/algorithms/）】
      pseudocodeRef: 'INSERTION-SORT',
      input: { array: [] },   // 【TODO 默认输入数组】
      invariants: [
        // { label: '一句话描述不变量，动画里会实时显示是否成立' },
        { label: '【TODO 不变量】' },
      ],
      presets: [],     // 【TODO 2–4 组预设输入，至少要有原书图里那组】
      tasks: ['【TODO 2–3 条让学生自己动手验证的小任务】'],
    },

    // ——— 阶段 6 双轨实现 ———————————————————————————————————————
    {
      type: 'code',
      title: '从伪代码到 C',
      intro: '对照时只看一件事：**书上每个下标减 1**。书上 `A[i]`，C 里就是 `a[i-1]`。',
      pseudocodeRef: 'INSERTION-SORT',
      c: {
        file: '【TODO 如 insertion_sort.c】',
        code: '// 【TODO 把 c/<name>.c 的全文粘到这里；两份必须逐字节一致（闸门会查）】',
      },
      mapping: [],     // 【TODO 伪代码行 ↔ C 行的对应表：{ line: 1, c: 'for (int i = 1; …)' }】
    },

    // ——— 阶段 7 复杂度 —————————————————————————————————————————
    {
      type: 'analyze',
      title: '【TODO 标题】',
      intro: '【TODO 这一阶段要回答什么问题】',
      claims: [
        // 【TODO 每条复杂度断言都要给 page 出处；自己推导的写 source: 'instructor'】
        // 引用本关范围之外的页码（如本节结论在第 4 章）必须加 preview: true。
        // { expr: '\\Theta(n \\lg n)', when: '最坏情况', page: [50], source: 'book' },
      ],
      tables: [],      // { caption: '表标题', rows: [['左列', '右列', true]] }
      chart: null,     // { series: [{ name: 'n lg n', expr: 'n * Math.log2(n)' }], xMax: 16 }
      derivations: [], // { kind: 'summation', title: '推导标题', steps: [{ tex: '…', zh: '…' }] }
      note: ''
    },

    // ——— 阶段 8 正确性 —————————————————————————————————————————
    // statement / en 也要逐字取自原书（去 data/blocks 里找，别凭记忆写）。
    {
      type: 'prove',
      title: '凭什么说它一定对',
      statement: '【TODO 要证的不变量（原书原文，逐字）】',
      page: 50,
      intro: '【TODO 导读：下面三步分别对应不变量的哪一条性质】',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 50,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 51,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 52,
          body: ['【TODO 中文展开与补白】'],
        },
      ],
      conclusion: '【TODO 收束：由 Termination 得到什么结论】',
    },

    // ——— 阶段 9 闯关测验 ———————————————————————————————————————
    // items 三种题型：judge（判断，answer 是 true/false）、
    //   single（单选，answer 是正确选项下标）、simulate（动手模拟，steps + answer）
    {
      type: 'drill',
      title: '检验一下',
      items: [
        // 【TODO 6–8 道。题目要能一眼看出是本节的内容，但答案必须能从原文/动画推出来】
      ],
      bookExercises: [
        { id: '3.1-1', page: 53, star: 0,
          statement: 'Modify the lower-bound argument for insertion sort to handle input sizes that are not necessarily a multiple of 3.',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '3.1-2', page: 53, star: 0,
          statement: 'Using reasoning similar to what we used for insertion sort, analyze the running time of the selection sort algorithm from Exercise 2.2-2.',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '3.1-3', page: 53, star: 0,
          statement: 'Suppose that ˛ is a fraction in the range 0 < ˛ < 1. Show how to generalize the lower-bound argument for insertion sort to consider an input in which the ˛n largest values start in the first ˛n positions. What additional restriction do you need to put on ˛? What value of ˛ maximizes the number of times that the ˛n largest values must pass through each of the middle .1 − 2˛/n array positions?',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
      ],
    },
  ],
};
