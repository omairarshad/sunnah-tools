import {useState} from 'react';
import {FARD_COUNTS,FIVE_PRAYERS,RAWATIB_EXAMPLE} from '../lib/prayerFive.mjs';
export default function PrayerRakatsDeep(){
 const [detail,setDetail]=useState(false);
 const total=FARD_COUNTS.reduce((sum,n)=>sum+n,0);
 return <div className="batch-tool">
 <p>The daily obligatory <strong>Fard rak'ahs</strong> are <strong>2 Fajr, 4 Dhuhr, 4 Asr, 3 Maghrib and 4 Isha</strong>: a total of <strong>{total}</strong> across the five prayers, before optional Sunnah and Witr.</p>
 <div className="table-wrap"><table><thead><tr><th scope="col">Prayer</th><th scope="col">Fard rak'ahs</th>{detail&&<><th scope="col">Common Sunnah before</th><th scope="col">Common Sunnah after</th></>}</tr></thead>
 <tbody>{FIVE_PRAYERS.map((p,i)=><tr key={p}><th scope="row">{p}</th><td><strong>{FARD_COUNTS[i]}</strong></td>{detail&&<><td>{RAWATIB_EXAMPLE[i].commonBefore}</td><td>{RAWATIB_EXAMPLE[i].commonAfter}</td></>}</tr>)}<tr><th scope="row">Total daily Fard</th><td><strong>{total}</strong></td>{detail&&<td colSpan={2}>Optional patterns differ across schools.</td>}</tr></tbody></table></div>
 <label className="check print-hide"><input type="checkbox" checked={detail} onChange={e=>setDetail(e.target.checked)}/> Show common Sunnah examples (not a universal mandatory schedule)</label>
 {detail&&<p className="small">The separate Rawatib Sunnah prayers are voluntary; the familiar 12-rak'ah daily pattern is documented in <a href="https://sunnah.com/muslim:728c" target="_blank" rel="noopener noreferrer">Sahih Muslim 728c</a>. Witr has distinct standing, raka'ah numbers and performance differences across schools. The table is a summary, not an exhaustive fiqh ruling.</p>}
 <div className="action-row print-hide"><button type="button" onClick={()=>window.print()}>Print prayer chart</button><a href="/tools/printable-prayer-chart/">Make a personal daily checklist</a></div>
 <p className="warn">Qasr on an eligible journey can shorten four-rak'ah Fard prayers; it does not change Fajr or Maghrib. The four Sunni schools differ on some details of Sunnah and Witr. Use the <a href="/tools/travel-prayer-guide/">Travel Prayer Guide</a> and a qualified teacher for individual cases.</p>
 </div>;
}
