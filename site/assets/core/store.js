/* =============================================================================
 * core/store.js — 进度 / 错题 / 设置 持久化（运行时 Agent 拥有）
 * 持久化方式：localStorage（防抖合并写入）。带 schema 版本号与迁移占位。
 *
 * 公开 API：
 *   load() -> state
 *   getState() -> state
 *   save()                         （防抖，外部一般无需调用）
 *   flush()                        （立即落盘，页面卸载前用）
 *   getSettings() -> {theme, speed, autoplay, reduceMotion}
 *   updateSettings(patch) -> settings
 *   setThemePref('light'|'dark'|'auto')
 *   getThemePref()
 *   applyTheme()                   （把设置写到 <html data-theme>）
 *   markStage(ch, sec, stage, done=true)
 *   isStageDone(ch, sec, stage) -> bool
 *   getStageSet(ch, sec) -> Set<string>
 *   setQuiz(ch, sec, score0to1)
 *   getQuiz(ch, sec) -> number|null
 *   chapterDone(ch, sec) -> bool   （9 个阶段全完成）
 *   addWrong({ch, sec, q, detail?})
 *   clearWrong(id)
 *   getWrong() -> array
 *   subscribe(cb) -> () => void
 * ========================================================================== */

const STORE_KEY = "clrs:state";
export const STORE_SCHEMA = 1;

const SAVE_DEBOUNCE_MS = 200;

/* ---------- 复习台账的常量（在默认状态之前定义：recordReview 要用） ---------- */
/**
 * 复习记录的间隔阶梯（单位：毫秒）。
 * 取法是 Leitner 箱：答对一级上一档，答错直接打回第 1 档。
 * 为什么用固定阶梯而不是 SM-2 那种自适应算法：本站单用户、题量 1012，
 * 固定阶梯的「下次什么时候能见」是可预期的 —— 复习模式要的是让人看得懂，
 * 而不是把参数拟合到一个用户身上。
 */
export const REVIEW_INTERVALS = [
  5 * 60 * 1000,        // 档 1：5 分钟后
  30 * 60 * 1000,       // 档 2：半小时
  12 * 60 * 60 * 1000,  // 档 3：半天
  24 * 60 * 60 * 1000,  // 档 4：一天
  3 * 24 * 60 * 60 * 1000,  // 档 5：三天
  7 * 24 * 60 * 60 * 1000,  // 档 6：一周
  16 * 24 * 60 * 60 * 1000, // 档 7：两周
];

export const REVIEW_MAX_BOX = REVIEW_INTERVALS.length;

function defaultSettings() {
  return {
    theme: "auto", // 'auto' | 'light' | 'dark'
    speed: 650, // 步进速度（毫秒/帧）
    autoplay: false, // 进入可视化阶段是否自动播放
    reduceMotion: "auto", // 'auto' | 'on' | 'off'
  };
}

function defaultState() {
  return {
    v: STORE_SCHEMA,
    progress: {}, // { "ch02/s01": { stages: {map:true,...}, quiz: 0.8 } }
    wrong: [], // [{ id, ch, sec, q, detail, at }]
    // 复习台账：题 id -> 记忆状态。
    // ★ 与错题本的分工：错题本只留「还没啃下来」的题（答对即销案），
    //   而遗忘曲线需要**每一道做过的题**都留一条记录 —— 否则答对过的题
    //   第二天该复习时，数据层根本不知道它存在过。所以两个结构各管一摊。
    review: {}, // { "ch02/s01/q1": { box, due, seen, right, wrong, at } }
    // 章末挑战的自我核对：章 -> [题号]。
    // ★ 原书章末 Problems 是开放长题（含 a/b/c 小问），本站**不给答案也不判分**，
    //   所以这里存的是读者自己的「做完了」勾选 —— 是自评，不是系统判定的成绩。
    //   页面上必须如实说成「自评完成」，不能包装成通过率。
    problems: {}, // { "2": ["2-1", "2-3"] }
    settings: defaultSettings(),
  };
}

