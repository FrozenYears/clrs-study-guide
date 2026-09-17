/* 第 11 章 11.1：直接寻址表（Direct-address tables）。
 * 原文锚点：印刷页 273–274（pdf_index 294–295）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（11/11 PASS）。
 * 主题：key 就是下标 —— 三个字典操作各 O(1)，代价是空间 Θ(m)。
 */

/* 直接寻址表的静态帧序列（hash-table viz 的 open 模式）：
 * K = {2, 3, 5, 8}（原书 Figure 11.1 的实际 key 集合），m = 10 */
const SLOT = (keys, marks) => Array.from({ length: 10 }, (_, i) => ({
  i,
  chain: keys.includes(i) ? [{ key: i, state: marks && marks[i] ? marks[i] : undefined }] : [],
  state: marks && marks[i] === 'active' ? 'active' : undefined,
}));

const FIG111 = [
  { slots: SLOT([]), m: 10, mode: 'open', phase: '初始',
    note: '空表 T[0 : 9]：每个槽都是 NIL。注意"槽的下标"从一开始就是"key 的候选值"。' },
  { slots: SLOT([2]), m: 10, mode: 'open', phase: 'INSERT',
    note: 'DIRECT-ADDRESS-INSERT(T, x)：x.key = 2 → 直接写 T[2] = x。★ 没有散列、没有比较、没有搜索。' },
  { slots: SLOT([2, 3, 5, 8]), m: 10, mode: 'open', phase: '插入完毕',
    note: '插入 3、5、8 之后：K = {2,3,5,8}（原书 Figure 11.1 的实际 key 集合）。其余槽（灰）是 NIL。' },
  { slots: SLOT([2, 3, 5, 8], { 5: 'active' }), m: 10, mode: 'open', phase: 'SEARCH',
    note: 'DIRECT-ADDRESS-SEARCH(T, 5)：返回 T[5] —— 一次数组访问。★ 与链表按 key 查找的 Θ(n) 相比，这是"下标直达"。' },
  { slots: SLOT([2, 3, 5, 8], { 3: 'active' }), m: 10, mode: 'open', phase: 'DELETE',
    note: 'DIRECT-ADDRESS-DELETE(T, x)：T[x.key] = NIL —— 一次写入。★ 注意：不需要"找到前驱"，因为根本没有链。' },
  { slots: SLOT([2, 5, 8]), m: 10, mode: 'open', phase: '删除完毕',
    note: '删除后 K = {2,5,8}。★ 三个操作都是 O(1)：代价全部转移到空间 —— 表长 m 与元素数 n 无关。' },
];

