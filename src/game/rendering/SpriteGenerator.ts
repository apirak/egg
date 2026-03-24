import { EggGeometry } from '../geometry/EggGeometry';
import type { EggSprite, EggRenderOptions, TangentPoints } from '../../types/egg';

/**
 * Default render options for egg sprites
 */
const DEFAULT_RENDER_OPTIONS: Required<Omit<EggRenderOptions, 'fillColor'>> = {
	strokeColor: '#000000',
	strokeWidth: 2,
	scale: 2,
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
 * SpriteGenerator class
 *
 * Pre-renders egg sprites to offscreen canvas elements.
 * This approach ensures 60FPS performance by avoiding repeated geometry calculations.
 */
export class SpriteGenerator {
	private cache: Map<string, EggSprite> = new Map();

	/**
	 * Generate an egg sprite with the given options
	 *
	 * @param options - Render options including fill color
	 * @returns Pre-rendered egg sprite
	 */
	generateSprite(options: EggRenderOptions): EggSprite {
		const opts = { ...DEFAULT_RENDER_OPTIONS, ...options };
		const cacheKey = this.getCacheKey(opts);

		// Check cache first
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached;
		}

		// Create new sprite
		const geometry = new EggGeometry();
		const sprite = this.renderEgg(geometry, opts);
		this.cache.set(cacheKey, sprite);

		return sprite;
	}

	/**
	 * Get sprite for a specific egg color
	 *
	 * @param color - Egg color ('red', 'blue', 'green')
	 * @param shade - Color shade ('light', 'main', 'dark')
	 * @returns Pre-rendered egg sprite
	 */
	getSpriteForColor(color: keyof typeof EGG_COLORS, shade: keyof typeof EGG_COLORS.red = 'main'): EggSprite {
		return this.generateSprite({
			fillColor: EGG_COLORS[color][shade],
			strokeColor: EGG_COLORS[color].dark,
		});
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
	private getCacheKey(options: Required<EggRenderOptions>): string {
		return `${options.fillColor}-${options.strokeColor}-${options.strokeWidth}-${options.scale}`;
	}

	/**
	 * Render egg to offscreen canvas
	 */
	private renderEgg(geometry: EggGeometry, options: Required<EggRenderOptions>): EggSprite {
		const config = geometry.getConfig();
		const tangentPoints = geometry.calculateTangentPoints();
		const { scale } = options;

		// Calculate canvas size
		const width = geometry.getEggWidth() * scale + 20; // Padding
		const height = geometry.getEggHeight() * scale + 20;

		// Create offscreen canvas
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get canvas context');
		}

		// Set up context
		ctx.scale(scale, scale);
		ctx.translate(width / 2 / scale, height / 2 / scale + geometry.getCenterOffset());

		// Draw egg silhouette
		this.drawEggSilhouette(ctx, config, tangentPoints, options);

		return {
			canvas,
			width,
			height,
		};
	}

	/**
	 * Draw smooth egg silhouette using Bezier curves
	 */
	private drawEggSilhouette(
		ctx: CanvasRenderingContext2D,
		config: { circleLargeRadius: number; circleSmallRadius: number; circleSmallOffset: number },
		tangentPoints: TangentPoints,
		options: Required<EggRenderOptions>,
	): void {
		const { circleLargeRadius, circleSmallRadius, circleSmallOffset } = config;
		const { fillColor, strokeColor, strokeWidth } = options;

		ctx.beginPath();

		// Start at bottom of large circle
		ctx.arc(0, 0, circleLargeRadius, Math.PI * 0.8, Math.PI * 1.2);

		// Draw left side using Bezier curves
		// Control points create smooth curve from tangent points
		const leftControlY1 = tangentPoints.leftLarge.y - (circleLargeRadius * 0.3);
		const leftControlY2 = tangentPoints.leftSmall.y + (circleSmallRadius * 0.3);

		ctx.bezierCurveTo(
			tangentPoints.leftLarge.x - 5, // Control point 1
			leftControlY1,
			tangentPoints.leftSmall.x - 3, // Control point 2
			leftControlY2,
			tangentPoints.leftSmall.x,
			tangentPoints.leftSmall.y,
		);

		// Arc around small circle top
		ctx.arc(0, -circleSmallOffset, circleSmallRadius, Math.PI * 1.4, Math.PI * 1.6, true);

		// Draw right side using Bezier curves
		const rightControlY1 = tangentPoints.rightLarge.y - (circleLargeRadius * 0.3);
		const rightControlY2 = tangentPoints.rightSmall.y + (circleSmallRadius * 0.3);

		ctx.bezierCurveTo(
			tangentPoints.rightSmall.x + 3, // Control point 1
			rightControlY2,
			tangentPoints.rightLarge.x + 5, // Control point 2
			rightControlY1,
			tangentPoints.rightLarge.x,
			tangentPoints.rightLarge.y,
		);

		ctx.closePath();

		// Fill and stroke
		ctx.fillStyle = fillColor;
		ctx.fill();

		if (strokeWidth > 0) {
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = strokeWidth;
			ctx.stroke();
		}

		// Add subtle highlight
		this.addHighlight(ctx, circleSmallRadius, circleSmallOffset);
	}

	/**
	 * Add subtle highlight to egg for 3D effect
	 */
	private addHighlight(ctx: CanvasRenderingContext2D, smallRadius: number, offset: number): void {
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(
			-smallRadius * 0.3,
			-offset - smallRadius * 0.2,
			smallRadius * 0.2,
			smallRadius * 0.4,
			Math.PI * 0.1,
			0,
			Math.PI * 2,
		);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fill();
		ctx.restore();
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
