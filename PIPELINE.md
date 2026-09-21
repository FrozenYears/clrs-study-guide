# PIPELINE.md — 从 PDF 到上线站点：全流程工作手册

> **本文档的目的**：让任何一个新接手的 agent（或人）能在 30 分钟内理解这个项目的
> 全貌、掌握每一步的工具与规则、避开已知的坑，然后继续推进。
>
> 配套文档（按查阅频率排序）：
> | 文档 | 用途 | 什么时候查 |
> |---|---|---|
> | `docs/关卡编写手册.md` | 写一关的三步流程 + 17 条坑 | 写新关卡前 |
> | `docs/开发规范.md` | 九段式 schema、设计令牌、红线 | 写代码时 |
> | `docs/建设计划.md` | 整体架构与分期计划 | 了解全局时 |
> | `README.md` | 部署与常用命令 | 部署/更新时 |
> | `docs/reports/` | 各阶段审计报告 | 了解历史决策时 |

---

## 一、项目是什么

把 CLRS《算法导论》第 4 版（1312 页 PDF）拆解为一个**可视化、可交互、代码严谨**的
闯关式学习网站。读者是**有 C 基础但没有算法基础**的学生。

- 技术栈：**零构建、零依赖、零网络请求**的静态站。纯原生 ES Module + SVG + CSS。
- 站点：`https://clrs-algo-quest.app.workbuddy.host/`
- 仓库：`E:\Projects\Mid\Introduction to Algorithms`（Git，LF 行尾）
- PDF：`Introduction to Algorithms (TOMAS H.CORMEN, ...).pdf`（根目录，11 MB）

### 新 agent 上手清单（按顺序做）

1. **读完本文件**（约 15 分钟）——十一章覆盖全流程；
2. **跑一遍测试基线**（第九章那张表的 7 条命令）——确认你拿到的代码是全绿的，
   如果不是，先弄清是谁改坏了什么，**不要**带着红色的基线往前走；
3. **看第九章「待建」表**——确定本轮要写哪一节；
4. **按第三章三步法开工**：生成骨架 → 填 TODO → 过闸门；
5. **改动前先 git 提交存档，改完再提交**（提交规范见第七章·流程原则）。

> ⚠️ 本机环境有坑（Git Bash PATH 损坏、PowerShell 不回显），
> 第十章的绝对路径与替代方案**先读再动手**。

---

## 二、语料流水线（PDF → 结构化数据）

这条流水线把 1312 页 PDF 转成结构化 JSON，是所有关卡的原料来源。**已建成，不需要重跑**，
但如果改了解析规则必须重跑并跑测试。

### 流程

```
PDF ──→ 01_extract.py ──→ data/pages.jsonl (原始逐页文本)
    ──→ 02_repair.py    ──→ data/pages_fixed.jsonl (修复后) + repair_report.json
    ──→ 03_segment.py   ──→ data/blocks/<part>__ch<NN>.json (结构化知识块)
    ──→ 04_figures.py   ──→ data/figs/*.png + figures.json (插图)
    ──→ 12_publish_figs.py ──→ site/figs/*.png + site/assets/data/figures.js (发布)
```

### 各步骤要点

| 脚本 | 输入 → 输出 | 做什么 | 测试 |
|---|---|---|---|
| `01_extract.py` | PDF → `pages.jsonl` | 逐页提取文本，附 printed_page / pdf_index | — |
| `02_repair.py` | `pages.jsonl` → `pages_fixed.jsonl` | 修复数学符号编码损坏 + 词内空格伪影 | `test_repair.py` (184) |
| `03_segment.py` | `pages_fixed.jsonl` → `blocks/*.json` | 按节切块，识别类型（body/theorem/pseudocode/exercise…） | `test_segment.py` (42) |
| `04_figures.py` | PDF → `figs/*.png` + `figures.json` | 按图注定位裁剪插图 | `test_figures.py` |
| `12_publish_figs.py` | `figures.json` + `tools/_levels.json` → `site/figs/` + `site/assets/data/figures.js` | 把**关卡引用到**的切图发布上站（图号识别与 `ui/figures.js` 必须一致） | `assets/ui/__tests-figures__.mjs` |

### 02_repair.py 的修复规则（已验证，不要随意改）

这份 PDF 的数学字体缺少 ToUnicode 映射，导致抽取出来的文本符号全坏。
`02_repair.py` 用一套**上下文消歧规则**修复。每条规则都经过**全书实测**：

