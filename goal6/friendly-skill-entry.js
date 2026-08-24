'use strict';
(()=>{
const api=window.DopamineSkills,ui=window.DopamineSupportUI;if(!api||!ui)return;
const css=document.createElement('style');css.id='g6FriendlySkillEntryCss';css.textContent=`
.g6supportBtn{display:none!important}
#skillLabPanel .g4skill[data-g6-skill-entry],#skillLabPanel .g4slot[data-g6-skill-entry]{cursor:pointer;position:relative;transition:border-color .08s,background .08s,transform .08s}
#skillLabPanel .g4skill[data-g6-skill-entry]:hover,#skillLabPanel .g4slot[data-g6-skill-entry]:hover{border-color:#65c9aa!important;background:#0b201d!important}
#skillLabPanel .g4skill[data-g6-skill-entry]:active,#skillLabPanel .g4slot[data-g6-skill-entry]:active{transform:scale(.992)}
#skillLabPanel .g4skill[data-g6-skill-entry] h3:after{content:'  •  TAP FOR SUPPORTS';font-size:5px;letter-spacing:.08em;color:#7edbbd;opacity:.72;white-space:nowrap}
@media(max-width:520px){#skillLabPanel .g4skill[data-g6-skill-entry] h3:after{content:' • SUPPORTS';font-size:5px}}
`;
document.head.appendChild(css);
function normalize(s){return String(s||'').replace(/\s*•\s*ACTIVE\s*$/i,'').trim()}
function resolve(el){
 const explicit=el?.dataset?.g6SkillEntry;if(explicit&&api.get(explicit))return explicit;
 const label=normalize(el?.querySelector?.('h3')?.textContent||el?.querySelector?.('b')?.textContent||'');
 if(!label)return null;
 return api.ids().find(id=>api.get(id)?.name===label)||null
}
function decorate(){
 const lab=document.getElementById('skillLabPanel');if(!lab)return;
 for(const card of lab.querySelectorAll('.g4skill,.g4slot')){
   const sid=resolve(card);if(!sid||!api.isOwned(sid))continue;
   card.dataset.g6SkillEntry=sid;
   card.title=`Open ${api.get(sid).name} support sockets`;
 }
}
function bind(){
 const lab=document.getElementById('skillLabPanel');if(!lab||lab.dataset.g6DirectSupportBound)return;
 lab.dataset.g6DirectSupportBound='1';
 lab.addEventListener('click',e=>{
   const card=e.target.closest?.('.g4skill[data-g6-skill-entry],.g4slot[data-g6-skill-entry]');if(!card||!lab.contains(card))return;
   if(e.target.closest?.('button,input,select,textarea,a,label'))return;
   const sid=resolve(card);if(!sid||!api.isOwned(sid))return;
   e.preventDefault();e.stopPropagation();ui.open(sid)
 });
}
function refresh(){decorate();bind()}
const mo=new MutationObserver(()=>requestAnimationFrame(refresh));mo.observe(document.getElementById('skillLabPanel')||document.body,{childList:true,subtree:true});
document.getElementById('skillLabBtn')?.addEventListener('click',()=>requestAnimationFrame(refresh));
requestAnimationFrame(refresh);
window.DopamineFriendlySkillEntry=Object.freeze({version:'Friendly Skill Entry v1.0',decorate:refresh,resolve});
})();