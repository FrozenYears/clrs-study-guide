/* =============================================================================
 * core/highlight.js — 代码框语法高亮（零依赖、离线、只认 C / JS / 伪代码三类）
 *
 * 为什么自己写而不用现成库：本站红线是不引 npm 依赖、不引网络资源，
 * 而代码框只有三类语言、只需要四类着色。整个文件就是一个分词器 + 一个产节点函数。
 *
 * 公开 API：
 *   highlight(code, lang?) -> Node[]   （lang: 'c' | 'js' | 'pseudo'，默认 'c'）
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

/* 伪代码不是可编译语言：原书那十行八行里混着整句英文（"find an edge (u,v) that
 * is safe for A"、"5. For each node, all simple paths …"）。所以关键字表分成两档，
 * 依据是全站 1193 行唯一伪代码逐行统计出来的事实：
 *   PSEUDO_LINE —— for / if / let 这类同时也是高频英文词，只有「行首第一个词」
 *                  才敢认定是关键字。散文句子开头的 For / If 首字母大写，本表全小写，
 *                  天然错开（实测 1193 行里没有一行用小写的行首伪代码关键字写散文）。
 *   PSEUDO_ANY  —— else / return / downto / NIL 这些英文散文里不会误撞，任意位置都认。
 * 刻意排除 to / in / and / or / not：它们在伪代码里是记号、在散文里是介词连词，
 * 纯词法分不开（"copy the remainder of the other to the end" 的 to 就是散文）。
 * 少着色可以，着色错不行。 */
const PSEUDO_LINE = new Set([
  "for", "if", "let", "do", "output", "allocate", "initialize",
]);
const PSEUDO_ANY = new Set([
  "while", "else", "elseif", "return", "repeat", "until", "downto",
  "mod", "print", "error", "exchange", "NIL", "TRUE", "FALSE",
]);
// `then` 两处都不放：全站 1193 行伪代码里它出现 4 次，3 次在注释里（整行已被判成
// 注释），剩下一次是散文句 "If a node is red, then both its children are black."。
// 换句话说这个关键字在本站伪代码里一次也没有真正当过记号，着色只会着色错。

/* 每种语言一处配置，避免在分词循环里散落 lang 判断。
 *   hyphen    ：连字号算不算词干的一部分（伪代码有 MAX-HEAPIFY / heap-size，C 没有）
 *   block     ：认不认成对的斜杠星号块注释（伪代码一行都没有，认了反而易把算式看歪）
 *   pre       ：认不认行首 # 预处理行（只有 C 用）
 *   squote    ：单引号算不算字符串起始（伪代码里单引号是撇号，不是引号）
 *   loose     ：斜杠 + 空白 + 斜杠 也算注释起始。原书伪代码的注释记号在抽取语料里
 *               一律写成 "/ /"（见 data/pages_fixed.jsonl 第 18 页 INSERTION-SORT 第 3 行），
 *               关卡照抄了语料，所以分词器也得认；整行注释，不会吞掉后面的代码。
 *   callGlue  ：函数名与左括号之间允不允许留空格（伪代码里 "edge (u,v)" 是散文）
 *   numLoose  ：数字吃到 0x / 指数 / u L f 后缀为止（C/JS 用），还是只认整数与小数
 *               （伪代码用）。伪代码里 "1..m"、"1. 取随机大素数" 后面那个点是句号或
 *               区间点，跟着着色就成了 "1." 这个数字，很难看。
 *   line / any：伪代码关键字的两档位置要求，见上方 PSEUDO_LINE 的说明
 */
const LANGS = {
  c: { kw: KEYWORDS.c, hyphen: false, block: true, pre: true, squote: true, loose: false, callGlue: true, numLoose: true, line: null, any: null },
  js: { kw: KEYWORDS.js, hyphen: false, block: true, pre: false, squote: true, loose: false, callGlue: true, numLoose: true, line: null, any: null },
  pseudo: { kw: null, hyphen: true, block: false, pre: false, squote: false, loose: true, callGlue: false, numLoose: false, line: PSEUDO_LINE, any: PSEUDO_ANY },
};

