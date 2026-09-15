// Strassen 4.2 的教学帧：展示书中 p.86–89 的固定计算顺序。
// 这里不计算数值矩阵；数值正确性由 C 实现验证，生成器只驱动概念动画。

const S = [
  'S₁ = B₁₂ − B₂₂', 'S₂ = A₁₁ + A₁₂', 'S₃ = A₂₁ + A₂₂',
  'S₄ = B₂₁ − B₁₁', 'S₅ = A₁₁ + A₂₂', 'S₆ = B₁₁ + B₂₂',
  'S₇ = A₁₂ − A₂₂', 'S₈ = B₂₁ + B₂₂', 'S₉ = A₁₁ − A₂₁',
  'S₁₀ = B₁₁ + B₁₂',
];

const P = [
  'P₁ = A₁₁ · S₁', 'P₂ = S₂ · B₂₂', 'P₃ = S₃ · B₁₁', 'P₄ = A₂₂ · S₄',
  'P₅ = S₅ · S₆', 'P₆ = S₇ · S₈', 'P₇ = S₉ · S₁₀',
];

export function* strassenDemo() {
  yield { line: 1, phase: 'split', note: '先把 A、B、C 都按 2×2 分块；这一步只改索引，不做递归乘法。' };
  for (let i = 0; i < S.length; i++) {
    yield { line: 2, phase: 's', index: i, formula: S[i], note: `构造 ${S[i]}：矩阵加减只需 Θ(n²) 时间。` };
  }
  for (let i = 0; i < P.length; i++) {
    yield { line: 3, phase: 'p', index: i, formula: P[i], note: `递归计算 ${P[i]}：这是 7 次规模 n/2 的矩阵乘法之一。` };
  }
  yield { line: 4, phase: 'combine', formula: 'C₁₁, C₁₂, C₂₁, C₂₂ 由 P₁…P₇ 合并', note: '合并 4 个结果块。总共只做了 7 次递归乘法，外加常数次矩阵加减。' };
  yield { line: null, phase: 'done', done: true, note: '完成：T(n) = 7T(n/2) + Θ(n²)，主方法给出 Θ(n^lg 7)。' };
}

export const strassenOperations = { S, P };
