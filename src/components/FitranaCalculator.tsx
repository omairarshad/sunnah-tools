import {useState} from 'react';
import {fitranaEstimate} from '../lib/ramadanHelpers.mjs';
export default function FitranaCalculator(){
 const [people,setPeople]=useState(4),[rate,setRate]=useState(''),[currency,setCurrency]=useState('GBP');
 const [extra,setExtra]=useState('0'),[source,setSource]=useState(''),[checkedOn,setCheckedOn]=useState('');
 const parsed=rate.trim()?Number(rate):NaN;
 const result=fitranaEstimate({people,ratePerPerson:parsed,additional:Number(extra)});
 const format=(n:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency}).format(n);
 return <div>
  <p>Enter the Fitrana (Zakat al-Fitr) rate published by the charity or local religious authority you intend to use. Amounts differ by place, year and calculation approach.</p>
  <div className="two">
   <label>Currency<select value={currency} onChange={e=>setCurrency(e.target.value)}>{['GBP','USD','EUR','PKR','SAR','AED','CAD','AUD','INR'].map(c=><option key={c}>{c}</option>)}</select></label>
   <label>People in household<input type="number" min="1" max="10000" step="1" value={people} onChange={e=>setPeople(Number(e.target.value))}/></label>
  </div>
  <div className="two">
   <label>Verified rate per person<input type="number" min="0" step="0.01" inputMode="decimal" value={rate} onChange={e=>setRate(e.target.value)} placeholder="Enter your charity's published rate"/></label>
   <label>Optional extra donation<input type="number" min="0" step="0.01" inputMode="decimal" value={extra} onChange={e=>setExtra(e.target.value)}/></label>
  </div>
  <div className="two"><label>Where you checked the rate (optional)<input type="text" value={source} maxLength={120} onChange={e=>setSource(e.target.value)} placeholder="Mosque or charity name"/></label><label>Date rate was checked<input type="date" value={checkedOn} onChange={e=>setCheckedOn(e.target.value)}/></label></div>
 {result?<><div className="prayers"><div>Fitrana subtotal<strong>{format(result.people*result.ratePerPerson)}</strong></div><div>Additional donation<strong>{format(result.additional)}</strong></div></div><div className="result"><span>Estimated amount to arrange</span><strong>{format(result.total)}</strong>{source&&<small>Based on rate checked with: {source}{checkedOn?' · '+checkedOn:''}</small>}</div></>:<p className="warn" role="status">Enter a valid number of people and a positive, verified rate per person to calculate.</p>}
  <p className="warn">This tool does not determine who is obliged to pay or set an official rate. Consult your local mosque or the organisation receiving your payment; requirements and deadlines vary by scholarly opinion.</p>
  <p className="small">No financial information is saved or transmitted by this calculator.</p>
 </div>;
}
