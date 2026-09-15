/* =============================================================================
 * 第 4 章 4.1 —— 方阵相乘：三重循环与八分支分治。原文锚点：印刷页 80–84。
 * ========================================================================== */

export default {
  key: 's01',
  id: 'ch04/s01',
  chapter: 4,
  section: '4.1',
  title: '方阵相乘：三重循环与八分支分治',
  shortTitle: '4.1 方阵相乘',
  titleEn: 'Multiplying square matrices',
  source: { printed: [80, 84], pdf: [101, 105] },
  sourceNote: '本关对应原书 4.1 节（印刷页 80–84）。',
  prerequisites: [
    { label: '2.3 Merge sort（递归分治）', url: '#/ch02/s03' },
  ],
  stages: [
    {
      type: 'map',
      title: '先把矩阵乘法写成可数的工作',
      why: '方阵乘法是分治矩阵算法的基线：先看清普通三重循环怎样填满 C，再看递归版本为何仍然是 $\\Theta(n^3)$。',
      position: '本关从定义和直接算法出发，连接到 4.2 的 Strassen。4.3–4.5 再分别学习如何证明、画出和套用递归式。',
      unlocks: [{ label: '4.2 Strassen：七次矩阵乘法', url: '#/ch04/s02' }],
      mathKit: [
        { title: '矩阵乘积', body: '$c_{ij}=\\sum_{k=1}^{n}a_{ik}b_{kj}$：固定行 $i$ 与列 $j$，沿 $k$ 做点积。' },
        { title: '分块乘法', body: '把每个 $n\\times n$ 矩阵切成四个 $n/2\\times n/2$ 块；每个结果块是两次半规模矩阵乘法之和。' },
        { title: '递归式', body: '八个半规模子问题给出 $T(n)=8T(n/2)+\\Theta(1)$，主方法随后把它化成 $\\Theta(n^3)$。' },
      ],
    },
    {
      type: 'intuition',
      title: '每个结果格子都是一次点积',
      scene: '把 A 的一行和 B 的一列配对，逐项相乘后把账目相加，填入 C 的一个格子',
      body: [
        '先选定 C 的位置 $(i,j)$。它只关心 A 的第 $i$ 行和 B 的第 $j$ 列；$k$ 从 1 到 $n$ 时，每一项 $a_{ik}b_{kj}$ 都给这个格子贡献一点。',
        '外层两个循环负责“去哪一个格子”，内层循环负责“这个格子累加哪些项”。因此共有 $n^2$ 个格子，每个格子做 $n$ 次乘加。',
        '递归版本把同一账本改写成四块相乘：每个 C 块需要两个 A 块与 B 块的乘积，四个 C 块合计八次半规模乘法。',
      ],
      interactive: { text: '阶段 5 的动画固定 $A=[[1,2],[3,4]]$、$B=[[5,6],[7,8]]$，逐帧显示当前的 $i,j,k$、乘积和部分和。' },
    },
    {
      type: 'source',
      title: '书上是怎么说的',
      lead: '先读定义和直接算法，再把它们与后面的块矩阵递归联系起来。英文原文保持原书措辞。',
      blocks: [
        { kind: 'body', page: 80, en: 'We can use the divide-and-conquer method to multiply square matrices. If you’ve seen matrices before, then you probably know how to multiply them. (Otherwise, you should read Section D.1.) Let A = (a i k ) and B = (b j k ) be square n × n matrices. The matrix product C = A • B is also an n × n matrix, where for i,j = 1,2,…,n , the (i,j) entry of C is given by c ij = n X kD1 a i k • b kj : (4.1)', zh: '定义把一个矩阵元素变成一次点积：固定 $i,j$ 后，$k$ 扫过整行和整列。' },
        { kind: 'body', page: 81, en: 'Computing the matrix C requires computing n 2 matrix entries, each of which is the sum of n pairwise products of input elements from A and B . The MATRIX- MULTIPLY procedure implements this strategy in a straightforward manner, and it generalizes the problem slightly.', zh: '共有 $n^2$ 个输出元素；每个元素是 $n$ 个乘积之和，所以三重循环的计数已经露出来了。' },
        { kind: 'body', page: 81, en: 'Generally, we’ll assume that the matrices are dense, meaning that most of the n 2 entries are not 0, as opposed to sparse, where most of the n 2 entries are 0 and the nonzero entries can be stored more compactly than in an n × n array.', zh: '本关按稠密矩阵讨论：大多数元素非零，直接使用 n×n 数组；稀疏矩阵需要另一套存储与算法取舍。' },
        { kind: 'body', page: 81, en: 'The pseudocode for MATRIX-MULTIPLY works as follows. The for loop of lines 1–4 computes the entries of each row i , and within a given row i , the for loop of lines 2–4 computes each of the entries c ij for each column j . Each iteration of the for loop of lines 3–4 adds in one more term of equation (4.1).', zh: '第 1 层决定行，第 2 层决定列，第 3 层每循环一次就为当前 $c_{ij}$ 增加一个式 (4.1) 的项。' },
        { kind: 'body', page: 81, en: 'Because each of the triply nested for loops runs for exactly n iterations, and each execution of line 4 takes constant time, the MATRIX-MULTIPLY procedure operates in Θ(n 3 ) time. Even if we add in the Θ(n 2 ) time for initializing C to 0, the running time is still Θ(n 3 ).', zh: '三个循环各运行 $n$ 次，行 4 是常数时间，因此总成本为 $\\Theta(n^3)$；初始化的 $\\Theta(n^2)$ 不改变主阶。' },
        { kind: 'body', page: 82, en: 'C 11 = A 11 • B 11 + A 12 • B 21 ; (4.5)', zh: '块矩阵的左上结果块由两次半规模乘法相加得到，其余三个块完全平行。' },
        { kind: 'body', page: 83, en: 'The procedure MATRIX-MULTIPLY-RECURSIVE uses equations (4.5)3(4.8) to implement a divide-and-conquer strategy for square-matrix multiplication.', zh: '递归过程把四个结果块各拆成两项，因此一层产生八个规模为 $n/2$ 的递归调用。' },
      ],
      terms: [
        { en: 'matrix product', zh: '矩阵乘积：$C=A\\cdot B$，每个 $c_{ij}$ 是一行与一列的点积', page: 80 },
        { en: 'dense', zh: '稠密矩阵：大多数 $n^2$ 个元素都不是 0', page: 81 },
        { en: 'submatrix', zh: '子矩阵：分块后得到的 $n/2\\times n/2$ 矩阵', page: 82 },
      ],
    },
    {
      type: 'pseudocode',
      title: '逐行拆开 MATRIX-MULTIPLY',
      algo: 'MATRIX-MULTIPLY',
      signature: 'MATRIX-MULTIPLY (A, B, C, n)',
      page: 81,
      lines: [
        { n: 1, code: 'for i = 1 to n / / compute entries in each of n rows', zh: '依次选择结果矩阵 C 的一行。' },
        { n: 2, code: 'for j = 1 to n / / compute n entries in row i', zh: '在当前行中依次选择一个列，确定当前的 $c_{ij}$。' },
        { n: 3, code: 'for k = 1 to n', zh: '沿 A 的第 $i$ 行和 B 的第 $j$ 列同步前进。' },
        { n: 4, code: 'c ij = c ij + a i k • b kj / / add in another term of equation (4.1)', zh: '把一项 $a_{ik}b_{kj}$ 加到当前部分和中；循环结束时就得到 $c_{ij}$。' },
      ],
      vars: [
        { name: 'A, B, C', meaning: '输入矩阵 A、B 与累加结果的 n×n 矩阵 C' },
        { name: 'i, j', meaning: '当前输出元素的行号与列号（原书从 1 开始）' },
        { name: 'k', meaning: '点积中的求和下标，逐项扫描 1…n' },
        { name: 'cᵢⱼ', meaning: '当前输出元素的部分和；若 C 初始为 0，就是 A·B 的元素' },
      ],
      note: '原书说明 MATRIX-MULTIPLY 把 A·B 加到 C 上；只想得到乘积时，先把 C 的 n² 个元素初始化为 0。',
    },
    {
      type: 'visualize',
      title: '看着一个元素怎样被填满',
      viz: 'matrix-product',
      algorithm: 'matrix-multiply-demo',
      pseudocodeRef: 'MATRIX-MULTIPLY',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8] },
      invariants: [{ label: '每完成一个 k，当前 cᵢⱼ 等于前 k 项乘积之和' }],
      presets: [
        { name: '2×2 基本例', array: [1, 2, 3, 4, 5, 6, 7, 8] },
        { name: '含负数例', array: [2, -1, 0, 3, 4, 1, -2, 5] },
      ],
      tasks: [
        '播放到第一个元素完成，检查 $1\\cdot5+2\\cdot7=19$。',
        '找到第二行第二列的两次乘积，验证最终值为 50。',
        '数一数 2×2 输入需要多少个“乘加”帧，并与 $n^3$ 对照。',
      ],
    },
    {
      type: 'code',
      title: '把三重循环写进 C',
      intro: 'C 使用 0 基下标，因此书中的 $i,j,k=1$ 对应 C 中的 0；循环结构与原书 MATRIX-MULTIPLY 一一对应。',
      pseudocodeRef: 'MATRIX-MULTIPLY',
      c: { file: 'matrix_multiply.c', code: String.raw`/* matrix_multiply.c -- 4.1 节：MATRIX-MULTIPLY 的 C 对照。 */
#include <assert.h>
#include <stdio.h>

static void matrix_multiply(const int *a, const int *b, int *c, int n)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                c[i * n + j] += a[i * n + k] * b[k * n + j];
            }
        }
    }
}

static void check_product(const int *a, const int *b, const int *expected, int n)
{
    int result[16] = { 0 };
    matrix_multiply(a, b, result, n);
    for (int i = 0; i < n * n; i++) {
        assert(result[i] == expected[i]);
    }
}

int main(void)
{
    const int a2[] = { 1, 2, 3, 4 };
    const int b2[] = { 5, 6, 7, 8 };
    const int expected2[] = { 19, 22, 43, 50 };
    const int a3[] = { 1, 0, 2, -1, 3, 1, 4, 2, 0 };
    const int b3[] = { 2, 1, 3, 0, -1, 2, 1, 4, 0 };
    const int expected3[] = { 4, 9, 3, -1, 0, 3, 8, 2, 16 };

    check_product(a2, b2, expected2, 2);
    check_product(a3, b3, expected3, 3);
    puts("MATRIX-MULTIPLY 2x2 and 3x3 checks passed.");
    return 0;
}
`, },
      mapping: [
        { pc: 1, pcCode: 'for i = 1 to n', c: 'for (int i = 0; i < n; i++)' },
        { pc: 2, pcCode: 'for j = 1 to n', c: 'for (int j = 0; j < n; j++)' },
        { pc: 3, pcCode: 'for k = 1 to n', c: 'for (int k = 0; k < n; k++)' },
        { pc: 4, pcCode: 'c ij = c ij + a i k • b k j', c: 'c[i * n + j] += a[i * n + k] * b[k * n + j]' },
      ],
    },
    {
      type: 'analyze',
      title: '三个循环，三次方增长',
      intro: '直接算法把每个输出元素的点积都算一遍；递归算法虽然换了组织方式，却仍然留下同样的立方数量级。',
      claims: [
        { expr: '\\Theta(n^3)', when: 'MATRIX-MULTIPLY 的运行时间', page: 81, source: 'book' },
        { expr: 'n^2\\cdot n=n^3', when: 'n² 个输出元素，每个做 n 次乘加', page: 81, source: 'instructor' },
        { expr: 'T(n)=8T(n/2)+\\Theta(1)', when: '索引分块的递归版本', page: 84, source: 'book' },
        { expr: 'T(n)=\\Theta(n^3)', when: '递归式 (4.9) 的解', page: 84, source: 'book' },
      ],
      tables: [{ caption: '一次直接乘法的工作账本', rows: [
        ['对象', '数量'],
        ['输出元素 cᵢⱼ', '$n^2$ 个'],
        ['每个元素的乘积项', '$n$ 项'],
        ['总乘加次数', '$n^3$ 次'],
        ['初始化 C', '$\\Theta(n^2)$，不改变主阶'],
      ] }],
      chart: { xMax: 32, series: [
        { name: 'n³', expr: 'n * n * n', color: '--viz-done' },
        { name: 'n²', expr: 'n * n', color: '--viz-compare' },
      ] },
      derivations: [{ kind: 'summation', title: '从三层循环数出 n³', steps: [
        { tex: '\\sum_{i=1}^{n}\\sum_{j=1}^{n}\\sum_{k=1}^{n}1=n\\cdot n\\cdot n=n^3', zh: '每次执行第 4 行记 1 个常数单位，三层循环的笛卡尔积有 n³ 个组合。' },
        { tex: 'T(n)=8T(n/2)+\\Theta(1)', zh: '递归版本每层没有合并复制，只有常数时间的索引分块和八个半规模调用。' },
      ] }],
      note: '分治改变了访问方式，不会自动减少乘法数量；4.2 的 Strassen 正是通过把八次改写成七次才改变指数。',
    },
    {
      type: 'prove',
      title: '循环结束时，当前元素已经正确',
      statement: 'Each iteration of the for loop of lines 3–4 adds in one more term of equation (4.1).',
      page: 81,
      intro: '证明对象是内层循环的不变量：处理完第 k 项后，cᵢⱼ 已经包含前 k 个乘积项；终止时 k=n，正好得到式 (4.1)。',
      steps: [
        { title: '第一步 · 初始化', en: 'The for loop of lines 1–4 computes the entries of each row i , and within a given row i , the for loop of lines 2–4 computes each of the entries c ij for each column j .', page: 81, body: ['固定一对 $i,j$ 后，内层循环开始前，$c_{ij}$ 还是 C 中已有的累加值；若 C 已初始化为 0，它就是空和。'] },
        { title: '第二步 · 保持', en: 'Each iteration of the for loop of lines 3–4 adds in one more term of equation (4.1).', page: 81, body: ['第 k 次迭代只增加 $a_{ik}b_{kj}$，不会改动已经累加的前 k−1 项，所以不变量保持。'] },
        { title: '第三步 · 终止', en: 'Because each of the triply nested for loops runs for exactly n iterations, and each execution of line 4 takes constant time, the MATRIX-MULTIPLY procedure operates in Θ(n 3 ) time.', page: 81, body: ['当 k 走完 1…n，cᵢⱼ 已包含式 (4.1) 的全部 n 项；再遍历所有 i,j，就得到整个矩阵乘积。'] },
      ],
      conclusion: '不变量把“一个格子的部分和”连接到“整个矩阵正确”：内层结束给出一个 cᵢⱼ，外层两个循环结束给出全部 C。',
    },
    {
      type: 'drill',
      title: '检验一下',
      items: [
        { kind: 'single', q: 'MATRIX-MULTIPLY 的第 3 层循环变量 k 在做什么？', options: ['选择输出行', '选择输出列', '枚举当前行与列的点积项', '把矩阵分成四块'], answer: 2, why: 'k 扫描 aᵢₖ 与 bₖⱼ，逐项累加到 cᵢⱼ（p.81）。' },
        { kind: 'judge', q: '每个 cᵢⱼ 都是 A 的一行和 B 的一列的点积。', answer: true, why: '式 (4.1) 对 k 求和，正是这两个向量的点积。' },
        { kind: 'single', q: '直接算法为什么是 Θ(n³)？', options: ['只有 n 个输出元素', 'n² 个元素各需 n 次乘加', '初始化 C 需要 n³', '分块复制了 n³ 个元素'], answer: 1, why: 'n²·n=n³；初始化只有 Θ(n²)（p.81）。' },
        { kind: 'single', q: '递归矩阵乘法一层有多少个半规模子问题？', options: ['2 个', '4 个', '7 个', '8 个'], answer: 3, why: '四个 C 块各由两个乘积组成，共八次递归调用（p.82–84）。' },
        { kind: 'judge', q: '只要把矩阵切成四块，递归版本就一定比三重循环快一个数量级。', answer: false, why: '普通分块递归仍满足 T(n)=8T(n/2)+Θ(1)=Θ(n³)；Strassen 才把分支降为 7。' },
        { kind: 'simulate', q: '在 A=[[1,2],[3,4]]、B=[[5,6],[7,8]] 中，c₁₁ 的第二项 a₁₂b₂₁ 是多少？', expect: [14], placeholder: '例如：14', why: '第二次内层迭代取 2×7=14，和第一项 1×5 相加得到 19。' },
        { kind: 'single', q: '复制子矩阵与索引分块的区别是什么？', options: ['复制是 Θ(1)，索引是 Θ(n²)', '复制是 Θ(n²)，索引分块是 Θ(1)', '二者都会改变递归分支数', '二者都不能更新原矩阵'], answer: 1, why: '复制 3n² 个元素是 Θ(n²)；索引只保存位置，按书中假设为 Θ(1)（p.82）。' },
      ],
      bookExercises: [
        { id: '4.1-1', page: 84, star: 0, statement: 'Generalize MATRIX-MULTIPLY-RECURSIVE to multiply n × n matrices for which n is not necessarily an exact power of 2. Give a recurrence describing its running time. Argue that it runs in Θ(n 3 ) time in the worst case.', hint: '允许补零或让边界块变小，再按最大规模写递归式；关键是证明填充后的规模仍与 n 同阶。' },
        { id: '4.1-2', page: 84, star: 0, statement: 'How quickly can you multiply a kn × n matrix (kn rows and n columns) by an n × kn matrix, where k ≥ 1, using MATRIX-MULTIPLY-RECURSIVE as a subroutine? Answer the same question for multiplying an n × kn matrix by a kn × n matrix. Which is asymptotically faster, and by how much?', hint: '先写出两个结果矩阵的形状，再把矩形乘法拆成多少个 n×n 方阵乘法。' },
        { id: '4.1-3', page: 85, star: 0, statement: 'Suppose that instead of partitioning matrices by in dex calculation in MATRIX- MULTIPLY-RECURSIVE , you copy the appropriate elements of A, B , and C into separate n/2 × n/2 submatrices A 11 , A 12 , A 21 , A 22 ; B 11 , B 12 , B 21 , B 22 ; and C 11 , C 12 , C 21 , C 22 , respectively. After the recursive calls, you copy the results from C 11 , C 12 , C 21 , and C 22 back into the appropriate places in C . How does recurrence (4.9) change, and what is its solution?', hint: '每层新增的是复制 3n² 个元素；把它写成递归式的非递归项，再比较主阶。' },
        { id: '4.1-4', page: 85, star: 0, statement: 'Write pseudocode for a divide-and-conquer algorithm MATRIX-ADD-RECURSIVE that sums two n × n matrices A and B by partitioning each of them into four n/2 × n/2 submatrices and then recursively summing corresponding pairs of sub- matrices. Assume that matrix partitioning uses Θ(1)-time index calculations.', hint: '四个象限分别递归相加；基例只需一次标量加法，注意索引分块不复制元素。' },
      ],
    },
  ],
};
