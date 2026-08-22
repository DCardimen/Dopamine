# Dopamine

## One-click testing / coding

[![Open in Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/DCardimen/Dopamine?quickstart=1)

### ▶ [PLAYTEST PUBLISHED BUILD](https://dcardimen.github.io/Dopamine/)
### ✏️ [EDIT CODE IN BROWSER](https://github.dev/DCardimen/Dopamine)

**Recommended:** tap **Open in Codespaces**. GitHub will create a browser-based VS Code environment, install Godot 4.7.2 and its web export templates, build Dopamine, start a private preview server, and automatically open the playtest from port `8000`.

If the game has a Godot compile/export error, the preview still opens and tells you where to find the build log. After making a fix, run `bash .devcontainer/run-playtest.sh` in the Codespaces terminal to rebuild and refresh the test server.

The published GitHub Pages build remains available as a simpler play-only route once deployment is healthy.

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

## Local fallback

Install Godot 4.x, clone the repository, open `project.godot`, and press **F5/F6**.

See [`docs/goal-01-combat-loop.md`](docs/goal-01-combat-loop.md) for the test encounters and acceptance criteria.

## Development rule

Milestones are developed separately and merged when ready. We prioritize skill feel, build interactions, combat readability, and the desire to immediately run another encounter over content volume.
