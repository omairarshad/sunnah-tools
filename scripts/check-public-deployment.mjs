// Optional post-publish check of what the *public host* actually serves.
// Fails on stale markup or a missing build marker; the publisher workflow
// treats it as a separate warning so a slow Hostinger release cannot corrupt GitHub.
const host=process.env.SUNNAH_PUBLIC_SITE || 'https://sunnah.tools';
const expected=process.env.GITHUB_SHA || '';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(path){
  const response=await fetch(new URL(path,host),{redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}});
  if(!response.ok)throw new Error(path+' returned HTTP '+response.status);
  return response;
}
async function verify(){
 const [htmlResponse,releaseResponse,artResponse,contactResponse,editorialResponse]=await Promise.all([get('/'),get('/release.json'),get('/tool-art/prayer-times.svg'),get('/contact/'),get('/editorial-policy/')]);
 const html=await htmlResponse.text(),release=await releaseResponse.json(),art=await artResponse.text(),contact=await contactResponse.text(),editorial=await editorialResponse.text();
 const illustrationCount=(html.match(/class="tool-card-visual"/g)||[]).length;
 if(illustrationCount!==44)throw new Error('Public homepage has '+illustrationCount+'/44 illustrated cards; likely stale Hostinger branch or cache');
 if(release.toolCardCount!==44||release.design!=='illustrated-44-tools')throw new Error('Public release marker still references an outdated tool count');
 if(html.includes('class="tool-card-icon"'))throw new Error('Public homepage contains obsolete small-icon card markup');
 if(!art.includes('<svg'))throw new Error('Public illustration is not served as SVG');
 if(!html.includes('href="/contact/"')||!html.includes('href="/editorial-policy/"'))throw new Error('Public homepage missing the editorial/contact links');
 if(!contact.includes('GitHub issues are public')||!editorial.includes('Editorial standards and accuracy'))throw new Error('Public trust pages are missing or outdated');
 if(release.sourceCommit!==expected)throw new Error('Hostinger serving source '+release.sourceCommit+' instead of '+expected);
 console.log('PUBLIC DEPLOY VERIFIED:',illustrationCount+' illustrated cards',release.sourceCommit);
}
let error;
for(let i=0;i<3;i++){
 try{await verify();process.exit(0)}catch(e){error=e;console.warn('Public check attempt',i+1,'failed:',String(e));if(i<2)await wait(15000)}
}
console.error('HOSTINGER PUBLIC SITE NOT YET VERIFIED. Verify the connected branch is hostinger-live and flush Hostinger/CDN caches. Last error:',String(error));
process.exitCode=1;
