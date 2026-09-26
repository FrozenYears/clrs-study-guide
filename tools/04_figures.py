#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
04_figures.py —— 从 CLRS 第 4 版 PDF 裁剪插图（高 DPI PNG）并建立索引。

为什么需要它：本书插图使用子集化字体，文本抽取是乱码（Figure 2.1 抽出来是
`♥ ♥ 2 ♥ 4 ♥ ♥ ♥`），只能靠"切图"原样保留。

实测版式结论（见作者本地报告《P2-插图切图》）：
  * 页面 660 x 743 pt，单栏；正文区 x ≈ [169, 565]，标题悬挂缩进至 x ≈ 99。
  * 图注恒在图形【下方】，左对齐，首行以 "Figure X.Y" 开头。
  * 图注与图内标注字号 ≤ 9.9pt；正文与标题字号 ≥ 11.9pt —— 中间有明确空档，
    据此可把"图内文字"与"正文"分开，从而算出图区的上边界。
  * 图注块的第一个 span 是【粗体】(flags & 16)；正文里的 "Figure 2.2 shows ..."
    则是常规体 —— 据此区分"图注"与"正文引用"。

裁切策略：
  bottom = 图注 bbox 上沿
  top    = max(页眉下沿, 该页所有"正文级(字号>=11)"文本块与其它图注的下沿中，
               位于图注之上的最大 y)
  横向   = 内容宽度 [92, 568]，随后按实际墨迹自动收边
  渲染 200 DPI，再用灰度 pixmap 的 bytes 切片刻度做四边去白边。

用法：
  python tools/04_figures.py --printed-lo 3 --printed-hi 154   # 只跑 Part I
  python tools/04_figures.py --scan-only                       # 只统计，不渲染
  python tools/04_figures.py                                   # 全量
