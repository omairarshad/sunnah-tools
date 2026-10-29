import {JUZ_STARTS} from './expansionCalculations.mjs';
import {validCivilDate} from './personalTools.mjs';
import {hijriParts,HIJRI_MONTHS} from './hijriCalendars.mjs';
import {hijriToGregorian} from './calculations.mjs';
export const FEATURED_SURAHS=Object.freeze([
 {number:1,name:'Al-Fatihah',ayahs:7},{number:2,name:'Al-Baqarah',ayahs:286},
 {number:18,name:'Al-Kahf',ayahs:110},{number:36,name:'Ya-Sin',ayahs:83},
 {number:55,name:'Ar-Rahman',ayahs:78},{number:67,name:'Al-Mulk',ayahs:30},
 {number:78,name:'An-Naba',ayahs:40},{number:93,name:'Ad-Duha',ayahs:11},
 {number:112,name:'Al-Ikhlas',ayahs:4},{number:113,name:'Al-Falaq',ayahs:5},
 {number:114,name:'An-Nas',ayahs:6}
]);
export function juzIndex(search=''){
 if(typeof search!=='string'||search.length>100)return [];
 const term=search.toLowerCase().trim();
 return JUZ_STARTS.map((row,i)=>({
  number:row[0],surah:row[1],ayah:row[2],name:row[3],
  next:JUZ_STARTS[i+1]?{surah:JUZ_STARTS[i+1][1],ayah:JUZ_STARTS[i+1][2]}:null,
  startReference:row[1]+':'+row[2],url:'https://quran.com/'+row[1]+'/'+row[2]
 })).filter(item=>!term||String(item.number)===term||item.name.toLowerCase().includes(term)||item.startReference.includes(term)||('juz '+item.number).includes(term)||('para '+item.number).includes(term));
}
/** Curated, verified surah boundaries; nonfeatured surahs require a separately checked reference. */
export function hifzAssessment(plan){
 if(!plan||typeof plan!=='object'||Array.isArray(plan)||!Number.isInteger(plan.surah)||!Number.isInteger(plan.start)||
 !Number.isInteger(plan.end)||!Number.isInteger(plan.completed)||!Number.isInteger(plan.days)||plan.days<1||plan.days>3650)return null;
 const surah=FEATURED_SURAHS.find(s=>s.number===plan.surah);
 if(!surah||plan.start<1||plan.end<plan.start||plan.end>surah.ayahs)return null;
 const total=plan.end-plan.start+1;
 if(plan.completed<0||plan.completed>total)return null;
 const remaining=total-plan.completed;
 return {surah,total,remaining,perDay:Math.ceil(remaining/plan.days),percent:Math.round(plan.completed/total*100),
  nextAyah:remaining?plan.start+plan.completed:null};
}
/** Accept the old v1 count conservatively only where its reference unequivocally identifies a featured Surah. */
export function migrateHifzLegacy(old){
 if(!old||typeof old!=='object'||Array.isArray(old)||typeof old.surah!=='string')return null;
 const cleaned=old.surah.trim().toLowerCase();
 const surah=FEATURED_SURAHS.find(s=>s.name.toLowerCase()===cleaned||String(s.number)===cleaned);
 if(!surah)return null;
 const candidate={version:2,surah:surah.number,start:old.start,end:old.end,completed:old.completed,days:old.days};
 return hifzAssessment(candidate)?candidate:null;
}
export function validateHifzBackup(value){
 if(!value||value.version!==2||!hifzAssessment(value))return null;
 return {version:2,surah:value.surah,start:value.start,end:value.end,completed:value.completed,days:value.days};
}
export const TASBIH_PATTERNS=Object.freeze({
 free:[{label:'Free dhikr',goal:100}],
 '33-33-34':[{label:'SubhanAllah',goal:33},{label:'Alhamdulillah',goal:33},{label:'Allahu Akbar',goal:34}],
 '33-33-33':[{label:'SubhanAllah',goal:33},{label:'Alhamdulillah',goal:33},{label:'Allahu Akbar',goal:33},{label:'Final declaration of Tawhid (read separately)',goal:1}]
});
export function tasbihStep(mode,stage,count){
 const stages=TASBIH_PATTERNS[mode];
 if(!stages||!Number.isInteger(stage)||stage<0||stage>=stages.length||!Number.isInteger(count)||count<0||count>100000)return null;
 const current=stages[stage];
 return {label:current.label,goal:current.goal,count,complete:count>=current.goal,remaining:Math.max(0,current.goal-count),
  totalGoal:stages.reduce((n,s)=>n+s.goal,0),canAdvance:count>=current.goal&&stage<stages.length-1};
}
export const QURAN_DUAS=Object.freeze([
 {id:'knowledge',title:'Increase in knowledge',verse:'20:114',arabic:'رَبِّ زِدْنِي عِلْمًا',meaning:'My Lord, increase me in knowledge.',category:'quran'},
 {id:'good',title:'Good in both worlds',verse:'2:201',arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',meaning:'Our Lord, give us good in this world and in the Hereafter, and protect us from the Fire.',category:'quran'},
 {id:'steadfast',title:'Steadfastness',verse:'3:8',arabic:'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',meaning:'Our Lord, do not cause our hearts to deviate after You have guided us; grant us mercy from Yourself.',category:'quran'},
 {id:'yunus',title:'Supplication of Yunus',verse:'21:87',arabic:'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',meaning:'There is no deity except You; glory be to You. I was among the wrongdoers.',category:'quran'},
 {id:'parents',title:'Mercy for parents',verse:'17:24',arabic:'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',meaning:'My Lord, have mercy on them as they raised me when I was small.',category:'quran'}
]);
export const ADHKAR_REFERENCES=Object.freeze([
 {id:'morning',period:'Morning/evening',title:'Al-Ikhlas, Al-Falaq and An-Nas',source:'https://sunnah.com/abudawud:5082',note:'Recite the three Surahs as described in the report. Check the actual Arabic and full context in the source.'},
 {id:'after-prayer',period:'After Salah',title:'SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 33, then Tawhid declaration',source:'https://sunnah.com/muslim:597a',note:'A reported post-prayer pattern; do not automatically apply its numbers to every Quranic dua.'},
 {id:'evening',period:'Morning/evening',title:'Sayyid al-Istighfar',source:'https://sunnah.com/bukhari:6306',note:'Read the authentic text, meaning and time wording at the source rather than relying on an unsourced paraphrase.'}
]);
export function hijriAge(birth,today){
 if(!validCivilDate(birth)||!validCivilDate(today)||birth>today)return null;
 const born=new Date(birth+'T12:00:00Z'),now=new Date(today+'T12:00:00Z');
 const hBirth=hijriParts(born),hNow=hijriParts(now);
 if(!hBirth||!hNow||hBirth.year<1300||hBirth.year>1598||hNow.year>1599)return null;
 const gy=now.getUTCFullYear()-born.getUTCFullYear();
 const leapBirthday=(born.getUTCMonth()===1&&born.getUTCDate()===29)?new Date(Date.UTC(now.getUTCFullYear(),1,28,12)):new Date(Date.UTC(now.getUTCFullYear(),born.getUTCMonth(),born.getUTCDate(),12));
 const gregorianAge=gy-(now<leapBirthday?1:0);
 const currentYearAnniversary=hijriToGregorian(hNow.year,hBirth.month,hBirth.day)??(hBirth.day===30?hijriToGregorian(hNow.year,hBirth.month,29):null);
 if(!currentYearAnniversary)return null;
 const hijriYears=hNow.year-hBirth.year-(now<currentYearAnniversary?1:0);
 if(hijriYears<0)return null;
 let nextYear=hNow.year+(now>=currentYearAnniversary?1:0);
 let next=hijriToGregorian(nextYear,hBirth.month,hBirth.day);
 let clamped=false;
 if(!next&&hBirth.day===30){next=hijriToGregorian(nextYear,hBirth.month,29);clamped=!!next}
 if(!next)return null;
 return {birth,today,hBirth,hNow,gregorianAge,hijriYears,nextHijriAnniversary:next.toISOString().slice(0,10),nextYear,clamped,
  birthHijriText:hBirth.day+' '+HIJRI_MONTHS[hBirth.month-1]+' '+hBirth.year+' AH',
  todayHijriText:hNow.day+' '+HIJRI_MONTHS[hNow.month-1]+' '+hNow.year+' AH'};
}
