/* 第 11 章 11.3：散列函数（Hash functions）。
 * 原文锚点：印刷页 282–292（pdf_index 303–313）。
 * 引述已用 tools/07_pick_quotes.py pick 逐条预检（45+ PASS）。
 * 主题：好的 h ≈ 独立均匀；除法散列、乘法散列、以及**随机散列**（全域族）。
 */

/* 静态帧：同一组 key（全是 4 的倍数）在两种 h 下的落槽情况（m = 16 便于阅读） */
const KEYS = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];

const slotsOf = (m, hash) => {
  const map = new Map();
  for (const k of KEYS) {
    const q = hash(k, m);
    if (!map.has(q)) { map.set(q, []); }
    map.get(q).push(k);
  }
  return Array.from({ length: m }, (_, i) => ({
    i, chain: (map.get(i) || []).map((k) => ({ key: k })),
  }));
};

/* 除法散列：k mod m */
const DIV = slotsOf(16, (k, m) => k % m);
/* 乘法散列（教材版）：⌊m · frac(k·A)⌋，A ≈ 0.618… */
const A = 0.6180339887;
const MUL = slotsOf(16, (k, m) => Math.floor(m * ((k * A) % 1)));

export default {
  key:'s03',id:'ch11/s03',chapter:11,section:'11.3',
  title:'散列函数：从"挑一个"到"随机挑一个"',shortTitle:'11.3 散列函数',
  titleEn:'Hash functions',
  source:{printed:[282,292],pdf:[303,313]},
  prerequisites:[{label:'11.2 Hash tables',url:'#/ch11/s02'}],
  stages:[
   {type:'map',title:'好的散列函数长什么样：近似独立均匀',
    why:'11.2 把性能归结为一个数 $\\alpha = n/m$，但那是在"独立均匀散列"的假设下。本关要回答：**这个假设在现实中怎么实现**？答案是三步：① 两个经验方法（除法散列、乘法散列）；② 认识到**任何固定的 $h$ 都能被恶意输入打垮**；③ 用**随机散列**（全域函数族）把冲突概率压到 $1/m$。',
    position:'11.2 假设了 $h$ 是好的；本关负责**把 $h$ 造出来并证明它够好**。11.4 会看到：当不建链时，$h$ 的质量要求更高（要"近似独立均匀"，而不只是"全域"）。11.5 讲工程落地（$m$ 怎么选、再散列、删除的坑）。',
    unlocks:[{label:'11.4 Open addressing（开放寻址）',url:'#/ch11/s04'}],
    mathKit:[
     {title:'两个经验方法',body:'除法散列 $h(k) = k mod m$（$m$ 取素数、避开 2 的幂）；乘法散列 $h(k) = \\lfloor m(kA mod 1)\\rfloor$（$A \\approx 0.618$）。'},
     {title:'为什么避开 2 的幂',body:'$m = 2^p$ 时 $k mod m$ 只取 $k$ 的**低 $p$ 位**；若 key 的低位有规律（全是 4 的倍数、或低位是同一段），冲突会集中。'},
     {title:'全域族',body:'$H$ 是全域的：任取两个不同 key，$\\Pr\\{h(k_1) = h(k_2)\\} \\le 1/m$（概率取自 $h$ 的随机选择）。'},
     {title:'一个具体的全域族',body:'$h_{ab}(k) = ((ak + b) mod p) mod m$，$p$ 是大于所有 key 的素数，$a \\in [1, p-1]$、$b \\in [0, p-1]$。'},
    ]},
   {type:'intuition',title:'分拣规则一旦公开，就会被针对',
    scene:'考试座位按"学号 mod 座位数"排 —— 学号全是偶数就糟了',
    body:[
     '散列函数就是一种**分拣规则**。规则本身没有"对错"，只有"对这批数据是否撒得匀"。',
     '★ 经验方法（除法/乘法）在随机数据上表现不错，但它们有一个致命弱点：规则是固定的、公开的。对手只要知道你的 $h$，就能构造一批全部冲突的 key —— C 程序 part 4 用 `h(k) = k mod 100` 和"全是 100 的倍数"的 key 把 50 个元素全塞进一个槽。',
     '★ 原书因此把话题从"挑一个好函数"转成"随机挑一个函数"（random hashing）：从一族 $H$ 里当场随机选一个 $h$，对手无法预知你选了哪个。',
     '★ 全域（universal）就是这种族的最低标准：任意两个不同 key 冲突的概率 ≤ $1/m$。注意概率取自"函数的选择"，不是取自"key 的分布" —— 这就是它比"假设输入随机"更强的地方：它对任意输入都成立。',
    ],
    interactive:{text:'阶段 5 的面板：同一组 key（全是 4 的倍数）在 m = 16 的除法散列下只落 4 个槽；换成乘法散列就铺开了。'}},
   {type:'source',title:'书上是怎么说的',
    lead:'下面每条都是原书英文原文（衬线体，含原书对 h(k)、α 与 ⌊m(kA mod 1)⌋ 的排版形式）。',
    blocks:[
     {kind:'body',page:283,en:'A good hash function satisfies (approximately) the assumption of independent uniform hashing: each key is equally likely to hash to any of the m slots, independently of where any other keys have hashed to. What does "equally likely" mean here? If the hash function is fixed, any probabilities would h',
      zh:'★★ **"好的散列函数"的定义**：近似满足独立均匀散列 —— 每个 key 等可能落入任一槽，且与别的 key 落哪无关。★ 紧接着的自问自答点出关键：**若 $h$ 固定，"概率"从何谈起？** 只能来自 key 的分布 —— 而那是不可靠的。'},
     {kind:'body',page:283,en:'Unfortunately, you typically have no way to check this condition, unless you happen to know the probability distribution from which the keys are drawn. Moreover, the keys might not be drawn independently.',
      zh:'★★ 固定 $h$ 路线的死穴：你**没法验证**这个条件（除非恰好知道 key 的分布），而且 key 之间可能不独立。'},
     {kind:'body',page:283,en:'In practice, a hash function is designed to handle keys that are one of the following two types:',
      zh:'★ 实践里的两类 key：**短非负整数**（装得进 $w$ 位机器字）与**短向量**（如字符串 —— 每个字符是一个分量）。本关先处理第一类。'},
     {kind:'body',page:284,en:'The division method for creating hash functions maps a key k into one of m slots by taking the remainder of k divided by m. That is, the hash function is h(k) = k mod m:',
      zh:'★★ **除法散列**：$h(k) = k mod m$。最简单、最常用 —— C 程序 part 1 与 11.2 的生成器都用它。'},
     {kind:'body',page:284,en:'The division method may work well when m is a prime not too close to an exact power of 2. There is no guarantee that this method provides good average-case performance, however, and it may complicate applications since it constrains the size of the hash tables to be prime.',
      zh:'★★ 两条实用建议：**$m$ 取"不太接近 2 的幂"的素数**；但原书同时说明它**没有性能保证**，且"表长必须是素数"会带来工程不便（这正是乘法散列的卖点之一）。'},
     {kind:'body',page:285,en:'Figure 11.4 The multiply-shift method to compute a hash function. The w-bit representation of the key k is multiplied by the w-bit value a = A • 2 w . The ` highest-order bits of the lower w-bit half of the product form the desired hash value h a (k).',
      zh:'★★ **乘法散列的实现（multiply-shift）**：把 $k$ 与 $w$ 位的 $a = A \\cdot 2^w$ 相乘得到 $2w$ 位乘积，取**低 $w$ 位的高 $\\ell$ 位**作为散列值 —— 只用一次乘法 + 一次移位。'},
     {kind:'body',page:285,en:'As an example, suppose that k = 123456, ` = 14, m = 2 14 = 16384, and w = 32. Suppose further that we choose a = 2654435769 (following a suggestion of Knuth [261]). Then ka = 327706022297664 = .76300 • 2 32 / C 17612864, and so r 1 = 76300 and r 0 = 17612864.',
      zh:'★★ 原书的具体例子（C 程序 part 2 **逐位复算过**）：$k = 123456$、$a = 2654435769$（Knuth 建议值 $= \\lceil (\\sqrt 5 - 1)/2 \\cdot 2^{32} \\rceil$）→ $ka = 76300 \\cdot 2^{32} + 17612864$，于是 $h = 67$。'},
     {kind:'body',page:286,en:'Even though the multiply-shift method is fast, it doesn’t provide any guarantee of good',zh:'★ 乘法散列很快，但同样没有保证 —— 引出下面的随机散列。'},
     {kind:'body',page:286,en:'Suppose that a malicious adversary chooses the keys to be hashed by some fixed hash func',
      zh:'★★ **恶意对手**：如果对手知道你的（固定）散列函数，就能专门挑冲突的 key。这是"随机散列"的直接动机。'},
     {kind:'body',page:286,en:'Let H be a finite family of hash functions that map a given universe U of keys into the range f0,1,…,m − 1g. Such a family is said to be universal if for each pair of distinct keys k 1 ,k 2 2 U , the number of hash functions h 2 H for which h(k 1 ) = h(k 2 ) is at most |H| =m.',
      zh:'★★ **全域族（universal family）的定义**：任意两个不同 key，使它们冲突的 $h$ **不超过 $|H|/m$ 个** —— 等价于"随机选 $h$，冲突概率 ≤ $1/m$"。'},
     {kind:'body',page:287,en:'• The family H is universal if for any distinct keys k 1 and k 2 in U , the probability that h(k 1 ) = h(k 2 ) is at most 1/m.',
      zh:'★★ 用概率重述的同一条定义（**这是最常用的判据**）：$\\Pr\\{h(k_1) = h(k_2)\\} \\le 1/m$，概率取自 $h$ 的随机选择。'},
     {kind:'body',page:287,en:'• The family H is d -independent if for any distinct keys k 1 , k 2 , . . . , k d in U and any slots q 1 , q 2 , . . . , q d , not necessarily distinct, in f0,1,…,m − 1g the probability that h(k i ) = q i for i = 1,2,…,d is 1/m d .',
      zh:'★★ 更强的 **$d$-独立**：任意 $d$ 个 key 的散列值**同时**取指定槽的概率是 $1/m^d$（近似真正的独立均匀）。11.4 的开放寻址需要比"全域"更强的性质。'},
     {kind:'body',page:287,en:'Using universal hashing and collision resolution by chaining in an initially empty table with m slots, it takes Θ(s) expected time to handle any sequence of s INSERT , SEARCH , and DELETE operations containing n = O(m) INSERT operations.',
      zh:'★★ **Theorem 11.3**：用全域散列 + 链接法，任意 $s$ 个操作的序列期望 $\\Theta(s)$（其中插入 $n = O(m)$ 次）。★ 注意"**任意序列**" —— 包括对手选的序列，因为随机性在 $h$ 上。'},
     {kind:'body',page:288,en:'This section present two ways to design a universal (or Ω -universal) family of hash functions: one based on number theory and another based on a randomized variant of the multiply-shift method presented in Section 11.3.1.',
      zh:'★ 两条构造路线：数论（$h_{ab}$，下面的证明）与随机化的 multiply-shift。'},
     {kind:'body',page:288,en:'We can design a universal family of hash functions using a little number theory.',
      zh:'★ 数论路线的开场 —— 用到第 31 章的模运算基础。'},
     {kind:'body',page:288,en:'Begin by choosing a prime number p large enough so that every possible key k lies in the',
      zh:'★ 构造的第一步：取素数 $p \\ge$ 所有可能的 key，于是 key 都在 $\\mathbb{Z}_p$ 里。'},
     {kind:'body',page:289,en:'Therefore, for any pair of distinct values k 1 ,k 2 2 Z p , Pr fh ab (k 1 ) = h ab (k 2 )g ≤ 1/m; so that H pm is indeed universal.',
      zh:'★★ 证明的收尾：$\\Pr\\{h_{ab}(k_1) = h_{ab}(k_2)\\} \\le 1/m$ → 族 $H_{pm}$ **确实是全域的**。'},
    ],
    terms:[
     {en:'division method',zh:'除法散列（k mod m）',page:284},
     {en:'universal',zh:'全域的（冲突概率 ≤ 1/m）',page:287},
    ]},
   {type:'pseudocode',title:'本关研究的对象：11.2 那三段里的 h(k)',
    lead:'★ 11.3 本身没有新算法 —— 它研究的是 11.2 三段伪代码里那个 $h$。把它放在这里，是为了明确"这一关改的是哪一行"。',
    algo:'CHAINED-HASH-SEARCH',signature:'CHAINED-HASH-SEARCH(T, k)',page:278,
    lines:[
     {n:1,code:'return LIST-SEARCH(T[h(k)], k)',zh:'★ 唯一与 $h$ 有关的地方：**$h(k)$**。本关的全部内容就是"这个 $h$ 怎么造"。'},
     {n:2,code:'    // 11.3 的问题：h 怎么选？',zh:'注：这行不是原书伪代码，是本站的旁注 —— 指明本关的位置。'},
    ],
    vars:[
     {name:'h',meaning:'散列函数：$U \\to \\{0, 1, \\dots, m-1\\}$。本关给它三种造法'},
    ],
    note:'★ 为什么不能随便选？因为 11.2 的两个定理都建立在"独立均匀散列"上 —— 本关要说明这个假设能近似实现，并且能对抗恶意输入。',
    more:[
     {algo:'CHAINED-HASH-INSERT',subtitle:'CHAINED-HASH-INSERT(T, x) —— 同样只有一处 h（原书 p.278）',
      signature:'CHAINED-HASH-INSERT(T, x)',page:278,
      lines:[
       {n:1,code:'LIST-PREPEND(T[h(x.key)], x)',zh:'插入也只用一次 $h$ —— 所以"换个 $h$"是**局部改动**，链式结构本身不用动。这就是把散列函数独立成一节的意义。'},
      ],
      vars:[{name:'x',meaning:'待插入元素'}],
      note:''},
    ]},
   {type:'visualize',title:'看见"低位规律"如何毁掉除法散列',
    panels:[
     {title:'① 除法散列 m = 16：key 全是 4 的倍数 → 只用了一半都不到的槽',
      viz:'hash-table',mode:'chained',
      trees:[{
        slots: DIV, m: 16, mode: 'chained', phase: 'h(k) = k mod 16',
        note: 'KEY = {4,8,…,48} 全是 4 的倍数 → 只落进 0/4/8/12 四个槽，每个槽挂 3 个。★ 表有 16 个槽，实际只用了 4 个。',
      }],
      treeNotes:[
        '★ 原因：$m = 2^4$ 时 $k mod 16$ 只取 $k$ 的低 4 位，而所有 key 的低 2 位都是 00 → 只剩 2 位可变 → 4 个槽。',
        '对照 11.3 的建议：$m$ 取素数、且离 2 的幂远一些 —— 那样 key 的每一位都会参与。',
      ]},
     {title:'② 乘法散列：同一组 key 被铺开',
      viz:'hash-table',mode:'chained',
      trees:[{
        slots: MUL, m: 16, mode: 'chained', phase: 'h(k) = ⌊16·frac(k·0.618)⌋',
        note: '同一组 key 用乘法散列 → 落槽分散得多。★ 乘法散列让高位参与散列（乘 $A$ 相当于把关键位往高位推）。',
      }],
      treeNotes:[
        '乘法散列：$h(k) = \\lfloor m \\cdot \\text{frac}(k A)\\rfloor$，$A \\approx 0.618$（黄金分割）。',
        '★ 真实实现是 multiply-shift（只一次乘法 + 移位，见 C 程序 part 2），本面板为了可读性用浮点版本。',
        '★ 但注意：它同样没有保证 —— 对手若能预知你用的 $A$，还是能构造冲突。所以才有"随机散列"。',
      ]},
    ],
    tasks:[
     '面板 ① 数一数实际用到的槽：16 个槽里只有 4 个非空（其余都是 NIL）—— 这就是"$m$ 取 2 的幂 + key 低位有规律"的典型退化。',
     '面板 ② 看同一组 key 的分散度：乘法散列把 12 个 key 铺到 11 个不同槽（仅 36 与 44 撞在槽 3）。',
     '想一想：如果对手知道你在用乘法散列、也知道 $A$ 的值，他能不能构造出全部冲突的 key？',
    ],
    note:'★ 两个面板是静态对照帧（同一组 key、两种 $h$）；C 程序 part 1/2 给出更大规模下的实测数字。'},
   {type:'code',title:'实测：m 的选取、multiply-shift 复算、全域族的冲突率',
    intro:'`c/hash_functions.c` 做三件事：① 对照 2 的幂与素数的链长；② **逐位复算原书 p.285 的乘法散列例子**；③ 实测全域族的冲突概率是否 ≤ 1/m。',
    pseudocodeRef:'CHAINED-HASH-SEARCH',
    c:{file:'hash_functions.c',code:String.raw`/* hash_functions.c -- 11.3 节：散列函数的三件事实测。
 *   ① 除法散列 h(k) = k mod m：m 取 2 的幂很糟（与素数对照，用低位有规律的 key）；
 *   ② 乘法散列（multiply-shift）：复算原书 p.285 的例子（k = 123456, ℓ = 14, w = 32）；
 *   ③ 全域散列：h_ab(k) = ((ak + b) mod p) mod m —— 实测冲突概率 ≤ 1/m（Theorem 11.3 的前提）。
 * 编译：gcc -std=c99 -Wall -Wextra -Werror -o hash_functions hash_functions.c
 */
#include <assert.h>
#include <stdint.h>
#include <stdio.h>

/* ---- 一个小而够用的伪随机（xorshift32 + 种子混合） ---- */
static uint32_t g_state;
static void rnd_seed(uint32_t s)
{
    g_state = s * 2654435761u + 0x9e3779b9u;   /* 先做一次乘法混合，避免连续种子相关 */
    if (g_state == 0) { g_state = 0x1234567u; }
}
static uint32_t rnd_next(void)
{
    uint32_t s = g_state;
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    g_state = s;
    return s;
}

/* ---- ① 除法散列：统计链长分布，给出最长链 ---- */
static int max_chain_mod(int *keys, int n, int m)
{
    int buf[4096];
    for (int i = 0; i < m && i < 4096; i++) { buf[i] = 0; }
    int *cnt = buf;
    for (int i = 0; i < n; i++) { cnt[keys[i] % m]++; }
    int mx = 0;
    for (int i = 0; i < m && i < 4096; i++) { if (cnt[i] > mx) { mx = cnt[i]; } }
    return mx;
}

/* ---- ② 乘法散列（multiply-shift）：取低 w 位乘积的高 ℓ 位 ---- */
static uint32_t multiply_shift(uint32_t k, uint32_t a, int w, int l)
{
    uint64_t p = (uint64_t)k * (uint64_t)a;     /* 2w 位乘积：r1 是高 w 位、r0 是低 w 位 */
    uint32_t r1 = (uint32_t)(p >> w);
    uint32_t r0 = (uint32_t)(p & 0xffffffffu);
    (void)r1;
    return r0 >> (w - l);                       /* r0 的最高 l 位 */
}

/* ---- ③ 全域散列 h_ab(k) = ((ak + b) mod p) mod m ---- */
static int universal_hash(int k, int a, int b, int p, int m)
{
    long long ak = (long long)a * k + b;
    int r = (int)(ak % p);
    return r % m;
}

int main(void)
{
    /* ① 除法散列：m 取 2 的幂 vs 素数，key 都带"低位规律"（例如全是 4 的倍数） */
    {
        enum { N = 400 };
        int keys[N];
        rnd_seed(7);
        for (int i = 0; i < N; i++) { keys[i] = (int)(rnd_next() % 1000) * 4; }   /* 全是 4 的倍数 */

        int m_pow2 = 256;                    /* 2 的幂 */
        int m_prime = 251;                   /* 附近的素数 */
        int mx_pow2 = max_chain_mod(keys, N, m_pow2);
        int mx_prime = max_chain_mod(keys, N, m_prime);
        printf("part 1: %d 个 key（全是 4 的倍数）→ 最长链：m = 2^8 = %d 时 %d，m = %d（素数）时 %d\n",
               N, m_pow2, mx_pow2, m_prime, mx_prime);
        printf("        ★ 全是 4 的倍数时，k mod 256 只能落在 64 个槽（4 的倍数槽）—— 2 的幂把 m 的因子"
               "和 key 的规律「共振」了；素数 m 没有这种结构\n");
        assert(mx_pow2 > mx_prime);          /* 2 的幂明显更差 */
    }

    /* ② 乘法散列：复算原书 p.285 的例子 */
    {
        uint32_t k = 123456;
        uint32_t a = 2654435769u;            /* Knuth 建议值 = ⌈(√5−1)/2 · 2^32⌉ */
        int w = 32, l = 14;
        uint64_t p = (uint64_t)k * (uint64_t)a;
        uint32_t r1 = (uint32_t)(p >> 32);
        uint32_t r0 = (uint32_t)(p & 0xffffffffu);
        uint32_t h = multiply_shift(k, a, w, l);
        printf("part 2: 乘法散列复算：k = %u, a = %u（w = 32）\n", k, a);
        printf("        k·a = %llu = %u·2^32 + %u（原书 p.285：76300·2^32 + 17612864）\n",
               (unsigned long long)p, r1, r0);
        assert(r1 == 76300u && r0 == 17612864u);
        printf("        r0 = %u 的最高 %d 位 → h = %u（m = 2^14 = 16384 时正好是一个槽号）\n", r0, l, h);
        assert(h < 16384u);
    }

    /* ③ 全域散列：实测冲突概率 ≤ 1/m */
    {
        int p = 10007;                       /* 素数 p > 所有 key */
        int m = 100;                         /* 槽数 */
        int k1 = 1234, k2 = 5678;            /* 两个不同的 key */
        int hits = 0, trials = 200000;
        for (int t = 0; t < trials; t++) {
            rnd_seed((uint32_t)(t + 1));
            int a = (int)(rnd_next() % (uint32_t)(p - 1)) + 1;   /* a ∈ [1, p−1] */
            int b = (int)(rnd_next() % (uint32_t)p);             /* b ∈ [0, p−1] */
            if (universal_hash(k1, a, b, p, m) == universal_hash(k2, a, b, p, m)) { hits++; }
        }
        double rate = (double)hits / trials;
        printf("part 3: 全域散列 h_ab(k) = ((ak + b) mod %d) mod %d：\n", p, m);
        printf("        %d 组随机 (a,b) 中 k1 = %d 与 k2 = %d 冲突 %d 次 → 实测概率 %.5f\n",
               trials, k1, k2, hits, rate);
        printf("        ★ 理论上界 1/m = %.5f（Theorem 11.3 的 universal 定义）\n", 1.0 / m);
        assert(rate <= 1.0 / m + 0.002);      /* 实测不超过 1/m（留一点抽样噪声） */
    }

    /* ④ 对照：固定散列函数（如 h(k) = k mod 100）在"恶意 key"下的退化 */
    {
        int m = 100;
        int keys[50];
        for (int i = 0; i < 50; i++) { keys[i] = i * m; }        /* 恶意：全是 m 的倍数 */
        int mx = max_chain_mod(keys, 50, m);
        printf("part 4: 固定散列 h(k) = k mod %d，恶意 key 全取成 %d 的倍数 → 最长链 %d（全部撞在一个槽）\n",
               m, m, mx);
        assert(mx == 50);
        printf("        ★ 这就是「随机散列」要解决的：没有一个固定函数能对抗恶意输入，"
               "随机化（全域族）才能把冲突概率压到 1/m\n");
    }

    puts("all checks passed.");
    return 0;
}
`,
       notes:[{line:27,zh:'`max_chain_mod`：给定 key 集合与 $m$，统计最大链长 —— 衡量"撒得匀不匀"的最直接指标。'},
              {line:39,zh:'★ `multiply_shift`：乘法散列的**真实实现**（一次 64 位乘法 + 一次右移）。'},
              {line:49,zh:'★ `universal_hash`：$h_{ab}(k) = ((ak + b) mod p) mod m$ —— 全域族的具体成员。'},
              {line:69,zh:'★ part 1：400 个"全是 4 的倍数"的 key → $m = 256$（2 的幂）最长链 **13**，$m = 251$（素数）最长链 **6** —— 证实"避开 2 的幂"。'},
              {line:85,zh:'★★ part 2：复算原书 p.285 的例子 —— $k = 123456$、$a = 2654435769$ → $ka = 76300 \\cdot 2^{32} + 17612864$（与书上**逐位一致**），$h = 67$。'},
              {line:106,zh:'★★ part 3：20 万组随机 $(a, b)$ 里 $k_1 = 1234$ 与 $k_2 = 5678$ 冲突 **1931** 次 → 实测概率 **0.00966** ≤ $1/m = 0.01$。这就是 universal 定义（Theorem 11.3）的实测。'},
              {line:119,zh:'★ part 4：固定散列 $h(k) = k mod 100$ 遇到"全是 100 的倍数"的恶意 key → 50 个元素全撞一个槽。**随机散列**正是为对抗这种输入而生。'}],
       tests:[{in:'400 个 4 的倍数，m = 256 vs 251',out:'最长链 13 vs 6（2 的幂更差）'},
              {in:'k = 123456, a = 2654435769, w = 32',out:'ka = 76300·2³² + 17612864（与原书一致），h = 67'},
              {in:'h_ab 族 20 万组随机参数',out:'实测冲突率 0.00966 ≤ 1/m = 0.01'},
              {in:'固定 h 遇恶意 key（全是 m 的倍数）',out:'50 个元素全部同槽'}]},
    mapping:[{pc:1,pcCode:'return LIST-SEARCH(T[h(k)], k)',c:'`ht_search` 里的 `q = ht_hash(T, k)`（11.2 的 `c/chained_hash.c` 第 35 行）—— 本关就是替换这一个函数'},
             {pc:1,pcCode:'（乘法散列实现）',c:'`multiply_shift`（第 39 行）—— 对应原书 Figure 11.4 的 multiply-shift'},
             {pc:1,pcCode:'（全域族）',c:'`universal_hash`（第 49 行）—— 对应原书 p.288–289 的 $H_{pm}$ 族'}]},
   {type:'analyze',title:'三本账：三种散列函数的能力与代价',
    intro:'把三种造法放在一起比：谁快、谁有保证、谁能对抗对手。',
    claims:[
     {expr:'h(k) = k mod m',when:'除法散列 —— $m$ 取远离 2 的幂的素数',page:284,source:'book'},
     {expr:'\\lfloor m(kA mod 1)\\rfloor',when:'乘法散列 —— 让高位参与',page:285,source:'book'},
     {expr:'2/m',when:'Theorem 11.5：奇数乘数的 multiply-shift 族是 2/m-universal（原书推荐的实用选择）',page:290,source:'book'},
     {expr:'\\Pr\\{h(k_1)=h(k_2)\\} \\le 1/m',when:'全域族的定义（概率取自 h 的随机选择）',page:287,source:'book'},
     {expr:'\\Theta(s)',when:'Theorem 11.3：全域散列 + 链接法下 s 个操作的期望总时间（n = O(m)）',page:287,source:'book'},
    ],
    tables:[{caption:'三种散列函数对照',rows:[
      ['','除法散列','乘法散列','全域散列（随机）'],
      ['计算量','一次取模','一次乘法 + 移位','一次乘法 + 两次取模'],
      ['对 $m$ 的限制','需避开 2 的幂（常取素数）','$m$ 可取 2 的幂（便于移位）','无（只要 $p$ 是够大的素数）'],
      ['平均性能','无保证（数据相关）','无保证','**有保证**（$\\le 1/m$）'],
      ['对抗恶意输入','不能','不能','**能**（对手不知 $h$）'],
      ['实战使用','极常见','常见（乘数散列）','Java/Redis 等用它防 HashDoS'],
     ]},
     {caption:'为什么"取模 2 的幂"会退化（part 1 的实测解释）',rows:[
      ['情形','$k mod 2^p$ 用到 $k$ 的哪些位','结果'],
      ['key 随机','低 $p$ 位（随机）','尚可'],
      ['key 低位有规律（如全是 4 的倍数）','低 2 位恒为 0 → 实际只有 $p-2$ 位可变','**可用槽数降到 $m/4$**'],
      ['key 是 $m$ 的倍数','低 $p$ 位恒为 0','**全部撞在槽 0**'],
     ]}],
    chart:{xMax:64,series:[
     {name:'素数 m：最长链 ≈ n/m',expr:'n / 4',color:'--viz-done'},
     {name:'2 的幂 m + 低位规律：链长翻几倍',expr:'n / 1.5',color:'--viz-violation'},
    ]},
    derivations:[
     {kind:'summation',title:'为什么 $m = 2^p$ 会浪费一半以上的槽（part 1 的账）',steps:[
      {zh:'$m = 2^p$ 时 $k mod m$ 只保留 $k$ 的最低 $p$ 位，高位全丢。'},
      {tex:'k = 4j \\Rightarrow k mod 2^p \\in \\{0, 4, 8, \\dots\\}',zh:'若所有 key 都是 4 的倍数，低位恒为 `00` → 可用槽只剩 $m/4$。'},
      {zh:'★ C 程序 part 1 的实测：$m = 256$ 时最长链 13，$m = 251$（素数）时 6 —— 差一倍以上。$p$ 越大、低位规律越强，差距越夸张。'}]},
     {kind:'summation',title:'全域族为什么能"对抗任意输入"',steps:[
      {zh:'关键在**概率取自哪里**：不是"假设 key 随机"，而是"**当场随机选一个 $h$**"。'},
      {tex:'\\Pr_{h \\leftarrow H}\\{h(k_1) = h(k_2)\\} \\le 1/m \\quad \\text{对任意固定的 } k_1 \\ne k_2',zh:'这里的“任意固定”指 key 对**事先确定、且与 $h$ 的随机选择无关**；若对手先看到 $h$ 再自适应地挑 key，这个上界就不能直接套用。'},
      {zh:'★ 这就是 Theorem 11.3 能说"**任意** $s$ 个操作的序列"的原因（而不只是"平均输入下"）。'}]},
    ],
    note:'★ 中心图：绿线是素数 $m$ 的链长（与 $n/m$ 同阶），红线是 2 的幂遇到低位规律时的退化 —— 差距就是"选 $m$"这件事的全部价值。'},
   {type:'prove',title:'Theorem 11.4：为什么 H_pm 是全域的',
    statement:'Therefore, for any pair of distinct values k 1 ,k 2 2 Z p , Pr fh ab (k 1 ) = h ab (k 2 )g ≤ 1/m; so that H pm is indeed universal.',
    page:290,
    intro:'★ 这是全章唯一一处"用数论证明数据结构性质"的地方（原书 **Theorem 11.4**，p.289–290）。四步：模 p 层不冲突 → (a,b) 与 (r₁,r₂) 一一对应 → 于是等可能 → 计数收尾。',
    steps:[
     {title:'第一步 · 模 p 层就已经"不冲突"',
      en:'We first note that r 1 ≠ r 2 . Why? Since we have r 1 − r 2 = a(k 1 − k 2 ) (mod p), it follows that r 1 ≠ r 2 because p is prime and both a and (k 1 − k 2 ) are nonzero modulo p. By Theorem 31.6 on page 908, their product must also be nonzero modulo p.',
      page:289,
      body:['两个 key 各自的中间量：r₁ = (a·k₁ + b) mod p，r₂ = (a·k₂ + b) mod p。',
        '相减得 r₁ − r₂ = a·(k₁ − k₂)（模 p 意义下）。',
        '★ 因为 p 是素数、a ≠ 0（a 取自 1 … p−1）、且 k₁ ≠ k₂ 且都小于 p，所以两者的乘积在模 p 下非零（第 31 章 Theorem 31.6）→ r₁ ≠ r₂。',
        '★ 这一步的含义很重要：在"模 p"这一层根本不发生冲突。冲突只可能出现在第二次取模（对 m）的时候 —— 这是理解整个证明的钥匙。']},
     {title:'第二步 · (a, b) 与 (r₁, r₂) 一一对应',
      en:'Moreover, each of the possible p(p − 1) choices for the pair (a,b) with a ≠ 0 yields a different resulting pair (r 1 ,r  2 ) with r 1 ≠ r 2 , since we can solve for a and b given r 1 and r 2 :',
      page:289,
      body:['原书给出**反解**：a = ((r₁ − r₂)·(k₁ − k₂)⁻¹ mod p) mod p，b = (r₁ − a·k₁) mod p（用到 k₁ − k₂ 在模 p 下的乘法逆元）。',
        '★ 两边各自计数：$(a, b)$ 共有 p(p−1) 个（a 有 p−1 种、b 有 p 种）；而"r₁ ≠ r₂"的有序对也有 p(p−1) 个（r₁ 有 p 种、r₂ 有 p−1 种）。',
        '数量相等 + 能反解 → 二者之间是**一一对应**（原书："there is a one-to-one correspondence"）。',
        '★ 这个双射就是全部戏法所在：它把"随机选一个散列函数"翻译成了"随机选一对互不相同的 $(r_1, r_2)$"。']},
     {title:'第三步 · 于是 (r₁, r₂) 等可能地是任意一对不同值',
      en:'Thus, for any given pair of distinct inputs k 1 and k 2 , if we pick (a,b)  uniformly at random from Z − p × Z p , the resulting pair (r 1 ,r  2 ) is equally likely to be any pair of distinct values modulo p.',
      page:289,
      body:['随机均匀地选 $(a, b)$（$a \neq 0$），由上面的双射，$(r_1, r_2)$ **等可能**地是任意一对互不相同的模 p 值。',
        '于是 r₂ 等可能地取遍模 p 下"除 r₁ 以外"的那 p−1 个值。',
        '★ 到这里，"随机散列能对抗对手"已经从直觉变成了严格命题：对手无法让 r₂ 更偏爱与 r₁ 同余的值。']},
     {title:'第四步 · 计数收尾：至多 1/m',
      en:'The probability that r 2 collides with r 1 when reduced modulo m is at most ..p − 1/=m/=.p − 1/ = 1/m, since r 2 is equally likely to be any of the p − 1 values in Z p that are different from r 1 , but at most (p − 1)/m of those values are equivalent to r 1 modulo m.',
      page:290,
      body:['模 p 下与 r₁ **对 m 同余**的值，至多占那 p−1 个候选里的 $(p-1)/m$ 个。',
        '所以 $\\Pr\\{h_{ab}(k_1) = h_{ab}(k_2)\\} \\le ((p-1)/m)/(p-1) = 1/m$。∎',
        '★ C 程序 part 3 与它吻合：p = 10007、m = 100 时 20 万组随机参数里实测冲突率 0.00966，低于上界 0.01。']},
    ],
    conclusion:'★ 结论：$H_{pm} = \\{h_{ab}(k) = ((ak + b) mod p) mod m\\}$（p 为大于所有 key 的素数，共 p(p−1) 个函数）是**全域族**（Theorem 11.4）。它的价值在于：冲突概率上界**对任意固定的 k₁ ≠ k₂ 都成立** —— 随机性在"选哪个 h"上，而不在"输入怎么分布"上。配上链接法即得 Theorem 11.3 的 Θ(s) 期望总时间。',
    note:'★ 原书 p.290 还给出一条实践推荐：把所有奇数乘数 a（1 ≤ a < m）的 multiply-shift 函数收集成族，它被证明是 2/m-universal（Theorem 11.5）—— 上界松一倍，但计算快得多，原书认为在很多实际场景下这笔交易划算。',
    },
   {type:'drill',title:'检验一下',
    items:[
     {kind:'single',q:'除法散列 $h(k) = k mod m$ 中，$m$ 最好取什么？',
      options:['2 的幂','远离 2 的幂的素数','任意偶数','$k$ 的最大值'],answer:1,
      why:'★ 原书 p.284：$m$ 取"not too close to an exact power of 2"的素数。C 程序 part 1 实测：2 的幂最长链 13 vs 素数 6。'},
     {kind:'single',q:'为什么 $m$ 取 2 的幂时，除法散列容易退化？',
      options:['因为对 $2^p$ 取模的运算本身太慢，来不及把关键字的高位一起算进去','因为 $k mod 2^p$ 只用到 $k$ 的低 $p$ 位，高位全丢','因为 2 是偶数，用偶数当模数会让散列结果整体偏向某一半的槽位','因为素数模数的除法反而更好算，所以实践里从来不该取 2 的幂'],answer:1,
      why:'★ 低位有规律时，可用槽数大幅减少（全是 4 的倍数 → 只剩 $m/4$ 个槽）。'},
     {kind:'single',q:'“全域族”$H$ 的定义是什么？',
      options:['对每个 key 与每个槽位，族里都至少有一个函数能把它散列到那个槽上，覆盖要全','任意两个不同 key 冲突的概率 $\\le 1/m$（概率取自 $h$ 的选择）','族里的每一个 $h$ 都必须是双射，不同 key 一定要散列到互不相同的槽位上','整个论域里只允许存在一个散列函数，换函数就不叫「全域」了，这是名字的含义'],answer:1,
      why:'★ 原书 p.287 的定义句。★ 概率取自 **$h$ 的随机选择**，不是取自 key 的分布 —— 这是它能对抗任意输入的关键。'},
     {kind:'single',q:'为什么"固定散列函数"无法对抗恶意输入？',
      options:['因为固定的函数算得慢，来不及把关键字充分散开','因为对手知道 $h$ 后能构造全部冲突的 key','因为固定函数没法把表长 $m$ 取成素数，冲突自然就多起来了','因为固定函数的冲突概率本身就大于 1，永远不会收敛'],answer:1,
      why:'★ 原书 p.286 的动机段；C 程序 part 4 实测：$h(k)=k mod 100$ 遇到"全是 100 的倍数"的 key → 50 个元素全撞一个槽。'},
     {kind:'judge',q:'乘法散列（multiply-shift）比除法散列更快、也更有性能保证。',answer:false,
      why:'★ 它确实更快（一次乘法 + 移位，且 $m$ 可取 2 的幂），但原书 p.286 明确说它不提供任何保证 —— 有保证的是随机散列（全域族）。'},
     {kind:'simulate',q:'$h_{ab}(k) = ((ak+b) mod p) mod m$ 中，若 $p = 10007$、$m = 100$，则任意两个不同 key 的冲突概率上界是多少？（填小数，两位）',expect:[0.01],placeholder:'例如：0.05',
      why:'全域族的定义：$\\le 1/m = 1/100 = 0.01$。C 程序 part 3 实测 0.00966 —— 低于上界。'},
    ],
    bookExercises:[
     {id:'11.3-1',page:292,star:0,statement:'You wish to search a linked list of length n, where each element contains a key k along with a hash value h(k). Each key is a long character string. How might you take advantage of the hash values when searching the list for an element with a given key?',hint:'思路：若 $h(k_{target}) \\ne h(k_{element})$ 则两者**必然不同**，可以直接跳过，不必比较长字符串 —— 把昂贵的字符串比较换成廉价的整数比较。'},
     {id:'11.3-2',page:292,star:0,statement:'You hash a string of r characters into m slots by treating it as a radix-128 number and then using the division method. You can represent the number m as a 32-bit computer word, but the string of r characters, treated as a radix-128 number, takes many words. How can you apply the division method to compute the hash value of the character string without using more than a constant number of words of storage outside the string itself?',hint:'折叠相加的合法性依赖模数长什么样：$2^p \\equiv 1$（模 $2^p - 1$） 才谈得上「按 $p$ 位折叠」， 而本题的 $m$ 只是「任意能用 32 位字表示的数」，一般不是 $2^p - 1$ —— 那样折叠会算出错值 （把位折叠当求和只在 $m = 2^p - 1$ 时成立，那是**下一题** 11.3-3 的设定）。 本题要的是 Horner 逐步取模：$x \\leftarrow (128x + c)$ 对 $m$ 取模，逐字符推进， 中间量始终小于 $128m + 128$，用常数个字就能装下，既不会溢出也不用大数运算。'},
     {id:'11.3-3',page:292,star:0,statement:'Consider a version of the division method in which h(k) = k mod m, where m = 2 p − 1 and k is a character string interpreted in radix 2 p . Show that if string x can be converted to string y by permuting its characters, then x and y hash to the same value. Give an example of an application in which this property would be undesirable in a hash function.',hint:'要证：若字符串 $x$ 可由另一个字符串 $y$ 通过**置换其字符**得到，则 $h(x) = h(y)$。因为 $m = 2^p-1$ 满足 $2^p \\equiv 1$（模 $m$），基 $2^p$ 下每个字符位的权都退化成 1，于是散列值只取决于"字符的多重集"。★ 这是一个**坏消息**：说明 $m = 2^p-1$ 对字符串 key 很糟（置换不变的散列函数区分不了变位词）。'},
     {id:'11.3-4',page:292,star:0,statement:'Consider a hash table of size m = 1000 and a corresponding hash function h(k) = bm(kA mod 1)c for A = . p 5 − 1/=2. Compute the locations to which the keys 61, 62, 63, 64, and 65 are mapped.',hint:'用 $A \\approx 0.618034$ 逐个算 $h(k)$；本题的要点是观察**乘性散列把相邻的整数映射到相距约 $m A$ 的位置**（黄金分割的等分布性质）。'},
    ]},
  ],
};
