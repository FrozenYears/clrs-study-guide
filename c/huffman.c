/* huffman.c -- 15.3: 哈夫曼编码（Huffman codes）。
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

    /* 固定长度编码需要 3 位/字符，100000 字符共 300000 位；
     * 可变长编码共 224000 位，节省约 25%（原书 p.432）。 */
    printf("part 3: 固定长度 3 位/字符需 300000 位；可变长哈夫曼编码需 224000 位（省约 25%%）\n");
    assert(N == 6);

    puts("all checks passed.");
    return 0;
}
