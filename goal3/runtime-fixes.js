'use strict';
(()=>{
// Goal 03 v1.2: a projectile skill must not consume the scheduler forever while its target is behind terrain.
// The previous scheduler considered range only, so Firebolt could repeatedly fire into an obstacle and starve movement.
const oldSkillState=skillState;
skillState=function(id,t,comboBoost=false){
  const st=oldSkillState(id,t,comboBoost),d=window.DopamineSkills?.get?.(id);
  if(st.ok&&d?.delivery==='projectile'&&t&&!hasLineOfSight(P,t,4))return{...st,ok:false,forced:false,reason:'SEEK LINE OF SIGHT'};
  return st;
};
})();
