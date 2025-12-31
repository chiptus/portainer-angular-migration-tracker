#!/usr/bin/env tsx
/**
 * Generates historical migration data by analyzing the Portainer repo at different points in time
 * This shows how the migration has progressed over actual development history
 */

import { execSync } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { HistorySnapshot, HistoryData } from "../types";
import { createResults } from "./results-manager";
import { analyzeLocal } from "./local-scanner";

/**
 * Format a date as YYYY-MM-DD (ISO date format)
 */
function formatDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toISOString().split("T")[0];
}

/**
 * Analyze Portainer repo at a specific git commit
 * @param portainerRepoPath - Path to the Portainer repository
 * @param commitHash - Git commit hash to check out
 * @param timestamp - ISO timestamp of the commit
 */
function analyzeCommit(
	portainerRepoPath: string,
	commitHash: string,
	timestamp: string,
): HistorySnapshot | null {
	try {
		// Checkout the specific commit
		execSync(`git checkout ${commitHash}`, {
			cwd: portainerRepoPath,
			stdio: ["pipe", "pipe", "pipe"],
		});

		// Run analysis on this commit
		const results = createResults("local");
		const appPath = join(portainerRepoPath, "app");

		if (!existsSync(appPath)) {
			console.warn(
				`  ⚠️  app directory not found at commit ${commitHash.substring(0, 7)}`,
			);
			return null;
		}

		analyzeLocal(appPath, results);

		return {
			timestamp,
			angularJSTemplates: results.summary.totalAngularJSTemplates,
			reactFiles: results.summary.totalReactFiles,
		};
	} catch (error) {
		console.warn(
			`  ⚠️  Failed to analyze commit ${commitHash.substring(0, 7)}: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		return null;
	}
}

/**
 * Extract historical data by analyzing the Portainer repo's git history
 * @param portainerRepoPath - Path to the Portainer repository
 * @param sampleInterval - Sample every N days (default: 7 for weekly samples)
 * @param existingSnapshots - Existing snapshots to append to (for incremental updates)
 */
export function generateHistoryFromGit(
	portainerRepoPath: string,
	sampleInterval: number = 7,
	existingSnapshots: HistorySnapshot[] = [],
): HistorySnapshot[] {
	const isIncremental = existingSnapshots.length > 0;

	if (isIncremental) {
		console.log(
			`Incremental update: ${existingSnapshots.length} existing snapshots\n`,
		);
	} else {
		console.log(
			`Full analysis: sampling every ${sampleInterval} days (last 4 years)...\n`,
		);
	}

	try {
		// Get current branch to restore later
		const currentBranch = execSync("git branch --show-current", {
			cwd: portainerRepoPath,
			encoding: "utf8",
		}).trim();

		// Determine time range
		let sinceDate: string;
		let lastSampledDate: Date | null = null;

		if (isIncremental) {
			// Only analyze commits since the last snapshot
			const lastSnapshot = existingSnapshots[existingSnapshots.length - 1];
			lastSampledDate = new Date(lastSnapshot.timestamp);
			sinceDate = lastSampledDate.toISOString().split("T")[0];
			console.log(`Analyzing commits since ${sinceDate}...\n`);
		} else {
			// Full analysis: last 4 years (when migration started)
			const fourYearsAgo = new Date();
			fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);
			sinceDate = fourYearsAgo.toISOString().split("T")[0];
		}

		// Get list of commits
		const gitLog = execSync(
			`git log --since="${sinceDate}" --format="%H %aI" --all --no-merges -- app`,
			{ cwd: portainerRepoPath, encoding: "utf8" },
		);

		const allCommits = gitLog
			.trim()
			.split("\n")
			.filter((line) => line)
			.map((line) => {
				const [hash, timestamp] = line.split(" ");
				return { hash, timestamp, date: new Date(timestamp) };
			});

		console.log(`Found ${allCommits.length} commits since ${sinceDate}\n`);

		// Sample commits at the specified interval
		const newSnapshots: HistorySnapshot[] = [];

		for (const commit of allCommits.reverse()) {
			// Sample first commit, then every N days
			if (
				!lastSampledDate ||
				(commit.date.getTime() - lastSampledDate.getTime()) /
					(1000 * 60 * 60 * 24) >=
					sampleInterval
			) {
				console.log(
					`Analyzing commit ${commit.hash.substring(0, 7)} (${formatDate(commit.date)})...`,
				);
				const snapshot = analyzeCommit(
					portainerRepoPath,
					commit.hash,
					commit.timestamp,
				);

				if (snapshot) {
					newSnapshots.push(snapshot);
					lastSampledDate = commit.date;
					console.log(
						`  ✓ ${snapshot.angularJSTemplates} AngularJS templates, ${snapshot.reactFiles} React files`,
					);
				}
			}
		}

		// Restore original branch
		console.log(`\nRestoring branch: ${currentBranch}`);
		execSync(`git checkout ${currentBranch}`, {
			cwd: portainerRepoPath,
			stdio: ["pipe", "pipe", "pipe"],
		});

		// Combine existing and new snapshots
		const allSnapshots = [...existingSnapshots, ...newSnapshots];

		console.log(
			`\n✓ Added ${newSnapshots.length} new snapshots (total: ${allSnapshots.length})\n`,
		);
		return allSnapshots;
	} catch (error) {
		console.error("Failed to extract git history:", error);
		return existingSnapshots; // Return existing data on error
	}
}

/**
 * Main execution: generate history.json file
 */
async function main() {
	const BASELINE = 391;
	const args = process.argv.slice(2);

	// Get Portainer repo path from command line or use default
	const defaultPath = join(
		process.cwd(),
		"../portainer-suite/package/server-ee",
	);
	const portainerRepoPath = args[0] || defaultPath;

	// Optional: sample interval in days (default 7 = weekly)
	const sampleInterval = args[1] ? parseInt(args[1], 10) : 7;

	const outputPath = join(process.cwd(), "public", "history.json");

	console.log(`Portainer repo path: ${portainerRepoPath}`);
	console.log(`Sample interval: ${sampleInterval} days\n`);

	if (!existsSync(portainerRepoPath)) {
		console.error(`❌ Portainer repository not found at: ${portainerRepoPath}`);
		console.error(
			`\nUsage: pnpm run generate:history [portainer-repo-path] [sample-interval-days]`,
		);
		console.error(`Example: pnpm run generate:history ../portainer 14`);
		process.exit(1);
	}

	// Load existing history for incremental updates
	let existingSnapshots: HistorySnapshot[] = [];
	if (existsSync(outputPath)) {
		try {
			const existingData = JSON.parse(readFileSync(outputPath, "utf8"));
			existingSnapshots = existingData.snapshots || [];
			console.log(
				`Found existing history file with ${existingSnapshots.length} snapshots\n`,
			);
		} catch (error) {
			console.warn(
				`⚠️  Could not read existing history, starting fresh\n`,
				error,
			);
		}
	}

	const snapshots = generateHistoryFromGit(
		portainerRepoPath,
		sampleInterval,
		existingSnapshots,
	);

	if (snapshots.length === 0) {
		console.error("❌ No historical data found. Exiting.");
		process.exit(1);
	}

	const historyData: HistoryData = {
		version: "1.0",
		generated: new Date().toISOString(),
		baseline: BASELINE,
		snapshots,
	};

	writeFileSync(outputPath, JSON.stringify(historyData, null, 2));

	console.log(`✓ History data saved to: ${outputPath}`);
	console.log(`  Total snapshots: ${snapshots.length}`);
	console.log(
		`  Date range: ${formatDate(snapshots[0].timestamp)} - ${formatDate(
			snapshots[snapshots.length - 1].timestamp,
		)}`,
	);
	console.log(
		`  Current: ${snapshots[snapshots.length - 1].angularJSTemplates} AngularJS templates remaining`,
	);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
