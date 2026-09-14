/* =============================================================================
 * ui/stages.js — 九段式关卡渲染器（章节外壳 Agent 拥有）
 *
 * 输入：一个「关卡对象」（见 docs/开发规范.md 4.2 的 schema）
 * 输出：{ node, destroy } —— node 可直接插入页面，destroy 负责清理定时器与监听
 *
 * 设计要点：
 *   1) 内容层只声明数据，不写渲染逻辑 —— 149 个关卡共用这九段节奏。
 *   2) 原文块一律 data-kind="source"（衬线体），讲解块一律 data-kind="note"
 *      （无衬线体），这是全站的视觉惯例，也是红线 R3。
 *   3) 「复杂度」阶段的每个结论都必须带页码与来源标记（book / instructor）。
 * ========================================================================== */

import { h, svg, $ } from '../core/dom.js';
import * as katex from '../core/katex.js';
import * as store from '../core/store.js';
import { createStepper } from '../core/stepper.js';
import { getViz, getAlgorithm } from './registry.js';

export const STAGE_META = {
  map: { no: 0, name: '位置感', en: 'Where this fits' },
  intuition: { no: 1, name: '直觉入口', en: 'Intuition' },
  source: { no: 2, name: '原文精读', en: 'Close reading' },
  pseudocode: { no: 3, name: '伪代码骨架', en: 'Pseudocode' },
  visualize: { no: 4, name: '动手看见', en: 'See it run' },
  code: { no: 5, name: '双轨实现', en: 'Pseudocode ⇄ C' },
  analyze: { no: 6, name: '复杂度', en: 'Running time' },
  prove: { no: 7, name: '正确性', en: 'Correctness' },
  drill: { no: 8, name: '闯关测验', en: 'Drill' },
};

export const STAGE_ORDER = Object.keys(STAGE_META);

const KIND_LABEL = {
  definition: '定义',
  theorem: '定理',
  lemma: '引理',
  corollary: '推论',
  proof: '证明',
  remark: '说明',
  example: '例子',
  'figure-caption': '图注',
  body: '正文',
  note: '补充',
};

/* ============================ 通用小组件 ============================ */

export function pageRef(page, preview) {
  const label = Array.isArray(page) ? page.join('–') : String(page);
  return h('span', {
    class: 'pg-ref' + (preview ? ' pg-ref--preview' : ''),
    title: preview
      ? '此结论出自后续小节，这里只作预告 —— 完整推导在对应的那一关'
      : '出处：原书印刷页 ' + label,
  }, (preview ? '预告 · 印刷页 ' : '印刷页 ') + label);
}

function stageHead(stage) {
  const m = STAGE_META[stage.type] || { no: -1, name: stage.type, en: '' };
  return h('div', { class: 'stage-head' },
    h('span', { class: 'stage-no' }, '阶段 ' + m.no),
    h('h2', { class: 'stage-name' }, stage.title || m.name),
    h('span', { class: 'stage-en' }, m.en)
  );
}

function noteBlock(...kids) {
  return h('div', { 'data-kind': 'note' }, ...kids);
}

function sourceBlock(block) {
  const head = h('div', { class: 'src-block__head' },
    h('span', { class: 'src-block__kind' }, KIND_LABEL[block.kind] || block.kind || '原文'),
    pageRef(block.page)
  );
  const kids = [head];
  if (block.en) {
    kids.push(h('p', { class: 'src-block__en', 'data-kind': 'source' }, block.en));
  }
  if (block.zh) {
    kids.push(h('p', { class: 'src-block__zh', 'data-kind': 'note' }, block.zh));
  }
  if (block.note) {
    kids.push(h('p', { class: 'src-block__zh', 'data-kind': 'note' }, block.note));
  }
  return h('div', { class: 'src-block' }, ...kids);
}

function termCards(terms) {
  return h('div', { class: 'term-list' },
    (terms || []).map((t) =>
      h('span', { class: 'term', title: '原书印刷页 ' + t.page },
        h('span', { class: 'term-en' }, t.en),
        h('span', { class: 'term-zh' }, t.zh)
      )
    )
  );
}

