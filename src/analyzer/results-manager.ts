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
      totalAngularJSTemplates: 0,
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
  // Baseline from commit b23c0f25e feat(app): introduce react configurations [EE-1809] (#646)
  const BASELINE_ANGULARJS_TEMPLATES = 391;

  const progressPercent = ((1 - summary.totalAngularJSTemplates / BASELINE_ANGULARJS_TEMPLATES) * 100).toFixed(1);
  const remainingTemplates = summary.totalAngularJSTemplates;

  console.log('Analysis Complete!\n');
  console.log('=== Summary ===');
  console.log(`Total AngularJS Templates: ${remainingTemplates} / ${BASELINE_ANGULARJS_TEMPLATES} (baseline)`);
  console.log(`Total AngularJS JS Files: ${summary.totalAngularJSFiles}`);
  console.log(`Total React Files: ${summary.totalReactFiles}`);
  console.log(`\nMigration Progress: ${progressPercent}% complete (${remainingTemplates} AngularJS templates remaining)`);

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
