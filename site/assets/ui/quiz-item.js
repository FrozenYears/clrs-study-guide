/* =============================================================================
 * ui/quiz-item.js — 单题的渲染 + 判分（闯关测验与复习模式共用）
 *
 * 为什么抽出来：复习模式（#/review）要重新问「同一道题」，如果它自己再写一份
 * 判分逻辑，就会出现两套答案比对、两套选项乱序、两套 ** 剥离 —— 迟早不一致，
 * 而不一致的判分是学习站最不能出的错。所以「怎么问、怎么判」只有这一份实现，
 * 两个页面只决定「判完之后做什么」。
 *
 * 契约：
 *   createQuizItem(item, opts) -> { node }
 *   opts.index  题序（可选，用于无障碍标签）
 *   opts.origin 题源（可选 Node，渲染在题干上方；复习模式用它标出这是哪一关的题）
 *   opts.onResult(ok, picked) 作答后回调一次（同一题只会回调一次）
 *
 * 判分口径与关卡数据约定一致（作者本地《开发规范》4.2）：
 *   - 正确项在数据里用 **…** 包着，渲染前必须剥掉，否则等于作答前标出答案；
 *   - 单选题展示顺序按题干确定性洗牌（core/quiz-order.js），防「闭眼选第二个」。
 * ========================================================================== */

import { h } from '../core/dom.js';
import * as katex from '../core/katex.js';
import { optionOrder } from '../core/quiz-order.js';

/** 剥掉作者标记（**…**）：它是给写内容的人看的，不是给读者的。 */
export function stripMarks(s) {
  return typeof s === 'string' ? s.replace(/\*\*/g, '') : s;
}

/**
 * 构造一道题的 DOM，并负责判分。
 * @returns {{node: HTMLElement}}
 */
export function createQuizItem(item, opts = {}) {
  const onResult = typeof opts.onResult === 'function' ? opts.onResult : () => {};
  let answered = false;

  const why = item.why
    ? h('p', { class: 'quiz__why', hidden: true }, katex.renderMixed(item.why))
    : null;

  function settle(ok, picked, els) {
    if (answered) return;
    answered = true;
    (els || []).forEach((b) => { b.disabled = true; });
    if (why) {
      why.removeAttribute('hidden');
      why.dataset.ok = ok ? '1' : '0';
    }
    onResult(ok, picked);
  }

  let body;

  if (item.kind === 'judge') {
    const pairs = [['对', true], ['错', false]];
    const btns = pairs.map(([label, val], bi) =>
      h('button', {
        class: 'quiz__opt', type: 'button', role: 'radio',
        onClick: () => {
          const ok = item.answer === val;
          settle(ok, label, btns);
          // 标出正确答案与本选项的对错 —— 必须在 settle 之后做，settle 只管回调。
          btns.forEach((b, k) => {
            if (pairs[k][1] === item.answer) b.classList.add('is-correct');
            if (k === bi && !ok) b.classList.add('is-wrong');
          });
        },
      }, label));
    body = h('div', { class: 'quiz__options' }, btns);
  } else if (item.kind === 'single') {
    const opts_ = item.options || [];
    const order = optionOrder(item.q, opts_.length);
    const btns = order.map((src, pos) =>
      h('button', {
        class: 'quiz__opt', type: 'button', role: 'radio',
        onClick: () => {
          const ok = src === item.answer;
          settle(ok, stripMarks(opts_[src]), btns);
          btns.forEach((b, k) => {
            if (order[k] === item.answer) b.classList.add('is-correct');
            if (k === pos && !ok) b.classList.add('is-wrong');
          });
        },
      }, katex.renderMixed(stripMarks(opts_[src]))));
    body = h('div', { class: 'quiz__options' }, btns);
  } else if (item.kind === 'simulate') {
    const inp = h('input', {
      class: 'drill-input', type: 'text', 'aria-label': '你的答案',
      placeholder: item.placeholder || '例如：2 4 5 6 1 3',
    });
    const check = h('button', {
      class: 'btn btn--sm', type: 'button',
      onClick: () => {
        const got = inp.value.trim().split(/[\s,，]+/).filter(Boolean).map(Number);
        const exp = (item.expect || []).map(Number);
        const ok = got.length === exp.length && got.every((v, k) => v === exp[k]);
        settle(ok, inp.value.trim(), [check, inp]);
      },
    }, '检查');
    body = h('div', { class: 'row' }, inp, check);
  } else {
    body = h('p', { class: 'card__meta' }, '（题型 ' + item.kind + ' 暂无渲染器）');
  }

  const node = h('div', { class: 'quiz' },
    opts.origin || null,
    h('div', { class: 'quiz__q' }, katex.renderMixed(item.q)),
    body,
    why
  );

  return { node };
}

export default { createQuizItem, stripMarks };