"""
from __future__ import annotations

import argparse
import glob
import html
import json
import os
import re
import sys
from typing import Optional

import pymupdf as fitz

# ------------------------------------------------------------------ 常量 / 版式参数
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE_OFFSET = 21                     # printed_page = pdf_index - 21
DPI = 200
ZOOM = DPI / 72.0

BODY_MIN_SIZE = 11.7                 # 全书字号分布实测：正文恰为 11.9（13352 块）、节标题 13.1（237 块），
BODY_MAX_SIZE = 13.5                 # 中间无其它正文级字号；10.6/11.4/11.6/14.2 均为图内元素（如大省略号、
                                     # 扑克牌点数），必须排除，否则会把图裁短（曾误伤 Figure 2.1 / 4.1 / 9.2）
TEXT_TOP = 62.0                      # 正文区上沿（页眉 y1≈59.1，之下即内容区）
CROP_X0 = 92.0                       # 内容横向范围（容纳标题悬挂与递归树等宽图）
CROP_X1 = 568.0
INK_THRESH = 246                     # 灰度 < 246 视为墨迹（页面底色 255）
TRIM_MARGIN = 3                      # 去边后保留的像素边距

FIG_RE = re.compile(r"^Figure\s+([0-9A-Za-z]+)\s*[.\-–]\s*(\d+)")


# ------------------------------------------------------------------ 定位图注
def _block_text(blk: dict) -> str:
    return "".join(sp["text"] for ln in blk.get("lines", []) for sp in ln["spans"])


def _first_span(blk: dict):
    for ln in blk.get("lines", []):
        for sp in ln["spans"]:
            return sp
    return None


def scan_captions(doc: "fitz.Document", verbose: bool = False) -> list[dict]:
    """全文扫描，返回所有图注记录（按 PDF 页序）。"""
    captions: list[dict] = []
    for pno in range(doc.page_count):
        page = doc[pno]
        try:
            d = page.get_text("dict")
        except Exception:
            continue
        for blk in d["blocks"]:
            if blk.get("type") != 0:
                continue
            sp0 = _first_span(blk)
            if sp0 is None:
                continue
            txt = _block_text(blk).strip()
            if not txt.startswith("Figure"):
                continue
            if not (sp0["flags"] & 16):          # 必须是粗体 —— 排除正文引用
                continue
            m = FIG_RE.match(txt)
            if not m:
                continue
            chap, num = m.group(1), m.group(2)
            captions.append({
                "fig_id": f"{chap}.{num}",
                "chapter_key": chap,
                "number": int(num),
                "caption": re.sub(r"\s+", " ", txt),
                "pdf_page": pno,
                "printed_page": pno - PAGE_OFFSET,
                "bbox": [round(v, 2) for v in blk["bbox"]],
            })
        if verbose and pno % 100 == 0:
            print(f"  ...扫描 {pno}/{doc.page_count}，已找到 {len(captions)} 张", flush=True)
    # 去重（同一渲染偶尔出双块）：同 fig_id 同页取最靠上者
    seen: dict[tuple, dict] = {}
    for c in captions:
        key = (c["fig_id"], c["pdf_page"])
        if key not in seen or c["bbox"][1] < seen[key]["bbox"][1]:
            seen[key] = c
    out = sorted(seen.values(), key=lambda c: (c["pdf_page"], c["bbox"][1]))
    # 处理续页图：Figure 18.8 的"Figure 18.8, continued"是另起一版，需唯一命名
    used: dict[str, int] = {}
    for c in out:
        k = c["fig_id"]
        used[k] = used.get(k, 0) + 1
        if used[k] > 1:
            c["fig_id"] = f"{k}-cont{'' if used[k] == 2 else used[k] - 1}"
            c["continued"] = True
    return out


# ------------------------------------------------------------------ 计算图区上界
def content_above(page: "fitz.Page", cap_y0: float, page_top: float) -> float:
    """返回图注之上、该页最靠下的"正文级文本/其它图注"下沿（图内小字被排除）。"""
    lower = page_top
    try:
        d = page.get_text("dict")
    except Exception:
        return lower
    for blk in d["blocks"]:
        if blk.get("type") != 0:
            continue
        sp0 = _first_span(blk)
        if sp0 is None:
            continue
        y1 = blk["bbox"][3]
        if y1 > cap_y0 + 0.5:                # 只看图注之上
            continue
        txt = _block_text(blk).strip()
        is_caption = txt.startswith("Figure") and (sp0["flags"] & 16)
        is_body = BODY_MIN_SIZE <= sp0["size"] <= BODY_MAX_SIZE
        if is_caption or is_body:
            lower = max(lower, y1)
    return lower


# ------------------------------------------------------------------ 去白边
def tight_pixel_box(gray: "fitz.Pixmap", thresh: int = INK_THRESH):
    """在灰度 pixmap 上求墨迹包围盒（像素坐标，含 1px 边距），返回 (x0,y0,x1,y1) 或 None。"""
    w, h = gray.width, gray.height
    if w == 0 or h == 0:
        return None
    s = gray.samples
    row_has = [min(s[y * w:(y + 1) * w]) < thresh for y in range(h)]
    if not any(row_has):
        return None
    col_has = [min(s[x::w]) < thresh for x in range(w)]
    if not any(col_has):
        return None
    y0 = row_has.index(True)
    y1 = h - 1 - row_has[::-1].index(True)
    x0 = col_has.index(True)
    x1 = w - 1 - col_has[::-1].index(True)
    return x0, y0, x1, y1


# ------------------------------------------------------------------ 单张裁剪
def crop_figure(doc, cap: dict, out_dir: str) -> Optional[dict]:
    page = doc[cap["pdf_page"]]
    pw, ph = page.rect.width, page.rect.height

    top = content_above(page, cap["bbox"][1], TEXT_TOP)
    bottom = cap["bbox"][1]
    if bottom - top < 12:                    # 上界几乎贴住图注 —— 退回到正文区上沿
        top = TEXT_TOP

    clip = fitz.Rect(max(0, CROP_X0), max(0, top), min(pw, CROP_X1), min(ph, bottom))
    if clip.is_empty:
        return None
    clip = fitz.Rect(clip.x0, clip.y0, max(clip.x1, clip.x0 + 4), max(clip.y1, clip.y0 + 4))

    # 1) 灰度渲染用于去白边
    gray = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), colorspace=fitz.csGRAY, clip=clip)
    box = tight_pixel_box(gray)
    if box is None:
        # 图注上方没有墨迹 —— 很可能是"图被分页截断"，回溯上一页
        return _crop_from_prev_page(doc, cap, out_dir)

    px0, py0, px1, py1 = box
    px0 = max(0, px0 - TRIM_MARGIN); py0 = max(0, py0 - TRIM_MARGIN)
    px1 = min(gray.width - 1, px1 + TRIM_MARGIN); py1 = min(gray.height - 1, py1 + TRIM_MARGIN)

    tight = fitz.Rect(
        clip.x0 + px0 / ZOOM, clip.y0 + py0 / ZOOM,
        clip.x0 + (px1 + 1) / ZOOM, clip.y0 + (py1 + 1) / ZOOM,
    )
    # 2) 彩色渲染输出
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=tight)
    return _save(doc, cap, pix, tight, out_dir, split=False)


def _crop_from_prev_page(doc, cap: dict, out_dir: str) -> Optional[dict]:
    """图文不在同一页时：取上一页正文内容之下的整段作为一个图。"""
    prev = cap["pdf_page"] - 1
    if prev < 0:
        return None
    page = doc[prev]
    pw, ph = page.rect.width, page.rect.height
    top = content_above(page, ph, TEXT_TOP)      # 上一页最后一个正文块之下
    clip = fitz.Rect(max(0, CROP_X0), max(0, top), min(pw, CROP_X1), min(ph, ph - 40))
    if clip.is_empty or clip.height < 12:
        clip = fitz.Rect(max(0, CROP_X0), TEXT_TOP, min(pw, CROP_X1), min(ph, ph - 40))
    gray = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), colorspace=fitz.csGRAY, clip=clip)
    box = tight_pixel_box(gray)
    if box is None:
        return None
    px0, py0, px1, py1 = box
    px0 = max(0, px0 - TRIM_MARGIN); py0 = max(0, py0 - TRIM_MARGIN)
    px1 = min(gray.width - 1, px1 + TRIM_MARGIN); py1 = min(gray.height - 1, py1 + TRIM_MARGIN)
    tight = fitz.Rect(clip.x0 + px0 / ZOOM, clip.y0 + py0 / ZOOM,
                      clip.x0 + (px1 + 1) / ZOOM, clip.y0 + (py1 + 1) / ZOOM)
    pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=tight)
    return _save(doc, cap, pix, tight, out_dir, split=True)


def _save(doc, cap: dict, pix, tight, out_dir: str, split: bool) -> Optional[dict]:
    # 文件名规范：fig-<章>-<序号>.png（附录 fig-b-2.png；续页 fig-18-8-cont.png）
    stem = cap["fig_id"].lower().replace(".", "-")
    fname = f"fig-{stem}.png"
    path = os.path.join(out_dir, fname)
    pix.save(path)
    rec = dict(cap)
    rec["bbox"] = [round(tight.x0, 2), round(tight.y0, 2), round(tight.x1, 2), round(tight.y1, 2)]
    rec["path"] = "data/figs/" + fname
    rec["width"] = pix.width
    rec["height"] = pix.height
    rec["bytes"] = os.path.getsize(path)
    if split:
        rec["split_across_pages"] = True
    return rec


# ------------------------------------------------------------------ 总览页
def build_contact_sheet(index: list[dict], out_dir: str, suspects: dict | None = None):
    suspects = suspects or {}
    by_chapter: dict[str, list[dict]] = {}
    for r in index:
        by_chapter.setdefault(r["chapter_key"], []).append(r)
    for v in by_chapter.values():
        v.sort(key=lambda r: r["number"])

    def chap_sort(k):
        return (0, int(k)) if k.isdigit() else (1, k)

    css = """
    :root{--bd:#d5d9e0;--fg:#1b1f24;--mut:#6b7280;--bad:#c0392b;}
    *{box-sizing:border-box}
    body{font:13px/1.5 system-ui,"Microsoft YaHei",sans-serif;color:var(--fg);
         margin:0;padding:24px;background:#f6f7f9}
    h1{font-size:20px;margin:0 0 4px}
    .meta{color:var(--mut);margin-bottom:20px}
    h2{font-size:15px;margin:26px 0 10px;padding-top:10px;border-top:1px solid var(--bd)}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px}
    .card{background:#fff;border:1px solid var(--bd);border-radius:8px;overflow:hidden;
          display:flex;flex-direction:column}
    .card.bad{border:2px solid var(--bad);box-shadow:0 0 0 3px #f7d7d3}
    .card img{width:100%;height:auto;display:block;background:#fff;
              border-bottom:1px solid var(--bd)}
    .cap{padding:8px 10px;font-size:12px}
    .cap b{font-size:12.5px}
    .cap .t{color:var(--mut);margin-top:3px}
    .flag{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:10px;
          background:var(--bad);color:#fff;font-size:11px}
    .split{background:#8a6d1a!important}
    .p{color:var(--mut)}
    """
    parts = [
        "<!DOCTYPE html><html lang='zh'><head><meta charset='utf-8'>",
        "<title>CLRS 插图总览（切图验收）</title>",
        f"<style>{css}</style></head><body>",
        "<h1>CLRS 第 4 版 · 插图切图总览</h1>",
        f"<div class='meta'>共 <b>{len(index)}</b> 张 · {len(by_chapter)} 章/附录 · "
        f"可疑 <b>{len(suspects)}</b> 张（红框标出）· 图片为相对路径，离线可看</div>",
    ]
    for chap in sorted(by_chapter, key=chap_sort):
        rows = by_chapter[chap]
        label = f"第 {chap} 章" if chap.isdigit() else f"附录 {chap}"
        parts.append(f"<h2>{label} <span class='p'>（{len(rows)} 张）</span></h2><div class='grid'>")
        for r in rows:
            fig_id = r["fig_id"]
            rel = os.path.basename(r["path"])
            info = suspects.get(fig_id)
            cls = "card bad" if info else "card"
            badge = ""
            if info:
                badge = f"<span class='flag'>可疑: {html.escape('; '.join(info.get('reasons', [])))}</span>"
            if r.get("split_across_pages"):
                badge += "<span class='flag split'>跨页</span>"
            cap_txt = html.escape((r["caption"][:150] + ("…" if len(r["caption"]) > 150 else "")))
            parts.append(
                f"<div class='{cls}'>"
                f"<img loading='lazy' src='{rel}' alt='Figure {fig_id}'>"
                f"<div class='cap'><b>Figure {fig_id}</b>{badge}"
                f"<div class='p'>印刷页 {r['printed_page']} · PDF {r['pdf_page']} · "
                f"{r['width']}×{r['height']} · {r['bytes']//1024} KB</div>"
                f"<div class='t'>{cap_txt}</div></div></div>"
            )
        parts.append("</div>")
    parts.append("</body></html>")
    sheet = os.path.join(out_dir, "_contact-sheet.html")
    with open(sheet, "w", newline="\n", encoding="utf-8") as f:
        f.write("\n".join(parts))
    return sheet


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description="CLRS 插图切图 + 建索引")
    ap.add_argument("--printed-lo", type=int, default=None, help="只处理印刷页 >= 此值")
    ap.add_argument("--printed-hi", type=int, default=None, help="只处理印刷页 <= 此值")
    ap.add_argument("--scan-only", action="store_true", help="只统计图注，不渲染")
    ap.add_argument("--limit", type=int, default=None, help="最多处理 N 张（调试用）")
    ap.add_argument("--dpi", type=int, default=DPI)
    ap.add_argument("--out", default=os.path.join(ROOT, "data", "figs"))
    ap.add_argument("--index", default=os.path.join(ROOT, "data", "figures.json"))
    args = ap.parse_args()

    global ZOOM
    ZOOM = args.dpi / 72.0
    os.makedirs(args.out, exist_ok=True)

    pdf = glob.glob(os.path.join(ROOT, "*.pdf"))
    if not pdf:
        sys.exit("找不到 PDF")
    doc = fitz.open(pdf[0])

    cache = os.path.join(args.out, "_captions.json")
    print("扫描全文图注 ...", flush=True)
    caps = scan_captions(doc)
    with open(cache, "w", newline="\n", encoding="utf-8") as f:
        json.dump(caps, f, ensure_ascii=False, indent=1)
    print(f"图注总数：{len(caps)}", flush=True)

    part1 = [c for c in caps if 3 <= c["printed_page"] <= 154]
    print(f"Part I（印刷页 3–154）：{len(part1)} 张", flush=True)
    # 异常：图注出现在页顶（可能图被分页截断）
    at_top = [c for c in caps if c["bbox"][1] < 110]
    print(f"图注位于页首(<110pt)（疑似跨页）：{len(at_top)} 张", flush=True)
    for c in at_top[:20]:
        print(f"    Figure {c['fig_id']} printed {c['printed_page']} y0={c['bbox'][1]}")

    if args.scan_only:
        from collections import Counter
        cnt = Counter(c["chapter_key"] for c in caps)
        print("按章计数：", dict(sorted(cnt.items(), key=lambda kv: (kv[0].isdigit(), kv[0]))))
        return

    todo = caps
    if args.printed_lo is not None:
        todo = [c for c in todo if c["printed_page"] >= args.printed_lo]
    if args.printed_hi is not None:
        todo = [c for c in todo if c["printed_page"] <= args.printed_hi]
    if args.limit:
        todo = todo[:args.limit]
    print(f"本次裁剪 {len(todo)} 张 → {args.out}", flush=True)

    index, failed = [], []
    for i, cap in enumerate(todo, 1):
        try:
            rec = crop_figure(doc, cap, args.out)
        except Exception as e:                    # 单张失败不打断整体
            rec = None
            failed.append({"fig_id": cap["fig_id"], "pdf_page": cap["pdf_page"], "error": repr(e)})
        if rec:
            index.append(rec)
        if i % 25 == 0 or i == len(todo):
            print(f"  [{i}/{len(todo)}] 已裁 {len(index)}，失败 {len(failed)}", flush=True)

    # 若为部分范围，则与既有索引合并（便于分步跑）
    if args.printed_lo is not None or args.printed_hi is not None or args.limit:
        if os.path.exists(args.index):
            old = json.load(open(args.index, encoding="utf-8"))
            done = {(r["fig_id"], r["pdf_page"]) for r in index}
            index = [r for r in old if (r["fig_id"], r["pdf_page"]) not in done] + index
    index.sort(key=lambda r: (r["pdf_page"], r["bbox"][1]))
    with open(args.index, "w", newline="\n", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)

    suspects_path = os.path.join(ROOT, "data", "figures_suspect.json")
    suspects = {}
    if os.path.exists(suspects_path):
        try:
            suspects = {s["fig_id"]: s for s in json.load(open(suspects_path, encoding="utf-8"))}
        except Exception:
            suspects = {}
    sheet = build_contact_sheet(index, args.out, suspects)

    print("---- 完成 ----")
    print(f"索引：{args.index}（{len(index)} 条）")
    print(f"总览：{sheet}")
    if failed:
        print(f"失败 {len(failed)} 张：{[f['fig_id'] for f in failed][:30]}")
        with open(os.path.join(args.out, "_failed.json"), "w", encoding="utf-8") as f:
            json.dump(failed, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
