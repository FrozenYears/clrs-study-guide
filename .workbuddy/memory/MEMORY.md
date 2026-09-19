# 项目长期记忆 · CLRS 交互式闯关学习站

## 项目定位
把《算法导论》第 4 版（2022，1312 页）拆成可视化、可交互、代码严谨的前端闯关章节站。
读者定位：**有 C 语言基础、无算法基础**。

- 书：第 4 版。8 部分 / 35 章 + 4 附录 / 149 节。
- 页码换算：`pdf_index（0 基）= 印刷页码 + 21`。
- 关卡模型：**九段式**（位置感 → 直觉 → 原文 → 伪代码 → 动手看见 → 双轨实现 →
  复杂度 → 正确性 → 闯关测验），章末加 Boss 区（原书 Problems）。
  **一节一关是默认，不是铁律**：某一节长到装不下时会按原书自己的小节号拆开。
  目前只有 5.4（38.5K 字符、含四个独立例子）拆成了 s04–s07 四关，
  于是第 5 章有 7 关而只有 4 节。`site/index.html` 的 `STRUCTURE[].count`
  因此是「**关卡数**」而不是「节数」。
- 技术栈：**零构建静态站 + 原生 ES Module**，无 npm 无打包。
- 代码轨道：**伪代码 + C**（用户选了这两轨）。动画另有一份后台 JS 生成器驱动画面，
  默认折叠、纳入测试。

## 硬规则（违反会毁掉整本书的内容）

1. **符号映射一律以「渲染原页图像 + 打印命中上下文」为准**，不得凭推断，也不得沿用
   任何未核实的映射表。已验证的映射见 `.workbuddy/memory/2026-09-14.md`。
   具体教训：早期版本把 `U+E003`(=减号) 映射成 `+`、把 `D`(=等号) 映射成 `←`、
   把 `W` 映射成 `..`，三项全错，且都是「看起来合理」的错。
   第 4 版记法：赋值用 `=`（不是 `←`）、切片用 `A[p : q]`（不是 `A[p .. q]`）。
2. **站内所有英文引用必须逐字取自 `data/pages_fixed.jsonl`，不得凭记忆写。**
   教训：早期 agent 记的 Figure 2.4 示例数组是错的，实际是 ⟨12, 3, 7, 9, 14, 6, 11, 2⟩。
3. **切片扫描器不得跨过结构的最后一行**。教训：伪代码扫描器越界吞掉 11393 行正文
   （约占全书两成），修完后正文块从 10190 恢复到 12284。
4. 章节内容按 `data/blocks/<part-slug>__ch<NN>.json` 取材，一章一个文件，
   并行开发时一个 agent 只碰自己那一章。
5. **写完关卡必须跑合规闸门**：`node tools/dump_levels.mjs && python tools/04_verify_level.py`，
   要求 0 ERROR。它断言每条英文引述的字**一个不缺、按原序**出现在声明页 ±1 的窗口里，
   并校验内嵌 C 与 `c/*.c` 一致、解锁链接有效、术语卡有出处。**没有相似度阈值**。
6. **页眉剥离正则必须形状严格，且全项目只有一套**（`03_segment.py` 的 `RUNHEAD_RES`，
   `04_verify_level.py` 复用）。教训：宽松版 `^(?:\d+ )?(?:Chapter|Part|Appendix)\s+\d+.*$`
   把正文句 `Chapter 4 presents the "master theorem," …` 整行删掉，导致该页引述永远比对失败
   且现场看不出原因。
7. **引述比对只有一个入口且必须用 `qnorm`**（去空白、去连字符、下标折数字、省略号折点、
   弯引号折直）。教训：曾并存「折叠空白」与 `qnorm` 两套，术语卡走了弱的那套，
   `random-access machine` 在语料 `randomaccessma- chine` 上永远匹配不上。
8. **关卡里内嵌的 C 代码块必须与 `c/*.c` 逐字节一致**，改一份就同步另一份
   （闸门会查；此前 s01/s03 都漂移过）。
