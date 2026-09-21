/* =============================================================================
 * __tests-figures__.mjs — 原书插图挂载的自检
 *
 * 跑法：cd site && node assets/ui/__tests-figures__.mjs
 *
 * 钉住四件事：
 *   ① 图号识别：只认 "Figure X.Y" / "Figures X.Y"（正文与题干就这么写），
 *      顺序 = 首次被提到的顺序，且一段内不重复。
 *   ② 清单完整性：assets/data/figures.js 里每一条的 src 必须真的在 site/figs/ 下，
 *      字节数 > 1000（防止 04_figures.py 裁出空白图）；页码必须是整数。
 *      —— 这一条是「清单说有色文件没有」这种一半发布状态的唯一防线。
 *   ③ 降级：图号不在清单里（例如将来某关引用了一张还没切的图）→ 不产节点、不报错，
 *      而不是往页面上留一个碎图。
 *   ④ 结构：figure 里有 <img alt=图注>、图注带印刷页，且图注节点标 data-kind="source"
 *      （原文与讲解的视觉惯例是红线 R3）。
 * ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..', '..');

/* ---- 最小 DOM 桩（与 __tests-katex__ 同一套，够 dom.js 用） ---- */
class N {
  constructor(nodeType, nodeName) {
    this.nodeType = nodeType; this.nodeName = nodeName;
    this.childNodes = []; this._text = ''; this.attributes = {};
    this.style = { setProperty() {} };
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  removeAttribute(k) { delete this.attributes[k]; }
  get dataset() { return this._d || (this._d = {}); }
  appendChild(c) {
    if (!c) return c;
    if (c.nodeType === 11) {
      const kids = c.childNodes.slice(); c.childNodes.length = 0;
      kids.forEach((k) => this.appendChild(k)); return c;
    }
    this.childNodes.push(c); c.parentNode = this; return c;
  }
  get textContent() {
    if (this.nodeType === 3) return this._text;
    return this.childNodes.map((c) => c.textContent).join('');
  }
  get tagName() { return this.nodeName; }
  get className() { return this.attributes.class || ''; }
  set className(v) { this.attributes.class = v; }
}
globalThis.document = {
  createElement: (t) => new N(1, String(t).toUpperCase()),
  createElementNS: (ns, t) => new N(1, String(t).toUpperCase()),
  createTextNode: (t) => Object.assign(new N(3, '#text'), { _text: String(t) }),
  createDocumentFragment: () => new N(11, '#fragment'),
  documentElement: new N(1, 'HTML'),
};
globalThis.window = { location: { hash: '' }, addEventListener() {}, removeEventListener() {} };
globalThis.location = { hash: '', href: 'file:///x' };

const { figuresIn, figuresOfStage, figureNode, figurePlate } = await import(
  url.pathToFileURL(path.join(HERE, 'figures.js')).href);
const { FIGURES } = await import(
  url.pathToFileURL(path.join(SITE, 'assets/data/figures.js')).href);

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, extra === undefined ? '' : String(extra)); }
}
function find(node, tag, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (node.tagName === tag) out.push(node);
  (node.childNodes || []).forEach((c) => find(c, tag, out));
  return out;
}

console.log('\n[1] 图号识别');
{
  ok('认 Figure 2.2', JSON.stringify(figuresIn('看 Figure 2.2 的橙色箭头')) === '["2.2"]');
  ok('认 Figures 复数形式',
    JSON.stringify(figuresIn('Figures 13.5 与 13.6 各')) === '["13.5","13.6"]');
  ok('带后缀的引用也认（Figure 34.8(b)）',
    JSON.stringify(figuresIn('the circuit in Figure 34.8(b)')) === '["34.8"]');
  ok('不认正文里的裸数字', JSON.stringify(figuresIn('lines 12.5 and 3')) === '[]');
  ok('顺序 = 首次出现顺序、且去重',
    JSON.stringify(figuresIn('Figure 3.2 比 Figure 2.1 晚，再回看 Figure 3.2')) === '["3.2","2.1"]');
  ok('空输入不炸', JSON.stringify(figuresIn(null)) === '[]' && JSON.stringify(figuresIn('')) === '[]');
}

console.log('\n[2] 清单完整性（每条 src 都要有文件）');
{
  const ids = Object.keys(FIGURES);
  ok('清单非空', ids.length > 80, ids.length);
  let missing = [], tiny = [], badpage = [];
  for (const id of ids) {
    const f = FIGURES[id];
    const p = path.join(SITE, f.src);
    if (!f.src.startsWith('figs/')) missing.push(id + ' src 不在 figs/ 下');
    if (!fs.existsSync(p)) { missing.push(id); continue; }
    if (fs.statSync(p).size < 1000) tiny.push(id);
    if (!Number.isInteger(f.page)) badpage.push(id);
  }
  ok('每条 src 都指向真实文件', missing.length === 0, missing.slice(0, 6));
  ok('没有可疑的小图（<1000 字节）', tiny.length === 0, tiny.slice(0, 6));
  ok('页码都是整数', badpage.length === 0, badpage.slice(0, 6));
  const dirPng = fs.readdirSync(path.join(SITE, 'figs')).filter((f) => f.endsWith('.png'));
  ok('site/figs 里没有孤儿文件（清单外的图）',
    dirPng.length === ids.length, dirPng.length + ' vs ' + ids.length);
}

console.log('\n[3] 降级：没发布过的图号不产节点');
{
  ok('figureOf 未知编号返回 null', figureNode('99.9') === null);
  ok('stage 只引用未发布的图 → 整块不出现',
    figurePlate({ type: 'map', lead: '见 Figure 99.9' }) === null);
  ok('stage 什么都不引用 → null（不占位）',
    figurePlate({ type: 'map', lead: '没有图' }) === null);
}

console.log('\n[4] 段尾板块的结构与顺序');
{
  // 图号取清单里真实存在的两个（别写死编号：清单会随关卡引用增减而变）
  const two = Object.keys(FIGURES).slice(0, 2);
  const stage = {
    type: 'source',
    lead: '先说 Figure ' + two[0],
    blocks: [
      { kind: 'body', page: 19, en: 'as Figure ' + two[1] + ' shows' },
      { kind: 'body', page: 19, en: 'again Figure ' + two[0] },
    ],
    extra: { note: 'Figure 99.9 这张还没发布，不该出现在板块里' },
  };
  const ids = figuresOfStage(stage);
  ok('按首次提到顺序、去重、且不含未发布的',
    JSON.stringify(ids) === JSON.stringify(two), JSON.stringify(ids));
  const plate = figurePlate(stage);
  ok('板块生成成功', !!plate);
  const figs = find(plate, 'FIGURE');
  ok('一张图一个 figure', figs.length === 2, figs.length);
  const img = find(plate, 'IMG')[0];
  ok('<img> 带 src / alt / loading=lazy',
    !!img && /figs\//.test(img.attributes.src || '') &&
    !!img.attributes.alt && img.attributes.loading === 'lazy',
    img && img.attributes);
  const cap = find(plate, 'FIGCAPTION')[0];
  ok('图注原样带 "Figure" 字样并标 data-kind=source',
    /Figure \d/.test(cap.textContent) && cap.attributes['data-kind'] === 'source',
    cap.textContent.slice(0, 60));
  ok('图注里带印刷页', /原书印刷页 \d+/.test(cap.textContent), cap.textContent.slice(-24));
  const a = find(plate, 'A')[0];
  ok('图可点开看 1:1 原图（同一份本地文件的链接）',
    !!a && /^figs\//.test(a.attributes.href || ''), a && a.attributes);
}

console.log(`\n==== 结果：${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
