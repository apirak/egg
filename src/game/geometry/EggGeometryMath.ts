/**
 * Egg Geometry using Parametric Equations
 *
 * Mathematical approach to create smooth egg shapes
 * Based on modifying ellipse equations
 */

export interface EggParametricConfig {
	/** Width radius (a) */
	a: number;
	/** Height radius (b) */
	b: number;
	/** Asymmetry factor (k) - controls how pointy the top is */
	k: number;
}

/**
 * Generate points along the egg outline using parametric equations
 *
 * The egg shape is created by modifying an ellipse:
 * x = a * cos(t) * (1 + k * sin(t))
 * y = b * sin(t)
 *
 * Where:
 * - t goes from -π to π (or 0 to 2π)
 * - k controls the asymmetry (positive = wider bottom, pointier top)
 *
 * @param config - Egg configuration
 * @param segments - Number of segments for smoothness
 * @returns Array of {x, y} points
 */
export function generateEggPoints(
	config: EggParametricConfig,
	segments: number = 100,
): { x: number; y: number }[] {
	const { a, b, k } = config;
	const points: { x: number; y: number }[] = [];

	// Go from -π to π to trace the full egg shape
	for (let i = 0; i <= segments; i++) {
		const t = (-Math.PI + (2 * Math.PI * i) / segments);

		// Parametric egg equation
		const x = a * Math.cos(t) * (1 + k * Math.sin(t));
		const y = b * Math.sin(t);

		points.push({ x, y });
	}

	return points;
}

/**
 * Default egg configuration (good proportions for a game egg)
 */
export const DEFAULT_EGG_MATH: EggParametricConfig = {
	a: 20, // Width radius
	b: 28, // Height radius (slightly taller than wide)
	k: 0.3, // Asymmetry factor
};

/**
 * Generate SVG path data from egg points
 */
export function eggPointsToPath(points: { x: number; y: number }[]): string {
	if (points.length === 0) return '';

	// Start with moveto first point
	let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} `;

	// Use quadratic curves for smooth path through points
	for (let i = 1; i < points.length; i++) {
		const point = points[i];
		path += `L ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
	}

	path += 'Z';
	return path;
}

/**
 * Get egg dimensions
 */
export function getEggDimensions(config: EggParametricConfig): { width: number; height: number } {
	const { a, b, k } = config;

	// Width is at most a * (1 + k) when sin(t) = 1
	const maxWidth = a * (1 + Math.abs(k));

	// Height is 2 * b
	const height = 2 * b;

	return { width: maxWidth * 2, height };
}
