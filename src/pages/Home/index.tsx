import { Layout } from '../../design-system';
import { Navigation } from '../../components/Navigation';
import { withBasePath } from '../../utils/routes';
import './style.css';

/**
 * Main Menu / Home Page
 *
 * Entry point for the Egg Merge Game
 */
export function Home() {
	return (
		<div class="home-page">
			<a href={withBasePath('/')} class="close-button">
				<span>✕</span>
			</a>
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
