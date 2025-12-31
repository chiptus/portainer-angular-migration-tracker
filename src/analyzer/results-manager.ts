/**
 * Results storage, output, and reporting utilities
 */

import { writeFileSync } from "fs";
import type { Results, Summary, ModuleStats } from "../types";

/**
 * Creates a new empty results object
 */
export function createResults(source: "local" | "github"): Results {
	return {
		timestamp: new Date().toISOString(),
		source,
		summary: {
			totalAngularJSTemplates: 0,
			totalReactFiles: 0,
		},
		byModule: {},
		mostChangedHtmlFiles: undefined,
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
export function printSummary(
	summary: Summary,
	byModule: Record<string, ModuleStats>,
): void {
	// Baseline from commit b23c0f25e feat(app): introduce react configurations [EE-1809] (#646)
	const BASELINE_ANGULARJS_TEMPLATES = 391;

	const progressPercent = (
		(1 - summary.totalAngularJSTemplates / BASELINE_ANGULARJS_TEMPLATES) *
		100
	).toFixed(1);
	const remainingTemplates = summary.totalAngularJSTemplates;

	console.log("Analysis Complete!\n");
	console.log("=== Summary ===");
	console.log(
		`Total AngularJS Templates: ${remainingTemplates} / ${BASELINE_ANGULARJS_TEMPLATES} (baseline)`,
	);
	console.log(`Total React Files: ${summary.totalReactFiles}`);
	console.log(
		`\nMigration Progress: ${progressPercent}% complete (${remainingTemplates} AngularJS templates remaining)`,
	);

	console.log(`\n=== Module Breakdown ===`);
	const sortedModules = Object.entries(byModule).sort(
		(a, b) => b[1].angularJSFiles - a[1].angularJSFiles,
	);

	for (const [module, stats] of sortedModules) {
		const total = stats.angularJSFiles + stats.reactFiles;
		const moduleProgress =
			total > 0 ? ((stats.reactFiles / total) * 100).toFixed(1) : "0.0";
		console.log(
			`  ${module}: ${stats.angularJSFiles} AngularJS, ${stats.reactFiles} React (${moduleProgress}% migrated)`,
		);
	}
}
