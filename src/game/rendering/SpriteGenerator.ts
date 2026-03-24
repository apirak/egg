import {
  generateEggPoints,
  getEggDimensions,
  DEFAULT_EGG_MATH,
  type EggParametricConfig,
} from "../geometry/EggGeometryMath";
import type { EggSprite, EggRenderOptions } from "../../types/egg";
import {
  EGG_SIZE_MULTIPLIERS,
  EGG_SPRITE_RENDER_SCALE,
} from "../config/EggConfig";
import type { EggLevel } from "../../types/egg";

/**
 * Default render options for egg sprites
 */
const DEFAULT_RENDER_OPTIONS: Required<Omit<EggRenderOptions, "fillColor">> = {
  strokeColor: "#000000",
  strokeWidth: 0,
  scale: EGG_SPRITE_RENDER_SCALE,
};

/**
 * Color mappings for egg types
 */
export const EGG_COLORS = {
  red: {
    light: "#ff6b6b",
    main: "#e74c3c",
    dark: "#c0392b",
  },
  blue: {
    light: "#74b9ff",
    main: "#3498db",
    dark: "#2980b9",
  },
  green: {
    light: "#55efc4",
    main: "#2ecc71",
    dark: "#27ae60",
  },
} as const;

/**
 * SpriteGenerator class
 *
 * Pre-renders egg sprites to offscreen canvas elements.
 * This approach ensures 60FPS performance by avoiding repeated geometry calculations.
 *
 * Uses parametric equations for smooth, mathematically accurate egg shapes.
 */
export class SpriteGenerator {
  private cache: Map<string, EggSprite> = new Map();

  private readonly patternAreaPadding = 4;

  private readonly levelPatternOrder: Record<
    EggLevel,
    Array<"base" | "band" | "motif" | "accent">
  > = {
    1: ["base"],
    2: ["band", "motif"],
    3: ["band", "motif", "accent"],
    4: ["base", "motif", "accent"],
    5: ["band", "motif", "accent"],
  };

  /**
   * Generate an egg sprite with the given options
   *
   * @param options - Render options including fill color
   * @param level - Egg level (1-5), affects size (default: 1)
   * @returns Pre-rendered egg sprite
   */
  generateSprite(options: EggRenderOptions, level: number = 1): EggSprite {
    const opts = { ...DEFAULT_RENDER_OPTIONS, ...options };
    const cacheKey = this.getCacheKey(opts, level);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Create new sprite
    const sprite = this.renderEgg(opts, level);
    this.cache.set(cacheKey, sprite);

    return sprite;
  }

  /**
   * Get sprite for a specific egg color and level
   *
   * @param color - Egg color ('red', 'blue', 'green')
   * @param level - Egg level (1-5)
   * @param shade - Color shade ('light', 'main', 'dark')
   * @returns Pre-rendered egg sprite
   */
  getSpriteForColor(
    color: keyof typeof EGG_COLORS,
    level: number = 1,
    shade: keyof typeof EGG_COLORS.red = "main",
  ): EggSprite {
    return this.generateSprite(
      {
        fillColor: EGG_COLORS[color][shade],
        strokeColor: EGG_COLORS[color].dark,
      },
      level,
    );
  }

  /**
   * Clear the sprite cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache key for render options
   */
  private getCacheKey(
    options: Required<EggRenderOptions>,
    level: number,
  ): string {
    return `${options.fillColor}-${options.strokeColor}-${options.strokeWidth}-${options.scale}-${level}`;
  }

  /**
   * Render egg to offscreen canvas
   */
  private renderEgg(
    options: Required<EggRenderOptions>,
    level: number,
  ): EggSprite {
    // Get egg configuration with level multiplier
    const levelKey = Math.max(1, Math.min(5, level)) as EggLevel;
    const levelMultiplier = EGG_SIZE_MULTIPLIERS[levelKey] || 1.0;
    const config: EggParametricConfig = {
      ...DEFAULT_EGG_MATH,
      a: DEFAULT_EGG_MATH.a * levelMultiplier,
      b: DEFAULT_EGG_MATH.b * levelMultiplier,
    };

    const points = generateEggPoints(config, 120);
    const dimensions = getEggDimensions(config);
    const { scale, fillColor, strokeColor, strokeWidth } = options;

    // Calculate canvas size with padding
    const padding = 8;
    const width = dimensions.width * scale + padding * 2;
    const height = dimensions.height * scale + padding * 2;

    // Create offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Center position
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw egg silhouette
    this.drawEggShape(
      ctx,
      points,
      centerX,
      centerY,
      scale,
      fillColor,
      strokeColor,
      strokeWidth,
    );

    // Draw level-specific pattern
    this.drawLevelPattern(
      ctx,
      centerX,
      centerY,
      points,
      config,
      scale,
      level,
      fillColor,
    );

    return {
      canvas,
      width,
      height,
    };
  }

