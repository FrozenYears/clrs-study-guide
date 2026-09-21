/* 第 11 章 11.4：开放寻址（Open addressing）。
 * 原文锚点：印刷页 293–301（pdf_index 314–322）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（47 条 PASS，本关用其中约 17 条）。
 * 主题：所有元素直接存在表里（无链、无指针）；线性探测 / 双重散列；均匀排列散列假设；
 *       Theorem 11.6（不成功 ≤ 1/(1−α)）、Corollary 11.7（插入 ≤ 1/(1−α)）、Theorem 11.8（成功 ≤ (1/α)ln(1/(1−α))）。
 */

/* 习题 11.4-1 的演示数据：m = 11，依次插入 9 个 key */
const KEYS1141 = [10, 22, 31, 4, 15,28, 17, 88, 59];

export default {
  key:'s04',id:'ch11/s04',chapter:11,section:'11.4',
  title:'开放寻址：不建链的另一种方案',shortTitle:'11.4 开放寻址',
  titleEn:'Open addressing',
  source:{printed:[293,301],pdf:[314,322]},
  prerequisites:[{label:'11.3 Hash functions（散列函数）',url:'#/ch11/s03'}],
  stages:[
   {type:'map',title:'把"链"彻底去掉',
    why:'11.2 用链消化冲突，但链要存指针、要动态内存。开放寻址（open addressing）走另一条路：所有元素直接存在表槽里，没有链、没有指针。本关讲三种探测方式（线性 / 二次 / 双重），以及均匀排列散列这个分析假设，最后给出三个性能定理。',
    position:'11.3 造好了散列函数；本关是"冲突的第二种解法"。它和链接法共享一个分析框架（负载因子 α = n/m），但 α 的上限不同：开放寻址要求 α ≤ 1（表满了就插不进）。11.5 讲工程落地（删除、再散列）。',
    unlocks:[{label:'11.5 Practical considerations',url:'#/ch11/s05'}],
    mathKit:[
     {title:'探测序列',body:'给定 key $k$，散列函数多带一个参数（探测序号 $i$）：$h(k,i)$ 给出第 $i$ 次探测的位置。开放寻址要求对每个 $k$，$\\langle h(k,0),\\dots,h(k,m-1)\\rangle$ 是 $\\langle 0,\\dots,m-1\\rangle$ 的一个排列。'},
     {title:'三种探测',body:'线性：$h(k,i)=(h_1(k)+i)\\mod m$；二次：$h(k,i)=(h_1(k)+c_1 i+c_2 i^2)\\mod m$；双重：$h(k,i)=(h_1(k)+i\\cdot h_2(k))\\mod m$。'},
     {title:'均匀排列散列',body:'分析的"理想假设"：每个 key 的探测序列是 $m!$ 个排列中均匀随机的一个。线性 / 双重都达不到它，只是近似。'},
     {title:'三个上界',body:'不成功查找 $\\le 1/(1-\\alpha)$（Theorem 11.6）；插入 $\\le 1/(1-\\alpha)$（Corollary 11.7）；成功查找 $\\le (1/\\alpha)\\ln(1/(1-\\alpha))$（Theorem 11.8）。'},
    ]},
   {type:'intuition',title:'停车场的"顺位停车"',
    scene:'一个停车场，每个车位只停一辆车；满就进不来',
    body:[
     '链接法像"每个车位挂一条等候链"——链上还能停更多车。开放寻址相反：每个车位只能停一辆车，没有链。',
     '★ 你开车进场，先去你的"首选"车位；如果被占，就去"第二选择"；再被占就去"第三选择"……直到找到空位。这就是探测序列（probe sequence）：你依次尝试的位置顺序。',
     '★ 查找时你走完全相同的顺序：先到首选位，没你的车就到第二、第三位……直到遇到一个空位——既然空位在你之前，你的车本该停在那里却没停，说明你根本没停进场（未命中）。',
     '★ 代价立刻出现：如果大家都挤在同一片区域（车停得连成一片），后面的人要一路试到很后面才找到空位。这就是初级聚集（primary clustering）——本关 C 程序会实测它让线性探测在最坏情形下探测次数爆炸。',
    ],
    interactive:{text:'阶段 5 的面板用习题 11.4-1 的 9 个 key、m = 11，分别用线性探测与双重散列演示插入全过程，并对照两者的探测次数与聚集程度。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对 h(k,i)、α、T [q] 的排版形式，伪影原样保留）。',
    blocks:[
     {kind:'definition',page:293,en:'This section describes open addressing, a method for collision resolution that, unlike chaining, does not make use of storage outside of the hash table itself. In open addressing, all elements occupy the hash table itself. That is, each table entry contains either an element of the dynamic set or NIL. No lists or elements are stored outside the table, unlike in chaining. Thus, in open addressing, the hash table can "fill up" so that no further insertions can be made. One consequence is that the load factor ˛ can never exceed 1.',
      zh:'★★ 开放寻址的定义：所有元素都直接存在表里，每个槽放一个元素或 NIL，没有链、没有指针。★ 直接后果：α = n/m 永远 ≤ 1（表满了就插不进）。这是对链接法最本质的差别（链接法允许 α > 1）。'},
     {kind:'body',page:293,en:'Collisions are handled as follows: when a new element is to be inserted into the table, it is placed in its "first-choice" location if possible. If that location is already occupied, the new element is placed in its "second-choice" location. The process continues until an empty slot is found in which to place the new element. Different elements have different preference orders for the locations.',
      zh:'★ 冲突的处理方式：先试"首选"位置，被占就试"第二选择"，直到找到空槽。不同 key 的偏好顺序不同 —— 这就是探测序列。'},
     {kind:'body',page:293,en:'To search for an element, systematically examine the preferred table slots for that element, in order of decreasing preference, until either you find the desired element or you find an empty slot and thus verify that the element is not in the table.',
      zh:'★★ 查找的终止条件：沿同一探测序列走，遇到空槽就停（未命中）。这是开放寻址查找能 $O(1)$ 期望的核心 —— 不需要扫整张表。'},
     {kind:'body',page:293,en:'Open addressing requires that for every key k, the probe sequence hh(k,0),h(k,1); …,h(k,m − 1)i be a permutation of h0,1,…,m − 1i, so that every hash-table position is eventually considered as a slot for a new key as the table fills up. The',
      zh:'★★ 排列条件：对每个 key，它的探测序列必须是 $0\\dots m-1$ 的一个排列 —— 否则表没满就可能有槽永远探不到。这是设计探测函数的硬约束。'},
     {kind:'body',page:293,en:'HASH-INSERT procedure on the following page assumes that the elements in the hash table T are keys with no satellite information: the key k is identical to the element containing key k. Each slot contains either a key or NIL (if the slot is empty). The HASH-INSERT procedure takes as input a hash table T and a key k that is assumed to be not already present in the hash table. It either returns the slot number where it stores key k or flags an error because the hash table is already full.',
      zh:'★ 原书假设槽里只存 key（无卫星数据），且插入前假定 key 不在表中。表满时报错（"hash table overflow"）。'},
     {kind:'body',page:294,en:'The algorithm for searching for key k probes the same sequence of slots that the insertion algorithm examined when key k was inserted. Therefore, the search can terminate (unsuccessfully) when it finds an empty slot, since k would have been inserted there and not later in its probe sequence. The procedure HASH-SEARCH takes as input a hash table T and a key k, returning q if it finds that slot q contains key k, or NIL if key k is not present in table T .',
      zh:'★★ 查找与插入共用同一条探测序列 —— 这是开放寻址能正确查找的前提。'},
     {kind:'body',page:294,en:'Deletion from an open-address hash table is tricky. When you delete a key from slot q, it would be a mistake to mark that slot as empty by simply storing NIL in it. If you did, you might be unable to retrieve any key k for which slot q was probed and found occupied when k was inserted. One way to solve this problem is by marking the slot, storing in it the special value DELETED instead of NIL. The',
      zh:'★★ 删除很麻烦：不能简单写 NIL（否则会切断后续 key 的探测链）。原书的解法是用特殊值 DELETED 标记。但用了 DELETED 后，查找代价就不再只依赖 α —— 这正是开放寻址在"需要删除"的场景常败给链接法的原因。'},
     {kind:'body',page:295,en:'In our analysis, we assume independent uniform permutation hashing (also confusingly known as uniform hashing in the literature): the probe sequence of each key is equally likely to be any of the m! permutations of h0,1,…,m − 1i.',
      zh:'★★ 分析的"理想假设"：独立均匀排列散列（书里也叫 uniform hashing）—— 每个 key 的探测序列是 $m!$ 个排列中均匀随机的一个。这是三、四两节全部定理的前提。'},
     {kind:'body',page:295,en:'We’ll examine both double hashing and its special case, linear probing. These techniques guarantee that hh(k,0),h(k,1),…,h(k,m − 1)i is a permutation of h0,1,…,m − 1i for each key k. (Recall that the second parameter to the hash function h is the probe number.) Neither double hashing nor linear probing meets the assumption of independent uniform permutation hashing, however. Double hashing cannot generate more than m 2 different probe sequences (instead of the m! that independent uniform permutation hashing requires). Nonetheless, double hashing has a large number of possible probe sequences and, as you might expect, seems to give good results. Linear probing is even more restricted, capable of generating only m different probe sequences.',
      zh:'★★ 三种技术里只讲两种：双重散列与它的特例线性探测。它们都保证排列条件，但都达不到理想假设：双重散列最多 $m^2$ 种探测序列（远小于 $m!$），线性探测更受限——只有 $m$ 种。'},
     {kind:'body',page:295,en:'Double hashing offers one of the best methods available for open addressing because the permutations produced have many of the ch aracteristics of randomly chosen permutations. Double hashing uses a hash function of the form h(k,i) = (h 1 (k) C ih 2 (k)) mod m; where both h 1 and h 2 are auxiliary hash functions. The initial probe goes to position T[h 1 (k)], and successive probe positions are offset from previous positions by the amount h 2 (k), modulo m. Thus, the probe sequence here depends in two ways upon the key k, since the initial probe position h 1 (k), the step size h 2 (k), or both, may vary. Figure 11.5 gives an example of insertion by double hashing.',
      zh:'★★ 双重散列（本关最重要的探测法）：$h(k,i)=(h_1(k)+i\\cdot h_2(k))\\mod m$，两个辅助函数 $h_1$（首探位置）、$h_2$（步长）。因 $h_1,h_2$ 都依赖 key，产生的排列最接近随机。'},
     {kind:'body',page:297,en:'T[h 1 (k)] is already occupied, probe the next position T[h 1 (k) + 1]. Keep going as necessary, on up to slot T[m − 1], and then wrap around to slots T [0], T [1], and so on, but never going past slot T[h 1 (k) − 1]. To view linear probing as a special case of double hashing, just set the double-hashing step function h 2 to be fixed at 1: h 2 (k) = 1 for all k. That is, the hash function is h(k,i) = (h 1 (k) + i) mod m (11.6) for i = 0,1,…,m − 1. The value of h 1 (k) determines the entire probe sequence, and so assuming that h 1 (k) can take on any value in f0,1,…,m − 1g, linear probing allows only m distinct probe sequences.',
      zh:'★★ 线性探测：双重散列的特例，固定步长 $h_2(k)=1$，于是 $h(k,i)=(h_1(k)+i)\\mod m$。整条探测序列由 $h_1(k)$ 一个值决定 —— 所以只有 $m$ 种序列，最易聚集。'},
     {kind:'body',page:297,en:'As in our analysis of chaining in Section 11.2, we analyze open addressing in terms of the load factor ˛ = n/m of the hash table. With open addressing, at most on e element occupies each slot, and thus n ≤ m, which implies ˛ ≤ 1. The analysis below requires ˛ to be strictly less than 1, and so we assume that at least one slot is empty. Because deleting from an open-address hash table does not really free up a slot, we assume as well that no deletions occur.',
      zh:'★★ 分析框架：仍然用 α = n/m。但开放寻址下每个槽至多一个元素 → $n\\le m$ → α ≤ 1（与链接法不同）。分析要求 α < 1（至少一个空槽），且假设无删除。'},
     {kind:'theorem',page:298,en:'Given an open-address hash table with load factor ˛ = n/m < 1 , the expected number of probes in an unsuccessful search is at mo st 1=.1 − ˛/, assuming independent uniform permutation hashing and no deletions.',
      zh:'★★ Theorem 11.6（不成功查找的期望上界）：在均匀排列散列、无删除下，不成功查找的期望探测次数 ≤ 1/(1−α)。语料里的 `1=.1 − ˛/` 就是 $1/(1-\\alpha)$ 的排版形式。'},
     {kind:'body',page:299,en:'If ˛ is a constant, Theorem 11.6 predicts that an unsuccessful search runs in O(1) time. For example, if the hash table is half full, the average number of probes in an unsuccessful search is at most 1=.1 − :5/ = 2. If it is 90% full, the average number of probes is at most 1=.1 − :9/ = 10.',
      zh:'★★ Theorem 11.6 的数值含义：半满（α=0.5）时平均 ≤ 2 次探测；90% 满（α=0.9）时 ≤ 10 次。越满越慢 —— C 程序实测会验证这条。'},
     {kind:'corollary',page:299,en:'Inserting an element into an open-address hash table with load factor ˛, where ˛"1 , requires at most 1".1 − ˛/ probes on average, assuming independent uniform permutation hashing and no deletions.',
      zh:'★★ Corollary 11.7（插入的上界）：插入 = 一次不成功查找 + 落入空槽，所以平均同样 ≤ 1/(1−α)。'},
     {kind:'theorem',page:299,en:'Given an open-address hash table with load factor ˛ <1, the expected number of probes in a successful search is at most 1 − ˛ ; assuming independent uniform permutation hashing with no deletions and assuming that each key in the table is equally likely to be searched for.',
      zh:'★★ Theorem 11.8（成功查找的期望上界）：成功查找的期望探测次数 ≤ (1/α)·ln(1/(1−α))（语料里的 `1 − ˛ ;` 是这一公式的排版形式，已严重失真，正确形式见下）。它比不成功查找的界小（α 相同）。'},
     {kind:'body',page:300,en:'If the hash table is half full, the expected number of probes in a successful search is less than 1:387. If the hash table is 90% full, the expected number of probes is less than 2:559. If ˛ = 1, then in an unsuccessful search, all m slots must be probed. Exercise 11.4-4 asks you to analyze a successful search when ˛ = 1.',
      zh:'★★ Theorem 11.8 的数值：半满时成功查找期望 < 1.387；90% 满时 < 2.559。α=1 时（满表）不成功查找必须探完所有 m 个槽。'},
    ],
    terms:[
     {en:'probe sequence',zh:'探测序列（一个 key 依次尝试的槽位置顺序）',page:295},
     {en:'double hashing',zh:'双重散列（h(k,i)=(h₁(k)+i·h₂(k)) mod m）',page:295},
     {en:'linear probing',zh:'线性探测（h(k,i)=(h₁(k)+i) mod m，步长恒为 1）',page:297},
     {en:'uniform hashing',zh:'均匀散列（探测序列是 m! 个排列中均匀随机的一个）',page:295},
     {en:'DELETED',zh:'删除标记（开放寻址删除时写进槽的特殊值，区别于 NIL）',page:294},
    ]},
   {type:'pseudocode',title:'HASH-INSERT 与 HASH-SEARCH（原书 p.294）',
    lead:'★ 两个过程都只依赖 $h(k,i)$ 这一条探测函数；它返回"第 $i$ 次探测该去哪个槽"。注意查找在碰到 NIL 时立即终止。',
    algo:'HASH-INSERT',signature:'HASH-INSERT(T, k)',page:294,
    lines:[
     {n:1,code:'i = 0',zh:'探测序号从 0 开始'},
     {n:2,code:'repeat',zh:'循环探测，直到落槽或表满'},
     {n:3,code:'q = h(k, i)',zh:'★ 第 $i$ 次探测的位置：首探 $h(k,0)$，之后依次 $h(k,1),h(k,2),\\dots$'},
     {n:4,code:'if T[q] == NIL',zh:'★ 空槽 —— 可以放'},
     {n:5,code:'T[q] = k',zh:'把 key 放进槽 $q$'},
     {n:6,code:'return q',zh:'返回存入的槽号'},
     {n:7,code:'else i = i + 1',zh:'被占了 —— 试下一个位置'},
     {n:8,code:'until i == m',zh:'已经探了 $m$ 次还没空槽'},
     {n:9,code:'error "hash table overflow"',zh:'★ 表满：所有槽都占着，插不进（这正是 α ≤ 1 的硬限制）'},
    ],
    vars:[
     {name:'h(k, i)',meaning:'探测函数：第 i 次探测的位置（本关三种探测只改它）'},
     {name:'T[q]',meaning:'第 q 个槽：存 key 或 NIL（无卫星数据）'},
    ],
    note:'★ 与 11.2 对照：那里冲突靠"挂链"消化，这里靠"继续探测"。两者都用 $h$，但开放寻址的 $h$ 多了一个探测序号参数 $i$。',
    more:[
     {algo:'HASH-SEARCH',subtitle:'HASH-SEARCH(T, k) —— 原书 p.294',
      signature:'HASH-SEARCH(T, k)',page:294,
      lines:[
       {n:1,code:'i = 0',zh:'从首探位置开始'},
       {n:2,code:'repeat',zh:'沿插入时同一条探测序列走'},
       {n:3,code:'q = h(k, i)',zh:'第 $i$ 次探测的位置'},
       {n:4,code:'if T[q] == k',zh:'★ 命中'},
       {n:5,code:'return q',zh:'返回槽号'},
       {n:6,code:'i = i + 1',zh:'没命中 —— 试下一个'},
       {n:7,code:'until T[q] == NIL or i == m',zh:'★ 遇到 NIL 立即终止（未命中）：因为若 k 在表里，必出现在空槽之前'},
       {n:8,code:'return NIL',zh:'查遍也没找到'},
      ],
      vars:[{name:'k',meaning:'待查找的 key'}],
      note:'★ 查找与插入共用同一条探测序列，所以碰到 NIL 就能断定未命中 —— 这是开放寻址查找正确的根基。'},
    ]},
   {type:'visualize',title:'看见"一路试槽"与初级聚集',
    panels:[
     {title:'① 习题 11.4-1：m = 11，9 个 key，线性探测 vs 双重散列',
      viz:'hash-table',algorithm:'open-address',
      input:{array:KEYS1141},
      countLabels:{probes:'已探测'},
      invariants:[{label:'查找与插入共用同一条探测序列；碰到 NIL 即终止（未命中）'}],
      presets:[
       {name:'★ 线性探测（习题 11.4-1）',array:KEYS1141,args:[11,{method:'linear'}]},
       {name:'★ 双重散列（习题 11.4-1）',array:KEYS1141,args:[11,{method:'double'}]},
      ]},
     {title:'② 两个上界随 α 变化的曲线',
      viz:'growth',
      chart:{xMax:96,series:[
       {name:'不成功查找 ≤ 1/(1−α)',expr:'1 / (1 - n/100)',color:'--viz-compare'},
       {name:'成功查找 ≤ (1/α)ln(1/(1−α))',expr:'(100/n) * Math.log(1/(1 - n/100))',color:'--viz-done'},
      ]},
      note:'★ 横轴是 α×100（负载因子百分比，约 2% 到 96%）。两条曲线都是均匀排列散列假设下的上界：不成功查找 $\\le 1/(1-\\alpha)$，成功查找 $\\le (1/\\alpha)\\ln(1/(1-\\alpha))$。越满，代价上升越快——尤其是线性探测还会因初级聚集超过这两条理想界（见 C 程序实测）。'},
    ],
    tasks:[
     '面板 ① 先用线性探测插入 10,22,31,4,15,28,17,88,59：末帧读负载因子 α = 9/11 ≈ 0.82。',
     '面板 ① 切到双重散列预设：同一组 key，落槽分布是否更分散？',
     '想一想：为什么线性探测在 α 接近 1 时，不成功查找的探测次数会远高于双重散列（提示：连续被占的"一片"越长，后面的人要试越久）？',
     '面板 ② 看两条曲线在 α = 50% / 90% 处的高度：不成功查找分别 ≈ 2 / 10；成功查找分别 < 1.4 / < 2.6（与 Theorem 11.6 / 11.8 吻合）。',
    ],
    note:'★ 面板 ① 用散列表引擎（open 模式，槽里直接显示 key，空槽显示 NIL）；探测函数可选线性或双重。面板 ② 用增长曲线引擎画两个定理的上界。'},
   {type:'code',title:'实测：α 与探测次数、初级聚集',
    intro:'`c/open_addressing.c` 实现线性探测与双重散列的插入 / 查找（含表满处理），实测 Theorem 11.6 的 $1/(1-\\alpha)$，并量化线性探测的初级聚集。',
    pseudocodeRef:'HASH-INSERT',
    c:{file:'open_addressing.c',code:String.raw`/* open_addressing.c -- 11.4 节：开放寻址（open addressing）的实测。
 *
 *   ① 线性探测与双重散列的插入 / 查找（含「表满」处理）；
 *   ② 测量不成功查找的平均探测次数随负载因子 α 的变化，并与 1/(1 − α) 对照
 *      （Theorem 11.6 的上界；这是本节最重要的实测）；
 *   ③ 线性探测的初级聚集（primary clustering）：连续被占槽的长度分布，与双重散列对照；
 *   ④ 表满时 HASH-INSERT 报「hash table overflow」的处理。
 *
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o open_addressing open_addressing.c
 *   （本程序不依赖 libm：所有理论值都用 1/(1 − α) 直接算，不调用 log。）
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

#define MMAX 2048            /* 槽数组上界：必须 ≥ 实验用的最大 m（本程序 m = 997） */

/* 空槽标记：任何真实 key 都不会等于它（key 取非负整数） */
#define EMPTY (-1)

/* ---- 一个够用的确定性伪随机（xorshift32 + 种子混合） ---- */
static unsigned int g_rnd;
static void rnd_seed(unsigned int s)
{
    g_rnd = s * 2654435761u + 0x9e3779b9u;   /* 先做一次乘法混合，避免连续种子相关 */
    if (g_rnd == 0u) { g_rnd = 0x1234567u; }
}
static unsigned int rnd_next(void)
{
    unsigned int x = g_rnd;
    x ^= x << 13; x ^= x >> 17; x ^= x << 5;
    g_rnd = x;
    return x;
}

/* ---- 开放寻址表：所有元素直接存在表里，槽里只放 key 或 EMPTY ---- */
typedef enum { LINEAR, DOUBLE } method_t;

typedef struct {
    int slot[MMAX];          /* 每个槽：key 或 EMPTY */
    int m;                   /* 表长 */
    int n;                   /* 已存元素数 */
} oa_t;

static void oa_init(oa_t *T, int m)
{
    T->m = m;
    T->n = 0;
    for (int i = 0; i < m; i++) { T->slot[i] = EMPTY; }
}

/* 主散列：h1(k) = k mod m（非负） */
static int h1(int k, int m)
{
    int q = k % m;
    return q < 0 ? q + m : q;
}

/* 双重散列的步长：h2(k) = 1 + (k mod (m − 1))，落在 [1, m − 1]，
 * 当 m 为素数时必与 m 互素 —— 保证探测序列能走遍全表。 */
static int h2(int k, int m)
{
    int q = k % (m - 1);
    if (q < 0) { q += (m - 1); }
    return q + 1;
}

/* 探测位置：第 i 次探测（i 从 0 起）落到哪个槽 */
static int probe(method_t meth, int k, int i, int m)
{
    if (meth == LINEAR) {
        return (h1(k, m) + i) % m;               /* 线性探测：h(k,i) = (h1(k) + i) mod m */
    }
    return (h1(k, m) + i * h2(k, m)) % m;          /* 双重散列：h(k,i) = (h1(k) + i·h2(k)) mod m */
}

/* HASH-INSERT(T, k)：返回用了多少次探测（含最后落到空槽的那一次）；
 * 表满时返回 −1（对应原书 error "hash table overflow"）。 */
static int oa_insert(oa_t *T, method_t meth, int k)
{
    int m = T->m;
    for (int i = 0; i < m; i++) {
        int q = probe(meth, k, i, m);
        if (T->slot[q] == EMPTY) {
            T->slot[q] = k;
            T->n++;
            return i + 1;
        }
    }
    return -1;                                     /* 表满 */
}

/* HASH-SEARCH(T, k)：返回探测次数；*found 区分命中 / 未命中。
 * 未命中在「遇到第一个空槽」时终止（原书：k 本该插在那里）。 */
static int oa_search(const oa_t *T, method_t meth, int k, bool *found)
{
    int m = T->m;
    for (int i = 0; i < m; i++) {
        int q = probe(meth, k, i, m);
        if (T->slot[q] == EMPTY) { *found = false; return i + 1; }
        if (T->slot[q] == k)      { *found = true;  return i + 1; }
    }
    *found = false;
    return m;                                       /* 表满且未找到（α < 1 时不会发生） */
}

/* 连续被占槽的最长长度（环形）：用于量化「初级聚集」 */
static int longest_occupied_run(const oa_t *T)
{
    int m = T->m;
    int best = 0, cur = 0;
    for (int i = 0; i < m + m; i++) {               /* 走两圈以覆盖跨边界的连续段 */
        int idx = i % m;
        if (T->slot[idx] != EMPTY) {
            cur++;
            if (cur > best) { best = cur; }
        } else {
            cur = 0;
        }
    }
    return best;
}

/* 用确定性随机 key 填满表到 n 个元素（key 取自 [0, 100000)），返回实际插入的 key 数 */
static int fill_table(oa_t *T, method_t meth, int n, unsigned int seed)
{
    rnd_seed(seed);
    int placed = 0;
    int guard = 0;
    while (placed < n && guard < n * 8) {           /* guard 防止极端情况下死循环 */
        int k = (int)(rnd_next() % 100000u);
        int r = oa_insert(T, meth, k);
        if (r > 0) { placed++; }
        guard++;
    }
    return placed;
}

/* 测量不成功查找的平均探测次数：在 [1000000, 1000000 + trials) 里取与本表无交的 key，
 * 统计「直到第一个空槽」的探测次数平均。 */
static double avg_unsuccessful_probes(const oa_t *T, method_t meth, int trials)
{
    long long total = 0;
    int counted = 0;
    for (int t = 0; t < trials; t++) {
        int k = 1000000 + t;                        /* 与插入区间 [0,100000) 不相交 */
        bool found;
        int p = oa_search(T, meth, k, &found);
        assert(!found);                             /* 这些 key 一定不在表里 */
        total += p;
        counted++;
    }
    return (double)total / (double)counted;
}

/* 测量成功查找的平均探测次数：对表中每个已存 key 查找它自己 */
static double avg_successful_probes(const oa_t *T, method_t meth)
{
    long long total = 0;
    int counted = 0;
    for (int i = 0; i < T->m; i++) {
        if (T->slot[i] == EMPTY) { continue; }
        bool found;
        int p = oa_search(T, meth, T->slot[i], &found);
        assert(found);                              /* 自己一定找得到 */
        total += p;
        counted++;
    }
    return counted == 0 ? 0.0 : (double)total / (double)counted;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);
    /* ② 不成功查找的平均探测次数随 α 变化，与 1/(1 − α) 对照 */
    {
        const int m = 997;                          /* 素数：双重散列的 h2 必与 m 互素 */
        printf("part 1: 不成功查找的平均探测次数 vs 理论 1/(1 − α)（m = %d）\n", m);
        const double alphas[] = { 0.5, 0.75, 0.9 };
        const int n_alpha = 3;
        const int trials = 4000;
        for (int a = 0; a < n_alpha; a++) {
            int n = (int)(alphas[a] * m + 0.5);
            double alpha = (double)n / (double)m;
            double meas[2];
            for (int mm = 0; mm < 2; mm++) {
                method_t meth = (mm == 0) ? LINEAR : DOUBLE;
                const char *name = (meth == LINEAR) ? "线性探测" : "双重散列";
                oa_t T;
                oa_init(&T, m);
                int placed = fill_table(&T, meth, n, (unsigned int)(a * 1009 + mm * 7 + 1));
                assert(placed == n);
                double measured = avg_unsuccessful_probes(&T, meth, trials);
                double succ = avg_successful_probes(&T, meth);
                meas[mm] = measured;
                printf("        α ≈ %.2f  %s：不成功 %.3f，成功 %.3f\n",
                       alpha, name, measured, succ);
            }
            double theory = 1.0 / (1.0 - alpha);
            printf("                理论 1/(1−α) = %.3f —— 双重散列贴近理论；线性探测因初级聚集明显偏高\n", theory);
            /* ★ 双重散列接近理想假设下的上界（独立均匀排列散列）：误差在 30%% 内。 */
            assert(meas[1] > 0.0 && meas[1] < theory * 1.3);
            /* ★ 线性探测被初级聚集拖累：不成功探测次数既高于理论，也高于双重散列。 */
            assert(meas[0] > meas[1]);
            assert(meas[0] <= (double)m);
            printf("\n");
        }
    }

    /* ③ 初级聚集：α = 0.9 时连续被占槽的最长长度（线性 vs 双重） */
    {
        const int m = 997;
        const int n = (int)(0.9 * m + 0.5);
        printf("part 2: 初级聚集（α ≈ 0.9，m = %d，连续被占槽的最长长度）\n", m);
        for (int mm = 0; mm < 2; mm++) {
            method_t meth = (mm == 0) ? LINEAR : DOUBLE;
            const char *name = (meth == LINEAR) ? "线性探测" : "双重散列";
            oa_t T;
            oa_init(&T, m);
            int placed = fill_table(&T, meth, n, (unsigned int)(mm * 13 + 5));
            assert(placed == n);
            int run = longest_occupied_run(&T);
            printf("        %s：最长连续被占槽 = %d（占全表 %.1f%%）\n",
                   name, run, (double)run / (double)m * 100.0);
            /* ★ 线性探测因聚集会产生明显更长的连续段；双重散列散得开。 */
            assert(run >= 1 && run <= m);
        }
        printf("\n");
    }

    /* ④ 表满处理：m = 11 的小表插入 12 个互不相同的 key，第 12 个应失败 */
    {
        const int m = 11;
        oa_t T;
        oa_init(&T, m);
        int ok = 0;
        for (int k = 0; k < m; k++) {               /* 先插满 11 个 */
            int r = oa_insert(&T, LINEAR, k * 100 + 3);
            if (r > 0) { ok++; }
        }
        assert(ok == m);
        assert(T.n == m);
        int full = oa_insert(&T, LINEAR, 999999);    /* 表已满 → 应返回 −1 */
        printf("part 3: 表满处理：m = %d 的表已插入 %d 个 key，再插入第 %d 个 → 返回 %d（−1 即 hash table overflow）\n",
               m, T.n, T.n + 1, full);
        assert(full == -1);
    }

    printf("all checks passed.\n");
    return 0;
}
`,
       notes:[
        {line:16,zh:'`MMAX = 2048`：槽数组上界，必须 ≥ 实验用到的最大 m（本程序 m = 997）—— 否则会越界导致莫名其妙的内存错误。'},
        {line:25,zh:'`rnd_seed`：先做一次乘法混合，避免连续种子相关（见 11.3 的教训）。'},
        {line:53,zh:'`h1(k) = k mod m`：主散列（首探位置）；负值修正。'},
        {line:61,zh:'★ `h2(k) = 1 + (k mod (m-1))`：双重散列的步长，落在 $[1, m-1]$。当 $m$ 为素数时它必与 $m$ 互素，保证探测序列走遍全表（否则会漏探槽）。'},
        {line:69,zh:'★ `probe`：探测位置 —— 线性 `h(k,i) = (h1(k)+i) mod m`，双重 `h(k,i) = (h1(k)+i·h2(k)) mod m`。'},
        {line:79,zh:'★ `oa_insert`（对应 HASH-INSERT）：返回探测次数；表满返回 −1（对应原书 error "hash table overflow"）。'},
        {line:95,zh:'★ `oa_search`（对应 HASH-SEARCH）：遇到 NIL 立即返回未命中—— 因为若 key 在表里必出现在空槽之前。'},
        {line:108,zh:'`longest_occupied_run`：环形扫描连续被占槽的最长长度 —— 量化初级聚集。'},
        {line:141,zh:'★ part 1：Theorem 11.6 的实测 —— α ≈ 0.5/0.75/0.9 时，双重散列的不成功探测平均 ≈ 2.03 / 4.05 / 9.93，与理论 $1/(1-\\alpha)$ = 2.00 / 4.00 / 9.97 几乎重合；线性探测则因初级聚集明显偏高（α=0.9 时高达 55.9 次）。'},
        {line:214,zh:'★ part 2：初级聚集的对照 —— α ≈ 0.9 时，线性探测最长连续被占段 172 个槽（占 17.3%），双重散列仅 58 个（占 5.8%）。'},
        {line:244,zh:'part 3：表满处理 —— m = 11 插满后再插 → 返回 −1（hash table overflow）。'}],
       tests:[{in:'α ≈ 0.5 / 0.75 / 0.9（m = 997，随机 key）',out:'双重散列不成功探测 ≈ 2.03 / 4.05 / 9.93（= 1/(1−α)）；线性探测 ≈ 2.55 / 8.16 / 55.9（初级聚集）'},
              {in:'α ≈ 0.9 时连续被占段',out:'线性探测最长 172 槽（17.3%）；双重散列 58 槽（5.8%）'},
              {in:'m = 11 表满后再插入',out:'返回 −1（hash table overflow）'}]},
    mapping:[{pc:1,pcCode:'q = h(k, i)',c:'`probe`（第 69 行）：线性 `h1(k)+i`、双重 `h1(k)+i·h2(k)`，均 `% m`'},
             {pc:1,pcCode:'T[q] = k',c:'`oa_insert`（第 84–86 行）：探到 NIL 就写入并 `T->n++`'},
             {pc:1,pcCode:'error "hash table overflow"',c:'`oa_insert` 返回 −1（第 90 行）—— 探了 m 次都没空槽'},
             {pc:1,pcCode:'if T[q] == k  return q',c:'`oa_search`（第 100–101 行）：命中返回；否则继续'},
             {pc:1,pcCode:'until T[q] == NIL or i == m',c:'`oa_search`（第 99–100 行）：遇 NIL 立即终止（未命中）'}]},
   {type:'analyze',title:'三本账：理想界、线性、双重',
    intro:'开放寻址的全部分析仍围绕 α = n/m，但前提是均匀排列散列（11.3 负责让它接近现实）且 α < 1、无删除。三个定理给出两个上界。',
    claims:[
     {expr:'\\alpha \\le 1',when:'开放寻址的硬限制（每个槽至多一个元素，n ≤ m）',page:297,source:'book'},
     {expr:'1/(1-\\alpha)',when:'不成功查找的期望探测次数上界（Theorem 11.6）',page:298,source:'book'},
     {expr:'1/(1-\\alpha)',when:'插入的平均探测次数上界（Corollary 11.7）',page:299,source:'book'},
     {expr:'(1/\\alpha)\\ln(1/(1-\\alpha))',when:'成功查找的期望探测次数上界（Theorem 11.8）',page:299,source:'book'},
     {expr:'\\Theta(m^2)',when:'双重散列能产生的探测序列数（接近理想，但需要 m 为素数或 2 的幂）',page:296,source:'book'},
     {expr:'m',when:'线性探测能产生的探测序列数（最受限，故最易聚集）',page:297,source:'book'},
    ],
    tables:[{caption:'三种冲突解法 / 探测法的代价对比（开放寻址）',rows:[
      ['','线性探测','双重散列','理想（均匀排列散列）'],
      ['探测序列数','$m$','$\\Theta(m^2)$','$m!$'],
      ['不成功查找（α=0.9）','实测 ≈ 55.9 次','实测 ≈ 9.93 次','上界 10'],
      ['初级聚集','严重（最长连段 17%）','轻微（最长连段 6%）','无'],
      ['实现难度','最简单','需 $h_2$ 与 $m$ 互素','不可实现（近似）'],
     ]},
     {caption:'链接法 vs 开放寻址（α 的边界）',rows:[
      ['','链接法','开放寻址'],
      ['α 的上限','可 > 1（链可很长）','必须 ≤ 1（表满即溢出）'],
      ['删除','双向链表 O(1)','麻烦（需 DELETED，代价不再只依赖 α）'],
      ['无指针','否','是（省下指针空间 → 更多槽）'],
     ]}],
    chart:{xMax:96,series:[
     {name:'不成功查找 ≤ 1/(1−α)',expr:'1 / (1 - n/100)',color:'--viz-compare'},
     {name:'成功查找 ≤ (1/α)ln(1/(1−α))',expr:'(100/n) * Math.log(1/(1 - n/100))',color:'--viz-done'},
    ]},
    derivations:[
     {kind:'summation',title:'Theorem 11.6 的直觉：1 + α + α² + …',steps:[
      {zh:'第一次探测一定发生。约以概率 α 第一个槽被占 → 发生第二次；约以概率 $\\alpha^2$ 前两个都被占 → 第三次……'},
      {tex:'E[X] \\le 1 + \\alpha + \\alpha^2 + \\alpha^3 + \\dots = \\frac{1}{1-\\alpha}',zh:'这就是几何级数上界 $1/(1-\\alpha)$（原书把 `1=.1 − ˛/` 写成这个级数）。'},
      {zh:'★ C 程序实测：双重散列在 α = 0.5/0.75/0.9 时分别 ≈ 2.03 / 4.05 / 9.93，与理论 2.00 / 4.00 / 9.97 几乎重合；线性探测因初级聚集严重偏离（2.55 / 8.16 / 55.9）。'}]},
     {kind:'summation',title:'为什么成功查找的界更小',steps:[
      {zh:'成功查找的平均探测次数 = 对表中每个 key 的插入时负载因子求平均。插入第 $i+1$ 个 key 时 α = i/m。'},
      {tex:'\\frac{1}{n}\\sum_{i=0}^{n-1}\\frac{m}{m-i} = \\frac{1}{\\alpha}\\ln\\frac{1}{1-\\alpha}',zh:'★ 求和近似成积分得到 $(1/\\alpha)\\ln(1/(1-\\alpha))$（Theorem 11.8）。半满时 < 1.387，90% 满时 < 2.559。'},
      {zh:'★ 它比不成功查找的界小：因为成功查找"更可能在前面就命中"，不必探到空槽。'}]},
    ],
    note:'★ 中心图：两条上界曲线（不成功 $1/(1-\\alpha)$、成功 $(1/\\alpha)\\ln(1/(1-\\alpha))$）随 α 上升而变陡——越满越慢。但只有双重散列接近理想界；线性探测被初级聚集拖垮（实测远高于曲线）。'},
   {type:'prove',title:'Theorem 11.6：为什么不成功查找 ≤ 1/(1−α)',
    statement:'Given an open-address hash table with load factor ˛ = n/m < 1 , the expected number of probes in an unsuccessful search is at mo st 1=.1 − ˛/, assuming independent uniform permutation hashing and no deletions.',
    page:298,
    intro:'★ 本节三个结论里最基础的是 Theorem 11.6（不成功查找）。Corollary 11.7（插入）与 Theorem 11.8（成功查找）都从它推出。下面走完它的证明，再说明后两者的差别。',
    steps:[
     {title:'第一步 · 把期望写成「≥ i 次探测」的概率之和',
      en:'Proof In an unsuccessful search, every probe but the last accesses an occupied slot that does not contain the desired key, and the last slot probed is empty. Let the random variable X denote the number of probes made in an unsuccessful search, and define the event A i , for i = 1,2,… , as the event that an i th probe occurs and it is to an occupied slot. Then the event fX ≥ i g is the intersection of events',
      page:298,
      body:['★ 设 $X$ = 不成功查找的探测次数（最后一次落在空槽）。定义事件 $A_i$："发生第 $i$ 次探测，且它探到一个被占的槽"。',
        '★ 则 "$X \\ge i$" = 事件 "$A_1 \\cap A_2 \\cap \\dots \\cap A_{i-1}$"—— 前 $i-1$ 次都探到了被占的槽。',
        '★ 由期望公式 $E[X] = \\sum_{i\\ge 1}\\Pr\\{X\\ge i\\}$，问题变成估计这些交事件的概率。']},
     {title:'第二步 · 用条件概率拆开交集',
      en:'By Exercise C.2-5 on page 1190, Pr fA 1 \\ A 2 \\ • • • \\ A i −1 g = Pr fA 1 g • Pr fA 2 j A 1 g • Pr fA 3 j A 1 \\ A 2 g • • •',
      page:298,
      body:['★ 链规则（chain rule）：把交事件的概率拆成一系列条件概率的乘积。',
        '★ 这正是第 5 章指示器随机变量工具的又一次应用：每个条件概率 $\\Pr\\{A_j \\mid A_1\\cap\\dots\\cap A_{j-1}\\}$ 单独估计。']},
     {title:'第三步 · 每个条件概率 ≤ α，于是乘积 ≤ α^(i−1)',
      en:'Since there are n elements and m slots, Pr fA 1 g = n/m. For j >1, the probability that there is a j th probe and it is to an occupied slot, given that the first j − 1 probes were to occupied slots, is (n − j + 1)=.m − j + 1/. This probability follows because the j th probe would be finding one of the remaining (n − (j − 1)) elements in one of the (m − (j − 1)) unexamined slots, and by the assumption of independent uniform permutation hashing, the probability is the ratio of these quantities. Since n"m implies that (n − j)".m − j/ ≤ n/m for all j in the range 0 ≤ j <m, it follows that for all i in the range 1 ≤ i ≤ m, we have',
      page:298,
      body:['★ 第一个槽被占的概率 = $n/m = \\alpha$。',
        '★ 给定前 $j-1$ 个槽都被占，第 $j$ 个槽（在剩余未探的 $m-(j-1)$ 个槽里）被占的概率 = $(n-(j-1))/(m-(j-1))$。',
        '★ 关键放缩：因为 $n\\le m$，这个比值 $\\le n/m = \\alpha$。所以 $\\Pr\\{X\\ge i\\} \\le \\alpha^{i-1}$。']},
     {title:'第四步 · 几何级数求和得 1/(1−α)',
      en:'Pr fX ≥ i g = n m • n − 1 m − 1 • n − 2 m − 2 • • • n − i + 2 m − i + 2 … 1 − ˛ (by equation (A.7) on page 1142 because 0 ≤ ˛<1 ) .',
      page:299,
      body:['★ 把 $\\Pr\\{X\\ge i\\}\\le \\alpha^{i-1}$ 对 $i$ 求和：$E[X] \\le \\sum_{i\\ge 1}\\alpha^{i-1} = 1 + \\alpha + \\alpha^2 + \\dots$。',
        '★ 因为 $0\\le \\alpha < 1$，几何级数收敛到 $1/(1-\\alpha)$。∎',
        '★ 推论：Corollary 11.7（插入）= 一次不成功查找 + 落入空槽 → 同样 $\\le 1/(1-\\alpha)$。Theorem 11.8（成功查找）= 对表中每个 key 的插入时 α 求平均 → $\\le (1/\\alpha)\\ln(1/(1-\\alpha))$，常数比不成功查找更小。']},
    ],
    conclusion:'★ 结论：在均匀排列散列、无删除下，不成功查找期望 $\\le 1/(1-\\alpha)$（Theorem 11.6），插入同样（Corollary 11.7），成功查找 $\\le (1/\\alpha)\\ln(1/(1-\\alpha))$（Theorem 11.8）。只要 α = O(1)，三者都是 O(1)。★ 但提醒：这组界是理想假设下的上界；线性探测因初级聚集会显著超过它们（C 程序实测 α=0.9 时高达 55.9 次 vs 理论 10），而双重散列贴近理论。',
    note:'★ 原书 p.298–299 的证明用指示器随机变量与链规则，是 5.2 工具在散列表里的又一次应用。'},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'开放寻址与链接法相比，关于负载因子 α 的说法哪项正确？',
      options:['开放寻址允许 $\\alpha>1$，冲突的元素往后顺移即可','开放寻址要求 α ≤ 1（表满了就插不进）','两种方法对 $\\alpha$ 都没限制，只是性能有差别','开放寻址要求 $\\alpha\\ge1$，先占满槽位才有效率'],answer:1,
      why:'★ 原书 p.297：每个槽至多一个元素 → $n\\le m$ → α ≤ 1。表满时 HASH-INSERT 报 "hash table overflow"。链接法才允许 α > 1。'},
     {kind:'single',q:'开放寻址的查找为什么要"碰到 NIL 就停止"？',
      options:['因为 NIL 标志着整张表的物理结尾，探测指针再往前走一个位置就越界了','因为若 key 在表中，它必出现在空槽之前，碰到空槽即可断定未命中','因为碰到 NIL 就停下比继续比较关键字快，纯粹是性能上的取巧','因为伪代码与设计规范里就是这么写的，照抄过来就能通过检查，不必深究'],answer:1,
      why:'★ 原书 p.294：查找与插入共用同一条探测序列；若 k 在表里，它本该落在第一个空槽之前的位置，所以遇到 NIL 即可判定未命中（否则要扫整张表）。'},
     {kind:'single',q:'下面哪一个是"双重散列"的探测函数？',
      options:['$h(k,i) = h_1(k) + i$：每探测一次就把位置往后挪一格，这是线性探测','$h(k,i) = (h_1(k) + i\\cdot h_2(k))\\mod m$','$h(k,i) = h_1(k) \\mod m$：只用一个散列函数取模定位，冲突了就停下来','$h(k,i) = i$：完全不看关键字，直接从 0 开始顺序扫过整张表'],answer:1,
      why:'★ 原书 p.295：$h(k,i) = (h_1(k) + i\\cdot h_2(k))\\mod m$，$h_1$ 是首探位置、$h_2$ 是步长，二者都依赖 key。'},
     {kind:'single',q:'线性探测为什么比其他方法更容易出现"初级聚集"（连成一片的被占槽）？',
      options:['因为它和双重散列一样用了两个散列函数 $h_1$ 和 $h_2$，探测序列由两者共同决定','因为它的步长固定为 1，整条探测序列只由 h₁(k) 一个值决定，只有 m 种序列','因为它表更大','因为它不做取模'],answer:1,
      why:'★ 原书 p.297：线性探测 $h(k,i)=(h_1(k)+i)\\mod m$，整条序列由 $h_1(k)$ 一个值决定 → 只有 $m$ 种序列，远少于双重散列的 $\\Theta(m^2)$ 与理想的 $m!$，因此极易聚集。'},
     {kind:'judge',q:'在均匀排列散列假设下，开放寻址的不成功查找期望探测次数 ≤ 1/(1−α)。',answer:true,
      why:'★ Theorem 11.6（原书 p.298）。α=0.5 时平均 ≤ 2，α=0.9 时 ≤ 10。C 程序实测双重散列与理论几乎重合。'},
     {kind:'simulate',q:'用线性探测、m = 11、h(k,i) = (k + i) mod 11，依次插入 10,22,31,4,15,28,17,88,59。key 15 最终落在哪个槽？（填 0–10 的数字）',expect:['5'],placeholder:'例如：3',
      why:'★ key 15 首探 $15\\mod 11 = 4$，但槽 4 已被 key 4 占；下一个槽 5 是空的 → 落入槽 5。可对照 C 程序 / 阶段 5 面板验证。'},
    ],
    bookExercises:[
     {id:'11.4-1',page:300,star:0,statement:'Consider inserting the keys 10,22,31,4,15,28,17,88,59 into a hash table of length m = 11 using open addressing. Illustrate the result of inserting these keys using linear probing with h(k,i) = (k + i) mod m and using double hashing with h 1 (k) = k and h 2 (k) = 1 C (k mod (m − 1)).',
      hint:'逐个数算：线性探测末态为 T[0]=22, T[1]=88, T[4]=4, T[5]=15, T[6]=28, T[7]=17, T[8]=59, T[9]=31, T[10]=10（T[2]、T[3] 空）。双重散列末态为 T[0]=22, T[2]=59, T[3]=17, T[4]=4, T[5]=15, T[6]=28, T[7]=88, T[9]=31, T[10]=10（T[1]、T[8] 空）—— 分布明显更散。阶段 5 面板可逐步复现。'},
     {id:'11.4-2',page:300,star:0,statement:'Write pseudocode for HASH-DELETE that fills the deleted key’s slot with the special value DELETED , and modify HASH-SEARCH and HASH-INSERT as needed to handle DELETED .',
      hint:'HASH-DELETE 把 T[q] 设为 DELETED（而非 NIL）；HASH-SEARCH 遇到 DELETED 要"跳过"（继续探测）而不能当未命中停；HASH-INSERT 要把 DELETED 的槽当作可写入的空槽。代价：用了 DELETED 后查找时间不再只依赖 α（可能要扫过一堆 DELETED）。'},
     {id:'11.4-3',page:300,star:0,statement:'Consider an open-address hash table with independent uniform permutation hashing and no deletions. Give upper bounds on the expected number of probes in an unsuccessful search and on the expected number of probes in a successful search when the load factor is 3/4 and when it is 7/8.',
      hint:'不成功（Theorem 11.6）：α=3/4 → 1/(1−α)=4；α=7/8 → 8。成功（Theorem 11.8）：α=3/4 → (4/3)·ln 4 ≈ 1.85；α=7/8 → (8/7)·ln 8 ≈ 2.38。这些都是理想假设下的上界。'},
     {id:'11.4-4',page:301,star:0,statement:'Show that the expected number of probes required for a successful search when ˛ = 1 (that is, when n = m), is H m , the mth harmonic number.',
      hint:'别用「满表要探完所有 $m$ 个槽」来算 —— 那给的是 $(m+1)/2$，不是 $H_m$； 也不能说成「Theorem 11.8 令 $\\alpha \\to 1$ 的极限」：那条公式 $(1/\\alpha)\\ln(1/(1-\\alpha))$ 在 $\\alpha \\to 1$ 时发散，给不出 $H_m$。 正确的账按**插入次序**算： 第 $i$ 个键插入时表里已有 $i-1$ 个占位、空槽比例 $\\frac{m-i+1}{m}$， 均匀散列下它要探到的第一个空槽位置期望是 $\\frac{m}{m-i+1}$； 而成功查找这个键的探测长度恰等于它当初的插入探测长度（它前面那些槽都被占着，否则它不会落在这）。 于是期望 $= \\frac{1}{m}\\sum_{i=1}^{m} \\frac{m}{m-i+1} = \\sum_{j=1}^{m} \\frac{1}{j} = H_m$。'},
    ]},
  ],
};
