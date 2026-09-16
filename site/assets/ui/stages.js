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
import { chartSVG, chartLegend } from '../viz/growth.js';

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
    // 原文必须原样呈现（衬线体 + data-kind="source"），不做任何标记解析
    kids.push(h('p', { class: 'src-block__en', 'data-kind': 'source' }, block.en));
  }
  if (block.zh) {
    kids.push(h('p', { class: 'src-block__zh', 'data-kind': 'note' }, katex.renderMixed(block.zh)));
  }
  if (block.note) {
    kids.push(h('p', { class: 'src-block__zh', 'data-kind': 'note' }, katex.renderMixed(block.note)));
  }
  return h('div', { class: 'src-block' }, ...kids);
}

function termCards(terms) {
  return h('div', { class: 'term-list' },
    (terms || []).map((t) =>
      h('span', { class: 'term', title: '原书印刷页 ' + t.page },
        h('span', { class: 'term-en' }, t.en),
        h('span', { class: 'term-zh' }, katex.renderMixed(t.zh))
      )
    )
  );
}

/**
 * 表格单元格内容。
 * - 字符串：走 renderMixed，于是 $公式$ 与 **粗体** 都能用（关卡文案大量依赖）。
 * - 已渲染好的 Node：原样使用（rAnalyze 的 claims 就把一个 span 传进来）。
 * 注意：单元格里不放代码 —— 按规范，C 代码走「代码轨道」的代码块，不进表格。
 */
function cell(v) {
  if (v == null) return null;
  return typeof v === 'string' ? katex.renderMixed(v) : v;
}

function kvTable(caption, rows, opts) {
  // opts.cls 用来给不同用法的表挂不同的排版类（见 level.css 的 .kv--claims）
  return h('table', { class: 'kv' + (opts && opts.cls ? ' ' + opts.cls : '') },
    caption ? h('caption', caption) : null,
    h('tbody', rows.map((r) =>
      h('tr', null,
        h('th', { scope: 'row' }, cell(r[0])),
        h('td', { class: r[2] ? 'mono' : null }, cell(r[1]))
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
      h('summary', null, katex.renderMixed('数学急救包 · ' + k.title)),
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
    // 两种 interactive 的返回值形状不同：cardsHandGame 返回 {node, destroy}，
    // 而这里只想插一个说明块。统一包成 {node}，否则下面的 inner.node 会是 undefined。
    inner = { node: h('div', { class: 'viz-note' }, katex.renderMixed(stage.interactive.text)) };
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

/**
 * 渲染「一段伪代码」：标题行 + 可点行的代码表。
 * 单独抽出来，是因为分治类章节一关里常有两段配套伪代码
 * （如 2.3 的 MERGE-SORT 与它调用的 MERGE），用 stage.more 追加。
 */
function pseudoListing(listing) {
  const kids = [];
  kids.push(h('div', { class: 'row' },
    h('span', { class: 'pc-ref' }, listing.signature || listing.algo),
    pageRef(listing.page)
  ));
  const table = pseudocodeTable(listing.lines, { interactive: true });
  kids.push(table.node);
  kids.push(h('p', { class: 'card__meta' },
    listing.hint || '点任意一行，看它到底在做什么。'));
  if (listing.vars && listing.vars.length) {
    kids.push(kvTable('变量表', listing.vars.map((v) => [v.name, katex.renderMixed(v.meaning)])));
  }
  if (listing.note) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(listing.note))));
  }
  return { node: h('div', { class: 'stack' }, ...kids), destroy: table.destroy };
}

function rPseudocode(stage) {
  const kids = [stageHead(stage)];
  if (stage.lead) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.lead))));
  }

  const listings = [stage].concat(Array.isArray(stage.more) ? stage.more : []);
  const rendered = listings.map(pseudoListing);
  rendered.forEach((r, i) => {
    if (rendered.length > 1) {
      const sub = listings[i].subtitle || listings[i].signature || listings[i].algo;
      kids.push(h('h3', { class: 'card__title' }, (i + 1) + ' · ' + sub));
    }
    kids.push(r.node);
  });

  return {
    node: h('div', { class: 'stack' }, ...kids),
    destroy() { rendered.forEach((r) => r.destroy()); },
  };
}

/**
 * 渲染一个「可视化面板」：一个引擎 + 一个驱动源 + 一套控制条。
 *
 * 为什么单独抽出来：分治类关卡一关里常要并排看两个动作
 * （2.3 既要看 MERGE-SORT 的整体递归，也要看 MERGE 合并这一步）。
 * 上层用 stage.panels = [spec, spec] 声明；不写 panels 时，
 * stage 自身就是唯一的面板，老关卡完全不受影响。
 */
