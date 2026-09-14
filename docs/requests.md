# 跨 Agent 请求（requests）

可视化 / 算法 Agent 需要运行时 / 设计系统新增能力时，在此追加一条。请勿自行修改他人文件。

---

## REQ-2026-09-14-01 · 新增 `--viz-move` 设计令牌

- **提出方**：可视化 Agent（P4 数组引擎 array.js）
- **背景**：开发规范 4.3 的 `highlight` 标准键含 `move`（搬移中），但规范 7.2 的可视化色板只有 `--viz-idle/compare/active/done/result/mark/violation` 七枚，没有 `move` 对应色。
- **当前临时处理**：array.js 把 `move` 映射到 `--viz-active`（紫）+ 交叉斜纹 + 文字标签「移动」三通道区分，未硬编码颜色，可正常显示。
- **请求**：若希望「移动」有独立色相（而非复用 active 的紫），请在 `theme.css` 的 7.2 增加一枚令牌，例如 `--viz-move: <色值>`（建议与 `--viz-active` 不同色相，仍满足色盲友好 / 灰阶可辨）。新增后引擎改为 `setFill(rect, '--viz-move')` 即可。
- **影响面**：仅 `site/assets/viz/array.js` 一处引用，改动局部。

### ✅ 已解决（2026-09-15）
采纳，但**不是新增色相**：新增 `--viz-move` 为「与 `--viz-active` 同色相的另一档明度」
（明色 `#9a63c9`，暗色 `#c9a6f0`），保留原有的交叉斜纹与「移动」文字标签，共三通道区分。
理由：色板已有 7 个色相，再引入第 8 个会整体拉低色盲与灰阶下的可分辨性；
而 active 与 move 语义相邻，用明度差 + 纹理 + 标签足以分开。
同时把明度阶梯写进了开发规范 7.2：`idle < compare < move < result < done < active < mark < violation`。
`site/assets/viz/array.js` 已改为引用 `--viz-move`。
