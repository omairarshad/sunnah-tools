import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADSENSE_SCOPE,findSunnahSite,siteStateLabel,makeAdsenseReportUrl,parseAdSenseReport,formatAdMoney,findPayments} from '../src/lib/adsenseReporting.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('AdSense uses a separate least-privilege OAuth scope and never enables ads',()=>{
 assert.equal(ADSENSE_SCOPE,'https://www.googleapis.com/auth/adsense.readonly');
 const script=read('src/scripts/adsenseDashboard.js');
 assert.match(script,/initTokenClient/);
 assert.match(script,/ADSENSE_SCOPE/);
 assert.match(script,/site\.state!=='READY'/);
 assert.match(script,/makeAdsenseReportUrl\(account\.name,site\.reportingDimensionId/);
 assert.doesNotMatch(script,/adsbygoogle|ADSENSE_ADS_ENABLED/);
 assert.match(read('src/pages/admin/index.astro'),/id="ops-adsense"/);
});
test('only sunnah.tools may be attributed revenue; prefer bare verified domain',()=>{
 const candidates=[
  {account:{name:'accounts/a'},site:{domain:'othersite.com',state:'READY'}},
  {account:{name:'accounts/b'},site:{domain:'www.sunnah.tools',state:'GETTING_READY'}},
  {account:{name:'accounts/b'},site:{domain:'sunnah.tools',state:'READY',reportingDimensionId:'1234'}}
 ];
 assert.deepEqual(findSunnahSite(candidates),candidates[2]);
 assert.equal(findSunnahSite(candidates.slice(0,1)),null);
 assert.equal(siteStateLabel('GETTING_READY'),'Getting ready');
 assert.throws(()=>findSunnahSite([candidates[2],candidates[2]]),/More than one/);
});
test('AdSense reporting requests filter by exact verified site ID',()=>{
 const u=new URL(makeAdsenseReportUrl('accounts/pub-123','SITE_123','LAST_30_DAYS',true));
 assert.equal(u.host,'adsense.googleapis.com');
 assert.equal(u.pathname,'/v2/accounts/pub-123/reports:generate');
 assert.equal(u.searchParams.get('filters'),'OWNED_SITE_ID==SITE_123');
 assert.equal(u.searchParams.get('dateRange'),'LAST_30_DAYS');
 assert.equal(u.searchParams.get('dimensions'),'DATE');
 assert.deepEqual(u.searchParams.getAll('metrics'),['ESTIMATED_EARNINGS']);
 assert.throws(()=>makeAdsenseReportUrl('accounts/../../other','site'),'Invalid AdSense');
});
test('site earnings parse from Google header names and are not guessed',()=>{
 const report={headers:[
  {name:'ESTIMATED_EARNINGS',currencyCode:'GBP',type:'METRIC_CURRENCY'},
  {name:'PAGE_VIEWS'}, {name:'IMPRESSIONS'},{name:'CLICKS'},
  {name:'PAGE_VIEWS_RPM'},{name:'IMPRESSIONS_CTR'}
 ],rows:[],totals:{cells:[{value:'1.23'},{value:'200'},{value:'75'},{value:'3'},{value:'6.15'},{value:'0.04'}]}};
 const out=parseAdSenseReport(report);
 assert.equal(out.currency,'GBP');
 assert.equal(out.summary.ESTIMATED_EARNINGS,1.23);
 assert.equal(out.summary.CLICKS,3);
 assert.equal(out.summary.IMPRESSIONS_CTR,.04);
 assert.equal(formatAdMoney(1.23,'GBP'),'£1.23');
 assert.equal(formatAdMoney(null,'GBP'),'—');
 const daily=parseAdSenseReport({headers:[{name:'DATE'},{name:'ESTIMATED_EARNINGS',currencyCode:'GBP'}],rows:[
  {cells:[{value:'2026-10-30'},{value:'0.45'}]},
  {cells:[{value:'2026-10-29'},{value:'0.1'}]}
 ]});
 assert.deepEqual(daily.timeline,[{date:'2026-10-29',value:.1},{date:'2026-10-30',value:.45}]);
 assert.equal(parseAdSenseReport({headers:[{name:'ESTIMATED_EARNINGS'}]}).summary.ESTIMATED_EARNINGS,null);
});
test('AdSense payments are account-level, not site earnings',()=>{
 const payments=findPayments({payments:[
  {name:'accounts/pub-123/payments/unpaid',amount:'£12.00'},
  {name:'accounts/pub-123/payments/2026-09-21',amount:'£101.00'},
  {name:'accounts/pub-123/payments/2026-08-21',amount:'£90.00'}
 ]});
 assert.deepEqual(payments,{unpaid:'£12.00',last:'£101.00'});
 assert.match(read('src/pages/admin/index.astro'),/account-wide, not sunnah.tools-only|entire accessible AdSense account/);
});
