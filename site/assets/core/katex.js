/* =============================================================================
 * core/katex.js — 数学渲染的薄封装（运行时 Agent 拥有）
 *
 * ⚠️ 可替换接口（重要）：
 *   默认实现是一个【不依赖网络】的极简渲染器，把常见记号映射成 Unicode，
 *   用 <sup>/<sub> 处理上下标、<span class="frac"> 处理分式（样式见 components.css）。
 *   将来有人把真正的 KaTeX vendor 进来时，只需：
 *       import { init } from './katex.js';
 *       init({ katex: window.katex });   // 传入已加载的 KaTeX 命名空间
 *   之后 renderInline / renderBlock 会自动改走真 KaTeX，调用方代码无需任何改动。
 *
 * 公开 API：
 *   init(opts?)                 （opts.katex = 外部 KaTeX 命名空间；设置后内部实现被替换）
 *   renderInline(tex) -> Node   （行内公式，对应 $...$）
 *   renderBlock(tex)  -> Node   （独立成行公式，对应 $$...$$）
 *   render(tex, opts?) -> Node  （opts.display 时走 renderBlock）
 *   renderMixed(text) -> Node   （扫描文本中的 $...$ / $$...$$ / **粗体**，返回混排片段）
 *
 * 支持记号：Θ Ο Ω Σ Π αβγδε θλμπρσ τφω ≤ ≥ ≠ ≈ ≡ ∼ ∞ ∂ ∇ ⌊⌋ ⌈⌉ ∈ ∉ ⊆ ⊂ ⊇
 *          ∪ ∩ ∅ ∀ ∃ → ← ↔ × · ÷ ± ∓ ∑ ∏ ∫ √ log lg ln mod ⋯ … ∠ ⊥ ∥ 等
 * 支持结构：上下标 _{}/^{}、分式 \frac{}{}（\dfrac/\tfrac 同义）、根号 \sqrt{}、
 *          花体 \mathcal{}；\left \right 与 \, \; \! 等间距命令只吃字符不产出。
 * 另注：renderMixed 还负责 **粗体** 与 $...$ / $$...$$ 的混排。
 * ========================================================================== */

let _katex = null; // 外部 KaTeX 命名空间（含 renderToString）
let _opts = {};

export function init(opts = {}) {
  _opts = opts || {};
  if (_opts.katex && typeof _opts.katex.renderToString === "function") {
    _katex = _opts.katex;
  }
  return api;
}

