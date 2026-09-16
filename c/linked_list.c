/* linked_list.c -- 10.2 节：双向链表（含哨兵版）的实现与代价验证。
 * 验证：
 *   ① LIST-SEARCH：沿 next 线性查找（最坏 Θ(n)）；
 *   ② LIST-PREPEND / LIST-INSERT / LIST-DELETE：只改 2–3 条指针，O(1)；
 *   ③ 哨兵版：删掉表头/表尾的边界分支，代码更短（原书 p.262–263 的 LIST-INSERT'/LIST-DELETE'）；
 *   ④ 对照：数组删除中间元素要搬动 Θ(n) 个元素，链表只改指针。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o linked_list linked_list.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

#define MAXN 64

/* ---- 无哨兵的双向链表（图 10.4 的形态） ---- */
typedef struct node {
    int key;
    struct node *prev, *next;
} node_t;

static node_t pool[MAXN * 2];
static int pool_used;

static node_t *new_node(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->prev = NULL; n->next = NULL;
    return n;
}

typedef struct { node_t *head; } list_t;

static void list_init(list_t *L) { L->head = NULL; }

/* LIST-SEARCH(L, k)：返回第一个 key = k 的节点；返回 NULL 表示 NIL */
static node_t *list_search(list_t *L, int k, long *cmps)
{
    node_t *x = L->head;
    *cmps = 0;
    while (x != NULL && x->key != k) {
        (*cmps)++;
        x = x->next;
    }
    if (x != NULL) { (*cmps)++; }
    return x;
}

/* LIST-PREPEND(L, x) —— 3 条指针改写（含 L.head 本身） */
static void list_prepend(list_t *L, node_t *x)
{
    x->next = L->head;
    x->prev = NULL;
    if (L->head != NULL) { L->head->prev = x; }     /* 边界：空表时跳过 */
    L->head = x;
}

/* LIST-INSERT(x, y)：把 x 插到 y 之后 —— 2 条指针改写 + 1 条边界判断 */
static void list_insert_after(node_t *x, node_t *y)
{
    x->next = y->next;
    x->prev = y;
    if (y->next != NULL) { y->next->prev = x; }     /* 边界：y 是表尾时跳过 */
    y->next = x;
}

/* LIST-DELETE(L, x) —— 2 条指针改写 + 2 处边界判断 */
static void list_delete(list_t *L, node_t *x)
{
    if (x->prev != NULL) { x->prev->next = x->next; }
    else { L->head = x->next; }                     /* 边界：x 是表头 */
    if (x->next != NULL) { x->next->prev = x->prev; }
    /* 边界：x 是表尾（x->next == NULL）时无需改写后继 */
}

static int list_len(const list_t *L)
{
    int n = 0;
    for (node_t *x = L->head; x != NULL; x = x->next) { n++; }
    return n;
}

static bool list_sorted(const list_t *L)
{
    for (node_t *x = L->head; x != NULL && x->next != NULL; x = x->next) {
        if (x->key > x->next->key) { return false; }
    }
    return true;
}

/* ---- 带哨兵的双向循环链表（原书 p.262–263） ---- */
typedef struct { node_t *nil; } slist_t;

static void slist_init(slist_t *L)
{
    L->nil = new_node(0);
    L->nil->next = L->nil;
    L->nil->prev = L->nil;
}

/* LIST-INSERT'(x, y)：把 x 插到 y 之后 —— 无任何边界判断 */
static void slist_insert_after(node_t *x, node_t *y)
{
    x->next = y->next;
    x->prev = y;
    y->next->prev = x;      /* ★ 不需要判空：循环 + 哨兵保证 y->next 永不为 NULL */
    y->next = x;
}

/* LIST-DELETE'(x)：从链表摘除 x —— 2 行，无边界判断。
 * ★ 注意参数里根本没有链表：哨兵版连"是哪个链表"都不需要知道（原书 LIST-DELETE' 的签名）。 */
static void slist_delete(node_t *x)
{
    x->prev->next = x->next;
    x->next->prev = x->prev;
}

static int slist_len(const slist_t *L)
{
    int n = 0;
    for (node_t *x = L->nil->next; x != L->nil; x = x->next) { n++; }
    return n;
}

