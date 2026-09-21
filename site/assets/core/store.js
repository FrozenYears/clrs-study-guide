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

export default {
  STORE_SCHEMA,
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
};
