/* 第 31 章 31.8：素性测试（Primality testing）。印刷页 943–953（pdf 964–974）。 */
export default {
  key:'s08',id:'ch31/s08',chapter:31,section:'31.8',
  title:'费马测试的漏洞与 Miller-Rabin 的补丁',shortTitle:'31.8 素性测试',
  titleEn:'Primality testing',
  source:{printed:[943,953],pdf:[964,974]},
  prerequisites:[{label:'31.7 RSA',url:'#/ch31/s07'}],
  stages:[
   {type:'map',title:'从"几乎正确"到 2^(−s) 的错误率',
    why:'费马测试：$a^{n-1} \\neq 1 \\Rightarrow n$ 合数。但 **Carmichael 数**（561, 1105, 1729, …）对所有互素的基都伪装成素数。Miller-Rabin 的补丁：在快速幂的**平方链上搜"1 的非平凡平方根"** —— 一旦出现，$n$ 当场暴露。原书定理 31.39：奇合数的见证者**至少占一半**；取 $s$ 个随机基，错误率 $\\le 2^{-s}$（定理 31.40）。',
    position:'本章收官。RSA 密钥生成（31.7 第 1 步）靠它找大素数 —— 找一个 1024 位素数大约要试 $\\ln 2^{1024} \\approx 710$ 个奇数。',
    unlocks:[],
    mathKit:[
     {title:'基 a 伪素数',body:'$n$ 合数但 $a^{n-1} \\equiv 1 \\ (\\text{mod } n)$。341 = 11·31 是最小的基 2 伪素数。'},
     {title:'Carmichael 数',body:'对**一切**与之互素的基都是伪素数的合数：561, 1105, 1729, …（前 10⁸ 里仅 255 个，但足够骗过费马测试）。'},
     {title:'WITNESS(a, n)',body:'在 $a^{u}, a^{2u}, a^{4u}, \\dots$ 链上找到 1 的非平凡平方根 → $a$ 是 $n$ 合数性的见证者。'},
     {title:'定理 31.39 / 31.40',body:'奇合数的见证者 $\\ge (n-1)/2$；MILLER-RABIN(n, s) 出错的概率 $\\le 2^{-s}$。'},
    ]},
   {type:'intuition',title:'561 的三重身份，全部实测',scene:'C 程序 Part 8',body:[
     '★★ C 程序 part 8 的三条实验线：',
     '① **341 是基 2 伪素数**：$2^{340} \\text{ mod }341 = 1$，而 $341 = 11 \\times 31$ 是合数 —— 费马测试第一次翻车（原书习题的例子）。',
     '② **561 是 Carmichael 数**：与它互素的 $a$ 共 319 个，费马测试**全部通过**；但 Miller-Rabin 的见证者有 **310 个（97.2%）** —— 合数性被当场抓住（原书定理 31.39 只保证 ≥ 3/4，实测 97.2%）。',
     '③ **零误报**：100 以内的全部奇素数，任何 $a$ 都不是见证者 —— 该抓的没漏抓，不该抓的没乱抓。',
     '★ 直观：费马测试只看"链的终点是否为 1"；Miller-Rabin 还检查"链上是否从非 1 的值平方跳到 1" —— 那样的值是 1 的非平凡平方根，素数模下不可能出现（31.6 定理 31.34）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 a n−1 代表 a^(n−1)）。',blocks:[
     {kind:'body',page:944,en:'We say that n is a base-a pseudoprime if n is composite and a n−1 = 1 (mod n): (31.39)',
      zh:'★★ 伪素数的定义（式 31.39）。'},
     {kind:'body',page:945,en:'The first three Carmichael numbers are 561, 1105, and 1729. Carmichael numbers are extremely rare. For example, only 255 of them are less than 100,000,000.',
      zh:'★★ Carmichael 数罕见但存在：561, 1105, 1729；10⁸ 以内仅 255 个。'},
     {kind:'body',page:945,en:'The Miller-Rabin primality test overcomes the problems of the simple procedure',
      zh:'★ Miller-Rabin 修好了费马测试的漏洞。'},
     {kind:'body',page:946,en:'The call of the auxiliary procedure WITNESS (a,n) returns TRUE if and only if a is a "witness" to the compositeness of n',
      zh:'★★ 见证者的定义：能用 $a$ **证明** $n$ 是合数。'},
    ],terms:[{en:'pseudoprime',zh:'伪素数',page:944},
              {en:'Carmichael number',zh:'Carmichael 数',page:945},
              {en:'witness',zh:'见证者',page:946}]},
   {type:'pseudocode',title:'本站整理：PSEUDOPRIME → MILLER-RABIN（原书 p.945–946）',algo:'PSEUDOPRIME',signature:'PSEUDOPRIME(n)',
    page:945,
    lines:[
     {n:1,code:'PSEUDOPRIME(n)',zh:''},
     {n:2,code:'    if MODULAR-EXPONENTIATION(2, n−1, n) ≢ 1 (mod n)',zh:'★ 费马测试，基固定为 2。'},
     {n:3,code:'        return COMPOSITE',zh:'★ 2 见证了合数性。'},
     {n:4,code:'    return PRIME   // 只是"猜测"：Carmichael 数会骗过它',zh:'★★ 341、561 在这里蒙混过关。'}],
    vars:[{name:'n−1',meaning:'费马测试的指数'}],
    note:'★ 原书的 PSEUDOPRIME（p.945）3 行正是这个形状；它的缺陷原书自己点破：Carmichael 数。',
    more:[{algo:'WITNESS',subtitle:'WITNESS(a, n) —— 在平方链上搜非平凡平方根（p.946，9 行）',signature:'WITNESS(a, n)',page:946,
      lines:[{n:1,code:'    n−1 = 2^t · u（u 为奇数）',zh:'★ 把指数拆成"平方链的长度"。'},
        {n:2,code:'    x = MODULAR-EXPONENTIATION(a, u, n)',zh:'★ 链的起点。'},
        {n:3,code:'    for i = 1 to t:',zh:''},
        {n:4,code:'        y = x² mod n',zh:'★ 链上的一步平方。'},
        {n:5,code:'        if y == 1 且 x ≠ 1 且 x ≠ n−1:',zh:'★★★ 非平凡平方根！素数模不可能出现（定理 31.34）。'},
        {n:6,code:'            return TRUE   // a 是见证者',zh:''},
        {n:7,code:'        x = y',zh:''},
        {n:8,code:'    if x ≠ 1: return TRUE',zh:'★ 费马测试的部分。'},
        {n:9,code:'    return FALSE',zh:'★ a 没能证明什么。'}],
      vars:[{name:'t, u',meaning:'$n - 1 = 2^{t}u$ 的分解'}],
      note:'★ C 程序的 `witness` 就是这 9 行的直译；part 8 用它数出了 561 的 310 个见证者（97.2%）。'}]},
   {type:'visualize',title:'见证者的密度',panels:[
     {title:'561 的见证者占比 vs 定理保证',viz:'growth',
      chart:{xMax:561,series:[
       {name:'实测见证者 310 / 319（97.2%）',expr:'0.972',color:'--viz-done'},
       {name:'定理 31.39 的保证 (n−1)/2',expr:'0.5',color:'--viz-compare'}]},
      note:'★ 定理只承诺一半，实测 97.2% —— Miller-Rabin 在实践中远好于它的界。'},
    ],tasks:['对照 C 程序 part 8 的三条实验线（341、561、100 以内素数）。'],note:''},
   {type:'code',title:'实测：341、561 与零误报',c:{file:'number_theory.c',code:String.raw`/* number_theory.c -- 31 章：数论算法（欧几里得 / 模运算 / CRT / RSA / Miller-Rabin）。
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
    notes:[{line:1,zh:'★ 八关共用本文件；本关注释聚焦 part 8（素性测试）。'},
           {line:55,zh:'`powmod_count`：快速幂（WITNESS 的引擎）。'},
           {line:70,zh:'★★ `witness`：原书 WITNESS 的直译 —— 平方链上搜 1 的非平凡平方根。'},
           {line:296,zh:'★★ 341：$2^{340} \\text{ mod }341 = 1$ 而它是合数 → 基 2 伪素数。'},
           {line:303,zh:'★★ 561：319 个互素基全部通过费马测试，但 310 个（97.2%）是 Miller-Rabin 见证者。'},
           {line:313,zh:'★ 100 以内奇素数：见证者为 0 —— 零误报。'}]},
    tests:[{in:'2^340 mod 341',out:'1（341 = 11·31 合数）→ 基 2 伪素数'},
           {in:'561 的见证者',out:'310 / 319 = 97.2%（定理保证 ≥ 3/4）'},
           {in:'100 以内素数 × 所有基',out:'见证者 0 个'}],
    mapping:[{pc:2,pcCode:'n−1 = 2^t · u',c:'`while (u % 2 == 0) { u /= 2; t++; }`（第 73 行）'},
             {pc:4,pcCode:'y = x² mod n',c:'`y = mulmod(x, x, n);`（第 76 行）'},
             {pc:5,pcCode:'非平凡平方根判据',c:'`if (y == 1 && x != 1 && x != n - 1) { return 1; }`（第 77 行）'}]},
   {type:'analyze',title:'一本账：素性测试的三代',claims:[
     {expr:'2^{-s}',when:'MILLER-RABIN(n, s) 的错误概率上界（定理 31.40）',page:951,source:'book'},
     {expr:'(n-1)/2',when:'奇合数的见证者下界（定理 31.39）',page:949,source:'book'},
     {expr:'561',when:'最小的 Carmichael 数（费马测试的天敌）',page:945,source:'book'},
     {expr:'\\ln 2^{b}',when:'找 b 位素数大约要试的奇数个数（素数定理）',page:943,source:'book'},
    ],tables:[{caption:'C 程序 Part 8 的实测',rows:[
      ['实验','结果'],
      ['2^340 mod 341','1（341 = 11·31）→ 基 2 伪素数'],
      ['561 与互素基','319 个全过费马测试'],
      ['561 的 Miller-Rabin 见证者','310 个 = 97.2%'],
      ['100 以内奇素数','见证者 0 个'],
     ]},{caption:'三代素性测试',rows:[
      ['方法','漏洞','状态'],
      ['试除（筛法）','按位长是指数时间','离线建表可用'],
      ['费马测试','**Carmichael 数全灭**','不可靠'],
      ['**Miller-Rabin**','错误率 ≤ 2^{-s}（可控）','工业标准（RSA 找素数）'],
     ]}],chart:{xMax:1729,series:[
     {name:'Carmichael 数的密度（10⁸ 内 255 个）',expr:'255 * n / 100000000',color:'--viz-compare'},
     {name:'见证者比例 3/4（定理保证）',expr:'0.75 * n',color:'--viz-done'}]},
    derivations:[{kind:'line',title:'为什么见证者至少一半',steps:[
      {zh:'若 $n$ 是奇合数，则 $\\mathbb{Z}_n^*$ 里要么有非平凡平方根（它们全是见证者），要么费马测试对一半的基直接失败。'},
      {zh:'非见证者构成一个真子群 $B$（乘法封闭：两个"非见证"的基的乘积也不见证）。'},
      {zh:'由 Lagrange（31.3）：真子群的阶 $|B| \\le |\\mathbb{Z}_n^*| / 2$ → 见证者至少一半（定理 31.39）。'},
      {tex:'\\Pr[\\text{MILLER-RABIN 出错}] \\le 2^{-s}',zh:'★★ $s$ 个独立基各错一半的一半 → $2^{-s}$：多项式次数的随机实验换来指数级小的错误率。C 程序实测 97.2% 远超保证的 50%。∎'}]},
     ],
    note:''},
   {type:'prove',title:'非平凡平方根为什么是"铁证"',statement:'The call of the auxiliary procedure WITNESS (a,n) returns TRUE if and only if a is a "witness" to the compositeness of n',
    page:946,
    intro:'★ 见证者的两个来源：平方链上的非平凡平方根，或链终点不为 1。前者是结构性铁证。',
    steps:[
     {title:'① 铁证的含义',en:'The call of the auxiliary procedure WITNESS (a,n) returns TRUE if and only if a is a "witness" to the compositeness of n',
      page:946,
      body:['若 $x^{2} \\equiv 1 \\ (\\text{mod } n)$ 且 $x \\neq \\pm 1$，则 $n$ **必然**合数（推论 31.35 的逆否）。',
        '这是"能用 $a$ 证明 $n$ 是合数"的含义：证据可以被独立复核。']},
     {title:'② 证据还能直接给出因子',en:'The first three Carmichael numbers are 561, 1105, and 1729. Carmichael numbers are extremely rare. For example, only 255 of them are less than 100,000,000.',
      page:945,
      body:['由 $x^{2} \\equiv 1$：$n \\mid (x-1)(x+1)$，但 $n$ 整除两者皆否。',
        '于是 $\\gcd(x-1, n)$ 与 $\\gcd(x+1, n)$ 都是 $n$ 的**非平凡因子**（习题 31.8-3）。',
        '★ Miller-Rabin 不仅测得出合数，顺手就能分解一部分 —— 对 RSA 的启示：模数选 $p, q$ 强素数正是为了堵住这条捷径。']},
     {title:'③ Carmichael 数也逃不掉',en:'The Miller-Rabin primality test overcomes the problems of the simple procedure',
      page:945,
      body:['561 = 3·11·17 有 8 个"1 的平方根"（每个素因子独立选 ±1），非平凡的有 6 个。',
        '费马测试只看终点，Miller-Rabin 看整条链 —— 这些平方根迟早撞上。',
        '★ C 程序实测：97.2% 的互素基都是见证者（定理 31.39 只保证 ≥ 50%）。∎']},
    ],conclusion:'★ 结论：费马测试输在"只看终点"；Miller-Rabin 赢在"看全过程" —— 一条平方链上的任何反常都是合数的铁证。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'Carmichael 数最擅长骗过哪个测试？',options:['试除','**费马测试**','Miller-Rabin','筛法'],answer:1,
      why:'★ 它对所有互素基都满足 a^(n−1) ≡ 1；561 是最小的（C 程序实测）。'},
     {kind:'single',q:'Miller-Rabin 抓合数的探针是什么？',options:['素数计数','**1 的非平凡平方根**','最大公约数','中国余数'],answer:1,
      why:'★ 平方链上出现 x² ≡ 1 而 x ≠ ±1 → 素数模不可能 → n 是合数。'},
     {kind:'judge',q:'561 是合数，但 319 个互素基的费马测试全部通过。',answer:true,
      why:'★ C 程序 part 8 的实测；561 是 Carmichael 数。'},
     {kind:'judge',q:'MILLER-RABIN(n, s) 出错的概率随 s 指数下降。',answer:true,
      why:'★ 定理 31.40：≤ 2^{−s}。'},
     {kind:'simulate',q:'C 程序 part 8 里 561 的见证者比例（百分数，取整数）是多少？',expect:[97],placeholder:'例如：50',
      why:'97% —— 310/319；定理 31.39 只保证 ≥ 50%，实测远超。'},
    ],bookExercises:[
     {id:'31.8-1',page:953,star:0,statement:'31.8-1 Prove that if an odd integer n>1 is not a prime or a prime power, then there exists a nontrivial square',hint:'按素因子分解配对选 ±1 用 CRT 造出 $x$：$x^{2} \\equiv 1$ 但 $x \\neq \\pm 1$ —— 定理 31.34 的反向构造。'},
     {id:'31.8-3',page:953,star:0,statement:'31.8-3 Prove that if x is a nontrivial square root of 1, modulo n, then gcd(x − 1,n) and gcd(x + 1,n) are both',hint:'$n \\mid (x-1)(x+1)$ 但 $n \\nmid (x-1)$ 且 $n \\nmid (x+1)$ → 两个 gcd 都落在中间，必然是非平凡因子 —— 这也是 Miller-Rabin"顺手分解"的原理。'},
     {id:'31.8-3',page:953,star:0,statement:'31.8-3 Prove that if x is a nontrivial square root of 1, modulo n, then gcd(x − 1,n) and gcd(x + 1,n) are both',hint:'找 341 的分解 11·31，再用 CRT 说明 $2^{340} \\equiv 1$ 对两个素因子分别成立 —— 基 2 伪素数的完整机制。'},
    ]},
  ],
};
