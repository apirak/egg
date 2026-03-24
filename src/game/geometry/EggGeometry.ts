import type { EggGeometryConfig, TangentPoints } from '../../types/egg';

/**
 * Default egg geometry configuration
 * Creates an egg-like shape using two overlapping circles
 */
export const DEFAULT_EGG_GEOMETRY: EggGeometryConfig = {
	circleLargeRadius: 20,
	circleSmallRadius: 14,
	circleSmallOffset: 12,
};

/**
 * EggGeometry class
 *
 * Handles calculations for egg shape construction using two overlapping circles.
 * The egg shape is created by:
 * 1. A large circle at the base
 * 2. A small circle positioned above (slightly overlapping)
 * 3. Smooth Bezier curves connecting the tangent points
 */
export class EggGeometry {
	private config: EggGeometryConfig;

	constructor(config: EggGeometryConfig = DEFAULT_EGG_GEOMETRY) {
		this.config = config;
	}

	/**
	 * Get the current geometry configuration
	 */
	getConfig(): EggGeometryConfig {
		return { ...this.config };
	}

	/**
	 * Calculate tangent points between two circles
	 *
	 * For two circles, there are two external tangent lines that touch both circles.
	 * We need the tangent points to draw smooth Bezier curves connecting the circles.
	 *
	 * @returns Tangent points on both circles
	 */
	calculateTangentPoints(): TangentPoints {
		const { circleLargeRadius, circleSmallRadius, circleSmallOffset } = this.config;

		// Circle centers (large at origin, small above)
		const largeCenter = { x: 0, y: 0 };
		const smallCenter = { x: 0, y: -circleSmallOffset };

		// Distance between centers
		const d = circleSmallOffset;

		// Calculate tangent points using geometry
		// For external tangents, we find the angle from the line connecting centers
		const r1 = circleLargeRadius;
		const r2 = circleSmallRadius;

		// Angle for tangent points (using similar triangles)
		const angle = Math.acos((r1 - r2) / d);

		// Calculate tangent points on large circle
		const leftLarge = {
			x: largeCenter.x + r1 * Math.sin(angle),
			y: largeCenter.y - r1 * Math.cos(angle),
		};
		const rightLarge = {
			x: largeCenter.x - r1 * Math.sin(angle),
			y: largeCenter.y - r1 * Math.cos(angle),
		};

		// Calculate tangent points on small circle
		const leftSmall = {
			x: smallCenter.x + r2 * Math.sin(angle),
			y: smallCenter.y - r2 * Math.cos(angle),
		};
		const rightSmall = {
			x: smallCenter.x - r2 * Math.sin(angle),
			y: smallCenter.y - r2 * Math.cos(angle),
		};

		return { leftLarge, rightLarge, leftSmall, rightSmall };
	}

	/**
	 * Get the total height of the egg shape
	 */
	getEggHeight(): number {
		const { circleLargeRadius, circleSmallRadius, circleSmallOffset } = this.config;
		// Top of small circle to bottom of large circle
		return circleSmallOffset + circleSmallRadius + circleLargeRadius;
	}

	/**
	 * Get the total width of the egg shape
	 */
	getEggWidth(): number {
		return Math.max(this.config.circleLargeRadius, this.config.circleSmallRadius) * 2;
	}

	/**
	 * Get the center offset for rendering
	 * Returns the Y offset needed to center the egg vertically
	 */
	getCenterOffset(): number {
		return this.getEggHeight() / 2 - this.config.circleLargeRadius;
	}

	/**
	 * Get circle centers for rendering/debug visualization
	 */
	getCircleCenters(): {
		large: { x: number; y: number };
		small: { x: number; y: number };
	} {
		return {
			large: { x: 0, y: 0 },
			small: { x: 0, y: -this.config.circleSmallOffset },
		};
	}
}
