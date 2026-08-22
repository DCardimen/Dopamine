# Dopamine

# ▶ [TEST GAME](https://dopamine-playtest.vercel.app)

**One tap opens the latest playable Goal 01 build.** No Codespaces, terminal, or local Godot install is required to playtest.

**Dopamine** is an auto-battler action RPG built around deep skill customization, passive-tree buildcraft, monster density, and highly readable combat spectacle.

The player is the architect of the build: skills, priorities, targeting rules, positioning, gear, and passive interactions determine how the hero fights automatically.

## Current milestone

### Goal 01 — Nail the 30-Second Combat Loop

The current **v2 combat-feel pass** adds stronger impact feedback, clearer skill cooldowns, autonomous threat dodging, improved enemy readability, Frenzied Boneguard escalation, and a more involved Goremaw fight with Cleave, Rupture, Charge, and enrage behavior.

The prototype deliberately excludes loot, leveling, story, crafting, and procedural generation. It exists to answer one question:

> Is watching the character fight packs of monsters satisfying enough that you immediately want the next wave?

Prototype scope:

- Vanguard auto-battler hero
- Heavy Slash, Whirlwind, and Ground Slam
- Five normal enemy archetypes
- Frenzied Boneguard elite
- Goremaw miniboss
- Seven hand-authored encounters
- Threat-weighted targeting and automatic movement
- Autonomous danger dodging
- Crit / impact / overkill feedback
- Post-wave combat report including dodge and impact metrics
- 1x / 2x / 3x mobile controls

## Controls

Combat is fully automatic. Tap **1x / 2x / 3x** to change simulation speed and **Next Wave** after an encounter.

## Developer tools

These are optional and should not be needed just to playtest:

- [Open development environment in Codespaces](https://codespaces.new/DCardimen/Dopamine?quickstart=1)
- [Edit code in the browser](https://github.dev/DCardimen/Dopamine)
- Local Godot: clone the repository, open `project.godot`, and press **F5/F6**.

See [`docs/goal-01-combat-loop.md`](docs/goal-01-combat-loop.md) for the current acceptance tests.

## Development rule

Do not add progression systems to hide weak combat. Goal 01 stays focused on skill feel, readable AI decisions, monster pressure, combat feedback, and the desire to immediately run another encounter.
