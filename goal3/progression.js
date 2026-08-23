'use strict';
(()=>{
const PVER='Goal 03 Skill Progression v1.2';
const q=new URLSearchParams(location.search);
const progressionTest=q.has('goal3progressiontest'),progressionSoak=q.has('goal3progressionsoak');
const legacyGate=!progressionTest&&!progressionSoak&&(q.has('selftest')||q.has('goal3test')||q.has('goal3mobiletest')||q.has('goal3soak'));
const api=window.DopamineSkills;
if(!api)return;
const ids=api.ids(),defs=Object.fromEntries(ids.map(id=>[id,api.get(id)]));
const META={
 Slash:{unlock:1,growth:.075,role:'Starter melee',perk:'Lv5 cleave • Lv10 execute • Lv20 brutal cleave'},
 Firebolt:{unlock:2,growth:.072,role:'Ranged fire spell',perk:'Lv5 ignite • Lv10 ember splash • Lv20 stronger burn'},
 Whirlwind:{unlock:4,growth:.066,role:'Sustained melee AoE',perk:'Lv5 momentum • Lv10 sustain • Lv20 faster ramp'},
 Dash:{unlock:6,growth:.071,role:'Mobility strike',perk:'Lv5 long-dash impact • Lv10 recovery • Lv20 impact boost'},
 Slam:{unlock:8,growth:.078,role:'Heavy melee AoE',perk:'Lv5 stagger • Lv10 aftershock • Lv20 stronger shock'},
 Scorch:{unlock:11,growth:.064,role:'Persistent fire DoT',perk:'Lv5 heat stacks • Lv10 slow • Lv20 inferno stacks'},
 Wisp:{unlock:14,growth:.062,role:'Temporary fire minion',perk:'Lv5 chain ember • Lv10 sustain • Lv20 stronger chain'}
};
const BASE={};
for(const id of ids){const d=defs[id];BASE[id]={baseDamage:d.baseDamage,cooldown:d.cooldown,area:d.area,range:d.range,duration:d.duration,tickRate:d.tickRate,projectileSpeed:d.projectileSpeed,critChance:d.critChance||0}}
const KEY='dopamineSkillProgressionV12';
const fresh=()=>({owned:{Slash:1},resonance:{},drops:0,upgrades:0,shards:0,pity:0,unlocks:1,lastDrop:null});
let state=fresh();
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function loadState(){if(progressionTest||progressionSoak||q.has('freshskills'))return;try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.owned){state={...fresh(),...x,owned:{...x.owned},resonance:{...(x.resonance||{})}}}}catch(e){}}
function saveState(){if(progressionTest||progressionSoak)return;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function owned(id){return Number.isFinite(state.owned[id])&&state.owned[id]>0}
function level(id){return owned(id)?clamp(state.owned[id]|0,1,20):0}
function monsterLevel(e){return Math.max(1,(depth|0)+(e?.type==='elite'?1:e?.type==='boss'?3:0))}
function capForMonster(ml){return clamp(1+Math.floor((Math.max(1,ml)-1)/2),1,20)}
function dropLevel(ml,e){let lv=capForMonster(ml);if(e?.type==='elite')lv++;if(e?.type==='boss')lv+=2;if(rng()<.16)lv++;return clamp(lv,1,20)}
function effective(id,lv=level(id)||1){const d=defs[id],b=BASE[id],m=META[id],n=Math.max(0,lv-1);return{
 level:lv,baseDamage:b.baseDamage*(1+m.growth*n),cooldown:b.cooldown*(1-Math.min(.13,n*.0065)),
 area:b.area?b.area*(1+Math.min(.18,n*.009)):undefined,range:b.range?b.range*(1+Math.min(.12,n*.006)):undefined,
 duration:b.duration?b.duration*(1+Math.min(.14,n*.007)):undefined,tickRate:b.tickRate?b.tickRate*(1-Math.min(.11,n*.0058)):undefined,
 projectileSpeed:b.projectileSpeed?b.projectileSpeed*(1+Math.min(.16,n*.008)):undefined,
 critChance:b.critChance?b.critChance+Math.min(.06,n*.003):b.critChance,tags:[...d.tags]
}}
function applyLevel(id){const d=defs[id],s=effective(id);d.baseDamage=+s.baseDamage.toFixed(3);d.cooldown=+s.cooldown.toFixed(3);if(BASE[id].area)d.area=+s.area.toFixed(3);if(BASE[id].range)d.range=+s.range.toFixed(3);if(BASE[id].duration)d.duration=+s.duration.toFixed(3);if(BASE[id].tickRate)d.tickRate=+s.tickRate.toFixed(4);if(BASE[id].projectileSpeed)d.projectileSpeed=+s.projectileSpeed.toFixed(3);if(BASE[id].critChance)d.critChance=+s.critChance.toFixed(4)}
function applyAll(){for(const id of ids)applyLevel(id)}
function nextLocked(ml=Infinity){return ids.filter(id=>!owned(id)&&META[id].unlock<=ml).sort((a,b)=>META[a].unlock-META[b].unlock)[0]||null}
function nextUnlock(){return ids.filter(id=>!owned(id)).sort((a,b)=>META[a].unlock-META[b].unlock)[0]||null}
function cleanLoadout(save=true){let load=Array.isArray(brain.skills)?brain.skills.slice(0,3):[];while(load.length<3)load.push(null);const seen=new Set();load=load.map(id=>{if(!id||!owned(id)||seen.has(id))return null;seen.add(id);return id});if(!load.some(Boolean)&&owned('Slash'))load[0]='Slash';brain.skills=load;brain.name='CUSTOM';brain.custom=true;if(save)saveBrain();return load}
function optionHtml(selected){const opts=['<option value="">— EMPTY —</option>',...ids.filter(owned).map(id=>`<option value="${id}">${defs[id].name} • Lv ${level(id)}</option>`)];return opts.join('')}
function syncBrainOptions(){if(!window.brainInputs)return;cleanLoadout(false);[brainInputs.skill1,brainInputs.skill2,brainInputs.skill3].forEach((el,i)=>{if(!el)return;el.innerHTML=optionHtml();el.value=brain.skills[i]||''})}
function equip(id,slot){slot=clamp(slot|0,0,2);if(id&&!owned(id)){toast(`${defs[id]?.name||id} is still locked`,'#ff9d70');return false}let load=cleanLoadout(false).slice();const from=id?load.indexOf(id):-1,replaced=load[slot];if(from>=0&&from!==slot)load[from]=replaced||null;load[slot]=id||null;brain.skills=load;brain.name='CUSTOM';brain.custom=true;saveBrain();syncBrainOptions();try{writeBrainForm()}catch(e){}renderLab();hud();toast(id?`${defs[id].name} equipped in Priority ${slot+1}`:`Priority ${slot+1} cleared`,'#9fe7ff');return true}
function ensureAutoEquip(id){const load=cleanLoadout(false);const empty=load.findIndex(x=>!x);if(empty>=0)equip(id,empty);else saveBrain()}
function toast(text,color='#ffd477'){try{announce(text.toUpperCase(),color)}catch(e){};const f=document.getElementById('skillDropFeed');if(f){const row=document.createElement('div');row.textContent=text;f.prepend(row);while(f.children.length>4)f.lastChild.remove();setTimeout(()=>row.remove(),5000)}}
function announceDrop(id,oldLv,newLv,kind){const name=defs[id].name;if(kind==='unlock'){toast(`NEW SKILL • ${name} Lv ${newLv}`,'#d7a4ff');ring(P.x,P.y,54,'#d7a4ff',5)}else if(kind==='upgrade'){toast(`${name} upgraded ${oldLv} → ${newLv}`,'#80e9a7');ring(P.x,P.y,42,'#80e9a7',4)}else toast(`${name} resonance +1`,'#8fc5ff')}
function grantDrop(id,lv,ml=1,quiet=false){if(!defs[id]||META[id].unlock>ml)return{accepted:false,reason:'gated'};lv=clamp(lv|0,1,20);state.drops++;state.lastDrop={id,level:lv,monsterLevel:ml};const old=level(id);let kind='resonance',newLv=old;if(!old){state.owned[id]=lv;state.unlocks++;kind='unlock';newLv=lv;applyLevel(id);ensureAutoEquip(id)}else if(lv>old){state.owned[id]=lv;state.upgrades++;kind='upgrade';newLv=lv;state.resonance[id]=0;applyLevel(id)}else{state.resonance[id]=(state.resonance[id]||0)+1;const cap=capForMonster(ml);if(state.resonance[id]>=3&&old<cap){state.owned[id]=old+1;state.resonance[id]=0;state.upgrades++;kind='upgrade';newLv=old+1;applyLevel(id)}else state.shards++}
state.pity=0;saveState();syncBrainOptions();renderLab();if(!quiet)announceDrop(id,old,newLv,kind);return{accepted:true,kind,oldLevel:old,newLevel:newLv}}
function weightedSkill(eligible){let total=0;const rows=eligible.map(id=>{const w=owned(id)?1:4.2;total+=w;return[id,total]});let r=rng()*total;for(const [id,t] of rows)if(r<t)return id;return rows.at(-1)?.[0]}
function maybeDrop(e){if(legacyGate||!e)return;const ml=monsterLevel(e),eligible=ids.filter(id=>META[id].unlock<=ml);if(!eligible.length)return;state.pity++;const locked=nextLocked(ml),boss=e.type==='boss',elite=e.type==='elite';let chance=boss?1:elite?.42:.105+Math.min(.07,ml*.003);if(e.type==='rot')chance*=.72;const guaranteed=!!locked&&state.pity>=5;if(!guaranteed&&rng()>=chance)return;const id=guaranteed?locked:weightedSkill(eligible);grantDrop(id,dropLevel(ml,e),ml,false)}
function resetProgression(){state=fresh();applyAll();cleanLoadout(false);brain.skills=['Slash',null,null];saveBrain();syncBrainOptions();renderLab();hud()}
loadState();applyAll();
if(!legacyGate){cleanLoadout(false);syncBrainOptions();saveBrain()}

const enhanced=Object.freeze({...api,progressionVersion:PVER,isOwned:owned,getLevel:level,unlockDepth:id=>META[id]?.unlock??Infinity,effective:id=>defs[id]?effective(id):null,ownedIds:()=>ids.filter(owned),nextUnlock:()=>{const id=nextUnlock();return id?{id,monsterLevel:META[id].unlock}:null},equip:(id,slot)=>equip(id,slot),loadout:()=>cleanLoadout(false).slice(),progress:()=>JSON.parse(JSON.stringify(state))});
window.DopamineSkills=enhanced;

if(!legacyGate){
 const oldKill=kill;kill=function(e){const wasDead=e?.dead;oldKill(e);if(e&&!wasDead&&e.dead)maybeDrop(e)};
 const oldCast=castSkill;castSkill=function(id,t,forced=false,fromCombo=false){if(id&&!owned(id))return false;return oldCast(id,t,forced,fromCombo)};
 const oldSetPreset=setPreset;setPreset=function(k,write=true){oldSetPreset(k,false);cleanLoadout(false);syncBrainOptions();if(write){writeBrainForm();saveBrain();updateBrainTicker()}};
 const oldRead=readBrainForm;readBrainForm=function(){oldRead();cleanLoadout();syncBrainOptions()};
}

const oldHit=hit;const dots=new Map(),slows=new Map();let whirlStamp=0,whirlStacks=0,dashEmpowered=false;
function nearestOther(e,r){let best=null,bd=r;for(const x of en)if(!x.dead&&x!==e){const d=Math.hypot(x.x-e.x,x.y-e.y);if(d<bd){bd=d;best=x}}return best}
function dotKey(e,id){return `${e.id}:${id}`}
function addDot(e,id,dps,dur){if(!e||e.dead)return;const k=dotKey(e,id),old=dots.get(k);dots.set(k,{e,id,dps:Math.max(dps,old?.dps||0),life:Math.max(dur,old?.life||0),tick:0})}
function slow(e,pct,dur){if(!e||e.dead)return;const k=e.id,cur=slows.get(k);if(!cur){slows.set(k,{e,base:e.spd,life:dur,pct});e.spd*=1-pct}else{cur.life=Math.max(cur.life,dur);cur.pct=Math.max(cur.pct,pct)}}
if(!legacyGate){
 hit=function(e,a,k,crit=false,kb=0){const name=k,id=ids.find(x=>defs[x].name===name||x===name),lv=id?level(id):0;let dealt=a;
   if(name==='Heavy Slash'&&lv>=10&&e&&e.hp/e.max<=.25)dealt*=lv>=20?1.42:1.25;
   if(name==='Vault Strike'&&dashEmpowered&&lv>=5)dealt*=lv>=20?1.52:1.35;
   if(name==='Whirlwind'&&lv>=5){if(roomClock-whirlStamp>.8)whirlStacks=0;whirlStamp=roomClock;whirlStacks=Math.min(lv>=20?7:5,whirlStacks+1);dealt*=1+whirlStacks*(lv>=20?.055:.04)}
   if(name==='Scorch Field'&&lv>=5&&e){const key=dotKey(e,'heat'),h=dots.get(key)?.heat||0,stacks=Math.min(lv>=20?7:5,h+1);dealt*=1+stacks*.045;dots.set(key,{e,id:'heat',life:1.4,tick:99,dps:0,heat:stacks})}
   oldHit(e,dealt,k,crit,kb);
   if(!e||e.dead)return;
   if(name==='Heavy Slash'&&lv>=5){const n=nearestOther(e,lv>=20?82:68);if(n)oldHit(n,dealt*(lv>=20?.46:.33),'Slash Cleave',false,0)}
   if(name==='Firebolt'&&lv>=5){addDot(e,'firebolt',dealt*(lv>=20?.20:.14),2.2);if(lv>=10){const n=nearestOther(e,88);if(n)oldHit(n,dealt*(lv>=20?.48:.34),'Firebolt Ember',false,0)}}
   if(name==='Whirlwind'&&lv>=10)heal(Math.min(7,dealt*.018));
   if(name==='Ground Slam'&&lv>=5){slow(e,lv>=20?.30:.20,1.2);if(lv>=10)oldHit(e,dealt*(lv>=20?.26:.16),'Slam Aftershock',false,0)}
   if(name==='Vault Strike'&&lv>=10)heal(Math.min(14,P.max*.025));
   if(name==='Scorch Field'&&lv>=10)slow(e,lv>=20?.24:.14,.9);
   if(name==='Ember Wisp'&&lv>=5){const n=nearestOther(e,lv>=20?125:105);if(n)oldHit(n,dealt*(lv>=20?.50:.32),'Wisp Chain',false,0)}
 };
 const oldCast2=castSkill;castSkill=function(id,t,forced=false,fromCombo=false){if(id==='Dash'&&t)dashEmpowered=dist(P,t)>105;const ok=oldCast2(id,t,forced,fromCombo);if(id!=='Dash')dashEmpowered=false;else setTimeout(()=>{dashEmpowered=false},0);return ok};
 const oldStep=step;step=function(dt){for(const [k,s] of [...dots]){s.life-=dt;s.tick-=dt;if(s.id==='heat'){if(s.life<=0)dots.delete(k);continue}if(s.e.dead||s.life<=0){dots.delete(k);continue}if(s.tick<=0){s.tick=.35;oldHit(s.e,s.dps*.35,'Burn',false,0)}}for(const [k,s] of [...slows]){s.life-=dt;if(s.e.dead||s.life<=0){if(!s.e.dead)s.e.spd=Math.max(s.e.spd,s.base);slows.delete(k)}}oldStep(dt)};
}

function ensureFeed(){if(document.getElementById('skillDropFeed'))return;const f=document.createElement('div');f.id='skillDropFeed';document.body.appendChild(f);const c=document.createElement('div');c.id='skillProgressChip';document.body.appendChild(c);const st=document.createElement('style');st.textContent=`#skillDropFeed{position:fixed;right:10px;top:54px;z-index:24;width:min(310px,72vw);display:grid;gap:5px;pointer-events:none}#skillDropFeed div{background:#07111eea;border:1px solid #3c5a7a;border-radius:9px;padding:8px 10px;font:800 10px system-ui;box-shadow:0 5px 18px #0008}#skillProgressChip{position:fixed;left:10px;top:54px;z-index:20;background:#07111edb;border:1px solid #35445f;border-radius:999px;padding:6px 9px;font:800 9px system-ui;color:#cfe3ff;pointer-events:none}@media(max-width:520px){#skillDropFeed{top:90px}#skillProgressChip{top:90px;font-size:8px}}`;document.head.appendChild(st)}
function updateChip(){const c=document.getElementById('skillProgressChip');if(!c)return;const n=nextUnlock();c.textContent=n?`SKILLS ${ids.filter(owned).length}/${ids.length} • NEXT ${defs[n].name.toUpperCase()} @ MONSTER LV ${META[n].unlock}`:`SKILLS ${ids.length}/${ids.length} • ARSENAL COMPLETE`}
function renderLab(){const panel=document.getElementById('skillLabPanel');if(!panel||legacyGate)return;const card=panel.querySelector('.g3card');if(!card)return;const n=nextUnlock(),load=cleanLoadout(false);card.innerHTML=`<div class="g3head"><div><h2>SKILL ARSENAL</h2><div class="g3sub">Find skill drops • equip 3 priorities • higher-level monsters can drop higher-level skills</div></div><button id="g3close">CLOSE</button></div><div class="g3progress"><b>${ids.filter(owned).length}/${ids.length} skills discovered</b><span>${n?`Next discovery can appear from monster level ${META[n].unlock}: ${defs[n].name}`:'All current skills discovered'}</span></div><div class="g3loadout">${[0,1,2].map(i=>{const id=load[i];return`<div class="g3slot"><small>PRIORITY ${i+1}</small><b>${id?defs[id].name:'EMPTY'}</b><span>${id?'Lv '+level(id):'Tap an owned skill below'}</span>${id?`<button data-clear="${i}">CLEAR</button>`:''}</div>`}).join('')}</div><div id="g3skills" class="g3grid"></div><div class="g3foot"><b>Progression:</b> normal monsters can drop skills; elites and bosses have much better odds and can roll higher levels. Three same-or-lower duplicates can also raise a skill up to the level supported by the monster level.</div>`;
 const grid=card.querySelector('#g3skills');for(const id of ids){const d=defs[id],is=owned(id),lv=level(id),s=is?effective(id):effective(id,1),slot=load.indexOf(id),div=document.createElement('div');div.className='g3skill '+(is?'owned':'locked');div.innerHTML=`<div class="g3skilltop"><h3>${d.name}</h3><b>${is?`LV ${lv}`:'LOCKED'}</b></div><div class="tags">${d.tags.map(t=>`<span class="g3tag">${t}</span>`).join('')}</div><div class="g3meta">${META[id].role}<br>${is?`Damage ${s.baseDamage.toFixed(0)} • Cooldown ${s.cooldown.toFixed(2)}s`:`Drops from monster level ${META[id].unlock}+`}<br>${META[id].perk}${is?`<br>Resonance ${state.resonance[id]||0}/3`:''}</div>${is?`<div class="g3equip">${[0,1,2].map(i=>`<button data-equip="${id}" data-slot="${i}" class="${slot===i?'selected':''}">${slot===i?'EQUIPPED':'P'+(i+1)}</button>`).join('')}</div>`:'<div class="g3locked">DEFEAT STRONGER MONSTERS TO DISCOVER</div>'}`;grid.appendChild(div)}
 card.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>equip(b.dataset.equip,+b.dataset.slot));card.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>equip(null,+b.dataset.clear));card.querySelector('#g3close').onclick=()=>{panel.style.display='none';pausedForBrain=false;last=performance.now()};updateChip()}