function kvTable(caption, rows) {
  return h('table', { class: 'kv' },
    caption ? h('caption', caption) : null,
    h('tbody', rows.map((r) =>
      h('tr', null,
        h('th', { scope: 'row' }, r[0]),
        h('td', { class: r[2] ? 'mono' : null }, r[1])
      )
    ))
  );
}

/**
 * 伪代码表。返回 { node, setActive(lineNo) }。
 * opts.interactive 为真时，点击某行会展开它的中文解释。
 */
function pseudocodeTable(lines, opts = {}) {
  const items = [];
  const rowOf = new Map();

  const list = h('div', { class: 'pseudocode' });

  (lines || []).forEach((ln) => {
    const codeEl = h('span', { class: 'pc-code' }, ln.code);
    const row = h('div', {
      class: 'pc-line' + (opts.interactive ? ' pc-clickable' : ''),
      dataset: { line: String(ln.n) },
      role: opts.interactive ? 'button' : null,
      tabindex: opts.interactive ? '0' : null,
      'aria-expanded': opts.interactive ? 'false' : null,
      onClick: opts.interactive ? () => toggle(ln.n) : null,
      onKeydown: opts.interactive
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle(ln.n);
            }
          }
        : null,
    },
      h('span', { class: 'pc-no' }, String(ln.n)),
      codeEl
    );
    const zh = ln.zh
      ? h('div', { class: 'pc-zh', hidden: true }, katex.renderMixed(ln.zh))
      : null;
    rowOf.set(ln.n, { row, zh });
    items.push(row);
    if (zh) items.push(zh);
  });

  function toggle(n) {
    const rec = rowOf.get(n);
    if (!rec || !rec.zh) return;
    const open = rec.zh.hasAttribute('hidden');
    if (open) rec.zh.removeAttribute('hidden');
    else rec.zh.setAttribute('hidden', '');
    rec.row.classList.toggle('is-open', open);
    rec.row.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  items.forEach((n) => list.appendChild(n));

  function setActive(lineNo) {
    rowOf.forEach((rec, n) => {
      rec.row.classList.toggle('is-active', n === lineNo);
    });
  }

  return { node: list, setActive, destroy() {} };
}

/** 增长速度曲线（线性纵轴，n 从 2 到 xMax）。color 传 CSS 变量名（不带 var()）。 */
function growthChart({ series, xMax = 16, width = 400, height = 200, xLabel = 'n', yLabel = '基本操作次数' }) {
  const M = { l: 52, r: 14, t: 14, b: 30 };
  const iw = width - M.l - M.r;
  const ih = height - M.t - M.b;
  const maxY = Math.max(1, ...series.flatMap((s) => [s.fn(xMax)]));
  const X = (n) => M.l + ((n - 2) / (xMax - 2)) * iw;
  const Y = (v) => M.t + ih - (v / maxY) * ih;

  const g = svg('svg', {
    viewBox: `0 0 ${width} ${height}`,
    width: String(width),
    height: String(height),
    role: 'img',
    'aria-label': '增长曲线对比图',
  });

  // 横向网格 + y 轴刻度
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const v = (maxY / ticks) * i;
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

  // x 轴刻度
  [2, 5, 8, 11, 14, 16].forEach((n) => {
    const t = svg('text', {
      x: String(X(n)), y: String(height - M.b + 16), 'text-anchor': 'middle',
      style: 'fill:var(--fg-2);font:11px var(--font-mono)',
    });
    t.textContent = String(n);
    g.appendChild(t);
  });

  // 坐标轴
  g.appendChild(svg('line', {
    x1: String(M.l), y1: String(M.t), x2: String(M.l), y2: String(M.t + ih),
    style: 'stroke:var(--bd-1);stroke-width:1',
  }));
  g.appendChild(svg('line', {
    x1: String(M.l), y1: String(M.t + ih), x2: String(width - M.r), y2: String(M.t + ih),
    style: 'stroke:var(--bd-1);stroke-width:1',
  }));

  // 曲线
  series.forEach((s) => {
    const pts = [];
    for (let n = 2; n <= xMax; n++) pts.push(`${X(n)},${Y(s.fn(n))}`);
    g.appendChild(svg('polyline', {
      points: pts.join(' '),
      fill: 'none',
      style: `stroke:var(${s.color});stroke-width:2`,
    }));
    // 终点标记（形状不同，色盲也能区分）
    const last = svg('circle', {
      cx: String(X(xMax)), cy: String(Y(s.fn(xMax))), r: '3.5',
      style: `fill:var(${s.color});stroke:var(--bg-1);stroke-width:1`,
    });
    g.appendChild(last);
  });

  // 轴名
  const xl = svg('text', {
    x: String(M.l + iw / 2), y: String(height - 2), 'text-anchor': 'middle',
    style: 'fill:var(--fg-2);font:11px var(--font-sans)',
  });
  xl.textContent = xLabel;
  g.appendChild(xl);

  const yl = svg('text', {
    x: '12', y: String(M.t + ih / 2), 'text-anchor': 'middle',
    transform: `rotate(-90 12 ${M.t + ih / 2})`,
    style: 'fill:var(--fg-2);font:11px var(--font-sans)',
  });
  yl.textContent = yLabel;
  g.appendChild(yl);

  return g;
}

