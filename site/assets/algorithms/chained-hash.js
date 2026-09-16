// chained-hash.js — 11.2 链接法散列的教学帧（原书 p.276 的 CHAINED-HASH-INSERT /
// CHAINED-HASH-SEARCH / CHAINED-HASH-DELETE）。
//
// 散列函数用除法散列 h(k) = k mod m（原书 11.3 的第一种方案）。
// 帧显示 T[0 : m−1] 的槽位与每个槽挂的链；若 m 较大（> 14），只显示被用到的槽及其邻位。

export function* chainedHash(arr, m, ops) {
  const mm = m || 12;
  const counts = { cmp: 0, move: 0 };

  // 内部表示：slots[i] = [key, ...]
  const slots = Array.from({ length: mm }, () => []);

  const visibleSlots = () => {
    if (mm <= 14) { return Array.from({ length: mm }, (_, i) => i); }
    const used = new Set();
    for (let i = 0; i < mm; i++) {
      if (slots[i].length) {
        used.add(i);
        used.add((i + 1) % mm);
        used.add((i - 1 + mm) % mm);
      }
    }
    return [...used].sort((a, b) => a - b);
  };

  const frame = (note, extra = {}) => ({
    line: extra.line || 1,
    slots: visibleSlots().map((i) => ({
      i,
      chain: slots[i].map((k, idx) => ({
        key: k,
        state: extra.mark && extra.mark.slot === i && extra.mark.idx === idx ? extra.mark.state : undefined,
      })),
      state: extra.slotState && extra.slotState.i === i ? extra.slotState.state : undefined,
    })),
    m: mm,
    mode: 'chained',
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note,
    counts: { ...counts },
    phase: extra.phase || '',
    invariantHolds: true,
    done: false,
  });

  const h = (k) => ((k % mm) + mm) % mm;

  yield frame(`空表 T[0 : ${mm - 1}]：每个槽的头指针都是 NIL。散列函数 h(k) = k mod ${mm}。`,
    { phase: '初始', line: 1 });

  for (const op of ops || []) {
    if (op.kind === 'insert') {
      const q = h(op.v);
      counts.move++;
      slots[q].unshift(op.v);            // 头插（CHAINED-HASH-INSERT 的约定：插到链头）
      counts.move++;
      yield frame(`CHAINED-HASH-INSERT(${op.v})：h(${op.v}) = ${op.v} mod ${mm} = ${q} → 插到 T[${q}] 的链头。` +
        `★ 头插是 O(1)，所以插入最坏也是 O(1)。`,
        { phase: 'HASH-INSERT', line: 3, mark: { slot: q, idx: 0, state: 'active' }, slotState: { i: q, state: 'active' } });
    } else if (op.kind === 'search') {
      const q = h(op.v);
      yield frame(`CHAINED-HASH-SEARCH(${op.v})：h(${op.v}) = ${q} → 从 T[${q}] 的链头开始找。`,
        { phase: 'HASH-SEARCH', pointers: { i: q }, slotState: { i: q, state: 'compare' }, line: 2 });
      let found = false;
      for (let idx = 0; idx < slots[q].length; idx++) {
        counts.cmp++;
        if (slots[q][idx] === op.v) {
          found = true;
          yield frame(`链上第 ${idx + 1} 个元素是 ${op.v} —— 命中。★ 比较 ${counts.cmp} 次（含这一条链上的全部失败比较）。`,
            { phase: 'HASH-SEARCH', pointers: { i: q }, mark: { slot: q, idx, state: 'done' }, line: 4 });
          break;
        }
        yield frame(`链上第 ${idx + 1} 个元素是 ${slots[q][idx]} ≠ ${op.v} → 沿链往后走。`,
          { phase: 'HASH-SEARCH', pointers: { i: q }, mark: { slot: q, idx, state: 'compare' }, line: 5 });
      }
      if (!found) {
        yield frame(`走到链尾（NIL）仍未找到 ${op.v} → 返回 NIL。★ 这条链的长度决定了失败查找的代价。`,
          { phase: 'HASH-SEARCH', pointers: { i: q }, line: 7 });
      }
    } else if (op.kind === 'delete') {
      const q = h(op.v);
      const idx = slots[q].indexOf(op.v);
      counts.cmp++;
      if (idx < 0) {
        yield frame(`CHAINED-HASH-DELETE(${op.v})：T[${q}] 的链上没有 ${op.v}，无需删除。`,
          { phase: 'HASH-DELETE', pointers: { i: q }, line: 1 });
      } else {
        slots[q].splice(idx, 1);
        counts.move++;
        yield frame(`CHAINED-HASH-DELETE(${op.v})：从 T[${q}] 的链上摘掉它。` +
          `★ 双向链表上的删除是 O(1)（前提是已经拿到指针）。`,
          { phase: 'HASH-DELETE', pointers: { i: q }, slotState: { i: q, state: 'active' }, line: 8 });
      }
    }
  }

  // 负载因子与最长链
  const n = slots.reduce((s, c) => s + c.length, 0);
  let maxLen = 0, maxSlot = 0;
  for (let i = 0; i < mm; i++) { if (slots[i].length > maxLen) { maxLen = slots[i].length; maxSlot = i; } }

  yield {
    line: 4,
    slots: visibleSlots().map((i) => ({ i, chain: slots[i].map((k) => ({ key: k, state: 'done' })) })),
    m: mm,
    mode: 'chained',
    pointers: {},
    highlight: {},
    counts: { ...counts },
    note: `结束：存了 ${n} 个元素，负载因子 α = n/m = ${n}/${mm} ≈ ${(n / mm).toFixed(2)}；` +
      `最长链在 T[${maxSlot}]，长度 ${maxLen}。★ 查找代价是 Θ(1 + α) —— 链越短越好。`,
    invariantHolds: true,
    done: true,
    phase: '完成',
  };
}
