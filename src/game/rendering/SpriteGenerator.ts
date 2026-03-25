import {
  generateEggPoints,
  getEggDimensions,
  DEFAULT_EGG_MATH,
  type EggParametricConfig,
} from "../geometry/EggGeometryMath";
import type { EggSprite, EggRenderOptions, EggColor } from "../../types/egg";
import {
  EGG_SIZE_MULTIPLIERS,
  EGG_SPRITE_RENDER_SCALE,
} from "../config/EggConfig";
import type { EggLevel } from "../../types/egg";
import { LEVEL6_EMOJI_SETS } from "../../lib/cardData";

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
    light: "#fbaab3",
    main: "#f87583", // Deep Salmon Pink
    dark: "#d95f6f",
  },
  blue: {
    light: "#74d9ef",
    main: "#03aad6", // Cerulean Blue
    dark: "#0289ad",
  },
  green: {
    light: "#bfd96a",
    main: "#95bb10", // Citrus Green
    dark: "#708c0c",
  },
  yellow: {
    light: "#fff3a6",
    main: "#fee759", // Mustard Yellow
    dark: "#d8c54a",
  },
  gray: {
    light: "#c4c4ba",
    main: "#9e9e92", // Stardust Gray
    dark: "#77776f",
  },
} as const;

const TWEMOJI_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/";

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

  private twemojiLoadCache: Map<string, Promise<HTMLImageElement>> = new Map();

  private readonly patternAreaPadding = 4;

  private readonly levelPatternOrder: Record<
    EggLevel,
    Array<"base" | "band" | "motif" | "accent">
  > = {
    1: ["base"],
    2: ["motif"],
    3: ["band", "motif", "accent"],
    4: ["base", "motif", "accent"],
    5: ["band", "motif", "accent"],
    6: [],
  };

  /**
   * Generate an egg sprite with the given options
   *
   * @param options - Render options including fill color
   * @param level - Egg level (1-6), affects size (default: 1)
   * @returns Pre-rendered egg sprite
   */
  generateSprite(
    options: EggRenderOptions,
    level: number = 1,
    color: EggColor = "red",
    level6Emoji?: string,
  ): EggSprite {
    const opts = { ...DEFAULT_RENDER_OPTIONS, ...options };

    // Level 6 should feel like a reveal reward, so do not share one cached sprite.
    if (level === 6) {
      return this.renderEgg(opts, level, color, level6Emoji);
    }

    const cacheKey = this.getCacheKey(opts, level);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Create new sprite
    const sprite = this.renderEgg(opts, level, color, level6Emoji);
    this.cache.set(cacheKey, sprite);

    return sprite;
  }

  /**
   * Get sprite for a specific egg color and level
   *
   * @param color - Egg color ('red', 'blue', 'green')
   * @param level - Egg level (1-6)
   * @param shade - Color shade ('light', 'main', 'dark')
   * @returns Pre-rendered egg sprite
   */
  getSpriteForColor(
    color: keyof typeof EGG_COLORS,
    level: number = 1,
    shade: keyof typeof EGG_COLORS.red = "main",
    level6Emoji?: string,
  ): EggSprite {
    return this.generateSprite(
      {
        fillColor: EGG_COLORS[color][shade],
        strokeColor: EGG_COLORS[color].dark,
      },
      level,
      color,
      level6Emoji,
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
    color: EggColor,
    level6Emoji?: string,
  ): EggSprite {
    // Get egg configuration with level multiplier
    const levelKey = Math.max(1, Math.min(6, level)) as EggLevel;
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

    if (levelKey === 6) {
      this.drawLevel6Twemoji(
        ctx,
        points,
        centerX,
        centerY,
        scale,
        config,
        color,
        level6Emoji,
      );
    }

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
   * L6: Solid color + random Twemoji decals
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
    if (level === 1 || level === 6) return; // L1/L6 keep a flat fill

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

    const levelKey = Math.max(1, Math.min(6, level)) as EggLevel;
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
        this.drawLevel4Stripes(ctx, config, area, lightColor, darkColor);
      if (layer === "motif")
        this.drawLevel4Flowers(ctx, config, darkColor, lightColor);
      return;
    }

    if (level === 5) {
      if (layer === "band")
        this.drawLevel5Ribbons(ctx, config, area, lightColor);
      if (layer === "motif") this.drawLevel5Diamonds(ctx, config, darkColor);
      if (layer === "accent")
        this.drawLevel5StitchesAndConfetti(ctx, config, darkColor);
      return;
    }
  }

  private drawLevel2Dots(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    area: { left: number; right: number; top: number; bottom: number },
    lightColor: string,
  ): void {
    // Random polka-dot style (position + size) for L2.
    const dotCount = Math.max(22, Math.round((config.a * config.b) / 9));

    for (let i = 0; i < dotCount; i++) {
      const x = area.left + Math.random() * (area.right - area.left);
      const y = area.top + Math.random() * (area.bottom - area.top);
      const radius = 1.1 + Math.random() * 2.6;
      const alpha = 0.52 + Math.random() * 0.38;

      ctx.fillStyle = this.withAlpha(lightColor, alpha);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
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
    darkColor: string,
  ): void {
    // Triangle mosaic (connected triangles).
    const triW = Math.max(8, config.a * 0.42);
    const triH = Math.max(8, config.b * 0.25);
    const rows = Math.ceil((area.bottom - area.top) / triH) + 1;
    const cols = Math.ceil((area.right - area.left) / triW) + 2;

    for (let r = 0; r < rows; r++) {
      const y = area.top + r * triH;
      const offsetX = r % 2 === 0 ? 0 : triW / 2;

      for (let c = -1; c < cols; c++) {
        const x = area.left + c * triW + offsetX;
        const upward = (r + c) % 2 === 0;

        ctx.beginPath();
        if (upward) {
          ctx.moveTo(x, y + triH);
          ctx.lineTo(x + triW / 2, y);
          ctx.lineTo(x + triW, y + triH);
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x + triW / 2, y + triH);
          ctx.lineTo(x + triW, y);
        }
        ctx.closePath();
        ctx.fillStyle = (r + c) % 3 === 0 ? darkColor : lightColor;
        ctx.fill();
      }
    }
  }

  private drawLevel4Flowers(
    ctx: CanvasRenderingContext2D,
    config: EggParametricConfig,
    darkColor: string,
    lightColor: string,
  ): void {
    // Accent triangle outlines over the mosaic.
    ctx.strokeStyle = this.withAlpha(lightColor, 0.85);
    ctx.lineWidth = 1.4;
    const accent = [
      [-0.45, -0.34],
      [0.05, -0.05],
      [0.42, 0.28],
      [-0.22, 0.34],
    ];
    for (const [nx, ny] of accent) {
      const cx = config.a * nx;
      const cy = config.b * ny;
      const size = config.a * 0.12;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 0.9, cy + size * 0.75);
      ctx.lineTo(cx - size * 0.9, cy + size * 0.75);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.fillStyle = this.withAlpha(darkColor, 0.35);
    for (const [nx, ny] of accent) {
      ctx.beginPath();
      ctx.arc(config.a * nx, config.b * ny, config.a * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
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

  private drawLevel6Twemoji(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    centerX: number,
    centerY: number,
    scale: number,
    config: EggParametricConfig,
    color: EggColor,
    explicitEmoji?: string,
  ): void {
    const slot = {
      x: 0,
      y: 0.03,
      size: 0.62,
      rotation: (Math.random() - 0.5) * 0.28,
    };

    const emoji = explicitEmoji ?? this.getRandomLevel6Emoji(color);
    const twemojiCode = this.toTwemojiCode(emoji);
    const url = `${TWEMOJI_CDN_BASE}${twemojiCode}.svg`;

    this.getTwemojiImage(url)
      .then((image) => {
        this.drawTwemojiClipped(
          ctx,
          points,
          centerX,
          centerY,
          scale,
          config,
          slot,
          image,
        );
      })
      .catch(() => {
        this.drawEmojiFallback(
          ctx,
          points,
          centerX,
          centerY,
          scale,
          config,
          slot,
          emoji,
        );
      });
  }

  private drawTwemojiClipped(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    centerX: number,
    centerY: number,
    scale: number,
    config: EggParametricConfig,
    slot: { x: number; y: number; size: number; rotation: number },
    image: HTMLImageElement,
  ): void {
    const pixelSize = config.a * slot.size * 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    this.traceEggPath(ctx, points);
    ctx.clip();

    ctx.translate(config.a * slot.x, config.b * slot.y);
    ctx.rotate(slot.rotation);
    ctx.drawImage(image, -pixelSize / 2, -pixelSize / 2, pixelSize, pixelSize);
    ctx.restore();
  }

  private drawEmojiFallback(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    centerX: number,
    centerY: number,
    scale: number,
    config: EggParametricConfig,
    slot: { x: number; y: number; size: number; rotation: number },
    emoji: string,
  ): void {
    const fontSize = config.a * slot.size * 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    this.traceEggPath(ctx, points);
    ctx.clip();

    ctx.translate(config.a * slot.x, config.b * slot.y);
    ctx.rotate(slot.rotation);
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  }

  private getRandomLevel6Emoji(color: EggColor): string {
    const emojiSet = LEVEL6_EMOJI_SETS[color];
    const index = Math.floor(Math.random() * emojiSet.length);
    return emojiSet[index];
  }

  private toTwemojiCode(emoji: string): string {
    const codePoints = Array.from(emoji)
      .map((char) => char.codePointAt(0)?.toString(16))
      .filter((code): code is string => Boolean(code));

    // Check if this is a ZWJ sequence (contains 200d)
    const hasZWJ = codePoints.includes("200d");

    if (hasZWJ) {
      // ZWJ sequence - keep fe0f at the end
      return codePoints.join("-");
    } else {
      // Simple emoji - remove fe0f
      return codePoints
        .filter((code): code is string => code !== "fe0f")
        .join("-");
    }
  }

  private getTwemojiImage(url: string): Promise<HTMLImageElement> {
    const cached = this.twemojiLoadCache.get(url);
    if (cached) {
      return cached;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load Twemoji: ${url}`));
      image.src = url;
    });

    this.twemojiLoadCache.set(url, promise);
    return promise;
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

  private withAlpha(hexColor: string, alpha: number): string {
    const clamped = Math.max(0, Math.min(1, alpha));
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${clamped.toFixed(3)})`;
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
