/* =============================================================================
 * ui/registry.js — 可视化引擎 与 算法生成器 注册表（章节外壳 Agent 拥有）
 *
 * 为什么要有这一层：
 *   内容层（chapters/**）只声明 `viz: 'array'`、`algorithm: 'insertion-sort'`，
 *   不直接 import 具体模块。这样新增引擎/算法时，只改这里一个文件，
 *   149 个关卡文件都不用动。
 *
 * 契约：
 *   - viz 模块必须导出 create(container, opts) -> { render, resize, destroy }
 *     （见 docs/开发规范.md 4.4）
 *   - algorithm 必须是「生成器函数」，每个 yield 一帧，帧字段见 4.3
 * ========================================================================== */

import * as vizArray from '../viz/array.js';
import * as vizTree from '../viz/tree.js';

import { insertionSort } from '../algorithms/insertion-sort.js';
import { mergeSort } from '../algorithms/merge-sort.js';
import { merge } from '../algorithms/merge.js';

const VIZ = new Map();
const ALGO = new Map();

/** 注册一个可视化引擎。引擎模块需导出 create()。 */
export function registerViz(name, mod) {
  if (!mod || typeof mod.create !== 'function') {
    throw new Error(`[registry] 可视化引擎 "${name}" 必须导出 create() 函数`);
  }
  VIZ.set(name, mod);
}

/** 注册一个算法生成器。fn 必须是 generator function。 */
export function registerAlgorithm(name, fn) {
  if (typeof fn !== 'function') {
    throw new Error(`[registry] 算法 "${name}" 必须是函数（生成器）`);
  }
  ALGO.set(name, fn);
}

export function getViz(name) {
  const m = VIZ.get(name);
  if (!m) {
    console.warn(`[registry] 找不到可视化引擎 "${name}"，可用：`, [...VIZ.keys()]);
  }
  return m || null;
}

export function getAlgorithm(name) {
  const f = ALGO.get(name);
  if (!f) {
    console.warn(`[registry] 找不到算法 "${name}"，可用：`, [...ALGO.keys()]);
  }
  return f || null;
}

export function listViz() {
  return [...VIZ.keys()];
}
export function listAlgorithms() {
  return [...ALGO.keys()];
}

/* ---------- 内置注册（新增引擎/算法时在此追加一行） ---------- */
registerViz('array', vizArray);
registerViz('tree', vizTree);

registerAlgorithm('insertion-sort', insertionSort);
registerAlgorithm('merge-sort', mergeSort);
registerAlgorithm('merge', merge);
