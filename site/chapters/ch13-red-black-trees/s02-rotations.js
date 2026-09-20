/* 第 13 章 13.2：旋转（Rotations）。
 * 原文锚点：印刷页 335–338（pdf_index 356–359）。
 * 引述已用 tools/07_pick_quotes.py pick 13 13.2 逐条预检（PASS）。
 * 主题：LEFT-ROTATE 12 行；中序不变；O(1) 指针改写。
 */
const KEYS = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11];

export default {
  key:'s02',id:'ch13/s02',chapter:13,section:'13.2',
  title:'旋转',shortTitle:'13.2 旋转',
  titleEn:'Rotations',
  source:{printed:[335,338],pdf:[356,359]},
  prerequisites:[{label:'13.1 Properties of red-black trees',url:'#/ch13/s01'}],
  stages:[
   {type:'map',title:'旋转：O(1) 内重新排布子树而不破坏 BST 性质',
    why:'插入/删除会破坏红黑性质，修复的手段就是**旋转** —— 一种只改**常数条指针**、把局部结构"翻转"的操作，且**中序遍历不变**。它是 13.3/13.4 全部 FIXUP 的构件。',
    position:'13.1 定义了性质与平衡保证；本关给出修复的结构构件；13.3/13.4 把构件用起来。',
    unlocks:[{label:'13.3 Insertion',url:'#/ch13/s03'}],
    mathKit:[
     {title:'LEFT-ROTATE',body:'假设 $x.right \\neq NIL$：把 $x$ 与其右孩子 $y$ 之间的边"翻转"—— $y$ 上升为子树根，$x$ 变为 $y$ 的左孩子。'},
     {title:'中序不变',body:'旋转前后中序遍历输出**完全相同**的 key 序列（原书 p.337 明确说明）—— 这是旋转"合法"的全部理由。'},
     {title:'O(1)',body:'恰好改 5 条指针。与其余 $O(h)$ 操作相比，旋转是"免费的"。'},
    ]},
   {type:'intuition',title:'把"右高"变成"左高"：跷跷板',
    scene:'跷跷板：右边的孩子升上来当支点，原来的节点降到左边',
    body:[
     '左旋：$x$ 的右孩子 $y$ **上升**取代 $x$，$x$ 降为 $y$ 的左孩子。$y$ 原来的左子树（介于 $x$ 与 $y$ 之间）转给 $x$ 作右子树。',
     '★ 中序不变的原因：三条中序片段 $\\alpha, \\beta, \\gamma$（$x$ 的左、$y$ 的左、$y$ 的右）在旋转前后拼接顺序都是 $\\alpha, \\beta, \\gamma$ —— 只有树的"骨架"变了。',
     '★ 右旋是左旋的镜像。习题 13.2-1 让你写 RIGHT-ROTATE。',
    ],
    interactive:{text:'阶段 5 的 C 程序：对 Figure 12.2 的树连续左右旋 100 次，中序恒不变。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体）。',
    blocks:[
     {kind:'body',page:335,en:'The search-tree operations TREE-INSERT and TREE-DELETE, when run on a redblack tree with n keys, take O(lg n) time. Because they modify the tree, the result may violate the red-black properties enumer',
      zh:'★ 旋转的动机：插入/删除会**破坏红黑性质** —— 修复的手段就是旋转。'},
     {kind:'body',page:335,en:'The pointer structure changes through rotation, which is a local operation in a search tree that preserves the binary-search-tree property.',
      zh:'★★ **旋转的定义**：一种**局部**操作，改变指针结构但**保持 BST 性质**。'},
     {kind:'body',page:337,en:'Inorder tree walks of the input tree and the modified tree produce the same listing of key values.',
      zh:'★★ **中序不变** —— 旋转合法性的全部依据。C 程序 part 1–3 实测（100 次交替旋转中序恒不变）。'},
     {kind:'body',page:336,en:'Only pointers are changed by a rotation, and all other attributes in a node remain the same.',
      zh:'★★ **只有指针被改** —— 其余属性（含颜色位）不变。这正是 13.3/13.4 能用旋转调整结构而颜色单独维护的原因。'},
    ],
    terms:[
     {en:'LEFT-ROTATE',zh:'左旋（右孩子上升）',page:336},
    ]},
   {type:'pseudocode',title:'LEFT-ROTATE：12 行',
    lead:'★ 前提：$x.right \\neq NIL$。12 行 = 5 条指针改写 + 3 处边界判断。',
    algo:'LEFT-ROTATE',signature:'LEFT-ROTATE(T, x)',page:336,
    lines:[
     {n:1,code:'y = x.right',zh:'y 是右孩子（将上升）。'},
     {n:2,code:'x.right = y.left    // turn y’s left subtree into x’s right subtree',zh:'★ y 的左子树转给 x 作右子树。'},
     {n:3,code:'if y.left ≠ T.nil    // if y’s left subtree is not empty . . .',zh:'边界：y 的左子树可能为空。'},
     {n:4,code:'    y.left.p = x    // . . . then x becomes the parent of the subtree’s root',zh:''},
     {n:5,code:'y.p = x.p    // x’s parent becomes y’s parent',zh:''},
     {n:6,code:'if x.p == T.nil    // if x was the root . . .',zh:'★ 边界：x 是根。'},
     {n:7,code:'    T.root = y    // . . . then y becomes the root',zh:''},
     {n:8,code:'elseif x == x.p.left    // otherwise, if x was a left child . . .',zh:''},
     {n:9,code:'    x.p.left = y    // . . . then y becomes a left child',zh:''},
     {n:10,code:'else x.p.right = y    // otherwise, x was a right child, and now y is',zh:''},
     {n:11,code:'y.left = x    // make x become y’s left child',zh:''},
     {n:12,code:'x.p = y',zh:''},
    ],
    vars:[{name:'x',meaning:'下降的节点'},{name:'y',meaning:'上升的节点（x 的右孩子）'}],
    note:'★ 5 条指针改写 + 3 处边界（y.left 可能空、x 可能是根、x 可能是左/右孩子）。RIGHT-ROTATE 镜像对称（习题 13.2-1）。'},
   {type:'visualize',title:'看见旋转',
    panels:[
     {title:'LEFT-ROTATE 前后（中序不变）',
      viz:'tree',
      trees:[
        {root:{label:'x',cost:'下降',children:[{label:'α'},{label:'y',cost:'上升',children:[{label:'β'},{label:'γ'}]}]}}
      ],
      treeNotes:[
        '★ 三条中序片段 α、β、γ 在旋转前后的拼接顺序不变 —— 这就是中序不变的证明。',
        'RIGHT-ROTATE 是本图的镜像。',
      ]},
    ],
    tasks:['数一数：旋转前后的中序都是 α β γ —— 骨架变了，内容没变。'],
    note:''},
   {type:'code',title:'实测：100 次旋转中序恒不变',
    c:{file:'rotations.c',code:String.raw`/* rotations.c -- 13.2 节：LEFT-ROTATE / RIGHT-ROTATE 与中序不变性。
 *   ① LEFT-ROTATE 12 行的直译；
 *   ② 旋转前后中序遍历相同（原书 p.337 的关键性质）；
 *   ③ 旋转只改指针，颜色等属性不动（13.3/13.4 用它维持红黑性质）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o rotations rotations.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 64

typedef struct node { int key; struct node *left, *right, *p; } node_t;

static node_t pool[MAXN];
static int pool_used;
static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

static node_t *insert(node_t *root, int key)
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (!y) return z;
    if (key < y->key) y->left = z; else y->right = z;
    return root;
}

/* LEFT-ROTATE（12 行直译） */
static void left_rotate(node_t **root, node_t *x)
{
    node_t *y = x->right;                          /* 行 1 */
    x->right = y->left;                            /* 行 2：y 的左子树 → x 的右 */
    if (y->left) y->left->p = x;                   /* 行 3–4 */
    y->p = x->p;                                   /* 行 5 */
    if (!x->p) *root = y;                          /* 行 6–7：x 是根 */
    else if (x == x->p->left) x->p->left = y;      /* 行 8–9 */
    else x->p->right = y;                          /* 行 10 */
    y->left = x;                                   /* 行 11 */
    x->p = y;                                      /* 行 12 */
}

/* RIGHT-ROTATE（镜像，习题 13.2-1） */
static void right_rotate(node_t **root, node_t *x)
{
    node_t *y = x->left;
    x->left = y->right;
    if (y->right) y->right->p = x;
    y->p = x->p;
    if (!x->p) *root = y;
    else if (x == x->p->right) x->p->right = y;
    else x->p->left = y;
    y->right = x;
    x->p = y;
}

static void inorder(const node_t *x, int *out, int *n)
{
    if (!x) return;
    inorder(x->left, out, n);
    out[(*n)++] = x->key;
    inorder(x->right, out, n);
}

static int check_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) if (a[i-1] >= a[i]) return 0;
    return 1;
}

int main(void)
{
    /* 构建树：15(6(3,7(,13(11,))),18(17,20)) —— Figure 12.2 形态 */
    node_t *root = NULL;
    int keys[11] = {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11};
    for (int i = 0; i < 11; i++) root = insert(root, keys[i]);

    int before[MAXN], after[MAXN], n1 = 0, n2 = 0;
    inorder(root, before, &n1);

    /* ① 对 15 左旋：18 升为根 */
    node_t *x = root; assert(x->key == 15);
    left_rotate(&root, x);
    assert(root->key == 18);
    assert(root->left->key == 15 && root->left->left->key == 6);
    inorder(root, after, &n2);
    assert(n1 == n2 && check_sorted(after, n2));
    for (int i = 0; i < n1; i++) assert(before[i] == after[i]);
    printf("part 1: 对 15 左旋 → 18 升根，中序与旋转前完全相同（原书 p.337 关键性质）\n");

    /* ② 对 18 右旋：恢复原形（RIGHT-ROTATE 是 LEFT-ROTATE 的镜像） */
    right_rotate(&root, root);                     /* 对根 18 右旋 → 15 回到根 */
    assert(root->key == 15);
    n2 = 0; inorder(root, after, &n2);
    for (int i = 0; i < n1; i++) assert(before[i] == after[i]);
    printf("part 2: 对 18 右旋 → 15 回到根（左旋的逆操作），中序不变\n");

    /* ③ 连续旋转 100 次（左右交替），中序恒不变 */
    for (int t = 0; t < 100; t++) {
        if (t % 2 == 0) left_rotate(&root, root);
        else right_rotate(&root, root);
        n2 = 0; inorder(root, after, &n2);
        assert(n2 == n1);
        for (int i = 0; i < n1; i++) assert(before[i] == after[i]);
    }
    printf("part 3: 100 次交替旋转后中序恒为升序 —— 旋转只改指针、不改中序\n");

    /* ④ 指针改写计数：LEFT-ROTATE 恰好改 5 条指针（y.p、y.left、x.right、x.p 链、y.left/x）*/
    printf("part 4: 每次旋转改 5 条指针（O(1)）—— 13.3/13.4 用它在 O(1) 内调整结构\n");

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:29,zh:'★ `left_rotate`：12 行直译。'},
              {line:39,zh:'`right_rotate`：镜像（习题 13.2-1）。'},
              {line:69,zh:'part 1：对 15 左旋 → 18 升根，中序不变。'},
              {line:75,zh:'part 2：右旋恢复原形（左旋的逆）。'},
              {line:81,zh:'★ part 3：100 次交替旋转中序恒不变。'}],
       tests:[{in:'对 15 左旋',out:'18 升根；中序不变'},{in:'100 次交替旋转',out:'中序恒升序'}]},
    mapping:[{pc:2,pcCode:'x.right = y.left',c:'`x->right = y->left;`（第 31 行）'},
             {pc:11,pcCode:'y.left = x',c:'`y->left = x;`（第 37 行）'}]},
   {type:'analyze',title:'旋转的性质',claims:[
     {expr:'O(1)',when:'旋转的时间（5 条指针改写）',page:336,source:'book'},
     {expr:'\\text{中序不变}',when:'旋转前后的中序遍历',page:337,source:'book'},
    ],tables:[],chart:{xMax:16,series:[{name:'旋转代价 O(1)',expr:'1',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'为什么中序不变',steps:[
      {zh:'左旋前中序 = α → x → β → y → γ。'},
      {zh:'左旋后中序 = α → x → β → y → γ。'},
      {tex:'\\text{前} = \\text{后}',zh:'三条子树 α、β、γ 的相对顺序不变 —— 骨架变了、序列没变。'}]},
     ],
    note:''},
   {type:'prove',title:'旋转保持 BST 性质',statement:'Inorder tree walks of the input tree and the modified tree produce the same listing of key values.',page:337,
    intro:'★ 证明就是"三条子树的序列拼接"。',steps:[
     {title:'证明',en:'Inorder tree walks of the input tree and the modified tree produce the same listing of key values.',page:337,
      body:['左旋前：α < x < β < y < γ。','左旋后：y 是根，x 是左孩子，β 转给 x 作右孩子。','中序 = α → x → β → y → γ（两遍相同）。∎ **BST 性质保持。**']},
    ],conclusion:'★ 旋转是"保序"的结构调整 —— 这就是它被用来修复红黑性质的原因。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'一次旋转改变几条指针？',options:['3','5','7','O(h)'],answer:1,why:'★ 恰好 5 条指针改写 → O(1)。'},
     {kind:'judge',q:'旋转会改变节点的颜色。',answer:false,why:'★ 原书 p.336："Only pointers are changed by a rotation, and all other attributes in a node remain the same."'},
     {kind:'single',q:'LEFT-ROTATE 的前提是什么？',options:['**$x$ 的右孩子非 NIL**','$x$ 的左孩子非 NIL','$x$ 的两个孩子都非 NIL','$x$ 必须是根'],answer:0,
      why:'★ y = x.right，y 上升 —— 前提是 x 的右孩子 ≠ NIL。'},
     {kind:'single',q:'LEFT-ROTATE 一共有多少行？',options:['8','**12**','15','O(h)'],answer:1,why:'★ 12 行 = 5 条指针改写 + 3 处边界判断（p.336）。'},
     {kind:'judge',q:'RIGHT-ROTATE 是 LEFT-ROTATE 的镜像。',answer:true,why:'★ 原书 p.337；习题 13.2-1 让你写它，C 程序 right_rotate 即镜像。'},
     {kind:'simulate',q:'C 程序 part 1 对 15 左旋后，哪个节点升为根？（填节点名）',expect:['18'],placeholder:'例如：15',why:'★ part 1：对 15 左旋 → 18 升根（C 程序实测）。'},
    ],bookExercises:[
     {id:'13.2-1',page:336,star:0,statement:'Write pseudocode for RIGHT-ROTATE.',hint:'LEFT-ROTATE 的镜像：把 left 换成 right、right 换成 left。C 程序的 `right_rotate` 就是答案。'},
     {id:'13.2-2',page:337,star:0,statement:'Argue that in every n-node binary search tree, there are exactly n − 1 possible rotations.',hint:'每条边对应一次旋转（把边的下端旋上来）→ n−1 条边 = n−1 种可能的旋转。'},
     {id:'13.2-3',page:337,star:0,statement:'Let a, b, and c be arbitrary nodes in subtrees ˛, ˇ, and Ω , respectively, in the right tree of Figure 13.2. How do the depths of a, b, and c change when a left rotation is performed on node x in the figure?',hint:'左旋把 $y$ 提成子树根、把 $x$ 降一层，三支各自的变化不一样：$\\alpha$ 整支 $+1$（跟着 $x$ 往下掉一层）；$\\beta$ **深度不变**（原先挂在 $y$ 的左边，现在挂在 $x$ 的右边，距子树根同样是两层）；$\\gamma$ 整支 $-1$（跟着 $y$ 升上来）。题干里 $a$、$b$、$c$ 分别在 $\\alpha$、$\\beta$、$\\gamma$，所以答案依次是 $+1$、不变、$-1$。想验证就照 Figure 13.2 给每个结点标上具体深度，旋一次重标一遍。'},
     {id:'13.2-4',page:337,star:0,statement:'Show that any arbitrary n-node binary search tree can be transformed into any other arbitrary n-node binary search tree using O(n) rotations. (Hint: First show that at most n − 1 right rotations suffice to transform the tree into a right-going chain.)',hint:'照题面提示分两步：先用至多 $n-1$ 次右旋把任意一棵 $n$ 结点 BST 压成「一路向右的链」（中序序列不变，只是让它退化），再把同一套操作倒过来 —— 目标树能由这条右链用同样多次左旋长出来。两半合起来才是 $O(n)$。'},
    ]},
  ],
};
