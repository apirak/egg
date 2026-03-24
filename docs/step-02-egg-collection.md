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
- [ ] Create `EggConfig` with all 15 egg configurations
  - [ ] Define color constants (Red, Blue, Green)
  - [ ] Define level configurations (1-5 with size multipliers)
  - [ ] Calculate sizes: L1 base, L2 = 1.2x, L3 = 1.44x, L4 = 1.728x, L5 = 2.074x
- [ ] Enhance `SpriteGenerator` to handle all egg types
  - [ ] Generate sprites for all color/level combinations
  - [ ] Cache generated sprites for reuse
  - [ ] Handle different sizes properly

### Collection Page
- [ ] Create `EggCollection` component/page
- [ ] Implement grid layout for displaying eggs
  - [ ] Organize by color (rows or sections)
  - [ ] Show level progression (1-5 left to right)
  - [ ] Responsive grid for mobile
- [ ] Add labels for each egg
  - [ ] Show level name (e.g., "L2 Dot")
  - [ ] Show color name
- [ ] Add visual polish
  - [ ] Card-style background for each egg
  - [ ] Hover effects
  - [ ] Smooth transitions

### Data Structure
- [ ] Define `EggColor` enum type
- [ ] Define `EggLevel` enum type (1-5)
- [ ] Define `EggType` interface (color + level)
- [ ] Define `EggConfig` data array

### UI/Routing
- [ ] Add route `/collection` for this page
- [ ] Add navigation link to this page
- [ ] Create page header with title

### Types
- [ ] `EggColor`: 'red' | 'blue' | 'green'
- [ ] `EggLevel`: 1 | 2 | 3 | 4 | 5
- [ ] `EggType` interface
- [ ] `EggConfigItem` interface

### Testing
- [ ] Verify all 15 eggs render correctly
- [ ] Check colors are distinct and accurate
- [ ] Verify size progression is visible
- [ ] Test responsive layout on different screen sizes
- [ ] TypeScript compiles without errors

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
