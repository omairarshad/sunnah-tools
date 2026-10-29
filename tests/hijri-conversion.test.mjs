import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseGregorianDate,shiftGregorianDate,gregorianToHijri,hijriToGregorianDate,hijriMonthRange,hijriDateLabel,HIJRI_MONTH_NAMES} from '../src/lib/hijriConversion.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('Umm al-Qura known dates and reverse conversion agree',()=>{
 assert.deepEqual(gregorianToHijri('2017-10-14'),{year:1439,month:1,day:24,monthName:'Muharram',calendar:'islamic-umalqura'});
 assert.equal(hijriToGregorianDate(1439,1,24),'2017-10-14');
 assert.equal(hijriToGregorianDate(1420,9,24),'2000-01-01');
 assert.equal(hijriDateLabel(gregorianToHijri('2017-10-14')),'24 Muharram 1439 AH');
});
test('tabular and Umm al-Qura are separately selectable and inverses',()=>{
 assert.equal(gregorianToHijri('2017-10-14','islamic-civil').day,23);
 assert.equal(hijriToGregorianDate(1439,1,23,'islamic-civil'),'2017-10-14');
 for(const calendar of ['islamic-civil','islamic-umalqura']){
  for(const iso of ['1883-02-01','1999-12-31','2026-10-29','2173-06-01']){
   const p=gregorianToHijri(iso,calendar);
   assert.ok(p,`${calendar} ${iso}`);
   assert.equal(hijriToGregorianDate(p.year,p.month,p.day,calendar),iso);
  }
 }
});
test('month ranges contain 29 or 30 days, with invalid lunar 30 rejected',()=>{
 for(const calendar of ['islamic-civil','islamic-umalqura']){
  for(let m=1;m<=12;m++){
   const range=hijriMonthRange(1448,m,calendar);
   assert.ok(range);
   assert.ok([29,30].includes(range.days));
   assert.equal(hijriToGregorianDate(1448,m,1,calendar),range.start);
   if(range.days===29)assert.equal(hijriToGregorianDate(1448,m,30,calendar),null);
   else assert.equal(hijriToGregorianDate(1448,m,30,calendar),range.end);
  }
 }
 assert.equal(HIJRI_MONTH_NAMES.length,12);
 for(const calendar of ['islamic-civil','islamic-umalqura'])assert.ok([29,30].includes(hijriMonthRange(1600,12,calendar).days));
});
test('civil date validation is strict and UTC arithmetic ignores local DST',()=>{
 assert.equal(parseGregorianDate('2027-02-29'),null);
 assert.equal(parseGregorianDate('2028-02-29').toISOString().slice(0,10),'2028-02-29');
 assert.equal(parseGregorianDate('2026-13-01'),null);
 assert.equal(parseGregorianDate('2026-04-31'),null);
 assert.equal(shiftGregorianDate('2027-03-28',1),'2027-03-29');
 assert.equal(shiftGregorianDate('2027-10-31',1),'2027-11-01');
 assert.equal(shiftGregorianDate('2027-03-28',1),new Date(Date.UTC(2027,2,29,12)).toISOString().slice(0,10));
 assert.equal(shiftGregorianDate('2027-03-28',4),null);
});
test('invalid years, dates and calendar identifiers do not silently normalise',()=>{
 assert.equal(hijriToGregorianDate(1448,13,1),null);
 assert.equal(hijriToGregorianDate(1448,1,31),null);
 assert.equal(hijriToGregorianDate(1299,1,1),null);
 assert.equal(hijriToGregorianDate(1448,1,1,'islamic'),null);
 assert.equal(gregorianToHijri('not a date'),null);
 assert.equal(gregorianToHijri('1900-01-01','islamic'),null);
});
test('converter and substantial source-linked guide render in the Hijri tool route',()=>{
 const app=read('src/components/ToolApp.tsx'),component=read('src/components/HijriConverter.tsx');
 const route=read('src/pages/tools/[slug].astro'),guide=read('src/components/HijriConverterGuide.astro');
 assert.match(app,/slug==='hijri-converter'\)return <HijriConverter\/>/);
 assert.match(route,/slug==='hijri-converter'&&<HijriConverterGuide\/>/);
 for(const phrase of ['Primary calendar system','Civil Hijri (tabular)','View the next lunar day','Copy comparison','Download text summary','29 days']){
  assert.ok(component.includes(phrase)||guide.includes(phrase),phrase);
 }
 for(const anchor of ['hijri-how-to','hijri-calendars','hijri-sunset','hijri-months','hijri-example','hijri-questions','hijri-sources'])assert.ok(guide.includes(`id="${anchor}"`),anchor);
 for(const reference of ['quran.com/2/189','quran.com/9/36','sunnah.com/bukhari:1909','sunnah.com/bukhari:4662','unicode.org/reports/tr35'])assert.ok(guide.includes(reference),reference);
 assert.match(guide,/not an official moon-sighting announcement/);
 const seo=read('src/data/toolSeo.ts');
 assert.match(seo,/Hijri Date Converter – Today, Umm al-Qura & Civil Calendar/);
});
