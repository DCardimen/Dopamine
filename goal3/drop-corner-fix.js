'use strict';
(()=>{
const st=document.createElement('style');st.id='g3DropCornerFix';st.textContent=`
#skillDropFeed{right:8px!important;left:auto!important;top:auto!important;bottom:62px!important;width:min(176px,44vw)!important;gap:3px!important;align-items:end!important}
#skillDropFeed div{font:800 6px/1.2 system-ui!important;padding:4px 6px!important;border-radius:6px!important;box-shadow:0 3px 10px #0008!important;text-align:right!important;opacity:.92!important}
#g3loot{left:auto!important;right:8px!important;top:auto!important;bottom:10px!important;transform:translateY(6px) scale(.96)!important;min-width:0!important;width:min(176px,44vw)!important;text-align:right!important;padding:5px 7px!important;border-radius:7px!important;box-shadow:0 5px 16px #000a!important}
#g3loot.show{transform:none!important}
#g3loot small{font:900 5px/1.1 system-ui!important;letter-spacing:.10em!important}
#g3loot b{font:1000 8px/1.15 system-ui!important;margin:1px 0!important}
#g3loot span{font:800 6px/1.1 system-ui!important}
#g3worldloot .g3drop{font-size:6px!important}
#g3worldloot .g3drop i{width:4px!important;height:18px!important}
#g3worldloot .g3drop b{font-size:6px!important;line-height:1.1!important;padding:2px 4px!important;border-radius:5px!important;max-width:118px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
@media(max-width:520px){#skillDropFeed{right:5px!important;bottom:52px!important;width:min(150px,42vw)!important}#g3loot{right:5px!important;bottom:7px!important;width:min(150px,42vw)!important}}
`;document.head.appendChild(st);
})();
