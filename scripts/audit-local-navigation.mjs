// Ensure every link to the site's own pages and assets resolves in the static release.
import {existsSync,readdirSync,readFileSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
const root=resolve('dist');
const allHtml=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
 const p=join(dir,e.name);
 return e.isDirectory()?allHtml(p):e.name.endsWith('.html')?[p]:[];
});
const files=allHtml(root),broken=[];let checked=0;
for(const file of files){
 const page='/'+relative(root,file).replace(/\\/g,'/').replace(/index\.html$/,'');
 const html=readFileSync(file,'utf8');
 for(const m of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)){
  const raw=m[1].replace(/&amp;/g,'&');
  if(raw.startsWith('#')||/^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(raw))continue;
  let url;
  try{url=new URL(raw,'https://sunnah.tools'+page)}catch{broken.push(page+' invalid URL '+raw);continue}
  if(url.origin!=='https://sunnah.tools')continue;
  let pathname;
  try{pathname=decodeURIComponent(url.pathname)}catch{broken.push(page+' malformed URL '+raw);continue}
  const absolute=resolve(root,'.'+pathname);
  const targets=pathname.endsWith('/')?[join(absolute,'index.html')]:[absolute,join(absolute,'index.html')];
  checked++;
  if(!targets.some(existsSync))broken.push(page+' → '+pathname);
 }
}
if(broken.length){console.error('Broken internal links/assets ('+broken.length+'):\n'+broken.slice(0,65).join('\n'));process.exitCode=1}
else console.log('Navigation integrity: '+checked+' internal links/assets resolved across '+files.length+' generated HTML pages');
