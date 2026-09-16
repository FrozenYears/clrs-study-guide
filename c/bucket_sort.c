/* bucket_sort.c -- 8.4 节 BUCKET-SORT 的实现与期望 O(n) 的实测。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bucket_sort bucket_sort.c -lm
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

#define NBUCKETS 10
#define MAXN 520   /* 桶容量：最坏情况全部元素落进一个桶 */

static unsigned g_state;
static void rnd_seed(unsigned s)
{
    g_state = s ? s : 0x9e3779b9u;
    g_state += 0x9e3779b9u;
    g_state = (g_state ^ (g_state >> 16)) * 0x21f0aaadu;
    g_state = (g_state ^ (g_state >> 15)) * 0x735a2d97u;
    g_state = g_state ^ (g_state >> 15);
}
static unsigned rnd_next(void)
{
    unsigned s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}
static double rnd_uniform(void) { return (double)rnd_next() / 4294967296.0; }

static void insertion_sort(double *a, int n)
{
    for (int i = 1; i < n; i++) {
        double k = a[i]; int j = i - 1;
        while (j >= 0 && a[j] > k) { a[j + 1] = a[j]; j--; }
        a[j + 1] = k;
    }
}

static void bucket_sort(double *a, int n)
{
    int nb = n;  /* ★ 原书用 n 个桶 —— 桶数必须与元素数同阶才能保证 O(n) */
    double **buckets = malloc(sizeof(double *) * nb);
    int *counts = calloc(nb, sizeof(int));
    for (int b = 0; b < nb; b++) { buckets[b] = malloc(sizeof(double) * (n + 1)); }
    for (int i = 0; i < n; i++) {
        int bi = (int)(a[i] * nb);
        if (bi >= nb) bi = nb - 1;
        buckets[bi][counts[bi]++] = a[i];
    }
    int idx = 0;
    for (int b = 0; b < nb; b++) {
        insertion_sort(buckets[b], counts[b]);
        for (int i = 0; i < counts[b]; i++) { a[idx++] = buckets[b][i]; }
        free(buckets[b]);
    }
    free(buckets); free(counts);
}

static long g_cmp;
static void insertion_sort_counted(double *a, int n)
{
    for (int i = 1; i < n; i++) {
        double k = a[i]; int j = i - 1;
        while (j >= 0 && a[j] > k) { g_cmp++; a[j + 1] = a[j]; j--; }
        g_cmp++;
        a[j + 1] = k;
    }
}

static void bucket_sort_counted(double *a, int n)
{
    int nb = n;
    double **buckets = malloc(sizeof(double *) * nb);
    int *counts = calloc(nb, sizeof(int));
    for (int b = 0; b < nb; b++) { buckets[b] = malloc(sizeof(double) * (n + 1)); }
    for (int i = 0; i < n; i++) {
        int bi = (int)(a[i] * nb);
        if (bi >= nb) bi = nb - 1;
        buckets[bi][counts[bi]++] = a[i];
    }
    for (int b = 0; b < nb; b++) { insertion_sort_counted(buckets[b], counts[b]); }
    int idx = 0;
    for (int b = 0; b < nb; b++) {
        for (int i = 0; i < counts[b]; i++) { a[idx++] = buckets[b][i]; }
        free(buckets[b]);
    }
    free(buckets); free(counts);
}

static bool is_sorted_d(const double *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] > a[i]) return false; }
    return true;
}

int main(void)
{
    int checked = 0;
    for (int t = 1; t <= 100; t++) {
        int n = 2 + (t % 60);
        double a[64];
        rnd_seed((unsigned)(t * 331 + 5));
        for (int i = 0; i < n; i++) { a[i] = rnd_uniform(); }
        bucket_sort(a, n);
        assert(is_sorted_d(a, n));
        checked++;
    }
    printf("part 1: %d 组均匀分布输入都排好序\n", checked);

    printf("part 2: 均匀分布下桶排序的比较次数\n");
    for (int n = 32; n <= 256; n *= 2) {
        double a[512];
        rnd_seed((unsigned)(n * 17));
        for (int i = 0; i < n; i++) { a[i] = rnd_uniform(); }
        g_cmp = 0;
        bucket_sort_counted(a, n);
        double ratio = (double)g_cmp / n;
        printf("        n = %4d：比较 %5ld 次（%.1f n）\n", n, g_cmp, ratio);
        if (n >= 128) assert(ratio < 20.0);
    }

    {
        int n = 256;
        double a[512];
        rnd_seed(999);
        for (int i = 0; i < n; i++) {
            double u = rnd_uniform();
            a[i] = u < 0.001 ? 0.001 : -log(u);
            if (a[i] >= 1.0) a[i] = 0.999;
        }
        g_cmp = 0;
        bucket_sort_counted(a, n);
        printf("part 3: 指数分布 n = %d：比较 %5ld 次（%.1f n）\n", n, g_cmp, (double)g_cmp / n);
    }

    puts("all checks passed.");
    return 0;
}
