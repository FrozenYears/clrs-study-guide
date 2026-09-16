/* hash_practical.c -- 11.5 节「散列表的工程实践」配套实现。
 *   ① 散列函数怎么选：除法散列要避开 2 的幂（用素数）；乘法散列。
 *   ② 全域散列：从随机族里选一个函数，逼近"独立均匀散列"。
 *   ③ 开放寻址的删除（线性探测）：搬回法，不用 DELETED 标记。
 *   ④ 自由表（free list）：用一条链串起所有空闲槽，分配/释放 O(1)。
 *   ⑤ 负载因子触发再散列（rehash）：α 超限就把表扩一倍并重散列。
 *   ⑥ wee 散列函数：只用加法/乘法/半字交换，全在寄存器里算（11.5.2）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o hash_practical hash_practical.c
 */
#include <assert.h>
#include <stdint.h>
#include <stdio.h>

/* ---------- 0. 除法散列：h(k) = k mod m（m 为素数，避开 2 的幂） ---------- */
static int div_hash(int k, int m) { int q = k % m; return q < 0 ? q + m : q; }

/* 乘法散列：h(k) = floor(m * (k*A mod 1))，A ≈ (sqrt(5) - 1) / 2 */
static int mult_hash(int k, int m) {
    const double A = 0.6180339887498949;        /* (sqrt(5) - 1) / 2 */
    double frac = (double)k * A;
    frac = frac - (long)frac;                   /* 取小数部分 */
    return (int)(m * frac);
}

/* ---------- 1. 取模 2 的幂是个坏主意 ---------- */
static void part1_power_of_two(void) {
    /* 8 个 key 全是 16 的倍数；m_bad = 16 = 2^4，h(k) 只看低 4 位 → 全为 0 */
    int keys[8] = {16, 32, 48, 64, 80, 96, 112, 128};
    int m_bad = 16, m_good = 17;                /* 17 是素数 */
    int bad[16] = {0}, good[17] = {0};
    for (int i = 0; i < 8; i++) { bad[div_hash(keys[i], m_bad)]++; good[div_hash(keys[i], m_good)]++; }
    int bad_max = 0, good_max = 0;
    for (int i = 0; i < 16; i++) bad_max  = bad[i]  > bad_max  ? bad[i]  : bad_max;
    for (int i = 0; i < 17; i++) good_max = good[i] > good_max ? good[i] : good_max;
    assert(bad_max == 8);                        /* 8 个 key 全部挤进槽 0 */
    assert(good_max == 1);                       /* 素数 m：每个槽至多 1 个 */
    /* 乘法散列：取 A ≈ (sqrt(5)-1)/2，对同样的 key 也不会全挤进一个槽 */
    int mul[16] = {0};
    for (int i = 0; i < 8; i++) mul[mult_hash(keys[i], 16)]++;
    int mul_max = 0;
    for (int i = 0; i < 16; i++) mul_max = mul[i] > mul_max ? mul[i] : mul_max;
    assert(mul_max < 8);                         /* 乘法散列把 key 摊开了 */
    printf("part 1: 取模 2 的幂(m=16) → 8 个 key 全落在槽 0；取模素数(m=17) → 每槽至多 1 个；乘法散列也摊开\n");
}

/* ---------- 2. 全域散列：h_{a,b}(k) = ((a*k + b) mod p) mod m ---------- */
static int universal_hash(int k, int a, int b, int p, int m) {
    long v = ((long)a * k + b) % p;
    if (v < 0) v += p;
    return (int)(v % m);
}

/* 固定种子的确定性 PRNG（线性同余），保证复现 */
static int prng(long *seed) {
    *seed = (*seed * 1103515245 + 12345) & 0x7fffffff;
    return (int)(*seed % 100000);
}

static void part2_universal(void) {
    const int p = 1000003, m = 64;              /* p 是素数，大于全域 */
    long seed = 12345;
    int a = prng(&seed) % (p - 1) + 1;          /* 随机选 a */
    int b = prng(&seed) % p;                     /* 随机选 b */
    int uni[64] = {0}, naive[64] = {0};
    for (int i = 0; i < 2000; i++) {
        int k = prng(&seed);
        uni[universal_hash(k, a, b, p, m)]++;
        naive[div_hash(k, m)]++;                /* 对照：直接用 k mod m */
    }
    int uni_max = 0, naive_max = 0, uni_occ = 0, naive_occ = 0;
    for (int i = 0; i < 64; i++) {
        uni_max  = uni[i]  > uni_max  ? uni[i]  : uni_max;
        naive_max = naive[i] > naive_max ? naive[i] : naive_max;
        if (uni[i])  uni_occ++;
        if (naive[i]) naive_occ++;
    }
    /* 2000 个 key 入 64 槽（平均链长 ≈ 31）：全域散列应把绝大多数槽都用上，
     * 且最长链小于总 key 数（即没有退化成一条链）。 */
    assert(uni_occ > 40);                         /* 至少用到 40/64 个槽 */
    assert(uni_max < 2000 && naive_max < 2000);  /* 没有退化成一条链 */
    printf("part 2: 2000 个随机 key 入 64 槽，最长链 朴素=%d 全域=%d；用到的槽 朴素=%d 全域=%d（a=%d,b=%d）\n",
           naive_max, uni_max, naive_occ, uni_occ, a, b);
}

