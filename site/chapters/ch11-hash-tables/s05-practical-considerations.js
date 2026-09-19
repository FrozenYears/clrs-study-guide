/* 第 11 章 11.5：散列表的工程实践（Practical considerations）。
 * 原文锚点：印刷页 301–312（pdf_index 322–333）。
 * 引述已用 tools/07_pick_quotes.py pick 11 11.5 逐条预检（PASS）。
 * 主题：内存层次下线性探测为何变香、开放寻址删除的"搬回法"（不用 DELETED）、
 *       初级聚集、Theorem 11.9（5-independent → 期望 O(1)）、以及 wee 散列函数。
 */

/* Figure 11.6 删除演示：m = 10、h1(k) = k mod 10、
 * 插入顺序 74,43,93,18,82,38,92 之后的槽分布（槽号 → key，NIL 表示空）。 */
const DEL_INSERTED = [
  { i: 0, chain: [] }, { i: 1, chain: [] }, { i: 2, chain: [{ key: 82 }] },
  { i: 3, chain: [{ key: 43 }] }, { i: 4, chain: [{ key: 74 }] },
  { i: 5, chain: [{ key: 93 }] }, { i: 6, chain: [{ key: 92 }] },
  { i: 7, chain: [] }, { i: 8, chain: [{ key: 18 }] }, { i: 9, chain: [{ key: 38 }] },
];

