// array.js — 数组可视化引擎（纯 SVG，render 幂等）
// 契约：开发规范 4.4  create(container, opts) -> { render(frame), resize(), destroy() }
// 约定（与算法生成器、内容层对齐）：
//   - 帧内所有下标（pointers / highlight 数组 / sortedPrefix 计数）均为「1 基」，与书一致。
//   - 引擎在图右下角注明「C 实现从 0 开始」，仅作提示，不改变数据语义。
//   - 颜色只引用 theme.css 的设计令牌（var(--viz-*)），引擎内部不定义任何颜色。
//   - 状态不只靠颜色区分：同时用斜纹填充 / 边框粗细 / 小文字标签，色盲可辨。

const SVGNS = 'http://www.w3.org/2000/svg';

// 状态 -> 可视化编码。fill/border 只写 CSS 变量名；纹理与标签是「非颜色」通道。
const STATES = {
  idle:     { fill: '--viz-idle',     border: '--bd-1', w: 1,   hatch: null,        label: '' },
  sorted:   { fill: '--viz-done',     border: '--bd-0', w: 1.5, hatch: null,        label: '✓' },
  compare:  { fill: '--viz-compare',  border: '--bd-0', w: 2,   hatch: 'diag',      label: '比较' },
  active:   { fill: '--viz-active',   border: '--fg-1', w: 4,   hatch: null,        label: '当前' },
  move:     { fill: '--viz-active',   border: '--bd-0', w: 2,   hatch: 'cross',     label: '移动' },
  pivot:    { fill: '--viz-mark',     border: '--bd-0', w: 2,   hatch: null,        label: '轴' },
  visited:  { fill: '--viz-mark',     border: '--bd-1', w: 1,   hatch: null,        label: '已访问' },
  frontier: { fill: '--viz-compare',  border: '--bd-0', w: 1.5, hatch: null,        label: '待处理' },
  path:     { fill: '--viz-result',   border: '--bd-0', w: 2,   hatch: null,        label: '路径' },
  result:   { fill: '--viz-result',   border: '--bd-0', w: 3,   hatch: null,        label: '结果' },
  violation:{ fill: '--viz-violation',border: '--fg-1', w: 3,   hatch: 'cross',     label: '违规' },
};

function el(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}
function setFill(node, varName) { node.style.fill = `var(${varName})`; }
function setStroke(node, varName, w) {
  node.style.stroke = `var(${varName})`;
  node.style.strokeWidth = String(w);
}

