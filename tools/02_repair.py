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
from collections import Counter, defaultdict

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
    # U+E002 / U+E003 are BOTH the minus sign of the 4th-edition math font.
    # Verified against the rendered pages (p18/p19 INSERTION-SORT, p36 MERGE):
    # "j E003 1" is j = j - 1, "q E003 p C 1" is q - p + 1, "n E002 1" is n - 1.
    # U+E002 additionally serves as a TALL display parenthesis in ~81 places
    # (height 3.7x the run size, always paired with U+00CD) - those are listed
    # as hotspots in repair_report.json and read from the page image instead.
    "\uE002": ("−", "U+E002 minus sign − (n−1, a_{n−1}, Σ_{i=0}^{n−1}); ~7% are tall display parens, see hotspots"),
    "\uE003": ("−", "U+E003 minus sign − (i−1, q−p+1)"),
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
# "INSERTION -SORT" / "MAX-HEAP-INCREASE -\nKEY" -> join at the hyphen.
# Requiring >=3 capitals before the gap keeps "A - B" style arithmetic intact
# (the corpus has none, but the rule should not depend on that).
SMALLCAPS_HYPHEN_RE = re.compile(r"(?<=[A-Z]{3})[ \t]+-[ \t\n]*(?=[A-Z])")
# Small-caps *lowercase* artifacts: the book prints "procedure" / "problem" /
# "point" with a small-cap P, which extracts as "p rocedure" etc.  Measured:
# exactly 6 occurrences in the whole book (3 + 2 + 1), and every other
# `<letter> <word>` bigram is genuine English ("a given", "a vertex", ...), so
# the rule is an exact whitelist -- no pattern generalization.
SMALLCAPS_LOWER = {
    "p rocedure": "procedure",
    "p roblem": "problem",
    "p oint": "point",
}
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
    # measured extras: these follow ' .' in the book and are always math
    "key", "depth", "root", "size", "value", "cost", "length",
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

# The Latin abbreviations are exactly two: "i.e." and "e.g.".  Measured over the
# whole book, the shape `<lowercase>.<lowercase>[.,]` occurs 40 times and the
# other 14 are all math function applications -- `o.g.` / `o.f.` / `o.h.` are
# o(g(n)) / o(f(n)) / o(h(n)), `f.g.` is f(g(..)), `f.f.` is f(f(..)).  A
# lowercase-only test is therefore not enough (little-oh is lowercase!); the
# whitelist below is what actually separates prose from notation.
ABBREV_PAIR_RE = re.compile(r"^(?:i\.e|e\.g)[.,]")

# --- subarray slice: the 4th edition writes A[p : q] with a COLON, not the
#     3rd edition's A[p .. q].  Confirmed on the rendered pages 18/19/36
#     (`A[1 : i - 1]`, `A[p : q]`).  'W' is the math font's colon slot and occurs
#     ONLY inside brackets in this book -- every non-bracket 'W' sampled was the
#     ordinary letter W ("We", "What", "Warning").
BRACKET_SLICE_RE = re.compile(r"\[([^\[\]]*?) W ([^\[\]]*?)\]")

# --- plus: 'C' is the math font's '+' slot.  Measured 2099 ' C ' occurrences,
#     of which the token on the right is always a single letter/number in real
#     math (`n C 1`, `A[j C 1]`, `c 1 C c 2`, `1000 C 4`).  Prose hits all have
#     a longer word on one side (`a C program`, `Appendix C Counting`,
#     `array C after`, `clause C j`), so the rule below requires a short token on
#     the left and a single letter / short number on the right, and additionally
#     rejects a denylist of English words that pass the shape test by accident.
# The left operand is a 1-3 char token, a 4-6 digit number, or a closing
# delimiter; the right operand is a single letter, a <=4-digit number, or a math
# symbol (an opening paren, or the ellipsis bullet of "a0 + a1x + ... + anx n").
_C_LEFT = (r"(?:(?<![A-Za-z0-9])[A-Za-z0-9]{1,3}"
           r"|(?<![A-Za-z0-9])[0-9]{1,4}[A-Za-z]"
           r"|(?<![0-9])[0-9]{4,6}"
           r"|[\)\]\}•])")
