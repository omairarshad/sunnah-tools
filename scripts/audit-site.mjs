import {readFileSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
const toolSource=readFileSync(resolve('src/data/tools.ts'),'utf8');
const slugs=[...toolSource.matchAll(/slug:'([a-z0-9-]+)'/g)].map(m=>m[1]);
const read=path=>readFileSync(resolve('dist',path),'utf8');
const latestSunnahTools=['hijama-date-planner','duha-prayer-time','istikhara-guide','friday-sunnah-checklist','islamic-will-planner','aqiqah-planner','sunnah-fasting-planner'];
const newSlugs=['laylatul-qadr-nights','fidya-calculator','qada-prayer-calculator','qurbani-share-calculator','kaffarah-calculator','tawaf-sai-counter','prayer-rakats-chart','daily-adhkar','halal-additives-checker','zakat-anniversary-calculator','dhul-hijjah-planner','travel-prayer-guide','quran-juz-finder','zakat-stocks-crypto','hifz-tracker'];
const assert=(test,msg)=>{if(!test)throw new Error('Site audit failed: '+msg)};
assert(slugs.length===44,'Expected 44 Islamic tools after release');
for(const item of [...newSlugs,...latestSunnahTools])assert(slugs.includes(item),'New tool missing from registry: '+item);
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
assert(home.includes('id="useful-islamic-websites"'),'Useful Islamic websites section missing');
assert(!home.includes('quranenc.com')&&!home.includes('seekersguidance.org'),'Excluded resource links must not appear');
for(const slug of latestSunnahTools){assert(home.includes('href="/tools/'+slug+'/"'),'New tool directory link missing: '+slug);assert(read('tool-art/'+slug+'.svg').includes('<svg'),'Low-poly tool artwork missing: '+slug)}
for(const target of ['https://quran.com/','https://sunnah.com/','https://corpus.quran.com/','https://umrah.nusuk.sa/'])assert(home.includes(target),'Curated useful link missing: '+target);
assert(!home.includes('data-filter="saved"')&&!home.includes('data-favorite=')&&!home.includes('sunnah-favorite-tools-v1'),'Obsolete favourites interface or state remains');
assert(home.includes('id="recent-section"')&&home.includes('id="recent-links"'),'Recently opened links must be retained');
assert(home.includes('id="tool-search-input"')&&home.includes('data-filter="prayer"'),'Search and category filters should remain');
assert(!home.includes('class="hero"'),'Oversized old hero unexpectedly restored');
const header=(html)=>html.includes('class="site-header"')&&html.includes('class="site-footer"');
assert(header(home),'Shared site navigation and footer missing');
assert(home.includes('aria-label="Main navigation"'),'Main navigation lacks label');
assert(home.includes('brand-mark.svg'),'Updated premium header emblem missing');
assert(home.includes('brand-wordmark'),'New logo wordmark missing');
const mark=read('brand-mark.svg');
const favicon=read('favicon.svg');
assert(mark.includes('viewBox="0 0 64 64"')&&mark.includes('#194D3F')&&mark.includes('#B17E43'),'Original scalable directional logo missing');
assert(favicon.includes('#194D3F')&&favicon.includes('#F4F1E9'),'Favicon must match the directional brand');
assert(home.includes('class="intro-index"')&&!home.includes('class="intro-ornament"'),'Homepage compact brand index must replace the old crescent ornament');
const homeConfig=JSON.parse(readFileSync(resolve('src/data/homepage.json'),'utf8'));
assert(homeConfig.layout.sectionOrder[0]==='promotions'&&homeConfig.layout.sectionOrder[1]==='directory','Our other projects must appear directly after the intro and before the tool directory');
const identityCSS=readFileSync(resolve('src/styles/identity-2026.css'),'utf8');
for(const essential of ['.home-intro','html[data-theme="dark"] .home-intro','.tool-inner .result','.tool-guide-fold','@media(max-width:530px)'])assert(identityCSS.includes(essential),'Editorial identity system missing '+essential);
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
assert((home.match(/class="directory-topic-heading"/g)||[]).length===6,'Homepage should display six distinct tool topics');
for(const heading of ['Hajj &amp; Umrah','Qur’an, dhikr &amp; everyday life'])assert(home.includes(heading),'Expected separate topic heading: '+heading);
for(const slug of ['umrah-packing-checklist','tawaf-sai-counter']){
 const cardTags=home.match(/<article\b[^>]*>/g)||[];
 const tag=cardTags.find(x=>x.includes('data-slug="'+slug+'"'));
 assert(tag&&tag.includes('data-topic="pilgrimage"')&&/data-category="[^"]*hajj[^"]*umrah"/.test(tag),'Pilgrimage grouping or filter missing: '+slug);
}
assert(/data-filter="[^"]*hajj[^"]*umrah"/.test(home),'Pilgrimage filter missing');
assert(!home.includes('Hajj, Umrah &amp; worship'),'Old mixed topic heading remains');
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
 const guidanceOK=slug==='tahajjud-time'
  ?html.includes('What to check')&&html.includes('Tahajjud prayer: a practical guide')&&html.includes('id="tahajjud-how-to-pray"')
  :html.includes('What to check')&&html.includes('How it works');
 assert(guidanceOK,`Tool guidance missing: ${slug}`);
 assert(html.includes('class="tool-aside"'),`Related tools sidebar missing: ${slug}`);
 assert(html.includes(`https://sunnah.tools/tools/${slug}/`),`Canonical missing: ${slug}`);
 assert(sitemap.includes(`/tools/${slug}/`),`Sitemap missing: ${slug}`);
 assert((html.match(/class="faq-detail"/g)||[]).length>=3,`Three visible FAQs missing: ${slug}`);
 assert(html.includes('"@type":"FAQPage"')&&html.includes('"@type":"WebApplication"')&&html.includes('"@type":"BreadcrumbList"'),`Schema markup incomplete: ${slug}`);
 assert(html.includes('related-guide-list'),`Contextual related guides missing: ${slug}`);
 assert(html.includes('seo-explainer')&&html.includes('What to check'),`Unique explanation missing: ${slug}`);
 assert(html.includes('meta name="description"'),`SEO meta description missing: ${slug}`);
 assert(!html.includes('<title>'+slug+' | Sunnah Tools</title>'),`Generic metadata found: ${slug}`);
}
for(const slug of newSlugs){const html=read(`tools/${slug}/index.html`);assert(html.includes('source-note'),`New tool needs a religious source: ${slug}`);assert(html.includes('How it works')&&html.includes('What to check'),`New tool lacks accuracy notes: ${slug}`);}
assert(read('guides/prayer-time-methods/index.html').includes('How are Islamic prayer times calculated?'),'Prayer method guide missing');
assert(read('guides/ramadan-dates-and-timetables/index.html').includes('Planning a reliable Ramadan timetable'),'Ramadan guide missing');
assert(sitemap.includes('/guides/prayer-time-methods/'),'Methodology guide missing from sitemap');
assert(sitemap.includes('/guides/ramadan-dates-and-timetables/'),'Ramadan guide missing from sitemap');
for(const guide of ['hijri-calendar-and-moon-sighting','zakat-nisab-and-fitrana','using-islamic-planning-tools']){
 assert(read('guides/'+guide+'/index.html').includes('editorial-guide'),`Guide page missing: ${guide}`);
 assert(sitemap.includes('/guides/'+guide+'/'),`Guide missing from sitemap: ${guide}`);
}
assert(read('tools/hijri-converter/index.html').includes('today-hijri-value'),'Current Hijri date answer missing');
assert(read('tools/hijri-converter/index.html').includes('Calculated for'),'Calculated Hijri date must be present in static HTML');
const typeLab=read('font-lab/index.html');
assert(typeLab.includes('noindex,nofollow'),'Typography comparison must be noindexed');
assert(typeLab.includes('font-preview=petrona-karla')&&typeLab.includes('font-preview=alegreya-family')&&typeLab.includes('font-preview=eczar-plex'),'Three typography previews must be linked');
assert(!sitemap.includes('/font-lab/'),'Typography comparison must not be indexed');
assert(read('font-preview.css').includes('data-font-preview'),'Font overlay missing');
assert(home.includes('fonts.googleapis.com/css2?family=Karla'),'Default Google Fonts stylesheet missing');
assert(home.includes('Petrona'),'Petrona font loading missing');
assert(read('privacy/index.html').includes('Website typography (Google Fonts)'),'Google Fonts disclosure missing');
assert(read('admin/index.html').includes('noindex,nofollow'),'Admin shell must be noindexed');
assert(read('admin/index.html').includes('Connect Google Analytics')&&read('admin/index.html').includes('ops-users')&&read('admin/index.html').includes('ops-pages'),'Real GA4 reporting dashboard missing');
assert(read('admin/index.html').includes('Homepage editor'),'GitHub-authenticated homepage editor link missing');
assert(read('admin/index.html').includes('https://www.google.com/adsense/'),'Owner AdSense reporting link missing');
assert(!sitemap.includes('/admin/'),'Admin route must be excluded from sitemap');
if(process.env.PUBLIC_GA4_ENABLED!=='true')assert(!home.includes('googletagmanager.com/gtag/js'),'GA4 must remain off without owner configuration');
assert(read('robots.txt').includes('sitemap-index.xml'),'Robots sitemap reference missing');
assert(read('sitemap-index.xml').includes('sitemap-0.xml'),'Sitemap index child missing');
console.log(`Static UX/SEO audit passed: homepage, ${slugs.length} tool routes, responsive shell and sitemap`);

