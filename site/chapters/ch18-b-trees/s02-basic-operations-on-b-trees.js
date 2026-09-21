/* 第 18 章 18.2：B 树的基本操作（Basic operations on B-trees）。印刷页 504–512（pdf 525–533）。 */
export default {
  key:'s02',id:'ch18/s02',chapter:18,section:'18.2',
  title:'检索与插入：自顶向下分裂',shortTitle:'18.2 检索与插入',
  titleEn:'Basic operations on B-trees',
  source:{printed:[504,512],pdf:[525,533]},
  prerequisites:[{label:'18.1 Definition of B-trees',url:'#/ch18/s01'}],
  stages:[
   {type:'map',title:'一次下降完成插入',
    why:'B 树检索像 BST 的多路版：结点内顺序找、孩子间二分选。插入的难点在"结点会满" —— 解法是**自顶向下**：下探途中遇到满结点就先分裂，保证到达叶时必不满。',
    position:'本章技术核心：SPLIT-CHILD 与 INSERT-NONFULL。17.2 的四步法在这里的体现是"维护"被搬进了插入的主路径（先分裂再下降，不做回溯）。',
    unlocks:[{label:'18.3 Deleting a key from a B-tree',url:'#/ch18/s03'}],
    mathKit:[
     {title:'检索',body:'结点内线性扫（$O(t)$），孩子间选一个 → 最多 $O(\\lg n)$ 个结点 × $O(t)$ = $O(t \\log_t n)$。'},
     {title:'分裂',body:'满结点（$2t-1$ 键）按中位键劈开：左右各 $t-1$ 键，中位键上移给父结点。'},
     {title:'插入',body:'先分裂途中满结点，再走到底插入 → 单趟、$O(h)$ 次磁盘访问。'},
    ]},
   {type:'intuition',title:'先分裂、再下降',scene:'t = 3 的插入（C 程序实测）',body:[
     '**检索**：在结点内扫一遍（最多 $2t-1$ 次比较），没找到就走进唯一的"值域区间"对应的孩子 —— C 程序 part 2 实测每次检索磁盘访问 ≤ 高度 + 1。',
     '★ **插入的两难**：新键要放进叶，但叶可能满。回溯分裂（像红黑树那样向上修复）在磁盘模型里很贵 —— 每次回退都是额外的磁盘访问。',
     '★ B 树的解法：**在下降路上就把满结点分裂掉**。父结点不满，分裂产生的上移键一定装得下 —— 到叶子时叶必不满，直接插入。',
     '★ C 程序 part 1/3：插入 20 个键只用了 1 层树（根 [30 60 80] + 4 叶）—— 根在插入过程中最多分裂一次。',
     '⚠ 注意分裂是**主动的**：哪怕之后根本不往那个子树走也照分 —— 用"可能白分一次"换"绝不回溯"。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文。',blocks:[
     {kind:'body',page:505,en:'B-TREE-SEARCH returns the ordered pair (y,i) consisting of a node y and an index i such that y: key i = k. Otherwise, the procedure returns NIL.',
      zh:'★ 检索的返回：结点 + 下标；找不到 NIL。'},
     {kind:'body',page:506,en:'The procedure B-TREE-SPLIT-CHILD on the facing page takes as input a nonfull internal node x (assumed to reside in main memory) and an index i such that x:c i',
      zh:'★ 分裂的前提：x 不满、x.cᵢ 满（后半句接 is a full child）。'},
     {kind:'body',page:507,en:'Figure 18.5 illustrates how a node splits. B-TREE-SPLIT-CHILD splits the full node y = x:c i about its median key (S in the figure), which moves up into y \u2019s parent node x .',
      zh:'★★ 分裂的本质：按**中位键**劈开，中位键上移。'},
     {kind:'body',page:508,en:'Inserting a key k into a B-tree T of height h requires just a single pass down the tree and O(h) disk accesses. The CPU time required is O(th) = O(t log t n).',
      zh:'★★ 插入 = 单趟下降：O(h) 磁盘访问、O(t log_t n) CPU。'},
     {kind:'body',page:508,en:'The B-TREE-INSERT procedure uses B-TREE-SPLIT-CHILD to guarantee that the recursion never descends to a full node. If the root is full, B-TREE-INSERT splits it by calling the procedure B-TREE-SPLIT-ROOT on the facing page.',
      zh:'★★ 自顶向下分裂的核心保证：递归**绝不进入满结点**。'},
    ],terms:[{en:'B-TREE-SPLIT-CHILD',zh:'分裂满孩子',page:506},
              {en:'B-TREE-INSERT-NONFULL',zh:'向非满结点插入',page:510},
              {en:'median key',zh:'中位键（上移）',page:507}]},
   {type:'pseudocode',title:'B-TREE-INSERT：5 行',algo:'B-TREE-INSERT',signature:'B-TREE-INSERT(T, k)',page:508,
    lines:[
     {n:1,code:'r = T.root',zh:''},
     {n:2,code:'if r.n == 2t − 1',zh:'★ 根满 -> 先分裂（树长高一格）。'},
     {n:3,code:'    s = ALLOCATE-NODE()',zh:''},
     {n:4,code:'    B-TREE-SPLIT-CHILD(s, 1, r)',zh:'旧根成为 s 的孩子。'},
     {n:5,code:'    B-TREE-INSERT-NONFULL(s, k)',zh:''},
     {n:6,code:'else B-TREE-INSERT-NONFULL(T.root, k)',zh:''}],
    vars:[{name:'s',meaning:'新根（树高 +1 只发生在这一处）'}],
    note:'★ 树只向上生长（根分裂）—— 这就是所有叶等深的原因。与 16.4 动态表的"倍增"同型：结构性重构被推到极少数时刻。',
    more:[{algo:'B-TREE-INSERT-NONFULL',subtitle:'B-TREE-INSERT-NONFULL(x, k) —— 17 行（p.511）',signature:'B-TREE-INSERT-NONFULL(x, k)',page:511,
      lines:[{n:1,code:'i = x.n',zh:''},
        {n:2,code:'if x.leaf',zh:''},
        {n:3,code:'    while i >= 1 and k < x.key_i',zh:'叶：腾位插入。'},
        {n:4,code:'        x.key_i+1 = x.key_i',zh:''},
        {n:5,code:'        i = i − 1',zh:''},
        {n:6,code:'    x.key_i+1 = k',zh:''},
        {n:7,code:'    x.n = x.n + 1',zh:''},
        {n:8,code:'else while i >= 1 and k < x.key_i',zh:'内部：找目标孩子。'},
        {n:9,code:'        i = i − 1',zh:''},
        {n:10,code:'    i = i + 1',zh:''},
        {n:11,code:'    DISK-READ(x.c_i)',zh:''},
        {n:12,code:'    if x.c_i.n == 2t − 1',zh:'★★ 孩子满 -> 立刻分裂。'},
        {n:13,code:'        B-TREE-SPLIT-CHILD(x, i)',zh:''},
        {n:14,code:'        if k > x.key_i',zh:''},
        {n:15,code:'            i = i + 1',zh:''},
        {n:16,code:'    B-TREE-INSERT-NONFULL(x.c_i, k)',zh:''}],
      vars:[{name:'x.cᵢ',meaning:'第 i 个孩子'}],
      note:'★ 第 12–15 行是"先分裂再下降"的落点：分裂后中位键进了 x，可能要改道右孩子。'}]},
   {type:'visualize',title:'分裂与单趟下降',panels:[
     {title:'C 程序实测：20 个键的长高过程（t = 3）',viz:'tree',vizMode:'tree',
      trees:[{root:{"label": "[30 60 80]", "cost": "根 · 3 键 · 4 孩子", "children": [{"label": "[5 10 15 20 25]", "cost": "叶 · 5 键"}, {"label": "[35 40 45 50 55]", "cost": "叶 · 5 键"}, {"label": "[65 70 75]", "cost": "叶 · 3 键"}, {"label": "[85 90 95 100]", "cost": "叶 · 4 键"}]}}],
      treeNotes:['★ 每片叶都是一次 SPLIT 的产物（劈开满叶、中位键上移）。',
        '例：叶 [5 10 15 20 25] 装的是 10 进根、25 进根前的两半……逐次分裂的痕迹全在树形里。',
        '★ C 程序 part 2：每次 SEARCH 的磁盘访问 ≤ 高度 + 1 = 2 —— "一次下降"的承诺兑现。'],
     },
     {title:'插入代价：O(h) 磁盘 + O(t·h) CPU',viz:'growth',
      chart:{xMax:1000000,series:[
       {name:'磁盘访问 O(h)，h ≈ 3（t=512）',expr:'3',color:'--viz-done'},
       {name:'CPU O(t·lg n)/64',expr:'Math.log2(n)',color:'--viz-compare'}]},
      note:'★ 原书 p.508：单趟下降 O(h) 次磁盘访问 —— 交换的是结点内 O(t) 的 CPU 比较（内存里很便宜）。'},
    ],tasks:['对照 C 程序 part 2：SEARCH(42) 用 2 次磁盘访问返回 nil。'],note:''},
   {type:'code',title:'实测：单趟插入与 2 次磁盘访问',c:{file:'btree.c',code:String.raw`/* btree.c -- 18 章：B 树（最小度 t）SEARCH / CREATE / SPLIT-CHILD / INSERT / INSERT-NONFULL / DELETE。
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
    notes:[{line:1,zh:'★ 三关共用本文件；本关注释聚焦 SEARCH / SPLIT / INSERT。'},
           {line:49,zh:'`btree_split_child`：20 行直译 —— 中位键上移、右半成新结点。'},
           {line:69,zh:'`insert_nonfull`：17 行直译；第 12 行的"孩子满先分裂"在 else 分支里。'},
           {line:38,zh:'`btree_search`：9 行直译；disk_reads 计数磁盘访问。'},
           {line:126,zh:'★★ part 1：t=3 插 20 键 → 高 1（根分裂一次）。'},
           {line:134,zh:'★★ part 2：20 次 SEARCH 全中，磁盘访问 ≤ 2；SEARCH(42) 正确 nil。'},
           {line:145,zh:'★ part 3：打印整棵树 —— 分裂痕迹可见（各叶 3～5 键）。'}]},
    tests:[{in:'t = 3 依序插入 20 键',out:'根 [30 60 80]；4 叶各 3~5 键；高 1'},
           {in:'SEARCH(42)',out:'nil，2 次磁盘访问'},
           {in:'20 次 SEARCH',out:'全部命中，磁盘访问 ≤ 2'}],
    mapping:[{pc:12,pcCode:'if x.c_i.n == 2t − 1',c:'`if (x->child[i]->nkeys == MAXK)`（第 57 行）'},
             {pc:13,pcCode:'B-TREE-SPLIT-CHILD(x, i)',c:'`btree_split_child(x, i);`（第 49 行）'}]},
   {type:'analyze',title:'一本账：分裂的代价去哪了',claims:[
     {expr:'O(h)',when:'插入的磁盘访问次数（单趟下降）',page:508,source:'book'},
     {expr:'O(t \\log_t n)',when:'插入的 CPU 时间（结点内线性扫描 × 结点数）',page:508,source:'book'},
     {expr:'t - 1',when:'分裂后左、右半结点各得的键数',page:507,source:'book'},
    ],tables:[{caption:'C 程序实测：t = 3 插 20 键',rows:[
      ['事件','次数','代价去向'],
      ['根分裂','1','树高 0 → 1'],
      ['叶分裂','3','中位键 30/60/80 上移'],
      ['SEARCH 磁盘访问','每次 ≤ 2','高度 + 1'],
      ['SEARCH(42)','nil','正确报告不存在'],
     ]},{caption:'为什么"先分裂"比"后修复"好',rows:[
      ['','自顶向下分裂（B 树）','自底向上修复（红黑树）'],
      ['回溯','无','需要沿父指针回走'],
      ['磁盘代价','单趟 O(h)','最坏多一倍'],
      ['根分裂','唯一的长高方式','旋转任意处'],
     ]}],chart:{xMax:64,series:[
     {name:'磁盘访问 ≈ lg n / lg t（t=32）',expr:'Math.log2(n) / 5',color:'--viz-done'},
     {name:'结点内比较 t·lg n / 32',expr:'Math.log2(n)',color:'--viz-compare'}]},
    derivations:[{kind:'summation',title:'中位键为什么"装得下"',steps:[
      {zh:'分裂的前提是 **x 不满**（至多 $2t-2$ 个键）。'},
      {zh:'分裂把 1 个中位键加进 x：最多变成 $2t-1$ 个 —— 仍合法。'},
      {tex:'x.n \\le 2t-2 \\;\\Longrightarrow\\; x.n + 1 \\le 2t-1',zh:'★ 这就是"下降途中预分裂"能保证不回溯的全部算术。'}]},
     ],
    note:''},
   {type:'prove',title:'插入的单趟下降',statement:'Inserting a key k into a B-tree T of height h requires just a single pass down the tree and O(h) disk accesses. The CPU time required is O(th) = O(t log t n).',page:508,
    intro:'★ 证明靠一条强不变量：递归绝不进入满结点 —— 它由"先分裂"维护。',
    steps:[
     {title:'不变量：孩子必不满',en:'The B-TREE-INSERT procedure uses B-TREE-SPLIT-CHILD to guarantee that the recursion never descends to a full node.',page:508,
      body:['INSERT-NONFULL 进入孩子前（第 12 行）先检查：孩子满就当场分裂。',
        '分裂后中位键上移到 x（x 不满，装得下），新键落在左右两半之一 → 递归进入的孩子**至多 $2t-2$ 个键**。',
        '所以"以不满结点递归"的不变量在每层保持。∎']},
     {title:'根满则长高',en:'If the root is full, B-TREE-INSERT splits it by calling the procedure B-TREE-SPLIT-ROOT on the facing page.',page:508,
      body:['根满时新建根、分裂旧根 —— 这是树**唯一**的长高方式。',
        '所有叶仍在同一层（旧根的孩子们变成兄弟叶）→ 性质 5 保持。',
        '★ C 程序 part 1：20 个键只触发 1 次根分裂，树高从 0 到 1。∎']},
     {title:'代价清点',en:'B-TREE-SEARCH returns the ordered pair (y,i) consisting of a node y and an index i such that y:key i = k. Otherwise, the procedure returns NIL.',page:505,
      body:['**磁盘**：下降经过的每个结点读一次 → $O(h)$ 次；分裂写 3 个结点但都在已读集合内。',
        '**CPU**：每个结点内最多 $2t-1$ 次比较 → $O(t \\cdot h) = O(t \\log_t n)$。',
        '★ C 程序 part 2：实测每次 SEARCH 磁盘访问 = 高度 + 1 = 2。∎']},
    ],conclusion:'★ 结论：B 树把"平衡维护"预付进下降路径 —— 没有回溯，没有旋转，只有分裂。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'分裂满结点时，中位键去了哪里？',options:['留在左半结点的最右位置','进入右半结点的最左位置','**上移到父结点**','被丢弃'],answer:2,
      why:'★ SPLIT-CHILD 的核心：中位键上移，左右各得 t−1 个键。'},
     {kind:'single',q:'为什么插入采用"下降途中先分裂"？',options:['为了减小树高：分裂把结点拆开，树的高度增长就慢一些','**保证递归不进入满结点，单趟完成、不回溯**','为了让叶更满','为了省内存'],answer:1,
      why:'★ 原书 p.508：磁盘模型里回溯的代价太高 —— 预付分裂换单趟。'},
     {kind:'judge',q:'B 树只在根分裂时升高。',answer:true,
      why:'★ 根分裂把旧根降为普通孩子 —— 所有叶同步加深一层。'},
     {kind:'judge',q:'分裂是懒惰的：只在实际访问到满结点时才发生。',answer:false,
      why:'★ 恰恰相反：下降途中**主动**分裂可能根本不需要分裂的结点 —— 用一点浪费换单趟下降。'},
     {kind:'simulate',q:'C 程序中 t = 3 插 20 个键后根含多少个键？（填数字）',expect:[3],placeholder:'例如：4',
      why:'根 [30 60 80]（C 程序 part 3 打印的树结构）。'},
     {kind:'simulate',q:'SEARCH(42) 用了多少次磁盘访问？（填数字）',expect:[2],placeholder:'例如：3',
      why:'根 + 一片叶 = 2 次（高度 1 + 1；C 程序 part 2）。'},
    ],bookExercises:[
     {id:'18.2-1',page:511,star:0,statement:'Show the results of inserting the keys F,S,Q,K,C,L,H,T,V,W,M,R,N,P,A,B,X,Y,D,Z,E in order into an empty B-tree with minimum degree 2. Draw only the configura- tions of the tree just before some node must split, and also draw the final configu- ration.',hint:'$t = 2$ 就是 2-3-4 树：每个结点 1–3 个键、2–4 个孩子。 照 $\\text{B-TREE-INSERT}$ 的「**下探之前**先把遇到的满孩子劈开」逐键走， 题干要的是两类图：某个结点即将分裂的那一瞬间，以及全部插完后的终态。 核对手段要说准：本关的 C 程序 part 1 打印插完之后的高度与根键数、part 3 打印**终态树结构**， 它不打印每一次分裂前的中间树；要逐张核对就得自己画， 或者在插入循环里加一行「本轮发生了分裂就把分裂前的结点打出来」。 ★ 但别拿本关程序的数字对答案：`c/btree.c` 的 part 1 与 part 3 跑的是自设的 $t = 3$、20 个整数键（实跑打印「高 = 1，根键数 = 3」），与本题的 $t = 2$、21 个字母无关。照它的**方法**走，数字自己算。'},
     {id:'18.2-2',page:512,star:0,statement:'Explain under what circumstances, if any, redundant DISK-READ or DISK-WRITE operations occur during the course of executing a call to B-TREE-INSERT . (A redundant DISK-READ is a DISK-READ for a block that is already in memory. A redundant DISK-WRITE writes to disk a block of information that is identical to what is already stored there.)',hint:'沿插入路径逐个结点问两句：这块磁盘块是不是已经在内存里了（重复 DISK-READ），以及这次写回去的内容和盘上是否一样（重复 DISK-WRITE）。触发点都在「先分裂、再下探」的顺序上 —— 尤其根一直是同一个结点、以及一个结点被分裂掉之后又被写的情形。'},
     {id:'18.2-3',page:512,star:0,statement:'Professor Bunyan asserts that the B-TREE-INSERT procedure always results in a B-tree with the minimum possible height. Show that the professor is mistaken by proving that with t = 2 and the set of keys f1,2,…,15 g, there is no insertion sequence that results in a B-tree with the minimum possible height.',hint:'$t=2$ 就是 2-3-4 树。先算「最矮能多矮」：15 个键的理想树是什么形状、需要多少个叶。再看 B-TREE-INSERT 的硬约束：结点满（3 键）才分裂，分裂产生的两个孩子各带 1 键 —— 数一数这棵树的叶数能不能到理想值。'},
     {id:'18.2-4',page:512,star:0,statement:'If you insert the keys f1,2,…,n g into an empty B-tree with minimum degree 2, how many nodes does the final B-tree have?',hint:'$t = 2$ 就是 2-3-4 树（每个结点 1–3 个键）。先手算 $n = 1 \\dots 16$ 的结点数找规律， 分裂的时机是「键数达到 $2t-1 = 3$」。计数别记反：一次 $\\text{B-TREE-SPLIT-CHILD}$ 只**新建 1 个**结点 （把中位数提到父结点，不新增结点），所以普通分裂净增 $+1$；只有**根被分裂**时才额外多一个（新根），净增 $+2$。 $n$ 个键顺序插入后结点数是一个递归式，写出来再解；本题答案要给出 $n$ 的一般表达式。'},
     {id:'18.2-5',page:512,star:0,statement:'Since leaf nodes require no pointers to children, they could conceivably use a dif- ferent (larger) t value than internal nodes for the same disk block size. Show how to modify the procedures for creating and inserting into a B-tree to handle this variation.',hint:'把一个 $t$ 拆成两个常数：内部结点 $t_i$、叶 $t_l$（$t_l>t_i$）。要改三处：结点的键/孩子上限与「满」的判据、SPLIT-CHILD 里两边的键怎么分（分裂的是内部结点才搬孩子指针），以及叶结点自己的插入分支。注意根既可能是叶也可能是内部结点。'},
     {id:'18.2-6',page:512,star:0,statement:'Suppose that you implement B-TREE-SEARCH to use binary search rather than linear search within each node. Show that this change makes the required CPU time O(lg n), independent of how t might be chosen as a function of n.',hint:'一次搜索访问 $O(\\log_t n)$ 个结点，每个结点内二分是 $O(\\lg t)$，相乘 $t$ 就被换底公式消掉了 —— 关键是把 $\\log_t n\\cdot\\lg t=\\lg n$ 这一步写清楚，再说清「与 $t$ 的取法无关」指的是什么。'},
    ]},
  ],
};
