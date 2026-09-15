/* 第 4 章 4.2 —— Strassen 矩阵乘法：少一次乘法。原文锚点：印刷页 85–89。 */

export default {
  key: 's02',
  id: 'ch04/s02',
  chapter: 4,
  section: '4.2',
  title: 'Strassen：七次矩阵乘法',
  shortTitle: '4.2 Strassen：七次矩阵乘法',
  titleEn: 'Strassen’s algorithm for matrix multiplication',
  source: { printed: [85, 89], pdf: [106, 110] },
  sourceNote: '本关对应原书 4.2 节（印刷页 85–89）。',
  prerequisites: [{ label: '2.3 Merge sort（递归分治）', url: '#/ch02/s03' }],
  stages: [
    {
      type: 'map',
      title: '分治不只会八分支',
      why: '普通递归矩阵乘法会递归计算 8 个规模为 $n/2$ 的子矩阵乘积。Strassen 多做常数次矩阵加减，换走其中一次递归乘法；分支从 8 降到 7，增长阶随之改变。',
      position: '前置是 4.1 的块矩阵乘法。本关先得到 $T(n)=7T(n/2)+\\Theta(n^2)$；4.3、4.4、4.5 再分别学习如何证明、估算和直接求解它。',
      unlocks: [{ label: '4.3 代入法', url: '#/ch04/s03' }, { label: '4.5 主方法', url: '#/ch04/s05' }],
      mathKit: [
        { title: '块矩阵', body: '把 $A,B,C$ 各切成四个 $n/2\\times n/2$ 块；块之间的加、减、乘遵循普通矩阵运算。' },
        { title: '递归分支数', body: '一层产生多少个规模 $n/b$ 的子问题，决定递归树的宽度。这里从 $8$ 降到 $7$。' },
        { title: '渐进取舍', body: '矩阵加减是 $\\Theta(n^2)$，矩阵乘法更贵。只在规模足够大时，额外加减才值得换走一次乘法。' },
      ],
    },
    {
      type: 'intuition',
      title: '把两次重活改写成一次',
      scene: '搬两件重箱子之前，先花一点时间重新配对标签，换来少跑一趟仓库',
      body: [
        '标量恒等式 $x^2-y^2=(x+y)(x-y)$ 把两次乘法和一次减法，改写为一次乘法和两次加减。对标量，三次操作对三次操作，没有赚头。',
        '但当 $x,y$ 是大矩阵，乘法远比加减昂贵。Strassen 把这个想法嵌进四个矩阵块的计算：先构造 $S_1\\ldots S_{10}$，再只递归计算 $P_1\\ldots P_7$。',
        '七个 $P_i$ 不是把普通算法的八个乘积直接删掉一个；它们经过重组，最后由加减让多余项抵消，恢复四个正确的结果块。',
      ],
      interactive: { text: '阶段 5 按原书四步显示 A、B、C 的分块，再逐项高亮 10 个 S、7 个 P 与最终合并。只有 P 阶段发生递归矩阵乘法。' },
    },
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '英文原文给出取舍、四步流程和最终成本；中文解读把它们连到动画中的 S、P 与 C 块。',
      blocks: [
        { kind: 'body', page: 85, en: 'Strassen’s algorithm runs in Θ(n lg 7 ) time. Since lg 7 = 2:8073549… , Strassen’s algorithm runs in O(n 2:81 ) time, which is asymptotically better than the Θ(n 3 )', zh: '指数不是 3，而是 $\\lg7\\approx2.807$。本关随后解释这个 7 从哪里来。' },
        { kind: 'body', page: 85, en: 'The key to Strassen’s method is to use the divide-and-conquer idea from the MATRIX-MULTIPLY-RECURSIVE procedure, but make the recursion tree less bushy. We’ll actually increase the work for each divide and combine step by a constant factor, but the reduction in bushiness will pay off. We won’t reduce the bushiness from the eight-way branching of recurrence (4.9) all the way down to the two-way branching of recurrence (2.3), but we’ll improve it just a little, and that will make a big difference. Instead of perform ing eight recursive multiplications of n/2 × n/2 matrices, Strassen’s algorithm performs only seven. The cost of eliminating one matrix multiplication is several new additions and subtractions of n/2 × n/2 matrices, but still only a constant number. Rather than saying <additions and subtractions= everywhere, we’ll adopt the common terminology of calling them both "additions" because subtraction is structurally the same computation as addition, except for a change of sign.', zh: '★ 关键不是让每层工作更少，而是让递归树少一个分支。加减仍是常数次块操作，所以每层额外工作保持 $\\Theta(n^2)$。' },
        { kind: 'body', page: 86, en: 'To get an inkling how the number of multiplications might be reduced, as well as why reducing the number of multiplications might be desirable for matrix calculations, suppose that you have two numbers x and y , and you want to calculate the quantity x 2 − y 2 . The straightforward calculation requires two mult iplications to square x and y , followed by one subtraction (which you can think of as a <negative addition=). But let’s recall the old algebra trick x 2 − y 2 = x 2 − xy C xy − y 2 = x(x − y) + y(x − y) = (x + y).x − y/. Using this formulation of the desired quantity, you could instead compute the sum x + y and the difference x − y and then multiply them, requiring only a single multiplication and two additions. At the cost of an extra addition, only one multiplication is needed to compute an ex- pression that looks as if it requires two. If x and y are scalars, there’s not much difference: both approaches require three scalar operations. If x and y are large matrices, however, the cost of multiplying outweighs the cost of adding, in which case the second method outperforms the first, although not asymptotically.', zh: '重写表达式时不能只数总操作数，要区分乘法与加减的代价。矩阵版本同样依靠抵消。' },
        { kind: 'body', page: 86, en: '2. Create n/2 × n/2 matrices S 1 ,S 2 ,…,S 10 , each of which is the sum or difference of two submatrices from step 1. Create and zero the entries of seven n/2 × n/2 matrices P 1 ,P 2 ,…,P 7 to hold seven n/2 × n/2 matrix products.', zh: '先造 10 个准备块 $S_i$，再为 7 个递归乘积 $P_i$ 留出位置。动画的两张清单正对应这一句。' },
        { kind: 'body', page: 86, en: '3. Using the submatrices from step 1 and the matrices S 1 ,S 2 ,…,S 10 created in step 2, recursively compute each of the seven matrix products P 1 ,P 2 ,…,P 7 , taking 7T(n/2) time.', zh: '递归项是 $7T(n/2)$：七个 P 都是规模减半的矩阵乘法。' },
        { kind: 'body', page: 87, en: 'T(n) = 7T(n/2) + Θ(n 2 ): (4.10)', zh: '把分块、S 的加减和 C 的合并合在一起，得到 $\\Theta(n^2)$；再加上七个递归调用，就是本节递归式。' },
        { kind: 'body', page: 89, en: 'We can see that Strassen’s remarkable algorithm, comprising steps 1–4, produces the correct matrix product using 7 submatrix multiplications and 18 submatrix additions. We can also see that recurrence (4.10) characterizes its running time.', zh: '最终账本是 7 次子矩阵乘法和 18 次子矩阵加减；正确性来自合并公式中的抵消。' },
      ],
      terms: [
        { en: 'Strassen’s algorithm', zh: 'Strassen 算法：用七次半规模递归乘法完成块矩阵乘法', page: 85 },
        { en: 'submatrix', zh: '子矩阵：把 n×n 矩阵按四块切分后得到的 n/2×n/2 块', page: 86 },
        { en: 'recursion tree', zh: '递归树：每次递归调用形成一个子结点；分支数决定树的宽度', page: 85 },
      ],
    },
    {
      type: 'pseudocode',
      title: '把原书四步拆成可点的流程',
      algo: 'STRASSEN-FOUR-STEPS',
      signature: '计算 C = A · B，其中 A、B、C 为 n×n 矩阵，n 是 2 的幂',
      page: 86,
      lines: [
        { n: 1, code: 'partition A, B, C into four n/2 × n/2 blocks', zh: '基例 $n=1$ 直接做标量乘法；否则只靠索引把 A、B、C 看作四块，原书说明这一步是 $\\Theta(1)$。' },
        { n: 2, code: 'create S1…S10 and storage P1…P7', zh: '每个 S 是两个输入块的和或差；十个 S 加上初始化七个 P 是 $\\Theta(n^2)$。' },
        { n: 3, code: 'recursively compute P1…P7', zh: '按 p.87 的七个公式递归相乘，总代价 $7T(n/2)$；没有第八个递归乘法。' },
        { n: 4, code: 'combine P1…P7 into C11, C12, C21, C22', zh: '用 p.88–89 的四个合并公式写回 C。该步有 12 次子矩阵加减，仍是 $\\Theta(n^2)$。' },
      ],
      vars: [
        { name: 'Aᵢⱼ, Bᵢⱼ', meaning: '输入矩阵的四个 n/2×n/2 块' },
        { name: 'S₁…S₁₀', meaning: '为减少递归乘法而预先构造的和、差块' },
        { name: 'P₁…P₇', meaning: '七个递归得到的子矩阵乘积' },
        { name: 'Cᵢⱼ', meaning: '结果矩阵的四个块' },
      ],
      note: '原书在 p.86–89 以编号步骤和公式说明算法，并没有单独的伪代码框。本表是对该四步说明的教学整理。',
    },
    {
      type: 'visualize',
      title: '看着七个乘积依次出现',
      viz: 'matrix',
      algorithm: 'strassen-demo',
      pseudocodeRef: 'STRASSEN-FOUR-STEPS',
      input: { array: [] },
      invariants: [{ label: '每次递归乘法只对应一个 Pᵢ；全部七个 Pᵢ 由 S 与输入块构成' }],
      presets: [{ name: '书中四步', array: [] }],
      tasks: ['在 S 清单中找出只含 B 块的中间量。', '播放到 P 阶段，数一数真正递归相乘的次数。', '到合并帧后，比较 C₁₁ 和 C₂₂ 用到的 P。'],
    },
    {
      type: 'code',
      title: '把 S、P 与四个 C 块写进 C',
      intro: '实现刻意把中间块命名为 s1 到 s10、p1 到 p7，以便逐项对照原书。为展示概念，每层复制并保存所有中间块；实际高性能版本会更节省内存。',
      pseudocodeRef: 'STRASSEN-FOUR-STEPS',
      c: { file: 'strassen_matrix_multiply.c', code: String.raw`/* strassen_matrix_multiply.c -- 4.2 节：Strassen 矩阵乘法的可执行对照。
 *
 * 原书对应（第 4 版）：
 *   p.86–89  四步：分块，构造 S1…S10 与 P1…P7，递归求七个乘积，合并 C 的四块。
 *   p.87     T(n) = 7T(n/2) + Theta(n^2)。
 *
 * 输入矩阵按行连续存储，边长 n 必须是 2 的幂。为让每个中间量都可见，
 * 每层都复制出八个输入块、十个 S 块和七个 P 块；这不是省内存的工程实现。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o strassen_matrix_multiply strassen_matrix_multiply.c
 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

static void matrix_add(const int *left, const int *right, int *out, int count)
{
    for (int i = 0; i < count; i++) {
        out[i] = left[i] + right[i];
    }
}

static void matrix_subtract(const int *left, const int *right, int *out, int count)
{
    for (int i = 0; i < count; i++) {
        out[i] = left[i] - right[i];
    }
}

static void copy_block(const int *matrix, int stride, int row, int column, int size, int *out)
{
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            out[i * size + j] = matrix[(row + i) * stride + column + j];
        }
    }
}

static void write_block(int *matrix, int stride, int row, int column, int size, const int *block)
{
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            matrix[(row + i) * stride + column + j] = block[i * size + j];
        }
    }
}

static void strassen_multiply(const int *a, const int *b, int *c, int n)
{
    if (n == 1) {
        c[0] = a[0] * b[0];
        return;
    }

    const int half = n / 2;
    const int count = half * half;
    int *workspace = malloc((size_t)26 * (size_t)count * sizeof(*workspace));
    assert(workspace != NULL);

    int *a11 = workspace;
    int *a12 = a11 + count;
    int *a21 = a12 + count;
    int *a22 = a21 + count;
    int *b11 = a22 + count;
    int *b12 = b11 + count;
    int *b21 = b12 + count;
    int *b22 = b21 + count;
    int *s1 = b22 + count;
    int *s2 = s1 + count;
    int *s3 = s2 + count;
    int *s4 = s3 + count;
    int *s5 = s4 + count;
    int *s6 = s5 + count;
    int *s7 = s6 + count;
    int *s8 = s7 + count;
    int *s9 = s8 + count;
    int *s10 = s9 + count;
    int *p1 = s10 + count;
    int *p2 = p1 + count;
    int *p3 = p2 + count;
    int *p4 = p3 + count;
    int *p5 = p4 + count;
    int *p6 = p5 + count;
    int *p7 = p6 + count;
    int *temp = p7 + count;

    copy_block(a, n, 0, 0, half, a11);
    copy_block(a, n, 0, half, half, a12);
    copy_block(a, n, half, 0, half, a21);
    copy_block(a, n, half, half, half, a22);
    copy_block(b, n, 0, 0, half, b11);
    copy_block(b, n, 0, half, half, b12);
    copy_block(b, n, half, 0, half, b21);
    copy_block(b, n, half, half, half, b22);

    /* 原书 p.87 的 S1…S10。 */
    matrix_subtract(b12, b22, s1, count);
    matrix_add(a11, a12, s2, count);
    matrix_add(a21, a22, s3, count);
    matrix_subtract(b21, b11, s4, count);
    matrix_add(a11, a22, s5, count);
    matrix_add(b11, b22, s6, count);
    matrix_subtract(a12, a22, s7, count);
    matrix_add(b21, b22, s8, count);
    matrix_subtract(a11, a21, s9, count);
    matrix_add(b11, b12, s10, count);

    /* 原书 p.87–88 的七次递归乘法。 */
    strassen_multiply(a11, s1, p1, half);
    strassen_multiply(s2, b22, p2, half);
    strassen_multiply(s3, b11, p3, half);
    strassen_multiply(a22, s4, p4, half);
    strassen_multiply(s5, s6, p5, half);
    strassen_multiply(s7, s8, p6, half);
    strassen_multiply(s9, s10, p7, half);

    /* 原书 p.88–89 的四个合并公式。 */
    matrix_add(p5, p4, temp, count);
    matrix_subtract(temp, p2, temp, count);
    matrix_add(temp, p6, temp, count);
    write_block(c, n, 0, 0, half, temp);

    matrix_add(p1, p2, temp, count);
    write_block(c, n, 0, half, half, temp);

    matrix_add(p3, p4, temp, count);
    write_block(c, n, half, 0, half, temp);

    matrix_add(p5, p1, temp, count);
    matrix_subtract(temp, p3, temp, count);
    matrix_subtract(temp, p7, temp, count);
    write_block(c, n, half, half, half, temp);

    free(workspace);
}

static void naive_multiply(const int *a, const int *b, int *c, int n)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int sum = 0;
            for (int k = 0; k < n; k++) {
                sum += a[i * n + k] * b[k * n + j];
            }
            c[i * n + j] = sum;
        }
    }
}

static void check_product(const int *a, const int *b, int n)
{
    int result[16] = { 0 };
    int expected[16] = { 0 };
    strassen_multiply(a, b, result, n);
    naive_multiply(a, b, expected, n);
    for (int i = 0; i < n * n; i++) {
        assert(result[i] == expected[i]);
    }
}

int main(void)
{
    const int a2[] = { 1, 2, 3, 4 };
    const int b2[] = { 5, 6, 7, 8 };
    const int a4[] = {
        1, -2, 3, 0,
        4, 5, -1, 2,
        0, 3, 2, 1,
        -3, 1, 4, 2,
    };
    const int b4[] = {
        2, 1, 0, -1,
        3, -2, 4, 1,
        1, 0, -3, 2,
        5, 2, 1, 0,
    };

    check_product(a2, b2, 2);
    check_product(a4, b4, 4);
    puts("Strassen 2x2 and 4x4 checks passed.");
    return 0;
}


` },
      mapping: [
        { line: 1, c: 'copy_block 把 A、B 分成 a11…a22、b11…b22；n==1 直接返回标量乘积。' },
        { line: 2, c: 'matrix_add / matrix_subtract 的十组调用逐项构造 s1…s10。' },
        { line: 3, c: '七个 strassen_multiply 调用分别写入 p1…p7。' },
        { line: 4, c: '四组公式先写入 temp，再由 write_block 写回 C 的四个象限。' },
      ],
    },
    {
      type: 'analyze',
      title: '少一条分支，指数就变了',
      intro: '非递归阶段处理常数个半规模矩阵，所以总成本是 $\\Theta(n^2)$；真正改变增长阶的是递归项从 $8T(n/2)$ 改为 $7T(n/2)$。',
      claims: [
        { expr: 'T(n)=7T(n/2)+\\Theta(n^2)', when: 'n>1 时，分块、构造 S 和合并 C 为 Θ(n²)，外加七次半规模递归乘法', page: 87, source: 'book' },
        { expr: 'T(n)=\\Theta(n^{\\lg 7})', when: 'Strassen 递归式 (4.10) 的解', page: 89, source: 'book' },
        { expr: 'n^{\\lg 7}\\approx n^{2.807}', when: 'lg 7 = 2.8073549…，故其渐进上界为 O(n²·⁸¹)', page: 85, source: 'book' },
        { expr: '7\\text{ 次乘法}+18\\text{ 次加减}', when: '一次完整的块矩阵组合', page: 89, source: 'book' },
      ],
      tables: [{ caption: '四步的成本账本', rows: [
        ['步骤', '做了什么', '成本'],
        ['1', '按索引分成四块', '$\\Theta(1)$'],
        ['2', '构造 10 个 S，初始化 7 个 P', '$\\Theta(n^2)$'],
        ['3', '递归计算 7 个 P', '$7T(n/2)$'],
        ['4', '用 P 合并四个 C 块', '$\\Theta(n^2)$'],
      ] }],
      chart: { xMax: 32, series: [
        { name: 'n^lg 7', expr: 'Math.pow(n, Math.log2(7))', color: '--viz-done' },
        { name: 'n³', expr: 'n * n * n', color: '--viz-compare' },
      ] },
      derivations: [{ kind: 'substitution', title: '递归式如何从四步汇总出来', steps: [
        { tex: 'T(n)=\\underbrace{7T(n/2)}_{\\text{七个 }P_i}+\\underbrace{\\Theta(n^2)}_{\\text{构造与合并}}', zh: '步骤 3 是唯一的递归来源；步骤 1、2、4 都只做常数次块操作。' },
        { tex: 'n^{\\log_2 7}\\approx n^{2.807}<n^3', zh: '分支从 8 降为 7 后，递归树的叶子数和总增长阶都下降。' },
      ] }],
      note: '★ $\\Theta(n^2)$ 的加减没有消失；它比递归乘法增长得慢，因而不改变 $\\Theta(n^{\\lg7})$ 的主阶。',
    },
    {
      type: 'prove',
      title: '合并公式为什么恢复四个块',
      statement: 'We can see that Strassen’s remarkable algorithm, comprising steps 1–4, produces the correct matrix product using 7 submatrix multiplications and 18 submatrix additions. We can also see that recurrence (4.10) characterizes its running time.',
      page: 89,
      intro: '原书在 p.88–89 逐项展开 C₁₁，并说明其余三块同理。这里按“构造、相乘、抵消”检查账目；这是代数检算，不是把它伪装成原书的归纳证明。',
      steps: [
        { title: '第一步 · 每个 S 只重组已有块', en: 'S 1 = B 12 − B 22 ; S 2 = A 11 + A 12 ; S 3 = A 21 + A 22 ; S 4 = B 21 − B 11 ; S 5 = A 11 + A 22 ; S 6 = B 11 + B 22 ; S 7 = A 12 − A 22 ; S 8 = B 21 + B 22 ; S 9 = A 11 − A 21 ; S 10 = B 11 + B 12 :', page: 87, body: ['十个式子没有创造新信息，只以加减重新组合 A、B 的块。后续展开 P 时，每项仍是原始块乘积的线性组合。'] },
        { title: '第二步 · 七个 P 承载所有递归乘法', en: 'The only multiplications that the algorithm perform s are those in the middle column of these equations. The right-hand column just shows what these products equal in terms of the original submatrices created in step 1, but the terms are never explicitly calculated by the algorithm.', page: 88, body: ['例如 $P_1=A_{11}(B_{12}-B_{22})$、$P_2=(A_{11}+A_{12})B_{22}$。程序确实只调用七次递归乘法，右边展开仅用于验证。'] },
        { title: '第三步 · 合并时多余项两两抵消', en: 'A 11 • B 11 + A 12 • B 21 ; which corresponds to equation (4.5). Similarly, setting', page: 88, body: ['$C_{11}=P_5+P_4-P_2+P_6$。将四个 P 展开后，多余项抵消，只留下 $A_{11}B_{11}+A_{12}B_{21}$，恰是块乘法的 $C_{11}$；其余三块同理。'] },
      ],
      conclusion: '每个 C 块最终都等于 4.1 中对应的块矩阵乘法公式；因此拼回的 C 就是 A·B。七次 P 是计算量的来源，合并时的抵消是正确性的来源。',
    },
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'Strassen 用什么换走一次半规模递归矩阵乘法？', options: ['更多常数次子矩阵加减', '把矩阵缩成 n/3', '跳过一个 C 块', '把乘法改成比较'], answer: 0, why: '7 次递归乘法替代 8 次，代价是常数次子矩阵加减（p.85）。' },
        { kind: 'single', q: '步骤 3 的递归成本为何是 $7T(n/2)$？', options: ['有 7 个 S', '有 7 个 P，每个是半规模矩阵乘法', '每个 C 有 7 个元素', '第 7 行递归'], answer: 1, why: 'P₁ 到 P₇ 是七个递归得到的 n/2×n/2 矩阵乘积（p.86）。' },
        { kind: 'judge', q: 'Strassen 的每层非递归工作为 Θ(n³)。', answer: false, why: '错。构造 S 和合并 C 只做常数次子矩阵加减，总计为 Θ(n²)（p.86–89）。' },
        { kind: 'single', q: '下列哪个是原书的 $P_1$？', options: ['$A_{11}\\cdot S_1$', '$S_1\\cdot S_2$', '$A_{12}\\cdot B_{21}$', '$P_5-P_4$'], answer: 0, why: 'p.87 定义 $P_1=A_{11}\\cdot S_1$。' },
        { kind: 'single', q: '原书统计一次完整块组合共做几次子矩阵加减？', options: ['10', '12', '17', '18'], answer: 3, why: '原书总计为 18 次子矩阵加减（p.89）。' },
        { kind: 'judge', q: '七个 P 是把普通算法的八个子矩阵乘积直接删掉一个得到的。', answer: false, why: '错。P 使用 S 的和、差重组；正确性依赖最后合并时的代数抵消。' },
        { kind: 'simulate', q: 'Strassen 递归式中半规模递归乘法的个数是多少？', expect: [7], placeholder: '输入一个整数', why: '步骤 3 递归计算 P₁…P₇，因此递归项是 $7T(n/2)$（p.86–87）。' },
      ],
      bookExercises: [
        { id: '4.2-1', page: 89, star: 0, statement: 'Use Strassen’s algorithm to compute the matrix product', hint: '先按 p.87 写齐 S₁…S₁₀，再算 P₁…P₇；最后用四个 C 合并式。' },
        { id: '4.2-2', page: 89, star: 0, statement: 'Write pseudocode for Strassen’s algorithm.', hint: '以本关阶段 4 的四步为骨架，补上 n=1 基例、十个 S 公式、七个递归调用和四个写回式。' },
        { id: '4.2-3', page: 89, star: 0, statement: 'What is the largest k such that if you can multiply 3 × 3 matrices using k multi- plications (not assuming commutativity of multiplication), then you can multiply n × n matrices in o(n lg 7 ) time? What is the running time of this algorithm?', hint: '将递归式写为 $T(n)=kT(n/3)+\\Theta(n^2)$，再与 $n^{\\lg7}$ 比较指数。' },
        { id: '4.2-4', page: 89, star: 0, statement: 'V . Pan discovered a way of multiplying 68 × 68 matrices using 132,464 multi- plications, a way of multiplying 70 × 70 matrices using 143,640 multiplications, and a way of multiplying 72 × 72 matrices using 155,424 multiplications. Which method yields the best asymptotic running time when used in a divide-and-conquer matrix-multiplication algorithm? How does it compare with Strassen’s algorithm?', hint: '每个方案的指数是 $\\log_b a$；分别计算后，最小者对应最佳渐进时间。' },
        { id: '4.2-5', page: 90, star: 0, statement: 'Show how to multiply the complex numbers a C bi and c C di using only three multiplications of real numbers. The algorithm should take a, b, c , and d as input and produce the real component ac − bd and the imaginary component ad C bc separately.', hint: '仿照 $x^2-y^2$：先选三个容易相乘的线性组合，再用加减恢复实部和虚部。' },
        { id: '4.2-6', page: 90, star: 0, statement: 'Suppose that you have a Θ.n ˛ /-time algorithm for squaring n × n matrices, where', hint: '平方和一般矩阵乘法可互相归约；先把目标乘积嵌入一个更大的块矩阵平方。' },
      ],
    },
  ],
};
