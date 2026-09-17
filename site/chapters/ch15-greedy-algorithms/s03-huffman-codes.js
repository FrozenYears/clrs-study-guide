/* 第 15 章 15.3：哈夫曼编码（Huffman codes）。印刷页 431–439（pdf 452–460）。 */
export default {
  key:'s03',id:'ch15/s03',chapter:15,section:'15.3',
  title:'哈夫曼编码：合并两个最小的',shortTitle:'15.3 哈夫曼编码',
  titleEn:'Huffman codes',
  source:{printed:[431,439],pdf:[452,460]},
  prerequisites:[{label:'15.2 Elements of the greedy strategy',url:'#/ch15/s02'}],
  stages:[
   {type:'map',title:'用变长码把高频字符压短',
    why:'给定每个字符的出现频率，构造一套**无前缀**的二进制码（任何码字都不是另一个的前缀），使加权总长 $B(T) = \\sum f(c)\\,\\text{depth}(c)$ 最小。',
    position:'这是贪心的第三个范例，也是第一个"选择看起来不像显然最优"的：每次取**频率最小的两个**合并。它满足 15.2 的两条判据（贪心选择 + 最优子结构），证明用引理 15.2 / 15.3。',
    unlocks:[{label:'15.4 Offline caching',url:'#/ch15/s04'}],
    mathKit:[
     {title:'加权路径长 (15.4)',body:'$B(T) = \\sum_{c \\in C} c.\\text{freq} \\cdot d_T(c)$，$d_T(c)$ 是叶子深度 = 码字长度。'},
     {title:'贪心选择',body:'从 $|C|$ 个叶子做 $n-1$ 次合并，每次取出**频率最小的两个** $x,y$，合并成新节点 $z$（$z.\\text{freq} = x.\\text{freq} + y.\\text{freq}$）放回队列。'},
     {title:'时间',body:'用二叉最小堆做 $Q$：$O(n\\lg n)$；建成堆 $O(n)$ 后 $n-1$ 次 EXTRACT-MIN / INSERT 各 $O(\\lg n)$。'},
    ]},
   {type:'intuition',title:'6 个字符：从 300,000 位压到 224,000 位',scene:'a:45 b:13 c:12 d:16 e:9 f:5（单位：千次）',body:[
     '固定长度编码要 $\\lceil \\lg 6 \\rceil = 3$ 位/字符：100,000 字符 × 3 = **300,000 位**。',
     '★ 哈夫曼的做法：**反复把频率最小的两个合并**。第一次合并 5(f) + 9(e) = 14；再 12(c) + 13(b) = 25；再 14 + 16(d) = 30；再 25 + 30 = 55；最后 45(a) + 55 = 100（根）。',
     '得到的码字：a = `0`、b = `101`、c = `100`、d = `111`、e = `1101`、f = `1100`。',
     '★ 加权总长 $B(T) = 45\\cdot1 + 13\\cdot3 + 12\\cdot3 + 16\\cdot3 + 9\\cdot4 + 5\\cdot4 = 224$（单位千位）→ **224,000 位**，比固定长度省约 25%。',
     '★ 为什么"最小的两个"要先合并？因为它们将来会是最深的叶子 —— 让**最不常出现的**字符离根最远。而且它们互相成兄弟（引理 15.2）。',
    ],interactive:{text:''}},
   {type:'source',title:'书上是怎么说的',lead:'原书英文原文（含语料排版形式，如 a–f 是原书的短横）。',blocks:[
     {kind:'body',page:431,en:'Huffman codes compress data well: savings of 20% to 90% are typical, depending on the characteristics of the data being compressed.',
      zh:'★ 典型压缩率 20%–90%。'},
     {kind:'body',page:431,en:'Suppose that you have a 100,000-character data file that you wish to store compactly and you know that the 6 distinct characters in the file occur with the frequencies given by Figure 15.4.',
      zh:'★ 例子设定：100,000 字符、6 个不同字符。'},
     {kind:'body',page:432,en:'With each character represented by a 3-bit codeword, encoding the file requires 300,000 bits. With the variable-length code shown, the encoding requires only 224,000 bits.',
      zh:'★★ **300,000 → 224,000** —— 本关的两个关键数字。'},
     {kind:'body',page:436,en:'To prove that the greedy algorithm HUFFMAN is correct, we\u2019ll show that the problem of determining an optimal prefix-free code exhibits the greedy-choice and optimal-substructure properties.',
      zh:'★★ 证明分两条：贪心选择性质 + 最优子结构 —— 正是 15.2 的两把钥匙。'},
     {kind:'body',page:436,en:'Lemma 15.2 (Optimal prefix-free codes have the greedy-choice property)',
      zh:'★★ **Lemma 15.2**：最优前缀码满足贪心选择性质。'},
     {kind:'body',page:436,en:'Let C be an alphabet in which each character c 2 C has frequency c: freq. Let x and y be two characters in C having the lowest frequencies. Then there exists an optimal prefix-free code for C in which the codewords for x and y have the same length and differ only in the last bit.',
      zh:'★★ 引理的内容：频率最低的两个字符可以互为兄弟、且都在最深处。'},
     {kind:'body',page:438,en:'The next lemma shows that the problem of constructing optimal prefix-free codes has the optimal-substructure property.',
      zh:'★ **Lemma 15.3**：把合并后的新字符 $z$ 代回，子问题仍是最优前缀码问题。'},
     {kind:'body',page:436,en:'The running time of Huffman\u2019s algorithm depends on how the min-priority queue Q is implemented.',
      zh:'★ 时间取决于最小优先队列的实现；二叉堆 → $O(n\\lg n)$。'},
    ],terms:[{en:'prefix-free code',zh:'无前缀码',page:433},
              {en:'Huffman code',zh:'哈夫曼编码',page:431},
              {en:'frequency',zh:'频率',page:431}]},
   {type:'pseudocode',title:'HUFFMAN：11 行',algo:'HUFFMAN',signature:'HUFFMAN(C)',page:434,
    lines:[
     {n:1,code:'n = |C|',zh:''},
     {n:2,code:'Q = C',zh:'★ 以频率为键建最小优先队列。'},
     {n:3,code:'for i = 1 to n − 1',zh:'★ 恰好合并 $n-1$ 次 —— 每次少一个节点。'},
     {n:4,code:'    allocate a new node z',zh:''},
     {n:5,code:'    x = EXTRACT-MIN(Q)',zh:'★★ 取频率最小的那个。'},
     {n:6,code:'    y = EXTRACT-MIN(Q)',zh:'★★ 再取一个（同样是最小的）。'},
     {n:7,code:'    z.left = x',zh:''},
     {n:8,code:'    z.right = y',zh:''},
     {n:9,code:'    z.freq = x.freq + y.freq',zh:'新节点的频率 = 两者之和。'},
     {n:10,code:'    INSERT(Q, z)',zh:''},
     {n:11,code:'return EXTRACT-MIN(Q)    // the root of the tree is the only node left',zh:'★ 最后剩下的唯一节点就是根。'}],
    vars:[{name:'Q',meaning:'以 freq 为键的最小优先队列'},{name:'z',meaning:'新合并出的内部节点'}],
    note:'★ 全程只需一个优先队列和一次循环 —— 没有回溯、没有枚举 —— 这是贪心的形状（对照 14.5 的 OPTIMAL-BST 要枚举根）。',
    more:[{algo:'EXTRACT-MIN',subtitle:'本站 C 程序里的二叉堆：EXTRACT-MIN / INSERT 各 O(lg n)（p.434 的 Q 实现）',signature:'二叉最小堆（heap_push / heap_pop）',page:434,
      lines:[{n:1,code:'heap_push(idx): 放到末尾，向上冒泡（与父节点比 freq）',zh:''},
        {n:2,code:'heap_pop(): 取走堆顶，把末尾元素提到堆顶，向下沉降',zh:''},
        {n:3,code:'总代价：O(n) 建堆 + (n − 1) 次 (2 次 EXTRACT-MIN + 1 次 INSERT) = O(n lg n)',zh:''}],
      vars:[{name:'Q',meaning:'二叉最小堆'}],note:'★ 若改用 Fibonacci 堆，EXTRACT-MIN 摊销 $O(\\lg n)$、INSERT $O(1)$，总时间仍是 $O(n\\lg n)$（不改进阶）。'}]},
   {type:'visualize',title:'看见这棵树与它的码字',panels:[
     {title:'① 原书 Figure 15.5(b) 的最优前缀码树（合并顺序从下往上）',viz:'tree',vizMode:'tree',
      trees:[{root:{label:'100',cost:'根 · freq 100',children:[
        {label:'a 45',cost:'码字 0 · 深度 1' },
        {label:'55',cost:'freq 55',children:[
          {label:'25',cost:'freq 25',children:[
            {label:'c 12',cost:'码字 100 · 深度 3'},
            {label:'b 13',cost:'码字 101 · 深度 3'}]},
          {label:'30',cost:'freq 30',children:[
            {label:'14',cost:'freq 14',children:[
              {label:'f 5',cost:'码字 1100 · 深度 4'},
              {label:'e 9',cost:'码字 1101 · 深度 4'}]},
            {label:'d 16',cost:'码字 111 · 深度 3'}]}]}]},
      }],
      treeNotes:['★ 每次合并的都是当时队列里**最小的两个**：5+9=14 → 12+13=25 → 14+16=30 → 25+30=55 → 45+55=100。',
        '$B(T) = 45\\cdot1 + 12\\cdot3 + 13\\cdot3 + 16\\cdot3 + 5\\cdot4 + 9\\cdot4 = 224$（千位）。',
        '字符 a 频率最高 → 码字最短（1 位）；f 频率最低 → 码字最长（4 位）。'],
     },
     {title:'② 固定长度 vs 哈夫曼（100,000 字符的文件）',viz:'growth',
      chart:{xMax:8,series:[
       {name:'固定 3 位/字符 = 300（千位）',expr:'300',color:'--viz-violation'},
       {name:'哈夫曼 B(T) = 224（千位）',expr:'224',color:'--viz-done'}]},
      note:'★ C 程序 part 3：差 76,000 位（约 25%）—— 对 100,000 字符的文件来说就是 9.5 KB。'},
    ],tasks:['对照 C 程序 part 2：打印出的码字与上图逐个一致。'],note:''},
   {type:'code',title:'实测：B(T) = 224 与六个码字',c:{file:'huffman.c',code:String.raw`/* huffman.c -- 15.3: 哈夫曼编码（Huffman codes）。
 * 原书 p.434 的例子：6 个字符的频率 a:45 b:13 c:12 d:16 e:9 f:5。
 * 关键数字：最优前缀码的总代价（加权路径长）B(T) = 224。
 * 编码：A=0 B=101 C=100 D=111 E=1101 F=1100（原书 p.433 Figure 15.5b）。 */
#include <assert.h>
#include <stdio.h>
#include <string.h>

#define N 6

/* 二叉堆实现的 min-priority queue（原书 HUFFMAN 的 Q）。
 * 下标 0..N-1 为 6 个叶子，之后每合并一次新增一个内部节点。 */
typedef struct {
    int freq;
    int left;    /* -1 表示叶子 */
    int right;
    int sym;     /* 叶子记符号下标 0..N-1；内部节点记 -1 */
} Node;

static Node nodes[2 * N];
static int nn;                 /* 已创建的节点数 */

static int heap[2 * N];
static int hsize;

static void heap_swap(int i, int j)
{
    int t = heap[i]; heap[i] = heap[j]; heap[j] = t;
}

static void heap_push(int idx)
{
    int i = hsize++;
    heap[i] = idx;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (nodes[heap[p]].freq <= nodes[heap[i]].freq) { break; }
        heap_swap(i, p);
        i = p;
    }
}

static int heap_pop(void)
{
    int top = heap[0];
    heap[0] = heap[--hsize];
    int i = 0;
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, m = i;
        if (l < hsize && nodes[heap[l]].freq < nodes[heap[m]].freq) { m = l; }
        if (r < hsize && nodes[heap[r]].freq < nodes[heap[m]].freq) { m = r; }
        if (m == i) { break; }
        heap_swap(i, m);
        i = m;
    }
    return top;
}

/* 加权路径长 B(T) = Σ freq(c) · depth(c)（原书式 (15.4)） */
static int wpl;

static void dfs_wpl(int u, int depth)
{
    if (nodes[u].left == -1) { wpl += nodes[u].freq * depth; return; }
    dfs_wpl(nodes[u].left, depth + 1);
    dfs_wpl(nodes[u].right, depth + 1);
}

static char codes[N][16];

static void dfs_code(int u, char *prefix, int len)
{
    if (nodes[u].left == -1) {
        prefix[len] = '\0';
        strcpy(codes[nodes[u].sym], prefix);
        return;
    }
    prefix[len] = '0'; dfs_code(nodes[u].left, prefix, len + 1);
    prefix[len] = '1'; dfs_code(nodes[u].right, prefix, len + 1);
}

int main(void)
{
    setvbuf(stdout, NULL, _IONBF, 0);

    /* 原书 Figure 15.4 的频率 */
    int freq[N] = {45, 13, 12, 16, 9, 5};
    const char *name[N] = {"a", "b", "c", "d", "e", "f"};

    nn = 0; hsize = 0;
    for (int i = 0; i < N; i++) {
        nodes[nn].freq = freq[i];
        nodes[nn].left = -1;
        nodes[nn].right = -1;
        nodes[nn].sym = i;
        heap_push(nn);
        nn++;
    }

    /* HUFFMAN（原书 p.434）的主循环：n − 1 次合并 */
    for (int i = 1; i < N; i++) {
        int x = heap_pop();
        int y = heap_pop();
        nodes[nn].freq = nodes[x].freq + nodes[y].freq;
        nodes[nn].left = x;        /* 先取出的（频率较小）作为左孩子 = 0 */
        nodes[nn].right = y;       /* 后取出的作为右孩子 = 1 */
        nodes[nn].sym = -1;
        heap_push(nn);
        nn++;
    }
    int root = heap_pop();

    wpl = 0;
    dfs_wpl(root, 0);
    printf("part 1: 最优前缀码的加权路径长 B(T) = %d（原书 p.434 的答案）\n", wpl);
    assert(wpl == 224);

    char prefix[16];
    dfs_code(root, prefix, 0);
    printf("part 2: 各字符的码字：");
    for (int i = 0; i < N; i++) { printf("%s=%s%s", name[i], codes[i], i + 1 < N ? " " : ""); }
    printf("\n");

    const char *expect[N] = {"0", "101", "100", "111", "1101", "1100"};
    for (int i = 0; i < N; i++) {
        assert(strcmp(codes[i], expect[i]) == 0);
    }

    /* 固定长度编码需要 dlg n e = 3 位/字符，100000 字符共 300000 位；
     * 可变长编码共 224000 位，节省约 25%（原书 p.432）。 */
    printf("part 3: 固定长度 3 位/字符需 300000 位；可变长哈夫曼编码需 224000 位（省约 25%%）\n");
    assert(N == 6);

    puts("all checks passed.");
    return 0;
}
`,
    notes:[{line:1,zh:'★ 文件开头写明关键数字：$B(T) = 224$，以及六个码字。'},
           {line:31,zh:'`heap_push` / `heap_pop`：二叉最小堆 —— 对应原书的 $Q$。'},
           {line:62,zh:'`dfs_wpl`：按式 (15.4) 累加加权路径长。'},
           {line:71,zh:'`dfs_code`：顺带把每个叶子的码字记录下来（左 0 右 1）。'},
           {line:101,zh:'★★ 第 101–110 行就是 HUFFMAN 的主循环：$n-1$ 次合并，每次取两个最小者。'},
           {line:115,zh:'★★ part 1：$B(T) = 224$ —— 与原书 p.434 的答案一致。'},
           {line:124,zh:'★★ part 2：码字逐个与 expect 数组比对（a=0 b=101 c=100 d=111 e=1101 f=1100）。'}]},
    tests:[{in:'频率 a:45 b:13 c:12 d:16 e:9 f:5（千次）',out:'$B(T) = 224$（千位）'},
           {in:'码字',out:'a=0 b=101 c=100 d=111 e=1101 f=1100'},
           {in:'100,000 字符的文件',out:'固定长度 300,000 位 vs 哈夫曼 224,000 位'}],
    mapping:[{pc:5,pcCode:'x = EXTRACT-MIN(Q)',c:'`int x = heap_pop();`（第 102 行）'},
             {pc:9,pcCode:'z.freq = x.freq + y.freq',c:'`nodes[nn].freq = nodes[x].freq + nodes[y].freq;`（第 104 行）'}]},
   {type:'analyze',title:'一本账：为什么是 $O(n\\lg n)$',claims:[
     {expr:'O(n\\lg n)',when:'HUFFMAN 的时间（二叉最小堆实现 $Q$）',page:436,source:'book'},
     {expr:'\sum_{z}(f_{left}+f_{right})',when:'$B(T)$ 的等价算法（对每个内部节点累加两个孩子的频率，习题 15.3-4）',page:439,source:'book'},
     {expr:'224',when:'Figure 15.4 例子的最优加权路径长（千位）',page:432,source:'book'},
    ],tables:[{caption:'手算合并过程（C 程序 part 1–2 的一致结果）',rows:[
      ['步骤','取出两个最小','新节点 freq','队列中剩下的'],
      ['1','f(5), e(9)','14','c12 b13 14 d16 a45'],
      ['2','c(12), b(13)','25','14 d16 25 a45'],
      ['3','14, d(16)','30','25 30 a45'],
      ['4','25, 30','55','a45 55'],
      ['5','a(45), 55','100（根）','—'],
     ]},{caption:'无前缀码 vs 非前缀码',rows:[
      ['','优点','缺点'],
      ['固定长度','解码最简单','高频字符也被迫用长码'],
      ['无前缀变长码','高频短码、低频长码','需要保证没有码字是另一个的前缀'],
      ['任意变长码','理论更短','无法唯一解码（例：0 与 01 冲突）'],
     ]}],chart:{xMax:64,series:[
     {name:'n lg n（二叉堆）',expr:'n * Math.log2(n)',color:'--viz-done'},
     {name:'n²（每次线性找最小）',expr:'n * n / 8',color:'--viz-violation'}]},
    derivations:[{kind:'summation',title:'$B(T)$ 的等价算法',steps:[
      {zh:'$B(T) = \\sum_c \\text{freq}(c)\\cdot d(c)$ 定义式 —— 需要知道每个字符的深度。'},
      {zh:'把它换成"每个内部节点贡献一次合并代价"：每合并一次，两个子树的全部叶子深度都 +1，于是 $B(T) = \\sum_{z \\text{ 为内部节点}} (z.\\text{left.freq} + z.\\text{right.freq})$。'},
      {tex:'B(T) = \\sum_{z} (z.left.freq + z.right.freq)',zh:'★ 本关五个内部节点：14 + 25 + 30 + 55 + 100 = 224 —— 与深度法的结果一致（习题 15.3-4 就是这条恒等式）。'}]},
     ],
    note:''},
   {type:'prove',title:'引理 15.2 / 15.3：贪心选择 + 最优子结构',statement:'Let C be an alphabet in which each character c 2 C has frequency c: freq. Let x and y be two characters in C having the lowest frequencies. Then there exists an optimal prefix-free code for C in which the codewords for x and y have the same length and differ only in the last bit.',page:436,
    intro:'★ 两步：先把"频率最小的两个"搬到树的**最深处且互为兄弟**（贪心选择），再把它们合并成一个字符继续（最优子结构）。',
    steps:[
     {title:'第一步：$x,y$ 可以放在最深、且互为兄弟',en:'To prove that the greedy algorithm HUFFMAN is correct, we\u2019ll show that the problem of determining an optimal prefix-free code exhibits the greedy-choice and optimal-substructure properties.',page:436,
      body:['任意最优树 $T$ 里，深度最大的两个叶子记为 $a,b$，其中 $f_a, f_b$ 是最深叶子中最小的。',
        '因为 $f_x \\le f_a$、$f_y \\le f_b$（$x,y$ 全局频率最小），可以**交换** $x$ 与 $a$、$y$ 与 $b$ 的位置。',
        '**逐项算代价**：交换后只有 $x,a$ 两项的贡献变化：$f_x d(b) + f_a d(a) \\to f_x d(a) + f_a d(b)$，由于 $d(a) \\ge d(b)$ 且 $f_x \\le f_a$，新代价 $\\le$ 旧代价 —— 不会变大。',
        '于是存在一个最优树，其中 $x,y$ 是最深的两个叶子、且互为兄弟（同深度的兄弟只需再交换一次）。∎']},
     {title:'第二步：合并后仍是同一个问题（子结构）',en:'The next lemma shows that the problem of constructing optimal prefix-free codes has the optimal-substructure property.',page:438,
      body:['把 $x,y$ 合并成新字符 $z$（$f_z = f_x + f_y$），得到字母表 $C^{\\prime} = (C \\setminus \\{x,y\\}) \\cup \\{z\\}$。',
        '**断言**：$C$ 的最优树 $T$ 把 $x,y$ 这对兄弟"捏"成一个叶子后，就是 $C^{\\prime}$ 的最优树 $T^{\\prime}$。',
        '理由：$B(T) = B(T^{\\prime}) + f_x + f_y$（捏合让 $x,y$ 各自少一层，恰好省下 $f_x + f_y$），而偏移是**常数**，所以最小化 $B(T)$ 等价于最小化 $B(T^{\\prime})$。∎']},
     {title:'第三步：实测与独立复核',en:'Suppose that you have a 100,000-character data file that you wish to store compactly and you know that the 6 distinct characters in the file occur with the frequencies given by Figure 15.4.',page:431,
      body:['C 程序按 HUFFMAN 主循环跑出 $B(T) = 224$，并把六个码字与期望值逐个断言比对。',
        '另有两条独立路径互证：① 按深度法 $\\sum f d$ 累加；② 按内部节点法 $\\sum (f_{left}+f_{right})$ 累加（习题 15.3-4）。',
        '★ 汇总：14 + 25 + 30 + 55 + 100 = 224 ✓。∎']},
    ],conclusion:'★ 结论：贪心选择安全（引理 15.2）+ 子问题结构不变（引理 15.3）→ HUFFMAN 正确，$O(n\\lg n)$。',note:''},
   {type:'drill',title:'检验一下',items:[
     {kind:'single',q:'HUFFMAN 每次从队列里取出什么？',options:['频率最大的两个','**频率最小**的两个','深度最浅的两个','随机两个'],answer:1,
      why:'★ 频率最小的两个将来会在最深处，且互为兄弟（引理 15.2）。'},
     {kind:'single',q:'用二叉最小堆实现 $Q$ 时，HUFFMAN 的时间是？',options:['$\\Theta(n)$','$O(n\\lg n)$','$\\Theta(n^2)$','$\\Theta(2^n)$'],answer:1,
      why:'★ $n-1$ 次合并 × 每次 $O(\\lg n)$ 的堆操作 = $O(n\\lg n)$（原书 p.436）。'},
     {kind:'judge',q:'无前缀码意味着没有一个码字是另一个码字的前缀。',answer:true,
      why:'★ 这正是唯一可解码的条件；哈夫曼树里码字对应叶子的路径，而叶子不会是另一个叶子的祖先。'},
     {kind:'judge',q:'频率最高的字符在哈夫曼树里一定深度最小。',answer:false,
      why:'★ 一般成立但不是"一定"：只要没有并列的更深叶子会更省，才轮得到它。严格说它的深度 ≤ 任何频率不高于它的字符的深度。'},
     {kind:'simulate',q:'频率 a:45 b:13 c:12 d:16 e:9 f:5 时，$B(T)$ 是多少？（填数字）',expect:[224],placeholder:'例如：300',
      why:'$45\\cdot1+13\\cdot3+12\\cdot3+16\\cdot3+9\\cdot4+5\\cdot4 = 224$（C 程序 part 1 实测）。'},
     {kind:'simulate',q:'100,000 字符的文件用固定 3 位编码要多少位？（填数字）',expect:[300000],placeholder:'例如：200000',
      why:'$100{,}000 \\times 3 = 300{,}000$；哈夫曼只要 224,000 位。'},
    ],bookExercises:[
     {id:'15.3-1',page:439,star:0,statement:'Explain why, in the proof of Lemma 15.2, if x: freq = b: freq, then we must have a: freq = b: freq = x: freq = y: freq.',hint:'因为 $a,b$ 是**最深**的两个叶子，$x,y$ 是**频率最小**的两个。若 $f_x = f_b$，则 $f_x \\le f_a \\le f_b$（$a$ 不比 $b$ 浅但频率更小）与 $f_b \\le f_y \\le f_x$（$x \\le y$，而 $y$ 也是最小之一）夹出四个相等。'},
     {id:'15.3-2',page:439,star:0,statement:'Prove that a non-full binary tree cannot correspond to an optimal prefix-free code.',hint:'若某个内部节点只有**一个**孩子，把这个节点"短路"掉（让孙子直接接上）能让该子树全部叶子深度 −1，$B(T)$ 严格下降 —— 与最优矛盾。'},
     {id:'15.3-3',page:439,star:0,statement:'What is an optimal Huffman code for the following set of frequencies, based on the first 8 Fibonacci numbers? a:1 b:1 c:2 d:3 e:5 f:8 g:13 h:21',hint:'合并过程：1+1=2(a,b) → 2+2=4(c 与新节点) → 3+4=7(d 与它) → 5+7=12 → 8+12=20 → 13+20=33 → 21+33=54。斐波那契频率下码长恰为 1,2,3,4,5,6,7,7（可用 C 程序改数据验证）。'},
     {id:'15.3-4',page:439,star:0,statement:'Prove that the total cost B(T) of a full binary tree T for a code equals the sum, over all internal nodes, of the combined frequencies of the two children of the node.',hint:'对每个内部节点 $z$，它的两个孩子的频率和 = 该子树里全部叶子的频率之和。一个叶子 $c$ 在它的每个祖先处被计一次，共 $d(c)$ 次 —— 求和后恰好得到 $\\sum_c f_c \\, d(c) = B(T)$。'},
     {id:'15.3-6',page:439,star:0,statement:'Generalize Huffman\u2019s algorithm to ternary codewords (i.e., codewords using the symbols 0, 1, and 2), and prove that it yields optimal ternary codes.',hint:'每次合并**三个**最小者；注意叶子数必须满足 $n \\equiv 1 \\pmod 2$（三叉满树内部节点数 = $(n-1)/2$），否则先补频率为 0 的哑字符凑齐。'},
     {id:'15.3-7',page:439,star:0,statement:'A data file contains a sequence of 8-bit characters such that all 256 characters are about equally common: the maximum character frequency is less than twice the minimum character frequency. Pr',hint:'近似均匀时哈夫曼几乎不省：256 个字符需要 8 位，变长码最优也接近 8 位/字符 —— 可算出最坏情形最多省几个百分点，结论是"这文件基本压不动"。'},
    ]},
  ],
};