export default {
  key: 's05', id: 'ch11/s05', chapter: 11, section: '11.5',
  title: '工程实践：内存层次、删除与 wee', shortTitle: '11.5 散列表 · 工程实践',
  titleEn: 'Practical considerations',
  source: { printed: [301, 311], pdf: [322, 333] },
  prerequisites: [
    { label: '11.2 链接法', url: '#/ch11/s02' },
    { label: '11.3 散列函数（选 h 的基础）', url: '#/ch11/s03' },
  ],
  stages: [
    /* ---------- 0 · 位置感 ---------- */
    { type: 'map', title: '把散列从"纸面模型"拉到真实 CPU',
      why: '11.1–11.4 都在**标准 RAM 模型**下讨论散列：每次操作的成本 = 探测的槽数。但真实 CPU 有**内存层次**（寄存器 → cache → 主存），一次主存访问比一次寄存器运算慢几十到上百倍。这一节把视角拉到真实机器，回答四个工程问题：① 为什么线性探测在 cache 下反而比双散列快；② 开放寻址里**怎么删除**（不能用 DELETED 标记）；③ 初级聚集是好是坏；④ 既然散列函数可以很复杂，有没有一个"寄存器里就能算"的好函数——答案是 **wee**。',
      position: '11.5 是本章最后一节。前几节讲"怎么选 $h$"（$11.3$）、"冲突怎么消化"（链接法 $11.2$ / 开放寻址 $11.4$）。这一节是**补丁包**：在真实机器上，前面的结论哪些要改、哪些还能用。结论会反过来影响你对 $11.4$ 的选择——比如为什么很多语言的标准库用线性探测。',
      unlocks: [{ label: '第 12 章 Binary Search Trees', url: '#/ch12/s01' }],
      mathKit: [
        { title: '散列函数 $h$', body: '$h: U \\to \\{0,1,\\dots,m-1\\}$。$11.3$ 讲怎么选；这一节讲"在内存层次下，复杂一点也划算"。' },
        { title: '负载因子 $\\alpha$', body: '$\\alpha = n/m$（平均每个槽的元素数）。$\\alpha$ 越接近 $1$，冲突越多、探测越长。' },
        { title: '$5$-independent', body: '一个散列函数族若任意 $5$ 个 key 的散列值相互独立，就叫 $5$-independent。Theorem 11.9 用它换来了线性探测的 $O(1)$ 期望。' },
        { title: 'cache block（缓存块）', body: '主存按"块"（如 $64$ 字节）加载进 cache。连续访问同一块几乎免费——这是线性探测在层次模型下变快的根本原因。' },
      ] },

    /* ---------- 1 · 直觉 ---------- */
    { type: 'intuition', title: '仓库里取箱子：分散 vs 成块',
      scene: '仓库找箱子：分散存放 vs 同一货架上成块存放',
      body: [
        '想象一个仓库，每个箱子有一个编号。标准 RAM 模型假设"取任意一个箱子"成本都一样。但真实仓库里，箱子按**货架**摆放，一次推车去一个货架能拿下好几个相邻箱子（这就像 CPU 一次把一整块 cache 搬进寄存器）。',
        '★ 若箱子分散在仓库各处，取 $10$ 个箱子要跑 $10$ 趟（每次 ≈ 一次主存访问）；若箱子紧挨着放在同一货架，取 $10$ 个箱子可能只跑 $1$ 趟（其余 $9$ 个免费）——**线性探测正是这样**：探测序列是"下一个槽、再下一个槽"，在内存里就是地址连续，常常落在同一个 cache block。',
        '★ 这就解释了全章最反直觉的一句话：**线性探测在标准 RAM 模型里被看不起，却在层次内存模型里表现出色**。代价只在"探测序列跨出当前 cache block"时才付出——所以"让探测序列尽量短"比"让冲突绝对最少"更重要。',
        '★ 那删除呢？开放寻址的槽里只有一个 key，不能像链接法那样直接摘掉（否则后面的 key 会"够不着"）。这一节的王牌是**搬回法**：删掉一个 key 后，把探测序列上"本应先被它占用的"后续 key 往前挪，把断裂的序列重新接上。',
      ],
      interactive: { text: '阶段 4 的面板用 Figure 11.6 的实例（m = 10、h1(k) = k mod 10、删除 43）逐帧演示搬回法：93 上移到槽 3、92 上移到槽 5。' } },

    /* ---------- 2 · 原文精读 ---------- */
    { type: 'source', title: '书上是怎么说的',
      lead: '下面每条都是原书英文原文（衬线体，含原书对 $h_1$、$\\alpha$、初级聚集的排版形式）。',
      blocks: [
        { kind: 'body', page: 302,
          en: 'RAM model. But linear probing excels for hierarchical memory models, because successive probes are usually to the same cache block of memory.',
          zh: '★★ 全节最反直觉的结论：**线性探测在标准 RAM 模型里被嫌弃，在层次内存模型里却出色**——因为连续探测通常落在同一个 cache block。' },
        { kind: 'body', page: 302,
          en: 'Another reason why linear probing is often not used in practice is that deletion seems complicated or impossible without using the special DELETED value. Yet we’ll now see that deletion from a hash table based on linear probing is not all that difficult, even without the DELETED marker. The deletion procedure works for linear probing, but not for open-address probing in general, because with linear probing keys all follow the same simple cyclic probing sequence (albeit with different starting points).',
          zh: '★★ **为什么不能用简单的 DELETED 标记**：开放寻址删除看似必须置 DELETED。原书说线性探测其实**不需要 DELETED**——因为所有 key 走的是**同一条循环探测序列**（只是起点不同），所以可以"搬回"。这一点对一般开放寻址（如双散列）不成立。' },
        { kind: 'body', page: 302,
          en: 'The deletion procedure relies on an "inverse" function to the linear-probing hash function h(k,i) = (h 1 (k) + i) mod m, which maps a key k and a probe number i to a slot number in the hash table. The inverse function g maps a key k and a slot number q, where 0 ≤ q<m , to the probe number that reaches slot q: g(k,q) = (q − h 1 (k)) mod m:',
          zh: '★★ **搬回法的数学核心**：线性探测的探测序列 $h(k,i) = (h_1(k)+i) mod m$ 有逆函数 $g(k,q) = (q - h_1(k)) mod m$，它回答"key $k$ 的第几个探测槽是 $q$"。用 $g$ 就能判断"槽 $q$ 是不是在槽 $q\\prime$ 之前被 $k$ 探测到"。' },
        { kind: 'body', page: 302,
          en: 'The procedure first deletes the key in position q by setting T [q] to NIL in line 2. It then searches for a slot q 0 (if any) that contains a key that should be moved t o the slot q just vacated by key k. Line 9 asks the critical question: does the key k 0 in slot q 0 need to be moved to the vacated slot q in order to preserve the accessibility of k 0 ? If g(k 0 ,q) <g(k 0 ,q 0 ), then during the insertion of k 0 into the table, slot q was examined but found to be already occupied. But now slot q, where a search will look for k 0 , is empty. In this case, key k 0 moves to slot q in line 10, and the (a)',
          zh: '★★ **关键问题（第 9 行）**：若 $g(k\\prime,q) < g(k\\prime,q\\prime)$，说明插入 $k\\prime$ 时**槽 $q$ 先于 $q\\prime$ 被探测到**；现在 $q$ 空了，一次查找会在 $q$ 处停下、错过 $k\\prime$——所以 $k\\prime$ 必须搬回 $q$。（注意原文 `q 0` 即 $q\\prime$ 的排版形式。）' },
        { kind: 'figure-caption', page: 303,
          en: 'Figure 11.6 Deletion in a hash table that uses linear probing. The hash table has size 10 with h 1 (k) = k mod 10. (a) The hash table after inserting keys in the order 74, 43, 93, 18, 82, 38, 92.',
          zh: '★★ Figure 11.6：删除的完整例子（m = 10、h1(k) = k mod 10）。(a) 插入 74,43,93,18,82,38,92 后的表；(b) 删除 43 后 93 上移到槽 3、92 上移到槽 5。阶段 4 逐帧复现。' },
        { kind: 'body', page: 303,
          en: 'Linear probing is popular to implement, but it exhibits a phenomenon known as primary clustering. Long runs of occupied slots build up, increasing the average search time. Clusters arise because an empty slot preceded by i full slots gets filled next with probability (i + 1)/m. Long runs of occupied slots tend to get longer, and the average search time increases.',
          zh: '★★ **初级聚集（primary clustering）**：连续被占的槽越积越长（因为"前面有 $i$ 个满槽的空槽"下一次以 $(i+1)/m$ 的概率被填上），平均查找时间随之上升。这是线性探测在标准模型下的软肋——但在层次模型下它反而有益（见下一条）。' },
        { kind: 'body', page: 304,
          en: 'If h 1 is 5-independent and ˛ ≤ 2/3, then it takes expected constant time to search for, insert, or delete a key in a hash table using linear probing.',
          zh: '★★ **Theorem 11.9**（本关最重要的保证）：只要 $h_1$ 是 **$5$-independent** 且 **$\\alpha \\le 2/3$**，线性探测的查找 / 插入 / 删除**期望都是 $O(1)$**。原书说证明略去（需要 $5$-独立性的结论并不显然）。' },
        { kind: 'body', page: 304,
          en: 'Instead, we present here a simple hash function based only on addition, multi- plication, and swapping the halves of a word. This function can be implemented entirely within the fast registers, and on a machine with a memory hierarchy, its latency is small compared with the time taken to access a random slot of the hash table. It is related to the R + 6 encryption algorithm and can f or practical purposes be considered a "random oracle."',
          zh: '★★ **wee 散列函数的设计哲学**：只用加法、乘法、半字交换，**全在寄存器里算完**。在层次内存模型下，它的延迟比"访问一个随机槽"还小——所以散列函数**可以很复杂**（甚至 $5$-independent），也不再是瓶颈。' },
      ],
      terms: [
        { en: 'linear probing', zh: '线性探测（冲突时探测下一个槽）', page: 302 },
        { en: 'primary clustering', zh: '初级聚集（连续满槽越积越长）', page: 303 },
        { en: 'cache block', zh: '缓存块（主存按块加载进 cache）', page: 302 },
        { en: '5-independent', zh: '5-independent（任意 5 个 key 散列值独立）', page: 304 },
        { en: 'wee hash function', zh: 'wee 散列函数（寄存器内可算的随机化散列）', page: 304 },
      ] },

    /* ---------- 3 · 伪代码 ---------- */
    { type: 'pseudocode', title: 'LINEAR-PROBING-HASH-DELETE：搬回法',
      lead: '★ 两段伪代码都来自 11.5：删除（p303，开放寻址的难点）与 wee（p307，寄存器内散列）。`code` 已按渲染页规范化（`T[q] = NIL`、`q′`、`==` 等），不是语料里的 OCR 伪影。',
      algo: 'LINEAR-PROBING-HASH-DELETE', signature: 'LINEAR-PROBING-HASH-DELETE(T, q)', page: 303,
      lines: [
        { n: 1, code: 'while TRUE', zh: '外层循环：每搬回一个 key，就从新腾出的槽继续扫描' },
        { n: 2, code: 'T[q] = NIL', zh: '★ 把目标槽 $q$ 清空（删除动作本身）' },
        { n: 3, code: 'q′ = q', zh: '扫描起点设为 $q$' },
        { n: 4, code: 'repeat', zh: '沿探测序列往后找"需要搬回的" key' },
        { n: 5, code: 'q′ = (q′ + 1) mod m', zh: '下一个槽（线性探测的步长恒为 1）' },
        { n: 6, code: 'k′ = T[q′]', zh: '取出槽 $q\\prime$ 里的候选 key' },
        { n: 7, code: 'if k′ == NIL', zh: '★ 遇到空槽：说明后面没有需要搬的 key 了' },
        { n: 8, code: 'return', zh: '停止（探测序列已修复）' },
        { n: 9, code: 'until g(k′,q) < g(k′,q′)', zh: '★ 关键判断：$g(k\\prime,q) < g(k\\prime,q\\prime)$ 意味着槽 $q$ 先于 $q\\prime$ 被 $k\\prime$ 探测到 → 必须搬回' },
        { n: 10, code: 'T[q] = k′', zh: '把 $k\\prime$ 搬回空出的 $q$' },
        { n: 11, code: 'q = q′', zh: '从刚腾出的 $q\\prime$ 继续扫描' },
      ],
      vars: [
        { name: 'h1(k)', meaning: '基础散列：线性探测用 $h_1(k)$，探测序列为 $(h_1(k)+i) mod m$' },
        { name: 'g(k,q)', meaning: '逆函数：$g(k,q) = (q - h_1(k)) mod m$，回答"$q$ 是 $k$ 的第几个探测槽"' },
        { name: 'q′', meaning: '扫描指针（语料里写作 $q\\ 0$ 的排版形式）' },
      ],
      note: '★ 为什么不能直接置 DELETED：开放寻址的查找沿探测序列走，一旦某处是 DELETED，后续 key 还能被找到；但"搬回法"更省空间（不浪费一个槽当墓碑），且只依赖"所有 key 同一条循环序列"这一性质。',
      more: [
        { algo: 'WEE', subtitle: 'WEE(k, a, b, t, r, m) —— 可变长输入的 wee 散列（原书 p.307）',
          signature: 'WEE(k, a, b, t, r, m)', page: 307,
          lines: [
            { n: 1, code: 'u = ⌈t/w⌉', zh: '把 $t$ 比特的输入切成 $u$ 个机器字（w 为字长，如 64）' },
            { n: 2, code: '⟨k1, k2, …, ku⟩ = chop(k)', zh: 'chop 把输入分成 $u$ 个 $w$ 比特字（一一对应，可还原）' },
            { n: 3, code: 'q = b', zh: '初值取随机偏置 $b$（让不同输入随机化）' },
            { n: 4, code: 'for i = 1 to u', zh: '逐个字迭代（CBC-MAC 式的链条）' },
            { n: 5, code: 'q = f_a^(r + 2^t)(k_i + q)', zh: '★ 对每个字叠加上一轮散列；指数里的 $2^t$ 让"不同长度输入"用不同轮数的函数' },
            { n: 6, code: 'return q mod m', zh: '最后对表长 $m$ 取模得到槽号' },
          ],
          vars: [
            { name: 'f_a(k)', meaning: '单轮：$f_a(k) = \\text{swap}(2k^2 + a k mod 2^w)$，再对半字交换' },
            { name: 'r, t', meaning: '$r$ 为轮数；$t$ 为输入比特长（变长输入时 $2^t$ 改变函数）' },
          ],
          note: '★ wee 的核心是 $f_a(k) = \\text{swap}(2k^2 + a k mod 2^w)$：只含加法/乘法/半字交换，全程在寄存器里完成，延迟比一次随机探测还小。' },
      ] },

    /* ---------- 4 · 可视化 ---------- */
    { type: 'visualize', title: '看见搬回法如何修复探测序列',
      panels: [
        { title: '① Figure 11.6：删除 43，93 与 92 依次上移',
          viz: 'hash-table',
          mode: 'open',
          invariants: [{ label: '删除后，每个剩余 key k 仍能在其探测序列上被找到（原本应先被探测到空槽 q 的 key 都已搬回 q）' }],
          trees: [
            { m: 10, mode: 'open', phase: '插入完成',
              slots: DEL_INSERTED,
              note: '插入 74,43,93,18,82,38,92 之后（m=10，h1(k)=k mod 10）。h1(k)=k mod 10' },
            { m: 10, mode: 'open', phase: 'LINEAR-PROBING-HASH-DELETE',
              slots: [
                { i: 0, chain: [] }, { i: 1, chain: [] }, { i: 2, chain: [{ key: 82 }] },
                { i: 3, chain: [] }, { i: 4, chain: [{ key: 74 }] },
                { i: 5, chain: [{ key: 93 }] }, { i: 6, chain: [{ key: 92 }] },
                { i: 7, chain: [] }, { i: 8, chain: [{ key: 18 }] }, { i: 9, chain: [{ key: 38 }] },
              ],
              pointers: { q: 3 }, highlight: { active: [3] },
              note: '删除 43：先把 T[3] 置 NIL（第 2 行）。现在 93、92 的探测序列在槽 3 处会"断掉"' },
            { m: 10, mode: 'open', phase: 'LINEAR-PROBING-HASH-DELETE',
              slots: [
                { i: 0, chain: [] }, { i: 1, chain: [] }, { i: 2, chain: [{ key: 82 }] },
                { i: 3, chain: [{ key: 93 }] }, { i: 4, chain: [{ key: 74 }] },
                { i: 5, chain: [] }, { i: 6, chain: [{ key: 92 }] },
                { i: 7, chain: [] }, { i: 8, chain: [{ key: 18 }] }, { i: 9, chain: [{ key: 38 }] },
              ],
              pointers: { q: 3, qp: 5 }, highlight: { done: [3], compare: [5] },
              note: '扫描到 93（原 T[5]）：g(93,3)=0 < g(93,5)=2 → 槽 3 先于槽 5 被 93 探测到 → 93 搬回槽 3（第 10 行）' },
            { m: 10, mode: 'open', phase: 'LINEAR-PROBING-HASH-DELETE',
              slots: [
                { i: 0, chain: [] }, { i: 1, chain: [] }, { i: 2, chain: [{ key: 82 }] },
                { i: 3, chain: [{ key: 93 }] }, { i: 4, chain: [{ key: 74 }] },
                { i: 5, chain: [{ key: 92 }] }, { i: 6, chain: [] },
                { i: 7, chain: [] }, { i: 8, chain: [{ key: 18 }] }, { i: 9, chain: [{ key: 38 }] },
              ],
              pointers: { q: 5, qp: 6 }, highlight: { done: [5], compare: [6] },
              note: '继续扫描到 92（原 T[6]）：g(92,5)=3 < g(92,6)=4 → 92 搬回槽 5（第 10 行）' },
            { m: 10, mode: 'open', phase: 'LINEAR-PROBING-HASH-DELETE',
              slots: [
                { i: 0, chain: [] }, { i: 1, chain: [] }, { i: 2, chain: [{ key: 82 }] },
                { i: 3, chain: [{ key: 93 }] }, { i: 4, chain: [{ key: 74 }] },
                { i: 5, chain: [{ key: 92 }] }, { i: 6, chain: [] },
                { i: 7, chain: [] }, { i: 8, chain: [{ key: 18 }] }, { i: 9, chain: [{ key: 38 }] },
              ],
              pointers: {}, highlight: { done: [2, 3, 4, 5, 8, 9] },
              note: '扫描到 T[7]=NIL，停止。探测序列修复完毕：93 在槽 3、92 在槽 5，查找 93/92 不再经过空槽' },
          ],
        },
      ],
      tasks: [
        '逐帧看：删除 43 后，为什么 93 必须搬到槽 3（提示：一次查找 93 会在槽 3 处停下，若 93 留在槽 5 就永远找不到了）？',
        '用 $g(k,q) = (q - h_1(k)) mod 10$ 验证：g(93,3) = 0、g(93,5) = 2，所以 0 < 2 → 搬回。',
        '末帧读表：T[3]=93、T[5]=92，其余不变；这与 Figure 11.6(b) 完全一致。',
        '想想为什么双散列不能套用这套搬回法（提示：每个 key 的探测序列步长不同，没有"同一条循环序列"）。',
      ],
      note: '★ 面板用散列表引擎（open 模式）。帧是静态序列，逐帧点"下一帧"即可看到 93、92 依次上移。' },

    /* ---------- 5 · 双轨实现 ---------- */
    { type: 'code', title: '实测：从"取模 2 的幂"到"搬回法删除"',
      intro: '`c/hash_practical.c` 把 11.5 的工程要点都跑了一遍：散列函数避开 2 的幂、全域散列、开放寻址的搬回法删除、自由表、再散列、以及 wee 散列函数。',
      pseudocodeRef: 'LINEAR-PROBING-HASH-DELETE',
      c: {
        file: 'hash_practical.c',
        code: String.raw`/* hash_practical.c -- 11.5 节「散列表的工程实践」配套实现。
 *   ① 散列函数怎么选：除法散列要避开 2 的幂（用素数）；乘法散列。
 *   ② 全域散列：从随机族里选一个函数，逼近"独立均匀散列"。
 *   ③ 开放寻址的删除（线性探测）：搬回法，不用 DELETED 标记。
 *   ④ 自由表（free list）：用一条链串起所有空闲槽，分配/释放 O(1)。
 *   ⑤ 负载因子触发再散列（rehash）：α 超限就把表扩一倍并重散列。
 *   ⑥ wee 散列函数：只用加法/乘法/半字交换，全在寄存器里算（11.5.2）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o hash_practical hash_practical.c
 */
#include <assert.h>
#include <stdint.h>
#include <stdio.h>

/* ---------- 0. 除法散列：h(k) = k mod m（m 为素数，避开 2 的幂） ---------- */
static int div_hash(int k, int m) { int q = k % m; return q < 0 ? q + m : q; }

/* 乘法散列：h(k) = floor(m * (k*A mod 1))，A ≈ (sqrt(5) - 1) / 2 */
static int mult_hash(int k, int m) {
    const double A = 0.6180339887498949;        /* (sqrt(5) - 1) / 2 */
    double frac = (double)k * A;
    frac = frac - (long)frac;                   /* 取小数部分 */
    return (int)(m * frac);
}

/* ---------- 1. 取模 2 的幂是个坏主意 ---------- */
static void part1_power_of_two(void) {
    /* 8 个 key 全是 16 的倍数；m_bad = 16 = 2^4，h(k) 只看低 4 位 → 全为 0 */
    int keys[8] = {16, 32, 48, 64, 80, 96, 112, 128};
    int m_bad = 16, m_good = 17;                /* 17 是素数 */
    int bad[16] = {0}, good[17] = {0};
    for (int i = 0; i < 8; i++) { bad[div_hash(keys[i], m_bad)]++; good[div_hash(keys[i], m_good)]++; }
    int bad_max = 0, good_max = 0;
    for (int i = 0; i < 16; i++) bad_max  = bad[i]  > bad_max  ? bad[i]  : bad_max;
    for (int i = 0; i < 17; i++) good_max = good[i] > good_max ? good[i] : good_max;
    assert(bad_max == 8);                        /* 8 个 key 全部挤进槽 0 */
    assert(good_max == 1);                       /* 素数 m：每个槽至多 1 个 */
    /* 乘法散列：取 A ≈ (sqrt(5)-1)/2，对同样的 key 也不会全挤进一个槽 */
    int mul[16] = {0};
    for (int i = 0; i < 8; i++) mul[mult_hash(keys[i], 16)]++;
    int mul_max = 0;
    for (int i = 0; i < 16; i++) mul_max = mul[i] > mul_max ? mul[i] : mul_max;
    assert(mul_max < 8);                         /* 乘法散列把 key 摊开了 */
    printf("part 1: 取模 2 的幂(m=16) → 8 个 key 全落在槽 0；取模素数(m=17) → 每槽至多 1 个；乘法散列也摊开\n");
}

/* ---------- 2. 全域散列：h_{a,b}(k) = ((a*k + b) mod p) mod m ---------- */
static int universal_hash(int k, int a, int b, int p, int m) {
    long v = ((long)a * k + b) % p;
    if (v < 0) v += p;
    return (int)(v % m);
}

/* 固定种子的确定性 PRNG（线性同余），保证复现 */
static int prng(long *seed) {
    *seed = (*seed * 1103515245 + 12345) & 0x7fffffff;
    return (int)(*seed % 100000);
}

static void part2_universal(void) {
    const int p = 1000003, m = 64;              /* p 是素数，大于全域 */
    long seed = 12345;
    int a = prng(&seed) % (p - 1) + 1;          /* 随机选 a */
    int b = prng(&seed) % p;                     /* 随机选 b */
    int uni[64] = {0}, naive[64] = {0};
    for (int i = 0; i < 2000; i++) {
        int k = prng(&seed);
        uni[universal_hash(k, a, b, p, m)]++;
        naive[div_hash(k, m)]++;                /* 对照：直接用 k mod m */
    }
    int uni_max = 0, naive_max = 0, uni_occ = 0, naive_occ = 0;
    for (int i = 0; i < 64; i++) {
        uni_max  = uni[i]  > uni_max  ? uni[i]  : uni_max;
        naive_max = naive[i] > naive_max ? naive[i] : naive_max;
        if (uni[i])  uni_occ++;
        if (naive[i]) naive_occ++;
    }
    /* 2000 个 key 入 64 槽（平均链长 ≈ 31）：全域散列应把绝大多数槽都用上，
     * 且最长链小于总 key 数（即没有退化成一条链）。 */
    assert(uni_occ > 40);                         /* 至少用到 40/64 个槽 */
    assert(uni_max < 2000 && naive_max < 2000);  /* 没有退化成一条链 */
    printf("part 2: 2000 个随机 key 入 64 槽，最长链 朴素=%d 全域=%d；用到的槽 朴素=%d 全域=%d（a=%d,b=%d）\n",
           naive_max, uni_max, naive_occ, uni_occ, a, b);
}

/* ---------- 3. 开放寻址（线性探测）的删除：搬回法 ---------- */
#define OA_M 10
#define NIL_KEY (-1)

static int oa_h1(int k) { int q = k % OA_M; return q < 0 ? q + OA_M : q; }

/* 线性探测插入：返回落点的槽号；满则返回 -1 */
static int oa_insert(int T[], int k) {
    for (int i = 0; i < OA_M; i++) {
        int q = (oa_h1(k) + i) % OA_M;
        if (T[q] == NIL_KEY) { T[q] = k; return q; }
    }
    return -1;
}

/* g(k,q) = (q - h1(k)) mod m：key k 的探测序列里，槽 q 是第几个被探测到的 */
static int oa_g(int k, int q) {
    int v = (q - oa_h1(k)) % OA_M;
    return v < 0 ? v + OA_M : v;
}

/* LINEAR-PROBING-HASH-DELETE 的 C 实现（搬回法，不用 DELETED 标记）：
 * 删除位置 q 的 key 后，沿探测序列向后扫描；凡"原本应先被探测到 q"的后续 key，
 * 都搬回 q（因为现在 q 空了，否则一次查找会在 q 处停下、错过它）。 */
static void oa_delete(int T[], int q) {
    T[q] = NIL_KEY;                             /* 行 2：把目标槽置空 */
    while (1) {
        int qp = q;                            /* 行 3：扫描起点 */
        while (1) {                            /* 行 4：repeat */
            qp = (qp + 1) % OA_M;              /* 行 5：下一个槽 */
            int kp = T[qp];                    /* 行 6：下一个待搬的候选 key */
            if (kp == NIL_KEY) return;         /* 行 7-8：遇到空槽，停止 */
            if (oa_g(kp, q) < oa_g(kp, qp)) {  /* 行 9：g(k′,q) < g(k′,q′) ? */
                T[q] = kp;                     /* 行 10：搬回空出的 q */
                T[qp] = NIL_KEY;               /* 槽 qp 腾空 */
                q = qp;                        /* 行 11：从新空槽继续 */
                break;
            }
        }
    }
}

static void part3_linear_probe_delete(void) {
    /* Figure 11.6(a)：依次插入 74,43,93,18,82,38,92（h1(k)=k mod 10） */
    int T[OA_M];
    for (int i = 0; i < OA_M; i++) T[i] = NIL_KEY;
    int keys[7] = {74, 43, 93, 18, 82, 38, 92};
    for (int i = 0; i < 7; i++) assert(oa_insert(T, keys[i]) >= 0);
    assert(T[2] == 82 && T[3] == 43 && T[4] == 74 && T[5] == 93 && T[6] == 92
           && T[8] == 18 && T[9] == 38);

    /* 删除 43（在槽 3）：Figure 11.6(b) 期望 93 上移到槽 3、92 上移到槽 5 */
    oa_delete(T, 3);
    assert(T[3] == 93);                         /* 93 搬回槽 3 */
    assert(T[5] == 92);                         /* 92 搬回槽 5 */
    assert(T[2] == 82 && T[4] == 74 && T[8] == 18 && T[9] == 38);
    assert(T[6] == NIL_KEY && T[7] == NIL_KEY);
    printf("part 3: 删除 43 后：T[3]=93（上移）、T[5]=92（上移）；探测序列已修复\n");
}

/* ---------- 4. 自由表：用一条链串起所有空闲槽 ---------- */
#define FL_N 8
static int g_fl_next[FL_N];                     /* 自由表的 next 指针 */
static int g_fl_head;                           /* 自由表头 */
static int g_fl_slot[FL_N];                     /* 槽内容（NIL_KEY = 空闲） */

static int fl_alloc(void) {                     /* 从自由表头取一个空闲槽 */
    if (g_fl_head < 0) return -1;
    int s = g_fl_head;
    g_fl_head = g_fl_next[s];
    return s;
}
static void fl_release(int s) {                 /* 把槽 s 还回自由表头 */
    g_fl_next[s] = g_fl_head;
    g_fl_head = s;
    g_fl_slot[s] = NIL_KEY;
}

static void part4_free_list(void) {
    g_fl_head = 0;
    for (int i = 0; i < FL_N; i++) {            /* 初始：整张表都是空闲槽 */
        g_fl_next[i] = (i + 1) % FL_N;
        g_fl_slot[i] = NIL_KEY;
    }
    g_fl_next[FL_N - 1] = -1;                   /* 表尾 */
    int a = fl_alloc(), b = fl_alloc(), c = fl_alloc();
    assert(a == 0 && b == 1 && c == 2);
    fl_release(b);                              /* 释放槽 1 → 回到自由表头 */
    int d = fl_alloc();
    assert(d == 1);                             /* 下一次分配优先拿到刚释放的槽 1 */
    printf("part 4: 自由表分配/释放：分配 0,1,2 → 释放 1 → 再分配拿到 1（O(1)）\n");
}

/* ---------- 5. 负载因子触发再散列 ---------- */
static void part5_rehash(void) {
    /* 插入 6 个 key 进 8 槽：α = 6/8 = 75% > 0.5，触发再散列 */
    int cur_m = 8;
    int table[1024];                            /* 足够大，容纳翻倍后的表 */
    for (int i = 0; i < cur_m; i++) table[i] = NIL_KEY;
    int n = 0;
    for (int k = 1; k <= 6; k++) {              /* 插 6 个 key 进 8 槽 */
        int q = div_hash(k * 13, cur_m);
        while (table[q] != NIL_KEY) q = (q + 1) % cur_m;
        table[q] = k * 13;
        n++;
    }
    int alpha_before = n * 100 / cur_m;         /* 6/8 = 75% */
    assert(alpha_before > 50);
    /* 再散列：把表长翻倍到 16，所有 key 按新 m 重散列 */
    int new_m = cur_m * 2;
    int new_table[1024];
    for (int i = 0; i < new_m; i++) new_table[i] = NIL_KEY;
    for (int i = 0; i < cur_m; i++) {
        if (table[i] != NIL_KEY) {
            int q = div_hash(table[i], new_m);
            while (new_table[q] != NIL_KEY) q = (q + 1) % new_m;
            new_table[q] = table[i];
        }
    }
    int alpha_after = n * 100 / new_m;          /* 6/16 = 37% */
    assert(alpha_after < alpha_before);
    /* 重散列后所有 key 仍可查到 */
    for (int k = 1; k <= 6; k++) {
        int q = div_hash(k * 13, new_m);
        while (new_table[q] != NIL_KEY && new_table[q] != k * 13) q = (q + 1) % new_m;
        assert(new_table[q] == k * 13);
    }
    printf("part 5: 负载因子 α = %d%% 触发再散列：m 8→16，α 降到 %d%%（全部 key 仍可查到）\n",
           alpha_before, alpha_after);
}

/* ---------- 6. wee 散列函数（11.5.2）：只用加法/乘法/半字交换 ---------- */
static uint64_t wee_f(uint64_t k, uint64_t a) {
    uint64_t v = 2 * k * k + a * k;             /* mod 2^w 自然溢出 */
    return (v >> 32) | (v << 32);               /* swap：交换高低 32 位 */
}

static uint64_t wee_f_iter(uint64_t k, uint64_t a, int r) {
    uint64_t v = k;
    for (int i = 0; i < r; i++) v = wee_f(v, a);
    return v;
}

/* 短输入 wee：h(k) = f_a^{(r + 2^t)}(k + b) mod m（t 为输入比特长） */
static int wee_hash(uint64_t k, uint64_t a, uint64_t b, int t, int r, int m) {
    int rounds = r + (1 << t);                  /* 2^t 轮：让不同长度输入行为不同 */
    uint64_t v = wee_f_iter(k + b, a, rounds);
    return (int)(v % (uint64_t)m);
}

static void part6_wee(void) {
    const uint64_t a = 123, b = 7;             /* 实验中 a = 123, w = 64 */
    int h1 = wee_hash(5, a, b, 8, 4, 1000);     /* 输入长度 t = 8 */
    int h2 = wee_hash(5, a, b, 8, 4, 1000);     /* 同参 → 必相同（确定性） */
    int h3 = wee_hash(5, a, b, 16, 4, 1000);    /* 输入长度 t = 16 → 不同函数 */
    assert(h1 == h2);                            /* 确定性 */
    assert(h1 != h3);                            /* 不同长度 → 不同散列值（2^t 项生效） */
    /* 再散一列 key，确认没有明显退化成同槽 */
    int cnt[16] = {0};
    for (int k = 0; k < 64; k++) cnt[wee_hash((uint64_t)k, a, b, 8, 4, 16)]++;
    int wmax = 0;
    for (int i = 0; i < 16; i++) wmax = cnt[i] > wmax ? cnt[i] : wmax;
    assert(wmax < 64);
    printf("part 6: wee 散列（a=123,b=7）：k=5,t=8→%d；k=5,t=16→%d（长度不同→值不同）；分布最长链=%d\n",
           h1, h3, wmax);
}

int main(void) {
    part1_power_of_two();
    part2_universal();
    part3_linear_probe_delete();
    part4_free_list();
    part5_rehash();
    part6_wee();
    puts("all checks passed.");
    return 0;
}
`,
        notes: [
          { line: 15, zh: '`div_hash`：除法散列 $h(k) = k mod m$（负数做一次修正）。11.3 的第一种散列函数。' },
          { line: 26, zh: '★ part 1：8 个都是 16 的倍数的 key，取模 $m=16=2^4$ 全部落在槽 0；换成素数 $m=17$ 每槽至多 1 个——这就是"避开 2 的幂"的实锤。' },
          { line: 59, zh: 'part 2：全域散列 $h_{a,b}(k) = ((a k + b) mod p) mod m$（随机选 $a,b$ 逼近独立均匀散列）。' },
          { line: 109, zh: '★ `oa_delete`：搬回法删除的完整实现（对应 LINEAR-PROBING-HASH-DELETE）。`oa_g` 就是逆函数 $g$。' },
          { line: 118, zh: '★ 第 10 行 `T[q] = kp`：把候选 key 搬回空出的 $q$；再 `T[qp] = NIL_KEY` 腾空源槽。' },
          { line: 127, zh: '★ part 3：复现 Figure 11.6——删除 43 后断言 T[3]==93、T[5]==92（探测序列已修复）。' },
          { line: 163, zh: 'part 4：自由表——所有空闲槽串成一条链，分配/释放都只改一个指针，O(1)。' },
          { line: 179, zh: 'part 5：负载因子 $\\alpha = 75\\%$ 触发再散列，$m$ 翻倍到 16、$\\alpha$ 降到 $37\\%$，全部 key 仍可查到。' },
          { line: 229, zh: '★ `wee_hash`：短输入 wee $h = f_a^{(r+2^t)}(k+b) mod m$；$f_a$ 只含加法/乘法/半字交换，全在寄存器里。' },
          { line: 235, zh: 'part 6：验证 wee 的确定性（同参同值）与"不同长度输入 → 不同散列值"（2^t 项生效）。' },
        ],
        tests: [
          { in: '8 个 16 的倍数，m=16 vs m=17', out: 'm=16 全落槽 0；m=17 每槽至多 1 个' },
          { in: 'Figure 11.6：插入 7 个 key 后删除 43', out: 'T[3]=93、T[5]=92，探测序列修复' },
          { in: 'α = 75% 触发再散列', out: 'm 8→16，α 降到 37%，key 全部可查' },
          { in: 'wee：k=5, t=8 vs t=16', out: '812 vs 859（长度不同 → 值不同）' },
        ],
      },
      mapping: [
        { pc: 2, pcCode: 'T[q] = NIL', c: '`oa_delete` 第 110 行：`T[q] = NIL_KEY;`（清空目标槽）' },
        { pc: 5, pcCode: 'q′ = (q′ + 1) mod m', c: '`oa_delete` 第 113 行：`qp = (qp + 1) % OA_M;`' },
        { pc: 6, pcCode: 'k′ = T[q′]', c: '`oa_delete` 第 114 行：`int kp = T[qp];`' },
        { pc: 9, pcCode: 'until g(k′,q) < g(k′,q′)', c: '`oa_delete` 第 116 行：`if (oa_g(kp, q) < oa_g(kp, qp))`' },
        { pc: 10, pcCode: 'T[q] = k′', c: '`oa_delete` 第 118 行：`T[q] = kp;`（搬回）' },
        { pc: 11, pcCode: 'q = q′', c: '`oa_delete` 第 120 行：`q = qp;`（从新空槽继续）' },
        { pc: 5, pcCode: 'q = f_a^(r + 2^t)(k_i + q)', c: '`wee_hash` 第 229 行起：`wee_f_iter(k + b, a, r + (1 << t))`（逐字叠加上一轮散列）' },
      ] },

    /* ---------- 6 · 复杂度 ---------- */
    { type: 'analyze', title: '四条工程结论，各有出处',
      intro: '11.5 没有新记号，而是给前面的结论加上"真实机器"的修正。下面每条都标了原书页码。',
      claims: [
        { expr: 'O(1)', when: '层次内存模型下，线性探测的查找/插入/删除期望（连续探测常落在同一 cache block）', page: 302, source: 'book' },
        { expr: 'O(1)', when: 'Theorem 11.9：h1 是 5-independent 且 α ≤ 2/3 时，线性探测查找/插入/删除期望 O(1)', page: 304, source: 'book' },
        { expr: '1/(1 − α)', when: '开放寻址线性探测的期望探测次数随 α 上升（α → 1 时发散；11.4 Theorem 11.8）', page: 304, source: 'instructor', preview: true },
        { expr: '≈ 1/(1 − α)', when: '初级聚集让线性探测在 α 较大时比双散列更易退化（标准 RAM 模型下）', page: 303, source: 'book' },
        { expr: '2–10×', when: 'wee 求值比"探测一个随机槽"还快（实验：2019 MacBook Pro，w=64，a=123）', page: 305, source: 'book' },
      ],
      tables: [
        { caption: '同一套线性探测，两种模型两种结论',
          rows: [
            ['', '标准 RAM 模型', '层次内存模型'],
            ['初级聚集', '有害：平均查找变慢', '有益：连续槽常在同一 cache block'],
            ['散列函数', '越简单越好（散列本身要便宜）', '可以很复杂（5-independent），因求值在寄存器里'],
            ['何时选它', '通常不如双散列', 'cache 友好场景下反而最快'],
          ] },
        { caption: '11.5 的五个工程动作 vs 它们解决的问题',
          rows: [
            ['动作', '解决的问题'],
            ['避开 2 的幂（用素数 m）', '除法散列低位置信失效、冲突集中'],
            ['搬回法删除', '开放寻址删除不能置 DELETED 导致序列断裂'],
            ['再散列', 'α 增长使探测变长'],
            ['全域 / 随机化', '逼近"独立均匀散列"假设'],
            ['wee 散列', '在寄存器内得到 5-independent 级别的好函数'],
          ] },
      ],
      chart: {
        xMax: 9,
        series: [
          { name: '期望探测次数 ≈ 1/(1−α)（α = n/10，α→1 发散；11.4 Theorem 11.8, preview）', expr: '1/(1 - n/10)', color: '--viz-violation' },
        ],
      },
      derivations: [
        { title: '为什么搬回法能保住"可查找性"',
          steps: [
            { zh: '线性探测的探测序列是循环的：$h(k,i) = (h_1(k)+i) mod m$，所有 key 共用同一条序列（只是起点 $h_1(k)$ 不同）。' },
            { zh: '逆函数 $g(k,q) = (q - h_1(k)) mod m$ 给出"槽 $q$ 是 $k$ 的第几个探测槽"。若 $g(k,q) < g(k,q\\prime)$，则插入 $k$ 时先看到 $q$、后看到 $q\\prime$。' },
            { tex: 'g(k′,q) < g(k′,q′) \\;\\Rightarrow\\; \\text{删空 } q \\text{ 后，查找 } k′ \\text{ 会在 } q \\text{ 处提前停下}',
              zh: '所以一旦 $q$ 被删空，若不把 $k\\prime$ 搬回 $q$，一次查找 $k\\prime$ 就会在 $q$ 处停下、错过真正在 $q\\prime$ 的它——搬回正是堵上这个洞。' },
          ] },
      ],
      note: '★ 中心图：期望探测次数随 $\\alpha$ 上升而发散（虚线附近）。Theorem 11.9 的 $\\alpha \\le 2/3$ 就是给这条曲线画的一条"安全线"——线上方仍近似 $O(1)$。' },

    /* ---------- 7 · 正确性 ---------- */
    { type: 'prove', title: '逆函数 g 是 h 的左逆：搬回法的依据',
      statement: 'If h(k,i) = q, then g(k,q) = i , and so h(k,g(k,q)) = q.',
      page: 302,
      intro: '★ 搬回法成立的前提，是线性探测的探测序列 $h(k,i)$ 有逆函数 $g(k,q)$。下面三步走完这个"逆"的关系。',
      steps: [
        { title: '第一步 · h 的探测序列',
          en: 'The deletion procedure relies on an "inverse" function to the linear-probing hash function h(k,i) = (h 1 (k) + i) mod m, which maps a key k and a probe number i to a slot number in the hash table. The inverse function g maps a key k and a slot number q, where 0 ≤ q<m , to the probe number that reaches slot q: g(k,q) = (q − h 1 (k)) mod m:',
          page: 302,
          body: [
            '线性探测的第 $i$ 次探测槽是 $h(k,i) = (h_1(k) + i) mod m$。',
            '逆函数定义：$g(k,q) = (q - h_1(k)) mod m$，它回答"槽 $q$ 是 $k$ 的第几个探测槽"。',
            '★ 因为步长恒为 1、模 $m$ 循环，这条序列对固定的 $k$ 是"从 $h_1(k)$ 出发每次 +1"的循环——这是搬回法能成立的根本原因（一般开放寻址没有这条性质）。',
          ] },
        { title: '第二步 · 何时必须搬回',
          en: 'Line 9 asks the critical question: does the key k 0 in slot q 0 need to be moved to the vacated slot q in order to preserve the accessibility of k 0 ? If g(k 0 ,q) <g(k 0 ,q 0 ), then during the insertion of k 0 into the table, slot q was examined but found to be already occupied. But now slot q, where a search will look for k 0 , is empty. In this case, key k 0 moves to slot q in line 10, and the (a)',
          page: 302,
          body: [
            '判断式 $g(k\\prime,q) < g(k\\prime,q\\prime)$ 是搬回的充要条件。',
            '若成立：插入 $k\\prime$ 时先探测到 $q$、发现满，才继续到 $q\\prime$。现在 $q$ 空了，一次查找 $k\\prime$ 会在 $q$ 处停下——所以必须把 $k\\prime$ 搬回 $q$。',
            '若不成立：$k\\prime$ 本来就在 $q\\prime$ 之后才被探测到，删空 $q$ 不影响它在 $q\\prime$ 的可查找性，无需搬动。',
          ] },
        { title: '第三步 · 循环结束时序列已修复',
          en: 'The procedure LINEAR-PROBING-HASH-DELETE on the facing page deletes the key stored in position q from hash table T . Figure 11.6 shows how it works.',
          page: 302,
          body: [
            '删除从置空 $q$ 开始；之后沿探测序列向后扫描，凡满足 $g(k\\prime,q) < g(k\\prime,q\\prime)$ 的 $k\\prime$ 都搬回 $q$，再从新腾出的槽继续。',
            '遇到 $T[q\\prime] = \\text{NIL}$（空槽）就停止：空槽之后的 key 本来就不会经过 $q$，无需再动。',
            '★ 结论：每个剩余 key 的探测序列都不再被这次删除"截断"——可查找性保持不变（Figure 11.6(b) 的 93、92 上移即其实例）。',
          ] },
      ],
      conclusion: '★ 结论：因为线性探测的 $h$ 有逆 $g$，删除时可以精确判断"哪些后续 key 会被新空槽截断"，把它们逐个搬回即可，无需 DELETED 墓碑。这正是它相对一般开放寻址的独特优势。' },

    /* ---------- 8 · 闯关测验 ---------- */
    { type: 'drill', title: '检验一下',
      items: [
        { kind: 'single', q: '为什么开放寻址（线性探测）的删除"不能直接把槽置 NIL 就完事"？',
          options: ['因为槽太小', '因为会截断后续 key 的探测序列，使它们再也查不到', '因为要释放内存', '因为 NIL 是保留字'], answer: 1,
          why: '★ 开放寻址的查找沿探测序列走；直接置 NIL 会让序列在空槽处断开，原本排在后面的 key 永远查不到。所以要用"搬回法"把该搬的 key 往前挪。' },
        { kind: 'single', q: '搬回法的判断式 $g(k′,q) < g(k′,q′)$ 中，$g(k,q)$ 是什么？',
          options: ['key k 的散列值', '槽 q 是 key k 的第几个探测槽', '表长 m', '负载因子'], answer: 1,
          why: '★ $g(k,q) = (q - h_1(k)) mod m$ 是 $h(k,i) = (h_1(k)+i)mod m$ 的逆：$g(k,q) < g(k,q\\prime)$ 表示插入时先探测到 $q$、后到 $q\\prime$。' },
        { kind: 'judge', q: '线性探测在标准 RAM 模型里通常不如双散列，但在层次内存模型里表现出色。', answer: true,
          why: '★ 原书 p.302：连续探测常落在同一个 cache block，一次主存访问比一次寄存器运算慢得多——所以"探测序列短、地址连续"比"冲突绝对最少"更划算。' },
        { kind: 'single', q: 'Theorem 11.9 给线性探测保 O(1) 期望，需要哪两个条件？',
          options: ['α ≤ 1 且链接法', 'h1 是 5-independent 且 α ≤ 2/3', 'm 是 2 的幂', '用双散列'], answer: 1,
          why: '★ 原书 p.304：只要 $h_1$ 是 $5$-independent 且 $\\alpha \\le 2/3$，查找/插入/删除期望都是 $O(1)$。' },
        { kind: 'judge', q: '除法散列 $h(k) = k mod m$ 里，把 $m$ 选成 2 的幂是个坏主意。', answer: true,
          why: '★ 原书 11.3 的结论：$m$ 取 2 的幂时 $h(k)$ 只取决于 $k$ 的低若干位；若 key 低位雷同（如全是偶数），全部冲突。应选与 $2$ 互素的素数。' },
        { kind: 'simulate', q: '用面板①的初态（m=10, h1(k)=k mod 10, 插入 74,43,93,18,82,38,92），删除 43 后，槽 3 与槽 5 里分别是哪两个 key？（按"槽3, 槽5"填写，逗号分隔）',
          expect: [93, 92], placeholder: '例如：12, 34',
          why: '★ 搬回法：93 上移到槽 3、92 上移到槽 5（与 Figure 11.6(b) 一致）。' },
      ],
      bookExercises: [
        { id: '11-1', page: 308, star: 0,
          statement: 'Longest-probe bound for hashing Suppose you are using an open-addressed hash table of size m to store n ≤ m/2 items. a. Assuming independent uniform permutation hashing, show that for i = 1,2,…,n , the probability is at most 2 −p that the i th insertion requires strictly more than p probes. b. Show that for i = 1,2,…,n , the probability is O(1/n 2 ) that the i th insertion requires more than 2 lg n probes. Let the random variable X i denote the number of probes required by the i th inser- tion. You have shown in part (b) that Pr fX i >2 lg ng = O(1/n 2 ). Let the random variable X = max fX i W 1 ≤ i ≤ ng denote the maximum number of probes re- quired by any of the n insertions. c. Show that Pr fX >2 lg ng = O(1/n). d. Show that the expected length E [X ] of the longest probe sequence is O(lg n).',
          hint: '书上是半截题干 + 四小问：用独立均匀排列散列，先证第 i 次插入超过 p 次探测的概率 ≤ 2^(−p)，再证超过 2 lg n 次的概率 O(1/n²)，最后用并集界得最长探测序列期望 O(lg n)。这是 Theorem 11.9 之外对开放寻址"最坏也不太坏"的另一层保证。' },
        { id: '11-2', page: 308, star: 0,
          statement: 'Searching a static set You are asked to implement a searchable set of n elements in which the keys are numbers. The set is static (no INSERT or DELETE operations), and the only opera- tion required is SEARCH . You are given an arbitrary amount of time to preprocess the n elements so that SEARCH operations run quickly. a. Show how to implement SEARCH in O(lg n) worst-case time using no extra storage beyond what is needed to store the elements of the set themselves. b. Consider implementing the set by open-address hashing on m slots, and assume independent uniform permutation hashing. What is the minimum amount of ex- tra storage m − n required to make the average performance of an unsuccessful SEARCH operation be at least as good as the bound in part (a)? Your answer should be an asymptotic bound on m − n in terms of n.',
          hint: '前半问用"完美散列 / 排序数组二分"；后半问是开放寻址下"留多少空槽"的权衡，答案约 m − n = Θ(lg n) 量级才能使平均探测 ≈ O(lg n)。' },
        { id: '11-3', page: 308, star: 0,
          statement: 'Slot-size bound for chaining Given a hash table with n slots, with collisions resolved by chaining, suppose that n keys are inserted into the table. Each key is equal ly likely to be hashed to each slot. Let M be the maximum number of keys in any slot after all the keys have',
          hint: '用二项分布 + Stirling 近似：单槽恰有 k 个 key 的概率 Q_k ≈ e^(−α) α^k / k!；最大槽长 > c lg n / lg lg n 的概率 ≤ 1/n²，故期望 O(lg n / lg lg n)。这是链接法"最坏也不太坏"的保证。' },
        { id: '11-4', page: 309, star: 0,
          statement: 'Hashing and authentication Let H be a family of hash functions in which each hash function h 2 H maps the universe U of keys to f0,1,…,m − 1g. a. Show that if the family H of hash functions is 2-independent, then it is univer- sal. b. Suppose that the universe U is the set of n-tuples of values drawn from Z √D f 0,1,…,p − 1g, where p is prime. Consider an element x = ⟨x 0 ,x 1 ,…,x n−1⟩ 2 U . For any n-tuple a = ⟨a 0 ,a 1 ,…,a n−1⟩ 2 U , de- fine the hash function h a by h a (x) = • n−1 X j D0 a |x| ! mod p: Let H = fh a W a 2 U g. Show that H is universal, but not 2-independent. (Hint: Find a key for which all hash functions in H produce the same value.)',
          hint: '第一问找"所有函数对某个 key 给出同一值"的族；第二问加一个线性项 $h_{ab}(x) = (a x + b) mod p$ 即得 2-independent；第三问：敌手替换 (m,t) 成功概率 ≤ 1/p，与算力无关（这是"通用散列族做认证"的经典结论）。' },
      ] },
  ],
};