_C_RIGHT = r"(?:[A-Za-z]|[0-9]{1,4}[A-Za-z]?|[\(•ΘΩ√≤≥≠⌈⌊])"
# The space before the RIGHT operand is optional: the raw corpus contains
# "lg n Cc 1 n" (= lg n + c_1 n, page 44) where the '+' slot is glued to its
# right operand.  English words cannot slip through: for "…a Computer…", the
# right operand 'o' is followed by 'm', so the (?![A-Za-z0-9]) guard rejects.
C_PLUS_RE = re.compile(r"(" + _C_LEFT + r")[ \t]+C[ \t]*(" + _C_RIGHT + r")(?![A-Za-z0-9])")
# glued form: alnum/paren + C + lowercase-letter-or-digit, nothing spaced.
# (?<!Mac) protects the one measured false positive, the name "MacCormick".
C_PLUS_GLUED_RE = re.compile(r"(?<!Mac)(?<=[A-Za-z0-9)\]])C(?=[a-z0-9])")
C_PLUS_DENY = {
    "the", "and", "for", "let", "not", "are", "has", "had", "was", "its", "our",
    "any", "all", "one", "two", "new", "old", "use", "see", "out", "add", "get",
    "put", "run", "end", "may", "can", "but", "you", "who", "why", "how", "now",
    "far", "top", "mid", "time", "rank", "size", "freq", "cost", "most", "low",
    "high", "left", "right", "head", "tail", "this", "that", "then", "with",
    "from", "into", "than", "have", "were", "here", "there", "be", "is", "of",
    "to", "in", "on", "as", "at", "by", "or", "if", "it", "we", "no", "so",
    "an", "am", "as", "is", "us", "do", "go",
}
# --- ellipsis: the math font sets '…' as three colon glyphs.  Measured on the
#     raw corpus: ':::' occurs 895 times and '::' occurs exactly 895 times, i.e.
#     every '::' in the book is part of a ':::', and there is no '::::'.  The
#     ';' that follows it in "a1 ;a2 ;:::;an" is the list comma (see SEMI_RE).
ELLIPSIS_RE = re.compile(re.escape(":::"))

# --- quoted colon: page 23 (verified on the rendered image) reads
#       The notation ":" denotes a subarray.
#     which extracts as `The notation <W= denotes a subarray.`  The quote
#     delimiters < and = wrap the colon glyph W, so this must run BEFORE the
#     quote rules -- otherwise it becomes a literal "W".
QUOTED_COLON_RE = re.compile(r"<W=")

# --- angle brackets: `hat 1 ;a2 i` is '⟨a1, a2⟩'.  'h' and 'i' are ordinary
#     letters almost everywhere (836 standalone 'h', 4900 standalone 'i'), so
#     the rule is deliberately narrow: the span must contain a ',' (i.e. an
#     original ';' or ':::') and every token inside must be a short math token
#     that is not an English word.  See _angle() for the token test.
ANGLE_RE = re.compile(r"(?<![A-Za-z])h([^h]{1,70}?)[ \t]i(?![A-Za-z0-9])")

# --- list / argument separator: the math font's ',' is ';'.  A real English
#     semicolon is always followed by a space ("Computer Science; the MIT ..."),
#     so a ';' glued to the next character is unambiguously a comma in this book
#     (measured: u;v 636, 1;2 307, V;E 262, i;j 199, 2;: 233 ...).
SEMI_RE = re.compile(r";(?=\S)")

# --- en dash inside numeric ranges: the math font's '–' slot extracts as the
#     ASCII digit '3'.  "lines 6–7" arrives as `lines 637`, "1–3 and 8–10" as
#     `133 and 8310`, "pages 72–73" as `72373` (measured 380 hits, printed
#     pages 20..137+ spot-verified against the rendered pages).  The rule is
#     anchored to range nouns; greedy backtracking splits at the ONLY '3', so
#     `lines 138` -> 1–8 (verified on the Figure 2.2 caption) and
#     `lines 12318` -> 12–18.  Singular `page` is deliberately EXCLUDED:
#     printed page 27 really says "on page 934" (a plain page number, verified
#     on the rendered image), so singular page references must stay intact.
RANGE_ANCHOR = (r"(?:lines?|Lines?|Steps?|steps?|pages|Pages|Sections?|sections?|"
                r"Chapters?|chapters?|Exercises?|exercises?|Problems?|problems?|"
                r"Figures?|figures?|Tables?|tables?|Parts?|parts?)")
