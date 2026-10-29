import {GOLD_NISAB_GRAMS,SILVER_NISAB_GRAMS} from './calculations.mjs';

const round = x => Math.round((x + Number.EPSILON) * 100) / 100;
const good = (x,max=1e9) => typeof x === 'number' && Number.isFinite(x) && x>=0 && x<=max;
const positive = (x,max=1e9) => good(x,max) && x>0;
export const GOLD_KARATS = Object.freeze([24,22,21,18,14,9]);

/** User-verified unit cost; never a fabricated rate or remote quote. */
/** @param {{people:number,rate:number,extra?:number,comparisonRate?:number|null}} input */
export function fitranaBreakdown({people,rate,extra=0,comparisonRate=null}){
 if(!Number.isInteger(people)||people<1||people>500||!positive(rate,1e6)||!good(extra,1e6))return null;
 if(comparisonRate!==null&&!positive(comparisonRate,1e6))return null;
 const base=round(people*rate),total=round(base+extra);
 if(!good(total,1e9))return null;
 return {people,rate,base,extra,total,comparison:comparisonRate===null?null:{rate:comparisonRate,base:round(people*comparisonRate),difference:round(people*(comparisonRate-rate))}};
}
/** This estimates metal-content value, not jewellery resale value or an obligation. */
/** @param {{items:Array<{weight:number,karat:number}>,price24k:number,otherAssets?:number,liabilities?:number,benchmark?:'gold'|'silver',silverPrice?:number|null}} input */
export function goldPortfolioEstimate({items,price24k,otherAssets=0,liabilities=0,benchmark='gold',silverPrice=null}){
 if(!Array.isArray(items)||items.length<1||items.length>12||!positive(price24k,1e7)||
 !good(otherAssets,1e9)||!good(liabilities,1e9)||!['gold','silver'].includes(benchmark)||
 (benchmark==='silver'&&!positive(silverPrice,1e7)))return null;
 const lines=[];
 for(let i=0;i<items.length;i++){
  const item=items[i];
  if(!item||!positive(item.weight,100000)||!GOLD_KARATS.includes(item.karat))return null;
  const pure=item.weight*item.karat/24, value=pure*price24k;
  if(!good(value,1e11))return null;
  lines.push({item:i+1,weight:item.weight,karat:item.karat,pureGrams:pure,value:round(value)});
 }
 const fineGold=lines.reduce((n,x)=>n+x.pureGrams,0);
 const goldValue=round(fineGold*price24k);
 const gross=round(goldValue+otherAssets);
 const net=round(Math.max(0,gross-liabilities));
 const threshold=round(benchmark==='gold'?GOLD_NISAB_GRAMS*price24k:SILVER_NISAB_GRAMS*silverPrice);
 if(!good(gross,1e12)||!good(net,1e12)||!positive(threshold,1e12))return null;
 return {lines,fineGold,goldValue,gross,net,threshold,benchmark,meetsThreshold:net>=threshold,
  conditionalTotal:net>=threshold?round(net*0.025):0,illustrativeGoldShare:round(goldValue*0.025)};
}
/** @param {{goldPrice:number,silverPrice:number,wealth?:number|null,liabilities?:number}} input */
export function nisabComparison({goldPrice,silverPrice,wealth=null,liabilities=0}){
 if(!positive(goldPrice,1e7)||!positive(silverPrice,1e7)||!good(liabilities,1e9))return null;
 if(wealth!==null&&!good(wealth,1e11))return null;
 const gold=round(GOLD_NISAB_GRAMS*goldPrice),silver=round(SILVER_NISAB_GRAMS*silverPrice);
 if(!positive(gold,1e12)||!positive(silver,1e12))return null;
 const net=wealth===null?null:round(Math.max(0,wealth-liabilities));
 return {gold,silver,goldGrams:GOLD_NISAB_GRAMS,silverGrams:SILVER_NISAB_GRAMS,net,
  goldReached:net===null?null:net>=gold,silverReached:net===null?null:net>=silver,
  conditionalGold:net!==null&&net>=gold?round(net*0.025):0,
  conditionalSilver:net!==null&&net>=silver?round(net*0.025):0};
}
export const safeNote=x=>String(x??'').replace(/[\r\n\t\u0000-\u001f]/g,' ').slice(0,100);
