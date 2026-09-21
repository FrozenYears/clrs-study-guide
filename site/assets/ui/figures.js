/* =============================================================================
 * ui/figures.js — 原书插图（切图）的挂载组件
 *
 * 为什么需要它：本书插图用的是子集化字体，文本抽取出来是乱码（Figure 2.1 抽成
 * `♥ ♥ 2 ♥ 4 ♥`），只能按版式判据从 PDF 裁图保留（tools/04_figures.py）。
 * 关卡文案大量写「见 Figure 2.2」，此前页面上根本没有这张图 —— 读者只能凭文字想象。
 *
 * 三条约定：
 *   1) 只发布「关卡真的引用到」的图（清单由 tools/12_publish_figs.py 生成，
 *      写在 assets/data/figures.js）。没引用的图不进站点，白白多几 MB。
 *   2) 图号一律从**文本里**认（`Figure 12.1`、`Figures 34.8 与 34.9`），
 *      不在关卡数据里另加字段 —— 149 关 × 九段手写一遍不现实，而且文本本来就是依据。
 *   3) 一段里同一张图只出现一次；顺序按它在文本里第一次被提到的先后。
 *      图注逐字照 data/figures.json（与原书一致，含抽取造成的字符损坏，不"顺手改对"）。
 * ========================================================================== */

import { h } from '../core/dom.js';
import { FIGURES } from '../data/figures.js';

/* 正文里的引用写法：Figure 2.2 / Figures 12.1 与 12.2 / Figures 13.5 and 13.6 /
 * Figure 34.8(b)。"Figures" 后面常跟一串图号，只有第一个带前缀 ——
 * 习题题干里就是这么写的（34.3-3 那条就是 "Figures 13.5 and 13.6"），
 * 只认第一个的话，读者看到的图缺一半。
 * 分隔符表必须严格限定在「, 、 和 与 and &」，不能写成通用空白：
 * 一旦允许纯空格，"Figure 3.2 比 2.1 晚" 这种句子会把 2.1 也吞进来。 */
const FIG_REF_RE = /Figures?\s+(\d+\.\d+(?:\s*(?:[,、]|和|与|and|&)\s*(?:Figures?\s+)?\d+\.\d+)*)/g;
const ID_RE = /(\d+\.\d+)/g;

/** 按文本里第一次出现的顺序，返回去重后的图号数组。 */
export function figuresIn(text) {
  const out = [];
  if (typeof text !== 'string' || !text) return out;
  FIG_REF_RE.lastIndex = 0;
  let m;
  while ((m = FIG_REF_RE.exec(text))) {
    ID_RE.lastIndex = 0;
    let g;
    while ((g = ID_RE.exec(m[1]))) {
      if (out.indexOf(g[1]) < 0) out.push(g[1]);
    }
  }
  return out;
}

/** 递归收集一个阶段对象里所有字符串里的图号（保持首次出现顺序）。 */
export function figuresOfStage(stage) {
  const out = [];
  const seen = new Set();
  (function walk(v) {
    if (typeof v === 'string') {
      for (const id of figuresIn(v)) {
        if (!seen.has(id) && FIGURES[id]) { seen.add(id); out.push(id); }
      }
      return;
    }
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k]));
  })(stage);
  return out;
}

/** 一张图：图 + 图注（图注里带原书印刷页）。图不在清单里就返回 null。 */
export function figureNode(id) {
  const f = FIGURES[id];
  if (!f) return null;
  // 切图是 200 DPI 的书页裁块，窄屏上按比例缩小时小字会糊 ——
  // 所以整张图可点开看 1:1 原图（同一份本地文件，不引第三方灯箱）。
  return h('figure', { class: 'book-fig' },
    h('a', { class: 'book-fig__link', href: f.src, target: '_blank', rel: 'noopener',
             title: '点开看 1:1 原图（本地文件，不走网络）' },
      h('img', {
        src: f.src,
        alt: f.caption,
        loading: 'lazy',
        width: f.w || undefined,
        height: f.h || undefined,
      })),
    h('figcaption', { class: 'book-fig__cap', 'data-kind': 'source' },
      f.caption,
      f.page ? h('span', { class: 'book-fig__page' }, '原书印刷页 ' + f.page) : null)
  );
}

/** 一段末尾的「本段引用的原书插图」板块；一张都没有就返回 null（不占位）。 */
export function figurePlate(stage) {
  const ids = figuresOfStage(stage);
  if (!ids.length) return null;
  const kids = ids.map(figureNode).filter(Boolean);
  if (!kids.length) return null;
  return h('div', { class: 'fig-plate' },
    h('div', { class: 'fig-plate__label' },
      '本段引用的原书插图（' + kids.length + ' 张，按 PDF 裁图，非重绘）'),
    ...kids);
}

export default { figuresIn, figuresOfStage, figureNode, figurePlate };
