# Independent verification 10 — FAIL

**Candidate:** `8de7239e24afed856c129972214c833c48f05da7`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC from a clean checkout  
**Verdict:** **FAIL — do not accept this candidate.**

The deployed site and downloadable extension match the candidate build, the
declared claims and repository gates pass after a clean install, and the prior
checkout deployment failure is resolved. Independent boundary testing found a
release-blocking defect in the core extension: it advertises invisible and
disabled controls as usable page actions. It also reports success after trying
to activate a disabled control even though the page receives no click.

## Required first checks

### Claim registry

`.factory/claims.json` exists and declares 19 claims. After `npm ci`, I ran
every declared command separately through its demo or packaged-extension entry
point. All 19 passed:

`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`,
`destructive-review`, `financial-page-exclusion`, `undo-local-delete`,
`visible-labels`, `password-exclusion`, `push-to-talk`, `pro-aliases`,
`core-free`, `page-data-local`, `extension-local-storage`,
`license-verification`, and `desktop-chromium-only`.

Each command exited 0. The complete test run also passed 16 Vitest assertions
and 33 Playwright tests. The independent defect below demonstrates that the
`visible-labels` claim test does not cover important hidden and disabled
boundaries; its happy-path result is not sufficient evidence for the claim.

### Cold first read

The live first viewport passes the mandatory first-read test:

- What it does: “say or type a visible control’s name.”
- Who it serves: “people with limited vision or hand mobility.”
- What to click first: **Try it with sample data**.
- The adjacent result says it opens four sample controls without changing a
  real page. One click opens `/?demo=1` with the persistent “Demo — sample
  data, nothing is saved” banner, Reset demo, Start for real, four controls,
  and a seeded result.

At 390×844, the action ends at 508.5 px and all three privacy/offline/price
facts end at 695.5 px, so the complete required first-screen content is visible.

## Findings by severity

### High — the extension lists invisible and disabled controls, then reports a false success

This violates the researched brief's smallest useful product (“enumerates
visible, labelled buttons/links/form fields”) and the public claim that the
extension lists visible controls.

I ran the candidate's actual `installPageAgent` function in Chromium against a
boundary fixture containing one visible button plus off-screen, `opacity: 0`,
ancestor-`aria-hidden`, native-disabled, ARIA-disabled, ancestor-hidden, and
zero-sized buttons. The collector correctly omitted the last two, but returned
all of these as actions:

```text
Visible action
Offscreen action
Transparent action
Aria hidden action
Disabled action
ARIA disabled action
```

The cause is the visibility predicate at `src/lib/page-agent.ts:40`, which
checks only `visibility`, `display`, width, and height. Collection at line 76
does not check viewport intersection, opacity, hidden ancestors, `disabled`, or
`aria-disabled`.

A second fixture attached click counters to a disabled and enabled button. The
collector listed both. Activating the disabled action returned:

```json
{"ok":true,"message":"Used Save disabled draft.","canUndo":false}
```

The page click count remained `0`; activating the enabled control changed it to
`1`. The unconditional `element.click()` and success response are at
`src/lib/page-agent.ts:107-115`. A person using speech can therefore hear that
an action succeeded when nothing happened, and can be offered labels that are
not visible to them at all. This is a release blocker for the core job.

### Medium — an empty demo command silently runs “Save address”

On a fresh live `/demo`, I left **Type a command for the sample** empty and
clicked **Run command**. The status changed from “Found four visible controls
on Sample checkout.” to **“Used Save address.”**, and `demo:spa:sample` was
written to local storage.

At `src/site/main.ts:41`, `label.includes(target)` is true for the empty string,
so the first sample action is selected. The real extension rejects an empty
target, but the required one-click sandbox is presented as testing “the same
command.” It must report a clear input error and leave sample state unchanged.

## Clean build and repository gates

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 176 packages, 0 audit vulnerabilities |
| Every exact `.factory/claims.json` command | Pass; 19/19 |
| `CI=1 npm test` | Pass; 16 Vitest and 33 Playwright tests |
| `npm run test:unit` | Pass; 16 tests |
| `npm run test:claims` | Pass; 33 tests |
| `npm run test:copy` | Pass; 194 rows cover 187 strings |
| `npm run test:registry` | Pass; 19 claims, one tagged test each |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass; creates `dist/site` and `dist/extension` |
| `npm run test:package` | Pass |
| `npm run test:zip-contents` | Pass |
| `npm run verify:live` | Pass; live assets and 23 ZIP members match |

The fresh site build contains 14,190 B JS (5,169 B gzip), 11,288 B CSS
(3,212 B gzip), and a 142,634 B hero WebP. These are below the 200 KB JS,
50 KB CSS, and 300 KB hero budgets. The downloadable MV3 ZIP is 342,212 B.