/* ---------- 迁移占位 ---------- */
/* 将来变更 schema 时，在此追加迁移函数即可（输入旧 state，返回新 state）。 */
const MIGRATIONS = [
  // 例：
  // (s) => { s.newField = s.newField ?? 0; return s; },
];

function migrate(state) {
  let s = state;
  while (s.v < STORE_SCHEMA) {
    const fn = MIGRATIONS[s.v - 1];
    if (typeof fn === "function") s = fn(s);
    else s.v = STORE_SCHEMA; // 无对应迁移则直接升版本
  }
  return s;
}

/* ---------- 读写 ---------- */
let _state = null;
let _saveTimer = null;
const _subs = new Set();

function read() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultState();
    // 合并缺省，保证新版字段存在
    const base = defaultState();
    base.progress = parsed.progress || {};
    base.wrong = Array.isArray(parsed.wrong) ? parsed.wrong : [];
    // 老存档没有 review 字段（schema 1），这里补上空对象 —— 等价于「一道题都还没复习过」，
    // 不需要写迁移函数：缺省即空，语义上就是全新状态。
    base.review = (parsed.review && typeof parsed.review === "object") ? parsed.review : {};
    base.problems = (parsed.problems && typeof parsed.problems === "object") ? parsed.problems : {};
    base.settings = Object.assign(defaultSettings(), parsed.settings || {});
    base.v = parsed.v || 0;
    return migrate(base);
  } catch (e) {
    console.warn("[store] 读取失败，使用默认状态：", e);
    return defaultState();
  }
}

function writeNow() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.warn("[store] 写入失败：", e);
  }
  _subs.forEach((cb) => {
    try {
      cb(_state);
    } catch (_) {}
  });
}

export function load() {
  if (!_state) _state = read();
  return _state;
}

export function getState() {
  return load();
}

export function save() {
  if (!_state) return;
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    _saveTimer = null;
    writeNow();
  }, SAVE_DEBOUNCE_MS);
}

export function flush() {
  if (_saveTimer) {
    clearTimeout(_saveTimer);
    _saveTimer = null;
  }
  if (_state) writeNow();
}

export function subscribe(cb) {
  _subs.add(cb);
  return () => _subs.delete(cb);
}

/* ---------- 设置 / 主题 ---------- */
export function getSettings() {
  return load().settings;
}

export function updateSettings(patch) {
  const s = load();
  s.settings = Object.assign({}, s.settings, patch || {});
  if ("theme" in patch) applyTheme();
  save();
  return s.settings;
}

export function getThemePref() {
  return getSettings().theme;
}

