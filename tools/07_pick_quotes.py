#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""07_pick_quotes.py —— 引述挑选 / 预检 / 正文提取（写关卡时的第一道工序）。

为什么需要这个工具
==================
全项目最大的风险点是**英文引述的溯源**：检查（tools/04_verify_level.py）要求每条 `en`
的字「一个不缺、按原序」出现在声明页 ±1 的窗口里，**没有相似度阈值**。所以写关卡时
反复出现同一个浪费的循环：

    挑一条引述 → 写进文件 → 跑检查 → 报"溯源失败" → 回去改 → 再跑

两轮实战（第 5、6 章）里这个循环出现了几十次。本工具把判据**前移**：
挑的时候就用检查自己的 `verify_quote` 判一遍，通过与否当场知道。
「生成即合规」这条原则，从 05_new_level.py（骨架）扩展到了手写引述。

判据只有一个入口
================
本工具**不自己实现任何比对**，它 import tools/04_verify_level.py 的 `verify_quote`。
这条约束来自真实教训：项目曾同时存在「折叠空白」与 `qnorm` 两套归一化，
术语卡走了弱的那套，于是 `random-access machine` 在语料 `randomaccessma- chine`
上永远匹配不上（见 docs/关卡编写手册.md 第 16 条）。新增工具绝不能再造第二套判据。

用法
====
    # ① 挑：列出某节里所有能通过检查的引述候选（附页码与块下标）
    python tools/07_pick_quotes.py pick 6 6.5
    python tools/07_pick_quotes.py pick 6 6.5 --from 20 --to 30 --min 90
    python tools/07_pick_quotes.py pick 6 6.5 --fail      # 只看不通过的，用于排查

    # ② 检：把已经写好的一组引述逐条过判据（JSON: [{"en": "...", "page": 178}, ...]）
    python tools/07_pick_quotes.py check my_quotes.json

    # ③ 看：按块下标打印完整正文（挑选时看上下文，块是句子的碎片时尤其需要）
    python tools/07_pick_quotes.py show 6 6.5 7 8 12

    # ④ 自检：确认本工具与检查判据一致（改了 04 之后跑一下）
    python tools/07_pick_quotes.py selftest

