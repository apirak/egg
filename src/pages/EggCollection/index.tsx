import { useEffect, useRef, useState } from 'preact/hooks';
import { getSpriteGenerator } from '../../game/rendering/SpriteGenerator';
import {
	EGG_COLORS,
	EGG_LEVELS,
	EGG_COLOR_INFO,
	EGG_LEVEL_INFO,
	getEggDisplayName,
	getEggId,
	getEggSize,
} from '../../game/config/EggConfig';
import type { EggColor, EggLevel } from '../../types/egg';
import './style.css';

/**
 * Egg Collection Page
 *
 * Displays all 15 egg types (3 colors × 5 levels) in a beautiful grid layout
 */
export function EggCollection() {
	const [selectedEgg, setSelectedEgg] = useState<{ color: EggColor; level: EggLevel } | null>(null);
	const canvasRefs = useRef<Map<HTMLCanvasElement, { color: EggColor; level: EggLevel }>>(new Map());

	useEffect(() => {
		// Render all sprites when component mounts
		const spriteGen = getSpriteGenerator();
		canvasRefs.current.forEach((data, canvas) => {
			const sprite = spriteGen.getSpriteForColor(data.color, data.level);
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			canvas.width = sprite.width;
			canvas.height = sprite.height;
			ctx.drawImage(sprite.canvas, 0, 0);
		});
	}, []);

	const handleCanvasRef = (canvas: HTMLCanvasElement | null, color: EggColor, level: EggLevel) => {
		if (canvas) {
			canvasRefs.current.set(canvas, { color, level });
			// Immediately render
			const spriteGen = getSpriteGenerator();
			const sprite = spriteGen.getSpriteForColor(color, level);
			const ctx = canvas.getContext('2d');
			if (ctx) {
				canvas.width = sprite.width;
				canvas.height = sprite.height;
				ctx.drawImage(sprite.canvas, 0, 0);
			}
		}
	};

	return (
		<div class="collection-page">
			<header class="collection-header">
				<div class="header-content">
					<div>
						<h1>🥚 Egg Collection</h1>
						<p class="subtitle">All 15 egg types - Collect them all!</p>
					</div>
					<div class="header-badge">Step 2: Collection</div>
				</div>
			</header>

			<main class="collection-main">
				{/* Stats Bar */}
				<div class="stats-bar">
					<div class="stat-item">
						<span class="stat-value">15</span>
						<span class="stat-label">Total Types</span>
					</div>
					<div class="stat-item">
						<span class="stat-value">3</span>
						<span class="stat-label">Colors</span>
					</div>
					<div class="stat-item">
						<span class="stat-value">5</span>
						<span class="stat-label">Levels</span>
					</div>
				</div>

				{/* Collection Grid */}
				<div class="collection-grid">
					{EGG_COLORS.map((color) => (
						<div key={color} class="color-section">
							<div class="color-header" style={{ borderColor: EGG_COLOR_INFO[color].emoji === '🔴' ? '#e74c3c' : EGG_COLOR_INFO[color].emoji === '🔵' ? '#3498db' : '#2ecc71' }}>
								<span class="color-emoji">{EGG_COLOR_INFO[color].emoji}</span>
								<span class="color-name">{EGG_COLOR_INFO[color].name}</span>
							</div>

							<div class="level-grid">
								{EGG_LEVELS.map((level) => {
									const isSelected = selectedEgg?.color === color && selectedEgg?.level === level;
									return (
										<div
											key={level}
											class={`egg-card ${isSelected ? 'selected' : ''}`}
											onClick={() => setSelectedEgg({ color, level })}
										>
											<div class="egg-visual">
												<EggCanvas
													color={color}
													level={level}
													onCanvas={(canvas) => handleCanvasRef(canvas, color, level)}
												/>
												<div class="level-badge">L{level}</div>
											</div>
											<div class="egg-info">
												<div class="egg-name">{EGG_LEVEL_INFO[level].name}</div>
												<div class="egg-size">{getEggSize(level).toFixed(0)}px</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>

				{/* Selected Egg Detail */}
				{selectedEgg && (
					<div class="egg-detail-panel">
						<div class="detail-content">
							<h2>
								{EGG_COLOR_INFO[selectedEgg.color].emoji} {getEggDisplayName(selectedEgg)}
							</h2>
							<p class="detail-description">
								{EGG_LEVEL_INFO[selectedEgg.level].description}
							</p>
							<div class="detail-stats">
								<div class="detail-stat">
									<span class="detail-label">Color:</span>
									<span class="detail-value">{EGG_COLOR_INFO[selectedEgg.color].name}</span>
								</div>
								<div class="detail-stat">
									<span class="detail-label">Level:</span>
									<span class="detail-value">{selectedEgg.level}</span>
								</div>
								<div class="detail-stat">
									<span class="detail-label">Size:</span>
									<span class="detail-value">{getEggSize(selectedEgg.level).toFixed(0)}px</span>
								</div>
								<div class="detail-stat">
									<span class="detail-label">Multiplier:</span>
									<span class="detail-value">×{(1.2 ** (selectedEgg.level - 1)).toFixed(3)}</span>
								</div>
							</div>
							<button
								class="close-detail-btn"
								onClick={() => setSelectedEgg(null)}
							>
								Close
							</button>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

/**
 * Individual egg canvas component
 */
function EggCanvas({
	color,
	level,
	onCanvas,
}: {
	color: EggColor;
	level: EggLevel;
	onCanvas?: (canvas: HTMLCanvasElement | null) => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const spriteGen = getSpriteGenerator();
		const sprite = spriteGen.getSpriteForColor(color, level);

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = sprite.width;
		canvas.height = sprite.height;
		ctx.drawImage(sprite.canvas, 0, 0);

		if (onCanvas) {
			onCanvas(canvas);
		}
	}, [color, level, onCanvas]);

	return <canvas ref={canvasRef} class="egg-canvas" />;
}
