# UI/UX Restructuring Plan

## Current Issues

### Layout Problems
1. **Inconsistent headers**: Home has own header, other pages use shared Header
2. **Unused screen space**: Content doesn't use full viewport height
3. **Separate backgrounds**: Each page has its own gradient (inconsistent)
4. **Gaps between elements**: Header and main content are disconnected

### Inconsistencies
1. **No shared spacing system**: Different padding/margins per page
2. **Different card styles**: Collection vs Menu cards look different
3. **No shared colors**: Each page defines its own colors
4. **No shared typography**: Different font sizes per component

### Structure Issues
1. **No layout wrapper**: Each page manages full layout
2. **No design tokens**: Colors, spacing, sizing not centralized
3. **No reusable components**: Many duplicated patterns

## Proposed Structure

```
src/
├── design-system/
│   ├── tokens.ts          # Design tokens (colors, spacing, etc.)
│   ├── Layout.tsx         # Shared layout wrapper
│   ├── Page.tsx           # Page wrapper component
│   ├── Card.tsx           # Shared card component
│   ├── Button.tsx         # Shared button component
│   └── index.ts
├── components/
│   ├── Header.tsx         # Simplified header
│   ├── Navigation.tsx     # Main navigation
│   ├── BackButton.tsx     # Back button
│   └── index.ts
└── pages/
    ├── Home/              # Main menu (uses Page wrapper)
    ├── EggShape/          # Egg shape demo (uses Page wrapper)
    ├── EggCollection/     # Collection (uses Page wrapper)
    └── Game/              # Game (uses Page wrapper, special layout)
```

## Design System Tokens

```typescript
// Colors
export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#e74c3c',
  success: '#2ecc71',
  warning: '#f39c12',

  egg: {
    red: '#e74c3c',
    blue: '#3498db',
    green: '#2ecc71',
  },

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
}

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
}

// Typography
export const typography = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
}

// Border Radius
export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}
```

## Page Layout Pattern

All pages follow this structure:

```tsx
<Layout variant="full-height">  <!-- or "default" -->
  <PageHeader
    title="Page Title"
    subtitle="Optional description"
    showBackButton={true}
  />
  <PageContent>
    {/* Page content here */}
  </PageContent>
</Layout>
```

### Layout Variants

**Default Layout** (Home, Collection, EggShape)
- Fixed header (optional)
- Scrollable content
- Centered max-width container

**Full-Height Layout** (Game)
- Header integrated into game area
- Content uses 100vh
- No scrolling on game canvas

## Implementation Steps

1. ✅ Create design-system/tokens.ts
2. ✅ Create Layout component
3. ✅ Create Page component
4. ✅ Create shared components (Card, Button)
5. ✅ Refactor Home page
6. ✅ Refactor EggShape page
7. ✅ Refactor EggCollection page
8. ✅ Update global styles
9. ✅ Test all pages for consistency
10. ✅ Run typecheck

## Benefits

✅ **Consistent spacing** across all pages
✅ **Full screen usage** - no wasted space
✅ **Shared components** reduce duplication
✅ **Design tokens** easy to update globally
✅ **Better mobile experience** with consistent touch targets
✅ **Faster development** with reusable components
