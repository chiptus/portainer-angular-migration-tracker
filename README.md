# AngularJS Migration Tracker

A modern React + TypeScript + Tailwind CSS dashboard to track the progress of migrating from AngularJS to React in the Portainer codebase.

## Features

- **Modern React Dashboard**: Built with React 19, TypeScript, and Tailwind CSS
- **Real-time Analytics**: Counts AngularJS components, controllers, services, directives, and other legacy code
- **Dual Analysis Modes**: Supports both local filesystem and GitHub repository analysis
- **Beautiful Visualizations**: Interactive progress bars, charts, and statistics
- **Easy Deployment**: Configured for automatic deployment to GitHub Pages
- **Auto-refresh**: Dashboard automatically refreshes data every 5 minutes

## Quick Start

### Installation

```bash
npm install
```

### Analyze Your Codebase

To analyze the local Portainer codebase (default path: `../portainer-suite/package/server-ee/app`):

```bash
npm run analyze
# or
npm run analyze:local
```

To analyze a custom directory:

```bash
npm run analyze local /path/to/your/codebase
```

This will scan the specified directory and generate `results.json`.

### Analyze GitHub Repository

To analyze the Portainer repository directly from GitHub:

```bash
npm run analyze:github
```

This will fetch files from the `portainer/portainer` repository (develop branch) and analyze them.

**Note:** For authenticated GitHub requests (higher rate limits), set the `GITHUB_TOKEN` environment variable:

```bash
GITHUB_TOKEN=your_token_here npm run analyze:github
```

## Development

### Start Development Server

```bash
npm run dev
```

This will start the Vite development server with hot module replacement. Open [http://localhost:5173](http://localhost:5173) to view the dashboard.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Build with Fresh Analysis

To analyze the codebase and prepare results for building:

```bash
npm run build:results
```

This will:
1. Run the analyzer on the local codebase
2. Copy the results to the public folder

After running `build:results`, run `npm run build` to create the production bundle with the latest data.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deploying.

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy React migration tracker"
   git push origin main
   ```

3. **Automatic Deployment**: The GitHub Action will automatically build and deploy your site

4. **Access your dashboard** at: `https://[username].github.io/angular-migration-tracker/`

### Manual Deployment

You can also trigger deployment manually from the Actions tab in your GitHub repository.

## Dashboard Overview

The dashboard displays:

- **Stats Cards**: Quick overview of React files, AngularJS files, total files, and component counts
- **Migration Progress**: Visual progress bar showing percentage of files migrated to React
- **Component Type Breakdown**: Detailed breakdown of AngularJS component types (controllers, services, directives, etc.)
- **Top Directories**: List of directories with the most AngularJS files

## What It Tracks

The analyzer identifies and counts:

### File Types
- Controller files (`.controller.js`)
- Service files (`.service.js`)
- Directive files (`.directive.js`)
- React files (`.tsx`, `.jsx`, or files with React imports)

### AngularJS Registrations
- `angular.module().component()`
- `angular.module().directive()`
- `angular.module().controller()`
- `angular.module().service()`
- `angular.module().factory()`
- `angular.module().filter()`

### AngularJS Patterns
- Files with `import angular from 'angular'`
- `/* @ngInject */` annotations

## Project Structure

```
angular-migration-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── vite.svg               # Favicon
├── src/
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── StatsCards.tsx
│   │   ├── MigrationProgress.tsx
│   │   ├── ComponentBreakdown.tsx
│   │   ├── DirectoryList.tsx
│   │   ├── RefreshButton.tsx
│   │   ├── LoadingState.tsx
│   │   └── ErrorState.tsx
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Tailwind CSS imports
│   └── types.ts              # TypeScript type definitions
├── analyze.ts                # Codebase analysis script
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## Configuration

### Customize Repository Analysis

To analyze a different repository or branch, edit the constants in [analyze.ts](analyze.ts):

```typescript
const GITHUB_OWNER = 'portainer';
const GITHUB_REPO = 'portainer';
const GITHUB_BRANCH = 'develop';
const APP_PATH_IN_REPO = 'app';
```

### Customize Base URL

If deploying to a different path, update the `base` in [vite.config.ts](vite.config.ts):

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## Technology Stack

- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS with the latest version
- **Vite 7**: Fast build tool with HMR
- **GitHub Actions**: Automated CI/CD pipeline
- **Octokit**: GitHub API integration for remote analysis

## Adding New Metrics

To add new patterns or metrics:

1. Add the pattern to `ANGULARJS_PATTERNS` in [analyze.ts](analyze.ts:37-49)
2. Add a counter to the `Summary` interface in [types.ts](src/types.ts:17-31)
3. Add the matching logic in `analyzeFileContent()` in [analyze.ts](analyze.ts:120-248)
4. Update the dashboard components to display the new metric

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Part of the Portainer project.
