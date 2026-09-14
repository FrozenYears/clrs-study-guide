#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Step 2 of the CLRS corpus pipeline: repair broken math-symbol encodings.

The PDF's math font lacks a correct ToUnicode map, so pypdf extracts math
glyphs as the wrong codepoints.  Every mapping below was *verified by
sampling real contexts* (see tools/_explore*.py and the symbol index at the
back of the book, printed ~p1250), NOT taken on faith from the planning doc.

Design principles (per 开发规范 / 建设计划):
  * No blind global replace for overloaded ASCII chars (j, D, W, 4, p, <, =,
    ., /, C).  Each got a context rule with a stated rationale.
  * Unambiguous glyphs (private-use area, Sinhala codepoints, obvious
    ligatures) are replaced directly.
  * `�` (U+FFFD) is genuinely ambiguous between `]` and `Ω`; we resolve it
    with a bracket-depth stack (it is `]` iff a still-open `[` precedes it).

Output:
  data/pages_fixed.jsonl   : same schema as pages.jsonl, text repaired.
  data/repair_report.json  : before/after glyph counts + residual notes.
"""
import json
import os
import re
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
PAGES_IN = os.path.join(DATA, "pages.jsonl")
PAGES_OUT = os.path.join(DATA, "pages_fixed.jsonl")
REPORT_OUT = os.path.join(DATA, "repair_report.json")

# ---------------------------------------------------------------------------
# 1. UNAMBIGUOUS glyph -> true character.  Verified by context sampling.
#    Each entry: (codepoint_or_char, replacement, rationale)
# ---------------------------------------------------------------------------
DIRECT = {
    "\u201a": ("Θ", "U+201A always the Greek Theta in O/Ω/Θ-notation (Theta)"),
    "\u0152": ("[", "U+0152 math open bracket '[' (A[1..n])"),
    "\ufb01": ("fi", "U+FB01 real fi-ligature, normalise to ASCII fi"),
    "\ufb02": ("fl", "U+FB02 real fl-ligature, normalise to ASCII fl"),
    "\u00fb": ("fi", "U+00FB broken fi-ligature (Identi<fb>ers->Identifiers, de<fb>nitions)"),
    "\u00fc": ("fl", "U+00FC broken fl-ligature (Of<fc>ine->Offline, in<fc>uence, <fc>ow->flow)"),
    "\u0160": ("!", "U+0160 factorial '!' (n! = n Š)"),
    "\u0dc4": ("≤", "U+0DC4 Sinhala slot = less-or-equal ≤ (0 ≤ f(n) ≤ cg(n))"),
    "\u0dc2": ("⊆", "U+0DC2 Sinhala slot = subset-or-equal ⊆ (A ⊆ T, M ⊆ E) — confirmed by symbol index"),
    "\u2740": ("→", "U+2740 decorative slot = right arrow → (path u → v in graphs)"),
    "\u00a4": ("≠", "U+00A4 generic-currency slot = not-equal ≠ (x ≠ NIL, a ≠ b)"),
    "\u0131": ("i", "U+0131 dotless i, the math variable i"),
    # private-use area slots (confirmed by repeated math contexts + symbol index)
    "\uE001": ("•", "U+E001 bullet • used in the Preface itemised lists"),
    "\uE002": ("−", "U+E002 minus sign − (n−1, −c6); mostly minus, see report residual note"),
    "\uE003": ("+", "U+E003 plus sign + (i+1, A[j+1]); math font '+' slot"),
    "\uE004": ("≥", "U+E004 greater-or-equal ≥ (n ≥ n0, p ≥ r)"),
    "\uE005": ("×", "U+E005 times × (n × n matrices)"),
    "\uE006": ("φ", "U+E006 Euler totient φ / soft-Oh Õ (rare; mapped to φ)"),
    "\uE007": ("≫", "U+E007 much-greater-than ≫ — confirmed by symbol index"),
    "\uE008": ("≪", "U+E008 much-less-than ≪ — confirmed by symbol index"),
    "\uE009": ("}", "U+E009 close brace } (Pr{...}, min{...})"),
    "\uE00A": ("⊂", "U+E00A proper subset ⊂ — confirmed by symbol index"),
    "\uE00C": ("⌋", "U+E00C floor close ⌋ (⌊n/2^{h+1}⌋)"),
    "\uE00B": ("}", "U+E00B close brace } (rare brace variant)"),
    "\uE00F": ("}", "U+E00F close brace } (rare brace variant)"),
    # matrix / display brackets (Î=left, Ï/Í=right) — approximated
    "\u00ce": ("[", "U+00CE left display bracket [ (matrix [[..]])"),
    "\u00cf": ("]", "U+00CF right display bracket ] (matrix [[..]])"),
    "\u00cd": ("]", "U+00CD right display bracket/bracket variant ]"),
    "\u00db": ("⌊", "U+00DB floor left ⌊ (⌊n/2^{h+1}⌋)"),
}

# ---------------------------------------------------------------------------
# 2. CONTEXT RULES for overloaded ASCII / quote / paren glyphs.
#
# Measured facts (from tools/_audit_rules.py over the whole book, NOT assumed):
#   * ASCII '=' adjacent to a *word* is a QUOTE char  (681 hits, all <phrase=)
#   * ASCII '=' between alnum is DIVISION             (1259 hits, n=2, 1=100)
#   * '=' is never a plain equals sign here -- 'D' is (see repair_d_assignment)
#   * '.' before an alnum is '(' ; '/' after an alnum is ')'   (10116 hits)
#     and they NEST: ‚.g.n// = Θ(g(n)), f.n/  D ‚.g.n// = f(n) = Θ(g(n))
#     -> a single-level regex silently drops the outer ')' (the bug fixed here)
#   * 'd..e' = ceil, 'b..c' = floor   (dn=2e = ⌈n/2⌉, bn=2c = ⌊n/2⌋)
# ---------------------------------------------------------------------------

# Small-caps rendering artifact: CLRS sets procedure names in small caps, and the
# extraction inserts a space at the roman->small-caps transition, so
#   INSERTION-SORT -> "I NSERTION-SORT",  AVL -> "A VL",  FIB-HEAP -> "F IB-HEAP"
# Measured over the whole book: 1743 hits, 409 distinct, and EVERY one of them is
# a split name (no "A FUNCTION"-style false positive was found).  The callback
# still guards against short English words that could arise by accident.
SMALLCAPS_RE = re.compile(r"\b([A-Z]) ([A-Z]{2,}[A-Z-]*)")
SMALLCAPS_KEEP_APART = {
    "ALL", "AND", "THE", "NOT", "ONE", "TWO", "NEW", "OLD", "OUT", "USE", "SEE",
    "ADD", "SET", "GET", "PUT", "RUN", "END", "FOR", "ANY", "OUR", "ARE", "YOU",
}


def _join_smallcaps(m):
    head, tail = m.group(1), m.group(2)
    joined = head + tail
    if joined in SMALLCAPS_KEEP_APART:
        return m.group(0)
    # 'C' is also the math slot for '+', so a 3-char join starting with C is
    # ambiguous (O(V 2 C VE) is O(V^2 + VE), not "CVE"). Longer C-joins such as
    # C HILD / C HAIN are unambiguous and still join.
    if len(joined) <= 3 and head == "C":
        return m.group(0)
    # A hyphenated name or a name of 4+ letters is certainly a name; a bare
    # 3-letter joiner is accepted too (measured: K EY, S ET, M IN, M AX, P OP,
    # A UX, S UM, G AP, V EC, N PC are all real names).
    return joined


# function names that may legitimately follow a SPACE + '.'  ( " .mod p/" = (mod p) )
MATH_FUNCS = {
    "mod", "lg", "ln", "log", "max", "min", "gcd", "exp", "degree", "pow",
    "det", "rank", "lim", "sup", "inf", "arg", "poly", "sin", "cos", "tan",
}


def _resolve_fffd(txt):
    """`�` (U+FFFD) is ambiguous: `]` when it closes an open `[`, else `Ω`.
    Resolution uses a bracket-depth stack (per page text)."""
    out = []
    depth = 0
    for ch in txt:
        if ch == "[":
            depth += 1
            out.append(ch)
        elif ch == "�":
            if depth > 0:
                out.append("]")
                depth -= 1
            else:
                out.append("Ω")  # unmatched -> asymptotic Omega
        else:
            out.append(ch)
    return "".join(out)


# Words that end in '.' in ordinary prose.  Their '.' is a full stop, never a
# math paren.  Deliberately EXCLUDES single letters f/g/h/n/o/x/... and w, c, b,
# d, T, O because those are math variables (f.n/, c.u;v/, w.p/, b.kI n;p/).
ABBREV_WORDS = {
    "fig", "figure", "figs", "figures", "no", "eq", "eqs", "ch", "chs",
    "sec", "secs", "ex", "exs", "cf", "vs", "al", "etc", "approx", "resp",
    "vol", "ed", "eds", "inc", "ltd", "dr", "prof", "st", "nd", "rd", "th",
    "chap", "app", "ref", "refs", "max", "min", "iff",
}

# i.e. / e.g.  -> a Latin abbreviation, not f(n).  Lowercase ONLY: `O.g.` is
# math (O(g(..))) and must not be swallowed by this test.
ABBREV_PAIR_RE = re.compile(r"^[a-z]\.[a-z][.,]")

BRACKET_RANGE_RE = re.compile(r"\[([^\[\]]*?) W ([^\[\]]*?)\]")
BRACKET_PLUS_RE = re.compile(r"\[([^\[\]]*?) C ([^\[\]]*?)\]")
BAR_PAIR_RE = re.compile(r"j\s*([A-Za-z0-9])\s*j")
EMDASH_RE = re.compile(r"([A-Za-z])4([A-Za-z])")
# sqrt: 'p' means √ ONLY as a standalone token whose radicand is a single
# symbol.  Measured: the looser form fired on the small-caps 'P' of "P rocedure",
# on "p equals", "of p and r" -- i.e. on ordinary prose.  Requiring
# (space|newline) before and a 1-char radicand followed by a non-alnum leaves the
# genuine √n / √2 table entries and nothing else.
SQRT_RE = re.compile(r"(?<=[ \n])p[ \t]+([0-9A-Za-zπ])(?![A-Za-z0-9])")
PSEUDO_LINE_RE = re.compile(r"^\s*\d+\s")

# quotes, all three orientations the book actually uses:
#   <phrase=   (with a left angle bracket)
#   =phrase=   (bare, e.g. "=task-parallel=")
#   =<phrase>= (both)
QUOTE_BOTH_RE = re.compile(r"=<([^<>\"\n]{1,60})>=")
QUOTE_OPEN_RE = re.compile(r"<([^=<>\"\n]{1,80}?)=")
QUOTE_EQ_RE = re.compile(r"(?<![\w=])=([A-Za-z][A-Za-z0-9 ,.'\-]{0,60})=")

# ceil/floor: d X = Y e  ->  ⌈X/Y⌉   ;   b X = Y c  ->  ⌊X/Y⌋
# Runs AFTER the paren matcher, so the operand may already contain real parens
# (b.p C r/=2c -> b(p + r)=2c -> ⌊(p + r)/2⌋).
CEIL_RE = re.compile(r"(?<![A-Za-z0-9])d([A-Za-z0-9() ]+)=([A-Za-z0-9() ]+?)e(?![A-Za-z0-9])")
FLOOR_RE = re.compile(r"(?<![A-Za-z0-9])b([A-Za-z0-9() ]+)=([A-Za-z0-9() ]+?)c(?![A-Za-z0-9])")

# division: alnum = alnum  ->  alnum / alnum.
# Two shapes, because superscripts come out with padding spaces (c 5 =2 is c_5/2)
# while a quotation's '=' is glued to a word (algorithm= was). Allowing a leading
# space only after a DIGIT or ')' keeps `c 5 =2` working without touching `=word=`.
DIVISION_RE = re.compile(r"(?<=[A-Za-z0-9)])=(?=[A-Za-z0-9(])")
DIVISION_SP_RE = re.compile(r"(?<=[0-9)])[ \t]+=(?=[A-Za-z0-9(])")

MAX_MATH_SPAN = 60


def _resolve_math_parens(txt):
    """Turn the paired `.` / `/` delimiter encoding into real `(` / `)`.

    The two glyphs are the *same* font slot pair, so they can nest arbitrarily
    (`‚.g.n//` is `Θ(g(n))`).  We therefore run a stack over the text and only
    rewrite positions that actually got matched -- an unmatched '.' stays a
    period and an unmatched '/' stays a slash.  That single property is what
    keeps ordinary prose (abbreviations, decimals, section numbers) intact.
    """
    txt = list(txt)
    stack = []
    pairs = []
    n = len(txt)

    for i, ch in enumerate(txt):
        if ch == "." and i + 1 < n and txt[i + 1].isalnum():
            prev = txt[i - 1] if i > 0 else ""
            ok_prev = prev.isalpha() or prev in "‚Ω"
            if not ok_prev and prev in " \n":
                # " .mod p/" is (mod p) -- a function name may follow a space.
                k = i + 1
                while k < n and txt[k].isalnum():
                    k += 1
                ok_prev = "".join(txt[i + 1:k]).lower() in MATH_FUNCS
            if not ok_prev:
                continue
            # preceding word must not be a prose abbreviation
            j = i - 1
            while j >= 0 and txt[j].isalpha():
                j -= 1
            if txt[j + 1:i] and "".join(txt[j + 1:i]).lower() in ABBREV_WORDS:
                continue
            # `i.e.` / `e.g.` shape -> not a function application
            if ABBREV_PAIR_RE.match("".join(txt[i - 1:i + 3])):
                continue
            stack.append(i)
        elif ch == "/" and stack:
            # Look at the last NON-BLANK char before the slash.  Superscripts are
            # extracted with padding spaces (O.n 3 / is O(n^3)), and nested closes
            # produce '//' (‚.g.n// is Θ(g(n))) -- both must still close a paren.
            k = i - 1
            while k >= 0 and txt[k] == " ":
                k -= 1
            prev = txt[k] if k >= 0 else ""
            if prev.isalnum() or prev in ")}]/":
                dot = stack.pop()
                if i - dot <= MAX_MATH_SPAN:
                    pairs.append((dot, i))

    for dot, slash in pairs:
        txt[dot] = "("
        txt[slash] = ")"
    return "".join(txt)


def repair_text(txt):
    # --- 2a. rejoin small-caps name splits FIRST, so later rules see clean
    #         procedure names (MERGE.A;p;q/ -> MERGE(A;p;q)).
    #         Looped: a name can be split more than once and the first match
    #         consumes the start of the next one (T REE-I NSERT -> TREE-I NSERT
    #         -> TREE-INSERT). ---
    for _ in range(4):
        joined = SMALLCAPS_RE.sub(_join_smallcaps, txt)
        if joined == txt:
            break
        txt = joined

    # --- 2b. direct glyph replacements (unambiguous) ---
    for ch, (rep, _why) in DIRECT.items():
        if ch in txt:
            txt = txt.replace(ch, rep)

    # --- 2b. resolve FFFD (needs '[' already present) ---
    txt = _resolve_fffd(txt)

    # --- 2c. nested '.' / '/' parenthesis pairs (stack-matched, see below) ---
    txt = _resolve_math_parens(txt)

    # --- 2d. ceil / floor delimiters (after the paren matcher, so their operand
    #         can already contain real parens; and before the division rule,
    #         which would otherwise eat the '=' inside them) ---
    txt = CEIL_RE.sub("⌈\\1/\\2⌉", txt)
    txt = FLOOR_RE.sub("⌊\\1/\\2⌋", txt)

    # --- 2e. remaining alnum '=' alnum is division ('=' is never equals here).
    #         Runs BEFORE the quote rules on purpose: a quotation's '=' always
    #         touches a space or punctuation (<algorithm=, problem.=), a
    #         division's '=' sits between alnums.  Doing the division first
    #         removes the ambiguous '=' before the quote regex can over-reach
    #         across a real less-than sign. ---
    txt = DIVISION_RE.sub("/", txt)
    txt = DIVISION_SP_RE.sub("/", txt)

    # --- 2f. quoted phrases, all three orientations ('=' doubles as the quote mark) ---
    txt = QUOTE_BOTH_RE.sub(r'"\1"', txt)
    txt = QUOTE_OPEN_RE.sub(r'"\1"', txt)
    txt = QUOTE_EQ_RE.sub(r'"\1"', txt)

    # --- 2g. 'W' as range '..' ONLY inside a bracket region ---
    txt = BRACKET_RANGE_RE.sub(r"[\1 .. \2]", txt)
    # --- 2h. 'C' as '+' ONLY inside a bracket region (array index arithmetic) ---
    txt = BRACKET_PLUS_RE.sub(r"[\1 + \2]", txt)

    # --- 2i. 'j' as absolute-value / cardinality bar, only as a jXj pair ---
    txt = BAR_PAIR_RE.sub(r"|\1|", txt)

    # --- 2j. '4' as em-dash, only between two letters (digit would never sit
    #         between two Latin letters) ---
    txt = EMDASH_RE.sub(r"\1—\2", txt)

    # --- 2k. 'p' as square-root, only when it is a standalone token followed by
    #         a radicand (digit / variable / π). Never touches in-word 'p'. ---
    txt = SQRT_RE.sub(r"√\1", txt)

    return txt


def repair_d_assignment(txt):
    """` D ` is overloaded: assignment arrow '←' inside pseudocode lines,
    equals '=' everywhere else.  Pseudocode lines are detected by a leading
    line number (CLRS numbers every pseudocode line).  'Data/Description/...'
    are safe because there the 'D' is followed by a letter, not a space."""
    out_lines = []
    for line in txt.split("\n"):
        if PSEUDO_LINE_RE.match(line):
            line = line.replace(" D ", " ← ")
        else:
            line = line.replace(" D ", " = ")
        out_lines.append(line)
    return "\n".join(out_lines)


# ---------------------------------------------------------------------------
# 3. driver
# ---------------------------------------------------------------------------
def main():
    before = Counter()
    after = Counter()
    n_pages = 0
    with open(PAGES_IN, encoding="utf-8") as fin, \
         open(PAGES_OUT, "w", encoding="utf-8") as fout:
        for line in fin:
            line = line.rstrip("\n")
            if not line:
                continue
            rec = json.loads(line)
            t0 = rec["text"]
            t1 = repair_text(t0)
            t1 = repair_d_assignment(t1)
            rec["text"] = t1
            fout.write(json.dumps(rec, ensure_ascii=False) + "\n")
            n_pages += 1
            for ch in t0:
                if ord(ch) > 126:
                    before[ch] += 1
            for ch in t1:
                if ord(ch) > 126:
                    after[ch] += 1

    # ---- build report ----
    def describe(ch):
        o = ord(ch)
        name = ch if o < 0x10000 and ch.isprintable() else ("U+%04X" % o)
        return name

    before_list = [(describe(c), c, n) for c, n in before.most_common()]
    after_list = {c: n for c, n in after.items()}

    # residual notes for glyphs that remain (legit or deliberately left)
    residual_notes = {
        "’": "U+2019 right single quote / apostrophe — already correct, kept.",
        "“": "U+201C left double quote — already correct, kept.",
        "–": "U+2013 en dash — correct, kept.",
        "—": "U+2014 em dash — correct, kept.",
        "…": "U+2026 ellipsis — correct, kept.",
        "∞": "U+221E infinity — correct, kept.",
        "≤": "U+2264 already-correct less-or-equal (not the broken Sinhala slot).",
        "Θ": "U+0398 already-correct Theta (a few pages had a valid ToUnicode).",
        "∩": "U+2229 set intersection — correct, kept.",
        "×": "U+00D7 multiplication sign — correct, kept.",
        "·": "U+00B7 middle dot — correct, kept.",
        "´": "U+00B4 acute accent — math/diacritic, left as-is (legit Unicode).",
        "¨": "U+00A8 diaeresis — diacritic, left as-is.",
        "˜": "U+02DC small tilde — diacritic, left as-is.",
        "ˆ": "U+02C6 circumflex — diacritic, left as-is.",
        "˛": "U+02DB ogonek — diacritic, left as-is.",
        "ˇ": "U+02C7 caron — diacritic, left as-is.",
        "˚": "U+02DA ring — diacritic, left as-is.",
        "˙": "U+02D9 dot — diacritic, left as-is.",
        "¸": "U+00B8 cedilla — diacritic, left as-is.",
        "˝": "U+02DD double acute — diacritic, left as-is.",
        "˘": "U+02D8 breve — diacritic, left as-is.",
        "ð": "U+00F0 — display-math brace delimiter, left unresolved (font-dependent).",
        "ï": "U+00EF — display-math delimiter, left unresolved (font-dependent).",
        "î": "U+00EE — display-math delimiter, left unresolved (font-dependent).",
        "í": "U+00ED — display-math delimiter, left unresolved (font-dependent).",
        "Ï": "U+00CF — mapped to ']' (matrix bracket); occasionally a tall paren close.",
        "Î": "U+00CE — mapped to '[' (matrix bracket).",
        "Í": "U+00CD — mapped to ']' (matrix bracket / tall paren close).",
        "Û": "U+00DB — mapped to '⌊' (floor).",
        "µ": "U+00B5 mu — Greek mu, left as-is (legit).",
        "³": "U+00B3 superscript 3 — left as-is (legit).",
    }

    report = {
        "source": PAGES_IN,
        "output": PAGES_OUT,
        "pages_processed": n_pages,
        "direct_replacements": [
            {"glyph": describe(k), "codepoint": "U+%04X" % ord(k),
             "replacement": v[0], "rationale": v[1]}
            for k, v in DIRECT.items()
        ],
        "context_rules": [
            {"rule": "_resolve_fffd stack", "target": "� (U+FFFD)",
             "rationale": "Ambiguous between ']' and 'Ω'; emits ']' iff an open '[' is pending, else 'Ω'."},
            {"rule": "QUOTE_BOTH_RE / QUOTE_OPEN_RE", "target": "= and <",
             "rationale": "Measured: '=' adjacent to a word is a quote mark in both orientations "
                          "(<phrase= and =phrase=, 681 hits). Applied before the division rule so "
                          "phrase quotes are never turned into '/'."},
            {"rule": "CEIL_RE / FLOOR_RE", "target": "d..e and b..c",
             "rationale": "Only 'dX=Ye' is ⌈X/Y⌉ and 'bX=Yc' is ⌊X/Y⌋ (dn=2e, bn=2c). Anchored with "
                          "non-alnum lookarounds so the letters b/c/d/e as variables are untouched."},
            {"rule": "_resolve_math_parens (stack)", "target": ". and /",
             "rationale": "'.' before alnum = '(' and '/' after alnum = ')'. They NEST, so a stack "
                          "match is required; only matched positions are rewritten, which is what "
                          "protects decimals (0.5), section numbers (4.1) and abbreviations (i.e.)."},
            {"rule": "DIVISION_RE", "target": "=",
             "rationale": "Measured: ASCII '=' is NEVER equals here ('D' is). Between alnum it is "
                          "division (n=2 -> n/2, 1=100 -> 1/100)."},
            {"rule": "BRACKET_RANGE_RE", "target": "W",
             "rationale": "Only ' W ' inside [..] is the range '..'; real W (We/What) and 'such that' W are untouched."},
            {"rule": "BRACKET_PLUS_RE", "target": "C",
             "rationale": "Only ' C ' inside [..] is '+'; C is otherwise the letter C (Computer/Cormen)."},
            {"rule": "BAR_PAIR_RE", "target": "j",
             "rationale": "Only j<token>j is a |bar|; j as pseudocode variable (A[j]) or English letter (just) is untouched."},
            {"rule": "EMDASH_RE", "target": "4",
             "rationale": "Only 4 between two Latin letters is an em-dash (engineering—such); 4 is otherwise a digit."},
            {"rule": "SQRT_RE", "target": "p",
             "rationale": "Only standalone p followed by a radicand is √; p is otherwise a normal letter."},
            {"rule": "repair_d_assignment", "target": "D",
             "rationale": " D  with a leading line number is the assignment arrow ←; elsewhere it is = (e.g. n = 0). 'Data' etc. safe (no trailing space)."},
        ],
        "before_counts": [{"glyph": g, "codepoint": "U+%04X" % ord(c), "count": n}
                          for g, c, n in before_list],
        "after_counts": {describe(c): n for c, n in after.items()},
        "remaining_glyphs": [
            {"glyph": describe(c), "codepoint": "U+%04X" % ord(c), "count": n,
             "note": residual_notes.get(describe(c),
                     residual_notes.get(c, "left as-is (legit Unicode or unresolvable display-math delimiter)"))}
            for c, n in after.most_common()
        ],
    }
    with open(REPORT_OUT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("pages processed:", n_pages)
    print("wrote:", PAGES_OUT)
    print("wrote:", REPORT_OUT)
    print("top remaining non-ascii (after):")
    for c, n in after.most_common(25):
        print("  %s U+%04X  %d" % (describe(c), ord(c), n))


if __name__ == "__main__":
    main()
