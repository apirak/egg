import { CollectionBook, CollectionBonusSlot } from '../../components/card/CollectionBook';
import { withBasePath } from '../../utils/routes';
import { getCollection, isSetComplete, type EggColor } from '../../lib/cardData';
import './style.css';

const SETS: EggColor[] = ['red', 'blue', 'green', 'yellow', 'gray'];

export function CollectionBookPage() {
	const collection = getCollection();

	return (
		<div class="collection-book-page">
			<header class="collection-book-page-header">
				<div class="collection-book-page-header-inner">
					<a href={withBasePath('/menu')} class="collection-book-close-button" aria-label="Close collection book">
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
			</main>

			<footer class="collection-book-page-bonus">
				{SETS.map((setColor) => (
					<CollectionBonusSlot key={setColor} setColor={setColor} isComplete={isSetComplete(setColor)} />
				))}
			</footer>
		</div>
	);
}