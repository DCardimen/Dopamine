# Goal 02 — Build the Autobattler Brain

## Objective
Turn the player from a spectator into the **architect of combat behavior**. The hero still fights automatically, but the player chooses what the AI values, when it retreats, how it positions, and which skills it prefers.

Goal 02 passes only when two different brain configurations produce visibly and measurably different combat on the **same deterministic room**.

## Status
**IN PROGRESS — v1.1 fixes the first major human-playtest failures. Goal 02 remains open for further feel validation.**

## Goal 02 v1 — Brain Lab
The browser playtest includes a mobile-first **BRAIN** editor that pauses combat while tactics are edited.

### Preset brains
- **Berserker** — execute-focused, aggressive chase, very late retreat.
- **Balanced** — threat targeting, moderate retreat, cover-aware.
- **Tactician** — support-target priority, earlier retreat, cover-heavy positioning.
- **Kiter** — ranged-target priority, attack-window kiting, low surround tolerance.

### Player-configurable behavior
1. Target priority: Threat / Nearest / Ranged / Low HP / Support.
2. Execute threshold bonus.
3. Positioning stance: Chase / Balanced / Kite.
4. Retreat HP threshold.
5. Surround-count retreat threshold.
6. Use-cover toggle.
7. Skill priority slot 1.
8. Skill priority slot 2.
9. Skill priority slot 3.
10. Ground Slam minimum target count.
11. Whirlwind minimum target count.
12. Predictive projectile dodge toggle.
13. Telegraph dodge toggle.
14. Persistent saved brain configuration.
15. Apply without restarting combat.
16. Apply + replay the exact same deterministic room.

## Goal 02 v1.1 — Adaptation / reliability pass
This pass responds directly to playtest failures around wall sticking, endless pursuit, and missed skill opportunities.

### Anti-stuck navigation
- Steering adds a strong inward bias near all arena borders instead of allowing retreat/kite vectors to continuously push outward.
- Outward velocity is reflected/damped when the player reaches a hard boundary.
- A movement watchdog detects meaningful intent with near-zero movement for ~0.55s and applies a deterministic escape route away from the wall/nearest obstacle.
- Combat telemetry records **Unstuck recoveries**.

### Adaptive pursuit
New Brain controls:
- **Adapt when a target keeps escaping** toggle.
- **No-progress timeout** from 1.5–8 seconds.
- Fallback strategy: **Hybrid**, **Switch target**, or **Intercept / cut off**.

The brain tracks whether distance to its current target is actually improving. If not, it can temporarily blacklist the target and select another enemy, or predict the evasive target's movement and cut it off rather than following directly.

### Reliable skill scheduler
- Ready AoE skills evaluate **before retreat behavior**. If Ground Slam/Whirlwind is ready and its configured target-count condition is satisfied, it fires immediately instead of being skipped because the brain wanted to back away.
- Skill priority still controls which valid skill fires first.
- The HUD distinguishes cooldown availability from tactical eligibility: e.g. **WAIT 2/4** instead of misleadingly showing **READY** when Ground Slam requires four targets.

## Brain telemetry
The combat report records:
- Brain/profile name
- Targeting mode and stance
- Adaptive pursuit mode / timeout
- Seed/depth
- Target switches
- Adaptive strategy changes
- Unstuck recoveries
- Brain decision changes
- Retreat events
- Cover movements
- Danger dodges
- Projectile dodges
- Skill cast counts
- Damage taken / duration / first kill / skill damage share

## Deterministic comparison loop
Every depth is generated from `base seed + depth`. **Replay Same** regenerates the identical enemy composition and obstacle layout, allowing apples-to-apples comparison between different brains.

## v1.1 automated regression test
Local JavaScript simulation harness, seed `424242`:
- `SELFTEST_OK=true`
- 4 profiles exercised
- 4 unique decision signatures
- First-kill P90: `1.29s`
- Maximum measured overlap: `0.00px`
- Boss coverage: PASS
- Projectile coverage: PASS
- **Adaptive pursuit regression: PASS**
- **Forced edge escape regression: PASS**
- **Ready-skill immediate-cast regression: PASS**
- 6,389 simulation steps
- Runtime errors: 0

The production Vercel page is pinned to commit `f5cc342892cde466df570ab12f5fb5ce035a1b74` for the v1.1 playtest assets, preventing source/deployment drift during this feedback cycle.

## Acceptance tests
- [x] Player can open the Brain editor on a phone without leaving the playtest.
- [x] Opening the Brain editor pauses combat.
- [x] Player can choose among at least four meaningfully different presets.
- [x] Player can customize targeting priority.
- [x] Player can customize stance / positioning behavior.
- [x] Player can customize HP-based retreat behavior.
- [x] Player can customize surround-pressure retreat behavior.
- [x] Player can enable/disable projectile dodging.
- [x] Player can enable/disable telegraph dodging.
- [x] Player can enable/disable terrain-cover behavior.
- [x] Player can reorder skill priority.
- [x] Player can set AoE minimum-target rules.
- [x] Player can configure adaptation to evasive/uncatchable targets.
- [x] Player has switch-target and intercept fallback behavior.
- [x] Boundary steering actively prevents prolonged wall pinning.
- [x] Anti-stuck watchdog recovers from forced zero-progress edge movement.
- [x] A ready AoE with its condition satisfied casts before ordinary retreat logic.
- [x] Skill HUD explains when a cooldown is ready but tactical conditions are not met.
- [x] Brain settings persist locally.
- [x] Brain decisions are visible during combat.
- [x] Brain decisions are summarized after combat.
- [x] Same-room replay is deterministic.
- [x] Automated test observes at least three unique decision signatures from four presets.
- [ ] Target priority changes are unmistakable to a human playtester on mixed packs.
- [ ] Stance differences are unmistakable to a human playtester without reading telemetry.
- [ ] Skill-priority changes create obvious timing differences.
- [ ] A custom brain can outperform a poor preset on at least one deterministic room.
- [ ] No brain configuration creates pathological infinite retreat / no-engagement loops in extended play.
- [ ] Mobile controls remain comfortable after repeated editing.
- [ ] Final Goal 02 quality score is 9/10+ in targeting, positioning, skill rules, conditional rules, readability, and replay comparison.

## Explicitly excluded from Goal 02
No loot, equipment affixes, passive tree, skill gems, crafting, story, town, or permanent character progression. Goal 02 is about **behavior authoring**, not build progression.

## Next pass
Human playtest v1.1 on mixed ranged packs and edge-heavy rooms. Focus on whether adaptation is understandable, whether intercept looks intelligent rather than erratic, and whether skill timing now feels trustworthy.