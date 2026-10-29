import {useState} from 'react';
import {qurbaniAllocation} from '../lib/zakatNextDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';
const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const money=(n:number,c:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c,maximumFractionDigits:2}).format(n);
export default function QurbaniDeep(){
 const [animal,setAnimal]=useState('cow'),[mode,setMode]=useState<'shares'|'whole'>('shares'),[participants,setParticipants]=useState('1'),[cost,setCost]=useState(''),[currency,setCurrency]=useState('GBP'),[example,setExample]=useState(false),[notice,setNotice]=useState('');
 const max=['sheep','goat'].includes(animal)?1:7;
 const result=qurbaniAllocation({animal,mode,participants:/^\d+$/.test(participants)?Number(participants):NaN,price:cost.trim()?Number(cost):NaN});
 const load=()=>{setAnimal('cow');setMode('shares');setParticipants('3');setCost('700');setCurrency('GBP');setExample(true);setNotice('Example: 3 of the 7 shares of a £700 cow. Actual provider quotes and eligibility must be confirmed.')};
 const changeCurrency=(v:string)=>{setCurrency(v);setCost('');setExample(false);setNotice('Currency changed. The old quote was cleared to avoid relabelling it.')};
 const save=()=>{if(!result)return;const text=['Qurbani cost allocation - conditional planning only',
 'Animal: '+animal,'Mode: '+(mode==='shares'?'Reserve N of the available shares':'Fund the whole animal with N contributors'),
 'Participants / shares selected: '+participants,'Full animal quote: '+money(result.total,currency),
 ...result.allocation.map((v,i)=>'Contributor/share '+(i+1)+': '+money(v,currency)),
 'Selected allocation: '+money(result.selectedTotal,currency),
 'Unallocated balance (only in shares mode): '+money(result.unallocated,currency),
 'These sums allocate money only. Check animal age and health, intentions, price, provider, Sharia validity, eligible participants and slaughter time.',
 example?'WARNING: Hypothetical sample price is in use.':''].join('\n');
 downloadText('qurbani-allocation-summary.txt',text,'text/plain;charset=utf-8');setNotice('Downloaded a private cost plan, not a booking or Qurbani confirmation.')};
 return <div className="fasting-deep-tool">
 <p className="small">Calculate <strong>one to seven shares</strong> in a cow, buffalo or camel, or one sheep/goat. Reserving shares of a larger animal is different from dividing the whole animal's invoice among fewer contributors. Select the correct funding arrangement.</p>
 <div className="fasting-deep-fields">
 <label>Animal type<select value={animal} onChange={e=>{setAnimal(e.target.value);setParticipants('1');setExample(false)}}><option value="sheep">Sheep</option><option value="goat">Goat</option><option value="cow">Cow</option><option value="buffalo">Buffalo</option><option value="camel">Camel</option></select></label>
 <label>Cost arrangement<select value={mode} onChange={e=>setMode(e.target.value as 'shares'|'whole')}><option value="shares">Buy N of the available animal shares</option><option value="whole">Fund the entire animal between N contributors</option></select></label>
 <label>{mode==='shares'?'Shares to reserve':'People contributing to the whole animal'}<select value={participants} onChange={e=>setParticipants(e.target.value)}>{Array.from({length:max},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>
 <label>Currency (no FX conversion)<select value={currency} onChange={e=>changeCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Provider's total price for one whole animal<input type="number" min="0.01" step="any" inputMode="decimal" value={cost} onChange={e=>{setCost(e.target.value);setExample(false)}} placeholder="Full animal quote, including agreed fees"/></label>
 </div>
 <div className="action-row"><button className="secondary" type="button" onClick={load}>Load hypothetical worked example</button></div>
 {example&&<p className="fasting-example-label">Illustration: whole cow £700, seven equal religious shares worth £100 each, three reserved = £300, four remain = £400. This is not a live Qurbani price.</p>}
 {result?<><div className="fasting-deep-stats"><div><span>Capacity in shares</span><strong>{result.capacity}</strong></div><div><span>Selected cost</span><strong>{money(result.selectedTotal,currency)}</strong></div><div><span>Remaining cost</span><strong>{money(result.unallocated,currency)}</strong></div></div>
 <div className="fasting-deep-breakdown"><h3>Precise cost allocation</h3>
 {result.allocation.map((v,i)=><p key={i}>{mode==='shares'?'Share':'Contributor'} {i+1}: <strong>{money(v,currency)}</strong></p>)}
 {result.penniesDistributed>0&&<p>Minor-unit rounding is distributed across the first {result.penniesDistributed} share(s)/contributors so all allocated amounts add up correctly.</p>}
 <p>{mode==='shares'?'The other '+result.remainingShares+' share(s) must be accounted for by the provider; your selected cost is not the price of the whole animal.':'The listed contributors fund the entire animal; splitting the bill does not itself determine how the sacrificial intention is allocated.'}</p>
 </div><div className="action-row print-hide"><button type="button" onClick={save}>Download cost breakdown</button><button className="secondary" type="button" onClick={()=>window.print()}>Print / Save PDF</button></div></>:<p className="warn" role="status">Enter a valid positive quote for the whole animal and select a permitted number of shares.</p>}
 {notice&&<p role="status" className="small">{notice}</p>}
 <p className="warn">A sheep or goat is not divided into seven sacrificial shares. This tool cannot certify animal welfare, age, slaughter, provider practice, ownership, permissions, share intentions or obligation. Check actual arrangements with a qualified authority. No booking or payment is processed.</p>
 </div>;
}