/**
 * 增长曲线面板（viz: 'growth'）—— 不跑算法，只画图。
 *
 * 为什么需要它：九段式第 5 段原本只支持「有算法可单步」的引擎，而第 3 章这类
 * 「记号与函数」的节没有算法可跑，它要看见的是增长速度怎么分开。
 *
 * 带 band（c·g(n) 上界）时额外给两个滑杆：常数 c 与起点 n₀。
 * 拖它们就能亲眼看到「存在 c 与 n₀，使所有 n ≥ n₀ 都有 f(n) ≤ c·g(n)」
 * 这句定义到底在说什么 —— 这正是原书 Figure 3.2 想表达的东西。
 */
function makeChartPanel(stage) {
  const vizMod = getViz('growth');
  if (!vizMod) {
    return {
      node: noteBlock(h('p', { style: { margin: '0' } },
        '可视化引擎「growth」尚未注册（见 site/assets/ui/registry.js）。')),
      destroy() {},
    };
  }

  const spec = Object.assign({}, stage.chart);
  const band = spec.band ? Object.assign({ n0: 1, c: 1 }, spec.band) : null;
  spec.band = band;
  const xMax = spec.xMax || 32;
  const first = (spec.series || [])[0] || null;

  const host = h('div', { class: 'viz-stage' });
  const readout = h('div', { class: 'viz-readout' });
  const noteEl = h('div', { class: 'viz-note' },
    stage.note
      ? katex.renderMixed(stage.note)
      : '拖动滑杆，看「从某一刻起一直成立」是什么意思。');
  const viz = vizMod.create(host, {});

  /** 在 n₀ 之后的每个整数点上验证 f(n) ≤ c·g(n)。 */
  function verdict() {
    if (!band || !first) return null;
    const fnF = new Function('n', 'return ' + first.expr);
    const fnG = new Function('n', 'return ' + band.g);
    for (let n = band.n0; n <= xMax; n++) {
      const lhs = fnF(n);
      const rhs = band.c * fnG(n);
      if (lhs > rhs + 1e-9) return { ok: false, n, lhs, rhs };
    }
    return { ok: true };
  }

  function refresh() {
    viz.render(spec);
    const kids = [];
    if (band) {
      kids.push(h('span', { class: 'badge' }, 'c = ' + band.c));
      kids.push(h('span', { class: 'badge' }, 'n₀ = ' + band.n0));
      const v = verdict();
      kids.push(h('span', {
        class: 'badge' + (v.ok ? ' badge--done' : ''),
        style: v.ok ? null : { borderColor: 'var(--viz-violation)', color: 'var(--viz-violation)' },
      }, v.ok
        ? '✓ 所有 n ≥ n₀ 都满足 f(n) ≤ c·g(n)'
        : '✗ 在 n = ' + v.n + ' 处不成立（' + Math.round(v.lhs) + ' > ' + Math.round(v.rhs) + '）'));
    }
    readout.replaceChildren(...kids);   // kids 是数组，必须展开，否则 DOM 里出现 [object HTMLSpanElement]
  }

  const controls = h('div', { class: 'chart-controls' });
  if (band) {
    const mk = (label, min, max, value, onInput) => {
      const input = h('input', {
        class: 'speed-range', type: 'range', min: String(min), max: String(max), step: '1',
        value: String(value), 'aria-label': label,
        onInput: (e) => { onInput(Number(e.target.value)); refresh(); },
      });
      return h('label', { class: 'chart-control' }, h('span', null, label), input);
    };
    controls.appendChild(mk('常数 c', 1, 10, band.c, (v) => { band.c = v; }));
    controls.appendChild(mk('起点 n₀', 1, Math.max(2, Math.floor(xMax / 2)), band.n0, (v) => { band.n0 = v; }));
  }

  refresh();

  return {
    node: h('div', { class: 'viz-panel' },
      controls.childElementCount ? controls : null,
      host,
      readout,
      noteEl),
    destroy() { viz.destroy(); },
  };
}

