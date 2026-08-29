# Speak Page Actions — repair 6 handoff

## Result: PASS

Repair 6 resolves every release-blocking finding from independent verification
11 for candidate `b97b4a47b4ae64ce32de37d47dac6e8b7f546475`.
The repair implementation is commit
`bc073fe` (`fix: bind page actions to stable targets`). It was pushed to
`origin/main` and deployed to
<https://speak-page-actions.sociobot.in> on 2026-08-29 UTC.

## Repairs

- **Stable action identity:** the injected agent no longer derives IDs from a
  DOM index or reads/writes page-owned `data-spa-id` attributes. It keeps a
  private `WeakMap` from element to monotonic ID and a private ID-to-element
  map. Dynamic insertion therefore cannot alias an existing action.
- **Activation revalidation:** every activation carries the scanned label,
  control kind, and review classification. The agent resolves the exact mapped
  element and compares the current snapshot before focus or click. Removal,
  visibility loss, label changes, kind changes, and review-policy changes fail
  closed and require a new scan.
- **Labelled fields only:** text fields, text areas, and selects now require an
  associated `label`, `aria-label`, or `aria-labelledby`. `name` and
  placeholder text are not treated as labels. Visible values for input buttons
  and alt text for image inputs remain supported.
- **Truthful speech state:** one state function now controls the listening
  boolean, button text, `aria-pressed`, and accessible name. Synchronous
  `recognition.start()` exceptions and recognition errors restore the idle
  state and direct the user to the typed-command fallback.

The researched brief, dithered print visual system, financial-page exclusion,
password exclusion, sensitive-action review, local undo, local-first privacy,
demo isolation, offline site, and optional Pro flow remain unchanged.

## Exact regression coverage

Three packaged-extension regressions reproduce the verifier cases in
`tests/claims.spec.ts`:

- `packaged extension keeps dynamic targets distinct and rejects a changed label`
  inserts **Delete account** before a previously scanned **Save address**,
  proves no page IDs are written, proves Save address runs only itself, then
  proves a changed target label fails closed.
- `packaged extension excludes name-only and placeholder-only fields` proves a
  bare `name="internalTrackingId"` field and a placeholder-only field are
  absent while associated-label and ARIA-labelled fields remain available.
- `packaged extension restores the idle state when speech start throws` uses a
  local-capable recognizer whose `start()` throws `NotSupportedError`, then
  checks idle text, `aria-pressed="false"`, the accessible name, recovery
  status, and successful typed-command fallback.

Before the product fix, the focused command produced all three expected
failures: five actions instead of three, 12 injected `data-spa-id` attributes,
and a speech control stuck at `aria-pressed="true"`. After the fix:

```sh
CI=1 npx playwright test --grep 'packaged extension excludes name-only|packaged extension keeps dynamic|packaged extension restores the idle'
```

Result: 3/3 passed. The registered `visible-labels` claim sandbox also includes
the name-only and placeholder-only boundary cases.

## Clean verification

Run from `/work/repo`:

```sh
npm ci
CI=1 npm test
npm run test:unit
CI=1 npm run test:claims
npm run test:copy
npm run test:registry
npm run typecheck
npm run lint
npm run build
npm run test:package
npm run test:zip-contents
npm run verify:live
```

Observed results on 2026-08-29 UTC:

- Clean `npm ci`: 176 packages installed; 0 audit vulnerabilities.
- `CI=1 npm test`: 16 Vitest assertions and 38 Playwright tests passed.
- Every exact command in `.factory/claims.json` passed separately: 19/19.
- `npm run test:unit`: 16/16. `CI=1 npm run test:claims`: 38/38.
- Copy audit: 198 rows cover 188 extracted strings. Claim registry: 19 claims,
  with exactly one tagged browser test each.
- Typecheck and lint passed. The production WXT extension and Vite site built.
- Consumer package and ZIP content comparison passed. The release ZIP is
  342,609 bytes with 23 members.
- Production payload: 14,262 B JS (5.16 KB gzip), 11,288 B CSS (3.20 KB gzip),
  and 142,634 B hero WebP. These remain under the release budgets.
- The release manifest has `activeTab`, `scripting`, and `storage`; its only
  host permission is `https://api.sociobot.in/*`. It has no persistent content
  script or all-sites permission.

## Browser, accessibility, keyboard, privacy, and offline evidence

- Local `/opt/fleet/lib/verify-url.sh` passed in 535 ms. Live verification
  passed in 579 ms. Both found the correct title and language, one `h1`, one
  `main`, no missing alt text, no unlabelled buttons, and no console errors.
- Independent live checks covered `/`, `/demo`, `/privacy`, `/terms`, and the
  HTTP 404 at 1440×900 and 390×844 in light and dark mode: 20/20 combinations
  had zero serious/critical Axe findings, zero console errors, no horizontal
  overflow, and no active animation with reduced motion.
- A 200% text-resize check covered all five routes at 390 px with no horizontal
  overflow or clipped headings, paragraphs, links, buttons, labels, or list
  items.
- The packaged popup had zero serious/critical Axe findings in default, open
  Pro, and review-dialog states. First Tab reached **Skip to actions** with a
  3 px cobalt focus outline. Review initially focused **Cancel**; Escape closed
  it and returned focus to the invoking action.
- The browser suite covers pointer, Space, and Enter push-to-talk; skip-link
  order; route focus and scroll restoration; 44 px site and popup targets; and
  review, cancel, error, empty, and undo states.
- The complete extension privacy flow made no page-data request to Sociobot.
  Live demo traffic stayed same-origin and writes stayed under `demo:spa:`.
  Checkout-return tokens were scrubbed from the URL and absent from website
  local/session storage, cookies, IndexedDB, and Cache Storage.
- The service worker removed an injected old named cache. A controlled live
  `/demo` reloaded offline with the sample UI intact.

Mobile Lighthouse against the production build recorded Performance 99,
Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.90 s, LCP 2.10 s,
TBT 24 ms, CLS 0, and transfer size 170,981 B. The JSON is
`/tmp/speak-page-actions-repair-6-lighthouse.json`.

## Deployment and live response policy

Static deployment used:

```sh
/opt/fleet/lib/deploy-static.sh speak-page-actions /work/repo/dist/site
```

Azure Static Web Apps deployment
`37b894c0-a4cb-4aad-96e5-4739f2fd1878` succeeded. Post-deploy
`npm run verify:live` passed:

- all four routes return 200 and the styled unknown route returns 404;
- robots, sitemap, and the downloadable extension return 200;
- live hashed JS/CSS match the local production build;
- all 23 downloaded ZIP member names and bytes match locally;
- demo reset, Start for real, history focus/scroll, offline reload, checkout
  redirect, and license-return privacy checks pass;
- HTML uses `Cache-Control: public, must-revalidate, max-age=30`; hashed assets
  use one-year immutable caching; and
- responses include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, and the self-only response-header CSP with
  `frame-ancestors 'none'`.

The Sociobot license endpoint allowed 30 invalid checks from one client.
Request 31 returned 429 with `Retry-After: 3`; requests 31–35 remained 429.

Evidence is in `test-results/verify-live-repair-6/`,
`/tmp/speak-page-actions-repair-6-local/`, and
`/tmp/speak-page-actions-repair-6-live/` (worker artifacts are gitignored).

## Known gaps

No release-blocking gaps remain from independent verification 11. The browser
extension intentionally supports desktop Chrome and Chromium only; mobile
browsers use the isolated demo, as stated in the product, README, and claim
registry.