RANGE_DASH_RE = re.compile(
    r"\b(" + RANGE_ANCHOR + r")[ \t]+(\d{1,3})3(\d{1,2})\b")

# Range LISTS: "lines 12–18, 20–23, and 24–27" extracts with the anchor only on
# the FIRST item ("lines 12318, 20323, and 24327"), so the anchored rule above
# fixes item 1 and leaves `20323`/`24327` behind.  This rule extends a converted
# first item across its ", ..."/"and ..." tail; each tail item is split by the
# same shape test, so digits that legitimately contain 3 ("20–23") survive.
RANGE_LIST_RE = re.compile(
    r"\b(" + RANGE_ANCHOR + r")((?:[ \t]+\d{1,3}3\d{1,2})+)"
    r"((?:[ \t]*(?:,|and|, and)[ \t]*\d{1,3}3\d{1,2})+)")


def _range_split(s):
    return re.sub(r"(\d{1,3})3(\d{1,2})", r"\1–\2", s)


def _range_list(m):
    return m.group(1) + _range_split(m.group(2)) + _range_split(m.group(3))

BAR_PAIR_RE = re.compile(r"j\s*(?!D)([A-Za-z0-9])\s*j")
EMDASH_RE = re.compile(r"([A-Za-z])4([A-Za-z])")
# U+E011 is the norm bar.  Each ‖ prints as TWO adjacent glyph runs, so the pair
# (not the single) is the delimiter: confirm on printed page 1029, where
# "Phi(t) = (1/2) |x^(t) - x*|^2" uses one glyph pair per side.  Verified against
# the rendered page image.
NORM_PAIR_RE = re.compile("\ue011[ \t]*\ue011")
# sqrt: 'p' means √ ONLY as a standalone token whose radicand is a single
# symbol.  Measured: the looser form fired on the small-caps 'P' of "P rocedure",
# on "p equals", "of p and r" -- i.e. on ordinary prose.  Requiring
# (space|newline) before and a 1-char radicand followed by a non-alnum leaves the
# genuine √n / √2 table entries and nothing else.
# 'C' is excluded because C is the math slot for '+': "q  p C 1" is q − p + 1,
# and turning it into "q √C 1" corrupted the MERGE pseudocode.
SQRT_RE = re.compile(r"(?<=[ \n])p[ \t]+([0-9ABD-Za-zπ])(?![A-Za-z0-9])")
PSEUDO_LINE_RE = re.compile(r"^\s*\d+\s")

# quotes, all three orientations the book actually uses:
#   <phrase=   (with a left angle bracket)
#   =phrase=   (bare, e.g. "=task-parallel=")
#   =<phrase>= (both)
QUOTE_BOTH_RE = re.compile(r"=<([^<>\"\n]{1,60})>=")
QUOTE_OPEN_RE = re.compile(r"<([^=<>\"\n]{1,80}?)=")
QUOTE_EQ_RE = re.compile(r"(?<![\w=])=([A-Za-z][A-Za-z0-9 ,.'\-]{0,60})=")

# ceil/floor: d X = Y e  ->  ⌈X/Y⌉   ;   b X = Y c  ->  ⌊X/Y⌋
# Runs AFTER the paren matcher and AFTER the '+' rule, so the operand may already
# contain real parens and signs (b.p C r/=2c -> b(p + r)/2c -> ⌊(p + r)/2⌋).
CEIL_RE = re.compile(r"(?<![A-Za-z0-9])d([A-Za-z0-9() +−]+)=([A-Za-z0-9() +−]+?)e(?![A-Za-z0-9])")
FLOOR_RE = re.compile(r"(?<![A-Za-z0-9])b([A-Za-z0-9() +−]+)=([A-Za-z0-9() +−]+?)c(?![A-Za-z0-9])")

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
            if not ok_prev and (prev in " \n" or i == 0):
                # " .n 1/" is (n - 1) and " .mod p/" is (mod p).  Measured over
                # the whole book: after a space the '.' is followed by one of
                # only 63 distinct tokens and every one of them is math (a
                # single-letter variable, or mod/lg/ln/log/degree).  English
                # prose never puts a period immediately before a letter.
                k = i + 1
                while k < n and txt[k].isalnum():
                    k += 1
                word = "".join(txt[i + 1:k])
                ok_prev = (len(word) == 1 and word.isalpha()) or word.lower() in MATH_FUNCS
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


