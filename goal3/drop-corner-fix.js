'use strict';
(()=>{
const old=document.getElementById('g3DropCornerFix');if(old)old.remove();
const st=document.createElement('style');st.id='g3DropCornerFix';st.textContent=`
#skillDropFeed{right:8px!important;left:auto!important;top:auto!important;bottom:62px!important;width:min(176px,44vw)!important;gap:3px!important;align-items:end!important}
#skillDropFeed div{font:800 6px/1.2 system-ui!important;padding:4px 6px!important;border-radius:6px!important;box-shadow:0 3px 10px #0008!important;text-align:right!important;opacity:.92!important}
#g3loot{left:auto!important;right:8px!important;top:auto!important;bottom:10px!important;transform:translateY(6px) scale(.96)!important;min-width:0!important;width:min(176px,44vw)!important;text-align:right!important;padding:5px 7px!important;border-radius:7px!important;box-shadow:0 5px 16px #000a!important}
#g3loot.show{transform:none!important}
#g3loot small{font:900 5px/1.1 system-ui!important;letter-spacing:.10em!important}
#g3loot b{font:1000 8px/1.15 system-ui!important;margin:1px 0!important}
#g3loot span{font:800 6px/1.1 system-ui!important}
/* The upgrade comparison card was a second, independent top-screen overlay. Dock it too. */
#g3compare{left:auto!important;right:8px!important;top:auto!important;bottom:112px!important;transform:translateY(5px)!important;width:min(176px,44vw)!important;min-width:0!important;padding:5px 6px!important;border-radius:7px!important;text-align:right!important;font:800 6px/1.15 system-ui!important;box-shadow:0 5px 16px #0009!important;transition:opacity .16s,transform .16s!important}
#g3compare.show{transform:none!important}
#g3compare b{display:block!important;font:1000 8px/1.1 system-ui!important;margin:0 0 1px!important}
#g3compare>div:not(.delta){font:800 6px/1.1 system-ui!important;opacity:.78!important}
#g3compare .delta{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:2px!important;margin-top:3px!important}
#g3compare .delta span{font:900 5px/1.15 system-ui!important;padding:3px 2px!important;border-radius:4px!important;min-width:0!important;white-space:nowrap!important}
#g3compare em{font-size:6px!important}
#g3worldloot .g3drop{font-size:6px!important}
#g3worldloot .g3drop i{width:4px!important;height:18px!important}
#g3worldloot .g3drop b{font-size:6px!important;line-height:1.1!important;padding:2px 4px!important;border-radius:5px!important;max-width:118px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
@media(max-width:520px){#skillDropFeed{right:5px!important;bottom:52px!important;width:min(150px,42vw)!important}#g3loot{right:5px!important;bottom:7px!important;width:min(150px,42vw)!important}#g3compare{right:5px!important;bottom:104px!important;width:min(150px,42vw)!important}}
`;document.head.appendChild(st);
})();
