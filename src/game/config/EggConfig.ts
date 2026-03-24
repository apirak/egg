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
  5: { name: "Golden", description: "Maximum power" },
};

/**
 * Egg color information
 */
export const EGG_COLOR_INFO: Record<EggColor, { name: string; emoji: string }> =
  {
    red: { name: "Red", emoji: "🔴" },
    blue: { name: "Blue", emoji: "🔵" },
    green: { name: "Green", emoji: "🟢" },
  };

/**
 * Size multiplier for each level (1.2x per level)
 */
export const EGG_SIZE_MULTIPLIERS: Record<EggLevel, number> = {
  1: 1.0,
  2: 1.2,
  3: 1.44,
  4: 1.728,
  5: 2.074,
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
export const EGG_COLORS: EggColor[] = ["red", "blue", "green"];

/**
 * All possible egg levels
 */
export const EGG_LEVELS: EggLevel[] = [1, 2, 3, 4, 5];

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
 * Generate all egg type combinations (3 colors × 5 levels = 15 total)
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
 * Egg configuration data for all 15 types
 */
export const ALL_EGG_CONFIGS = getAllEggTypes();
