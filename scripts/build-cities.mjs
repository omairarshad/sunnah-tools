import {mkdtempSync,readFileSync,writeFileSync,mkdirSync,rmSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseGeoNamesCities} from '../src/lib/cities.mjs';

const folder=mkdtempSync(join(tmpdir(),'sunnah-geonames-'));
try {
 const zip=join(folder,'cities15000.zip');
 const url='https://download.geonames.org/export/dump/cities15000.zip';
 const c=spawnSync('curl',['--fail','--location','--silent','--show-error','--max-time','120','--retry','2','--output',zip,url],{stdio:'inherit'});
 if(c.status!==0)throw new Error('GeoNames download unavailable — refusing to publish incomplete city search');
 const unzip=spawnSync('unzip',['-p',zip,'cities15000.txt'],{encoding:'utf8',maxBuffer:40*1024*1024});
 if(unzip.status!==0)throw new Error('GeoNames source zip invalid: '+String(unzip.stderr).slice(0,250));
 const rows=parseGeoNamesCities(unzip.stdout);
 if(rows.length<15000||rows.length>75000)throw new Error('GeoNames row count outside expected range: '+rows.length);
 if(!rows.some(x=>x[0].toLowerCase()==='london'&&x[1]==='GB'))throw new Error('Expected London, GB not found');
 if(!rows.some(x=>x[0].toLowerCase()==='newcastle upon tyne'&&x[1]==='GB'))throw new Error('Expected Newcastle upon Tyne, GB not found');
 const out=resolve('public/data/cities.json');
 mkdirSync(resolve('public/data'),{recursive:true});
 writeFileSync(out,JSON.stringify(rows));
 const mb=(statSync(out).size/1024/1024).toFixed(2);
 console.log('Wrote '+rows.length+' GeoNames cities ('+mb+' MiB) with CC BY 4.0 attribution');
}finally{rmSync(folder,{recursive:true,force:true})}
