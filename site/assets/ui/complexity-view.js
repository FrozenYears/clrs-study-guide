/* =============================================================================
 * ui/complexity-view.js — 复杂度对照表（#/complexity）
 *
 * 数据来源：各关「复杂度」段（analyze）的 claims。566 条结论覆盖全部 152 关，
 * 每条都带 when（什么时候成立）与 page（原书印刷页），另 30 条标注 source='instructor'
 * （本站推导补充，不是书上原话）—— 这一栏必须标出来，否则混进原书结论里就是红线 R2。
 *
 * ★ 与术语表的根本区别：术语同一词在多关重复出现，合并成一条才看得出关系；
 *   而结论的 when 几乎条条不同（566 条里只有 1 对 when 完全重复），
 *   把它们按公式合并会把「Θ(n) 的 19 种不同语境」压成一行，等于毁掉这张表。
 *   所以这里按章分组、逐条列出，靠搜索而不是合并来横向查找。
 *
 * 与「复杂度」阶段（阶段 7）的区别：那一段是单关内的结论一览，
 * 本页是全书的横向对照 —— 想查「哪几处是 O(1)」时不必翻 152 关。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as router from '../core/router.js';
import { formatPage, pageRef } from '../core/page.js';
import { loadChapters, listChapterKeys, chapterLabel } from '../chapters.js';

/** 结论出在「复杂度」段的阶段号（1 基）。 */
const ANALYZE_STAGE = 7;

/** 章的排序键：正文按章号，附录排在其后（与目录、错题本一致）。 */
function chapterOrder(ch) {
  const s = String(ch);
  return /^\d+$/.test(s) ? 'n' + s.padStart(2, '0') : 'z' + s.toUpperCase();
}

/**
 * 收集全站结论。每条保留出处（章 / 关 / 页码 / 是否本站补充）。
 */
export async function collectClaims() {
  const out = [];
  // 本页是全书聚合：只有打开它才会把 39 章一起拉下来（loadChapters 并发 + 按章去重）。
  const mods = await loadChapters(listChapterKeys());
  for (const key of listChapterKeys()) {
    const mod = mods.get(key);
    if (!mod || !Array.isArray(mod.levels)) continue;
    for (const lv of mod.levels) {
      for (const st of lv.stages || []) {
        if (st.type !== 'analyze' || !Array.isArray(st.claims)) continue;
        for (const c of st.claims) {
          if (!c || c.expr == null) continue;
          out.push({
            ch: mod.ch,
            chLabel: chapterLabel(mod.ch),
            sec: lv.key,
            section: lv.section,
            title: lv.shortTitle || lv.title || lv.key,
            expr: String(c.expr),
            when: c.when ? String(c.when) : '',
            page: c.page,
            preview: !!c.preview,
            source: c.source || null,
          });
        }
      }
    }
  }
  return out;
}

/** 按章分组，章内按节号顺序；组顺序按 chapterOrder。 */
export function groupClaims(claims) {
  const groups = [];
  for (const c of claims) {
    const key = String(c.ch);
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, chLabel: c.chLabel, items: [] }; groups.push(g); }
    g.items.push(c);
  }
  groups.sort((a, b) => {
    const ka = chapterOrder(a.key), kb = chapterOrder(b.key);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  // 组内保持关卡注册顺序（即书里的顺序），不另排序 —— 原书顺序本身就是依据。
  return groups;
}

function claimRow(c) {
  return h('tr', { class: 'cx-row' },
    h('th', { scope: 'row', class: 'cx-expr' },
      katex.renderMixed('$' + c.expr + '$'),
      c.source === 'instructor'
        ? h('span', { class: 'drill-badge', title: '这条是本站推导补充，不是原书结论' }, ' 本站补充')
        : null
    ),
    h('td', { class: 'cx-when' },
      katex.renderMixed(c.when || '—'),
      h('span', { class: 'cx-src' },
        h('a', {
          class: 'cx-link',
          href: router.buildUrl(c.ch, c.sec, ANALYZE_STAGE),
          title: '去这一关的「复杂度」段看完整推导',
        }, c.section + ' ' + (c.title || '')),
        pageRef(c.page, c.preview)
      )
    )
  );
}

function tableOf(items) {
  return h('table', { class: 'kv cx-table' },
    h('thead', null,
      h('tr', null,
        h('th', { scope: 'col' }, '结论'),
        h('th', { scope: 'col' }, '什么时候成立 · 出处')
      )
    ),
    h('tbody', null, ...items.map(claimRow))
  );
}

/**
 * 渲染复杂度对照表。
 * @returns {{node: Node, destroy: Function}}
 */
export async function renderComplexity() {
  const all = await collectClaims();
  const allGroups = groupClaims(all);
  const instructorCount = all.filter((c) => c.source === 'instructor').length;

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 复杂度对照表'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, 'Θ'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '复杂度对照表'),
        h('p', { class: 'lv-subtitle' }, 'Running times · 全书结论横向对照')
      )
    )
  );

  const countEl = h('span', { class: 'gloss-count' });
  const search = h('input', {
    class: 'drill-input gloss-search',
    type: 'search',
    'aria-label': '搜索结论（公式、语境或节号）',
    placeholder: '搜索：heapsort / Θ(n lg n) / O(1) / 排序',
    autocomplete: 'off',
  });
  const listWrap = h('div', { class: 'stack' });

  function renderList() {
    const q = search.value.trim().toLowerCase();
    const groups = q
      ? groupClaims(all.filter((c) =>
          c.expr.toLowerCase().includes(q) ||
          c.when.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.section.toLowerCase().includes(q) ||
          c.chLabel.toLowerCase().includes(q)))
      : allGroups;

    const shown = groups.reduce((a, g) => a + g.items.length, 0);
    countEl.textContent = q
      ? '匹配 ' + shown + ' 条 / 共 ' + all.length + ' 条'
      : '共 ' + all.length + ' 条结论 · 覆盖 ' + allGroups.length + ' 章 · 其中 ' +
        instructorCount + ' 条标明为本站补充推导';

    if (!shown) {
      listWrap.replaceChildren(h('div', { class: 'callout callout--warn' },
        h('strong', null, '没有匹配的结论。'),
        h('span', null, ' 可以搜公式（Θ(n lg n) 或 O(1)）、语境关键词，或节号（7.2）。')));
      return;
    }

    listWrap.replaceChildren(...groups.map((g) =>
      h('section', { class: 'cx-group' },
        h('h2', { class: 'cx-chapter' },
          h('a', { class: 'cx-chapter__link', href: router.buildUrl(g.key, 's01', 1) }, g.chLabel),
          h('span', { class: 'cx-chapter__count' }, g.items.length + ' 条')
        ),
        tableOf(g.items)
      )));
  }

  search.addEventListener('input', renderList);
  renderList();

  const body = h('div', { class: 'stack' },
    h('div', { class: 'gloss-toolbar' }, search, countEl),
    h('p', { class: 'card__meta' },
      '原书结论与「本站补充推导」分开标注：前者逐字取自对应印刷页，后者是本站在例题上补算的，'
      + '不冒充书上原话。点节号可跳到那一关的「复杂度」段看完整推导。'),
    listWrap
  );

  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderComplexity;
