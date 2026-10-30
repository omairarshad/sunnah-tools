import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const dir=resolve('artifacts/reporting-dashboard');mkdirSync(dir,{recursive:true});
const issues=[],checks=[];
const row=(d,m)=>({dimensionValues:d.map(value=>({value:String(value)})),metricValues:m.map(value=>({value:String(value)}))});
const sample={reports:[
 {rows:[row([],['14','19','42','75'])]},{rows:[row(['20261029'],['14','42'])]},
 {rows:[row(['/tools/prayer-times/'],['21','8'])]},{rows:[row(['Organic Search'],['12'])]},
 {rows:[row(['page_view'],['42'])]},{rows:[row(['United Kingdom'],['14'])]}
]};
try{
 for(const [mode,width,height] of [['mobile',390,844],['desktop',1440,900]]){
  for(const theme of ['light','dark']){
   const tag=mode+'/'+theme;
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
   await ctx.addInitScript(t=>{localStorage.setItem('sunnah-tools-theme',t)},theme);
   const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://accounts.google.com/gsi/client',route=>route.fulfill({
    status:200,contentType:'application/javascript',
    body:"window.google={accounts:{oauth2:{initTokenClient:function(options){return {requestAccessToken:function(){window.__testAuthCalls=(window.__testAuthCalls||0)+1;options.callback({access_token:'test_token_only',expires_in:3600,scope:'https://www.googleapis.com/auth/analytics.readonly'})}}}}}};"
   }));
   let requests=0,liveRequests=0,validRequest=true,lastRange='';
   await page.route('https://analyticsdata.googleapis.com/v1beta/properties/123456789:runRealtimeReport',route=>{
    liveRequests++;
    const body=JSON.parse(route.request().postData()||'{}');
    if(body.metrics?.[0]?.name!=='activeUsers'||body.metrics?.[1]?.name!=='eventCount'||body.minuteRanges?.[0]?.startMinutesAgo!==29)validRequest=false;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({rows:[row([],['4','13'])]})});
   });
   await page.route('https://analyticsdata.googleapis.com/v1beta/properties/123456789:batchRunReports',async route=>{
    requests++;
    const request=route.request(),body=JSON.parse(request.postData()||'{}');
    lastRange=body.requests?.[0]?.dateRanges?.[0]?.startDate||'';
    const secondBatch=body.requests?.length===1;
    if(request.headers().authorization!=='Bearer test_token_only'||![1,5].includes(body.requests?.length))validRequest=false;
    if(secondBatch&&body.requests[0]?.dimensions?.[0]?.name!=='country')validRequest=false;
    if(!secondBatch&&body.requests?.[0]?.metrics?.[0]?.name!=='activeUsers')validRequest=false;
    const reports=secondBatch?sample.reports.slice(5):sample.reports.slice(0,5);
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({reports})});
   });
   const response=await page.goto('http://127.0.0.1:4321/admin/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!document.getElementById('ops-connect')?.disabled,{timeout:12000});
   if(response.status()!==200)issues.push(tag+' bad HTTP');
   if(!(await page.content()).includes('noindex,nofollow'))issues.push(tag+' public index risk');
   await page.screenshot({path:resolve(dir,mode+'-'+theme+'-setup.png'),animations:'disabled'});
   await page.getByRole('button',{name:'Connect Google Analytics'}).click();
   await page.waitForFunction(()=>document.getElementById('ops-users')?.textContent==='14',{timeout:12000});
   if(requests!==2||liveRequests!==1||!validRequest)issues.push(tag+' broken 5+1 batch or realtime report request');
   if(await page.locator('#ops-live-users').textContent()!=='4')issues.push(tag+' missing realtime users');
   if(await page.locator('#ops-live-events').textContent()!=='13')issues.push(tag+' missing realtime events');
   if(!await page.evaluate(()=>sessionStorage.getItem('sunnah-ga4-dashboard-token-v1')))issues.push(tag+' missing tab session');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.getElementById('ops-users')?.textContent==='14',{timeout:12000});
   if(await page.evaluate(()=>window.__testAuthCalls||0)!==0)issues.push(tag+' reload unexpectedly required Google login');
   if(requests!==4||liveRequests!==2)issues.push(tag+' refresh did not restore reports');
   if(await page.locator('#ops-sessions').textContent()!=='19')issues.push(tag+' incorrect metric');
   if(!(await page.locator('#ops-pages').textContent()).includes('/tools/prayer-times/'))issues.push(tag+' missing top page');
   const w=await page.evaluate(()=>document.documentElement.scrollWidth);
   if(w>width+4)issues.push(tag+' horizontal overflow '+w+' > '+width);
   await page.screenshot({path:resolve(dir,mode+'-'+theme+'-report.png'),animations:'disabled'});
   await page.locator('#ops-period').selectOption('7');
   await page.waitForFunction(()=>document.getElementById('ops-status')?.textContent?.includes('Verified GA4 report'));
   if(lastRange!=='6daysAgo')issues.push(tag+' date range wrong '+lastRange);
   if(requests!==6)issues.push(tag+' expected two batches per date range');
   // Ensure real Google validation errors are displayed, not hidden behind generic HTTP 400.
   await page.route('https://analyticsdata.googleapis.com/v1beta/properties/123456789:batchRunReports',route=>route.fulfill({
    status:400,contentType:'application/json',
    body:JSON.stringify({error:{code:400,message:'Mock GA4 invalid report request'}})
   }));
   await page.getByRole('button',{name:'Refresh data'}).click();
   await page.waitForFunction(()=>document.getElementById('ops-status')?.textContent?.includes('Mock GA4 invalid report request'),{timeout:12000});
   if(!await page.locator('#ops-data').isHidden())issues.push(tag+' stale data visible after API error');
   await page.getByRole('button',{name:'Disconnect'}).click();
   if(!await page.locator('#ops-data').isHidden())issues.push(tag+' data still shown after disconnect');
   if(await page.evaluate(()=>sessionStorage.getItem('sunnah-ga4-dashboard-token-v1')))issues.push(tag+' token remains after disconnect');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!document.getElementById('ops-connect')?.disabled,{timeout:12000});
   if(await page.locator('#ops-connect').isHidden())issues.push(tag+' disconnect failed to clear reload session');
   if(errors.length)issues.push(tag+' JS errors '+errors.join('; '));
   checks.push({mode,theme,requests,validRequest});await ctx.close();
  }
 }
}finally{await browser.close()}
writeFileSync(resolve(dir,'results.json'),JSON.stringify({checks,issues},null,2));
console.log('GA4 dashboard Playwright (mock Google only): '+checks.length+' cases, '+issues.length+' issues');
for(const issue of issues)console.error('REPORTING-ISSUE:',issue);
if(issues.length)process.exitCode=1;
