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
 *   renderMixed(text) -> Node   （扫描文本中的 $...$ / $$...$$，返回混排片段）
 *
 * 支持记号：Θ Ο Ω Σ Π αβγδε θλμπρσ τφω ≤ ≥ ≠ ≈ ≡ ∼ ∞ ∂ ∇ ⌊⌋ ⌈⌉ ∈ ∉ ⊆ ⊂ ⊇
 *          ∪ ∩ ∅ ∀ ∃ → ← ↔ × · ÷ ± ∓ ∑ ∏ ∫ √ log lg ln mod ⋯ … ∠ ⊥ ∥ 等
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
  to: "→",
  rightarrow: "→",
  leftarrow: "←",
  leftrightarrow: "↔",
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
  otimes: "⊗",
  wedge: "∧",
  vee: "∨",
  neg: "¬",
  lnot: "¬",
  implies: "⟹",
  iff: "⟺",
  mapsto: "↦",
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
  lcm: "lcm",
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
      if (name === "frac") {
        const a = readGroup();
        const b = readGroup();
        if (a && b) {
          out.push(fracNode(a.text, b.text));
          continue;
        }
        buf += "\\frac";
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
