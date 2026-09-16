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
import * as vizGrowth from '../viz/growth.js';
import * as vizMatrix from '../viz/matrix.js';
import * as vizMatrixProduct from '../viz/matrix-product.js';
import * as vizHeap from '../viz/heap.js';
import * as vizLinked from '../viz/linked-list.js';

import { insertionSort } from '../algorithms/insertion-sort.js';
import { mergeSort } from '../algorithms/merge-sort.js';
import { merge } from '../algorithms/merge.js';
import { strassenDemo } from '../algorithms/strassen-demo.js';
import { matrixMultiplyDemo } from '../algorithms/matrix-multiply-demo.js';
import { hireAssistant } from '../algorithms/hire-assistant.js';
// 第 5 章 5.4 的四个概率实验：都用 array 引擎画，序列由预设输入给定（确定性，可单步）
import { birthdayCollisions } from '../algorithms/birthday-collisions.js';
import { ballsBins } from '../algorithms/balls-bins.js';
import { streaks } from '../algorithms/streaks.js';
import { onlineMaximum } from '../algorithms/online-maximum.js';
import { randomlyPermute } from '../algorithms/randomly-permute.js';
// 第 6 章堆排序：数组与二叉树双视图，全部过程共用一个 heap 引擎
import { heapIndexDemo } from '../algorithms/heap-index-demo.js';
import { maxHeapify } from '../algorithms/max-heapify.js';
import { buildMaxHeap } from '../algorithms/build-max-heap.js';
import { heapsort } from '../algorithms/heapsort.js';
import { heapExtractMax } from '../algorithms/heap-extract-max.js';
import { heapIncreaseKey } from '../algorithms/heap-increase-key.js';
import { heapInsert } from '../algorithms/heap-insert.js';
// 第 7 章快速排序：分区（7.1）与整体递归（7.1 / 7.2）
import { partition } from '../algorithms/partition.js';
import { quicksort } from '../algorithms/quicksort.js';
import { countingSort } from '../algorithms/counting-sort.js';
import { radixSort } from '../algorithms/radix-sort.js';
import { bucketSort } from '../algorithms/bucket-sort.js';
import { minMax } from '../algorithms/min-max.js';
import { stackDemo } from '../algorithms/stack.js';
import { queueDemo } from '../algorithms/queue.js';

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
// growth：不跑算法，画增长曲线 + c·g(n) 上界 + n₀（讲 O/Ω/Θ 用，见 viz/growth.js）
registerViz('growth', vizGrowth);
registerViz('matrix', vizMatrix);
registerViz('matrix-product', vizMatrixProduct);
// heap：同一个下标同时画在数组格子与树结点上（6.1 的全部内容就是这个对应关系）
registerViz('heap', vizHeap);
registerViz('linked-list', vizLinked);

registerAlgorithm('insertion-sort', insertionSort);
registerAlgorithm('merge-sort', mergeSort);
registerAlgorithm('merge', merge);
registerAlgorithm('strassen-demo', strassenDemo);
registerAlgorithm('matrix-multiply-demo', matrixMultiplyDemo);
registerAlgorithm('hire-assistant', hireAssistant);
registerAlgorithm('birthday-collisions', birthdayCollisions);
registerAlgorithm('balls-bins', ballsBins);
registerAlgorithm('streaks', streaks);
registerAlgorithm('online-maximum', onlineMaximum);
registerAlgorithm('randomly-permute', randomlyPermute);
registerAlgorithm('heap-index-demo', heapIndexDemo);
registerAlgorithm('max-heapify', maxHeapify);
registerAlgorithm('build-max-heap', buildMaxHeap);
registerAlgorithm('heapsort', heapsort);
registerAlgorithm('heap-extract-max', heapExtractMax);
registerAlgorithm('heap-increase-key', heapIncreaseKey);
registerAlgorithm('heap-insert', heapInsert);
registerAlgorithm('partition', partition);
registerAlgorithm('quicksort', quicksort);
registerAlgorithm('counting-sort', countingSort);
registerAlgorithm('radix-sort', radixSort);
registerAlgorithm('bucket-sort', bucketSort);
registerAlgorithm('min-max', minMax);
registerAlgorithm('stack', stackDemo);
registerAlgorithm('queue', queueDemo);