/* ---------- 3. 开放寻址（线性探测）的删除：搬回法 ---------- */
#define OA_M 10
#define NIL_KEY (-1)

static int oa_h1(int k) { int q = k % OA_M; return q < 0 ? q + OA_M : q; }

/* 线性探测插入：返回落点的槽号；满则返回 -1 */
static int oa_insert(int T[], int k) {
    for (int i = 0; i < OA_M; i++) {
        int q = (oa_h1(k) + i) % OA_M;
        if (T[q] == NIL_KEY) { T[q] = k; return q; }
    }
    return -1;
}

/* g(k,q) = (q - h1(k)) mod m：key k 的探测序列里，槽 q 是第几个被探测到的 */
static int oa_g(int k, int q) {
    int v = (q - oa_h1(k)) % OA_M;
    return v < 0 ? v + OA_M : v;
}

/* LINEAR-PROBING-HASH-DELETE 的 C 实现（搬回法，不用 DELETED 标记）：
 * 删除位置 q 的 key 后，沿探测序列向后扫描；凡"原本应先被探测到 q"的后续 key，
 * 都搬回 q（因为现在 q 空了，否则一次查找会在 q 处停下、错过它）。 */
static void oa_delete(int T[], int q) {
    T[q] = NIL_KEY;                             /* 行 2：把目标槽置空 */
    while (1) {
        int qp = q;                            /* 行 3：扫描起点 */
        while (1) {                            /* 行 4：repeat */
            qp = (qp + 1) % OA_M;              /* 行 5：下一个槽 */
            int kp = T[qp];                    /* 行 6：下一个待搬的候选 key */
            if (kp == NIL_KEY) return;         /* 行 7-8：遇到空槽，停止 */
            if (oa_g(kp, q) < oa_g(kp, qp)) {  /* 行 9：g(k′,q) < g(k′,q′) ? */
                T[q] = kp;                     /* 行 10：搬回空出的 q */
                T[qp] = NIL_KEY;               /* 槽 qp 腾空 */
                q = qp;                        /* 行 11：从新空槽继续 */
                break;
            }
        }
    }
}

static void part3_linear_probe_delete(void) {
    /* Figure 11.6(a)：依次插入 74,43,93,18,82,38,92（h1(k)=k mod 10） */
    int T[OA_M];
    for (int i = 0; i < OA_M; i++) T[i] = NIL_KEY;
    int keys[7] = {74, 43, 93, 18, 82, 38, 92};
    for (int i = 0; i < 7; i++) assert(oa_insert(T, keys[i]) >= 0);
    assert(T[2] == 82 && T[3] == 43 && T[4] == 74 && T[5] == 93 && T[6] == 92
           && T[8] == 18 && T[9] == 38);

    /* 删除 43（在槽 3）：Figure 11.6(b) 期望 93 上移到槽 3、92 上移到槽 5 */
    oa_delete(T, 3);
    assert(T[3] == 93);                         /* 93 搬回槽 3 */
    assert(T[5] == 92);                         /* 92 搬回槽 5 */
    assert(T[2] == 82 && T[4] == 74 && T[8] == 18 && T[9] == 38);
    assert(T[6] == NIL_KEY && T[7] == NIL_KEY);
    printf("part 3: 删除 43 后：T[3]=93（上移）、T[5]=92（上移）；探测序列已修复\n");
}

/* ---------- 4. 自由表：用一条链串起所有空闲槽 ---------- */
#define FL_N 8
static int g_fl_next[FL_N];                     /* 自由表的 next 指针 */
static int g_fl_head;                           /* 自由表头 */
static int g_fl_slot[FL_N];                     /* 槽内容（NIL_KEY = 空闲） */

static int fl_alloc(void) {                     /* 从自由表头取一个空闲槽 */
    if (g_fl_head < 0) return -1;
    int s = g_fl_head;
    g_fl_head = g_fl_next[s];
    return s;
}
static void fl_release(int s) {                 /* 把槽 s 还回自由表头 */
    g_fl_next[s] = g_fl_head;
    g_fl_head = s;
    g_fl_slot[s] = NIL_KEY;
}

