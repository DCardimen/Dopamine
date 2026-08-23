'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(!q.has('supporttest'))return;
const cat=window.DopamineSupportCatalog,prior=window.__DOPAMINE_SUPPORT_TEST;if(!cat||!prior)return;
const keys=['mods','repeat','conversion','pattern','onKill','splash','chain','pierce','ignoreLos','pull','knockback','dot','execute','selfDamage','leech','healOnCast','needBonus'];
const ids=cat.ids(),effectless=ids.filter(id=>{const s=cat.get(id);return !keys.some(k=>s[k]!==undefined&&s[k]!==false&&s[k]!==0)}),cats=[...new Set(ids.map(id=>cat.get(id).category))];
const meaningful=effectless.length===0,catalog=ids.length===60&&new Set(ids).size===60&&new Set(ids.map(id=>cat.get(id).name)).size===60&&cats.length>=6&&meaningful;
const ok=catalog&&prior.coverage&&prior.slotProgression&&prior.slotCap&&prior.copyAllocation&&prior.cooldownChanged&&prior.coldApplied&&prior.repeatWorked&&prior.roomRolloverReady&&prior.stageDrop&&prior.ui&&!(prior.errors||[]).length;
document.body.innerHTML=`<pre id="__DOPAMINE_SUPPORT_FINAL_CORE" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:13px/1.5 ui-monospace,monospace">SUPPORT_FINAL_CORE_OK=${ok}\nCATALOG_COUNT=${ids.length}\nCATEGORY_COUNT=${cats.length}\nCATEGORY_LIST=${cats.join('|')}\nMEANINGFUL_EFFECTS=${meaningful}\nEFFECTLESS=${effectless.join('|')}\nMIN_COMPATIBLE_PER_SKILL=${prior.minCompatible}\nSLOT_PROGRESSION=${prior.slotProgression}\nSLOTS_START_ZERO=${prior.startsZero}\nSLOT_CURVE_ESCALATES=${prior.curveEscalates}\nSLOT10_LONG_CHASE=${prior.slot10LongChase}\nHIGHER_MONSTER_BETTER=${prior.higherMonsterBetter}\nPICKUP_UNLOCKS_SLOT=${prior.pickupUnlocksSlot}\nTEN_SLOT_CAP=${prior.slotCap}\nELEVENTH_REJECTED=${prior.slotCap}\nCOPY_ALLOCATION=${prior.copyAllocation}\nCOOLDOWN_CHANGED=${prior.cooldownChanged}\nCONVERSION_COLD_APPLIED=${prior.coldApplied}\nECHO_REPEAT_CAST=${prior.repeatWorked}\nROOM_ROLLOVER_READY=${prior.roomRolloverReady}\nBOSS_STAGE_DROPS=${prior.stageDrop?2:0}\nSUPPORT_UI=${prior.ui}\nERRORS=${(prior.errors||[]).join('|')}</pre>`;
window.__DOPAMINE_SUPPORT_FINAL_CORE={ok,catalog,meaningful,effectless,cats,prior};
})();
