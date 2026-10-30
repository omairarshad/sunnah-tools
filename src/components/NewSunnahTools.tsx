import {useEffect,useMemo,useState} from 'react';
import {CalculationMethod,Coordinates,PrayerTimes} from 'adhan';
import {localISODate} from '../lib/calculations.mjs';
import {hijamaPlan,sunnahFastingPlan,aqiqahDates,duhaWindow,datePlanICS,dateText,validISO,planCSV} from '../lib/newSunnahPlanning.mjs';
import {downloadText} from '../lib/personalTools.mjs';
import './new-sunnah-tools.css';

const today=()=>localISODate();
const dates=(value:string)=>dateText(value);
const saveCSV=(name:string,entries:{iso:string;label:string}[])=>{
 try{downloadText(name+'.csv',planCSV(entries),'text/csv;charset=utf-8');return 'CSV downloaded. Dates are estimates; check them locally.'}
 catch{return 'Could not export these dates.'}
};
const saveCalendar=(name:string,entries:{iso:string;title:string}[])=>{
 try{downloadText(name+'.ics',datePlanICS(entries,name),'text/calendar;charset=utf-8');return 'Calendar downloaded. Check the dates against your local Islamic calendar before making plans.'}
 catch{return 'Unable to export these dates. Check the selected date.'}
};
const Note=({children}:{children:React.ReactNode})=><p className="new-tool-note">{children}</p>;
const DateField=({label,value,onChange}:{label:string;value:string;onChange:(x:string)=>void})=><label>{label}<input type="date" min="1900-01-01" max="2100-12-31" value={value} onChange={e=>onChange(e.target.value)}/></label>;

export function HijamaDatePlanner(){
 const [from,setFrom]=useState(today),[count,setCount]=useState(6),[shift,setShift]=useState(0),[message,setMessage]=useState('');
 const plan=useMemo(()=>hijamaPlan(from,count,shift),[from,count,shift]);
 const upcoming=plan?.entries.flatMap(month=>month.dates.filter(d=>d.iso>=from).map(d=>({...d,month:month.name,year:month.year})))??[];
 return <div className="new-tool">
  <p>Find the calculated <strong>17th, 19th and 21st</strong> days of upcoming Hijri months. These are traditional date references, <strong>not medical appointments or proven treatment dates</strong>.</p>
  <div className="new-tool-fields"><DateField label="Start from" value={from} onChange={setFrom}/><label>Months<select value={count} onChange={e=>setCount(+e.target.value)}><option value={3}>3 months</option><option value={6}>6 months</option><option value={12}>12 months</option></select></label><label>Illustrative calendar adjustment<select value={shift} onChange={e=>setShift(+e.target.value)}><option value={0}>Umm al-Qura estimate</option><option value={-1}>One day earlier</option><option value={1}>One day later</option></select></label></div>
  {upcoming[0]&&<div className="new-tool-results"><div><span>Next matching lunar date</span><strong>{dates(upcoming[0].iso)}</strong><small>{upcoming[0].day} {upcoming[0].month} {upcoming[0].year} AH · estimated</small></div><div><span>Future date references listed</span><strong>{upcoming.length}</strong><small>Not a medical recommendation</small></div></div>}
  {!plan?<p role="alert">Choose a supported date to calculate a calendar.</p>:<>
   <div className="new-tool-list">{plan.entries.map(month=><section className="new-tool-month" key={month.year+'-'+month.month}><h3>{month.name} {month.year} AH</h3><div className="new-tool-day-grid">{month.dates.map(d=><div key={d.day} className="new-tool-day"><span>{d.day} Hijri</span><strong>{dates(d.iso)}</strong>{d.iso<from&&<small>Already passed</small>}</div>)}</div></section>)}</div>
   <div className="new-tool-actions"><button className="secondary" onClick={()=>setMessage(saveCalendar('hijama-date-reminders',upcoming.map(d=>({iso:d.iso,title:'Hijama date reference: '+d.day+' '+d.month+' AH'}))))}>Download date reminders (.ics)</button><button className="secondary" onClick={()=>setMessage(saveCSV('hijama-lunar-dates',upcoming.map(d=>({iso:d.iso,label:d.day+' '+d.month+' '+d.year+' AH (date reference only)'}))))}>Download dates (.csv)</button><a href="#hijama-evidence">Read the clinical evidence ↗</a></div>
  </>}
  {message&&<p role="status" className="small">{message}</p>}
  <Note>Calendars are Umm al-Qura estimates. Local moon sightings and sunset boundaries can change the civil date. Narrations about these days have been assessed differently by scholars. Cupping, especially wet cupping, carries bleeding and infection risks; use qualified healthcare advice and never substitute it for necessary treatment. No medical effectiveness is claimed.</Note>
 </div>
}

