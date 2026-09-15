/* strassen_matrix_multiply.c -- 4.2 节：Strassen 矩阵乘法的可执行对照。
 *
 * 原书对应（第 4 版）：
 *   p.86–89  四步：分块，构造 S1…S10 与 P1…P7，递归求七个乘积，合并 C 的四块。
 *   p.87     T(n) = 7T(n/2) + Theta(n^2)。
 *
 * 输入矩阵按行连续存储，边长 n 必须是 2 的幂。为让每个中间量都可见，
 * 每层都复制出八个输入块、十个 S 块和七个 P 块；这不是省内存的工程实现。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -O0 -o strassen_matrix_multiply strassen_matrix_multiply.c
 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

static void matrix_add(const int *left, const int *right, int *out, int count)
{
    for (int i = 0; i < count; i++) {
        out[i] = left[i] + right[i];
    }
}

static void matrix_subtract(const int *left, const int *right, int *out, int count)
{
    for (int i = 0; i < count; i++) {
        out[i] = left[i] - right[i];
    }
}

static void copy_block(const int *matrix, int stride, int row, int column, int size, int *out)
{
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            out[i * size + j] = matrix[(row + i) * stride + column + j];
        }
    }
}

static void write_block(int *matrix, int stride, int row, int column, int size, const int *block)
{
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            matrix[(row + i) * stride + column + j] = block[i * size + j];
        }
    }
}

static void strassen_multiply(const int *a, const int *b, int *c, int n)
{
    if (n == 1) {
        c[0] = a[0] * b[0];
        return;
    }

    const int half = n / 2;
    const int count = half * half;
    int *workspace = malloc((size_t)26 * (size_t)count * sizeof(*workspace));
    assert(workspace != NULL);

    int *a11 = workspace;
    int *a12 = a11 + count;
    int *a21 = a12 + count;
    int *a22 = a21 + count;
    int *b11 = a22 + count;
    int *b12 = b11 + count;
    int *b21 = b12 + count;
    int *b22 = b21 + count;
    int *s1 = b22 + count;
    int *s2 = s1 + count;
    int *s3 = s2 + count;
    int *s4 = s3 + count;
    int *s5 = s4 + count;
    int *s6 = s5 + count;
    int *s7 = s6 + count;
    int *s8 = s7 + count;
    int *s9 = s8 + count;
    int *s10 = s9 + count;
    int *p1 = s10 + count;
    int *p2 = p1 + count;
    int *p3 = p2 + count;
    int *p4 = p3 + count;
    int *p5 = p4 + count;
    int *p6 = p5 + count;
    int *p7 = p6 + count;
    int *temp = p7 + count;

    copy_block(a, n, 0, 0, half, a11);
    copy_block(a, n, 0, half, half, a12);
    copy_block(a, n, half, 0, half, a21);
    copy_block(a, n, half, half, half, a22);
    copy_block(b, n, 0, 0, half, b11);
    copy_block(b, n, 0, half, half, b12);
    copy_block(b, n, half, 0, half, b21);
    copy_block(b, n, half, half, half, b22);

    /* 原书 p.87 的 S1…S10。 */
    matrix_subtract(b12, b22, s1, count);
    matrix_add(a11, a12, s2, count);
    matrix_add(a21, a22, s3, count);
    matrix_subtract(b21, b11, s4, count);
    matrix_add(a11, a22, s5, count);
    matrix_add(b11, b22, s6, count);
    matrix_subtract(a12, a22, s7, count);
    matrix_add(b21, b22, s8, count);
    matrix_subtract(a11, a21, s9, count);
    matrix_add(b11, b12, s10, count);

    /* 原书 p.87–88 的七次递归乘法。 */
    strassen_multiply(a11, s1, p1, half);
    strassen_multiply(s2, b22, p2, half);
    strassen_multiply(s3, b11, p3, half);
    strassen_multiply(a22, s4, p4, half);
    strassen_multiply(s5, s6, p5, half);
    strassen_multiply(s7, s8, p6, half);
    strassen_multiply(s9, s10, p7, half);

    /* 原书 p.88–89 的四个合并公式。 */
    matrix_add(p5, p4, temp, count);
    matrix_subtract(temp, p2, temp, count);
    matrix_add(temp, p6, temp, count);
    write_block(c, n, 0, 0, half, temp);

    matrix_add(p1, p2, temp, count);
    write_block(c, n, 0, half, half, temp);

    matrix_add(p3, p4, temp, count);
    write_block(c, n, half, 0, half, temp);

    matrix_add(p5, p1, temp, count);
    matrix_subtract(temp, p3, temp, count);
    matrix_subtract(temp, p7, temp, count);
    write_block(c, n, half, half, half, temp);

    free(workspace);
}

static void naive_multiply(const int *a, const int *b, int *c, int n)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int sum = 0;
            for (int k = 0; k < n; k++) {
                sum += a[i * n + k] * b[k * n + j];
            }
            c[i * n + j] = sum;
        }
    }
}

static void check_product(const int *a, const int *b, int n)
{
    int result[16] = { 0 };
    int expected[16] = { 0 };
    strassen_multiply(a, b, result, n);
    naive_multiply(a, b, expected, n);
    for (int i = 0; i < n * n; i++) {
        assert(result[i] == expected[i]);
    }
}

int main(void)
{
    const int a2[] = { 1, 2, 3, 4 };
    const int b2[] = { 5, 6, 7, 8 };
    const int a4[] = {
        1, -2, 3, 0,
        4, 5, -1, 2,
        0, 3, 2, 1,
        -3, 1, 4, 2,
    };
    const int b4[] = {
        2, 1, 0, -1,
        3, -2, 4, 1,
        1, 0, -3, 2,
        5, 2, 1, 0,
    };

    check_product(a2, b2, 2);
    check_product(a4, b4, 4);
    puts("Strassen 2x2 and 4x4 checks passed.");
    return 0;
}
