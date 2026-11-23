import type { Scenario } from './types';
export const scenarioErrors = (s: Scenario): string[] => {
  const errors: string[] = [];
  const positive: (keyof Scenario)[] = ['spot','strike','targetSpot','stopSpot','multiplier','lotSize','usdInr'];
  for (const key of positive) if (!Number.isFinite(s[key]) || Number(s[key]) <= 0) errors.push(`${key} must be a finite number greater than zero.`);
  const nonnegative: (keyof Scenario)[] = ['entryPremium','currentIvPct','atmIvPct','remainingHours','expectedHours','targetElapsedHours','stopElapsedHours','exitAdjustment','quantity','feePctPerSide','fixedFeePerSide','accountCapital','maxRiskPct','premiumStopPct'];
  for (const key of nonnegative) if (!Number.isFinite(s[key]) || Number(s[key]) < 0) errors.push(`${key} must be a finite number at least zero.`);
  for (const key of ['riskFreePct','carryPct','delta','gamma','vegaPerIvPoint','thetaPerDay','targetIvChangePp','stopIvChangePp'] as const) if (!Number.isFinite(s[key])) errors.push(`${key} must be finite.`);
  if (s.quantity <= 0) errors.push('Quantity must be greater than zero.');
  if (!Number.isInteger(s.quantity)) errors.push('Quantity must be a whole number of contracts.');
  if (!Number.isInteger(s.lotSize)) errors.push('Lot size must be a whole number of contracts.');
  if (s.maxRiskPct > 100) errors.push('Maximum risk must not exceed 100%.');
  if (s.premiumStopPct > 100) errors.push('Premium stop percentage must not exceed 100%.');
  if (s.feePctPerSide > 100) errors.push('Per-side fee percentage must not exceed 100%.');
  if (s.quantity % s.lotSize !== 0) errors.push('Quantity must be a whole multiple of the configured lot size.');
  if (s.targetElapsedHours > s.remainingHours || s.stopElapsedHours > s.remainingHours) errors.push('Scenario elapsed time cannot exceed time remaining to expiry.');
  if (s.currentIvPct + Math.min(s.targetIvChangePp,s.stopIvChangePp) < 0) errors.push('Scenario IV cannot be negative.');
  return [...new Set(errors)];
};
export const isScenario = (value: unknown): value is Scenario => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  const required: (keyof Scenario)[] = ['optionType','spot','strike','entryPremium','currentIvPct','atmIvPct','remainingHours','riskFreePct','carryPct','delta','gamma','vegaPerIvPoint','thetaPerDay','expectedHours','targetSpot','targetElapsedHours','targetIvChangePp','stopSpot','stopElapsedHours','stopIvChangePp','exitAdjustment','quantity','multiplier','lotSize','feePctPerSide','fixedFeePerSide','accountCapital','maxRiskPct','premiumStopPct','usdInr'];
  if (!required.every(k => Object.hasOwn(v,k))) return false;
  if (v.optionType !== 'call' && v.optionType !== 'put') return false;
  if (!required.filter(k => k !== 'optionType').every(k => typeof v[k] === 'number' && Number.isFinite(v[k] as number))) return false;
  return scenarioErrors(v as unknown as Scenario).length === 0;
};
