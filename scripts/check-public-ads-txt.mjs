// External ads.txt reachability probe. Does not represent Google's authenticated crawler.
// Required: apex HTTP and HTTPS reach the canonical seller declaration; www is informational.
const expected='google.com, pub-4083891573415148, DIRECT, f08c47fec0942fa0';
const urls=[
 'https://sunnah.tools/ads.txt',
 'http://sunnah.tools/ads.txt',
 'https://www.sunnah.tools/ads.txt',
 'http://www.sunnah.tools/ads.txt'
];
async function probe(url,agent){
 try{
  const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(18000),
   headers:{'User-Agent':agent,'Cache-Control':'no-cache','Pragma':'no-cache'}});
  const content=await response.text();
  const lines=content.replace(/^\uFEFF/,'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const authorized=lines.includes(expected);
  const outcome={url,status:response.status,final:response.url,type:response.headers.get('content-type'),authorized,
   firstLine:lines[0]?.slice(0,130)??''};
  console.log(JSON.stringify(outcome));
  return response.ok&&authorized;
 }catch(e){console.log(JSON.stringify({url,error:String(e)}));return false}
}
console.log('Ads.txt public reachability check. This is not an authenticated Google crawler test.');
const results=[];
for(const url of urls)results.push(await probe(url,'Mozilla/5.0 (compatible; SunnahToolsDiagnostics/1.0)'));
const bot=await probe(urls[0],'Mediapartners-Google');
if(!results[0]||!results[1]||!bot){
 console.error('Ads.txt apex reachability or publisher declaration failed. Check Hostinger redirects, the root file and bot protection.');
 process.exitCode=1;
}else console.log('Ads.txt apex HTTPS and HTTP are accessible, and seller ID matches. AdSense may still need to recrawl.');
if(!results[2]||!results[3])console.warn('www ads.txt variant was not accessible; check whether www is configured as a redirect/alias in Hostinger.');
