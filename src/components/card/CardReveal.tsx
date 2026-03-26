import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Card3D } from './Card3D';
import { Card, type EggColor } from '../../lib/cardData';
import { GAME_CONFIG } from '../../game/config';
import './CardReveal.css';

interface CardRevealProps {
  card: Card;
  onComplete: () => void;
  eggColor: EggColor;
  origin: { x: number; y: number };
}

interface FlyAnimation {
  isFlying: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  progress: number;
}

interface BurstParticle {
  key: string;
  emoji: string;
  vx: number;
  vy: number;
  delayMs: number;
  lifeMs: number;
  sizePx: number;
  spin: number;
}

interface BurstParticleFrame {
  key: string;
  emoji: string;
  x: number;
  y: number;
  opacity: number;
  rotation: number;
  sizePx: number;
}

export function CardReveal({ card, onComplete, eggColor, origin }: CardRevealProps) {
  const cfg = GAME_CONFIG.cardReveal;
  const closeTimerRef = useRef<number | null>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<'exploding' | 'card'>('exploding');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [particleFrames, setParticleFrames] = useState<BurstParticleFrame[]>([]);
  const [flyAnimation, setFlyAnimation] = useState<FlyAnimation>({
    isFlying: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    currentX: 0,
    currentY: 0,
    progress: 0,
  });

  const burstParticles = useMemo<BurstParticle[]>(() => {
    const accents = ['⭐', '✨'];
    const baseLife = cfg.burstDurationMs;
    const speedMin = cfg.burstDistanceMin / Math.max(baseLife / 1000, 0.01);
    const speedMax = cfg.burstDistanceMax / Math.max(baseLife / 1000, 0.01);

    return Array.from({ length: cfg.burstEmojiCount }, (_, i) => {
      const angle = (Math.PI * 2 * i) / cfg.burstEmojiCount + (Math.random() - 0.5) * 0.45;
      const speed = speedMin + Math.random() * Math.max(1, speedMax - speedMin);
      const delayMs = Math.random() * 120;
      const emoji = accents[i % accents.length];

      return {
        key: `${emoji}-${i}`,
        emoji,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 90,
        delayMs,
        lifeMs: baseLife + Math.random() * 180,
        sizePx: 14 + Math.random() * 7,
        spin: (Math.random() - 0.5) * 220,
      };
    });
  }, [cfg.burstDistanceMax, cfg.burstDistanceMin, cfg.burstDurationMs, cfg.burstEmojiCount]);

  const startClose = useCallback(() => {
    if (isClosing || stage !== 'card') return;
    setIsClosing(true);
    setIsCardFlipped(true); // Flip card when starting to fly

    // Get collection book button position
    const bookButton = document.querySelector('.collection-book-button') as HTMLElement;
    if (!bookButton || !cardStageRef.current) {
      // Fallback if button not found
      closeTimerRef.current = window.setTimeout(() => {
        onComplete();
      }, cfg.dismissFlipOutMs);
      return;
    }

    const bookRect = bookButton.getBoundingClientRect();
    const cardRect = cardStageRef.current.getBoundingClientRect();

    // Calculate the delta from current position to target
    const targetCenterX = bookRect.left + bookRect.width / 2;
    const targetCenterY = bookRect.top + bookRect.height / 2;
    const currentCenterX = cardRect.left + cardRect.width / 2;
    const currentCenterY = cardRect.top + cardRect.height / 2;

    const deltaX = targetCenterX - currentCenterX;
    const deltaY = targetCenterY - currentCenterY;

    // Calculate control point for quadratic bezier curve (curved upward)
    const controlX = currentCenterX + deltaX * 0.5;
    const controlY = Math.min(currentCenterY, targetCenterY) - 100; // Curve up 100px

    setFlyAnimation({
      isFlying: true,
      startX: 0,
      startY: 0,
      endX: deltaX,
      endY: deltaY,
      currentX: 0,
      currentY: 0,
      progress: 0,
    });

    // Animate card flying to book with curved path
    const flyDuration = 1000; // Slower for better curve visibility
    const startTime = performance.now();

    const animateFly = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / flyDuration);
      // Ease-out cubic - fast start, slow end
      const t = 1 - Math.pow(1 - progress, 3);

      // Quadratic bezier curve: B(t) = (1-t)²*P0 + 2(1-t)t*P1 + t²*P2
      // P0 = (0, 0), P1 = (controlX - startX, controlY - startY), P2 = (deltaX, deltaY)
      const mt = 1 - t;
      const curveX = mt * mt * 0 + 2 * mt * t * (controlX - currentCenterX) + t * t * deltaX;
      const curveY = mt * mt * 0 + 2 * mt * t * (controlY - currentCenterY) + t * t * deltaY;

      setFlyAnimation((prev) => ({
        ...prev,
        currentX: curveX,
        currentY: curveY,
        progress: t,
      }));

      if (progress < 1) {
        requestAnimationFrame(animateFly);
      } else {
        // Animation complete, scale down and finish
        closeTimerRef.current = window.setTimeout(() => {
          onComplete();
        }, 150);
      }
    };

    requestAnimationFrame(animateFly);
  }, [cfg.dismissFlipOutMs, isClosing, onComplete, stage]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setStage('card'), cfg.explosionDurationMs);
    return () => window.clearTimeout(enterTimer);
  }, [cfg.explosionDurationMs]);

  useEffect(() => {
    const gravity = 720;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;

      const nextFrames: BurstParticleFrame[] = burstParticles.map((p) => {
        const localElapsed = elapsed - p.delayMs;
        if (localElapsed <= 0) {
          return {
            key: p.key,
            emoji: p.emoji,
            x: 0,
            y: 0,
            opacity: 0,
            rotation: 0,
            sizePx: p.sizePx,
          };
        }

        const t = localElapsed / 1000;
        const x = p.vx * t;
        const y = p.vy * t + 0.5 * gravity * t * t;
        const progress = Math.min(1, localElapsed / p.lifeMs);

        return {
          key: p.key,
          emoji: p.emoji,
          x,
          y,
          opacity: Math.max(0, 1 - progress),
          rotation: p.spin * t,
          sizePx: p.sizePx,
        };
      });

      setParticleFrames(nextFrames);

      if (elapsed < cfg.burstDurationMs + 280) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [burstParticles, cfg.burstDurationMs]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        startClose();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [startClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      class={`card-reveal-container ${stage} ${isClosing ? 'closing' : ''}`}
      onClick={startClose}
      aria-label="Card reveal"
    >
      <div class={`egg-pop ${eggColor} ${stage}`}>
        <div
          class="egg-pop-core"
          style={{
            '--explode-scale': String(cfg.explosionScale),
            left: `${origin.x}px`,
            top: `${origin.y}px`,
          }}
        >
          <span class="egg-pop-emoji">{card.emoji}</span>
        </div>
      </div>

      <div class="emoji-burst" aria-hidden="true">
        {particleFrames.map((particle) => (
          <div
            key={particle.key}
            class="burst-particle"
            style={{
              left: `${origin.x}px`,
              top: `${origin.y}px`,
              transform: `translate(-50%, -50%) translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
              opacity: particle.opacity,
              fontSize: `${particle.sizePx}px`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      <div
        ref={cardStageRef}
        class={`card-stage ${stage} ${isClosing ? 'closing' : ''} ${flyAnimation.isFlying ? 'flying' : ''}`}
        style={{
          '--entry-duration': `${cfg.cardEntryDurationMs}ms`,
          '--fly-current-x': flyAnimation.isFlying ? `${flyAnimation.currentX}px` : '0',
          '--fly-current-y': flyAnimation.isFlying ? `${flyAnimation.currentY}px` : '0',
          '--fly-progress': flyAnimation.progress,
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Card3D
          card={card}
          size="lg"
          isFlipped={isCardFlipped}
          onFlip={() => setIsCardFlipped((prev) => !prev)}
        />
      </div>

      <button
        type="button"
        class="card-reveal-close"
        onClick={(event) => {
          event.stopPropagation();
          startClose();
        }}
        aria-label="Close reveal"
      >
        ✕
      </button>
    </div>
  );
}
