// linked-list.js — 10.2 的链表操作教学帧（原书 p.260–261 的 LIST-SEARCH / LIST-PREPEND /
// LIST-INSERT / LIST-DELETE）。
//
// 节点 id 用创建序号（1,2,3…），稳定不变；链的次序由 next/prev 决定。
// 每次操作后重建帧里的 nodes 数组（next/prev 用 id 表示），frames 交给 linked-list viz 渲染。

// ★ 引擎约定：第一个参数固定是面板的输入数组（本生成器用 keys 与 ops 建链）
export function* linkedListDemo(arr, keys, ops) {
  void arr;
  // 内部表示：{ id, key, prevId, nextId }
  const nodes = [];
  let headId = null;
  let nextId = 1;
  const counts = { cmp: 0, move: 0 };

  // 初始链表：按 keys 顺序建立双向链
  let prev = null;
  for (const k of keys) {
    const node = { id: nextId++, key: k, prevId: prev, nextId: null };
    if (prev == null) { headId = node.id; } else { nodes.find((n) => n.id === prev).nextId = node.id; }
    nodes.push(node);
    prev = node.id;
  }

  const byId = (id) => nodes.find((n) => n.id === id);

  const snap = (note, extra = {}) => {
    const arr = nodes.map((n) => ({ id: n.id, key: n.key, next: n.nextId, prev: n.prevId }));
    const ptrs = Object.assign({}, extra.pointers || {});
    if (headId != null) { ptrs['L.head'] = headId; }
    return {
      line: extra.line || 1,
      nodes: arr,
      order: null,
      sentinelId: null,
      pointers: ptrs,
      highlight: extra.highlight || {},
      note,
      counts: { ...counts },
      phase: extra.phase || '',
      invariantHolds: true,
      done: false,
    };
  };

  const chain = () => {
    const out = [];
    let cur = headId;
    const seen = new Set();
    while (cur != null && !seen.has(cur)) { out.push(cur); seen.add(cur); cur = byId(cur).nextId; }
    return out;
  };

  yield snap(`初始链表：${chain().map((id) => byId(id).key).join(' → ')}。` +
    `每个节点有 key、next、prev 三个属性。`, { phase: '初始' });

  for (const op of ops || []) {
    if (op.kind === 'search') {
      // LIST-SEARCH（第 2–4 行）：从 head 沿 next 走
      let cur = headId;
      yield snap(`LIST-SEARCH(L, ${op.k})：从 L.head 出发，沿 next 逐个比较。`,
        { phase: 'LIST-SEARCH', pointers: { x: cur }, line: 2 });
      while (cur != null) {
        counts.cmp++;
        if (byId(cur).key === op.k) { break; }
        yield snap(`x.key = ${byId(cur).key} ≠ ${op.k} → x = x.next。`,
          { phase: 'LIST-SEARCH', pointers: { x: cur }, highlight: { compare: [cur] }, line: 3 });
        cur = byId(cur).nextId;
      }
      if (cur == null) {
        yield snap(`走到底（NIL）仍未找到 ${op.k} → 返回 NIL。★ 这就是 LIST-SEARCH 的最坏情形：Θ(n)。`,
          { phase: 'LIST-SEARCH', line: 4 });
      } else {
        yield snap(`x.key = ${op.k} 命中 → 返回指向该节点的指针。★ 最坏 Θ(n)（要走到 NIL 才知道没有）。`,
          { phase: 'LIST-SEARCH', pointers: { x: cur }, highlight: { done: [cur] }, line: 4 });
      }
    } else if (op.kind === 'prepend') {
      // LIST-PREPEND：新节点插到表头（5 行）
      const node = { id: nextId++, key: op.v, prevId: null, nextId: headId };
      nodes.push(node);
      if (headId != null) { byId(headId).prevId = node.id; }
      headId = node.id;
      counts.move += 2;
      yield snap(`LIST-PREPEND(${op.v})：x.next = L.head；x.prev = NIL；L.head.prev = x；L.head = x。` +
        `★ 5 行、两个指针改写 —— 全是 O(1)。`,
        { phase: 'LIST-PREPEND', pointers: { x: node.id }, highlight: { active: [node.id] }, line: 5 });
    } else if (op.kind === 'insertAfter') {
      // LIST-INSERT：插到 y 之后（4 行）
      const yId = nodes.find((n) => n.key === op.target).id;
      const node = { id: nextId++, key: op.v, prevId: yId, nextId: byId(yId).nextId };
      nodes.push(node);
      if (byId(yId).nextId != null) { byId(byId(yId).nextId).prevId = node.id; }
      byId(yId).nextId = node.id;
      counts.move += 3;
      yield snap(`LIST-INSERT 到 y（key = ${op.target}）之后：x.next = y.next；x.prev = y；` +
        `y.next.prev = x；y.next = x。★ 有 y 的指针时是 O(1)。`,
        { phase: 'LIST-INSERT', pointers: { y: yId, x: node.id }, highlight: { active: [node.id] }, line: 4 });
    } else if (op.kind === 'delete') {
      // LIST-DELETE：给 x 的指针直接摘除（5 行）
      const xId = nodes.find((n) => n.key === op.v).id;
      const x = byId(xId);
      yield snap(`LIST-DELETE：x 指向节点 ${op.v}。`,
        { phase: 'LIST-DELETE', pointers: { x: xId }, highlight: { active: [xId] }, line: 1 });
      if (x.prevId != null) { byId(x.prevId).nextId = x.nextId; }
      else { headId = x.nextId; }
      if (x.nextId != null) { byId(x.nextId).prevId = x.prevId; }
      counts.move += 2;
      const idx = nodes.indexOf(x);
      nodes.splice(idx, 1);
      yield snap(`摘除 ${op.v}：x.prev.next = x.next；x.next.prev = x.prev。` +
        `★ 两条指针改写，不搬动任何其他元素（数组删除要挪 Θ(n) 个）。` +
        `注意若是表头/表尾则边界条件不同（哨兵版会消掉这些分支）。`,
        { phase: 'LIST-DELETE', line: 5 });
    }
  }

  const final = snap(`结束：${chain().map((id) => byId(id).key).join(' → ')}。` +
    `★ 增删都是 O(1)（只要拿到指针）；代价是查找仍要 O(n)。`);
  final.done = true;
  final.phase = '完成';
  yield final;
}
