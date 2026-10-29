/** Conditional arithmetic only: never infer religious eligibility or an official local rate. */
const positiveRate=n=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=1000000;
const roundMoney=n=>Math.round((n+Number.EPSILON)*100)/100;

/** Each row represents one person's *already verified* Fidya-eligible days. */
export function fidyaGroupEstimate(daysByPerson,rate){
 if(!Array.isArray(daysByPerson)||daysByPerson.length<1||daysByPerson.length>12||!positiveRate(rate)||daysByPerson.some(n=>!Number.isSafeInteger(n)||n<0||n>3660))return null;
 const days=daysByPerson.reduce((a,b)=>a+b,0);
 if(days<1||days>10000)return null;
 const lineItems=daysByPerson.map((count,index)=>({person:index+1,days:count,subtotal:roundMoney(count*rate)}));
 return {days,people:daysByPerson.filter(n=>n>0).length,rate,lines:lineItems,total:roundMoney(days*rate)};
}

/** Distinct cases are hypothetical; qualified case assessment precedes any remedy. */
/** @param {{type?:string,remedy?:string,cases?:number,rate?:number}} options */
export function kaffarahIllustration({type='oath',remedy='feeding',cases=1,rate=undefined}={}){
 if(!['oath','ramadan'].includes(type)||!['feeding','clothing','fasting'].includes(remedy)||!Number.isSafeInteger(cases)||cases<1||cases>100||type==='ramadan'&&cases!==1||type==='ramadan'&&remedy==='clothing')return null;
 const people=remedy==='fasting'?0:(type==='oath'?10*cases:60);
 if(people&&rate!==undefined&&!positiveRate(rate))return null;
 return {type,remedy,cases,people,fastDays:type==='oath'&&remedy==='fasting'?3*cases:null,consecutiveLunarMonths:type==='ramadan'&&remedy==='fasting'?2:null,rate:people?rate:null,total:people&&rate!==undefined?roundMoney(people*rate):null};
}

export function givingSummary({title,currency,rows,disclaimer}){
 const safe=value=>String(value??'').replace(/[\r\n\t]/g,' ').slice(0,180);
 return [safe(title),'Illustrative figures only — not a payment instruction',...rows.map(row=>safe(row)),`Currency: ${safe(currency)}`,safe(disclaimer),'Generated locally; no financial inputs were uploaded.'].join('\n')+'\n';
}
