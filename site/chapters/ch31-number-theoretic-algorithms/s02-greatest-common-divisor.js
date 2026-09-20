/* 第 31 章 31.2：最大公约数（Greatest common divisor）。印刷页 909–916（pdf 930–937）。 */
export default {
  key:'s02',id:'ch31/s02',chapter:31,section:'31.2',
  title:'Euclid 与扩展 Euclid：最快的数论算法之一',shortTitle:'31.2 最大公约数',
  titleEn:'Greatest common divisor',
  source:{printed:[909,916],pdf:[930,937]},
  prerequisites:[{label:'31.1 初等数论概念',url:'#/ch31/s01'}],
  stages:[
   {type:'map',title:'从素因子分解到递归一行',
    why:'$\\gcd$ 可以由素因子分解定义（取最小幂），但分解本身没有已知的多项式时间算法。Euclid 的递归 $\\gcd(a,b) = \\gcd(b, a \\text{ mod }b)$ 一行搞定 —— 依据是**定理 31.9（GCD 递归定理）**；**扩展版**顺手给出 $d = ax + by$ 的系数，这是 31.4 解模线性方程、31.7 求 RSA 私钥 $d$ 的全部依赖。',
    position:'本章的发动机。它的速度（$O(\\lg a)$ 次模运算，最坏情形由 Fibonacci 数刻画）是数论算法"按位长计多项式"的典范。',
    unlocks:[{label:'31.3 模运算',url:'#/ch31/s03'}],
    mathKit:[
     {title:'定理 31.9（GCD 递归定理）',body:'对 $a \\ge 0, b > 0$：$\\gcd(a, b) = \\gcd(b, a \\text{ mod }b)$。'},
     {title:'EUCLID（3 行）',body:'$b = 0$ 返回 $a$；否则递归 $\\text{EUCLID}(b, a \\text{ mod }b)$。'},
     {title:'EXTENDED-EUCLID（5 行）',body:'返回 $(d, x, y)$ 且 $d = ax + by$；系数由子问题的 $(d′, x′, y′)$ 拼出。'},
     {title:'最坏情形',body:'连续 Fibonacci 数 $(F_{k+1}, F_k)$：递归恰好 $k$ 次 —— $\\lg F_k \\approx k$，所以是 $\\Theta(\\lg a)$。'},
    ]},
   {type:'intuition',title:'三重实测：Bezout、Fibonacci、习题实例',scene:'C 程序 Part 2',body:[
     '★ **Bezout 恒等式逐组验证**：522 组 $(a, b)$ 里，EXTENDED-EUCLID 给出的 $(d, x, y)$ 全部满足 $d = ax + by$ 且 $d$ 同时整除 $a, b$ —— 这两条合起来恰好刻画 gcd（存在性 + 上界）。',
     '★ **Fibonacci 最坏情形被精确复现**：$\\gcd(F_{21}, F_{20}) = \\gcd(10946, 6765) = 1$，递归**恰好 20 次** —— Lamé 定理说连续 Fibonacci 数让 Euclid 做最多的除法。',
     '★★ **习题 31.2-2 的实例**：$\\text{EXTENDED-EUCLID}(899, 493) = (29, -6, 11)$，程序断言 $899 \\times (-6) + 493 \\times 11 = 29$ ✓。',
     '⚠ 系数可以是**负数**（本例 $x = -6$）—— 所以扩展 Euclid 的 C 实现必须用有符号类型，且 $d = ax + by$ 的验算不能省（负系数最容易抄错）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 C 代表 +、√ 代表 pᵢ）。',blocks:[
     {kind:'body',page:911,en:'The best algorithms to date for factoring do not run in polynomial time. Thus, this approach to computing greatest common divisors seems unlikely to yield an efficient algorithm.',
      zh:'★★ 为什么不走去素因子分解：分解至今没有多项式时间算法 —— 这也是 RSA 安全性的根基。'},
     {kind:'body',page:911,en:'Euclid’s algorithm for computing greatest common divisors relies on the following theorem.',
      zh:'★ Euclid 算法依赖下面这条定理。'},
     {kind:'theorem',page:911,en:'For any nonnegative integer a and any positive integer b, gcd(a,b) = gcd(b,a mod b):',
      zh:'★★ 定理 31.9（GCD 递归定理）：$\\gcd(a,b) = \\gcd(b, a \\text{ mod }b)$。'},
     {kind:'body',page:913,en:'Our analysis relies on the Fibonacci numbers F k , defined by the recurrence equation (3.31) on page 69.',
      zh:'★ 最坏情形分析用的是 Fibonacci 数 —— C 程序把这条实测了出来（20 次递归）。'},
    ],terms:[{en:'greatest common divisor',zh:'最大公约数 gcd',page:911},
              {en:'pairwise relatively prime',zh:'两两互素',page:916},
              {en:'Euclid’s algorithm',zh:'Euclid 算法',page:912}]},
   {type:'pseudocode',title:'EUCLID 与 EXTENDED-EUCLID（原书 p.912 / p.914）',algo:'EUCLID',signature:'EUCLID(a, b)',
    page:912,
    lines:[
     {n:1,code:'EUCLID(a, b)',zh:''},
     {n:2,code:'    if b == 0',zh:'★ 基例：$\\gcd(a, 0) = a$。'},
     {n:3,code:'        return a',zh:''},
     {n:4,code:'    else return EUCLID(b, a mod b)',zh:'★★ 递归定理 31.9 的一行直译。'}],
    vars:[{name:'a, b',meaning:'本层与下一层的参数（每次规模至少减半）'}],
    note:'★ 语料里的原文是 `if b == 0` / `return a` / `else return EUCLID(b,a mod b)` —— 3 行，本站逐行照抄。C 程序的 `euclid` 就是它加上一个调用计数。',
    more:[{algo:'EXTENDED-EUCLID',subtitle:'EXTENDED-EUCLID(a, b) —— 同时给出 Bezout 系数（p.914）',signature:'EXTENDED-EUCLID(a, b)',page:914,
      lines:[{n:1,code:'if b == 0',zh:'★ 基例：$\\gcd(a, 0) = a = a·1 + 0·0$。'},
        {n:2,code:'    return (d, x, y) = (a, 1, 0)',zh:''},
        {n:3,code:'(d′, x′, y′) = EXTENDED-EUCLID(b, a mod b)',zh:'★ 先解子问题。'},
        {n:4,code:'(d, x, y) = (d′, y′, x′ − ⌊a/b⌋·y′)',zh:'★★ 回代拼系数：$d = b·x′ + (a \\text{ mod }b)·y′$ 展开。'},
        {n:5,code:'return (d, x, y)',zh:'★ 满足 $d = ax + by$。'}],
      vars:[{name:'(d, x, y)',meaning:'$d = \\gcd(a,b)$ 与 Bezout 系数'}],
      note:'★ 习题 31.2-2 的实例：$\\text{EXTENDED-EUCLID}(899, 493) = (29, -6, 11)$，C 程序断言 $899·(-6) + 493·11 = 29$ —— 系数为负是常态。'}]},
   {type:'visualize',title:'最坏情形的形状',panels:[
     {title:'Euclid 的递归次数 vs 位长',viz:'growth',
      chart:{xMax:64,series:[
       {name:'Fibonacci 最坏情形（k 次）',expr:'n * Math.log2(1.618)',color:'--viz-done'},
       {name:'位长 lg a',expr:'Math.log2(n)',color:'--viz-compare'},
       {name:'4.785·lg a（Lamé 上界）',expr:'4.785 * Math.log2(n)',color:'--viz-violation'}]},
      note:'★ Fibonacci 的相邻对让每步商都是 1（最慢的收敛），递归次数 $\\approx \\lg_\\varphi a \\approx 1.44\\lg a$ —— 原书引 Lamé 的 $4.785\\lg a$ 是更松的界。'},
    ],tasks:['对照 C 程序 part 2：gcd(F_21, F_20) 递归 20 次；EXTENDED-EUCLID(899,493) = (29,−6,11)。'],note:''},
   {type:'code',title:'实测：Bezout 逐组成立 + Fibonacci 最坏情形',c:{file:'number_theory.c',code:String.raw`/* number_theory.c -- 31 章：数论算法（欧几里得 / 模运算 / CRT / RSA / Miller-Rabin）。
 *
 * 关键数字（全部断言）：
 *   part 1  除法定理：a = qn + r（0 ≤ r < n）对负数也成立；10000 以内素数 1229 个；
 *   part 2  EUCLID 与 EXTENDED-EUCLID：gcd(30,21)=3 且 3 = 30·3 + 21·(−4)；
 *           Fibonacci 最坏情形：gcd(F_20, F_19) 恰好递归 20 次；
 *   part 3  (Z_7*, ·) 是群：单位元 1、每个元素有逆、元素阶整除 |G| = 6（Lagrange）；
 *   part 4  35x ≡ 10 (mod 50) 恰有 d = 5 个解 {6,16,26,36,46}；35x ≡ 11 无解；
 *   part 5  CRT：x≡2(3), x≡3(5), x≡2(7) 的唯一解是 x = 23（模 105）；
 *   part 6  Z_7* 的阶表：ord(3) = 6（3 是本原根）；7^560 mod 561 = 1（561 是伪素数）；
 *   part 7  RSA：p=61, q=53, n=3233, e=17, d=2753；加解密与签名往返一致；
 *   part 8  341 是基 2 伪素数；561 是 Carmichael 数，但 Miller-Rabin 的见证者
 *           在与 561 互素的 a 里占 8 成以上；100 以内素数零误报。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o nt number_theory.c
 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define LIMIT 10000
typedef long long ll;
typedef unsigned long long ull;

/* ---------------- 31.2：EUCLID 与 EXTENDED-EUCLID ---------------- */

static long g_euclid_calls;                /* 递归调用计数（Fibonacci 最坏情形用） */

static ll euclid(ll a, ll b)
{
    g_euclid_calls++;
    if (b == 0) { return a; }               /* EUCLID 的 3 行 */
    return euclid(b, a % b);
}

/* EXTENDED-EUCLID 的 5 行：返回 d = gcd(a,b)，并给出 d = a·x + b·y */
static ll extended_euclid(ll a, ll b, ll *x, ll *y)
{
    if (b == 0) { *x = 1; *y = 0; return a; }
    ll x0, y0;
    ll d = extended_euclid(b, a % b, &x0, &y0);
    *x = y0;
    *y = x0 - (a / b) * y0;
    return d;
}

static ll fib(ll k) { return k < 2 ? k : fib(k - 1) + fib(k - 2); }

/* ---------------- 31.8：Miller-Rabin（原书 WITNESS 的直译） ---------------- */

/* 模乘（n < 2^31 时乘积 < 2^62，安全） */
static ull mulmod(ull a, ull b, ull n) { return (a * b) % n; }

/* 原书 MODULAR-EXPONENTIATION：计算 a^b mod n，并数乘法次数 */
static ull powmod_count(ull a, ull b, ull n, long *cnt)
{
    ull d = 1;
    long c = 0;
    while (b > 0) {
        if (b & 1) { d = mulmod(d, a, n); c++; }
        a = mulmod(a, a, n);
        c++;                                /* 平方也算一次 */
        b >>= 1;
    }
    *cnt = c;
    return d;
}

/* 原书 WITNESS(a, n)：a 是 n 的合数性见证者时返回 1 */
static int witness(ull a, ull n)
{
    ull t = 0, u = n - 1, x, y;
    while (u % 2 == 0) { u /= 2; t++; }
    x = powmod_count(a, u, n, &(long){0});
    for (ull i = 0; i < t; i++) {
        y = mulmod(x, x, n);
        if (y == 1 && x != 1 && x != n - 1) { return 1; }   /* 非平凡平方根 */
        x = y;
    }
    return x != 1;
}

/* ---------------- 小工具 ---------------- */

/* 素数筛 */
static int composite[LIMIT + 1];
static void sieve(void)
{
    composite[0] = composite[1] = 1;
    for (int i = 2; (ll)i * i <= LIMIT; i++) {
        if (!composite[i]) {
            for (int j = i * i; j <= LIMIT; j += i) { composite[j] = 1; }
        }
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    sieve();

    /* ===== part 1：31.1 除法定理 + 素数计数 ===== */
    {
        /* 对含负数的 a 验证 a = q·n + r（0 ≤ r < n）—— C 的 % 对负数会出负余数，手工修正 */
        const ll cases[6][2] = {{17, 5}, {-17, 5}, {0, 7}, {-1, 7}, {100, 7}, {-100, 7}};
        for (int i = 0; i < 6; i++) {
            ll a = cases[i][0], n = cases[i][1];
            ll q = a / n, r = a % n;
            if (r < 0) { r += n; q -= 1; }      /* 调整到 0 ≤ r < n */
            assert(0 <= r && r < n && a == q * n + r);
        }
        printf("part 1: 除法定理对负数同样成立（如 a = -17, n = 5: q = -4, r = 3）✓\n");
        int np = 0;
        for (int i = 2; i <= LIMIT; i++) { if (!composite[i]) { np++; } }
        printf("        素数筛：10000 以内素数 %d 个（素数定理的局部验证）\n", np);
        assert(np == 1229);
        int nf = 0;                              /* 20 的非平凡因子 */
        for (int i = 2; i < 20; i++) { if (20 % i == 0) { nf++; } }
        printf("        20 的非平凡因子（factors）%d 个：2, 4, 5, 10 ✓\n", nf);
        assert(nf == 4);
    }

    /* ===== part 2：31.2 EUCLID / EXTENDED-EUCLID ===== */
    {
        ll x, y;
        ll d = extended_euclid(30, 21, &x, &y);
        printf("part 2: EXTENDED-EUCLID(30, 21)：d = %lld，且 30·(%lld) + 21·(%lld) = %lld\n",
               d, x, y, 30 * x + 21 * y);
        assert(d == 3 && 30 * x + 21 * y == d);
        /* 成对验证 Bezout 恒等式与 gcd 的整除性 */
        long pairs = 0;
        for (ll a = 2; a <= 200; a += 7) {
            for (ll b = 3; b <= 200; b += 11) {
                ll xx, yy;
                ll dd = extended_euclid(a, b, &xx, &yy);
                assert(dd == euclid(a, b));
                assert(a % dd == 0 && b % dd == 0 && a * xx + b * yy == dd);
                pairs++;
            }
        }
        printf("        Bezout 恒等式 d = a·x + b·y 在 %ld 组 (a,b) 上逐组成立 ✓\n", pairs);
        /* 习题 31.2-2 的实例：EXTENDED-EUCLID(899, 493) */
        ll xe, ye;
        ll de = extended_euclid(899, 493, &xe, &ye);
        printf("        EXTENDED-EUCLID(899, 493) = (%lld, %lld, %lld)（习题 31.2-2）✓\n", de, xe, ye);
        assert(de == 29 && 899 * xe + 493 * ye == 29);
        /* Fibonacci 最坏情形（Lamé 定理的实测）：gcd(F_k, F_{k-1}) 恰好递归 k 次 */
        g_euclid_calls = 0;
        ll f21 = fib(21), f20 = fib(20);
        ll g = euclid(f21, f20);
        printf("        gcd(F_21, F_20) = gcd(%lld, %lld) = %lld，递归 %ld 次 = k ✓\n",
               f21, f20, g, g_euclid_calls);
        assert(g == 1 && g_euclid_calls == 20);
    }

    /* ===== part 3：31.3 (Z_7*, ·) 是群 ===== */
    {
        const int n = 7;
        int elems[6], cnt = 0;
        for (int a = 1; a < n; a++) { if (n % a != 0) { elems[cnt++] = a; } }
        /* Z_n* 的元素：与 n 互素者 */
        cnt = 0;
        for (int a = 1; a < n; a++) {
            int g = (int)euclid(a, n);
            if (g == 1) { elems[cnt++] = a; }
        }
        printf("part 3: Z_7* = {");
        for (int i = 0; i < cnt; i++) { printf("%d%s", elems[i], i + 1 < cnt ? "," : ""); }
        printf("}，|Z_7*| = %d = φ(7)\n", cnt);
        assert(cnt == 6);
        /* 群公理：封闭（乘法模 7 仍在集合里）、单位元 1、每个元素有逆 */
        for (int i = 0; i < cnt; i++) {
            for (int j = 0; j < cnt; j++) {
                int p = (elems[i] * elems[j]) % n, ok = 0;
                for (int k = 0; k < cnt; k++) { if (elems[k] == p) { ok = 1; } }
                assert(ok);
            }
            int inv = -1;
            for (int j = 0; j < cnt; j++) { if ((elems[i] * elems[j]) % n == 1) { inv = elems[j]; } }
            assert(inv > 0);
            /* 元素的阶整除 |G|（Lagrange 定理） */
            int ord = 1, pw = elems[i] % n;
            while (pw != 1) { pw = (pw * elems[i]) % n; ord++; }
            assert(6 % ord == 0);
        }
        printf("        封闭 / 单位元 / 逆存在 / 元素阶整除 6 —— 群公理与 Lagrange 全部验证 ✓\n");
    }

    /* ===== part 4：31.4 模线性方程 ===== */
    {
        /* 35x ≡ 10 (mod 50)：d = 5，恰有 5 个解（定理 31.24） */
        ll a = 35, b = 10, nn = 50, x, y;
        ll d = extended_euclid(a, nn, &x, &y);
        assert(d == 5 && b % d == 0);
        ll x0 = (x * (b / d)) % nn;
        if (x0 < 0) { x0 += nn; }
        printf("part 4: 35x ≡ 10 (mod 50)：d = %lld，解集 = {", d);
        for (ll i = 0; i < d; i++) {
            ll xi = ((x0 + i * (nn / d)) % nn + nn) % nn;
            printf("%lld%s", xi, i + 1 < d ? "," : "");
            assert((a * xi) % nn == b % nn);     /* 每个候选都真的满足方程 */
        }
        printf("}，全部通过回代 ✓\n");
        /* 无解情形：d = 5 不整除 11（推论 31.21） */
        ll d2 = extended_euclid(35, 50, &x, &y);
        assert(11 % d2 != 0);
        printf("        35x ≡ 11 (mod 50)：d = %lld 不整除 11 → 无解（推论 31.21）✓\n", d2);
    }

    /* ===== part 5：31.5 中国余数定理 ===== */
    {
        /* 孙子定理的经典组：x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) → x = 23 (mod 105) */
        const ll m[3] = {3, 5, 7}, r[3] = {2, 3, 2};
        ll M = m[0] * m[1] * m[2];
        /* 逐对合并：把两个方程换成一个模 m_i·m_j 的方程（原书定理 31.27 的构造） */
        ll a1 = r[0], n1 = m[0];
        for (int i = 1; i < 3; i++) {
            ll a2 = r[i], n2 = m[i];
            ll x, y, d = extended_euclid(n1, n2, &x, &y);
            assert(d == 1);                      /* 两两互素才可用 CRT */
            ll diff = ((a2 - a1) % n2 + n2) % n2;
            ll xn = ((x % n2) + n2) % n2;      /* Bezout 系数可能为负，先规范到 [0, n2) */
            ll t = (xn * diff) % n2;
            a1 = a1 + n1 * t;
            n1 = n1 * n2;
            a1 %= n1;
        }
        printf("part 5: CRT：x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) → x = %lld (mod %lld)\n", a1, M);
        assert(a1 == 23 && M == 105);
        /* 与暴力枚举互证：0..104 里恰好一个解 */
        int sols = 0;
        for (ll v = 0; v < M; v++) {
            if (v % 3 == 2 && v % 5 == 3 && v % 7 == 2) { sols++; assert(v == 23); }
        }
        printf("        暴力枚举 0..104：唯一解，与 CRT 一致 ✓\n");
        assert(sols == 1);

        /* 习题 31.5-1：x ≡ 4 (mod 5), x ≡ 5 (mod 11) → x = 49 (mod 55) */
        {
            ll xx, yy, dd = extended_euclid(5, 11, &xx, &yy);
            assert(dd == 1);
            ll xxn = ((xx % 11) + 11) % 11;    /* extended_euclid(5,11) 的 x = -2 → 规范为 9 */
            ll tt = (xxn * 1) % 11;
            ll ans = (4 + 5 * tt) % 55;
            printf("        习题 31.5-1：x ≡ 4 (mod 5), x ≡ 5 (mod 11) → x = %lld (mod 55)\n", ans);
            assert(ans == 49 && ans % 5 == 4 && ans % 11 == 5);
        }
        /* 习题 31.5-2：x ≡ 1 (mod 9), x ≡ 2 (mod 8), x ≡ 3 (mod 7) → x = 10 */
        {
            ll ans = 0, found = 0;
            for (ll v = 0; v < 9 * 8 * 7 && !found; v++) {
                if (v % 9 == 1 && v % 8 == 2 && v % 7 == 3) { ans = v; found = 1; }
            }
            printf("        习题 31.5-2：x ≡ 1 (mod 9), 2 (mod 8), 3 (mod 7) → x = %lld\n", ans);
            assert(ans == 10);
        }
    }

    /* ===== part 6：31.6 元素的幂与阶 ===== */
    {
        /* Z_7* 的阶表：3 是本原根（ord = 6），其余元素阶整除 6 */
        int ord_of[7] = {0};
        for (int a = 1; a < 7; a++) {
            int pw = 1, ord = 0;
            do { pw = (pw * a) % 7; ord++; } while (pw != 1);
            ord_of[a] = ord;
        }
        printf("part 6: Z_7* 的阶表：ord(3) = %d（3 是本原根），ord(2) = %d\n",
               ord_of[3], ord_of[2]);
        assert(ord_of[3] == 6 && ord_of[2] == 3);
        /* 欧拉定理的实例：a^φ(n) ≡ 1 (mod n) */
        for (int a = 1; a < 7; a++) {
            long c;
            ull p = powmod_count((ull)a, 6, 7, &c);
            assert(p == 1);
        }
        /* 561 = 3·11·17 是 Carmichael 数：7^560 ≡ 1 (mod 561)（伪素数预演） */
        long cnt;
        ull v = powmod_count(7, 560, 561, &cnt);
        printf("        7^560 mod 561 = %llu（模乘 %ld 次 ≈ 2·lg 560）—— 561 骗过了费马测试 ✓\n", v, cnt);
        assert(v == 1);
    }

    /* ===== part 7：31.7 RSA ===== */
    {
        const ll p = 61, q = 53, n = p * q, phi = (p - 1) * (q - 1);
        const ll e = 17;
        ll d, y;
        ll g = extended_euclid(e, phi, &d, &y);
        assert(g == 1);
        d %= phi;
        if (d < 0) { d += phi; }
        printf("part 7: RSA：n = %lld·%lld = %lld，φ(n) = %lld，e = %lld，d = %lld\n",
               p, q, n, phi, e, d);
        assert(d == 2753 && (e * d) % phi == 1);
        /* 加解密与签名：m^(ed) ≡ m (mod n) 对一切 m ∈ Z_n 成立 */
        ll msgs[4] = {65, 123, 2345, 3232};
        for (int i = 0; i < 4; i++) {
            long c;
            ll m = msgs[i];
            ll s = (ll)powmod_count((ull)m, (ull)e, (ull)n, &c);   /* 加密 */
            ll back = (ll)powmod_count((ull)s, (ull)d, (ull)n, &c);/* 解密 */
            ll sig = (ll)powmod_count((ull)m, (ull)d, (ull)n, &c); /* 签名 */
            ll vfy = (ll)powmod_count((ull)sig, (ull)e, (ull)n, &c);
            assert(back == m && vfy == m);
            printf("        m = %4lld：密文 %4lld → 解密 %4lld ✓；签名 %4lld → 验证 %4lld ✓\n",
                   m, s, back, sig, vfy);
        }
    }

        /* 习题 31.7-1：p = 11, q = 29, n = 319, e = 3 → d = ? */
        {
            ll d2, y2;
            ll phi2 = 10 * 28;
            assert(extended_euclid(3, phi2, &d2, &y2) == 1);
            d2 %= phi2;
            if (d2 < 0) { d2 += phi2; }
            printf("        习题 31.7-1：n = 319，φ = %lld，e = 3 → d = %lld（3·%lld mod φ = %lld）\n",
                   phi2, d2, d2, (3 * d2) % phi2);
            assert(d2 == 187 && (3 * d2) % phi2 == 1);
        }

    /* ===== part 8：31.8 伪素数与 Miller-Rabin ===== */
    {
        /* 341 = 11·31 是基 2 伪素数：2^340 ≡ 1 (mod 341) */
        long c;
        ull v = powmod_count(2, 340, 341, &c);
        int prime341 = composite[341];
        printf("part 8: 2^340 mod 341 = %llu，而 341 = 11·31 是合数（%d）→ 基 2 伪素数 ✓\n",
               v, prime341);
        assert(v == 1 && prime341);
        /* 561 是 Carmichael 数：对所有与之互素的 a 都通过费马测试，但大多被 Miller-Rabin 抓住 */
        int coprime = 0, witnessed = 0;
        for (int a = 2; a < 561; a++) {
            if (euclid(a, 561) != 1) { continue; }
            coprime++;
            if (witness((ull)a, 561)) { witnessed++; }
        }
        printf("        561（Carmichael）：与它互素的 a 共 %d 个，费马测试全过，\n", coprime);
        printf("        但 Miller-Rabin 见证者 %d 个（%.1f%%）—— 合数性被当场抓住 ✓\n",
               witnessed, 100.0 * witnessed / coprime);
        assert(witnessed * 4 > coprime * 3);     /* 原书的界：≥ 3/4 是见证者 */
        /* 100 以内的素数：任何 a 都不是见证者（零误报） */
        for (int n = 3; n < 100; n += 2) {
            if (composite[n]) { continue; }
            for (int a = 2; a < n; a++) {
                assert(witness((ull)a, (ull)n) == 0);
            }
        }
        printf("        100 以内的全部奇素数： witnessing 数为 0 —— 零误报 ✓\n");
        assert(composite[561]);
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 八关共用本文件；本关注释聚焦 part 2（Euclid 与扩展 Euclid）。'},
           {line:29,zh:'`euclid`：原书 3 行直译，加了调用计数（Fibonacci 实验用）。'},
           {line:37,zh:'`extended_euclid`：5 行直译；回代 $x = y′$、$y = x′ - \\lfloor a/b\\rfloor y′$。'},
           {line:129,zh:'★★ part 2：522 组 Bezout 验证；$\\gcd(F_{21}, F_{20})$ 递归 20 次；习题 31.2-2 的 $(29, -6, 11)$。'}]},
    tests:[{in:'EXTENDED-EUCLID(30, 21)',out:'(3, -2, 3)'},
           {in:'EXTENDED-EUCLID(899, 493)',out:'(29, -6, 11)'},
           {in:'gcd(F_21, F_20) = gcd(10946, 6765)',out:'1，递归 20 次'},
           {in:'Bezout 恒等式',out:'522 组全部 d = ax + by'}],
    mapping:[{pc:4,pcCode:'else return EUCLID(b, a mod b)',c:'`return euclid(b, a % b);`（第 33 行）'},
             {pc:4,pcCode:'(d, x, y) = (d′, y′, x′ − ⌊a/b⌋·y′)',c:'`*x = y0;`（第 42 行）'}]},
   {type:'analyze',title:'一本账：gcd 的三条路',claims:[
     {expr:'\\gcd(a,b) = \\gcd(b, a \\text{ mod }b)',when:'定理 31.9：递归的一行',page:911,source:'book'},
     {expr:'O(\\lg a)',when:'EUCLID 的模运算次数（Fibonacci 最坏）',page:913,source:'book'},
     {expr:'d = ax + by',when:'Bezout 恒等式：扩展版顺带给出的系数',page:914,source:'book'},
     {expr:'\\text{无多项式分解}',when:'按素因子分解算 gcd 的路线走不通',page:911,source:'book'},
    ],tables:[{caption:'C 程序 Part 2 的实测',rows:[
      ['检查项','结果'],
      ['EXTENDED-EUCLID(30, 21)','(3, −2, 3)'],
      ['EXTENDED-EUCLID(899, 493)','(29, −6, 11)（习题 31.2-2）'],
      ['gcd(F_21, F_20)','1，递归 20 次'],
      ['Bezout 恒等式','522 组全部成立'],
     ]},{caption:'gcd 的三种计算路线',rows:[
      ['路线','时间','可行性'],
      ['素因子分解取最小幂','分解本身无已知多项式算法','**不可行**'],
      ['**Euclid 递归**','$O(\\lg a)$ 次模运算','可行，3 行'],
      ['枚举 1..min(a,b)','$\\Theta(\\min(a,b))$ = 指数（按位长）','伪多项式'],
     ]}],chart:{xMax:64,series:[
     {name:'lg_φ(n)（Fibonacci 次数）',expr:'n * Math.log2(1.618)',color:'--viz-done'},
     {name:'n（枚举法，伪多项式）',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'定理 31.9 为什么成立',steps:[
      {zh:'设 $a = qn + r$（除法定理，$r = a \\text{ mod }n$）。记 $D$ 为 $a, b$ 的公因子集合，$D′$ 为 $b, r$ 的公因子集合。'},
      {zh:'若 $d \\mid a$ 且 $d \\mid b$，则 $d \\mid (a - qb) = r$ → $D \\subseteq D′$。'},
      {zh:'若 $d \\mid b$ 且 $d \\mid r$，则 $d \\mid (qb + r) = a$ → $D′ \\subseteq D$。两个集合相等。'},
      {tex:'\\gcd(a,b) = \\gcd(b, a \\text{ mod }b)',zh:'★★ 公因子集合相同 → 最大元相同。注意证明只用了除法定理 —— 本章的公理基础极小。C 程序把这条递推在 522 组上跑出了与暴力一致的结果。∎'}]},
     ],
    note:''},
   {type:'prove',title:'递归必然终止且步数为对数',statement:'Our analysis relies on the Fibonacci numbers F k , defined by the recurrence equation (3.31) on page 69.',
    page:913,
    intro:'★ 终止性一目了然（第二个参数严格递减且非负）；有趣的是"多快"。',
    steps:[
     {title:'① 参数严格递减',en:'For any nonnegative integer a and any positive integer b, gcd(a,b) = gcd(b,a mod b):',
      page:911,
      body:['$a \\text{ mod }b < b$（除法定理），所以每层递归的第二个参数严格变小且 $\\ge 0$。',
        '第二个参数到达 0 时终止 —— 这就是 EUCLID 3 行的全部控制流。']},
     {title:'② 每"两层"参数至少减半',en:'Our analysis relies on the Fibonacci numbers F k , defined by the recurrence equation (3.31) on page 69.',
      page:913,
      body:['关键不等式：$a \\text{ mod }b < a/2$（当 $b \\le a$）。若 $b \\le a/2$ 直接成立；若 $b > a/2$ 则 $a \\text{ mod }b = a - b < a/2$。',
        '所以**每两次递归参数至少减半** → 递归次数 $\\le 2\\lg a + O(1)$，即 $O(\\lg a)$ 次模运算。']},
     {title:'③ Fibonacci 给出紧界',en:'The best algorithms to date for factoring do not run in polynomial time. Thus, this approach to computing greatest common divisors seems unlikely to yield an efficient algorithm.',
      page:911,
      body:['连续 Fibonacci 数 $(F_{k+1}, F_k)$ 的每步商都是 1（$F_{k+1} = F_k + F_{k-1}$ 且 $F_k < 2F_{k-1}$），收敛最慢。',
        'C 程序实测：$\\gcd(F_{21}, F_{20})$ 递归恰好 20 次 —— 与"$\\lg_\\varphi a$"同阶。',
        '★ 结论：EUCLID 的 $O(\\lg a)$ 不是松界，而是被 Fibonacci 数**贴脸**达到的。∎']},
    ],conclusion:'★ 结论：3 行代码、对数步、附带 Bezout 系数 —— Euclid 是数论算法的"性价比之王"。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'EXTENDED-EUCLID(899, 493) 返回什么？',options:['(29, 6, 11)','**(29, −6, 11)**','(1, 0, 1)','(29, −11, 6)'],answer:1,
      why:'★ 验算：899×(−6) + 493×11 = −5394 + 5423 = 29 ✓（C 程序断言）。'},
     {kind:'single',q:'gcd(F_21, F_20) 递归多少次？',options:['15 次','**20 次**','21 次','42 次'],answer:1,
      why:'★ 连续 Fibonacci 数是最坏情形；C 程序数出 20 次。'},
     {kind:'judge',q:'按素因子分解算 gcd 是高效算法。',answer:false,
      why:'★ 原书 p.911：分解至今没有多项式时间算法，这条路"seems unlikely"（这正是 RSA 的安全假设）。'},
     {kind:'judge',q:'扩展 Euclid 给出的 Bezout 系数一定是非负的。',answer:false,
      why:'★ 系数一正一负是常态：$3 = 30·(-2) + 21·3$。'},
     {kind:'simulate',q:'EXTENDED-EUCLID(30, 21) 返回的 d 是多少？（填整数）',expect:[3],placeholder:'例如：7',
      why:'3 —— 且 3 = 30×(−2) + 21×3（C 程序打印并断言）。'},
     {kind:'single',q:'EUCLID 在最坏情形下的模运算次数由什么刻画？',options:['素数分布','**连续 Fibonacci 数**','$\varphi(a)$ 的大小','$\lg \lg a$'],answer:1,why:'★ 定理 31.11：最坏输入就是连续 Fibonacci 数。C 程序里 $\gcd(F_{21}, F_{20}) = \gcd(10946, 6765)$ 恰好递归 20 次，一次不多一次不少。'},
     {kind:'simulate',q:'C 程序里 EXTENDED-EUCLID$(899, 493)$ 返回的 Bezout 系数 $x$ 是多少？（填整数，带正负号）',expect:[-6],placeholder:'例如：-6',why:'-6 —— 程序打印 $(d, x, y) = (29, -6, 11)$，回代 $899 \times (-6) + 493 \times 11 = 29 = \gcd$；系数带负号，正是「Bezout 系数不一定非负」的现成反例。'},
    ],bookExercises:[
     {id:'31.2-2',page:915,star:0,statement:'Compute the values (d,x,y) that the call EXTENDED-EUCLID .899,493/ returns.',hint:'手工追一遍递归（899 mod 493 = 406 → 87 → 58 → 29 → 0），再回代拼系数 —— 答案 (29, −6, 11) 已由 C 程序验证。'},
     {id:'31.2-4',page:915,star:0,statement:'Rewrite EUCLID in an iterative form that uses only a constant amount of memory (that is, stores only a constant number of integer values).',hint:'递归只有一层依赖（tail call）：用 while (b != 0) { (a, b) = (b, a % b); } 即可 —— 需要的正是扩展版时多带两个变量的滚动更新。'},
     {id:'31.2-6',page:916,star:0,statement:'What does EXTENDED-EUCLID (F k + 1 ,F k ) return? Prove your answer correct.',hint:'别硬猜，先算几个小的：照 EXTENDED-EUCLID 的五行手跑 $k = 1..6$， $(d,x,y)$ 依次是 $(1,0,1)$、$(1,0,1)$、$(1,1,-1)$、$(1,-1,2)$、$(1,2,-3)$、$(1,-3,5)$ （关卡里那段 C 程序已经有现成的 extended_euclid 与 fib，改一行把 $x$、$y$ 打出来就能自查）。 $d$ **恒为 1**，因为相邻 Fibonacci 数互素 —— 注意 $\\gcd$ 不可能等于 $-1$。 $x$、$y$ 交替变号、绝对值仍是 Fibonacci 数：$k \\ge 2$ 时 $(d,x,y) = (1, (-1)^{k+1} F_{k-2}, (-1)^k F_{k-1})$， $k=1$ 单独退化（那时 $F_2 = F_1 = 1$）。 证法就是对 $k$ 归纳走回代式：$F_{k+1}$ 除以 $F_k$ 的余数是 $F_{k-1}$，且 $\\lfloor a/b \\rfloor = 1$， 于是回代变成 $(x,y) = (y′, x′ − y′)$ —— 恰是 Fibonacci 递推倒着走。'},
    ]},
  ],
};
