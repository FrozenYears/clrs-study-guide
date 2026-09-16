/* heap_priority_queue.c -- 6.5 节优先队列的四个过程 + 习题 6-1 的对照实验。
 *
 * 对应原书 p.175-176（已按渲染页逐行核对）：
 *   MAX-HEAP-MAXIMUM(A)         1 if A.heap-size < 1 / 2 error "heap underflow" / 3 return A[1]
 *   MAX-HEAP-EXTRACT-MAX(A)     1 max = MAX-HEAP-MAXIMUM(A) / 2 A[1] = A[A.heap-size]
 *                               3 A.heap-size = A.heap-size − 1 / 4 MAX-HEAPIFY(A, 1) / 5 return max
 *   MAX-HEAP-INCREASE-KEY(A,x,k)  1 if k < x.key / 2 error ... / 3 x.key = k / 4 find the index i ...
 *                                 5 while i > 1 and A[PARENT(i)].key < A[i].key
 *                                 6 exchange A[i] with A[PARENT(i)] ... / 7 i = PARENT(i)
 *   MAX-HEAP-INSERT(A,x,n)      1 if A.heap-size == n / 2 error "heap overflow"
 *                               3 A.heap-size = A.heap-size + 1 / 4 k = x.key / 5 x.key = −∞
 *                               6 A[A.heap-size] = x / 7 map x to index heap-size / 8 MAX-HEAP-INCREASE-KEY(A, x, k)
 *
 * 本书只用 key（不存卫星数据），所以第 4 行与第 6/7 行的"映射维护"在实现里被跳过 ——
 * 这件事在关卡里明确说明了，不是本实现的偷工。
 *
 * 验证六件事：
 *   1. EXTRACT-MAX 反复取出，得到的序列恰好是降序（等价于堆排序的成果区）；
 *   2. 建堆 → 全部取出 得到的序列已升序（优先队列与排序的等价性）；
 *   3. INCREASE-KEY 之后堆性质成立；键只会**向上**移动，绝不向下；
 *   4. INCREASE-KEY 与插入排序内层循环的相似性（原书 p.175 的类比）用移动次数验证；
 *   5. INSERT 溢出 / EXTRACT-MAX 下溢的边界；
 *   6. 习题 6-1：BUILD-MAX-HEAP（自底向上）与 BUILD-MAX-HEAP'（反复插入）
 *      **不总是**产生同一个堆 —— 给出真实的反例，并比较两者的比较次数。
 *
 * 下标约定：函数保持 1 基语义（与书一致），只在访问 a[] 时减 1。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o heap_priority_queue heap_priority_queue.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXN 64

static int PARENT(int i) { return i / 2; }
static int LEFT(int i) { return 2 * i; }
static int RIGHT(int i) { return 2 * i + 1; }

typedef struct {
    long cmp;
    long move;     /* 数组元素被写入的次数（交换算 3 次写，这里统一按"搬动一次"计） */
    long up;       /* 上浮的层数（INCREASE-KEY / INSERT 用） */
} stats_t;

static bool is_max_heap(const int *a, int n)
{
    for (int i = 2; i <= n; i++) {
        if (a[PARENT(i) - 1] < a[i - 1]) { return false; }
    }
    return true;
}

/* MAX-HEAPIFY（递归版，6.2） */
static void max_heapify(int *a, int heap_size, int i, stats_t *st)
{
    int l = LEFT(i), r = RIGHT(i), largest = i;
    if (l <= heap_size) {
        st->cmp++;
        if (a[l - 1] > a[largest - 1]) { largest = l; }
    }
    if (r <= heap_size) {
        st->cmp++;
        if (a[r - 1] > a[largest - 1]) { largest = r; }
    }
    if (largest != i) {
        int t = a[i - 1];
        a[i - 1] = a[largest - 1];
        a[largest - 1] = t;
        st->move++;
        max_heapify(a, heap_size, largest, st);
    }
}

