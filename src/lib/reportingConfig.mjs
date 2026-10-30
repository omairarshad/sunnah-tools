/** GA4 Data API reporting config; tokens never belong in the static build. */
export function reportingSettings({propertyId='',oauthClientId=''}={}){
 const prop=String(propertyId||'').trim(),client=String(oauthClientId||'').trim();
 return {
  propertyId:/^[1-9][0-9]{5,14}$/.test(prop)?prop:null,
  oauthClientId:/^[0-9]{8,20}-[a-z0-9_-]{20,100}\.apps\.googleusercontent\.com$/.test(client)?client:null
 };
}
export function makeGA4Reports(days=28){
 const n=[7,28,90].includes(Number(days))?Number(days):28;
 const dateRanges=[{startDate:(n-1)+'daysAgo',endDate:'today'}];
 const spec=(dimensions,metrics,limit=100)=>({
  dateRanges,
  dimensions:dimensions.map(name=>({name})),
  metrics:metrics.map(name=>({name})),
  limit,
  ...(dimensions.length&&dimensions[0]==='date'?{orderBys:[{dimension:{dimensionName:'date'}}]}:
      dimensions.length?{orderBys:[{metric:{metricName:metrics[0]},desc:true}]}:{})
 });
 return {requests:[
  spec([],['activeUsers','sessions','screenPageViews','eventCount'],1),
  spec(['date'],['activeUsers','screenPageViews'],100),
  spec(['pagePath'],['screenPageViews','activeUsers'],12),
  spec(['sessionDefaultChannelGroup'],['sessions'],8),
  spec(['eventName'],['eventCount'],12),
  spec(['country'],['activeUsers'],10)
 ]};
}
export function parseGA4Response(data){
 if(!data||!Array.isArray(data.reports)||data.reports.length!==6)throw new Error('GA4 returned an unexpected report format');
 const rows=(i)=>Array.isArray(data.reports[i]?.rows)?data.reports[i].rows:[];
 const d=(r,i=0)=>String(r?.dimensionValues?.[i]?.value||'');
 const m=(r,i=0)=>{const v=Number(r?.metricValues?.[i]?.value);return Number.isFinite(v)&&v>=0?v:0};
 const first=rows(0)[0];
 return {
  kpis:{users:m(first,0),sessions:m(first,1),views:m(first,2),events:m(first,3)},
  timeline:rows(1).map(r=>({date:d(r),users:m(r,0),views:m(r,1)})),
  pages:rows(2).map(r=>({name:d(r),views:m(r,0),users:m(r,1)})),
  channels:rows(3).map(r=>({name:d(r),value:m(r)})),
  events:rows(4).map(r=>({name:d(r),value:m(r)})),
  countries:rows(5).map(r=>({name:d(r),value:m(r)}))
 };
}
