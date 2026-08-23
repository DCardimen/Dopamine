'use strict';
(()=>{
const api=window.DopamineSkills;if(!api||typeof skillState!=='function'||typeof castSkill!=='function'||typeof beginRoom!=='function')return;
let fresh=new Set(api.ids());
const rawBegin=beginRoom;beginRoom=function(){fresh=new Set(api.ids());return rawBegin()};
const rawState=skillState;skillState=function(sid,t,combo=false){const s=rawState(sid,t,combo);if(fresh.has(sid)&&String(s?.reason||'').startsWith('SUPPORT CD'))return{...s,ok:true,reason:'ROOM READY'};return s};
const rawCast=castSkill;castSkill=function(sid,t,forced=false,combo=false){const ok=rawCast(sid,t,forced,combo);if(ok)fresh.delete(sid);return ok};
window.DopamineSupportRoomReset=Object.freeze({version:'Support Room Rollover Guard v1.0',isFresh:sid=>fresh.has(sid)});
})();
