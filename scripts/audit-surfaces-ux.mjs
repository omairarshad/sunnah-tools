import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const slugs=[...readFileSync('src/data/tools.ts','utf8').matchAll(/slug:'([a-z0-9-]+)'/g)].map(m=>m[1]);
if(slugs.length!==37)throw new Error('Expected exactly 37 tool pages; got '+slugs.length);
const root=resolve('artifacts/surface-ux');mkdirSync(root,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const issues=[],results=[];
const samples=new Set(['prayer-times','zakat-calculator','quran-juz-finder','islamic-events-calendar','tahajjud-time','hijri-converter','umrah-packing-checklist']);
function rgb(v){let m=String(v).match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);return m?[+m[1],+m[2],+m[3]]:null}
function lum(v){return v.map(x=>{const y=x/255;return y<=.04045?y/12.92:((y+.055)/1.055)**2.4}).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0)}
function ratio(a,b){const [u,v]=[lum(a),lum(b)].sort((x,y)=>y-x);return (u+.05)/(v+.05)}
try{
 for(const [viewport,width,height] of [['mobile',390,844],['desktop',1440,900]]){
  for(const theme of ['light','dark']){
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
   await ctx.addInitScript(t=>{try{localStorage.setItem('sunnah-tools-theme',t)}catch{}},theme);
   const page=await ctx.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const slug of slugs){
    errors.length=0;
    const res=await page.goto('http://127.0.0.1:4321/tools/'+slug+'/',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>document.querySelector('.tool-inner')?.childElementCount>0,{timeout:14000});
    await page.waitForFunction(()=>document.querySelector('.tool-knowledge-area')?.dataset.accordionsReady==='true',{timeout:12000});
    const m=await page.evaluate(()=>{
     const get=s=>document.querySelector(s),s=e=>e?getComputedStyle(e):null;
     const panel=get('.tool-panel'),aside=get('.tool-aside'),guide=get('.tool-guide-controls'),results=get('.tool-inner .prayers, .tool-inner .result, .tool-inner .fasting-deep-stats, .tool-inner .fasting-deep-breakdown');
     const strong=results?.querySelector('strong, b, output');
     const input=get('.tool-inner input:not([type=checkbox]):not([type=radio]),.tool-inner select');
     const style=el=>el?s(el):null;
     return {
      theme:document.documentElement.dataset.theme,overflow:document.documentElement.scrollWidth,
      panelBackground:style(panel)?.backgroundColor,panelBorder:style(panel)?.borderTopWidth,
      asideBackground:style(aside)?.backgroundColor,asideBorder:style(aside)?.borderTopWidth,
      guideBackground:style(guide)?.backgroundColor,
      resultBackground:style(results)?.backgroundColor??null,
      resultForeground:style(strong)?.color??null,
      fieldBackground:style(input)?.backgroundColor??null,
      fieldBorder:style(input)?.borderTopColor??null,
      bodyBackground:style(document.body).backgroundColor,
      guideCount:get('.tool-knowledge-area')?.querySelectorAll('details.tool-guide-fold').length??0,
      hasCalculator:!!panel&&!!get('.tool-inner').textContent.trim(),
      hasAside:!!aside
     };
    });
    const tag=viewport+'/'+theme+'/'+slug;
    if(res?.status()!==200)issues.push(tag+': HTTP '+res?.status());
    if(m.theme!==theme)issues.push(tag+': wrong theme '+m.theme);
    if(m.overflow>width+4)issues.push(tag+': overflow '+m.overflow+' > '+width);
    if(!m.hasCalculator||!m.hasAside||m.guideCount<3)issues.push(tag+': missing work, related or guide region');
    if(m.panelBorder!=='0px'||m.asideBorder!=='0px')issues.push(tag+': bordered work/sidebar '+m.panelBorder+'/'+m.asideBorder);
    if(m.panelBackground===m.bodyBackground)issues.push(tag+': work surface blends into canvas');
    if(m.panelBackground===m.guideBackground)issues.push(tag+': guide navigation blends into working surface');
    if(m.resultBackground){
     if(m.resultBackground===m.panelBackground)issues.push(tag+': output blends into working surface');
     if(m.resultForeground){
      const a=rgb(m.resultBackground),b=rgb(m.resultForeground);
      if(a&&b&&ratio(a,b)<4.5)issues.push(tag+': output contrast '+ratio(a,b).toFixed(2));
     }
    }
    if(m.fieldBackground&&m.resultBackground===m.fieldBackground)issues.push(tag+': inputs and output look identical');
    if(errors.length)issues.push(tag+': script error '+errors.join('; ').slice(0,180));
    if(samples.has(slug)){
     await page.screenshot({path:resolve(root,viewport+'-'+theme+'-'+slug+'.png'),animations:'disabled',fullPage:false});
    }
    results.push({viewport,theme,slug,...m});
   }
   await ctx.close();
  }
 }
}finally{await browser.close()}
writeFileSync(resolve(root,'report.json'),JSON.stringify({cases:results.length,issues,results},null,2));
console.log('All-tool surface hierarchy: '+results.length+' page/theme/viewport cases; '+issues.length+' issues.');
for(const issue of issues)console.error('SURFACE-UX:',issue);
if(issues.length)process.exitCode=1;
