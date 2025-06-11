# Theme System Documentation

## Overview

The theme system in CredExis Pro provides a comprehensive solution for managing colors, typography, spacing, and other design tokens. It supports both light and dark modes, with the ability to follow the system preference.

## Theme Configuration

The theme configuration is defined in `src/config/theme.ts` and includes:

### Colors

- Primary colors (blue)
- Secondary colors (purple)
- Gray scale
- Success colors (green)
- Warning colors (yellow)
- Error colors (red)

Each color has 11 shades (50-950) for flexibility in design.

### Typography

- Font families (sans-serif and monospace)
- Font sizes (xs to 6xl)
- Font weights (thin to black)
- Line heights (none to loose)

### Spacing

A comprehensive spacing scale from 0 to 96 units, with half-step increments for fine-tuning.

### Other Design Tokens

- Border radius
- Shadows
- Z-index
- Breakpoints
- Transitions

## Usage

### Theme Provider

Wrap your application with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@/providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultMode="system">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Using Theme Values

Access theme values using the `useTheme` hook:

```tsx
import { useTheme } from '@/providers/ThemeProvider';

function MyComponent() {
  const { theme, mode, setMode } = useTheme();

  return (
    <div style={{ color: theme.colors.primary[500] }}>
      Current theme: {mode}
    </div>
  );
}
```

### Theme Toggle

Use the `ThemeToggle` component to allow users to switch between themes:

```tsx
import ThemeToggle from '@/components/ThemeToggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

## Dark Mode

The theme system automatically handles dark mode by:

1. Adding appropriate classes to the root element
2. Following system preferences when set to "system" mode
3. Providing dark mode variants for components

### Dark Mode Classes

Use Tailwind's dark mode classes to style components:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
  Content
</div>
```

## Best Practices

### Color Usage

1. Use semantic color names (e.g., `primary`, `success`, `error`)
2. Maintain consistent color usage across components
3. Consider color contrast for accessibility
4. Use color scales for variations (e.g., `primary.500` for main color)

### Typography

1. Use the predefined font sizes and weights
2. Maintain consistent text hierarchy
3. Consider line height for readability
4. Use appropriate font families for different contexts

### Spacing

1. Use the spacing scale consistently
2. Maintain visual rhythm
3. Consider responsive spacing
4. Use appropriate spacing for different component types

### Component Theming

1. Create theme-aware components
2. Use CSS variables for dynamic theming
3. Consider dark mode in component design
4. Test components in both light and dark modes

## Customization

### Extending the Theme

To extend the theme, modify the `theme.ts` file:

```typescript
export const colors = {
  ...colors,
  custom: {
    50: '#...',
    // ... other shades
  },
};
```

### Adding New Design Tokens

Add new design tokens to the theme object:

```typescript
export const theme = {
  ...theme,
  newToken: {
    // ... token values
  },
};
```

## Testing

### Theme Switching

Test your application with:

1. Light mode
2. Dark mode
3. System preference
4. Theme switching
5. Component appearance in different themes

### Accessibility

Ensure:

1. Sufficient color contrast
2. Readable text in both themes
3. Proper focus indicators
4. Consistent visual hierarchy

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check if `ThemeProvider` is properly set up
2. **Dark mode not working**: Verify dark mode classes and CSS
3. **Inconsistent styling**: Ensure consistent use of theme values
4. **Performance issues**: Optimize theme switching and CSS

### Debugging

Use browser dev tools to:

1. Inspect applied classes
2. Check CSS variables
3. Verify theme values
4. Test responsive behavior 