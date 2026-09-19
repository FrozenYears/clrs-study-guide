# -*- coding: utf-8 -*-
"""09_audit_book_exercises.py —— 审计 bookExercises 是否逐字出自原书语料。

背景：闸门（04_verify_level.py）只校验 source/terms/claims/prove 里的 `en` 引述，
      **不校验** drill.bookExercises[].statement。于是「把习题凭印象重写一遍」这类
      违规不会被拦住，但页面上读者看到的仍是「原书习题 X.Y-Z」的标签。

判据：把 statement 归一化（复用闸门的 qnorm），去掉首尾省略号，
      取前 70 字符去**本章**语料里找子串。
      命中率 < 阈值的关卡判为「需人工复核」。

用法：
    python tools/09_audit_book_exercises.py              # 汇总 + 列出可疑关卡
    python tools/09_audit_book_exercises.py --detail     # 再加逐题明细
退出码：0 = 全部通过；1 = 存在可疑关卡
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

THRESHOLD = 0.6


def load_qnorm():
    """复用闸门里的 qnorm，保证与引述校验同一套归一化。"""
    path = os.path.join(ROOT, 'tools', '04_verify_level.py')
    src = open(path, encoding='utf-8').read()
    cut = src.find('\ndef main')
    ns = {'__name__': 'gate_prefix', '__file__': path}
    exec(compile(src[:cut] if cut > 0 else src, 'gate_prefix', 'exec'), ns)
    return ns['qnorm']


def load_corpus():
    """章标识 -> 该章全部语料文本（已 qnorm 拼接）。"""
    qnorm = load_qnorm()
    out = {}
    for path in glob.glob('data/blocks/*__ch*.json'):
        m = re.search(r'__ch([0-9A-D]+)\.json$', os.path.basename(path))
        if not m:
            continue
        data = json.load(open(path, encoding='utf-8'))
        if isinstance(data, dict):
            data = data.get('blocks', [])
        out.setdefault(m.group(1), []).append(
            ' '.join(qnorm(b.get('text') or '') for b in data))
    return {k: ' '.join(v) for k, v in out.items()}


def chap_key(chapter):
    for key in ('ch', 'chNo', 'chapter'):
        v = chapter.get(key)
        if v is None:
            continue
        if isinstance(v, int):
            return '%02d' % v
        s = str(v)
        return ('%02d' % int(s)) if s.isdigit() else s
    m = re.match(r'^ch([0-9A-D]+)', str(chapter.get('slug') or ''))
    return m.group(1).upper() if m else ''


def main():
    detail = '--detail' in sys.argv
    qnorm = load_qnorm()
    corpus = load_corpus()
    levels = json.load(open('tools/_levels.json', encoding='utf-8'))

    total = 0
    worst = []
    for chapter in levels['chapters']:
        text = corpus.get(chap_key(chapter), '')
        for lv in chapter['levels']:
            for st in lv.get('stages', []):
                if st.get('type') != 'drill':
                    continue
                exs = st.get('bookExercises') or []
                if not exs:
                    continue
                rows = []
                for e in exs:
                    total += 1
                    q = qnorm(e.get('statement') or '')
                    q = re.sub(r'^[.．…]+', '', q)
                    q = re.sub(r'[.．…]+$', '', q)
                    ok = len(q) >= 40 and q[:70] in text
                    rows.append((e.get('id'), ok, len(q)))
                hit = sum(1 for r in rows if r[1])
                if hit / len(rows) < THRESHOLD:
                    worst.append(('%s/%s' % (chapter.get('slug'), lv.get('key')),
                                  len(rows), hit, rows))

    print('bookExercises 总数 : %d' % total)
    print('命中率 < %d%% 的关卡: %d' % (THRESHOLD * 100, len(worst)))
    print()
    for ident, n, hit, rows in worst:
        print('  %-44s %d/%d' % (ident, hit, n))
        if detail:
            for eid, ok, ln in rows:
                print('       %-10s %s (len=%d)' % (eid, '命中' if ok else '未命中', ln))
    if worst:
        print()
        print('提示：statement 应当从 data/blocks/*.json 的 exercise 块逐字取用；')
        print('      tools/05_new_level.py --register 生成的骨架已自动逐字填好。')
    return 1 if worst else 0


if __name__ == '__main__':
    sys.exit(main())
