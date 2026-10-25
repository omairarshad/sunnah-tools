import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const root='http://127.0.0.1:4321';
mkdirSync('test-results/visual',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const desktop=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const page=await desktop.newPage();
 await page.goto(root+'/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.tool-card').count(),22,'Homepage should expose 22 tools');
 assert.equal(await page.locator('.tool-card-visual img').count(),22,'Every tool should have a large illustration');
 const artPaths=await page.locator('.tool-card-visual img').evaluateAll(images=>images.map(img=>new URL(img.src).pathname));
 assert.equal(new Set(artPaths).size,22,'Each card must have an original unique illustration');
 for(const img of await page.locator('.tool-card-visual img').all()){
  await img.scrollIntoViewIfNeeded();
  await img.evaluate(image=>image.decode());
 }
 assert.ok(await page.locator('.tool-card-visual img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>=500&&img.naturalHeight>=300&&img.alt.length>15)),'All 22 image assets must load at full resolution with accessible descriptions');
 const layout=await page.locator('.tool-card').first().evaluate(card=>{
  const picture=card.querySelector('.tool-card-visual').getBoundingClientRect();
  const heading=card.querySelector('h3').getBoundingClientRect();
  const caption=card.querySelector('.tool-card-description').getBoundingClientRect();
  return {imageHeight:picture.height,imageBottom:picture.bottom,headingTop:heading.top,captionTop:caption.top};
 });
 assert.ok(layout.imageHeight>=205&&layout.headingTop>layout.imageBottom&&layout.captionTop>layout.headingTop,'Large gallery images must sit clearly above titles and descriptions');
 const galleryMetrics=await page.locator('.tool-card').first().evaluate(card=>{
  const cardBox=card.getBoundingClientRect(), visual=card.querySelector('.tool-card-visual').getBoundingClientRect();
  const img=card.querySelector('.tool-card-visual img');
  const styles=getComputedStyle(img);
  return {ratio:visual.height/cardBox.height,width:visual.width,imageFit:styles.objectFit};
 });
 assert.ok(galleryMetrics.ratio>.52,'Artwork should occupy most of every tool card, not be a small icon');
 assert.equal(galleryMetrics.imageFit,'contain','Artwork should not be cropped');
 const columns=async()=>page.locator('#tool-grid').evaluate(grid=>getComputedStyle(grid).gridTemplateColumns.trim().split(/\\s+/).length);
 assert.equal(await columns(),4,'Wide desktop should show four image-first tool cards per row');
 for(const [width,expected] of [[1000,3],[800,2],[500,1]]){
   await page.setViewportSize({width,height:1000});
   assert.equal(await columns(),expected,`Tool card layout should be ${expected} column(s) at ${width}px`);
 }
 await page.setViewportSize({width:1440,height:1000});

 assert.ok(await page.locator('.brand-symbol').evaluate(img=>img.complete && img.naturalWidth>0),'New branded header emblem must load');
 assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'),'/favicon.svg','Brand favicon must be linked');
 const homeColors=await page.evaluate(()=>({
  card:getComputedStyle(document.querySelector('.tool-card')).backgroundColor,
  body:getComputedStyle(document.body).backgroundColor,
  hero:getComputedStyle(document.querySelector('.home-intro')).backgroundImage
 }));
 assert.equal(homeColors.card,'rgb(255, 255, 255)','Homepage cards should be white, not pastel');
 assert.ok(homeColors.hero.includes('gradient'),'Homepage introduction should use the richer hero gradient');

 assert.ok(new Set(await page.locator('.tool-card').evaluateAll(elements=>elements.map(el=>el.getAttribute('data-tone')))).size>=6,'Tool cards should have multiple accent colours');
 assert.equal(await page.locator('.featured-card').count(),0,'Redundant Start here links must be removed');
 assert.equal(await page.getByRole('heading',{name:'Start here'}).count(),0,'Start here section must be gone');
 assert.equal(await page.locator('.promo-banner').count(),3,'Three full-image external banner links should be visible');
 assert.equal(await page.locator('.promo-banner-featured').count(),1,'Arabic learning banner should occupy the featured wide slot');
 assert.equal(await page.locator('.promo-banner img').count(),3,'Each promotion must contain branded artwork');
 assert.ok(await page.locator('.promo-banner img').evaluateAll(images=>images.every(img=>img.complete && img.naturalWidth>0)),'All self-hosted promotional images must load');
 assert.equal(await page.locator('.promo-banner').first().getAttribute('data-tone'),'blue','Arabic Alphabet card should lead with blue learning accent');
 assert.match(await page.locator('.promo-banner').first().innerText(),/flashcards/i,'Arabic learning description should mention flashcards');
 assert.equal(await page.locator('a[data-promo-id="arabic-alphabet"]').getAttribute('href'),'https://www.arabicalphabet.app/');
 assert.equal(await page.locator('a[data-promo-id="islamreact"]').getAttribute('href'),'https://www.youtube.com/@IslamReact');
 assert.equal(await page.locator('a[data-promo-id="meemandmoon"]').getAttribute('href'),'https://meemandmoon.com/');
 assert.equal(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count(),0,'GA4 should never load before setup');

 assert.equal(await page.locator('script[src*=adsbygoogle]').count(),0,'Unconfigured AdSense must not load');
 assert.equal(await page.locator('.ad-placement').count(),0,'No blank ad container before activation');
 await page.screenshot({path:'test-results/visual/home-desktop.png',fullPage:true});
 await page.locator('.filter[data-filter="zakat"]').click();
 assert.equal(await page.locator('.tool-card:visible').count(),4,'Zakat category should show 4 tools');
 await page.locator('.filter[data-filter="all"]').click();
 await page.locator('#tool-search-input').fill('qibla');
 assert.equal(await page.locator('.tool-card:visible').count(),1,'Search should narrow tools');
 await page.locator('#tool-search-input').fill('');
 await page.locator('[data-favorite="prayer-times"]').click();
 await page.locator('.filter[data-filter="saved"]').click();
 assert.equal(await page.locator('.tool-card:visible').count(),1,'Saved category should show favourited tool');
 await page.reload({waitUntil:'networkidle'});
 await page.locator('.filter[data-filter="saved"]').click();
 assert.equal(await page.locator('.tool-card:visible').count(),1,'Favourite should survive reload');
 await page.goto(root+'/tools/ramadan-countdown/',{waitUntil:'networkidle'});
 const colors=await page.evaluate(()=>({
  panel:getComputedStyle(document.querySelector('.tool-panel')).backgroundColor,
  result:getComputedStyle(document.querySelector('.result')).backgroundImage,
  warn:getComputedStyle(document.querySelector('.warn')).backgroundColor
 }));
 assert.equal(colors.panel,'rgb(255, 255, 255)','Calculator panel should be clean white');
 assert.ok(colors.result.includes('gradient'),'Ramadan countdown result should use dark, high-contrast gradient');
 assert.notEqual(colors.warn,'rgb(255, 237, 243)','Warnings must not use pink pastel');
 await page.screenshot({path:'test-results/visual/ramadan-countdown-premium.png',fullPage:true});
 await page.goto(root+'/tools/hijri-converter/',{waitUntil:'networkidle'});
 const date=await page.locator('input[type=date]').first().inputValue();
 const expected=await page.evaluate(()=>{const d=new Date();const n=(x)=>String(x).padStart(2,'0');return d.getFullYear()+'-'+n(d.getMonth()+1)+'-'+n(d.getDate())});
 assert.equal(date,expected,'Hijri converter must auto-fill today');
 await page.screenshot({path:'test-results/visual/hijri-desktop.png',fullPage:true});
 await page.goto(root+'/tools/prayer-times/',{waitUntil:'networkidle'});
 await page.locator('#city-lookup').fill('London');
 await page.locator('.city-results button').first().waitFor({state:'visible',timeout:20000});
 await page.locator('.city-results button').first().click();
 assert.match(await page.locator('.tool-inner').innerText(),/Selected: London/i,'City search selection should update coordinates');
 await page.screenshot({path:'test-results/visual/prayer-desktop.png',fullPage:true});
 await page.goto(root+'/tools/fitrana-calculator/',{waitUntil:'networkidle'});
 await page.getByLabel('Verified rate per person').fill('7');
 await page.getByLabel('People in household').fill('4');
 assert.match(await page.locator('.result').innerText(),/28\.00/,'Fitrana calculations should update');
 await page.screenshot({path:'test-results/visual/fitrana-desktop.png',fullPage:true});
 await page.goto(root+'/tools/ramadan-timetable/',{waitUntil:'networkidle'});
 await page.getByLabel('Timetable length').selectOption('29');
 assert.equal(await page.locator('.tool-inner tbody tr').count(),29,'29-day Ramadan setting controls row count');
 await page.getByLabel('Timetable length').selectOption('30');
 assert.equal(await page.locator('.tool-inner tbody tr').count(),30,'30-day Ramadan setting controls row count');
 assert.ok(await page.getByRole('button',{name:'Download CSV'}).isEnabled(),'CSV download is enabled');
 await page.screenshot({path:'test-results/visual/ramadan-desktop.png',fullPage:true});
 await page.goto(root+'/tools/white-days-calendar/',{waitUntil:'networkidle'});
 assert.ok(await page.getByText('White Days', {exact:false}).first().isVisible(),'White Days page visible');
 await page.goto(root+'/tools/printable-hijri-calendar/',{waitUntil:'networkidle'});
 assert.ok(await page.locator('.hijri-calendar-grid .calendar-cell').count()>=29,'Calendar month should be populated');
 await page.screenshot({path:'test-results/visual/hijri-calendar-desktop.png',fullPage:true});
 await page.goto(root+'/tools/umrah-packing-checklist/',{waitUntil:'networkidle'});
 assert.ok(await page.locator('.pack-group input[type=checkbox]').count()>=10,'Packing items should exist');
 await page.locator('.pack-group input[type=checkbox]').first().check();
 assert.match(await page.locator('.batch-tool .result').innerText(),/1 \/ 20/,'Checklist progresses after ticking');
 await page.goto(root+'/tools/prayer-times-widget/',{waitUntil:'networkidle'});
 assert.ok(await page.locator('.widget-preview iframe').isVisible(),'Embed preview iframe visible');
 await page.locator('.widget-preview iframe').contentFrame().locator('.embed-prayers').waitFor({state:'visible',timeout:15000});
 await page.screenshot({path:'test-results/visual/prayer-widget-desktop.png',fullPage:true});
 await page.goto(root+'/admin/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Admin hub must not be indexed');
 assert.ok(await page.getByRole('link',{name:'Open Pages CMS'}).count()>=1,'Admin should link to authenticated CMS');
 assert.ok(await page.getByText('Awaiting measurement ID and activation').count()>=1,'Admin shows accurate analytics setup state');
 await page.screenshot({path:'test-results/visual/admin-portal-desktop.png',fullPage:true});
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const m=await mobile.newPage();
 await m.goto(root+'/',{waitUntil:'networkidle'});
 const dimensions=await m.evaluate(()=>({body:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
 assert.ok(dimensions.body<=dimensions.width+2,'Mobile layout overflows horizontally: '+JSON.stringify(dimensions));
 assert.equal(await m.locator('.tool-card').count(),22);
 assert.equal(await m.locator('.tool-card-visual img').count(),22,'Mobile cards should retain all artwork');
 const mobileWidth=await m.locator('.tool-card').first().evaluate(card=>({card:card.getBoundingClientRect().width,picture:card.querySelector('.tool-card-visual').getBoundingClientRect().height}));
 assert.ok(mobileWidth.card>320&&mobileWidth.picture>165,'Mobile illustration must remain large and distinguishable');

 await m.screenshot({path:'test-results/visual/home-mobile.png',fullPage:true});
 await m.goto(root+'/',{waitUntil:'networkidle'});
 assert.equal(await m.locator('.promo-banner').count(),3,'All three promotional banners remain on mobile');
 assert.ok(await m.locator('.promo-banner').evaluateAll(els=>els.every(el=>{const r=el.getBoundingClientRect();return r.width>0 && r.left>=-2 && r.right<=innerWidth+2})),'No promotional banner should overflow mobile viewport');
 await m.goto(root+'/tools/zakat-calculator/',{waitUntil:'networkidle'});
 assert.ok(await m.locator('.tool-panel').isVisible(),'Mobile tool panel must be visible');
 await m.screenshot({path:'test-results/visual/zakat-mobile.png',fullPage:true});
 await mobile.close();await desktop.close();
 console.log('Visual smoke PASS: desktop/mobile layout, filters, saved tools, Hijri default, city selection, 7 screenshots');
}finally{await browser.close()}
