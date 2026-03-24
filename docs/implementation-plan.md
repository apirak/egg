# Egg Merge Game - Implementation Plan

## Context

Developing a physics-based "Egg Merge" mobile web game (Suika-style) using the existing Vite + Preact + TypeScript setup. The game features 3 colors (Red, Blue, Green) × 5 levels of progression, with merge mechanics where SAME color + SAME level eggs combine.

**Key Technical Challenge**: Pre-rendered sprite system for 60FPS performance on mobile devices. Egg shapes are created from compound Matter.js bodies (2 overlapping circles) with smooth Bezier curve silhouettes.

---

## File Structure

```
src/
├── game/                          # NEW - Core game logic
│   ├── core/
│   │   ├── GameEngine.ts          # Main game loop & state
│   │   ├── PhysicsWorld.ts        # Matter.js wrapper
│   │   └── Renderer.ts            # Canvas rendering
│   ├── entities/
│   │   ├── Egg.ts                 # Egg entity (physics + visual)
│   │   ├── EggTypes.ts            # Type definitions
│   │   └── EggFactory.ts          # Egg creation factory
│   ├── systems/
│   │   ├── MergeSystem.ts         # Collision & merge logic
│   │   ├── DropSystem.ts          # Egg dropping
│   │   ├── AscensionSystem.ts     # L5+L5 -> Angle handling
│   │   └── GameOverSystem.ts      # Stack height detection
│   ├── rendering/
│   │   ├── SpriteGenerator.ts     # Pre-render sprites (CRITICAL)
│   │   ├── EggGeometry.ts         # Bezier curve math
│   │   └── AnimationManager.ts    # GSAP animations
│   ├── input/
│   │   ├── InputHandler.ts        # Touch/click processing
│   │   └── GestureRecognizer.ts   # Tap vs hold detection
│   └── config/
│       ├── GameConfig.ts          # Constants (sizes, colors)
│       └── LevelConfig.ts         # Progression data
├── components/
│   └── game/
│       ├── GameContainer.tsx      # Main game wrapper
│       ├── GameCanvas.tsx         # Canvas element
│       ├── SpawnButton.tsx        # Egg spawn button
│       ├── ProgressionShelf.tsx   # Collected angles display
│       ├── GameOverModal.tsx      # Game over UI
│       └── GuideLine.tsx          # Drop trajectory
├── hooks/
│   ├── useGameEngine.ts           # Game engine lifecycle
│   ├── useGameInput.ts            # Input handling
│   └── useGameState.ts            # Game state management
├── types/
│   ├── game.ts                    # Game type definitions
│   └── physics.ts                 # Physics types
└── utils/
    ├── canvas.ts                  # Canvas utilities
    └── math.ts                    # Math helpers
```

---

## Implementation Phases

### Phase 1: Foundation
1. Install dependencies: `matter-js`, `gsap`, `@types/matter-js`
2. Create type definitions in `types/game.ts` and `types/physics.ts`
3. Implement `GameConfig.ts` and `LevelConfig.ts` with constants
4. Set up file structure with barrel exports

### Phase 2: Physics & Geometry
1. Implement `PhysicsWorld.ts` - Matter.js engine setup, boundaries
2. Implement `EggGeometry.ts` - Bezier curve calculations for egg shape
3. Implement `SpriteGenerator.ts` - **CRITICAL** - Pre-render all 15 egg sprites to offscreen canvas
4. Implement `Renderer.ts` skeleton with sprite-based rendering

### Phase 3: Entity & Factory
1. Implement `Egg.ts` - Entity combining Matter.js body + game data
2. Implement `EggFactory.ts` - Create compound bodies (2 circles) with 1.2x size multiplier
3. Implement `GameEngine.ts` skeleton with requestAnimationFrame loop

### Phase 4: Game Logic Systems
1. Implement `MergeSystem.ts` - Collision detection, SAME color/level validation, level progression
2. Implement `DropSystem.ts` - Spawn queue, drop mechanics, cooldown
3. Implement `AscensionSystem.ts` - L5+L5 -> Angle, remove body, float animation
4. Implement `GameOverSystem.ts` - Stack height monitoring, 2-second threshold

### Phase 5: Input & Controls
1. Implement `InputHandler.ts` - Touch events, coordinate transformation
2. Implement `GestureRecognizer.ts` - Tap vs hold detection
3. Implement guide line trajectory visualization

### Phase 6: UI Components (Preact)
1. Implement `GameContainer.tsx` with `useGameEngine` hook
2. Implement `GameCanvas.tsx` with canvas ref and input binding
3. Implement `SpawnButton.tsx`, `ProgressionShelf.tsx`, `GameOverModal.tsx`
4. Implement `useGameInput.ts` and `useGameState.ts` hooks

### Phase 7: Polish & Optimization
1. Implement `AnimationManager.ts` with GSAP for particles/effects
2. Performance optimization: sleeping bodies, collision filtering, sprite cache
3. Mobile testing and refinement

---

## Critical Technical Implementation Details

### Egg Geometry (Compound Body)
```typescript
// EggFactory.ts
createCompoundBody(size: number) {
  const circleLarge = Matter.Bodies.circle(0, size * 0.2, size * 0.5);
  const circleSmall = Matter.Bodies.circle(0, -size * 0.3, size * 0.35);
  return Matter.Body.create({ parts: [circleLarge, circleSmall] });
}
```

### Sprite Pre-Rendering (Performance Critical)
```typescript
// SpriteGenerator.ts - Generate once at startup
private spriteCache: Map<string, HTMLCanvasElement> = new Map();

generateSprites() {
  for (const color of ['RED', 'BLUE', 'GREEN']) {
    for (const level of 1..5) {
      const canvas = document.createElement('canvas');
      // Draw egg with Bezier curves (expensive, done once)
      this.drawEggShape(canvas, color, level);
      this.spriteCache.set(`${color}-${level}`, canvas);
    }
  }
}
```

### Merge Logic
```typescript
// MergeSystem.ts
onCollision(event) {
  for (const pair of event.pairs) {
    const eggA = pair.bodyA.eggReference;
    const eggB = pair.bodyB.eggReference;
    // Check: SAME color AND SAME level
    if (eggA.color === eggB.color && eggA.level === eggB.level) {
      this.mergeEggs(eggA, eggB);
    }
  }
}
```

### Progression Rules
- L1 (General) + L1 = L2 (Dot)
- L2 + L2 = L3 (Wristband)
- L3 + L3 = L4 (Flash)
- L4 + L4 = L5 (Golden)
- L5 + L5 = Angle (Ascension) - floats to collection shelf

---

## Dependencies to Add

```bash
npm install matter-js gsap
npm install -D @types/matter-js
```

---

## Key Files to Modify/Create

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add matter-js, gsap dependencies |
| `src/game/rendering/SpriteGenerator.ts` | Create | Pre-render all 15 egg sprites |
| `src/game/systems/MergeSystem.ts` | Create | Core merge logic |
| `src/game/entities/EggFactory.ts` | Create | Egg creation with compound bodies |
| `src/game/core/GameEngine.ts` | Create | Main game loop |
| `src/components/game/GameContainer.tsx` | Create | Main Preact component |
| `src/pages/Game/index.tsx` | Create | Game page route |

---

## Verification

1. Run `npm run dev` - dev server starts without errors
2. Game canvas renders with container boundaries
3. Spawn button creates L1 eggs that drop with physics
4. Same color/level eggs merge on collision
5. L5+L5 creates ascending Angle that floats to shelf
6. Game over triggers when eggs stack too high
7. Test on mobile: touch controls work smoothly at 60FPS