export function setThemePref(theme) {
  return updateSettings({ theme });
}

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function applyTheme() {
  if (typeof document === "undefined") return;
  const t = getSettings().theme;
  const root = document.documentElement;
  if (t === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", t);
}

/* ---------- 进度 ---------- */
function chapterKey(ch, sec) {
  return `${ch}/${sec}`;
}

function ensureChapter(ch, sec) {
  const s = load();
  const k = chapterKey(ch, sec);
  if (!s.progress[k]) s.progress[k] = { stages: {}, quiz: null };
  if (!s.progress[k].stages) s.progress[k].stages = {};
  return s.progress[k];
}

export function markStage(ch, sec, stage, done = true) {
  const c = ensureChapter(ch, sec);
  if (done) c.stages[stage] = true;
  else delete c.stages[stage];
  save();
}

export function isStageDone(ch, sec, stage) {
  const s = load();
  const c = s.progress[chapterKey(ch, sec)];
  return !!(c && c.stages && c.stages[stage]);
}

export function getStageSet(ch, sec) {
  const s = load();
  const c = s.progress[chapterKey(ch, sec)];
  return new Set(c && c.stages ? Object.keys(c.stages) : []);
}

export function setQuiz(ch, sec, score) {
  const c = ensureChapter(ch, sec);
  c.quiz = score;
  save();
}

export function getQuiz(ch, sec) {
  const s = load();
  const c = s.progress[chapterKey(ch, sec)];
  return c ? c.quiz : null;
}

const NINE_STAGES = [
  "map",
  "intuition",
  "source",
  "pseudocode",
  "visualize",
  "code",
  "analyze",
  "prove",
  "drill",
];

export function chapterDone(ch, sec) {
  const set = getStageSet(ch, sec);
  return NINE_STAGES.every((s) => set.has(s));
}

/* ---------- 错题本 ---------- */
/**
 * 记一条错题。
 * ★ id 由调用方给（`ch/sec/qN`），同一题重复答错只累加次数、刷新内容，不堆叠条目 ——
 *   否则一道题错三次就是三条记录，错题本会越用越乱（重做判对时也才有确定的 id 可清）。
 */
export function addWrong(item) {
  const s = load();
  const entry = Object.assign({ at: Date.now(), times: 0 }, item || {});
  const id = entry.id || `w${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const hit = s.wrong.find((w) => w.id === id);
  if (hit) {
    Object.assign(hit, entry, { id, times: (hit.times || 1) + 1 });
    save();
    return hit;
  }
  entry.id = id;
  entry.times = 1;
  s.wrong.push(entry);
  save();
  return entry;
}

export function clearWrong(id) {
  const s = load();
  s.wrong = s.wrong.filter((w) => w.id !== id);
  save();
}

export function getWrong() {
  return load().wrong.slice();
}

/* ---------- 复习台账（遗忘曲线） ----------
 * 为什么与错题本分开存：错题本答对即销案，只剩「还没啃下来」的题；
 * 而复习要覆盖**每一道做过的题** —— 昨天答对的题今天照样该复习一次。
 * 两者语义不同，合并会让错题本失去「待办清单」的含义。
 */

/** 取一道题的复习状态；没做过返回 null。 */
export function getReview(id) {
  const s = load();
  return s.review[id] || null;
}

/** 全部复习状态（浅拷贝，调用方随便改）。 */
export function getReviewAll() {
  return Object.assign({}, load().review);
}

/**
 * 记一次作答，推进记忆档位。
 * 答对：档位 +1（上限 REVIEW_MAX_BOX）；答错：直接打回第 1 档。
 * due 由档位对应的间隔算出 —— 刚答完的题不会立刻再问一遍。
 * @param {string} id  题 id（`ch/sec/qN`）
 * @param {boolean} ok 是否答对
 * @param {number} [now] 注入当前时间，便于确定性测试
 */
export function recordReview(id, ok, now) {
  const s = load();
  const t = Number.isFinite(now) ? now : Date.now();
  const prev = s.review[id] || { box: 0, seen: 0, right: 0, wrong: 0 };
  // 首次作答时 prev.box = 0：答对进入第 1 档，答错也停在「第 1 档」
  // （答错的题必须尽快再见一次，所以不能比答对更晚）。
  const box = ok ? Math.min(prev.box + 1, REVIEW_MAX_BOX) : 1;
  const entry = {
    box,
    due: t + REVIEW_INTERVALS[box - 1],
    seen: (prev.seen || 0) + 1,
    right: (prev.right || 0) + (ok ? 1 : 0),
    wrong: (prev.wrong || 0) + (ok ? 0 : 1),
    at: t,
  };
  s.review[id] = entry;
  save();
  return entry;
}

/** 清掉一道题的复习状态（本机记录，不可恢复）。 */
export function clearReview(id) {
  const s = load();
  if (Object.prototype.hasOwnProperty.call(s.review, id)) {
    delete s.review[id];
    save();
  }
}

/**
 * 一次作答的统一记账：推进复习台账 + 同步错题本。
 * ★ 闯关测验与复习模式都必须走这里。两处各写一份的结果必然是「一边销案、
 *   一边还留着」这类不一致 —— 判分后的记账口径只能有一份实现。
 * @param {{ch, sec, n, item, ok, picked}} rec
 *   n 是题序（1 基），item 是关卡数据里的那道题
 */
export function recordAnswer(rec) {
  const ch = rec.ch;
  const sec = rec.sec;
  const id = `${ch}/${sec}/q${rec.n}`;
  recordReview(id, rec.ok);

  if (rec.ok) {
    // 重做答对就该销案，不然错题本只会单向膨胀。
    clearWrong(id);
    return null;
  }

  const it = rec.item || {};
  // 选项里作者标记 **…** 是人看的，存进错题本前剥掉（错题本要显示干净文本）。
  const options = it.kind === 'single'
    ? (it.options || []).map((o) => (typeof o === 'string' ? o.split('**').join('') : o))
    : null;
  return addWrong({
    id,
    ch,
    sec,
    kind: it.kind,
    q: it.q,
    options,
    answer: it.kind === 'single' || it.kind === 'judge' ? it.answer : null,
    expect: it.kind === 'simulate' ? it.expect : null,
    why: it.why || null,
    picked: rec.picked == null ? null : String(rec.picked),
  });
}

/* ---------- 章末挑战：自评勾选 ---------- */

/** 章的题号集合（数组，按登记顺序）。 */
export function getProblemSet(ch) {
  const s = load();
  const v = s.problems[String(ch)];
  return Array.isArray(v) ? v.slice() : [];
}

/** 某道章末题是否被勾为「已完成」。 */
export function isProblemDone(ch, id) {
  return getProblemSet(ch).indexOf(String(id)) >= 0;
}

/** 勾选 / 取消勾选一道章末题。返回勾选后的集合。 */
export function markProblem(ch, id, done = true) {
  const s = load();
  const key = String(ch);
  const cur = new Set(Array.isArray(s.problems[key]) ? s.problems[key] : []);
  if (done) cur.add(String(id));
  else cur.delete(String(id));
  s.problems[key] = [...cur];
  save();
  return s.problems[key];
}

/**
 * 到期待复习的题 id 列表，按到期时间升序（最该复习的排最前）。
 * @param {number} [now] 注入当前时间，便于确定性测试
 */
export function dueReviews(now) {
  const s = load();
  const t = Number.isFinite(now) ? now : Date.now();
  return Object.keys(s.review)
    .filter((id) => {
      const e = s.review[id];
      return e && Number.isFinite(e.due) && e.due <= t;
    })
    .sort((a, b) => s.review[a].due - s.review[b].due);
}

/* ---------- 备份：导出 / 导入 / 清空 ----------
 * 为什么需要它：学习进度、错题本、复习台账、章末自评全在 localStorage，
 *   清一次浏览器缓存或换一台设备就全没了，而这些东西是几百小时的学习记录。
 *   这里只做「导出成 JSON / 从 JSON 读回来」，不联网、不引依赖（离线设计）。
 *
 * 合入口径（宁可保守也不丢数据）：
 *   进度 progress  —— 阶段取并集（两处都做过就是做过）；测验得分取较高的一次。
 *   错题 wrong     —— 同 id 合并，次数相加、内容取时间较晚的那条。
 *   复习 review    —— 同 id 取「最近一次作答」的那条记录（at 大的胜出）。
 *   自评 problems  —— 取并集。
 *   设置 settings  —— **默认保留本机设置**（主题等是本机偏好，不该被备份覆盖）；
 *                     只有整份替换（mode:'replace'）或显式 overwriteSettings 才采用备份里的。
 * 不做「按时间戳二选一」的整体覆盖：一份旧备份不该把你新做的关退回去。
 */

/** 备份文件的格式标识：导入时先认它，避免把随便一个 JSON 灌进存档。 */
export const BACKUP_FORMAT = "clrs-quest-state";
export const BACKUP_VERSION = 1;

/** 导出的纯数据对象（不含函数），可直接 JSON.stringify。 */
export function exportState(now) {
  const s = load();
  const t = Number.isFinite(now) ? now : Date.now();
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date(t).toISOString(),
    state: {
      v: s.v,
      progress: s.progress,
      wrong: s.wrong,
      review: s.review,
      problems: s.problems,
      settings: s.settings,
    },
  };
}

/** 导出的 JSON 文本（缩进 2 格，方便人肉看一眼再存）。 */
export function exportJSON(now) {
  return JSON.stringify(exportState(now), null, 2);
}

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/**
 * 校验一份备份数据，返回 { ok, errors[], state }。
 * 只做结构校验（类型对不对、像不像本站的存档），不校验内容真实性。
 */
export function validateBackup(input) {
  const errors = [];
  let data = input;
  if (typeof input === "string") {
    try {
      data = JSON.parse(input);
    } catch (e) {
      return { ok: false, errors: ["不是合法的 JSON：" + e.message], state: null };
    }
  }
  if (!isPlainObject(data)) return { ok: false, errors: ["备份内容不是一个对象"], state: null };

  if (data.format != null && data.format !== BACKUP_FORMAT) {
    errors.push("format 字段是 " + JSON.stringify(data.format) + "，不是本站备份（应为 " + BACKUP_FORMAT + "）");
  }
  // 认三种形态：带 format 的完整备份、只有 state 的、以及直接把 state 摊平在顶层的老写法。
  const st = isPlainObject(data.state) ? data.state : data;
  if (!isPlainObject(st)) return { ok: false, errors: ["备份里找不到 state 对象"], state: null };
  if (data.format == null && st.progress == null && st.wrong == null && st.review == null) {
    errors.push("既没有 format 标识，也没有 progress / wrong / review 字段 —— 不像本站的存档");
  }
  if (st.progress != null && !isPlainObject(st.progress)) errors.push("progress 应是对象");
  if (st.wrong != null && !Array.isArray(st.wrong)) errors.push("wrong 应是数组");
  if (st.review != null && !isPlainObject(st.review)) errors.push("review 应是对象");
  if (st.problems != null && !isPlainObject(st.problems)) errors.push("problems 应是对象");
  if (st.settings != null && !isPlainObject(st.settings)) errors.push("settings 应是对象");

  if (errors.length) return { ok: false, errors, state: null };
  return { ok: true, errors: [], state: st };
}

/** 阶段集合取并集；quiz 取较高分（null 视作没有）。 */
function mergeProgress(cur, inc) {
  const out = Object.assign({}, cur || {});
  for (const [k, v] of Object.entries(inc || {})) {
    if (!isPlainObject(v)) continue;
    const prev = isPlainObject(out[k]) ? out[k] : { stages: {}, quiz: null };
    const stages = Object.assign({}, prev.stages || {});
    for (const [name, done] of Object.entries(isPlainObject(v.stages) ? v.stages : {})) {
      if (done) stages[name] = true;
    }
    const a = Number.isFinite(prev.quiz) ? prev.quiz : null;
    const b = Number.isFinite(v.quiz) ? v.quiz : null;
    const quiz = a == null ? b : (b == null ? a : Math.max(a, b));
    out[k] = { stages, quiz };
  }
  return out;
}

/** 错题按 id 合并：次数相加，其余字段取时间较晚的那条。 */
function mergeWrong(cur, inc) {
  const out = (cur || []).map((w) => Object.assign({}, w));
  for (const w of inc || []) {
    if (!isPlainObject(w)) continue;
    const id = w.id || null;
    const hit = id ? out.find((x) => x.id === id) : null;
    if (!hit) { out.push(Object.assign({}, w)); continue; }
    const newer = (Number.isFinite(w.at) ? w.at : 0) >= (Number.isFinite(hit.at) ? hit.at : 0) ? w : hit;
    Object.assign(hit, newer, {
      id,
      times: (Number.isFinite(hit.times) ? hit.times : 1) + (Number.isFinite(w.times) ? w.times : 1),
    });
  }
  return out;
}

/** 复习台账按 id 合并：取 at 较晚（最近作答）的那条。 */
function mergeReview(cur, inc) {
  const out = Object.assign({}, cur || {});
  for (const [id, v] of Object.entries(inc || {})) {
    if (!isPlainObject(v)) continue;
    const prev = out[id];
    const newer = !prev || (Number.isFinite(v.at) ? v.at : 0) >= (Number.isFinite(prev.at) ? prev.at : 0) ? v : prev;
    out[id] = Object.assign({}, newer);
  }
  return out;
}

/** 章末自评按章取并集。 */
function mergeProblems(cur, inc) {
  const out = Object.assign({}, cur || {});
  for (const [ch, ids] of Object.entries(inc || {})) {
    const set = new Set(Array.isArray(out[ch]) ? out[ch] : []);
    if (Array.isArray(ids)) ids.forEach((x) => set.add(String(x)));
    out[ch] = [...set];
  }
  return out;
}

/**
 * 导入一份备份。
 * @param {string|object} input 备份 JSON 文本或对象
 * @param {{mode?: 'merge'|'replace', overwriteSettings?: boolean, now?: number}} [opts]
 *   mode 默认 'merge'（与现有存档合并）；'replace' 直接整份替换学习数据。
 * @returns {{ok: boolean, errors: string[], summary?: object}}
 */
export function importState(input, opts = {}) {
  const v = validateBackup(input);
  if (!v.ok) return { ok: false, errors: v.errors };
  const inc = v.state;
  const s = load();
  const mode = opts.mode === "replace" ? "replace" : "merge";

  if (mode === "replace") {
    s.progress = isPlainObject(inc.progress) ? inc.progress : {};
    s.wrong = Array.isArray(inc.wrong) ? inc.wrong : [];
    s.review = isPlainObject(inc.review) ? inc.review : {};
    s.problems = isPlainObject(inc.problems) ? inc.problems : {};
    if (opts.overwriteSettings && isPlainObject(inc.settings)) {
      s.settings = Object.assign(defaultSettings(), inc.settings);
      applyTheme();
    }
  } else {
    s.progress = mergeProgress(s.progress, inc.progress);
    s.wrong = mergeWrong(s.wrong, inc.wrong);
    s.review = mergeReview(s.review, inc.review);
    s.problems = mergeProblems(s.problems, inc.problems);
    if (opts.overwriteSettings && isPlainObject(inc.settings)) {
      s.settings = Object.assign({}, s.settings, inc.settings);
      applyTheme();
    }
  }

  // 导入必须立刻落盘：导入完立刻关页面（或刷新）不该把刚导进来的数据丢了。
  flush();
  return {
    ok: true,
    errors: [],
    summary: {
      mode,
      levels: Object.keys(s.progress).length,
      wrong: s.wrong.length,
      review: Object.keys(s.review).length,
      problems: Object.values(s.problems).reduce((a, x) => a + (Array.isArray(x) ? x.length : 0), 0),
    },
  };
}

/**
 * 清空学习数据（本机记录，不可恢复）。默认**保留设置**（主题等是本机偏好）。
 * @param {{settings?: boolean}} [opts] settings:true 连主题偏好一起复位
 */
export function clearAll(opts = {}) {
  const s = load();
  s.progress = {};
  s.wrong = [];
  s.review = {};
  s.problems = {};
  if (opts.settings) {
    s.settings = defaultSettings();
    applyTheme();
  }
  flush();
  return true;
}

export default {
  STORE_SCHEMA,
  BACKUP_FORMAT,
  BACKUP_VERSION,
  exportState,
  exportJSON,
  validateBackup,
  importState,
  clearAll,
  load,
  getState,
  save,
  flush,
  subscribe,
  getSettings,
  updateSettings,
  getThemePref,
  setThemePref,
  applyTheme,
  markStage,
  isStageDone,
  getStageSet,
  setQuiz,
  getQuiz,
  chapterDone,
  addWrong,
  clearWrong,
  getWrong,
  getReview,
  getReviewAll,
  recordReview,
  clearReview,
  dueReviews,
  recordAnswer,
  getProblemSet,
  isProblemDone,
  markProblem,
  REVIEW_INTERVALS,
  REVIEW_MAX_BOX,
};
