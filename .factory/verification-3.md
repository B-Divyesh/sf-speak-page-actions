# Independent verification 3 — FAIL

**Candidate:** `72c328cd73e1abe5f4cb96a9800bfc4a0acf7fcb`  
**Live URL:** https://speak-page-actions.sociobot.in  
**Verified:** 2026-08-29 from a clean checkout

## Verdict

**FAIL — do not release as accepted.** The static site and packaged extension
match the candidate and the free product works end to end. However, the public
`Buy a $12 pro license` link returns HTTP **404** from the required Sociobot
billing endpoint, so the advertised paid feature cannot be purchased. This is
a release-blocking live deployment/product-registration defect.

## Required first checks

### Claim tests

After `npm ci`, I ran each exact `test` command in `.factory/claims.json`, from
a clean state and through the demo/browser test entry point. Every command
passed. A subsequent complete `npm test` run passed all 5 unit and 20
Playwright tests.

| Claims | Result |
| --- | --- |
| `sample-action`, `demo-local`, `offline-reload` | PASS |
| `active-tab-only`, `on-device-speech`, `destructive-review`, `undo-local-delete` | PASS |
| `visible-labels`, `password-exclusion`, `push-to-talk` | PASS |
| `pro-aliases`, `core-free`, `page-data-local` | PASS |

### Cold first read

On a fresh desktop browser visit, the first screen says: “Speak the action you
need.” It explains that it turns visible page labels into reviewable voice
actions “for people with limited vision or hand mobility,” and its first action
is **Try it with sample data**, adjacent to “Opens a safe sample page in one
click.” It opens `/demo` immediately with a persistent sample-data banner and
four realistic controls. This first-read and one-click-demo gate **passes**.

## Local quality gates

- `npm ci`: PASS. npm reports 10 development-tool audit advisories (1 low, 2
  moderate, 4 high, 3 critical); this project has no shipped runtime package
  dependencies.
- `npm test`: PASS — 5 unit tests and 20 Playwright tests.
- `npm run test:unit`: PASS — 5 tests.
- `npm run typecheck` and `npm run lint`: PASS.
- `npm run build`: PASS — produces `dist/site/` and `dist/extension/`.
- `npm run test:package`: PASS — validates the consumer MV3 archive.
- Production assets: 11,648 B JS (4,544 B gzip), 9,453 B CSS (2,846 B gzip),
  and 142,634 B hero WebP. The static JS/CSS budgets pass.
- No `verify-url.sh` exists in this checkout, so its requested title/lang/main/
  alt/console coverage was independently performed in Playwright against the
  live routes (and passed for all successful routes).

## End-to-end evidence

- Demo flow: normal `click save address` succeeds; an invalid command reports
  “No visible action matched. Use a label from the list.”; destructive `click
  delete saved draft` offers confirmation, cancel recovers cleanly, accept
  succeeds, Undo reports restoration, and Reset restores all four actions.
- Offline/PWA: after the first live `/demo` load, the service worker controlled
  the page and `/demo` reloaded offline with its heading present. The committed
  test also verifies removal of an old named cache on service-worker update.
- Keyboard/mobile: at 390 px every visible control on `/`, `/demo`, `/privacy`,
  `/terms`, and the HTTP 404 document measured at least 44 by 44 CSS px. Tab
  began at Skip to main content and proceeded through all demo controls without
  a trap; focused controls had a `rgb(21, 91, 140) solid 3px` outline. Normal
  demo command entry was exercised by keyboard Enter.
- Accessibility: Axe at 390 px in light and dark schemes found no serious or
  critical violations on `/`, `/demo`, `/privacy`, `/terms`, and the 404 page.
  Each has one h1. Successful routes had no console or page errors. The 404
  navigation logs only Chromium's expected failed-document message for its
  intentional HTTP 404 status.
- Reduced motion: with `prefers-reduced-motion: reduce`, the live site reported
  no running animations and no transition on the hero.
- Privacy: the full live demo-flow request log contained only the product
  origin. It made no third-party font, script, analytics, or API request; after
  reset its localStorage was empty (during use, demo data is isolated under
  `demo:spa:`). The extension package has `activeTab`, `scripting`, and
  `storage`, no persistent content script and no all-site host permission.
  Its injected collector contains no fetch/XMLHttpRequest; masked password
  controls are excluded and spoken commands require `processLocally`.
- Headers/caching: successful live routes are 200 and unknown routes return the
  styled 404 document with HTTP 404. Responses have HSTS, `nosniff`, strict
  origin referrer policy, and a restrictive self-only CSP with the intentional
  Sociobot API `connect-src`. Hashed JS/CSS use one-year immutable cache
  headers. `/robots.txt`, `/sitemap.xml`, and the extension download return
  200.
- Candidate/live identity: live JS SHA-256 is
  `b558dfeb3a55804f2175333266bd5faac94f577fa3e75501c197a01bff7a7353`
  and live CSS SHA-256 is
  `6c3f6c1cafdd0d0164381c0aad5880f2fd199778abe1693753e9819193506b48`,
  both equal the fresh candidate build. The downloadable ZIP byte hash differs
  because ZIP metadata is nondeterministic, but every extracted file hash,
  including manifest, popup bundle, assets, and service worker, exactly equals
  the fresh `dist/extension` package.
- Sign-in is not present. The license verification endpoint accepts the live
  origin and returns the expected invalid-token response for a throwaway token.
  It allowed 30 requests in one burst; request 31 returned HTTP 429 with
  `Retry-After: 3` (later blocked requests returned 2), so the observed
  allowance is 30 requests per short window. No numeric allowance is documented
  in the repository.

## Defects

### High — advertised Pro checkout is a dead link (release blocker)

The landing page links **Buy a $12 pro license** to
`https://api.sociobot.in/api/v1/products/speak-page-actions/checkout`. A fresh
GET returns HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The visible price and claim that a one-time Pro license adds local aliases are
therefore not fulfilable. The product must be registered/enabled in the
Sociobot billing service and this exact checkout request must redirect to a
working hosted checkout before release. The free core remains usable, but this
is still a dead public product link and fails the paid-unlock contract.

### Medium — CSP omits `frame-ancestors`

The live CSP is delivered as a response header (good), but it does not include
the required `frame-ancestors` directive. Add an appropriate response-header
directive, normally `frame-ancestors 'none'`, to prevent framing/clickjacking.

### Medium — first screen does not present the required three plain facts

The landing hero has two facts: “On-device speech or typed commands” and
“Visible labels only.” The site-structure contract requires three short facts
covering privacy, offline behaviour, and price. Add accurate, claim-tested
facts without displacing the already-clear demo action.

## Acceptance disposition

The previous deployment-only concerns about mobile targets, HTTP 404 routing,
download availability, and candidate/live asset identity are resolved in this
candidate. The payment integration is freshly broken in production, so this
candidate is **FAIL** until the checkout endpoint is live and the listed
contract gaps are corrected and independently rechecked.
