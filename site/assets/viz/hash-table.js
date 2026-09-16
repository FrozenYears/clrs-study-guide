// hash-table.js — 散列表引擎（纯 SVG，render 幂等）
// 契约：开发规范 4.4  create(container, opts) -> { render(frame), resize(), destroy() }
// 用途：第 11 章（直接寻址表、链接法散列、开放寻址、实践考虑）。
//
// 数据形态（帧）：
//   frame = {
//     slots: [ { i, chain: [ {key, state?}, ... ], state? , label? } ],  // 槽位（按 i 升序给出要显示的）
//     m: 12,                    // 表长（用于显示 T[0 : m−1] 的说明；slots 可以只给一部分）
//     mode: 'chained' | 'open', // chained：槽位右侧画链；open：槽位内直接放 key
//     pointers: { i: k, q: k }, // 命名指针，指向**槽位下标**（画在槽位左侧）
//     highlight: { active: [i], compare: [i], done: [i] },
//     note: '一句话说明',
//     phase: 'HASH-INSERT' 等
//   }

const SVGNS = 'http://www.w3.org/2000/svg';

const SLOT_STATES = {
  idle:      { fill: '--viz-idle',      border: '--bd-1', w: 1 },
  active:    { fill: '--viz-active',    border: '--fg-1', w: 2 },
  compare:   { fill: '--viz-compare',   border: '--bd-0', w: 1 },
  done:      { fill: '--viz-done',      border: '--bd-0', w: 1 },
  result:    { fill: '--viz-result',    border: '--bd-0', w: 1 },
  violation: { fill: '--viz-violation', border: '--fg-1', w: 2 },
};

