// stack.js — 10.1 的栈操作教学帧（原书 p.255 的 STACK-EMPTY / PUSH / POP）。
//
// 定长数组 S[1 : size]：S.top 指向栈顶（0 表示空）。帧里的 array 就是这块数组，
// 空槽用 0 表示；pointers 里的 top 用 1 基下标显示（top = 0 时不画箭头）。

export function* stackDemo(initial, size, ops) {
  const n = size;
  const S = new Array(n).fill(0);
  let top = 0;
  const counts = { cmp: 0, move: 0 };

  const frame = (line, note, extra = {}) => ({
    line,
    array: S.slice(),
    pointers: top >= 1 && top <= n ? { top } : {},
    highlight: extra.highlight || {},
    note,
    counts: { ...counts },
    phase: extra.phase,
    invariantHolds: true,
    done: false,
  });

  yield frame(1, `空栈 S[1 : ${n}]：S.top = 0，没有任何元素。`, { phase: '初始' });

  for (const op of ops || []) {
    if (op.kind === 'push') {
      counts.cmp++;
      if (top === n) {
        yield frame(2, `PUSH(${op.v})：S.top == S.size == ${n} → overflow 错误。` +
          `★ 定长数组的代价：栈满时无法再压入。`, { phase: 'PUSH' });
        continue;
      }
      top = top + 1;                       /* 第 3 行：S.top = S.top + 1 */
      S[top - 1] = op.v;                   /* 第 4 行：S[S.top] = x */
      counts.move++;
      yield frame(4, `PUSH(${op.v})：S.top 先加 1 → ${top}，再 S[${top}] = ${op.v}。★ 两步都是 O(1)。`,
        { phase: 'PUSH', highlight: { active: [top] } });
    } else if (op.kind === 'pop') {
      counts.cmp++;
      if (top === 0) {
        yield frame(2, `POP()：STACK-EMPTY(S) 为真 → underflow 错误。★ 空栈弹出是错误。`,
          { phase: 'POP' });
        continue;
      }
      const val = S[top - 1];
      top = top - 1;                       /* 第 3 行：S.top = S.top − 1 */
      S[top] = 0;                          /* 视觉上清空该槽（书上元素仍在，只是不在栈内） */
      counts.move++;
      yield frame(4, `POP()：S.top 减 1 → ${top}，返回 S[${top + 1}] = ${val}。` +
        `★ 注意元素 ${val} 其实仍留在数组里（书上的图把已弹出的元素画成灰色）—— 是 top 把它"踢出"了栈。`,
        { phase: 'POP' });
    } else if (op.kind === 'empty') {
      counts.cmp++;
      yield frame(3, `STACK-EMPTY(S)：S.top == 0 → ${top === 0 ? 'TRUE（空）' : 'FALSE（非空）'}。`,
        { phase: '检查' });
    }
  }

  yield {
    line: 4,
    array: S.slice(),
    pointers: top >= 1 && top <= n ? { top } : {},
    highlight: { done: S.map((_, i) => i + 1).slice(0, top) },
    counts: { ...counts },
    note: `结束：栈内有 ${top} 个元素（S.top = ${top}）。★ 三种操作全部 O(1)。`,
    invariantHolds: true,
    done: true,
    phase: '完成',
  };
}