function makeVizPanel(stage, ctx) {
  // 增长曲线模式：没有算法可单步，交给专用面板（画图 + c/n₀ 滑杆）
  if (stage.viz === 'growth' && stage.chart) return makeChartPanel(stage);

  const vizMod = getViz(stage.viz);
  const algoFn = getAlgorithm(stage.algorithm);
  // 三种驱动方式：
  //   1) algorithm：由算法生成器产帧（最常用）
  //   2) trees：给一串「逐层展开」的静态树，帧 0..n-1 依次渲染 —— 用于递归树的
  //      逐步展开（Figure 2.4 / 2.5），不需要算法生成器
  //   3) 两者都没有 -> 提示未注册
  const treeSeq = Array.isArray(stage.trees) && stage.trees.length ? stage.trees : null;
  if (!vizMod || (!algoFn && !treeSeq)) {
    return {
      node: h('div', null,
        noteBlock(h('p', { style: { margin: '0' } },
          `可视化引擎「${stage.viz}」或算法「${stage.algorithm}」尚未注册。`))),
      destroy() {},
    };
  }

  const presets = !treeSeq
    ? (stage.presets && stage.presets.length
        ? stage.presets
        : [{ name: '默认输入', array: (stage.input && stage.input.array) || [] }])
    : [];

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

  // 预跑一遍数帧数（n 很小，成本可忽略）。args 必须和真正跑动画时一致，
  // 否则步进器的总帧数会与预设不匹配（帧计数显示就会错）。
  function countFrames(arr, args) {
    let n = 0;
    const it = algoFn(arr.slice(), ...(args || []));
    for (let r = it.next(); !r.done; r = it.next()) n++;
    return n;
  }

  /** 静态树序列：把它包装成一个「每帧一棵树」的生成器，复用同一套步进控制。 */
  function* treeSeqGen() {
    for (let i = 0; i < treeSeq.length; i++) {
      yield { line: null, note: (stage.treeNotes && stage.treeNotes[i]) || `展开第 ${i} 步` };
    }
  }

  function build(idx) {
    presetIndex = idx;
    if (stepper) { stepper.destroy(); stepper = null; }
    if (viz) { viz.destroy(); viz = null; }
    host.replaceChildren();
    viz = vizMod.create(host, {
      mode: stage.vizMode || 'bars',
      // 有些算法的状态说法与引擎内置的通用标签不同（PARTITION 的两侧是「≤ x / > x」），
      // 关卡可以覆写标签文字；不写就沿用引擎默认。
      stateLabels: stage.stateLabels,
    });

    const speedMs = Number(speed.value) || 650;
    const arr = treeSeq ? [] : presets[idx].array.slice();
    // 生成器的额外参数：预设自带 args 时优先用它 —— 同一块面板就能演示
    // 「换个输入数组」之外的「换个起点」（如 MAX-HEAPIFY 的 i）或「换个容量」。
    // 预设没写 args 时沿用面板级的 stage.algoArgs，已有关卡的行为不受影响。
    // ★ treeSeq（静态树序列）时 presets 是空数组，presets[idx] 不存在，必须先判空，
    //   否则 tree 面板会在这里抛 TypeError、整页空白（冒烟测试会抓到，但肉眼很难看出原因）。
    const preset = treeSeq ? null : presets[idx];
    const algoArgs = preset && Array.isArray(preset.args) ? preset.args : (stage.algoArgs || []);
    stepper = createStepper(
      treeSeq ? treeSeqGen() : algoFn(arr.slice(), ...algoArgs),
      { mount: host, speed: speedMs, total: treeSeq ? treeSeq.length : countFrames(arr, algoArgs) }
    );

    stepper.onFrame((frame, state) => {
      // 递归树类帧把树放在 frame.tree 上；静态树序列直接取第 index 棵。
      if (treeSeq) viz.render(treeSeq[Math.min(state.index, treeSeq.length - 1)]);
      else viz.render(frame && frame.tree ? frame.tree : frame);
      if (pseudo) pseudo.setActive(frame.line);
      counterEl.textContent = `帧 ${state.index} / ${Math.max(0, (state.total || 0) - 1)}` +
        (state.playing ? ' · 播放中' : state.done ? ' · 已结束' : '');
      btnPlay.textContent = state.playing ? '暂停' : '播放';
      if (frame.note) noteEl.replaceChildren(katex.renderMixed(frame.note));
      // 计数读数：cmp / move 有默认中文标签（沿用第 2 章的「比较 / 写回」说法）。
      // 需要别的计数项时，关卡在 visualize 阶段声明 countLabels，
      //   countLabels: { throws: '已投掷' }                          → 已投掷 7 次
      //   countLabels: { leaves: { label: '叶子结点', unit: '个' } }   → 叶子结点 5 个
      // 写字符串时单位默认「次」；要「个 / 人 / 对 / 号」这类量词就写对象。
      // —— 不是洁癖：把「叶子结点 5 个」写成「叶子结点 5 次」会让读数读起来是错的。
      const c = frame.counts || {};
      const labels = Object.assign({ cmp: '比较', move: '写回' }, stage.countLabels || {});
      const readout = [];
      if (c.line5 != null) {
        readout.push(h('span', {
          class: 'badge',
          title: '书中 2.2 的 Σtᵢ：第 5 行被求值的次数，含每轮最后一次为假的那次判断',
        }, '第 5 行求值 Σtᵢ = ' + c.line5));
      }
      Object.keys(labels).forEach((k) => {
        if (c[k] == null) return;
        const spec = labels[k];
        const label = typeof spec === 'string' ? spec : spec.label;
        const unit = typeof spec === 'string' ? '次' : (spec.unit || '次');
        readout.push(h('span', { class: 'badge' }, label + ' ' + c[k] + ' ' + unit));
      });
      readout.push(h('span', { class: 'badge' }, '当前行 ' + (frame.line ?? '—')));
      readoutEl.replaceChildren(...readout);
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
    presets.length
      ? h('label', { class: 'card__meta' }, '输入 ')
      : null,
    presets.length ? presetSel : null,
    h('label', { class: 'card__meta' }, '速度 '),
    speed
  );

  build(0);

  const vizPanel = h('div', { class: 'viz-panel' },
    host, controls, controls2, noteEl, readoutEl, invEl);

  const kids = [];
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

/** 可视化阶段。默认一块面板；stage.panels 可声明多块。 */
function rVisualize(stage, ctx) {
  const specs = Array.isArray(stage.panels) && stage.panels.length
    ? stage.panels.map((p) => Object.assign({}, p, { viz: p.viz || stage.viz }))
    : [stage];

  const kids = [stageHead(stage)];
  if (stage.lead) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.lead))));
  }

  const panels = specs.map((spec) => makeVizPanel(spec, ctx));
  panels.forEach((p, i) => {
    if (panels.length > 1) {
      kids.push(h('h3', { class: 'card__title' }, '（' + (i + 1) + '）' + (specs[i].title || '')));
    }
    kids.push(p.node);
  });
  if (stage.tail) {
    kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.tail))));
  }

  return {
    node: h('div', { class: 'stack' }, ...kids),
    destroy() { panels.forEach((p) => p.destroy()); },
  };
}

