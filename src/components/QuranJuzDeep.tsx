import {useState} from 'react';
import {juzIndex} from '../lib/quranRemembranceDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';
export default function QuranJuzDeep(){
 const [search,setSearch]=useState(''),[selected,setSelected]=useState(30);
 const rows=juzIndex(search),chosen=juzIndex().find(v=>v.number===selected)!;
 const csv=()=>downloadText('quran-juz-starts.csv','\uFEFFJuz,Start Surah,Start Ayah,Surah name,Next juz begins at,Read URL\r\n'+juzIndex().map(x=>[x.number,x.surah,x.ayah,x.name,x.next?x.next.surah+':'+x.next.ayah:'End of Quran',x.url].join(',')).join('\r\n')+'\r\n','text/csv;charset=utf-8');
 return <div className="fasting-deep-tool">
 <p className="small">Find the <strong>start of every Juz (Para)</strong> in the Quran. A Juz begins at a specific Surah and Ayah and runs up to (but not including) the next Juz start. These are textual boundaries, not an assumption of identical page numbers in every Mushaf.</p>
 <label>Search Juz number, Para, Surah or verse reference<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. 30, Al-Mulk, 2:142"/></label>
 <div className="fasting-deep-stats"><div><span>Quran sections</span><strong>30 Juz</strong></div><div><span>Selected</span><strong>Juz {selected}</strong></div><div><span>Starts at</span><strong>{chosen.startReference}</strong></div></div>
 <div className="fasting-deep-breakdown">
  <h3>Juz {selected}: {chosen.name}</h3>
  <p>Begins at <strong>Surah {chosen.name}, Ayah {chosen.ayah} ({chosen.startReference})</strong>.</p>
  <p>{chosen.next?<>The next Juz begins at <strong>{chosen.next.surah}:{chosen.next.ayah}</strong>. Juz {selected} ends immediately before that verse.</>:'Juz 30 continues to the end of Surah An-Nas (114:6).'}</p>
  <a href={chosen.url} target="_blank" rel="noopener noreferrer">Read from Juz {selected} on Quran.com</a>
 </div>
 <div className="table-wrap"><table><thead><tr><th scope="col">Juz / Para</th><th scope="col">Beginning Surah</th><th scope="col">First Ayah</th><th scope="col">Next Juz starts</th></tr></thead>
 <tbody>{rows.map(x=><tr key={x.number}><th scope="row"><button type="button" className="secondary" onClick={()=>setSelected(Number(x.number))} aria-pressed={selected===x.number}>Juz {x.number}</button></th><td>{x.name}</td><td><a href={x.url} target="_blank" rel="noopener noreferrer">{x.startReference}</a></td><td>{x.next?x.next.surah+':'+x.next.ayah:'End of Quran'}</td></tr>)}</tbody></table></div>
 {!rows.length&&<p role="status">No matching Juz. Try a number from 1 to 30 or the name of the Surah at a Juz start.</p>}
 <div className="action-row print-hide"><button type="button" onClick={csv}>Download all 30 Juz references (CSV)</button><button type="button" className="secondary" onClick={()=>window.print()}>Print list</button></div>
 <p className="warn">The 30 Juz divisions are a practical reading convention. A 604-page Madani Mushaf has edition-specific page starts; do not use a page count to infer Juz boundaries in other editions. If you need a full daily page plan, use <a href="/tools/quran-planner/">Quran Planner</a>.</p>
 </div>;
}
