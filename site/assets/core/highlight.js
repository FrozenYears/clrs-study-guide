/* =============================================================================
 * core/highlight.js — 代码框语法高亮（零依赖、离线、只认 C 与 JS 两类）
 *
 * 为什么自己写而不用现成库：本站红线是不引 npm 依赖、不引网络资源，
 * 而代码框只有两种语言、只需要四类着色。整个文件就是一个分词器 + 一个产节点函数。
 *
 * 公开 API：
 *   highlight(code, lang?) -> Node[]   （lang: 'c' | 'js'，默认 'c'；返回可直接塞进 h() 的节点数组）
 *   supports(lang) -> boolean
 *
 * 设计约束（重要）：
 *   - **只做词法切分，绝不理解语法**。识别不出来的就按普通文本输出，
 *     宁可少着色也不能把代码着色错。
 *   - 输出的文本内容与输入**逐字符相同**（只是拆成若干 span），
 *     这样闸门与测试仍然可以按原文比对，复制粘贴也不会带上标记。
 *   - 注释、字符串、字符常量整段成一个 token，
 *     所以里面的 /* 或 " 不会互相打断。
 * ========================================================================== */

const KEYWORDS = {
  c: new Set([
    "auto", "break", "case", "char", "const", "continue", "default", "do",
    "double", "else", "enum", "extern", "float", "for", "goto", "if", "int",
    "long", "register", "return", "short", "signed", "sizeof", "static",
    "struct", "switch", "typedef", "union", "unsigned", "void", "volatile",
    "while",
  ]),
  js: new Set([
    "async", "await", "break", "case", "catch", "class", "const", "continue",
    "debugger", "default", "delete", "do", "else", "export", "extends",
    "finally", "for", "function", "if", "import", "in", "instanceof", "let",
    "new", "of", "return", "static", "switch", "this", "throw", "try",
    "typeof", "var", "void", "while", "yield", "true", "false", "null",
    "undefined",
  ]),
};

const TYPES = { c: "tok-kw", js: "tok-kw" };

/* 一次扫描：按出现顺序产出 {cls, text}，cls 为 null 表示普通文本 */
function tokenize(src, lang) {
  const kw = KEYWORDS[lang] || KEYWORDS.c;
  const out = [];
  let buf = "";
  const push = (cls, text) => {
    if (!text) return;
    if (cls === null) { buf += text; return; }
    if (buf) { out.push({ cls: null, text: buf }); buf = ""; }
    out.push({ cls, text });
  };

  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    const nx = src[i + 1];

    // 行注释 // 与块注释 /* … */
    if (ch === "/" && nx === "/") {
      let j = src.indexOf("\n", i);
      if (j === -1) j = n;
      push("tok-comment", src.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "/" && nx === "*") {
      let j = src.indexOf("*/", i + 2);
      j = j === -1 ? n : j + 2;
      push("tok-comment", src.slice(i, j));
      i = j;
      continue;
    }
    // C 的预处理行：整行（含续行）算一类
    if (ch === "#" && (i === 0 || src[i - 1] === "\n")) {
      let j = i;
      while (j < n) {
        const eol = src.indexOf("\n", j);
        if (eol === -1) { j = n; break; }
        if (src[eol - 1] === "\\") { j = eol + 1; continue; }
        j = eol;
        break;
      }
      push("tok-pre", src.slice(i, j));
      i = j;
      continue;
    }
    // 字符串与字符常量（处理反斜杠转义，引号不会被误截断）
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === ch) { j++; break; }
        if (src[j] === "\n") break;      // 未闭合就停住，不吞掉后面整段
        j++;
      }
      push("tok-str", src.slice(i, j));
      i = j;
      continue;
    }
    // 数字（含小数、指数、0x 十六进制与常见后缀）
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(nx || ""))) {
      let j = i;
      if (ch === "0" && /[xX]/.test(nx || "")) {
        j += 2;
        while (j < n && /[0-9a-fA-F]/.test(src[j])) j++;
      } else {
        while (j < n && /[0-9.eE]/.test(src[j])) {
          if ((src[j] === "e" || src[j] === "E") && /[+-]/.test(src[j + 1] || "")) j++;
          j++;
        }
        while (j < n && /[uUlLfF]/.test(src[j])) j++;
      }
      push("tok-num", src.slice(i, j));
      i = j;
      continue;
    }
    // 标识符：关键词 / 类型名之外的普通词按调用位置再分一次
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < n && (src[k] === " " || src[k] === "\t")) k++;
      const isCall = src[k] === "(";
      push(kw.has(word) ? TYPES[lang] : (isCall ? "tok-fn" : null), word);
      i = j;
      continue;
    }
    push(null, ch);
    i++;
  }
  if (buf) out.push({ cls: null, text: buf });
  return out;
}

export function supports(lang) {
  return Object.prototype.hasOwnProperty.call(KEYWORDS, lang);
}

/** 返回节点数组：普通文本是 Text 节点，着色片段是带 class 的 span。 */
export function highlight(code, lang) {
  const src = String(code == null ? "" : code);
  const nodes = [];
  tokenize(src, lang && supports(lang) ? lang : "c").forEach((t) => {
    nodes.push(t.cls
      ? Object.assign(document.createElement("span"), { className: t.cls, textContent: t.text })
      : document.createTextNode(t.text));
  });
  return nodes;
}

export default { highlight, supports };
