import {ADSENSE_SCOPE,ADSENSE_ORIGIN,findSunnahSite,siteStateLabel,makeAdsenseReportUrl,parseAdSenseReport,formatAdMoney,findPayments} from '../lib/adsenseReporting.mjs';

/** Private read-only AdSense reports. Income is never assumed from GA4 traffic. */
export function initAdsenseDashboard(doc=document){
 const root=doc.getElementById('ops-adsense');
 if(!root)return;
 const clientId=root.dataset.clientId||'';
 const el=id=>doc.getElementById(id);
 const connect=el('ops-ads-connect'),refresh=el('ops-ads-refresh'),disconnect=el('ops-ads-disconnect');
 const status=el('ops-ads-status'),details=el('ops-ads-data'),approval=el('ops-ads-approval');
 const remember=el('ops-ads-remember');
 const sessionKey='sunnah-adsense-token-v1';
 let tokenClient=null,token=null,expires=0,busy=false,generation=0;
 const say=(message,error=false)=>{status.textContent=message;if(error)status.dataset.error='true';else delete status.dataset.error;};
 const clearSession=()=>{try{sessionStorage.removeItem(sessionKey)}catch{}};
 const disconnectState=()=>{token=null;expires=0;generation++;clearSession();connect.hidden=false;refresh.hidden=true;disconnect.hidden=true;details.hidden=true;approval.textContent='Not checked';};
 const store=()=>{
  if(!remember.checked||!token||expires<Date.now()+30000){clearSession();return;}
  try{sessionStorage.setItem(sessionKey,JSON.stringify({token,expires,clientId}))}catch{}
 };
 let restored=false;
 try{
  const saved=JSON.parse(sessionStorage.getItem(sessionKey)||'null');
  if(saved?.clientId===clientId&&typeof saved.token==='string'&&saved.token&&Number.isFinite(saved.expires)&&saved.expires>Date.now()+30000){
   token=saved.token;expires=saved.expires;restored=true;connect.hidden=true;refresh.hidden=false;disconnect.hidden=false;
  }else clearSession();
 }catch{clearSession();}
 remember.addEventListener('change',store);
 const loadGIS=()=>{
  if(window.google?.accounts?.oauth2)return Promise.resolve();
  return new Promise((resolve,reject)=>{
   const src='https://accounts.google.com/gsi/client';
   const script=doc.querySelector('script[src="'+src+'"]')||doc.createElement('script');
   const ok=()=>window.google?.accounts?.oauth2?resolve():reject(new Error('Google OAuth did not initialise.'));
   script.addEventListener('load',ok,{once:true});
   script.addEventListener('error',()=>reject(new Error('Google OAuth script was blocked.')),{once:true});
   if(!script.isConnected){script.src=src;script.async=true;doc.head.append(script);}
  });
 };
 const api=async(path)=>{
  const response=await fetch(ADSENSE_ORIGIN+path,{method:'GET',headers:{Authorization:'Bearer '+token},cache:'no-store'});
  if(!response.ok){
   if(response.status===401){disconnectState();throw new Error('AdSense sign-in expired. Connect again.');}
   if(response.status===403)throw new Error('AdSense access denied. Enable the AdSense Management API in Google Cloud, add adsense.readonly to OAuth Data Access, and use an account allowed to view AdSense.');
   const data=await response.json().catch(()=>null);
   const info=typeof data?.error?.message==='string'?': '+data.error.message.slice(0,240):'';
   throw new Error('AdSense API returned HTTP '+response.status+info);
  }
  return response.json();
 };
 const accountSite=async()=>{
  const accounts=await api('/accounts');
  if(!Array.isArray(accounts.accounts))throw new Error('No accessible AdSense accounts were returned.');
  const candidates=[];
  for(const account of accounts.accounts){
   const name=String(account.name||'');
   if(!/^accounts\/[A-Za-z0-9_-]+$/.test(name))continue;
   let pageToken='',pages=0;
   do{
    const query=new URLSearchParams({pageSize:'1000'});
    if(pageToken)query.set('pageToken',pageToken);
    const result=await api('/'+name+'/sites?'+query);
    for(const site of result.sites||[])candidates.push({account,site});
    pageToken=String(result.nextPageToken||'');
    pages++;
    if(pages>=10&&pageToken)throw new Error('AdSense site listing was too large to verify safely.');
   }while(pageToken);
  }
  return findSunnahSite(candidates);
 };
 const setMoney=(id,v,currency)=>{el(id).textContent=formatAdMoney(v,currency);};
 const renderGraph=(items,currency)=>{
  const node=el('ops-revenue-chart');node.replaceChildren();
  if(!items.length){const p=doc.createElement('p');p.className='ops-empty';p.textContent='No site-specific earnings have been reported for these dates.';node.append(p);return;}
  const ns='http://www.w3.org/2000/svg';
  const svg=doc.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 760 210');svg.setAttribute('preserveAspectRatio','none');
  svg.setAttribute('role','img');svg.setAttribute('aria-label','Daily estimated AdSense revenue for sunnah.tools');
  const add=(tag,attrs,text='')=>{const e=doc.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(text)e.textContent=text;svg.append(e);return e;};
  const left=70,right=748,top=15,bottom=166,max=Math.max(0.01,...items.map(x=>x.value));
  for(let i=0;i<=4;i++){const y=bottom-(bottom-top)*i/4;add('line',{x1:left,y1:y,x2:right,y2:y,stroke:'currentColor','stroke-opacity':'.14'});add('text',{x:2,y:y+4,fill:'currentColor','font-size':10},formatAdMoney(max*i/4,currency));}
  const step=(right-left)/items.length;
  for(const [i,item] of items.entries()){
   const h=(bottom-top)*item.value/max,bar=add('rect',{x:left+i*step+step*.15,y:bottom-h,width:step*.7,height:Math.max(h,0.5),fill:'#61ae90',rx:2});
   const title=doc.createElementNS(ns,'title');title.textContent=item.date+': '+formatAdMoney(item.value,currency);bar.append(title);
  }
  const fmt=s=>s.slice(8,10)+'/'+s.slice(5,7);
  add('text',{x:left,y:198,'text-anchor':'start',fill:'currentColor','font-size':11},fmt(items[0].date));
  add('text',{x:right,y:198,'text-anchor':'end',fill:'currentColor','font-size':11},fmt(items[items.length-1].date));
  node.append(svg);
 };
 const load=async()=>{
  if(busy||!token)return;
  if(expires<=Date.now()+5000){disconnectState();say('Your AdSense authorisation expired. Connect again.',true);return;}
  busy=true;refresh.disabled=true;const current=++generation;
  say('Checking sunnah.tools in AdSense…');details.hidden=true;
  try{
   const match=await accountSite();
   if(current!==generation)return;
   if(!match){approval.textContent='Site not found';say('No sunnah.tools site was found in the accessible AdSense accounts. Connect the account that owns the website.');return;}
   const {account,site}=match;
   const state=siteStateLabel(site.state);
   approval.textContent=state;
   el('ops-ads-site-label').textContent=site.domain+' · '+state;
   if(site.state!=='READY'){
    say('AdSense site status: '+state+'. Site-specific earnings are unavailable until Google approves the site. Ad serving remains disabled.');
    return;
   }
   if(!site.reportingDimensionId)throw new Error('AdSense has not supplied a site reporting ID. Cannot safely isolate sunnah.tools earnings.');
   say('Loading site-specific AdSense reports…');
   const ranges=['TODAY','YESTERDAY','MONTH_TO_DATE','LAST_30_DAYS'];
   const requests=ranges.map(range=>makeAdsenseReportUrl(account.name,site.reportingDimensionId,range));
   requests.push(makeAdsenseReportUrl(account.name,site.reportingDimensionId,'LAST_30_DAYS',true));
   const replies=await Promise.all(requests.map(url=>api(url.slice(ADSENSE_ORIGIN.length))));
   if(current!==generation)return;
   const parsed=replies.map(parseAdSenseReport);
   const currency=parsed.find(item=>item.currency)?.currency||null;
   setMoney('ops-ads-today',parsed[0].summary.ESTIMATED_EARNINGS,currency);
   setMoney('ops-ads-yesterday',parsed[1].summary.ESTIMATED_EARNINGS,currency);
   setMoney('ops-ads-month',parsed[2].summary.ESTIMATED_EARNINGS,currency);
   setMoney('ops-ads-30days',parsed[3].summary.ESTIMATED_EARNINGS,currency);
   const month=parsed[3].summary;
   const integer=n=>n==null?'—':new Intl.NumberFormat('en-GB').format(n);
   el('ops-ads-impressions').textContent=integer(month.IMPRESSIONS);
   el('ops-ads-clicks').textContent=integer(month.CLICKS);
   el('ops-ads-pageviews').textContent=integer(month.PAGE_VIEWS);
   setMoney('ops-ads-rpm',month.PAGE_VIEWS_RPM,currency);
   el('ops-ads-ctr').textContent=month.IMPRESSIONS_CTR==null?'—':(month.IMPRESSIONS_CTR*100).toFixed(2)+'%';
   renderGraph(parsed[4].timeline,currency);
   // Payment balances are account-wide: deliberately separate from site earnings.
   el('ops-ads-balance').textContent='—';el('ops-ads-payment').textContent='—';
   try{
    const payment=findPayments(await api('/'+account.name+'/payments'));
    if(current===generation){
     el('ops-ads-balance').textContent=payment.unpaid||'—';
     el('ops-ads-payment').textContent=payment.last||'—';
    }
   }catch{ /* Payment access is optional; revenue report remains available. */ }
   if(current!==generation)return;
   details.hidden=false;
   say('Site-specific estimated AdSense earnings updated. Payment amounts are account-wide, not sunnah.tools-only.');
  }catch(error){
   if(current!==generation)return;
   details.hidden=true;
   say(error instanceof Error?error.message:'Unable to load AdSense reports.',true);
  }finally{busy=false;refresh.disabled=false;}
 };
 if(!clientId){connect.disabled=true;say('Google OAuth is not configured.');return;}
 loadGIS().then(()=>{
  tokenClient=window.google.accounts.oauth2.initTokenClient({
   client_id:clientId,scope:ADSENSE_SCOPE,
   callback:result=>{
    if(result.error||!result.access_token){say('AdSense permission was not granted.',true);return;}
    if(!String(result.scope||'').includes('adsense.readonly')){say('The Google account did not grant AdSense read-only access.',true);return;}
    token=result.access_token;expires=Date.now()+Math.max(60,(Number(result.expires_in)||300)-30)*1000;
    connect.hidden=true;refresh.hidden=false;disconnect.hidden=false;store();load();
   },
   error_callback:()=>say('AdSense sign-in was cancelled or blocked.',true)
  });
  connect.disabled=false;
  if(!token)say('Connect your AdSense account to check site status and, once approved, site-specific earnings.');
 }).catch(e=>say(e.message,true));
 if(restored)load();
 connect.addEventListener('click',()=>{if(tokenClient)tokenClient.requestAccessToken({prompt:''});});
 refresh.addEventListener('click',load);
 disconnect.addEventListener('click',()=>{disconnectState();say('Disconnected. Read-only AdSense authorisation cleared from this tab.');});
}
