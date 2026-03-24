import { JSX } from 'preact';
import { BackButton } from '../components/BackButton';
import './Page.css';

export interface PageProps {
	title?: string;
	subtitle?: string;
	showBackButton?: boolean;
	actions?: JSX.Element | JSX.Element[];
	children: JSX.Element | JSX.Element[];
	class?: string;
}

/**
 * Page component - Wrapper for page content
 *
 * Provides consistent page structure with optional header
 */
export function Page({ title, subtitle, showBackButton = false, actions, children, class: className = '' }: PageProps) {
	const pageClass = `page ${className}`.trim();

	return (
		<div class={pageClass}>
			{(title || showBackButton) && (
				<header class="page-header">
					<div class="page-header-content">
						{showBackButton && <BackButton />}
						<div class="page-title-section">
							{title && <h1 class="page-title">{title}</h1>}
							{subtitle && <p class="page-subtitle">{subtitle}</p>}
						</div>
						{actions && <div class="page-actions">{actions}</div>}
					</div>
				</header>
			)}
			<div class="page-content">
				{children}
			</div>
		</div>
	);
}
