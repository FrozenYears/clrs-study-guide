// tree.js — 树 / 递归树引擎（纯 SVG，render 幂等）
// 契约：开发规范 4.4  create(container, opts) -> { render(tree), resize(), destroy() }
// 用途：Part I 的归并排序递归树、第 4 章递归式求解的递归树。
// 数据形态：
//   tree = { root: Node, path?: string[] }
//   Node = { id?, label, cost?, note?, state?, collapsed?, children?: Node[] }
//   - label: 节点文字（如 "A[1..8]"）
//   - cost:  每层代价标注（如 "cn" / "cn/2"），显示在节点下方
//   - state: 'path' | 'active' | 'compare' | 'done' | 'violation'（路径高亮等）
//   - collapsed: true 时折叠子树；点击/回车触发 opts.onToggle(id) 后由调用方重渲染
// 颜色只引用设计令牌；颜色之外用边框粗细区分状态。

const SVGNS = 'http://www.w3.org/2000/svg';

const TREE_STATES = {
  idle:      { fill: '--viz-idle',      border: '--bd-1' },
  path:      { fill: '--viz-result',    border: '--bd-0' },
  active:    { fill: '--viz-active',    border: '--fg-1' },
  compare:   { fill: '--viz-compare',   border: '--bd-0' },
  done:      { fill: '--viz-done',      border: '--bd-0' },
  violation: { fill: '--viz-violation', border: '--fg-1' },
};

function el(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

export function create(container, opts = {}) {
  const svg = el('svg', { 'class': 'viz-tree', role: 'img', 'aria-label': '递归树', preserveAspectRatio: 'xMidYMid meet' });
  svg.style.width = '100%';
  svg.style.height = 'auto';
  svg.style.display = 'block';
  svg.style.overflow = 'visible';
  container.appendChild(svg);

  let lastTree = null;
  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => { if (lastTree) render(lastTree); });
    ro.observe(container);
  }

  function layout(root) {
    const visible = [];
    let slot = 0;
    (function visit(node, depth) {
      node._depth = depth;
      const kids = (node.collapsed || !node.children) ? [] : node.children;
      if (kids.length === 0) {
        node._x = slot++;
      } else {
        kids.forEach((c) => visit(c, depth + 1));
        node._x = (kids[0]._x + kids[kids.length - 1]._x) / 2;
      }
      visible.push(node);
    })(root, 0);
    return { visible, slots: slot };
  }

  function render(tree) {
    lastTree = tree;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const root = tree && (tree.root || tree.children) ? (tree.root || tree) : null;
    if (!root) {
      const t = el('text', { x: '8', y: '24', style: 'fill:var(--fg-2);font-size:14px' });
      t.textContent = '（空树）';
      svg.setAttribute('viewBox', '0 0 200 40');
      svg.appendChild(t);
      return;
    }
    const pathSet = new Set(Array.isArray(tree.path) ? tree.path : []);
    const { visible, slots } = layout(root);
    let maxDepth = 0;
    visible.forEach((nd) => { if (nd._depth > maxDepth) maxDepth = nd._depth; });

    const marginX = 16, marginTop = 24, levelH = 96, nodeW = 58, nodeH = 34, gap = 16;
    const totalW = marginX * 2 + Math.max(1, slots) * (nodeW + gap) - gap;
    const totalH = marginTop * 2 + (maxDepth + 1) * levelH;
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);

    const cx = (nd) => marginX + nd._x * (nodeW + gap) + nodeW / 2;
    const cyTop = (nd) => marginTop + nd._depth * levelH;
    const cyBot = (nd) => cyTop(nd) + nodeH;
    const cyMid = (nd) => marginTop + nd._depth * levelH + nodeH / 2;

    // 边
    visible.forEach((nd) => {
      if (nd.collapsed || !nd.children) return;
      nd.children.forEach((c) => {
        const line = el('path', {
          d: `M ${cx(nd)} ${cyBot(nd)} C ${cx(nd)} ${cyBot(nd) + 26}, ${cx(c)} ${cyTop(c) - 26}, ${cx(c)} ${cyTop(c)}`,
          style: 'fill:none;stroke:var(--bd-1);stroke-width:1.5',
        });
        svg.appendChild(line);
      });
    });

    // 节点
    visible.forEach((nd) => {
      const st = TREE_STATES[nd.state] || (pathSet.has(nd.id) ? TREE_STATES.path : TREE_STATES.idle) || TREE_STATES.idle;
      const rect = el('rect', {
        x: String(cx(nd) - nodeW / 2), y: String(cyTop(nd)),
        width: String(nodeW), height: String(nodeH), rx: '0',
      });
      rect.style.fill = `var(${st.fill})`;
      rect.style.stroke = `var(${st.border})`;
      rect.style.strokeWidth = pathSet.has(nd.id) ? '3' : '1.5';
      svg.appendChild(rect);

      const lab = el('text', {
        x: String(cx(nd)), y: String(cyMid(nd) + 4), 'text-anchor': 'middle',
        style: `fill:var(--fg-0);font:bold 12px var(--font-mono)`,
      });
      lab.textContent = nd.label != null ? String(nd.label) : '';
      svg.appendChild(lab);

      if (nd.cost != null) {
        const cost = el('text', {
          x: String(cx(nd)), y: String(cyBot(nd) + 16), 'text-anchor': 'middle',
          style: `fill:var(--fg-1);font:11px var(--font-mono)`,
        });
        cost.textContent = String(nd.cost);
        svg.appendChild(cost);
      }

      // 展开/折叠开关
      const hasKids = Array.isArray(nd.children) && nd.children.length > 0;
      if (hasKids && typeof opts.onToggle === 'function') {
        const g = el('g', {
          tabindex: '0', role: 'button',
          'aria-label': (nd.collapsed ? '展开' : '折叠') + ' 子树 ' + (nd.label || ''),
          style: 'cursor:pointer',
        });
        const tg = el('circle', { cx: String(cx(nd) + nodeW / 2), cy: String(cyMid(nd)), r: '9' });
        tg.style.fill = 'var(--bg-1)'; tg.style.stroke = 'var(--bd-0)'; tg.style.strokeWidth = '1.5';
        g.appendChild(tg);
        const sign = el('text', {
          x: String(cx(nd) + nodeW / 2), y: String(cyMid(nd) + 4), 'text-anchor': 'middle',
          style: `fill:var(--fg-0);font:bold 13px var(--font-sans)`,
        });
        sign.textContent = nd.collapsed ? '+' : '−';
        g.appendChild(sign);
        const fire = (e) => { e.preventDefault(); opts.onToggle(nd.id); };
        g.addEventListener('click', fire);
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fire(e); });
        svg.appendChild(g);
      }
    });
  }

  function resize() { if (lastTree) render(lastTree); }
  function destroy() { if (ro) ro.disconnect(); if (svg.parentNode) svg.parentNode.removeChild(svg); lastTree = null; }

  return { render, resize, destroy };
}
