'use strict';
(()=>{
// Goal 02 combat effects intentionally key a few legacy VFX/stat hooks by source string.
// Goal 03 may rename player-facing skills, but must not silently change those verified behaviors.
const goal2Hit=hit;
hit=function(e,a,k,crit=false,kb=0){
  return goal2Hit(e,a,k==='Heavy Slash'?'Slash':k,crit,kb);
};
})();
