# -*- coding: utf-8 -*-
"""ex_corpus.py —— 从 data/pages_fixed.jsonl 里按**版面**抽出原书习题，作为 bookExercises 的地面真值。

为什么不用 data/blocks 的 exercise 块：
    分段器把题干里的显示公式切成了独立块（p170 的 `6.3-2 Show that ⌊ n/2 h+1 ⌋`
    与下一块 `≥ 1/2 for 0 ≤ h ≤ blg nc.` 本是一句），块级文本因此**半句即止**；
    而块与块之间又混着下一节的正文，向前拼接会把别处的句子吞进来。
    逐页版面状态机没有这个问题 —— 语料里题号要么独占一行、要么与题干同行，
    且一定在行首。

被三处共用：
    tools/10_sync_book_exercises.py  按编号逐字回填关卡
    tools/09_audit_book_exercises.py 审计关卡是否逐字
    tools/04_verify_level.py         闸门第 8 项检查（习题原文溯源 + 编号存在性）
"""
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 章末 Problems 的题干是跨页长文（含 a. b. c. 小问），整题照抄最长的一条有 2400 字，
# 会把这些条目变成页面上一整堵墙；截到 1200 字的句末并补省略号（36 条里只截到 4 条）。
# 省略号不是原文的一部分，溯源校验前要先剥掉。
CAP = {'exercise': 10 ** 9, 'problem': 1200}

# 原书题号可带难度前缀：* / ** / *** = 难度，? = 需要本书之外的知识。
ID_LINE = re.compile(r'^([*★⋆?]{0,3})\s*(\d+(?:\.\d+)?-\d+)(?:\s+(.*))?$')
# 收题的版面标志：下一节标题 / 章末版面头（题号本身在 ID_LINE 里已处理）。
# ★ 行首可能先排着难度标记 —— p531 的 `? 19.4 Analysis of union by rank …` 就是
#   节标题而不是题干；不放过这个前缀，整节正文会被当成上一道习题的尾巴吞进来。
_HEAD = r'(?:[A-D]|\d+)(?:\.\d+){1,2} [A-Z]'          # '6.4 The heapsort algorithm'
_HEAD_LABEL = r'(?:Exercises|Problems|Chapter notes|Bibliographic notes|' \
              r'Notes|Open problems|Appendix [A-D] |Part [IVX]+ )'
# 节标题允许后面还跟着正文（语料里标题与正文常常并到同一行），
# 而版面头必须整行就是这个标签，否则「Problems of interest…」这类正文会被误杀。
STOP_LINE = re.compile(r'^[*★⋆?\s]*(?:%s|%s\s*$)' % (_HEAD, _HEAD_LABEL))
# 兜底：语料有时把「上一题的最后一行」与「下一节标题（甚至其正文）」并成一行，
# 行首判据就拦不住。题干里再出现「编号 + 两个实词」这种节标题形状，一律切断。
HEADING_MID = re.compile(r'\s(?:[A-D]|\d+)(?:\.\d+){1,2} [A-Z][a-z]+ [A-Za-z]')
STAR = re.compile(r'^([*★⋆?]{1,3})\s*')


def chapter_ranges():
    """章标识（'02'…'35'、'A'…'D'）-> (首印刷页, 末印刷页 + 2 页溢出余量)。"""
    out = {}
    for path in glob.glob(os.path.join(ROOT, 'data', 'blocks', '*__ch*.json')):
        key = re.search(r'__ch([0-9A-D]+)\.json$', os.path.basename(path)).group(1)
        d = json.load(open(path, encoding='utf-8'))
        pgs = {b.get('printed_page') for b in d.get('blocks', []) if b.get('printed_page')}
        if pgs:
            out[key] = (min(pgs), max(pgs) + 2)
    return out


