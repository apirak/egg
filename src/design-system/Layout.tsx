import { JSX } from 'preact';
import './Layout.css';

export type LayoutVariant = 'default' | 'full-height' | 'centered';

export interface LayoutProps {
	variant?: LayoutVariant;
	children: JSX.Element | JSX.Element[];
	class?: string;
}

/**
 * Layout component - Main wrapper for all pages
 *
 * Provides consistent layout structure and background
 */
export function Layout({ variant = 'default', children, class: className = '' }: LayoutProps) {
	const layoutClass = `layout layout-${variant} ${className}`.trim();

	return (
		<div class={layoutClass}>
			{children}
		</div>
	);
}
