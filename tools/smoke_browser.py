#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
真机验证：用无头 Chrome 打开站点每个阶段，检查渲染结果。
不是语法检查，是真的让浏览器跑一遍 JS 再读回 DOM。

用法：python tools/smoke_browser.py [port]
"""
import html as html_mod
import os
import re
import subprocess
import sys
import tempfile

# Windows 控制台默认 GBK：把输出重定向到文件时，页面里的 ↔ ′ 等字符会让 print 直接抛
# UnicodeEncodeError，跑到一半就看不到结果了。这里强制按 UTF-8 写。
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = sys.argv[1] if len(sys.argv) > 1 else "8317"
BASE = f"http://127.0.0.1:{PORT}/index.html"

# (路由, 必须出现的关键片段, 不允许出现的片段)
NOT_PENDING = "该章的关卡文件还没写"
CASES = [
    # 首页 = 书的目录 + 进度层（2026-09 编辑部风改版：卡片宫格 -> 目录条目）
    # ★ 第 32 轮补建第 1 章后，39 章全部建成，目录里不再有「待建」标记，
    #   这条期望换成第一章的目录条目（它同时验证地图能渲染新章）。
    ("#/", ["闯关式学习站", "toc__row", "Part I Foundations", "算法在计算中的作用", "从这里开始"],
     ["页面走丢了", "card--link"]),
    # 错题本（A1）：无头浏览器每次都是全新 profile，本机存档为空 —— 断言空状态。
    ("#/wrong", ["错题本是空的", "闯关测验里答错的题会自动记到这里", "回到学习地图"],
     [NOT_PENDING, "页面走丢了"]),
    # 术语表（A3）：全站聚合，断言有字母头、有英文术语、可直接反查到关卡。
    ("#/glossary", ["术语表", "中英对照与出处反查", "loop invariant", "gloss-link",
                    "#/ch02/s01/s03"],
     [NOT_PENDING, "页面走丢了"]),
    # 伪代码速查（A5）：断言具名算法、辅助过程（MERGE 在 more 里）、以及跳转链接。
    ("#/pseudocode", ["伪代码速查", "全书算法一页查尽", "pcx-name", "INSERTION-SORT",
                      "MERGE-SORT", "MERGE(A, p, q, r)", "#/ch02/s03/s04"],
     [NOT_PENDING, "页面走丢了"]),
    # 章末 Boss 区（A7）：第 3 章在原书里收了 7 道 Problems，逐条断言。
    ("#/ch03/boss", ["章末 Boss", "boss-badge", "boss-level", "本章关卡",
                     "3-1", "3-7", "原书 Problems", "boss-problem__src"],
     [NOT_PENDING, "页面走丢了"]),
    # 无 Problems 的章（第 5 章）：不该出现 Problems 块，也不该提「下面有 Problems」。
    ("#/ch05/boss", ["章末 Boss", "boss-level", "本章关卡"],
     [NOT_PENDING, "页面走丢了", "原书 Problems"]),
    # 复习模式（A2）：无头浏览器是全新 profile，台账为空 —— 断言空状态与说明。
    ("#/review", ["复习", "按遗忘曲线推题", "还没有可复习的题", "遗忘曲线"],
     [NOT_PENDING, "页面走丢了"]),
    # 复杂度对照表（A6）：断言逐条结论、出处页码、以及「本站补充」的显式标注。
    ("#/complexity", ["复杂度对照表", "全书结论横向对照", "cx-table", "cx-link",
                      "MATRIX-MULTIPLY 的运行时间", "本站补充"],
     [NOT_PENDING, "页面走丢了"]),
    # 阶段顺序：s01=map s02=intuition s03=source s04=pseudocode
    #           s05=visualize s06=code s07=analyze s08=prove s09=drill
    # 注意：每个阶段用的是关卡文件里的**自定义标题**，不是类型名。
    # ——— 第 1 章（第 32 轮补建）———
    ("#/ch01/s01/s01", ["这一关不教算法", "数学急救包", "全书第一关"], [NOT_PENDING]),
    ("#/ch01/s01/s02", ["先被「笨办法」逼一次", "六张写着数字的卡片"], [NOT_PENDING]),
    ("#/ch01/s01/s03", ["well-defined computational procedure",
                        'data-kind="source"', "instance of the sorting problem"], [NOT_PENDING]),
    ("#/ch01/s01/s04", ["本节在原书里没有伪代码框", "INSERTION-SORT"], [NOT_PENDING]),
    ("#/ch01/s01/s05", ["viz-array", "原书 1.1 的实例", "输出必须是输入的一个排列"], [NOT_PENDING]),
    ("#/ch01/s01/s06", ["sorting_and_correctness.c", "全部断言通过", "单趟相邻交换"], [NOT_PENDING]),
    ("#/ch01/s01/s07", ["候选解的数量级", "分别落到本书哪一章"], [NOT_PENDING]),
    ("#/ch01/s01/s08", ["for every problem in- stance provided as input",
                        "把「正确」拆成三条"], [NOT_PENDING]),
    ("#/ch01/s01/s09", ["drill-exercise__stmt", "Describe your own real-world example"],
     [NOT_PENDING]),
    ("#/ch01/s02/s01", ["换一台快 1000 倍的机器", "算法是一种技术", "数学急救包"], [NOT_PENDING]),
    ("#/ch01/s02/s02", ["一台好机器救不了一个坏办法", "世上最熟练的程序员"], [NOT_PENDING]),
    ("#/ch01/s02/s03", ["Machine learning is itself a collection of algorithms",
                        'data-kind="source"', "bounded resource"], [NOT_PENDING]),
    ("#/ch01/s02/s04", ["本节在原书里没有伪代码框", "2.3 关才有伪代码"], [NOT_PENDING]),
    ("#/ch01/s02/s05", ["两条曲线什么时候分道扬镳", "把常数差 1000 倍也画进来"], [NOT_PENDING]),
    ("#/ch01/s02/s06", ["technology_crossover.c", "反复平方法", "全部断言通过"], [NOT_PENDING]),
    ("#/ch01/s02/s07", ["Problem 1-1", "交叉点一定存在", "62500"], [NOT_PENDING]),
    ("#/ch01/s02/s08", ["No matter how much smaller c 1 is than c 2", "造出交叉点并收尾"],
     [NOT_PENDING]),
    ("#/ch01/s02/s09", ["drill-exercise__stmt", "insertion sort runs in 8n 2 steps"],
     [NOT_PENDING]),
    ("#/ch02/s01/s01", ["为什么学这一关", "它在整本书里的位置", "数学急救包"], [NOT_PENDING]),
    ("#/ch02/s01/s02", ["整理一手扑克牌", "左手", "桌上"], [NOT_PENDING]),
    ("#/ch02/s01/s03", ["循环不变量", "loop invariant", 'data-kind="source"',
                        # 第 37 轮：原书插图上站后，这一段的段尾要出现 Figure 2.2 的切图
                        'class="book-fig"', "figs/fig-2-2.png", "原书印刷页 22"], [NOT_PENDING]),
    ("#/ch02/s01/s04", ["for i = 2 to n", "pc-line", "变量表"], [NOT_PENDING]),
    ("#/ch02/s01/s05", ["viz-stage", "viz-array", "帧 0", "is-active", "Σtᵢ"], [NOT_PENDING]),
    ("#/ch02/s01/s06", ["insertion_sort.c", "for (int i = 1; i &lt; n; i++)", "伪代码 ↔ C 对应表"], [NOT_PENDING]),
    ("#/ch02/s01/s07", ["polyline", "growth-legend", "代价表"], [NOT_PENDING]),
    ("#/ch02/s01/s08", ["要证的不变量", "第一步", "终止"], [NOT_PENDING]),
    ("#/ch02/s01/s09", ["2.1-1", "2.1-5", "原书习题", "检验一下"], [NOT_PENDING]),
    # ---- 2.2 分析算法（九段式）----
    ("#/ch02/s02/s01", ["为什么学这一关", "做了多少次基本操作", "数学急救包", "附录 A 求和"], [NOT_PENDING]),
    ("#/ch02/s02/s02", ["为什么不能直接掐秒表", "RAM 模型", "先做个预测"], [NOT_PENDING]),
    ("#/ch02/s02/s03", ["random-access machine", 'data-kind="source"',
                        "denote the number of times the while loop test"], [NOT_PENDING]),
    ("#/ch02/s02/s04", ["for i = 2 to n", "pc-line", "变量表", "Σtᵢ", "c₁ … c₈"], [NOT_PENDING]),
    ("#/ch02/s02/s05", ["viz-stage", "viz-array", "帧 0", "逆序 n = 8", "Σtᵢ = 14"], [NOT_PENDING]),
    ("#/ch02/s02/s06", ["count_ops.c", "insertion_sort_counted", "伪代码 ↔ C 对应表", "t5++"], [NOT_PENDING]),
    ("#/ch02/s02/s07", ["polyline", "growth-legend", "代价表", "只看主导项"], [NOT_PENDING]),
    ("#/ch02/s02/s08", ["要证的不变量", "理由一", "理由三", "2.2-3"], [NOT_PENDING]),
    ("#/ch02/s02/s09", ["2.2-1", "2.2-4", "原书习题", "检验一下"], [NOT_PENDING]),
    # ---- 5.3 随机化算法（九段式）----
    ("#/ch05/s03/s01", ["把「假设随机」换成「制造随机」", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s03/s04", ["RANDOMIZED-HIRE-ASSISTANT", "RANDOMLY-PERMUTE", "pc-line", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s03/s05", ["viz-stage", "viz-array", "帧 0", "交换"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s03/s06", ["randomly_permute.c", "rand_range", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s03/s08", ["要证的不变量", "第一步", "终止"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s03/s09", ["检验一下", "5.3-3", "5.3-4", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 5.4 的四个例子（原书 5.4 一节拆成 s04–s07 四关）----
    ("#/ch05/s04/s01", ["用概率反驳直觉", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s04/s05", ["viz-stage", "viz-array", "帧 0", "撞生日"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s04/s06", ["birthday_paradox.c", "伪代码"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s05/s01", ["把「随机分配」变成可算的期望值", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s05/s05", ["viz-stage", "viz-array", "帧 0", "已投掷"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s05/s06", ["balls_and_bins.c"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s06/s01", ["把「最长连续正面」的期望钉在", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s06/s05", ["viz-stage", "viz-array", "帧 0", "已抛掷"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s06/s06", ["streaks.c"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s07/s01", ["把「面试完再决定」的奢望换成", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s07/s04", ["ONLINE-MAXIMUM", "best-score", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s07/s05", ["viz-stage", "viz-array", "帧 0", "已面试"], [NOT_PENDING, "【TODO"]),
    ("#/ch05/s07/s06", ["online_hiring.c"], [NOT_PENDING, "【TODO"]),

    # ---- 6.1 堆（九段式）----
    ("#/ch06/s01/s01", ["先把「堆」这个词从内存管理里抢回来", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s03", ['data-kind="source"', "nearly complete binary tree", "max-heap property"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s04", ["PARENT", "LEFT", "RIGHT", "pc-line", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s05", ["viz-stage", "viz-heap", "帧 0", "当前结点"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s06", ["heap_index.c", "is_max_heap", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s07", ["polyline", "growth-legend", "三条下标算式"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s08", ["要证的不变量", "第一步", "两个推论"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s01/s09", ["检验一下", "6.1-7", "6.1-8", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 6.2 维持堆性质（九段式）----
    ("#/ch06/s02/s01", ["整个第 6 章都在调用这个十行过程", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s03", ['data-kind="source"', "MAX-HEAPIFY assumes", "just had its value decreased"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s04", ["MAX-HEAPIFY(A, i)", "largest", "pc-line", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s05", ["viz-stage", "viz-heap", "帧 0", "交换"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s06", ["max_heapify.c", "max_heapify_iter", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s07", ["递归几项", "主方法", "2047"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s08", ["要证的不变量", "第一步", "只递归一边"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s02/s09", ["检验一下", "6.2-2", "6.2-7", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 6.3 建堆（九段式）----
    ("#/ch06/s03/s01", ["这句话看紧一点", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s03", ['data-kind="source"', "bottom-up manner", "loop invariant"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s04", ["BUILD-MAX-HEAP(A, n)", "downto", "pc-line", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s05", ["viz-stage", "viz-heap", "帧 0", "MAX-HEAPIFY 调用"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s06", ["build_max_heap.c", "max_heapify", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s07", ["polyline", "growth-legend", "按高度分层"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s08", ["要证的不变量", "第一步", "Termination"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s03/s09", ["检验一下", "6.3-3", "6.3-4", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 6.4 堆排序算法（九段式）----
    ("#/ch06/s04/s01", ["把三个部件接成一台机器", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s03", ['data-kind="source"', "discards node", "asymptotically optimal"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s04", ["HEAPSORT(A, n)", "downto 2", "pc-line", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s05", ["viz-stage", "viz-heap", "帧 0", "已摘出元素"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s06", ["heapsort.c", "heapsort_stepwise", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s07", ["polyline", "growth-legend", "决策树"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s08", ["要证的不变量", "第一步", "已排序区"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s04/s09", ["检验一下", "6.4-2", "6.4-4", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 6.5 优先队列（九段式）----
    ("#/ch06/s05/s01", ["堆的第二次生命", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s03", ['data-kind="source"', "max-priority queue", "handles"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s04", ["MAX-HEAP-EXTRACT-MAX", "MAX-HEAP-INSERT", "MAX-HEAP-INCREASE-KEY", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s05", ["viz-stage", "viz-heap", "帧 0", "已摘出"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s06", ["heap_priority_queue.c", "max_heap_insert", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s07", ["polyline", "growth-legend", "两个"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s08", ["要证的不变量", "第一步", "上浮"], [NOT_PENDING, "【TODO"]),
    ("#/ch06/s05/s09", ["检验一下", "6.5-5", "6.5-7", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 7.1 快速排序的描述（九段式）----
    ("#/ch07/s01/s01", ["与归并排序同门", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s03", ['data-kind="source"', "low side", "cannot help but be sorted"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s04", ["QUICKSORT(A, p, r)", "PARTITION(A, p, r)", "pc-line", "变量表"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s05", ["viz-stage", "viz-array", "帧 0", "轴", "PARTITION"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s06", ["quicksort.c", "partition", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s07", ["分治三步", "PARTITION 的四个区", "Θ(n)"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s08", ["要证的不变量", "第一步", "Termination"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s01/s09", ["检验一下", "7.1-2", "7.1-4", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 7.2 快速排序的性能（九段式）----
    ("#/ch07/s02/s01", ["同一个算法，最好最差差一个 n 倍", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s02/s03", ['data-kind="source"', "balanced", "already completely sorted"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s02/s05", ["viz-stage", "viz-tree", "递归树", "已排序"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s02/s07", ["polyline", "growth-legend", "三种分区形态"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s02/s08", ["第一步", "arithmetic series"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s02/s09", ["检验一下", "7.2-2", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 7.3 随机化版本（九段式）----
('#/ch07/s03/s01', ['不太可能', '确定的', '数学急救包'], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s03", ['data-kind="source"', "randomly chooses the pivot", "Many software libraries"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s04", ["RANDOMIZED-PARTITION", "RANDOMIZED-QUICKSORT", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s05", ["viz-stage", "viz-array", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s06", ["randomized_quicksort.c", "randomized_partition", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s07", ["polyline", "growth-legend"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s08", ["第一步", "继承", "PARTITION"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s03/s09", ["检验一下", "7.3-1", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 7.4 快速排序的分析（九段式）----
    ("#/ch07/s04/s01", ["用指示器随机变量算出期望 O(n lg n)", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s03", ['data-kind="source"', "compared is 2", "no two elements"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s04", ["PARTITION(A, p, r)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s05", ["viz-stage", "polyline", "growth-legend"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s06", ["quicksort.c", "伪代码 ↔ C 对应表"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s07", ["推导链", "调和数"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s08", ["Lemma 7.2", "第一步", "概率计算"], [NOT_PENDING, "【TODO"]),
    ("#/ch07/s04/s09", ["检验一下", "7.4-1", "原书习题"], [NOT_PENDING, "【TODO"]),

    # ---- 8.1 排序的下界（九段式）----
    ("#/ch08/s01/s01", ["排序的下界", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s03", ['data-kind="source"', "comparison sorts", "decision tree"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s04", ["INSERTION-SORT(A, n)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s05", ["viz-stage", "polyline", "growth-legend"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s06", ["lower_bounds.c", "lg_factorial"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s07", ["推导链", "Stirling"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s08", ["Theorem 8.1", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s01/s09", ["检验一下", "8.1-1"], [NOT_PENDING, "【TODO"]),

    # ---- 8.2 计数排序（九段式）----
    ("#/ch08/s02/s01", ["数个数，而不是比大小", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s03", ['data-kind="source"', "stable"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s04", ["COUNTING-SORT(A, n, k)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s06", ["counting_sort.c", "is_stable"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s07", ["代价表", "前缀和"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s08", ["稳定", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s02/s09", ["检验一下", "8.2-1"], [NOT_PENDING, "【TODO"]),

    # ---- 8.3 基数排序（九段式）----
    ("#/ch08/s03/s01", ["从最低位开始", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s03", ['data-kind="source"', "least significant digit"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s04", ["RADIX-SORT(A, d)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s06", ["radix_sort.c", "counting_sort_by_digit"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s07", ["位宽"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s08", ["归纳", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s03/s09", ["检验一下", "8.3-1"], [NOT_PENDING, "【TODO"]),

    # ---- 8.4 桶排序（九段式）----
    ("#/ch08/s04/s01", ["均匀分布换线性时间", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s03", ['data-kind="source"', "uniform distribution"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s04", ["BUCKET-SORT(A)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s06", ["bucket_sort.c", "insertion_sort"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s07", ["期望分析"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s08", ["二项", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch08/s04/s09", ["检验一下", "8.4-1"], [NOT_PENDING, "【TODO"]),

    # ---- 9.1 最小值与最大值（九段式）----
    ("#/ch09/s01/s01", ["最小与最大", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s03", ['data-kind="source"', "tournament"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s04", ["MINIMUM(A, n)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s06", ["min_max.c", "find_min"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s07", ["三本账", "3n/2"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s08", ["锦标赛", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s01/s09", ["检验一下", "9.1-1"], [NOT_PENDING, "【TODO"]),

    # ---- 9.2 期望线性时间的选择（九段式）----
    ("#/ch09/s02/s01", ["只递归一边的快排", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s03", ['data-kind="source"', "one side of the partition"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s04", ["RANDOMIZED-SELECT(A, p, r, i)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s06", ["randomized_select.c", "partition"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s07", ["Theorem 9.2", "几何分布"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s08", ["世代", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s02/s09", ["检验一下", "9.2-1"], [NOT_PENDING, "【TODO"]),

    # ---- 9.3 最坏线性时间的选择（九段式）----
    ("#/ch09/s03/s01", ["中位数的中位数", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s03", ['data-kind="source"', "5-element medians"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s04", ["SELECT(A, p, r, i)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s06", ["select.c", "partition_around"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s07", ["淘汰账", "7n/10"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s08", ["Theorem", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch09/s03/s09", ["检验一下", "9.3-1"], [NOT_PENDING, "【TODO"]),

    # ---- 10.1 数组、栈与队列（九段式）----
    ("#/ch10/s01/s01", ["栈与队列", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s03", ['data-kind="source"', "LIFO"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s04", ["PUSH(S, x)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s05", ["viz-stage", "帧 0"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s06", ["stack_queue.c", "push"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s07", ["栈 vs 队列"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s08", ["栈内元素", "第二步"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s01/s09", ["检验一下", "10.1-1"], [NOT_PENDING, "【TODO"]),

    # ---- 10.2 链表（九段式）----
    ("#/ch10/s02/s01", ["链表", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s03", ['data-kind="source"', "sentinel"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s04", ["LIST-SEARCH(L, k)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s05", ["viz-stage", "viz-linked"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s06", ["linked_list.c", "list_search"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s07", ["哨兵"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s08", ["边界", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s02/s09", ["检验一下", "10.2-1"], [NOT_PENDING, "【TODO"]),

    # ---- 10.3 有根树的表示（九段式）----
    ("#/ch10/s03/s01", ["有根树", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s03", ['data-kind="source"', "right-sibling"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s04", ["COMPACT-LIST-SEARCH", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s05", ["viz-stage", "viz-tree"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s06", ["tree_rep.c", "left_child"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s07", ["三种表示法"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s08", ["双射", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch10/s03/s09", ["检验一下", "10.3-1"], [NOT_PENDING, "【TODO"]),

    # ---- 11.1 直接寻址表（九段式）----
    ("#/ch11/s01/s01", ["直接寻址表", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s03", ['data-kind="source"', "direct-address table"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s04", ["DIRECT-ADDRESS-SEARCH(T, k)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s05", ["viz-stage", "viz-hash"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s06", ["direct_address.c", "da_search"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s07", ["三种"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s08", ["下标", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s01/s09", ["检验一下", "11.1-1"], [NOT_PENDING, "【TODO"]),

    # ---- 11.2 散列表 · 链接法（九段式）----
    ("#/ch11/s02/s01", ["链接法", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s03", ['data-kind="source"', "collision"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s04", ["CHAINED-HASH-SEARCH(T, k)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s05", ["viz-stage", "viz-hash"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s06", ["chained_hash.c", "ht_search"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s07", ["负载因子"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s08", ["独立均匀散列", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s02/s09", ["检验一下", "11.2-1"], [NOT_PENDING, "【TODO"]),

    # ---- 11.5 散列表的工程实践（九段式）----
    ("#/ch11/s05/s01", ["工程实践"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s03", ['data-kind="source"', "linear probing excels"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s04", ["pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s05", ["viz-stage", "viz-hash"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s06", ["hash_practical.c"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s07", ["Theorem 11.9", "初级聚集"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s08", ["第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s05/s09", ["检验一下"], [NOT_PENDING, "【TODO"]),

    # ---- 11.4 开放寻址（九段式）----
    ("#/ch11/s04/s01", ["开放寻址"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s03", ['data-kind="source"'], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s04", ["pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s05", ["viz-stage", "viz-hash"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s06", ["open_addressing.c"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s07", ["探测"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s08", ["第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch11/s04/s09", ["检验一下"], [NOT_PENDING, "【TODO"]),

    # ---- 12.1 什么是 BST（九段式）----
    ("#/ch12/s01/s01", ["二叉搜索树", "数学急救包"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s03", ['data-kind="source"', "binary-search-tree property"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s04", ["INORDER-TREE-WALK(x)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s05", ["viz-stage", "viz-tree"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s06", ["bst_basics.c", "inorder"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s07", ["Theorem 12.1"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s08", ["替换法", "第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s01/s09", ["检验一下", "12.1-1"], [NOT_PENDING, "【TODO"]),

    # ---- 12.2 查询 BST（九段式）----
    ("#/ch12/s02/s01", ["查询"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s03", ['data-kind="source"', "SUCCESSOR",
                        'class="book-fig"', "figs/fig-12-2.png"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s04", ["TREE-SEARCH(x, k)", "pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s05", ["viz-stage", "viz-tree"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s06", ["bst_query.c", "tree_search"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s07", ["O(h)"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s08", ["第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s02/s09", ["检验一下", "12.2-1"], [NOT_PENDING, "【TODO"]),
    # 第 37 轮新增：红黑树插入的三种情形只有原书 Figure 13.4 / 13.5 / 13.6 说得清，
    # 这一路由专门盯住「段尾把引用的原书切图挂出来了」（插图上站前的 coverage 空白点）。
    ("#/ch13/s03/s09", ["13.3-1", 'class="book-fig"', "figs/fig-13-4.png",
                        "figs/fig-13-5.png", "figs/fig-13-6.png"], [NOT_PENDING]),

    # ---- 12.3 插入与删除（九段式）----
    ("#/ch12/s03/s01", ["插入与删除"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s03", ['data-kind="source"', "TRANSPLANT"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s04", ["pc-line"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s05", ["viz-stage", "viz-tree"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s06", ["bst_delete.c", "transplant"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s07", ["Theorem 12.3"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s08", ["第一步"], [NOT_PENDING, "【TODO"]),
    ("#/ch12/s03/s09", ["检验一下", "12.3-1"], [NOT_PENDING, "【TODO"]),

    # ---- 2.3 归并排序（九段式）----
    ("#/ch02/s03/s01", ["为什么学这一关", "递归式", "lg n"], [NOT_PENDING]),
    ("#/ch02/s03/s02", ["两叠牌", "正面朝上"], [NOT_PENDING]),
    ("#/ch02/s03/s03", ["divide-and-conquer", 'data-kind="source"', "Figure 2.4"], [NOT_PENDING]),
    ("#/ch02/s03/s04", ["MERGE(A, p, q, r)", "MERGE-SORT(A, p, r)", "n_L = q − p + 1", "变量表"], [NOT_PENDING]),
    ("#/ch02/s03/s05", ["viz-stage", "viz-array", "viz-tree", "帧 0"], [NOT_PENDING]),
    ("#/ch02/s03/s06", ["merge_sort.c", "int q = (p + r) / 2", "伪代码 ↔ C 对应表"], [NOT_PENDING]),
    ("#/ch02/s03/s07", ["2T(n/2)", "growth-legend", "递归树", "lg n + 1"], [NOT_PENDING]),
    ("#/ch02/s03/s08", ["要证的不变量", "第一步", "终止", "习题 2.3-3"], [NOT_PENDING]),
    ("#/ch02/s03/s09", ["2.3-1", "2.3-3", "2-1", "原书习题"], [NOT_PENDING]),
    # ---- 3.1 三种渐进记号（九段式，已建成）----
    ("#/ch03/s01/s01", ["先看清这一关的位置", "最高阶项", "3.2 渐进记号"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s02", ["三种说法，三种承诺", "不超过 2 米"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s03", ["O-notation", 'data-kind="source"', "rate of growth"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s04", ["for i = 2 to n", "pc-line", "重读这 8 行"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s05", ["viz-stage", "growth", "c·n³"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s06", ["asymptotic_check.c", "part 1", "all checks passed"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s07", ["三种记号的分工", "polyline", "n²/9"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s08", ["凭什么说最坏情况是 Ω(n²)", "第一步", "n/3"], [NOT_PENDING, "【TODO"]),
    ("#/ch03/s01/s09", ["检验一下", "3.1-1", "原书习题"], [NOT_PENDING, "【TODO"]),
    # ---- 3.2 渐进记号的形式定义（九段式，已建成）----
    ("#/ch03/s02/s01", ["这一关要把「差不多」说精确", "第 3 章第 2 节", "集合记号"], [NOT_PENDING]),
    ("#/ch03/s02/s03", ['data-kind="source"', "n/3 positions", "at and to the right of n 0"], [NOT_PENDING]),
    ("#/ch03/s02/s05", ["viz-stage", "growth", "n²+10n"], [NOT_PENDING]),
    ("#/ch03/s02/s09", ["检验一下", "3.2-1", "原书习题", "Theorem 3.1"], [NOT_PENDING]),
    # ---- 3.3 标准记号与常用函数（九段式，已建成）----
    ("#/ch03/s03/s01", ["函数速查表", "第 3 章第 3 节", "取整与取模"], [NOT_PENDING]),
    ("#/ch03/s03/s03", ['data-kind="source"', "monotonically increasing", "floor function"], [NOT_PENDING]),
    ("#/ch03/s03/s05", ["viz-stage", "growth", "lg n &lt; √n"], [NOT_PENDING]),
    ("#/ch03/s03/s09", ["检验一下", "3.3-1", "原书习题", "Stirling"], [NOT_PENDING]),

    # ---- 4.4 递归树法（九段式，已建成）----
    ("#/ch04/s04/s01", ["递归树：从「猜」到「证」的桥", "几何级数"], [NOT_PENDING]),
    ("#/ch04/s04/s02", ["一棵树就是一本成本账", "部门"], [NOT_PENDING]),
    ("#/ch04/s04/s03", ['data-kind="source"', "recursion tree", "per-level costs"], [NOT_PENDING]),
    ("#/ch04/s04/s04", ["T(n) = 3·T(n/4) + c·n²", "不规则例"], [NOT_PENDING]),
    ("#/ch04/s04/s05", ["viz-tree", "两本成本账", "3/16"], [NOT_PENDING]),
    ("#/ch04/s04/s06", ["recursion_tree_sum.c", "part 1", "all checks passed"], [NOT_PENDING]),
    ("#/ch04/s04/s07", ["两本账的结局", "16/13", "polyline"], [NOT_PENDING]),
    ("#/ch04/s04/s08", ["猜测要盖章", "归纳假设", "d"], [NOT_PENDING]),
    ("#/ch04/s04/s09", ["检验一下", "4.4-1", "原书习题"], [NOT_PENDING]),

    # ---- 第 14 章 动态规划（5 关）----
    ("#/ch14/s01/s01", ["第 14 章：动态规划", "钢条切割"], [NOT_PENDING]),
    ("#/ch14/s01/s04", ["CUT-ROD", "pc-line"], [NOT_PENDING]),
    ("#/ch14/s01/s06", ["rod_cutting.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch14/s01/s09", ["检验一下", "14.1-1", "原书习题"], [NOT_PENDING]),
    ("#/ch14/s02/s01", ["第二个 DP 例", "括号化方案"], [NOT_PENDING]),
    ("#/ch14/s02/s04", ["MATRIX-CHAIN-ORDER", "pc-line"], [NOT_PENDING]),
    ("#/ch14/s02/s06", ["matrix_chain.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch14/s02/s09", ["检验一下", "14.2-1", "原书习题"], [NOT_PENDING]),
    ("#/ch14/s03/s01", ["什么时候才该用动态规划", "最优子结构"], [NOT_PENDING]),
    ("#/ch14/s03/s04", ["RECURSIVE-MATRIX-CHAIN", "pc-line"], [NOT_PENDING]),
    ("#/ch14/s03/s06", ["dp_elements.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch14/s03/s09", ["检验一下", "14.3-1", "原书习题"], [NOT_PENDING]),
    ("#/ch14/s04/s01", ["两个序列的相似度怎么量"], [NOT_PENDING]),
    ("#/ch14/s04/s04", ["LCS-LENGTH", "pc-line"], [NOT_PENDING]),
    ("#/ch14/s04/s06", ["lcs.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch14/s04/s09", ["检验一下", "14.4-1", "原书习题"], [NOT_PENDING]),
    ("#/ch14/s05/s01", ["键的概率决定了树该长什么样", "哑键"], [NOT_PENDING]),
    ("#/ch14/s05/s04", ["OPTIMAL-BST", "pc-line"], [NOT_PENDING]),
    ("#/ch14/s05/s05", ["viz-tree", "k2"], [NOT_PENDING]),
    ("#/ch14/s05/s06", ["optimal_bst.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch14/s05/s09", ["检验一下", "14.5-1", "原书习题"], [NOT_PENDING]),

    # ---- 第 15 章 贪心算法（4 关）----
    ("#/ch15/s01/s01", ["从 DP 到贪心的分水岭", "活动选择"], [NOT_PENDING]),
    ("#/ch15/s01/s04", ["GREEDY-ACTIVITY-SELECTOR", "pc-line"], [NOT_PENDING]),
    ("#/ch15/s01/s06", ["activity_selection.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch15/s01/s09", ["检验一下", "15.1-1", "原书习题"], [NOT_PENDING]),
    ("#/ch15/s02/s01", ["怎么判断一个贪心能不能用", "贪心选择性质"], [NOT_PENDING]),
    ("#/ch15/s02/s04", ["贪心算法的五步设计法", "pc-line"], [NOT_PENDING]),
    ("#/ch15/s02/s06", ["greedy_knapsack.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch15/s02/s09", ["检验一下", "15.2-1", "原书习题"], [NOT_PENDING]),
    ("#/ch15/s03/s01", ["用变长码把高频字符压短", "哈夫曼"], [NOT_PENDING]),
    ("#/ch15/s03/s04", ["HUFFMAN", "pc-line"], [NOT_PENDING]),
    ("#/ch15/s03/s05", ["viz-tree", "224"], [NOT_PENDING]),
    ("#/ch15/s03/s06", ["huffman.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch15/s03/s09", ["检验一下", "15.3-1", "原书习题"], [NOT_PENDING]),
    ("#/ch15/s04/s01", ["缓存换页", "离线"], [NOT_PENDING]),
    ("#/ch15/s04/s04", ["FURTHEST-IN-FUTURE", "pc-line"], [NOT_PENDING]),
    ("#/ch15/s04/s06", ["offline_caching.c", "all checks passed"], [NOT_PENDING]),
    ("#/ch15/s04/s09", ["检验一下", "15.4-1", "原书习题"], [NOT_PENDING]),

    # 不带阶段号：应落到第一个阶段
    ("#/ch02/s01", ["为什么学这一关"], [NOT_PENDING]),
    ("#/ch02/s02", ["为什么学这一关"], [NOT_PENDING]),
    ("#/ch02/s03", ["为什么学这一关"], [NOT_PENDING]),
    ("#/ch99/s01/s01", [NOT_PENDING], []),
    ("#/nonsense", ["404"], []),
    # 功能验证页：动画管线 + 测验交互 + 进度持久化（不只是「能渲染」，而是「真能跑」）
    ("_dev/dbg-func.html", ["FUNC_ALL_OK"], []),
    # 逐阶段渲染自检页
    ("_dev/dbg-stages.html", ["ALL_STAGES_OK"], []),
    # 树引擎逐帧自检页（2.3 的 Figure 2.4 / 2.5 两组序列）
    ("_dev/dbg-tree.html", ["TREE_ALL_OK"], []),
]


def dump(url):
    with tempfile.TemporaryDirectory() as td:
        cmd = [
            CHROME,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--no-first-run",
            "--disable-extensions",
            f"--user-data-dir={td}",
            "--virtual-time-budget=6000",
            "--dump-dom",
            url,
        ]
        p = subprocess.run(cmd, capture_output=True, timeout=120)
        return p.stdout.decode("utf-8", "replace"), p.stderr.decode("utf-8", "replace")


def visible_text(html):
    """剥掉标签，只留浏览器里真正能看到的文字。

    代码块（<pre>/<code>）要整体丢掉：那是逐字呈现的实现，JS 的 `**` 幂运算符
    出现在里面是正常的，不能当渲染事故。
    """
    txt = re.sub(r"<pre[\s\S]*?</pre>", " ", html)
    txt = re.sub(r"<code[\s\S]*?</code>", " ", txt)
    return re.sub(r"<[^>]+>", " ", txt)


def plain_text(html):
    """去掉标签并解开实体，得到「读者在页面上读到的那一行字」。

    visible_text() 不行：它为了查渲染印记会整块丢掉 <pre>/<code>。
    代码块自从上了语法高亮，一行 C 代码被切成许多 <span>，
    按原始 HTML 做子串匹配的行内代码断言就会失效（#/ch02/s01/s06 栽过一次），
    所以匹配要看这份文本。
    """
    return html_mod.unescape(re.sub(r"<[^>]+>", "", html))


def hygiene(html):
    """渲染印记检查：返回问题清单。

    这三条都是真实踩过的坑，不是洁癖：
      - 关卡文案大量使用 `**粗体**`，一旦某个渲染器忘了走 renderMixed，
        用户就会在页面上直接看到星号；
      - 曾把数组当属性对象传给 h()，于是所有表格行消失、元素上出现
        `0="[object HTMLTableRowElement]"` 这种字样；
      - 数学渲染器遇到不认识的命令是「原样吐出来」，页面上就会出现
        `\\textfor`、`\\begincases`、`\\xrightarrow` 这类碎片。它不报错、
        不白屏，最容易漏过 —— 所以在这里按可见文本兜一次。
    """
    problems = []
    txt = visible_text(html)
    if "**" in txt:
        problems.append("可见文本里有未渲染的 ** 粗体标记")
    if "[object " in html:
        problems.append("有对象被当成字符串写进 DOM（[object …]）")
    leftover = re.findall(r"\\+[a-zA-Z]{2,}", txt)
    if leftover:
        uniq = sorted(set(leftover))[:6]
        problems.append("公式里有未渲染的 LaTeX 命令：" + ", ".join(uniq))
    return problems


def main():
    bad = 0
    for route, must, mustnot in CASES:
        url = BASE + route
        if ".html" in route:  # _dev 下的独立自检页
            url = f"http://127.0.0.1:{PORT}/" + route
        raw, err = dump(url)
        # ★ --dump-dom 会把 <script> 的源码一起导出，导致「不该出现」的字符串
        #   在源码里被误命中。这里先把脚本与样式内容剥掉，只看真正渲染出来的 DOM。
        html = re.sub(r"<script[\s\S]*?</script>", "", raw)
        html = re.sub(r"<style[\s\S]*?</style>", "", html)
        # 断言既允许命中原始 HTML，也允许命中「去掉标签并解开实体」后的可读文本：
        # 代码块上语法高亮后一行被切成许多 <span>，只看原始 HTML 会误报「缺少」。
        flat = plain_text(html)
        missing = [m for m in must
                   if m not in html and html_mod.unescape(m) not in flat]
        present = [m for m in mustnot if m in html]
        uncaught = re.findall(r"Uncaught[^\n]*", err)
        dirty = hygiene(html)
        ok = not missing and not present and not uncaught and not dirty
        if not ok:
            bad += 1
        print(("  OK   " if ok else "  FAIL ") + route + f"  ({len(html)} bytes)")
        if missing:
            print("       缺少：" + " | ".join(missing))
        if present:
            print("       不该出现：" + " | ".join(present))
        if uncaught:
            print("       JS 异常：" + " | ".join(uncaught[:3]))
        if dirty:
            print("       渲染印记：" + " | ".join(dirty))
    print(f"\n{len(CASES) - bad} / {len(CASES)} 个路由渲染通过")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
