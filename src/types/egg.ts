/**
 * Egg color types
 */
export type EggColor = "red" | "blue" | "green" | "yellow" | "gray";

/**
 * Egg levels (1-6)
 */
export type EggLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Egg type combining color and level
 */
export interface EggType {
  color: EggColor;
  level: EggLevel;
}

/**
 * Egg geometry configuration for physics body
 * An egg is constructed from two overlapping circles
 */
export interface EggGeometryConfig {
  /** Large circle radius (base of egg) */
  circleLargeRadius: number;
  /** Small circle radius (top of egg) */
  circleSmallRadius: number;
  /** Vertical offset of small circle from large circle center */
  circleSmallOffset: number;
}

/**
 * Tangent points between two circles
 * Used for drawing smooth Bezier curves
 */
export interface TangentPoints {
  /** Left tangent point on large circle */
  leftLarge: { x: number; y: number };
  /** Right tangent point on large circle */
  rightLarge: { x: number; y: number };
  /** Left tangent point on small circle */
  leftSmall: { x: number; y: number };
  /** Right tangent point on small circle */
  rightSmall: { x: number; y: number };
}

/**
 * Options for rendering egg sprites
 */
export interface EggRenderOptions {
  /** Fill color */
  fillColor: string;
  /** Stroke color */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Canvas scale factor */
  scale?: number;
}

/**
 * Pre-rendered egg sprite
 */
export interface EggSprite {
  /** Canvas element containing the rendered egg */
  canvas: HTMLCanvasElement;
  /** Width of the sprite */
  width: number;
  /** Height of the sprite */
  height: number;
}
