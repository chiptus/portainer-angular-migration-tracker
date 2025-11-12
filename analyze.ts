#!/usr/bin/env tsx

/**
 * AngularJS Migration Tracker - Codebase Analysis Script
 *
 * This script analyzes the Portainer codebase to count AngularJS components
 * and track progress toward complete React migration.
 *
 * Supports both local filesystem and GitHub repository analysis.
 */

import { join } from 'path';
import { analyzeLocal } from './src/analyzer/local-scanner.js';
import { analyzeGitHubRepo } from './src/analyzer/github-scanner.js';
import { createResults, saveResults, printSummary } from './src/analyzer/results-manager.js';

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
    let results;

    if (mode === 'github') {
      results = createResults('github');
      await analyzeGitHubRepo(results);
    } else {
      results = createResults('local');
      // Use custom path if provided, otherwise use default
      const defaultPath = join(process.cwd(), '../portainer-suite/package/server-ee/app');
      const localPath = customPath || defaultPath;
      analyzeLocal(localPath, results);
    }

    printSummary(results.summary, results.byDirectory);

    const outputPath = join(process.cwd(), 'results.json');
    saveResults(results, outputPath);

    const indexPath = join(process.cwd(), 'index.html');
    console.log(`View the dashboard at: ${indexPath}`);
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  }
}

main();
