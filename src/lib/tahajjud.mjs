/** The "last third" uses sunset to the next Fajr; this is not a prayer obligation. */
export function clockMinutes(value){
 if(typeof value!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))return null;
 const [h,m]=value.split(':').map(Number);return h*60+m;
}
export function timeOnClock(minutes){
 if(!Number.isFinite(minutes))return null;
 const rounded=((Math.round(minutes)%1440)+1440)%1440;
 return String(Math.floor(rounded/60)).padStart(2,'0')+':'+String(rounded%60).padStart(2,'0');
}
export function manualNightWindow(maghrib,fajr){
 const m=clockMinutes(maghrib),f=clockMinutes(fajr);
 if(m===null||f===null)return null;
 const length=1440-m+f;
 // Manual form models a sunset followed by *next-day* Fajr. Reject abnormal intervals.
 if(length<120||length>1320)return null;
 return {maghrib,fajr,nightMinutes:length,thirdMinutes:length/3,
  midpoint:timeOnClock(m+length/2),firstThirdEnd:timeOnClock(m+length/3),
  lastThirdStart:timeOnClock(m+length*2/3)};
}
export function calculatedNightWindow(maghrib,followingFajr,zone){
 if(!(maghrib instanceof Date)||!(followingFajr instanceof Date))return null;
 const ms=followingFajr.getTime()-maghrib.getTime();
 if(!Number.isFinite(ms)||ms<120*60000||ms>1320*60000)return null;
 const format=d=>new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:false}).format(d);
 const minute=(portion)=>format(new Date(maghrib.getTime()+ms*portion));
 try{return {maghrib:format(maghrib),fajr:format(followingFajr),nightMinutes:ms/60000,
  thirdMinutes:ms/180000,midpoint:minute(.5),firstThirdEnd:minute(1/3),lastThirdStart:minute(2/3),
  lastThirdDate:new Date(maghrib.getTime()+ms*2/3),endDate:followingFajr}}catch{return null}
}
