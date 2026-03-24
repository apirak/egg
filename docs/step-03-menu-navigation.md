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
- [ ] Create `Navigation` component
  - [ ] Add navigation links/buttons
  - [ ] Show active page highlighting
  - [ ] Mobile-responsive layout
- [ ] Add Navigation to main App layout
- [ ] Style with clean, game-appropriate design

### Menu/Home Page
- [ ] Redesign `Home` page as main menu
  - [ ] Add game title/logo
  - [ ] Create large, tappable cards for each section
  - [ ] Add icons or visual elements for each option
  - [ ] Brief description for each page
- [ ] Add "Start Game" as primary action

### Route Updates
- [ ] Update App.tsx routing
  - [ ] `/` → Menu/Home
  - [ ] `/egg-shape` → Egg Shape Demo
  - [ ] `/collection` → Egg Collection
  - [ ] `/game` → Game (placeholder)
- [ ] Add back button/navigation on sub-pages

### Styling
- [ ] Create consistent color scheme
- [ ] Add hover/active states for buttons
- [ ] Ensure touch-friendly tap targets (min 44px)
- [ ] Add smooth page transitions

### Components
- [ ] `MenuCard` component for menu items
- [ ] `BackButton` component for sub-pages
- [ ] Update `Header` to include simple nav

### Types
- [ ] Define `MenuItem` interface
- [ ] Define menu configuration array

### Testing
- [ ] Test navigation between all pages
- [ ] Verify back button works
- [ ] Check mobile responsiveness
- [ ] TypeScript compiles without errors

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
    id: 'game',
    title: 'Play Game',
    description: 'Start the egg merge game',
    route: '/game',
    icon: '🎮'
  },
  {
    id: 'collection',
    title: 'Egg Collection',
    description: 'View all egg types',
    route: '/collection',
    icon: '🥚'
  },
  {
    id: 'egg-shape',
    title: 'Egg Geometry',
    description: 'Learn about egg shapes',
    route: '/egg-shape',
    icon: '📐'
  }
]
```

## Acceptance Criteria
- Main menu displays on home page
- All three pages accessible via navigation
- Back button returns to menu
- Mobile-responsive design
- Clear visual feedback for active page
- TypeScript compiles cleanly
