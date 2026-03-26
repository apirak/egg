import { useState } from 'preact/hooks';
import { Card, type Rarity } from '../../lib/cardData';
import './Card3D.css';

// Convert emoji to Twemoji codepoint (hex format)
function emojiToCodepoint(emoji: string): string {
  const codePoints = Array.from(emoji)
    .map(char => char.codePointAt(0)?.toString(16) ?? '')
    .filter((code): code is string => Boolean(code));

  // Check if this is a ZWJ sequence (contains 200d)
  const hasZWJ = codePoints.includes('200d');

  if (hasZWJ) {
    // ZWJ sequence - keep fe0f at the end
    return codePoints.join('-');
  } else {
    // Simple emoji - remove fe0f
    return codePoints.filter(code => code !== 'fe0f').join('-');
  }
}

// Get Twemoji SVG URL
function getTwemojiSvgUrl(emoji: string): string {
  const codepoint = emojiToCodepoint(emoji);
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`;
}

interface Card3DProps {
  card: Card;
  isFlipped?: boolean;
  onFlip?: () => void;
  showCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Card3D({ card, isFlipped = false, onFlip, showCount, size = 'md' }: Card3DProps) {
  const [localFlipped, setLocalFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const flipped = isFlipped || localFlipped;
  const toggleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setLocalFlipped(!localFlipped);
    }
  };

  // Calculate total power for back of card
  const totalPower = card.stats.mind + card.stats.body + card.stats.spirit;

  const sizeClass = size === 'sm' ? 'card-sm' : size === 'lg' ? 'card-lg' : 'card-md';
  const emojiClass = size === 'sm' ? 'card-emoji-sm' : size === 'lg' ? 'card-emoji-lg' : 'card-emoji-md';

  // Color-to-shadow mapping
  const shadowColorMap = {
    red: 'rgba(239, 68, 68, 0.25)',      // Light red
    blue: 'rgba(59, 130, 246, 0.25)',     // Light blue
    green: 'rgba(34, 197, 94, 0.25)',     // Light green
    yellow: 'rgba(234, 179, 8, 0.25)',    // Light yellow
    gray: 'rgba(107, 114, 128, 0.25)',    // Light gray
  };

  const shadowColor = shadowColorMap[card.color];
  const cardStyle = {
    '--shadow-color': shadowColor,
  } as Record<string, string>;

  return (
    <div
      class={`card-3d-container ${sizeClass}`}
      onClick={toggleFlip}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        class={`card-inner ${flipped ? 'flipped' : ''} ${isHovered && !flipped ? 'hovered' : ''}`}
      >
        {/* Front of Card */}
        <div class={`card-front ${card.rarity}`} style={cardStyle}>
          {/* Holographic gradient overlay */}
          <div class={`card-holographic ${isHovered ? 'shimmer' : ''}`} />

          {/* Top Bar - ID and Rarity */}
          <div class="card-top-bar">
            <span class={`card-rarity-badge ${card.rarity}`}>
              {card.rarity.toUpperCase()}
            </span>
            <span class="card-number">#{card.id}</span>
          </div>

          {/* Image Area with Emoji */}
          <div class="card-image-area">
            <div class="card-image-circle">
              <img
                class={`card-emoji ${emojiClass}`}
                src={getTwemojiSvgUrl(card.emoji)}
                alt={card.nameTH}
                loading="lazy"
              />
            </div>
          </div>

          {/* Name Area */}
          <div class="card-name-area">
            <h3 class="card-name-th">{card.nameTH}</h3>
            <p class="card-name-en">{card.nameEN}</p>
          </div>

          {/* Stats Area */}
          <div class="card-stats-area">
            <div class="stat-row">
              <div class="stat-item">
                <span class="stat-label">MIND</span>
                <span class="stat-value mind">{card.stats.mind}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">BODY</span>
                <span class="stat-value body">{card.stats.body}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">SPIRIT</span>
                <span class="stat-value spirit">{card.stats.spirit}</span>
              </div>
            </div>
          </div>

          {/* Count Badge */}
          {showCount !== undefined && showCount > 1 && (
            <div class="card-count-badge">
              x{showCount}
            </div>
          )}
        </div>

        {/* Back of Card (Lore) */}
        <div class="card-back">
          {/* Card ID at top */}
          <div class="back-card-id">
            <span>#{card.id}</span>
          </div>

          {/* Lore Content - Centered */}
          <div class="card-lore-content">
            {card.lore.map((line: string, idx: number) => (
              <p key={idx} class="card-lore-text">
                {line}
              </p>
            ))}
          </div>

          <div class="card-ability">
            <p class="ability-label">พลังพิเศษ</p>
            <p class="ability-text">{card.ability}</p>
          </div>

          {/* Power at bottom edge */}
          <div class="card-power-footer">
            <span class="power-label">TOTAL POWER</span>
            <span class="power-value">{totalPower}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility component for card grid
export function CardGrid({ cards, onCardClick }: { cards: Card[]; onCardClick?: (card: Card) => void }) {
  return (
    <div class="cards-grid-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
      {cards.map(card => (
        <div key={card.id} onClick={() => onCardClick?.(card)}>
          <Card3D card={card} />
        </div>
      ))}
    </div>
  );
}
