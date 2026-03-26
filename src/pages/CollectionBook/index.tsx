import { CollectionBook, CollectionBonusSlot } from '../../components/card/CollectionBook';
import { withBasePath } from '../../utils/routes';
import { getCollection, isSetComplete, resetCollection, type EggColor } from '../../lib/cardData';
import { useState } from 'preact/hooks';
import './style.css';

const SETS: EggColor[] = ['red', 'blue', 'green', 'yellow', 'gray'];

export function CollectionBookPage() {
	const [collection, setCollection] = useState(getCollection());

	const handleReset = () => {
		if (confirm('ต้องการลบการ์ดทั้งหมดใช่หรือไม่?')) {
			resetCollection();
			setCollection(getCollection());
		}
	};

	return (
		<div class="collection-book-page">
			<header class="collection-book-page-header">
				<div class="collection-book-page-header-inner">
					<a href={withBasePath('/')} class="collection-book-close-button" aria-label="Close collection book">
						<span>✕</span>
					</a>
					<div class="collection-book-page-title-wrap">
						<p class="collection-book-page-kicker">Collection Archive</p>
						<h1>สมุดสะสมการ์ด</h1>
						<p class="collection-book-page-subtitle">
							เปิดดูการ์ดที่สะสมได้ทุกชุดในหน้าต่อเนื่องหน้าเดียว
						</p>
					</div>
				</div>
			</header>

			<main class="collection-book-page-main">
				{SETS.map((setColor) => (
					<CollectionBook key={setColor} setColor={setColor} collection={collection} />
				))}

				<section
					class="collection-book collection-book-bonus"
					style={{
						'--book-accent': '#fbbf24',
						'--book-glow': 'rgba(251, 191, 36, 0.18)',
						'--book-badge': 'rgba(251, 191, 36, 0.16)',
					}}
				>
					<header class="collection-book-header">
						<div>
							<p class="collection-book-overline">Bonus Slots</p>
							<h2>
								<span class="collection-book-set-emoji">✨</span>
								Bonus Set
							</h2>
						</div>
						<button class="collection-reset-button" onClick={handleReset} aria-label="Reset collection">
							<span>Reset</span>
						</button>
					</header>

					<div class="collection-book-grid" role="list" aria-label="Bonus card collection">
						{SETS.map((setColor) => (
							<CollectionBonusSlot key={setColor} setColor={setColor} isComplete={isSetComplete(setColor)} />
						))}
					</div>
				</section>
			</main>
		</div>
	);
}