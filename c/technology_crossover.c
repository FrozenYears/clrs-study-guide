/*
 * technology_crossover.c — CLRS 1.2：算法作为技术，交叉点与「能解多大的问题」
 *
 * 1.2 的论点是：常数因子的差距，迟早被 n 的函数差距碾过去。本程序把这句话
 * 变成三段可执行的账：
 *   part 1  两道习题的交叉点（1.2-2 的 8n² vs 64n lg n、1.2-3 的 100n² vs 2ⁿ）；
 *   part 2  原书 p.13 那笔账：快 1000 倍的机器 A + 插入排序  vs  慢机器 B + 归并排序；
 *   part 3  本章 Problem 1-1 的表：给定时间预算 t（微秒），每种 f(n) 最多能解多大。
 * 只用整数与浮点的加减乘除，不链接 math 库（lg 用反复平方法自己算）。
 * 关键数字一律 printf（关卡编写手册 坑 19），断言只兜住已经算对的那几条。
 */
#include <stdio.h>

#define CAP 1000000000000000000ULL   /* 10^18：超过它一律按「溢出」处理 */

/* Problem 1-1 表头的时间预算，单位微秒 */
static const unsigned long long BUDGET[7] = {
  1000000ULL,            /* 1 秒 */
  60000000ULL,           /* 1 分 */
  3600000000ULL,         /* 1 小时 */
  86400000000ULL,        /* 1 天 */
  2592000000000ULL,      /* 1 月（30 天） */
  31536000000000ULL,     /* 1 年（365 天） */
  3153600000000000ULL    /* 1 世纪 */
};
static const char *BUDGET_NAME[7] = {
  "1 秒", "1 分", "1 小时", "1 天", "1 月", "1 年", "1 世纪"
};
static const char *FN_NAME[7] = { "lg n", "sqrt(n)", "n", "n lg n", "n^2", "n^3", "2^n" };

/* ceil(log2 n)，n >= 1；纯整数 */
static unsigned long long log2ceil(unsigned long long n) {
  unsigned long long k = 0, p = 1;
  while (p < n) { p <<= 1; k++; }
  return k;
}

/* 反复平方求 log2 r，r ∈ [1,2) → 结果 ∈ [0,1)。只用乘除与比较。 */
static double log2_frac(double r) {
  double frac = 0.0, w = 0.5;
  int i;
  for (i = 0; i < 52; i++) {
    r = r * r;                 /* 每平方一次，log2 翻倍；越过 2 就记一位 */
    if (r >= 2.0) { frac += w; r /= 2.0; }
    w *= 0.5;
  }
  return frac;
}

/* lg n（双精度），纯靠位移 + 反复平方 */
static double lg(unsigned long long n) {
  unsigned long long k = 0;
  double r;
  if (n < 2) return 0.0;
  while ((1ULL << (k + 1)) <= n && k + 1 < 63) k++;
  r = (double)n / (double)(1ULL << k);
  return (double)k + log2_frac(r);
}

static unsigned long long mul_sat(unsigned long long a, unsigned long long b) {
  if (a == 0 || b == 0) return 0;
  if (a > CAP / b) return CAP + 1;
  return a * b;
}

static unsigned long long pow_sat(unsigned long long base, int e) {
  unsigned long long v = 1;
  int i;
  for (i = 0; i < e; i++) {
    if (v > CAP / base) return CAP + 1;
    v *= base;
  }
  return v;
}

static unsigned long long pow2_sat(unsigned long long k) {
  if (k >= 64) return CAP + 1;
  if ((1ULL << k) > CAP) return CAP + 1;
  return 1ULL << k;
}

/* 七个 f(n) 的溢出安全求值 */
static unsigned long long eval_f(int which, unsigned long long n) {
  switch (which) {
    case 0: return log2ceil(n);                  /* lg n */
    case 1: return n;                            /* sqrt(n)：反解走闭式，见 max_n */
    case 2: return n;                            /* n */
    case 3: return mul_sat(n, log2ceil(n));      /* n lg n */
    case 4: return mul_sat(n, n);                /* n^2 */
    case 5: return mul_sat(mul_sat(n, n), n);    /* n^3 */
    default: return pow2_sat(n);                 /* 2^n */
  }
}

