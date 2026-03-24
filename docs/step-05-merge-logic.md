# Step 5: Egg Merge Logic

## Overview

Implement the core merge mechanic where same-color, same-level eggs merge into the next level egg when they collide.

## Goals

- Detect collisions between eggs.
- Check if eggs are same color AND same level.
- Merge two eggs into one higher-level egg.
- Handle special ascension case (L6 + L6 -> Angel).
- Play merge animations/effects.

## Merge Rules

### Standard Merge

When two eggs collide:

- Must be SAME COLOR and SAME LEVEL.
- Both eggs are removed from physics world.
- One new egg is created at midpoint.
- New egg has SAME COLOR and LEVEL + 1.
- New egg size is 1.2x larger (as per level progression).

### Level Progression (per color)

```text
L1 (General) + L1 = L2 (Dot)
L2 (Dot) + L2 = L3 (Wristband)
L3 (Wristband) + L3 = L4 (Flash)
L4 (Flash) + L4 = L5 (Golden)
L5 (Golden) + L5 (Golden) = L6 (Royal + random Twemoji)
```

### Ascension (Special Case)

```text
L6 (Royal) + L6 (Royal) = Angel
```

- Play particle effect.
- Remove Angel from physics immediately.
- Float animation toward collection shelf.
- Increment counter for that color.

### L6 Reward Reveal

- L6 should look flat (solid egg color).
- Overlay one large random Twemoji on top of the egg.
- Emoji is unknown before merge, so each L5 + L5 merge feels like a reveal moment.

## Todo List

### Collision Detection

- [ ] Create CollisionSystem class.
- [ ] Listen to Matter.js collision events.
- [ ] Filter egg-to-egg collisions only.
- [ ] Ignore wall/egg collisions.
- [ ] Track which eggs are currently merging (prevent double-merge).

### Merge Logic

- [ ] Create MergeSystem class.
- [ ] Check if collision eggs are same color.
- [ ] Check if collision eggs are same level.
- [ ] Calculate midpoint position.
- [ ] Create new egg at midpoint.
- [ ] Remove both source eggs.
- [ ] Add new egg to physics world.

### Ascension Handling

- [ ] Detect L6 + L6 merge.
- [ ] Create Angel entity.
- [ ] Play particle effect (GSAP or custom).
- [ ] Remove from physics world immediately.
- [ ] Animate floating up to collection shelf.
- [ ] Update collected counters.

### L6 Emoji Reveal

- [x] Generate L6 as solid-color egg.
- [x] Overlay one large random Twemoji per L6 egg.
- [x] Load Twemoji image from CDN with emoji-font fallback.
- [x] Make L6 sprite generation uncached so each new L6 can reveal a new emoji.

### Visual Effects

- [ ] Merge flash/particle effect.
- [ ] Spawn particles at merge location.
- [ ] Animate particles fading out.
- [ ] Scale animation for new egg.
- [ ] Start slightly larger than target.
- [ ] Spring/scale down to normal size.
- [ ] Screen shake (subtle).

### Collection Shelf UI

- [ ] Add Angel Shelf to game UI.
- [ ] Display counters: R:0 | B:0 | G:0 | Y:0 | GY:0.
- [ ] Update in real-time when angels collected.
- [ ] Visual representation of collected angels.

### Game State

- [ ] Track total score/eggs collected.
- [ ] Track merge count.
- [ ] Persist to localStorage (optional).

### Types

- [ ] MergeEvent interface.
- [ ] CollisionPair interface.
- [ ] AngelCollection state (5 colors).

### Testing

- [ ] Same color, same level eggs merge correctly.
- [ ] Same color, different level eggs do not merge.
- [ ] Different color eggs do not merge.
- [ ] New egg appears at correct position.
- [ ] New egg has correct level (+1).
- [ ] L5 + L5 creates L6 with one random Twemoji overlay.
- [ ] L6 + L6 creates angel and removes egg.
- [ ] Angel counter increments correctly.
- [ ] No physics glitches after merge.
- [ ] TypeScript compiles without errors.

## File Structure

```text
src/
  game/
    systems/
      CollisionSystem.ts
      MergeSystem.ts
      index.ts
    entities/
      Angel.ts
    effects/
      ParticleSystem.ts
      index.ts
    state/
      GameState.ts
      index.ts
```

## Merge Algorithm

```typescript
function handleCollision(bodyA: Matter.Body, bodyB: Matter.Body): void {
  const eggA = getEggEntity(bodyA);
  const eggB = getEggEntity(bodyB);

  if (eggA.color === eggB.color && eggA.level === eggB.level) {
    if (eggA.level === 6) {
      handleAscension(eggA.color, bodyA.position, bodyB.position);
    } else {
      performMerge(eggA, eggB, bodyA.position, bodyB.position);
    }
  }
}

function performMerge(eggA: Egg, eggB: Egg, posA: Vector, posB: Vector): void {
  const midpoint = Vector.add(posA, posB).scale(0.5);
  const newLevel = eggA.level + 1;

  removeEgg(eggA);
  removeEgg(eggB);

  const newEgg = createEgg({
    color: eggA.color,
    level: newLevel,
    position: midpoint,
  });

  playMergeEffect(midpoint);
}
```

## Acceptance Criteria

- Same color + level eggs merge on contact.
- Different eggs bounce off each other.
- Merged egg has correct level and color.
- Merged egg appears at midpoint.
- L5 + L5 creates L6 with one random Twemoji.
- L6 + L6 creates floating angel.
- Angel counters update correctly.
- Visual effects play on merge.
- No memory leaks from removed eggs.
- TypeScript compiles cleanly.

## Current Implementation Snapshot

- MergeSystem exists and detects same-color + same-level collision pairs with short cooldown protection.
- Runtime merge flow in game loop currently does:
  - levels 1-5 merge into next level egg.
  - level 6 merges into ascension counter increment (egg removed).
- L6 rendering now follows reward concept: solid color + one large random Twemoji.