/* ---------- 符号表 ---------- */
const SYM = {
  Theta: "Θ",
  Omega: "Ω",
  Sigma: "Σ",
  Pi: "Π",
  Delta: "Δ",
  Gamma: "Γ",
  Lambda: "Λ",
  Phi: "Φ",
  Xi: "Ξ",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  theta: "θ",
  lambda: "λ",
  mu: "μ",
  pi: "π",
  rho: "ρ",
  sigma: "σ",
  tau: "τ",
  phi: "φ",
  omega: "ω",
  le: "≤",
  ge: "≥",
  ne: "≠",
  approx: "≈",
  equiv: "≡",
  sim: "∼",
  cong: "≅",
  infty: "∞",
  partial: "∂",
  nabla: "∇",
  lfloor: "⌊",
  rfloor: "⌋",
  lceil: "⌈",
  rceil: "⌉",
  in: "∈",
  notin: "∉",
  subseteq: "⊆",
  subset: "⊂",
  supseteq: "⊇",
  supset: "⊃",
  cup: "∪",
  cap: "∩",
  emptyset: "∅",
  forall: "∀",
  exists: "∃",
  land: "∧",
  lor: "∨",
  // 集合差与集合记法（15 章的交换论证里大量出现 A \ B）
  setminus: "∖",
  backslash: "\\",
  // \Pr A：概率算子。KaTeX 会排成正体；这里退一步只保证字形与间距正确
  // （正体靠 .tex-text 做不到，所以直接给字母，不引入额外的样式类）。
  Pr: "Pr",
  to: "→",
  rightarrow: "→",
  leftarrow: "←",
  leftrightarrow: "↔",
  uparrow: "↑",
  downarrow: "↓",
  updownarrow: "↕",
  Uparrow: "⇑",
  Downarrow: "⇓",
  times: "×",
  cdot: "·",
  div: "÷",
  pm: "±",
  mp: "∓",
  sum: "Σ",
  prod: "∏",
  int: "∫",
  oint: "∮",
  sqrt: "√",
  log: "log",
  lg: "lg",
  ln: "ln",
  exp: "exp",
  mod: "mod",
  cdots: "⋯",
  ldots: "…",
  dots: "…",
  vdots: "⋮",
  ddots: "⋱",
  angle: "∠",
  perp: "⊥",
  parallel: "∥",
  prime: "′",
  neq: "≠",
  leq: "≤",
  geq: "≥",
  // —— CLRS 常见补充（书里大量使用 ⟨⟩ 表示序列、≔ 表示赋值）——
  langle: "⟨",
  rangle: "⟩",
  // —— 附录 B–D 补充：空集、度数算子 ——
  varnothing: "∅",
  deg: "deg",
  lvert: "|",
  rvert: "|",
  lVert: "‖",
  rVert: "‖",
  mid: "|",
  ast: "∗",
  circ: "∘",
  star: "⋆",
  bullet: "·",
  oplus: "⊕",
  odot: "⊙",
  leadsto: "⇝",
  rightsquigarrow: "⇝",
  otimes: "⊗",
  wedge: "∧",
  vee: "∨",
  neg: "¬",
  lnot: "¬",
  implies: "⟹",
  iff: "⟺",
  mapsto: "↦",
  // —— 大写箭头族。注意 \Rightarrow(⇒) 与 \implies(⟹) 是不同字形，不能合并。——
  Rightarrow: "⇒",
  Leftarrow: "⇐",
  Leftrightarrow: "⇔",
  Longrightarrow: "⟹",
  Longleftarrow: "⟸",
  Longleftrightarrow: "⟺",
  coloneqq: "≔",
  triangleq: "≜",
  propto: "∝",
  simeq: "≃",
  therefore: "∴",
  because: "∵",
  ll: "≪",
  gg: "≫",
  aleph: "ℵ",
  ell: "ℓ",
  hbar: "ℏ",
  Re: "ℜ",
  Im: "ℑ",
  min: "min",
  max: "max",
  arg: "arg",
  gcd: "gcd",
  det: "det",
  eta: "η",
  theta: "θ",
  rho: "ρ",
  cos: "cos",
  sin: "sin",
  tan: "tan",
  nmid: "∤",
  lcm: "lcm",
  lim: "lim",
  sup: "sup",
  inf: "inf",
    varphi: "φ",
  varepsilon: "ε",
  vartheta: "ϑ",
  varpi: "ϖ",
  varrho: "ϱ",
  varsigma: "ς",
};

/** 只影响排版、不产生字符的命令（\left( 、\displaystyle 之类） */
const DROP = new Set([
  "left", "right", "big", "Big", "bigg", "Bigg",
  "displaystyle", "textstyle", "limits", "nolimits", "quad", "qquad",
]);

function mathcalMap(text) {
  if (text === "O") return "𝒪";
  if (text === "o") return "ℴ";
  return text;
}

/** \mathbb{N} 之类的黑板粗体：数集 ℕ/ℤ/ℚ/ℝ/ℂ 在第 3 章的定义里大量出现 */
const MATHBB = { N: "ℕ", Z: "ℤ", Q: "ℚ", R: "ℝ", C: "ℂ", P: "ℙ", H: "ℍ", E: "𝔼" };

/** 重音符：\hat{x} → x̂、\tilde{x} → x̃、\bar{x} → x̄、\vec{x} → x⃗（组合字符追加） */
const ACCENTS = { hat: "\u0302", tilde: "\u0303", bar: "\u0304",
                  vec: "\u20D7", dot: "\u0307", ddot: "\u0308" };

