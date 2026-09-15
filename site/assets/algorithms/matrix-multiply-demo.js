/* MATRIX-MULTIPLY 的教学帧：固定 2×2 输入，逐项展示三重循环。 */

function readMatrices(values) {
  const input = Array.isArray(values) ? values : [];
  const a = [input.slice(0, 4), input.slice(4, 8)];
  return {
    a: [a[0].slice(0, 2), a[0].slice(2, 4)],
    b: [a[1].slice(0, 2), a[1].slice(2, 4)],
  };
}

function copyMatrix(matrix) {
  return matrix.map((row) => row.slice());
}

export function* matrixMultiplyDemo(values) {
  const { a, b } = readMatrices(values);
  const c = [[0, 0], [0, 0]];
  const n = 2;
  let multiplicationCount = 0;

  yield {
    line: 1,
    phase: 'start',
    i: 0,
    j: 0,
    k: -1,
    product: null,
    partial: 0,
    a: copyMatrix(a),
    b: copyMatrix(b),
    c: copyMatrix(c),
    counts: { mul: 0, add: 0 },
    invariantHolds: true,
    note: '初始化 C；外层循环将从第 1 行、第 1 列开始。',
  };

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let partial = 0;
      yield {
        line: 2,
        phase: 'select',
        i,
        j,
        k: -1,
        product: null,
        partial,
        a: copyMatrix(a),
        b: copyMatrix(b),
        c: copyMatrix(c),
        counts: { mul: multiplicationCount, add: 0 },
        invariantHolds: true,
        note: `选定 c${i + 1}${j + 1}，内层循环的部分和从 0 开始。`,
      };

      for (let k = 0; k < n; k++) {
        const product = a[i][k] * b[k][j];
        partial += product;
        c[i][j] = partial;
        multiplicationCount++;
        yield {
          line: 4,
          phase: 'accumulate',
          i,
          j,
          k,
          product,
          partial,
          a: copyMatrix(a),
          b: copyMatrix(b),
          c: copyMatrix(c),
          counts: { mul: multiplicationCount, add: k + 1 },
          invariantHolds: true,
          note: `c${i + 1}${j + 1} += a${i + 1}${k + 1} × b${k + 1}${j + 1} = ${product}，部分和为 ${partial}。`,
        };
      }

      yield {
        line: 3,
        phase: 'complete-cell',
        i,
        j,
        k: n,
        product: null,
        partial,
        a: copyMatrix(a),
        b: copyMatrix(b),
        c: copyMatrix(c),
        counts: { mul: multiplicationCount, add: n },
        invariantHolds: true,
        note: `c${i + 1}${j + 1} 已完成，值为 ${partial}。继续选择下一个列。`,
      };
    }
  }

  yield {
    line: null,
    phase: 'done',
    i: n,
    j: n,
    k: n,
    product: null,
    partial: null,
    a: copyMatrix(a),
    b: copyMatrix(b),
    c: copyMatrix(c),
    counts: { mul: multiplicationCount, add: n * n * n },
    invariantHolds: true,
    note: '三重循环结束：C = A · B。2×2 示例共完成 8 次标量乘法。',
  };
}
