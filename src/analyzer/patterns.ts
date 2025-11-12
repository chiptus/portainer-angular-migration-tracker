/**
 * Regular expression patterns for identifying AngularJS and React code
 */

export interface AngularJSPatterns {
  htmlTemplate: RegExp;
  controllers: RegExp;
  services: RegExp;
  directives: RegExp;
  components: RegExp;
  directiveRegistrations: RegExp;
  controllerRegistrations: RegExp;
  serviceRegistrations: RegExp;
  factoryRegistrations: RegExp;
  filters: RegExp;
  ngInject: RegExp;
  angularImports: RegExp;
}

export const ANGULARJS_PATTERNS: AngularJSPatterns = {
  htmlTemplate: /\.html$/,
  controllers: /\.controller\.js$/,
  services: /\.service\.js$/,
  directives: /\.directive\.js$/,
  components: /angular\.module\(['"].*?['"]\)\.component\(/g,
  directiveRegistrations: /angular\.module\(['"].*?['"]\)\.directive\(/g,
  controllerRegistrations: /angular\.module\(['"].*?['"]\)\.controller\(/g,
  serviceRegistrations: /angular\.module\(['"].*?['"]\)\.service\(/g,
  factoryRegistrations: /angular\.module\(['"].*?['"]\)\.factory\(/g,
  filters: /angular\.module\(['"].*?['"]\)\.filter\(/g,
  ngInject: /\/\*\s*@ngInject\s*\*\//g,
  angularImports: /import\s+angular\s+from\s+['"]angular['"]/g,
};

export const REACT_PATTERNS = {
  fileExtension: /\.(tsx|jsx)$/,
  reactImport: /import\s+.*\s+from\s+['"]react['"]/,
  reactExport: /export\s+(default\s+)?(function|const)/,
  jsxSyntax: /<[A-Z][A-Za-z0-9]*[\s>/]/,
} as const;
