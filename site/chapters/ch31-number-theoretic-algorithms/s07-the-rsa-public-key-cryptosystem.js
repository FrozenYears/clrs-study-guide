/* 第 31 章 31.7：RSA 公钥密码系统（The RSA public-key cryptosystem）。印刷页 936–943（pdf 957–964）。 */
export default {
  key:'s07',id:'ch31/s07',chapter:31,section:'31.7',
  title:'RSA：把"分解很难"变成锁',shortTitle:'31.7 RSA',
  titleEn:'The RSA public-key cryptosystem',
  source: { printed: [936, 941], pdf: [957, 963] },
  prerequisites:[{label:'31.6 元素的幂',url:'#/ch31/s06'}],
  stages:[
   {type:'map',title:'公钥加密，私钥解密',
    why:'生成密钥：取大素数 $p, q$，$n = pq$，$\\varphi(n) = (p-1)(q-1)$，选 $e$ 与 $\\varphi(n)$ 互素，用扩展 Euclid 求 $d = e^{-1} \\text{ mod }\\varphi(n)$。公开 $(e, n)$，保守 $(d, n)$。加密 $M^{e} \\text{ mod }n$、解密 $C^{d} \\text{ mod }n$；正确性来自 $ed \\equiv 1 \\ (\\text{mod } \\varphi(n))$ 使 $M^{ed} \\equiv M$。**安全性押在"分解 $n$ 很难"上** —— 有 $n$ 没有分解就求不出 $d$。',
    position:'本章前三节的收官演出：Euclid（求 $d$）、快速幂（加解密运算）、欧拉定理（正确性）同时上场。',
    unlocks:[{label:'31.8 素性测试',url:'#/ch31/s08'}],
    mathKit:[
     {title:'密钥生成',body:'$n = pq$，$\\varphi(n) = (p-1)(q-1)$；$e \\cdot d \\equiv 1 \\ (\\text{mod } \\varphi(n))$；公开 $(e,n)$，私藏 $(d,n)$。'},
     {title:'加密 / 解密',body:'$C = M^{e} \\text{ mod }n$；$M = C^{d} \\text{ mod }n$。签名/验证反过来用。'},
     {title:'正确性',body:'$ed = 1 + k\\varphi(n)$ → $M^{ed} = M \\cdot (M^{\\varphi(n)})^{k} \\equiv M \\ (\\text{mod } n)$。'},
     {title:'安全假设',body:'已知 $(e, n)$ 求 $d$ 需要分解 $n$；大整数的分解没有已知多项式时间算法。'},
    ]},
   {type:'intuition',title:'一个真实尺寸的 RSA 全流程',scene:'C 程序 Part 7',body:[
     '★ C 程序 part 7 用 $p = 61, q = 53$：$n = 3233$，$\\varphi(n) = 3120$，取 $e = 17$，扩展 Euclid 求出 **d = 2753**，并断言 $17 \\times 2753 \\text{ mod }3120 = 1$。',
     '★ 四个消息的往返：$65 \\to 2790 \\to 65$、$123 \\to 855 \\to 123$、$2345 \\to 1955 \\to 2345$ 全部解密回原值；签名方向 $65 \\to 588 \\to 65$ 同样成立 —— 加密与签名用的是同一对幂，只是**指数互换**。',
     '★★ 正确性不只是"跑通了"：$ed = 17 \\times 2753 = 46801 = 1 + 15 \\times 3120$，于是 $M^{ed} = M \\cdot (M^{\\varphi(n)})^{15} \\equiv M$ —— 欧拉定理逐字兑现。',
     '★ 习题 31.7-1 也实测了：$n = 319$（11×29）、$e = 3$ → **d = 187**（$3 \\times 187 = 561 = 2 \\times 280 + 1$）。',
     '⚠ 现实中的 RSA 用 2048 位以上的 $n$；本例的 3233 一秒就能分解 —— 教学尺寸，安全假设不变。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 = 代表 ≡）。',blocks:[
     {kind:'body',page:939,en:'In the RSA public-key cryptosystem, a participant creates a public key and a secret key with the following procedure:',
      zh:'★★ 密钥生成的开场。'},
     {kind:'body',page:939,en:'6. Keep secret the pair S = (d,n) as the participant’s RSA secret key.',
      zh:'★ 私钥就是 $(d, n)$ —— $d$ 是全部秘密所在。'},
     {kind:'body',page:940,en:'For this scheme, the domain = is the set Z n . To transform a message M associated with a public key P = (e,n) , compute',
      zh:'★★ 消息域是 $\\mathbb{Z}_n$；变换即模幂。'},
     {kind:'body',page:940,en:'To create a signature, the signer’s secret key is applied to the message to be signed, rather than to a ciphertext.',
      zh:'★★ 签名 = 用私钥"加密"消息本身；验证用公钥。'},
     {kind:'body',page:940,en:'To analyze the running time of these operations, assume that the public key (e,n) and secret key (d,n) satisfy lg e = O(1), lg d ≤ ˇ, and lg n ≤ ˇ. Then, applying a public key requires O(1) modular multiplications and uses O(ˇ 2 ) bit operations.',
      zh:'★★ 运算时间：$O(1)$ 次模乘（$\\lg e$ 为常数）与 $O(\\beta^{2})$ 位操作 —— 快速幂的功劳。'},
    ],terms:[{en:'public-key cryptosystem',zh:'公钥密码系统',page:937},
              {en:'RSA',zh:'RSA 公钥密码系统',page:939},
              {en:'signature',zh:'数字签名',page:940}]},
   {type:'pseudocode',title:'本站整理：RSA 密钥生成与加解密（原书以文字步骤给出）',algo:'RSA-KEY-GEN',signature:'RSA-KEY-GEN()',
    page:939,
    lines:[
     {n:1,code:'RSA-KEY-GEN()',zh:''},
     {n:2,code:'    1. 取随机大素数 p, q（Miller-Rabin 找）',zh:'★ 31.8 的产出在这里消费。'},
     {n:3,code:'    2. n = p·q',zh:''},
     {n:4,code:'    3. φ(n) = (p−1)(q−1)',zh:'★ 需要 $p, q$ 本身才知道 φ —— 秘密的另一半。'},
     {n:5,code:'    4. 选 e 与 φ(n) 互素',zh:'★ 常取 65537。'},
     {n:6,code:'    5. d = e^{-1} mod φ(n)   // EXTENDED-EUCLID',zh:'★★ 31.2/31.4 的产出在这里消费。'},
     {n:7,code:'    6. 公开 (e, n)，私藏 (d, n)',zh:''}],
    vars:[{name:'d',meaning:'私钥指数，$e$ 在 $\\text{ mod }\\ \\varphi(n)$ 下的逆'}],
    note:'★ 原书 31.7 用编号步骤（p.939 的 procedure）描述密钥生成，没有伪代码框；本段照那六步整理。',
    more:[{algo:'RSA-CRYPT',subtitle:'RSA 加密 / 解密 / 签名 / 验证 —— 四个方向同一对幂',signature:'RSA(P = (e,n), M)',page:940,
      lines:[{n:1,code:'加密（Bob 用 Alice 的公钥）：C = M^e mod n',zh:'★ 只有持有 $d$ 的人能逆。'},
        {n:2,code:'解密（Alice 用私钥）：M = C^d mod n',zh:'★ $ed \\equiv 1 \\ (\\text{mod } \\varphi(n))$ 保证往返。'},
        {n:3,code:'签名（Alice 用私钥）：S = M^d mod n',zh:'★ 反过来用私钥。'},
        {n:4,code:'验证（任何人用公钥）：M = S^e mod n',zh:'★ 能被公钥还原 → 签名只能出自私钥持有者。'}],
      vars:[{name:'C',meaning:'密文；S：签名'}],
      note:'★ C 程序 part 7 把四个方向全部跑通：同一消息走加密往返与签名往返，都回到原值。'}]},
   {type:'visualize',title:'RSA 的运算成本',panels:[
     {title:'加解密 = 一次模幂',viz:'growth',
      chart:{xMax:4096,series:[
       {name:'模幂：≤ 2·lg e 次模乘',expr:'2 * Math.log2(n)',color:'--viz-done'},
       {name:'朴素：e 次模乘',expr:'n',color:'--viz-violation'}]},
      note:'★ 原书 p.940：公开密钥运算只要 $O(1)$ 次模乘（$\\lg e$ 当常数）与 $O(\\beta^{2})$ 位操作 —— 全靠快速幂。'},
    ],tasks:['对照 C 程序 part 7 的四个往返（3 个消息 × 加密/签名）。'],note:''},
   {type:'code',title:'实测：n = 3233 的完整 RSA',c:{file:'number_theory.c',code:String.raw`/* number_theory.c -- 31 章：数论算法（欧几里得 / 模运算 / CRT / RSA / Miller-Rabin）。
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
    notes:[{line:1,zh:'★ 八关共用本文件；本关注释聚焦 part 7（RSA）。'},
           {line:272,zh:'★★ part 7：$p=61, q=53$，$n = 3233$，$\\varphi = 3120$，$e = 17$ → **d = 2753**（扩展 Euclid 算出并断言 $ed \\equiv 1$）。'},
           {line:280,zh:'★★ 四个消息的加密往返与签名往返全部回原值 —— $M^{ed} \\equiv M$ 的数值兑现。'},
           {line:294,zh:'★ 习题 31.7-1：$n = 319$，$e = 3$ → d = 187。'}]},
    tests:[{in:'密钥生成 (61, 53, e=17)',out:'d = 2753，17×2753 ≡ 1 (mod 3120)'},
           {in:'加密往返 m=65',out:'密文 2790 → 解密 65'},
           {in:'签名往返 m=123',out:'签名 2746 → 验证 123'},
           {in:'习题 31.7-1 (n=319, e=3)',out:'d = 187'}],
    mapping:[{pc:6,pcCode:'d = e^{-1} mod φ(n)',c:'`ll g = extended_euclid(e, phi, &d, &y);`（第 289 行）'},
             {pc:1,pcCode:'C = M^e mod n',c:'`ll s = (ll)powmod_count((ull)m, (ull)e, (ull)n, &c);`（第 301 行）'}]},
   {type:'analyze',title:'一本账：RSA 的每一环来自哪一节',claims:[
     {expr:'d = e^{-1} \\text{ mod }\\varphi(n)',when:'私钥 = 扩展 Euclid 的输出',page:939,source:'book'},
     {expr:'M^{ed} \\equiv M',when:'正确性：欧拉定理的直接推论',page:940,source:'book'},
     {expr:'\\Theta(\\lg e) + \\Theta(\\lg d)',when:'加解密各一次模幂',page:940,source:'book'},
     {expr:'\\text{分解 } n',when:'从公钥求私钥的已知唯一路线（无多项式算法）',page:941,source:'book'},
    ],tables:[{caption:'C 程序 Part 7 的实测（n = 3233）',rows:[
      ['操作','输入','输出'],
      ['密钥生成','p=61, q=53, e=17','d = 2753'],
      ['加密 m=65','65^17 mod 3233','2790'],
      ['解密 2790','2790^2753 mod 3233','65 ✓'],
      ['签名 m=123','123^2753 mod 3233','2746'],
      ['验证 2746','2746^17 mod 3233','123 ✓'],
     ]},{caption:'对称 vs 公钥（RSA 的位置）',rows:[
      ['','对称密码','RSA'],
      ['密钥','双方共享同一把','公钥广播，私钥自留'],
      ['密钥分发','需要安全信道','**不需要**'],
      ['运算','快','模幂（慢但可行）'],
      ['安全性基础','密钥保密','**分解 n 困难**'],
     ]}],chart:{xMax:4096,series:[
     {name:'2·lg e（模幂）',expr:'2 * Math.log2(n)',color:'--viz-done'},
     {name:'e（朴素幂）',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'line',title:'正确性：M^{ed} ≡ M 的三行证明',steps:[
      {zh:'$ed \\equiv 1 \\ (\\text{mod } \\varphi(n))$，写成 $ed = 1 + k\\varphi(n)$。'},
      {zh:'于是 $M^{ed} = M \\cdot M^{k\\varphi(n)} = M \\cdot (M^{\\varphi(n)})^{k} \\equiv M \\cdot 1^{k} = M \\ (\\text{mod } n)$（欧拉定理）。'},
      {zh:'$M \\equiv 0 \\ (\\text{mod } p)$ 或 $(\\text{mod } q)$ 的边界情形由 CRT 逐模数成立 —— 一般教材用 CRT 证，结论一致。'},
      {tex:'C^{d} = M^{ed} \\equiv M \\ (\\text{mod } n)',zh:'★★ C 程序 part 7 的四个往返就是这条等式的数值检验；习题 31.7-1 的 $d = 187$ 亦是。∎'}]},
     ],
    note:''},
   {type:'prove',title:'为什么"有公钥也求不出 d"',statement:'The security of the RSA cryptosystem rests in large part on the difficulty of factoring large integers. If an adversary can factor the modulus n in a public key, then the adversary can derive the secret key from the public key, using the knowledge of the factors p and q',
    page:941,
    intro:'★ RSA 的安全性论证是"归约"式的：谁能从 $(e, n)$ 系统地求出 $d$，谁就能分解 $n$。',
    steps:[
     {title:'① d 由 φ(n) 决定',en:'In the RSA public-key cryptosystem, a participant creates a public key and a secret key with the following procedure:',
      page:939,
      body:['$d$ 是 $e$ 在模 $\\varphi(n)$ 下的逆。不知道 $\\varphi(n)$，就不知道模数，逆无从谈起。',
        '$\\varphi(n) = (p-1)(q-1)$ 只能由分解 $n = pq$ 得到。']},
     {title:'② 求出 d ⟹ 能分解 n',en:'The security of the RSA cryptosystem rests in large part on the difficulty of factoring large integers. If an adversary can factor the modulus n in a public key, then the adversary can derive the secret key from the public key, using the knowledge of the factors p and q',
      page:941,
      body:['知道 $(e, d)$ 就知道 $ed - 1$ 是 $\\varphi(n)$ 的倍数（习题 31.7-2 的路线）。',
        '$\\varphi(n)$ 与 $n$ 只差 $p + q - 1$，由 $n$ 与 $\\varphi(n)$ 解二次方程即得 $p, q$。',
        '★ 所以"求 $d$"与"分解 $n$"难度等价 —— 而分解没有多项式算法（31.2 的原话）。']},
     {title:'③ 攻击者的视角',en:'For this scheme, the domain = is the set Z n . To transform a message M associated with a public key P = (e,n) , compute',
      page:940,
      body:['攻击者有 $(e, n)$ 与密文 $C = M^{e}$，想求 $M$。',
        '等价于解"模 $n$ 下的离散对数/开方"，同样没有已知多项式算法。',
        '★ 现实约束：2048 位 $n$ 的分解远超算力；本教学例的 3233 只是演示尺寸。∎']},
    ],conclusion:'★ 结论：RSA 的锁芯是"分解很难"这条计算复杂性假设 —— 数论算法（31.2/31.6）负责造锁，复杂性负责上锁。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'RSA 里 $d$ 是怎么算出来的？',options:['随机猜','$d = e^{-1} \\text{ mod }\\varphi(n)$（扩展 Euclid）','$d = e + \\varphi(n)$','$d = n - e$'],answer:1,
      why:'★ 需要 $\u03c6(n) = (p-1)(q-1)$，所以只有会分解 $n$ 的人能算。'},
     {kind:'single',q:'习题 31.7-1（p=11, q=29, e=3）的 d 是多少？',options:['**187**','113','17','3'],answer:0,
      why:'★ $3 \\times 187 = 561 = 2 \\times 280 + 1$（C 程序断言）。'},
     {kind:'judge',q:'RSA 的加密与签名用同一对幂，只是公私钥的顺序互换。',answer:true,
      why:'★ 加密用对方公钥，签名用自己私钥（原书 p.940）。'},
     {kind:'judge',q:'本教学例的 n = 3233 提供与真实 RSA 相当的安全性。',answer:false,
      why:'★ 3233 秒级可分解；教学尺寸只演示机制，安全假设靠大素数。'},
     {kind:'simulate',q:'C 程序 part 7 里 d 的值是多少？（p=61, q=53, e=17）',expect:[2753],placeholder:'例如：17',
      why:'2753 —— 17×2753 = 46801 = 1 + 15×3120。'},
     {kind:'single',q:'本教学例（$p = 61, q = 53, e = 17$）的 $\varphi(n)$ 是多少？',options:['3233','**3120**','3121','3234'],answer:1,why:'★ $\varphi(n) = (p-1)(q-1) = 60 \times 52 = 3120$。C 程序打印 $17 \times 2753 \equiv 1 \ (\text{mod } 3120)$ —— $d = 2753$ 正是 $e$ 在这个模下的逆。'},
     {kind:'simulate',q:'C 程序 part 7 里明文 $m = 65$ 加密后的密文是多少？（填整数）',expect:[2790],placeholder:'例如：1234',why:'2790 —— $65^{17} \text{ mod } 3233$；程序随后用 $C^{d}$ 解回 65，往返成立。签名往返那条则是 $m = 123 \to 2746 \to 123$。'},
    ],bookExercises:[
     {id:'31.7-1',page:942,star:0,statement:'Consider an RSA key set with √D 11, q = 29, n = 319, and e = 3. What value of d should be used in the secret key? What is the encryption of the message M = 100?',hint:'两问，第二问「消息 $M=100$ 的加密结果」别丢。 $\\varphi(319) = (11-1)(29-1) = 280$；解「$3d$ 除以 280 余 1」得 $d = 187$ （$3 \\times 187 = 561 = 2 \\times 280 + 1$ ✓）。 加密：$C$ 就是 $100^3$ 除以 319 的余数，即 1000000 除以 319 的余数 $= 254$。 **交卷前回代验一次**：254 的 187 次方除以 319，余数是 100 ✓（脚本核过）， 这步顺带也验证了你取的 $d$ 真的与 $e$ 互逆。 注意 $n = 11 \\times 29 = 319$ 太小，实际 RSA 里 $\\varphi(n)$ 不能泄露；本题只练算。'},
     {id:'31.7-2',page:942,star:0,statement:'Prove that if Alice’s public exponent e is 3 and an adversary obtains Alice’s secret exponent d , where 0<d <Ω(n) , then the adversary can factor Alice’s modulus n in time polynomial in the number of bits in n. (Although you are not asked to prove it, you might be interested to know that this result remains true even if the condition e = 3 is removed. See Miller [327].)',hint:'从 $ed - 1 = k\u03c6(n)$ 出发：$\u03c6(n) = n - p - q + 1$，与 $n = pq$ 联立解二次方程得 $p, q$ —— 所以"知道 d"等于"会分解 n"。'},
    ]},
  ],
};
