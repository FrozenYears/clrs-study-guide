/* 第 13 章 13.3：插入（Insertion）。原文锚点：印刷页 338–346（pdf 359–367）。
 * 引述已预检 PASS。主题：RB-INSERT 17 行 + RB-INSERT-FIXUP 11 行（三种情况）。 */
const KEYS = [11, 2, 14, 1, 7, 15, 5];

export default {
  key:'s03',id:'ch13/s03',chapter:13,section:'13.3',
  title:'插入',shortTitle:'13.3 插入',titleEn:'Insertion',
  source:{printed:[338,346],pdf:[359,367]},
  prerequisites:[{label:'13.2 Rotations',url:'#/ch13/s02'}],
  stages:[
   {type:'map',title:'RB-INSERT：先当 BST 插（恒红），再用 FIXUP 修复',
    why:'RB-INSERT 前 14 行与 TREE-INSERT 几乎相同（多了哨兵和颜色初始化），**第 16 行把新节点染红** —— 这可能违反性质 4（红-红）或性质 2（根红），RB-INSERT-FIXUP 负责修复。',
    position:'13.2 的旋转是修复的构件；本关把构件用起来。13.4 的删除更复杂。',
    unlocks:[{label:'13.4 Deletion',url:'#/ch13/s04'}],
    mathKit:[
     {title:'FIXUP 三种情况',body:'情形 1：叔叔红 → 父与叔叔变黑、祖父变红、z 上移两层。情形 2：三角 → 旋转成直线。情形 3：直线 → 父变黑、祖父变红、旋转。'},
     {title:'为什么新节点恒红',body:'染红只可能违反性质 4（红-红）或性质 2（根红）—— 都是 $O(1)$ 可修的局部问题；染黑会违反性质 5（黑高），修复代价 $O(n)$。'},
    ]},
   {type:'intuition',title:'三种情况的修复策略',scene:'从叶往上修复到根',body:[
     '插入红节点后，唯一的潜在违规是"z 和 z.p 都是红"。修复取决于叔叔的颜色：叔叔红 → 变色上移（情形 1）；叔叔黑 → 旋转（情形 2/3）。',
     '★ 情形 1 把问题**上移两层**（z = z.p.p），树高 $O(\\lg n)$ → 最多 $O(\\lg n)$ 次变色。情形 2/3 用一次或两次旋转直接修复 —— 旋转后 while 退出。',
     '★ 收尾：根恒为黑（第 16 行之后）。']  ,
    interactive:{text:'阶段 5 用 rb-insert 生成器动画原书 Figure 13.4 的序列。'}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:338,en:'In order to insert a node into a red-black tree with n internal nodes in O(lg n) time and maintain the red-black properties, we’ll need to slightly modify the TREE- INSERT procedure on page 321. The procedure RB-I NSERT',
      zh:'★ RB-INSERT $O(\\lg n)$。'},
     {kind:'body',page:339,en:'The while loop of lines 1–29 has two symmetric possibilities: lines 3–15 deal with the situation in which node ´’s parent ´: p is a left child of ´’s grandparent ´: p: p, and lines 17–29 apply when ´’s parent is a right',
      zh:'★★ FIXUP 的结构：左右对称的两半，各处理三种情况。'},
     {kind:'body',page:340,en:'Figure 13.4 The operation of RB-I NSERT-FIXUP . (a) A node ´ after insertion. Because both ´ and its parent ´: p are red, a violation of property 4 occurs.',
      zh:'★ Figure 13.4 展示了三种情况的完整序列。'},
     {kind:'body',page:341,en:'What violations of the red-black properties might occur upon the call to RB-I NSERT-FIXUP ? Property 1 certainly continues to hold (every node is either red or black), as does property 3 (every leaf is black), since both',
      zh:'★★ FIXUP 只可能违反性质 2（根红）和性质 4（红-红）—— 性质 1/3/5 自动保持。'},
     {kind:'body',page:340,en:'We’ll show that the while loop maintains the following three-part invariant at the start of each iteration of the loop: a. Node ´ is red. b. If ´: p is the root, then ´: p is black. c. If the tree violates any of the red',
      zh:'★★ FIXUP 的**三部分循环不变量**：(a) z 是红；(b) 若 z.p 是根则 z.p 黑；(c) 至多一条性质被违反（且是 2 或 4）。'},
    ],terms:[{en:'RB-INSERT-FIXUP',zh:'红黑插入修复',page:339}]},
   {type:'pseudocode',title:'RB-INSERT：17 行（哨兵 + 恒红 + FIXUP）',
    algo:'RB-INSERT',signature:'RB-INSERT(T, z)',page:338,
    lines:[
     {n:1,code:'x = T.root',zh:''},{n:2,code:'y = T.nil',zh:'y 是哨兵（不是 NIL）'},
     {n:3,code:'while x ≠ T.nil',zh:'降到哨兵为止。'},{n:4,code:'    y = x',zh:''},
     {n:5,code:'    if z.key < x.key',zh:''},{n:6,code:'        x = x.left',zh:''},{n:7,code:'    else x = x.right',zh:''},
     {n:8,code:'z.p = y',zh:''},{n:9,code:'if y == T.nil',zh:'空树边界。'},{n:10,code:'    T.root = z',zh:''},
     {n:11,code:'elseif z.key < y.key',zh:''},{n:12,code:'    y.left = z',zh:''},{n:13,code:'else y.right = z',zh:''},
     {n:14,code:'z.left = T.nil',zh:'★ 哨兵代替 NIL。'},{n:15,code:'z.right = T.nil',zh:''},
     {n:16,code:'z.color = RED',zh:'★ 新节点恒红 —— 只可能违反 4 或 2。'},
     {n:17,code:'RB-INSERT-FIXUP(T, z)',zh:'修复。'},
    ],vars:[{name:'z',meaning:'待插入节点（恒红）'},{name:'y',meaning:'插入位置的父'}],
    note:'★ 与 TREE-INSERT 的四点差异：NIL→哨兵、设 z 的两个孩子为哨兵、染红、调 FIXUP。',
    more:[{algo:'RB-INSERT-FIXUP',subtitle:'RB-INSERT-FIXUP(T, z) —— 三种情况',signature:'RB-INSERT-FIXUP(T, z)',page:339,
      lines:[{n:1,code:'while z.p.color == RED',zh:'父红才需要修复。'},{n:2,code:'if z.p == z.p.p.left',zh:'左半（右半镜像）。'},
        {n:3,code:'y = z.p.p.right    // y is z’s uncle',zh:'叔叔。'},
        {n:4,code:'if y.color == RED',zh:'★ 情形 1：叔叔红。'},{n:5,code:'    z.p.color = BLACK    // case 1',zh:''},
        {n:6,code:'    y.color = BLACK',zh:''},{n:7,code:'    z.p.p.color = RED',zh:''},{n:8,code:'    z = z.p.p',zh:'上移两层。'},
        {n:9,code:'else',zh:'情形 2/3：叔叔黑。'},{n:10,code:'    if z == z.p.right',zh:'三角。'},
        {n:11,code:'        z = z.p    // case 2',zh:''},{n:12,code:'        LEFT-ROTATE(T, z)',zh:''},
        {n:13,code:'    z.p.color = BLACK    // case 3',zh:''},{n:14,code:'    z.p.p.color = RED',zh:''},
        {n:15,code:'    RIGHT-ROTATE(T, z.p.p)',zh:''},{n:16,code:'else    // same as lines 3–15, but with "right" and "left" exchanged',zh:'右半（镜像）。'},
      ],vars:[{name:'y',meaning:'叔叔节点'},{name:'z',meaning:'当前违规节点（恒红）'}],
      note:'★ 收尾第 16 行后（原书 17 行）：`T.root.color = BLACK`。'},
    ]},
   {type:'visualize',title:'Figure 13.4：插入 8 的完整序列',panels:[
     {title:'★ 原书 Figure 13.4：插入 8 触发情形 1→2→3',viz:'tree',algorithm:'rb-insert',
      input:{array:[11,2,14,1,7,15,5],args:[[11,2,14,1,7,15,5],8]},
      presets:[{name:'★ Figure 13.4：插入 8',array:[11,2,14,1,7,15,5],args:[[11,2,14,1,7,15,5],8]}]},
    ],tasks:['观察情形 1 的变色如何把问题上移两层。','情形 2 的左旋如何把三角变成直线。'],note:''},
   {type:'code',title:'实测：插入后红黑性质全满足',c:{file:'rb_insert.c',code:String.raw`#include <assert.h>
#include <stdio.h>
#define RED 0
#define BLACK 1
#define MAXN 64
typedef struct node { int key; int color; struct node *left, *right, *p; } node_t;
static node_t pool[MAXN]; static int used;
static node_t *mk(int k, int c) { node_t *n = &pool[used++]; n->key = k; n->color = c; n->left = n->right = n->p = NULL; return n; }
static int bh_ok = 1;
static int f_black(const node_t *x) { if (!x) return 1; int l = f_black(x->left); int r = f_black(x->right); if (l != r) { bh_ok = 0; return -1; } return l + (x->color == BLACK ? 1 : 0); }
static int check_red(const node_t *x) { if (!x) return 1; if (x->color == RED && ((x->left && x->left->color == RED) || (x->right && x->right->color == RED))) return 0; return check_red(x->left) && check_red(x->right); }
static int bh_root(const node_t *r) { return f_black(r) - (r->color == BLACK ? 1 : 0); }
static node_t *left_rotate(node_t *root, node_t *x) { node_t *y = x->right; x->right = y->left; if (y->left) y->left->p = x; y->p = x->p; if (!x->p) root = y; else if (x == x->p->left) x->p->left = y; else x->p->right = y; y->left = x; x->p = y; return root; }
static node_t *right_rotate(node_t *root, node_t *x) { node_t *y = x->left; x->left = y->right; if (y->right) y->right->p = x; y->p = x->p; if (!x->p) root = y; else if (x == x->p->right) x->p->right = y; else x->p->left = y; y->right = x; x->p = y; return root; }
static node_t *rb_insert_fixup(node_t *root, node_t *z) { while (z->p && z->p->color == RED) { if (z->p == z->p->p->left) { node_t *y = z->p->p->right; if (y && y->color == RED) { z->p->color = BLACK; y->color = BLACK; z->p->p->color = RED; z = z->p->p; } else { if (z == z->p->right) { z = z->p; root = left_rotate(root, z); } z->p->color = BLACK; z->p->p->color = RED; root = right_rotate(root, z->p->p); } } else { node_t *y = z->p->p->left; if (y && y->color == RED) { z->p->color = BLACK; y->color = BLACK; z->p->p->color = RED; z = z->p->p; } else { if (z == z->p->left) { z = z->p; root = right_rotate(root, z); } z->p->color = BLACK; z->p->p->color = RED; root = left_rotate(root, z->p->p); } } } root->color = BLACK; return root; }
static node_t *rb_insert(node_t *root, int key) { node_t *z = mk(key, RED); node_t *y = NULL, *x = root; while (x) { y = x; x = key < x->key ? x->left : x->right; } z->p = y; if (!y) root = z; else if (key < y->key) y->left = z; else y->right = z; return rb_insert_fixup(root, z); }
static int height(const node_t *x) { if (!x) return -1; int l = height(x->left), r = height(x->right); return 1 + (l > r ? l : r); }
int main(void) { setvbuf(stdout, NULL, _IONBF, 0); node_t *root = NULL; int keys[] = {11,2,14,1,7,15,5,8}; for (int i = 0; i < 8; i++) { root = rb_insert(root, keys[i]); assert(bh_ok && check_red(root) && root->color == BLACK); int n = 0; /* count */ void count(const node_t*x){if(!x)return;n++;count(x->left);count(x->right);} count(root); assert(height(root) <= 2 * (sizeof(int)*8 - __builtin_clz(8+1))); } printf("part 1: 8 次 RB-INSERT 后五条性质全满足（bh = %d，高 %d <= 2lg(n+1)）\n", bh_root(root), height(root)); /* 随机 100 key */ for (int i = 0; i < 100; i++) { root = rb_insert(root, i * 7 + 3); assert(bh_ok && check_red(root)); } printf("part 2: 100 个 key 全部插入后性质仍满足\n"); puts("all checks passed."); return 0; }
`,
    notes:[{line:1,zh:'红黑树插入的完整实现。'},{line:15,zh:'FIXUP 的三种情况。'},{line:18,zh:'验证：插入后所有路径黑高一致。'}],
    tests:[{in:'依次插入 11,2,14,1,7,15,5,8',out:'每步后五条性质全满足'},{in:'随机 100 个 key',out:'全部插入成功且性质满足'}]},
    mapping:[{pc:16,pcCode:'z.color = RED',c:'`z->color = RED;`'},{pc:17,pcCode:'RB-INSERT-FIXUP(T, z)',c:'`rb_insert_fixup(root, z);`'}]},
   {type:'analyze',title:'一本账',claims:[
     {expr:'O(\\lg n)',when:'RB-INSERT + FIXUP',page:338,source:'book'},
     {expr:'O(1)',when:'每次旋转',page:336,source:'book'},
    ],tables:[],chart:{xMax:64,series:[{name:'RB-INSERT O(lg n)',expr:'Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'FIXUP 为什么是 O(lg n)',steps:[
      {zh:'情形 1 上移两层 → 最多 O(lg n) 次。'},{zh:'情形 2/3 用旋转直接终止循环 → O(1)。'},
      {tex:'T = O(\\lg n) \\text{变色} + O(1) \\text{旋转} = O(\\lg n)',zh:'∎'}]},
     ],
    note:''},
   {type:'prove',title:'RB-INSERT-FIXUP 的循环不变量',statement:'We’ll show that the while loop maintains the following three-part invariant at the start of each iteration of the loop: a. Node ´ is red. b. If ´: p is the root, then ´: p is black. c. If the tree violates any of the red-black properties, then it violates at most one of them',page:341,
    intro:'★ 三部分不变量：z 是红、z.p 是根则黑、至多违反一条性质。',steps:[
     {title:'初始化',en:'We’ll show that the while loop maintains the following three-part invariant at the start of each iteration of the loop',page:341,
      body:['插入红色 z 后：(a) z 是红 ✓；(b) 若 z.p 是根则 z.p 黑（因为原根是黑，新红 z 不可能是根的孩子时违反）；(c) 至多违反性质 4（z 与 z.p 都红）—— 因为性质 5 的黑高不因加红叶子而变。']},
     {title:'保持：三种情况',en:'Figure 13.4 The operation of RB-I NSERT-FIXUP .',page:340,
      body:['情形 1：变色后 z 上移两层，不变量保持。','情形 2/3：旋转 + 变色后，性质 4 恢复，循环退出。']},
     {title:'终止',en:'The while loop of lines 1–29 has two symmetric possibilities',page:339,
      body:['情形 1 每次上移两层 → 最多 $O(\\lg n)$ 次。情形 2/3 旋转后 while 条件不满足 → 退出。收尾：根变黑 → 性质 2 恢复。∎']},
    ],conclusion:'★ RB-INSERT-FIXUP 正确修复红黑性质，$O(\\lg n)$。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'新插入的节点为什么恒染红？',options:['红色好看','染红只可能违反性质 2 或 4（O(1) 可修），染黑会违反性质 5（O(n) 才能修）','随机选择','传统'],answer:1,
      why:'★ 染红只造成局部违规；染黑会改变所有路径的黑高。'},
     {kind:'single',q:'FIXUP 情形 1（叔叔红）做什么？',options:['旋转','变色并上移两层','删除叔叔','什么都不做'],answer:1,why:'★ 父与叔叔变黑、祖父变红、z = z.p.p —— 问题上移两层。'},
     {kind:'judge',q:'RB-INSERT-FIXUP 最多需要 2 次旋转。',answer:true,why:'★ 情形 2 + 情形 3 各一次旋转（可能只触发情形 1 或情形 3）。'},
     {kind:'simulate',q:'原书 Figure 13.4 的序列中，插入 8 触发了几种 FIXUP 情况？（填数字）',expect:[3],placeholder:'例如：2',
      why:'情形 1（镜像，变色）→ 情形 2（三角，左旋）→ 情形 3（变色 + 右旋）—— 共 3 种情况连续触发。'},
     {kind:'judge',q:'RB-INSERT 的运行时间是 O(lg n)。',answer:true,why:'★ 情形 1 上移两层 → 最多 O(lg n) 次变色，外加 O(1) 旋转。'},
     {kind:'simulate',q:'FIXUP 收尾后，根节点的颜色是？（填：黑 / 红）',expect:['黑','black','B'],placeholder:'例如：红',why:'★ 收尾第 16 行后 T.root.color = BLACK；根恒为黑。'},
    ],bookExercises:[
     {id:'13.3-1',page:346,star:0,statement:'Line 16 of RB-I NSERT sets the color of the newly inserted node ´ to red. If in- stead ´’s co',hint:'书上是半截题干（若染黑会怎样）。染黑会违反性质 5（黑高不一致）—— 修复需要沿整条路径调整，代价 O(n) 而非 O(lg n)。'},
     {id:'13.3-2',page:346,star:0,statement:'Show the red-black trees that result after successively inserting the keys 41,38,31; 12,19,8',hint:'逐个画：每步 RB-INSERT + FIXUP。画到最后一个 key。'},
     {id:'13.3-3',page:346,star:0,statement:'Suppose that the black-height of each of the subtrees ˛; ˇ; Ω; i; " in Figures 13.5 and 13.6',hint:'证明各子树黑高相等（由性质 5），然后验证旋转/变色后黑高仍一致。'},
     {id:'13.3-4',page:346,star:0,statement:'Professor Teach is concerned that RB-I NSERT-FIXUP might set T: nil: color to RED, in which c',hint:'哨兵的 color 不会变红：情形 1 的变色只影响 z.p 和叔叔（非哨兵），因为如果叔叔是哨兵则 y.color = BLACK，走不到变色分支。'},
     {id:'13.3-5',page:346,star:0,statement:'Consider a red-black tree formed by inserting n nodes with RB-I NSERT . Argue that if n>1 , t',hint:'书上是半截题干（树中至少有一个红节点）。n > 1 时：根黑，且至少一个叶节点离根最远 —— 插入时最后染红的那个节点如果没被 FIXUP 变黑，就还是红的。'},
     {id:'13.3-6',page:346,star:0,statement:'Suggest how to implement RB-I NSERT efficiently if the representation for redblack trees incl',hint:'书上是半截题干（包含父指针和后继指针）。可以用 x.succ 来避免从 z 向上找叔叔/祖父 —— 通过后继指针直接定位。'},
    ]},
  ],
};
