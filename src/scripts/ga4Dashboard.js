import {makeGA4ReportBatches,parseGA4Response} from '../lib/reportingConfig.mjs';
/** Google-authenticated, read-only reporting. OAuth tokens exist only in memory. */
export function initGA4Dashboard(doc=document){
 const root=doc.getElementById('ga4-reporting');
 if(!root)return;
 const propertyId=root.dataset.propertyId||'',clientId=root.dataset.clientId||'';
 const connect=doc.getElementById('ops-connect');
 const refresh=doc.getElementById('ops-refresh');
 const disconnect=doc.getElementById('ops-disconnect');
 const period=doc.getElementById('ops-period');
 const data=doc.getElementById('ops-data');
 const status=doc.getElementById('ops-status');
 if(!propertyId||!clientId)return;
 let tokenClient=null,accessToken=null,tokenExpiry=0,busy=false;
 const number=n=>new Intl.NumberFormat('en-GB').format(n||0);
 const setStatus=(message,error=false)=>{
  status.textContent=message;
  if(error)status.dataset.error='true';
  else delete status.dataset.error;
 };
 const el=id=>doc.getElementById(id);
 const loadGIS=()=>{
  if(window.google?.accounts?.oauth2)return Promise.resolve();
  return new Promise((resolve,reject)=>{
   const script=doc.createElement('script');
   script.src='https://accounts.google.com/gsi/client';
   script.async=true;
   script.onload=()=>window.google?.accounts?.oauth2?resolve():reject(new Error('Google sign-in did not initialise'));
   script.onerror=()=>reject(new Error('Google sign-in is blocked by your browser or connection'));
   doc.head.appendChild(script);
  });
 };
 const renderRows=(id,items,label,valueKey)=>{
  const node=el(id);node.replaceChildren();
  if(!items.length){const p=doc.createElement('p');p.className='ops-empty';p.textContent='No recorded data for this period.';node.append(p);return;}
  for(const item of items){
   const div=doc.createElement('div');div.className='ops-row';
   const name=doc.createElement('span');
   // GA4 source values are treated strictly as text.
   name.textContent=item.name||'(not set)';
   const metric=doc.createElement('strong');metric.textContent=number(item[valueKey]);
   div.append(name,metric);node.append(div);
  }
 };
 const chart=(points)=>{
  const node=el('ops-chart');node.replaceChildren();
  if(!points.length){node.textContent='No daily traffic data yet.';return;}
  const xmlns='http://www.w3.org/2000/svg';
  const svg=doc.createElementNS(xmlns,'svg');
  svg.setAttribute('viewBox','0 0 760 210');
  svg.setAttribute('preserveAspectRatio','none');
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Daily active users for the selected date range');
  const max=Math.max(1,...points.map(p=>p.users));
  const left=44,right=746,top=15,bottom=167;
  for(let i=0;i<4;i++){
   const value=max*i/3,y=bottom-(bottom-top)*i/3;
   const line=doc.createElementNS(xmlns,'line');
   for(const [k,v] of Object.entries({x1:left,y1:y,x2:right,y2:y,stroke:'currentColor','stroke-opacity':'.14'}))line.setAttribute(k,String(v));
   svg.append(line);
   const text=doc.createElementNS(xmlns,'text');
   for(const [k,v] of Object.entries({x:3,y:y+4,fill:'currentColor','font-size':11}))text.setAttribute(k,String(v));
   text.textContent=String(Math.round(value));svg.append(text);
  }
  const poly=doc.createElementNS(xmlns,'polyline');
  const joined=points.map((p,i)=>{
   const x=left+(right-left)*(points.length===1?.5:i/(points.length-1));
   const y=bottom-(bottom-top)*p.users/max;
   return x.toFixed(2)+','+y.toFixed(2);
  }).join(' ');
  poly.setAttribute('points',joined);
  poly.setAttribute('fill','none');poly.setAttribute('stroke','#5ca986');
  poly.setAttribute('stroke-width','3');poly.setAttribute('stroke-linejoin','round');
  poly.setAttribute('stroke-linecap','round');svg.append(poly);
  for(const [i,align] of [[0,'start'],[points.length-1,'end']]){
   const label=doc.createElementNS(xmlns,'text');
   const value=points[i]?.date||'';
   label.textContent=value.length===8?value.slice(6,8)+'/'+value.slice(4,6)+'/'+value.slice(0,4):value;
   label.setAttribute('x',String(i===0?left:right));label.setAttribute('y','197');
   label.setAttribute('text-anchor',align);label.setAttribute('fill','currentColor');label.setAttribute('font-size','11');
   svg.append(label);
  }
  node.append(svg);
 };
 const request=async(endpoint,body)=>{
  const response=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+propertyId+':'+endpoint,{
   method:'POST',
   headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},
   body:JSON.stringify(body),cache:'no-store'
  });
  if(!response.ok){
   if(response.status===401){accessToken=null;throw new Error('Google sign-in expired. Connect again.');}
   if(response.status===403)throw new Error('Google denied report access. Check that your login has access to this GA4 property, the Data API is enabled, and the OAuth app allows your account.');
   if(response.status===404)throw new Error('GA4 property not found. Verify the numeric Property ID.');
   // Provide Google's actual validation reason without exposing credentials or headers.
   if(response.status===400){
    const detail=await response.json().catch(()=>null);
    const reason=typeof detail?.error?.message==='string'?detail.error.message.slice(0,400):'';
    throw new Error('Google Analytics rejected the report (HTTP 400)'+(reason?': '+reason:'')+'.');
   }
   throw new Error('Google Analytics report request failed (HTTP '+response.status+').');
  }
  return response.json();
 };
 async function loadReports(){
  if(busy||!accessToken)return;
  if(Date.now()>tokenExpiry){accessToken=null;setStatus('Google session expired. Connect again.');connect.hidden=false;refresh.hidden=true;disconnect.hidden=true;data.hidden=true;return;}
  busy=true;refresh.disabled=true;setStatus('Loading actual Google Analytics reports…');
  try{
   const batches=makeGA4ReportBatches(period.value);
   // The API rejects requests containing six or more reports. Combine two legal
   // batches in the original order so parsing remains strict and consistent.
   const replies=await Promise.all(batches.map(batch=>request('batchRunReports',batch)));
   const raw={reports:replies.flatMap((reply,index)=>{
    if(!Array.isArray(reply?.reports)||reply.reports.length!==batches[index].requests.length){
     throw new Error('Google Analytics returned an incomplete report batch.');
    }
    return reply.reports;
   })};
   const report=parseGA4Response(raw);
   for(const [key,id] of [['users','ops-users'],['sessions','ops-sessions'],['views','ops-views'],['events','ops-events']]){
    el(id).textContent=number(report.kpis[key]);
   }
   chart(report.timeline);
   renderRows('ops-pages',report.pages,'Page','views');
   renderRows('ops-channels',report.channels,'Channel','value');
   renderRows('ops-event-list',report.events,'Event','value');
   renderRows('ops-countries',report.countries,'Country','value');
   data.hidden=false;
   const now=new Date();
   setStatus('Verified GA4 report · '+now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+'. Source: your Google Analytics property. Numbers are not cached by sunnah.tools.');
  }catch(err){
   setStatus(err instanceof Error?err.message:'Unable to load analytics at present.',true);
   data.hidden=true;
  }finally{busy=false;refresh.disabled=false;}
 }
 loadGIS().then(()=>{
  tokenClient=window.google.accounts.oauth2.initTokenClient({
   client_id:clientId,
   scope:'https://www.googleapis.com/auth/analytics.readonly',
   callback:(response)=>{
    if(response.error||!response.access_token){setStatus('Google permission was not granted; no reporting data was requested.',true);return;}
    if(!String(response.scope||'').includes('analytics.readonly')){setStatus('The Google login did not grant read-only Analytics access.',true);return;}
    accessToken=response.access_token;
    tokenExpiry=Date.now()+Math.max(60,(Number(response.expires_in)||300)-30)*1000;
    connect.hidden=true;refresh.hidden=false;disconnect.hidden=false;
    loadReports();
   },
   error_callback:()=>setStatus('Google sign-in was closed or blocked. Check your browser popup settings.',true)
  });
  connect.disabled=false;
  setStatus('Google login ready. Connect with a Google account authorised for this GA4 property.');
 }).catch(err=>setStatus(err.message,true));
 connect.addEventListener('click',()=>{if(tokenClient)tokenClient.requestAccessToken({prompt:'consent'});});
 refresh.addEventListener('click',loadReports);
 period.addEventListener('change',()=>{if(accessToken)loadReports();});
 disconnect.addEventListener('click',()=>{
  accessToken=null;tokenExpiry=0;
  connect.hidden=false;refresh.hidden=true;disconnect.hidden=true;data.hidden=true;
  setStatus('Disconnected. No report or access token was saved on this website.');
 });
}
