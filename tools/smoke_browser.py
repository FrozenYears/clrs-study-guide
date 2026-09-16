#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
真机验证：用无头 Chrome 打开站点每个阶段，检查渲染结果。
不是语法检查，是真的让浏览器跑一遍 JS 再读回 DOM。

用法：python tools/smoke_browser.py [port]
"""
import os
import re
import subprocess
import sys
import tempfile

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = sys.argv[1] if len(sys.argv) > 1 else "8317"
BASE = f"http://127.0.0.1:{PORT}/index.html"

# (路由, 必须出现的关键片段, 不允许出现的片段)
NOT_PENDING = "该章的关卡文件还没写"
CASES = [
    # 首页 = 书的目录 + 进度层（2026-09 编辑部风改版：卡片宫格 -> 目录条目）
    ("#/", ["闯关式学习站", "toc__row", "Part I Foundations", "待建", "从这里开始"],
     ["页面走丢了", "card--link"]),
    # 阶段顺序：s01=map s02=intuition s03=source s04=pseudocode
    #           s05=visualize s06=code s07=analyze s08=prove s09=drill
    # 注意：每个阶段用的是关卡文件里的**自定义标题**，不是类型名。
    ("#/ch02/s01/s01", ["为什么学这一关", "它在整本书里的位置", "数学急救包"], [NOT_PENDING]),
    ("#/ch02/s01/s02", ["整理一手扑克牌", "左手", "桌上"], [NOT_PENDING]),
    ("#/ch02/s01/s03", ["循环不变量", "loop invariant", 'data-kind="source"'], [NOT_PENDING]),
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
        missing = [m for m in must if m not in html]
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
