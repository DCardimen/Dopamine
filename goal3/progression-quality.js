'use strict';
(()=>{
const q=new URLSearchParams(location.search),test=q.has('goal3progressiontest'),soak=q.has('goal3progressionsoak');if(!test&&!soak)return;
function out(lines,key,obj){active=false;pausedForBrain=true;document.body.innerHTML=`<pre id="${key}" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:13px/1.5 ui-monospace,monospace">${lines.join('\n')}</pre>`;window[key]=obj}
function castsSnapshot(){const r={};for(const id of DopamineSkills.ids())r[id]=skillCasts[id]||0;return r}
if(test){
 const h=window.__DOPAMINE_SKILL_TEST,p=window.DopamineSkillProgression;h.reset();
 const starter=p.isOwned('Slash')&&p.level('Slash')===1&&p.loadout()[0]==='Slash';
 const locked=!p.isOwned('Firebolt')&&!p.equip('Firebolt',1);
 const gated=!h.grantDrop('Firebolt',3,1).accepted;
 const unlock=h.grantDrop('Firebolt',2,2).kind==='unlock'&&p.isOwned('Firebolt')&&p.level('Firebolt')===2;
 const equip=p.equip('Firebolt',1)&&p.loadout()[1]==='Firebolt';
 const swap=p.equip('Slash',1)&&p.loadout()[1]==='Slash'&&p.loadout()[0]==='Firebolt';
 const before=p.effective('Firebolt');h.grantDrop('Firebolt',6,12);const after=p.effective('Firebolt');
 const scale=p.level('Firebolt')===6&&after.baseDamage>before.baseDamage&&after.cooldown<before.cooldown;
 h.grantDrop('Whirlwind',4,6);h.grantDrop('Dash',4,6);const owned4=DopamineSkills.ownedIds().length>=4;
 const cap=p.capForMonster(10)===5&&p.capForMonster(40)===20;
 const tags=DopamineSkills.hasTag('Firebolt','Fire')&&DopamineSkills.hasTag('Dash','Movement');
 const api=typeof DopamineSkills.getLevel==='function'&&typeof DopamineSkills.effective==='function'&&typeof DopamineSkills.equip==='function';
 const ui=!!document.getElementById('skillProgressChip')&&!!document.getElementById('skillDropFeed')&&!!document.querySelector('.g3loadout');
 const noErrors=runtimeErrors.length===0,ok=[starter,locked,gated,unlock,equip,swap,scale,owned4,cap,tags,api,ui,noErrors].every(Boolean);
 out([`GOAL3_PROGRESSION_OK=${ok}`,`STARTER_ONLY=${starter}`,`LOCKED_EQUIP_BLOCKED=${locked}`,`MONSTER_LEVEL_GATE=${gated}`,`DROP_UNLOCK=${unlock}`,`LOADOUT_EQUIP=${equip}`,`LOADOUT_SWAP=${swap}`,`LEVEL_SCALING=${scale}`,`OWNED_COLLECTION=${owned4}`,`LEVEL_CAP_CURVE=${cap}`,`TAG_API_PRESERVED=${tags}`,`PROGRESSION_API=${api}`,`PROGRESSION_UI=${ui}`,`ERRORS=${runtimeErrors.join('|')}`],'__DOPAMINE_PROGRESSION_TEST',{ok,starter,locked,gated,unlock,equip,swap,scale,owned4,cap,tags,api,ui,errors:runtimeErrors});
 return;
}
if(soak){
 const h=window.__DOPAMINE_SKILL_TEST,p=window.DopamineSkillProgression,ids=DopamineSkills.ids(),originalSeed=baseSeed;
 h.reset();pausedForBrain=false;active=false;
 const agg={sim:0,steps:0,rooms:0,wins:0,losses:0,stalls:0,drops:0,upgrades:0,maxLevel:1,casts:Object.fromEntries(ids.map(id=>[id,0])),seen:new Set(['Slash']),loadouts:new Set(),stallInfo:[]};
 while(agg.sim<3600&&agg.steps<155000&&!runtimeErrors.length){
   depth=1+(agg.rooms%30);baseSeed=(originalSeed+Math.imul(agg.rooms+1,7919))>>>0;
   const owned=DopamineSkills.ownedIds(),load=[];for(let j=0;j<Math.min(3,owned.length);j++)load.push(owned[(agg.rooms+j)%owned.length]);while(load.length<3)load.push(null);
   brain.skills=[null,null,null];load.forEach((id,i)=>{if(id)p.equip(id,i)});agg.loadouts.add(p.loadout().filter(Boolean).join('>'));
   beginRoom();let local=0;
   while(active&&local<2600&&agg.sim<3600&&!runtimeErrors.length){step(.035);local++;agg.steps++;agg.sim+=.035}
   const cs=castsSnapshot();for(const id of ids)agg.casts[id]+=cs[id]||0;
   const live=en.filter(e=>!e.dead);if(active){agg.stalls++;agg.stallInfo.push({room:agg.rooms,depth,seed:baseSeed,clock:+roomClock.toFixed(2),live:live.map(e=>`${e.type}:${Math.ceil(e.hp)}`).slice(0,8),loadout:p.loadout()});active=false}else if(P.dead)agg.losses++;else if(!live.length)agg.wins++;else agg.losses++;
   const ps=p.progress();agg.drops=ps.drops;agg.upgrades=ps.upgrades;for(const id of ids)if(p.isOwned(id)){agg.seen.add(id);agg.maxLevel=Math.max(agg.maxLevel,p.level(id))}
   agg.rooms++;
 }
 baseSeed=originalSeed;const allUnlocked=agg.seen.size===ids.length,castCoverage=ids.every(id=>agg.casts[id]>0),progressionDepth=agg.drops>=12&&agg.upgrades>=4&&agg.maxLevel>=8,loadoutCoverage=agg.loadouts.size>=7,noErrors=runtimeErrors.length===0,ok=agg.sim>=3599&&agg.stalls===0&&allUnlocked&&castCoverage&&progressionDepth&&loadoutCoverage&&noErrors;
 out([`GOAL3_PROGRESSION_SOAK_OK=${ok}`,`SIM_SECONDS=${agg.sim.toFixed(1)}`,`STEPS=${agg.steps}`,`ROOMS=${agg.rooms}`,`WINS=${agg.wins}`,`LOSSES=${agg.losses}`,`STALLS=${agg.stalls}`,`ALL_SKILLS_UNLOCKED=${allUnlocked}`,`CAST_COVERAGE=${castCoverage}`,`PROGRESSION_DEPTH=${progressionDepth}`,`LOADOUT_COVERAGE=${loadoutCoverage}`,`DROPS=${agg.drops}`,`UPGRADES=${agg.upgrades}`,`MAX_SKILL_LEVEL=${agg.maxLevel}`,`UNLOCKED=${[...agg.seen].join(',')}`,`CASTS=${ids.map(id=>id+':'+agg.casts[id]).join(',')}`,`STALL_INFO=${JSON.stringify(agg.stallInfo)}`,`ERRORS=${runtimeErrors.join('|')}`],'__DOPAMINE_PROGRESSION_SOAK',{ok,...agg,seen:[...agg.seen],allUnlocked,castCoverage,progressionDepth,loadoutCoverage,errors:runtimeErrors});
}
})();