| 规则 | 修复什么 | 为什么这样修 | 关键守卫 |
|---|---|---|---|
| `→` | 赋值箭头 | 第 4 版用 `=` 不用 `←` | — |
| `:` | 切片记号 `A[p : q]` | 第 4 版用冒号不用 `..` | 仅括号内 |
| `C → +` | 加号 | 243 处粘连 + 2099 处带空格 | 左右操作数必须是非字母数字；排除 `MacCormick` |
| `; → ,` | 逗号 | 真分号后必带空格 | 7601 处全部验证 |
| `D → =` | 等号 | 第 4 版赋值用 `=` | 全书恒定 |
| `W → :` | 切片冒号（括号内） | 渲染页确认 | 仅括号内 |
| `en dash → 3` | 范围破折号 | `lines 637` 实为 `lines 6–7` | 锚定在 lines/pages/Steps 后；单数 page 排除 |
| `h…i → ⟨…⟩` | 角括号元组 | 需含列表分隔符 + 短 token | 224 处接受、208 处拒绝 |
| `::: → …` | 省略号 | 895 处恰等于 `::` 计数 | — |
| `j…j → |…|` | 绝对值 | 仅 `j<token>j` 模式 | — |
| `p → √` | 根号 | 仅独立 p + 单字符被开方数 | 排除 `p rocedure` 等 |
| `E002/E003 → −` | 减号 | E002/E003 被互换过；都在 p18/19 渲染页核实 | — |
| `E011 × 2 → ‖` | 范数双竖线 | p1029 渲染页确认 | 成对出现才触发 |
| 词内空格合并 | `cha racterize` → `characterize` | 字体字距伪影 | **六道守卫**（见下） |

#### 词内空格合并的六道守卫

字体字距把单词切成带空格的碎片（`cha racterize`、`ea ch`、`hav e`）。判定用「语料自证」：

1. `words[a+b] ≥ 3` 且 `≥ 3 × splits[(a,b)]` —— 合并后必须是真词且远比拆写常见
2. 长片段（≥3 字母）：`len(follow[a]) ≤ 3` —— 真词后面跟很多不同的词
3. 短片段（1–2 字母）：`a` 不是英文功能词 —— `no thing` / `so me` / `a long` 被挡住
4. 右片段不得是数学函数名 —— `b lg n` 不能并成 `blg`
5. 短词干不得接序数后缀 —— `h k th` 不能并成 `kth`
6. 左片段必须在词首 —— 挡掉 `=k new` 和 `can't im-`

总计 **2078 处合并 / 1267 种形状**，41 条双向用例全对。

### ⚠️ 审计铁律

> **改语料解析规则时，审计必须在 `data/pages.jsonl`（未修复原文）上做。**
> 修复后的文本里伪影已经消失，拿它当依据会得出完全错误的结论。（这一条真的白跑过一轮。）

---

## 三、关卡编写流程

### 四步法

```bash
# 0) 先把引述挑好（闸门对引述没有相似度阈值，这一步能省掉大量返工）
python tools/07_pick_quotes.py pick <章号> <节号>          # 列出能通过闸门的引述候选
python tools/07_pick_quotes.py check my_quotes.json       # 自己拼/改过的引述逐条预检
python tools/07_pick_quotes.py show <章号> <节号> 7 8 12   # 按块下标看完整正文

# 1) 生成骨架
python tools/05_new_level.py <章号> <节号> --register
# 例: python tools/05_new_level.py 4 4.4 --register

# 2) 填掉所有 【TODO …】
#    讲解、直觉、动画配置、C 代码、测验题都在这一步写

# 3) 验收
node tools/dump_levels.mjs && python tools/04_verify_level.py
cd site && node tools/check-syntax.mjs .
python tools/smoke_browser.py 8317     # 需先起本地服务（见第十章）
```

> ⚠️ 上面的 `python` / `node` 是**通用写法**。本机 Git Bash 的 PATH 是坏的，
> 实际执行必须用第十章的绝对路径，例如：
> `C:/Users/FrozenYears/.workbuddy/binaries/python/versions/3.13.12/python.exe tools/05_new_level.py 4 4.4 --register`

### ★ 三条硬约束（第 5、6 章踩出来的）

1. **闸门只看得见 `chapter.js` 的 `levels` 数组里登记过的关卡。**
   `dump_levels.mjs` 逐章 `import chapter.js` 再取 `ch.levels`，**没登记的关卡文件
   根本不会被检查**，跑出来的「0 ERROR」是假的。
   自己写单关时：先在 `chapter.js` 里临时登记，验收完由协调者收口重写。
2. **新关卡必须同时加进 `tools/smoke_browser.py` 的 `CASES`**，否则等于没做渲染验证。
   写单关时可以只跑自己那几条路由，**每章收口时跑一次全量**（第 6 章收口时正是全量
   扫描抓出一条过期期望）。
3. **纯文本渲染的字段不能放 LaTeX**（`stage.title`、`pseudocode.more[].subtitle`）。
   详见 `docs/关卡编写手册.md` 坑 17。

### 并行开发约定

- 关卡文件一章一个目录（`site/chapters/ch<NN>-<slug>/`），语料一章一个文件
  （`data/blocks/<part-slug>__ch<NN>.json`）；
- **多 agent 并行时，一个 agent 只碰自己那一章**——`site/assets/chapters.js` 的
  注册行是公共文件，追加自己的注册时不要动别人的行；
