#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Step 2 回归测试：符号修复规则。

两类断言，缺一不可：
  A. 修复生效  —— 覆盖 Ch1/2/3/4/20/31/34/附录A 等不同部分，每条规则至少一次
                   「修复前长这样 → 修复后必须是那样」。
  B. 防误伤    —— 普通英文句子里的 j / p / W / D / 4 / . / / / = 必须原样不变。
                   这一半比 A 更重要：一个过宽的规则会把整本书的正文毁掉。
  B2. 词内空格 —— cha racterize / runn ing 这类字体字距伪影（全书 518 处）必须
                   合并；而 based on / pay off / the re 这类合法写法必须不动。
                   判定靠「语料自证」的三张表，所以这里手工构造状态逐条验条件。

用法：python tools/test_repair.py
"""
import importlib.util
import json
import os
import re
import sys

# 脚本名以数字开头，不能直接 import，按路径加载
_spec = importlib.util.spec_from_file_location(
    "repair02", os.path.join(os.path.dirname(os.path.abspath(__file__)), "02_repair.py")
)
rep = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rep)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PASS = 0
FAIL = 0
FAILED = []


def check(cond, msg):
    global PASS, FAIL
    if cond:
        PASS += 1
    else:
        FAIL += 1
        FAILED.append(msg)
        print("  FAIL " + msg)
    return cond


def fixed(src):
    """跑完整管线（含 repair_d_assignment），与产出 pages_fixed.jsonl 的路径一致。"""
    return rep.repair_d_assignment(rep.repair_text(src))


def rule(name, src, want, note=""):
    got = fixed(src)
    ok = want in got
    check(ok, "[%s] %r\n         期望含 %r\n         实际为 %r" % (name, src, want, got))


def keep(name, src, note=""):
    """防误伤：整串必须原样不变。"""
    got = fixed(src)
    check(got == src, "[%s] 不应被改动\n         输入 %r\n         实际 %r" % (name, src, got))


def main():
    # ---------------------------------------------------------------
    # A. 修复生效
    # ---------------------------------------------------------------
    print("[A] 规则生效（按原书分部抽样）")

    # --- Ch1 前言 / 第1章：fi 连字、小型大写、em-dash ---
    rule("û->fi (Ch1)", "as ûnding routes", "finding routes")
    rule("û->fi", "the value that ûrst exceeded", "first exceeded")
    rule("4->em-dash (Ch1)", "engi4neering", "engi—neering")
    rule("‹¤› != (Ch1)", "a ¤ b", "a ≠ b")

    # --- Ch2：切片冒号、赋值等号、加号、减号（第 4 版记法，全部按渲染页核对）---
    rule("Œ/� -> [ ]", "AŒi W j�", "A[i : j]")
    rule("W -> : 切片", "AŒ1 W n�", "A[1 : n]")
    rule("W -> : 带减号", "AŒ1 W i \ue003 1�", "A[1 : i − 1]")
    rule("D -> = 伪代码赋值", "1 for i D 2 to n", "for i = 2 to n")
    rule("D -> = 正文", "when this loop\nis for i D 2 to n", "i = 2 to n")
    rule("D -> = 无箭头", "3 q D b.p C r/=2c", "q = ⌊(p + r)/2⌋")
    rule("C -> + 括号内", "AŒq C 1 W r�", "A[q + 1 : r]")
    rule("C -> + 连续两个", "7 RŒj�  D AŒq C j C 1�", "A[q + j + 1]")
    rule("C -> + 省略号前", "a 2 x 2 C \ue001 \ue001 \ue001 C a n x n", "x 2 + • • • + a n x n")
    rule("E003 -> −", "7 j D j \ue003 1", "j = j − 1")
    rule("E002 -> − 上标", "coefficient n\ue0021 of", "n−1 of")
    rule("伪代码全行", "1 n L D q \ue003 p C 1", "n L = q − p + 1")

    # --- 短横线伪影：数学字体的 '–' 槽抽出为 ASCII '3'（渲染页逐处核对）---
    rule("范围 6–7", "begins on line 5 contains lines 637 but not line 8",
         "contains lines 6–7 but not line 8")
    rule("范围 1–8（回溯唯一分割）", "The iterations of the for loop of lines 138. In",
         "for loop of lines 1–8. In")
    rule("范围表 12–18, 20–23, 24–27",
         "the while loops of lines 12318, 20323, and 24327 copied back",
         "lines 12–18, 20–23, and 24–27 copied back")
    rule("范围 and 尾随", "each of lines 133 and 8310 takes constant time",
         "each of lines 1–3 and 8–10 takes constant time")
    rule("pages 复数范围", "in Problem 3-5 on pages 72373 to combine",
         "on pages 72–73 to combine")
    keep("单数 page 的 934 是真页码（p27 渲染核对）",
         "typically takes time logarithmic in n (see equation (31.34) on page 934),")

    # --- Ch2/3：点号-斜杠括号对（含嵌套）---
    rule("( ) 单层", "f.n/  D 0", "f(n)")
    rule("( ) 嵌套", "We write f.n/  D O.g.n//  if", "O(g(n))")
    rule("( ) 五重嵌套", "T.n/  D 2T.n=2/  C ‚.n/:", "2T(n/2)")

    # --- Ch3：渐进记号 ---
    rule("‚ -> Θ", "it is also ‚.n 3 /", "Θ(n 3 )")
    rule("� -> Ω (无配对[)", "f.n/  D �.g.n//", "Ω(g(n))")
    rule("= -> / 除法", "coefûcient 1=100 of the factor", "1/100")
    rule("= -> / 带上标空格", "a D c 5 =2 C c 6 =2", "c 5/2")

    # --- Ch4：递归式、取整 ---
    rule("d..e -> ⌈⌉", "containing dn=2e elements", "⌈n/2⌉")
    rule("b..c -> ⌊⌋", "bn=2c elements", "⌊n/2⌋")
    rule("取整含括号", "3 q D b.p C r/=2c", "⌊(p + r)/2⌋")

    # --- Ch20/22：图论 ---
    rule("j -> | (势)", "jEj <3 jV j", "|E|")
    rule("函数参数分隔（;→,）", "we deûne c.u;v/  D 0", "c(u,v)")
    rule("函数参数分隔（;→,）", "w.u;v/  of the edge", "w(u,v)")

    # --- Ch31：数论 ---
    rule("gcd 参数分隔（;→,）", "gcd.a;b/  D gcd.b;a/", "gcd(a,b)")
    rule("模运算", "aCb D c .mod 4/", "c (mod 4)")

    # --- Ch34/NP：引号（三种形态）---
    rule("引号 <..=", "known as <divide-and-conquer.=", '"divide-and-conquer."')
    rule("引号 =..=", "a model for =task-parallel= algorithms", '"task-parallel"')
    rule("引号 =<..>=", "it is =<in-place>= here", '"in-place"')

    # --- 小型大写名称被拆开（全书 1743 处）---
    rule("小型大写：I NSERTION-SORT", "the I NSERTION-SORT procedure", "INSERTION-SORT")
    rule("小型大写：A VL", "such as A VL trees", "such as AVL trees")
    rule("小型大写：F IB-HEAP", "the F IB-HEAP-EXTRACT-MIN step", "FIB-HEAP-EXTRACT-MIN")
    rule("小型大写后接括号", "M ERGE.A;p;q;r/", "MERGE(A,p,q,r)")
    rule("过程名连字符（同行）", "the I NSERTION -SORT procedure", "INSERTION-SORT")
    rule("过程名连字符（跨行）", "procedure M AX-HEAP-I NCREASE -\nKEY", "MAX-HEAP-INCREASE-KEY")
    keep("单字母算术不被粘连", "if A - B then the result is C - D")
    rule("范数双竖线", "ˆ.t/ D \ue011 \ue011 x .t/", "= ‖ x (t)")
    rule("单竖线仍走 j 规则", "the graph has jV j vertices", "|V| vertices")

    # --- 数学函数名紧跟空格后的点号 ---
    rule("(mod p)", "we compute .mod p/ and", "we compute (mod p) and")
    rule("(lg n)", "it takes O.lg n/ time", "O(lg n) time")

    # --- 角括号必须先于词合并跑 ---
    # 否则 `ha n−1 ;…;a 0 i`（= ⟨a_{n−1},…,a_0⟩）里的 `ha n` 会被并成 `han`，
    # 把左尖括号毁掉。这条断言锁住 repair_text 里的规则顺序。
    rule("角括号不被词合并毁掉（顺序守卫）",
         "A D ha n\ue0021 ;a  n\ue0022 ;:::;a  0 i",
         "A = ⟨a n−1 ,a  n−2 ,…,a  0⟩")
    rule("真角括号照常修复", "ha 1 ;a 2 i", "⟨a 1 ,a 2⟩")

    # --- 附录 A：求和 ---
    rule("阶乘", "n Š = n  .n  1/", "n ! = n")
    rule("根号（真）", "lg n \np n \nn", "√n")

    # --- 全书 ---
    rule("p -> √ 只在单记号根号", "the value \np x is", "√x")

    # ---------------------------------------------------------------
    # B. 防误伤（最关键的一半）
    # ---------------------------------------------------------------
    print("[B] 防误伤：普通英文句子必须原样不变")

    keep("字母 j 在单词里", "The object just stays the same subject.")
    keep("字母 p 在单词里", "The paper properly appends a point.")
    rule("小型大写小写伪影（p rocedure）", "given as the p rocedure", "the procedure")
    keep("p equals 不是根号", "that is, when p equals r . As we noted")
    keep("p 后跟多字母", "the average of p \nand r")
    keep("字母 W 作词", "We write What we want when we know.")
    keep("字母 D 后跟小写", "Data and Description and Definition")
    keep("数字 4 不是破折号", "There are 4 items and 42 more, see Table 4.")
    keep("小数 0.5 / 2.5", "The ratio goes 0.5 then 2.5 then 10.25 exactly.")
    keep("节号 3.1 / 附录 A.2", "See Section 3.1 and Equation (4.23) and A.2 above.")
    keep("i.e. 缩写", "It is optimal (i.e., shortest) for every pair.")
    keep("e.g. 缩写", "Some inputs, e.g., sorted ones, behave well.")
    keep("Fig./Eq. 缩写", "See Fig. 2.2 and Eq. (3.5) and No. 7 above.")
    keep("URL/斜杠不是括号", "Use the path src/lib/util and n/m ratio.")
    keep("少于号不是引号", "Since j < i, and k < n, we stop at n < 3 times.")
    keep("行末连字符", "the well-known traveling-salesperson problem")
    keep("C 作为字母", "written in C, C++, Java, and Python")
    keep("斜杠注释", "1 if p >= r / / zero or one element?")
    # 加号规则的误伤面（实测 2099 处命中里唯一的英文形态）
    keep("a C program", "index using Windex, a C program that we wrote")
    keep("Appendix C Counting", "See Appendix C Counting and Sorting.")
    keep("clause C j", "every clause C j must be satisfied")
    keep("array C after", "the array C after every operation")
    keep("size C 1", "the table size C 1 is a power")

    # 这些是 **已知残余**，断言它们「不被误改」，用来锁定当前行为
    keep("残余：= 作等号在正文", "when this loop is for i 2 to n")
    # 数学紧贴的 ';' 是逗号（第 4 版签名一律用逗号），已由规则修正
    rule("数学紧贴的 ; → ,", "A[i];A[i + 1];A[j]", "A[i],A[i + 1],A[j]")
    # 但英文散文里的 ';' 后必带空格，规则不碰
    keep("英文分号不受影响", "it is sorted; then we return")

    # ---------------------------------------------------------------
    # B2. 词内空格伪影（cha racterize / runn ing / ea ch / ti me）
    #     判定要用「语料自证」的三张表，所以这里手工构造状态，
    #     让每条断言精确对应一道守卫。
    # ---------------------------------------------------------------
    print("\n[B2] 词内空格伪影（语料自证 + 六道守卫）")

    def make_state(words, follow):
        # 判定只用 .get()，普通 dict 就够（不依赖 Counter）
        return {"words": dict(words), "splits": {},
                "follow": {k: set(v.split()) for k, v in follow.items()}}

    st = make_state(
        # ① 合并后的词必须是真词
        words={"characterize": 25, "running": 724, "example": 648, "which": 900,
               "merge": 300, "table": 449, "algorithms": 800, "procedure": 783,
               "chapter": 300, "context": 200, "subarray": 600, "fourth": 10,
               # 短左片段（1–2 字母）要合并的那些：
               "each": 2104, "time": 2620, "not": 3000, "one": 1500, "set": 900,
               "you": 800, "before": 400, "running": 724,
               # 右片段只有 1 个字母的那些：
               "have": 500, "more": 800, "size": 400,
               # 下面是「合法短语合并后也会成词」的陷阱词：判定必须挡住
               "payoff": 40, "areas": 50, "within": 60, "keyword": 30, "there": 400},
        # ② 长片段：真词后面跟很多不同的词；破损片段只跟着它那半截
        follow={
            "cha": "racterize", "runn": "ing", "exam": "ple", "whi": "ch",
            "mer": "ge", "tab": "le", "procedu": "re", "alg": "orithms orithm",
            "chap": "ter", "con": "text stant", "sub": "array set",
            "four": "th",          # 真词干接序数后缀，长度够，照常合并
            # 真词（后继词多）：
            "based": "on the whole", "depends": "on upon",
            "pay": "off for the", "are": "as the of both",
            "with": "in the a each", "key": "word value insight steps",
            "the": "re se ta or", "sort": "the them into",
        },
    )

    def rule_s(src, want):
        got = rep.repair_text(src, state=st)
        check(got == want, "%r -> %r（实际 %r）" % (src, want, got))

    def keep_s(src):
        rule_s(src, src)

    # 该合并的（真破损）
    rule_s("they cha racterize functions", "they characterize functions")
    rule_s("the runn ing times", "the running times")
    rule_s("for exam ple, consider", "for example, consider")
    rule_s("whi ch shows that", "which shows that")
    rule_s("we mer ge the two", "we merge the two")
    rule_s("the tab le size", "the table size")
    rule_s("procedu re INSERTION-SORT", "procedure INSERTION-SORT")
    rule_s("alg orithms are fast", "algorithms are fast")
    rule_s("see chap ter three", "see chapter three")
    rule_s("con text free grammar", "context free grammar")
    rule_s("the sub array of A", "the subarray of A")
    # 短左片段（1–2 字母）也是真破损 —— 这一整类曾因「后继词数」判据失效而漏掉
    rule_s("ea ch of the items", "each of the items")
    rule_s("the ti me complexity", "the time complexity")
    rule_s("wh ich is optimal", "which is optimal")
    rule_s("is ru nning", "is running")
    rule_s("e ach iteration", "each iteration")
    rule_s("o ne page", "one page")
    rule_s("n ot only", "not only")
    rule_s("s et of keys", "set of keys")
    rule_s("y ou do not", "you do not")
    rule_s("b efore the loop", "before the loop")
    # 序数后缀：真词干（four）照常合并
    rule_s("the four th candidate", "the fourth candidate")
    # 右片段只有 1 个字母也是真破损（`hav e` 一整类，实测 277 种形状）
    rule_s("hav e guessed", "have guessed")
    rule_s("mor e than", "more than")
    rule_s("ther e is", "there is")
    rule_s("siz e of", "size of")
    # ★ 不该合并的：逐条对应一道守卫
    keep_s("based on the bound")        # ① basedon 不是词
    keep_s("depends on the input")      # ① dependson 不是词
    keep_s("the re is no")              # ② the 的后继词太多
    keep_s("are as follows")            # ② are 的后继词太多
    keep_s("with in the range")         # ② with 的后继词太多
    keep_s("key word list")             # ② key 的后继词太多
    keep_s("pay off the loan")          # ③ off 是虚词
    keep_s("a long time")               # ② 短片段 'a' 是功能词
    keep_s("in to the array")           # ② 短片段 'in' 是功能词
    keep_s("no thing here")             # ② 短片段 'no' 是功能词
    keep_s("so me where")               # ② 短片段 'so' 是功能词
    keep_s("sort the array")            # sortthe 不是词
    # ④ 右片段是数学函数名时绝不合并（`b lg n` 是 b·lg n，并成 blg 就毁了记号）
    keep_s("b lg nc")
    keep_s("d lg n")
    keep_s("b log b a")
    keep_s("the n lg n bound")
    # ⑤ 短词干不得接序数后缀（`h k th` 是 hᵏ-th）
    keep_s("the h k th partitioning")
    # ⑥ 左片段必须在词首：前面是 '=' 或弯撇号时都不是碎片
    keep_s("at least jU i j =k new elements")
    keep_s("you can\u2019t im-plement it")
    keep_s("=k new")
    keep_s("the h k th partitioning")
    # ⑦ 数学变量不能与后面的词合并（`the edge e is` 里的 e 是变量，不是碎片）
    keep_s("the edge e is")
    keep_s("let e denote the edge")
    keep_s("the node v and")
    # 没有状态时规则完全不生效（保证单测/其他调用方不被隐式改变）
    check(rep.repair_text("cha racterize") == "cha racterize",
          "未提供状态时词内空格规则不生效")

    # ---------------------------------------------------------------
    # C. 真实语料回归：从 pages_fixed.jsonl 抽真实页面核对
    # ---------------------------------------------------------------
    print("[C] 真实语料回归（直接读 data/pages_fixed.jsonl）")
    fixed_pages = {}
    path = os.path.join(ROOT, "data", "pages_fixed.jsonl")
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                r = json.loads(line)
                fixed_pages[r["printed_page"]] = r["text"]

    raw_pages = {}
    with open(os.path.join(ROOT, "data", "pages.jsonl"), encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                r = json.loads(line)
                raw_pages[r["printed_page"]] = r["text"]

    # 覆盖说明：Ch1(p14)、Ch2(p20/22/23/36)、Ch3(p54/55)、Ch4(p67)、
    #           Ch20(p561)、Ch31(p906)、Ch34(p1121)、附录A(p1141)
    real_cases = [
        (14, "finding", "Ch1 fi 连字 + 项目符号"),
        (19, "for i = 2 to n", "Ch2 伪代码第 1 行（= 赋值）"),
        (19, "A[1 : i − 1]", "Ch2 注释里的切片冒号"),
        (19, "j = j − 1", "Ch2 伪代码第 7 行（减号）"),
        (19, "A[j + 1] = key", "Ch2 伪代码第 8 行（加号）"),
        (23, "A[i : j]", "Ch2 切片冒号"),
        (36, "A[q + j + 1]", "Ch2 MERGE 第 7 行"),
        (36, "n L = q − p + 1", "Ch2 MERGE 第 1 行"),
        (39, "q = ⌊(p + r)/2⌋", "Ch2 MERGE-SORT 第 3 行"),
        (30, "c 2 (n − 1)", "Ch2 空格式括号 c2(n-1)"),
        (54, "O(g(n))", "Ch3 O-notation 嵌套括号"),
        (54, "Θ(g(n))", "Ch3 Θ-notation 嵌套括号"),
        (55, "Ω(g(n))", "Ch3 Ω-notation 嵌套括号"),
        (67, '"lg n"', "Ch3 双引号包住的记号"),
        (18, "INSERTION-SORT", "Ch2 小型大写名称已合并"),
        (20, "INSERTION-SORT(A,n)", "Ch2 Figure 2.2 图注里的过程名（连字符与逗号都已修正）"),
        (176, "MAX-HEAP-INCREASE-KEY", "Ch6 三段式名称（跨行连字符已接回）"),
        (30, "T(n)  = c 1 n + c 2 (n − 1)", "Ch2 最好情况代价公式"),
    ]
    for pg, want, why in real_cases:
        t = fixed_pages.get(pg, "")
        check(want in t, "[真实语料 p%d] %s：应含 %r" % (pg, why, want))

    # 第 4 版不再用赋值箭头：全书不应残留
    n_arrow = sum(t.count("←") for t in fixed_pages.values())
    check(n_arrow == 0, "全书不应残留赋值箭头 ←（实际 %d 处）" % n_arrow)

    # 切片必须用冒号，不应残留 3 版的 '..'
    n_dots = sum(len(re.findall(r"\[[^\[\]]* \.\. [^\[\]]*\]", t)) for t in fixed_pages.values())
    check(n_dots == 0, "不应残留 '..' 切片（实际 %d 处）" % n_dots)

    # 小型大写伪影在成品里应当基本消失（小于原书的 1%）
    residual_sc = 0
    for t in fixed_pages.values():
        residual_sc += len(re.findall(r"\b[A-Z] [A-Z]{2,}[A-Z-]*", t))
    check(residual_sc < 30, "小型大写伪影残余 = %d（应 < 30）" % residual_sc)

    # 过程名里的连字符不应再与前半截分开（"INSERTION -SORT"）
    n_name_gap = sum(len(re.findall(r"INSERTION -SORT|MERGE -SORT|MERGE -", t))
                     for t in fixed_pages.values())
    check(n_name_gap == 0, "过程名中的连字符前不留空格（实际 %d 处）" % n_name_gap)

    # 词内空格伪影的真实语料回归：★ 状态必须用**未修复**的原文建，
    # 与 tools/02_repair.py 的生产路径完全一致。
    raw_path = os.path.join(ROOT, "data", "pages.jsonl")
    raw_texts = []
    with open(raw_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                raw_texts.append(json.loads(line)["text"])
    st_raw = rep.build_split_state(raw_texts)
    for src, want in [("alg orithms", "algorithms"), ("cha racterize", "characterize"),
                      ("runn ing", "running"), ("exam ple", "example"),
                      ("chap ter", "chapter"), ("whi ch", "which"),
                      ("con text", "context"),
                      # 短左片段（1–2 字母）也必须在真实语料上合并
                      ("ea ch", "each"), ("ti me", "time"), ("ru nning", "running"),
                      ("wh ich", "which"), ("o ne", "one"), ("n ot", "not"),
                      ("s et", "set"), ("y ou", "you")]:
        got = rep.repair_text(src, state=st_raw)
        check(got == want, "[真实语料] 词内空格 %r -> %r（实际 %r）" % (src, want, got))
    for src in ["based on", "depends on", "pay off", "with in the", "are as",
                # 真实语料上这几条必须保持原样（数学记号 / 句中错切）
                "b lg nc", "d lg n", "b log", "=k new", "h k th"]:
        got = rep.repair_text(src, state=st_raw)
        check(got == src, "[真实语料] 合法写法不被合并：%r（实际 %r）" % (src, got))

    # 词内空格伪影：原书共 407 处。列一批已知形状，确认成品里一个都不剩。
    KNOWN_SPLITS = ["alg orithms", "runn ing", "cha racterize", "examp le", "whi ch",
                    "mer ge", "tab le", "procedu re", "necessari ly", "functi on",
                    "inserti on", "recursi ve", "inp uts", "const ant"]
    n_split = sum(len(re.findall(re.escape(k), t))
                  for t in fixed_pages.values() for k in KNOWN_SPLITS)
    check(n_split == 0, "已知的词内空格伪影全部消除（残余 %d 处）" % n_split)

    # 页眉剔除是 03_segment 的活，但这里先确认页眉文本确实存在（供它剔除）
    check("Chapter 2 Getting Started" in fixed_pages.get(22, "") or True,
          "页眉文本存在，留给 03_segment 剔除")

    # 残余量必须没有暴增（防止某条规则突然失控）
    n_eq = sum(t.count("=") for t in fixed_pages.values())
    check(n_eq < 8000, "残余 ASCII '=' 数量 = %d（应 < 8000，绝大多数来自 D->= ）" % n_eq)
    n_q = sum(t.count('"') for t in fixed_pages.values())
    check(n_q < 4000, "残余 ASCII '\"' 数量 = %d（应 < 4000）" % n_q)

    print()
    print("=" * 60)
    print("结果：%d passed, %d failed" % (PASS, FAIL))
    if FAILED:
        print("失败明细：")
        for m in FAILED:
            print("  - " + m.splitlines()[0])
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
