# Step 2: Egg Collection Display

## Overview

Create a page that displays all 30 egg types (5 colors × 6 levels) in a table layout, showing the complete collection of eggs.

## Goals

- Display all egg variations (colors and levels)
- Demonstrate that egg rendering works for all combinations
- Show size progression between levels
- Create a visually appealing collection view

## Egg Types to Display

### Colors (5)

1. Red
2. Blue
3. Green
4. Yellow
5. Gray

### Levels (6) - with names

1. Level 1: "General" (smallest)
2. Level 2: "Dot" (1.2x size multiplier)
3. Level 3: "Wristband" (1.2x from previous)
4. Level 4: "Flash" (1.2x from previous)
5. Level 5: "Golden" (1.2x from previous, largest)
6. Level 6: "Royal" (1.2x from previous)

## Todo List

### Rendering System

- [x] Create `EggConfig` with all 30 egg configurations
  - [x] Define color constants (Red, Blue, Green, Yellow, Gray)
  - [x] Define level configurations (1-6 with size multipliers)
  - [x] Calculate sizes: L1 base, L2 = 1.2x, L3 = 1.44x, L4 = 1.728x, L5 = 2.074x, L6 = 2.4888x
- [x] Enhance `SpriteGenerator` to handle all egg types
  - [x] Generate sprites for all color/level combinations
  - [x] Cache generated sprites for reuse
  - [x] Handle different sizes properly

### Collection Page

- [x] Create `EggCollection` component/page
- [x] Implement grid layout for displaying eggs
  - [x] Organize by color/level in table layout
  - [x] Show level progression (L1-L6)
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

- [ ] `EggColor`: 'red' | 'blue' | 'green' | 'yellow' | 'gray'
- [ ] `EggLevel`: 1 | 2 | 3 | 4 | 5 | 6
- [ ] `EggType` interface
- [ ] `EggConfigItem` interface

### Testing

- [x] Verify all 30 eggs render correctly
- [x] Check colors are distinct and accurate
- [x] Verify size progression is visible
- [x] Test responsive layout on different screen sizes
- [x] TypeScript compiles without errors

## Implementation Notes (Current)

- Collection now shows a table with `Red | Blue | Green | Yellow | Gray` columns and `L1-L6` rows.
- Collection sprite display uses gameplay size ratio from `EggConfig` to match game scale.
- Stats bar and old detail panel were removed to simplify the page.
- L6 eggs are solid-color and render one large random Twemoji as the reveal motif.

## File Structure (New)

```text
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

- All 30 eggs are visible
- Colors are correct (Red, Blue, Green, Yellow, Gray)
- Size progression is clear (L1 smallest → L6 largest)
- Grid layout is responsive
- TypeScript compiles cleanly
