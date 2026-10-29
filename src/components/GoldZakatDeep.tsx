import {useState} from 'react';
import {GOLD_KARATS,goldPortfolioEstimate} from '../lib/givingDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';
const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const money=(n:number,c:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c,maximumFractionDigits:2}).format(n);
const parse=(s:string)=>s.trim()!==''?Number(s):NaN;
type MetalRow={weight:string;karat:number};
export default function GoldZakatDeep(){
 const [rows,setRows]=useState<MetalRow[]>([{weight:'',karat:22}]),[price,setPrice]=useState(''),[currency,setCurrency]=useState('GBP'),[assets,setAssets]=useState('0'),[debts,setDebts]=useState('0'),[benchmark,setBenchmark]=useState<'gold'|'silver'>('gold'),[silver,setSilver]=useState(''),[example,setExample]=useState(false),[notice,setNotice]=useState('');
 const result=goldPortfolioEstimate({items:rows.map(r=>({weight:parse(r.weight),karat:r.karat})),price24k:parse(price),otherAssets:parse(assets),liabilities:parse(debts),benchmark,silverPrice:parse(silver)});
 const setRow=(i:number,key:keyof MetalRow,v:string)=>{setRows(old=>old.map((r,n)=>n===i?{...r,[key]:key==='karat'?Number(v):v}:r));setExample(false)};
 const load=()=>{setRows([{weight:'30',karat:22},{weight:'20',karat:18}]);setPrice('80');setAssets('1000');setDebts('100');setSilver('1.2');setBenchmark('silver');setCurrency('GBP');setExample(true);setNotice('Hypothetical £80/g gold and £1.20/g silver rates loaded. Replace with verified values for an actual estimate.')};
 const currencyChange=(v:string)=>{setCurrency(v);setPrice('');setSilver('');setAssets('0');setDebts('0');setExample(false);setNotice('Currency changed; all previous prices and non-metal amounts cleared to prevent incorrect relabelling.')};
 const save=()=>{if(!result)return;const txt=['Gold Zakat conditional calculation','Currency: '+currency,
 ...result.lines.map(r=>'Item '+r.item+': '+r.weight+'g at '+r.karat+'k = '+r.pureGrams.toFixed(3)+'g fine gold; metal estimate '+money(r.value,currency)),
 'Fine gold content: '+result.fineGold.toFixed(3)+'g',
 'Combined indicative gold metal value: '+money(result.goldValue,currency),
 'Other qualifying assets entered: '+money(parse(assets),currency),
 'Permitted liabilities entered: '+money(parse(debts),currency),
 'Net qualifying wealth estimate: '+money(result.net,currency),
 'Chosen benchmark: '+result.benchmark+'; threshold '+money(result.threshold,currency),
 'Meets chosen threshold arithmetically: '+(result.meetsThreshold?'Yes':'No'),
 'Conditional 2.5% on net qualifying wealth: '+money(result.conditionalTotal,currency),
 'Not a religious ruling. Check whether jewellery is included, hawl, asset values, permitted liabilities, and chosen Nisab benchmark.',
 example?'WARNING: Hypothetical demonstration prices were used.':''
 ].join('\n');downloadText('gold-zakat-conditional-estimate.txt',txt,'text/plain;charset=utf-8');setNotice('Local estimate downloaded; no payment was made.')};
 return <div className="fasting-deep-tool">
 <p className="small">Add up to twelve gold items with individual purity. This estimates <strong>fine-gold content at a 24k price</strong>; it does not price stones, craftsmanship or resale premiums. A 2.5% figure is conditional on total applicable wealth, Nisab, hawl and jewellery rulings.</p>
 <div className="fasting-deep-panel"><h3>Gold items and purity</h3>
 {rows.map((row,i)=><div className="fasting-deep-fields" key={i}>
 <label>Item {i+1} · gold weight (excluding stones), grams<input type="number" inputMode="decimal" min="0.001" step="any" value={row.weight} onChange={e=>setRow(i,'weight',e.target.value)} placeholder="Enter gold-only weight"/></label>
 <label>Item {i+1} · purity<select value={row.karat} onChange={e=>setRow(i,'karat',e.target.value)}>{GOLD_KARATS.map(k=><option key={k} value={k}>{k}k ({(100*k/24).toFixed(1)}% fine gold)</option>)}</select></label>
 {rows.length>1&&<button type="button" className="secondary" onClick={()=>setRows(v=>v.filter((_,j)=>j!==i))}>Remove item {i+1}</button>}
 </div>)}
 <div className="action-row"><button type="button" className="secondary" disabled={rows.length>=12} onClick={()=>setRows(v=>[...v,{weight:'',karat:22}])}>+ Add gold item</button><button type="button" className="secondary" onClick={load}>Load hypothetical worked example</button></div></div>
 <div className="fasting-deep-fields">
 <label>Currency (no automatic FX conversion)<select value={currency} onChange={e=>currencyChange(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Verified 24k gold price per gram<input type="number" inputMode="decimal" min="0.01" step="any" value={price} onChange={e=>{setPrice(e.target.value);setExample(false)}} placeholder="Current price in chosen currency"/></label>
 <label>Other qualifying Zakat assets (optional)<input type="number" min="0" step="any" value={assets} onChange={e=>setAssets(e.target.value)} inputMode="decimal"/></label>
 <label>Permitted deductible liabilities (optional)<input type="number" min="0" step="any" value={debts} onChange={e=>setDebts(e.target.value)} inputMode="decimal"/></label>
 <label>Which Nisab benchmark to compare?<select value={benchmark} onChange={e=>setBenchmark(e.target.value as 'gold'|'silver')}><option value="gold">Gold 87.48g</option><option value="silver">Silver 612.36g</option></select></label>
 {benchmark==='silver'&&<label>Verified silver price per gram<input type="number" min="0.01" step="any" value={silver} onChange={e=>setSilver(e.target.value)} inputMode="decimal" placeholder="Required for silver benchmark"/></label>}
 </div>
 {example&&<p className="fasting-example-label">Example only: 30g of 22k and 20g of 18k, hypothetical gold £80/g and silver £1.20/g. It does not establish an actual price, Nisab choice or duty.</p>}
 {result?<><div className="fasting-deep-stats">
 <div><span>Fine gold equivalent</span><strong>{result.fineGold.toFixed(3)} g</strong></div>
 <div><span>Estimated metal value</span><strong>{money(result.goldValue,currency)}</strong></div>
 <div><span>Net wealth entered</span><strong>{money(result.net,currency)}</strong></div>
 </div><div className="fasting-deep-breakdown"><h3>Gold and Nisab comparison</h3>
 {result.lines.map(r=><p key={r.item}>Item {r.item}: {r.weight} g at {r.karat}k = {r.pureGrams.toFixed(3)}g pure gold ≈ <strong>{money(r.value,currency)}</strong>.</p>)}
 <p>Combined gross assets: {money(result.gross,currency)}. Selected {result.benchmark} Nisab threshold: {money(result.threshold,currency)}.</p>
 <p><strong>{result.meetsThreshold?'The entered net wealth meets the chosen benchmark.':'The entered net wealth is below the chosen benchmark.'}</strong> This numerical comparison does not establish a completed hawl or which assets are zakatable.</p>
 <p>Conditional 2.5% on the qualifying net wealth: <strong>{money(result.conditionalTotal,currency)}</strong>{result.meetsThreshold?' (only if all religious conditions apply)':' (zero under the selected threshold calculation)'}.</p>
 </div><div className="action-row print-hide"><button type="button" onClick={save}>Download calculation</button><button type="button" className="secondary" onClick={()=>window.print()}>Print / Save PDF</button></div></>:<p className="warn" role="status">Provide valid positive weights, a verified positive 24k price and, when selecting silver Nisab, a valid silver price. Other wealth and liabilities must be non-negative.</p>}
 {notice&&<p role="status" className="small">{notice}</p>}
 <p className="warn">Hanafi and other schools differ on personal-use jewellery. Excluding stones from metal weight does not decide the treatment of jewellery held for trade. Verify all assets, hawl and eligibility with qualified guidance. Nothing is uploaded or stored by this calculator.</p>
 </div>;
}
