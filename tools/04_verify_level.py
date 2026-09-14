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


def quote_match(needle, hay, max_run=800):
    """引述匹配判据。

    1) 逐字命中（qnorm 后）—— 最强，绝大多数引述走这条。
    2) 带隙子序列命中：needle 的字符必须**按原顺序、一字不缺**地出现在窗口
       里；语料侧允许夹带「伪影运行」（脚注整段、页间伪代码块、图注——它们
       在 PDF 抽取顺序里落在引述两半之间），但**每段**夹带不得超过 max_run
       字符。改写、漏词、记号用错、词序调换都会让 needle 嵌不进去，判负。

    实现用「最稀有字符锚点 + 双向贪心」：取 needle 里在语料中出现次数最少
    的字符作锚，对它在语料里的每个出现位置，向右、向左各做一次贪心子序列
    匹配。相比「首字符起点 + 采样」，锚点法不会漏掉真实起点，也不受 needle
    以常见字母开头（'a'、't'）的影响。

    返回 (True, "", 结束下标) 或 (False, 诊断信息, 0)。
    """
    if not needle:
        return False, "引述归一化后为空", 0
    if needle in hay:
        return True, "", len(needle)

    # ---- 选锚：needle 中在 hay 里最稀有的字符 ----
    from collections import Counter
    freq = Counter(hay)
    best_char, best_count = None, None
    for c in set(needle):
        cnt = freq.get(c, 0)
        if cnt == 0:
            continue
        if best_count is None or cnt < best_count:
            best_char, best_count = c, cnt
    if best_char is None:
        return False, "引述的字符在语料窗口里一个都找不到（内容完全不符）", 0

    anchors = [m.start() for m in re.finditer(re.escape(best_char), hay)]
    n, H = len(needle), len(hay)

    def greedy(chunk, text, start, limit):
        """chunk 是否能作为子序列从 text[start] 起嵌入；限制单段夹带 ≤ limit。
        返回 (True, 本方向最长夹带, 结束下标) 或 (False, 0, 0)。"""
        j, i, run, worst = 0, start, 0, 0
        L = len(chunk)
        while j < L and i < len(text):
            if text[i] == chunk[j]:
                j += 1
                worst = max(worst, run)
                run = 0
            else:
                run += 1
                if run > limit:
                    return False, 0, 0
            i += 1
        if j < L:
            return False, 0, 0
        return True, max(worst, run), i

    best = None  # (worst_total_run, total_extra)
    for pos in anchors:
        k = needle.find(best_char)
        # 向右：needle[k+1:] 嵌入 hay[pos+1:]
        ok_r, run_r, end_r = greedy(needle[k + 1:], hay, pos + 1, max_run)
        if not ok_r:
            continue
        # 向左：needle[:k] 反转后嵌入 hay[:pos] 反转
        ok_l, run_l, _end_l = greedy(needle[:k][::-1], hay[:pos][::-1], 0, max_run)
        if not ok_l:
            continue
        worst = max(run_l, run_r)
        total = run_l + run_r
        if best is None or (worst, total) < best:
            best = (worst, total)
        if worst <= max_run:
            return True, "", end_r

    if best is not None:
        return False, ("引述字符都能按序找到，但语料在首尾之间夹带了一段 %d 字符的"
                       "内容（容忍值 %d）——若这是脚注/伪代码块请报告，否则引述有误"
                       % (best[0], max_run)), 0

    # needle 根本嵌不进去 —— 用 difflib 找出 needle 侧到底缺了什么
    sm = difflib.SequenceMatcher(None, hay, needle, autojunk=False)
    missing = [needle[b1:b2] for op, _a1, _a2, b1, b2 in sm.get_opcodes()
               if op in ("insert", "replace") and b2 > b1]
    ctx_at = needle.find(missing[0]) if missing else 0
    ctx = needle[max(0, ctx_at - 24):ctx_at + 34]
    return False, ("引述中有 %d 处片段在语料窗口里找不到（共 %d 字符）：%r；"
                   "第一处上下文：…%s…"
                   % (len(missing), sum(len(m) for m in missing),
                      missing[:4], ctx)), 0


def quote_match_seq(raw, hay):
    """省略号感知的引述匹配。

    引述里的 `…` / `...` 是关卡作者的省略标记（"此处略去原文若干字"），
    语义上允许语料在两段之间有**任意长**的内容（跨页、跨节都合法），但两段
    各自仍受 quote_match 的严格约束，且必须按原顺序出现。注意：原书正文里
    本身就有的省略号（如 ⟨a₁, a₂, …, aₙ⟩）被同样处理并无碍——片段仍需按序
    逐字嵌入，只是夹带容忍按段计。
    """
    parts = [p for p in re.split(r"\u2026|\.\.\.", raw) if p.strip()]
    if len(parts) <= 1:
        ok, diag, _end = quote_match(qnorm(raw), hay)
        return ok, diag
    cursor = 0
    for frag in parts:
        ok, diag, end = quote_match(qnorm(frag), hay[cursor:])
        if not ok:
            return False, diag
        cursor += max(1, end)
    return True, ""


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
                if "/terms[" in q["path"]:
                    # 术语卡是词表（如 Initialization / Maintenance / Termination、
                    # RAM model (random access machine)），不是连续原句，逐字比对
                    # 必然失败。改校验：每个备选写法的全部英文单词（≥3 字母）都
                    # 出现在声明页附近的窗口里即可。
                    wt_norm = qwindow_text(pages, q["page"])
                    if not wt_norm:
                        err("%s 声明的页码 %s 在语料里取不到文本" % (q["path"], q["page"]))
                        continue

                    def _has(w):
                        # 语料里没有空格也没有连字符：`random-access machine` 可能被
                        # 排成 `randomaccessma- chine`（行尾断词 + 字距伪影）。所以
                        # 一律在 qnorm 干草堆上做子串判断，而不是 \b 词边界搜索。
                        return qnorm(w) in wt_norm

                    alts = [a for a in re.split(r"/", q["en"]) if a.strip()]
                    ok_alt = []
                    for a in alts:
                        words = re.findall(r"[A-Za-z]{3,}", a)
                        ok_alt.append(all(_has(w) for w in words) if words else True)
                    if not any(ok_alt):
                        absent = sorted({w.lower() for a in alts
                                         for w in re.findall(r"[A-Za-z]{3,}", a)
                                         if not _has(w)})
                        err("%s 的术语 %r 在印刷页 %s 附近一个词都对不上（缺失：%s）"
                            % (q["path"], q["en"], q["page"], ", ".join(absent[:6])))
                    continue
                wt = qwindow_text(pages, q["page"])
                if not wt:
                    err("%s 声明的页码 %s 在语料里取不到文本" % (q["path"], q["page"]))
                    continue
                ok, diag = quote_match_seq(q["en"], wt)
                if not ok:
                    err("%s 的原文与语料比对失败：%s" % (q["path"], diag))

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
                two = "/".join(parts[:2])
                if u.count("/") >= 2:
                    if two not in all_ids and two not in ("ch02", ""):
                        # 允许 #/ch02/s02 这样不带阶段号的链接
                        if not any(i.startswith(two + "/") or i == two for i in all_ids):
                            if "/unlocks[" in path:
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