9. **写一关的标准流程**（详见 `docs/关卡编写手册.md`）：
   ① `python tools/05_new_level.py <章> <节> --register` 生成骨架（引述/伪代码/习题会自动
   逐字填好并自检）；② 填掉所有 `【TODO …】`；③ `node tools/dump_levels.mjs &&
   python tools/04_verify_level.py` 直到 0 ERROR、0 TODO。
10. **`chapter.js` 只 import 已建好的关卡文件**——它被 `site/assets/chapters.js` 静态 import，
   引入不存在的文件会让整个站点加载失败。JS 注释是 `//`，不是 `#`。
11. **改语料解析规则时，审计必须在 `data/pages.jsonl`（未修复原文）上做**。修复后的文本里
   伪影已经消失，拿它当依据会得出完全错误的结论（这一条真的白跑过一轮）。
12. **视觉方向 = 教科书编辑部风**（2026-09 定，用户选的）：三种声音（display 衬线书的身份 /
   黑体界面与讲解 / 衬线书页）、纸墨配色（单一墨蓝强调色，不用纯黑）、圆角只 2/4/6px、
   立体感来自发丝线而非阴影、进度用离散刻度不用进度条。
   完整规则在 `docs/开发规范.md` 七·五，**写新组件前必读**。
13. **零网络资源是硬红线**：不能引 Google Fonts / CDN / 任何外链资源。字体栈只能落在系统
   已装字体上（本机有思源宋体、思源黑体、Palatino、Georgia、Cascadia Code）。
14. **站点已发布上线**：`https://clrs-algo-quest.app.workbuddy.host/`（静态站）。
   注意：**发布同意不跨轮次**——改完内容要同步线上，必须用户在新消息里明确要求。
15. **闸门只看得见 `chapter.js` 的 `levels` 数组里登记过的关卡**。
   `dump_levels.mjs` 是逐章 import `chapter.js` 再取 `ch.levels` —— 新建的关卡文件
   不登记就**不会被检查**，跑出来的「0 ERROR」是假的。教训：给并行子代理下过
   「不许碰 chapter.js」的指令，于是它们的自我验收全是空转（有一个自己发现并加了
   「临时注册」注释）。正确做法：允许子代理临时登记自己的关卡用于验收，协调者最后收口。
16. **子代理会死于限流（429），而文件可能已经写完**。教训：两个 5.4 子代理报 429 退出，
   但 24.5K / 33.2K 的关卡文件已完整落盘。**一律以磁盘文件为准重新验收**，
   既不要把「没报告」当成「没干活」，也不要把代理的汇报当成验收结果。
17. **伪代码的地面真值是渲染页，不是语料**。第 6 章的语料把 `l = LEFT(i)` 抽成
   `l DLEFT(i)`、把 `A.heap-size` 抽成 `A: heap-size`（那个伪影是**句点**不是冒号）、
   并且**丢掉了全部缩进**。缩进在关卡里是手工补的（`s01-insertion-sort.js` 就有前导空格）。
18. **概率类关卡的自检要用卡方，不要拍「偏差 < x%」**。后者与样本量挂钩（N 大时抽样噪声
   本身超过阈值，必然假失败）。判据写「χ² < 3×自由度」，因为这个统计量的期望恰等于自由度。
   另外 PRNG 用「线性同余 + 取模」会把洗牌洗歪（低位周期为 2，n=4 时偏 17%）；
   即使换 xorshift32，**连续种子**仍因线性映射而相关（偏 9%）——种子必须先做乘法混合。
19. **katex 渲染器的静态扫描**（`__tests-katex__.mjs` 第 [11] 段）会列出「关卡用了但
   渲染器没实现」的 `\命令`。不实现它们页面不会报错、不会白屏，只会把 `\binom` 原样显示
   出来 —— 所以新引入命令时**先补实现**：`\binom` 要两层堆叠（复用 `.frac` 会画出除号横线），
   `\overline` 要用 span 顶线（组合字符只盖得住最后一个字符）。
   注意测试跑在极简 DOM 垫片上，`textContent` **只有 getter**，新节点一律用 `createTextNode`。
