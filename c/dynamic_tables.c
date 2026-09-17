/* dynamic_tables.c -- 16.4 动态表：扩张与收缩的摊还分析。
 * 关键数字：
 *   part 1  只插入（倍增）：n=1024 次插入的基本插入总数 = 2047 < 3n，摊还 O(1)；
 *   part 2  记账：每次 TABLE-INSERT 记 3 元，信用永不透支；
 *   part 3  势能 Φ = 2*num - size：插入摊还代价 <= 3，恒等式逐次成立；
 *   part 4  收缩阈值：书里的 1/4 方案在交替插删下 0 次重组织；
 *           错误的 1/2 收缩方案会被同一操作序列打爆（来回抖动）。 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int *cur;              /* 当前表 */
static int size;              /* 槽位数 */
static int num;               /* 元素数 */
static long elementary;       /* 基本插入（逐个搬元素）计数 */
static long reorg;            /* 扩张/收缩次数 */

static void table_insert(int x)          /* TABLE-INSERT 的 11 行直译 */
{
    if (num == size) {                   /* 行 4：装满 -> 倍增扩张（行 5–9） */
        int *nt = malloc(sizeof(int) * 2 * size);
        memcpy(nt, cur, sizeof(int) * num);
        for (int i = 0; i < num; i++) { nt[i] = cur[i]; elementary++; }   /* 行 6：逐个搬 */
        free(cur); cur = nt; size = 2 * size;
        reorg++;
    }
    cur[num++] = x; elementary++;        /* 行 10–11 */
}

static void table_delete_1_4(void)       /* 删除 + 1/4 阈值收缩（书的方案） */
{
    num--;
    if (num > 0 && num == size / 4) {    /* 装载因子掉到 1/4 -> 减半 */
        int *nt = malloc(sizeof(int) * size / 2);
        for (int i = 0; i < num; i++) { nt[i] = cur[i]; elementary++; }
        free(cur); cur = nt; size = size / 2;
        reorg++;
    }
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* part 1：只插入 —— 第 i 次操作仅当 i-1 是 2 的幂时才扩张 */
    {
        int n = 1024;
        size = 1; num = 0; elementary = 0; reorg = 0;
        cur = malloc(sizeof(int));
        for (int i = 1; i <= n; i++) {
            long before = elementary;
            table_insert(i);
            if (elementary > before + 1) {   /* 这次触发了扩张 */
                printf("        第 %4d 次插入触发扩张：搬 %d 个旧元素\n", i, i - 1);
                assert(((i - 1) & (i - 2)) == 0);   /* i-1 是 2 的幂 */
            }
        }
        printf("part 1: n = %d 次插入：基本插入总数 %ld = n + 搬家 %ld，摊还 %.2f 次/插入\n",
               n, elementary, elementary - n, (double)elementary / n);
        printf("        搬家总数 %ld = 1+2+4+...+512 < n -> 总代价 < 3n = %d，摊还 O(1)\n",
               elementary - n, 3 * n);
        assert(elementary == 2L * n - 1);
        assert(reorg == 10);
        printf("        扩张恰好发生在 i-1 = 1,2,4,...,512 的插入上（共 %ld 次）\n", reorg);
        free(cur);
    }

    /* part 2：记账 —— 每次 TABLE-INSERT 收 3 元 */
    {
        int n = 512;
        long actual = 0, credit = 0, min_credit = 1L << 30;
        int expansions = 0;
        size = 1; num = 0; elementary = 0;
        cur = malloc(sizeof(int));
        for (int i = 1; i <= n; i++) {
            long before = elementary;
            table_insert(i);
            int expanded = (elementary > before + 1);
            actual += elementary - before;
            credit = 3L * i - actual;        /* 已收总额 - 已花总额 */
            if (credit < min_credit) { min_credit = credit; }
            assert(credit >= 2);             /* 信用不变量：永不透支 */
            if (expanded) {
                expansions++;
                assert(credit == 3);         /* 扩张恰好花光全部积蓄，只剩刚收的 3 元 */
            }
        }
        printf("part 2: 记账法（每次插入收 3 元，n = %d）：\n", n);
        printf("        总收 %ld 元，实花 %ld 元，最终信用 %ld，最低信用 %ld\n",
               3L * n, actual, credit, min_credit);
        printf("        %d 次扩张恰好把积蓄花光 —— 每次扩张后信用都回到 3\n", expansions);
        assert(expansions == 9);
        free(cur);
    }

    /* part 3：势能 Φ = 2*num - size（纯插入时恒 >= 0） */
    {
        int n = 512;
        size = 1; num = 0; elementary = 0;
        cur = malloc(sizeof(int));
        long sum_actual = 0, sum_amort = 0;
        int prev_phi = 0;
        for (int i = 1; i <= n; i++) {
            long before = elementary;
            table_insert(i);
            int c = (int)(elementary - before);
            int phi = 2 * num - size;
            sum_actual += c;
            sum_amort += c + (phi - prev_phi);   /* 摊还 = 实际 + ΔΦ */
            prev_phi = phi;
            assert(phi >= 0);
        }
        printf("part 3: 势能法（Φ = 2*num - size）：\n");
        printf("        Σ实际 = %ld，Σ摊还 = %ld（恒等式逐次精确成立）\n", sum_actual, sum_amort);
        printf("        每次插入摊还代价 <= 3（1 元干活 + 势能增量最多 2）\n");
        assert(sum_amort == sum_actual + prev_phi);
        assert(sum_amort <= 3L * n);
        free(cur);
    }

    /* part 4：收缩阈值 —— 1/4 收缩稳，1/2 收缩抖
     * 抖动场景（书 p.466 的警告）：表在「半满多一点」处做交替插删。 */
    {
        int i;
        /* 方案 A（书）：先插 33 个（size=64，num=33，α 略高于 1/2），再交替删/插 */
        size = 1; num = 0; elementary = 0; reorg = 0;
        cur = malloc(sizeof(int));
        for (i = 1; i <= 33; i++) { table_insert(i); }
        long reorg_after_fill = reorg;
        for (i = 0; i < 200; i++) {
            if (i % 2 == 0 && num > 0) { table_delete_1_4(); }
            else { table_insert(1000 + i); }
        }
        printf("part 4: 插到 num=33（size=64，α≈1/2）后交替「删一插一」200 次：\n");
        printf("        1/4 收缩方案（书）：重组织 %ld 次 —— 稳定，无抖动\n",
               reorg - reorg_after_fill);
        assert(reorg - reorg_after_fill == 0);

        /* 方案 B（错误）：num == size/2 就减半 —— 同一序列来回抖 */
        {
            int cc_size = 1, cc_num = 0;
            long cc_reorg = 0;
            for (i = 0; i < 33; i++) {
                if (cc_num == cc_size) { cc_size *= 2; cc_reorg++; }
                cc_num++;
            }
            for (i = 0; i < 200; i++) {
                if (i % 2 == 0 && cc_num > 0) {
                    cc_num--;
                    if (cc_num == cc_size / 2) { cc_size /= 2; cc_reorg++; }
                } else {
                    if (cc_num == cc_size) { cc_size *= 2; cc_reorg++; }
                    cc_num++;
                }
            }
            printf("        1/2 收缩方案（错误）：同一序列重组织 %ld 次 —— 每对插删都扩张+收缩\n",
                   cc_reorg);
            assert(cc_reorg >= 200);
            printf("        这正是书 p.466 的警告：收缩线必须与扩张线隔开足够距离（1/2 vs 1/4）。\n");
        }
        free(cur);
    }

    puts("all checks passed.");
    return 0;
}
