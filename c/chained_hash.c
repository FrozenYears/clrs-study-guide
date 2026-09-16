/* chained_hash.c -- 11.2 节：链接法散列表的实现与负载因子实测。
 *   ① CHAINED-HASH-INSERT / SEARCH / DELETE（各调用 10.2 的链表过程）；
 *   ② 习题 11.2-2 的完整演示（m = 9、h(k) = k mod 9、插入 9 个 key）；
 *   ③ 实测负载因子 α = n/m 与平均查找代价的关系（α 从小到大）；
 *   ④ 最坏情形对照：全部 key 散列到同一槽（退化成一个链表 Θ(n)）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o chained_hash chained_hash.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

#define MMAX 128
#define NMAX 512

/* 双向链表节点（Figure 11.3：链表的删除要 O(1)，所以用双链） */
typedef struct node { int key; struct node *prev, *next; } node_t;

static node_t pool[NMAX];
static int pool_used;
static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->prev = n->next = NULL;
    return n;
}

typedef struct { node_t *slot[MMAX]; int m; int n; long scanned; } ht_t;

static void ht_init(ht_t *T, int m)
{
    T->m = m; T->n = 0; T->scanned = 0;
    for (int i = 0; i < m; i++) { T->slot[i] = NULL; }
}

static int ht_hash(const ht_t *T, int k) { int q = k % T->m; return q < 0 ? q + T->m : q; }

/* CHAINED-HASH-INSERT(T, x)：LIST-PREPEND(T[h(x.key)], x) —— 头插 O(1) */
static void ht_insert(ht_t *T, int key)
{
    int q = ht_hash(T, key);
    node_t *x = mk(key);
    x->next = T->slot[q];
    x->prev = NULL;
    if (T->slot[q] != NULL) { T->slot[q]->prev = x; }
    T->slot[q] = x;
    T->n++;
}

/* CHAINED-HASH-SEARCH(T, k)：LIST-SEARCH(T[h(k)], k) —— 代价 = 扫过的链长 */
static node_t *ht_search(ht_t *T, int k)
{
    int q = ht_hash(T, k);
    node_t *x = T->slot[q];
    while (x != NULL && x->key != k) { T->scanned++; x = x->next; }   /* 每个访问到的节点记 1 次 */
    if (x != NULL) { T->scanned++; }                                   /* 命中的那一次比较 */
    return x;
}

/* CHAINED-HASH-DELETE(T, x)：LIST-DELETE(T[h(x.key)], x) —— 双链下 O(1)。
 * 这里按 key 定位后删除（表内保证无重复 key），便于测试统计。 */
static bool ht_delete_key(ht_t *T, int k)
{
    int q = ht_hash(T, k);
    node_t *x = T->slot[q];
    while (x != NULL && x->key != k) { x = x->next; }
    if (x == NULL) { return false; }
    if (x->prev != NULL) { x->prev->next = x->next; }
    else { T->slot[q] = x->next; }
    if (x->next != NULL) { x->next->prev = x->prev; }
    T->n--;
    return true;
}

static int ht_chain_len(const ht_t *T, int q)
{
    int c = 0;
    for (node_t *x = T->slot[q]; x != NULL; x = x->next) { c++; }
    return c;
}

