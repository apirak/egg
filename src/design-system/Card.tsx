import { JSX } from 'preact';
import './Card.css';

export interface CardProps {
	children: JSX.Element | JSX.Element[];
	variant?: 'default' | 'elevated' | 'outlined';
	padding?: 'none' | 'sm' | 'md' | 'lg';
	onClick?: () => void;
	href?: (el: HTMLDivElement | null) => void;
	class?: string;
}

/**
 * Card component - Shared card container
 *
 * Consistent card styling across the app
 */
export function Card({ children, variant = 'default', padding = 'md', onClick, ref, class: className = '' }: CardProps) {
	const cardClass = `card card-${variant} card-padding-${padding} ${onClick ? 'card-clickable' : ''} ${className}`.trim();

	const cardContent = (
		<div class={cardClass} ref={ref} onClick={onClick}>
			{children}
		</div>
	);

	return cardContent;
}
