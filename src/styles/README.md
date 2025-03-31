# YuyuPlanner CSS Architecture

This directory contains the CSS files for the YuyuPlanner application, structured in a modular and maintainable way.

## Directory Structure

```
styles/
├── index.css             # Main CSS entry point that imports all other CSS files
├── base/                 # Core styles used throughout the app
│   ├── variables.css     # CSS variables for colors, fonts, etc.
│   ├── reset.css         # Base element styles and reset
│   └── forms.css         # Form element styling
├── layout/               # Layout-related styles
│   ├── modules.css       # Shared module container and layout styles
│   └── headers.css       # Standardized header styling
├── components/           # Component-specific styles
│   ├── desktop-currency.css # Desktop currency display component
│   ├── desktop-avatar.css   # Desktop avatar card component
│   └── profile-bar.css      # Mobile profile bar component
└── modules/              # Module-specific styles
    └── skincare.css      # Skincare module styles
```

## Style Organization

### Base Styles

- **variables.css**: Contains all CSS variables used throughout the application, including colors, sizes, fonts, and theming
- **reset.css**: Sets default styles and resets for HTML elements, provides consistent baseline
- **forms.css**: Contains styles for form elements like inputs, buttons, dropdowns, etc.

### Layout Styles

- **modules.css**: Contains shared layout styles for module containers, headers, and cards

### Module Styles

- **skincare.css**: Contains styles specific to the skincare module

## CSS Variables

All styling is based on CSS variables defined in `variables.css`, which makes it easy to:

1. Maintain consistent colors, spacing, and typography
2. Support dark mode via class-based overrides
3. Create module-specific themes while maintaining visual consistency

## CSS Imports

CSS files are imported via `index.css` in the following order:

1. Base styles (in order: variables, reset, forms)
2. Layout styles
3. Module-specific styles

## Styling Guidelines

1. When adding new styles:
   - Place common/shared styles in the appropriate base directory
   - Place component-specific styles in `components/`
   - Place module-specific styles in `modules/`

2. Use existing CSS variables when possible
3. Add new CSS variables to `variables.css` when needed
4. Follow the existing naming conventions for classes
5. Use BEM methodology for naming classes when appropriate
6. Add adequate comments for complex or non-obvious styles

## Component Integration

Components should import styles in the following way:

```jsx
// For React components, import is handled by the main index.css
// Do NOT import specific CSS files directly
```

This approach ensures that all styles are loaded in the correct order and prevents duplication. 