/* lcs.c -- 14.4: 最长公共子序列 LCS-LENGTH + PRINT-LCS。
 * 例：X = <A,B,C,B,D,A,B>，Y = <B,D,C,A,B,A>（原书 p.396 的例子）
 * 关键数字：LCS 长度 c[7,6] = 4，序列 = BCBA。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define MMAX 16
#define NMAX 16

static int c[MMAX + 1][NMAX + 1];       /* c[i,j]：X_i 与 Y_j 的 LCS 长度 */
static char b[MMAX + 1][NMAX + 1];      /* b[i,j]：'-' 左上、'^' 上、'<' 左 */

/* LCS-LENGTH（16 行直译） */
static void lcs_length(const char *x, const char *y, int m, int n)
{
    for (int i = 1; i <= m; i++) { c[i][0] = 0; }        /* 行 2–3 */
    for (int j = 0; j <= n; j++) { c[0][j] = 0; }        /* 行 4–5 */
    for (int i = 1; i <= m; i++) {                       /* 行 6：行主序填表 */
        for (int j = 1; j <= n; j++) {                   /* 行 7 */
            if (x[i - 1] == y[j - 1]) {                  /* 行 8 */
                c[i][j] = c[i - 1][j - 1] + 1;           /* 行 9 */
                b[i][j] = '-';                           /* 行 10 */
            }
            else if (c[i - 1][j] >= c[i][j - 1]) {       /* 行 11 */
                c[i][j] = c[i - 1][j];                   /* 行 12 */
                b[i][j] = '^';                           /* 行 13 */
            }
            else {                                       /* 行 14–15 */
                c[i][j] = c[i][j - 1];
                b[i][j] = '<';
            }
        }
    }
}

/* PRINT-LCS（8 行直译，输出顺序即正序） */
static void print_lcs(const char *x, int i, int j)
{
    if (i == 0 || j == 0) { return; }                    /* 行 1–2 */
    if (b[i][j] == '-') {                                /* 行 3 */
        print_lcs(x, i - 1, j - 1);                      /* 行 4 */
        printf("%c", x[i - 1]);                          /* 行 5 */
    }
    else if (b[i][j] == '^') { print_lcs(x, i - 1, j); } /* 行 6–7 */
    else { print_lcs(x, i, j - 1); }                     /* 行 8 */
}

/* 习题 14.4-2 的思路：只用 c 表、不用 b 表，O(m+n) 重建一个 LCS */
static void rebuild_without_b(const char *x, const char *y, int m, int n, char *out)
    {
        int k = 0, i = m, j = n;    while (i > 0 && j > 0) {
        if (x[i - 1] == y[j - 1]) { out[k++] = x[i - 1]; i--; j--; }
        else if (c[i - 1][j] >= c[i][j - 1]) { i--; }
        else { j--; }
    }
    out[k] = '\0';
    for (int a = 0, z = k - 1; a < z; a++, z--) {        /* 反向得到正序 */
        char t = out[a]; out[a] = out[z]; out[z] = t;
    }
}

static int memo_c[MMAX + 1][NMAX + 1];
static long memo_calls;

/* 习题 14.4-3：LCS-MEMO —— 与 LCS-LENGTH 同构，只是改成递归 + 查表 */
static int lcs_memo(const char *x, int i, const char *y, int j)
{
    memo_calls++;
    if (i == 0 || j == 0) { return 0; }
    if (memo_c[i][j] >= 0) { return memo_c[i][j]; }
    int r;
    if (x[i - 1] == y[j - 1]) { r = lcs_memo(x, i - 1, y, j - 1) + 1; }
    else {
        int up = lcs_memo(x, i - 1, y, j);
        int left = lcs_memo(x, i, y, j - 1);
        r = (up >= left) ? up : left;
    }
    memo_c[i][j] = r;
    return r;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    const char *x = "ABCBDAB";
    const char *y = "BDCABA";
    int m = (int)strlen(x);
    int n = (int)strlen(y);

    /* 习题 14.4-2 的方法不用 b 表，先算 c 表 */
    lcs_length(x, y, m, n);

    printf("part 1: X = <%c,%c,%c,%c,%c,%c,%c>，Y = <%c,%c,%c,%c,%c,%c>\n",
           x[0], x[1], x[2], x[3], x[4], x[5], x[6],
           y[0], y[1], y[2], y[3], y[4], y[5]);
    printf("part 2: LCS 长度 c[%d,%d] = %d；一个 LCS = ", m, n, c[m][n]);
    print_lcs(x, m, n);
    printf("\n");
    assert(c[m][n] == 4);

    {
        char out[MMAX + 1];
        rebuild_without_b(x, y, m, n, out);
        printf("part 3: 习题 14.4-2 的做法（只用 c 表）重建得到 = %s（长度 %d）\n",
               out, (int)strlen(out));
        assert(strlen(out) == 4);
    }

    /* 打印完整 c 表（Figure 14.8 的形状：8 行 × 7 列） */
    printf("part 4: c 表（行 i = 0..%d，列 j = 0..%d）：\n", m, n);
    printf("        j    ");
    for (int j = 0; j <= n; j++) { printf("%3d", j); }
    printf("\n        y_j      ");
    for (int j = 0; j < n; j++) { printf("%2c ", y[j]); }
    printf("\n");
    for (int i = 0; i <= m; i++) {
        if (i == 0) { printf("        i=%2d      ", i); }
        else { printf("        i=%2d %c  ", i, x[i - 1]); }
        for (int j = 0; j <= n; j++) { printf("%3d", c[i][j]); }
        printf("\n");
    }

    /* 习题 14.4-3：记忆化版本（真正递归 + 查表，与自底向上答案一致） */
    printf("part 5: 习题 14.4-3 的记忆化版本：\n");
    {
        memset(memo_c, -1, sizeof(memo_c));
        memo_calls = 0;
        int memo = lcs_memo(x, m, y, n);
        printf("        LCS-MEMO(X,7,Y,6) = %d（调用 %ld 次），与自底向上的 %d 一致：%s\n",
               memo, memo_calls, c[m][n], (memo == c[m][n]) ? "是" : "否");
        assert(memo == c[m][n] && memo == 4);
    }

    /* 习题 14.4-1：另一组序列，实测 LCS 长度与序列 */
    printf("part 6: 习题 14.4-1 的两组序列：\n");
    {
        static const char *a = "10010101";
        static const char *d = "010110110";
        lcs_length(a, d, 8, 9);
        printf("        <1,0,0,1,0,1,0,1> 与 <0,1,0,1,1,0,1,1,0> 的 LCS 长度 = %d\n", c[8][9]);
        printf("        一个 LCS = ");
        print_lcs(a, 8, 9);
        printf("\n");
    }

    puts("all checks passed.");
    return 0;
}
