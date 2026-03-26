# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Physics-based puzzle game inspired by Suika Game and 2048, built with Preact, TypeScript, and Matter.js. Players drop eggs that stack under physics simulation, merge matching eggs (same color + same level) to level them up, and reveal collectible cards from level 6 eggs.

## Development Commands

```bash
# Development
pnpm dev              # Start Vite dev server on port 4444

# Building
pnpm build            # Production build with route prerendering
pnpm preview          # Preview production build

# Testing
pnpm test             # Run unit tests once
pnpm test:watch       # Run Vitest in watch mode
pnpm test:unit tests/unit/<path> --force-exit  # Run specific test

# Type Checking
pnpm typecheck        # TypeScript type checking
```

## Architecture

### Layered Architecture

The game follows a clear separation of concerns:

1. **Presentation Layer** (`src/pages/`) - Preact components and routing
2. **Game Logic Layer** (`src/game/`) - Core mechanics and physics
3. **Entity Layer** - Game objects (eggs, cards)
4. **Configuration Layer** - Constants and game settings
5. **Utility Layer** - Shared helpers

### Game Loop Architecture

The game uses a **fixed-step game loop** for stable physics simulation:

- `PhysicsWorld` manages Matter.js engine with fixed 60 FPS updates
- `GameLoop` separates physics updates from rendering
- `MergeSystem` handles egg collision detection and merging with cooldown prevention
- `EggFactory` creates egg entities with pre-rendered sprites

### Egg System

- 5 colors × 6 levels = 30 egg types
- Weighted random spawning: Red(2), Blue(3), Green(4), Yellow(5), Gray(6)
- Size multipliers per level (1.0x to 2.6x)
- Level 6 eggs contain collectible cards

### Card Collection System

Theme: "A student trying to pass university entrance exams"

- 40 unique cards across 5 sets (People/Jobs, Food, Animals, Fruits, Weather)
- Each card has stats: Focus (⚡), Endurance (🛡️), Speed (💨), Luck (🍀)
- 5 rarity tiers: Common, Uncommon, Rare, Epic, Legendary
- Cards revealed from Level 6 eggs fly to collection book
- Set completion unlocks bonus card
- Data persisted in localStorage

### Routing

Routes defined in `src/index.tsx`:
- `/` - Main menu
- `/game` - Playable physics scene
- `/egg-shape` - Mathematical egg shape demo
- `/collection` - Egg collection overview
- `/collection-book` - Detailed card collection view

### Physics Implementation

Uses **Matter.js** with custom optimizations:
- Fixed timestep for deterministic behavior
- Parametric egg silhouette for collision bodies
- Device orientation support for tilt control (iOS/Android)
- Sleeping optimization and solver tuning for dense stacks
- Canvas-based rendering with pre-rendered sprites

### State Management

- Component-level state via Preact hooks (no global state library)
- Collection data persisted in localStorage
- Physics state managed in `PhysicsWorld` class

## Testing Strategy

Tests focus on **deterministic logic** rather than rendering/physics:

- Egg configuration and weighted selection
- Geometry calculations
- Merge system rules and cooldown behavior

Located in `tests/game/` mirroring `src/game/` structure.

## Key Files

| File | Purpose |
|------|---------|
| `src/game/core/PhysicsWorld.ts` | Matter.js wrapper, fixed-step loop |
| `src/game/systems/MergeSystem.ts` | Egg merge logic with cooldowns |
| `src/game/entities/EggFactory.ts` | Egg creation with sprites |
| `src/game/rendering/SpriteGenerator.ts` | Pre-rendered egg sprites, Level 6 emoji sets |
| `src/game/config/eggConfig.ts` | Egg types, colors, spawn weights |
| `src/lib/cardData.ts` | Card definitions (40 cards with stats/rarity) |

## Development Notes

- Mobile-first design with touch controls and rapid-fire spawning
- GSAP available for reward/presentation animations
- Thai language support in game documentation
- Emoji rendering via Twemoji (https://twemoji-cheatsheet.vercel.app/)
- Current build reports CSS warnings (unrelated to game logic)

## Known Gaps

- Full gameplay fail-state (stack overflow/deadline flow) not finalized
- Reward and ascension presentation can be expanded
- Card reveal/flight animations partially implemented (see `docs/CARD_DEV_PLAN.md`)
