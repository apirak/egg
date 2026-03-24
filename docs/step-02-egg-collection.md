# Step 2: Egg Collection Display

## Overview

Create a page that displays all 15 egg types (3 colors × 5 levels) in a grid layout, showing the complete collection of eggs.

## Goals

- Display all egg variations (colors and levels)
- Demonstrate that egg rendering works for all combinations
- Show size progression between levels
- Create a visually appealing collection view

## Egg Types to Display

### Colors (3)

1. Red
2. Blue
3. Green

### Levels (5) - with names

1. Level 1: "General" (smallest)
2. Level 2: "Dot" (1.2x size multiplier)
3. Level 3: "Wristband" (1.2x from previous)
4. Level 4: "Flash" (1.2x from previous)
5. Level 5: "Golden" (1.2x from previous, largest)

## Todo List

### Rendering System

- [x] Create `EggConfig` with all 15 egg configurations
  - [x] Define color constants (Red, Blue, Green)
  - [x] Define level configurations (1-5 with size multipliers)
  - [x] Calculate sizes: L1 base, L2 = 1.2x, L3 = 1.44x, L4 = 1.728x, L5 = 2.074x
- [x] Enhance `SpriteGenerator` to handle all egg types
  - [x] Generate sprites for all color/level combinations
  - [x] Cache generated sprites for reuse
  - [x] Handle different sizes properly

### Collection Page

- [x] Create `EggCollection` component/page
- [x] Implement grid layout for displaying eggs
  - [x] Organize by color/level in table layout
  - [x] Show level progression (L1-L5)
  - [x] Responsive layout for mobile
- [x] Add labels for each egg
  - [x] Show level labels in table rows
  - [x] Show color labels in table columns
- [x] Add visual polish
  - [x] White-focused layout with borders
  - [x] Clear table alignment and spacing
  - [x] Smooth rendering behavior

### Data Structure

- [x] Define `EggColor` type
- [x] Define `EggLevel` type (1-5)
- [x] Define `EggType` interface (color + level)
- [x] Define egg config exports and helpers

### UI/Routing

- [x] Add route `/collection` for this page
- [x] Add navigation link to this page
- [x] Create page header with title

### Types

- [ ] `EggColor`: 'red' | 'blue' | 'green'
- [ ] `EggLevel`: 1 | 2 | 3 | 4 | 5
- [ ] `EggType` interface
- [ ] `EggConfigItem` interface

### Testing

- [x] Verify all 15 eggs render correctly
- [x] Check colors are distinct and accurate
- [x] Verify size progression is visible
- [x] Test responsive layout on different screen sizes
- [x] TypeScript compiles without errors

## Implementation Notes (Current)

- Collection now shows a table with `Red | Green | Blue` columns and `L1-L5` rows.
- Collection sprite display uses gameplay size ratio from `EggConfig` to match game scale.
- Stats bar and old detail panel were removed to simplify the page.

## File Structure (New)

```
src/
  pages/
    EggCollection/
      index.tsx         # Collection page component
      style.css         # Page-specific styles
  game/
    config/
      EggConfig.ts      # All egg type configurations
      index.ts          # Barrel export
```

## Acceptance Criteria

- All 15 eggs are visible
- Colors are correct (Red, Blue, Green)
- Size progression is clear (L1 smallest → L5 largest)
- Grid layout is responsive
- TypeScript compiles cleanly
