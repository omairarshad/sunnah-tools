/** Qibla context, based on spherical distance to the Kaaba. */
export const KAABA={latitude:21.4224779,longitude:39.8251832};
const EARTH_KM=6371.0088;
const radians=n=>n*Math.PI/180;
export const normalizeBearing=n=>Number.isFinite(n)?((n%360)+360)%360:null;
export function cardinalDirection(bearing){
 const n=normalizeBearing(bearing);
 if(n===null)return null;
 const abbreviations=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
 const labels=['north','north-north-east','north-east','east-north-east','east','east-south-east','south-east','south-south-east','south','south-south-west','south-west','west-south-west','west','west-north-west','north-west','north-north-west'];
 const index=Math.floor((n+11.25)/22.5)%16;
 return {abbreviation:abbreviations[index],label:labels[index]};
}
export function qiblaContext(latitude,longitude,bearing){
 if(![latitude,longitude,bearing].every(Number.isFinite)||latitude<-90||latitude>90||longitude<-180||longitude>180||bearing<0||bearing>360)return null;
 const p1=radians(latitude),p2=radians(KAABA.latitude);
 const dp=radians(KAABA.latitude-latitude),dl=radians(KAABA.longitude-longitude);
 const a=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 const clamped=Math.max(0,Math.min(1,a));
 const distanceKm=EARTH_KM*2*Math.atan2(Math.sqrt(clamped),Math.sqrt(1-clamped));
 if(distanceKm<0.1)return {status:'at-kaaba',distanceKm};
 if(Math.PI*EARTH_KM-distanceKm<0.1)return {status:'antipode',distanceKm};
 return {status:'ok',distanceKm,cardinal:cardinalDirection(bearing),bearing:normalizeBearing(bearing)};
}
/** NOAA east-positive convention: true = magnetic + declination. */
export function magneticBearing(trueBearing,declinationEast){
 if(!Number.isFinite(trueBearing)||trueBearing<0||trueBearing>360||!Number.isFinite(declinationEast)||Math.abs(declinationEast)>30)return null;
 return Math.round(normalizeBearing(trueBearing-declinationEast)*10)/10;
}
