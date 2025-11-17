/**
 * Git history analysis utilities
 */

import { execSync } from "child_process";
import type { HtmlFileChange } from "../types";

/**
 * Get the most frequently changed HTML files from git history
 * @param baseDir - Base directory of the git repository
 * @param limit - Maximum number of files to return (default: 20)
 * @returns Array of HTML files sorted by commit count (descending)
 */
export function getMostChangedHtmlFiles(
  baseDir: string,
  limit: number = 20
): HtmlFileChange[] {
  try {
    // Execute git command to find most changed HTML files
    const command = `git log --name-only --pretty=format: -- '*.html' | sort | uniq -c | sort -nr`;

    const output = execSync(command, {
      cwd: baseDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"], // Suppress stderr
    });

    // Parse output format: "  <count> <filepath>"
    const lines = output
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    const results: HtmlFileChange[] = [];
    for (const line of lines) {
      const match = line.trim().match(/^(\d+)\s+(.+)$/);
      if (match) {
        const commitCount = parseInt(match[1], 10);
        const path = match[2];

        // Check if file exists in HEAD
        try {
          execSync(`git cat-file -e HEAD:"${path}"`, {
            cwd: baseDir,
            stdio: ["pipe", "pipe", "pipe"],
          });
          // File exists in HEAD, add it to results
          results.push({ path, commitCount });

          // Stop once we have enough files
          if (results.length >= limit) {
            break;
          }
        } catch {
          // File doesn't exist in HEAD (deleted), skip it
          continue;
        }
      }
    }

    return results;
  } catch (error) {
    // Return empty array if git fails (not a git repo, no HTML files, etc.)
    console.warn(
      "Could not fetch git history for HTML files:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return [];
  }
}
