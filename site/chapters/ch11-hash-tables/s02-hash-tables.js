/* 第 11 章 11.2：散列表 · 链接法（Hash tables）。
 * 原文锚点：印刷页 275–282（pdf_index 296–303）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（28/28 PASS）。
 * 主题：h(k) 把大 key 空间压到 m 个槽；冲突用**链接法**消化；代价 Θ(1 + α)。
 */

/* 习题 11.2-2 的演示数据：m = 9、h(k) = k mod 9、依次插入 9 个 key */
const EX1122 = [5, 28, 19, 15, 20, 33, 12, 17, 10];

export default {
  key:'s02',id:'ch11/s02',chapter:11,section:'11.2',
  title:'链接法：把冲突挂成链',shortTitle:'11.2 散列表 · 链接法',
  titleEn:'Hash tables',
  source:{printed:[275,282],pdf:[296,303]},
  prerequisites:[{label:'11.1 Direct-address tables',url:'#/ch11/s01'}],
  stages:[
   {type:'map',title:'散列：用一次映射换掉 Θ(|U|) 的空间',
    why:'11.1 的直接寻址要求"表长 ≥ 全域大小"。散列表把这一步换成**散列函数** $h(k)$：把任意大的 key 空间压到 $m$ 个槽。代价是**冲突**（两个 key 落到同一槽）—— 本关讲第一种解法：**链接法**（每个槽挂一条链），并证明在独立均匀散列下查找的期望时间是 $\\Theta(1+\\alpha)$（$\\alpha = n/m$ 是负载因子）。',
    position:'11.1 是"没有冲突的理想情形"；本关引入冲突与链接法；11.3 讲怎么挑 $h$ 让冲突少；11.4 讲不建链的第二种解法（开放寻址）；11.5 讲工程细节。链接法本身就是 10.2 的双向链表 —— 本关的伪代码三段各只有**一行**，全部在调用 10.2 的过程。',
    unlocks:[{label:'11.3 Hash functions（散列函数）',url:'#/ch11/s03'}],
    mathKit:[
     {title:'散列函数',body:'$h: U \\to \\{0, 1, \\dots, m-1\\}$。元素 $k$ 放进槽 $h(k)$。'},
     {title:'冲突与链接法',body:'两个 key 散列到同一槽 = **冲突**。链接法：槽 $j$ 指向一条链表，链里放所有 $h(k) = j$ 的元素。'},
     {title:'负载因子',body:'$\\alpha = n/m$ = 平均每条链的长度。**可以小于、等于或大于 1。**'},
     {title:'两个定理',body:'不成功查找期望 $\\Theta(1+\\alpha)$（Theorem 11.1）；成功查找期望 $\\Theta(1+\\alpha/2)$（Theorem 11.2）。$\\alpha = O(1)$ 时两者都是 $\\Theta(1)$。'},
    ]},
   {type:'intuition',title:'从"编号=位置"到"编号经过一道计算"',
    scene:'图书馆从"按编号排书架"改成"按编号算书架号"',
    body:[
     '直接寻址表像"编号 5 的书放 5 号架" —— 简单，但要为**所有可能的编号**准备书架。散列表改成"编号 5 的书放在 $h(5)$ 号架"，架子数量 $m$ 由我们定（与元素数同阶），于是空间从 $\\Theta(|U|)$ 降到 $\\Theta(n)$。',
     '★ 代价立刻出现：不同的编号可能算出同一个架号 —— **冲突**。这是无法避免的（原书：$|U| > m$ 时**必然**有两个 key 同槽），所以问题从"避免冲突"变成"**如何消化冲突**"。',
     '★ 链接法的想法最直白：每个架子上挂一个钩子，同架的书用一条链串起来。查找 = 先算架号（$O(1)$），再在**那条链**上找（代价 = 链长）。',
     '★ 于是全部性能都归结为一个数：**平均链长 $\\alpha = n/m$**。$\\alpha$ 是常数时查找就是 $O(1)$ —— 这就是"散列表是 $O(1)$ 的字典"这句话的完整含义（它说的是**平均**，且前提是散列函数把 key 撒得够匀）。',
    ],
    interactive:{text:'阶段 5 的面板用 h(k) = k mod 9 演示习题 11.2-2 的完整插入过程，末帧报负载因子与最长链。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对 h(k) 与负载因子 α 的排版形式）。',
    blocks:[
     {kind:'body',page:275,en:'The downside of direct addressing is apparent: if the universe U is large or infinite, storing a table T of size |U| may be impractical, or even impossible, given the memory available on a typical computer.',
      zh:'★★ 直接寻址的**死穴**：全域大或无限时，表根本存不下。这一段就是 11.2 的动机。'},
     {kind:'body',page:275,en:'When the set K of keys stored in a dictionary is much smaller than the universe U of all possible keys, a hash table requires much less storage than a directaddress table. Specifically, the storage requirement reduces to Θ(|K|) while maintaining the benefit that searching for an element in the hash table still requires only',
      zh:'★★ 收益的精确表述：空间从 $\\Theta(|U|)$ 降到 **$\\Theta(|K|)$**，而查找仍然只要 $O(1)$。'},
     {kind:'body',page:275,en:'O(1) time. The catch is that this bound is for the average-case time, 1 whereas for direct addressing it holds for the worst-case time.',
      zh:'★★ **最关键的一句**：$O(1)$ 是**平均**，而直接寻址是**最坏** $O(1)$。"The catch" 三个词点出了整章的取舍。'},
     {kind:'body',page:275,en:'With direct addressing, an element with key k is stored in slot k, but with hashing, we use a hash function h to compute the slot number from the key k, so that the element goes into slot h(k).',
      zh:'★ 一句话对照两种表示：槽号 = $k$（直接寻址）vs 槽号 = $h(k)$（散列）。'},
     {kind:'body',page:275,en:'There is one hitch, namely that two keys may hash to the same slot. We call this situation a collision. Fortunately, there are effective techniques for resolving the conflict created by collisions.',
      zh:'★★ **冲突的定义**。注意原书的态度："Fortunately, there are effective techniques" —— 冲突不可怕，要解决它。'},
     {kind:'body',page:275,en:'|U| >m , however, there must be at least two keys that have the same hash value,',
      zh:'★★ 冲突**不可避免**的证明方向：$|U| > m$（鸽笼原理）→ 必有两个 key 同槽。所以"设计一个无冲突的散列函数"是不可能的任务。'},
     {kind:'body',page:277,en:'At a high level, you can think of hashing with chaining as a nonrecursive form of divide-and-conquer: the input set of n elements is divided randomly into m subsets, each of approximate size n/m. A hash function determines which subset an element belongs to. Each subset is managed independently as a list.',
      zh:'★★ 一个漂亮的视角：链接法 = **非递归的分治** —— $n$ 个元素被"随机"分成 $m$ 组，每组平均 $n/m$ 个，各组独立管理。'},
     {kind:'body',page:277,en:'Figure 11.3 shows the idea behind chaining: each nonempty slot points to a linked list, and all the elements that hash to the same slot go into that slot’s linked list. Slot j contains a pointer to the head of the list of all stored elements with hash value j . If there are no such elements, then slot j contains NIL.',
      zh:'★★ **链接法的定义**。注意"all the elements that hash to the same slot" —— 链里放的是**散列值相同**的元素（它们的 key 未必相同）。'},
     {kind:'body',page:277,en:'When collisions are resolved by chaining, the dictionary operations are straightforward to implement. They appear on the next page and use the linked-list procedures from Section 10.2. The worst-case running time for insertion is O(1).',
      zh:'★ 三个操作"直白"的原因：它们**只是 10.2 链表过程的一行封装**。插入最坏 $O(1)$（头插）。'},
     {kind:'body',page:277,en:'The insertion procedure is fast in part because it assumes that the element x being inserted is not already present in the table. T o enforce this assumption, you can search (at additional cost) for an element whose key is x: key before inserting.',
      zh:'★ 一个容易忽略的前提：插入**假定表中没有同 key 元素**。要强制这一点就得先查找（额外代价）—— 这是"字典"与"多重集"的差别。'},
     {kind:'body',page:277,en:'For searching, the worst-case running time is proportional to the length of the list.',
      zh:'★★ 查找代价 = **链长**。这一句是后面全部分析的起点。'},
     {kind:'body',page:277,en:'(We’ll analyze this operation more closely below.) Deletion takes O(1) time if the lists are doubly linked, as in Figure 11.3.',
      zh:'★★ 删除 $O(1)$ 的**前提**：链表必须是**双向**的（10.2 的结论：单向链表删除要 $\\Theta(n)$ 找前驱）。'},
     {kind:'body',page:278,en:'Given a hash table T with m slots that stores n elements, we define the load factor ˛ for T as n/m, that is, the average number of elements stored in a chain.',
      zh:'★★ **负载因子 $\\alpha = n/m$** 的定义，以及它的直观含义：**平均链长**。'},
     {kind:'body',page:278,en:'Our analysis will be in terms of ˛, which can be less than, equal to, or greater than 1.',
      zh:'★ $\\alpha$ 可以小于 1（槽比元素多）、等于 1、也可以大于 1（元素比槽多）—— 链接法允许 $\\alpha > 1$（链可以很长），这是它相对开放寻址的一个优势。'},
     {kind:'body',page:278,en:'The worst-case behavior of hashing with chaining is terrible: all n keys hash to the same slot, creating a list of length n. The worst-case time for searching is thus Θ(n) plus the time to compute the hash function—no better than using one linked list for all the elements. We clearly don’t use hash tables for their worst-case pe',
      zh:'★★ **最坏情形毫不含糊地糟**：全部 key 同槽 → 退化成一个链表 $\\Theta(n)$。原书直说"我们显然不是为最坏情况用散列表的"。C 程序 part 6 实测了这一点。'},
     {kind:'body',page:279,en:'In a hash table in which collisions are resolved by chaining, an unsuccessful search takes Θ.1 C ˛/ time on average, under the assumption of independent uniform hashing.',
      zh:'★★ **Theorem 11.1**：不成功查找期望 $\\Theta(1 + \\alpha)$（语料里 `Θ.1 C ˛/` 是 $\\Theta(1+\\alpha)$ 的排版形式）。'},
     {kind:'body',page:279,en:'In a hash table in which collisions are resolved by chaining, a successful search takes Θ.1 C ˛/ time on average, under the assumption of independent uniform hashing.',
      zh:'★★ **Theorem 11.2**：成功查找期望 $\\Theta(1 + \\alpha)$ —— 常数比不成功查找小一半（$1 + \\alpha/2$ 量级）。C 程序实测：$\\alpha$ = 1/2/4 时平均扫描 1.00/2.01/3.94 个节点。'},
     {kind:'body',page:280,en:'The analysis in the preceding two theorems depends only on two essential properties of independent uniform hashing: uniformity ( each key is equally likely to hash to any one of the m slots), and independence (so any two distinct keys collide with probability 1/m).',
      zh:'★★ **两个定理的真正前提**（比"独立均匀散列"这个名字更重要）：**均匀性**（每个 key 落入每个槽等可能）+ **独立性**（任意两个不同 key 冲突的概率是 $1/m$）。11.3 的"全域散列"就是在真实世界里逼近这两条。'},
     {kind:'body',page:281,en:'consequently, ˛ = n/m = O(m)/m = O(1). Thus, searching takes constant time on average. Since insertion takes O(1) worst-case time and deletion takes O(1) worst-case time when the lists are doubly linked (assuming that the list element to be deleted is known, and not just its key), we can support all dictionary operations in O(1)',
      zh:'★★ **全章的落脚点**：若 $n = O(m)$ 则 $\\alpha = O(1)$ → **所有字典操作平均 $O(1)$**。插入最坏 $O(1)$、删除最坏 $O(1)$（双链且已知元素）、查找平均 $O(1)$。'},
    ],
    terms:[
     {en:'collision',zh:'冲突（两个 key 散列到同一槽）',page:275},
     {en:'load factor',zh:'负载因子 α = n/m（平均链长）',page:278},
     {en:'chaining',zh:'链接法（同槽元素挂成一条链）',page:277},
    ]},
   {type:'pseudocode',title:'CHAINED-HASH-SEARCH：1 行',
    lead:'★ 三段伪代码各只有一行 —— 因为全部工作都委托给 10.2 的链表过程。这正是"数据结构复用"的力量。',
    algo:'CHAINED-HASH-SEARCH',signature:'CHAINED-HASH-SEARCH(T, k)',page:278,
    lines:[
     {n:1,code:'return LIST-SEARCH(T[h(k)], k)',zh:'★ 唯一的动作：**先算槽号（$O(1)$），再在那条链上查**。查的代价 = 链长（原书 p.277：proportional to the length of the list）。'},
    ],
    vars:[
     {name:'h(k)',meaning:'散列函数：把 key 映射到 $[0, m-1]$ 的槽号'},
     {name:'T[h(k)]',meaning:'该槽的链表头 —— 10.2 的 `L.head`'},
    ],
    note:'★ 与 11.1 的 `return T[k]` 对照：那里槽号就是 key（无冲突），这里要先过一道 $h$（有冲突，所以要再在链上找）。',
    more:[
     {algo:'CHAINED-HASH-INSERT',subtitle:'CHAINED-HASH-INSERT(T, x) —— 1 行（原书 p.278）',
      signature:'CHAINED-HASH-INSERT(T, x)',page:278,
      lines:[
       {n:1,code:'LIST-PREPEND(T[h(x.key)], x)',zh:'★ 用 LIST-PREPEND（头插）而不是 LIST-INSERT：头插是 $O(1)$，且不需要先找位置。代价是链内次序与插入顺序相反（习题 11.2-2 的链序就是这样得来的）。'},
      ],
      vars:[{name:'x',meaning:'待插入元素（假定表中没有同 key 元素）'}],
      note:''},
     {algo:'CHAINED-HASH-DELETE',subtitle:'CHAINED-HASH-DELETE(T, x) —— 1 行（原书 p.278）',
      signature:'CHAINED-HASH-DELETE(T, x)',page:278,
      lines:[
       {n:1,code:'LIST-DELETE(T[h(x.key)], x)',zh:'★ 参数是**元素 $x$（不是 key $k$）** —— 所以**不需要查找**，直接 $O(1)$ 摘除。前提是链表**双向**（10.2 的 LIST-DELETE 要改前后两条指针）。'},
      ],
      vars:[{name:'x',meaning:'待删除元素（必须已有它的指针）'}],
      note:'★ 若链表是单向的，删除/查找都会变成 $\\Theta(n)$（原书 p.278 的脚注与习题 10.2-1）。'},
    ]},
   {type:'visualize',title:'看见冲突怎么被"挂"起来',
    panels:[
     {title:'① 习题 11.2-2：m = 9、h(k) = k mod 9、插入 9 个 key',
      viz:'hash-table',
      algorithm:'chained-hash',
      input:{array:EX1122,m:9,ops:EX1122.map((v) => ({ kind:'insert', v }))},
      countLabels:{cmp:'链上比较',move:{label:'指针改写',unit:'次'}},
      invariants:[{label:'槽 j 的链 = {所有 h(k) = j 的元素}；链内次序由头插决定（后插入的在前）'}],
      presets:[
       {name:'★ 习题 11.2-2 的插入序列（9 个 key）',array:EX1122,args:[9, EX1122.map((v) => ({ kind:'insert', v }))]},
       {name:'同一张表：查找命中 vs 未命中',array:EX1122,args:[9, [
         ...EX1122.map((v) => ({ kind:'insert', v })),
         {kind:'search',k:19},{kind:'search',k:99},
       ]]},
       {name:'删除一个元素（O(1)，无需查找）',array:EX1122,args:[9, [
         ...EX1122.map((v) => ({ kind:'insert', v })),
         {kind:'delete',v:28},
       ]]},
      ]},
     {title:'② 负载因子 α 与期望查找代价',
      viz:'growth',
      chart:{xMax:16,series:[
       {name:'不成功查找 ≈ 1 + α',expr:'1 + n',color:'--viz-compare'},
       {name:'成功查找 ≈ 1 + α/2',expr:'1 + n / 2',color:'--viz-done'},
       {name:'最坏（全部同槽）≈ 8n',expr:'n * 8',color:'--viz-violation'},
      ]},
      note:'★ 两条直线是 Theorem 11.1/11.2 的期望值；红线是"全部 key 同槽"的最坏情形（与 $\\alpha$ 无关，只与 $n$ 有关）。'},
    ],
    tasks:[
     '面板 ① 逐帧数：插入 5,28,19,15,20,33,12,17,10 之后，T[1] 的链为什么是 10→19→28（提示：头插）。',
     '面板 ① 末帧读负载因子：$\\alpha = 9/9 = 1.00$，最长链在 T[1]，长度 3。',
     '面板 ① 切到"查找"预设：`SEARCH(19)` 要在 T[1] 上走几步？`SEARCH(99)` 呢（未命中）？',
     '面板 ② 看两条直线的斜率差别：成功查找的常数只有不成功查找的一半（为什么？因为被查找的元素不会在它自己"之前"被比到）。',
    ],
    note:'★ 面板 ① 用散列表引擎（chained 模式）；哈希函数是 $h(k) = k mod 9$，与习题 11.2-2 一致。'},
   {type:'code',title:'实测：负载因子与平均扫描长度精确吻合',
    intro:'`c/chained_hash.c` 实现链接法散列表（双链，所以删除 $O(1)$），演示习题 11.2-2，并**实测 Theorem 11.1 的 $\\alpha$**。',
    pseudocodeRef:'CHAINED-HASH-SEARCH',
    c:{file:'chained_hash.c',code:String.raw`/* chained_hash.c -- 11.2 节：链接法散列表的实现与负载因子实测。
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
`,
       notes:[{line:35,zh:'`ht_hash`：$h(k) = k mod m$（对负数做一次修正）—— 这就是 11.3 要讲的第一种散列函数。'},
              {line:38,zh:'★ `ht_insert`：头插（对应 LIST-PREPEND）—— 只改 2 条指针，$O(1)$。'},
              {line:50,zh:'★ `ht_search`：先算槽号，再沿链走。计数器 `scanned` 记录**访问到的节点数** —— 这就是"查找代价 = 链长"的实测形式。'},
              {line:61,zh:'`ht_delete_key`：双链删除只改 2 条指针（若单向链表则要先 $\\Theta(n)$ 找前驱）。'},
              {line:94,zh:'★ part 1：习题 11.2-2 的完整演算 —— 链长分布 T[1]:3、T[6]:2、其余 1；`T[1] = 10→19→28` 正是**头插**的结果。'},
              {line:106,zh:'part 2：链长 13 的槽里查找命中 `key=4`（最早插入 → 被挤到链尾）要扫 13 个节点 —— **命中代价 = 它在链中的位置**。'},
              {line:110,zh:'part 3：同一条链上未命中（key=1304 也散列到 T[4]）要扫完整条链 13 个节点 —— 这就是 $\\Theta(n)$ 的最坏情形。'},
              {line:119,zh:'★★ part 5：**Theorem 11.1 的实测** —— $\\alpha \\approx 1/2/4$ 时未命中查找平均扫过 1.00 / 2.01 / 3.94 个节点，与理论的 $\\alpha$ 精确吻合。'},
              {line:156,zh:'part 6：退化情形 —— 50 个 key 全落在 T[0]，未命中要扫 50 个节点，与"只用一条链表"没有区别。'}],
       tests:[{in:'习题 11.2-2 的 9 个 key（m=9）',out:'链长分布 T[1]:3 / T[6]:2 / 4 个槽各 1；T[1] = 10→19→28'},
              {in:'α ≈ 1 / 2 / 4（m=61，随机 key）',out:'未命中查找平均扫 1.00 / 2.01 / 3.94 个节点（= α）'},
              {in:'50 个 key 全散列到同一槽',out:'未命中扫 50 个节点（退化成一个链表）'}]},
    mapping:[{pc:1,pcCode:'return LIST-SEARCH(T[h(k)], k)',c:'`ht_search`（第 50 行）：`q = ht_hash(T, k)` 后再沿 `T->slot[q]` 走'},
             {pc:1,pcCode:'LIST-PREPEND(T[h(x.key)], x)',c:'`ht_insert`（第 38 行）—— 头插：`x->next = T->slot[q]; T->slot[q] = x;`'},
             {pc:1,pcCode:'LIST-DELETE(T[h(x.key)], x)',c:'`ht_delete_key`（第 61 行）—— 双链下改 2 条指针'}]},
   {type:'analyze',title:'两本账：负载因子决定一切',
    intro:'链接法的全部分析都围绕一个数 $\\alpha = n/m$。两个定理说的是同一件事的两个常数。',
    claims:[
     {expr:'\\Theta(|K|)',when:'散列表的空间（对比直接寻址的 Θ(|U|)）',page:275,source:'book'},
     {expr:'\\alpha = n/m',when:'负载因子 = 平均链长（可 <1、=1、>1）',page:278,source:'book'},
     {expr:'\\Theta(1+\\alpha)',when:'不成功查找的期望时间（Theorem 11.1）',page:279,source:'book'},
     {expr:'\\Theta(1+\\alpha/2)',when:'成功查找的期望时间（Theorem 11.2，常数小一半）',page:279,source:'book'},
     {expr:'\\Theta(n)',when:'最坏情形：全部 key 同槽',page:278,source:'book'},
    ],
    tables:[{caption:'三个字典操作的代价（链接法）',rows:[
      ['操作','期望','最坏','备注'],
      ['INSERT','$O(1)$','$O(1)$','头插，且假定 key 不在表中'],
      ['SEARCH','$\\Theta(1+\\alpha)$','$\\Theta(n)$','最坏 = 全部同槽'],
      ['DELETE','$O(1)$','$O(1)$','★ 前提：**双向**链表 且已知元素 $x$'],
     ]},
     {caption:'两种方法的取舍（11.1 vs 11.2）',rows:[
      ['','直接寻址表','链接法散列表'],
      ['空间','$\\Theta(|U|)$（全域大小）','$\\Theta(|K|)$（元素个数）'],
      ['查找','$O(1)$ **最坏**','$\\Theta(1+\\alpha)$ **平均**'],
      ['能否处理任意 key','不能（key 必须是小整数）','能（任意可散列的 key）'],
      ['$\\alpha$ 的上限','无意义（无冲突）','可以 > 1（链会变长）'],
     ]}],
    chart:{xMax:16,series:[
     {name:'不成功 ≈ 1 + α',expr:'1 + n',color:'--viz-compare'},
     {name:'成功 ≈ 1 + α/2',expr:'1 + n / 2',color:'--viz-done'},
    ]},
    derivations:[
     {kind:'summation',title:'Theorem 11.1：不成功查找为什么是 1 + α',steps:[
      {zh:'在独立均匀散列下，未被存储的 key $k$ 落入每个槽等可能。'},
      {tex:'E[n_{h(k)}] = n/m = \\alpha',zh:'目标槽的**期望链长**就是 $\\alpha$（因为每个元素独立地以 $1/m$ 的概率落进这个槽）。'},
      {zh:'不成功查找要把这条链走完 → 检查的元素数期望 $= \\alpha$；加上算 $h(k)$ 的 $O(1)$ → $\\Theta(1+\\alpha)$。'}],
     },
     {kind:'summation',title:'Theorem 11.2：成功查找的常数为什么小一半',steps:[
      {zh:'被查找的元素 $x_i$ 在它所在的链上有一个**位置**。它前面还有多少元素？'},
      {zh:'★ 关键直觉：**在 $x_i$ 自己所在的链上，比它更早插入的元素才有机会排在它前面**；而"每个后来的元素是否落进这条链"是独立事件。'},
      {tex:'E[\\text{检查的元素数}] = 1 + \\frac{1}{2}\\left(1 + \\frac{1}{m}\\right)\\alpha \\approx 1 + \\frac{\\alpha}{2}',zh:'★ 那个 $1/2$ 来自"平均而言，$x_i$ 排在同期元素中间"。所以成功查找比不成功查找快一倍 —— C 程序实测 1.00/2.01/3.94（$\\alpha$ = 1/2/4）与两条直线都吻合。'},
      {zh:'★ 原书在 p.280 用**指示器随机变量**（$X_{ijq}$、$Y_j$、$Z$）把这个直觉做成了严格证明 —— 那是 5.2 的工具在数据结构里的又一次应用。'}]},
    ],
    note:'★ 中心图：两条直线（$1+\\alpha$ 与 $1+\\alpha/2$）就是两个定理；红线（最坏）与 $\\alpha$ 无关 —— 它只与 $n$ 有关，这也是"散列表不是为最坏情况用的"的图形表达。'},
   {type:'prove',title:'Theorem 11.1 与 11.2：为什么期望是 Θ(1 + α)',
    statement:'In a hash table in which collisions are resolved by chaining, an unsuccessful search takes Θ.1 C ˛/ time on average, under the assumption of independent uniform hashing.',
    page:279,
    intro:'★ 两个定理的证明都在用同一个条件期望的套路。这里把不成功查找（Theorem 11.1）走完整，然后说明成功查找（Theorem 11.2）多出的那一步。',
    steps:[
     {title:'第一步 · 独立均匀散列到底假设了什么',
      en:'The analysis in the preceding two theorems depends only on two essential properties of independent uniform hashing: uniformity ( each key is equally likely to hash to any one of the m slots), and independence (so any two distinct keys collide with probability 1/m).',
      page:280,
      body:['**均匀性**：每个 key 落入每个槽的概率都是 $1/m$。',
        '**独立性**：任意两个不同 key 是否冲突互不影响 → 它们冲突的概率是 $1/m$。',
        '★ 这两条是全部计算的基石。原书在 11.3 会用"全域散列"说明：真实的散列函数达不到这两条，但可以**逼近**它们（随机选一个函数）。']},
     {title:'第二步 · 不成功查找：走完整条链',
      en:'Proof Under the assumption of independent uniform hashing , any key k not already stored in the table is equally likely to hash to any of the m slots. The expected time to search unsuccessfully for a key k is the expected time to search to the end of list T [h(k)], which has expected length E [n h(k) ] = ˛. Thus, the expected number of elements examined in an unsuccessful search is ˛, and the total time required',
      page:279,
      body:['要找的 key $k$ 不在表里，先算槽号 $q = h(k)$（$O(1)$）。',
        '在**均匀性**下，每个已存元素落入槽 $q$ 的概率都是 $1/m$ → 该槽链长的期望 $E[n_q] = n/m = \\alpha$。',
        '不成功查找必须走完整条链 → 期望检查 $\\alpha$ 个元素 → 总时间 $\\Theta(1 + \\alpha)$。∎'],
      },
     {title:'第三步 · 成功查找：为什么要减去一半',
      en:'The situation for a successful search is slightly different. An unsuccessful search is equally',
      page:279,
      body:['被查找的元素 $x_i$ 在链上的位置 = 1 + （**比它更早插入**且与它同链的元素数）。',
        '对每一个比 $x_i$ 更早插入的元素 $x_j$：在**独立性**下它落在同一槽的概率是 $1/m$；对所有 $j < i$ 求和，期望约为 $\\alpha/2$。',
        '★ 那个 $1/2$ 的直觉：$x_i$ 在"比它早的元素"里平均排在中间，而只有**一半**的期望量级落在它前面。',
        '所以成功查找的期望是 $\\Theta(1 + \\alpha/2)$ —— **同一个 $\\alpha$，常数小一半**。原书 p.280 用指示器随机变量（$X_{ijq}$、$Y_j$、$Z$）给出严格版本。',
        '★ C 程序 part 5 实测：$\\alpha$ = 1/2/4 时未命中平均扫 1.00 / 2.01 / 3.94 个节点，与 Theorem 11.1 的 $\\alpha$ 精确吻合。'],
      },
    ],
    conclusion:'★ 结论：$\\Theta(1+\\alpha)$（不成功）与 $\\Theta(1+\\alpha/2)$（成功）。只要 $n = O(m)$，即 $\\alpha = O(1)$，三个字典操作**平均都是 $O(1)$** —— 这就是散列表的全部承诺。★ 别忘了前提：独立均匀散列（11.3 负责让它接近现实）、双向链表（删除 $O(1)$）、以及"最坏情况 $\\Theta(n)$ 依然存在"。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'链接法散列表中，槽 $j$ 的链里放的是哪些元素？',
      options:['key 等于 $j$ 的元素','散列值等于 $j$ 的元素','key 小于 $j$ 的元素','随机选出的元素'],answer:1,
      why:'★ 原书 p.277："all the elements that hash to the same slot"。链里元素的 **key 未必相同** —— 它们只是散列值相同。'},
     {kind:'single',q:'负载因子 α 的定义是？',
      options:['$m/n$','$n/m$','$m - n$','$\\lg(n/m)$'],answer:1,
      why:'★ $\\alpha = n/m$ = 平均链长。它可以小于 1、等于 1、大于 1。'},
     {kind:'single',q:'CHAINED-HASH-DELETE 为什么不需要查找？',
      options:['因为每个桶里的链都很短，删掉一个元素所花的时间几乎可以忽略不计','因为参数是元素 $x$ 而不是 key $k$ —— 已知道位置','因为散列函数本来就能把关键字定位到槽上，所以删除时不必再比较关键字','因为每条链表都按键值大小有序存放，要删的那个位置一眼就能定位得到'],answer:1,
      why:'★ 原书 p.277：删除的输入是元素 $x$；再配合**双向**链表，摘除只要改 2 条指针。若参数是 key，就得先查找。'},
     {kind:'single',q:'散列表相比直接寻址表，空间从 Θ(|U|) 降到了多少？',
      options:['Θ(1)','Θ(lg |U|)','Θ(|K|)','Θ(|U|/m)'],answer:2,
      why:'★ 原书 p.275："the storage requirement reduces to Θ(|K|)"（$K$ 是实际存储的 key 集合）。'},
     {kind:'judge',q:'链接法散列表的最坏查找时间是 Θ(n)。',answer:true,
      why:'★ 原书 p.278：全部 $n$ 个 key 散列到同一槽时退化成一条链表 —— "no better than using one linked list for all the elements"。这也是它只保证**平均** $O(1)$ 的原因。'},
     {kind:'simulate',q:'m = 100、存了 300 个元素，负载因子 α = ？（填数字，保留两位小数）',expect:['3','3.00'],placeholder:'例如：1.50',
      why:'$\\alpha = n/m = 300/100 = 3$。★ 链接法允许 $\\alpha > 1$（每槽平均挂 3 个）—— 只要它是常数，查找仍是 $O(1)$。'},
    ],
    bookExercises:[
     {id:'11.2-1',page:281,star:0,statement:'You use a hash function h to hash n distinct keys into an array T of length m. Assuming independent uniform hashing, what is the expected number of colli- sions? More precisely, what is the expected cardinality of ˚ fk 1 ,k 2 g W k 1 ≠ k 2 and h(k 1 ) = h(k 2 ) } ?',hint:'冲突数：$C(n,2)$ 对 key，每对冲突概率 $1/m$ → 期望 $\\binom{n}{2}/m$。无冲突概率约 $e^{-n(n-1)/(2m)}$（生日悖论的味道 —— 与 5.4.1 同源）。'},
     {id:'11.2-2',page:281,star:0,statement:'Consider a hash table with 9 slots and the hash function h(k) = k mod 9. Demon- strate what happens upon inserting the keys 5,28,19,15,20,33,12,17,10 with collisions resolved by chaining.',hint:'逐个数算 $k mod 9$ 并按头插挂链。答案（C 程序 part 1 实测）：T[1] = 10→19→28、T[6] = 33→15、T[2]=20、T[3]=12、T[5]=5、T[8]=17，其余空。'},
     {id:'11.2-3',page:282,star:0,statement:'Professor Marley hypothesizes that he can obtain substantial performance gains by modifying the chaining scheme to keep each list in sorted order. How does the pro- fessor’s modification affect the running time for successful searches, unsuccessful searches, insertions, and deletions?',hint:'方向要摆对：链内**有序**能提前终止的是**不成功**查找 —— 扫到第一个大于目标的键就可以停， 平均只走半条链，常数约减半（渐近仍是 $\\Theta(1+\\alpha)$）。 而**成功**查找并不会因为排序变快：目标键在链里的名次仍然均匀分布，平均还是要扫一半， 原书算出的期望 $1 + \\alpha/2 - \\alpha/2n$ 本来就已经是「半条链」，没有再降的空间。 代价写在别处：插入不能再 $O(1)$ 头插，得先定位 → $\\Theta(1+\\alpha)$。 所以「排序链改善成功查找」这个直觉是反的。'},
     {id:'11.2-4',page:282,star:0,statement:'Suggest how to allocate and deallocate storage for elements within the hash table itself by creating a "free list": a linked list of all the unused slots. Assume that one slot can store a flag and either one element plus a pointer or two pointers. All dictionary and free-list operations should run in O(1) expected time. Does the free list need to be doubly linked, or does a singly linked free list suffice?',hint:'自由链只需要**单向**就够。四个动作全是链头操作： 分配取头（$O(1)$）、归还插到头（$O(1)$）、字典操作不碰自由链的中间 —— 没有任何一处要「从链中间摘掉某个槽」， 而那才是需要双向链（或先前驱）的场景。 每个槽的布局按题干给的两种之一： 「标志 + 元素 + 指针」或「两个指针」，用标志位区分空槽与实槽； 链头存成表里的一个字段 $\\text{free}$，删除时把该槽的 next 指向旧的 $\\text{free}$ 再更新表头。 反过来说：如果你哪天想让某个调用者「释放任意一个已知槽」而又不想扫链，那时才要升级成双向。'},
     {id:'11.2-5',page:282,star:0,statement:'You need to store a set of n keys in a hash table of size m. Show that if the keys are drawn from a universe U with |U| >.n − 1/m, then U has a subset of size n consisting of keys that all hash to the same slot, so that the worst-case searching time for hashing with chaining is Θ(n).',hint:'思路：$|U| > m(n-1)$ 时，鸽笼原理保证存在 $n$ 个 key 散列到同一槽；把它们全插进去就得到 $\\Theta(n)$ 的链。这就是"散列表不保证最坏"的构造性证明（对照 11.2-1 的期望值）。'},
     {id:'11.2-6',page:282,star:0,statement:'You have stored n keys in a hash table of size m, with collisions resolved by chain- ing, and you know the length of each chain, including the length L of the longest chain. Describe a procedure that selects a key uniformly at random from among the keys in the hash table and returns it in expected time O(L • .1 + 1=˛/).',hint:'思路：**先随机选一条链**（按链长加权）再查 —— 让"长链"被抽到的概率更大，从而摊平代价。这是"用随机化改善最坏情形"的又一个例子（对照 11.4 的均匀散列假设）。'},
    ]},
  ],
};
