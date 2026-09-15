/* akra_bazzi_demo.c -- 4.7 节：数值演示 Akra-Bazzi 示例。 */
#include <assert.h>
#include <math.h>
#include <stdio.h>

static double balance(double p)
{
    return pow(1.0 / 5.0, p) + pow(7.0 / 10.0, p);
}

static double solve_p(void)
{
    double lo = 0.0;
    double hi = 2.0;
    for (int i = 0; i < 80; i++) {
        const double mid = (lo + hi) / 2.0;
        if (balance(mid) > 1.0) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return (lo + hi) / 2.0;
}

static double integral_linear_drive(double n, double p)
{
    /* f(x)=x, so ∫ x/x^(p+1) dx = ∫ x^(-p) dx. */
    return (pow(n, 1.0 - p) - 1.0) / (1.0 - p);
}

int main(void)
{
    const double p = solve_p();
    assert(p > 0.83 && p < 0.85);
    assert(balance(p) > 0.999999 && balance(p) < 1.000001);

    for (int n = 10; n <= 1000; n *= 10) {
        const double total = pow(n, p) * (1.0 + integral_linear_drive(n, p));
        printf("n=%d  p=%.5f  AB estimate=%.3f  estimate/n=%.3f\n",
               n, p, total, total / n);
    }
    puts("Akra-Bazzi numerical checks passed.");
    return 0;
}