function growthLegend(series) {
  return h('div', { class: 'growth-legend' },
    series.map((s) =>
      h('span', { class: 'key' },
        h('span', { class: 'swatch', style: { background: `var(${s.color})` } }),
        s.name
      )
    )
  );
}

/* ============================ 阶段渲染器 ============================ */

function rMap(stage) {
  const kids = [stageHead(stage)];

  if (stage.why) {
    kids.push(h('div', { class: 'map-card' },
      h('div', { class: 'map-card__label' }, '为什么学这一关'),
      h('p', { style: { margin: '0' } }, katex.renderMixed(stage.why))
    ));
  }
  if (stage.position) {
    kids.push(h('div', { class: 'map-card' },
      h('div', { class: 'map-card__label' }, '它在整本书里的位置'),
      h('p', { style: { margin: '0' } }, katex.renderMixed(stage.position))
    ));
  }
  if (stage.unlocks && stage.unlocks.length) {
    kids.push(h('div', { class: 'map-card' },
      h('div', { class: 'map-card__label' }, '学完解锁'),
      h('div', { class: 'map-unlocks' },
        stage.unlocks.map((u) =>
          h('a', { class: 'badge', href: u.url }, u.label)
        )
      )
    ));
  }
  (stage.mathKit || []).forEach((k) => {
    kids.push(h('details', { class: 'kit' },
      h('summary', null, '数学急救包 · ' + k.title),
      noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(k.body)))
    ));
  });

  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

/** 阶段 1 的「抓牌」小游戏：亲手把牌插进手里，体会插入排序。 */
function cardsHandGame(cfg) {
  const hand = [];
  const pile = cfg.cards.slice();
  const handEl = h('div', { class: 'row', style: { minHeight: '3rem' }, 'aria-live': 'polite' });
  const pileEl = h('div', { class: 'row' });
  const msgEl = h('p', { class: 'viz-note' }, cfg.prompt || '从桌上点一张牌，插进左手。');

  function paint() {
    handEl.replaceChildren(
      ...(hand.length
        ? hand.map((v) => h('span', { class: 'badge badge--done' }, String(v)))
        : [h('span', { class: 'card__meta' }, '（左手还空着）')])
    );
    pileEl.replaceChildren(
      ...pile.map((v, i) =>
        h('button', {
          class: 'btn btn--sm',
          type: 'button',
          onClick: () => take(i),
          'aria-label': '拿起点数为 ' + v + ' 的牌',
        }, String(v))
      )
    );
  }

  function take(i) {
    const v = pile.splice(i, 1)[0];
    let k = 0;
    while (k < hand.length && hand[k] <= v) k++;
    hand.splice(k, 0, v);
    msgEl.textContent = hand.length === 1
      ? '手里只有一张牌，天然是「有序」的 —— 这就是循环不变量的起点。'
      : `点数为 ${v} 的牌，插到了 ${k === 0 ? '最左边' : '第 ' + (k + 1) + ' 个位置'}。左手的牌始终是从小到大排好的。`;
    paint();
    if (pile.length === 0) {
      msgEl.textContent = '牌抓完了，左手是有序的 —— 你刚刚亲手做了一遍插入排序。';
    }
  }

  paint();
  return {
    node: h('div', { class: 'viz-panel' },
      h('div', { class: 'map-card' },
        h('div', { class: 'map-card__label' }, '左手（已排序）'),
        handEl),
      h('div', { class: 'map-card' },
        h('div', { class: 'map-card__label' }, '桌上（待处理）'),
        pileEl),
      msgEl
    ),
    destroy() {},
  };
}

