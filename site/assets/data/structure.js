/* =============================================================================
 * data/structure.js — 全书结构（Part → 章 → 关卡数）
 *
 * 为什么是 JS 模块而不是 fetch data/structure.json：本站零构建、可能以 file://
 *   打开，而 file:// 下 fetch 会被 CORS 拦掉（与 assets/chapters.js、
 *   data/figures.js 同一套理由）。
 *
 * ★ 这份结构原本硬编码在 index.html 里。第 39 轮做「算法选择器」（#/algorithms）
 *   时它需要按 Part 分组列算法 —— 若在那边再抄一份 Part/章的对应关系，两份映射
 *   迟早漂移（章改名、章数变动时只改一边）。所以收在这里一份，首页与新页面都读它。
 *
 * zh 是通行中文译名，只用于导航；英文 title 是原书章名。
 * count 是**关卡数**不是节数：绝大多数章两者相等（一节一关），但当某一节长到
 *   装不下一关时会被拆开 —— 目前只有第 5 章的 5.4 一节（含四个独立例子）拆成 4 关，
 *   所以第 5 章 count = 7 而节数是 4。
 * ========================================================================== */

export const STRUCTURE = [
  { no: "I", title: "Part I Foundations", zh: "基础", chapters: [
    { n: 1, title: "The Role of Algorithms in Computing", zh: "算法在计算中的作用", count: 2 },
    { n: 2, title: "Getting Started", zh: "算法基础", count: 3 },
    { n: 3, title: "Characterizing Running Times", zh: "刻画运行时间", count: 3 },
    { n: 4, title: "Divide-and-Conquer", zh: "分治策略", count: 7 },
    { n: 5, title: "Probabilistic Analysis and Randomized Algorithms", zh: "概率分析与随机化算法", count: 7 },
  ]},
  { no: "II", title: "Part II Sorting and Order Statistics", zh: "排序与顺序统计", chapters: [
    { n: 6, title: "Heapsort", zh: "堆排序", count: 5 },
    { n: 7, title: "Quicksort", zh: "快速排序", count: 4 },
    { n: 8, title: "Sorting in Linear Time", zh: "线性时间排序", count: 4 },
    { n: 9, title: "Medians and Order Statistics", zh: "中位数与顺序统计量", count: 3 },
  ]},
  { no: "III", title: "Part III Data Structures", zh: "数据结构", chapters: [
    { n: 10, title: "Elementary Data Structures", zh: "基本数据结构", count: 3 },
    { n: 11, title: "Hash Tables", zh: "散列表", count: 5 },
    { n: 12, title: "Binary Search Trees", zh: "二叉搜索树", count: 3 },
    { n: 13, title: "Red-Black Trees", zh: "红黑树", count: 4 },
  ]},
  { no: "IV", title: "Part IV Advanced Design and Analysis Techniques", zh: "高级设计与分析技术", chapters: [
    { n: 14, title: "Dynamic Programming", zh: "动态规划", count: 5 },
    { n: 15, title: "Greedy Algorithms", zh: "贪心算法", count: 4 },
    { n: 16, title: "Amortized Analysis", zh: "摊还分析", count: 4 },
  ]},
  { no: "V", title: "Part V Advanced Data Structures", zh: "高级数据结构", chapters: [
    { n: 17, title: "Augmenting Data Structures", zh: "数据结构的扩张", count: 3 },
    { n: 18, title: "B-Trees", zh: "B 树", count: 3 },
    { n: 19, title: "Data Structures for Disjoint Sets", zh: "不相交集合的数据结构", count: 4 },
  ]},
  { no: "VI", title: "Part VI Graph Algorithms", zh: "图算法", chapters: [
    { n: 20, title: "Elementary Graph Algorithms", zh: "基本的图算法", count: 5 },
    { n: 21, title: "Minimum Spanning Trees", zh: "最小生成树", count: 2 },
    { n: 22, title: "Single-Source Shortest Paths", zh: "单源最短路径", count: 5 },
    { n: 23, title: "All-Pairs Shortest Paths", zh: "所有结点对的最短路径", count: 3 },
    { n: 24, title: "Maximum Flow", zh: "最大流", count: 3 },
    { n: 25, title: "Matchings in Bipartite Graphs", zh: "二分图中的匹配", count: 3 },
  ]},
  { no: "VII", title: "Part VII Selected Topics", zh: "专题选讲", chapters: [
    { n: 26, title: "Parallel Algorithms", zh: "并行算法", count: 3 },
    { n: 27, title: "Online Algorithms", zh: "在线算法", count: 3 },
    { n: 28, title: "Matrix Operations", zh: "矩阵运算", count: 3 },
    { n: 29, title: "Linear Programming", zh: "线性规划", count: 3 },
    { n: 30, title: "Polynomials and the FFT", zh: "多项式与 FFT", count: 3 },
    { n: 31, title: "Number-Theoretic Algorithms", zh: "数论算法", count: 8 },
    { n: 32, title: "String Matching", zh: "字符串匹配", count: 5 },
    { n: 33, title: "Machine-Learning Algorithms", zh: "机器学习算法", count: 3 },
    { n: 34, title: "NP-Completeness", zh: "NP 完全性", count: 5 },
    { n: 35, title: "Approximation Algorithms", zh: "近似算法", count: 5 },
  ]},
];

/* 附录单独放：它的版式与正文部分不同（见 layout.css ④） */
export const APPENDICES = [
  { n: "A", title: "Summations", zh: "求和", count: 2 },
  { n: "B", title: "Sets, Etc.", zh: "集合等", count: 5 },
  { n: "C", title: "Counting and Probability", zh: "计数与概率", count: 5 },
  { n: "D", title: "Matrices", zh: "矩阵", count: 2 },
];

export const TOTAL_LEVELS =
  STRUCTURE.reduce((acc, p) => acc + p.chapters.reduce((a, c) => a + c.count, 0), 0) +
  APPENDICES.reduce((a, c) => a + c.count, 0);

export const TOTAL_CHAPTERS =
  STRUCTURE.reduce((acc, p) => acc + p.chapters.length, 0) + APPENDICES.length;

/** 全书章节条目（正文按 Part 顺序在前，附录在后）——首页与算法选择器共用。 */
export function allChapters() {
  return STRUCTURE.reduce((a, p) => a.concat(p.chapters), []).concat(APPENDICES);
}

/** 某个章号属于哪个 Part 的展示名；附录返回「附录」。 */
export function partOf(ch) {
  const s = String(ch);
  for (const p of STRUCTURE) {
    if (p.chapters.some((c) => String(c.n) === s)) {
      return { no: p.no, title: p.title, zh: p.zh };
    }
  }
  return { no: "Appendix", title: "Appendix: Mathematical Background", zh: "附录" };
}

export default { STRUCTURE, APPENDICES, TOTAL_LEVELS, TOTAL_CHAPTERS, allChapters, partOf };
