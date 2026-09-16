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

console.log("\n[8] renderMixed 的 **粗体**（关卡文案大量依赖，曾被原样输出）");{
  const el = renderMixed("这是**重点**内容");
  ok(el.textContent === "这是重点内容", `粗体标记已吃掉：${JSON.stringify(el.textContent)}`);
  ok(count(el, "STRONG") === 1, `生成 1 个 strong（实际 ${count(el, "STRONG")}）`);
}
{
  const el = renderMixed("**求值**了几次");
  ok(count(el, "STRONG") === 1 && el.textContent === "求值了几次",
     `行首粗体：${JSON.stringify(el.textContent)}`);
}
{
  const el = renderMixed("**a** 与 **b**");
  ok(count(el, "STRONG") === 2, `两处粗体都要生效（实际 ${count(el, "STRONG")}）`);
}
{
  const el = renderMixed("**$n^2$ 次**");
  ok(count(el, "STRONG") === 1, "粗体内部可以嵌数学公式");
  ok(el.textContent.indexOf("次") >= 0, `内嵌公式后文字仍在：${JSON.stringify(el.textContent)}`);
}
{
  // 防误伤：幂运算 / 落单星号 / 空白紧贴，都不该被当强调
  const cases = ["a ** b", "** 空格开头**", "**未闭合", "2 ** 10 = 1024"];
  cases.forEach((c) => {
    const el = renderMixed(c);
    ok(count(el, "STRONG") === 0 && el.textContent === c,
       `不改动 ${JSON.stringify(c)}（得到 ${JSON.stringify(el.textContent)}）`);
  });
}
{
  // 混排顺序：粗体与公式交错时不能互相吞掉
  const el = renderMixed("设 $T(n)$ 是**总时间**");
  ok(el.textContent === "设 T(n) 是总时间" && count(el, "STRONG") === 1,
     `粗体与公式混排：${JSON.stringify(el.textContent)}`);
}

console.log("\n[9] 分式：\\frac / \\dfrac / \\tfrac（\\dfrac 曾原样输出，页面上会碎成 “\\dfracn(n+1)2”）");
{
  ["frac", "dfrac", "tfrac"].forEach((cmd) => {
    const el = renderInline(`\\${cmd}{n(n+1)}{2}`);
    ok(count(el, "SPAN") >= 3 && el.textContent === "n(n+1)2",
       `\\${cmd}{{a}}{{b}} 渲染成 .frac 结构（textContent=${JSON.stringify(el.textContent)}）`);
    ok(el.textContent.indexOf("\\") < 0,
       `\\${cmd} 不残留反斜杠：${JSON.stringify(el.textContent)}`);
  });
  // 关卡里的真实写法：求和号 + 分式混排
  const real = renderInline("\\sum_{i=2}^{n} t_i = \\dfrac{n(n+1)}{2} - 1");
  ok(real.textContent.indexOf("dfrac") < 0 && real.textContent.indexOf("\\") < 0,
     `真实公式里无残留命令：${JSON.stringify(real.textContent)}`);
  ok(count(real, "SUB") >= 1 && count(real, "SUP") >= 1,
     "上下标仍然生效");
}

console.log("\n[10] \\text / 箭头族 / cases / underbrace / xrightarrow（曾经全部原样输出）");
{
  const el = renderInline("t_i = 1 \\quad \\text{for } i = 2, 3, \\dots, n");
  ok(el.textContent.indexOf("\\") < 0, `\\text 不残留：${JSON.stringify(el.textContent)}`);
  ok(count(el, "SPAN") >= 1 && /for/.test(el.textContent),
     `\\text 内容原样输出（文本模式）：${JSON.stringify(el.textContent)}`);
}
{
  // \Rightarrow(⇒) 与 \implies(⟹) 是不同字形，不能混为一谈
  const eq = renderInline("a \\Rightarrow b");
  ok(eq.textContent === "a ⇒ b", `\\Rightarrow → ⇒（得到 ${JSON.stringify(eq.textContent)}）`);
  const lq = renderInline("a \\Longrightarrow b");
  ok(lq.textContent === "a ⟹ b", `\\Longrightarrow → ⟹（得到 ${JSON.stringify(lq.textContent)}）`);
}
{
  const el = renderInline(
    "T(n) = \\begin{cases} \\Theta(1) & \\text{if } n = 1 \\\\ " +
    "T(n-1) + \\Theta(n) & \\text{otherwise.} \\end{cases}"
  );
  ok(el.textContent.indexOf("\\") < 0, `cases 不残留命令：${JSON.stringify(el.textContent)}`);
  ok(el.textContent.indexOf("cases") < 0, "cases 关键字不会漏成文本");
  ok(/otherwise/.test(el.textContent), "第二个分支被渲染");
  ok(/if/.test(el.textContent), "条件列被渲染");
}
{
  const el = renderInline("\\underbrace{c_2 n + \\cdots + c_2 n}_{n - 1}");
  ok(el.textContent.indexOf("\\") < 0, `underbrace 不残留：${JSON.stringify(el.textContent)}`);
  ok(/n - 1/.test(el.textContent) || /n-1/.test(el.textContent),
     `下方标注被渲染：${JSON.stringify(el.textContent)}`);
}
{
  const el = renderInline("\\xrightarrow{\\;\\text{丢低阶与系数}\\;} \\Theta(n^2)");
  ok(el.textContent.indexOf("\\") < 0, `xrightarrow 不残留：${JSON.stringify(el.textContent)}`);
  ok(/丢低阶与系数/.test(el.textContent), "箭头上方标注被渲染");
  ok(el.textContent.indexOf("→") >= 0, "箭头本身被渲染");
}

