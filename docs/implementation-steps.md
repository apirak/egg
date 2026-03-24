# Egg Merge Game - Implementation Steps Overview

## Project Summary

A mobile-first physics-based egg merge game using Preact, TypeScript, Matter.js, and GSAP.

## Technology Stack

- **Framework**: Preact (with Vite)
- **Language**: TypeScript
- **Physics**: Matter.js
- **Animations**: GSAP
- **Build Tool**: Vite

## Implementation Approach

Vertical step-by-step implementation where each step builds on the previous one.

## Steps Overview

### Step 1: Egg Shape Geometry

**File**: [step-01-egg-shape.md](./step-01-egg-shape.md)

Create the foundational egg rendering system using compound bodies (two circles) and Bezier curves for smooth silhouettes.

**Deliverables**:

- `EggGeometry` class for calculations
- `SpriteGenerator` for pre-rendering
- `/egg-shape` page showing construction

### Step 2: Egg Collection Display

**File**: [step-02-egg-collection.md](./step-02-egg-collection.md)

Display all 30 egg types (5 colors × 6 levels) with proper size progression.

**Deliverables**:

- `EggConfig` with all egg configurations
- Complete sprite generation for all types
- `/collection` page with table layout (color columns x level rows)

### Step 3: Menu Navigation

**File**: [step-03-menu-navigation.md](./step-03-menu-navigation.md)

Create navigation between all pages and main menu.

**Deliverables**:

- `Navigation` component
- Redesigned `Home` page as menu
- Route configuration

### Step 4: Physics Basics

**File**: [step-04-physics-basics.md](./step-04-physics-basics.md)

Implement Matter.js physics world with egg spawning and rolling.

**Deliverables**:

- `PhysicsWorld` class
- `EggFactory` for creating eggs
- `/game` page with physics simulation
- Click-to-spawn functionality

### Step 5: Merge Logic

**File**: [step-05-merge-logic.md](./step-05-merge-logic.md)

Implement core merge mechanic for same-color, same-level eggs.

**Deliverables**:

- `MergeSystem` for merge logic
- Ascension handling (L6 + L6 → Angel)
- Reward reveal flow (L5 + L5 → L6 with random Twemoji)
- Visual effects

## Progress Tracking

- [x] Step 1: Egg Shape Geometry
- [x] Step 2: Egg Collection Display
- [x] Step 3: Menu Navigation
- [x] Step 4: Physics Basics
- [~] Step 5: Merge Logic

## Current Development Plan

### Stabilize Core Gameplay

- Finalize dense-stack physics behavior in narrow play areas
- Keep spawn behavior readable while avoiding excessive overlap and jitter
- Tune merge timing so valid same-level collisions feel responsive without chain-merging unpredictably

### Complete Gameplay Loop

- Add proper ascension reward flow beyond simple count increments
- Define loss or overflow conditions when stacks reach unsafe height
- Decide whether to add queue or preview logic for upcoming eggs

### Testing and Hardening

- Add unit tests for deterministic game logic modules before expanding gameplay surface
- Keep rendering code thin and move pure decision logic into testable helpers where needed
- Add regression coverage for weighted color spawning and merge eligibility rules

## Current Status Snapshot

- Collection page is now table-based (Color columns x Level rows) and uses gameplay size ratio from `EggConfig`.
- Egg model now uses 5 colors x 6 levels (30 total combinations).
- UI has been unified to white-focused style across Home, Egg Shape, Collection, and Game pages.
- Game page now runs real Matter.js physics (spawn, gravity, walls, game loop, rendering).
- Spawn behavior updated to click position, with boundary clamp and overlap-prevention pass.
- Physics stepping now uses a fixed timestep accumulator instead of variable per-frame stepping.
- Matter.js dense stacks were improved with a closer egg collision silhouette, sleeping, higher solver iterations, and higher static friction.
- Egg sprite visual adjustments applied: no stroke and no shadow.
- Level 6 now renders as solid-color egg with one large random Twemoji, creating a "mystery reward" reveal when L5 eggs merge.
- Random egg colors now use configurable weighted probabilities from `EggConfig`.

## Known Gaps

- No automated tests are configured yet.
- Merge behavior exists, but reward presentation and collection UX are still minimal.
- Physics tuning is improved but still needs gameplay-level verification under long stacking sessions.

## Commands

```bash
# Development
pnpm dev

# Type check
npx tsc --noEmit

# Build
pnpm build
```

## Notes

- Always run typecheck before proceeding
- Wait for "next" command before moving to next step
- All code comments and UI text in English
- Mobile-first responsive design
