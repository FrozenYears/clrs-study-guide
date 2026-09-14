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
    ("#/", ["闯关式学习站", "card--link", "Part I Foundations"], ["页面走丢了"]),
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
    # 不带阶段号：应落到第一个阶段
    ("#/ch02/s01", ["为什么学这一关"], [NOT_PENDING]),
    ("#/ch99/s01/s01", [NOT_PENDING], []),
    ("#/nonsense", ["404"], []),
    # 功能验证页：动画管线 + 测验交互 + 进度持久化（不只是「能渲染」，而是「真能跑」）
    ("_dev/dbg-func.html", ["FUNC_ALL_OK"], []),
    # 逐阶段渲染自检页
    ("_dev/dbg-stages.html", ["ALL_STAGES_OK"], []),
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
        ok = not missing and not present and not uncaught
        if not ok:
            bad += 1
        print(("  OK   " if ok else "  FAIL ") + route + f"  ({len(html)} bytes)")
        if missing:
            print("       缺少：" + " | ".join(missing))
        if present:
            print("       不该出现：" + " | ".join(present))
        if uncaught:
            print("       JS 异常：" + " | ".join(uncaught[:3]))
    print(f"\n{len(CASES) - bad} / {len(CASES)} 个路由渲染通过")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
