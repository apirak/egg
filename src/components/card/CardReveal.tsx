import { useState, useEffect } from 'preact/hooks';
import { Card3D } from './Card3D';
import { Card } from '../../lib/cardData';
import './CardReveal.css';

interface CardRevealProps {
  card: Card;
  onComplete: () => void;
  eggColor: string;
}

export function CardReveal({ card, onComplete, eggColor }: CardRevealProps) {
  const [stage, setStage] = useState<'egg' | 'cracking' | 'breaking' | 'revealing' | 'card'>('egg');
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timers = [
      setTimeout(() => setStage('cracking'), 500),   // Egg starts cracking
      setTimeout(() => setStage('breaking'), 1200),  // Egg breaks apart
      setTimeout(() => {
        setStage('revealing');
        setShowCard(true);
      }, 1800),                                       // Card appears
      setTimeout(() => {
        setStage('card');
      }, 2200),                                       // Animation complete
      setTimeout(() => onComplete(), 3000),          // Trigger callback
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div class="card-reveal-container">
      <div class={`egg-sprite ${stage} ${eggColor}`}>
        {/* Egg graphics */}
        <div class="egg-body">
          <div class="egg-highlight"></div>
          <div class="egg-crack-lines">
            <div class="crack crack-1"></div>
            <div class="crack crack-2"></div>
            <div class="crack crack-3"></div>
          </div>
        </div>

        {/* Egg shell pieces (fly away when broken) */}
        <div class="shell-pieces">
          <div class="shell-piece shell-top-left"></div>
          <div class="shell-piece shell-top-right"></div>
          <div class="shell-piece shell-bottom-left"></div>
          <div class="shell-piece shell-bottom-right"></div>
        </div>

        {/* Glow effect */}
        <div class="reveal-glow"></div>
      </div>

      {/* Card reveal */}
      {showCard && (
        <div class={`card-reveal-card ${stage}`}>
          <Card3D card={card} size="lg" />
        </div>
      )}

      {/* Sparkle effects */}
      <div class="sparkles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            class="sparkle"
            style={{
              '--delay': `${Math.random() * 0.5}s`,
              '--x': `${Math.random() * 100 - 50}%`,
              '--y': `${Math.random() * 100 - 50}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