function findPseudocodeStage(level, ref) {
  if (!level || !level.stages) return null;
  // 一个阶段里可能有主伪代码 + stage.more 的配套伪代码（如 MERGE-SORT 与 MERGE），
  // 所以要一并检索，动画才能按算法名找对高亮的那张表。
  const all = [];
  level.stages
    .filter((s) => s.type === 'pseudocode')
    .forEach((s) => { all.push(s); (s.more || []).forEach((m) => all.push(m)); });
  if (!all.length) return null;
  if (!ref) return all[0];
  return all.find((s) => s.algo === ref) || all[0];
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
      ]),
      { cls: 'kv--claims' }
    ));
  }

  (stage.tables || []).forEach((t) => {
    kids.push(kvTable(t.caption, t.rows.map((r) => [r[0], r[1], r[2]])));
  });

  const chart = stage.chart || stage.plot;
  if (chart && chart.series && chart.series.length && typeof chart.series[0] === 'object') {
    // 绘图只有一份实现（viz/growth.js），analyze 与 visualize 共用，避免两处漂移
    const spec = Object.assign({}, chart, { xMax: chart.xMax || 16 });
    kids.push(h('div', { class: 'growth' }, chartSVG(spec), chartLegend(spec)));
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

  // 有的分析阶段需要用**递归树**把推导画出来（如 2.3 的 Figure 2.5）。
  // 直接复用可视化面板，避免再写一套控制器。
  let treePanel = null;
  if (stage.trees || stage.algorithm) {
    treePanel = makeVizPanel({
      viz: stage.viz || 'tree',
      vizMode: stage.vizMode,
      algorithm: stage.algorithm,
      trees: stage.trees,
      treeNotes: stage.treeNotes,
      presets: stage.presets,
      input: stage.input,
      algoArgs: stage.algoArgs,
      pseudocodeRef: stage.pseudocodeRef,
      invariants: stage.invariants,
    }, {});
    kids.push(h('h3', { class: 'card__title' }, stage.figureTitle || '递归树'));
    kids.push(treePanel.node);
  }

  if (stage.note) kids.push(noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(stage.note))));

  return {
    node: h('div', { class: 'stack' }, ...kids),
    destroy() { if (treePanel) treePanel.destroy(); },
  };
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
        }, katex.renderMixed(o))
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
              h('summary', null, '给个提示'),
              noteBlock(h('p', { style: { margin: '0' } }, katex.renderMixed(ex.hint))))
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
