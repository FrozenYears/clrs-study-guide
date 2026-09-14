"""Regression test for tools/03_segment.py.

Run:  python tools/test_segment.py

Locks in the properties that the level content depends on:
  * every section of the book owns at least one block;
  * the pseudocode of chapter 2 has exactly the line counts printed in the book;
  * figure captions, exercise lists and theorem numbering survive segmentation;
  * running heads are gone and no prose was swallowed by the pseudocode scanner.
"""
import json
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOCKS_DIR = os.path.join(ROOT, "data", "blocks")
STRUCT = os.path.join(ROOT, "data", "structure.json")
PAGES = os.path.join(ROOT, "data", "pages_fixed.jsonl")

FAILS = []
CHECKS = [0]


def ok(cond, msg):
    CHECKS[0] += 1
    if not cond:
        FAILS.append(msg)
        print("  FAIL  " + msg)
    else:
        print("  ok    " + msg)


def load_chapter(fname):
    with open(os.path.join(BLOCKS_DIR, fname), encoding="utf-8") as f:
        return json.load(f)


def main():
    struct = json.load(open(STRUCT, encoding="utf-8"))
    index = json.load(open(os.path.join(BLOCKS_DIR, "_index.json"), encoding="utf-8"))

    # ---- 1. every section is represented -------------------------------------
    print("\n[1] 每个节都有对应知识块")
    expect_sections = []
    for part in struct["parts"]:
        for ch in part.get("chapters", []):
            for sec in ch.get("sections", []) or []:
                expect_sections.append(sec["title"])
    owned = set()
    all_blocks = []
    for fname in sorted(os.listdir(BLOCKS_DIR)):
        if not fname.endswith(".json") or fname == "_index.json":
            continue
        d = load_chapter(fname)
        all_blocks.extend(d["blocks"])
        for b in d["blocks"]:
            if b.get("section_title"):
                owned.add(b["section_title"])
    missing = [s for s in expect_sections if s not in owned]
    ok(not missing, "%d 个节全部有块（缺失 %d 个：%s）"
       % (len(expect_sections), len(missing), missing[:5]))
    ok(index["sections_with_no_block"] == 0
       if "sections_with_no_block" in index else True,
       "索引报告「无块的节」为 0")

    # ---- 2. chapter 2 pseudocode line counts (verbatim from the book) ---------
    print("\n[2] 第 2 章伪代码行数与原书一致")
    ch2 = load_chapter("part-i-foundations__ch02.json")
    pc_by_name = {}
    for b in ch2["blocks"]:
        if b["type"] == "pseudocode":
            pc_by_name.setdefault(b["algo_name"], []).append(b)

    ins = pc_by_name.get("INSERTION-SORT") or []
    ok(len(ins) >= 1, "第 2 章抽到 INSERTION-SORT 伪代码块")
    if ins:
        main_ins = max(ins, key=lambda b: len(b["lines"]))
        ok(len(main_ins["lines"]) == 8,
           "INSERTION-SORT 共 8 行（实际 %d）" % len(main_ins["lines"]))
        ok(main_ins["lines"][0]["n"] == 1 and main_ins["lines"][-1]["n"] == 8,
           "INSERTION-SORT 行号 1..8 连续")
        ok("for i = 2 to n" in main_ins["lines"][0]["code"],
           "INSERTION-SORT 第 1 行是 'for i = 2 to n'")

    ms = pc_by_name.get("MERGE-SORT") or []
    ok(bool(ms), "第 2 章抽到 MERGE-SORT 伪代码块")
    if ms:
        ok(len(ms[0]["lines"]) == 7,
           "MERGE-SORT 共 7 行（实际 %d）" % len(ms[0]["lines"]))

    mg = pc_by_name.get("MERGE") or []
    ok(bool(mg), "第 2 章抽到 MERGE 伪代码块")
    if mg:
        ok(len(mg[0]["lines"]) == 27,
           "MERGE 共 27 行（实际 %d）" % len(mg[0]["lines"]))
        ok("n L = q" in mg[0]["lines"][0]["code"],
           "MERGE 第 1 行计算 n_L")
        ok("k = k + 1" in mg[0]["lines"][-1]["code"],
           "MERGE 第 27 行是 'k = k + 1'")

    # ---- 3. figure captions ---------------------------------------------------
    print("\n[3] 图注识别")
    caps = [b for b in ch2["blocks"] if b["type"] == "figure-caption"]
    ids = {re.match(r"^Figure\s+([\d.\-]+)", b["text"]).group(1) for b in caps}
    for want in ("2.1", "2.2", "2.3", "2.4", "2.5"):
        ok(want in ids, "识别到 Figure %s 的图注" % want)
    ok(len(caps) == 5, "第 2 章恰好 5 张图（实际 %d；原书为 2.1–2.5）" % len(caps))
    f22 = [b for b in caps if re.match(r"^Figure\s+2\.2\b", b["text"])]
    ok(bool(f22) and "INSERTION-SORT" in f22[0]["text"],
       "Figure 2.2 图注含完整的 INSERTION-SORT（连字符未被拆开）")
    ok(bool(f22) and "hand" not in f22[0]["text"],
       "Figure 2.1 / 2.2 的图注没有互相串页")

    # ---- 4. exercises attached to the right section ---------------------------
    print("\n[4] 习题识别与归属")
    truth = set()
    for line in open(PAGES, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        for ln in r["text"].split("\n"):
            s = ln.strip()
            if re.match(r"^\d+\.\d+-\d+$", s):
                truth.add(s)
    got = set()
    for b in all_blocks:
        m = re.match(r"^(\d+\.\d+-\d+)\s", b["text"])
        if m and b["type"] == "exercise":
            got.add(m.group(1))
    ok(len(truth - got) == 0,
       "全书 %d 道习题全部识别（缺 %d：%s）"
       % (len(truth), len(truth - got), sorted(truth - got)[:6]))
    ok(len(got - truth) == 0, "没有虚构的习题号（多 %d）" % len(got - truth))

    ch2_ex = {b["section"]: 0 for b in ch2["blocks"] if b["type"] == "exercise"}
    for b in ch2["blocks"]:
        if b["type"] == "exercise":
            ch2_ex[b["section"]] = ch2_ex.get(b["section"], 0) + 1
    ok(ch2_ex.get("2.1") == 5,
       "2.1 节 5 道习题（含印在下一页顶端的 2.1-3/4/5，实际 %s）" % ch2_ex.get("2.1"))
    ok(ch2_ex.get("2.3") == 8, "2.3 节 8 道习题（实际 %s）" % ch2_ex.get("2.3"))

    # ---- 5. running heads removed --------------------------------------------
    print("\n[5] 页眉页脚已剔除")
    RUNHEAD = re.compile(r"^\d{1,4}\s+Chapter\s+\d+\s+", re.M)
    bad = [b for b in all_blocks if RUNHEAD.search(b["text"])]
    ok(not bad, "没有任何块含 '<页码> Chapter N ...' 形式的页眉（实际 %d）" % len(bad))
    ch20 = None
    for fname in os.listdir(BLOCKS_DIR):
        if re.search(r"ch20\.json$", fname):
            ch20 = load_chapter(fname)
    ok(ch20 is not None, "找到第 20 章的块文件")
    if ch20:
        hits = [b for b in ch20["blocks"]
                if "Chapter 20 Elementary Graph Algorithms" in b["text"]]
        ok(not hits, "第 20 章正文里没有 'Chapter 20 Elementary Graph Algorithms'（实际 %d）"
           % len(hits))
        ok(any(b["type"] == "pseudocode" for b in ch20["blocks"]),
           "第 20 章抽到了图算法伪代码")

    # ---- 6. no prose swallowed by the pseudocode scanner ----------------------
    print("\n[6] 伪代码扫描没有吞掉正文")
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "seg", os.path.join(os.path.dirname(os.path.abspath(__file__)), "03_segment.py"))
    seg = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(seg)

    pages = []
    for line in open(PAGES, encoding="utf-8"):
        line = line.strip()
        if line:
            pages.append(json.loads(line))
    kept = seg.clean_pages(pages)
    texts = [k[2] for k in kept]
    PSEUDO = seg.PSEUDO_LINE_RE
    runs = seg.find_pseudocode(texts)
    # (a) a run must never end on a wrapped tail: its last line carries a number,
    #     which is what guarantees the cursor stops before the following prose.
    bad_end = [(a, b, pc["algo_name"]) for a, b, pc in runs
               if not PSEUDO.match(texts[b - 1])]
    ok(not bad_end, "每个伪代码 run 都止于带行号的最后一行（异常 %d）" % len(bad_end))
    # (b) the lines a run absorbs beyond its numbered lines must be wrap tails,
    #     and they must stay a small share of the corpus.
    consumed = sum(b - a for a, b, _ in runs)
    numbered = sum(len(pc["lines"]) for _, _, pc in runs)
    wrap_share = (consumed - numbered) / max(1, len(texts))
    ok(wrap_share < 0.01,
       "折行尾行只占全书 %.3f%%（上限 1%%；若扫描器越界吞正文此值会飙升）"
       % (wrap_share * 100))
    # (c) guard the specific regression: prose right after a pseudocode block
    #     must survive as its own block.
    ch2_text = "\n".join(b["text"] for b in ch2["blocks"])
    ok("This procedure is the rare case that uses both 1-origin indexing" in ch2_text,
       "MERGE 之后的正文（脚注 12）没有被伪代码扫描吞掉")
    ok("The while loop of lines 12" in ch2_text or "Lines 8" in ch2_text,
       "MERGE 之后的正文段落（Lines 8–18…）完好")

    # ---- 7. corpus statistics -------------------------------------------------
    print("\n[7] 分块统计")
    cnt = Counter(b["type"] for b in all_blocks)
    ok(cnt["pseudocode"] >= 190,
       "伪代码块 ≥ 190（实际 %d，第 4 版收录约 200 个算法）" % cnt["pseudocode"])
    ok(cnt["body"] >= 12000, "正文块 ≥ 12000（实际 %d）" % cnt["body"])
    ok(cnt["figure-caption"] >= 180, "图注块 ≥ 180（实际 %d）" % cnt["figure-caption"])
    ok(cnt["theorem"] >= 100, "定理块 ≥ 100（实际 %d）" % cnt["theorem"])
    ok(cnt["lemma"] >= 70, "引理块 ≥ 70（实际 %d）" % cnt["lemma"])
    ok(cnt["corollary"] >= 35, "推论块 ≥ 35（实际 %d）" % cnt["corollary"])
    ok(cnt["corollary"] + cnt["lemma"] + cnt["theorem"] > 200,
       "编号定理体系（定理+引理+推论）> 200（实际 %d）"
       % (cnt["corollary"] + cnt["lemma"] + cnt["theorem"]))

    print("\n" + "=" * 62)
    print("检查项 %d，失败 %d" % (CHECKS[0], len(FAILS)))
    if FAILS:
        for m in FAILS:
            print("  - " + m)
        return 1
    print("全部通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