{
  // 第 5 章新关卡的文案引入了四条命令：\land \Pr \binom \overline
  // 桩 DOM 没有 querySelector，所以自己走一遍子树按 className 找节点。
  const hasClass = (node, cls) => {
    let hit = false;
    (function walk(x) {
      if (x.nodeType === 1 && x.className === cls) hit = true;
      (x.childNodes || []).forEach(walk);
    })(node);
    return hit;
  };
  const land = renderInline("a \\land b");
  ok(land.textContent === "a ∧ b", `\\land → ∧（得到 ${JSON.stringify(land.textContent)}）`);
  const lor = renderInline("a \\lor b");
  ok(lor.textContent === "a ∨ b", `\\lor → ∨（得到 ${JSON.stringify(lor.textContent)}）`);
  const pr = renderInline("\\Pr\\{A\\}");
  ok(pr.textContent.indexOf("\\") < 0 && /Pr/.test(pr.textContent),
     `\\Pr → Pr 且不残留反斜杠（得到 ${JSON.stringify(pr.textContent)}）`);
  const binom = renderInline("\\binom{23}{2} = 253");
  ok(binom.textContent.indexOf("\\") < 0 && /23/.test(binom.textContent) && /253/.test(binom.textContent),
     `\\binom 不残留命令且两层内容都在（得到 ${JSON.stringify(binom.textContent)}）`);
  ok(hasClass(binom, "binom__top") && hasClass(binom, "binom__bottom"),
     "\\binom 渲染成 .binom 的上下两层结构（不是分式的横线结构）");
  const ovl = renderInline("P(\\overline{A}) = 1 - P(A)");
  ok(ovl.textContent.indexOf("\\") < 0 && /A/.test(ovl.textContent),
     `\\overline 不残留命令（得到 ${JSON.stringify(ovl.textContent)}）`);
  ok(hasClass(ovl, "overline"), "\\overline 渲染成 .overline 顶线结构");
  // 参数缺失也不能把反斜杠漏到页面上（静态扫描会这么探）
  const binom1 = renderInline("\\binom{x}");
  ok(binom1.textContent.indexOf("\\") < 0, `\\binom{x} 缺第二个参数时不残留命令（得到 ${JSON.stringify(binom1.textContent)}）`);
}

console.log("\n[11] 静态扫描：关卡文案里用到的每条 \\命令都必须是渲染器认识的");
{
  // ★ 存在意义：这份 PDF 转写的关卡文案会不断引入新的数学命令，
  //   而渲染器遇到不认识的命令是「原样吐出来」——页面上就会出现
  //   "\textfor "、"\begincases" 这种碎片，且不报错、不白屏，极易漏过。
  //   这条断言把每个新命令都在这里挡一次。（本段正是靠它发现的。）
  const fs = await import("node:fs");
  const path = await import("node:path");
  // 约定：本测试在 site/ 目录下运行，关卡在 site/chapters/ 里
  const root = process.cwd();
  const files = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (name.startsWith(".") || name === "node_modules" || name === "_dev") continue;
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) {
        walk(p);
      } else if (name.endsWith(".js") && dir.indexOf(path.sep + "chapters") >= 0) {
        files.push(p);
      }
    }
  })(root);

  const used = new Set();
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    // ★ 只认「2 个及以上反斜杠 + 字母」= 源码里的真 LaTeX 命令。
    //   单个反斜杠是 JS 转义（\n、\t）或 String.raw 里的 C 代码，不算命令。
    for (const m of src.matchAll(/\\\\+([a-zA-Z]+)/g)) used.add(m[1]);
  }

  const STRUCTURAL = new Set([
    "frac", "dfrac", "tfrac", "sqrt", "mathcal",
    "text", "textrm", "mathrm", "mathit",
    "begin", "end", "underbrace", "overbrace", "xrightarrow", "xleftarrow",
  ]);

  function recognized(cmd) {
    if (STRUCTURAL.has(cmd)) return true;
    // 用渲染器本身当判据：认识的命令不会把反斜杠漏进文本
    const probes = [`\\${cmd}`, `\\${cmd}{x}`, `\\${cmd}{x}{y}`];
    return probes.some((p) => {
      try {
        return renderInline(p).textContent.indexOf("\\") < 0;
      } catch (e) {
        return false;
      }
    });
  }

  const unknown = [...used].filter((c) => !recognized(c)).sort();
  ok(files.length > 0, `扫描到 ${files.length} 个关卡文件`);
  ok(used.size > 0, `提取到 ${used.size} 条不同的 \\命令`);
  // 防止「扫了个空目录」也能过的假绿
  ok(used.has("Theta") && used.has("frac"), "扫描到的命令里含 Theta / frac（确认扫的是关卡目录）");
  ok(
    unknown.length === 0,
    unknown.length
      ? `以下命令渲染器不认识，会在页面上显示成带反斜杠的碎片：${unknown.join(", ")}`
      : `关卡文案用到的 ${used.size} 条命令全部可渲染`
  );
}

console.log(`\n==== 结果：${passed} passed, ${failed} failed ====`);
process.exit(failed === 0 ? 0 : 1);
