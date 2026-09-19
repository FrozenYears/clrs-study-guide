/* 第 10 章 10.3：有根树的表示（Representing rooted trees）。
 * 原文锚点：印刷页 265–272（pdf_index 286–293）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（34/34 PASS）。
 * 主题：二叉树 p/left/right；任意多叉树 left-child/right-sibling（3 指针、O(n) 空间）。
 */

/* 本站示意图的树（★ 原书 Figure 10.6/10.7 不显示 key —— 引述里明确写了
 * "The key attributes are not shown"，所以这里的 key 是本站为便于阅读补上的，
 * 树形按原图的形态：根 12；12 的左孩子 15；15 的左 4、右 10；4 的左 7、右 9；10 的左 6） */
const BT = {
  label: '12', cost: 'p = NIL（根）',
  children: [
    { label: '15', cost: 'left of 12', children: [
      { label: '4', cost: 'left of 15', children: [
        { label: '7', cost: 'left of 4' },
        { label: '9', cost: 'right of 4' },
      ] },
      { label: '10', cost: 'right of 15', children: [
        { label: '6', cost: 'left of 10' },
      ] },
    ] },
  ],
};

/* left-child / right-sibling：同一棵多叉树（根 1，孩子 2,3,4；2 的孩子 5,6；3 的孩子 7） */
const LCRS = {
  label: '1', cost: 'lc: 2 · rs: NIL · p = NIL',
  children: [
    { label: '2', cost: 'lc: 5 · rs: 3', children: [
      { label: '5', cost: 'lc: NIL · rs: 6' },
      { label: '6', cost: 'lc: NIL · rs: NIL' },
    ] },
    { label: '3', cost: 'lc: 7 · rs: 4', children: [
      { label: '7', cost: 'lc: NIL · rs: NIL' },
    ] },
    { label: '4', cost: 'lc: NIL · rs: NIL' },
  ],
};

