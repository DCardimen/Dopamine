'use strict';
(()=>{
const raw=window.DopamineSupports,skills=window.DopamineSkills,cat=window.DopamineSupportCatalog;if(!raw||!skills||!cat)return;
const q=new URLSearchParams(location.search),QA=['supporttest','supportmobile','supportsoak','supportmatrix','supportsocktest'].some(k=>q.has(k));
const KEY='dopamineSupportSocketLayoutV2',MAX=10;
const fresh=()=>({schema:2,layout:{}});let state=fresh();
if(!QA){try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.schema===2)state={...fresh(),...x,layout:{...(x.layout||{})}}}catch(e){}}
const save=()=>{if(QA)return;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const empty=()=>Array(MAX).fill(null);
function actual(sid){return raw.equipped(sid)}
function sync(sid){
 const cap=typeof raw.unlockedSlots==='function'?raw.unlockedSlots(sid):MAX,eq=actual(sid),valid=new Set(eq);
 let a=Array.isArray(state.layout[sid])?state.layout[sid].slice(0,MAX):empty();while(a.length<MAX)a.push(null);
 const seen=new Set();
 for(let i=0;i<MAX;i++){
   const id=a[i];
   if(i>=cap||!id||!valid.has(id)||seen.has(id))a[i]=null;
   else seen.add(id);
 }
 for(const id of eq)if(!seen.has(id)){
   const i=a.findIndex((x,n)=>n<cap&&!x);
   if(i>=0){a[i]=id;seen.add(id)}
 }
 state.layout[sid]=a;save();return a
}
function sockets(sid){return sync(sid).slice()}
function supportAt(sid,slot){slot=slot|0;return slot>=0&&slot<MAX?sockets(sid)[slot]:null}
function allocations(supid,exceptSid=null){
 const out=[];
 for(const sid of skills.ids()){
   if(sid===exceptSid)continue;
   const a=sockets(sid);
   for(let i=0;i<a.length;i++)if(a[i]===supid)out.push({sid,slot:i,name:skills.get(sid)?.name||sid});
 }
 return out
}
function clearLayoutId(sid,id){const a=sockets(sid);for(let i=0;i<a.length;i++)if(a[i]===id)a[i]=null;state.layout[sid]=a}
function clearSocket(sid,slot){
 slot=slot|0;const a=sockets(sid),id=a[slot];if(!id)return true;
 raw.unequip(sid,id);a[slot]=null;state.layout[sid]=a;save();window.DopamineSupportUI?.refresh?.(sid);return true
}
function assignSocket(sid,slot,supid){
 slot=slot|0;
 if(!skills.isOwned(sid)||slot<0||slot>=MAX||slot>=(typeof raw.unlockedSlots==='function'?raw.unlockedSlots(sid):MAX))return{ok:false,reason:'locked-slot'};
 if(!cat.get(supid)||!raw.owned(supid)||!raw.compatible(sid,supid))return{ok:false,reason:'unavailable-support'};
 let a=sockets(sid),replaced=a[slot]||null,movedFrom=null;
 if(replaced===supid)return{ok:true,unchanged:true,sid,slot,supid};
 const sameSlot=a.findIndex((id,i)=>id===supid&&i!==slot);
 if(replaced){raw.unequip(sid,replaced);a[slot]=null}
 if(sameSlot>=0){
   a[sameSlot]=null;a[slot]=supid;state.layout[sid]=a;save();window.DopamineSupportUI?.refresh?.(sid);
   return{ok:true,sid,slot,supid,replaced,movedFrom:{sid,slot:sameSlot,name:skills.get(sid)?.name||sid}}
 }
 const group=cat.get(supid)?.group;
 if(group){
   for(const old of actual(sid).slice())if(old!==supid&&cat.get(old)?.group===group){raw.unequip(sid,old);clearLayoutId(sid,old)}
   a=sockets(sid);
 }
 if(raw.availableCopies(supid,sid)<=0){
   const donors=allocations(supid,sid);
   if(!donors.length){
     if(replaced){raw.equip(sid,replaced);a=sockets(sid);if(!a.includes(replaced))a[slot]=replaced;state.layout[sid]=a;save()}
     return{ok:false,reason:'no-copy'};
   }
   const donor=donors[0];raw.unequip(donor.sid,supid);clearLayoutId(donor.sid,supid);movedFrom=donor;
 }
 const ok=raw.equip(sid,supid);
 if(!ok){
   if(movedFrom){raw.equip(movedFrom.sid,supid);let d=sockets(movedFrom.sid);d[movedFrom.slot]=supid;state.layout[movedFrom.sid]=d}
   if(replaced){raw.equip(sid,replaced);a=sockets(sid);a[slot]=replaced;state.layout[sid]=a}
   save();return{ok:false,reason:'equip-failed'};
 }
 a=sockets(sid);
 for(let i=0;i<a.length;i++)if(a[i]===supid)a[i]=null;
 a[slot]=supid;state.layout[sid]=a;save();
 window.DopamineSupportUI?.refresh?.(sid);
 return{ok:true,sid,slot,supid,replaced,movedFrom}
}
function equip(sid,supid){
 const cap=typeof raw.unlockedSlots==='function'?raw.unlockedSlots(sid):MAX,a=sockets(sid);
 const existing=a.indexOf(supid);if(existing>=0)return true;
 const slot=a.findIndex((x,i)=>i<cap&&!x);if(slot<0)return false;
 return !!assignSocket(sid,slot,supid).ok
}
function unequip(sid,supid){
 const a=sockets(sid),slot=a.indexOf(supid);if(slot>=0)return clearSocket(sid,slot);
 return raw.unequip(sid,supid)
}
function reset(){const r=raw.reset();state=fresh();if(!QA)try{localStorage.removeItem(KEY)}catch(e){};return r}
function resetSocketLayout(){state=fresh();if(!QA)try{localStorage.removeItem(KEY)}catch(e){};return true}
function debugSetSocket(sid,slot,supid=null){if(!skills.get(sid)||slot<0||slot>=MAX)return false;let a=sockets(sid);a[slot]=supid;state.layout[sid]=a;save();return true}
const enhanced=Object.freeze({...raw,version:'Support System v1.3 • Direct Socket UX',equip,unequip,equipped:sid=>sockets(sid).filter(Boolean),reset,sockets,supportAt,assignSocket,clearSocket,allocations,resetSocketLayout,debugSetSocket});
window.DopamineSupports=enhanced;
})();