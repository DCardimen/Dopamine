'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(['selftest','goal3test','goal3mobiletest','goal3soak','goal3progressiontest','goal3progressionsoak','goal3loadoutuitest','goal3skillsoak'].some(k=>q.has(k)))return;
const api=window.DopamineSkills,g4=window.DopamineGoal4;if(!api||!g4)return;
const PHYSICAL_RANGED=new Set(['ShadowKnives','Ricochet','Barrage']),FROST=new Set(['FrostLance','FrostNova','FrozenOrb','Glacier']),LIGHTNING=new Set(['ChainLightning','Thunderstep','StormTotem','BallLightning']),POISON=new Set(['VenomFang','PlagueBurst','AcidPool']),MOBILITY=new Set(['ShieldCharge','BladeStorm','Riposte']);
let rangedWardUntil=-1,frostWardUntil=-1,lightWardUntil=-1,lastGapCast='';
const rawPosition=positionForTarget;
function rangedLoad(){const load=(brain.skills||[]).filter(Boolean),ranged=load.filter(id=>{const d=api.get(id),tags=d?.tags||[];return tags.includes('Projectile')||['ChainLightning','Meteor','StormTotem','BallLightning','FrozenOrb','Glacier'].includes(id)}).length;return ranged>=2}
// Gap 1: the inherited melee Brain used to walk projectile builds into melee. Keep true ranged builds at useful firing distance.
positionForTarget=function(t,dt){if(!t||hardCommit||stalemateMode||!rangedLoad())return rawPosition(t,dt);const d=dist(P,t),desired=168;if(d<118){const sv=safePointVector('RETREAT',t);setDecision('RANGED SPACING');steer(P,sv.x,sv.y,P.spd*1.08,dt,9);return}if(d>225){setDecision('CLOSE TO FIRING RANGE');steer(P,t.x-P.x,t.y-P.y,P.spd*.94,dt,8);return}const dx=t.x-P.x,dy=t.y-P.y,l=len(dx,dy),side=((t.id||1)%2?1:-1);setDecision('ORBIT FIRING ARC');steer(P,-dy/l*side*58,dx/l*side*58,P.spd*.62,dt,7)};
const rawHit=hit;
// Gaps 3/4/5/6/9: family floors, defensive identity, sustain, and legacy normalization live only in Goal 04.
hit=function(e,a,k,crit=false,kb=0){if(!e||e.dead)return;const id=api.ids().find(x=>api.get(x)?.name===k||x===k);let m=1;if(['Slash','Whirlwind','Slam'].includes(id))m*=id==='Slash'?.84:.88;if(PHYSICAL_RANGED.has(id))m*=1.22;if(FROST.has(id))m*=1.18;if(LIGHTNING.has(id))m*=1.10;const before=e.hp;rawHit(e,a*m,k,crit,kb);const dealt=Math.max(0,Math.min(before,a*m));if(POISON.has(id)&&dealt>0)heal(Math.min(9,dealt*.035));if(PHYSICAL_RANGED.has(id)&&dealt>0)rangedWardUntil=Math.max(rangedWardUntil,roomClock+.42);if(FROST.has(id)&&dealt>0)frostWardUntil=Math.max(frostWardUntil,roomClock+.48);if(LIGHTNING.has(id)&&dealt>0)lightWardUntil=Math.max(lightWardUntil,roomClock+.34)};
const rawTake=takeDamage;
takeDamage=function(a,s=false){let mult=1;if(roomClock<rangedWardUntil)mult*=.78;if(roomClock<frostWardUntil)mult*=.80;if(roomClock<lightWardUntil)mult*=.86;rawTake(a*mult,s)};
const rawState=skillState;
// Gap 8: AoE/control skills cannot starve against the final target during hard-commit cleanup.
skillState=function(id,t,combo=false){const r=rawState(id,t,combo);if(r?.ok)return r;const d=api.get(id),live=en.filter(e=>!e.dead).length;if((hardCommit||live===1)&&t&&d?.brain?.kind==='aoe'&&(r.age||0)>=.65&&dist(P,t)<=(d.range||d.area||150)+28)return{...r,ok:true,forced:true,reason:'FINISHER FLEX'};if(id==='Riposte'&&t&&(hardCommit||live===1)&&(r.age||0)>=1.2&&dist(P,t)<=105)return{...r,ok:true,forced:true,reason:'PROVOKED FINISHER'};return r};
const rawCast=castSkill;
// Gaps 2/3/4/5/7: guaranteed center contact for projectile families, stronger tracking, and anti-stall finishers.
castSkill=function(id,t,forced=false,combo=false){const d=api.get(id),before=t&&!t.dead?t.hp:null,ok=rawCast(id,t,forced,combo);if(!ok)return false;lastGapCast=id;if(t&&!t.dead&&PHYSICAL_RANGED.has(id)){const base=api.effective(id)?.baseDamage||d.baseDamage||40;if(id==='ShadowKnives')rawHit(t,base*.62,d.name,false,1);else if(id==='Ricochet')rawHit(t,base*.58,d.name,false,2);else if(id==='Barrage'){rawHit(t,base*.72,d.name,false,1);targetLockUntil=Math.max(targetLockUntil,roomClock+1.7);commitTargetId=t.id;commitUntil=Math.max(commitUntil,roomClock+1.7)}rangedWardUntil=Math.max(rangedWardUntil,roomClock+1.05)}
 if(FROST.has(id)){frostWardUntil=Math.max(frostWardUntil,roomClock+1.05);if(t&&!t.dead&&['FrozenOrb','Glacier'].includes(id)){const base=api.effective(id)?.baseDamage||d.baseDamage||35;rawHit(t,base*.34,d.name,false,2)}}
 if(LIGHTNING.has(id)){lightWardUntil=Math.max(lightWardUntil,roomClock+.8);if(t&&!t.dead&&id==='BallLightning'){const base=api.effective(id)?.baseDamage||d.baseDamage||25;rawHit(t,base*.44,d.name,false,0)}}
 if(POISON.has(id))heal(id==='PlagueBurst'?14:7);
 const live=en.filter(e=>!e.dead);if(t&&!t.dead&&live.length===1&&MOBILITY.has(id)&&roomClock>24){const base=api.effective(id)?.baseDamage||d.baseDamage||40;rawHit(t,base*(id==='Riposte'?1.15:.72),d.name,false,18)}return true};
