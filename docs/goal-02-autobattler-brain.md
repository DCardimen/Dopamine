# Goal 02 — Build the Autobattler Brain

## Objective
Turn the player from a spectator into the **architect of combat behavior**. The hero still fights automatically, but the player chooses what the AI values, when it retreats, how it positions, how it reacts when a plan fails, and which skills it prefers.

Goal 02 passes only when different brain configurations produce visibly and measurably different combat on the **same deterministic room**.

## Status
**IN PROGRESS — v1.2 passed a one-hour-equivalent stability/behavior soak and ten automated feature gates. Human feel validation remains before Goal 02 is closed.**

## Core Brain Lab
The mobile-first **BRAIN** editor pauses combat while tactics are edited and provides four starting profiles:
- **Berserker** — aggressive chase, execute focus, late retreat.
- **Balanced** — threat targeting, moderate survival behavior.
- **Tactician** — support priority, higher danger awareness, deliberate spacing.
- **Kiter** — ranged priority, early spacing and evasive behavior.

Every room is deterministic from seed + depth. **REPLAY SAME** rebuilds the same enemies and terrain so two brains can be compared apples-to-apples.

## Goal 02 v1.2 — One-hour quality pass
The exact combat logic was run for **3,600.0 simulated seconds** across randomized depths and all four profiles. Earlier soak iterations exposed wall pressure, cover loops, ranged stalemates, and over-safe survival behavior; those failures were fixed rather than weakening the gate.

### Ten major improvements
1. **Potential-field navigation + stronger anti-stuck**
   - Arena borders push movement inward before hard collision.
   - Obstacles steer the player around their perimeter.
   - A sampled safe-route recovery takes over when meaningful movement intent produces near-zero progress.
   - Physics now uses additional separation cleanup passes.

2. **Target commitment / hysteresis**
   - New **Target Lock** control.
   - The brain stays committed for a configurable window unless a substantially better threat appears.
   - Reduces noisy target swapping and makes targeting rules visually legible.

3. **Escalating adaptive pursuit**
   - Failed pursuit builds frustration memory per monster.
   - Hybrid adaptation can escalate through **intercept → flank → commit pursuit → switch/temporary blacklist**.
   - The brain does not immediately repeat a failed tactic against the same evasive target.

4. **Sampled safe-point planner**
   - Retreat and kiting no longer use a single backwards vector.
   - Candidate positions are scored for melee pressure, projectile paths, telegraphed hazards, edge pressure, obstacles, travel distance, and optional cover.
   - The brain selects the lowest-risk viable point.

5. **Retreat hysteresis / anti-loop behavior**
   - New **Re-engage HP** control separate from Retreat HP.
   - Safe-state and minimum-duration rules prevent flee/attack flicker.
   - Retreat is time-bounded and followed by a brief re-engagement cooldown.
   - Cover use is also bounded by cover windows/cooldowns so the hero cannot orbit terrain forever.

6. **Threat forecasting / danger score**
   - New **Danger Sensitivity**: Low / Medium / High.
   - Live danger score incorporates melee density, ranged line of sight, incoming projectile trajectories, boss/exploder telegraphs, and arena-edge pressure.
   - Current danger is visible in the live Brain ticker.

7. **Skill starvation protection**
   - New **Flexible After** control.
   - If an AoE remains ready too long, its target-count requirement gradually relaxes instead of wasting the cooldown indefinitely.
   - Elite/boss opportunities can override strict density rules earlier.
   - HUD distinguishes ordinary READY, WAIT X/Y, and forced/flexible cast states.

8. **Combo scheduler**
   - New plans: **Adaptive**, **Slam → Whirlwind**, **Whirlwind → Slam**, or **None**.
   - A successful opener creates a short follow-up window with slightly relaxed conditions.
   - Produces intentional combat rhythms instead of three unrelated cooldown checks.

9. **Engagement leash + anti-stalemate escalation**
   - New **Chase Leash** control limits how long one pursuit plan may consume.
   - A global no-meaningful-damage watchdog can force contact even when tiny distance changes falsely look like progress.
   - Long rooms and a lone evasive final enemy trigger a timeboxed **all-in pursuit** state. Ordinary projectile perfection is temporarily deprioritized, while major telegraphs remain respected.

