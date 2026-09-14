#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Step 3 of the CLRS corpus pipeline: segment pages into typed knowledge blocks.

Input : data/pages_fixed.jsonl  (step 2 output) + data/structure.json
Output: data/blocks/<part-slug>__ch<NN>.json   (one file per chapter)
        data/blocks/_index.json                (chapter/section/type roll-up)

Why this step exists: a level author should be able to ask "give me every
theorem and the pseudocode in section 4.5" instead of re-deriving page ranges
and re-reading raw page dumps.

Block schema
------------
{ type, chapter, section, section_title, printed_page, pdf_page, text }
pseudocode blocks additionally carry
{ algo_name, signature, lines: [{n, code}] }

Recognised types
----------------
body, definition, theorem, lemma, corollary, proof, example, pseudocode,
figure-caption, exercise, problem, chapter-notes, footnote

Handled here (and NOT in step 2, which is per page and cannot see structure):
  * running heads / bare page numbers removed
  * paragraphs re-joined across page breaks, with line-break hyphenation undone
    (only for real hyphenated wraps; `well-known` style compounds are kept)
  * theorem/lemma/definition numbering preserved verbatim
"""
import json
import os
import re
from collections import Counter, OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
PAGES_IN = os.path.join(DATA, "pages_fixed.jsonl")
STRUCT = os.path.join(DATA, "structure.json")
BLOCKS_DIR = os.path.join(DATA, "blocks")

# ---------------------------------------------------------------------------
# 1. line-level cleaning
# ---------------------------------------------------------------------------
RUNHEAD_RES = [
    # "36 Chapter 2 Getting Started"
    re.compile(r"^\s*\d{1,4}\s+Chapter\s+\d+\s+\S.*$"),
    # "Chapter 20 Elementary Graph Algorithms" (short, not a sentence)
    re.compile(r"^\s*Chapter\s+\d+\.?\s+[A-Z][\w'’\- ]{0,55}$"),
    # "2.3 Designing algorithms 39"  (section running head with a page number)
    re.compile(r"^\s*\d+\.\d+\s+[A-Z][\w ,'’\-:]{0,55}\s+\d{1,4}\s*$"),
    re.compile(r"^\s*Problems for Chapter\s+\d+\s+\d{1,4}\s*$"),
    re.compile(r"^\s*(Preface|Contents)\s+[ivxlcdm]+\s*$", re.I),
    re.compile(r"^\s*\d{1,4}\s*$"),          # bare page number
]

# section heading as it appears in the body: "3.1 O-notation" (no page number)
SECTION_HEAD_RE = re.compile(r"^\s*(\d+\.\d+)\s+([A-Z][^\n]{0,70})$")
# chapter heading in the body: "3 Growth of Functions" / "Chapter 3 Growth of Functions"
CHAPTER_HEAD_RE = re.compile(r"^\s*(?:Chapter\s+)?(\d{1,2})\s+([A-Z][^\n]{0,70})$")

# a numbered pseudocode line: "14 A[k] = L[i]"
PSEUDO_LINE_RE = re.compile(r"^\s*(\d{1,2})\s+(\S.*)$")
# procedure signature right above the pseudocode: "MERGE(A;p;q;r)" / "MERGE-SORT(A;p;q)"
SIGNATURE_RE = re.compile(r"^\s*([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*)\s*(\(\s*[^)]{0,60}\)|\.\s*[A-Za-z][^)]{0,60}/)\s*$")
SIGNATURE_BARE_RE = re.compile(r"^\s*([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*)\s*$")

TYPE_RES = [
    ("definition", re.compile(r"^Definition\s+\d")),
    ("theorem", re.compile(r"^Theorem\s+\d")),
    ("lemma", re.compile(r"^Lemma\s+\d")),
    ("corollary", re.compile(r"^Corollary\s+\d")),
    ("example", re.compile(r"^Example\b")),
    ("proof", re.compile(r"^Proof\b")),
    ("figure-caption", re.compile(r"^Figure\s+\d+[.\-]\d+\s+[A-Z]")),
    ("exercise", re.compile(r"^\d+\.\d+-\d+\s")),
    ("problem", re.compile(r"^\d{1,2}-\d+\s")),
    ("chapter-notes", re.compile(r"^(Chapter notes|Bibliographic notes|Notes)\b")),
]
QED_RE = re.compile(r"[■□]\s*$")
EXERCISES_RE = re.compile(r"^Exercises\s*$")
PROBLEMS_RE = re.compile(r"^Problems\s*$")
# CLRS prints an exercise/problem number on a line of its own, with the wording
# starting on the next line ("2.1-3" / "2.1-4").  Re-attach before classifying.
ITEM_NUM_RE = re.compile(r"^(?:\d+\.\d+-\d+|\d{1,2}-\d+)$")


def merge_item_numbers(items):
    """items: [(text, printed_page, pdf_page)] -> same shape, numbers re-attached."""
    out = []
    i = 0
    while i < len(items):
        t, pp, pi = items[i]
        if ITEM_NUM_RE.match(t.strip()) and i + 1 < len(items):
            nxt = items[i + 1]
            out.append((t.strip() + " " + nxt[0].strip(), pp, pi))
            i += 2
        else:
            out.append(items[i])
            i += 1
    return out
FOOTNOTE_MARK_RE = re.compile(r"^\d{1,3}\s+[A-Z(]")

# hyphenated line-break compounds that must NOT be glued back together
COMPOUND_PREFIX = {
    "well", "self", "non", "pre", "post", "multi", "half", "cross", "high",
    "low", "above", "one", "two", "re", "co", "anti", "semi", "over", "under",
    "out", "up", "in", "ex", "sub", "super", "inter", "intra", "n", "t", "x",
    "y", "s", "k", "p", "m", "d", "e", "f", "g", "i", "j", "o", "u", "v", "w",
}


def clean_pages(pages):
    """pages: list of {pdf_index, printed_page, text} -> list of kept lines."""
    out = []           # (printed_page, pdf_index, line)
    for p in pages:
        for raw in p["text"].split("\n"):
            line = raw.rstrip()
            if not line.strip():
                continue
            if any(rx.match(line) for rx in RUNHEAD_RES):
                continue
            out.append((p["printed_page"], p["pdf_index"], line.strip()))
    return out


def is_flowable(line):
    """True if this line is ordinary prose that may be joined to the next one."""
    if not line or PSEUDO_LINE_RE.match(line):
        return False
    if line[:1].islower():
        return True
    # a line continuing a sentence often starts lowercase; starts uppercase only
    # if the previous line ended mid-sentence, which we test separately
    return line[:1].isalpha() and not re.match(r"^[A-Z][a-z]+ [a-z]", line)


def join_lines(lines):
    """Merge a run of lines into one paragraph, undoing wrap hyphenation."""
    buf = lines[0]
    for nxt in lines[1:]:
        if buf.endswith("-") and nxt[:1].islower():
            stem = buf[:-1]
            word = re.split(r"[^A-Za-z]", stem)[-1]
            if word.lower() not in COMPOUND_PREFIX:
                buf = stem + nxt          # real wrap: run- + ning -> running
                continue
        buf = buf + " " + nxt
    return re.sub(r"\s{2,}", " ", buf).strip()


def split_paragraphs(lines):
    """Group consecutive lines into paragraphs, keeping math lines separate."""
    paras = []
    cur = []
    for ln in lines:
        if not cur:
            cur = [ln]
            continue
        prev = cur[-1]
        same = (
            not MATHISH_RE.search(prev) or not MATHISH_RE.search(ln)
        ) and (
            prev.endswith(("-", ",", ";", "and", "or", "the", "of", "to", "in",
                           "that", "with", "for", "from", "by", "as", "is",
                           "are", "we", "a"))
            or ln[:1].islower()
        )
        if same:
            cur.append(ln)
        else:
            paras.append(cur)
            cur = [ln]
    if cur:
        paras.append(cur)
    return paras


MATHISH_RE = re.compile(r"[=≤≥≠−+×∈⊆ΘΩ√⌊⌋⌈⌉]{2,}|\b[A-Z]\([a-z]")


def classify(para, state):
    """-> (type, payload)"""
    t = para.strip()
    if EXERCISES_RE.match(t):
        state["mode"] = "exercise"
        return "heading", None
    if PROBLEMS_RE.match(t):
        state["mode"] = "problem"
        return "heading", None
    head = SECTION_HEAD_RE.match(t)
    if head:
        return "section-head", (head.group(1), head.group(2))
    if state["mode"] == "exercise" and re.match(r"^\d+\.\d+-\d+", t):
        return "exercise", None
    if state["mode"] == "problem" and re.match(r"^\d{1,2}-\d+", t):
        return "problem", None
    for name, rx in TYPE_RES:
        if rx.match(t):
            return name, None
    if QED_RE.search(t) and len(t) > 40:
        return "proof", None
    if FOOTNOTE_MARK_RE.match(t) and len(t) < 260 and not re.search(r"[.;:,]\s", t[4:40]):
        return "footnote", None
    return "body", None


# ---------------------------------------------------------------------------
# 2. pseudocode extraction
# ---------------------------------------------------------------------------
def _is_wrap_candidate(line):
    """True if a non-numbered line may be the wrapped tail of a pseudocode line.

    CLRS wraps long pseudocode lines; the tail then arrives as its own text line
    with no leading number.  Such a tail starts with a comment marker, a lowercase
    word, or a closing bracket — never with a new item number / section head.
    """
    s = line.strip()
    if not s:
        return False
    if (ITEM_NUM_RE.match(s) or SECTION_HEAD_RE.match(s) or EXERCISES_RE.match(s)
            or PROBLEMS_RE.match(s) or CHAPTER_HEAD_RE.match(s)):
        return False
    if s.startswith("//") or s.startswith("/"):
        return True
    return s[:1].islower() or s[:1] in ")]}"


def find_pseudocode(lines):
    """lines: kept page lines.  -> list of (start, end, block).

    The end index is the last *numbered* line of the run, so prose that merely
    follows the pseudocode is never swallowed (the earlier revision advanced the
    cursor past every unnumbered line while hunting for the next number, which
    ate up to 11k lines of body text book-wide).
    """
    runs = []
    i = 0
    n = len(lines)
    while i < n:
        m = PSEUDO_LINE_RE.match(lines[i])
        if not m or int(m.group(1)) != 1:
            i += 1
            continue
        # try to extend 1, 2, 3, ...
        j = i
        expect = 1
        seq = []              # [(is_numbered, text)] in order
        last_num = None
        gap = 0
        while j < n:
            mm = PSEUDO_LINE_RE.match(lines[j])
            if mm:
                if int(mm.group(1)) != expect:
                    break     # a different number -> the run is over
                seq.append((True, lines[j].strip()))
                last_num = j
                expect += 1
                gap = 0
                j += 1
                continue
            if mm is None and gap < 2 and _is_wrap_candidate(lines[j]):
                seq.append((False, lines[j].strip()))
                gap += 1
                j += 1
                continue
            break
        if expect >= 3 and last_num is not None:
            # signature: the nearest name-only line above the run
            sig = None
            for k in range(i - 1, max(-1, i - 5), -1):
                s = SIGNATURE_RE.match(lines[k]) or SIGNATURE_BARE_RE.match(lines[k])
                if s:
                    name = SIGNATURE_RE.match(lines[k])
                    sig = (name.group(1) if name else s.group(1))
                    break
            if sig is None:
                # fallback: a hyphenated all-caps procedure name nearby (the cost
                # tables reprint the pseudocode without repeating its header)
                for k in range(i - 1, max(-1, i - 8), -1):
                    mm = re.search(r"\b([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+)\b", lines[k])
                    if mm:
                        sig = mm.group(1)
                        break
            if sig is None:
                # no procedure header above -> not pseudocode.  Numbered runs also
                # occur in data tables (permutations, sample inputs, ciphertext),
                # and those must not be mistaken for algorithms.
                i = last_num + 1
                continue
            parsed = []
            for is_num, txt in seq:
                if is_num:
                    pm = PSEUDO_LINE_RE.match(txt)
                    parsed.append({"n": int(pm.group(1)), "code": pm.group(2).strip()})
                elif parsed:
                    # a wrapped tail belongs to the line it continues
                    parsed[-1]["code"] = (parsed[-1]["code"] + " " + txt).strip()
            runs.append((i, last_num + 1, {
                "algo_name": sig,
                "signature": sig,
                "lines": parsed,
            }))
            i = last_num + 1        # do not step past prose after the run
        else:
            i += 1
    return runs


# ---------------------------------------------------------------------------
# 3. driver
# ---------------------------------------------------------------------------
def slugify(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def main():
    os.makedirs(BLOCKS_DIR, exist_ok=True)
    pages = []
    with open(PAGES_IN, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                pages.append(json.loads(line))
    by_index = {p["pdf_index"]: p for p in pages}
    struct = json.load(open(STRUCT, encoding="utf-8"))

    index = OrderedDict()
    type_totals = Counter()
    n_chapters = 0
    missing_sections = []

    for part in struct["parts"]:
        pslug = slugify(part["title"])
        for ch in part.get("chapters", []):
            n_chapters += 1
            chnum = ch.get("number")
            ch_end = ch.get("pdf_end") or part.get("pdf_end") or max(by_index)
            sections = ch.get("sections", []) or []
            # "2.1 Insertion sort" -> {"2.1": "2.1 Insertion sort"}
            sec_titles = [(s["title"].split(" ")[0], s["title"]) for s in sections]
            blocks = []
            found_sections = set()

            spans = []
            for si, sec in enumerate(sections):
                start = sec["pdf_index"]
                stop = (sections[si + 1]["pdf_index"] - 1) if si + 1 < len(sections) else ch_end
                spans.append((sec, start, min(stop, ch_end)))

            for sec, start, stop in spans:
                seg_pages = [by_index[i] for i in range(start, stop + 1) if i in by_index]
                if not seg_pages:
                    missing_sections.append(sec["title"])
                    continue
                lines_all = clean_pages(seg_pages)
                # keep only lines whose pdf page is inside this section
                kept = [ln for ln in lines_all if start <= ln[1] <= stop]
                if not kept:
                    missing_sections.append(sec["title"])
                    continue
                found_sections.add(sec["title"])
                line_texts = [k[2] for k in kept]
                page_of = [k[0] for k in kept]
                pdf_of = [k[1] for k in kept]

                state = {"mode": "body"}
                used = set()
                for (a, b, pc) in find_pseudocode(line_texts):
                    for k in range(a, b):
                        used.add(k)
                    blocks.append({
                        "type": "pseudocode",
                        "chapter": chnum,
                        "section": sec["title"].split(" ")[0],
                        "section_title": sec["title"],
                        "printed_page": page_of[a],
                        "pdf_page": pdf_of[a],
                        "algo_name": pc["algo_name"],
                        "signature": pc["signature"],
                        "lines": pc["lines"],
                        "text": "\n".join("%d %s" % (l["n"], l["code"]) for l in pc["lines"]),
                    })

                free = [i for i in range(len(line_texts)) if i not in used]
                items = merge_item_numbers([(line_texts[i], page_of[i], pdf_of[i]) for i in free])
                for grp in split_paragraphs([it[0] for it in items]):
                    # map the group's first line back to its page
                    para = join_lines(grp)
                    if not para or len(para) < 8:
                        continue
                    page_hit = next((it for it in items if it[0] == grp[0]), items[0])
                    t, payload = classify(para, state)
                    if t in ("heading", "section-head"):
                        continue
                    # An exercise printed at the top of the next section's first
                    # page still belongs to the section named by its number
                    # ("2.1-3" -> 2.1).  The number is authoritative.
                    sec_label = sec["title"].split(" ")[0]
                    if t == "exercise":
                        em = re.match(r"^(\d+\.\d+)-\d+", para)
                        if em:
                            sec_label = em.group(1)
                    blocks.append({
                        "type": t,
                        "chapter": chnum,
                        "section": sec_label,
                        "section_title": dict(sec_titles).get(sec_label, sec["title"]),
                        "printed_page": page_hit[1],
                        "pdf_page": page_hit[2],
                        "text": para,
                    })

            # stable order: by pdf page, pseudocode before prose on the same page
            blocks.sort(key=lambda b: (b["pdf_page"], 0 if b["type"] == "pseudocode" else 1))
            if isinstance(chnum, int):
                label = "%02d" % chnum
            else:
                label = str(chnum or "00").upper()
            fname = "%s__ch%s.json" % (pslug, label)
            payload = {
                "chapter": chnum,
                "chapter_title": ch["title"],
                "part": part["title"],
                "source": {"printed": [ch["printed_page"], None], "pdf": [ch["pdf_index"], ch_end]},
                "sections": [s["title"] for s in sections],
                "sections_found": sorted(found_sections),
                "blocks": blocks,
            }
            with open(os.path.join(BLOCKS_DIR, fname), "w", encoding="utf-8") as f:
                json.dump(payload, f, ensure_ascii=False, indent=1)
            cnt = Counter(b["type"] for b in blocks)
            type_totals.update(cnt)
            index[fname] = {
                "chapter": chnum,
                "chapter_title": ch["title"],
                "blocks": len(blocks),
                "by_type": dict(cnt),
                "sections": len(sections),
                "sections_found": len(found_sections),
            }
            print("%-46s blocks=%-5d %s" % (fname, len(blocks),
                                            " ".join("%s:%d" % kv for kv in sorted(cnt.items()))))

    with open(os.path.join(BLOCKS_DIR, "_index.json"), "w", encoding="utf-8") as f:
        json.dump({
            "chapters": index,
            "totals_by_type": dict(type_totals),
            "total_blocks": sum(v["blocks"] for v in index.values()),
            "missing_sections": missing_sections,
        }, f, ensure_ascii=False, indent=1)

    print()
    print("chapters:", n_chapters)
    print("blocks  :", sum(v["blocks"] for v in index.values()))
    print("types   :", dict(type_totals.most_common()))
    print("sections with no block:", len(missing_sections))


if __name__ == "__main__":
    main()
