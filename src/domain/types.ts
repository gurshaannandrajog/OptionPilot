export type OptionType = 'call' | 'put';
export type Scenario = {
  optionType: OptionType;
  spot: number;
  strike: number;
  entryPremium: number;
  currentIvPct: number;
  atmIvPct: number;
  remainingHours: number;
  riskFreePct: number;
  carryPct: number;
  delta: number;
  gamma: number;
  vegaPerIvPoint: number;
  thetaPerDay: number;
  expectedHours: number;
  targetSpot: number;
  targetElapsedHours: number;
  targetIvChangePp: number;
  stopSpot: number;
  stopElapsedHours: number;
  stopIvChangePp: number;
  exitAdjustment: number;
  quantity: number;
  multiplier: number;
  lotSize: number;
  feePctPerSide: number;
  fixedFeePerSide: number;
  accountCapital: number;
  maxRiskPct: number;
  premiumStopPct: number;
  usdInr: number;
};
export type Greeks = { delta: number; gamma: number; vegaPerIvPoint: number; thetaPerDay: number };
export type PricingInput = { optionType: OptionType; spot: number; strike: number; volatility: number; timeYears: number; riskFreeRate: number; carry: number };
export type ExitResult = { modelRaw: number; modelCalibrated: number; greekEstimate: number; simulatedExit: number; modelGreekDifference: number; modelGreekDifferencePct: number | null; grossPnlPerContract: number; costsPerContract: number; netPnlPerContract: number; netRoiPct: number | null };
export const DEFAULT_SCENARIO: Scenario = {
  optionType:'call', spot:90000, strike:90000, entryPremium:600, currentIvPct:55, atmIvPct:55, remainingHours:48,
  riskFreePct:0, carryPct:0, delta:0.5, gamma:0.0001, vegaPerIvPoint:12, thetaPerDay:-48,
  expectedHours:2, targetSpot:90500, targetElapsedHours:1, targetIvChangePp:0, stopSpot:89700, stopElapsedHours:0.5, stopIvChangePp:0,
  exitAdjustment:5, quantity:1, multiplier:1, lotSize:1, feePctPerSide:0, fixedFeePerSide:0,
  accountCapital:10000, maxRiskPct:1, premiumStopPct:30, usdInr:83.5
};
