# Wolf Digital Tailwind CSS Boilerplate

A modern Tailwind CSS v4 boilerplate for UI development, designed to be eventually ported into a WordPress theme.

## Features

- **Tailwind CSS v4** - Utility-first CSS framework with simplified import syntax
- **Vite** - Fast build tool with Hot Module Replacement (HMR)
- **Component-Based Architecture** - Organized CSS and JavaScript components
- **WordPress Ready** - Structured to be easily ported to a WordPress theme

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone https://github.com/your-username/wolfd-tailwindcss-boilerplate.git
cd wolfd-tailwindcss-boilerplate
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Start the development server
```bash
yarn dev
# or
npm run dev
```

4. Build for production
```bash
yarn prod
# or
npm run prod
```

## Project Structure

```
wolfd-tailwindcss-boilerplate/
├── dist/                  # Compiled assets (generated after build)
├── src/                   # Source files
│   ├── htmls/             # Htmls templates
│   ├── img/               # Image assets
│   ├── pages/             # Html pages
│   ├── js/                # JavaScript files
│   │   ├── app.js         # Main JavaScript entry point
│   │   └── components/    # Component-specific JavaScript
│   └── css/               # CSS files
│       ├── app.css        # Main CSS entry point
│       ├── base/          # Base styles (variables, typography)
│       ├── components/    # Component styles (buttons, sections)
├── index.html            # Example HTML template
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS v4 configuration
└── vite.config.js        # Vite configuration
```

## Development Workflow

### CSS

The main CSS file is located at `src/css/app.css`. It imports Tailwind CSS v4 using the simplified syntax:

```css
/* Import Tailwind CSS v4 */
@import "tailwindcss";

/* Import base styles and components */
@import "./base/variables.css";
@import "./base/typography.css";
@import "./components/btn.css";
@import "./components/section.css";
```

### JavaScript

The main JavaScript file is located at `src/js/app.js`. It imports component modules and initializes them:

```javascript
// Import CSS for Vite processing
import '../css/app.css';

// Import components
import MobileMenu from './components/MobileMenu';
import Accordion from './components/Accordion';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const components = {
    mobileMenu: new MobileMenu(),
    accordion: new Accordion()
  };
});
```

### WordPress Integration

When ready to port to WordPress:

1. Copy the compiled assets to your WordPress theme
2. Update the Vite configuration to watch PHP files
3. Configure the development server to proxy your WordPress installation