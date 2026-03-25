import { useState, useEffect, useRef } from 'preact/hooks';
import { Layout, Page } from '../../design-system';
import { BackButton } from '../../components/BackButton';
import { generateEggPoints, eggPointsToPath, DEFAULT_EGG_MATH, type EggParametricConfig, getEggDimensions } from '../../game/geometry/EggGeometryMath';
import './style.css';

/**
 * Parametric Egg Demo - Using math equations for perfect egg shape
 */
export function MathEggDemo() {
	const [config, setConfig] = useState<EggParametricConfig>(DEFAULT_EGG_MATH);

	const points = generateEggPoints(config, 150);
	const pathData = eggPointsToPath(points);
	const dimensions = getEggDimensions(config);

	// SVG settings
	const svgSize = 500;
	const centerX = svgSize / 2;
	const centerY = svgSize / 2;
	const scale = 6;

	// Preset configurations
	const presets = [
		{ name: 'Classic Egg', config: { a: 20, b: 28, k: 0.3 } },
		{ name: 'Round Egg', config: { a: 22, b: 26, k: 0.15 } },
		{ name: 'Long Egg', config: { a: 18, b: 32, k: 0.35 } },
		{ name: 'Oval', config: { a: 20, b: 28, k: 0 } },
	];

	return (
		<div class="math-egg-page">
			<header class="page-header">
				<div class="header-content">
					<BackButton />
					<div>
						<h1>🥚 Egg Shape Geometry</h1>
						<p class="subtitle">Parametric Equation: x = a × cos(t) × (1 + k × sin(t)), y = b × sin(t)</p>
					</div>
					<div class="header-badge">Step 1: Egg Shape</div>
				</div>
			</header>

			<main class="demo-layout">
				{/* Left: Canvas/Preview */}
				<section class="preview-section">
					<div class="preview-card">
						<div class="preview-header">
							<h2>Live Preview</h2>
							<div class="dimensions-badge">
								{dimensions.width.toFixed(0)} × {dimensions.height.toFixed(0)} px
							</div>
						</div>

						<div class="canvas-wrapper">
							<svg
								width={svgSize}
								height={svgSize}
								viewBox={`0 0 ${svgSize} ${svgSize}`}
								class="egg-canvas"
							>
								{/* Background grid */}
								<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
									<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
								</pattern>
								<rect width="100%" height="100%" fill="url(#grid)" />

								{/* Center lines */}
								<line x1="0" y1={centerY} x2={svgSize} y2={centerY} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4,4" />
								<line x1={centerX} y1="0" x2={centerX} y2={svgSize} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4,4" />

								{/* Reference ellipse (dashed gray) */}
								<ellipse
									cx={centerX}
									cy={centerY}
									rx={config.a * scale}
									ry={config.b * scale}
									fill="none"
									stroke="#d0d0d0"
									strokeWidth="1.5"
									strokeDasharray="6,4"
								/>

								{/* The egg shape */}
								<g transform={`translate(${centerX}, ${centerY}) scale(${scale})`}>
									<path
										d={pathData}
										fill="url(#eggGradient)"
										stroke="#c0392b"
										strokeWidth="0.4"
									/>
								</g>

								{/* Highlight/shine */}
								<ellipse
									cx={centerX - config.a * 0.25 * scale}
									cy={centerY - config.b * 0.55 * scale}
									rx={config.a * 0.18 * scale}
									ry={config.b * 0.22 * scale}
									fill="rgba(255, 255, 255, 0.35)"
									transform={`rotate(-8, ${centerX - config.a * 0.25 * scale}, ${centerY - config.b * 0.55 * scale})`}
								/>

								{/* Shadow at bottom */}
								<ellipse
									cx={centerX}
									cy={centerY + config.b * scale + 8}
									rx={config.a * 0.8 * scale}
									ry={6}
									fill="rgba(0, 0, 0, 0.1)"
								/>

								{/* Gradient */}
								<defs>
									<linearGradient id="eggGradient" x1="0%" y1="100%" x2="0%" y2="0%">
										<stop offset="0%" stopColor="#e74c3c">
											<animate attributeName="stop-color" values="#e74c3c;#c0392b;#e74c3c" dur="3s" repeatCount="indefinite" />
										</stop>
										<stop offset="50%" stopColor="#ff6b6b" />
										<stop offset="100%" stopColor="#c0392b" />
									</linearGradient>
								</defs>
							</svg>
						</div>

						{/* Legend */}
						<div class="legend">
							<div class="legend-item">
								<div class="legend-dot" style={{ background: '#e74c3c' }}></div>
								<span>Egg Shape</span>
							</div>
							<div class="legend-item">
								<div class="legend-line" style={{ borderColor: '#d0d0d0', borderStyle: 'dashed' }}></div>
								<span>Reference Ellipse</span>
							</div>
						</div>
					</div>
				</section>

				{/* Right: Controls */}
				<section class="controls-section">
					{/* Quick Presets */}
					<div class="control-card">
						<h3>🎨 Quick Presets</h3>
						<div class="presets-grid">
							{presets.map((preset) => (
								<button
									key={preset.name}
									class={`preset-btn ${config.a === preset.config.a && config.b === preset.config.b && config.k === preset.config.k ? 'active' : ''}`}
									onClick={() => setConfig(preset.config)}
								>
									{preset.name}
								</button>
							))}
						</div>
					</div>

					{/* Parameter Controls */}
					<div class="control-card">
						<h3>⚙️ Parameters</h3>

						{/* Width (a) */}
						<div class="control-group">
							<div class="control-header">
								<label>Width (a)</label>
								<span class="control-value">{config.a}</span>
							</div>
							<input
								type="range"
								min="12"
								max="32"
								step="1"
								value={config.a}
								onInput={(e) => setConfig({ ...config, a: Number(e.currentTarget.value) })}
								class="control-slider"
							/>
							<div class="control-hint">Controls the egg width</div>
						</div>

						{/* Height (b) */}
						<div class="control-group">
							<div class="control-header">
								<label>Height (b)</label>
								<span class="control-value">{config.b}</span>
							</div>
							<input
								type="range"
								min="18"
								max="42"
								step="1"
								value={config.b}
								onInput={(e) => setConfig({ ...config, b: Number(e.currentTarget.value) })}
								class="control-slider"
							/>
							<div class="control-hint">Controls the egg height</div>
						</div>

						{/* Asymmetry (k) */}
						<div class="control-group">
							<div class="control-header">
								<label>Asymmetry (k)</label>
								<span class="control-value">{config.k.toFixed(2)}</span>
							</div>
							<input
								type="range"
								min="-0.4"
								max="0.5"
								step="0.02"
								value={config.k}
								onInput={(e) => setConfig({ ...config, k: Number(e.currentTarget.value) })}
								class="control-slider"
							/>
							<div class="control-hint">
								{config.k > 0.1 ? '↓ Wider bottom, pointier top' : config.k < -0.1 ? '↑ Wider top, pointier bottom' : '○ Symmetric oval'}
							</div>
						</div>
					</div>

					{/* Current Values */}
					<div class="control-card">
						<h3>📐 Current Configuration</h3>
						<div class="values-grid">
							<div class="value-item">
								<span class="value-label">Width</span>
								<span class="value-number">{dimensions.width.toFixed(1)} px</span>
							</div>
							<div class="value-item">
								<span class="value-label">Height</span>
								<span class="value-number">{dimensions.height.toFixed(1)} px</span>
							</div>
							<div class="value-item">
								<span class="value-label">Ratio</span>
								<span class="value-number">{(dimensions.height / dimensions.width).toFixed(2)}</span>
							</div>
						</div>
						<button
							class="reset-btn"
							onClick={() => setConfig(DEFAULT_EGG_MATH)}
						>
							↺ Reset to Default
						</button>
					</div>

					{/* Equation Info */}
					<div class="control-card info-card">
						<h3>💡 About</h3>
						<p>The egg shape uses a <strong>parametric equation</strong> that modifies an ellipse:</p>
						<div class="equation">
							x = a × cos(t) × (1 + k × sin(t))
						</div>
						<div class="equation">
							y = b × sin(t)
						</div>
						<p class="note">Where t ranges from -π to π, and k controls the asymmetry.</p>
					</div>
				</section>
			</main>

		</div>
	);
}
