# Goal 03 — Create the Core Skill System

## Status

**Goal 03 v1.2 is live and machine-verified.**

Goal 03 remains layered on the verified Goal 02 v1.2 combat/Brain baseline. Goal 02 issue #3 remains open for its separate human feel gates.

Public build: https://dopamine-playtest.vercel.app/?v=goal3-12

## Objective

Turn skills from hard-coded combat branches into reusable data-driven recipes, then make that foundation feel like a progression system rather than a developer sandbox. Goal 04 can now expand the catalog without re-inventing delivery, leveling, loadout, or drop plumbing for each new skill.

## Core architecture

Every skill carries explicit data for its stable id, player-facing name, tags, delivery component, base damage, damage effectiveness, cast time, cooldown, and delivery-specific values such as range, area, duration, projectile speed, tick rate, and knockback.

Required tags represented and queryable: Fire, Projectile, Spell, Melee, Movement, Minion, and DoT.

Reusable delivery components:

1. `melee_arc`
2. `spin`
3. `slam`
4. `projectile`
5. `dash_strike`
6. `ground_dot`
7. `summon`

The public `window.DopamineSkills` API exposes definitions, tags, delivery lookup, damage resolution, owned skills, levels, effective scaled stats, unlock thresholds, loadout control, and progression state.

## v1.2 progression

The player now begins with only **Heavy Slash Lv 1**. Skills unlock gradually through monster drops rather than being handed to the player at boot.

Current discovery thresholds:

| Skill | First eligible monster level |
| --- | ---: |
| Heavy Slash | 1 |
| Firebolt | 2 |
| Whirlwind | 4 |
| Vault Strike | 6 |
| Ground Slam | 8 |
| Scorch Field | 11 |
| Ember Wisp | 14 |

Normal monsters can drop skills, elites have substantially higher drop odds, bosses guarantee a skill drop, and a pity rule prevents long dry streaks while an eligible skill remains undiscovered.

Dropped skills have levels. Monster level controls the level ceiling of drops, with elites and bosses receiving better rolls. Skills currently support levels 1–20. Duplicate drops build resonance; three same-or-lower duplicates can raise a skill by one level up to the level supported by the monsters being fought.

Skill levels improve more than raw damage: cooldown, area, range, duration, projectile speed, tick rate, and crit-related values can scale where relevant.

## Mastery breakpoints

Level milestones add behavioral changes so a high-level skill is not merely a larger number:

- **Heavy Slash:** cleave, execute, stronger late mastery.
- **Firebolt:** ignite, ember splash, stronger burn/splash.
- **Whirlwind:** momentum damage ramp and sustain.
- **Vault Strike:** long-distance empowered impact and recovery.
- **Ground Slam:** stagger/slow and an aftershock.
- **Scorch Field:** heat stacks and slowing control.
- **Ember Wisp:** chain ember and level-10 sustain.

## Loadout repair

The old Skill Lab could change priorities internally but gave weak feedback and allowed awkward duplicate-slot states. v1.2 replaces that interaction with a real three-slot Skill Arsenal:

- three explicit Priority 1–3 slots
- locked skills cannot be equipped
- moving an already-equipped skill swaps rather than duplicates it
- newly discovered skills auto-fill the first empty slot
- selected buttons stay visibly highlighted
- Brain dropdowns only show owned skills and stay synchronized with the Arsenal
- loadout and progression persist separately
- the combat HUD displays the equipped skill and its level

The browser gate does not merely call the loadout API. It clicks the actual Skill Arsenal DOM control and verifies the resulting Brain selection.

## Drop feedback

v1.2 adds a progression chip, recent-drop feed, and prominent skill-drop banner. The banner includes the dropped skill level and source monster level so higher-level drops are legible as rewards.

## Brain/combat integration

Goal 02 remains responsible for targeting, pursuit, retreat, cover, danger forecasting, anti-stuck behavior, target lock, adaptive pursuit, starvation protection, and combo scheduling.

Goal 03 now handles skill recipes, cast dispatch, level-scaled skill values, progression ownership, loadout legality, drops, mastery effects, and skill UI. Projectile readiness additionally requires line of sight so a ranged skill does not repeatedly consume scheduler opportunities through terrain.

Legacy Slash visual/stat hooks are retained through `legacy-compat.js` while the player-facing name remains Heavy Slash.

## Quality gates

Goal 03 v1.2 has dedicated Chrome gates for:

- schema and delivery-component execution
- required tag coverage
- separated base damage / effectiveness / cast-time semantics
- progression ownership and monster-level gating
- skill-drop unlocks and level scaling
- actual DOM-click loadout selection
- Brain dropdown synchronization
- duplicate-slot prevention
- mobile overflow and touch targets
- Goal 02 regression
- one-hour skill/progression soak
- the same one-hour soak against the public Vercel deployment

Latest verified one-hour result, both local and public Vercel:

- 3,600.0 simulated seconds
- 102,858 simulation steps
- 210 room wins / 136 room losses before the final partial room
- 0 genuine combat stalls
- 1 final room intentionally truncated when the one-hour clock expired
- 869 skill drops
- 46 upgrades
- maximum skill level reached: 16
- every skill unlocked and cast
- no recorded stall diagnostics
- Goal 02 regression: pass

The old soak harness previously reported one “stall” because it counted the final room as stalled whenever the global one-hour clock ended mid-fight. The v1.2 gate corrects that classification without changing the real stall threshold: a room must remain genuinely active for the full 2,600-step / roughly 91-second per-room cap to count as a stall.

## Deployment

Production deployment: `dpl_2cF6BxM8USHHaQ1xMgVr4KLi6tmZ`

Runtime pins:

- Goal 02 v1.2 baseline: `f8835df56101a93e4d87fa498d17cee228fe292e`
- Goal 03 v1.2 runtime stack: `7bfc3dc1445d61234fe099f1261c55178fe1ae57`

The production Vercel shell loads both from exact Git commits through jsDelivr, preserving deterministic rollback.

## Implementation files

- `goal3/skills.js` — definitions, delivery components, Brain bridge, Skill Lab
- `goal3/legacy-compat.js` — Goal 02 compatibility hooks
- `goal3/runtime-fixes.js` — scheduler/line-of-sight compatibility fix
- `goal3/progression.js` — ownership, drops, levels, mastery behavior, Skill Arsenal
- `goal3/brain-sync.js` — owned-skill Brain dropdown synchronization
- `goal3/polish.js` — reward presentation and final mastery polish
- `goal3/progression-quality.js` — focused progression tests
- `goal3/quality-v2.js` — DOM loadout test and corrected one-hour soak

## Handoff

The automated and deployed gates are green. The remaining meaningful check is subjective player feel: whether the unlock cadence, drop frequency, level growth, and mastery rewards feel exciting enough in hand. Those can be tuned without changing the Goal 03 architecture.
