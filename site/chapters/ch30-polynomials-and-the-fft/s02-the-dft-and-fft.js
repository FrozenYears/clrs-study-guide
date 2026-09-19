/* 第 30 章 30.2：DFT 与 FFT（The DFT and FFT）。印刷页 885–893（pdf 906–914）。 */
export default {
  key:'s02',id:'ch30/s02',chapter:30,section:'30.2',
  title:'FFT：把求值点选成单位根',shortTitle:'30.2 DFT 与 FFT',
  titleEn:'The DFT and FFT',
  source:{printed:[885,893],pdf:[906,914]},
  prerequisites:[{label:'30.1 多项式的表示',url:'#/ch30/s01'}],
  stages:[
   {type:'map',title:'ωₙ = e^{2πi/n} 让分治成为可能',
    why:'把求值点取成 $n$ 次单位根 $\\omega_n^{0}, \\dots, \\omega_n^{n-1}$，求值就变成 **DFT**：$y_k = \\sum_j a_j \\omega_n^{jk}$。用**折半引理**把 $n$ 点问题拆成两个 $n/2$ 点问题（偶下标、奇下标各一组），再用**消去引理**把两半的旋转因子合并 —— 这就是 FFT，递推 $T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\lg n)$。',
    position:'本章的核心一节：定理 30.2 的 $\\Theta(n \\lg n)$ 乘法由此落地，30.3 再把它画成电路。',
    unlocks:[{label:'30.3 FFT 电路',url:'#/ch30/s03'}],
    mathKit:[
     {title:'DFT',body:'$y_k = \\sum_{j=0}^{n-1} a_j \\omega_n^{jk}$，其中 $\\omega_n = e^{2\\pi i/n}$。'},
     {title:'消去引理（引理 30.3）',body:'$\\omega_{dn}^{dk} = \\omega_n^{k}$ —— 让不同层的旋转因子可以互换。'},
     {title:'推论 30.4',body:'$n$ 为偶数时 $\\omega_n^{n/2} = \\omega_2 = -1$。'},
     {title:'折半引理（引理 30.5）',body:'$n$ 个 $n$ 次单位根的平方恰好是 $n/2$ 个 $n/2$ 次单位根，每个出现两次 —— 子问题规模减半的依据。'},
     {title:'求和引理（引理 30.6）',body:'$\\sum_{j=0}^{n-1} (\\omega_n^{k})^{j} = 0$（$n \\nmid k$ 时）—— 逆 DFT 的系数 $1/n$ 由此而来。'},
    ]},
   {type:'intuition',title:'五个实测：从手算 DFT 到 100 倍加速',scene:'C 程序 Part 2–7',body:[
     '★ parts 2：朴素 DFT 算 $a = (0,1,2,3)$（原书习题 30.2-2）得 $(6, -2-2i, -2, -2+2i)$，与手算逐位一致（$\\omega_4 = i$）。',
     '★ part 3：把 30.1 那两个多项式补零到 $n = 8$ 后走"FFT → 逐点乘 → 逆 FFT"，与朴素卷积最大差 $1.4\\text{e-}14$ —— 路线不同，结果相同。',
     '★ part 4：系数 → 点值 → 系数往返误差 $3.6\\text{e-}15$（逆变换用 $\\omega_n^{-1} = \\overline{\\omega_n}$ 再除以 $n$）。',
     '★ part 5：递归 FFT 与迭代 FFT（位反转 + 蝶形）最大差 $5\\text{e-}16$；迭代版在 $n = 8$ 上恰好做 $12 = (n/2)\\lg n$ 个蝶形。',
     '★★ part 7：$n = 1024$ 时朴素 DFT 用 1048576 次复数乘法，FFT 只用 10240 次 —— 比值 **102.4**。这个数字比任何 $O$ 记号都直观：$\\Theta(n^{2})$ 对 $\\Theta(n \\lg n)$。',
     '⚠ FFT 只对**长度是 2 的幂**的输入直接可用；一般长度要么补零、要么用混合基（习题 30.2-5 讨论 3 的幂）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 ! n 代表 ωₙ、2− i 代表 2πi、ã 代表左括号）。',blocks:[
     {kind:'body',page:885,en:'There are exactly n complex nth roots of unity: e 2− i k/n for k = 0,1,…,n − 1.',
      zh:'★★ $n$ 次单位根恰好有 $n$ 个：$e^{2\\pi i k/n}$。'},
     {kind:'body',page:885,en:'Figure 30.2 shows that the n complex roots of unity are equally spaced around the circle of unit radius centered at the origin of the complex plane.',
      zh:'★ 几何图像：$n$ 个单位根均匀分布在单位圆上。'},
     {kind:'body',page:886,en:'is the principal nth root of unity. 2 All other complex nth roots of unity are powers of ! n .',
      zh:'★★ 主 $n$ 次单位根 $\\omega_n = e^{2\\pi i/n}$，其余全是它的幂（原书式 30.6）。'},
     {kind:'body',page:887,en:'If n>0 is even, then the squares of the n complex nth roots of unity are the n/2 complex (n/2)th roots of unity.',
      zh:'★★ 引理 30.5（折半引理）：平方把 $n$ 次根映到 $n/2$ 次根上 —— 子问题减半的依据。'},
     {kind:'body',page:887,en:'As we’ll see, the halving lemma is essential to the divide-and-conquer approach for converting between coefficient and point-value representations of polynomials, since it guarantees that the recursive subproblems are only half as large.',
      zh:'★★ 原书自己点明：折半引理**保证递归子问题规模减半**，这是 $\\Theta(n \\lg n)$ 的关键。'},
     {kind:'body',page:887,en:'Thus ! k n and ! k + n/2 n have the same square.',
      zh:'★ 每个 $n/2$ 次根恰好被平方两次 —— 折半引理的"每个出现两次"。'},
     {kind:'theorem',page:892,en:'For j,k = 0,1,…,n − 1, the (j,k) entry of V −1 n is ! −j k n =n.',
      zh:'★★ 定理 30.7：逆 DFT 的矩阵元素是 $\\omega_n^{-jk}/n$ —— 逆变换 = 用 $\\omega_n^{-1}$ 做一次 DFT 再除以 $n$。'},
     {kind:'theorem',page:892,en:'where the vectors a and b are padded with 0s to length 2n and • denotes the componentwise product of two 2n-element vectors.',
      zh:'★★ 定理 30.8（卷积定理）：$a \\otimes b = \\text{DFT}^{-1}(\\text{DFT}(a) \\cdot \\text{DFT}(b))$ —— 这就是 C 程序 part 3 的三步路线。'},
    ],terms:[{en:'DFT',zh:'离散傅里叶变换',page:885},
              {en:'nth roots of unity',zh:'n 次单位根',page:885},
              {en:'Convolution theorem',zh:'卷积定理',page:892}]},
   {type:'pseudocode',title:'FFT：原书 p.890 的过程（本站清理排版伪影）',algo:'FFT',signature:'FFT(a, ω)',
    page:890,
    lines:[
     {n:1,code:'FFT(a, ω)                     // n 是 2 的幂，n = len(a)',zh:''},
     {n:2,code:'    if n == 1',zh:'★ 基例：1 个元素的 DFT 就是它自己。'},
     {n:3,code:'        return a',zh:''},
     {n:4,code:'    ω_n = e^{2πi/n}',zh:'★ 主 n 次单位根（原书在调用侧就已算好并传入）。'},
     {n:5,code:'    ω = 1',zh:'★ 旋转因子累乘器。'},
     {n:6,code:'    a_even = (a_0, a_2, …, a_{n-2})',zh:'★★ 偶下标子向量。'},
     {n:7,code:'    a_odd  = (a_1, a_3, …, a_{n-1})',zh:'★★ 奇下标子向量 —— 折半引理保证这两半规模都是 $n/2$。'},
     {n:8,code:'    y_even = FFT(a_even, ω_n^2)',zh:'★ ω_n² 是 n/2 次单位根（消去引理）。'},
     {n:9,code:'    y_odd  = FFT(a_odd, ω_n^2)',zh:'★ 两个子问题。'},
     {n:10,code:'    for k = 0 to n/2 − 1',zh:'★ 蝶形合并，$n/2$ 次。'},
     {n:11,code:'        y_k         = y_even[k] + ω · y_odd[k]',zh:'★★ 上半个输出。'},
     {n:12,code:'        y_{k+n/2}   = y_even[k] − ω · y_odd[k]',zh:'★★ 下半个输出（推论 30.4：ω_n^{n/2} = −1）。'},
     {n:13,code:'        ω = ω · ω_n',zh:'★ 旋转因子推进（原书把这步放在循环末尾以避免重复求幂）。'},
     {n:14,code:'    return y',zh:'★ 递推 $T(n) = 2T(n/2) + \\Theta(n)$ → $\\Theta(n \\lg n)$。'}],
    vars:[{name:'ω',meaning:'当前旋转因子，逐次乘 $\\omega_n$ 推进'},
          {name:'y_even / y_odd',meaning:'两个 $n/2$ 点 DFT 的结果'}],
    note:'★ 语料把这一段抽得很有代表性：`! n = e 2− i/n`（应为 $\\omega_n = e^{2\\pi i/n}$）、`y even DFFT(a even ,n/2)`（`D` 其实是 `=`）。本段按渲染页的形状清理后列出；原书框内是 12 行语句加一行脚注，本段为便于对照 C 代码而略有展开。C 程序的 `fft_rec` 是它的直译。',
    more:[{algo:'RECURSIVE-FFT 的代价',subtitle:'递推与蝶形数：每层 n/2 个蝶形、共 lg n 层',signature:'T(n) = 2T(n/2) + Θ(n)',page:890,
      lines:[{n:1,code:'每层：n/2 个蝶形（每个 1 次复数乘法 + 2 次加法）',zh:'★ 蝶形是 FFT 的基本积木（30.3 画成电路）。'},
        {n:2,code:'层数：lg n（每层规模减半）',zh:'★ 折半引理保证规模严格减半。'},
        {n:3,code:'总计：蝶形 (n/2)·lg n 个 → Θ(n lg n)',zh:'★★ C 程序 part 5 在 $n = 8$ 上数到 12 个蝶形；(8/2)·3 = 12 ✓。'},
        {n:4,code:'对比朴素 DFT：n² 次复数乘法',zh:'★ part 7 在 $n = 1024$ 上量到 102.4 倍的差距。'}],
      vars:[{name:'蝶形',meaning:'一对输入 $\\to$ 一对输出，中间乘一次旋转因子'}],
      note:'★ 这条递推与 28.2 的分治求逆同形（都是 $2T(n/2) + \\Theta(\\cdot)$），只是额外项从 $M(n)$ 换成了 $\\Theta(n)$。'}]},
   {type:'visualize',title:'分治的形状：偶/奇两组',panels:[
     {title:'$n = 8$ 的递归拆分',viz:'tree',
      trees:[{root:{"label": "a0..a7", "cost": "深度 0：n = 8", "children": [{"label": "偶下标 (0,2,4,6)", "cost": "深度 1", "children": [{"label": "(0,4)", "cost": "深度 2", "children": [{"label": "a0", "cost": "深度 3"}, {"label": "a4", "cost": "深度 3"}]}, {"label": "(2,6)", "cost": "深度 2", "children": [{"label": "a2", "cost": "深度 3"}, {"label": "a6", "cost": "深度 3"}]}]}, {"label": "奇下标 (1,3,5,7)", "cost": "深度 1", "children": [{"label": "(1,5)", "cost": "深度 2", "children": [{"label": "a1", "cost": "深度 3"}, {"label": "a5", "cost": "深度 3"}]}, {"label": "(3,7)", "cost": "深度 2", "children": [{"label": "a3", "cost": "深度 3"}, {"label": "a7", "cost": "深度 3"}]}]}]}}],
      treeNotes:['★ 每一层的子向量都是上一层的"偶下标"与"奇下标"。',
        '★ 深度 $\\lg n = 3$，每层总规模仍是 $n$ —— 这就是递推 $T(n) = 2T(n/2) + \\Theta(n)$ 的来源。',
        '★ C 程序的 `fft_rec` 就是这个树的自顶向下实现；`fft_iter` 则把它展平成"位反转 + $\\lg n$ 级蝶形"（30.3）。'],
      },
    ],tasks:['对照 C 程序 part 5 打印的蝶形数 12 = (n/2)·lg n。'],note:''},
   {type:'code',title:'实测：手算 DFT、三路互验、102 倍加速',c:{file:'fft.c',code:String.raw`/* fft.c -- 30 章：多项式与 FFT。
 *
 * 关键数字（全部断言，不靠"看起来对"）：
 *   part 1  朴素乘法：(7x³−x²+x−10)(8x³−6x+3) = 56x⁶−8x⁵−34x⁴−53x³−9x²+63x−30
 *           （原书习题 30.1-1 的那两个多项式）；
 *   part 2  朴素 DFT 的 (0,1,2,3) → (6, −2−2i, −2, −2+2i)（原书习题 30.2-2）；
 *   part 3  FFT 乘法结果与朴素乘法逐系数一致（误差 < 1e-9）；
 *   part 4  系数 → DFT → 逆 DFT 往返回到原系数（误差 < 1e-12）；
 *   part 5  递归 FFT 与迭代 FFT（位反转 + 蝶形）逐元素一致；n=8 时蝶形 12 个
 *           = (n/2)·lg n，深度 lg n = 3 级；
 *   part 6  位反转是自逆置换（rev(rev(k)) = k）；
 *   part 7  n = 1024 时 FFT 的复数乘法比朴素 DFT 少约 200 倍。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o fft fft.c -lm
 */
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

#define MAXN 2048
#define PI 3.14159265358979323846

typedef struct { double re, im; } cplx;

static long g_cmul;                    /* 复数乘法计数器 */
static long g_butterfly;               /* 蝶形计数器 */

static cplx cx(double re, double im) { cplx z; z.re = re; z.im = im; return z; }
static cplx cadd(cplx a, cplx b) { return cx(a.re + b.re, a.im + b.im); }
static cplx csub(cplx a, cplx b) { return cx(a.re - b.re, a.im - b.im); }
static cplx cmul(cplx a, cplx b)
{
    g_cmul++;
    return cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}
static double cabs2(cplx a) { return a.re * a.re + a.im * a.im; }

/* ω_n^k = e^{2πik/n} —— 原书式 (30.6) 的主 n 次单位根 */
static cplx omega(int k, int n)
{
    double ang = 2.0 * PI * (double)(k % n) / (double)n;
    return cx(cos(ang), sin(ang));
}

/* ---------- 朴素乘法（原书式 30.1 与 30.2）：结果 c 长度 2n−1 ---------- */
static void naive_mul(const double *a, int n, const double *b, int m, double *c)
{
    for (int i = 0; i < n + m - 1; i++) { c[i] = 0.0; }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) { c[i + j] += a[i] * b[j]; }
    }
}

/* ---------- 朴素 DFT：Θ(n²) ---------- */
static void naive_dft(const cplx *a, int n, cplx *y)
{
    for (int k = 0; k < n; k++) {
        y[k] = cx(0.0, 0.0);
        for (int j = 0; j < n; j++) { y[k] = cadd(y[k], cmul(a[j], omega(k * j, n))); }
    }
}

static void fft_iter(cplx *a, int n);
static void fft_iter_inv(cplx *a, int n);

/* ---------- 递归 FFT（原书 FFT(A, ω)，p.890 的 13 行） ----------
 * 长度必须是 2 的幂；n = 1 时直接返回。 */
static void fft_rec(const cplx *a, int n, cplx *y)
{
    if (n == 1) { y[0] = a[0]; return; }        /* 行 1–2 */
    assert(n <= 512);                          /* 临时数组的尺寸上限（控制栈占用） */
    cplx even[512], odd[512], ye[512], yo[512];
    for (int i = 0; i < n / 2; i++) {           /* 行 5–6：按奇偶下标拆分 */
        even[i] = a[2 * i];
        odd[i] = a[2 * i + 1];
    }
    fft_rec(even, n / 2, ye);                   /* 行 7 */
    fft_rec(odd, n / 2, yo);                    /* 行 8 */
    for (int k = 0; k < n / 2; k++) {           /* 行 9–12：蝶形 */
        cplx w = omega(k, n);
        cplx t = cmul(w, yo[k]);
        y[k] = cadd(ye[k], t);
        y[k + n / 2] = csub(ye[k], t);
        g_butterfly++;
    }
}

/* ---------- 位反转：k 的 lg n 位反转（原书 p.896 的 rev(k)） ---------- */
static int rev_bits(int k, int lg)
{
    int r = 0;
    for (int i = 0; i < lg; i++) {
        r = (r << 1) | ((k >> i) & 1);
    }
    return r;
}

/* ---------- 迭代 FFT：位反转置换 + lg n 级蝶形（原书图 30.6 的电路） ---------- */
static void fft_iter(cplx *a, int n)
{
    int lg = 0;
    while ((1 << lg) < n) { lg++; }
    for (int k = 0; k < n; k++) {               /* 位反转置换 */
        int r = rev_bits(k, lg);
        if (r > k) { cplx t = a[k]; a[k] = a[r]; a[r] = t; }
    }
    for (int s = 1; s <= lg; s++) {             /* 第 s 级：蝶形长度 2^s */
        int m = 1 << s;
        cplx wm = omega(1, m);                  /* ω_m */
        for (int k = 0; k < n; k += m) {
            cplx w = cx(1.0, 0.0);
            for (int j = 0; j < m / 2; j++) {
                cplx u = a[k + j];
                cplx t = cmul(w, a[k + j + m / 2]);
                a[k + j] = cadd(u, t);
                a[k + j + m / 2] = csub(u, t);
                w = cmul(w, wm);
                g_butterfly++;
            }
        }
    }
}

/* ---------- 用 FFT 做乘法：补齐到 2 的幂 → 点值相乘 → 逆 FFT ---------- */
static int fft_mul(const double *a, int na, const double *b, int nb, double *c)
{
    int n = 1;
    while (n < na + nb - 1) { n <<= 1; }
    static cplx fa[MAXN], fb[MAXN], fc[MAXN];
    for (int i = 0; i < n; i++) {
        fa[i] = cx(i < na ? a[i] : 0.0, 0.0);
        fb[i] = cx(i < nb ? b[i] : 0.0, 0.0);
    }
    fft_iter(fa, n);
    fft_iter(fb, n);
    for (int i = 0; i < n; i++) { fc[i] = cmul(fa[i], fb[i]); }   /* 卷积定理：点值相乘 */
    /* 逆 DFT：用 ω_n^{-1} = conj(ω_n)，最后除以 n */
    fft_iter_inv(fc, n);
    for (int i = 0; i < na + nb - 1; i++) { c[i] = fc[i].re; }
    return n;
}

/* 逆 FFT：把输入取共轭 → 正向 FFT → 再取共轭并除以 n */
static void fft_iter_inv(cplx *a, int n)
{
    for (int i = 0; i < n; i++) { a[i].im = -a[i].im; }
    fft_iter(a, n);
    for (int i = 0; i < n; i++) {
        a[i].re /= (double)n;
        a[i].im = -a[i].im / (double)n;
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：习题 30.1-1 的两个多项式 ===== */
    {
        const double A[4] = {-10, 1, -1, 7};        /* −10 + x − x² + 7x³ */
        const double B[4] = {3, -6, 0, 8};          /* 3 − 6x + 8x³ */
        const double want[7] = {-30, 63, -9, -53, -34, -8, 56};
        double c[7];
        naive_mul(A, 4, B, 4, c);
        printf("part 1: 朴素 Θ(n²) 乘法：(7x³−x²+x−10)(8x³−6x+3) =\n        ");
        for (int i = 6; i >= 0; i--) {
            printf("%+.0fx^%d%s", c[i], i, i ? " " : "\n");
        }
        for (int i = 0; i < 7; i++) { assert(fabs(c[i] - want[i]) < 1e-12); }
        printf("        逐系数断言通过（56x⁶ − 8x⁵ − 34x⁴ − 53x³ − 9x² + 63x − 30）✓\n");
    }

    /* ===== part 2：习题 30.2-2 的 DFT ===== */
    {
        cplx a[4] = {{0, 0}, {1, 0}, {2, 0}, {3, 0}}, y[4];
        naive_dft(a, 4, y);
        printf("part 2: DFT of (0,1,2,3)（n = 4，ω₄ = i）：\n");
        for (int k = 0; k < 4; k++) {
            printf("        y%d = %.6f %+.6fi\n", k, y[k].re, y[k].im);
        }
        assert(fabs(y[0].re - 6) < 1e-12 && fabs(y[0].im) < 1e-12);
        assert(fabs(y[1].re + 2) < 1e-12 && fabs(y[1].im + 2) < 1e-12);
        assert(fabs(y[2].re + 2) < 1e-12 && fabs(y[2].im) < 1e-12);
        assert(fabs(y[3].re + 2) < 1e-12 && fabs(y[3].im - 2) < 1e-12);
        printf("        与手算一致：(6, −2−2i, −2, −2+2i) ✓\n");
    }

    /* ===== part 3：FFT 乘法 = 朴素乘法 ===== */
    {
        const double A[4] = {-10, 1, -1, 7};
        const double B[4] = {3, -6, 0, 8};
        double c1[7], c2[7];
        naive_mul(A, 4, B, 4, c1);
        int n = fft_mul(A, 4, B, 4, c2);
        double err = 0.0;
        for (int i = 0; i < 7; i++) {
            double d = fabs(c1[i] - c2[i]);
            if (d > err) { err = d; }
        }
        printf("part 3: FFT 乘法（补零到 n = %d，点值相乘后逆变换）：\n", n);
        printf("        与朴素乘法逐系数最大差 = %.2e（阈值 1e-9）✓\n", err);
        assert(err < 1e-9);
    }

    /* ===== part 4：系数 → DFT → 逆 DFT 往返 ===== */
    {
        const int n = 8;
        cplx a[8], y[8], back[8];
        for (int i = 0; i < n; i++) { a[i] = cx((double)(i * i - 3 * i + 1), 0.0); }
        memcpy(y, a, sizeof(a));
        fft_iter(y, n);
        memcpy(back, y, sizeof(y));
        fft_iter_inv(back, n);
        double err = 0.0;
        for (int i = 0; i < n; i++) {
            double d = sqrt(cabs2(csub(back[i], a[i])));
            if (d > err) { err = d; }
        }
        printf("part 4: 往返（系数 → 点值 → 系数）最大误差 = %.2e（阈值 1e-12）✓\n", err);
        assert(err < 1e-12);
    }

    /* ===== part 5：递归 FFT vs 迭代 FFT ===== */
    {
        const int n = 8;
        cplx a[8], yr[8], yi[8];
        for (int i = 0; i < n; i++) { a[i] = cx(sin(1.0 + 0.7 * i), cos(0.3 * i) - 0.5); }
        fft_rec(a, n, yr);
        memcpy(yi, a, sizeof(a));
        g_butterfly = 0;
        fft_iter(yi, n);
        double err = 0.0;
        for (int i = 0; i < n; i++) {
            double d = sqrt(cabs2(csub(yr[i], yi[i])));
            if (d > err) { err = d; }
        }
        printf("part 5: 递归 FFT 与迭代 FFT 的最大差 = %.2e（阈值 1e-12）✓\n", err);
        printf("        迭代版蝶形数 = %ld，等于 (n/2)·lg n = %d ✓\n",
               g_butterfly, (n / 2) * 3);
        assert(err < 1e-12);
        assert(g_butterfly == (n / 2) * 3);
    }

    /* ===== part 6：位反转是自逆置换 ===== */
    {
        int bad = 0;
        for (int lg = 1; lg <= 10; lg++) {
            int n = 1 << lg;
            for (int k = 0; k < n; k++) {
                if (rev_bits(rev_bits(k, lg), lg) != k) { bad++; }
            }
        }
        printf("part 6: rev(rev(k)) = k 在所有 n ≤ 1024 的位反转上成立（反例 %d 个）✓\n", bad);
        assert(bad == 0);
    }

    /* ===== part 7：n = 1024 时两种 DFT 的乘法次数 ===== */
    {
        const int n = 1024;
        cplx a[MAXN], y[MAXN];
        for (int i = 0; i < n; i++) { a[i] = cx((double)((i * 37) % 101) / 101.0, 0.0); }
        g_cmul = 0;
        naive_dft(a, n, y);
        long naive_cnt = g_cmul;
        g_cmul = 0;
        memcpy(y, a, sizeof(a));
        fft_iter(y, n);
        long fft_cnt = g_cmul;
        printf("part 7: n = %d 的复数乘法次数：朴素 DFT %ld 次，FFT %ld 次（比值 %.1f）✓\n",
               n, naive_cnt, fft_cnt, (double)naive_cnt / (double)fft_cnt);
        assert(naive_cnt == (long)n * n);
        assert((double)naive_cnt / (double)fft_cnt > 100.0);   /* 实测 ≈ 102（FFT 还含 n lg n 次旋转因子更新） */
    }

    /* ===== part 8：习题 30.3-1 的输入向量 (0,2,3,−1,4,5,7,9) ===== */
    {
        const int n = 8;
        cplx a[8], y1[8], y2[8];
        const double in[8] = {0, 2, 3, -1, 4, 5, 7, 9};
        for (int i = 0; i < n; i++) { a[i] = cx(in[i], 0.0); }
        naive_dft(a, n, y1);
        memcpy(y2, a, sizeof(a));
        g_butterfly = 0;                        /* 只数 part 8 这一轮的蝶形 */
        fft_iter(y2, n);
        double err = 0.0;
        for (int i = 0; i < n; i++) {
            double d = sqrt(cabs2(csub(y1[i], y2[i])));
            if (d > err) { err = d; }
        }
        printf("part 8: 习题 30.3-1 的输入 .0,2,3,−1,4,5,7,9/ 的 DFT（迭代 FFT 输出）：\n");
        printf("        ");
        for (int k = 0; k < n; k++) {
            printf("y%d=%.2f%+.2fi%s", k, y2[k].re, y2[k].im, k == n - 1 ? "\n" : " ");
        }
        printf("        与朴素 DFT 最大差 = %.2e；蝶形 %ld 个 = (n/2)·lg n ✓\n", err, g_butterfly);
        assert(err < 1e-12 && g_butterfly == (n / 2) * 3);
        assert(fabs(y2[0].re - 29.0) < 1e-12 && fabs(y2[0].im) < 1e-12);   /* 全是实数输入：y0 = 各分量之和 */
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 2–5 与 part 7。'},
           {line:56,zh:'`naive_dft`：$\\Theta(n^{2})$ 的直接求和，作为一切 FFT 结果的裁判。'},
           {line:69,zh:'`fft_rec`：原书 FFT 的直译 —— 偶/奇拆分（第 5–6 行）、两次递归（第 7–8 行）、$n/2$ 个蝶形（第 9–12 行）。'},
           {line:178,zh:'★★ part 2：$a = (0,1,2,3)$ 的 DFT 得 $(6, -2-2i, -2, -2+2i)$（原书习题 30.2-2）—— 与手算逐位一致。'},
           {line:201,zh:'★★ part 3：FFT 乘法与朴素乘法最大差 $1.4\\text{e-}14$。'},
           {line:220,zh:'★ part 4：系数 → 点值 → 系数往返误差 $3.6\\text{e-}15$。'},
           {line:238,zh:'★★ part 5：递归与迭代 FFT 最大差 $5\\text{e-}16$；蝶形数 12 = (n/2)·lg n。'},
           {line:270,zh:'★★ part 7：$n = 1024$ 时朴素 1048576 次复数乘法 vs FFT 10240 次 —— 比值 102.4。'}]},
    tests:[{in:'DFT of (0,1,2,3)（朴素）',out:'(6, −2−2i, −2, −2+2i)'},
           {in:'FFT 乘法 vs 朴素乘法',out:'最大差 1.4e-14'},
           {in:'往返转换',out:'误差 3.6e-15'},
           {in:'n = 1024 的复数乘法数',out:'1048576 vs 10240（比值 102.4）'}],
    mapping:[{pc:7,pcCode:'a_odd = (a_1, a_3, …, a_{n-1})',c:'`odd[i] = a[2 * i + 1];`（第 76 行）'},
             {pc:9,pcCode:'y_odd = FFT(a_odd, ω_n^2)',c:'`fft_rec(odd, n / 2, yo);`（第 79 行）'},
             {pc:12,pcCode:'y_{k+n/2} = y_even[k] − ω·y_odd[k]',c:'`y[k + n / 2] = csub(ye[k], t);`（第 84 行）'}]},
   {type:'analyze',title:'一本账：FFT 的代价从哪来',claims:[
     {expr:'y_k = \\sum_j a_j \\omega_n^{jk}',when:'DFT 的定义（在 n 个单位根上求值）',page:885,source:'book'},
     {expr:'\\Theta(n \\lg n)',when:'FFT 的时间（两个 n/2 子问题 + n/2 个蝶形）',page:890,source:'book'},
     {expr:'\\omega_n^{-jk}/n',when:'逆 DFT 的矩阵元素（定理 30.7）',page:892,source:'book'},
     {expr:'a \\otimes b = \\text{DFT}^{-1}(\\text{DFT}(a) \\cdot \\text{DFT}(b))',when:'卷积定理（定理 30.8）',page:892,source:'book'},
    ],tables:[{caption:'C 程序 Part 2–7 的实测',rows:[
      ['检查项','结果'],
      ['DFT of (0,1,2,3)','(6, −2−2i, −2, −2+2i)'],
      ['FFT 乘法 vs 朴素乘法','最大差 1.4e-14'],
      ['系数 → 点值 → 系数','往返误差 3.6e-15'],
      ['递归 FFT vs 迭代 FFT','最大差 5e-16'],
      ['迭代版蝶形数（n = 8）','12 = (n/2)·lg n'],
      ['n = 1024 的复数乘法','朴素 1048576 / FFT 10240（比值 102.4）'],
     ]},{caption:'三条路线算同一个卷积',rows:[
      ['路线','时间','C 程序'],
      ['朴素卷积','$\\Theta(n^{2})$','`naive_mul`（part 1）'],
      ['**FFT 三步**','$\\Theta(n \\lg n)$','`fft_iter` ×2 + 逐点乘 + 逆变换（part 3）'],
      ['直接求和 DFT','$\\Theta(n^{2})$','`naive_dft`（作为裁判，part 7）'],
     ]}],chart:{xMax:64,series:[
     {name:'n²（朴素）',expr:'n * n',color:'--viz-violation'},
     {name:'(n/2)·lg n（FFT 蝶形数）',expr:'n / 2 * Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'递推 T(n) = 2T(n/2) + Θ(n) 的来历',steps:[
      {zh:'折半引理（引理 30.5）：$n$ 次单位根的平方是 $n/2$ 次单位根 → 两个子问题规模都是 $n/2$，且旋转因子可用同一套（消去引理）。'},
      {zh:'合并阶段：对 $k = 0, \\dots, n/2 - 1$ 做蝶形，每个 1 次复数乘法 + 2 次加法 → $\\Theta(n)$。'},
      {zh:'于是 $T(n) = 2T(n/2) + \\Theta(n)$；由主定理情况 2 得 $\\Theta(n \\lg n)$。'},
      {tex:'T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\lg n)',zh:'★★ C 程序 part 5 数出来的蝶形数 $(n/2)\\lg n = 12$（$n=8$）正是这个递推的"合并项"总量；part 7 再把这个代价与朴素 $n^{2}$ 摆在一起（$n = 1024$：10240 对 1048576）。∎'}]},
     ],
    note:''},
   {type:'prove',title:'FFT 为什么快：折半引理 + 消去引理',statement:'If n>0 is even, then the squares of the n complex nth roots of unity are the n/2 complex (n/2)th roots of unity.',
    page:887,
    intro:'★ 只证两件事：① 子问题真的只有一半大（折半引理）；② 两个子问题的旋转因子能对上（消去引理 + 推论 30.4）。',
    steps:[
     {title:'① 拆成偶、奇两个多项式',en:'As we’ll see, the halving lemma is essential to the divide-and-conquer approach for converting between coefficient and point-value representations of polynomials, since it guarantees that the recursive subproblems are only half as large.',
      page:887,
      body:['把 $A(x)$ 按下标奇偶拆开：$A(x) = A^{[0]}(x^{2}) + x\\,A^{[1]}(x^{2})$，其中 $A^{[0]}, A^{[1]}$ 的次数界都是 $n/2$。',
        '在 $x = \\omega_n^{k}$ 处求值：$A(\\omega_n^{k}) = A^{[0]}(\\omega_n^{2k}) + \\omega_n^{k} A^{[1]}(\\omega_n^{2k})$。',
        '★ 关键是 $(\\omega_n^{k})^{2} = \\omega_n^{2k}$：奇部的自变量是平方后的点。']},
     {title:'② 平方后只剩 n/2 个不同的点',en:'Thus ! k n and ! k + n/2 n have the same square.',
      page:887,
      body:['由折半引理，$\\{(\\omega_n^{k})^{2}\\}$ 只有 $n/2$ 个不同的值 —— 恰好是 $\\omega_{n/2}$ 的全部幂，且每个出现两次。',
        '于是两个子问题都只是 $n/2$ **点**的 DFT → 可以用同一份子结果。',
        '★ 出现两次正是"上半个输出 / 下半个输出"配对的来源。']},
     {title:'③ 两个半输出只差一个符号',en:'For j,k = 0,1,…,n − 1, the (j,k) entry of V −1 n is ! −j k n =n.',
      page:892,
      body:['由推论 30.4，$\\omega_n^{n/2} = -1$；再结合消去引理 $\\omega_n^{k+n/2} = -\\omega_n^{k}$。',
        '所以 $y_{k+n/2} = y^{[0]}_k - \\omega_n^{k} y^{[1]}_k$，与 $y_k$ 共用同一次复数乘法 $\\omega_n^{k} y^{[1]}_k$。',
        '★ 这就是蝶形：一次乘法、两次加法，产出两个输出（C 程序 `y[k] = cadd(ye[k], t)` 与 `y[k + n/2] = csub(ye[k], t)`）。']},
     {title:'④ 代价：两个一半 + 线性合并',en:'where the vectors a and b are padded with 0s to length 2n and • denotes the componentwise product of two 2n-element vectors.',
      page:892,
      body:['前两步给出递推 $T(n) = 2T(n/2) + \\Theta(n)$。',
        '主定理情况 2（$n^{\\log_2 2} = n^{1}$ 与 $\\Theta(n)$ 同阶）→ $T(n) = \\Theta(n \\lg n)$。',
        '★ 逆变换不需要新算法：定理 30.7 说用 $\\omega_n^{-1}$ 跑一遍同样的 FFT，再除以 $n$ 即可（C 程序 `fft_iter_inv` 用取共轭实现）。∎']},
    ],conclusion:'★ 结论：$\\Theta(n \\lg n)$ —— 与排序同阶，于是多项式乘法也被拉进了"$n \\lg n$ 俱乐部"（定理 30.2）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'主 $n$ 次单位根是什么？',options:['$\\omega_n = 1$','**$\\omega_n = e^{2\\pi i/n}$**','$\\omega_n = \\cos(1/n)$','$\\omega_n = -1$'],answer:1,
      why:'★ 原书式 (30.6)。'},
     {kind:'single',q:'FFT 的递推是哪一个？',options:['$T(n) = 2T(n/2) + \\Theta(n^{2})$','**$T(n) = 2T(n/2) + \\Theta(n)$**','$T(n) = T(n/2) + \\Theta(n)$','$T(n) = 4T(n/2) + \\Theta(n)$'],answer:1,
      why:'★ 两个 $n/2$ 子问题 + $n/2$ 个蝶形（$\\Theta(n)$ 合并）。'},
     {kind:'judge',q:'折半引理是"子问题规模减半"的依据。',answer:true,
      why:'★ 原书 p.887 原话：它保证递归子问题只有一半大。'},
     {kind:'judge',q:'逆 DFT 需要一整套新算法。',answer:false,
      why:'★ 定理 30.7：用 $\\omega_n^{-1}$ 跑同一个 FFT 再除以 $n$（C 程序用取共轭实现）。'},
     {kind:'simulate',q:'C 程序 part 2 里 DFT of (0,1,2,3) 的 $y_1$ 的实部是多少？（填整数，带负号）',expect:[-2],placeholder:'例如：-1',
      why:'−2 —— $y_1 = -2 - 2i$，与手算一致（$\\omega_4 = i$）。'},
     {kind:'single',q:'卷积定理说，两个序列的「卷积」可以用 DFT 怎样算出来？',options:['两次 DFT 的结果相加','**逐点相乘后再做一次逆 DFT**','逐点相除后再做一次 DFT','DFT 无法表示卷积'],answer:1,why:'★ 定理 30.8：$a \otimes b = \text{DFT}^{-1}(\text{DFT}(a) \cdot \text{DFT}(b))$。这正是用 FFT 做多项式乘法的全部依据：求值 → 逐点乘 → 插值。'},
     {kind:'simulate',q:'C 程序 part 2 里 DFT of $(0,1,2,3)$ 的 $y_3$ 的虚部是多少？（填整数，带正负号）',expect:[2],placeholder:'例如：-2',why:'2 —— 程序打印的四点是 $(6, -2-2i, -2, -2+2i)$，$y_3 = -2 + 2i$，虚部为 $+2$。'},
    ],bookExercises:[
     {id:'30.2-2',page:893,star:0,statement:'Compute the DFT of the vector .0,1,2,3/ .',hint:'逐个 $k$ 算 $\\sum_j a_j i^{jk}$：$k=0$ 得 6，$k=1$ 得 $-2-2i$，$k=2$ 得 $-2$，$k=3$ 得 $-2+2i$（C 程序 part 2 的断言就是这四个值）。'},
     {id:'30.2-4',page:893,star:0,statement:'Write pseudocode to compute DFT −1 n in Θ(n lg n) time.',hint:'把 FFT 里的 $\\omega_n$ 换成 $\\omega_n^{-1}$（等价于对输入取共轭、做完再取共轭），最后把每个结果除以 $n$ —— C 程序的 `fft_iter_inv` 就是这么写的。'},
     {id:'30.2-5',page:893,star:0,statement:'Describe the generalization of the FFT procedure to the case in which n is an exact power of 3. Give a recurrence for the running time, and solve the recurrence.',hint:'换成 3 的幂后每层拆成 3 个子问题、每个规模 $n/3$，旋转因子用 $\\omega_n^{2}$ 之外的第三个根；递推 $T(n) = 3T(n/3) + \\Theta(n)$ 由主定理情况 2 得 $\\Theta(n \\lg n)$。'},
    ]},
  ],
};
