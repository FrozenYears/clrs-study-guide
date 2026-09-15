/* hire_assistant.c -- 5.1 节 HIRE-ASSISTANT 的 C 实现。 */
#include <assert.h>
#include <stdio.h>

/* rank 越大表示资格越高；返回最终被聘用者的 0 基下标。 */
static int hire_assistant(const int ranks[], int n, int *interviews, int *hires)
{
    int best = -1;
    *interviews = 0;
    *hires = 0;

    for (int i = 0; i < n; i++) {
        (*interviews)++;
        if (best < 0 || ranks[i] > ranks[best]) {
            best = i;
            (*hires)++;
        }
    }
    return best;
}

static void check(const char *name, const int ranks[], int n,
                  int expected_best, int expected_hires)
{
    int interviews;
    int hires;
    const int best = hire_assistant(ranks, n, &interviews, &hires);
    assert(best == expected_best);
    assert(interviews == n);
    assert(hires == expected_hires);
    printf("ok: %s (interviews=%d, hires=%d)\n", name, interviews, hires);
}

int main(void)
{
    const int increasing[] = {1, 2, 3, 4, 5};
    const int decreasing[] = {5, 4, 3, 2, 1};
    const int mixed[] = {3, 1, 4, 2, 5};

    check("increasing", increasing, 5, 4, 5);
    check("decreasing", decreasing, 5, 0, 1);
    check("mixed", mixed, 5, 4, 3);
    puts("HIRE-ASSISTANT checks passed.");
    return 0;
}
