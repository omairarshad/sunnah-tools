import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reportingSettings,makeGA4Reports,parseGA4Response} from '../src/lib/reportingConfig.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('GA4 report connection accepts only numeric property and OAuth web client',()=>{
 assert.deepEqual(reportingSettings(),{propertyId:null,oauthClientId:null});
 assert.equal(reportingSettings({propertyId:'123456789',oauthClientId:'123456789012-abc123abc123abc123abc123abc.apps.googleusercontent.com'}).propertyId,'123456789');
 assert.equal(reportingSettings({propertyId:'123456789',oauthClientId:'123456789012-abc123abc123abc123abc123abc.apps.googleusercontent.com'}).oauthClientId,'123456789012-abc123abc123abc123abc123abc.apps.googleusercontent.com');
 for(const id of ['G-ABC12345','../../123456','0','12345678901234567890'])assert.equal(reportingSettings({propertyId:id}).propertyId,null);
 for(const client of ['https://evil.com','abc','secret.apps.googleusercontent.com'])assert.equal(reportingSettings({oauthClientId:client}).oauthClientId,null);
});
test('GA4 Data API requests cover real KPIs, daily traffic, pages, channels, countries and events',()=>{
 for(const days of [7,28,90]){
  const report=makeGA4Reports(days);
  assert.equal(report.requests.length,6);
  assert.equal(report.requests[0].dateRanges[0].startDate,(days-1)+'daysAgo');
  assert.deepEqual(report.requests[0].metrics.map(x=>x.name),['activeUsers','sessions','screenPageViews','eventCount']);
  assert.equal(report.requests[1].dimensions[0].name,'date');
  assert.equal(report.requests[2].dimensions[0].name,'pagePath');
  assert.equal(report.requests[3].dimensions[0].name,'sessionDefaultChannelGroup');
  assert.equal(report.requests[4].dimensions[0].name,'eventName');
  assert.equal(report.requests[5].dimensions[0].name,'country');
 }
});
test('GA4 report parser uses true API values and treats absent rows as empty',()=>{
 const row=(dims,metrics)=>({dimensionValues:dims.map(value=>({value:String(value)})),metricValues:metrics.map(value=>({value:String(value)}))});
 const data={reports:[
  {rows:[row([],['12','18','45','100'])]},
  {rows:[row(['20261029'],['12','45'])]},
  {rows:[row(['/tools/zakat-calculator/'],['19','6'])]},
  {rows:[row(['Organic Search'],['11'])]},
  {rows:[row(['page_view'],['45'])]},
  {rows:[row(['United Kingdom'],['12'])]}
 ]};
 const out=parseGA4Response(data);
 assert.deepEqual(out.kpis,{users:12,sessions:18,views:45,events:100});
 assert.equal(out.pages[0].name,'/tools/zakat-calculator/');
 assert.equal(out.channels[0].value,11);
 assert.equal(out.countries[0].value,12);
 assert.deepEqual(parseGA4Response({reports:Array.from({length:6},()=>({}))}).pages,[]);
 assert.throws(()=>parseGA4Response({reports:[]}),/unexpected report format/);
});
test('owner dashboard never pretends to report metrics before Google authentication',()=>{
 const admin=read('src/pages/admin/index.astro'),script=read('src/scripts/ga4Dashboard.js');
 assert.match(admin,/data-property-id=\{siteReporting.propertyId\?\?''\}/);
 assert.match(admin,/data-client-id=\{siteReporting.oauthClientId\?\?''\}/);
 assert.match(admin,/No visitor or revenue figures are fabricated/);
 assert.match(script,/https:\/\/analyticsdata.googleapis.com\/v1beta\/properties\//);
 assert.match(script,/https:\/\/www.googleapis.com\/auth\/analytics.readonly/);
 assert.match(script,/response\.access_token/);
 assert.doesNotMatch(script,/localStorage|sessionStorage/);
 assert.match(script,/textContent=item.name/);
 assert.match(script,/Disconnect/);
});
test('site does not enable ads until explicit site Ready status plus certified CMP readiness',()=>{
 const site=read('src/lib/siteAds.ts'),config=read('src/lib/adsConfig.mjs'),workflow=read('.github/workflows/publish-hostinger.yml');
 assert.match(site,/PUBLIC_ADSENSE_SITE_READY/);
 assert.match(config,/siteReady==='true'/);
 assert.match(workflow,/vars.ADSENSE_SITE_READY/);
 assert.match(workflow,/vars.GA4_PROPERTY_ID/);
 assert.match(workflow,/vars.GOOGLE_OAUTH_CLIENT_ID/);
});
test('optional analytics uses basic consent mode v2 and never loads before opt in',()=>{
 const script=read('src/components/AnalyticsConsent.astro');
 for(const parameter of ['analytics_storage','ad_storage','ad_user_data','ad_personalization'])assert.match(script,new RegExp(parameter));
 assert.ok(script.indexOf("gtag('consent','default'")<script.indexOf("tag.src='https://www.googletagmanager.com"));
 assert.match(script,/if\(choice==='yes'\)loadAnalytics\(\)/);
 assert.match(script,/window.location.reload\(\)/);
 assert.doesNotMatch(script,/favorite_toggle/);
});
