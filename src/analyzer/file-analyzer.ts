/**
 * File content analysis logic for detecting AngularJS and React patterns
 */

import { relative, dirname } from "path";
import type { Results } from "../types";
import { ANGULARJS_PATTERNS, REACT_PATTERNS } from "./patterns";

/**
 * Analyzes file content for AngularJS and React patterns
 * Mutates the results object to update counters by module
 */
export function analyzeFileContent(
	content: string,
	filePath: string,
	results: Results,
	baseDir: string = "",
): void {
	const relativePath = baseDir ? relative(baseDir, filePath) : filePath;
	const directory = dirname(relativePath);
	const pathParts = directory.split("/");

	// Determine module: if path is react/X, use "react/X", otherwise use first part
	let module: string;
	if (pathParts[0] === "react" && pathParts.length > 1) {
		module = `${pathParts[0]}/${pathParts[1]}`; // e.g., "react/portainer"
	} else {
		module = pathParts[0] || ".";
	}

	// Initialize module stats if it doesn't exist
	if (!results.byModule[module]) {
		results.byModule[module] = { angularJSFiles: 0, reactFiles: 0 };
	}

	// Check if it's an HTML template file
	if (ANGULARJS_PATTERNS.htmlTemplate.test(filePath)) {
		results.summary.totalAngularJSTemplates++;
		return; // HTML templates don't need further analysis
	}

	let isAngularFile = false;
	let isReactFile = false;

	// Check if it's a React file (TSX/JSX or has React imports/exports)
	const isReactFileExtension = REACT_PATTERNS.fileExtension.test(filePath);
	const hasReactImport = REACT_PATTERNS.reactImport.test(content);
	const hasReactExport = REACT_PATTERNS.reactExport.test(content);
	const hasJSXSyntax = REACT_PATTERNS.jsxSyntax.test(content);

	if (
		isReactFileExtension ||
		(hasReactImport && (hasReactExport || hasJSXSyntax))
	) {
		isReactFile = true;
	}

	// Check for any AngularJS patterns
	if (
		ANGULARJS_PATTERNS.controllers.test(filePath) ||
		ANGULARJS_PATTERNS.services.test(filePath) ||
		ANGULARJS_PATTERNS.directives.test(filePath) ||
		ANGULARJS_PATTERNS.angularImports.test(content) ||
		ANGULARJS_PATTERNS.components.test(content) ||
		ANGULARJS_PATTERNS.directiveRegistrations.test(content) ||
		ANGULARJS_PATTERNS.controllerRegistrations.test(content) ||
		ANGULARJS_PATTERNS.serviceRegistrations.test(content) ||
		ANGULARJS_PATTERNS.factoryRegistrations.test(content) ||
		ANGULARJS_PATTERNS.filters.test(content) ||
		ANGULARJS_PATTERNS.ngInject.test(content)
	) {
		isAngularFile = true;
	}

	// Count React files (but not if they're also AngularJS files - hybrid files count as Angular)
	if (isReactFile && !isAngularFile) {
		results.summary.totalReactFiles++;
		results.byModule[module].reactFiles++;
	}

	if (isAngularFile) {
		results.byModule[module].angularJSFiles++;
	}
}
