# Goal 01 — Nail the 30-Second Combat Loop

## Objective
Validate the naked auto-battler combat toy before adding progression systems. The milestone passes only if repeated runs create an immediate desire to hit **Next Wave**.

## Current playable build
The one-click browser build is the fastest source of truth for Goal 01 feel testing. The Godot implementation remains the long-term project foundation, but the standalone browser graybox lets us iterate on combat without deployment friction.

## v2 combat-feel pass
- Heavier hit feedback with particles, crit emphasis, impact rings, and brief hit-stop.
- Clearer skill-state HUD for Heavy Slash, Whirlwind, and Ground Slam.
- Higher early monster density to make AoE events happen sooner.
- Threat-weighted targeting still prioritizes Exploders and Necromancers.
- Exploder windups are visually obvious.
- Vanguard now has autonomous danger dodging with a visible **DODGE** event.
- Post-wave report tracks threat dodges, biggest hit, and peak surrounding enemy count.
- Frenzied Boneguard visually escalates as its frenzy ramps.
- Goremaw now has Cleave, Rupture, and Charge patterns plus a 30% HP enrage.
- Boss attacks have readable windups so the player can anticipate whether the AI will evade them.
- Mobile 1x / 2x / 3x controls remain always available.

## Seven encounters
1. **Swarm Test** — disposable density; AoE should feel immediately rewarding.
2. **Frontline** — Rotlings plus durable Boneguards; tests cleanup pacing.
3. **Ranged Pressure** — ranged enemies force pursuit and repositioning.
4. **Threat Priority** — Exploders test target selection and reactive dodging.
5. **Support Target** — Necromancer tests whether the AI recognizes high-value support targets.
6. **Elite Check** — Frenzied Boneguard should become visibly more threatening as HP falls.
7. **Goremaw** — tests single-target pacing, readable telegraphs, dodge behavior, and enrage pressure.

## Acceptance tests
- [ ] The first enemy dies within roughly 3 seconds.
- [ ] A normal pack contains no more than ~10% dead visual time.
- [ ] Ground Slam is obviously more impactful than Heavy Slash.
- [ ] Whirlwind has a distinct rhythm and visual identity from Ground Slam.
- [ ] A crit is recognizable without reading the damage number.
- [ ] Exploders are identifiable immediately.
- [ ] Necromancers are identifiable immediately.
- [ ] Elites visually demand attention when they appear.
- [ ] Goremaw attacks are readable before impact.
- [ ] The player can understand when/why the Vanguard dodged.
- [ ] The AI does not repeatedly stand inside obvious boss danger zones.
- [ ] At least one boss mechanic creates anticipation rather than passive watching.
- [ ] 2x speed remains readable on a phone.
- [ ] Post-wave metrics help diagnose the build without interrupting combat.
- [ ] Finishing a room creates an immediate desire to press **Next Wave**.

## Explicitly excluded from Goal 01
No inventory, loot, leveling, passive tree, crafting, procedural maps, quests, story, town, or meta progression. If the combat toy is weak, fix the combat toy.

## Next tuning pass
After v2 is played on a phone, tune damage, monster speed, dodge timing, wave duration, boss HP, and effect intensity from actual feel feedback. Only when the 15 acceptance tests pass do we start Goal 02.
