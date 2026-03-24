# Step 5: Egg Merge Logic

## Overview
Implement the core merge mechanic where same-color, same-level eggs merge into the next level egg when they collide.

## Goals
- Detect collisions between eggs
- Check if eggs are same color AND same level
- Merge two eggs into one higher-level egg
- Handle special "Ascension" case (L5 + L5 → Angel)
- Play merge animations/effects

## Merge Rules

### Standard Merge
When two eggs collide:
- Must be **SAME COLOR** AND **SAME LEVEL**
- Both eggs removed from physics world
- One new egg created at midpoint
- New egg has **SAME COLOR**, **LEVEL + 1**
- New egg size is **1.2x larger** (as per level progression)

### Level Progression (per color)
```
L1 (General) + L1 = L2 (Dot)
L2 (Dot) + L2 = L3 (Wristband)
L3 (Wristband) + L3 = L4 (Flash)
L4 (Flash) + L4 = L5 (Golden)
```

### Ascension (Special Case)
```
L5 (Golden) + L5 (Golden) = Angel
```
- Play particle effect
- Remove Angel from physics immediately
- Float animation toward "Collection Shelf"
- Increment counter for that color

## Todo List

### Collision Detection
- [ ] Create `CollisionSystem` class
  - [ ] Listen to Matter.js collision events
  - [ ] Filter egg-to-egg collisions only
  - [ ] Ignore wall/egg collisions
- [ ] Track which eggs are currently merging (prevent double-merge)

### Merge Logic
- [ ] Create `MergeSystem` class
  - [ ] Check if collision eggs are same color
  - [ ] Check if collision eggs are same level
  - [ ] Calculate midpoint position
  - [ ] Create new egg at midpoint
  - [ ] Remove both source eggs
  - [ ] Add new egg to physics world

### Ascension Handling
- [ ] Detect L5 + L5 merge
- [ ] Create "Angel" entity
- [ ] Play particle effect (GSAP or custom)
- [ ] Remove from physics world immediately
- [ ] Animate floating up to collection shelf
- [ ] Update collected counters

### Visual Effects
- [ ] Merge flash/particle effect
  - [ ] Spawn particles at merge location
  - [ ] Animate particles fading out
- [ ] Scale animation for new egg
  - [ ] Start slightly larger than target
  - [ ] Spring/scale down to normal size
- [ ] Screen shake (subtle)

### Collection Shelf UI
- [ ] Add "Angel Shelf" to game UI
  - [ ] Display counters: R:0 | B:0 | G:0
  - [ ] Update in real-time when angels collected
- [ ] Visual representation of collected angels

### Game State
- [ ] Track total score/eggs collected
- [ ] Track merge count
- [ ] Persist to localStorage (optional)

### Types
- [ ] `MergeEvent` interface
- [ ] `CollisionPair` interface
- [ ] `AngelCollection` state

### Testing
- [ ] Same color, same level eggs merge correctly
- [ ] Same color, different level eggs DO NOT merge
- [ ] Different color eggs DO NOT merge
- [ ] New egg appears at correct position
- [ ] New egg has correct level (+1)
- [ ] L5 + L5 creates angel and removes egg
- [ ] Angel counter increments correctly
- [ ] No physics glitches after merge
- [ ] TypeScript compiles without errors

## File Structure
```
src/
  game/
    systems/
      CollisionSystem.ts  # Collision detection
      MergeSystem.ts      # Merge logic
      index.ts            # Barrel export
    entities/
      Angel.ts            # Ascension entity
    effects/
      ParticleSystem.ts   # Visual effects
      index.ts
    state/
      GameState.ts        # Score, collections
      index.ts
```

## Merge Algorithm
```typescript
function handleCollision(bodyA: Matter.Body, bodyB: Matter.Body): void {
  const eggA = getEggEntity(bodyA);
  const eggB = getEggEntity(bodyB);

  // Check same color and level
  if (eggA.color === eggB.color && eggA.level === eggB.level) {

    // Check for ascension
    if (eggA.level === 5) {
      handleAscension(eggA.color, bodyA.position, bodyB.position);
    } else {
      // Standard merge
      performMerge(eggA, eggB, bodyA.position, bodyB.position);
    }
  }
}

function performMerge(eggA: Egg, eggB: Egg, posA: Vector, posB: Vector): void {
  const midpoint = Vector.add(posA, posB).scale(0.5);
  const newLevel = eggA.level + 1;

  // Remove old eggs
  removeEgg(eggA);
  removeEgg(eggB);

  // Create new egg
  const newEgg = createEgg({
    color: eggA.color,
    level: newLevel,
    position: midpoint
  });

  // Play effects
  playMergeEffect(midpoint);
}
```

## Acceptance Criteria
- Same color + level eggs merge on contact
- Different eggs bounce off each other
- Merged egg has correct level and color
- Merged egg appears at midpoint
- L5 + L5 creates floating angel
- Angel counters update correctly
- Visual effects play on merge
- No memory leaks from removed eggs
- TypeScript compiles cleanly