def extract_chapter(pages, lo, hi, qn, caps=None):
    """在本章页范围内抽题：id -> {id, statement, page, star, mark}。

    qn 必须传闸门的 qnorm —— 全项目只有一套引述归一化（规则 7）。

    caps 覆盖默认截断上限（{'exercise': …, 'problem': …}）。默认是给**关卡内**
    列出的习题用的（题干太长会变成一堵墙）；章末挑战页要的是整题原文，
    所以那边显式传一个不截断的 caps —— 同一套状态机、同一套判据，只是取全长。
    """
    caps = caps or CAP
    found = {}
    cur = None                      # [id, printed_page, [题干行], 难度前缀]

    def flush(item):
        _flush(found, item, qn, caps)
    seq = []                        # (印刷页, 行) —— 展平后才能在看下一页时回查
    for printed in sorted(p for p in range(lo, hi + 1) if p in pages):
        for raw in pages[printed].split('\n'):
            if raw.strip():
                seq.append((printed, raw.strip()))
    for i, (printed, ln) in enumerate(seq):
        m = ID_LINE.match(ln)
        if m:
            flush(cur)
            tail = (m.group(3) or '').strip()
            # 第 5 个元素记「题目最后一行的所在页」：章末长题常跨 3–4 页，
            # 只声明起始页会让闸门的 ±1 页窗覆盖不到整题（见 13_publish_problems.py）。
            cur = [m.group(2), printed, [tail] if tail else [], m.group(1) or '', printed]
            continue
        if cur is not None and STOP_LINE.match(ln):
            flush(cur)
            cur = None
            continue
        if cur is not None:
            # 页底的脚注行排成「上标数字 + 空格 + 大写字母」（p24 的
            # `8 Python’s tuple notation …` 就是脚注，不是 2.1-2 的题干）。
            # 题干已经成句 + 下一行长这样 → 收题。
            acc = ' '.join(cur[2]).rstrip()
            if re.search(r"[.!?…]$", acc) and re.match(r'^\d\s+\S', ln):
                flush(cur)
                cur = None
                continue
            cur[2].append(ln)
            cur[4] = printed
        # 翻页要不要收题？语料里题干常跨页续写（6.5-7 的循环不变量整个排在下一页，
        # 页尾只剩「…loop invariant:」；13.4-7 断在「lines 5–6 are」），
        # 每页都收会把题干砍成半句；一句说完了又不续，2.1-2 就会把下一页顶部的
        # SUM-ARRAY 伪代码吞进题干。判据两头都顾上：
        #   「本行已是句末」且「下一页顶行像另起一段」→ 收题。
        last_line_of_page = i + 1 == len(seq) or seq[i + 1][0] != printed
        if cur is not None and last_line_of_page and cur[2]:
            nxt = seq[i + 1][1] if i + 1 < len(seq) else ''
            done = re.search(r"[.!?…]$", ln)
            fresh = re.match(r"^[A-Z0-9'‘“(\[⟨⌊ƒ•]", nxt)
            if done and fresh:
                flush(cur)
                cur = None
    flush(cur)
    return found


def _flush(found, cur, qn, caps=None):
    """收一题：折叠空白、剥难度标记、按类型截断，每题只取首次出现。"""
    if not cur:
        return
    caps = caps or CAP
    qid, printed, parts, mark, end_page = cur
    body = re.sub(r'\s+', ' ', ' '.join(parts)).strip()
    ms = STAR.match(body)           # 题号与题干之间也可能排着难度标记
    if ms:
        mark = mark or ms.group(1)
        body = body[ms.end():].strip()
    cap = caps['problem'] if '.' not in qid else caps['exercise']
    if len(body) > cap:
        cut = body[:cap]
        k = max(cut.rfind('. '), cut.rfind('? '), cut.rfind('! '))
        body = (cut[:k + 1].strip() if k > 60 else cut.strip()) + ' …'
    star = len(mark) if mark and '?' not in mark else 0
    if qid not in found and len(qn(body)) >= 6:
        found[qid] = {'id': qid, 'statement': body, 'page': printed,
                      'end_page': end_page, 'star': star, 'mark': mark}


def strip_ellipsis(s):
    """剥掉尾部省略号（那是「只引了题干前半」的截断标记，不是原文）。"""
    return re.sub(r'\s*[.…]+\s*$', '', s or '')