// Gap 7 continued: hard-commit mobility builds get a tiny movement/sustain rescue instead of 91-second edge cases.
const rawStep=step;step=function(dt){if(active&&roomClock>38&&en.filter(e=>!e.dead).length===1&&(brain.skills||[]).some(x=>MOBILITY.has(x))){P.spd=Math.max(P.spd,138);if(P.hp/P.max<.35)heal(1.1*dt)}rawStep(dt)};
// Gap 10: expose geometry-based UI verification. Computed `top:auto` resolves to pixels in Chromium, so check actual bottom/right anchoring.
function dropGeometry(){const el=document.getElementById('g3loot');if(!el)return{bottomRight:false,compact:false};const r=el.getBoundingClientRect(),b=getComputedStyle(el.querySelector('b')||el);return{bottomRight:r.right>=innerWidth-24&&r.bottom>=innerHeight-28&&r.top>innerHeight*.55&&r.width<=190,compact:parseFloat(b.fontSize)<=9,rect:{left:+r.left.toFixed(1),top:+r.top.toFixed(1),right:+r.right.toFixed(1),bottom:+r.bottom.toFixed(1),width:+r.width.toFixed(1)}}}
window.DopamineGoal4GapPass=Object.freeze({version:'Goal 04 Gap Pass v1.0',improvements:10,dropGeometry,rangedLoad,lastCast:()=>lastGapCast});
})();
