# Dopamine

# ▶ [TEST GAME](https://dcardimen.github.io/Dopamine/)

**One tap should open the latest playable build.** Every push to `main` automatically rebuilds and republishes the browser version.

**Dopamine** is an auto-battler action RPG built around deep skill customization, passive-tree buildcraft, monster density, and highly readable combat spectacle.

The player is the architect of the build: skills, priorities, targeting rules, positioning, gear, and passive interactions determine how the hero fights automatically.

## Current milestone

### Goal 01 — Nail the 30-Second Combat Loop

The first playable prototype deliberately excludes loot, leveling, story, crafting, and procedural generation. It exists to answer one question:

> Is watching the character fight packs of monsters satisfying enough that you immediately want the next wave?

Prototype scope:

- One melee hero: Vanguard
- Heavy Slash basic attack
- Whirlwind and Ground Slam
- Five normal enemy archetypes
- One elite
- One miniboss
- Seven hand-authored waves
- Automatic targeting, movement, skill use, and threat response
- Combat feedback, damage numbers, overkill reactions, and post-wave metrics
- 1x / 2x / 3x simulation speed
- Instant next-wave flow

## Controls

Combat is fully automatic. On desktop, `1` / `2` / `3` changes simulation speed and `Space` advances. The on-screen **Next Wave** button can also be clicked or tapped.

## Developer tools

These are optional and should not be needed just to playtest:

- [Open development environment in Codespaces](https://codespaces.new/DCardimen/Dopamine?quickstart=1)
- [Edit code in the browser](https://github.dev/DCardimen/Dopamine)
- Local Godot: clone the repository, open `project.godot`, and press **F5/F6**.

See [`docs/goal-01-combat-loop.md`](docs/goal-01-combat-loop.md) for the test encounters and acceptance criteria.

## Development rule

Milestones are developed separately and merged when ready. We prioritize skill feel, build interactions, combat readability, and the desire to immediately run another encounter over content volume.
