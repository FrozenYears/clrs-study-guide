#include <assert.h>
#include <stdio.h>
#define RED 0
#define BLACK 1
#define MAXN 256
typedef struct node { int key; int color; struct node *left, *right, *p; } node_t;
static node_t pool[MAXN]; static int used;
static node_t *mk(int k, int c) { node_t *n = &pool[used++]; n->key = k; n->color = c; n->left = n->right = n->p = NULL; return n; }
static int bh_ok = 1;
static int f_black(const node_t *x) { if (!x) return 1; int l = f_black(x->left); int r = f_black(x->right); if (l != r) { bh_ok = 0; return -1; } return l + (x->color == BLACK ? 1 : 0); }
static int check_red(const node_t *x) { if (!x) return 1; if (x->color == RED && ((x->left && x->left->color == RED) || (x->right && x->right->color == RED))) return 0; return check_red(x->left) && check_red(x->right); }
static int bh_root(const node_t *r) { return f_black(r) - (r->color == BLACK ? 1 : 0); }
static node_t *left_rotate(node_t *root, node_t *x) { node_t *y = x->right; x->right = y->left; if (y->left) y->left->p = x; y->p = x->p; if (!x->p) root = y; else if (x == x->p->left) x->p->left = y; else x->p->right = y; y->left = x; x->p = y; return root; }
static node_t *right_rotate(node_t *root, node_t *x) { node_t *y = x->left; x->left = y->right; if (y->right) y->right->p = x; y->p = x->p; if (!x->p) root = y; else if (x == x->p->right) x->p->right = y; else x->p->left = y; y->right = x; x->p = y; return root; }
static node_t *rb_insert_fixup(node_t *root, node_t *z) { while (z->p && z->p->color == RED) { if (z->p == z->p->p->left) { node_t *y = z->p->p->right; if (y && y->color == RED) { z->p->color = BLACK; y->color = BLACK; z->p->p->color = RED; z = z->p->p; } else { if (z == z->p->right) { z = z->p; root = left_rotate(root, z); } z->p->color = BLACK; z->p->p->color = RED; root = right_rotate(root, z->p->p); } } else { node_t *y = z->p->p->left; if (y && y->color == RED) { z->p->color = BLACK; y->color = BLACK; z->p->p->color = RED; z = z->p->p; } else { if (z == z->p->left) { z = z->p; root = right_rotate(root, z); } z->p->color = BLACK; z->p->p->color = RED; root = left_rotate(root, z->p->p); } } } root->color = BLACK; return root; }
static node_t *rb_insert(node_t *root, int key) { node_t *z = mk(key, RED); node_t *y = NULL, *x = root; while (x) { y = x; x = key < x->key ? x->left : x->right; } z->p = y; if (!y) root = z; else if (key < y->key) y->left = z; else y->right = z; return rb_insert_fixup(root, z); }
static int height(const node_t *x) { if (!x) return -1; int l = height(x->left), r = height(x->right); return 1 + (l > r ? l : r); }
int main(void) {
  setvbuf(stdout, NULL, _IONBF, 0);
  node_t *root = NULL;
  int keys[] = {11, 2, 14, 1, 7, 15, 5, 8};
  for (int i = 0; i < 8; i++) {
    root = rb_insert(root, keys[i]);
    assert(bh_ok && bh_root(root) >= 0 && check_red(root) && root->color == BLACK);
    assert(height(root) <= 8);                     /* 性质 1：h <= 2·⌈lg(n+1)⌉ = 2·4 = 8（n = 8） */
  }
  printf("part 1: 8 次 RB-INSERT 后五条性质全满足（bh = %d，高 %d <= 2lg(n+1)）\n", bh_root(root), height(root));
  for (int i = 0; i < 100; i++) {                   /* 再插 100 个 key，共 108 个结点 */
    root = rb_insert(root, i * 7 + 3);
    assert(bh_ok && bh_root(root) >= 0 && check_red(root));
    assert(height(root) <= 14);                     /* 2·⌈lg(109)⌉ = 14 */
  }
  printf("part 2: 100 个 key 全部插入后性质仍满足（共 108 结点，高 %d）\n", height(root));
  puts("all checks passed."); return 0;
}
