"""把关卡文件里的 @@Q|page|start|end@@ 占位符替换成**语料原文**的精确切片。

用法：
    python tools/08_fill_quotes.py <关卡文件> [<关卡文件> ...]

占位符格式（单引号 JS 字符串内使用）：
    @@Q|834|Theorem 28.1|inversion)@@
    @@Q|840|LU decomposition of a symmetric|division by 0.@@

- page   ：语料块上的 printed_page（检查按 ±1 取干草堆，所以只要对得上块）
- start  ：块文本中出现的起始片段（空格折叠后比对）
- end    ：结束片段（含）；留空则取 start 之后的第一个句号

替换结果会把空白折叠成单空格，并把 ' 转义成 \\u2019、ASCII 引号转义。
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN = re.compile(r"@@Q\|(\d+)\|(.*?)\|(.*?)@@")


def load_blocks():
    out = []
    for f in glob.glob(os.path.join(ROOT, 'data/blocks/*.json')):
        import json
        d = json.load(open(f, encoding='utf-8'))
        for b in d.get('blocks', []):
            t = b.get('text') or ''
            if t:
                out.append((b.get('printed_page'), re.sub(r'\s+', ' ', t).strip()))
    return out


def esc(s):
    s = s.replace('\\', '\\\\').replace("'", '\u2019')
    return s


def main():
    blocks = load_blocks()
    for path in sys.argv[1:]:
        t = open(path, encoding='utf-8').read()
        # 容错：占位符忘了写收尾的 @@（直接接在字符串引号前）时自动补上
        # 兼容只写了两个竖线的简写：@@Q|page|start@@（缺 end 字段）—— 用 start 的尾部当 end
        two_pipe = re.compile(r"@@Q\|(\d+)\|([^|@]{4,})@@")
        t, nfix2 = two_pipe.subn(lambda m: "@@Q|%s|%s|%s@@" % (m.group(1), m.group(2), m.group(2)[-12:].strip()), t)
        if nfix2:
            print('%s: 规范了 %d 个两竖线占位符' % (os.path.basename(path), nfix2))
        missing_close = re.compile(r"(@@Q\|\d+\|[^|']*\|[^|']*)(?<!@@)'")
        t, nfix = missing_close.subn(lambda m: m.group(1) + "@@'", t)
        if nfix:
            print('%s: 自动补上 %d 个缺失的 @@ 收尾' % (os.path.basename(path), nfix))
        miss = []

        def sub(m):
            page = int(m.group(1))
            start = m.group(2)
            end = m.group(3)
            for pg, txt in blocks:
                if pg is None or abs(pg - page) > 1:
                    continue
                i = txt.find(start)
                if i < 0:
                    continue
                if end:
                    # 从 i 开始找（而不是 i + len(start)）：end 允许落在 start 内部，
                    # 否则 start 已经到句子末尾时永远找不到 end（曾经因此漏填一条）。
                    j = txt.find(end, i)
                    if j < 0:
                        continue
                    seg = txt[i:j + len(end)]
                else:
                    j = txt.find('.', i + len(start))
                    seg = txt[i:j + 1] if j > 0 else txt[i:i + 200]
                return esc(seg)
            miss.append(m.group(0))
            return m.group(0)

        t2 = TOKEN.sub(sub, t)
        open(path, 'w', encoding='utf-8', newline='\n').write(t2)
        left = TOKEN.findall(t2)
        print('%-58s 替换 %d 处%s' % (os.path.basename(path),
                                     len(TOKEN.findall(t)) - len(left),
                                     ('  未命中: ' + str(miss)) if miss else ''))
        if left:
            print('    ！仍有未替换的占位符：', [x[1][:40] for x in left])


main()
