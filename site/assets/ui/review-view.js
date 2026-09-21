/* =============================================================================
 * ui/review-view.js — 复习模式（#/review）
 *
 * 数据：core/store.js 的复习台账（每道做过的题一条，含档位与到期时间）。
 * 算法：core/review-queue.js 排序（逾期越久越先问，同逾期看档位）。
 * 渲染：ui/quiz-item.js（与闯关测验同一份判分实现）。
 *
 * 三条产品决定，都不是随便定的：
 *   ① 一次会话默认最多 20 题。全站做满 1012 题后一天可能攒出上百道待复习，
 *      一次全端上来只会让人关掉页面 —— 先还最欠的，明天还有。
 *   ② 每道题都标出「来自哪一关」，并给一条回原关的链接。复习时想不起上下文
 *      是常态，能一键跳回讲解比在页面里塞解释更管用（解释也在那边，避免两份）。
 *   ③ 复习**不写关卡进度、不改测验得分**。它是额外练习，不该让「已过关」状态
 *      或最好成绩被复习时的表现影响。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as router from '../core/router.js';
import * as store from '../core/store.js';
import { buildQueue, sessionStats } from '../core/review-queue.js';
import { createQuizItem } from './quiz-item.js';

/** 一次会话最多问几题（见文件头 ①）。 */
const SESSION_LIMIT = 20;

/** 档位的中文说法：复习界面不该出现「box 3」这种内部词汇。 */
function boxLabel(box) {
  if (box <= 1) return '刚答错';
  if (box === 2) return '不熟';
  if (box <= 4) return '在记';
  return '已记牢';
}

/** 逾期多久（给人看的说法）。传入的是「已经过去多久」。 */
function agoText(ms) {
  const min = Math.floor(ms / 60000);
  if (min < 1) return '刚刚到期';
  if (min < 60) return min + ' 分钟前到期';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + ' 小时前到期';
  return Math.floor(hr / 24) + ' 天前到期';
}

/** 还要等多久（给人看的说法）。传入的是「距到期还有多久」，必须为正。 */
function untilText(ms) {
  const min = Math.round(ms / 60000);
  if (min <= 1) return '不到 1 分钟后';
  if (min < 60) return min + ' 分钟后';
  const hr = Math.round(min / 60);
  if (hr < 24) return hr + ' 小时后';
  return Math.round(hr / 24) + ' 天后';
}

/**
 * 渲染复习模式。
 * @returns {{node: Node, destroy: Function}}
 */
