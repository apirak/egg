import { useEffect, useRef } from 'preact/hooks';
import { EggGeometry, DEFAULT_EGG_GEOMETRY } from '../../game/geometry/EggGeometry';
import { getSpriteGenerator } from '../../game/rendering/SpriteGenerator';
import './style.css';

/**
 * EggShapeDemo Page
 *
 * Demonstrates how egg shapes are constructed using two overlapping circles
 * and smooth Bezier curves to create the egg silhouette.
 */
export function EggShapeDemo() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const showConstruction = useRef(true);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.scale(dpr, dpr);

		// Clear canvas
		ctx.clearRect(0, 0, rect.width, rect.height);

		// Create geometry
		const geometry = new EggGeometry();
		const config = geometry.getConfig();
		const tangentPoints = geometry.calculateTangentPoints();
		const centers = geometry.getCircleCenters();

		// Center position
		const centerX = rect.width / 2;
		const centerY = rect.height / 2 + geometry.getCenterOffset();

		// Draw construction circles (dashed outlines)
		if (showConstruction.current) {
			drawConstructionCircles(ctx, centerX, centerY, config, centers);
			drawTangentPoints(ctx, centerX, centerY, tangentPoints);
		}

		// Draw smooth egg silhouette
		drawEggSilhouette(ctx, centerX, centerY, config, tangentPoints);

		// Draw labels
		drawLabels(ctx, centerX, centerY, config, centers, rect.width);

		// Draw pre-rendered sprite
		drawSprite(ctx, rect);
	}, []);

	return (
		<div class="egg-shape-page">
			<header class="page-header">
				<h1>Egg Shape Geometry</h1>
				<p>How egg shapes are constructed using two overlapping circles and Bezier curves</p>
			</header>

			<main class="demo-content">
				<section class="canvas-section">
					<h2>Construction View</h2>
					<p class="section-description">
						<strong>Large Circle</strong> (base) + <strong>Small Circle</strong> (top) → <strong>Smooth Egg Silhouette</strong>
					</p>
					<canvas ref={canvasRef} class="demo-canvas" width="500" height="400"></canvas>
				</section>

				<section class="info-section">
					<h2>How It Works</h2>
					<div class="info-cards">
						<div class="info-card">
							<h3>1. Two Circles</h3>
							<p>An egg shape is created from two overlapping circles:</p>
							<ul>
								<li><strong>Large Circle:</strong> Base of the egg (radius: {DEFAULT_EGG_GEOMETRY.circleLargeRadius}px)</li>
								<li><strong>Small Circle:</strong> Top of the egg (radius: {DEFAULT_EGG_GEOMETRY.circleSmallRadius}px)</li>
								<li><strong>Offset:</strong> Small circle positioned above ({DEFAULT_EGG_GEOMETRY.circleSmallOffset}px)</li>
							</ul>
						</div>

						<div class="info-card">
							<h3>2. Tangent Points</h3>
							<p>Calculate where the two circles would touch if drawn with a smooth connection:</p>
							<ul>
								<li>Left tangent points on both circles</li>
								<li>Right tangent points on both circles</li>
							</ul>
						</div>

						<div class="info-card">
							<h3>3. Bezier Curves</h3>
							<p>Draw smooth curves connecting the tangent points:</p>
							<ul>
								<li>Left side curve connects left tangents</li>
								<li>Right side curve connects right tangents</li>
								<li>Creates organic, egg-like silhouette</li>
							</ul>
						</div>

						<div class="info-card">
							<h3>4. Pre-rendered Sprite</h3>
							<p>For performance, the egg is drawn once to an offscreen canvas and reused:</p>
							<ul>
								<li>No per-frame geometry calculations</li>
								<li>60 FPS even on mobile devices</li>
								<li>Physics bodies use this visual representation</li>
							</ul>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

/**
 * Draw construction circles (dashed outlines)
 */
function drawConstructionCircles(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	config: { circleLargeRadius: number; circleSmallRadius: number; circleSmallOffset: number },
	centers: { large: { x: number; y: number }; small: { x: number; y: number } },
): void {
	ctx.save();
	ctx.setLineDash([5, 5]);
	ctx.lineWidth = 2;

	// Large circle (blue)
	ctx.strokeStyle = '#3498db';
	ctx.beginPath();
	ctx.arc(centerX + centers.large.x, centerY + centers.large.y, config.circleLargeRadius, 0, Math.PI * 2);
	ctx.stroke();

	// Small circle (green)
	ctx.strokeStyle = '#2ecc71';
	ctx.beginPath();
	ctx.arc(centerX + centers.small.x, centerY + centers.small.y, config.circleSmallRadius, 0, Math.PI * 2);
	ctx.stroke();

	ctx.restore();
}

/**
 * Draw tangent points as small dots
 */
function drawTangentPoints(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	tangentPoints: {
		leftLarge: { x: number; y: number };
		rightLarge: { x: number; y: number };
		leftSmall: { x: number; y: number };
		rightSmall: { x: number; y: number };
	},
): void {
	ctx.save();
	ctx.fillStyle = '#e74c3c';
	const dotSize = 4;

	const points = [
		tangentPoints.leftLarge,
		tangentPoints.rightLarge,
		tangentPoints.leftSmall,
		tangentPoints.rightSmall,
	];

	points.forEach((point) => {
		ctx.beginPath();
		ctx.arc(centerX + point.x, centerY + point.y, dotSize, 0, Math.PI * 2);
		ctx.fill();
	});

	ctx.restore();
}

/**
 * Draw smooth egg silhouette
 */
function drawEggSilhouette(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	config: { circleLargeRadius: number; circleSmallRadius: number; circleSmallOffset: number },
	tangentPoints: {
		leftLarge: { x: number; y: number };
		rightLarge: { x: number; y: number };
		leftSmall: { x: number; y: number };
		rightSmall: { x: number; y: number };
	},
): void {
	const { circleLargeRadius, circleSmallRadius, circleSmallOffset } = config;

	ctx.save();
	ctx.translate(centerX, centerY);

	// Set up shadow for depth
	ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
	ctx.shadowBlur = 10;
	ctx.shadowOffsetY = 5;

	// Begin egg shape
	ctx.beginPath();

	// Start at bottom of large circle
	ctx.arc(0, 0, circleLargeRadius, Math.PI * 0.75, Math.PI * 1.25);

	// Draw left side using Bezier curves
	const leftControlY1 = tangentPoints.leftLarge.y - circleLargeRadius * 0.3;
	const leftControlY2 = tangentPoints.leftSmall.y + circleSmallRadius * 0.3;

	ctx.bezierCurveTo(
		tangentPoints.leftLarge.x - 5,
		leftControlY1,
		tangentPoints.leftSmall.x - 3,
		leftControlY2,
		tangentPoints.leftSmall.x,
		tangentPoints.leftSmall.y,
	);

	// Arc around small circle top
	ctx.arc(0, -circleSmallOffset, circleSmallRadius, Math.PI * 1.4, Math.PI * 1.6, true);

	// Draw right side using Bezier curves
	const rightControlY1 = tangentPoints.rightLarge.y - circleLargeRadius * 0.3;
	const rightControlY2 = tangentPoints.rightSmall.y + circleSmallRadius * 0.3;

	ctx.bezierCurveTo(
		tangentPoints.rightSmall.x + 3,
		rightControlY2,
		tangentPoints.rightLarge.x + 5,
		rightControlY1,
		tangentPoints.rightLarge.x,
		tangentPoints.rightLarge.y,
	);

	ctx.closePath();

	// Fill with gradient
	const gradient = ctx.createLinearGradient(0, circleLargeRadius, 0, -circleSmallOffset - circleSmallRadius);
	gradient.addColorStop(0, '#e74c3c');
	gradient.addColorStop(0.5, '#ff6b6b');
	gradient.addColorStop(1, '#c0392b');
	ctx.fillStyle = gradient;
	ctx.fill();

	// Add subtle stroke
	ctx.strokeStyle = '#c0392b';
	ctx.lineWidth = 2;
	ctx.stroke();

	// Add highlight
	ctx.save();
	ctx.shadowColor = 'transparent';
	ctx.beginPath();
	ctx.ellipse(
		-circleSmallRadius * 0.3,
		-circleSmallOffset - circleSmallRadius * 0.2,
		circleSmallRadius * 0.2,
		circleSmallRadius * 0.4,
		Math.PI * 0.1,
		0,
		Math.PI * 2,
	);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.fill();
	ctx.restore();

	ctx.restore();
}

/**
 * Draw labels for the construction
 */
function drawLabels(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	config: { circleLargeRadius: number; circleSmallRadius: number; circleSmallOffset: number },
	centers: { large: { x: number; y: number }; small: { x: number; y: number } },
	canvasWidth: number,
): void {
	ctx.save();
	ctx.font = '14px system-ui, sans-serif';
	ctx.textAlign = 'center';

	// Large circle label
	ctx.fillStyle = '#3498db';
	ctx.fillText('Large Circle', centerX - 100, centerY);

	// Small circle label
	ctx.fillStyle = '#2ecc71';
	ctx.fillText('Small Circle', centerX - 100, centerY - config.circleSmallOffset);

	// Tangent points label
	ctx.fillStyle = '#e74c3c';
	ctx.fillText('Tangent Points', centerX + 100, centerY - config.circleSmallOffset / 2);

	ctx.restore();
}

/**
 * Draw pre-rendered sprite example
 */
function drawSprite(ctx: CanvasRenderingContext2D, rect: { width: number; height: number }): void {
	const spriteGen = getSpriteGenerator();
	const sprite = spriteGen.getSpriteForColor('red');

	// Draw sprite label
	ctx.save();
	ctx.font = 'bold 16px system-ui, sans-serif';
	ctx.fillStyle = '#333';
	ctx.textAlign = 'center';
	ctx.fillText('Pre-rendered Sprite Example:', rect.width - 100, rect.height - 100);

	// Draw sprite
	const spriteX = rect.width - 100 - sprite.width / 2 / 2;
	const spriteY = rect.height - 60 - sprite.height / 2;
	ctx.drawImage(sprite.canvas, spriteX, spriteY, sprite.width / 2, sprite.height / 2);
	ctx.restore();
}
