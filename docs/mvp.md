# QuantumDev MVP

## Outcome
An English technology news digest populated from real, verified sources.
One shared source registry supports future French/German versions.
Research digest can reuse the pipeline later; today's focus is QuantumDev news.

## Architecture
- Next.js and TypeScript application.
- config/sources.yaml: authoritative publisher/feed registry.
- Collection script: registry -> RSS/Atom -> normalized, deduplicated records.
- Persisted dataset read by the application; ingestion is not performed on each page view.
- Summary records stored separately by article ID and display language.
- Manual refresh first; twice-daily refresh only after reliable ingestion.

## Source schema
Top-level schema_version: 1 and sources array.
Each entry: id, name, website, feed_url, source_language, topics, kind, enabled.
id is stable and unique; kind is news or research.
source_language describes original content, independently of display language.
Require valid HTTP(S) URLs and nonempty names/topics.
Validate before fetching. Verify each feed endpoint before enabling it.
Do not use ContextMaestro as the sole upstream: collect original publisher sources.

## Article schema
id, source_id, original_title, original_url, source_language,
published_at (nullable), collected_at, topics, excerpt.
Use feed item ID and conservative canonical URL normalization for deduplication.
Preserve query parameters that identify content.
Reconcile the same article across runs; do not append duplicates.
Do not substitute collection time for unknown publication time.

## Reliability
Bound request time, response size and items per feed.
Reject invalid dates/URLs without crashing the entire run.
One failed feed must not prevent other feeds from updating.
Write datasets atomically. Keep last successful data when all sources fail.
Track per-source errors and last successful collection.
Respect publisher rate limits and content permissions.

## English presentation
Show title, source, available date, short summary/excerpt, topics and original link.
If original content is not English, translate title/summary separately.
Retain original metadata unchanged.
Generated summaries require recorded provenance and a configured provider.
Without that provider, label publisher excerpts accurately; English summarization remains pending.

## Interface
Responsive digest; topic filters; text search; newest-first display.
Undated items have a deterministic fallback order and no invented date.
Provide empty/search-empty/error states.
Use accessible controls and text rendering.
No login, payment or advertising implementation in the first prototype.

## Acceptance
1. Enabled endpoints verified live.
2. Single registry drives all ingestion.
3. Repeated collection creates no duplicate articles.
4. Healthy sources update despite partial failure.
5. Working search, filters and original links on desktop/mobile.
6. Build and focused collection checks pass.
7. PR links to Linear and includes verification evidence.
8. Preview is recorded only when actually available.

## Current baseline
Repository inspected: empty, default branch main, write access confirmed.
README initialized to establish a base commit.
Prototype implementation: Next.js, three verified English feeds, persisted publisher excerpts, category filters and search. AI summaries, scheduled refresh and hosted preview remain future work.

