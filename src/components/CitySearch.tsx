import {useMemo,useState} from 'react';
import {matchCities} from '../lib/cities.mjs';
type City=[string,string,string,number,number,string,number];
export default function CitySearch({onSelect}:{onSelect:(city:City)=>void}){
 const [query,setQuery]=useState(''),[rows,setRows]=useState<City[]>([]),[status,setStatus]=useState<'idle'|'loading'|'ready'|'error'>('idle');
 const [open,setOpen]=useState(false);
 const results=useMemo(()=>query.trim().length<2?[]:matchCities(rows,query,8) as City[],[rows,query]);
 async function load(){
  if(status!=='idle')return;
  setStatus('loading');
  try{
   const response=await fetch('/data/cities.json',{cache:'force-cache'});
   if(!response.ok)throw new Error('Directory is unavailable');
   const json:unknown=await response.json();
   if(!Array.isArray(json)||json.length<15000)throw new Error('Invalid city directory');
   setRows(json as City[]);
   setStatus('ready');
  }catch{setStatus('error')}
 }
 const choose=(row:City)=>{onSelect(row);setQuery(row[0]+', '+row[1]);setOpen(false)};
 return <div className="city-search" onKeyDown={e=>{if(e.key==='Escape')setOpen(false)}}>
   <label htmlFor="city-lookup">Find your city worldwide</label>
   <input id="city-lookup" role="combobox" aria-autocomplete="list" aria-expanded={open&&results.length>0}
    aria-controls="city-suggestions" type="search" autoComplete="off"
    placeholder="Type city name (e.g. London, Lahore, Sydney)"
    value={query} onFocus={()=>{setOpen(true);void load()}} onChange={e=>{setQuery(e.target.value);setOpen(true);void load()}}/>
   {status==='loading'&&<p className="small" role="status">Loading the worldwide city directory…</p>}
   {status==='error'&&<p className="warn" role="status">City directory could not load. Use a preset city or enter your coordinates below.</p>}
   {status==='ready'&&open&&query.trim().length>=2&&<div id="city-suggestions" className="city-results" role="listbox" aria-label="City search results">
    {results.length?results.map(row=><button key={row[0]+'-'+row[1]+'-'+row[2]+'-'+row[3]} type="button" role="option" aria-selected={false} onClick={()=>choose(row)}>
      <span>{row[0]} <small>{row[2]&&row[2]!== '00'?row[2]+' · ':''}{row[1]}</small></span>
      <span className="small">{row[5]}</span>
    </button>):<p className="small">No matching city in the 15,000+ population dataset. Try a nearby city or enter your coordinates.</p>}
   </div>}
   <p className="small">Powered by <a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer">GeoNames</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>). Contains cities with approximately 15,000+ residents and capitals; smaller places can use coordinates.</p>
 </div>;
}
