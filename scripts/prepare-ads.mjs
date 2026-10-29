import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {adsTxtLine} from '../src/lib/adsConfig.mjs';
import {ADSENSE_SITE_PUBLISHER_ID} from '../src/lib/adsIdentity.mjs';

// AdSense account upgrade: use the same publisher identity in every page and
// in ads.txt. Never let an obsolete Actions variable re-introduce a rejected ID.
const line=adsTxtLine(ADSENSE_SITE_PUBLISHER_ID);
if(!line)throw new Error('Invalid canonical AdSense publisher identity');
mkdirSync(resolve('public'),{recursive:true});
writeFileSync(resolve('public/ads.txt'),line,{encoding:'utf8'});
console.log('Generated ads.txt for the canonical website AdSense publisher');
