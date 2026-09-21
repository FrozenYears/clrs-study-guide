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
 *   ② Problems 汇总 —— 原书章末 Problem 常散落在不同的关里，这里跨关收齐；
 *   ③ 章末自测入口 —— 直接跳到最后一关的闯关测验。
 *
 * ★ 只有 9 章在原书里收了 Problem（共 37 道，见 34.5-8 那一类不在本书习题里的编号
 *   已按原书剔除）。其余 30 章的 Problems 块不出现 —— 不编题、不占位、不说
 *   「本章没有 Problems」这种废话，只留徽章与进度。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as store from '../core/store.js';
import * as router from '../core/router.js';
import { chapterLabel } from '../chapters.js';
import { pageRef } from '../core/page.js';
import { STAGE_META } from './stages.js';

/** 九段总数：以 STAGE_META 为准，不写死 9。 */
const STAGE_COUNT = Object.keys(STAGE_META).length;

/** 原书 Problem 的编号形态：`3-1`（章号-序号）；节末练习题是 `3.1-2`，不在此列。 */
const PROBLEM_ID = /^\d+-\d+$/;

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

/** 跨关收齐本章的原书 Problems（保持书里的顺序：关序 → 题号）。 */
export function chapterProblems(chapter) {
  const out = [];
  for (const lv of chapter.levels || []) {
    for (const st of lv.stages || []) {
      if (st.type !== 'drill') continue;
      for (const ex of st.bookExercises || []) {
        if (!PROBLEM_ID.test(ex.id)) continue;
        out.push({ ex, level: lv });
      }
    }
  }
  return out;
}

function badgeBlock(rows, problemCount) {
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

  // ★ 文案必须按「本章到底有没有 Problems」分岔：只有 9 章在原书里收了 Problem，
  //   其余 30 章若还说「看下面的 Problems」，读者会往下找一堆不存在的东西。
  let note;
  if (cleared) {
    note = problemCount
      ? '本章 ' + total + ' 关的九个阶段全部走完。往下的 Problems 是原书章末的压轴题 —— 它们比节末练习难，卡住很正常，提示里有骨架。'
      : '本章 ' + total + ' 关的九个阶段全部走完。本章在原书里没有章末 Problem，节末练习已随各关的闯关测验出现过。';
  } else {
    note = problemCount
      ? '把本章 ' + total + ' 关的九个阶段都走完，这里会亮起「本章通关」。现在可以先看下面的 Problems 挑一道试手。'
      : '把本章 ' + total + ' 关的九个阶段都走完，这里会亮起「本章通关」。点下面的关卡继续。';
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

  const kids = [head, badgeBlock(rows, problems.length)];

  kids.push(h('h2', { class: 'card__title' }, '本章关卡'));
  kids.push(levelList(chapter, rows));

  if (problems.length) {
    kids.push(h('h2', { class: 'card__title' }, '原书 Problems（' + problems.length + ' 道）'));
    kids.push(h('p', { class: 'card__meta' },
      '原书章末 Problem 的原文与中文提示。它们散布在上面各关的测验里，这里按书序收齐 —— 只给提示不给答案。'));
    for (const p of problems) {
      kids.push(h('div', { class: 'drill-exercise' },
        h('div', { class: 'drill-exercise__head' },
          h('span', { class: 'drill-exercise__id' }, p.ex.id),
          pageRef(p.ex.page),
          h('a', {
            class: 'boss-problem__src',
            href: router.buildUrl(chapter.ch, p.level.key, 9),
          }, p.level.shortTitle || p.level.title)
        ),
        h('p', { class: 'drill-exercise__stmt', 'data-kind': 'source' }, p.ex.statement),
        p.ex.hint
          ? h('details', { class: 'kit' },
              h('summary', null, '给个提示'),
              h('div', { 'data-kind': 'note' }, h('p', { style: { margin: '0' } }, katex.renderMixed(p.ex.hint))))
          : null
      ));
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
