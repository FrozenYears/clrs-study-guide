/* =============================================================================
 * ui/glossary-view.js — 术语表（#/glossary）
 *
 * 数据来源：关卡数据里 `source` 段的 `terms` 字段（152 关全都有）。
 * ★ 为什么不像插图那样用生成器做静态清单：术语本身就是关卡数据的一部分，
 *   运行时遍历一遍即得，零构建、也永远不会与内容漂移（插图必须生成，
 *   是因为图注与尺寸在 data/figures.json 里，不在关卡数据里）。
 *
 * 同一术语常在多关重复出现（'merge sort' 在 1.2 与 2.3 都讲），
 * 所以按英文名归一化合并成一条，把各关出处并排列出来 —— 术语表的用途
 * 正是「这个词在书里哪几处出现过、分别怎么讲」，拆成两条反而看不出关系。
 *
 * 英文一律照关卡数据里的原样显示（红线 R4：英文取自原书，不得自创译名）。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as router from '../core/router.js';
import { getChapter, listChapterKeys } from '../chapters.js';

/** 该术语所在「原文精读」段的阶段号（1 基）。术语就长在这一段里。 */
const SOURCE_STAGE = 3;

/**
 * 印刷页字段归一：数据里有整数（22）与区间（[31, 32]）两种写法。
 * 缺页码返回空串，调用方据此决定要不要渲染页锚。
 */
export function formatPage(page) {
  if (Array.isArray(page)) {
    const nums = page.filter((n) => Number.isFinite(n));
    if (!nums.length) return '';
    const lo = nums[0];
    const hi = nums[nums.length - 1];
    // 两端相同就没有区间可写（数据里真出现过 [7, 7] 这种写法）。
    return lo === hi ? String(lo) : lo + '–' + hi;
  }
  return Number.isFinite(page) ? String(page) : '';
}

/** 章的展示名（'第 2 章 · Getting Started（起步）' / '附录 A'）。 */
function chapterLabel(mod, ch) {
  if (mod && mod.chSpan) return mod.chSpan;
  const s = String(ch);
  return /^\d+$/.test(s) ? '第 ' + s + ' 章' : '附录 ' + s.toUpperCase();
}

/**
 * 收集全站术语（每条带出处）。
 * 遍历顺序即注册表顺序；排序与去重交给 groupTerms。
 */
export function collectTerms() {
  const out = [];
  for (const key of listChapterKeys()) {
    const mod = getChapter(key);
    if (!mod || !Array.isArray(mod.levels)) continue;
    for (const lv of mod.levels) {
      for (const st of lv.stages || []) {
        if (!Array.isArray(st.terms)) continue;
        for (const t of st.terms) {
          if (!t || !t.en || !t.zh) continue;
          out.push({
            en: String(t.en).trim(),
            zh: String(t.zh).trim(),
            page: t.page,
            ch: mod.ch,
            chLabel: chapterLabel(mod, mod.ch),
            sec: lv.key,
            section: lv.section,
            shortTitle: lv.shortTitle || lv.title || lv.key,
          });
        }
      }
    }
  }
  return out;
}

/**
 * 按英文名归一化合并（大小写、首尾空格不敏感），并附上全部出处。
 * 返回按英文名字母序排好的数组：
 *   [{ en, zh: string[], sources: [{ch, chLabel, sec, section, shortTitle, page}] }]
 */
export function groupTerms(terms) {
  const map = new Map();
  for (const t of terms) {
    // 归一化必须连首尾空白一起去掉：collectTerms 已经 trim 过，但 groupTerms 是
    // 导出函数，直接喂未清洗的数据时（单测就是这么用的）也得合并成同一条。
    const en = String(t.en).trim();
    const key = en.toLowerCase();
    let g = map.get(key);
    if (!g) {
      g = { en, zh: [], sources: [], _srcKeys: new Set() };
      map.set(key, g);
    }
    // 同一术语在不同关的译法可能略有详略（'在线算法' vs '在线算法（输入随时间到达）'），
    // 两版都留着：它们各自是那一关的讲法，删掉任何一个都是在改内容。
    if (!g.zh.includes(t.zh)) g.zh.push(t.zh);
    const srcKey = t.ch + '/' + t.sec + '/' + formatPage(t.page);
    if (!g._srcKeys.has(srcKey)) {
      g._srcKeys.add(srcKey);
      g.sources.push({
        ch: t.ch, chLabel: t.chLabel, sec: t.sec,
        section: t.section, shortTitle: t.shortTitle, page: t.page,
      });
    }
  }
  const list = [...map.values()];
  list.forEach((g) => { delete g._srcKeys; });
  list.sort((a, b) => a.en.localeCompare(b.en, 'en', { sensitivity: 'base' }) || a.en.localeCompare(b.en));
  return list;
}

