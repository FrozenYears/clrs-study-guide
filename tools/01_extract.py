#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Step 1 of the CLRS corpus pipeline.

Outputs
-------
data/structure.json   : parts / chapters / sections with printed <-> pdf page maps
data/pages.jsonl      : one record per PDF page, RAW text (no repair yet)
data/sym_stats.json   : glyph frequency stats, used to build the repair table

Page mapping (verified empirically against this exact PDF):
    pdf_zero_based_index = printed_page + OFFSET
    OFFSET = 21
The PDF outline destinations are ALREADY 0-based page indices, so
    printed_page = outline_dest - OFFSET
"""
import glob
import json
import os
import re
import sys
from collections import Counter

from pypdf import PdfReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
OFFSET = 21


def main():
    os.makedirs(DATA, exist_ok=True)
    pdf_path = glob.glob(os.path.join(ROOT, "*.pdf"))[0]
    reader = PdfReader(pdf_path)
    n_pages = len(reader.pages)

    # ---------- 1. outline -> structure ----------
    def dest_index(item):
        try:
            return reader.get_destination_page_number(item)
        except Exception:
            return None

    tree = []

    def walk(node, depth, acc):
        for it in node:
            if isinstance(it, list):
                walk(it, depth + 1, acc)
            else:
                acc.append({"depth": depth, "title": it.title, "pdf": dest_index(it)})

    walk(reader.outline, 0, tree)

    parts, cur_part, cur_ch = [], None, None
    for node in tree:
        t = node["title"].strip()
        pdf = node["pdf"]
        printed = None if pdf is None else pdf - OFFSET
        rec = {
            "title": t,
            "depth": node["depth"],
            "pdf_index": pdf,
            "printed_page": printed,
        }
        if re.match(r"^Part\s+[IVX]+", t):
            # NOTE: do NOT treat a bare "Appendix notes" as a part -- it is a
            # chapter-level bookmark for the appendix notes section.
            cur_part = rec
            rec["kind"] = "part"
            rec["chapters"] = []
            parts.append(rec)
            cur_ch = None
        elif re.match(r"^\d+\s+\S", t):
            rec["kind"] = "chapter"
            m = re.match(r"^(\d+)", t)
            rec["number"] = int(m.group(1))
            rec["sections"] = []
            if cur_part is not None:
                cur_part["chapters"].append(rec)
            else:
                parts.append({"kind": "part", "title": "(front)", "chapters": [rec]})
            cur_ch = rec
        elif re.match(r"^[A-D]\s+\S", t) and node["depth"] == 1:
            rec["kind"] = "chapter"
            rec["number"] = t[0]
            rec["sections"] = []
            if cur_part is not None:
                cur_part["chapters"].append(rec)
            cur_ch = rec
        elif re.match(r"^[A-D]\.\d", t) or re.match(r"^\d+\.\d+", t):
            rec["kind"] = "section"
            if cur_ch is not None:
                cur_ch["sections"].append(rec)
        else:
            rec["kind"] = "other"

    # derive section page END by next section/chapter start
    flat = []
    for p in parts:
        for c in p["chapters"]:
            for s in c["sections"]:
                flat.append((s, c))
    # attach end pages
    for p in parts:
        chs = p["chapters"]
        for ci, c in enumerate(chs):
            secs = c["sections"]
            for si, s in enumerate(secs):
                if si + 1 < len(secs):
                    s["pdf_end"] = secs[si + 1]["pdf_index"]
                else:
                    s["pdf_end"] = None
            # chapter end = next chapter start (in flattened order)
            nxt = None
            for p2 in parts:
                for c2 in p2["chapters"]:
                    if c2 is not c and c2["pdf_index"] is not None and c["pdf_index"] is not None:
                        if c2["pdf_index"] > c["pdf_index"]:
                            if nxt is None or c2["pdf_index"] < nxt:
                                nxt = c2["pdf_index"]
            c["pdf_end"] = nxt if nxt else n_pages
            # last section of chapter ends at chapter end
            if secs:
                secs[-1]["pdf_end"] = c["pdf_end"]

    structure = {
        "source_pdf": os.path.basename(pdf_path),
        "total_pdf_pages": n_pages,
        "page_offset": OFFSET,
        "note": "printed_page = pdf_index - 21 ; pdf_index is 0-based",
        "parts": parts,
        "outline_raw_count": len(tree),
    }
    with open(os.path.join(DATA, "structure.json"), "w", encoding="utf-8") as f:
        json.dump(structure, f, ensure_ascii=False, indent=2)

    # ---------- 2. per-page raw text ----------
    pages_path = os.path.join(DATA, "pages.jsonl")
    glyphs = Counter()
    with open(pages_path, "w", encoding="utf-8") as f:
        for idx, page in enumerate(reader.pages):
            try:
                txt = page.extract_text() or ""
            except Exception as e:  # keep going, mark failure
                txt = ""
                print("  ! extract failed page", idx, e, file=sys.stderr)
            f.write(json.dumps({
                "pdf_index": idx,
                "printed_page": idx - OFFSET,
                "text": txt,
            }, ensure_ascii=False) + "\n")
            glyphs.update(ch for ch in txt if ord(ch) > 126)

    with open(os.path.join(DATA, "sym_stats.json"), "w", encoding="utf-8") as f:
        json.dump({
            "non_ascii_glyphs": glyphs.most_common(120),
            "ascii_controls": Counter(
                ch for ch in "".join(["x"]) if ord(ch) < 32
            ).most_common(),
        }, f, ensure_ascii=False, indent=2)

    print("pages:", n_pages)
    print("parts:", len(parts))
    print("chapters:", sum(len(p["chapters"]) for p in parts))
    print("sections:", sum(len(c["sections"]) for p in parts for c in p["chapters"]))
    print("wrote:", os.path.join(DATA, "structure.json"))
    print("wrote:", pages_path)
    print("top non-ascii glyphs:", glyphs.most_common(30))


if __name__ == "__main__":
    main()
