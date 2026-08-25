'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(!q.has('supportfast'))return;
const api=window.DopamineSkills,g4=window.DopamineGoal4,sup=window.DopamineSupports,ui=window.DopamineSupportUI,entry=window.DopamineFriendlySkillEntry,ux=window.DopamineFriendlyUX;
function finish(rows,obj){active=false;pausedForBrain=true;document.body.innerHTML=`<pre id="__DOPAMINE_SUPPORT_FAST" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:13px/1.5 ui-monospace,monospace">${rows.join('\n')}</pre>`;window.__DOPAMINE_SUPPORT_FAST=obj}
try{
 if(!api||!g4||!sup||!ui||!entry||!ux)throw new Error('missing support fast dependencies');
 const sid='FrostLance',sid2='ChainLightning',sid3='Meteor';
 g4.debugUnlockAll?.(20);sup.reset?.();sup.resetSocketLayout?.();sup.resetSlots?.();sup.debugSetSlots?.(sid,3);sup.debugSetSlots?.(sid2,3);sup.debugSetSlots?.(sid3,3);sup.debugUnlockAll?.(1);
 api.equip?.(sid,0);api.equip?.(sid2,1);api.equip?.(sid3,2);
 const lab=document.getElementById('skillLabPanel');if(lab)lab.style.display='block';g4.renderLab?.();entry.decorate();ux.decorateNow();
 const active=ux.activeIds(),firstCards=[...lab.querySelectorAll('.g4grid .g4skill[data-g6-skill-entry]')].slice(0,active.length).map(x=>x.dataset.g6SkillEntry),activeFirst=active.length===3&&active.every((id,i)=>firstCards[i]===id);
 const loadCards=[...lab.querySelectorAll('.g4load .g4slot[data-g6-skill-entry]')],loadoutSupportCounts=loadCards.length===3&&loadCards.every(x=>!!x.querySelector('.g6loadSupportCount'));
 const loadCard=loadCards.find(x=>x.dataset.g6SkillEntry===sid);loadCard?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));const loadoutCardOpens=getComputedStyle(ui.panel()).display==='block'&&ui.selected()===sid;
 ui.panel().style.display='none';g4.renderLab?.();entry.decorate();ux.decorateNow();
 const card=[...lab.querySelectorAll('.g4skill')].find(x=>x.dataset.g6SkillEntry===sid),hasDirectCard=!!card,hiddenLegacy=!card?.querySelector('.g6supportBtn')||getComputedStyle(card.querySelector('.g6supportBtn')).display==='none';
 card?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));ux.decorateNow();
 const directOpened=getComputedStyle(ui.panel()).display==='block'&&ui.selected()===sid,slots=document.querySelectorAll('#g6supportCard .g6slot').length,quickActions=!!document.getElementById('g6addNext')&&!!document.getElementById('g6autoFill'),navButtons=document.querySelectorAll('#g6supportCard .g6navbtn').length===2;
 document.getElementById('g6addNext')?.click();ux.decorateNow();const addNextOpens=ui.pickerSlot?.()===0&&getComputedStyle(ui.picker()).display!=='none',recommended=document.querySelectorAll('.g6recommend [data-g6-rec]').length===3;
 ui.closePicker?.();ui.render?.(sid);ux.decorateNow();document.getElementById('g6autoFill')?.click();const autoFilled=sup.equipped(sid).length===3&&[0,1,2].every(i=>!!sup.supportAt(sid,i));
 ui.open(sid);ux.decorateNow();const nav=[...document.querySelectorAll('#g6supportCard .g6navbtn')];nav[1]?.click();const nextActive=ui.selected()===sid2;
 ui.panel().style.display='none';g4.renderLab?.();entry.decorate();ux.decorateNow();const refreshed=[...lab.querySelectorAll('.g4skill')].find(x=>x.dataset.g6SkillEntry===sid),equipButton=refreshed?.querySelector('button:not(.g6supportBtn)');equipButton?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));const equipNotHijacked=getComputedStyle(ui.panel()).display!=='block';
 const errors=typeof runtimeErrors!=='undefined'?runtimeErrors:[],ok=hasDirectCard&&hiddenLegacy&&directOpened&&slots===10&&equipNotHijacked&&activeFirst&&loadoutSupportCounts&&loadoutCardOpens&&quickActions&&addNextOpens&&recommended&&autoFilled&&navButtons&&nextActive&&errors.length===0;
 finish([`SUPPORT_FAST_OK=${ok}`,`DIRECT_SKILL_CARD=${hasDirectCard}`,`LEGACY_SUPPORT_BUTTON_HIDDEN=${hiddenLegacy}`,`DIRECT_SKILL_OPENS_SUPPORTS=${directOpened}`,`SUPPORT_SLOT_COUNT=${slots}`,`EQUIP_CONTROL_NOT_HIJACKED=${equipNotHijacked}`,`ACTIVE_SKILLS_FIRST=${activeFirst}`,`LOADOUT_SUPPORT_COUNTS=${loadoutSupportCounts}`,`LOADOUT_CARD_OPENS_SUPPORTS=${loadoutCardOpens}`,`QUICK_ACTIONS=${quickActions}`,`ADD_NEXT_OPENS_FIRST_EMPTY=${addNextOpens}`,`RECOMMENDED_SUPPORTS=${recommended}`,`AUTO_FILL_EMPTY=${autoFilled}`,`ACTIVE_SKILL_NAV=${navButtons&&nextActive}`,`ERRORS=${errors.join('|')}`],{ok,hasDirectCard,hiddenLegacy,directOpened,slots,equipNotHijacked,activeFirst,loadoutSupportCounts,loadoutCardOpens,quickActions,addNextOpens,recommended,autoFilled,navButtons,nextActive,errors})
}catch(e){finish(['SUPPORT_FAST_OK=false',`EXCEPTION=${String(e?.stack||e?.message||e).replace(/\n/g,' | ')}`],{ok:false,exception:String(e)})}
})();