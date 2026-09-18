/* =============================================================================
 * 第 C 章 C.3 —— 第 s03 关：C.3 Discrete random variables
 *
 * 原文锚点：印刷页 1191–1195（pdf_index 1212–1216）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 `【TODO …】` 处需人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's03',
  id:'chC/s03',
  chapter: 'C',
  section: 'C.3',
  title: '离散随机变量',
  shortTitle: 'C.3 离散随机变量',
  titleEn: 'Discrete random variables',
  source: { printed: [1191, 1195], pdf: [1212, 1216] },
  sourceNote: '本关对应原书 C.3 节（印刷页 1191–1195）。',
  prerequisites: [
    { label: 'C.2 Probability', url: '#/appendix/c/s02' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '【TODO 标题，如「先看清这一关的位置」】',
      why: '【TODO 为什么学这一关：这一节解决什么问题，为什么值得先学】',
      position: '【TODO 知识地图上的位置：前置是什么，为后面哪些章节铺路】',
      unlocks: [
        { label: 'C.4 The geometric and binomial distributions', url: '#/appendix/c/s04' },
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
    // 下面的 en 与 page 逐字取自 data/blocks/part-viii-appendix-mathematical-background__chC.json，每条都已通过溯源判据。
    // 请勿改写 en；每条补上 zh（中文解读）即可。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1191,
          en: 'C.3 Discrete random variables 1191 them will pass the course and the other two will fail. Carmine asks Professor Gore privately which of Jeff and Tim will fail, arguing that since he already knows at least one of them will fail, the professor won’t be revealing any information about',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1191,
          en: 'Carmine’s outcome. In a breach of privacy law, Professor Gore tells Carmine that Jeff will fail. Carmine feels somewhat relieved now, figuring that either he or Tim will pass, so that his probability of passing is no w 1/2. Is Carmine correct, or is his chance of passing still 1/3? Explain.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1191,
          en: 'A (discrete) random variable X is a function from a finite or countably infinite sample space S to the real numbers. It associates a real number with each possible outcome of an experiment, which allows us to work with the probability distribution induced on the resulting set of numbers. Ran dom variables can also be defined for uncountably infinite sample spaces, but they raise technical issues that are unnecessary to address for our purposes. Therefore we’ll assume that random variables are discrete.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1191,
          en: 'For a random variable X and a real number x , we define the event X = x to be fs 2 S W X(s) = x g, and thus',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1191,
          en: 'The function f(x) = Pr fX = x g is the probability density function of the random variable X . From the probability axioms, Pr fX = x g ≥ 0 and P x Pr fX = x g = 1.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1191,
          en: 'As an example, consider the experiment of rolling a pair of ordinary, 6-sided dice. There are 36 possible outcomes in the sample space. Assume that the probability distribution is uniform, so that each outcome s 2 S is equally likely:',
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
      page: 1191,
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
        // { expr: '\\Theta(n \\lg n)', when: '最坏情况', page: [1191], source: 'book' },
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
      page: 1191,
      intro: '【TODO 导读：下面三步分别对应不变量的哪一条性质】',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1191,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1192,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1193,
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
        // 【TODO 本节没有书后习题】
      ],
    },
  ],
};