def _c_plus(m):
    """'C' -> '+' unless the left token is an English word that slipped through."""
    if m.group(1).lower() in C_PLUS_DENY:
        return m.group(0)
    return "%s + %s" % (m.group(1), m.group(2))


def _angle(m):
    """`h<list> i` -> `⟨<list>⟩`, but only when the span really is a tuple.

    'h' and 'i' are ordinary letters (836 standalone 'h', 4900 standalone 'i'),
    so five guards must all hold.  Each one was chosen from an actual false
    positive found while auditing every hit:

      - the span contains a list separator (';'/':::'/'…');
      - the span has no '.' or '/' -- those are the math parentheses, and a tuple
        never contains parens.  This kills `h.k;i/` (= `h(k,i)`) and
        `h 1 .k/ C i` (= `h1(k)+…`);
      - the first token is 1-2 characters, or starts with a non-letter.  This
        kills `have i`, `have |F i`, `have |E Œn i` (first token `ave`);
      - every token is at most 3 characters (math tokens: a, 1, an, 26, n2);
      - no token is an ordinary English word (the 2-3 letter words that could
        still slip through: `as`, `old`, `low`, `one`, ...).
    """
    body = m.group(1)
    if ";" not in body and "…" not in body and "," not in body:
        return m.group(0)
    if "." in body or "/" in body or "(" in body or ")" in body:
        return m.group(0)
    parts = [p for p in re.split(r"[;,\s]+", body) if p]
    if not parts:
        return m.group(0)
    head = parts[0]
    if len(head) > 2 and head[:1].isalpha():
        return m.group(0)
    for p in parts:
        if len(p) > 3:
            return m.group(0)
        if p.lower() in C_PLUS_DENY:
            return m.group(0)
    return "⟨" + body.strip() + "⟩"


# ---------------------------------------------------------------------------
# 词内空格伪影：`cha racterize` / `runn ing` / `exam ple` / `alg orithms`
#
# 成因是字体的字距：某些字母对被抽成带间距的文本段，词中间多出一个空格。
# 它**不是**断行造成的（同一行内就有）。
#
# 判定不依赖外部词典，用「语料自证 + 三个必要条件」。逐条都是被实测逼出来的：
#
#   ① words[a+b] >= 3  且  words[a+b] >= 3 * splits[(a,b)]
#      合并后的词必须真是本书的词，而且要比「拆开写」常见得多。
#      这一条就挡掉了 `based on`（basedon 不是词）。
#   ② len(follow[a]) <= 3
#      真词后面会跟很多不同的词（`the` 跟上百个词搭配），破损片段只会跟着它
#      那半截（`cha` 只跟 `racterize`）。这一条挡掉了 `the re`（there）、
#      `are as`（areas）、`key word`（keyword）、`with in`（within）。
#   ③ 右片段不得是虚词（FUNCTION_WORDS），除非它在 SPLIT_WHITELIST 里
#      挡掉 `pay off`（off 是虚词，pay off 本就是合法短语）、`speed up`、
#      `fix up`；而 `chap ter`（ter 不是词）、`con text`（text 是实词）、
#      `sub array`（array 是实词）照常合并。白名单里那 22 条是实测确认的
#      真破损（functi on、inserti on、beg in、squ are …），右片段虽是虚词，
#      但左片段确实不是词。
#   ④ 左片段必须从词首开始（词边界）
#      TOK 正则没有 lookbehind，会把词中间切开（`c hapter` -> `hap ter`），
#      于是 `hapter` 被当成真词而误并。
#
# 判定必须**逐个空格**考察左右两侧的完整小写词，不能写成正则替换：正则会先把
# 前一个词一起吃掉（`the runn ing` 里的 `the runn` 先命中且被拒，`runn ing`
# 就再也轮不到）。
#
# 实测（在**未修复的原始语料**上）：命中 929 处 / 761 种形状，31 条关键
# 用例（该合并的 16 条 + 不该动的 15 条）全部正确，无一是两个真词被误拼。
# ★ 审计必须在 data/pages.jsonl（原文）上做：修复后的文本里伪影已消失，
#   拿它当依据会得出完全错误的结论（这一条踩过）。
# ---------------------------------------------------------------------------
TOKEN_RE = re.compile(r"(?<![A-Za-z])([A-Za-z]{3,})(?![A-Za-z])")
PAIR_RE = re.compile(r"(?<![A-Za-z])([a-z]{3,}) ([a-z]{2,10})(?![a-z])")
_TWO_WORDS_RE = re.compile(r"([a-z]+) ([a-z]+)")

