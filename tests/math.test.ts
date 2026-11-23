import { describe, expect, it } from 'vitest';
import { calculateExpectedMove } from '../src/math/expectedMove';
import { blackScholesGreeks, blackScholesPrice } from '../src/math/blackScholes';
import { greekEstimate } from '../src/math/greeks';
import { calculateDashboard } from '../src/risk/calculator';
import { DEFAULT_SCENARIO } from '../src/domain/types';
import { isScenario, scenarioErrors } from '../src/domain/validation';
import { exportScenario, parseScenarioImport, readSaved, writeSaved } from '../src/storage/scenarios';
import { normalCdf } from '../src/math/normal';

const base={optionType:'call' as const,spot:100,strike:100,volatility:.2,timeYears:1,riskFreeRate:.05,carry:.02};

describe('expected move',()=>{
 it('matches the approved two-hour BTC fixture and nonnegative bands',()=>{
  const r=calculateExpectedMove(90000,55,2);
  expect(r.move).toBeCloseTo(748.4,0);
  expect(r.lower1).toBeCloseTo(89251.6,0);
  expect(r.upper1).toBeCloseTo(90748.4,0);
  expect(r.bands.map(x=>x.probability)).toEqual(['68.27%','95.45%','99.73%']);
  expect(r.bands.every(x=>x.lower>=0)).toBe(true);
 });
 it('handles zero horizon and rejects invalid inputs',()=>{
  expect(calculateExpectedMove(100,50,0).move).toBe(0);
  expect(()=>calculateExpectedMove(0,50,1)).toThrow(RangeError);
  expect(()=>calculateExpectedMove(100,-1,1)).toThrow(RangeError);
 });
});

describe('normal distribution and Black–Scholes',()=>{
 it('approximates common normal CDF reference values',()=>{
  expect(normalCdf(0)).toBeCloseTo(.5,7);
  expect(normalCdf(1.95996398454)).toBeCloseTo(.975,6);
  expect(normalCdf(-1.95996398454)).toBeCloseTo(.025,6);
  expect(normalCdf(-40)).toBe(0); expect(normalCdf(40)).toBe(1);
 });
 it('uses intrinsic value at expiry for calls and puts',()=>{
  expect(blackScholesPrice({...base,spot:110,timeYears:0})).toBe(10);
  expect(blackScholesPrice({...base,optionType:'put',spot:90,timeYears:0})).toBe(10);
 });
 it('uses discounted deterministic payoff when volatility is zero',()=>{
  expect(blackScholesPrice({...base,volatility:0})).toBeCloseTo(100*Math.exp(-.02)-100*Math.exp(-.05),10);
 });
 it('satisfies put-call parity with nonzero rate and carry',()=>{
  const c=blackScholesPrice(base),p=blackScholesPrice({...base,optionType:'put'});
  expect(c-p).toBeCloseTo(100*Math.exp(-.02)-100*Math.exp(-.05),7);
 });
 it('returns finite nonnegative prices and documented Greek units',()=>{
  const call=blackScholesPrice(base), put=blackScholesPrice({...base,optionType:'put'});
  expect(call).toBeGreaterThanOrEqual(0); expect(put).toBeGreaterThanOrEqual(0);
  const g=blackScholesGreeks(base);
  expect(g.delta).toBeGreaterThan(0); expect(g.gamma).toBeGreaterThan(0); expect(g.vegaPerIvPoint).toBeGreaterThan(0); expect(Number.isFinite(g.thetaPerDay)).toBe(true);
 });
 it('rejects invalid and nonfinite pricing inputs',()=>{
  expect(()=>blackScholesPrice({...base,spot:0})).toThrow(RangeError);
  expect(()=>blackScholesPrice({...base,strike:NaN})).toThrow(RangeError);
  expect(()=>blackScholesPrice({...base,timeYears:-1})).toThrow(RangeError);
  expect(()=>blackScholesPrice({...base,volatility:-.1})).toThrow(RangeError);
  expect(()=>blackScholesPrice({...base,riskFreeRate:-1e308})).toThrow(RangeError);
 });
});

