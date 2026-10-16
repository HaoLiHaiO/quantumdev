# QuantumDev

English-first technology digest. One source registry, independent of display language.

## Run

Requires Node.js 22 or later.

```sh
npm ci
npm run collect
npm run dev
```

Open http://localhost:3000.

## Verify and build

```sh
npm test
npm run typecheck
npm run collect
npm run build
npm start
```

Run collection before building: the dataset is prerendered, so a refreshed dataset requires a new build/deploy. No scheduled automation is configured yet.

## Sources

Edit only config/sources.yaml. Publisher language is separate from future display languages. The registry contains 64 enabled feeds across the three editorial categories, verified with live HTTP fetches and RSS/Atom parsing on 2026-10-16. Failed candidates remain disabled. See docs/source-verification.json for per-source evidence; successful validation is a point-in-time check, not a future availability guarantee.

Focused agent tooling sources set `relevance: focused` so release titles such as version numbers are retained. Broad AI feeds use the default keyword filtering.

The collector uses six concurrent workers and limits each feed to 8 MB, 15 seconds and 40 entries, isolates failures, deduplicates stable IDs and URLs and atomically writes data/articles.json. Total failure keeps previous articles and reports source errors.

## Delivery limits

Text is publisher-provided excerpt, not an AI summary. Sources are English; translation is not configured. No credentials are needed for the current feeds. Hosted preview, twice-daily refresh, generated summaries and research digest are pending. No production deployment has been performed.

[Linear project](https://linear.app/alexagentic/project/quantumdev-7a5e7506cddf)


## Theme

Use the header button to switch light/dark. The explicit preference is stored under `quantumdev-theme` in localStorage. Without a valid preference, the site follows the system theme. The initial theme is applied before the page paints. If storage is blocked, switching still works for the current visit.

## Categories
Quantum Programming, Software Engineering and Agentic Engineering. Infrastructure is excluded. General Hugging Face ML posts are filtered out; agent-related content is selected by explicit keywords. Qiskit releases Atom was verified on 2026-10-09.

Total feed failure retains all cached articles and the last successful update time, while recording the latest attempt and source errors. Quantum classification follows registry topics, independent of source IDs.

## Digest size
Successful collection retains the 100 newest eligible articles. The digest initially renders 20 cards; Load more reveals the next 20. Search and topic filters use all 100 records and reset the visible count. A total collection failure preserves the cached dataset.
