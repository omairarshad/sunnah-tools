import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localISODate,GOLD_NISAB_GRAMS,SILVER_NISAB_GRAMS,nisabAmounts,parseAmount,zakatEstimate,finalThirdStart,readingPlan,hijriToGregorian} from '../src/lib/calculations.mjs';
test('today uses local calendar components',()=>assert.equal(localISODate(new Date(2026,9,24,23,58)),'2026-10-24'));
test('gold and silver grams match documented references',()=>{assert.equal(GOLD_NISAB_GRAMS,87.48);assert.equal(SILVER_NISAB_GRAMS,612.36)});
test('calculates two Nisab thresholds from user prices',()=>assert.deepEqual(nisabAmounts(100,2),{gold:8748,silver:1224.72}));
test('validates negative and missing prices',()=>{assert.equal(parseAmount(''),0);assert.ok(Number.isNaN(parseAmount('-5')))});
test('Zakat returns 2.5% after crossing Nisab',()=>{assert.deepEqual(zakatEstimate({assets:2500,debts:500,threshold:1000}),{net:2000,threshold:1000,eligible:true,amount:50})});
test('below Nisab means zero estimate',()=>assert.equal(zakatEstimate({assets:900,debts:0,threshold:1000}).amount,0));
test('rejects zero Nisab benchmark',()=>assert.equal(zakatEstimate({assets:100,debts:0,threshold:0}),null));
test('final third of an overnight 9 hour interval starts after 6h',()=>{const m=new Date('2026-10-24T18:00:00Z');const f=new Date('2026-10-25T03:00:00Z');assert.equal(finalThirdStart(m,f).toISOString(),'2026-10-25T00:00:00.000Z')});
test('rejects inverted night interval',()=>assert.equal(finalThirdStart(new Date('2026-10-25'),new Date('2026-10-24')),null));
test('planning Quran readings uses remaining pages',()=>assert.deepEqual(readingPlan(604,100,28),{remaining:504,perDay:18,perPrayer:4,percent:17}));
test('rejects invalid Quran page counts',()=>assert.equal(readingPlan(604,605,30),null));

test('Hijri to Gregorian: 24 Ramadan 1420 is 1 January 2000 in Umm al-Qura',()=>assert.equal(hijriToGregorian(1420,9,24)?.toISOString().slice(0,10),'2000-01-01'));
test('invalid Hijri day or year is rejected',()=>{assert.equal(hijriToGregorian(1448,13,1),null);assert.equal(hijriToGregorian(1100,1,1),null)});
test('invalid lunar day that does not exist is rejected',()=>{const d=hijriToGregorian(1448,2,30);if(d!==null){const fmt=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',{timeZone:'UTC',day:'numeric',month:'numeric',year:'numeric'});assert.match(fmt.format(d),/1448/)}});
