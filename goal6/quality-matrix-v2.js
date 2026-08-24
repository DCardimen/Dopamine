'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(!q.has('supportmatrix'))return;
const api=window.DopamineSkills,g4=window.DopamineGoal4,p=window.DopamineSkillProgression,sup=window.DopamineSupports,cat=window.DopamineSupportCatalog;if(!api||!g4||!p||!sup||!cat)return;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function finish(rows,obj){active=false;pausedForBrain=true;document.body.innerHTML=`<pre id="__DOPAMINE_SUPPORT_MATRIX" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:12px/1.5 ui-monospace,monospace">${rows.join('\n')}</pre>`;window.__DOPAMINE_SUPPORT_MATRIX=obj}
function unlockSkills(){p.reset();for(const id of ['Firebolt','Whirlwind','Dash','Slam','Scorch','Wisp'])p.grantDrop(id,20,60);g4.debugUnlockAll(20)}
function controlled(far=false,count=4){
 en=[];projectiles=[];P.x=W*.45;P.y=H*.52;P.vx=P.vy=0;P.hp=P.max;P.dead=false;active=true;
 const main=spawn('guard',clamp(P.x+(far?210:64),45,W-45),P.y);main.hp=main.max=100000;main.dmg=0;main.spd=main.baseSpd=0;main.vx=main.vy=0;
 const others=[];
 for(let i=0;i<count;i++){const e=spawn('guard',clamp(main.x+32+i*18,35,W-35),clamp(main.y+(i%2?22:-22),40,H-40));e.hp=e.max=100000;e.dmg=0;e.spd=e.baseSpd=0;e.vx=e.vy=0;others.push(e)}
 return{main,others}
}
function clearSkill(sid){for(const id of sup.equipped(sid).slice())sup.unequip(sid,id)}
function previewChanged(def,b,a){
 if(!def.mods)return true;let ok=true;
 if(def.mods.damage!=null&&def.mods.damage!==1)ok=ok&&Math.abs(a.damageMult-clamp(def.mods.damage,.25,4))<.015;
 if(def.mods.cooldown!=null&&def.mods.cooldown!==1)ok=ok&&Math.abs(a.cooldownMult-clamp(def.mods.cooldown,.35,2.4))<.015;
 if(def.mods.range!=null&&def.mods.range!==1)ok=ok&&Math.abs(a.rangeMult-clamp(def.mods.range,.65,1.8))<.015;
 return ok
}
function semanticCheck(supid){
 const def=cat.get(supid),sid=api.ids().find(x=>sup.compatible(x,supid));if(!sid)return{ok:false,why:'no-compatible-skill'};
 sup.reset();sup.resetSocketLayout?.();sup.debugUnlockAll(2);sup.debugSetSlots(sid,10);clearSkill(sid);
 beginRoom();brain.skills=[];const base=sup.preview(sid),assigned=sup.assignSocket(sid,0,supid);if(!assigned?.ok)return{ok:false,why:'assign'};
 let world=controlled(false,5),{main,others}=world,source=api.get(sid).name,after=sup.preview(sid),checks=[];
 if(def.mods&&Object.values(def.mods).some(v=>v!==1))checks.push(['mods',previewChanged(def,base,after)]);
 let casts=1;
 if(def.repeat?.every)casts=def.repeat.every;
 P.hp=P.max*.55;const hpBeforeCast=P.hp;let castOK=true;
 for(let i=0;i<casts;i++)castOK=castSkill(sid,main,true,false)&&castOK;
 const afterCast=sup.preview(sid);
 checks.push(['cast',castOK]);
 if(def.repeat)checks.push(['repeat',afterCast.repeatQueue>0]);
 if(def.selfDamage)checks.push(['selfDamage',P.hp<hpBeforeCast]);
 if(def.healOnCast)checks.push(['healOnCast',P.hp>hpBeforeCast]);
 if(def.conversion){
   const t=afterCast.activeType,allowed=def.conversion==='Cycle'?['Fire','Cold','Lightning']:def.conversion==='Random'?['Fire','Cold','Lightning','Chaos','Physical']:[def.conversion];
   checks.push(['conversionType',allowed.includes(t)]);
 }
 sup.reset();sup.debugUnlockAll(2);sup.debugSetSlots(sid,10);sup.assignSocket(sid,0,supid);beginRoom();brain.skills=[];world=controlled(def.pattern==='farshot',5);main=world.main;others=world.others;source=api.get(sid).name;
 const beforeOthers=others.map(e=>e.hp),beforeDist=others.map(e=>Math.hypot(e.x-main.x,e.y-main.y));P.hp=P.max*.5;
 if(def.execute){main.max=1000;main.hp=Math.max(1,def.execute.threshold*400);const bh=main.hp;hit(main,50,source,false,0);checks.push(['execute',bh-main.hp>50])}
 else {hit(main,50,source,false,0)}
 if(def.splash||def.chain||def.pierce)checks.push(['secondaryHit',others.some((e,i)=>e.hp<beforeOthers[i])]);
 if(def.pull)checks.push(['pull',others.some((e,i)=>Math.hypot(e.x-main.x,e.y-main.y)<beforeDist[i]-.1)]);
 if(def.knockback)checks.push(['knockback',Math.hypot(main.vx||0,main.vy||0)>0]);
 if(def.dot)checks.push(['dot',sup.preview(sid).dotQueue>0]);
 if(def.leech)checks.push(['leech',P.hp>P.max*.5]);
 if(def.onKill){
   sup.reset();sup.debugUnlockAll(2);sup.debugSetSlots(sid,10);sup.assignSocket(sid,0,supid);beginRoom();brain.skills=[];world=controlled(false,4);main=world.main;others=world.others;source=api.get(sid).name;main.hp=5;main.max=100;const ob=others.map(e=>e.hp);castSkill(sid,main,true,false);hit(main,100,source,false,0);
   if(def.onKill==='burst')checks.push(['onKillBurst',others.some((e,i)=>e.hp<ob[i])]);
   else if(def.onKill==='epidemic')checks.push(['onKillEpidemic',sup.preview(sid).dotQueue>0]);
   else if(def.onKill==='reset'){const t=others.find(e=>!e.dead);const st=skillState(sid,t,false);checks.push(['onKillReset',String(st?.reason||'')==='SUPPORT RESET'||st?.ok===true])}
 }
 if(def.pattern){
   sup.reset();sup.debugUnlockAll(2);sup.debugSetSlots(sid,10);sup.assignSocket(sid,0,supid);beginRoom();brain.skills=[];world=controlled(def.pattern==='farshot',def.pattern==='duelist'?0:4);main=world.main;source=api.get(sid).name;
   if(def.pattern==='crescendo')for(let i=0;i<5;i++)castSkill(sid,main,true,false);
   if(def.pattern==='ruthless')for(let i=0;i<3;i++)castSkill(sid,main,true,false);
   if(def.pattern==='staccato')castSkill(sid,main,true,false);
   const bh=main.hp;hit(main,50,source,false,0),dealt=bh-main.hp;
   if(['pointblank','farshot','crescendo','ruthless','duelist','staccato'].includes(def.pattern))checks.push(['pattern',Math.abs(dealt-50)>1]);
 }
 if(def.conversion){
   const pr=sup.preview(sid),t=pr.activeType;world=controlled(false,3);main=world.main;source=api.get(sid).name;hit(main,50,source,false,0);
   let ok=true;if(String(t).includes('Fire')||String(t).includes('Chaos'))ok=ok&&sup.preview(sid).dotQueue>0;if(String(t).includes('Cold'))ok=ok&&(main.g6SlowUntil||0)>=roomClock;if(String(t).includes('Lightning'))ok=ok&&(main.g6ShockUntil||0)>=roomClock;if(t==='Physical')ok=ok&&Math.hypot(main.vx||0,main.vy||0)>0;checks.push(['conversionEffect',ok])
 }
 const applicable=checks.filter(x=>x[0]!=='cast'),ok=checks.every(x=>x[1])&&applicable.length>0;
 return{ok,why:checks.filter(x=>!x[1]).map(x=>x[0]).join('|'),sid,checks}
}
try{
 unlockSkills();sup.resetSlots?.();sup.debugUnlockAllSlots?.(10);
 const skills=api.ids(),supports=cat.ids(),pairFailures=[],pairBySkill={},supportPairCount=Object.fromEntries(supports.map(id=>[id,0]));let pairs=0;
 for(const sid of skills){
   let good=0,total=0;sup.debugSetSlots(sid,10);
   for(const supid of supports){
     if(!sup.compatible(sid,supid))continue;total++;pairs++;supportPairCount[supid]++;
     sup.reset();sup.resetSocketLayout?.();sup.debugUnlockAll(1);sup.debugSetSlots(sid,10);
     beginRoom();brain.skills=[];const w=controlled(false,3),beforeErr=(typeof runtimeErrors!=='undefined'?runtimeErrors.length:0),assigned=sup.assignSocket(sid,0,supid),pre=sup.preview(sid),casted=assigned?.ok&&castSkill(sid,w.main,true,false),queued=pre.repeatQueue;
     for(let i=0;i<50;i++)step(.035);
     const newErr=(typeof runtimeErrors!=='undefined'?runtimeErrors.length:0)>beforeErr,exact=sup.supportAt(sid,0)===supid&&sup.equipped(sid).includes(supid),modsOK=previewChanged(cat.get(supid),{},pre);
     if(assigned?.ok&&casted&&exact&&modsOK&&!newErr)good++;else if(pairFailures.length<50)pairFailures.push(`${sid}+${supid}:${!assigned?.ok?'assign':!casted?'cast':!exact?'socket':!modsOK?'mods':'runtime'}`);
   }
   pairBySkill[sid]=`${good}/${total}`;
 }
 const semantics={},semanticFailures=[];
 for(const supid of supports){const r=semanticCheck(supid);semantics[supid]=r.ok;if(!r.ok)semanticFailures.push(`${supid}@${r.sid||'?'}:${r.why}`)}
 const errs=typeof runtimeErrors!=='undefined'?runtimeErrors:[],allPairs=pairFailures.length===0&&skills.every(s=>pairBySkill[s].split('/')[0]===pairBySkill[s].split('/')[1]),allSupports=supports.every(id=>supportPairCount[id]>0&&semantics[id]),allSkills=skills.length===30,ok=allPairs&&allSupports&&allSkills&&errs.length===0;
 finish([`SUPPORT_MATRIX_OK=${ok}`,`ACTIVE_SKILLS=${skills.length}`,`SUPPORTS=${supports.length}`,`COMPATIBLE_PAIRS_TESTED=${pairs}`,`ALL_COMPATIBLE_PAIRS_CAST=${allPairs}`,`ALL_SUPPORTS_SEMANTICALLY_EXERCISED=${allSupports}`,`SEMANTIC_FAILURES=${semanticFailures.join(',')}`,`PAIR_FAILURES=${pairFailures.join(',')}`,`PAIR_BY_SKILL=${Object.entries(pairBySkill).map(([k,v])=>k+':'+v).join(',')}`,`ERRORS=${errs.join('|')}`],{ok,skills:sills,supports:supports.length,pairs,allPairs,allSupports,semanticFailures,pairFailures,pairBySkill,semantics,errors:errs});
}catch(e){finish(['SUPPORT_MATRIX_OK=false',`EXCEPTION=${String(e?.stack||e?.message||e).replace(/\n/g,' | ')}`],{ok:false,exception:String(e)})}
})();