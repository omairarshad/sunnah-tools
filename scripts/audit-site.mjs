import {readFileSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
const toolSource=readFileSync(resolve('src/data/tools.ts'),'utf8');
const slugs=[...toolSource.matchAll(/slug:'([a-z0-9-]+)'/g)].map(m=>m[1]);
const read=path=>readFileSync(resolve('dist',path),'utf8');
const newSlugs=['laylatul-qadr-nights','fidya-calculator','qada-prayer-calculator','qurbani-share-calculator','kaffarah-calculator','tawaf-sai-counter'];
const assert=(test,msg)=>{if(!test)throw new Error('Site audit failed: '+msg)};
assert(slugs.length===28,'Expected 28 Islamic tools after release');
for(const item of newSlugs)assert(slugs.includes(item),'New tool missing from registry: '+item);
const home=read('index.html');
assert(home.includes('id="tool-search-input"'),'Homepage search is missing');
assert(home.includes('id="tool-grid"'),'Homepage directory grid missing');
assert(home.includes('id="theme-toggle"')&&home.includes('aria-pressed="false"'),'Accessible theme toggle missing on homepage');
assert(home.includes('sunnah-tools-theme')&&home.includes('prefers-color-scheme: dark'),'Theme preference bootstrap missing');
assert(!home.includes('featured-grid'),'Redundant Start here cards must be removed');
assert(!home.includes('id="featured-title"'),'Start here section heading must be removed');
assert((home.match(/class="promo-banner/g)||[]).length>=3,'Three branded image banners missing');
for(const asset of ['arabic-alphabet.svg','islamreact.svg','meemandmoon.svg']){
 const data=read('media/brands/'+asset);
 assert(data.includes('<svg')&&data.includes('</svg>'),'Invalid SVG image '+asset);
 assert(home.includes('/media/brands/'+asset),'Image not included on homepage: '+asset);
}
assert(home.includes('loading="eager"'),'Featured learning image should load eagerly');
assert(home.includes('https://www.arabicalphabet.app/'),'Arabic learning promo missing');
assert(home.includes('https://www.youtube.com/@IslamReact'),'IslamReact channel link missing');
assert(home.includes('https://meemandmoon.com/'),'Meem & Moon promo missing');
assert(home.includes('data-promo-id="arabic-alphabet"'),'Arabic promo event instrumentation missing');
assert(home.includes('data-filter="saved"'),'Saved tools category unavailable');
assert(!home.includes('class="hero"'),'Oversized old hero unexpectedly restored');
const header=(html)=>html.includes('class="site-header"')&&html.includes('class="site-footer"');
assert(header(home),'Shared site navigation and footer missing');
assert(home.includes('aria-label="Main navigation"'),'Main navigation lacks label');
assert(home.includes('brand-mark.svg'),'Updated premium header emblem missing');
assert(home.includes('brand-wordmark'),'New logo wordmark missing');
const mark=read('brand-mark.svg');
const favicon=read('favicon.svg');
assert(mark.includes('viewBox="0 0 64 64"')&&mark.includes('#D5AD68'),'Scalable gold emblem missing');
assert(favicon.includes('#102F28'),'Favicon must match forest green brand');
const theme=readFileSync(resolve('src/styles/premium.css'),'utf8');
assert(theme.includes('.tool-inner .result')&&theme.includes('.tool-card[data-tone]'),'Palette does not cover cards and calculator results');
assert(theme.includes('@media print'),'Print view override missing');
const darkTheme=readFileSync(resolve('src/styles/dark.css'),'utf8');
for(const essential of ['html[data-theme="dark"] body','html[data-theme="dark"] .tool-inner input','html[data-theme="dark"] .directory .tool-card','html[data-theme="dark"] .faq-detail','html[data-theme="dark"] .analytics-consent','@media print']){
 assert(darkTheme.includes(essential),'Dark theme missing a critical surface: '+essential);
}
assert(home.includes('href="https://sunnah.tools/"'),'Home canonical URL missing');
assert(home.includes('/guides/prayer-time-methods/'),'Contextual prayer method guide missing');
assert(home.includes('/guides/ramadan-dates-and-timetables/'),'Contextual Ramadan guide missing');
if(process.env.PUBLIC_ADSENSE_ADS_ENABLED!=='true')assert(!home.includes('pagead2.googlesyndication.com'),'Ads must not load when not enabled');
const sitemap=read('sitemap-0.xml');
assert((home.match(/class="directory-topic-heading"/g)||[]).length===5,'Homepage should explain five major tool topics');
assert((home.match(/class="tool-card-visual"/g)||[]).length===slugs.length,'Every card must show a large illustration');
for(const slug of slugs){
 const art=read('tool-art/'+slug+'.svg');
 assert(art.includes('<svg')&&art.includes('</svg>'),'Missing or invalid original SVG: '+slug);
 assert(art.includes('viewBox="0 0 600 360"'),'Illustration aspect ratio missing: '+slug);
 assert(art.includes('low-poly illustration')&&((art.match(/<polygon/g)||[]).length>=10),'Low-poly geometric scene not found: '+slug);
 assert(!/NaN|Infinity|undefined/.test(art),'Malformed SVG polygon coordinates: '+slug);
 assert(!/<script|https?:\/\//i.test(art.replace('http://www.w3.org/2000/svg','')),'Remote dependency or script in artwork: '+slug);
 assert(home.includes('/tool-art/'+slug+'.svg'),'Homepage card illustration missing: '+slug);
}
assert((home.match(/class="tool-card-description"/g)||[]).length===slugs.length,'Readable descriptions missing under illustrations');
for(const slug of slugs){
 const path=`tools/${slug}/index.html`;
 const html=read(path);
 assert(statSync(resolve('dist',path)).size>1000,`Tool page is empty: ${slug}`);
 assert(header(html),`Shared chrome missing: ${slug}`);
 assert(html.includes('id="theme-toggle"'),`Theme toggle missing on tool page: ${slug}`);
 assert(html.includes('class="tool-panel"'),`Interactive panel missing: ${slug}`);
 assert(html.includes('class="tool-disclaimer"'),`Method disclaimer missing: ${slug}`);
 assert(html.includes('class="tool-aside"'),`Related tools sidebar missing: ${slug}`);
 assert(html.includes(`https://sunnah.tools/tools/${slug}/`),`Canonical missing: ${slug}`);
 assert(sitemap.includes(`/tools/${slug}/`),`Sitemap missing: ${slug}`);
 assert((html.match(/class="faq-detail"/g)||[]).length>=3,`Three visible FAQs missing: ${slug}`);
 assert(html.includes('"@type":"FAQPage"')&&html.includes('"@type":"WebApplication"')&&html.includes('"@type":"BreadcrumbList"'),`Schema markup incomplete: ${slug}`);
 assert(html.includes('related-guide-list'),`Contextual related guides missing: ${slug}`);
 assert(html.includes('seo-explainer')&&html.includes('Important limitations'),`Unique explanation missing: ${slug}`);
 assert(html.includes('meta name="description"'),`SEO meta description missing: ${slug}`);
 assert(!html.includes('<title>'+slug+' | Sunnah Tools</title>'),`Generic metadata found: ${slug}`);
}
for(const slug of newSlugs){const html=read(`tools/${slug}/index.html`);assert(html.includes('source-note'),`New tool needs a religious source: ${slug}`);assert(html.includes('Calculation method and accuracy')&&html.includes('Important limitations'),`New tool lacks accuracy notes: ${slug}`);}
assert(read('guides/prayer-time-methods/index.html').includes('How are Islamic prayer times calculated?'),'Prayer method guide missing');
assert(read('guides/ramadan-dates-and-timetables/index.html').includes('Planning a reliable Ramadan timetable'),'Ramadan guide missing');
assert(sitemap.includes('/guides/prayer-time-methods/'),'Methodology guide missing from sitemap');
assert(sitemap.includes('/guides/ramadan-dates-and-timetables/'),'Ramadan guide missing from sitemap');
for(const guide of ['hijri-calendar-and-moon-sighting','zakat-nisab-and-fitrana','using-islamic-planning-tools']){
 assert(read('guides/'+guide+'/index.html').includes('editorial-guide'),`Guide page missing: ${guide}`);
 assert(sitemap.includes('/guides/'+guide+'/'),`Guide missing from sitemap: ${guide}`);
}
assert(read('tools/hijri-converter/index.html').includes('today-hijri-value'),'Current Hijri date answer missing');
assert(read('tools/hijri-converter/index.html').includes('HTML snapshot for'),'Calculated Hijri date must be present in static HTML');
assert(read('admin/index.html').includes('noindex,nofollow'),'Admin shell must be noindexed');
assert(read('admin/index.html').includes('Open Pages CMS'),'CMS launch portal missing');
assert(!sitemap.includes('/admin/'),'Admin route must be excluded from sitemap');
if(process.env.PUBLIC_GA4_ENABLED!=='true')assert(!home.includes('googletagmanager.com/gtag/js'),'GA4 must remain off without owner configuration');
assert(read('robots.txt').includes('sitemap-index.xml'),'Robots sitemap reference missing');
assert(read('sitemap-index.xml').includes('sitemap-0.xml'),'Sitemap index child missing');
console.log(`Static UX/SEO audit passed: homepage, ${slugs.length} tool routes, responsive shell and sitemap`);
