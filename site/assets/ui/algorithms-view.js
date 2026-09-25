/* =============================================================================
 * ui/algorithms-view.js — 算法选择器（#/algorithms）
 *
 * 与相邻三个聚合页的分工（都读同一份关卡数据，但回答不同的问题）：
 *   #/pseudocode 逐**段**列伪代码（2.3 一关就出 MERGE-SORT 与 MERGE 两段）；
 *   #/complexity 逐**条**列复杂度结论（566 条，含本站补充推导）；
 *   #/algorithms 逐**关**列「这关教的是哪个算法/技术，它多快，能不能单步跑」。
 * 本页的独有价值是**按 Part 横向对照**：排序类有哪些、图算法有哪些，各自什么代价 ——
 * 这在按章排的目录里看不出来。
 *
 * ★ 只列「有算法名」的关。全站 152 关里有 22 关在原书里没有伪代码框
 *   （1.1「算法是什么」、3.1 的渐进记号直觉等），它们是概念关而不是算法，
 *   列进选择器只会稀释信号。页脚读数会说明实际收了多少。
 *
 * 所有字段都照抄关卡数据（算法名、页码、复杂度表达式与出处），不另写「适用场景」
 * 这类书上没有的话 —— 那会变成杜撰结论（红线 R2）。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as router from '../core/router.js';
import { pageRef } from '../core/page.js';
import { loadChapters, listChapterKeys } from '../chapters.js';
import { partOf, STRUCTURE, APPENDICES } from '../data/structure.js';

/** 伪代码出在「伪代码骨架」段（1 基第 4 段）；复杂度出在第 7 段。 */
const PSEUDOCODE_STAGE = 4;
const ANALYZE_STAGE = 7;

/** 章的排序键：正文按章号，附录排在其后（与目录、术语表、复杂度表、速查一致）。 */
function chapterOrder(ch) {
  const s = String(ch);
  return /^\d+$/.test(s) ? 'n' + s.padStart(2, '0') : 'z' + s.toUpperCase();
}

/**
 * 收集全站「算法关」。一关一条；配套过程（如 MERGE-SORT 的 MERGE）附在条内。
 */
export async function collectAlgorithms() {
  const out = [];
  // 本页是全书聚合：只有打开它才会把 39 章一起拉下来（loadChapters 并发 + 按章去重）。
  const mods = await loadChapters(listChapterKeys());
  for (const key of listChapterKeys()) {
    const mod = mods.get(key);
    if (!mod || !Array.isArray(mod.levels)) continue;
    for (const lv of mod.levels) {
      let mainAlgo = '';
      let mainSig = '';
      let page = null;
      const extras = [];
      let anim = '';
      let claims = [];

      for (const st of lv.stages || []) {
        if (st.type === 'pseudocode') {
          const blocks = [st].concat(Array.isArray(st.more) ? st.more : []);
          blocks.forEach((b, i) => {
            if (!Array.isArray(b.lines) || !b.lines.length) return;
            const name = b.algo ? String(b.algo) : '';
            if (!name) return;
            if (i === 0 && !mainAlgo) {
              mainAlgo = name;
              mainSig = b.signature ? String(b.signature) : '';
              page = b.page;
            } else {
              extras.push({ name, page: b.page });
            }
          });
        }
        if (st.type === 'visualize' && st.algorithm) anim = String(st.algorithm);
        if (st.type === 'analyze') claims = (st.claims || []).filter((c) => c && c.expr);
      }

      if (!mainAlgo) continue; // 概念关不进选择器（见文件头）

      out.push({
        ch: mod.ch,
        sec: lv.key,
        section: lv.section,
        // shortTitle 已含节号（'2.1 插入排序'），显示时不能再拼一次 —— 全站踩过三次的坑。
        shortTitle: lv.shortTitle || lv.title || lv.key,
        algo: mainAlgo,
        signature: mainSig,
        page,
        extras,
        anim,
        claims: claims.slice(0, 2).map((c) => ({
          expr: String(c.expr),
          page: c.page,
          preview: !!c.preview,
          instructor: c.source === 'instructor',
        })),
      });
    }
  }
  return out;
}

/**
 * 按 Part 分组（本页的独有价值就在这个分组上）。
 * 组顺序 = 书里的顺序：Part I…VII，然后是附录。
 */
export function groupByPart(items) {
  const order = STRUCTURE.map((p) => ({ no: p.no, title: p.title, zh: p.zh }))
    .concat([{ no: 'Appendix', title: 'Appendix: Mathematical Background', zh: '附录' }]);
  const groups = new Map();
  for (const it of items) {
    const p = partOf(it.ch);
    if (!groups.has(p.no)) groups.set(p.no, { part: p, items: [] });
    groups.get(p.no).items.push(it);
  }
  for (const g of groups.values()) {
    g.items.sort((a, b) => {
      const ka = chapterOrder(a.ch), kb = chapterOrder(b.ch);
      if (ka !== kb) return ka < kb ? -1 : 1;
      return String(a.sec).localeCompare(String(b.sec));
    });
  }
  return order.filter((p) => groups.has(p.no)).map((p) => groups.get(p.no));
}