20. **纯文本渲染的字段不能放 LaTeX**：`stage.title` 与 `pseudocode.more[].subtitle`
   走的是 `h('h3', {}, '…' + sub)`，**没有** renderMixed —— 放了 `$\Theta(1)$`
   页面就原样显示反斜杠。可以放 LaTeX 的是 `mathKit[].title`、表格单元格、
   `claims[].when`、`zh`、`body`、`note`。新增字段前先确认它走不走 renderMixed。
21. **闸门把「被 import 的关卡有语法错」报成 `chapter.js 加载失败`**。
   看到这条 ERROR 要顺着 import 链去找真正的坏文件，别盯着 chapter.js 看。
   容易触发的一类写法：在单引号字符串里写 `BUILD-MAX-HEAP$\'$` ——
   `\'` 会提前结束字符串。撇号请用 Unicode `′`。
22. **要拿去支撑结论的统计量，实验里必须先 printf 出原始数字**。
   教训：`INCREASE-KEY` / `INSERT` 的上浮循环漏了比较计数，"反复插入建堆"的比较次数
   恒为 0，而**没有任何断言覆盖这个量** —— 是打印出来的数字暴露的。
   另外别凭直觉写不等式：关于两种建堆法比较次数的两条断言实测都不成立，
   改成「先打印、看清数字再写断言」后才留下真正成立的三条。
23. **`code` 阶段的 `c:{…}` 必须自己闭合**，写成
   `c:{file:'x.c',code:String.raw\`…\`,` + `notes:[…]},` + `tests:[…]` + `mapping:[…]},`。
   把 `notes` 的结尾写成 `}],` 而漏掉那个 `}`，`tests`/`mapping` 就被塞进 `c` 里，
   下一个阶段会报 `Unexpected token '{'`，而**闸门只报「chapter.js 加载失败」**，
   现场完全看不出来。已知排查手法：`node --check <关卡文件>` 定位报错阶段，
   再数 `{`/`}` 深度（`tools/_probe/fixnotes.py` 可一键修这个模式）。
   同一类错误还有两种变体（`tree` 帧少一个 `}`、panel 对象后多一个 `},`），
   症状一样 —— 所以**写完一关先 `node --check`，再谈闸门**。
24. **未登记的关卡不会被闸门检查**（第 15 条的具体后果）：本轮 s04 没注册成功时
   闸门照样报「0 ERROR / 54 关」，而关卡文件里还留着 `@@C_CODE@@` 占位。
   **看闸门结论前先核对关数**（`tools/_levels.json` 里该章 `levels` 的长度），
   关数不对就说明文件根本没被读进去。
25. **`git add -A <路径>` 里混进被 `.gitignore` 忽略的目录（如 `tools/_probe`）会让整条
   `add` 失败**，后面挂在 `&&` 上的 `git commit` 根本不执行 —— 而命令末尾的
   `git log` 仍会打印旧提交，容易误以为已提交。**提交后一定核对 `git log --oneline -1`
   的哈希变了**。

## 环境坑（本机）

- **Git Bash 的 PATH 是坏的**：`ls`/`mkdir`/`head`/`tail`/`dirname` 全部 command not found。
  文件操作用 PowerShell 工具，或直接用 Python 绝对路径执行脚本。
- **PowerShell 工具在此环境不回显 stdout**：要看输出就用 Python 打印，或写进文件再读。
- Python：`C:\Users\FrozenYears\.workbuddy\binaries\python\versions\3.13.12\python.exe`
  （已装 pypdf 6.18.0、pymupdf 1.28.2）
- Node：`C:\Users\FrozenYears\.workbuddy\binaries\node\versions\22.22.2-3\node.exe`
- Chrome：`C:\Program Files\Google\Chrome\Application\chrome.exe`（可用无头模式做真实渲染验证）

## 验证习惯（必须保持）

- 不能只靠语法检查。站点改动要用无头 Chrome dump DOM，逐路由断言关键片段；
  交互逻辑另写功能自检页（`site/_dev/`）。
