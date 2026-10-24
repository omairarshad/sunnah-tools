/** GeoNames cities15000 line parser; columns follow GeoNames dump specification.
 * Source: https://download.geonames.org/export/dump/cities15000.zip
 * Licence: CC BY 4.0, attribution: https://www.geonames.org/
 */
export function parseGeoNamesCities(tsv){
 const rows=[];
 for(const line of tsv.split(/\r?\n/)){
  if(!line)continue;
  const cols=line.split('\t');
  if(cols.length<19)continue;
  const name=(cols[2]||cols[1]).trim(),country=cols[8].trim(),region=cols[10].trim();
  const latitude=Number(cols[4]),longitude=Number(cols[5]),population=Number(cols[14]),timezone=cols[17].trim();
  if(!name||!/^[A-Z]{2}$/.test(country)||!/^[A-Za-z_]+\/[A-Za-z0-9_+\/-]+$/.test(timezone))continue;
  if(!Number.isFinite(latitude)||Math.abs(latitude)>90||!Number.isFinite(longitude)||Math.abs(longitude)>180)continue;
  if(!Number.isFinite(population)||population<0)continue;
  rows.push([name,country,region,latitude,longitude,timezone,population]);
 }
 rows.sort((a,b)=>Number(b[6])-Number(a[6])||String(a[0]).localeCompare(String(b[0])));
 return rows;
}
export function matchCities(rows,query,maxResults=10){
 const text=String(query).trim().toLocaleLowerCase();
 if(text.length<2)return [];
 const begins=[],includes=[];
 for(const row of rows){
  const name=String(row[0]).toLocaleLowerCase(),cc=String(row[1]).toLocaleLowerCase();
  if(name.startsWith(text)||cc+' '+name===text)begins.push(row);
  else if(name.includes(text))includes.push(row);
  if(begins.length>=maxResults)break;
 }
 return [...begins,...includes].slice(0,maxResults);
}
