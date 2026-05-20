# Context

## Glossary

### AngularJS Lines of Code (AJS LOC)

The raw line count of all JS files identified as AngularJS in the Portainer app directory. Counts every line including blank lines and comments. Does not include HTML template files. Only counts files where `isAngularFile && !isReactBridge` — the same population tracked by `angularJSFiles` in the module breakdown.

### Migration Baseline

The AJS LOC (or template count) recorded in the first historical snapshot. Derived from git history — specifically the oldest sampled commit in `history.json`. Not a hardcoded constant. The "start of migration" is defined as whatever state the repo was in at the first sampled commit (~4 years ago).

### HistorySnapshot

A point-in-time measurement of migration state at a sampled git commit. Sampled at a configurable interval (default: weekly). Stored cumulatively in `public/history.json`. Contains `angularJSTemplates`, `reactFiles`, and `angularJSLines`.

### Bridge File

A JS file whose path has `react` as its second path component but not the first (e.g., `docker/react/...`). Excluded from AngularJS file counts and LOC counts. Represents React components embedded inside AngularJS module directories during incremental migration.

### AJS Template

An `.html` file in the app directory. Tracked by count only (not LOC). Represents AngularJS view templates that still need migration to JSX.
