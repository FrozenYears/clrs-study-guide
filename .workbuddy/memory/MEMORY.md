# 项目长期记忆 · CLRS 交互式闯关学习站

（2026-09-20 精简整理：原 52 条编号规则按主题合并去重，技术结论未丢。）

## 一、项目定位
《算法导论》第 4 版（2022，1312 页）拆成可视化、可交互、代码严谨的前端闯关章节站。
读者定位：有 C 语言基础、无算法基础。

- 8 部分 / 35 章 + 4 附录；页码换算 `pdf_index(0基) = 印刷页 + 21`。
- 关卡 = 九段式（位置感→直觉→原文→伪代码→动手看见→双轨实现→复杂度→正确性→闯关测验），
  章末加 Boss 区。**一节一关是默认不是铁律**：5.4 太长拆成 s04–s07（全站唯一例外），
  故 `index.html` 的 `STRUCTURE[].count` 是「关卡数」不是节数。
- 技术栈：零构建静态站 + 原生 ES Module，无 npm 无打包。代码轨 = 伪代码 + C。
  动画另有后台 JS 生成器，默认折叠、纳入测试。
- 规模：34 章 / 136+ 关；bookExercises 590 道；冒烟 325/325。
- **已上线** `https://clrs-algo-quest.app.workbuddy.host/`（静态站，部署目录 `site/`）。
  **发布同意不跨轮次** —— 改完要同步线上，必须用户在当轮明确要求。

## 二、内容硬规则（违反会毁掉整本书）

1. 符号映射以「渲染原页 + 打印命中上下文」为准，禁止推断或沿用未核实映射表。
   第 4 版记法：赋值 `=`（非 `←`）、切片 `A[p : q]`（非 `A[p..q]`）。已核映射见 2026-09-14.md。
   早期错例：把 U+E003 当 `+`、把 D 当 `←`、把 W 当 `..` —— 三错都是「看起来合理」的错。
2. 站内英文引用逐字取自 `data/pages_fixed.jsonl`，禁凭记忆。错例：Figure 2.4 数组实为
   ⟨12, 3, 7, 9, 14, 6, 11, 2⟩。
3. 引述一律用占位符 `en:'@@Q|页码|起始片段|结束片段@@'` + `tools/08_fill_quotes.py` 填充，
   禁手抄。三边界：结束片段可能落在起始片段内部（要从 `txt.find(end, i)` 起）；占位符内不能
   出现 `|`；两竖线会被脚本自动规范。兜底链：08 → `_probe/autofill2.py`（±1 自动选句，
   保过闸门但 zh 未必贴切）→ `_probe/fixquote.py`（修外层引号误包）。
4. 切片扫描器不得跨过结构最后一行（曾越界吞掉 11393 行正文 ≈ 全书两成）。
5. 页眉剥离正则必须形状严格且全项目只有一套（`03_segment.py` 的 `RUNHEAD_RES`，04 复用）。
   宽松版曾把正文句 `Chapter 4 presents the "master theorem," …` 整行删掉，且现场看不出原因。
6. 引述比对只有一个入口且必须用 `qnorm`（去空白/连字符、下标折数字、省略号折点、弯引号折直）。
   曾并存两套，`random-access machine` 在语料 `randomaccessma- chine` 上永远失配。
7. 改语料解析规则时，审计必须在 `data/pages.jsonl`（未修复原文）上做 —— 修复后文本里伪影
   已消失，拿它当依据结论全错（真的白跑过一轮）。
8. 伪代码的地面真值是**渲染页**不是语料：语料把 `l = LEFT(i)` 抽成 `l DLEFT(i)`、把
   `A.heap-size` 抽成 `A: heap-size`（伪影是**句点**），且丢掉全部缩进（缩进在关卡里手工补）。
