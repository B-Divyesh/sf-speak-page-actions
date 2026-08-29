# Independent verification 5 — PASS

**Candidate:** `4c8ed626502a710ac8ffc286c01a4971e9f3ada0`
**Live URL:** <https://speak-page-actions.sociobot.in>
**Verified:** 2026-08-29 from a clean checkout

## Verdict

**PASS.** The required claim suite, complete automated suite, type/lint/package
checks, production build, live functional checks, privacy checks, accessibility
checks, and license rate-limit check all passed. The live site is the tested
candidate: root HTML, JS, CSS, hero art, and service worker have identical
SHA-256 values; every file extracted from the live extension ZIP is identical
to the fresh candidate build. The ZIP container bytes differ only because its
entry timestamps are 07:40 on live and 08:01 locally.

## Mandatory first checks

### Claims

`.factory/claims.json` exists and declares 15 claims. After `npm ci`, I ran
every exact command in it individually, through the product's test/demo entry
point. All passed:

| Claim IDs | Result |
| --- | --- |
| `sample-action`, `demo-local`, `offline-reload` | PASS |
| `active-tab-only`, `on-device-speech`, `destructive-review`, `undo-local-delete` | PASS |
| `visible-labels`, `password-exclusion`, `push-to-talk` | PASS |
| `pro-aliases`, `core-free`, `page-data-local`, `extension-local-storage`, `license-verification` | PASS |

### Cold first read

Cold-loading the live desktop page answers the required questions in plain
words. It says that Speak Page Actions lets a person **speak or type a visible
control's name**, that it is **for people with limited vision or hand
mobility**, and that the first action is **Try it with sample data**. The
adjacent explanation says it opens four sample controls without changing a
real page. The one-click action opens `/demo` with the persistent
“Demo — sample data, nothing is saved” banner, Reset demo, Start for real,
and four realistic sample controls. This acceptance gate passes. Cold-page
evidence: `.factory/cold-live-desktop.png`.

## Local quality gates

- `npm ci`: PASS; 0 vulnerabilities reported.
- `CI=1 npm test`: PASS — 5 Vitest unit tests and 26 Playwright tests.
- `npm run test:unit`, `npm run typecheck`, `npm run lint`, and
  `npm run test:package`: PASS.
- `npm run build`: PASS; produces `dist/site/` and `dist/extension/`.
- Production site bundle: JS 12,919 B / 4,790 B gzip; CSS 10,150 B / 2,960 B
  gzip; hero WebP 142,634 B. All are within the stated budgets.
- The packaged MV3 manifest has only `activeTab`, `scripting`, and `storage`;
  it has no persistent `content_scripts` block or broad `<all_urls>` host
  permission.

## Product behaviour and privacy

- At live 390×844, a typed normal command returned “Used Save address.” An
  unmatched command returned the actionable no-match error. Deleting a sample
  first showed review; Cancel left it unused; Confirm used it; Undo returned
  “Undid Delete saved draft in the sample.”
- Start for real removed only `demo:spa:` storage and preserved separate test
  real-setting/license keys. A fresh demo flow stored only `demo:spa:sample`.
- A fresh live demo request log contained only
  `https://speak-page-actions.sociobot.in`; no analytics, font CDN, third-party
  script, or page-data request occurred. Source/package inspection confirms
  the page collector has no `fetch` or `XMLHttpRequest`; the only extension
  external request is the disclosed encoded license verification call to
  `api.sociobot.in`.
- After its first visit, live `/demo` was controlled by
  `speak-page-actions-v3` and reloaded offline with its demo heading intact.
  The full suite also passed the old-cache removal/update test.
- The claim suite exercises visible-label collection, password exclusion,
  typed fallback when on-device speech is unavailable, pointer/Space/Enter
  push-to-talk, sensitive review, local delete undo, aliases, and free core
  actions against the packaged extension/page-agent behaviour.

## Live deployment, headers, links, and rate limit

- Live `/`, `/demo`, `/privacy`, `/terms`, download, `robots.txt`, and
  `sitemap.xml` returned 200. An unknown route returned the designed HTTP 404.
  All landing links, including checkout, resolve successfully; checkout ends
  at the hosted Dodo session.
- Header checks found HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and response-header CSP with `frame-ancestors 'none'`.
  Hashed JS has `Cache-Control: public, max-age=31536000, immutable`; root and
  routes use short revalidation caching. Valid routes had no page or console
  errors in a cold context.
- License verification with an invalid throwaway token returned the documented
  invalid JSON response. A single-client burst received 200 for requests 1–30,
  then HTTP **429** on request 31 with **`Retry-After: 4`**. Observed allowance:
  30 rapid verification requests before temporary rate limiting.
- Candidate/live identity: root HTML and each shipped JS/CSS/art/service-worker
  file match SHA-256. Local and live ZIP files have the same 21 extracted files
  and matching hashes; only archive timestamps differ.

## Accessibility and interaction checks

- Axe found zero serious or critical findings on `/`, `/demo`, `/privacy`,
  `/terms`, and the 404 at 390px in dark/reduced-motion context.
- The keyboard's first Tab reaches Skip to main content with a visible cobalt
  `3px` outline. Enter runs the sample command. The existing complete suite
  also checks 44px controls across all routes and the extension popup.
- The reduced-motion demo had no page errors or active animation regression.
  Mobile visual evidence: `.factory/live-demo-390-qa.png`.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Release blocker | None |
| High | None |
| Medium | None |
| Low | None |

The test-only live ZIP byte hash difference is not a product defect: extracted
contents are identical and the archive listing shows timestamp-only variance.
