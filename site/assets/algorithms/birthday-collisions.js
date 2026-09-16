// birthday-collisions.js — 5.4.1 生日悖论的教学帧。
//
// 输入：k 个人的生日（1..365，即「一年中的第几天」），按进门顺序排列。
// 下标统一用 1 基，与书中一致（array.js 的指针与 highlight 也是 1 基）。
//
// 每帧表示「第 i 个人进门之后」的状态，对应教学伪代码 BIRTHDAY-PAIRS 的行：
//   1 X = 0
//   2 for i = 1 to k
//   3     if b[i] 在 b[1 : i-1] 中出现过
//   4         X = X + 1
//   5 return X
// 逐人产帧（而不是逐「对」产帧）：k = 23 时逐对会产生 253 帧，太密；
// 逐人只有 ~50 帧，既能看清过程，又不会拖沓。

export function* birthdayCollisions(birthdays) {
  const arr = birthdays.slice();
  const n = 365;
  const counts = { people: 0, cmp: 0, collisions: 0 };

  const frame = (line, extra = {}) => ({
    line,
    array: arr.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  yield frame(1, { note: 'X = 0：还没有统计到任何一对同生日的人。' });

  const seen = new Map(); // 生日 -> 最早出现的人的下标（1 基）

  for (let i = 0; i < arr.length; i++) {
    const person = i + 1;
    const day = arr[i];

    yield frame(2, {
      pointers: { i: person },
      highlight: { active: [person] },
      note: `第 ${person} 个人进门，生日是第 ${day} 天。`,
    });

    counts.cmp += i; // 与前面 i 个人各比一次
    const first = seen.get(day);

    if (first !== undefined) {
      counts.collisions++;
      counts.people = person;
      yield frame(3, {
        pointers: { i: person },
        highlight: { active: [person], result: [first] },
        note: `第 ${day} 天已经出现过（第 ${first} 个人），撞上了。`,
      });
      yield frame(4, {
        pointers: { i: person },
        highlight: { active: [person], result: [first] },
        note: `X = ${counts.collisions}：到目前为止共 ${counts.collisions} 对同生日的人。`,
      });
    } else {
      seen.set(day, person);
      counts.people = person;
      yield frame(3, {
        pointers: { i: person },
        highlight: { active: [person] },
        note: `前 ${i} 个人里没有第 ${day} 天，先记下来。`,
      });
    }
  }

  const k = arr.length;
  const pairs = k * (k - 1) / 2;
  const expect = pairs / n;
  yield {
    line: 5,
    array: arr.slice(),
    pointers: {},
    highlight: { result: arr.map((_, idx) => idx + 1) },
    counts: { ...counts },
    note: `${k} 个人共 ${pairs} 对，实测撞上 ${counts.collisions} 对；`
      + `期望值 k(k−1)/(2n) = ${expect.toFixed(2)}（n = 365）。`,
    invariantHolds: true,
    done: true,
  };
}
