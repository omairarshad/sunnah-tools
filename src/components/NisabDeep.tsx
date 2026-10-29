import {useState} from 'react';
import {nisabComparison} from '../lib/givingDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';
const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const fmt=(x:number,c:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c,maximumFractionDigits:2}).format(x);
const parse=(s:string)=>s.trim()===''?NaN:Number(s);
export default function NisabDeep(){
 const [gold,setGold]=useState(''),[silver,setSilver]=useState(''),[wealth,setWealth]=useState(''),[debts,setDebts]=useState('0'),[currency,setCurrency]=useState('GBP'),[example,setExample]=useState(false),[notice,setNotice]=useState('');
 const data=nisabComparison({goldPrice:parse(gold),silverPrice:parse(silver),wealth:wealth.trim()===''?null:parse(wealth),liabilities:parse(debts)});
 const load=()=>{setGold('80');setSilver('1.2');setWealth('2000');setDebts('200');setCurrency('GBP');setExample(true);setNotice('Example-only figures loaded. £80/g and £1.20/g are invented illustration prices, not live metal quotes.')};
 const changeCurrency=(c:string)=>{setCurrency(c);setGold('');setSilver('');setWealth('');setDebts('0');setExample(false);setNotice('Currency changed, so previous prices and amounts were cleared. Enter values in the chosen currency.')};
 const save=()=>{if(!data)return;const txt=[
 'Nisab thresholds - conditional comparison','Currency (no FX conversion): '+currency,
 'Pure 24k gold price entered: '+fmt(parse(gold),currency)+'/g',
 'Silver price entered: '+fmt(parse(silver),currency)+'/g',
 'Gold Nisab 87.48g: '+fmt(data.gold,currency),
 'Silver Nisab 612.36g: '+fmt(data.silver,currency),
 data.net===null?'No personal wealth assessment entered.':'Net qualifying wealth entered: '+fmt(data.net,currency),
 data.net===null?'No eligibility comparison calculated.':'Gold benchmark arithmetically reached: '+(data.goldReached?'Yes':'No'),
 data.net===null?'':'Silver benchmark arithmetically reached: '+(data.silverReached?'Yes':'No'),
 'A threshold comparison does not establish hawl, the proper benchmark or a Zakat obligation.',
 example?'WARNING: Hypothetical prices in use.':''
 ].filter(Boolean).join('\n');
 downloadText('nisab-conditional-comparison.txt',txt,'text/plain;charset=utf-8');setNotice('Comparison downloaded locally.')};
 return <div className="fasting-deep-tool">
 <p className="small">Calculate <strong>both gold and silver Nisab thresholds</strong> using verified per-gram market prices. Add your qualifying net wealth to compare the results; no current prices are guessed or downloaded.</p>
 <div className="fasting-deep-fields">
 <label>Currency (no exchange conversion)<select value={currency} onChange={e=>changeCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>24k gold price per gram<input type="number" min="0.01" step="any" inputMode="decimal" value={gold} onChange={e=>{setGold(e.target.value);setExample(false)}} placeholder="Verified gold price"/></label>
 <label>Silver price per gram<input type="number" min="0.01" step="any" inputMode="decimal" value={silver} onChange={e=>{setSilver(e.target.value);setExample(false)}} placeholder="Verified silver price"/></label>
 <label>Qualifying assets (optional)<input type="number" min="0" step="any" inputMode="decimal" value={wealth} onChange={e=>setWealth(e.target.value)} placeholder="Leave blank to see only thresholds"/></label>
 <label>Permitted deductible liabilities (only if assessing wealth)<input type="number" min="0" step="any" inputMode="decimal" value={debts} onChange={e=>setDebts(e.target.value)}/></label>
 </div>
 <div className="action-row"><button type="button" className="secondary" onClick={load}>Load hypothetical comparison</button></div>
 {example&&<p className="fasting-example-label">Illustration only: gold £80/g, silver £1.20/g, assets £2,000 and permitted debts £200; amounts are not market quotes.</p>}
 {data?<><div className="fasting-deep-stats"><div><span>Gold Nisab (87.48g)</span><strong>{fmt(data.gold,currency)}</strong></div><div><span>Silver Nisab (612.36g)</span><strong>{fmt(data.silver,currency)}</strong></div>{data.net!==null&&<div><span>Net wealth for comparison</span><strong>{fmt(data.net,currency)}</strong></div>}</div>
 {data.net!==null?<div className="fasting-deep-breakdown"><h3>Compare your entered net wealth</h3>
 <p><strong>Gold benchmark:</strong> {data.goldReached?'Reached':'Not reached'} ({fmt(data.gold,currency)}). Conditional 2.5% arithmetic: {fmt(data.conditionalGold,currency)}.</p>
 <p><strong>Silver benchmark:</strong> {data.silverReached?'Reached':'Not reached'} ({fmt(data.silver,currency)}). Conditional 2.5% arithmetic: {fmt(data.conditionalSilver,currency)}.</p>
 <p>These are <strong>alternative benchmark comparisons, not two Zakat payments</strong>. Whether the silver or gold benchmark applies and the hawl is complete must be checked separately.</p>
 </div>:<p className="small">Add qualifying assets if you want to compare your wealth; otherwise these thresholds alone are your result.</p>}
 <div className="action-row print-hide"><button type="button" onClick={save}>Download comparison</button><button type="button" className="secondary" onClick={()=>window.print()}>Print / Save PDF</button></div></>:<p className="warn" role="status">Enter two positive verified per-gram prices. Wealth and liabilities must be valid non-negative amounts if provided.</p>}
 {notice&&<p role="status" className="small">{notice}</p>}
 <p className="warn">A money amount cannot decide religious eligibility on its own. Prices fluctuate, customary Nisab weights vary between scholarly authorities, hawl and deductions need review, and selecting currency does not convert amounts. The calculator sends or saves no personal financial data.</p>
 </div>;
}
