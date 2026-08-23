'use strict';
(()=>{
const defs={};
const add=(id,name,category,desc,opts={})=>defs[id]=Object.freeze({id,name,category,desc,tier:1,...opts});
const req=(...x)=>x,mods=(damage=1,cooldown=1,range=1)=>({damage,cooldown,range});
// TEMPO / REPEAT — 10
add('quickened','Quickened','Tempo','Casts 22% more often, but each hit deals 12% less damage.',{mods:mods(.88,.78)});
add('overclocked','Overclocked','Tempo','Cuts supported cooldowns by 38%; damage falls 28%.',{mods:mods(.72,.62),tier:2});
add('loaded_chamber','Loaded Chamber','Tempo','Slower cadence, much heavier hits.',{mods:mods(1.55,1.32)});
add('deliberate_power','Deliberate Power','Tempo','Very long cooldowns in exchange for enormous impact.',{mods:mods(1.85,1.55),tier:2});
add('echo','Echo','Repeat the skill once shortly after the first cast.',{group:'repeat',mods:mods(.80,1.08),repeat:{count:1,delay:.32,mode:'same'}});
add('double_echo','Double Echo','Repeat twice; each cast is lighter and the cooldown is longer.',{group:'repeat',mods:mods(.62,1.20),repeat:{count:2,delay:.27,mode:'same'},tier:2});
add('fourth_echo','Fourth Echo','Every fourth cast repeats at full cadence.',{group:'repeat',repeat:{count:1,delay:.24,mode:'same',every:4},tier:2});
add('staccato','Staccato Cycle','Alternates a very fast light cast with a slower heavy cast.',{pattern:'staccato',tier:2});
add('crescendo','Crescendo','Repeated casts within 3 seconds ramp damage up to +48%.',{pattern:'crescendo',tier:2});
add('kill_reset','Predator Reset','A kill primes the supported skill to ignore its remaining cooldown once.',{onKill:'reset',tier:3});
// CONVERSION — 10
add('pyre','Pyre Conversion','Conversion','Convert supported damage to Fire; hits ignite.',{group:'conversion',conversion:'Fire'});
add('rime','Rime Conversion','Conversion','Convert supported damage to Cold; hits chill.',{group:'conversion',conversion:'Cold'});
add('storm','Storm Conversion','Conversion','Convert supported damage to Lightning; hits shock.',{group:'conversion',conversion:'Lightning'});
add('void','Void Conversion','Conversion','Convert supported damage to Chaos; hits poison.',{group:'conversion',conversion:'Chaos'});
add('iron','Iron Conversion','Conversion','Convert supported damage to Physical and add knockback.',{group:'conversion',conversion:'Physical'});
add('prismatic_cycle','Prismatic Cycle','Conversion','Cycle Fire → Cold → Lightning every cast.',{group:'conversion',conversion:'Cycle',tier:2});
add('wild_magic','Wild Magic','Conversion','Roll a random damage type on every cast.',{group:'conversion',conversion:'Random',mods:mods(1.08,1),tier:2});
add('frostfire','Frostfire','Conversion','Blend Fire and Cold: ignite and chill on every hit.',{group:'conversion',conversion:'FireCold',mods:mods(.92,1),tier:2});
add('stormfire','Stormfire','Conversion','Blend Fire and Lightning: ignite plus shock.',{group:'conversion',conversion:'FireLightning',mods:mods(.90,1),tier:2});
add('pure_force','Pure Force','Conversion','Become Physical, suppress elemental ailments, and deal 30% more direct damage.',{group:'conversion',conversion:'PurePhysical',mods:mods(1.30,1),tier:3});
// PROJECTILE — 10
add('multishot','Multishot','Projectile','Projectile skills fire two extra follow-up shots toward alternate targets.',{requires:req('Projectile'),group:'repeat',mods:mods(.72,1.08),repeat:{count:2,delay:.08,mode:'alternate'}});
add('fanfire','Fanfire','Projectile','Projectile skills fire four rapid extra shots for wide pack coverage.',{requires:req('Projectile'),group:'repeat',mods:mods(.52,1.18),repeat:{count:4,delay:.065,mode:'alternate'},tier:2});
add('forking_impact','Forking Impact','Projectile','Projectile hits fork damage into two nearby enemies.',{requires:req('Projectile'),splash:{count:2,ratio:.34,radius:92}});
add('chain_core','Chain Core','Projectile','Projectile hits arc into two nearby enemies.',{requires:req('Projectile'),chain:{count:2,ratio:.30,radius:125},tier:2});
add('piercing_wake','Piercing Wake','Projectile','Projectile hits carry through into enemies lined up behind the victim.',{requires:req('Projectile'),pierce:{count:2,ratio:.42,radius:120},tier:2});
add('point_blank','Point Blank','Projectile','Deal far more damage up close and less at long range.',{requires:req('Projectile'),pattern:'pointblank'});
add('far_shot','Far Shot','Projectile','Deal more damage at long range and less up close.',{requires:req('Projectile'),pattern:'farshot'});
add('siege_shot','Siege Shot','Projectile','25% more targeting range and 38% more damage, but 24% longer cooldown.',{requires:req('Projectile'),mods:mods(1.38,1.24,1.25),tier:2});
add('seeker','Seeker','Projectile','Extends targeting range and can fire through imperfect line-of-sight windows.',{requires:req('Projectile'),mods:mods(.92,.95,1.30),ignoreLos:true,tier:2});
add('shrapnel','Shrapnel','Projectile','Projectile kills explode into nearby enemies.',{requires:req('Projectile'),onKill:'burst',tier:2});
// AREA / DOT — 10
add('expanded_area','Expanded Area','Area','Hits splash farther across packs, trading some single-target damage.',{requires:req('AoE','DoT'),mods:mods(.88,1),splash:{count:3,ratio:.24,radius:135}});
add('concentrated','Concentrated Effect','Area','Brain waits for a denser target window; payoff is 52% more damage.',{requires:req('AoE','DoT'),mods:mods(1.52,1),needBonus:1,tier:2});
add('aftershock','Aftershock','Area','Repeat the supported area skill after a short delay.',{requires:req('AoE','DoT','Melee'),group:'repeat',mods:mods(.78,1.12),repeat:{count:1,delay:.72,mode:'same'},tier:2});
add('pulse_wave','Pulse Wave','Area','Every hit emits a secondary pulse into nearby enemies.',{requires:req('AoE','DoT'),splash:{count:3,ratio:.27,radius:105}});
add('implosion','Implosion','Area','Hits drag nearby enemies toward the victim, tightening packs for follow-up AoE.',{requires:req('AoE','Control'),pull:14,tier:2});
add('repulsion','Repulsion','Area','Adds strong knockback to every supported hit.',{requires:req('AoE','Melee'),knockback:28});
add('lingering_pain','Lingering Pain','DoT','Hits leave three delayed damage echoes over 1.8 seconds.',{requires:req('DoT','AoE'),dot:{ticks:3,interval:.60,ratio:.16,type:'Lingering'}});
add('rapid_decay','Rapid Decay','DoT','Adds two fast damage ticks immediately after a hit; direct damage is slightly reduced.',{requires:req('DoT'),mods:mods(.86,1),dot:{ticks:2,interval:.18,ratio:.18,type:'Decay'}});
add('epidemic','Epidemic','DoT','Kills spread a lingering damage package to nearby enemies.',{requires:req('DoT','Chaos'),onKill:'epidemic',tier:2});
add('wasting_finish','Wasting Finish','DoT','Deals 60% more damage to enemies below 35% life.',{requires:req('DoT','Chaos'),execute:{threshold:.35,mult:1.60},tier:2});
// MELEE / MOVEMENT — 10
add('cleaving_edge','Cleaving Edge','Melee','Melee hits cleave into two nearby enemies.',{requires:req('Melee'),splash:{count:2,ratio:.42,radius:82}});
add('heavy_hands','Heavy Hands','Melee','50% more damage and much more knockback, but a 25% longer cooldown.',{requires:req('Melee'),mods:mods(1.50,1.25),knockback:22});
add('frenzy','Frenzy','Melee','Melee skills cycle 32% faster but deal 24% less damage.',{requires:req('Melee'),mods:mods(.76,.68)});
add('blood_price','Blood Price','Melee','Spend 3.5% max life on each cast to deal 65% more damage.',{requires:req('Melee','Spell'),mods:mods(1.65,1),selfDamage:.035,tier:2});
add('leeching','Leeching Strikes','Melee','Heal for 7% of supported damage dealt.',{requires:req('Melee'),leech:.07,tier:2});
add('executioner','Executioner','Melee','Deal 80% more damage to enemies below 25% life.',{requires:req('Melee'),execute:{threshold:.25,mult:1.80},tier:2});
add('momentum','Momentum','Movement','Movement skills hit harder, cycle faster, and heal 5% max life when cast.',{requires:req('Movement'),mods:mods(1.20,.88,1.15),healOnCast:.05});
add('shockwave','Shockwave','Melee','Melee and movement hits release a short-range shockwave.',{requires:req('Melee','Movement'),splash:{count:3,ratio:.32,radius:100}});
add('ruthless','Ruthless Rhythm','Melee','Every third cast deals 85% more damage.',{requires:req('Melee'),pattern:'ruthless',tier:2});
add('duelist','Duelist','Melee','Gain 55% damage when only one enemy remains; lose 10% in large packs.',{requires:req('Melee'),pattern:'duelist',tier:2});
// MINION / UTILITY — 10
add('twin_summons','Twin Summons','Minion','Summon skills repeat once, creating a second actor when the behavior allows it.',{requires:req('Minion'),group:'repeat',mods:mods(.74,1.18),repeat:{count:1,delay:.16,mode:'same'}});
add('swarm_protocol','Swarm Protocol','Minion','Summon skills repeat twice for much larger board presence at lower individual damage.',{requires:req('Minion'),group:'repeat',mods:mods(.55,1.30),repeat:{count:2,delay:.13,mode:'same'},tier:2});
add('relentless_contract','Relentless Contract','Minion','Minion skills can be recast 25% sooner, trading 15% damage.',{requires:req('Minion'),mods:mods(.85,.75)});
add('frenzied_minions','Frenzied Minions','Minion','Minion hits deal 30% more damage; summon cooldown is 10% longer.',{requires:req('Minion'),mods:mods(1.30,1.10)});
add('sacrificial_host','Sacrificial Host','Minion','Minion skills deal 65% more damage but take 34% longer to return.',{requires:req('Minion'),mods:mods(1.65,1.34),tier:2});
add('guardian_pact','Guardian Pact','Minion','Casting a minion restores 8% max life.',{requires:req('Minion'),healOnCast:.08,tier:2});
add('command_chain','Command Chain','Minion','Minion hits chain into two nearby enemies.',{requires:req('Minion'),chain:{count:2,ratio:.28,radius:115},tier:2});
add('minion_nova','Minion Nova','Minion','Every minion hit splashes damage around its victim.',{requires:req('Minion'),splash:{count:3,ratio:.25,radius:92}});
add('rebirth','Rebirth','Minion','Every third summon immediately repeats.',{requires:req('Minion'),group:'repeat',repeat:{count:1,delay:.12,mode:'same',every:3},tier:3});
add('shared_vitality','Shared Vitality','Minion','Minion damage heals the player for 5% of damage dealt.',{requires:req('Minion'),leech:.05,tier:2});
const ids=Object.keys(defs);
window.DopamineSupportCatalog=Object.freeze({version:'Support Catalog v1.0',ids:()=>[...ids],get:id=>defs[id]||null,all:()=>ids.map(id=>defs[id]),count:ids.length,categories:[...new Set(ids.map(id=>defs[id].category))]});
})();
