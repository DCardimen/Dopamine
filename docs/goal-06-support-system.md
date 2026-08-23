# Goal 06 — Support Drops & Skill Modification

Status: **implemented and public-production verified** (pulled forward before Goal 05 at player request).

Playable build: https://dopamine-playtest.vercel.app/?v=support-12

## Player-facing system

- 60 distinct support types across 9 families: Tempo, Repeat, Conversion, Projectile, Area, DoT, Melee, Movement, and Minion.
- Supports change skill behavior rather than acting only as flat stat affixes.
- Examples include repeat/echo casts, cooldown acceleration or heavy cadence, elemental/chaos/physical conversion, rotating/random damage types, multishot, fork, chain, pierce, range rules, splash, aftershocks, delayed damage, DoTs, pull/knockback, leech, execute thresholds, self-damage for power, movement bonuses, and minion behavior changes.
- Stage clears award one support; boss-depth stages award two.
- Support copies are inventory resources and each copy can be allocated to one skill at a time.
- A skill can ultimately equip at most 10 supports.

## Progressive support slots

Every skill begins with **0 support slots unlocked**. A skill pickup can unlock the next support slot for that exact skill.

Higher monster level improves the unlock probability. Later support slots also require stronger monsters and become dramatically rarer.

| Slot | Minimum monster level | Expected eligible pickups at monster level 60 |
| ---: | ---: | ---: |
| 1 | 1 | 2 |
| 2 | 4 | 4 |
| 3 | 8 | 8 |
| 4 | 12 | 16 |
| 5 | 18 | 32 |
| 6 | 25 | 64 |
| 7 | 32 | 125 |
| 8 | 40 | 250 |
| 9 | 50 | 500 |
| 10 | 60 | 1000 |

The monster-level multiplier is nonlinear, so lower eligible monster levels have worse odds than level 60. Slot 10 is only eligible at monster level 60+ and has a 0.1% roll per eligible pickup at level 60.

Slot progression persists separately from support-item ownership. The Arsenal displays all ten sockets, which sockets are locked, the next minimum monster level, the expected level-60 pickup count, and the current high-level chance.

## Stage summary UX

Room results remain visible after a stage. The footer/Proceed control is placed above the summary interaction layer, the backdrop cannot intercept pointer events, and the summary card preserves its own interaction. Public mobile QA measured a 10px footer clearance and confirmed `PROCEED_TOPMOST=true`.

## Stability fixes

The support layer originally allowed support cooldown timestamps to leak across room transitions even though `roomClock` resets. A room-rollover guard now gives every skill a clean first readiness check when a new room starts, after which normal support cooldown rules resume. The final core gate explicitly tests this regression.

## Automated acceptance

Local browser gate on support runtime pin `45252946043ef38971711143ff79b01730ca58cb`:

- 60 unique support definitions.
- all definitions expose gameplay effects.
- minimum 21 compatible supports for every skill.
- 0 support slots on a fresh skill.
- escalating 10-slot progression curve.
- higher monster level produces better unlock odds.
- slot 10 validates as a 1000-pickup high-level chase.
- deterministic skill pickup can unlock a slot.
- ten-slot hard cap; eleventh support rejected.
- copy allocation enforced.
- cooldown modification verified.
- Cold conversion + chill verified.
- Echo repeat casting verified.
- room-rollover cooldown safety verified.
- boss-depth double support drop verified.
- support UI verifies 60 cards and 10 socket tiles.
- stage summary remains visible and Proceed remains topmost/clickable.
- Goal 02 regression remains green.

Public Vercel production gate:

- support core PASS.
- mobile summary/Proceed PASS.
- 3,600 simulated seconds.
- 102,858 combat steps.
- 529 rooms.
- 419 wins / 109 losses.
- 0 genuine stalls.
- all 30 skills cast.
- support coverage PASS.
- runtime errors: none.

Public verification issue comment: https://github.com/DCardimen/Dopamine/issues/6#issuecomment-5389114123
