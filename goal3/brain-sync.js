'use strict';
(()=>{
const q=new URLSearchParams(location.search),progressionMode=q.has('goal3progressiontest')||q.has('goal3progressionsoak');
if(!progressionMode&&(q.has('selftest')||q.has('goal3test')||q.has('goal3mobiletest')||q.has('goal3soak')))return;
if(typeof brainInputs==='undefined'||!window.DopamineSkills?.ownedIds)return;
function syncOptions(){const owned=DopamineSkills.ownedIds();[brainInputs.skill1,brainInputs.skill2,brainInputs.skill3].forEach((el,i)=>{if(!el)return;const selected=brain.skills[i]||'';el.innerHTML='<option value="">— EMPTY —</option>'+owned.map(id=>`<option value="${id}">${DopamineSkills.get(id).name} • Lv ${DopamineSkills.getLevel(id)}</option>`).join('');el.value=owned.includes(selected)?selected:''})}
const oldWrite=writeBrainForm;writeBrainForm=function(){syncOptions();oldWrite()};
syncOptions();
})();
