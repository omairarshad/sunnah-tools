import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zakatPlan,zakatSummaryText,ZAKAT_FIELD_KEYS} from '../src/lib/zakatPlanner.mjs';
test('broken down asset categories match a 2.5% conditional estimate',()=>{
 const data={cash:'500',bank:'6500',receivables:'500',goldHolding:'20',silverHolding:'0',goldPrice:'80',silverPrice:'1.2',investments:'1600',trade:'2500',other:'0',debts:'700',outgoings:'300'};
 const r=zakatPlan(data,{benchmark:'silver',metalEntry:'grams'});
 assert.equal(r.error,null);
 assert.equal(r.groups.money,7500);
 assert.equal(r.groups.metals,1600);
 assert.equal(r.assets,13200);
 assert.equal(r.liabilities,1000);
 assert.equal(r.net,12200);
 assert.equal(r.thresholds.silver,734.832);
 assert.ok(Math.abs(r.thresholds.gold-6998.4)<1e-9);
 assert.equal(r.estimate,305);
 assert.equal(r.eligible,true);
 assert.equal(r.rate,.025);
});
test('holdings may be entered as independently valued amounts',()=>{
 const r=zakatPlan({goldHolding:'1000',silverHolding:'25',silverPrice:'1.5'},{benchmark:'silver',metalEntry:'value'});
 assert.equal(r.error,null);
 assert.equal(r.groups.metals,1025);
 assert.equal(r.estimate,25.625);
});
test('missing selected metal price or gram valuation never silently counts zero',()=>{
 assert.match(zakatPlan({cash:'800'},{benchmark:'silver'}).error,/price per gram/);
 assert.match(zakatPlan({goldHolding:'10',silverPrice:'1.5'},{benchmark:'silver'}).error,/each metal/);
 assert.equal(zakatPlan({goldHolding:'0',silverPrice:'1.5'},{benchmark:'silver'}).error,null);
});
test('negative and invalid inputs are rejected without NaN output',()=>{
 for(const v of ['-1','abc','Infinity','1e15'])assert.ok(zakatPlan({cash:v,silverPrice:'1'},{benchmark:'silver'}).error);
 assert.match(zakatPlan({cash:'5',silverPrice:'1'},{benchmark:'invalid'}).error,/valid Nisab/);
});
test('liabilities cannot cause negative wealth',()=>{
 const r=zakatPlan({cash:'120',debts:'500',silverPrice:'1'},{benchmark:'silver'});
 assert.equal(r.net,0);assert.equal(r.estimate,0);assert.equal(r.eligible,false);
});
test('threshold boundary is inclusive and no hardcoded live metal prices',()=>{
 const equal=zakatPlan({cash:'612.36',silverPrice:'1'},{benchmark:'silver'});
 assert.equal(equal.eligible,true);
 assert.ok(Math.abs(equal.estimate-15.309)<1e-9);
 assert.equal(zakatPlan({cash:'612.35',silverPrice:'1'},{benchmark:'silver'}).eligible,false);
});
test('download explicitly marks hawl and hypothetical demonstration cases',()=>{
 const result=zakatPlan({cash:'2000',silverPrice:'1'},{benchmark:'silver'});
 const report=zakatSummaryText(result,{currency:'GBP',hawlConfirmed:false,example:true});
 assert.match(report,/DEMONSTRATION VALUES ONLY/);
 assert.match(report,/Hawl reviewed by user: No/);
 assert.match(report,/£50.00/);
 assert.match(report,/No details are saved/);
 assert.throws(()=>zakatSummaryText({error:'invalid'}));
 assert.equal(ZAKAT_FIELD_KEYS.length,10);
});
