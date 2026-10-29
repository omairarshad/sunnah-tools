import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {oddNightDates,lastTenNights,laylatPlannerIcs,inclusiveDays,qadaPlanningDays,simpleEstimate,qurbaniEstimate,isoPlusDays} from '../src/lib/growthCalculations.mjs';

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
 for(const name of ['FidyaCalculator','QadaPrayerCalculator','QurbaniShareCalculator','KaffarahCalculator','TawafSaiCounter'])assert.match(source,new RegExp('export function '+name+'\\('));
 const newPlanner=readFileSync(new URL('../src/components/LaylatulQadrPlanner.tsx',import.meta.url),'utf8');
 const newGuide=readFileSync(new URL('../src/components/LaylatulQadrGuide.astro',import.meta.url),'utf8');
 assert.match(newPlanner,/export default function LaylatulQadrPlanner/);
 assert.match(source,/localStorage/);
 assert.match(source,/quran\.com\/5\/89/);
 assert.match(newGuide,/sunnah\.com\/bukhari:2017/);
});

test('last-ten-night planner distinguishes 29 and 30-night months',()=>{
 const thirty=lastTenNights('2027-02-08',30),twentyNine=lastTenNights('2027-02-08',29);
 assert.deepEqual(thirty.map(n=>n.night),[21,22,23,24,25,26,27,28,29,30]);
 assert.deepEqual(twentyNine.map(n=>n.night),[20,21,22,23,24,25,26,27,28,29]);
 assert.equal(thirty[0].evening,'2027-02-27');
 assert.equal(thirty[6].evening,'2027-03-05');
 assert.equal(twentyNine[0].evening,'2027-02-26');
 assert.equal(twentyNine.at(-1).daytime,'2027-03-08');
 assert.equal(lastTenNights('2027-02-30'),null);
 assert.equal(lastTenNights('2027-02-08',31),null);
});
test('last-ten-night exports use evening date markers, not fabricated sunset times',()=>{
 const plan=lastTenNights('2027-02-08');
 const full=laylatPlannerIcs(plan,{stamp:new Date('2026-10-29T12:00:00Z')});
 assert.equal((full.match(/BEGIN:VEVENT/g)||[]).length,10);
 assert.match(full,/DTSTART;VALUE=DATE:20270227/);
 assert.match(full,/DTEND;VALUE=DATE:20270228/);
 assert.doesNotMatch(full,/DTSTART:2027/);
 assert.equal((laylatPlannerIcs(plan,{oddOnly:true}).match(/BEGIN:VEVENT/g)||[]).length,5);
 assert.throws(()=>laylatPlannerIcs([plan[0]]),RangeError);
});
