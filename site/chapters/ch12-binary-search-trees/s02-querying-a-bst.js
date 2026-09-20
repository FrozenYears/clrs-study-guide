/* 第 12 章 12.2：查询一棵二叉搜索树（Querying a binary search tree）。
 * 原文锚点：印刷页 316–321（pdf_index 337–342）。
 * 引述已用 tools/07_pick_quotes.py pick 12 12.2 逐条预检（PASS）。
 * 主题：SEARCH / MINIMUM / MAXIMUM / SUCCESSOR / PREDECESSOR 全部 O(h)。
 */

/* 原书 Figure 12.2 的树：插入顺序 15,6,18,3,7,17,20,2,4,13,11（高 4，边数） */
const KEYS = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11];

export default {
  key:'s02',id:'ch12/s02',chapter:12,section:'12.2',
  title:'查询一棵二叉搜索树',shortTitle:'12.2 查询 BST',
  titleEn:'Querying a binary search tree',
  source:{printed:[316,321],pdf:[337,342]},
  prerequisites:[{label:'12.1 What is a binary search tree?',url:'#/ch12/s01'}],
  stages:[
   {type:'map',title:'五个查询，一个共同上界：O(h)',
    why:'12.1 说了"操作代价 = O(h)"，本关兑现：SEARCH / MINIMUM / MAXIMUM / SUCCESSOR / PREDECESSOR 五个查询**全部** $O(h)$。它们共享同一个模式：**从根出发沿一条简单路径下降（或上升）**。',
    position:'12.1 给了 BST 性质与中序遍历；本关把性质变成五个 $O(h)$ 的查询过程 —— 这也是 12.3 插入/删除的构件（插入 = 一次不成功查找；删除要找后继）。全部结论只依赖树高，所以第 13 章只要钉住 $h = O(\\lg n)$ 就能免费继承本关的一切。',
    unlocks:[{label:'12.3 Insertion and deletion',url:'#/ch12/s03'}],
    mathKit:[
     {title:'查找 = 沿路径二分',body:'从根开始：$k < x.key$ 往左、$k > x.key$ 往右、相等即命中。走过的节点构成一条从根向下的**简单路径**。'},
     {title:'最值 = 一路向左/向右',body:'最小值 = 最左节点；最大值 = 最右节点。由 BST 性质直接保证正确。'},
     {title:'后继的两种情况',body:'① $x$ 有右子树 → 后继 = 右子树的**最小**节点；② $x$ 无右子树 → 后继 = **第一个"拐向左"的祖先**（$x$ 在该祖先的左子树里）。'},
    ]},
   {type:'intuition',title:'查询 = 走一条路，路的长度就是树高',
    scene:'字典查找：每次翻页排除一半，直到翻到那一页',
    body:[
     '五个查询其实都在做同一件事：**从根出发，沿一条简单路径走到目标**。BST 性质保证路上每个岔路口都能唯一地排除一侧子树 —— 所以路不会重复、不会回头。',
     '★ SEARCH 递归与迭代**等价**（原书明确给出两个版本）：递归优雅、迭代省栈空间 —— C 程序实测两者走同一条路径、比较次数相同。',
     '★ **SUCCESSOR 最精巧**：① $x$ 有右子树 → 后继是右子树的最左节点（一棵小 TREE-MINIMUM）；② $x$ 无右子树 → 向上爬，直到"从右侧爬上来的第一次拐弯"停住 —— 那个祖先就是后继。',
     '★ 所有的代价都是"路径长度"≤ $h+1$ —— C 程序实测 11 次查找的最大比较 = 5 = $h+1$。',
    ],
    interactive:{text:'阶段 5 的面板用原书 Figure 12.2 的树演示：查找路径、最小值的一路向左、后继的两种情况。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对 x: key、α 等的排版形式）。',
    blocks:[
     {kind:'body',page:316,en:'Binary search trees can support the queries MINIMUM , MAXIMUM , SUCCESSOR , and PREDECESSOR , as well as SEARCH . This section examines these operations and shows how to support each one in O(h) time on any binary search tree of height h.',
      zh:'★★ 本关的目录页：五个查询、**每一个都是 $O(h)$**、对任意 BST 成立。'},
     {kind:'body',page:316,en:'The TREE-SEARCH procedure begins its search at the root and traces a simple path downward in the tree, as shown in Figure 12.2(a). For each node x it encounters, it compares the key k with x: key. If the two keys are equal, the search terminates.',
      zh:'★★ 查找的过程描述：从根沿一条**简单路径**下降，每个节点做一次比较。三岔口：相等（停）/ 小（左）/ 大（右）。'},
     {kind:'body',page:316,en:'The nodes encountered during the recursion form a simple path downward from the root of the tree, and thus the running time of TREE-SEARCH is O(h), where h is the height of the tree.',
      zh:'★★ **O(h) 的论证**：走过的节点构成一条从根向下的简单路径 → 时间 $O(h)$。就这么简单。'},
     {kind:'body',page:317,en:'(b) The minimum key in the tree is 2, which is found by following left pointers from the root. The maximum key 20 is found by following right pointers from the root. (c) The successor of the node with key 15 is the node with key 17, since it is the minimum key in the right subtree of 15.',
      zh:'★★ Figure 12.2 的查询实例（C 程序逐个复算）：最小 2（一路向左）、最大 20（一路向右）、15 的后继 17（右子树最小）。'},
     {kind:'body',page:318,en:'The binary-search-tree property guarantees that TREE-MINIMUM is correct. If node x has no left subtree, then since every key in the right subtree of x is at least as large as x: key, the minimum key in the subtree rooted at x is x: key.',
      zh:'★★ TREE-MINIMUM 的**正确性证明**（两句话的归纳）：无左子树时右子树全 ≥ $x.key$ → $x$ 就是子树最小。'},
     {kind:'body',page:318,en:'Successor and predecessor Given a node in a binary search tree, how can you find its successor in the sorted order determined by an inorder tree walk? If all keys are distinct, the successor of a node x is the node with the smallest key greater than x: key. Regardless of whether the keys are distinct, we define the successor of a node as the next node visite',
      zh:'★★ **后继的两种定义方式**："比 $x.key$ 大的最小 key"（要求互异）与"中序遍历中 $x$ 的下一个节点"（**不要求互异**）—— 后者更强，本章用后者。'},
     {kind:'body',page:318,en:'The code for TREE-SUCCESSOR has two cases. If the right subtree of node x is nonempty, then the successor of x is just the leftmost node in x ’s right subtree, which line 2 finds by calling TREE-MINIMUM(x: right ). For example, the successor of the node with key 15 in Figure 12.2(c) is the node with key 17.',
      zh:'★★ 情形 1：右子树非空 → 后继 = 右子树最左节点（一次 TREE-MINIMUM）。例子：15 的后继 17。'},
     {kind:'body',page:319,en:'TREE-SUCCESSOR (x) left child is also an ancestor of x . In Figure 12.2(d), the successor of the node with key 13 is the node with key 15. To find y , go up the tree from x until you encounter either the root or a node that is the left child of its parent. Lines 4–8 of TREE-SUCCESSOR handle this case.',
      zh:'★★ 情形 2：$x$ 无右子树 → 从 $x$ 向上爬，直到遇到**是其父左孩子的节点**（或到根）—— 那个父就是后继。例子：13 的后继 15。'},
     {kind:'body',page:319,en:'The dynamic-set operations SEARCH , MINIMUM , MAXIMUM , SUCCESSOR , and PREDECESSOR can be implemented so that each one runs in O(h) time on a binary search tree of height h.',
      zh:'★★ **本关的定理句**（原书把它放在节末）：五个查询每个 $O(h)$。'},
    ],
    terms:[
     {en:'TREE-SUCCESSOR',zh:'后继（中序序列中的下一个节点）',page:318},
    ]},
   {type:'pseudocode',title:'TREE-SEARCH 与 ITERATIVE-TREE-SEARCH：等价的两个版本',
    lead:'★ 原书给了两个版本：递归优雅、迭代省栈。两者走**同一条路径**（C 程序 part 2 实测比较次数相同）。',
    algo:'TREE-SEARCH',signature:'TREE-SEARCH(x, k)',page:316,
    lines:[
     {n:1,code:'if x == NIL or k == x.key',zh:'两个出口：走空了（未命中）或相等（命中）。'},
     {n:2,code:'    return x',zh:'返回指向节点的**指针**（未命中返回 NIL）。'},
     {n:3,code:'if k < x.key',zh:'BST 性质：小了往左。'},
     {n:4,code:'    return TREE-SEARCH(x.left, k)',zh:'只递归一侧 —— 这就是"一条路径"的来源。'},
     {n:5,code:'else return TREE-SEARCH(x.right, k)',zh:'大了往右。'},
    ],
    vars:[
     {name:'x',meaning:'当前节点（从根开始）'},
     {name:'k',meaning:'要找的 key'},
    ],
    note:'★ 迭代版：把递归换成 while 循环，逻辑完全相同。对**反复插入/删除**的实现（12.3），迭代版更合适（省栈）。',
    more:[
     {algo:'TREE-MINIMUM',subtitle:'TREE-MINIMUM(x) / TREE-MAXIMUM(x) —— 各 3 行（原书 p.318）',
      signature:'TREE-MINIMUM(x)',page:318,
      lines:[
       {n:1,code:'while x.left ≠ NIL',zh:'有左孩子就一直往左。'},
       {n:2,code:'    x = x.left',zh:''},
       {n:3,code:'return x',zh:'最左节点 = 子树最小（正确性两句话归纳，见 source 段）。MAXIMUM 对称地一路向右。'},
      ],
      vars:[{name:'x',meaning:'子树的根'}],
      note:''},
     {algo:'TREE-SUCCESSOR',subtitle:'TREE-SUCCESSOR(x) —— 8 行、两种情况（原书 p.319）',
      signature:'TREE-SUCCESSOR(x)',page:319,
      lines:[
       {n:1,code:'if x.right ≠ NIL',zh:'★ 情形 1：有右子树。'},
       {n:2,code:'    return TREE-MINIMUM(x.right)    // leftmost node in right subtree',zh:'后继 = 右子树最左节点。'},
       {n:3,code:'else    // find the lowest ancestor of x whose left child is an ancestor of x',zh:'★ 情形 2：无右子树 —— 找 $x$ 的最低祖先，使 $x$ 落在它的左子树里。'},
       {n:4,code:'    y = x.p',zh:'从父开始向上爬。'},
       {n:5,code:'    while y ≠ NIL and x == y.right',zh:'只要 $x$ 还是父的**右**孩子，就继续爬。'},
       {n:6,code:'        x = y',zh:''},
       {n:7,code:'        y = y.p',zh:''},
       {n:8,code:'    return y',zh:'第一个"拐向左"的祖先 = 后继；爬到根都没有 → NIL（$x$ 是最大元）。'},
      ],
      vars:[{name:'x',meaning:'起点节点'},{name:'y',meaning:'向上爬的游标'}],
      note:'★ 原书语料把第 8 行和正文混排了（`return y left child is also an ancestor of x` 是排版伪影）—— 正确的第 8 行就是 `return y`。'},
    ]},
   {type:'visualize',title:'看见五个查询（原书 Figure 12.2 的树）',
    panels:[
     {title:'① 查找路径与最值：一路下降 / 一路向左',
      viz:'tree',
      algorithm:'bst-search',
      input:{array:KEYS, args:[KEYS, 13]},
      countLabels:{cmp:'比较',move:{label:'步进',unit:'次'}},
      invariants:[{label:'走过的节点构成一条从根向下的简单路径 —— 路长 ≤ h + 1'}],
      presets:[
       {name:'★ 查找 13（Figure 12.2(a) 的路径）',array:KEYS,args:[KEYS, 13]},
       {name:'查找不存在的 5（落到 NIL）',array:KEYS,args:[KEYS, 5]},
       {name:'最小值：一路向左（bst-min）',array:KEYS,algorithm:'bst-min',args:[KEYS]},
      ]},
     {title:'② 后继的两种情况（Figure 12.2(c)(d)）',
      viz:'tree',
      algorithm:'bst-successor',
      input:{array:KEYS, args:[KEYS, 15]},
      invariants:[{label:'情形 1：右子树非空 → 右子树最左；情形 2：无右子树 → 向上找第一个拐向左的祖先'}],
      presets:[
       {name:'★ 情形 1：SUCCESSOR(15) = 17',array:KEYS,args:[KEYS, 15]},
       {name:'情形 2：SUCCESSOR(13) = 15',array:KEYS,args:[KEYS, 13]},
       {name:'最大元没有后继：SUCCESSOR(20) = NIL',array:KEYS,args:[KEYS, 20]},
      ]},
    ],
    tasks:[
     '面板 ① 查找 13 的路径：15 → 6 → 7 → 13，恰好 4 次比较 —— 与 C 程序 part 2 一致。',
     '面板 ① 切到 bst-min：从 15 一路向左到 2，3 次步进 —— "最左节点"的图形化。',
     '面板 ② 情形 2 的动画重点看"向上爬"：13 → 7 → 6 → 15 停（6 是 15 的左孩子）。',
     '面板 ② 最大元 20 没有后继：一路爬到根都是"右孩子" → NIL。',
    ],
    note:'★ 面板用 bst 引擎（原书 Figure 12.2 的树，插入顺序 15,6,18,3,7,17,20,2,4,13,11）。C 程序把每个查询的比较次数都数了出来。'},
   {type:'code',title:'实测：递归 = 迭代，全部 ≤ h + 1',
    intro:'`c/bst_query.c` 构建 Figure 12.2 的树，逐个实测五个查询，并验证定理的 $O(h)$。',
    pseudocodeRef:'TREE-SEARCH',
    c:{file:'bst_query.c',code:String.raw`/* bst_query.c -- 12.2 节：BST 查询操作全家族的实现与 O(h) 实测。
 * 树 = 原书 Figure 12.2 的形态：插入顺序 15,6,18,3,7,17,20,2,4,13,11。
 *   ① TREE-SEARCH（递归）与 ITERATIVE-TREE-SEARCH 等价；
 *   ② TREE-MINIMUM / TREE-MAXIMUM（一路向左 / 向右）；
 *   ③ TREE-SUCCESSOR 的两种情况（Figure 12.2(d)：13 的后继是 15）；
 *   ④ 定理实测：全部查询的比较次数 ≤ h + 1（O(h)）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bst_query bst_query.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 32

typedef struct node { int key; struct node *left, *right, *p; } node_t;

static node_t pool[MAXN];
static int pool_used;
static long cmps;                       /* 比较计数（查询代价的度量） */

static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

static node_t *insert(node_t *root, int key)
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x != NULL) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (y == NULL) { return z; }
    if (key < y->key) { y->left = z; } else { y->right = z; }
    return root;
}

/* TREE-SEARCH（递归，5 行） */
static node_t *tree_search(node_t *x, int k)
{
    cmps++;
    if (x == NULL || k == x->key) { return x; }
    if (k < x->key) { return tree_search(x->left, k); }
    return tree_search(x->right, k);
}

/* ITERATIVE-TREE-SEARCH（5 行） */
static node_t *iter_search(node_t *x, int k)
{
    while (x != NULL && k != x->key) {
        cmps++;
        x = k < x->key ? x->left : x->right;
    }
    if (x != NULL) { cmps++; }      /* 命中的那次比较也要计（与递归版同语义） */
    return x;
}

/* TREE-MINIMUM（3 行） */
static node_t *tree_minimum(node_t *x)
{
    while (x->left != NULL) { cmps++; x = x->left; }
    return x;
}

/* TREE-MAXIMUM（3 行） */
static node_t *tree_maximum(node_t *x)
{
    while (x->right != NULL) { cmps++; x = x->right; }
    return x;
}

/* TREE-SUCCESSOR（8 行） */
static node_t *tree_successor(node_t *x)
{
    if (x->right != NULL) { return tree_minimum(x->right); }   /* 情形 1 */
    node_t *y = x->p;                                          /* 情形 2：向上 */
    while (y != NULL && x == y->right) { cmps++; x = y; y = y->p; }
    return y;
}

static int height(const node_t *x)   /* CLRS：边数 */
{
    if (!x) { return -1; }
    int l = height(x->left), r = height(x->right);
    return 1 + (l > r ? l : r);
}

int main(void)
{
    /* ① Figure 12.2 的树 */
    node_t *root = NULL;
    int keys[11] = {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11};
    for (int i = 0; i < 11; i++) { root = insert(root, keys[i]); }
    int h = height(root);
    assert(root->key == 15 && root->left->key == 6 && root->right->key == 18);
    assert(root->left->right->key == 7 && root->left->right->right->key == 13);
    assert(root->left->right->right->left->key == 11);
    printf("part 1: Figure 12.2 的树（插入 15,6,18,3,7,17,20,2,4,13,11）高 %d（边数）\n", h);

    /* ② SEARCH：递归与迭代等价 */
    cmps = 0;
    node_t *f = tree_search(root, 13);
    long rec = cmps;
    cmps = 0;
    node_t *g = iter_search(root, 13);
    assert(f == g && f != NULL && rec == cmps);
    printf("part 2: 查找 13：递归与迭代都走同一条路径，比较 %ld 次；查找 5 返回 NIL\n", rec);
    cmps = 0;
    assert(iter_search(root, 5) == NULL);
    printf("part 3: 查找不存在的 5：%ld 次比较后落到 NIL（仍 ≤ h + 1）\n", cmps);

    /* ③ MINIMUM / MAXIMUM */
    cmps = 0;
    node_t *mn = tree_minimum(root);
    long cmn = cmps;
    cmps = 0;
    node_t *mx = tree_maximum(root);
    printf("part 4: 最小 = %d（%ld 次步进，一路向左）、最大 = %d（一路向右）\n",
           mn->key, cmn, mx->key);
    assert(mn->key == 2 && mx->key == 20);

    /* ④ SUCCESSOR 两种情况（Figure 12.2(d)） */
    cmps = 0;
    node_t *s13 = tree_successor(tree_search(root, 13));
    printf("part 5: SUCCESSOR(13) = %d（情形 2：13 无右孩子，向上找第一个拐向左的祖先）\n", s13->key);
    assert(s13->key == 15);
    node_t *s15 = tree_successor(tree_search(root, 15));
    printf("part 6: SUCCESSOR(15) = %d（情形 1：右子树的最小节点）\n", s15->key);
    assert(s15->key == 17);
    node_t *s20 = tree_successor(tree_search(root, 20));
    assert(s20 == NULL);
    printf("part 7: SUCCESSOR(20) = NIL（20 是最大元，没有后继）\n");

    /* ⑤ 定理实测：所有查询的比较次数 ≤ h + 1 */
    {
        long worst = 0;
        for (int i = 0; i < 11; i++) {
            cmps = 0;
            (void)iter_search(root, keys[i]);
            if (cmps > worst) { worst = cmps; }
        }
        printf("part 8: 11 次（成功）查找的最大比较 = %ld ≤ h + 1 = %d —— O(h) 实测\n", worst, h + 1);
        assert(worst <= h + 1);
    }

    /* ⑥ 习题 12.2-7：用 n 次 SUCCESSOR 走完整棵树（总代价 Θ(n) 摊还） */
    {
        long total = 0;
        node_t *x = tree_minimum(root);
        int cnt = 0;
        while (x != NULL) {
            cmps = 0;
            cnt++;
            node_t *nxt = tree_successor(x);
            total += cmps + 1;
            x = nxt;
        }
        assert(cnt == 11);
        printf("part 9: 习题 12.2-7：从最小元出发调用 %d 次 SUCCESSOR 走完全树，总代价 %ld（Θ(n) 摊还）\n",
               cnt, total);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:42,zh:'`tree_search`：递归版 —— 入口的 `cmps++` 把"命中那次比较"也计入。'},
              {line:47,zh:'★ `iter_search`：迭代版 —— **与递归版同语义计数**（命中也算一次）。第一版漏了命中的计数，递归/迭代的次数对不上，被自己的断言抓住。'},
              {line:58,zh:'`tree_minimum`：一路向左（`cmps` 记步进数）。'},
              {line:72,zh:'★ `tree_successor`：8 行伪代码直译，两种情况。'},
              {line:106,zh:'part 2：查找 13 递归/迭代各比较 4 次（15→6→7→13），**两者相等**。'},
              {line:124,zh:'★ part 5–7：后继两情况 + 最大元无后继（Figure 12.2(c)(d) 的实例复算）。'},
              {line:141,zh:'★★ part 8：11 次查找的最大比较 = 5 = h + 1 —— 定理的 $O(h)$ 实测。'},
              {line:158,zh:'part 9：习题 12.2-7 —— 11 次 SUCCESSOR 走完全树总代价 18（Θ(n) 摊还）。'}],
       tests:[{in:'查找 13（Figure 12.2 树，h = 4）',out:'递归与迭代各比较 4 次，同一路径'},
              {in:'SUCCESSOR(13) / (15) / (20)',out:'15（情形 2 向上）/ 17（情形 1）/ NIL'},
              {in:'11 次成功查找',out:'最大比较 5 = h + 1（O(h)）'},
              {in:'11 次 SUCCESSOR 从最小元走起',out:'总代价 18（Θ(n) 摊还）'}]},
    mapping:[{pc:1,pcCode:'if x == NIL or k == x.key',c:'`if (x == NULL || k == x->key)`（tree_search 第 43 行附近）'},
             {pc:3,pcCode:'x = x.left',c:'`x = k < x->key ? x->left : x->right;`（iter_search 第 55 行）—— 三岔口合并成条件表达式'},
             {pc:5,pcCode:'while y ≠ NIL and x == y.right',c:'`while (y != NULL && x == y->right)`（第 86 行附近）'}]},
   {type:'analyze',title:'一本账：为什么五个查询都压不破 O(h)',
    intro:'五个查询共享同一个结构论证：**走过的节点构成一条简单路径**。',
    claims:[
     {expr:'O(h)',when:'SEARCH / ITERATIVE-SEARCH（一条向下的路径）',page:316,source:'book'},
     {expr:'O(h)',when:'MINIMUM / MAXIMUM（一条向左/右的路径）',page:318,source:'book'},
     {expr:'O(h)',when:'SUCCESSOR / PREDECESSOR（最多一条向上 + 一条向下的路径）',page:319,source:'book'},
     {expr:'\\Theta(n)',when:'习题 12.2-7：n 次 SUCCESSOR 连续调用的**总**代价（摊还 Θ(1) 每次）',page:320,source:'book'},
    ],
    tables:[{caption:'五种查询的路径形状',rows:[
      ['查询','路径','为什么是 O(h)'],
      ['SEARCH','根 → 目标（向下）','每层一次比较'],
      ['MINIMUM','根 → 最左','最多 h 步'],
      ['MAXIMUM','根 → 最右','最多 h 步'],
      ['SUCCESSOR','情形 1：x → 右子树最左（≤ 2h）；情形 2：x → 祖先（≤ h）','两段路径不重叠'],
     ]},
     {caption:'后继两种情况的判定',rows:[
      ['','情形 1','情形 2'],
      ['条件','右子树非空','无右子树'],
      ['动作','右子树里 TREE-MINIMUM','沿 p 向上到第一个左拐'],
      ['例子（Figure 12.2）','15 → 17','13 → 15'],
      ['边界','—','最大元 → NIL'],
     ]}],
    chart:{xMax:64,series:[
     {name:'查询代价：h',expr:'n - 1',color:'--viz-compare'},
     {name:'习题 12.2-7：n 次 SUCCESSOR 总代价 2n',expr:'2 * n',color:'--viz-done'},
    ]},
    derivations:[
     {kind:'summation',title:'SUCCESSOR 的 O(h)：两段路径不重叠',steps:[
      {zh:'情形 1：一次 TREE-MINIMUM 在右子树里走最左链 —— 最多 $h$ 步。'},
      {zh:'情形 2：沿 $p$ 向上，最多 $h$ 步到根。'},
      {tex:'\\max(\\text{两段}) \\le h \\Rightarrow O(h)',zh:'★ 每种情况都只走一条路径 → $O(h)$。'}]},
     {kind:'summation',title:'习题 12.2-7：为什么 n 次 SUCCESSOR 只要 Θ(n)',steps:[
      {zh:'从最小元开始连续调 n 次 SUCCESSOR，**每条树边恰好被向上走一次**。'},
      {tex:'\\sum = \\Theta(n)',zh:'★ 摊还每次 $O(1)$ —— 这是第 17 章（摊还分析）的预告：单次贵 ≠ 总代价贵。C 程序 part 9 实测总代价 18 ≈ 2n。'}]},
    ],
    note:'★ 中心图：红线（单次查询 $h$）与绿线（$n$ 次 SUCCESSOR 总代价 $2n$）—— 单次最坏是 $h$，但**连续走完全树**只要线性。'},
   {type:'prove',title:'五个查询为什么都是 O(h)：路径论证的两次应用',
    statement:'The dynamic-set operations SEARCH , MINIMUM , MAXIMUM , SUCCESSOR , and PREDECESSOR can be implemented so that each one runs in O(h) time on a binary search tree of height h.',
    page:319,
    intro:'★ 本节的"证明"都是路径计数 —— 关键是说明"走过的节点构成一条简单路径，且与 $n$ 无关"。',
    steps:[
     {title:'第一步 · SEARCH：一条向下的路径',
      en:'The nodes encountered during the recursion form a simple path downward from the root of the tree, and thus the running time of TREE-SEARCH is O(h), where h is the height of the tree.',
      page:316,
      body:['每个节点做一次比较后**只递归一侧** —— 递归深度 = 路径长度 ≤ $h$。',
        '★ 对比二分查找：BST 的查找是"树化的二分"，代价由树的**平衡程度**决定 —— 这正是第 13 章要管理的。']},
     {title:'第二步 · MINIMUM 的正确性与代价（两句话归纳）',
      en:'The binary-search-tree property guarantees that TREE-MINIMUM is correct. If node x has no left subtree, then since every key in the right subtree of x is at least as large as x: key, the minimum key in the subtree rooted at x is x: key.',
      page:318,
      body:['无左子树 → 右子树全 ≥ $x.key$ → $x$ 是子树最小 ✓。',
        '有左子树 → 左子树里有**更小或相等**的 key → 最小值在左子树里（归纳）。',
        '★ 代价：最多 $h$ 步（一路向左）。MAXIMUM 完全对称。']},
     {title:'第三步 · SUCCESSOR：两种情况各走一条路径',
      en:'The code for TREE-SUCCESSOR has two cases. If the right subtree of node x is nonempty, then the successor of x is just the leftmost node in x ’s right subtree, which line 2 finds by calling TREE-MINIMUM(x: right ).',
      page:318,
      body:['**情形 1**（右子树非空）：右子树最左节点 —— 它比 $x$ 大、且比右子树里其他一切都小 → 就是后继。一次 TREE-MINIMUM ≤ $h$ 步。',
        '**情形 2**（无右子树）：后继是"最低的、其左孩子也是 $x$ 祖先的祖先" —— 沿 $p$ 向上爬到第一个左拐，≤ $h$ 步。',
        '★ 两种情况的代价都 ≤ $h$ → $O(h)$。∎ PREDECESSOR 镜像对称（左子树最右 / 向上找右拐）。']},
    ],
    conclusion:'★ 结论：五个查询全部 $O(h)$。★ 全部的代价都押在 $h$ 上 —— 第 13 章红黑树保证 $h = O(\\lg n)$ 后，这些过程**一行不用改**就全部变成 $O(\\lg n)$。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'TREE-SUCCESSOR 的情形 2（x 无右子树）怎么找后继？',
      options:['沿左孩子一路向下','沿 p 向上，直到 x 是某个节点的**左**孩子','返回 NIL','从根重新查找'],answer:1,
      why:'★ 原书 p.319："go up the tree from x until you encounter either the root or a node that is the left child of its parent"。'},
     {kind:'single',q:'Figure 12.2 的树里，15 的后继为什么是 17？',
      options:['17 是 15 的右孩子','17 是 15 的右子树里最小的 key','17 紧跟在 15 后面插入','17 是根的孩子'],answer:1,
      why:'★ 情形 1：右子树非空 → 右子树最左节点 = TREE-MINIMUM(x.right) = 17。'},
     {kind:'single',q:'递归版 TREE-SEARCH 与迭代版的比较次数？',
      options:['递归少一次','迭代少一次','**相同**（同一条路径）','取决于树的形状'],answer:2,
      why:'★ 两者走同一条路径（原书两版并存就是为此）。C 程序 part 2 实测相等。'},
     {kind:'single',q:'在 BST 里找最小值，正确的做法是？',
      options:['从根开始中序遍历取第一个','从根一路向左','从根一路向右','任选一条路径'],answer:1,
      why:'★ TREE-MINIMUM：一路向左直到没有左孩子。它的正确性由 BST 性质两句话归纳保证。'},
     {kind:'judge',q:'SUCCESSOR 在最坏情况下可能需要 Ω(n) 时间。',answer:false,
      why:'★ 在一棵 $h$ 高的树里，SUCCESSOR 的两种情况都只走一条路径 → $O(h)$。当然若树退化成链（$h = n-1$），$O(h) = O(n)$ —— 但那是"树形"的锅，不是算法的锅。'},
     {kind:'single',q:'从最小元开始，在 n 节点的 BST 上连续调用 n 次 TREE-SUCCESSOR，每条树边恰好被向上走一次。总代价是多少阶？',options:['$\Theta(1)$','$\Theta(\lg n)$','**$\Theta(n)$**','$\Theta(n \lg n)$'],answer:2,
      why:'★ 习题 12.2-7：每条边恰好走一次 → 总代价 $\\Theta(n)$，摊还每次 $O(1)$ —— 单次最坏 $O(h)$ 与总代价 $\\Theta(n)$ 并不矛盾。'},
    ],
    bookExercises:[
     {id:'12.2-1',page:319,star:0,statement:'You are searching for the number 363 in a binary search tree containing numbers between 1 and 1000. Which of the following sequences cannot be the sequence of nodes examined? a. 2, 252, 401, 398, 330, 344, 397, 363. b. 924, 220, 911, 244, 898, 258, 362, 363. c. 925, 202, 911, 240, 912, 245, 363. d. 2, 399, 387, 219, 266, 382, 381, 278, 363. e. 935, 278, 347, 621, 299, 392, 358, 363.',hint:'判据不是「谁比 363 大谁比 363 小」（那是按序列里的位置读，会把合法序列误判成不可能），而是**搜索区间必须单调收缩**：从 $(-\\infty, +\\infty)$ 出发，每读一个结点 $k$，若 $k < 363$ 就把下界抬到 $k$，若 $k > 363$ 就把上界压到 $k$；一旦某个 $k$ 落在当前区间之外，这条序列就不可能是任何 BST 上的查找路径。逐条走一遍（b 里 924 出现在 363 之前是完全合法的），不能成立的是 **c 与 e**：c 在读到 912 时上界已被 911 压住，e 在读到 299 时下界已被 347 抬起。'},
     {id:'12.2-2',page:320,star:0,statement:'Write recursive versions of TREE-MINIMUM and TREE-MAXIMUM .',hint:'`if x.left == NIL return x; return TREE-MINIMUM(x.left)` —— MAXIMUM 对称。与迭代版同样的 $O(h)$。'},
     {id:'12.2-3',page:320,star:0,statement:'Write the TREE-PREDECESSOR procedure.',hint:'SUCCESSOR 的镜像：① 有左子树 → TREE-MAXIMUM(x.left)；② 无左子树 → 沿 p 向上直到 x 是父的**右**孩子。'},
     {id:'12.2-4',page:320,star:0,statement:'Professor Kilmer claims to have discovered a remarkable property of binary search trees. Suppose that the search for key k in a binary search tree ends up at a leaf. Consider three sets: A, the keys to the left of the search path; B , the keys on the search path; and C , the keys to the right of the search path. Professor Kilmer claims that any three keys a 2 A, b 2 B , and c 2 C must satisfy a ≤ b ≤ c . Give a smallest possible counterexample to the professor’s claim.',hint:'**不对** —— 两次查找走的是不同路径，比较集合不重叠到可复用的程度。这是"看似合理实则错误"的论断题。'},
     {id:'12.2-5',page:320,star:0,statement:'Show that if a node in a binary search tree has two children, then its successor has no left child and its predecessor has no right child.',hint:'把不等式方向摆正：$y$ 是 $x$ 的后继，所以 $y$ 在 $x$ 的**右子树**里； $z$ 是 $y$ 的左孩子，自然也还在 $x$ 的右子树里。于是 $\\text{key}[x] < \\text{key}[z] < \\text{key}[y]$ —— 提示里写成 $\\text{key}[y] \\le \\text{key}[z] < \\text{key}[x]$ 两头都反了， 而且「$y$ 是 $x$ 右子树里最小的」与「$\\text{key}[y] \\le \\text{key}[z]$」直接打架。 $z$ 只能是叶：若 $z$ 有左孩子，那个孩子比 $y$ 还小、又在 $x$ 的右子树里，$y$ 就不是后继了（有右孩子同理）。'},
     {id:'12.2-6',page:320,star:0,statement:'Consider a binary search tree T whose keys are distinct. Show that if the right subtree of a node x in T is empty and x has a successor y , then y is the lowest ancestor of x whose left child is also an ancestor of x . (Recall that every node is its own ancestor.)',hint:'这就是 TREE-SUCCESSOR 情形 2 的正确性：向上爬的过程中第一个"x 在其左子树"的祖先 y 满足 key[y] > key[x] 且中间无更近的大于者。'},
     {id:'12.2-7',page:320,star:0,statement:'An alternative method of performing an inorder tree walk of an n-node binary search tree finds the minimum element in the tree by calling TREE-MINIMUM and then making n − 1 calls to TREE-SUCCESSOR . Prove that this algorithm runs in Θ(n) time.',hint:'总代价 $\\Theta(n)$：**每条边恰好被向上走一次** —— 摊还 Θ(1) 每次。C 程序 part 9 实测。'},
     {id:'12.2-8',page:320,star:0,statement:'Prove that no matter what node you start at in a height-h binary search tree, k successive calls to TREE-SUCCESSOR take O(k + h) time.',hint:'思路：把走过的路径想成"沿中序序列前进 k 步" —— 重复经过的边只计一次，总边数 ≤ 2k + h（先下降到起点 + k 步上升下降的组合）。'},
     {id:'12.2-9',page:320,star:0,statement:'Let T be a binary search tree whose keys are distinct, let x be a leaf node, and let y be its parent. Show that y: key is either the smallest key in T larger than x: key or the largest key in T smaller than x: key.',hint:'叶子 x 与其父 y 在中序序列里**相邻** —— 用 SUCCESSOR 的情形 2 即可证明。'},
    ]},
  ],
};
