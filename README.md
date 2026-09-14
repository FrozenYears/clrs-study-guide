# CLRS 算法导论 · 闯关式学习站

把《算法导论》第 4 版（CLRS，2022，1312 页）拆成**可视化、可交互、代码严谨**的闯关式学习站，
面向「有 C 语言基础、没有算法基础」的读者。

- **线上地址**：<https://clrs-algo-quest.app.workbuddy.host/>
- **技术形态**：零构建静态站 + 原生 ES Module。无 npm、无打包器、**不引任何外部网络资源**
  （字体只用系统已装字体，所以断网也能跑）。
- **内容模型**：全书 8 部分 / 35 章 + 4 附录 / 149 节；每节一关，每关**九段式**递进
  （位置感 → 直觉 → 原文精读 → 伪代码 → 动手看见 → 双轨实现 → 复杂度 → 正确性 → 闯关测验）。
- **代码轨道**：伪代码 + C（动画另有一份后台 JS 生成器驱动画面，纳入测试）。

读书的人从这个链接直接开始：<https://clrs-algo-quest.app.workbuddy.host/>

---

## 一、本地查看

站点是 ES Module 写的，**必须用 HTTP 服务打开，不能双击 index.html**（`file://` 下浏览器会因
CORS 拦掉模块加载，页面会是空白）。

```bash
cd site
"C:/Users/FrozenYears/.workbuddy/binaries/python/versions/3.13.12/python.exe" -m http.server 8317 --bind 127.0.0.1
```

然后浏览器打开：<http://127.0.0.1:8317/>

> `python` / `python3` / `py` 在 PATH 里的话，直接 `python -m http.server 8317` 即可。
> 端口可换，换完后面所有命令里的 `8317` 也要跟着换。

只想换主题看效果、或者想确认窄屏不横向滚动，用这个开发辅助页：

```
http://127.0.0.1:8317/_dev/shot.html?t=light&r=%23/ch02/s01/s03&w=375&h=2000
#   t = light|dark（主题）  r = 路由（# 写成 %23）  w = 视口宽  h = 视口高
#   它会把横向溢出量写进页面标题，用 --dump-dom 读得到
```

---

## 二、上线与更新

线上是**静态快照**：本地改完不会自动同步，需要**重新发布一次**。

| 方式 | 怎么做 |
|---|---|
| 让 AI 发布（推荐） | 直接说一句「把站点同步到线上」。发布需要你**在当轮明确要求**，AI 不会自己发 |
| 手动管理 | 打开 WorkBuddy 的**「设置 — 数据管理 — 应用」**，在列表里找到「CLRS 算法闯关」 |

注意：

- 重新发布会**覆盖线上现有内容**，链接不变（`https://clrs-algo-quest.app.workbuddy.host/`）。
- 发布上传的是 `site/` 目录，所以**改完先确认本地预览没问题再发布**。
- 线上只是展示层；**学习进度存在读者自己浏览器的 localStorage 里**，不随发布变化，也不会上传。

---

## 三、常用命令

下面命令都在**仓库根目录**执行。`<py>` = 上面的 Python 绝对路径，`<node>` = `C:/Users/FrozenYears/.workbuddy/binaries/node/versions/22.22.2-3/node.exe`。

### 日常自检（改完东西跑这一组）

| 用途 | 命令 |
|---|---|
| 站点 JS 语法 | `<node> site/tools/check-syntax.mjs .` |
| 算法实现断言 | `<node> site/assets/algorithms/__tests__.mjs` |
| 数学渲染断言 | `cd site && <node> assets/core/__tests-katex__.mjs` |
| 逐路由真实渲染 | `<py> tools/smoke_browser.py 8317`（需先起本地服务） |
| 全部一起 | 上面四条依次跑；全绿才算改完 |

### 关卡内容（写新关卡用这一组）

| 用途 | 命令 |
|---|---|
| 生成关卡骨架 | `<py> tools/05_new_level.py 3 3.1 --register` |
| 导出关卡数据 | `<node> tools/dump_levels.mjs` |
| **关卡合规闸门** | `<py> tools/04_verify_level.py`（要求 0 ERROR） |
| 两步一起（改完必跑） | `<node> tools/dump_levels.mjs && <py> tools/04_verify_level.py` |

