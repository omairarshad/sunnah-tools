/** Read-only, single-site AdSense reporting helpers. Never aggregate across accounts. */
export const ADSENSE_SCOPE='https://www.googleapis.com/auth/adsense.readonly';
export const ADSENSE_ORIGIN='https://adsense.googleapis.com/v2';
export const SITE_DOMAIN='sunnah.tools';
export const AD_METRICS=['ESTIMATED_EARNINGS','PAGE_VIEWS','IMPRESSIONS','CLICKS','PAGE_VIEWS_RPM','IMPRESSIONS_CTR'];

export function findSunnahSite(candidates){
 const matches=(Array.isArray(candidates)?candidates:[]).filter(entry=>{
  const name=String(entry.site?.domain||'').toLowerCase().replace(/^www\./,'');
  return name===SITE_DOMAIN;
 });
 if(!matches.length)return null;
 if(matches.length===1)return matches[0];
 const preferred=matches.filter(entry=>entry.site.domain===SITE_DOMAIN);
 if(preferred.length===1)return preferred[0];
 throw new Error('More than one matching AdSense site was found. Check your AdSense account before displaying revenue.');
}
export function siteStateLabel(state){
 return ({READY:'Ready',GETTING_READY:'Getting ready',REQUIRES_REVIEW:'Requires review',NEEDS_ATTENTION:'Needs attention'})[state]||'Unknown';
}
export function makeAdsenseReportUrl(accountName,siteId,dateRange='LAST_30_DAYS',daily=false){
 if(!/^accounts\/[A-Za-z0-9_-]+$/.test(accountName)||!siteId||!['TODAY','YESTERDAY','MONTH_TO_DATE','LAST_30_DAYS'].includes(dateRange))throw new Error('Invalid AdSense site reporting inputs');
 const url=new URL(ADSENSE_ORIGIN+'/'+accountName+'/reports:generate');
 url.searchParams.set('dateRange',dateRange);
 url.searchParams.set('filters','OWNED_SITE_ID=='+siteId);
 if(daily)url.searchParams.append('dimensions','DATE');
 for(const metric of daily?['ESTIMATED_EARNINGS']:AD_METRICS)url.searchParams.append('metrics',metric);
 if(daily)url.searchParams.set('orderBy','+DATE');
 return url.toString();
}
export function parseAdSenseReport(report){
 if(!Array.isArray(report?.headers))throw new Error('AdSense returned an unexpected report format.');
 const index=name=>report.headers.findIndex(h=>h.name===name);
 const value=(row,name)=>{
  const n=index(name);if(n<0)return null;
  const cell=row?.cells?.[n]?.value;
  if(cell===undefined||cell===null||cell==='')return null;
  const parsed=Number(cell);return Number.isFinite(parsed)?parsed:null;
 };
 const moneyHeader=report.headers.find(h=>h.name==='ESTIMATED_EARNINGS');
 const currency=typeof moneyHeader?.currencyCode==='string'&&/^[A-Z]{3}$/.test(moneyHeader.currencyCode)?moneyHeader.currencyCode:null;
 const row=report.totals||report.rows?.[0]||null;
 const summary=Object.fromEntries(AD_METRICS.map(metric=>[metric,value(row,metric)]));
 const timeline=(Array.isArray(report.rows)?report.rows:[]).map(r=>{
  const i=index('DATE'),date=i>=0?String(r.cells?.[i]?.value||''):'';
  return {date,value:value(r,'ESTIMATED_EARNINGS')};
 }).filter(item=>/^\d{4}-\d{2}-\d{2}$/.test(item.date)&&item.value!==null).sort((a,b)=>a.date.localeCompare(b.date));
 return {summary,timeline,currency,warnings:Array.isArray(report.warnings)?report.warnings:[]};
}
export function formatAdMoney(value,currency){
 if(value===null||!currency)return '—';
 try{return new Intl.NumberFormat('en-GB',{style:'currency',currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value)}catch{return '—'}
}
export function findPayments(data){
 const all=Array.isArray(data?.payments)?data.payments:[];
 const unpaid=all.find(p=>/\/payments\/unpaid$/.test(p.name||''))?.amount||null;
 const paid=all.filter(p=>/\/payments\/\d{4}-\d{2}-\d{2}$/.test(p.name||'')).sort((a,b)=>String(b.name).localeCompare(String(a.name)));
 return {unpaid,last:paid[0]?.amount||null};
}
