/* 第 17 章 17.1：动态顺序统计（Dynamic order statistics）。印刷页 480–486（pdf 501–507）。 */
export default {
  key:'s01',id:'ch17/s01',chapter:17,section:'17.1',
  title:'动态顺序统计：给每个结点记 size',shortTitle:'17.1 动态顺序统计',
  titleEn:'Dynamic order statistics',
  source:{printed:[480,486],pdf:[501,507]},
  prerequisites:[{label:'16.4 Dynamic tables',url:'#/ch16/s04'}],
  stages:[
   {type:'map',title:'扩张数据结构的第一课',
    why:'红黑树能做 SEARCH/MIN/MAX 等，但回答"第 i 小的是谁"（SELECT）或"某个键排第几"（RANK）要 O(n)。给每个结点加一个 **size** 域，两个查询都变成 **O(lg n)**。',
    position:'第 V 部分（高级数据结构）开篇。本章的方法论：**扩张 = 选属性 + 维护它 + 证明不拖慢**。本关是完整的第一个例子。',
    unlocks:[{label:'17.2 How to augment a data structure',url:'#/ch17/s02'}],
    mathKit:[
     {title:'size 域',body:'$x.size = x.left.size + x.right.size + 1$（哨兵 size = 0）。'},
     {title:'子树内的秩',body:'$r = x.left.size + 1$：x 在以 x 为根的子树里排第 r。'},
     {title:'复杂度',body:'OS-SELECT 与 OS-RANK 都沿树下降一层一次 → $O(h) = O(\\lg n)$（红黑树）。'},
    ]},
   {type:'intuition',title:'一个 size 域回答两个查询',scene:'Figure 17.1 的顺序统计树',body:[
     '在红黑树每个结点上加一个 $size$：以它为根的子树有多少个结点。插入/删除/旋转时顺手更新 —— 维护代价 $O(1)$ 或摊到操作上。',
     '★ **OS-SELECT(i)**：从根往下走。看左子树：$r = x.left.size + 1$ 就是 x 在本子树的秩 —— $i = r$ 就返回；$i < r$ 去左子树；$i > r$ 去右子树找第 $i - r$ 小。',
     '★ **OS-RANK(x)**：从 x 往上走。x 的秩 = 左子树贡献 + "每一步 y 是右孩子时，把父结点与其左子树的全部结点数加进来"。',
     '★ C 程序把两个方向都跑了往返验证：rank(os_select(k)) == k 对全部 k 成立。',
     '⚠ 记住分工：**SELECT 向下走用减法**（i − r），**RANK 向上走用加法**（r + 左子树 + 1）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 x: left: size 代表 x.left.size）。',blocks:[
     {kind:'body',page:481,en:'Here is how OS-SELECT works. Line 1 computes r , the rank of node x within the subtree rooted at x . The value of x: left: size is the number of nodes that come',
      zh:'★ OS-SELECT 的第 1 行：$r = x.left.size + 1$（后半句接 before x in an inorder walk）。'},
     {kind:'body',page:482,en:'Because each recursive call goes down one level in the order-statistic tree, the total time for OS-SELECT is at worst proportional to the height of the tree. Since the tree is a red-black tree, its height is O(lg n), where n is the number of nodes.',
      zh:'★★ 时间界的论证：每次递归降一层 → O(h) = O(lg n)。'},
     {kind:'body',page:482,en:'Thus, the running time of OS-SELECT is O(lg n) for a dynamic set of n elements.',
      zh:'★ 结论：O(lg n)。'},
     {kind:'body',page:482,en:'Given a pointer to a node x in an order-statistic tree T , the procedure OS-RANK on the facing page returns the position of x in the linear order determined by an inorder tree walk of T .',
      zh:'★ OS-RANK 的目标：x 在中序中的位置。'},
     {kind:'body',page:483,en:'The OS-RANK procedure works as follows. You can think of node x \u2019s rank as the number of nodes preceding x in an inorder tree walk, plus 1 for x itself.',
      zh:'★ RANK 的直觉：排在前面的结点数 + 1。'},
     {kind:'body',page:483,en:'At the start of each iteration of the while loop of lines 3\u20136, r is the rank of x: key in the subtree rooted at node y .',
      zh:'★★ 循环不变量：r 是 x.key 在以 y 为根的子树中的秩 —— 证明从这里开始。'},
    ],terms:[{en:'order-statistic tree',zh:'顺序统计树',page:480},
              {en:'OS-SELECT',zh:'取第 i 小：O(lg n)',page:481},
              {en:'OS-RANK',zh:'求秩：O(lg n)',page:482}]},
   {type:'pseudocode',title:'OS-SELECT：6 行',algo:'OS-SELECT',signature:'OS-SELECT(x, i)',page:482,
    lines:[
     {n:1,code:'r = x.left.size + 1    // rank of x within its subtree',zh:'★ 左子树全部 + 自己。'},
     {n:2,code:'if i == r',zh:''},
     {n:3,code:'    return x',zh:'正好是第 i 小。'},
     {n:4,code:'elseif i < r',zh:''},
     {n:5,code:'    return OS-SELECT(x.left, i)',zh:'第 i 小在左子树里。'},
     {n:6,code:'else return OS-SELECT(x.right, i − r)',zh:'★ 去右子树找第 i − r 小。'}],
    vars:[{name:'i',meaning:'要找的秩（第 i 小）'},{name:'r',meaning:'x 在其子树内的秩'}],
    note:'★ 每次 `i − r` 把"已跳过的左子树 + x 自己"从 i 里扣掉 —— 这是整个算法的心脏。',
    more:[{algo:'OS-RANK',subtitle:'OS-RANK(T, x) —— 7 行向上爬（p.483）',signature:'OS-RANK(T, x)',page:483,
      lines:[{n:1,code:'r = x.left.size + 1',zh:'★ x 在自己子树内的秩。'},
        {n:2,code:'y = x',zh:''},
        {n:3,code:'while y ≠ T.root',zh:''},
        {n:4,code:'    if y == y.p.right',zh:'★ y 是右孩子时：父结点与其左子树都排在 x 前面。'},
        {n:5,code:'        r = r + y.p.left.size + 1',zh:''},
        {n:6,code:'    y = y.p',zh:''},
        {n:7,code:'return r',zh:''}],
      vars:[{name:'y',meaning:'当前检查的祖先'}],
      note:'★ y 是左孩子时不加任何东西 —— 左边的祖先不在 x 前面。'}]},
   {type:'visualize',title:'两个方向的两个查询',panels:[
     {title:'① OS-SELECT(4)：沿树下降（C 程序 part 3 的树）',viz:'tree',vizMode:'tree',
      trees:[{root:{"label": "26 (size 7)", "cost": "i=4，r=2 → 右", "children": [{"label": "20 (size 1)", "cost": "左子树"}, {"label": "38 (size 5)", "cost": "i=2，r=3 → 左", "children": [{"label": "30 (size 2)", "cost": "i=2，r=1 → 右", "children": [{"label": "—"}, {"label": "35 (size 1)", "cost": "r=1，i=1 → 命中 35"}]}, {"label": "41 (size 2)", "cost": "子树 {41,43}"}]}]}}],
      treeNotes:['键集 {20,26,30,35,38,41,43} —— 本关 C 程序按插入序建出来的 7 结点教学树。',
        '★ 它**不是** Figure 17.1 那棵树：图 17.1 有 20 个结点、根是 26(size 20)，左边一整支是 17(size 12)。',
        '★ 本树形状是 C 程序的插入序决定的教学树；SELECT 的思想与树形无关。',
        '★ 第 4 小 = 35：r = 左.size + 1 与 i 比较，决定向左/向右。'],
     },
     {title:'② OS-RANK(35) = 4：沿祖先链向上加',viz:'growth',
      chart:{xMax:8,series:[
       {name:'起点：x 左子树 size + 1',expr:'1',color:'--viz-done'},
       {name:'+ 途经的左侧贡献（累计）',expr:'4',color:'--viz-compare'}]},
      note:'★ C 程序 part 5：OS-RANK(35) = 4（20, 26, 30 之后第 4 小）。'},
    ],tasks:['对照 C 程序 part 3/4：SELECT 与 RANK 互为逆运算。'],note:''},
   {type:'code',title:'实测：rank(os_select(k)) == k',c:{file:'order_statistics.c',code:String.raw`/* order_statistics.c -- 17.1 动态顺序统计：OS-SELECT / OS-RANK。
 * 用普通 BST 演示 size 域的维护与两个查询（平衡性由红黑树保证，本程序聚焦"扩张"本身）。
 * 关键数字：OS-SELECT / OS-RANK 的递归/循环都沿树下降一层 -> O(h)；
 *           rank(os_select(k)) == k 往返一致（C 程序逐个验证）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NN 32

typedef struct node {
    int key;
    int size;                 /* ★ 扩张的属性：以本结点为根的子树结点数 */
    struct node *left, *right, *p;
} node_t;

static node_t pool[NN];
static int pool_n;
static node_t *root;

/* BST 插入（简化：不含旋转；size 由 step 2 维护） */
static node_t *bst_insert(int key)
{
    node_t *y = NULL, *x = root;
    while (x) { y = x; x = (key < x->key) ? x->left : x->right; }
    node_t *z = &pool[pool_n++];
    memset(z, 0, sizeof(*z));
    z->key = key; z->size = 1; z->p = y;
    if (!y) { root = z; }
    else if (key < y->key) { y->left = z; }
    else { y->right = z; }
    /* 步骤 4：沿祖先链更新 size —— O(h) */
    node_t *a = z->p;
    while (a) { a->size++; a = a->p; }
    return z;
}

/* OS-SELECT（6 行直译）：返回以 x 为根的子树中第 i 小的结点 */
static node_t *os_select(node_t *x, int i)
{
    int r = (x->left ? x->left->size : 0) + 1;      /* 行 1 */
    if (i == r) { return x; }                        /* 行 2–3 */
    else if (i < r) { return os_select(x->left, i); }/* 行 4–5 */
    else { return os_select(x->right, i - r); }      /* 行 6 */
}

/* OS-RANK（7 行直译）：返回 x 在整棵树中的秩 */
static int os_rank(node_t *x)
{
    int r = (x->left ? x->left->size : 0) + 1;       /* 行 1 */
    node_t *y = x;                                   /* 行 2 */
    while (y != root) {                              /* 行 3 */
        if (y == y->p->right) {                      /* 行 4 */
            r += (y->p->left ? y->p->left->size : 0) + 1;   /* 行 5 */
        }
        y = y->p;                                    /* 行 6 */
    }
    return r;                                        /* 行 7 */
}

/* 验证：size 属性 = 1 + 左 size + 右 size（递归） */
static int check_size(node_t *x)
{
    if (!x) { return 0; }
    int ls = check_size(x->left);
    int rs = check_size(x->right);
    assert(x->size == 1 + ls + rs);
    return x->size;
}

/* 中序收集（用于对照） */
static int inorder[NN], in_n;
static void walk(node_t *x)
{
    if (!x) { return; }
    walk(x->left);
    inorder[in_n++] = x->key;
    walk(x->right);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 建树：按层序给出的键，得到一棵平衡 BST（对应 Figure 17.1 的键集） */
    static const int keys[] = {26, 38, 30, 41, 20, 35, 43};
    int n = (int)(sizeof(keys) / sizeof(keys[0]));
    node_t *nodes[NN];
    for (int i = 0; i < n; i++) { nodes[i] = bst_insert(keys[i]); }

    printf("part 1: 插入 %d 个键后，根的 size = %d（应为 %d）\n", n, root->size, n);
    assert(root->size == n);
    assert(check_size(root) == n);
    printf("        递归校验：每个结点 size == 1 + left.size + right.size ✓\n");

    in_n = 0;
    walk(root);
    printf("part 2: 中序 = ");
    for (int i = 0; i < in_n; i++) { printf("%d%s", inorder[i], i + 1 < in_n ? ", " : "\n"); }

    /* OS-SELECT：第 k 小 */
    printf("part 3: OS-SELECT 逐个取第 k 小：");
    for (int k = 1; k <= n; k++) {
        node_t *x = os_select(root, k);
        printf("%d%s", x->key, k < n ? ", " : "\n");
        assert(x->key == inorder[k - 1]);
    }
    printf("        与中序逐位一致 —— OS-SELECT 正确\n");

    /* OS-RANK：往返一致 rank(os_select(k)) == k */
    printf("part 4: OS-RANK 往返验证：");
    for (int k = 1; k <= n; k++) {
        node_t *x = os_select(root, k);
        int r = os_rank(x);
        printf("%d%s", r, k < n ? ", " : "\n");
        assert(r == k);
    }
    printf("        rank(os_select(k)) == k 对全部 k 成立\n");

    /* 单步演示：OS-RANK(nodes[35]) 沿祖先链的三步（对应原书 p.484 的手工过程） */
    {
        node_t *x = nodes[5];            /* key 35 */
        int r = os_rank(x);
        printf("part 5: OS-RANK(key=35) = %d（20,26,30 之后第 4 小；沿祖先链累加左侧子树贡献）\n", r);
        assert(r == 4);
        printf("        途中每个 y==y.p.right 的步子把 y.p 的左子树 size + 1 加进 r。\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明关键数字与往返验证。'},
           {line:13,zh:'`size` 域：扩张的全部 —— 其余代码与普通 BST 相同。'},
           {line:31,zh:'★ 步骤 4 的维护：插入后沿祖先链 size++（O(h)）。'},
           {line:39,zh:'`os_select`：6 行直译；第 1 行 r = 左.size + 1。'},
           {line:48,zh:'`os_rank`：7 行直译；y 是右孩子时加父的左子树 + 1。'},
           {line:62,zh:'`check_size`：递归校验 size = 1 + left.size + right.size。'},
           {line:110,zh:'★★ part 3/4：SELECT 输出与中序一致；rank(os_select(k)) == k 全部成立。'},
           {line:118,zh:'★ part 5：OS-RANK(35) = 4。'}]},
    tests:[{in:'插入 {26,38,30,41,20,35,43}',out:'根 size = 7；中序 20..43'},
           {in:'OS-SELECT(k)，k = 1..7',out:'20, 26, 30, 35, 38, 41, 43（与中序一致）'},
           {in:'OS-RANK 往返',out:'rank(os_select(k)) == k 全部成立；OS-RANK(35) = 4'}],
    mapping:[{pc:1,pcCode:'r = x.left.size + 1',c:'`int r = (x->left ? x->left->size : 0) + 1;`（第 41 行）'},
             {pc:5,pcCode:'r = r + y.p.left.size + 1',c:'`r += (y->p->left ? y->p->left->size : 0) + 1;`（第 54 行）'}]},
   {type:'analyze',title:'一本账：一个域撑起两个 O(lg n)',claims:[
     {expr:'O(\\lg n)',when:'OS-SELECT 的运行时间（每次递归降一层）',page:482,source:'book'},
     {expr:'O(\\lg n)',when:'OS-RANK 的运行时间（while 沿祖先链）',page:483,source:'book'},
     {expr:'O(1)',when:'旋转后更新 size 的代价（两三个结点各重算一次）',page:488,preview:true,source:'book'},
    ],tables:[{caption:'SELECT 与 RANK 的镜像关系',rows:[
      ['','OS-SELECT','OS-RANK'],
      ['方向','自根**向下**','自 x**向上**'],
      ['算术','i − r（减去跳过的）','r + 左子树 + 1（加上排前面的）'],
      ['不变量','第 i 小在当前子树中','r 是 x 在以 y 为根子树中的秩'],
      ['C 程序','part 3（与中序对照）','part 4（往返 == k）'],
     ]},{caption:'size 域的维护点（插入/删除/旋转都要照顾）',rows:[
      ['操作','维护动作','代价'],
      ['插入新结点','沿祖先链各 +1','$O(h)$'],
      ['删除','沿祖先链各 −1','$O(h)$'],
      ['旋转','重算 y 与 x 两个结点的 size','$O(1)$'],
     ]}],chart:{xMax:64,series:[
     {name:'SELECT/RANK：O(lg n)',expr:'Math.log2(n)',color:'--viz-done'},
     {name:'无 size 域时中序数数：O(n)',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'OS-RANK 的不变量',steps:[
      {zh:'不变量（原书 p.483）：每次 while 迭代开始时，r 是 x.key 在以 y 为根的子树中的秩。'},
      {zh:'若 y 是**右**孩子，则以 y.p 为根的子树里排在 x 前面的还有：y.p 自己 + y.p 的左子树全部。'},
      {tex:'r = r + y.p.left.size + 1',zh:'★ 若 y 是左孩子，y.p 的子树里没有谁排在 x 前面 —— 不加。C 程序 part 5 的 4 就是这么加出来的。'}]},
     ],
    note:''},
   {type:'prove',title:'OS-RANK 正确性：循环不变量',statement:'At the start of each iteration of the while loop of lines 3\u20136, r is the rank of x: key in the subtree rooted at node y .',page:483,
    intro:'★ 用循环不变量证明 OS-RANK —— 这是原书给足证明细节的一段。',
    steps:[
     {title:'初始化',en:'The OS-RANK procedure works as follows. You can think of node x \u2019s rank as the number of nodes preceding x in an inorder tree walk, plus 1 for x itself.',page:483,
      body:['循环开始前 y = x、$r = x.left.size + 1$ —— 正是 x 在以 x 为根的子树中的秩。不变量成立。']},
     {title:'保持：三种情形',en:'Here is how OS-SELECT works. Line 1 computes r , the rank of node x within the subtree rooted at x .',page:481,
      body:['设不变量在迭代开始时成立（r 是 x 在 y 子树中的秩），考虑 y → y.p 这一步：',
        '**y 是左孩子**：y.p 子树中排在 x 前面的结点与 y 子树中相同 —— r 不变。',
        '**y 是右孩子**：y.p 自己与 y.p 的左子树全部排在 x 前面 → $r = r + y.p.left.size + 1$。',
        '两种情形都把"以 y.p 为根的子树"换成"以 y 为根的子树"，不变量保持。∎']},
     {title:'终止',en:'Thus, the running time of OS-SELECT is O(lg n) for a dynamic set of n elements.',page:482,
      body:['y 到达 T.root 时，不变量说 r 是 x.key 在整棵树中的秩 —— 即中序位置。',
        '★ 实测：C 程序 part 4 对全部 7 个结点验证 rank(os_select(k)) == k。',
        '★ 运行时间：while 至多 h 次，每次 O(1) → O(lg n)。∎']},
    ],conclusion:'★ 结论：size 域 + 两个沿树行走的查询 = 动态顺序统计；SELECT/RANK 互逆（C 程序往返验证）。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'顺序统计树的 size 域存什么？',options:['结点在原树中的深度，用来算路径长度','**以该结点为根的子树的结点数**','该结点在中序序列里的秩，即它是第几小','子树高度'],answer:1,
      why:'★ x.size = x.left.size + x.right.size + 1。'},
     {kind:'single',q:'OS-SELECT 在 i > r 时怎么走？',options:['去左子树找第 i 小','去右子树找第 i − r 小','去右子树找第 r 小','回退到父结点'],answer:1,
      why:'★ 左子树的 r − 1 个结点与 x 自己都被跳过，所以剩余名次是 i − r。'},
     {kind:'judge',q:'OS-RANK 中 y 是左孩子时也要把 y.p 的左子树 size 加进 r。',answer:false,
      why:'★ y 是左孩子说明 y.p 及其左子树都在 x 的"右边"，不排在 x 前面 —— 只加 y 为右孩子的那些步。'},
     {kind:'judge',q:'旋转之后 size 域可以在 O(1) 时间内更新。',answer:true,
      why:'★ 只有被旋转的两个结点的子树成员变了，各重算一次 size 即可（原书 p.488）。'},
     {kind:'simulate',q:'C 程序的键集 {20,26,30,35,38,41,43} 中，OS-SELECT(4) 返回的键是多少？（填数字）',expect:[35],placeholder:'例如：38',
      why:'第 4 小 = 35（C 程序 part 3 输出）。'},
     {kind:'simulate',q:'key = 35 的 OS-RANK 是多少？（填数字）',expect:[4],placeholder:'例如：5',
      why:'20, 26, 30 之后第 4 小 → 秩 4（C 程序 part 5）。'},
    ],bookExercises:[
     {id:'17.1-1',page:485,star:0,statement:'Show how OS-SELECT (T:root ,10) operates on the red-black tree T shown in Figure 17.1.',hint:'照 OS-SELECT 的三步走：每到一个结点算 r = 左.size + 1，与 i 比较后向左/向右，i 不断被减去跳过的结点数。把每层的 (x, i) 写成表格。'},
     {id:'17.1-2',page:485,star:0,statement:'Show how OS-RANK(T,x) operates on the red-black tree T shown in Figure 17.1 and the node x with x:key = 35.',hint:'题干点名**在 Figure 17.1 上走一遍**，别拿本关 C 程序那棵 7 结点树来答（那棵树上 OS-RANK(35) = 4，图 17.1 上是另一个数）。 图 17.1 里 key 35 的祖先链是 35(size 1) → 38(size 3) → 30(size 5) → 41(size 7) → 26(size 20，根)。按 7 行伪代码逐步走： 起手 $r$ = 35 的左子树 size + 1 = 1； $y = 35$ 是左孩子 $\\to$ 不加； $y = 38$ 是 30 的右孩子 $\\to$ 加上「30 的左子树 size + 1」= 1 + 1 = 2，$r = 3$； $y = 30$ 是 41 的左孩子 $\\to$ 不加； $y = 41$ 是 26 的右孩子 $\\to$ 加上「26 的左子树 size + 1」= 12 + 1 = 13，$r = 16$； $y$ 到根，循环结束，**返回 16**。 自查办法（不用重新数中序）：原书 p.484 自己算了 key 38 的秩是 17， 而 35 正是 38 的左孩子、自己又没有孩子，所以 35 的秩 = 17 − 1 = 16，两条路对得上。'},
     {id:'17.1-3',page:485,star:0,statement:'Write a nonrecursive version of OS-SELECT .',hint:'OS-SELECT 的递归调用在函数末尾，直接换成 while：每轮先算当前子树里的秩 $r = x.\\text{left}.size + 1$；$i == r$ 返回 $x$；$i < r$ 只换 $x \\leftarrow x.\\text{left}$；$i > r$ 走右并把这个数减掉：$i \\leftarrow i - r$、$x \\leftarrow x.\\text{right}$。★ 一进循环就要把 $i$ 读成「在**当前子树**里第几小」，不是全局秩 —— 这是改写时最容易漏的一步。终止性也顺手说明：每轮 $x$ 严格下降一层，循环至多跑树高次，红黑树里就是 $O(\\lg n)$。'},
     {id:'17.1-4',page:485,star:0,statement:'Write a procedure OS-KEY-RANK(T,k) that takes an order-statistic tree T and a key k and returns the rank of k in the dynamic set represented by T . Assume that the keys of T are distinct.',hint:'两段，各 $O(h)$，$h = O(\\lg n)$ 由红黑树的性质 5 给出：① 照 TREE-SEARCH 沿树下降找到 key 为 $k$ 的结点 $x$（题干保证键互异，所以唯一）；② 对它调用 OS-RANK$(T, x)$（本关阶段 4 那段：往左上回时累加「左子树大小 + 1」）。★ 想省一次下降：把 OS-RANK 的累加嵌进查找循环里 —— 一路往右时把「$x$ 的左子树大小 $+ 1$」记进答案，找到 $x$ 时手上就是它的秩。两种写法都要说明为什么秩的定义「比 $k$ 小的键数 $+ 1$」正好等于结果。'},
     {id:'17.1-5',page:486,star:0,statement:'Given an element x in an n-node order-statistic tree and a natural number i , show how to determine the i th successor of x in the linear order of the tree in O(lg n) time.',hint:'第 i 个后继 = OS-SELECT(OS-RANK(x) + i)。两个 O(lg n) 拼起来仍是 O(lg n) —— 顺序统计树的组合能力。'},
     {id:'17.1-6',page:486,star:0,statement:'The procedures OS-SELECT and OS-RANK use the size attribute of a node only to compute a rank. Suppose that you store in each node its rank in the subtree of which it is the root instead of the size attribute. Show how to maintain this information during insertion and deletion. (Remembe r that these two operations can cause rotations.)',hint:'题干本身就要求「**给出维护方法**」，所以结论不能是「做不到」。 把秩存进结点（$\\text{rank}(x) = x$ 在自己子树里的名次）后，插入或删除改变的只是 **从插入/删除点到根这条路径上**那些「新元素落在其左子树」的结点：沿路径自底向上， 每遇到一个「左子树那边发生了变化」的祖先把它的秩 $+1$（删除时 $-1$）—— 一共 $O(\\lg n)$ 个结点。 旋转处只需 $O(1)$ 重算，但左旋与右旋要分开写：左旋时 $y$ 升成子树根、它的左子树换成整棵 $x$，新秩满足 $\\text{rank}_{\\text{新}}(y) = \\text{rank}_{\\text{旧}}(x) + \\text{rank}_{\\text{旧}}(y)$（$x$ 的左子树没动，它的秩不变）。右旋正好反过来：升上去的那个结点左子树没变、秩不变，降下来的 $z$ 要按它**新的**左子树（原来那个结点的右子树）重算 $+1$。两条都可以拿随机树几行代码跑一遍验证 —— 别凭手感改。'},
     {id:'17.1-7',page:486,star:0,statement:'Show how to use an order-statistic tree to count the number of inversions (see Problem 2-4 on page 47) in an array of n distinct elements in O(n lg n) time.',hint:'从左到右扫描数组：把 $A[i]$ **先插入**树里，再用 OS-RANK 查它在已出现元素中的秩 $r$（$r - 1$ 就是「前面比它小的个数」），本元素带来的逆序数 $= i - r$，累加。顺序不能反：结点还没进树时 OS-RANK 无从谈起。每个元素一次插入一次查秩，都是 $O(\\lg n)$，总计 $O(n\\lg n)$。'},
    ]},
  ],
};
