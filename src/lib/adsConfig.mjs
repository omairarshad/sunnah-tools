/** Safe, explicit publisher configuration. Invalid or incomplete settings always disable serving. */
export function normalizePublisherId(id=''){
 const value=String(id).trim();
 return /^ca-pub-[0-9]{16}$/.test(value)?value:null;
}
export function adsTxtLine(id=''){
 const value=normalizePublisherId(id);
 return value?'google.com, '+value.replace('ca-','')+', DIRECT, f08c47fec0942fa0\n':null;
}
export function decideAds({publisherId,adsEnabled,cmpReady,siteReady,homeSlot,toolSlot}){
 const client=normalizePublisherId(publisherId);
 const slots={home:/^[0-9]{5,20}$/.test(String(homeSlot??''))?String(homeSlot):null,tool:/^[0-9]{5,20}$/.test(String(toolSlot??''))?String(toolSlot):null};
 const ready=Boolean(client)&&adsEnabled==='true'&&cmpReady==='true'&&siteReady==='true'&&Boolean(slots.home)&&Boolean(slots.tool);
 return {client,slots,enabled:ready,canVerify:Boolean(client)};
}
