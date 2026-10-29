import {useState} from 'react';
import {magneticBearing,qiblaContext} from '../lib/qiblaDetails.mjs';
export default function QiblaDetails({latitude,longitude,bearing,locationLabel}:{latitude:number;longitude:number;bearing:number;locationLabel:string}){
 const [declination,setDeclination]=useState(''),[message,setMessage]=useState('');
 const details=qiblaContext(latitude,longitude,bearing);
 const validDeclination=declination.trim()!==''&&Number.isFinite(Number(declination))&&Math.abs(Number(declination))<=30;
 const magnetic=details?.status==='ok'&&validDeclination?magneticBearing(bearing,Number(declination)):null;
 const copy=async()=>{
  if(!details||details.status!=='ok')return;
  const body='Qibla for '+locationLabel+': '+bearing.toFixed(1)+'° clockwise from true north ('+details.cardinal?.abbreviation+'). Approximate great-circle distance to the Kaaba: '+Math.round(details.distanceKm).toLocaleString('en-GB')+' km.'+(magnetic!==null?' Magnetic compass heading with verified declination '+Number(declination)+'°: '+magnetic.toFixed(1)+'°.':'')+' Verify your location and compass.';
  try{await navigator.clipboard.writeText(body);setMessage('Qibla direction copied.')}catch{setMessage('Copy unavailable. You can select the displayed result instead.')}
 };
 if(!details)return <p className="warn" role="alert">Enter valid latitude and longitude to calculate a Qibla direction.</p>;
 if(details.status!=='ok')return <p className="warn" role="alert">{details.status==='at-kaaba'?'You are at or extremely close to the Kaaba. A single compass bearing toward its centre is not meaningful at this distance.':'These coordinates are at or extremely near the point opposite the Kaaba. The shortest-path initial bearing is ambiguous. Adjust your location or seek local guidance.'}</p>;
 return <div className="qibla-details">
   <div className="qibla-details-summary">
     <div><span>Compass direction (approximate)</span><strong>{details.cardinal?.abbreviation}</strong><small>{details.cardinal?.label}</small></div>
     <div><span>Distance to the Kaaba (approximate)</span><strong>{Math.round(details.distanceKm).toLocaleString('en-GB')} km</strong><small>Along the Earth's surface, not by road</small></div>
   </div>
   <p className="small">The {bearing.toFixed(1)}° result is measured <strong>clockwise from true (geographic) north</strong>. City presets use an approximate city-centre location; enter precise coordinates or allow location access for a more local estimate.</p>
   <div className="action-row"><button type="button" className="secondary" onClick={()=>void copy()}>Copy Qibla direction</button><button type="button" className="secondary" onClick={()=>window.print()}>Print direction</button></div>
   {message&&<p className="small" role="status">{message}</p>}
   <details className="settings qibla-magnetic-tool">
     <summary>Using a magnetic compass? Convert the bearing</summary>
     <p className="small">A magnetic compass points toward local magnetic north, not geographic north. Enter a <strong>verified magnetic declination</strong> for your location and date from a source such as <a href="https://www.ncei.noaa.gov/products/magnetic-declination" target="_blank" rel="noopener noreferrer">NOAA</a>. East is positive (+), west negative (−). Do not guess or assume zero.</p>
     <label>Magnetic declination, degrees east (+) or west (−)
       <input type="number" inputMode="decimal" step="0.1" min="-30" max="30" value={declination} placeholder="Enter verified value" onChange={e=>setDeclination(e.target.value)}/>
     </label>
     {magnetic===null
        ?<p className="small">Enter a verified value between −30° and +30° to see the magnetic compass bearing. No correction is applied until you enter a value.</p>
        :<div className="result" role="status"><span>Approximate target on a magnetic compass</span><strong>{magnetic.toFixed(1)}°</strong><small>True-north Qibla bearing {bearing.toFixed(1)}° minus east-positive declination {Number(declination).toFixed(1)}°. Keep the compass level and away from magnets and metal.</small></div>}
     <p className="small">This is a navigation aid. Some phones already correct for magnetic north; do not apply the same correction twice.</p>
   </details>
 </div>;
}