# 右片段若是这些虚词，说明多半是「真词 + 虚词」的合法短语，不合并
FUNCTION_WORDS = set("""
a an the this that these those and or but not no so if then than when where while
of to in on at by for with from into onto over under out up down off about as is are
was were be been being it its he she they we you i do does did has have had can could
will would shall should may might must one two all any each every other more most
less least same
""".split())

# 右片段是虚词、但实测确认左片段不是词的真破损（逐条在原始语料里核对过）。
# 其余“真词 + 虚词”的组合一律不合并，例如 pay off / speed up / fix up。
SPLIT_WHITELIST = {
    ("functi", "on"), ("inserti", "on"), ("beg", "in"), ("obta", "in"),
    ("squ", "are"), ("cac", "he"), ("boole", "an"), ("somewh", "at"),
    ("notati", "on"), ("operati", "on"), ("approximati", "on"), ("automat", "on"),
    ("compositi", "on"), ("expansi", "on"), ("implementati", "on"),
    ("maximizati", "on"), ("parenthesizati", "on"), ("reas", "on"),
    ("restricti", "on"), ("situati", "on"), ("soluti", "on"), ("transformati", "on"),
}

_SPLIT_STATE = None


def build_split_state(texts):
    """从原始文本建三张表（语料自证）。

    texts: 可迭代的字符串集合（本仓库传的是**未修复**的逐页文本，与生产一致）。
    """
    words = Counter()
    splits = Counter()
    follow = defaultdict(set)
    for txt in texts:
        for m in TOKEN_RE.finditer(txt):
            words[m.group(1).lower()] += 1
        for m in PAIR_RE.finditer(txt):
            splits[(m.group(1), m.group(2))] += 1
            follow[m.group(1)].add(m.group(2))
    return {"words": words, "splits": splits, "follow": follow}


def _join_split_words(txt, state):
    """逐个空格考察；命中就合并，并把游标推过合并后的词。"""
    if not state:
        return txt
    words = state["words"]
    splits = state["splits"]
    follow = state["follow"]
    out = []
    i = 0
    while True:
        m = _TWO_WORDS_RE.search(txt, i)
        if not m:
            out.append(txt[i:])
            break
        a, b = m.group(1), m.group(2)
        # 词边界：左片段前面不能还是字母。TOK 正则没有 lookbehind，会把
        # 词中间切开（`c hapter` -> `hap ter`），于是 `hapter` 这种不存在的
        # 词被当成「合并后的真词」而误并。PAIR_RE 有 lookbehind，两边必须一致。
        if m.start() > 0 and txt[m.start() - 1].isalpha():
            # ★ 必须把跳过的片段写回输出，否则这段文本会被直接丢掉
            out.append(txt[i:m.start() + len(a) + 1])
            i = m.start() + len(a) + 1
            continue
        joined = a + b
        w = words.get(joined, 0)
        ok = (len(a) >= 3 and 2 <= len(b) <= 10
              and (b not in FUNCTION_WORDS or (a, b) in SPLIT_WHITELIST)
              and w >= 3 and w >= 3 * splits.get((a, b), 0)
              and len(follow.get(a, ())) <= 3)
        if ok:
            out.append(txt[i:m.start()])
            out.append(joined)
            i = m.end()
        else:
            out.append(txt[i:m.start() + len(a) + 1])
            i = m.start() + len(a) + 1
    return "".join(out)


