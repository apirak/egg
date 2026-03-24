// Canvas renderer with pre-rendered sprites

import { SpriteGenerator } from '../rendering/SpriteGenerator';

export interface RendererConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private spriteGenerator: SpriteGenerator;
  private animationFrameId: number | null = null;

  constructor(config: RendererConfig) {
    this.canvas = config.canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
    this.width = config.width;
    this.height = config.height;
    this.spriteGenerator = new SpriteGenerator();

    // Set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Handle high DPI displays
    this.setupHighDPI();
  }

  private setupHighDPI(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.width = rect.width;
    this.height = rect.height;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Draw background
   */
  drawBackground(color: string = '#1a1a2e'): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Draw a pre-rendered sprite at position with rotation
   */
  drawSprite(
    sprite: HTMLCanvasElement,
    x: number,
    y: number,
    rotation: number
  ): void {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);

    // Draw centered sprite
    this.ctx.drawImage(
      sprite,
      -sprite.width / 2,
      -sprite.height / 2
    );

    this.ctx.restore();
  }

  /**
   * Draw guide line for drop trajectory
   */
  drawGuideLine(startX: number, startY: number, endX: number, endY: number): void {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Draw arrow at end
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowSize = 10;

    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - arrowSize * Math.cos(angle - Math.PI / 6),
      endY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - arrowSize * Math.cos(angle + Math.PI / 6),
      endY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Draw spawn position indicator
   */
  drawSpawnIndicator(x: number, y: number, radius: number = 20): void {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([3, 3]);

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Draw game over line
   */
  drawGameOverLine(y: number): void {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([10, 10]);

    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.width, y);
    this.ctx.stroke();

    // Label
    this.ctx.font = '12px sans-serif';
    this.ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
    this.ctx.fillText('GAME OVER LINE', 10, y - 5);

    this.ctx.restore();
  }

  /**
   * Draw particle effect
   */
  drawParticles(particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>): void {
    for (const p of particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  /**
   * Draw text
   */
  drawText(text: string, x: number, y: number, options: {
    color?: string;
    font?: string;
    align?: CanvasTextAlign;
  } = {}): void {
    this.ctx.save();
    this.ctx.fillStyle = options.color || '#ffffff';
    this.ctx.font = options.font || '16px sans-serif';
    this.ctx.textAlign = options.align || 'left';
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  /**
   * Get canvas dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