const cities=[
 {label:'Newcastle upon Tyne',lat:54.9783,lon:-1.6178,zone:'Europe/London'},
 {label:'London',lat:51.5072,lon:-.1276,zone:'Europe/London'},
 {label:'Makkah',lat:21.4225,lon:39.8262,zone:'Asia/Riyadh'},
 {label:'Karachi',lat:24.8607,lon:67.0011,zone:'Asia/Karachi'},
 {label:'New York',lat:40.7128,lon:-74.006,zone:'America/New_York'},
 {label:'Kuala Lumpur',lat:3.139,lon:101.6869,zone:'Asia/Kuala_Lumpur'}
];
const timeInZone=(date:Date,zone:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:false}).format(date);
export function DuhaCalculator(){
 const [city,setCity]=useState(0),[date,setDate]=useState(today);
 const [override,setOverride]=useState(false),[manualSunrise,setManualSunrise]=useState(''),[manualDhuhr,setManualDhuhr]=useState('');
 const [startBuffer,setStartBuffer]=useState(20),[endBuffer,setEndBuffer]=useState(10);
 const selected=cities[city];
 const calculated=useMemo(()=>{
  if(!validISO(date))return null;
  try{
   const p=CalculationMethod.MuslimWorldLeague();
   const result=new PrayerTimes(new Coordinates(selected.lat,selected.lon),new Date(date+'T12:00:00Z'),p);
   return {sunrise:timeInZone(result.sunrise,selected.zone),dhuhr:timeInZone(result.dhuhr,selected.zone)};
  }catch{return null}
 },[city,date]);
 const sunrise=override?manualSunrise:calculated?.sunrise||'',dhuhr=override?manualDhuhr:calculated?.dhuhr||'';
 const times=duhaWindow(sunrise,dhuhr,startBuffer,endBuffer);
 return <div className="new-tool">
  <p>Duha is a voluntary prayer after sunrise and before Dhuhr. This planner gives an <strong>approximate, cautious window</strong> beginning 20 minutes after sunrise and ending 10 minutes before Dhuhr; these margins are not universal legal cutoffs.</p>
  <div className="new-tool-fields"><label>City example<select value={city} onChange={e=>setCity(+e.target.value)}>{cities.map((city,i)=><option value={i} key={city.label}>{city.label}</option>)}</select></label><DateField label="Date" value={date} onChange={setDate}/></div>
  <label className="new-tool-check"><input type="checkbox" checked={override} onChange={e=>setOverride(e.target.checked)}/> Use sunrise and Dhuhr from my local mosque instead</label>
  {override&&<div className="new-tool-fields"><label>Sunrise<input type="time" value={manualSunrise} onChange={e=>setManualSunrise(e.target.value)}/></label><label>Dhuhr start<input type="time" value={manualDhuhr} onChange={e=>setManualDhuhr(e.target.value)}/></label></div>}
  <div className="new-tool-fields"><label>Minutes after sunrise (planning margin)<select value={startBuffer} onChange={e=>setStartBuffer(Number(e.target.value))}>{[15,20,25,30].map(n=><option key={n} value={n}>{n} minutes</option>)}</select></label><label>Minutes before Dhuhr (planning margin)<select value={endBuffer} onChange={e=>setEndBuffer(Number(e.target.value))}>{[5,10,15,20].map(n=><option key={n} value={n}>{n} minutes</option>)}</select></label></div>
  {times?<><div className="new-tool-results"><div><span>Suggested Duha start</span><strong>{times.start}</strong></div><div><span>Suggested Duha finish</span><strong>{times.end}</strong></div></div><p className="small">Sunrise {sunrise} · Dhuhr {dhuhr} · {override?'Your entered times':selected.label+' (Muslim World League calculation)'}</p></>:<p role="status">Enter valid sunrise and Dhuhr times, or choose another date/location.</p>}
  <p className="small"><strong>Worked example:</strong> Sunrise 07:00 and Dhuhr 12:30 with the default 20/10 minute margins gives 07:20–12:20. These margins are adjustable planning choices, not fatwas.</p>
  <Note>Prayer conventions, high latitudes and mosque schedules can differ. The religious period begins after the sunrise prohibition has ended and finishes before the sun reaches its zenith. Consult the local mosque for the relevant margin. <a href="/tools/prayer-times/">Compare prayer calculation methods</a>.</Note>
 </div>;
}

