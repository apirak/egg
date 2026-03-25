# Egg Game

Physics-based egg merge game built with Preact, TypeScript, and Matter.js.

## Overview

This project is an experimental Suika-style merge game where eggs:

- Spawn with weighted color probabilities
- Fall and stack under Matter.js physics
- Merge when two eggs of the same color and same level collide
- Progress through 6 levels per color
- Convert to ascended score when top-level eggs merge

The app is mobile-first and runs as a Vite web app.

## Emoji SVG

- https://twemoji-cheatsheet.vercel.app/

## Current Features

- Pre-rendered egg sprites for performance
- Parametric egg silhouette used for rendering and collision body shaping
- Fixed-step physics update loop for better stack stability
- Dense-stack tuning (sleeping, solver iteration tuning, static friction)
- Rapid spawn while pointer is held
- Merge system with cooldown to reduce repeated instant re-merges
- 5 colors x 6 levels collection model
- Weighted color spawn config:
  - Red: 2
  - Blue: 3
  - Green: 4
  - Yellow: 5
  - Gray: 6

## Tech Stack

- Preact
- TypeScript
- Vite
- Matter.js
- GSAP (available for reward/presentation animation work)
- Vitest (unit tests)

## Project Structure

```text
src/
  game/
    config/       # game constants and egg config
    core/         # physics world and frame loop
    entities/     # egg entity factory
    geometry/     # egg geometry math and helpers
    rendering/    # sprite generation
    systems/      # merge logic
  pages/
    Home/
    EggShape/
    EggCollection/
    Game/
tests/
  game/           # unit tests grouped by module
docs/             # implementation plans and design notes
```

## Routes

- `/` home page
- `/egg-shape` egg shape and math demo
- `/collection` egg collection view
- `/game` playable physics scene
- `/404` fallback page

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

## Scripts

```bash
pnpm dev         # start Vite dev server
pnpm build       # production build (with route prerender)
pnpm preview     # preview production build
pnpm test        # run unit tests once
pnpm test:watch  # run Vitest in watch mode
```

## Testing

Unit tests are placed in the `tests/` folder and currently focus on deterministic logic:

- egg config and weighted selection
- geometry calculations
- merge system rules and cooldown behavior

See `docs/unit-test-plan.md` for the planned expansion order.

## Gameplay Rules (Current)

- Eggs only merge when both conditions are true:
  - Same color
  - Same level
- Merge output is one egg at the next level
- Merging max-level eggs increments ascended count and removes the resulting body from active play

## Known Gaps

- Reward and ascension presentation can be expanded further
- Full gameplay fail-state (stack overflow/deadline flow) is not finalized
- Build currently reports existing CSS warnings unrelated to game logic

## Documentation

- `docs/implementation-steps.md` overall implementation status
- `docs/unit-test-plan.md` unit testing roadmap
- `docs/plan.md` high-level design prompt and scope
