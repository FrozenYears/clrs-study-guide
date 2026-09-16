/* direct_address.c -- 11.1 节：直接寻址表的实现与代价验证。
 *   ① SEARCH / INSERT / DELETE 各 O(1)（没有比较、没有搜索）；
 *   ② 代价：空间 Θ(m)（与"实际存了多少元素"无关）；
 *   ③ 习题 11.1-1：在直接寻址表里找最大值 —— 最坏 Θ(m)（表里没有顺序信息）；
 *   ④ 习题 11.1-2：无卫星数据时用位向量，空间降到 m 位。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o direct_address direct_address.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#define M 10

/* 元素：key + 卫星数据 */
typedef struct { int key; int data; } elem_t;

/* 直接寻址表：槽 k 指向 key = k 的元素（NIL 表示空） */
typedef struct { elem_t *slot[M]; } da_t;

static elem_t pool[16];
static int pool_used;
static elem_t *mk(int key, int data)
{
    elem_t *e = &pool[pool_used++];
    e->key = key; e->data = data;
    return e;
}

/* DIRECT-ADDRESS-SEARCH(T, k)：1 行 */
static elem_t *da_search(da_t *T, int k) { return T->slot[k]; }

/* DIRECT-ADDRESS-INSERT(T, x)：1 行 */
static void da_insert(da_t *T, elem_t *x) { T->slot[x->key] = x; }

/* DIRECT-ADDRESS-DELETE(T, x)：1 行 */
static void da_delete(da_t *T, elem_t *x) { T->slot[x->key] = NULL; }

int main(void)
{
    da_t T;
    for (int i = 0; i < M; i++) { T.slot[i] = NULL; }

    /* ① 三个操作都是 O(1)：各只需 1 次数组访问 */
    da_insert(&T, mk(2, 100));
    da_insert(&T, mk(5, 200));
    da_insert(&T, mk(8, 300));
    assert(da_search(&T, 5) != NULL && da_search(&T, 5)->data == 200);
    assert(da_search(&T, 3) == NULL);
    printf("part 1: SEARCH(5) 命中（1 次数组访问）、SEARCH(3) 返回 NIL（1 次）—— 无比较、无搜索\n");

    da_delete(&T, da_search(&T, 5));
    assert(da_search(&T, 5) == NULL);
    printf("part 2: DELETE(x) 只做 T[x.key] = NIL（1 次写入）\n");

    /* ② 空间代价：m 个槽恒占 m 个指针，与 n 无关 */
    {
        int n = 3;
        printf("part 3: 存了 %d 个元素，表仍占 %d 个槽（Θ(m) 空间，m ≫ n 时浪费 —— 这正是 11.2 要解决的）\n",
               n, M);
    }

    /* ③ 习题 11.1-1：找最大值 —— 最坏要扫全部 m 个槽 */
    {
        int cmps = 0, maxKey = -1;
        for (int k = M - 1; k >= 0; k--) {       /* 从后往前扫：故意构造最坏情形 */
            cmps++;
            if (T.slot[k] != NULL) { maxKey = k; break; }
        }
        printf("part 4: 习题 11.1-1 找最大值：最坏扫描了 %d 个槽（Θ(m)）—— 直接寻址表不含顺序信息\n", cmps);
        assert(maxKey == 8);
    }

    /* ④ 习题 11.1-2：无卫星数据 → 位向量（m 位 vs m 个指针） */
    {
        unsigned bits[(M + 31) / 32];
        memset(bits, 0, sizeof(bits));
        int keys[4] = {1, 4, 7, 9};
        for (int i = 0; i < 4; i++) { bits[keys[i] / 32] |= (1u << (keys[i] % 32)); }
        int present = 0;
        for (int k = 0; k < M; k++) {
            if (bits[k / 32] & (1u << (k % 32))) { present++; }
        }
        assert(present == 4);
        printf("part 5: 习题 11.1-2 位向量：%d 个元素用 %d 位（%.0f 字节）；若用指针数组则要 %d 字节（64 位机）\n",
               present, M, M / 8.0, M * 8);
        printf("        ★ 位向量仍是 O(1) 的三个操作，空间从 Θ(m) 指针降到 Θ(m/字长) 字\n");
    }

    /* ⑤ 与"链表按 key 查找 Θ(n)"对照（10.2 的结论） */
    {
        printf("part 6: 对照：直接寻址表 SEARCH 是 O(1)（下标直达）；链表按 key 查找是 Θ(n)（要沿链走）。"
               "代价是要求 key 落在 [0, m−1] 且 m 不能太大\n");
    }

    puts("all checks passed.");
    return 0;
}
