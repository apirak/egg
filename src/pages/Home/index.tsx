import { Layout } from '../../design-system';
import { Navigation } from '../../components/Navigation';
import './style.css';

/**
 * Main Menu / Home Page
 *
 * Entry point for the Egg Merge Game
 */
export function Home() {
	return (
		<div class="home-page">
			<header class="home-header">
				<div class="header-content">
					<div>
						<h1>🥚 Egg Merge</h1>
						<p class="subtitle">Physics-Based Merge Game</p>
					</div>
				</div>
			</header>

			<main class="home-content">
				<div class="welcome-section">
					<div class="logo-section">
						<div class="logo-emoji">🥚</div>
						<h2>Welcome!</h2>
						<p>Drop eggs, merge same colors, and collect angels!</p>
					</div>
				</div>

				<Navigation />
			</main>
		</div>
	);
}