int main(void)
{
    /* ② 习题 11.2-2：m = 9、h(k) = k mod 9、依次插入 5,28,19,15,20,33,12,17,10 */
    {
        ht_t T; ht_init(&T, 9);
        int keys[9] = {5, 28, 19, 15, 20, 33, 12, 17, 10};
        for (int i = 0; i < 9; i++) { ht_insert(&T, keys[i]); }
        assert(T.n == 9);
        /* 头插带来的链内次序：T[1] 应为 10→19→28 */
        assert(ht_chain_len(&T, 1) == 3);
        assert(T.slot[1]->key == 10 && T.slot[1]->next->key == 19 && T.slot[1]->next->next->key == 28);
        assert(ht_chain_len(&T, 6) == 2 && T.slot[6]->key == 33 && T.slot[6]->next->key == 15);
        assert(ht_chain_len(&T, 2) == 1 && ht_chain_len(&T, 3) == 1 && ht_chain_len(&T, 5) == 1 && ht_chain_len(&T, 8) == 1);
        printf("part 1: 习题 11.2-2：m = 9 插入 9 个 key → 链长分布 ");
        for (int q = 0; q < 9; q++) { printf("T[%d]:%d ", q, ht_chain_len(&T, q)); }
        printf("\n");
        printf("        T[1] = 10→19→28（头插：后插入的在前）、T[6] = 33→15；α = 9/9 = 1.00\n");
    }

    /* ① 三个操作的代价：插入 O(1)、查找 = 扫过的链长、删除 O(1)（双链） */
    {
        ht_t T; ht_init(&T, 13);
        for (int i = 0; i < 13; i++) { ht_insert(&T, i * 13 + 4); }   /* 全部散列到槽 4 → 最坏链长 13 */
        T.scanned = 0;
        assert(ht_search(&T, 4) != NULL);                 /* key 4 最先插入 → 头插后被挤到链尾 */
        printf("part 2: 最坏链（13 个 key 全在 T[4]）里查找命中 key=4：扫过 %ld 个节点"
               "（它就是那条链的最尾一个 —— 命中代价 = 它在链中的位置）\n", T.scanned);
        T.scanned = 0;
        assert(ht_search(&T, 1304) == NULL);              /* 1304 mod 13 = 4 → 落在那条长链上、但不在表里 */
        printf("part 3: 同一链上未命中查找（key = 1304，也散列到 T[4]）：扫过 %ld 个节点 = 整条链长"
               "（Θ(n) 的最坏情形）\n", T.scanned);
        assert(ht_delete_key(&T, 4));                     /* 双链删除 O(1)：只改 2 条指针 */
        assert(T.n == 12);
        printf("part 4: 双链下删除一个节点：改 2 条指针，O(1)（无需再扫链）\n");
    }

    /* ③ 负载因子 α = n/m 与平均查找代价（随机 key，均匀散列） */
    {
        printf("part 5: 负载因子与平均扫描长度（m = 61，20 组随机 key 取平均）\n");
        for (int ai = 0; ai < 3; ai++) {
            int alpha = 1 << ai;                        /* α ≈ 1, 2, 4 */
            int m = 61, n = m * alpha;
            long total = 0, trials = 0;
            for (int t = 0; t < 20; t++) {
                int seed = t * 7919 + 13;
                pool_used = 0;                          /* 每组重新分配节点池 */
                ht_t T; ht_init(&T, m);
                for (int i = 0; i < n; i++) {
                    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
                    int k = seed % 100000;
                    node_t *f = ht_search(&T, k);
                    if (f == NULL) { ht_insert(&T, k); }
                }
                /* 未命中查找的平均扫描长度 ≈ α */
                long sc = 0;
                for (int i = 0; i < 200; i++) {
                    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
                    T.scanned = 0;
                    (void)ht_search(&T, seed % 100000 + 1000000);   /* 保证未命中 */
                    sc += T.scanned;
                }
                total += sc; trials += 200;
            }
            printf("        α ≈ %d：未命中查找平均扫过 %.2f 个节点（理论 ≈ α = %d）\n",
                   alpha, (double)total / trials, alpha);
        }
    }

    /* ④ 对照：全部 key 散列到同一槽时，散列表退化成一条链表 */
    {
        ht_t T; ht_init(&T, 100);
        for (int i = 0; i < 50; i++) { ht_insert(&T, i * 100); }   /* 全部 → 槽 0（因为 100 | 100i） */
        assert(ht_chain_len(&T, 0) == 50);
        T.scanned = 0;
        (void)ht_search(&T, 10000);                                /* 10000 mod 100 = 0 → 落在那条长链上 */
        printf("part 6: 退化情形：50 个 key 全落在 T[0]，未命中查找扫过 %ld 个节点 —— "
               "与「只用一条链表」没有区别（这就是最坏 Θ(n)）\n", T.scanned);
    }

    puts("all checks passed.");
    return 0;
}
