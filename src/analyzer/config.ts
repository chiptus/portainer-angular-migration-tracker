/**
 * Configuration constants for the analysis script
 */

export const GITHUB_CONFIG = {
  OWNER: 'portainer',
  REPO: 'portainer',
  BRANCH: 'develop',
  APP_PATH: 'app',
} as const;

export const EXCLUDED_DIRECTORIES = ['node_modules', 'dist', 'build'] as const;

export const FILE_EXTENSIONS = ['.js', '.ts', '.tsx', '.html'] as const;