function rIntuition(stage) {
  const kids = [stageHead(stage)];
  if (stage.scene) {
    kids.push(h('p', { style: { margin: '0' } },
      h('strong', null, '场景：'), katex.renderMixed(stage.scene)));
  }
  (stage.body || []).forEach((p) => {
    kids.push(h('p', { style: { margin: '0' } }, katex.renderMixed(p)));
  });

  let inner = null;
  if (stage.interactive && stage.interactive.kind === 'cards-hand') {
    inner = cardsHandGame(stage.interactive);
  } else if (stage.interactive && stage.interactive.text) {
    inner = h('div', { class: 'viz-note' }, katex.renderMixed(stage.interactive.text));
  }
  if (inner) kids.push(inner.node);

  return {
    node: h('div', { class: 'stack' }, ...kids),
    destroy() { if (inner && inner.destroy) inner.destroy(); },
  };
}

function rSource(stage) {
  const kids = [stageHead(stage)];
  if (stage.lead) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.lead))));
  }
  (stage.blocks || []).forEach((b) => kids.push(sourceBlock(b)));
  if (stage.terms && stage.terms.length) {
    kids.push(h('div', null,
      h('div', { class: 'map-card__label' }, '本关术语（中英对照）'),
      termCards(stage.terms)
    ));
  }
  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

function rPseudocode(stage) {
  const kids = [stageHead(stage)];
  kids.push(h('div', { class: 'row' },
    h('span', { class: 'pc-ref' }, stage.signature || stage.algo),
    pageRef(stage.page)
  ));
  const table = pseudocodeTable(stage.lines, { interactive: true });
  kids.push(table.node);
  kids.push(h('p', { class: 'card__meta' },
    '点任意一行，看它到底在做什么。'));
  if (stage.vars && stage.vars.length) {
    kids.push(kvTable('变量表', stage.vars.map((v) => [v.name, katex.renderMixed(v.meaning)])));
  }
  if (stage.note) kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.note))));
  return { node: h('div', { class: 'stack' }, ...kids), destroy: table.destroy };
}

