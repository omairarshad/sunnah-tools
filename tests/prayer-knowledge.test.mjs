import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PrayerTimes,CalculationMethod,Coordinates,Madhab,HighLatitudeRule} from 'adhan';
import {differenceMinutes,differenceLabel,prayerWeekCSV} from '../src/lib/prayerKnowledge.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('comparison differences are signed, rounded and reject invalid dates',()=>{
 const original=new Date('2027-02-15T05:00:20Z');
 assert.equal(differenceMinutes(original,new Date('2027-02-15T05:15:20Z')),15);
 assert.equal(differenceLabel(15),'+15 min');
 assert.equal(differenceLabel(-17),'−17 min');
 assert.equal(differenceLabel(0),'Same calculated time');
 assert.equal(differenceMinutes(new Date(NaN),original),null);
 assert.equal(differenceLabel(null),'Unavailable');
});
test('changing only Fajr/Isha convention changes those values for a fixed city and date',()=>{
 const c=new Coordinates(51.5072,-.1276),d=new Date(2027,3,16);
 const standard=CalculationMethod.MuslimWorldLeague(),isna=CalculationMethod.NorthAmerica();
 standard.highLatitudeRule=HighLatitudeRule.recommended(c);
 isna.highLatitudeRule=HighLatitudeRule.recommended(c);
 standard.madhab=Madhab.Shafi;isna.madhab=Madhab.Shafi;
 const a=new PrayerTimes(c,d,standard),b=new PrayerTimes(c,d,isna);
 assert.notEqual(differenceMinutes(a.fajr,b.fajr),0);
 assert.notEqual(differenceMinutes(a.isha,b.isha),0);
 assert.ok(Number.isFinite(a.asr.getTime())&&Number.isFinite(b.asr.getTime()));
});
test('CSV includes seven dated rows and safely encodes untrusted location',()=>{
 const row={date:'2027-02-15',Fajr:'05:34',Sunrise:'07:15',Dhuhr:'12:22',Asr:'15:12',Maghrib:'17:30',Isha:'19:15'};
 const csv=prayerWeekCSV(Array.from({length:7},(_,i)=>({...row,date:'2027-02-'+String(15+i)})),{location:'=SUM(1,2)',zone:'Europe/London',method:'mwl',asr:'Hanafi'});
 assert.equal(csv.split('\r\n').length,9);
 assert.ok(csv.includes("'=SUM(1,2)"));
 assert.ok(csv.includes('Calculation method,Asr setting'));
 assert.throws(()=>prayerWeekCSV([]));
 assert.throws(()=>prayerWeekCSV([{date:'2027-02-15'}]));
});
test('Prayer Times content is indexable and calculator retains individual settings',()=>{
 const page=read('src/pages/tools/[slug].astro'),knowledge=read('src/components/PrayerTimesGuide.astro'),app=read('src/components/ToolApp.tsx');
 assert.match(page,/slug==='prayer-times'&&<PrayerTimesGuide\/>/);
 assert.match(page,/slug==='prayer-times'\?'prayer-calculator'/);
 for(const key of ['prayer-five-windows','prayer-methods-explained','prayer-asr-differences','prayer-high-latitude','prayer-mosque-times','prayer-sources'])assert.ok(knowledge.includes('id="'+key+'"'),key);
 for(const cite of ['quran.com/4/103','sunnah.com/muslim:612a','fiqhcouncil.org','batoulapps/adhan-js'])assert.ok(knowledge.includes(cite),cite);
 for(const setting of ['Download 7-day CSV','compareMethod','differenceMinutes','prayerWeekCSV','High-latitude and polar calculation settings','sunnah-prayer-settings-v2'])assert.ok(app.includes(setting),setting);
});
