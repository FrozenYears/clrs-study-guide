/* heap_index.c -- 6.1 节「堆」的下标算术与堆性质验证。
 *
 * 对应原书 p.161-163：
 *   PARENT(i)  return ⌊i/2⌋      LEFT(i)  return 2i      RIGHT(i)  return 2i + 1
 *   max-heap property: 对根以外的每个结点 i，A[PARENT(i)] ≥ A[i]
 *
 * 下标约定：书中伪代码从 1 开始，C 从 0 开始。本文件的 PARENT / LEFT / RIGHT
 * 全部保持**1 基**语义（与书逐字一致），只在访问 a[] 时才减 1 —— 于是
 * 「书里的 A[i]」在代码里就是 a[i - 1]，对应关系一眼可见。
 *
 * 验证四件事（都能自己算出来，不靠"看着像"）：
 *   1. 叶子恰好是下标 ⌊n/2⌋+1 … n 的那些结点（习题 6.1-8）；
 *   2. n 个结点的堆高度恰好是 ⌊lg n⌋（习题 6.1-2）；
 *   3. 最大堆里，任一子树的根都是该子树的最大值（习题 6.1-3）；
 *   4. 习题 6.1-7 给的数组到底是不是最大堆 —— 让程序回答，不靠肉眼。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o heap_index heap_index.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

/* ---------------------------------------------------------------------------
 * 书上的三个一行过程（1 基，与 p.162 逐字一致）
 * ------------------------------------------------------------------------- */
static int PARENT(int i) { return i / 2; }        /* ⌊i/2⌋：C 的整数除法对非负数即下取整 */
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

/* 结点 i 的高度：从 i 出发向下到某个叶子的最长简单路径上的边数。
 * 一棵以 i 为根的完全子树的高度可以直接从下标算出：⌊lg(i 到 n 的层数)⌋。 */
static int node_height(int i, int n)
{
    int h = 0;
    int j = i;
    while (LEFT(j) <= n) {   /* 还有孩子就还能往下走 */
        j = LEFT(j);
        h++;
    }
    return h;
}

/* 堆高度 = 根的高度（p.163 的定义） */
static int heap_height(int n) { return n <= 0 ? -1 : node_height(1, n); }

/* 最大堆性质：对根以外的每个结点 i，A[PARENT(i)] ≥ A[i] */
static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

/* 最小堆性质：对根以外的每个结点 i，A[PARENT(i)] ≤ A[i] */
static bool is_min_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] > a[i - 1]) { return false; }
    }
    return true;
}

/* 以 root 为根的子树里的最大值（用来验证「子树的根就是子树最大值」） */
static int subtree_max(const int *a, int n, int root)
{
    int best = a[root - 1];
    for (int i = root; i <= n; i++) {
        /* i 在 root 的子树里 <=> 从 i 一路取 PARENT 能走到 root */
        int j = i;
        while (j > root) { j = PARENT(j); }
        if (j == root && a[i - 1] > best) { best = a[i - 1]; }
    }
    return best;
}

static void print_array(const char *label, const int *a, int n)
{
    printf("      %s⟨", label);
    for (int i = 0; i < n; i++) { printf("%d%s", a[i], i + 1 < n ? "," : ""); }
    printf("⟩\n");
}

