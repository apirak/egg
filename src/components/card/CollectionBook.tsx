import { Card3D } from './Card3D';
import { getCardsByColor, type Card, type CardCollection, type EggColor } from '../../lib/cardData';
import { EGG_COLOR_INFO } from '../../game/config/EggConfig';
import './CollectionBook.css';

function emojiToCodepoint(emoji: string): string {
	const codePoints = Array.from(emoji)
		.map((char) => char.codePointAt(0)?.toString(16) ?? '')
		.filter((code): code is string => Boolean(code));

	const hasZWJ = codePoints.includes('200d');

	if (hasZWJ) {
		return codePoints.join('-');
	}

	return codePoints.filter((code) => code !== 'fe0f').join('-');
}

function getTwemojiSvgUrl(emoji: string): string {
	const codepoint = emojiToCodepoint(emoji);
	return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`;
}

interface CollectionBookProps {
	setColor: EggColor;
	collection: CardCollection;
	onCardClick?: (card: Card) => void;
}

const BOOK_ACCENTS: Record<EggColor, { edge: string; glow: string; badge: string }> = {
	red: {
		edge: '#f87583',
		glow: 'rgba(248, 117, 131, 0.18)',
		badge: 'rgba(248, 117, 131, 0.16)',
	},
	blue: {
		edge: '#03aad6',
		glow: 'rgba(3, 170, 214, 0.18)',
		badge: 'rgba(3, 170, 214, 0.16)',
	},
	green: {
		edge: '#95bb10',
		glow: 'rgba(149, 187, 16, 0.18)',
		badge: 'rgba(149, 187, 16, 0.16)',
	},
	yellow: {
		edge: '#fee759',
		glow: 'rgba(254, 231, 89, 0.22)',
		badge: 'rgba(254, 231, 89, 0.2)',
	},
	gray: {
		edge: '#9e9e92',
		glow: 'rgba(158, 158, 146, 0.18)',
		badge: 'rgba(158, 158, 146, 0.16)',
	},
};

export function CollectionBook({ setColor, collection, onCardClick }: CollectionBookProps) {
	const cards = getCardsByColor(setColor);
	const counts = collection[setColor] ?? {};
	const accent = BOOK_ACCENTS[setColor];
	const setInfo = EGG_COLOR_INFO[setColor];

	return (
		<section
			class="collection-book"
			style={{
				'--book-accent': accent.edge,
				'--book-glow': accent.glow,
				'--book-badge': accent.badge,
			}}
		>
			<header class="collection-book-header">
				<div>
					<p class="collection-book-overline">Egg Set Archive</p>
					<h2>
						<span class="collection-book-set-emoji">{setInfo.emoji}</span>
						{setInfo.name} Set
					</h2>
				</div>
			</header>

			<div class="collection-book-grid" role="list" aria-label={`${setInfo.name} card collection`}>
				{cards.map((card) => {
					const count = counts[card.emoji] ?? 0;
					const isCollected = count > 0;
					const embossStyle = {
						'--emboss-icon': `url("${getTwemojiSvgUrl(card.emoji)}")`,
					} as Record<string, string>;

					if (isCollected) {
						return (
							<button
								key={card.id}
								type="button"
								class="collection-slot collection-slot-filled"
								onClick={() => onCardClick?.(card)}
							>
								<div class="collection-slot-card-shell">
									<Card3D card={card} size="lg" />
								</div>
							</button>
						);
					}

					return (
						<div key={card.id} class="collection-slot collection-slot-empty" role="listitem" aria-label={`Empty slot for ${card.nameTH}`}>
							<div class="collection-slot-emboss" style={embossStyle} aria-hidden="true" />
							<div class="collection-slot-meta">
								<span class="collection-slot-id">{card.id}</span>
								<span class="collection-slot-name">{card.nameTH}</span>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}

interface CollectionBonusSlotProps {
	setColor: EggColor;
	isComplete: boolean;
	bonusCard?: Card;
	onCardClick?: (card: Card) => void;
}

export function CollectionBonusSlot({ setColor, isComplete, bonusCard, onCardClick }: CollectionBonusSlotProps) {
	const accent = BOOK_ACCENTS[setColor];
	const setInfo = EGG_COLOR_INFO[setColor];

	// If unlocked and has a bonus card, show the filled slot
	if (isComplete && bonusCard) {
		return (
			<button
				type="button"
				class="collection-slot collection-slot-filled collection-bonus-slot-unlocked"
				onClick={() => onCardClick?.(bonusCard)}
				style={{
					'--book-accent': accent.edge,
					'--book-glow': accent.glow,
				}}
			>
				<div class="collection-slot-card-shell">
					<Card3D card={bonusCard} size="lg" />
				</div>
			</button>
		);
	}

	// Locked state - show as empty slot with lock icon
	const lockEmojiUrl = getTwemojiSvgUrl('🔒');
	const embossStyle = {
		'--emboss-icon': `url("${lockEmojiUrl}")`,
	} as Record<string, string>;

	return (
		<div
			class="collection-slot collection-slot-empty collection-bonus-slot-locked"
			role="listitem"
			aria-label={`Locked bonus slot for ${setInfo.name} set`}
			style={{
				'--book-accent': accent.edge,
				'--book-glow': accent.glow,
			}}
		>
			<div class="collection-bonus-lock-icon" aria-hidden="true">🔒</div>
			<div class="collection-slot-emboss" style={embossStyle} aria-hidden="true" />
			<div class="collection-slot-meta">
				<span class="collection-slot-id">BONUS</span>
				<span class="collection-slot-name">{setInfo.name} Set</span>
			</div>
		</div>
	);
}