/* ---------- 极简解析器 ---------- */
function parse(src) {
  const s = String(src == null ? "" : src);
  const n = s.length;
  let i = 0;
  const out = [];

  function readGroup() {
    // 当前 i 指向 token 首字符；返回 {text, ok}
    if (s[i] === "{") {
      let depth = 0;
      let j = i;
      while (j < n) {
        if (s[j] === "{") depth++;
        else if (s[j] === "}") {
          depth--;
          if (depth === 0) {
            const text = s.slice(i + 1, j);
            i = j + 1;
            return { text, ok: true };
          }
        }
        j++;
      }
      return null; // 未闭合
    }
    if (s[i] === "\\") {
      let j = i + 1;
      let name = "";
      while (j < n && /[a-zA-Z]/.test(s[j])) name += s[j++];
      const text = "\\" + name;
      i = j;
      return { text, ok: true };
    }
    if (i >= n) return null; // 没有可读的内容
    const text = s[i];
    i = i + 1;
    return { text, ok: true };
  }

  function scriptNode(tag, text) {
    const el = document.createElement(tag);
    parse(text).forEach((c) => el.appendChild(c));
    return el;
  }

  function fracNode(a, b) {
    const el = document.createElement("span");
    el.className = "frac";
    const num = document.createElement("span");
    num.className = "num";
    parse(a).forEach((c) => num.appendChild(c));
    const den = document.createElement("span");
    den.className = "den";
    parse(b).forEach((c) => den.appendChild(c));
    el.appendChild(num);
    el.appendChild(den);
    return el;
  }

  function sqrtNode(a) {
    const el = document.createElement("span");
    el.className = "sqrt";
    el.appendChild(document.createTextNode("√"));
    const arg = document.createElement("span");
    arg.className = "sqrt-arg";
    parse(a).forEach((c) => arg.appendChild(c));
    el.appendChild(arg);
    return el;
  }

  /** `\text{...}`（含 \textrm/\mathrm/\mathit）走文本模式：内容原样输出，不再当数学解析。
   *  否则 `\text{for }` 会变成 "\textfor " 这种碎片。 */
  function textNode(text) {
    const el = document.createElement("span");
    el.className = "tex-text";
    el.appendChild(document.createTextNode(text));
    return el;
  }

  /** `\binom{n}{k}` → 带大括号的两层堆叠（样式见 components.css 的 .binom）。
   *  本来可以复用 .frac，但分式画横线、组合数不画 —— 复用会画出错误记号。 */
  function binomNode(a, b) {
    const el = document.createElement("span");
    el.className = "binom";
    // ★ 一律用 createTextNode 而不是赋 textContent：测试跑在极简 DOM 垫片上，
    //   那里的 textContent 只有 getter（节点环境的差异不能带进实现）。
    const open = document.createElement("span");
    open.className = "binom__paren";
    open.appendChild(document.createTextNode("("));
    const stack = document.createElement("span");
    stack.className = "binom__stack";
    const num = document.createElement("span");
    num.className = "binom__top";
    parse(a || "").forEach((c) => num.appendChild(c));
    const den = document.createElement("span");
    den.className = "binom__bottom";
    parse(b || "").forEach((c) => den.appendChild(c));
    stack.appendChild(num);
    stack.appendChild(den);
    const close = document.createElement("span");
    close.className = "binom__paren";
    close.appendChild(document.createTextNode(")"));
    el.appendChild(open);
    el.appendChild(stack);
    el.appendChild(close);
    return el;
  }

  /** `\overline{A}` → 顶部加一横线。用 span + text-decoration 而不是组合字符：
   *  组合字符只会盖住参数的**最后一个**字符，`\overline{B_k}` 那样的写法会画错位置。 */
  function overlineNode(a) {
    const el = document.createElement("span");
    el.className = "overline";
    parse(a || "").forEach((c) => el.appendChild(c));
    return el;
  }

  /** 按顶层分隔符切分（跳过 {} 内部），供 cases 环境拆行/拆列。 */
  function splitTop(src, sep) {
    const parts = [];
    let depth = 0;
    let cur = "";
    for (let k = 0; k < src.length; k++) {
      const ch = src[k];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      if (ch === sep && depth === 0) {
        parts.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    parts.push(cur);
    return parts;
  }

  /** `\begin{cases} 值 & 条件 \\ 值 & 条件 \end{cases}` → 带左花括号的分段函数。
   *  行以 `\\` 分隔，列以 `&` 分隔（都是顶层才切）。 */
  function casesNode(body) {
    const el = document.createElement("span");
    el.className = "cases";
    const brace = document.createElement("span");
    brace.className = "cases__brace";
    brace.appendChild(document.createTextNode("{"));
    el.appendChild(brace);
    const rows = document.createElement("span");
    rows.className = "cases__rows";
    body.split("\\\\").forEach((rawRow) => {
      const rowSrc = rawRow.trim();
      if (!rowSrc) return;
      const r = document.createElement("span");
      r.className = "cases__row";
      splitTop(rowSrc, "&").forEach((cellSrc, ci) => {
        const cell = document.createElement("span");
        cell.className = ci === 0 ? "cases__val" : "cases__cond";
        parse(cellSrc.trim()).forEach((c2) => cell.appendChild(c2));
        r.appendChild(cell);
      });
      rows.appendChild(r);
    });
    el.appendChild(rows);
    return el;
  }

  /** `\underbrace{X}_{Y}` → X 下方带标注 Y。紧随的 `_{...}` 由本函数一并吃掉，
   *  否则它会变成一个游离的 <sub> 兄弟节点。 */
  function ubraceNode(body) {
    const el = document.createElement("span");
    el.className = "ubrace";
    const b = document.createElement("span");
    b.className = "ubrace__body";
    parse(body).forEach((c) => b.appendChild(c));
    el.appendChild(b);
    if (s[i] === "_") {
      i++;
      const lab = readGroup();
      if (lab) {
        const l = document.createElement("span");
        l.className = "ubrace__label";
        parse(lab.text).forEach((c) => l.appendChild(c));
        el.appendChild(l);
      } else {
        el.appendChild(document.createTextNode("_"));
      }
    }
    return el;
  }

  /** `\xrightarrow{...}` / `\xleftarrow{...}` → 带上方标注的箭头（用于"这一步做了什么"）。 */
  function xarrowNode(labelSrc, arrow) {
    const el = document.createElement("span");
    el.className = "xarrow";
    const lab = document.createElement("span");
    lab.className = "xarrow__label";
    parse(labelSrc).forEach((c) => lab.appendChild(c));
    const ar = document.createElement("span");
    ar.className = "xarrow__arrow";
    ar.appendChild(document.createTextNode(arrow));
    el.appendChild(lab);
    el.appendChild(ar);
    return el;
  }

  let buf = "";
  function flush() {
    if (buf) {
      out.push(document.createTextNode(buf));
      buf = "";
    }
  }

  while (i < n) {
    const c = s[i];
    if (c === "\\") {
      flush();
      let j = i + 1;
      let name = "";
      while (j < n && /[a-zA-Z]/.test(s[j])) name += s[j++];
      if (name === "") {
        // 转义字符：\, \; \: \! 与 "\ " 是间距命令，不产生字符
        const ch2 = s[j] || "";
        if (ch2 === " " || ",;:!".indexOf(ch2) >= 0) {
          i = j + 1;
          continue;
        }
        buf += ch2; // \{ \} \$ \% \# \& \_ 等转义字面量
        i = j + 1;
        continue;
      }
      i = j;
      if (DROP.has(name)) {
        continue; // 纯排版命令，只吃字符不产出
      }
      // \frac / \dfrac / \tfrac 都渲染成同一个 .frac 结构。
      // 真正的 KaTeX 会区分 display / text 字号，本实现不区分 —— 但至少不能
      // 像以前那样把 \dfrac 原样吐出来（页面上会出现 "\dfracn(n+1)2" 这种碎片）。
      if (name === "frac" || name === "dfrac" || name === "tfrac") {
        const a = readGroup();
        const b = readGroup();
        if (a && b) {
          out.push(fracNode(a.text, b.text));
          continue;
        }
        buf += "\\" + name;
        continue;
      }
      if (name === "sqrt") {
        const a = readGroup();
        if (a) {
          out.push(sqrtNode(a.text));
          continue;
        }
        buf += "\\sqrt";
        continue;
      }
      if (name === "mathcal") {
        const a = readGroup();
        if (a) {
          out.push(document.createTextNode(mathcalMap(a.text)));
          continue;
        }
        buf += "\\mathcal";
        continue;
      }
      // \mathbb{N} -> ℕ（数集；不认识的字母原样保留）
      if (name === "mathbb") {
        const a = readGroup();
        if (a) {
          out.push(document.createTextNode(MATHBB[a.text] || a.text));
          continue;
        }
        buf += "\\mathbb";
        continue;
      }
      // \hat{x} / \tilde{x} / \bar{x} / \vec{x} / \dot{x} / \ddot{x} -> 组合重音符
      if (name in ACCENTS) {
        const a = readGroup();
        if (a) {
          // 组合字符追加在基字符后；相邻文本节点在渲染上等价于同一文本
          parse(a.text).forEach((c) => out.push(c));
          out.push(textNode(ACCENTS[name]));
          continue;
        }
        buf += "\\" + name;
        continue;
      }
      // \binom{n}{k}：两个参数都要读；只给一个时按空分母渲染（不能让反斜杠漏到页面上）
      if (name === "binom") {
        const a = readGroup();
        if (a) {
          const b = readGroup();
          out.push(binomNode(a.text, b ? b.text : ""));
          continue;
        }
        buf += "\\binom";
        continue;
      }
      // \overline{X}：整段内容加顶线
      if (name === "overline") {
        const a = readGroup();
        if (a) {
          out.push(overlineNode(a.text));
          continue;
        }
        buf += "\\overline";
        continue;
      }
      // \text{...}：文本模式，内容原样输出
      if (name === "text" || name === "textrm" || name === "mathrm" || name === "mathit") {
        const a = readGroup();
        if (a) {
          out.push(textNode(a.text));
          continue;
        }
        buf += "\\" + name;
        continue;
      }
      // \operatorname{Foo}：正体算子名，内容原样输出（附录 D 的 \deg 等已单独给字形）
      if (name === "operatorname") {
        const a = readGroup();
        if (a) {
          out.push(textNode(a.text));
          continue;
        }
        buf += "\\operatorname";
        continue;
      }
      // \begin{cases} ... \end{cases}：环境体要一直读到配对的 \end{...}
      if (name === "begin") {
        const env = readGroup();
        const envName = env ? env.text.trim() : "";
        const closeTag = "\\end{" + envName + "}";
        const endPos = envName ? s.indexOf(closeTag, i) : -1;
        if (endPos >= 0) {
          const body = s.slice(i, endPos);
          i = endPos + closeTag.length;
          out.push(casesNode(body));
          continue;
        }
        buf += "\\begin";
        continue;
      }
      if (name === "end") {
        // 正常情况下上面已经把 \end{...} 一起消费了；这里兜底吃掉孤立的 \end{cases}
        if (readGroup()) continue;
        buf += "\\end";
        continue;
      }
      if (name === "underbrace" || name === "overbrace") {
        const a = readGroup();
        if (a) {
          out.push(ubraceNode(a.text));
          continue;
        }
        buf += "\\" + name;
        continue;
      }
      if (name === "xrightarrow" || name === "xleftarrow") {
        const a = readGroup();
        if (a) {
          out.push(xarrowNode(a.text, name === "xrightarrow" ? "→" : "←"));
          continue;
        }
        buf += "\\" + name;
        continue;
      }
      const sym = SYM[name];
      if (sym != null) {
        out.push(document.createTextNode(sym));
        continue;
      }
      buf += "\\" + name; // 未知命令原样保留
      continue;
    }
    if (c === "_" || c === "^") {
      flush();
      const tag = c === "_" ? "sub" : "sup";
      // ★ 必须先跳过 _ / ^ 本身再读组。
      //   否则 readGroup 会把 "_" 自己当成一组，生成 <sub>_</sub>，
      //   而 parse("_") 又会再生成 <sub>_</sub> …… 无限递归 → RangeError。
      i++;
      if (i >= n) {
        buf += c; // 末尾孤立的 _ / ^
        break;
      }
      const g = readGroup();
      if (g) {
        out.push(scriptNode(tag, g.text));
        continue;
      }
      buf += c;
      continue;
    }
    if (c === "{") {
      flush();
      const g = readGroup();
      if (g) {
        parse(g.text).forEach((c2) => out.push(c2));
        continue;
      }
      buf += c;
      i++;
      continue;
    }
    if (c === "}") {
      break; // 由外层平衡处理
    }
    buf += c;
    i++;
  }
  flush();
  return out;
}

/* ---------- 渲染入口 ---------- */
function externalInline(tex) {
  const span = document.createElement("span");
  span.className = "katex-inline";
  span.innerHTML = _katex.renderToString(tex, {
    displayMode: false,
    throwOnError: false,
  });
  return span;
}

function externalBlock(tex) {
  const div = document.createElement("div");
  div.className = "katex-block";
  div.innerHTML = _katex.renderToString(tex, {
    displayMode: true,
    throwOnError: false,
  });
  return div;
}

export function renderInline(tex) {
  if (_katex) return externalInline(tex);
  const span = document.createElement("span");
  span.className = "katex-inline";
  parse(tex).forEach((c) => span.appendChild(c));
  return span;
}

export function renderBlock(tex) {
  if (_katex) return externalBlock(tex);
  const div = document.createElement("div");
  div.className = "katex-block";
  parse(tex).forEach((c) => div.appendChild(c));
  return div;
}

export function render(tex, opts = {}) {
  return opts.display ? renderBlock(tex) : renderInline(tex);
}

export function renderMixed(text) {
  const frag = document.createDocumentFragment();
  const s = String(text == null ? "" : text);
  let i = 0;
  const n = s.length;
  let buf = "";
  function flush() {
    if (buf) {
      frag.appendChild(document.createTextNode(buf));
      buf = "";
    }
  }
  while (i < n) {
    // **粗体**：要求开标记紧跟非空白、闭标记紧跟非空白，
    // 这样 `a ** b`（乘法/幂）与落单的 `**` 都不会被误当强调。
    // 里面允许再嵌 $...$，所以递归调用自己。
    if (s[i] === "*" && s[i + 1] === "*") {
      const end = s.indexOf("**", i + 2);
      const inner = end === -1 ? "" : s.slice(i + 2, end);
      if (end !== -1 && inner && !/^\s/.test(inner) && !/\s$/.test(inner)) {
        flush();
        const strong = document.createElement("strong");
        strong.appendChild(renderMixed(inner));
        frag.appendChild(strong);
        i = end + 2;
        continue;
      }
    }
    if (s[i] === "$" && s[i + 1] === "$") {
      flush();
      let j = i + 2;
      let end = s.indexOf("$$", j);
      if (end === -1) end = n;
      frag.appendChild(renderBlock(s.slice(j, end)));
      i = end + 2;
      continue;
    }
    if (s[i] === "$") {
      flush();
      let j = i + 1;
      let end = s.indexOf("$", j);
      if (end === -1) end = n;
      frag.appendChild(renderInline(s.slice(j, end)));
      i = end + 1;
      continue;
    }
    buf += s[i];
    i++;
  }
  flush();
  return frag;
}

const api = {
  init,
  renderInline,
  renderBlock,
  render,
  renderMixed,
};

export default api;
