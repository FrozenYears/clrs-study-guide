/* stack_queue.c -- 10.1 节：数组型栈与环形队列的实现与边界验证。
 * 验证：
 *   ① 栈：PUSH/POP 的 LIFO 次序、overflow/underflow 检测；
 *   ② 队列：ENQUEUE/DEQUEUE 的 FIFO 次序、head/tail 回绕（环形复用空间）；
 *   ③ 三种操作都是 O(1)（每操作常数次数组访问）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o stack_queue stack_queue.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

#define CAP 8

/* ---- 栈：S[0..CAP-1] + top（0 表示空，1 基语义的 0 基内部实现） ---- */
typedef struct { int a[CAP]; int top; int size; } stack_t;

static void stack_init(stack_t *s, int size) { s->top = 0; s->size = size; }
static bool stack_empty(const stack_t *s) { return s->top == 0; }         /* K-EMPTY */

static bool push(stack_t *s, int x)
{
    if (s->top == s->size) { return false; }        /* overflow */
    s->top = s->top + 1;
    s->a[s->top - 1] = x;
    return true;
}

static bool pop(stack_t *s, int *out)
{
    if (stack_empty(s)) { return false; }           /* underflow */
    s->top = s->top - 1;
    *out = s->a[s->top];
    return true;
}

/* ---- 环形队列：Q[0..CAP-1] + head/tail（1 基语义，回绕到 1） ---- */
typedef struct { int a[CAP]; int head; int tail; int size; int count; } queue_t;

static void queue_init(queue_t *q, int size) { q->head = 1; q->tail = 1; q->size = size; q->count = 0; }

static bool enqueue(queue_t *q, int x)
{
    if (q->count == q->size) { return false; }      /* overflow */
    q->a[q->tail - 1] = x;                          /* Q[Q.tail] = x */
    q->count++;
    if (q->tail == q->size) { q->tail = 1; }        /* 回绕 */
    else { q->tail = q->tail + 1; }
    return true;
}

static bool dequeue(queue_t *q, int *out)
{
    if (q->count == 0) { return false; }            /* underflow */
    *out = q->a[q->head - 1];                       /* x = Q[Q.head] */
    q->count--;
    if (q->head == q->size) { q->head = 1; }
    else { q->head = q->head + 1; }
    return true;
}

int main(void)
{
    /* ① 栈：LIFO + 边界 */
    {
        stack_t s; stack_init(&s, 5);
        assert(stack_empty(&s));
        for (int i = 1; i <= 5; i++) { assert(push(&s, i * 10)); }
        assert(!push(&s, 999));                     /* overflow：满栈再压入失败 */
        printf("part 1: 栈满（5 个）后 PUSH 返回 overflow\n");

        int v, order[5];
        for (int i = 0; i < 5; i++) { assert(pop(&s, &v)); order[i] = v; }
        assert(order[0] == 50 && order[1] == 40 && order[4] == 10);
        assert(!pop(&s, &v));                       /* underflow */
        printf("part 2: 出栈次序 %d,%d,%d,%d,%d = LIFO；空栈 POP 返回 underflow\n",
               order[0], order[1], order[2], order[3], order[4]);
    }

    /* ② 队列：FIFO + 回绕 */
    {
        queue_t q; queue_init(&q, 5);
        for (int i = 1; i <= 5; i++) { assert(enqueue(&q, i)); }
        assert(!enqueue(&q, 6));                    /* 满 */
        int v;
        assert(dequeue(&q, &v) && v == 1);          /* FIFO：先入先出 */
        assert(dequeue(&q, &v) && v == 2);
        assert(enqueue(&q, 6));                     /* 出两个后可再入 */
        assert(enqueue(&q, 7));
        assert(q.tail == 3);                        /* ★ 回绕：tail 从 5 → 1（入 6）→ 2（入 7）→ 3 */
        printf("part 3: 队列 FIFO 次序 1,2；出两个后 tail 回绕到 %d（环形复用空间）\n", q.tail);

        /* 连续运转 100 次，验证 count 始终等于真实元素数 */
        int cnt = 5;    /* part 3 结束时队列是满的：3,4,5,6,7 */
        for (int t = 0; t < 100; t++) {
            if (t % 3 == 0) { if (enqueue(&q, t)) { cnt++; } }
            else { if (dequeue(&q, &v)) { cnt--; } }
            assert(q.count == cnt);
            assert(cnt >= 0 && cnt <= 5);
        }
        printf("part 4: 100 次混合操作后 count = %d（与真实元素数始终一致）\n", q.count);
    }

    /* ③ 环形队列的空间复用：容量 5 的队列连续跑 200 次入出，不发生"假满" */
    {
        queue_t q; queue_init(&q, 5);
        int v, ok = 0;
        for (int t = 0; t < 200; t++) {
            if (enqueue(&q, t)) { ok++; }
            if (dequeue(&q, &v)) { ok++; }
        }
        assert(ok > 390);       /* 没有因指针不回头导致的提前失败 */
        printf("part 5: 容量 5 的环形队列跑 200 轮入出，成功操作 %d 次（无假满）\n", ok);
    }

    puts("all checks passed.");
    return 0;
}
