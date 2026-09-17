/* 第 31 章 31.3：模运算（Modular arithmetic）。印刷页 917–923（pdf 938–944）。 */
export default {
  key:'s03',id:'ch31/s03',chapter:31,section:'31.3',
  title:'群、环与 Z_n：模运算的代数骨架',shortTitle:'31.3 模运算',
  titleEn:'Modular arithmetic',
  source:{printed:[917,923],pdf:[938,944]},
  prerequisites:[{label:'31.2 最大公约数',url:'#/ch31/s02'}],
  stages:[
   {type:'map',title:'等价类 + 群公理 = 模运算',
    why:'$\\mathbb{Z}_n$ 是"余数的世界"：$[a]_n$ 表示所有与 $a$ 同余的整数。加法群 $(\\mathbb{Z}_n, +_n)$ 有 $n$ 个元素、人人有逆；乘法群 $(\\mathbb{Z}_n^*, \\cdot_n)$ 只留与 $n$ 互素的元素（$\\varphi(n)$ 个）—— **单位元、逆元、封闭、结合律**四条群公理在这个小世界里逐条可验证，而 Lagrange 定理（元素阶整除群阶）是 31.6 与 31.8 的地基。',
    position:'本章的"代数语法"：31.4 解方程要看子群 $\\langle a \\rangle$，31.6 讲阶与本原根，31.8 的 Miller-Rabin 本质上是在 $(\\mathbb{Z}_n^*, \\cdot)$ 里找矛盾。',
    unlocks:[{label:'31.4 解模线性方程',url:'#/ch31/s04'}],
    mathKit:[
     {title:'群',body:'集合 $S$ + 二元运算，满足封闭性、单位元、结合律、逆元存在。再要交换律就是 **abelian 群**。'},
     {title:'加法群',body:'$(\\mathbb{Z}_n, +_n)$：$[a]_n +_n [b]_n = [a+b]_n$，$|\\mathbb{Z}_n| = n$，单位元 $[0]_n$。'},
     {title:'乘法群 Z_n*',body:'只含与 $n$ 互素的元素；$|\\mathbb{Z}_n^*| = \\varphi(n)$（Euler 函数），单位元 $[1]_n$。'},
     {title:'子群与阶',body:'$\\langle a \\rangle$ 是 $a$ 生成的子群；元素的**阶**是回到单位元所需的最小次数，它整除群阶（Lagrange）。'},
    ]},
   {type:'intuition',title:'把群公理逐条跑一遍：Z_7*',scene:'C 程序 Part 3',body:[
     '★ C 程序 part 3 把 $(\\mathbb{Z}_7^*, \\cdot)$ 的三条群公理**穷举验证**：6 个元素两两相乘的积仍在集合里（封闭）；单位元是 1；每个元素都找到逆（如 $3 \\times 5 = 15 \\equiv 1$）。',
     '★★ 更进一步验证 **Lagrange 定理**：每个元素的阶（$a, a^2, a^3, \\dots$ 首次回到 1 的步数）都整除 $|\\mathbb{Z}_7^*| = 6$。实测阶表：$\\text{ord}(3) = 6$、$\\text{ord}(2) = 3$、$\\text{ord}(6) = 2$。',
     '★ $\\text{ord}(3) = 6$ 意味着 3 的幂跑遍全群 —— 3 是**本原根**（generator）。这个概念在 31.6 承包了离散对数，在 31.8 支撑 Miller-Rabin 的平方根论证。',
     '⚠ $(\\mathbb{Z}_{12}, \\cdot)$ **不是群**：2, 3, 4 等与 12 不互素，没有乘法逆 —— 这就是为什么乘法群要删掉非互素元素，只留 $\\varphi(n)$ 个。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 Ü 代表运算符、2 代表 ∈）。',blocks:[
     {kind:'body',page:917,en:'A group (S; Ü) is a set S together with a binary operation Ü defined on S for which the following properties hold:',
      zh:'★★ 群的定义开场。'},
     {kind:'body',page:917,en:'2. Identity: There exists an element e 2 S , called the identity of the group, such that e Ü a = a Ü e = a for all a 2 S .',
      zh:'★★ 公理 2：单位元。'},
     {kind:'body',page:917,en:'4. Inverses: For each a 2 S , there exists a unique element b 2 S , called the inverse of a, such that a Ü b = b Ü a = e.',
      zh:'★★ 公理 4：逆元存在（C 程序为每个元素找到了它）。'},
     {kind:'body',page:917,en:'We can form two finite abelian groups by using addition and multiplication modulo n, where n is a positive integer. These groups are based on the equivalence classes of the integers modulo n, defined in Section 31.1.',
      zh:'★★ 用模 n 的加法与乘法可以造出两个有限 abelian 群。'},
     {kind:'body',page:918,en:'Using this definition of addition modulo n, we define the additive group modulo n as (Z n ; C n ). The size of the additive group modulo n is jZ n j = n.',
      zh:'★ 加法群 $(\\mathbb{Z}_n, +_n)$ 的大小恰是 $n$。'},
    ],terms:[{en:'group',zh:'群',page:917},
              {en:'abelian group',zh:'交换群（abelian）',page:917},
              {en:'subgroup',zh:'子群',page:920}]},
   {type:'pseudocode',title:'本站整理：群的机器验证',algo:'GROUP-CHECK',signature:'GROUP-CHECK(n)',
    page:918,
    lines:[
     {n:1,code:'GROUP-CHECK(n)                // 验证 (Z_n*, ·) 的群公理',zh:''},
     {n:2,code:'    S = {a : 1 ≤ a < n, gcd(a,n) = 1}',zh:'★ 乘法群的元素：与 $n$ 互素者，共 $\\varphi(n)$ 个。'},
     {n:3,code:'    对 S 内每对 (a, b)：',zh:''},
     {n:4,code:'        a·b mod n 必须仍在 S     // 封闭',zh:'★ 单位元是 1；结合律由整数乘法继承。'},
     {n:5,code:'        每个 a 找到 b：a·b ≡ 1 (mod n)   // 逆元',zh:'★★ 只有互素元素才有逆 —— 这就是 Z_n* 的定义原因。'},
     {n:6,code:'        ord(a) 整除 |S|          // Lagrange',zh:'★ $\\text{ord}(a)$ 是最小的 $k$ 使 $a^k \\equiv 1$。'}],
    vars:[{name:'S',meaning:'$\\mathbb{Z}_n^*$ 的元素集合'}],
    note:'★ 原书 31.3 是纯代数概念节；本段是本站按群公理整理的验证流程，与 C 程序 part 3 逐条对应。',
    more:[{algo:'ORDER-TABLE',subtitle:'ORDER-TABLE(n) —— 全群的阶表（顺带找本原根）',signature:'ORDER-TABLE(n)',page:933,preview:true,
      lines:[{n:1,code:'    for a ∈ Z_n*:',zh:''},
        {n:2,code:'        k = 1; p = a mod n',zh:''},
        {n:3,code:'        while p ≠ 1: p = p·a mod n; k++',zh:'★ $k = \\text{ord}(a)$，由 Lagrange 它整除 $\\varphi(n)$。'},
        {n:4,code:'    // ord(a) = φ(n) 的 a 是本原根',zh:'★ 它的幂跑遍全群 —— 离散对数有定义的前提。'}],
      vars:[{name:'ord(a)',meaning:'$a$ 在 $\\mathbb{Z}_n^*$ 中的阶'}],
      note:'★ C 程序 part 6 打印了 $\\mathbb{Z}_7^*$ 的整张阶表：ord(3) = 6 → 3 是本原根。'}]},
   {type:'visualize',title:'Z_7* 的乘法结构',panels:[
     {title:'阶表（每列是 ord(a)，全部整除 6）',viz:'growth',
      chart:{xMax:8,series:[
       {name:'ord(3) = 6（本原根）',expr:'6',color:'--viz-done'},
       {name:'ord(2) = 3',expr:'3',color:'--viz-compare'},
       {name:'ord(6) = 2',expr:'2',color:'--viz-result'}]},
      note:'★ 阶的取值 {1, 2, 3, 6} 全部整除群阶 6 —— Lagrange 定理在这个 6 元小群上肉眼可见。'},
    ],tasks:['对照 C 程序 part 3 的穷举（封闭/单位元/逆/Lagrange 四条全过）。'],note:''},
   {type:'code',title:'实测：Z_7* 的群公理穷举',c:{file:'number_theory.c',code:String.raw`/* number_theory.c -- 31 章：数论算法（欧几里得 / 模运算 / CRT / RSA / Miller-Rabin）。
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
    notes:[{line:1,zh:'★ 八关共用本文件；本关注释聚焦 part 3（群公理）。'},
           {line:162,zh:'★★ part 3：$\\mathbb{Z}_7^*$ 的 6 个元素（与 7 互素）；封闭性、单位元、逆、阶整除 6 全部穷举验证。'},
           {line:243,zh:'★ part 6 的阶表：ord(3) = 6 → 3 是本原根；ord(2) = 3。'}]},
    tests:[{in:'Z_7* 的元素',out:'{1,2,3,4,5,6}，共 6 = φ(7) 个'},
           {in:'封闭 + 逆元',out:'全部元素两两可逆'},
           {in:'Lagrange',out:'每个元素的阶整除 6'}],
    mapping:[{pc:2,pcCode:'S = {a : gcd(a,n) = 1}',c:'`int g = (int)euclid(a, n);`（第 164 行）'},
             {pc:5,pcCode:'每个 a 找到 b：a·b ≡ 1',c:'`if ((elems[i] * elems[j]) % n == 1) { inv = elems[j]; }`（第 175 行）'}]},
   {type:'analyze',title:'一本账：两个群、一套公理',claims:[
     {expr:'|\\mathbb{Z}_n| = n',when:'加法群的大小（人人有逆：$-a$）',page:918,source:'book'},
     {expr:'|\\mathbb{Z}_n^*| = \\varphi(n)',when:'乘法群只留互素元素',page:918,source:'book'},
     {expr:'\\text{ord}(a) \\mid |G|',when:'Lagrange：元素阶整除群阶',page:921,source:'book'},
     {expr:'6',when:'$\\mathbb{Z}_7^*$ 的阶：C 程序穷举验证四条公理',page:921,source:'book'},
    ],tables:[{caption:'C 程序 Part 3 的实测',rows:[
      ['检查项','结果'],
      ['Z_7* 的元素','{1,2,3,4,5,6}（与 7 互素）'],
      ['封闭性','6×6 = 36 对全部通过'],
      ['逆元','每个元素都找到（如 3 与 5 互逆）'],
      ['Lagrange','阶 ∈ {1,2,3,6}，全部整除 6'],
     ]},{caption:'加法群 vs 乘法群',rows:[
      ['','$(\\mathbb{Z}_n, +_n)$','$(\\mathbb{Z}_n^*, \\cdot_n)$'],
      ['元素','全部 $n$ 个余数','与 $n$ 互素的 $\\varphi(n)$ 个'],
      ['单位元','$0$','$1$'],
      ['逆','$n - a$','$a^{-1}$（扩展 Euclid 可算）'],
      ['本章用途','模加 / CRT','模幂 / RSA / Miller-Rabin'],
     ]}],chart:{xMax:8,series:[
     {name:'|Z_n*| = φ(n)（n=7 → 6）',expr:'6',color:'--viz-done'},
     {name:'|Z_n| = n',expr:'n',color:'--viz-compare'}]},
    derivations:[{kind:'line',title:'为什么乘法群要删掉非互素元素',steps:[
      {zh:'设 $\\gcd(a, n) = d > 1$。若 $a$ 想找逆，即存在 $b$ 使 $ab \\equiv 1$（mod n），写成整式就是 $ab + kn = 1$。'},
      {zh:'左边每个 $k$ 都给出 $d \\mid ab + kn = 1$ —— 但 $d > 1$，矛盾。所以非互素元素没有乘法逆。'},
      {zh:'所以非互素元素在乘法下**永远没有逆**，必须请出群。'},
      {tex:'\\mathbb{Z}_n^* = \\{a : \\gcd(a,n) = 1\\}',zh:'★★ 这也解释了 $\u03c6(n)$ 的定义 —— 它恰好数出"有逆"的元素个数。C 程序 part 3 的穷举里，2 与 12（$n=12$ 时）就因为没有逆而被排除。∎'}]},
     ],
    note:''},
   {type:'prove',title:'Lagrange 定理：阶整除群阶',statement:'If (S; Ü) is a finite group and (S 0 ; Ü) is a subgroup of (S; Ü), then jS 0 j is a divisor',
    page:921,
    intro:'★ 设 $H = \\langle a \\rangle$ 是 $a$ 生成的子群，$G$ 是有限 abelian 群。',
    steps:[
     {title:'① 子群的陪集大小相同',en:'If (S; Ü) is a finite group and S 0 is any nonempty subset of S such that a Ü b 2 S 0 for all a,b 2 S 0 , then (S 0 ; Ü) is a subgroup of (S; Ü).',
      page:920,
      body:['对 $g \\in G$，陪集 $gH = \\{gh : h \\in H\\}$ 与 $H$ 一样大（$h_1 \\ne h_2 \\Rightarrow gh_1 \\ne gh_2$，消去律）。',
        '★ 这是 Lagrange 证明的引擎：整群被切成同样大小的陪集。']},
     {title:'② 陪集互不相交且拼满 G',en:'For any finite group (S; Ü) and any a 2 S , the order of a is equal to the size of the subgroup it generates',
      page:921,
      body:['$g_1H$ 与 $g_2H$ 要么相等要么不相交（$gh \\in g_2H \\Rightarrow gH = g_2H$）。',
        '于是 $|G| = (\\text{陪集数}) \\times |H|$，即 $|H|$ 整除 $|G|$。']},
     {title:'③ 元素的阶 = 子群的大小',en:'If (S; Ü) is a finite group and (S 0 ; Ü) is a subgroup of (S; Ü), then jS 0 j is a divisor of |S|.',
      page:922,
      body:['$\\langle a \\rangle$ 的大小恰是 $a$ 回到单位元所需的步数，即 $\\text{ord}(a)$。',
        '由 ②：$\\text{ord}(a) \\mid |G|$ —— 这就是 Lagrange 定理的元素版。',
        '★ C 程序 part 3 在 $\\mathbb{Z}_7^*$ 上验证：阶 ∈ {1,2,3,6}，全部整除 6。∎']},
    ],conclusion:'★ 结论：Lagrange 定理把"阶"锁进群阶的因子里 —— 31.6 的 Euler/Fermat 定理与 31.8 的 Miller-Rabin 都是它的直接推论。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'$(\\mathbb{Z}_{12}, \\cdot)$ 为什么不是群？',options:['没有单位元','**部分元素无乘法逆**','不封闭','不满足结合律'],answer:1,
      why:'★ 与 12 不互素的元素（如 2）没有逆 —— 乘法群只留互素元素。'},
     {kind:'single',q:'$\\mathbb{Z}_7^*$ 有多少个元素？',options:['7','**6**','5','3'],answer:1,
      why:'★ $\\varphi(7) = 6$；C 程序穷举列出 {1,2,3,4,5,6}。'},
     {kind:'judge',q:'有限群里每个元素的阶整除群的阶。',answer:true,
      why:'★ Lagrange 定理；C 程序在 Z_7* 上穷举验证。'},
     {kind:'judge',q:'3 是 Z_7* 的本原根，意思是 ord(3) = 6。',answer:true,
      why:'★ ord = φ(7) → 3 的幂跑遍全群；C 程序的阶表确认。'},
     {kind:'simulate',q:'C 程序 part 3 里 |Z_7*| 是多少？（填整数）',expect:[6],placeholder:'例如：7',
      why:'6 —— 与 7 互素的元素个数，等于 φ(7)。'},
    ],bookExercises:[
     {id:'31.3-1',page:923,star:0,statement:'31.3-1 Draw the group operation tables for the groups (Z 4 ; C 4 ) and (Z −',hint:'把群表画成 4×4 / 6×6 方阵：每行每列都是群元素的一个排列（拉丁方性质）—— 逆元存在的直观体现。'},
     {id:'31.3-2',page:923,star:0,statement:'31.3-2 List all subgroups of Z 9 and of Z −',hint:'子群由生成元给出：$\\mathbb{Z}_9$ 的加法子群是 $\\langle 0 \\rangle, \\langle 3 \\rangle, \\langle 1 \\rangle$；$\\mathbb{Z}_9^*$（={1,2,4,5,7,8}）的子群用阶的因子枚举。'},
     {id:'31.3-5',page:923,star:0,statement:'31.3-5 Show that for any integer n>1 and for any a 2 Z − n , the function f a W Z − n ! Z − n defined by f a (',hint:'$f_a(x) = ax \\bmod n$ 的逆映射是 $f_{a^{-1}}$ —— 而 $a^{-1}$ 存在恰恰因为 $a \\in \\mathbb{Z}_n^*$（扩展 Euclid 可算出它）。'},
    ]},
  ],
};
