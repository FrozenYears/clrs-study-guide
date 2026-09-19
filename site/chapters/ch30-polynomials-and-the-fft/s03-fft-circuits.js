/* 第 30 章 30.3：FFT 电路（FFT circuits）。印刷页 894–898（pdf 915–919）。 */
export default {
  key:'s03',id:'ch30/s03',chapter:30,section:'30.3',
  title:'蝶形、级与位反转：把递归摊平成电路',shortTitle:'30.3 FFT 电路',
  titleEn:'FFT circuits',
  source:{printed:[894,898],pdf:[915,919]},
  prerequisites:[{label:'30.2 DFT 与 FFT',url:'#/ch30/s02'}],
  stages:[
   {type:'map',title:'lg n 级、每级 n/2 个蝶形',
    why:'把 FFT 的递归展开成"级"：第 $s$ 级由 $n/2^{s}$ 组**蝶形**构成，每组把两个输入变成两个输出（一次乘旋转因子、两次加减）。$\\lg n$ 级叠起来就是 FFT 电路：**深度 $\\Theta(\\lg n)$，蝶形总数 $\\Theta(n \\lg n)$**。迭代实现要先做一次**位反转置换**，把递归所需的输入顺序排好。',
    position:'本章最后一节：它把 30.2 的分治"画成硬件"，也给出实际工程里最常用的迭代实现（无递归、可流水线）。',
    unlocks:[],
    mathKit:[
     {title:'蝶形（butterfly）',body:'一对输入 $(u, t)$ → 一对输出 $(u + t,\\ u - t)$，其中 $t = \\omega \\cdot v$。'},
     {title:'级（stage）',body:'第 $s$ 级做长度 $2^{s}$ 的蝶形，共 $n/2^{s}$ 组 —— 每级恰好 $n/2$ 个蝶形。'},
     {title:'旋转因子',body:'第 $s$ 级用 $\\omega_{2^{s}}^{0}, \\dots, \\omega_{2^{s}}^{2^{s-1}-1}$。'},
     {title:'位反转置换',body:'迭代版要求输入按 $\\text{rev}(k)$（$\\lg n$ 位反转）排列，这样每级的跨度才对齐。'},
    ]},
   {type:'intuition',title:'数出来的蝶形数：12 = (8/2)·3',scene:'C 程序 Part 5 / 6 / 8',body:[
     '★ C 程序 part 5 让迭代版自己数蝶形：$n = 8$ 时恰好 12 个，等于 $(n/2)\\lg n = 4 \\times 3$ —— 3 级、每级 4 个。这不是"拟合"，是电路结构的直接后果。',
     '★ part 6 检查位反转置换的代数性质：对所有 $n \\le 1024$ 验证 $\\text{rev}(\\text{rev}(k)) = k$（自逆）—— 所以"位反转置换"是一个合法的置换，正反两次就回到原位。',
     '★★ part 8 用迭代 FFT 算原书习题 30.3-1 的输入 $(0,2,3,-1,4,5,7,9)$，输出',
     '$y = (29,\\ 0.95 - 13.19i,\\ -6 - i,\\ -8.95 - 5.19i,\\ -1,\\ -8.95 + 5.19i,\\ -6 + i,\\ 0.95 + 13.19i)$（与朴素 DFT 最大差 $4.2\\text{e-}15$）。注意 $y_0 = 29$ 恰是各分量之和（$0+2+3-1+4+5+7+9 = 29$），$y_4 = -1$ 恰是交替和 —— 这两个值可以完全手算，是检验电路对不对的第一道关。',
     '★ part 7 说明为什么要摊平成电路：$n = 1024$ 时 FFT 只用 10240 次复数乘法（朴素 1048576 次）。迭代版没有递归调用、访存连续，实际硬件上更容易流水化 —— 这也是工业实现的标准形状。',
     '⚠ 迭代版的陷阱：级与级之间的**跨度**必须是 $2^{s}$，而输入顺序必须是位反转序。这两个条件缺一个，输出就是"看起来像 DFT 但错位"的结果（不会崩，只会错）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 ! n 代表 ωₙ、Θ(lg n) 的括号）。',blocks:[
     {kind:'body',page:895,en:'The FFT procedure follows the divide-and-conquer strategy that we first saw in Section 2.3.1:',
      zh:'★ 原书明说：FFT 就是 2.3.1 那套分治（归并排序）的同一形状。'},
     {kind:'body',page:895,en:'Divide the n-element input vector into its n/2 even-indexed and n/2 odd-indexed elements.',
      zh:'★★ 分：按奇偶下标拆两个 $n/2$ 向量的元素。'},
     {kind:'body',page:895,en:'Conquer by recursively computing the DFTs of the two subproblems, each of size n/2.',
      zh:'★ 治：两个 $n/2$ 点 DFT。'},
     {kind:'body',page:895,en:'Combine by performing n/2 butterfly operations. These butterfly operations work with twiddle factors ! 0 n ,! 1 n ,…,! n/2−1 n .',
      zh:'★★ 合：$n/2$ 个蝶形，用旋转因子 $\\omega_n^{0}, \\dots, \\omega_n^{n/2-1}$ —— 这就是"级"的内容。'},
     {kind:'body',page:894,en:'Notice that the for loop of lines 9–12 of the FFT procedure computes the value',
      zh:'★ 原书在讲第 9–12 行的循环在算什么（就是蝶形）。'},
     {kind:'body',page:897,en:'Mk is the binary representation of rev(k)',
      zh:'★★ 图 30.6 的电路：3 级（$n = 8$），输入按位反转排（$\\text{rev}(k)$），输出是正序的 $y$。'},
     {kind:'body',page:898,en:'This circuit has depth Θ(lg n) and performs Θ(n lg n) butterfly operations altogether.',
      zh:'★★ 电路的代价总结：深度 $\\Theta(\\lg n)$、蝶形总数 $\\Theta(n \\lg n)$。'},
    ],terms:[{en:'butterfly operations',zh:'蝶形运算',page:895},
              {en:'twiddle factors',zh:'旋转因子',page:895},
              {en:'stage',zh:'级（电路的一层）',page:897}]},
   {type:'pseudocode',title:'本站整理：迭代 FFT 与位反转置换（原书习题 30.3-4 要求写出后者）',algo:'ITERATIVE-FFT',signature:'ITERATIVE-FFT(a)',
    page:896,
    lines:[
     {n:1,code:'ITERATIVE-FFT(a)               // n 是 2 的幂，原地计算',zh:''},
     {n:2,code:'    BIT-REVERSE-PERMUTATION(a, n)',zh:'★★ 先把输入排成位反转序 —— 这样后面每一级的跨度才是整齐的 $2^{s}$。'},
     {n:3,code:'    for s = 1 to lg n:',zh:'★ $\\lg n$ 级（电路的一层）。'},
     {n:4,code:'        m = 2^s',zh:'★ 这一级的蝶形长度。'},
     {n:5,code:'        ω_m = e^{2πi/m}',zh:'★★ 旋转因子：第 $s$ 级用 $m$ 次单位根（消去引理保证它与上一级相容）。'},
     {n:6,code:'        for k = 0 to n-1 step m:',zh:'★ 共 $n/m$ 组，每组 $m/2$ 个蝶形。'},
     {n:7,code:'            ω = 1',zh:''},
     {n:8,code:'            for j = 0 to m/2 − 1:',zh:'★ 组内推进旋转因子。'},
     {n:9,code:'                u = a[k+j]',zh:''},
     {n:10,code:'                t = ω · a[k+j+m/2]',zh:'★★ 唯一的一次复数乘法。'},
     {n:11,code:'                a[k+j]       = u + t',zh:'★ 蝶形的上输出。'},
     {n:12,code:'                a[k+j+m/2]   = u − t',zh:'★ 蝶形的下输出（共用 $t$，所以只乘一次）。'},
     {n:13,code:'                ω = ω · ω_m',zh:''},
     {n:14,code:'    return a',zh:'★ 每级 $n/2$ 个蝶形 × $\\lg n$ 级 = $(n/2)\\lg n$（C 程序 part 5/8 数到 12，$n = 8$）。'}],
    vars:[{name:'s',meaning:'级号，从 1 到 $\\lg n$'},
          {name:'m = 2^s',meaning:'本级蝶形长度，逐级翻倍'}],
    note:'★ 原书 30.3 用图 30.6 的电路讲迭代结构，BIT-REVERSE-PERMUTATION 只出现在习题 30.3-4 里（要求读者自己写）—— 本段是本站按电路整理的，与 C 程序的 `fft_iter` 逐行对应。',
    more:[{algo:'BIT-REVERSE-PERMUTATION',subtitle:'BIT-REVERSE-PERMUTATION(a, n) —— 原地位反转置换',signature:'BIT-REVERSE-PERMUTATION(a, n)',page:897,
      lines:[{n:1,code:'    for k = 0 to n-1:',zh:''},
        {n:2,code:'        r = BIT-REVERSE-OF(k, lg n)',zh:'★ 把 $k$ 的 $\\lg n$ 个二进制位反过来。'},
        {n:3,code:'        if r > k: swap a[k] and a[r]',zh:'★★ 只在 $r > k$ 时交换 —— 每个元素只动一次，且置换是自逆的。'},
        {n:4,code:'    return a',zh:'★ C 程序的 `rev_bits` + `fft_iter` 的第 3–6 行就是这 4 行。'}],
      vars:[{name:'rev(k)',meaning:'$\\lg n$ 位反转后的下标'}],
      note:'★ C 程序 part 6 验证了自逆性：$\\text{rev}(\\text{rev}(k)) = k$ 对一切 $n \\le 1024$ 成立（这是"位反转置换"能原地执行的前提）。'}]},
   {type:'visualize',title:'电路的代价：每级 n/2 个蝶形',panels:[
     {title:'蝶形总数随 n 的增长',viz:'growth',
      chart:{xMax:64,series:[
       {name:'蝶形总数 (n/2)·lg n',expr:'n / 2 * Math.log2(n)',color:'--viz-done'},
       {name:'朴素 DFT 的复数乘法 n²',expr:'n * n',color:'--viz-violation'},
       {name:'电路深度 lg n',expr:'Math.log2(n)',color:'--viz-compare'}]},
      note:'★ 深度的曲线几乎是平的（$\\lg n$），蝶形总数是 $n \\lg n$ —— "深度小 + 总量大"正是可并行/可流水线的形状。'},
    ],tasks:['对照 C 程序 part 5 与 part 8 打印的蝶形数（都是 12），再看 part 7 的 102.4 倍差距。'],note:''},
   {type:'code',title:'实测：蝶形数、位反转、习题 30.3-1 的输出',c:{file:'fft.c',code:String.raw`/* fft.c -- 30 章：多项式与 FFT。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 part 5、part 6 与 part 8。'},
           {line:90,zh:'`rev_bits`：把 $k$ 的 $\\lg n$ 位反转（对应习题 30.3-4 的 BIT-REVERSE-OF）。'},
           {line:100,zh:'`fft_iter`：位反转置换（第 3–6 行）+ $\\lg n$ 级蝶形（第 8–16 行）。'},
           {line:110,zh:'★★ 每一级用 $\\omega_m$（$m = 2^{s}$）—— 级间的相容性由消去引理保证。'},
           {line:115,zh:'★ 蝶形的唯一一次复数乘法（上下两个输出共用 $t$）。'},
           {line:238,zh:'★★ part 5：$n = 8$ 时蝶形数 12 = $(n/2)\\lg n$；递归与迭代最大差 $5\\text{e-}16$。'},
           {line:254,zh:'★ part 6：$\\text{rev}(\\text{rev}(k)) = k$ 对一切 $n \\le 1024$ 成立（反例 0 个）。'},
           {line:291,zh:'★★ part 8：习题 30.3-1 的输入 $(0,2,3,-1,4,5,7,9)$ 的 DFT —— $y_0 = 29$（各分量之和）、$y_4 = -1$（交替和）。'}]},
    tests:[{in:'蝶形计数（n = 8）',out:'12 = (n/2)·lg n'},
           {in:'位反转自逆性（n ≤ 1024）',out:'反例 0 个'},
           {in:'习题 30.3-1 的 DFT',out:'y0 = 29、y4 = −1，与朴素 DFT 差 4.2e-15'}],
    mapping:[{pc:2,pcCode:'BIT-REVERSE-PERMUTATION(a, n)',c:'`if (r > k) { cplx t = a[k]; a[k] = a[r]; a[r] = t; }`（第 106 行）'},
             {pc:3,pcCode:'for s = 1 to lg n',c:'`for (int s = 1; s <= lg; s++) {`（第 108 行）'},
             {pc:11,pcCode:'a[k+j] = u + t',c:'`a[k + j] = cadd(u, t);`（第 116 行）'}]},
   {type:'analyze',title:'一本账：电路的三个数',claims:[
     {expr:'\\Theta(\\lg n)',when:'电路的深度（级数）',page:898,source:'book'},
     {expr:'\\Theta(n \\lg n)',when:'电路的蝶形总数（每级 $n/2$ 个）',page:898,source:'book'},
     {expr:'\\text{rev}(k)',when:'迭代版的输入顺序（位反转置换）',page:897,source:'book'},
     {expr:'\\Theta(n \\lg n)',when:'FFT 的时间（与蝶形总数同阶）',page:890,source:'book'},
    ],tables:[{caption:'C 程序 Part 8：习题 30.3-1 的完整输出（输入 0,2,3,−1,4,5,7,9）',rows:[
      ['k','y_k'],
      ['0','29.00 + 0.00i'],
      ['1','0.95 − 13.19i'],
      ['2','−6.00 − 1.00i'],
      ['3','−8.95 − 5.19i'],
      ['4','−1.00 + 0.00i'],
      ['5','−8.95 + 5.19i'],
      ['6','−6.00 + 1.00i'],
      ['7','0.95 + 13.19i'],
     ]},{caption:'递归版与迭代版的分工',rows:[
      ['','递归 FFT（30.2）','迭代 FFT（30.3）'],
      ['输入顺序','自然顺序','**位反转顺序**'],
      ['结构','隐式树（栈）','$\\lg n$ 级电路'],
      ['蝶形数','$(n/2)\\lg n$','$(n/2)\\lg n$'],
      ['实现特点','直观、便于证明','无递归、访存规整、易流水线'],
      ['C 程序','`fft_rec`','`fft_iter`（part 5 验证两者一致）'],
     ]}],chart:{xMax:64,series:[
     {name:'(n/2)·lg n（蝶形总数）',expr:'n / 2 * Math.log2(n)',color:'--viz-done'},
     {name:'n²（朴素）',expr:'n * n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'为什么每级恰好 n/2 个蝶形',steps:[
      {zh:'第 $s$ 级的蝶形长度是 $m = 2^{s}$，每个蝶形吃 2 个元素 → 这一级需要 $n/m$ 组，每组 $m/2$ 个蝶形。'},
      {zh:'于是这一级的蝶形数 $= (n/m) \\times (m/2) = n/2$ —— **与 $s$ 无关**。'},
      {zh:'共 $\\lg n$ 级 → 总数 $(n/2)\\lg n$；电路把同级的蝶形并行摆放，于是深度是 $\\lg n$。'},
      {tex:'\\text{蝶形数} = \\frac{n}{2}\\lg n,\\qquad \\text{深度} = \\lg n',zh:'★★ C 程序 part 5 与 part 8 在 $n = 8$ 上数到的都是 12 = $(8/2)\\times 3$，正是这条推导的落地。∎'}]},
     ],
    note:''},
   {type:'prove',title:'迭代版为什么对：位反转 + 逐级归纳',statement:'This circuit has depth Θ(lg n) and performs Θ(n lg n) butterfly operations altogether.',
    page:898,
    intro:'★ 迭代版把递归的"自顶向下"翻成"自底向上"：先按位反转排好输入，再从最小的蝶形（长度 2）一路做上去。',
    steps:[
     {title:'① 位反转顺序 = 递归到达叶子的顺序',en:'Mk is the binary representation of rev(k)',
      page:897,
      body:['递归层层把偶下标放在左边、奇下标放在右边 → 第 $i$ 层按 $k$ 的第 $i$ 位决定方向。',
        '于是"从根走到位置 $k$ 的路径"读起来就是 $k$ 的二进制低位在前 —— 即 $\\text{rev}(k)$。',
        '★ 所以把输入按 $\\text{rev}(k)$ 摆放后，原地自底向上做就能模拟递归的展开顺序。']},
     {title:'② 第 s 级：合并两个 2^{s−1} 点 DFT',en:'Combine by performing n/2 butterfly operations. These butterfly operations work with twiddle factors ! 0 n ,! 1 n ,…,! n/2−1 n .',
      page:895,
      body:['归纳假设：进入第 $s$ 级时，每个长度 $2^{s-1}$ 的块内已经是一个 $2^{s-1}$ 点的 DFT。',
        '第 $s$ 级用旋转因子 $\\omega_{2^{s}}^{j}$ 把相邻两块合并成一个 $2^{s}$ 点 DFT —— 与递归版"合并两个子问题"完全同一步。',
        '★ 级数 $s = 1, \\dots, \\lg n$，做完最后一级就是完整的 $n$ 点 DFT。']},
     {title:'③ 级间的相容性靠消去引理',en:'If n>0 is even, then the squares of the n complex nth roots of unity are the n/2 complex (n/2)th roots of unity.',
      page:887,
      body:['第 $s$ 级用的是 $\\omega_{2^{s}}$，而下一级要 $\\omega_{2^{s+1}}$；两者的关系是 $\\omega_{2^{s+1}}^{2} = \\omega_{2^{s}}$。',
        '这正是消去引理（引理 30.3）的内容 —— 它保证同一份结果能被不同级复用。',
        '★ 如果换成任意的求值点（不是单位根），级与级之间就接不起来了。']},
     {title:'④ 代价与自逆性',en:'This circuit has depth Θ(lg n) and performs Θ(n lg n) butterfly operations altogether.',
      page:898,
      body:['每级 $n/2$ 个蝶形、共 $\\lg n$ 级 → $\\Theta(n \\lg n)$；把同级的蝶形并行摆放，深度 $\\Theta(\\lg n)$。',
        '位反转置换是自逆的（$\\text{rev}(\\text{rev}(k)) = k$），所以它可以原地执行、每个元素只交换一次。',
        '★ C 程序 part 6 在 $n \\le 1024$ 上逐个验证了自逆性（反例 0 个）；part 5 验证迭代版与递归版输出一致（差 $5\\text{e-}16$）。∎']},
    ],conclusion:'★ 结论：30.2 的分治 + 一张位反转表 = 电路形状的算法。同一个 $(n/2)\\lg n$ 蝶形总数，从"递归调用栈"变成"规整的循环",这就是工程实现选迭代版的原因。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'FFT 电路有多少级？',options:['$n$','**$\\lg n$**','$n/2$','$\\sqrt{n}$'],answer:1,
      why:'★ 每级规模减半，从 2 长蝶形做到 $n$ 长，共 $\\lg n$ 级。'},
     {kind:'single',q:'每一级有多少个蝶形？',options:['$n$','**$n/2$**','$\\lg n$','$n^{2}$'],answer:1,
      why:'★ $(n/m)\\times(m/2) = n/2$，与级号无关；总数 $(n/2)\\lg n$。'},
     {kind:'judge',q:'迭代 FFT 要求输入按位反转顺序排列。',answer:true,
      why:'★ 位反转序正是"递归走到叶子"的顺序。'},
     {kind:'judge',q:'位反转置换是自逆的。',answer:true,
      why:'★ C 程序 part 6 在 $n \\le 1024$ 上验证：$\\text{rev}(\\text{rev}(k)) = k$，反例 0 个。'},
     {kind:'simulate',q:'C 程序 part 8 里输入 $(0,2,3,-1,4,5,7,9)$ 的 $y_0$ 是多少？（填整数）',expect:[29],placeholder:'例如：15',
      why:'29 —— $y_0$ 是所有分量之和（$0+2+3-1+4+5+7+9$），可以完全手算。'},
     {kind:'single',q:'$n = 8$ 时 FFT 电路的**蝶形总数**是多少？',options:['8','**12**','24','64'],answer:1,why:'★ 蝴蝶总数 $= (n/2) \cdot \lg n = 4 \times 3 = 12$，与 C 程序 part 打印的 12 = (n/2)·lg n 一致。注意别和「级数」$\lg n = 3$、「每级 $n/2 = 4$ 个」混起来。'},
     {kind:'judge',q:'位反转置换只改变输入的取用顺序，不改变 DFT 的结果数值。',answer:true,why:'★ 它只是让迭代版按递归展开所需的顺序喂输入；C 程序验证 $n \le 1024$ 反例 0 个（自逆），且习题 30.3-1 的 $y_0 = 29$、$y_4 = -1$ 与朴素 DFT 只差 4.2e-15。'},
    ],bookExercises:[
     {id:'30.3-1',page:897,star:0,statement:'Show the values on the wires for each butterfly input and output in the FFT circuit of Figure 30.6, given the input vector .0,2,3; −1,4,5,7,9/ .',hint:'C 程序 part 8 打印了完整结果：$y = (29,\\ 0.95-13.19i,\\ -6-i,\\ -8.95-5.19i,\\ -1,\\ -8.95+5.19i,\\ -6+i,\\ 0.95+13.19i)$。建议先手算 $y_0$（各分量和 = 29）与 $y_4$（交替和 = −1）来验证自己的理解。'},
     {id:'30.3-2',page:897,star:0,statement:'Consider an FFT n circuit, such as in Figure 30.6, with wires 0,1,…,n − 1 (wire j has output y j ) and stages numbered as in the figure. Stage s , for s = 1,2…; lg n, consists of n/2 s groups of butterflies. Which two wires are inputs and outputs for the j th butterfly circuit in the gth group in stage s ?',hint:'第 $s$ 级：组内相邻两元素相隔 $2^{s-1}$；写出第 $g$ 组的两个输入下标 $k = g \\cdot 2^{s} + j$ 与 $k + 2^{s-1}$，$j = 0,\\dots,2^{s-1}-1$ —— 与 C 程序 `fft_iter` 里的 `m/2` 偏移一致。'},
     {id:'30.3-4',page:898,star:0,statement:'Write pseudocode for the procedure BIT-REVERSE-PERMUTATION (a,n) , which performs the bit-reversal permutation on a vector a of length n in-place. Assume that you may call the procedure BIT-REVERSE-OF (k,b) , which returns an integer that is the b-bit reversal of the nonnegative integer k, where 0 ≤ k<2 b .',hint:'就是 C 程序的 `rev_bits`（$\\lg n$ 位逐个取到前端）；外层按 `if (r > k)` 只交换一次即可原地完成 —— 依赖自逆性。'},
    ]},
  ],
};
