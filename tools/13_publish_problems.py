#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""13_publish_problems.py —— 把原书章末 Problems 接入站点（A7 章末挑战区）。

**为什么不做「精选难题」**
建设计划里写的是「精选原书章末 Problems（如 2-1、4-6、15-3 这类带 ★ 的难题）」。
第 4 版**不印难度星号** —— 对全站语料逐页扫描，带 `*` / `?` 前缀的章末题号
实测 0 条（脚本见 tools/_probe/r40_problems.py）。没有依据的「精选」就是编造，
所以这里改成**全量上站**：157 道题一道不少，读者自己按兴趣挑，站点只负责
把题干逐字摆出来、把页码标清楚。

产出（提交进版本库，理由同 12_publish_figs.py：本站零构建、可能以 file:// 打开，
运行时不能 fetch JSON）：

    site/assets/data/problems.js    章标识 -> [{id, statement, page}] 的清单模块

做题干文本的唯一来源是 tools/ex_corpus.py 的逐页版面状态机（与闸门、09 审计、
10 回填同一份判据）。本脚本**生成前逐条过 verify_quote**，过不了的直接报错退出 ——
「生成即合规」，不让一条没溯源的文本落地。

用法：
    node tools/dump_levels.mjs          # 不需要，但保持与其他工具一致
    python tools/13_publish_problems.py            # 生成
    python tools/13_publish_problems.py --check    # 只校验，不写文件
