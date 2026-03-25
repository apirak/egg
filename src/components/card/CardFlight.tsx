import { useState, useEffect } from 'preact/hooks';
import { Card3D } from './Card3D';
import { Card } from '../../lib/cardData';
import './CardFlight.css';

interface CardFlightProps {
  card: Card;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  onComplete: () => void;
}

export function CardFlight({ card, startPos, endPos, onComplete }: CardFlightProps) {
  const [stage, setStage] = useState<'start' | 'flying' | 'arrived'>('start');
  const [position, setPosition] = useState(startPos);

  useEffect(() => {
    // Start flying animation
    const startTimer = setTimeout(() => {
      setStage('flying');
    }, 100);

    // Animate to end position
    const flyTimer = setTimeout(() => {
      setPosition(endPos);
    }, 150);

    // Arrival animation
    const arriveTimer = setTimeout(() => {
      setStage('arrived');
    }, 800);

    // Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(flyTimer);
      clearTimeout(arriveTimer);
      clearTimeout(completeTimer);
    };
  }, [startPos, endPos, onComplete]);

  return (
    <div class="card-flight-container">
      {/* Trail effect */}
      <div class={`flight-trail ${stage}`}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            class="trail-particle"
            style={{
              '--delay': `${i * 0.05}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Flying card */}
      <div
        class={`flying-card ${stage}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <Card3D card={card} size="md" />
      </div>

      {/* Glow effect */}
      <div class={`flight-glow ${stage}`}></div>

      {/* Arrival burst */}
      {stage === 'arrived' && (
        <div
          class="arrival-burst"
          style={{
            left: `${endPos.x}px`,
            top: `${endPos.y}px`,
          }}
        >
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              class="burst-particle"
              style={{
                '--angle': `${(i / 16) * 360}deg`,
                '--delay': `${Math.random() * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