9. **伪代码下标 1 基，C 数组 0 基**：`B-TREE-SPLIT-CHILD(s,1)` → `child[0]`，照抄下标会段错误。
10. 语料伪影要逐字照抄：附录 D 的 `(AB)C` 在语料里是 `.AB/C`；语料撇号是 U+2019，
    手写 U+2032 会被闸门拒。
11. 习题文本的地面真值是「逐页版面」不是 blocks 的 exercise 块。分段器会切开显示公式，
    块级文本因此半句即止；向前拼块又会吞下一节正文。正解是 `tools/ex_corpus.py` 的逐页状态机，
    三条边界：① 题号独占一行或与题干同行都要吃；② **翻页只在「本行成句 且 下一页顶行像
    另起一段」才收题**（否则 6.5-7、13.4-7 被砍半句），页底脚注不算题干尾巴；
    ③ 节标题可带难度前缀（`? 19.4 Analysis…`），不认就会把整节正文吞成上一题尾巴。
    产出必是页窗内连续原文，故必过 `verify_quote`（校验前剥掉尾部省略号 —— `…` 会被
    qnorm 折成 `.`，反而判失败）。

## 三、写关卡 / 闸门

12. 标准流程：`python tools/05_new_level.py <章> <节> --register` 生成骨架（引述/伪代码/习题
    自动逐字填好并自检）→ 填掉所有 `【TODO …】` → `node tools/dump_levels.mjs &&
    python tools/04_verify_level.py` 到 0 ERROR / 0 TODO。详见 `docs/关卡编写手册.md`。
    闸门断言每条英文引述的字**一个不缺、按原序**落在声明页 ±1 窗口，并校验内嵌 C 与
    `c/*.c` 一致、解锁链接有效、术语卡有出处。**没有相似度阈值**。
13. **闸门只看得见 `chapter.js` 的 `levels` 数组里登记过的关卡** —— 未登记就是假的 0 ERROR。
    故**看结论前先核对关数**（`tools/_levels.json` 里该章 levels 长度）。子代理可临时登记
    自己的关卡用于验收，协调者最后收口。
14. **闸门读 `tools/_levels.json`**：改了关卡文件必须先 `dump_levels.mjs` 再跑 04，
    否则验的是上一版。另：05_new_level.py 附录骨架写 `appendix/a/sNN` 而闸门要 `chA/sNN`
    （已补 URL 归一化）；pseudocode 段不能整段删 —— 九段必须齐全，原书无伪代码的节保留空段
    （`algo:null + lines:[] + note` 说明）。
15. 关卡内嵌 C 必须与 `c/*.c` 逐字节一致，改一份同步另一份。
16. **写完一关先 `node --check <关卡文件>`，再谈闸门**。三类同症状错误（闸门只报
    「chapter.js 加载失败」）：① `code` 阶段 `c:{…}` 没闭合，`tests`/`mapping` 被塞进 c；
    ② `tree` 帧少一个 `}`；③ panel 对象后多一个 `},`。另一触发点：单引号串里写
    `BUILD-MAX-HEAP$\'$` —— `\'` 提前结束字符串（撇号请用 Unicode `′`）。
    排查手法：`node --check` 定位报错阶段，再数 `{`/`}` 深度（`tools/_probe/fixnotes.py` 可修）。
17. **闸门新增判据要过三关**：正向（全站 0 ERROR）、**反向**（故意塞假题干/假编号必须报错）、
    **统计口径**（结论行数量与 `_levels.json` / dump 条数互相印证）。只看 0 ERROR 发现不了
    回填工具静默漏 2 条那类扫描器 bug。
18. **闸门报「引用了本关范围之外的后续页码」时，先查 `bookExercises[].page`** ——
    曾有 4 关/19 题页码与 `source.printed` 同源出错。
    `source.printed = [printed_page, pdf_end − 22]`（`pdf_end` 是独占的，故终点减到
    「下一节首页 − 1」）；`sourceNote` 不参与渲染。闸门 04 第 601–612 行的 structure 比对是
    死代码（sinfo 无 printed 键），只有 640–648 行真用 `printed[1]` 作引号页上界 →
    **升它安全，降它可能 ERROR**。
