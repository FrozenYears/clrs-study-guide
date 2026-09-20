/*
 * sorting_and_correctness.c — CLRS 1.1：同一个问题，一个正确算法与一个错误算法
 *
 * 1.1 给的定义只有两句话：算法必须对**每一个**实例停机并输出正确的解；
 * 错误算法「可能根本不停机，或者停机时给出错的答案」。
 * 本程序把这两句话变成可执行的断言：
 *   part 1  正确算法（插入排序）在原书 1.1 的实例上产出书里给的那串输出；
 *   part 2  一个「看起来很像」的错误算法（单趟相邻交换）在同一实例上失败；
 *   part 3  把「候选解有多少、其中能用的有几个」数出来 —— 这就是 1.1 说的
 *           「绝大多数候选解并不解决问题」。
 * 关键数字一律 printf 出来，不靠断言去兜没想到的情形（关卡编写手册 坑 19）。
 */
#include <stdio.h>

#define N 6

static int eq(const int *a, const int *b, int n) {
  for (int i = 0; i < n; i++) {
    if (a[i] != b[i]) return 0;
  }
  return 1;
}

static int is_sorted(const int *a, int n) {
  for (int i = 1; i < n; i++) {
    if (a[i - 1] > a[i]) return 0;
  }
  return 1;
}

/* a 是否还是 src 的那些元素（允许重复值：逐个配对标记） */
static int is_permutation(int *a, const int *src, int n) {
  int used[N];
  for (int i = 0; i < n; i++) used[i] = 0;
  for (int i = 0; i < n; i++) {
    int found = 0;
    for (int j = 0; j < n; j++) {
      if (!used[j] && a[i] == src[j]) { used[j] = 1; found = 1; break; }
    }
    if (!found) return 0;
  }
  return 1;
}

static int inversions(const int *a, int n) {
  int c = 0;
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (a[i] > a[j]) c++;
    }
  }
  return c;
}

static void show(const char *tag, const int *a, int n) {
  printf("%s", tag);
  for (int i = 0; i < n; i++) {
    printf(" %d", a[i]);
    if (i + 1 < n) printf(",");
  }
  printf("\n");
}

/* 正确算法：插入排序。伪代码下标 1 基，C 数组 0 基 —— 全部减 1 */
static void insertion_sort(int *a, int n) {
  for (int i = 1; i < n; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}

/* 错误算法：从左到右做一趟相邻交换。它只处理「逆序对互不相干」的情形 */
static void one_pass_swap(int *a, int n) {
  for (int i = 0; i + 1 < n; i++) {
    if (a[i] > a[i + 1]) {
      int t = a[i];
      a[i] = a[i + 1];
      a[i + 1] = t;
    }
  }
}

/* ---- part 3：穷举 N! 个排列，数有几个真的有序 ---- */
static int perm_total;
static int perm_sorted;
static int perm_used[N];
static int perm_cur[N];

static void permute(const int *src, int n, int depth) {
  if (depth == n) {
    perm_total++;
    if (is_sorted(perm_cur, n)) perm_sorted++;
    return;
  }
  for (int i = 0; i < n; i++) {
    if (perm_used[i]) continue;
    perm_used[i] = 1;
    perm_cur[depth] = src[i];
    permute(src, n, depth + 1);
    perm_used[i] = 0;
  }
}

static unsigned long long factorial(int n) {
  unsigned long long f = 1;
  for (int i = 2; i <= n; i++) f *= (unsigned long long)i;
  return f;
}

int main(void) {
  const int input[N] = {31, 41, 59, 26, 41, 58};  /* 原书 1.1 的实例 */
  const int want[N] = {26, 31, 41, 41, 58, 59};   /* 原书给的正确输出 */
  int a[N];
  int b[N];
  int i;

  for (i = 0; i < N; i++) { a[i] = input[i]; b[i] = input[i]; }

  printf("part 1  正确算法（插入排序）在原书实例上\n");
  show("  输入    :", input, N);
  show("  期望    :", want, N);
  printf("  逆序对  : %d\n", inversions(input, N));
  insertion_sort(a, N);
  show("  实际    :", a, N);
  printf("  排序后逆序对: %d\n", inversions(a, N));
  if (!eq(a, want, N)) {
    printf("FAIL part 1 正确算法没产出书上那一串\n");
    return 1;
  }
  if (!is_permutation(a, input, N)) {
    printf("FAIL part 1 输出已经不是输入的排列\n");
    return 1;
  }
  printf("  OK 停机、输出是原数组的重排、且与书上逐位相同\n");

  printf("\npart 2  错误算法（单趟相邻交换）在同一个实例上\n");
  one_pass_swap(b, N);
  show("  实际    :", b, N);
  printf("  排序后逆序对: %d（应为 0）\n", inversions(b, N));
  printf("  仍是原数组的重排: %s\n", is_permutation(b, input, N) ? "是" : "否");
  printf("  有序吗: %s\n", is_sorted(b, N) ? "是" : "否");
  if (is_sorted(b, N)) {
    printf("FAIL part 2 这个算法本该是错的，却在原书实例上排对了\n");
    return 1;
  }
  if (!is_permutation(b, input, N)) {
    printf("FAIL part 2 错误算法连元素都不该弄丢\n");
    return 1;
  }
  printf("  OK 它停机了、元素一个不少，但答案错 —— 这正是 1.1 说的第二种失败\n");

  printf("\npart 3  候选解有多少，其中能用的有几个\n");
  permute(input, N, 0);
  printf("  穷举排列数: %d（= %llu = %d!）\n", perm_total,
         factorial(N), N);
  printf("  其中有序的: %d\n", perm_sorted);
  /* 实测是 2 而不是 1：实例里有两个 41，同一串有序结果被两个下标排列各产出一次。
     这正是「按位置穷举」与「按结果计数」的区别 —— 数字先跑出来才看得见。 */
  if (perm_total != (int)factorial(N) || perm_sorted != 2) {
    printf("FAIL part 3 计数与预期不符\n");
    return 1;
  }
  printf("  → %d 个候选解里只有 %d 个是答案（两个 41 可互换，故同一串结果被数了两次）\n",
         perm_total, perm_sorted);
  printf("  n! 的增长：");
  for (i = 5; i <= 20; i += 5) printf("%d!=%llu  ", i, factorial(i));
  printf("\n");
  printf("\n全部断言通过\n");
  return 0;
}
