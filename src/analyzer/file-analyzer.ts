/**
 * File content analysis logic for detecting AngularJS and React patterns
 */

import { relative, dirname } from 'path';
import type { FileData, Results } from '../types.js';
import { ANGULARJS_PATTERNS, REACT_PATTERNS } from './patterns.js';

/**
 * Analyzes file content for AngularJS and React patterns
 * Mutates the results object to update counters and file data
 */
export function analyzeFileContent(
  content: string,
  filePath: string,
  results: Results,
  baseDir: string = ''
): void {
  const relativePath = baseDir ? relative(baseDir, filePath) : filePath;
  const directory = dirname(relativePath);

  // Check if it's an HTML template file
  if (ANGULARJS_PATTERNS.htmlTemplate.test(filePath)) {
    results.summary.totalAngularJSTemplates++;
    return; // HTML templates don't need further analysis
  }

  let isAngularFile = false;
  let isReactFile = false;
  const fileData: FileData = {
    path: relativePath,
    patterns: {},
  };

  // Check if it's a React file (TSX/JSX or has React imports/exports)
  const isReactFileExtension = REACT_PATTERNS.fileExtension.test(filePath);
  const hasReactImport = REACT_PATTERNS.reactImport.test(content);
  const hasReactExport = REACT_PATTERNS.reactExport.test(content);
  const hasJSXSyntax = REACT_PATTERNS.jsxSyntax.test(content);

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
