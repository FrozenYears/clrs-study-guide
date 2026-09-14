# 项目长期记忆 · CLRS 交互式闯关学习站

## 项目定位
把《算法导论》第 4 版（2022，1312 页）拆成可视化、可交互、代码严谨的前端闯关章节站。
读者定位：**有 C 语言基础、无算法基础**。

- 书：第 4 版。8 部分 / 35 章 + 4 附录 / 149 节。
- 页码换算：`pdf_index（0 基）= 印刷页码 + 21`。
- 关卡模型：**九段式**（位置感 → 直觉 → 原文 → 伪代码 → 动手看见 → 双轨实现 →
  复杂度 → 正确性 → 闯关测验），章末加 Boss 区（原书 Problems）。
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
