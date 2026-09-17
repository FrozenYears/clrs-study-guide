/* offline_caching.c -- 15.4: 离线缓存（Offline caching）。
 * 实现 furthest-in-future（FFU，最优离线策略）并对比 LRU 与 FIFO。
 * 例子：缓存容量 k = 2，请求序列 1,2,3,1,2,3。
 *   FFU 缺失 4 次（最优）；LRU 缺失 6 次；FIFO 缺失 6 次。
 * 竞争比（本站补充，源自 Sleator-Tarjan）：LRU 与 FIFO 都是 k-竞争的，
 * 即 miss(LRU) ≤ k · miss(OPT)；FFU 即 OPT 本身，竞争比 1。 */
#include <assert.h>
#include <stdio.h>

#define K 2

static int seq[] = {1, 2, 3, 1, 2, 3};
static int n = sizeof(seq) / sizeof(seq[0]);

static int in_cache(const int *c, int sz, int x)
{
    for (int i = 0; i < sz; i++) { if (c[i] == x) { return i; } }
    return -1;
}

/* furthest-in-future：缺失时换出「下次访问最远（或永不再访问）」的块。 */
static int furthest_in_future(void)
{
    int cache[K];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < K) { cache[sz++] = seq[i]; continue; }
        int evict = 0, furthest = -2;
        for (int j = 0; j < sz; j++) {
            int next = n;   /* 之后第一次出现的位置；n 表示永不再出现（最远） */
            for (int t = i + 1; t < n; t++) { if (seq[t] == cache[j]) { next = t; break; } }
            if (next > furthest) { furthest = next; evict = j; }
        }
        cache[evict] = seq[i];
    }
    return misses;
}

/* LRU：缺失且满时换出「最久未使用」的块（数组头为最久未用）。 */
static int lru(void)
{
    int cache[K];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        int pos = in_cache(cache, sz, seq[i]);
        if (pos >= 0) {
            int v = cache[pos];
            for (int j = pos; j < sz - 1; j++) { cache[j] = cache[j + 1]; }
            cache[sz - 1] = v;          /* 移到最近使用端 */
        } else {
            misses++;
            if (sz < K) { cache[sz++] = seq[i]; }
            else {
                for (int j = 0; j < K - 1; j++) { cache[j] = cache[j + 1]; }
                cache[K - 1] = seq[i];
            }
        }
    }
    return misses;
}

/* FIFO：缺失且满时换出「最早进入」的块（数组头为最早进入）。命中不改变顺序。 */
static int fifo(void)
{
    int cache[K];
    int sz = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        if (in_cache(cache, sz, seq[i]) >= 0) { continue; }
        misses++;
        if (sz < K) { cache[sz++] = seq[i]; }
        else {
            for (int j = 0; j < K - 1; j++) { cache[j] = cache[j + 1]; }
            cache[K - 1] = seq[i];
        }
    }
    return misses;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    int ff = furthest_in_future();
    printf("part 1: furthest-in-future（最优离线）缺失 %d 次\n", ff);
    assert(ff == 4);

    int lu = lru();
    printf("part 2: LRU 缺失 %d 次（k=%d，k-竞争）\n", lu, K);
    assert(lu == 6);

    int fo = fifo();
    printf("part 3: FIFO 缺失 %d 次（k=%d，k-竞争）\n", fo, K);
    assert(fo == 6);

    /* FFU 即 OPT，缺失次数不多于任何在线策略 */
    assert(ff <= lu && ff <= fo);

    puts("all checks passed.");
    return 0;
}
