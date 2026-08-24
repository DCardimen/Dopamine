'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(!q.has('supportfast'))return;
const api=window.DopamineSkills,g4=window.DopamineGoal4,sup=window.DopamineSupports,ui=window.DopamineSupportUI,entry=window.DopamineFriendlySkillEntry;
function finish(rows,obj){active=false;pausedForBrain=true;document.body.innerHTML=`<pre id="__DOPAMINE_SUPPORT_FAST" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:13px/1.5 ui-monospace,monospace">${rows.join('\n')}</pre>`;window.__DOPAMINE_SUPPORT_FAST=obj}
try{
 if(!api||!g4||!sup||!ui||!entry)throw new Error('missing support fast dependencies');
 const sid='FrostLance';g4.debugUnlockAll?.(20);sup.reset?.();sup.resetSocketLayout?.();sup.resetSlots?.();sup.debugSetSlots?.(sid,3);sup.debugUnlockAll?.(1);
 const lab=document.getElementById('skillLabPanel');if(lab)lab.style.display='block';g4.renderLab?.();entry.decorate();
 const card=[...(lab?.querySelectorAll('.g4skill')||[])].find(x=>x.dataset.g6SkillEntry===sid);
 const hasDirectCard=!!card,hiddenLegacy=!card?.querySelector('.g6supportBtn')||getComputedStyle(card.querySelector('.g6supportBtn')).display==='none';
 if(card)card.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
 const directOpened=getComputedStyle(ui.panel()).display==='block'&&ui.selected()===sid,slots=document.querySelectorAll('#g6supportCard .g6slot').length;
 ui.panel().style.display='none';
 g4.renderLab?.();entry.decorate();const refreshed=[...(lab?.querySelectorAll('.g4skill')||[])].find(x=>x.dataset.g6SkillEntry===sid),equipButton=refreshed?.querySelector('button:not(.g6supportBtn)');equipButton?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));const equipNotHijacked=getComputedStyle(ui.panel()).display!=='block';
 const errors=typeof runtimeErrors!=='undefined'?runtimeErrors:[],ok=hasDirectCard&&hiddenLegacy&&directOpened&&slots===10&&equipNotHijacked&&errors.length===0;
 finish([`SUPPORT_FAST_OK=${ok}`,`DIRECT_SKILL_CARD=${hasDirectCard}`,`LEGACY_SUPPORT_BUTTON_HIDDEN=${hiddenLegacy}`,`DIRECT_SKILL_OPENS_SUPPORTS=${directOpened}`,`SUPPORT_SLOT_COUNT=${slots}`,`EQUIP_CONTROL_NOT_HIJACKED=${equipNotHijacked}`,`ERRORS=${errors.join('|')}`],{ok,hasDirectCard,hiddenLegacy,directOpened,slots,equipNotHijacked,errors})
}catch(e){finish(['SUPPORT_FAST_OK=false',`EXCEPTION=${String(e?.stack||e?.message||e).replace(/\n/g,' | ')}`],{ok:false,exception:String(e)})}
})();