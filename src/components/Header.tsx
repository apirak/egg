import { useLocation } from 'preact-iso';
import { BackButton } from './BackButton';
import './Header.css';

export function Header() {
	const { url } = useLocation();

	// Only show header on sub-pages with back button
	const isSubPage = url !== '/';

	if (!isSubPage) {
		return null; // Home page has its own header
	}

	const getPageTitle = (path: string): string => {
		switch (path) {
			case '/egg-shape':
				return 'Egg Shape Geometry';
			case '/collection':
				return 'Egg Collection';
			case '/game':
				return 'Play Game';
			default:
				return 'Egg Merge';
		}
	};

	return (
		<header class="sub-header">
			<div class="header-content">
				<BackButton />
				<h1 class="page-title">{getPageTitle(url)}</h1>
			</div>
		</header>
	);
}
