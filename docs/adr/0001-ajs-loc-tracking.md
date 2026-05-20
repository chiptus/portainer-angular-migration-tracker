# ADR 0001: Track AngularJS LOC as a migration progress metric

## Status

Accepted

## Context

The tracker previously measured migration progress in file counts (AJS templates, React files). File count is a coarse signal — a 3000-line controller and a 10-line stub both count as one file. We wanted a metric that better reflects how much AngularJS code actually remains.

## Decision

Add `angularJSLines` to `HistorySnapshot`: the raw line count of all JS files identified as AngularJS, accumulated per historical git commit alongside the existing template count.

**JS files only, not HTML templates.** Template count is already tracked separately by file count, and HTML LOC is whitespace-heavy and not a meaningful measure of remaining migration work.

**Raw lines, not non-empty or non-comment lines.** The tracker needs a consistent, fast-to-compute number that shows a downward trend. Raw line count is unambiguous, requires no parsing, and any bias it introduces is consistent across all historical commits.

**Git-derived baseline, not a hardcoded constant.** The baseline is the `angularJSLines` value in the first historical snapshot. This ties the "start of migration" to actual code state rather than a manually maintained number.

**Cached via incremental snapshots.** The existing `history.json` incremental mechanism (skip commits already present) handles caching. Adding this field required a one-time full regeneration of `history.json`.

## Consequences

- `history.json` must be deleted and fully regenerated once when deploying this change; incremental updates work normally after that.
- `HistorySnapshot.angularJSLines` is optional in the TypeScript type to tolerate stale `history.json` files that predate this change. The LOC chart silently filters out snapshots missing the field.
- `Summary.totalAngularJSLines` is now included in every `results.json`, making current LOC available outside of history context.
