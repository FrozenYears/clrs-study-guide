// rbtree.js — 13.3/13.4 红黑树引擎（RB-INSERT + RB-INSERT-FIXUP，含旋转）
//
// 帧格式：yield { tree: { root }, phase }
//   节点 state：'rb-red' / 'rb-black'（tree.js 已扩展这两种填充色）。
//   ★ 所有对 root 的更新都在同一个生成器作用域内完成（旋转会换根）。

function mk(key) { return { key, left: null, right: null, p: null, red: true }; }

/* LEFT-ROTATE 的直译；返回新子树根，调用方接回 */
function leftRotate(root, x) {
  const y = x.right;
  x.right = y.left;
  if (y.left) { y.left.p = x; }
  y.p = x.p;
  if (!x.p) { root = y; }
  else if (x === x.p.left) { x.p.left = y; }
  else { x.p.right = y; }
  y.left = x; x.p = y;
  return root;
}

function rightRotate(root, x) {
  const y = x.left;
  x.left = y.right;
  if (y.right) { y.right.p = x; }
  y.p = x.p;
  if (!x.p) { root = y; }
  else if (x === x.p.right) { x.p.right = y; }
  else { x.p.left = y; }
  y.right = x; x.p = y;
  return root;
}

/* 普通插入（不含 FIXUP）——返回新根；z 已挂好且为红 */
function plainInsert(root, key) {
  const z = mk(key);
  let y = null, x = root;
  while (x !== null) { y = x; x = key < x.key ? x.left : x.right; }
  z.p = y;
  if (!y) { root = z; }
  else if (key < y.key) { y.left = z; } else { y.right = z; }
  return { root, z };
}

/** 公开：RB-INSERT 动画。args = [keys, newKey]
 *  先按 keys 依次插入构建（不产帧），再对 newKey 产帧。 */
export function* rbInsertFrames(arr, keys, newKey) {
  let root = null;
  for (const k of (keys && keys.length ? keys : arr)) {
    const r = plainInsert(root, k);
    root = r.root;
    // 构建：直接跑 FIXUP（无帧）
    while (r.z.p && r.z.p.red) {
      // 简化：构建阶段的 fixup 用同一套逻辑但不产帧 —— 复用下文的 fixup 步进器
      const st = fixupOnce(root, r.z);
      root = st.root; r.z = st.z;
    }
    root.red = false;
  }

  yield { tree: paint(root, {}), phase: `插入前的树（${(keys && keys.length ? keys : arr).join(',')}）` };

  // ---- 对 newKey 的插入，产帧 ----
  const ins = plainInsert(root, newKey);
  root = ins.root;
  let z = ins.z;
  yield { tree: paint(root, { [newKey]: 'rb-red' }), phase: `新节点 ${newKey} 恒为红（RB-INSERT 第 1–14 行）` };

  while (z.p && z.p.red) {
    if (z.p === z.p.p.left) {
      const y = z.p.p.right;
      if (y && y.red) {
        yield { tree: paint(root, { [newKey]: 'rb-red', [z.key]: 'rb-red', [y.key]: 'rb-red' }), phase: `情形 1：叔叔 ${y.key} 是红 → 父 ${z.p.key} 与叔叔变黑、祖父 ${z.p.p.key} 变红` };
        z.p.red = false; y.red = false; z.p.p.red = true; z = z.p.p;
        yield { tree: paint(root, { [z.key]: 'rb-red' }), phase: `z 上移到 ${z.key}，继续检查` };
      } else {
        if (z === z.p.right) {
          yield { tree: paint(root, { [newKey]: 'rb-red', [z.key]: 'rb-red' }), phase: `情形 2：三角 → 对父 ${z.p.key} 左旋` };
          z = z.p;
          root = leftRotate(root, z);
          yield { tree: paint(root, { [z.key]: 'rb-red' }), phase: `左旋完成 → 直线（情形 3）` };
        }
        yield { tree: paint(root, { [newKey]: 'rb-red', [z.key]: 'rb-red', [z.p.p.key]: 'rb-red' }), phase: `情形 3：直线 → 父 ${z.p.key} 变黑、祖父 ${z.p.p.key} 变红，对祖父右旋` };
        z.p.red = false;
        z.p.p.red = true;
        root = rightRotate(root, z.p.p);
        yield { tree: paint(root, {}), phase: `右旋完成，修复结束` };
      }
    } else {
      const y = z.p.p.left;
      if (y && y.red) {
        yield { tree: paint(root, { [newKey]: 'rb-red', [z.key]: 'rb-red', [y.key]: 'rb-red' }), phase: `情形 1（镜像）：叔叔 ${y.key} 是红 → 变色` };
        z.p.red = false; y.red = false; z.p.p.red = true; z = z.p.p;
        yield { tree: paint(root, { [z.key]: 'rb-red' }), phase: `z 上移到 ${z.key}` };
      } else {
        if (z === z.p.left) {
          yield { tree: paint(root, { [newKey]: 'rb-red', [z.key]: 'rb-red' }), phase: `情形 2（镜像）：对父 ${z.p.key} 右旋` };
          z = z.p;
          root = rightRotate(root, z);
          yield { tree: paint(root, { [z.key]: 'rb-red' }), phase: `右旋完成` };
        }
        yield { tree: paint(root, { [newKey]: 'rb-red', [z.key]: 'rb-red', [z.p.p.key]: 'rb-red' }), phase: `情形 3（镜像）：父变黑、祖父变红，对祖父左旋` };
        z.p.red = false;
        z.p.p.red = true;
        root = leftRotate(root, z.p.p);
        yield { tree: paint(root, {}), phase: `左旋完成，修复结束` };
      }
    }
  }
  root.red = false;
  yield { tree: paint(root, {}), phase: `完成：红黑性质全部恢复（根恒为黑）` };
}