describe('Greek approximation',()=>{
 const g={delta:.5,gamma:.0001,vegaPerIvPoint:12,thetaPerDay:-48};
 it('matches TP and SL acceptance fixtures with elapsed time expressed in hours',()=>{
  expect(greekEstimate(600,g,500,0,2)).toBeCloseTo(858.5,8);
  expect((858.5-600)/600*100).toBeCloseTo(43.0833,3);
  expect(greekEstimate(600,g,-300,0,1)).toBeCloseTo(452.5,8);
  expect((452.5-600)/600*100).toBeCloseTo(-24.5833,3);
 });
 it('models a put delta increase for a downward BTC move',()=>{
  const estimate=greekEstimate(600,{...g,delta:-.5},-300,0,0);
  expect(estimate).toBeGreaterThan(600);
 });
});

describe('risk, validation and local scenario files',()=>{
 it('sizes by risk and capital, rounding down to a lot',()=>{
  const s={...DEFAULT_SCENARIO,spot:100,strike:100,entryPremium:10,currentIvPct:40,remainingHours:48,targetSpot:120,stopSpot:80,targetElapsedHours:1,stopElapsedHours:1,quantity:2,lotSize:2,accountCapital:1000,maxRiskPct:5,exitAdjustment:0,fixedFeePerSide:0,feePctPerSide:0};
  const r=calculateDashboard(s);
  expect((r.sizedContracts??0)%2).toBe(0);
  expect((r.sizedContracts??0)*Math.max(0,-r.sl.netPnlPerContract)).toBeLessThanOrEqual(r.riskBudget+1e-8);
  expect((r.sizedContracts??0)*s.entryPremium*s.multiplier).toBeLessThanOrEqual(s.accountCapital);
 });
 it('avoids NaN ROI when premium and entry costs are zero',()=>{
  const s={...DEFAULT_SCENARIO,entryPremium:0,fixedFeePerSide:0,feePctPerSide:0,exitAdjustment:0};
  expect(calculateDashboard(s).tp.netRoiPct).toBeNull();
 });
 it('does not infer risk sizing from a non-loss stop scenario',()=>{
  const s={...DEFAULT_SCENARIO,targetSpot:100000,stopSpot:100000,exitAdjustment:0};
  expect(calculateDashboard(s).maxRiskContracts).toBeNull();
 });
 it('rejects invalid quantity, FX, and malformed imported JSON',()=>{
  expect(scenarioErrors({...DEFAULT_SCENARIO,quantity:0}).length).toBeGreaterThan(0);
  expect(scenarioErrors({...DEFAULT_SCENARIO,usdInr:0}).length).toBeGreaterThan(0);
  expect(scenarioErrors({...DEFAULT_SCENARIO,targetSpot:NaN}).length).toBeGreaterThan(0);
  expect(scenarioErrors({...DEFAULT_SCENARIO,quantity:1.5}).length).toBeGreaterThan(0);
  expect(isScenario({...DEFAULT_SCENARIO,spot:Infinity})).toBe(false);
  expect(()=>parseScenarioImport('{bad json')).toThrow();
  expect(()=>parseScenarioImport(JSON.stringify({schemaVersion:1,name:'bad',scenario:{}}))).toThrow();
 });
 it('round trips versioned exports and guards corrupted local storage',()=>{
  const raw=exportScenario(DEFAULT_SCENARIO,'Fixture');
  const parsed=parseScenarioImport(raw);
  expect(parsed.name).toBe('Fixture'); expect(parsed.scenario).toEqual(DEFAULT_SCENARIO);
  const store={value:'not json',getItem(){return this.value;},setItem(_k:string,v:string){this.value=v;},removeItem(){this.value='';}} as unknown as Storage;
  expect(readSaved(store)).toEqual([]);
  writeSaved([],store); expect(readSaved(store)).toEqual([]);
 });
 it('applies contract multiplier and quantity to total P&L while preserving per-contract math',()=>{
  const one={...DEFAULT_SCENARIO,quantity:1,multiplier:1};
  const two={...one,quantity:2,multiplier:2};
  const a=calculateDashboard(one), b=calculateDashboard(two);
  expect(b.tp.netPnlPerContract).toBeCloseTo(a.tp.netPnlPerContract*2,8);
  expect(b.tp.netPnlPerContract*two.quantity).toBeCloseTo(a.tp.netPnlPerContract*4,8);
 });
 it('uses independent TP and SL IV/time inputs',()=>{
  const s={...DEFAULT_SCENARIO,targetIvChangePp:10,stopIvChangePp:-5,targetElapsedHours:2,stopElapsedHours:.25};
  const r=calculateDashboard(s);
  expect(r.tp.modelRaw).not.toEqual(r.sl.modelRaw);
 });
});