  /**
   * Draw egg shape from parametric points
   */
  private drawEggShape(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    centerX: number,
    centerY: number,
    scale: number,
    fillColor: string,
    strokeColor: string,
    strokeWidth: number,
  ): void {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    ctx.beginPath();

    // Move to first point
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
    }

    // Draw smooth curve through all points
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();

    // Flat fill color (no gradient)
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Add subtle stroke
    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth / scale;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draw level-specific pattern on the egg
   * L1: Solid
   * L2: Dots + ring band
   * L3: Zigzag bands
   * L4: Diagonal stripes + flowers
   * L5: Patchwork festival
   */
  private drawLevelPattern(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    points: { x: number; y: number }[],
    config: EggParametricConfig,
    scale: number,
    level: number,
    fillColor: string,
  ): void {
    if (level === 1) return; // L1 has no pattern

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    // Keep all pattern paint inside the egg silhouette.
    this.traceEggPath(ctx, points);
    ctx.clip();

    const darkerColor = this.darkenColor(fillColor, 30);
    const lighterColor = this.lightenColor(fillColor, 40);
    const area = {
      left: -config.a - this.patternAreaPadding,
      right: config.a + this.patternAreaPadding,
      top: -config.b - this.patternAreaPadding,
      bottom: config.b + this.patternAreaPadding,
    };

    const levelKey = Math.max(1, Math.min(5, level)) as EggLevel;
    const layers = this.levelPatternOrder[levelKey] ?? [];

    for (const layer of layers) {
      this.drawPatternLayer(
        ctx,
        levelKey,
        layer,
        config,
        area,
        lighterColor,
        darkerColor,
      );
    }

    ctx.restore();
  }

  private drawPatternLayer(
    ctx: CanvasRenderingContext2D,
    level: EggLevel,
    layer: "base" | "band" | "motif" | "accent",
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    lightColor: string,
    darkColor: string,
  ): void {
    if (level === 2) {
      if (layer === "band") this.drawLevel2Band(ctx, config, darkColor);
      if (layer === "motif") this.drawLevel2Dots(ctx, config, area, lightColor);
      return;
    }

    if (level === 3) {
      if (layer === "band") this.drawLevel3Bands(ctx, config, area, darkColor);
      if (layer === "motif")
        this.drawLevel3Zigzags(ctx, config, area, lightColor);
      if (layer === "accent") this.drawLevel3AccentDots(ctx, config);
      return;
    }

    if (level === 4) {
      if (layer === "base")
        this.drawLevel4Stripes(ctx, config, area, lightColor);
      if (layer === "motif") this.drawLevel4Flowers(ctx, config, darkColor);
      return;
    }

    if (level === 5) {
      if (layer === "band")
        this.drawLevel5Ribbons(ctx, config, area, lightColor);
      if (layer === "motif") this.drawLevel5Diamonds(ctx, config, darkColor);
      if (layer === "accent")
        this.drawLevel5StitchesAndConfetti(ctx, config, darkColor);
    }
  }