static void part4_free_list(void) {
    g_fl_head = 0;
    for (int i = 0; i < FL_N; i++) {            /* 初始：整张表都是空闲槽 */
        g_fl_next[i] = (i + 1) % FL_N;
        g_fl_slot[i] = NIL_KEY;
    }
    g_fl_next[FL_N - 1] = -1;                   /* 表尾 */
    int a = fl_alloc(), b = fl_alloc(), c = fl_alloc();
    assert(a == 0 && b == 1 && c == 2);
    fl_release(b);                              /* 释放槽 1 → 回到自由表头 */
    int d = fl_alloc();
    assert(d == 1);                             /* 下一次分配优先拿到刚释放的槽 1 */
    printf("part 4: 自由表分配/释放：分配 0,1,2 → 释放 1 → 再分配拿到 1（O(1)）\n");
}

/* ---------- 5. 负载因子触发再散列 ---------- */
static void part5_rehash(void) {
    /* 插入 6 个 key 进 8 槽：α = 6/8 = 75% > 0.5，触发再散列 */
    int cur_m = 8;
    int table[1024];                            /* 足够大，容纳翻倍后的表 */
    for (int i = 0; i < cur_m; i++) table[i] = NIL_KEY;
    int n = 0;
    for (int k = 1; k <= 6; k++) {              /* 插 6 个 key 进 8 槽 */
        int q = div_hash(k * 13, cur_m);
        while (table[q] != NIL_KEY) q = (q + 1) % cur_m;
        table[q] = k * 13;
        n++;
    }
    int alpha_before = n * 100 / cur_m;         /* 6/8 = 75% */
    assert(alpha_before > 50);
    /* 再散列：把表长翻倍到 16，所有 key 按新 m 重散列 */
    int new_m = cur_m * 2;
    int new_table[1024];
    for (int i = 0; i < new_m; i++) new_table[i] = NIL_KEY;
    for (int i = 0; i < cur_m; i++) {
        if (table[i] != NIL_KEY) {
            int q = div_hash(table[i], new_m);
            while (new_table[q] != NIL_KEY) q = (q + 1) % new_m;
            new_table[q] = table[i];
        }
    }
    int alpha_after = n * 100 / new_m;          /* 6/16 = 37% */
    assert(alpha_after < alpha_before);
    /* 重散列后所有 key 仍可查到 */
    for (int k = 1; k <= 6; k++) {
        int q = div_hash(k * 13, new_m);
        while (new_table[q] != NIL_KEY && new_table[q] != k * 13) q = (q + 1) % new_m;
        assert(new_table[q] == k * 13);
    }
    printf("part 5: 负载因子 α = %d%% 触发再散列：m 8→16，α 降到 %d%%（全部 key 仍可查到）\n",
           alpha_before, alpha_after);
}

/* ---------- 6. wee 散列函数（11.5.2）：只用加法/乘法/半字交换 ---------- */
static uint64_t wee_f(uint64_t k, uint64_t a) {
    uint64_t v = 2 * k * k + a * k;             /* mod 2^w 自然溢出 */
    return (v >> 32) | (v << 32);               /* swap：交换高低 32 位 */
}

static uint64_t wee_f_iter(uint64_t k, uint64_t a, int r) {
    uint64_t v = k;
    for (int i = 0; i < r; i++) v = wee_f(v, a);
    return v;
}

/* 短输入 wee：h(k) = f_a^{(r + 2^t)}(k + b) mod m（t 为输入比特长） */
static int wee_hash(uint64_t k, uint64_t a, uint64_t b, int t, int r, int m) {
    int rounds = r + (1 << t);                  /* 2^t 轮：让不同长度输入行为不同 */
    uint64_t v = wee_f_iter(k + b, a, rounds);
    return (int)(v % (uint64_t)m);
}

static void part6_wee(void) {
    const uint64_t a = 123, b = 7;             /* 实验中 a = 123, w = 64 */
    int h1 = wee_hash(5, a, b, 8, 4, 1000);     /* 输入长度 t = 8 */
    int h2 = wee_hash(5, a, b, 8, 4, 1000);     /* 同参 → 必相同（确定性） */
    int h3 = wee_hash(5, a, b, 16, 4, 1000);    /* 输入长度 t = 16 → 不同函数 */
    assert(h1 == h2);                            /* 确定性 */
    assert(h1 != h3);                            /* 不同长度 → 不同散列值（2^t 项生效） */
    /* 再散一列 key，确认没有明显退化成同槽 */
    int cnt[16] = {0};
    for (int k = 0; k < 64; k++) cnt[wee_hash((uint64_t)k, a, b, 8, 4, 16)]++;
    int wmax = 0;
    for (int i = 0; i < 16; i++) wmax = cnt[i] > wmax ? cnt[i] : wmax;
    assert(wmax < 64);
    printf("part 6: wee 散列（a=123,b=7）：k=5,t=8→%d；k=5,t=16→%d（长度不同→值不同）；分布最长链=%d\n",
           h1, h3, wmax);
}

int main(void) {
    part1_power_of_two();
    part2_universal();
    part3_linear_probe_delete();
    part4_free_list();
    part5_rehash();
    part6_wee();
    puts("all checks passed.");
    return 0;
}