const arabicIstikhara='اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ';
const transliteration='Allahumma inni astakhiruka bi-ilmika, wa astaqdiruka bi-qudratika, wa as-aluka min fadlika al-azim. Fa-innaka taqdiru wa la aqdir, wa ta-lamu wa la a-lam, wa anta allamu al-ghuyub. Allahumma in kunta ta-lamu anna hadha al-amra khayrun li fi dini wa ma-ashi wa aqibati amri, faqdurhu li wa yassirhu li thumma barik li fih. Wa in kunta ta-lamu anna hadha al-amra sharrun li fi dini wa ma-ashi wa aqibati amri, fasrifhu anni wasrifni anhu waqdur li al-khayra haythu kana thumma ardini bih.';
export function IstikharaGuide(){
 const [showLatin,setShowLatin]=useState(true),[copied,setCopied]=useState(false),[matter,setMatter]=useState('');
 return <div className="new-tool">
  <ol className="new-tool-steps"><li>Make wudu and intend a lawful decision for which you are seeking Allah's guidance.</li><li>Pray two voluntary rak'ahs, separate from obligatory prayers, at a permissible time.</li><li>Recite the Istikhara supplication and mention your specific matter at the appropriate phrase.</li><li>Use reasonable judgement and consultation; Istikhara does not require a dream or a particular feeling.</li></ol>
  <label>My decision to mention in the dua (optional, stays on this page)<input type="text" maxLength={150} value={matter} onChange={e=>setMatter(e.target.value)} placeholder="E.g. accepting a particular job offer"/></label>
  {matter.trim()&&<p className="new-tool-note">Your matter: <strong>{matter.trim()}</strong>. Mention it when you reach “this matter” in the supplication. This text is not uploaded or saved.</p>}
  <div className="new-tool-quotation"><h3>Istikhara dua</h3><p dir="rtl" lang="ar" className="new-tool-arabic">{arabicIstikhara}</p>
   <label className="new-tool-check"><input type="checkbox" checked={showLatin} onChange={e=>setShowLatin(e.target.checked)}/> Show approximate transliteration</label>
   {showLatin&&<p className="new-tool-latin">{transliteration}</p>}
   <h4>Meaning (original summary)</h4><p>O Allah, I seek Your guidance through Your knowledge and ability through Your power. If this matter is good for my faith, livelihood and outcome, decree it, ease it and bless it. If it is harmful, turn it away and turn me away from it. Decree what is good wherever it may be, and make me content with it.</p>
   <div className="new-tool-actions"><button type="button" className="secondary" onClick={()=>{navigator.clipboard?.writeText(arabicIstikhara).then(()=>setCopied(true)).catch(()=>setCopied(false))}}>Copy Arabic dua</button><button type="button" className="secondary" onClick={()=>window.print()}>Print guide</button><a href="#istikhara-no-dream">What to expect afterwards ↗</a></div>{copied&&<span role="status" className="small">Copied</span>}
  </div>
  <Note>The transliteration is a reading aid, not a substitute for learning accurate Arabic. The full report and its wording are in <a href="https://sunnah.com/bukhari:1166" target="_blank" rel="noopener noreferrer">Sahih al-Bukhari 1166</a>. This is a guide, not a guaranteed prediction of the outcome.</Note>
 </div>;
}