- 每次改 PDF 解析规则后，必须重跑 `tools/test_repair.py` 与 `tools/test_segment.py`
  （后者依赖前者产出的 `pages_fixed.jsonl`），再重跑 `tools/03_segment.py`。
- 临时探针脚本统一 `tools/_*` 前缀，已在 `.gitignore` 中；工作结束时清理。
- 提交信息用英文，格式 `类型: 简述`。

26. **静态树帧用 json.dumps 生成，不要手写括号**。viz:'tree' 的嵌套闭合
   （叶 } → children ] → 结点 } → 外层 } → trees ]）手写极易错一环，
   node --check 只报"Unexpected token"不告诉你是哪层。解法：
   Python 里建 dict，`"trees:[{root:" + json.dumps(tree, ensure_ascii=False) + "}],"`
   —— JS 对象字面量兼容 JSON 的双引号字符串。
27. **伪代码下标是 1 基，C 数组是 0 基**。CLRS 的 B-TREE-SPLIT-CHILD(s,1)
   在 0 基实现里是 child[0] —— 直接照抄伪代码下标会段错误。照搬任何
   "第 i 个孩子/第 i 个键"的伪代码行时先换算。
28. **渲染器符号表现在有**：\setminus \uparrow \downarrow \backslash \Phi \Xi \odot；
   仍不支持 \pmod（带参数）与 \mathrel。新命令先跑
   `node site/assets/core/__tests-katex__.mjs`（[11] 段全站扫描）。

29. **引述一律用占位符 + `tools/08_fill_quotes.py` 填充，不要手抄**。写法
    `en:'@@Q|页码|起始片段|结束片段@@'`，脚本会从 `data/blocks/*.json` 取出
    **语料原文切片**替换它。三个边界：① 结束片段可能落在起始片段**内部**，
    所以查找要从 `txt.find(end, i)` 起；② 占位符里**不能出现 `|`**
    （`|V|` 会让正则失效，改用别的片段）；③ 忘了写结束字段（只有两个竖线）
    会被脚本自动规范，但最好一次写全。跑完看输出里的「未命中」与「仍有未替换」。
30. **闸门读的是 `tools/_levels.json`**：改了关卡文件必须先跑
    `node tools/dump_levels.mjs` 再跑 `04_verify_level.py`，否则验的是上一版
    （这一轮因此白查过一次"引述找不到"）。
31. **纯文本字段的完整清单**：`stage.title`、`prove.steps[].title`、
    `pseudocode.more[].subtitle` 都**不走** renderMixed，放 `$...$` 会把反斜杠
    原样印在页面上。闸门已加 WARN 级检查（第 3b 段）；渲染器符号表已扩到
    `\det \odot \Phi \Xi \leadsto \rightsquigarrow \cos \sin \tan \nmid`。

32. **占位符引述的三件套**：08_fill_quotes.py（语料切片，主力）→ 08 的兜底不足时
    _probe/autofill2.py（声明页 ±1 自动选句，保证闸门过但 zh 未必贴切）→
    _probe/fixquote.py（修 statement/en 外层引号误包）。
    另外 derivations/steps 里 `{zh:'…', '…'}` 坏对象用 autofix.py 的 BROKEN 正则拆分。
33. **ch34/35 已全部建成（2026-09-18，136 关/34 章，提交 f2e240f）**：全书 35 章闭环。
    gen34.py 半成品生成器已无用（05_new_level.py --register 直接可用，勿再绕道）。
34. **图表 `expr` 是要 eval 的 JS，变量是 `n` 不是 `x`**：growth 渲染器用
    `new Function('n', ...)` 求值（viz/growth.js 第 56 行）。expr 里写 `x` 会
    `ReferenceError`，router 吞掉后**页面空白但不报错不白屏**——只有无头 Chrome
    抓 console 才看得见。写 expr 后必须跑一遍该段的 DOM 抽查。
35. **路由是 `#/章/关/段`**：`#/ch34/s06/s06` 是「第 6 关」而非「第 6 段」；
    章内关数不足时页面显示「这个关卡还没有内容」，这不是 bug。抽查矩阵按
    `#/chNN/s0L/s0stage`（L=关卡、stage=九段序号）生成。
