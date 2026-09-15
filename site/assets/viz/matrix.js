/* Strassen 的块矩阵可视化。只画教学状态；播放控制统一交给 stepper。 */
import { h } from '../core/dom.js';
import { strassenOperations } from '../algorithms/strassen-demo.js';

function block(name, active) {
  return h('span', { class: 'matrix-viz__cell', dataset: { active: active ? '1' : '0' } }, name);
}

function matrix(name, active) {
  return h('section', { class: 'matrix-viz__matrix' },
    h('h4', null, name),
    h('div', { class: 'matrix-viz__grid' },
      block(name + '₁₁', active), block(name + '₁₂', active),
      block(name + '₂₁', active), block(name + '₂₂', active)));
}

function ledger(title, items, phase, activeIndex) {
  return h('section', { class: 'matrix-viz__ledger' },
    h('h4', null, title),
    h('ol', null, items.map((item, index) => h('li', {
      dataset: { active: phase === title.toLowerCase() && index === activeIndex ? '1' : '0' },
    }, item))));
}

export function create(container) {
  let frame = null;
  function render(next = {}) {
    frame = next;
    const phase = frame.phase || 'split';
    const active = phase !== 'done';
    container.replaceChildren(h('div', { class: 'matrix-viz' },
      h('div', { class: 'matrix-viz__matrices', role: 'img', 'aria-label': 'Strassen 算法的 A、B、C 块矩阵' },
        matrix('A', active), h('span', { class: 'matrix-viz__operator' }, '×'), matrix('B', active),
        h('span', { class: 'matrix-viz__operator' }, '→'), matrix('C', phase === 'combine' || phase === 'done')),
      h('p', { class: 'matrix-viz__formula', 'aria-live': 'polite' }, frame.formula || '将三个 n×n 矩阵分成四个 n/2×n/2 块。'),
      h('div', { class: 'matrix-viz__ledgers' },
        ledger('S', strassenOperations.S, phase, frame.index),
        ledger('P', strassenOperations.P, phase, frame.index))));
  }
  function resize() { if (frame) render(frame); }
  function destroy() { container.replaceChildren(); frame = null; }
  return { render, resize, destroy };
}
