import { useEffect, useRef, useState } from 'preact/hooks';
import { Body, Collision } from 'matter-js';
import { EggFactory, type EggEntity } from '../../game/entities';
import { GameLoop, PhysicsWorld } from '../../game/core';
import { GAME_CONFIG } from '../../game/config';
import { MergeSystem } from '../../game/systems';
import type { EggLevel } from '../../types/egg';
import { CardReveal } from '../../components/card/CardReveal';
import { addCard, getCardByEmoji, type Card, type EggColor as CardEggColor } from '../../lib/cardData';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import { withBasePath } from '../../utils/routes';
import './style.css';

/**
 * Game Page - Placeholder for Step 4
 */
export function Game() {
	const isDebugMode = import.meta.env.DEV;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mainRef = useRef<HTMLElement>(null);
	const physicsWorldRef = useRef<PhysicsWorld | null>(null);
	const orientationRef = useRef<{ beta: number; gamma: number; gravityX: number; gravityY: number } | null>(null);
	const tiltEnabledRef = useRef(false);
	const revealActiveRef = useRef(false);
	const debugSpawnLevel6Ref = useRef<(() => void) | null>(null);

	const [showTiltModal, setShowTiltModal] = useState(false);
	const [revealedCard, setRevealedCard] = useState<Card | null>(null);
	const [revealedEggColor, setRevealedEggColor] = useState<CardEggColor | null>(null);
	const [revealOrigin, setRevealOrigin] = useState<{ x: number; y: number } | null>(null);

	const {
		orientation,
		isEnabled: tiltEnabled,
		isSupported: tiltSupported,
		requestPermission,
		toggle: toggleTilt,
	} = useDeviceOrientation();

	// Keep refs updated
	useEffect(() => {
		orientationRef.current = orientation;
	}, [orientation]);

	useEffect(() => {
		tiltEnabledRef.current = tiltEnabled;
	}, [tiltEnabled]);

	useEffect(() => {
		revealActiveRef.current = revealedCard !== null && revealedEggColor !== null && revealOrigin !== null;
	}, [revealedCard, revealedEggColor, revealOrigin]);

	const handleCardRevealComplete = () => {
		setRevealedCard(null);
		setRevealedEggColor(null);
		setRevealOrigin(null);
	};

	// Show modal if tilt is supported but not enabled after a delay
	useEffect(() => {
		if (!tiltSupported) return;

		// Check if iOS (requires permission)
		if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
			const DeviceOrientationEvent = window.DeviceOrientationEvent as any;
			if (typeof DeviceOrientationEvent.requestPermission === 'function') {
				// iOS - show modal if not enabled after 2 seconds
				const timer = setTimeout(() => {
					if (!tiltEnabledRef.current) {
						setShowTiltModal(true);
					}
				}, 2000);
				return () => clearTimeout(timer);
			}
		}
	}, [tiltSupported]);

	// Handle enable tilt from modal
	const handleEnableTilt = async () => {
		setShowTiltModal(false);
		const state = await requestPermission();
		if (state === 'granted') {
			toggleTilt();
		}
	};

	// Auto-enable tilt on mount (hidden, no button shown)
	useEffect(() => {
		if (!tiltSupported) return;

		if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
			const DeviceOrientationEvent = window.DeviceOrientationEvent as any;
			if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
				// Non-iOS device - auto-enable
				requestPermission().then((state) => {
					if (state === 'granted') {
						toggleTilt();
					}
				});
			}
		}
	}, []); // Run once on mount

	// Update gravity when orientation changes
	useEffect(() => {
		const physicsWorld = physicsWorldRef.current;
		if (!physicsWorld || !tiltEnabled || !orientation) return;

		physicsWorld.setGravity(orientation.gravityX, orientation.gravityY);
	}, [orientation, tiltEnabled]);

	// Reset gravity when tilt is disabled
	useEffect(() => {
		const physicsWorld = physicsWorldRef.current;
		if (!physicsWorld || tiltEnabled) return;

		physicsWorld.resetGravity();
	}, [tiltEnabled]);

	// Lock page scroll only while the game page is mounted.
	useEffect(() => {
		const appRoot = document.getElementById('app');
		document.body.classList.add('game-scroll-lock');
		appRoot?.classList.add('game-scroll-lock');

		return () => {
			document.body.classList.remove('game-scroll-lock');
			appRoot?.classList.remove('game-scroll-lock');
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		const main = mainRef.current;
		if (!canvas || !main) return;

		let cssWidth = GAME_CONFIG.width;
		let cssHeight = GAME_CONFIG.height;

		const physicsWorld = new PhysicsWorld(cssWidth, cssHeight);
		physicsWorldRef.current = physicsWorld;
		const eggFactory = new EggFactory();
		const mergeSystem = new MergeSystem();

		const setupCanvas = () => {
			const rect = main.getBoundingClientRect();
			cssWidth = Math.max(1, Math.floor(rect.width));
			cssHeight = Math.max(1, Math.floor(rect.height));

			const dpr = Math.max(1, window.devicePixelRatio || 1);
			canvas.width = Math.round(cssWidth * dpr);
			canvas.height = Math.round(cssHeight * dpr);
			canvas.style.width = `${cssWidth}px`;
			canvas.style.height = `${cssHeight}px`;

			physicsWorld.resize(cssWidth, cssHeight);
		};

		setupCanvas();

		const draw = () => {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const dpr = Math.max(1, window.devicePixelRatio || 1);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, cssWidth, cssHeight);

			const eggs = physicsWorld.getEggs();
			for (const egg of eggs) {
				ctx.save();
				ctx.translate(egg.body.position.x, egg.body.position.y);
				ctx.rotate(egg.body.angle);
				ctx.drawImage(
					egg.sprite.canvas,
					-egg.displayWidth / 2,
					-egg.displayHeight / 2,
					egg.displayWidth,
					egg.displayHeight,
				);
				ctx.restore();
			}

			// Draw tilt indicator dot
			if (tiltSupported) {
				const dotX = cssWidth - 64;
				const dotY = 20;
				const dotRadius = 4;

				// Outer ring
				// ctx.beginPath();
				// ctx.arc(dotX, dotY, dotRadius + 2, 0, Math.PI * 2);
				// ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
				// ctx.lineWidth = 2;
				// ctx.stroke();

				// Dot
				ctx.beginPath();
				ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
				ctx.fillStyle = tiltEnabledRef.current ? '#2ecc71' : 'rgba(0, 0, 0, 0.3)';
				ctx.fill();

				// Icon
				// ctx.font = '10px system-ui, sans-serif';
				// ctx.fillStyle = tiltEnabledRef.current ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
				// ctx.textAlign = 'center';
				// ctx.textBaseline = 'middle';
				// ctx.fillText('📱', dotX, dotY);
			}
		};

		const tryMergeOnePair = (): boolean => {
			const pair = mergeSystem.findMergePair(physicsWorld.getEggs());
			if (!pair) return false;

			const [a, b] = pair;
			mergeSystem.markMerged([a.id, b.id]);

			let mergeX = (a.body.position.x + b.body.position.x) / 2;
			let mergeY = (a.body.position.y + b.body.position.y) / 2;

			physicsWorld.removeEggs([a, b]);

			const nextLevel = (a.level + 1) as EggLevel;
			const mergedEgg = eggFactory.createEgg(mergeX, mergeY, nextLevel, a.color);

			// Clear space for merged egg: gently push nearby eggs away from merge point
			const clearRadius = mergedEgg.displayWidth * 0.8;
			const pushForce = 0.008;

			for (const egg of physicsWorld.getEggs()) {
				const dx = egg.body.position.x - mergeX;
				const dy = egg.body.position.y - mergeY;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < clearRadius && dist > 0) {
					// Push away gently
					const forceX = (dx / dist) * pushForce;
					const forceY = (dy / dist) * pushForce;
					Body.applyForce(egg.body, egg.body.position, { x: forceX, y: forceY });
				}
			}

			// Place merged egg at merge position
			Body.setPosition(mergedEgg.body, { x: mergeX, y: mergeY });
			Body.setVelocity(mergedEgg.body, {
				x: (a.body.velocity.x + b.body.velocity.x) / 2,
				y: (a.body.velocity.y + b.body.velocity.y) / 2,
			});
			Body.setAngularVelocity(mergedEgg.body, (a.body.angularVelocity + b.body.angularVelocity) / 2);
			physicsWorld.addEgg(mergedEgg);

			return true;
		};

		let physicsAccumulatorMs = 0;

		const loop = new GameLoop((deltaMs) => {
			physicsAccumulatorMs += Math.min(deltaMs, GAME_CONFIG.maxFrameDeltaMs);

			let substeps = 0;
			while (
				physicsAccumulatorMs >= GAME_CONFIG.fixedDeltaMs &&
				substeps < GAME_CONFIG.maxSubsteps
			) {
				physicsWorld.step(GAME_CONFIG.fixedDeltaMs);
				for (let i = 0; i < 2; i++) {
					if (!tryMergeOnePair()) break;
				}
				physicsAccumulatorMs -= GAME_CONFIG.fixedDeltaMs;
				substeps += 1;
			}

			if (substeps === GAME_CONFIG.maxSubsteps) {
				physicsAccumulatorMs = Math.min(physicsAccumulatorMs, GAME_CONFIG.fixedDeltaMs);
			}

			// Safety check: remove eggs that are out of bounds
			const eggsToRemove: EggEntity[] = [];
			for (const egg of physicsWorld.getEggs()) {
				const margin = egg.displayWidth / 2;
				if (
					egg.body.position.x < -margin ||
					egg.body.position.x > cssWidth + margin ||
					egg.body.position.y < -margin ||
					egg.body.position.y > cssHeight + margin
				) {
					eggsToRemove.push(egg);
				}
			}
			if (eggsToRemove.length > 0) {
				physicsWorld.removeEggs(eggsToRemove);
			}

			draw();
		});
		loop.start();

 		let activePointerId: number | null = null;
		let pointerX = cssWidth / 2;
		let pointerY = cssHeight / 2;
		let rapidFireTimer: number | null = null;
		const rapidFireIntervalMs = 90;

		const stopRapidFire = () => {
			if (rapidFireTimer !== null) {
				window.clearInterval(rapidFireTimer);
				rapidFireTimer = null;
			}
		};

		const spawnEggAt = (x: number, y: number, level: EggLevel = 1) => {
			const egg = eggFactory.createEgg(x, y, level);

			const halfW = egg.displayWidth / 2;
			const halfH = egg.displayHeight / 2;
			const clampedX = Math.max(halfW, Math.min(cssWidth - halfW, x));
			let candidateY = Math.max(halfH, Math.min(cssHeight - halfH, y));
			const stepUp = Math.max(4, Math.round(halfH * 0.5));

			for (let i = 0; i < 40; i++) {
				Body.setPosition(egg.body, { x: clampedX, y: candidateY });
				const overlaps = physicsWorld
					.getEggs()
					.some((existingEgg) => Collision.collides(egg.body, existingEgg.body));

				if (!overlaps) break;
				candidateY = Math.max(halfH, candidateY - stepUp);
			}

			Body.setPosition(egg.body, { x: clampedX, y: candidateY });

			// Small random upward pop so each spawned egg feels alive.
			const popVX = (Math.random() - 0.5) * 1.8;
			const popVY = -(1.6 + Math.random() * 1.8);
			Body.setVelocity(egg.body, { x: popVX, y: popVY });
			Body.setAngularVelocity(egg.body, (Math.random() - 0.5) * 0.12);

			physicsWorld.addEgg(egg);
		};

		const updatePointerPosition = (event: PointerEvent) => {
			const canvasRect = canvas.getBoundingClientRect();
			pointerX = event.clientX - canvasRect.left;
			pointerY = event.clientY - canvasRect.top;
		};

		const isPointInsideEgg = (egg: EggEntity, x: number, y: number): boolean => {
			const dx = x - egg.body.position.x;
			const dy = y - egg.body.position.y;
			const angle = -egg.body.angle;
			const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
			const localY = dx * Math.sin(angle) + dy * Math.cos(angle);

			const radiusX = egg.displayWidth / 2;
			const radiusY = egg.displayHeight / 2;
			if (radiusX <= 0 || radiusY <= 0) return false;

			const normalized =
				(localX * localX) / (radiusX * radiusX) +
				(localY * localY) / (radiusY * radiusY);

			return normalized <= 1;
		};

		const tryRevealLevel6EggAt = (x: number, y: number): boolean => {
			if (revealActiveRef.current) return false;

			const tappedEgg = [...physicsWorld.getEggs()]
				.reverse()
				.find((egg) => egg.level === 6 && isPointInsideEgg(egg, x, y));

			if (!tappedEgg) return false;

			const canvasRect = canvas.getBoundingClientRect();
			const originX = canvasRect.left + tappedEgg.body.position.x;
			const originY = canvasRect.top + tappedEgg.body.position.y;
			const blastCenterX = tappedEgg.body.position.x;
			const blastCenterY = tappedEgg.body.position.y;
			const blastRadius = GAME_CONFIG.cardReveal.pushRadiusPx;
			const baseForce = GAME_CONFIG.cardReveal.pushForce;
			const upwardLiftFactor = GAME_CONFIG.cardReveal.upwardLiftFactor;

			for (const egg of physicsWorld.getEggs()) {
				if (egg.id === tappedEgg.id) continue;

				const dx = egg.body.position.x - blastCenterX;
				const dy = egg.body.position.y - blastCenterY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist <= 0 || dist > blastRadius) continue;

				const influence = 1 - dist / blastRadius;
				const randomBoost = 0.85 + Math.random() * 0.5;
				const magnitude = baseForce * influence * randomBoost;

				Body.applyForce(egg.body, egg.body.position, {
					x: (dx / dist) * magnitude,
					y: (dy / dist) * magnitude - magnitude * upwardLiftFactor,
				});
			}

			if (!tappedEgg.emoji) return false;

			const rewardCard = getCardByEmoji(
				tappedEgg.color as CardEggColor,
				tappedEgg.emoji,
			);
			if (!rewardCard) return false;

			addCard(rewardCard.color, rewardCard.emoji);
			setRevealedCard(rewardCard);
			setRevealedEggColor(tappedEgg.color as CardEggColor);
			setRevealOrigin({ x: originX, y: originY });
			physicsWorld.removeEggs([tappedEgg]);

			return true;
		};

		const handlePointerDown = (event: PointerEvent) => {
			// Prevent default touch behaviors (zoom, scroll, context menu)
			event.preventDefault();
			if (revealActiveRef.current) return;
			activePointerId = event.pointerId;
			canvas.setPointerCapture(event.pointerId);
			updatePointerPosition(event);
			if (tryRevealLevel6EggAt(pointerX, pointerY)) {
				activePointerId = null;
				return;
			}
			spawnEggAt(pointerX, pointerY);

			stopRapidFire();
			rapidFireTimer = window.setInterval(() => {
				spawnEggAt(pointerX, pointerY);
			}, rapidFireIntervalMs);
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (activePointerId !== event.pointerId) return;
			// Prevent scrolling on touch devices
			event.preventDefault();
			updatePointerPosition(event);
		};

		const handlePointerUpOrCancel = (event: PointerEvent) => {
			if (activePointerId !== event.pointerId) return;
			event.preventDefault();
			activePointerId = null;
			stopRapidFire();
		};

		// Prevent context menu on long press (especially for iOS/Android)
		const handleContextMenu = (event: Event) => {
			event.preventDefault();
		};

		const handleResize = () => {
			setupCanvas();
		};

		const spawnRandomLevel6Egg = () => {
			const margin = 48;
			const randomX = margin + Math.random() * Math.max(1, cssWidth - margin * 2);
			const randomY = margin + Math.random() * Math.max(1, cssHeight - margin * 2);
			spawnEggAt(randomX, randomY, 6);
		};

		debugSpawnLevel6Ref.current = spawnRandomLevel6Egg;

		const debugSecretCode = 'egg6';
		let debugInputBuffer = '';

		const handleDebugSpawnShortcut = (event: KeyboardEvent) => {
			if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
			const key = event.key.toLowerCase();
			if (key.length !== 1) return;

			debugInputBuffer = `${debugInputBuffer}${key}`.slice(-debugSecretCode.length);
			if (debugInputBuffer !== debugSecretCode) return;

			debugInputBuffer = '';
			spawnRandomLevel6Egg();
		};

		const resizeObserver = new ResizeObserver(() => {
			setupCanvas();
		});
		resizeObserver.observe(main);

		canvas.addEventListener('pointerdown', handlePointerDown);
		canvas.addEventListener('pointermove', handlePointerMove);
		canvas.addEventListener('pointerup', handlePointerUpOrCancel);
		canvas.addEventListener('pointercancel', handlePointerUpOrCancel);
		canvas.addEventListener('contextmenu', handleContextMenu);
		window.addEventListener('resize', handleResize);
		if (isDebugMode) {
			window.addEventListener('keydown', handleDebugSpawnShortcut);
		}

		return () => {
			debugSpawnLevel6Ref.current = null;
			stopRapidFire();
			canvas.removeEventListener('pointerdown', handlePointerDown);
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerup', handlePointerUpOrCancel);
			canvas.removeEventListener('pointercancel', handlePointerUpOrCancel);
			canvas.removeEventListener('contextmenu', handleContextMenu);
			window.removeEventListener('resize', handleResize);
			if (isDebugMode) {
				window.removeEventListener('keydown', handleDebugSpawnShortcut);
			}
			resizeObserver.disconnect();
			loop.stop();
			physicsWorld.destroy();
		};
	}, [isDebugMode]);

	return (
		<div class="game-page">
			<a href={withBasePath('/menu')} class="menu-button">
				<span>☰</span>
			</a>
			<a href={withBasePath('/collection-book')} class="collection-book-button">
				<span>📘</span>
			</a>
			<main ref={mainRef} class="game-main">
				<canvas ref={canvasRef} class="game-canvas" />
				{isDebugMode && (
					<button
						type="button"
						class="debug-level6-hotspot"
						aria-label="Debug spawn level 6 egg"
						onClick={() => debugSpawnLevel6Ref.current?.()}
					/>
				)}
			</main>

			{revealedCard && revealedEggColor && revealOrigin && (
				<CardReveal
					card={revealedCard}
					eggColor={revealedEggColor}
					origin={revealOrigin}
					onComplete={handleCardRevealComplete}
				/>
			)}

			{/* Tilt Permission Modal */}
			{showTiltModal && (
				<div class="tilt-modal-overlay" onClick={() => setShowTiltModal(false)}>
					<div class="tilt-modal" onClick={(e) => e.stopPropagation()}>
						<div class="tilt-modal-content">
							<h2>📱 Enable Tilt Control</h2>
							<p>Control gravity by tilting your device!</p>
							<div class="tilt-modal-buttons">
								<button class="tilt-modal-btn primary" onClick={handleEnableTilt}>
									Enable
								</button>
								<button class="tilt-modal-btn secondary" onClick={() => setShowTiltModal(false)}>
									Later
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
