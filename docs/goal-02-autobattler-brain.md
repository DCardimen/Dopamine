# Goal 02 — Build the Autobattler Brain

## Objective
Turn the player from a spectator into the **architect of combat behavior**. The hero still fights automatically, but the player chooses what the AI values, when it retreats, how it positions, and which skills it prefers.

Goal 02 passes only when two different brain configurations produce visibly and measurably different combat on the **same deterministic room**.

## Goal 02 v1 — Brain Lab
The browser playtest now includes a mobile-first **BRAIN** editor that pauses combat while tactics are edited.

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

## Brain telemetry
The combat report now records:
- Brain/profile name
- Targeting mode and stance
- Seed/depth
- Target switches
- Brain decision changes
- Retreat events
- Cover movements
- Danger dodges
- Projectile dodges
- Skill cast counts
- Damage taken / duration / first kill / skill damage share

## Deterministic comparison loop
Every depth is generated from `base seed + depth`. **Replay Same** regenerates the identical enemy composition and obstacle layout, allowing apples-to-apples comparison between different brains.

## Initial automated test
Local mobile Chromium harness, seed `424242`:
- `SELFTEST_OK=true`
- 4 behavior profiles exercised
- 4 unique decision signatures
- First-kill P90: `0.91s`
- Maximum measured overlap: `1.17px`
- Boss behavior covered
- Projectile behavior covered
- 4,179 simulation steps
- Runtime/page errors: 0

Example signatures from the test harness:
- Berserker: high target switching, almost no retreat
- Balanced: moderate retreat and cover use
- Tactician: early survival behavior
- Kiter: cover-heavy / spacing-heavy behavior

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
- [x] Brain settings persist locally.
- [x] Brain decisions are visible during combat.
- [x] Brain decisions are summarized after combat.
- [x] Same-room replay is deterministic.
- [x] Automated test observes at least three unique decision signatures from four presets.
- [ ] Target priority changes are unmistakable to a human playtester on mixed packs.
- [ ] Stance differences are unmistakable to a human playtester without reading telemetry.
- [ ] Skill-priority changes create obvious timing differences.
- [ ] A custom brain can outperform a poor preset on at least one deterministic room.
- [ ] No brain configuration creates pathological infinite retreat / no-engagement loops.
- [ ] Mobile controls remain comfortable after repeated editing.
- [ ] Final Goal 02 quality score is 9/10+ in targeting, positioning, skill rules, conditional rules, readability, and replay comparison.

## Explicitly excluded from Goal 02
No loot, equipment affixes, passive tree, skill gems, crafting, story, town, or permanent character progression. Goal 02 is about **behavior authoring**, not build progression.

## Next pass
Playtest the four presets and custom rules on identical rooms, then tighten target switching, hysteresis, skill-rule clarity, and any retreat loops before closing Goal 02.