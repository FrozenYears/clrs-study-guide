// queue.js — 10.1 的队列操作教学帧（原书 p.257 的 ENQUEUE / DEQUEUE，环形实现）。
//
// 定长数组 Q[1 : size]，head 指向队首、tail 指向"下一个入队位置"。
// 指针回绕：head/tail 到 size 后回到 1（不是 0）—— 环形队列的核心。

// ★ 引擎约定：第一个参数固定是面板的输入数组（本生成器只用 size 与 ops）
export function* queueDemo(arr, size, ops) {
  void arr;
  const n = size;
  const Q = new Array(n).fill(0);
  let head = 1, tail = 1;
  const counts = { cmp: 0, move: 0 };

  const frame = (line, note, extra = {}) => ({
    line,
    array: Q.slice(),
    pointers: { head, tail },
    highlight: extra.highlight || {},
    note,
    counts: { ...counts },
    phase: extra.phase,
    invariantHolds: true,
    done: false,
  });

  yield frame(1, `空队列 Q[1 : ${n}]：Q.head = Q.tail = 1 —— 队首与"下一个空位"重合。`,
    { phase: '初始' });

  for (const op of ops || []) {
    if (op.kind === 'enqueue') {
      Q[tail - 1] = op.v;                  /* 第 1 行：Q[Q.tail] = x */
      counts.move++;
      const old = tail;
      if (tail === n) {
        tail = 1;                          /* 第 2–3 行：回绕到 1 */
        yield frame(3, `ENQUEUE(${op.v})：写入 Q[${old}]，Q.tail == Q.size 所以回绕到 1。` +
          `★ 回绕是队列"环形"的全部秘密。`, { phase: 'ENQUEUE', highlight: { active: [old] } });
      } else {
        tail = tail + 1;                   /* 第 4 行：Q.tail = Q.tail + 1 */
        yield frame(4, `ENQUEUE(${op.v})：写入 Q[${old}]，Q.tail → ${tail}。`,
          { phase: 'ENQUEUE', highlight: { active: [old] } });
      }
    } else if (op.kind === 'dequeue') {
      const val = Q[head - 1];             /* 第 1 行：x = Q[Q.head] */
      Q[head - 1] = 0;
      counts.move++;
      const old = head;
      if (head === n) {
        head = 1;
        yield frame(3, `DEQUEUE()：从 Q[${old}] 取出 ${val}，Q.head == Q.size 所以回绕到 1。`,
          { phase: 'DEQUEUE', highlight: { active: [old] } });
      } else {
        head = head + 1;
        yield frame(4, `DEQUEUE()：从 Q[${old}] 取出 ${val}，Q.head → ${head}。` +
          `★ FIFO：先入队的先出（对比栈的 LIFO）。`, { phase: 'DEQUEUE', highlight: { active: [old] } });
      }
    }
  }

  const qlen = (tail - head + n) % n;
  yield {
    line: 5,
    array: Q.slice(),
    pointers: { head, tail },
    highlight: {},
    counts: { ...counts },
    note: `结束：Q.head = ${head}、Q.tail = ${tail}，队内 ${qlen} 个元素。` +
      `★ 注意 head 与 tail 都已回绕过 —— 数组是"环形"使用的。`,
    invariantHolds: true,
    done: true,
    phase: '完成',
  };
}
