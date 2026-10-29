import {useState} from 'react';
import {QURAN_DUAS,ADHKAR_REFERENCES} from '../lib/quranRemembranceDeep.mjs';
export default function DailyAdhkarDeep(){
 const [category,setCategory]=useState<'quran'|'daily'>('quran'),[search,setSearch]=useState(''),[selected,setSelected]=useState('knowledge'),[reads,setReads]=useState(0),[notice,setNotice]=useState('');
 const items=QURAN_DUAS.filter(d=>(d.title+' '+d.verse+' '+d.meaning).toLowerCase().includes(search.toLowerCase()));
 const dua=QURAN_DUAS.find(d=>d.id===selected)??QURAN_DUAS[0];
 return <div className="fasting-deep-tool">
 <p className="small">Read a carefully limited selection of <strong>Quranic supplications</strong> with exact verse links, or consult authenticated <strong>morning, evening and after-Salah dhikr</strong> reports. Prescribed repetitions belong to their own reported narrations, not automatically to every Quranic dua.</p>
 <div className="action-row"><button type="button" className={category==='quran'?'':'secondary'} aria-pressed={category==='quran'} onClick={()=>setCategory('quran')}>Quranic Duas</button><button type="button" className={category==='daily'?'':'secondary'} aria-pressed={category==='daily'} onClick={()=>setCategory('daily')}>Sunnah Adhkar references</button></div>
 {category==='quran'?<>
 <label>Search themes or verse references<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. knowledge, parents, 2:201"/></label>
 <div className="two">{items.map(d=><button type="button" key={d.id} className="secondary" onClick={()=>{setSelected(d.id);setReads(0)}} aria-pressed={selected===d.id}>{d.title} · {d.verse}</button>)}</div>
 {!items.length&&<p role="status">No matching Quranic supplication. Search a theme or verse number.</p>}
 <article className="fasting-deep-breakdown"><h3>{dua.title}</h3><p lang="ar" dir="rtl" className="expansion-arabic">{dua.arabic}</p><p><strong>Concise meaning:</strong> {dua.meaning}</p><p><a href={'https://quran.com/'+dua.verse.replace(':','/')} target="_blank" rel="noopener noreferrer">Read Quran {dua.verse} in its complete context</a>.</p>
 <div className="action-row"><button type="button" onClick={()=>setReads(n=>Math.min(100000,n+1))}>Mark one personal reading ({reads})</button><button type="button" className="secondary" onClick={()=>setReads(0)}>Reset reading count</button><button type="button" className="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(dua.arabic);setNotice('Arabic copied.')}catch{setNotice('Clipboard unavailable; select the Arabic text manually.')}}}>Copy Arabic</button></div>
 <p className="small">The reading count is voluntary and resets when selecting another dua. <strong>No special number of repetitions is prescribed for this Quranic dua by the counter.</strong> Read the full verse and translation at the source.</p></article></>:<>
 <p className="small">Select a reliable source below to see the exact wording, timing, virtues and any count in its full hadith context. These are <strong>reference cards</strong>, not a claim to reproduce a complete morning/evening litany.</p>
 {ADHKAR_REFERENCES.map(r=><article className="fasting-deep-breakdown" key={r.id}><h3>{r.title}</h3><p><strong>Context:</strong> {r.period}</p><p>{r.note}</p><a href={r.source} target="_blank" rel="noopener noreferrer">Read authentic source and complete wording</a></article>)}
 </>}
 {notice&&<p className="small" role="status">{notice}</p>}
 <p className="warn">Arabic excerpts are for convenient reading and should be checked against a trusted Quran. Transliteration and short English meanings can omit nuances. For prescribed Sunnah dhikr repetitions, follow the specific hadith and a qualified teacher rather than assuming every phrase carries the same count.</p>
 </div>;
}
