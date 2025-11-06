#!/usr/bin/env tsx

/**
 * AngularJS Migration Tracker - Codebase Analysis Script
 *
 * This script analyzes the Portainer codebase to count AngularJS components
 * and track progress toward complete React migration.
 *
 * Supports both local filesystem and GitHub repository analysis.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { Octokit } from '@octokit/rest';

// Configuration
const GITHUB_OWNER = 'portainer';
const GITHUB_REPO = 'portainer';
const GITHUB_BRANCH = 'develop';
const APP_PATH_IN_REPO = 'app';

// Patterns to identify AngularJS code
interface AngularJSPatterns {
  controllers: RegExp;
  services: RegExp;
  directives: RegExp;
  components: RegExp;
  directiveRegistrations: RegExp;
  controllerRegistrations: RegExp;
  serviceRegistrations: RegExp;
  factoryRegistrations: RegExp;
  filters: RegExp;
  ngInject: RegExp;
  angularImports: RegExp;
}

const ANGULARJS_PATTERNS: AngularJSPatterns = {
  controllers: /\.controller\.js$/,
  services: /\.service\.js$/,
  directives: /\.directive\.js$/,
  components: /angular\.module\(['"].*?['"]\)\.component\(/g,
  directiveRegistrations: /angular\.module\(['"].*?['"]\)\.directive\(/g,
  controllerRegistrations: /angular\.module\(['"].*?['"]\)\.controller\(/g,
  serviceRegistrations: /angular\.module\(['"].*?['"]\)\.service\(/g,
  factoryRegistrations: /angular\.module\(['"].*?['"]\)\.factory\(/g,
  filters: /angular\.module\(['"].*?['"]\)\.filter\(/g,
  ngInject: /\/\*\s*@ngInject\s*\*\//g,
  angularImports: /import\s+angular\s+from\s+['"]angular['"]/g,
};

// Results storage
interface FilePatterns {
  controllerFile?: boolean;
  serviceFile?: boolean;
  directiveFile?: boolean;
  angularImport?: boolean;
  components?: number;
  directives?: number;
  controllers?: number;
  services?: number;
  factories?: number;
  filters?: number;
  ngInject?: number;
}

interface FileData {
  path: string;
  patterns: FilePatterns;
}

interface Summary {
  totalAngularJSFiles: number;
  totalReactFiles: number;
  controllerFiles: number;
  serviceFiles: number;
  directiveFiles: number;
  componentRegistrations: number;
  directiveRegistrations: number;
  controllerRegistrations: number;
  serviceRegistrations: number;
  factoryRegistrations: number;
  filterRegistrations: number;
  ngInjectAnnotations: number;
  filesWithAngularImport: number;
}

interface Results {
  timestamp: string;
  source: 'local' | 'github';
  summary: Summary;
  byDirectory: Record<string, number>;
  files: FileData[];
}

const results: Results = {
  timestamp: new Date().toISOString(),
  source: 'local',
  summary: {
    totalAngularJSFiles: 0,
    totalReactFiles: 0,
    controllerFiles: 0,
    serviceFiles: 0,
    directiveFiles: 0,
    componentRegistrations: 0,
    directiveRegistrations: 0,
    controllerRegistrations: 0,
    serviceRegistrations: 0,
    factoryRegistrations: 0,
    filterRegistrations: 0,
    ngInjectAnnotations: 0,
    filesWithAngularImport: 0,
  },
  byDirectory: {},
  files: [],
};

/**
 * Analyzes file content for AngularJS and React patterns
 */
