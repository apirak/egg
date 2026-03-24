# Easter Egg Pattern Design

## Goal

Use flat base color eggs (no gradient, no top highlight) and add level-based Easter painting patterns.

## Shared Visual Rules

- Flat fill only for egg body.
- No glossy highlight ellipse on top.
- Keep pattern contrast readable on red/blue/green eggs.
- Pattern stays inside egg silhouette.

## Level Pattern Spec

### Level 1 - Solid Classic

- Style: plain dyed egg.
- Pattern: none.
- Purpose: clean baseline.

### Level 2 - Dots + Ring Band

- Style: beginner Easter paint.
- Pattern:
  - medium polka dots around center area
  - one thin horizontal ring band.
- Mood: playful and simple.

### Level 3 - Zigzag Bands

- Style: hand-painted decorative band.
- Pattern:
  - two horizontal bands
  - repeating zigzag line on each band
  - tiny accent dots between bands.
- Mood: more crafted detail.

### Level 4 - Diagonal Stripes + Flowers

- Style: festive spring egg.
- Pattern:
  - diagonal stripe set across shell
  - 3 simple flower stamps (4 petals + center).
- Mood: rich but still readable in motion.

### Level 5 - Patchwork Festival

- Style: premium Easter showcase egg.
- Pattern:
  - vertical + horizontal ribbon cross
  - edge stitches (small dots) on ribbons
  - symmetric diamonds and confetti accents.
- Mood: most detailed collectible look.

## Color Strategy

- Base: egg main color.
- Accent dark: base darkened by ~25-35%.
- Accent light: base lightened by ~25-45%.
- Neutral accent: white with partial alpha for contrast.

## Implementation Notes

- Use deterministic pattern placement (no random) for stable cached sprites.
- Draw pattern after base fill.
- Clip pattern drawing to egg shape path.