const fridayItems=[
 {id:'ghusl',label:'Prepare with cleanliness / Friday ghusl',source:'https://sunnah.com/muslim:846a'},
 {id:'clothes',label:'Wear clean clothing and be considerate of others',source:'https://sunnah.com/abudawud:343'},
 {id:'early',label:'Plan enough time for Jumu\u2019ah and the khutbah',source:'https://sunnah.com/bukhari:881'},
 {id:'kahf',label:'Read Surah Al-Kahf (reported Friday virtue; grading discussed)',source:'https://quran.com/18'},
 {id:'salawat',label:'Increase salawat upon the Prophet ﷺ',source:'https://sunnah.com/abudawud:1047'},
 {id:'dua',label:'Make dua and remember Allah',source:'https://sunnah.com/bukhari:935'}
];
const nextFridayISO=()=>{const now=new Date(),offset=(5-now.getDay()+7)%7;now.setDate(now.getDate()+offset);return localISODate(now)};
export function FridayChecklist(){
 const [friday]=useState(nextFridayISO),[checked,setChecked]=useState<string[]>([]),[ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('sunnah-friday-checklist-v1')||'null');if(saved?.date===friday&&Array.isArray(saved.items))setChecked(saved.items.filter((id:unknown)=>typeof id==='string'&&fridayItems.some(i=>i.id===id)))}catch{}setReady(true)},[friday]);
 useEffect(()=>{if(!ready)return;try{localStorage.setItem('sunnah-friday-checklist-v1',JSON.stringify({date:friday,items:checked}))}catch{}},[ready,friday,checked]);
 const toggle=(id:string)=>setChecked(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
 return <div className="new-tool">
  <div className="new-tool-results"><div><span>Next Friday (on your device)</span><strong>{dates(friday)}</strong></div><div><span>Checklist</span><strong>{checked.length}/{fridayItems.length}</strong></div></div>
  <progress value={checked.length} max={fridayItems.length} aria-label="Friday checklist progress" className="new-tool-progress"/>
  <p className="small">Use this alongside your local mosque's actual khutbah and Jumuah timetable. The items include differing levels of religious emphasis.</p>
  <div className="new-tool-checkboxes">{fridayItems.map(item=><div key={item.id} className="new-tool-checkbox-line"><label><input type="checkbox" checked={checked.includes(item.id)} onChange={()=>toggle(item.id)}/>{item.label}</label><a href={item.source} target="_blank" rel="noopener noreferrer" aria-label={'Read source for '+item.label}>Source ↗</a></div>)}</div>
  <div className="new-tool-actions"><button className="secondary" onClick={()=>window.print()}>Print checklist</button><button className="secondary" onClick={()=>setChecked([])}>Reset</button><a href="https://quran.com/18" target="_blank" rel="noopener noreferrer">Read Surah Al-Kahf ↗</a></div>
  <Note>The checklist is optional, private to this browser and resets for a different Friday. Obligations and recommended actions differ by individual circumstances and jurisprudence. Checking a box does not measure acceptance of worship.</Note>
 </div>;
}

