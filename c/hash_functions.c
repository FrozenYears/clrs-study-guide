/* hash_functions.c -- 11.3 节：散列函数的三件事实测。
 *   ① 除法散列 h(k) = k mod m：m 取 2 的幂很糟（与素数对照，用低位有规律的 key）；
 *   ② 乘法散列（multiply-shift）：复算原书 p.285 的例子（k = 123456, ℓ = 14, w = 32）；
 *   ③ 全域散列：h_ab(k) = ((ak + b) mod p) mod m —— 实测冲突概率 ≤ 1/m（Theorem 11.3 的前提）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o hash_functions hash_functions.c
 */
#include <assert.h>
#include <stdint.h>
#include <stdio.h>

/* ---- 一个小而够用的伪随机（xorshift32 + 种子混合） ---- */
static uint32_t g_state;
static void rnd_seed(uint32_t s)
{
    g_state = s * 2654435761u + 0x9e3779b9u;   /* 先做一次乘法混合，避免连续种子相关 */
    if (g_state == 0) { g_state = 0x1234567u; }
}
static uint32_t rnd_next(void)
{
    uint32_t s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

/* ---- ① 除法散列：统计链长分布，给出最长链 ---- */
static int max_chain_mod(int *keys, int n, int m)
{
    int buf[4096];
    for (int i = 0; i < m && i < 4096; i++) { buf[i] = 0; }
    int *cnt = buf;
    for (int i = 0; i < n; i++) { cnt[keys[i] % m]++; }
    int mx = 0;
    for (int i = 0; i < m && i < 4096; i++) { if (cnt[i] > mx) { mx = cnt[i]; } }
    return mx;
}

/* ---- ② 乘法散列（multiply-shift）：取低 w 位乘积的高 ℓ 位 ---- */
static uint32_t multiply_shift(uint32_t k, uint32_t a, int w, int l)
{
    uint64_t p = (uint64_t)k * (uint64_t)a;     /* 2w 位乘积：r1 是高 w 位、r0 是低 w 位 */
    uint32_t r1 = (uint32_t)(p >> w);
    uint32_t r0 = (uint32_t)(p & 0xffffffffu);
    (void)r1;
    return r0 >> (w - l);                       /* r0 的最高 l 位 */
}

/* ---- ③ 全域散列 h_ab(k) = ((ak + b) mod p) mod m ---- */
static int universal_hash(int k, int a, int b, int p, int m)
{
    long long ak = (long long)a * k + b;
    int r = (int)(ak % p);
    return r % m;
}

int main(void)
{
    /* ① 除法散列：m 取 2 的幂 vs 素数，key 都带"低位规律"（例如全是 4 的倍数） */
    {
        enum { N = 400 };
        int keys[N];
        rnd_seed(7);
        for (int i = 0; i < N; i++) { keys[i] = (int)(rnd_next() % 1000) * 4; }   /* 全是 4 的倍数 */

        int m_pow2 = 256;                    /* 2 的幂 */
        int m_prime = 251;                   /* 附近的素数 */
        int mx_pow2 = max_chain_mod(keys, N, m_pow2);
        int mx_prime = max_chain_mod(keys, N, m_prime);
        printf("part 1: %d 个 key（全是 4 的倍数）→ 最长链：m = 2^8 = %d 时 %d，m = %d（素数）时 %d\n",
               N, m_pow2, mx_pow2, m_prime, mx_prime);
        printf("        ★ 全是 4 的倍数时，k mod 256 只能落在 64 个槽（4 的倍数槽）—— 2 的幂把 m 的因子"
               "和 key 的规律「共振」了；素数 m 没有这种结构\n");
        assert(mx_pow2 > mx_prime);          /* 2 的幂明显更差 */
    }

    /* ② 乘法散列：复算原书 p.285 的例子 */
    {
        uint32_t k = 123456;
        uint32_t a = 2654435769u;            /* Knuth 建议值 = ⌈(√5−1)/2 · 2^32⌉ */
        int w = 32, l = 14;
        uint64_t p = (uint64_t)k * (uint64_t)a;
        uint32_t r1 = (uint32_t)(p >> 32);
        uint32_t r0 = (uint32_t)(p & 0xffffffffu);
        uint32_t h = multiply_shift(k, a, w, l);
        printf("part 2: 乘法散列复算：k = %u, a = %u（w = 32）\n", k, a);
        printf("        k·a = %llu = %u·2^32 + %u（原书 p.285：76300·2^32 + 17612864）\n",
               (unsigned long long)p, r1, r0);
        assert(r1 == 76300u && r0 == 17612864u);
        printf("        r0 = %u 的最高 %d 位 → h = %u（m = 2^14 = 16384 时正好是一个槽号）\n", r0, l, h);
        assert(h < 16384u);
    }

    /* ③ 全域散列：实测冲突概率 ≤ 1/m */
    {
        int p = 10007;                       /* 素数 p > 所有 key */
        int m = 100;                         /* 槽数 */
        int k1 = 1234, k2 = 5678;            /* 两个不同的 key */
        int hits = 0, trials = 200000;
        for (int t = 0; t < trials; t++) {
            rnd_seed((uint32_t)(t + 1));
            int a = (int)(rnd_next() % (uint32_t)(p - 1)) + 1;   /* a ∈ [1, p−1] */
            int b = (int)(rnd_next() % (uint32_t)p);             /* b ∈ [0, p−1] */
            if (universal_hash(k1, a, b, p, m) == universal_hash(k2, a, b, p, m)) { hits++; }
        }
        double rate = (double)hits / trials;
        printf("part 3: 全域散列 h_ab(k) = ((ak + b) mod %d) mod %d：\n", p, m);
        printf("        %d 组随机 (a,b) 中 k1 = %d 与 k2 = %d 冲突 %d 次 → 实测概率 %.5f\n",
               trials, k1, k2, hits, rate);
        printf("        ★ 理论上界 1/m = %.5f（Theorem 11.3 的 universal 定义）\n", 1.0 / m);
        assert(rate <= 1.0 / m + 0.002);      /* 实测不超过 1/m（留一点抽样噪声） */
    }

    /* ④ 对照：固定散列函数（如 h(k) = k mod 100）在"恶意 key"下的退化 */
    {
        int m = 100;
        int keys[50];
        for (int i = 0; i < 50; i++) { keys[i] = i * m; }        /* 恶意：全是 m 的倍数 */
        int mx = max_chain_mod(keys, 50, m);
        printf("part 4: 固定散列 h(k) = k mod %d，恶意 key 全取成 %d 的倍数 → 最长链 %d（全部撞在一个槽）\n",
               m, m, mx);
        assert(mx == 50);
        printf("        ★ 这就是「随机散列」要解决的：没有一个固定函数能对抗恶意输入，"
               "随机化（全域族）才能把冲突概率压到 1/m\n");
    }

    puts("all checks passed.");
    return 0;
}
