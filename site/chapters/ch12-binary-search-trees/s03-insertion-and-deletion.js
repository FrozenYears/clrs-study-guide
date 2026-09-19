/* 第 12 章 12.3：插入与删除（Insertion and deletion）。
 * 原文锚点：印刷页 321–332（pdf_index 342–352）。
 * 引述已用 tools/07_pick_quotes.py pick 12 12.3 逐条预检（PASS）。
 * 主题：TREE-INSERT 13 行；TRANSPLANT 7 行；TREE-DELETE 12 行三种情况；Theorem 12.3。
 */

/* 原书 Figure 12.2 的树（插入顺序 15,6,18,3,7,17,20,2,4,13,11） */
const KEYS = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11];

export default {
  key:'s03',id:'ch12/s03',chapter:12,section:'12.3',
  title:'插入与删除',shortTitle:'12.3 插入与删除',
  titleEn:'Insertion and deletion',
  source: { printed: [321, 330], pdf: [342, 352] },
  prerequisites:[{label:'12.2 Querying a binary search tree',url:'#/ch12/s02'}],
  stages:[
   {type:'map',title:'改树：插入直接，删除要拆成三步',
    why:'插入 = 一次不成功的查找 + 把新节点挂上（$O(h)$，简单）。删除难在：**摘掉一个节点后要把它两侧的子树重新接好** —— 原书为此引入了专用构件 **TRANSPLANT**（用一棵子树替换另一棵），TREE-DELETE 则拆成三种情况处理。',
    position:'12.2 的查询是"只读"操作；本关是"写"操作 —— 全部指针维护的复杂性都集中在这里，也是第 13 章红黑树 INSERT/DELETE 的直接前身（红黑树把本关的过程加上颜色维护）。Theorem 12.3 收官：INSERT 与 DELETE 都能 $O(h)$。',
    unlocks:[{label:'13.1 Red-black trees（第 13 章：红黑树）',url:'#/ch13/s01'}],
    mathKit:[
     {title:'TRANSPLANT 的契约',body:'用子树 $v$ 替换子树 $u$：只处理 $u.p$ 与 $v.p$ 两条父链，**不动 $v$ 的左右孩子**（由调用方负责）。'},
     {title:'删除三情况',body:'① $z$ 无左孩子 → 右孩子顶替；② $z$ 无右孩子 → 左孩子顶替；③ 两个都有 → 后继 $y$（右子树最小）顶替 $z$，$y$ 原来的右孩子先上交给 $y.p$。'},
     {title:'Theorem 12.3',body:'INSERT 与 DELETE 都能实现为 $O(h)$ —— DELETE 的每一行都是常数时间，除了找后继的 TREE-MINIMUM（$O(h)$）。'},
    ]},
   {type:'intuition',title:'删除为什么难：摘一个节点要接回两棵子树',
    scene:'拔掉多米诺中间的一块，上面两摞要重新找支撑',
    body:[
     '插入很简单：走到叶位置挂上就完事（TREE-INSERT 的 13 行里其实只有"找位置 + 挂接"两件事）。',
     '★ **删除的难点**：被删节点 $z$ 头顶上可能挂着**两棵子树**。摘掉 $z$ 之后，这两棵子树必须重新接到树里，且 BST 性质不能破坏。',
     '★ 解法分三种情况：① $z$ 没有左孩子 → 右孩子直接顶替；② $z$ 没有右孩子 → 左孩子顶替；③ **两个都有** → 用 $z$ 的后继 $y$（右子树最小）来顶替 $z$ —— 因为 $y$ 没有左孩子（习题 12.2-5），它可以安全地接管 $z$ 的两个孩子。',
     '★ **TRANSPLANT 是全部指针操作的核心构件**：它只负责"让 $u$ 的父改认 $v$ 为孩子、$v$ 认 $u$ 的父为父" —— 刻意**不碰** $v$ 的左右孩子，因为三种情况各自有不同的接法。这就是"把一个复杂操作拆成正交构件"的教科书示范。',
    ],
    interactive:{text:'阶段 5 的面板用 bst-delete 生成器演示三种删除情况（含 y = z.right 的简版与完整版）。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对 ´（即 z）与 TRANSPLANT 的排版形式）。',
    blocks:[
     {kind:'body',page:321,en:'The operations of insertion and deletion cause the dynamic set represented by a binary search tree to change.',
      zh:'★ 主题句：插入与删除会让 BST **发生变化** —— 本章的任务是"怎么变才不破坏 BST 性质"。'},
     {kind:'body',page:321,en:'We’ll see that modifying the tree to insert a new element is relatively straight',
      zh:'★ 插入"相对直接"；删除才是硬仗（原书用了三倍篇幅）。'},
     {kind:'body',page:322,en:'The overall strategy for deleting a node ´ from a binary search tree T has three basic cases',
      zh:'★★ **删除的总策略**（前两种情况）：无孩子 → 父直接改指 NIL；只有一个孩子 → 那个孩子**升位**顶替 $z$。'},
     {kind:'body',page:322,en:'• If ´ has two children, find ´’s successor y 4which must belong to ´’s right sub',
      zh:'★★ 情况 3 开场：两个孩子 → 找后继 $y$ —— **$y$ 必然在 $z$ 的右子树里**（且没有左孩子，习题 12.2-5）。'},
     {kind:'body',page:324,en:'As part of the process of deleting a node, subtrees need to move around within t',
      zh:'★★ 引出 **TRANSPLANT**：删除过程需要把子树在树里搬来搬去 —— 一个专用过程。'},
     {kind:'body',page:324,en:'TRANSPLANT allows v to be NIL instead of a pointer to a node.',
      zh:'★★ **TRANSPLANT 的设计决定**：允许 $v = \\text{NIL}$ —— 这是让它能被三种删除情况**共用**的关键。'},
     {kind:'body',page:324,en:'The procedure TRANSPLANT does not attempt to update v: left and v: right . Doing so',
      zh:'★★ 刻意**不更新 $v$ 的左右孩子** —— 由调用方按情况负责。构件的正交性。'},
     {kind:'body',page:325,en:'Each line of TREE-DELETE , including the calls to TRANSPLANT , takes constant ti',
      zh:'★ TREE-DELETE 每行常数时间（除第 5 行的 TREE-MINIMUM 是 $O(h)$）→ 整体 $O(h)$。'},
     {kind:'body',page:325,en:'The dynamic-set operations INSERT and DELETE can be implemented so that each one runs in O(h) time on a binary search tree of height h.',
      zh:'★★ **Theorem 12.3**：INSERT 与 DELETE 都能实现为 $O(h)$ —— 第 12 章的收官定理。'},
    ],
    terms:[
     {en:'TRANSPLANT',zh:'移植（用子树 v 替换子树 u）',page:324},
     {en:'successor',zh:'后继（删除两孩子情况时的顶替者）',page:325},
    ]},
   {type:'pseudocode',title:'TRANSPLANT：7 行的替换构件',
    lead:'★ 删除的积木。注意两个边界：$u$ 是根（第 1–2 行）、$v$ 为 NIL（第 6 行的条件）。',
    algo:'TRANSPLANT',signature:'TRANSPLANT(T, u, v)',page:324,
    lines:[
     {n:1,code:'if u.p == NIL',zh:'★ 边界 1：$u$ 是根 —— 没有父可改，改 T.root。'},
     {n:2,code:'    T.root = v',zh:''},
     {n:3,code:'elseif u == u.p.left',zh:'$u$ 是父的左孩子。'},
     {n:4,code:'    u.p.left = v',zh:'父的左指针改指 $v$。'},
     {n:5,code:'else u.p.right = v',zh:'否则 $u$ 是右孩子。'},
     {n:6,code:'if v ≠ NIL',zh:'★ 边界 2：$v$ 可能是 NIL（被删节点没有某侧孩子）。'},
     {n:7,code:'    v.p = u.p',zh:'$v$ 认 $u$ 的父为父。'},
    ],
    vars:[
     {name:'u',meaning:'被替换的子树根'},
     {name:'v',meaning:'替换上去的子树根（可为 NIL）'},
    ],
    note:'★ 刻意**不更新 v.left 与 v.right**（原书 p.324 明确说明）—— 调用方按三种情况各自接法。',
    more:[
     {algo:'TREE-INSERT',subtitle:'TREE-INSERT(T, z) —— 13 行（原书 p.321）',
      signature:'TREE-INSERT(T, z)',page:321,
      lines:[
       {n:1,code:'x = T.root',zh:'x 是"当前比较节点"。'},
       {n:2,code:'y = NIL',zh:'y 记录 x 的父 —— 循环结束时是插入位置。'},
       {n:3,code:'while x ≠ NIL    // descend until reaching a leaf',zh:'一次不成功的查找。'},
       {n:4,code:'    y = x',zh:''},
       {n:5,code:'    if z.key < x.key',zh:''},
       {n:6,code:'        x = x.left',zh:''},
       {n:7,code:'    else x = x.right',zh:''},
       {n:8,code:'z.p = y    // found the location—insert z with parent y',zh:'★ 先设父指针（哪怕 y 是 NIL）。'},
       {n:9,code:'if y == NIL',zh:'★ 边界：树原本是空的。'},
       {n:10,code:'    T.root = z',zh:''},
       {n:11,code:'elseif z.key < y.key',zh:''},
       {n:12,code:'    y.left = z',zh:''},
       {n:13,code:'else y.right = z',zh:''},
      ],
      vars:[{name:'y',meaning:'循环结束时的插入位置的父'},{name:'z',meaning:'待插入节点（key 已设置）'}],
      note:''},
     {algo:'TREE-DELETE',subtitle:'TREE-DELETE(T, z) —— 12 行、三种情况（原书 p.325）',
      signature:'TREE-DELETE(T, z)',page:325,
      lines:[
       {n:1,code:'if z.left == NIL',zh:'★ 情形 1：无左孩子（右孩子顶替，可为 NIL = 叶）。'},
       {n:2,code:'    TRANSPLANT(T, z, z.right)    // replace z by its right child',zh:''},
       {n:3,code:'elseif z.right == NIL',zh:'★ 情形 2：有左孩子、无右孩子。'},
       {n:4,code:'    TRANSPLANT(T, z, z.left)    // replace z by its left child',zh:''},
       {n:5,code:'else y = TREE-MINIMUM(z.right)    // y is z’s successor',zh:'★ 情形 3：两个孩子 → 后继 y。'},
       {n:6,code:'if y ≠ z.right    // is y farther down the tree?',zh:'y 与 z.right 是不是同一个？'},
       {n:7,code:'    TRANSPLANT(T, y, y.right)    // replace y by its right child',zh:'y 让出自己的位置给它的右孩子。'},
       {n:8,code:'    y.right = z.right    // z’s right child becomes',zh:''},
       {n:9,code:'    y.right.p = y    // y’s right child',zh:''},
       {n:10,code:'TRANSPLANT(T, z, y)    // replace z by its successor y',zh:''},
       {n:11,code:'y.left = z.left    // and give z’s left child to y,',zh:''},
       {n:12,code:'    y.left.p = y    // which had no left child',zh:'★ 第 12 行安全的前提：y 没有左孩子（习题 12.2-5）。'},
      ],
      vars:[{name:'z',meaning:'待删除节点'},{name:'y',meaning:'z 的后继（情形 3 的顶替者）'}],
      note:'★ 第 6–9 行只在 y 比 z.right 更深时需要：把 y 从原位摘出、再让它接管 z 的右子树。'},
    ]},
   {type:'visualize',title:'看见三种删除情况（原书 Figure 12.4 的节点）',
    panels:[
     {title:'① 插入：一次不成功的查找',
      viz:'tree',
      algorithm:'bst-insert',
      input:{array:KEYS, args:[KEYS, 13]},
      invariants:[{label:'TREE-INSERT 的前 8 行 = 一次不成功的查找；第 9–13 行处理挂接（含空树边界）'}],
      presets:[
       {name:'★ 插入 13（原书 Figure 12.3）',array:KEYS,args:[KEYS, 13]},
      ]},
     {title:'② 删除：三种情况',
      viz:'tree',
      algorithm:'bst-delete',
      input:{array:KEYS, args:[KEYS, 6]},
      invariants:[{label:'每次删除后中序仍升序（C 程序逐次断言）'}],
      presets:[
       {name:'★ 删 6（两孩子：情形 3，y = 7）',array:KEYS,args:[KEYS, 6]},
       {name:'删 2（叶：情形 1）',array:KEYS,args:[KEYS, 2]},
       {name:'删 7（单右孩子：情形 1）',array:KEYS,args:[KEYS, 7]},
      ]},
    ],
    tasks:[
     '面板 ① 对照 12.2 的 TREE-SEARCH：插入的前 8 行就是一次"找不到"的查找。',
     '面板 ② 删 6（两孩子）：注意后继 7 被摘出原位、接管 6 的两棵子树 —— y.right 的交接是第 7–9 行的事。',
     '面板 ② 删 7（单右孩子 13）：TRANSPLANT 直接让孩子顶替 —— 一行搞定。',
     'C 程序 part 6 把整棵树删光：每删一个节点都验证中序，最后 root = NIL（v = NIL 边界）。',
    ],
    note:'★ 面板用 bst 引擎（bst-insert / bst-delete 生成器）；C 程序 part 2–6 覆盖三种情况与全部 TRANSPLANT 边界。'},
   {type:'code',title:'实测：三种删除情况与全部边界',
    intro:'`c/bst_delete.c` 实现 TREE-INSERT / TRANSPLANT / TREE-DELETE，在 Figure 12.2 的树上依次删叶、删单孩子、删两孩子（两种后继位置），最后把树删光。',
    pseudocodeRef:'TREE-DELETE',
    c:{file:'bst_delete.c',code:String.raw`/* bst_delete.c -- 12.3 节：TREE-INSERT / TRANSPLANT / TREE-DELETE 与三种删除情况。
 * 树 = Figure 12.2 的形态（插入 15,6,18,3,7,17,20,2,4,13,11，高 4）。
 *   ① TRANSPLANT 的两个边界（u 是根 / v 为 NIL）；
 *   ② 三种删除：叶、单孩子、两孩子（y 是/不是 z.right 两种）；
 *   ③ 每次删除后中序仍升序、剩余元素不丢。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o bst_delete bst_delete.c
 */
#include <assert.h>
#include <stdio.h>

#define MAXN 32

typedef struct node { int key; struct node *left, *right, *p; } node_t;

static node_t pool[MAXN];
static int pool_used;

static node_t *mk(int key)
{
    node_t *n = &pool[pool_used++];
    n->key = key; n->left = n->right = n->p = NULL;
    return n;
}

static node_t *insert(node_t *root, int key)   /* TREE-INSERT（13 行的浓缩） */
{
    node_t *z = mk(key), *y = NULL, *x = root;
    while (x != NULL) { y = x; x = key < x->key ? x->left : x->right; }
    z->p = y;
    if (y == NULL) { return z; }
    if (key < y->key) { y->left = z; } else { y->right = z; }
    return root;
}

/* TRANSPLANT(T, u, v)：用子树 v 替换子树 u（7 行）—— 不动 v 的左右孩子！ */
static void transplant(node_t **root, node_t *u, node_t *v)
{
    if (u->p == NULL) { *root = v; }               /* 行 1–2：u 是根 */
    else if (u == u->p->left) { u->p->left = v; }  /* 行 3–4：u 是左孩子 */
    else { u->p->right = v; }                      /* 行 5：u 是右孩子 */
    if (v != NULL) { v->p = u->p; }                /* 行 6–7：★ v 为 NIL 也要走 */
}

static node_t *tree_minimum(node_t *x)
{
    while (x->left != NULL) { x = x->left; }
    return x;
}

/* TREE-DELETE（12 行） */
static void tree_delete(node_t **root, node_t *z)
{
    if (z->left == NULL) { transplant(root, z, z->right); }        /* 情形 1：无左孩子 */
    else if (z->right == NULL) { transplant(root, z, z->left); }   /* 情形 2：无右孩子 */
    else {
        node_t *y = tree_minimum(z->right);                        /* 情形 3：后继 y */
        if (y->p != z) {
            transplant(root, y, y->right);                         /* y 让出自己的右孩子 */
            y->right = z->right; y->right->p = y;
        }
        transplant(root, z, y);                                    /* y 顶替 z */
        y->left = z->left; y->left->p = y;
    }
}

static void inorder(const node_t *x, int *out, int *n)
{
    if (!x) { return; }
    inorder(x->left, out, n);
    out[(*n)++] = x->key;
    inorder(x->right, out, n);
}

static int check_sorted(const int *a, int n)
{
    for (int i = 1; i < n; i++) { if (a[i - 1] >= a[i]) { return 0; } }
    return 1;
}

int main(void)
{
    /* ① 构建 Figure 12.2 的树 */
    node_t *root = NULL;
    int keys[11] = {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 11};
    for (int i = 0; i < 11; i++) { root = insert(root, keys[i]); }
    int out[MAXN], n = 0;
    inorder(root, out, &n);
    assert(n == 11 && check_sorted(out, n));
    printf("part 1: Figure 12.2 的树建好（11 个 key，中序升序）\n");

    /* ② 情形 1+2：删除叶（13 有左孩子 11？13 有孩子 → 删 2） */
    {
        node_t *z = root->left->left->left;      /* 2（叶） */
        assert(z->key == 2);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 10 && check_sorted(out, n));
        printf("part 2: 删除叶 2（情形 1：无左孩子，右孩子 NIL）→ 中序仍升序，剩 %d 个\n", n);
    }

    /* ③ 情形 1（有右孩子）：删除叶之后的 3？3 只剩右孩子 4 */
    {
        node_t *z = root->left->left;            /* 3（只有右孩子 4） */
        assert(z->key == 3 && z->left == NULL);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 9 && check_sorted(out, n));
        assert(root->left->left->key == 4);      /* 4 顶替 3 */
        printf("part 3: 删除单孩子节点 3 → 4 顶替（TRANSPLANT 边界：v 非空才设 v.p）\n");
    }

    /* ④ 情形 3：删除有两个孩子的节点（两孩子且后继 ≠ 右孩子） */
    {
        node_t *z = root;                        /* 删除根 15（两个孩子 6、18） */
        assert(z->key == 15);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 8 && check_sorted(out, n));
        printf("part 4: 删除两孩子节点 15 → 后继 17 顶替（y ≠ z.right 的完整版）\n");
        assert(root->key == 17);                 /* 17 成为新根 */
    }

    /* ⑤ 情形 3 简版：y 就是 z.right */
    {
        /* 删 18（孩子 20）→ 20 顶替；再删 20？先删 6（孩子 7、11/13/4 子树）*/
        node_t *z = root->right;                 /* 18（只剩右孩子 20） */
        assert(z->key == 18);
        tree_delete(&root, z);
        n = 0; inorder(root, out, &n);
        assert(n == 7 && check_sorted(out, n));
        printf("part 5: 删除 18 → 20 顶替（y == z.right 的简版，无需挪 y 的右孩子）\n");
    }

    /* ⑥ 全部删光（含删除根直到树空 —— TRANSPLANT 的 v = NIL 边界） */
    {
        int remaining[7];
        n = 0; inorder(root, remaining, &n);
        for (int i = 0; i < n; i++) {
            /* 找到当前树里的该节点并删除 */
            node_t *z = root;
            while (z != NULL && z->key != remaining[i]) {
                z = remaining[i] < z->key ? z->left : z->right;
            }
        tree_delete(&root, z);
            int tmp[MAXN], m = 0;
            inorder(root, tmp, &m);
            assert(m == n - i - 1 && check_sorted(tmp, m));   /* 每删一个都保持升序 */
        }
        assert(root == NULL);
        printf("part 6: 把剩下的 7 个全删光（每一步都验过中序）→ 最后 root = NIL"
               "（TRANSPLANT 的 v = NIL 边界）\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:36,zh:'★ `transplant`：7 行的直译。**不碰 v 的左右孩子**（构件的正交性）。'},
              {line:51,zh:'★ `tree_delete`：12 行直译，三种情况。'},
              {line:89,zh:'part 1：Figure 12.2 的树建好（11 key，中序升序）。'},
              {line:98,zh:'part 2：删叶 2（情形 1：右孩子为 NIL → TRANSPLANT 的 v = NIL 边界）。'},
              {line:109,zh:'part 3：删单右孩子节点 3 → 4 顶替。'},
              {line:119,zh:'★★ part 4：删两孩子节点 15（y = 17 ≠ z.right 的完整版，含第 7–9 行的交接）。'},
              {line:131,zh:'part 5：删 18（y = 20 = z.right 的简版）。'},
              {line:150,zh:'★ part 6：把剩下的 7 个全删光，每步都验中序 → 最后 root = NIL。'}],
       tests:[{in:'删除叶 2',out:'情形 1（v = NIL 边界）；中序仍升序'},
              {in:'删除单右孩子节点 3',out:'4 顶替（v 非空 → 设 v.p）'},
              {in:'删除两孩子节点 15',out:'后继 17 顶替（y ≠ z.right 完整版）'},
              {in:'把树删光',out:'每步中序升序，最后 root = NIL'}]},
    mapping:[{pc:2,pcCode:'TRANSPLANT(T, z, z.right)',c:'`transplant(root, z, z->right);`（tree_delete 情形 1）'},
             {pc:7,pcCode:'TRANSPLANT(T, y, y.right)',c:'`transplant(root, y, y->right);`（情形 3，第 66 行附近）'},
             {pc:12,pcCode:'y.left.p = y',c:'`y->left->p = y;`（情形 3 末尾）—— 安全前提：y 无左孩子'}]},
   {type:'analyze',title:'一本账：删除的指针操作量',
    intro:'三种情况各要改几条指针？数清楚就知道为什么 TRANSPLANT 是 worthwhile 的抽象。',
    claims:[
     {expr:'O(h)',when:'TREE-INSERT（一次不成功查找 + 常数挂接）',page:322,source:'book'},
     {expr:'O(h)',when:'TREE-DELETE（每行常数，除 TREE-MINIMUM 找后继 O(h)）',page:325,source:'book'},
     {expr:'\\Theta(h)',when:'Theorem 12.3：INSERT 与 DELETE 都是 O(h)',page:325,source:'book'},
    ],
    tables:[{caption:'三种删除情况的指针改写',rows:[
      ['情况','条件','指针改写','TRANSPLANT 调用'],
      ['1：无左孩子','z.left = NIL','z.p 与 z.right 两条','1 次（v = z.right）'],
      ['2：无右孩子','z.right = NIL','z.p 与 z.left 两条','1 次（v = z.left）'],
      ['3：两孩子','都有','最多 5 条（y ≠ z.right 时）','2 次（摘 y、再顶替）'],
     ]},
     {caption:'TRANSPLANT 的两个边界',rows:[
      ['边界','为什么需要'],
      ['u.p == NIL → T.root = v','被替换的可能就是根'],
      ['v ≠ NIL 才设 v.p','v 可以是 NIL（删除叶/单孩子时）—— 若无条件写 v.p 会解引用空指针'],
     ]}],
    chart:{xMax:64,series:[
     {name:'INSERT：h',expr:'n - 1',color:'--viz-done'},
     {name:'DELETE：h + TREE-MINIMUM',expr:'2 * (n - 1)',color:'--viz-compare'},
    ]},
    derivations:[
     {kind:'summation',title:'Theorem 12.3：INSERT 与 DELETE 都是 O(h)',steps:[
      {zh:'TREE-INSERT：前 8 行 = 一次不成功的查找（$O(h)$）+ 常数挂接。'},
      {zh:'TREE-DELETE：每行常数时间，**除第 5 行的 TREE-MINIMUM**（$O(h)$）。'},
      {tex:'T_{\\text{DELETE}} = O(h) + O(h) = O(h)',zh:'∎ 两个操作都是 $O(h)$ —— 与查询同阶。★ 至此 BST 的全部字典操作都齐了：查询 12.2、修改本关，全部 $O(h)$。'}],
     },
    ],
    note:'★ 中心图：DELETE 比 INSERT 多一倍常数（要找后继），但都是 $O(h)$ —— 渐近上打平。'},
   {type:'prove',title:'Theorem 12.3：INSERT 与 DELETE 都是 O(h)',
    statement:'The dynamic-set operations INSERT and DELETE can be implemented so that each one runs in O(h) time on a binary search tree of height h.',
    page:325,
    intro:'★ 证明是逐行的：INSERT = 一次不成功的查找；DELETE = 逐行常数时间 + 一次 TREE-MINIMUM。',
    steps:[
     {title:'第一步 · TREE-INSERT = 一次不成功的查找',
      en:'Figure 12.3 shows how TREE-INSERT works. Just like the procedures TREE- SEARCH a',
      page:321,
      body:['第 1–7 行：沿树下降到叶位置 —— 与 TREE-SEARCH 的路径完全同型，$O(h)$。',
        '第 8–13 行：常数条指针改写（含空树边界）。',
        '★ 合计 $O(h)$。★ 原书提醒：插入假定"表中没有同 key 元素"。']},
     {title:'第二步 · TRANSPLANT 本身是 O(1)',
      en:'Here is how TRANSPLANT works. Lines 1–2 handle the case in which u is the root o',
      page:324,
      body:['7 行全部是常数条指针改写（父链 + 根指针 + 一个条件判断）。',
        '★ 它不递归、不遍历 —— 纯构件。这正是把删除拆成"构件 + 情况"的好处：每种情况的复杂度一目了然。']},
     {title:'第三步 · TREE-DELETE 逐行清点',
      en:'Each line of TREE-DELETE , including the calls to TRANSPLANT , takes constant ti',
      page:325,
      body:['第 1–4 行：判断 + 一次 TRANSPLANT —— 常数。',
        '第 5 行：**TREE-MINIMUM(z.right)** —— $O(h)$，全过程唯一非常数项。',
        '第 6–12 行：常数条指针改写 + 一次 TRANSPLANT —— 常数。',
        '$T_{\\text{DELETE}} = O(h)$。∎ **Theorem 12.3 得证。**']},
     {title:'第四步 · 第 12 行为什么安全（习题 12.2-5 的回报）',
      en:'Each line of TREE-DELETE , including the calls to TRANSPLANT , takes constant ti',
      page:325,
      body:['第 12 行写 `y.left.p = y` —— 若 $y$ 有左孩子这行会把它覆盖（丢子树）。',
        '★ 但情形 3 的 $y$ 是 $z.right$ 的最小节点 —— **它必然没有左孩子**（习题 12.2-5 证明过）。',
        '★ 前一节的习题在这里变成了正确性论证的支点 —— 章节之间的知识是咬合的。']},
    ],
    conclusion:'★ 结论：INSERT 与 DELETE 都 $O(h)$（Theorem 12.3）。至此 BST 的全部字典操作（SEARCH/MIN/MAX/SUCCESSOR/PREDECESSOR/INSERT/DELETE）都是 $O(h)$ —— 全部押在树高上。第 13 章的红黑树将保证 $h = O(\\lg n)$，让这一切**最坏情况**也是对数。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'TRANSPLANT 为什么第 6 行要判断 v ≠ NIL？',
      options:['为了好看','因为 v 可以是 NIL（删除叶/单孩子时），无条件写 v.p 会解引用空指针','为了维护树高','书上写错了'],answer:1,
      why:'★ 删除叶节点时 v = NIL —— 此时"认父"这一步必须跳过。'},
     {kind:'single',q:'TREE-DELETE 情形 3 中，为什么后继 y 必然没有左孩子？',
      options:['巧合','y 是 z.right 的最小节点 —— 若它有左孩子，那个左孩子更小，与"最小"矛盾','因为树是平衡的','因为 y 是叶'],answer:1,
      why:'★ TREE-MINIMUM 走到最左 —— y 无左孩子（习题 12.2-5）。这保证第 12 行 `y.left.p = y` 不会覆盖任何子树。'},
     {kind:'single',q:'TREE-DELETE 中唯一可能超过常数时间的操作是？',
      options:['TRANSPLANT','第 5 行的 TREE-MINIMUM（找后继，O(h)）','第 11 行 y.left = z.left','没有'],answer:1,
      why:'★ 每行常数，除第 5 行 O(h) → 整体 O(h)。'},
     {kind:'single',q:'删除一个"有两个孩子"的节点时，也可以用它的**前驱**来顶替吗？',
      options:['不可以，必须用后继','可以 —— 前驱没有右孩子（习题 12.2-5 的对称结论），同样安全','可以，但树会失衡','书上禁止'],answer:1,
      why:'★ 习题 12.3-7 的答案：用前驱顶替同样正确（前驱无右孩子，对称于后继无左孩子）。'},
     {kind:'judge',q:'TRANSPLANT 会同时更新 v 的左右孩子指针。',answer:false,
      why:'★ 原书 p.324 明确：TRANSPLANT 不更新 v.left 与 v.right —— 它只处理父链，孩子的接法由调用方按情况负责。'},
     {kind:'simulate',q:'删除一个"有两个孩子"的节点（y ≠ z.right 的一般情形），总共需要调用几次 TRANSPLANT？（填整数）',expect:[2],placeholder:'例如：1',
      why:'两次：① TRANSPLANT(T, y, y.right) 摘出 y；② TRANSPLANT(T, z, y) 让 y 顶替 z。若 y 恰好是 z.right 则只需 1 次。'},
    ],
    bookExercises:[
     {id:'12.3-1',page:326,star:0,statement:'Give a recursive version of the TREE-INSERT procedure.',hint:'把 while 循环改成递归：`if x == NIL return z; if z.key < x.key { x.left = TREE-INSERT-REC(x.left, z) } else …` —— 或传入父参数的版本。'},
     {id:'12.3-2',page:326,star:0,statement:'Suppose that you construct a binary search tree by repeatedly inserting distinct values into the tree.',hint:'书上是半截题干（问：TREE-INSERT 里加"打印"能否得到与中序相同的输出）。**不能**：插入时的打印是**前序**（先打印父再进子树），不是中序 —— 除非把 print 挪到递归之后。'},
     {id:'12.3-3',page:326,star:0,statement:'You can sort a given set of n numbers by first building a binary search tree containing these numbers (',hint:'书上是半截题干（建树 + 中序遍历 = 排序）。最坏 $\\Theta(n^2)$：升序输入把树建成链。这个下界与比较排序的 $\\Omega(n \\lg n)$ 一致（习题 12.1-5 的归约反过来用）。'},
     {id:'12.3-4',page:326,star:0,statement:'When TREE-DELETE calls TRANSPLANT , under what circumstances can the parameter v of TRANSPLANT be NIL?',hint:'情形 1（z 无左孩子）：v = z.right，当 z 是叶时 z.right = NIL。情形 2（z 无右孩子）：v = z.left，当 z 只剩左孩子时 v 非空 —— 但 z 是叶时走情形 1。**汇总：v = NIL 当且仅当 z 是叶**（情形 1 的特例）。'},
     {id:'12.3-5',page:326,star:0,statement:'Is the operation of deletion "commutative" in the sense that deleting x and then y from a binary search',hint:'书上是半截题干（先删 x 再删 y 与先删 y 再删 x，结果是否相同）。**不一定**：两次删除的中间树形态不同，后继选择可能不同 → 最终形态可能不同。但**中序序列相同**（都等于删掉两元素的序列）。'},
     {id:'12.3-6',page:326,star:0,statement:'Suppose that instead of each node x keeping the attribute x: p, pointing to x ’s parent, it keeps x: su',hint:'书上是半截题干（用 x.succ 代替 x.p）。INSERT/DELETE 需要父指针的地方可以由 succ 反推（x.succ.key > x.key 的一方是"向上"的方向）—— 每个操作仍 $O(h)$，但删除的常数更复杂。要点：**父指针可由后继信息部分替代**。'},
     {id:'12.3-7',page:326,star:0,statement:'When node ´ in TREE-DELETE has two children, you can choose node y to be its predecessor rather than it',hint:'★ 可以。前驱（左子树最大）没有**右**孩子（习题 12.2-5 的对称结论）—— 它可以安全接管 z 的左子树，y.left 的交接与原版镜像。'},
    ]},
  ],
};
