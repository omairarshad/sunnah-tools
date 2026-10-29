import {useState} from 'react';
import {INVESTMENT_TYPES,investmentZakatBreakdown,safeSummary} from '../lib/zakatNextDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const money=(n:number,c:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c,maximumFractionDigits:2}).format(n);
const number=(s:string)=>s.trim()===''?NaN:Number(s);
type Row={name:string;kind:string;value:string;method:string;percent:string};
const starter:Row={name:'',kind:'trading-share',value:'',method:'full',percent:''};
export default function InvestmentZakatDeep(){
 const [rows,setRows]=useState<Row[]>([{...starter}]),[other,setOther]=useState('0'),[debts,setDebts]=useState('0'),[threshold,setThreshold]=useState(''),[currency,setCurrency]=useState('GBP'),[notice,setNotice]=useState(''),[example,setExample]=useState(false);
 const result=investmentZakatBreakdown({entries:rows.map(r=>({kind:r.kind,value:number(r.value),method:r.method,percent:r.percent.trim()?number(r.percent):NaN})),otherWealth:number(other),liabilities:number(debts),nisab:threshold.trim()?number(threshold):null});
 const update=(i:number,changes:Partial<Row>)=>{setRows(v=>v.map((r,n)=>n===i?{...r,...changes}:r));setExample(false)};
 const changeCurrency=(v:string)=>{setCurrency(v);setRows([{...starter}]);setOther('0');setDebts('0');setThreshold('');setExample(false);setNotice('Currency changed. Old prices and values were cleared instead of silently relabelled.')};
 const load=()=>{setCurrency('GBP');setRows([{name:'Trading shares',kind:'trading-share',value:'3000',method:'full',percent:''},{name:'Long-term shares',kind:'long-share',value:'8000',method:'proxy25',percent:''},{name:'Currency-like crypto',kind:'currency-crypto',value:'1000',method:'full',percent:''}]);setOther('500');setDebts('500');setThreshold('2000');setExample(true);setNotice('Hypothetical demonstration loaded. The 25% proxy must be accepted by your chosen scholar; £2,000 is not a live Nisab quote.')};
 const save=()=>{if(!result)return;const content=['Conditional shares and crypto Zakat estimate',
  'Currency: '+currency,'No market prices or exchange rates were fetched.',
  ...result.lines.map((x,i)=>'Entry '+(i+1)+' '+safeSummary(rows[i].name||x.kind)+': '+money(x.value,currency)+' × '+(x.fraction*100).toFixed(2)+'% = '+money(x.zakatable,currency)+' ('+x.assumption+')'),
  'Assessed investment portion: '+money(result.investmentBase,currency),
  'Other qualifying wealth: '+money(number(other),currency),
  'Permitted deductions entered: '+money(number(debts),currency),
  'Net assessed wealth: '+money(result.net,currency),
  'User-entered verified Nisab: '+(result.nisab===null?'Not entered':money(result.nisab,currency)),
  'Status: '+result.status,
  'Conditional 2.5% (only when threshold and all other rulings apply): '+money(result.conditionalZakat,currency),
  'Not a fatwa or payment receipt. Confirm asset classification, hawl, the benchmark, legal ownership, obligations and deductions.',
  example?'WARNING: Hypothetical demonstration figures are in use.':''].join('\n');
 downloadText('shares-crypto-zakat-estimate.txt',content,'text/plain;charset=utf-8');setNotice('Downloaded a local conditional estimate; no financial data was submitted.');};
 return <div className="fasting-deep-tool">
 <p className="small">Record up to 16 positions by <strong>how you hold them</strong>. Shares intended for resale may be assessed at full value, while long-term holdings can require an underlying asset percentage. Different cryptocurrency tokens need different assessment. This tool cannot determine religious asset categories automatically.</p>
 <div className="fasting-deep-panel"><h3>Investment positions</h3>
 {rows.map((r,i)=><div key={i} className="fasting-deep-fields">
 <label>Position {i+1} (optional private label)<input value={r.name} maxLength={60} onChange={e=>update(i,{name:e.target.value})} placeholder="e.g. Fund A, Bitcoin"/></label>
 <label>Asset category<select value={r.kind} onChange={e=>{const k=e.target.value;update(i,{kind:k,method:k==='long-share'?'underlying':k==='utility-token'?'assessed':'full',percent:''})}}>{INVESTMENT_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></label>
 <label>Current value in selected currency<input type="number" min="0" step="any" inputMode="decimal" value={r.value} onChange={e=>update(i,{value:e.target.value})} placeholder="Verified valuation"/></label>
 {r.kind==='long-share'&&<label>Long-term share assessment method<select value={r.method} onChange={e=>update(i,{method:e.target.value,percent:''})}><option value="underlying">Underlying qualifying assets (enter %)</option><option value="proxy25">25% proxy (only if accepted by scholar)</option></select></label>}
 {(r.kind==='utility-token'||(r.kind==='long-share'&&r.method==='underlying'))&&<label>Qualified assessed Zakatable portion (%)<input type="number" min="0" max="100" step="any" value={r.percent} inputMode="decimal" onChange={e=>update(i,{percent:e.target.value})} placeholder="0–100, independently assessed"/></label>}
 {rows.length>1&&<button className="secondary" type="button" onClick={()=>setRows(v=>v.filter((_,j)=>j!==i))}>Remove position {i+1}</button>}
 </div>)}
 <div className="action-row"><button className="secondary" type="button" disabled={rows.length>=16} onClick={()=>setRows(v=>[...v,{...starter}])}>+ Add position</button><button className="secondary" type="button" onClick={load}>Load hypothetical example</button></div></div>
 <div className="fasting-deep-fields">
 <label>Currency (no automatic FX conversion)<select value={currency} onChange={e=>changeCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Other independently qualified wealth<input type="number" min="0" step="any" inputMode="decimal" value={other} onChange={e=>setOther(e.target.value)}/></label>
 <label>Permitted deductible liabilities<input type="number" min="0" step="any" inputMode="decimal" value={debts} onChange={e=>setDebts(e.target.value)}/></label>
 <label>Verified applicable Nisab threshold (required for status)<input type="number" min="0.01" step="any" inputMode="decimal" value={threshold} onChange={e=>setThreshold(e.target.value)} placeholder="See Nisab Calculator"/></label>
 </div>
 {example&&<p className="fasting-example-label">Illustration only: £3,000 trading shares + 25% of £8,000 long-term shares + £1,000 assessed crypto + £500 other eligible wealth − £500 eligible liabilities = £6,000. Example Nisab £2,000 is invented, not a live quote.</p>}
 {result?<><div className="fasting-deep-stats">
 <div><span>Assessed investment portion</span><strong>{money(result.investmentBase,currency)}</strong></div>
 <div><span>Net assessed wealth</span><strong>{money(result.net,currency)}</strong></div>
 <div><span>Threshold status</span><strong>{result.status==='unchecked'?'Not checked':result.status==='threshold-reached'?'Meets entered threshold':'Below entered threshold'}</strong></div></div>
 <div className="fasting-deep-breakdown"><h3>Position-by-position calculation</h3>
 {result.lines.map((x,i)=><p key={x.index}><strong>{safeSummary(rows[i].name)||'Position '+x.index}:</strong> {money(x.value,currency)} × {(x.fraction*100).toFixed(1)}% = {money(x.zakatable,currency)}. {x.assumption}.</p>)}
 <p><strong>Conditional estimated 2.5%:</strong> {result.status==='unchecked'?'Enter your verified Nisab first':money(result.conditionalZakat,currency)}.</p>
 {result.status==='unchecked'&&<p>The arithmetic-only 2.5% figure before eligibility is {money(result.hypotheticalZakat,currency)}; this is <strong>not</strong> a payable amount.</p>}
 </div><div className="action-row print-hide"><button type="button" onClick={save}>Download calculation</button><button className="secondary" type="button" onClick={()=>window.print()}>Print / Save PDF</button></div>
 </>:<p className="warn" role="status">Enter a valid non-negative valuation for every position and a verified assessed percentage where required. Other wealth and liabilities must be valid numbers, and Nisab must be positive when entered.</p>}
 {notice&&<p role="status" className="small">{notice}</p>}
 <p className="warn"><strong>Classification matters:</strong> The 25% proxy is not universal; utility tokens are not automatically exempt; private companies, ETFs, pensions, staking and DeFi can require specialist review. Enter verified prices in one currency, confirm the correct Nisab and hawl, and do not double-count underlying assets or cash. No accounts or wallet connections are made.</p>
 </div>;
}
