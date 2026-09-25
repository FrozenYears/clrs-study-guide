/* =============================================================================
 * ui/data-view.js — 学习数据备份（#/data）
 *
 * 为什么需要这一页：进度、错题本、复习台账、章末自评全在 localStorage，
 *   清一次浏览器缓存或换一台设备就全没了 —— 而那些是几百小时的记录。
 *   这里只做三件事：导出成 JSON 文件、从 JSON 读回来、以及显式清空。
 *
 * 三条产品决定：
 *   ① 导出的是一份**人可读**的 JSON（缩进 2 格）——用户要能自己看一眼，
 *      甚至手工改一道题的复习档位。不是二进制、不是压缩包。
 *   ② 导入默认「合并」，不是覆盖。一份旧备份不该把新做的关退回去；
 *      想整份替换要自己切到「替换」。
 *   ③ 全在本机完成：导出用 Blob、导入用 FileReader，没有任何网络请求，
 *      也不引第三方库 —— 与全站离线设计一致。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as store from '../core/store.js';

/** 文件名里的日期戳：clrs-progress-2026-09-25.json */
function stamp(now) {
  const d = new Date(Number.isFinite(now) ? now : Date.now());
  const p = (n) => (n < 10 ? '0' + n : String(n));
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

/** 当前存档的一句话读数。 */
function currentStats() {
  const s = store.getState();
  const levels = Object.keys(s.progress || {}).length;
  const doneStages = Object.values(s.progress || {}).reduce(
    (a, c) => a + Object.keys((c && c.stages) || {}).length, 0);
  const problems = Object.values(s.problems || {}).reduce(
    (a, x) => a + (Array.isArray(x) ? x.length : 0), 0);
  return {
    levels,
    doneStages,
    wrong: (s.wrong || []).length,
    review: Object.keys(s.review || {}).length,
    problems,
  };
}

/**
 * 渲染学习数据备份页。
 * @param {{onRefresh?: Function}} opts 导入/清空之后调它刷新顶栏读数（不重建本页）
 * @returns {{node: Node, destroy: Function}}
 */
export function renderData(opts = {}) {

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 学习数据'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, '⇄'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '学习数据'),
        h('p', { class: 'lv-subtitle' }, 'Export / Import · 备份与迁移')
      )
    )
  );

  const body = h('div', { class: 'stack' });
  const status = h('p', { class: 'card__meta' }, '尚未操作。');

  function show(text, kind) {
    status.textContent = text;
    status.className = kind === 'bad' ? 'callout callout--warn'
      : (kind === 'ok' ? 'callout callout--ok' : 'card__meta');
  }

  /* ---------------- 当前存档读数 ----------------
   * ★ 导入 / 清空之后**只刷新这一行与顶栏读数，不重建整页**：
   *   重建会把刚给出的「导入完成」提示一起抹掉，用户看到的是一次静默刷新。 */
  const statLine = h('p', { class: 'card__meta' });
  function refreshStats() {
    const s = currentStats();
    statLine.replaceChildren(
      '本机现有：已开始的关卡 ', h('b', null, String(s.levels)),
      ' · 已完成阶段 ', h('b', null, String(s.doneStages)),
      ' · 错题 ', h('b', null, String(s.wrong)),
      ' · 复习记录 ', h('b', null, String(s.review)),
      ' · 章末自评 ', h('b', null, String(s.problems)), ' 项。',
      '全部只存在这台浏览器里，换设备或清缓存都会丢 —— 需要时导出一份。');
  }
  refreshStats();
  body.appendChild(statLine);

  /* ---------------- ① 导出 ---------------- */
  const exportBtn = h('button', { class: 'btn btn--primary', type: 'button' }, '导出备份文件');
  exportBtn.addEventListener('click', () => {
    const text = store.exportJSON();
    const name = 'clrs-progress-' + stamp() + '.json';
    try {
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = h('a', { href: url, download: name });
      document.body.appendChild(a);
      a.click();
      a.remove();
      // 立刻 revoke 在部分浏览器上会打断下载，延后一点。
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      show('已导出 ' + name + '（' + text.length + ' 字符）。', 'ok');
    } catch (e) {
      show('导出失败：' + (e && e.message ? e.message : String(e)), 'bad');
    }
  });

  const copyBtn = h('button', { class: 'btn btn--sm', type: 'button' }, '复制到剪贴板');
  copyBtn.addEventListener('click', async () => {
    const text = store.exportJSON();
    try {
      await navigator.clipboard.writeText(text);
      show('已复制到剪贴板（' + text.length + ' 字符）。', 'ok');
    } catch (e) {
      // 剪贴板 API 需要安全上下文，也可能被用户拒绝：退回「放在框里让你自己复制」。
      const ta = h('textarea', { class: 'drill-input', rows: 8, readOnly: true }, text);
      body.appendChild(ta);
      ta.focus();
      ta.select();
      show('浏览器不允许自动写剪贴板，已把内容放在下面，请手动复制。', 'bad');
    }
  });

  body.appendChild(h('section', { class: 'card' },
    h('h2', null, '① 导出'),
    h('p', { class: 'card__meta' },
      '导出一份 JSON 文件，含进度、测验成绩、错题本、复习台账、章末自评与主题偏好。'
      + '文件留在你本机，站里没有任何上传。'),
    h('div', { class: 'row' }, exportBtn, copyBtn)));

  /* ---------------- ② 导入 ---------------- */
  let pending = null;   // 校验通过的备份 state
  let pendingName = '';
  let mode = 'merge';

  const fileInput = h('input', { type: 'file', accept: '.json,application/json' });
  const preview = h('div');

  const modeMerge = h('input', { type: 'radio', name: 'import-mode', value: 'merge', checked: true });
  const modeReplace = h('input', { type: 'radio', name: 'import-mode', value: 'replace' });
  modeMerge.addEventListener('change', () => { mode = 'merge'; });
  modeReplace.addEventListener('change', () => { mode = 'replace'; });

  fileInput.addEventListener('change', () => {
    const f = fileInput.files && fileInput.files[0];
    pending = null;
    preview.replaceChildren();
    if (!f) return;
    pendingName = f.name;
    const reader = new FileReader();
    reader.onload = () => {
      const v = store.validateBackup(String(reader.result));
      if (!v.ok) { show('这份文件不能导入：' + v.errors.join('；'), 'bad'); return; }
      pending = v.state;
      const s = pending;
      preview.replaceChildren(h('p', { class: 'card__meta' },
        '已选中「' + pendingName + '」：进度 ', h('b', null, String(Object.keys(s.progress || {}).length)),
        ' 关 · 错题 ', h('b', null, String((s.wrong || []).length)),
        ' 条 · 复习记录 ', h('b', null, String(Object.keys(s.review || {}).length)), ' 条。'));
      show('文件校验通过，可以导入。', 'ok');
    };
    reader.onerror = () => show('读文件失败。', 'bad');
    reader.readAsText(f);
  });

  const importBtn = h('button', { class: 'btn btn--primary', type: 'button' }, '导入');
  importBtn.addEventListener('click', () => {
    if (!pending) { show('先选择一个备份文件。', 'bad'); return; }
    const res = store.importState(pending, { mode });
    if (!res.ok) { show('导入失败：' + res.errors.join('；'), 'bad'); return; }
    const sm = res.summary;
    show('导入完成（' + (mode === 'merge' ? '合并' : '替换') + '）：进度 '
      + sm.levels + ' 关 · 错题 ' + sm.wrong + ' 条 · 复习记录 ' + sm.review + ' 条。', 'ok');
    pending = null;
    fileInput.value = '';
    preview.replaceChildren();
    refreshStats();
    // 顶栏的进度 / 错题 / 复习读数也要跟着变，但**不重建本页**（见上面注释）。
    if (typeof opts.onRefresh === 'function') opts.onRefresh();
  });

  body.appendChild(h('section', { class: 'card' },
    h('h2', null, '② 导入'),
    h('p', { class: 'card__meta' },
      '选择一份之前导出的 JSON。导入前会先校验格式，格式不对会明确告诉你哪里不对。'),
    h('div', { class: 'row' }, fileInput),
    h('div', { class: 'row' },
      h('label', null, modeMerge, ' 合并到当前进度（推荐：不会丢现有记录）'),
      h('label', null, modeReplace, ' 替换当前进度（用备份覆盖本机）')),
    h('p', { class: 'card__meta' },
      '合并口径：阶段取并集、测验得分取较高的一次；错题次数相加；'
      + '复习记录取最近作答的那一条；章末自评取并集。设置（主题等）默认保留本机的。'),
    h('div', { class: 'row' }, importBtn),
    preview));

  /* ---------------- ③ 清空 ---------------- */
  const confirmBox = h('input', { type: 'checkbox' });
  const clearBtn = h('button', { class: 'btn btn--sm', type: 'button', disabled: true }, '清空学习数据');
  confirmBox.addEventListener('change', () => { clearBtn.disabled = !confirmBox.checked; });
  clearBtn.addEventListener('click', () => {
    store.clearAll({ settings: false });
    show('已清空进度、错题本、复习台账与章末自评（主题偏好保留）。', 'ok');
    confirmBox.checked = false;
    clearBtn.disabled = true;
    refreshStats();
    if (typeof opts.onRefresh === 'function') opts.onRefresh();
  });

  body.appendChild(h('section', { class: 'card' },
    h('h2', null, '③ 清空'),
    h('p', { class: 'card__meta' },
      '清空后无法恢复，除非你手里有导出的备份。主题偏好会保留。'),
    h('label', null, confirmBox, ' 我明白这会删掉全部本机学习记录'),
    h('div', { class: 'row' }, clearBtn)));

  body.appendChild(status);

  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderData;
