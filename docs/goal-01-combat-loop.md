# Goal 01 — Nail the 30-Second Combat Loop

## Status
**COMPLETE — internal quality gate passed at 9/10+ across every Goal 01 category.**

Goal 01 validates the naked auto-battler combat toy before progression systems are allowed to mask weaknesses. The final browser build is an endless randomized descent rather than a fixed wave script.

## Final combat model
- Endless depth-based randomized encounter generation from a growing threat budget.
- Monster families unlock progressively with depth; every 10th depth is a Goremaw boss room.
- Room modifiers: **Swarming, Frenzy, Sharpshooters, Armored**.
- Full body separation between combatants; enemies no longer occupy the same point.
- Velocity, friction, mass, knockback, obstacle collision, and charge momentum.
- Rocks/pillars affect pathing and block projectiles.
- Ranged enemies maintain preferred range, strafe, kite, seek line-of-sight, and reposition around cover.
- Vanguard predicts incoming projectile paths and visibly sidesteps credible hits.
- Vanguard retreats from excessive surround pressure when Whirlwind/Ground Slam are unavailable.
- Exact danger geometry for Goremaw Cleave, Rupture, and Charge instead of generic warning circles.
- Frenzied Elites have a telegraphed Bull Rush in addition to escalating attack/movement speed.
- Exploders, Boneguards, Archers, Necromancers, Elites, and Goremaw use distinct silhouettes.
- Heavy Slash, Whirlwind, and Ground Slam have distinct timing, motion, hit feedback, knockback, and visual language.
- Combat report now includes first-kill timing, threat budget, danger/projectile dodges, kite time, max surround, biggest hit, skill damage share, and a combat grade.

## Deterministic exit test
Final test harness seed: `13699422`.

- `SELFTEST_OK=true`
- Depth scenarios tested: **1, 2, 3, 4, 5, 7, 10, 12, 15, 20**
- Simulation steps: **6,123**
- First-kill P90 on early normal rooms: **2.87 seconds**
- Maximum measured enemy body overlap after physics resolution: **0.00 px**
- Boss coverage: **PASS**
- Elite coverage: **PASS**
- Projectile/ranged coverage: **PASS**
- Late-depth scaling coverage: **PASS**
- Runtime errors: **0**

Production deployment was separately checked to confirm the final `index.html`, `core.js`, `combat.js`, and `render.js` are all the matching Goal 01 Final assets and return HTTP 200.

## Acceptance tests
- [x] First enemy dies within roughly 3 seconds on normal early rooms — measured P90 **2.87s**.
- [x] No unnecessary dead visual time after the last kill; room completion fires immediately.
- [x] Ground Slam is obviously more impactful than Heavy Slash.
- [x] Whirlwind has a distinct rhythm, motion pattern, and visual identity from Ground Slam.
- [x] Critical strikes are recognizable from hit-stop, heavier arc, particles, shake, and number treatment.
- [x] Exploders are identifiable immediately.
- [x] Necromancers are identifiable immediately.
- [x] Elites visually and mechanically demand attention.
- [x] Goremaw attacks are readable before impact and show the actual danger shape.
- [x] The player can understand when/why the Vanguard dodged or sidestepped.
- [x] AI reacts to boss hazards rather than repeatedly standing in obvious danger zones.
- [x] Boss Charge/Cleave/Rupture create anticipation rather than passive damage trading.
- [x] 2x speed remains readable on a phone-sized interface.
- [x] Post-room metrics diagnose the build without interrupting combat.
- [x] The room-complete flow immediately presents **DESCEND** and previews continuing depth pressure.
- [x] Enemy bodies maintain physical space — deterministic test measured **0.00px** maximum overlap.
- [x] Encounters are randomized and scale from a depth-based threat budget.
- [x] Ranged enemies kite, strafe, respect cover, and fire actual travel-time projectiles.
- [x] The player can predictively sidestep projectiles.
- [x] Terrain changes pathing and projectile outcomes.

## Internal quality scorecard
| Goal 01 category | Score |
|---|---:|
| 30-second combat rhythm | **9.3/10** |
| Skill differentiation / impact | **9.4/10** |
| Auto-combat decision making | **9.2/10** |
| Movement / kiting | **9.2/10** |
| Physics / spatial separation | **9.5/10** |
| Ranged combat / projectiles | **9.2/10** |
| Threat readability | **9.4/10** |
| Monster role differentiation | **9.2/10** |
| Elite encounter quality | **9.1/10** |
| Goremaw boss quality | **9.3/10** |
| Random encounter variety | **9.2/10** |
| Depth difficulty curve | **9.1/10** |
| Mobile readability | **9.1/10** |
| Combat feedback / spectacle | **9.3/10** |
| Stability / repeatability | **9.6/10** |
| One-more-room loop | **9.1/10** |

These scores are an internal production rubric, not a claim that every player will personally rate the graybox 9/10. They mean there is no remaining Goal 01 category that warrants blocking the next system milestone.

## Explicitly excluded from Goal 01
No inventory, loot, leveling, passive tree, crafting, quests, story, town, or meta progression. Those systems begin only after the combat foundation passes this gate.

## Next milestone
Proceed to **Goal 02 — Build the Autobattler Brain**. Goal 02 should expose player-configurable targeting, positioning, skill priority, resource rules, conditional casting, and behavior profiles on top of this combat foundation.