"""
import argparse
import importlib.util
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))

_spec = importlib.util.spec_from_file_location(
    "ver04", os.path.join(ROOT, "tools", "04_verify_level.py"))
ver = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ver)
qnorm, verify_quote = ver.qnorm, ver.verify_quote

import ex_corpus as EC                                                  # noqa: E402

OUT_JS = os.path.join(ROOT, "site", "assets", "data", "problems.js")

# 章末题要的是**整题原文**（含 a. b. c. 小问），不截断。
# 关卡内列出的习题另有 1200 字上限（见 ex_corpus.CAP），那是排版决定，不适用于这里。
FULL_CAPS = {"exercise": 10 ** 9, "problem": 10 ** 9}


def js_str(s):
    """把文本放进 JS 字符串字面量（反斜杠与引号转义，换行已在抽取阶段折平）。"""
    return ('"' + (s or "").replace("\\", "\\\\").replace('"', '\\"')
            .replace("\n", " ").replace("\r", " ") + '"')


def collect(pages, qn):
    """章标识 -> 该章全部章末 Problems（按题号排序）。

    两道过滤，都是必需的：
      ① **只收正文章**。附录 A–D 没有章末 Problems，而附录的页范围在语料里会
         与正文重叠 —— 不挡的话附录 D 会抽到正文第 2 章的「2-3」（实测踩到）。
      ② **题号前缀必须等于章号**。章末题编号形如「14-5」，前缀就是它所属章。
         这一条是①的通用形式，能挡住任何页范围越界造成的串章。
    """
    out = {}
    for key, (lo, hi) in sorted(EC.chapter_ranges().items()):
        if not key.isdigit():
            continue                      # 附录：没有章末 Problems
        prefix = str(int(key))            # '02' -> '2'
        found = EC.extract_chapter(pages, lo, hi, qn, caps=FULL_CAPS)
        probs = {}
        for k, v in found.items():
            if "." in k:
                continue                  # 带点的是节末习题，章末区不要
            if k.split("-")[0] != prefix:
                continue                  # 串到别的章了
            # 跨页长题声明成页码区间，闸门的 ±1 页窗才覆盖得到整题
            # （只写起始页时，长题会被判「逐字失败」—— 实测 6 条）。
            end = v.get("end_page")
            page = v["page"] if end in (None, v["page"]) else [v["page"], end]
            probs[k] = {"id": k, "page": page, "statement": v["statement"]}
        if probs:
            out[key] = [probs[k] for k in sorted(probs)]
    return out


def build_text(data):
    lines = []
    for key in sorted(data):
        rows = data[key]
        body = ",\n".join(
            '    { id: %s, page: %s, statement: %s }'
            % (js_str(r["id"]), json.dumps(r["page"]), js_str(r["statement"]))
            for r in rows)
        # 键一律两位补零（'01'…'35'），与 chapters.js 的注册表键（'2'）不同 ——
        # 所以 problemsOf() 里必须做同样的归一化，否则『按 2 查』会查不到。
        lines.append('  %s: [\n%s,\n  ]' % (json.dumps("%02d" % int(key)), body))
    total = sum(len(v) for v in data.values())
    head = (
        "/* =============================================================================\n"
        " * problems.js —— 原书章末 Problems（由 tools/13_publish_problems.py 生成，不要手改）\n"
        " *\n"
        " * 为什么是 JS 模块而不是 fetch JSON：本站零构建、可能以 file:// 打开，\n"
        " *   而 file:// 下 fetch 会被 CORS 拦掉（与 assets/chapters.js、data/figures.js 同一套理由）。\n"
        " * 题干逐字来自 data/pages_fixed.jsonl（tools/ex_corpus.py 的逐页版面状态机），\n"
        " *   生成前逐条过了闸门的 verify_quote —— 没有一条是凭印象写的。\n"
        " *\n"
        " * ★ 这里**没有**难度标记：第 4 版不印难度星号，全量语料里带星/带问号的章末题号\n"
        " *   实测 0 条。所以站点不做「精选」，只把题原样摆出来。\n"
        " *\n"
        " * 章标识与 site/assets/chapters.js 的注册表键一致（'1'…'35'、'A'…'D'）。\n"
        " * 共 %d 章 %d 道题。\n"
        " * ========================================================================== */\n\n"
        "export const PROBLEMS = {\n%s\n};\n\n"
        "export function problemsOf(ch) {\n"
        "  const k = String(ch).replace(/^ch/i, '');\n"
        "  // 正文章键统一两位补零（'2'/'02' 都指向 '02'）；附录用大写字母。\n"
        "  const key = /^[0-9]+$/.test(k) ? ('0' + k).slice(-2) : k.toUpperCase();\n"
        "  return PROBLEMS[key] || [];\n"
        "}\n\n"
        "export default { PROBLEMS, problemsOf };\n"
        % (len(data), total, ",\n".join(lines)))
    return head, total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="只校验，不写文件")
    args = ap.parse_args()

    pages = ver.load_pages()
    if not pages:
        sys.exit("取不到语料 —— 先跑 tools/02_repair.py")

    data = collect(pages, qnorm)
    total = sum(len(v) for v in data.values())

    # 生成即合规：每条都过闸门判据，过不了就停在这里。
    problems = []
    for key, rows in data.items():
        for r in rows:
            ok, diag = verify_quote(r["statement"], r["page"])
            if not ok:
                problems.append("%s %s：%s" % (key, r["id"], diag))
            if len(qnorm(r["statement"])) < 6:
                problems.append("%s %s：题干过短" % (key, r["id"]))
            pg = r["page"]
            if not isinstance(pg, int) and not (
                    isinstance(pg, list) and pg and all(isinstance(x, int) for x in pg)):
                problems.append("%s %s：页码形态不对（%r）" % (key, r["id"], pg))

    text, total2 = build_text(data)
    print("章末 Problems：%d 章 / %d 道题" % (len(data), total))
    print("最长题干 %d 字符；平均 %.0f 字符"
          % (max((len(r["statement"]) for rows in data.values() for r in rows), default=0),
             (sum(len(r["statement"]) for rows in data.values() for r in rows) / total) if total else 0))

    if problems:
        print("\n校验失败 %d 条：" % len(problems))
        for p in problems[:10]:
            print("  -", p)
        sys.exit(1)
    print("逐条 verify_quote 通过。")

    if args.check:
        if not os.path.exists(OUT_JS):
            sys.exit("缺 %s —— 跑一次不带 --check 的生成" % OUT_JS)
        cur = open(OUT_JS, encoding="utf-8").read()
        if cur != text:
            sys.exit("site/assets/data/problems.js 与语料不一致 —— 重新生成")
        print("清单与语料一致。")
        return

    os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
    with open(OUT_JS, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("写入 %s（%d 字节）" % (os.path.relpath(OUT_JS, ROOT), len(text.encode("utf-8"))))


if __name__ == "__main__":
    main()
