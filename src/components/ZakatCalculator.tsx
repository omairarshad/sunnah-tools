import {useState} from 'react';
import {zakatPlan,zakatSummaryText,zakatFieldGroups} from '../lib/zakatPlanner.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const currencies=['GBP','USD','EUR','PKR','SAR','AED','CAD','AUD','INR'];
const exampleValues={cash:'500',bank:'6500',receivables:'500',goldHolding:'20',silverHolding:'0',goldPrice:'80',silverPrice:'1.2',investments:'1600',trade:'2500',other:'0',debts:'700',outgoings:'300'};
const formatMoney=(currency:string,value:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(value);

export default function ZakatCalculator(){
 const [values,setValues]=useState<Record<string,string>>({}),[benchmark,setBenchmark]=useState<'silver'|'gold'>('silver'),[metalEntry,setMetalEntry]=useState<'grams'|'value'>('grams'),[currency,setCurrency]=useState('GBP'),[hawl,setHawl]=useState(false),[example,setExample]=useState(false),[status,setStatus]=useState('');
 const plan=zakatPlan(values,{benchmark,metalEntry});
 const money=(n:number)=>formatMoney(currency,n);
 const change=(key:string,value:string)=>{setValues(p=>({...p,[key]:value}));setExample(false);setStatus('')};
 const useExample=()=>{setValues({...exampleValues});setBenchmark('silver');setCurrency('GBP');setMetalEntry('grams');setHawl(false);setExample(true);setStatus('Example loaded. Replace these numbers with your own values before using any estimate.')};
 const reset=()=>{if(Object.values(values).some(Boolean)&&!window.confirm('Clear all entered amounts?'))return;setValues({});setHawl(false);setExample(false);setStatus('Inputs cleared.')};
 const exportSummary=()=>{
  if(plan.error)return;
  try{downloadText('zakat-planning-estimate.txt',zakatSummaryText(plan,{currency,hawlConfirmed:hawl,example}),'text/plain;charset=utf-8');setStatus('Summary downloaded to your device.')}catch{setStatus('The summary could not be downloaded.')}
 };
 return <div className="zakat-planner">
   <p className="small">Work through your qualifying assets and permitted liabilities. Prices are entered by you, not fetched from live markets. Amounts remain in this browser tab unless you choose to download a summary.</p>
   <div className="two"><label>Currency for all amounts
      <select value={currency} onChange={e=>{setCurrency(e.target.value);setExample(false)}}>
        {currencies.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
    </label><label>Nisab benchmark
      <select value={benchmark} onChange={e=>setBenchmark(e.target.value as 'silver'|'gold')}>
        <option value="silver">Silver (612.36g)</option><option value="gold">Gold (87.48g)</option>
      </select>
   </label></div>
   <p className="small">Changing currency <strong>does not convert</strong> the figures. Enter every amount and both metal prices in the same selected currency.</p>
   <div className="action-row"><button type="button" className="secondary" onClick={useExample}>Show worked example</button><button type="button" className="secondary" onClick={reset}>Clear amounts</button></div>
   {example&&<p className="zakat-example-notice" role="status">Demonstration figures only — hypothetical values, including metal prices. Replace every example value with your own before using the estimate.</p>}
   {zakatFieldGroups.map((group,index)=><fieldset className="zakat-fieldset" key={group.title}>
      <legend>{index+1}. {group.title}</legend>
      {group.title==='Gold and silver holdings'&&<>
       <label>How will you enter your eligible gold and silver?
        <select value={metalEntry} onChange={e=>{setMetalEntry(e.target.value as 'grams'|'value');setExample(false);setValues(p=>({...p,goldHolding:'',silverHolding:''}));setStatus('Metal holdings cleared. Enter them again using the new valuation method.')}}>
         <option value="grams">Weight in grams</option><option value="value">Total qualifying monetary value</option>
        </select>
       </label>
       <p className="small">Use a current 24-carat gold price for the Nisab comparison and an appropriate current silver price. For jewellery of different purity, enter an independently checked qualifying value rather than multiplying its gross weight by a 24-carat price.</p>
      </>}
      <div className="two">{group.fields.map(field=><label key={field.key}>
        {field.label}{field.key==='goldHolding'||field.key==='silverHolding'?metalEntry==='grams'?' (grams)':' (value in '+currency+')':''}
        <input type="number" inputMode="decimal" min="0" step="any" value={values[field.key]??''} placeholder="0" onChange={e=>change(field.key,e.target.value)}/>
        <small>{field.help}</small>
       </label>)}</div>
      {group.title==='Liabilities'&&<p className="small">Debt rules differ by school and circumstances. Do not automatically deduct the whole balance of a long-term mortgage or every future household expense.</p>}
   </fieldset>)}
   <fieldset className="zakat-fieldset">
    <legend>5. Nisab prices</legend>
    <p className="small">Use verified current per-gram prices in <strong>{currency}</strong>. A positive price for the selected benchmark is required; the other price is optional unless you entered that metal's weight above.</p>
    <div className="two">
     <label>24-carat gold price per gram ({currency})<input type="number" inputMode="decimal" min="0" step="any" value={values.goldPrice??''} placeholder="Enter current price" onChange={e=>change('goldPrice',e.target.value)}/></label>
     <label>Silver price per gram ({currency})<input type="number" inputMode="decimal" min="0" step="any" value={values.silverPrice??''} placeholder="Enter current price" onChange={e=>change('silverPrice',e.target.value)}/></label>
    </div>
    <p className="small">Need to check prices? See <a href="https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/nisab/" target="_blank" rel="noopener noreferrer">Islamic Relief's Nisab reference</a>. Figures on third-party sites change; nothing is automatically imported here.</p>
   </fieldset>
   <div className="zakat-hawl"><label className="check"><input type="checkbox" checked={hawl} onChange={e=>setHawl(e.target.checked)}/> I have reviewed the applicable lunar-year (hawl) and ownership conditions using guidance I follow.</label>
    <p className="small">Checking this box is your own confirmation; this tool cannot establish when your Zakat year started or whether all conditions are met.</p></div>
   {plan.error?<p className="warn" role="alert">{plan.error}</p>:<section className="zakat-results" aria-live="polite">
      <h3>Your conditional Zakat estimate</h3>
      <div className="zakat-summary-grid">
       <div><span>Qualifying assets entered</span><strong>{money(plan.assets ?? 0)}</strong></div>
       <div><span>Eligible liabilities entered</span><strong>{money(plan.liabilities ?? 0)}</strong></div>
       <div><span>Net qualifying wealth</span><strong>{money(plan.net ?? 0)}</strong></div>
       <div><span>Selected {benchmark} Nisab</span><strong>{money(plan.threshold ?? 0)}</strong></div>
      </div>
      <div className="result zakat-main-result"><span>Conditional 2.5% estimate</span><strong>{money(plan.estimate ?? 0)}</strong><small>{plan.eligible?'Net wealth meets the selected Nisab value.':'Net wealth is below the selected Nisab value.'}</small></div>
      {plan.liabilities>plan.assets&&<p className="small">Your entered liabilities exceed your entered assets, so this calculation uses zero net qualifying wealth.</p>}
      <p className="zakat-conditional-warning">{!hawl?'The hawl and ownership conditions have not been confirmed. ':''}{example?'These are hypothetical demonstration figures. ':''}The amount above is an illustrative calculation, not a definitive ruling on what you owe.</p>
      <details className="settings" open>
       <summary>See the calculation breakdown</summary>
       <div className="table-wrap"><table className="zakat-breakdown">
         <tbody>
          <tr><th scope="row">Cash, savings and qualifying receivables</th><td>{money(plan.groups.money ?? 0)}</td></tr>
          <tr><th scope="row">Included gold and silver</th><td>{money(plan.groups.metals ?? 0)}</td></tr>
          <tr><th scope="row">Qualifying investments</th><td>{money(plan.groups.investments ?? 0)}</td></tr>
          <tr><th scope="row">Trade and business stock</th><td>{money(plan.groups.business ?? 0)}</td></tr>
          <tr><th scope="row">Other eligible assets</th><td>{money(plan.groups.other ?? 0)}</td></tr>
          <tr><th scope="row">Gross assets entered</th><td>{money(plan.assets ?? 0)}</td></tr>
          <tr><th scope="row">Liabilities deducted</th><td>−{money(plan.liabilities ?? 0)}</td></tr>
          <tr><th scope="row">Net assets</th><td>{money(plan.net ?? 0)}</td></tr>
          <tr><th scope="row">2.5% of net assets if selected Nisab and hawl conditions apply</th><td>{money(plan.estimate ?? 0)}</td></tr>
         </tbody>
        </table></div>
       <div className="zakat-nisab-grid">
        <div>Silver benchmark (612.36g)<strong>{(plan.thresholds?.silver ?? 0)>0?money(plan.thresholds?.silver ?? 0):'Enter silver price'}</strong></div>
        <div>Gold benchmark (87.48g)<strong>{(plan.thresholds?.gold ?? 0)>0?money(plan.thresholds?.gold ?? 0):'Enter gold price'}</strong></div>
       </div>
       <p className="small">Whether to use the silver or gold benchmark is a scholarly choice. Switching the benchmark may change the threshold, not the amounts you entered.</p>
      </details>
      <div className="action-row"><button type="button" className="secondary" onClick={exportSummary}>Download calculation summary</button><button type="button" className="secondary" onClick={()=>window.print()}>Print summary</button></div>
    </section>}
   {status&&<p role="status" className="small">{status}</p>}
   <p className="small">Personal homes and possessions are generally treated differently from assets held for trade. Gold jewellery, pensions, shares, long-term debts and amounts owed to you can require individual rulings. See the guide below and consult a qualified adviser where relevant.</p>
 </div>;
}
