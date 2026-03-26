import type { EggColor, EggLevel, EggType } from "../../types/egg";

/**
 * Egg level names and descriptions
 */
export const EGG_LEVEL_INFO: Record<
  EggLevel,
  { name: string; description: string }
> = {
  1: { name: "General", description: "Basic egg" },
  2: { name: "Dot", description: "Growing pattern" },
  3: { name: "Wristband", description: "Getting stronger" },
  4: { name: "Flash", description: "Almost there" },
  5: { name: "Golden", description: "High tier" },
  6: { name: "Royal", description: "Maximum power" },
};

/**
 * Egg color information
 */
export const EGG_COLOR_INFO: Record<EggColor, { name: string; emoji: string }> =
  {
    red: { name: "Red", emoji: "🔴" },
    blue: { name: "Blue", emoji: "🔵" },
    green: { name: "Green", emoji: "🟢" },
    yellow: { name: "Yellow", emoji: "🟡" },
    gray: { name: "Gray", emoji: "⚪" },
  };

/**
 * Size multiplier for each level (1.2x per level)
 */
const BASE_SIZE_MULTIPLIER = 2;
export const EGG_SIZE_MULTIPLIERS: Record<EggLevel, number> = {
  1: BASE_SIZE_MULTIPLIER * 1.0,
  2: BASE_SIZE_MULTIPLIER * 1.2,
  3: BASE_SIZE_MULTIPLIER * 1.4,
  4: BASE_SIZE_MULTIPLIER * 1.8,
  5: BASE_SIZE_MULTIPLIER * 2.2,
  6: BASE_SIZE_MULTIPLIER * 2.6,
};

/**
 * Base sprite render scale used while pre-rendering eggs.
 */
export const EGG_SPRITE_RENDER_SCALE = 3;

/**
 * Display ratio for eggs during actual gameplay.
 * 1 means full sprite size, 1/8 means render at one eighth.
 */
export const GAMEPLAY_EGG_SIZE_RATIO = 1 / 6;

/**
 * All possible egg color combinations
 */
export const EGG_COLORS: EggColor[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "gray",
];

/**
 * Relative spawn weight for each egg color.
 * Example: a weight of 6 means the color should appear about 6 times
 * out of the total combined weight across many spawns.
 */
export const EGG_COLOR_WEIGHTS: Record<EggColor, number> = {
  red: 2,
  blue: 3,
  green: 4,
  yellow: 5,
  gray: 6,
};

export const EGG_COLOR_WEIGHT_TOTAL = EGG_COLORS.reduce(
  (total, color) => total + EGG_COLOR_WEIGHTS[color],
  0,
);

export function pickWeightedEggColor(
  randomValue: number = Math.random(),
): EggColor {
  const target = randomValue * EGG_COLOR_WEIGHT_TOTAL;
  let cumulative = 0;

  for (const color of EGG_COLORS) {
    cumulative += EGG_COLOR_WEIGHTS[color];
    if (target < cumulative) {
      return color;
    }
  }

  return EGG_COLORS[EGG_COLORS.length - 1];
}

/**
 * All possible egg levels
 */
export const EGG_LEVELS: EggLevel[] = [1, 2, 3, 4, 5, 6];

/**
 * Default egg formula parameters
 * Used for rendering egg sprites and geometry
 */
export const DEFAULT_EGG_FORMULA = {
  width: 22, // Parameter 'a' - controls egg width
  height: 28, // Parameter 'b' - controls egg height
  asymmetry: 0.15, // Parameter 'k' - controls asymmetry
};

/**
 * Generate all egg type combinations (5 colors × 6 levels = 30 total)
 */
export function getAllEggTypes(): EggType[] {
  const types: EggType[] = [];
  for (const color of EGG_COLORS) {
    for (const level of EGG_LEVELS) {
      types.push({ color, level });
    }
  }
  return types;
}

/**
 * Get a unique ID for an egg type
 */
export function getEggId(type: EggType): string {
  return `${type.color}-L${type.level}`;
}

/**
 * Get display name for an egg type
 */
export function getEggDisplayName(type: EggType): string {
  const colorInfo = EGG_COLOR_INFO[type.color];
  const levelInfo = EGG_LEVEL_INFO[type.level];
  return `${colorInfo.name} ${levelInfo.name} (L${type.level})`;
}

/**
 * Get egg size in pixels for a given level
 */
export function getEggSize(level: EggLevel): number {
  const baseSize = 40; // Base size in pixels
  return baseSize * EGG_SIZE_MULTIPLIERS[level];
}

/**
 * Convert a sprite pixel size to gameplay display size.
 */
export function getGameplayEggSize(sizePx: number): number {
  return Math.max(1, Math.round(sizePx * GAMEPLAY_EGG_SIZE_RATIO));
}

/**
 * Egg configuration data for all 30 types
 */
export const ALL_EGG_CONFIGS = getAllEggTypes();
