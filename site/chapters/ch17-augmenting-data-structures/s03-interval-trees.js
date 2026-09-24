/* 第 17 章 17.3：区间树（Interval trees）。印刷页 489–497（pdf 510–518）。 */
export default {
  key:'s03',id:'ch17/s03',chapter:17,section:'17.3',
  title:'区间树：max 域与一次下降的查询',shortTitle:'17.3 区间树',
  titleEn:'Interval trees',
  source:{printed:[489,497],pdf:[510,518]},
  prerequisites:[{label:'17.2 How to augment a data structure',url:'#/ch17/s02'}],
  stages:[
   {type:'map',title:'四步法的第二个完整应用',
    why:'给定一组闭区间，支持"找出与查询区间 i 重叠的任一区间"。普通 BST 以 low 为键最坏 O(n)；给每个结点加 **max**（子树最大右端点），INTERVAL-SEARCH 一次下降 **O(lg n)**。',
    position:'17.2 四步法的实战演练：② 的属性是 max、③ 的维护与 size 完全同型、④ 的新操作是 INTERVAL-SEARCH。本关之后第 V 部分进入 B 树。',
    unlocks:[{label:'18.1 Definition of B-trees',url:'#/ch18/s01'}],
    mathKit:[
     {title:'重叠',body:'闭区间 $i$ 与 $i^{\\prime}$ 重叠 $\\iff$ $i.low \\le i^{\\prime}.high$ 且 $i^{\\prime}.low \\le i.high$。'},
     {title:'max 域',body:'$x.max = \\max(x.it.high,\\, x.left.max,\\, x.right.max)$ —— 半群合成，定理 17.1 适用。'},
     {title:'查询',body:'INTERVAL-SEARCH 沿单条路径下降 → $O(\\lg n)$。'},
    ]},
   {type:'intuition',title:'max 告诉你"左边还值不值得找"',scene:'Figure 17.4 的 9 个区间',body:[
     '以 low 为键的红黑树，每个结点存 $max$ = 子树里所有区间的最大右端点。C 程序 part 1：插入 Figure 17.4 的 9 个区间后，根的 max = 30（来自 [25,30]）。',
     '★ 查询 [14,14] 时在结点 x 处的决策：**左子树的 max ≥ i.low 吗？** 若不是，左子树里任何区间的右端点都 < i.low，加上 low 有序，它们全都整体落在 i 的左边 —— 直接去右子树。',
     '★ 若左子树 max ≥ i.low：要么左子树里真有重叠，要么左子树全在 i 左边 —— 两种情形去左子树都不会漏。',
     '★ C 程序 part 4 把 20 个查询与暴力枚举逐次对照：命中 15 次、nil 5 次，完全一致 —— 有重叠必命中、无重叠必 nil。',
     '⚠ INTERVAL-SEARCH 只保证返回**某一个**重叠区间（不保证 low 最小 —— 那是习题 17.3-2）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 i \ i 0 ≠ ,, 代表 i ∩ i′ ≠ ∅）。',blocks:[
     {kind:'body',page:489,en:'A simple way to represent an interval [t 1 ,t 2 ] is as an object i with attributes i: low = t 1 (the low endpoint) and i: high = t 2 (the high endpoint). We say that in- tervals i and i 0 overlap if i \ i 0 \u2260 ,, that is, if i: low \u2264 i 0 : high and i 0 : low \u2264 i: high.',
      zh:'★★ 区间表示与重叠的定义（语料把交集符号抽成了 \\ 和 ,,）。'},
     {kind:'body',page:490,en:'As Figure 17.3 shows, any two intervals i and i 0 satisfy the interval trichotomy, that is, exactly one of the following three properties holds: a. i and i 0 overlap, b. i is to the left of i 0 (i.e., i: high <i 0 : low), c. i is to the right of i 0 (i.e., i 0 : high <i: low).',
      zh:'★ 区间三分律：重叠 / 在左 / 在右，三者恰居其一。'},
     {kind:'body',page:490,en:'An interval tree is a red-black tree that maintains a dynamic set of elements, with each element x containing an interval x: int. Interval trees support the following operations:',
      zh:'★ 区间树 = 红黑树 + 区间元素（三操作随后列出）。'},
     {kind:'body',page:490,en:'INTERVAL-SEARCH (T,i) returns a pointer to an element x in the interval tree T such that x: int overlaps interval i , or a pointer to the sentinel T: nil if no such element belongs to the set.',
      zh:'★★ 新操作：找一个重叠区间；找不到返回哨兵。'},
     {kind:'body',page:491,en:'(b) The interval tree that represents them. Each node x contains an interval, shown above the dashed line, and the maximum value of any interval endpoint in the subtree rooted at x, shown below the dashed line. An inorder tree walk of the tree lists the nodes in sorted order by left endpoint.',
      zh:'★★ max 域：子树中最大端点；中序按 low 排序。'},
    ],terms:[{en:'interval tree',zh:'区间树',page:490},
              {en:'INTERVAL-SEARCH',zh:'找重叠区间：O(lg n)',page:490},
              {en:'interval trichotomy',zh:'区间三分律',page:490}]},
   {type:'pseudocode',title:'INTERVAL-SEARCH：6 行',algo:'INTERVAL-SEARCH',signature:'INTERVAL-SEARCH(T, i)',page:492,
    lines:[
     {n:1,code:'x = T.root',zh:''},
     {n:2,code:'while x ≠ T.nil and i does not overlap x.int',zh:'★ 命中或走到哨兵为止。'},
     {n:3,code:'    if x.left ≠ T.nil and x.left.max ≥ i.low',zh:'★★ 左子树存在右端点 ≥ i.low 的区间。'},
     {n:4,code:'        x = x.left    // overlap in left subtree or no overlap in right subtree',zh:'两种情形都不会漏。'},
     {n:5,code:'    else x = x.right    // no overlap in left subtree',zh:''},
     {n:6,code:'return x',zh:''}],
    vars:[{name:'i',meaning:'查询区间'},{name:'x.max',meaning:'子树最大右端点'}],
    note:'★ 第 3 行是整棵数据结构存在的理由：没有 max，就只能整树扫描。',
    more:[]},
   {type:'visualize',title:'两次查询的实际走向',panels:[
     {title:'① Figure 17.4 的 9 个区间构成的树（C 程序的插入序）',viz:'tree',vizMode:'tree',
      trees:[{root:{label:'[0,3]',cost:'max 30',children:[{label:'—'},{label:'[5,8]',cost:'max 30',children:[{label:'—'},{label:'[6,10]',cost:'max 30',children:[{label:'—'},{label:'[8,9]',cost:'max 30',children:[{label:'—'},{label:'[15,23]',cost:'max 30',children:[{label:'—'},{label:'[16,21]',cost:'max 30',children:[{label:'—'},{label:'[17,19]',cost:'max 30',children:[{label:'—'},{label:'[19,20]',cost:'max 30',children:[{label:'—'},{label:'[25,30]',cost:'max 30'}]}]}]}]}]}]}]}]}}],
      treeNotes:['★ 结点里是区间 [low,high]，下方是子树 max（Figure 17.4(b) 的数据）。',
        '根的 max = 30 来自 [25,30]；左子树 max = 21 来自 [15,23] / [16,21]。',
        '★ 本树按 C 程序插入序画出（low 为键）；平衡性由红黑树保证。'],
     },
     {title:'② 查询结果：命中 15 次 / 正确 nil 5 次（C 程序 part 4）',viz:'growth',
      chart:{xMax:24,series:[
       {name:'查询 [a,a+1] 命中数',expr:'15',color:'--viz-done'},
       {name:'正确返回 nil 的次数',expr:'5',color:'--viz-compare'}]},
      note:'★ 20 个查询与暴力枚举逐次一致 —— 独立验证正确性。'},
    ],tasks:['对照 C 程序 part 3：[14,14] 正确返回 nil；[9,11] 命中 [6,10]。'],note:''},
   {type:'code',title:'实测：max 不变量与枚举对照',c:{file:'interval_tree.c',code:String.raw`/* interval_tree.c -- 17.3 区间树：以 low 为键、维护 max 域，INTERVAL-SEARCH。
 * 关键数字：max(x) = max(x.high, left.max, right.max)（递归校验）；
 *           对 9 个区间做枚举查询：有重叠必命中、无重叠必返回 nil（与暴力对照一致）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define NN 16

typedef struct {
    int low, high;            /* 区间 [low, high]（闭区间） */
} interval_t;

typedef struct node {
    interval_t it;
    int max;                  /* ★ 扩张属性：子树中所有区间的最大右端点 */
    struct node *left, *right, *p;
} node_t;

static node_t pool[NN];
static int pool_n;
static node_t *root;

static void update_max(node_t *x)
{
    int m = x->it.high;
    if (x->left && x->left->max > m) { m = x->left->max; }
    if (x->right && x->right->max > m) { m = x->right->max; }
    x->max = m;
}

static node_t *it_insert(interval_t iv)
{
    node_t *y = NULL, *x = root;
    while (x) { y = x; x = (iv.low < x->it.low) ? x->left : x->right; }
    node_t *z = &pool[pool_n++];
    memset(z, 0, sizeof(*z));
    z->it = iv; z->max = iv.high; z->left = z->right = NULL; z->p = y;
    if (!y) { root = z; }
    else if (iv.low < y->it.low) { y->left = z; }
    else { y->right = z; }
    node_t *a = z;
    while (a) { update_max(a); a = a->p; }    /* 沿祖先链更新 max —— O(h) */
    return z;
}

static int overlaps(interval_t a, interval_t b)
{
    return a.low <= b.high && b.low <= a.high;
}

/* INTERVAL-SEARCH（6 行直译） */
static node_t *interval_search(interval_t i)
{
    node_t *x = root;
    while (x && !overlaps(i, x->it)) {
        if (x->left && x->left->max >= i.low) {
            x = x->left;                 /* 左子树里有潜在重叠 */
        }
        else { x = x->right; }           /* 左子树不可能重叠 */
    }
    return x;
}

/* 递归校验 max 不变量 */
static int check_max(node_t *x)
{
    if (!x) { return 0; }
    int lm = check_max(x->left);
    int rm = check_max(x->right);
    int expect = x->it.high;
    if (lm > expect) { expect = lm; }
    if (rm > expect) { expect = rm; }
    assert(x->max == expect);
    return x->max;
}

/* 暴力对照：是否存在任何区间与 i 重叠 */
static int brute_overlaps(interval_t i, const interval_t *ivs, int n)
{
    for (int j = 0; j < n; j++) {
        if (overlaps(i, ivs[j])) { return 1; }
    }
    return 0;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* Figure 17.4 的 9 个区间 */
    static const interval_t ivs[NN] = {
        {0, 3}, {5, 8}, {6, 10}, {8, 9}, {15, 23},
        {16, 21}, {17, 19}, {19, 20}, {25, 30},
    };
    int n = 9;
    for (int j = 0; j < n; j++) { it_insert(ivs[j]); }

    printf("part 1: 插入 %d 个区间后，max 不变量：", n);
    assert(check_max(root) == 30);
    printf("根.max = %d（= 30，[25,30] 的右端点）✓\n", root->max);

    printf("part 2: 中序（按 low 排序）：");
    {
        node_t *stk[NN]; int sp = 0, cnt = 0;
        node_t *x = root;
        while (x || sp) {
            while (x) { stk[sp++] = x; x = x->left; }
            x = stk[--sp];
            printf("[%d,%d] ", x->it.low, x->it.high);
            cnt++;
            x = x->right;
        }
        printf("（%d 个）\n", cnt);
        assert(cnt == n);
    }

    /* part 3：单步查询 */
    {
        interval_t q = {14, 14};
        node_t *r = interval_search(q);
        printf("part 3: 查询 [14,14] -> %s", r ? "" : "nil\n");
        if (r) {
            printf("[%d,%d]\n", r->it.low, r->it.high);
            assert(overlaps(q, r->it));
        }
        assert(r == NULL);   /* [14,14] 与 9 个区间都不相交 */
        printf("        [14,14] 与任何区间都不相交 -> 正确返回 nil\n");
    }
    {
        interval_t q = {9, 11};
        node_t *r = interval_search(q);
        printf("        查询 [9,11] -> ");
        if (r) {
            printf("[%d,%d]", r->it.low, r->it.high);
            assert(overlaps(q, r->it));
            printf("（有重叠：9 <= %d 且 %d <= 11）\n", r->it.high, r->it.low);
        } else {
            printf("nil\n");
            assert(0);
        }
    }

    /* part 4：枚举查询 —— 有重叠必命中、无重叠必 nil（与暴力对照逐次一致） */
    {
        int hits = 0, queries = 0;
        for (int a = 0; a < 40; a += 2) {
            interval_t q = {a, a + 1};
            node_t *r = interval_search(q);
            int expect = brute_overlaps(q, ivs, n);
            int got = (r != NULL);
            if (got) {
                hits++;
                assert(overlaps(q, r->it));
            }
            assert(got == expect);
            queries++;
        }
        printf("part 4: 查询 [a,a+1]，a = 0,2,...,38 共 %d 次：命中 %d 次，其余正确返回 nil\n",
               queries, hits);
        printf("        与暴力枚举逐次一致 —— INTERVAL-SEARCH 的正确性得到独立验证\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明两组关键数字（max=30；命中 15/nil 5）。'},
           {line:16,zh:'`max` 域：扩张属性 —— 与 size 同型的半群合成。'},
           {line:24,zh:'★ 插入后沿祖先链 update_max（O(h)）—— 步骤 ③。'},
           {line:53,zh:'`interval_search`：6 行直译；第 3 行 max ≥ i.low 的分岔。'},
           {line:66,zh:'`check_max`：递归校验 max = max(high, left.max, right.max)。'},
           {line:79,zh:'`brute_overlaps`：暴力对照 —— 独立验证的基准。'},
           {line:80,zh:'★★ part 1：根 max = 30（来自 [25,30]）。'},
           {line:118,zh:'★★ part 4：20 个查询与暴力枚举逐次一致（命中 15、nil 5）。'}]},
    tests:[{in:'Figure 17.4 的 9 个区间',out:'根 max = 30；中序按 low 排序'},
           {in:'查询 [14,14]',out:'nil（与所有区间不相交）'},
           {in:'20 个枚举查询',out:'命中 15 次全部真重叠；nil 5 次全部真无重叠'}],
    mapping:[{pc:3,pcCode:'x.left.max ≥ i.low',c:'`if (x->left && x->left->max >= i.low)`（第 40 行）'},
             {pc:4,pcCode:'x = x.left',c:'`x = x->left;`（第 58 行）'}]},
   {type:'analyze',title:'一本账：max 的信息量',claims:[
     {expr:'O(\\lg n)',when:'INTERVAL-SEARCH（单条下降路径）',page:492,source:'book'},
     {expr:'O(1)',when:'旋转后更新 max（定理 17.1 的推论）',page:495,source:'book'},
     {expr:'O(\\min(n, k\\lg n))',when:'列出全部 k 个重叠区间（习题 17.3-3）',page:495,source:'book'},
    ],tables:[{caption:'max 域的决策表（第 3 行）',rows:[
      ['左子树 max','含义','去向'],
      ['≥ i.low','左子树可能藏着重叠区间','**去左**（不漏）'],
      ['< i.low','左子树全部区间整体在 i 左边','去右（左必无重叠）'],
     ]},{caption:'四步法在区间树上的落位',rows:[
      ['步骤','内容','C 程序对应'],
      ['① 基础结构','红黑树（本程序用 low 键的 BST 演示）','it_insert'],
      ['② 属性','max = max(high, left.max, right.max)','update_max / check_max'],
      ['③ 维护','插入沿祖先链；旋转 O(1)','第 24 行'],
      ['④ 新操作','INTERVAL-SEARCH','interval_search'],
     ]}],chart:{xMax:64,series:[
     {name:'INTERVAL-SEARCH：lg n',expr:'Math.log2(n)',color:'--viz-done'},
     {name:'无 max 域的全扫：n',expr:'n',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'为什么第 3 行"不漏"（原书 p.493 的论证）',steps:[
      {zh:'情形 A：左子树里真有与 $i$ 重叠的区间 → 去左直接找到。'},
      {zh:'情形 B：左子树没有重叠区间。取左子树里 high 最大的那个区间 $i_0$（第 3 行的测试已保证 $x.left.max \\ge i.low$，它就是 $i_0.high$）：$i_0$ 既与 $i$ 不重叠、又有 $i_0.high \\ge i.low$，按区间三分律只能是 $i.high < i_0.low$。再由 BST 按 low 有序：$i_0.low \\le x.int.low$，而右子树任一区间 $i′$ 都有 $x.int.low \\le i′.low$，于是 $i.high < i′.low$ —— 右子树整体落在 $i$ 右边，没有一个与 $i$ 重叠。所以去左不会漏。'},
      {tex:'\\text{左无重叠} \\Rightarrow \\text{去左也不漏}',zh:'★ 两种情形去左都不漏 —— 这正是 C 程序 part 4 枚举对照所验证的性质。'}]},
     ],
    note:''},
   {type:'prove',title:'INTERVAL-SEARCH 的正确性',statement:'INTERVAL-SEARCH (T,i) returns a pointer to an element x in the interval tree T such that x: int overlaps interval i , or a pointer to the sentinel T: nil if no such element belongs to the set.',page:490,
    intro:'★ 证明两条：(a) 若返回 x 则确实重叠；(b) 若存在重叠区间则不会返回 nil。后者是原书 p.493 的关键论证。',
    steps:[
     {title:'(a) 返回即重叠',en:'INTERVAL-SEARCH (T,i) returns a pointer to an element x in the interval tree T such that x: int overlaps interval i , or a pointer to the sentinel T: nil if no such element belongs to the set.',page:490,
      body:['循环唯一的出口是"x 为哨兵"或"i 与 x.int 重叠"。',
        '返回非哨兵的 x 时，恰好是因为第 2 行的重叠测试通过 —— 返回值必与 i 重叠。∎']},
     {title:'(b) 关键一步：去左不漏',en:'(b) The interval tree that represents them. Each node x contains an interval, shown above the dashed line, and the maximum value of any interval endpoint in the subtree rooted at x, shown below the dashed line.',page:491,
      body:['在结点 x 处，i 不与 x.int 重叠，且 $x.left.max \\ge i.low$。',
        '**情形 A**：左子树确有重叠 → 转向正确。',
        '**情形 B**：左子树无重叠。取左子树里 high 最大的区间 $i_0$（即 $x.left.max$，第 3 行已保证它 \\ge i.low$）：$i_0$ 不重叠 $i$ 而 $i_0.high \\ge i.low$，三分律于是给出 $i.high < i_0.low$；再由 BST 按 low 有序，$i_0.low \\le x.int.low \\le i′.low$（$i′$ 为右子树任一区间），所以 $i.high < i′.low$ —— 右子树里没有任何区间与 $i$ 重叠。',
        '于是重叠区间若存在只能在**左**子树 → 去左不漏。∎']},
     {title:'(c) 终止与实测',en:'(b) The interval tree that represents them. Each node x contains an interval, shown above the dashed line, and the maximum value of any interval endpoint in the subtree rooted at x, shown below the dashed line. An inorder tree walk of the tree lists the nodes in sorted order by left endpoint.',page:491,
      body:['每轮循环下降一层 → 至多 $\\lg n$ 次比较（红黑树保证高度）。',
        'C 程序 part 4：20 个查询与暴力枚举**逐次一致**（命中 15、nil 5），其中 [14,14] 正确返回 nil。',
        '★ max 不变量另由 check_max 递归验证（根 max = 30）。∎']},
    ],conclusion:'★ 结论：max 域让"找任一重叠区间"变成一次下降 —— 定理 17.1 的又一实例。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'区间树的结点属性 max 存什么？',options:['子树里最大的 $low$ 端点，即最靠右的那个左端点','**子树中所有区间的最大右端点**','子树最深区间','自身区间的 high'],answer:1,
      why:'★ max = max(high, left.max, right.max) —— 注意不只有自己的 high。'},
     {kind:'single',q:'第 3 行走向左子树的条件 x.left.max ≥ i.low 的含义是？',options:['左子树必有一个重叠区间','左子树可能有重叠，去左不会漏','左子树全在 i 右边','左子树为空'],answer:1,
      why:'★ 条件为真时两种情形（真有重叠 / 全在左边）都不会漏 —— 原书 p.493 的论证。'},
     {kind:'judge',q:'INTERVAL-SEARCH 返回的是 low 最小的重叠区间。',answer:false,
      why:'★ 只保证"某一个"重叠区间；返回 low 最小的需要改造（习题 17.3-2）。'},
     {kind:'judge',q:'区间树的 max 域可以由孩子 O(1) 合成，所以定理 17.1 保证插入/删除仍是对数时间。',answer:true,
      why:'★ max 是半群合成（17.2-3 的框架）—— 定理 17.1 直接适用。'},
     {kind:'simulate',q:'Figure 17.4 的 9 个区间插入后，根结点的 max 是多少？（填数字）',expect:[30],placeholder:'例如：23',
      why:'最大的右端点是 [25,30] 的 30（C 程序 part 1 实测）。'},
     {kind:'single',q:'查询 $[14,14]$ 的返回结果是？',options:['**nil（无命中）**','14','13','返回全部 9 个区间'],answer:0,
      why:'[14,14] 与全部 9 个区间都不相交 → 返回哨兵 nil（C 程序 part 3）。'},
    ],bookExercises:[
     {id:'17.3-1',page:495,star:0,statement:'Write pseudocode for LEFT-ROTATE that operates on nodes in an interval tree and updates all the max attributes that change in O(1) time.',hint:'旋转后 $y$ 成了子树根、$x$ 变成 $y$ 的**左孩子**，所以更新顺序是**先 $x$ 后 $y$**： $x.max$ 只依赖它新的两棵子树（其中一支是换主前的旧孩子），先算； $y.max$ 要把新的 $x.max$ 算进去，必须排在 $x$ 之后。提示里那句「先更新 $y$」和它自己给的理由 （「$y$ 的 $max$ 依赖新孩子」）正好互相打脸 —— 那个新孩子就是 $x$。 写成两行：$x.max = x.key$ 与左右孩子 $max$ 三者取最大，然后 $y.max$ 同样取三者最大。 $O(1)$：只有这两个结点的 $max$ 变了。'},
     {id:'17.3-2',page:495,star:0,statement:'Describe an efficient algorithm that, given an interval i , returns an interval over- lapping i that has the minimum low endpoint, or T: nil if no such interval exists.',hint:'查询时在下降路径上记录"遇到的每个候选"，最后取 low 最小者；或维护每棵子树 min-low-of-overlapping……最直接的 O(lg n)：找到任一重叠后，沿着答案再向左验证有没有更小的 low。'},
     {id:'17.3-3',page:495,star:0,statement:'Given an interval tree T and an interval i , describe how to list all intervals in T that overlap i in O(min fn,k lg ng) time, where k is the number of intervals in the output list. ( Hint: One simple method makes several queries, modifying the tree between queries. A slightly more complicated method does not modify the tree.)',hint:'反复调用 INTERVAL-SEARCH、每找到一个就删除再重插：每次 O(lg n)、共 k 次 → O(k lg n)；再与"全部扫一遍 O(n)"取 min。'},
     {id:'17.3-4',page:495,star:0,statement:'Suggest modifications to the interval-tree procedures to support the new opera- tion INTERVAL-SEARCH-EXACTLY (T,i) , where T is an interval tree and i is an interval. The operation should return a pointer to a node x in T such that x: int: low = i: low and x: int: high = i: high, or T: nil if T contains no such node. All operations, including INTERVAL-SEARCH-EXACTLY , should run in O(lg n) time on an n-node interval tree.',hint:'按 (low, high) 双键搜索：先以 low 找到该点，再核对 high；重合区间可按 high 排序的次级键处理 —— 一次下降 O(lg n)。'},
     {id:'17.3-5',page:495,star:0,statement:'Show how to maintain a dynamic set Q of numbers that supports the operation MIN-GAP, which gives the absolute value of the difference of the two closest num- bers in Q. For example, if we have Q = f1,5,9,15,18,22 g , then MIN-GAP(Q) returns 3, since 15 and 18 are the two closest numbers in Q. Make the operations INSERT , DELETE , SEARCH , and MIN-GAP as efficient as possible, and analyze their running times.',hint:'MIN-GAP 是「动态数集里最接近的两个数之差」，跟区间树无关。用**顺序统计树**（17.1 节，本站 ch17/s01；第 14 章是动态规划） augmented 三个域： $subtree.min$、$subtree.max$、$gap$ = 子树内部的 MIN-GAP。合并时 $gap = \\min(left.gap, right.gap, right.subtree.min - left.subtree.max)$ —— 跨左右子树的最近一对必然是这两个端点。 三个域都是自底向上 $O(1)$ 可维护的，旋转处按 17.3-1 的顺序重算（先孩子后父亲）。 于是 INSERT / DELETE / SEARCH 都是 $O(\\lg n)$（红黑树 + 沿路径重算），MIN-GAP 直接读 $root.gap$，$O(1)$。'},
    ]},
  ],
};