def repair_text(txt, state=None):
    # --- 2a0. 词内空格伪影（cha racterize -> characterize）。放在最前面，让后面
    #          的规则看到完整的单词。state 为空时该规则不生效（单测可显式传入）。 ---
    txt = _join_split_words(txt, _SPLIT_STATE if state is None else state)

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

    # --- 2a'. the same fact applies to a hyphen inside a small-caps name: it
    #          arrives with a space in front of it ("INSERTION -SORT",
    #          "MAX-HEAP-INCREASE -KEY", "RANDOMIZED -QUICKSORT").  Measured on
    #          the raw corpus: 285 hits, 263 with no space after the hyphen and
    #          22 followed by a line break; zero "A - B" forms with spaces on
    #          both sides, so nothing in ordinary math or prose is at risk. ---
    txt = SMALLCAPS_HYPHEN_RE.sub("-", txt)

    # --- 2a''. small-caps lowercase words ("p rocedure") -- exact whitelist. ---
    for k, v in SMALLCAPS_LOWER.items():
        if k in txt:
            txt = txt.replace(k, v)

    # --- 2b. direct glyph replacements (unambiguous) ---
    for ch, (rep, _why) in DIRECT.items():
        if ch in txt:
            txt = txt.replace(ch, rep)

    # --- 2b. resolve FFFD (needs '[' already present) ---
    txt = _resolve_fffd(txt)

    # --- 2b'. ':::' is the math font's ellipsis '…' (895 hits = the whole '::'
    #          population).  Runs first so the tuple/list rules below can see it
    #          as a separator. ---
    txt = ELLIPSIS_RE.sub("…", txt)

    # --- 2b''. the quoted colon: `<W=` is `":"`  (printed page 23).  Must run
    #           before the quote rules, which would otherwise emit a literal W. ---
    txt = QUOTED_COLON_RE.sub('":"', txt)

    # --- 2b'''. angle-bracket tuples, guarded (see _angle). ---
    txt = ANGLE_RE.sub(_angle, txt)

    # --- 2b''''. ';' glued to the next character is the math comma. ---
    txt = SEMI_RE.sub(",", txt)

    # --- 2b'''''. en dash inside "lines 6–7" style ranges (the dash glyph
    #           extracts as '3'; see RANGE_DASH_RE).  The list form runs first
    #           so its tail items are not left half-converted. ---
    txt = RANGE_LIST_RE.sub(_range_list, txt)
    txt = RANGE_DASH_RE.sub(r"\1 \2–\3", txt)

    # --- 2c. nested '.' / '/' parenthesis pairs (stack-matched, see below) ---
    txt = _resolve_math_parens(txt)

    # --- 2d. 'C' as '+'.  Runs after the paren matcher so the operand on the
    #         right can already be a real ')' / '(' (O.n 2 / C ‚.n/ -> O(n^2) + Θ(n)).
    #         Looped, because two additions can be adjacent and the left operand of
    #         the second one is the right operand just consumed by the first
    #         (`AŒq C j C 1�` is q + j + 1, not q + j C 1). ---
    for _ in range(3):
        nxt = C_PLUS_RE.sub(_c_plus, txt)
        if nxt == txt:
            break
        txt = nxt

    # --- 2d'. 'C' as '+', GLUED form (no spaces at all).  Measured on the raw
    #          corpus: 243 hits -- nC1 (=n+1), mCn, blogbncC1, lgkC1, 2nC1 --
    #          every one a genuine addition; the single false positive is the
    #          author name "MacCormick", excluded via the (?<!Mac) guard.
    #          Runs after the spaced rule so operands may already be ')' / '('. ---
    txt = C_PLUS_GLUED_RE.sub(" + ", txt)

    # --- 2e. ceil / floor delimiters (after the paren matcher, so their operand
    #         can already contain real parens; and before the division rule,
    #         which would otherwise eat the '=' inside them) ---
    txt = CEIL_RE.sub("⌈\\1/\\2⌉", txt)
    txt = FLOOR_RE.sub("⌊\\1/\\2⌋", txt)

    # --- 2f. remaining alnum '=' alnum is division ('=' is never equals here).
    #         Runs BEFORE the quote rules on purpose: a quotation's '=' always
    #         touches a space or punctuation (<algorithm=, problem.=), a
    #         division's '=' sits between alnums.  Doing the division first
    #         removes the ambiguous '=' before the quote regex can over-reach
    #         across a real less-than sign. ---
    txt = DIVISION_RE.sub("/", txt)
    txt = DIVISION_SP_RE.sub("/", txt)

    # --- 2g. quoted phrases, all three orientations ('=' doubles as the quote mark) ---
    txt = QUOTE_BOTH_RE.sub(r'"\1"', txt)
    txt = QUOTE_OPEN_RE.sub(r'"\1"', txt)
    txt = QUOTE_EQ_RE.sub(r'"\1"', txt)

    # --- 2h. 'W' as the slice colon ':' ONLY inside a bracket region ---
    txt = BRACKET_SLICE_RE.sub(r"[\1 : \2]", txt)

    # --- 2i. 'j' as absolute-value / cardinality bar, only as a jXj pair ---
    txt = BAR_PAIR_RE.sub(r"|\1|", txt)

    # --- 2j. '4' as em-dash, only between two letters (digit would never sit
    #         between two Latin letters) ---
    txt = EMDASH_RE.sub(r"\1—\2", txt)

    # --- 2k. 'p' as square-root, only when it is a standalone token followed by
    #         a radicand (digit / variable / π). Never touches in-word 'p'. ---
    txt = SQRT_RE.sub(r"√\1", txt)

    # --- 2l. norm bars: the pair of U+E011 glyphs is one '‖' ---
    txt = NORM_PAIR_RE.sub("‖", txt)
    txt = txt.replace("\ue011", "‖")

    return txt