function token(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function el(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

export function create(container, opts = {}) {
  const svg = el('svg', { 'class': 'viz-hash', role: 'img', 'aria-label': '散列表',
                          preserveAspectRatio: 'xMidYMid meet' });
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

  const SLOT_W = 62, SLOT_H = 30, SLOT_GAP = 8;      // 槽位尺寸（左侧一列）
  const NODE_W = 54, NODE_H = 26, NODE_GAP = 26;     // 链节点尺寸
  const LEFT = 74, TOP = 30, BOTTOM = 40;

  function render(frame) {
    lastFrame = frame;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const slots = (frame && frame.slots) || [];
    if (slots.length === 0) {
      svg.setAttribute('viewBox', '0 0 480 120');
      const t = el('text', { x: '16', y: '60', style: 'fill:var(--fg-2);font:13px var(--font-sans)' });
      t.textContent = '（没有槽位可显示）';
      svg.appendChild(t);
      return;
    }

    const m = frame.m || slots.length;
    const mode = frame.mode === 'open' ? 'open' : 'chained';
    const hl = frame.highlight || {};
    const textColor = token('--fg-1', '#e8e8e8');
    const dimColor = token('--fg-3', '#6a6a6a');
    const chainColor = token('--fg-2', '#8a8a8a');

    const stateOf = (s) => {
      if (Array.isArray(hl.active) && hl.active.includes(s.i)) return 'active';
      if (Array.isArray(hl.compare) && hl.compare.includes(s.i)) return 'compare';
      if (Array.isArray(hl.done) && hl.done.includes(s.i)) return 'done';
      return s.state || 'idle';
    };

    // 宽度：最长的链决定
    let maxChain = 0;
    for (const s of slots) { maxChain = Math.max(maxChain, (s.chain || []).length); }
    const chainW = mode === 'chained' ? maxChain * (NODE_W + NODE_GAP) + 40 : 0;
    const totalW = LEFT + SLOT_W + 24 + chainW + 40;
    const totalH = TOP + slots.length * (SLOT_H + SLOT_GAP) + BOTTOM;
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);

    const defs = el('defs');
    const mk = (id, color) => {
      const marker = el('marker', { id, viewBox: '0 0 10 10', refX: '9', refY: '5',
                                    markerWidth: '6', markerHeight: '6', orient: 'auto' });
      const p = el('path', { d: 'M 0 0 L 10 5 L 0 10 z' });
      p.setAttribute('fill', color);
      marker.appendChild(p);
      defs.appendChild(marker);
    };
    mk('ht-arrow', chainColor);
    svg.appendChild(defs);

    // 槽位的位置（按数组下标算 y，使"第 i 个槽在固定的高度"）
    const yOf = (idx) => TOP + idx * (SLOT_H + SLOT_GAP);

    slots.forEach((slot) => {
      const y = yOf(slots.indexOf(slot));
      const st = SLOT_STATES[stateOf(slot)] || SLOT_STATES.idle;

      // 下标标签
      const idx = el('text', {
        x: String(LEFT - 12), y: String(y + SLOT_H / 2 + 5), 'text-anchor': 'end',
        style: 'fill:' + dimColor + ';font:12px var(--font-mono)',
      });
      idx.textContent = String(slot.i);
      svg.appendChild(idx);

      // 槽位框
      const rect = el('rect', {
        x: String(LEFT), y: String(y), width: String(SLOT_W), height: String(SLOT_H), rx: '2',
      });
      rect.setAttribute('fill', token(st.fill, '#2a2a2a'));
      rect.setAttribute('stroke', token(st.border, '#666'));
      rect.setAttribute('stroke-width', String(st.w));
      svg.appendChild(rect);

      if (mode === 'open') {
        // 开放寻址：槽里直接放 key（或空）
        const k = slot.chain && slot.chain[0] ? slot.chain[0].key : null;
        const t = el('text', {
          x: String(LEFT + SLOT_W / 2), y: String(y + SLOT_H / 2 + 5), 'text-anchor': 'middle',
          style: 'fill:' + (k == null ? dimColor : textColor) + ';font:' + (k == null ? '' : 'bold ') + '14px var(--font-mono)',
        });
        t.textContent = k == null ? 'NIL' : String(k);
        svg.appendChild(t);
        return;
      }

      // 链接法：槽里画一个头指针方块的"链头"，右侧串节点
      const headT = el('text', {
        x: String(LEFT + SLOT_W / 2), y: String(y + SLOT_H / 2 + 5), 'text-anchor': 'middle',
        style: 'fill:' + dimColor + ';font:italic 11px var(--font-mono)',
      });
      headT.textContent = (slot.chain && slot.chain.length) ? '•' : 'NIL';
      svg.appendChild(headT);

      const chain = slot.chain || [];
      let x = LEFT + SLOT_W;
      chain.forEach((node, ci) => {
        // 箭头
        const ax1 = (ci === 0) ? x : x + NODE_GAP - 22;
        const yMid = y + SLOT_H / 2;
        if (ci === 0) {
          svg.appendChild(el('line', {
            x1: String(x), y1: String(yMid), x2: String(x + NODE_GAP - 22), y2: String(yMid),
            stroke: chainColor, 'stroke-width': '1.25', 'marker-end': 'url(#ht-arrow)',
          }));
        } else {
          svg.appendChild(el('line', {
            x1: String(ax1), y1: String(yMid), x2: String(ax1 + NODE_GAP - 22), y2: String(yMid),
            stroke: chainColor, 'stroke-width': '1.25', 'marker-end': 'url(#ht-arrow)',
          }));
        }
        const nx = (ci === 0) ? x + NODE_GAP - 18 : x + 4 + NODE_GAP - 18;
        const nst = SLOT_STATES[node.state] || SLOT_STATES.idle;
        const nrect = el('rect', {
          x: String(nx), y: String(y + SLOT_H / 2 - NODE_H / 2), width: String(NODE_W), height: String(NODE_H), rx: '2',
        });
        nrect.setAttribute('fill', token(nst.fill, '#2a2a2a'));
        nrect.setAttribute('stroke', token(nst.border, '#666'));
        nrect.setAttribute('stroke-width', String(nst.w));
        svg.appendChild(nrect);
        const nt = el('text', {
          x: String(nx + NODE_W / 2), y: String(y + SLOT_H / 2 + 5), 'text-anchor': 'middle',
          style: 'fill:' + textColor + ';font:bold 13px var(--font-mono)',
        });
        nt.textContent = String(node.key);
        svg.appendChild(nt);
        x = nx + NODE_W;
      });
    });

    // 命名指针（指向槽位下标）
    const ptrs = frame.pointers || {};
    Object.keys(ptrs).forEach((name, pi) => {
      const idxTarget = ptrs[name];
      const slotIdx = slots.findIndex((s) => s.i === idxTarget);
      if (slotIdx < 0) return;
      const y = yOf(slotIdx) + SLOT_H / 2;
      const x = LEFT - 30 - pi * 22;
      const tri = el('path', { d: `M ${x - 6} ${y} L ${x + 6} ${y} L ${x + 11} ${y - 1} Z` });
      tri.setAttribute('fill', textColor);
      svg.appendChild(tri);
      const t = el('text', {
        x: String(x), y: String(y + 12), 'text-anchor': 'middle',
        style: 'fill:' + textColor + ';font:bold 11px var(--font-mono)',
      });
      t.textContent = name;
      svg.appendChild(t);
    });

    // 表长说明 + 阶段
    const meta = el('text', {
      x: String(totalW - 8), y: '16', 'text-anchor': 'end',
      style: 'fill:' + dimColor + ';font:11px var(--font-sans)',
    });
    meta.textContent = `T[0 : ${m - 1}]` + (mode === 'open' ? ' · 开放寻址' : ' · 链接法');
    svg.appendChild(meta);
    if (frame.phase) {
      const t = el('text', { x: '8', y: '16', style: 'fill:' + dimColor + ';font:11px var(--font-sans)' });
      t.textContent = String(frame.phase);
      svg.appendChild(t);
    }

    if (frame.note) {
      const t = el('text', {
        x: String(totalW / 2), y: String(totalH - 10), 'text-anchor': 'middle',
        style: 'fill:' + textColor + ';font:13px var(--font-sans)',
      });
      t.textContent = String(frame.note);
      svg.appendChild(t);
    }
  }

  function resize() { if (lastFrame) render(lastFrame); }
  function destroy() {
    if (ro) ro.disconnect();
    if (svg.parentNode) svg.parentNode.removeChild(svg);
    lastFrame = null;
  }

  return { render, resize, destroy };
}
