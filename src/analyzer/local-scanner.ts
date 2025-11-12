/**
 * Local filesystem scanner for analyzing files
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import type { Results } from '../types.js';
import { analyzeFileContent } from './file-analyzer.js';
import { EXCLUDED_DIRECTORIES, FILE_EXTENSIONS } from './config.js';

/**
 * Recursively walks through directory and analyzes files
 */
function walkDirectory(dir: string, baseDir: string, results: Results): void {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDED_DIRECTORIES.includes(file as any)) {
        continue;
      }
      walkDirectory(filePath, baseDir, results);
    } else if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
      const content = readFileSync(filePath, 'utf8');
      analyzeFileContent(content, filePath, results, baseDir);
    }
  }
}

/**
 * Analyzes local filesystem directory
 */
export function analyzeLocal(appPath: string, results: Results): void {
  console.log(`Scanning local directory: ${appPath}\n`);

  if (!existsSync(appPath)) {
    throw new Error(`Directory not found: ${appPath}`);
  }

  walkDirectory(appPath, appPath, results);
}