19. 审计脚本的章标识要对齐（关卡 `ch` 是整数 2，语料文件名是 `__ch02.json`），不做零填充
    会让第 1–9 章整体误报（曾跑出「70 关有问题」的假结果）。
20. **`git add -A <路径>` 混进被 `.gitignore` 忽略的目录（如 `tools/_probe`）会让整条 add
    失败**，挂在 `&&` 上的 commit 根本不执行，而末尾 `git log` 仍打印旧提交。
    **提交后一定核对 `git log --oneline -1` 哈希变了**。另：反向验证塞了坏数据后
    **不要 `git checkout --`**，会连本轮正当修改一起丢掉。
21. **子代理会死于限流（429）而文件可能已写完**：一律以磁盘文件为准重新验收 ——
    既不要把「没报告」当「没干活」，也不要把代理汇报当验收结果。
22. 改关卡文本 = 写扫描器，两处必踩：① 长句写成 `'a' + 'b'` 串接，值范围只取第一段字面量
    → 回填后旧尾巴残留，拼成一句谁都不是的话；② 数组值 `page: [33, 34]` 让只数方括号的
    深度到 2，之后对象全匹配不上 → **整段静默不处理**。都靠「跑完按 dump 条数反查」才暴露。
23. `tools/_probe/` 不是垃圾桶：`docs/交接提示词.md` §2 点名了一批**常备工具**
    （reinject_c / subc / inject_direct / drill_count / run_all_c / hint_io …）——
    被文档引用的就不是临时的。清理前先 `grep -rn "_probe/" docs .workbuddy` 捞名单。

## 四、渲染器 / 字段规则

24. **纯文本字段不走 renderMixed，不能放 LaTeX**：`stage.title`、`prove.steps[].title`、
    `pseudocode.more[].subtitle`（走 `h('h3', {}, '…' + sub)`）。闸门已加 WARN 级检查（3b 段）。
    可放 LaTeX 的：`mathKit[].title`、表格单元格、`claims[].when`、`zh`、`body`、`note`。
    新增字段前先确认它走不走 renderMixed。
25. **新 LaTeX 命令先补渲染器**，再跑 `node site/assets/core/__tests-katex__.mjs`
    （[11] 段列出「关卡用了但渲染器没实现」的命令）。不实现不报错、不白屏，只把 `\binom`
    原样打印。要点：`\binom` 要两层堆叠（复用 `.frac` 会画出除号横线）；`\overline` 用 span
    顶线（组合字符只盖得住最后一个字符）；测试跑在极简 DOM 垫片上，`textContent`
    **只有 getter**，新节点一律 `createTextNode`。
    已支持 `\det \odot \Phi \Xi \leadsto \rightsquigarrow \cos \sin \tan \nmid \setminus
    \uparrow \downarrow \backslash \colon`；仍不支持 `\pmod`（带参）与 `\mathrel`。
26. **图表 `expr` 是要 eval 的 JS，变量是 `n` 不是 `x`**（`viz/growth.js:56` 的
    `new Function('n', …)`）。写 `x` 会 ReferenceError，router 吞掉后**页面空白但不报错、
    不白屏** —— 只有无头 Chrome 抓 console 才看得见。写 expr 后必须抽查该段 DOM。
27. **静态树帧用 `json.dumps` 生成，别手写括号**：viz:'tree' 的嵌套闭合（叶 } → children ] →
    结点 } → 外层 } → trees ]）手写极易错一环，`node --check` 只报 "Unexpected token"
    不说是哪层。解法：Python 里建 dict，
    `"trees:[{root:" + json.dumps(tree, ensure_ascii=False) + "}],"`（JSON 双引号兼容）。
