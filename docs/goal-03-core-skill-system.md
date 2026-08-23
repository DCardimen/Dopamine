# Goal 03 — Create the Core Skill System

## Status

**IN PROGRESS — v1.0 architecture slice is implemented.**

Goal 03 begins from the verified Goal 02 v1.2 combat/brain baseline. Goal 02 issue #3 remains open because its final human feel gates were intentionally not waived.

## Objective

Turn skills from hard-coded combat branches into reusable data-driven recipes. A later content pass should be able to create many genuinely different skills by combining a compact set of shared delivery mechanics and tags rather than adding bespoke scheduler/combat code for every ability.

## v1.0 system

Each skill definition explicitly carries:

- stable skill id and player-facing name
- tags
- delivery component
- base damage
- damage effectiveness
- cast time
- cooldown
- delivery-specific values such as range, area, duration, projectile speed, tick rate, and knockback
- small Brain-facing metadata such as single-target, AoE, or utility behavior

Required tag coverage in this milestone:

- Fire
- Projectile
- Spell
- Melee
- Movement
- Minion
- DoT

Reusable delivery components in v1.0:

1. `melee_arc` — immediate targeted melee hit
2. `spin` — channeled/ticking player-centered AoE
3. `slam` — delayed player-centered nova
4. `projectile` — travel-time player projectile
5. `dash_strike` — movement plus impact
6. `ground_dot` — persistent ground damage zone
7. `summon` — temporary autonomous minion attacker

## Architecture probes

The v1.0 prototype catalog is intentionally small:

| Skill | Tags | Delivery | Purpose |
| --- | --- | --- | --- |
| Heavy Slash | Melee | melee arc | preserves legacy single-target baseline |
| Whirlwind | Melee | spin | preserves legacy ticking AoE baseline |
| Ground Slam | Melee | delayed nova | preserves legacy delayed AoE baseline |
| Firebolt | Fire, Projectile, Spell | projectile | validates travel-time ranged spell behavior |
| Vault Strike | Melee, Movement | movement strike | validates skill-driven repositioning |
| Scorch Field | Fire, Spell, DoT | ground DoT | validates persistent damage zones |
| Ember Wisp | Fire, Spell, Minion | summon | validates autonomous temporary actors |

These are architecture probes, not the full skill catalog. Goal 04 owns the expansion toward 30 exceptionally distinct skills.

## Goal 02 integration

The Goal 02 Brain remains responsible for targeting, pursuit, retreat, cover, danger forecasting, anti-stuck behavior, target lock, adaptive pursuit, starvation protection, and combo scheduling.

Goal 03 replaces the hard-coded skill layer under that Brain:

- `skillState()` now resolves readiness through skill definitions and Brain metadata.
- `castSkill()` dispatches through reusable delivery components.
- the scheduler accepts data-driven skill ids.
- Whirlwind and Ground Slam active damage ticks now read the skill definitions instead of retaining hidden damage constants in `combat.js`.
- the three combat HUD cards display the current top-three Brain skill priorities.
- room results report the active core-skill loadout.

## Skill Lab

Goal 03 adds a compact **SKILLS** panel alongside the Brain editor. It exposes every architecture-probe skill, its tags, delivery type, base damage/effectiveness, cast time, and cooldown, and lets the player assign the skill to Brain priority 1–3.

The editor is intentionally not a loot, leveling, gem, passive-tree, or permanent-progression system.

## Automated gate

`?goal3test=1` runs the Goal 03 architecture self-test and checks:

- every definition passes the required schema
- all seven required tags exist in the catalog
- all seven delivery components are registered
- base damage, effectiveness, and cast time are separate numeric fields
- melee, projectile, movement strike, ground DoT, minion, spin, and slam components can all execute against the combat runtime
- runtime error collection is empty

Expected output begins with:

`GOAL3_TEST_OK=true`

## Deployment strategy

The production playtest has historically been a tiny Vercel shell that loads a combat build pinned to a tested GitHub commit. Goal 03 keeps that same rollback-friendly strategy: Goal 02 v1.2 remains the immutable combat baseline and Goal 03 is layered on as a pinned skill-runtime patch.

This prevents Goal 03 work from silently mutating the verified Goal 02 handoff.

## Exit gate

Goal 03 is not complete until all of the following are true:

- [ ] deployed browser self-test returns `GOAL3_TEST_OK=true`
- [ ] all delivery components execute without runtime errors
- [ ] required tags are represented and queryable
- [ ] legacy Slash / Whirlwind / Ground Slam behavior remains stable
- [ ] projectile / movement / DoT / minion mechanics are visually and behaviorally distinct
- [ ] Brain priority editing works with the expanded skill ids
- [ ] repeated mobile Skill Lab editing is comfortable
- [ ] human-facing core skill-system quality reaches 9/10+

## Current implementation

- `goal3/skills.js` — data-driven definitions, component runtime, Brain bridge, Skill Lab, Goal 03 self-test
- `goal3/index.html` — repository-local isolated Goal 03 shell
- Goal 03 implementation commit: `f0012e1f7ddd5aa51810cb4bbf233f709541b509`
- verified Goal 02 combat baseline: `f8835df56101a93e4d87fa498d17cee228fe292e`
