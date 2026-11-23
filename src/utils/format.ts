export const money=(n:number,currency='USD')=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:2}).format(n):'—';
export const number=(n:number,digits=2)=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{maximumFractionDigits:digits}).format(n):'—';
export const signed=(n:number)=>`${n>=0?'+':'−'}${number(Math.abs(n))}`;
