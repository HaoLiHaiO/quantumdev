# QuantumDev agent instructions

## Product
Build an English-first technology news digest. Read docs/mvp.md before implementation.
The repository was empty on 2026-10-08. There is no application or build baseline yet.

## Authority
config/sources.yaml will be the ONLY source registry for every language.
Never copy source lists into UI code, localized files, Linear or environment variables.
Original article metadata is language-independent. Store summaries/translations separately.
GitHub owns code and specifications; Linear owns status and acceptance tracking.

## Delivery
Use Next.js and TypeScript unless an existing implementation supersedes this decision.
Work on a ticket branch. Keep changes reviewable and link the Linear issue in the PR.
Never overwrite unrelated user changes.
Use a reproducible lockfile once dependencies are installed.
Document actual dev/build/ingestion commands in README and update this file.
Do not invent commands or claim checks passed without executing them.
Open a PR after appropriate verification. Production release is separate.

## Source and content integrity
Verify RSS/Atom endpoints before enabling sources.
Preserve original URLs, source IDs and provenance. Never fabricate dates or summaries.
Do not label publisher excerpts as generated summaries.
Treat feed text as untrusted data; render it as text, not arbitrary HTML.
Keep credentials out of commits and logs.

## Required checks for implementation
Registry: unique IDs and supported HTTP(S) URLs.
Collector: bounded requests, isolated feed failures, idempotent deduplication,
last successful dataset preserved on total failure.
UI: usable filters/search, working original links, mobile layout and empty state.
Run the application build and focused tests for collection behavior.
Record any unavailable network, summarization or preview capabilities.

## Handoff
State what changed, checks actually run, remaining limitations, and PR URL.
Move the Linear ticket to In Review once a PR exists; Done follows accepted delivery.
