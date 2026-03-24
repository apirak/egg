# Unit Test Plan

## Goal

Add fast, deterministic unit tests around pure game logic before testing UI or full physics interactions.

## Recommended Test Stack

- Test runner: Vitest
- Environment: Node for pure logic tests, `jsdom` only when DOM access is unavoidable
- Assertions and mocks: built-in Vitest utilities

## Phase 1: Pure Config and Selection Logic

### `src/game/config/EggConfig.ts`

Add tests for:

- `getAllEggTypes()` returns 30 combinations
- `getEggId()` formats color and level correctly
- `getEggDisplayName()` maps display strings correctly
- `getGameplayEggSize()` keeps output at least 1
- `EGG_COLOR_WEIGHT_TOTAL` matches the configured sum
- `pickWeightedEggColor()` returns expected colors for deterministic random values near bucket boundaries

Why first:

- These functions are pure and stable
- They protect current weighted-spawn behavior from silent regressions

## Phase 2: Geometry Math

### `src/game/geometry/EggGeometryMath.ts`

Add tests for:

- `generateEggPoints()` returns the expected number of points
- Output remains finite for default config
- Left/right bounds stay approximately symmetric around the center
- `getEggDimensions()` returns positive width and height

### `src/game/geometry/EggGeometry.ts`

Add tests for:

- `getEggHeight()` and `getEggWidth()` are positive
- `getCenterOffset()` stays consistent with geometry config
- `calculateTangentPoints()` returns finite coordinates in the expected top region

## Phase 3: Merge Rules

### `src/game/systems/MergeSystem.ts`

Add tests for:

- Same color and same level eggs can merge when colliding
- Different colors cannot merge
- Different levels cannot merge
- Recently merged eggs respect cooldown
- `markMerged()` and cooldown pruning behave over time

Implementation note:

- Mock `performance.now()` for deterministic cooldown tests
- Create minimal Matter bodies with simple circles for merge-system tests rather than full egg entities

## Phase 4: Egg Factory Invariants

### `src/game/entities/EggFactory.ts`

Add tests for:

- `createEgg()` returns the requested level and explicit color
- Random color creation stays within configured color set
- Display size increases with egg level
- Physics body is created and labeled correctly

Implementation note:

- Avoid snapshot tests for canvas output
- Test structural invariants instead of pixel-perfect rendering

## Phase 5: Small Physics-Adjacent Helpers

If physics tuning keeps growing, extract pure helpers first and then test them, for example:

- spawn clamping
- weighted random bucket selection
- merge target position calculation
- frame-step accumulator logic

This is preferable to testing Matter.js simulation results directly in unit tests.

## What Not To Unit Test First

- Canvas drawing output
- Exact Matter.js stack behavior
- Pointer events on the full page
- ResizeObserver-driven layout behavior

Those belong later in manual testing or higher-level integration tests.

## Suggested File Layout

```text
tests/
  game/
    config/
      EggConfig.test.ts
    geometry/
      EggGeometry.test.ts
      EggGeometryMath.test.ts
    systems/
      MergeSystem.test.ts
    entities/
      EggFactory.test.ts
```

## Proposed Order of Implementation

1. Configure Vitest
2. Add tests for `EggConfig`
3. Add tests for geometry modules
4. Add tests for `MergeSystem`
5. Add invariant tests for `EggFactory`

## Success Criteria

- Tests run locally with a single command
- Pure gameplay logic has regression coverage
- Physics tuning changes can be made with confidence
- New gameplay rules can be added without relying only on manual browser testing
