'use strict';
(()=>{
const q=new URLSearchParams(location.search);if(['selftest','goal3test','goal3mobiletest','goal3soak','goal3progressiontest','goal3progressionsoak','goal3loadoutuitest','goal3skillsoak'].some(k=>q.has(k)))return;
if(!window.DopamineGoal4GapPass)return;
const oldBegin=beginRoom;beginRoom=function(){P.spd=130;oldBegin()};
const oldForce=forceRoom;forceRoom=function(types,obs=[]){P.spd=130;oldForce(types,obs)};
})();
