// linked-list.js — 链表引擎（纯 SVG，render 幂等）
// 契约：开发规范 4.4  create(container, opts) -> { render(frame), resize(), destroy() }
// 用途：第 10.2 节双向链表、哨兵链表、10.3 的链表表示。
//
// 数据形态（帧）：
//   frame = {
//     nodes: [ { id, key, next, prev, state? } ],   // next/prev 是节点 id 或 null(=NIL)
//     order: [id, ...],                              // 可选：显式给出链上的排列顺序
//     sentinelId: id|null,                           // 可选：哨兵节点 id（画蓝色）
//     pointers: { head: id, x: id, y: id, ... },     // 可选：命名的指针，画在节点上方
//     highlight: { active: [id], compare: [id], done: [id] },  // 可选
//     note: '一句话说明',
//     phase: 'PUSH' 等阶段标注（显示在左上角）
//   }
//
// 颜色只引用设计令牌；next 用实线、prev 用虚线区分方向。

const SVGNS = 'http://www.w3.org/2000/svg';

const NODE_STATES = {
  idle:      { fill: '--viz-idle',      border: '--bd-1', w: 1 },
  active:    { fill: '--viz-active',    border: '--fg-1', w: 2 },
  compare:   { fill: '--viz-compare',   border: '--bd-0', w: 1 },
  done:      { fill: '--viz-done',      border: '--bd-0', w: 1 },
  result:    { fill: '--viz-result',    border: '--bd-0', w: 1 },
  violation: { fill: '--viz-violation', border: '--fg-1', w: 2 },
};

