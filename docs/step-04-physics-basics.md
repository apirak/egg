# Step 4: Physics-Based Egg Game (No Merging)

## Overview

Create the basic game with Matter.js physics where eggs spawn on click/tap and roll with realistic physics. No merging logic yet - just physics simulation.

## Goals

- Set up Matter.js physics world
- Spawn eggs on click/tap at cursor position
- Eggs fall and roll with realistic physics
- Contain eggs within game boundaries
- Smooth 60FPS rendering with pre-rendered sprites

## Todo List

### Physics World Setup

- [x] Create `PhysicsWorld` class
  - [x] Initialize Matter.js engine
  - [x] Set up game boundaries (walls)
  - [x] Configure gravity
  - [ ] Create renderer for debugging (optional)
- [x] Define game container dimensions
- [x] Set wall boundaries (left, right, bottom)

### Egg Factory

- [x] Create `EggFactory` class
  - [x] Generate Matter.js compound body for eggs
  - [x] Use circle-based compound configuration
  - [x] Set proper density and friction
  - [x] Assign random color (Red, Blue, Green) to new eggs
- [x] Create `Egg` entity representation
  - [x] Store Matter.js body reference
  - [x] Store egg type (color, level)
  - [x] Store sprite reference
  - [x] Keep render dimensions for drawing

### Game Loop

- [x] Create `GameLoop` system
  - [x] Update physics engine
  - [x] Clear canvas
  - [x] Render all egg sprites at body positions
  - [x] Handle body rotation
  - [x] Maintain 60FPS target

### Input Handling

- [x] Add click/tap handler to game canvas
  - [x] Get click coordinates relative to canvas
  - [x] Spawn L1 egg at clicked position
  - [x] Add to physics world
- [x] Prevent spawning outside boundaries
- [x] Prevent immediate overlap with existing eggs on spawn
- [ ] Add visual feedback for spawn position

### Rendering

- [x] Set up main game canvas
- [x] Use pre-rendered sprites from Step 2
- [x] Draw sprites with proper position and rotation
- [x] Handle canvas coordinate system
- [x] Optimize for mobile (prevent scrolling)

### Game Page UI

- [x] Create `Game` page component
  - [x] Set up canvas element
  - [x] Initialize physics on mount
  - [x] Clean up physics on unmount
  - [x] Handle window resize
- [ ] Add instructions overlay
- [ ] Add back to menu button (optional UX follow-up)

### Types

- [x] `EggEntity` interface
- [ ] `PhysicsWorldConfig` interface
- [x] `GameConfig` interface

### Testing

- [x] Click spawns egg at correct position
- [x] Eggs fall with gravity
- [x] Eggs roll realistically on surfaces
- [x] Eggs don't escape boundaries
- [x] Multiple eggs can coexist
- [x] TypeScript compiles without errors
- [ ] Performance is smooth on mobile (needs device verification)

## Implementation Notes (Current)

- Physics engine uses Matter.js (`Engine`, `Runner`, `Bodies`, `World`).
- Solver iterations were increased to reduce body penetration artifacts.
- Collision body sizing in `EggFactory` was tuned closer to displayed sprite size.
- Spawn logic now uses click position and performs overlap-avoidance search.

## File Structure

```
src/
  pages/
    Game/
      index.tsx         # Game page component
      style.css         # Game page styles
  game/
    core/
      PhysicsWorld.ts   # Matter.js wrapper
      GameLoop.ts       # Main game loop
      index.ts          # Barrel export
    entities/
      Egg.ts            # Egg entity class
      EggFactory.ts     # Egg creation
      index.ts          # Barrel export
    config/
      GameConfig.ts     # Game constants
```

## Key Constants

```typescript
// Game dimensions
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

// Physics
const GRAVITY = 1;
const WALL_THICKNESS = 50;

// Egg base size (radius in pixels)
const EGG_BASE_RADIUS = 20;

// Spawn
const SPAWN_LEVEL = 1; // Always spawn L1
```

## Acceptance Criteria

- Click/tap spawns egg at cursor
- Eggs fall and roll with physics
- Eggs stay within boundaries
- Multiple eggs can be spawned
- Pre-rendered sprites display correctly
- Smooth 60FPS performance
- TypeScript compiles cleanly