/* 二分求最大的 n（1 <= n <= 10^18）使 f(n) <= t */
static unsigned long long max_n(int which, unsigned long long t) {
  unsigned long long lo = 1, hi = CAP, ans = 0;
  if (which == 1) {                       /* sqrt(n) <= t  <=>  n <= t^2 */
    if (t > 1000000000ULL) return CAP + 1;
    return t * t;
  }
  while (lo <= hi) {
    unsigned long long mid = lo + (hi - lo) / 2;
    if (eval_f(which, mid) <= t) {
      ans = mid;
      if (mid == hi) break;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

int main(void) {
  int i;

  printf("part 1  两个交叉点\n");
  /* 1.2-2：8n^2 < 64n lg n  <=>  n < 8 lg n  <=>  2^(n/8) < n  <=>  2^n < n^8。
     最后一步是纯整数判据，不用浮点、不用 lg 的精度。 */
  {
    int first = 0, last = 0;
    for (i = 2; i <= 62; i++) {
      unsigned long long lhs = pow2_sat((unsigned long long)i);
      unsigned long long rhs = pow_sat((unsigned long long)i, 8);
      if (lhs < rhs) { if (!first) first = i; last = i; }
    }
    printf("  1.2-2  8n^2 < 64n lg n（即 2^n < n^8）的 n 区间: %d .. %d\n", first, last);
    printf("        边界实测：n=%d 时 2^n=%llu vs n^8=%llu（插入排序快）\n",
           last, pow2_sat((unsigned long long)last), pow_sat((unsigned long long)last, 8));
    printf("        n=%d 时 2^n=%llu vs n^8=%llu（归并排序反超）\n",
           last + 1, pow2_sat((unsigned long long)(last + 1)),
           pow_sat((unsigned long long)(last + 1), 8));
    if (first != 2 || last != 43) { printf("FAIL part 1 1.2-2 区间不是 2..43\n"); return 1; }
  }
  /* 1.2-3：100n^2 < 2^n 的最小 n（纯整数） */
  {
    int hit = 0;
    unsigned long long p = 2;
    for (i = 1; i <= 60; i++) {
      unsigned long long q = 100ULL * (unsigned long long)i * (unsigned long long)i;
      if (q < p) {
        hit = i;
        printf("  1.2-3  100n^2 < 2^n 的最小 n: %d（%llu < %llu）；上一格 n=%d 是 %llu vs %llu\n",
               i, q, p, i - 1,
               100ULL * (unsigned long long)(i - 1) * (unsigned long long)(i - 1), p >> 1);
        break;
      }
      p <<= 1;
    }
    if (hit != 15) { printf("FAIL part 1 1.2-3 最小 n 不是 15\n"); return 1; }
  }

  printf("\npart 2  原书 p.13：机器 A（快 1000 倍）+ 插入排序  vs  机器 B + 归并排序\n");
  printf("        A：2n^2 条指令、每秒 10^10 条；B：50n lg n 条、每秒 10^7 条\n");
  for (i = 0; i < 2; i++) {
    unsigned long long items = i == 0 ? 10000000ULL : 100000000ULL;
    double secA = 2.0 * (double)items * (double)items / 1.0e10;
    double secB = 50.0 * (double)items * lg(items) / 1.0e7;
    printf("  n = %llu:  A %.0f 秒（%.2f 小时 / %.2f 天）   B %.0f 秒（%.2f 小时）   比值 %.1f 倍\n",
           items, secA, secA / 3600.0, secA / 86400.0, secB, secB / 3600.0, secA / secB);
    if (i == 0) {
      if ((int)(secA + 0.5) != 20000 || (int)(secB + 0.5) != 1163) {
        printf("FAIL part 2 与书上给的 20000 秒 / 1163 秒不符\n");
        return 1;
      }
      printf("  OK 与 p.13 一致：A 超过 5.5 小时，B 不到 20 分钟（书上说 B 快 17 倍以上）\n");
    } else {
      if (!(secA > 23 * 86400.0 && secB < 4 * 3600.0)) {
        printf("FAIL part 2 n=10^8 时不满足「A 超 23 天、B 不到 4 小时」\n");
        return 1;
      }
      printf("  OK 规模翻 10 倍，好算法的优势从 17 倍涨到 150 倍：问题越大越占便宜\n");
    }
  }

  printf("\npart 3  Problem 1-1：给定时间预算（微秒），各 f(n) 最多能解多大的问题\n");
  printf("  %-10s", "预算");
  for (i = 0; i < 7; i++) printf("%-12s", FN_NAME[i]);
  printf("\n");
  for (i = 0; i < 7; i++) {
    int j;
    printf("  %-9s", BUDGET_NAME[i]);
    for (j = 0; j < 7; j++) {
      unsigned long long v = max_n(j, BUDGET[i]);
      char buf[32];
      if (v > CAP) snprintf(buf, sizeof buf, ">1e18");
      else if (v >= CAP) snprintf(buf, sizeof buf, ">=1e18");
      else snprintf(buf, sizeof buf, "%llu", v);
      printf("%22s", buf);
    }
    printf("\n");
  }
  if (max_n(4, BUDGET[0]) != 1000ULL) { printf("FAIL part 3 n^2 在 1 秒内应为 1000\n"); return 1; }
  if (max_n(5, BUDGET[0]) != 100ULL) { printf("FAIL part 3 n^3 在 1 秒内应为 100\n"); return 1; }
  if (max_n(6, BUDGET[0]) != 19ULL) { printf("FAIL part 3 2^n 在 1 秒内应为 19\n"); return 1; }
  if (max_n(2, BUDGET[0]) != 1000000ULL) { printf("FAIL part 3 n 在 1 秒内应为 10^6\n"); return 1; }
  printf("  OK 抽查四格与手算一致（1 秒 = 10^6 微秒：n=10^6、n^2=1000、n^3=100、2^n=19）\n");
  printf("  注：lg n 与 sqrt(n) 两列在 1 秒预算下分别是 2^1000000 与 10^12 —— 前者远超 10^18，\n");
  printf("      表里按「>=1e18」处理。这正是 1.2 想让你看见的事：lg n 增长慢到几乎没有约束。\n");

  printf("\n全部断言通过\n");
  return 0;
}
