# Goal 04 — Build 30 Exceptionally Distinct Skills

## Status

**COMPLETE — machine-verified at 10.0/10 and deployed to production.**

Playable production: https://dopamine-playtest.vercel.app/?v=goal4-10

Goal 04 issue: #5

Production runtime pin: `bcf5acc3764434c58aaa910ea1bb27f87a65e355`

Goal 02 baseline pin: `f8835df56101a93e4d87fa498d17cee228fe292e`

## Required six-phase process — completed

1. **Phase 1 — Implement:** expanded the signed-off Goal 03 system to 30 total skills / 23 new distinct behaviors and integrated them with Brain scheduling, drops, levels, loadouts, progression, HUD, and Arsenal.
2. **Phase 2 — One-hour test:** actual browser simulation reached 3,600 seconds / 102,858 steps with all 30 skills exercised and no runtime errors. Findings were used rather than hidden.
3. **Phase 3 — 20 fun-factor improvements:** implemented twenty substantial combat/build improvements including status synergies, combo sequencing, targeting improvements, family identities, sustain, wards, and mastery behavior.
4. **Phase 4 — Retest:** exposed weak families, one anti-stall edge case, and an early biased balance harness. The harness problem was diagnosed instead of tuning around bad data.
5. **Phase 5 — 10 largest gaps:** repaired ranged spacing/accuracy, Barrage tracking, Shadow Knives/Ricochet reliability, frost payoff, mobility cleanup, ranged survivability, poison sustain, legacy melee normalization, and UI geometry verification.
6. **Phase 6 — Completeness:** the first audit scored only 6.8/10, triggering five required major upgrades: seven visible FX families, five smart presets, scalable Arsenal search/favorites/saved builds, smart discovery protection, and versioned progression/build backup. The corrected isolated final gate then scored **10.0/10**.

## Catalog

Goal 04 retains the seven Goal 03 skills and adds 23 distinct mechanics:

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
| Shadow Knives | five-projectile fan / close shotgun identity |
| Ricochet Shot | bouncing ranged clear |
| Barrage | tracked rapid multi-shot channel |
| Bone Golem | mobile melee bruiser summon |
| Raven Swarm | multiple independent harassment minions |
| Gravity Well | persistent enemy grouping/pull field |

The 23 new skills use 23 different behavior identities even where broader tags overlap.

## Progression and collection

- New skills unlock gradually from monster level 16 through 60.
- Skill levels remain 1–20 and higher-level monsters support higher-level drops.
- Boss/elite bias, duplicate resonance, upgrade rolls, and discovery pity remain active.
- Goal 04 adds smart boss discovery protection and a capped eligible-skill dry streak.
- Fresh-account production test discovered **30/30 skills in 891.1 simulated seconds**, 25,459 steps, 120 rooms, reaching monster level 60 with **0 stalls**.
- Goal 04 preferences/builds and progression receive versioned backup metadata.

## Fun-factor pass

Twenty major improvements were implemented after the first one-hour test. Highlights include:

- Frostbite → Shatter payoff
- Shock → Overload payoff
- Venom Fang → Plague Burst setup/detonation sequencing
- Gravity Well → Meteor grouping/payoff sequencing
- Acid corrosion
- Ball Lightning capacitor ramp
- Shadow Knives point-blank scaling
- Ricochet impact splash
- Barrage tracking / execute behavior
- movement and ranged defensive wards
- poison sustain
- Riposte sustain
- smarter AoE target selection
- Lv5 / Lv10 / Lv20 mastery tracks for the 23 new skills
- Arsenal synergy evaluation

## Arsenal UX

The 30-skill Arsenal now supports:

- explicit P1 / P2 / P3 priority slots
- locked/owned state
- level and role data
- smart Frost, Storm, Venom, Marksman, and Summoner presets
- live search
- favorites
- owned-only filtering
- favorites-first ordering
- three saved build slots
- persistent build preferences

## Drop presentation / mobile regression

A player screenshot exposed a second legacy drop element: `#g3compare`, the large `RARE DROP • skill / DMG / CD / RANGE` comparison popup. It was independent from the previously-fixed `#g3loot` toast.

All drop presentation is now compact and bottom-right. The production browser gate explicitly recreates the screenshot-style comparison card at **390×844** and requires:

- skill-drop toast bottom-right
- upgrade comparison popup bottom-right
- comparison width under 190px
- 8px heading in the verified build
- DMG / CD / RANGE in three compact columns

This exact public production regression passes.

## Fair balance methodology

An early rotating-build harness accidentally coupled each build to different room depths. That created misleading extreme win rates. The final balance gate instead gives **all ten representative builds the exact same depths 1–30 and the same seed at each depth**.

Final public fair matrix:

- 300 rooms
- 85,057 combat steps
- 0 genuine stalls
- all 30 skills cast
- weakest representative build: 26.7%
- strongest representative build: 70.0%

The goal is viable build-family coverage, not identical win rate.

## Final local gate

Passing commit: `bcf5acc3764434c58aaa910ea1bb27f87a65e355`

- mobile/UI gate: PASS
- 30 Arsenal cards: PASS
- 23 distinct new behaviors: PASS
- compact screenshot-style drop comparison: PASS
- seven visible FX families: PASS
- 20 fun improvements: PASS
- 10 gap repairs: PASS
- five Phase 6 completion upgrades: PASS
- fair 300-room matrix: PASS, 0 stalls
- fresh progression 30/30: PASS
- separate one-hour stability: PASS
- Goal 02 regression: PASS
- Goal 03 regression: PASS
- completeness score: **10.0/10**

## Public Vercel gate

The same isolated gates were run against the actual public Vercel alias after production deployment:

- production shell / runtime pin: PASS
- 390×844 mobile UI: PASS
- `COMPARE_POPUP_BOTTOM_RIGHT=true`
- 300-room fair matrix: PASS, 0 stalls, 26.7%–70.0% representative build range
- fresh progression: PASS, 30/30 in 891.1 simulated seconds
- one-hour public browser simulation: PASS
  - 3,600.0 simulated seconds
  - 102,858 steps
  - 293 rooms
  - 0 stalls
  - all 30 skills cast
  - no runtime errors

Goal 04 is ready for player feel testing and Goal 05 development.
