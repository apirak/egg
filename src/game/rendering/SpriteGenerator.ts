import { generateEggPoints, getEggDimensions, DEFAULT_EGG_MATH, type EggParametricConfig } from '../geometry/EggGeometryMath';
import type { EggSprite, EggRenderOptions } from '../../types/egg';

/**
 * Default render options for egg sprites
 */
const DEFAULT_RENDER_OPTIONS: Required<Omit<EggRenderOptions, 'fillColor'>> = {
	strokeColor: '#000000',
	strokeWidth: 1.5,
	scale: 3, // Increased from 2 to make size differences more visible
};

/**
 * Color mappings for egg types
 */
export const EGG_COLORS = {
	red: {
		light: '#ff6b6b',
		main: '#e74c3c',
		dark: '#c0392b',
	},
	blue: {
		light: '#74b9ff',
		main: '#3498db',
		dark: '#2980b9',
	},
	green: {
		light: '#55efc4',
		main: '#2ecc71',
		dark: '#27ae60',
	},
} as const;

/**
 * Egg size multipliers for each level
 * Level 1 is base size, each level is 1.2x larger
 */
export const EGG_LEVEL_MULTIPLIERS: Record<number, number> = {
	1: 1.0,
	2: 1.2,
	3: 1.44,
	4: 1.728,
	5: 2.074,
};

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
		shade: keyof typeof EGG_COLORS.red = 'main',
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
	private getCacheKey(options: Required<EggRenderOptions>, level: number): string {
		return `${options.fillColor}-${options.strokeColor}-${options.strokeWidth}-${options.scale}-${level}`;
	}

	/**
	 * Render egg to offscreen canvas
	 */
	private renderEgg(options: Required<EggRenderOptions>, level: number): EggSprite {
		// Get egg configuration with level multiplier
		const levelMultiplier = EGG_LEVEL_MULTIPLIERS[level] || 1.0;
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
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get canvas context');
		}

		// Center position
		const centerX = width / 2;
		const centerY = height / 2;

		// Draw egg shadow
		this.drawShadow(ctx, centerX, centerY + dimensions.height * scale / 2 + 4, dimensions.width * scale * 0.4, 6);

		// Draw egg silhouette
		this.drawEggShape(ctx, points, centerX, centerY, scale, fillColor, strokeColor, strokeWidth);

		// Draw level-specific pattern
		this.drawLevelPattern(ctx, centerX, centerY, config, scale, level, fillColor);

		// Add highlight
		this.addHighlight(ctx, centerX, centerY, config, scale);

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

		// Create gradient fill
		const gradient = ctx.createLinearGradient(0, DEFAULT_EGG_MATH.b, 0, -DEFAULT_EGG_MATH.b);
		gradient.addColorStop(0, fillColor);
		gradient.addColorStop(0.5, this.lightenColor(fillColor, 20));
		gradient.addColorStop(1, this.darkenColor(fillColor, 15));

		ctx.fillStyle = gradient;
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
	 * Draw shadow beneath the egg
	 */
	private drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, radiusX: number, radiusY: number): void {
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
		ctx.fill();
		ctx.restore();
	}

	/**
	 * Add highlight/shine to the egg
	 */
	private addHighlight(
		ctx: CanvasRenderingContext2D,
		centerX: number,
		centerY: number,
		config: EggParametricConfig,
		scale: number,
	): void {
		ctx.save();
		ctx.translate(centerX, centerY);

		// Highlight position (upper left area)
		const highlightX = -config.a * 0.25 * scale;
		const highlightY = -config.b * 0.5 * scale;
		const highlightRx = config.a * 0.18 * scale;
		const highlightRy = config.b * 0.2 * scale;

		ctx.beginPath();
		ctx.ellipse(highlightX, highlightY, highlightRx, highlightRy, -0.15, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
		ctx.fill();

		ctx.restore();
	}

	/**
	 * Draw level-specific pattern on the egg
	 * L1: Plain (no pattern)
	 * L2: Dots
	 * L3: Wristband (horizontal bands)
	 * L4: Flash (lightning bolt)
	 * L5: Golden (sparkles/glow)
	 */
	private drawLevelPattern(
		ctx: CanvasRenderingContext2D,
		centerX: number,
		centerY: number,
		config: EggParametricConfig,
		scale: number,
		level: number,
		fillColor: string,
	): void {
		if (level === 1) return; // L1 has no pattern

		ctx.save();
		ctx.translate(centerX, centerY);
		ctx.scale(scale, scale);

		const darkerColor = this.darkenColor(fillColor, 30);
		const lighterColor = this.lightenColor(fillColor, 40);

		switch (level) {
			case 2: // Dots
				this.drawDotPattern(ctx, config, darkerColor);
				break;
			case 3: // Wristband
				this.drawWristbandPattern(ctx, config, lighterColor, darkerColor);
				break;
			case 4: // Flash
				this.drawFlashPattern(ctx, config, lighterColor);
				break;
			case 5: // Golden
				this.drawGoldenPattern(ctx, config, lighterColor);
				break;
		}

		ctx.restore();
	}

	/**
	 * Draw dot pattern (L2)
	 */
	private drawDotPattern(
		ctx: CanvasRenderingContext2D,
		config: EggParametricConfig,
		color: string,
	): void {
		const dotSize = 3;
		const dotCount = 8;
		const radius = config.a * 0.5;

		ctx.fillStyle = color;

		for (let i = 0; i < dotCount; i++) {
			const angle = (i / dotCount) * Math.PI * 2;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius * 0.6;

			ctx.beginPath();
			ctx.arc(x, y, dotSize, 0, Math.PI * 2);
			ctx.fill();
		}

		// Center dot
		ctx.beginPath();
		ctx.arc(0, 0, dotSize * 1.2, 0, Math.PI * 2);
		ctx.fill();
	}

	/**
	 * Draw wristband pattern (L3)
	 */
	private drawWristbandPattern(
		ctx: CanvasRenderingContext2D,
		config: EggParametricConfig,
		lightColor: string,
		darkColor: string,
	): void {
		const bandWidth = 6;
		const bandY = -config.b * 0.2;

		// Main band
		ctx.fillStyle = darkColor;
		ctx.beginPath();
		ctx.ellipse(0, bandY, config.a * 0.85, bandWidth, 0, 0, Math.PI * 2);
		ctx.fill();

		// Highlight on band
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.beginPath();
		ctx.ellipse(0, bandY - 1, config.a * 0.85, bandWidth * 0.3, 0, 0, Math.PI * 2);
		ctx.fill();

		// Secondary band
		const bandY2 = config.b * 0.1;
		ctx.fillStyle = darkColor;
		ctx.beginPath();
		ctx.ellipse(0, bandY2, config.a * 0.6, bandWidth * 0.7, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	/**
	 * Draw flash/lightning pattern (L4)
	 */
	private drawFlashPattern(
		ctx: CanvasRenderingContext2D,
		config: EggParametricConfig,
		color: string,
	): void {
		ctx.strokeStyle = color;
		ctx.lineWidth = 3;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// Lightning bolt shape
		ctx.beginPath();
		ctx.moveTo(-config.a * 0.3, -config.b * 0.5);
		ctx.lineTo(0, -config.b * 0.2);
		ctx.lineTo(-config.a * 0.15, -config.b * 0.1);
		ctx.lineTo(config.a * 0.2, config.b * 0.3);
		ctx.lineTo(0, config.b * 0.1);
		ctx.lineTo(config.a * 0.15, 0);
		ctx.closePath();
		ctx.stroke();

		// Glow effect
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		ctx.lineWidth = 6;
		ctx.stroke();
	}

	/**
	 * Draw golden/sparkle pattern (L5)
	 */
	private drawGoldenPattern(
		ctx: CanvasRenderingContext2D,
		config: EggParametricConfig,
		color: string,
	): void {
		// Sparkles
		const sparkleCount = 12;
		const sparkleSize = 4;

		for (let i = 0; i < sparkleCount; i++) {
			const angle = (i / sparkleCount) * Math.PI * 2;
			const distance = config.a * (0.3 + Math.random() * 0.4);
			const x = Math.cos(angle) * distance;
			const y = (Math.random() - 0.5) * config.b * 0.6;

			// Draw sparkle (star shape)
			this.drawSparkle(ctx, x, y, sparkleSize, color);
		}

		// Crown-like band at top
		const bandY = -config.b * 0.3;
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(-config.a * 0.4, bandY);
		ctx.quadraticCurveTo(0, bandY - 5, config.a * 0.4, bandY);
		ctx.stroke();

		// Crown points
		for (let i = -2; i <= 2; i++) {
			const px = i * config.a * 0.15;
			const py = bandY - 3;
			this.drawSparkle(ctx, px, py, 2, color);
		}
	}

	/**
	 * Draw a sparkle/star shape
	 */
	private drawSparkle(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		size: number,
		color: string,
	): void {
		ctx.save();
		ctx.translate(x, y);

		// Glow
		ctx.beginPath();
		ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fill();

		// Star shape
		ctx.fillStyle = color;
		ctx.beginPath();
		for (let i = 0; i < 4; i++) {
			const angle = (i / 4) * Math.PI * 2;
			const px = Math.cos(angle) * size;
			const py = Math.sin(angle) * size;
			if (i === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.closePath();
		ctx.fill();

		// Center bright spot
		ctx.beginPath();
		ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.fill();

		ctx.restore();
	}

	/**
	 * Lighten a color by a percentage
	 */
	private lightenColor(color: string, percent: number): string {
		const num = parseInt(color.replace('#', ''), 16);
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
		const num = parseInt(color.replace('#', ''), 16);
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
