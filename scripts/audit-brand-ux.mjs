import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const output=resolve('artifacts/brand-ux');mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const issues=[],checks=[];
const routes=['/','/tools/tahajjud-time/','/tools/zakat-calculator/','/tools/hijri-converter/'];
const toRGB=v=>{const m=v.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);return m?[Number(m[1]),Number(m[2]),Number(m[3])]:null};
const luminance=c=>{const chan=c.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return chan[0]*.2126+chan[1]*.7152+chan[2]*.0722};
const contrast=(a,b)=>{const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05)};
try{
 for(const [viewport,w,h] of [['mobile',390,844],['desktop',1440,900]]){
  for(const mode of ['light','dark']){
   const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'reduce'});
   await context.addInitScript(theme=>{try{localStorage.setItem('sunnah-tools-theme',theme)}catch{}},mode);
   const page=await context.newPage();
   for(const route of routes){
    const response=await page.goto('http://127.0.0.1:4321'+route,{waitUntil:'domcontentloaded',timeout:35000});
    const metrics=await page.evaluate(()=>{
     const get=s=>document.querySelector(s),style=e=>getComputedStyle(e);
     const banner=get('.home-intro'),intro=get('.home-intro p'),results=get('.tool-inner .result'),resultText=results?.querySelector('strong');
     const img=get('.brand-symbol');
     return {theme:document.documentElement.dataset.theme,width:document.documentElement.scrollWidth,
      font:style(document.body).fontFamily,logo:!!img&&img.complete&&img.naturalWidth>0,
      heroHeight:banner?.getBoundingClientRect().height??null,
      introColor:intro?style(intro).color:null,heroBackground:banner?style(banner).backgroundColor:null,
      resultColor:resultText?style(resultText).color:null,resultBackground:results?style(results).backgroundColor:null,
      directoryBeforePromos:!!get('.directory')&&get('.directory').getBoundingClientRect().top<get('.promo-section').getBoundingClientRect().top,
      accordion:!!get('.tool-knowledge-area'),
      toggleLabel:get('#theme-toggle')?.getAttribute('aria-label')??null};
    });
    const label=viewport+'/'+mode+route;
    if(response?.status()!==200)issues.push(label+' HTTP '+response?.status());
    if(metrics.theme!==mode)issues.push(label+' wrong theme '+metrics.theme);
    if(metrics.width>w+4)issues.push(label+' horizontal overflow '+metrics.width+' > '+w);
    if(!metrics.logo)issues.push(label+' logo failed to render');
    if(!metrics.font.includes('IBM Plex Sans'))issues.push(label+' incorrect UI font '+metrics.font);
    if(route==='/'){
     const limit=viewport==='desktop'?158:210;
     if(!metrics.heroHeight||metrics.heroHeight>limit)issues.push(label+' hero too tall '+metrics.heroHeight);
     if(!metrics.directoryBeforePromos)issues.push(label+' tools not before promotional banners');
     if(metrics.heroBackground&&metrics.introColor){
      const a=toRGB(metrics.introColor),b=toRGB(metrics.heroBackground);
      if(a&&b&&contrast(a,b)<4.5)issues.push(label+' low hero text contrast '+contrast(a,b).toFixed(2));
     }
    }else{
     if(!metrics.accordion)issues.push(label+' knowledge accordions missing');
     if(metrics.resultColor&&metrics.resultBackground){
      const a=toRGB(metrics.resultColor),b=toRGB(metrics.resultBackground);
      if(a&&b&&contrast(a,b)<4.5)issues.push(label+' low result contrast '+contrast(a,b).toFixed(2));
     }
    }
    const name=route==='/'?'home':route.split('/').filter(Boolean).at(-1);
    await page.screenshot({path:resolve(output,viewport+'-'+mode+'-'+name+'.png'),animations:'disabled'});
    checks.push({viewport,mode,route,...metrics});
   }
   const expected=mode==='dark'?'light':'dark';
   await page.locator('#theme-toggle').click();
   await page.reload({waitUntil:'domcontentloaded'});
   const toggled=await page.evaluate(()=>({theme:document.documentElement.dataset.theme,stored:localStorage.getItem('sunnah-tools-theme')}));
   if(toggled.theme!==expected||toggled.stored!==expected)issues.push(viewport+'/'+mode+': theme toggle did not persist');
   await context.close();
  }
 }
}finally{await browser.close()}
writeFileSync(resolve(output,'report.json'),JSON.stringify({checks,issues},null,2));
console.log('Brand redesign Playwright audit: '+checks.length+' viewport/theme/page cases, '+issues.length+' failures.');
for(const issue of issues)console.error('BRAND-UX:',issue);
if(issues.length)process.exitCode=1;
