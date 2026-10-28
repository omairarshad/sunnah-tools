import {mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {adsTxtLine} from '../src/lib/adsConfig.mjs';
import {ADSENSE_SITE_PUBLISHER_ID} from '../src/lib/adsIdentity.mjs';
const outfile=resolve('public/ads.txt');
const line=adsTxtLine(process.env.PUBLIC_ADSENSE_PUBLISHER_ID || ADSENSE_SITE_PUBLISHER_ID);
if(line){
 mkdirSync(resolve('public'),{recursive:true});
 writeFileSync(outfile,line,{encoding:'utf8'});
 console.log('Created ads.txt for the configured Google publisher');
}else{
 rmSync(outfile,{force:true});
 console.log('AdSense publisher ID not configured; ads.txt intentionally omitted');
}
