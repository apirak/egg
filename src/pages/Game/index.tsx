import { useEffect, useRef } from 'preact/hooks';
import { Body, Collision } from 'matter-js';
import { EggFactory } from '../../game/entities';
import { GameLoop, PhysicsWorld } from '../../game/core';
import { GAME_CONFIG } from '../../game/config';
import { MergeSystem } from '../../game/systems';
import type { EggColor, EggLevel } from '../../types/egg';
import './style.css';

/**
 * Game Page - Placeholder for Step 4
 */
export function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mainRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const main = mainRef.current;
		if (!canvas || !main) return;

		let cssWidth = GAME_CONFIG.width;
		let cssHeight = GAME_CONFIG.height;

		const physicsWorld = new PhysicsWorld(cssWidth, cssHeight);
		const eggFactory = new EggFactory();
		const mergeSystem = new MergeSystem();
		const ascendedCount: Record<EggColor, number> = {
			red: 0,
			blue: 0,
			green: 0,
		};

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
		physicsWorld.start();

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

			ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
			ctx.font = '14px system-ui, sans-serif';
			ctx.fillText(
				`Ascended  R:${ascendedCount.red}  B:${ascendedCount.blue}  G:${ascendedCount.green}`,
				16,
				24,
			);
		};

		const tryMergeOnePair = (): boolean => {
			const pair = mergeSystem.findMergePair(physicsWorld.getEggs());
			if (!pair) return false;

			const [a, b] = pair;
			mergeSystem.markMerged([a.id, b.id]);

			const mergeX = (a.body.position.x + b.body.position.x) / 2;
			const mergeY = (a.body.position.y + b.body.position.y) / 2;

			physicsWorld.removeEggs([a, b]);

			if (a.level === 5) {
				ascendedCount[a.color] += 1;
				return true;
			}

			const nextLevel = (a.level + 1) as EggLevel;
			const mergedEgg = eggFactory.createEgg(mergeX, mergeY, nextLevel, a.color);
			Body.setVelocity(mergedEgg.body, {
				x: (a.body.velocity.x + b.body.velocity.x) / 2,
				y: (a.body.velocity.y + b.body.velocity.y) / 2,
			});
			Body.setAngularVelocity(mergedEgg.body, (a.body.angularVelocity + b.body.angularVelocity) / 2);
			physicsWorld.addEgg(mergedEgg);

			return true;
		};

		const loop = new GameLoop((deltaMs) => {
			physicsWorld.step(deltaMs);
			for (let i = 0; i < 2; i++) {
				if (!tryMergeOnePair()) break;
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

		const spawnEggAt = (x: number, y: number) => {
			const egg = eggFactory.createEgg(x, y, 1);

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

		const handlePointerDown = (event: PointerEvent) => {
			activePointerId = event.pointerId;
			canvas.setPointerCapture(event.pointerId);
			updatePointerPosition(event);
			spawnEggAt(pointerX, pointerY);

			stopRapidFire();
			rapidFireTimer = window.setInterval(() => {
				spawnEggAt(pointerX, pointerY);
			}, rapidFireIntervalMs);
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (activePointerId !== event.pointerId) return;
			updatePointerPosition(event);
		};

		const handlePointerUpOrCancel = (event: PointerEvent) => {
			if (activePointerId !== event.pointerId) return;
			activePointerId = null;
			stopRapidFire();
		};

		const handleResize = () => {
			setupCanvas();
		};

		const resizeObserver = new ResizeObserver(() => {
			setupCanvas();
		});
		resizeObserver.observe(main);

		canvas.addEventListener('pointerdown', handlePointerDown);
		canvas.addEventListener('pointermove', handlePointerMove);
		canvas.addEventListener('pointerup', handlePointerUpOrCancel);
		canvas.addEventListener('pointercancel', handlePointerUpOrCancel);
		window.addEventListener('resize', handleResize);

		return () => {
			stopRapidFire();
			canvas.removeEventListener('pointerdown', handlePointerDown);
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerup', handlePointerUpOrCancel);
			canvas.removeEventListener('pointercancel', handlePointerUpOrCancel);
			window.removeEventListener('resize', handleResize);
			resizeObserver.disconnect();
			loop.stop();
			physicsWorld.destroy();
		};
	}, []);

	return (
		<div class="game-page">
			<main ref={mainRef} class="game-main">
				<canvas ref={canvasRef} class="game-canvas" />
			</main>
		</div>
	);
}
