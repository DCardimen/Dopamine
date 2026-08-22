# Dopamine

# ▶ [TEST GAME](https://dopamine-playtest.vercel.app/)

**One tap opens the latest verified playable build.** The live build is deployed to Vercel and checked before handoff.

**Dopamine** is an auto-battler action RPG built around deep skill customization, passive-tree buildcraft, monster density, and highly readable combat spectacle.

The player is the architect of the build: skills, priorities, targeting rules, positioning, gear, and passive interactions determine how the hero fights automatically.

## Current milestone

### Goal 01 — Nail the 30-Second Combat Loop

The current browser build is **Goal 01 v2.2**. It deliberately excludes loot, leveling, story, crafting, and procedural generation. It exists to answer one question:

> Is watching the character fight packs of monsters satisfying enough that you immediately want the next wave?

Prototype scope:

- One melee hero: Vanguard
- Heavy Slash, Whirlwind, and Ground Slam
- Five normal enemy archetypes
- Frenzied Boneguard elite
- Goremaw boss with Cleave, Rupture, Charge, and enrage
- Seven hand-authored waves
- Automatic targeting, movement, skill use, threat recognition, and dodging
- Combat feedback, hit-stop, screen shake, damage/heal numbers, and post-wave metrics
- 1x / 2x / 3x simulation speed
- Instant next/restart flow

## Controls

Combat is fully automatic. Tap **1× / 2× / 3×** to change simulation speed and **NEXT** between waves.

## Developer tools

These are optional and should not be needed just to playtest:

- [Open development environment in Codespaces](https://codespaces.new/DCardimen/Dopamine?quickstart=1)
- [Edit code in the browser](https://github.dev/DCardimen/Dopamine)
- Local Godot: clone the repository, open `project.godot`, and press **F5/F6**.

See [`docs/goal-01-combat-loop.md`](docs/goal-01-combat-loop.md) for the test encounters and acceptance criteria.

## Development rule

Milestones are developed separately and merged when ready. We prioritize skill feel, build interactions, combat readability, and the desire to immediately run another encounter over content volume.
