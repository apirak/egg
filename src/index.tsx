import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Home } from './pages/Home/index';
import { NotFound } from './pages/_404';
import { MathEggDemo } from './pages/EggShape/MathDemo';
import { EggCollection } from './pages/EggCollection/index';
import { Game } from './pages/Game/index';
import { Accelerometer } from './pages/Accelerometer/index';
import './style.css';

export function App() {
	const locationScope = typeof window !== 'undefined' ? import.meta.env.BASE_URL : undefined;

	return (
		<LocationProvider scope={locationScope}>
			<main>
				<Router>
					<Route path="/" component={Game} />
					<Route path="/menu" component={Home} />
					<Route path="/egg-shape" component={MathEggDemo} />
					<Route path="/collection" component={EggCollection} />
					<Route path="/accelerometer" component={Accelerometer} />
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
