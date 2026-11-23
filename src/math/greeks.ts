import type { Greeks } from '../domain/types';
export function greekEstimate(entryPremium: number, greeks: Greeks, spotChange: number, ivChangePp: number, elapsedHours: number): number {
  if (![entryPremium,greeks.delta,greeks.gamma,greeks.vegaPerIvPoint,greeks.thetaPerDay,spotChange,ivChangePp,elapsedHours].every(Number.isFinite) || entryPremium < 0 || elapsedHours < 0) throw new RangeError('Greek estimate inputs must be finite; premium and elapsed time must be nonnegative.');
  const estimate=entryPremium + greeks.delta*spotChange + 0.5*greeks.gamma*spotChange*spotChange + greeks.vegaPerIvPoint*ivChangePp + greeks.thetaPerDay*(elapsedHours/24);
  if (!Number.isFinite(estimate)) throw new RangeError('Greek estimate exceeds the supported numeric range.');
  return estimate;
}
