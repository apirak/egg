# Step 1: Egg Shape Geometry

## Overview
Create a page that demonstrates and visualizes the egg shape geometry using the compound body approach (two overlapping circles).

## Goals
- Visualize how an egg is constructed from two circles
- Show the mathematical approach to creating smooth egg silhouettes
- Demonstrate the Bezier curve algorithm for egg shapes

## Technical Approach
According to the plan, an egg in Matter.js is represented as a compound body consisting of:
1. **circleLarge**: Base of the egg
2. **circleSmall**: Top of the egg, positioned slightly above

The smooth silhouette is created by:
- Calculating tangent points between the two circles
- Drawing two Bezier curves connecting these points
- This forms the final eggshell shape

## Todo List

### Core Rendering
- [ ] Create `EggShapeDemo` component/page
- [ ] Implement offscreen canvas for egg rendering
- [ ] Create `EggGeometry` class for calculating egg shape
  - [ ] Define circleLarge and circleSmall properties
  - [ ] Calculate tangent points between circles
  - [ ] Implement Bezier curve algorithm
- [ ] Create `SpriteGenerator` for pre-rendering egg sprites
  - [ ] Generate offscreen canvas
  - [ ] Draw smooth egg silhouette
  - [ ] Export as reusable canvas/image

### Visualization
- [ ] Draw the two circles (outline only) to show construction
- [ ] Draw the smooth egg silhouette overlay
- [ ] Add labels/annotations for circleLarge and circleSmall
- [ ] Show tangent points visualization
- [ ] Add interactive controls (optional):
  - [ ] Slider for circle sizes
  - [ ] Slider for overlap amount

### UI/Routing
- [ ] Add route `/egg-shape` for this page
- [ ] Create basic page layout with title and description
- [ ] Add canvas element for rendering

### Types
- [ ] Define `EggGeometryConfig` interface
- [ ] Define `EggRenderOptions` interface
- [ ] Add JSDoc comments for clarity

### Testing
- [ ] Verify egg shape looks correct visually
- [ ] Test that Bezier curves connect smoothly
- [ ] Ensure TypeScript compiles without errors

## File Structure (New)
```
src/
  pages/
    EggShape/
      index.tsx         # Main page component
      style.css         # Page-specific styles
  game/
    geometry/
      EggGeometry.ts    # Egg shape calculations
    rendering/
      SpriteGenerator.ts # Pre-rendering logic
  types/
    egg.ts              # Egg-related type definitions
```

## Acceptance Criteria
- Page renders without errors
- Egg shape is visibly egg-like (not just circles)
- Two construction circles are visible
- Smooth silhouette connects the circles
- TypeScript compiles cleanly
