import {hijriToGregorian} from './calculations.mjs';
import {hijriParts} from './hijriCalendars.mjs';

export const FARD_RAKATS=Object.freeze([
 {prayer:'Fajr',fard:2},{prayer:'Dhuhr',fard:4},{prayer:'Asr',fard:4},
 {prayer:'Maghrib',fard:3},{prayer:'Isha',fard:4}
]);
/* Conventional starts of each of the 30 Juz; Quran references do not assume a Mushaf page count. */
export const JUZ_STARTS=Object.freeze([
 [1,1,1,'Al-Fatihah'],[2,2,142,'Al-Baqarah'],[3,2,253,'Al-Baqarah'],
 [4,3,93,'Ali Imran'],[5,4,24,'An-Nisa'],[6,4,148,'An-Nisa'],
 [7,5,82,"Al-Ma'idah"],[8,6,111,"Al-An'am"],[9,7,88,"Al-A'raf"],
 [10,8,41,'Al-Anfal'],[11,9,93,'At-Tawbah'],[12,11,6,'Hud'],
 [13,12,53,'Yusuf'],[14,15,1,'Al-Hijr'],[15,17,1,'Al-Isra'],
 [16,18,75,'Al-Kahf'],[17,21,1,'Al-Anbiya'],[18,23,1,"Al-Mu'minun"],
 [19,25,21,'Al-Furqan'],[20,27,56,'An-Naml'],[21,29,46,'Al-Ankabut'],
 [22,33,31,'Al-Ahzab'],[23,36,28,'Ya-Sin'],[24,39,32,'Az-Zumar'],
 [25,41,47,'Fussilat'],[26,46,1,'Al-Ahqaf'],[27,51,31,'Adh-Dhariyat'],
 [28,58,1,'Al-Mujadila'],[29,67,1,'Al-Mulk'],[30,78,1,'An-Naba']
]);
/* Description of ingredient sources only. No automatic religious ruling or certification. */
export const FOOD_ADDITIVES=Object.freeze([
 {code:'E120',name:'Carmines / cochineal',source:'Red colouring derived from cochineal insects.',check:'Insect origin requires religious assessment and certification checks.'},
 {code:'E322',name:'Lecithins',source:'Often sourced from soy, sunflower or egg.',check:'Check the actual source and other ingredients when relevant.'},
 {code:'E422',name:'Glycerol (glycerin)',source:'Can be made from plant oil, animal fat or synthetically.',check:'Ask the manufacturer which source is used.'},
 {code:'E471',name:'Mono- and diglycerides of fatty acids',source:'May be produced from plant oils or animal fats.',check:'Origin cannot be identified from the E-number alone.'},
 {code:'E472e',name:'DATEM (emulsifier)',source:'Made using fatty acid esters; starting fats can vary.',check:'Confirm manufacturing origin and applicable certification.'},
 {code:'E904',name:'Shellac',source:'A resin secreted by lac insects, used as a glazing agent.',check:'Scholarly treatment may differ; check trusted certification.'},
 {code:'E100',name:'Curcumin',source:'Yellow colouring commonly extracted from turmeric.',check:'Examine the entire product; an individual additive does not certify it.'},
 {code:'E300',name:'Ascorbic acid (vitamin C)',source:'Commonly produced by industrial synthesis or fermentation.',check:'Check other ingredients if you need a finished-product verdict.'},
 {code:'E330',name:'Citric acid',source:'Usually produced through microbial fermentation.',check:'A source description is not an automatic product certification.'},
 {code:'E406',name:'Agar',source:'Gelling ingredient extracted from marine algae.',check:'Check the rest of the product and its certification where needed.'}
]);

const isValidDate=(s)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(new Date(s+'T12:00:00Z').getTime());
export function nextHawlAnniversary(reference,today=new Date()){
 if(!isValidDate(reference))return null;
 const parsed=new Date(reference+'T12:00:00Z'),part=hijriParts(parsed);
 if(!part||parsed>today)return null;
 for(let delta=1;delta<=120;delta++){
  const year=part.year+delta;
  if(year>1599)return null;
  const end=hijriToGregorian(year,part.month,part.day)??(part.day===30?hijriToGregorian(year,part.month,29):null);
  if(end&&end.getTime()>=today.getTime()-86400000)return {date:end.toISOString().slice(0,10),year,month:part.month,day:part.day};
 }
 return null;
}
export function dhulHijjahDays(year){
 if(!Number.isInteger(year)||year<1300||year>1599)return [];
 return Array.from({length:10},(_,i)=>{
  const d=hijriToGregorian(year,12,i+1);
  return d?{day:i+1,date:d.toISOString().slice(0,10)}:null;
 }).filter((value)=>value!==null);
}
export function portfolioEstimate(values,debts){
 if(!Array.isArray(values)||!values.length||values.some(x=>!Number.isFinite(x)||x<0)||!Number.isFinite(debts)||debts<0)return null;
 const gross=values.reduce((sum,x)=>sum+x,0);
 if(!Number.isFinite(gross))return null;
 const net=Math.max(0,gross-debts);
 return {gross,net,conditionalZakat:Math.round(net*0.025*100)/100};
}