int main(void)
{
    /* 原书 Figure 6.1 的堆（p.162，数组形式） */
    static const int FIG61[10] = {16, 14, 10, 8, 7, 9, 3, 2, 4, 1};

    /* ---- 0. 三条式子之间的恒等式（顺手把 RIGHT 也走一遍）---- */
    for (int i = 1; i <= 4096; i++) {
        assert(PARENT(LEFT(i)) == i);                 /* 左孩子的父就是自己 */
        assert(PARENT(RIGHT(i)) == i);                /* 右孩子的父也是自己 */
        assert(RIGHT(i) == LEFT(i) + 1);              /* 左右孩子下标相邻 */
        if (i > 1) {
            assert(LEFT(PARENT(i)) == i || RIGHT(PARENT(i)) == i); /* 每个结点都是父的某个孩子 */
        }
    }
    puts("part 0: PARENT/LEFT/RIGHT 四条恒等式在 i = 1..4096 上成立");

    /* ---- 1. 叶子就是下标 ⌊n/2⌋+1 … n（习题 6.1-8）---- */
    for (int n = 1; n <= 64; n++) {
        int expected_first_leaf = n / 2 + 1;
        for (int i = 1; i <= n; i++) {
            bool is_leaf = LEFT(i) > n;               /* 没有左孩子 <=> 是叶子 */
            bool should_be_leaf = (i >= expected_first_leaf);
            assert(is_leaf == should_be_leaf);
        }
    }
    puts("part 1: n = 1..64 都满足「叶子恰好是下标 ⌊n/2⌋+1 … n」（习题 6.1-8）");

    /* ---- 2. n 个结点的堆高度 = ⌊lg n⌋（习题 6.1-2）---- */
    for (int n = 1; n <= 1024; n++) {
        int lg = 0, p = 1;
        while (p * 2 <= n) { p *= 2; lg++; }          /* lg = ⌊log2 n⌋ */
        assert(heap_height(n) == lg);
    }
    printf("part 2: n = 1..1024 都满足「堆高度 = ⌊lg n⌋」（习题 6.1-2）；n = 10 时高度 = %d\n",
           heap_height(10));

    /* ---- 3. 最大堆里任取一棵子树，其根都是该子树的最大值（习题 6.1-3）---- */
    assert(is_max_heap(FIG61, 10));
    for (int root = 1; root <= 10; root++) {
        assert(subtree_max(FIG61, 10, root) == FIG61[root - 1]);
    }
    puts("part 3: Figure 6.1 的堆里，10 棵子树的根都是各自子树的最大值（习题 6.1-3）");

    /* ---- 4. 习题 6.1-7：⟨33,19,20,15,13,10,2,13,16,12⟩ 是不是最大堆？---- */
    {
        static const int EX617[10] = {33, 19, 20, 15, 13, 10, 2, 13, 16, 12};
        print_array("习题 6.1-7 的数组 ", EX617, 10);
        int violations = 0;
        for (int i = 2; i <= 10; i++) {
            if (EX617[PARENT(i) - 1] < EX617[i - 1]) {
                violations++;
                printf("      ★ 违规：A[%d] = %d < A[%d] = %d\n",
                       PARENT(i), EX617[PARENT(i) - 1], i, EX617[i - 1]);
            }
        }
        printf("      -> %s（共 %d 处违规）\n", violations ? "不是最大堆" : "是最大堆", violations);
        assert(violations == 1);
        assert(!is_max_heap(EX617, 10));
        /* ★ 唯一那处违规是 (父 4, 子 9)：A[4] = 15 < A[9] = 16。
         *   注意别想当然 —— 前 8 个位置看着"很像个堆"，而 [8] = 13、[9] = 16
         *   这一对**不是**父子关系（PARENT(9) = 4）。这正是这道小题的坑：
         *   判断堆性质必须按下标算父子，不能靠眼看相邻位置。 */
        assert(PARENT(9) == 4);
        assert(EX617[PARENT(9) - 1] == 15 && EX617[8] == 16);
        assert(EX617[7] == 13);
    }

    /* ---- 5. 两个容易反着答的判断题（习题 6.1-4 / 6.1-6）---- */
    {
        /* 6.1-6：排好序的数组是**最小**堆（不是最大堆） */
        static const int ASC[7] = {1, 2, 3, 4, 5, 6, 7};
        static const int DESC[7] = {7, 6, 5, 4, 3, 2, 1};
        assert(is_min_heap(ASC, 7));
        assert(!is_max_heap(ASC, 7));
        assert(is_max_heap(DESC, 7));
        assert(!is_min_heap(DESC, 7));
        puts("part 5: 递增数组是最小堆（不是最大堆）、递减数组是最大堆 —— 习题 6.1-6");

        /* 6.1-4：最大堆里最小元素只可能在叶子（下标 ⌊n/2⌋+1 … n），因为非叶子都有孩子 */
        int min_val = FIG61[0], min_pos = 1;
        for (int i = 2; i <= 10; i++) {
            if (FIG61[i - 1] < min_val) { min_val = FIG61[i - 1]; min_pos = i; }
        }
        assert(min_pos >= 10 / 2 + 1);                /* 落在叶子区间里 */
        printf("      Figure 6.1 的最小值 %d 在下标 %d（叶子区间从 %d 开始）—— 习题 6.1-4\n",
               min_val, min_pos, 10 / 2 + 1);
    }

    puts("all checks passed.");
    return 0;
}
