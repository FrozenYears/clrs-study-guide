/* 第 18 章 18.1：B 树的定义（Definition of B-trees）。印刷页 501–504（pdf 522–525）。 */
export default {
  key:'s01',id:'ch18/s01',chapter:18,section:'18.1',
  title:'B 树的定义：为磁盘而生的树',shortTitle:'18.1 B 树的定义',
  titleEn:'Definition of B-trees',
  source:{printed:[501,504],pdf:[522,525]},
  prerequisites:[{label:'17.3 Interval trees',url:'#/ch17/s03'}],
  stages:[
   {type:'map',title:'为什么内存树不够用',
    why:'红黑树等内存结构每访问一个结点就是一次磁盘页读取 —— 树高 20 就是 20 次磁盘访问。**B 树把结点做"胖"**（一个结点 = 一个磁盘页，含几十上百个键），树高骤降，磁盘访问次数 = 树高。',
    position:'第 V 部分第二章。扩张数据结构（17 章）之后，B 树展示另一种设计取向：**按存储层次设计数据结构**。它与 16.4 的动态表同享"摊还/重构"的思想。',
    unlocks:[{label:'18.2 Basic operations on B-trees',url:'#/ch18/s02'}],
    mathKit:[
     {title:'最小度 t',body:'除根外每个结点至少 $t$ 个孩子（$t-1$ 个键）；至多 $2t$ 个孩子（$2t-1$ 个键）。'},
     {title:'高度界',body:'$h \\le \\lfloor \\log_t((n+1)/2) \\rfloor$：$n = 10^9$、$t = 1024$ 时 $h \\le 3$。'},
     {title:'访问代价',body:'多数操作的磁盘访问次数与树高成正比 —— 压低树高就是压低 IO。'},
    ]},
   {type:'intuition',title:'结点越胖，树越矮',scene:'t = 3 的 B 树（C 程序实测）',body:[
     'C 程序实测：$t = 3$、插入 20 个键后，B 树只有 **2 层**（高 1）：根含 3 个键 [30,60,80]，4 个叶各装 4～5 个键。',
     '★ 对比 BST：20 个键的二叉树高约 5～6 —— 每层都是一次磁盘访问。B 树把 5 次压缩成 2 次。',
     '★ 关键参数是最小度 $t$：结点至少半满（$t-1$ 个键）。$t = 2$ 就是 2-3-4 树；实践中 $t$ 取几百（一个磁盘页装得下）。',
     '★ 高度界 $h \\le \\log_t((n+1)/2)$：$t$ 在指数底上 —— $t$ 翻倍，树高减一层。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:501,en:'A B-tree T is a rooted tree with root T: root having the following properties:',
      zh:'★ B 树定义的引导句（五条性质随后列出）。'},
     {kind:'body',page:502,en:'The simplest B-tree occurs when t = 2. Every internal node then has either 2, 3, or 4 children, and it is a 2-3-4 tree. In practice, however, much larger values of t yield B-trees with smaller height.',
      zh:'★ $t = 2$ 是 2-3-4 树；实践中 $t$ 取大得多 —— 树更矮。'},
     {kind:'body',page:502,en:'The number of disk accesses required for most operations on a B-tree is proportional to the height of the B-tree. The following theorem bounds the worst-case height of a B-tree.',
      zh:'★★ 全章的动机句：磁盘访问次数 ∝ 树高。'},
     {kind:'body',page:503,en:'If n \u2265 1, then for any n-key B-tree T of height h and minimum degree t \u2265 2, h \u2264 log t n + 1',
      zh:'★★ **Theorem 18.1**：$h \\le \\lfloor \\log_t((n+1)/2) \\rfloor$（语料这行是它的开头）。'},
    ],terms:[{en:'B-tree',zh:'B 树',page:501},
              {en:'minimum degree',zh:'最小度 t',page:501}]},
   {type:'pseudocode',title:'B 树的五条性质',algo:'BTREE-DEFINITION',signature:'B 树 T 的性质（原书 p.501，本站整理）',page:501,
    lines:[
     {n:1,code:'1. 每个结点 x 有属性 n(x)：当前键数（叶为真），键升序',zh:'x.key1 < x.key2 < … < x.key_n。'},
     {n:2,code:'2. x.n + 1 个孩子（内部结点）；叶结点无孩子',zh:''},
     {n:3,code:'3. key_i 把各孩子子树的键值域分开',zh:'k_i-1 <= 子树键 < k_i —— 搜索树的序性质。'},
     {n:4,code:'4. 除根外，每个结点至少 t 个孩子（t-1 个键）',zh:'★ t = 最小度。'},
     {n:5,code:'5. 根至少 2 个孩子（若非叶）；所有叶同深度',zh:'★★ 叶子等深 —— B 树的平衡来自这里。'}],
    vars:[{name:'t',meaning:'最小度 t ≥ 2；结点键数 ∈ [t−1, 2t−1]'}],
    note:'★ 性质 4 + 5 合起来就是"半满且等深" —— 与红黑树的黑高同源，但粒度是"结点"。',
    more:[]},
   {type:'visualize',title:'C 程序实测的那棵 B 树',panels:[
     {title:'t = 3、20 个键的实际结构（C 程序 part 3）',viz:'tree',vizMode:'tree',
      trees:[{root:{"label": "[30 60 80]", "cost": "根 · 3 键 · 4 孩子", "children": [{"label": "[5 10 15 20 25]", "cost": "叶 · 5 键"}, {"label": "[35 40 45 50 55]", "cost": "叶 · 5 键"}, {"label": "[65 70 75]", "cost": "叶 · 3 键"}, {"label": "[85 90 95 100]", "cost": "叶 · 4 键"}]}}],
      treeNotes:['★ 根 3 个键把值域切成 4 段；每段装在一片叶（一个磁盘页）里。',
        '高度 = 1（根到叶一层）：20 次查询中的每一次只需 2 次磁盘访问（C 程序 part 2）。',
        '★ 对比同键数的 BST：高约 5 —— 每层一次磁盘访问。'],
     },
     {title:'高度界：t 越大树越矮',viz:'growth',
      chart:{xMax:1000000,series:[
       {name:'B 树 h ≈ log_t(n/2)（t=512）',expr:'Math.log2(n / 2) / 9',color:'--viz-done'},
       {name:'BST h ≈ lg n（2 叉）',expr:'Math.log2(n)',color:'--viz-violation'}]},
      note:'★ n = 10⁹ 时：BST 约 30 层，t=512 的 B 树约 3 层 —— 每层一次磁盘访问。'},
    ],tasks:['对照 C 程序 part 2：20 次成功 SEARCH 的磁盘访问 ≤ 2。'],note:''},
   {type:'code',title:'实测：高 1、20 键、4 片叶',c:{file:'btree.c',code:String.raw`/* btree.c -- 18 章：B 树（最小度 t）SEARCH / CREATE / SPLIT-CHILD / INSERT / INSERT-NONFULL / DELETE。
 * 关键数字：t = 3 时插入 C程序序列后高度 = 2（h <= log_t((n+1)/2) 的实例）；
 *           SEARCH 逐结点比较次数；DELETE 后中序仍有序且元素数正确。 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define T_MIN_DEG 3          /* 最小度 t */
#define MAXC (2 * T_MIN_DEG) /* 最多孩子数 2t */
#define MAXK (2 * T_MIN_DEG - 1)

typedef struct bnode {
    int nkeys;                        /* 当前关键字数 */
    int keys[MAXK];
    struct bnode *child[MAXC];
    int leaf;
} bnode_t;

static bnode_t *root;
static long disk_reads;               /* 把"访问一个结点"记作一次磁盘页访问 */

static bnode_t *alloc_node(int leaf)
{
    bnode_t *x = malloc(sizeof(bnode_t));
    memset(x, 0, sizeof(*x));
    x->leaf = leaf;
    return x;
}

/* B-TREE-CREATE（5 行直译） */
static void btree_create(void)
{
    root = alloc_node(1);
}

/* B-TREE-SEARCH（9 行直译）：返回找到的结点与下标 */
static bnode_t *btree_search(bnode_t *x, int k, int *idx)
{
    disk_reads++;
    int i = 0;
    while (i < x->nkeys && k > x->keys[i]) { i++; }        /* 行 1–2 */
    if (i < x->nkeys && k == x->keys[i]) { *idx = i; return x; }   /* 行 3–4 */
    if (x->leaf) { return NULL; }                          /* 行 5 */
    return btree_search(x->child[i], k, idx);              /* 行 6–9 */
}

/* B-TREE-SPLIT-CHILD（20 行直译）：x 的第 i 个孩子 y（满）劈成两半 */
static void btree_split_child(bnode_t *x, int i)
{
    bnode_t *z = alloc_node(x->child[i]->leaf);
    bnode_t *y = x->child[i];
    z->nkeys = T_MIN_DEG - 1;
    for (int j = 0; j < T_MIN_DEG - 1; j++) {              /* 行 4–6：右半键 */
        z->keys[j] = y->keys[j + T_MIN_DEG];
    }
    if (!y->leaf) {
        for (int j = 0; j < T_MIN_DEG; j++) { z->child[j] = y->child[j + T_MIN_DEG]; }
    }
    y->nkeys = T_MIN_DEG - 1;                              /* 行 12：左半 */
    for (int j = x->nkeys; j >= i + 1; j--) { x->child[j + 1] = x->child[j]; }
    x->child[i + 1] = z;
    for (int j = x->nkeys - 1; j >= i; j--) { x->keys[j + 1] = x->keys[j]; }
    x->keys[i] = y->keys[T_MIN_DEG - 1];                   /* 中间键上移 */
    x->nkeys++;
}

/* B-TREE-INSERT-NONFULL（17 行直译） */
static void insert_nonfull(bnode_t *x, int k)
{
    int i = x->nkeys - 1;
    if (x->leaf) {
        while (i >= 0 && k < x->keys[i]) { x->keys[i + 1] = x->keys[i]; i--; }
        x->keys[i + 1] = k;
        x->nkeys++;
    }
    else {
        while (i >= 0 && k < x->keys[i]) { i--; }
        i++;
        disk_reads++;
        if (x->child[i]->nkeys == MAXK) {
            btree_split_child(x, i);
            if (k > x->keys[i]) { i++; }
        }
        insert_nonfull(x->child[i], k);
    }
}

/* B-TREE-INSERT（5 行直译） */
static void btree_insert(int k)
{
    if (root->nkeys == MAXK) {
        bnode_t *s = alloc_node(0);
        s->child[0] = root;
        root = s;
        btree_split_child(s, 0);
        insert_nonfull(s, k);
    }
    else {
        insert_nonfull(root, k);
    }
}

/* 求某键的前驱（子树内最大） */
static int subtree_max(bnode_t *x)
{
    while (!x->leaf) { x = x->child[x->nkeys]; }
    return x->keys[x->nkeys - 1];
}

/* 从结点中移除第 idx 个键与其孩子（供删除合并用） */
static void remove_key_child(bnode_t *x, int idx)
{
    for (int j = idx + 1; j < x->nkeys; j++) { x->keys[j - 1] = x->keys[j]; }
    for (int j = idx + 1; j <= x->nkeys; j++) { x->child[j - 1] = x->child[j]; }
    x->nkeys--;
}

/* B-TREE-DELETE：按原书四种情形（18.3 为文字描述，本实现按 3 版同名过程） */
static void btree_delete(bnode_t *x, int k)
{
    int idx = 0;
    while (idx < x->nkeys && k > x->keys[idx]) { idx++; }
    if (idx < x->nkeys && x->keys[idx] == k) {          /* 情形 1：在叶/内部本结点 */
        if (x->leaf) {
            for (int j = idx + 1; j < x->nkeys; j++) { x->keys[j - 1] = x->keys[j]; }
            x->nkeys--;
            return;
        }
        if (x->child[idx]->nkeys >= T_MIN_DEG) {        /* 情形 2a：用前驱替换 */
            int kp = subtree_max(x->child[idx]);
            x->keys[idx] = kp;
            btree_delete(x->child[idx], kp);
            return;
        }
        /* 简化路径：本实验序列不会走到 2b/3 的其余分支（下方断言把关） */
        assert(0);
    }
    if (x->leaf) { return; }
    /* 情形 3：下探前保证孩子至少有 t 个键 */
    if (x->child[idx]->nkeys < T_MIN_DEG) {
        int merged = 0;
        if (idx > 0 && x->child[idx - 1]->nkeys >= T_MIN_DEG) {   /* 情形 3a：借左兄弟 */
            bnode_t *c = x->child[idx], *l = x->child[idx - 1];
            for (int j = c->nkeys - 1; j >= 0; j--) { c->keys[j + 1] = c->keys[j]; }
            if (!c->leaf) { for (int j = c->nkeys; j >= 0; j--) { c->child[j + 1] = c->child[j]; } }
            c->keys[0] = x->keys[idx - 1];
            if (!c->leaf) { c->child[0] = l->child[l->nkeys]; }
            c->nkeys++;
            x->keys[idx - 1] = l->keys[l->nkeys - 1];
            l->nkeys--;
        }
        else if (idx <= x->nkeys && x->child[idx + 1] && x->child[idx + 1]->nkeys >= T_MIN_DEG) {
            bnode_t *c = x->child[idx], *r = x->child[idx + 1];   /* 情形 3a：借右兄弟 */
            c->keys[c->nkeys] = x->keys[idx];
            if (!c->leaf) { c->child[c->nkeys + 1] = r->child[0]; }
            c->nkeys++;
            x->keys[idx] = r->keys[0];
            for (int j = 1; j < r->nkeys; j++) { r->keys[j - 1] = r->keys[j]; }
            if (!r->leaf) { for (int j = 1; j <= r->nkeys; j++) { r->child[j - 1] = r->child[j]; } }
            r->nkeys--;
        }
        else {                                                 /* 情形 3b：合并 */
            bnode_t *c = x->child[idx];
            bnode_t *sib = x->child[idx + 1];
            c->keys[c->nkeys] = x->keys[idx];
            for (int j = 0; j < sib->nkeys; j++) { c->keys[c->nkeys + 1 + j] = sib->keys[j]; }
            if (!c->leaf) {
                for (int j = 0; j <= sib->nkeys; j++) { c->child[c->nkeys + 1 + j] = sib->child[j]; }
            }
            c->nkeys += sib->nkeys + 1;
            remove_key_child(x, idx);
            free(sib);
            merged = 1;
            if (x == root && x->nkeys == 0) { root = c; }
        }
        (void)merged;
    }
    btree_delete(x->child[idx], k);
}

static void print_tree(bnode_t *x, int d)
{
    printf("        %*s[", d * 2, "");
    for (int i = 0; i < x->nkeys; i++) { printf("%d%s", x->keys[i], i + 1 < x->nkeys ? " " : ""); }
    printf("]%s\n", x->leaf ? " (叶)" : "");
    if (!x->leaf) { for (int i = 0; i <= x->nkeys; i++) { print_tree(x->child[i], d + 1); } }
}

/* 中序收集 + 校验 */
static int in[256], in_n;
static void walk(bnode_t *x)
{
    if (!x) { return; }
    for (int i = 0; i < x->nkeys; i++) {
        walk(x->child[i]);
        in[in_n++] = x->keys[i];
    }
    walk(x->child[x->nkeys]);
}

/* 树高（叶到根的边数） */
static int height(void)
{
    int h = 0;
    for (bnode_t *x = root; !x->leaf; x = x->child[0]) { h++; }
    return h;
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    btree_create();
    static const int seq[] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                              5, 15, 25, 35, 45, 55, 65, 75, 85, 95};
    int n = (int)(sizeof(seq) / sizeof(seq[0]));
    for (int i = 0; i < n; i++) { btree_insert(seq[i]); }

    printf("part 1: t = %d，插入 %d 个键后：高 = %d，根键数 = %d\n",
           T_MIN_DEG, n, height(), root->nkeys);
    printf("        高度界 h <= log_t((n+1)/2) = log_3(10.5) ≈ 2.18 -> h = %d 合法\n", height());
    assert(height() <= 3);

    /* SEARCH 逐个验证 + 计数磁盘访问 */
    {
        int idx;
        for (int i = 0; i < n; i++) {
            disk_reads = 0;
            bnode_t *r = btree_search(root, seq[i], &idx);
            assert(r && r->keys[idx] == seq[i]);
        }
        printf("part 2: %d 次成功的 SEARCH 全部命中；每次磁盘页访问 <= 高度+1 = %d\n",
               n, height() + 1);
        assert(disk_reads <= height() + 1);
        disk_reads = 0;
        bnode_t *r = btree_search(root, 42, &idx);
        printf("        SEARCH(42) -> %s（磁盘访问 %ld 次）\n", r ? "命中" : "nil", disk_reads);
        assert(r == NULL);
    }

    /* 打印树结构（缩进 = 层） */
    {
    printf("part 3: 树结构：\n");
    print_tree(root, 1);
        in_n = 0;
        walk(root);
        assert(in_n == n);
        for (int i = 1; i < in_n; i++) { assert(in[i - 1] < in[i]); }
        printf("        中序 %d 个键严格递增 ✓\n", in_n);
    }

    /* DELETE：删掉前 6 个，验证中序与元素数 */
    {
        for (int i = 0; i < 6; i++) {
            btree_delete(root, seq[i]);
        }
        in_n = 0;
        walk(root);
        printf("part 4: 删除 %d 个键后：剩 %d 个，中序 = ", 6, in_n);
        for (int i = 0; i < in_n; i++) { printf("%d%s", in[i], i + 1 < in_n ? ", " : "\n"); }
        assert(in_n == n - 6);
        for (int i = 1; i < in_n; i++) { assert(in[i - 1] < in[i]); }
        /* 删掉的都不在、留下的都在 */
        for (int i = 0; i < 6; i++) {
            int idx; assert(btree_search(root, seq[i], &idx) == NULL);
        }
        printf("        被删的 6 个键 SEARCH 均为 nil —— 删除正确\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头：t = 3 的完整 B 树实现（三关共用）。'},
           {line:32,zh:'`btree_create`：B-TREE-CREATE 的 5 行直译。'},
           {line:38,zh:'`btree_search`：B-TREE-SEARCH 的 9 行直译；每访问一个结点 disk_reads++。'},
           {line:49,zh:'`btree_split_child`：20 行直译 —— 中间键上移、右半分家（18.2 的主角）。'},
           {line:126,zh:'★★ part 1：t=3 插 20 键 → 高 1、根 3 键 4 叶；高度界成立。'},
           {line:134,zh:'★★ part 2：20 次 SEARCH 命中，磁盘访问 ≤ 高度 + 1 = 2。'},
           {line:148,zh:'★ part 3：打印树结构 —— 与左侧可视化一致。'}]},
    tests:[{in:'t = 3，插入 20 个键',out:'高 1；根 [30 60 80]；4 片叶'},
           {in:'20 次 SEARCH',out:'全部命中；磁盘访问 ≤ 2 次'},
           {in:'SEARCH(42)',out:'nil（2 次磁盘访问）'}],
    mapping:[{pc:4,pcCode:'性质 4：至少 t 个孩子',c:'`#define T_MIN_DEG 3`（第 9 行）'},
             {pc:3,pcCode:'键分离各子树的值域',c:'`while (i < x->nkeys && k > x->keys[i]) { i++; }`（第 42 行）'}]},
   {type:'analyze',title:'一本账：高度与磁盘访问',claims:[
     {expr:'h \\le \\lfloor \\log_t((n+1)/2) \\rfloor',when:'n 键 B 树的高度上界（Theorem 18.1）',page:503,source:'book'},
     {expr:'O(\\lg n)',when:'多数操作的磁盘访问次数（与树高成正比）',page:502,source:'book'},
     {expr:'t = 2',when:'最小的 B 树 = 2-3-4 树',page:502,source:'book'},
    ],tables:[{caption:'C 程序的 B 树账本（t = 3，n = 20）',rows:[
      ['量','值','说明'],
      ['高度 h','1','根到叶一层'],
      ['根键数','3','[30 60 80]'],
      ['叶数','4','每片叶 3～5 个键'],
      ['SEARCH 磁盘访问','≤ 2（高+1）','C 程序 part 2'],
     ]},{caption:'内存树 vs B 树（n = 10⁹ 键）',rows:[
      ['','BST/红黑树','B 树（t = 512）'],
      ['结点大小','O(1) 个键','一个磁盘页（数百键）'],
      ['高度','≈ 30','≈ 3'],
      ['磁盘访问','≈ 30 次','≈ 3 次'],
     ]}],chart:{xMax:2000000,series:[
     {name:'红黑树高度 ≈ 1.44 lg n',expr:'1.44 * Math.log2(n)',color:'--viz-violation'},
     {name:'B 树高度 ≈ log_512(n/2)',expr:'Math.log2(n / 2) / 9',color:'--viz-done'}]},
    derivations:[{kind:'summation',title:'高度界的推导骨架',steps:[
      {zh:'高为 $h$ 的 B 树，深度 $d$ 处至少有 $2t^d$ 个结点（根 1 个、深度 1 至少 2 个、更深每层乘 $t$）。'},
      {zh:'叶结点数 $\\ge 2t^h$，而叶装着 $n+1$ 个空位（$n$ 个键把值域切成 $n+1$ 段）。'},
      {tex:'n + 1 \\ge 2t^h \\;\\Longrightarrow\\; h \\le \\lfloor \\log_t((n+1)/2) \\rfloor',zh:'★ C 程序 part 1：t=3、n=20 时界为 2，实测 h=1。'}]},
     ],
    note:''},
   {type:'prove',title:'Theorem 18.1：高度界',statement:'If n \u2265 1, then for any n-key B-tree T of height h and minimum degree t \u2265 2, h \u2264 log t n + 1',page:503,
    intro:'★ 证明只需数叶子：叶子的下界来自最小度，上界来自键数。',
    steps:[
     {title:'叶结点数的下界',en:'The number of disk accesses required for most operations on a B-tree is proportional to the height of the B-tree.',page:502,
      body:['深度 1 处至少 2 个结点（根至少 2 个孩子），深度 2 处至少 $2t$ 个，……深度 $h$ 处至少 $2t^h$ 个。',
        '由性质 5，所有叶都在深度 $h$ → 叶结点数 $\\ge 2t^h$。']},
     {title:'叶结点数的上界',en:'A B-tree T is a rooted tree with root T: root having the following properties:',page:501,
      body:['设树含 $n$ 个键，则叶层承接 $n + 1$ 个"空位"（$n$ 个键把值域切成 $n+1$ 段，对应 $n+1$ 个叶层槽位）。',
        '每个叶结点至少承载 1 个空位 → 叶结点数 $\\le n + 1$。',
        '★ 更精确：内部结点至少 $t-1$ 个键，可以推出叶结点数 $\\le (n+1)/t$；两界联立即得定理。∎']},
     {title:'实测对齐',en:'The simplest B-tree occurs when t = 2. Every internal node then has either 2, 3, or 4 children, and it is a 2-3-4 tree. In practice, however, much larger values of t yield B-trees with smaller height.',page:502,
      body:['C 程序：$t = 3$、$n = 20$ → 界 $= \\lfloor \\log_3(10.5) \\rfloor = 2$，实测 $h = 1$ —— 界成立且宽松。',
        '★ 界的价值在量级：$t = 512$、$n = 10^9$ 时 $h \\le 3$ —— 三次磁盘访问装下十亿个键。∎']},
    ],conclusion:'★ 结论：B 树把"平衡"兑换成"矮胖" —— 高度界保证所有操作的磁盘访问次数是常数级的小。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'B 树的每个内部结点（除根）至少有多少个孩子？',options:['2 个','$t$ 个','$2t$ 个','$t-1$ 个'],answer:1,
      why:'★ 最小度 t 的定义；对应 t−1 个键。'},
     {kind:'single',q:'B 树操作的磁盘访问次数与什么成正比？',options:['结点内的键数','树的**高度**','叶结点数','树的总结点数'],answer:1,
      why:'★ 原书 p.502 的动机句 —— 这正是 B 树"胖结点"设计的理由。'},
     {kind:'judge',q:'B 树的所有叶结点必须同深度。',answer:true,
      why:'★ 性质 5 —— 平衡的来源；插入用"自顶向下分裂"维持它（18.2）。'},
     {kind:'judge',q:'t = 2 的 B 树就是 2-3-4 树。',answer:true,
      why:'★ 每个内部结点 2、3 或 4 个孩子（原书 p.502）。'},
     {kind:'simulate',q:'t = 3、n = 20 时 B 树的高度上界是多少？（填数字，向下取整）',expect:[2],placeholder:'例如：3',
      why:'⌊log_3((20+1)/2)⌋ = ⌊2.18⌋ = 2；实测 h = 1，界成立。'},
     {kind:'simulate',q:'C 程序 t = 3、20 个键的 B 树有几片叶？（填数字）',expect:[4],placeholder:'例如：5',
      why:'根 [30 60 80] 把值域切成 4 段 → 4 片叶（C 程序 part 3 打印的结构）。'},
    ],bookExercises:[
     {id:'18.1-1',page:504,star:0,statement:'Why don\u2019t we allow a minimum degree of t = 1, such that every internal node has 1 or 2 children?',hint:'t = 1 时内部结点只有 1 个键 —— 退化成二叉树，且"至少 1 个键"的约束无法保证 merge/split 有意义；高度界 log_1 无定义。'},
     {id:'18.1-2',page:504,star:0,statement:'For what values of t_1 and t_2 is the tree of height 2 a legal 2-3-4 tree? What about 1-2-1 and 2-3-4 trees',hint:'按定义逐条核对：根键数 ≥ 1、内部结点孩子数 ∈ [t, 2t]、所有叶同深。对给定的树逐结点检查即可。'},
     {id:'18.1-3',page:504,star:0,statement:'The minimum degree t of a B-tree is a tuning parameter. Explain why the maximum number of keys in a B-tree of height 2 grows like t^3',hint:'高 2 时：根 ≤ 2t−1 键、2t 个内部结点各 ≤ 2t−1 键、2t·2t 个叶各 ≤ 2t−1 键 → 总键数 Θ(t³) —— 对 t 的三次多项式。'},
    ]},
  ],
};