function analyzeFileContent(content: string, filePath: string, baseDir: string = ''): void {
  const relativePath = baseDir ? relative(baseDir, filePath) : filePath;
  const directory = dirname(relativePath);

  let isAngularFile = false;
  let isReactFile = false;
  const fileData: FileData = {
    path: relativePath,
    patterns: {},
  };

  // Check if it's a React file (TSX/JSX or has React imports/exports)
  const isReactFileExtension = /\.(tsx|jsx)$/.test(filePath);
  const hasReactImport = /import\s+.*\s+from\s+['"]react['"]/.test(content);
  const hasReactExport = /export\s+(default\s+)?function/.test(content) || /export\s+(default\s+)?const/.test(content);
  const hasJSXSyntax = /<[A-Z][A-Za-z0-9]*[\s>\/]/.test(content); // JSX component syntax

  if (isReactFileExtension || (hasReactImport && (hasReactExport || hasJSXSyntax))) {
    isReactFile = true;
  }

  // Check for controller files
  if (ANGULARJS_PATTERNS.controllers.test(filePath)) {
    results.summary.controllerFiles++;
    fileData.patterns.controllerFile = true;
    isAngularFile = true;
  }

  // Check for service files
  if (ANGULARJS_PATTERNS.services.test(filePath)) {
    results.summary.serviceFiles++;
    fileData.patterns.serviceFile = true;
    isAngularFile = true;
  }

  // Check for directive files
  if (ANGULARJS_PATTERNS.directives.test(filePath)) {
    results.summary.directiveFiles++;
    fileData.patterns.directiveFile = true;
    isAngularFile = true;
  }

  // Check for angular imports
  const angularImportMatches = content.match(ANGULARJS_PATTERNS.angularImports);
  if (angularImportMatches) {
    results.summary.filesWithAngularImport++;
    fileData.patterns.angularImport = true;
    isAngularFile = true;
  }

  // Count component registrations
  const componentMatches = content.match(ANGULARJS_PATTERNS.components);
  if (componentMatches) {
    const count = componentMatches.length;
    results.summary.componentRegistrations += count;
    fileData.patterns.components = count;
    isAngularFile = true;
  }

  // Count directive registrations
  const directiveMatches = content.match(ANGULARJS_PATTERNS.directiveRegistrations);
  if (directiveMatches) {
    const count = directiveMatches.length;
    results.summary.directiveRegistrations += count;
    fileData.patterns.directives = count;
    isAngularFile = true;
  }

  // Count controller registrations
  const controllerMatches = content.match(ANGULARJS_PATTERNS.controllerRegistrations);
  if (controllerMatches) {
    const count = controllerMatches.length;
    results.summary.controllerRegistrations += count;
    fileData.patterns.controllers = count;
    isAngularFile = true;
  }

  // Count service registrations
  const serviceMatches = content.match(ANGULARJS_PATTERNS.serviceRegistrations);
  if (serviceMatches) {
    const count = serviceMatches.length;
    results.summary.serviceRegistrations += count;
    fileData.patterns.services = count;
    isAngularFile = true;
  }

  // Count factory registrations
  const factoryMatches = content.match(ANGULARJS_PATTERNS.factoryRegistrations);
  if (factoryMatches) {
    const count = factoryMatches.length;
    results.summary.factoryRegistrations += count;
    fileData.patterns.factories = count;
    isAngularFile = true;
  }

  // Count filter registrations
  const filterMatches = content.match(ANGULARJS_PATTERNS.filters);
  if (filterMatches) {
    const count = filterMatches.length;
    results.summary.filterRegistrations += count;
    fileData.patterns.filters = count;
    isAngularFile = true;
  }

  // Count @ngInject annotations
  const ngInjectMatches = content.match(ANGULARJS_PATTERNS.ngInject);
  if (ngInjectMatches) {
    const count = ngInjectMatches.length;
    results.summary.ngInjectAnnotations += count;
    fileData.patterns.ngInject = count;
    isAngularFile = true;
  }

  // Count React files (but not if they're also AngularJS files - hybrid files count as Angular)
  if (isReactFile && !isAngularFile) {
    results.summary.totalReactFiles++;
  }

  if (isAngularFile) {
    results.summary.totalAngularJSFiles++;
    results.files.push(fileData);

    // Track by directory
    if (!results.byDirectory[directory]) {
      results.byDirectory[directory] = 0;
    }
    results.byDirectory[directory]++;
  }
}

/**
 * Recursively walks through directory and analyzes files (Local filesystem)
 */
function walkDirectory(dir: string, baseDir: string = dir): void {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and certain directories
      if (file === 'node_modules' || file === 'dist' || file === 'build') {
        continue;
      }
      walkDirectory(filePath, baseDir);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = readFileSync(filePath, 'utf8');
      analyzeFileContent(content, filePath, baseDir);
    }
  }
}

/**
 * Fetches and analyzes files from GitHub repository
 */
