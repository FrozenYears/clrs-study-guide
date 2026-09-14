/* =============================================================================
 * viz/growth.js — 增长曲线引擎（渐进记号的「动手看见」）
 *
 * 为什么单独做一个引擎：
 *   九段式第 5 段（动手看见）原本只有 array / tree 两种引擎，都要求「有算法可单步」。
 *   但第 3 章这类「记号与函数」的节没有算法可跑 —— 它要看见的是**增长速度怎么分开**：
 *   原书 Figure 3.2 那张图（几条曲线 + 一条 c·g(n) 上界 + 一条 n₀ 竖线）才是这一节的
 *   核心图示。这个引擎就是画它。
 *
 * 契约（与 4.4 一致）：create(container, opts) -> { render, resize, destroy }
 *   render(spec) 的 spec 形状：
 *     {
 *       xMax: 64,                      // 横轴 n 的最大值（从 2 开始画）
 *       yMax: null,                    // 纵轴最大值；null = 按曲线自动取整
 *       series: [                      // 一到多条函数曲线
 *         { name: 'n lg n', expr: 'n * Math.log2(n)', color: '--viz-done' },
 *       ],
 *       band: {                        // 可选：O/Ω/Θ 的「界」，讲定义时用
 *         g: 'n * n',                  // 界函数 g(n)
 *         c: 2,                        // 常数 c（可被面板上的滑杆改）
 *         n0: 8,                       // 起点 n₀（可被面板上的滑杆改）
 *         label: 'c·g(n)',
 *       },
 *     }
 *
 * 可辨识性：曲线除了颜色，还按序叠加实线 / 虚线 / 点线三种线型，
 * 并在终点画不同形状的记号 —— 色盲与黑白打印下都能区分（开发规范 7.2）。
 * ========================================================================== */

import { h, svg } from '../core/dom.js';

/** 三种线型 + 三种终点记号，按 series 顺序循环使用。 */
const DASHES = ['', '7 4', '2 3', ''];
const MARKERS = ['circle', 'square', 'triangle', 'diamond'];

const PALETTE = [
  '--viz-done',
  '--viz-compare',
  '--viz-result',
  '--viz-active',
  '--viz-move',
  '--viz-mark',
];

/** 把值向上取整到「好看的刻度」（1/2/5 × 10^k）。 */
function niceCeil(v) {
  if (!(v > 0)) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const norm = v / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * mag;
}

function evalExpr(expr) {
  // 关卡数据是我们自己的内容（不是用户输入），与既有实现同样的信任级别
  const fn = new Function('n', 'return ' + expr);
  return (n) => {
    const v = fn(n);
    return Number.isFinite(v) ? v : 0;
  };
}

/** 曲线终点记号：形状不同，不只靠颜色。 */
function markerNode(kind, x, y, color) {
  const style = `fill:var(${color});stroke:var(--bg-1);stroke-width:1`;
  if (kind === 'square') {
    return svg('rect', {
      x: String(x - 3.2), y: String(y - 3.2), width: '6.4', height: '6.4',
      style,
    });
  }
  if (kind === 'triangle') {
    return svg('polygon', {
      points: `${x},${y - 4} ${x - 4},${y + 3} ${x + 4},${y + 3}`,
      style,
    });
  }
  if (kind === 'diamond') {
    return svg('polygon', {
      points: `${x},${y - 4.2} ${x + 4.2},${y} ${x},${y + 4.2} ${x - 4.2},${y}`,
      style,
    });
  }
  return svg('circle', { cx: String(x), cy: String(y), r: '3.4', style });
}

/**
 * 画一张增长曲线图。纯函数：给 spec 返回一个 <svg>。
 * 被本引擎与 stages.js 的 analyze 阶段共用（只有一份实现，避免两处漂移）。
 */
