export function analyticsSettings({measurementId='',enabled='false',dashboardUrl=''}={}){
 const id=/^G-[A-Z0-9]{6,20}$/.test(String(measurementId).trim())?String(measurementId).trim():null;
 let report=null;
 try{
  const uri=new URL(String(dashboardUrl));
  if(uri.protocol==='https:'&&['lookerstudio.google.com','datastudio.google.com'].includes(uri.hostname)&&(/^\/reporting\//.test(uri.pathname)||/^\/embed\/reporting\//.test(uri.pathname)))report=uri.href;
 }catch{}
 return {id,enabled:Boolean(id)&&enabled==='true',dashboardUrl:report};
}
