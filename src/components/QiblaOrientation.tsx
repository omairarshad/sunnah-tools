import {useEffect,useState} from 'react';
import {headingOffset} from '../lib/qiblaOrientation.mjs';
type AppleCompassEvent=DeviceOrientationEvent & {webkitCompassHeading?:number;webkitCompassAccuracy?:number};
type PermissionEventConstructor=typeof DeviceOrientationEvent & {requestPermission?:(absolute?:boolean)=>Promise<'granted'|'denied'>};
export default function QiblaOrientation({bearing}:{bearing:number}){
 const [enabled,setEnabled]=useState(false),[heading,setHeading]=useState<number|null>(null),[accuracy,setAccuracy]=useState<number|null>(null);
 const [status,setStatus]=useState(''),[declination,setDeclination]=useState('');
 useEffect(()=>{
  if(!enabled)return;
  const update=(raw:DeviceOrientationEvent)=>{
   const event=raw as AppleCompassEvent;
   if(typeof event.webkitCompassHeading==='number'&&Number.isFinite(event.webkitCompassHeading)){
    setHeading(event.webkitCompassHeading);if(typeof event.webkitCompassAccuracy==='number'&&Number.isFinite(event.webkitCompassAccuracy))setAccuracy(event.webkitCompassAccuracy);
    setStatus('');
   }else setStatus('This browser does not expose a magnetic compass heading. Use a calibrated compass or map instead.');
  };
  window.addEventListener('deviceorientation',update);
  return()=>window.removeEventListener('deviceorientation',update);
 },[enabled]);
 const start=async()=>{
  if(!window.isSecureContext||typeof DeviceOrientationEvent==='undefined'){setStatus('A secure browser with a supported motion sensor is needed. Use the true-north bearing above.');return}
  try{
   const permission=(DeviceOrientationEvent as PermissionEventConstructor).requestPermission;
   if(permission){const value=await permission.call(DeviceOrientationEvent,true);if(value!=='granted'){setStatus('Compass permission was not granted.');return}}
   setEnabled(true);setStatus('Hold your phone flat, away from magnets or metal, and rotate gently.');
  }catch{setStatus('Compass is not available or permission was declined.')}
 };
 const validDeclination=declination.trim()!==''&&Number.isFinite(Number(declination))&&Math.abs(Number(declination))<=30;
 const delta=heading===null||!validDeclination?null:headingOffset(bearing,heading,Number(declination));
 return <details className="settings qibla-phone-sensor">
 <summary>Optional phone compass (supported iPhones)</summary>
 <p className="small">The bearing above uses <strong>true north</strong>. Some phone sensors expose only a <strong>magnetic</strong> heading. This optional helper supports the browser's magnetic-heading sensor, and requires a verified local magnetic declination to compare the two. It is not automatically calibrated.</p>
 <div className="action-row"><button type="button" className="secondary" onClick={()=>{if(enabled){setEnabled(false);setHeading(null);setStatus('Compass stopped.')}else void start()}}>{enabled?'Stop compass':'Enable phone compass'}</button></div>
 {status&&<p className="small" role="status">{status}</p>}
 {heading!==null&&<><div className="result"><span>Phone magnetic heading (approximate)</span><strong>{heading.toFixed(1)}°</strong>{accuracy!==null&&<small>Reported sensor uncertainty: ±{accuracy.toFixed(1)}°</small>}</div>
 <label>Local magnetic declination (east +, west −, degrees)<input type="number" min="-30" max="30" step="0.1" value={declination} placeholder="Enter verified value" onChange={e=>setDeclination(e.target.value)}/></label>
 {delta!==null?<div className="result" role="status"><span>Approximate direction from the top of your phone</span><strong>{delta===0?'Aligned':(delta>0?'Turn right ':'Turn left ')+Math.abs(delta).toFixed(1)+'°'}</strong></div>:<p className="small">Enter an independently verified magnetic declination for your location before interpreting this magnetic heading.</p>}</>}
 <p className="warn">Magnetometers can be inaccurate near metal, vehicles and electronic devices. The phone must be held flat and its top used as the reference. If its sensor heading or declination is uncertain, use the static true-north bearing and a trustworthy map or calibrated compass. Sensor readings remain on this device.</p>
 </details>
}
