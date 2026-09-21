/* =============================================================================
 * ui/boss-view.js — 章末 Boss 区（#/ch03/boss）
 *
 * 为什么做成章级独立页面，而不是塞进每个 drill 段的末尾：
 *   一章有 3–8 关，若把「本章通关」这块挂在每关的闯关测验下面，
 *   同一个学生在同一章里会看见它 5 遍，而它讲的正是「整章」这件事。
 *   章级页面出现一次、只有一个入口，语义才对得上。
 *
 * 三块内容，都是单关页面看不到的：
 *   ① 通关徽章 —— 本章 N 关 × 九段的全章完成度（单关只能看到自己那 9 段）；
 *   ② 原书章末 Problems —— **全量**，见下；
 *   ③ 章末自测入口 —— 直接跳到最后一关的闯关测验。
 *
 * ★ 第 41 轮把 Problems 的来源换了。原先从各关的 `bookExercises` 里按编号形态挑，
 *   只捞到 37 道；而原书章末实有 **154 道** —— 也就是说有 117 道题读者在站上
 *   从来没见过。现在统一读 site/assets/data/problems.js（由 tools/13_publish_problems.py
 *   从语料逐字生成、生成时逐条过闸门的 verify_quote），章末题一道不缺。
 *
 * ★ 不做「精选难题」：建设计划原话是「精选带 ★ 的难题」，但第 4 版原书对章末
 *   题号**不印难度星号**（全语料实测 0 条）。没有依据的挑选就是编造，所以全量上站。
 *
 * ★ 中文提示的覆盖是**不均匀**的：154 道里只有 37 道在早先的关卡编写中写过了提示，
 *   其余 117 道只有原文。页面如实标出有没有提示，不假装每道都有。
 *
 * ★ 完成度是**读者自评**：章末题是开放长题（含 a/b/c 小问），本站不给答案、不判分，
 *   所以勾选只表示「我自己做完了」。徽章按这个口径算，文案里不说「得分」「通过率」。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as store from '../core/store.js';
import * as router from '../core/router.js';
import { chapterLabel } from '../chapters.js';
import { pageRef } from '../core/page.js';
import { STAGE_META } from './stages.js';
import { problemsOf } from '../data/problems.js';

/** 九段总数：以 STAGE_META 为准，不写死 9。 */
const STAGE_COUNT = Object.keys(STAGE_META).length;

/** 原书 Problem 的编号形态：`3-1`（章号-序号）；节末练习题是 `3.1-2`，不在此列。 */
const PROBLEM_ID = /^(\d+)-(\d+)$/;

/** 本章每一关的完成情况。 */
export function chapterLevels(chapter) {
  return (chapter.levels || []).map((lv) => {
    const stages = (lv.stages || []).filter((s) => STAGE_META[s.type]).length || STAGE_COUNT;
    const done = store.getStageSet(chapter.ch, lv.key).size;
    return {
      level: lv,
      stages,
      done: Math.min(done, stages),
      complete: store.chapterDone(chapter.ch, lv.key),
    };
  });
}

/**
 * 本章的章末题（**全量**，来自 problems.js）。
 * 顺带把「哪些题在关卡里已经写过中文提示」标出来 —— 关卡那 37 条有提示，
 * 其余只有原文；页面按这个标记决定要不要渲染「给个提示」折叠块。
 */
export function chapterProblems(chapter) {
  const hints = new Map();
  for (const lv of chapter.levels || []) {
    for (const st of lv.stages || []) {
      if (st.type !== 'drill') continue;
      for (const ex of st.bookExercises || []) {
        if (!PROBLEM_ID.test(String(ex.id))) continue;
        hints.set(String(ex.id), { hint: ex.hint || null, level: lv });
      }
    }
  }
  return problemsOf(chapter.ch).map((p) => {
    const m = hints.get(p.id);
    return { id: p.id, page: p.page, statement: p.statement,
             hint: (m && m.hint) || null, level: (m && m.level) || null };
  });
}

/** 页码可能是整数或区间（跨页长题）。 */
function pageText(page) {
  return Array.isArray(page) ? page.join('–') : String(page);
}

function badgeBlock(rows, problems, doneProblems) {
  const total = rows.length;
  const doneCount = rows.filter((r) => r.complete).length;
  const cleared = total > 0 && doneCount === total;

  const badge = cleared
    ? h('span', { class: 'badge badge--done boss-badge' },
        h('span', { class: 'boss-badge__mark' }, '★'),
        '本章通关')
    : h('span', { class: 'badge boss-badge' },
        h('span', { class: 'boss-badge__mark' }, '☆'),
        '未通关 · ' + doneCount + ' / ' + total + ' 关');

  // ★ 文案必须按「本章到底有没有 Problems」分岔：原书只有 35 章收了 Problem，
  //   没有的那几章若还说「看下面的 Problems」，读者会往下找一堆不存在的东西。
  let note;
  if (!problems.length) {
    note = cleared
      ? '本章 ' + total + ' 关的九个阶段全部走完。本章在原书里没有章末 Problem，节末练习已随各关的闯关测验出现过。'
      : '把本章 ' + total + ' 关的九个阶段都走完，这里会亮起「本章通关」。点下面的关卡继续。';
  } else if (cleared) {
    note = '本章 ' + total + ' 关的九个阶段全部走完。往下的 ' + problems.length +
      ' 道章末题是原书压轴题 —— 它们比节末练习难，卡住很正常。' +
      (doneProblems ? '你已自评做完 ' + doneProblems + ' 道。' : '');
  } else {
    note = '把本章 ' + total + ' 关的九个阶段都走完，这里会亮起「本章通关」。' +
      '现在可以先看下面的 ' + problems.length + ' 道原书章末题挑一道试手。';
  }

  return h('div', { class: 'boss-head' }, badge, h('p', { class: 'boss-head__note' }, note));
}

