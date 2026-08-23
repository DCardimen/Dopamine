'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(!q.has('supporttest'))return;if(typeof forceRoom!=='function')return;
const raw=forceRoom;forceRoom=function(types,obs=[]){if(Array.isArray(types)&&types.length&&typeof types[0]==='string'){const cx=W*.5,cy=H*.52,step=74;types=types.map((type,i)=>[type,cx+(i-(types.length-1)/2)*step,cy+(i%2?32:-32)])}return raw(types,obs)};
})();
