/**
 * Results storage, output, and reporting utilities
 */

import { writeFileSync } from 'fs';
import type { Results, Summary } from '../types.js';

/**
 * Creates a new empty results object
 */
export function createResults(source: 'local' | 'github'): Results {
  return {
    timestamp: new Date().toISOString(),
    source,
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
}

/**
 * Saves results to JSON file
 */
export function saveResults(results: Results, outputPath: string): void {
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);
}

/**
 * Prints summary to console
 */
export function printSummary(summary: Summary, byDirectory: Record<string, number>): void {
  const totalFiles = summary.totalAngularJSFiles + summary.totalReactFiles;
  const reactPercent =
    totalFiles > 0 ? ((summary.totalReactFiles / totalFiles) * 100).toFixed(1) : 0;
  const angularPercent =
    totalFiles > 0 ? ((summary.totalAngularJSFiles / totalFiles) * 100).toFixed(1) : 0;

  console.log('Analysis Complete!\n');
  console.log('=== Summary ===');
  console.log(`Total AngularJS Files: ${summary.totalAngularJSFiles} (${angularPercent}%)`);
  console.log(`Total React Files: ${summary.totalReactFiles} (${reactPercent}%)`);
  console.log(`Total Files: ${totalFiles}`);
  console.log(`\nMigration Progress: ${reactPercent}% migrated to React`);

  console.log(`\n=== AngularJS Breakdown ===`);
  console.log(`Controller Files: ${summary.controllerFiles}`);
  console.log(`Service Files: ${summary.serviceFiles}`);
  console.log(`Directive Files: ${summary.directiveFiles}`);
  console.log(`\nComponent Registrations: ${summary.componentRegistrations}`);
  console.log(`Directive Registrations: ${summary.directiveRegistrations}`);
  console.log(`Controller Registrations: ${summary.controllerRegistrations}`);
  console.log(`Service Registrations: ${summary.serviceRegistrations}`);
  console.log(`Factory Registrations: ${summary.factoryRegistrations}`);
  console.log(`Filter Registrations: ${summary.filterRegistrations}`);
  console.log(`\nFiles with Angular Import: ${summary.filesWithAngularImport}`);
  console.log(`@ngInject Annotations: ${summary.ngInjectAnnotations}`);

  console.log(`\nTop Directories by AngularJS File Count:`);
  const sortedDirs = Object.entries(byDirectory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedDirs.forEach(([dir, count]) => {
    console.log(`  ${dir}: ${count} files`);
  });
}
