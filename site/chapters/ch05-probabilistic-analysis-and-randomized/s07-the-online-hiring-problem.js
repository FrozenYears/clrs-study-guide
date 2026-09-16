/* 第 5 章 5.4.4：在线招聘问题（the online hiring problem）。
 *
 * 本文件由 tools/_probe/gen_s07.py 生成：英文引述逐字取自
 * data/blocks/part-i-foundations__ch05.json（已过 verify_quote 探针），
 * C 代码与 c/online_hiring.c 逐字节一致；伪代码第 1 行的 −∞ 与缩进
 * 按渲染原页 p.150 核实补回。
 */

export default {
 "key": "s07",
 "id": "ch05/s07",
 "chapter": 5,
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
  {
   "type": "map",
   "title": "把「面试完再决定」的奢望换成「当场定、只雇一次」",
   "why": "前几关总能先看完所有人再挑最好的；这一关拆掉这个前提：**必须边面试边决定，且只雇一次**。概率分析最终给出一条可执行的策略——观察前 $n/e$ 位，成功率至少 $1/e$。",
   "position": "5.1–5.3 建立了随机排列与指示器随机变量；5.4 的前三小节（生日、球与箱子、连胜纪录）用它算清了各种概率。本关是 5.4 的收尾：把指示器与积分估计合起来，回答「不能回头的决策该怎么做」。",
   "unlocks": [
    {
     "label": "6 Heapsort",
     "url": "#/ch06/s01"
    }
   ],
   "mathKit": [
    {
     "title": "调和和的积分估计",
     "body": "$\\int_k^n \\frac{dx}{x}\\le\\sum_{i=k}^{n-1}\\frac1i\\le\\int_{k-1}^{n-1}\\frac{dx}{x}$，误差不超过端点项。"
    },
    {
     "title": "导数求极值",
     "body": "对 $(k/n)(\\ln n-\\ln k)$ 关于 $k$ 求导、令其为 0，得 $k=n/e$。"
    }
   ]
  },
  {
   "type": "intuition",
   "title": "相亲只能当场定，而且只结一次婚",
   "scene": "你依次相亲：每见完一人必须**立刻**决定「就 TA」或「下一个」，最多定一次；不能回头比较已见过的人。",
   "body": [
    "先看完全部再选当然最好——但对方不会等你，这就是「在线」的含义：决策时看不见未来。",
    "于是你定一条规则：先见前 $k$ 个，纯观察、谁都不选，只记住其中最好的；之后遇到第一个**比观察期最高分还强**的人，立刻定下来。",
    "这条规则自带张力：$k$ 太短，你太早锁定一个平庸的人；$k$ 太长，最优秀的人可能被你「观察」掉，只能将就最后一位。本节的任务就是把 $k$ 调到甜点上。"
   ],
   "interactive": {
    "text": "阶段 5 的动画把 $k$ 设为 3：观察前 3 位，之后当场定。换三组预设输入，看清「成功、失败、将就」各长什么样。"
   }
  },
  {
   "type": "source",
   "title": "书上是怎么说的",
   "lead": "英文逐字取自语料（保留 PDF 抽取后的记号：`f g` 即花括号、`D` 即等号、`\\` 在语料里是交集符号）。中文解读只负责把每一步连起来。",
   "blocks": [
    {
     "kind": "body",
     "page": 150,
     "en": "As a final example, let’s consider a variant of the hiring problem. Suppose now that you do not wish to interview all the candidate s in order to find the best one.",
     "zh": "原书在这里拆掉了前几关的默认前提：不再「面试完所有人再挑最好的」。★ 下一句立刻补上第二个动机——也不想「边找到更好的边换人」。"
    },
    {
     "kind": "body",
     "page": 150,
     "en": "Instead, you are willing to settle for a candidate who is close to the best, in ex- change for hiring exactly once. You must obey one company requirement: after each interview you must either immediately offer the position to the applicant or immediately reject the applicant. What is the trade-off between minimizing the amount of interviewing and maximizing the quality of the candidate hired?",
     "zh": "约束只有一条：**每位面试完必须当场决定**——立刻发 offer 或立刻拒绝，不能反悔。★ 代价与收获写得很清楚：放弃「雇到绝对最优」的把握，换来「只雇一次」。"
    },
    {
     "kind": "body",
     "page": 150,
     "en": "We can model this problem in the following way. Aft er meeting an applicant, you are able to give each one a score. Let score(i) denote the score you give to the i th applicant, and assume that no two applicants receive the same score. After you have seen j applicants, you know which of the j has the highest score, but you do not know whether any of the remaining n − j applicants will receive a higher score. You decide to adopt the strategy of selecting a positive integer k<n , interviewing and then rejecting the first k applicants, and hiring the first applicant thereafter who has a higher score than all preceding applicants. If it turns out that the best-qualified applicant was among the first k interviewed, then you hire the nth applicant—the last one interviewed. We formalize this strategy in the procedure",
     "zh": "模型化三件事：① 每人一个分数 $score(i)$，互不相同；② 看完前 $j$ 人后知道他们的最高分，但不知道后面还会不会更高；③ 策略是先拒绝前 $k$ 位、之后雇第一个超过观察期最高分的人。★ 最容易漏的是最后一句：**全局最优若落在前 $k$ 位，你只能雇第 $n$ 位**——观察期是纯沉没成本。"
    },
    {
     "kind": "body",
     "page": 150,
     "en": "ONLINE-MAXIMUM(k,n) , which returns the index of the candidate you wish to hire.",
     "zh": "ONLINE-MAXIMUM$(k,n)$ 返回的是**下标**：你决定雇用的人的序号。★ 记住「返回 $n$」的特殊含义：没人超过观察期最高分，只好雇最后一位。"
    },
    {
     "kind": "body",
     "page": 150,
     "en": "If we determine, for each possible value of k, the probability that you hire the most qualified applicant, then you can choose the best possible k and implement the strategy with that value. For the moment, assume that k is fixed. Let",
     "zh": "把 $k$ 当成待定参数：对每个可能的 $k$ 算「雇到最优秀者」的概率，选概率最大的。★ 下面先固定 $k$ 分析，最后再对 $k$ 求极值——分析顺序不要乱。"
    },
    {
     "kind": "body",
     "page": 151,
     "en": "1 through j . Let S be the event that you succeed in choosing the best-qualified applicant, and let S i be the event that you succeed when the best-qualified applicant is the i th one interviewed. Since the various S i are disjoint, we have that Pr fS g = P n i D1 Pr fS i g. Noting that you never succeed when the best-qualified applicant is one of the first k, we have that Pr fS i g = 0 for i = 1,2,…,k . Thus, we obtain Pr fS g = n X i Dk + 1",
     "zh": "定义 $S$：雇到全局最优秀的人；$S_i$：最优秀的人恰在第 $i$ 位且你成功雇到他。★ 各 $S_i$ **互斥**，所以总概率可以直接相加；而 $i\\le k$ 时你从不雇人，$\\Pr\\{S_i\\}=0$——求和只需从 $k+1$ 开始，这就是式 (5.14)。"
    },
    {
     "kind": "body",
     "page": 151,
     "en": "We now compute Pr fS i g. In order to succeed when the best-qualified applicant is the i th one, two things must happen. First, the best-qualified applicant must be in position i , an event which we denote by B i . Second, the algorithm must not select any of the applicants in positions k + 1 through i − 1, which happens only if, for each j such that k + 1 ≤ j ≤ i − 1, line 6 finds that score(j)< best-score. (Because scores are unique, we can ignore the possibility of score(j) = best-score.)",
     "zh": "成功要两件事同时发生：$B_i$（最优秀者恰在第 $i$ 位）与 $O_i$（决策期在第 $i$ 位之前无人被雇，即 $k+1\\dots i-1$ 位的分数都不超过观察期最高分 $M(k)$）。★ 分数互不相同，所以不用考虑打平的情形。"
    },
    {
     "kind": "body",
     "page": 151,
     "en": "In other words, all of the values score(k + 1) through score(i − 1) must be less than M(k). If any are greater than M(k), the algorithm instead returns the index of the first one that is greater. We use O i to denote the event that none of the applicants in position k + 1 through i − 1 are chosen. Fortunately, the two events B i and O i are independent. The event O i depends only on the relative ordering of the values in positions 1 through i − 1, whereas B i depends only on whether the value in position i is greater than the values in all other positions. The ordering of the values in positions 1 through i − 1 does not affect whether the value in position i is greater than all of them, and the value in position i does not affect the ordering of the values in positions 1 through i − 1. Thus, we can apply equation (C.17) on page 1188 to obtain Pr fS i g = Pr fB i \\ O i g = Pr fB i g Pr fO i g :",
     "zh": "为什么敢把两个概率直接相乘？$O_i$ 只取决于前 $i-1$ 个分数的**相对次序**，$B_i$ 只取决于第 $i$ 位是不是全场最高——互不干扰，独立。★ 语料里的 `\\` 实为交集符号（渲染 p.151 核实）：$\\Pr\\{S_i\\}=\\Pr\\{B_i\\cap O_i\\}$。"
    },
    {
     "kind": "body",
     "page": 151,
     "en": "We have Pr fB i g = 1/n since the maximum is equally likely to be in any one of the n positions. For event O i to occur, the maximum value in positions 1 through i − 1, which is equally likely to be in any of these i − 1 positions, must be in one of the first k positions. Consequently, Pr fO i g = k=.i − 1/ and Pr fS i g = k=.n(i − 1)/.",
     "zh": "两个分量各算各的：$\\Pr\\{B_i\\}=1/n$（最高分等可能出现在任何位置）；$\\Pr\\{O_i\\}=k/(i-1)$（前 $i-1$ 位中的最大值要落在前 $k$ 位里）。★ 合起来 $\\Pr\\{S_i\\}=k/(n(i-1))$——注意分母是 $i-1$，不是 $i$。"
    },
    {
     "kind": "body",
     "page": 152,
     "en": "We approximate by integrals to bound this summation from above and below. By the inequalities (A.19) on page 1150, we have",
     "zh": "调和和没有闭式，原书用积分上下夹逼（附录 A 不等式 A.19）给 $\\sum_{i=k}^{n-1}1/i$ 找一个又紧又好算的界。"
    },
    {
     "kind": "body",
     "page": 152,
     "en": "Evaluating these definite integrals gives us the bounds k n (ln n − ln k) ≤ Pr fS g ≤ k n (ln(n − 1) − ln(k − 1)); which provide a rather tight bound for Pr fS g. Because you wish to maximize your probability of success, let us focus on choosing the value of k that maximizes the lower bound on Pr fS g. (Besides, the lower-bound expression is easier to maximize than the upper-bound expression.) Differentiating the expression (k/n).ln n −ln k/ with respect to k, we obtain n (ln n − ln k − 1):",
     "zh": "积分求值（$\\ln$ 是自然对数）。★ 关键读法：上下界都形如 $\\frac{k}{n}\\times$（两对数之差）。原书明确说：要最大化的是**下界**——保守估计，而且更好求导。"
    },
    {
     "kind": "body",
     "page": 152,
     "en": "Setting this derivative equal to 0, we see that you maximize the lower bound on the probability when ln k = ln n − 1 = ln(n/e) or, equivalently, when k = n/e.",
     "zh": "令导数为 0：$\\ln k=\\ln n-1=\\ln(n/e)$，即 $k=n/e$。★ 这就是「37% 法则」的出处：先观察约 37% 的人。"
    },
    {
     "kind": "body",
     "page": 152,
     "en": "Thus, if you implement our strategy with k = n/e, you succeed in hiring the best-qualified applicant with probability at least 1/e.",
     "zh": "结论：取 $k=n/e$，雇到全局最优的概率**至少** $1/e\\approx0.368$。★ 注意措辞是下界——真实最优概率比它略高（$n=8,k=3$ 时约 0.410，见阶段 7 的精确表）。"
    }
   ],
   "terms": [
    {
     "en": "online hiring problem",
     "zh": "在线招聘问题",
     "page": 150
    },
    {
     "en": "best-qualified applicant",
     "zh": "最优秀的申请人",
     "page": 150
    },
    {
     "en": "ONLINE-MAXIMUM",
     "zh": "在线最大值（过程名）",
     "page": 150
    },
    {
     "en": "probability of success",
     "zh": "成功概率",
     "page": 152
    }
   ]
  },
  {
   "type": "pseudocode",
   "title": "原书伪代码：ONLINE-MAXIMUM",
   "algo": "ONLINE-MAXIMUM",
   "signature": "ONLINE-MAXIMUM(k, n)",
   "page": 150,
   "lines": [
    {
     "n": 1,
     "code": "best-score = −∞",
     "zh": "观察期最高分的初值取 $-\\infty$（渲染 p.150 核实；语料把 $\\infty$ 误抽成了 1）。任何真实分数都比它大，第 1 位必然入选。"
    },
    {
     "n": 2,
     "code": "for i = 1 to k",
     "zh": "观察期：面试前 $k$ 位，只记录最高分，不做任何决定。"
    },
    {
     "n": 3,
     "code": "    if score(i) > best-score",
     "zh": "逐位与当前观察期最高分比较。"
    },
    {
     "n": 4,
     "code": "        best-score = score(i)",
     "zh": "刷新观察期最高分。"
    },
    {
     "n": 5,
     "code": "for i = k + 1 to n",
     "zh": "决策期：从第 $k+1$ 位开始，边面试边决定。"
    },
    {
     "n": 6,
     "code": "    if score(i) > best-score",
     "zh": "第一个超过观察期最高分的人出现了。"
    },
    {
     "n": 7,
     "code": "        return i",
     "zh": "当场雇用第 $i$ 位，过程到此结束。"
    },
    {
     "n": 8,
     "code": "return n",
     "zh": "兜底：决策期无人超过观察期最高分，只好雇最后一位。全局最优若在观察期，必然走到这里。"
    }
   ],
   "vars": [
    {
     "name": "best-score",
     "meaning": "观察期（前 $k$ 位）中的最高分，初值 $-\\infty$"
    },
    {
     "name": "k",
     "meaning": "观察期长度：先观察再决策的分界（$1\\le k<n$）"
    },
    {
     "name": "n",
     "meaning": "申请人总数"
    },
    {
     "name": "score(i)",
     "meaning": "第 $i$ 位申请人的分数，两两互不相同"
    }
   ],
   "note": "缩进按渲染页 p.150 补回（语料抽取丢失了缩进）：第 3–4 行属于第一个 for，第 6–7 行属于第二个 for，第 8 行在两个循环之外。阶段 6 的动画演示里用 −1 充当 $-\\infty$（分数恒为正，二者等价）。"
  },
  {
   "type": "visualize",
   "title": "看观察期怎么「过滤」掉最优秀的人",
   "viz": "array",
   "algorithm": "online-maximum",
   "pseudocodeRef": "ONLINE-MAXIMUM",
   "input": {
    "array": [
     3,
     1,
     4,
     8,
     2,
     5,
     6,
     7
    ]
   },
   "algoArgs": [
    3
   ],
    "countLabels": {
     "interviews": { "label": "已面试", "unit": "人" }
    },
   "invariants": [
    {
     "label": "观察期内不雇人，只记 best-score；决策期只雇第一个超过 best-score 的人"
    }
   ],
   "presets": [
    {
     "name": "成功：全局最高分在决策期",
     "array": [
      3,
      1,
      4,
      8,
      2,
      5,
      6,
      7
     ]
    },
    {
     "name": "失败：全局最高分被挡在观察期",
     "array": [
      8,
      1,
      2,
      3,
      4,
      5,
      6,
      7
     ]
    },
    {
     "name": "将就：决策期过早锁定次优",
     "array": [
      2,
      3,
      1,
      7,
      4,
      5,
      8,
      6
     ]
    }
   ],
   "tasks": [
    "预设①：观察期（前 3 位）最高分是 4，第 4 位分数 8 超过它——当场雇用，恰好是全局最高分。",
    "预设②：全局最高分 8 在第 1 位（观察期内），决策期没人能超过 8，只能雇最后一位——这就是「观察期过长」的代价。",
    "预设③：观察期最高分 3 很低，第 4 位的 7 立刻超过它——你雇到了次优，而真正的最高分 8 还在后面。$k$ 太小就是这个下场。",
    "把数组换成你自己的 1..8 排列再跑一遍：数数有多少排列能命中全局最高分（阶段 7 的表给出 $n=8$ 时的精确比例）。"
   ]
  },
  {
   "type": "code",
   "title": "同一份思路的 C 实现",
   "intro": "程序做三件事：对 $n=8$ 枚举全部 $8!=40320$ 种排列求每个 $k$ 的精确成功率；核对书中公式 $\\Pr\\{S\\}=\\frac{k}{n}\\sum_{i=k}^{n-1}\\frac1i$；再对 $n=100$ 做蒙特卡洛，确认峰值在 $k\\approx n/e$ 处、成功率 $\\approx 1/e$。",
   "pseudocodeRef": "ONLINE-MAXIMUM",
   "c": {
    "file": "online_hiring.c",
    "code": String.raw`/* online_hiring.c -- 5.4.4 在线招聘问题（原书 p.150–152）的数值验证。
 *
 * 书中约定（原书 p.150 的 ONLINE-MAXIMUM(k, n)）：
 *   - 下标从 1 开始：best-score = −∞ 是虚拟下界（渲染原页核实为 −∞）；
 *     前 k 位只观察（observe），之后遇到第一个分数严格高于 best-score 的
 *     候选人就当场雇用，返回其序号 i；若决策期无人超过 best-score，
 *     则返回 n（雇用最后一位）。
 *   - 本程序里数组下标从 0 开始，因此第 i 位（书里 1 基）对应 ranks[i-1]。
 *     函数 online_maximum 返回的是「1 基序号」：雇到第 pos 位（1 基），
 *     与书的 return i 一致；返回 n 表示雇用最后一位（书里的兜底 return n）。
 *
 * 验证内容：
 *   1) 对 n = 8 直接枚举全部 8! = 40320 种排列，求每个 k = 1..8 的精确成功率，
 *      并核对书中公式 Pr{S} = (k/n)·Σ_{i=k}^{n-1} 1/i；
 *   2) 断言 k = round(n/e) 时成功率 ≥ 1/e（这是书中给出的下界），偏离时下降；
 *   3) 对更大的 n = 100 做蒙特卡洛，确认成功率峰值出现在 k ≈ n/e 附近，且 ≈ 1/e。
 */

#include <assert.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

/* 书中 ONLINE-MAXIMUM(k, n) 的 0 基实现。
 * ranks: 按面试顺序排列的分数；n：候选人数；k：观察期长度（1 基，与书一致）。
 * 返回：被雇用者的序号（1 基）；若雇用最后一位则返回 n。 */
static int online_maximum(const int *ranks, int n, int k) {
    int best_score = INT_MIN;   /* 书中的 best-score = −∞；C 里用 INT_MIN 充当 −∞ */
    int i;
    /* 观察期：面试前 k 位，只记录最高分，不做任何决定 */
    for (i = 1; i <= k; i++) {
        if (ranks[i - 1] > best_score) {
            best_score = ranks[i - 1];
        }
    }
    /* 决策期：遇到第一个超过 best-score 的就雇用 */
    for (i = k + 1; i <= n; i++) {
        if (ranks[i - 1] > best_score) {
            return i;       /* 书的 return i */
        }
    }
    return n;               /* 书的兜底 return n（雇用最后一位） */
}

/* 判断第 pos 位（1 基）是否恰好是全局最高分 */
static int is_global_best(const int *ranks, int n, int pos) {
    int g = ranks[0];
    int i;
    for (i = 1; i < n; i++) {
        if (ranks[i] > g) g = ranks[i];
    }
    return ranks[pos - 1] == g;
}

/* 枚举全排列（Heap 算法），统计 k 在全部排列下命中全局最高分的次数。 */
static void enumerate(int *arr, int n, int k, int start, long *count) {
    int i, t;
    if (start == n) {
        int hired = online_maximum(arr, n, k);
        if (is_global_best(arr, n, hired)) (*count)++;
        return;
    }
    for (i = start; i < n; i++) {
        t = arr[start]; arr[start] = arr[i]; arr[i] = t;
        enumerate(arr, n, k, start + 1, count);
        t = arr[start]; arr[start] = arr[i]; arr[i] = t;
    }
}

/* 蒙特卡洛：对给定 n 与 k，随机生成 n! 的随机排列（Fisher–Yates），
 * 返回命中全局最高分的频率。trials 次试验。 */
static double montecarlo(int n, int k, long trials) {
    int *arr = malloc((size_t)n * sizeof(int));
    long hits = 0;
    long t;
    for (t = 0; t < trials; t++) {
        int i;
        for (i = 0; i < n; i++) arr[i] = i + 1;   /* 1..n 的一个排列 */
        for (i = n - 1; i > 0; i--) {
            int j = (int)(rand() / (RAND_MAX + 1.0) * (i + 1));
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        if (is_global_best(arr, n, online_maximum(arr, n, k))) hits++;
    }
    free(arr);
    return (double)hits / (double)trials;
}

/* 书中公式：Pr{S} = (k/n)·Σ_{i=k}^{n-1} 1/i（k < n 时成立；k = n 时退化返回 0）。 */
static double book_prob(int n, int k) {
    if (k >= n) return 0.0;
    double s = 0.0;
    int i;
    for (i = k; i <= n - 1; i++) s += 1.0 / (double)i;
    return (double)k / (double)n * s;
}

/* 不依赖 libm 的绝对值（避免链接 -lm 时仍满足 -Werror）。 */
static double dabs(double x) {
    return x < 0.0 ? -x : x;
}

/* 1/e（自然常数倒数），原书给出的最优成功率下界。不用 M_E 宏，
 * 以免 -std=c99 下未定义、又要链接 -lm。 */
static const double INV_E = 1.0 / 2.71828182845904523536;

int main(void) {
    /* ---------- 1) n = 8 精确枚举 ---------- */
    const int n = 8;
    int arr[8];
    long total = 1;
    int i;
    for (i = 2; i <= n; i++) total *= i;   /* 8! = 40320 */

    printf("n = %d，全部 %ld 种排列的精确成功率：\n", n, total);
    printf("  k    成功率      书中公式\n");

    double p[9];   /* p[1..8] */
    for (int k = 1; k <= n; k++) {
        long cnt = 0;
        for (i = 0; i < n; i++) arr[i] = i + 1;
        enumerate(arr, n, k, 0, &cnt);
        p[k] = (double)cnt / (double)total;
        double bp = book_prob(n, k);
        printf("  %d   %.6f    %.6f\n", k, p[k], bp);
        if (k < n) {
            /* 书中公式对 k < n 给出精确值，必须与枚举一致 */
            assert(dabs(p[k] - bp) < 1e-9);
        }
    }

    /* k = round(n/e) 是使下界最大的观察期长度 */
    int kopt = (int)(0.5 + (double)n * INV_E);   /* round(8/e) = 3 */
    assert(p[kopt] >= INV_E);              /* 成功率至少 1/e */
    assert(p[1] <= p[kopt]);                   /* 观察期过短 → 下降 */
    assert(p[2] <= p[kopt]);
    assert(p[7] <= p[kopt]);                   /* 观察期过长 → 下降 */
    assert(p[8] <= p[kopt]);

    /* ---------- 2) 蒙特卡洛：n = 100，峰值在 k ≈ n/e ---------- */
    srand(12345);
    {
        int N = 100;
        int ks[3] = {20, 37, 50};
        double pm[3];
        for (int t = 0; t < 3; t++) {
            pm[t] = montecarlo(N, ks[t], 100000L);
            printf("n=%d, k=%d, 蒙特卡洛成功率 ≈ %.4f (1/e ≈ %.4f)\n",
                   N, ks[t], pm[t], INV_E);
        }
        assert(pm[1] >= INV_E - 0.03);     /* k≈n/e 附近成功率贴近 1/e */
        assert(pm[1] >= pm[0] - 0.02);         /* 偏离最优 k 成功率下降 */
        assert(pm[1] >= pm[2] - 0.02);
    }

    printf("online_hiring checks passed.\n");
    return 0;
}
`,
    "notes": [
     {
      "line": 28,
      "zh": "INT_MIN 充当书中的 $-\\infty$；分数恒为正，第 1 位必然入选观察期最高分。"
     },
     {
      "line": 39,
      "zh": "对应书的第 7 行 return i：返回 1 基序号。"
     },
     {
      "line": 42,
      "zh": "对应书的第 8 行兜底：雇最后一位。"
     }
    ],
    "tests": [
     {
      "in": "n=8, k=3（枚举全部排列）",
      "out": "成功率 0.409821 ≥ 1/e ≈ 0.3679"
     },
     {
      "in": "n=100, k=37（蒙特卡洛 10 万次）",
      "out": "成功率 ≈ 0.372 ≈ 1/e；k=20/50 时都更低"
     }
    ]
   },
   "mapping": [
    {
     "pc": 1,
     "pcCode": "best-score = −∞",
     "c": "`int best_score = INT_MIN;`（INT_MIN 充当 $-\\infty$）"
    },
    {
     "pc": 2,
     "pcCode": "for i = 1 to k",
     "c": "`for (i = 1; i <= k; i++)` 观察期循环"
    },
    {
     "pc": 3,
     "pcCode": "if score(i) > best-score",
     "c": "`if (ranks[i - 1] > best_score)`（`ranks[i-1]` 对应书的 `score(i)`）"
    },
    {
     "pc": 4,
     "pcCode": "best-score = score(i)",
     "c": "`best_score = ranks[i - 1];`"
    },
    {
     "pc": 5,
     "pcCode": "for i = k + 1 to n",
     "c": "`for (i = k + 1; i <= n; i++)` 决策期循环"
    },
    {
     "pc": 6,
     "pcCode": "if score(i) > best-score",
     "c": "`if (ranks[i - 1] > best_score)`"
    },
    {
     "pc": 7,
     "pcCode": "return i",
     "c": "`return i;`（1 基序号，与书一致）"
    },
    {
     "pc": 8,
     "pcCode": "return n",
     "c": "`return n;`（雇最后一位）"
    }
   ]
  },
  {
   "type": "analyze",
   "title": "成功率是多少，怎么随 k 变化",
   "intro": "把原书的推导链完整展开：事件分解 → 单个概率 → 求和 → 积分夹逼 → 求导取极值。",
   "claims": [
    {
     "expr": "\\Pr\\{S\\}=\\frac{k}{n}\\sum_{i=k}^{n-1}\\frac{1}{i}",
     "when": "成功概率（书中公式，$k<n$）",
     "page": [
      151,
      152
     ],
     "source": "book"
    },
    {
     "expr": "\\frac{k}{n}(\\ln n-\\ln k)\\le\\Pr\\{S\\}\\le\\frac{k}{n}(\\ln(n-1)-\\ln(k-1))",
     "when": "积分夹逼的上下界",
     "page": 152,
     "source": "book"
    },
    {
     "expr": "k=\\frac{n}{e}\\;\\Rightarrow\\;\\Pr\\{S\\}\\ge\\frac{1}{e}",
     "when": "最优观察期与成功率下界",
     "page": 152,
     "source": "book"
    },
    {
     "expr": "\\Pr\\{S_i\\}=\\frac{1}{n}\\cdot\\frac{k}{i-1}",
     "when": "单个事件的概率（$B_i$ 与 $O_i$ 独立）",
     "page": 151,
     "source": "book"
    }
   ],
   "tables": [
    {
     "caption": "n=8 时各 k 的精确成功率（阶段 6 的 C 程序枚举全部 40320 种排列）",
     "rows": [
      [
       "k",
       "精确成功率",
       "书中公式 $\\frac{k}{n}\\sum_{i=k}^{n-1}1/i$"
      ],
      [
       "1",
       "0.324107",
       "0.324107"
      ],
      [
       "2",
       "0.398214",
       "0.398214"
      ],
      [
       "3",
       "0.409821",
       "0.409821（峰值 = round(8/e)）"
      ],
      [
       "4",
       "0.379762",
       "0.379762"
      ],
      [
       "5",
       "0.318452",
       "0.318452"
      ],
      [
       "6",
       "0.232143",
       "0.232143"
      ],
      [
       "7",
       "0.125000",
       "0.125000"
      ],
      [
       "8",
       "0.125000",
       "求和式退化为 0；真实值由兜底 return n 给出（1/n）"
      ]
     ]
    }
   ],
   "chart": {
    "xMax": 32,
    "series": [
     {
      "name": "下界 (k/n)(ln n − ln k)，固定 k=3",
      "expr": "(3/n)*(Math.log(n)-Math.log(3))",
      "color": "--viz-active"
     },
     {
      "name": "上界 (k/n)(ln(n−1) − ln(k−1))，固定 k=3",
      "expr": "(3/n)*(Math.log(n-1)-Math.log(2))",
      "color": "--viz-done"
     }
    ]
   },
   "derivations": [
    {
     "title": "从事件分解到求和",
     "steps": [
      {
       "tex": "\\Pr\\{S\\}=\\sum_{i=1}^{n}\\Pr\\{S_i\\}",
       "zh": "各 $S_i$ 互斥，总概率是之和。"
      },
      {
       "tex": "\\Pr\\{S_i\\}=0\\;(i\\le k)",
       "zh": "前 $k$ 位只观察不雇，最佳者若落在观察期必失败。"
      },
      {
       "tex": "\\Pr\\{S\\}=\\sum_{i=k+1}^{n}\\Pr\\{S_i\\}",
       "zh": "只需看决策期——这就是式 (5.14)。"
      }
     ]
    },
    {
     "title": "单个概率与积分夹逼",
     "steps": [
      {
       "tex": "\\Pr\\{S_i\\}=\\Pr\\{B_i\\}\\Pr\\{O_i\\}=\\frac{1}{n}\\cdot\\frac{k}{i-1}",
       "zh": "$B_i$：最佳者在第 $i$ 位；$O_i$：前 $i-1$ 位的最大值落在前 $k$ 位。两者独立。"
      },
      {
       "tex": "\\Pr\\{S\\}=\\frac{k}{n}\\sum_{i=k}^{n-1}\\frac{1}{i}",
       "zh": "代入并换元（$j=i-1$）得书中求和式。"
      },
      {
       "tex": "\\int_k^n\\frac{dx}{x}\\le\\sum_{i=k}^{n-1}\\frac{1}{i}\\le\\int_{k-1}^{n-1}\\frac{dx}{x}",
       "zh": "积分上下夹逼调和和（不等式 A.19）。"
      },
      {
       "tex": "\\frac{k}{n}(\\ln n-\\ln k)\\le\\Pr\\{S\\}\\le\\frac{k}{n}(\\ln(n-1)-\\ln(k-1))",
       "zh": "积分求值即得上下界。"
      }
     ]
    },
    {
     "title": "求导取极值",
     "steps": [
      {
       "tex": "\\frac{d}{dk}\\left[\\frac{k}{n}(\\ln n-\\ln k)\\right]=\\frac{1}{n}(\\ln n-\\ln k-1)",
       "zh": "对下界关于 $k$ 求导。"
      },
      {
       "tex": "\\ln k=\\ln n-1=\\ln(n/e)\\;\\Rightarrow\\;k=n/e",
       "zh": "令导数为 0，得最优观察期长度。"
      },
      {
       "tex": "\\Pr\\{S\\}\\ge\\frac{1}{e}\\approx0.368",
       "zh": "此时下界最大——成功率至少约 37%。"
      }
     ]
    }
   ],
   "note": "上图固定 $k=3$（横轴是总人数 $n$）：固定观察期时成功率随 $n$ 增大而下降——想保持成功率，$k$ 必须随 $n$ 长大，最优比例恒为 $k/n=1/e$。$k=8$（=n）时求和式为空（退化为 0），真实成功率由兜底 return n 给出，为 $1/n$。"
  },
  {
   "type": "prove",
   "title": "为什么 k = n/e 能保底 1/e",
   "statement": "Thus, if you implement our strategy with k = n/e, you succeed in hiring the best-qualified applicant with probability at least 1/e.",
   "page": 152,
   "intro": "三步走：定义互斥事件 → 算出单个概率 → 求和、夹逼、取极值。",
   "steps": [
    {
     "title": "第一步 · 定义事件",
     "en": "Let S be the event that you succeed in choosing the best-qualified applicant, and let S i be the event that you succeed when the best-qualified applicant is the i th one interviewed.",
     "page": 151,
     "body": [
      "$S$：雇到全局最优秀的人；$S_i$：最佳者恰在第 $i$ 位且被选中。",
      "各 $S_i$ 互斥，且 $i\\le k$ 时 $\\Pr\\{S_i\\}=0$——求和从 $k+1$ 开始。"
     ]
    },
    {
     "title": "第二步 · 计算 Pr{S_i}",
     "en": "We have Pr fB i g = 1/n since the maximum is equally likely to be in any one of the n positions. For event O i to occur, the maximum value in positions 1 through i − 1, which is equally likely to be in any of these i − 1 positions, must be in one of the first k positions. Consequently, Pr fO i g = k=.i − 1/ and Pr fS i g = k=.n(i − 1)/.",
     "page": 151,
     "body": [
      "$\\Pr\\{B_i\\}=1/n$；$\\Pr\\{O_i\\}=k/(i-1)$；两者独立，故 $\\Pr\\{S_i\\}=k/(n(i-1))$。"
     ]
    },
    {
     "title": "第三步 · 求和、夹逼、取极值",
     "en": "Evaluating these definite integrals gives us the bounds k n (ln n − ln k) ≤ Pr fS g ≤ k n (ln(n − 1) − ln(k − 1)); which provide a rather tight bound for Pr fS g. Because you wish to maximize your probability of success, let us focus on choosing the value of k that maximizes the lower bound on Pr fS g. (Besides, the lower-bound expression is easier to maximize than the upper-bound expression.) Differentiating the expression (k/n).ln n −ln k/ with respect to k, we obtain n (ln n − ln k − 1):",
     "page": 152,
     "body": [
      "代入求和得 $\\Pr\\{S\\}=\\frac{k}{n}\\sum_{i=k}^{n-1}\\frac1i$；积分夹逼给出上下界。",
      "对下界求导、令其为 0（原书下一页）：$k=n/e$，此时成功率至少 $1/e$。"
     ]
    }
   ],
   "conclusion": "取 $k=n/e$（四舍五入），在线策略以至少 $1/e\\approx0.368$ 的概率雇到全局最优秀的人——在「不能回头、只雇一次」的约束下，这是可证明的最优常数下界。"
  },
  {
   "type": "drill",
   "title": "检验一下",
   "items": [
    {
     "kind": "judge",
     "q": "在线招聘问题的最优策略是「面试完所有人再挑最好的」。",
     "answer": false,
     "why": "原书恰好拆掉这个前提：必须边面试边决定，且只雇一次。"
    },
    {
     "kind": "judge",
     "q": "观察期（前 k 位）里算法也可能雇人。",
     "answer": false,
     "why": "观察期只记录 best-score，不做任何决定；决定从第 k+1 位才开始。"
    },
    {
     "kind": "single",
     "q": "决策期遇到第一个超过观察期最高分的人，算法会？",
     "options": [
      "继续观察下一位",
      "当场雇用他",
      "回头雇观察期最高分那位",
      "雇用最后一位"
     ],
     "answer": 1,
     "why": "对应伪代码第 6–7 行：超过 best-score 立即 return i。"
    },
    {
     "kind": "single",
     "q": "若决策期无人超过观察期最高分，算法返回？",
     "options": [
      "0",
      "第 1 位",
      "观察期最高分所在位",
      "第 n 位（最后一位）"
     ],
     "answer": 3,
     "why": "对应伪代码第 8 行兜底 return n。"
    },
    {
     "kind": "single",
     "q": "使成功率下界最大的观察期长度是？",
     "options": [
      "k=1",
      "k=n/2",
      "k=n/e",
      "k=n"
     ],
     "answer": 2,
     "why": "对下界求导取极值得 k=n/e，成功率至少 1/e。"
    },
    {
     "kind": "simulate",
     "q": "数组按面试顺序为 [3, 1, 4, 8, 2, 5, 6, 7]、k=3：算法最终雇到第几位（1 基）？",
     "expect": [
      4
     ],
     "placeholder": "例如：4",
     "why": "观察期 [3,1,4] 最高分 4；第 4 位分数 8 超过 4，当场雇用——恰为全局最高分。"
    },
    {
     "kind": "simulate",
     "q": "数组为 [8, 1, 2, 3, 4, 5, 6, 7]、k=3：算法最终雇到第几位？",
     "expect": [
      8
     ],
     "placeholder": "例如：8",
     "why": "全局最高分 8 在第 1 位（观察期内），决策期无人超过 8，兜底 return n=8。"
    },
    {
     "kind": "single",
     "q": "k=n/e 时，雇到全局最优的概率下界约为？",
     "options": [
      "1/2",
      "1/e ≈ 0.368",
      "1/n",
      "ln n / n"
     ],
     "answer": 1,
     "why": "书中结论：成功率至少 1/e。"
    }
   ],
   "bookExercises": []
  }
 ]
};