function rVisualize(stage, ctx) {
  const vizMod = getViz(stage.viz);
  const algoFn = getAlgorithm(stage.algorithm);
  if (!vizMod || !algoFn) {
    return {
      node: h('div', { class: 'stack' }, stageHead(stage),
        noteBlock(h('p', { style: { margin: '0' } },
          `可视化引擎「${stage.viz}」或算法「${stage.algorithm}」尚未注册。`))),
      destroy() {},
    };
  }

  const presets = stage.presets && stage.presets.length
    ? stage.presets
    : [{ name: '默认输入', array: (stage.input && stage.input.array) || [] }];

  const pseudoMod = findPseudocodeStage(ctx.level, stage.pseudocodeRef);
  const pseudo = pseudoMod
    ? pseudocodeTable(pseudoMod.lines, { interactive: false })
    : null;

  const host = h('div', { class: 'viz-stage', role: 'group', 'aria-label': '算法动画控制区' });
  const noteEl = h('div', { class: 'viz-note' }, '按「播放」或直接按空格键开始。');
  const counterEl = h('span', { class: 'viz-counter' }, '帧 0');
  const readoutEl = h('div', { class: 'viz-readout' });
  const invEl = h('div', { class: 'viz-invariant' }, '循环不变量：—');

  let viz = null;
  let stepper = null;
  let presetIndex = 0;

  const btnPlay = h('button', { class: 'btn btn--primary btn--sm', type: 'button' }, '播放');
  const btnStep = h('button', { class: 'btn btn--sm', type: 'button' }, '下一帧 →');
  const btnBack = h('button', { class: 'btn btn--sm', type: 'button' }, '← 上一帧');
  const btnReset = h('button', { class: 'btn btn--sm', type: 'button' }, '重置');
  const speed = h('input', {
    class: 'speed-range', type: 'range', min: '80', max: '1200', step: '20',
    value: '650', 'aria-label': '动画速度（毫秒每帧）',
  });
  const presetSel = h('select', { class: 'drill-input', 'aria-label': '选择输入' },
    presets.map((p, i) => h('option', { value: String(i) }, p.name))
  );

  // 预跑一遍数帧数（n 很小，成本可忽略）
  function countFrames(arr) {
    let n = 0;
    const it = algoFn(arr.slice());
    for (let r = it.next(); !r.done; r = it.next()) n++;
    return n;
  }

  function build(idx) {
    presetIndex = idx;
    if (stepper) { stepper.destroy(); stepper = null; }
    if (viz) { viz.destroy(); viz = null; }
    host.replaceChildren();
    viz = vizMod.create(host, { mode: stage.vizMode || 'bars' });

    const arr = presets[idx].array.slice();
    const speedMs = Number(speed.value) || 650;
    stepper = createStepper(algoFn(arr.slice()), {
      mount: host,
      speed: speedMs,
      total: countFrames(arr),
    });

    stepper.onFrame((frame, state) => {
      viz.render(frame);
      if (pseudo) pseudo.setActive(frame.line);
      counterEl.textContent = `帧 ${state.index} / ${Math.max(0, (state.total || 0) - 1)}` +
        (state.playing ? ' · 播放中' : state.done ? ' · 已结束' : '');
      btnPlay.textContent = state.playing ? '暂停' : '播放';
      if (frame.note) noteEl.textContent = frame.note;
      const c = frame.counts || {};
      readoutEl.replaceChildren(
        c.line5 != null
          ? h('span', {
              class: 'badge',
              title: '书中 2.2 的 Σtᵢ：第 5 行被求值的次数，含每轮最后一次为假的那次判断',
            }, '第 5 行求值 Σtᵢ = ' + c.line5)
          : null,
        h('span', { class: 'badge' }, '触发搬移 ' + (c.cmp ?? 0) + ' 次'),
        h('span', { class: 'badge' }, '搬移 ' + (c.move ?? 0) + ' 次'),
        h('span', { class: 'badge' }, '当前行 ' + (frame.line ?? '—'))
      );
      const ok = frame.invariantHolds !== false;
      invEl.dataset.ok = ok ? '1' : '0';
      invEl.textContent = (ok ? '✓ 不变量成立 · ' : '✗ 不变量被破坏 · ') +
        (stage.invariants && stage.invariants[0] ? stage.invariants[0].label : '—');
    });
  }

  btnPlay.addEventListener('click', () => stepper && stepper.toggle());
  btnStep.addEventListener('click', () => stepper && stepper.step());
  btnBack.addEventListener('click', () => stepper && stepper.stepBack());
  btnReset.addEventListener('click', () => stepper && stepper.reset());
  speed.addEventListener('input', () => stepper && stepper.setSpeed(Number(speed.value)));
  presetSel.addEventListener('change', () => build(Number(presetSel.value)));

  const controls = h('div', { class: 'viz-controls' },
    btnPlay, btnStep, btnBack, btnReset,
    h('span', { class: 'spacer' }),
    counterEl
  );
  const controls2 = h('div', { class: 'viz-controls' },
    h('label', { class: 'card__meta' }, '输入 '),
    presetSel,
    h('label', { class: 'card__meta' }, '速度 '),
    speed
  );

  build(0);

  const vizPanel = h('div', { class: 'viz-panel' },
    host, controls, controls2, noteEl, readoutEl, invEl);

  const kids = [stageHead(stage)];
  kids.push(pseudo
    ? h('div', { class: 'layout-level' },
        h('div', { class: 'col-left' },
          h('div', { class: 'map-card__label' }, '伪代码（随动画高亮）'),
          pseudo.node),
        h('div', { class: 'col-right' }, vizPanel))
    : vizPanel);
  kids.push(h('p', { class: 'card__meta' },
    '键盘：← → 单步 · 空格 播放/暂停 · Home / End 跳到首尾'));
  if (stage.tasks && stage.tasks.length) {
    kids.push(h('div', { class: 'map-card' },
      h('div', { class: 'map-card__label' }, '动手试试'),
      h('ul', { style: { margin: '0', paddingLeft: '1.2em' } },
        stage.tasks.map((t) => h('li', null, katex.renderMixed(t))))
    ));
  }

  return {
    node: h('div', { class: 'stack' }, ...kids),
    destroy() {
      if (stepper) stepper.destroy();
      if (viz) viz.destroy();
      if (pseudo) pseudo.destroy();
    },
  };
}

