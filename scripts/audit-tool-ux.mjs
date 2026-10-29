import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const slugs=[...readFileSync('src/data/tools.ts','utf8').matchAll(/slug:'([a-z0-9-]+)'/g)].map(m=>m[1]);
if(slugs.length!==37)throw new Error('Expected 37 tool pages');
const output=resolve('artifacts/tool-ux');mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[],issues=[];
try{
 for(const [mode,width,height] of [['mobile',390,844],['desktop',1440,900]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const slug of slugs){
   const errors=[];const capture=e=>errors.push(e.message);
   page.on('pageerror',capture);
   const response=await page.goto('http://127.0.0.1:4321/tools/'+slug+'/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>document.querySelector('.tool-knowledge-area')?.dataset.accordionsReady==='true',null,{timeout:12000});
   const layout=await page.evaluate(()=>{
    const area=document.querySelector('.tool-knowledge-area'),chapters=[...area.querySelectorAll('section > details.tool-guide-fold')];
    const tool=document.querySelector('.tool-panel');
    return {chapters:chapters.length,openInitially:chapters.filter(d=>d.open).length,
     hasToolbar:!!document.querySelector('.tool-guide-controls'),
     toolBeforeGuide:!!tool&&tool.getBoundingClientRect().top<area.getBoundingClientRect().top,
     documentWidth:document.documentElement.scrollWidth};
   });
   const contextName=mode+'/'+slug;
   if(response?.status()!==200)issues.push(contextName+' HTTP '+response?.status());
   if(!layout.hasToolbar||layout.chapters<3)issues.push(contextName+' missing chapter controls '+layout.chapters);
   if(layout.openInitially!==0)issues.push(contextName+' chapters are not collapsed');
   if(!layout.toolBeforeGuide)issues.push(contextName+' calculator order incorrect');
   if(layout.documentWidth>width+4)issues.push(contextName+' horizontal overflow '+layout.documentWidth+' > '+width);
   if(errors.length)issues.push(contextName+' JS error: '+errors.join('; ').slice(0,250));
   if(['tahajjud-time','zakat-calculator','ramadan-timetable','halal-additives-checker'].includes(slug)){
    await page.locator('.tool-guide-controls').scrollIntoViewIfNeeded();
    await page.screenshot({path:resolve(output,mode+'-'+slug+'-collapsed.png'),animations:'disabled'});
    const first=page.locator('.tool-knowledge-area .tool-guide-fold').first();
    await first.locator('summary').click();
    if(!await first.evaluate(d=>d.open))issues.push(contextName+' summary click failed');
    await page.screenshot({path:resolve(output,mode+'-'+slug+'-expanded.png'),animations:'disabled'});
    await page.getByRole('button',{name:'Expand all'}).click();
    if(!await page.locator('.tool-main details.tool-guide-fold').evaluateAll(ds=>ds.every(d=>d.open)))issues.push(contextName+' expand all failed');
    await page.getByRole('button',{name:'Collapse all'}).click();
    if(!await page.locator('.tool-main details.tool-guide-fold').evaluateAll(ds=>ds.every(d=>!d.open)))issues.push(contextName+' collapse all failed');
    const anchor=await page.locator('.tool-knowledge-area section.tool-guide-fold-section[id]').first().getAttribute('id');
    await page.goto('http://127.0.0.1:4321/tools/'+slug+'/#'+anchor,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(id=>document.getElementById(id)?.querySelector(':scope > details.tool-guide-fold')?.open,anchor,{timeout:12000});
    await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
    if(!await page.locator('.tool-main details.tool-guide-fold').evaluateAll(ds=>ds.every(d=>d.open)))issues.push(contextName+' print expansion failed');
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
   }
   report.push({slug,mode,http:response?.status(),...layout,errors});
   page.off('pageerror',capture);
  }
  await context.close();
 }
}finally{await browser.close()}
writeFileSync(resolve(output,'report.json'),JSON.stringify({count:report.length,issues,report},null,2));
console.log('Playwright tool UX audit: '+report.length+' page/viewport cases, '+issues.length+' issues.');
for(const issue of issues)console.error('UX-ISSUE: '+issue);
if(issues.length)process.exitCode=1;
