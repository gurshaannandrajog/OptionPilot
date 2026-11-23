export type MoveBand = { z: number; probability: string; lower: number; upper: number };
export type ExpectedMove = { move: number; lower1: number; upper1: number; bands: MoveBand[]; timeYears: number };
export function calculateExpectedMove(spot: number, atmIvPct: number, horizonHours: number): ExpectedMove {
  if (![spot,atmIvPct,horizonHours].every(Number.isFinite) || spot <= 0 || atmIvPct < 0 || horizonHours < 0) throw new RangeError('Spot must be positive; IV and horizon must be nonnegative finite values.');
  const timeYears = horizonHours / (365*24);
  const move = spot * (atmIvPct/100) * Math.sqrt(timeYears);
  if (!Number.isFinite(move)) throw new RangeError('Expected move exceeds the supported numeric range.');
  const bands = [
    {z:1, probability:'68.27%'}, {z:2, probability:'95.45%'}, {z:3, probability:'99.73%'}
  ].map(({z,probability}) => ({z, probability, lower:Math.max(0,spot-z*move), upper:spot+z*move}));
  return {move, lower1:bands[0].lower, upper1:bands[0].upper, bands, timeYears};
}
