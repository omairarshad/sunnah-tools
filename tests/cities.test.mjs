import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseGeoNamesCities,matchCities} from '../src/lib/cities.mjs';
const makeRow=({id=1,name='Newcastle upon Tyne',ascii=name,country='GB',region='ENG',lat='54.9733',lon='-1.61396',tz='Europe/London',pop=300000}={})=>
 [id,name,ascii,'',lat,lon,'P','PPL',country,'',region,'','','',pop,0,0,tz,'2026-10-01'].join('\t');
test('GeoNames parser extracts location and timezone from exact TSV positions',()=>{
 const data=parseGeoNamesCities(makeRow()+'\n');
 assert.deepEqual(data,[['Newcastle upon Tyne','GB','ENG',54.9733,-1.61396,'Europe/London',300000]]);
});
test('City rows are sorted by population to put useful results first',()=>{
 const data=parseGeoNamesCities(makeRow({name:'London',ascii:'London',lat:'51.5074',lon:'-0.1278',pop:9000000})+'\n'+makeRow());
 assert.equal(data[0][0],'London');
});
test('Search matches prefixes before internal substrings',()=>{
 const rows=parseGeoNamesCities(makeRow({name:'London',ascii:'London',pop:1000000})+'\n'+makeRow({name:'New London',ascii:'New London',country:'US',pop:50000})+'\n');
 assert.equal(matchCities(rows,'lon')[0][0],'London');
});
test('Search waits until two characters',()=>assert.deepEqual(matchCities([['London','GB','ENG',51,-0.1,'Europe/London',1000]],'L'),[]));
test('Parser discards impossible coordinates or timezones',()=>{
 const s=makeRow({lat:'95'})+'\n'+makeRow({tz:'bad_zone'})+'\n'+makeRow({id:3,name:'Valid',ascii:'Valid',lat:'50',lon:'0',pop:20000})+'\n';
 assert.deepEqual(parseGeoNamesCities(s).map(x=>x[0]),['Valid']);
});
