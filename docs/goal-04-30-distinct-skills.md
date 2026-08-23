# Goal 04 — Build 30 Exceptionally Distinct Skills

## Status

Phase 1 implementation is in progress on top of the signed-off Goal 03 v1.3 runtime. Goal 04 issue: #5.

Current public baseline: https://dopamine-playtest.vercel.app/?v=goal3-131

## Required six-phase process

1. **Implement** the 30-skill catalog and integrate it with Brain/loadout/progression.
2. **Test for one simulated hour** in an actual browser across rotating builds.
3. Use the test results to identify and implement **20 major fun-factor improvements**.
4. **Retest** the improved system.
5. Fix the **10 largest remaining gaps**.
6. Score Goal 04 for completeness; if below 9/10, add **5 more major improvements** and retest before signoff.

## Catalog

Goal 04 retains the seven signed-off Goal 03 skills and adds 23 new mechanics:

| Skill | Core identity |
| --- | --- |
| Heavy Slash | heavy melee cleave / execute |
| Whirlwind | sustained point-blank spin |
| Ground Slam | delayed heavy nova / stagger |
| Firebolt | ranged ignite projectile |
| Vault Strike | gap-closing melee strike |
| Scorch Field | persistent heat-stacking ground DoT |
| Ember Wisp | temporary ranged chain minion |
| Frost Lance | piercing chill projectile |
| Chain Lightning | multi-target chaining spell |
| Meteor | marked delayed impact |
| Arcane Orbit | player-following orbit damage |
| Chain Hook | ranged pull into melee |
| Shield Charge | line movement / knockback |
| Blade Storm | roaming persistent damage zone |
| Riposte | reactive counter after taking damage |
| Frost Nova | defensive freeze/control nova |
| Frozen Orb | slow pulsing projectile |
| Glacier Wall | damaging slowing ice line |
| Thunderstep | teleport strike with lightning chain |
| Storm Totem | stationary ranged summon |
| Ball Lightning | slow repeated-AoE projectile |
| Venom Fang | poison-stacking fast melee |
| Plague Burst | poison detonation payoff |
| Acid Pool | corrosive damage-amplifying ground DoT |
| Shadow Knives | five-projectile fan |
| Ricochet Shot | bouncing ranged clear |
| Barrage | rapid multi-shot channel |
| Bone Golem | mobile melee bruiser summon |
| Raven Swarm | multiple independent harassment minions |
| Gravity Well | persistent enemy grouping/pull field |

The 23 new skills intentionally use 23 different behavior identities even when they share broader tags such as Projectile, Spell, Minion, or AoE.

## Progression

Goal 04 preserves the existing Goal 03 save. The new 23 skills have their own versioned progression state and unlock gradually from monster level 16 through 60. New skill drops continue to scale their level from monster level and support levels 1–20, resonance upgrades, boss bias, and discovery pity.

## UI

The Arsenal expands to all 30 skills with filtering and three explicit Brain priority slots. Persistent skill-drop notifications are intentionally compact and docked in the bottom-right so they do not cover combat.

## Phase 2 gate

The one-hour test rotates ten three-skill loadouts so every current skill is exercised. Passing requires:

- exactly 30 skills / 23 new skills
- 23 distinct new behavior identities
- unique names and broad role coverage
- all 30 direct-cast smoke tests passing
- all 30 Arsenal cards rendering
- bottom-right compact drop notification verification
- 3,600 simulated seconds of live room combat
- every skill casting during the soak
- all ten build rotations exercised
- zero genuine 91-second room stalls
- no runtime errors
- Goal 02 regression still green
