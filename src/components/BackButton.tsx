import './BackButton.css';

interface BackButtonProps {
	href?: string;
	onClick?: () => void;
}

export function BackButton({ href = '/', onClick }: BackButtonProps) {
	const content = (
		<>
			<span class="back-arrow">←</span>
			<span class="back-text">Back</span>
		</>
	);

	if (onClick) {
		return (
			<button class="back-button" onClick={onClick}>
				{content}
			</button>
		);
	}

	return (
		<a href={href} class="back-button">
			{content}
		</a>
	);
}