## End-to-end and error-path evidence

- A normal typed sample command produced “Used Save address.”
- A 1,024-character unmatched command produced “No visible action matched.
  Use a label from the list.” and the interface remained usable.
- Canceling review for Delete saved draft produced “The action was not used.”
- Accepting review produced “Used Delete saved draft.”; Undo then produced
  “Undid Delete saved draft in the sample.”
- Reset demo removed all `demo:spa:` storage. Start for real retained seeded
  non-demo sentinels and focused the installation section.
- The packaged-extension suite exercised typed and push-to-talk commands,
  review for every documented sensitive action, undo of a complete removed
  list item, password exclusion, financial-page blocking, invalid/offline
  license recovery, and browser-local Pro aliases.
- The production manifest is MV3 with only `activeTab`, `scripting`, and
  `storage`; its sole host permission is `https://api.sociobot.in/*`. There is
  no persistent content script or all-sites host permission.

## Accessibility, responsive behavior, and browser quality

- At 390×844, `/`, `/demo`, `/privacy`, `/terms`, and the styled HTTP 404 have
  `lang=en`, one h1, one main, no horizontal overflow, and no visible target
  below 44×44 CSS px.
- Independent Axe runs found zero serious or critical findings on those five
  pages in light mode and again in dark/reduced-motion mode.
- The first Tab focuses **Skip to main content** with a designed
  `rgb(21, 91, 140) solid 3px` outline. Fourteen Tabs traversed the header,
  demo banner, all four sample controls, command field, Run command, and footer
  without a trap; every focused item retained the 3 px outline.
- Reduced-motion contexts had zero running animations on every route. Valid
  routes produced no console or page errors. The intentional 404 navigation
  produces only Chromium's expected failed-document console message.
- Mobile and desktop screenshots were visually inspected. The 390 px first
  screen is legible and complete; the desktop hierarchy and original
  halftone illustration match `.factory/design.md`.
- Fresh mobile Lighthouse: performance 96, accessibility 100, best practices
  100, SEO 100; FCP 767 ms, LCP 1,512 ms, CLS 0, total transfer 152,775 B.

## Privacy, offline behavior, headers, and caching

A Playwright context recorded the complete live demo flow, including service
worker installation, a normal command, invalid recovery, and reset. All 16
requests were same-origin. They were only the document, local JS/CSS, service
worker, four local shell routes, and local hero image. After Reset demo, local
storage was empty. No analytics, font CDN, third-party script, or API call was
made.

The website checkout-return flow also passed: the license query value is
removed from the URL, presented for copying, focused, and absent from website
local/session storage, cookies, IndexedDB, and Cache Storage. The extension's
separate claim flow sends an encoded token only to the documented Sociobot
verification endpoint. There is no sign-in flow, so the Entra tenant rule is
not applicable.

Browser response headers confirm:

- HTML: `Cache-Control: public, must-revalidate, max-age=30`.
- Hashed JS/CSS: `Cache-Control: public, max-age=31536000, immutable`.
- HSTS with subdomains/preload, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, and a self-only CSP with
  `frame-ancestors 'none'` and the intended Sociobot form-action exception.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
  the designed page with HTTP 404; the ZIP, robots, and sitemap return 200.

After a first visit, live `/demo` reloaded offline with HTTP 200 and remained
service-worker controlled. The active cache was `speak-page-actions-v4`. A
fresh update registration activated and removed a seeded old
`speak-page-actions-v2` cache.

## Billing endpoint and deployment identity

The earlier deployment-only checkout failure is resolved. A fresh request to
`https://api.sociobot.in/api/v1/products/speak-page-actions/checkout` returned
303 to `checkout.dodopayments.com`; the final page returned 200 and contained
the product name, `$12.00`, and product id `pdt_0NmQKji0raDAsy6yS95UP`.

From one client, 30 distinct invalid license verification requests returned
200. Request 31 returned **429** with **`Retry-After: 4`**; all remaining 14 in
the probe were also 429. Observed allowance: **30 requests per short window**.
The endpoint's CORS response allowed the live product origin.

`npm run verify:live` compared the fresh candidate build with production. The
live HTML-referenced JS/CSS match local SHA-256 values, and every name and byte
in all 23 extracted extension ZIP members matches. Candidate and live product
identity therefore passes; the FAIL is due to behavior present in both.

## Required disposition

Do not release as accepted. Exclude controls that are not actually perceivable
or operable, revalidate those conditions immediately before activation, and do
not report success unless the action can run. Add boundary cases to the
`visible-labels` claim test. Reject empty demo commands with a specific error
and no state change, then rerun every claim and the independent end-to-end
checks.
