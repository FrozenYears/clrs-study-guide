// heap.js — 堆可视化引擎（数组 + 二叉树双视图，纯 SVG，render 幂等）
// 契约：开发规范 4.4  create(container, opts) -> { render(frame), resize(), destroy() }
//
// 为什么要单独一个引擎（而不是复用 array.js + tree.js）：
//   第 6 章 6.1 的全部内容就是「数组 A[1 : n] 与近似完全二叉树是同一个东西」。
//   分开画两张图，读者反而更难把「下标 i 的左右孩子是 2i、2i+1」这件事对上号。
//   所以这里把**同一个下标**同时画在数组格子和树结点上，高亮两边一起变。
//
// 帧契约（沿用 4.3 的标准字段，只多两个可选字段）：
//   frame.array      number[]        值，1 基显示（array[0] 就是 A[1]）
//   frame.heapSize   number          有效堆范围，默认 array.length；下标 > heapSize 的
//                                    格子和结点画成「堆外」（虚线 + 斜纹），用来表现
//                                    HEAPSORT 里 A.heap-size 递减、元素被「摘出去」的过程
//   frame.highlight  object          标准键：compare/active/move/done/result/violation/visited
//   frame.pointers   object          { i: 3, l: 6, r: 7, largest: 6 }，1 基下标
//   frame.labels     object          可选：{ 6: 'l', 7: 'r' }，给某个下标挂个短标签
//   frame.note       string
//
// 颜色只引用 theme.css 的设计令牌；状态不只靠颜色区分（斜纹 / 边框粗细 / 文字标签）。

const SVGNS = 'http://www.w3.org/2000/svg';

const STATES = {
  idle:      { fill: '--viz-idle',      border: '--bd-1', w: 1.2, hatch: null,    label: '' },
  done:      { fill: '--viz-done',      border: '--bd-0', w: 1.5, hatch: null,    label: '已就位' },
  visited:   { fill: '--viz-mark',      border: '--bd-1', w: 1,   hatch: null,    label: '已访问' },
  compare:   { fill: '--viz-compare',   border: '--bd-0', w: 2,   hatch: 'diag',  label: '比较' },
  move:      { fill: '--viz-move',      border: '--bd-0', w: 2,   hatch: 'cross', label: '交换' },
  active:    { fill: '--viz-active',    border: '--fg-1', w: 3.5, hatch: null,    label: '当前' },
  result:    { fill: '--viz-result',    border: '--bd-0', w: 2,   hatch: null,    label: '结果' },
  violation: { fill: '--viz-violation', border: '--fg-1', w: 3,   hatch: 'cross', label: '违规' },
  offheap:   { fill: '--bg-2',          border: '--bd-0', w: 1,   hatch: 'diag',  label: '堆外' },
};