function enhanceLabCss(){const st=document.createElement('style');st.textContent=`.g3progress{display:flex;justify-content:space-between;gap:10px;align-items:center;background:#0a1a27;border:1px solid #28425e;border-radius:11px;padding:9px 10px;margin-bottom:9px;font-size:10px}.g3progress span{opacity:.72;text-align:right}.g3loadout{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:10px}.g3slot{border:1px solid #42587a;background:#0a101b;border-radius:11px;padding:9px;display:grid;gap:3px;min-height:84px}.g3slot small{font-size:8px;opacity:.55}.g3slot b{font-size:12px}.g3slot span{font-size:9px;opacity:.7}.g3slot button{min-height:30px}.g3skill.locked{opacity:.52;filter:saturate(.55)}.g3skilltop{display:flex;justify-content:space-between;gap:8px;align-items:center}.g3skilltop h3{margin:0}.g3skilltop b{font-size:10px}.g3equip button.selected{outline:2px solid #b9e6ff;background:#214a62}.g3locked{font-size:8px;font-weight:900;letter-spacing:.04em;margin-top:9px;padding:8px;border:1px dashed #526070;border-radius:8px;text-align:center}@media(max-width:520px){.g3progress{align-items:flex-start;flex-direction:column}.g3progress span{text-align:left}.g3loadout{grid-template-columns:1fr}.g3slot{min-height:70px}}`;document.head.appendChild(st)}
if(!legacyGate){ensureFeed();enhanceLabCss();renderLab();const labBtn=document.getElementById('skillLabBtn');if(labBtn)labBtn.onclick=()=>{pausedForBrain=true;document.getElementById('skillLabPanel').style.display='block';renderLab()};const oldHud=hud;hud=function(){oldHud();const cards=[skillEls.Slash,skillEls.Whirlwind,skillEls.Slam],load=cleanLoadout(false);cards.forEach((el,i)=>{const id=load[i];if(!id){el.querySelector('.name').textContent='EMPTY PRIORITY';el.querySelector('.cd').textContent='SELECT SKILL';el.classList.remove('ready','flex','waiting')}else el.querySelector('.name').textContent=`${defs[id].name.toUpperCase()} • LV ${level(id)}`});updateChip()};hud()}

window.DopamineSkillProgression={version:PVER,isOwned:owned,level,effective,unlockDepth:id=>META[id]?.unlock??Infinity,loadout:()=>cleanLoadout(false).slice(),progress:()=>JSON.parse(JSON.stringify(state)),equip,grantDrop:(id,lv,ml)=>grantDrop(id,lv,ml),reset:resetProgression,capForMonster};
if(progressionTest||progressionSoak)window.__DOPAMINE_SKILL_TEST={grantDrop,reset:resetProgression,state:()=>state,equip,meta:META,base:BASE};
if(!legacyGate)toast('Skill progression online • Heavy Slash Lv 1','#b7d7ff');
})();
