/* =============================================================================
 * ui/pseudocode-view.js — 伪代码速查（#/pseudocode）
 *
 * 数据来源：各关「伪代码骨架」段（pseudocode）的 algo / signature / page / lines / vars。
 * ★ 为什么不像插图那样做静态清单：伪代码本身就在关卡数据里，运行时遍历一遍即得，
 *   零构建、永不漂移（与术语表、复杂度表同一条理由）。
 *
 * 一关里可能有两段配套伪代码（2.3 既有 MERGE-SORT 又有它调用的 MERGE），
 * 第二段起写在 stage.more 里 —— 只读 stage 会漏掉一半，所以两处都收。
 *
 * 原书有 21 关根本没有伪代码框（如 1.1「算法是什么」），这些关不进本页：
 * 速查表里列一行「本关无伪代码」只是噪音。页脚的读数会说明实际收了多少段。
 *
 * 正文一律照抄关卡数据（红线 R1/R2：伪代码与页码都来自原书，不得改写）。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as router from '../core/router.js';
import { pageRef } from '../core/page.js';
import { getChapter, listChapterKeys, chapterLabel } from '../chapters.js';

/** 伪代码出在「伪代码骨架」段的阶段号（1 基）。 */
const PSEUDOCODE_STAGE = 4;

/** 章的排序键：正文按章号，附录排在其后（与目录、术语表、复杂度表一致）。 */
function chapterOrder(ch) {
  const s = String(ch);
  return /^\d+$/.test(s) ? 'n' + s.padStart(2, '0') : 'z' + s.toUpperCase();
}

/**
 * 收集全站伪代码段。
 * 一条 = 一段伪代码（不是一关）：stage 自身与 stage.more 各算一条。
 */
export function collectListings() {
  const out = [];
  for (const key of listChapterKeys()) {
    const mod = getChapter(key);
    if (!mod || !Array.isArray(mod.levels)) continue;
    for (const lv of mod.levels) {
      for (const st of lv.stages || []) {
        if (st.type !== 'pseudocode') continue;
        const blocks = [st].concat(Array.isArray(st.more) ? st.more : []);
        for (const b of blocks) {
          // 只收真正有代码行的段：没有 lines 的段在原书里就没有伪代码框。
          if (!Array.isArray(b.lines) || !b.lines.length) continue;
          out.push({
            ch: mod.ch,
            chLabel: chapterLabel(mod.ch),
            sec: lv.key,
            section: lv.section,
            // ★ shortTitle 里已含节号（'2.1 插入排序'），页面拼接时不能再补一次，
            //   否则出现「2.1 2.1 插入排序」。与术语表同一处坑，这里存短标题原样。
            shortTitle: lv.shortTitle || lv.title || lv.key,
            title: lv.title || lv.key,
            algo: b.algo ? String(b.algo) : '',
            signature: b.signature ? String(b.signature) : '',
            page: b.page,
            lines: b.lines.length,
            vars: (b.vars || []).length,
          });
        }
      }
    }
  }
  return out;
}

/** 按章分组；组顺序同目录（正文按数值、附录收尾），组内保持书里的顺序。 */
export function groupListings(listings) {
  const groups = [];
  for (const it of listings) {
    const key = String(it.ch);
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, chLabel: it.chLabel, items: [] }; groups.push(g); }
    g.items.push(it);
  }
  groups.sort((a, b) => {
    const ka = chapterOrder(a.key), kb = chapterOrder(b.key);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  return groups;
}

/** 该段伪代码的显示名：优先 algo，缺了就用 signature，再缺就退回节号。 */
export function listingName(it) {
  return it.algo || it.signature || (it.section + ' 伪代码');
}

function listingRow(it) {
  const name = listingName(it);
  return h('div', { class: 'pcx-item' },
    h('div', { class: 'pcx-head' },
      h('span', { class: 'pcx-name' }, name),
      it.signature && it.algo && it.signature !== it.algo
        ? h('span', { class: 'pcx-sig' }, it.signature)
        : null
    ),
    h('div', { class: 'pcx-meta' },
      h('a', {
        class: 'cx-link',
        href: router.buildUrl(it.ch, it.sec, PSEUDOCODE_STAGE),
        title: '去这一关的「伪代码骨架」段看逐行讲解与变量表',
      }, it.shortTitle || it.section),
      h('span', { class: 'pcx-dim' }, it.lines + ' 行'),
      it.vars ? h('span', { class: 'pcx-dim' }, it.vars + ' 个变量') : null,
      pageRef(it.page)
    )
  );
}

/**
 * 渲染伪代码速查。
 * @returns {{node: Node, destroy: Function}}
 */
export function renderPseudocode() {
  const all = collectListings();
  const allGroups = groupListings(all);
  const algoCount = new Set(all.map((x) => x.algo).filter(Boolean)).size;

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 伪代码速查'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, '⌘'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '伪代码速查'),
        h('p', { class: 'lv-subtitle' }, 'Pseudocode index · 全书算法一页查尽')
      )
    )
  );

  const countEl = h('span', { class: 'gloss-count' });
  const search = h('input', {
    class: 'drill-input gloss-search',
    type: 'search',
    'aria-label': '搜索伪代码（算法名或节号）',
    placeholder: '搜索：INSERTION-SORT / heap / 7.1',
    autocomplete: 'off',
  });
  const listWrap = h('div', { class: 'stack' });

  function renderList() {
    const q = search.value.trim().toLowerCase();
    const groups = q
      ? groupListings(all.filter((it) =>
          listingName(it).toLowerCase().includes(q) ||
          it.signature.toLowerCase().includes(q) ||
          it.title.toLowerCase().includes(q) ||
          it.section.toLowerCase().includes(q) ||
          it.chLabel.toLowerCase().includes(q)))
      : allGroups;

    const shown = groups.reduce((a, g) => a + g.items.length, 0);
    countEl.textContent = q
      ? '匹配 ' + shown + ' 段 / 共 ' + all.length + ' 段'
      : '共 ' + all.length + ' 段伪代码 · ' + algoCount + ' 个具名算法 · 覆盖 ' + allGroups.length + ' 章';

    if (!shown) {
      listWrap.replaceChildren(h('div', { class: 'callout callout--warn' },
        h('strong', null, '没有匹配的伪代码。'),
        h('span', null, ' 可以搜算法名（HEAPSORT）、关键词，或节号（7.1）。')));
      return;
    }

    listWrap.replaceChildren(...groups.map((g) =>
      h('section', { class: 'pcx-group' },
        h('h2', { class: 'pcx-chapter' },
          h('a', { class: 'cx-chapter__link', href: router.buildUrl(g.key, 's01', 1) }, g.chLabel),
          h('span', { class: 'cx-chapter__count' }, g.items.length + ' 段')
        ),
        h('div', { class: 'pcx-list' }, ...g.items.map(listingRow))
      )));
  }

  search.addEventListener('input', renderList);
  renderList();

  const body = h('div', { class: 'stack' },
    h('div', { class: 'gloss-toolbar' }, search, countEl),
    h('p', { class: 'card__meta' },
      '伪代码逐字取自原书对应印刷页（页码可点回那一关的「伪代码骨架」段，那里有逐行中文讲解与变量表）。'
      + '一关里有两段配套伪代码的（如 2.3 的 MERGE-SORT 与 MERGE），两段都列出来了。'),
    listWrap
  );

  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderPseudocode;
