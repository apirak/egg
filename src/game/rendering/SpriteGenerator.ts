// Pre-rendered sprite generator for performance

import { EggColor, EggLevel } from '../../types/game';
import { EggGeometry } from './EggGeometry';
import { getEggSize, EGG_BASE_SIZE } from '../config';

export class SpriteGenerator {
  private spriteCache: Map<string, HTMLCanvasElement> = new Map();
  private initialized = false;

  /**
   * Generate all 15 egg sprites (3 colors × 5 levels)
   * This should be called once at startup
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const colors: EggColor[] = [EggColor.RED, EggColor.BLUE, EggColor.GREEN];
    const levels: EggLevel[] = [1, 2, 3, 4, 5];

    for (const color of colors) {
      for (const level of levels) {
        await this.generateSprite(color, level);
      }
    }

    this.initialized = true;
    console.log(`SpriteGenerator: Generated ${this.spriteCache.size} sprites`);
  }

  /**
   * Generate a single egg sprite
   */
  private async generateSprite(color: EggColor, level: EggLevel): Promise<void> {
    const size = getEggSize(level, EGG_BASE_SIZE);
    const bounds = EggGeometry.getEggBounds(size);

    // Create offscreen canvas with extra space for rotation
    const padding = size * 0.3;
    const canvasSize = Math.max(bounds.width, bounds.height) + padding * 2;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Translate to center
    ctx.translate(canvasSize / 2, canvasSize / 2);

    // Draw the egg shape
    EggGeometry.drawEggShape(ctx, size, color, level);

    // Store in cache
    const key = this.getSpriteKey(color, level);
    this.spriteCache.set(key, canvas);
  }

  /**
   * Get a sprite from cache
   */
  getSprite(color: EggColor, level: EggLevel): HTMLCanvasElement | null {
    const key = this.getSpriteKey(color, level);
    return this.spriteCache.get(key) || null;
  }

  /**
   * Get all sprites for a color
   */
  getSpritesForColor(color: EggColor): HTMLCanvasElement[] {
    const sprites: HTMLCanvasElement[] = [];
    for (let level = 1; level <= 5; level++) {
      const sprite = this.getSprite(color, level);
      if (sprite) sprites.push(sprite);
    }
    return sprites;
  }

  /**
   * Check if sprites are ready
   */
  isReady(): boolean {
    return this.initialized;
  }

  /**
   * Get cache key for sprite
   */
  private getSpriteKey(color: EggColor, level: EggLevel): string {
    return `${color}-${level}`;
  }

  /**
   * Clear all cached sprites (for testing/memory management)
   */
  clear(): void {
    this.spriteCache.clear();
    this.initialized = false;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.spriteCache.size,
      keys: Array.from(this.spriteCache.keys())
    };
  }
}

// Singleton instance
let spriteGeneratorInstance: SpriteGenerator | null = null;

export const getSpriteGenerator = (): SpriteGenerator => {
  if (!spriteGeneratorInstance) {
    spriteGeneratorInstance = new SpriteGenerator();
  }
  return spriteGeneratorInstance;
};