28. **drill 选项粗体泄题**：options 里的 `**…**` 经 renderMixed 变 `<strong>`，正确答案一上屏
    就是粗的。213 处加粗精确对齐 answer 下标（作者侧标答案约定），故在 `stages.js` 渲染选项时
    剥掉标记（比改 87 个文件外科）。验证：无头 Chrome 抓 `quiz__opt` 里有没有 `<strong>`。
29. **simulate 题的 `expect` 必须可数值化**（渲染器走 `it.expect.map(Number)` 做数字比较），
    放文字 → 学员永远答不对且无任何报错。已修 14 道。
30. **概率类自检用卡方**：判据写 `χ² < 3×自由度`（该统计量期望恰等于自由度），
    不要拍「偏差 < x%」—— 它与样本量挂钩，N 大时必然假失败。PRNG：线性同余+取模会洗歪
    （低位周期 2，n=4 偏 17%）；换 xorshift32 后**连续种子**仍因线性映射相关（偏 9%）——
    种子必须先做乘法混合。
31. **要拿去支撑结论的统计量，实验里必须先 printf 出原始数字**：曾因 `INCREASE-KEY` /
    `INSERT` 的上浮循环漏了比较计数，「反复插入建堆」的比较次数恒为 0 而**无断言覆盖** ——
    是打印出来的数字暴露的。也别凭直觉写不等式：关于两种建堆法比较次数的两条断言实测都不成立。

## 五、本机环境坑

- **Git Bash 的 PATH 是坏的**：`ls`/`mkdir`/`head`/`tail`/`dirname`/`wc` 全 command not found。
  文件操作用 PowerShell 工具，或直接调 Python 绝对路径。
- **PowerShell 工具在此环境不回显 stdout**：要看输出就用 Python 打印，或写进文件再读。
- Python `C:\Users\FrozenYears\.workbuddy\binaries\python\versions\3.13.12\python.exe`
  （已装 pypdf 6.18.0、pymupdf 1.28.2）
- Node `C:\Users\FrozenYears\.workbuddy\binaries\node\versions\22.22.2-3\node.exe`
- Chrome `C:\Program Files\Google\Chrome\Application\chrome.exe`（无头可做真实渲染验证）
- **后台 http.server 会被前台命令结束杀掉**：用 Bash 工具的 run_in_background 起服务；
  同一条命令里探活不代表下一条命令它还活着（ERR_CONNECTION_REFUSED 页会被 `--dump-dom`
  当成「渲染结果」，hygiene 全过但内容是错误页）。

## 六、验证习惯

- 不能只靠语法检查：站点改动要用无头 Chrome dump DOM 逐路由断言关键片段；交互逻辑另写
  `site/_dev/` 功能自检页。
- **无头 Chrome 抽查要串行 + 预算给够**：`--virtual-time-budget=20000`。与别的 Chrome 并发
  或只给 6000ms 时，拿到的是约 1.3KB 的 index.html 外壳，看起来像「页面空白故障」（曾误判
  9 条路由）；拿到外壳就重试。`smoke_browser.py` 的断言必须对准**被抽查那一段**
  （曾 3 条断言过期而常年飘红，等于没有套件）。
- **路由是 `#/章/关/段`**：`#/ch34/s06/s06` 是「第 6 关」而非「第 6 段」；章内关数不足时页面
  显示「这个关卡还没有内容」，这不是 bug。抽查矩阵按 `#/chNN/s0L/s0stage`（L=关卡、
  stage=九段序号）生成。
- 改 PDF 解析规则后必须重跑 `tools/test_repair.py` 与 `tools/test_segment.py`
  （后者依赖前者产出的 `pages_fixed.jsonl`），再重跑 `tools/03_segment.py`。
- 临时探针脚本统一 `tools/_*` 前缀，已在 `.gitignore` 中；工作结束时清理（先按第 23 条捞名单）。
- 提交信息用英文，格式 `类型: 简述`。