const cityPaths=["london","birmingham","manchester","bradford","leicester","leeds","newcastle","glasgow","edinburgh","cardiff","makkah","karachi","dubai","toronto","new-york"];
for(const slug of cityPaths){
 const p='prayer-times/'+slug+'/index.html';
 const html=read(p);
 assert(html.includes('Prayer times in ')&&html.includes('city-prayer-page'),'City prayer page missing or unhelpful: '+slug);
 assert(html.includes('method')&&html.includes('Fajr')&&html.includes('Maghrib'),'City-specific calculator missing: '+slug);
 assert(sitemap.includes('/prayer-times/'+slug+'/'),'City sitemap missing: '+slug);
}
assert(sitemap.includes('/prayer-times/'),'City index missing from sitemap');
console.log('Verified '+cityPaths.length+' location-specific prayer pages');

const publisher='ca-pub-4083891573415148';
assert(home.includes('name="google-adsense-account" content="'+publisher+'"'),'Google AdSense ownership meta tag missing');
assert(read('ads.txt').trim()==='google.com, pub-4083891573415148, DIRECT, f08c47fec0942fa0','AdSense seller authorisation file incorrect');
assert(read('tools/prayer-times/index.html').includes('name="google-adsense-account" content="'+publisher+'"'),'AdSense ownership proof not present in shared site layout');
assert(!home.includes('ca-pub-5803311676381609')&&!read('ads.txt').includes('pub-5803311676381609'),'Retired duplicate-account publisher must not appear in published verification');
if(process.env.PUBLIC_ADSENSE_ADS_ENABLED!=='true')assert(!home.includes('adsbygoogle.js'),'Ownership verification must not load ads script before approval');
console.log('AdSense site ownership verified in output; advertising remains independently gated');

