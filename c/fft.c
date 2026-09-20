/* fft.c -- 30 章：多项式与 FFT。
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