36. **后台 http.server 会被前台命令结束杀掉**：用 Bash 工具的 run_in_background
    起服务；同一条命令里探活不代表下一条命令它还活着（ERR_CONNECTION_REFUSED
    页会被 --dump-dom 当成「渲染结果」，hygiene 全过但内容是错误页）。

37. **05_new_level.py 的附录 id 与闸门不一致**：附录骨架写 id:'appendix/a/sNN'，
    闸门要求 'chA/sNN' —— 生成即错，批量修正；闸门已补附录 URL 归一化
    （#/appendix/<letter>/<关卡>/<阶段> → chX/sNN，tools/04_verify_level.py）。
38. **pseudocode 段不能整段删**：闸门要求九段齐全；原书无伪代码的节保留空段
    （algo:null + lines:[] + note 说明），ch34/35/附录都这么处理。
39. **语料伪影逐字照抄，撇号码点也对齐**：(AB)C 在附录 D 语料里是 .AB/C；
    语料撇号是 U+2019（'），worker 手写 U+2032（′）会被闸门拒——两处都要照抄。
40. **expr 是要 eval 的 JS，变量是 n 不是 x**：growth 渲染器 new Function('n',...)
    （viz/growth.js:56）；写 x 会 ReferenceError 且 router 吞掉后页面空白——
    图表段必须过一遍无头 Chrome 抓 console。
41. **bookExercises 曾是闸门盲区，第 31 轮已收口**：闸门第 5b 项要求 —— 编号在原书里真实存在、
    statement 剥掉尾部省略号后在声明页 ±1 里**整句连续命中**（与 `en` 引述同一条 `verify_quote`）、
    页码与原书该题一致（不符报 WARN）。回填工具 `tools/10_sync_book_exercises.py`（写盘前先过闸门判据），
    逐题明细 `tools/09_audit_book_exercises.py`。现状：590 道三项全过、0 处杜撰编号。
    ★ 原书的 `?` 前缀题号（18.2-4、19.3-5、A.1-4…）与 `**` 难度标记都在 `tools/ex_corpus.py` 里解析出来了。
42. **source.printed 的权威规则**：`printed = [printed_page, pdf_end − 22]`
    （生成器 05_new_level.py 的规则）。`pdf_end` 是**独占**的——TOC 相邻节 110/110 满足
    `pdf_end(k) == pdf_index(k+1)`，所以终点要减到「下一节首页 − 1」。
    `sourceNote` **不参与渲染**（只有 source.printed 会显示成「本节 pp.X–Y」）。
    闸门 04 第 601–612 行的 structure 比对是**死代码**（sinfo 无 printed 键）；只有
    640–648 行真用 `printed[1]` 作引号页上界 → **升它安全，降它可能 ERROR**。
43. **闸门报「引用了本关范围之外的后续页码」时，先查 bookExercises[].page**：
    本轮 4 关/19 道题的习题页码是第 3 版（638/692/700/704），与 source.printed 同源出错。
    真实页在 data/blocks 的 exercise 块里（ch21 21.2-x → p598；ch23 23.1→653-655 /
    23.2→661-662 / 23.3→666-667）。
44. **审计脚本的章标识要对齐**：关卡对象 ch 是整数（2），语料文件名是 __ch02.json，
    不做零填充会让第 1–9 章整体误报——本轮先跑出「70 关有问题」的假结果，是假信号。
45. **答案粗体泄题**：drill options 里的 **…** 经 renderMixed 变成 <strong>，
    正确答案一上屏就是粗的。213 处加粗**全部精确对齐 answer 下标**（作者侧标答案约定），
    故在 site/assets/ui/stages.js 渲染选项时剥掉标记（比改 87 个文件外科）。
    验证手法：无头 Chrome 抓 quiz__opt 里有没有 <strong>。
46. **simulate 题的 expect 必须可数值化**：渲染器走 it.expect.map(Number) 做数字比较，
    放文字 → 学员永远答不对（无任何报错）。已修 14 道。

