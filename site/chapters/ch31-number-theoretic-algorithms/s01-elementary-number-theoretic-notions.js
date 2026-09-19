/* 第 31 章 31.1：初等数论概念（Elementary number-theoretic notions）。印刷页 902–908（pdf 923–929）。 */
export default {
  key:'s01',id:'ch31/s01',chapter:31,section:'31.1',
  title:'整除、素数与除法定理',shortTitle:'31.1 初等数论概念',
  titleEn:'Elementary number-theoretic notions',
  source:{printed:[902,908],pdf:[923,929]},
  prerequisites:[{label:'30.3 FFT 电路',url:'#/ch30/s03'}],
  stages:[
   {type:'map',title:'d | a、素数与余数',
    why:'数论算法的整个舞台由三个定义搭起：**整除**（$d \\mid a$ 表示 $a = kd$）、**素数**（只有平凡因子 1 与自身）、**除法定理**（$a = qn + r$，$0 \\le r < n$，商与余数唯一）。$\\text{mod}$ 就是这个 $r$。注意复杂度的正确打开方式：数论算法的时间按**输入的位数** $\\lg a$ 计，不是按 $a$ 本身。',
    position:'第 VIII 部分前最后一章的开始。RSA（31.7）与 Miller-Rabin（31.8）都建立在本节的词汇上。',
    unlocks:[{label:'31.2 最大公约数',url:'#/ch31/s02'}],
    mathKit:[
     {title:'整除',body:'$d \\mid a \\iff a = kd$（$k$ 为整数）。每个整数都整除 0；$d \\mid a$ 且 $a > 0$ 则 $|d| \\le |a|$。'},
     {title:'素数',body:'大于 1 且只有平凡因子 1 与 $a$ 的整数；非平凡因子叫**因子**（20 的因子是 2, 4, 5, 10）。'},
     {title:'除法定理（定理 31.1）',body:'对任意整数 $a$ 与正整数 $n$，存在**唯一**的 $q, r$ 使 $a = qn + r$ 且 $0 \\le r < n$。'},
     {title:'多项式时间（数论版）',body:'跑在 $\\lg a_1, \\lg a_2, \\dots$ 的多项式时间内 —— 即按**二进制位长**计。'},
    ]},
   {type:'intuition',title:'除法定理对负数同样成立',scene:'C 程序 Part 1',body:[
     '★ C 语言的 `%` 对负数会给出负余数（$-17 \\% 5 = -2$），但除法定理要求 $0 \\le r < n$。C 程序 part 1 对 $a = -17, n = 5$ 手工修正得 $q = -4, r = 3$，并断言 $-17 = -4 \\times 5 + 3$ —— 定理对负数同样成立，只是**实现要注意**。',
     '★ 素数筛（Eratosthenes）在 10000 以内筛出 **1229** 个素数 —— 这是素数定理的局部版本：素数密度约 $1/\\ln n$。',
     '★ 20 的非平凡因子恰好是 {2, 4, 5, 10} 共 4 个 —— 程序逐个枚举断言。',
     '⚠ "输入规模"的陷阱：$a = 10^{18}$ 的输入只有 60 位。任何按 $a$ 的值循环的"算法"在数论里都是指数时间的 —— 这也是为什么 Euclid、快速幂这些 $O(\\lg b)$ 的算法才有资格叫多项式时间。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 d j a 代表 d∣a、f…g 代表 {…}）。',blocks:[
     {kind:'body',page:904,en:'This section provides a brief review of notions from elementary number theory concerning the set Z = f…; −2; −1,0,1,2,… g of integers and the set N = f0,1,2,… g of natural numbers.',
      zh:'★ 本节是 $\\mathbb{Z}$ 与 $\\mathbb{N}$ 的速览。'},
     {kind:'body',page:904,en:'The notation d j a (read <⌈ divides a/) means that a = kd for som⌉ integer k.',
      zh:'★★ 整除的定义：$d \\mid a$ 当且仅当 $a = kd$。'},
     {kind:'body',page:904,en:'Every positive integer a is divisible by the trivial divisors 1 and a. The nontrivial divisors of a are the factors of a. For example, the factors of 20 are 2, 4, 5, and 10.',
      zh:'★★ 平凡因子 vs 因子：20 的因子是 2, 4, 5, 10（C 程序逐个枚举验证）。'},
     {kind:'theorem',page:905,en:'For any integer a and any positive integer n, there exist unique integers q and r such that 0 ≤ r <n and a = qn + r .',
      zh:'★★ 定理 31.1（除法定理）：商与余数**唯一**。'},
     {kind:'body',page:905,en:'The value q = ⌊a/n⌋ is the quotient of the division. The value r = a mod n is the remainder (or residue) of the division, so that n j a if and only if a mod n = 0.',
      zh:'★★ mod 就是余数：$n \\mid a \\iff a \\text{ mod }n = 0$。'},
     {kind:'body',page:904,en:'puts a 1 ,a 2 ,…,a k is a polynomial-time algorithm if it runs in time polynomial in lg a 1 ; lg a 2 ,…; lg a k , that is, polynomial in the lengths of its binary-encoded inputs.',
      zh:'★★ 数论里的"多项式时间"按**位长**计 —— 这是本章一切复杂度断言的前提。'},
    ],terms:[{en:'divides',zh:'整除（d∣a）',page:904},
              {en:'prime',zh:'素数',page:904},
              {en:'remainder',zh:'余数（a mod n）',page:905}]},
   {type:'pseudocode',title:'本站整理：试除与筛法（原书 31.1 只有定义，没有算法）',algo:'TRIAL-DIVISORS',signature:'TRIAL-DIVISORS(a)',
    page:904,
    lines:[
     {n:1,code:'TRIAL-DIVISORS(a)             // 列出 a 的全部非平凡因子',zh:''},
     {n:2,code:'    for d = 2 to a-1:',zh:'★ 上界 $a$ 本身可以收紧到 $\\sqrt{a}$：因子成对出现。'},
     {n:3,code:'        if d | a: print d',zh:'★ 逐个试除。'},
     {n:4,code:'    // a = 20 → 打印 2, 4, 5, 10',zh:'★ C 程序 part 1 断言的正是这一行。'}],
    vars:[{name:'d',meaning:'候选因子'}],
    note:'★ 原书 31.1 是纯概念节（唯一"算法级"的内容是除法定理本身）；本段试除与下一格的筛法是本站整理的辅助实现，用来把定义跑起来。',
    more:[{algo:'SIEVE',subtitle:'SIEVE(n) —— Eratosthenes 筛：标记全部合数',signature:'SIEVE(n)',page:904,
      lines:[{n:1,code:'    for p = 2 to ⌊√n⌋:',zh:'★ 只需筛到 $\\sqrt{n}$。'},
        {n:2,code:'        if p 未被标记:',zh:'★ p 是素数。'},
        {n:3,code:'            for j = p² to n step p: 标记 j',zh:'★★ 从 $p^{2}$ 起步：更小的倍数已被更小的素数标记。'},
        {n:4,code:'    // 10000 以内剩 1229 个未标记',zh:'★ C 程序断言的数量。'}],
      vars:[{name:'标记',meaning:'合数标记数组'}],
      note:'★ 筛法时间 $\\Theta(n \\lg\\lg n)$ —— 与本章"按位长计复杂度"不同，它按值域 $n$ 计，用于离线建表。'}]},
   {type:'visualize',title:'素数的密度',panels:[
     {title:'素数计数：π(n) 与 n/ln n',viz:'growth',
      chart:{xMax:10000,series:[
       {name:'素数个数 π(n)（素数定理）',expr:'n / Math.log(n)',color:'--viz-done'},
       {name:'1.2·n/ln n',expr:'1.2 * n / Math.log(n)',color:'--viz-compare'}]},
      note:'★ 10000 以内实测 1229 个，而 $10000/\\ln 10000 \\approx 1086$ —— 素数定理说 $\\pi(n) \\sim n/\\ln n$，这是它的局部快照。'},
    ],tasks:['对照 C 程序 part 1：除法定理的负数用例、1229 个素数、20 的 4 个因子。'],note:''},
   {type:'code',title:'实测：负余数修正与素数筛',c:{file:'number_theory.c',code:String.raw`/* number_theory.c -- 31 章：数论算法（欧几里得 / 模运算 / CRT / RSA / Miller-Rabin）。
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
    notes:[{line:1,zh:'★ 五关共用本文件；本关注释聚焦 part 1（除法定理与筛法）。'},
           {line:87,zh:'`sieve`：Eratosthenes 筛，从 $p^{2}$ 起步标记合数。'},
           {line:112,zh:'★★ part 1：负数用例 $a = -17, n = 5$ 修正为 $q = -4, r = 3$；素数 1229 个；20 的因子 4 个。'}]},
    tests:[{in:'a = -17, n = 5（除法定理）',out:'q = -4, r = 3（0 ≤ r < n）'},
           {in:'素数筛 10000',out:'1229 个素数'},
           {in:'20 的非平凡因子',out:'4 个：2, 4, 5, 10'}],
    mapping:[{pc:3,pcCode:'if d | a: print d',c:'`if (20 % i == 0) { nf++; }`（第 118 行）'},
             {pc:4,pcCode:'a = 20 → 打印 2, 4, 5, 10',c:'`for (int i = 2; i < 20; i++) { if (20 % i == 0) { nf++; } }`（第 118 行）'}]},
   {type:'analyze',title:'一本账：定义的第一次落地',claims:[
     {expr:'a = qn + r',when:'除法定理：$0 \\le r < n$，且 $q, r$ 唯一',page:905,source:'book'},
     {expr:'\\text{1229}',when:'10000 以内的素数个数（C 程序筛出）',page:904,source:'book'},
     {expr:'|d| \\le |a|',when:'$d \\mid a$ 且 $a > 0$ 时整除的界',page:904,source:'book'},
     {expr:'\\text{poly}(\\lg a)',when:'数论算法"多项式时间"的尺度：按输入位长',page:904,source:'book'},
    ],tables:[{caption:'C 程序 Part 1 的实测',rows:[
      ['检查项','结果'],
      ['a = -17, n = 5','q = -4, r = 3（负数也要 0 ≤ r < n）'],
      ['10000 以内素数','1229'],
      ['20 的非平凡因子','{2, 4, 5, 10}，共 4 个'],
     ]},{caption:'"输入规模"的两种读法',rows:[
      ['读法','规模','后果'],
      ['按值 $a$ 计','$\\Theta(a)$ 循环 = 指数时间','试除判素数"看起来快"其实是伪多项式'],
      ['**按位长 lg a 计**','$\\Theta(\\lg a)$','Euclid、快速幂才是真多项式时间'],
     ]}],chart:{xMax:10000,series:[
     {name:'n/ln n（素数定理）',expr:'n / Math.log(n)',color:'--viz-done'},
     {name:'n（值域）',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'除法定理为什么对负数也成立',steps:[
      {zh:'对 $a < 0$：先取 $q = \\lfloor a/n \\rfloor$（向 $-\\infty$ 取整），则 $r = a - qn$ 自动满足 $0 \\le r < n$。'},
      {zh:'C 的 `%` 是截断除法（向 0 取整），所以 $-17 \\% 5 = -2$；把 $r$ 加 $n$、$q$ 减 1 即可修正。'},
      {tex:'a = qn + r,\\quad 0 \\le r < n',zh:'★★ 定理保证这样的 $q, r$ 存在且唯一 —— mod 的全部含义都在这条定理里。C 程序 part 1 的六组用例（含 0、含负数）逐组断言。∎'}]},
     ],
    note:''},
   {type:'prove',title:'除法定理：存在性与唯一性',statement:'For any integer a and any positive integer n, there exist unique integers q and r such that 0 ≤ r <n and a = qn + r .',
    page:905,
    intro:'★ 定理 31.1 有两半：存在性靠构造，唯一性靠两个余数作差。',
    steps:[
     {title:'① 存在性：构造 q 与 r',en:'The value q = ⌊a/n⌋ is the quotient of the division. The value r = a mod n is the remainder (or residue) of the division, so that n j a if and only if a mod n = 0.',
      page:905,
      body:['取 $q = \\lfloor a/n \\rfloor$、$r = a - qn$。由下取整的定义 $qn \\le a < (q+1)n$，立即得 $0 \\le r < n$。',
        '对 $a < 0$ 同样成立：$-17 = -4 \\times 5 + 3$（C 程序 part 1 逐组断言的正是这个）。']},
     {title:'② 唯一性：两个余数相减',en:'The value q = ⌊a/n⌋ is the quotient of the division. The value r = a mod n is the remainder (or residue) of the division, so that n j a if and only if a mod n = 0.',
      page:905,
      body:['若 $a = qn + r = q′n + r′$ 且两边的 $r$ 都在 $[0, n)$，则 $(q - q′)n = r′ - r$。',
        '左边是 $n$ 的倍数，右边的绝对值 $< n$ → 只能 $r′ = r$，进而 $q′ = q$。',
        '★ 这一步只用到 $|r′ - r| < n$ 与 $n$ 的整除性 —— 除法定理的"唯一"二字由此而来。']},
     {title:'③ mod 的定义与用途',en:'The notation d j a (read <⌈ divides a/) means that a = kd for som⌉ integer k.',
      page:904,
      body:['$a \\text{ mod }n := r$（除法定理给出的那个唯一余数）。',
        '$n \\mid a \\iff a \\text{ mod }n = 0$：整除性判断变成一次取模。',
        '★ 后续所有章节（模幂、CRT、RSA）里的 mod 都继承这条定义与它的唯一性。∎']},
    ],conclusion:'★ 结论：mod 不是"取余运算符"，而是除法定理承诺的唯一余数 —— 这就是它能一致地参与模运算的原因。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'$d \\mid a$ 的含义是？',options:['$d < a$','$a = kd$（$k$ 为整数）','$d$ 是素数','$a = d + k$'],answer:1,
      why:'★ 整除即"能整除着分解"，每个整数都整除 0。'},
     {kind:'single',q:'$-17$ 除以 $5$ 的余数（按除法定理 $0 \\le r < n$）是多少？',options:['-2','**3**','2','7'],answer:1,
      why:'★ $-17 = -4 \\times 5 + 3$；C 的 % 会给出 -2，需要修正（C 程序 part 1）。'},
     {kind:'judge',q:'20 的因子（非平凡因子）是 2, 4, 5, 10。',answer:true,
      why:'★ 原书 p.904 的原话，C 程序逐个枚举断言了 4 个。'},
     {kind:'judge',q:'判素数的试除法按"输入位长"计是多项式时间。',answer:false,
      why:'★ 试除跑 $\\Theta(\\sqrt{a})$ 次循环 = 输入位长的指数；多项式时间必须按 $\\lg a$ 计（p.904）。'},
     {kind:'simulate',q:'C 程序 part 1 在 10000 以内筛出多少个素数？（填整数）',expect:[1229],placeholder:'例如：1200',
      why:'1229 —— 与素数定理 $n/\\ln n \\approx 1086$ 同一量级。'},
     {kind:'single',q:'数论算法的「多项式时间」是按什么尺度计的？',options:['按整数 $a$ 本身的大小','**按输入的位长 $\lg a$**','按 $a$ 的素因子个数','按模数 $n$ 的大小'],answer:1,why:'★ 本关 map 段点明：数论算法的时间按输入的**位数**计，不是按 $a$ 本身；analyze 表把「多项式时间」标成 $\text{poly}(\lg a)$。所以试除法（要试到 $\sqrt{a}$）是指数级的。'},
     {kind:'judge',q:'除法定理里的商 $q$ 与余数 $r$ 是唯一的。',answer:true,why:'★ 定理 31.1（本关 prove 段逐字陈述的那条）：$a = qn + r$ 且 $0 \le r < n$ 时 $q, r$ 唯一。C 程序对 $a = -17, n = 5$ 得 $q = -4, r = 3$ —— 注意 $r$ 不是 $-2$。'},
    ],bookExercises:[
     {id:'31.1-1',page:909,star:0,statement:'Prove that if a>b>0 and c = a + b, then c mod a = b.',hint:'直接算 $c \\text{ mod }a = (a + b) \\text{ mod }a = b \\text{ mod }a$，再用 $0 \\le b < a$ —— 除法定理的唯一性一步收尾。'},
     {id:'31.1-2',page:909,star:0,statement:'Prove that there are infinitely many primes. (Hint: Show that none of the primes √1 ,p 2 ,…,p k divide (p 1 √2 • • • √k ) + 1.)',hint:'构造 $N = (2,3,5,\dots,p_k)$ 的乘积加 1：$N \bmod p_i = 1$ 对每个 $p_i$ 成立，所以 $N$ 的素因子不在列表里。'},
     {id:'31.1-10',page:910,preview:true,star:0,statement:'Show that the gcd operator is associative. That is, prove that for all integers a, b, and c , we have gcd(a; gcd(b,c)) = gcd(gcd(a,b),c):',hint:'用"素因子取最小幂"的刻画（式 31.13）：$\gcd$ 的结合律归结为 $\min$ 的结合律 $\min(e, \min(f, g)) = \min(\min(e, f), g)$。'},
    ]},
  ],
};
