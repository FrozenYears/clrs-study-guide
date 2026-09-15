#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""05_new_level.py — 关卡骨架生成器：把「照抄原书」交给机器，把「讲清楚」留给人。

为什么必须有这个工具
====================
每一关有 9 个阶段，其中 4 处数据必须**逐字**来自原书：

    * 原文引述（`en` + 页码）    * 伪代码逐行
    * 书后习题（题号 + 题干）    * 图注

靠人手打字抄这些内容一定会错，而且错了很难发现。本项目已经吃过两次亏：

    * 早期 agent 凭记忆写 Figure 2.4 的示例数组，写错了（实际是 ⟨12,3,7,9,14,6,11,2⟩）；
    * 关卡里把第 4 版的 `A[p : q]` 记法写成第 3 版的 `A[p .. q]`，一处错了 49 遍。

本脚本从 `data/blocks/` 直接取这些数据填进骨架，并**当场用 tools/04 的判据自检**：
凡是通不过的候选一律不写进文件，而是列出来说明原因。也就是说，生成出来的骨架
天然满足「原文可溯源」这条红线——剩下的工作只有「讲清楚」。

用法
====
    python tools/05_new_level.py 3 3.1
    python tools/05_new_level.py 3 3.1 --slug asymptotic-notation --title-zh "渐进记号"
    python tools/05_new_level.py 3 3.1 --register        # 顺带写进章节注册表

生成之后
========
    1. 填掉文件里所有 `【TODO …】`（脚本末尾会列清单）；
    2. node tools/dump_levels.mjs && python tools/04_verify_level.py
       —— 剩余的 TODO 会单独列在 `TODO` 一档，填完即消失；
    3. node site/tools/check-syntax.mjs site
    4. 起本地服务后跑 python tools/smoke_browser.py 8317

参数
====
    ch            章号（整数；附录用字母，如 A）
    section       节号，形如 3.1
    --slug        关卡文件名后缀（默认由节标题推出来，不满意就手动给）
    --title-zh    关卡中文标题（默认留 【TODO】）
    --chapter-title-zh  章中文名（只在新建 chapter.js 时用到）
    --register    写进 site/assets/chapters.js 并（必要时）新建 chapter.js
    --dry-run     只打印，不写文件
