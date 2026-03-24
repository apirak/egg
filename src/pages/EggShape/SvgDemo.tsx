import { EggGeometry, DEFAULT_EGG_GEOMETRY } from '../../game/geometry/EggGeometry';
import './style.css';

/**
 * SVG Egg Shape Demo
 *
 * Debug version using SVG for easier inspection
 */
export function SvgEggDemo() {
	const geometry = new EggGeometry();
	const config = geometry.getConfig();
	const tangentPoints = geometry.calculateTangentPoints();
	const centers = geometry.getCircleCenters();

	// SVG canvas size
	const width = 400;
	const height = 400;
	const centerX = width / 2;
	const centerY = height / 2 + 10;

	// Scale for better visibility
	const scale = 4;

	return (
		<div class="egg-shape-page">
			<header class="page-header">
				<h1>Egg Shape - SVG Debug</h1>
				<p>Inspect the SVG elements in browser DevTools to debug the shape</p>
			</header>

			<main class="demo-content">
				<section class="canvas-section">
					<h2>Construction (SVG)</h2>
					<p class="section-description">
						<strong>Blue:</strong> Large Circle | <strong>Green:</strong> Small Circle | <strong>Red dots:</strong> Tangent Points
					</p>

					<svg
						width={width}
						height={height}
						viewBox={`0 0 ${width} ${height}`}
						style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
					>
						{/* Large Circle - Blue dashed */}
						<circle
							cx={centerX + centers.large.x * scale}
							cy={centerY + centers.large.y * scale}
							r={config.circleLargeRadius * scale}
							fill="none"
							stroke="#3498db"
							strokeWidth="2"
							strokeDasharray="5,5"
						/>
						<text
							x={centerX + centers.large.x * scale - 60}
							y={centerY + centers.large.y * scale}
							fill="#3498db"
							fontSize="12"
						>
							Large Circle
						</text>

						{/* Small Circle - Green dashed */}
						<circle
							cx={centerX + centers.small.x * scale}
							cy={centerY + centers.small.y * scale}
							r={config.circleSmallRadius * scale}
							fill="none"
							stroke="#2ecc71"
							strokeWidth="2"
							strokeDasharray="5,5"
						/>
						<text
							x={centerX + centers.small.x * scale - 60}
							y={centerY + centers.small.y * scale}
							fill="#2ecc71"
							fontSize="12"
						>
							Small Circle
						</text>

						{/* Tangent Points - Red dots */}
						<circle
							cx={centerX + tangentPoints.leftLarge.x * scale}
							cy={centerY + tangentPoints.leftLarge.y * scale}
							r="5"
							fill="#e74c3c"
						/>
						<circle
							cx={centerX + tangentPoints.rightLarge.x * scale}
							cy={centerY + tangentPoints.rightLarge.y * scale}
							r="5"
							fill="#e74c3c"
						/>
						<circle
							cx={centerX + tangentPoints.leftSmall.x * scale}
							cy={centerY + tangentPoints.leftSmall.y * scale}
							r="5"
							fill="#e74c3c"
						/>
						<circle
							cx={centerX + tangentPoints.rightSmall.x * scale}
							cy={centerY + tangentPoints.rightSmall.y * scale}
							r="5"
							fill="#e74c3c"
						/>

						{/* Tangent lines (for visualization) */}
						<line
							x1={centerX + tangentPoints.leftLarge.x * scale}
							y1={centerY + tangentPoints.leftLarge.y * scale}
							x2={centerX + tangentPoints.leftSmall.x * scale}
							y2={centerY + tangentPoints.leftSmall.y * scale}
							stroke="#e74c3c"
							strokeWidth="1"
							strokeDasharray="3,3"
							opacity="0.5"
						/>
						<line
							x1={centerX + tangentPoints.rightLarge.x * scale}
							y1={centerY + tangentPoints.rightLarge.y * scale}
							x2={centerX + tangentPoints.rightSmall.x * scale}
							y2={centerY + tangentPoints.rightSmall.y * scale}
							stroke="#e74c3c"
							strokeWidth="1"
							strokeDasharray="3,3"
							opacity="0.5"
						/>

						{/* Egg Silhouette Path */}
						<EggSilhouette
							centerX={centerX}
							centerY={centerY}
							scale={scale}
							config={config}
							tangentPoints={tangentPoints}
						/>
					</svg>
				</section>

				<section class="info-section">
					<h2>Config Values</h2>
					<div class="info-cards">
						<div class="info-card">
							<h3>Current Configuration</h3>
							<ul>
								<li>Large Radius: {config.circleLargeRadius}</li>
								<li>Small Radius: {config.circleSmallRadius}</li>
								<li>Offset: {config.circleSmallOffset}</li>
							</ul>
						</div>
						<div class="info-card">
							<h3>Tangent Points</h3>
							<ul>
								<li>Left Large: ({tangentPoints.leftLarge.x.toFixed(1)}, {tangentPoints.leftLarge.y.toFixed(1)})</li>
								<li>Right Large: ({tangentPoints.rightLarge.x.toFixed(1)}, {tangentPoints.rightLarge.y.toFixed(1)})</li>
								<li>Left Small: ({tangentPoints.leftSmall.x.toFixed(1)}, {tangentPoints.leftSmall.y.toFixed(1)})</li>
								<li>Right Small: ({tangentPoints.rightSmall.x.toFixed(1)}, {tangentPoints.rightSmall.y.toFixed(1)})</li>
							</ul>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

/**
 * Egg Silhouette SVG Path
 * This is where we can experiment with the shape
 */
function EggSilhouette({
	centerX,
	centerY,
	scale,
	config,
	tangentPoints,
}: {
	centerX: number;
	centerY: number;
	scale: number;
	config: { circleLargeRadius: number; circleSmallRadius: number; circleSmallOffset: number };
	tangentPoints: {
		leftLarge: { x: number; y: number };
		rightLarge: { x: number; y: number };
		leftSmall: { x: number; y: number };
		rightSmall: { x: number; y: number };
	};
}) {
	const { circleLargeRadius, circleSmallRadius, circleSmallOffset } = config;

	// Scaled tangent points
	const ll = {
		x: centerX + tangentPoints.leftLarge.x * scale,
		y: centerY + tangentPoints.leftLarge.y * scale,
	};
	const ls = {
		x: centerX + tangentPoints.leftSmall.x * scale,
		y: centerY + tangentPoints.leftSmall.y * scale,
	};
	const rl = {
		x: centerX + tangentPoints.rightLarge.x * scale,
		y: centerY + tangentPoints.rightLarge.y * scale,
	};
	const rs = {
		x: centerX + tangentPoints.rightSmall.x * scale,
		y: centerY + tangentPoints.rightSmall.y * scale,
	};

	// Bottom point of large circle
	const bottomX = centerX;
	const bottomY = centerY + circleLargeRadius * scale;

	// Build path string - simpler approach: start from bottom, go up right side, over top, down left side
	let path = '';

	// Start at bottom center
	path += `M ${bottomX} ${bottomY} `;

	// Right side: curve from bottom to right large tangent point
	// Control point pulls outward for egg shape
	path += `Q ${rl.x + circleLargeRadius * 0.5 * scale} ${bottomY - circleLargeRadius * 0.3 * scale}, ${rl.x} ${rl.y} `;

	// Curve from right large tangent to right small tangent (the "waist" area)
	path += `Q ${rl.x + (rs.x - rl.x) * 0.5} ${rl.y - circleLargeRadius * 0.2 * scale}, ${rs.x} ${rs.y} `;

	// Top curve: go over small circle
	const topX = centerX;
	const topY = centerY - circleSmallOffset * scale - circleSmallRadius * scale;
	path += `Q ${topX + circleSmallRadius * 0.3 * scale} ${topY + circleSmallRadius * 0.3 * scale}, ${topX} ${topY} `;
	path += `Q ${topX - circleSmallRadius * 0.3 * scale} ${topY + circleSmallRadius * 0.3 * scale}, ${ls.x} ${ls.y} `;

	// Left side: curve from left small tangent to left large tangent
	path += `Q ${ll.x - (ls.x - ll.x) * 0.5} ${ll.y - circleLargeRadius * 0.2 * scale}, ${ll.x} ${ll.y} `;

	// Curve from left large tangent back to bottom
	path += `Q ${ll.x - circleLargeRadius * 0.5 * scale} ${bottomY - circleLargeRadius * 0.3 * scale}, ${bottomX} ${bottomY} `;

	path += 'Z';

	return (
		<>
			{/* Fill path */}
			<path
				d={path}
				fill="url(#eggGradient)"
				stroke="#c0392b"
				strokeWidth="2"
			/>

			{/* Gradient definition */}
			<defs>
				<linearGradient id="eggGradient" x1="0%" y1="100%" x2="0%" y2="0%">
					<stop offset="0%" stopColor="#e74c3c" />
					<stop offset="50%" stopColor="#ff6b6b" />
					<stop offset="100%" stopColor="#c0392b" />
				</linearGradient>
			</defs>

			{/* Highlight */}
			<ellipse
				cx={centerX - circleSmallRadius * 0.3 * scale}
				cy={centerY - circleSmallOffset * scale - circleSmallRadius * 0.2 * scale}
				rx={circleSmallRadius * 0.2 * scale}
				ry={circleSmallRadius * 0.4 * scale}
				fill="rgba(255, 255, 255, 0.3)"
				transform={`rotate(10, ${centerX - circleSmallRadius * 0.3 * scale}, ${centerY - circleSmallOffset * scale - circleSmallRadius * 0.2 * scale})`}
			/>
		</>
	);
}
