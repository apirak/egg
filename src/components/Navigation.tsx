import './Navigation.css';
import { withBasePath } from '../utils/routes';

export function Navigation() {
	const menuItems = [
		{ id: 'game', title: 'Play Game', description: 'Start the egg merge game', route: '/game', icon: '🎮' },
		{ id: 'collection', title: 'Egg Collection', description: 'View all egg types', route: '/collection', icon: '🥚' },
		{ id: 'egg-shape', title: 'Egg Geometry', description: 'Learn about egg shapes', route: '/egg-shape', icon: '📐' },
	];

	return (
		<nav class="main-nav">
			<div class="nav-container">
				{menuItems.map((item) => (
					<a key={item.id} href={withBasePath(item.route)} class="nav-link">
						<div class="nav-card">
							<div class="nav-icon">{item.icon}</div>
							<div class="nav-content">
								<div class="nav-title">{item.title}</div>
								<div class="nav-description">{item.description}</div>
							</div>
						</div>
					</a>
				))}
			</div>
		</nav>
	);
}
