// bst.js — 二叉搜索树引擎（第 12 章）
//
// 帧格式（配合 tree viz 使用）：yield { tree: { root, path }, phase }
//   - stages.js 会把 frame.tree 交给 tree.js 渲染（tree.js 只读 root / path）
//   - 节点的 state 用于高亮：'path'（当前路径）/ 'active'（当前节点）/
//     'compare'（比较过但不在路径上）/ 'done'（已定）/ 'violation'
//   - cost 用于在节点下方标注（如 'p→12'），label 显示 key
//
// 约定：第一个参数固定是面板的输入数组（引擎调用 algoFn(arr.slice(), ...args)）。

const STATE = { PATH: 'path', ACTIVE: 'active', CMP: 'compare', DONE: 'done', BAD: 'violation' };

/* 内部节点：{ key, left, right, p } */
function mknode(key) { return { key, left: null, right: null, p: null }; }

function bstInsert(root, key) {
  let z = mknode(key);
  let y = null, x = root;
  while (x !== null) { y = x; x = key < x.key ? x.left : x.right; }
  z.p = y;
  if (y === null) { return z; }
  if (key < y.key) { y.left = z; } else { y.right = z; }
  return root;
}

function buildTree(keys) {
  let root = null;
  for (const k of keys) { root = bstInsert(root, k); }
  return root;
}

/* 把内部树转成 tree.js 的节点对象；marks 是 Set(key) → state 映射 */
function toViz(node, markOf, pathKeys) {
  if (node === null) { return undefined; }
  const kids = [];
  const l = toViz(node.left, markOf, pathKeys);
  const r = toViz(node.right, markOf, pathKeys);
  if (l) { kids.push(l); }
  if (r) { kids.push(r); }
  const st = markOf ? markOf(node.key) : undefined;
  return {
    id: 'k' + node.key,
    label: String(node.key),
    cost: node.p === null ? 'root' : 'p→' + node.p.key,
    state: st,
    children: kids.length ? kids : undefined,
  };
}

function treeOf(root, marks, pathKeys) {
  const markOf = marks ? (k) => marks[k] : undefined;
  return { root: toViz(root, markOf, pathKeys), path: pathKeys || [] };
}

/* ------------------------------ 公开生成器 ------------------------------ */

/** 中序遍历（INORDER-TREE-WALK）：逐节点点亮 */
export function* bstInorder(arr, keys) {
  const root = buildTree(keys && keys.length ? keys : arr);
  const order = [];
  (function walk(x) { if (!x) { return; } walk(x.left); order.push(x.key); walk(x.right); })(root);
  for (let i = 0; i < order.length; i++) {
    const marks = {};
    for (let j = 0; j <= i; j++) { marks[order[j]] = j === i ? STATE.ACTIVE : STATE.DONE; }
    yield { tree: treeOf(root, marks, []), phase: `输出第 ${i + 1} 个：${order[i]}` };
  }
  yield { tree: treeOf(root, null, []), phase: `完成：${order.join(', ')}（升序）` };
}

/** 查找（TREE-SEARCH）：沿路径下降，比较过的节点标 compare */
export function* bstSearch(arr, keys, target) {
  const root = buildTree(keys && keys.length ? keys : arr);
  let x = root;
  const marks = {};
  yield { tree: treeOf(root, marks, []), phase: `TREE-SEARCH(T, ${target})：从根开始` };
  while (x !== null && x.key !== target) {
    marks[x.key] = STATE.CMP;
    yield { tree: treeOf(root, marks, []), phase: `x.key = ${x.key} ≠ ${target} → 往${target < x.key ? '左' : '右'}走` };
    x = target < x.key ? x.left : x.right;
  }
  if (x !== null) { marks[x.key] = STATE.ACTIVE; }
  yield { tree: treeOf(root, marks, []), phase: x ? `命中：${target}` : `走到 NIL：未找到 ${target}` };
}

/** 最小 / 最大（TREE-MINIMUM / TREE-MAXIMUM）：一路向左 / 向右 */
export function* bstMinMax(arr, keys, which) {
  const root = buildTree(keys && keys.length ? keys : arr);
  let x = root;
  const marks = {};
  while (x !== null) {
    marks[x.key] = STATE.PATH;
    yield { tree: treeOf(root, marks, []), phase: `${which === 'min' ? 'TREE-MINIMUM' : 'TREE-MAXIMUM'}：当前 ${x.key}` };
    x = which === 'min' ? x.left : x.right;
  }
  const res = which === 'min'
    ? (function m(n) { while (n.left) { n = n.left; } return n.key; })(root)
    : (function m(n) { while (n.right) { n = n.right; } return n.key; })(root);
  marks[res] = STATE.ACTIVE;
  yield { tree: treeOf(root, marks, []), phase: `结果：${res}（一路向${which === 'min' ? '左' : '右'}，无需回溯）` };
}