const TYPES = { c: "tok-kw", js: "tok-kw", pseudo: "tok-kw" };

/* 一次扫描：按出现顺序产出 {cls, text}，cls 为 null 表示普通文本 */
function tokenize(src, lang) {
  const cfg = LANGS[lang] || LANGS.c;
  const kw = cfg.kw || new Set();
  const idChar = /[A-Za-z0-9_]/;
  const out = [];
  let buf = "";
  const push = (cls, text) => {
    if (!text) return;
    if (cls === null) { buf += text; return; }
    if (buf) { out.push({ cls: null, text: buf }); buf = ""; }
    out.push({ cls, text });
  };
  // 这个词是不是「本行第一个实词」：往前跳过空白，撞到行首/文件首才算
  const atLineStart = (i) => {
    let k = i - 1;
    while (k >= 0 && (src[k] === " " || src[k] === "\t")) k--;
    return k < 0 || src[k] === "\n";
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
    // 抽取语料里的伪代码注释记号是 "/ /"：斜杠、空白、斜杠，一直注释到行尾。
    // 除号后面直接跟另一个除号在算法里不成立，所以这条不会把算式看错。
    if (cfg.loose && ch === "/") {
      let k = i + 1;
      while (k < n && (src[k] === " " || src[k] === "\t")) k++;
      if (src[k] === "/") {
        let j = src.indexOf("\n", i);
        if (j === -1) j = n;
        push("tok-comment", src.slice(i, j));
        i = j;
        continue;
      }
    }
    if (cfg.block && ch === "/" && nx === "*") {
      let j = src.indexOf("*/", i + 2);
      j = j === -1 ? n : j + 2;
      push("tok-comment", src.slice(i, j));
      i = j;
      continue;
    }
    // C 的预处理行：整行（含续行）算一类
    if (cfg.pre && ch === "#" && (i === 0 || src[i - 1] === "\n")) {
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
    if (ch === '"' || (cfg.squote && ch === "'")) {
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
      if (cfg.numLoose && ch === "0" && /[xX]/.test(nx || "")) {
        j += 2;
        while (j < n && /[0-9a-fA-F]/.test(src[j])) j++;
      } else if (!cfg.numLoose) {
        // 伪代码：只认「一串数字」或「数字.数字」。1..m 与 "1. 先取两个大素数"
        // 后面那个点既不是小数点也不是数字，留在普通文本里。
        while (j < n && /[0-9]/.test(src[j])) j++;
        if (src[j] === "." && /[0-9]/.test(src[j + 1] || "")) {
          j++;
          while (j < n && /[0-9]/.test(src[j])) j++;
        }
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
      while (j < n && idChar.test(src[j])) j++;
      // 伪代码里连字符可以作词干的一部分（MAX-HEAPIFY / heap-size），但右侧必须以
      // 字母开头，否则 n-1、i-1 这类减法会被错粘成一个词。
      if (cfg.hyphen) {
        let k = j;
        while (k + 1 < n && src[k] === "-" && /[A-Za-z_]/.test(src[k + 1])) {
          k++;
          while (k < n && idChar.test(src[k])) k++;
        }
        if (k > j) j = k;
      }
      const word = src.slice(i, j);
      let k = j;
      if (cfg.callGlue) {
        while (k < n && (src[k] === " " || src[k] === "\t")) k++;
      }
      const isCall = src[k] === "(";
      let cls = null;
      if (cfg.any && cfg.any.has(word)) cls = TYPES[lang];
      else if (cfg.line && cfg.line.has(word) && atLineStart(i)) cls = TYPES[lang];
      else if (kw.has(word)) cls = TYPES[lang];
      else if (isCall) cls = "tok-fn";
      push(cls, word);
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
  return Object.prototype.hasOwnProperty.call(LANGS, lang);
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
