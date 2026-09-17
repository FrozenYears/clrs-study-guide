// open-address.js — 11.4 开放寻址的教学帧（原书 p.294 的 HASH-INSERT / HASH-SEARCH）。
//
// 散列：线性探测 h(k,i) = (h1(k) + i) mod m，或双重散列 h(k,i) = (h1(k) + i·h2(k)) mod m。
// 帧显示 T[0 : m−1] 的槽位，每个槽直接放 key 或 NIL（open 模式，无链、无指针）。
// 槽数 m ≤ 14 时显示全部槽；更大时只显示被用到的槽及其邻位。

export function* openAddress(arr, m, ops) {
  const mm = m || 11;
  const method = (ops && ops.method) === 'double' ? 'double' : 'linear';
  const counts = { probes: 0 };

  // 内部表示：table[i] = key 或 null
  const table = new Array(mm).fill(null);

  const h1 = (k) => ((k % mm) + mm) % mm;
  const h2 = (k) => {
    const r = ((k % (mm - 1)) + (mm - 1)) % (mm - 1);
    return r + 1;                                   // 落在 [1, m−1]，m 为素数时与 m 互素
  };
  const probe = (k, i) => (method === 'double'
    ? (h1(k) + i * h2(k)) % mm
    : (h1(k) + i) % mm);

  const visibleSlots = () => {
    if (mm <= 14) { return Array.from({ length: mm }, (_, i) => i); }
    const used = new Set();
    for (let i = 0; i < mm; i++) {
      if (table[i] != null) {
        used.add(i); used.add((i + 1) % mm); used.add((i - 1 + mm) % mm);
      }
    }
    return [...used].sort((a, b) => a - b);
  };

  const frame = (note, extra = {}) => ({
    line: extra.line || 1,
    slots: visibleSlots().map((i) => ({
      i,
      chain: table[i] == null ? [] : [{ key: table[i] }],
      state: extra.slotState && extra.slotState.i === i ? extra.slotState.state : undefined,
    })),
    m: mm,
    mode: 'open',
    pointers: {},
    highlight: extra.highlight || {},
    note,
    counts: { ...counts },
    phase: extra.phase || '',
    invariantHolds: true,
    done: false,
  });

  yield frame(
    `空表 T[0 : ${mm - 1}]：每个槽都是 NIL。散列函数 h(k,i) 把 key 映射成一条探测序列（不建链）。`,
    { phase: '初始', line: 1 });

  const keys = (arr || []).slice();

  // ---- 插入 ----
  for (const k of keys) {
    const q0 = probe(k, 0);
    yield frame(
      `HASH-INSERT(${k})：第一个探测位置 h(${k},0) = ${q0}（${method === 'double' ? '双重' : '线性'}探测）。`,
      { phase: 'HASH-INSERT', line: 3, highlight: { compare: [q0] } });
    let placed = false;
    for (let i = 0; i < mm; i++) {
      const q = probe(k, i);
      counts.probes++;
      if (table[q] == null) {
        table[q] = k;
        yield frame(
          `位置 ${q} 是 NIL → 把 ${k} 放进去（共探测 ${i + 1} 次）。`,
          { phase: 'HASH-INSERT', line: 5, highlight: { active: [q] }, slotState: { i: q, state: 'done' } });
        placed = true;
        break;
      }
      if (i < mm - 1) {
        yield frame(
          `位置 ${q} 已被 ${table[q]} 占 → 按探测序列看下一个位置（已探测 ${i + 1} 次）。`,
          { phase: 'HASH-INSERT', line: 7, highlight: { compare: [q] } });
      }
    }
    if (!placed) {
      yield frame(
        `表已满（探测了 ${mm} 次都没空槽）→ 报 "hash table overflow"。`,
        { phase: 'HASH-INSERT', line: 9, highlight: { violation: [probe(k, mm - 1)] } });
    }
  }

  // ---- 查找（可选） ----
  const searches = (ops && Array.isArray(ops.search)) ? ops.search : null;
  if (searches) {
    for (const k of searches) {
      const inTable = table.includes(k);
      let found = false;
      for (let i = 0; i < mm; i++) {
        const q = probe(k, i);
        counts.probes++;
        if (table[q] == null) {
          yield frame(
            `位置 ${q} 是 NIL → 终止（未命中），因为 ${k} 若在表里一定会出现在空槽之前。共探测 ${i + 1} 次。`,
            { phase: 'HASH-SEARCH', line: 7, highlight: { compare: [q] } });
          break;
        }
        if (table[q] === k) {
          found = true;
          yield frame(
            `位置 ${q} 就是要找的 ${k} → 命中（共探测 ${i + 1} 次）。`,
            { phase: 'HASH-SEARCH', line: 4, highlight: { active: [q] }, slotState: { i: q, state: 'done' } });
          break;
        }
        if (i < mm - 1) {
          yield frame(
            `位置 ${q} 是 ${table[q]} ≠ ${k} → 继续（已探测 ${i + 1} 次）。`,
            { phase: 'HASH-SEARCH', line: 6, highlight: { compare: [q] } });
        }
      }
      if (!found && !table.includes(k)) {
        // 已在上面 NIL 分支终止，无需额外处理
      }
    }
  }

  // ---- 结束帧 ----
  const n = table.filter((v) => v != null).length;
  yield {
    line: 9,
    slots: visibleSlots().map((i) => ({
      i, chain: table[i] == null ? [] : [{ key: table[i] }],
      state: table[i] == null ? 'idle' : 'done',
    })),
    m: mm,
    mode: 'open',
    pointers: {},
    highlight: {},
    counts: { ...counts },
    note: `结束：存了 ${n} 个元素，负载因子 α = n/m = ${n}/${mm} ≈ ${(n / mm).toFixed(2)}。` +
      `★ 开放寻址下 α ≤ 1（表满了就不能再插入）。`,
    invariantHolds: true,
    done: true,
    phase: '完成',
  };
}