function findPseudocodeStage(level, ref) {
  if (!level || !level.stages) return null;
  const pcs = level.stages.filter((s) => s.type === 'pseudocode');
  if (!pcs.length) return null;
  if (!ref) return pcs[0];
  return pcs.find((s) => s.algo === ref) || pcs[0];
}

function rCode(stage) {
  const kids = [stageHead(stage)];

  if (stage.intro) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.intro))));
  }

  const tabs = [
    { key: 'c', label: 'C 实现', build: () => {
        const box = h('div', { class: 'code-block' },
          h('pre', { class: 'code' }, stage.c.code));
        const notes = (stage.c.notes || []);
        return h('div', null,
          box,
          notes.length
            ? kvTable('C 代码要点', notes.map((n) => ['第 ' + n.line + ' 行', katex.renderMixed(n.zh)]))
            : null,
          (stage.c.tests && stage.c.tests.length)
            ? kvTable('自测用例',
                stage.c.tests.map((t) => [t.in, '→ ' + t.out, true]))
            : null
        );
      } },
  ];

  if (stage.mapping && stage.mapping.length) {
    tabs.push({ key: 'map', label: '伪代码 ↔ C 对应表', build: () =>
      kvTable('每一句伪代码落在哪一行 C 代码',
        stage.mapping.map((m) => ['书第 ' + m.pc + ' 行  ' + m.pcCode, m.c])) });
  }

  if (stage.engine) {
    tabs.push({ key: 'engine', label: '驱动动画的实现（可选）', build: () =>
      h('div', null,
        h('p', { class: 'card__meta' },
          '页面上的动画由一份 JS 生成器驱动：它每 yield 一次就输出一帧状态。' +
          '这份实现不要求你读，但它是「同一份代码既是实现、又是动画数据源」的由来。'),
        stage.engine.code
          ? h('pre', { class: 'code' }, stage.engine.code)
          : h('p', { class: 'card__meta' }, stage.engine.note || '')),
    });
  }

  const panel = h('div', null);
  const bar = h('div', { class: 'viz-controls' });
  let active = tabs[0].key;

  function paint() {
    bar.replaceChildren(
      ...tabs.map((t) =>
        h('button', {
          class: 'btn btn--sm' + (t.key === active ? ' btn--primary' : ''),
          type: 'button',
          'aria-pressed': t.key === active ? 'true' : 'false',
          onClick: () => { active = t.key; paint(); },
        }, t.label)
      )
    );
    const cur = tabs.find((t) => t.key === active) || tabs[0];
    panel.replaceChildren(cur.build());
  }
  paint();

  kids.push(bar, panel);
  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