// 读设计令牌的实际颜色（viz 引擎统一做法：令牌缺失时退回中性色）
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
  const svg = el('svg', { 'class': 'viz-linked', role: 'img', 'aria-label': '链表',
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

  const NODE_W = 92, NODE_H = 62, GAP = 54, PAD = 56, TOP = 54, BOTTOM = 40;

  function render(frame) {
    lastFrame = frame;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!frame || !Array.isArray(frame.nodes) || frame.nodes.length === 0) {
      svg.setAttribute('viewBox', '0 0 480 120');
      const t = el('text', { x: '16', y: '60', style: 'fill:var(--fg-2);font:13px var(--font-sans)' });
      t.textContent = '（没有节点可显示）';
      svg.appendChild(t);
      return;
    }

    const nodes = frame.nodes;
    const byId = new Map(nodes.map((n) => [n.id, n]));

    // ---- 链上顺序：优先用 frame.order，否则沿 next 从 head/sentinel 走 ----
    let order = Array.isArray(frame.order) ? frame.order.filter((id) => byId.has(id)) : null;
    if (!order) {
      const startId = frame.sentinelId != null ? frame.sentinelId
        : (frame.pointers && frame.pointers.head != null ? frame.pointers.head : nodes[0].id);
      order = [];
      const seen = new Set();
      let cur = startId;
      while (cur != null && byId.has(cur) && !seen.has(cur) && order.length <= nodes.length) {
        order.push(cur); seen.add(cur);
        const nx = byId.get(cur).next;
        cur = nx == null ? null : nx;
      }
      // 没走到的节点（游离的）补在后面，保证都画出来
      for (const n of nodes) { if (!seen.has(n.id)) { order.push(n.id); seen.add(n.id); } }
    }

    const hl = frame.highlight || {};
    const stateOf = (node) => {
      if (Array.isArray(hl.active) && hl.active.includes(node.id)) return 'active';
      if (Array.isArray(hl.compare) && hl.compare.includes(node.id)) return 'compare';
      if (Array.isArray(hl.done) && hl.done.includes(node.id)) return 'done';
      if (node.state) return node.state;
      if (frame.sentinelId != null && node.id === frame.sentinelId) return 'result';
      return 'idle';
    };

    // ---- 布局：水平排布 ----
    const n = order.length;
    const totalW = PAD * 2 + n * NODE_W + (n - 1) * GAP;
    const totalH = TOP + NODE_H + BOTTOM;
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
    const COL = { idle: '--fg-1', hover: '--fg-1' };
    const lineColor = token('--fg-2', '#8a8a8a');
    const textColor = token('--fg-1', '#e8e8e8');
    const dimColor = token('--fg-3', '#6a6a6a');
    const nilColor = token('--fg-2', '#8a8a8a');

    const posX = new Map();
    order.forEach((id, i) => posX.set(id, PAD + i * (NODE_W + GAP)));

    // ---- 节点框 ----
    order.forEach((id) => {
      const node = byId.get(id);
      const x = posX.get(id);
      const stName = stateOf(node);
      const st = NODE_STATES[stName] || NODE_STATES.idle;
      const rect = el('rect', {
        x: String(x), y: String(TOP), width: String(NODE_W), height: String(NODE_H), rx: '4',
      });
      rect.setAttribute('fill', token(st.fill, '#2a2a2a'));
      rect.setAttribute('stroke', token(st.border, '#666'));
      rect.setAttribute('stroke-width', String(st.w));
      svg.appendChild(rect);

      // key（居中）
      const key = el('text', {
        x: String(x + NODE_W / 2), y: String(TOP + 26), 'text-anchor': 'middle',
        style: 'fill:' + textColor + ';font:bold 15px var(--font-mono)',
      });
      key.textContent = node.key === undefined || node.key === null ? '∅' : String(node.key);
      svg.appendChild(key);

      // 分隔线（key 与指针区之间）
      svg.appendChild(el('line', {
        x1: String(x), y1: String(TOP + 34), x2: String(x + NODE_W), y2: String(TOP + 34),
        stroke: token('--bd-1', '#555'), 'stroke-width': '1',
      }));

      // prev / next 文字
      const prevT = el('text', {
        x: String(x + 8), y: String(TOP + 52),
        style: 'fill:' + dimColor + ';font:11px var(--font-mono)',
      });
      const nx = node.next == null ? 'NIL' : String(node.next);
      const pv = node.prev == null ? 'NIL' : String(node.prev);
      prevT.textContent = '←' + pv;
      svg.appendChild(prevT);
      const nextT = el('text', {
        x: String(x + NODE_W - 8), y: String(TOP + 52), 'text-anchor': 'end',
        style: 'fill:' + dimColor + ';font:11px var(--font-mono)',
      });
      nextT.textContent = nx + '→';
      svg.appendChild(nextT);
    });

    // ---- next 箭头（上方实线）与 prev 箭头（下方虚线）----
    const arrowDefs = el('defs');
    const mk = (id, color) => {
      const marker = el('marker', {
        id, viewBox: '0 0 10 10', refX: '9', refY: '5',
        markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse',
      });
      const path = el('path', { d: 'M 0 0 L 10 5 L 0 10 z' });
      path.setAttribute('fill', color);
      marker.appendChild(path);
      arrowDefs.appendChild(marker);
    };
    mk('ll-next-arrow', lineColor);
    mk('ll-prev-arrow', dimColor);
    svg.appendChild(arrowDefs);

    order.forEach((id, i) => {
      const node = byId.get(id);
      const x = posX.get(id);
      const yMid = TOP + NODE_H / 2;
      const yUp = TOP - 16;
      const yDown = TOP + NODE_H + 18;

      // next：指向链上的下一个节点（按 order 相邻），或 NIL 标记
      const nextId = node.next;
      const nextOnChain = i + 1 < order.length ? order[i + 1] : null;
      if (nextId != null && nextOnChain === nextId) {
        const x2 = posX.get(nextId);
        svg.appendChild(el('line', {
          x1: String(x + NODE_W / 2), y1: String(yUp),
          x2: String(x2 + NODE_W / 2), y2: String(yUp),
          stroke: lineColor, 'stroke-width': '1.25', 'marker-end': 'url(#ll-next-arrow)',
        }));
      } else if (nextId == null) {
        // NIL 端
        const t = el('text', {
          x: String(x + NODE_W + 8), y: String(yMid + 4),
          style: 'fill:' + nilColor + ';font:italic 12px var(--font-mono)',
        });
        t.textContent = 'NIL';
        svg.appendChild(t);
        svg.appendChild(el('line', {
          x1: String(x + NODE_W), y1: String(yMid),
          x2: String(x + NODE_W + 30), y2: String(yMid),
          stroke: lineColor, 'stroke-width': '1.25', 'marker-end': 'url(#ll-next-arrow)',
        }));
      }

      // prev：指向链上的上一个节点，或 NIL
      const prevId = node.prev;
      const prevOnChain = i - 1 >= 0 ? order[i - 1] : null;
      if (prevId !== undefined) {
        if (prevId != null && prevOnChain === prevId) {
          const x2 = posX.get(prevId);
          svg.appendChild(el('line', {
            x1: String(x + NODE_W / 2), y1: String(yDown),
            x2: String(x2 + NODE_W / 2), y2: String(yDown),
            stroke: dimColor, 'stroke-width': '1', 'stroke-dasharray': '3 3',
            'marker-end': 'url(#ll-prev-arrow)',
          }));
        } else if (prevId == null) {
          const t = el('text', {
            x: String(x - 34), y: String(yDown + 4),
            style: 'fill:' + nilColor + ';font:italic 11px var(--font-mono)',
          });
          t.textContent = 'NIL';
          svg.appendChild(t);
          svg.appendChild(el('line', {
            x1: String(x), y1: String(yDown),
            x2: String(x - 26), y2: String(yDown),
            stroke: dimColor, 'stroke-width': '1', 'stroke-dasharray': '3 3',
            'marker-end': 'url(#ll-prev-arrow)',
          }));
        }
      }
    });

    // ---- 命名指针（head / x / y …）：画在节点上方 ----
    const ptrs = frame.pointers || {};
    Object.keys(ptrs).forEach((name, pi) => {
      const tid = ptrs[name];
      if (tid == null || !posX.has(tid)) return;
      const x = posX.get(tid) + NODE_W / 2;
      const ty = 30 - pi * 14;
      const tri = el('path', { d: `M ${x - 6} ${ty} L ${x + 6} ${ty} L ${x} ${ty + 9} Z` });
      tri.setAttribute('fill', textColor);
      svg.appendChild(tri);
      const t = el('text', {
        x: String(x), y: String(ty - 3), 'text-anchor': 'middle',
        style: 'fill:' + textColor + ';font:bold 12px var(--font-mono)',
      });
      t.textContent = name;
      svg.appendChild(t);
    });

    // ---- 阶段标注（左上）----
    if (frame.phase) {
      const t = el('text', {
        x: '12', y: '20', style: 'fill:' + dimColor + ';font:11px var(--font-sans)',
      });
      t.textContent = String(frame.phase);
      svg.appendChild(t);
    }

    // ---- note（底部居中）----
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
