# -*- coding: utf-8 -*-
"""10_sync_book_exercises.py —— 把关卡里的「原书习题」逐字回填成原书原文。

背景（检查盲区，见作者本地报告《内容复审-2026-09-19》§二）：
    04_verify_level.py 只校验 source/terms/claims/prove 的 en，
    **完全不看** drill.bookExercises[].statement。于是「按编号凭印象重写一遍」
    不会被拦住 —— 读者看到「原书习题 22.1-2」，页面文本却与原书无关。

为什么不能用 data/blocks 的 exercise 块直接当文本源：见 tools/ex_corpus.py
（分段器把题干里的显示公式切成了独立块，块级文本半句即止）。
本脚本用**逐页版面状态机**从 data/pages_fixed.jsonl 取整句原文。

产出：每条 statement 都是页窗内的**连续原文**，因此必然通过检查的 verify_quote
      —— 写盘前逐条过一遍 verify_quote，过不了就不写（生成即合规）。
用法：
    python tools/10_sync_book_exercises.py --report           # 只看清单
    python tools/10_sync_book_exercises.py --apply            # 全站写盘
    python tools/10_sync_book_exercises.py --apply 22 18      # 只写指定章
"""
import glob
import importlib.util
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

sys.path.insert(0, os.path.join(ROOT, 'tools'))
_spec = importlib.util.spec_from_file_location('ver04',
                                               os.path.join(ROOT, 'tools', '04_verify_level.py'))
ver = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ver)
qnorm, verify_quote = ver.qnorm, ver.verify_quote

import ex_corpus as EC      # noqa: E402  语料侧抽题（与检查、09 共用同一份）
chapter_pages = EC.chapter_ranges
extract_chapter = lambda pages, lo, hi: EC.extract_chapter(pages, lo, hi, qnorm)


# ---------------------------------------------------------------------------
# 关卡侧：定位并改写 bookExercises 里的值
# ---------------------------------------------------------------------------

def _scan_string(t, i):
    """从 t[i] 的引号起走到闭合引号，返回结束位置（指向引号本身）。"""
    q = t[i]
    i += 1
    while i < len(t):
        if t[i] == '\\':
            i += 2
            continue
        if t[i] == q:
            return i
        i += 1
    return -1


def _objs(t, start):
    """t[start] == '[' —— 返回其中每个顶层 '{' 的 (begin, end)。

    ★ 深度要同时数 `[` 与 `{`：bookExercises 里 `page: [33, 34]` 这种
      页码区间会把只数方括号的版本带到 depth=2，那条之后的对象再也匹配不上，
      于是整段被静默跳过（本轮在 ch02/s02 的 2.2-3 上踩到）。
    """
    out, depth, i, open_at = [], 0, start, None
    while i < len(t):
        c = t[i]
        if c in "'\"":
            j = _scan_string(t, i)
            if j < 0:
                break
            i = j + 1
            continue
        if c in '[{':
            depth += 1                       # 进到这里时 depth==1 就是那条 bookExercises 数组
            if c == '{' and depth == 2:      # 数组的「第 2 层」才是里面的对象
                open_at = i
        elif c in ']}':
            if c == '}' and depth == 2 and open_at is not None:
                out.append((open_at, i))
                open_at = None
            elif c == ']' and depth == 1:
                break
            depth -= 1
        i += 1
    return out


def _vals(t, ob, oe):
    """对象体内的 key -> (值起点, 值终点)（字符串含引号本身）。"""
    out, i = {}, ob
    while i <= oe:
        c = t[i]
        if c in "'\"":
            i = _scan_string(t, i) + 1
            continue
        m = re.match(r'(\w+)\s*:\s*', t[i:oe + 1])
        if m:
            key = m.group(1)
            j = i + m.end()
            if j <= oe and t[j] in "'\"":
                k = _scan_string(t, j)
                # ★ 长句在关卡里常写成 `'…' +\n  '…'` 的串接：值范围必须一路吃到
                #   最后一个字面量，否则只替换第一段，剩下的 `'+' '旧尾'` 会留在
                #   文件里变成重复文本（本轮踩过：ch02/s01 的 2.1-1 变成两句拼接）。
                while True:
                    nxt = re.match(r'\s*\+\s*', t[k + 1:oe + 1])
                    if not nxt:
                        break
                    p = k + 1 + nxt.end()
                    if p > oe or t[p] not in "'\"":
                        break
                    k = _scan_string(t, p)
                out[key] = (j, k)
            else:
                mm = re.match(r'[^,}\s]+', t[j:oe + 1])
                out[key] = (j, j + (mm.end() if mm else 0) - 1)
            i = j
            continue
        i += 1
    return out


def js_concat_text(t, si, sj):
    """取出一段「字符串字面量串接表达式」的文本内容（含被 `'a' + 'b'` 拆开的长句）。"""
    parts, i = [], si
    while i <= sj:
        c = t[i]
        if c in "'\"":
            j = _scan_string(t, i)
            parts.append(js_unescape(t[i + 1:j]))
            i = j + 1
            continue
        i += 1
    return ''.join(parts)


