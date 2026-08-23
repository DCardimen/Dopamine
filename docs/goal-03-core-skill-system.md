# Goal 03 — Create the Core Skill System

## Status

**COMPLETE — Goal 03 v1.3 is live, locally verified, and verified again against public Vercel production.**

Public build: https://dopamine-playtest.vercel.app/?v=goal3-13

Goal 03 remains layered on the verified Goal 02 v1.2 combat/Brain baseline. Goal 02 issue #3 remains separate and was not closed or rewritten by this milestone.

## Objective

Turn skills from hard-coded combat branches into reusable data-driven recipes, then make that foundation feel like a real ARPG progression loop: discover skills through combat, improve them through monster-level-scaled drops, make meaningful loadout choices, understand why the Brain uses them, and leave Goal 04 a stable foundation for a much larger catalog.

## Core architecture

Every skill carries explicit stable id, player-facing name, tags, delivery component, base damage, added-damage effectiveness, cast time, cooldown, and delivery-specific values such as range, area, duration, projectile speed, tick rate, and knockback.

Required tags represented and queryable: Fire, Projectile, Spell, Melee, Movement, Minion, and DoT.

Reusable delivery components:

1. `melee_arc`
2. `spin`
3. `slam`
4. `projectile`
5. `dash_strike`
6. `ground_dot`
7. `summon`

The public `window.DopamineSkills` API exposes definitions, tags, delivery lookup, damage resolution, ownership, levels, effective scaled stats, unlock thresholds, loadout control, and progression state.

## Skill progression

The player begins with **Heavy Slash Lv 1**. Additional skills become eligible as monster level rises:

| Skill | First eligible monster level |
| --- | ---: |
| Heavy Slash | 1 |
| Firebolt | 2 |
| Whirlwind | 4 |
| Vault Strike | 6 |
| Ground Slam | 8 |
| Scorch Field | 11 |
| Ember Wisp | 14 |

Normal monsters can drop skills, elites have improved odds, bosses guarantee a skill drop when an eligible pool exists, and discovery protection prevents newly eligible skills from being starved indefinitely by duplicate drops.

Monster level controls the level ceiling of drops. Skills support levels 1–20. Duplicate drops build resonance and can upgrade owned skills. Newly discovered late-game skills receive catch-up protection so they do not enter hopelessly behind the existing loadout.

Skill levels can improve damage, cooldown, area, range, duration, projectile speed, tick rate, crit behavior, and other delivery-specific values.

## Masteries and level-20 capstones

Each current skill has visible level 5 / 10 / 20 mastery milestones:

- **Heavy Slash:** Cleave → Execution → **Ravager** cleave-wave capstone.
- **Firebolt:** Ignite → Ember Splash → **Solar Fork** extra-ember capstone.
- **Whirlwind:** Momentum → Bloodwind sustain → **Tempest** cyclone-pulse capstone.
- **Vault Strike:** Impact → Second Wind → **Meteor Step** landing-nova capstone.
- **Ground Slam:** Stagger → Aftershock → **Fault Line** delayed second-quake capstone.
- **Scorch Field:** Heat → Cinder Grip → **Wildfire** heat-leap capstone.
- **Ember Wisp:** Chain Ember → Warmth → **Twin Spark** multi-chain/sustain capstone.

Masteries receive stronger combat feedback so the behavioral breakpoint is visible rather than merely numerical.

## Final v1.3 signoff improvements

The final pass added the complete 30-point polish/signoff set:

1. World-visible skill-drop pickup moment.
2. Rarity/high-roll presentation tiers.
3. Tuned early/mid/late drop pacing.
4. Newly eligible discovery protection.
5. Boss smart-drop bias toward useful discoveries.
6. Late-skill catch-up protection.
7. Current-versus-drop comparison UI.
8. Upgrade-delta highlighting.
9. Mastery preview tracks.
10. A level-20 capstone for every current skill.
11. Stronger mastery VFX.
12. Delivery-family audio/VFX identity.
13. Radial cooldown readability.
14. Visible cast-time progress.
15. Drag/swap priority slots.
16. Tap skill → tap slot editing.
17. Immediate loadout confirmation/HUD synchronization.
18. Ownership-aware melee/ranged/control/summon presets.
19. Bad-composition warnings.
20. Brain-aware descriptions explaining when a skill is used.
21. Skill cast/damage usage statistics.
22. Post-room skill-performance report.
23. Underused-skill warnings.
24. Overlapping-role warnings.
25. Recent drop-history panel.
26. Collection completion / next-discovery view.
27. Versioned v13 save metadata with v12 backup/migration protection.
28. Three independent one-hour progression soaks.
29. Six-archetype build-diversity gate.
30. A deterministic 30-minute fresh-account progression benchmark.

## Loadout and Brain integration

