/** Local calendar date, avoiding UTC shifts near midnight. */
export function localISODate(value = new Date()) {
 if (!(value instanceof Date) || Number.isNaN(value.getTime())) throw new RangeError('Invalid date');
 const n=(x)=>String(x).padStart(2,'0');
 return `${value.getFullYear()}-${n(value.getMonth()+1)}-${n(value.getDate())}`;
}
export const GOLD_NISAB_GRAMS=87.48;
export const SILVER_NISAB_GRAMS=612.36;
export function parseAmount(input) {
 const n=Number(input);
 return input==='' ? 0 : Number.isFinite(n)&&n>=0 ? n : NaN;
}
export function nisabAmounts(goldPrice,silverPrice) {
 return {gold:GOLD_NISAB_GRAMS*goldPrice,silver:SILVER_NISAB_GRAMS*silverPrice};
}
export function zakatEstimate({assets,debts,threshold}) {
 if (![assets,debts,threshold].every(x=>Number.isFinite(x)&&x>=0)||threshold<=0) return null;
 const net=Math.max(0,assets-debts);
 return {net,threshold,eligible:net>=threshold,amount:net>=threshold?net*.025:0};
}
export function finalThirdStart(maghrib,nextFajr){
 if (!(maghrib instanceof Date)||!(nextFajr instanceof Date)||!Number.isFinite(maghrib.getTime())||!Number.isFinite(nextFajr.getTime())||nextFajr<=maghrib) return null;
 return new Date(maghrib.getTime() + (nextFajr.getTime()-maghrib.getTime())*2/3);
}
export function readingPlan(total,done,days){
 if (![total,done,days].every(Number.isInteger)||total<=0||days<=0||done<0||done>total)return null;
 return {remaining:total-done,perDay:Math.ceil((total-done)/days),perPrayer:Math.ceil((total-done)/days/5),percent:Math.round(done/total*100)};
}
