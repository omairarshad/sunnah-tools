import {useEffect,useState} from 'react';
import {TASBIH_PATTERNS,tasbihStep} from '../lib/quranRemembranceDeep.mjs';
type Mode='free'|'33-33-34'|'33-33-33';
type Saved={version:2;mode:Mode;stage:number;count:number;sessions:number;freeGoal:number};
const initial:Saved={version:2,mode:'free',stage:0,count:0,sessions:0,freeGoal:100};
export default function TasbihDeep(){
 const [s,setS]=useState<Saved>(initial),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{try{
 const v=JSON.parse(localStorage.getItem('sunnah-tasbih-v2')??'null');
 if(v&&v.version===2&&tasbihStep(v.mode,v.stage,v.count)&&Number.isSafeInteger(v.sessions)&&v.sessions>=0&&v.sessions<=1000000&&[33,99,100,1000].includes(v.freeGoal))setS(v);
 else{const old=Number(localStorage.getItem('sunnah-count'));if(Number.isSafeInteger(old)&&old>0&&old<=100000)setS({...initial,count:old})}
 }catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem('sunnah-tasbih-v2',JSON.stringify(s));if(s.mode==='free')localStorage.setItem('sunnah-count',String(s.count))}catch{}},[s,ready]);
 const current=tasbihStep(s.mode,s.stage,s.count)!;
 const goal=s.mode==='free'?s.freeGoal:current.goal;
 const increment=()=>setS(x=>({...x,count:Math.min(x.mode==='free'?100000:goal,x.count+1)}));
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.code!=='Space'||e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;const target=e.target;if(target instanceof HTMLElement&&(['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(target.tagName)||target.isContentEditable))return;e.preventDefault();increment()};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[s.mode,s.stage,s.freeGoal]);
 const advance=()=>{if(s.count<goal)return;const stages=TASBIH_PATTERNS[s.mode];if(s.stage<stages.length-1){setS(x=>({...x,stage:x.stage+1,count:0}));setNotice('Next phrase selected; count reset for the next stage.')}else{setS(x=>({...x,stage:0,count:0,sessions:Math.min(1000000,x.sessions+1)}));setNotice('One chosen cycle recorded. This is a personal tally, not a measure of spiritual merit.')}};
 return <div className="fasting-deep-tool">
 <p className="small">Count dhikr on your phone or keyboard. Choose a <strong>free counter</strong>, the reported <strong>33/33/34</strong> pattern, or the <strong>33/33/33 plus final Tawhid declaration</strong> pattern. They are alternative reported formats; the app does not combine them into a new religious formula.</p>
 <div className="fasting-deep-fields"><label>Counting mode<select value={s.mode} onChange={e=>{setS(x=>({...x,mode:e.target.value as Mode,stage:0,count:0}));setNotice('Pattern changed. Count reset for this new mode.')}}><option value="free">Free counting (no prescribed target)</option><option value="33-33-34">After Salah: 33 / 33 / 34</option><option value="33-33-33">After Salah: 33 / 33 / 33 + final declaration</option></select></label>
 {s.mode==='free'&&<label>Optional personal goal<select value={s.freeGoal} onChange={e=>setS(x=>({...x,freeGoal:Number(e.target.value)}))}>{[33,99,100,1000].map(n=><option key={n} value={n}>{n}</option>)}</select></label>}</div>
 <div className="fasting-deep-stats"><div><span>Current phrase</span><strong>{current.label}</strong></div><div><span>Count / displayed goal</span><strong>{s.count} / {goal}</strong></div><div><span>Completed chosen cycles</span><strong>{s.sessions}</strong></div></div>
 <progress value={Math.min(s.count,goal)} max={goal} aria-label="Dhikr counting progress"/>
 <div className="action-row"><button type="button" onClick={increment}>+ Count dhikr</button><button type="button" className="secondary" disabled={s.count===0} onClick={()=>setS(x=>({...x,count:Math.max(0,x.count-1)}))}>Undo one</button>{s.count>=goal&&<button type="button" onClick={advance}>{s.mode==='free'?'Record cycle and restart':s.stage===TASBIH_PATTERNS[s.mode].length-1?'Finish pattern':'Next phrase'}</button>}</div>
 <p className="small">Use Space when focus is outside inputs and buttons. Switching mode resets the current stage but does not erase completed cycle totals. Counts remain in this browser; the old free-counter value migrates automatically when no new record exists.</p>
 <div className="action-row"><button type="button" className="secondary" onClick={()=>{if(window.confirm('Clear current count and completed cycle tally on this device?')){setS(initial);setNotice('Local Tasbih tally reset.')}}}>Clear count and cycles</button></div>
 <p>Sources: <a href="https://sunnah.com/muslim:597a" target="_blank" rel="noopener noreferrer">Sahih Muslim 597a</a> for the 33/33/33 + final Tawhid declaration; <a href="https://sunnah.com/muslim:596a" target="_blank" rel="noopener noreferrer">Sahih Muslim 596a</a> for another reported after-prayer format. Read the complete last declaration at its source; this app only tracks it as a stage.</p>
 <p className="warn">A digital count does not determine worship acceptance or create a prescribed count for unsourced voluntary dhikr. For a 33/33/33 + final Tawhid pattern, the final stage represents reading the whole declaration as given in its narration.</p>
 </div>;
}