export function chartSVG(spec = {}) {
  const width = spec.width || 460;
  const height = spec.height || 240;
  const xMax = Math.max(4, spec.xMax || 32);
  const M = { l: 54, r: 20, t: 16, b: 34 };
  const iw = width - M.l - M.r;
  const ih = height - M.t - M.b;

  // 补齐 series：颜色与线型按序分配，也允许关卡自己指定
  const series = (spec.series || []).map((s, i) => ({
    name: s.name || 'f' + (i + 1),
    fn: evalExpr(s.expr),
    color: s.color || PALETTE[i % PALETTE.length],
    dash: s.dash != null ? s.dash : DASHES[i % DASHES.length],
    marker: MARKERS[i % MARKERS.length],
  }));

  // 界曲线（O/Ω/Θ 的 c·g(n)）
  const band = spec.band
    ? {
        fn: evalExpr(spec.band.g),
        c: spec.band.c == null ? 1 : spec.band.c,
        n0: spec.band.n0 == null ? 1 : spec.band.n0,
        label: spec.band.label || 'c·g(n)',
      }
    : null;

  // 纵轴上限：取所有曲线（含 c·g）在 xMax 处的最大值，再取整
  const samples = [];
  series.forEach((s) => samples.push(s.fn(xMax)));
  if (band) samples.push(band.fn(xMax) * band.c);
  const yMax = spec.yMax || niceCeil(Math.max(1, ...samples));

  const X = (n) => M.l + ((n - 2) / (xMax - 2)) * iw;
  const Y = (v) => M.t + ih - (Math.min(v, yMax) / yMax) * ih;

  const g = svg('svg', {
    viewBox: `0 0 ${width} ${height}`,
    width: '100%',
    role: 'img',
    'aria-label': spec.caption || '增长曲线',
    style: 'max-width:100%;height:auto',
  });

  // ---- 横向网格 + y 刻度 ----
  const yTicks = 4;
  for (let i = 0; i <= yTicks; i++) {
    const v = (yMax / yTicks) * i;
    const y = Y(v);
    g.appendChild(svg('line', {
      x1: String(M.l), y1: String(y), x2: String(width - M.r), y2: String(y),
      style: 'stroke:var(--bd-0);stroke-width:1;stroke-dasharray:2 3',
    }));
    const t = svg('text', {
      x: String(M.l - 6), y: String(y + 4), 'text-anchor': 'end',
      style: 'fill:var(--fg-2);font:11px var(--font-mono)',
    });
    t.textContent = String(Math.round(v));
    g.appendChild(t);
  }

  // ---- x 刻度（5 档，含 2 与 xMax）----
  const xTicks = [];
  for (let i = 0; i <= 5; i++) xTicks.push(Math.round(2 + ((xMax - 2) * i) / 5));
  xTicks.forEach((n) => {
    const t = svg('text', {
      x: String(X(n)), y: String(height - M.b + 16), 'text-anchor': 'middle',
      style: 'fill:var(--fg-2);font:11px var(--font-mono)',
    });
    t.textContent = String(n);
    g.appendChild(t);
  });

  // ---- 坐标轴 ----
  g.appendChild(svg('line', {
    x1: String(M.l), y1: String(M.t), x2: String(M.l), y2: String(M.t + ih),
    style: 'stroke:var(--bd-1);stroke-width:1',
  }));
  g.appendChild(svg('line', {
    x1: String(M.l), y1: String(M.t + ih), x2: String(width - M.r), y2: String(M.t + ih),
    style: 'stroke:var(--bd-1);stroke-width:1',
  }));

  // ---- n ≥ n₀ 的阴影带（视觉上把「从某点之后一直成立」说出来）----
  if (band && band.n0 > 2) {
    g.appendChild(svg('rect', {
      x: String(X(band.n0)), y: String(M.t),
      width: String(Math.max(0, width - M.r - X(band.n0))), height: String(ih),
      style: 'fill:var(--accent);opacity:0.06',
    }));
    g.appendChild(svg('line', {
      x1: String(X(band.n0)), y1: String(M.t),
      x2: String(X(band.n0)), y2: String(M.t + ih),
      style: 'stroke:var(--accent);stroke-width:1;stroke-dasharray:4 3',
    }));
    const lab = svg('text', {
      x: String(X(band.n0) + 4), y: String(M.t + 12),
      style: 'fill:var(--accent);font:11px var(--font-mono)',
    });
    lab.textContent = 'n₀ = ' + band.n0;
    g.appendChild(lab);
  }

  // ---- 曲线 ----
  series.forEach((s) => {
    const pts = [];
    for (let n = 2; n <= xMax; n++) pts.push(`${X(n)},${Y(s.fn(n))}`);
    g.appendChild(svg('polyline', {
      points: pts.join(' '),
      fill: 'none',
      style: `stroke:var(${s.color});stroke-width:2` + (s.dash ? `;stroke-dasharray:${s.dash}` : ''),
    }));
    g.appendChild(markerNode(s.marker, X(xMax), Y(s.fn(xMax)), s.color));
  });

  // ---- 界曲线（比曲线粗一点、虚线，明确它是「上界」而不是另一个被测函数）----
  if (band) {
    const pts = [];
    for (let n = 2; n <= xMax; n++) pts.push(`${X(n)},${Y(band.fn(n) * band.c)}`);
    g.appendChild(svg('polyline', {
      points: pts.join(' '),
      fill: 'none',
      style: 'stroke:var(--viz-mark);stroke-width:2.5;stroke-dasharray:9 5',
    }));
  }

  // ---- 轴名 ----
  const xl = svg('text', {
    x: String(M.l + iw / 2), y: String(height - 3), 'text-anchor': 'middle',
    style: 'fill:var(--fg-1);font:12px var(--font-sans)',
  });
  xl.textContent = spec.xLabel || '输入规模 n';
  g.appendChild(xl);

  const yl = svg('text', {
    x: '12', y: String(M.t + ih / 2), 'text-anchor': 'middle',
    transform: `rotate(-90 12 ${M.t + ih / 2})`,
    style: 'fill:var(--fg-1);font:12px var(--font-sans)',
  });
  yl.textContent = spec.yLabel || '基本操作次数';
  g.appendChild(yl);

  return g;
}

/** 图例：线型 + 名字。线型用边框样式表达，颜色用 CSS 变量（主题切换自动跟随）。
 *  类名沿用既有的 .growth-legend/.key/.swatch，避免同一视觉出现两套类名。 */
export function chartLegend(spec = {}) {
  const key = (color, dash, label) =>
    h('span', { class: 'key' },
      h('i', {
        class: 'swatch swatch--line',
        style: {
          borderTopWidth: '2px',
          borderTopStyle: dash ? 'dashed' : 'solid',
          borderTopColor: 'var(' + color + ')',
        },
      }),
      h('span', null, label));

  const rows = [];
  (spec.series || []).forEach((s, i) => {
    rows.push(key(s.color || PALETTE[i % PALETTE.length], s.dash || '', s.name));
  });
  if (spec.band) {
    rows.push(key('--viz-mark', '9 5', (spec.band.label || 'c·g(n)') + '（上界）'));
  }
  return h('div', { class: 'growth-legend' }, rows);
}

export function create(container, opts = {}) {
  let last = null;

  function render(spec) {
    last = Object.assign({}, opts, spec);
    container.replaceChildren(
      h('div', { class: 'growth' }, chartSVG(last), chartLegend(last)),
    );
  }

  function resize() {
    if (last) render(last);
  }

  function destroy() {
    container.replaceChildren();
    last = null;
  }

  return { render, resize, destroy };
}
