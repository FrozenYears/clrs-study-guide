#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""12_publish_figs.py —— 把切好的原书插图接入站点（第 31 轮欠到现在的那件）。

产出两样，都是**提交进版本库**的静态资源（本站零构建、可能以 file:// 打开，
所以运行时不能 fetch JSON，清单必须是 JS 模块 —— 与 assets/chapters.js 同一套理由）：

    site/figs/fig-<章>-<号>.png      从 data/figs/ 复制过来的图
    site/assets/data/figures.js      编号 -> {src, caption, page, w, h} 的清单模块

只发布「关卡真的引用到」的图：判据是关卡数据里出现 `Figure X.Y`（按段计 339 处、
覆盖 90 关）。没被引用的 127 张继续留在 data/figs/，等哪一关讲到再发布 ——
没必要为了「全上站」把站内塞满没人看的 10 MB 位图。

用法：
    node tools/dump_levels.mjs           # 先刷新 tools/_levels.json
    python tools/12_publish_figs.py      # 发布
    python tools/12_publish_figs.py --check   # 只校验：清单与文件是否对得上

自检三件事，任何一条不满足就非零退出：
  ① 清单里每个 src 指向的文件真实存在，且字节数 > 1000（空图/截断图）；
  ② 关卡引用的每个图号都在清单里（漏图 = 页面上会出现「引用了图却看不到」）；
  ③ 原文件的尺寸/图注与 figures.json 记录一致（防止 data 与 site 两边漂移）。
"""
import argparse
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.abspath(__file__ + "/.."))
LEVELS = os.path.join(ROOT, "tools", "_levels.json")
INDEX = os.path.join(ROOT, "data", "figures.json")
SRC_DIR = os.path.join(ROOT, "data", "figs")
OUT_DIR = os.path.join(ROOT, "site", "figs")
OUT_JS = os.path.join(ROOT, "site", "assets", "data", "figures.js")

# 图号引用写法：Figure 2.2、Figures 12.1 与 12.2、Figures 13.5 and 13.6、Figure 34.8(b)。
# "Figures" 后面常跟一串图号、只有第一个带前缀，所以先整串匹配、再把串里的编号逐个抠出来。
# 分隔符必须是 , 、 和 与 and & 之一（不能是裸空格），否则
# "Figure 3.2 比 2.1 晚" 会把 2.1 也吞进来。
# ★ 这段逻辑必须与 site/assets/ui/figures.js 的 FIG_REF_RE 保持一致，
#   否则「发布时认为引用了」和「页面上要显示」两边数不到一起。
FIG_REF_RE = re.compile(
    r"Figures?\s+(\d+\.\d+(?:\s*(?:[,、]|和|与|and|&)\s*(?:Figures?\s+)?\d+\.\d+)*)")
ID_RE = re.compile(r"(\d+\.\d+)")


def cited_ids():
    """关卡数据里引用到、且 data/figures.json 里确实切了图的编号集合。"""
    with open(LEVELS, encoding="utf-8") as f:
        data = json.load(f)
    refs = set()
    for ch in data["chapters"]:
        for lv in ch["levels"]:
            blob = json.dumps(lv, ensure_ascii=False)
            for grp in FIG_REF_RE.findall(blob):
                refs |= set(ID_RE.findall(grp))
    return refs


def load_index():
    with open(INDEX, encoding="utf-8") as f:
        figs = json.load(f)
    return {f["fig_id"]: f for f in figs}


def js_escape(s):
    return (s or "").replace("\\", "\\\\").replace('"', "\\\"").replace("\n", " ")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="只校验，不写文件")
    args = ap.parse_args()

    if not os.path.exists(LEVELS):
        sys.exit("缺 tools/_levels.json —— 先跑 node tools/dump_levels.mjs")
    index = load_index()
    want = sorted(cited_ids() & set(index))
    missing = sorted(cited_ids() - set(index))
    problems = []

    recs = []
    for fid in want:
        rec = index[fid]
        src = os.path.join(ROOT, rec["path"].replace("/", os.sep))
        fname = os.path.basename(rec["path"])
        dst = os.path.join(OUT_DIR, fname)
        if not os.path.exists(src):
            problems.append("源图缺失：" + rec["path"])
            continue
        size = os.path.getsize(src)
        if size < 1000:
            problems.append("源图可疑（%d 字节）：%s" % (size, rec["path"]))
            continue
        if not args.check:
            os.makedirs(OUT_DIR, exist_ok=True)
            shutil.copy2(src, dst)
        if not os.path.exists(dst):
            problems.append("站点侧没有落到文件：" + fname)
            continue
        if os.path.getsize(dst) != size:
            problems.append("站点侧字节数不一致：" + fname)
        recs.append({
            "id": fid,
            "src": "figs/" + fname,
            "caption": rec.get("caption") or ("Figure " + fid),
            "page": rec.get("printed_page"),
            "w": rec.get("width"),
            "h": rec.get("height"),
        })

    body = ",\n".join(
        '  "%s": { src: "%s", caption: "%s", page: %s, w: %s, h: %s }'
        % (r["id"], r["src"], js_escape(r["caption"]),
           json.dumps(r["page"]), json.dumps(r["w"]), json.dumps(r["h"]))
        for r in recs)
    text = (
        "/* =============================================================================\n"
        " * figures.js —— 原书插图的编号清单（由 tools/12_publish_figs.py 生成，不要手改）\n"
        " *\n"
        " * 为什么是 JS 模块而不是 fetch JSON：本站零构建、可能以 file:// 打开，\n"
        " *   而 file:// 下 fetch 会被 CORS 拦掉（与 assets/chapters.js 同一套理由）。\n"
        " * 只收「关卡里引用到 Figure X.Y」的那些图；图注与原书一致，逐字照 data/figures.json。\n"
        " * 图片来源：tools/04_figures.py 从 PDF 按 200 DPI 裁切，版式判据见\n"
        " *   docs/reports/P2-插图切图.md。\n"
        " * ========================================================================== */\n"
        "\n"
        "/** 图号 -> {src（相对站点根）, caption, page（原书印刷页）, w, h（像素）} */\n"
        "export const FIGURES = {\n%s\n};\n"
        "\n"
        "/** 按图号取条目；没有就返回 null（页面上会走「图未发布」的降级文案）。 */\n"
        "export function figureOf(id) {\n"
        "  return Object.prototype.hasOwnProperty.call(FIGURES, id) ? FIGURES[id] : null;\n"
        "}\n"
        "\n"
        "export default { FIGURES, figureOf };\n" % body)

    if not args.check:
        os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
        with open(OUT_JS, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)

    print("发布图数 %d / 语料已切图 %d；关卡引用但没切图的 %d 个：%s"
          % (len(recs), len(index), len(missing), missing[:8] or "无"))
    n = 0
    for line in sorted(set(os.listdir(OUT_DIR))) if os.path.isdir(OUT_DIR) else []:
        if line.endswith(".png"):
            n += 1
    print("site/figs 下现有 png %d 个" % n)
    if problems:
        print("发现问题：")
        for p in problems:
            print("  -", p)
        sys.exit(1)
    print("校验通过：清单与文件一一对应。")


if __name__ == "__main__":
    main()
