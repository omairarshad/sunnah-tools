import {makeGA4ReportBatches,parseGA4Response,makeGA4RealtimeRequest,parseGA4RealtimeResponse} from '../lib/reportingConfig.mjs';
/** Read-only reporting; short-lived OAuth token can be scoped to the current tab. */
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
 const remember=doc.getElementById('ops-remember');
 const liveStatus=doc.getElementById('ops-realtime-status');
 const emptyNote=doc.getElementById('ops-empty-note');
 const metricSelect=doc.getElementById('ops-chart-metric');
 let dailySeries=[];
 if(!propertyId||!clientId)return;
 let tokenClient=null,accessToken=null,tokenExpiry=0,busy=false,requestGeneration=0;
 const sessionKey='sunnah-ga4-dashboard-token-v1';
 const clearStored=()=>{try{sessionStorage.removeItem(sessionKey)}catch{}};
 const storeToken=()=>{
  if(!remember.checked||!accessToken||Date.now()+30000>=tokenExpiry){clearStored();return;}
  try{sessionStorage.setItem(sessionKey,JSON.stringify({accessToken,expiresAt:tokenExpiry,propertyId,clientId}))}catch{}
 };
 const signedInUI=()=>{connect.hidden=true;refresh.hidden=false;disconnect.hidden=false;};
 const signedOutUI=()=>{connect.hidden=false;refresh.hidden=true;disconnect.hidden=true;data.hidden=true;};
 const forgetToken=()=>{accessToken=null;tokenExpiry=0;requestGeneration++;clearStored();signedOutUI();};
 let restored=false;
 try{
  const value=JSON.parse(sessionStorage.getItem(sessionKey)||'null');
  if(value?.propertyId===propertyId&&value?.clientId===clientId&&
     typeof value.accessToken==='string'&&value.accessToken.length>0&&
     Number.isFinite(value.expiresAt)&&value.expiresAt>Date.now()+30000){
   accessToken=value.accessToken;tokenExpiry=value.expiresAt;restored=true;signedInUI();
  }else clearStored();
 }catch{clearStored();}
 remember.addEventListener('change',storeToken);
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
 const chart=()=>{
  const node=el('ops-chart');
  node.replaceChildren();
  const metric=['users','sessions','views'].includes(metricSelect.value)?metricSelect.value:'users';
  const label={users:'Users',sessions:'Sessions',views:'Page views'}[metric];
  if(!dailySeries.length){
   const p=doc.createElement('p');p.className='ops-empty';
   p.textContent='Daily '+label.toLowerCase()+' data will appear when Google finishes processing your first visits.';
   node.append(p);return;
  }
  const values=dailySeries.map(point=>Number(point[metric])||0);
  const max=Math.max(1,...values);
  const namespace='http://www.w3.org/2000/svg';
  const svg=doc.createElementNS(namespace,'svg');
  svg.setAttribute('viewBox','0 0 760 210');svg.setAttribute('preserveAspectRatio','none');
  svg.setAttribute('role','img');svg.setAttribute('aria-label',label+' per day for the selected reporting period');
  const left=42,right=741,top=14,bottom=167;
  const axis=(tag,attributes,text='')=>{
   const el=doc.createElementNS(namespace,tag);
   for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value));
   if(text)el.textContent=text;
   svg.append(el);return el;
  };
  for(let i=0;i<=4;i++){
   const y=bottom-(bottom-top)*i/4;
   axis('line',{x1:left,y1:y,x2:right,y2:y,stroke:'currentColor','stroke-opacity':'.14'});
   axis('text',{x:2,y:y+4,fill:'currentColor','font-size':11},number(Math.round(max*i/4)));
  }
  const coords=dailySeries.map((point,i)=>({
   x:left+(right-left)*(dailySeries.length===1?.5:i/(dailySeries.length-1)),
   y:bottom-(bottom-top)*values[i]/max,
   date:point.date,value:values[i]
  }));
  axis('polyline',{points:coords.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' '),fill:'none',stroke:'#57ae8b','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'});
  const readableDate=d=>String(d).length===8?d.slice(6,8)+'/'+d.slice(4,6)+'/'+d.slice(0,4):String(d);
  for(const p of coords){
   const circle=axis('circle',{cx:p.x,cy:p.y,r:Math.min(4,Math.max(2,20/coords.length)),fill:'#57ae8b'});
   const tip=doc.createElementNS(namespace,'title');
   tip.textContent=readableDate(p.date)+': '+number(p.value)+' '+label.toLowerCase();circle.append(tip);
  }
  if(coords.length){
   axis('text',{x:left,y:199,'text-anchor':'start',fill:'currentColor','font-size':11},readableDate(coords[0].date));
   axis('text',{x:right,y:199,'text-anchor':'end',fill:'currentColor','font-size':11},readableDate(coords[coords.length-1].date));
  }
  node.append(svg);
 };
 metricSelect.addEventListener('change',chart);
 const request=async(endpoint,body)=>{
  const response=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+propertyId+':'+endpoint,{
   method:'POST',
   headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},
   body:JSON.stringify(body),cache:'no-store'
  });
  if(!response.ok){
   if(response.status===401){forgetToken();throw new Error('Google session expired. Connect again.');}
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
  if(Date.now()+5000>=tokenExpiry){forgetToken();setStatus('Your Google access expired. Connect again.',true);return;}
  const generation=++requestGeneration;
  busy=true;refresh.disabled=true;setStatus('Loading Google Analytics reports…');
  liveStatus.textContent='Checking recent activity…';
  try{
   const batches=makeGA4ReportBatches(period.value);
   // The API rejects requests containing six or more reports. Combine two legal
   // batches in the original order so parsing remains strict and consistent.
   const responses=await Promise.allSettled([
    ...batches.map(batch=>request('batchRunReports',batch)),
    request('runRealtimeReport',makeGA4RealtimeRequest())
   ]);
   if(generation!==requestGeneration)return;
   const live=responses[2];
   if(live.status==='fulfilled'){
    const values=parseGA4RealtimeResponse(live.value);
    el('ops-live-users').textContent=number(values.users);
    el('ops-live-events').textContent=number(values.events);
    liveStatus.textContent='Google Analytics Realtime · refresh to check again';
   }else{
    el('ops-live-users').textContent='—';el('ops-live-events').textContent='—';
    liveStatus.textContent='Realtime unavailable; historical reporting may still work.';
   }
   const replies=responses.slice(0,2).map(result=>{
    if(result.status==='rejected')throw result.reason;
    return result.value;
   });
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
   dailySeries=report.timeline;
   chart();
   renderRows('ops-pages',report.pages,'Page','views');
   renderRows('ops-channels',report.channels,'Channel','value');
   renderRows('ops-event-list',report.events,'Event','value');
   renderRows('ops-countries',report.countries,'Country','value');
   emptyNote.hidden=Object.values(report.kpis).some(value=>value>0);
   data.hidden=false;
   const now=new Date();
   setStatus('Google Analytics updated at '+now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+'. Reporting is consent-based and may be delayed.');
  }catch(err){
   if(generation!==requestGeneration)return;
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
    signedInUI();storeToken();loadReports();
   },
   error_callback:()=>setStatus('Google sign-in was closed or blocked. Check your browser popup settings.',true)
  });
  connect.disabled=false;
  if(!accessToken)setStatus('Connect Google Analytics to read your private reports.');
 }).catch(err=>{if(!accessToken)setStatus(err.message,true);});
 if(restored){
  setStatus('Restoring this tab’s Google session…');
  loadReports();
 }
 connect.addEventListener('click',()=>{if(tokenClient)tokenClient.requestAccessToken({prompt:''});});
 refresh.addEventListener('click',loadReports);
 period.addEventListener('change',()=>{if(accessToken)loadReports();});
 disconnect.addEventListener('click',()=>{
  forgetToken();
  setStatus('Disconnected. Session token cleared from this tab.');
 });
}
