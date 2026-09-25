# -*- coding: utf-8 -*-
"""11_align_printed.py —— 把 source.printed 的终点抬到「覆盖本节自己的习题页」。

问题：检查第 6 项拿 source.printed[1] 当页码上界，凡是 page > printed[1] 的
      引用都要求 preview:true。不少关卡把终点写得比本节窄（只声明本关用到的页），
      于是**本节末尾的习题页**被误判成「越界前向引用」。

口径（规则 42 / tools/05_new_level.py 的生成规则）：
    本节权威区间 = [structure.printed_page, structure.pdf_end − 22]
    （pdf_end 是独占的，相邻节满足 pdf_end(k) == pdf_index(k+1)，
      所以终点折回「下一节首页 − 1」的印刷页。）

本脚本**只抬终点、只抬到权威终点、且只为「确实引用了这些页」的关卡抬**：
    新终点 = max(现终点, min(权威终点 + 1, 本关所有页码引用的最大值))
  （+1 是检查自己的容差：本节习题常排在下一节首页顶部，而 structure 的
    pdf_end 是独占的，两者恰好差一页。）
起点不动 —— 起点写得窄是刻意的保守（交接文档 §6.2 明示不要大面积统一口径）。
若某关引用的页超出本节权威区间 +1，那才是真问题，脚本只报告不改。

用法：
    python tools/11_align_printed.py            # 试运行，打印将要抬的关卡
    python tools/11_align_printed.py --apply    # 写盘
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# 直接复用检查的遍历：它认 preview:true（带标记的后续页引用是合法的），
# 自己再写一遍只会在「该不该抬终点」上得出不同结论。
import importlib.util as _ilu
_spec = _ilu.spec_from_file_location('ver04', os.path.join(ROOT, 'tools', '04_verify_level.py'))
ver = _ilu.module_from_spec(_spec)
_spec.loader.exec_module(ver)


def collect_pages(level):
    """关卡里「检查会拦」的整数页码：preview:true 子树下的引用不计。"""
    acc = []
    ver.walk_pages(level, '', acc)
    out = []
    for r in acc:
        if r['preview']:
            continue
        vals = r['page'] if isinstance(r['page'], list) else [r['page']]
        out += [v for v in vals if isinstance(v, int)]
    return out


def struct():
    """(章号, 节号) -> 本节权威印刷页区间。"""
    s = json.load(open('data/structure.json', encoding='utf-8'))
    out = {}
    for part in s.get('parts', []):
        for ch in part.get('chapters', []):
            num = str(ch.get('number'))
            secs = ch.get('sections') or {}
            for sec in (secs.values() if isinstance(secs, dict) else secs):
                sid = str(sec.get('title', '')).split(' ')[0]
                if sid and sec.get('pdf_end'):
                    out[(num, sid)] = (sec['printed_page'], sec['pdf_end'] - 22)
    return out


def main():
    apply = '--apply' in sys.argv
    st = struct()
    levels = json.load(open('tools/_levels.json', encoding='utf-8'))
    plan, over, already = [], [], 0
    for c in levels['chapters']:
        num = str(c.get('ch'))
        for lv in c['levels']:
            auth = st.get((num, str(lv.get('section'))))
            path = os.path.join('site/chapters', c['slug'], lv['file'])
            tag = '%s/%s' % (c['slug'], lv['key'])
            if auth is None or not os.path.exists(path):
                over.append('  [无权威区间/缺文件] %s' % tag)
                continue
            printed = (lv.get('source') or {}).get('printed') or []
            if len(printed) != 2:
                over.append('  [source.printed 异常] %s %s' % (tag, printed))
                continue
            refs = collect_pages(lv)
            if not refs:
                already += 1
                continue
            want = max(refs)
            # 检查本身留了 ±1 页容差（本节习题常排在下一节首页顶部，
            # 而 structure 的 pdf_end 是独占的，正好差一页）。
            if want <= printed[1] + 1:
                already += 1
                continue
            if want > auth[1] + 1:
                over.append('  [引用越出本节] %s 引用 pp.%d，本节到 pp.%d'
                            % (tag, want, auth[1]))
                continue
            plan.append((tag, path, printed[1], min(auth[1] + 1, want), auth))
    for tag, path, cur, new, auth in plan:
        print('  %-46s printed[1] %d -> %d（本节到 %d）' % (tag, cur, new, auth[1]))
    for o in over:
        print(o)
    if apply:
        for tag, path, cur, new, auth in plan:
            t = open(path, encoding='utf-8').read()
            m = re.search(r"(printed\s*:\s*\[\s*\d+\s*,\s*)(\d+)(\s*\])", t)
            assert m, path
            assert int(m.group(2)) == cur, (path, m.group(2), cur)
            open(path, 'w', encoding='utf-8').write(
                t[:m.start(2)] + str(new) + t[m.end(2):])
    print('模式 %s：无需改动 %d / 待抬终点 %d / 需人工 %d'
          % ('写盘' if apply else '试运行', already, len(plan), len(over)))


if __name__ == '__main__':
    main()