function el(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

export function create(container, opts = {}) {
  const svg = el('svg', {
    'class': 'viz-heap', role: 'img', 'aria-label': '堆（数组与二叉树对照）',
    preserveAspectRatio: 'xMidYMid meet',
  });
  svg.style.width = '100%';
  svg.style.height = 'auto';
  svg.style.display = 'block';
  svg.style.overflow = 'visible';
  container.appendChild(svg);

  let lastFrame = null;
  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => { if (lastFrame) render(lastFrame); });
    ro.observe(container);
  }

  function defs() {
    const d = el('defs');
    const diag = el('pattern', {
      id: 'heap-hatch-diag', width: '6', height: '6',
      patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)',
    });
    diag.appendChild(el('line', {
      x1: '0', y1: '0', x2: '0', y2: '6',
      style: 'stroke:var(--fg-2);stroke-width:1.3',
    }));
    const cross = el('pattern', { id: 'heap-hatch-cross', width: '7', height: '7', patternUnits: 'userSpaceOnUse' });
    cross.appendChild(el('line', { x1: '0', y1: '0', x2: '7', y2: '7', style: 'stroke:var(--fg-2);stroke-width:1.2' }));
    cross.appendChild(el('line', { x1: '7', y1: '0', x2: '0', y2: '7', style: 'stroke:var(--fg-2);stroke-width:1.2' }));
    d.appendChild(diag); d.appendChild(cross);
    return d;
  }

  /** 下标（1 基）-> 状态名。优先级与 array.js 一致，末尾接「堆外」兜底。 */
  function stateOf(idx, hl, heapSize) {
    if (heapSize != null && idx > heapSize) return 'offheap';
    const has = (k) => Array.isArray(hl[k]) && hl[k].includes(idx);
    if (has('violation')) return 'violation';
    if (has('result')) return 'result';
    if (has('active')) return 'active';
    if (has('move')) return 'move';
    if (has('compare')) return 'compare';
    if (has('done')) return 'done';
    if (has('visited')) return 'visited';
    return 'idle';
  }

  function render(frame) {
    lastFrame = frame;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const arr = frame && Array.isArray(frame.array) ? frame.array : [];
    const n = arr.length;
    if (n === 0) {
      const t = el('text', { x: '8', y: '24', style: 'fill:var(--fg-2);font-size:14px' });
      t.textContent = '（空堆）';
      svg.appendChild(defs()); svg.appendChild(t);
      svg.setAttribute('viewBox', '0 0 200 40');
      return;
    }
    const heapSize = Number.isInteger(frame.heapSize) ? frame.heapSize : n;
    const hl = frame.highlight || {};
    const ptrs = frame.pointers || {};
    const extraLabels = frame.labels || {};

    // ---- 布局常量 ----
    const cellW = 46, cellH = 40, cellGap = 6;
    const nodeW = 42, nodeH = 34, levelH = 78, leafGap = 12;
    const marginX = 14, topPad = 34, stripGap = 30, capH = 34;

    // 树的横向位置：完全二叉树的 DFS 叶槽法（与 tree.js 同一套算法）
    let slot = 0;
    const pos = new Array(n + 1);
    const depthOf = new Array(n + 1);
    (function visit(i, depth) {
      if (i > n) return;
      depthOf[i] = depth;
      const l = 2 * i, r = 2 * i + 1;
      if (l > n) {
        pos[i] = slot++;
        return;
      }
      visit(l, depth + 1);
      if (r <= n) visit(r, depth + 1);
      const kids = r <= n ? [l, r] : [l];
      pos[i] = (pos[kids[0]] + pos[kids[kids.length - 1]]) / 2;
    })(1, 0);
    const maxDepth = Math.max(...depthOf.slice(1));
    const slots = slot;

    const stripW = n * cellW + (n - 1) * cellGap;
    const treeW = slots * (nodeW + leafGap) - leafGap;
    const totalW = marginX * 2 + Math.max(stripW, treeW, 260);
    const stripX = marginX + (Math.max(stripW, treeW) - stripW) / 2;
    const treeX = marginX + (Math.max(stripW, treeW) - treeW) / 2;
    const treeTop = topPad + cellH + 34 + stripGap;
    const totalH = treeTop + (maxDepth + 1) * levelH + capH;
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
    svg.appendChild(defs());

    const cx = (i) => treeX + pos[i] * (nodeW + leafGap) + nodeW / 2;
    const cyTop = (i) => treeTop + depthOf[i] * levelH;
    const cyBot = (i) => cyTop(i) + nodeH;

    // ---- 数组条 ----
    const cap0 = el('text', {
      x: String(marginX), y: String(topPad - 14),
      style: 'fill:var(--fg-1);font:12px var(--font-sans)',
    });
    cap0.textContent = `A[1 : ${n}]  ${heapSize < n ? `，A.heap-size = ${heapSize}` : ''}`;
    svg.appendChild(cap0);

    for (let i = 1; i <= n; i++) {
      const x = stripX + (i - 1) * (cellW + cellGap);
      const st = STATES[stateOf(i, hl, heapSize)];
      const rect = el('rect', { x: String(x), y: String(topPad), width: String(cellW), height: String(cellH), rx: '0' });
      rect.style.fill = `var(${st.fill})`;
      rect.style.stroke = `var(${st.border})`;
      rect.style.strokeWidth = String(st.w);
      if (st === STATES.offheap) rect.style.strokeDasharray = '4 3';
      svg.appendChild(rect);
      if (st.hatch) {
        svg.appendChild(el('rect', {
          x: String(x), y: String(topPad), width: String(cellW), height: String(cellH),
          fill: `url(#heap-hatch-${st.hatch})`,
        }));
      }
      // 下标（在上方，与 Figure 6.1 一致）
      const idx = el('text', {
        x: String(x + cellW / 2), y: String(topPad - 4), 'text-anchor': 'middle',
        style: 'fill:var(--fg-2);font:11px var(--font-mono)',
      });
      idx.textContent = String(i);
      svg.appendChild(idx);
      // 值
      const val = el('text', {
        x: String(x + cellW / 2), y: String(topPad + cellH / 2 + 5), 'text-anchor': 'middle',
        style: `fill:var(--fg-0);font:bold 14px var(--font-mono)`,
      });
      val.textContent = String(arr[i - 1]);
      svg.appendChild(val);
      // 状态文字标签（非颜色通道）
      if (st.label) {
        const lab = el('text', {
          x: String(x + cellW / 2), y: String(topPad + cellH + 14), 'text-anchor': 'middle',
          style: 'fill:var(--fg-1);font:10px var(--font-sans)',
        });
        lab.textContent = st.label;
        svg.appendChild(lab);
      }
    }

    // 指针（在数组条下方，1 基）
    const ptrKeys = Object.keys(ptrs).filter((k) => Number.isInteger(ptrs[k]) && ptrs[k] >= 1 && ptrs[k] <= n);
    ptrKeys.forEach((k, pi) => {
      const v = ptrs[k];
      const px = stripX + (v - 1) * (cellW + cellGap) + cellW / 2;
      const py = topPad + cellH + 26 + pi * 13;
      const tri = el('path', { d: `M ${px - 5} ${py} L ${px + 5} ${py} L ${px} ${py - 8} Z` });
      tri.style.fill = 'var(--fg-1)';
      svg.appendChild(tri);
      const t = el('text', {
        x: String(px), y: String(py + 13), 'text-anchor': 'middle',
        style: 'fill:var(--fg-1);font:bold 11px var(--font-mono)',
      });
      t.textContent = k;
      svg.appendChild(t);
    });

    // ---- 树 ----
    for (let i = 2; i <= n; i++) {
      const p = Math.floor(i / 2);
      const line = el('path', {
        d: `M ${cx(p)} ${cyBot(p)} C ${cx(p)} ${cyBot(p) + 22}, ${cx(i)} ${cyTop(i) - 22}, ${cx(i)} ${cyTop(i)}`,
        style: 'fill:none;stroke:var(--bd-1);stroke-width:1.4',
      });
      svg.appendChild(line);
    }

    for (let i = 1; i <= n; i++) {
      const st = STATES[stateOf(i, hl, heapSize)];
      const r = el('rect', {
        x: String(cx(i) - nodeW / 2), y: String(cyTop(i)),
        width: String(nodeW), height: String(nodeH), rx: '0',
      });
      r.style.fill = `var(${st.fill})`;
      r.style.stroke = `var(${st.border})`;
      r.style.strokeWidth = String(st.w);
      if (st === STATES.offheap) r.style.strokeDasharray = '4 3';
      svg.appendChild(r);
      if (st.hatch) {
        svg.appendChild(el('rect', {
          x: String(cx(i) - nodeW / 2), y: String(cyTop(i)), width: String(nodeW), height: String(nodeH),
          fill: `url(#heap-hatch-${st.hatch})`,
        }));
      }
      const idx = el('text', {
        x: String(cx(i)), y: String(cyTop(i) - 5), 'text-anchor': 'middle',
        style: 'fill:var(--fg-2);font:11px var(--font-mono)',
      });
      idx.textContent = String(i);
      svg.appendChild(idx);

      const val = el('text', {
        x: String(cx(i)), y: String(cyTop(i) + nodeH / 2 + 5), 'text-anchor': 'middle',
        style: 'fill:var(--fg-0);font:bold 14px var(--font-mono)',
      });
      val.textContent = String(arr[i - 1]);
      svg.appendChild(val);

      // 指针名（i / l / r / largest）挂在结点下方，与数组条上的箭头互相印证
      const names = ptrKeys.filter((k) => ptrs[k] === i);
      const tags = names.concat(extraLabels[i] ? [extraLabels[i]] : []);
      if (tags.length) {
        const t = el('text', {
          x: String(cx(i)), y: String(cyBot(i) + 15), 'text-anchor': 'middle',
          style: 'fill:var(--fg-1);font:bold 11px var(--font-mono)',
        });
        t.textContent = tags.join(' / ');
        svg.appendChild(t);
      }
    }

    // ---- 底部说明 ----
    if (frame.note) {
      const cap = el('text', {
        x: String(totalW / 2), y: String(totalH - 8), 'text-anchor': 'middle',
        style: 'fill:var(--fg-1);font:13px var(--font-sans)',
      });
      cap.textContent = frame.note;
      svg.appendChild(cap);
    }

    const corner = el('text', {
      x: String(totalW - marginX), y: String(topPad - 14), 'text-anchor': 'end',
      style: 'fill:var(--fg-2);font:10px var(--font-sans)',
    });
    corner.textContent = '下标从 1 开始 · C 实现从 0 开始';
    svg.appendChild(corner);
  }

  function resize() { if (lastFrame) render(lastFrame); }
  function destroy() { if (ro) ro.disconnect(); if (svg.parentNode) svg.parentNode.removeChild(svg); lastFrame = null; }

  return { render, resize, destroy };
}
