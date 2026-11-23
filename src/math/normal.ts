/** Abramowitz-Stegun 7.1.26 approximation; maximum absolute CDF error is about 7.5e-8. */
export function normalCdf(x: number): number {
  if (!Number.isFinite(x)) return x === Infinity ? 1 : x === -Infinity ? 0 : NaN;
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * z);
  const erf = 1 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - 0.284496736)*t + 0.254829592)*t*Math.exp(-z*z);
  return Math.min(1,Math.max(0,0.5 * (1 + sign * erf)));
}
export const normalPdf = (x: number): number => Math.exp(-0.5*x*x) / Math.sqrt(2*Math.PI);