  /**
   * Draw dot pattern (L2)
   */
  private drawLevel2Band(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    darkColor: string,
  ): void {
    // Full-width ring band first, then clip keeps only egg interior.
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(
      0,
      config.b * 0.03,
      config.a * 1.35,
      config.b * 0.2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  private drawLevel2Dots(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    lightColor: string,
  ): void {
    const dotSize = 2.2;
    const xStep = Math.max(6, config.a * 0.3);
    const yStep = Math.max(6, config.b * 0.26);

    // Dot field across full rectangular area.
    ctx.fillStyle = lightColor;
    for (let y = area.top + yStep * 0.5; y <= area.bottom; y += yStep) {
      for (let x = area.left + xStep * 0.5; x <= area.right; x += xStep) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * Draw wristband pattern (L3)
   */
  private drawLevel3Bands(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    darkColor: string,
  ): void {
    const bands = [-config.b * 0.22, config.b * 0.12];

    for (const y of bands) {
      // Paint full horizontal strip then crop with egg mask.
      ctx.fillStyle = darkColor;
      ctx.fillRect(
        area.left,
        y - config.b * 0.11,
        area.right - area.left,
        config.b * 0.22,
      );
    }
  }

  private drawLevel3Zigzags(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    lightColor: string,
  ): void {
    const bands = [-config.b * 0.22, config.b * 0.12];

    for (const y of bands) {
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      const left = area.left;
      const right = area.right;
      const step = (right - left) / 10;
      let x = left;
      ctx.moveTo(x, y);
      for (let i = 0; i < 10; i++) {
        const nextX = x + step;
        const peakY = i % 2 === 0 ? y - config.b * 0.045 : y + config.b * 0.045;
        ctx.lineTo((x + nextX) / 2, peakY);
        ctx.lineTo(nextX, y);
        x = nextX;
      }
      ctx.stroke();
    }
  }

  private drawLevel3AccentDots(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
  ): void {
    // Accent dots between bands
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(i * config.a * 0.2, -config.b * 0.02, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Draw flash/lightning pattern (L4)
   */
  private drawLevel4Stripes(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    lightColor: string,
  ): void {
    // Diagonal stripe set
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = config.a * 0.13;
    for (let i = -6; i <= 6; i++) {
      const offset = i * config.a * 0.22;
      ctx.beginPath();
      ctx.moveTo(area.left + offset, area.top);
      ctx.lineTo(area.right + offset, area.bottom);
      ctx.stroke();
    }
  }

  private drawLevel4Flowers(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    darkColor: string,
  ): void {
    // Flower stamps
    this.drawFlowerStamp(
      ctx,
      -config.a * 0.35,
      -config.b * 0.25,
      config.a * 0.09,
      darkColor,
      "#ffffff",
    );
    this.drawFlowerStamp(
      ctx,
      config.a * 0.1,
      config.b * 0.02,
      config.a * 0.1,
      darkColor,
      "#ffffff",
    );
    this.drawFlowerStamp(
      ctx,
      config.a * 0.34,
      config.b * 0.26,
      config.a * 0.08,
      darkColor,
      "#ffffff",
    );
  }

  /**
   * Draw golden/sparkle pattern (L5)
   */
  private drawLevel5Ribbons(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    lightColor: string,
  ): void {
    // Cross ribbons (patchwork style)
    ctx.fillStyle = lightColor;
    ctx.fillRect(
      -config.a * 0.22,
      area.top,
      config.a * 0.44,
      area.bottom - area.top,
    );
    ctx.fillRect(
      area.left,
      -config.b * 0.18,
      area.right - area.left,
      config.b * 0.36,
    );
  }

  private drawLevel5StitchesAndConfetti(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    darkColor: string,
  ): void {
    // Ribbon stitches
    ctx.fillStyle = darkColor;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.arc(0, i * config.b * 0.12, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(i * config.a * 0.16, 0, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Confetti accents (deterministic)
    const confetti = [
      [-0.3, -0.08],
      [0.32, -0.1],
      [-0.28, 0.12],
      [0.27, 0.16],
      [0.0, -0.35],
      [0.0, 0.35],
    ];
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    for (const [nx, ny] of confetti) {
      ctx.beginPath();
      ctx.arc(config.a * nx, config.b * ny, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawLevel5Diamonds(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    darkColor: string,
  ): void {
    // Symmetric diamonds
    this.drawDiamond(
      ctx,
      -config.a * 0.48,
      -config.b * 0.42,
      config.a * 0.12,
      darkColor,
    );
    this.drawDiamond(
      ctx,
      config.a * 0.48,
      -config.b * 0.42,
      config.a * 0.12,
      darkColor,
    );
    this.drawDiamond(
      ctx,
      -config.a * 0.48,
      config.b * 0.42,
      config.a * 0.12,
      darkColor,
    );
    this.drawDiamond(
      ctx,
      config.a * 0.48,
      config.b * 0.42,
      config.a * 0.12,
      darkColor,
    );
  }

  private drawFlowerStamp(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    petalRadius: number,
    petalColor: string,
    centerColor: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = petalColor;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * petalRadius,
        Math.sin(angle) * petalRadius,
        petalRadius * 0.7,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.fillStyle = centerColor;
    ctx.beginPath();
    ctx.arc(0, 0, petalRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawDiamond(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
  }

  private traceEggPath(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
  ): void {
    ctx.beginPath();
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.closePath();
  }

  /**
   * Lighten a color by a percentage
   */
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  /**
   * Darken a color by a percentage
   */
  private darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }
}

// Singleton instance
let spriteGeneratorInstance: SpriteGenerator | null = null;

/**
 * Get the singleton SpriteGenerator instance
 */
export function getSpriteGenerator(): SpriteGenerator {
  if (!spriteGeneratorInstance) {
    spriteGeneratorInstance = new SpriteGenerator();
  }
  return spriteGeneratorInstance;
}
