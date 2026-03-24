import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { MathEggDemo } from './pages/EggShape/MathDemo';
import { EggCollection } from './pages/EggCollection/index';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/egg-shape" component={MathEggDemo} />
					<Route path="/collection" component={EggCollection} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	const root = document.getElementById('app');
	if (root) {
		hydrate(<App />, root);
	}
}

export async function prerender(data: unknown) {
	return await ssr(<App {...(data as Record<string, unknown>)} />);
}
