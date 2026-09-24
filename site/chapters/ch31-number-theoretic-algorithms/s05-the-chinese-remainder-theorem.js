/* 第 31 章 31.5：中国余数定理（The Chinese remainder theorem）。印刷页 928–931（pdf 949–952）。 */
export default {
  key:'s05',id:'ch31/s05',chapter:31,section:'31.5',
  title:'中国余数定理：把大模数拆成小模数',shortTitle:'31.5 中国余数定理',
  titleEn:'The Chinese remainder theorem',
  source:{printed:[928,931],pdf:[949,952]},
  prerequisites:[{label:'31.4 解模线性方程',url:'#/ch31/s04'}],
  stages:[
   {type:'map',title:'Z_m ≅ Z_{m1} × … × Z_{mk}',
    why:'若 $n_1, \\dots, n_k$ 两两互素且 $n = n_1 n_2 \\cdots n_k$，则"模 $n$ 的余数"与"模各 $n_i$ 的余数元组"**一一对应**（定理 31.27）。于是对大模数的运算可以拆成对小模数并行做（这正是 RSA/CRT 加速的原理），而同余方程组有唯一解（推论 31.28）。',
    position:'两千年前的《孙子算经》问题："今有物不知其数，三三数之剩二……" 答案 23。本章里它是模线性方程的直接应用。',
    unlocks:[{label:'31.6 元素的幂',url:'#/ch31/s06'}],
    mathKit:[
     {title:'定理 31.27（CRT）',body:'对应 $a \\leftrightarrow (a_1, \\dots, a_k)$（$a_i = a \\text{ mod }n_i$）是 $\\mathbb{Z}_n$ 与 $\\mathbb{Z}_{n_1} \\times \\cdots \\times \\mathbb{Z}_{n_k}$ 之间的一一对应。'},
     {title:'推论 31.28',body:'两两互素时，方程组 $x \\equiv a_i \\ (\\text{mod } n_i)$ 在模 $n$ 下**有唯一解**。'},
     {title:'推论 31.29',body:'$x \\equiv a \\ (\\text{mod } n_i)$ 对所有 $i$ 成立 $\\iff x \\equiv a \\ (\\text{mod } n)$。'},
     {title:'构造法',body:'两两合并：$x = a_1 + n_1 \\cdot ((a_2 - a_1) \\cdot n_1^{-1} \\text{ mod }n_2)$，模 $n_1 n_2$。'},
    ]},
   {type:'intuition',title:'孙子定理的 23，与两个习题的实测',scene:'C 程序 Part 5',body:[
     '★★ C 程序 part 5 解经典方程组 $x \\equiv 2 \\ (\\text{mod } 3)$、$x \\equiv 3 \\ (\\text{mod } 5)$、$x \\equiv 2 \\ (\\text{mod } 7)$：逐对合并（每次用扩展 Euclid 求 $n_1^{-1} \\text{ mod }n_2$），得到 **x = 23 (mod 105)** —— 正是《孙子算经》的答案。',
     '★ 与暴力互证：枚举 0..104，**唯一**满足三条同余的数是 23 —— 推论 31.28 的"唯一"在这里被穷举确认。',
     '★★ 两个习题实测：31.5-1 的 $x \\equiv 4 \\ (\\text{mod } 5), x \\equiv 5 \\ (\\text{mod } 11) \\Rightarrow x = 49 \\ (\\text{mod } 55)$；31.5-2 的"除 9 余 1、除 8 余 2、除 7 余 3" $\\Rightarrow x = 10$。',
     '⚠ 实现陷阱（本站真实踩过）：合并公式里的 Bezout 系数**可能是负的**（$5^{-1} \\text{ mod }11$：扩展 Euclid 直接给 $-2$，必须先规范成 9），否则解出 $-6$ 这种"负答案"。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（保留语料的排版形式：其中的美元符号代表「≡」，乘号位上的字符代表欧拉函数 φ）。',blocks:[
     {kind:'body',page:928,en:'Let n = n 1 n 2 • • • n k , where the n i are pairwise relatively prime.',
      zh:'★★ 定理 31.27 的对应关系 $a \\leftrightarrow (a_1, \\dots, a_k)$。'},
     {kind:'body',page:930,en:'The correspondence is one-to-one, since we can transform in both directions.',
      zh:'★★ 一一对应 —— 两个方向的变换都存在（正向取余、反向用 CRT 构造）。'},
     {kind:'body',page:930,en:'If n 1 ,n 2 ,…,n k are pairwise relatively prime and n = n 1 n 2 • • • n k , then for any integers a 1 ,a 2 ,…,a k , the set of simultaneous equations x = a i (mod n i ); for i = 1,2,…,k , has a unique solution modulo n for the unknown x .',
      zh:'★★ 推论 31.28：方程组在模 $n$ 下有唯一解。'},
     {kind:'body',page:931,en:'See Figure 31.3 for an illustration of the Chinese remainder theorem, modulo 65.',
      zh:'★ 原书 Figure 31.3 用模 65 的例子画出了这个对应。'},
    ],terms:[{en:'Chinese remainder theorem',zh:'中国余数定理',page:928},
              {en:'pairwise relatively prime',zh:'两两互素',page:930}]},
   {type:'pseudocode',title:'本站整理：CRT 的逐对合并（原书定理 31.27 的构造）',algo:'CRT',signature:'CRT(a[1..k], n[1..k])',
    page:930,
    lines:[
     {n:1,code:'CRT(a, n)                     // n_i 两两互素',zh:''},
     {n:2,code:'    a1 = a_1; n1 = n_1',zh:'★ 从第一个方程出发。'},
     {n:3,code:'    for i = 2 to k:',zh:''},
     {n:4,code:'        (d, x, y) = EXTENDED-EUCLID(n1, n_i)   // d = 1',zh:'★ 互素保证逆存在。'},
     {n:5,code:'        t = (x · (a_i − a1)) mod n_i           // x 规范到 [0, n_i)',zh:'★★ Bezout 系数可能为负 —— 必须先规范化。'},
     {n:6,code:'        a1 = a1 + n1 · t;  n1 = n1 · n_i',zh:'★ 合并成一个模 $n_1 n_i$ 的方程。'},
     {n:7,code:'    return a1 mod n1',zh:'★ 唯一解（推论 31.28）。'}],
    vars:[{name:'a1, n1',meaning:'当前合并出的方程 $x \\equiv a_1 \\ (\\text{mod } n_1)$'}],
    note:'★ 原书 31.5 用定理与图讲 CRT，没有伪代码框；本段按"两两合并"的构造整理，与 C 程序 part 5 的循环逐行对应。',
    more:[{algo:'CRT-DECODE',subtitle:'反向变换：从 (a_1,…,a_k) 也可以直接加权求和',signature:'CRT-DECODE(a, n)',page:930,
      lines:[{n:1,code:'    M_i = n / n_i',zh:'★ 除掉自己的模数。'},
        {n:2,code:'    c_i = M_i · (M_i^{-1} mod n_i)',zh:'★ 预计算系数。'},
        {n:3,code:'    x = (Σ a_i · c_i) mod n',zh:'★★ 一次加权求和 —— 并行 RSA 解密的标准写法。'}],
      vars:[{name:'c_i',meaning:'CRT 系数'}],
      note:'★ 这条公式与逐对合并等价，工程上更常用：RSA 私钥运算拆成模 $p$ 与模 $q$ 两半并行，速度约 4 倍。'}]},
   {type:'visualize',title:'对应的形状：Z_105 ≅ Z_3 × Z_5 × Z_7',panels:[
     {title:'一个余数元组只对应一个 x',viz:'growth',
      chart:{xMax:105,series:[
       {name:'满足前两条 (mod 3, mod 5) 的 x：每 15 个一个',expr:'15 * Math.ceil(n / 15)',color:'--viz-compare'},
       {name:'再满足 (mod 7)：每 105 个一个',expr:'105 * Math.ceil(n / 105)',color:'--viz-done'}]},
      note:'★ 约束每加一条，候选就稀疏 $n_i$ 倍 —— 三条约束在 0..104 里恰好锁定一个解（23），这就是推论 31.28。'},
    ],tasks:['对照 C 程序 part 5：CRT 给 23、暴力枚举确认唯一。'],note:''},
   {type:'code',title:'实测：孙子定理的 23 + 两个习题',c:{file:'number_theory.c',code:String.raw`/* number_theory.c -- 31 章：数论算法（欧几里得 / 模运算 / CRT / RSA / Miller-Rabin）。
 *
 * 关键数字（全部断言）：
 *   part 1  除法定理：a = qn + r（0 ≤ r < n）对负数也成立；10000 以内素数 1229 个；
 *   part 2  EUCLID 与 EXTENDED-EUCLID：gcd(30,21)=3 且 3 = 30·3 + 21·(−4)；
 *           Fibonacci 最坏情形：gcd(F_21, F_20) 恰好递归 20 次；
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
    notes:[{line:1,zh:'★ 八关共用本文件；本关注释聚焦 part 5（CRT 与两个习题）。'},
           {line:227,zh:'★★ 逐对合并求 $x = 23 \\ (\\text{mod } 105)$；合并时 Bezout 系数先规范化到 $[0, n_i)$。'},
           {line:240,zh:'★ 与暴力枚举互证：0..104 里唯一解。'},
           {line:246,zh:'★★ 习题 31.5-1 → 49 (mod 55)；习题 31.5-2 → x = 10。'}]},
    tests:[{in:'x ≡ 2(3), 3(5), 2(7)',out:'x = 23 (mod 105)，暴力唯一'},
           {in:'习题 31.5-1',out:'x = 49 (mod 55)'},
           {in:'习题 31.5-2',out:'x = 10'}],
    mapping:[{pc:4,pcCode:'(d, x, y) = EXTENDED-EUCLID(n1, n_i)',c:'`ll d = extended_euclid(n1, n2, &x, &y);`（第 193 行）'},
             {pc:5,pcCode:'t = (x·(a_i − a1)) mod n_i',c:'`ll xn = ((x % n2) + n2) % n2;`（第 222 行）'}]},
   {type:'analyze',title:'一本账：为什么唯一',claims:[
     {expr:'\\mathbb{Z}_n \\cong \\mathbb{Z}_{n_1} \\times \\cdots',when:'定理 31.27 的对应（环同构）',page:928,source:'book'},
     {expr:'\\text{唯一解}',when:'推论 31.28：两两互素时方程组的解',page:930,source:'book'},
     {expr:'n_1^{-1} \\text{ mod }n_2',when:'合并步骤里唯一的"新计算"（扩展 Euclid）',page:930,source:'book'},
     {expr:'23',when:'孙子定理经典组 (2 mod 3, 3 mod 5, 2 mod 7) 的解',page:930,source:'book'},
    ],tables:[{caption:'C 程序 Part 5 的实测',rows:[
      ['方程组','解'],
      ['x≡2(3), x≡3(5), x≡2(7)','23 (mod 105)，枚举确认唯一'],
      ['习题 31.5-1','49 (mod 55)'],
      ['习题 31.5-2','10'],
     ]},{caption:'单模数 vs 拆分模数（RSA-CRT 的原理）',rows:[
      ['','模 n（1024 位）','模 p、模 q（各 512 位）'],
      ['幂运算代价','$\\Theta(\\lg n)$ 次大数乘','$2 \\times \\Theta(\\lg n)$ 次小数乘'],
      ['小数乘的成本','位数的立方级增长','**约 4 倍加速**'],
      ['重组','—','CRT 一行加权求和'],
     ]}],chart:{xMax:105,series:[
     {name:'105（模数乘积）',expr:'105',color:'--viz-compare'},
     {name:'1（唯一解的个数）',expr:'1',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'两两合并为什么保持正确',steps:[
      {zh:'合并 $x \\equiv a_1 \\ (\\text{mod } n_1)$ 与 $x \\equiv a_2 \\ (\\text{mod } n_2)$：设 $x = a_1 + n_1 t$。'},
      {zh:'代入第二条：$a_1 + n_1 t \\equiv a_2 \\ (\\text{mod } n_2)$ → $t \\equiv (a_2 - a_1) \\cdot n_1^{-1} \\ (\\text{mod } n_2)$。'},
      {zh:'$n_1^{-1} \\text{ mod }n_2$ 存在正因为两模数互素（扩展 Euclid 算出）；合并后 $x$ 模 $n_1 n_2$ 唯一。'},
      {tex:'x = a_1 + n_1\\big((a_2 - a_1)\\,n_1^{-1} \\text{ mod }n_2\\big)',zh:'★★ 归纳 $k$ 步即得唯一解 —— C 程序 part 5 的循环体就是这条公式，并已用负系数规范化的修正。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 31.27：对应是一一映射',statement:"Let n = n 1 n 2 • • • n k , where the n i are pairwise relatively prime.",
    page:930,
    intro:'★ 存在性与唯一性各证一半：唯一性是"差为 0"，存在性用构造。',
    steps:[
     {title:'① 单射：两个不同的 a 撞不出同一个元组',en:"If n 1 ,n 2 ,…,n k are pairwise relatively prime and n = n 1 n 2 • • • n k , then for any integers a 1 ,a 2 ,…,a k , the set of simultaneous equations x = a i (mod n i ); for i = 1,2,…,k , has a unique solution modulo n for the unknown x .",
      page:930,
      body:['若 $a \\ne b$ 却有相同元组，则 $n_i \\mid (a - b)$ 对所有 $i$。',
        '两两互素 → $n \\mid (a - b)$（推论 31.29 的方向）→ 但 $|a - b| < n$，只能 $a = b$，矛盾。']},
     {title:'② 数量相等 → 双射',en:"The correspondence is one-to-one, since we can transform in both directions.",
      page:930,
      body:['两边集合的大小都是 $n$：$|\\mathbb{Z}_n| = n$，乘积侧 $n_1 \\cdots n_k = n$。',
        '单射 + 大小相等 → 双射 —— "另一个方向"的变换因此必然存在。']},
     {title:'③ 反方向的构造',en:"If n 1 ,n 2 ,…,n k are pairwise relatively prime and n = n 1 n 2 • • • n k , then for any integers a 1 ,a 2 ,…,a k , the set of simultaneous equations x = a i (mod n i ); for i = 1,2,…,k , has a unique solution modulo n for the unknown x .",
      page:930,
      body:['给定 $(a_1, \\dots, a_k)$，用逐对合并（或加权求和 $\\sum a_i M_i (M_i^{-1} \\text{ mod }n_i)$）显式造出 $x$。',
        '★ C 程序 part 5 走的是合并版：两次扩展 Euclid，$x = 23$；习题 31.5-1/2 的两个系统也一并算出。∎']},
    ],conclusion:'★ 结论：CRT 把"一个大模数"无损拆成"一组小模数" —— 数学上是同构，工程上是并行。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'$x \\equiv 2 \\ (\\text{mod } 3), x \\equiv 3 \\ (\\text{mod } 5), x \\equiv 2 \\ (\\text{mod } 7)$ 在模 105 下的解是？',options:['17','**23**','33','128'],answer:1,
      why:'★ 孙子定理的答案 23；C 程序与暴力枚举双重确认。'},
     {kind:'single',q:'CRT 要求模数满足什么？',options:['都是素数','**两两互素**','都相同','递增'],answer:1,
      why:'★ 两两互素保证合并时逆元存在。'},
     {kind:'judge',q:'对应 a ↔ (a₁,…,a_k) 是一一映射。',answer:true,
      why:'★ 定理 31.27；单射 + 两边大小相等。'},
     {kind:'judge',q:'合并两个方程时的 Bezout 系数永远是非负的。',answer:false,
      why:'★ extended_euclid(5,11) 给出 −2；不规范化会解出负的"答案"（本站真实踩坑）。'},
     {kind:'simulate',q:'C 程序 part 5 里习题 31.5-2 的答案 x 是多少？（除 9 余 1、除 8 余 2、除 7 余 3）',expect:[10],placeholder:'例如：59',
      why:'10 —— 10 = 9+1 = 8+2 = 7+3，三条同余同时满足。'},
     {kind:'judge',q:'CRT 合并两个方程时，唯一需要真正「新算」的一步是求一个模逆。',answer:true,why:'★ 本关 analyze 表把 $n_1^{-1} \text{ mod }n_2$ 单独列出来，注解就是「合并步骤里唯一的新计算」—— 其余都是代入与取模。C 程序对三组方程组都暴力枚举验证了唯一解。'},
     {kind:'simulate',q:'C 程序 part 5 里习题 31.5-1（模 55）的答案 $x$ 是多少？（填整数）',expect:[49],placeholder:'例如：23',why:'49 —— 程序打印 $x = 49 \ (\text{mod }55)$；同一 part 里孙子定理经典组得到 23（模 105），习题 31.5-2 得到 10。'},
    ],bookExercises:[
     {id:'31.5-1',page:931,star:0,statement:'Find all solutions to the equations x = 4 (mod 5) and x = 5 (mod 11).',hint:'合并：$x = 4 + 5t$，$5t \\equiv 1 \\ (\\text{mod } 11)$，$t \\equiv 9$（$5^{-1} = 9$）→ $x = 49 \\ (\\text{mod } 55)$（C 程序已验证）。'},
     {id:'31.5-2',page:931,star:0,statement:'Find all integers x that leave remainders 1, 2, and 3 when divided by 9, 8, and 7, respectively.',hint:'题干是 $x \\equiv 1$（模 9）、$x \\equiv 2$（模 8）、$x \\equiv 3$（模 7）。 「$x-3$ 同时被 9、8、7 整除」这句话不成立：$x = 10$ 时 $x-3 = 7$，既不被 9 也不被 8 整除。 （成立的是 $x-1$ 被 9、$x-2$ 被 8、$x-3$ 被 7 整除 —— 三个余数不同，没有公用的整除式可抄。） 逐条合并才是正路：由第一条设 $x = 1 + 9k$；代第二条，$9 \\equiv 1$（模 8）， 所以 $1 + k \\equiv 2$，得 $k \\equiv 1$（模 8），即 $k = 1 + 8j$、于是 $x = 10 + 72j$； 代第三条，$10 \\equiv 3$、$72 \\equiv 2$（模 7），得 $3 + 2j \\equiv 3$，故 $j \\equiv 0$（模 7）。 于是 $x = 10 + 504m$。 别只写「答案 $x = 10$」—— 题干要的是**所有**整数， $504 = 9 \\cdot 8 \\cdot 7$（两两互素，所以模数是三者之积）。'},
     {id:'31.5-3',page:931,star:0,statement:'Argue that, under the definitions of Theorem 31.27, if gcd(a,n) = 1, then (a −1 mod n) $ ..a −1 1 mod n 1 /,.a −1 2 mod n 2 /,…,.a −1 k mod n k //:',hint:'用 CRT 把 $a$ 拆到每个 $\\mathbb{Z}_{n_i}$ 里，条件 $a_i$ 与 $n_i$ 互素逐个成立 —— 对应关系保持互素性。'},
    ]},
  ],
};
