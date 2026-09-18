/* =============================================================================
 * 第 D 章 D.2 —— 第 s02 关：D.2 Basic matrix properties
 *
 * 原文锚点：印刷页 1219–1290（pdf_index 1240–1311）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 `【TODO …】` 处需人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's02',
  id: 'appendix/d/s02',
  chapter: 'D',
  section: 'D.2',
  title: '矩阵的基本性质',
  shortTitle: 'D.2 矩阵的基本性质',
  titleEn: 'Basic matrix properties',
  source: { printed: [1219, 1290], pdf: [1240, 1311] },
  sourceNote: '本关对应原书 D.2 节（印刷页 1219–1290）。',
  prerequisites: [
    { label: 'D.1 Matrices and matrix operations', url: '#/appendix/d/s01' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '【TODO 标题，如「先看清这一关的位置」】',
      why: '【TODO 为什么学这一关：这一节解决什么问题，为什么值得先学】',
      position: '【TODO 知识地图上的位置：前置是什么，为后面哪些章节铺路】',
      unlocks: [
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
    // 下面的 en 与 page 逐字取自 data/blocks/part-viii-appendix-mathematical-background__chD.json，每条都已通过溯源判据。
    // 请勿改写 en；每条补上 zh（中文解读）即可。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1219,
          en: 'D.2 Basic matrix properties 1219 x T y = n X i D1 x i y i is a scalar number (actually a 1 × 1 matrix) called the inner product of x and y .',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1219,
          en: 'We also use the notation ⟨x,y⟩ to denote x T y . The inner-product operator is commutative: ⟨x,y⟩ = ⟨y,x⟩. The matrix xy T is an n × n matrix Z called the outer product of x and y , where ´ ij = x i y j . The (euclidean) norm kx k of an n-vector x is defined by kx k = (x 2',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1219,
          en: 'Thus, the norm of x is its length in n-dimensional euclidean space. A useful fact, which follows from the equality ã',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1219,
          en: '2 + • • • + x 2 n ) 1/2 is that for any real number a and n-vector x , kax k = |a| kx k : (D.3)',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1219,
          en: 'Show that if A and B are symmetric n × n matrices, then so are A + B and A − B .',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1219,
          en: 'Prove that if P is an n × n permutation matrix and A is an n × n matrix, then the matrix product PA is A with its rows permuted, and the matrix product AP is A with its columns permuted. Prove that the product o f two permutation matrices is a permutation matrix.',
          zh: '【TODO 中文解读】' },
      ],
      terms: [],       // 【TODO 术语卡：{ en: '英文', zh: '中文', page: 页码 }】
    },

    // ——— 阶段 4 伪代码 —————————————————————————————————————————
    // lines 的 n / code 逐字取自 data/blocks，行号即原书行号。
    // 点行展开中文：给需要解释的行补 zh 字段（不补则该行不可点）。
    {
      type: 'pseudocode',
      // 【TODO 本节在原书里没有伪代码块（data/blocks 查不到）】
      // 若确实没有，请整段删掉这个阶段；若应该有，先检查分块流水线。
      title: '【TODO 标题】',
      algo: null,
      signature: '',
      page: 1219,
      lines: [],
      vars: [],
      note: '',
    },

    // ——— 阶段 5 动手看见 ———————————————————————————————————————
    {
      type: 'visualize',
      title: '看着它一步步跑',
      viz: 'array',       // 'array' | 'tree'（见 site/assets/viz/）
      algorithm: null,    // 【TODO 算法生成器名（见 site/assets/algorithms/）】
      pseudocodeRef: null,
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
      pseudocodeRef: null,
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
        // { expr: '\\Theta(n \\lg n)', when: '最坏情况', page: [1219], source: 'book' },
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
      page: 1219,
      intro: '【TODO 导读：下面三步分别对应不变量的哪一条性质】',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1219,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1220,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1221,
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
        { id: '0-1', page: 1226, star: 0,
          statement: 'matrix A with full rank and some n-bit vector c , a linear permutation. d. Use a counting argument to show that the number of linear permutations of S n is much less than the number of permutations of S n . e. Give an example of a value of n and a permutation of S n that cannot be achieved by any linear permutation. ( Hint: For a given permutation, think about how multiplying a matrix by a unit vector relates to the columns of the matrix.)',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1254, star: 0,
          statement: '-4 trees, 502, 518 pr.',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1254, star: 0,
          statement: 'trees, 358, 519 weight-balanced trees, 358, 472 pr. balls and bins, 1433144, 1212 pr. base-a pseudoprime, 944 base case of a divide-and-conquer algorithm, 34, 76 of a recurrence, 41, 77378 base, in DNA, 393 basis function, 841',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1254, star: 0,
          statement: '-4 trees, 502, 518 pr.',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1254, star: 0,
          statement: 'trees, 358, 519 van Emde Boas trees, 478 weight-balanced trees, 358 data type, 26 decision by an algorithm, 1053 decision problem, 1045, 1049 and optimization problems, 1045 decision tree, 2063207, 219 pr. decision variable, 851',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1256, star: 0,
          statement: '-4 trees, 502',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '0-1', page: 1270, star: 0,
          statement: ', 428, 430 ex., 1134 pr. k-neighbor tree, 358 knot, of a spline, 847 pr.',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '0-1', page: 1286, star: 0,
          statement: 'sorting lemma, 222 pr. sorting network, 789 source vertex, 554, 605, 671, 674 span, 757 span law, 758 spanning tree, 585 bottleneck, 601 pr. maximum, 1134 pr. verification of, 603 see also minimum spanning tree sparse graph, 549 all-pairs shortest paths for, 662–667 and Prim’s algorithm, 599 pr. sparse matrix, 81 spawn, in pseudocode, 752–754 spawning, 753 speedup, 758 of a randomized parallel algorithm, 789 pr. spindle in a disk drive, 498 spine of a string-matching automaton, 970 splay tree, 359, 478 splicing in a binary search tree, 324–325 in a linked list, 260–261 spline, 847 pr. splitting of B-tree nodes, 506–508 of 2-3-4 trees, 518 pr. splitting summations, 1148–1149 spurious hit, 965 square matrix, 1215 square of a directed graph, 553 ex. square root, modulo a prime, 954 pr. squaring, repeated for all-pairs shortest paths, 652–653 for raising a number to a power, 934',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1289, star: 0,
          statement: ', 358, 519',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1289, star: 0,
          statement: '-4, 502, 518 pr. van Emde Boas, 478 walk of, 314, 320 ex., 1112 weight-balanced trees, 358',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1290, star: 0,
          statement: '-4 tree, 502, 518 pr.',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
        { id: '2-3', page: 1290, star: 0,
          statement: 'tree, 358, 519 unary, 1050 unbounded competitive ratio, 804 unbounded linear program, 854 uncle, 340 unconditional branch instruction, 26 unconstrained gradient descent, 1023–1031 uncountable set, 1156 underdetermined system of linear equations, underflow of a queue, 256 of a stack, 255 undirected graph, 1164 articulation point of, 582 pr. biconnected component of, 582 pr. bridge of, 582 pr. clique in, 1081 coloring of, 1100 pr., 1176 pr. computing a minimum spanning tree in, 585–603 d -regular, 716 ex., 740 pr. grid, 697 pr. hamiltonian, 1056 independent set of, 1099 pr. matching in, 693–697, 704–743 nonhamiltonian, 1056 vertex cover of, 1084, 1106 see also graph undirected version of a directed graph, 1167 uniform family of hash functions, 287 uniform hash function, 278 uniform hashing, 295 uniform probability distribution, 1186–1187 uniform random permutation, 128, 136 union of languages, 1052 of linked lists, 264 ex. of sets ([), 1154',
          hint: '【TODO 提示：卡住时给一句方向，不要直接给答案】' },
      ],
    },
  ],
};
