# Polish 3 — cumulative zero-finding closure

Repair commit: `a8d2a706cb7cddc7b7e13210d1139c997bf7e39c`.
Deployment: `b5a989d9-3b35-4b38-b13e-475d18b49cc0`.
Live URL: <https://speak-page-actions.sociobot.in>.

Evidence paths are relative to the repository. `test-results/verify-live-3/cold-check.json`
is the automated cold-production replay. The live screenshots were taken in fresh
390×844 Chromium contexts after deployment.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Implicit and explicit form submits, image submits, and named sensitive controls require review. The packaged popup proves a submit cannot run before its dialog is confirmed. | `@claim:destructive-review`; live package hash in `cold-check.json`; `test-results/verify-live-3/home-390.png`; live `/` |
| F-1-2 | Pointer, Space, Enter, and pointer cancellation start and stop the held speech control with accurate `aria-pressed`. | `@claim:push-to-talk`; packaged extension from the live ZIP; `test-results/verify-live-3/home-390.png`; live download |
| F-1-3 | The phone demo puts all four sample controls and its seeded result before the command form. The last control and result are asserted inside 844px. | `@claim:sample-action`; `test-results/verify-live-3/demo-390.png`; live `/?demo=1` |
| F-1-4 | Reset and Start for real remove only `demo:spa:` keys. Start opens `/#install` and preserves non-demo sentinels. | `@claim:demo-isolation`; `demo reset and start for real clear only demo storage and lead to installation`; `demo-390.png`; live `/?demo=1` |
| F-1-5 | A recorded valid verification drives the real popup restore form, saves a command name, persists it, reloads the popup, and invokes the target control. | `@claim:pro-aliases`; `license-return-390.png`; live checkout, landing, and ZIP hash |
| F-1-6 | Empty extension storage drives a normal action and reaches review for a sensitive action without any license request. | `@claim:core-free`; `home-390.png`; live package hash |
| F-1-7 | Saved command names and license data use `chrome.storage.local`; sync storage stays empty. The website stores no returned token. | `@claim:extension-local-storage`; `license-return-390.png`; live `/privacy` and checkout return |
| F-1-8 | A complete packaged scan, typed action, spoken action, review, delete, and undo records no external page-data request. | `@claim:page-data-local`; `cold-check.json`; live `/privacy` and ZIP hash |
| F-1-9 | Privacy copy names only the explicit restore request. Its test records the encoded Sociobot URL and no other external request. | `@claim:license-verification`; `license-return-390.png`; live `/privacy` |
| F-1-10 | Unsupported merchant and refund assertions remain removed from Terms. | `all light site routes have no serious accessibility violations at phone width`; `cold-check.json`; live `/terms` |
| F-1-11 | Every client route updates title, description, canonical, Open Graph, and Twitter metadata on direct navigation. | `client routes set matching title, canonical, Open Graph, and Twitter metadata`; `cold-check.json`; live `/demo`, `/privacy`, `/terms` |
| F-1-12 | The phone hero hides decorative art and keeps the full demo action plus explanation above the 844px fold. | `landing first screen presents exactly three privacy, offline, and price facts`; `home-390.png`; live `/` |
| F-1-13 | WXT remains at 0.21.4 and the clean lockfile audit has no findings. | clean-clone `npm audit --audit-level=low`: 0; nonvisual; live ZIP matches the audited build |
| F-1-14 | Landing and README consistently use “visible control” and “command”; earlier product jargon is absent. | `npm run test:copy`; `home-390.png`; live `/` |
| F-1-15 | The demo action says it opens four controls without changing a real page. | `@claim:sample-action`; `home-390.png`; live `/` |
| F-1-16 | The preview heading is “Visible controls listed by the extension.” | route accessibility suite; `home-390.png`; live `/` |
| F-1-17 | Paid aliases are explained everywhere as saved command names for visible controls. | `@claim:pro-aliases`; `home-390.png`; live `/` |
| F-1-18 | The misleading website restore button is gone. The site now gives exact extension steps, and the extension action is “Restore Pro.” | `@claim:pro-aliases`; `license-return-390.png`; live checkout return and `/` |
| F-1-19 | README and site use “current page” consistently. | `npm run test:copy`; `home-390.png`; live `/` |
| F-1-20 | README explains the separate demo outcome before naming the `demo:spa:` verification prefix. | `@claim:demo-isolation`; `demo-390.png`; live `/?demo=1` |
| F-1-21 | README calls the artifact a Chrome extension ZIP. | `npm run test:copy`; nonvisual; live download returns 200 and matches local SHA-256 |
| F-1-22 | The 180×180 product-art Apple touch icon remains linked and package-checked. | `npm run test:package`; `404-390.png`; live `/` and unknown route |
| F-1-23 | The copy audit now covers 189 current route, popup, 404, state, and README rows. CI checks counts, banned words, and extracted-copy coverage. | `npm run test:copy`: 189 rows / 183 extracted strings; `home-390.png`; live copy rechecked |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | The first screen and install section state desktop Chrome/Chromium support, the phone limitation, and all five unpacked-install steps. | `@claim:desktop-chromium-only`; `home-390.png`; live `/` and live ZIP |
| F-2-2 | History entries retain scroll coordinates; Back and Forward restore route, h1 focus, and scroll. | `browser Back and Forward restore route focus and scroll position`; `cold-check.json`; live `/` → `/privacy` replay |
| F-2-3 | Pro evidence uses the actual popup verification, restore, save, reload, and command flow instead of pre-seeding storage. | `@claim:pro-aliases`; `license-return-390.png`; live checkout return and ZIP hash |
| F-2-4 | Free-core evidence launches the packaged extension with empty storage and drives its scan, action, and review UI. | `@claim:core-free`; `home-390.png`; live ZIP hash |
| F-2-5 | Privacy evidence records real extension requests and UI-created storage. Website coverage includes local/session/cookie/IndexedDB/Cache Storage. | `@claim:page-data-local`, `@claim:extension-local-storage`, `@claim:license-verification`; `license-return-390.png`; live `/privacy` |
| F-2-6 | Registry and tests cover links, labelled fields, every named sensitive category, typed fallback, and demo isolation. | `npm run test:registry`: 18 claims with one tagged test each; `demo-390.png`; live demo and package hash |
| F-2-7 | The first-screen price fact says “saved command names cost $12 once.” | first-screen test; `home-390.png`; live `/` |
| F-2-8 | The current audit includes all extracted landing, route, popup, 404, dynamic state, and README copy and fails CI on omissions or wrong counts. | `npm run test:copy`; `home-390.png`; live routes re-read |
| F-2-9 | The paid action says hosted checkout and the adjacent line names Dodo before navigation. | `@claim:pro-aliases`; `home-390.png`; live checkout returns 200 at Dodo |
| F-2-10 | Speech copy explains browser-side processing and the typed alternative without “on-device processing” or unexplained “push-to-talk” prose. | `@claim:on-device-speech`, `@claim:typed-command`; `home-390.png`; live `/` |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | The unusable website restore form and false success states are removed. Checkout return exposes a one-time focused copy handoff; the popup has a separate Restore Pro action before saving names. | `@claim:pro-aliases`; `license restore errors explain the next step and never save an invalid token`; `license-return-390.png`; live `/?license=cold-return-token` |
| F-3-2 | The website never verifies or stores a license. It strips the query, sends no referrer, never caches navigation URLs, and leaves all checked browser stores token-free. Privacy names the exact extension-only boundary. | `@claim:extension-local-storage`; `cold-check.json`; `license-return-390.png`; live `/privacy` and checkout return |
| F-3-3 | A declared platform claim now verifies the MV3 package, popup title/first screen, phone disclosure, download, and installation steps. | `@claim:desktop-chromium-only`; `home-390.png`; live `/` and live ZIP |

## Final verification

- Clean clone: `/tmp/speak-page-actions-polish-3-clean.xCfMTg` at repair commit.
- All 18 exact claim commands: pass independently.
- `npm test`: 5 Vitest and 32 Playwright tests pass.
- `npm run lint`, `npm run build`, `npm run test:package`: pass.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- Local verifier: no console errors; title/lang/h1/main/alt/button checks pass.
- Local Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.1s, CLS 0, TBT 30ms.
- Live Lighthouse: 100 in all four categories; LCP 1.5s, CLS 0, TBT 60ms, 149 KiB total transfer.
- Live cold replay: every route, demo flow, storage boundary, clipboard handoff, history/focus, internal link, checkout, 404, offline reload, CSP, light/dark Axe, and artifact hash passed with zero console errors.

No review finding remains open.
