# Step 3: Menu Navigation System

## Overview

Create a main menu and navigation system to access the three main pages: Egg Shape, Egg Collection, and Game.

## Goals

- Create a main menu/home page
- Implement navigation between all pages
- Provide clear visual feedback for current page
- Mobile-first responsive design

## Pages to Link

1. **Egg Shape** (`/egg-shape`) - From Step 1
2. **Egg Collection** (`/collection`) - From Step 2
3. **Game** (`/game`) - Placeholder for Step 4

## Todo List

### Navigation Component

- [x] Create `Navigation` component
  - [x] Add navigation links/buttons
  - [x] Show active page highlighting
  - [x] Mobile-responsive layout
- [x] Add Navigation to main App layout
- [x] Style with clean, game-appropriate design

### Menu/Home Page

- [x] Redesign `Home` page as main menu
  - [x] Add game title/logo
  - [x] Create large, tappable cards/buttons for each section
  - [x] Add icons or visual elements for each option
  - [x] Brief description for each page
- [x] Add "Start Game" as primary action

### Route Updates

- [x] Update App.tsx routing
  - [x] `/` → Menu/Home
  - [x] `/egg-shape` → Egg Shape Demo
  - [x] `/collection` → Egg Collection
  - [x] `/game` → Game
- [x] Add back button/navigation on sub-pages

### Styling

- [x] Create consistent color scheme
- [x] Add hover/active states for buttons
- [x] Ensure touch-friendly tap targets (min 44px)
- [x] Add smooth page transitions

### Components

- [ ] `MenuCard` component for menu items (optional)
- [x] `BackButton` component for sub-pages
- [x] Update header/navigation usage across pages

### Types

- [ ] Define `MenuItem` interface (optional)
- [ ] Define menu configuration array (optional)

### Testing

- [x] Test navigation between all pages
- [x] Verify back button works
- [x] Check mobile responsiveness
- [x] TypeScript compiles without errors

## Implementation Notes (Current)

- Home page simplified to clean white menu style.
- Back button added to Egg Shape and Collection pages.
- Game page was moved from placeholder into live physics sandbox.

## File Structure

```
src/
  components/
    Navigation.tsx    # Main nav component
    MenuCard.tsx      # Menu item card
    BackButton.tsx    # Back navigation
  pages/
    Home/
      index.tsx       # Redesigned as menu
      style.css       # Menu styles
    EggShape/
      index.tsx       # Add back button
    EggCollection/
      index.tsx       # Add back button
```

## Menu Configuration

```typescript
const menuItems: MenuItem[] = [
  {
    id: "game",
    title: "Play Game",
    description: "Start the egg merge game",
    route: "/game",
    icon: "🎮",
  },
  {
    id: "collection",
    title: "Egg Collection",
    description: "View all egg types",
    route: "/collection",
    icon: "🥚",
  },
  {
    id: "egg-shape",
    title: "Egg Geometry",
    description: "Learn about egg shapes",
    route: "/egg-shape",
    icon: "📐",
  },
];
```

## Acceptance Criteria

- Main menu displays on home page
- All three pages accessible via navigation
- Back button returns to menu
- Mobile-responsive design
- Clear visual feedback for active page
- TypeScript compiles cleanly