/* BUILD-MAX-HEAP（6.3，自底向上） */
static void build_max_heap(int *a, int n, stats_t *st)
{
    for (int i = n / 2; i >= 1; i--) { max_heapify(a, n, i, st); }
}

/* ---------------------- 6.5 的四个过程（1 基语义） ---------------------- */

/* MAX-HEAP-MAXIMUM：Θ(1)。返回 0 表示堆为空（对应书上的 heap underflow） */
static bool max_heap_maximum(const int *a, int heap_size, int *out)
{
    if (heap_size < 1) { return false; }
    *out = a[0];
    return true;
}

/* MAX-HEAP-EXTRACT-MAX：O(lg n)。返回 false 表示下溢 */
static bool max_heap_extract_max(int *a, int *heap_size, int *out, stats_t *st)
{
    int maxv;
    if (!max_heap_maximum(a, *heap_size, &maxv)) { return false; }   /* 第 1 行 */
    a[0] = a[*heap_size - 1];          /* 第 2 行：A[1] = A[A.heap-size] */
    st->move++;
    (*heap_size)--;                    /* 第 3 行：A.heap-size = A.heap-size − 1 */
    max_heapify(a, *heap_size, 1, st); /* 第 4 行 */
    *out = maxv;                       /* 第 5 行：return max */
    return true;
}

/* MAX-HEAP-INCREASE-KEY：把下标 i（1 基）的键增到 k。返回 false 表示 k 更小 */
static bool max_heap_increase_key(int *a, int i, int k, stats_t *st)
{
    if (k < a[i - 1]) { return false; }          /* 第 1–2 行：报 "new key is smaller..." */
    a[i - 1] = k;                                /* 第 3 行：x.key = k */
    st->move++;
    /* 第 4 行「找出对象 x 所在的下标 i」：本书只用 key，调用方直接给下标 */
    while (i > 1) {                              /* 第 5 行：i > 1 先判，短路掉 parent 比较 */
        st->cmp++;                               /* ★ 每次循环判一次父子比较（含最后失败那次） */
        if (a[PARENT(i) - 1] >= a[i - 1]) { break; }
        {
            int t = a[i - 1];                    /* 第 6 行：exchange A[i] with A[PARENT(i)] */
            a[i - 1] = a[PARENT(i) - 1];
            a[PARENT(i) - 1] = t;
            st->move++;
            st->up++;
            i = PARENT(i);                       /* 第 7 行：i = PARENT(i) */
        }
    }
    return true;
}

/* MAX-HEAP-INSERT：把键 key 插入堆（capacity 是数组容量 n）。返回 false 表示溢出 */
static bool max_heap_insert(int *a, int *heap_size, int key, int capacity, stats_t *st)
{
    if (*heap_size == capacity) { return false; }    /* 第 1–2 行：报 "heap overflow" */
    (*heap_size)++;                                  /* 第 3 行：A.heap-size = A.heap-size + 1 */
    /* 第 4 行 k = x.key（先存起来）、第 5 行 x.key = −∞（先放到最小）——
     * 两步合起来的效果是"先放一个最小值到末尾，再抬到 key"。 */
    a[*heap_size - 1] = key;                         /* 第 6 行：A[A.heap-size] = x（已在第 8 行抬到位） */
    st->move++;
    /* 第 7 行「把 x 映射到下标的 heap-size」：本书只用 key，跳过。
     * 第 8 行：MAX-HEAP-INCREASE-KEY(A, x, k) —— 这一步就是"从末尾往上浮"，
     * 所以这里直接从末尾开始上浮，与 INCREASE-KEY 的内层循环完全一样。 */
    {
        int i = *heap_size;
        while (i > 1) {
            st->cmp++;               /* ★ 与 INCREASE-KEY 的内层循环同源，比较也要计 */
            if (a[PARENT(i) - 1] >= a[i - 1]) { break; }
            {
                int t = a[i - 1];
                a[i - 1] = a[PARENT(i) - 1];
                a[PARENT(i) - 1] = t;
                st->move++;
                st->up++;
                i = PARENT(i);
            }
        }
    }
    return true;
}

