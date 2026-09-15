/* 2×2 矩阵乘法可视化：显示当前行、列、k 和部分和。 */
import { h } from '../core/dom.js';

function cell(value, active) {
  return h('span', { class: 'matrix-product__cell', dataset: { active: active ? '1' : '0' } }, String(value));
}

function matrix(name, values, activeRow = -1, activeColumn = -1, mode = '') {
  const cells = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const active = mode === 'a'
        ? i === activeRow && (activeColumn < 0 || j === activeColumn)
        : mode === 'b'
          ? j === activeColumn && (activeRow < 0 || i === activeRow)
          : i === activeRow && j === activeColumn;
      cells.push(cell(values[i][j], active));
    }
  }
  return h('section', { class: 'matrix-product__matrix' },
    h('h4', null, name),
    h('div', { class: 'matrix-product__grid', role: 'grid', 'aria-label': name + ' 矩阵' }, cells));
}

export function create(container) {
  let frame = null;
  function render(next = {}) {
    frame = next;
    const i = Number.isInteger(frame.i) ? frame.i : -1;
    const j = Number.isInteger(frame.j) ? frame.j : -1;
    const k = Number.isInteger(frame.k) ? frame.k : -1;
    const a = frame.a || [[0, 0], [0, 0]];
    const b = frame.b || [[0, 0], [0, 0]];
    const c = frame.c || [[0, 0], [0, 0]];
    const operation = frame.product == null
      ? '等待选择一个 cᵢⱼ'
      : `a${i + 1}${k + 1} × b${k + 1}${j + 1} = ${frame.product}；部分和 ${frame.partial}`;

    container.replaceChildren(h('div', { class: 'matrix-product' },
      h('div', { class: 'matrix-product__matrices', role: 'img', 'aria-label': '三重循环矩阵乘法动画' },
        matrix('A', a, i, k, 'a'),
        h('span', { class: 'matrix-product__operator' }, '×'),
        matrix('B', b, k, j, 'b'),
        h('span', { class: 'matrix-product__operator' }, '→'),
        matrix('C', c, i, j, 'c')),
      h('p', { class: 'matrix-product__formula', 'aria-live': 'polite' }, operation),
      h('div', { class: 'matrix-product__status' },
        h('span', { class: 'badge' }, `i = ${i >= 0 && i < 2 ? i + 1 : '—'}`),
        h('span', { class: 'badge' }, `j = ${j >= 0 && j < 2 ? j + 1 : '—'}`),
        h('span', { class: 'badge' }, `k = ${k >= 0 && k < 2 ? k + 1 : '—'}`),
        h('span', { class: 'badge badge--done' }, `乘法 ${frame.counts?.mul || 0} 次`))));
  }
  function resize() { if (frame) render(frame); }
  function destroy() { container.replaceChildren(); frame = null; }
  return { render, resize, destroy };
}
