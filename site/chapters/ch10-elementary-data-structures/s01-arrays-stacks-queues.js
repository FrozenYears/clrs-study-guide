/* 第 10 章 10.1：基于数组的简单数据结构（数组、矩阵、栈、队列）。
 * 原文锚点：印刷页 252–258（pdf_index 273–279）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（36/36 PASS）。
 * 主题：栈 = LIFO + top；队列 = FIFO + head/tail 回绕。两种都是 O(1)。
 */

export default {
  key:'s01',id:'ch10/s01',chapter:10,section:'10.1',
  title:'栈与队列：一个数组的两种脾气',shortTitle:'10.1 数组、栈与队列',
  titleEn:'Simple array-based data structures: arrays, matrices, stacks, queues',
  source:{printed:[252,258],pdf:[273,279]},
  prerequisites:[{label:'9.3 Selection in worst-case linear time',url:'#/ch09/s03'}],
  stages:[
   {type:'map',title:'第 III 部分开场：数据结构是把数据"摆好"的艺术',
    why:'前九章的算法都在处理数组。从本章起问一个新问题：**数据本身怎么组织**？本关只做两件事：把数组/矩阵的存储方式说清（行优先/列优先），再把两种最常用的"受限数组"——**栈**与**队列**——讲到能自己实现。',
    position:'第 I/II 部分（基础 + 排序）结束，第 III 部分（数据结构）开始。本关的栈/队列是后面全部递归、图搜索（BFS/DFS）、表达式求值的底层；10.2 的链表会把"指针"引入，10.3 用指针表示树。',
    unlocks:[{label:'10.2 Linked lists（链表）',url:'#/ch10/s02'}],
    mathKit:[
     {title:'数组的地址公式',body:'起点 $a$、每元素 $b$ 字节、下标从 $s$ 开始：第 $i$ 个元素占 $a + b(i-s)$ 起的 $b$ 字节。**一次乘法就能算出地址** → 随机访问 $O(1)$。'},
     {title:'行优先 vs 列优先',body:'$m \\times n$ 矩阵：行优先 $M[i,j]$ 在下标 $s + n(i-s) + (j-s)$；列优先 $s + m(j-s) + (i-s)$。'},
     {title:'LIFO 与 FIFO',body:'栈：删最近插入的（last-in, first-out）。队列：删最早插入的（first-in, first-out）。**删谁**是这两者的全部区别。'},
    ]},
   {type:'intuition',title:'餐盘堆与排队：两种"删谁"的规矩',
    scene:'食堂的弹簧盘架 vs 奶茶店的点单队列',
    body:[
     '**栈**像食堂的弹簧盘架：只能从顶上取盘子，最后放上去的第一个被拿走（LIFO）。**队列**像排队买奶茶：先来的先被服务（FIFO），新来的排到队尾。',
     '★ 两者的实现套路惊人地相似：都是一个定长数组 + 一两个**下标指针**。栈只要一个 `top`；队列要 `head` 和 `tail` 两个 —— 因为两端都在动。',
     '★ 队列比栈多一个坑：**指针会走出数组**。入队时 `tail` 一直往后走，很快就撞到 `size`。解法是"环形"：到 `size` 之后回绕到 1（`if Q.tail == Q.size then Q.tail = 1`）。数组被当成一个环用。',
     '★ 为什么两种操作都是 $O(1)$？因为它们**从不移动元素** —— 只改指针。这也是"用数据结构换效率"的第一课：同样的数据，摆法不同，代价就不同。',
    ],
    interactive:{text:'阶段 5 有两个面板：① 栈的 PUSH/POP 动画；② 环形队列的 ENQUEUE/DEQUEUE（看指针回绕）。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对属性记法 S.top 的排版形式）。',
    blocks:[
     {kind:'body',page:252,en:'Assuming that the computer can access all memory locations in the same amount of time (as in the RAM model described in Section 2 .2), it takes constant time to access any array element, regardless of the index.',
      zh:'★★ 数组这一条性质撑起了前九章的全部分析：**任意下标的访问都是 $\\Theta(1)$**（RAM 模型）。排序算法敢随意"跳着访问"数组，全靠它。'},
     {kind:'body',page:253,en:'We typically represent a matrix or two-dimensional array by one or more one- dimensional arrays. The two most common ways to store a matrix are row-major and column-major order.',
      zh:'★ 矩阵 = 一维数组的"翻译方案"。行优先与列优先是两种翻译法，**元素遍历顺序**不同 —— 对缓存友好度影响巨大。'},
     {kind:'body',page:253,en:'Parts (a) and (b) of Figure 10.1 show how to store this matrix using a single one-dimensional array. It’s stored in row-major order in part (a) and in columnmajor order in part (b).',
      zh:'★ 同一个 $2 \\times 3$ 矩阵的两种扁平化：行优先 $\\langle 1,2,3,4,5,6\\rangle$、列优先 $\\langle 1,4,2,5,3,6\\rangle$。'},
     {kind:'body',page:254,en:'Stacks and queues are dynamic sets in which the element removed from the set by the DELETE operation is prespecified. In a stack, the element deleted from the set is the one most recently inserted: the stack implements a last-in, first-out, or LIFO, policy. Similarly, in a queue, the element deleted is always the one that has been in the set for the longest time: the queue implements a first-in, first-out, or FIFO, policy.',
      zh:'★★ **本关的定义句**：栈删"最近插入的"（LIFO）、队列删"来得最久的"（FIFO）。两者都**预先规定了删谁** —— 这就是它们与普通动态集合的区别。'},
     {kind:'body',page:254,en:'The INSERT operation on a stack is often called PUSH, and the DELETE operation, which does not take an element argument, is often called POP. These names are allusions to physical stacks, such as the spring-loaded stacks of plates used in cafeterias. The order in which plates are popped from the stack is the reverse of the order in which they were pushed onto the stack, since only the top plate is accessible.',
      zh:'★ 名字的来历（食堂弹簧盘架）—— POP 的次序是 PUSH 次序的**反序**，因为只有顶盘可及。'},
     {kind:'body',page:254,en:'Figure 10.2 shows how to implement a stack of at most n elements with an array S[1 : n]. The stack has attributes S: top, indexing the most recently inserted element, and S: size, equaling the size n of the array. The stack consists of elements S[1 : S: top], where S[1] is the element at the bottom of the stack and S[S: top] is the element at the top.',
      zh:'★★ 栈的全部实现：数组 $S[1:n]$ + 属性 `S.top`（指向最近插入的元素）。**栈内元素恰好是 $S[1 : S.top]$ 这一前缀** —— 一句"前缀"说清了栈的形态。'},
     {kind:'body',page:255,en:'When S: top = 0, the stack contains no elements and is empty. We can test whether the stack is empty with the query operation STAC K-EMPTY . Upon an attempt to pop an empty stack, the stack underflows, which is normally an error.',
      zh:'★★ `S.top = 0` = 空栈；空栈弹出是 **underflow**。注意用 0 而不是 1 表示空，是为了让"空"和"有 1 个元素"可区分。'},
     {kind:'body',page:255,en:'The procedures STAC K-EMPTY , PUSH, and POP implement each of the stack operations with just a few lines of code. Figure 10.2 shows the effects of the modifying operations PUSH and POP. Each of the three stack operations takes',
      zh:'★ 三种操作各只要几行 —— **没有一个循环**。这就是 $O(1)$ 的字面含义。'},
     {kind:'body',page:256,en:'We call the INSERT operation on a queue ENQUEUE , and we call the DELETE operation DEQUEUE . Like the stack operation POP, DEQUEUE takes no element argument. The FIFO property of a queue causes it to operate like a line of customers waiting for service.',
      zh:'★★ 队列的两个操作：ENQUEUE（入队 = 排到队尾）、DEQUEUE（出队 = 队首离开）。FIFO 的排队类比。'},
     {kind:'body',page:256,en:'Q: tail indexes the next location at which a newly arriving element will be inserted into the queue. The elements in the queue reside in locations Q: head ,Q: head C 1; …,Q: tail − 1, where we "wrap around" in the sense that location 1 immediately follows location n in a circular order. When Q: head = Q: tail, the queue is empty.',
      zh:'★★ `Q.tail` 指向**下一个空位**（不是最后一个元素！），队内元素是 $Q[\\text{head} \\dots \\text{tail}-1]$，并**环形回绕**。`head == tail` 表示空。这三条是队列实现的全部门槛。'},
     {kind:'body',page:256,en:'Initially, we have Q: head = Q: tail = 1. An attempt to dequeue an element from an empty queue causes the queue to underflow.',
      zh:'★ 初始 `head = tail = 1`（空）；空队出队是 underflow。'},
     {kind:'body',page:257,en:'Q: head = 1 and Q: tail = Q: size, the queue is full, and an attempt to enqueue an element causes the queue to overflow.',
      zh:'★ 判满的两种形态：`tail = head + 1`（一般情况）或 `head = 1 且 tail = size`（回绕边界）—— 这正是实现里最容易写错的两处。'},
     {kind:'body',page:257,en:'In the procedures ENQUEUE and DEQUEUE , we have omitted the error checking for underflow and overflow. (Exercise 10.1-5 asks you to supply these checks.)',
      zh:'★ 原书的 ENQUEUE/DEQUEUE 伪代码**故意省掉了**边界检查 —— 习题 10.1-5 让你补。本关的 C 程序补上了。'},
     {kind:'body',page:257,en:'Figure 10.3 shows the effects of the ENQUEUE and DEQUEUE operations. Each operation takes O(1) time.',
      zh:'★ 队列两种操作各 $O(1)$ —— 与栈一样，因为也是只改指针不搬元素。'},
    ],
    terms:[
     {en:'LIFO',zh:'后进先出（栈的取用规矩）',page:254},
     {en:'FIFO',zh:'先进先出（队列的取用规矩）',page:254},
    ]},
   {type:'pseudocode',title:'PUSH 与 POP：各 4 行',
    lead:'★ 栈的全部代码。注意两条边界检查占据了一半行数 —— 数据结构实现的"成本"往往在边界上。',
    algo:'PUSH',signature:'PUSH(S, x)',page:255,
    lines:[
     {n:1,code:'if S.top == S.size',zh:'★ 判满：top 已经顶到数组末尾。'},
     {n:2,code:'    error "overflow"',zh:'溢出报错。注意**先判后写** —— 顺序反了就会越界写内存。'},
     {n:3,code:'else S.top = S.top + 1',zh:'先抬 top。'},
     {n:4,code:'    S[S.top] = x',zh:'再写入。★ 两步缺一不可，顺序也不能反。'},
    ],
    vars:[
     {name:'S.top',meaning:'栈顶下标；0 表示空栈'},
     {name:'S.size',meaning:'数组容量 n'},
    ],
    note:'★ POP 是镜像操作：先判空（underflow），再降 top、返回 S[S.top + 1]。',
    more:[
     {algo:'STACK-EMPTY',subtitle:'STACK-EMPTY(S) —— 3 行判空（原书 p.255）',
      signature:'STACK-EMPTY(S)',page:255,
      lines:[
       {n:1,code:'if S.top == 0',zh:'空栈的判据是 top = 0。'},
       {n:2,code:'    return TRUE',zh:''},
       {n:3,code:'else return FALSE',zh:''},
      ],
      vars:[{name:'S.top',meaning:'0 = 空'}],
      note:''},
     {algo:'ENQUEUE',subtitle:'ENQUEUE(Q, x) —— 4 行入队（原书 p.257）',
      signature:'ENQUEUE(Q, x)',page:257,
      lines:[
       {n:1,code:'Q[Q.tail] = x',zh:'★ 先写进"下一个空位"。'},
       {n:2,code:'if Q.tail == Q.size',zh:'★ 回绕判断 —— 队列实现的核心。'},
       {n:3,code:'    Q.tail = 1',zh:'到末尾就回到 1（不是 0）。'},
       {n:4,code:'else Q.tail = Q.tail + 1',zh:'否则正常右移。'},
      ],
      vars:[{name:'Q.tail',meaning:'下一个空位的下标（不是最后一个元素）'}],
      note:'★ 原书省了溢出检查（习题 10.1-5）。'},
     {algo:'DEQUEUE',subtitle:'DEQUEUE(Q) —— 5 行出队（原书 p.257）',
      signature:'DEQUEUE(Q)',page:257,
      lines:[
       {n:1,code:'x = Q[Q.head]',zh:'先取出队首。'},
       {n:2,code:'if Q.head == Q.size',zh:'回绕判断。'},
       {n:3,code:'    Q.head = 1',zh:''},
       {n:4,code:'else Q.head = Q.head + 1',zh:''},
       {n:5,code:'return x',zh:'返回。FIFO：返回的正是"来得最久"的那个。'},
      ],
      vars:[{name:'Q.head',meaning:'队首下标'}],
      note:''},
    ]},
   {type:'visualize',title:'看见 LIFO 与环形回绕',
    stateLabels:{active:'刚刚操作',frontier:'在结构内',done:'已弹出（残留）'},
    panels:[
     {title:'① 栈：PUSH 与 POP 只动 top',
      viz:'array',vizMode:'cards',
      algorithm:'stack',
      input:{array:[0,0,0,0,0,0,0,0],size:8,ops:[
        {kind:'push',v:15},{kind:'push',v:6},{kind:'push',v:2},{kind:'push',v:9},
        {kind:'pop'},{kind:'push',v:17},{kind:'push',v:3},{kind:'pop'},{kind:'empty'},
      ]},
      countLabels:{cmp:'边界判断',move:{label:'写入/清除',unit:'次'}},
      invariants:[{label:'栈内元素恒等于 S[1 : S.top] 这一前缀；top = 0 表示空'}],
      presets:[
       {name:'★ Figure 10.2 的序列（PUSH 15,6,2,9 → POP → PUSH 17,3 → POP）',array:[0,0,0,0,0,0,0,0],size:8,args:[8,[{kind:'push',v:15},{kind:'push',v:6},{kind:'push',v:2},{kind:'push',v:9},{kind:'pop'},{kind:'push',v:17},{kind:'push',v:3},{kind:'pop'}]]},
       {name:'压满再看 overflow（容量 6）',array:[0,0,0,0,0,0],size:6,args:[6,[{kind:'push',v:1},{kind:'push',v:2},{kind:'push',v:3},{kind:'push',v:4},{kind:'push',v:5},{kind:'push',v:6},{kind:'push',v:7}]]},
       {name:'空栈 POP（underflow）',array:[0,0,0,0],size:4,args:[4,[{kind:'pop'},{kind:'push',v:42},{kind:'pop'},{kind:'pop'}]]},
      ]},
     {title:'② 队列：head/tail 双指针与回绕',
      viz:'array',vizMode:'cards',
      algorithm:'queue',
      input:{array:[0,0,0,0,0,0,0,0,0,0,0,0],size:12,ops:[
        {kind:'enqueue',v:15},{kind:'enqueue',v:6},{kind:'enqueue',v:9},{kind:'enqueue',v:8},{kind:'enqueue',v:4},
      ]},
      countLabels:{cmp:'边界判断',move:{label:'写入/清除',unit:'次'}},
      invariants:[{label:'队内元素 ＝ Q[head … tail−1]（环形）；head == tail 表示空'}],
      presets:[
       {name:'★ Figure 10.3：入 15,6,9,8,4（从 Q[7] 开始）',array:[0,0,0,0,0,0,0,0,0,0,0,0],size:12,args:[12,[{kind:'enqueue',v:15},{kind:'enqueue',v:6},{kind:'enqueue',v:9},{kind:'enqueue',v:8},{kind:'enqueue',v:4},{kind:'dequeue'},{kind:'enqueue',v:17},{kind:'enqueue',v:3},{kind:'enqueue',v:5},{kind:'dequeue'}]]},
       {name:'★ 小容量看回绕（容量 4）',array:[0,0,0,0],size:4,args:[4,[{kind:'enqueue',v:1},{kind:'enqueue',v:2},{kind:'enqueue',v:3},{kind:'enqueue',v:4},{kind:'dequeue'},{kind:'dequeue'},{kind:'enqueue',v:5},{kind:'enqueue',v:6},{kind:'dequeue'},{kind:'dequeue'}]]},
      ]},
    ],
    tasks:[
     '面板 ① POP 时留意：被弹出的数字**仍留在格子里**（画成浅色）—— 书上 Figure 10.2 也这么画，是 top 把它"踢出"了栈。',
     '面板 ① 切到"压满"预设：第 7 次 PUSH 触发 overflow，帧里会说明。',
     '面板 ② 容量 4 的预设走到底：看 tail 与 head 相继回绕 —— 队内元素数在 0…3 之间循环，数组被当环用。',
    ],
    note:'★ 两个面板都是"数组 + 指针"结构（复用 array 引擎的 cards 模式），指针名分别是 top 与 head/tail。'},
   {type:'code',title:'实测：LIFO、FIFO 与回绕',
    intro:'`c/stack_queue.c` 把栈与环形队列都实现了一遍（含原书省掉的边界检查），逐条验证次序、边界与空间复用。',
    pseudocodeRef:'PUSH',
    c:{file:'stack_queue.c',code:String.raw`/* stack_queue.c -- 10.1 节：数组型栈与环形队列的实现与边界验证。
 * 验证：
 *   ① 栈：PUSH/POP 的 LIFO 次序、overflow/underflow 检测；
 *   ② 队列：ENQUEUE/DEQUEUE 的 FIFO 次序、head/tail 回绕（环形复用空间）；
 *   ③ 三种操作都是 O(1)（每操作常数次数组访问）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o stack_queue stack_queue.c
 */
#include <assert.h>
#include <stdbool.h>
#include <stdio.h>

#define CAP 8

/* ---- 栈：S[0..CAP-1] + top（0 表示空，1 基语义的 0 基内部实现） ---- */
typedef struct { int a[CAP]; int top; int size; } stack_t;

static void stack_init(stack_t *s, int size) { s->top = 0; s->size = size; }
static bool stack_empty(const stack_t *s) { return s->top == 0; }         /* K-EMPTY */

static bool push(stack_t *s, int x)
{
    if (s->top == s->size) { return false; }        /* overflow */
    s->top = s->top + 1;
    s->a[s->top - 1] = x;
    return true;
}

static bool pop(stack_t *s, int *out)
{
    if (stack_empty(s)) { return false; }           /* underflow */
    s->top = s->top - 1;
    *out = s->a[s->top];
    return true;
}

/* ---- 环形队列：Q[0..CAP-1] + head/tail（1 基语义，回绕到 1） ---- */
typedef struct { int a[CAP]; int head; int tail; int size; int count; } queue_t;

static void queue_init(queue_t *q, int size) { q->head = 1; q->tail = 1; q->size = size; q->count = 0; }

static bool enqueue(queue_t *q, int x)
{
    if (q->count == q->size) { return false; }      /* overflow */
    q->a[q->tail - 1] = x;                          /* Q[Q.tail] = x */
    q->count++;
    if (q->tail == q->size) { q->tail = 1; }        /* 回绕 */
    else { q->tail = q->tail + 1; }
    return true;
}

static bool dequeue(queue_t *q, int *out)
{
    if (q->count == 0) { return false; }            /* underflow */
    *out = q->a[q->head - 1];                       /* x = Q[Q.head] */
    q->count--;
    if (q->head == q->size) { q->head = 1; }
    else { q->head = q->head + 1; }
    return true;
}

int main(void)
{
    /* ① 栈：LIFO + 边界 */
    {
        stack_t s; stack_init(&s, 5);
        assert(stack_empty(&s));
        for (int i = 1; i <= 5; i++) { assert(push(&s, i * 10)); }
        assert(!push(&s, 999));                     /* overflow：满栈再压入失败 */
        printf("part 1: 栈满（5 个）后 PUSH 返回 overflow\n");

        int v, order[5];
        for (int i = 0; i < 5; i++) { assert(pop(&s, &v)); order[i] = v; }
        assert(order[0] == 50 && order[1] == 40 && order[4] == 10);
        assert(!pop(&s, &v));                       /* underflow */
        printf("part 2: 出栈次序 %d,%d,%d,%d,%d = LIFO；空栈 POP 返回 underflow\n",
               order[0], order[1], order[2], order[3], order[4]);
    }

    /* ② 队列：FIFO + 回绕 */
    {
        queue_t q; queue_init(&q, 5);
        for (int i = 1; i <= 5; i++) { assert(enqueue(&q, i)); }
        assert(!enqueue(&q, 6));                    /* 满 */
        int v;
        assert(dequeue(&q, &v) && v == 1);          /* FIFO：先入先出 */
        assert(dequeue(&q, &v) && v == 2);
        assert(enqueue(&q, 6));                     /* 出两个后可再入 */
        assert(enqueue(&q, 7));
        assert(q.tail == 3);                        /* ★ 回绕：tail 从 5 → 1（入 6）→ 2（入 7）→ 3 */
        printf("part 3: 队列 FIFO 次序 1,2；出两个后 tail 回绕到 %d（环形复用空间）\n", q.tail);

        /* 连续运转 100 次，验证 count 始终等于真实元素数 */
        int cnt = 5;    /* part 3 结束时队列是满的：3,4,5,6,7 */
        for (int t = 0; t < 100; t++) {
            if (t % 3 == 0) { if (enqueue(&q, t)) { cnt++; } }
            else { if (dequeue(&q, &v)) { cnt--; } }
            assert(q.count == cnt);
            assert(cnt >= 0 && cnt <= 5);
        }
        printf("part 4: 100 次混合操作后 count = %d（与真实元素数始终一致）\n", q.count);
    }

    /* ③ 环形队列的空间复用：容量 5 的队列连续跑 200 次入出，不发生"假满" */
    {
        queue_t q; queue_init(&q, 5);
        int v, ok = 0;
        for (int t = 0; t < 200; t++) {
            if (enqueue(&q, t)) { ok++; }
            if (dequeue(&q, &v)) { ok++; }
        }
        assert(ok > 390);       /* 没有因指针不回头导致的提前失败 */
        printf("part 5: 容量 5 的环形队列跑 200 轮入出，成功操作 %d 次（无假满）\n", ok);
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:21,zh:'`push`：判满 → 抬 top → 写入，与伪代码 4 行一一对应（0 基内部）。'},
              {line:29,zh:'`pop`：判空 → 降 top → 取值。★ 与栈生成器的动画对照看。'},
              {line:39,zh:'`enqueue`：先写 `Q[tail]` 再决定回绕 —— 与伪代码 4 行同序。'},
              {line:49,zh:'`dequeue`：取 `Q[head]` 再回绕。'},
              {line:68,zh:'part 1–2：栈满 PUSH 返回 overflow、出栈次序 50,40,30,20,10 证明 LIFO、空栈 POP 返回 underflow。'},
              {line:84,zh:'★ part 3：队列 FIFO 次序 1,2；入两个新元素后 `tail` 回绕 —— 数组被环形复用。'},
              {line:96,zh:'★ part 4：100 次混合操作，`count` 与真实元素数始终一致（回绕不丢元素）。'},
              {line:108,zh:'★ part 5：容量 5 的队列跑 200 轮入出共 400 次成功操作 —— 没有"假满"（若指针不回绕，40 轮就会卡死）。'}],
       tests:[{in:'栈：压满 5 个再压',out:'返回 overflow；出栈 50,40,30,20,10（LIFO）'},
              {in:'队列：入 1..5 后出两个再入两个',out:'FIFO 次序 1,2；tail 回绕'},
              {in:'容量 5 跑 200 轮入出',out:'400 次操作全部成功（无假满）'}]},
    mapping:[{pc:3,pcCode:'else S.top = S.top + 1',c:'`s->top = s->top + 1;`（第 23 行）'},
             {pc:4,pcCode:'S[S.top] = x',c:'`s->a[s->top - 1] = x;`（第 24 行，−1 是 1 基 → 0 基）'},
             {pc:1,pcCode:'Q[Q.tail] = x',c:'`q->a[q->tail - 1] = x;`（第 44 行）'},
             {pc:3,pcCode:'Q.tail = 1',c:'`q->tail = 1;`（第 46 行）—— 回绕'}]},
   {type:'analyze',title:'两本账：为什么都是 O(1)，以及两种存储法的取舍',
    intro:'本关没有复杂分析 —— 重点是把"$O(1)$"和"存储方式影响性能"这两件事钉死。',
    claims:[
     {expr:'\\Theta(1)',when:'数组任意下标访问（RAM 模型）',page:252,source:'book'},
     {expr:'\\Theta(1)',when:'栈的 PUSH / POP / STACK-EMPTY',page:255,source:'book'},
     {expr:'\\Theta(1)',when:'队列的 ENQUEUE / DEQUEUE',page:257,source:'book'},
     {expr:'n - 1',when:'队列最多容纳的元素数（容量 n 的数组要留一格区分空与满）',page:256,source:'book'},
    ],
    tables:[{caption:'栈 vs 队列',rows:[
      ['','栈','队列'],
      ['取用规矩','LIFO（后进先出）','FIFO（先进先出）'],
      ['删除谁','最近插入的','来得最久的'],
      ['指针','`top` 一个','`head` + `tail` 两个'],
      ['空判据','`top = 0`','`head = tail`'],
      ['回绕','不需要（只在一端动）','**需要**（两端都在动）'],
      ['类比','食堂弹簧盘架','排队买奶茶'],
     ]},
     {caption:'矩阵存储方案取舍',rows:[
      ['方案','结构','优点'],
      ['单数组 · 行优先','$\\langle 1,2,3,4,5,6\\rangle$','连续、缓存友好，**现代机器首选**'],
      ['单数组 · 列优先','$\\langle 1,4,2,5,3,6\\rangle$','按列遍历时连续（Fortran/MATLAB 风格）'],
      ['多数组','每行一个独立数组','支持**不规则数组**（各行长度可不同）'],
      ['块表示','分块存储','分块矩阵运算（第 4 章 Strassen 的工程版）'],
     ]}],
    chart:{xMax:64,series:[
     {name:'PUSH/POP：常数（1 次）',expr:'1',color:'--viz-done'},
     {name:'如果每次移动全部元素：n',expr:'n',color:'--viz-violation'},
    ]},
    derivations:[
     {kind:'summation',title:'为什么栈操作是 O(1)',steps:[
      {zh:'PUSH：一次比较（判满）+ 一次加法 + 一次写入 → **常数条指令**。'},
      {zh:'POP：一次比较（判空）+ 一次减法 + 一次读取 → 常数条指令。'},
      {tex:'T_{\\text{PUSH}} = \\Theta(1), \\quad T_{\\text{POP}} = \\Theta(1)',zh:'★ 关键：**没有任何循环、没有任何元素搬移**。与数组的"删除中间元素要挪动 $\\Theta(n)$ 个元素"形成对比 —— 受限的接口换来了常数时间。'}]},
     {kind:'summation',title:'队列为什么要"少用一格"',steps:[
      {zh:'容量 $n$ 的数组，队列最多存 $n-1$ 个元素：因为要用 `head == tail` 表示空。'},
      {tex:'\\text{满} \\iff \\text{tail} = \\text{head} + 1 \\ (\\text{或回绕边界})',zh:'若允许存满 $n$ 个，`head == tail` 就同时表示空和满 —— **歧义**。C 程序用额外的 `count` 字段规避了这个限制（工程上的常见折中）。'}]},
    ],
    note:'★ 中心图：绿线（常数）与红线（$n$）的对比 —— 如果"出栈"每次要挪动整个数组，栈就不可能是 $O(1)$。受限接口 + 指针 = 常数时间。'},
   {type:'prove',title:'栈操作的常数时间：一条不变量撑起两行代码',
    statement:'Each of the three stack operations takes',
    page:255,
    intro:'★ 原书的"$O(1)$"其实是观察而非定理，但值得认真论证一次 —— 它靠一条简单的不变量：**栈内元素永远是数组的一个前缀**。',
    steps:[
     {title:'第一步 · 不变量：栈内元素 ＝ 前缀 S[1 : S.top]',
      en:'The stack consists of elements S[1 : S: top], where S[1] is the element at the bottom of the stack and S[S: top] is the element at the top.',
      page:254,
      body:['任何时刻，栈内容恰好是 $S[1], \\dots, S[\\text{top}]$ —— 一个**连续前缀**。',
        '★ 这一条不需要任何"维护"动作：PUSH 只是把前缀延长一格，POP 只是缩短一格。']},
     {title:'第二步 · 两个操作各只改一格',
      en:'The procedures STAC K-EMPTY , PUSH, and POP implement each of the stack operations with just a few lines of code.',
      page:255,
      body:['PUSH：`top++` + 写一格 → 前缀延长。',
        'POP：读一格 + `top--` → 前缀缩短（**元素不动**，这就是为什么被弹出的数还留在数组里）。',
        '★ 操作步数与 $n$ 无关 → 常数时间。**如果栈改成"从中间删除"，前缀性质就没了，代价立刻变成 $\\Theta(n)$。**']},
     {title:'第三步 · 边界：0 与 size 各管一头',
      en:'When S: top = 0, the stack contains no elements and is empty.',
      page:255,
      body:['`top = 0`（空）与 `top = size`（满）是前缀的两个端点 —— 判空判满都是**一次比较**。',
        '★ 用 0 而不是 1 表示空，正是为了让"空"与"1 个元素"可区分。C 程序把 underflow/overflow 都断言了一遍。',
        '★ 队列的对应难度：两端都在动，"空"与"满"都可能表现为 `head == tail`，所以要么牺牲一格、要么加计数（原书取前者、C 程序取后者）。']},
    ],
    conclusion:'★ 结论：栈的 $O(1)$ 来自"前缀不变量 + 只改一格"；队列的 $O(1)$ 来自"环形下标 + 不搬元素"。本章后续（链表、树）会把这套"用指针换移动"的思想放大到极致。',
    note:''},
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'栈与队列的根本区别是？',
      options:['存储方式不同','删除的元素是预先规定好的哪一个：LIFO vs FIFO','栈用数组、队列用链表','队列更慢'],answer:1,
      why:'★ 原书 p.254：两者都是"DELETE 删谁被预先规定"的动态集合 —— 栈删最近的（LIFO）、队列删最早的（FIFO）。'},
     {kind:'single',q:'`S.top = 0` 表示什么？',
      options:['栈里有一个值为 0 的元素','栈是空的','栈满了','top 未初始化'],answer:1,
      why:'★ 空栈。用 0 而非 1 表示空，才能与"1 个元素（top = 1）"区分开。'},
     {kind:'single',q:'队列的 `Q.tail` 指向哪里？',
      options:['最后一个元素','下一个空位','队首','数组末尾固定位置'],answer:1,
      why:'★ 原书 p.256：`Q.tail` 指向"下一个新元素将插入的位置"—— 所以队内元素是 $Q[\\text{head} \\dots \\text{tail}-1]$。'},
     {kind:'single',q:'队列的指针为什么要回绕？',
      options:['为了省内存','因为两端都在动，指针会走出数组；环形复用才能让容量 n 的数组长期工作','为了保持元素有序','书上规定的'],answer:1,
      why:'★ 不回绕的话，入队约 $n$ 次后 tail 就撞到边界 —— 数组空间无法复用。C 程序 part 5 用 200 轮入出验证了这一点。'},
     {kind:'judge',q:'POP 之后，被弹出的元素从数组里消失了。',answer:false,
      why:'★ 元素**仍在数组里**（原书 Figure 10.2 把它画成灰色）—— 是 `top` 减小把它"踢出"了栈的定义范围。这也是栈不搬元素、能 $O(1)$ 的原因。'},
     {kind:'simulate',q:'容量 5 的栈依次 PUSH 4,1,3，然后 POP 两次，再 PUSH 8。此时 S.top = ?（填整数）',expect:[2],placeholder:'例如：3',
      why:'入 3 个 → top = 3；弹两次 → top = 1（栈内 {4}）；再 PUSH 8 → top = 2（栈内 {4,8}）。'},
    ],
    bookExercises:[
     {id:'10.1-1',page:257,star:0,statement:'Consider an m × n matrix in row-major order, where both m and n are powers of 2 and rows and columns are indexed from 0. We can represent a row index i in binary by the lg m bits ⟨i lg m−1 ,i lg m−2 ,…,i 0⟩ and a column index j in binary by the lg n bits ⟨j lg n−1 ,j lg n−2 ,…,j 0⟩. Suppose that this matrix is a 2 × 2 block matrix, where each block has m/2 rows and n/2 columns, and it is to be represented by a single array with 0-origin indexing. Show how to construct the binary representation of the (lg m C lg n)-bit index into the single array from the binary representations of i and j .',hint:'思路：下标 = $i \\cdot n + j$，把 $i$、$j$ 的二进制位**拼接**起来即是（因为 $n$ 是 2 的幂，乘 $n$ 等于左移 $\\lg n$ 位）。'},
     {id:'10.1-2',page:257,star:0,statement:'Using Figure 10.2 as a model, illustrate the result of each operation in the sequence PUSH(S,4) , PUSH(S,1) , PUSH(S,3) , POP(S), PUSH(S,8) , and POP(S) on an initially empty stack S stored in array S[1 : 6]',hint:'序列 PUSH(S,4), PUSH(S,1), PUSH(S,3), POP(S), PUSH(S,8), POP(S)，初始 top = 0， 逐步是 1, 2, 3, 2, 3, 2；栈内元素依次 $\\langle 4\\rangle \\to \\langle 4,1\\rangle \\to \\langle 4,1,3\\rangle \\to \\langle 4,1\\rangle \\to \\langle 4,1,8\\rangle \\to \\langle 4,1\\rangle$（弹出的是 3 和 8）。 照 Figure 10.2 的画法把每步的数组与 top 都标出来。 阶段 5 面板 ① 的第 1 组是**同结构的另一串**操作（Figure 10.2 原序列），第 3 组是空栈 POP， 本题这串没有现成预设，手动推一遍更实在。'},
     {id:'10.1-3',page:258,star:0,statement:'Explain how to implement two stacks in one array A[1 : n] in such a way that neither stack overflows unless the total number of elements in both stacks together is n. The PUSH and POP operations should run in O(1) time.',hint:'两栈**从两端向中间生长**：栈 1 用 A[1..top1]（向上），栈 2 用 A[top2..n]（向下）。**总元素数为 n 才溢出**——判据是 top1 + 1 == top2。'},
     {id:'10.1-4',page:258,star:0,statement:'Using Figure 10.3 as a model, illustrate the result of each operation in the sequence ENQUEUE(Q,4) , ENQUEUE(Q,1) , ENQUEUE(Q,3) , DEQUEUE(Q), ENQUEUE(Q,8) , and DEQUEUE(Q) on an initially empty queue Q stored in array Q[1 : 6].',hint:'初始 $head = tail = 1$，$Q.size = 6$。照 $\\text{tail}$ 指**下一个空位**的约定逐步写： 三次 ENQUEUE 把 4,1,3 放进 $Q[1..3]$、$tail = 4$；DEQUEUE 取走 4、$head = 2$； ENQUEUE 8 放进 $Q[4]$、$tail = 5$；DEQUEUE 取走 1、$head = 3$。队内剩 $\\langle 3,8\\rangle$。 注意 $Q.tail$ 不是最后一个元素的位置 —— 判空是 $head == tail$。 阶段 5 面板 ② 第 1 组是 Figure 10.3 的序列、第 2 组是小容量回绕，结构相同但数字不是本题的。'},
     {id:'10.1-5',page:258,star:0,statement:'Rewrite ENQUEUE and DEQUEUE to detect underflow and overflow of a queue.',hint:'判空前先问一句话：**下一个格是不是 $head$**。约定 $\\text{tail}$ 指下一个空位、$head == tail$ 表示空， 所以满 ⟺ $tail$ 的下一格回绕到 $head$，即 一般情形 $head == tail + 1$，回绕边界 $head == 1$ 且 $tail == size$ —— **别写成 $tail == head + 1$**， 那是队列只剩 1 个元素的状态，和「满」差着 $size - 2$ 格。 判空则统一是 $head == tail$。写全：ENQUEUE 先判满报 overflow，再 $Q[Q.tail] = x$ 并回绕推进 $tail$； DEQUEUE 先判空报 underflow，再取 $Q[Q.head]$ 并回绕推进 $head$。 嫌两个条件麻烦，就照本关 C 程序加一个 $count$ 字段（判满 $count == size$、判空 $count == 0$，代价是多一个字段）。'},
     {id:'10.1-7',page:258,star:0,statement:'Show how to implement a queue using two stacks. Analyze the running time of the queue operations.',hint:'入队：PUSH 到栈 A（$O(1)$）。出队：若栈 B 空，把 A 全部弹出并压入 B（$O(k)$），再从 B 弹出（$O(1)$）。**摊还分析**：每个元素至多搬两次 → 摊还 $O(1)$（第 16 章摊还分析的前奏）。'},
    ]},
  ],
};