/** FIXUP 的单步执行（供构建阶段无帧使用）：返回 {root, z}，z 已上移或修复完成 */
function fixupOnce(root, z) {
  if (!z.p || !z.p.red) { return { root, z, done: true }; }
  if (z.p === z.p.p.left) {
    const y = z.p.p.right;
    if (y && y.red) {
      z.p.red = false; y.red = false; z.p.p.red = true;
      return { root, z: z.p.p };
    }
    if (z === z.p.right) { z = z.p; root = leftRotate(root, z); }
    z.p.red = false; z.p.p.red = true;
    root = rightRotate(root, z.p.p);
    return { root, z };
  }
  const y = z.p.p.left;
  if (y && y.red) {
    z.p.red = false; y.red = false; z.p.p.red = true;
    return { root, z: z.p.p };
  }
  if (z === z.p.left) { z = z.p; root = rightRotate(root, z); }
  z.p.red = false; z.p.p.red = true;
  root = leftRotate(root, z.p.p);
  return { root, z };
}

/** 给树着色并转成 tree.js 节点 */
function paint(root, marks) {
  const toViz = (n, seen) => {
    if (!n || seen.has(n)) { return undefined; }
    seen.add(n);
    const kids = [];
    const l = toViz(n.left, seen), r = toViz(n.right, seen);
    if (l) { kids.push(l); }
    if (r) { kids.push(r); }
    return {
      id: 'k' + n.key,
      label: String(n.key),
      state: marks[n.key] || (n.red ? 'rb-red' : 'rb-black'),
      cost: n.red ? '红' : '黑',
      children: kids.length ? kids : undefined,
    };
  };
  return { root: toViz(root, new Set()) };
}

/** 公开：直接构建一棵 RB 树并返回静态帧（13.1 用） */
export function rbBuildFrames(keys) {
  let root = null;
  for (const k of keys) {
    const r = plainInsert(root, k);
    let z = r.z;
    root = r.root;
    while (z.p && z.p.red) {
      const st = fixupOnce(root, z);
      root = st.root; z = st.z;
      if (st.done) { break; }
    }
    root.red = false;
  }
  return [{ tree: paint(root, {}), phase: `按 ${keys.join(',')} 依次 RB-INSERT` }];
}
