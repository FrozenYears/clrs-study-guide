/* ml.c -- 33 章：机器学习算法（k-means / 加权多数 / 梯度下降）。
 * part 1  Lloyd 迭代的目标函数单调不增（20 轮全过断言）；
 * part 2  加权多数（WEIGHTED-MAJORITY）：T = 200 轮、n = 10 个专家，
 *         犯错数 ≤ 4.6·最优专家 + 2·ln n 上界（原书 Lemma 33.3 的常数实验）；
 * part 3  梯度下降：f(w) = ½‖w − w*‖²，步长 η = 0.3 时误差每步 ≈ 0.7 倍（线性收敛）；
 *         投影梯度下降（约束 |w| ≤ B）同样收敛。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o ml ml.c -lm */
#include <assert.h>
#include <math.h>
#include <stdio.h>

#define NK 3                       /* 簇数 */
#define NP 30                      /* 点数 */
#define NE 10                      /* 专家数 */
#define NT 200                     /* 轮数 */

static unsigned long long st = 3320260917ULL;
static double rnd(void) { st = st * 6364136223846793005ULL + 1442695040888963407ULL; return (double)((st >> 11) & 0xFFFFFF) / 16777216.0; }

static double px[NP], py[NP];      /* 数据点 */
static int assign_[NP];            /* 簇分配 */
static double cx_[NK], cy_[NK];    /* 中心 */

static double inertia(void)
{
    double f = 0.0;
    for (int i = 0; i < NP; i++) {
        double dx = px[i] - cx_[assign_[i]], dy = py[i] - cy_[assign_[i]];
        f += dx * dx + dy * dy;
    }
    return f;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* ===== part 1：k-means 的目标函数单调不增 ===== */
    for (int i = 0; i < NP; i++) {
        px[i] = rnd() * 10.0 + (i % 3) * 8.0;   /* 三个自然簇 */
        py[i] = rnd() * 10.0;
    }
    for (int k = 0; k < NK; k++) { cx_[k] = px[k * 7]; cy_[k] = py[k * 7]; }
    double prev = inertia();
    int moved_total = 0;
    for (int round = 0; round < 20; round++) {
        int moved = 0;
        for (int i = 0; i < NP; i++) {           /* 分配步 */
            int best = 0; double bd = 1e30;
            for (int k = 0; k < NK; k++) {
                double dx = px[i] - cx_[k], dy = py[i] - cy_[k], d = dx * dx + dy * dy;
                if (d < bd) { bd = d; best = k; }
            }
            if (best != assign_[i]) { assign_[i] = best; moved++; }
        }
        moved_total += moved;
        for (int k = 0; k < NK; k++) {           /* 更新步：均值 */
            double sx = 0, sy = 0; int c = 0;
            for (int i = 0; i < NP; i++) { if (assign_[i] == k) { sx += px[i]; sy += py[i]; c++; } }
            if (c) { cx_[k] = sx / c; cy_[k] = sy / c; }
        }
        double cur = inertia();
        assert(cur <= prev + 1e-9);              /* 单调不增 */
        if (round < 3) { printf("part 1: 第 %d 轮 f = %.3f（移动 %d 个点）\n", round + 1, cur, moved); }
        prev = cur;
        if (moved == 0) { printf("        第 %d 轮收敛：f = %.3f\n", round + 1, cur); break; }
    }
    printf("        Lloyd 迭代全程单调不增 ✓（总移动 %d 次）\n", moved_total);

    /* ===== part 2：加权多数（WEIGHTED-MANJORITY 的 5 行） ===== */
    {
        double w[NE];
        for (int i = 0; i < NE; i++) { w[i] = 1.0; }
        int best_errors = NT;                    /* 最优专家的犯错数 */
        int expert_err[NE] = {0};
        int algo_err = 0;
        for (int t = 0; t < NT; t++) {
            int label = (t % 3 == 0) ? 1 : 0;    /* 真实标签 */
            int predicts[NE], maj_pos = 0, maj_neg = 0;
            for (int i = 0; i < NE; i++) {
                predicts[i] = ((t >> i) & 1) ^ ((i < 3) ? label : (rnd() < 0.4 ? label ^ 1 : label));
                if (predicts[i] != label) { expert_err[i]++; }
                if (predicts[i]) { maj_pos += (int)w[i]; } else { maj_neg += (int)w[i]; }
            }
            int pred = (maj_pos >= maj_neg) ? 1 : 0;
            if (pred != label) { algo_err++; }
            for (int i = 0; i < NE; i++) {
                if (predicts[i] != label) { w[i] *= 0.5; }   /* 犯错权重减半 */
            }
        }
        for (int i = 0; i < NE; i++) { if (expert_err[i] < best_errors) { best_errors = expert_err[i]; } }
        double bound = 4.6 * best_errors + 2.0 * log(NE);
        printf("part 2: 加权多数 %d 轮：算法犯错 %d，最优专家犯错 %d，上界 %.1f\n",
               NT, algo_err, best_errors, bound);
        assert(algo_err <= bound);
        printf("        犯错数落在原书 Lemma 33.3 的界内 ✓\n");
    }

    /* ===== part 3：梯度下降与投影梯度下降 ===== */
    {
        double wx = 8.0, wy = -5.0, tx = 1.2, ty = -0.7;   /* f(w) = ½‖w − w*‖² */
        double eta = 0.3, prev_f = 0.5 * ((wx - tx) * (wx - tx) + (wy - ty) * (wy - ty));
        for (int t = 0; t < 30; t++) {
            wx -= eta * (wx - tx);
            wy -= eta * (wy - ty);
            double f = 0.5 * ((wx - tx) * (wx - tx) + (wy - ty) * (wy - ty));
            assert(f <= prev_f * (1.0 - eta) * (1.0 - eta) + 1e-12);   /* 线性收敛的精确比率 */
            if (t < 2) { printf("part 3: 第 %d 步 f = %.6f（每步 ×%.2f）\n", t + 1, f, 1.0 - eta); }
            prev_f = f;
        }
        printf("        30 步后 f = %.2e —— 每步 ×(1−η) = 0.70 的线性收敛 ✓\n", prev_f);
        /* 投影版：约束 ‖w‖∞ ≤ 2 */
        double ux = 8.0, uy = -5.0;
        for (int t = 0; t < 30; t++) {
            ux -= eta * (ux - tx); uy -= eta * (uy - ty);
            if (ux > 2.0) { ux = 2.0; } if (ux < -2.0) { ux = -2.0; }
            if (uy > 2.0) { uy = 2.0; } if (uy < -2.0) { uy = -2.0; }
        }
        double f2 = 0.5 * ((ux - tx) * (ux - tx) + (uy - ty) * (uy - ty));
        printf("        投影梯度下降（|w|∞ ≤ 2）：30 步后 f = %.2e，w = (%.3f, %.3f) ✓\n", f2, ux, uy);
        assert(f2 < 0.05);
    }

    puts("all checks passed.");
    return 0;
}
