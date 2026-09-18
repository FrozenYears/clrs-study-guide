/* =============================================================================
 * 第 B 章 B.4 —— 第 s04 关：B.4 Graphs
 *
 * 原文锚点：印刷页 1164–1168（pdf_index 1185–1189）
 *
 * 本文件由 tools/05_new_level.py 生成骨架：
 *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，
 *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，
 *   要删就整条删。其余 `【TODO …】` 处需人工填写。
 *
 * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py
 * ========================================================================== */

export default {
  key: 's04',
  id:'chB/s04',
  chapter: 'B',
  section: 'B.4',
  title: '图',
  shortTitle: 'B.4 图',
  titleEn: 'Graphs',
  source: { printed: [1164, 1168], pdf: [1185, 1189] },
  sourceNote: '本关对应原书 B.4 节（印刷页 1164–1168）。',
  prerequisites: [
    { label: 'B.3 Functions', url: '#/appendix/b/s03' },
  ],
  stages: [
    // ——— 阶段 1 位置感 ———————————————————————————————————————
    {
      type: 'map',
      title: '【TODO 标题，如「先看清这一关的位置」】',
      why: '【TODO 为什么学这一关：这一节解决什么问题，为什么值得先学】',
      position: '【TODO 知识地图上的位置：前置是什么，为后面哪些章节铺路】',
      unlocks: [
        { label: 'B.5 Trees', url: '#/appendix/b/s05' },
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
    // 下面的 en 与 page 逐字取自 data/blocks/part-viii-appendix-mathematical-background__chB.json，每条都已通过溯源判据。
    // 请勿改写 en；每条补上 zh（中文解读）即可。
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。原文一律照抄，不做任何改写。',
      blocks: [
        { kind: 'body', page: 1164,
          en: 'This section presents two kinds of graphs: directed and undirected. Certain definitions in the literature differ from those given here, but for the most part, the differences are slight. Section 20.1 shows how to represent graphs in computer memory.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1164,
          en: 'A directed graph (or digraph) G is a pair (V,E) , where V is a finite set and E is a binary relation on V . The set V is called the vertex set of G, and its elements are called vertices (singular: vertex). The set E is called the edge set of G, and its elements are called edges. Figure B.2(a) is a pictorial representation of a directed graph on the vertex set f1,2,3,4,5,6 g . Vertices are represented by circles in the figure, and edges are represented by arrows. Self-loops—edges from a vertex to itself—are possible.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1164,
          en: 'In an undirected graph G = (V,E) , the edge set E consists of unordered pairs of vertices, rather than ordered pairs. That is, an edge is a set fu,v g, where u,v 2 V and u ≠ v. By convention, we use the notation (u,v) for an edge, rather than the set notation fu,v g, and we consider (u,v) and (v,u) to be the same edge.',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1164,
          en: 'In an undirected graph, self-loops are forbidden, so that every edge consists of two distinct vertices. Figure B.2(b) shows an undirected graph on the vertex set f1,2,3,4,5,6 g .',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1164,
          en: 'Many definitions for directed and undirected graphs are the same, although certain terms have slightly different meanings in the two contexts. If (u,v) is an edge in a directed graph G = (V,E) , we say that (u,v) is incident from or leaves vertex u and is incident to or enters vertex v. For example, the edges leaving vertex 2',
          zh: '【TODO 中文解读】' },
        { kind: 'body', page: 1164,
          en: 'Figure B.2 Directed and undirected graphs. (a) A directed graph G = (V,E) , where V = f1,2,3,4,5,6 g and E = f(1,2),.2,2/,.2,4/,.2,5/,.4,1/,.4,5/,.5,4/,.6,3/ g. The edge .2,2/ is a self-loop. (b) An undirected graph G = (V,E) , where V = f1,2,3,4,5,6 g and E = f(1,2),.1,5/,.2,5/,.3,6/ g. The vertex 4 is isolated. (c) The subgraph of the graph in part (a) induced by the vertex set f1,2,3,6 g.',
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
      page: 1164,
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
        // { expr: '\\Theta(n \\lg n)', when: '最坏情况', page: [1164], source: 'book' },
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
      page: 1164,
      intro: '【TODO 导读：下面三步分别对应不变量的哪一条性质】',
      steps: [
        {
          title: '第一步 · 初始化（Initialization）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1164,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第二步 · 保持（Maintenance）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1165,
          body: ['【TODO 中文展开与补白】'],
        },
        {
          title: '第三步 · 终止（Termination）',
          en: '【TODO 原书这一段的原文（逐字）】',
          page: 1166,
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
