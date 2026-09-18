/* approx_rand.c -- 35 章 35.4：随机化与线性规划两个主题。
 * part 1  随机化 MAX-3-CNF（定理 35.5）：固定种子生成 m 条子句的 3-CNF 实例，
 *         随机赋值重复大量试验，打印「满足子句数的期望 / m」，断言比值 ≥ 7/8 − 容差。
 * part 2  LP 舍入（定理 35.6）：三角形图 K3、权重全 1：LP 松弛最优解 x(v)=1/2
 *         （手工给定，断言它满足全部约束 x(u)+x(v)≥1 且目标值 1.5），
 *         舍入（x̂≥1/2 入覆盖）得 C=3 个顶点，断言 w(C)=3=2×1.5（界 2 是紧的实例）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o approx_rand approx_rand.c -lm */
#include <assert.h>
#include <math.h>
#include <stdio.h>

/* xorshift32：线性同余+取模会把洗牌洗歪（低位周期仅 2），这里用 xorshift32，
 * 且主循环每取一个随机位都重新推进状态，避免连续种子的相关性。 */
static unsigned int rs = 0x9e3779b9u;
static unsigned int rnd32(void) {
    rs ^= rs << 13; rs ^= rs >> 17; rs ^= rs << 5;
    return rs;
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：随机化 MAX-3-CNF（定理 35.5） ===== */
    {
        const int m = 20;          /* 子句数 */
        const int n = 15;          /* 变量数 */
        /* 固定种子生成 m 条子句：每条 3 个互异变量，且不含变量及其否定同现 */
        int cls[20][3];
        rs = 0x1234abcdU;
        for (int c = 0; c < m; c++) {
            int used[15] = {0};
            for (int k = 0; k < 3; k++) {
                int v;
                do { v = (int)(rnd32() % (unsigned)n); } while (used[v]);
                used[v] = 1;
                cls[c][k] = v;
            }
        }
        const long T = 400000L;     /* 试验次数 */
        long total = 0;
        for (long t = 0; t < T; t++) {
            int asg[15];
            for (int i = 0; i < n; i++) { asg[i] = (int)(rnd32() & 1u); }
            int sat = 0;
            for (int c = 0; c < m; c++) {
                int ok = 0;
                for (int k = 0; k < 3; k++) { if (asg[cls[c][k]] == 1) { ok = 1; break; } }
                if (ok) { sat++; }
            }
            total += sat;
        }
        double exp_per = (double)total / (double)T;     /* 期望满足子句数 */
        double ratio = exp_per / (double)m;              /* 满足子句数的期望 / m */
        printf("part 1: MAX-3-CNF 随机赋值：满足子句数期望 = %.4f（共 %d 条），E/m = %.4f\n",
               exp_per, m, ratio);
        printf("        定理 35.5 预测 E/m = 7/8 = 0.8750；断言 E/m ≥ 0.85 ✓\n");
        assert(ratio >= 0.85 - 1e-9);
        /* 随机化 8/7-近似：最优满足子句数 ≤ m，故近似比 ≤ m / E[Y] ≤ 8/7 */
    }

    /* ===== part 2：LP 舍入（定理 35.6）===== */
    {
        /* 三角形 K3，权重全 1；LP 松弛最优解 x(v) = 1/2（对称，手工给定） */
        const int V = 3;
        const double x[3] = {0.5, 0.5, 0.5};   /* x̂(v) */
        /* 断言：(a) 每条边满足 x(u)+x(v) ≥ 1；(b) 目标值 = Σ w(v)x(v) = 1.5 */
        double obj = 0.0;
        for (int i = 0; i < V; i++) {
            for (int j = i + 1; j < V; j++) {
                assert(x[i] + x[j] >= 1.0 - 1e-9);   /* K3 三条边都满足 */
            }
            obj += 1.0 * x[i];
        }
        printf("part 2: K3 权全 1：LP 松弛最优解 x(v)=0.5，目标值 = %.2f（应 = 3×0.5 = 1.5）\n", obj);
        assert(fabs(obj - 1.5) < 1e-9);
        /* 舍入：x̂(v) ≥ 1/2 的顶点入覆盖 → 三个顶点全入 */
        int cover = 0;
        for (int i = 0; i < V; i++) { if (x[i] >= 0.5) { cover++; } }
        int wC = cover;   /* 权重全 1 */
        printf("        舍入后覆盖 C 含 %d 个顶点，w(C) = %d = 2 × 1.5（界 2 是紧的）✓\n", cover, wC);
        assert(wC == 3 && wC == (int)(2.0 * obj));  /* w(C) = 2 × 1.5 = 3 */
    }

    puts("all checks passed.");
    return 0;
}
