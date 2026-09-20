/* 第 30 章 30.1：多项式的表示（Representing polynomials）。印刷页 878–885（pdf 899–906）。 */
export default {
  key:'s01',id:'ch30/s01',chapter:30,section:'30.1',
  title:'两种表示法：系数向量与点值',shortTitle:'30.1 多项式的表示',
  titleEn:'Representing polynomials',
  source:{printed:[878,885],pdf:[899,906]},
  prerequisites:[{label:'29.3 对偶',url:'#/ch29/s03'}],
  stages:[
   {type:'map',title:'系数表示与点值表示，各有所长',
    why:'**系数表示**：$a = (a_0, a_1, \\dots, a_{n-1})$。**点值表示**：$n$ 个互异点上的取值 $y_k = A(x_k)$。同一个多项式两种写法，代价表完全不同：加法都是 $\\Theta(n)$；求值（系数→点值）朴素要 $\\Theta(n^2)$；**乘法**在点值表示下只需逐点相乘 $\\Theta(n)$ —— 本章的全部动机就是"能不能快速地在两种表示之间转换"。',
    position:'第 VIII 部分的最后一章。它是分治思想的一次"跨领域演出"：$\\Theta(n \\lg n)$ 的转换（FFT）让多项式乘法从 $\\Theta(n^2)$ 降到 $\\Theta(n \\lg n)$。',
    unlocks:[{label:'30.2 DFT 与 FFT',url:'#/ch30/s02'}],
    mathKit:[
     {title:'系数表示',body:'$A(x) = \\sum_{j=0}^{n-1} a_j x^{j}$，写成向量 $a = (a_0, \\dots, a_{n-1})$；次数界为 $n$。'},
     {title:'点值表示',body:'$\\{(x_0, y_0), \\dots, (x_{n-1}, y_{n-1})\\}$，其中 $y_k = A(x_k)$ 且 $x_k$ 互异。'},
     {title:'Horner 法则',body:'$\\Theta(n)$ 求单点值：从高位系数开始反复"乘 $x_0$ 再加"。'},
     {title:'定理 30.1（唯一性）',body:'$n$ 个互异点上的值唯一确定一个次数界为 $n$ 的多项式（Vandermonde 矩阵可逆）。'},
    ]},
   {type:'intuition',title:'点值乘法只要 Θ(n)：先把两个多项式换个"坐标系"',scene:'C 程序 Part 1',body:[
     '★ 只要 $x_k$ 取同一组互异点：若 $C(x) = A(x)B(x)$，则在每个 $x_k$ 上都有 $y^{C}_k = y^{A}_k \\cdot y^{B}_k$ —— **逐点相乘**，$\\Theta(n)$，没有任何卷积要做。',
     '★ C 程序 part 1 先用朴素 $\\Theta(n^2)$ 乘法算原书习题 30.1-1 那两个多项式 $(7x^{3} - x^{2} + x - 10)(8x^{3} - 6x + 3)$，逐系数断言结果是',
     '$56x^{6} - 8x^{5} - 34x^{4} - 53x^{3} - 9x^{2} + 63x - 30$；part 3 再用补零到 $n = 8$ 的 FFT 算一遍，两者最大差 $1.4\\text{e-}14$。',
     '★★ 于是多项式乘法被拆成三步：系数 → 点值（转换）→ 逐点乘（$\\Theta(n)$）→ 点值 → 系数（逆转换）。朴素的转换要 $\\Theta(n^2)$（Horner 在 $n$ 个点上各跑一遍，或解 Vandermonde 矩阵），总代价仍是 $\\Theta(n^2)$。',
     '★★ **选点决定胜负**：把 $x_k$ 取成 $n$ 次单位根 $\\omega_n^{k}$，转换就能用分治做到 $\\Theta(n \\lg n)$（定理 30.2）—— 这就是 30.2 的 FFT。',
     '⚠ 注意点数：两个次数界为 $n$ 的多项式相乘结果次数界是 $2n - 1$，取点必须至少 $2n - 1$ 个（C 程序补零到 8 正是因为 $4 + 4 - 1 = 7$）。点不够就"混叠"，结果会错。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 P n−1 j D0 a |x| 代表 Σⱼ₌₀ⁿ⁻¹ aⱼxʲ、Θ(n lg n) 写作 Θ(n lg n)）。',blocks:[
     {kind:'body',page:879,en:'A coefficient representation of a polynomial A(x) = P n−1 j D0 a |x| of degreebound n is a vector of coefficients a = (a 0 ,a 1 ,…,a n−1 ).',
      zh:'★★ 系数表示的定义：系数向量 $a = (a_0, \\dots, a_{n-1})$。'},
     {kind:'body',page:879,en:'point x 0 consists of computing the value of A(x 0 ). To evaluate a polynomial in Θ(n) time, use Horner’s rule:',
      zh:'★ 单点求值用 Horner 法则，$\\Theta(n)$。'},
     {kind:'body',page:879,en:'(a 0 ,a 1 ,…,a n−1 ) and b = (b 0 ,b 1 ,…,b n−1 ) takes Θ(n) time: just produce the co- efficient vector c = (c 0 ,c 1 ,…,c n−1 ), where c j = a j + b j for j = 0,1,…,n − 1.',
      zh:'★★ 系数表示下加法只要 $\\Theta(n)$：逐分量相加 $c_j = a_j + b_j$。'},
     {kind:'body',page:880,en:'Computing a point-value representation for a polynomial given in coefficient form is in principle straightforward, since all you have to do is select n distinct points x 0 ,x 1 ,…,x n−1 and then evaluate A(x k ) for k = 0,1,…,n − 1.',
      zh:'★★ 系数 → 点值：选 $n$ 个互异点，逐点求值。'},
     {kind:'body',page:880,en:'Horner’s method, evaluating a polynomial at n points takes Θ(n 2 ) time. We’ll see later that if you choose the points x k cleverly, you can accelerate this computation to run in Θ(n lg n) time.',
      zh:'★★ $n$ 个点上求值朴素要 $\\Theta(n^{2})$；**选点巧妙**就能加速到 $\\Theta(n \\lg n)$ —— 本章的主线。'},
     {kind:'theorem',page:880,en:'For any set f(x 0 ,y 0 ),.x 1 ,y 1 /,…,.x n−1 ,y n−1 /g of n point-value pairs such that all the x k values are distinct, there is a unique polynomial A(x) of degree-bound n',
      zh:'★★ 定理 30.1：$n$ 个互异点够了 —— 存在且唯一。'},
     {kind:'body',page:881,en:'The matrix on the left is denoted V(x 0 ,x 1 ,…,x n−1 ) and is known as a V andermonde matrix. By Problem D-1 on page 1223, this matrix has determinant',
      zh:'★ 存在性的关键：Vandermonde 矩阵 $V$。点互异 ⟺ $\\det V \\ne 0$ ⟺ 可逆。'},
     {kind:'theorem',page:884,en:'Two polynomials of degree-bound n with both the input and output representations in coefficient form can be multiplied in Θ(n lg n) time.',
      zh:'★★ 定理 30.2：把点数选成单位根后，多项式乘法可以做到 $\\Theta(n \\lg n)$ —— 本关的结论，30.2 给出算法。'},
    ],terms:[{en:'coefficient representation',zh:'系数表示',page:879},
              {en:'point-value representation',zh:'点值表示',page:880},
              {en:'degree-bound',zh:'次数界（严格大于次数）',page:879}]},
   {type:'pseudocode',title:'本站整理：Horner 求值与朴素乘法（原书以式 (30.1)–(30.3) 给出）',algo:'HORNER',signature:'HORNER(a, x0)',
    page:879,
    lines:[
     {n:1,code:'HORNER(a, x0)              // a = (a0,…,a_{n-1})',zh:''},
     {n:2,code:'    r = 0',zh:'★ 从最高次开始。'},
     {n:3,code:'    for j = n-1 downto 0:',zh:''},
     {n:4,code:'        r = r · x0 + a_j',zh:'★★ 每步一次乘法一次加法 —— 合计 $\\Theta(n)$，比"逐项求幂再相加"的 $\\Theta(n^{2})$ 快得多。'},
     {n:5,code:'    return r',zh:'★ 得到 $A(x_0)$。'}],
    vars:[{name:'r',meaning:'累加器，保存当前部分和'}],
    note:'★ 原书 30.1 用式 (30.1)–(30.3) 与一段文字说明 Horner 法则，没有伪代码框；本段是本站按正文整理的。C 程序没有单独实现 Horner —— 它直接比较"朴素 $\\Theta(n^{2})$ 卷积"与"FFT 路线"。',
    more:[{algo:'NAIVE-MULTIPLY',subtitle:'NAIVE-MULTIPLY(a, b) —— 原书式 (30.1)/(30.2) 的 Θ(n²) 卷积',signature:'NAIVE-MULTIPLY(a, b)',page:880,
      lines:[{n:1,code:'    for i = 0 to 2n-2: c_i = 0',zh:'★ 结果次数界 $2n-1$。'},
        {n:2,code:'    for i = 0 to n-1:',zh:''},
        {n:3,code:'        for j = 0 to n-1:',zh:''},
        {n:4,code:'            c_{i+j} = c_{i+j} + a_i · b_j',zh:'★★ 两重循环乘加 $n^{2}$ 次 —— 上限就在这里。'},
        {n:5,code:'    return c',zh:'★ C 程序 `naive_mul` 就是这 5 行。'}],
      vars:[{name:'c',meaning:'乘积多项式的系数向量，长度 $2n - 1$'}],
      note:'★ 这个 $n^{2}$ 是本章要打破的对象：定理 30.2 用 $\\Theta(n \\lg n)$ 把它换掉（C 程序 part 7 在 $n = 1024$ 上量到 102.4 倍的差距）。'}]},
   {type:'visualize',title:'两种表示的代价对照',panels:[
     {title:'乘法代价：朴素卷积 vs FFT 路线',viz:'growth',
      chart:{xMax:64,series:[
       {name:'朴素卷积 n²',expr:'n * n',color:'--viz-violation'},
       {name:'FFT 路线 n·lg n（含三次转换）',expr:'3 * n * Math.log2(n)',color:'--viz-done'},
       {name:'系数表示下的加法 n',expr:'n',color:'--viz-compare'}]},
      note:'★ 交叉点大约在 $n = 3\\lg n$ 之后（约 $n > 20$）：规模一大，"转换 + 逐点乘"就全面胜出。C 程序 part 7 在 $n = 1024$ 上量到的比值是 102.4。'},
    ],tasks:['对照 C 程序 part 1（朴素乘法的 7 个系数）与 part 3（FFT 乘法，最大差 1.4e-14）。'],note:''},
   {type:'code',title:'实测：习题 30.1-1 的乘积，逐系数断言',c:{file:'fft.c',code:String.raw`/* fft.c -- 30 章：多项式与 FFT。
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
 *   part 7  n = 1024 时 FFT 的复数乘法比朴素 DFT 少约 102 倍（实测 102.4）。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 1（朴素乘法）。'},
           {line:47,zh:'`naive_mul`：原书式 (30.1)/(30.2) 的双重循环，$\\Theta(n^{2})$。'},
           {line:166,zh:'★★ part 1：$(7x^{3} - x^{2} + x - 10)(8x^{3} - 6x + 3)$ 的 7 个系数逐个断言，等于 $56x^{6} - 8x^{5} - 34x^{4} - 53x^{3} - 9x^{2} + 63x - 30$。'},
           {line:201,zh:'★ part 3：同一对多项式改用 FFT 路线（补零到 $n = 8$），与朴素乘法最大差 $1.4\\text{e-}14$。'}]},
    tests:[{in:'习题 30.1-1 的两个多项式（朴素乘法）',out:'7 个系数全部通过断言'},
           {in:'同题改用 FFT 乘法',out:'与朴素乘法最大差 1.4e-14'}],
    mapping:[{pc:4,pcCode:'c_{i+j} = c_{i+j} + a_i·b_j',c:'`c[i + j] += a[i] * b[j];`（第 52 行）'},
             {pc:5,pcCode:'return c',c:'`static void naive_mul(const double *a, int n, const double *b, int m, double *c)`（第 47 行）'}]},
   {type:'analyze',title:'一本账：四种运算 × 两种表示',claims:[
     {expr:'\\Theta(n)',when:'系数表示下的加法（逐分量相加）',page:879,source:'book'},
     {expr:'\\Theta(n^2)',when:'$n$ 个点上求值（先用 Horner 各算一遍）',page:880,source:'book'},
     {expr:'\\Theta(n \\lg n)',when:'定理 30.2：点选成单位根后的乘法',page:884,source:'book'},
     {expr:'n',when:'唯一确定一个次数界为 $n$ 的多项式所需的互异点数',page:880,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 的乘积系数（习题 30.1-1）',rows:[
      ['次数','系数'],
      ['6','56'],
      ['5','−8'],
      ['4','−34'],
      ['3','−53'],
      ['2','−9'],
      ['1','63'],
      ['0','−30'],
     ]},{caption:'两种表示的代价（次数界 $n$）',rows:[
      ['运算','系数表示','点值表示'],
      ['加法','$\\Theta(n)$','$\\Theta(n)$（逐点加）'],
      ['乘法','$\\Theta(n^{2})$（卷积）','**$\\Theta(n)$**（逐点乘）'],
      ['求值','$\\Theta(n^{2})$（$n$ 个点）','$\\Theta(n^{2})$（插值）'],
      ['FFT 后','$\\Theta(n \\lg n)$','—'],
     ]}],chart:{xMax:64,series:[
     {name:'n²（朴素卷积）',expr:'n * n',color:'--viz-violation'},
     {name:'3n·lg n（FFT 路线）',expr:'3 * n * Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'为什么点值乘法是逐点的：一次代入就够',steps:[
      {zh:'设 $C(x) = A(x)B(x)$，点集 $x_0, \\dots, x_{n-1}$ 互异。'},
      {zh:'对每个 $k$：$C(x_k) = A(x_k) \\cdot B(x_k)$ —— 这是恒等式，不需要任何推导。'},
      {zh:'于是"点值形式的多项式乘法"就是 $n$ 次标量乘法，$\\Theta(n)$。'},
      {tex:'y^{C}_k = y^{A}_k \\cdot y^{B}_k',zh:'★★ 全部代价落在"系数 ⇄ 点值"的转换上：朴素转 $\\Theta(n^{2})$，选单位根后可 $\\Theta(n \\lg n)$（30.2 的 FFT）。这也是 C 程序 part 3 的骨架：`fft_iter(fa)` → `fc[i] = cmul(fa[i], fb[i])` → `fft_iter_inv(fc)`。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 30.1：n 个点唯一确定一个多项式',statement:'For any set f(x 0 ,y 0 ),.x 1 ,y 1 /,…,.x n−1 ,y n−1 /g of n point-value pairs such that all the x k values are distinct, there is a unique polynomial A(x) of degree-bound n',
    page:880,
    intro:'★ 存在性与唯一性都归到一个矩阵方程上：$V a = y$，其中 $V$ 是 Vandermonde 矩阵。',
    steps:[
     {title:'① 把插值写成矩阵方程',en:'The matrix on the left is denoted V(x 0 ,x 1 ,…,x n−1 ) and is known as a V andermonde matrix. By Problem D-1 on page 1223, this matrix has determinant',
      page:881,
      body:['方程组 $y_k = \\sum_j a_j x_k^{j}$（$k = 0, \\dots, n-1$）写成 $V a = y$，$V_{kj} = x_k^{j}$。',
        '求系数就是解这个 $n \\times n$ 线性方程组 —— 28.1 的 LUP 就能解，代价 $\\Theta(n^{3})$（比 $\\Theta(n^{2})$ 的朴素插值式还慢）。',
        '★ 这条路说明"插值存在"当且仅当 $V$ 可逆。']},
     {title:'② 行列式非零 ⟺ 点互异',en:'The matrix on the left is denoted V(x 0 ,x 1 ,…,x n−1 ) and is known as a V andermonde matrix. By Problem D-1 on page 1223, this matrix has determinant',
      page:881,
      body:['Vandermonde 行列式的公式是 $\\prod_{j < k} (x_k - x_j)$（原书习题 D-1）。',
        '点互异 ⟺ 每个因子非零 ⟺ $\\det V \\ne 0$ ⟺ $V$ 可逆。',
        '★ 于是解 $a = V^{-1} y$ 唯一 —— 存在性与唯一性一次证完。']},
     {title:'③ 点不够就会混叠',en:'For any set f(x 0 ,y 0 ),.x 1 ,y 1 /,…,.x n−1 ,y n−1 /g of n point-value pairs such that all the x k values are distinct, there is a unique polynomial A(x) of degree-bound n',
      page:880,
      body:['少于 $n$ 个点时，$V$ 变成"矮"矩阵，零空间非平凡 → 有无穷多个次数界为 $n$ 的多项式穿同样这些点。',
        '★ 这正是乘法必须补零到 $2n - 1$ 个点的原因：结果次数界是 $2n - 1$，点少于它就会把不同的多项式错认成同一个。',
        'C 程序 part 3 用 `while (n < na + nb - 1) { n <<= 1; }` 保证点数够（$4 + 4 - 1 = 7 \\Rightarrow n = 8$）。∎']},
    ],conclusion:'★ 结论：$\\Theta(n \\lg n)$ 的乘法路线完全建立在这条唯一性上 —— 转换前后必须是**同一个**多项式。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'点值表示下两个多项式相乘要多少时间？',options:['$\\Theta(n^{2})$','**$\\Theta(n)$**','$\\Theta(n \\lg n)$','$\\Theta(\\lg n)$'],answer:1,
      why:'★ 逐点相乘即可：$C(x_k) = A(x_k)B(x_k)$。'},
     {kind:'single',q:'次数界为 $n$ 的多项式 A 与 B 相乘，至少要取多少个点？',options:['$n$','$n+1$','**$2n-1$**','$2n$'],answer:2,
      why:'★ 乘积的次数界是 $2n - 1$；点不够会发生混叠。C 程序补零到 8（$4+4-1=7$）。'},
     {kind:'judge',q:'单点求值用 Horner 法则需要 $\\Theta(n)$ 时间。',answer:true,
      why:'★ 原书 p.879：反复"乘 $x_0$ 再加"即可。'},
     {kind:'judge',q:'$n$ 个互异点上的取值可以唯一确定次数界为 $n$ 的多项式。',answer:true,
      why:'★ 定理 30.1；关键是 Vandermonde 行列式 $\\prod_{j<k}(x_k - x_j) \\ne 0$。'},
     {kind:'simulate',q:'C 程序 part 1 算出的乘积里 $x^{6}$ 的系数是多少？（填整数）',expect:[56],placeholder:'例如：12',
      why:'56 —— $7x^{3} \\cdot 8x^{3} = 56x^{6}$，程序逐系数断言了全部 7 个系数。'},
     {kind:'single',q:'**系数表示**下把两个多项式相加要多少时间？',options:['$\Theta(1)$','$\Theta(\lg n)$','**$\Theta(n)$**','$\Theta(n \lg n)$'],answer:2,why:'★ 逐分量相加：本关 analyze 表里「系数表示下的加法（逐分量相加）」标的正是 $\Theta(n)$ —— 与点值表示的加法同阶，这才是两种表示的差别只在「乘法」上的原因。'},
     {kind:'judge',q:'把一个次数界为 $n$ 的多项式从系数表示转成点值表示，朴素做法要 $\Theta(n^{2})$。',answer:true,why:'★ 选 $n$ 个互异点，每点用 Horner 法则 $\Theta(n)$，合起来 $\Theta(n^{2})$；本节 analyze 表里「$n$ 个点上求值（先用 Horner 各算一遍）」标的正是它，FFT 要削的就是这一项。'},
    ],bookExercises:[
     {id:'30.1-1',page:884,star:0,statement:'Multiply the polynomials A(x) = 7x 3 − x 2 + x − 10 and B(x) = 8x 3 − 6x + 3 using equations (30.1) and (30.2).',hint:'就是 C 程序 part 1：按 $c_k = \\sum_{i+j=k} a_i b_j$ 逐项累加。结果应为 $56x^{6} - 8x^{5} - 34x^{4} - 53x^{3} - 9x^{2} + 63x - 30$。'},
     {id:'30.1-2',page:884,star:0,statement:'Another way to evaluate a polynomial A(x) of degree-bound n at a given point x 0 is to divide A(x) by the polynomial (x − x 0 ), obtaining a quotient polynomial q(x) of degree-bound n − 1 and a remainder r , such that A(x) = q(x).x − x 0 / C r: Then we have A(x 0 ) = r . Show how to compute the remainder r and the coeffi- cients of q(x) from x 0 and the coefficients of A in Θ(n) time.',hint:'把 $x^{k}$ 反复乘出来（$\\Theta(n^{2})$），或按 Horner 从高次往低次做（$\\Theta(n)$）—— 后者的关键是不显式计算任何幂。'},
     {id:'30.1-4',page:884,star:0,statement:'Prove that n distinct point-value pairs are necessary to uniquely specify a polyno- mial of degree-bound n, that is, if fewer than n distinct point-value pairs are given, they fail to specify a unique polynomial of degree-bound n. (Hint: Using Theo- rem 30.1, what can you say about a set of n − 1 point-value pairs to which you add one more arbitrarily chosen point-value pair?)',hint:'用定理 30.1：$n-1$ 个点对应一个"矮"的 Vandermonde 矩阵，零空间里取非零向量 $\\Delta$ 就得到两个不同的多项式穿同样这些点。'},
    ]},
  ],
};
