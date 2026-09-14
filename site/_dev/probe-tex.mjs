// probe-tex.mjs — 临时探针：实测关卡文案里用到、但实现可能缺失的 LaTeX 命令。
// 用与 __tests-katex__.mjs 相同的 DOM 桩，直接跑 node。

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

const k = await import("../assets/core/katex.js");

const CASES = [
  // 关卡里真实出现的 7 个未实现命令
  ["\\text", "t_i = 1 \\quad \\text{for } i = 2, 3, \\dots, n"],
  ["\\text（独立）", "\\text{otherwise.}"],
  ["\\Longrightarrow", "\\qquad \\Longrightarrow \\qquad"],
  ["\\Rightarrow", "两段有序 \\Rightarrow MERGE 之后整体有序"],
  ["\\begin{cases}", "T(n) = \\begin{cases} \\Theta(1) & \\text{if } n = 1 \\end{cases}"],
  ["\\underbrace", "\\underbrace{c_2 n + c_2 n + \\cdots + c_2 n}_{n - 1}"],
  ["\\xrightarrow", "an^2 + bn + c \\quad \\xrightarrow{\\;\\text{丢低阶与系数}\\;} \\quad \\Theta(n^2)"],
  // 对照组：已实现的命令
  ["（对照）\\frac", "\\frac{n(n+1)}{2}"],
  ["（对照）\\lg", "\\Theta(n \\lg n)"],
  ["（对照）\\implies", "a \\implies b"],
];

for (const [label, tex] of CASES) {
  const el = k.renderInline(tex);
  const tags = [];
  (function walk(x) {
    if (x.nodeType === 1) tags.push(x.nodeName + (x.className ? "(" + x.className + ")" : ""));
    (x.childNodes || []).forEach(walk);
  })(el);
  console.log("── " + label);
  console.log("   IN : " + tex);
  console.log("   TXT: " + JSON.stringify(el.textContent));
  console.log("   DOM: " + tags.join(" ").slice(0, 130));
  console.log("   残留反斜杠: " + (el.textContent.indexOf("\\") >= 0 ? "★ 有（说明命令未被识别）" : "无"));
  console.log();
}