export function create(container, opts = {}) {
  const mode = opts.mode === 'cards' ? 'cards' : 'bars';

  const svg = el('svg', {
    'class': 'viz-array',
    role: 'img',
    'aria-label': '数组可视化',
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
      id: 'viz-hatch-diag', width: '6', height: '6',
      patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)',
    });
    diag.appendChild(el('line', { x1: '0', y1: '0', x2: '0', y2: '6', style: 'stroke:var(--fg-2);stroke-width:1.5' }));
    const cross = el('pattern', {
      id: 'viz-hatch-cross', width: '7', height: '7',
      patternUnits: 'userSpaceOnUse',
    });
    cross.appendChild(el('line', { x1: '0', y1: '0', x2: '7', y2: '7', style: 'stroke:var(--fg-2);stroke-width:1.2' }));
    cross.appendChild(el('line', { x1: '7', y1: '0', x2: '0', y2: '7', style: 'stroke:var(--fg-2);stroke-width:1.2' }));
    d.appendChild(diag); d.appendChild(cross);
    return d;
  }

  function stateOf(pos, hl) {
    // 优先级：违规 > 结果 > 当前 > 移动 > 比较 > 其它高亮 > 已定前缀 > 空闲
    if (hl.violation && hl.violation.includes(pos + 1)) return 'violation';
    if (hl.result && hl.result.includes(pos + 1)) return 'result';
    if (hl.path && hl.path.includes(pos + 1)) return 'path';
    if (hl.active && hl.active.includes(pos + 1)) return 'active';
    if (hl.move && hl.move.includes(pos + 1)) return 'move';
    if (hl.compare && hl.compare.includes(pos + 1)) return 'compare';
    if (hl.pivot && hl.pivot.includes(pos + 1)) return 'pivot';
    if (hl.frontier && hl.frontier.includes(pos + 1)) return 'frontier';
    if (hl.visited && hl.visited.includes(pos + 1)) return 'visited';
    if (typeof hl.sortedPrefix === 'number' && pos < hl.sortedPrefix) return 'sorted';
    return 'idle';
  }

  function render(frame) {
    lastFrame = frame;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const a = frame && Array.isArray(frame.array) ? frame.array : [];
    const n = a.length;
    if (n === 0) {
      const t = el('text', { x: '8', y: '24', style: 'fill:var(--fg-2);font-size:14px' });
      t.textContent = '（空数组）';
      svg.appendChild(defs()); svg.appendChild(t);
      svg.setAttribute('viewBox', '0 0 200 40');
      return;
    }

    const marginTop = 64, marginBottom = 44, marginX = 10;
    const barAreaH = 200, cardH = 64;
    const colW = Math.max(34, Math.min(70, Math.floor(520 / n)));
    const gap = Math.max(6, Math.floor(colW * 0.18));
    const totalW = marginX * 2 + n * colW + (n - 1) * gap;
    const totalH = marginTop + barAreaH + marginBottom;
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
    svg.appendChild(defs());

    const maxVal = Math.max(1, ...a);
    const hl = frame.highlight || {};
    const ptrs = frame.pointers || {};

    // 下标刻度尺（1 基）
    for (let pos = 0; pos < n; pos++) {
      const x = marginX + pos * (colW + gap);
      const idx = el('text', {
        x: String(x + colW / 2), y: '20', 'text-anchor': 'middle',
        style: 'fill:var(--fg-2);font:13px var(--font-mono)',
      });
      idx.textContent = String(pos + 1);
      svg.appendChild(idx);
    }

    // 柱子 / 卡片
    for (let pos = 0; pos < n; pos++) {
      const x = marginX + pos * (colW + gap);
      const st = STATES[stateOf(pos, hl)];
      let barTop, barH;
      if (mode === 'cards') {
        barH = cardH;
        barTop = marginTop + (barAreaH - cardH) / 2;
      } else {
        barH = Math.max(6, (a[pos] / maxVal) * barAreaH);
        barTop = marginTop + (barAreaH - barH);
      }
      const rect = el('rect', {
        x: String(x), y: String(barTop), width: String(colW), height: String(barH),
        rx: '0',
      });
      setFill(rect, st.fill); setStroke(rect, st.border, st.w);
      svg.appendChild(rect);
      if (st.hatch) {
        const ov = el('rect', {
          x: String(x), y: String(barTop), width: String(colW), height: String(barH),
          fill: `url(#viz-hatch-${st.hatch})`,
        });
        svg.appendChild(ov);
      }
      // 数值文本（放在柱子上方 / 卡片内，避免与填充色撞色）
      const vtxt = el('text', {
        x: String(x + colW / 2),
        y: mode === 'cards' ? String(barTop + cardH / 2 + 5) : String(barTop - 6),
        'text-anchor': 'middle',
        style: `fill:var(--fg-0);font:bold 13px var(--font-mono)`,
      });
      vtxt.textContent = String(a[pos]);
      svg.appendChild(vtxt);
      // 状态文字标签（非颜色通道，置于柱下）
      if (st.label) {
        const lab = el('text', {
          x: String(x + colW / 2), y: String(marginTop + barAreaH + 16),
          'text-anchor': 'middle',
          style: `fill:var(--fg-1);font:11px var(--font-sans)`,
        });
        lab.textContent = st.label;
        svg.appendChild(lab);
      }
    }

    // 指针箭头（i / j / k / p / q / r / key ...），1 基
    const ptrKeys = Object.keys(ptrs).filter((k) => Number.isInteger(ptrs[k]) && ptrs[k] >= 1 && ptrs[k] <= n);
    ptrKeys.forEach((k, pi) => {
      const v = ptrs[k];
      const cx = marginX + (v - 1) * (colW + gap) + colW / 2;
      const ty = marginTop - 14 - pi * 12;
      const tri = el('path', { d: `M ${cx - 6} ${ty} L ${cx + 6} ${ty} L ${cx} ${ty + 9} Z` });
      setFill(tri, '--fg-1');
      svg.appendChild(tri);
      const t = el('text', {
        x: String(cx), y: String(ty - 3), 'text-anchor': 'middle',
        style: `fill:var(--fg-1);font:bold 12px var(--font-mono)`,
      });
      t.textContent = k;
      svg.appendChild(t);
    });

    // 本帧一句话说明
    if (frame.note) {
      const cap = el('text', {
        x: String(totalW / 2), y: String(totalH - 8), 'text-anchor': 'middle',
        style: `fill:var(--fg-1);font:13px var(--font-sans)`,
      });
      cap.textContent = frame.note;
      svg.appendChild(cap);
    }

    // 角落提示：下标从 1 开始，C 从 0 开始
    const corner = el('text', {
      x: String(totalW - marginX), y: '14', 'text-anchor': 'end',
      style: `fill:var(--fg-2);font:10px var(--font-sans)`,
    });
    corner.textContent = '下标从 1 开始 · C 实现从 0 开始';
    svg.appendChild(corner);
  }

  function resize() { if (lastFrame) render(lastFrame); }
  function destroy() { if (ro) ro.disconnect(); if (svg.parentNode) svg.parentNode.removeChild(svg); lastFrame = null; }

  return { render, resize, destroy };
}
