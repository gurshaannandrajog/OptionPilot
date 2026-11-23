import type { Greeks, PricingInput } from '../domain/types';
import { normalCdf, normalPdf } from './normal';
const validate = (i: PricingInput) => {
  if (![i.spot,i.strike,i.volatility,i.timeYears,i.riskFreeRate,i.carry].every(Number.isFinite)) throw new RangeError('Pricing inputs must be finite.');
  if (i.spot <= 0 || i.strike <= 0 || i.volatility < 0 || i.timeYears < 0) throw new RangeError('Spot and strike must be positive; volatility and time must be nonnegative.');
};
export function blackScholesPrice(i: PricingInput): number {
  validate(i);
  const {optionType,spot:s,strike:k,volatility:sigma,timeYears:t,riskFreeRate:r,carry:q}=i;
  if (t === 0) return optionType === 'call' ? Math.max(s-k,0) : Math.max(k-s,0);
  if (sigma === 0) {
    const forwardIntrinsic = optionType === 'call' ? Math.max(s*Math.exp(-q*t)-k*Math.exp(-r*t),0) : Math.max(k*Math.exp(-r*t)-s*Math.exp(-q*t),0);
    if (!Number.isFinite(forwardIntrinsic)) throw new RangeError('Price exceeds the supported numeric range.');
    return forwardIntrinsic;
  }
  const rootT=Math.sqrt(t), d1=(Math.log(s/k)+(r-q+0.5*sigma*sigma)*t)/(sigma*rootT), d2=d1-sigma*rootT;
  const raw=optionType === 'call' ? s*Math.exp(-q*t)*normalCdf(d1)-k*Math.exp(-r*t)*normalCdf(d2) : k*Math.exp(-r*t)*normalCdf(-d2)-s*Math.exp(-q*t)*normalCdf(-d1);
  if (!Number.isFinite(raw)) throw new RangeError('Price exceeds the supported numeric range.');
  return Math.max(0,raw);
}
export function blackScholesGreeks(i: PricingInput): Greeks {
  validate(i);
  const {optionType,spot:s,strike:k,volatility:sigma,timeYears:t,riskFreeRate:r,carry:q}=i;
  if (t === 0 || sigma === 0) return {delta:t===0 ? (optionType==='call' ? (s>k?1:s<k?0:0.5) : (s<k?-1:s>k?0:-0.5)) : 0, gamma:0, vegaPerIvPoint:0, thetaPerDay:0};
  const rootT=Math.sqrt(t), d1=(Math.log(s/k)+(r-q+0.5*sigma*sigma)*t)/(sigma*rootT), d2=d1-sigma*rootT, pdf=normalPdf(d1), discQ=Math.exp(-q*t), discR=Math.exp(-r*t);
  const delta=optionType==='call' ? discQ*normalCdf(d1) : discQ*(normalCdf(d1)-1);
  const gamma=discQ*pdf/(s*sigma*rootT);
  const vegaPerIvPoint=s*discQ*pdf*rootT/100;
  const thetaAnnual=optionType==='call' ? -s*discQ*pdf*sigma/(2*rootT)-r*k*discR*normalCdf(d2)+q*s*discQ*normalCdf(d1) : -s*discQ*pdf*sigma/(2*rootT)+r*k*discR*normalCdf(-d2)-q*s*discQ*normalCdf(-d1);
  const greeks={delta,gamma,vegaPerIvPoint,thetaPerDay:thetaAnnual/365};
  if (!Object.values(greeks).every(Number.isFinite)) throw new RangeError('Greeks exceed the supported numeric range.');
  return greeks;
}
