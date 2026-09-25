/* =============================================================================
 * data/manifest.js —— 全书章节清单（由 tools/dump_levels.mjs 生成，不要手改）
 *
 * 站点的「按章懒加载」全靠这份清单：首页画目录、聚合页（术语表 / 复杂度 /
 *   伪代码 / 算法选择器）做全量扫描，都只需要标题、节号、页码与阶段类型；
 *   阶段正文（原文引述、伪代码行、题目）几百 KB，只有真正打开那一关时才
 *   动态 import 对应的 chapter.js。
 *
 * 每个条目里的 slug 就是 site/chapters/<slug>/chapter.js 的目录名；
 *   拼 import 说明符的地方只有 assets/chapters.js 一处（不要在这里存路径）。
 * 重新生成：node tools/dump_levels.mjs
 * ========================================================================== */

export const MANIFEST = {
  "1": {
      "ch": 1,
      "chSpan": "第 1 章 · The Role of Algorithms in Computing（算法在计算中的作用）",
      "slug": "ch01-the-role-of-algorithms",
      "title": "The Role of Algorithms in Computing",
      "titleZh": "算法在计算中的作用",
      "source": {
          "printed": [
              5,
              16
          ],
          "pdf": [
              26,
              37
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch01/s01",
              "section": "1.1",
              "title": "算法是什么",
              "shortTitle": "1.1 算法是什么",
              "titleEn": "Algorithms",
              "source": {
                  "printed": [
                      5,
                      11
                  ],
                  "pdf": [
                      26,
                      32
                  ]
              },
              "sourceNote": "本关对应原书 1.1 节（印刷页 5–11）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch01/s02",
              "section": "1.2",
              "title": "算法是一种技术",
              "shortTitle": "1.2 算法是一种技术",
              "titleEn": "Algorithms as a technology",
              "source": {
                  "printed": [
                      12,
                      16
                  ],
                  "pdf": [
                      33,
                      37
                  ]
              },
              "sourceNote": "本关对应原书 1.2 节（印刷页 12–16）。",
              "prerequisites": [
                  {
                      "label": "1.1 算法是什么（正确性与实例这两个词在这里要被用上）",
                      "url": "#/ch01/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "2": {
      "ch": 2,
      "chSpan": "第 2 章 · Getting Started（起步）",
      "slug": "ch02-getting-started",
      "title": "Getting Started",
      "titleZh": "起步",
      "source": {
          "printed": [
              17,
              46
          ],
          "pdf": [
              38,
              67
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch02/s01",
              "section": "2.1",
              "title": "插入排序",
              "shortTitle": "2.1 插入排序",
              "titleEn": "Insertion sort",
              "source": {
                  "printed": [
                      17,
                      24
                  ],
                  "pdf": [
                      38,
                      45
                  ]
              },
              "sourceNote": "本关对应原书 2.1 节（印刷页 17–24）。阶段 7 的复杂度结论出自 2.2 节（印刷页 25 起），此处标为「预告」，完整推导是下一关。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch02/s02",
              "section": "2.2",
              "title": "分析算法",
              "shortTitle": "2.2 分析算法",
              "titleEn": "Analyzing algorithms",
              "source": {
                  "printed": [
                      25,
                      33
                  ],
                  "pdf": [
                      46,
                      55
                  ]
              },
              "sourceNote": "本关对应原书 2.2 节（印刷页 25–34）。它在 2.1 与 2.3 之间架了一座桥：2.1 已经证明插入排序是**对的**，但\"多快\"还没有语言来描述。2.2 先把这门语言造出来（RAM 模型、语句代价 c_k、t_i、T(n)），再把它简化成一个能用来比较算法的记号（Θ），最后指出一个贯穿全书的取舍：**常规分析只看最坏情况**。",
              "prerequisites": [
                  {
                      "label": "2.1 插入排序",
                      "url": "#/ch02/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch02/s03",
              "section": "2.3",
              "title": "分治法与归并排序",
              "shortTitle": "2.3 归并排序",
              "titleEn": "Designing algorithms",
              "source": {
                  "printed": [
                      34,
                      46
                  ],
                  "pdf": [
                      55,
                      67
                  ]
              },
              "sourceNote": "本关对应原书 2.3 节（印刷页 34–46）。它为 2.1 的插入排序找到了一个最坏情况更快的对手：归并排序的 Θ(n lg n) 对抗插入排序的 Θ(n²)。2.3.2 节第一次出现**递归式**，完整的求解方法（主定理）在第 4 章，本关只做“递归树”式的直观推导。",
              "prerequisites": [
                  {
                      "label": "2.1 插入排序",
                      "url": "#/ch02/s01"
                  },
                  {
                      "label": "2.2 分析算法（本关下面要反复用到 Θ 与 T(n)）",
                      "url": "#/ch02/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "3": {
      "ch": 3,
      "chSpan": "第 3 章 · Characterizing Running Times（刻画运行时间）",
      "slug": "ch03-characterizing-running-times",
      "title": "Characterizing Running Times",
      "titleZh": "刻画运行时间",
      "source": {
          "printed": [
              49,
              75
          ],
          "pdf": [
              70,
              96
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch03/s01",
              "section": "3.1",
              "title": "三种渐进记号：给增长速率起名字",
              "shortTitle": "3.1 三种渐进记号",
              "titleEn": "O-notation, Ω-notation, and Θ-notation",
              "source": {
                  "printed": [
                      50,
                      52
                  ],
                  "pdf": [
                      71,
                      73
                  ]
              },
              "sourceNote": "本关对应原书 3.1 节（印刷页 50–52）。",
              "prerequisites": [
                  {
                      "label": "2.2 分析算法",
                      "url": "#/ch02/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch03/s02",
              "section": "3.2",
              "title": "渐进记号的形式定义",
              "shortTitle": "3.2 渐进记号的形式定义",
              "titleEn": "Asymptotic notation: formal definitions",
              "source": {
                  "printed": [
                      53,
                      62
                  ],
                  "pdf": [
                      74,
                      83
                  ]
              },
              "sourceNote": "本关对应原书 3.2 节（印刷页 53–62）。第 3.1 节只是**非正式地**使用 Θ/O/Ω（\"roughly proportional when n is large\"），这一节把五个记号——Θ、O、Ω、o、ω——全部写成带常数 $c_1,c_2,n_0$ 的严格集合定义，并列出它们的代数性质（传递性、自反性、对称性、三分性）与一条核心定理 Theorem 3.1。全书的复杂度断言从此都以这一节的定义为准。",
              "prerequisites": [
                  {
                      "label": "3.1 O-notation, Ω-notation, and Θ-notation",
                      "url": "#/ch03/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch03/s03",
              "section": "3.3",
              "title": "标准记号与常用函数",
              "shortTitle": "3.3 标准记号与常用函数",
              "titleEn": "Standard notations and common functions",
              "source": {
                  "printed": [
                      63,
                      75
                  ],
                  "pdf": [
                      84,
                      96
                  ]
              },
              "sourceNote": "本关对应原书 3.3 节（印刷页 63–75）。它是全书的\"函数速查表\"：单调性、取整（floor/ceiling）、取模、多项式、指数、对数、阶乘（Stirling 近似）、迭代对数、黄金比例与斐波那契数。重点不是背公式，而是**搞清这些函数之间的渐进大小关系**（谁被谁在渐进意义下压倒）——这正是阶段 5 曲线图与阶段 6 程序要让你\"看见\"的。",
              "prerequisites": [
                  {
                      "label": "3.2 Asymptotic notation: formal definitions",
                      "url": "#/ch03/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "4": {
      "ch": 4,
      "chSpan": "第 4 章 · Divide-and-Conquer（分治法）",
      "slug": "ch04-divide-and-conquer",
      "title": "Divide-and-Conquer",
      "titleZh": "分治法",
      "source": {
          "printed": [
              76,
              125
          ],
          "pdf": [
              97,
              146
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch04/s01",
              "section": "4.1",
              "title": "方阵相乘：三重循环与八分支分治",
              "shortTitle": "4.1 方阵相乘",
              "titleEn": "Multiplying square matrices",
              "source": {
                  "printed": [
                      80,
                      84
                  ],
                  "pdf": [
                      101,
                      105
                  ]
              },
              "sourceNote": "本关对应原书 4.1 节（印刷页 80–84）。",
              "prerequisites": [
                  {
                      "label": "2.3 Merge sort（递归分治）",
                      "url": "#/ch02/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch04/s02",
              "section": "4.2",
              "title": "Strassen：七次矩阵乘法",
              "shortTitle": "4.2 Strassen：七次矩阵乘法",
              "titleEn": "Strassen’s algorithm for matrix multiplication",
              "source": {
                  "printed": [
                      85,
                      89
                  ],
                  "pdf": [
                      106,
                      110
                  ]
              },
              "sourceNote": "本关对应原书 4.2 节（印刷页 85–89）。",
              "prerequisites": [
                  {
                      "label": "2.3 Merge sort（递归分治）",
                      "url": "#/ch02/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch04/s03",
              "section": "4.3",
              "title": "代入法：先猜后证",
              "shortTitle": "4.3 代入法",
              "titleEn": "The substitution method for solving recurrences",
              "source": {
                  "printed": [
                      90,
                      94
                  ],
                  "pdf": [
                      111,
                      115
                  ]
              },
              "sourceNote": "本关对应原书 4.3 节（印刷页 90–94）。",
              "prerequisites": [
                  {
                      "label": "4.2 Strassen 矩阵乘法",
                      "url": "#/ch04/s02"
                  },
                  {
                      "label": "3.2 渐进记号的形式化定义",
                      "url": "#/ch03/s02"
                  },
                  {
                      "label": "2.3 归并排序",
                      "url": "#/ch02/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch04/s04",
              "section": "4.4",
              "title": "递归树法：把递归式画成一本成本账",
              "shortTitle": "4.4 递归树法",
              "titleEn": "The recursion-tree method for solving recurrences",
              "source": {
                  "printed": [
                      95,
                      100
                  ],
                  "pdf": [
                      116,
                      121
                  ]
              },
              "sourceNote": "本关对应原书 4.4 节（印刷页 95–100）。",
              "prerequisites": [
                  {
                      "label": "3.1 三种渐进记号",
                      "url": "#/ch03/s01"
                  },
                  {
                      "label": "4.3 代入法",
                      "url": "#/ch04/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch04/s05",
              "section": "4.5",
              "title": "主方法：三种情况查表",
              "shortTitle": "4.5 主方法",
              "titleEn": "The master method for solving recurrences",
              "source": {
                  "printed": [
                      101,
                      106
                  ],
                  "pdf": [
                      122,
                      127
                  ]
              },
              "sourceNote": "本关对应原书 4.5 节（印刷页 101–106）。",
              "prerequisites": [
                  {
                      "label": "4.3 代入法",
                      "url": "#/ch04/s03"
                  },
                  {
                      "label": "4.4 The recursion-tree method for solving recurrences",
                      "url": "#/ch04/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s06",
              "id": "ch04/s06",
              "section": "4.6",
              "title": "连续主定理：从递归树到积分界",
              "shortTitle": "4.6 连续主定理",
              "titleEn": "Proof of the continuous master theorem",
              "source": {
                  "printed": [
                      107,
                      114
                  ],
                  "pdf": [
                      128,
                      135
                  ]
              },
              "sourceNote": "本关对应原书 4.6 节（印刷页 107–114）。",
              "prerequisites": [
                  {
                      "label": "4.5 主方法：三种情况查表",
                      "url": "#/ch04/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s07",
              "id": "ch04/s07",
              "section": "4.7",
              "title": "Akra–Bazzi：不等比例递归的积分解",
              "shortTitle": "4.7 Akra–Bazzi 递归",
              "titleEn": "Akra-Bazzi recurrences",
              "source": {
                  "printed": [
                      115,
                      125
                  ],
                  "pdf": [
                      136,
                      146
                  ]
              },
              "sourceNote": "本关对应原书 4.7 节（印刷页 115–125）。",
              "prerequisites": [
                  {
                      "label": "4.6 连续主定理",
                      "url": "#/ch04/s06"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "5": {
      "ch": 5,
      "chSpan": "第 5 章 · Probabilistic Analysis and Randomized Algorithms（概率分析与随机化算法）",
      "slug": "ch05-probabilistic-analysis-and-randomized",
      "title": "Probabilistic Analysis and Randomized Algorithms",
      "titleZh": "概率分析与随机化算法",
      "source": {
          "printed": [
              126,
              160
          ],
          "pdf": [
              147,
              181
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch05/s01",
              "section": "5.1",
              "title": "招聘问题：当前最佳候选人",
              "shortTitle": "5.1 招聘问题",
              "titleEn": "The hiring problem",
              "source": {
                  "printed": [
                      126,
                      129
                  ],
                  "pdf": [
                      147,
                      150
                  ]
              },
              "sourceNote": "本关对应原书 5.1 节（印刷页 126–129）。",
              "prerequisites": [
                  {
                      "label": "2.2 分析算法",
                      "url": "#/ch02/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch05/s02",
              "section": "5.2",
              "title": "指示器随机变量：数清招聘次数",
              "shortTitle": "5.2 指示器随机变量",
              "titleEn": "Indicator random variables",
              "source": {
                  "printed": [
                      130,
                      133
                  ],
                  "pdf": [
                      151,
                      154
                  ]
              },
              "sourceNote": "本关对应原书 5.2 节（印刷页 130–133）。",
              "prerequisites": [
                  {
                      "label": "5.1 The hiring problem",
                      "url": "#/ch05/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch05/s03",
              "section": "5.3",
              "title": "随机化算法：自己制造随机性",
              "shortTitle": "5.3 随机化算法",
              "titleEn": "Randomized algorithms",
              "source": {
                  "printed": [
                      134,
                      139
                  ],
                  "pdf": [
                      155,
                      160
                  ]
              },
              "sourceNote": "本关对应原书 5.3 节（印刷页 134–139）。其中 RANDOMLY-PERMUTE 的均匀性证明是 Lemma 5.4。",
              "prerequisites": [
                  {
                      "label": "5.2 Indicator random variables",
                      "url": "#/ch05/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch05/s04",
              "section": "5.4",
              "title": "生日悖论：23 人为何就够",
              "shortTitle": "5.4.1 生日悖论",
              "titleEn": "The birthday paradox",
              "source": {
                  "printed": [
                      140,
                      143
                  ],
                  "pdf": [
                      161,
                      164
                  ]
              },
              "sourceNote": "本关对应原书 5.4.1 节（印刷页 140–143）。5.4 节还含球与盒、连胜、在线最大三个例子。",
              "prerequisites": [
                  {
                      "label": "5.2 Indicator random variables",
                      "url": "#/ch05/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch05/s05",
              "section": "5.4",
              "title": "球与箱：什么时候每个箱子都有球",
              "shortTitle": "5.4.2 球与箱",
              "titleEn": "Balls and bins",
              "source": {
                  "printed": [
                      143,
                      144
                  ],
                  "pdf": [
                      164,
                      165
                  ]
              },
              "sourceNote": "本关对应原书 5.4.2 节（印刷页 143–144）。",
              "prerequisites": [
                  {
                      "label": "5.4.1 生日悖论",
                      "url": "#/ch05/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s06",
              "id": "ch05/s06",
              "section": "5.4",
              "title": "连续正面：最长连胜的期望是 Θ(lg n)",
              "shortTitle": "5.4.3 连续正面",
              "titleEn": "Streaks",
              "source": {
                  "printed": [
                      144,
                      150
                  ],
                  "pdf": [
                      165,
                      171
                  ]
              },
              "sourceNote": "本关对应原书 5.4.3 节（印刷页 144–150）。本节数学密集，上界与下界两半都有大量带馅求和，分段器切成了许多十来字符的小块，因此可用的长引述较少，已在阶段 3 中逐条标注页码与省略。",
              "prerequisites": [
                  {
                      "label": "5.4.1 生日悖论（s04）",
                      "url": "#/ch05/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s07",
              "id": "ch05/s07",
              "section": "5.4",
              "title": "在线招聘问题：不能回头的 37% 法则",
              "shortTitle": "5.4.4 在线招聘问题",
              "titleEn": "The online hiring problem",
              "source": {
                  "printed": [
                      150,
                      152
                  ],
                  "pdf": [
                      171,
                      173
                  ]
              },
              "sourceNote": "本关对应原书 5.4.4 节（印刷页 150–152）。伪代码与符号均以渲染原页为准核实。",
              "prerequisites": [
                  {
                      "label": "5.4.3 Streaks（上一关）",
                      "url": "#/ch05/s06"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "6": {
      "ch": 6,
      "chSpan": "第 6 章 · Heapsort（堆排序）",
      "slug": "ch06-heapsort",
      "title": "Heapsort",
      "titleZh": "堆排序",
      "source": {
          "printed": [
              161,
              180
          ],
          "pdf": [
              182,
              201
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch06/s01",
              "section": "6.1",
              "title": "堆：数组与二叉树是同一个东西",
              "shortTitle": "6.1 堆",
              "titleEn": "Heaps",
              "source": {
                  "printed": [
                      161,
                      163
                  ],
                  "pdf": [
                      182,
                      185
                  ]
              },
              "sourceNote": "本关对应原书 6.1 节（印刷页 161–164）。本节定下术语（堆、堆性质、高度）与三条下标算式，后面 6.2–6.5 都建立在这上面。",
              "prerequisites": [
                  {
                      "label": "5.4.4 The online hiring problem",
                      "url": "#/ch05/s07"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch06/s02",
              "section": "6.2",
              "title": "MAX-HEAPIFY：只沿一条路往下修",
              "shortTitle": "6.2 维持堆性质",
              "titleEn": "Maintaining the heap property",
              "source": {
                  "printed": [
                      164,
                      166
                  ],
                  "pdf": [
                      185,
                      188
                  ]
              },
              "sourceNote": "本关对应原书 6.2 节（印刷页 164–167）。伪代码在第 165 页，复杂度分析在第 166 页 —— 那里会用到第 4 章的主方法。",
              "prerequisites": [
                  {
                      "label": "6.1 Heaps（堆）",
                      "url": "#/ch06/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch06/s03",
              "section": "6.3",
              "title": "建堆：把 n 次 O(lg n) 压成 O(n)",
              "shortTitle": "6.3 建堆",
              "titleEn": "Building a heap",
              "source": {
                  "printed": [
                      167,
                      169
                  ],
                  "pdf": [
                      188,
                      191
                  ]
              },
              "sourceNote": "本关对应原书 6.3 节（印刷页 167–170）。它的复杂度分析是第 6 章里最漂亮的一段：表面上 n 次 O(lg n) 的调用，实际是 O(n)。",
              "prerequisites": [
                  {
                      "label": "6.2 Maintaining the heap property",
                      "url": "#/ch06/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch06/s04",
              "section": "6.4",
              "title": "堆排序：把堆顶一个个摘出去",
              "shortTitle": "6.4 堆排序算法",
              "titleEn": "The heapsort algorithm",
              "source": {
                  "printed": [
                      170,
                      172
                  ],
                  "pdf": [
                      191,
                      193
                  ]
              },
              "sourceNote": "本关对应原书 6.4 节（印刷页 170–172）。它是第 6 章的落点：前面三关建起来的堆，到这里变成排序算法。",
              "prerequisites": [
                  {
                      "label": "6.3 Building a heap（建堆）",
                      "url": "#/ch06/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch06/s05",
              "section": "6.5",
              "title": "优先队列：把堆当成一个能插能取的集合",
              "shortTitle": "6.5 优先队列",
              "titleEn": "Priority queues",
              "source": {
                  "printed": [
                      172,
                      179
                  ],
                  "pdf": [
                      193,
                      200
                  ]
              },
              "sourceNote": "本关对应原书 6.5 节（印刷页 172–179）。它是第 6 章的用途篇：前面把堆当排序工具，这里把同一个结构当成一个「随时可取最大值」的集合。",
              "prerequisites": [
                  {
                      "label": "6.4 The heapsort algorithm（堆排序算法）",
                      "url": "#/ch06/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "7": {
      "ch": 7,
      "chSpan": "第 7 章 · Quicksort（快速排序）",
      "slug": "ch07-quicksort",
      "title": "Quicksort",
      "titleZh": "快速排序",
      "source": {
          "printed": [
              182,
              204
          ],
          "pdf": [
              203,
              225
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch07/s01",
              "section": "7.1",
              "title": "快速排序：分而治之，原地完成",
              "shortTitle": "7.1 快速排序的描述",
              "titleEn": "Description of quicksort",
              "source": {
                  "printed": [
                      183,
                      187
                  ],
                  "pdf": [
                      204,
                      208
                  ]
              },
              "sourceNote": "本关对应原书 7.1 节（印刷页 183–187）。PARTITION 是整个快速排序的核心，它的循环不变量原书在正文里给了完整证明（p.184）—— 本关阶段 8 就用那三步。",
              "prerequisites": [
                  {
                      "label": "6.5 Priority queues（优先队列）",
                      "url": "#/ch06/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch07/s02",
              "section": "7.2",
              "title": "快排的性能：分得匀不匀，差一个 n 倍",
              "shortTitle": "7.2 快速排序的性能",
              "titleEn": "Performance of quicksort",
              "source": {
                  "printed": [
                      187,
                      190
                  ],
                  "pdf": [
                      208,
                      211
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "7.1 Description of quicksort",
                      "url": "#/ch07/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch07/s03",
              "section": "7.3",
              "title": "随机化：让\"坏输入\"消失",
              "shortTitle": "7.3 随机化版本",
              "titleEn": "A randomized version of quicksort",
              "source": {
                  "printed": [
                      191,
                      192
                  ],
                  "pdf": [
                      212,
                      213
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "7.2 Performance of quicksort",
                      "url": "#/ch07/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch07/s04",
              "section": "7.4",
              "title": "快速排序的分析：期望 O(n lg n)",
              "shortTitle": "7.4 快速排序的分析",
              "titleEn": "Analysis of quicksort",
              "source": {
                  "printed": [
                      193,
                      198
                  ],
                  "pdf": [
                      214,
                      219
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "7.3 A randomized version of quicksort",
                      "url": "#/ch07/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "8": {
      "ch": 8,
      "chSpan": "第 8 章 · Sorting in Linear Time（线性时间排序）",
      "slug": "ch08-sorting-in-linear-time",
      "title": "Sorting in Linear Time",
      "titleZh": "线性时间排序",
      "source": {
          "printed": [
              205,
              216
          ],
          "pdf": [
              226,
              237
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch08/s01",
              "section": "8.1",
              "title": "排序的下界：比较排序的极限在哪里",
              "shortTitle": "8.1 排序算法的下界",
              "titleEn": "Lower bounds for sorting",
              "source": {
                  "printed": [
                      205,
                      208
                  ],
                  "pdf": [
                      226,
                      229
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "7.4 Analysis of quicksort",
                      "url": "#/ch07/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch08/s02",
              "section": "8.2",
              "title": "计数排序：数个数，而不是比大小",
              "shortTitle": "8.2 计数排序",
              "titleEn": "Counting sort",
              "source": {
                  "printed": [
                      208,
                      211
                  ],
                  "pdf": [
                      229,
                      232
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "8.1 Lower bounds for sorting",
                      "url": "#/ch08/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch08/s03",
              "section": "8.3",
              "title": "基数排序：从最低位开始，反直觉但正确",
              "shortTitle": "8.3 基数排序",
              "titleEn": "Radix sort",
              "source": {
                  "printed": [
                      211,
                      215
                  ],
                  "pdf": [
                      232,
                      236
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "8.2 Counting sort",
                      "url": "#/ch08/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch08/s04",
              "section": "8.4",
              "title": "桶排序：期望 O(n) 的最后一次绕道",
              "shortTitle": "8.4 桶排序",
              "titleEn": "Bucket sort",
              "source": {
                  "printed": [
                      215,
                      218
                  ],
                  "pdf": [
                      236,
                      239
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "8.3 Radix sort",
                      "url": "#/ch08/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "9": {
      "ch": 9,
      "chSpan": "第 9 章 · Medians and Order Statistics（中位数与顺序统计量）",
      "slug": "ch09-medians-and-order-statistics",
      "title": "Medians and Order Statistics",
      "titleZh": "中位数与顺序统计量",
      "source": {
          "printed": [
              227,
              250
          ],
          "pdf": [
              248,
              271
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch09/s01",
              "section": "9.1",
              "title": "最小与最大：从 n−1 到 3⌊n/2⌋",
              "shortTitle": "9.1 最小值与最大值",
              "titleEn": "Minimum and maximum",
              "source": {
                  "printed": [
                      227,
                      230
                  ],
                  "pdf": [
                      248,
                      251
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "8.4 Bucket sort",
                      "url": "#/ch08/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch09/s02",
              "section": "9.2",
              "title": "RANDOMIZED-SELECT：只递归一边的快排",
              "shortTitle": "9.2 期望线性时间的选择",
              "titleEn": "Selection in expected linear time",
              "source": {
                  "printed": [
                      230,
                      236
                  ],
                  "pdf": [
                      251,
                      257
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "9.1 Minimum and maximum",
                      "url": "#/ch09/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch09/s03",
              "section": "9.3",
              "title": "SELECT：用中位数的中位数保证最坏线性",
              "shortTitle": "9.3 最坏线性时间的选择",
              "titleEn": "Selection in worst-case linear time",
              "source": {
                  "printed": [
                      236,
                      243
                  ],
                  "pdf": [
                      257,
                      264
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "9.2 Selection in expected linear time",
                      "url": "#/ch09/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "10": {
      "ch": 10,
      "chSpan": "第 10 章 · Elementary Data Structures（基本数据结构）",
      "slug": "ch10-elementary-data-structures",
      "title": "Elementary Data Structures",
      "titleZh": "基本数据结构",
      "source": {
          "printed": [
              252,
              272
          ],
          "pdf": [
              273,
              293
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch10/s01",
              "section": "10.1",
              "title": "栈与队列：一个数组的两种脾气",
              "shortTitle": "10.1 数组、栈与队列",
              "titleEn": "Simple array-based data structures: arrays, matrices, stacks, queues",
              "source": {
                  "printed": [
                      252,
                      258
                  ],
                  "pdf": [
                      273,
                      279
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "9.3 Selection in worst-case linear time",
                      "url": "#/ch09/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch10/s02",
              "section": "10.2",
              "title": "链表：用指针换掉搬移",
              "shortTitle": "10.2 链表",
              "titleEn": "Linked lists",
              "source": {
                  "printed": [
                      258,
                      264
                  ],
                  "pdf": [
                      279,
                      285
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "10.1 Simple array-based data structures",
                      "url": "#/ch10/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch10/s03",
              "section": "10.3",
              "title": "有根树：三种指针方案与它们的空间账",
              "shortTitle": "10.3 有根树的表示",
              "titleEn": "Representing rooted trees",
              "source": {
                  "printed": [
                      265,
                      272
                  ],
                  "pdf": [
                      286,
                      293
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "10.2 Linked lists",
                      "url": "#/ch10/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "11": {
      "ch": 11,
      "chSpan": "第 11 章 · Hash Tables（散列表）",
      "slug": "ch11-hash-tables",
      "title": "Hash Tables",
      "titleZh": "散列表",
      "source": {
          "printed": [
              272,
              312
          ],
          "pdf": [
              293,
              333
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch11/s01",
              "section": "11.1",
              "title": "直接寻址表：当 key 就是下标",
              "shortTitle": "11.1 直接寻址表",
              "titleEn": "Direct-address tables",
              "source": {
                  "printed": [
                      273,
                      274
                  ],
                  "pdf": [
                      294,
                      295
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "10.3 Representing rooted trees",
                      "url": "#/ch10/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch11/s02",
              "section": "11.2",
              "title": "链接法：把冲突挂成链",
              "shortTitle": "11.2 散列表 · 链接法",
              "titleEn": "Hash tables",
              "source": {
                  "printed": [
                      275,
                      282
                  ],
                  "pdf": [
                      296,
                      303
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "11.1 Direct-address tables",
                      "url": "#/ch11/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch11/s03",
              "section": "11.3",
              "title": "散列函数：从\"挑一个\"到\"随机挑一个\"",
              "shortTitle": "11.3 散列函数",
              "titleEn": "Hash functions",
              "source": {
                  "printed": [
                      282,
                      292
                  ],
                  "pdf": [
                      303,
                      313
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "11.2 Hash tables",
                      "url": "#/ch11/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch11/s04",
              "section": "11.4",
              "title": "开放寻址：不建链的另一种方案",
              "shortTitle": "11.4 开放寻址",
              "titleEn": "Open addressing",
              "source": {
                  "printed": [
                      293,
                      301
                  ],
                  "pdf": [
                      314,
                      322
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "11.3 Hash functions（散列函数）",
                      "url": "#/ch11/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch11/s05",
              "section": "11.5",
              "title": "工程实践：内存层次、删除与 wee",
              "shortTitle": "11.5 散列表 · 工程实践",
              "titleEn": "Practical considerations",
              "source": {
                  "printed": [
                      301,
                      311
                  ],
                  "pdf": [
                      322,
                      333
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "11.2 链接法",
                      "url": "#/ch11/s02"
                  },
                  {
                      "label": "11.3 散列函数（选 h 的基础）",
                      "url": "#/ch11/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "12": {
      "ch": 12,
      "chSpan": "第 12 章 · Binary Search Trees（二叉搜索树）",
      "slug": "ch12-binary-search-trees",
      "title": "Binary Search Trees",
      "titleZh": "二叉搜索树",
      "source": {
          "printed": [
              312,
              332
          ],
          "pdf": [
              333,
              351
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch12/s01",
              "section": "12.1",
              "title": "什么是二叉搜索树",
              "shortTitle": "12.1 什么是二叉搜索树",
              "titleEn": "What is a binary search tree?",
              "source": {
                  "printed": [
                      312,
                      316
                  ],
                  "pdf": [
                      333,
                      337
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "11.5 Practical considerations",
                      "url": "#/ch11/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch12/s02",
              "section": "12.2",
              "title": "查询一棵二叉搜索树",
              "shortTitle": "12.2 查询 BST",
              "titleEn": "Querying a binary search tree",
              "source": {
                  "printed": [
                      316,
                      321
                  ],
                  "pdf": [
                      337,
                      342
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "12.1 What is a binary search tree?",
                      "url": "#/ch12/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch12/s03",
              "section": "12.3",
              "title": "插入与删除",
              "shortTitle": "12.3 插入与删除",
              "titleEn": "Insertion and deletion",
              "source": {
                  "printed": [
                      321,
                      330
                  ],
                  "pdf": [
                      342,
                      352
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "12.2 Querying a binary search tree",
                      "url": "#/ch12/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "13": {
      "ch": 13,
      "chSpan": "第 13 章 · Red-Black Trees（红黑树）",
      "slug": "ch13-red-black-trees",
      "title": "Red-Black Trees",
      "titleZh": "红黑树",
      "source": {
          "printed": [
              331,
              362
          ],
          "pdf": [
              352,
              383
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch13/s01",
              "section": "13.1",
              "title": "红黑树的性质",
              "shortTitle": "13.1 红黑树的性质",
              "titleEn": "Properties of red-black trees",
              "source": {
                  "printed": [
                      331,
                      335
                  ],
                  "pdf": [
                      352,
                      356
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "12.3 Insertion and deletion",
                      "url": "#/ch12/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch13/s02",
              "section": "13.2",
              "title": "旋转",
              "shortTitle": "13.2 旋转",
              "titleEn": "Rotations",
              "source": {
                  "printed": [
                      335,
                      338
                  ],
                  "pdf": [
                      356,
                      359
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "13.1 Properties of red-black trees",
                      "url": "#/ch13/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch13/s03",
              "section": "13.3",
              "title": "插入",
              "shortTitle": "13.3 插入",
              "titleEn": "Insertion",
              "source": {
                  "printed": [
                      338,
                      346
                  ],
                  "pdf": [
                      359,
                      367
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "13.2 Rotations",
                      "url": "#/ch13/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch13/s04",
              "section": "13.4",
              "title": "删除",
              "shortTitle": "13.4 删除",
              "titleEn": "Deletion",
              "source": {
                  "printed": [
                      346,
                      362
                  ],
                  "pdf": [
                      367,
                      383
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "13.3 Insertion",
                      "url": "#/ch13/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "14": {
      "ch": 14,
      "chSpan": "第 14 章 · Dynamic Programming（动态规划）",
      "slug": "ch14-dynamic-programming",
      "title": "Dynamic Programming",
      "titleZh": "动态规划",
      "source": {
          "printed": [
              362,
              416
          ],
          "pdf": [
              383,
              437
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch14/s01",
              "section": "14.1",
              "title": "钢条切割：动态规划的开场",
              "shortTitle": "14.1 钢条切割",
              "titleEn": "Rod cutting",
              "source": {
                  "printed": [
                      363,
                      373
                  ],
                  "pdf": [
                      384,
                      394
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "13.4 Deletion",
                      "url": "#/ch13/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch14/s02",
              "section": "14.2",
              "title": "矩阵链乘法：括号决定十倍代价",
              "shortTitle": "14.2 矩阵链乘法",
              "titleEn": "Matrix-chain multiplication",
              "source": {
                  "printed": [
                      373,
                      382
                  ],
                  "pdf": [
                      394,
                      403
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "14.1 Rod cutting",
                      "url": "#/ch14/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch14/s03",
              "section": "14.3",
              "title": "DP 的两大要素：最优子结构与重叠子问题",
              "shortTitle": "14.3 DP 的两大要素",
              "titleEn": "Elements of dynamic programming",
              "source": {
                  "printed": [
                      382,
                      393
                  ],
                  "pdf": [
                      403,
                      414
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "14.2 Matrix-chain multiplication",
                      "url": "#/ch14/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch14/s04",
              "section": "14.4",
              "title": "最长公共子序列：前缀对上的递推",
              "shortTitle": "14.4 最长公共子序列",
              "titleEn": "Longest common subsequence",
              "source": {
                  "printed": [
                      393,
                      399
                  ],
                  "pdf": [
                      414,
                      420
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "14.3 Elements of dynamic programming",
                      "url": "#/ch14/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch14/s05",
              "section": "14.5",
              "title": "最优二叉搜索树：把搜索代价压到 2.75",
              "shortTitle": "14.5 最优二叉搜索树",
              "titleEn": "Optimal binary search trees",
              "source": {
                  "printed": [
                      400,
                      407
                  ],
                  "pdf": [
                      421,
                      428
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "14.4 Longest common subsequence",
                      "url": "#/ch14/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "15": {
      "ch": 15,
      "chSpan": "第 15 章 · Greedy Algorithms（贪心算法）",
      "slug": "ch15-greedy-algorithms",
      "title": "Greedy Algorithms",
      "titleZh": "贪心算法",
      "source": {
          "printed": [
              417,
              450
          ],
          "pdf": [
              438,
              471
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch15/s01",
              "section": "15.1",
              "title": "活动选择：选最早结束的那个",
              "shortTitle": "15.1 活动选择",
              "titleEn": "An activity-selection problem",
              "source": {
                  "printed": [
                      418,
                      425
                  ],
                  "pdf": [
                      439,
                      446
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "14.5 Optimal binary search trees",
                      "url": "#/ch14/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch15/s02",
              "section": "15.2",
              "title": "贪心策略的两把钥匙：贪心选择与最优子结构",
              "shortTitle": "15.2 贪心策略的要素",
              "titleEn": "Elements of the greedy strategy",
              "source": {
                  "printed": [
                      426,
                      431
                  ],
                  "pdf": [
                      447,
                      452
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "15.1 An activity-selection problem",
                      "url": "#/ch15/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch15/s03",
              "section": "15.3",
              "title": "哈夫曼编码：合并两个最小的",
              "shortTitle": "15.3 哈夫曼编码",
              "titleEn": "Huffman codes",
              "source": {
                  "printed": [
                      431,
                      439
                  ],
                  "pdf": [
                      452,
                      460
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "15.2 Elements of the greedy strategy",
                      "url": "#/ch15/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch15/s04",
              "section": "15.4",
              "title": "离线缓存：换出\"下次最晚才用到\"的那块",
              "shortTitle": "15.4 离线缓存",
              "titleEn": "Offline caching",
              "source": {
                  "printed": [
                      440,
                      446
                  ],
                  "pdf": [
                      461,
                      467
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "15.3 Huffman codes",
                      "url": "#/ch15/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "16": {
      "ch": 16,
      "chSpan": "第 16 章 · Amortized Analysis（摊还分析）",
      "slug": "ch16-amortized-analysis",
      "title": "Amortized Analysis",
      "titleZh": "摊还分析",
      "source": {
          "printed": [
              448,
              480
          ],
          "pdf": [
              469,
              501
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch16/s01",
              "section": "16.1",
              "title": "聚合分析：n 个操作的总账",
              "shortTitle": "16.1 聚合分析",
              "titleEn": "Aggregate analysis",
              "source": {
                  "printed": [
                      449,
                      453
                  ],
                  "pdf": [
                      470,
                      474
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "15.4 Offline caching",
                      "url": "#/ch15/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch16/s02",
              "section": "16.2",
              "title": "记账法：给操作预付存款",
              "shortTitle": "16.2 记账法",
              "titleEn": "The accounting method",
              "source": {
                  "printed": [
                      453,
                      456
                  ],
                  "pdf": [
                      474,
                      477
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "16.1 Aggregate analysis",
                      "url": "#/ch16/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch16/s03",
              "section": "16.3",
              "title": "势能法：把存款写成函数 Φ(D)",
              "shortTitle": "16.3 势能法",
              "titleEn": "The potential method",
              "source": {
                  "printed": [
                      456,
                      460
                  ],
                  "pdf": [
                      477,
                      481
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "16.2 The accounting method",
                      "url": "#/ch16/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch16/s04",
              "section": "16.4",
              "title": "动态表：扩张与收缩的平衡术",
              "shortTitle": "16.4 动态表",
              "titleEn": "Dynamic tables",
              "source": {
                  "printed": [
                      460,
                      480
                  ],
                  "pdf": [
                      481,
                      501
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "16.3 The potential method",
                      "url": "#/ch16/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "17": {
      "ch": 17,
      "chSpan": "第 17 章 · Augmenting Data Structures（数据结构的扩张）",
      "slug": "ch17-augmenting-data-structures",
      "title": "Augmenting Data Structures",
      "titleZh": "数据结构的扩张",
      "source": {
          "printed": [
              479,
              497
          ],
          "pdf": [
              500,
              518
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch17/s01",
              "section": "17.1",
              "title": "动态顺序统计：给每个结点记 size",
              "shortTitle": "17.1 动态顺序统计",
              "titleEn": "Dynamic order statistics",
              "source": {
                  "printed": [
                      480,
                      486
                  ],
                  "pdf": [
                      501,
                      507
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "16.4 Dynamic tables",
                      "url": "#/ch16/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch17/s02",
              "section": "17.2",
              "title": "扩张方法论：四步走与定理 17.1",
              "shortTitle": "17.2 扩张方法论",
              "titleEn": "How to augment a data structure",
              "source": {
                  "printed": [
                      486,
                      489
                  ],
                  "pdf": [
                      507,
                      510
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "17.1 Dynamic order statistics",
                      "url": "#/ch17/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch17/s03",
              "section": "17.3",
              "title": "区间树：max 域与一次下降的查询",
              "shortTitle": "17.3 区间树",
              "titleEn": "Interval trees",
              "source": {
                  "printed": [
                      489,
                      497
                  ],
                  "pdf": [
                      510,
                      518
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "17.2 How to augment a data structure",
                      "url": "#/ch17/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "18": {
      "ch": 18,
      "chSpan": "第 18 章 · B-Trees（B 树）",
      "slug": "ch18-b-trees",
      "title": "B-Trees",
      "titleZh": "B 树",
      "source": {
          "printed": [
              500,
              520
          ],
          "pdf": [
              521,
              541
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch18/s01",
              "section": "18.1",
              "title": "B 树的定义：为磁盘而生的树",
              "shortTitle": "18.1 B 树的定义",
              "titleEn": "Definition of B-trees",
              "source": {
                  "printed": [
                      501,
                      504
                  ],
                  "pdf": [
                      522,
                      525
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "17.3 Interval trees",
                      "url": "#/ch17/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch18/s02",
              "section": "18.2",
              "title": "检索与插入：自顶向下分裂",
              "shortTitle": "18.2 检索与插入",
              "titleEn": "Basic operations on B-trees",
              "source": {
                  "printed": [
                      504,
                      512
                  ],
                  "pdf": [
                      525,
                      533
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "18.1 Definition of B-trees",
                      "url": "#/ch18/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch18/s03",
              "section": "18.3",
              "title": "删除：把\"不够半满\"挡在半路",
              "shortTitle": "18.3 B 树的删除",
              "titleEn": "Deleting a key from a B-tree",
              "source": {
                  "printed": [
                      513,
                      520
                  ],
                  "pdf": [
                      534,
                      541
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "18.2 Basic operations on B-trees",
                      "url": "#/ch18/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "19": {
      "ch": 19,
      "chSpan": "第 19 章 · Data Structures for Disjoint Sets（不相交集合的数据结构）",
      "slug": "ch19-disjoint-sets",
      "title": "Data Structures for Disjoint Sets",
      "titleZh": "不相交集合的数据结构",
      "source": {
          "printed": [
              519,
              536
          ],
          "pdf": [
              540,
              557
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch19/s01",
              "section": "19.1",
              "title": "不相交集合：动态等价问题",
              "shortTitle": "19.1 不相交集合的操作",
              "titleEn": "Disjoint-set operations",
              "source": {
                  "printed": [
                      520,
                      522
                  ],
                  "pdf": [
                      541,
                      544
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "18.3 Deleting a key from a B-tree",
                      "url": "#/ch18/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch19/s02",
              "section": "19.2",
              "title": "链表表示与加权合并",
              "shortTitle": "19.2 链表表示",
              "titleEn": "Linked-list representation of disjoint sets",
              "source": {
                  "printed": [
                      523,
                      526
                  ],
                  "pdf": [
                      544,
                      548
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "19.1 Disjoint-set operations",
                      "url": "#/ch19/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch19/s03",
              "section": "19.3",
              "title": "森林 + 按秩合并 + 路径压缩",
              "shortTitle": "19.3 不相交集合森林",
              "titleEn": "Disjoint-set forests",
              "source": {
                  "printed": [
                      527,
                      530
                  ],
                  "pdf": [
                      548,
                      552
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "19.2 Linked-list representation",
                      "url": "#/ch19/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch19/s04",
              "section": "19.4",
              "title": "O(m·α(n))：阿克曼反函数登场",
              "shortTitle": "19.4 摊还分析 α(n)",
              "titleEn": "Analysis of union by rank with path compression",
              "source": {
                  "printed": [
                      531,
                      548
                  ],
                  "pdf": [
                      552,
                      570
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "19.3 Disjoint-set forests",
                      "url": "#/ch19/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "20": {
      "ch": 20,
      "chSpan": "第 20 章 · Elementary Graph Algorithms（基本的图算法）",
      "slug": "ch20-graph-algorithms",
      "title": "Elementary Graph Algorithms",
      "titleZh": "基本的图算法",
      "source": {
          "printed": [
              589,
              620
          ],
          "pdf": [
              610,
              641
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch20/s01",
              "section": "20.1",
              "title": "图的表示：邻接表与邻接矩阵",
              "shortTitle": "20.1 图的表示",
              "titleEn": "Representations of graphs",
              "source": {
                  "printed": [
                      549,
                      553
                  ],
                  "pdf": [
                      570,
                      574
                  ]
              },
              "sourceNote": null,
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch20/s02",
              "section": "20.2",
              "title": "广度优先搜索：分层与最短路",
              "shortTitle": "20.2 广度优先搜索",
              "titleEn": "Breadth-first search",
              "source": {
                  "printed": [
                      554,
                      562
                  ],
                  "pdf": [
                      575,
                      584
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "20.1 图的表示",
                      "url": "#/ch20/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch20/s03",
              "section": "20.3",
              "title": "深度优先搜索：时间戳与边分类",
              "shortTitle": "20.3 深度优先搜索",
              "titleEn": "Depth-first search",
              "source": {
                  "printed": [
                      563,
                      572
                  ],
                  "pdf": [
                      584,
                      593
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "20.2 广度优先搜索",
                      "url": "#/ch20/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch20/s04",
              "section": "20.4",
              "title": "拓扑排序：DFS 的第一次应用",
              "shortTitle": "20.4 拓扑排序",
              "titleEn": "Topological sort",
              "source": {
                  "printed": [
                      573,
                      575
                  ],
                  "pdf": [
                      594,
                      596
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "20.3 Depth-first search",
                      "url": "#/ch20/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch20/s05",
              "section": "20.5",
              "title": "强连通分量：两次 DFS 定乾坤",
              "shortTitle": "20.5 强连通分量",
              "titleEn": "Strongly connected components",
              "source": {
                  "printed": [
                      576,
                      581
                  ],
                  "pdf": [
                      597,
                      599
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "20.4 Topological sort",
                      "url": "#/ch20/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "21": {
      "ch": 21,
      "chSpan": "第 21 章 · Minimum Spanning Trees（最小生成树）",
      "slug": "ch21-mst",
      "title": "Minimum Spanning Trees",
      "titleZh": "最小生成树",
      "source": {
          "printed": [
              624,
              638
          ],
          "pdf": [
              645,
              659
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch21/s01",
              "section": "21.1",
              "title": "通用 MST：安全边的循环不变量",
              "shortTitle": "21.1 生成最小生成树",
              "titleEn": "Growing a minimum spanning tree",
              "source": {
                  "printed": [
                      586,
                      590
                  ],
                  "pdf": [
                      607,
                      609
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "20.5 Strongly connected components",
                      "url": "#/ch20/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch21/s02",
              "section": "21.2",
              "title": "Kruskal 与 Prim：找安全边的两条路",
              "shortTitle": "21.2 Kruskal 与 Prim",
              "titleEn": "The algorithms of Kruskal and Prim",
              "source": {
                  "printed": [
                      591,
                      603
                  ],
                  "pdf": [
                      612,
                      625
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "21.1 Growing a minimum spanning tree",
                      "url": "#/ch21/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "22": {
      "ch": 22,
      "chSpan": "第 22 章 · Single-Source Shortest Paths（单源最短路径）",
      "slug": "ch22-sssp",
      "title": "Single-Source Shortest Paths",
      "titleZh": "单源最短路径",
      "source": {
          "printed": [
              643,
              657
          ],
          "pdf": [
              664,
              678
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch22/s01",
              "section": "22.1",
              "title": "Bellman-Ford：负权边的救星",
              "shortTitle": "22.1 Bellman-Ford",
              "titleEn": "The Bellman-Ford algorithm",
              "source": {
                  "printed": [
                      612,
                      615
                  ],
                  "pdf": [
                      633,
                      636
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "21.2 The algorithms of Kruskal and Prim",
                      "url": "#/ch21/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch22/s02",
              "section": "22.2",
              "title": "DAG-SSSP：先排序后松弛",
              "shortTitle": "22.2 DAG 上的 SSSP",
              "titleEn": "Single-source shortest paths in directed acyclic graphs",
              "source": {
                  "printed": [
                      616,
                      619
                  ],
                  "pdf": [
                      637,
                      640
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "22.1 The Bellman-Ford algorithm",
                      "url": "#/ch22/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch22/s03",
              "section": "22.3",
              "title": "Dijkstra：贪心的最短路",
              "shortTitle": "22.3 Dijkstra",
              "titleEn": "Dijkstra’s algorithm",
              "source": {
                  "printed": [
                      620,
                      624
                  ],
                  "pdf": [
                      641,
                      645
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "22.2 Single-source shortest paths in DAGs",
                      "url": "#/ch22/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch22/s04",
              "section": "22.4",
              "title": "差分约束：把线性不等式变成最短路",
              "shortTitle": "22.4 差分约束",
              "titleEn": "Difference constraints and shortest paths",
              "source": {
                  "printed": [
                      625,
                      632
                  ],
                  "pdf": [
                      646,
                      651
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "22.3 Dijkstra’s algorithm",
                      "url": "#/ch22/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch22/s05",
              "section": "22.5",
              "title": "性质证明：把欠下的账一次结清",
              "shortTitle": "22.5 性质证明",
              "titleEn": "Proofs of shortest-paths properties",
              "source": {
                  "printed": [
                      631,
                      639
                  ],
                  "pdf": [
                      652,
                      657
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "22.4 Difference constraints",
                      "url": "#/ch22/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "23": {
      "ch": 23,
      "chSpan": "第 23 章 · All-Pairs Shortest Paths（所有结点对的最短路径）",
      "slug": "ch23-apsp",
      "title": "All-Pairs Shortest Paths",
      "titleZh": "所有结点对的最短路径",
      "source": {
          "printed": [
              684,
              704
          ],
          "pdf": [
              705,
              725
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch23/s01",
              "section": "23.1",
              "title": "APSP 开篇：把最短路当成矩阵乘法",
              "shortTitle": "23.1 最短路 × 矩阵乘法",
              "titleEn": "Shortest paths and matrix multiplication",
              "source": {
                  "printed": [
                      648,
                      654
                  ],
                  "pdf": [
                      669,
                      676
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "22.5 Proofs of shortest-paths properties",
                      "url": "#/ch22/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch23/s02",
              "section": "23.2",
              "title": "Floyd-Warshall：按\"允许的中间点\"DP",
              "shortTitle": "23.2 Floyd-Warshall",
              "titleEn": "The Floyd-Warshall algorithm",
              "source": {
                  "printed": [
                      655,
                      661
                  ],
                  "pdf": [
                      676,
                      683
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "23.1 Shortest paths and matrix multiplication",
                      "url": "#/ch23/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch23/s03",
              "section": "23.3",
              "title": "Johnson：重加权让 Dijkstra 上场",
              "shortTitle": "23.3 Johnson 算法",
              "titleEn": "Johnson’s algorithm for sparse graphs",
              "source": {
                  "printed": [
                      662,
                      669
                  ],
                  "pdf": [
                      683,
                      691
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "23.2 The Floyd-Warshall algorithm",
                      "url": "#/ch23/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "24": {
      "ch": 24,
      "chSpan": "第 24 章 · Maximum Flow（最大流）",
      "slug": "ch24-maximum-flow",
      "title": "Maximum Flow",
      "titleZh": "最大流",
      "source": {
          "printed": [
              670,
              704
          ],
          "pdf": [
              691,
              725
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch24/s01",
              "section": "24.1",
              "title": "流网络：容量、流与守恒",
              "shortTitle": "24.1 流网络",
              "titleEn": "Flow networks",
              "source": {
                  "printed": [
                      671,
                      676
                  ],
                  "pdf": [
                      692,
                      697
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "23.3 Johnson’s algorithm for sparse graphs",
                      "url": "#/ch23/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch24/s02",
              "section": "24.2",
              "title": "增广路与最小割定理",
              "shortTitle": "24.2 Ford-Fulkerson",
              "titleEn": "The Ford-Fulkerson method",
              "source": {
                  "printed": [
                      676,
                      693
                  ],
                  "pdf": [
                      697,
                      714
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "24.1 Flow networks",
                      "url": "#/ch24/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch24/s03",
              "section": "24.3",
              "title": "最大二分匹配：把匹配变成流",
              "shortTitle": "24.3 最大二分匹配",
              "titleEn": "Maximum bipartite matching",
              "source": {
                  "printed": [
                      693,
                      704
                  ],
                  "pdf": [
                      714,
                      725
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "24.2 The Ford-Fulkerson method",
                      "url": "#/ch24/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "25": {
      "ch": 25,
      "chSpan": "第 25 章 · Matchings in Bipartite Graphs（二分图中的匹配）",
      "slug": "ch25-matchings",
      "title": "Matchings in Bipartite Graphs",
      "titleZh": "二分图中的匹配",
      "source": {
          "printed": [
              705,
              748
          ],
          "pdf": [
              726,
              769
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch25/s01",
              "section": "25.1",
              "title": "Hopcroft-Karp：交替路与分层加速",
              "shortTitle": "25.1 Hopcroft-Karp",
              "titleEn": "Maximum bipartite matching",
              "source": {
                  "printed": [
                      705,
                      716
                  ],
                  "pdf": [
                      726,
                      737
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "24.3 Maximum bipartite matching",
                      "url": "#/ch24/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch25/s02",
              "section": "25.2",
              "title": "稳定婚姻：延迟接受算法",
              "shortTitle": "25.2 稳定婚姻",
              "titleEn": "The stable-marriage problem",
              "source": {
                  "printed": [
                      716,
                      723
                  ],
                  "pdf": [
                      737,
                      744
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "25.1 Maximum bipartite matching",
                      "url": "#/ch25/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch25/s03",
              "section": "25.3",
              "title": "指派问题：带权匹配的最优解",
              "shortTitle": "25.3 匈牙利算法",
              "titleEn": "The Hungarian algorithm for the assignment problem",
              "source": {
                  "printed": [
                      723,
                      748
                  ],
                  "pdf": [
                      744,
                      769
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "25.2 The stable-marriage problem",
                      "url": "#/ch25/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "26": {
      "ch": 26,
      "chSpan": "第 26 章 · Parallel Algorithms（并行算法）",
      "slug": "ch26-parallel-algorithms",
      "title": "Parallel Algorithms",
      "titleZh": "并行算法",
      "source": {
          "printed": [
              750,
              791
          ],
          "pdf": [
              771,
              812
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch26/s01",
              "section": "26.1",
              "title": "work 与 span：并行算法的两把尺子",
              "shortTitle": "26.1 并行基础",
              "titleEn": "The basics of fork-join parallelism",
              "source": {
                  "printed": [
                      750,
                      769
                  ],
                  "pdf": [
                      771,
                      790
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "25.3 The Hungarian algorithm",
                      "url": "#/ch25/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch26/s02",
              "section": "26.2",
              "title": "并行矩阵乘法：同一问题的三种并行度",
              "shortTitle": "26.2 并行矩阵乘法",
              "titleEn": "Parallel matrix multiplication",
              "source": {
                  "printed": [
                      770,
                      774
                  ],
                  "pdf": [
                      791,
                      795
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "26.1 The basics of fork-join parallelism",
                      "url": "#/ch26/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch26/s03",
              "section": "26.3",
              "title": "并行归并：二分分割点换 lg²n 的 span",
              "shortTitle": "26.3 并行归并排序",
              "titleEn": "Parallel merge sort",
              "source": {
                  "printed": [
                      775,
                      791
                  ],
                  "pdf": [
                      796,
                      812
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "26.2 Parallel matrix multiplication",
                      "url": "#/ch26/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "27": {
      "ch": 27,
      "chSpan": "第 27 章 · Online Algorithms（在线算法）",
      "slug": "ch27-online-algorithms",
      "title": "Online Algorithms",
      "titleZh": "在线算法",
      "source": {
          "printed": [
              792,
              819
          ],
          "pdf": [
              813,
              840
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch27/s01",
              "section": "27.1",
              "title": "在线算法：没有未来的竞争比",
              "shortTitle": "27.1 等待电梯",
              "titleEn": "Waiting for an elevator",
              "source": {
                  "printed": [
                      792,
                      795
                  ],
                  "pdf": [
                      813,
                      816
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "26.3 Parallel merge sort",
                      "url": "#/ch26/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch27/s02",
              "section": "27.2",
              "title": "MOVE-TO-FRONT：把命中的元素拉到表头",
              "shortTitle": "27.2 维护搜索表",
              "titleEn": "Maintaining a search list",
              "source": {
                  "printed": [
                      795,
                      802
                  ],
                  "pdf": [
                      816,
                      823
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "27.1 Waiting for an elevator",
                      "url": "#/ch27/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch27/s03",
              "section": "27.3",
              "title": "在线缓存：从 k-竞争到 O(lg k)",
              "shortTitle": "27.3 在线缓存",
              "titleEn": "Online caching",
              "source": {
                  "printed": [
                      802,
                      819
                  ],
                  "pdf": [
                      823,
                      840
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "27.2 Maintaining a search list",
                      "url": "#/ch27/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "28": {
      "ch": 28,
      "chSpan": "第 28 章 · Matrix Operations（矩阵运算）",
      "slug": "ch28-matrix-operations",
      "title": "Matrix Operations",
      "titleZh": "矩阵运算",
      "source": {
          "printed": [
              819,
              849
          ],
          "pdf": [
              840,
              870
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch28/s01",
              "section": "28.1",
              "title": "LUP 分解：为什么必须选主元",
              "shortTitle": "28.1 求解线性方程组",
              "titleEn": "Solving systems of linear equations",
              "source": {
                  "printed": [
                      819,
                      833
                  ],
                  "pdf": [
                      840,
                      854
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "27.3 Online caching",
                      "url": "#/ch27/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch28/s02",
              "section": "28.2",
              "title": "求逆不比乘法难：两条互相归约的定理",
              "shortTitle": "28.2 矩阵求逆",
              "titleEn": "Inverting matrices",
              "source": {
                  "printed": [
                      834,
                      838
                  ],
                  "pdf": [
                      855,
                      859
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "28.1 LUP 分解",
                      "url": "#/ch28/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch28/s03",
              "section": "28.3",
              "title": "对称正定：主元永不为零，残差永不正交",
              "shortTitle": "28.3 对称正定与最小二乘",
              "titleEn": "Symmetric positive-definite matrices and least-squares approximation",
              "source": {
                  "printed": [
                      838,
                      849
                  ],
                  "pdf": [
                      859,
                      870
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "28.2 矩阵求逆",
                      "url": "#/ch28/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "29": {
      "ch": 29,
      "chSpan": "第 29 章 · Linear Programming（线性规划）",
      "slug": "ch29-linear-programming",
      "title": "Linear Programming",
      "titleZh": "线性规划",
      "source": {
          "printed": [
              850,
              875
          ],
          "pdf": [
              871,
              896
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch29/s01",
              "section": "29.1",
              "title": "标准形、松弛形与转轴：沿顶点走",
              "shortTitle": "29.1 线性规划的表述",
              "titleEn": "Linear programming formulations and algorithms",
              "source": {
                  "printed": [
                      850,
                      859
                  ],
                  "pdf": [
                      871,
                      880
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "28.3 对称正定与最小二乘",
                      "url": "#/ch28/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch29/s02",
              "section": "29.2",
              "title": "一种语言，五种问题：线性规划当建模工具",
              "shortTitle": "29.2 把问题写成线性规划",
              "titleEn": "Formulating problems as linear programs",
              "source": {
                  "printed": [
                      860,
                      866
                  ],
                  "pdf": [
                      881,
                      887
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "29.1 线性规划的表述",
                      "url": "#/ch29/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch29/s03",
              "section": "29.3",
              "title": "对偶：给最优性发一张证书",
              "shortTitle": "29.3 对偶",
              "titleEn": "Duality",
              "source": {
                  "printed": [
                      866,
                      875
                  ],
                  "pdf": [
                      887,
                      896
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "29.2 把问题写成线性规划",
                      "url": "#/ch29/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "30": {
      "ch": 30,
      "chSpan": "第 30 章 · Polynomials and the FFT（多项式与 FFT）",
      "slug": "ch30-polynomials-and-the-fft",
      "title": "Polynomials and the FFT",
      "titleZh": "多项式与 FFT",
      "source": {
          "printed": [
              878,
              898
          ],
          "pdf": [
              899,
              919
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch30/s01",
              "section": "30.1",
              "title": "两种表示法：系数向量与点值",
              "shortTitle": "30.1 多项式的表示",
              "titleEn": "Representing polynomials",
              "source": {
                  "printed": [
                      878,
                      885
                  ],
                  "pdf": [
                      899,
                      906
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "29.3 对偶",
                      "url": "#/ch29/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch30/s02",
              "section": "30.2",
              "title": "FFT：把求值点选成单位根",
              "shortTitle": "30.2 DFT 与 FFT",
              "titleEn": "The DFT and FFT",
              "source": {
                  "printed": [
                      885,
                      893
                  ],
                  "pdf": [
                      906,
                      914
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "30.1 多项式的表示",
                      "url": "#/ch30/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch30/s03",
              "section": "30.3",
              "title": "蝶形、级与位反转：把递归摊平成电路",
              "shortTitle": "30.3 FFT 电路",
              "titleEn": "FFT circuits",
              "source": {
                  "printed": [
                      894,
                      898
                  ],
                  "pdf": [
                      915,
                      919
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "30.2 DFT 与 FFT",
                      "url": "#/ch30/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "31": {
      "ch": 31,
      "chSpan": "第 31 章 · Number-Theoretic Algorithms（数论算法）",
      "slug": "ch31-number-theoretic-algorithms",
      "title": "Number-Theoretic Algorithms",
      "titleZh": "数论算法",
      "source": {
          "printed": [
              902,
              953
          ],
          "pdf": [
              923,
              974
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch31/s01",
              "section": "31.1",
              "title": "整除、素数与除法定理",
              "shortTitle": "31.1 初等数论概念",
              "titleEn": "Elementary number-theoretic notions",
              "source": {
                  "printed": [
                      902,
                      908
                  ],
                  "pdf": [
                      923,
                      929
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "30.3 FFT 电路",
                      "url": "#/ch30/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch31/s02",
              "section": "31.2",
              "title": "Euclid 与扩展 Euclid：最快的数论算法之一",
              "shortTitle": "31.2 最大公约数",
              "titleEn": "Greatest common divisor",
              "source": {
                  "printed": [
                      909,
                      916
                  ],
                  "pdf": [
                      930,
                      937
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.1 初等数论概念",
                      "url": "#/ch31/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch31/s03",
              "section": "31.3",
              "title": "群、环与 Z_n：模运算的代数骨架",
              "shortTitle": "31.3 模运算",
              "titleEn": "Modular arithmetic",
              "source": {
                  "printed": [
                      917,
                      923
                  ],
                  "pdf": [
                      938,
                      944
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.2 最大公约数",
                      "url": "#/ch31/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch31/s04",
              "section": "31.4",
              "title": "ax ≡ b (mod n)：解的个数由 gcd 决定",
              "shortTitle": "31.4 解模线性方程",
              "titleEn": "Solving modular linear equations",
              "source": {
                  "printed": [
                      924,
                      928
                  ],
                  "pdf": [
                      945,
                      949
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.3 模运算",
                      "url": "#/ch31/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch31/s05",
              "section": "31.5",
              "title": "中国余数定理：把大模数拆成小模数",
              "shortTitle": "31.5 中国余数定理",
              "titleEn": "The Chinese remainder theorem",
              "source": {
                  "printed": [
                      928,
                      931
                  ],
                  "pdf": [
                      949,
                      952
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.4 解模线性方程",
                      "url": "#/ch31/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s06",
              "id": "ch31/s06",
              "section": "31.6",
              "title": "阶、欧拉定理与快速幂",
              "shortTitle": "31.6 元素的幂",
              "titleEn": "Powers of an element",
              "source": {
                  "printed": [
                      931,
                      936
                  ],
                  "pdf": [
                      952,
                      957
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.5 中国余数定理",
                      "url": "#/ch31/s05"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s07",
              "id": "ch31/s07",
              "section": "31.7",
              "title": "RSA：把\"分解很难\"变成锁",
              "shortTitle": "31.7 RSA",
              "titleEn": "The RSA public-key cryptosystem",
              "source": {
                  "printed": [
                      936,
                      941
                  ],
                  "pdf": [
                      957,
                      963
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.6 元素的幂",
                      "url": "#/ch31/s06"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s08",
              "id": "ch31/s08",
              "section": "31.8",
              "title": "费马测试的漏洞与 Miller-Rabin 的补丁",
              "shortTitle": "31.8 素性测试",
              "titleEn": "Primality testing",
              "source": {
                  "printed": [
                      943,
                      953
                  ],
                  "pdf": [
                      964,
                      974
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.7 RSA",
                      "url": "#/ch31/s07"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "32": {
      "ch": 32,
      "chSpan": "第 32 章 · String Matching（字符串匹配）",
      "slug": "ch32-string-matching",
      "title": "String Matching",
      "titleZh": "字符串匹配",
      "source": {
          "printed": [
              958,
              997
          ],
          "pdf": [
              979,
              1018
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch32/s01",
              "section": "32.1",
              "title": "朴素匹配： everyone 的第一版",
              "shortTitle": "32.1 朴素匹配",
              "titleEn": "The naive string-matching algorithm",
              "source": {
                  "printed": [
                      958,
                      961
                  ],
                  "pdf": [
                      979,
                      982
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "31.8 素性测试",
                      "url": "#/ch31/s08"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch32/s02",
              "section": "32.2",
              "title": "Rabin-Karp：把比较变成算术",
              "shortTitle": "32.2 Rabin-Karp",
              "titleEn": "The Rabin-Karp algorithm",
              "source": {
                  "printed": [
                      961,
                      967
                  ],
                  "pdf": [
                      982,
                      988
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "32.1 朴素匹配",
                      "url": "#/ch32/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch32/s03",
              "section": "32.3",
              "title": "字符串匹配自动机：一次扫描不回退",
              "shortTitle": "32.3 有限自动机",
              "titleEn": "String matching with finite automata",
              "source": {
                  "printed": [
                      967,
                      974
                  ],
                  "pdf": [
                      988,
                      995
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "32.2 Rabin-Karp",
                      "url": "#/ch32/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch32/s04",
              "section": "32.4",
              "title": "KMP：前缀函数是自动机的压缩包",
              "shortTitle": "32.4 KMP",
              "titleEn": "The Knuth-Morris-Pratt algorithm",
              "source": {
                  "printed": [
                      974,
                      984
                  ],
                  "pdf": [
                      995,
                      1005
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "32.3 有限自动机",
                      "url": "#/ch32/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch32/s05",
              "section": "32.5",
              "title": "后缀数组：把整个文本排好序备用",
              "shortTitle": "32.5 后缀数组",
              "titleEn": "Suffix arrays",
              "source": {
                  "printed": [
                      984,
                      997
                  ],
                  "pdf": [
                      1005,
                      1018
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "32.4 KMP",
                      "url": "#/ch32/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "33": {
      "ch": 33,
      "chSpan": "第 33 章 · Machine-Learning Algorithms（机器学习算法）",
      "slug": "ch33-machine-learning-algorithms",
      "title": "Machine-Learning Algorithms",
      "titleZh": "机器学习算法",
      "source": {
          "printed": [
              1002,
              1038
          ],
          "pdf": [
              1023,
              1059
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch33/s01",
              "section": "33.1",
              "title": "k-means：目标函数只会下降",
              "shortTitle": "33.1 聚类",
              "titleEn": "Clustering",
              "source": {
                  "printed": [
                      1002,
                      1013
                  ],
                  "pdf": [
                      1023,
                      1034
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "30.3 FFT 电路",
                      "url": "#/ch30/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch33/s02",
              "section": "33.2",
              "title": "加权多数：向最聪明的专家看齐",
              "shortTitle": "33.2 乘法权重",
              "titleEn": "Multiplicative-weights algorithms",
              "source": {
                  "printed": [
                      1013,
                      1021
                  ],
                  "pdf": [
                      1034,
                      1042
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "33.1 聚类",
                      "url": "#/ch33/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch33/s03",
              "section": "33.3",
              "title": "梯度下降与它的收敛率",
              "shortTitle": "33.3 梯度下降",
              "titleEn": "Gradient descent",
              "source": {
                  "printed": [
                      1022,
                      1038
                  ],
                  "pdf": [
                      1043,
                      1059
                  ]
              },
              "sourceNote": null,
              "prerequisites": [
                  {
                      "label": "33.2 乘法权重",
                      "url": "#/ch33/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "34": {
      "ch": 34,
      "chSpan": "第 34 章 · NP-Completeness（NP 完全性）",
      "slug": "ch34-np-completeness",
      "title": "NP-Completeness",
      "titleZh": "NP 完全性",
      "source": {
          "printed": [
              1042,
              1103
          ],
          "pdf": [
              1063,
              1124
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch34/s01",
              "section": "34.1",
              "title": "多项式时间",
              "shortTitle": "34.1 多项式时间",
              "titleEn": "Polynomial time",
              "source": {
                  "printed": [
                      1048,
                      1055
                  ],
                  "pdf": [
                      1069,
                      1076
                  ]
              },
              "sourceNote": "本关对应原书 34.1 节（印刷页 1048–1055）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch34/s02",
              "section": "34.2",
              "title": "多项式时间验证",
              "shortTitle": "34.2 多项式时间验证",
              "titleEn": "Polynomial-time verification",
              "source": {
                  "printed": [
                      1056,
                      1060
                  ],
                  "pdf": [
                      1077,
                      1081
                  ]
              },
              "sourceNote": "本关对应原书 34.2 节（印刷页 1056–1060）。",
              "prerequisites": [
                  {
                      "label": "34.1 Polynomial time",
                      "url": "#/ch34/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch34/s03",
              "section": "34.3",
              "title": "NP 完全性与可归约性",
              "shortTitle": "34.3 NP 完全性与可归约性",
              "titleEn": "NP-completeness and reducibility",
              "source": {
                  "printed": [
                      1061,
                      1071
                  ],
                  "pdf": [
                      1082,
                      1092
                  ]
              },
              "sourceNote": "本关对应原书 34.3 节（印刷页 1061–1071）。",
              "prerequisites": [
                  {
                      "label": "34.2 Polynomial-time verification",
                      "url": "#/ch34/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch34/s04",
              "section": "34.4",
              "title": "NP 完全性的证明",
              "shortTitle": "34.4 NP 完全性的证明",
              "titleEn": "NP-completeness proofs",
              "source": {
                  "printed": [
                      1072,
                      1079
                  ],
                  "pdf": [
                      1093,
                      1100
                  ]
              },
              "sourceNote": "本关对应原书 34.4 节（印刷页 1072–1079）。",
              "prerequisites": [
                  {
                      "label": "34.3 NP-completeness and reducibility",
                      "url": "#/ch34/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch34/s05",
              "section": "34.5",
              "title": "NP 完全问题",
              "shortTitle": "34.5 NP 完全问题",
              "titleEn": "NP-complete problems",
              "source": {
                  "printed": [
                      1080,
                      1103
                  ],
                  "pdf": [
                      1101,
                      1124
                  ]
              },
              "sourceNote": "本关对应原书 34.5 节（印刷页 1080–1103）。",
              "prerequisites": [
                  {
                      "label": "34.4 NP-completeness proofs",
                      "url": "#/ch34/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "35": {
      "ch": 35,
      "chSpan": "第 35 章 · Approximation Algorithms（近似算法）",
      "slug": "ch35-approximation-algorithms",
      "title": "Approximation Algorithms",
      "titleZh": "近似算法",
      "source": {
          "printed": [
              1104,
              1139
          ],
          "pdf": [
              1125,
              1160
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "ch35/s01",
              "section": "35.1",
              "title": "顶点覆盖问题",
              "shortTitle": "35.1 顶点覆盖问题",
              "titleEn": "The vertex-cover problem",
              "source": {
                  "printed": [
                      1106,
                      1108
                  ],
                  "pdf": [
                      1127,
                      1129
                  ]
              },
              "sourceNote": "本关对应原书 35.1 节（印刷页 1106–1108）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "ch35/s02",
              "section": "35.2",
              "title": "旅行商问题",
              "shortTitle": "35.2 旅行商问题",
              "titleEn": "The traveling-salesperson problem",
              "source": {
                  "printed": [
                      1109,
                      1114
                  ],
                  "pdf": [
                      1130,
                      1135
                  ]
              },
              "sourceNote": "本关对应原书 35.2 节（印刷页 1109–1114）。",
              "prerequisites": [
                  {
                      "label": "35.1 The vertex-cover problem",
                      "url": "#/ch35/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "ch35/s03",
              "section": "35.3",
              "title": "集合覆盖问题",
              "shortTitle": "35.3 集合覆盖问题",
              "titleEn": "The set-covering problem",
              "source": {
                  "printed": [
                      1115,
                      1119
                  ],
                  "pdf": [
                      1136,
                      1140
                  ]
              },
              "sourceNote": "本关对应原书 35.3 节（印刷页 1115–1119）。",
              "prerequisites": [
                  {
                      "label": "35.2 The traveling-salesperson problem",
                      "url": "#/ch35/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "ch35/s04",
              "section": "35.4",
              "title": "随机化与线性规划",
              "shortTitle": "35.4 随机化与线性规划",
              "titleEn": "Randomization and linear programming",
              "source": {
                  "printed": [
                      1119,
                      1123
                  ],
                  "pdf": [
                      1140,
                      1144
                  ]
              },
              "sourceNote": "本关对应原书 35.4 节（印刷页 1119–1123）。",
              "prerequisites": [
                  {
                      "label": "35.3 The set-covering problem",
                      "url": "#/ch35/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "ch35/s05",
              "section": "35.5",
              "title": "子集和问题",
              "shortTitle": "35.5 子集和问题",
              "titleEn": "The subset-sum problem",
              "source": {
                  "printed": [
                      1124,
                      1139
                  ],
                  "pdf": [
                      1145,
                      1160
                  ]
              },
              "sourceNote": "本关对应原书 35.5 节（印刷页 1124–1139）。",
              "prerequisites": [
                  {
                      "label": "35.4 Randomization and linear programming",
                      "url": "#/ch35/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "A": {
      "ch": "A",
      "chSpan": "第 A 章 · Summations（求和）",
      "slug": "cha-summations",
      "title": "Summations",
      "titleZh": "求和",
      "source": {
          "printed": [
              1140,
              1152
          ],
          "pdf": [
              1161,
              1173
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "chA/s01",
              "section": "A.1",
              "title": "求和公式与性质",
              "shortTitle": "A.1 求和公式与性质",
              "titleEn": "Summation formulas and properties",
              "source": {
                  "printed": [
                      1140,
                      1144
                  ],
                  "pdf": [
                      1161,
                      1165
                  ]
              },
              "sourceNote": "本关对应原书 A.1 节（印刷页 1140–1144）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "chA/s02",
              "section": "A.2",
              "title": "定和式的界",
              "shortTitle": "A.2 定和式的界",
              "titleEn": "Bounding summations",
              "source": {
                  "printed": [
                      1145,
                      1152
                  ],
                  "pdf": [
                      1166,
                      1173
                  ]
              },
              "sourceNote": "本关对应原书 A.2 节（印刷页 1145–1152）。",
              "prerequisites": [
                  {
                      "label": "A.1 求和公式与性质",
                      "url": "#/appendix/a/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "B": {
      "ch": "B",
      "chSpan": "第 B 章 · Sets, Etc.（集合等离散结构）",
      "slug": "chb-sets-etc",
      "title": "Sets, Etc.",
      "titleZh": "集合等离散结构",
      "source": {
          "printed": [
              1153,
              1177
          ],
          "pdf": [
              1174,
              1198
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "chB/s01",
              "section": "B.1",
              "title": "集合",
              "shortTitle": "B.1 集合",
              "titleEn": "Sets",
              "source": {
                  "printed": [
                      1153,
                      1158
                  ],
                  "pdf": [
                      1174,
                      1179
                  ]
              },
              "sourceNote": "本关对应原书 B.1 节（印刷页 1153–1158）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "chB/s02",
              "section": "B.2",
              "title": "关系",
              "shortTitle": "B.2 关系",
              "titleEn": "Relations",
              "source": {
                  "printed": [
                      1158,
                      1160
                  ],
                  "pdf": [
                      1179,
                      1181
                  ]
              },
              "sourceNote": "本关对应原书 B.2 节（印刷页 1158–1160）。",
              "prerequisites": [
                  {
                      "label": "B.1 Sets",
                      "url": "#/appendix/b/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "chB/s03",
              "section": "B.3",
              "title": "函数",
              "shortTitle": "B.3 函数",
              "titleEn": "Functions",
              "source": {
                  "printed": [
                      1161,
                      1163
                  ],
                  "pdf": [
                      1182,
                      1184
                  ]
              },
              "sourceNote": "本关对应原书 B.3 节（印刷页 1161–1163）。",
              "prerequisites": [
                  {
                      "label": "B.2 Relations",
                      "url": "#/appendix/b/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "chB/s04",
              "section": "B.4",
              "title": "图",
              "shortTitle": "B.4 图",
              "titleEn": "Graphs",
              "source": {
                  "printed": [
                      1164,
                      1168
                  ],
                  "pdf": [
                      1185,
                      1189
                  ]
              },
              "sourceNote": "本关对应原书 B.4 节（印刷页 1164–1168）。",
              "prerequisites": [
                  {
                      "label": "B.3 Functions",
                      "url": "#/appendix/b/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "chB/s05",
              "section": "B.5",
              "title": "树",
              "shortTitle": "B.5 树",
              "titleEn": "Trees",
              "source": {
                  "printed": [
                      1169,
                      1177
                  ],
                  "pdf": [
                      1190,
                      1198
                  ]
              },
              "sourceNote": "本关对应原书 B.5 节（印刷页 1169–1177）。",
              "prerequisites": [
                  {
                      "label": "B.4 Graphs",
                      "url": "#/appendix/b/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "C": {
      "ch": "C",
      "chSpan": "第 C 章 · Counting and Probability（计数与概率）",
      "slug": "chc-counting-and-probability",
      "title": "Counting and Probability",
      "titleZh": "计数与概率",
      "source": {
          "printed": [
              1178,
              1213
          ],
          "pdf": [
              1199,
              1234
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "chC/s01",
              "section": "C.1",
              "title": "计数",
              "shortTitle": "C.1 计数",
              "titleEn": "Counting",
              "source": {
                  "printed": [
                      1178,
                      1183
                  ],
                  "pdf": [
                      1199,
                      1204
                  ]
              },
              "sourceNote": "本关对应原书 C.1 节（印刷页 1178–1183）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "chC/s02",
              "section": "C.2",
              "title": "概率",
              "shortTitle": "C.2 概率",
              "titleEn": "Probability",
              "source": {
                  "printed": [
                      1184,
                      1190
                  ],
                  "pdf": [
                      1205,
                      1211
                  ]
              },
              "sourceNote": "本关对应原书 C.2 节（印刷页 1184–1190）。",
              "prerequisites": [
                  {
                      "label": "C.1 Counting",
                      "url": "#/appendix/c/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s03",
              "id": "chC/s03",
              "section": "C.3",
              "title": "离散随机变量",
              "shortTitle": "C.3 离散随机变量",
              "titleEn": "Discrete random variables",
              "source": {
                  "printed": [
                      1191,
                      1195
                  ],
                  "pdf": [
                      1212,
                      1216
                  ]
              },
              "sourceNote": "本关对应原书 C.3 节（印刷页 1191–1195）。",
              "prerequisites": [
                  {
                      "label": "C.2 Probability",
                      "url": "#/appendix/c/s02"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s04",
              "id": "chC/s04",
              "section": "C.4",
              "title": "几何与二项分布",
              "shortTitle": "C.4 几何与二项分布",
              "titleEn": "The geometric and binomial distributions",
              "source": {
                  "printed": [
                      1196,
                      1202
                  ],
                  "pdf": [
                      1217,
                      1223
                  ]
              },
              "sourceNote": "本关对应原书 C.4 节（印刷页 1196–1202）。",
              "prerequisites": [
                  {
                      "label": "C.3 Discrete random variables",
                      "url": "#/appendix/c/s03"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s05",
              "id": "chC/s05",
              "section": "C.5",
              "title": "二项分布的尾部：离均值很远有多罕见",
              "shortTitle": "C.5 二项分布的尾部",
              "titleEn": "The tails of the binomial distribution",
              "source": {
                  "printed": [
                      1203,
                      1213
                  ],
                  "pdf": [
                      1224,
                      1234
                  ]
              },
              "sourceNote": "本关对应原书 C.5 节（印刷页 1203–1213）。",
              "prerequisites": [
                  {
                      "label": "C.4 The geometric and binomial distributions",
                      "url": "#/appendix/c/s04"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
  "D": {
      "ch": "D",
      "chSpan": "第 D 章 · Matrices（矩阵）",
      "slug": "chd-matrices",
      "title": "Matrices",
      "titleZh": "矩阵",
      "source": {
          "printed": [
              1214,
              1226
          ],
          "pdf": [
              1235,
              1247
          ]
      },
      "levels": [
          {
              "key": "s01",
              "id": "chD/s01",
              "section": "D.1",
              "title": "矩阵及其运算",
              "shortTitle": "D.1 矩阵及其运算",
              "titleEn": "Matrices and matrix operations",
              "source": {
                  "printed": [
                      1214,
                      1218
                  ],
                  "pdf": [
                      1235,
                      1239
                  ]
              },
              "sourceNote": "本关对应原书 D.1 节（印刷页 1214–1218）。",
              "prerequisites": [],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          },
          {
              "key": "s02",
              "id": "chD/s02",
              "section": "D.2",
              "title": "矩阵的基本性质",
              "shortTitle": "D.2 矩阵的基本性质",
              "titleEn": "Basic matrix properties",
              "source": {
                  "printed": [
                      1219,
                      1226
                  ],
                  "pdf": [
                      1240,
                      1247
                  ]
              },
              "sourceNote": "本关对应原书 D.2 节（印刷页 1219–1226）。",
              "prerequisites": [
                  {
                      "label": "D.1 Matrices and matrix operations",
                      "url": "#/appendix/d/s01"
                  }
              ],
              "stages": [
                  "map",
                  "intuition",
                  "source",
                  "pseudocode",
                  "visualize",
                  "code",
                  "analyze",
                  "prove",
                  "drill"
              ]
          }
      ]
  },
};

/** 按章号取清单条目；没有返回 null（路由归一化在 assets/chapters.js 里做）。 */
export function manifestOf(ch) {
  return Object.prototype.hasOwnProperty.call(MANIFEST, String(ch)) ? MANIFEST[String(ch)] : null;
}

export default { MANIFEST, manifestOf };
