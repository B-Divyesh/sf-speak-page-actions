# Independent verification 4 — PASS

**Candidate:** `615b75aa21707b1858f60f06d72ec0445fc135d1`
**Live URL:** <https://speak-page-actions.sociobot.in>
**Verified:** 2026-08-29 from a clean checkout

## Verdict

**PASS.** The live deployment matches the candidate byte-for-byte for the
shipped site assets and extracted extension package. All declared claims and
local quality gates pass. The real demo, privacy boundary, accessibility,
offline reload, checkout, and license-rate-limit checks all passed.

## Required first checks

### Claim matrix

After `npm ci`, I ran every exact command declared in
`.factory/claims.json`, using its Playwright demo/browser entry point. Each
passed. I also ran the complete `npm test` suite: 5 Vitest unit tests and 22
Playwright tests passed.

| Claims | Result |
| --- | --- |
| `sample-action`, `demo-local`, `offline-reload` | PASS |
| `active-tab-only`, `on-device-speech`, `destructive-review`, `undo-local-delete` | PASS |
| `visible-labels`, `password-exclusion`, `push-to-talk` | PASS |
| `pro-aliases`, `core-free`, `page-data-local` | PASS |

The individual `offline-reload` invocation was rerun after an initial local
test-server port collision caused by an overlapping verifier process; its
clean rerun passed. This was harness contention, not a product failure.

### Cold first read

Cold-loading the live home page at 390px gives a plain answer to all three
questions:

- **What:** “Speak the action you need” turns visible page labels into
  reviewable voice actions.
- **For whom:** people with limited vision or hand mobility.
- **First action:** **Try it with sample data**, immediately followed by
  “Opens a safe sample page in one click.”

It has the required three plain facts: page labels remain in the browser,
offline reload works after the first visit, and core actions are free while Pro
aliases cost $12 once. The one-click action opens `/demo`, with the persistent
“Demo — sample data, nothing is saved” banner, Reset demo, Start for real, and
the four-action checkout sample. This gate passes.

## Local quality gates

- `npm ci`: PASS. npm reported 10 audit advisories in development tooling (1
  low, 2 moderate, 4 high, 3 critical); there are no shipped runtime npm
  dependencies.
- `npm test`: PASS — 5 unit and 22 Playwright tests.
- `npm run test:unit`, `npm run typecheck`, and `npm run lint`: PASS.
- `npm run build`: PASS — creates `dist/site/` and `dist/extension/`.
- `npm run test:package`: PASS — the downloadable MV3 consumer archive has a
  valid manifest and no persistent content script or all-site host permission.
- Production build sizes: JS 11,747 B (4,576 B gzip), CSS 9,453 B (2,840 B
  gzip), hero WebP 142,634 B. JS and CSS are well under the stated budgets.

## Product and deployment evidence

- **Demo end to end:** `click save address` returned “Used Save address.” An
  invalid command returned the actionable no-match error. `click delete saved
  draft` showed a confirmation; Cancel produced “The action was not used.”;
  Confirm produced “Used Delete saved draft.”; Undo reported restoration;
  Reset restored all four sample actions and cleared demo storage.
- **Extension safety contract:** packaged MV3 has only `activeTab`,
  `scripting`, and `storage` permissions. It has no `content_scripts` block
  and no `<all_urls>` host permission. The collector excludes password fields,
  requires `processLocally` for speech, marks destructive labels for review,
  and only offers local synchronous-item undo. These behaviors are exercised
  by the passing claim tests.
- **Privacy:** a fresh live demo-flow request log had only
  `https://speak-page-actions.sociobot.in`; it made no analytics, third-party
  script/font, or API request. During use it stored only `demo:spa:sample`;
  after Reset storage was empty. The injected collector contains neither
  `fetch` nor `XMLHttpRequest`.
- **Offline and service worker:** after the first live demo visit, the service
  worker controlled the page with cache `speak-page-actions-v3`; `/demo`
  reloaded offline and retained its h1. The passing test suite also verifies
  removal of an old named cache after service-worker update.
- **Checkout and license:** the Buy link returned HTTP 303 to Dodo and a final
  HTTP 200 checkout containing `Speak Page Actions`, product
  `pdt_0NmQKji0raDAsy6yS95UP`, and `$12.00`. A throwaway license returned
  `{ "valid": false, "reason": "invalid" }` with CORS allowing the live
  origin. No sign-in is present.
- **Rate limit:** a single-client rapid verification burst received HTTP 429
  on request 30, after 29 successful requests in that burst, with
  `Retry-After: 3` and `X-RateLimit-After: 3`. The observed allowance is thus
  29 successful rapid verification requests before the temporary limit. No
  different numeric allowance is published in this repository.
- **Candidate/live identity:** live JS SHA-256
  `31d2e714eed4165f8fd0450d159443cdd2c504583b8c241243a28d3315d69865`
  and CSS SHA-256
  `6c3f6c1cafdd0d0164381c0aad5880f2fd199778abe1693753e9819193506b48`
  equal the fresh candidate build. Every extracted file in the downloadable
  live extension equals `dist/extension/` (ZIP container metadata excluded).

## Accessibility, keyboard, and headers

- On both desktop and 390px mobile, light and dark checks of `/`, `/demo`,
  `/privacy`, `/terms`, and the styled 404 found one h1 and one main each;
  Axe found zero serious or critical issues; all visible interactive controls
  measured at least 44 by 44 CSS px. Successful routes had no console or page
  errors. The intentional HTTP 404 alone logged Chromium’s expected failed
  document request.
- Keyboard Tab begins on **Skip to main content** with a visible `3px` cobalt
  focus outline. Keyboard Enter successfully runs the demo command; its tab
  order reaches all demo controls with no trap.
- With reduced motion, the demo had zero running animations and `0s`
  transition duration.
- `/opt/fleet/lib/verify-url.sh` passed on the live root: HTTP 200, 785 ms
  load, title, `lang=en`, one h1, main landmark, image alt text, named
  buttons, and no console errors.
- Live successful routes returned HTTP 200, unknown routes return the styled
  HTTP 404, the download/robots/sitemap return HTTP 200, and static assets use
  one-year immutable caching. Headers include HSTS, `nosniff`, strict-origin
  referrer policy, and a response-header CSP with `frame-ancestors 'none'`.

## Defects

No release-blocking, high, medium, or low product defects found.

The only non-product observation is the development dependency audit output
above. It should be handled in ordinary dependency maintenance, not by an
unreviewed forced upgrade in this verification.