The Skill Arsenal has three explicit Priority 1–3 slots. Locked skills cannot be equipped. Re-equipping an already slotted skill swaps it rather than duplicating it. New discoveries fill empty slots when appropriate. Drag/drop and tap-to-slot editing are both supported.

Brain dropdowns show owned skills and remain synchronized with the Arsenal. Ownership-aware presets can create sensible melee, ranged, control, or summon loadouts from the current collection. Build warnings call out empty slots, severe cooldown coverage issues, duplicate role pressure, and missing frequent single-target pressure.

Projectile readiness requires line of sight so ranged skills do not repeatedly waste scheduler opportunities firing through terrain. Goal 02 remains responsible for targeting, pursuit, retreat, cover, danger forecasting, anti-stuck behavior, target locking, adaptive pursuit, starvation protection, and combo scheduling.

## Reward/readability polish

Skill drops now produce an arena-space pickup moment before collecting into the progression UI. Drop presentation distinguishes normal, rare, epic, and god-roll outcomes. Upgrade feedback compares current and resulting level-scaled stats. The Arsenal exposes recent drop history, collection progress, Brain behavior hints, masteries, and per-skill usage statistics.

Combat HUD skill cards receive cooldown radial feedback and cast-time actions display a visible cast bar. Delivery families also receive distinct lightweight VFX/audio cues.

## Verified fresh-account pacing

The final deterministic 30-minute fresh-account benchmark on the public production build:

- 1,800.0 simulated seconds
- 51,429 simulation steps
- 118 rooms
- 0 stalls
- first new skill: 137.7s
- four skills owned: 426.3s
- first level-5 mastery: 580.6s
- all seven skills discovered: 1008.9s
- first high-roll reward: 86.0s
- longest measured drop dry streak: 86.0s
- discovery timing: Slash 0s, Firebolt 138s, Whirlwind 266s, Vault Strike 426s, Ground Slam 581s, Scorch Field 769s, Ember Wisp 1009s

## Build-diversity verification

Six representative three-skill archetypes were tested through 24 rooms each. Every build recorded wins, every equipped skill was actually cast, and no build stalled:

- melee: Heavy Slash / Whirlwind / Ground Slam
- ranged: Firebolt / Ember Wisp / Vault Strike
- control: Scorch Field / Ground Slam / Firebolt
- summon: Ember Wisp / Scorch Field / Vault Strike
- movement: Vault Strike / Heavy Slash / Firebolt
- mixed: Heavy Slash / Scorch Field / Ember Wisp

## Long-form soak verification

Three independent one-hour progression seeds were run on the public Vercel build:

- total simulated time: **10,800.1 seconds**
- total simulation steps: **308,574**
- genuine stalls: **0**
- all three runs unlocked every skill and achieved full cast coverage
- drop totals: 823 / 843 / 879
- upgrade totals: 51 / 45 / 48
- maximum skill levels reached: 16 / 16 / 19
- all-skill unlock-time spread: 238.8 seconds
- pacing-consistency gate: pass

A separate public one-hour skill soak also passed with 3,600.0 seconds, 102,858 steps, 347 rooms, 210 wins, 136 losses, 869 drops, 46 upgrades, max skill level 16, all skills cast, and 0 stalls.

Public production evidence: https://github.com/DCardimen/Dopamine/issues/4#issuecomment-5384136712

## Deployment

Production deployment: `dpl_D81JrinHjj8vyHesUPh54E7MaPkV`

Runtime pins:

- Goal 02 v1.2 baseline: `f8835df56101a93e4d87fa498d17cee228fe292e`
- Goal 03 v1.3 tested runtime stack: `8b50476ded1ed25a57d71173ae586e2c4408921e`

The Vercel shell loads both from exact Git commits through jsDelivr, preserving deterministic rollback.

## Implementation files

- `goal3/skills.js` — data-driven definitions, delivery components, Brain bridge
- `goal3/legacy-compat.js` — Goal 02 compatibility hooks
- `goal3/runtime-fixes.js` — scheduler/line-of-sight compatibility
- `goal3/progression.js` — ownership, drops, levels, mastery runtime, Arsenal
- `goal3/brain-sync.js` — owned-skill Brain synchronization
- `goal3/polish.js` — v1.2 reward/mastery polish
- `goal3/signoff.js` — v1.3 reward UX, level-20 capstones, stats, loadout/readability polish
- `goal3/signoff-fixes.js` — final discovery-protection and Arsenal integration fixes
- `goal3/progression-quality.js` — progression tests
- `goal3/quality-v2.js` — DOM loadout and one-hour soak tests
- `goal3/signoff-quality.js` — final UI, fresh-account, diversity, and multi-seed gates

## Handoff

Goal 03 is signed off. Its engine, progression, reward/readability, loadout, persistence, fresh-account pacing, build diversity, long-form stability, and public-production behavior are all covered by passing automated/browser gates. Goal 04 can now focus on expanding the catalog toward 30 exceptionally distinct skills rather than repairing the underlying skill system.
