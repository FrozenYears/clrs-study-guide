// __tests-katex__.mjs — 数学渲染器的回归测试（node 直接跑）
//
// 存在意义：曾有一个致命 bug —— 上下标分支在 readGroup() 之前没跳过 `_`/`^` 本身，
// 于是 parse("_") 生成 <sub>_</sub>，而它又去 parse("_") …… 无限递归，
// 任何含 `_{...}` 的公式（例如 \sum_{i=2}^{n}）都会让整个阶段白屏。
// 这个测试把那种情形钉死。

/* ---------- 最小 DOM 桩（只够 katex.js 用） ---------- */
class N {
  constructor(nodeType, nodeName) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.childNodes = [];
    this._text = "";
    this.className = "";
  }
  appendChild(c) {
    if (!c) return c;
    if (c.nodeType === 11) {
      const kids = c.childNodes.slice();
      c.childNodes.length = 0;
      kids.forEach((k) => this.appendChild(k));
      return c;
    }
    this.childNodes.push(c);
    c.parentNode = this;
    return c;
  }
  get textContent() {
    if (this.nodeType === 3) return this._text;
    return this.childNodes.map((c) => c.textContent).join("");
  }
  get tagName() {
    return this.nodeName;
  }
}

globalThis.document = {
  createElement(tag) {
    return new N(1, String(tag).toUpperCase());
  },
  createTextNode(t) {
    const n = new N(3, "#text");
    n._text = String(t);
    return n;
  },
  createDocumentFragment() {
    return new N(11, "#document-fragment");
  },
};

const { renderInline, renderMixed } = await import("./katex.js");

/* ---------- 断言工具 ---------- */
let passed = 0;
let failed = 0;
function ok(cond, msg) {
  if (cond) {
    passed++;
    console.log("  PASS " + msg);
  } else {
    failed++;
    console.log("  FAIL " + msg);
  }
}
/** 收集某标签名下的节点个数 */
function count(node, tag) {
  let n = 0;
  (function walk(x) {
    if (x.nodeType === 1 && x.nodeName === tag) n++;
    (x.childNodes || []).forEach(walk);
  })(node);
  return n;
}
function names(node) {
  const out = [];
  (function walk(x) {
    if (x.nodeType === 1) out.push(x.nodeName);
    (x.childNodes || []).forEach(walk);
  })(node);
  return out;
}

console.log("\n[1] 曾经崩溃的输入：上下标必须能终止");
for (const bad of ["_", "^", "a_{1}", "\\sum_{i=2}^{n} t_i", "T(n) = an^2 + bn + c"]) {
  let msg = "";
  let threw = false;
  try {
    const el = renderInline(bad);
    msg = el.textContent;
  } catch (e) {
    threw = true;
    msg = e.name + ": " + e.message;
  }
  ok(!threw, `renderInline(${JSON.stringify(bad)}) 未抛异常（得 "${msg}"）`);
  ok(!/\\/.test(msg) || bad.indexOf("\\") === -1 || msg.indexOf("\\sum") === -1,
    `  且没有把 \\(反斜杠) 漏到输出里：${JSON.stringify(msg)}`);
}

console.log("\n[2] 上下标结构正确");
{
  const el = renderInline("\\sum_{i=2}^{n} t_i");
  ok(el.textContent === "Σi=2n ti", `Σ 求和式文本 = ${JSON.stringify(el.textContent)}`);
  ok(count(el, "SUB") === 2, `<sub> 个数 = ${count(el, "SUB")}（期望 2：i=2 与 tᵢ 的下标）`);
  ok(count(el, "SUP") === 1, `<sup> 个数 = ${count(el, "SUP")}（期望 1：上标 n）`);
}
{
  const el = renderInline("T(n) = an^2 + bn + c");
  ok(el.textContent === "T(n) = an2 + bn + c", `文本 = ${JSON.stringify(el.textContent)}`);
  ok(count(el, "SUP") === 1, "<sup> 个数 = 1");
}

