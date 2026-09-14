#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_figures.py —— 抽图质量自检。

对 data/figures.json 中的每一张图做三项体检：
  1. 宽高比落在合理区间 [0.2, 8]（排除细长条 / 误裁成一条缝）
  2. 非空白像素占比"够"（>0.3% 说明没裁到纯白；<92% 说明没把大片正文一起裁进来）
  3. 文件大小 > 5KB（排除空图）
不通过的写入 data/figures_suspect.json，并重绘 data/figs/_contact-sheet.html（红框标出）。

用法：python tools/test_figures.py [--max-ratio 0.92] [--min-ratio 0.003]
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import sys

import pymupdf as fitz

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "data", "figures.json")
SUSPECT = os.path.join(ROOT, "data", "figures_suspect.json")
FIGS_DIR = os.path.join(ROOT, "data", "figs")

AR_MIN, AR_MAX = 0.2, 8.0
MIN_BYTES = 5 * 1024
MIN_SIDE = 60              # 最小边长（像素）
INK_LEVEL = 246            # 灰度 < 246 视为墨迹

# 逐字节查表：把灰度值折叠成 0/1，再用 C 速度的 sum() 统计墨迹像素
_INK_TABLE = bytes(1 if i < INK_LEVEL else 0 for i in range(256))


def _load_tool_04():
    path = os.path.join(ROOT, "tools", "04_figures.py")
    spec = importlib.util.spec_from_file_location("figures04", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def inspect(path_abs: str, min_ratio: float, max_ratio: float):
    """返回 (metrics, reasons)。"""
    reasons = []
    size = os.path.getsize(path_abs)
    pix = fitz.Pixmap(path_abs)
    w, h = pix.width, pix.height
    if pix.n > 1:                                   # 转灰度便于统计
        pix = fitz.Pixmap(fitz.csGRAY, pix)
    samples = pix.samples
    ink = sum(samples.translate(_INK_TABLE))
    ratio = ink / float(w * h) if w * h else 0.0

    if size <= MIN_BYTES:
        reasons.append(f"文件过小({size//1024}KB<=5KB)")
    ar = w / h if h else 0.0
    if not (AR_MIN <= ar <= AR_MAX):
        reasons.append(f"宽高比异常({ar:.2f})")
    if w < MIN_SIDE or h < MIN_SIDE:
        reasons.append(f"尺寸过小({w}x{h})")
    if ratio < min_ratio:
        reasons.append(f"墨迹过少({ratio:.4f})")
    if ratio > max_ratio:
        reasons.append(f"墨迹过多({ratio:.4f})")

    metrics = {"width": w, "height": h, "bytes": size,
               "aspect": round(ar, 3), "ink_ratio": round(ratio, 5)}
    return metrics, reasons


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-ratio", type=float, default=0.003)
    ap.add_argument("--max-ratio", type=float, default=0.92)
    args = ap.parse_args()

    index = json.load(open(INDEX, encoding="utf-8"))
    suspects, ok = [], 0
    for r in index:
        # path 形如 data/figs/fig-2-2.png（相对工作目录）
        path_abs = os.path.join(ROOT, r["path"].replace("/", os.sep))
        if not os.path.exists(path_abs):
            suspects.append({"fig_id": r["fig_id"], "printed_page": r.get("printed_page"),
                             "path": r["path"], "reasons": ["文件缺失"],
                             "metrics": {}})
            continue
        metrics, reasons = inspect(path_abs, args.min_ratio, args.max_ratio)
        if reasons:
            suspects.append({"fig_id": r["fig_id"], "printed_page": r.get("printed_page"),
                             "path": r["path"], "reasons": reasons, "metrics": metrics})
        else:
            ok += 1

    with open(SUSPECT, "w", encoding="utf-8") as f:
        json.dump(suspects, f, ensure_ascii=False, indent=1)

    # 重绘总览页，把可疑图标红
    m04 = _load_tool_04()
    sheet = m04.build_contact_sheet(index, FIGS_DIR,
                                    {s["fig_id"]: s for s in suspects})

    print(f"共 {len(index)} 张：合格 {ok}，可疑 {len(suspects)}")
    print(f"可疑清单：{SUSPECT}")
    print(f"总览页：{sheet}")
    for s in suspects[:40]:
        print(f"  Figure {s['fig_id']:<10} p{s.get('printed_page')}  {'; '.join(s['reasons'])}")
    if len(suspects) > 40:
        print(f"  ... 其余 {len(suspects) - 40} 条见清单文件")
    return 0


if __name__ == "__main__":
    sys.exit(main())
