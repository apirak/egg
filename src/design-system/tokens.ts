/**
 * Design System Tokens
 *
 * Centralized design tokens for consistent UI across the app
 */

/**
 * Color tokens
 */
export const colors = {
	// Brand colors
	primary: '#667eea',
	secondary: '#764ba2',
	accent: '#e74c3c',

	// Egg colors
	egg: {
		red: '#e74c3c',
		redLight: '#ff6b6b',
		redDark: '#c0392b',
		blue: '#3498db',
		blueLight: '#74b9ff',
		blueDark: '#2980b9',
		green: '#2ecc71',
		greenLight: '#55efc4',
		greenDark: '#27ae60',
	},

	// Neutral colors
	neutral: {
		50: '#f8f9fa',
		100: '#f1f3f5',
		200: '#e9ecef',
		300: '#dee2e6',
		400: '#ced4da',
		500: '#adb5bd',
		600: '#6c757d',
		700: '#495057',
		800: '#343a40',
		900: '#212529',
	},

	// Semantic colors
	success: '#2ecc71',
	warning: '#f39c12',
	error: '#e74c3c',
	info: '#3498db',
} as const;

/**
 * Spacing tokens (in pixels)
 */
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
} as const;

/**
 * Typography tokens
 */
export const typography = {
	xs: '0.75rem',     // 12px
	sm: '0.875rem',    // 14px
	base: '1rem',      // 16px
	lg: '1.125rem',    // 18px
	xl: '1.25rem',     // 20px
	'2xl': '1.5rem',   // 24px
	'3xl': '1.875rem', // 30px
	'4xl': '2.25rem',  // 36px
} as const;

/**
 * Border radius tokens
 */
export const radius = {
	sm: '4px',
	md: '8px',
	lg: '12px',
	xl: '16px',
	'2xl': '20px',
	full: '9999px',
} as const;

/**
 * Shadow tokens
 */
export const shadows = {
	sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
	md: '0 4px 8px rgba(0, 0, 0, 0.1)',
	lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
	xl: '0 16px 32px rgba(0, 0, 0, 0.15)',
	'2xl': '0 24px 48px rgba(0, 0, 0, 0.2)',
} as const;

/**
 * Z-index tokens
 */
export const zIndex = {
	dropdown: 1000,
	sticky: 1020,
	fixed: 1030,
	modal: 1040,
	popover: 1050,
	tooltip: 1060,
} as const;

/**
 * Breakpoint tokens
 */
export const breakpoints = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
} as const;
