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

/** Reverse an Umm al-Qura date using the browser's built-in Intl calendar. */
export function hijriToGregorian(year,month,day){
 if(![year,month,day].every(Number.isInteger)||year<1300||year>1600||month<1||month>12||day<1||day>30)return null;
 const fmt=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',{year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'});
 const parts=(ms)=>{const p=fmt.formatToParts(new Date(ms));return ['year','month','day'].map(t=>Number(p.find(x=>x.type===t)?.value))};
 const approx=622+(year-1)*354.366/365.2425;
 let lo=Date.UTC(Math.floor(approx)-2,0,1,12),hi=Date.UTC(Math.floor(approx)+3,0,1,12);
 const target=year*10000+month*100+day;
 while(lo<=hi){
  const mid=Math.floor((Math.floor(lo/86400000)+Math.floor(hi/86400000))/2)*86400000+43200000;
  const [y,m,d]=parts(mid),key=y*10000+m*100+d;
  if(key===target)return new Date(mid);
  if(key<target)lo=mid+86400000;else hi=mid-86400000;
 }
 return null;
}
