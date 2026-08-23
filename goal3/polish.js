'use strict';
(()=>{
const q=new URLSearchParams(location.search);
if(q.has('goal3test')||q.has('goal3mobiletest')||q.has('goal3soak')||q.has('selftest'))return;
if(!window.DopamineSkillProgression||!window.DopamineSkills)return;
let lastDropCount=window.DopamineSkillProgression.progress().drops||0,lastDropStamp=0;
const style=document.createElement('style');style.textContent=`#g3loot{position:fixed;left:50%;top:19%;transform:translate(-50%,-18px) scale(.94);z-index:28;opacity:0;pointer-events:none;min-width:min(340px,86vw);text-align:center;background:linear-gradient(180deg,#19253cf5,#080d18f5);border:1px solid #d2a6ff;border-radius:14px;padding:10px 14px;box-shadow:0 10px 36px #000b,0 0 22px #9b67d744;transition:.18s ease;color:#f5edff;font-family:system-ui}#g3loot.show{opacity:1;transform:translate(-50%,0) scale(1)}#g3loot small{display:block;font:900 8px/1.2 system-ui;letter-spacing:.16em;color:#c59bff}#g3loot b{display:block;font:1000 16px/1.25 system-ui;margin:3px 0}#g3loot span{font:800 9px/1.2 system-ui;color:#a9c8ea}`;document.head.appendChild(style);
const loot=document.createElement('div');loot.id='g3loot';document.body.appendChild(loot);
function showLoot(last){if(!last||!DopamineSkills.get(last.id))return;const d=DopamineSkills.get(last.id),lv=DopamineSkills.getLevel(last.id),cap=window.DopamineSkillProgression.capForMonster(last.monsterLevel),quality=last.level>=Math.max(2,cap)?'HIGH ROLL':last.level>=Math.max(1,cap-1)?'STRONG DROP':'SKILL DROP';loot.innerHTML=`<small>${quality}</small><b>${d.name} • LEVEL ${last.level}</b><span>Monster level ${last.monsterLevel} • Owned level ${lv}</span>`;loot.classList.add('show');lastDropStamp=performance.now();}
const oldHud=hud;hud=function(){oldHud();const p=window.DopamineSkillProgression.progress();if((p.drops||0)>lastDropCount){lastDropCount=p.drops;showLoot(p.lastDrop)}if(loot.classList.contains('show')&&performance.now()-lastDropStamp>2200)loot.classList.remove('show')};
// Wisp's level-10 mastery is sustain: successful Wisp hits restore a small amount of life.
const oldHit=hit;hit=function(e,a,k,crit=false,kb=0){const wasAlive=e&&!e.dead;oldHit(e,a,k,crit,kb);if(wasAlive&&k==='Ember Wisp'&&DopamineSkills.getLevel('Wisp')>=10)heal(Math.min(DopamineSkills.getLevel('Wisp')>=20?5:3,Math.max(1,a*.035)))};
})();