def js_unescape(s):
    """把 JS 字符串字面量里的转义还原（关卡里只用到 \\n \\t 与 \\uXXXX 两类）。"""
    def rep(e):
        if e[0] in 'uU' and len(e) == 5:
            return chr(int(e[1:], 16))
        if e[0] in 'xX' and len(e) == 3:
            return chr(int(e[1:], 16))
        return {'n': '\n', 't': '\t'}.get(e, e)
    return re.sub(r"\\(u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2}|.)",
                  lambda m: rep(m.group(1)), s)


def js_str(text, quote):
    """把语料文本放进 JS 字符串；优先沿用原引号风格，装不下才切换。

    ★ 与 tools/08_fill_quotes.py 同一套约定：正文里的 ASCII 撇号换成 U+2019
      （语料本就是 U+2019，检查按码点比对，换成别的撇号会被拒），
      反斜杠转义；这样单引号字符串不需要 `\'`，避免规则 21 那类提前闭合。
    """
    s = text.replace('\\', '\\\\').replace("'", '\u2019')
    if quote == '"':
        return '"' + s.replace('"', '\\"') + '"'
    return "'" + s + "'"


def level_files():
    out = []
    for d in sorted(glob.glob('site/chapters/*')):
        for f in sorted(glob.glob(os.path.join(d, 's*.js'))):
            out.append((os.path.basename(d), f))
    return out


def chapter_of(slug):
    m = re.match(r'^ch([0-9A-D]+)', slug)
    if not m:
        return None
    k = m.group(1)
    return k.upper() if k.isalpha() else '%02d' % int(k)


# ---------------------------------------------------------------------------

def main():
    apply = '--apply' in sys.argv
    report = '--report' in sys.argv
    only = {a for a in sys.argv[1:] if not a.startswith('--')}
    pages = ver.load_pages()
    ranges = chapter_pages()
    corpus = {k: extract_chapter(pages, lo, hi) for k, (lo, hi) in ranges.items()}

    stats = {'same': 0, 'fill': 0, 'no-id': 0, 'bad-verify': 0, 'files': 0}
    lines = []
    for slug, path in level_files():
        ck = chapter_of(slug)
        if only and ck not in only and not any(o in path for o in only):
            continue
        cex = corpus.get(ck, {})
        t = open(path, encoding='utf-8').read()
        edits = []
        for m in re.finditer(r'bookExercises\s*:\s*\[', t):
            ob = m.end() - 1
            for b, e in _objs(t, ob):
                vals = _vals(t, b, e)
                if 'statement' not in vals or 'id' not in vals:
                    continue
                si, sj = vals['statement']
                quote = t[si]
                old = js_concat_text(t, si, sj)
                ii, ij = vals['id']
                qid = t[ii + 1:ij]
                ex = cex.get(qid)
                if ex is None:
                    stats['no-id'] += 1
                    lines.append('  [编号不存在] %s  %s  %r' % (path, qid, old[:60]))
                    continue
                new = ex['statement']
                # 尾部省略号是「本关只引了题干前半」的标记，不是原文的一部分：
                # verify_quote 会把 … 折成 '.' 去页窗里找，因此校验前先剥掉。
                # （09 审计与新增的检查同样先剥尾省略号。）
                ok, diag = verify_quote(EC.strip_ellipsis(new), ex['page'])
                if not ok:
                    # 逐字性由检查同一判据把关；过不了就绝不写盘（规则 5）。
                    stats['bad-verify'] += 1
                    lines.append('  [抽取未过检查] %s %s p%s :: %s'
                                 % (path, qid, ex['page'], diag[:110]))
                    continue
                if qnorm(old.rstrip(' .…')) == qnorm(new.rstrip(' .…')):
                    stats['same'] += 1
                else:
                    stats['fill'] += 1
                    edits.append((si, sj, js_str(new, quote)))
                    lines.append('  [%s] %s %s\n      旧 %r\n      新 %r'
                                 % ('回填' if report or apply else '待回填',
                                    path, qid, old[:100], new[:100]))
                pi = vals.get('page')
                # 只改「单个整数」的页码；写成 page: [33, 34] 的区间值是刻意的
                # （那道题横跨两页），替换成单个数字会把数组撑坏。
                if pi and t[pi[0]:pi[1] + 1].strip().isdigit() and \
                        int(t[pi[0]:pi[1] + 1]) != ex['page']:
                    edits.append((pi[0], pi[1], str(ex['page'])))
                    lines.append('      [页码] %s %s: %s -> %s'
                                 % (path, qid, t[pi[0]:pi[1] + 1].strip(), ex['page']))
        if not edits:
            continue
        stats['files'] += 1
        for a, b, s in sorted(edits, reverse=True):
            t = t[:a] + s + t[b + 1:]
        if apply:
            open(path, 'w', encoding='utf-8').write(t)

    print('模式: %s' % ('写盘' if apply else '试运行'))
    print('逐字已一致 %d / 待回填 %d / 编号不存在 %d / 抽取未过检查 %d / 改动文件 %d'
          % (stats['same'], stats['fill'], stats['no-id'], stats['bad-verify'],
             stats['files']))
    open('tools/_probe/ex_fill_log.txt', 'w', encoding='utf-8').write('\n'.join(lines))
    print('明细见 tools/_probe/ex_fill_log.txt')


if __name__ == '__main__':
    main()