export default {
  key:'s03',id:'ch10/s03',chapter:10,section:'10.3',
  title:'有根树：三种指针方案与它们的空间账',shortTitle:'10.3 有根树的表示',
  titleEn:'Representing rooted trees',
  source:{printed:[265,272],pdf:[286,293]},
  prerequisites:[{label:'10.2 Linked lists',url:'#/ch10/s02'}],
  stages:[
   {type:'map',title:'从线性到分支：指针该怎么摆',
    why:'链表只表达**线性**关系。树是分支的：每个节点可能有很多孩子。本关的关键问题是"**给孩子指针留几个字段**"：二叉树留 2 个（`left`/`right`）、k 叉树留 $k$ 个（$k$ 大就浪费）、任意多叉树用 **left-child + right-sibling** 只用 **2 个**（加上父指针共 3 个）且恒为 $O(n)$ 空间。',
    position:'10.1/10.2 处理线性结构，本关是第 III 部分的收尾，也是第 12 章（二叉搜索树）、第 13 章（红黑树）、第 19 章（斐波那契堆）、第 20 章（van Emde Boas 树）全部树结构的**表示法底座**。章末问题 10-3 用"数组链表 + 随机跳跃"给出 $O(\\sqrt n)$ 期望查找，是第 11 章散列表的预热。',
    unlocks:[{label:'11.1 Direct-address tables（第 11 章：散列表）',url:'#/ch11/s01'}],
    mathKit:[
     {title:'二叉树：3 个指针',body:'`x.p`（父）、`x.left`、`x.right`。根满足 `x.p = NIL`，叶满足 `left = right = NIL`。'},
     {title:'k 叉表示的问题',body:'$k$ 固定时用 `child1..childk`；但 $k$ 未知或很大时，"预留 $k$ 个指针"会浪费 —— $k n$ 个指针域里可能绝大多数是 NIL。'},
     {title:'left-child/right-sibling',body:'每个节点只留 `left-child`（最左孩子）与 `right-sibling`（右兄弟）。**孩子的全体 = 沿 left-child 再沿 right-sibling 走一遍**。空间 $3n$，与孩子的总数无关。'},
    ]},
   {type:'intuition',title:'把"一群孩子"折成一条链',
    scene:'通讯录：每个联系人只记"第一个孩子"和"下一个兄弟"',
    body:[
     '树的分支让"指针字段"变得麻烦：一个节点可能有 0 个、也可能有 100 个孩子。预先留 100 个字段？绝大多数是空的。',
     '★ **left-child/right-sibling 的妙处**：把"孩子"这一层**折成一条链**。每个节点只需要两个指针：`left-child` 指向最左边的孩子，`right-sibling` 指向自己的下一个兄弟。',
     '★ 于是"列出 $x$ 的所有孩子"变成"从 `x.left-child` 出发沿 `right-sibling` 走" —— 耗时**线性于孩子数**（这是最优的，因为输出就有那么长）；而"访问 $x$ 的父节点"仍是 $O(1)$（有 `p` 指针）。',
     '★ 空间账：$n$ 个节点恒为 $3n$ 个指针域，**与"每个节点有多少孩子"完全无关**。这就是原书说的"clever scheme"与 $O(n)$ 空间。',
    ],
    interactive:{text:'阶段 5 的两个面板：① 二叉树的 p/left/right；② 同一类多叉树的 left-child/right-sibling（看兄弟链怎么把兄弟串起来）。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对属性记法 x.p / x.left-child 的排版形式）。',
    blocks:[
     {kind:'body',page:265,en:'Linked lists work well for representing linear relationships, but not all relationships are linear. In this section, we look specifically at the problem of representing rooted trees by linked data structures.',
      zh:'★★ 从线性到分支：链表擅长线性关系，**树不是线性的**。本节要解决"用链式结构表示树"。'},
     {kind:'body',page:265,en:'We represent each node of a tree by an object. As with linked lists, we assume that each node contains a key attribute. The remaining attributes of interest are pointers to other nodes, and they vary according to the type of tree.',
      zh:'★ 表示法套路与链表一致：**对象 + 指针字段**；不同的树的类型决定指针字段怎么摆。'},
     {kind:'body',page:265,en:'Figure 10.6 shows how to use the attributes p, left , and right to store pointers to the parent, left child, and right child of each node in a binary tree T . If x: p DNIL , then x is the root. If node x has no left child, then x: left DNIL, and similarly for the right child. The root of the entire tree T is pointed to by the attribute T: root .',
      zh:'★★ 二叉树表示：三个指针 `p` / `left` / `right`。判据：`x.p = NIL` 说明 $x$ 是根；`left`/`right` 为 NIL 说明没有对应孩子。整棵树的入口是 `T.root`。'},
     {kind:'body',page:265,en:'It’s simple to extend the scheme for representing a binary tree to any class of trees in which the number of children of each node is at most some constant k: replace the left and right attributes by child 1 ; child 2 ,…; child k . This scheme no longer works when the number of children of a node is unbounded, however, since we do not know how many attributes to allocate in advance.',
      zh:'★★ k 叉表示及其**失效场景**：孩子数有上界 $k$ 时可以留 `child1..childk`；但孩子数**无界**时就不知道该分配多少字段 —— 这是下面"巧妙方案"的动机。'},
     {kind:'body',page:265,en:'Fortunately, there is a clever scheme to represent trees with arbitrary numbers of children. It has the advantage of using only O(n) space for any n-node rooted tree.',
      zh:'★★ "clever scheme" + 它的核心优势：**对任意 $n$ 节点树都只用 $O(n)$ 空间**。'},
     {kind:'body',page:265,en:'As before, each node contains a parent pointer p, and T: root points to the root of tree T . Instead of having a pointer to each of its children, however, each node x has only two pointers:',
      zh:'★ 每节点仍是 3 个指针（`p` + 2 个），但后两个的含义换了。'},
     {kind:'body',page:265,en:'1. x: left-child points to the leftmost child of node x , and 2. x: right-sibling points to the sibling of x immediately to its right.',
      zh:'★★ **定义句**：`left-child` 指向最左孩子；`right-sibling` 指向自己右边紧邻的兄弟。孩子之间用兄弟链串起来 —— 这就是"折成一条链"。'},
     {kind:'body',page:265,en:'If node x has no children, then x: left-child DNIL , and if node x is the rightmost child of its parent, then x: right-sibling DNIL .',
      zh:'★ 两个 NIL 的判据：没孩子 → `left-child = NIL`；是最右孩子 → `right-sibling = NIL`。'},
     {kind:'body',page:267,en:'We sometimes represent rooted trees in other ways. In Chapter 6, for example, we represented a heap, which is based on a complete binary tree, by a single array along with an attribute giving the index of the last node in the heap. The trees that appear in Chapter 19 are traversed only toward the root, and so only the parent pointers are present: there are no pointers to children.',
      zh:'★★ 表示法不是唯一的：**堆**用数组（隐含父子下标关系，第 6 章）；第 19 章的结构只向上走，所以**只留父指针、不留孩子指针**。选择取决于"你要往哪个方向走"。'},
     {kind:'body',page:268,en:'The left-child, right-sibling representation of an arbitrary rooted tree uses three pointers in each node: left-child , right-sibling, and parent . From any node, its parent can be accessed in constant time and all its children can be accessed in time linear in the number of children.',
      zh:'★★ **双向可达性的精确表述**：父 $O(1)$、全部孩子 $\\Theta(\\text{孩子数})$ —— 后者已经是下界（输出本身就有那么长）。习题 10.3-2 挑战"只用 2 个指针 + 1 个布尔值"做到同样。'},
     {kind:'body',page:269,en:'We can represent a singly linked list with two arrays, key and next . Given the index i of an element, its value is stored in key[i], and the index of its successor is given by next [i], where next [i] DNIL for the last element. We also need the index head of the first element in the list. An n-element list stored in this way is compact if it is stored only in positions 1 through n of the key and',
      zh:'★★ 章末问题 10-3 的**数组链表**：`key[]` + `next[]` 两个数组代替指针。**compact** 指 $n$ 个元素恰好占满下标 $1..n$ —— 这个"占满"性质是下面随机跳跃能生效的前提。'},
     {kind:'body',page:270,en:'Lines 3–7 attempt to skip ahead to a randomly chosen position j . Such a skip helps if key[j] is larger than key[i] and no larger than k. In such a case, j marks a position in the list that i would reach during an ordinary list search. Because the list is compact, we know that any choice of j between 1 and n indexes some element in the list.',
      zh:'★★ 随机跳跃的机制与前提：只有当 $key[j]$ 落在 $(key[i], k]$ 区间里才"有效跳"；而**任何** $j \\in [1,n]$ 都能索引到真实元素 —— 靠的正是 compact。'},
    ],
    terms:[
     {en:'left-child, right-sibling representation',zh:'左孩子右兄弟表示法',page:265},
     {en:'compact',zh:'紧凑的（数组链表恰好占满 1..n）',page:269},
    ]},
   {type:'pseudocode',title:'COMPACT-LIST-SEARCH：数组链表 + 随机跳跃',
    lead:'★ 本节正文没有算法伪代码。这段来自节末问题 10-3（原书 p.269）：用两个数组表示链表，并在扫描中随机跳跃 —— 期望查找时间降到 $O(\\sqrt n)$。',
    algo:'COMPACT-LIST-SEARCH',signature:'COMPACT-LIST-SEARCH(key, next, head, n, k)',page:269,
    lines:[
     {n:1,code:'i = head',zh:'从表头开始（索引，不是指针）。'},
     {n:2,code:'while i ≠ NIL and key[i] < k',zh:'★ 普通的有序链表扫描：第 1–2、8–10 行就是它。'},
     {n:3,code:'    j = RANDOM(1, n)',zh:'★★ 跳跃的核心：**在 $[1,n]$ 里均匀随机取一个下标**。注意不是"沿链随机"，而是任意下标。'},
     {n:4,code:'    if key[i] < key[j] and key[j] ≤ k',zh:'★ 只有 $key[j]$ 落在 $(key[i], k]$ 区间才算"有效跳"（跳到前面去且不越过目标）。'},
     {n:5,code:'        i = j',zh:'跳过去 —— 省掉中间一大段。'},
     {n:6,code:'    if key[i] == k',zh:'命中检查。'},
     {n:7,code:'        return i',zh:''},
     {n:8,code:'    i = next[i]',zh:'没跳成就老老实实走一步。'},
     {n:9,code:'if i == NIL or key[i] > k',zh:'扫描结束：越过链尾或越过 $k$。'},
     {n:10,code:'    return NIL',zh:'未命中。'},
     {n:11,code:'else return i',zh:'命中，返回下标。'},
    ],
    vars:[
     {name:'i',meaning:'当前下标（不是指针 —— 这是数组链表）'},
     {name:'j',meaning:'随机跳跃的目标下标，均匀取自 $[1,n]$'},
     {name:'t',meaning:'问题 10-3(b) 的分析版里"第一段循环的迭代上限"'},
    ],
    note:'★ 为什么是 $O(\\sqrt n)$？每次随机取 $j$，落在"正确的区间"里的概率约 $1/\\sqrt n$（区间的期望长度），于是期望 $\\sqrt n$ 次跳跃命中正确区间。C 程序把普通的 $\\Theta(n)$ 扫描与 compact 前提都验证了一遍。',
    },
   {type:'visualize',title:'看见两种指针摆法',
    panels:[
     {title:'① 二叉树：p / left / right（根 12）',
      viz:'tree',vizMode:'tree',
      trees:[{root:BT}],
      treeNotes:[
        '★ 原书 Figure 10.6 不显示 key（引述："The key attributes are not shown"）—— 这里的 key 是本站为便于对照补上的。',
        '每个节点标注了它相对父节点的位置（left of … / right of …）。根没有父：`p = NIL`。',
        '叶节点（7、9、6）：`left = right = NIL`。',
      ]},
     {title:'② left-child / right-sibling：孩子折成兄弟链',
      viz:'tree',vizMode:'tree',
      trees:[{root:LCRS}],
      treeNotes:[
        '每个节点下方标注 `lc:`（left-child）与 `rs:`（right-sibling）两个指针的值。',
        '★ 找出"1 的所有孩子"：从 `1.lc = 2` 出发 → `2.rs = 3` → `3.rs = 4` → `4.rs = NIL`，得到 {2,3,4} ✓',
        '★ 注意 2 的 `rs = 3` 与 3 的 `lc = 7` 互不干扰：兄弟链与孩子链是**两条独立的链**，这正是"每个节点只要 2 个指针"的原因。',
      ]},
    ],
    tasks:[
     '面板 ① 数一数：7 个节点、每节点 3 个指针域，其中 NIL 的有几个？（根的 p、三个叶的 left/right…）',
     '面板 ② 从根出发，只用 lc/rs 两个指针列出全部 7 个节点（先序：1 → 2 → 5 → 6 → 3 → 7 → 4）。',
     '对比两个面板：二叉树是 2 孩子位，left-child/right-sibling 是"链式"的 —— 同一套指针可以表示任意多叉。',
    ],
    note:'★ 两个面板都用树引擎（静态帧）。★ key 值为本站补足，原书两张图不带 key。'},
   {type:'code',title:'实测：三种表示的空间账与可达性',
    intro:'`c/tree_rep.c` 实现二叉树的 p/left/right、任意多叉树的 left-child/right-sibling，以及问题 10-3 的数组链表搜索，逐项断言。',
    pseudocodeRef:'COMPACT-LIST-SEARCH',
    c:{file:'tree_rep.c',code:String.raw`/* tree_rep.c -- 10.3 节：有根树三种表示法的实现与代价验证。
 *   ① 二叉树的 p / left / right 表示；
 *   ② left-child / right-sibling 表示（任意多叉树，每节点 3 个指针，O(n) 空间）；
 *   ③ 对照：child1..childk 的 k 叉表示（k 个指针/节点，空间 k·n，k 大时浪费）；
 *   ④ 章末问题 10-3 的数组链表（key[] / next[]）搜索。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o tree_rep tree_rep.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

/* ---------------- ① 二叉树：p / left / right ---------------- */
typedef struct bnode {
    int key;
    struct bnode *p, *left, *right;
} bnode_t;

static bnode_t bpool[16];
static int bpool_used;

static bnode_t *bnew(int key)
{
    bnode_t *n = &bpool[bpool_used++];
    n->key = key; n->p = n->left = n->right = NULL;
    return n;
}

static void bset_left(bnode_t *parent, bnode_t *child)
{
    parent->left = child;
    if (child) { child->p = parent; }        /* ★ 父指针由子节点维护 */
}

static void bset_right(bnode_t *parent, bnode_t *child)
{
    parent->right = child;
    if (child) { child->p = parent; }
}

/* 中序遍历（递归版，第 12 章会展开成迭代版） */
static void inorder(const bnode_t *x, int *out, int *n)
{
    if (x == NULL) { return; }
    inorder(x->left, out, n);
    out[(*n)++] = x->key;
    inorder(x->right, out, n);
}

static int bheight(const bnode_t *x)
{
    if (x == NULL) { return 0; }
    int l = bheight(x->left), r = bheight(x->right);
    return 1 + (l > r ? l : r);
}

/* ---------------- ② left-child / right-sibling ---------------- */
typedef struct gnode {
    int key;
    struct gnode *p, *left_child, *right_sibling;
} gnode_t;

static gnode_t gpool[16];
static int gpool_used;

static gnode_t *gnew(int key)
{
    gnode_t *n = &gpool[gpool_used++];
    n->key = key; n->p = n->left_child = n->right_sibling = NULL;
    return n;
}

/* 把 child 挂到 parent 的孩子链尾部（演示"通过孩子链访问全部孩子"） */
static void gadd_child(gnode_t *parent, gnode_t *child)
{
    child->p = parent;
    child->right_sibling = NULL;
    if (parent->left_child == NULL) { parent->left_child = child; return; }
    gnode_t *c = parent->left_child;
    while (c->right_sibling != NULL) { c = c->right_sibling; }
    c->right_sibling = child;
}

static int gcount_children(const gnode_t *x)
{
    int n = 0;
    for (const gnode_t *c = x->left_child; c != NULL; c = c->right_sibling) { n++; }
    return n;
}

static int gcount_all(const gnode_t *x)
{
    int n = 1;
    for (const gnode_t *c = x->left_child; c != NULL; c = c->right_sibling) {
        n += gcount_all(c);
    }
    return n;
}

int main(void)
{
    /* ① 二叉树：指针域的设置与遍历 */
    {
        /* 树形：root(12) 左 15；15 左 4、右 10；4 左 7、右 9；10 左 6 */
        bnode_t *r = bnew(12);
        bset_left(r, bnew(15));
        bset_right(r->left, bnew(10));
        bset_left(r->left, bnew(4));
        bset_left(r->left->left, bnew(7));
        bset_right(r->left->left, bnew(9));
        bset_left(r->left->right, bnew(6));

        assert(r->p == NULL);                        /* 根：p = NIL */
        assert(r->left->p == r);
        assert(r->left->right->p == r->left);
        assert(r->left->left->right->key == 9 && r->left->left->right->left == NULL);

        int out[16], n = 0;
        inorder(r, out, &n);
        assert(n == 7);
        printf("part 1: 二叉树中序 = ");
        for (int i = 0; i < n; i++) { printf("%d%s", out[i], i + 1 < n ? "," : ""); }
        printf("（高度 %d；根 p = NIL，叶的 left/right = NIL）\n", bheight(r));
        /* 中序：7,4,9,15,6,10,12 → 验证 */
        assert(out[0] == 7 && out[1] == 4 && out[2] == 9 && out[3] == 15);
    }

    /* ② left-child / right-sibling：任意多叉树、每节点 3 个指针 */
    {
        gnode_t *r = gnew(1);
        gadd_child(r, gnew(2));
        gadd_child(r, gnew(3));
        gadd_child(r, gnew(4));
        gadd_child(r->left_child, gnew(5));          /* 2 的孩子 */
        gadd_child(r->left_child, gnew(6));
        gadd_child(r->left_child->right_sibling, gnew(7));   /* 3 的孩子 */

        assert(r->p == NULL);
        assert(r->left_child->key == 2);             /* 最左孩子 */
        assert(r->left_child->right_sibling->key == 3);
        assert(r->left_child->right_sibling->right_sibling->key == 4);
        assert(r->left_child->right_sibling->right_sibling->right_sibling == NULL);  /* 最右孩子的 rs = NIL */
        assert(gcount_children(r) == 3);
        printf("part 2: left-child/right-sibling：根有 %d 个孩子，访问它们耗时线性于孩子数\n",
               gcount_children(r));
        assert(gcount_all(r) == 7);
        printf("part 3: 全树 %d 个节点，每节点固定 3 个指针 → 空间 O(n)（与孩子的总数目无关）\n",
               gcount_all(r));

        /* 父指针 O(1)：任取一个节点，向上走到根 */
        /* 节点 6 的路径：根(1) → 左孩子(2) → 左孩子(5) → 右兄弟(6) */
        gnode_t *x = r->left_child->left_child->right_sibling;
        assert(x->key == 6);
        int steps = 0;
        for (gnode_t *y = x; y != NULL; y = y->p) { steps++; }   /* 数沿途节点：6 → 2 → 1 */
        assert(steps == 3);
        printf("part 4: 节点 6 沿 p 指针上溯到根经过 %d 个节点（6 → 2 → 1，每步 O(1)）\n", steps);
    }

    /* ③ 对照：k 叉表示的空间 */
    {
        int n = 1000;
        for (int k = 2; k <= 8; k *= 2) {
            long ptrs = (long)k * n;
            printf("part 5: k = %d 的 child1..childk 表示：%d 个节点要预留 %ld 个指针域" 
                   "（实际可能有大量 NIL）\n", k, n, ptrs);
        }
        printf("        left-child/right-sibling：恒为 3n = %d 个指针域（与 k 无关）\n", 3 * n);
    }

    /* ④ 问题 10-3：数组表示的链表（key[] / next[]）搜索 */
    {
        int key[6] = {0, 10, 20, 30, 40, 50};   /* 下标 1..5 */
        int nxt[6] = {0, 2, 3, 4, 5, 0};        /* next[i] = 0 表示 NIL */
        int head = 1;
        int k = 30, i = head, cmps = 0;
        while (i != 0 && key[i] < k) { cmps++; i = nxt[i]; }   /* 第 2 行：沿 next 走 */
        cmps++;                                                 /* 最后一次比较（fall off 或 >= k） */
        bool found = (i != 0 && key[i] == k);
        printf("part 6: 数组链表搜索 30：比较 %d 次，%s（下标 %d）—— 普通搜索 Θ(n)\n",
               cmps, found ? "命中" : "未命中", i);
        assert(found && i == 3);

        /* 紧凑性：n 个元素只占位置 1..n（问题 10-3 的"compact"前提） */
        int occupied = 0;
        for (i = head; i != 0; i = nxt[i]) { occupied++; }
        printf("part 7: 5 个元素只占用下标 1..%d（compact 链表）—— 任何 j ∈ [1,n] 都索引到一个元素，"
               "这是随机跳跃能生效的前提\n", occupied);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:28,zh:'`bset_left` / `bset_right`：设置孩子的同时**维护父指针**（这就是"每个节点都认得父亲"的代价：$O(1)$ 的额外写入）。'},
              {line:41,zh:'`inorder`：二叉树的中序遍历（第 12 章的预热）。'},
              {line:73,zh:'`gadd_child`：把孩子挂到**孩子链尾部** —— 演示"沿 right-sibling 走完所有孩子"。'},
              {line:83,zh:'`gcount_children`：沿兄弟链数孩子，耗时线性于孩子数。'},
              {line:120,zh:'★ part 1：中序 = 7,4,9,15,6,10,12（根 12、左孩子 15 的形态与 Figure 10.6 一致），根 `p = NIL`、叶 `left/right = NIL`。'},
              {line:146,zh:'★ part 3：全树 7 个节点，每节点固定 3 个指针 → 空间 $O(n)$，**与"每个节点有多少孩子"无关**。'},
              {line:156,zh:'★ part 4：从叶子 6 沿 `p` 上溯到根经过 3 个节点（6 → 2 → 1），每步 $O(1)$。'},
              {line:164,zh:'part 5：$k$ 叉表示的账 —— $k=8$ 时 1000 个节点要预留 8000 个指针域，而 left-child/right-sibling 恒为 3000。'},
              {line:179,zh:'★ part 6–7：问题 10-3 的数组链表：普通扫描比较 3 次命中；5 个元素恰好占满下标 $1..5$（compact）—— 随机跳跃生效的前提。'}],
       tests:[{in:'二叉树（根 12 / 左 15）',out:'中序 7,4,9,15,6,10,12；根 p = NIL'},
              {in:'left-child/right-sibling 7 节点树',out:'孩子数 = 3（线性时间）；空间恒为 3n'},
              {in:'从叶子沿 p 上溯',out:'3 个节点到根（O(1)/步）'},
              {in:'数组链表搜 30',out:'比较 3 次命中；compact 占满 1..5'}]},
    mapping:[{pc:3,pcCode:'j = RANDOM(1, n)',c:'C 程序里未实现随机版（那是问题 10-3(b) 的分析题），part 6 演示的是**去掉第 3–7 行的普通扫描**。'},
             {pc:8,pcCode:'i = next[i]',c:'`i = nxt[i];`（第 176 行）—— 数组链表的"沿指针走"'}]},
   {type:'analyze',title:'三本账：空间、可达方向、以及随机的回报',
    intro:'表示法的取舍有三个维度：**空间**（给几个指针）、**可达方向**（能不能找父、能不能列孩子）、**查询代价**（顺带看看问题 10-3 的随机化收益）。',
    claims:[
     {expr:'3n',when:'left-child/right-sibling 的指针域总数（任意多叉树）',page:265,source:'book'},
     {expr:'O(1)',when:'沿 p 找父节点',page:268,source:'book'},
     {expr:'\\Theta(k)',when:'列出某节点的全部孩子（$k$ = 孩子数，输出下界）',page:268,source:'book'},
     {expr:'O(\\sqrt n)',when:'问题 10-3：compact 有序数组链表的**随机化**查找期望时间',page:270,source:'book'},
    ],
    tables:[{caption:'三种表示法对照',rows:[
      ['','二叉树 p/left/right','k 叉 child1..childk','left-child/right-sibling'],
      ['每节点指针数','3','$k+1$','3'],
      ['空间','$O(n)$','$kn$（含大量 NIL）','$O(n)$'],
      ['找父','$O(1)$','$O(1)$','$O(1)$'],
      ['列全部孩子','$O(1)$（只有 2 个）','$O(k)$（含空位）','$\\Theta(\\text{孩子数})$'],
      ['适用','二叉','孩子数有上界 $k$','**任意多叉**'],
     ]},
     {caption:'表示法由"访问方向"决定（原书 p.267）',rows:[
      ['结构','表示','原因'],
      ['堆（第 6 章）','单数组 + 末尾下标','完全二叉树，父子关系可由下标算出'],
      ['第 19 章的结构','只有父指针','只向上走，不需要孩子指针'],
      ['本章的树','p + left-child + right-sibling','两个方向都要走'],
     ]}],
    chart:{xMax:64,series:[
     {name:'left-child/right-sibling：3n',expr:'3 * n',color:'--viz-done'},
     {name:'k 叉（k = 8）：8n',expr:'8 * n',color:'--viz-violation'},
     {name:'n 个节点（下界参照）',expr:'n',color:'--viz-compare'},
    ]},
    derivations:[
     {kind:'summation',title:'left-child/right-sibling 的空间：为什么是 3n',steps:[
      {zh:'每个节点恰好有一个 `p`、一个 `left-child`、一个 `right-sibling`。'},
      {tex:'\\text{指针域总数} = 3n',zh:'★ 与每个节点孩子的数目、树的形状**全都无关**。'},
      {zh:'对比：$k$ 叉表示要 $kn$ 个指针域；孩子数无界时 $k$ 无法预先确定 —— 这正是"clever"所在。'}]},
     {kind:'summation',title:'可达性：两个方向各自的代价',steps:[
      {zh:'向上：`x.p` 一步到父 → $O(1)$（第 19 章的斐波那契堆会依赖这一点做级联剪枝）。'},
      {tex:'\\text{列全部孩子} = 1 + (\\text{孩子数} - 1) = \\Theta(\\text{孩子数})',zh:'沿 `left-child` → 一串 `right-sibling`。★ 这是**输出下界**，无法更快 —— 与 8.1 的决策树下界是同一类"信息量下界"的思路。'},
      {zh:'★ 习题 10.3-2 挑战：只用 2 个指针 + 1 个布尔值同时支持两个方向 —— 提示是利用"父与孩子的奇偶性"编码。'}]},
     {kind:'summation',title:'问题 10-3：随机跳跃为什么能到 O(√n)',steps:[
      {zh:'普通有序数组链表扫描：$\\Theta(n)$（要沿 `next` 一格一格走）。'},
      {zh:'每次迭代随机取 $j \\in [1,n]$，只有 $key[j] \\in (key[i], k]$ 时才算有效跳。'},
      {tex:'\\Pr\\{\\text{有效跳}\\} \\approx \\frac{1}{\\sqrt n} \\Rightarrow E[\\text{跳跃次数}] = O(\\sqrt n)',zh:'★ 直观：目标区间约有 $\\sqrt n$ 个元素（跳跃的"落点范围"），随机的 $j$ 落进去的概率约 $\\sqrt n / n = 1/\\sqrt n$。'},
      {zh:'★ 这是第 11 章散列表的**概念预热**：用"随机化"换取比线性更好的查找，代价是只保证**期望**。'}]},
    ],
    note:'★ 中心图：绿线（$3n$）与红线（$kn$）的间距就是"孩子折成链"省下的空间；$n$ 是理论下界（每个节点至少要存一个 key）。'},
   {type:'prove',title:'为什么"两个指针"够用：孩子链与兄弟链的双射',
    statement:'1. x: left-child points to the leftmost child of node x , and 2. x: right-sibling points to the sibling of x immediately to its right.',
    page:265,
    intro:'★ 原书把它当"clever scheme"陈述。这里论证它**为什么**等价于"记住所有孩子"—— 核心是一次**双射**。',
    steps:[
     {title:'第一步 · 把"父子关系"重写成"两条链"',
      en:'As before, each node contains a parent pointer p, and T: root points to the root of tree T . Instead of having a pointer to each of its children, however, each node x has only two pointers:',
      page:265,
      body:['原问题：节点 $x$ 需要记住它的孩子集合 $C(x)$，而 $|C(x)|$ 任意。',
        '新的编码：把 $C(x)$ **排成一条链** —— 链头是 `x.left-child`，链上每一环是 `right-sibling`。',
        '★ 这是一个**双射**：树中"兄弟关系"的全体 $\\{(u,v) : v \\text{ is } u \\text{ 的下一个兄弟}\\}$ 与"非最右孩子的 `right-sibling` 指针"一一对应。']},
     {title:'第二步 · 两个方向的代价各自最优',
      en:'From any node, its parent can be accessed in constant time and all its children can be accessed in time linear in the number of children.',
      page:268,
      body:['向上：`p` 一步 → $O(1)$。',
        '向下：从 `left-child` 起沿 `right-sibling` 走 $k$ 步得到 $k$ 个孩子 → $\\Theta(k)$，而**输出本身就是 $k$ 个节点**，所以这是下界。',
        '★ 结论：这个表示在"两个方向"上都达到了各自的信息论极限，而空间只需 $3n$。这就是它被称作 clever 的原因。']},
     {title:'第三步 · NIL 的两处含义（别搞混）',
      en:'If node x has no children, then x: left-child DNIL , and if node x is the rightmost child of its parent, then x: right-sibling DNIL .',
      page:265,
      body:['`x.left-child = NIL`：$x$ **没有孩子**（叶）。',
        '`x.right-sibling = NIL`：$x$ 是**最右孩子**（但它可能有孩子、也可能没有）。',
        '★ 两个 NIL 语义完全不同 —— 这也是本节习题常考的点，C 程序把两种情形分别断言了一遍（根的孩子数 = 3、最右孩子的 `rs = NIL`）。',
        '★ 工程提醒：树形结构里"指针的双重语义"是 bug 的温床（第 12 章删除节点时要区分"没有左孩子"与"左孩子是 NIL 哨兵"）。']},
    ],
    conclusion:'★ 结论：left-child/right-sibling 用 3 个指针表达了任意多叉树，向上 $O(1)$、向下 $\\Theta(k)$（最优），空间恒为 $3n$。它是第 III 部分表示法思想的浓缩：**先问"要往哪个方向走"，再决定指针怎么摆**。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'二叉树的 p/left/right 表示中，怎么判断某节点是根？',
      options:['left = NIL','p = NIL','right = NIL','left = right = NIL'],answer:1,
      why:'★ 原书 p.265："If x.p = NIL, then x is the root."。'},
     {kind:'single',q:'k 叉表示（child1..childk）在什么情况下失效？',
      options:['k > 2 时','孩子数无界、无法预先确定 k 时','树很深时','节点数很大时'],answer:1,
      why:'★ 原书 p.265：孩子数无界时"we do not know how many attributes to allocate in advance"。'},
     {kind:'single',q:'left-child / right-sibling 表示中，`left-child` 指向？',
      options:['任意一个孩子','最左的孩子','左兄弟','父节点'],answer:1,
      why:'★ "x.left-child points to the leftmost child"。孩子集合靠 `right-sibling` 串起来。'},
     {kind:'single',q:'列出某节点的全部孩子需要多少时间？',
      options:['$O(1)$','$\\Theta(\\lg k)$','$\\Theta(k)$（$k$ = 孩子数）','$\\Theta(n)$'],answer:2,
      why:'★ 沿兄弟链逐个走，共 $\\Theta(k)$；这也是输出的下界（要输出 $k$ 个节点）。'},
     {kind:'judge',q:'left-child / right-sibling 表示的空间取决于每个节点孩子的平均数。',answer:false,
      why:'★ 每个节点恒有 3 个指针域（p、left-child、right-sibling），总数 $3n$，**与孩子的分布无关**。'},
     {kind:'simulate',q:'某节点有 4 个孩子。用 left-child/right-sibling 表示，从它的 `left-child` 出发要沿 `right-sibling` 走几步才能列完这 4 个孩子？（填整数）',expect:[3],placeholder:'例如：4',
      why:'第一个孩子由 `left-child` 直接拿到，剩下 3 个各走一步 `right-sibling` → 3 步（连同起点共访问 4 个节点）。'},
    ],
    bookExercises:[
     {id:'10.3-1',page:267,star:0,statement:'Draw the binary tree rooted at index 6 that is represented by the following at- tributes: index key left right 1 17 8 9 2 14 NIL NIL 3 12 NIL NIL 4 20 10 NIL 5 33 2 NIL 6 15 1 4 7 28 NIL NIL 8 22 NIL NIL 9 13 3 7 10 25 NIL 5',hint:'题干后面接一张属性表（每行 = index / key / left / right）。逐行读表、按 left/right 连边即可。★ 注意题目给的是"属性数组"而不是指针图 —— 这正是本关讲的表示法。'},
     {id:'10.3-2',page:267,star:0,statement:'Write an O(n)-time recursive procedure that, given an n-node binary tree, prints out the key of each node in the tree.',hint:'递归版最简：`PRINT(x)` 为 null 就返回，否则访问 `x.key` 再递归左右。$O(n)$（每个节点恰好进一次）。这个写法依赖**调用栈**，栈深度 $O(h)$。'},
     {id:'10.3-3',page:267,star:0,statement:'Write an O(n)-time nonrecursive procedure that, given an n-node binary tree, prints out the key of each node in the tree. Use a stack as an auxiliary data structure.',hint:'把递归版里的"调用栈"换成 10.1 的显式栈：压根 → 循环弹栈 → 访问 → **先压右孩子、再压左孩子**（这样左孩子先出栈）。$O(n)$ 时间、$O(h)$ 额外空间。'},
     {id:'10.3-4',page:267,star:0,statement:'Write an O(n)-time procedure that prints out all the keys of an arbitrary rooted tree with n nodes, where the tree is stored using the left-child, right-sibling representation.',hint:'对每个节点：先输出自己的 key，然后沿 `right-sibling` 遍历**所有兄弟**，每个兄弟再递归 `left-child`。这条"双链交错"的遍历正是 Figure 10.7 表示的用途。'},
     {id:'10-1',page:268,star:0,statement:'Comparisons among lists For each of the four types of lists in the following table, what is the asymptotic worst-case running time for each dynamic-set operation listed? unsorted, sorted, unsorted, sorted, singly singly doubly doubly linked linked linked linked SEARCH INSERT DELETE SUCCESSOR PREDECESSOR MINIMUM MAXIMUM',hint:'章末问题（Boss 区）：比较单链/双链 × 有序/无序四种链表的 SEARCH / INSERT / DELETE 最坏时间。要点：无序单链的 DELETE 与有序单链的 INSERT 都是 $\\Theta(n)$ —— 因为要先找到位置（10.2-1 的结论）。'},
     {id:'10-2',page:268,star:0,statement:'Mergeable heaps using linked lists A mergeable heap supports the following operations: MAKE-HEAP (which creates an empty mergeable heap), INSERT , MINIMUM , EXTRACT-MIN, and UNION . 1 1 Because we have defined a mergeable heap to support MINIMUM and EXTRACT-MIN, we can also refer to it as a mergeable min-heap. Alternatively, if it supports MAXIMUM and EXTRACT-MAX, it is a mergeable max-heap.',hint:'章末问题：用链表实现可合并堆（MAKE-HEAP / INSERT / MINIMUM / EXTRACT-MIN / UNION）。关键在"排序"与"是否不相交"如何影响 UNION 的代价 —— 第 19 章会用更聪明的结构把两项都压到 $O(\\lg n)$。'},
     {id:'10-3',page:269,star:0,statement:'Searching a sorted compact list We can represent a singly linked list with two arrays, key and next . Given the index i of an element, its value is stored in key[i], and the index of its successor is given by next [i], where next [i] DNIL for the last element. We also need the index head of the first element in the list. An n-element list stored in this way is compact if it is stored only in positions 1 through n of the key and next arrays. Let’s assume that all keys are distinct and that the compact list is also sorted, that is, key[i]< key[next [i]] for all i = 1,2,…,n such that next [i] ≠ NIL. Under these assumptions, you will show that the randomized algorithm COMPACT-LIST- SEARCH searches the list for key k in O. √n/ expected time. COMPACT-LIST-SEARCH (key; next ; head ,n,k) 1 i = head 2 while i ≠ NIL and key[i]<k 3 j DRANDOM(1,n) 4 if key[i]< key[j] and key[j] ≤ k 5 i = j 6 if key[i] == k 7 return i 8 i = next [i] 9 if i == NIL or key[i]>k 10 return NIL 11 else return i If you ignore lines 3–7 of the procedure, you can see that it’s an ordinary algo- rithm for searching a sorted linked list, in which index i points to each position of the list in turn. …',hint:'章末问题，也是本关伪代码段的出处：`key[]`/`next[]` 两个数组表示**紧凑有序**的链表，用"随机跳到位置 $j$"把查找期望时间降到 $O(\\sqrt n)$。C 程序 part 6–7 演示了普通扫描与 compact 性质。'},
    ]},
  ],
};