47. **习题文本的地面真值是「逐页版面」，不是 data/blocks 的 exercise 块**（第 31 轮）：
    分段器把题干里的显示公式切成独立块 —— p170 `6.3-2 Show that ⌊ n/2 h+1 ⌋` 与下一块
    `≥ 1/2 for 0 ≤ h ≤ blg nc.` 本是一句，块级文本因此**半句即止**；向前拼块又会把下一节
    正文吞进来（p170 #92/#93）。正解是 `tools/ex_corpus.py` 的逐页状态机，它自己有三条边界：
    ① 题号要么独占一行要么与题干同行（759 : 160），都要吃；
    ② **翻页只在「本行成句 且 下一页顶行像另起一段」才收题** —— 6.5-7 的循环不变量整个排在
       下一页、13.4-7 断在「lines 5–6 are」，每页都收就砍成半句；页底脚注
       （p24 `8 Python’s tuple notation …`）也不能当题干尾巴；
    ③ 节标题可以带难度前缀（p531 `? 19.4 Analysis of union by rank…`），不认这个前缀
       就会把整节正文吞成上一题的尾巴；再兜一层：题干中途出现「编号 + 实词」形状的节标题就切断。
    产出必然是页窗内的连续原文，所以一定过 `verify_quote`（校验前要剥掉尾部省略号 —— 那是
    「只引了题干前半」的标记，`…` 会被 qnorm 折成 '.' 去页窗里找，反而判失败）。

48. **改关卡文本 = 写扫描器，两处必踩的坑**（第 31 轮）：① 长句写成 `'a' + 'b'` 串接，值范围只取
    第一段字面量 → 回填后旧尾巴留下，拼成一句谁都不是的话（ch02/s01 的 2.1-1）；② 数组值
    `page: [33, 34]` 会让只数方括号的括号深度到 2，之后的对象全匹配不上 → **整段静默不处理**
    （ch02/s02 的 2.2-3 之后全漏）。两条都靠「跑完后按 dump 的条数反查扫描器看到了几条」才发现。
    ★ 反向验证塞了坏数据之后**不要 `git checkout --`**，那会连本轮正当修改一起丢掉。

49. **新写进关卡的 LaTeX 必须先确认渲染器支持**：`__tests-katex__.mjs` 第 [11] 段会列出
    「关卡用了但渲染器不认识」的 `\命令` —— 本轮新 hint 里带进 `\colon` 与 `\pmod`，不报错、
    不白屏，只在页面上印出反斜杠碎片。改完文案要跑一遍这个 83 项自测。

50. **无头 Chrome 抽查要串行 + 预算给够**：`--virtual-time-budget=6000` 且与别的 Chrome 并发时，
    拿到的是约 1.3KB 的 index.html 外壳，看起来像「页面空白故障」（第 31 轮一度误判 9 条路由）。
    给到 20000、串行跑、拿到外壳就重试。另外 `smoke_browser.py` 的断言必须对准**被抽查那一段**：
    本轮修掉 3 条过期断言（`锦标赛` 属于第 9 章、`sentinel` / `负载因子` 不在被抽查的那一段），
    常年飘红的套件等于没有套件。现状 **325/325**。

51. **`tools/_probe/` 不是垃圾桶**（第 31 轮的自伤）：`tools/_*` 虽在 `.gitignore` 里，但
    `docs/交接提示词.md` §2 点名了一批**常备工具**（reinject_c / subc / inject_direct / drill_count /
    run_all_c / hint_io …）—— 被文档引用的就不是临时的，git 与磁盘都没有副本，删了找不回。
    清理前先 `grep -rn "_probe/" docs .workbuddy` 把名单捞出来对齐，只删名单外的。
52. **闸门新增的判据要过三关**：正向（全站 0 ERROR）、**反向**（故意塞假题干/假编号必须报错）、
    以及**统计口径**（结论行报出的数量要与 `_levels.json` / dump 的条数互相印证）。
    第 31 轮靠第三条发现回填工具静默漏了 2 条（扫描器 bug），只看 0 ERROR 是发现不了的。