const willFields=[
 {id:'assets',label:'Assets and property to discuss',hint:'Avoid account numbers or passwords'},
 {id:'debts',label:'Debts, liabilities and funeral arrangements',hint:'Record categories, not sensitive account credentials'},
 {id:'family',label:'Family and potential heirs',hint:'Seek qualified inheritance advice on who inherits'},
 {id:'executor',label:'Proposed executor and guardian',hint:'Check suitability and legal requirements'},
 {id:'wishes',label:'Bequests, charitable intentions and other wishes',hint:'Bequest limits and protected heir shares require scholarly review'},
 {id:'documents',label:'Documents and professional questions',hint:'Record where originals are held, not private passwords'}
];
export function IslamicWillPlanner(){
 const [notes,setNotes]=useState<Record<string,string>>({}),[accepted,setAccepted]=useState(false),[message,setMessage]=useState('');
 const [jurisdiction,setJurisdiction]=useState('england-wales');
 const exportNotes=()=>{
  if(!accepted){setMessage('Please confirm you understand this is a planning worksheet, not a valid will.');return}
  const body=['ISLAMIC WILL PREPARATION WORKSHEET','Not a legally valid will. Have a qualified solicitor and Islamic inheritance specialist review it.','No inheritance calculations or legal advice are provided.','Legal jurisdiction for discussion: '+jurisdiction,'',...willFields.flatMap(f=>[f.label,notes[f.id]?.trim()||'(not entered)',''])].join('\n');
  downloadText('will-planning-notes.txt',body,'text/plain;charset=utf-8');
  setMessage('Worksheet downloaded. It is not a legally executed will; store it securely.');
 };
 return <div className="new-tool">
  <p>Organise questions to discuss with a solicitor and an Islamic inheritance specialist. This private worksheet <strong>does not calculate heirs' shares or create a legal will</strong>.</p>
  <label>Where will you seek legal advice?<select value={jurisdiction} onChange={e=>setJurisdiction(e.target.value)}><option value="england-wales">England and Wales</option><option value="scotland">Scotland</option><option value="northern-ireland">Northern Ireland</option><option value="other">Another country / multiple jurisdictions</option></select></label>
  <p className="new-tool-note">{jurisdiction==='england-wales'?'England and Wales: GOV.UK explains the requirements for writing, signing and witnessing a legal will.':jurisdiction==='scotland'?'Scotland: formalities and rules about legal rights are different; obtain advice from a Scottish solicitor.':jurisdiction==='northern-ireland'?'Northern Ireland: will formalities differ; seek local legal advice before signing.':'Cross-border assets and domicile can affect which laws apply; obtain specialist legal advice.'} <a href="https://www.gov.uk/make-will" target="_blank" rel="noopener noreferrer">Start with official UK guidance ↗</a></p>
  <div className="new-tool-will">{willFields.map(field=><label key={field.id}>{field.label}<small>{field.hint}</small><textarea rows={3} maxLength={1200} value={notes[field.id]||''} onChange={e=>setNotes(prev=>({...prev,[field.id]:e.target.value}))} placeholder="Optional notes — not stored by this site"/></label>)}</div>
  <label className="new-tool-check"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> I understand this worksheet is not a valid will and must be professionally reviewed.</label>
  <div className="new-tool-actions"><button className="secondary" onClick={exportNotes}>Download my notes (TXT)</button><button className="secondary" onClick={()=>{setNotes({});setMessage('Notes cleared from this page.')}}>Clear notes</button></div>
  {message&&<p className="small" role="status">{message}</p>}
  <Note>Nothing entered here is sent to a server or saved in local storage. Under England and Wales law, a valid will ordinarily needs appropriate signing and two witnesses; different rules apply in Scotland and Northern Ireland. Islamic inheritance considers debts, prescribed heirs, bequests and specific circumstances. <a href="https://www.gov.uk/make-will" target="_blank" rel="noopener noreferrer">Read official UK guidance</a> and <a href="https://quran.com/4/11" target="_blank" rel="noopener noreferrer">Quran 4:11</a>.</Note>
 </div>;
}

