'use strict';
(()=>{
const q=new URLSearchParams(location.search),test=q.has('supporttest'),mobile=q.has('supportmobile');if(!test&&!mobile)return;
const api=window.DopamineSkills,sup=window.DopamineSupports,ui=window.DopamineSupportUI;if(!api||!sup||!ui)return;
function attach(){const p=ui.panel?.();if(p&&!p.isConnected)document.body.appendChild(p);return p}
function out(id,rows,obj){active=false;pausedForBrain=true;document.body.innerHTML=`<pre id="${id}" style="white-space:pre-wrap;background:#07101a;color:#eaf3ff;padding:18px;font:13px/1.5 ui-monospace,monospace">${rows.join('\n')}</pre>`;window[id]=obj}
if(test){
 const prior=window.__DOPAMINE_SUPPORT_TEST||{};
 try{
   attach();sup.reset();sup.resetSocketLayout?.();sup.resetSlots?.();
   sup.debugSetSlots('Firebolt',3);sup.debugSetSlots('FrostLance',3);
   ['quickened','echo','rime'].forEach(id=>sup.grant(id,1,60,true));
   const seeded=sup.assignSocket('FrostLance',2,'quickened')?.ok===true&&sup.supportAt('FrostLance',2)==='quickened';
   ui.open('Firebolt');
   const tenVisible=document.querySelectorAll('.g6slot').length===10;
   const noCatalogScroll=document.querySelectorAll('.g6pickrow').length===0;
   const slot1=document.querySelector('.g6slot[data-slot="1"]');slot1?.click();
   const pickerOpen=getComputedStyle(ui.picker()).display!=='none';
   const moveRow=[...document.querySelectorAll('.g6pickrow')].find(x=>x.querySelector('[data-pick="quickened"]'));
   const moveLabel=moveRow?.textContent.includes('MOVE FROM Frost Lance');
   moveRow?.querySelector('[data-pick="quickened"]')?.click();
   const moved=sup.supportAt('Firebolt',1)==='quickened'&&sup.supportAt('FrostLance',2)==null;
   document.querySelector('.g6slot[data-slot="1"]')?.click();
   document.querySelector('[data-pick="echo"]')?.click();
   const replaced=sup.supportAt('Firebolt',1)==='echo'&&!sup.equipped('Firebolt').includes('quickened');
   document.querySelector('.g6slot[data-slot="1"]')?.click();
   document.getElementById('g6clearSocket')?.click();
   const cleared=sup.supportAt('Firebolt',1)==null;
   const exactPlacement=sup.assignSocket('Firebolt',2,'rime')?.ok===true&&sup.supportAt('Firebolt',2)==='rime'&&sup.supportAt('Firebolt',0)==null;
   ui.render('Firebolt');const tabs=[...document.querySelectorAll('[data-skill]')],activeTabs=tabs.length>=1;
   const errs=typeof runtimeErrors!=='undefined'?runtimeErrors:[],ok=seeded&&tenVisible&&noCatalogScroll&&pickerOpen&&moveLabel&&moved&&replaced&&cleared&&exactPlacement&&activeTabs&&errs.length===0;
   prior.ui=ok;prior.copyAllocation=moved;prior.socketUiV2=ok;prior.directSocketPicker=pickerOpen;prior.moveReassign=moved;prior.exactPlacement=exactPlacement;prior.noCatalogScroll=noCatalogScroll;prior.errors=[...(prior.errors||[]),...errs];
   window.__DOPAMINE_SUPPORT_TEST=prior;
 }catch(e){prior.ui=false;prior.socketUiV2=false;prior.errors=[...(prior.errors||[]),String(e?.message||e)];window.__DOPAMINE_SUPPORT_TEST=prior}
 return
}
if(mobile){
 const prior=window.__DOPAMINE_SUPPORT_MOBILE||{};
 try{
   attach();sup.reset();sup.resetSocketLayout?.();sup.resetSlots?.();
   ui.open('Firebolt');const lockedStart=document.querySelectorAll('.g6slot.locked').length,tenVisible=document.querySelectorAll('.g6slot').length===10;
   sup.debugSetSlots('Firebolt',1);sup.grant('quickened',1,60,true);ui.render('Firebolt');
   document.querySelector('.g6slot[data-slot="0"]')?.click();const pickerOpen=getComputedStyle(ui.picker()).display!=='none',row=!!document.querySelector('[data-pick="quickened"]');
   document.querySelector('[data-pick="quickened"]')?.click();const socketed=sup.supportAt('Firebolt',0)==='quickened';
   const errs=typeof runtimeErrors!=='undefined'?runtimeErrors:[],ok=!!prior.summaryVisible&&prior.clearance>=0&&prior.proceedVisible&&prior.proceedTopmost&&lockedStart===10&&tenVisible&&pickerOpen&&row&&socketed&&errs.length===0;
   out('__DOPAMINE_SUPPORT_MOBILE',[`SUPPORT_MOBILE_OK=${ok}`,`SUMMARY_VISIBLE=${!!prior.summaryVisible}`,`SUMMARY_FOOTER_CLEARANCE=${Number(prior.clearance||0).toFixed(1)}`,`PROCEED_VISIBLE=${!!prior.proceedVisible}`,`PROCEED_TOPMOST=${!!prior.proceedTopmost}`,`PROCEED_TEXT=PROCEED • DEPTH 2`,`SUPPORT_PANEL=${tenVisible}`,`LOCKED_SLOTS_AT_START=${lockedStart}`,`SOCKET_PICKER_CLICK=${pickerOpen&&row}`,`SOCKET_ASSIGN_CLICK=${socketed}`,`VIEWPORT=${innerWidth}x${innerHeight}`,`ERRORS=${errs.join('|')}`],{...prior,ok,lockedSlots:lockedStart,socketPicker:pickerOpen&&row,socketAssign:socketed,errors:errs});
 }catch(e){out('__DOPAMINE_SUPPORT_MOBILE',['SUPPORT_MOBILE_OK=false',`EXCEPTION=${String(e?.message||e)}`],{ok:false})}
}
})();