export function renderReview() {
  const head = h('header', { class: 'lv-header' },
    h('nav', { class: 'lv-crumbs' },
      h('a', { href: '#/' }, '学习地图'), ' / 复习'),
    h('div', { class: 'lv-heading' },
      h('span', { class: 'lv-heading__no' }, '↻'),
      h('div', { class: 'lv-heading__text' },
        h('h1', { class: 'lv-title' }, '复习'),
        h('p', { class: 'lv-subtitle' }, 'Spaced review · 按遗忘曲线推题')
      )
    )
  );

  const body = h('div', { class: 'stack' });

  function renderStart() {
    body.replaceChildren();
    const all = store.getReviewAll();
    const ids = Object.keys(all);
    const dueIds = store.dueReviews();
    const queue = buildQueue(dueIds.map((id) => Object.assign({ id }, all[id])), Date.now(), SESSION_LIMIT);
    const stats = sessionStats(queue);

    if (!ids.length) {
      body.appendChild(h('div', { class: 'callout' },
        h('strong', null, '还没有可复习的题。'),
        h('span', null,
          ' 做过的每道测验题都会自动记进这里，并按遗忘曲线安排下次出现的时机'
          + '（答错 5 分钟后、答对则越隔越久），不用自己排计划。')));
      body.appendChild(h('div', { class: 'row' },
        h('a', { class: 'btn btn--primary', href: '#/' }, '← 去学习地图挑一关')));
      return;
    }

    if (!queue.length) {
      // 有记录但都还没到期：把「最近一次什么时候该复习」如实告知。
      const next = ids
        .map((id) => all[id] && all[id].due)
        .filter((d) => Number.isFinite(d))
        .sort((a, b) => a - b)[0];
      const wait = Number.isFinite(next) ? untilText(Math.max(0, next - Date.now())) : '稍后';
      body.appendChild(h('div', { class: 'callout callout--ok' },
        h('strong', null, '今天的复习都做完了。'),
        h('span', null, ' 已记录 ' + ids.length + ' 道题的掌握情况；下一批在 ' + wait + '。')));
      body.appendChild(h('div', { class: 'row' },
        h('a', { class: 'btn btn--primary', href: '#/' }, '继续闯关 →'),
        h('a', { class: 'btn btn--ghost', href: '#/wrong' }, '看看错题本')));
      return;
    }

    body.appendChild(h('div', { class: 'rev-summary' },
      h('p', { class: 'rev-summary__lead' },
        '现在有 ', h('b', null, String(queue.length)), ' 道题到期',
        queue.length < dueIds.length
          ? '（另有 ' + (dueIds.length - queue.length) + ' 道排在后面）'
          : '',
        stats.weak ? '，其中 ' + stats.weak + ' 道是「刚答错 / 不熟」的。' : '。'),
      h('p', { class: 'card__meta' },
        '答对 → 下次隔得更久；答错 → 5 分钟后再来一次。复习不影响闯关进度与测验成绩。')));

    const startBtn = h('button', { class: 'btn btn--primary', type: 'button' }, '开始复习（' + queue.length + ' 题）');
    startBtn.addEventListener('click', () => renderSession(queue));
    body.appendChild(h('div', { class: 'row' }, startBtn,
      h('a', { class: 'btn btn--ghost', href: '#/' }, '先不复习')));
  }

  function renderSession(queue) {
    const results = new Array(queue.length).fill(null);
    const list = h('div', { class: 'drill-list' });
    const progress = h('span', { class: 'rev-progress', 'aria-live': 'polite' });
    const doneEl = h('div', { class: 'callout', hidden: true });

    function refreshProgress() {
      const answered = results.filter((r) => r !== null).length;
      const right = results.filter((r) => r === true).length;
      progress.textContent = '进度 ' + answered + ' / ' + queue.length
        + (answered ? '（答对 ' + right + ' 道）' : '');
      if (answered < queue.length) return;

      const wrongCount = answered - right;
      doneEl.removeAttribute('hidden');
      doneEl.className = 'callout ' + (wrongCount ? 'callout--warn' : 'callout--ok');
      doneEl.replaceChildren(
        h('strong', null, wrongCount ? '这一轮答对 ' + right + ' / ' + answered + ' 道。' : '这一轮全部答对。'),
        h('span', null, wrongCount
          ? ' 答错的 ' + wrongCount + ' 道 5 分钟后会再排进来（也留在错题本里）。'
          : ' 下一批会隔得更久 —— 记忆曲线就是这样把熟悉的题慢慢推远。'));
      const back = h('button', { class: 'btn btn--primary', type: 'button' }, '回到复习首页');
      back.addEventListener('click', renderStart);
      doneEl.appendChild(back);
    }

    queue.forEach((row, i) => {
      const origin = h('div', { class: 'rev-origin' },
        h('span', { class: 'rev-origin__where' }, row.q.levelLabel),
        h('span', { class: 'rev-origin__box' }, boxLabel(row.box)),
        h('span', { class: 'rev-origin__due' }, row.overdue > 0 ? agoText(row.overdue) : '刚到复习时间'),
        h('a', {
          class: 'rev-origin__link',
          href: router.buildUrl(row.q.ch, row.q.sec, row.q.stageNo),
        }, '回原关看讲解 →'));

      const rec = createQuizItem(row.q.item, {
        origin,
        onResult: (ok, picked) => {
          results[i] = ok;
          // 复习模式不改测验得分、不写关卡进度，只走统一记账（复习台账 + 错题本）。
          store.recordAnswer({ ch: row.q.ch, sec: row.q.sec, n: row.q.index + 1,
                               item: row.q.item, ok, picked });
          refreshProgress();
        },
      });
      list.appendChild(rec.node);
    });

    body.replaceChildren(
      h('div', { class: 'row' }, progress,
        h('span', { style: { flex: '1 1 auto' } }),
        (() => {
          const b = h('button', { class: 'btn btn--sm', type: 'button' }, '结束本轮');
          b.addEventListener('click', renderStart);
          return b;
        })()),
      list,
      doneEl
    );
    refreshProgress();
  }

  renderStart();
  return { node: h('div', { class: 'stack' }, head, body), destroy() {} };
}

export default renderReview;
