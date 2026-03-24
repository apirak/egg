import { useEffect, useRef } from 'preact/hooks';
import { Body, Collision } from 'matter-js';
import { EggFactory } from '../../game/entities';
import { GameLoop, PhysicsWorld } from '../../game/core';
import { GAME_CONFIG } from '../../game/config';
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
		};

		const loop = new GameLoop((deltaMs) => {
			physicsWorld.step(deltaMs);
			draw();
		});
		loop.start();

		const handlePointerDown = (event: PointerEvent) => {
			const canvasRect = canvas.getBoundingClientRect();
			const x = event.clientX - canvasRect.left;
			const y = event.clientY - canvasRect.top;
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

			physicsWorld.addEgg(egg);
		};

		const handleResize = () => {
			setupCanvas();
		};

		const resizeObserver = new ResizeObserver(() => {
			setupCanvas();
		});
		resizeObserver.observe(main);

		canvas.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('resize', handleResize);

		return () => {
			canvas.removeEventListener('pointerdown', handlePointerDown);
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
