# Medical Data Viewer

A medical vital signs monitoring system built with vanilla JavaScript, TypeScript, and D3.js.

## Features

- **Grid View**: Table-based visualization with real-time data display
- **Dashboard View**: Interactive line charts showing trends over time
- **Filtering**: Filter by category and alert status
- **Data Fetching**: Fetches and decodes medical data from API
- **Interactive**: Hover tooltips, color-coded alerts

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Build the TypeScript:

```bash
pnpm run build
```

3. Start the development server:

```bash
pnpm start
```

4. Open http://localhost:3000 in your browser

## Development

For development with auto-compilation and live server:

```bash
pnpm start
```

This runs both TypeScript watch mode and the local server in parallel.

For just TypeScript compilation:

```bash
pnpm run watch
```

## Project Structure

- `index.html` - Main HTML file with embedded styles
- `src/`
  - `index.ts` - Main application entry point
  - `actions/` - API data fetching logic
  - `visualization/` - D3.js visualizations (Grid & Dashboard)
  - `utils/` - Utility functions (filters, etc.)
  - `interfaces/` - TypeScript interfaces
- `dist/` - Compiled JavaScript (generated)
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Technologies

- TypeScript
- D3.js (Data visualization)
- Axios (HTTP requests)
- Vanilla JavaScript (No frameworks)
