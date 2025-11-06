# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AngularJS to React Migration Tracker** - a two-tier system that analyzes codebases for AngularJS patterns and visualizes migration progress through a React dashboard.

**Architecture Pattern**: Analysis → JSON Contract → Visualization

```
analyze.ts (Node.js script)  →  results.json  →  React Dashboard (Vite)
```

The key architectural decision is that `results.json` acts as the data contract between the analysis layer and the visualization layer, allowing complete decoupling of concerns.

## Commands

### Development
```bash
pnpm install              # Install dependencies (uses pnpm, configured in package.json)
npm run dev               # Start Vite dev server at http://localhost:5173
npm run preview           # Preview production build locally
```

### Analysis
```bash
npm run analyze:local                    # Analyze default path: ../portainer-suite/package/server-ee/app
npm run analyze local /custom/path       # Analyze custom directory
npm run analyze:github                   # Analyze portainer/portainer repo via GitHub API
GITHUB_TOKEN=xxx npm run analyze:github # With GitHub token for higher rate limits
```

### Building
```bash
npm run build             # TypeScript compilation + Vite production build → dist/
npm run build:results     # Run analysis + copy results.json to public/ (then run build separately)
```

### Deployment
Push to `main` branch triggers automated GitHub Actions deployment to GitHub Pages.

## Core Architecture

### Data Flow
1. **Analysis Phase**: `analyze.ts` scans a codebase (local filesystem or GitHub API) using regex patterns to identify AngularJS components vs React components
2. **Data Contract**: Outputs `results.json` with structured metrics (file counts, pattern matches, directory breakdown)
3. **Visualization Phase**: React app fetches `results.json` and renders interactive dashboard with progress bars, charts, and statistics

### Key Files

**analyze.ts** (436 lines)
- Pattern detection using regex (e.g., `angular.module().component()`, `*.controller.js`)
- Two modes: Local filesystem walker OR GitHub API (Octokit)
- Outputs aggregated metrics to `results.json`
- Configurable via CLI args: `tsx analyze.ts [local|github] [optional-path]`

**src/types.ts**
- Shared TypeScript interfaces between analyze.ts and React app
- `Results`, `Summary`, `FileData` interfaces define the JSON contract
- Changing this file requires updates to both analysis and visualization layers

**src/App.tsx**
- Main orchestration component
- Handles data loading with `fetch('results.json')` + cache-busting
- Auto-refresh every 5 minutes via `setInterval`
- Conditional rendering: Loading → Error → Data display

**vite.config.ts**
- Base path: `/angular-migration-tracker/` (for GitHub Pages deployment)
- Plugins: React + Tailwind CSS
- Public assets copied from `public/` to `dist/` during build

### Component Structure
All components are **presentational** (no data fetching) and receive data via props:

- `Header`: Title and subtitle
- `StatsCards`: Grid of 6 key metrics cards
- `MigrationProgress`: Main progress bar (React file % out of total)
- `ComponentBreakdown`: Horizontal bar chart of 6 AngularJS component types
- `DirectoryList`: Top 15 directories by AngularJS file count
- `RefreshButton`: Fixed bottom-right button for manual refresh
- `LoadingState` / `ErrorState`: Conditional states

## TypeScript Configuration

Uses **project references** for separation:
- `tsconfig.json`: Root config with references
- `tsconfig.app.json`: React app compilation (ES2020, React JSX, strict mode)
- `tsconfig.node.json`: Node.js scripts like vite.config.ts (ES2022)

All TypeScript is configured to be **strict** - do not disable type checking.

## Pattern Detection System

The analyzer uses regex patterns defined in `ANGULARJS_PATTERNS`:

**File-based detection**:
- `*.controller.js`, `*.service.js`, `*.directive.js` files

**Registration detection** (counts occurrences in file content):
- `angular.module('...').component()`
- `angular.module('...').controller()`
- `angular.module('...').service()`
- `angular.module('...').factory()`
- `angular.module('...').directive()`
- `angular.module('...').filter()`

**React detection** (implicit):
- Files with `.tsx` or `.jsx` extensions
- Files with `import ... from 'react'` + React component exports
- JSX syntax in file content

Files marked as both AngularJS and React count as AngularJS (hybrid files are considered pending migration).

## Adding New Metrics

To track additional patterns:

1. Add regex pattern to `ANGULARJS_PATTERNS` in `analyze.ts`
2. Add counter field to `Summary` interface in `src/types.ts`
3. Add matching logic in `analyzeFileContent()` function in `analyze.ts`
4. Create or update React component to display the new metric
5. Run `npm run build:results` to regenerate with new data

## Deployment Architecture

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
- Trigger: Push to `main` or manual dispatch
- Build job: `npm ci` → `npm run build` → upload artifact
- Deploy job: Publish to GitHub Pages
- Output: `https://[org].github.io/angular-migration-tracker/`

**Important**: `public/results.json` is copied to `dist/results.json` during build. The analyzer writes to root `results.json`, so you must run `cp results.json public/results.json` before building if you want fresh data in production.

The `build:results` script automates the analyze + copy steps. You still need to run `npm run build` separately after `build:results`.

## Configuration

### Analyzing Different Repositories
Edit constants in `analyze.ts` (lines 17-20):
```typescript
const GITHUB_OWNER = 'portainer';
const GITHUB_REPO = 'portainer';
const GITHUB_BRANCH = 'develop';
const APP_PATH_IN_REPO = 'app';
```

### Changing Deployment Path
Update `base` in `vite.config.ts` to match your GitHub Pages path.

## Development Workflow

**Local development with real data**:
1. Run `npm run analyze local /path/to/portainer`
2. Start dev server: `npm run dev`
3. Dashboard automatically fetches from root `results.json`
4. Changes to React components hot-reload instantly

**Building for production**:
1. Run `npm run build:results` to analyze and copy to public/ (or manually ensure `public/results.json` has current data)
2. Run `npm run build` to create production bundle
3. Test with `npm run preview`
4. Push to `main` to deploy

## Data Contract (results.json)

The JSON structure is the single source of truth:

```typescript
{
  timestamp: string,           // ISO 8601 when analysis ran
  source: 'local' | 'github',  // Where files came from
  summary: {
    totalAngularJSFiles: number,
    totalReactFiles: number,
    // ... 11 more counters
  },
  byDirectory: Record<string, number>,  // Directory → file count map
  files: FileData[]            // Per-file detailed analysis
}
```

The React dashboard **only reads** this file - it never writes. The analyzer **only writes** this file - it never reads it. This separation allows replacing either half independently.

## Known Patterns

- **Cache busting**: Dashboard fetches `results.json?${Date.now()}` to avoid stale data
- **Auto-refresh**: 5-minute interval set in `App.tsx useEffect` cleanup
- **Error handling**: Missing results.json shows error with `npm run analyze` instructions
- **Responsive grid**: Tailwind `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern
- **Animations**: Progress bars use CSS `transition: width 1s ease` for smooth fills

## Testing Changes

Since there are no automated tests, manually verify:
1. Analysis: Run `npm run analyze local <path>` and check `results.json` output
2. Dashboard: Run `npm run dev` and check all components render correctly
3. Build: Run `npm run build` and verify `dist/` contains all assets
4. Deployment: Check GitHub Actions workflow succeeds after push