function levelList(chapter, rows) {
  return h('div', { class: 'boss-levels' },
    rows.map((r, i) => h('a', {
      class: 'boss-level' + (r.complete ? ' is-done' : ''),
      href: router.buildUrl(chapter.ch, r.level.key, 1),
    },
      h('span', { class: 'boss-level__no' }, String(i + 1)),
      h('span', { class: 'boss-level__title' }, r.level.shortTitle || r.level.title),
      h('span', { class: 'boss-level__prog' }, r.done + ' / ' + r.stages + ' 段'),
      h('span', { class: 'boss-level__mark' }, r.complete ? '✓' : '')
    )));
}

/**
 * 渲染章末 Boss 区。
 * @returns {{node: Node, destroy: Function}}
 */
export function renderBoss(chapter) {
  const rows = chapterLevels(chapter);
  const problems = chapterProblems(chapter);
  const last = (chapter.levels || [])[chapter.levels.length - 1] || null;
  const withHints = problems.filter((p) => p.hint).length;

  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / ',
      h('a', { href: router.buildUrl(chapter.ch, last && last.key, 1) }, chapterLabel(chapter.ch)),
      ' / Boss'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, '★'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '章末 Boss'),
        h('p', { class: 'lv-subtitle' }, chapterLabel(chapter.ch))
      )
    )
  );

  const kids = [head, badgeBlock(rows, problems, store.getProblemSet(chapter.ch).length)];

  kids.push(h('h2', { class: 'card__title' }, '本章关卡'));
  kids.push(levelList(chapter, rows));

  if (problems.length) {
    const doneSet = new Set(store.getProblemSet(chapter.ch));
    const countEl = h('b', null, String(problems.filter((p) => doneSet.has(p.id)).length));

    kids.push(h('h2', { class: 'card__title' }, '原书 Problems（' + problems.length + ' 道）'));
    kids.push(h('p', { class: 'card__meta' },
      '原书章末题**全量**收录，题干逐字照录（衬线体），页码标在题号旁。'
      + '只给提示不给答案 —— 章末题是开放长题，本站没有权威解答，硬编一份就是杜撰。'
      + (withHints < problems.length
          ? ' 其中 ' + withHints + ' 道另有中文提示（标「给个提示」），其余 ' + (problems.length - withHints) + ' 道只有原文。'
          : '')));
    kids.push(h('p', { class: 'card__meta' },
      '右上的勾选是给你自己用的「做完了」标记 —— 它是自评，不是系统判分。已自评 ',
      countEl, ' / ' + problems.length + ' 道。'));

    for (const p of problems) {
      const box = h('input', {
        type: 'checkbox', class: 'boss-problem__check',
        'aria-label': '把 ' + p.id + ' 标记为已做完（自评）',
      });
      if (doneSet.has(p.id)) box.checked = true;
      box.addEventListener('change', () => {
        store.markProblem(chapter.ch, p.id, box.checked);
        countEl.textContent = String(problems
          .filter((q) => store.isProblemDone(chapter.ch, q.id)).length);
        item.classList.toggle('is-done', box.checked);
      });

      const src = p.level
        ? h('a', {
            class: 'boss-problem__src',
            href: router.buildUrl(chapter.ch, p.level.key, 9),
            title: '这道题也出现在这一关的测验里',
          }, p.level.shortTitle || p.level.title)
        : null;

      const item = h('div', {
        class: 'drill-exercise boss-problem' + (box.checked ? ' is-done' : ''),
      },
        h('div', { class: 'drill-exercise__head' },
          h('label', { class: 'boss-problem__mark' }, box,
            h('span', { class: 'drill-exercise__id' }, p.id)),
          pageRef(pageText(p.page)),
          src
        ),
        h('p', { class: 'drill-exercise__stmt', 'data-kind': 'source' }, p.statement),
        p.hint
          ? h('details', { class: 'kit' },
              h('summary', null, '给个提示'),
              h('div', { 'data-kind': 'note' },
                h('p', { style: { margin: '0' } }, katex.renderMixed(p.hint))))
          : null
      );
      kids.push(item);
    }
  }

  if (last) {
    kids.push(h('div', { class: 'row' },
      h('a', { class: 'btn btn--primary', href: router.buildUrl(chapter.ch, last.key, 9) },
        '去做 ' + (last.shortTitle || last.title) + ' 的闯关测验 →'),
      h('a', { class: 'btn btn--ghost', href: '#/' }, '回到学习地图')));
  }

  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

export default renderBoss;
