/* =============================================================================
 * ui/wrong-view.js — 错题本（#/wrong）
 *
 * 数据来自 core/store.js 的 wrong 数组：闯关测验判分处（ui/stages.js setResult）
 * 答错就登记、重做答对就销案。本页只读 store，写操作只有「移除一条 / 清空」。
 *
 * 为什么按「章 + 关」分组，而不是按时间倒序：错题本是用来回炉的，回炉的单位是
 * 那一关的测验，所以每组直接给「重做这一关」的链接；按时间排会把同一关的题打散。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as store from '../core/store.js';
import * as router from '../core/router.js';
import { getChapter } from '../chapters.js';

const KIND_LABEL = { judge: '判断题', single: '单选题', simulate: '手动模拟' };

/** 数字章排前、附录排后；给分组定死一个顺序，不依赖录入先后。 */
function groupKey(entry) {
  const c = String(entry.ch);
  return /^\d+$/.test(c) ? 'n' + c.padStart(2, '0') : 'z' + c.toUpperCase();
}

/** 从 `ch02/s01/q3` 这种 id 里取题号，用于组内稳定排序。 */
function qNo(id) {
  const m = /q(\d+)$/.exec(String(id));
  return m ? Number(m[1]) : 0;
}

/** 「第 2 章 · Getting Started（起步） · 2.1 插入排序」 */
function levelLabel(entry) {
  const mod = getChapter(entry.ch);
  const lv = mod && (mod.levels || []).find((l) => l.key === entry.sec);
  const chName = mod
    ? (mod.chSpan || '第 ' + mod.ch + ' 章')
    : (/^\d+$/.test(String(entry.ch)) ? '第 ' + entry.ch + ' 章' : '附录 ' + String(entry.ch).toUpperCase());
  // ★ shortTitle 本身已带节号（'2.1 插入排序'），不能再拼一次 lv.section ——
  //   否则组标题会写成「2.1 2.1 插入排序」。title 则不带节号，需要补。
  return chName + ' · ' + (lv ? lv.shortTitle || (lv.section + ' ' + lv.title) : entry.sec);
}

/** 正确答案的文字形式：三种题型的 `answer` 形状不同，在这里归一。 */
function answerText(entry) {
  if (entry.kind === 'judge') {
    if (entry.answer === true) return '对';
    if (entry.answer === false) return '错';
    return '—';
  }
  if (entry.kind === 'single') {
    const opts = entry.options || [];
    const a = opts[entry.answer];
    if (a == null) return '—';
    return String(a).replace(/\*\*/g, '');
  }
  if (entry.kind === 'simulate') return (entry.expect || []).join(' ');
  return '—';
}

function pickedText(entry) {
  const p = entry.picked;
  if (p == null || p === '') return '（未作答）';
  return String(p).replace(/\*\*/g, '');
}

/**
 * 渲染错题本。
 * @param {{onMutate?: Function}} opts 移除/清空之后调它，让外壳重新渲染本页
 * @returns {{node: Node, destroy: Function}}
 */
export function renderWrong(opts = {}) {
  const onMutate = typeof opts.onMutate === 'function' ? opts.onMutate : () => {};
  const entries = store.getWrong();

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 错题本'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, '✗'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '错题本'),
        h('p', { class: 'lv-subtitle' }, 'Wrong answers, revisited')
      )
    )
  );

  const body = h('div', { class: 'stack' });

  /* ---------------- 空状态 ---------------- */
  if (!entries.length) {
    body.appendChild(h('div', { class: 'callout callout--ok' },
      h('strong', null, '错题本是空的。'),
      h('span', null, ' 闯关测验里答错的题会自动记到这里，不用手动抄题；下次答对同一道题，这一条会自己销案。')
    ));
    body.appendChild(h('p', { class: 'card__meta' },
      '去学习地图挑一关，把「阶段 9 · 闯关测验」做完，再回来看这里。'));
    body.appendChild(h('div', { class: 'row' },
      h('a', { class: 'btn btn--primary', href: '#/' }, '← 回到学习地图')));
    return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
  }

  /* ---------------- 引言 + 清空 ---------------- */
  const stat = h('p', { class: 'wb-lede' },
    '共 ', h('b', null, String(entries.length)), ' 道题等着回炉。'
    + ' 答对同一道题会自动销案 —— 这里只留没啃下来的。');

  const clearAll = h('button', {
    class: 'btn btn--sm', type: 'button',
    onClick: () => {
      if (!window.confirm('清空错题本？本机记录会一并删掉，无法恢复。')) return;
      store.getWrong().forEach((w) => store.clearWrong(w.id));
      onMutate();
    },
  }, '清空错题本');

  body.appendChild(h('div', { class: 'row' }, stat, h('span', { class: 'spacer', style: { flex: '1 1 auto' } }), clearAll));

  /* ---------------- 按「章 + 关」分组 ---------------- */
  const sorted = entries.slice().sort((a, b) => {
    const ga = groupKey(a), gb = groupKey(b);
    if (ga !== gb) return ga < gb ? -1 : 1;
    if (String(a.sec) !== String(b.sec)) return String(a.sec) < String(b.sec) ? -1 : 1;
    return qNo(a.id) - qNo(b.id) || String(a.id).localeCompare(String(b.id));
  });

  const groups = [];
  for (const w of sorted) {
    const key = groupKey(w) + '/' + w.sec;
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, sample: w, items: [] }; groups.push(g); }
    g.items.push(w);
  }

  for (const g of groups) {
    const drillUrl = router.buildUrl(g.sample.ch, g.sample.sec, 9);
    body.appendChild(h('section', { class: 'wb-group' },
      h('div', { class: 'wb-group__head' },
        h('h2', { class: 'wb-group__title' }, levelLabel(g.sample)),
        h('span', { class: 'wb-group__count' }, g.items.length + ' 道'),
        h('span', { class: 'spacer' }),
        h('a', { class: 'btn btn--sm', href: drillUrl }, '重做这一关的测验 →')
      ),
      ...g.items.map((w) => h('div', { class: 'wb-item' },
        h('div', { class: 'wb-item__head' },
          h('span', { class: 'wb-item__kind' }, KIND_LABEL[w.kind] || w.kind || '题目'),
          h('span', { class: 'wb-item__id' }, '第 ' + qNo(w.id) + ' 题'),
          w.times > 1 ? h('span', { class: 'badge' }, '错过 ' + w.times + ' 次') : null,
          h('span', { class: 'spacer' }),
          h('button', {
            class: 'btn btn--sm', type: 'button',
            'aria-label': '从错题本移除这一条',
            onClick: () => { store.clearWrong(w.id); onMutate(); },
          }, '移除')
        ),
        h('p', { class: 'wb-item__q' }, katex.renderMixed(w.q || '（题干缺失）')),
        h('div', { class: 'wb-item__ans' },
          h('span', null, h('b', null, '你的答案：'),
            h('span', { class: 'wb-ans--bad' }, pickedText(w))),
          h('span', null, h('b', null, '正确答案：'),
            h('span', { class: 'wb-ans--ok' }, katex.renderMixed(answerText(w))))
        ),
        w.why ? h('p', { class: 'wb-item__why' }, katex.renderMixed(w.why)) : null
      ))
    ));
  }

  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderWrong;