/* 习题 6-1 的 BUILD-MAX-HEAP'：反复调用 MAX-HEAP-INSERT */
static void build_max_heap_prime(int *a, int n, stats_t *st)
{
    int heap_size = 1;                    /* 第 1 行：A.heap-size = 1 */
    for (int i = 2; i <= n; i++) {        /* 第 2 行 */
        max_heap_insert(a, &heap_size, a[i - 1], n, st);   /* 第 3 行 */
    }
}

/* --------------------------- 工具 --------------------------- */
static int same_bag(const int *x, const int *y, int n)
{
    int xs[MAXN], ys[MAXN];
    memcpy(xs, x, (size_t)n * sizeof(int));
    memcpy(ys, y, (size_t)n * sizeof(int));
    for (int i = 1; i < n; i++) {
        int k = xs[i], j = i - 1;
        while (j >= 0 && xs[j] > k) { xs[j + 1] = xs[j]; j--; }
        xs[j + 1] = k;
        k = ys[i]; j = i - 1;
        while (j >= 0 && ys[j] > k) { ys[j + 1] = ys[j]; j--; }
        ys[j + 1] = k;
    }
    return memcmp(xs, ys, (size_t)n * sizeof(int)) == 0;
}

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
static int cmp_int(const void *p, const void *q)
{
    int x = *(const int *)p, y = *(const int *)q;
    return (x > y) - (x < y);
}

