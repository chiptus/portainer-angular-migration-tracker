# AngularJS Migration Tracker

A standalone tool to track the progress of migrating from AngularJS to React in the Portainer codebase.

## Features

- Counts AngularJS components, controllers, services, directives, and other legacy code
- Supports both local filesystem and GitHub repository analysis
- Beautiful standalone HTML dashboard to visualize progress
- TypeScript-based for type safety and maintainability

## Installation

```bash
cd tools/angular-migration-tracker
yarn install
```

## Usage

### Analyze Local Codebase

To analyze the local Portainer codebase:

```bash
yarn analyze
# or
yarn analyze local
```

This will scan the `package/server-ee/app` directory and generate `results.json`.

### Analyze GitHub Repository

To analyze the Portainer repository directly from GitHub:

```bash
yarn analyze github
```

This will fetch files from the `portainer/portainer` repository (develop branch) and analyze them.

**Note:** For authenticated GitHub requests (higher rate limits), set the `GITHUB_TOKEN` environment variable:

```bash
GITHUB_TOKEN=your_token_here yarn analyze github
```

## View the Dashboard

After running the analysis, start the HTTP server to view the dashboard:

```bash
yarn serve
```

This will start a local server on port 8080 and automatically open the dashboard in your browser.

**Or run both analysis and server in one command:**

```bash
yarn start
```

The dashboard shows:
- Total AngularJS files remaining
- Breakdown by component type (controllers, services, directives, etc.)
- Migration progress visualization
- Top directories by AngularJS file count

## What It Tracks

The tool identifies and counts:

1. **File Types**
   - Controller files (`.controller.js`)
   - Service files (`.service.js`)
   - Directive files (`.directive.js`)

2. **AngularJS Registrations**
   - `angular.module().component()`
   - `angular.module().directive()`
   - `angular.module().controller()`
   - `angular.module().service()`
   - `angular.module().factory()`
   - `angular.module().filter()`

3. **AngularJS Patterns**
   - Files with `import angular from 'angular'`
   - `/* @ngInject */` annotations

## Output

The analysis generates a `results.json` file with:

```json
{
  "timestamp": "2025-11-06T...",
  "source": "local" | "github",
  "summary": {
    "totalAngularJSFiles": 150,
    "controllerFiles": 31,
    "serviceFiles": 3,
    ...
  },
  "byDirectory": {
    "portainer/settings/authentication/ldap": 15,
    ...
  },
  "files": [...]
}
```

## Development

### Build TypeScript

```bash
yarn build
```

### Watch Mode

```bash
yarn dev
```

## Configuration

To analyze a different repository or branch, edit the constants in `analyze.ts`:

```typescript
const GITHUB_OWNER = 'portainer';
const GITHUB_REPO = 'portainer';
const GITHUB_BRANCH = 'develop';
const APP_PATH_IN_REPO = 'app';
```

## Architecture

- **analyze.ts** - TypeScript script that scans files and counts AngularJS patterns
- **index.html** - Standalone HTML dashboard with embedded JavaScript and CSS
- **results.json** - Generated JSON file with analysis results
- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript configuration

## How It Works

1. The script walks through all `.js`, `.ts`, and `.tsx` files
2. For each file, it uses regex patterns to detect AngularJS code
3. Results are aggregated and saved to `results.json`
4. The HTML dashboard fetches `results.json` and renders visualizations

## Contributing

To add new patterns or metrics:

1. Add the pattern to `ANGULARJS_PATTERNS` in `analyze.ts`
2. Add a counter to the `Summary` interface
3. Add the matching logic in `analyzeFileContent()`
4. Update the dashboard in `index.html` to display the new metric

## License

Part of the Portainer project.
