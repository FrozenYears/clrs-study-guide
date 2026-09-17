/* 第 17 章 17.2：如何扩张数据结构（How to augment a data structure）。印刷页 486–489（pdf 507–510）。 */
export default {
  key:'s02',id:'ch17/s02',chapter:17,section:'17.2',
  title:'扩张方法论：四步走与定理 17.1',shortTitle:'17.2 扩张方法论',
  titleEn:'How to augment a data structure',
  source:{printed:[486,489],pdf:[507,510]},
  prerequisites:[{label:'17.1 Dynamic order statistics',url:'#/ch17/s01'}],
  stages:[
   {type:'map',title:'把 17.1 的成功提炼成流程',
    why:'17.1 的 size 域不是灵光一现，而是一套**可复用的四步法**。本关把它正式化，并给出定理 17.1：只要新属性能由孩子 O(1) 算出，红黑树的扩张就**不破坏渐近性能**。',
    position:'方法论关：17.1 是实例，17.3 是下一个应用。四步法同时是"文档框架" —— 每个扩张数据结构都该这么写清楚。',
    unlocks:[{label:'17.3 Interval trees',url:'#/ch17/s03'}],
    mathKit:[
     {title:'四步法',body:'① 选属性 ② 算出它（保持不变式）③ 新操作 ④ 维护旧操作。'},
     {title:'定理 17.1',body:'若 $f$ 能由孩子与自身 $O(1)$ 算出，则在 $n$ 结点红黑树上维护 $f$ 的额外代价不改变 INSERT/DELETE 的 $O(\\lg n)$。'},
     {title:'关键机制',body:'旋转只改 $O(1)$ 个结点 → 重算 $O(1)$ 个 $f$；插入/删除的修改只发生在**根路径**上。'},
    ]},
   {type:'intuition',title:'为什么红黑树特别好扩张',scene:'size 域回顾',body:[
     '扩张的代价全部来自"属性失真后的修复"。红黑树的结构改动只发生在两个地方：',
     '★ **插入/删除**：修改只波及**根路径**上的结点 —— 每层重算一次 $f$，共 $O(\\lg n)$ 个。',
     '★ **旋转**：只改变 $O(1)$ 个结点的子树成员 —— 重算 $O(1)$ 个 $f$。',
     '★ 所以只要 $f$ 能由孩子 $O(1)$ 算出（size、max、黑高……），总维护代价就是 $O(\\lg n)$ —— 定理 17.1 的全部内容。',
     '⚠ 反例（习题 17.1-6）：把"子树内自己的秩"当属性就不行 —— 一次插入会让**整棵子树**的秩全变，修复代价 Θ(子树大小)。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 f or 是原书的断词伪影）。',blocks:[
     {kind:'body',page:486,en:'You can break the process of augmenting a data structure into four steps:',
      zh:'★★ 四步法的出处（紧接着列出四步）。'},
     {kind:'body',page:487,en:'(steps 2 and 4) if you cannot maintain the additional information efficiently. Nevertheless, this four-step method provides a good focus for your efforts in augmenting a data structure, and it is also a good framework f or documenting an augmented data structure.',
      zh:'★ 四步法的价值：聚焦 + **文档框架** —— 论证写在哪一步一目了然。'},
     {kind:'body',page:488,en:'In many cases, such as maintaining the size attributes in order-statistic trees, the cost of updating after a rotation is O(1), rather than the O(lg n) derived in the proof of Theorem 17.1. Exercise 17.2-3 gives an example.',
      zh:'★ 实践常比定理更好：size 域旋转后 O(1)（定理给的是 O(lg n) 的保守界）。'},
    ],terms:[{en:'augmentation',zh:'扩张（加属性不加功能债）',page:486},
              {en:'Theorem 17.1',zh:'红黑树扩张定理',page:487}]},
   {type:'pseudocode',title:'扩张四步法',algo:'AUGMENTATION-STEPS',signature:'扩张数据结构的四个步骤（本站按原书整理）',page:486,
    lines:[
     {n:1,code:'1. 选择一个基础数据结构',zh:'★ 例：红黑树（17.1）、区间树（17.3）。'},
     {n:2,code:'2. 确定要在每个结点维护的附加信息',zh:'★ 例：size；17.3 的 max。'},
     {n:3,code:'3. 验证插入/删除后仍能维护该信息',zh:'★ 别忘了旋转（定理 17.1 的核心）。'},
     {n:4,code:'4. 设计新操作',zh:'★ 例：OS-SELECT / OS-RANK / INTERVAL-SEARCH。'}],
    vars:[{name:'f',meaning:'结点上的附加属性（能由孩子 O(1) 算出）'}],
    note:'★ 步骤 2 与 4 常常互相牵制（原书提醒）：信息选太多维护不动，选太少新操作做不了。',
    more:[]},
   {type:'visualize',title:'定理 17.1 的机制',panels:[
     {title:'旋转只动 O(1) 个结点',viz:'tree',vizMode:'tree',
      trees:[
       {root:{label:'x',cost:'旋转前：子树 {α,β,γ}',children:[
        {label:'α'},{label:'y',cost:'子树 {β,γ}',children:[{label:'β'},{label:'γ'}]}]}}
      ],
      treeNotes:['左旋后只有 x 与 y 的 size/max 变了：α、β、γ 三棵子树的内部属性原封不动。',
        '★ 这就是定理 17.1 里"旋转后 O(1) 重算"的来源（旋转的两结点自底向上重算）。'],
     },
     {title:'插入/删除只动根路径',viz:'growth',
      chart:{xMax:64,series:[
       {name:'受影响结点数 O(lg n)',expr:'Math.log2(n)',color:'--viz-done'},
       {name:'整棵树 n（反例 17.1-6 的 rank 属性）',expr:'n',color:'--viz-violation'}]},
      note:'★ size 沿根路径更新；rank 那种子树全局属性会把更新拖回 O(n)。'},
    ],tasks:['对照 c/order_statistics.c 第 31 行：插入后沿祖先链 size++。'],note:''},
   {type:'code',title:'用 17.1 的 C 程序核对四步',c:{file:'order_statistics.c',code:String.raw`/* order_statistics.c -- 17.1 动态顺序统计：OS-SELECT / OS-RANK。
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
    notes:[{line:1,zh:'★ 本关不写新程序 —— 用 17.1 的 order_statistics.c 逐条核对四步法。'},
           {line:13,zh:'步骤 ②：`int size` 就是选中的属性（第 14 行）。'},
           {line:31,zh:'★★ 步骤 ③：插入后沿祖先链 size++（第 31 行）—— 根路径维护。'},
           {line:39,zh:'★★ 步骤 ④：新操作 os_select / os_rank 建立在 size 上（第 39/49 行）。'},
           {line:62,zh:'★ `check_size` 递归校验不变式 size = 1 + left + right（步骤 ③ 的证据）。'}]},
    tests:[{in:'四步法核对',out:'①红黑树 ②size ③祖先链+旋转 O(1) ④OS-SELECT/OS-RANK'},
           {in:'check_size 递归校验',out:'每个结点 size == 1 + left.size + right.size'}],
    mapping:[{pc:3,pcCode:'验证插入/删除后仍能维护',c:'`while (a) { a->size++; a = a->p; }`（第 31 行）'},
             {pc:4,pcCode:'设计新操作',c:'`node_t *os_select(node_t *x, int i)`（第 39 行）'}]},
   {type:'analyze',title:'一本账：维护代价从哪里来',claims:[
     {expr:'O(1)',when:'size 域旋转后的更新（定理 17.1 只要求 O(lg n)）',page:488,source:'book'},
     {expr:'O(\\lg n)',when:'定理 17.1：扩张后 INSERT/DELETE 仍是对数时间',page:487,source:'book'},
     {expr:'\\Theta(n)',when:'反例：把"子树内秩"当属性时的单次更新代价',page:486,source:'book'},
    ],tables:[{caption:'四步法在三个例子上的落位',rows:[
      ['步骤','17.1 顺序统计树','17.3 区间树','习题 17.2-3 的一般化'],
      ['① 基础结构','红黑树','红黑树','红黑树'],
      ['② 属性 f','size','max（子树最大右端点）','半群运算 ⊙ 的结果 f'],
      ['③ 维护','祖先链 + 旋转 O(1)','祖先链 + 旋转 O(1)','f 由孩子 O(1) 可算即可'],
      ['④ 新操作','OS-SELECT/OS-RANK','INTERVAL-SEARCH','—'],
     ]},{caption:'定理 17.1 的代价分解',rows:[
      ['结构改动','受影响结点','重算 f 的代价'],
      ['插入/删除（含修复）','根路径 O(lg n) 个','O(lg n)'],
      ['旋转','O(1) 个','O(1)'],
      ['合计','—','不改变 O(lg n)'],
     ]}],chart:{xMax:64,series:[
     {name:'根路径长度 lg n',expr:'Math.log2(n)',color:'--viz-done'},
     {name:'旋转重算 2 个（常数）',expr:'2',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'定理 17.1 的证明骨架',steps:[
      {zh:'插入先按 BST 规则下探：路径上每个结点的子树都可能加入新成员 → 逐个更新 $f$，共 $O(\\lg n)$。'},
      {zh:'红黑修复至多做 2 次旋转（加上一次删除的至多 3 次），每次只改 $O(1)$ 个结点的子树成员 → 重算 $O(1)$ 个 $f$。'},
      {tex:'O(\\lg n) + O(1) = O(\\lg n)',zh:'★ 所以扩张后的 INSERT/DELETE 仍是 $O(\\lg n)$。∎'}]},
     ],
    note:''},
   {type:'prove',title:'定理 17.1：扩张不破坏渐近性能',statement:'In many cases, such as maintaining the size attributes in order-statistic trees, the cost of updating after a rotation is O(1), rather than the O(lg n) derived in the proof of Theorem 17.1.',page:488,
    intro:'★ 定理的假设只有一条：f 能由结点自身与孩子 O(1) 算出。证明分两处改动分别清点代价。',
    steps:[
     {title:'假设与视角',en:'You can break the process of augmenting a data structure into four steps:',page:486,
      body:['设红黑树有 $n$ 个结点，属性 $f(x)$ 可由 $x$ 与其两个孩子 $O(1)$ 算出（size、max 都满足）。',
        '要证的：维护 $f$ 使 INSERT / DELETE 的时间仍为 $O(\\lg n)$。',
        '视角：只清点"因 $f$ 而额外付出的代价" —— 基础操作本身的代价不变。']},
     {title:'两个改动点的代价',en:'(steps 2 and 4) if you cannot maintain the additional information efficiently. Nevertheless, this four-step method provides a good focus for your efforts in augmenting a data structure, and it is also a good framework f or documenting an augmented data structure.',page:487,
      body:['**下探阶段**：BST 插入/删除的路径上每个结点的子树成员变了 → 沿路径更新 $f$，$O(\\lg n)$ 个结点 × $O(1)$/个。',
        '**旋转阶段**：红黑修复至多 3 次旋转，每次只有 2 个结点的子树成员变化 → 重算 $O(1)$ 个 $f$。',
        '合计 $O(\\lg n)$，渐近上被基础操作吸收。∎']},
     {title:'实践常更好',en:'In many cases, such as maintaining the size attributes in order-statistic trees, the cost of updating after a rotation is O(1), rather than the O(lg n) derived in the proof of Theorem 17.1.',page:488,
      body:['size 域在旋转后只需重算 2 个结点（$O(1)$），比定理的保守界更好 —— C 程序（order_statistics.c）没有旋转，插入只走根路径。',
        '★ 四步法同时是文档框架：谁在步骤 ② 选了不能由孩子维护的属性（17.1-6 的 rank），在步骤 ③ 就会暴露。∎']},
    ],conclusion:'★ 结论：能由孩子 O(1) 合成的属性（半群型信息）都可以安全加进红黑树 —— 17.3 的 max 立刻复用这条定理。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'扩张四步法的顺序是？',options:['选属性→选结构→新操作→维护','**基础结构→属性→验证维护→新操作**','新操作→属性→结构→维护','验证→属性→结构→操作'],answer:1,
      why:'★ ① 基础数据结构 ② 附加信息 ③ 验证维护 ④ 设计新操作。'},
     {kind:'single',q:'定理 17.1 中属性 f 需要满足什么？',options:['f 是整数值','**f 能由结点自身与孩子 O(1) 算出**','f 在旋转后不变','f 是单调的'],answer:1,
      why:'★ 这是唯一的技术假设；size、max 都满足。'},
     {kind:'judge',q:'把"结点在自己子树中的秩"存进红黑树，可以用 O(lg n) 维护。',answer:false,
      why:'★ 一次插入会让整棵子树的秩批量变化 → 更新 Θ(子树大小)（习题 17.1-6 的教训）。'},
     {kind:'judge',q:'定理 17.1 的证明要单独清点旋转的代价，因为旋转会移动整棵子树。',answer:true,
      why:'★ 旋转虽只动 2 个结点，但它们的子树成员换了 —— f 要重算；好在是 O(1) 个。'},
     {kind:'simulate',q:'旋转后需要重算多少个结点的 size？（填数字）',expect:[2],placeholder:'例如：3',
      why:'只有 x 与 y 两个结点的子树成员变了 —— O(1)（原书 p.488 也点名 size 的这个优待）。'},
     {kind:'simulate',q:'插入一个新结点后，沿祖先链要更新多少个 size？（填树高 h 的表达式，本程序树高 2）',expect:[3],placeholder:'例如：2',
      why:'C 程序的树高 2（根 + 1 层 + 新结点），路径上 3 个结点 size++（含新结点自己）。'},
    ],bookExercises:[
     {id:'17.2-1',page:489,star:0,statement:'Show, by adding pointers to the nodes, how to support each of t he dynamic-set queries MINIMUM , MAXIMUM , SUCCESSOR , and PREDECESSOR in O(1) worstcase time on an augmented order-statistic tre',hint:'给树加 4 个全局指针（min/max 各一）+ 每结点加 pred/succ 双向链（即按中序串起来的链表）。插入/删除时 O(1)～O(lg n) 修指针，查询全 O(1)。'},
     {id:'17.2-2',page:489,star:0,statement:'Can you maintain the black-heights of nodes in a red-black tree as attributes in the nodes of the tree without affecting the asymptotic performance of any of the redblack tree operations? Show ',hint:'可以：bh(x) = 子结点的 bh 加（自身为黑 ? 1 : 0），由孩子 O(1) 合成 → 定理 17.1 直接适用。注意哨兵的 bh = 0，旋转后 O(1) 重算。'},
     {id:'17.2-3',page:489,star:0,statement:'Let \u02dd be an associative binary operator, and let a be an attribute maintained in each node of a red-black tree. Suppose that you want to include in each node x an additional attribute f such th',hint:'取 $f(x) = a(x) \\odot f(left) \\odot f(right)$（含哨兵单位元）：结合律保证合成正确，O(1) 可算 → 定理 17.1 适用。size/max 都是这个半群框架的特例。'},
    ]},
  ],
};