"""
import argparse
import glob
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STRUCT = os.path.join(ROOT, "data", "structure.json")
BLOCKS_DIR = os.path.join(ROOT, "data", "blocks")
SITE = os.path.join(ROOT, "site")
CH_DIR = os.path.join(SITE, "chapters")
REGISTRY = os.path.join(SITE, "assets", "chapters.js")
TODO = "【TODO"


def todo(text):
    """用户可见的占位标记。tools/04_verify_level.py 会统计它们的数量，
    全部清空后关卡才算交付。"""
    return "【TODO %s】" % text

# 生成器只写这 9 个阶段，顺序与 chapter-view 的导航一致
STAGE_TYPES = ["map", "intuition", "source", "pseudocode",
               "visualize", "code", "analyze", "prove", "drill"]


# ---------------------------------------------------------------------------
# 小工具
# ---------------------------------------------------------------------------

def js(s):
    """把字符串安全地写成 JS 单引号字符串（关卡文件统一用单引号）。"""
    if s is None:
        return "null"
    s = str(s)
    s = s.replace("\\", "\\\\").replace("'", "\\'")
    s = s.replace("\r\n", "\n").replace("\r", "\n").replace("\n", "\\n")
    s = s.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    return "'" + s + "'"


def kebab(s, maxwords=3):
    """由节标题推出文件名后缀。非 ASCII（Ω/Θ 等）会被丢掉，所以只作默认值。"""
    words = [w.lower() for w in re.sub(r"[^0-9A-Za-z]+", " ", s or "").split() if w]
    out = []
    for w in words:
        if w not in out:
            out.append(w)
        if len(out) >= maxwords:
            break
    return "-".join(out) or "level"


def find_node():
    for c in (shutil.which("node"), r"D:\nodejs\node.exe",
              r"C:\Users\FrozenYears\.workbuddy\binaries\node\versions\22.22.2-3\node.exe"):
        if c and os.path.exists(c):
            return c
    return None


def load_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------------------
# 结构数据
# ---------------------------------------------------------------------------

def find_chapter(struct, ch):
    want = str(ch).strip()
    for part in struct.get("parts", []):
        for c in part.get("chapters", []):
            if str(c.get("number")).upper() == want.upper():
                return c
    return None


def find_section(chapter, section):
    for sec in chapter.get("sections", []):
        if sec.get("title", "").split(" ")[0] == section:
            return sec
    return None


def section_page_ranges(chapter, sec):
    """(印刷页起, 印刷页止, pdf 起, pdf 止)。印刷页 = pdf_index − 21。"""
    pdf0 = sec["pdf_index"]
    pdf1 = sec["pdf_end"] - 1
    return sec["printed_page"], pdf1 - 21, pdf0, pdf1


def blocks_file(ch, blocks_dir=BLOCKS_DIR):
    hits = glob.glob(os.path.join(blocks_dir, "*__ch%s.json" % str(ch).zfill(2)))
    if not hits:
        hits = glob.glob(os.path.join(blocks_dir, "*__ch%s.json" % str(ch).upper()))
    return hits[0] if hits else None


def is_exercise_start(text, section):
    """习题块/问题块：题号要么直接跟题干，要么单独成行。"""
    return bool(re.match(r"^%s-\d+\b" % re.escape(section), text.strip())) or \
        bool(re.match(r"^\d+-\d+\b", text.strip()))


def parse_exercise(block):
    """`3.1-1 Modify the lower-bound …` -> {id, star, statement}"""
    text = block["text"].strip()
    m = re.match(r"^((?:\d+\.\d+|\d+)-\d+)\s*\n?\s*(.*)$", text, re.S)
    if not m:
        return None
    qid, rest = m.group(1), m.group(2).strip()
    star = 0
    if rest[:1] in ("*", "★", "⋆", "?"):
        star = 1
        rest = rest[1:].strip()
    return {"id": qid, "star": star, "statement": rest,
            "page": block["printed_page"]}


# ---------------------------------------------------------------------------
# 校验：把候选引述交给 tools/04 的判据
# ---------------------------------------------------------------------------

class Checker(object):
    """复用 04_verify_level.py 的 qnorm / quote_match_seq，保证「生成即合规」。"""

    def __init__(self):
        spec = importlib.util.spec_from_file_location(
            "ver04", os.path.join(ROOT, "tools", "04_verify_level.py"))
        self.ver = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.ver)
        self.pages = self.ver.load_pages()

    def ok(self, en, page):
        # ★ 与关卡闸门同一条判据（v3 的 verify_quote：连续命中 + 四条结构化豁免）。
        #   生成即合规 —— 生成器放行的引述，闸门不会再打回。
        good, diag = self.ver.verify_quote(en, page)
        return good, diag


# ---------------------------------------------------------------------------
# 生成
# ---------------------------------------------------------------------------

def build_level(ch, section, blocks, checker, title_zh, slug):
    chapter_title = blocks["chapter_title"]           # 如 "3 Characterizing Running Times"
    sec_title = None
    for t in blocks["sections"]:
        if t.split(" ")[0] == section:
            sec_title = t
    sec_title = sec_title or section
    title_en = sec_title.split(" ", 1)[1] if " " in sec_title else sec_title

    ch_key = str(blocks["chapter"])
    id_prefix = "ch%02d" % int(ch_key) if ch_key.isdigit() else "appendix/%s" % ch_key.lower()
    level_id = "%s/%s" % (id_prefix, slug["key"])

    # ---- 候选引述：本节正文块 + 图注（逐条交给 checker 验，不过的不写进文件）
    in_sec = [b for b in blocks["blocks"] if str(b.get("section")) == section]
    candidates = []
    for b in in_sec:
        if b["type"] == "body" and len(b["text"]) >= 80:
            candidates.append(("body", b["printed_page"], b["text"]))
    for b in in_sec:
        if b["type"] == "figure-caption":
            candidates.append(("figure", b["printed_page"], b["text"]))

    kept, dropped = [], []
    for kind, page, text in candidates:
        if "**" in text:
            dropped.append((page, text[:40], "含 ** 标记（原文不该有本站排版标记）"))
            continue
        good, diag = checker.ok(text, page)
        if good:
            kept.append((kind, page, text))
        else:
            dropped.append((page, text[:60], diag[:110]))
    kept = kept[:6]        # 一关的原文精读控制在 6 条以内

    # ---- 伪代码
    pcs = [b for b in in_sec if b["type"] == "pseudocode"]
    pcs.sort(key=lambda b: -len(b["lines"]))
    pseudo = pcs[0] if pcs else None

    # ---- 习题（exercise + problem，按题号归属该节）
    exs = []
    for b in in_sec:
        if b["type"] in ("exercise", "problem"):
            e = parse_exercise(b)
            if e:
                exs.append(e)

    # ---- 解锁 / 前置：只指向真实存在的关卡，避免制造死链接
    secs = [t.split(" ")[0] for t in blocks["sections"]]
    idx = secs.index(section) if section in secs else -1
    unlocks = []
    if idx >= 0 and idx + 1 < len(secs):
        unlocks.append((secs[idx + 1], blocks["sections"][idx + 1], "s%02d" % (idx + 2)))
    prev_prereq = None
    if idx > 0:
        prev_prereq = (secs[idx - 1], blocks["sections"][idx - 1], "s%02d" % idx)

    printed = (blocks["_printed0"], blocks["_printed1"])
    pdf = (blocks["_pdf0"], blocks["_pdf1"])

    # =======================================================================
    # 组装文件
    # =======================================================================
    L = []
    A = L.append

    A("/* =============================================================================")
    A(" * 第 %s 章 %s —— 第 %s 关：%s" % (ch_key, section, slug["key"], sec_title))
    A(" *")
    A(" * 原文锚点：印刷页 %d–%d（pdf_index %d–%d）" % (printed[0], printed[1], pdf[0], pdf[1]))
    A(" *")
    A(" * 本文件由 tools/05_new_level.py 生成骨架：")
    A(" *   「原文引述」「伪代码逐行」「书后习题」三处已从 data/blocks 逐字填入，")
    A(" *   并且每一条都已通过 tools/04 的溯源判据 —— **请勿改写 en**，")
    A(" *   要删就整条删。其余 `【TODO …】` 处需人工填写。")
    A(" *")
    A(" * 交付前必跑：node tools/dump_levels.mjs && python tools/04_verify_level.py")
    A(" * ========================================================================== */")
    A("")
    A("export default {")
    A("  key: %s," % js(slug["key"]))
    A("  id: %s," % js(level_id))
    # ★ chapter 与手写样板一致：数字章写数字字面量（chapter: 3），
    #   附录章写字符串（chapter: 'A'）。闸门按这个推 id = ch<两位章号>/<key>。
    A("  chapter: %s," % (ch_key if ch_key.isdigit() else js(ch_key)))
    A("  section: %s," % js(section))
    A("  title: %s," % js(title_zh or todo("中文标题")))
    A("  shortTitle: %s," % js("%s %s" % (section, title_zh or todo("中文标题"))))
    A("  titleEn: %s," % js(title_en))
    A("  source: { printed: [%d, %d], pdf: [%d, %d] }," % (printed + pdf))
    A("  sourceNote: %s," % js("本关对应原书 %s 节（印刷页 %d–%d）。" % (section, printed[0], printed[1])))
    if prev_prereq:
        A("  prerequisites: [")
        A("    { label: %s, url: %s },"
          % (js("%s %s" % (prev_prereq[0], prev_prereq[1].split(" ", 1)[-1])),
             js("#/%s/%s" % (id_prefix, prev_prereq[2]))))
        A("  ],")
    else:
        A("  prerequisites: [],")
    A("  stages: [")

    # ---------------- 1. map ----------------
    A("    // ——— 阶段 1 位置感 ———————————————————————————————————————")
    A("    {")
    A("      type: 'map',")
    A("      title: %s," % js(todo("标题，如「先看清这一关的位置」")))
    A("      why: %s," % js(todo("为什么学这一关：这一节解决什么问题，为什么值得先学")))
    A("      position: %s," % js(todo("知识地图上的位置：前置是什么，为后面哪些章节铺路")))
    A("      unlocks: [")
    for sid, stitle, skey in unlocks:
        A("        { label: %s, url: %s },"
          % (js("%s %s" % (sid, stitle.split(" ", 1)[-1])), js("#/%s/%s" % (id_prefix, skey))))
    A("        // 想预告后面章节也能这么写（闸门会以 WARN 提示该章尚未构建，属正常）：")
    A("        // { label: '第 4 章 分治法', url: '#/ch04/s01' },")
    A("      ],")
    A("      mathKit: [],        // %s" % todo("本节用到的数学工具，2–3 条"))
    A("    },")

    # ---------------- 2. intuition ----------------
    A("")
    A("    // ——— 阶段 2 直觉入口 ———————————————————————————————————————")
    A("    {")
    A("      type: 'intuition',")
    A("      title: %s," % js(todo("标题")))
    A("      scene: %s," % js(todo("一个具体的生活场景，一句话（原书没有类比时也要自己造一个）")))
    A("      body: [")
    A("        %s," % js(todo("2–4 段中文，把生活场景接到本节内容上")))
    A("      ],")
    A("      interactive: { text: %s }," % js(todo(
        "可选：这里放一段动手玩的小交互说明；要换成翻牌演示就写 "
        "{ kind: 'cards-hand', cards: [...], prompt: '…' }")))
    A("    },")

    # ---------------- 3. source ----------------
    A("")
    A("    // ——— 阶段 3 原文精读 ———————————————————————————————————————")
    A("    // 下面的 en 与 page 逐字取自 data/blocks/%s，每条都已通过溯源判据。" % os.path.basename(blocks["_file"]))
    A("    // 请勿改写 en；每条补上 zh（中文解读）即可。")
    A("    {")
    A("      type: 'source',")
    A("      title: '书上是怎么说的',")
    A("      lead: '下面每条都是原书英文原文（衬线体），紧跟的中文是本关的解读（无衬线体）。"
      "原文一律照抄，不做任何改写。',")
    A("      blocks: [")
    if kept:
        for kind, page, text in kept:
            A("        { kind: %s, page: %d," % (js(kind), page))
            A("          en: %s," % js(text))
            A("          zh: %s }," % js(todo("中文解读")))
    else:
        A("        // %s" % todo("本节没找到可用正文段（要么太短，要么通不过溯源判据）"))
    A("      ],")
    A("      terms: [],       // %s" % todo("术语卡：{ en: '英文', zh: '中文', page: 页码 }"))
    A("    },")

    # ---------------- 4. pseudocode ----------------
    A("")
    A("    // ——— 阶段 4 伪代码 —————————————————————————————————————————")
    A("    // lines 的 n / code 逐字取自 data/blocks，行号即原书行号。")
    A("    // 点行展开中文：给需要解释的行补 zh 字段（不补则该行不可点）。")
    A("    {")
    A("      type: 'pseudocode',")
    if pseudo:
        A("      title: %s," % js("逐行拆开这 %d 行" % len(pseudo["lines"])))
        A("      algo: %s," % js(pseudo.get("algo_name")))
        A("      signature: %s," % js(pseudo.get("signature") or pseudo.get("algo_name")))
        A("      page: %d," % pseudo["printed_page"])
        A("      lines: [")
        for ln in pseudo["lines"]:
            A("        { n: %d, code: %s }," % (ln["n"], js(ln["code"])))
        A("      ],")
        A("      vars: [],        // %s" % todo("变量表：{ name: 'i', meaning: '…' }"))
        A("      note: '',        // %s" % todo("可选：一句总结，如「注意循环结束时 i = n + 1」"))
    else:
        A("      // %s" % todo("本节在原书里没有伪代码块（data/blocks 查不到）"))
        A("      // 若确实没有，请整段删掉这个阶段；若应该有，先检查分块流水线。")
        A("      title: %s," % js(todo("标题")))
        A("      algo: null,")
        A("      signature: '',")
        A("      page: %d," % printed[0])
        A("      lines: [],")
        A("      vars: [],")
        A("      note: '',")
    A("    },")

    # ---------------- 5. visualize ----------------
    A("")
    A("    // ——— 阶段 5 动手看见 ———————————————————————————————————————")
    A("    {")
    A("      type: 'visualize',")
    A("      title: '看着它一步步跑',")
    A("      viz: 'array',       // 'array' | 'tree'（见 site/assets/viz/）")
    A("      algorithm: null,    // %s" % todo("算法生成器名（见 site/assets/algorithms/）"))
    A("      pseudocodeRef: %s," % js(pseudo.get("algo_name") if pseudo else None))
    A("      input: { array: [] },   // %s" % todo("默认输入数组"))
    A("      invariants: [")
    A("        // { label: '一句话描述不变量，动画里会实时显示是否成立' },")
    A("        { label: %s }," % js(todo("不变量")))
    A("      ],")
    A("      presets: [],     // %s" % todo("2–4 组预设输入，至少要有原书图里那组"))
    A("      tasks: [%s]," % js(todo("2–3 条让学生自己动手验证的小任务")))
    A("    },")

    # ---------------- 6. code ----------------
    A("")
    A("    // ——— 阶段 6 双轨实现 ———————————————————————————————————————")
    A("    {")
    A("      type: 'code',")
    A("      title: '从伪代码到 C',")
    A("      intro: '对照时只看一件事：**书上每个下标减 1**。书上 `A[i]`，C 里就是 `a[i-1]`。',")
    A("      pseudocodeRef: %s," % js(pseudo.get("algo_name") if pseudo else None))
    A("      c: {")
    A("        file: %s," % js(todo("如 insertion_sort.c")))
    A("        code: %s," % js("// %s" % todo("把 c/<name>.c 的全文粘到这里；")
                                if False else "// 【TODO 把 c/<name>.c 的全文粘到这里；两份必须逐字节一致（闸门会查）】"))
    A("      },")
    A("      mapping: [],     // %s" % todo("伪代码行 ↔ C 行的对应表：{ line: 1, c: 'for (int i = 1; …)' }"))
    A("    },")

    # ---------------- 7. analyze ----------------
    A("")
    A("    // ——— 阶段 7 复杂度 —————————————————————————————————————————")
    A("    {")
    A("      type: 'analyze',")
    A("      title: %s," % js(todo("标题")))
    A("      intro: %s," % js(todo("这一阶段要回答什么问题")))
    A("      claims: [")
    A("        // %s" % todo("每条复杂度断言都要给 page 出处；自己推导的写 source: 'instructor'"))
    A("        // 引用本关范围之外的页码（如本节结论在第 4 章）必须加 preview: true。")
    A("        // { expr: '\\\\Theta(n \\\\lg n)', when: '最坏情况', page: [%d], source: 'book' }," % printed[0])
    A("      ],")
    A("      tables: [],      // { caption: '表标题', rows: [['左列', '右列', true]] }")
    A("      chart: null,     // { series: [{ name: 'n lg n', expr: 'n * Math.log2(n)' }], xMax: 16 }")
    A("      derivations: [], // { kind: 'summation', title: '推导标题', steps: [{ tex: '…', zh: '…' }] }")
    A("      note: ''")
    A("    },")

    # ---------------- 8. prove ----------------
    A("")
    A("    // ——— 阶段 8 正确性 —————————————————————————————————————————")
    A("    // statement / en 也要逐字取自原书（去 data/blocks 里找，别凭记忆写）。")
    A("    {")
    A("      type: 'prove',")
    A("      title: '凭什么说它一定对',")
    A("      statement: %s," % js(todo("要证的不变量（原书原文，逐字）")))
    A("      page: %d," % printed[0])
    A("      intro: %s," % js(todo("导读：下面三步分别对应不变量的哪一条性质")))
    A("      steps: [")
    for i, (t, en) in enumerate([
            ("第一步 · 初始化（Initialization）", "We start by showing that the loop invariant holds before the first loop iteration."),
            ("第二步 · 保持（Maintenance）", "Next we show that each iteration maintains the loop invariant."),
            ("第三步 · 终止（Termination）", "Finally, we examine what happens when the loop terminates.")]):
        A("        {")
        A("          title: %s," % js(t))
        A("          en: %s," % js(todo("原书这一段的原文（逐字）")))
        A("          page: %d," % (printed[0] + i))
        A("          body: [%s]," % js(todo("中文展开与补白")))
        A("        },")
    A("      ],")
    A("      conclusion: %s," % js(todo("收束：由 Termination 得到什么结论")))
    A("    },")

    # ---------------- 9. drill ----------------
    A("")
    A("    // ——— 阶段 9 闯关测验 ———————————————————————————————————————")
    A("    // items 三种题型：judge（判断，answer 是 true/false）、")
    A("    //   single（单选，answer 是正确选项下标）、simulate（动手模拟，steps + answer）")
    A("    {")
    A("      type: 'drill',")
    A("      title: '检验一下',")
    A("      items: [")
    A("        // %s" % todo("6–8 道。题目要能一眼看出是本节的内容，但答案必须能从原文/动画推出来"))
    A("      ],")
    A("      bookExercises: [")
    if exs:
        for e in exs:
            A("        { id: %s, page: %d, star: %d," % (js(e["id"]), e["page"], e["star"]))
            A("          statement: %s," % js(e["statement"]))
            A("          hint: %s }," % js(todo("提示：卡住时给一句方向，不要直接给答案")))
    else:
        A("        // %s" % todo("本节没有书后习题"))
    A("      ],")
    A("    },")

    A("  ],")
    A("};")

    return "\n".join(L) + "\n", kept, dropped, pseudo, exs


# ---------------------------------------------------------------------------
# 注册
# ---------------------------------------------------------------------------

def ensure_chapter_file(slug, ch, chapter_title, title_zh, section_titles, src_range):
    """创建 chapter.js。

    ★ 两条硬要求（都踩过）：
      1. 只 import **真实存在**的关卡文件。把还没建的关卡也 import 进来，
         chapter.js 会加载失败，而它是 chapters.js 静态 import 的 —— 整个站点
         一起挂掉，报错还只指向 chapter.js 那一行。
      2. JS 注释是 `//`，不是 Python 的 `#`（第一版就是拿 `#` 生成注释，
         产出直接是语法错误）。
    """
    path = os.path.join(CH_DIR, slug, "chapter.js")
    dir_ = os.path.join(CH_DIR, slug)
    title_en = chapter_title.split(" ", 1)[-1] if " " in chapter_title else chapter_title
    if os.path.exists(path):
        return path, open(path, encoding="utf-8").read(), False

    keys = ["s%02d" % (i + 1) for i in range(len(section_titles))]
    have = {}
    for key in keys:
        f = None
        for name in sorted(os.listdir(dir_)):
            if name.startswith(key + "-") and name.endswith(".js"):
                f = name
        if f:
            have[key] = f

    L = []
    L.append("/* =============================================================================")
    L.append(" * 第 %s 章 %s（%s）—— 关卡清单" % (str(ch).upper(), title_en, title_zh or todo("中文章名")))
    L.append(" *")
    L.append(" * 本文件由 tools/05_new_level.py 生成。新增关卡时：import 进来，")
    L.append(" * 再加进下面的 levels 数组。")
    L.append(" * ========================================================================== */")
    L.append("")
    for key in keys:
        if key in have:
            L.append("import %s from './%s';" % (key, have[key]))
        else:
            L.append("// %s 还没建：建好后把下面这行打开 ——" % key)
            L.append("// import %s from './%s-<slug>.js';" % (key, key))
    L.append("")
    L.append("export default {")
    L.append("  ch: %s," % (str(ch) if str(ch).isdigit() else js(str(ch).upper())))
    L.append("  chSpan: %s," % js("第 %s 章 · %s（%s）" % (str(ch).upper(), title_en,
                                                       title_zh or todo("中文章名"))))
    L.append("  slug: %s," % js(slug))
    L.append("  title: %s," % js(title_en))
    L.append("  titleZh: %s," % js(title_zh or todo("中文章名")))
    L.append("  source: { printed: [%d, %d], pdf: [%d, %d] }," % src_range)
    L.append("  levels: [%s],   // 只登记已建好的关卡" % ", ".join(k for k in keys if k in have))
    L.append("};")
    L.append("")
    return path, "\n".join(L), True


def register(slug, ch, level_key, chapter_title, title_zh):
    """把一章接进 site/assets/chapters.js。返回 (是否改动, 说明)。"""
    notes = []
    reg = open(REGISTRY, encoding="utf-8").read()
    ch_key = str(ch) if str(ch).isdigit() else str(ch).upper()
    var = "ch%s" % str(ch).lower()

    if "from '../chapters/%s/" % slug not in reg:
        anchor = "const CHAPTERS = new Map(["
        imp = "import %s from '../chapters/%s/chapter.js';\n" % (var, slug)
        # 插到最后一个 import 之后
        last = reg.rfind("\nimport ")
        end = reg.find("\n", last + 1)
        reg = reg[:end + 1] + imp + reg[end + 1:]
        notes.append("已加 import %s" % var)

    if "['%s'" % ch_key not in reg:
        anchor = "const CHAPTERS = new Map([\n"
        i = reg.find(anchor)
        j = reg.find("]);", i)
        reg = reg[:j] + "  ['%s', %s],\n" % (ch_key, var) + reg[j:]
        notes.append("已注册章键 '%s'" % ch_key)

    if notes:
        open(REGISTRY, "w", encoding="utf-8", newline="\n").write(reg)
    return bool(notes), notes


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ch")
    ap.add_argument("section")
    ap.add_argument("--slug", default=None)
    ap.add_argument("--title-zh", default=None)
    ap.add_argument("--chapter-title-zh", default=None)
    ap.add_argument("--register", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    struct = load_json(STRUCT)
    chapter = find_chapter(struct, args.ch)
    if not chapter:
        print("找不到第 %s 章（data/structure.json）" % args.ch)
        return 2
    sec = find_section(chapter, args.section)
    if not sec:
        print("第 %s 章里找不到节 %s。该章的节有：%s"
              % (args.ch, args.section,
                 [s["title"].split(" ")[0] for s in chapter["sections"]]))
        return 2

    bf = blocks_file(chapter["number"])
    if not bf:
        print("找不到第 %s 章的分块文件（data/blocks/*__ch%s.json）——先跑 tools/03_segment.py"
              % (args.ch, str(chapter["number"]).zfill(2)))
        return 2
    blocks = load_json(bf)

    # 节序号 → key
    secs = [s["title"].split(" ")[0] for s in chapter["sections"]]
    if args.section not in secs:
        print("节 %s 不在 structure.json 的分节列表里：%s" % (args.section, secs))
        return 2
    sec_index = secs.index(args.section)
    key = "s%02d" % (sec_index + 1)

    p0, p1, pdf0, pdf1 = section_page_ranges(chapter, sec)
    blocks["_printed0"], blocks["_printed1"] = p0, p1
    blocks["_pdf0"], blocks["_pdf1"] = pdf0, pdf1
    blocks["_file"] = bf
    blocks["chapter"] = chapter["number"]

    slug_dir = "ch%s-%s" % (str(chapter["number"]).zfill(2) if str(chapter["number"]).isdigit()
                            else str(chapter["number"]).lower(),
                            kebab(chapter["title"].split(" ", 1)[-1], 4))
    file_slug = args.slug or kebab(sec["title"].split(" ", 1)[-1])
    out_dir = os.path.join(CH_DIR, slug_dir)
    out = os.path.join(out_dir, "%s-%s.js" % (key, file_slug))

    checker = Checker()
    text, kept, dropped, pseudo, exs = build_level(
        chapter["number"], args.section, blocks, checker, args.title_zh, {"key": key})

    print("=" * 74)
    print("第 %s 章 %s  →  %s" % (chapter["number"], args.section, sec["title"]))
    print("  原文锚点  印刷页 %d–%d  /  pdf %d–%d" % (p0, p1, pdf0, pdf1))
    print("  输出文件  %s" % os.path.relpath(out, ROOT))
    print("  分块来源  %s" % os.path.relpath(bf, ROOT))
    print("  引述候选  %d 条：采纳 %d，丢弃 %d" % (len(kept) + len(dropped), len(kept), len(dropped)))
    for page, head, why in dropped:
        print("      丢弃 p%-4s %-46s %s" % (page, head.replace("\n", " "), why))
    print("  伪代码    %s" % ("%s（%d 行，p%d）" % (pseudo.get("algo_name"), len(pseudo["lines"]),
                                               pseudo["printed_page"]) if pseudo else "本节没有"))
    print("  书后习题  %d 道%s" % (len(exs), ("：" + "、".join(e["id"] for e in exs)) if exs else ""))
    print("=" * 74)

    if args.dry_run:
        print(text)
        return 0

    if os.path.exists(out):
        print("文件已存在，先删除或换 --slug：%s" % os.path.relpath(out, ROOT))
        return 2
    os.makedirs(out_dir, exist_ok=True)
    with open(out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)
    print("已写出 %s（%d 行）" % (os.path.relpath(out, ROOT), text.count("\n")))

    # 2) 注册
    if args.register:
        titles = [s["title"] for s in chapter["sections"]]
        src_range = (chapter["printed_page"], chapter["pdf_end"] - 1 - 21,
                     chapter["pdf_index"], chapter["pdf_end"] - 1)
        p, ch_text, created = ensure_chapter_file(
            slug_dir, chapter["number"], chapter["title"], args.chapter_title_zh,
            titles, src_range)
        if created:
            with open(p, "w", encoding="utf-8", newline="\n") as fh:
                fh.write(ch_text)
            print("已新建 %s" % os.path.relpath(p, ROOT))
        changed, notes = register(slug_dir, chapter["number"], key,
                                  chapter["title"], args.chapter_title_zh)
        print("注册      %s" % ("；".join(notes) if changed else "已注册，无需改动"))
        if not created:
            print("注意      %s 已存在，请手动确认 levels 数组里有 %s" % (os.path.relpath(p, ROOT), key))
    else:
        print("未注册。加 --register 可自动写进 site/assets/chapters.js")

    # 语法检查放在最后，且**检查整个 site**：chapter.js 是注册时才写出来的，
    # 只查关卡目录会漏掉它（漏过一次，产出的 chapter.js 里有个 `#` 注释，
    # 而它是 chapters.js 静态 import 的 —— 整个站点都加载不了）。
    node = find_node()
    if node:
        # ★ 参数必须显式给 '.'：check-syntax.mjs 的默认值是 'site'，而 cwd 已经是
        #   site/ 了，默认值会解析成 site/site（不存在）→ 静默失败、输出为空。
        r = subprocess.run([node, os.path.join(SITE, "tools", "check-syntax.mjs"), "."],
                           cwd=SITE, capture_output=True, text=True)
        tail = ([l for l in (r.stdout or "").strip().split("\n") if l.strip()] or [""])[-1]
        print("语法检查  %s" % tail)
        if r.returncode != 0:
            print(r.stdout or r.stderr)
            return 1
    else:
        print("（未找到 node，跳过语法检查）")

    # 3) 待办清单
    todos = [(i + 1, ln) for i, ln in enumerate(text.split("\n")) if TODO in ln]
    print()
    print("剩余待办 %d 处（都在上面那个文件里，改完即可跑闸门）：" % len(todos))
    for ln, s in todos[:14]:
        print("  L%-4d %s" % (ln, s.strip()[:96]))
    if len(todos) > 14:
        print("  … 还有 %d 处（grep '【TODO' 自己看）" % (len(todos) - 14))
    print()
    print("下一步：")
    print("  node tools/dump_levels.mjs && python tools/04_verify_level.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
