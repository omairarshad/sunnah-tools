import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('Compact home banner removes decorative crescent and prioritises tools',()=>{
 const home=read('src/pages/index.astro'),config=JSON.parse(read('src/data/homepage.json'));
 assert.match(home,/class="intro-index"/);
 assert.doesNotMatch(home,/class="intro-ornament"/);
 assert.equal(config.layout.sectionOrder[0],'promotions');
 assert.equal(config.layout.sectionOrder[1],'directory');
 assert.equal(config.promotions.cards.filter(x=>x.enabled).length,3);
});
test('New original SVG mark retains accessible wordmark and independent favicon',()=>{
 const base=read('src/layouts/Base.astro'),logo=read('public/brand-mark.svg'),favicon=read('public/favicon.svg');
 assert.match(base,/class="brand-wordmark"/);
 assert.match(base,/src="\/brand-mark.svg"/);
 assert.match(base,/href="\/favicon.svg"/);
 assert.match(logo,/Sunnah Tools direction mark/);
 assert.match(logo,/#194D3F/);
 assert.match(favicon,/#F4F1E9/);
 assert.doesNotMatch(logo,/(ornament-moon|crescent|<image)/i);
});
test('Site-wide editorial system retains a full dark mode palette and a working theme toggle',()=>{
 const style=read('src/styles/identity-2026.css'),base=read('src/layouts/Base.astro'),browserAudit=read('scripts/audit-brand-ux.mjs');
 assert.ok(base.includes("import '../styles/identity-2026.css'"));
 assert.match(base,/IBM\+Plex\+Sans/);
 assert.match(base,/Newsreader/);
 for(const prop of ['--brand-paper','--brand-card','--brand-ink','--brand-line','.tool-inner .result','.tool-guide-fold','.home-intro','@media(max-width:530px)','html[data-theme="dark"] .tool-panel','html[data-theme="dark"] .home-intro'])assert.ok(style.includes(prop),prop);
 assert.match(base,/sunnah-tools-theme/);
 assert.match(base,/prefers-color-scheme: dark/);
 for(const term of ['theme toggle did not persist','horizontal overflow','hero too tall','low result contrast'])assert.ok(browserAudit.includes(term),term);
});
