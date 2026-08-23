'use strict';
(()=>{
const raw=window.DopamineSupports,skills=window.DopamineSkills;if(!raw||!skills)return;
const q=new URLSearchParams(location.search),QA=['supporttest','supportmobile','supportsoak'].some(k=>q.has(k));
const KEY='dopamineSupportSlotsV11',MAX=10;
const EXPECTED_HIGH_LEVEL=[2,4,8,16,32,64,125,250,500,1000];
const MIN_MONSTER_LEVEL=[1,4,8,12,18,25,32,40,50,60];
const fresh=()=>({schema:11,slots:{},attempts:{},successes:0,lastUnlock:null});
let state=fresh();
if(!QA){try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.schema===11)state={...fresh(),...x,slots:{...(x.slots||{})},attempts:{...(x.attempts||{})}}}catch(e){}}
const save=()=>{if(QA)return;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function unlockedSlots(sid){return clamp(state.slots[sid]|0,0,MAX)}
function attempts(sid){return Math.max(0,state.attempts[sid]|0)}
function monsterFactor(ml){ml=Math.max(1,ml|0);return clamp(Math.pow(ml/60,1.35),.10,1)}
function slotChance(sid,ml,nextSlot=unlockedSlots(sid)+1){nextSlot=clamp(nextSlot|0,1,MAX);if((ml|0)<MIN_MONSTER_LEVEL[nextSlot-1])return 0;return clamp((1/EXPECTED_HIGH_LEVEL[nextSlot-1])*monsterFactor(ml),0,1)}
function unlockToast(sid,slot,ml){const name=skills.get(sid)?.name||sid;try{announce(`SUPPORT SLOT ${slot} UNLOCKED • ${name}`,'#79f2c7')}catch(e){};window.DopamineSupportUI?.slotToast?.(name,slot,ml)}
function recordSkillPickup(sid,ml,roll=null){if(!skills.get(sid))return{accepted:false,reason:'unknown-skill'};const current=unlockedSlots(sid);if(current>=MAX)return{accepted:false,reason:'maxed',slots:MAX,chance:0};state.attempts[sid]=attempts(sid)+1;const next=current+1,chance=slotChance(sid,ml,next),r=roll==null?rng():roll;let unlocked=false;if(chance>0&&r<chance){state.slots[sid]=next;state.successes++;state.lastUnlock={sid,slot:next,monsterLevel:ml,attempt:state.attempts[sid],chance,t:Date.now()};unlocked=true;save();unlockToast(sid,next,ml);window.DopamineSupportUI?.refresh?.(sid)}else save();return{accepted:true,unlocked,slots:unlockedSlots(sid),nextSlot:unlocked?next+1:next,chance,roll:r,attempts:attempts(sid)}}
function nextSlotInfo(sid,ml=60){const unlocked=unlockedSlots(sid);if(unlocked>=MAX)return{unlocked,maxed:true};const slot=unlocked+1;return{unlocked,maxed:false,nextSlot:slot,minMonsterLevel:MIN_MONSTER_LEVEL[slot-1],expectedHighLevelPickups:EXPECTED_HIGH_LEVEL[slot-1],chance:slotChance(sid,ml,slot)}}
const oldEquip=raw.equip.bind(raw);function equip(sid,supid){const cap=unlockedSlots(sid);if(cap<=0)return false;if(raw.equipped(sid).length>=cap&&!raw.equipped(sid).includes(supid))return false;return oldEquip(sid,supid)}
function equipped(sid){return raw.equipped(sid).slice(0,unlockedSlots(sid))}
function debugSetSlots(sid,n){if(!skills.get(sid))return false;state.slots[sid]=clamp(n|0,0,MAX);save();return true}
function debugUnlockAllSlots(n=MAX){for(const sid of skills.ids())state.slots[sid]=clamp(n|0,0,MAX);save();return true}
function resetSlots(){state=fresh();if(!QA)try{localStorage.removeItem(KEY)}catch(e){};return true}
const enhanced=Object.freeze({...raw,version:'Support System v1.2 • Slot Progression',maxPerSkill:MAX,equip,equipped,unlockedSlots,slotChance,nextSlotInfo,slotAttempts:attempts,slotProgress:()=>JSON.parse(JSON.stringify(state)),recordSkillPickup,debugSetSlots,debugUnlockAllSlots,resetSlots,slotCurve:()=>EXPECTED_HIGH_LEVEL.map((expected,i)=>({slot:i+1,expectedHighLevelPickups:expected,minMonsterLevel:MIN_MONSTER_LEVEL[i]}))});
window.DopamineSupports=enhanced;

// Observe actual Goal 03 skill pickups without modifying Goal 03 internals.
if(typeof kill==='function'&&typeof skills.progress==='function'){
 const rawKill=kill;kill=function(e){const before=skills.progress()?.drops||0;rawKill(e);const p=skills.progress?.(),after=p?.drops||0;if(after>before&&p?.lastDrop?.id){recordSkillPickup(p.lastDrop.id,p.lastDrop.monsterLevel||Math.max(1,typeof depth==='number'?depth:1))}}
}
})();
