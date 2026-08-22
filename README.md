# Dopamine

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

## Run the prototype

1. Install Godot 4.x.
2. Clone this repository.
3. Check out `goal-01-combat-loop` while the first milestone is under review.
4. Import `project.godot` into Godot.
5. Press **F6/F5** to run the project.

The combat is fully automatic.

- `1` = 1x speed
- `2` = 2x speed
- `3` = 3x speed
- `Space` = next wave / restart

See [`docs/goal-01-combat-loop.md`](docs/goal-01-combat-loop.md) for the test encounters and acceptance criteria.

## Development rule

Milestones are developed on branches and merged only after they are playable. We prioritize skill feel, build interactions, combat readability, and the desire to immediately run another encounter over content volume.
