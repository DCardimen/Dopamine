# Goal 01 — Nail the 30-Second Combat Loop

## Purpose

This milestone tests the naked combat toy before progression systems can hide weaknesses.

The question is not whether the prototype has enough content. The question is:

> After a room ends, do you instinctively want to press **Next Wave**?

## Included

- Vanguard auto-combat hero
- Heavy Slash basic attack
- Whirlwind density skill
- Ground Slam burst/knockback skill
- Rotling swarm enemy
- Boneguard tank enemy
- Cultist Archer ranged pressure
- Exploder priority threat
- Necromancer support/resurrection threat
- Frenzied Boneguard elite
- Goremaw miniboss
- Seven hand-authored encounters
- Threat-weighted target selection
- Melee/ranged positioning
- Skill cooldown display
- Hit flash, knockback, overkill launch, tracers, impact rings, damage numbers
- Post-wave duration, damage, kills, damage-taken, and skill-share report
- 1x / 2x / 3x simulation speed
- Instant next/restart flow

## Controls

The game itself is automatic.

- `1` — 1x simulation speed
- `2` — 2x simulation speed
- `3` — 3x simulation speed
- `Space` — next wave / restart after defeat

## Seven test encounters

1. **Swarm Test** — 12 Rotlings. Tests whether AoE and deaths are satisfying.
2. **Frontline** — 8 Rotlings + 3 Boneguards. Tests AoE into cleanup.
3. **Ranged Pressure** — 10 Rotlings + 4 Archers. Tests autonomous movement.
4. **Threat Priority** — 8 Rotlings + 2 Boneguards + 3 Exploders. Tests urgent target selection.
5. **Support Target** — 10 Rotlings + 2 Boneguards + 2 Archers + Necromancer. Tests whether support enemies visibly change the fight.
6. **Elite Check** — 8 Rotlings + Frenzied Boneguard. Tests attention shift and escalating threat.
7. **Goremaw** — boss-only encounter with large telegraphed cleave/rupture attacks.

## Vanguard decision order

The Goal 01 AI is intentionally simple:

1. Pick a target using distance plus threat weighting.
2. Exploders receive the highest target bonus.
3. Necromancers receive the second-highest target bonus.
4. Use Ground Slam when at least four enemies are inside Slam radius.
5. Otherwise use Whirlwind when at least three enemies are inside Whirlwind radius.
6. Otherwise Heavy Slash when the target is in range.
7. Otherwise move toward the target.

Goal 02 will replace this hard-coded policy with player-configurable combat behavior.

## Skill rhythm targets

### Heavy Slash

- 35–45 physical damage
- 0.80 sec attack period
- 5% crit chance
- 175% crit multiplier
- Short knockback; stronger on crit

### Whirlwind

- 5 sec cooldown
- 1.5 sec duration
- 30 damage per 0.25 sec tick
- 94 px radius
- 70% movement speed while active
- Light inward pull to keep packs visually coherent

### Ground Slam

- 7 sec cooldown
- 0.55 sec telegraphed windup
- 175 damage
- 150 px radius
- Heavy knockback and expanding impact ring

## Acceptance tests

Do not move to Goal 02 just because every feature below exists. Goal 01 passes only when repeated runs remain satisfying.

1. A normal pack produces its first kill within roughly 3 seconds.
2. There is rarely more than 3 seconds without an interesting combat event.
3. Heavy Slash, Whirlwind, and Ground Slam are visually distinguishable without reading the HUD.
4. The player can identify Archers, Exploders, Necromancers, elites, and the boss by behavior and silhouette/color.
5. Exploders create visible urgency.
6. Leaving a Necromancer alive noticeably worsens the encounter.
7. Whirlwind feels better against density than against one target.
8. Ground Slam feels like an event rather than another damage tick.
9. The Frenzied Boneguard becomes visibly more dangerous as health falls.
10. Goremaw's large attacks are readable before damage lands.
11. 2x and 3x speeds remain readable enough to understand why the character wins or dies.
12. Wave completion to the next decision takes less than a second of interaction.
13. Post-wave damage share makes skill performance obvious.
14. A defeat can be immediately restarted.
15. Most importantly: after Wave 7, replaying from Wave 1 sounds appealing rather than obligatory.

## Deliberately excluded

- Inventory
- Gear
- Loot generation
- XP or levels
- Passive tree
- Skill supports/evolutions
- Character classes
- Crafting
- Procedural maps
- Story/quests
- Towns
- Permanent progression

Those systems begin only after the combat toy is worth building around.

## Graybox rule

No final art should be commissioned to solve a gameplay-readability problem during this milestone. Primitive shapes, color, timing, spacing, movement, and feedback must make the combat understandable first.
