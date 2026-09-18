/* 第 13 章 13.4：删除（Deletion）。原文锚点：印刷页 346–362（pdf 367–383）。
 * RB-TRANSPLANT 6 行 + RB-DELETE 22 行 + RB-DELETE-FIXUP 10 行。 */
const KEYS = [11, 2, 14, 1, 7, 15, 5, 8];

export default {
  key:'s04',id:'ch13/s04',chapter:13,section:'13.4',
  title:'删除',shortTitle:'13.4 删除',titleEn:'Deletion',
  source:{printed:[346,362],pdf:[367,383]},
  prerequisites:[{label:'13.3 Insertion',url:'#/ch13/s03'}],
  stages:[
   {type:'map',title:'RB-DELETE：先按 BST 删，再修颜色',
    why:'删除比插入难：如果删的是**黑**节点，该路径的黑高会减少 —— 需要一个"双重黑"的概念来修复（RB-DELETE-FIXUP 的四种情况）。',
    position:'13.3 的插入只需要修红-红；删除多了一个"黑缺失"的维度。RB-TRANSPLANT 是 12.3 TRANSPLANT 的红黑版（多了哨兵处理）。',
    unlocks:[{label:'14.1 Dynamic order statistics',url:'#/ch14/s01'}],
    mathKit:[
     {title:'RB-DELETE 策略',body:'先按 BST 删除；如果删除的是红节点或替换节点是红，无需 FIXUP；如果删的是黑节点且替换节点也是黑 → 该路径少了一个黑 → FIXUP。'},
     {title:'FIXUP 四种情况',body:'x 带有"双重黑"。情形 1：兄弟红 → 旋转转化。情形 2：兄弟双黑子 → 兄弟变红、x 上移。情形 3：近侄红远侄黑 → 旋转转化。情形 4：远侄红 → 旋转终止。'},
    ]},
   {type:'intuition',title:'双重黑：一个节点扛两个"黑债"',scene:'删除黑节点 → 路径少一个黑 → 用"双重黑"标记 deficit',body:[
     '删黑节点后，原来经过它的路径少了一个黑。FIXUP 把这个 deficit 表示为 x 上的"双重黑"—— x 本身要贡献两个黑。',
     '★ 四种情况的策略：把 deficit **移向根**（情形 1/2）或**消除**（情形 3/4）。到达根时，双重黑变成单黑（根变黑补偿全树）—— 这就是为什么删除后根恒为黑。']  ,
    interactive:{text:'本关用 C 程序实测删除后性质满足；动画留待 RB-DELETE 生成器扩展。'}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:347,en:'In either case, node y has at most one child: node x , which takes y’s place in the tree.',
      zh:'★ RB-DELETE $O(\\\\lg n)$。'},
     {kind:'body',page:347,en:'• Because node y’s color might change, the variable y-original-color stores y’s color before any changes occur.',
      zh:'★★ **关键判断**：只有删除的节点（或替换节点）是**黑**时才需要 FIXUP —— 红节点删除不改变黑高。'},
     {kind:'body',page:350,en:'The procedure RB-DELETE-FIXUP on the next page restores properties 1, 2, and 4.',
      zh:'★ 最简单的消除：x 是红 → 染黑即完成（一个红补一个黑缺失）。'},
     {kind:'body',page:354,en:'Thus, the procedure RB-DELETE-FIXUP takes O(lg n) time and performs at most three rotations, and the overall time for RB-DELETE is therefore also O(lg n).',
      zh:'★ FIXUP 也是 $O(\\\\lg n)$ —— 沿树向上最多走 $h$ 步。'},
    ],terms:[{en:'RB-DELETE-FIXUP',zh:'红黑删除修复（四种情况）',page:351}]},
   {type:'pseudocode',title:'RB-DELETE：22 行',algo:'RB-DELETE',signature:'RB-DELETE(T, z)',page:348,
    lines:[
     {n:1,code:'y = z',zh:''},{n:2,code:'y-original-color = y.color',zh:'记录原始颜色。'},
     {n:3,code:'if z.left == T.nil',zh:'无左孩子。'},{n:4,code:'x = z.right',zh:''},
     {n:5,code:'RB-TRANSPLANT(T, z, z.right)',zh:''},
     {n:6,code:'elseif z.right == T.nil',zh:'无右孩子。'},{n:7,code:'x = z.left',zh:''},
     {n:8,code:'RB-TRANSPLANT(T, z, z.left)',zh:''},
     {n:9,code:'else y = TREE-MINIMUM(z.right)',zh:'两孩子 → 后继 y。'},
     {n:10,code:'    y-original-color = y.color',zh:''},{n:11,code:'    x = y.right',zh:''},
     {n:12,code:'    if y ≠ z.right',zh:'y 不是 z 的直接右孩子。'},
     {n:13,code:'        RB-TRANSPLANT(T, y, y.right)',zh:''},{n:14,code:'        y.right = z.right',zh:''},
     {n:15,code:'        y.right.p = y',zh:''},{n:16,code:'    else x.p = y',zh:''},
     {n:17,code:'    RB-TRANSPLANT(T, z, y)',zh:''},{n:18,code:'    y.left = z.left',zh:''},{n:19,code:'    y.left.p = y',zh:''},
     {n:20,code:'    y.color = z.color',zh:'y 继承 z 的颜色。'},
     {n:21,code:'if y-original-color == BLACK',zh:'★ 删了黑节点才需要修复。'},
     {n:22,code:'    RB-DELETE-FIXUP(T, x)',zh:''},
    ],vars:[{name:'z',meaning:'待删除节点'},{name:'y',meaning:'实际被摘除或移动的节点'},{name:'x',meaning:'接替 y 位置的节点（FIXUP 起点）'},{name:'y-original-color',meaning:'y 的原始颜色（决定是否需要 FIXUP）'}],
    note:'★ 核心判断在第 21 行：只有删了**黑**节点才调 FIXUP。红节点删除不改变黑高。',
    more:[{algo:'RB-DELETE-FIXUP',subtitle:'RB-DELETE-FIXUP(T, x) —— 四种情况',signature:'RB-DELETE-FIXUP(T, x)',page:347,
      lines:[{n:1,code:'while x ≠ T.root and x.color == BLACK',zh:'x 有双重黑且不是根。'},
       {n:2,code:'if x == x.p.left',zh:'左半（右半镜像）。'},{n:3,code:'w = x.p.right    // w is x’s sibling',zh:'兄弟。'},
       {n:4,code:'if w.color == RED',zh:'★ 情形 1：兄弟红 → 转化。'},{n:5,code:'    w.color = BLACK    // case 1',zh:''},
       {n:6,code:'    x.p.color = RED',zh:''},{n:7,code:'    LEFT-ROTATE(T, x.p)',zh:''},{n:8,code:'    w = x.p.right',zh:''},
       {n:9,code:'if w.left.color == BLACK and w.right.color == BLACK',zh:'★ 情形 2：兄弟双黑子。'},
       {n:10,code:'    w.color = RED    // case 2',zh:''},{n:11,code:'    x = x.p',zh:'deficit 上移。'},
      ],vars:[{name:'x',meaning:'双重黑节点'},{name:'w',meaning:'兄弟节点'}],
      note:'★ 情形 3/4 在原书第 12–22 行（右侄红时旋转终止）。'}]},
   {type:'visualize',title:'RB-DELETE 流程',panels:[{title:'删除后的 FIXUP',viz:'tree',trees:[{root:{label:'11',state:'rb-black',children:[{label:'2',state:'rb-red'},{label:'14',state:'rb-black'}]}}],treeNotes:['本关的删除动画由 C 程序验证；RB-DELETE-FIXUP 的动画生成器待扩展。']}],tasks:[],note:''},
   {type:'code',title:'实测：删除后性质满足',c:{file:'rb_delete.c',code:String.raw`/* rb_delete.c -- 13.4: RB-DELETE + FIXUP（用 T.nil 哨兵，与 CLRS 伪代码一致）。 */
#include <assert.h>
#include <stdio.h>
#define RED 0
#define BLACK 1
#define MAXN 256
typedef struct node { int key; int color; struct node *left, *right, *p; } node_t;
static node_t pool[MAXN]; static int used;
static node_t nil_node;                       /* T.nil：唯一的哨兵叶，颜色恒为黑 */
static node_t *const NIL = &nil_node;
static int bh_ok = 1;                         /* f_black 发现黑高不一致时置 0 */
static void nil_init(void) { nil_node.key = 0; nil_node.color = BLACK; nil_node.left = NIL; nil_node.right = NIL; nil_node.p = NIL; }
static node_t *mk(int k) { node_t *n = &pool[used++]; n->key = k; n->color = RED; n->left = n->right = n->p = NIL; return n; }
static int f_black(const node_t *x) { if (x == NIL) return 1; int l = f_black(x->left); int r = f_black(x->right); if (l != r) { bh_ok = 0; return -1; } return l + (x->color == BLACK ? 1 : 0); }
static int check_red(const node_t *x) { if (x == NIL) return 1; if (x->color == RED && ((x->left != NIL && x->left->color == RED) || (x->right != NIL && x->right->color == RED))) return 0; return check_red(x->left) && check_red(x->right); }
static int bh_of(const node_t *r) { return f_black(r) - (r != NIL && r->color == BLACK ? 1 : 0); }
static node_t *left_rotate(node_t *root, node_t *x) { node_t *y = x->right; x->right = y->left; if (y->left != NIL) y->left->p = x; y->p = x->p; if (x->p == NIL) root = y; else if (x == x->p->left) x->p->left = y; else x->p->right = y; y->left = x; x->p = y; return root; }
static node_t *right_rotate(node_t *root, node_t *x) { node_t *y = x->left; x->left = y->right; if (y->right != NIL) y->right->p = x; y->p = x->p; if (x->p == NIL) root = y; else if (x == x->p->right) x->p->right = y; else x->p->left = y; y->right = x; x->p = y; return root; }
static node_t *rb_insert_fixup(node_t *root, node_t *z) { while (z->p->color == RED) { int isL = (z->p == z->p->p->left); node_t *y = isL ? z->p->p->right : z->p->p->left; if (y->color == RED) { z->p->color = BLACK; y->color = BLACK; z->p->p->color = RED; z = z->p->p; } else { if (isL && z == z->p->right) { z = z->p; root = left_rotate(root, z); } if (!isL && z == z->p->left) { z = z->p; root = right_rotate(root, z); } z->p->color = BLACK; z->p->p->color = RED; root = isL ? right_rotate(root, z->p->p) : left_rotate(root, z->p->p); } } root->color = BLACK; return root; }
static node_t *rb_insert(node_t *root, int key) { node_t *z = mk(key); node_t *y = NIL, *x = root; while (x != NIL) { y = x; x = key < x->key ? x->left : x->right; } z->p = y; if (y == NIL) root = z; else if (key < y->key) y->left = z; else y->right = z; return rb_insert_fixup(root, z); }
static node_t *tree_minimum(node_t *x) { while (x->left != NIL) x = x->left; return x; }
static node_t *rb_transplant(node_t *root, node_t *u, node_t *v) { if (u->p == NIL) root = v; else if (u == u->p->left) u->p->left = v; else u->p->right = v; v->p = u->p; return root; }
static node_t *rb_delete_fixup(node_t *root, node_t *x) {
  while (x != root && x->color == BLACK) {
    node_t *w;
    if (x == x->p->left) {                                  /* 情形 A：x 是左孩子 */
      w = x->p->right;
      if (w->color == RED) { w->color = BLACK; x->p->color = RED; root = left_rotate(root, x->p); w = x->p->right; }
      if (w->left->color == BLACK && w->right->color == BLACK) { w->color = RED; x = x->p; }
      else { if (w->right->color == BLACK) { w->left->color = BLACK; w->color = RED; root = right_rotate(root, w); w = x->p->right; }
             w->color = x->p->color; x->p->color = BLACK; w->right->color = BLACK; root = left_rotate(root, x->p); x = root; }
    } else {                                                /* 情形 B：x 是右孩子（镜像） */
      w = x->p->left;
      if (w->color == RED) { w->color = BLACK; x->p->color = RED; root = right_rotate(root, x->p); w = x->p->left; }
      if (w->right->color == BLACK && w->left->color == BLACK) { w->color = RED; x = x->p; }
      else { if (w->left->color == BLACK) { w->right->color = BLACK; w->color = RED; root = left_rotate(root, w); w = x->p->left; }
             w->color = x->p->color; x->p->color = BLACK; w->left->color = BLACK; root = right_rotate(root, x->p); x = root; }
    }
  }
  x->color = BLACK;
  return root;
}
static node_t *rb_delete(node_t *root, node_t *z) {
  node_t *y = z, *x;
  int y_orig = y->color;
  if (z->left == NIL) { x = z->right; root = rb_transplant(root, z, z->right); }
  else if (z->right == NIL) { x = z->left; root = rb_transplant(root, z, z->left); }
  else { y = tree_minimum(z->right); y_orig = y->color; x = y->right;
         if (y->p != z) { root = rb_transplant(root, y, y->right); y->right = z->right; y->right->p = y; }
         else x->p = y;
         root = rb_transplant(root, z, y); y->left = z->left; y->left->p = y; y->color = z->color; }
  if (y_orig == BLACK) root = rb_delete_fixup(root, x);   /* x 可能就是 T.nil —— 双重黑由哨兵承担 */
  return root;
}
static node_t *find(node_t *root, int k) { while (root != NIL && root->key != k) root = k < root->key ? root->left : root->right; return root; }
static void inorder(const node_t *x, int *out, int *n) { if (x == NIL) return; inorder(x->left, out, n); out[(*n)++] = x->key; inorder(x->right, out, n); }
static int check_sorted(const int *a, int n) { for (int i = 1; i < n; i++) if (a[i-1] >= a[i]) return 0; return 1; }
static int height(const node_t *x) { if (x == NIL) return -1; int l = height(x->left), r = height(x->right); return 1 + (l > r ? l : r); }
int main(void) {
  setvbuf(stdout, NULL, _IONBF, 0); nil_init();
  node_t *root = NIL;
  int keys[] = {11, 2, 14, 1, 7, 15, 5, 8};
  for (int i = 0; i < 8; i++) root = rb_insert(root, keys[i]);
  assert(bh_ok && bh_of(root) >= 1 && check_red(root) && root->color == BLACK);
  printf("part 1: 建树成功（8 key，高 %d，黑高 %d）\n", height(root), bh_of(root));
  int dels[] = {2, 14, 11};
  for (int i = 0; i < 3; i++) {
    node_t *z = find(root, dels[i]); assert(z != NIL);
    root = rb_delete(root, z);
    int out[MAXN], n = 0; inorder(root, out, &n);
    assert(bh_ok && bh_of(root) >= 1 && check_sorted(out, n) && check_red(root) && root->color == BLACK);
    printf("part %d: 删除 %d → 中序升序、五条性质满足（黑高 %d）\n", i + 2, dels[i], bh_of(root));
  }
  for (int i = 0; i < 100; i++) {
    int k = i * 13 + 1;
    node_t *z = find(root, k);
    if (z != NIL) root = rb_delete(root, z); else root = rb_insert(root, k);
    assert(bh_ok && bh_of(root) >= 1 && check_red(root) && root->color == BLACK);
  }
  printf("part 5: 100 次混合操作后性质仍满足\n");
  puts("all checks passed."); return 0;
}
`,
    notes:[{line:1,zh:'红黑树删除的完整实现：T.nil 哨兵 + RB-DELETE + RB-DELETE-FIXUP。'},
           {line:9,zh:'★ T.nil 哨兵：全书唯一的黑叶。没有它，x 为空指针时无法表示「双重黑」——'
                     + '修复循环提前退出，被摘路径的黑高随即少 1。'},
           {line:23,zh:'RB-DELETE-FIXUP：x 是左孩子（情形 A）与镜像（情形 B），各对应原书四种情况。'},
           {line:43,zh:'RB-DELETE 主体：按孩子数分三种情形摘除，仅当原颜色为黑才需要修复。'},
           {line:52,zh:'★ x 可能就是 T.nil —— 双重黑由哨兵承担并被染黑，这正是 CLRS 用哨兵的原因。'},
           {line:74,zh:'混合压力：100 次「有则删、无则插」，每一步都断言五条性质。'}],
    tests:[{in:'建树 11,2,14,1,7,15,5,8，再依次删 2、14、11（11 是根）',
            out:'part 1–4：每次删除后中序升序、五条性质满足（黑高恒为 2）'},
           {in:'100 次混合插入/删除（i*13+1）',out:'part 5：性质始终保持，all checks passed'}]},
    mapping:[{pc:2,pcCode:'y-original-color = y.color',c:'`int y_orig = y->color;`'},
             {pc:9,pcCode:'else y = TREE-MINIMUM(z.right)',c:'`y = tree_minimum(z->right);`'},
             {pc:13,pcCode:'RB-TRANSPLANT(T, y, y.right)',c:'`rb_transplant(root, y, y->right)`'},
             {pc:21,pcCode:'if y-original-color == BLACK',c:'`if (y_orig == BLACK)`'},
             {pc:22,pcCode:'RB-DELETE-FIXUP(T, x)',c:'`rb_delete_fixup(root, x)`'}]},
   {type:'analyze',title:'一本账',claims:[
     {expr:'O(\\\\lg n)',when:'RB-DELETE + FIXUP',page:354,source:'book'},
     {expr:'O(1)',when:'每次旋转',page:354,source:'book'},
    ],tables:[],chart:{xMax:64,series:[{name:'RB-DELETE O(lg n)',expr:'Math.log2(n)',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'FIXUP 为什么是 O(lg n)',steps:[
      {zh:'情形 2 上移 → 最多 O(lg n) 次。'},{zh:'情形 1/3/4 用旋转终止 → O(1)。'},
      {tex:'T = O(\\\\lg n)',zh:'∎'}]},
     ],
    note:''},
   {type:'prove',title:'RB-DELETE-FIXUP 终止性与正确性',statement:'The procedure RB-DELETE-FIXUP restores properties 4 and 5 in O(lg n) time.',page:354,
    intro:'★ 四种情况的策略：消除双重黑或上移到根。',steps:[
     {title:'双重黑的含义',en:'• Because node y’s color might change, the variable y-original-color stores y’s color before any changes occur.',page:347,
      body:['删黑节点 → 路径黑数减 1 → 接替者 x 承担"双重黑"—— x 自己算黑一次，还欠一个黑。']},
     {title:'终止：到根或消除',en:'In either case, node y has at most one child: node x , which takes y’s place in the tree.',page:347,
      body:['情形 2 上移 deficit → 可能到根。根处双重黑 → 染黑即消除（多出的黑分给全树）。','x 是红 → 染黑即消除。两种方式都终止循环。∎']},
    ],conclusion:'★ RB-DELETE-FIXUP O(lg n)。至此 BST → 红黑树的全部操作都有了保证 O(lg n) 的实现。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'RB-DELETE 什么时候需要调 FIXUP？',options:['每次删除','删除黑节点时','删除红节点时','只在删根时'],answer:1,why:'★ 删红节点不改变黑高 → 无需 FIXUP。删黑节点 → 该路径黑数减少 → 需要 FIXUP。'},
     {kind:'single',q:'FIXUP 的终止条件是？',options:['x 是红或 x 是根','x 是叶','旋转了 2 次','走了 h 步'],answer:0,why:'★ x 是红 → 染黑消除；x 是根 → 多余的黑分给全树。'},
     {kind:'judge',q:'删除红节点时不需要调用 RB-DELETE-FIXUP。',answer:true,why:'★ 删红节点不改变黑高 → 无需 FIXUP（p.347 关键判断）。'},
     {kind:'judge',q:'RB-DELETE-FIXUP 在一次删除中至多做 3 次旋转。',answer:true,why:'★ 原书 p.354：FIXUP O(lg n)、至多 3 次旋转。'},
     {kind:'single',q:'C 实现里为什么需要一个恒黑的哨兵 T.nil？',options:['节省内存','**删除黑叶时 x 会落到空叶：没有哨兵就无法表示「双重黑」，修复循环提前退出、黑高失衡**','为了加快查找','伪代码要求结点不可为空'],answer:1,why:'★ x = T.nil 时双重黑挂在哨兵上继续修正 —— 本关程序用哨兵后，含「删根 11」在内的 3 次删除与 100 次混合操作全部通过。'},
     {kind:'single',q:'删除黑节点后，整棵树的根节点颜色是？',options:['**黑（BLACK）**','红（RED）','由删除位置决定','删除后根可能为红'],answer:0,why:'★ 删黑后根染黑补偿全树 → 根恒为黑（本关 prove 结论）。'},
    ],bookExercises:[
     {id:'13.4-1',page:358,star:0,statement:'Argue that the root of the result of RB-DELETE-FIXUP is black regardless of whether case 1',hint:'四种情况最终都使根为黑：情形 1 旋转后新子树根为黑；情形 2 上移到根时根变黑；情形 3/4 的旋转不改变根颜色。'},
     {id:'13.4-2',page:358,star:0,statement:'In exercise 13.3-4 you answered the question "Does RB-I NSERT-FIXUP ever set T: nil: color to RED?"',hint:'类似 13.3-4：哨兵 color 不会变红。FIXUP 的变色只影响非哨兵节点。'},
     {id:'13.4-3',page:359,star:0,statement:'In Exercise 13.3-2 you found the red-black tree that results from successively inserting the keys 41,38,31; 12,19,8',hint:'逐个删除并画图。每步 RB-DELETE + 可能的 FIXUP。'},
     {id:'13.4-4',page:359,star:0,statement:'Suppose that a node x with two children is given as input to RB-DELETE',hint:'书上是半截题干。RB-DELETE 的情形 3 找后继 y 顶替 —— y 继承 z 的颜色。实际被摘除的是 y（不是 z），所以 FIXUP 取决于 y 的原始颜色。'},
     {id:'13.4-5',page:359,star:0,statement:'Consider a black-height-2 red-black tree. Argue that every red node has a black parent and either',hint:'黑高 2 的树很小（最多 ~15 个内部节点），可以穷举验证。'},
     {id:'13.4-6',page:359,star:0,statement:'Professors Skelton is concerned that RB-DELETE-FIXUP might set T: nil: color to RED',hint:'与 13.3-4 同理：哨兵不会变红。'},
     {id:'13.4-7',page:359,star:0,statement:'Consider the set of keys f1,2,…,ng in a red-black tree. What is the largest and smallest ratio',hint:'最大：红黑交替 $\\\\approx 2$。最小：全黑 $\\\\approx 1$。由性质 4 + 5 直接限制。'},
    ],bookProblems:[
     {id:'13-1',page:360,star:0,statement:'13-1 Persistent dynamic sets',hint:'持久化数据结构：每次操作产生新版本。'},
     {id:'13-2',page:361,star:0,statement:'13-2 Join operation on red-black trees',hint:'红黑树的 JOIN 操作：连接两棵树。'},
     {id:'13-3',page:361,star:0,statement:'13-3 AVL trees',hint:'AVL 树：另一种平衡 BST，平衡因子 |bf| ≤ 1。'},
    ]},
  ],
};
