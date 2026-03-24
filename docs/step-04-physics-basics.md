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
- [ ] Create `PhysicsWorld` class
  - [ ] Initialize Matter.js engine
  - [ ] Set up game boundaries (walls)
  - [ ] Configure gravity
  - [ ] Create renderer for debugging (optional)
- [ ] Define game container dimensions
- [ ] Set wall boundaries (left, right, bottom)

### Egg Factory
- [ ] Create `EggFactory` class
  - [ ] Generate Matter.js compound body for eggs
  - [ ] Use circleLarge + circleSmall configuration
  - [ ] Set proper density and friction
  - [ ] Assign random color (Red, Blue, Green) to new eggs
- [ ] Create `Egg` entity class
  - [ ] Store Matter.js body reference
  - [ ] Store egg type (color, level)
  - [ ] Store sprite reference
  - [ ] Update position from physics body

### Game Loop
- [ ] Create `GameLoop` system
  - [ ] Update physics engine
  - [ ] Clear canvas
  - [ ] Render all egg sprites at body positions
  - [ ] Handle body rotation
  - [ ] Maintain 60FPS

### Input Handling
- [ ] Add click/tap handler to game canvas
  - [ ] Get click coordinates relative to canvas
  - [ ] Spawn L1 egg at clicked position
  - [ ] Add to physics world
- [ ] Prevent spawning outside boundaries
- [ ] Add visual feedback for spawn position

### Rendering
- [ ] Set up main game canvas
- [ ] Use pre-rendered sprites from Step 2
- [ ] Draw sprites with proper position and rotation
- [ ] Handle canvas coordinate system
- [ ] Optimize for mobile (prevent scrolling)

### Game Page UI
- [ ] Create `Game` page component
  - [ ] Set up canvas element
  - [ ] Initialize physics on mount
  - [ ] Clean up physics on unmount
  - [ ] Handle window resize
- [ ] Add instructions overlay
- [ ] Add back to menu button

### Types
- [ ] `EggEntity` interface
- [ ] `PhysicsWorldConfig` interface
- [ ] `GameConfig` interface

### Testing
- [ ] Click spawns egg at correct position
- [ ] Eggs fall with gravity
- [ ] Eggs roll realistically on surfaces
- [ ] Eggs don't escape boundaries
- [ ] Multiple eggs can coexist
- [ ] TypeScript compiles without errors
- [ ] Performance is smooth on mobile

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
