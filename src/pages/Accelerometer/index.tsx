import { useEffect, useRef, useState } from 'preact/hooks';
import { Bodies, Body, Composite, Engine, World } from 'matter-js';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import { GAME_CONFIG } from '../../game/config';
import { withBasePath } from '../../utils/routes';
import './style.css';

export function Accelerometer() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<Engine | null>(null);
	const orientationRef = useRef<{ beta: number; gamma: number; gravityX: number; gravityY: number } | null>(null);
	const tiltEnabledRef = useRef(false);

	const {
		orientation,
		permissionState,
		isEnabled: tiltEnabled,
		isSupported: tiltSupported,
		requestPermission,
		toggle: toggleTilt,
	} = useDeviceOrientation();

	// Button areas for click detection
	const buttonAreas = useRef<{
		tiltToggle: { x: number; y: number; w: number; h: number };
		resetBall: { x: number; y: number; w: number; h: number };
		backButton: { x: number; y: number; w: number; h: number };
	} | null>(null);

	// Keep refs updated
	useEffect(() => {
		orientationRef.current = orientation;
	}, [orientation]);

	useEffect(() => {
		tiltEnabledRef.current = tiltEnabled;
	}, [tiltEnabled]);

	// Handle permission request
	const handleEnableTilt = async () => {
		if (permissionState === 'prompt') {
			const state = await requestPermission();
			if (state === 'granted') {
				toggleTilt();
			}
		} else if (permissionState === 'granted') {
			toggleTilt();
		}
	};

	// Auto-enable tilt on mount for supported devices
	useEffect(() => {
		if (!tiltSupported) return;

		if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
			const DeviceOrientationEvent = window.DeviceOrientationEvent as any;
			if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
				requestPermission().then((state) => {
					if (state === 'granted') {
						toggleTilt();
					}
				});
			}
		}
	}, []);

	const resetBall = () => {
		if (!engineRef.current) return;
		const bodies = Composite.allBodies(engineRef.current.world);
		const ball = bodies.find(b => b.label === 'test-ball');
		if (ball && mainRef.current) {
			const cssWidth = mainRef.current.clientWidth;
			const cssHeight = mainRef.current.clientHeight;
			Body.setPosition(ball, { x: cssWidth / 2, y: cssHeight / 2 });
			Body.setVelocity(ball, { x: 0, y: 0 });
			Body.setAngularVelocity(ball, 0);
		}
	};

	const goBack = () => {
		window.location.href = withBasePath('/');
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const main = mainRef.current;
		if (!canvas || !main) return;

		let cssWidth = main.clientWidth;
		let cssHeight = main.clientHeight;

		// Create Matter.js engine
		const engine = Engine.create({
			gravity: { x: 0, y: 0 },
			enableSleeping: false,
		});
		engineRef.current = engine;

		// Create test ball
		const ballRadius = 25;
		const ball = Bodies.circle(cssWidth / 2, cssHeight / 2, ballRadius, {
			restitution: 0.7,
			friction: 0.001,
			frictionAir: 0.01,
			density: 0.001,
			label: 'test-ball',
		});
		World.add(engine.world, ball);

		// Create walls (thicker and extended to prevent ball escaping)
		const wallThickness = 100;
		const extension = 200; // Extra extension beyond canvas
		const walls = [
			Bodies.rectangle(-wallThickness / 2, cssHeight / 2, wallThickness + extension, cssHeight * 3, { isStatic: true, label: 'wall' }),
			Bodies.rectangle(cssWidth + wallThickness / 2, cssHeight / 2, wallThickness + extension, cssHeight * 3, { isStatic: true, label: 'wall' }),
			Bodies.rectangle(cssWidth / 2, cssHeight + wallThickness / 2, cssWidth * 3 + extension * 2, wallThickness + extension, { isStatic: true, label: 'wall' }),
			Bodies.rectangle(cssWidth / 2, -wallThickness / 2, cssWidth * 3 + extension * 2, wallThickness + extension, { isStatic: true, label: 'wall' }),
		];
		World.add(engine.world, walls);

		const setupCanvas = () => {
			const rect = main.getBoundingClientRect();
			cssWidth = Math.max(1, Math.floor(rect.width));
			cssHeight = Math.max(1, Math.floor(rect.height));

			const dpr = Math.max(1, window.devicePixelRatio || 1);
			canvas.width = Math.round(cssWidth * dpr);
			canvas.height = Math.round(cssHeight * dpr);
			canvas.style.width = `${cssWidth}px`;
			canvas.style.height = `${cssHeight}px`;

			// Update button areas
			const padding = 12;
			const buttonWidth = 110;
			const buttonHeight = 44;

			buttonAreas.current = {
				tiltToggle: { x: cssWidth - buttonWidth - padding, y: padding, w: buttonWidth, h: buttonHeight },
				resetBall: { x: padding, y: cssHeight - buttonHeight - padding, w: buttonWidth, h: buttonHeight },
				backButton: { x: padding, y: padding, w: buttonWidth, h: buttonHeight },
			};

			// Reposition ball if out of bounds
			if (ball.position.x < 0 || ball.position.x > cssWidth || ball.position.y < 0 || ball.position.y > cssHeight) {
				Body.setPosition(ball, { x: cssWidth / 2, y: cssHeight / 2 });
				Body.setVelocity(ball, { x: 0, y: 0 });
			}
		};

		setupCanvas();

		const drawButton = (
			ctx: CanvasRenderingContext2D,
			x: number, y: number, w: number, h: number,
			text: string, icon: string,
			isActive: boolean,
			bgColor: string,
		) => {
			// Background
			ctx.beginPath();
			ctx.roundRect(x, y, w, h, 22);
			ctx.fillStyle = bgColor;
			ctx.fill();
			ctx.strokeStyle = isActive ? '#667eea' : 'rgba(0, 0, 0, 0.1)';
			ctx.lineWidth = 2;
			ctx.stroke();

			// Shadow
			ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
			ctx.shadowBlur = 4;
			ctx.shadowOffsetY = 2;

			// Text
			ctx.shadowColor = 'transparent';
			ctx.font = 'bold 14px system-ui, sans-serif';
			ctx.fillStyle = isActive ? '#ffffff' : '#495057';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(`${icon} ${text}`, x + w / 2, y + h / 2);
		};

		const draw = () => {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const dpr = Math.max(1, window.devicePixelRatio || 1);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, cssWidth, cssHeight);

			// Draw background
			const gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
			gradient.addColorStop(0, '#667eea');
			gradient.addColorStop(1, '#764ba2');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, cssWidth, cssHeight);

			// Draw faint grid
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
			ctx.lineWidth = 1;
			const gridSize = 50;
			for (let x = 0; x < cssWidth; x += gridSize) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, cssHeight);
				ctx.stroke();
			}
			for (let y = 0; y < cssHeight; y += gridSize) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(cssWidth, y);
				ctx.stroke();
			}

			// Draw test ball
			ctx.save();
			ctx.translate(ball.position.x, ball.position.y);
			ctx.rotate(ball.angle);
			ctx.beginPath();
			ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
			const ballGradient = ctx.createRadialGradient(-8, -8, 0, 0, 0, ballRadius);
			ballGradient.addColorStop(0, '#ffffff');
			ballGradient.addColorStop(0.3, '#ffecd2');
			ballGradient.addColorStop(1, '#fcb69f');
			ctx.fillStyle = ballGradient;
			ctx.fill();
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.restore();

			// Draw buttons
			const areas = buttonAreas.current;
			if (areas) {
				// Top Left: Back
				drawButton(ctx, areas.backButton.x, areas.backButton.y, areas.backButton.w, areas.backButton.h, 'Back', '←', false, 'rgba(255, 255, 255, 0.95)');

				// Top Right: Tilt Toggle
				drawButton(ctx, areas.tiltToggle.x, areas.tiltToggle.y, areas.tiltToggle.w, areas.tiltToggle.h,
					tiltEnabledRef.current ? 'Tilt ON' : 'Tilt OFF', '📱', tiltEnabledRef.current,
					tiltEnabledRef.current ? '#667eea' : 'rgba(255, 255, 255, 0.95)');

				// Bottom Left: Reset Ball
				drawButton(ctx, areas.resetBall.x, areas.resetBall.y, areas.resetBall.w, areas.resetBall.h, 'Reset', '🔄', false, 'rgba(255, 255, 255, 0.95)');

				// Bottom Right: Gravity Info
				const orient = orientationRef.current;
				if (orient && tiltEnabledRef.current) {
					const infoX = cssWidth - 12;
					const infoY = cssHeight - 12;
					ctx.font = 'bold 12px system-ui, monospace';
					ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
					ctx.textAlign = 'right';
					ctx.textBaseline = 'bottom';
					ctx.fillText(`Gx: ${orient.gravityX.toFixed(2)}`, infoX, infoY);
					ctx.fillText(`Gy: ${orient.gravityY.toFixed(2)}`, infoX, infoY - 16);
				}
			}

			// Draw tilt indicator in center
			if (tiltSupported) {
				drawTiltIndicator(ctx, cssWidth, cssHeight, tiltEnabledRef.current, orientationRef.current);
			}
		};

		const drawTiltIndicator = (
			ctx: CanvasRenderingContext2D,
			width: number,
			height: number,
			isEnabled: boolean,
			orient: { beta: number; gamma: number; gravityX: number; gravityY: number } | null,
		) => {
			const centerX = width / 2;
			const centerY = height / 2;
			const radius = 60;

			// Background circle
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.fillStyle = isEnabled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
			ctx.fill();
			ctx.strokeStyle = isEnabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
			ctx.lineWidth = 2;
			ctx.stroke();

			// Direction line
			if (isEnabled && orient) {
				const gravityMagnitude = Math.sqrt(orient.gravityX ** 2 + orient.gravityY ** 2);
				const maxGravity = GAME_CONFIG.tilt.maxTiltAngle * GAME_CONFIG.tilt.gravityScale;
				const lineLength = (gravityMagnitude / maxGravity) * (radius - 8);

				if (lineLength > 2) {
					const angle = Math.atan2(orient.gravityY, orient.gravityX);
					const endX = centerX + Math.cos(angle) * lineLength;
					const endY = centerY + Math.sin(angle) * lineLength;
					const startX = centerX - Math.cos(angle) * lineLength;
					const startY = centerY - Math.sin(angle) * lineLength;

					ctx.beginPath();
					ctx.moveTo(startX, startY);
					ctx.lineTo(endX, endY);
					ctx.strokeStyle = '#ffffff';
					ctx.lineWidth = 3;
					ctx.lineCap = 'round';
					ctx.stroke();

					// Arrow head
					const arrowSize = 8;
					ctx.beginPath();
					ctx.moveTo(endX, endY);
					ctx.lineTo(
						endX - arrowSize * Math.cos(angle - Math.PI / 6),
						endY - arrowSize * Math.sin(angle - Math.PI / 6),
					);
					ctx.moveTo(endX, endY);
					ctx.lineTo(
						endX - arrowSize * Math.cos(angle + Math.PI / 6),
						endY - arrowSize * Math.sin(angle + Math.PI / 6),
					);
					ctx.stroke();
				}
			}

			// Center dot
			ctx.beginPath();
			ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
			ctx.fillStyle = isEnabled ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
			ctx.fill();

			// Direction labels
			ctx.font = '14px system-ui, sans-serif';
			ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
			ctx.textAlign = 'center';
			ctx.fillText('↓', centerX, centerY + radius + 16);
			ctx.fillText('↑', centerX, centerY - radius - 8);
			ctx.textAlign = 'left';
			ctx.fillText('←', centerX - radius - 8, centerY + 5);
			ctx.textAlign = 'right';
			ctx.fillText('→', centerX + radius + 8, centerY + 5);
		};

		// Update gravity when orientation changes
		let lastGravityX = 0;
		let lastGravityY = 0;

		const updatePhysics = () => {
			if (!engineRef.current) return;

			const orient = orientationRef.current;
			const enabled = tiltEnabledRef.current;

			if (enabled && orient) {
				engineRef.current.world.gravity.x = orient.gravityX;
				engineRef.current.world.gravity.y = orient.gravityY;

				if (Math.abs(orient.gravityX - lastGravityX) > 0.01 || Math.abs(orient.gravityY - lastGravityY) > 0.01) {
					Body.setVelocity(ball, { x: ball.velocity.x * 0.9, y: ball.velocity.y * 0.9 });
					lastGravityX = orient.gravityX;
					lastGravityY = orient.gravityY;
				}
			} else {
				engineRef.current.world.gravity.x = 0;
				engineRef.current.world.gravity.y = 0;
			}

			Engine.update(engineRef.current, 1000 / 60);
			draw();
			requestAnimationFrame(updatePhysics);
		};

		updatePhysics();

		// Handle clicks on canvas
		const handleClick = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			const areas = buttonAreas.current;
			if (!areas) return;

			// Check tilt toggle
			if (x >= areas.tiltToggle.x && x <= areas.tiltToggle.x + areas.tiltToggle.w &&
				y >= areas.tiltToggle.y && y <= areas.tiltToggle.y + areas.tiltToggle.h) {
				handleEnableTilt();
				return;
			}

			// Check reset ball
			if (x >= areas.resetBall.x && x <= areas.resetBall.x + areas.resetBall.w &&
				y >= areas.resetBall.y && y <= areas.resetBall.y + areas.resetBall.h) {
				resetBall();
				return;
			}

			// Check back button
			if (x >= areas.backButton.x && x <= areas.backButton.x + areas.backButton.w &&
				y >= areas.backButton.y && y <= areas.backButton.y + areas.backButton.h) {
				goBack();
				return;
			}
		};

		canvas.addEventListener('click', handleClick);

		const handleResize = () => {
			setupCanvas();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			canvas.removeEventListener('click', handleClick);
			window.removeEventListener('resize', handleResize);
			World.clear(engine.world, false);
			Engine.clear(engine);
		};
	}, [tiltSupported, permissionState, requestPermission, toggleTilt]);

	return (
		<div class="accelerometer-page">
			<main ref={mainRef} class="accelerometer-main">
				<canvas ref={canvasRef} class="accelerometer-canvas" />
			</main>
		</div>
	);
}
