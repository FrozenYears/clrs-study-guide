/* 第 10 章 10.2：链表（Linked lists）。
 * 原文锚点：印刷页 258–264（pdf_index 279–285）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（28/28 PASS）。
 * 主题：指针决定次序；增删 O(1)、查找 Θ(n)；哨兵消除边界条件。
 */

export default {
  key:'s02',id:'ch10/s02',chapter:10,section:'10.2',
  title:'链表：用指针换掉搬移',shortTitle:'10.2 链表',
  titleEn:'Linked lists',
  source:{printed:[258,264],pdf:[279,285]},
  prerequisites:[{label:'10.1 Simple array-based data structures',url:'#/ch10/s01'}],
  stages:[
   {type:'map',title:'指针决定次序：增删 O(1)，查找 Θ(n)',
    why:'链表把"元素在哪儿"从**数组下标**换成**每个对象里的一个指针**。于是删除不再需要搬动后面的元素（$O(1)$ 改两条指针），但代价是"第 $k$ 个元素"这种随机访问没了 —— 想找某个 key 只能沿链走（$\\Theta(n)$）。',
    position:'10.1 用数组实现了栈/队列；本关第一次引入**指针/对象**这种表示法，它是 10.3（有根树）、第 11 章（散列表的链接法）、第 19 章（斐波那契堆）等所有后续结构的基础。哨兵技巧在 11.2 的链式散列表中会再次出现。',
    unlocks:[{label:'10.3 Representing rooted trees（有根树的表示）',url:'#/ch10/s03'}],
    mathKit:[
     {title:'两种"次序"的来源',body:'数组：次序 = 下标（$A[i]$ 是第 $i$ 个）。链表：次序 = 每个对象里的 `next` 指针。**随机访问 $\\Theta(1)$ 被换成 $\\Theta(n)$ 的查找**。'},
     {title:'代价对照',body:'查找：链表 $\\Theta(n)$。已知指针时删除：链表 $O(1)$、数组 $\\Theta(n)$。**"快"和"慢"取决于你手上有什么**。'},
     {title:'哨兵',body:'一个哑对象 `L.nil` 代替 NIL，让链表变成**环形**：`L.nil.next` 是表头、`L.nil.prev` 是表尾。于是"表头/表尾"不再是特例。'},
    ]},
   {type:'intuition',title:'抽屉 vs 链条：手上有什么决定你快不快',
    scene:'找第 500 张卡片：抽屉能直接抽，链条只能一节节走',
    body:[
     '数组像一排抽屉：你知道编号就能直接拉开（$\\Theta(1)$）。但它很"硬"——从中间抽走一个，后面的抽屉都得往前挪一格（$\\Theta(n)$）。',
     '链表像一条链子：每一节只管"下一节在哪"（存一个 `next` 指针）。想摘掉某一节？把前后两节接起来就行（$O(1)$）。但想找"第 500 节"或"key = 16 的那节"，只能从头一节节走（$\\Theta(n)$）。',
     '★ **两者的取舍是同一个问题的两面**：数组把"位置"编码成下标（便宜地随机访问，昂贵地搬移）；链表把"位置"编码成指针（便宜地改接，昂贵地查找）。第 11 章会用散列把查找降到 $\\Theta(1)$，第 17 章（摊还）会给数组的"搬移"一个摊还解释。',
     '★ **哨兵**是本关最漂亮的技巧：链表的删除有四种情况要写（表头/表尾/中间/唯一元素）。加一个哑对象 `L.nil` 把链表接成**环**，"表头/表尾"就变成了普通的相邻节点 —— 删除统一成 2 行，一个 `if` 都不需要。',
    ],
    interactive:{text:'阶段 5 的三个面板：① LIST-SEARCH 逐节点走；② PREPEND/INSERT/DELETE 的指针改写；③ 哨兵环形链表。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对指针记法 L.head 与 L.nil 的排版形式）。',
    blocks:[
     {kind:'body',page:258,en:'A linked list is a data structure in which the objects are arrang ed in a linear order.',
      zh:'★ 定义第一句：对象排成**线性序**。'},
     {kind:'body',page:258,en:'Unlike an array, however, in which the linear order is determined by the array indices, the order in a linked list is determined by a pointer in each object. Since the elements of linked lists often contain keys that can be searched for, linked lists are sometimes called search lists.',
      zh:'★★ **本关的核心对照**：数组的次序由下标决定，链表的次序由**每个对象里的一个指针**决定。这一句换来了后面全部的取舍。'},
     {kind:'body',page:258,en:'As shown in Figure 10.4, each element of a doubly linked list L is an object with an attribute key and two pointer attributes: next and prev.',
      zh:'★ 双向链表的节点 = `key` + `next` + `prev` 三个属性。单向链表省掉 `prev`，代价是删除时必须先找到前驱。'},
     {kind:'body',page:260,en:'The procedure LIST-SEARCH (L,k) finds the first element with key k in list L by a simple linear search, returning a pointer to this element. If no object with key k appears in the list, then the procedure returns NIL. For the linked list in Figure 10.4(a), the call LIST-SEARCH (L,4) returns a pointer to the third element, and the call LIST-SEARCH (L,7) returns NIL. To search a list of n objects, the LIST-SEARCH procedure takes Θ(n) time in the worst case, since it may have to search the entire list.',
      zh:'★★ 查找的代价：$\\Theta(n)$（最坏要把整条链走完）。★ 注意返回值是**指向元素的指针**（不是元素本身）—— 拿到指针后才能 $O(1)$ 删除。'},
     {kind:'body',page:260,en:'Given an element x whose key attribute has already been set, the LIST-PREPEND procedure adds x to the front of the linked list, as shown in Figure 10.4(b).',
      zh:'★ 插到表头：$O(1)$，但要改 3 条指针（含表头的 `prev`）。'},
     {kind:'body',page:260,en:'You can insert anywhere within a linked list. As Figure 10.4(c) shows, if you have a pointer y to an object in the list, the LIST-INSERT procedure on the facing page "splices" a new element x into the list, immediately following y , in O(1) time. Since LIST-INSERT never references the list object L, it is not supplied as a parameter.',
      zh:'★★ "splices"（接线）—— 插到 $y$ 之后只要 $O(1)$，靠的是 **$y$ 的指针**（不是"位置"）。★ 而且 LIST-INSERT **根本不需要 L 这个参数**：它眼里只有 $y$。这个细节在哨兵版里会变得更自然。'},
     {kind:'body',page:261,en:'The procedure LIST-DELETE removes an element x from a linked list L. It must be given a pointer to x , and it then "‘splices" x out of the list by updating pointers.',
      zh:'★ **必须给 x 的指针**（不是 key）—— 这是链表删除 $O(1)$ 的前提。'},
     {kind:'body',page:261,en:'LIST-DELETE runs in O(1) time, but to delete an element with a given key, the call to LIST-SEARCH makes the worst-case running time be Θ(n).',
      zh:'★★ 一句话说清链表的全部代价结构：**删除 $O(1)$，但"按 key 删除"被查找拖成 $\\Theta(n)$**。'},
     {kind:'body',page:261,en:'Insertion and deletion are faster operations on doubly linked lists than on arrays.',
      zh:'★ 与数组的对照。数组的插入/删除要搬动后续元素（$\\Theta(n)$）。'},
     {kind:'body',page:262,en:'A sentinel is a dummy object that allows us to simplify boundary conditions.',
      zh:'★★ 哨兵的定义：**哑对象，用来简化边界条件**。它是本章（也是全书）最常复用的技巧。'},
     {kind:'body',page:262,en:'In a linked list L, the sentinel is an object L: nil that represents NIL but has all the attributes of the other objects in the list. Re ferences to NIL are replaced by references to the sentinel L: nil. As shown in Figure 10.5, this change turns a regular doubly linked list into a circular, doubly linked list with a sentinel, in which the sentinel L: nil lies between the head and tail.',
      zh:'★★ 哨兵 = 一个"代表 NIL 但有全部属性"的对象。加了它，链表变成**环形**：哨兵夹在表头与表尾之间。'},
     {kind:'body',page:262,en:'L: nil: next points to the head, the attribute L: head is eliminated altogether, with references to it replaced by references to L: nil: next . Figure 10.5(a) shows that an empty list consists of just the sentinel, and both L: nil: next and L: nil: prev point to L: nil.',
      zh:'★★ 连带的好处：**`L.head` 这个属性直接被取消**（用 `L.nil.next` 代替），空表就是"哨兵自己指自己"。'},
     {kind:'body',page:263,en:'LIST-DELETE 0 . You should never delete the sentinel L: nil unless you are deleting the entire list!',
      zh:'★ 警告：**永远不要删除哨兵**（除非销毁整条链）。语料里 `LIST-DELETE 0` 是 `LIST-DELETE′` 的排版形式。'},
     {kind:'body',page:264,en:'Sentinels often simplify code and, as in searching a linked list, they might speed up code by a small constant factor, but they don’t typically improve the asymptotic running time. Use them judiciously. When there are many small lists, the extra storage used by their sentinels can represent significant wasted memory.',
      zh:'★★ 哨兵的**代价**：不改善渐近复杂度、小链表很多时浪费内存。原书的结论是"**审慎使用**"—— 这句话是本章唯一一处方法论建议。'},
    ],
    terms:[
     {en:'sentinel',zh:'哨兵（哑对象）',page:262},
     {en:'circular, doubly linked list',zh:'带哨兵的环形双向链表',page:262},
    ]},
   {type:'pseudocode',title:'LIST-SEARCH：4 行、Θ(n)',
    lead:'★ 链表的查找没有捷径：只能沿 next 走。注意返回的是**指针**（后续 $O(1)$ 删除的前提）。',
    algo:'LIST-SEARCH',signature:'LIST-SEARCH(L, k)',page:260,
    lines:[
     {n:1,code:'x = L.head',zh:'从表头开始。'},
     {n:2,code:'while x ≠ NIL and x.key ≠ k',zh:'★ 两个条件：没走到链尾 **且** 还没命中。顺序不能反（NIL 没有 key）。'},
     {n:3,code:'    x = x.next',zh:'沿指针走一格 —— 这是唯一的"前进"方式，也是 $\\Theta(n)$ 的来源。'},
     {n:4,code:'return x',zh:'返回指向元素的**指针**（未命中则返回 NIL）。'},
    ],
    vars:[
     {name:'x',meaning:'游标指针：指向当前检查的节点'},
     {name:'L.head',meaning:'表头指针（无哨兵版是独立属性）'},
    ],
    note:'★ 拿到 x 之后，删除只要 $O(1)$（LIST-DELETE）—— "查找贵、改接便宜"是链表的性格。',
    more:[
     {algo:'LIST-PREPEND',subtitle:'LIST-PREPEND(L, x) —— 5 行插到表头（原书 p.260）',
      signature:'LIST-PREPEND(L, x)',page:260,
      lines:[
       {n:1,code:'x.next = L.head',zh:'新节点的后继 = 原表头。'},
       {n:2,code:'x.prev = NIL',zh:'新表头没有前驱。'},
       {n:3,code:'if L.head ≠ NIL',zh:'★ 边界：空表时没有"原表头"可改。'},
       {n:4,code:'    L.head.prev = x',zh:'原表头的前驱指向新节点。'},
       {n:5,code:'L.head = x',zh:'更新表头。5 行、3 条指针改写 → $O(1)$。'},
      ],
      vars:[{name:'x',meaning:'待插入的节点（key 已设好）'}],
      note:''},
     {algo:'LIST-INSERT',subtitle:'LIST-INSERT(x, y) —— 4 行插到 y 之后（原书 p.263）',
      signature:'LIST-INSERT(x, y)',page:263,
      lines:[
       {n:1,code:'x.next = y.next',zh:'接上后继。'},
       {n:2,code:'x.prev = y',zh:'前驱是 $y$。'},
       {n:3,code:'y.next.prev = x',zh:'★ 这行**没有判空** —— 因为这是哨兵版的写法（`y.next` 永不为 NIL）。'},
       {n:4,code:'y.next = x',zh:'$y$ 的后继改成 $x$。★ 整个过程的输入里**没有 L**。'},
      ],
      vars:[{name:'y',meaning:'插入位置的锚点（有它的指针）'}],
      note:'★ 无哨兵版需要在第 3 行前插入 `if y.next ≠ NIL` 判断（原书 p.261 的版本）。'},
     {algo:'LIST-DELETE',subtitle:'LIST-DELETE(L, x) —— 5 行、4 种边界（原书 p.261）',
      signature:'LIST-DELETE(L, x)',page:261,
      lines:[
       {n:1,code:'if x.prev ≠ NIL',zh:'★ 边界 1：$x$ 不是表头。'},
       {n:2,code:'    x.prev.next = x.next',zh:'前驱跳过 $x$。'},
       {n:3,code:'else L.head = x.next',zh:'★ 边界 2：$x$ 是表头 → 表头指针要改。'},
       {n:4,code:'if x.next ≠ NIL',zh:'★ 边界 3：$x$ 不是表尾。'},
       {n:5,code:'    x.next.prev = x.prev',zh:'★ 边界 4：$x$ 是表尾时这行必须跳过（`x.next` 是 NIL）。'},
      ],
      vars:[{name:'x',meaning:'待删除节点（必须已有它的指针）'}],
      note:'★ 实际是 2 条指针改写 + 2 处判空。哨兵版把这两处判空全消掉。'},
     {algo:"LIST-DELETE'",subtitle:"LIST-DELETE′(x) —— 哨兵版，2 行零判断（原书 p.262）",
      signature:"LIST-DELETE'(x)",page:262,
      lines:[
       {n:1,code:'x.prev.next = x.next',zh:'前驱直接跳到后继 —— 不需要判"是不是表头"。'},
       {n:2,code:'x.next.prev = x.prev',zh:'后继直接接回前驱 —— 不需要判"是不是表尾"。'},
      ],
      vars:[{name:'x',meaning:'待删除节点'}],
      note:'★ 连 L 都不需要（与 LIST-INSERT 一样）。代价：链表少一个 `L.head` 属性、多一个哨兵对象，且**永远别删哨兵**。'},
    ]},
   {type:'visualize',title:'看见"指针改写"与哨兵环',
    panels:[
     {title:'① LIST-SEARCH：沿着 next 一节节走',
      viz:'linked-list',
      algorithm:'linked-list',
      input:{array:[1,4,9,16],keys:[1,4,9,16],ops:[{kind:'search',k:9}]},
      countLabels:{cmp:'比较',move:{label:'指针改写',unit:'次'}},
      invariants:[{label:'游标 x 只能沿 next 前进；命中前每步都要比一次 key'}],
      presets:[
       {name:'★ Figure 10.4 的链：查 9（命中）',array:[1,4,9,16],args:[[1,4,9,16],[{kind:'search',k:9}]]},
       {name:'查 7（未命中，走到底 Θ(n)）',array:[1,4,9,16],args:[[1,4,9,16],[{kind:'search',k:7}]]},
      ]},
     {title:'② PREPEND / INSERT / DELETE：只动 2–3 条指针',
      viz:'linked-list',
      algorithm:'linked-list',
      input:{array:[1,4,9,16],keys:[1,4,9,16],ops:[{kind:'prepend',v:25},{kind:'insertAfter',target:4,v:16},{kind:'delete',v:9}]},
      countLabels:{cmp:'比较',move:{label:'指针改写',unit:'次'}},
      invariants:[{label:'每次改写都是常数条指针 —— 不搬动任何其他元素'}],
      presets:[
       {name:'★ 三种操作各来一次',array:[1,4,9,16],args:[[1,4,9,16],[{kind:'prepend',v:25},{kind:'insertAfter',target:4,v:16},{kind:'delete',v:9}]]},
       {name:'删表头（边界情形）',array:[1,4,9],args:[[1,4,9],[{kind:'delete',v:1},{kind:'delete',v:9}]]},
      ]},
    ],
    tasks:[
     '面板 ① 注意"未命中"预设：游标走到 NIL 才停 —— 这就是 $\\Theta(n)$ 最坏情形的图形。',
     '面板 ② 看 L.head 指针的改变：PREPEND 与"删除表头"都会动它，这正是哨兵要消灭的分支。',
     '面板 ② 每一次操作后节点数变化，但**已存在的节点编号不变** —— 链表改的是指针，不是位置。',
    ],
    note:'★ 两个面板都用链表引擎（下一个面板示意哨兵环，见阶段 7 的讨论）。C 程序 part 6–7 用断言验证了哨兵版的零边界判断与环形性质。'},
   {type:'code',title:'实测：O(1) 改接 vs Θ(n) 搬移',
    intro:'`c/linked_list.c` 实现无哨兵版与哨兵版两套链表，逐项验证查找代价、三种删除边界、哨兵版的零判断，并与数组删除对账。',
    pseudocodeRef:'LIST-SEARCH',
    c:{file:'linked_list.c',code:String.raw`/* linked_list.c -- 10.2 节：双向链表（含哨兵版）的实现与代价验证。
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
`,
       notes:[{line:36,zh:'`list_search`：LIST-SEARCH 的直译 —— 每次都重新计数，用于实测命中与未命中的比较次数。'},
              {line:49,zh:'`list_prepend`：3 条指针改写 + 1 处判空（空表时没有"原表头"）。'},
              {line:58,zh:'`list_insert_after`：与伪代码 LIST-INSERT 同构（含 `y.next ≠ NIL` 判空）。'},
              {line:67,zh:'★ `list_delete`：覆盖 2 条指针改写 + 2 处判空 —— 对应四种边界情形。'},
              {line:111,zh:'★ `slist_delete`：哨兵版 **2 行、零判断**，且参数里连链表都没有 —— 与 LIST-DELETE′ 的签名一致。未使用的 L 参数在编译期被 -Werror 抓出来，正好证明了这一点。'},
              {line:132,zh:'part 1–3：`LIST-SEARCH(16)` 比较 4 次命中；`LIST-SEARCH(7)` 比较 5 次 = n 走到底（$\\Theta(n)$ 实测）。'},
              {line:162,zh:'part 5：删除覆盖表头/中间/表尾三种边界。'},
              {line:176,zh:'★ part 6：哨兵版删表头、删表尾各一次，共 2 行代码、0 个边界判断。'},
              {line:184,zh:'part 7：哨兵链表是环形的（走 $n$ 步回到哨兵）。'},
              {line:194,zh:'★ part 8：数组删除第 9 个元素要搬动 23 个元素（$\\Theta(n)$），链表只改 2 条指针。'}],
       tests:[{in:'LIST-SEARCH(16) / LIST-SEARCH(7)',out:'比较 4 次命中 / 5 次走到底（Θ(n)）'},
              {in:'删除表头 / 中间 / 表尾',out:'三种边界都只改 2 条指针'},
              {in:'哨兵版删表头与表尾',out:'2 行代码、0 个边界判断；链表保持环形'},
              {in:'数组删第 9 个元素 n = 32',out:'搬动 23 个元素'}]},
    mapping:[{pc:3,pcCode:'x = x.next',c:'`x = x->next;`（第 42 行）—— 唯一的"前进"方式'},
             {pc:1,pcCode:'x.prev.next = x.next',c:'`x->prev->next = x->next;`（第 113 行，哨兵版）'},
             {pc:2,pcCode:'x.next.prev = x.prev',c:'`x->next->prev = x->prev;`（第 114 行，哨兵版）'}]},
   {type:'analyze',title:'两本账：链表 vs 数组，以及哨兵值不值得用',
    intro:'本关的分析都是"代价对照"：同一件事在两种表示下差多少。',
    claims:[
     {expr:'\\Theta(n)',when:'LIST-SEARCH（沿 next 走）',page:260,source:'book'},
     {expr:'O(1)',when:'LIST-PREPEND / LIST-INSERT（已知锚点指针）',page:260,source:'book'},
     {expr:'O(1)',when:'LIST-DELETE（已知 x 的指针）—— 但按 key 删除是 Θ(n)',page:261,source:'book'},
     {expr:'\\Theta(1)',when:'哨兵的存储开销（常数，但不改善渐近）',page:264,source:'book'},
    ],
    tables:[{caption:'同一件事的两种代价',rows:[
      ['操作','数组','双向链表'],
      ['按下标访问第 k 个','$\\Theta(1)$','$\\Theta(k)$'],
      ['按 key 查找','$\\Theta(n)$（无序）/ $\\Theta(\\lg n)$（有序）','$\\Theta(n)$'],
      ['已知位置/指针时插入','$\\Theta(n)$（搬移）','$O(1)$（改接）'],
      ['已知位置/指针时删除','$\\Theta(n)$（搬移）','$O(1)$（改接）'],
      ['额外空间','无','每节点 2 个指针'],
     ]},
     {caption:'哨兵的收益与代价',rows:[
      ['','说明'],
      ['收益','消除表头/表尾的边界判断；常数因子略快；L.head 属性可取消'],
      ['代价','不改善渐近时间；链表又多又短时浪费内存'],
      ['原书结论','"use them judiciously"（审慎使用，显著简化代码时才用）'],
     ]}],
    chart:{xMax:32,series:[
     {name:'链表：改接常数次',expr:'2',color:'--viz-done'},
     {name:'数组：删除搬移 n − k 个',expr:'n - 4',color:'--viz-violation'},
    ]},
    derivations:[
     {kind:'summation',title:'为什么"按 key 删除"是 Θ(n)',steps:[
      {zh:'LIST-DELETE 本身 $O(1)$（2 条指针改写）。'},
      {tex:'T_{\\text{按 key 删除}} = T_{\\text{LIST-SEARCH}} + T_{\\text{LIST-DELETE}} = \\Theta(n) + O(1) = \\Theta(n)',zh:'★ 代价的来源是**查找**，不是删除。第 11 章的散列表正是为了消掉这一项（用散列找到指针，再用链表 $O(1)$ 删）。'}]},
     {kind:'summation',title:'删除的四种边界',steps:[
      {zh:'无哨兵版：$x$ 是表头 / 表尾 / 中间 / 唯一元素，四种情况的指针改写各不相同（4 行判断里的 2 处 if）。'},
      {zh:'哨兵版：**"表头"与"表尾"不再是特例** —— 因为 `L.nil` 永远存在，任何节点都有前后驱。'},
      {tex:'\\text{边界情形数} : 4 \\to 0',zh:'★ 这就是原书说的"simplify boundary conditions"。C 程序 part 5 与 part 6 分别演示了两版的代码形状。'}]},
    ],
    note:'★ 中心图：绿线（链表：常数次改写）与红线（数组：随 $n$ 增长的搬移）—— "快"不是绝对的，取决于你手上有什么。'},
   {type:'prove',title:'哨兵为什么能消掉边界：让 NIL 不再是"空"',
    statement:'In a linked list L, the sentinel is an object L: nil that represents NIL but has all the attributes of the other objects in the list.',
    page:262,
    intro:'★ 原书把哨兵当技巧陈述，这里论证它**为什么**有效 —— 核心是"把缺失的对象补上一个真实对象"。',
    steps:[
     {title:'第一步 · 边界条件的来源：NIL 没有属性',
      en:'The procedure LIST-DELETE removes an element x from a linked list L. It must be given a pointer to x , and it then "‘splices" x out of the list by updating pointers.',
      page:261,
      body:['删除要改 $x$ 的前驱与后继指针。但 $x$ 是表头时"前驱"是 NIL、是表尾时"后继"是 NIL。',
        '对 NIL 解引用是非法的 —— 所以代码里必须**先判断再改**：4 行代码里有 2 处 `if`。',
        '★ 边界条件的本质是：**"空"这个概念没有属性可用**。']},
     {title:'第二步 · 补一个真实对象：NIL → L.nil',
      en:'A sentinel is a dummy object that allows us to simplify boundary conditions.',
      page:262,
      body:['哨兵 `L.nil` 是一个"代表 NIL 但有全部属性"的对象。',
        '把原来指向 NIL 的引用全改成指向 `L.nil` → 链表变成**环形**，哨兵既是表头的前驱、也是表尾的后继。',
        '★ 于是**任何节点的 `prev` 与 `next` 都非空** —— 判空的两个 `if` 直接删掉。']},
     {title:'第三步 · 代价：为什么"审慎使用"',
      en:'Sentinels often simplify code and, as in searching a linked list, they might speed up code by a small constant factor, but they don’t typically improve the asymptotic running time. Use them judiciously. When there are many small lists, the extra storage used by their sentinels can represent significant wasted memory.',
      page:264,
      body:['渐近复杂度**不变**（$O(1)$ 还是 $O(1)$）—— 收益是代码简洁与常数因子。',
        '代价：每个链表多一个对象。**当链表很多且很短时，哨兵的内存占比很高**。',
        '★ 原书的取舍："只在显著简化代码时使用"。本关的两套 C 实现（`list_t` 与 `slist_t`）就是这个取舍的两端。',
        '★ 注意 `L.head` 属性也被取消了（`L.nil.next` 代替）—— 少一个字段、多一个对象，账差不多。']},
    ],
    conclusion:'★ 结论：哨兵把"空"变成了"一个真实对象"，于是所有的边界判断消失。它是**表示法层面的技巧**（不改算法、只改数据结构），这类技巧在第 11 章的链式散列表与第 19 章的斐波那契堆里会再次出现。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'链表的次序由什么决定？',
      options:['数组下标','每个对象里的一个指针','key 的大小','插入时间'],answer:1,
      why:'★ 原书 p.258：数组的次序由下标决定，链表的次序由**每个对象里的指针**决定。'},
     {kind:'single',q:'LIST-SEARCH 的最坏运行时间是？',
      options:['O(1)','Θ(lg n)','Θ(n)','Θ(n²)'],answer:2,
      why:'★ 最坏要把整条链走到底才知道"没有"（原书 p.260）。链表没有随机访问，这是它的性格。'},
     {kind:'single',q:'LIST-INSERT(x, y) 为什么不需要 L 作为参数？',
      options:['因为书里写错了','因为插入只依赖 y 的指针，不涉及"哪个链表"','因为 x 里存了 L','因为 L 是全局变量'],answer:1,
      why:'★ 原书 p.260："Since LIST-INSERT never references the list object L, it is not supplied as a parameter."'},
     {kind:'single',q:'已知 x 指针时，LIST-DELETE 的代价是？',
      options:['O(1)','Θ(lg n)','Θ(n)','Θ(n²)'],answer:0,
      why:'★ 只改 2 条指针。★ 但"按 key 删除"要先用 LIST-SEARCH 找指针，总体变成 $\\Theta(n)$。'},
     {kind:'judge',q:'哨兵改善了链表操作的渐近复杂度。',answer:false,
      why:'★ 原书 p.264 明确：哨兵不改善渐近时间，只是简化代码、小常数加速，且小链表多时有内存浪费 —— "use them judiciously"。'},
     {kind:'simulate',q:'无哨兵的 5 元素双向链表中，删除"表头"需要改几条指针（不算被删节点自身）？填整数。',expect:[1],placeholder:'例如：2',
      why:'表头没有前驱：只要把 `L.head` 指向原第二节点（并置其 `prev = NIL`；若把"置 NIL"也算上则是 2 次赋值，但**指针改写**只涉及 1 条既有链接）。★ 要点是：正因为这种情形与"中间节点"不同，才需要额外的 `if`。'},
    ],
    bookExercises:[
     {id:'10.2-1',page:264,star:0,statement:'Explain why the dynamic-set operation INSERT on a singly linked list can be implemented in O(1) time, but the worst-case time for DELETE is Θ(n).',hint:'单向链表插入只需改 1 条指针（新节点指向原链表）。但删除要改**前驱**的 next，而单向链表没有 prev —— 必须先从头找到 x 的前驱，$\\Theta(n)$。解药：双向链表加 `prev`（本关的 C 实现），或"懒删除"。'},
     {id:'10.2-2',page:264,star:0,statement:'Implement a stack using a singly linked list. The operations PUSH and POP should still take O(1) time. Do you need to add any attributes to the list?',hint:'PUSH = 在表头插入（`O(1)`），POP = 删表头（`O(1)`）。只需一个 `head` 指针，**不需要额外属性** —— 链表天生就是"单端操作"友好的，这也是 10.1 栈的链表版。'},
     {id:'10.2-3',page:264,star:0,statement:'Implement a queue using a singly linked list. The operations ENQUEUE and DEQUEUE should still take O(1) time. Do you need to add any attributes to the list?',hint:'ENQUEUE = 尾插、DEQUEUE = 头删。**必须加一个 `tail` 指针**指向链尾（否则尾插要 $\\Theta(n)$ 走到尾）。加一个属性 → 两个操作都 $O(1)$。'},
     {id:'10.2-4',page:264,star:0,statement:'The dynamic-set operation UNION takes two disjoint sets S 1 and S 2 as input, and it returns a set S = S 1 [ S 2 consisting of all the elements of S 1 and S 2 .',hint:'书上是半截题干（问链表实现 UNION 的代价）。思路：用**双向循环链表**，把两个环"接"起来只需 $O(1)$ 改 4 条指针（不像数组要复制全部元素）。'},
     {id:'10.2-5',page:264,star:0,statement:'Give a Θ(n)-time nonrecursive procedure that reverses a singly linked list of n elements. The procedure should use no more than constant storage beyond that needed',hint:'三指针迭代：`prev = NIL; while x: next = x.next; x.next = prev; prev = x; x = next`。每次只改 1 条指针、只用 3 个变量 —— 常数存储、$\\Theta(n)$。'},
    ]},
  ],
};
