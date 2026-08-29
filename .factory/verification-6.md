# Independent verification 6 — PASS

**Candidate:** `db4e0c587061e7fe643944e1c25edceeb2efa87a`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 from `/work/repo` at the candidate commit

## Verdict

**PASS.** Fresh local and live evidence confirms the real browser-extension
workflow, demo sandbox, privacy boundary, accessibility baseline, offline
behaviour, packaged download, and licensed endpoint allowance. The live
artifact is the fresh candidate build.

## Mandatory first checks

### Claims

`.factory/claims.json` exists and declares 17 claims. After `npm ci`, I ran
every declared `npm test -- --grep @claim:<id>` command separately through the
test's clean demo/packaged-extension entry point. Every command passed:

`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`,
`destructive-review`, `undo-local-delete`, `visible-labels`,
`password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`,
`page-data-local`, `extension-local-storage`, and `license-verification`.

### Cold first read

A cold, no-storage visit to the live home page plainly says what it does:
“say or type a visible control's name”; who it is for: “people with limited
vision or hand mobility”; and what to do first: **Try it with sample data**.
Its adjacent explanation says it opens four sample controls without changing a
real page. One click opened `/demo` with the persistent “Demo — sample data,
nothing is saved” banner, Reset demo, Start for real, and four sample
controls. This gate passes.

## Local checks

- `npm ci`: PASS; lockfile installation completed with 0 audit findings.
- `CI=1 npm test`: PASS — 5 Vitest tests and 30 Playwright tests.
- `CI=1 npm run test:claims`: PASS — 30 Playwright tests.
- `CI=1 npm run test:unit`, `npm run typecheck`, `npm run lint`,
  `npm run build`, and `npm run test:package`: PASS.
- Production build emitted `dist/site` and `dist/extension`. The consumer
  package check verified `dist/site/downloads/speak-page-actions.zip`.
- Production extension permissions are exactly `activeTab`, `scripting`, and
  `storage`; its only host permission is the disclosed Sociobot verification
  endpoint. There is no always-on content script or broad host permission.
- Budget evidence: initial JS is 13,706 B (5,037 B gzip), CSS is 10,433 B
  (3,032 B gzip), and hero WebP is 142,634 B. All are within the stated
  budgets.

## Live behaviour, privacy, and deployment identity

- At 390×844, keyboard focus first reached the visible Skip link. A typed
  `click save address` command returned “Used Save address.” An unmatched
  command gave “No visible action matched. Use a label from the list.”
  Deleting a sample was reviewed: dismissing left it unused, accepting used
  it, and Undo returned “Undid Delete saved draft in the sample.”
- Demo storage used `demo:spa:sample`; Start for real removed only that demo
  namespace and retained independently seeded real-setting and license
  sentinels. It navigated to `/#install`.
- A cold live request log for the public page contained only same-origin
  document, JS, CSS, and hero requests. There were no analytics, font-CDN,
  third-party script, or page-data requests. The packaged extension claim
  flow separately records no external page-data request; the explicit license
  restore flow sends the encoded token only to `api.sociobot.in`.
- After first visit, live `/demo` was service-worker controlled and reloaded
  offline (HTTP 200) with “Speak a visible control” intact. A fresh context
  seeded `speak-page-actions-v2`, registered an updated worker URL, and
  observed the old cache removed, leaving `speak-page-actions-v3`.
- SHA-256 values of live and fresh-build root HTML, JS, CSS, hero, social art,
  and service worker are identical. Every extracted file from the live
  downloadable ZIP is identical to the fresh `dist` ZIP; only ZIP container
  timestamps differ.

## Headers, accessibility, and endpoint protection

- `/`, `/demo`, `/privacy`, and `/terms` return 200; unknown URLs return the
  styled 404 with HTTP 404. Valid route loads produced no console or page
  errors. All live pages checked have `lang=en`, one `<h1>`, one `<main>`,
  route-specific titles, and meaningful image alt text.
- The live response sends HSTS, `X-Content-Type-Options: nosniff`, strict
  origin referrer policy, and a response-header CSP with
  `frame-ancestors 'none'`. Hashed assets are immutable for one year; routes
  and worker use short revalidation caching.
- Playwright Axe found zero serious or critical violations across home, demo,
  privacy, terms, and 404 at 390 px in dark/reduced-motion mode, and across
  valid routes at desktop light mode. The full local suite also checks 44 px
  controls and focus behaviour.
- The documented license verification endpoint returned `valid:false` for a
  throwaway token. From one client it accepted 30 rapid requests, then request
  31 returned **429** with **`Retry-After: 4`**. Observed allowance: 30 rapid
  verification requests.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Release blocker | None |
| High | None |
| Medium | None |
| Low | None |