- **子代理可能死于限流（429）而没有任何报告**，但文件已经写完。
  一律**以磁盘文件为准**重新验收：既不要把「没报告」当成「没干活」，
  也不要把代理的汇报当成验收结果。
- 完整的分工与指令模板见 `docs/关卡编写手册.md` 第四·五节。
- 4.4 关曾出现过两个 agent 先后写同一关的情况：后写的必须先读已提交版本，
  在其基础上续写，不许整文件覆盖丢失对方内容。

### 九段式关卡模型

每关对应原书一节，按九段式组织（**一节一关是默认，不是铁律**：某一节长到装不下时会按
原书自己的小节号拆开 —— 目前只有 5.4 拆成了 s04–s07 四关，见第九章）：

| 段 | type | 内容 | 关键要求 |
|---|---|---|---|
| 1 | `map` | 位置感：为什么学、知识地图 | mathKit 2–3 条 |
| 2 | `intuition` | 直觉入口：生活场景 + 类比 | 场景要具体 |
| 3 | `source` | 原文精读：英文逐字 + 中文解读 | en 不可改写，zh 瞄准易错点 |
| 4 | `pseudocode` | 伪代码逐行 + 变量表 | 行号与原书一致；`more` 可挂配套过程 |
| 5 | `visualize` | 动手看见：算法动画或函数曲线 | 见下方三种驱动方式 |
| 6 | `code` | 双轨实现：C 代码 + 对照表 | c.code 与 c/*.c 逐字节一致 |
| 7 | `analyze` | 复杂度：每条结论带页码 | 自己推导的标 `source:'instructor'` |
| 8 | `prove` | 正确性：不变量或下界论证 | en 逐字取自原书 |
| 9 | `drill` | 闯关测验 + 原书习题 | 6–8 道，覆盖本节核心 |

#### 阶段 5 可以有多块面板（`panels`）

一节里若有多个过程要演示（6.5 的 EXTRACT-MAX / INCREASE-KEY / INSERT 三个），
用 `panels: [{…}, {…}, {…}]` 声明多块面板，**每块自带 `pseudocodeRef`**，
于是各面板的伪代码高亮互不干扰。`panels` 里每一项的字段与 panel 外层的用法一致
（`algorithm` / `viz` / `presets` / `input` / `countLabels` / `invariants`）。

#### 帧读数的计数项（`countLabels`）

面板右侧"读数"默认只显示 `cmp`（比较）与 `move`（写回）。要显示别的计数项时声明：

```js
countLabels: { throws: '已投掷' }                            // → 已投掷 7 次
countLabels: { leaves: { label: '叶子结点', unit: '个' } }    // → 叶子结点 5 个
```

写字符串时量词默认「次」；要「个 / 人 / 对 / 号」就写对象。
**别用错量词**：「叶子结点 5 次」读起来是错的。

#### 预设可以自带生成器参数（`presets[i].args`）

生成器参数默认取面板级的 `algoArgs`；若某个预设需要不同的参数（如 MAX-HEAPIFY 换个起点、
洗牌换个种子），在预设里写 `args: [...]` 覆盖即可 —— 同一块面板就能演示多种情形。

### 阶段 5 的三种驱动方式

| 方式 | 何时用 | 声明 |
|---|---|---|
| 算法生成器 | 有算法可单步 | `algorithm: 'insertion-sort'` + `viz: 'array'` |
| 树序列 | 递归树逐步展开 | `viz: 'tree'` + `trees: [...]` + `treeNotes: [...]` |
| 增长曲线 | 没有算法可跑 | `viz: 'growth'` + `chart: { series, band? }` |

### 生成器自动填什么

`tools/05_new_level.py` 会从 `data/blocks/` 逐字填入：
- **原文引述**：从 body/theorem 等块中取原文段落（附页码）
- **伪代码逐行**：从 pseudocode 块中取行号 + 代码
- **书后习题**：从 exercise/problem 块中取题号 + 题干 + 页码
- **页码锚点**：从 structure.json 取节的印刷页范围

每条候选引述在写入前都会用闸门自己的 `verify_quote` 判据自检——
通不过的不写进文件，而是打印原因。**生成即合规**。

---

## 四、质量闸门

### 闸门工具链

```
node tools/dump_levels.mjs           # 从关卡 JS 模块导出 JSON（不读源码，读模块）
python tools/04_verify_level.py      # 闸门：引述溯源 + C 一致性 + 链接 + 引擎注册
```

闸门检查什么：

| 检查 | 严重度 | 说明 |
|---|---|---|
| 英文引述逐字可溯源 | ERROR | 每条 en 必须在声明页 ±1 的语料里**逐字连续**出现 |
| 内嵌 C 与 c/*.c 一致 | ERROR | 逐行比对（归一化 \r\n 与尾空白） |
| 链接指向不存在的章 | ERROR | 如 `#/ch77/s01`（章号必须存在于原书目录） |
| 引擎/算法未注册 | WARN | viz 或 algorithm 不在 registry.js 里 |
| 链接指向未构建的关卡 | WARN | 解锁预告是常态，不扣分 |
| 【TODO 残留 | TODO | 不计入退出码，但要有清零计划 |

### 引述比对的四条接受路径（v3，2026-09-15 重写）

| 路径 | 说明 | 覆盖率 |
|---|---|---|
| ① 逐字连续 | qnorm 后整条出现在干草堆里 | 89 / 108 条 |
| ② `…` 分段 | 每个片段各自连续（顺序不限） | 跨页 / 跨段引述 |
| ③ 术语卡原子 | `/` 备选和 `()` 内写法各自连续 | 术语卡 |
| ④ 极小夹带 | 单段 ≤2、总计 ≤4 字符 | 行内伪影 |

干草堆优先级：**正文块**（脚注/伪代码/图注已剥离）→ **全块** → **原始页** → **页窗拼接**。

> ⚠️ 旧版用「带隙子序列 + 单段夹带 ≤800」，实测 8 种篡改漏报 6 种。
> v3 的容忍度收紧后，篡改（插词/删词/对调/换词）全部拦住；
> 仅 ≤2 字符的单点编辑仍可能漏（已知边界，见 `docs/reports/Q1-质量审计.md`）。

**挑引述就去用 `tools/07_pick_quotes.py`**：它 `import` 的就是本节的 `verify_quote`
（**不另造第二套判据** —— 项目曾因两套归一化并存而白跑一轮），把判定前移到动笔之前。
它的 `selftest` 子命令把上面那条「≤2 字符边界」写成了可执行记录。

### 站点自检

```
cd site && node tools/check-syntax.mjs .    # 语法（ES Module）
node site/assets/algorithms/__tests__.mjs   # 算法正确性
node site/assets/core/__tests-katex__.mjs   # 数学渲染器
node site/assets/core/__tests-highlight__.mjs  # 代码框语法高亮（含伪代码）
node site/assets/ui/__tests-figures__.mjs   # 原书插图：清单与文件一一对应
python tools/test_repair.py                 # 语料修复
python tools/test_segment.py                # 语料分块
python tools/smoke_browser.py 8317          # 无头 Chrome 逐路由渲染
```

浏览器自检不只检查「页面不空白」，还检查：
- 每条路由的关键文案是否出现
- 可见文本里没有未渲染的 `**` 粗体标记
- 可见文本里没有 `[object …]`（数组被当属性对象的痕迹）
- 可见文本里没有未渲染的 LaTeX 命令（`\textfor` 之类的碎片）
- 无 JS 未捕获异常

---

## 五、设计系统（编辑部 / 印刷风格）

### 三种声音

| 令牌 | 字体栈 | 用途 |
|---|---|---|
| `--font-display` | Palatino + Songti/Noto Serif SC | 展示衬线：章号、标题——书的身份 |
| `--font-sans` | Source Han Sans CN + system | 界面与讲解——黑体 |
| `--font-serif` | Palatino + Georgia + Songti | 英文原文段落——像书页一样 |

**核心惯例**：原文用衬线体（`data-kind="source"`），讲解用无衬线体（`data-kind="note"`）。
这是全站的视觉红线 R3，一眼就能区分何为书、何为注。

### 纸墨配色

- 纸白 `--bg-page`（暖色 off-white，不是纯白）
- 墨字 `--fg-0`（近黑，不是 #000）
- 单一强调色 `--accent`（墨蓝）
- 状态色去饱和，可区分但不刺眼
- 圆角 2/4/6px（小），立体感来自发丝线而非阴影
- 进度用离散刻度（一格一关），不用连续进度条

### 可视化令牌（--viz-*）

| 令牌 | 语义 | 明色 |
|---|---|---|
| `--viz-idle` | 空闲 | 最浅 |
| `--viz-compare` | 比较 | 浅 |
| `--viz-move` | 搬移中 | 紫（比 active 亮一档） |
| `--viz-result` | 结果 | 中 |
| `--viz-done` | 完成 | 较深 |
| `--viz-active` | 当前操作 | 紫（最深） |
| `--viz-mark` | 标记 | 蓝 |
| `--viz-violation` | 违规 | 红 |

明度阶梯（灰阶下靠这层区分）：`idle < compare < move < result < done < active < mark < violation`。
**禁止**只靠红/绿区分状态；必须同时用形状、纹理或文字标签。
**刻意不增加第 8 个色相**——色相越多，色盲与灰阶下可分辨性越差。

### 零网络资源是硬红线（R6）

字体栈只落在系统已装字体上（本机有思源宋体、思源黑体、Palatino、Georgia、Cascadia Code）。
**不能引 Google Fonts、CDN 或任何外链资源。** 数学公式用本地 `core/katex.js`（极简渲染器）。

---

## 六、已知的坑（17 条，全部真实踩过）

以下每一条都在第 2–4 章的编写过程中真实踩过至少一次。
详细说明见 `docs/关卡编写手册.md` 第四节。

| # | 坑 | 后果 | 防止方式 |
|---|---|---|---|
| 1 | 符号映射凭推断不核实 | 全书的 `+` 变减号 | 渲染原页图像作为地面真值 |
| 2 | 引述凭记忆写 | Figure 2.4 示例数组写错 | 逐字从语料提取，闸门检查 |
| 3 | 切片扫描器越界 | 吞掉 11393 行正文（约两成） | 修好 + 42 条断言锁住 |
| 4 | chapter.js import 不存在的文件 | 整站加载失败 | 生成器只 import 已存在的文件 |
| 5 | JS 注释用 `#`（Python 习惯） | 语法错误 | 生成器已修 + 语法检查 |
| 6 | 闸门匹配太松（子序列+大 gap） | 6/8 篡改漏报 | v3 改为连续性判据 |
| 7 | 页眉剥离正则太宽 | 把正文句 "Chapter 4 presents..." 整行删掉 | 共用 03_segment 的严格正则 |
| 8 | 术语卡用词表匹配而非 qnorm | `randomaccessma- chine` 永远匹配不上 | 统一用 qnorm 子串判断 |
| 9 | h() 把数组当属性对象 | 所有表格行消失 | 修根因 + 冒烟断言 |
| 10 | renderMixed 不处理 `**粗体**` | 561 处星号原样输出 | 补上 + 冒烟断言 |
| 11 | LaTeX 命令未实现 | `\textfor` 等碎片泄漏到页面 | 补 7 个命令 + 静态扫描断言 |
| 12 | replaceChildren 传数组不展开 | DOM 出现 [object HTMLSpanElement] | 改为 ...kids + 冒烟断言 |
| 13 | Python `open(w)` 在 Windows 写 CRLF | 52 个文件行尾污染 | .gitattributes + writer 加 newline |
| 14 | 词内空格合并的边界分支丢文本 | p14/p19 丢行 | 修掉 + 测试 |
| 15 | 生成器语法检查跑在写 chapter.js 之前 | 漏掉 chapter.js 的语法错误 | 移到最后并检查整个 site |
| 16 | growth 面板 replaceChildren 传数组不展开 | 判定读数条变 [object…] | 修掉 + 冒烟断言 |
| 17 | 图注的行号写错（12–18 vs 8–18） | 读者学到错的东西 | 严格闸门 + 回渲染页核对 |

---

## 七、设计原则（编码时时刻记住）

### 内容原则
1. **原文照抄，讲解辅助** —— 原文（en）一律逐字取自语料，不改写不省略（要省略用 `…` 标出）。
2. **每条结论有出处** —— 复杂度断言标 `page`；自己推导的标 `source:'instructor'`。
3. **中文解读瞄准易错点** —— 不是翻译，是告诉读者「这句为什么重要、你容易怎么误读」。
4. **先直觉后形式** —— 每个概念先给场景和类比，再给形式定义。

### 代码原则
1. **一条代码两种用途** —— 算法生成器既能跑测试（Node），又能驱动动画（浏览器）。
2. **0 基 vs 1 基** —— 书中伪代码下标从 1 开始，C 从 0 开始。每个 C 文件头注明对应关系。
3. **内嵌 C 与磁盘 C 逐字节一致** —— 闸门会查。改一份就同步另一份。
4. **render 幂等** —— 同一帧重复渲染结果一致，不累积 DOM。

### 流程原则
1. **生成 → 填 → 验** —— 三步缺一不可，验收不过不许提交。
2. **闸门是唯一的裁判** —— 不要凭感觉说「应该没问题」，跑一下闸门。
3. **浏览器自检不能省** —— 语法通过不等于渲染正确。
4. **审计在原文上做** —— 修复后的语料里伪影已消失，拿它当依据会得出错误结论。
5. **提交信息用英文**，格式 `类型: 简述`（如 `feat(ch04): build level 4.5 ...`、
   `fix(tools): ...`、`docs: ...`）。正文可多段，说明「为什么」而不只是「做了什么」。
6. **动手前先提交存档** —— 改代码前后都要有 git 提交点，出问题能回退。
7. **临时探针脚本统一 `tools/_*` 前缀**（已在 `.gitignore` 里，不进版本库）；
   工作结束要清理，但**删除前先问用户**（说明类别、作用与影响）。
8. **发布同意不跨轮次** —— 同步线上必须用户在新消息里明确要求（详见第十章）。

---

## 八、目录地图

```
├── README.md                      # 部署与常用命令（人类入口）
├── PIPELINE.md                    # 本文件（agent 交接入口）
├── .gitattributes                 # LF 行尾
├── .gitignore
├── Introduction to Algorithms (...).pdf  # 原书 PDF（11 MB）
│
├── data/                          # 语料流水线产出
│   ├── structure.json             # 全书结构（章/节/页码映射）
│   ├── pages.jsonl                # 原始逐页文本（1312 页）
│   ├── pages_fixed.jsonl          # 修复后逐页文本
│   ├── repair_report.json         # 修复规则报告
│   ├── figures.json               # 插图索引
│   ├── figures_suspect.json       # 可疑插图
│   ├── figs/                      # 233 张插图 PNG（切图全量，站内只发布引用到的）
│   │                              # + contact-sheet.html（人检用的拼图）
│   └── blocks/                    # 40 个章级 JSON（35 章 + 4 附录 + 1 索引）
│
├── tools/                         # 流水线与验证脚本
│   ├── 01_extract.py              # PDF → 原始文本
│   ├── 02_repair.py               # 符号修复（含词内空格合并）
│   ├── 03_segment.py              # 结构化分块
│   ├── 04_figures.py              # 插图切图
│   ├── 12_publish_figs.py         # 把引用到的插图发布到 site/figs/
│   ├── 04_verify_level.py         # ★ 关卡合规闸门
│   ├── 05_new_level.py            # ★ 关卡骨架生成器
│   ├── 07_pick_quotes.py          # ★ 引述挑选 / 预检（写关卡的第一步；复用 04 的判据）
│   ├── dump_levels.mjs            # 关卡 JS → JSON（闸门的输入）
│   ├── smoke_browser.py           # 无头 Chrome 逐路由自检
│   ├── test_repair.py             # 修复回归测试 (184)
│   ├── test_segment.py            # 分块回归测试 (42)
│   └── test_figures.py            # 插图回归测试
│
├── docs/                          # 文档
│   ├── 开发规范.md               # 契约（红线 + schema + 令牌）
│   ├── 关卡编写手册.md           # 三步流程 + 17 条坑
│   ├── 建设计划.md               # 整体架构
│   ├── requests.md               # 可视化引擎请求/已解决
│   └── reports/                   # 各阶段审计报告
│
├── site/                          # 静态站点（部署目录）
│   ├── index.html                 # 学习地图首页（书的目录 + 进度层）
│   ├── assets/
│   │   ├── theme.css              # 设计令牌（编辑部/印刷风）
│   │   ├── layout.css             # 版式
│   │   ├── components.css         # 组件
│   │   ├── chapters.js            # 章注册表（import 所有 chapter.js）
│   │   ├── core/                  # 运行时
│   │   │   ├── dom.js             # DOM helper（h / svg / $）
│   │   │   ├── store.js           # 进度持久化（localStorage）
│   │   │   ├── router.js          # hash 路由
│   │   │   ├── stepper.js         # 步进引擎（播放/暂停/单步/调速）
│   │   │   ├── katex.js           # 极简数学渲染器
│   │   │   └── README.md          # 运行时 API 速查
│   │   ├── ui/                    # 章节外壳
│   │   │   ├── chapter-view.js    # 关卡页骨架（header + rail + stage）
│   │   │   ├── registry.js        # viz / algorithm 注册表
│   │   │   ├── stages.js          # 九段式渲染器（每段一个 r* 函数）
│   │   │   └── level.css          # 关卡页样式
│   │   ├── viz/                   # 可视化引擎
│   │   │   ├── array.js           # 数组动画
│   │   │   ├── tree.js            # 树 / 递归树
│   │   │   ├── growth.js          # 增长曲线 + c·g(n) + n₀ 滑杆
│   │   │   ├── matrix.js          # 矩阵
│   │   │   ├── matrix-product.js  # 矩阵乘法逐格填值
│   │   │   └── heap.js            # 堆：数组格与树结点共用同一批下标（第 6 章）
│   │   └── algorithms/            # 算法生成器（JS generator）
│   │       ├── insertion-sort.js  # 插入排序（逐帧 yield）
│   │       ├── merge-sort.js      # 归并排序
│   │       ├── merge.js           # MERGE 子程序
│   │       └── __tests__.mjs      # 算法断言测试 (59)
│   ├── chapters/                  # 关卡内容（一章一个目录）
│   │   ├── ch02-getting-started/  # 第 2 章（3 关完整，金标准）
│   │   ├── ch03-characterizing-running-times/  # 第 3 章（3 关完整）
│   │   └── ch04-divide-and-conquer/            # 第 4 章（4.4/4.5 完整，4.1-4.3 待建）
│   ├── _dev/                      # 自测页（不部署）
│   └── tools/
│       └── check-syntax.mjs       # ES Module 语法检查
│
├── c/                             # C 实现（每个算法一个文件，带自测 main）
│   ├── insertion_sort.c
│   ├── merge_sort.c
│   ├── count_ops.c                # 2.2 用的带计数器版本
│   ├── asymptotic_check.c         # 3.1 用的数值验证
│   ├── growth_stats.c             # 3.2 用的
│   ├── compare_growth.c           # 3.3 用的
│   ├── recursion_tree_sum.c       # 4.4 用的
│   └── master_method_check.c      # 4.5 用的
│
└── docs/reports/                  # 阶段审计报告
```

---

## 九、当前进度与下一步

**共 25 关 / 5 章**（第 2–6 章全部完成）。完整清单跑
`node tools/dump_levels.mjs` 之后看 `tools/_levels.json`，或直接跑闸门看首行。

### 已完成（25 关，闸门 0 ERROR / 0 TODO）

| 章 | 关数 | 说明 |
|---|---|---|
| 第 2 章 Getting Started | 3 | 2.1 / 2.2 / 2.3 —— 整套流程的**金标准** |
| 第 3 章 Characterizing Running Times | 3 | 3.1 / 3.2 / 3.3 |
| 第 4 章 Divide-and-Conquer | 7 | 4.1–4.7 全 |
| 第 5 章 Probabilistic Analysis | 7 | 5.1 / 5.2 / 5.3 + **5.4 拆成的 s04–s07** |
| 第 6 章 Heapsort | 5 | 6.1–6.5 全（含新的 `viz/heap.js` 引擎） |
| 第 7 章 Quicksort | 4 | 7.1–7.4 全（含 `partition` / `quicksort` 生成器） |

> ★ **第 5 章为什么有 7 关而不是 4 关**：原书 5.4 一节正文 38.5K 字符（第二长的 2.3 只有
> 25K），且由四个彼此独立的例子组成（生日悖论 / 球与箱 / 连续正面 / 在线招聘）。
> 九段式「一伪代码、一动画、一 C 程序」套在含四个主题的巨节上会失焦，所以按原书自己的
> 小节号 5.4.1–5.4.4 拆开。**副作用**：`site/index.html` 的 `STRUCTURE[].count` 语义是
> 「**关卡数**」而不是「节数」（第 5 章 count = 7，节数是 4），新增章节时要按关卡数填。

### 待建

| 章 | 节 | 难点 |
|---|---|---|
| 第 1 章 The Role of Algorithms | 1.1 / 1.2 | 没有算法可跑，全靠概念组织；需要拿捏「不注水」 |
| 第 7 章 Quicksort | 7.1–7.4 | 预计可直接复用 `array` 引擎 + 5.3 的 `randomly-permute`，不需要新引擎 |
| 第 8 章 Sorting in Linear Time | 8.1–8.4 | 8.1 的下界证明要靠决策树（`tree` 引擎可用）；计数/基数/桶排序需要新的"桶"视图 |
| 第 9 章 Medians and Order Statistics | 9.1–9.3 | 9.3 的 SELECT 递归结构较绕 |
| 第 10 章起 | … | 数据结构篇需要新引擎：链表 / 散列 / 红黑树 / B 树 / 图（图引擎是最大的一块） |
| 附录 A–D | — | 数学基础，`growth` 引擎基本够用 |

### 新增能力（2026-09-16 起可用）

| 能力 | 位置 | 用在 |
|---|---|---|
| 堆可视化（数组格 + 树结点共用下标；`heapSize` 表现"堆外"） | `site/assets/viz/heap.js` | 第 6 章 5 关 |
| 概率实验生成器（生日命中 / 球与箱 / 连续正面 / 在线招聘） | `site/assets/algorithms/*.js` | 第 5 章 5.4 |
| 洗牌生成器（确定性 PRNG，可单步回退） | `site/assets/algorithms/randomly-permute.js` | 5.3 |
| 帧读数自定义计数项（`countLabels`，支持量词） | `site/assets/ui/stages.js` | 5.4 / 6.x |
| 预设自带生成器参数（`presets[i].args`） | `site/assets/ui/stages.js` | 6.2–6.5 |
| 多面板可视化（`panels: [...]`，各挂各的伪代码表） | `site/assets/ui/stages.js` | 6.5 |
| 数学命令 `\land` `\lor` `\Pr` `\binom` `\overline` | `site/assets/core/katex.js` | 5.x / 6.x |
| 引述挑选 / 预检工具 | `tools/07_pick_quotes.py` | 写每一关的第一步 |
| 堆引擎自检页（支持 `?algo=&arr=&args=&frame=`） | `site/_dev/smoke-heap.html` | 调堆动画时 |

### 测试基线（当前全绿）

| 测试 | 读数 | 命令 |
|---|---|---|
| 语法（ES Module） | 95 / 95 | `cd site && node tools/check-syntax.mjs .` |
| 算法正确性 | 167 passed | `node site/assets/algorithms/__tests__.mjs` |
| 数学渲染器 | 83 passed | `cd site && node assets/core/__tests-katex__.mjs` |
| 语料修复 | 184 passed | `python tools/test_repair.py` |
| 语料分块 | 42 passed | `python tools/test_segment.py` |
| 关卡闸门 | 0 ERROR / 3 WARN / 0 TODO，25 关 409 条引述 | `node tools/dump_levels.mjs && python tools/04_verify_level.py` |
| 浏览器路由 | 235 / 235 | `python tools/smoke_browser.py 8317` |
| 引述工具自检 | 6 / 6 | `python tools/07_pick_quotes.py selftest` |

3 个 WARN 都是「解锁预告链接指向尚未构建的关卡」（`#/appendix/a/s01` ×2、`#/ch07/s01` ×1），
属预期的前向引导。

---

## 十、环境备忘（别踩坑）

| 事项 | 说明 |
|---|---|
| Git Bash PATH 坏了 | `ls`/`mkdir`/`rm`/`sleep`/`head` 全部 command not found。用 PowerShell 或 Python 绝对路径 |
| PowerShell 不回显 stdout | 要看输出就用 Python 打印，或写进文件再读 |
| Python | `C:\Users\FrozenYears\.workbuddy\binaries\python\versions\3.13.12\python.exe` |
| Node | `C:\Users\FrozenYears\.workbuddy\binaries\node\versions\22.22.2-3\node.exe` |
| Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe`（无头模式 `--headless=new`） |
| GCC | `C:\msys64\ucrt64\bin\gcc.exe` |
| 本地服务 | `cd site && python -m http.server 8317 --bind 127.0.0.1` |
| 截图核对 | Chrome `--screenshot=<绝对路径>`（相对路径会写到别处）+ pymupdf 裁剪放大 |
| 行尾 | `.gitattributes` 已锁 LF；Python writer 必须加 `newline='\n'` |
| C 编译验证 | 必须加 `-Wall -Wextra -Werror`，零警告才算过 |
| 线上部署 | `workbuddy_sites_deploy` 工具（完整规程见下方「线上发布与同步」） |

### 线上发布与同步

**站点**：`https://clrs-algo-quest.app.workbuddy.host/`（域名固定，重复发布不变）
**管理入口**：WorkBuddy 「设置 → 数据管理 → 应用」

**⇢ 铁律：发布同意不跨轮次。** 改完内容要同步线上，必须**用户在新消息里明确要求**——
不许在同一轮里自作主张发布，也不许把「上次同意过」当作这次的授权。

**同步步骤**（用户明确要求后执行）：

1. 确认本地工作已提交（`git status` 干净、闸门全绿）——别把半成品发上线；
2. 调用 `workbuddy_sites_deploy` 工具，参数固定为：
   - `directory` = `E:\Projects\Mid\Introduction to Algorithms\site`（注意指向 `site/`，不是仓库根）
   - `domainPrefix` = `clrs-algo-quest`（保持域名不变）
   - `language` = `static`
   - `updateExistingApp` = `true`
   - `userAskedToPublish` = `true`
3. 看返回结果：`verified: true` 才算成功；域名若意外变化要立即告知用户；
4. 在回复里附上线上链接，并说明本次同步覆盖了哪些提交。

**历史模式**：本项目已多次同步，每次都是同一域名覆盖更新——不需要用户重新记链接。

---

## 十一、风格与来源

### 视觉风格：教科书编辑部风

**设计理念**：这是一本「可以交互的教科书」，不是 dashboard 也不是 landing page。
视觉语言来自**印刷排版**：纸白底色、衬线正文、发丝线分隔、离散刻度进度。

**参考来源**：
- 原书 CLRS 第 4 版的版式（章节编号、图注位置、伪代码格式）
- 传统出版社的目录页（Part 标题 + 章列表 + 页码引导）
- Edward Tufte 的信息设计原则（数据-墨水比、small multiples）

**避免**：
- 等宽卡片宫格（AI 默认观感）
- 通用蓝（#2f7ff0 一类的链接色）
- 系统 UI 字体栈（`-apple-system, Segoe UI`）
- 渐变、投影、大圆角
- 连续进度条（用离散刻度替代）

**设计 skill**：`~/.workbuddy/skills/taste-skill/SKILL.md`（frontmatter: `design-taste-frontend`）。
它要求先声明 Design read + 三个调节钮（VARIANCE/MOTION/DENSITY）、重设计先审计、
交付前过 §14 检查清单。本项目的偏离点：§9.G 的「零 em-dash」是给英文营销文案的，
**中文破折号 `——` 不受此限**。

### 内容来源

| 来源 | 用于 |
|---|---|
| `data/pages_fixed.jsonl` | 所有英文引述的**唯一**来源——逐字提取，不做任何改写 |
| `data/blocks/*.json` | 生成器的自动填充源（引述/伪代码/习题） |
| `data/structure.json` | 章/节/页码映射——level 的 source 字段从这里取 |
| 原书渲染图（pymupdf） | 符号映射的**地面真值**——不靠推断，眼见为实 |

### 中文解说原则

- 不是翻译，是**解读**——告诉读者这句为什么重要、容易怎么误读
- 每条 zh 至少包含一个 ★ 标记的重点（最容易忽略或误解的地方）
- 用 LaTeX 记号（`$...$`）写公式，用 `**粗体**` 强调关键词
- 交叉引用其他关卡用 `#/ch<NN>/<section>` 格式的链接