function rAnalyze(stage) {
  const kids = [stageHead(stage)];

  if (stage.claims && stage.claims.length) {
    kids.push(kvTable('结论一览',
      stage.claims.map((c) => [
        c.when || '—',
        h('span', null,
          katex.renderMixed('$' + c.expr + '$'),
          ' ',
          pageRef(c.page, c.preview),
          c.source === 'instructor'
            ? h('span', { class: 'drill-badge' }, ' · 本站补充推导')
            : null
        ),
      ])
    ));
  }

  (stage.tables || []).forEach((t) => {
    kids.push(kvTable(t.caption, t.rows.map((r) => [r[0], r[1], r[2]])));
  });

  const chart = stage.chart || stage.plot;
  if (chart && chart.series && chart.series.length && typeof chart.series[0] === 'object') {
    const series = chart.series.map((s) => ({
      name: s.name,
      color: s.color,
      fn: new Function('n', 'return ' + s.expr),
    }));
    kids.push(h('div', { class: 'growth' },
      growthChart({ series, xMax: chart.xMax || 16 }),
      growthLegend(series)
    ));
  }

  (stage.derivations || []).forEach((d) => {
    const body = h('div', { class: 'proof-step__body' },
      (d.steps || []).map((s) =>
        h('p', { style: { margin: '0 0 var(--sp-2)' } },
          s.tex ? katex.renderBlock(s.tex) : null,
          katex.renderMixed(s.zh || ''))
      )
    );
    kids.push(h('details', { class: 'proof-step', open: false },
      h('summary', null, d.title || '推导'), body));
  });

  if (stage.note) kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.note))));

  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

function rProve(stage) {
  const kids = [stageHead(stage)];

  if (stage.statement) {
    kids.push(h('div', { class: 'map-card' },
      h('div', { class: 'map-card__label' }, '要证的不变量'),
      h('p', { style: { margin: '0 0 var(--sp-2)' }, 'data-kind': 'source' }, katex.renderMixed(stage.statement)),
      pageRef(stage.page)
    ));
  }
  if (stage.intro) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.intro))));
  }

  (stage.steps || []).forEach((s, i) => {
    const body = h('div', { class: 'proof-step__body' },
      s.en ? h('p', null, h('span', { class: 'proof-step__en' }, s.en)) : null,
      ...(s.body || []).map((p) => h('p', { style: { margin: '0 0 var(--sp-2)' } }, katex.renderMixed(p))),
      s.page ? pageRef(s.page) : null
    );
    kids.push(h('details', { class: 'proof-step', open: i === 0 },
      h('summary', null, s.title || ('第 ' + (i + 1) + ' 步')), body));
  });

  if (stage.conclusion) {
    kids.push(h('div', { class: 'callout callout--ok' }, katex.renderMixed(stage.conclusion)));
  }

  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

