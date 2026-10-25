import {useEffect,useMemo,useState} from 'react';
import {hijriParts,HIJRI_MONTHS} from '../lib/hijriCalendars.mjs';
import {FARD_RAKATS,JUZ_STARTS,FOOD_ADDITIVES,nextHawlAnniversary,dhulHijjahDays,portfolioEstimate} from '../lib/expansionCalculations.mjs';
const dateToday=()=>{const d=new Date(),f=(v:number)=>String(v).padStart(2,'0');return d.getFullYear()+'-'+f(d.getMonth()+1)+'-'+f(d.getDate())};
const money=(n:number,currency:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(n);
const pretty=(date:string)=>new Intl.DateTimeFormat('en-GB',{dateStyle:'long',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
const currencyOptions=['GBP','USD','EUR','PKR','SAR','AED','CAD','AUD','INR'];
function Currency({value,change}:{value:string;change:(v:string)=>void}){return <label>Currency<select value={value} onChange={e=>change(e.target.value)}>{currencyOptions.map(s=><option key={s}>{s}</option>)}</select></label>}
function SourceNote({children}:{children:React.ReactNode}){return <p className="small expansion-note">{children}</p>}
function Rakats(){
 return <div className="expansion-tool">
  <p>The obligatory (Fard) rakats in the five daily prayers:</p>
  <div className="table-wrap"><table className="expansion-table"><thead><tr><th>Prayer</th><th>Fard rakats</th></tr></thead><tbody>{FARD_RAKATS.map(row=><tr key={row.prayer}><th scope="row">{row.prayer}</th><td><strong>{row.fard}</strong></td></tr>)}</tbody></table></div>
  <p className="small">Additional Sunnah prayers and Witr have distinct rulings. The number and status of recommended units depend on your school and circumstances. This chart deliberately lists the five Fard prayers only.</p>
  <button type="button" onClick={()=>window.print()}>Print the prayer chart</button>
  <SourceNote>See <a href="https://quran.com/4/103" target="_blank" rel="noopener noreferrer">Quran 4:103</a> on the prescribed prayer. For the details of Sunnah and Witr prayers, check your school's teaching.</SourceNote>
 </div>
}
const DUAS=[
 {id:'knowledge',name:'Seeking knowledge',arabic:'رَبِّ زِدْنِي عِلْمًا',latin:'Rabbi zidni ilma',meaning:'My Lord, increase me in knowledge.',verse:'20:114'},
 {id:'good',name:'Good in this world and the next',arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',latin:"Rabbana atina fi d-dunya hasanatan wa fi l-akhirati hasanatan wa qina 'adhaba n-nar",meaning:'Our Lord, grant us good in this world and good in the next, and protect us from the Fire.',verse:'2:201'},
 {id:'steadfast',name:'Steadfast hearts',arabic:'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',latin:'Rabbana la tuzigh qulubana bada idh hadaytana wa hab lana min ladunka rahmah, innaka anta l-wahhab',meaning:'Our Lord, do not let our hearts turn away after You have guided us. Grant us mercy from You; You are the Giver.',verse:'3:8'},
 {id:'yunus',name:'Prayer of Yunus',arabic:'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',latin:'La ilaha illa anta subhanaka inni kuntu mina z-zalimin',meaning:'There is no deity but You. Glory be to You. I was among the wrongdoers.',verse:'21:87'},
 {id:'family',name:'Prayer for Salah',arabic:'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',latin:"Rabbi j'alni muqima s-salati wa min dhurriyyati rabbana wa taqabbal dua",meaning:'My Lord, make me one who maintains prayer, and my descendants too. Our Lord, accept my supplication.',verse:'14:40'}
];
function Adhkar(){
 const [selected,setSelected]=useState(DUAS[0].id),[count,setCount]=useState(0);
 const item=DUAS.find(d=>d.id===selected)??DUAS[0];
 return <div className="expansion-tool">
  <p>Select a Quranic dua to read. Each entry includes its Arabic text and reference; the counter is optional.</p>
  <label>Supplication<select value={selected} onChange={e=>{setSelected(e.target.value);setCount(0)}}>{DUAS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
  <div className="expansion-reading"><p className="expansion-arabic" lang="ar" dir="rtl">{item.arabic}</p><p>{item.latin}</p><p><strong>Meaning:</strong> {item.meaning}</p><a href={'https://quran.com/'+item.verse} target="_blank" rel="noopener noreferrer">Quran {item.verse}</a></div>
  <div className="action-row"><button onClick={()=>setCount(v=>Math.min(v+1,100000))}>Read again · {count}</button><button type="button" className="secondary" onClick={()=>setCount(0)}>Reset count</button></div>
  <SourceNote>These Quranic duas are not presented as a complete morning/evening adhkar collection. No special repetition schedule is prescribed by this tool. The English text is a concise explanation, not a substitute for full tafsir.</SourceNote>
 </div>
}
function Additives(){
 const [term,setTerm]=useState('');
 const matches=FOOD_ADDITIVES.filter(x=>(x.code+' '+x.name+' '+x.source).toLowerCase().includes(term.toLowerCase().trim()));
 return <div className="expansion-tool">
  <label>Search E-number or additive name<input type="search" placeholder="e.g. E471 or glycerol" value={term} onChange={e=>setTerm(e.target.value)} /></label>
  <p className="small">Starter directory: {FOOD_ADDITIVES.length} common examples. This is not a halal certification service or a complete additives database.</p>
  <div className="expansion-results">{matches.map(x=><article key={x.code} className="expansion-result"><h3>{x.code} — {x.name}</h3><p>{x.source}</p><p><strong>What to check:</strong> {x.check}</p></article>)}{!matches.length&&<p>No matching entry in this limited directory. Try a different E-number or check the manufacturer's ingredient information.</p>}</div>
  <SourceNote>Food additive naming is regulated, but an E-number alone does not prove a product's halal status. Read the <a href="https://www.food.gov.uk/safety-hygiene/food-additives" target="_blank" rel="noopener noreferrer">UK Food Standards Agency's additives guidance</a> and ask the manufacturer or a recognised halal certifier for product-specific sourcing.</SourceNote>
 </div>
}
function Hawl(){
 const [started,setStarted]=useState(dateToday);
 const next=nextHawlAnniversary(started);
 return <div className="expansion-tool">
  <label>Reference date for your Zakat review<input type="date" value={started} onChange={e=>setStarted(e.target.value)} /></label>
  {next?<div className="result" role="status"><span>Next estimated Hijri anniversary</span><strong>{pretty(next.date)}</strong><small>{next.day} {HIJRI_MONTHS[next.month-1]} {next.year} AH (Umm al-Qura)</small></div>:<p className="warn">Choose a valid date in the past supported by the Umm al-Qura calendar.</p>}
  <p>Use this as a reminder to review your qualifying wealth. A Hijri year is shorter than the Gregorian calendar year.</p>
  <SourceNote>Nisab, hawl continuity, types of wealth and debts affect liability. This date does not establish an amount due. For guidance see <a href="https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/nisab/" target="_blank" rel="noopener noreferrer">Islamic Relief's Nisab information</a>.</SourceNote>
 </div>
}
function downloadCalendar(days:{day:number;date:string}[]){
 const entries=days.map(d=>{const end=new Date(d.date+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+1);return ['BEGIN:VEVENT','UID:dhul-'+d.date+'@sunnah.tools','DTSTART;VALUE=DATE:'+d.date.replaceAll('-',''),'DTEND;VALUE=DATE:'+end.toISOString().slice(0,10).replaceAll('-',''),'SUMMARY:Dhul Hijjah day '+d.day+(d.day===9?' - estimated Arafah':d.day===10?' - estimated Eid al-Adha':''),'DESCRIPTION:Umm al-Qura estimate. Confirm local and official announcement.','END:VEVENT'].join('\r\n')});
 const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sunnah Tools//Dhul Hijjah//EN',...entries,'END:VCALENDAR'].join('\r\n');
 const url=URL.createObjectURL(new Blob([text],{type:'text/calendar'}));const a=document.createElement('a');a.href=url;a.download='dhul-hijjah-dates.ics';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function DhulHijjah(){
 const current=hijriParts(new Date());
 const currentYear=current?.year??1448;
 const proposed=current?.month===12&&current.day>10?currentYear+1:current?.month===12?currentYear:currentYear;
 const [year,setYear]=useState(proposed);
 const days=useMemo(()=>dhulHijjahDays(year),[year]);
 return <div className="expansion-tool">
  <label>Hijri year (AH)<input type="number" min="1300" max="1599" step="1" value={year} onChange={e=>setYear(Number(e.target.value))}/></label>
  {days.length===10?<><div className="table-wrap"><table><thead><tr><th>Dhul Hijjah</th><th>Estimated Gregorian date</th><th>Observance</th></tr></thead><tbody>{days.map(d=><tr key={d.day}><td>{d.day}</td><td>{pretty(d.date)}</td><td>{d.day===9?'Arafah (estimated)':d.day===10?'Eid al-Adha (estimated)':'First ten days'}</td></tr>)}</tbody></table></div><div className="action-row"><button type="button" onClick={()=>downloadCalendar(days)}>Add dates to calendar</button><button type="button" className="secondary" onClick={()=>window.print()}>Print dates</button></div></>:<p className="warn">Choose a supported Hijri year.</p>}
  <SourceNote>Dates use the Umm al-Qura calendar and may differ from local or official Saudi announcements. Eid al-Adha is not a voluntary fasting day. For the significance of the ten nights see <a href="https://quran.com/89/1-2" target="_blank" rel="noopener noreferrer">Quran 89:1–2</a>.</SourceNote>
 </div>
}
const TRAVEL_NOTES:Record<string,string>={
 hanafi:'In Hanafi teaching, guidance on journey distance and the intention to stay (often discussed around fifteen days) has specific conditions.',
 shafii:'In Shafi’i teaching, the recognised travel distance and intended duration (commonly discussed around four complete days) have detailed conditions.',
 maliki:'Maliki rules about travel distance, intent and period of residence must be checked with a qualified teacher.',
 hanbali:'Hanbali guidance considers qualifying journey distance and length of stay; details can differ according to circumstances.'
};
function Qasr(){
 const [school,setSchool]=useState('hanafi'),[km,setKm]=useState(''),[stay,setStay]=useState('');
 return <div className="expansion-tool">
  <p>On a qualifying journey, Dhuhr, Asr and Isha may be prayed as two Fard rakats instead of four. Fajr remains two and Maghrib remains three.</p>
  <div className="table-wrap"><table><thead><tr><th>Prayer</th><th>Ordinary Fard</th><th>Under qualifying Qasr</th></tr></thead><tbody>{FARD_RAKATS.map(d=><tr key={d.prayer}><td>{d.prayer}</td><td>{d.fard}</td><td>{d.fard===4?2:d.fard}</td></tr>)}</tbody></table></div>
  <label>School for guidance notes<select value={school} onChange={e=>setSchool(e.target.value)}><option value="hanafi">Hanafi</option><option value="shafii">Shafi’i</option><option value="maliki">Maliki</option><option value="hanbali">Hanbali</option></select></label>
  <div className="two"><label>Travel distance, one way (km, optional)<input type="number" min="0" value={km} onChange={e=>setKm(e.target.value)}/></label><label>Intended stay (days, optional)<input type="number" min="0" value={stay} onChange={e=>setStay(e.target.value)}/></label></div>
  <div className="expansion-result"><h3>What to check</h3><p>{TRAVEL_NOTES[school]}</p>{(km||stay)&&<p>Your details: {km||'unspecified'} km; {stay||'unspecified'} day(s). These entries do not establish eligibility.</p>}</div>
  <SourceNote>This is a school-aware reference, not a Qasr eligibility calculator. Where a journey starts, residence intention, permissible distance and prayer combining are all context-sensitive. See <a href="https://quran.com/4/101" target="_blank" rel="noopener noreferrer">Quran 4:101</a> and seek local guidance.</SourceNote>
 </div>
}
function Juz(){
 const [query,setQuery]=useState('');
 const entries=JUZ_STARTS.filter(row=>(String(row[0])+' '+row[3]+' '+row[1]+':'+row[2]).toLowerCase().includes(query.toLowerCase().trim()));
 return <div className="expansion-tool">
  <label>Juz number or Surah name<input type="search" value={query} placeholder="e.g. 30, Al-Kahf" onChange={e=>setQuery(e.target.value)}/></label>
  <div className="table-wrap"><table><thead><tr><th>Juz</th><th>Starts at</th><th>Verse</th></tr></thead><tbody>{entries.map(d=><tr key={d[0]}><th scope="row">{d[0]}</th><td>{d[3]}</td><td><a href={'https://quran.com/'+d[1]+'/'+d[2]} target="_blank" rel="noopener noreferrer">{d[1]}:{d[2]}</a></td></tr>)}</tbody></table></div>
  {!entries.length&&<p>No matching Juz in the index.</p>}
  <SourceNote>Each reference is the beginning of a Juz; divisions do not correspond to the same page numbers in every Mushaf. Verify recitation against your Quran copy.</SourceNote>
 </div>
}
function Investments(){
 const [cash,setCash]=useState(''),[stocks,setStocks]=useState(''),[crypto,setCrypto]=useState(''),[other,setOther]=useState(''),[debt,setDebt]=useState('0'),[currency,setCurrency]=useState('GBP');
 const input=[cash,stocks,crypto,other,debt],valid=input.every(v=>v===''||(Number.isFinite(Number(v))&&Number(v)>=0));
 const estimate=valid&&input.slice(0,4).some(v=>v!==''&&Number(v)>0)?portfolioEstimate(input.slice(0,4).map(v=>v===''?0:Number(v)),debt===''?0:Number(debt)):null;
 return <div className="expansion-tool">
  <Currency value={currency} change={setCurrency}/>
  <div className="two">{[['Cash or exchange balance',cash,setCash],['Market value of shares',stocks,setStocks],['Crypto holdings value',crypto,setCrypto],['Other investments',other,setOther],['Potentially deductible liabilities',debt,setDebt]].map(([label,value,change])=><label key={label as string}>{label as string}<input type="number" min="0" step="any" inputMode="decimal" value={value as string} onChange={e=>(change as (s:string)=>void)(e.target.value)} placeholder="0"/></label>)}</div>
  {estimate?<div className="two"><div className="result"><span>Net value of entered holdings</span><strong>{money(estimate.net,currency)}</strong></div><div className="result"><span>Illustrative 2.5% Zakat</span><strong>{money(estimate.conditionalZakat,currency)}</strong></div></div>:<p className="small">Enter non-negative market valuations to see a conditional illustration.</p>}
  <SourceNote>Shares, pensions, managed funds and cryptocurrencies require appropriate classification and religious treatment. Not every asset or liability is necessarily included, and this does not test Nisab or hawl. Use verified prices and check your applicable rulings before payment.</SourceNote>
 </div>
}
type HifzPlan={surah:string;start:number;end:number;completed:number;days:number};
function Hifz(){
 const [plan,setPlan]=useState<HifzPlan>({surah:'',start:1,end:20,completed:0,days:14}),[ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem('sunnah-hifz-plan-v1')??'null');if(raw&&typeof raw.surah==='string'&&raw.surah.length<120&&[raw.start,raw.end,raw.completed,raw.days].every((n:unknown)=>Number.isSafeInteger(n)&&typeof n==='number'&&n>=0&&n<=100000)){setPlan(raw)}}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem('sunnah-hifz-plan-v1',JSON.stringify(plan))}catch{}},[plan,ready]);
 const total=plan.end-plan.start+1,valid=plan.start>=1&&plan.end>=plan.start&&plan.end<=9999&&plan.completed>=0&&plan.completed<=total&&plan.days>0&&plan.days<=3650;
 const update=(key:keyof HifzPlan,value:string)=>setPlan(v=>({...v,[key]:key==='surah'?value:Number(value)}));
 return <div className="expansion-tool">
  <label>Surah name or reference<input type="text" maxLength={120} value={plan.surah} onChange={e=>update('surah',e.target.value)} placeholder="e.g. Al-Mulk"/></label>
  <div className="two"><label>Starting Ayah<input type="number" min="1" value={plan.start} onChange={e=>update('start',e.target.value)}/></label><label>Final Ayah<input type="number" min="1" value={plan.end} onChange={e=>update('end',e.target.value)}/></label><label>Verses memorised<input type="number" min="0" value={plan.completed} onChange={e=>update('completed',e.target.value)}/></label><label>Goal days remaining<input type="number" min="1" value={plan.days} onChange={e=>update('days',e.target.value)}/></label></div>
  {valid?<><div className="two"><div className="result"><span>Completed</span><strong>{plan.completed} / {total}</strong></div><div className="result"><span>Target verses per day</span><strong>{Math.ceil((total-plan.completed)/plan.days)}</strong></div></div><progress value={plan.completed} max={total} aria-label="Memorisation progress"/><div className="action-row"><button type="button" onClick={()=>setPlan(v=>({...v,completed:Math.min(total,v.completed+1)}))} disabled={plan.completed===total}>+ 1 verse</button><button className="secondary" onClick={()=>setPlan(v=>({...v,completed:Math.max(0,v.completed-1)}))} disabled={!plan.completed}>Undo</button><button className="secondary" onClick={()=>window.print()}>Print plan</button></div></>:<p className="warn">Enter a valid verse range, completed count and number of days.</p>}
  <SourceNote>Your plan is stored on this device. The Quranic verse count you enter should match the Surah; the tracker does not validate boundaries or recitation quality. Regular revision and teacher feedback matter more than numerical progress.</SourceNote>
 </div>
}
export function ExpansionTool({slug}:{slug:string}){
 if(slug==='prayer-rakats-chart')return <Rakats/>;
 if(slug==='daily-adhkar')return <Adhkar/>;
 if(slug==='halal-additives-checker')return <Additives/>;
 if(slug==='zakat-anniversary-calculator')return <Hawl/>;
 if(slug==='dhul-hijjah-planner')return <DhulHijjah/>;
 if(slug==='travel-prayer-guide')return <Qasr/>;
 if(slug==='quran-juz-finder')return <Juz/>;
 if(slug==='zakat-stocks-crypto')return <Investments/>;
 if(slug==='hifz-tracker')return <Hifz/>;
 return <p>Tool unavailable.</p>;
}
