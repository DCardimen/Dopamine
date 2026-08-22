# Dopamine

## ▶ [PLAYTEST IN YOUR BROWSER](https://dcardimen.github.io/Dopamine/)

**No install required.** Combat is automatic. On desktop, `1` / `2` / `3` changes speed and `Space` advances; the on-screen **Next Wave** button is also clickable/tappable.

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

## Local fallback

If the browser deployment is unavailable, install Godot 4.x, clone the repository, check out `goal-01-combat-loop`, import `project.godot`, and press **F5/F6**.

See [`docs/goal-01-combat-loop.md`](docs/goal-01-combat-loop.md) for the test encounters and acceptance criteria.

## Development rule

Milestones are developed on branches and merged only after they are playable. We prioritize skill feel, build interactions, combat readability, and the desire to immediately run another encounter over content volume.
