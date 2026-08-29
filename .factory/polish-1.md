# Polish 1 — cumulative finding closure

Candidate repaired from `c220b7a8f027a5ab8117fa9f058bdb31ceb602e5`. Evidence
paths are relative to the repository unless a live URL is stated.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Form-owned implicit submit buttons, explicit submits, and image submits now require confirmation in the injected agent; unconfirmed activation returns `needsReview`. | `@claim:destructive-review`; `tests/claims.spec.ts`; package build |
| F-1-2 | Space and Enter now both start on key press and stop on release, with pointer cancellation and accurate `aria-pressed` state. | `@claim:push-to-talk` runs against the packaged extension with a recognizer stub |
| F-1-3 | The demo puts its four controls and seeded “Found four visible controls” result before the command form. | `@claim:sample-action`; [mobile demo screenshot](../test-results/polish-1-demo-390.png) |
| F-1-4 | Reset and Start for real remove every `demo:spa:` key. Start for real opens the installation section while preserving real settings and license keys. | `demo reset and start for real clear only demo storage and lead to installation` |
| F-1-5 | The Pro claim now checks actual MV3 local storage, maps a saved command name to a real sample control, activates it, and checks the hosted $12 checkout. | `@claim:pro-aliases` |
| F-1-6 | The free-core claim uses the extension page agent to activate a normal control and reach review for a sensitive one without license state. | `@claim:core-free` |
| F-1-7 | Privacy copy names browser-local extension storage and the claim verifies `chrome.storage.local` keys and no sync API. | `@claim:extension-local-storage` |
| F-1-8 | Privacy copy is split into a page-data boundary and the license-verification boundary; collector and bundled popup checks cover both. | `@claim:page-data-local`, `@claim:license-verification` |
| F-1-9 | The untestable “only” wording was replaced with the specific, tested verification action. | `@claim:license-verification` |
| F-1-10 | Unsupported merchant/refund assertions were removed from Terms. | Terms route test and copy audit |
| F-1-11 | Route changes now set title, description, canonical, Open Graph, and Twitter fields. | `client routes set matching title, canonical, Open Graph, and Twitter metadata` |
| F-1-12 | Phone hero hides decorative art and compresses spacing so the primary action and its explanation fit inside 390×844. | `landing first screen presents exactly three privacy, offline, and price facts`; [mobile home screenshot](../test-results/polish-1-home-390.png) |
| F-1-13 | WXT was updated from 0.20.0 to 0.21.4; lockfile now has zero npm audit findings. | `npm audit --json` returns 0 low/moderate/high/critical |
| F-1-14 | Copy now consistently uses “visible control” and “command”; jargon was removed from the first screen and README. | `.factory/copy-audit.md` |
| F-1-15 | The demo action says exactly what opens and that no real page changes. | `@claim:sample-action`; copy audit |
| F-1-16 | The preview heading is “Visible controls listed by the extension.” | accessibility route coverage; copy audit |
| F-1-17 | “Aliases” is explained as saved command names in landing, README, Terms, and popup. | `@claim:pro-aliases`; copy audit |
| F-1-18 | The reveal action is correctly named “Restore a license.” | `@claim:pro-aliases`; 44px controls test |
| F-1-19 | README and site consistently say “current page.” | `.factory/copy-audit.md` |
| F-1-20 | README explains the separate storage outcome before the verification key prefix. | `.factory/copy-audit.md` |
| F-1-21 | README package-check comment now says “Chrome extension ZIP.” | `.factory/copy-audit.md` |
| F-1-22 | A product-art-derived 180×180 PNG Apple touch icon is linked on landing and 404 and checked by the package test. | `npm run test:package` |
| F-1-23 | Copy audit now covers rendered routes, popup, README, headings, labels, states, word counts, and terminology. | `.factory/copy-audit.md` |

Earlier verification records were also reread. Their resolved routing, offline,
CSP, download, checkout, focus, and package findings remain covered by the full
browser suite and `npm run test:package`; no earlier `.factory/polish-*.md`
existed.

## Verification summary

- `npm run typecheck`, `npm run build`, `npm test`, and `npm run test:package`: pass.
- All 15 exact `claims.json` commands were run independently after `npm ci`.
- Playwright: 5 unit and 26 browser tests pass, including serious/critical Axe
  checks at phone size and all routes in dark mode.
- Local `verify-url.sh`: HTTP 200, 541ms, one h1/main, title/lang/alt/button
  checks, and no console errors; output at `test-results/verify-local/`.
- Lighthouse local static preview: Performance 100, Accessibility 100;
  `test-results/lighthouse-local.json`.
- `npm audit --json`: 0 findings.

Live recheck is recorded in the handoff after deployment.
