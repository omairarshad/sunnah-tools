/**
 * Progressive enhancement of the server-rendered tool knowledge bases.
 * Keeps every paragraph and citation present in initial HTML for search and
 * non-JS visitors, while adding native keyboard-accessible disclosure controls.
 */
export function enhanceToolKnowledge(doc=document){
 const main=doc.querySelector('.tool-main');
 const area=doc.querySelector('.tool-knowledge-area');
 if(!main||!area||area.dataset.accordionsReady==='true')return {count:0};
 const sections=[...area.querySelectorAll('section')].filter(section=>
  [...section.children].some(c=>c.tagName==='H3') &&
  !section.closest('.tool-guide-fold') &&
  !section.classList.contains('faq-detail'));
 const entries=[];
 for(const section of sections){
  const heading=[...section.children].find(c=>c.tagName==='H3');
  if(!heading)continue;
  const title=heading.textContent?.trim()||'Read this section';
  const details=doc.createElement('details');
  details.className='tool-guide-fold';
  const summary=doc.createElement('summary');
  summary.append(heading);
  const chevron=doc.createElement('span');
  chevron.className='tool-guide-chevron';
  chevron.setAttribute('aria-hidden','true');
  summary.append(chevron);
  const body=doc.createElement('div');
  body.className='tool-guide-fold-body';
  while(section.firstChild)body.appendChild(section.firstChild);
  details.append(summary,body);
  section.append(details);
  section.classList.add('tool-guide-fold-section');
  // Existing section ID remains the permanent anchor and aria-labelledby target.
  if(!section.id)section.id='guide-topic-'+(entries.length+1);
  entries.push({section,details,title});
 }
 if(entries.length===0)return {count:0};
 // Consolidate the secondary explanatory/FAQ/link sections without touching
 // the interactive calculator or individually accessible FAQ <details> controls.
 for(const section of main.querySelectorAll(':scope > section.explainer')){
  const label=section.querySelector(':scope > .section-label > h2');
  if(!label||section.querySelector(':scope > details.tool-guide-fold'))continue;
  const summary=doc.createElement('summary');
  summary.append(label);
  const chevron=doc.createElement('span');
  chevron.className='tool-guide-chevron';chevron.setAttribute('aria-hidden','true');
  summary.append(chevron);
  const details=doc.createElement('details');
  details.className='tool-guide-fold tool-guide-secondary';
  const content=doc.createElement('div');content.className='tool-guide-fold-body';
  while(section.firstChild)content.append(section.firstChild);
  // The old .section-label is retained, empty, in the body. Remove it to
  // avoid a duplicate decorative stripe and an unnecessary blank wrapper.
  const empty=content.querySelector(':scope > .section-label');
  if(empty&&!empty.textContent?.trim())empty.remove();
  details.append(summary,content);
  section.append(details);
  section.classList.add('tool-guide-fold-section','tool-extra-fold-section');
  if(!section.id)section.id='tool-extra-'+entries.length;
  entries.push({section,details,title:summary.textContent?.trim()||'Additional reading'});
 }
 const controls=doc.createElement('div');
 controls.className='tool-guide-controls';
 controls.setAttribute('aria-label','Guide navigation');
 const headingWrap=doc.createElement('div');
 headingWrap.className='tool-guide-controls-heading';
 const title=doc.createElement('h2');title.textContent='Explore the guide';
 const description=doc.createElement('p');description.textContent='Open only the topics you need. The calculator above stays ready to use.';
 headingWrap.append(title,description);
 const actions=doc.createElement('div');actions.className='tool-guide-controls-actions';
 const expand=doc.createElement('button');expand.type='button';expand.className='tool-guide-utility';
 expand.textContent='Expand all';
 const collapse=doc.createElement('button');collapse.type='button';collapse.className='tool-guide-utility';
 collapse.textContent='Collapse all';
 expand.addEventListener('click',()=>entries.forEach(({details})=>{details.open=true}));
 collapse.addEventListener('click',()=>entries.forEach(({details})=>{details.open=false}));
 const jump=doc.createElement('details');jump.className='tool-guide-index';
 const jumpSummary=doc.createElement('summary');jumpSummary.textContent='Jump to a topic';
 const jumpList=doc.createElement('nav');jumpList.setAttribute('aria-label','Guide topics');jumpList.className='tool-guide-index-links';
 // Include primary content chapters. Other sections remain reachable via
 // their own headings and top-level controls.
 for(const {section,title} of entries.filter(({section})=>area.contains(section))){
  const link=doc.createElement('a');link.href='#'+encodeURIComponent(section.id);link.textContent=title;
  link.addEventListener('click',()=>{jump.open=false;openHash(section.id,true)});
  jumpList.append(link);
 }
 jump.append(jumpSummary,jumpList);
 actions.append(jump,expand,collapse);
 controls.append(headingWrap,actions);
 area.before(controls);
 area.dataset.accordionsReady='true';
 doc.querySelector('.tool-screen')?.classList.add('tool-guide-enhanced');
 const openHash=(id,scroll=false)=>{
  const target=doc.getElementById(id);
  if(!target)return;
  let node=target;
  const parents=[];
  while(node&&node!==main){if(node.tagName==='DETAILS'&&node.classList.contains('tool-guide-fold'))parents.push(node);node=node.parentElement}
  const section=target.closest('.tool-guide-fold-section');
  if(section&&section.querySelector(':scope > details.tool-guide-fold'))parents.push(section.querySelector(':scope > details.tool-guide-fold'));
  for(const d of parents)d.open=true;
  if(scroll)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'smooth'}));
 };
 const activateHash=()=>{
  if(!location.hash)return;
  try{openHash(decodeURIComponent(location.hash.slice(1)),true)}catch{}
 };
 doc.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href^="#"]');
  if(!link)return;
  const hash=link.getAttribute('href')?.slice(1);
  if(hash)try{openHash(decodeURIComponent(hash))}catch{}
 });
 window.addEventListener('hashchange',activateHash);
 // Browser printing should include the *entire* educational reference.
 let printState=[];
 window.addEventListener('beforeprint',()=>{
  printState=entries.map(({details})=>details.open);
  entries.forEach(({details})=>{details.open=true});
 });
 window.addEventListener('afterprint',()=>{
  entries.forEach(({details},i)=>{details.open=printState[i]??false});
 });
 activateHash();
 return {count:entries.length,primary:entries.filter(x=>area.contains(x.section)).length};
}