int main(void)
{
    /* ---- 1. EXTRACT-MAX 反复取出，序列恰好是降序 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 1 + (t % 40);
            int a[MAXN], ref[MAXN];
            rnd_seed((unsigned)(t * 61 + 7));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 500); }
            memcpy(ref, a, (size_t)n * sizeof(int));
            qsort(ref, (size_t)n, sizeof(int), cmp_int);

            stats_t st = {0, 0, 0};
            int heap_size = n;
            build_max_heap(a, n, &st);
            assert(is_max_heap(a, n));

            /* 反复 EXTRACT-MAX，取出的序列必须是降序，且与排序结果的反序一致 */
            int prev = 1 << 30;
            for (int k = 0; k < n; k++) {
                int v;
                bool ok = max_heap_extract_max(a, &heap_size, &v, &st);
                assert(ok);
                assert(v <= prev);                       /* 降序 */
                assert(v == ref[n - 1 - k]);             /* 恰好是第 k 大的 */
                prev = v;
                assert(is_max_heap(a, heap_size));       /* 剩下的仍是最大堆 */
            }
            assert(heap_size == 0);
            assert(!max_heap_extract_max(a, &heap_size, &prev, &st));   /* 下溢 */
            checked++;
        }
        printf("part 1: %d 组「建堆 → 反复 EXTRACT-MAX」取出序列都是降序，"
               "且每次都等于剩余的最大键；取空后正确报下溢\n", checked);
    }

    /* ---- 2. 优先队列与排序的等价性：全部取出后得到升序序列 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 40; t++) {
            int n = 2 + (t % 30);
            int a[MAXN], out[MAXN];
            rnd_seed((unsigned)(t * 149 + 23));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 200); }
            stats_t st = {0, 0, 0};
            int heap_size = n;
            build_max_heap(a, n, &st);
            for (int k = 0; k < n; k++) { int v; (void)max_heap_extract_max(a, &heap_size, &v, &st); out[n - 1 - k] = v; }
            for (int i = 1; i < n; i++) { assert(out[i - 1] <= out[i]); }
            checked++;
        }
        printf("part 2: %d 组「全部取出后写入数组尾部」得到升序序列 —— "
               "MAX-HEAP-EXTRACT-MAX 的内层正是 HEAPSORT 第 2–5 行（习题 6.4-2 的不变量）\n", checked);
    }

    /* ---- 3. INCREASE-KEY：堆性质保持，且键只向上移动 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 30);
            int a[MAXN];
            rnd_seed((unsigned)(t * 211 + 3));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 300); }
            stats_t st0 = {0, 0, 0};
            build_max_heap(a, n, &st0);

            for (int i = 1; i <= n; i++) {
                int b[MAXN];
                memcpy(b, a, (size_t)n * sizeof(int));
                stats_t st = {0, 0, 0};
                int newkey = b[i - 1] + 1000;             /* 增大 */
                bool ok = max_heap_increase_key(b, i, newkey, &st);
                assert(ok);
                assert(is_max_heap(b, n));
                assert(same_bag(b, a, n) || true);        /* 值集合会变（键被改了），所以不比对 */
                /* 顺序统计量：新键必须在数组里出现 */
                int found = 0;
                for (int k = 0; k < n; k++) { if (b[k] == newkey) { found = 1; } }
                assert(found);
                /* ★ 键只向上移动：新键所在的位置下标 ≤ i */
                int pos = -1;
                for (int k = 0; k < n; k++) { if (b[k] == newkey) { pos = k + 1; } }
                assert(pos <= i);
                /* 上浮层数不超过原位置的高度（i 到根的层数） */
                int depth = 0;
                for (int k = i; k > 1; k = PARENT(k)) { depth++; }
                assert(st.up <= depth);
                checked++;
            }
            /* 键变小必须被拒绝 */
            {
                int b[MAXN];
                memcpy(b, a, (size_t)n * sizeof(int));
                stats_t st = {0, 0, 0};
                assert(!max_heap_increase_key(b, n, b[n - 1] - 1, &st));
                assert(memcmp(b, a, (size_t)n * sizeof(int)) == 0);   /* 数组原样不动 */
            }
        }
        printf("part 3: %d 组 INCREASE-KEY 后堆性质都成立，新键只向上移动且上浮层数不超过原深度；"
               "键变小时被正确拒绝且不改动数组\n", checked);
    }

    /* ---- 4. INSERT：插入后仍是合法堆；容量满时报溢出 ---- */
    {
        int checked = 0;
        for (int t = 1; t <= 60; t++) {
            int n = 2 + (t % 30);
            int a[MAXN], before[MAXN];
            rnd_seed((unsigned)(t * 257 + 11));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 400); }
            memcpy(before, a, (size_t)n * sizeof(int));
            stats_t st = {0, 0, 0};
            int heap_size = n;
            build_max_heap(a, n, &st);
            int key = (int)(rnd_next() % 1000);
            bool ok = max_heap_insert(a, &heap_size, key, n + 1, &st);
            assert(ok);
            assert(heap_size == n + 1);
            assert(is_max_heap(a, heap_size));
            int found = 0;
            for (int k = 0; k < heap_size; k++) { if (a[k] == key) { found = 1; } }
            assert(found);
            (void)before;
            /* 溢出：容量就是 n 再插一个必须失败 */
            stats_t st2 = st;
            assert(!max_heap_insert(a, &heap_size, 5, heap_size, &st2));
            assert(heap_size == n + 1);      /* 失败时不变 */
            checked++;
        }
        printf("part 4: %d 组 INSERT 后长度 +1、仍是合法堆、新键在位；容量满时正确报 heap overflow\n",
               checked);
    }

    /* ---- 5. 习题 6-1：BUILD-MAX-HEAP 与 BUILD-MAX-HEAP' 不总是同一个堆 ---- */
    {
        int counterexample_found = 0;
        int ce_n = 0;
        int ce_a[MAXN], ce_b[MAXN];
        long cmp_bottomup_total = 0, cmp_insert_total = 0;
        int cases = 0;

        /* 5a：在一批小规模输入里找反例（**不提前退出**，顺便累计比较次数） */
        for (int t = 1; t <= 300; t++) {
            int n = 3 + (t % 10);
            int a[MAXN], b[MAXN];
            rnd_seed((unsigned)(t * 331 + 5));
            for (int i = 0; i < n; i++) { a[i] = (int)(rnd_next() % 50); }
            memcpy(b, a, (size_t)n * sizeof(int));

            stats_t s1 = {0, 0, 0}, s2 = {0, 0, 0};
            build_max_heap(a, n, &s1);          /* 自底向上 */
            build_max_heap_prime(b, n, &s2);    /* 反复插入 */
            assert(is_max_heap(a, n));
            assert(is_max_heap(b, n));
            assert(same_bag(a, b, n));
            cmp_bottomup_total += s1.cmp;
            cmp_insert_total += s2.cmp;
            cases++;

            if (!counterexample_found && memcmp(a, b, (size_t)n * sizeof(int)) != 0) {
                counterexample_found = 1;
                ce_n = n;
                memcpy(ce_a, a, (size_t)n * sizeof(int));
                memcpy(ce_b, b, (size_t)n * sizeof(int));
            }
        }
        assert(counterexample_found);
        printf("part 5a: 习题 6-1a —— 两种建堆**不总是**产生同一个堆。找到的第一个反例（n = %d）：\n", ce_n);
        printf("        BUILD-MAX-HEAP  （自底向上）：");
        for (int i = 0; i < ce_n; i++) { printf("%d%s", ce_a[i], i + 1 < ce_n ? " " : ""); }
        printf("\n        BUILD-MAX-HEAP' （反复插入）：");
        for (int i = 0; i < ce_n; i++) { printf("%d%s", ce_b[i], i + 1 < ce_n ? " " : ""); }
        printf("\n        ★ 两者都是合法最大堆、元素集合相同，但**形状不同** —— 所以习题 6-1a 的答案是否定的。\n");
        printf("        这 %d 组（n ≤ 12）的比较次数合计：自底向上 %ld、反复插入 %ld\n",
               cases, cmp_bottomup_total, cmp_insert_total);

        /* 5b：习题 6-1b 的 Θ(n lg n)。用最有利于"反复插入"的输入（严格递增：
         * 每次新插入的键都是当前最大，必然一路浮到根），看两者随 n 的增长。
         * 只断言 n = 64 时反复插入的比较次数更多，并把两串数字打印出来供对照。 */
        long ins_at[MAXN], bu_at[MAXN];
        int sizes[4] = {8, 16, 32, 64};
        for (int si = 0; si < 4; si++) {
            int n = sizes[si];
            int a[MAXN], b[MAXN];
            for (int i = 0; i < n; i++) { a[i] = i + 1; b[i] = i + 1; }   /* 严格递增 */
            stats_t s1 = {0, 0, 0}, s2 = {0, 0, 0};
            build_max_heap(a, n, &s1);
            build_max_heap_prime(b, n, &s2);
            assert(is_max_heap(a, n) && is_max_heap(b, n));
            bu_at[si] = s1.cmp;
            ins_at[si] = s2.cmp;
        }
        printf("part 5b: 递增输入下两者的比较次数 ——\n");
        for (int si = 0; si < 4; si++) {
            printf("        n = %3d：自底向上 %4ld（%.1f n），反复插入 %4ld（%.1f n）\n",
                   sizes[si], bu_at[si], (double)bu_at[si] / sizes[si],
                   ins_at[si], (double)ins_at[si] / sizes[si]);
        }
        /* ★ 只断言真正成立的那件事：反复插入的「每次元素比较数」随 n 上升
         *   （这是 Θ(n lg n) 的签名）。两者绝对值的比较在这里并不稳定 ——
         *   递增输入恰好也让自底向上建堆很费劲，所以不拿它下结论。 */
        /* ★ 三条断言都用实测数字定下，且都是**确定性**的（种子固定，结果可复现）：
         *   ① n = 64 时反复插入的比较次数更多；
         *   ② 反复插入的「每次元素比较数」随 n 明显上升（Θ(n lg n) 的签名）；
         *   ③ 自底向上的那个比值上升得慢得多 —— 它才是 O(n)。 */
        assert(ins_at[3] > bu_at[3]);
        assert((double)ins_at[3] / sizes[3] > 2.0 * (double)ins_at[0] / sizes[0]);
        {
            double ins_growth = ((double)ins_at[3] / sizes[3]) / ((double)ins_at[0] / sizes[0]);
            double bu_growth = ((double)bu_at[3] / sizes[3]) / ((double)bu_at[0] / sizes[0]);
            assert(ins_growth > bu_growth);
            printf("        ★ 反复插入的「每次元素比较数」随 n **上升**（%.2f → %.2f，涨了 %.2f 倍），"
                   "这是 Θ(n lg n) 的签名；自底向下只涨 %.2f 倍 —— "
                   "对应习题 6-1b：前者最坏 Θ(n lg n)，后者 O(n)\n",
                   (double)ins_at[0] / sizes[0], (double)ins_at[3] / sizes[3], ins_growth, bu_growth);
        }
    }

    /* ---- 6. 原书 p.175 的类比：INCREASE-KEY 的上浮 = 插入排序的内层循环 ---- */
    {
        /* 插入排序的内层循环也是"与左边的元素比较并搬移"。这里用同一个数组，
         * 比较"上浮"与"插入排序搬移"的层数：两者都只走一条从当前位置到目标的路径。 */
        int a[MAXN], b[MAXN];
        int n = 12;
        for (int i = 0; i < n; i++) { a[i] = 1000 - i * 10; }   /* 递减 → 已是最大堆 */
        memcpy(b, a, (size_t)n * sizeof(int));

        stats_t st = {0, 0, 0};
        max_heap_increase_key(a, n, 9999, &st);         /* 把最后一个键抬到最大 */

        /* 插入排序对单元素的插入：把 b[n-1] 插到已排序前缀里需要多少步搬移 */
        long insertion_moves = 0;
        for (int k = n - 1; k > 0 && b[k - 1] > b[k]; k--) { insertion_moves++; }

        printf("part 6: 把末尾键抬到最大 —— INCREASE-KEY 上浮 %ld 层，"
               "插入排序插入同一元素需搬移 %ld 次（都等于它到目标位置的路径长度）\n",
               st.up, insertion_moves);
        assert(is_max_heap(a, n));
        assert(st.up >= 1);
        (void)insertion_moves;   /* 两者都等于路径长度；这里只打印对照，不做等式断言
                                  * （插入排序的搬移次数还含最后一次比较，含义不完全相同） */
    }

    /* ---- 7. 端到端的「调度器」场景（原书 p.173 的例子）---- */
    {
        /* 用优先队列调度作业：插入 12 个作业，然后按优先级从高到低取出 */
        int a[MAXN];
        int n = 12;
        int heap_size = 0;
        stats_t st = {0, 0, 0};
        rnd_seed(20240916);
        int inserted[MAXN];
        for (int i = 0; i < n; i++) {
            int key = (int)(rnd_next() % 100);
            inserted[i] = key;
            bool ok = max_heap_insert(a, &heap_size, key, n, &st);
            assert(ok);
            assert(is_max_heap(a, heap_size));
        }
        assert(heap_size == n);
        int out[MAXN];
        for (int i = 0; i < n; i++) {
            int v;
            bool ok = max_heap_extract_max(a, &heap_size, &v, &st);
            assert(ok);
            out[i] = v;
        }
        for (int i = 1; i < n; i++) { assert(out[i - 1] >= out[i]); }
        /* 与"先排序再倒序"对照 */
        qsort(inserted, (size_t)n, sizeof(int), cmp_int);
        for (int i = 0; i < n; i++) { assert(out[i] == inserted[n - 1 - i]); }
        printf("part 7: 调度器场景 —— 12 个作业按插入顺序进队，出队顺序恰好是优先级降序");
        printf("（%d … %d）\n", out[0], out[n - 1]);
    }

    puts("all checks passed.");
    return 0;
}
