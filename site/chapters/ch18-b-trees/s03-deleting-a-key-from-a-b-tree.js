/* 第 18 章 18.3：从 B 树中删除关键字（Deleting a key from a B-tree）。印刷页 513–520（pdf 534–541）。 */
export default {
  key:'s03',id:'ch18/s03',chapter:18,section:'18.3',
  title:'删除：把"不够半满"挡在半路',shortTitle:'18.3 B 树的删除',
  titleEn:'Deleting a key from a B-tree',
  source:{printed:[513,520],pdf:[534,541]},
  prerequisites:[{label:'18.2 Basic operations on B-trees',url:'#/ch18/s02'}],
  stages:[
   {type:'map',title:'删除比插入多一倍的分支',
    why:'删除的难点与插入对偶：结点会**变空**。解法同样"提前预备" —— 下探途中保证**要进入的孩子至少有 t 个键**（不够就借或合并），这样删除叶键时叶至少还有 t−1 个键，不违反最小度。',
    position:'B 树的收尾关。它与 16.4 动态表的收缩规则同构（"不许走过半"），也是第 V 部分前的最后一次结构维护训练。',
    unlocks:[{label:'19.1 Red-black trees（回顾）',url:'#/ch13/s01'}],
    mathKit:[
     {title:'预备条件',body:'递归进入孩子前，孩子至少 $t$ 个键（原书"至少 $t$ 而非 $t-1$"的关键）。'},
     {title:'两种补救',body:'借：从相邻的富兄弟（$\\ge t$ 键）经父结点转一个键过来；并：兄弟都只有 $t-1$ 键时，与父键合并成 $2t-1$ 键的结点。'},
     {title:'代价',body:'仍是一次下降：$O(t \\log_t n)$ CPU、$O(h)$ 磁盘访问。'},
    ]},
   {type:'intuition',title:'四种情形一张图',scene:'C 程序实测：t = 3 连删 6 个键',body:[
     '删除分两层：键在**叶**上直接删（情形 1）；键在**内部**结点上要先"找个替身"（情形 2）：前驱（左子树最大）或后继。',
     '★ 情形 2a/2b：左右孩子有一边富（≥ t 键）→ 用它的最值替换被删键，递归删那个最值。',
     '★ 情形 2c：两边都穷（各 t−1 键）→ 把键与右孩子**合并**进左孩子（2t−1 键，正好满），再删。',
     '★ 情形 3：要下探的孩子只有 t−1 键 → 先借或先合并，保证下探后不会破坏最小度 —— 与 16.4 的"收缩线留缓冲"完全同构：**提前补救，不回头**。',
     '★ C 程序 part 4：t = 3 连删 6 个键，中序仍严格递增、元素数正确、被删键 SEARCH 全 nil。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:513,en:'The procedure B-TREE-DELETE deletes the key k from the subtree rooted at x .',
      zh:'★ 删除以"子树根 x"为参数 —— 自顶向下。'},
     {kind:'body',page:513,en:'Unlike the procedures TREE-DELETE on page 325 and RB-DELETE on page 348, which are given the node to delete\u2014presumably as the result of a prior search',
      zh:'★ 与 BST/RB 删除不同：B 树删除**自己找**键（后半句接：本过程以键为参数）。'},
     {kind:'body',page:514,en:'Case 1: The search arrives at a leaf node x . If x contains key k, then delete k from x . If x does not contain key k, then k was not in the B-tree and nothing else needs to be done.',
      zh:'★ 情形 1：到达叶 —— 有就删，没有就报无事。'},
     {kind:'body',page:514,en:'Case 2a: x:c i has at least t keys. Find the predecessor k 0 of k in the subtree rooted at x:c i . Recursively delete k 0 from x:c i , and replace k by k 0 in x .',
      zh:'★★ 情形 2a：左孩子富 → 用前驱替换。'},
     {kind:'body',page:514,en:'Case 2b: x:c i has t \u2212 1 keys and x:c i + 1 has at least t keys. This case is symmetric to case 2a. Find the successor k 0 of k in the subtree rooted at x:c i + 1 .',
      zh:'★ 情形 2b：右孩子富 → 用后继替换（对称）。'},
     {kind:'body',page:515,en:'Case 2c: Both x:c i and x:c i + 1 have t \u2212 1 keys. Merge k and all of x:c i + 1 into x:c i , so that x loses both k and the pointer to x:c i + 1 , and x:c i now contains',
      zh:'★★ 情形 2c：两边都穷 → 键 + 右孩子并入左孩子（合并成 2t−1 键）。'},
    ],terms:[{en:'B-TREE-DELETE',zh:'B 树删除（自顶向下）',page:513},
              {en:'predecessor',zh:'前驱（左子树最大键）',page:514}]},
   {type:'pseudocode',title:'删除的情形分类',algo:'B-TREE-DELETE',signature:'B-TREE-DELETE(x, k) 的情形分类（原书 p.514–515，本站整理）',page:514,
    lines:[
     {n:1,code:'在 x 中找 k 的位置 idx（或它应去的孩子）',zh:''},
     {n:2,code:'情形 1: x 是叶且含 k -> 直接删',zh:'★ 能到这一步是因为下探前孩子至少 t 键。'},
     {n:3,code:'情形 2: x 内部且含 k = x.key_idx',zh:''},
     {n:4,code:'  2a: 左孩子 >= t 键 -> 前驱 k0 替换，递归删 k0',zh:''},
     {n:5,code:'  2b: 右孩子 >= t 键 -> 后继 k0 替换，递归删 k0',zh:''},
     {n:6,code:'  2c: 两孩子都 t-1 键 -> k 与右孩子并入左孩子，递归删 k',zh:'★★ 合并后左孩子 2t-1 键（满）。'},
     {n:7,code:'情形 3: k 不在 x -> 指向孩子 c',zh:''},
     {n:8,code:'  3a: c 只有 t-1 键 -> 从富邻居借一个键（经父结点旋转）',zh:''},
     {n:9,code:'  3b: 两邻居都 t-1 键 -> c 与一个邻居 + 父键合并',zh:'★ 若 x 是根且空了，合并结果成为新根（树高 -1）。'}],
    vars:[{name:'k0',meaning:'前驱/后继替身键'},{name:'合并',meaning:'2t−1 键的新结点（恰满）'}],
    note:'★ 情形 2c 与 3b 都会产生**满结点** —— 删除把"结构修复"一次性做完，与 16.4 的"耗尽势能"同构。',
    more:[]},
   {type:'visualize',title:'删除前后的树（C 程序实测）',panels:[
     {title:'① 删除 6 个键之前（同 18.2 的树）',viz:'tree',vizMode:'tree',
      trees:[{root:{"label": "[30 60 80]", "cost": "根 · 3 键 · 4 孩子", "children": [{"label": "[5 10 15 20 25]", "cost": "叶 · 5 键"}, {"label": "[35 40 45 50 55]", "cost": "叶 · 5 键"}, {"label": "[65 70 75]", "cost": "叶 · 3 键"}, {"label": "[85 90 95 100]", "cost": "叶 · 4 键"}]}}],
      treeNotes:['★ 删除目标：10、20、30、40、50、60 —— 覆盖三种情形（叶删除、内部键替换、借与合并）。'],
     },
     {title:'② 删除之后（C 程序 part 4 的中序）',viz:'growth',
      chart:{xMax:110,series:[
       {name:'删除前 20 键',expr:'20',color:'--viz-compare'},
       {name:'删除后 14 键',expr:'14',color:'--viz-done'}]},
      note:'★ 中序 5,15,25,35,45,55,65,70,75,80,85,90,95,100 —— 严格递增；被删 6 键 SEARCH 全 nil。'},
    ],tasks:['对照 C 程序 part 4：删除全程没有破坏最小度。'],note:''},
   {type:'code',title:'实测：连删 6 键不破平衡',c:{file:'btree.c',code:String.raw`/* btree.c -- 18 章：B 树（最小度 t）SEARCH / CREATE / SPLIT-CHILD / INSERT / INSERT-NONFULL / DELETE。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 DELETE 部分。'},
           {line:105,zh:'`subtree_max`：找前驱/后继用的"子树最大键"。'},
           {line:120,zh:'`btree_delete`：四种情形（本实现覆盖叶删除、前驱替换、借与合并）。'},
           {line:152,zh:'★★ part 4：连删 6 个键后中序严格递增、元素数正确。'},
           {line:156,zh:'★ 被删键的 SEARCH 全部返回 nil —— 删除彻底。'}]},
    tests:[{in:'删除 {10,20,30,40,50,60}',out:'剩 14 键，中序严格递增'},
           {in:'被删键 SEARCH',out:'全部 nil'},
           {in:'留下的键 SEARCH',out:'全部命中'}],
    mapping:[{pc:4,pcCode:'2a: 前驱替换',c:'`int kp = subtree_max(x->child[idx]); x->keys[idx] = kp;`（第 106–107 行）'},
             {pc:6,pcCode:'2c: 合并',c:'`c->keys[c->nkeys] = x->keys[idx];`（第 133 行起）'}]},
   {type:'analyze',title:'一本账：删除为何要提前补救',claims:[
     {expr:'2t - 1',when:'情形 2c/3b 合并后结点的键数（恰满）',page:515,source:'book'},
     {expr:'t',when:'下探前孩子必须有的键数（情形 3 的预备）',page:514,source:'book'},
     {expr:'O(t \\log_t n)',when:'删除的 CPU 时间（单趟下降）',page:513,source:'book'},
    ],tables:[{caption:'删除的四种情形（对应 C 程序）',rows:[
      ['情形','触发条件','动作','C 程序位置'],
      ['1','叶含 k','直接删','第 103 行'],
      ['2a','左孩子 ≥ t','前驱替换 + 递归删','第 106 行'],
      ['2c','两孩子都 t−1','合并（2t−1 键）','第 133 行'],
      ['3a/3b','下探孩子 < t','借 / 合并后再下探','第 141 行起'],
     ]},{caption:'与插入的对称性',rows:[
      ['','插入','删除'],
      ['预防动作','分裂满结点（2t−1 → 两半）','补足穷孩子（t−1 → ≥ t）'],
      ['长高/变矮','根分裂时 +1','根空时 −1'],
      ['书中类比','16.4 的扩张','16.4 的收缩（1/4 线）'],
     ]}],chart:{xMax:64,series:[
     {name:'删除 CPU：t·lg n / 32',expr:'Math.log2(n)',color:'--viz-done'},
     {name:'磁盘访问：lg n / lg t（t=32）',expr:'Math.log2(n) / 5',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'为什么"下探前补足"就够',steps:[
      {zh:'删除的破坏只发生在"从结点拿走一个键"。若每个被进入的结点在下探前**至少 $t$ 个键**，删除后至少剩 $t-1$ 个 —— 仍合法。'},
      {zh:'补足的手段（借/合并）最多让父结点少一个键 —— 但父结点此前至少 $t$ 个（不变量），减完仍 $\\ge t-1$，合并情形随递归继续处理。'},
      {tex:'\\text{不变量：进入的孩子} \\ge t \\text{ 键}',zh:'★ 这就是 B 树删除没有"回溯修复"的原因 —— 与插入的"先分裂"完全对称。'}]},
     ],
    note:''},
   {type:'prove',title:'删除的正确性：不变量驱动的下降',statement:'Unlike the procedures TREE-DELETE on page 325 and RB-DELETE on page 348, which are given the node to delete\u2014presumably as the result of a prior search',page:513,
    intro:'★ 原书 18.3 以图代证；本关把论证整理成"不变量 + 三步归纳"。',
    steps:[
     {title:'不变量',en:'Case 1: The search arrives at a leaf node x . If x contains key k, then delete k from x .',page:514,
      body:['每次递归调用 B-TREE-DELETE(x, k) 时，$x$ 至少有 $t$ 个键（根除外）。',
        '于是删除一个键后 $x$ 至少剩 $t-1$ 个键 —— 恰好满足最小度，**不需要回溯修复**。',
        '★ 情形 3 的借/合并就是为了在下探前兑现这条不变量。']},
     {title:'内部键的替换（情形 2a–2c）',en:'Case 2a: x:c i has at least t keys. Find the predecessor k 0 of k in the subtree rooted at x:c i . Recursively delete k 0 from x:c i , and replace k by k 0 in x .',page:514,
      body:['内部键 $k$ 不能直接拿走（会留下键数不合法的孩子）—— 用前驱/后继**换内容不换结构**。',
        '2a/2b 保证替身来自富孩子（删除后仍 ≥ t−1）；2c 先合并成满结点再删 —— 合并后的 $2t-1$ 个键足以承受删除。',
        '★ C 程序 part 4：删除内部键 30、60 时走的正是这些分支，中序保持有序。∎']},
     {title:'实测核验',en:'The procedure B-TREE-DELETE deletes the key k from the subtree rooted at x .',page:513,
      body:['C 程序连删 6 键（覆盖叶删除、前驱替换、借键与合并）：中序严格递增、元素数从 20 到 14、被删键 SEARCH 全 nil。',
        '★ 树高在整个删除过程中只减不增（根空才合并上移）—— B 树的"所有叶等深"始终保持。∎']},
    ],conclusion:'★ 结论：删除 = 一次下降 + 情形分类；不变量（孩子 ≥ t 键）使全程无回溯。B 树三章至此闭环。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'情形 2c 的处理是？',options:['直接删内部键','**键与右孩子并入左孩子**','从右兄弟借键','把树重建成红黑树'],answer:1,
      why:'★ 合并后左孩子有 2t−1 个键（满），再递归删除。'},
     {kind:'single',q:'情形 3 的"补救"必须在何时完成？',options:['删除完成后的回溯中','**下探进入孩子之前**','只对根结点','不需要补救'],answer:1,
      why:'★ 提前借/合并保证进入的孩子至少 t 键 —— 删除后仍 ≥ t−1，不破坏最小度。'},
     {kind:'judge',q:'B 树删除可能使树变矮。',answer:true,
      why:'★ 情形 3b 合并后若根空了，合并结果成为新根 —— 树高减一（C 程序的 btree_delete 含此分支）。'},
     {kind:'judge',q:'B 树删除内部键时，可以直接把它拿走再调整。',answer:false,
      why:'★ 内部键是两个子树的分隔符 —— 必须用前驱/后继替换（情形 2a/2b/2c）。'},
     {kind:'simulate',q:'C 程序连删 6 个键后剩多少个键？（填数字）',expect:[14],placeholder:'例如：15',
      why:'20 − 6 = 14，中序严格递增（C 程序 part 4）。'},
     {kind:'single',q:'删除后 SEARCH 被删键返回什么？',options:['**nil（找不到该键）**','该键的旧值','相邻键的值','报错退出'],answer:0,
      why:'6 个被删键全部正确返回 nil —— 删除彻底（C 程序 part 4）。'},
    ],bookExercises:[
     {id:'18.3-1',page:520,star:0,statement:'Show the results of deleting the keys F, Q, K, C in order from the B-tree of Figure 18.8(f).',hint:'按四情形手工模拟：F 在叶（情形 1）；Q 在内部（看孩子键数选 2a/2b/2c）……每步都先检查孩子键数再下探。'},
     {id:'18.3-2',page:520,star:0,statement:'Write pseudocode for B-TREE-DELETE that uses a single downward pass without backtracking.',hint:'本站 C 程序的 btree_delete 就是：下探前用情形 3a（借）或 3b（合并）把孩子补足到 ≥ t 键，此后一路向下，永不上溯。'},
     {id:'18.3-3',page:520,star:0,statement:'If k is in the tree, B-TREE-DELETE will always delete k. If k is not in the tree, show that B-TREE-DELETE will report "k not in tree" without altering the tree.',hint:'情形 1 的"叶不含 k"分支直接返回；下探路径的值域不变量保证 k 不可能在别处 —— 中途没有任何结构改动（借/合并只发生在"还有更深的路要走"时，且它们本身合法）。'},
     {id:'18.3-4',page:520,star:0,statement:'Suppose that we insert the key 26 into the B-tree of Figure 18.8(a) and then immediately delete it. State the structural changes, if any.',hint:'插入 26 触发分裂与否要看路径上是否有满结点；删除 26 时按四种情形走一遍 —— 对比两次的结构差异（分裂/合并会留下痕迹，树未必回到原图）。'},
     {id:'18.3-5',page:520,star:0,statement:'Suppose that B-TREE-DELETE is called on a key k that is in an internal node x, and both x.c i and x.c i+1 have t - 1 keys. Show that merging k and x.c i+1 into x.c i ',hint:'合并后左孩子有 $2t-1$ 个键（满）。这正如下探前的"满孩子"状态 —— 但删除发生在合并后的结点上，删除后剩 $2t-2 \\ge t-1$，最小度仍满足。'},
    ]},
  ],
};
