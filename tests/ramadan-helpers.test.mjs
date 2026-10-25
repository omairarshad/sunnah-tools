import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fitranaEstimate,ramadanDays,timetableCSV,csvEscape} from '../src/lib/ramadanHelpers.mjs';
test('Fitrana uses user-verified rate and household size',()=>assert.deepEqual(fitranaEstimate({people:4,ratePerPerson:7,additional:2}),{people:4,ratePerPerson:7,additional:2,total:30}));
test('Fitrana disallows missing rate and invalid household sizes',()=>{assert.equal(fitranaEstimate({people:4,ratePerPerson:0}),null);assert.equal(fitranaEstimate({people:0,ratePerPerson:7}),null);assert.equal(fitranaEstimate({people:1.5,ratePerPerson:7}),null)});
test('Ramadan length can be exactly 29 or 30 days',()=>{assert.equal(ramadanDays('2027-02-08',29).length,29);assert.equal(ramadanDays('2027-02-08',30).length,30);assert.equal(ramadanDays('2027-02-08',28),null)});
test('Ramadan date boundaries survive month rollover',()=>{const d=ramadanDays('2027-02-08',30);assert.equal(d[0].iso,'2027-02-08');assert.equal(d[29].iso,'2027-03-09')});
test('Invalid Gregorian dates are rejected',()=>assert.equal(ramadanDays('2027-02-30',30),null));
test('Export CSV contains headings and escapes dangerous quotes',()=>{assert.equal(csvEscape('A,"B"'),'"A,""B"""');assert.match(timetableCSV([{day:1,date:'2027-02-08',fajr:'05:42',maghrib:'17:15'}]),/05:42,17:15/)});