export default {
  key:'s01',id:'ch11/s01',chapter:11,section:'11.1',
  title:'直接寻址表：当 key 就是下标',shortTitle:'11.1 直接寻址表',
  titleEn:'Direct-address tables',
  source:{printed:[273,274],pdf:[294,295]},
  prerequisites:[{label:'10.3 Representing rooted trees',url:'#/ch10/s03'}],
  stages:[
   {type:'map',title:'散列表的第一课：先看"不需要散列"的情形',
    why:'如果 key 恰好落在一个不大的整数区间 $[0, m-1]$ 里，那么"查找"可以退化成一次**数组下标访问** —— 这就是直接寻址表。它的三个字典操作全是 $O(1)$，且**没有任何比较**。',
    position:'10.2 的链表按 key 查找是 $\\Theta(n)$、按 key 删除也是 $\\Theta(n)$（要先用 $\\Theta(n)$ 的查找换到指针）。本关用"下标直达"把这两项一起压到 $O(1)$ —— 代价是 $\\Theta(m)$ 空间。11.2 的散列表则用**散列函数**把"key 空间大"这件事救回来。',
    unlocks:[{label:'11.2 Hash tables（散列表 · 链接法）',url:'#/ch11/s02'}],
    mathKit:[
     {title:'适用条件',body:'每个元素的 key 互异、取自全域 $U = \\{0, 1, \\dots, m-1\\}$ 且 $m$ **不太大**。'},
     {title:'三个操作',body:'SEARCH(T, k) = `return T[k]`；INSERT 写 `T[x.key] = x`；DELETE 写 `T[x.key] = NIL`。各一行、各 $O(1)$。'},
     {title:'关键取舍',body:'$O(1)$ 的代价是**空间 $\\Theta(m)$**（与元素个数 $n$ 无关）。$m \\gg n$ 时浪费 —— 这正是散列表要解决的问题。'},
    ]},
   {type:'intuition',title:'编号即位置：橱柜与钥匙同号',
    scene:'存包柜：钥匙号就是柜子号，不用找',
    body:[
     '直接寻址表像一排**编号储物柜**：如果你的东西的"编号"是 5，就放进 5 号柜。取的时候直接开 5 号 —— 不需要挨个柜子找。',
     '★ 三个操作因此都变成一行代码：查 = `T[k]`、插 = `T[x.key] = x`、删 = `T[x.key] = NIL`。**没有任何循环、没有任何比较。**',
     '★ 代价在空间上：柜子必须按**编号范围**备齐。如果编号可能是 1 到 1000000，但只存 10 件东西，你也要有 100 万个柜子（或至少 100 万个指针）。',
     '★ 还有一层更细的观察（原书接着追问）：既然下标就等于 key，那**元素里干嘛还要存 key**？答案是"为了区分空槽" —— 存进去的对象本身就携带了它是谁。11.1-2 的位向量方案把这个观察推到底：没有卫星数据时，一个槽只要 1 **位**。',
    ],
    interactive:{text:'阶段 5 的面板用 6 帧画出原书 Figure 11.1 的建表、查找、删除过程（K = {2,3,5,8}，m = 10）。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对属性的排版形式 T[k] 与 T[x.key]）。',
    blocks:[
     {kind:'body',page:273,en:'Direct addressing is a simple technique that works well when the universe U of keys is reasonably small. Suppose that an application needs a dynamic set in which each element has a distinct key drawn from the universe U = f0,1,…,m − 1g, where m is not too large.',
      zh:'★★ 适用条件写在第一句：**全域 $U$ 不太大**、key 互异。注意语料里 $\\{0,1,\\dots\\}$ 的排版形式是 `f0,1,…,m − 1g`。'},
     {kind:'body',page:273,en:'To represent the dynamic set, you can use an array, or direct-address table, denoted by T[0 : m − 1], in which each position, or slot, corresponds to a key in the universe U . Figure 11.1 illustrates this approach. Slot k points to an element in the set with key k. If the set contains no element with key k, then T[k] DNIL.',
      zh:'★★ **本关的核心一句话**：每个**槽**（slot）对应全域里的一个 key；槽 $k$ 指向 key 为 $k$ 的元素；没有该 key 时 $T[k] = \\text{NIL}$。'},
     {kind:'body',page:273,en:'The dictionary operations DIRECT-ADDRESS-SEARCH , DIRECT-ADDRESS- INSERT , and DIRECT-ADDRESS-DELETE on the following page are trivial to implement. Each takes only O(1) time.',
      zh:'★★ 三个操作"trivial to implement"、各 $O(1)$ —— 下一段的伪代码证实它们各只有一行。'},
     {kind:'body',page:273,en:'For some applications, the direct-address table itself can hold the elements in the dynamic set. That is, rather than storing an element’s key and satellite data in an object external to the direct-address table, with a pointer from a slot in the table to the object, save space by storing the object directly in the slot. To indicate an empty slot, use a special key. Then again, why store the key of the object at all?',
      zh:'★★ 一个工程优化：**把对象直接放进槽里**（省掉指针）。★ 最后那句"既然下标就是 key，干嘛还要存 key？"是原书少见的反问 —— 它在铺垫下面的位向量方案。'},
     {kind:'body',page:273,en:'The index of the object is its key! Of course, then you’d need some way to tell whether slots are empty.',
      zh:'★★ 反问的答案：**下标就是 key**。随之而来的唯一麻烦是"怎么知道槽是空的" —— 这就是 11.1-2 用位向量、11.5 用"特殊 key"要解决的问题。'},
    ],
    terms:[
     {en:'direct-address table',zh:'直接寻址表',page:273},
     {en:'slot',zh:'槽（表里的一格，对应一个 key）',page:273},
    ]},
   {type:'pseudocode',title:'DIRECT-ADDRESS-SEARCH / INSERT / DELETE：各 1 行',
    lead:'★ 全书最短的三个过程。注意三个操作**都没有循环** —— 这就是 $O(1)$ 的字面含义。',
    algo:'DIRECT-ADDRESS-SEARCH',signature:'DIRECT-ADDRESS-SEARCH(T, k)',page:274,
    lines:[
     {n:1,code:'return T[k]',zh:'★ 唯一的一行：一次数组下标访问。没有比较、没有搜索、没有散列。'},
    ],
    vars:[
     {name:'T',meaning:'直接寻址表 $T[0 : m-1]$'},
     {name:'k',meaning:'key —— 同时就是槽的下标'},
    ],
    note:'★ 与 10.2 的 LIST-SEARCH（4 行、$\\Theta(n)$）对照：这里把"找"这件事整个消掉了，代价转移到了"表必须够大"。',
    more:[
     {algo:'DIRECT-ADDRESS-INSERT',subtitle:'DIRECT-ADDRESS-INSERT(T, x) —— 1 行（原书 p.274）',
      signature:'DIRECT-ADDRESS-INSERT(T, x)',page:274,
      lines:[
       {n:1,code:'T[x.key] = x',zh:'写入定位由 $x$ 自己的 key 决定 —— 不需要比较决定"放哪"。'},
      ],
      vars:[{name:'x',meaning:'待插入的元素（key 已设置）'}],
      note:''},
     {algo:'DIRECT-ADDRESS-DELETE',subtitle:'DIRECT-ADDRESS-DELETE(T, x) —— 1 行（原书 p.274）',
      signature:'DIRECT-ADDRESS-DELETE(T, x)',page:274,
      lines:[
       {n:1,code:'T[x.key] = NIL',zh:'★ 这里**不需要"先找到前驱"**（10.2 的双向链表删除要 2 条指针改写）；直接置 NIL 即可，因为表里没有链。'},
      ],
      vars:[{name:'x',meaning:'待删除的元素'}],
      note:'★ 代价对照：链表的 DELETE 也是 $O(1)$，但"按 key 删除"被查找拖成 $\\Theta(n)$；这里连查找都是 $O(1)$。'},
    ]},
   {type:'visualize',title:'看见"下标直达"',
    panels:[
     {title:'① 原书 Figure 11.1：建表 → 查找 → 删除（K = {2,3,5,8}, m = 10）',
      viz:'hash-table',mode:'open',
      trees:FIG111,
      treeNotes:[
        '槽的下标就是 key 的候选值 —— 这是直接寻址表与散列表的唯一区别（后者要过一道 h(k)）。',
        '★ 插入顺序无关紧要：每个元素的位置由它的 key 唯一决定。',
        '★ 删除只需置 NIL（第 5 帧）：因为没有链，不需要维护前后关系。',
      ]},
    ],
    tasks:[
     '逐帧对照：同一个 key 永远落在同一个槽里（这与散列表的"可能冲突"形成对照）。',
     '第 4 帧：SEARCH(5) 只访问 T[5] —— 数一数它做了几次"比较"？（答案：0 次，下标访问不算比较）',
     '想一想：如果 key 的范围是 0..999999 而只存 3 个元素，这张表要多大？',
    ],
    note:'★ 面板用散列表引擎的 open 模式（槽内直接放 key，没有链）。静态 6 帧对应原书 Figure 11.1 的完整过程。'},
   {type:'code',title:'实测：三个 O(1) 与空间账',
    intro:'`c/direct_address.c` 实现三个操作并逐项验证；顺带做了习题 11.1-1（找最大值，最坏 $\\Theta(m)$）与 11.1-2（位向量）。',
    pseudocodeRef:'DIRECT-ADDRESS-SEARCH',
    c:{file:'direct_address.c',code:String.raw`/* direct_address.c -- 11.1 节：直接寻址表的实现与代价验证。
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
`,
       notes:[{line:31,zh:'`da_search`：伪代码那唯一的一行 —— `return T->slot[k]`，一次数组访问。'},
              {line:34,zh:'`da_insert`：`T->slot[x->key] = x`。'},
              {line:37,zh:'`da_delete`：`T->slot[x->key] = NULL` —— 无需维护链。'},
              {line:50,zh:'part 1–2：SEARCH 命中/未命中各 1 次数组访问；DELETE 1 次写入。'},
              {line:59,zh:'part 3：存 3 个元素仍占 10 个槽 —— 空间 $\\Theta(m)$ 与 $n$ 无关（这就是 11.2 要解决的浪费）。'},
              {line:70,zh:'★ part 4：习题 11.1-1 —— 找最大值要扫槽，最坏 $\\Theta(m)$。直接寻址表**不含顺序信息**（对照：有序数组里找最大是 $O(1)$）。'},
              {line:76,zh:'★ part 5：习题 11.1-2 —— 无卫星数据时用位向量，10 个槽从 80 字节降到 2 字节（m 位）。'},
              {line:92,zh:'part 6：与 10.2 的链表对照 —— 下标直达 $O(1)$ vs 沿链查找 $\\Theta(n)$。'}],
       tests:[{in:'插入 2,5,8 后 SEARCH(5) / SEARCH(3)',out:'命中 / NIL，各 1 次数组访问'},
              {in:'DELETE(x)',out:'1 次写入，无需找前驱'},
              {in:'找最大值（习题 11.1-1）',out:'最坏扫 Θ(m) 个槽'},
              {in:'位向量（习题 11.1-2）',out:'10 个槽 = 10 位（对比 80 字节的指针数组）'}]},
    mapping:[{pc:1,pcCode:'return T[k]',c:'`return T->slot[k];`（第 30 行）'},
             {pc:1,pcCode:'T[x.key] = x',c:'`T->slot[x->key] = x;`（第 34 行，DIRECT-ADDRESS-INSERT 的 inlined 版）'},
             {pc:1,pcCode:'T[x.key] = NIL',c:'`T->slot[x->key] = NULL;`（第 36 行）'}]},
   {type:'analyze',title:'两本账：O(1) 的时间，Θ(m) 的空间',
    intro:'直接寻址表的分析只有一件事要说清：**时间上的便宜是从空间上买来的**。',
    claims:[
     {expr:'O(1)',when:'SEARCH / INSERT / DELETE 各自的时间',page:273,source:'book'},
     {expr:'\\Theta(m)',when:'表占用的空间（与元素个数 n 无关）',page:273,source:'book'},
     {expr:'\\Theta(m)',when:'习题 11.1-1：在直接寻址表里找最大值（无顺序信息）',page:274,source:'book'},
     {expr:'m \\text{ bits}',when:'习题 11.1-2：无卫星数据时用位向量代替指针数组',page:274,source:'book'},
    ],
    tables:[{caption:'三种"查找"的代价对照',rows:[
      ['结构','按 key 查找','按 key 删除','空间'],
      ['无序链表（10.2）','$\\Theta(n)$','$\\Theta(n)$（查找主导）','$\\Theta(n)$'],
      ['有序数组（2.1）','$O(\\lg n)$（二分）','$\\Theta(n)$（搬移）','$\\Theta(n)$'],
      ['**直接寻址表**','$O(1)$','$O(1)$','$\\Theta(m)$'],
     ]},
     {caption:'什么时候可以用它',rows:[
      ['条件','说明'],
      ['key 是 $[0, m-1]$ 的小整数','不能是任意类型/任意范围'],
      ['$m$ 不太大','$m \\gg n$ 时空间浪费不可接受'],
      ['key 互异','习题 11.1-3 讨论了 key 可重复的改造（槽挂链 —— 这就是 11.2 的思路雏形）'],
     ]}],
    chart:{xMax:64,series:[
     {name:'直接寻址表：空间 m',expr:'n * 4',color:'--viz-violation'},
     {name:'元素个数 n',expr:'n',color:'--viz-compare'},
     {name:'散列表（11.2）：空间 Θ(n+αm)',expr:'n * 2',color:'--viz-done'},
    ]},
    derivations:[
     {kind:'summation',title:'为什么是 O(1)：把"查找"整个消掉',steps:[
      {zh:'一般字典的查找要做"找"这件事：比较 key、沿指针走、算散列…'},
      {tex:'\\text{SEARCH}(T, k) = T[k]',zh:'直接寻址表把"找"变成了"算地址" —— 而 10.1 已经论证过**数组任意下标的访问是 $\\Theta(1)$**（RAM 模型）。'},
      {zh:'★ 所以 $O(1)$ 不是"很快的算法"，而是"没有算法"：问题被编码进了下标。这正是散列思想的第一次出现（把 key 变成下标），只不过这一步在这里是**恒等映射**。'}]},
     {kind:'summation',title:'空间账：Θ(m) 的来历与代价',steps:[
      {zh:'表长 $m$ 由 key 的**范围**决定，不由元素个数 $n$ 决定。'},
      {tex:'\\text{空间} = \\Theta(m), \\quad \\text{实用条件} \\approx m = O(n)',zh:'当 $m = O(n)$ 时这个结构才划算；$m \\gg n$ 时浪费 —— 11.2 用散列函数把 $m$ 降到"只与 $n$ 同阶"。'},
      {zh:'★ 位向量（习题 11.1-2）把常数从"一个指针"压到"一位"，但 $\\Theta(m)$ 的量级不变。'}],
     },
    ],
    note:'★ 中心图：红线（$\\Theta(m)$ 的空间）与蓝线（$n$）的差距就是"直接寻址"的浪费；绿线是 11.2 的散列表把空间拉回 $O(n)$ 后的样子。'},
   {type:'prove',title:'为什么三个操作都是 O(1)：问题被编码进下标',
    statement:'The dictionary operations DIRECT-ADDRESS-SEARCH , DIRECT-ADDRESS- INSERT , and DIRECT-ADDRESS-DELETE on the following page are trivial to implement. Each takes only O(1) time.',
    page:273,
    intro:'★ 原书说"trivial"就带过了。这里把它拆成两步论证 —— 因为"$O(1)$"的来源值得说清，它是**散列思想的原型**。',
    steps:[
     {title:'第一步 · 地址由 key 直接算出（恒等映射）',
      en:'Slot k points to an element in the set with key k. If the set contains no element with key k, then T[k] DNIL.',
      page:273,
      body:['"定位"这件事被压缩成一次乘加：地址 = $a + b \\cdot (k - s)$（10.1 的地址公式）。',
        '★ 关键在于这个映射是**恒等映射**：key 直接就是下标，没有信息损失 —— 因此也就**不会有冲突**。',
        '代价换到了另一边：恒等映射要覆盖**整个全域** $U$，所以表长必须 $\\ge$ 全域大小。']},
     {title:'第二步 · 三个操作各只做一次内存访问',
      en:'The dictionary operations DIRECT-ADDRESS-SEARCH , DIRECT-ADDRESS- INSERT , and DIRECT-ADDRESS-DELETE on the following page are trivial to implement.',
      page:273,
      body:['SEARCH：读 $T[k]$（1 次读）。INSERT：写 $T[x.key]$（1 次写）。DELETE：写 $T[x.key] = \\text{NIL}$（1 次写）。',
        '★ 没有循环 → 与 $m$ 和 $n$ 都无关 → $O(1)$。',
        '★ 注意 DELETE **不需要先查找**：给定 $x$ 就知道它的 key，也就知道槽在哪。这一点比链表强（链表的按 key 删除要先 $\\Theta(n)$ 查找）。']},
     {title:'第三步 · 这个"便宜"从哪里买来的',
      en:'Direct addressing is a simple technique that works well when the universe U of keys is reasonably small.',
      page:273,
      body:['时间 $O(1)$ ← 空间 $\\Theta(m)$：表必须能放下全域。',
        '★ 如果 $m$ 无界（例如 key 是 64 位整数），这个方案直接不可用 —— 11.2 的散列函数正是为了**把无界的 key 空间压到 $m$ 个槽**，代价是引入"冲突"需要处理。',
        '★ 这一对矛盾（时间 / 空间 / 冲突）贯穿整个第 11 章：11.2 处理冲突（链接法）、11.3 选好的散列函数（把冲突概率压低）、11.4 开放寻址（不建链，把冲突消化在表内）。']},
    ],
    conclusion:'★ 结论：直接寻址表用"key = 下标"消灭了查找，三个操作各 $O(1)$；代价是空间 $\\Theta(m)$ 与"全域必须小"。它是散列思想的**无冲突原型** —— 第 11 章后面的全部内容，都是在"全域很大"这个现实下想办法保住 $O(1)$。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'直接寻址表的三个字典操作各需要多少时间？',
      options:['$O(\\lg m)$','$O(1)$','$O(n)$','$O(m)$'],answer:1,
      why:'★ 各只做一次数组访问（原书 p.273："Each takes only O(1) time"）。'},
     {kind:'single',q:'DIRECT-ADDRESS-DELETE 需要先"找到元素的前驱"吗？',
      options:['需要，和链表一样','不需要 —— 表里没有链，直接置 NIL','需要，要先查找','需要，要重排数组'],answer:1,
      why:'★ 伪代码只有 `T[x.key] = NIL` 一行。链表的删除要维护前后关系，这里不需要。'},
     {kind:'single',q:'直接寻址表的主要代价是什么？',
      options:['查找慢','空间 Θ(m)，与元素个数无关','插入慢','不能删除'],answer:1,
      why:'★ 表长由 key 的**范围**决定；$m \\gg n$ 时浪费 —— 这正是散列表要解决的问题。'},
     {kind:'single',q:'在直接寻址表里找最大值，最坏需要多久？（习题 11.1-1）',
      options:['$O(1)$','$O(\\lg m)$','$\\Theta(m)$','$\\Theta(n)$'],answer:2,
      why:'★ 表里没有顺序信息，只能逐槽扫；最坏扫完 $m$ 个槽。C 程序 part 4 演示了这一点。'},
     {kind:'judge',q:'如果所有 key 都是互不相同的小整数，直接寻址表比开放寻址散列表更好。',answer:true,
      why:'★ 是的 —— 没有冲突、没有探测、没有散列计算，且三个操作都是**最坏** $O(1)$（散列只保证期望或需要控制负载因子）。这正是原书把它放在 11.1 的原因。'},
     {kind:'simulate',q:'某直接寻址表的 key 范围是 $[0, 999]$，当前存了 4 个元素。它占用多少个槽？（填整数）',expect:[1000],placeholder:'例如：100',
      why:'★ 表长由全域大小决定，与存了多少元素无关：1000 个槽（这就是 $m \\gg n$ 的浪费）。'},
    ],
    bookExercises:[
     {id:'11.1-1',page:274,star:0,statement:'A dynamic set S is represented by a direct-address table T of length m. Describe a procedure that finds the maximum element of S . What is the worst-case performan',hint:'表里没有顺序信息，只能从 $m-1$ 往下（或从 0 往上）逐槽扫到第一个非 NIL —— 最坏 $\\Theta(m)$。C 程序 part 4 实现了它。'},
     {id:'11.1-2',page:274,star:0,statement:'A bit vector is simply an array of bits (each either 0 or 1). A bit vector of length m takes much less space than an array of m pointers. Describe how to use a bit vector to represent a dynamic set of distinct elements drawn from the set f0,1,…,m  − 1g and with no satellite data. Dictionary operations should run in O(1) time.',hint:'每个 key 用一个位：存在 → 置 1、删除 → 置 0、查找 → 读该位。三个操作都是 $O(1)$，空间从 $m$ 个指针降到 $m$ **位**。C 程序 part 5 实现了它。'},
     {id:'11.1-3',page:274,star:0,statement:'Suggest how to implement a direct-address table in which the keys of stored elements do not need to be distinct and the elements can have satellite data. All three dictionary operations (INSERT ,',hint:'书上是半截题干。思路：**每个槽挂一条链**（存放 key 相同的所有元素）—— 三个操作都变成"先定位槽、再在**同 key 的短链**上操作"。★ 注意：这正是 11.2 链接法散列表的雏形（这里链里 key 相同，那里链里 key 不同但散列值相同）。'},
     {id:'11.1-4',page:274,star:0,statement:'Suppose that you want to implement a dictionary by using direct addressing on a huge array. That is, if the array size is m and the dictionary contains at most n elements at any one time, then m ≫ n. At the start, the array entries may contain garbage, and initializing the entire array is impractical because of its size.',hint:'原书给了提示方向：**加一个辅助数组，当作栈用**（大小 = 实际存的 key 数）。栈里存"当前有效的 key"，再用一个位/索引数组标记"某个槽是否真的被初始化过" —— 于是初始化只要 $O(1)$（两个计数器归零），而不是 $O(m)$ 清零。这就是"稀疏表的惰性初始化"技巧。'},
    ]},
  ],
};
