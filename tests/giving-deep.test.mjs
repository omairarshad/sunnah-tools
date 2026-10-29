import test from 'node:test';
import assert from 'node:assert/strict';
import {fitranaBreakdown,goldPortfolioEstimate,nisabComparison,GOLD_KARATS,safeNote} from '../src/lib/givingDeep.mjs';
import {readFileSync} from 'node:fs';

test('Fitrana separates required conditional subtotal from voluntary extra and comparison',()=>{
 const result=fitranaBreakdown({people:4,rate:5,extra:2,comparisonRate:7});
 assert.deepEqual({base:result.base,total:result.total,alternative:result.comparison.base,difference:result.comparison.difference},{base:20,total:22,alternative:28,difference:8});
});
test('Fitrana requires a verified positive rate and whole household count',()=>{
 for(const p of [0,-1,1.5,501,NaN])assert.equal(fitranaBreakdown({people:p,rate:5}),null);
 for(const r of [0,-2,NaN,Infinity,1e7])assert.equal(fitranaBreakdown({people:2,rate:r}),null);
 assert.equal(fitranaBreakdown({people:2,rate:5,extra:-1}),null);
 assert.equal(fitranaBreakdown({people:2,rate:5,comparisonRate:0}),null);
});
test('Gold multi-item purity valuation and combined threshold test',()=>{
 const r=goldPortfolioEstimate({items:[{weight:30,karat:22},{weight:20,karat:18}],price24k:80,otherAssets:1000,liabilities:100,benchmark:'silver',silverPrice:1.2});
 assert.equal(r.fineGold,42.5);assert.equal(r.goldValue,3400);assert.equal(r.net,4300);
 assert.equal(r.threshold,734.83);assert.equal(r.meetsThreshold,true);assert.equal(r.conditionalTotal,107.5);
 assert.equal(r.lines[0].karat,22);
});
test('Gold estimate never makes a gold-only below-Nisab holding automatically payable',()=>{
 const r=goldPortfolioEstimate({items:[{weight:20,karat:24}],price24k:80});
 assert.equal(r.meetsThreshold,false);assert.equal(r.conditionalTotal,0);assert.equal(r.illustrativeGoldShare,40);
});
test('Gold rejects missing price, incorrect purity, invalid weight, missing silver rate and unsafe magnitudes',()=>{
 const base={items:[{weight:10,karat:22}],price24k:100};
 assert.equal(goldPortfolioEstimate({...base,price24k:0}),null);
 assert.equal(goldPortfolioEstimate({...base,items:[{weight:-2,karat:22}]}),null);
 assert.equal(goldPortfolioEstimate({...base,items:[{weight:10,karat:12}]}),null);
 assert.equal(goldPortfolioEstimate({...base,benchmark:'silver'}),null);
 assert.equal(goldPortfolioEstimate({...base,liabilities:-1}),null);
 assert.equal(goldPortfolioEstimate({...base,otherAssets:Infinity}),null);
 assert.equal(GOLD_KARATS.length,6);
});
test('Nisab thresholds use 87.48g and 612.36g, and separately assess optional wealth',()=>{
 const r=nisabComparison({goldPrice:80,silverPrice:1.2,wealth:2000,liabilities:200});
 assert.equal(r.gold,6998.4);assert.equal(r.silver,734.83);
 assert.equal(r.net,1800);assert.equal(r.goldReached,false);assert.equal(r.silverReached,true);
 assert.equal(r.conditionalGold,0);assert.equal(r.conditionalSilver,45);
 const blank=nisabComparison({goldPrice:80,silverPrice:1.2});
 assert.equal(blank.net,null);assert.equal(blank.goldReached,null);
});
test('Invalid Nisab rates and negative assets never appear as valid comparison',()=>{
 assert.equal(nisabComparison({goldPrice:0,silverPrice:1}),null);
 assert.equal(nisabComparison({goldPrice:10,silverPrice:NaN}),null);
 assert.equal(nisabComparison({goldPrice:10,silverPrice:1,wealth:-100}),null);
 assert.equal(nisabComparison({goldPrice:10,silverPrice:1,liabilities:-1}),null);
 assert.equal(safeNote('Good\nProvider\tName'), 'Good Provider Name');
});
test('New panels are routed independently and guard local-only example rates',()=>{
 const router=readFileSync('src/components/ToolApp.tsx','utf8');
 for(const path of ['FitranaDeep','GoldZakatDeep','NisabDeep'])assert.match(router,new RegExp(path));
 for(const path of ['FitranaDeep','GoldZakatDeep','NisabDeep']){
 const s=readFileSync('src/components/'+path+'.tsx','utf8');
 assert.match(s,/hypothetical|Hypothetical/);
 assert.match(s,/Download|download/);
 assert.doesNotMatch(s,/fetch\(|localStorage\.setItem/);
 }
});