写一关的标准流程 = **生成骨架 → 填掉所有 `【TODO …】` → 跑闸门直到 0 ERROR / 0 TODO**。
细节与全部已知坑见 `docs/关卡编写手册.md`。

### 语料流水线（只有改 PDF 解析规则时才需要）

按顺序跑，每一步都有对应测试：

| 步骤 | 命令 | 对应测试 |
|---|---|---|
| ① 抽取文本与结构 | `<py> tools/01_extract.py` | — |
| ② 修复符号编码 | `<py> tools/02_repair.py` | `<py> tools/test_repair.py` |
| ③ 切成知识块 | `<py> tools/03_segment.py` | `<py> tools/test_segment.py` |
| ④ 插图切图 | `<py> tools/04_figures.py` | `<py> tools/test_figures.py` |

> ⚠️ 改了 ② 之后必须重跑 ③（③ 读 ② 的产物），并且**审计要在 `data/pages.jsonl`（未修复原文）上做**
> —— 修复后的文本里伪影已经消失，拿它当依据会得出完全错误的结论。

### 站点功能自检页（`site/_dev/`）

| 页面 | 用途 |
|---|---|
| `smoke.html` | 路由 / 存档 / 步进引擎 / 数学渲染联通性 |
| `smoke-array.html` | 数组可视化引擎 + 插入排序生成器单步 |
| `dbg-stages.html` | 九段式各阶段逐个渲染，异常直接打在页面上 |
| `dbg-func.html` | 步进语义、测验、进度落盘的功能断言 |
| `dbg-tree.html` | 树/递归树引擎逐帧校验 |
| `shot.html` | 强制主题截图 + 横向溢出报告 |

---

## 四、目录结构

```
docs/            建设计划、开发规范（契约）、关卡编写手册、各阶段报告
data/            pages.jsonl（原文抽取）→ pages_fixed.jsonl（修复后）
                 blocks/（按章切好的知识块）· figures.json + figs/（插图）
tools/           语料流水线 01–04、关卡闸门 04_verify_level、关卡生成器 05、各测试
site/            静态站本体（改完直接生效，无构建）
  index.html       首页 = 全书目录 + 进度层
  assets/
    theme.css      设计令牌（颜色/字体/间距/圆角）—— 只改这里就能换全站配色
    layout.css     版式骨架    components.css  组件
    core/          运行时：dom / store（进度存档）/ router / stepper / katex
    viz/           可视化引擎：array（数组）/ tree（树与递归树）
    algorithms/    算法生成器（驱动动画）+ 断言测试
    ui/            章节外壳：registry / chapter-view / stages（九段式渲染）
    chapters.js    章节注册表（新章要在这里登记）
  chapters/      关卡内容：一章一个目录，一节一个文件
  _dev/          开发自检页（见上表）
c/               C 语言实现（与关卡内嵌的 C 代码必须逐字节一致，闸门会查）
```

**文件归属**（谁可以改什么）见 `docs/开发规范.md` 第二节 —— 并行开发时一个 agent 只碰自己那一章。

---

## 五、几个容易踩的点

- **不要双击 `index.html`**，用本地 HTTP 服务（见第一节）。
- **不要把 `site/` 打成静态快照直接分发**：路由是 hash 路由（`#/ch02/s01/s03`），链接可以随便分享，
  但要能打开仍需要 HTTP 服务（本地或线上）。
- **进度存在浏览器里**：换浏览器 / 清缓存会丢；不同设备之间不同步。
- **`data/` 与 `c/` 是「源」**：`data/pages_fixed.jsonl` 是内容溯源的唯一依据，`c/*.c` 是 C 轨道的唯一副本。
  关卡里内嵌的 C 与引述都由闸门与源文件比对，不要手改内嵌副本。
- **本机 Git Bash 的 PATH 是坏的**：`ls`/`mkdir`/`rm`/`head`/`tail`/`dirname` 都用不了。
  用 PowerShell，或直接用上文的 Python 绝对路径执行脚本（删除文件用 Python 的 `os.remove`）。