function algoRow(item) {
  const page = item.page || (item.claims[0] && item.claims[0].page);
  return h('div', { class: 'algo-row' },
    h('div', { class: 'algo-row__main' },
      h('a', {
        class: 'algo-row__name',
        href: router.buildUrl(item.ch, item.sec, PSEUDOCODE_STAGE),
        title: '去这一关的「伪代码骨架」段看逐行讲解',
      }, item.algo),
      item.signature && item.signature !== item.algo
        ? h('span', { class: 'algo-row__sig' }, item.signature)
        : null,
      item.anim
        ? h('a', {
            class: 'badge algo-row__anim',
            href: router.buildUrl(item.ch, item.sec, 5),
            title: '这一关的算法可以单步跑（阶段 5 动手看见）',
          }, '可单步')
        : null
    ),
    h('div', { class: 'algo-row__where' },
      h('a', { class: 'algo-row__level', href: router.buildUrl(item.ch, item.sec, 1) },
        item.shortTitle),
      page ? pageRef(page) : null
    ),
    item.extras.length
      ? h('div', { class: 'algo-row__extras' },
          '配套过程：',
          item.extras.map((x, i) => h('span', null,
            i ? '、' : '',
            h('a', {
              class: 'algo-row__extra',
              href: router.buildUrl(item.ch, item.sec, PSEUDOCODE_STAGE),
            }, x.name),
            x.page ? h('span', { class: 'algo-row__extra-page' }, '（p.' + (Array.isArray(x.page) ? x.page[0] : x.page) + '）') : null)))
      : null,
    item.claims.length
      ? h('div', { class: 'algo-row__cost' },
          item.claims.map((c) => h('span', { class: 'algo-cost' },
            katex.renderMixed('$' + c.expr + '$'),
            c.instructor ? h('span', { class: 'drill-badge' }, '本站补充') : null,
            pageRef(c.page, c.preview))))
      : null
  );
}

/**
 * 渲染算法选择器。
 * @returns {{node: Node, destroy: Function}}
 */
export async function renderAlgorithms() {
  const all = await collectAlgorithms();
  const groups = groupByPart(all);
  const animCount = all.filter((a) => a.anim).length;

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 算法选择器'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, '⚙'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '算法选择器'),
        h('p', { class: 'lv-subtitle' }, 'Algorithms · 按部分横向对照')
      )
    )
  );

  const countEl = h('span', { class: 'gloss-count' });
  const search = h('input', {
    class: 'drill-input gloss-search',
    type: 'search',
    'aria-label': '搜索算法（名称、节号或章名）',
    placeholder: '搜索：SORT / Dijkstra / 排序 / 6.4',
    autocomplete: 'off',
  });
  const listWrap = h('div', { class: 'stack' });

  function renderList() {
    const q = search.value.trim().toLowerCase();
    const hits = q
      ? all.filter((a) =>
          a.algo.toLowerCase().includes(q) ||
          a.signature.toLowerCase().includes(q) ||
          a.shortTitle.toLowerCase().includes(q) ||
          a.section.toLowerCase().includes(q) ||
          a.extras.some((x) => x.name.toLowerCase().includes(q)))
      : all;
    const shown = groupByPart(hits);

    countEl.textContent = q
      ? '匹配 ' + hits.length + ' 个 / 共 ' + all.length + ' 个'
      : '共 ' + all.length + ' 个算法/过程 · ' + animCount + ' 个可单步跑 · 按原书部分分组';

    if (!hits.length) {
      listWrap.replaceChildren(h('div', { class: 'callout callout--warn' },
        h('strong', null, '没有匹配的算法。'),
        h('span', null, ' 可以搜名称片段（SORT、HEAP）、节号（6.4），或中文关名（堆排序）。')));
      return;
    }

    listWrap.replaceChildren(...shown.map((g) =>
      h('section', { class: 'algo-group' },
        h('h2', { class: 'algo-part' },
          h('span', { class: 'algo-part__no' }, g.part.no),
          h('span', null, g.part.title,
            h('span', { class: 'gloss-zh' }, g.part.zh)),
          h('span', { class: 'algo-part__count' }, g.items.length + ' 个')),
        ...g.items.map(algoRow)
      )));
  }

  search.addEventListener('input', renderList);
  renderList();

  const body = h('div', { class: 'stack' },
    h('div', { class: 'gloss-toolbar' }, search, countEl),
    h('p', { class: 'card__meta' },
      '每条给的是：算法名（点开看逐行伪代码）、出自哪一关、复杂度结论与印刷页，'
      + '以及它能不能单步跑。复杂度一律带页码溯源；标「本站补充」的是本站在例题上补算的。'),
    listWrap
  );

  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderAlgorithms;
