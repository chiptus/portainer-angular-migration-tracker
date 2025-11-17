/**
 * GitHub repository scanner using Octokit API
 */

import { Octokit } from "@octokit/rest";
import type { Results } from "../types";
import { analyzeFileContent } from "./file-analyzer";
import { GITHUB_CONFIG, FILE_EXTENSIONS } from "./config";

/**
 * Fetches and analyzes files from GitHub repository
 */
export async function analyzeGitHubRepo(results: Results): Promise<void> {
  console.log(
    `Fetching files from GitHub: ${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO} (branch: ${GITHUB_CONFIG.BRANCH})\n`
  );

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // Get the tree recursively
    const { data: refData } = await octokit.git.getRef({
      owner: GITHUB_CONFIG.OWNER,
      repo: GITHUB_CONFIG.REPO,
      ref: `heads/${GITHUB_CONFIG.BRANCH}`,
    });

    const commitSha = refData.object.sha;

    const { data: treeData } = await octokit.git.getTree({
      owner: GITHUB_CONFIG.OWNER,
      repo: GITHUB_CONFIG.REPO,
      tree_sha: commitSha,
      recursive: "true",
    });

    // Filter files in the app directory
    const appFiles = treeData.tree.filter(
      (item) =>
        item.type === "blob" &&
        item.path?.startsWith(GITHUB_CONFIG.APP_PATH) &&
        FILE_EXTENSIONS.some((ext) => item.path?.endsWith(ext))
    );

    console.log(
      `Found ${appFiles.length} JavaScript/TypeScript files in ${GITHUB_CONFIG.APP_PATH}/\n`
    );

    let processed = 0;
    for (const file of appFiles) {
      if (!file.path || !file.sha) continue;

      try {
        const { data: blobData } = await octokit.git.getBlob({
          owner: GITHUB_CONFIG.OWNER,
          repo: GITHUB_CONFIG.REPO,
          file_sha: file.sha,
        });

        // Decode base64 content
        const content = Buffer.from(blobData.content, "base64").toString(
          "utf8"
        );
        analyzeFileContent(content, file.path, results);

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
    console.error("Error fetching from GitHub:", error);
    throw error;
  }
}
