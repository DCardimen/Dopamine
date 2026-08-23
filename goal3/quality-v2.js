'use strict';
(()=>{
const q=new URLSearchParams(location.search),ui=q.has('goal3loadoutuitest'),soak=q.has('goal3skillsoak');if(!ui&&!soak)return;
function report(id,rows,obj){active=false;pausedForBrain=true;document.body.innerHTML=`<pre id="${id}" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:13px/1.5 ui-monospace,monospace">${rows.join('\n')}</pre>`;window[id]=obj}
if(ui){
 const p=window.DopamineSkillProgression;p.reset();p.grantDrop('Firebolt',2,2);p.grantDrop('Whirlwind',2,4);document.getElementById('skillLabBtn')?.click();
 let fire=[...document.querySelectorAll('.g3skill')].find(x=>x.querySelector('h3')?.textContent==='Firebolt');fire?.querySelector('[data-slot="1"]')?.click();fire=[...document.querySelectorAll('.g3skill')].find(x=>x.querySelector('h3')?.textContent==='Firebolt');
 const clicked=p.loadout()[1]==='Firebolt',selected=!!fire?.querySelector('[data-slot="1"].selected'),threeSlots=document.querySelectorAll('.g3slot').length===3,locked=[...document.querySelectorAll('.g3skill.locked')].length>0,brainOption=[...brainInputs.skill2.options].some(o=>o.value==='Firebolt'),brainSelected=brainInputs.skill2.value==='Firebolt',noDuplicate=new Set(p.loadout().filter(Boolean)).size===p.loadout().filter(Boolean).length;
 const ok=clicked&&selected&&threeSlots&&locked&&brainOption&&brainSelected&&noDuplicate&&runtimeErrors.length===0;
 report('__DOPAMINE_LOADOUT_UI',[`GOAL3_LOADOUT_UI_OK=${ok}`,`DOM_CLICK_EQUIPS=${clicked}`,`SELECTED_HIGHLIGHT=${selected}`,`THREE_PRIORITY_SLOTS=${threeSlots}`,`LOCKED_SKILLS_VISIBLE=${locked}`,`BRAIN_OPTION_SYNC=${brainOption}`,`BRAIN_SELECTED_SYNC=${brainSelected}`,`NO_DUPLICATE_SLOTS=${noDuplicate}`,`ERRORS=${runtimeErrors.join('|')}`],{ok,clicked,selected,threeSlots,locked,brainOption,brainSelected,noDuplicate,errors:runtimeErrors});return;
}
const p=window.DopamineSkillProgression,ids=DopamineSkills.ids(),originalSeed=baseSeed;p.reset();pausedForBrain=false;active=false;
const agg={sim:0,steps:0,rooms:0,wins:0,losses:0,stalls:0,truncatedRooms:0,drops:0,upgrades:0,maxLevel:1,casts:Object.fromEntries(ids.map(id=>[id,0])),seen:new Set(['Slash']),loadouts:new Set(),stallInfo:[]};
let stop=false;
while(!stop&&agg.sim<3600&&agg.steps<155000&&!runtimeErrors.length){
 depth=1+(agg.rooms%30);baseSeed=(originalSeed+Math.imul(agg.rooms+1,7919))>>>0;
 const owned=DopamineSkills.ownedIds(),load=[];for(let j=0;j<Math.min(3,owned.length);j++)load.push(owned[(agg.rooms+j)%owned.length]);while(load.length<3)load.push(null);brain.skills=[null,null,null];load.forEach((id,i)=>{if(id)p.equip(id,i)});agg.loadouts.add(p.loadout().filter(Boolean).join('>'));
 beginRoom();let local=0,endedByClock=false;
 while(active&&local<2600&&!runtimeErrors.length){
   if(agg.sim>=3600){endedByClock=true;break}
   step(.035);local++;agg.steps++;agg.sim+=.035;
 }
 for(const id of ids)agg.casts[id]+=(skillCasts[id]||0);
 const live=en.filter(e=>!e.dead);
 if(endedByClock&&active){agg.truncatedRooms++;active=false;stop=true}
 else if(active&&local>=2600){agg.stalls++;agg.stallInfo.push({room:agg.rooms,depth,seed:baseSeed,clock:+roomClock.toFixed(2),live:live.map(e=>`${e.type}:${Math.ceil(e.hp)}`).slice(0,10),loadout:p.loadout(),decision:lastDecision,player:[+P.x.toFixed(1),+P.y.toFixed(1),Math.ceil(P.hp)]});active=false}
 else if(P.dead)agg.losses++;
 else if(!live.length)agg.wins++;
 else if(!active)agg.losses++;
 const ps=p.progress();agg.drops=ps.drops;agg.upgrades=ps.upgrades;for(const id of ids)if(p.isOwned(id)){agg.seen.add(id);agg.maxLevel=Math.max(agg.maxLevel,p.level(id))}
 agg.rooms++;
}
baseSeed=originalSeed;const allUnlocked=agg.seen.size===ids.length,castCoverage=ids.every(id=>agg.casts[id]>0),progressionDepth=agg.drops>=12&&agg.upgrades>=4&&agg.maxLevel>=8,loadoutCoverage=agg.loadouts.size>=7,noErrors=runtimeErrors.length===0,clockOk=agg.sim>=3599,realStallFree=agg.stalls===0,ok=clockOk&&realStallFree&&allUnlocked&&castCoverage&&progressionDepth&&loadoutCoverage&&noErrors;
report('__DOPAMINE_SKILL_SOAK',[`GOAL3_SKILL_SOAK_OK=${ok}`,`SIM_SECONDS=${agg.sim.toFixed(1)}`,`STEPS=${agg.steps}`,`ROOMS=${agg.rooms}`,`WINS=${agg.wins}`,`LOSSES=${agg.losses}`,`STALLS=${agg.stalls}`,`TRUNCATED_FINAL_ROOMS=${agg.truncatedRooms}`,`ALL_SKILLS_UNLOCKED=${allUnlocked}`,`CAST_COVERAGE=${castCoverage}`,`PROGRESSION_DEPTH=${progressionDepth}`,`LOADOUT_COVERAGE=${loadoutCoverage}`,`DROPS=${agg.drops}`,`UPGRADES=${agg.upgrades}`,`MAX_SKILL_LEVEL=${agg.maxLevel}`,`UNLOCKED=${[...agg.seen].join(',')}`,`CASTS=${ids.map(id=>id+':'+agg.casts[id]).join(',')}`,`STALL_INFO=${JSON.stringify(agg.stallInfo)}`,`ERRORS=${runtimeErrors.join('|')}`],{ok,...agg,seen:[...agg.seen],allUnlocked,castCoverage,progressionDepth,loadoutCoverage,errors:runtimeErrors});
})();
