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
  const [stage, setStage] = useState<'exploding' | 'card'>('exploding');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [particleFrames, setParticleFrames] = useState<BurstParticleFrame[]>([]);

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
    setIsCardFlipped(false);
    closeTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, cfg.dismissFlipOutMs);
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
      <button
        type="button"
        class="card-reveal-close"
        onClick={(event) => {
          event.stopPropagation();
          startClose();
        }}
        aria-label="Close reveal"
      >
        x
      </button>

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
        class={`card-stage ${stage} ${isClosing ? 'closing' : ''}`}
        style={{ '--entry-duration': `${cfg.cardEntryDurationMs}ms` }}
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
    </div>
  );
}