int main(void)
{
    /* ① LIST-SEARCH 与 O(1) 增删 */
    {
        list_t L; list_init(&L);
        int keys[5] = {1, 4, 9, 16, 25};
        for (int i = 0; i < 5; i++) { list_prepend(&L, new_node(keys[4 - i])); }
        assert(list_len(&L) == 5 && list_sorted(&L));
        printf("part 1: 5 次 LIST-PREPEND 后链表 = ");
        for (node_t *x = L.head; x; x = x->next) { printf("%d%s", x->key, x->next ? " → " : ""); }
        printf("（升序，符合原书 Figure 10.4 的形态）\n");

        long cmps;
        node_t *f = list_search(&L, 16, &cmps);
        assert(f != NULL && f->key == 16 && cmps == 4);
        printf("part 2: LIST-SEARCH(16) 命中，比较 %ld 次（走到第 4 个节点）\n", cmps);
        node_t *nf = list_search(&L, 7, &cmps);
        assert(nf == NULL && cmps == 5);
        printf("part 3: LIST-SEARCH(7) 未命中，比较 %ld 次 = n（最坏情形 Θ(n)）\n", cmps);

        /* LIST-INSERT 到 9 之后 */
        node_t *nine = list_search(&L, 9, &cmps);
        list_insert_after(new_node(12), nine);
        assert(list_len(&L) == 6 && list_sorted(&L));
        printf("part 4: LIST-INSERT 到 9 之后 → ");
        for (node_t *x = L.head; x; x = x->next) { printf("%d%s", x->key, x->next ? " → " : ""); }
        printf("（O(1) 完成）\n");

        /* LIST-DELETE 表头、中间、表尾各一次 —— 覆盖三种边界 */
        list_delete(&L, L.head);                             /* 表头 */
        assert(list_len(&L) == 5 && L.head->key == 4);
        node_t *twelve = list_search(&L, 12, &cmps);
        list_delete(&L, twelve);                             /* 中间 */
        assert(list_len(&L) == 4 && list_sorted(&L));
        node_t *tail = L.head;
        while (tail->next) { tail = tail->next; }
        list_delete(&L, tail);                               /* 表尾 */
        assert(list_len(&L) == 3);
        printf("part 5: LIST-DELETE 覆盖表头/中间/表尾三种边界，都只改 2 条指针\n");
    }

    /* ② 哨兵版：同样的插入与删除，代码里没有边界分支 */
    {
        slist_t L; slist_init(&L);
        for (int i = 0; i < 5; i++) { slist_insert_after(new_node((i + 1) * 3), L.nil->prev); }
        assert(slist_len(&L) == 5);
        node_t *x = L.nil->next;                 /* 第一个元素 */
        slist_delete(x);                         /* 删表头：无需特判 */
        assert(slist_len(&L) == 4);
        node_t *t = L.nil->prev;
        slist_delete(t);                         /* 删表尾：无需特判 */
        assert(slist_len(&L) == 3);
        printf("part 6: 哨兵版删除表头与表尾各一次，共 2 行代码、0 个边界判断（计数 = %d）\n",
               slist_len(&L));

        /* 环性质：从任意节点出发都能回到哨兵 */
        node_t *cur = L.nil->next;
        int steps = 0;
        while (cur != L.nil && steps < 100) { cur = cur->next; steps++; }
        assert(cur == L.nil && steps == 3);
        printf("part 7: 哨兵链表是环形的（走 %d 步回到哨兵，与元素数一致）\n", steps);
    }

    /* ③ 对照：数组删除中间元素要搬动 Θ(n) 个元素 */
    {
        int a[MAXN], n = 32;
        for (int i = 0; i < n; i++) { a[i] = i; }
        int moves = 0;
        for (int i = 8; i < n - 1; i++) { a[i] = a[i + 1]; moves++; }   /* 删 a[8] */
        n--;
        printf("part 8: 数组删除第 9 个元素要搬动 %d 个元素（Θ(n)）；链表只改 2 条指针（O(1)）\n", moves);
    }

    puts("all checks passed.");
    return 0;
}
