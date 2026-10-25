import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {oddNightDates,inclusiveDays,qadaPlanningDays,simpleEstimate,qurbaniEstimate,isoPlusDays} from '../src/lib/growthCalculations.mjs';

test('Laylatul Qadr nights start at sunset before the corresponding Ramadan day',()=>{
 const dates=oddNightDates('2027-02-08');
 assert.deepEqual(dates.map(d=>d.night),[21,23,25,27,29]);
 assert.equal(dates[0].evening,'2027-02-27');
 assert.equal(dates[0].daytime,'2027-02-28');
 assert.equal(dates[4].evening,'2027-03-07');
 assert.equal(oddNightDates('2027-02-30').length,0);
 assert.equal(isoPlusDays('2028-02-28',2),'2028-03-01');
});
test('qada day estimates handle inclusive dates, leap years and exclusions',()=>{
 assert.equal(inclusiveDays('2024-02-28','2024-03-01'),3);
 assert.equal(inclusiveDays('2025-12-31','2025-01-01'),null);
 assert.equal(qadaPlanningDays({mode:'range',start:'2024-02-28',end:'2024-03-01',excluded:1}),2);
 assert.equal(qadaPlanningDays({mode:'days',days:30,excluded:31}),null);
 assert.equal(qadaPlanningDays({mode:'years',years:1,excluded:0}),365);
});
test('fidya and kaffarah arithmetic requires a supplied positive rate',()=>{
 assert.deepEqual(simpleEstimate(4,6),{units:4,total:24});
 assert.deepEqual(simpleEstimate(2,5,10),{units:20,total:100});
 assert.deepEqual(simpleEstimate(1,4,60),{units:60,total:240});
 assert.equal(simpleEstimate(3,0),null);
 assert.equal(simpleEstimate(-1,5),null);
});
test('qurbani restricts small animals to one share and large animals to seven',()=>{
 assert.equal(qurbaniEstimate('sheep',2,200),null);
 assert.equal(qurbaniEstimate('cow',8,1400),null);
 assert.equal(qurbaniEstimate('cow',7,1400)?.perPerson,200);
 assert.equal(qurbaniEstimate('camel',3,900)?.perPerson,300);
});
test('all six tools have interactive components and responsible sources',()=>{
 const source=readFileSync(new URL('../src/components/GrowthTools.tsx',import.meta.url),'utf8');
 for(const name of ['LaylatulQadrNights','FidyaCalculator','QadaPrayerCalculator','QurbaniShareCalculator','KaffarahCalculator','TawafSaiCounter'])assert.match(source,new RegExp('export function '+name+'\\('));
 assert.match(source,/localStorage/);
 assert.match(source,/quran\.com\/5\/89/);
 assert.match(source,/sunnah\.com\/bukhari:2017/);
});
