import type { ExitResult, Scenario } from '../domain/types';
import { blackScholesPrice, blackScholesGreeks } from '../math/blackScholes';
import { greekEstimate } from '../math/greeks';
import { calculateExpectedMove } from '../math/expectedMove';
const yearHours=365*24;
const pricing=(s:Scenario, spot:number, ivPct:number, remainingHours:number) => ({optionType:s.optionType,spot,strike:s.strike,volatility:ivPct/100,timeYears:Math.max(0,remainingHours)/yearHours,riskFreeRate:s.riskFreePct/100,carry:s.carryPct/100});
const fee=(s:Scenario,premium:number) => 2*(s.fixedFeePerSide + Math.max(0,premium)*s.multiplier*s.feePctPerSide/100);
function exit(s:Scenario, target:boolean, modelEntry:number): ExitResult {
  const spot=target?s.targetSpot:s.stopSpot, elapsed=target?s.targetElapsedHours:s.stopElapsedHours, iv=s.currentIvPct+(target?s.targetIvChangePp:s.stopIvChangePp), rem=s.remainingHours-elapsed;
  const modelRaw=blackScholesPrice(pricing(s,spot,iv,rem));
  const modelCalibrated=Math.max(0,modelRaw+s.entryPremium-modelEntry);
  const greekEstimateRaw=greekEstimate(s.entryPremium,{delta:s.delta,gamma:s.gamma,vegaPerIvPoint:s.vegaPerIvPoint,thetaPerDay:s.thetaPerDay},spot-s.spot,target?s.targetIvChangePp:s.stopIvChangePp,elapsed);
  const simulatedExit=Math.max(0,modelCalibrated-s.exitAdjustment);
  const costsPerContract=fee(s,s.entryPremium)+fee(s,simulatedExit);
  const grossPnlPerContract=(simulatedExit-s.entryPremium)*s.multiplier;
  const netPnlPerContract=grossPnlPerContract-costsPerContract;
  const entryCash=s.entryPremium*s.multiplier+fee(s,s.entryPremium);
  const netRoiPct=entryCash>0 ? netPnlPerContract/entryCash*100 : null;
  const diff=modelRaw-greekEstimateRaw;
  return {modelRaw,modelCalibrated,greekEstimate:greekEstimateRaw,simulatedExit,modelGreekDifference:diff,modelGreekDifferencePct:modelRaw!==0?Math.abs(diff)/modelRaw*100:null,grossPnlPerContract,costsPerContract,netPnlPerContract,netRoiPct};
}
export type DashboardResults={ expected:ReturnType<typeof calculateExpectedMove>; modelEntry:number; modelGreeks:ReturnType<typeof blackScholesGreeks>; tp:ExitResult; sl:ExitResult; premiumStop:number; riskBudget:number; maxRiskContracts:number|null; maxCapitalContracts:number; sizedContracts:number|null; rewardRisk:number|null; maxLossPerContract:number };
export function calculateDashboard(s:Scenario):DashboardResults {
  const entry=pricing(s,s.spot,s.currentIvPct,s.remainingHours), modelEntry=blackScholesPrice(entry), modelGreeks=blackScholesGreeks(entry);
  const tp=exit(s,true,modelEntry), sl=exit(s,false,modelEntry), premiumStop=s.entryPremium*(1-s.premiumStopPct/100);
  const riskBudget=s.accountCapital*s.maxRiskPct/100;
  const maxLossPerContract=s.entryPremium*s.multiplier+fee(s,s.entryPremium);
  const slLoss=-sl.netPnlPerContract;
  const maxRiskContracts=slLoss>0?Math.floor(riskBudget/slLoss/s.lotSize)*s.lotSize:null;
  const cashPerContract=s.entryPremium*s.multiplier+fee(s,s.entryPremium);
  const maxCapitalContracts=cashPerContract>0?Math.floor(s.accountCapital/cashPerContract/s.lotSize)*s.lotSize:0;
  const sizedContracts=maxRiskContracts===null?null:Math.min(maxRiskContracts,maxCapitalContracts);
  const rewardRisk=tp.netPnlPerContract>0&&sl.netPnlPerContract<0?tp.netPnlPerContract/Math.abs(sl.netPnlPerContract):null;
  const numeric=[modelEntry,...Object.values(modelGreeks),...Object.values(tp).filter((x):x is number=>typeof x==='number'),...Object.values(sl).filter((x):x is number=>typeof x==='number'),riskBudget,maxLossPerContract,maxCapitalContracts,...(maxRiskContracts===null?[]:[maxRiskContracts]),...(sizedContracts===null?[]:[sizedContracts])];
  if(!numeric.every(Number.isFinite)) throw new RangeError('Scenario outputs exceed the supported numeric range.');
  return {expected:calculateExpectedMove(s.spot,s.atmIvPct,s.expectedHours),modelEntry,modelGreeks,tp,sl,premiumStop,riskBudget,maxRiskContracts,maxCapitalContracts,sizedContracts,rewardRisk,maxLossPerContract};
}
