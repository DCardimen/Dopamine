'use strict';
(()=>{
const api=window.DopamineSkills,sup=window.DopamineSupports,cat=window.DopamineSupportCatalog;if(!api||!sup||!cat)return;
const css=document.createElement('style');css.id='g6SupportCss';css.textContent=`
#g6supportToast{position:fixed;right:6px;bottom:calc(var(--g6footer-h,64px) + 8px);z-index:130;width:min(210px,52vw);padding:7px 9px;border:1px solid #75e0bd;border-radius:9px;background:#071811f5;box-shadow:0 6px 20px #000a;text-align:right;pointer-events:none;font:800 8px/1.25 system-ui}
#g6supportToast small{display:block;font-size:6px;letter-spacing:.12em;color:#86f0cc}#g6supportToast b{display:block;font-size:10px;margin:2px 0}#g6supportToast span{opacity:.75}
.g6supportBtn{width:100%;min-height:31px!important;margin-top:5px;font-size:7px!important;border-color:#3f806d!important;background:#0c2b22!important}.g6supportBtn.has{box-shadow:0 0 0 1px #72e0b8 inset}
#g6supportPanel{position:fixed;inset:0;z-index:100;display:none;background:#03070cf2;padding:8px;overflow:auto}
#g6supportCard{width:min(800px,100%);margin:0 auto;background:#0b1722;border:1px solid #3e6d61;border-radius:15px;padding:12px;min-height:calc(100vh - 16px)}
.g6head{display:flex;justify-content:space-between;gap:8px;align-items:center;position:sticky;top:-8px;background:#0b1722;z-index:4;padding:4px 0 8px}.g6head h2{font-size:18px;margin:0}.g6sub{font-size:8px;opacity:.72}
.g6active{display:flex;gap:5px;overflow-x:auto;padding:3px 0 8px;scrollbar-width:thin}.g6active button{flex:0 0 auto;min-height:34px;padding:0 10px;font-size:8px}.g6active button.on{outline:2px solid #8ce7c7;background:#13392f}
.g6collection{font-size:8px;padding:8px;background:#0a211b;border:1px solid #315d50;border-radius:8px;margin:4px 0 8px}.g6collection b{font-size:10px}.g6slotprogress{margin-top:5px;padding-top:5px;border-top:1px solid #28463e;color:#a9ead4}
.g6slots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin:8px 0 4px}.g6slot{min-height:76px;border:1px solid #3d7263;border-radius:9px;padding:7px;background:#08171a;font-size:7px;cursor:pointer;text-align:left;position:relative;transition:transform .08s,border-color .08s,background .08s}.g6slot:hover{border-color:#74d8b9;background:#0b211f}.g6slot:active{transform:scale(.985)}.g6slot.locked{border-style:dashed;opacity:.42;background:#050b10;cursor:not-allowed}.g6slot small{display:block;font-size:6px;opacity:.55;letter-spacing:.08em}.g6slot b{display:block;font-size:9px;margin:4px 0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.g6slot span{display:block;opacity:.68;line-height:1.2}.g6slot .hint{position:absolute;right:6px;bottom:5px;color:#87dfc4;font-size:6px;opacity:.75}.g6slot.filled{box-shadow:0 0 0 1px #66d5b245 inset}
.g6help{font:700 8px/1.35 system-ui;opacity:.68;padding:8px 2px 2px}
#g6picker{position:fixed;inset:0;z-index:120;display:none;background:#010406dc;padding:12px;overflow:auto}
#g6pickerCard{width:min(680px,100%);margin:4vh auto;background:#0a1721;border:1px solid #4d8978;border-radius:14px;padding:11px;box-shadow:0 18px 55px #000c}
.g6pickhead{display:flex;align-items:center;justify-content:space-between;gap:8px;position:sticky;top:-12px;background:#0a1721;z-index:2;padding:4px 0 8px}.g6pickhead h3{margin:0;font-size:15px}.g6pickhead div{font-size:7px;opacity:.7}
#g6pickSearch{width:100%;min-height:38px;background:#07111a;color:#efffff;border:1px solid #315b51;border-radius:8px;padding:0 10px;margin:2px 0 8px;box-sizing:border-box}
.g6picklist{display:grid;gap:5px}.g6pickrow{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:center;border:1px solid #294b43;background:#071119;border-radius:9px;padding:8px}.g6pickrow h4{font-size:10px;margin:0 0 2px}.g6pickrow p{font-size:7px;line-height:1.3;margin:0;opacity:.72}.g6pickrow .status{font-size:6px;color:#9ce6cf;margin-top:3px}.g6pickrow button{min-width:92px;min-height:34px;font-size:7px}.g6pickrow.selected{border-color:#86ebc8;background:#0d2923}
.g6pickerActions{display:flex;gap:6px;margin-top:8px;position:sticky;bottom:-12px;background:#0a1721;padding:8px 0 2px}.g6pickerActions button{flex:1;min-height:38px;font-size:8px}.g6clear{border-color:#9f5f64!important;background:#31181b!important}
.g6global{width:100%;min-height:34px!important;font-size:8px!important;background:#0d3229!important;border-color:#4f9c83!important}
@media(max-width:620px){#g6supportPanel{padding:0}#g6supportCard{border-radius:0;min-height:100vh;padding:9px}.g6slots{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.g6slot{min-height:68px}.g6active button{min-height:36px}#g6picker{padding:0}#g6pickerCard{border-radius:0;min-height:100vh;margin:0;padding:10px}.g6pickrow{grid-template-columns:1fr}.g6pickrow button{width:100%}#g6supportToast{right:5px;width:min(180px,48vw)}}`;
document.head.appendChild(css);
const panel=document.createElement('div');panel.id='g6supportPanel';panel.innerHTML='<div id="g6supportCard"></div><div id="g6picker"><div id="g6pickerCard"></div></div>';document.body.appendChild(panel);
let selected=null,pickerSlot=null;
const picker=document.getElementById('g6picker'),pickerCard=document.getElementById('g6pickerCard');
function toastHtml(label,title,sub){document.getElementById('g6supportToast')?.remove();const x=document.createElement('div');x.id='g6supportToast';x.innerHTML=`<small>${label}</small><b>${title}</b><span>${sub}</span>`;document.body.appendChild(x);setTimeout(()=>x.remove(),3600)}
function toast(s,count){toastHtml('SUPPORT DROP',s.name,`${s.category} • owned ×${count}`)}
function slotToast(name,slot,ml){toastHtml('SUPPORT SLOT UNLOCKED',`${name} • SLOT ${slot}`,`Skill pickup from monster level ${ml}`)}
function activeIds(){const a=(api.loadout?.()||[]).filter(Boolean);return [...new Set(a)]}
function slotStatus(id,sid,slot){
 if(!id)return'';
 const here=sup.sockets?.(sid)||[],same=here.indexOf(id);
 if(same>=0&&same!==slot)return`MOVE FROM SLOT ${same+1}`;
 const others=sup.allocations?.(id,sid)||[];
 if(others.length)return`MOVE FROM ${others[0].name} • SLOT ${others[0].slot+1}`;
 const avail=sup.availableCopies(id,sid);return avail>0?`${avail} COPY AVAILABLE`:'MOVE HERE'
}
function closePicker(){picker.style.display='none';pickerSlot=null}
function renderPicker(filter=''){
 const sid=selected,slot=pickerSlot;if(sid==null||slot==null)return;
 const current=sup.supportAt?.(sid,slot)||null,needle=String(filter||'').trim().toLowerCase();
 const rows=cat.ids().filter(id=>sup.owned(id)>0&&sup.compatible(sid,id)).filter(id=>{const s=cat.get(id);return!needle||s.name.toLowerCase().includes(needle)||s.category.toLowerCase().includes(needle)||s.desc.toLowerCase().includes(needle)}).sort((a,b)=>{if(a===current)return-1;if(b===current)return 1;const aa=(sup.allocations?.(a,sid)||[]).length,bb=(sup.allocations?.(b,sid)||[]).length;return aa-bb||cat.get(a).name.localeCompare(cat.get(b).name)});
 pickerCard.innerHTML=`<div class="g6pickhead"><div><h3>${api.get(sid).name} • SOCKET ${slot+1}</h3><div>Choose one of your owned compatible supports. Supports on another skill can move here in one tap.</div></div><button id="g6pickClose">CLOSE</button></div><input id="g6pickSearch" placeholder="Search owned supports…" value="${String(filter||'').replace(/"/g,'&quot;')}"><div class="g6picklist">${rows.length?rows.map(id=>{const s=cat.get(id),sel=id===current,status=sel?'CURRENTLY SOCKETED':slotStatus(id,sid,slot);return`<div class="g6pickrow ${sel?'selected':''}"><div><h4>${s.name} <span style="opacity:.55">×${sup.owned(id)}</span></h4><p>${s.category} • ${s.desc}</p><div class="status">${status}</div></div><button data-pick="${id}">${sel?'KEEP':status.startsWith('MOVE')?'MOVE HERE':'SOCKET'}</button></div>`}).join(''):'<div class="g6collection">No owned compatible supports match this search.</div>'}</div><div class="g6pickerActions">${current?'<button id="g6clearSocket" class="g6clear">CLEAR THIS SOCKET</button>':''}<button id="g6pickCancel">BACK TO SOCKETS</button></div>`;
 pickerCard.querySelector('#g6pickClose').onclick=closePicker;pickerCard.querySelector('#g6pickCancel').onclick=closePicker;
 const search=pickerCard.querySelector('#g6pickSearch');search.oninput=()=>{const pos=search.selectionStart;renderPicker(search.value);const n=pickerCard.querySelector('#g6pickSearch');n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}};
 pickerCard.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const id=b.dataset.pick,res=sup.assignSocket?.(sid,slot,id);if(res?.ok){const s=cat.get(id);toastHtml(res.movedFrom?'SUPPORT MOVED':'SUPPORT SOCKETED',s.name,res.movedFrom?`Moved from ${res.movedFrom.name} • slot ${res.movedFrom.slot+1}`:`${api.get(sid).name} • slot ${slot+1}`);closePicker();render(sid)}});
 const clear=pickerCard.querySelector('#g6clearSocket');if(clear)clear.onclick=()=>{const name=cat.get(current)?.name||current;sup.clearSocket?.(sid,slot);toastHtml('SOCKET CLEARED',name,`${api.get(sid).name} • slot ${slot+1}`);closePicker();render(sid)}
}
function openPicker(slot){
 const cap=typeof sup.unlockedSlots==='function'?sup.unlockedSlots(selected):sup.maxPerSkill;if(slot<0||slot>=cap)return;
 pickerSlot=slot;picker.style.display='block';renderPicker('')
}
function render(sid=selected){
 selected=sid;if(!sid||!api.get(sid))return;
 const c=document.getElementById('g6supportCard'),eq=sup.equipped(sid),all=cat.ids(),ownedN=all.filter(id=>sup.owned(id)).length,compatN=all.filter(id=>sup.compatible(sid,id)).length,slots=typeof sup.unlockedSlots==='function'?sup.unlockedSlots(sid):sup.maxPerSkill,next=typeof sup.nextSlotInfo==='function'?sup.nextSlotInfo(sid,60):null,socketList=typeof sup.sockets==='function'?sup.sockets(sid):Array.from({length:sup.maxPerSkill},(_,i)=>eq[i]||null),active=activeIds();
 const tabs=[...new Set([sid,...active])];
 c.innerHTML=`<div class="g6head"><div><h2>${api.get(sid).name} SUPPORT SOCKETS</h2><div class="g6sub">Tap a socket → choose an owned support → done. No manual un-equipping on the old skill.</div></div><button id="g6close">CLOSE</button></div><div class="g6active">${tabs.map(id=>`<button data-skill="${id}" class="${id===sid?'on':''}">${api.get(id)?.name||id}${active.includes(id)?' • ACTIVE':''}</button>`).join('')}</div><div class="g6collection"><b>${eq.length}/${slots} UNLOCKED SOCKETS FILLED • ${ownedN}/${all.length} SUPPORT TYPES FOUND</b><br>${compatN} owned-or-future support types are compatible with this skill. All ten socket positions stay visible; locked sockets open through skill pickups.${next&&!next.maxed?`<div class="g6slotprogress">NEXT SOCKET: ${next.nextSlot} • monster level ${next.minMonsterLevel}+ • ~1 in ${next.expectedHighLevelPickups} at monster level 60</div>`:'<div class="g6slotprogress">ALL 10 SUPPORT SOCKETS UNLOCKED</div>'}</div><div class="g6slots">${Array.from({length:sup.maxPerSkill},(_,i)=>{const unlocked=i<slots,id=socketList[i],s=id?cat.get(id):null;return`<button class="g6slot ${unlocked?'':'locked'} ${s?'filled':''}" data-slot="${i}" ${unlocked?'':'disabled'}><small>SOCKET ${i+1}</small>${!unlocked?`<b>LOCKED</b><span>Requires support-slot progression</span>`:s?`<b>${s.name}</b><span>${s.category}</span><span class="hint">TAP TO REPLACE</span>`:'<b>EMPTY</b><span>Tap to choose a support</span><span class="hint">ADD +</span>'}</button>`}).join('')}</div><div class="g6help">Only supports you own and that work with ${api.get(sid).name} appear in the picker. If your only copy is already on another skill, choosing it here moves that copy automatically.</div>`;
 c.querySelector('#g6close').onclick=()=>{closePicker();panel.style.display='none';if(document.getElementById('skillLabPanel')?.style.display!=='block')pausedForBrain=false};
 c.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>render(b.dataset.skill));
 c.querySelectorAll('.g6slot[data-slot]:not([disabled])').forEach(b=>b.onclick=()=>openPicker(+b.dataset.slot))
}
function open(sid){if(!sid||!api.isOwned(sid))return;selected=sid;pausedForBrain=true;panel.style.display='block';closePicker();render(sid)}
function decorate(){
 const lab=document.getElementById('skillLabPanel');if(!lab||lab.style.display!=='block')return;
 const toolbar=lab.querySelector('.g4toolbar');if(toolbar&&!lab.querySelector('.g6global')){const b=document.createElement('button');b.className='g6global';b.textContent='MANAGE SUPPORT SOCKETS';b.onclick=()=>open(api.loadout().find(Boolean)||api.ownedIds()[0]);toolbar.before(b)}
 for(const card of lab.querySelectorAll('.g4skill')){if(card.querySelector('.g6supportBtn'))continue;const name=card.querySelector('h3')?.textContent,sid=api.ids().find(id=>api.get(id)?.name===name);if(!sid||!api.isOwned(sid))continue;const b=document.createElement('button'),slots=typeof sup.unlockedSlots==='function'?sup.unlockedSlots(sid):sup.maxPerSkill;b.className='g6supportBtn '+(sup.equipped(sid).length?'has':'');b.textContent=`SUPPORT SOCKETS ${sup.equipped(sid).length}/${slots}`;b.onclick=()=>open(sid);card.appendChild(b)}
}
const mo=new MutationObserver(()=>requestAnimationFrame(decorate));mo.observe(document.getElementById('skillLabPanel')||document.body,{childList:true,subtree:true});document.getElementById('skillLabBtn')?.addEventListener('click',()=>requestAnimationFrame(decorate));
function refresh(sid=selected){if(panel.style.display==='block'&&sid)render(sid);requestAnimationFrame(decorate)}
window.DopamineSupportUI=Object.freeze({version:'Support UI v1.3 • Direct Sockets',open,render,refresh,toast,slotToast,selected:()=>selected,panel:()=>panel,openPicker,closePicker,picker:()=>picker,pickerSlot:()=>pickerSlot});
})();