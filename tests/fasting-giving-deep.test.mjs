import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fidyaGroupEstimate,kaffarahIllustration,givingSummary} from '../src/lib/fastingGiving.mjs';

test('Fidya groups calculate independent anonymous totals with a verified user rate',()=>{
 assert.deepEqual(fidyaGroupEstimate([7,3],6),{days:10,people:2,rate:6,lines:[{person:1,days:7,subtotal:42},{person:2,days:3,subtotal:18}],total:60});
 assert.equal(fidyaGroupEstimate([0,3],6).people,1);
 assert.equal(fidyaGroupEstimate([1,2,3],4.25).total,25.5);
});
test('Fidya rejects rates and day counts that could mislead or overflow',()=>{
 for(const value of [[],[0],[1.5],[-1],[3661],[1,NaN],Array(13).fill(1)])assert.equal(fidyaGroupEstimate(value,6),null);
 for(const rate of [0,-5,Infinity,NaN,1e7])assert.equal(fidyaGroupEstimate([2],rate),null);
 assert.equal(fidyaGroupEstimate([5000,5000,1],1),null);
});
test('Kaffarah oath feeding and clothing use ten recipients per hypothetical distinct case',()=>{
 assert.deepEqual(kaffarahIllustration({type:'oath',remedy:'feeding',cases:2,rate:7}),{type:'oath',remedy:'feeding',cases:2,people:20,fastDays:null,consecutiveLunarMonths:null,rate:7,total:140});
 assert.equal(kaffarahIllustration({type:'oath',remedy:'clothing',cases:2,rate:12}).total,240);
 const fasting=kaffarahIllustration({type:'oath',remedy:'fasting',cases:1});
 assert.equal(fasting.fastDays,3);
 assert.equal(fasting.people,0);
 assert.equal(fasting.total,null);
});
test('specific Ramadan case shows 60 recipients or two lunar months, not a universal cash charge',()=>{
 const feeding=kaffarahIllustration({type:'ramadan',remedy:'feeding',cases:1,rate:7});
 assert.equal(feeding.people,60);
 assert.equal(feeding.total,420);
 const fasting=kaffarahIllustration({type:'ramadan',remedy:'fasting',cases:1});
 assert.equal(fasting.consecutiveLunarMonths,2);
 assert.equal(fasting.fastDays,null);
 assert.equal(kaffarahIllustration({type:'ramadan',remedy:'clothing'}),null);
 assert.equal(kaffarahIllustration({type:'ramadan',remedy:'feeding',cases:2}),null);
});
test('Kaffarah invalid cases and negative unit prices have no result',()=>{
 for(const cases of [0,-1,101,1.5])assert.equal(kaffarahIllustration({type:'oath',cases}),null);
 assert.equal(kaffarahIllustration({type:'other'}),null);
 assert.equal(kaffarahIllustration({type:'oath',remedy:'feeding',rate:0}),null);
 assert.equal(kaffarahIllustration({type:'oath',remedy:'feeding',rate:NaN}),null);
});
test('download summaries are non-executable plain text and carry conditional warnings',()=>{
 const summary=givingSummary({title:'Kaffarah',currency:'GBP',rows:['Ten recipients','5\nextra'],disclaimer:'Consult qualified guidance'});
 assert.match(summary,/Illustrative figures only/);
 assert.match(summary,/5 extra/);
 assert.match(summary,/no financial inputs were uploaded/);
 const fidya=readFileSync(new URL('../src/components/FidyaPlanner.tsx',import.meta.url),'utf8');
 const kaff=readFileSync(new URL('../src/components/KaffarahPlanner.tsx',import.meta.url),'utf8');
 assert.doesNotMatch(fidya,/localStorage|fetch\(/);
 assert.doesNotMatch(kaff,/localStorage|fetch\(/);
 assert.match(kaff,/two successive lunar months/i);
});
