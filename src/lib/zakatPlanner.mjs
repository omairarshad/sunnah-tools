import {GOLD_NISAB_GRAMS,SILVER_NISAB_GRAMS,nisabAmounts,zakatEstimate} from './calculations.mjs';

export const zakatFieldGroups=[
 {title:'Money and savings',fields:[
  {key:'cash',label:'Cash at home',help:'Banknotes and coins you own'},
  {key:'bank',label:'Bank accounts and savings',help:'Include qualifying balances in all accounts'},
  {key:'receivables',label:'Money owed to you',help:'Only amounts you have determined are recoverable and zakatable'}
 ]},
 {title:'Gold and silver holdings',fields:[
  {key:'goldHolding',label:'Gold',help:'Enter grams or qualifying value as selected below'},
  {key:'silverHolding',label:'Silver',help:'Enter grams or qualifying value as selected below'}
 ]},
 {title:'Investments and business',fields:[
  {key:'investments',label:'Eligible investment value',help:'Enter only the portion you have determined is zakatable'},
  {key:'trade',label:'Trading stock and business goods',help:'Enter eligible inventory value on the assessment date'},
  {key:'other',label:'Other eligible assets',help:'Only include assets that are zakatable under the approach you follow'}
 ]},
 {title:'Liabilities',fields:[
  {key:'debts',label:'Permitted debts due',help:'Deduct only qualifying debt amounts under your chosen guidance'},
  {key:'outgoings',label:'Other qualifying payments due',help:'Avoid automatically deducting all future living expenses or an entire mortgage'}
 ]}
];
export const ZAKAT_FIELD_KEYS=zakatFieldGroups.flatMap(g=>g.fields.map(f=>f.key));
const allKeys=[...ZAKAT_FIELD_KEYS,'goldPrice','silverPrice'];
const finiteNonNegative=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=1e12;
export function zakatPlan(values,{benchmark='silver',metalEntry='grams'}={}){
 if(!values||!['silver','gold'].includes(benchmark)||!['grams','value'].includes(metalEntry))return {error:'Choose a valid Nisab benchmark and valuation method.'};
 const amounts={};
 for(const key of allKeys){
  const raw=values[key]??'';
  if(typeof raw!=='string'&&typeof raw!=='number')return {error:'Enter valid non-negative amounts.'};
  const parsed=raw===''?0:Number(raw);
  if(!finiteNonNegative(parsed))return {error:'Enter valid non-negative figures. Large amounts require individual review.'};
  amounts[key]=parsed;
 }
 const price=benchmark==='gold'?amounts.goldPrice:amounts.silverPrice;
 if(price<=0)return {error:'Enter a current price per gram for the selected Nisab metal.'};
 if(metalEntry==='grams'&&((amounts.goldHolding>0&&amounts.goldPrice<=0)||(amounts.silverHolding>0&&amounts.silverPrice<=0))){
  return {error:'Enter a current per-gram price for each metal you are valuing by weight.'};
 }
 const goldValue=metalEntry==='grams'?amounts.goldHolding*amounts.goldPrice:amounts.goldHolding;
 const silverValue=metalEntry==='grams'?amounts.silverHolding*amounts.silverPrice:amounts.silverHolding;
 const groups={
  money:amounts.cash+amounts.bank+amounts.receivables,
  metals:goldValue+silverValue,
  investments:amounts.investments,
  business:amounts.trade,
  other:amounts.other
 };
 const assets=groups.money+groups.metals+groups.investments+groups.business+groups.other;
 const liabilities=amounts.debts+amounts.outgoings;
 if(!Number.isFinite(assets)||!Number.isFinite(liabilities))return {error:'The entered totals are too large to calculate.'};
 const thresholds=nisabAmounts(amounts.goldPrice,amounts.silverPrice);
 const threshold=thresholds[benchmark];
 const estimate=zakatEstimate({assets,debts:liabilities,threshold});
 if(!estimate)return {error:'Cannot calculate with these inputs.'};
 return {error:null,amounts,groups,assets,liabilities,net:estimate.net,thresholds,threshold,benchmark,metalEntry,
  eligible:estimate.eligible,estimate:estimate.amount,rate:0.025};
}
export function zakatSummaryText(plan,{currency='GBP',hawlConfirmed=false,example=false}={}){
 if(!plan||plan.error)throw new Error('Valid plan required');
 if(!/^[A-Z]{3}$/.test(currency))throw new Error('Invalid currency');
 const format=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(n);
 const items=[
  'Sunnah Tools — Zakat planning estimate',
  'All values entered by the user; prices are not live.',
  'Assessment currency: '+currency,
  'Nisab reference: '+plan.benchmark+' ('+(plan.benchmark==='gold'?GOLD_NISAB_GRAMS:SILVER_NISAB_GRAMS)+'g)',
  'Metal holdings entered as: '+(plan.metalEntry==='grams'?'weight (grams)':'eligible value'),
  'Cash, savings and receivables: '+format(plan.groups.money),
  'Gold and silver included: '+format(plan.groups.metals),
  'Eligible investments: '+format(plan.groups.investments),
  'Business/trading stock: '+format(plan.groups.business),
  'Other assets: '+format(plan.groups.other),
  'Gross qualifying assets: '+format(plan.assets),
  'Liabilities deducted as entered: '+format(plan.liabilities),
  'Net qualifying assets: '+format(plan.net),
  'Selected Nisab: '+format(plan.threshold),
  'At or above selected Nisab: '+(plan.eligible?'Yes':'No'),
  'Conditional Zakat estimate at 2.5%: '+format(plan.estimate),
  'Hawl reviewed by user: '+(hawlConfirmed?'Yes (self-confirmed)':'No'),
  example?'DEMONSTRATION VALUES ONLY. Not your own assessment.':'',
  'Not a ruling about debts, jewellery, pensions, shares, ownership or hawl. Check qualified guidance before payment.',
  'No details are saved by this calculator. This file is created only when downloaded.'
 ];
 return items.filter(Boolean).join('\n')+'\n';
}
