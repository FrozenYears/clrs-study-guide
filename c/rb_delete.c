/* rb_delete.c -- 13.4: RB-DELETE + FIXUP（用 T.nil 哨兵，与 CLRS 伪代码一致）。 */
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
