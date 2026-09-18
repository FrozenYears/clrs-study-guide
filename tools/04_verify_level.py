#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""04_verify_level.py — 关卡合规检查器。

背景
====
本书 149 个关卡要由多个 agent 并行编写。只靠「人工看一眼」会漏掉五类真实发生过的错误，
本仓库在编写第 2 章三关时**每一类都真的踩过一次**：

  1. 杜撰引述     —— 早期 agent 凭记忆写的 Figure 2.4 示例数组是错的。
  2. 杜撰归属     —— 把自算的 Σt_i = 14 写成「正文表格给出」，原书 28–34 页根本没这个数。
  3. 页码错位     —— 2.1 关引用 p.30/31，那是 2.2 节的内容；不标 preview 就是误导。
  4. C 代码漂移   —— 关卡里内嵌一份 C 代码副本，与 c/*.c 是两份文件，会各自演化。
  5. 未注册/坏链接 —— 关卡文件写好但没进 chapter.js，或 url: '#/ch03/s01' 指向不存在的关。

本脚本把这些全部变成机器检查。它不是风格洁癖，是内容正确性的闸门。

用法
====
    node tools/dump_levels.mjs                 # 先把关卡数据导出成 JSON
    python tools/04_verify_level.py            # 再跑本检查器
    python tools/04_verify_level.py --strict   # 把 WARN 也当失败

退出码：有 ERROR 则 1，否则 0。
"""

import difflib
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

LEVELS_JSON = "tools/_levels.json"
PAGES_JSONL = "data/pages_fixed.jsonl"
STRUCTURE_JSON = "data/structure.json"
BLOCKS_DIR = "data/blocks"
C_DIR = "c"
ALGO_DIR = "site/assets/algorithms"
REGISTRY_JS = "site/assets/ui/registry.js"
CHAPTERS_JS = "site/assets/chapters.js"

STAGE_ORDER = [
    "map", "intuition", "source", "pseudocode",
    "visualize", "code", "analyze", "prove", "drill",
]

errors = []
warns = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warns.append(msg)


# ---------------------------------------------------------------------------
# 语料装载
# ---------------------------------------------------------------------------

_PAGES = None


def get_pages():
    """模块级懒加载：verify_quote / quote_hays 也要用语料，不必层层传参。"""
    global _PAGES
    if _PAGES is None:
        _PAGES = load_pages()
    return _PAGES


def load_pages():
    """printed_page -> 去掉页眉页脚后的正文。"""
    pages = {}
    if not os.path.exists(PAGES_JSONL):
        err("找不到 %s —— 请先跑 tools/02_repair.py" % PAGES_JSONL)
        return pages
    with open(PAGES_JSONL, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            rec = json.loads(line)
            pages[rec["printed_page"]] = strip_heads(rec["text"])
    return pages


# 页眉页脚剥离。★ 必须与 tools/03_segment.py 用同一套正则，且必须是**形状严格**
# 的那一套。这里曾用一条宽松的 `^(?:\d+ )?(?:Chapter|Part|Appendix)\s+\d+.*$`，
# 它会把正文整行删掉——`Chapter 4 presents the "master theorem," which shows
# that T(n) = Θ(n lg n).` 正好以 "Chapter 4 " 开头，于是该句从窗口里消失，
# 引述比对必然失败（真实踩过：s03 blocks[11]）。
_SEG = None


def _seg_module():
    global _SEG
    if _SEG is None:
        import importlib.util as _ilu
        _spec = _ilu.spec_from_file_location(
            "seg03", os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                  "03_segment.py"))
        _SEG = _ilu.module_from_spec(_spec)
        _spec.loader.exec_module(_SEG)
    return _SEG


def strip_heads(text):
    """按 03_segment.py 的 RUNHEAD_RES 逐行剥离页眉/孤立页码。"""
    res = _seg_module().RUNHEAD_RES
    return "\n".join(ln for ln in text.split("\n")
                     if not (ln.strip() and any(rx.match(ln.strip()) for rx in res)))


def norm(s):
    """折叠空白。只做这一件事——引述必须逐字一致，任何更宽松的归一化都会掩盖漂移。"""
    return re.sub(r"\s+", " ", s or "").strip()


# 引述比对专用归一化。语料的空格不是内容：PDF 抽取的字距伪影把 `a₁` 拆成
# `a 1`、把 `A[i : j]` 排出空格，这些无法（也不应该）在修复层强行归一。
# 因此比对时：下标/上标 Unicode 折成普通字符、各类横线折成 '-'、弯引号折直、
# 去掉全部空白。字母、数字、标点的存在性仍然严格——真正的漂移（改写、漏词、
# 记号用错）依然会被抓出来。
_SUBS = {c: str(i) for i, c in enumerate("₀₁₂₃₄₅₆₇₈₉")}
_SUB_LETTERS = {"ₙ": "n", "ₖ": "k", "ₘ": "m", "ᵢ": "i", "ⱼ": "j", "ₜ": "t"}
_SUPS = {c: str(i) for i, c in enumerate("⁰¹²³⁴⁵⁶⁷⁸⁹")}
_SUP_LETTERS = {"ⁿ": "n", "ᵏ": "k"}


def qnorm(s):
    s = (s or "")
    tbl = {ord(k): v for k, v in _SUBS.items()}
    tbl.update({ord(k): v for k, v in _SUB_LETTERS.items()})
    tbl.update({ord(k): v for k, v in _SUPS.items()})
    tbl.update({ord(k): v for k, v in _SUP_LETTERS.items()})
    tbl.update({
        0x2212: "-", 0x2013: "-", 0x2014: "-",   # 各种横线统一
        0x2018: "'", 0x2019: "'", 0x2032: "0",   # ★ prime（a′）在语料里被抽成 '0'
        0x201C: '"', 0x201D: '"',
        0x00A0: " ",
        # 省略号/点乘的字形在语料里形形色色（⋯ … · ⋅ ⫶ …），统一折成 '.'
        # 让子序列匹配去吸收个数差异（⋯ vs … vs ···）
        0x22EF: ".", 0x2026: ".", 0x00B7: ".", 0x22C5: ".", 0x2219: ".",
        0x22F1: ".", 0x2027: ".",
        # 语料把数学省略号排成三个列表圆点（"•••"，见 p17），而关卡写 ⋯/…；
        # • 不能再当版面元素删除，否则 needle 的 "." 在语料里找不到落点
        0x2022: ".",
    })
    s = s.translate(tbl)
    s = re.sub(r"\s+", "", s).lower()
    # 剩余的 '_' 是关卡侧的下标记法（t_i ↔ 语料的 "t i"），去掉后两边一致
    s = s.replace("_", "")
    # 连字符整体不参与比对：语料里跨页断词留下 "con-\nceptually"、脚注上标
    # 让 "6–7" 变成 "637"，逐字比对无法区分这些伪影与真连字符；而它们恰恰
    # 是全书最不可靠的字形。真正的漂移（改词、漏句、记号用错）由 shingle
    # 判据兜底。
    s = s.replace("-", "")
    # 省略号的「点数」是排版差异：语料把数学省略号排成 •••（3 个点），
    # 关卡写 ⋯（1 个点）。折叠连续点，让两种写法等价；正文里没有连续两个
    # 以上的句点，所以不会误伤。
    s = re.sub(r"\.{2,}", ".", s)
    return s


def shingle_score(needle, hay, k=8):
    """needle 的 k-shingle 在 hay 中的命中率。1.0 = 逐字（归一化后）。"""
    if len(needle) < k:
        return 1.0 if needle and needle in hay else 0.0
    hit = miss = 0
    for i in range(len(needle) - k + 1):
        if needle[i:i + k] in hay:
            hit += 1
        else:
            miss += 1
    return hit / (hit + miss)


# ---------------------------------------------------------------------------
# 引述比对（v3，2026-09-15 重写）。
#
# 干草堆不再用原始逐页文本，改用 tools/03_segment.py 的**分块正文**：
# 脚注、伪代码、图注、页眉已按类型剥离，段落也已跨页合并。一条忠实的引述
# 因此应当**逐字连续**出现 —— 容忍度可以收到极紧。
#
# 旧版用「带隙子序列 + 单段夹带 ≤800」判据。质量审计（docs/reports/Q1）实测：
# 插入一个词 / 插入短语 / 删一个词 / 相邻词对调 / 换形容词 / 换记号，六种篡改
# 全部 0 报错通过 —— 因为大预算的子序列匹配允许 needle 在整页里东拼西凑。
# 这一版改成四条路，**每一条都要求「连续」**：
#
#   1) 连续命中（qnorm 后逐字出现）           —— 绝大多数引述走这条
#   2) `…` 分段：每个片段各自连续、且按序出现  —— 引述里省略掉的跨段文字
#   3) 术语卡：每个原子（备选/括号内写法）连续  —— 术语卡不是连续原句
#   4) 极小夹带：单段 ≤2、总计 ≤4 字符         —— 行内残留的下标/字距伪影
#
# 实测（108 条引述）：89 条连续命中，其余由 2/3/4 覆盖，无一放宽。
# ---------------------------------------------------------------------------

PROSE_TYPES = {"body", "theorem", "lemma", "corollary", "definition",
               "example", "proof", "chapter-notes"}
OTHER_BLOCK_TYPES = {"pseudocode", "footnote", "figure-caption",
                     "exercise", "problem"}
GAP_RUN_MAX = 2      # 守卫：单段夹带上限（行内伪影只有 1–2 字符）
GAP_TOTAL_MAX = 4    # 守卫：总夹带上限（删掉一个 3 字母词就会超）

_blocks_cache = None


def _load_blocks():
    global _blocks_cache
    if _blocks_cache is None:
        _blocks_cache = {}
        for f in sorted(glob.glob(os.path.join(BLOCKS_DIR, "*.json"))):
            if os.path.basename(f) == "_index.json":
                continue
            d = json.load(open(f, encoding="utf-8"))
            _blocks_cache[str(d.get("chapter"))] = d.get("blocks", [])
    return _blocks_cache


def quote_hays(page):
    """声明页 ±1 的干草堆，按严格程度排序（正文块最先试）。

    页窗可能横跨两章（p49/50 就落在第 2 章习题页与第 3 章开头之间），
    所以遍历**所有**相交的章，任一干草堆命中即通过。
    """
    nums = page if isinstance(page, list) else [page]
    pgs = set()
    for p in nums:
        if isinstance(p, int):
            pgs |= {p - 1, p, p + 1}
    pdfs = {p + 21 for p in pgs}
    out, seen = [], set()
    blocks = _load_blocks()
    for key in sorted(blocks):
        bl = blocks[key]
        if not (pdfs & {b.get("pdf_page") for b in bl}):
            continue
        for types in (PROSE_TYPES, PROSE_TYPES | OTHER_BLOCK_TYPES):
            ks = [b for b in bl if b.get("pdf_page") in pdfs
                  and b.get("type") in types]
            ks.sort(key=lambda b: b.get("pdf_page", 0))
            hay = qnorm("\n".join(b.get("text", "") for b in ks))
            if hay and hay not in seen:
                seen.add(hay)
                out.append(hay)
    # 第三层：原始逐页文本。有的引述落在分段器没归类的版面缝隙里（如
    # 「Input:/Output:」小节头），这里兜底 —— 夹带预算与上面同样极紧。
    pages = get_pages()
    ordered = [p for p in sorted(pgs) if p in pages]
    for p in ordered:
        hay = qnorm(pages[p])
        if hay and hay not in seen:
            seen.add(hay)
            out.append(hay)
    # 第四层：把页窗里的原始文本**按阅读顺序拼接**。引述跨页时（上一页的段尾
    # 接下一页的段首），单页干草堆必然断开，这里补上整段视图 —— 夹带预算不变。
    if len(ordered) > 1:
        hay = qnorm("\n".join(pages[p] for p in ordered))
        if hay and hay not in seen:
            out.append(hay)
    return out


def _tiny_gap_ok(needle, hay):
    """带隙子序列，但夹带预算极小（单段 ≤2、总计 ≤4 字符）。

    只为行内伪影留口子：删掉一个 3 字母的词（如 not）就会超出单段上限。
    """
    if needle in hay:
        return True
    freq = {}
    for c in hay:
        freq[c] = freq.get(c, 0) + 1
    cand = [c for c in set(needle) if freq.get(c)]
    if not cand:
        return False
    best_char = min(cand, key=lambda c: freq[c])

    def greedy(chunk, text, start):
        j = i = 0
        runs = []
        run = 0
        L, N = len(chunk), len(text)
        while j < L and start + i < N:
            if text[start + i] == chunk[j]:
                if run:
                    runs.append(run)
                    if max(runs) > GAP_RUN_MAX or sum(runs) > GAP_TOTAL_MAX:
                        return None
                run = 0
                j += 1
            else:
                run += 1
                if run > GAP_RUN_MAX or sum(runs) + run > GAP_TOTAL_MAX:
                    return None
            i += 1
        if j < L:
            return None
        if run:
            runs.append(run)
            if max(runs) > GAP_RUN_MAX or sum(runs) > GAP_TOTAL_MAX:
                return None
        return True

    k = needle.find(best_char)
    for pos in [m.start() for m in re.finditer(re.escape(best_char), hay)]:
        if greedy(needle[k + 1:], hay, pos + 1) is None:
            continue
        if greedy(needle[:k][::-1], hay[:pos][::-1], 0) is None:
            continue
        return True
    return False


def ver_qnorm_contains(frag, hay):
    return qnorm(frag) in hay


def verify_quote(en, page, is_term=False):
    """引述溯源判据。返回 (ok, 诊断)。"""
    needle = qnorm(en)
    if not needle:
        return False, "引述归一化后为空"
    hays = quote_hays(page)
    if not hays:
        return False, ("声明页 %s 在分块语料里取不到任何正文 —— 页码很可能写错了"
                       % (page,))

    # 1) 连续命中
    for hay in hays:
        if needle in hay:
            return True, ""

    # 2) `…` 分段：每个片段都要逐字连续出现在页窗里。
    #    不强制片段之间的先后顺序 —— 作者可能按教学顺序重排引文（例如先给
    #    总结句再给定义句），只要每一段都是逐字原文，就没有杜撰空间。
    parts = [p for p in re.split(r"…|\.\.\.", en) if p.strip()]
    if len(parts) > 1:
        missing = [p for p in parts
                   if not any(ver_qnorm_contains(p, hay) for hay in hays)]
        if not missing:
            return True, ""
        return False, ("引述里标了省略号，但这些片段没有逐字连续出现：%r —— "
                       "请核对省略号的位置，或把该片段改回原书原文"
                       % ([m[:60] for m in missing],))

    # 3) 术语卡：不是连续原句，而是词表 / 备选写法。
    #    `A / B` 是两个备选；`X (Y)` 的括号里是同义的另一种写法。
    #    每个「原子」都必须**逐字连续**出现 —— 比旧版的词表存在性强得多。
    if is_term:
        alts = []
        for alt in re.split(r"/", en):
            alt = alt.strip()
            if not alt:
                continue
            if "(" in alt and ")" in alt:
                # `RAM model (random-access machine)`：外层与括号内是两种写法，
                # 各自都要成立；整串（含括号）反而不必连续。
                alts.append(re.sub(r"\s*\([^()]*\)", "", alt).strip())
                for grp in re.findall(r"\(([^()]*)\)", alt):
                    if grp.strip():
                        alts.append(grp.strip())
            else:
                alts.append(alt)
        alts = [a for a in alts if len(qnorm(a)) >= 3]
        if alts:
            missing = [a for a in alts if not any(qnorm(a) in hay for hay in hays)]
            if not missing:
                return True, ""
            return False, ("术语卡的这些写法在声明页附近都找不到逐字连续的出现：%r"
                           % (missing[:4],))

    # 4) 极小夹带（行内残留的下标/字距伪影）
    for hay in hays:
        if _tiny_gap_ok(needle, hay):
            return True, ""

    # 诊断：给出最接近的干草堆上的第一处分叉
    for hay in hays:
        i = hay.find(needle[:20])
        if i >= 0:
            n = 0
            while n < len(needle) and i + n < len(hay) and needle[n] == hay[i + n]:
                n += 1
            return False, ("逐字连续匹配失败：前 %d 个字符能对上，从 %r 起分叉；"
                           "语料该处是 %r。引述必须逐字照抄原书（要省略就用 … 标出）"
                           % (n, needle[max(0, n - 12):n + 18],
                              hay[i + max(0, n - 12):i + n + 34]))
    return False, ("引述开头 %r 在声明页附近的语料里完全找不到 —— 页码或内容必有一处错了"
                   % (needle[:24],))


def page_window(pages, spec):
    """把 `page: 30` 或 `page: [17, 18]` 展开成候选页集合。

    跨页引述要能匹配上，所以每页各取 ±1；非相邻的页码清单（如 [20, 38]，
    表示「这条引述横跨这两处」）取各自的邻域取并集，而不是把中间的 18 页全并进来。
    """
    if spec is None:
        return []
    vals = spec if isinstance(spec, list) else [spec]
    out = set()
    for v in vals:
        if isinstance(v, int):
            out.update((v - 1, v, v + 1))
    return sorted(p for p in out if p in pages)


def qwindow_text(pages, spec):
    """引述比对的干草堆。

    只有这一个入口，且**必须**用 qnorm——不要在旁边再放一个折叠空白的版本：
    曾同时存在两套归一化，术语卡那条路径用了弱的那套，于是 `random-access
    machine` 在语料 `randomaccessma- chine` 上永远匹配不上（真实踩过）。
    """
    return qnorm(" ".join(pages[p] for p in page_window(pages, spec)))


# ---------------------------------------------------------------------------
# 关卡遍历
# ---------------------------------------------------------------------------

def walk_quotes(node, path, acc, enclosing_page=None):
    """找出所有含 `en` 的字典，连同它的页码（自身 page 或最近的祖先 page）。"""
    if isinstance(node, dict):
        page = node.get("page", enclosing_page)
        if isinstance(node.get("en"), str):
            acc.append({
                "path": path,
                "page": page,
                "en": node["en"],
                "preview": bool(node.get("preview")),
                "kind": node.get("kind"),
            })
        for k, v in node.items():
            walk_quotes(v, "%s/%s" % (path, k), acc, page)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_quotes(v, "%s[%d]" % (path, i), acc, enclosing_page)


def walk_pages(node, path, acc, enclosing_page=None, preview=False):
    """找出所有 page 引用，用于越界检查。"""
    if isinstance(node, dict):
        prev = bool(node.get("preview")) or preview
        if "page" in node:
            acc.append({"path": path + "/page", "page": node["page"], "preview": prev})
        for k, v in node.items():
            if k == "page":
                continue
            walk_pages(v, "%s/%s" % (path, k), acc, node.get("page", enclosing_page), prev)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_pages(v, "%s[%d]" % (path, i), acc, enclosing_page, preview)


def walk_keys(node, key, acc, path=""):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == key:
                acc.append((path + "/" + k, v))
            walk_keys(v, key, acc, path + "/" + k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_keys(v, key, acc, "%s[%d]" % (path, i))


# ---------------------------------------------------------------------------
# 各条检查
# ---------------------------------------------------------------------------

def structure_index():
    """(章号字符串) -> {节号: {printed:[a,b], pdf:[a,b]}}"""
    idx = {}
    if not os.path.exists(STRUCTURE_JSON):
        return idx
    s = json.load(open(STRUCTURE_JSON, encoding="utf-8"))
    for part in s.get("parts", []):
        for ch in part.get("chapters", []):
            # structure.json 的字段叫 number（字符串）；旧键名 num 一并兼容
            num = str(ch.get("number", ch.get("num")))
            secs = {}
            for sec in ch.get("sections", []):
                title = sec.get("title", "")
                m = re.match(r"^([\dA-D]+(?:\.[\d]+)?)", title)
                secs[m.group(1) if m else title] = sec
            idx[num] = {"chapter": ch, "sections": secs}
    return idx


def registered_c_names():
    return {
        n
        for n in os.listdir(C_DIR)
        if n.endswith(".c")
    }


def registered_viz_algo():
    viz, algo = set(), set()
    if os.path.exists(REGISTRY_JS):
        t = open(REGISTRY_JS, encoding="utf-8").read()
        viz |= set(re.findall(r"registerViz\(\s*['\"]([\w-]+)['\"]", t))
        algo |= set(re.findall(r"registerAlgorithm\(\s*['\"]([\w-]+)['\"]", t))
    return viz, algo


def verify():
    if not os.path.exists(LEVELS_JSON):
        err("找不到 %s —— 请先跑 `node tools/dump_levels.mjs`" % LEVELS_JSON)
        return
    data = json.load(open(LEVELS_JSON, encoding="utf-8"))
    for p in data.get("problems", []):
        err("模块加载：%s" % p)

    pages = load_pages()
    struct = structure_index()
    valid_chapters = set(struct.keys())
    c_files = registered_c_names()
    viz_reg, algo_reg = registered_viz_algo()

    # 全部关卡的 id，用于链接有效性检查
    all_ids = set()
    for chn in data["chapters"]:
        for lv in chn["levels"]:
            all_ids.add(lv["id"])

    chapters_js = open(CHAPTERS_JS, encoding="utf-8").read() if os.path.exists(CHAPTERS_JS) else ""

    n_quotes = 0
    for chn in data["chapters"]:
        slug = chn["slug"]
        if slug not in chapters_js:
            err("章 %s 的 chapter.js 没有被 site/assets/chapters.js 注册" % slug)

        for lv in chn["levels"]:
            tag = "%s/%s" % (slug, lv["key"])
            stages = lv["stages"]

            # --- 1. 顶层字段 ---
            for f in ("key", "id", "chapter", "section", "title", "source", "stages"):
                if not lv.get(f):
                    err("%s 缺少顶层字段 %s" % (tag, f))
            if not lv.get("titleEn"):
                warn("%s 缺少 titleEn（不致命，但列表页会缺英文名）" % tag)

            # --- 2. id 与 key 一致 ---
            chnum = lv.get("chapter")
            expect_id = "ch%s/%s" % (str(chnum).zfill(2) if isinstance(chnum, int) else chnum, lv.get("key"))
            if lv.get("id") != expect_id:
                err("%s 的 id=%r，按 chapter/key 应为 %r" % (tag, lv.get("id"), expect_id))

            # --- 3. 九段式 ---
            types = [s.get("type") for s in stages]
            if types != STAGE_ORDER:
                if sorted(types) == sorted(STAGE_ORDER):
                    err("%s 九段式顺序不对：%s" % (tag, types))
                else:
                    missing = [t for t in STAGE_ORDER if t not in types]
                    extra = [t for t in types if t not in STAGE_ORDER]
                    err("%s 九段式不完整：缺 %s；多出 %s" % (tag, missing or "—", extra or "—"))
            for s in stages:
                if not s.get("title"):
                    err("%s 阶段 %s 缺 title" % (tag, s.get("type")))

            # --- 3b. 纯文本字段里不许出现 LaTeX ---
            # stage.title / prove.steps[].title / pseudocode.more[].subtitle 走的是
            # 纯文本渲染（没有 renderMixed），放了 $...$ 会原样把反斜杠印在页面上。
            # 教训：29.1 的 map 标题写成 "$\max c^{T}x$ 满足 $Ax \le b$"，
            # 页面标题上就出现了 "\max" 碎片（DOM 抽查才抓到）。
            for s in stages:
                ttl = s.get("title") or ""
                if "$" in ttl:
                    warn("%s 的阶段标题含 $（纯文本字段，会原样显示）：%s" % (tag, ttl[:44]))
                if s.get("type") == "pseudocode":
                    for mr in s.get("more") or []:
                        sub = mr.get("subtitle") or ""
                        if "$" in sub:
                            warn("%s 的 pseudocode.more.subtitle 含 $：%s" % (tag, sub[:44]))
                if s.get("type") == "prove":
                    for st in s.get("steps") or []:
                        sttl = st.get("title") or ""
                        if "$" in sttl:
                            warn("%s 的 prove 步骤标题含 $：%s" % (tag, sttl[:44]))

            # --- 4. 章节号与节号对得上 structure.json ---
            sec = lv.get("section")
            src = lv.get("source") or {}
            printed = src.get("printed")
            if not (isinstance(printed, list) and len(printed) == 2):
                err("%s 的 source.printed 不是 [起, 止]：%r" % (tag, printed))
            elif struct:
                key = str(chnum)
                info = struct.get(key)
                if not info:
                    err("%s 指向 structure.json 里不存在的章 %s" % (tag, key))
                else:
                    sinfo = info["sections"].get(str(sec))
                    if not sinfo:
                        warn("%s 的节号 %s 在 structure.json 里没找到" % (tag, sec))
                    else:
                        sp = sinfo.get("printed")
                        if sp and (printed[0] < sp[0] or printed[1] > sp[1]):
                            # 2.1 的真实区间是 17–24，而 structure 记录的节尾可能含下一页顶部的习题
                            warn("%s 声明印刷页 %s，structure.json 记 %s" % (tag, printed, sp))

            # --- 5. en 引述逐字可溯源；术语卡按「词表存在性」校验 ---
            quotes = []
            walk_quotes(lv, tag, quotes)
            n_quotes += len(quotes)
            for q in quotes:
                if not q["en"].strip():
                    err("%s 处 en 为空" % q["path"])
                    continue
                if "【TODO" in q["en"]:
                    # 骨架生成器留下的占位引述：它还不是引述，逐字比对没有意义。
                    # 由待办清单（TODOS）单独汇总，避免同一个问题报两遍。
                    continue
                if "**" in q["en"]:
                    err("%s 的英文原文含 ** 粗体标记（原文不该有本站的排版标记）"
                        % q["path"])
                if q["page"] is None:
                    err("%s 有 en 但没有 page，无法溯源" % q["path"])
                    continue
                # 术语卡（/terms/ 下的条目）是词表或备选写法，不是连续原句；
                # verify_quote 会对它们走「逐原子连续」这条更严的路。
                ok, diag = verify_quote(q["en"], q["page"],
                                        is_term=("/terms[" in q["path"]))
                if not ok:
                    err("%s 的原文溯源失败：%s" % (q["path"], diag))

            # --- 6. 前向页码引用必须有 preview 标记 ---
            if printed:
                refs = []
                walk_pages(lv, tag, refs)
                for r in refs:
                    vals = r["page"] if isinstance(r["page"], list) else [r["page"]]
                    future = [v for v in vals if isinstance(v, int) and v > printed[1] + 1]
                    if future and not r["preview"]:
                        err("%s 引用了本关范围之外的后续页码 %s，但没有 preview:true 标记"
                            % (r["path"], future))

            # --- 7. C 代码与 c/*.c 同步 ---
            for s in stages:
                if s.get("type") != "code":
                    continue
                c = s.get("c") or {}
                fname = c.get("file")
                code = c.get("code")
                if "【TODO" in json.dumps(s, ensure_ascii=False):
                    # 骨架阶段：c.file / c.code 还是占位符，一致性无从谈起。
                    # 由待办清单盯着它；TODO 清空后这条检查自动生效。
                    continue
                if not fname:
                    err("%s 的 code 阶段缺 c.file" % tag)
                    continue
                if fname not in c_files:
                    err("%s 引用了不存在的 C 文件 c/%s（现有：%s）"
                        % (tag, fname, sorted(c_files)))
                    continue
                if not isinstance(code, str) or not code.strip():
                    err("%s 的 code 阶段 c.code 为空" % tag)
                    continue
                disk = open(os.path.join(C_DIR, fname), encoding="utf-8").read()
                a = [x.rstrip() for x in code.replace("\r\n", "\n").split("\n")]
                b = [x.rstrip() for x in disk.replace("\r\n", "\n").split("\n")]
                while a and not a[-1]:
                    a.pop()
                while b and not b[-1]:
                    b.pop()
                if a != b:
                    diff = [(i + 1, x, (b[i] if i < len(b) else "<无>"))
                            for i, x in enumerate(a) if i >= len(b) or x != b[i]]
                    detail = "\n".join(
                        "        内嵌 %4d: %r\n        c/%-14s: %r" % (i, x, fname, y)
                        for i, x, y in diff[:4]
                    )
                    err("%s 内嵌的 C 代码与 c/%s 不一致（%d 行差异）：\n%s"
                        % (tag, fname, len(diff), detail))
                # notes 的行号必须落在文件范围内
                nlines = len(b)
                for nt in c.get("notes") or []:
                    if isinstance(nt.get("line"), int) and not (1 <= nt["line"] <= nlines):
                        err("%s 的 C 注解行号 %s 超出 c/%s 的 %d 行"
                            % (tag, nt["line"], fname, nlines))

            # --- 8. engine.code 必须是真实生成器的片段 ---
            for s in stages:
                if s.get("type") != "code":
                    continue
                eng = s.get("engine") or {}
                name = s.get("pseudocodeRef") or s.get("title")
                fname = None
                for f in os.listdir(ALGO_DIR):
                    if f.endswith(".js") and not f.startswith("__"):
                        body = open(os.path.join(ALGO_DIR, f), encoding="utf-8").read()
                        head = norm("\n".join(
                            (eng.get("code") or "").split("\n")[:1]
                        ))
                        if head and head[:40] in norm(body):
                            fname = f
                            break
                if (eng.get("code") or "").strip() and not fname:
                    warn("%s 的 engine.code 首行在 %s/ 里找不到出处（可能是片段改写）"
                         % (tag, ALGO_DIR))
                if not name:
                    warn("%s 的 code 阶段既无 pseudocodeRef 也无 title" % tag)

            # --- 9. 内部链接有效性 ---
            urls = []
            walk_keys(lv, "url", urls)
            walk_keys(lv, "href", urls)
            for path, u in urls:
                if not isinstance(u, str) or not u.startswith("#/"):
                    continue
                parts = [p for p in u[2:].split("/") if p]
                if not parts:
                    continue
                # ★ 附录 URL 归一化：#/appendix/<letter>/<关卡>[/<阶段>]
                #   路由（core/router.js）对附录走 letter 形态，闸门按 chX/sNN
                #   记关卡 id —— 在这里把两种形态对齐，后面统一按 ch 判断。
                if parts[0] == "appendix" and len(parts) >= 3:
                    parts = ["ch" + parts[1].upper()] + parts[2:]
                two = "/".join(parts[:2])
                if u.count("/") >= 2:
                    if two not in all_ids:
                        # 允许 #/ch02/s02 这样不带阶段号的链接
                        if not any(i.startswith(two + "/") or i == two for i in all_ids):
                            # ★ 先分清「写错的章号」和「还没建好的关卡」：
                            #   ch 号必须存在于原书目录（structure.json）里。
                            #   `#/ch77/s01` 是手滑 —— 升级为 ERROR；`#/ch04/s01`
                            #   是对下一章的正常预告 —— 保持 WARN，等那一关建成。
                            # ★ 先分清「写错的章号」和「还没建好的关卡」：
                            #   ch 号必须存在于原书目录（structure.json）里。
                            #   `#/ch77/s01` 是手滑 —— 升级为 ERROR；`#/ch04/s01`
                            #   是对下一章的正常预告 —— 保持 WARN，等那一关建成。
                            if parts[0] == "appendix":
                                ch_key = parts[1].upper() if len(parts) > 1 else ""
                            elif parts[0].startswith("ch"):
                                ch_key = parts[0][2:]
                                if ch_key.isdigit():
                                    ch_key = str(int(ch_key))   # ch04 -> 4
                            else:
                                ch_key = parts[0]
                            if ch_key not in valid_chapters:
                                err("%s 的链接 %s 指向不存在的章 %r"
                                    "（原书目录里只有：%s）"
                                    % (path, u, ch_key, sorted(valid_chapters)))
                            elif "/unlocks[" in path:
                                # 解锁预告链接：关卡写好的时候后一关还没建是常态，
                                # 降级为 WARN；等那一关真的写错号时再升级。
                                warn("%s 的解锁预告链接 %s 指向尚未构建的关卡"
                                     % (path, u))
                            else:
                                err("%s 的链接 %s 指向不存在的关卡（现有：%s）"
                                    % (path, u, sorted(all_ids)))
                else:
                    # 章级链接：#/ch02 或 #/
                    if parts[0] not in ("",) and parts[0] not in chapters_js:
                        warn("%s 的章节链接 %s 指向未注册的章" % (path, u))

            # --- 10. viz / algorithm 已注册 ---
            for s in stages:
                if s.get("viz") and s["viz"] not in viz_reg:
                    err("%s 阶段 %s 用了未注册的可视化引擎 %r（已注册：%s）"
                        % (tag, s.get("type"), s["viz"], sorted(viz_reg)))
                if s.get("algorithm") and s["algorithm"] not in algo_reg:
                    err("%s 阶段 %s 用了未注册的算法 %r（已注册：%s）"
                        % (tag, s.get("type"), s["algorithm"], sorted(algo_reg)))
                panels = s.get("panels")
                if isinstance(panels, list):
                    for pn in panels:
                        if pn.get("viz") and pn["viz"] not in viz_reg:
                            err("%s 的 panels 用了未注册的 viz %r" % (tag, pn["viz"]))
                        if pn.get("algorithm") and pn["algorithm"] not in algo_reg:
                            err("%s 的 panels 用了未注册的 algorithm %r" % (tag, pn["algorithm"]))

    print("关卡数：%d，英文引述：%d 条" % (
        sum(len(c["levels"]) for c in data["chapters"]), n_quotes))


def first_mismatch(needle, hay):
    """找到 needle 与 hay 第一个对不上的位置，返回附近上下文。"""
    lo, hi = 0, min(len(needle), 40)
    # 先用二分逼近：找 hay 中最长的、与 needle 前缀一致的长度
    best = 0
    for L in range(min(len(needle), 200), 0, -1):
        if needle[:L] in hay:
            best = L
            break
    ctx = needle[max(0, best - 30):best + 60]
    return ctx.replace("\n", " ")


def collect_todos(data=None):
    """骨架里还没填的占位标记（`【TODO …】`）。

    单独一档：它既不是 ERROR（内容没错）也不是 WARN（不是可接受的现状），
    而是一张待办清单——由 tools/05_new_level.py 生成骨架时留下，填完即消失。
    不计入退出码，所以骨架可以在仓库里存在而不让闸门变红。
    """
    if data is None:
        try:
            data = json.load(open(LEVELS_JSON, encoding="utf-8"))
        except Exception:
            return []
    out = []
    for ch in data.get("chapters", []):
        for lv in ch.get("levels", []):
            n = lv.get("todos") or 0
            if n:
                out.append("%s/%s（%s）还有 %d 处 【TODO…】"
                           % (ch.get("slug"), lv.get("key"), lv.get("file") or "?", n))
    return out


def main():
    strict = "--strict" in sys.argv
    verify()
    todos = collect_todos()
    for w in warns:
        print("  WARN  " + w)
    for e in errors:
        print("  ERROR " + e)
    for d in todos:
        print("  TODO  " + d)
    print()
    print("==== 结果：%d 个 ERROR，%d 个 WARN，%d 关含 TODO ===="
          % (len(errors), len(warns), len(todos)))
    if errors or (strict and warns):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
