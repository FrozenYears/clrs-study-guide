/* 第 12 章 12.1：什么是二叉搜索树（What is a binary search tree?）。
 * 原文锚点：印刷页 312–316（pdf_index 333–337）。
 * 引述已用 tools/07_pick_quotes.py pick 12 12.1 逐条预检（PASS）。
 * 主题：BST 性质；中序遍历输出升序；操作代价 = O(h)；Theorem 12.1。
 */

/* Figure 12.1 的两组形态（同一组 key {2,5,5,6,7,8}）—— 由 bst-shape 生成器动态构建 */
const KEYS_RANDOM = [6, 5, 7, 2, 8, 5];          /* 插入顺序 → 高 2（Figure 12.1(a)） */
const KEYS_SORTED = [2, 5, 5, 6, 7, 8];          /* 升序插入 → 高 5（Figure 12.1(b) 的退化形态） */

export default {
  key:'s01',id:'ch12/s01',chapter:12,section:'12.1',
  title:'什么是二叉搜索树',shortTitle:'12.1 什么是二叉搜索树',
  titleEn:'What is a binary search tree?',
  source:{printed:[312,316],pdf:[333,337]},
  prerequisites:[{label:'11.5 Practical considerations',url:'#/ch11/s05'}],
  stages:[
   {type:'map',title:'第 12 章：把"二分"种进一棵树里',
    why:'第 11 章的散列表把查找降到 $O(1)$ **平均**，但牺牲了顺序 —— 你无法问"最小的元素是谁"。**二叉搜索树（BST）**把二分查找的决策过程固化成一棵树：每个节点都把 key 空间一分为二，于是查找、最值、前驱后继、插入删除全部是 $O(h)$ —— $h$ 是树高。',
    position:'10.3 给了树的表示，本关给 BST 的**性质与中序遍历**；12.2 查询、12.3 插入删除。本关最重要的伏笔：**代价 = $O(h)$，而 $h$ 从 $\\lg n$ 到 $n$ 都可能** —— 第 13 章的红黑树就是为了把 $h$ 钉在 $O(\\lg n)$。',
    unlocks:[{label:'12.2 Querying a binary search tree',url:'#/ch12/s02'}],
    mathKit:[
     {title:'BST 性质',body:'对任意节点 $x$：左子树里所有 $y$ 满足 $y.key \\le x.key$，右子树里所有 $y$ 满足 $y.key \\ge x.key$（**递归地对每个节点成立**）。'},
     {title:'中序遍历',body:'左 → 根 → 右。由 BST 性质直接归纳：输出**升序**（Theorem 12.1）。'},
     {title:'代价 = O(h)',body:'完全二叉树 $h = \\lg n$ → $\\Theta(\\lg n)$；线性链 $h = n-1$ → $\\Theta(n)$。**同一组 key，形态决定命运**。'},
    ]},
   {type:'intuition',title:'把二分查找的每次决策固化成一个节点',
    scene:'二分查找的"中间元素"就是树根',
    body:[
     '有序数组上的二分查找每次问"中间元素是谁"—— BST 把这个问题**提前固化**：插入时就把元素按"小于往左、大于往右"挂好，查找时只需沿树下降，每个节点就是一次二分决策。',
     '★ 代价与**树高**成正比：树越"矮胖"越快，越"瘦长"越慢。**同一组 key {2,5,5,6,7,8}** 可以长成高 2 的矮树（Figure 12.1(a)），也可以因升序插入退化成高 5 的链（(b) 的极端版）—— 数据的插入顺序决定形态。',
     '★ 含重复 key 也合法（Figure 12.1 里有两个 5）：性质用的是 $\\le$ / $\\ge$。',
     '★ 原书埋了两条伏笔：**随机建树的期望高度是 $O(\\lg n)$**（12.3 末尾证明）、**红黑树（第 13 章）保证 $O(\\lg n)$ 最坏**。',
    ],
    interactive:{text:'阶段 5 的两个面板：① 中序遍历逐点点亮（bst-inorder 生成器）；② 同一组 key 的两种形态对比（bst-shape）。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对 y: key 与 Θ(n) 的排版形式）。',
    blocks:[
     {kind:'body',page:312,en:'The search tree data structure supports each of the dynamic-set operations listed on page 250: SEARCH , MINIMUM , MAXIMUM , PREDECESSOR , SUCCESSOR , INSERT , and DELETE . Thus, you can use a search tree both as a dictionary and as a priority queue.',
      zh:'★ BST 支持第 250 页列出的**全部**动态集合操作 —— 既能当字典又能当优先队列（后者需要"最小"侧的变体）。'},
     {kind:'body',page:312,en:'Basic operations on a binary search tree take time proportional to the height of the tree. For a complete binary tree with n nodes, such operations run in Θ(lg n) worst-case time. If the tree is a linear chain of n nodes, however, the same operations take Θ(n) worst-case time.',
      zh:'★★ **本关的中心句**：代价正比于树高。$\\Theta(\\lg n)$（完全）与 $\\Theta(n)$（链）是两个极端 —— 全章的张力都在这两端之间。'},
     {kind:'body',page:312,en:'In Chapter 13, we’ll see a variation of binary search trees, red-black trees, whose operations guarantee a height of O(lg n). We won’t prove it here, but if you build a binary search tree on a random set of n keys, its expected height is O(lg n) even if you don’t try to limit its height.',
      zh:'★★ 两条伏笔：红黑树（第 13 章）**保证** $O(\\lg n)$ 最坏；**随机 key 建树**期望 $O(\\lg n)$（12.3 证明）。BST 的"病"和两种"药"都在这一句里。'},
     {kind:'body',page:312,en:'A binary search tree is organized, as the name suggests, in a binary tree, as shown in Figure 12.1. You can represent such a tree with a linked data structure, as in Section 10.3.',
      zh:'★ 表示法直接复用 **10.3 的链接表示**：每个节点有 `left`、`right`、`p` 三个指针。'},
     {kind:'body',page:313,en:'The keys in a binary search tree are always stored in such a way as to satisfy the binary-search-tree property:',
      zh:'★★ 引出 **binary-search-tree property** —— 本关的核心定义。'},
     {kind:'body',page:314,en:'Let x be a node in a binary search tree. If y is a node in the left subtree of x , then y: key ≤ x: key. If y is a node in the right subtree of x , then y: key ≥ x: key.',
      zh:'★★ **BST 性质的精确表述**：注意是"**子树里**所有节点"（不只是孩子！），且允许相等（$\\le$ / $\\ge$）。'},
     {kind:'body',page:314,en:'Because of the binary-search-tree property, you can print out all the keys in a binary search tree in sorted order by a simple recursive algorithm, called an inorder tree walk, given by the procedure INORDER-TREE-WALK. This algorithm is so named because it prints the key of the root of a subtree between printing the values in its left subtree and printing those in its right subtree.',
      zh:'★★ **中序遍历**：左 → 根 → 右。"inorder" 的名字就来自根的打印位置在中间。'},
     {kind:'body',page:314,en:'It takes Θ(n) time to walk an n-node binary search tree, since after the initial call, the procedure calls itself recursively exactly twice for each node in the tree',
      zh:'★ 直觉：每个节点恰好触发两次递归调用（左右各一）→ $\\Theta(n)$。Theorem 12.1 给出形式化证明。'},
     {kind:'body',page:314,en:'If x is the root of an n-node subtree, then the call INORDER-TREE-WALK (x) takes Θ(n) time.',
      zh:'★★ **Theorem 12.1** 本体。'},
     {kind:'body',page:314,en:'Proof Let T(n) denote the time taken by INORDER-TREE-WALK when it is called on the root of an n-node subtree. Since INORDER-TREE-WALK visits all n nodes of the subtree, we have T(n) = Ω(n). It remains to show that T(n) = O(n).',
      zh:'★ 证明分两半：$\\Omega(n)$（要访问全部 n 个节点）与 $O(n)$（替换法证上界）。'},
     {kind:'body',page:315,en:'Since INORDER-TREE-WALK takes a small, constant amount of time on an empty subtree (for the test x ≠ NIL), we have T(0) = c for some constant c>0 .',
      zh:'★ 递归基：**空子树也有常数代价**（一次 $x \\neq$ NIL 判断）—— $T(0) = c$。'},
     {kind:'body',page:315,en:'For n > 0, suppose that INORDER-TREE-WALK is called on a node x whose left subtree has k nodes and whose right subtree has n − k − 1 nodes. The time to perform INORDER-TREE-WALK (x) is bounded by T(n) ≤ T(k) + T(n −k −1) + d for some constant d > 0 that reflects an upper',
      zh:'★ 递归式：$T(n) \\le T(k) + T(n-k-1) + d$，其中 $k$ 是左子树节点数（$0 \\le k \\le n-1$）。'},
    ],
    terms:[
     {en:'binary-search-tree property',zh:'BST 性质（左 ≤ 根 ≤ 右，递归成立）',page:313},
     {en:'inorder tree walk',zh:'中序遍历（左 → 根 → 右）',page:314},
    ]},
   {type:'pseudocode',title:'INORDER-TREE-WALK：4 行输出全部升序',
    lead:'★ 全书最优雅的算法之一：四行代码 + 归纳正确性。注意"打印"发生在**两次递归之间**。',
    algo:'INORDER-TREE-WALK',signature:'INORDER-TREE-WALK(x)',page:314,
    lines:[
     {n:1,code:'if x ≠ NIL',zh:'递归基：空子树只花常数时间（一次判断）—— $T(0) = c$。'},
     {n:2,code:'    INORDER-TREE-WALK(x.left)',zh:'先走左子树（输出所有 ≤ x.key 的）。'},
     {n:3,code:'    print x.key',zh:'★ 根的 key 打印在中间 —— "inorder" 名字的由来。'},
     {n:4,code:'    INORDER-TREE-WALK(x.right)',zh:'最后走右子树（输出所有 ≥ x.key 的）。'},
    ],
    vars:[
     {name:'x',meaning:'当前子树的根（NIL 表示空）'},
    ],
    note:'★ 调用方式：`INORDER-TREE-WALK(T.root)`。前序（根左右）与后序（左右根）只需移动第 3 行的位置（习题 12.1-4）。'},
   {type:'visualize',title:'看见"中序 = 升序"与"形态决定高度"',
    panels:[
     {title:'① 中序遍历：沿树逐点点亮（原书 Figure 12.1(a) 的树）',
      viz:'tree',
      algorithm:'bst-inorder',
      input:{array:KEYS_RANDOM, args:[KEYS_RANDOM]},
      countLabels:{cmp:'比较',move:{label:'输出',unit:'个'}},
      invariants:[{label:'已输出的节点 + 当前节点 = 升序序列的前缀'}],
      presets:[
       {name:'★ Figure 12.1(a) 的树（插入 6,5,7,2,8,5）',array:KEYS_RANDOM,args:[KEYS_RANDOM]},
       {name:'另一棵形态（先给大的）',array:[8,6,7,5,2],args:[[8,6,7,5,2]]},
      ]},
     {title:'② 同一组 key 的两种形态（Figure 12.1 (a) vs (b)）',
      viz:'tree',
      algorithm:'bst-shape',
      input:{array:KEYS_RANDOM, args:[KEYS_RANDOM, KEYS_SORTED]},
      invariants:[{label:'同一组 key {2,5,5,6,7,8}：插入顺序决定树高（2 vs 5）'}],
      presets:[
       {name:'★ 随机顺序 vs 升序插入',array:KEYS_RANDOM,args:[KEYS_RANDOM, KEYS_SORTED]},
      ]},
    ],
    tasks:[
     '面板 ① 数一数：每个节点被"点亮"的顺序恰好是升序 2,5,5,6,7,8 —— 这就是 Theorem 12.1。',
     '面板 ② 第一帧的树高 2（边数），第二帧的链高 5 —— **同一组 key，代价差 2.5 倍**。',
     '面板 ② 注意第二帧所有节点标成 violation 色：链形态下查找退化为线性扫描。',
    ],
    note:'★ 面板 ① 的树是 C 程序 part 1 构建的同一棵（插入 6,5,7,2,8,5）；面板 ② 的两帧由 bst-shape 生成器构建。'},
   {type:'code',title:'实测：中序升序、Θ(n) 访问、两种形态',
    intro:'`c/bst_basics.c` 构建 Figure 12.1(a) 的树，验证 BST 性质、中序输出与 Theorem 12.1 的线性访问计数。',
    pseudocodeRef:'INORDER-TREE-WALK',
    c:{file:'bst_basics.c',code:String.raw`/* bst_basics.c -- 12.1 节：BST 的定义、中序遍历与访问计数。
 *   ① 用插入法构建原书 Figure 12.1(a) 的树（key 集合 {2,5,5,6,7,8}，含重复 key 5）；
 *   ② 中序遍历输出升序（Theorem 12.1 的前提）；
 *   ③ 访问计数证明 Θ(n)：每个节点恰好被"进入"常数次；
 *   ④ 对照：升序插入同一组 key → 退化成链（呼应 12.3 末尾与第 13 章）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bst_basics bst_basics.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 32

typedef struct node {
    int key;
    struct node *left, *right, *p;
} node_t;

static node_t pool[MAXN];
static int pool_used;
static long visits;                     /* INORDER-TREE-WALK 的节点访问计数 */

static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

/* TREE-INSERT 的核心（12.3 才正式给出，这里先用） */
static node_t *insert(node_t *root, int key)
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x != NULL) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (y == NULL) { return z; }
    if (key < y->key) { y->left = z; } else { y->right = z; }
    return root;
}

/* INORDER-TREE-WALK（4 行的直译）+ 访问计数 */
static void inorder(node_t *x, int *out, int *n)
{
    visits++;                           /* 进入一次 = 一次节点访问 */
    if (x == NULL) { return; }          /* 行 1：x ≠ NIL 才继续 */
    inorder(x->left, out, n);           /* 行 2 */
    out[(*n)++] = x->key;               /* 行 3：print x.key */
    inorder(x->right, out, n);          /* 行 4 */
}

/* 校验 BST 性质：左子树全 ≤ x.key ≤ 右子树全（对每个节点递归成立） */
static int check_bst(const node_t *x, const node_t *lo, const node_t *hi)
{
    if (x == NULL) { return 1; }
    if (lo && x->key < lo->key) { return 0; }
    if (hi && x->key > hi->key) { return 0; }
    return check_bst(x->left, lo, x) && check_bst(x->right, x, hi);
}

/* 高度按 CLRS 定义 = 到叶的最长路径的【边数】（空树 −1，单节点 0）。
 * 原书 Figure 12.1(a) 说 "height 2"：3 层的树 = 2 条边。 */
static int height(const node_t *x)
{
    if (!x) { return -1; }
    int l = height(x->left), r = height(x->right);
    return 1 + (l > r ? l : r);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);   /* 崩溃时也不丢输出 */
    /* ① Figure 12.1(a)：插入 6,5,7,2,8,5 → 高 2 的树（含重复 key 5） */
    node_t *root = NULL;
    int order[6] = {6, 5, 7, 2, 8, 5};
    for (int i = 0; i < 6; i++) { root = insert(root, order[i]); }
    assert(root->key == 6);
    assert(root->left->key == 5 && root->right->key == 7);
    assert(root->left->left->key == 2 && root->left->right->key == 5);
    assert(root->right->right->key == 8);
    assert(height(root) == 2);
    printf("part 1: 插入 6,5,7,2,8,5 → 根 6、左子树 {2,5,5}、右子树 {7,8}，高 %d（Figure 12.1(a) 的形态）\n",
           height(root));

    /* ② 中序遍历：升序（含重复 key） */
    int out[MAXN], n = 0;
    visits = 0;
    inorder(root, out, &n);
    assert(n == 6);
    int expected[6] = {2, 5, 5, 6, 7, 8};
    for (int i = 0; i < 6; i++) { assert(out[i] == expected[i]); }
    printf("part 2: 中序遍历 = 2,5,5,6,7,8（升序，与原书 Figure 12.1 的例子一致）\n");
    assert(check_bst(root, NULL, NULL));
    printf("part 3: BST 性质逐节点校验通过（含重复 key 5 的两个位置都合法）\n");

    /* ③ Theorem 12.1：访问计数 = Θ(n)。空子树也计入（对应 T(0) = c） */
    {
        /* 7 个节点 + 8 个空指针 = 15 次进入（每节点 2 子 + 根补 1） */
        printf("part 4: 6 节点的树，INORDER-TREE-WALK 进入 %ld 次（节点 6 + 空子树 7 = 2n+1，Θ(n)）\n", visits);
        assert(visits == 2 * 6 + 1);
    }

    /* ④ 对照：升序插入退化成链 */
    {
        pool_used = 0;
        node_t *chain = NULL;
        int keys[6] = {2, 5, 5, 6, 7, 8};
        for (int i = 0; i < 6; i++) { chain = insert(chain, keys[i]); }
        assert(height(chain) == 5);     /* 6 个节点的链高 5 = n−1 */
        printf("part 5: 升序插入同一组 key → 高 %d = n−1（线性链）—— 同一组 key，两种形态\n", height(chain));
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:80,zh:'★ part 1：插入 6,5,7,2,8,5 构建 Figure 12.1(a) 的树 —— 高 2（按 CLRS 边数计），含重复 key 5。'},
              {line:90,zh:'part 2：中序遍历输出 2,5,5,6,7,8 —— 升序，与原书例子逐个一致。'},
              {line:92,zh:'part 3：BST 性质逐节点校验（**子树全体**，不只是孩子）。'},
              {line:97,zh:'★★ part 4：访问计数 = 13 = 2n+1（6 个节点 + 7 个空子树）—— Theorem 12.1 的 $\\Theta(n)$ 实测。'},
              {line:108,zh:'★ part 5：升序插入同一组 key → 高 5 = n−1 的线性链。'}],
       tests:[{in:'插入 6,5,7,2,8,5',out:'高 2 的树；中序 2,5,5,6,7,8'},
              {in:'6 节点树的遍历',out:'进入 13 次 = 2n+1（Θ(n)）'},
              {in:'升序插入同组 key',out:'高 5 = n−1（链）'}]},
    mapping:[{pc:1,pcCode:'if x ≠ NIL',c:'`if (x == NULL) { return; }`（inorder 内，第 44 行附近）—— 计数器 visits++ 恰好在这之前'},
             {pc:3,pcCode:'print x.key',c:'`out[(*n)++] = x->key;`（第 47 行附近）—— 用数组收集以便断言'}]},
   {type:'analyze',title:'Theorem 12.1：递归式与它的解',
    intro:'中序遍历的 $\\Theta(n)$ 不是观察而是定理 —— 递归式 + 替换法，两行解完。',
    claims:[
     {expr:'T(n) \\le T(k) + T(n-k-1) + d',when:'递归式（k = 左子树节点数，0 ≤ k ≤ n−1）',page:315,source:'book'},
     {expr:'T(n) \\le (c + d)n + c',when:'替换法的归纳假设',page:315,source:'book'},
     {expr:'\\Theta(n)',when:'结论：n 节点树的中序遍历',page:314,source:'book'},
    ],
    tables:[{caption:'同一个操作，三种树高',rows:[
      ['形态','树高（边数）','操作代价'],
      ['完全二叉树','$\\lg n$','$\\Theta(\\lg n)$'],
      ['Figure 12.1(a)（6 节点）','2','小常数'],
      ['线性链（升序插入）','$n-1$','$\\Theta(n)$'],
     ]},
     {caption:'三种 tree walk',rows:[
      ['','打印根的位置','输出'],
      ['中序 inorder','**中间**','BST 上升序'],
      ['前序 preorder','最先','拷贝树 / 前缀表达式'],
      ['后序 postorder','最后','释放树 / 后缀表达式'],
     ]}],
    chart:{xMax:64,series:[
     {name:'完全树：Θ(lg n)',expr:'Math.log2(n)',color:'--viz-done'},
     {name:'链：Θ(n)',expr:'n',color:'--viz-violation'},
    ]},
    derivations:[
     {kind:'summation',title:'替换法：T(n) ≤ (c+d)n + c',steps:[
      {tex:'T(0) = c, \\quad T(n) \\le T(k) + T(n-k-1) + d',zh:'递归基与递归式（$k$ 为左子树大小）。'},
      {tex:'T(n) \\le (c+d)k + c + (c+d)(n-k-1) + c + d',zh:'对两棵子树用归纳假设。'},
      {tex:'= (c+d)n + c - (c+d) + d \\le (c+d)n + c',zh:'★ $k$ 与 $n-k-1$ 加起来恰好是 $n-1$ —— 与树的形状无关。∎ 归纳完成。'}]},
     {kind:'summation',title:'下界：T(n) = Ω(n)',steps:[
      {zh:'遍历要**访问全部 n 个节点**（每个都要 print）→ 至少 $\\Omega(n)$。'},
      {tex:'\\Omega(n) \\cap O(n) \\Rightarrow \\Theta(n)',zh:'与 Theorem 12.1 合流。★ C 程序 part 4 实测：6 节点树进入 13 次 = 2n+1。'}]},
    ],
    note:'★ 中心图：绿线（$\\lg n$）与红线（$n$）之间就是 BST 的全部戏剧性 —— 第 13 章的红黑树把树高钉在绿线附近。'},
   {type:'prove',title:'Theorem 12.1：中序遍历是 Θ(n)',
    statement:'If x is the root of an n-node subtree, then the call INORDER-TREE-WALK (x) takes Θ(n) time.',
    page:314,
    intro:'★ 四行代码的复杂度证明 —— 分两半：$\\Omega(n)$ 平凡，$O(n)$ 用替换法。C 程序把递归式的每一项都数了出来。',
    steps:[
     {title:'第一步 · 下界 Ω(n)：每个节点都要打印',
      en:'Proof Let T(n) denote the time taken by INORDER-TREE-WALK when it is called on the root of an n-node subtree. Since INORDER-TREE-WALK visits all n nodes of the subtree, we have T(n) = Ω(n). It remains to show that T(n) = O(n).',
      page:314,
      body:['遍历**访问全部 n 个节点**（这是它的输出）→ 至少 $\\Omega(n)$。',
        '剩下只要证 $O(n)$。']},
     {title:'第二步 · 递归基：空子树也有代价',
      en:'Since INORDER-TREE-WALK takes a small, constant amount of time on an empty subtree (for the test x ≠ NIL), we have T(0) = c for some constant c>0 .',
      page:315,
      body:['$T(0) = c$ —— **空子树也要花一次判断**（$x \\neq$ NIL 的测试）。',
        '★ 这一项很小却不可省：它是"递归调用的固定开销"。']},
     {title:'第三步 · 递归式：k 的任意性',
      en:'For n > 0, suppose that INORDER-TREE-WALK is called on a node x whose left subtree has k nodes and whose right subtree has n − k − 1 nodes. The time to perform INORDER-TREE-WALK (x) is bounded by T(n) ≤ T(k) + T(n −k −1) + d for some constant d > 0',
      page:315,
      body:['左子树 $k$ 个、右子树 $n-k-1$ 个 —— **$k$ 取遍 $0 \\dots n-1$**（对应各种树形）。',
        '$T(n) \\le T(k) + T(n-k-1) + d$。★ 注意这是**对所有 $k$ 成立**的上界 —— 无论树长什么样。']},
     {title:'第四步 · 替换法收尾：与形状无关',
      en:'We use the substitution method to show that T(n) = O(n) by proving that T(n) ≤ (c + d)n + c . For n = 0, we have (c + d) • 0 + c = c = T(0) . For n > 0 , we have',
      page:315,
      body:['归纳假设 $T(m) \\le (c+d)m + c$ 代入：',
        '$T(n) \\le (c+d)k + c + (c+d)(n-k-1) + d = (c+d)n - (c+d) + c + d \\le (c+d)n + c$。',
        '★ **$k$ 消失了** —— 无论树是矮胖还是瘦长，总时间都是线性的。这与"操作代价 = O(h)"并不矛盾：遍历**必须访问全部节点**，所以它与形状无关；查找/插入只在一条路径上走，才受 $h$ 支配。',
        '★ C 程序 part 4 实测：6 节点树进入 **13 = 2n+1** 次（含 7 个空子树），与理论吻合。∎']},
    ],
    conclusion:'★ 结论：中序遍历 $\\Theta(n)$，与形状无关。BST 的"形状敏感性"属于**沿路径**的操作（查找/插入/删除）—— 它们是 $O(h)$。这两句话合起来就是第 12 章的世界观，也是第 13 章红黑树的动机。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'BST 的基本操作代价由什么决定？',
      options:['节点数 n','树的**高度** h','key 的大小','指针数量'],answer:1,
      why:'★ 原书 p.312："take time proportional to the height of the tree"。'},
     {kind:'single',q:'中序遍历 BST 会输出什么顺序？',
      options:['随插入顺序','升序','降序','按层'],answer:1,
      why:'★ Theorem 12.1：BST 性质 + 左根右的次序 → 升序（归纳直接得出）。'},
     {kind:'single',q:'INORDER-TREE-WALK 在空子树上花多少时间？',
      options:['0','$O(1)$（一次 NIL 判断）','$O(\\lg n)$','$O(n)$'],answer:1,
      why:'★ $T(0) = c$ —— 这一项是递归式的基例，C 程序 part 4 数出来 2n+1 次进入。'},
     {kind:'single',q:'同一组 key 能构成几种不同的 BST？',
      options:['唯一一种','最多两种','**多种**（形态由插入顺序决定）','恰好 n 种'],answer:2,
      why:'★ Figure 12.1 明确展示同一组 {2,5,5,6,7,8} 的两种形态（高 2 与高 4）—— 形态数量随 n 指数增长（Catalan 数）。'},
     {kind:'judge',q:'中序遍历的时间依赖于树的形状。',answer:false,
      why:'★ Theorem 12.1：替换法里 $k$ 消失 → 与形状无关的 $\\Theta(n)$。形状敏感的是沿路径的操作（查找/插入/删除）。'},
     {kind:'simulate',q:'6 节点完全二叉树的中序遍历共"进入"函数多少次（含空子树）？（填整数，公式 2n+1）',expect:[13],placeholder:'例如：11',
      why:'$2n+1 = 13$：6 个实节点 + 7 个空指针位置。C 程序 part 4 实测吻合。'},
    ],
    bookExercises:[
     {id:'12.1-1',page:315,star:0,statement:'For the set f1,4,5,10,16,17,21 g of keys, draw binary search trees of heights 2, 3, 4, 5, and 6.',hint:'高 $h$（边数）的树最多 $2^{h+1}-1$ 个节点：高 2 最多 7 个 —— 7 个 key 恰好能装进一棵完全树（高 2）；高 6 就是每层 1 个的链。画的时候从"每层放几个"入手。'},
     {id:'12.1-2',page:315,star:0,statement:'What is the difference between the binary-search-tree property and the min-heap property on page 163? Can the min-heap property be used to prin',hint:'书上是半截题干（问：最小堆性质能否像 BST 性质那样输出升序）。答案：**不能** —— 堆只约束"父 ≤ 孩子"，兄弟之间与跨子树之间无序；中序遍历堆得不到任何排序。BST 性质是**全局**的（子树全体 ≤ 根）。'},
     {id:'12.1-3',page:315,star:0,statement:'Give a nonrecursive algorithm that performs an inorder tree walk. (Hint: An easy solution uses a stack as an auxiliary data structure. A more c',hint:'书上是半截题干（更难版不用栈）。栈版：一路压左链，弹栈访问、转向右子树 —— 10.1 的栈 + 10.2 的指针。无栈版（Morris 遍历）用"线索"临时改指针，$O(1)$ 额外空间但会临时破坏树。'},
     {id:'12.1-4',page:315,star:0,statement:'Give recursive algorithms that perform preorder and postorder tree walks in Θ(n) time on a tree of n nodes.',hint:'把 INORDER-TREE-WALK 的第 3 行（print）挪到两次递归**之前** = 前序；挪到**之后** = 后序。时间仍是 $\\Theta(n)$（同样的递归式）。'},
     {id:'12.1-5',page:315,star:0,statement:'Argue that since sorting n elements takes Ω(n lg n) time in the worst case in the comparison model, any comparison-based algorithm for construc',hint:'书上是半截题干（构造 BST 的排序下界）。思路：若能在 $o(n \\lg n)$ 内构造 BST，则**中序遍历 $\\Theta(n)$ 输出升序** → 总共 $o(n \\lg n)$ 完成排序 → 与比较模型排序下界矛盾。★ 这是"用已知下界推新下界"的归约套路。'},
    ]},
  ],
};