console.log("\n[3] 分式与根号");
{
  const el = renderInline("\\frac{n(n+1)}{2}");
  ok(el.textContent === "n(n+1)2", `分式文本 = ${JSON.stringify(el.textContent)}`);
  const frac = names(el).indexOf("SPAN") >= 0;
  ok(frac, "分式被包进 span.frac 结构");
}
{
  const el = renderInline("\\sqrt{n}");
  ok(el.textContent === "√n", `根号文本 = ${JSON.stringify(el.textContent)}`);
}

console.log("\n[4] 符号表：CLRS 常用记号");
const SYMCASES = [
  ["\\Theta(n^2)", "Θ(n2)"],
  ["\\langle 5, 2, 4 \\rangle", "⟨ 5, 2, 4 ⟩"],
  ["a \\le b", "a ≤ b"],
  ["i \\coloneqq 1", "i ≔ 1"],
  ["x \\in A", "x ∈ A"],
  ["A \\subseteq B", "A ⊆ B"],
  ["n \\to \\infty", "n → ∞"],
  ["\\lfloor x \\rfloor", "⌊ x ⌋"],
];
for (const [src, want] of SYMCASES) {
  const el = renderInline(src);
  ok(el.textContent === want, `${JSON.stringify(src)} → ${JSON.stringify(el.textContent)}`);
}

console.log("\n[5] 纯排版命令与间距命令不产出字符");
{
  // 注意：\left / \right 只吃字符，不产出；\frac{a}{b} 的文本是 num"a" + den"b" = "ab"
  const el = renderInline("\\left(\\frac{a}{b}\\right)");
  ok(el.textContent === "(ab)", `\\left(\\frac{a}{b}\\right) → ${JSON.stringify(el.textContent)}`);
  ok(el.textContent.indexOf("left") === -1 && el.textContent.indexOf("right") === -1,
    "输出里没有 left / right 字样");
  // 有空格时，空格本身要保留（不能被吞掉）
  const el1 = renderInline("\\left( \\frac{a}{b} \\right)");
  ok(el1.textContent === "( ab )", `带空格的写法 → ${JSON.stringify(el1.textContent)}`);
  const el2 = renderInline("a \\, b \\; c");
  ok(el2.textContent === "a  b  c", `间距命令 → ${JSON.stringify(el2.textContent)}`);
  const el3 = renderInline("\\displaystyle\\sum_{i=1}^{n} i");
  ok(el3.textContent === "Σi=1n i", `\\displaystyle 被丢弃 → ${JSON.stringify(el3.textContent)}`);
}

console.log("\n[6] renderMixed：$...$ 与 $$...$$ 混排");
{
  const f = renderMixed("前面 $a_{1}$ 中间 $$\\sum_{i=1}^{n} i$$ 后面");
  const t = f.textContent;
  ok(t.indexOf("前面 ") === 0, `以普通文字开头：${JSON.stringify(t.slice(0, 8))}`);
  ok(t.indexOf("后面") === t.length - 2, `以普通文字结尾：${JSON.stringify(t.slice(-8))}`);
  ok(t.indexOf("Σ") >= 0, "块级求和式被渲染成 Σ");
}
{
  const f = renderMixed("没有公式的一句话");
  ok(f.textContent === "没有公式的一句话", "没有 $ 时原样输出");
}
{
  const f = renderMixed("未闭合 $a + b");
  ok(f.textContent.indexOf("a + b") >= 0, "未闭合的 $ 降级为把剩余部分当公式，不抛异常");
}

console.log("\n[7] 未知命令降级但不崩");
{
  let msg = "";
  let threw = false;
  try {
    msg = renderInline("\\foobarbaz{x}").textContent;
  } catch (e) {
    threw = true;
  }
  ok(!threw, "未知命令不抛异常");
  ok(msg.indexOf("foobarbaz") >= 0, `未知命令原样保留：${JSON.stringify(msg)}`);
}
{
  const el = renderInline("{a}{b}");
  ok(el.textContent === "ab", `裸露的分组被展开：${JSON.stringify(el.textContent)}`);
}

console.log(`\n==== 结果：${passed} passed, ${failed} failed ====`);
process.exit(failed === 0 ? 0 : 1);