const aqiqahTasks=['Discuss the date and practice with family / a scholar','Arrange suitable animal sacrifice with a reputable provider','Consider naming and related customs','Plan sharing food or charity responsibly','Confirm hygiene, animal welfare and local legal requirements'];
export function AqiqahPlanner(){
 const [birth,setBirth]=useState(today),[done,setDone]=useState<string[]>([]),[message,setMessage]=useState('');
 const [counting,setCounting]=useState('birth-day'),[childReference,setChildReference]=useState('unspecified');
 const plan=useMemo(()=>aqiqahDates(birth),[birth]);
 return <div className="new-tool">
  <p>Plan an Aqiqah and keep track of practical arrangements. The commonly reported seventh-day date is shown using <strong>birth day as day one</strong>; other counting conventions and rulings may differ.</p>
  <div className="new-tool-fields"><DateField label="Gregorian date of birth" value={birth} onChange={setBirth}/><label>Date counting illustration<select value={counting} onChange={e=>setCounting(e.target.value)}><option value="birth-day">Count birth date as day one</option><option value="next-day">Start counting on following date</option></select></label><label>Hadith animal reference (optional)<select value={childReference} onChange={e=>setChildReference(e.target.value)}><option value="unspecified">Do not show</option><option value="boy">Boy – report mentions two sheep</option><option value="girl">Girl – report mentions one sheep</option></select></label></div>
  {childReference!=='unspecified'&&<p className="small">The narration in <a href="https://sunnah.com/tirmidhi:1513" target="_blank" rel="noopener noreferrer">Jami at-Tirmidhi 1513</a> mentions {childReference==='boy'?'two sheep for a boy':'one sheep for a girl'}. Consult a qualified scholar on the relevant ruling and circumstances; no booking or certification is provided.</p>}
  {plan?<><div className="new-tool-results"><div><span>Selected seventh-day illustration</span><strong>{dates(counting==='birth-day'?plan.daySeven:plan.alternative)}</strong></div><div><span>Other date-counting illustration</span><strong>{dates(counting==='birth-day'?plan.alternative:plan.daySeven)}</strong></div></div>
   <details className="new-tool-expand"><summary>Later date references</summary><p>14th day: {dates(plan.dayFourteen)} · 21st day: {dates(plan.dayTwentyOne)}. Whether and when to use these alternatives depends on scholarly guidance, not this calculator.</p></details>
   <button className="secondary" onClick={()=>setMessage(saveCalendar('aqiqah-planning-reminder',[{iso:counting==='birth-day'?plan.daySeven:plan.alternative,title:'Aqiqah planning reminder (estimated seventh day)'}]))}>Download seventh-day reminder</button>
  </>:<p role="alert">Choose a valid date of birth.</p>}
  <div className="new-tool-checkboxes">{aqiqahTasks.map(item=><label key={item}><input type="checkbox" checked={done.includes(item)} onChange={()=>setDone(old=>old.includes(item)?old.filter(x=>x!==item):[...old,item])}/>{item}</label>)}</div>
  {message&&<p role="status" className="small">{message}</p>}
  <Note><a href="https://sunnah.com/abudawud:2838" target="_blank" rel="noopener noreferrer">Sunan Abi Dawud 2838</a> refers to the seventh day. There are differences about timing and details. This planner does not book sacrifices, certify providers or dictate a single school ruling; check applicable law and religious advice.</Note>
 </div>;
}
export function SunnahFastingPlanner(){
 const [start,setStart]=useState(today),[span,setSpan]=useState(90),[shift,setShift]=useState(0),[showExcluded,setShowExcluded]=useState(false),[notice,setNotice]=useState('');
 const [fastingCategory,setFastingCategory]=useState('all');
 const plan=useMemo(()=>sunnahFastingPlan(start,span,shift),[start,span,shift]);
 const matches=(item:{labels:string[]})=>fastingCategory==='all'||(fastingCategory==='weekly'?item.labels.some(label=>label==='Monday'||label==='Thursday'):fastingCategory==='white'?item.labels.includes('White Days'):item.labels.some(label=>label.includes('Arafah')||label.includes('Ashura')||label.includes('Muharram')));
 const valid=plan?plan.filter(p=>p.allowed&&matches(p)):[];
 const shown=plan?plan.filter(p=>matches(p)&&(p.allowed||showExcluded)):[];
 return <div className="new-tool">
  <p>Combine Mondays, Thursdays, White Days and key voluntary fasting dates in one calendar. Ramadan, Eid and the days of Tashriq are <strong>excluded from voluntary fasting reminders</strong>.</p>
  <div className="new-tool-fields"><DateField label="Start date" value={start} onChange={setStart}/><label>Planning range<select value={span} onChange={e=>setSpan(+e.target.value)}><option value={30}>30 days</option><option value={90}>90 days</option><option value={180}>180 days</option></select></label><label>Illustrative date adjustment<select value={shift} onChange={e=>setShift(+e.target.value)}><option value={0}>Umm al-Qura estimate</option><option value={-1}>One day earlier</option><option value={1}>One day later</option></select></label></div>
  <div className="new-tool-fields"><label>Show fasting references<select value={fastingCategory} onChange={e=>setFastingCategory(e.target.value)}><option value="all">All categories</option><option value="weekly">Monday and Thursday</option><option value="white">White Days</option><option value="special">Ashura, ninth of Muharram, Arafah</option></select></label></div>
  {!plan?<p role="alert">Choose a valid date to generate a plan.</p>:<>
   <div className="new-tool-results"><div><span>Matching eligible date references</span><strong>{valid.length}</strong></div><div><span>Planning window</span><strong>{span} days</strong></div></div>
   <label className="new-tool-check"><input type="checkbox" checked={showExcluded} onChange={e=>setShowExcluded(e.target.checked)}/> Show excluded / obligatory dates with an explanation</label>
   <div className="new-tool-table"><table><thead><tr><th>Gregorian date</th><th>Hijri estimate</th><th>Reason</th></tr></thead><tbody>{shown.map(item=><tr key={item.iso}><td>{dates(item.iso)}</td><td>{item.hijriDay} {item.hijriMonth} {item.hijriYear}</td><td>{item.allowed?item.labels.join(' · '):'Not a voluntary fast: '+item.reason}</td></tr>)}</tbody></table></div>
   <div className="new-tool-actions"><button className="secondary" onClick={()=>setNotice(saveCalendar('sunnah-fasting-reminders',valid.map(item=>({iso:item.iso,title:'Potential voluntary fast: '+item.labels.join(', ')}))))}>Download eligible dates (.ics)</button><button className="secondary" onClick={()=>setNotice(saveCSV('sunnah-fasting-reference',valid.map(item=>({iso:item.iso,label:item.labels.join(' · ')}))))}>Download CSV</button><a href="/tools/white-days-calendar/">Detailed White Days calendar ↗</a></div>
  </>}
  {notice&&<p role="status" className="small">{notice}</p>}
  <p className="small">The six fasts of Shawwal have no universally fixed dates and are explained in the detailed guide below; the planner does not silently mark arbitrary Shawwal days.</p>
  <Note>Calendar dates use Umm al-Qura estimates; local moon sighting can alter them. Some fasts have additional religious restrictions (for example, Arafah for pilgrims); fasting should suit individual health and circumstances. <a href="https://sunnah.com/abudawud:2436" target="_blank" rel="noopener noreferrer">Mondays and Thursdays</a> · <a href="https://sunnah.com/abudawud:2449" target="_blank" rel="noopener noreferrer">White Days</a>.</Note>
 </div>;
}
