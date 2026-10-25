import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=relative=>readFileSync(new URL('../'+relative,import.meta.url),'utf8');
const homepage=JSON.parse(read('src/data/homepage.json'));
const index=read('src/pages/index.astro');
const tool=read('src/pages/tools/[slug].astro');
const shell=read('src/layouts/Base.astro');
const fontLab=read('src/pages/font-lab/index.astro');
test('homepage copy names its purpose and does not show filler or internal markers',()=>{
 assert.equal(homepage.intro.headline,'Islamic tools for everyday life');
 assert.equal(homepage.intro.eyebrow,'');
 assert.equal(homepage.promotions.eyebrow,'');
 assert.ok(homepage.directory.title.length>4);
 for(const phrase of ['SIMPLE TOOLS, MEANINGFUL DAYS','Free, no account needed','THE TOOLBOX','No sign-up, no noise','External']){
  assert.ok(!JSON.stringify(homepage).includes(phrase),'Template text remains: '+phrase);
 }
 assert.doesNotMatch(index,/Free, no account needed|THE TOOLBOX|trust-strip|class="promo-banner-top"/);
 assert.doesNotMatch(index,/Pick a tool to get started|Open tool <span/);
 assert.match(index,/aria-label=.*opens in a new tab/);
 assert.doesNotMatch(fontLab,/SIMPLE TOOLS, MEANINGFUL DAYS|No sign-up, no noise/);
});
test('tool pages prioritise instructions, not internal interface status and repeated slogans',()=>{
 for(const phrase of ['FREE ISLAMIC TOOL','INTERACTIVE TOOL','No account required','Made for simplicity','KEEP EXPLORING','Step-by-step and method','Answers and context','Learn the background','tool-disclaimer']){
  assert.ok(!tool.includes(phrase),'Extraneous label remains: '+phrase);
 }
 for(const phrase of ['What to check','How it works','source-note','FAQPage','related-guide-list','seo-explainer'])assert.ok(tool.includes(phrase),'Lost useful information: '+phrase);
 assert.doesNotMatch(shell,/href="\/admin\/">Site dashboard/);
});
test('editorial guides use a single clear heading without redundant uppercase category labels',()=>{
 for(const guide of ['using-islamic-planning-tools','prayer-time-methods','ramadan-dates-and-timetables','zakat-nisab-and-fitrana','hijri-calendar-and-moon-sighting']){
  const page=read('src/pages/guides/'+guide+'.astro');
  assert.doesNotMatch(page,/class="eyebrow"/,guide);
  assert.match(page,/<h1>[^<]+<\/h1>/,guide);
 }
});