关于「节的块下标」
==================
`blocks` 是按节过滤后的列表，所以下标是**节内**下标（不是整章的）。
`pick` 默认列出全节，输出里的 `[i]` 就是节内下标，可以直接喂给 `show`。
"""
import argparse
import glob
import importlib.util
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOCKS_DIR = os.path.join(ROOT, 'data', 'blocks')
TODO_EXIT = 1

# 引用候选的块类型：正文与各类定理/图注都可能被引；习题与伪代码一般不作为 en 引述
QUOTABLE = ('body', 'lemma', 'theorem', 'corollary', 'definition',
            'example', 'proof', 'figure-caption')


def load_verifier():
    """加载检查模块（判据的唯一入口）。"""
    path = os.path.join(ROOT, 'tools', '04_verify_level.py')
    if not os.path.exists(path):
        sys.stderr.write('找不到 tools/04_verify_level.py —— 本工具依赖它的 verify_quote\n')
        return None
    spec = importlib.util.spec_from_file_location('ver04', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def find_blocks_file(ch):
    """章号 -> data/blocks 下的文件名。也允许直接给文件路径。"""
    if os.path.sep in ch or ch.endswith('.json'):
        p = ch if os.path.isabs(ch) else os.path.join(ROOT, ch)
        return p if os.path.exists(p) else None
    key = str(ch).zfill(2) if str(ch).isdigit() else str(ch).upper()
    hits = glob.glob(os.path.join(BLOCKS_DIR, '*__ch%s.json' % key))
    return hits[0] if hits else None


def section_blocks(path, section):
    data = json.load(open(path, encoding='utf-8'))
    return [b for b in data.get('blocks', []) if str(b.get('section')) == str(section)]


def cmd_pick(args, ver):
    path = find_blocks_file(args.ch)
    if not path:
        print('找不到第 %s 章的语料分块文件（data/blocks/*__ch%s.json）'
              % (args.ch, str(args.ch).zfill(2)))
        return 2
    bs = section_blocks(path, args.section)
    if not bs:
        print('在 %s 里找不到节 %s。该文件里的节有：%s'
              % (os.path.basename(path), args.section,
                 sorted({str(b.get('section')) for b in bs or []}) or '（空）'))
        return 2

    lo = args.start if args.start is not None else 0
    hi = args.end if args.end is not None else len(bs)
    print('# %s  节 %s  块 %d..%d（共 %d 块）'
          % (os.path.basename(path), args.section, lo, min(hi, len(bs)) - 1, len(bs)))
    print()

    n_pass = n_fail = 0
    for i in range(lo, min(hi, len(bs))):
        b = bs[i]
        if b['type'] not in QUOTABLE:
            continue
        text = b['text']
        if len(text) < args.min:
            continue
        ok, diag = ver.verify_quote(text, b['printed_page'])
        if ok:
            n_pass += 1
        else:
            n_fail += 1
        if args.fail_only and ok:
            continue
        if args.pass_only and not ok:
            continue
        print('--- [%d] p%s %s %s' % (i, b['printed_page'], b['type'], 'PASS' if ok else 'FAIL'))
        if ok:
            print(text)
        else:
            print('    (%s)' % diag[:160])
            print('    ' + text[:160].replace('\n', ' '))

    print()
    print('==== 可用 %d 条，不可用 %d 条（min=%d，类型限 %s）===='
          % (n_pass, n_fail, args.min, '/'.join(QUOTABLE)))
    print('提示：把 PASS 的正文写进关卡文件的 en 字段；要省略就用 … 标出，')
    print('      省略号两侧各自仍必须是**逐字连续**的原文。')
    return 0


def cmd_check(args, ver):
    items = json.load(open(args.json, encoding='utf-8'))
    if not isinstance(items, list):
        print('JSON 顶层必须是数组：[{"en": "...", "page": 178}, ...]')
        return 2
    bad = 0
    for i, it in enumerate(items):
        ok, diag = ver.verify_quote(it['en'], it['page'], is_term=bool(it.get('is_term')))
        if not ok:
            bad += 1
        print('%s [%2d] p%-4s %s' % ('PASS' if ok else 'FAIL', i, it['page'],
                                    it['en'][:76].replace('\n', ' ')))
        if not ok:
            print('        -> %s' % diag[:240])
    print()
    print('==== %d 条，%d 条不通过 ====' % (len(items), bad))
    return TODO_EXIT if bad else 0


def cmd_show(args, ver):
    path = find_blocks_file(args.ch)
    if not path:
        print('找不到第 %s 章的语料分块文件' % args.ch)
        return 2
    bs = section_blocks(path, args.section)
    for i in args.index:
        if not (0 <= i < len(bs)):
            print('--- [%d] 越界（该节共 %d 块）' % (i, len(bs)))
            continue
        b = bs[i]
        print('--- [%d] p%s %s' % (i, b['printed_page'], b['type']))
        print(b['text'])
        print()
    return 0


# 自检用的固定用例：与检查判据必须一致（改 04 之后跑这个）
#
# ★ 最后一条是**已知边界**，不是本工具或检查"写错了"：检查为了容忍行内字距伪影，
#   给「极小夹带」留了口子（单段 ≤2 字符、总计 ≤4 字符）。所以删掉 1–2 个字符
#   的篡改仍可能漏过 —— 这条边界记录在 docs/reports/Q1-质量审计.md 里。
#   把它写进自检，是为了让"边界在哪"变成可执行的记录，而不是靠记忆。
SELFTEST = [
    # (en, page, 期望通过?)
    ('A priority queue is a data structure for maintaining a set S of elements, '
     'each with an associated value called a key.', 173, True),
    # 人为换词（maintaining -> keeping）：检查必须拦住
    ('A priority queue is a data structure for keeping a set S of elements, '
     'each with an associated value called a key.', 173, False),
    # 人为删掉一个长词（priority）：检查必须拦住
    ('A priority queue is a data structure for maintaining a set S of elements, '
     'each with an associated value called a key.'.replace('priority ', ''), 173, False),
    # 页码错：检查必须拦住（这条内容在第 173 页，不在第 100 页）
    ('A priority queue is a data structure for maintaining a set S of elements, '
     'each with an associated value called a key.', 100, False),
    # 省略号分段：两段各自逐字，必须通过
    ('Each node of the tree corresponds to an element of the array. … '
     'A max-heap viewed as (a) a binary tree and (b) an array.', 161, True),
    # ★ 已知边界：删一个字符仍会通过（极小夹带预算内）
    ('A priority queue is a data structure for maintaining a set  of elements, '
     'each with an associated value called a key.'.replace('set  ', 'set '), 173, True),
]


def cmd_selftest(args, ver):
    bad = 0
    for en, page, want in SELFTEST:
        ok, _ = ver.verify_quote(en, page)
        good = (ok == want)
        if not good:
            bad += 1
        print('%s p%-4s 期望 %s 实际 %s  %s'
              % ('OK  ' if good else 'FAIL', page, want, ok, en[:66].replace('\n', ' ')))
    print()
    print('==== 自检 %d 条，%d 条与预期不符 ====' % (len(SELFTEST), bad))
    if bad:
        print('★ 这通常意味着 tools/04_verify_level.py 的判据变了 ——')
        print('  请确认是有意改动，然后同步更新本文件的 SELFTEST。')
    return TODO_EXIT if bad else 0


def main():
    ap = argparse.ArgumentParser(description='引述挑选 / 预检 / 正文提取')
    sub = ap.add_subparsers(dest='cmd', required=True)

    p1 = sub.add_parser('pick', help='列出某节里能通过检查的引述候选')
    p1.add_argument('ch', help='章号（如 6）或语料文件路径')
    p1.add_argument('section', help='节号（如 6.5）')
    p1.add_argument('--from', dest='start', type=int, default=None, help='起始块下标（节内）')
    p1.add_argument('--to', dest='end', type=int, default=None, help='结束块下标（不含）')
    p1.add_argument('--min', dest='min', type=int, default=60, help='引述最短长度，默认 60')
    p1.add_argument('--fail', dest='fail_only', action='store_true', help='只列不通过的')
    p1.add_argument('--pass-only', dest='pass_only', action='store_true', help='只列通过的')

    p2 = sub.add_parser('check', help='把一组引述逐条过判据')
    p2.add_argument('json', help='JSON 文件：[{"en": "...", "page": 178}, ...]')

    p3 = sub.add_parser('show', help='按块下标打印完整正文')
    p3.add_argument('ch')
    p3.add_argument('section')
    p3.add_argument('index', nargs='+', type=int)

    sub.add_parser('selftest', help='自检：确认本工具与检查判据一致')

    args = ap.parse_args()
    ver = load_verifier()
    if ver is None:
        return 2
    return {'pick': cmd_pick, 'check': cmd_check,
            'show': cmd_show, 'selftest': cmd_selftest}[args.cmd](args, ver)


if __name__ == '__main__':
    sys.exit(main())
