# -*- coding: utf-8 -*-
"""09_audit_book_exercises.py —— 审计 drill.bookExercises 是否逐字出自原书。

背景：检查 04 长期只看 source/terms/claims/prove 的 `en`，**不看** bookExercises，
      于是「编号对、语气像、内容不是原书那句」的习题能一路过检查
      （2026-09-19 全站复审实测 591 道里 184 道与原书无关）。
      现在检查也补了同一条检查（04 第 8 项），本脚本是它的**逐题报告版**：
      检查用于拦，本脚本用于看全局与定位。

判据（与检查逐字同源）：
  ① 题号必须真的存在于本章语料（编号本身即内容：原书 22.1 只有 6 道题）；
  ② statement 剥掉尾部省略号后，必须在其声明页 ±1 的页窗里**逐字连续**命中；
  ③ page 与原书页不符 → 报「页码漂移」（第 3 版页码就是这么抓出来的）。

用法：
    python tools/09_audit_book_exercises.py            # 汇总 + 问题关卡清单
    python tools/09_audit_book_exercises.py --detail    # 逐题明细
退出码：0 = 全部通过；1 = 有问题
"""
import importlib.util
import json
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
import ex_corpus as EC      # noqa: E402


def chap_key(chapter):
    """关卡侧的章标识，要和语料文件名 __chNN.json 对齐（规则 44：必须零填充）。"""
    for key in ('ch', 'chNo', 'chapter'):
        v = chapter.get(key)
        if v is None:
            continue
        s = str(v)
        return '%02d' % int(s) if s.isdigit() else s.upper()
    m = re.match(r'^ch([0-9A-D]+)', str(chapter.get('slug') or ''))
    return m.group(1).upper() if m else ''


def main():
    detail = '--detail' in sys.argv
    pages = ver.load_pages()
    ranges = EC.chapter_ranges()
    corpus = {k: EC.extract_chapter(pages, lo, hi, ver.qnorm)
              for k, (lo, hi) in ranges.items()}
    levels = json.load(open('tools/_levels.json', encoding='utf-8'))

    total = 0
    bad = {'no-id': 0, 'not-verbatim': 0, 'page': 0}
    worst = []
    for chapter in levels['chapters']:
        cex = corpus.get(chap_key(chapter), {})
        for lv in chapter['levels']:
            rows = []
            for st in lv.get('stages', []):
                if st.get('type') != 'drill':
                    continue
                for e in st.get('bookExercises') or []:
                    total += 1
                    qid = str(e.get('id') or '')
                    stmt = e.get('statement') or ''
                    page = e.get('page')
                    ex = cex.get(qid)
                    if ex is None:
                        bad['no-id'] += 1
                        rows.append((qid, '原书没有这个编号', stmt))
                        continue
                    ok, diag = ver.verify_quote(EC.strip_ellipsis(stmt), page)
                    if not ok:
                        bad['not-verbatim'] += 1
                        rows.append((qid, '不是原书原文：%s' % diag, stmt))
                    elif isinstance(page, int) and page != ex['page']:
                        bad['page'] += 1
                        rows.append((qid, '页码漂移：声明 %s，原书 %s' % (page, ex['page']), stmt))
            if rows:
                worst.append(('%s/%s' % (chapter.get('slug'), lv.get('key')), rows))

    print('bookExercises 总数 : %d' % total)
    print('有问题的关卡       : %d' % len(worst))
    print('  编号不存在 %d / 非原文 %d / 页码漂移 %d'
          % (bad['no-id'], bad['not-verbatim'], bad['page']))
    for ident, rows in worst:
        print()
        print('  %s' % ident)
        for qid, why, stmt in rows:
            print('     %-9s %s' % (qid, why))
            if detail:
                print('              %r' % stmt[:150])
    if not worst:
        print('\n全部逐字命中、编号存在、页码与原书一致。')
    return 1 if worst else 0


if __name__ == '__main__':
    sys.exit(main())
