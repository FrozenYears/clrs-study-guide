/* matrix_multiply.c -- 4.1 节：MATRIX-MULTIPLY 的 C 对照。 */
#include <assert.h>
#include <stdio.h>

static void matrix_multiply(const int *a, const int *b, int *c, int n)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                c[i * n + j] += a[i * n + k] * b[k * n + j];
            }
        }
    }
}

static void check_product(const int *a, const int *b, const int *expected, int n)
{
    int result[16] = { 0 };
    matrix_multiply(a, b, result, n);
    for (int i = 0; i < n * n; i++) {
        assert(result[i] == expected[i]);
    }
}

int main(void)
{
    const int a2[] = { 1, 2, 3, 4 };
    const int b2[] = { 5, 6, 7, 8 };
    const int expected2[] = { 19, 22, 43, 50 };
    const int a3[] = { 1, 0, 2, -1, 3, 1, 4, 2, 0 };
    const int b3[] = { 2, 1, 3, 0, -1, 2, 1, 4, 0 };
    const int expected3[] = { 4, 9, 3, -1, 0, 3, 8, 2, 16 };

    check_product(a2, b2, expected2, 2);
    check_product(a3, b3, expected3, 3);
    puts("MATRIX-MULTIPLY 2x2 and 3x3 checks passed.");
    return 0;
}