/** 后继（TREE-SUCCESSOR）：两种情况 */
export function* bstSuccessor(arr, keys, target) {
  const root = buildTree(keys && keys.length ? keys : arr);
  let x = root;
  const marks = {};
  while (x !== null && x.key !== target) { x = target < x.key ? x.left : x.right; }
  if (x === null) { yield { tree: treeOf(root, marks, []), phase: `${target} 不在树中` }; return; }
  marks[x.key] = STATE.PATH;
  if (x.right !== null) {
    yield { tree: treeOf(root, marks, []), phase: `${target} 有右子树 → 后继是右子树的最小节点` };
    let y = x.right;
    while (y.left !== null) { marks[y.key] = STATE.PATH; y = y.left; }
    marks[y.key] = STATE.ACTIVE;
    yield { tree: treeOf(root, marks, []), phase: `后继 = ${y.key}` };
  } else {
    let y = x.p;
    marks[x.key] = STATE.ACTIVE;
    yield { tree: treeOf(root, marks, []), phase: `${target} 没有右子树 → 向上找第一个"拐向左"的祖先` };
    while (y !== null && x === y.right) { marks[y.key] = STATE.CMP; x = y; y = y.p; }
    if (y) { marks[y.key] = STATE.ACTIVE; }
    yield { tree: treeOf(root, marks, []), phase: y ? `后继 = ${y.key}` : '后继 = NIL（它就是最大元）' };
  }
}

/** 插入（TREE-INSERT）：13 行伪代码的逐行走访 */
export function* bstInsertFrames(arr, keys, key) {
  let root = buildTree(keys && keys.length ? keys : arr);
  const marks = {};
  let y = null, x = root;
  yield { tree: treeOf(root, marks, []), phase: `TREE-INSERT(T, ${key})：z 是待插节点，y 记录父` };
  while (x !== null) {
    y = x;
    marks[x.key] = STATE.CMP;
    yield { tree: treeOf(root, marks, []), phase: `比较 ${key} 与 ${x.key} → 往${key < x.key ? '左' : '右'}走（y = ${x.key}）` };
    x = key < x.key ? x.left : x.right;
  }
  root = bstInsert(root, key);
  marks[key] = STATE.ACTIVE;
  yield { tree: treeOf(root, marks, []), phase: `挂到 ${y ? y.key + ' 的' + (key < y.key ? '左' : '右') + '孩子' : '根'}上（z.p = y 在插入前就设好了）` };
}

/** 删除（TREE-DELETE）：三种情况 + TRANSPLANT */
export function* bstDeleteFrames(arr, keys, key) {
  let root = buildTree(keys && keys.length ? keys : arr);
  const marks = {};
  // 找到 z
  let z = root;
  while (z !== null && z.key !== key) { z = key < z.key ? z.left : z.right; }
  if (z === null) { yield { tree: treeOf(root, marks, []), phase: `${key} 不在树中` }; return; }
  marks[z.key] = STATE.ACTIVE;

  const hasL = z.left !== null, hasR = z.right !== null;
  if (!hasL || !hasR) {
    yield { tree: treeOf(root, marks, []), phase: `情形 1/2：z = ${key} 至多一个孩子 → 用 TRANSPLANT 让孩子顶替` };
  } else {
    yield { tree: treeOf(root, marks, []), phase: `情形 3：z = ${key} 有两个孩子 → 找它的后继 y 来替换` };
    let y = z.right;
    while (y.left !== null) { marks[y.key] = STATE.PATH; y = y.left; }
    marks[y.key] = STATE.CMP;
    yield { tree: treeOf(root, marks, []), phase: `后继 y = ${y.key}（z 的右子树里最小的）` };
    marks[y.key] = STATE.ACTIVE;
    yield { tree: treeOf(root, marks, []), phase: `用 y 顶替 z 的位置；y 原来的右孩子接上 y 的父（TRANSPLANT）` };
  }

  // 真正执行删除（复用同一套逻辑）
  const transplant = (u, v) => {
    if (u.p === null) { root = v; }
    else if (u === u.p.left) { u.p.left = v; }
    else { u.p.right = v; }
    if (v !== null) { v.p = u.p; }
  };
  if (z.left === null) { transplant(z, z.right); }
  else if (z.right === null) { transplant(z, z.left); }
  else {
    let y = z.right;
    if (y.p !== z) { transplant(y, y.right); y.right = z.right; y.right.p = y; }
    transplant(z, y);
    y.left = z.left; y.left.p = y;
  }
  const rest = {};
  for (const k of (function all(n, acc) { if (!n) { return acc; } all(n.left, acc); acc.push(n.key); all(n.right, acc); return acc; })(root, [])) { rest[k] = STATE.DONE; }
  yield { tree: treeOf(root, rest, []), phase: `删除完成：中序仍是升序` };
}

/** 同一组 key 的两种极端形态：随机顺序插入 vs 升序插入（退化成链） */
export function* bstShape(arr, randomKeys, sortedKeys) {
  let r1 = buildTree(randomKeys);
  yield { tree: treeOf(r1, null, []), phase: `按 ${randomKeys.join(',')} 插入 → 树高较小` };
  const s = buildTree(sortedKeys);
  const marks = {};
  (function all(n) { if (!n) { return; } marks[n.key] = STATE.BAD; all(n.left); all(n.right); })(s);
  yield { tree: treeOf(s, marks, []), phase: `按升序 ${sortedKeys.join(',')} 插入 → 退化成一条链（树高 n−1）` };
}
