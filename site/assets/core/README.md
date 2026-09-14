# core/ API 速查（运行时 Agent 维护）

零依赖、零构建的原生 ES Module。所有文件用 `<script type="module">` 直接引入即可，
无需打包器、无需 npm、无网络请求。

```js
import { h, svg, on, $, $$, frag } from "./assets/core/dom.js";
import * as store from "./assets/core/store.js";
import * as router from "./assets/core/router.js";
import * as katex from "./assets/core/katex.js";
import { createStepper } from "./assets/core/stepper.js";
```

---

## dom.js — 极简 DOM helper
`h(tag, props?, ...children) -> HTMLElement` — 创建元素；props 处理 class/style(对象或串)/dataset/html/text/事件(onXxx)/任意属性；第二参为字符串时视为文本。
`svg(tag, props?, ...children) -> SVGElement` — 同上，但创建于 SVG 命名空间（用于可视化绘图）。
`on(el, event, fn, opts?) -> () => void` — 绑定事件并返回解绑函数。
`$(selector, root=document) -> Element|null` — 单元素查询。
`$$(selector, root=document) -> Element[]` — 多元素查询（返回真数组）。
`frag(...children) -> DocumentFragment` — 构建文档片段。

## store.js — 进度 / 错题 / 设置（localStorage，防抖写入）
`load() -> state` — 读取并校验+迁移状态（首次调用时初始化）。
`getState() -> state` — 返回当前状态对象。
`save()` — 防抖落盘（一般无需手动调用）。
`flush()` — 立即落盘（页面卸载前用）。
`getSettings() -> {theme, speed, autoplay, reduceMotion}` — 读取用户设置。
`updateSettings(patch) -> settings` — 合并写入设置；若含 theme 则自动应用。
`setThemePref('light'|'dark'|'auto')` — 设置主题偏好并应用到 `<html data-theme>`。
`getThemePref() -> string` — 读取主题偏好（默认 'auto'）。
`applyTheme()` — 把主题偏好写到 `<html>`（'auto' 即移除属性，交给 CSS 跟随系统）。
`markStage(ch, sec, stage, done=true)` — 标记某关某阶段完成/未完成。
`isStageDone(ch, sec, stage) -> bool` — 查询阶段是否完成。
`getStageSet(ch, sec) -> Set<string>` — 返回已完成阶段集合。
`setQuiz(ch, sec, score0to1)` / `getQuiz(ch, sec) -> number|null` — 记录/读取测验得分。
`chapterDone(ch, sec) -> bool` — 九段式（9 阶段）是否全部完成。
`addWrong({ch, sec, q, detail?})` / `clearWrong(id)` / `getWrong() -> array` — 错题本增删查。
`subscribe(cb) -> () => void` — 状态变更订阅（落盘时回调）。

## router.js — 三级 hash 路由
`parse(hash?) -> route` — 解析哈希为 `{kind, raw, segments, ch, chNum, section, stage, isAppendix}`（kind: home/chapter/appendix/404）。
`buildUrl(ch, section?, stage?) -> string` — 生成 `#/ch02/s01/s04` 或 `#/appendix/a/s01`（ch 为字母时走附录形式；数字自动补零；阶段为数字时补 `s` 前缀）。
`navigate(hash)` — 设置 `location.hash`（值不变则不触发）。
`onChange(cb) -> () => void` — 注册路由变化回调；注册时立即以当前路由回调一次（便于首屏渲染）。
`current() -> route` — 最近一次解析结果。
`start()` — 开始监听 `hashchange`（幂等）。
`view404(msg?) -> HTMLElement` — 未知路由视图节点。

## stepper.js — 步进引擎（接管 generator，每 `yield` = 一帧）
`createStepper(generator, opts?) -> stepper` — 创建引擎；opts: speed/autoplay/loop/total/mount/reducedMotion/respectReducedMotion。
`play()` — 播放（reduced-motion 下 createStepper 的 autoplay 被强制关闭，但显式 play 仍生效）。
`pause()` / `toggle()` — 暂停 / 播放暂停切换。
`step() -> bool` — 前进一帧（到末尾默认停止；loop 时回到 0）。
`stepBack() -> bool` — 后退一帧。
`reset()` — 回到第 0 帧并暂停。
`setSpeed(ms)` — 调速（播放中实时生效）。
`gotoFrame(n)` — 跳到指定帧（自动夹紧范围；End 键会先跑完整个生成器）。
`onFrame(cb) -> () => void` — 注册帧回调 `cb(frame, state)`；注册即回调当前帧一次。
`getState() -> {index, total, playing, speed, done}` — total 在未知时为 null（已知帧数可经 opts.total 提示）。
`destroy()` — 停止并解绑键盘、清空回调。

回退实现：**缓存已产生帧**（frames[]）。理由见文件头：CLRS 算法生成器就地修改输入数组，
靠 `array: A.slice()` 输出快照，无法简单重放；缓存帧通用且零成本（教学动画 n 极小）。

## katex.js — 数学渲染（接口可替换 ⚠️）
`init(opts?) ` — 传入 `opts.katex`（已加载的 KaTeX 命名空间）后，内部实现整体替换为真 KaTeX；调用方代码不变。
`renderInline(tex) -> Node` — 渲染行内公式（对应 `$...$`）。
`renderBlock(tex) -> Node` — 渲染独立成行公式（对应 `$$...$$`）。
`render(tex, opts?) -> Node` — `opts.display` 为真时走 renderBlock。
`renderMixed(text) -> Node` — 扫描文本中的 `$...$` / `$$...$$`，返回混排片段（文本自动转义）。

默认是无网络依赖的极简渲染：常见记号→Unicode，上下标用 `<sub>/<sup>`，分式用 `<span class="frac">`（样式在 components.css）。
**替换方式**：将来把真 KaTeX vendor 到 `assets/vendor/katex/` 后，只需在入口调用
`katex.init({ katex: window.katex })`，所有 `renderInline/renderBlock` 调用自动改走真 KaTeX。

---

## 下游 agent 必须知道的约定（避免踩坑）

1. **可视化专用色**：只引用 `theme.css` 的 `--viz-idle/compare/active/done/result/mark/violation`，
   不要自己定义颜色。色盲友好，但每个状态仍建议叠加形状/文字标签（红/绿不单独使用）。
2. **原文 vs 讲解**：英文原文块加 `data-kind="source"`（衬线体 + 米色底），
   讲解补充块加 `data-kind="note"`（无衬线 + 冷蓝底）。混排会被审计打回（红线 R3）。
3. **动画帧字段**（4.3）：算法生成器每 `yield` 一帧，字段固定为
   `line / array / pointers / highlight / note / counts / invariantHolds / done`；
   `highlight` 键固定为 `compare/active/move/sortedPrefix/pivot/visited/frontier/path/violation`。
4. **CSS 红线 R5**：禁止硬编码颜色/字号/圆角，一律用 `theme.css` 令牌（含 `--fs-*`/`--radius-*`/`--shadow-*`）。
5. **键盘与动效**：交互组件必须支持键盘；尊重 `prefers-reduced-motion`（stepper 已内置）。
6. **不要改别人的文件**（红线 R8）：viz/ 归可视化 Agent，algorithms/ 归算法 Agent，
   chapters/ 归内容 Agent；运行时只动 `site/assets/core/**`、三份 css、index.html、本文件。
