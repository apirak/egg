import { useState } from 'preact/hooks';
import { Card3D } from '../../components/card/Card3D';
import { ALL_CARDS } from '../../lib/cardData';
import { BackButton } from '../../components/BackButton';
import './style.css';

/**
 * Card Design Page
 *
 * Preview and test all 40 cards with 3D flip animation
 */
export function CardDesign() {
	const [selectedCard, setSelectedCard] = useState(ALL_CARDS[0]);
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<div class="card-design-page">
			<header class="card-design-header">
				<div class="header-content">
					<BackButton />
					<div>
						<h1>🎴 Card Design Preview</h1>
						<p class="subtitle">All 40 cards - Click to flip!</p>
					</div>
				</div>
			</header>

			<main class="card-design-main">
				{/* All Cards Grid - Left Side */}
				<section class="all-cards-section">
					<h2>All Cards</h2>
					<div class="cards-grid">
						{ALL_CARDS.map(card => (
							<div
								key={card.id}
								class={`grid-card-item ${card.id === selectedCard.id ? 'active' : ''}`}
								onClick={() => {
									setSelectedCard(card);
									setIsFlipped(false);
								}}
							>
								<span class="card-emoji">{card.emoji}</span>
								<span class="card-id">{card.id}</span>
							</div>
						))}
					</div>
				</section>

				{/* Card Preview - Right Side */}
				<section class="card-preview-section">
					<div class="preview-container">
						<Card3D card={selectedCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} size="lg" />
					</div>
				</section>
			</main>
		</div>
	);
}
