/* =============================================================================
 * ui/chapter-view.js — 章节外壳（章节外壳 Agent 拥有）
 *
 * 职责：把一个「章节对象」+ 当前路由，渲染成完整的关卡页面：
 *   章节头 → 左栏（关卡列表 + 九段导航）→ 右栏（当前阶段内容）→ 阶段底部导航
 *
 * 路由形态：#/ch02/s01/s04   →  章 ch02 / 关卡 s01 / 阶段 s04（第 4 个阶段，1 基）
 * 阶段顺序由 STAGE_META 的 no 决定，缺失的阶段自动跳过。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as store from '../core/store.js';
import * as router from '../core/router.js';
import { chapterLabel } from '../chapters.js';
import { renderStage, STAGE_META, pageRef } from './stages.js';

/** 按 STAGE_META.no 排序，过滤掉未知类型。 */
function orderedStages(level) {
  return (level.stages || [])
    .filter((s) => STAGE_META[s.type])
    .slice()
    .sort((a, b) => STAGE_META[a.type].no - STAGE_META[b.type].no);
}

function findLevel(chapter, section) {
  if (!chapter.levels || !chapter.levels.length) return null;
  if (!section) return chapter.levels[0];
  return chapter.levels.find((l) => l.key === section) || null;
}

export function renderChapter(chapter, route) {
  const level = findLevel(chapter, route.section);
  if (!level) {
    return {
      node: h('div', { class: 'stack' },
        h('h1', { class: 'lv-title' }, chapter.title || '章节'),
        h('p', { class: 'card__meta' },
          '这个关卡（' + (route.section || '—') + '）还没有内容。已建好的关卡：' +
          (chapter.levels || []).map((l) => l.key).join('、')),
        h('a', { class: 'btn btn--primary', href: '#/' }, '← 回到学习地图')
      ),
      destroy() {},
    };
  }

  const stages = orderedStages(level);
  const stageNo = route.stage ? parseInt(String(route.stage).replace(/^s/, ''), 10) : 1;
  const stageIdx = Math.min(Math.max(0, (Number.isFinite(stageNo) ? stageNo : 1) - 1), stages.length - 1);
  const stage = stages[stageIdx];

  /* ---------------- 章节头 ---------------- */
  const levelIdx = chapter.levels.indexOf(level);
  const stagesDone = stages.filter((s) =>
    store.isStageDone(chapter.ch, level.key, s.type)).length;
  const header = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'),
      ' / ',
      chapterLabel(chapter.ch)
    ),
    // 编号 + 标题：编号用展示衬线，像教科书的节号
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, level.section),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, level.title),
        level.titleEn ? h('p', { class: 'lv-subtitle' }, level.titleEn) : null
      )
    ),
    h('div', { class: 'lv-meta' },
      level.source && level.source.printed
        ? pageRef(level.source.printed)
        : null,
      h('span', null, '关卡 ' + (levelIdx + 1) + ' / ' + chapter.levels.length),
      // 九段进度：一格一段，已过的填色。这是「闯关」在页面上最直接的可视化。
      h('span', {
        class: 'ticks',
        'aria-label': '本关共 ' + stages.length + ' 段，已完成 ' + stagesDone + ' 段',
      },
        stages.map((s) =>
          store.isStageDone(chapter.ch, level.key, s.type)
            ? h('i', { dataset: { on: '1' } })
            : h('i'))
      ),
      h('span', null, '已过 ' + stagesDone + ' / ' + stages.length + ' 段')
    )
  );

  /* ---------------- 左栏：关卡列表 + 阶段导航 ---------------- */
  const levelList = h('ul', { class: 'rail-list' },
    chapter.levels.map((l, i) => {
      const doneCount = (l.stages || []).filter((s) => store.isStageDone(chapter.ch, l.key, s.type)).length;
      const total = orderedStages(l).length;
      const allDone = total > 0 && doneCount === total;
      return h('li', null,
        h('a', {
          class: 'rail-item' + (allDone ? ' is-done' : (doneCount ? ' is-partial' : '')),
          href: router.buildUrl(chapter.ch, l.key, 1),
          'aria-current': l === level ? 'true' : 'false',
        },
          h('span', { class: 'rail-no' }, String(i + 1)),
          h('span', null, l.shortTitle || l.title),
          h('span', { class: 'rail-mark' },
            allDone ? '✓' : (doneCount ? doneCount + '/' + total : ''))
        )
      );
    })
  );

  const stageList = h('ul', { class: 'rail-list' },
    stages.map((s, i) => {
      const m = STAGE_META[s.type];
      const done = store.isStageDone(chapter.ch, level.key, s.type);
      return h('li', null,
        h('a', {
          class: 'rail-item' + (done ? ' is-done' : '')
            + (s === stage ? ' is-current' : ''),
          href: router.buildUrl(chapter.ch, level.key, i + 1),
          'aria-current': s === stage ? 'true' : 'false',
        },
          // ★ 侧栏编号必须与它自己的 href（第 116 行的 i+1，1 基）一致：
          //   原先显示 m.no，出现「写着 4、点了跳到 s05」的自相矛盾。
          //   闸门要求九段齐全，所以 i+1 与 m.no+1 恒等。
          h('span', { class: 'rail-no' }, String(i + 1)),
          h('span', null, s.title || m.name),
          h('span', { class: 'rail-mark' }, done ? '✓' : '')
        )
      );
    })
  );

  const rail = h('aside', { class: 'lv-rail' },
    h('div', null,
      h('p', { class: 'rail-group__title' }, '本章关卡'),
      levelList,
      // 章末 Boss 区的入口：整章完成度与章末 Problems 只在那一页讲，
      // 没这个入口的话，不在闯关测验里的 Problem 就无从到达。
      h('ul', { class: 'rail-list' },
        h('li', null,
          h('a', { class: 'rail-item rail-item--boss', href: router.buildUrl(chapter.ch, 'boss', 1) },
            h('span', { class: 'rail-no' }, '★'),
            h('span', null, '章末 Boss'),
            h('span', { class: 'rail-mark' }, '')))
      )
    ),
    h('div', null,
      h('p', { class: 'rail-group__title' }, '本关九段'),
      stageList
    )
  );

  /* ---------------- 右栏：阶段内容 ---------------- */
  const main = h('div', { class: 'stack' });

  const ctx = {
    level,
    ch: chapter.ch,
    section: level.key,
    onStageDone: (stageType) => {
      store.markStage(chapter.ch, level.key, stageType, true);
      const idx = stages.findIndex((s) => s.type === stageType);
      const link = stageList.children[idx] && stageList.children[idx].querySelector('.rail-mark');
      if (link) link.textContent = '✓';
    },
  };

  const rendered = renderStage(stage, ctx);
  main.appendChild(rendered.node);

  /* ---------------- 底部导航 ---------------- */
  const prevStage = stages[stageIdx - 1];
  const nextStage = stages[stageIdx + 1];
  const nextLevel = chapter.levels[levelIdx + 1];

  const markBtn = h('button', { class: 'btn btn--sm', type: 'button' }, '标记本阶段完成');
  markBtn.addEventListener('click', () => {
    ctx.onStageDone(stage.type);
    markBtn.textContent = '已标记完成 ✓';
    markBtn.disabled = true;
  });
  if (store.isStageDone(chapter.ch, level.key, stage.type)) {
    markBtn.textContent = '已标记完成 ✓';
    markBtn.disabled = true;
  }

  const foot = h('div', { class: 'stage-foot' },
    prevStage
      ? h('a', { class: 'btn btn--sm', href: router.buildUrl(chapter.ch, level.key, stageIdx) },
          '← ' + (STAGE_META[prevStage.type].name))
      : null,
    h('span', { class: 'spacer' }),
    markBtn,
    h('span', { class: 'spacer' }),
    nextStage
      ? h('a', { class: 'btn btn--primary btn--sm', href: router.buildUrl(chapter.ch, level.key, stageIdx + 2) },
          (STAGE_META[nextStage.type].name) + ' →')
      : (nextLevel
          ? h('a', { class: 'btn btn--primary btn--sm', href: router.buildUrl(chapter.ch, nextLevel.key, 1) },
              '下一关：' + (nextLevel.shortTitle || nextLevel.title) + ' →')
          : null)
  );
  main.appendChild(foot);

  const node = h('div', null,
    header,
    h('div', { class: 'lv-body' }, rail, main)
  );

  return {
    node,
    destroy() { if (rendered.destroy) rendered.destroy(); },
  };
}

export default renderChapter;