/** 首字母分组键：非拉丁字母开头（'1-origin indexing'）归到 '#'。 */
function letterOf(en) {
  const c = en.charAt(0);
  return /[a-z]/i.test(c) ? c.toUpperCase() : '#';
}

function termNode(g) {
  return h('div', { class: 'gloss-item' },
    h('div', { class: 'gloss-term' },
      h('span', { class: 'gloss-en' }, g.en),
      ...g.zh.map((z) => h('span', { class: 'gloss-zh' }, katex.renderMixed(z)))
    ),
    h('div', { class: 'gloss-src' },
      ...g.sources.map((s) => h('a', {
        class: 'gloss-link',
        href: router.buildUrl(s.ch, s.sec, SOURCE_STAGE),
        title: '去这一关的「原文精读」段看它出现的地方',
      },
        h('span', { class: 'gloss-link__where' }, s.chLabel + ' · ' + s.shortTitle),
        formatPage(s.page) ? h('span', { class: 'pg-ref' }, '印刷页 ' + formatPage(s.page)) : null
      ))
    )
  );
}

/**
 * 渲染术语表。
 * @returns {{node: Node, destroy: Function}}
 */
export function renderGlossary() {
  const all = groupTerms(collectTerms());
  const totalEntries = all.reduce((a, g) => a + g.sources.length, 0);

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 术语表'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, 'Aa'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '术语表'),
        h('p', { class: 'lv-subtitle' }, 'Glossary · 中英对照与出处反查')
      )
    )
  );

  const countEl = h('span', { class: 'gloss-count' });

  const search = h('input', {
    class: 'drill-input gloss-search',
    type: 'search',
    'aria-label': '搜索术语（英文或中文）',
    placeholder: '搜索术语：英文或中文，例如 heap / 堆',
    autocomplete: 'off',
  });

  const listWrap = h('div', { class: 'stack' });

  function renderList() {
    const q = search.value.trim().toLowerCase();
    const hits = q
      ? all.filter((g) => g.en.toLowerCase().includes(q) || g.zh.some((z) => z.toLowerCase().includes(q)))
      : all;

    countEl.textContent = q
      ? '匹配 ' + hits.length + ' 条 / 共 ' + all.length + ' 条'
      : '共 ' + all.length + ' 条术语 · ' + totalEntries + ' 处出处 · 覆盖全书'
      + '（同一术语在不同关出现时合并成一条）';

    if (!hits.length) {
      listWrap.replaceChildren(
        h('div', { class: 'callout callout--warn' },
          h('strong', null, '没有匹配的术语。'),
          h('span', null, ' 换个说法试试：英文名或中文译名都可以搜。')));
      return;
    }

    // 按首字母分组；分组在过滤之后重算，所以搜索结果的字母头一定是准的
    const groups = [];
    for (const g of hits) {
      const L = letterOf(g.en);
      let bucket = groups.find((b) => b.letter === L);
      if (!bucket) { bucket = { letter: L, items: [] }; groups.push(bucket); }
      bucket.items.push(g);
    }

    listWrap.replaceChildren(...groups.map((b) =>
      h('section', { class: 'gloss-group' },
        h('h2', { class: 'gloss-letter', id: 'gloss-' + b.letter }, b.letter),
        ...b.items.map(termNode)
      )));
  }

  search.addEventListener('input', renderList);
  renderList();

  const body = h('div', { class: 'stack' },
    h('div', { class: 'gloss-toolbar' }, search, countEl),
    listWrap
  );

  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderGlossary;
