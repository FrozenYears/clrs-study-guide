/* =============================================================================
 * core/review-queue.js — 复习模式的排队逻辑（纯函数，可单测）
 *
 * 为什么把排队单独拎出来：复习模式的效果全在「先问哪一题」上，而这段逻辑
 * 一旦塞进 DOM 渲染里就没法测。这里只做三件事，全部无副作用：
 *   ① 题 id（`ch02/s01/q3`）与关卡数据的互查；
 *   ② 把到期的题排成一次复习会话；
 *   ③ 会话统计（这次要问几题、其中几道是难档题）。
 *
 * 排序规则（两条，顺序不可换）：
 *   1) 逾期越久越先问 —— 已经欠得最多的先还；
 *   2) 同逾期时长时，记忆档位越低（越不牢）越先问。
 * ========================================================================== */

import { getChapter } from '../chapters.js';

/** 复习题 id 的形态：`<ch>/<sec>/q<N>`，N 从 1 开始（与闯关测验的题序一致）。 */
export function makeId(ch, sec, n) {
  return `${ch}/${sec}/q${n}`;
}

/** 解析题 id；形态不对返回 null（而不是抛错 —— 存档可能被手改过）。 */
export function parseId(id) {
  const m = /^([^/]+)\/([^/]+)\/q(\d+)$/.exec(String(id || ''));
  if (!m) return null;
  const n = Number(m[3]);
  if (!Number.isFinite(n) || n < 1) return null;
  return { ch: m[1], sec: m[2], n };
}

/**
 * 按 id 找到那道题在关卡数据里的位置。
 * @returns {{ch, sec, section, levelLabel, stageNo, index, item}|null}
 *   stageNo 是 1 基的阶段号（复习页用它给「回原关看讲解」的链接）；
 *   index 是题在 drill 段 items 里的 0 基下标。
 */
export function resolveQuestion(id) {
  const p = parseId(id);
  if (!p) return null;
  // 题 id 里的章号有两种历史写法：存档里是章节模块自己的值（'2'、'A'），
  // 而路由/手写链接里是 URL 形式（'ch02'）。getChapter('ch02') 会因 parseInt 得 NaN
  // 而落空，所以先去掉 'ch' 前缀 —— 否则一条能点开的链接会静默查不到题。
  const chKey = p.ch.replace(/^ch/i, '');
  const mod = getChapter(chKey);
  if (!mod || !Array.isArray(mod.levels)) return null;
  const lv = mod.levels.find((l) => l.key === p.sec);
  if (!lv || !Array.isArray(lv.stages)) return null;

  // drill 段在第几段：按关卡自己的 stages 顺序数（缺段时 1 基号会变，所以必须实算）。
  let stageNo = 0;
  for (let i = 0; i < lv.stages.length; i++) {
    if (lv.stages[i].type === 'drill') { stageNo = i + 1; break; }
  }
  const drill = stageNo ? lv.stages[stageNo - 1] : null;
  const items = (drill && drill.items) || [];
  if (p.n > items.length) return null;

  // levelLabel 是**显示用**的整串（'2.1 插入排序'）：shortTitle 里已经带了节号，
  // 调用方直接显示即可，绝不能再拼一次 section —— 错题本与复习页先后都栽在这上面。
  return {
    ch: p.ch,
    sec: p.sec,
    section: lv.section,
    levelLabel: lv.shortTitle || (lv.section + ' ' + (lv.title || lv.key)),
    stageNo,
    index: p.n - 1,
    item: items[p.n - 1],
  };
}

/**
 * 把「到期记录」排成一次会话。
 * @param {Array<{id, at, due, box, seen, right, wrong}>} records 到期记录
 * @param {number} now 当前时间（注入，便于确定性测试）
 * @param {number} [limit] 一次会话最多几题（不传表示不限）
 * @returns {Array<{id, box, due, overdue, q}>} q 是 resolveQuestion 的结果
 */
export function buildQueue(records, now, limit) {
  const rows = [];
  for (const r of records || []) {
    if (!r || !r.id) continue;
    const q = resolveQuestion(r.id);
    // 关卡被删或题号越界的记录直接跳过：与其在页面上报错，不如安静地不复习它。
    if (!q) continue;
    rows.push({
      id: r.id,
      box: Number.isFinite(r.box) ? r.box : 1,
      due: Number.isFinite(r.due) ? r.due : now,
      overdue: Math.max(0, now - (Number.isFinite(r.due) ? r.due : now)),
      q,
    });
  }
  rows.sort((a, b) => (b.overdue - a.overdue) || (a.box - b.box));
  return Number.isFinite(limit) && limit > 0 ? rows.slice(0, limit) : rows;
}

/** 会话统计：要问几题、其中低档题（记忆最不牢，档 1–2）几道。 */
export function sessionStats(queue) {
  const list = queue || [];
  return {
    total: list.length,
    weak: list.filter((r) => r.box <= 2).length,
    boxes: list.reduce((acc, r) => {
      const k = String(r.box);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {}),
  };
}

export default { makeId, parseId, resolveQuestion, buildQueue, sessionStats };
