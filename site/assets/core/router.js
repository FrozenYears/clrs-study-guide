/* =============================================================================
 * core/router.js — 三级 hash 路由（运行时 Agent 拥有）
 *
 * 路由格式（契约：docs/开发规范.md 5.2 / 建设计划 5.2）：
 *   首页        #/                      或空
 *   章内某一阶段 #/ch02/s01/s04         章(ch02) / 关卡(s01) / 阶段(s04)
 *   附录某一关  #/appendix/a/s01        字母(a) / 关卡(s01)
 *
 * 公开 API：
 *   parse(hash?) -> route
 *   buildUrl(ch, section?, stage?) -> string
 *   navigate(hash)                （设置 location.hash）
 *   onChange(cb) -> () => void    （注册；注册时立即回调当前路由）
 *   current() -> route            （最近一次解析结果）
 *   start()                       （显式开始监听；重复调用安全）
 *   view404(msg?) -> HTMLElement  （未知路由视图）
 * ========================================================================== */

const APPENDIX_LETTERS = ["a", "b", "c", "d"];

function pad2(n) {
  const s = String(n);
  return s.length >= 2 ? s : "0" + s;
}

function normSeg(seg) {
  // 数字 -> 's01'；已是 's01' 形式原样；null/undefined -> null
  if (seg == null) return null;
  if (typeof seg === "number") return "s" + pad2(seg);
  const s = String(seg);
  return /^\d+$/.test(s) ? "s" + pad2(s) : s;
}

export function parse(hash) {
  const raw = hash == null ? (typeof location !== "undefined" ? location.hash : "") : hash;
  const clean = raw.replace(/^#/, "");
  const segments = clean.split("/").filter((s) => s.length > 0);

  const base = {
    kind: "home",
    raw: "#" + clean,
    segments,
    ch: null,
    chNum: null,
    section: null,
    stage: null,
    isAppendix: false,
  };

  if (segments.length === 0) return base;

  // 错题本：不是「章」也不是「附录」，单独一档（#/wrong）
  if (segments[0] === "wrong") {
    return Object.assign(base, { kind: "wrong" });
  }

  // 术语表：同上，全站聚合页（#/glossary）
  if (segments[0] === "glossary") {
    return Object.assign(base, { kind: "glossary" });
  }

  // 复杂度对照表：全站聚合页（#/complexity）
  if (segments[0] === "complexity") {
    return Object.assign(base, { kind: "complexity" });
  }

  // 复习模式：按遗忘曲线推题（#/review）
  if (segments[0] === "review") {
    return Object.assign(base, { kind: "review" });
  }

  // 学习数据备份：导出 / 导入 / 清空（#/data）
  if (segments[0] === "data") {
    return Object.assign(base, { kind: "data" });
  }

  // 算法选择器：按部分横向对照（#/algorithms）
  if (segments[0] === "algorithms") {
    return Object.assign(base, { kind: "algorithms" });
  }

  // 伪代码速查：全站聚合页（#/pseudocode）
  if (segments[0] === "pseudocode") {
    return Object.assign(base, { kind: "pseudocode" });
  }

  if (segments[0] === "appendix") {
    const letter = (segments[1] || "").toLowerCase();
    if (!APPENDIX_LETTERS.includes(letter) || segments.length < 2) {
      return Object.assign(base, { kind: "404" });
    }
    return Object.assign(base, {
      kind: "appendix",
      isAppendix: true,
      ch: letter,
      section: normSeg(segments[2]),
      stage: normSeg(segments[3]),
    });
  }

  if (segments[0].startsWith("ch")) {
    const chNum = parseInt(segments[0].slice(2), 10);
    if (!Number.isFinite(chNum) || segments.length < 1) {
      return Object.assign(base, { kind: "404" });
    }
    return Object.assign(base, {
      kind: "chapter",
      ch: segments[0].slice(2),
      chNum,
      section: normSeg(segments[1]),
      stage: normSeg(segments[2]),
    });
  }

  return Object.assign(base, { kind: "404" });
}

export function buildUrl(ch, section, stage) {
  const isAppendix = typeof ch === "string" && APPENDIX_LETTERS.includes(ch.toLowerCase());
  const head = isAppendix ? `appendix/${ch.toLowerCase()}` : `ch${pad2(ch)}`;
  const sec = normSeg(section);
  const stg = normSeg(stage);
  let url = "#/" + head;
  if (sec) url += "/" + sec;
  if (stg) url += "/" + stg;
  return url;
}

export function navigate(hash) {
  const target = hash.startsWith("#") ? hash : "#" + hash;
  if (typeof location !== "undefined" && location.hash !== target) {
    location.hash = target;
  }
}

let _listeners = [];
let _started = false;
let _current = null;

function emit() {
  _current = parse();
  _listeners.forEach((cb) => {
    try {
      cb(_current);
    } catch (e) {
      console.error("[router] onChange 回调出错：", e);
    }
  });
}

export function onChange(cb) {
  _listeners.push(cb);
  // 注册时立即回调当前路由，便于首屏渲染
  if (_current) {
    try {
      cb(_current);
    } catch (e) {
      console.error("[router] onChange 初始回调出错：", e);
    }
  }
  return () => {
    _listeners = _listeners.filter((f) => f !== cb);
  };
}

export function current() {
  return _current || parse();
}

export function start() {
  if (_started) return;
  _started = true;
  if (typeof window !== "undefined") {
    window.addEventListener("hashchange", emit);
  }
  emit();
}

export function view404(msg) {
  const wrap = document.createElement("section");
  wrap.className = "view-empty";
  const h1 = document.createElement("h1");
  h1.className = "card__title";
  h1.textContent = "页面走丢了（404）";
  const p = document.createElement("p");
  p.textContent =
    msg || "这条路由没有对应的内容。返回学习地图，或检查章节编号是否正确。";
  const a = document.createElement("a");
  a.className = "btn btn--primary";
  a.href = "#/";
  a.textContent = "回到学习地图";
  wrap.appendChild(h1);
  wrap.appendChild(p);
  wrap.appendChild(a);
  return wrap;
}

export default {
  parse,
  buildUrl,
  navigate,
  onChange,
  current,
  start,
  view404,
};
