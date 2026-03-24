import { BackButton } from '../../components/BackButton';
import './style.css';

/**
 * Game Page - Placeholder for Step 4
 */
export function Game() {
	return (
		<div class="game-page">
			<div class="game-placeholder">
				<div class="placeholder-icon">🎮</div>
				<h1>Coming Soon!</h1>
				<p>Game physics and merge logic will be implemented in Steps 4-5.</p>
				<div class="step-info">
					<div class="step-badge">Step 4: Physics Basics</div>
					<div class="step-badge">Step 5: Merge Logic</div>
				</div>
				<BackButton />
			</div>
		</div>
	);
}
