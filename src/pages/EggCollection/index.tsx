import { useEffect, useRef } from 'preact/hooks';
import { getSpriteGenerator } from '../../game/rendering/SpriteGenerator';
import { BackButton } from '../../components/BackButton';
import {
	EGG_COLORS,
	EGG_LEVELS,
	EGG_COLOR_INFO,
	getGameplayEggSize,
} from '../../game/config/EggConfig';
import type { EggColor, EggLevel } from '../../types/egg';
import './style.css';

/**
 * Egg Collection Page
 *
 * Displays all 30 egg types (5 colors x 6 levels)
 */
export function EggCollection() {
	return (
		<div class="collection-page">
			<header class="collection-header">
				<div class="header-content">
					<BackButton />
					<div>
						<h1>🥚 Egg Collection</h1>
						<p class="subtitle">All 15 egg types - Collect them all!</p>
					</div>
					<div class="header-badge">Step 2: Collection</div>
				</div>
			</header>

			<main class="collection-main">
				{/* Pre-rendered Sprites Section */}
				<section class="sprites-section">
					<div class="sprites-container">
						<h2>🎨 Pre-rendered Sprites (5 Colors x 6 Levels)</h2>
						<p class="sprites-note">These sprites are generated once and cached for 60FPS performance</p>
						<SpriteGridView />
					</div>
				</section>
			</main>
		</div>
	);
}

/**
 * Component to display all egg sprites in a table format
 */
function SpriteGridView() {
	const colors: EggColor[] = EGG_COLORS;
	const levels: EggLevel[] = EGG_LEVELS;
	const levelNames = ['', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

	return (
		<table class="sprite-table">
			<thead>
				<tr>
					<th class="corner-header"></th>
					{colors.map((color) => (
						<th key={color} class="color-header-th">
							{EGG_COLOR_INFO[color].name}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{levels.map((level) => (
					<tr key={level}>
						<th class="level-header-th">
							{levelNames[level]}
						</th>
						{colors.map((color) => (
							<td key={color} class="sprite-cell-td">
								<SpriteCanvasView color={color} level={level} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

/**
 * Individual sprite canvas component for the grid view
 */
function SpriteCanvasView({ color, level }: { color: EggColor; level: EggLevel }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const spriteGen = getSpriteGenerator();
		const sprite = spriteGen.getSpriteForColor(color, level);

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const displayWidth = getGameplayEggSize(sprite.width);
		const displayHeight = getGameplayEggSize(sprite.height);
		const dpr = Math.max(1, window.devicePixelRatio || 1);

		canvas.width = Math.max(1, Math.round(displayWidth * dpr));
		canvas.height = Math.max(1, Math.round(displayHeight * dpr));
		canvas.style.width = `${displayWidth}px`;
		canvas.style.height = `${displayHeight}px`;

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';

		const drawSprite = () => {
			ctx.clearRect(0, 0, displayWidth, displayHeight);
			ctx.drawImage(sprite.canvas, 0, 0, displayWidth, displayHeight);
		};

		drawSprite();

		if (level !== 6) return;

		// L6 overlays Twemoji asynchronously, so redraw for a short period.
		let rafId = 0;
		const start = performance.now();
		const maxDurationMs = 1400;

		const refreshUntilLoaded = (time: number) => {
			drawSprite();
			if (time - start < maxDurationMs) {
				rafId = requestAnimationFrame(refreshUntilLoaded);
			}
		};

		rafId = requestAnimationFrame(refreshUntilLoaded);

		return () => {
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [color, level]);

	return <canvas ref={canvasRef} class="sprite-canvas" />;
}