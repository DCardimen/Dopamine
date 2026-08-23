'use strict';
(()=>{
const q=new URLSearchParams(location.search);
const activeModes=['goal3signofftest','goal3freshbenchmark','goal3multisoak','goal3diversity'].some(k=>q.has(k));
const otherGate=['selftest','goal3test','goal3mobiletest','goal3soak','goal3progressiontest','goal3progressionsoak','goal3loadoutuitest','goal3skillsoak'].some(k=>q.has(k));
if(otherGate&&!activeModes)return;
const p=window.DopamineSkillProgression,s=window.DopamineSkillSignoff,api=window.DopamineSkills;if(!p||!s||!api)return;
const ids=api.ids(),bandDry={};
function levelFor(e){return Math.max(1,(depth|0)+(e?.type==='elite'?1:e?.type==='boss'?3:0))}
function lockedAt(level){return ids.filter(id=>!p.isOwned(id)&&p.unlockDepth(id)<=level).sort((a,b)=>p.unlockDepth(a)-p.unlockDepth(b))}
function median(){const a=ids.filter(id=>p.isOwned(id)).map(id=>p.level(id)).sort((a,b)=>a-b);return a.length?a[Math.floor(a.length/2)]:1}
const oldKill=typeof kill==='function'?kill:null;if(oldKill)kill=function(e){const before=Object.fromEntries(ids.map(id=>[id,p.isOwned(id)])),dead=e?.dead;oldKill(e);if(!e||dead||!e.dead)return;const level=levelFor(e),locked=lockedAt(level),discovered=ids.some(id=>!before[id]&&p.isOwned(id));if(!locked.length||discovered)return;const id=locked[0],key=String(p.unlockDepth(id)),threshold=level<5?3:level<12?4:5;bandDry[key]=(bandDry[key]||0)+1;if(bandDry[key]>=threshold){bandDry[key]=0;const target=Math.min(p.capForMonster(level),Math.max(1,median()-2));const r=p.grantDrop(id,target,level);if(r?.accepted){try{ring(e.x,e.y,56,'#d7a4ff',5);announce(`DISCOVERY PROTECTION • ${api.get(id).name.toUpperCase()}`,'#d7a4ff')}catch(x){};decorate()}}};
const oldDecorate=s.decorate.bind(s),oldPreset=s.preset.bind(s);
function setHtml(el,v){if(el&&el.innerHTML!==v)el.innerHTML=v}
function decorate(){oldDecorate();const panel=document.getElementById('skillLabPanel'),card=panel?.querySelector('.g3card');if(!card)return;let collection=card.querySelector('.g3collection');if(!collection){collection=document.createElement('div');collection.className='g3collection';card.querySelector('.g3progress')?.before(collection)}const owned=api.ownedIds(),next=api.nextUnlock?.();setHtml(collection,`<b>COLLECTION ${owned.length}/${ids.length}</b> • ${owned.length===ids.length?'Complete current catalog':`Next discovery around monster level ${next?.monsterLevel||'?'}`}<br><span>Versioned v13 save metadata keeps a v12 progression backup for migration safety.</span>`);let bar=card.querySelector('#g3presetbar');if(!bar){bar=document.createElement('div');bar.id='g3presetbar';bar.innerHTML=['melee','ranged','control','summon'].map(k=>`<button data-signpreset="${k}">${k.toUpperCase()}</button>`).join('');collection.after(bar);bar.querySelectorAll('[data-signpreset]').forEach(b=>b.onclick=()=>{oldPreset(b.dataset.signpreset);decorate()})}let warn=card.querySelector('.g3buildwarn');if(!warn){warn=document.createElement('div');warn.className='g3buildwarn';bar.after(warn)}const ws=s.buildWarnings();warn.classList.toggle('good',!ws.length);setHtml(warn,ws.length?`<b>BUILD CHECK</b><br>${ws.join('<br>')}`:'<b>BUILD CHECK ✓</b> Loadout has healthy role/cooldown coverage.')}
s.decorate=decorate;s.preset=k=>{oldPreset(k);decorate()};
const mo=new MutationObserver(()=>{const panel=document.getElementById('skillLabPanel');if(panel?.style.display==='block'&&!panel.querySelector('.g3collection'))requestAnimationFrame(decorate)});mo.observe(document.body,{childList:true,subtree:true});
decorate();
})();
