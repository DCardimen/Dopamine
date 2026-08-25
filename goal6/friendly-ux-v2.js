'use strict';
(()=>{
const api=window.DopamineSkills,sup=window.DopamineSupports,cat=window.DopamineSupportCatalog,ui=window.DopamineSupportUI;
if(!api||!sup||!cat||!ui)return;
const css=document.createElement('style');css.id='g6FriendlyUxV2Css';css.textContent=`
#skillLabPanel .g4skill.g6activeCard{order:-20;border-color:#6ac9ad!important;box-shadow:0 0 0 1px #6ac9ad44 inset}
#skillLabPanel .g4skill.g6activeCard:before{content:'ACTIVE';display:inline-block;font:900 5px/1 system-ui;letter-spacing:.1em;color:#87e4c6;background:#103329;border:1px solid #3b7d69;border-radius:99px;padding:3px 5px;margin-bottom:4px}
.g6quickActions{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin:4px 0}.g6quickActions button{min-height:30px;font-size:7px;background:#0b3027;border-color:#438b75}.g6quickActions button:disabled{opacity:.35}
.g6navbtn{min-width:34px!important;padding:0 7px!important;font-size:10px!important}.g6active .g6navlabel{pointer-events:none;opacity:.65;font-size:6px;display:flex;align-items:center;padding:0 2px}
.g6recommend{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:0 0 5px}.g6recommend button{min-height:40px;padding:4px;font-size:6px;text-align:left;background:#0d2b24;border-color:#4d987f}.g6recommend button b{display:block;font-size:7px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.g6recommend button span{display:block;opacity:.65;font-size:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.g6recommend .move{border-style:dashed}
.g6loadSupportCount{display:block;margin-top:2px;font-size:6px;color:#8fe0c7;opacity:.8}
@media(max-width:520px){.g6quickActions{grid-template-columns:1fr 1fr}.g6recommend{grid-template-columns:repeat(3,minmax(0,1fr))}.g6recommend button{min-height:36px;padding:3px}.g6active .g6navlabel{display:none}}
`;
document.head.appendChild(css);
let busy=false;
function activeIds(){return [...new Set((api.loadout?.()||[]).filter(Boolean))]}
function score(sid,id){
 const d=cat.get(id),skill=api.get(sid);if(!d||!skill)return-9999;
 const tags=new Set(skill.tags||[]);let n=0;
 const bonus={Projectile:42,Minion:42,Melee:38,Movement:38,Area:32,DoT:32,Repeat:22,Tempo:20,Conversion:14};n+=bonus[d.category]||8;
 if(d.requires?.some(t=>tags.has(t)))n+=34;
 if(d.category==='Projectile'&&tags.has('Projectile'))n+=24;
 if(d.category==='Minion'&&tags.has('Minion'))n+=24;
 if(d.category==='Melee'&&tags.has('Melee'))n+=20;
 if(d.category==='Movement'&&tags.has('Movement'))n+=20;
 if(d.category==='Area'&&(tags.has('AoE')||tags.has('DoT')))n+=18;
 if(d.category==='DoT'&&(tags.has('DoT')||tags.has('Chaos')))n+=18;
 if(d.selfDamage)n-=30;if(d.pattern==='duelist'||d.pattern==='farshot'||d.pattern==='pointblank')n-=4;
 n+=d.tier===1?8:d.tier===2?4:0;
 const avail=sup.availableCopies?.(id,sid)||0;if(avail>0)n+=18;else if((sup.allocations?.(id,sid)||[]).length)n-=14;
 if((sup.equipped?.(sid)||[]).includes(id))n-=100;
 return n;
}
function candidates(sid,{allowMove=true}={}){
 return cat.ids().filter(id=>sup.owned(id)>0&&sup.compatible(sid,id)&&!(sup.equipped(sid)||[]).includes(id)).filter(id=>allowMove||(sup.availableCopies?.(id,sid)||0)>0).sort((a,b)=>score(sid,b)-score(sid,a)||cat.get(a).name.localeCompare(cat.get(b).name));
}
function firstEmpty(sid){const cap=sup.unlockedSlots?.(sid)??sup.maxPerSkill,a=sup.sockets?.(sid)||[];for(let i=0;i<cap;i++)if(!a[i])return i;return-1}
function addNext(){const sid=ui.selected?.();if(!sid)return false;const slot=firstEmpty(sid);if(slot<0)return false;ui.openPicker?.(slot);return true}
function autoFill(){
 const sid=ui.selected?.();if(!sid)return 0;let count=0;
 const cap=sup.unlockedSlots?.(sid)??sup.maxPerSkill;let usedGroups=new Set((sup.equipped(sid)||[]).map(id=>cat.get(id)?.group).filter(Boolean));
 for(let slot=0;slot<cap;slot++){
   if(sup.supportAt?.(sid,slot))continue;
   const pick=candidates(sid,{allowMove:false}).find(id=>{const g=cat.get(id)?.group;return!g||!usedGroups.has(g)});
   if(!pick)break;
   const r=sup.assignSocket?.(sid,slot,pick);if(r?.ok){count++;const g=cat.get(pick)?.group;if(g)usedGroups.add(g)}
 }
 ui.render?.(sid);return count
}
function cycle(dir){const ids=activeIds(),sid=ui.selected?.();if(ids.length<2||!sid)return false;let i=ids.indexOf(sid);if(i<0)i=0;i=(i+dir+ids.length)%ids.length;ui.render?.(ids[i]);return true}
function reorderArsenal(){
 const grid=document.querySelector('#skillLabPanel .g4grid');if(!grid)return;
 const active=activeIds(),cards=[...grid.querySelectorAll('.g4skill[data-g6-skill-entry]')];
 if(!cards.length)return;
 cards.forEach(c=>c.classList.toggle('g6activeCard',active.includes(c.dataset.g6SkillEntry)));
 const rank=id=>{const ai=active.indexOf(id);if(ai>=0)return ai;return api.isOwned(id)?20+api.ownedIds().indexOf(id):1000+api.ids().indexOf(id)};
 cards.sort((a,b)=>rank(a.dataset.g6SkillEntry)-rank(b.dataset.g6SkillEntry)).forEach(c=>grid.appendChild(c));
 const loads=[...document.querySelectorAll('#skillLabPanel .g4slot[data-g6-skill-entry]')];
 loads.forEach(c=>{if(c.querySelector('.g6loadSupportCount'))return;const sid=c.dataset.g6SkillEntry,filled=sup.equipped(sid).length,cap=sup.unlockedSlots?.(sid)??sup.maxPerSkill;const x=document.createElement('span');x.className='g6loadSupportCount';x.textContent=`SUPPORTS ${filled}/${cap}`;c.appendChild(x)})
}
function decorateSupport(){
 const card=document.getElementById('g6supportCard'),sid=ui.selected?.();if(!card||!sid||getComputedStyle(ui.panel()).display==='none')return;
 if(!card.querySelector('.g6quickActions')){
   const slots=card.querySelector('.g6slots');if(slots){const wrap=document.createElement('div');wrap.className='g6quickActions';const next=document.createElement('button');next.id='g6addNext';next.textContent='＋ ADD NEXT SUPPORT';next.onclick=()=>addNext();const auto=document.createElement('button');auto.id='g6autoFill';auto.textContent='⚡ AUTO-FILL EMPTY';auto.onclick=()=>{const n=autoFill();auto.textContent=n?`✓ FILLED ${n} SOCKET${n===1?'':'S'}`:'✓ NOTHING TO FILL';setTimeout(()=>{if(document.getElementById('g6autoFill'))document.getElementById('g6autoFill').textContent='⚡ AUTO-FILL EMPTY'},900)};wrap.append(next,auto);slots.before(wrap)}}
 const actions=card.querySelector('.g6quickActions');if(actions){const empty=firstEmpty(sid);actions.querySelector('#g6addNext').disabled=empty<0;actions.querySelector('#g6autoFill').disabled=empty<0||!candidates(sid,{allowMove:false}).length}
 const strip=card.querySelector('.g6active');if(strip&&!strip.querySelector('.g6navbtn')){const prev=document.createElement('button');prev.className='g6navbtn';prev.textContent='‹';prev.title='Previous active skill';prev.onclick=()=>cycle(-1);const next=document.createElement('button');next.className='g6navbtn';next.textContent='›';next.title='Next active skill';next.onclick=()=>cycle(1);const label=document.createElement('span');label.className='g6navlabel';label.textContent='ACTIVE';strip.prepend(label,prev);strip.append(next)}
}
function decoratePicker(){
 const picker=ui.picker?.(),sid=ui.selected?.(),slot=ui.pickerSlot?.();if(!picker||!sid||slot==null||getComputedStyle(picker).display==='none')return;
 const list=picker.querySelector('.g6picklist');if(!list||list.querySelector('.g6recommend'))return;
 const rec=candidates(sid,{allowMove:true}).slice(0,3);if(!rec.length)return;
 const box=document.createElement('div');box.className='g6recommend';box.innerHTML=rec.map(id=>{const d=cat.get(id),move=(sup.availableCopies?.(id,sid)||0)<=0;return`<button data-g6-rec="${id}" class="${move?'move':''}"><b>★ ${d.name}</b><span>${move?'MOVE HERE':d.category+' • RECOMMENDED'}</span></button>`}).join('');
 box.querySelectorAll('[data-g6-rec]').forEach(b=>b.onclick=()=>{const id=b.dataset.g6Rec,r=sup.assignSocket?.(sid,slot,id);if(r?.ok){ui.closePicker?.();ui.render?.(sid)}});list.prepend(box)
}
function decorateNow(){reorderArsenal();decorateSupport();decoratePicker()}
function refresh(){if(busy)return;busy=true;requestAnimationFrame(()=>{try{decorateNow()}finally{busy=false}})}
const mo=new MutationObserver(refresh);mo.observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',()=>requestAnimationFrame(refresh),true);requestAnimationFrame(refresh);
window.DopamineFriendlyUX=Object.freeze({version:'Friendly UX v2.1',activeIds,score,candidates,firstEmpty,addNext,autoFill,cycle,decorateNow,refresh});
})();