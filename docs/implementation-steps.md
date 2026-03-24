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

Display all 15 egg types (3 colors × 5 levels) with proper size progression.

**Deliverables**:
- `EggConfig` with all egg configurations
- Complete sprite generation for all types
- `/collection` page with grid layout

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
- `CollisionSystem` for detecting collisions
- `MergeSystem` for merge logic
- Ascension handling (L5 → Angel)
- Visual effects

## Progress Tracking

- [ ] Step 1: Egg Shape Geometry
- [ ] Step 2: Egg Collection Display
- [ ] Step 3: Menu Navigation
- [ ] Step 4: Physics Basics
- [ ] Step 5: Merge Logic

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