async function analyzeGitHubRepo(): Promise<void> {
  console.log(`Fetching files from GitHub: ${GITHUB_OWNER}/${GITHUB_REPO} (branch: ${GITHUB_BRANCH})\n`);

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // Get the tree recursively
    const { data: refData } = await octokit.git.getRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `heads/${GITHUB_BRANCH}`,
    });

    const commitSha = refData.object.sha;

    const { data: treeData } = await octokit.git.getTree({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tree_sha: commitSha,
      recursive: 'true',
    });

    // Filter files in the app directory
    const appFiles = treeData.tree.filter(
      (item) =>
        item.type === 'blob' &&
        item.path?.startsWith(APP_PATH_IN_REPO) &&
        (item.path.endsWith('.js') || item.path.endsWith('.ts') || item.path.endsWith('.tsx'))
    );

    console.log(`Found ${appFiles.length} JavaScript/TypeScript files in ${APP_PATH_IN_REPO}/\n`);

    let processed = 0;
    for (const file of appFiles) {
      if (!file.path || !file.sha) continue;

      try {
        const { data: blobData } = await octokit.git.getBlob({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          file_sha: file.sha,
        });

        // Decode base64 content
        const content = Buffer.from(blobData.content, 'base64').toString('utf8');
        analyzeFileContent(content, file.path);

        processed++;
        if (processed % 100 === 0) {
          console.log(`Processed ${processed}/${appFiles.length} files...`);
        }
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
      }
    }

    console.log(`\nProcessed ${processed} files from GitHub\n`);
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    throw error;
  }
}

/**
 * Analyzes local filesystem
 */
function analyzeLocal(appPath: string): void {
  console.log(`Scanning local directory: ${appPath}\n`);

  if (!existsSync(appPath)) {
    throw new Error(`Directory not found: ${appPath}`);
  }

  walkDirectory(appPath);
}

/**
 * Saves results to JSON file
 */
function saveResults(outputPath: string): void {
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);
}

/**
 * Prints summary to console
 */
function printSummary(): void {
  const totalFiles = results.summary.totalAngularJSFiles + results.summary.totalReactFiles;
  const reactPercent = totalFiles > 0 ? (results.summary.totalReactFiles / totalFiles * 100).toFixed(1) : 0;
  const angularPercent = totalFiles > 0 ? (results.summary.totalAngularJSFiles / totalFiles * 100).toFixed(1) : 0;

  console.log('Analysis Complete!\n');
  console.log('=== Summary ===');
  console.log(`Total AngularJS Files: ${results.summary.totalAngularJSFiles} (${angularPercent}%)`);
  console.log(`Total React Files: ${results.summary.totalReactFiles} (${reactPercent}%)`);
  console.log(`Total Files: ${totalFiles}`);
  console.log(`\nMigration Progress: ${reactPercent}% migrated to React`);

  console.log(`\n=== AngularJS Breakdown ===`);
  console.log(`Controller Files: ${results.summary.controllerFiles}`);
  console.log(`Service Files: ${results.summary.serviceFiles}`);
  console.log(`Directive Files: ${results.summary.directiveFiles}`);
  console.log(`\nComponent Registrations: ${results.summary.componentRegistrations}`);
  console.log(`Directive Registrations: ${results.summary.directiveRegistrations}`);
  console.log(`Controller Registrations: ${results.summary.controllerRegistrations}`);
  console.log(`Service Registrations: ${results.summary.serviceRegistrations}`);
  console.log(`Factory Registrations: ${results.summary.factoryRegistrations}`);
  console.log(`Filter Registrations: ${results.summary.filterRegistrations}`);
  console.log(`\nFiles with Angular Import: ${results.summary.filesWithAngularImport}`);
  console.log(`@ngInject Annotations: ${results.summary.ngInjectAnnotations}`);

  console.log(`\nTop Directories by AngularJS File Count:`);
  const sortedDirs = Object.entries(results.byDirectory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedDirs.forEach(([dir, count]) => {
    console.log(`  ${dir}: ${count} files`);
  });
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const mode = args[0] || 'local';
  const customPath = args[1]; // Optional custom path argument

  console.log('AngularJS Migration Tracker\n');
  console.log('============================\n');

  try {
    if (mode === 'github') {
      results.source = 'github';
      await analyzeGitHubRepo();
    } else {
      results.source = 'local';
      // Use custom path if provided, otherwise use default
      const defaultPath = join(process.cwd(), '../portainer-suite/package/server-ee/app');
      const localPath = customPath || defaultPath;
      analyzeLocal(localPath);
    }

    printSummary();

    const outputPath = join(process.cwd(), 'results.json');
    saveResults(outputPath);

    const indexPath = join(process.cwd(), 'index.html');
    console.log(`View the dashboard at: ${indexPath}`);
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  }
}

main();