def repair_d_assignment(txt):
    """` D ` is the equals / assignment sign, ALWAYS.

    The 3rd edition drew assignment as an arrow; the 4th edition sets both
    assignment and comparison with a plain `=` (verified on the rendered pages
    18/19: `for i = 2 to n`, `key = A[i]`, `j = j - 1`).  So there is no
    pseudocode-vs-prose split any more -- every ` D ` becomes ` = `.
    'Data/Description/DOUBLE' are safe because there the D has no space after it.
    """
    return txt.replace(" D ", " = ")


# ---------------------------------------------------------------------------
# 3. driver
# ---------------------------------------------------------------------------
def main():
    before = Counter()
    after = Counter()
    n_pages = 0

    # 词内空格规则需要全书的词频（语料自证），所以先全量读一遍建表。
    # ★ 必须用**未修复**的原文建表：修复后的文本可能已经合并/改写过，
    #   拿它当依据就不再是「自证」了。
    global _SPLIT_STATE
    all_recs = []
    with open(PAGES_IN, encoding="utf-8") as fin:
        for line in fin:
            line = line.rstrip("\n")
            if line:
                all_recs.append(json.loads(line))
    _SPLIT_STATE = build_split_state(r["text"] for r in all_recs)

    with open(PAGES_OUT, "w", encoding="utf-8") as fout:
        for rec in all_recs:
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
            {"rule": "C_PLUS_RE", "target": "C",
             "rationale": "C is the math font's '+' slot (n C 1, A[j C 1], c 1 C c 2). Requires a 1-3 char token on "
                          "the left and a single letter / <=4-digit number on the right, plus an English-word "
                          "denylist, so prose like 'a C program' / 'Appendix C Counting' is untouched."},
            {"rule": "BRACKET_SLICE_RE", "target": "W",
             "rationale": "Only ' W ' inside [..] is the slice colon ':'. Measured: every non-bracket W in the "
                          "book is the ordinary letter (We/What/Warning). The 4th edition uses A[p : q]."},
            {"rule": "BAR_PAIR_RE", "target": "j",
             "rationale": "Only j<token>j is a |bar|; j as pseudocode variable (A[j]) or English letter (just) is untouched."},
            {"rule": "EMDASH_RE", "target": "4",
             "rationale": "Only 4 between two Latin letters is an em-dash (engineering—such); 4 is otherwise a digit."},
            {"rule": "SQRT_RE", "target": "p",
             "rationale": "Only standalone p followed by a radicand is √; p is otherwise a normal letter."},
            {"rule": "repair_d_assignment", "target": "D",
             "rationale": "' D ' is ALWAYS '='. The 4th edition sets assignment with a plain '=', so there is no "
                          "pseudocode/prose split. Verified on the rendered pages 18/19."},
            {"rule": "NORM_PAIR_RE", "target": "U+E011",
             "rationale": "A pair of U+E011 glyphs is one norm bar '‖' (Ch33 potential-function proof, printed "
                          "page 1029). Verified against the rendered page image."},
        ],
        "known_ambiguities": {
            "U+E002 tall display parens": (
                "E002 is minus 93% of the time; the remaining ~81 occurrences are opened display parentheses "
                "(glyph height 3.7x the run size, closed by U+00CD) and come out as '−'. They sit in display "
                "equations on ~40 pages; read those from the rendered page image."
            ),
        },
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
