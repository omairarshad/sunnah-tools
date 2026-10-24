export const SECTIONS=['promotions','directory','guides'];
export function safePromoUrl(raw){
 try {
  const url=new URL(String(raw));
  if(url.protocol!=='https:'||url.username||url.password||!url.hostname||url.hostname==='localhost')return null;
  return url.toString();
 }catch{return null}
}
export function orderedSections(input){
 const seen=new Set(),result=[];
 for(const section of Array.isArray(input)?input:[]){
  if(SECTIONS.includes(section)&&!seen.has(section)){seen.add(section);result.push(section)}
 }
 for(const section of SECTIONS)if(!seen.has(section))result.push(section);
 return result;
}
export function validTone(tone){
 return ['teal','blue','violet','coral','rose','amber','emerald','mint','indigo'].includes(tone)?tone:'teal';
}

/** Homepage artwork is always a self-hosted file uploaded through the GitHub CMS. */
export function safePromoImage(raw){
 const path=String(raw??'').trim();
 if(!/^\/media\/[A-Za-z0-9._\/-]+\.(?:svg|png|jpe?g|webp|avif)$/.test(path))return null;
 if(path.includes('..')||path.includes('//'))return null;
 return path;
}