// Every tool receives an original practical example as part of its educational text.
for(const slug of slugs){
 const content=read('tools/'+slug+'/index.html');
 assert(content.includes('tool-practical-tip')&&content.includes('Example:'),'Original example missing on '+slug);
}
assert(read('tools/tahajjud-time/index.html').includes('Sahih al-Bukhari 1145'),'Tahajjud source reference missing');
console.log('All 37 tool pages include original comparison-led practical notes');

// The Tahajjud page includes an indexable, source-linked guide, not only a client-rendered calculator.
{
 const html=read('tools/tahajjud-time/index.html');
 for(const required of ['Tahajjud prayer: a practical guide','How to pray Tahajjud, step by step','Duas you can make during the night','Quran 2:201','Quran 3:8','Quran 21:87','Quran 20:114','Sahih al-Bukhari 1137','Sahih Muslim 755b','tahajjud-arabic','id="tahajjud-duas"']){
  assert(html.includes(required),'Tahajjud guide missing source or section: '+required);
 }
 assert((html.match(/class="tahajjud-dua"/g)||[]).length===4,'Four Quranic duas must be rendered in HTML');
}

// Static knowledge base for the site's primary prayer-time utility.
{
 const content=read('tools/prayer-times/index.html');
 for(const phrase of ['Understanding the five daily prayer times','When does each prayer begin and end?','Standard and Hanafi Asr','UK summer, Scotland','How to compare your mosque','Sahih Muslim 612a','Quran 4:103','id="prayer-high-latitude"','id="prayer-methods-explained"'])
  assert(content.includes(phrase),'Prayer Times knowledge base missing '+phrase);
 assert((content.match(/class="prayer-knowledge-section/g)||[]).length>=6,'Prayer Times guide is incomplete');
}

{
 const html=read('tools/qibla-finder/index.html');
 for(const text of ['How to find the Qibla direction accurately','How to use your Qibla bearing','Find Qibla without a phone compass','True north versus magnetic north','How the Qibla direction is calculated','Accuracy, phone sensors and common problems','Quran 2:144','NOAA magnetic declination','id="qibla-true-magnetic"','id="qibla-accuracy"'])assert(html.includes(text),'Qibla guide missing '+text);
 assert((html.match(/class="prayer-knowledge-section"/g)||[]).length>=6,'Qibla guide is incomplete');
}

// Zakat guide must be visible to search engines without activating the calculator.
{
 const html=read('tools/zakat-calculator/index.html');
 for(const phrase of ['How to calculate Zakat on savings, gold and other wealth','How to calculate Zakat, step by step','What are Nisab and hawl?','Which assets count towards Zakat?','Worked Zakat example','Debts, pensions, stocks and common complications','Quran 9:60','id="zakat-nisab-guide"','id="zakat-assets-guide"']){
  assert(html.includes(phrase),'Comprehensive Zakat guide missing '+phrase);
 }
 assert((html.match(/class="zakat-guide-section"/g)||[]).length>=7,'Comprehensive Zakat guide sections missing');
}

// Three reference guides must be readable and attributable in static HTML before React loads.
const deepDives=[
 ['ramadan-countdown',['When does Ramadan start? A complete countdown','Does Ramadan start at midnight, sunset or Fajr?','Why is the expected first day of Ramadan uncertain?','Worked example: first fast on 8 February 2027','Sahih al-Bukhari 1909','Quran 2:187','id="countdown-meaning"','id="countdown-example"']],
 ['laylatul-qadr-nights',['Laylatul Qadr: the last ten nights','29-day versus a 30-day Ramadan','Authentic Laylatul Qadr dua','Sahih al-Bukhari 2017','Sahih al-Bukhari 2021','Jami at-Tirmidhi 3513','id="qadr-dua"','id="qadr-count"']],
 ['white-days-calendar',['White Days fasting calendar: 13, 14 and 15','why are they called White Days?','White Days during Ramadan and the days of Tashreeq','Sunan Abi Dawud 2449','Sahih Muslim 1160','Sahih Muslim 1141a','id="white-exceptions"','id="white-example"']]
];
for(const [slug,required] of deepDives){
 const html=read(`tools/${slug}/index.html`);
 for(const phrase of required)assert(html.includes(phrase),`${slug} knowledge base lacks: ${phrase}`);
 assert((html.match(/class="three-tool-section/g)||[]).length>=7,`Insufficient crawlable knowledge sections for ${slug}`);
 assert(html.includes('"@type":"Article"')&&html.includes('"citation":['),`Article sources not included as structured data for ${slug}`);
 assert(html.includes('class="three-tool-nav'),`Quick navigation missing for ${slug}`);
 assert(sitemap.includes(`/tools/${slug}/`),`Search sitemap omits ${slug}`);
}
console.log('Three Ramadan-season guides include static deep dives, references, FAQ and Article schema');

// The next three must likewise offer indexable, source-aligned knowledge bases without React hydration.
const qadaFidyaKaffarah=[
 ['fasting-tracker',['Fasting tracker and Qada fasts: complete planning','What is Qada fasting','Worked example: tracking twelve make-up fasts','Sahih al-Bukhari 1950','Quran 2:185','id="fasting-history-qada"','id="fasting-history-example"']],
 ['fidya-calculator',['Fidya for missed Ramadan fasts: eligibility, calculation','Who may owe Fidya','Worked Fidya example: two people, ten eligible days','Sahih al-Bukhari 4505','Quran 2:184','id="fidya-who"','id="fidya-example"']],
 ['kaffarah-calculator',['Kaffarah calculator guide: broken oaths','Kaffarah for breaking an oath','Kaffarah for a specific Ramadan fast violation','Sahih al-Bukhari 1936','Quran 5:89','id="kaffarah-oaths"','id="kaffarah-ramadan"']]
];
for(const [slug,required] of qadaFidyaKaffarah){
 const html=read(`tools/${slug}/index.html`);
 for(const phrase of required)assert(html.includes(phrase),`${slug} comprehensive guide lacks: ${phrase}`);
 assert((html.match(/class="three-tool-section/g)||[]).length>=7,`Incomplete server-rendered reference sections: ${slug}`);
 assert(html.includes('"@type":"Article"')&&html.includes('"citation":['),`Missing visible-reference-aligned Article schema: ${slug}`);
 assert(html.includes('class="three-tool-nav'),`Quick links missing: ${slug}`);
 assert(sitemap.includes(`/tools/${slug}/`),`Missing sitemap entry: ${slug}`);
}
console.log('Three further fasting-related guides include full static sources, FAQs, examples and Article schema');

// Zakat-and-Fitrana batch: require real crawlable content, source trail and schema.
const givingGuides=[
 ['fitrana-calculator',['Fitrana calculator and Zakat al-Fitr: complete household guide','Worked example: Fitrana for a family of four','Sahih al-Bukhari 1503','id="fitrana-example"','id="fitrana-sources"']],
 ['gold-zakat-calculator',['Gold Zakat calculator: purity, jewellery, Nisab and a complete guide','Worked example: mixed 22k and 18k gold','Sahih al-Bukhari 1405','id="gold-example"','id="gold-sources"']],
 ['nisab-calculator',['Nisab calculator: gold versus silver thresholds, hawl and complete guide','Worked example: a household','Sahih al-Bukhari 1405','id="nisab-example"','id="nisab-sources"']]
];
for(const [slug,phrases] of givingGuides){
 const html=read('tools/'+slug+'/index.html');
 for(const phrase of phrases)assert(html.includes(phrase),'Missing source-backed deep-dive content: '+slug+' / '+phrase);
 assert((html.match(/class="three-tool-section/g)||[]).length>=8,'Insufficient static guide sections: '+slug);
 assert(html.includes('"@type":"Article"')&&html.includes('"citation":['),'Missing Article citations: '+slug);
 assert(sitemap.includes('/tools/'+slug+'/'),'Missing sitemap route: '+slug);
}
console.log('Fitrana, Gold Zakat and Nisab have full static guides and source-aligned Article schema');

// Three additional deep dives must be indexable without React hydration.
const nextGivingGuides=[
 ['zakat-anniversary-calculator',['Zakat anniversary calculator: hawl, lunar-year dates and complete guide','Worked example: why a lunar-year anniversary moves earlier','Sunan Abi Dawud 1573','id="hawl-example"','id="hawl-sources"']],
 ['zakat-stocks-crypto',['Zakat on stocks, shares and cryptocurrency: full calculation guide','Worked example: trading shares, long-term shares and crypto','25% proxy','id="invest-example"','id="invest-sources"']],
 ['qurbani-share-calculator',['Qurbani share calculator: cow, camel, sheep and complete Udhiyah guide','Worked Qurbani example: three of seven shares','Sahih Muslim 1318a','id="qurbani-example"','id="qurbani-sources"']]
];
for(const [slug,phrases] of nextGivingGuides){
 const html=read('tools/'+slug+'/index.html');
 for(const phrase of phrases)assert(html.includes(phrase),'Missing sourced reference guide: '+slug+' / '+phrase);
 assert((html.match(/class="three-tool-section/g)||[]).length>=8,'Guide lacks substantial static sections: '+slug);
 assert(html.includes('"@type":"Article"')&&html.includes('"citation":['),'Article schema missing citations: '+slug);
 assert(sitemap.includes('/tools/'+slug+'/'),'Missing sitemap entry for '+slug);
}
console.log('Zakat anniversary, investment Zakat and Qurbani guides include full static content and Article citations');

// Five prayer-related guide pages: no JS needed to read the knowledge base.
const prayerFiveGuides=[
 ['prayer-times-widget','Prayer times widget: complete embed guide','id="widget-deep-example"','id="widget-deep-sources"'],
 ['printable-prayer-chart','Printable Salah chart: free 7, 14 and 30-day','id="chart-deep-example"','id="chart-deep-sources"'],
 ['salah-tracker','Daily Salah tracker: complete private','id="salah-deep-example"','id="salah-deep-sources"'],
 ['qada-prayer-calculator','Missed Salah Qada calculator: comprehensive','id="qada-deep-example"','id="qada-deep-sources"'],
 ['prayer-rakats-chart','How many rakats in each prayer?','id="rakats-deep-example"','id="rakats-deep-sources"']
];
for(const [slug,title,example,sources] of prayerFiveGuides){
 const html=read('tools/'+slug+'/index.html');
 for(const required of [title,example,sources,'class="three-tool-nav','"@type":"Article"','"citation":[','Frequently asked questions'])assert(html.includes(required),'Prayer deep dive missing: '+slug+' / '+required);
 assert((html.match(/class="three-tool-section/g)||[]).length>=9,'Insufficient prayer guide sections: '+slug);
 assert(sitemap.includes('/tools/'+slug+'/'),'Prayer tool absent from sitemap: '+slug);
}
console.log('Five comprehensive prayer guides, worked examples, FAQ and aligned schema in server HTML');

// All five Quran, remembrance and Islamic age guides must render in static HTML.
const fiveNextGuides=[
 ['quran-juz-finder','Quran Juz Finder: all 30 Juz','id="juz-guide-example"','id="juz-guide-sources"'],
 ['hifz-tracker','Quran Hifz Tracker: memorisation','id="hifz-guide-example"','id="hifz-guide-sources"'],
 ['daily-adhkar','Daily Adhkar and Quranic Duas: a complete','id="adhkar-guide-example"','id="adhkar-guide-sources"'],
 ['tasbih-counter','Online Tasbih Counter: 33/33/34','id="tasbih-guide-example"','id="tasbih-guide-sources"'],
 ['islamic-age','Islamic Age Calculator: complete Hijri','id="age-guide-example"','id="age-guide-sources"']
];
for(const [slug,title,example,sources] of fiveNextGuides){
 const html=read('tools/'+slug+'/index.html');
 for(const phrase of [title,example,sources,'class="three-tool-nav','Frequently asked questions','"@type":"Article"','"citation":['])assert(html.includes(phrase),'Deep guide missing: '+slug+' / '+phrase);
 assert((html.match(/class="three-tool-section/g)||[]).length>=9,'Insufficient static sections for '+slug);
 assert(sitemap.includes('/tools/'+slug+'/'),'Missing sitemap route '+slug);
}
console.log('Five Quran, remembrance and Islamic age guides rendered with source-aligned Article schema');


// Fasting Times source-backed guide must be static and independently indexable.
{
 const html=read('tools/fasting-times/index.html');
 for(const required of ['Suhoor and Iftar: a complete daily fasting guide','When should you stop eating Suhoor: Imsak or Fajr?','When does Iftar start','Fasting duas and recommended remembrance','Why fasting times differ','Sahih al-Bukhari 1923','Sahih al-Bukhari 1957','Sunan Abi Dawud 2357','Quran 2:187','id="fasting-imsak"','id="fasting-duas"']){
  assert(html.includes(required),'Comprehensive fasting guide missing '+required);
 }
 assert((html.match(/class="fasting-guide-section"/g)||[]).length>=7,'Comprehensive fasting guide is incomplete');
}

// Hijri Converter guide must be indexable and separate calculated calendars from moon sighting.
{
 const html=read('tools/hijri-converter/index.html');
 for(const required of ['Hijri date conversion: a complete practical guide','Umm al-Qura versus civil','Does the Hijri date change at midnight or sunset?','The twelve Hijri months','Worked conversion example','Quran 2:189','Sahih al-Bukhari 1909','Unicode CLDR calendar identifiers','id="hijri-calendars"','id="hijri-sunset"','id="hijri-sources"']){
  assert(html.includes(required),'Hijri knowledge base missing '+required);
 }
 assert((html.match(/class="hijri-guide-section"/g)||[]).length>=7,'Hijri guide needs substantial sections');
}

// The Quran Planner guide is indexed independently of its browser-only saved-plan UI.
{
 const html=read('tools/quran-planner/index.html');
 for(const phrase of ['How to plan Quran reading: a complete guide','Plan a Quran completion schedule, step by step','604 pages, thirty juz','Choosing a sustainable daily pace','Worked example: a 30-day reading plan','What if you miss a day','Saving, exporting and restoring','Quran 73:4','Sahih al-Bukhari 5054','id="quran-pace"','id="quran-sources"']){
  assert(html.includes(phrase),'Quran Planner knowledge base missing '+phrase);
 }
 assert((html.match(/class="quran-guide-section"/g)||[]).length>=7,'Quran Planner guide sections incomplete');
}

// The Ramadan timetable's full reference must be crawlable without client-side JavaScript.
{
 const html=read('tools/ramadan-timetable/index.html');
 for(const phrase of ['Ramadan timetables: the complete planning guide','When does Ramadan begin and end?','How to create a reliable 29- or 30-day timetable','Suhoor, imsak, Fajr and Iftar','Why do Ramadan schedules differ','Worked example: planning a provisional','Printing, CSV and calendar events','Quran 2:185','Quran 2:187','Sahih al-Bukhari 1909','Sahih al-Bukhari 1957','id="ramadan-dates"','id="ramadan-dawn"','id="ramadan-sources"'])assert(html.includes(phrase),'Ramadan Timetable guide missing '+phrase);
 assert((html.match(/class="ramadan-guide-section/g)||[]).length>=8,'Ramadan Timetable needs substantial sections');
}

// The final seven pages require crawlable, original, independently sourced guides.
const finalSevenGuides=[
 ['travel-prayer-guide','Travel Prayer Guide: Qasr','travel-deep'],
 ['islamic-events-calendar','Islamic Events Calendar: Ramadan','events-deep'],
 ['printable-hijri-calendar','Printable Hijri Calendar: Islamic month','hijri-print-deep'],
 ['dhul-hijjah-planner','Dhul Hijjah Planner: first ten days','dhul-deep'],
 ['halal-additives-checker','Halal E-Number Checker: additives','additives-deep'],
 ['umrah-packing-checklist','Umrah and Hajj Packing List: complete','packing-deep'],
 ['tawaf-sai-counter','Tawaf and Sa\'i Counter: seven circuits','tawaf-deep']
];
for(const [slug,title,id] of finalSevenGuides){
 const html=read('tools/'+slug+'/index.html');
 for(const text of [title,'id="'+id+'-sources"','id="'+id+'-example"','Frequently asked questions','"@type":"Article"','"citation":['])assert(html.includes(text),'Final seven static guide missing '+slug+': '+text);
 assert((html.match(/class="three-tool-section/g)||[]).length>=9,'Insufficient static guide content '+slug);
 assert(sitemap.includes('/tools/'+slug+'/'),'Sitemap missing '+slug);
}
console.log('Final seven comprehensive guides are indexed with Article citations and FAQs');