10. **Explainability + faster mobile editing**
   - Brain settings are grouped into collapsible Targeting, Positioning/Survival, Adaptive Pursuit, Skill Logic, and Emergency sections.
   - The current target gets a visible ring.
   - Live ticker shows the current decision and danger level.
   - Post-room **BRAIN INSIGHT** explains likely problems such as target thrashing, wall pressure, excessive retreat, chase-leash triggers, forced AoE casts, and successful combos.

## v1.2 deterministic feature gate
- `SELFTEST_OK=true`
- Maximum measured body overlap: **0.00px**
- Edge vector escape: PASS
- Target lock: PASS
- Adaptive escalation: PASS
- Safe-point planner: PASS
- Retreat hysteresis: PASS
- Danger forecasting: PASS
- Skill starvation guard: PASS
- Combo scheduler: PASS
- Chase leash: PASS
- Explainability/mobile UI: PASS
- Runtime errors: **0**

## One-hour-equivalent soak
Final exact-JavaScript combat-logic soak:
- `SOAK_OK=true`
- Simulated combat: **3,600.0 seconds**
- Combat steps: **102,858**
- Randomized rooms: **226**
- Stalled rooms: **0**
- Runtime errors: **0**
- Maximum measured overlap: **0.00px**
- Wall-pressure time: **0.82%**
- Maximum continuous retreat: **4.45s**
- Unstuck recoveries: **27**
- Adaptive changes: **54**
- Commit-pursuit events: **191**
- Chase-leash breaks: **15**
- Starvation-protected AoE casts: **510**
- Combo follow-ups: **229**
- Maximum room duration: **61.5s**

The soak cycles depths 1–20 without permanent progression, so deep-room win rate is not used as a Goal 02 pass/fail criterion. The relevant gate is that the behavior system does not stall, loop forever, pin to borders, silently waste valid skill opportunities, or crash.

## Production
The v1.2 browser playtest is pinned to GitHub commit `f8835df56101a93e4d87fa498d17cee228fe292e`, preventing source/deployment drift during testing.

## Acceptance tests
- [x] Mobile Brain editor and four presets.
- [x] Target priority and execute rules.
- [x] Target commitment / lock control.
- [x] Positioning stance and cover behavior.
- [x] Retreat HP, re-engage HP, surround threshold, and danger sensitivity.
- [x] Predictive projectile and telegraph reactions.
- [x] Adaptive pursuit with intercept, flank, commit, switch, and frustration memory.
- [x] Chase leash and fight-level anti-stalemate watchdog.
- [x] Skill priority and AoE target-count conditions.
- [x] Skill starvation protection.
- [x] Configurable combo plan.
- [x] Brain settings persist locally.
- [x] Live target/decision/danger readability.
- [x] Post-room Brain Insight + detailed diagnostics.
- [x] Same-room deterministic replay.
- [x] Extended automated soak has no pathological no-engagement stalls.
- [x] Border/wall pinning is bounded in the extended soak.
- [ ] Target-priority differences are unmistakable to a human playtester on mixed packs.
- [ ] Stance differences are unmistakable without reading telemetry.
- [ ] Skill-priority/combo changes create obviously different fight rhythms.
- [ ] A tuned custom brain can outperform a poor preset on an identical room in human testing.
- [ ] Repeated mobile editing remains comfortable.
- [ ] Final Goal 02 human-facing quality score reaches 9/10+ across targeting, positioning, skill rules, conditional rules, readability, and comparison UX.

## Explicitly excluded from Goal 02
No loot, equipment affixes, passive tree, skill gems, crafting, story, town, or permanent character progression. Goal 02 remains about **behavior authoring**, not build progression.

## Next pass
Human-test v1.2 using **REPLAY SAME**. The highest-value comparison is Balanced vs Kiter vs Berserker on the same ranged-heavy room, then a custom brain. The question is no longer whether the AI can avoid pathological loops; it is whether the behavioral choices feel obvious, powerful, and fun enough to justify the system.
