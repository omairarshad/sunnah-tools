import {useState} from 'react';
import {fitranaBreakdown,safeNote} from '../lib/givingDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const monetary=(n:number,c:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c,maximumFractionDigits:2}).format(n);
const validPrice=(s:string)=>s.trim()!==''&&Number.isFinite(Number(s))?Number(s):NaN;
export default function FitranaDeep(){
 const [adults,setAdults]=useState('2'),[children,setChildren]=useState('2'),[rate,setRate]=useState(''),[extra,setExtra]=useState('0'),[compare,setCompare]=useState(''),[currency,setCurrency]=useState('GBP');
 const [provider,setProvider]=useState(''),[checked,setChecked]=useState(''),[example,setExample]=useState(false),[notice,setNotice]=useState('');
 const countOk=/^\d+$/.test(adults)&&/^\d+$/.test(children);
 const people=countOk?Number(adults)+Number(children):NaN;
 const result=fitranaBreakdown({people,rate:validPrice(rate),extra:validPrice(extra),comparisonRate:compare.trim()?validPrice(compare):null});
 const loadExample=()=>{setAdults('2');setChildren('2');setRate('5');setExtra('2');setCompare('7');setCurrency('GBP');setExample(true);setNotice('Hypothetical £5 and £7 rates are only examples, not verified current prices.');};
 const changeCurrency=(v:string)=>{setCurrency(v);setRate('');setCompare('');setExtra('0');setExample(false);setNotice('Currency changed. Enter fresh locally verified rates in the new currency.');};
 const download=()=>{if(!result)return;const rows=[
 'Fitrana (Zakat al-Fitr) conditional household estimate',
 'Adults entered: '+adults,'Children entered: '+children,'People included: '+result.people,
 'Verified amount per person: '+monetary(result.rate,currency),
 'Household subtotal: '+monetary(result.base,currency),
 'Optional extra Sadaqah (separate): '+monetary(result.extra,currency),
 'Total amount to arrange: '+monetary(result.total,currency),
 'Rate source entered: '+safeNote(provider||'Not recorded'),'Date checked: '+(checked||'Not recorded'),
 result.comparison?'Alternative rate subtotal for comparison only: '+monetary(result.comparison.base,currency):'No comparison rate entered',
 'Not a payment receipt or an eligibility ruling. Check your school, food/cash method, recipient rules and local Eid prayer deadline.',
 example?'WARNING: Hypothetical example rate is in use.':''
 ];downloadText('fitrana-estimate.txt',rows.join('\n'),'text/plain;charset=utf-8');setNotice('Downloaded a locally generated estimate. No payment was made.');};
 return <div className="fasting-deep-tool">
 <p className="small">Enter the <strong>per-person amount confirmed by your local mosque, scholar or receiving charity</strong>. Fitrana is a separate end-of-Ramadan duty—not annual Zakat or Fidya. This form sets no official amount.</p>
 <div className="fasting-deep-fields">
 <label>Adults to include<input type="number" min="0" max="500" step="1" value={adults} onChange={e=>setAdults(e.target.value)}/></label>
 <label>Children / dependants to include<input type="number" min="0" max="500" step="1" value={children} onChange={e=>setChildren(e.target.value)}/></label>
 <label>Currency (display only; no conversion)<select value={currency} onChange={e=>changeCurrency(e.target.value)}>{currencies.map(x=><option value={x} key={x}>{x}</option>)}</select></label>
 <label>Verified per-person Fitrana rate<input type="number" inputMode="decimal" min="0.01" step="any" value={rate} onChange={e=>{setRate(e.target.value);setExample(false)}} placeholder="Enter local rate"/></label>
 <label>Optional extra Sadaqah (not Fitrana)<input type="number" inputMode="decimal" min="0" step="any" value={extra} onChange={e=>setExtra(e.target.value)}/></label>
 <label>Alternative published per-person rate (optional comparison)<input type="number" inputMode="decimal" min="0.01" step="any" value={compare} onChange={e=>setCompare(e.target.value)} placeholder="Optional second rate"/></label>
 <label>Rate source / mosque (optional)<input value={provider} maxLength={100} onChange={e=>setProvider(e.target.value)} placeholder="Who published the amount?"/></label>
 <label>Date you checked the rate<input type="date" value={checked} onChange={e=>setChecked(e.target.value)}/></label>
 </div>
 <div className="action-row"><button type="button" className="secondary" onClick={loadExample}>Load hypothetical household example</button></div>
 {example&&<p className="fasting-example-label">Illustration only: 4 people × £5 = £20, plus £2 optional extra = £22. A £7 alternative would be £28 before any extra.</p>}
 {result?<><div className="fasting-deep-stats">
 <div><span>People entered</span><strong>{result.people}</strong></div>
 <div><span>Fitrana subtotal</span><strong>{monetary(result.base,currency)}</strong></div>
 <div><span>Total including optional Sadaqah</span><strong>{monetary(result.total,currency)}</strong></div>
 </div><div className="fasting-deep-breakdown"><h3>Calculation breakdown</h3>
 <p>{result.people} people × {monetary(result.rate,currency)} = <strong>{monetary(result.base,currency)} Fitrana</strong></p>
 <p>Additional voluntary charity: {monetary(result.extra,currency)} (not counted as Fitrana).</p>
 {result.comparison&&<p>At the comparison rate of {monetary(result.comparison.rate,currency)}, the Fitrana subtotal would be <strong>{monetary(result.comparison.base,currency)}</strong>. This is not a recommendation to choose either rate.</p>}
 </div><div className="action-row print-hide"><button type="button" onClick={download}>Download conditional breakdown</button><button type="button" className="secondary" onClick={()=>window.print()}>Print / Save PDF</button></div></>:<p className="warn" role="status">Enter at least one person, whole-number counts, a positive locally checked per-person rate, and valid non-negative extras.</p>}
 {notice&&<p role="status" className="small">{notice}</p>}
 <p className="warn"><strong>Before paying:</strong> establish who must be included, permitted food or cash distribution, and a trusted recipient or agent. Deliver in time for your locality's Eid prayer; charity collection cutoffs can be earlier. Choosing a currency does not fetch a new rate. Values remain in this browser session and are not submitted.</p>
 </div>;
}