function rDrill(stage, ctx) {
  const kids = [stageHead(stage)];
  const items = stage.items || [];
  const results = new Array(items.length).fill(null);
  const list = h('div', { class: 'drill-list' });
  const scoreEl = h('div', { class: 'callout', hidden: true });

  function finish() {
    const answered = results.filter((r) => r !== null).length;
    if (answered < items.length) return;
    const correct = results.filter((r) => r === true).length;
    const score = correct / items.length;
    // 保留历史最好成绩：重做时答得差不应把已记录的成绩抹掉（左侧进度会跟着倒退）。
    const prev = store.getQuiz(ctx.ch, ctx.section);
    if (prev == null || score > prev) store.setQuiz(ctx.ch, ctx.section, score);
    scoreEl.removeAttribute('hidden');
    const ok = score === 1;
    scoreEl.className = 'callout ' + (ok ? 'callout--ok' : 'callout--warn');
    scoreEl.replaceChildren(
      h('strong', null, ok ? '全对，本关测验通过。' : '得分 ' + correct + ' / ' + items.length),
      h('span', null, ok ? ' 下一阶段见。' : ' 回上面看看讲解，再点「重做」。')
    );
    if (ctx.onStageDone) ctx.onStageDone('drill', score);
  }

  function setResult(i, ok, whyEl) {
    results[i] = ok;
    if (whyEl) {
      whyEl.removeAttribute('hidden');
      whyEl.dataset.ok = ok ? '1' : '0';
    }
    finish();
  }

  items.forEach((it, i) => {
    const why = it.why
      ? h('p', { class: 'quiz__why', hidden: true }, katex.renderMixed(it.why))
      : null;
    let body;

    if (it.kind === 'judge') {
      const opts = [['对', true], ['错', false]];
      const btns = opts.map(([label, val]) =>
        h('button', {
          class: 'quiz__opt', type: 'button', role: 'radio',
          onClick: () => {
            const ok = it.answer === val;
            btns.forEach((b, bi) => {
              b.disabled = true;
              if (opts[bi][1] === it.answer) b.classList.add('is-correct');
              if (opts[bi][1] === val && !ok) b.classList.add('is-wrong');
            });
            setResult(i, ok, why);
          },
        }, label)
      );
      body = h('div', { class: 'quiz__options' }, btns);
    } else if (it.kind === 'single') {
      const opts = it.options || [];
      const btns = opts.map((o, oi) =>
        h('button', {
          class: 'quiz__opt', type: 'button', role: 'radio',
          onClick: () => {
            const ok = oi === it.answer;
            btns.forEach((b, bi) => {
              b.disabled = true;
              if (bi === it.answer) b.classList.add('is-correct');
              if (bi === oi && !ok) b.classList.add('is-wrong');
            });
            setResult(i, ok, why);
          },
        }, o)
      );
      body = h('div', { class: 'quiz__options' }, btns);
    } else if (it.kind === 'simulate') {
      const inp = h('input', { class: 'drill-input', type: 'text', 'aria-label': '你的答案',
        placeholder: it.placeholder || '例如：2 4 5 6 1 3' });
      const check = h('button', { class: 'btn btn--sm', type: 'button', onClick: () => {
        const got = inp.value.trim().split(/[\s,，]+/).filter(Boolean).map(Number);
        const exp = it.expect.map(Number);
        const ok = got.length === exp.length && got.every((v, k) => v === exp[k]);
        setResult(i, ok, why);
      } }, '检查');
      body = h('div', { class: 'row' }, inp, check);
    } else {
      body = h('p', { class: 'card__meta' }, '（题型 ' + it.kind + ' 暂无渲染器）');
    }

    list.appendChild(h('div', { class: 'quiz' },
      h('div', { class: 'quiz__q' }, katex.renderMixed(it.q)),
      body, why
    ));
  });

  kids.push(list, scoreEl);

  if (stage.bookExercises && stage.bookExercises.length) {
    kids.push(h('h3', { class: 'card__title' }, '原书习题'));
    kids.push(h('p', { class: 'card__meta' }, '以下为原书章末习题原文，只给提示不给答案 —— 卡住了再展开。'));
    stage.bookExercises.forEach((ex) => {
      kids.push(h('div', { class: 'drill-exercise' },
        h('div', { class: 'drill-exercise__head' },
          h('span', { class: 'drill-exercise__id' }, ex.id),
          pageRef(ex.page),
          ex.star ? h('span', { class: 'badge' }, '难度 ' + ex.star + ' / 5') : null
        ),
        h('p', { class: 'drill-exercise__stmt', 'data-kind': 'source' }, ex.statement),
        ex.hint
          ? h('details', { class: 'kit' },
              h('summary', null, '给个提示'), noteBlock(ex.hint))
          : null
      ));
    });
  }

  return { node: h('div', { class: 'stack' }, ...kids), destroy() {} };
}

const RENDERERS = {
  map: rMap,
  intuition: rIntuition,
  source: rSource,
  pseudocode: rPseudocode,
  visualize: rVisualize,
  code: rCode,
  analyze: rAnalyze,
  prove: rProve,
  drill: rDrill,
};

/**
 * 渲染一个阶段。
 * @param {object} stage 阶段对象（必须有 type）
 * @param {object} ctx   { level, ch, section, onStageDone }
 * @returns {{node: Node, destroy: Function}}
 */
export function renderStage(stage, ctx) {
  const fn = RENDERERS[stage.type];
  if (!fn) {
    return {
      node: h('div', { class: 'stack' },
        stageHead(stage),
        noteBlock(h('p', { style: { margin: '0' } }, '未知阶段类型：' + stage.type))),
      destroy() {},
    };
  }
  return fn(stage, ctx || {});
}
