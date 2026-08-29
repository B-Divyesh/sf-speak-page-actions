# Polish 4 — cumulative finding closure

**Repair commit:** `5ea528baf9ed14ecee0665c11301fc5c5acc3f26`  
**Deployment:** Azure Static Web Apps deployment `af632617-33d0-4a9a-84be-e3fc97d46e32`  
**Live URL:** <https://speak-page-actions.sociobot.in>

## Evidence used for every row

- Clean clone: `/tmp/speak-page-actions-polish-4-clean.YQ8KAD`; `npm ci` had zero vulnerabilities and every one of the 18 exact registry commands passed independently (`ALL_CLAIMS_PASS 18`).
- Full suite: `CI=1 npm test` passed 5 Vitest and 32 Playwright tests. `npm run lint`, `npm run build`, `npm run test:package`, and `npm audit --audit-level=low` passed.
- Phone evidence: [home first screen](../test-results/polish-4/home-390-first-screen.png), [demo first screen](../test-results/polish-4/demo-390-first-screen.png), and deployed [cold home](../test-results/polish-4/verify-live/home-390.png).
- Live cold check: `BASE_URL=https://speak-page-actions.sociobot.in EVIDENCE_DIR=test-results/polish-4/verify-live npm run verify:live` passed route metadata, Axe, same-origin demo, reset/exit isolation, focus/scroll history, 404, offline reload, headers, and byte-identical site/ZIP artifacts. The focused deployed recheck is `test-results/polish-4/live-cold-recheck.json`.

| Finding | Change made | Evidence: test · screenshot · live check |
| --- | --- | --- |
| F-1-1 | Submit semantics use the button/input’s actual browser type at collection and activation. | `@claim:destructive-review` · `demo-390-first-screen.png` · live ZIP matches tested build. |
| F-1-2 | Popup holds speech for pointer, Space, and Enter; cancellation stops it. | `@claim:push-to-talk` · `home-390-first-screen.png` · live ZIP matches tested build. |
| F-1-3 | The direct demo seeds four checkout controls and a visible result before input. | `@claim:sample-action` · `demo-390-first-screen.png` · `/?demo=1` cold check passes. |
| F-1-4 | Reset and Start for real clear only `demo:spa:` keys; Start focuses installation. | `demo reset and start for real clear only demo storage and lead to installation` · `demo-390.png` · live demo reset/exit passes. |
| F-1-5 | Pro restores, saves, reloads, and invokes command names through the packaged popup. | `@claim:pro-aliases` · `home-390.png` · live ZIP matches tested build. |
| F-1-6 | Free normal actions and sensitive review run from the packaged popup with empty storage. | `@claim:core-free` · `home-390.png` · live ZIP matches tested build. |
| F-1-7 | License and command names are verified in extension-local storage; sync remains empty. | `@claim:extension-local-storage` · `privacy-390.png` · `/privacy` cold check passes. |
| F-1-8 | Full popup flows record no external page-label, transcript, or history requests. | `@claim:page-data-local` · `privacy-390.png` · live demo requests are same-origin. |
| F-1-9 | Privacy copy names only the explicit Pro verification request. | `@claim:license-verification` · `privacy-390.png` · `/privacy` cold check passes. |
| F-1-10 | Unsupported merchant/refund assertions were removed from Terms. | `CI=1 npm test` copy audit · `terms-390.png` · `/terms` metadata/Axe check passes. |
| F-1-11 | Client routes update title, description, canonical, OG, and Twitter fields. | `client routes set matching metadata` · `verify-live/home-390.png` · `/`, `/demo`, `/privacy`, `/terms` pass. |
| F-1-12 | The 390px hero keeps the sample action and its outcome inside the first viewport. | `landing first screen presents exactly three privacy, offline, and price facts` · `home-390-first-screen.png` · cold home check passes. |
| F-1-13 | Toolchain audit is clean. | `npm audit --audit-level=low` · n/a · tested release was deployed. |
| F-1-14 | Copy consistently uses “visible control” and “command.” | `npm run test:copy` · `home-390.png` · cold home text checked. |
| F-1-15 | The demo names four sample controls and says it does not change a real page. | `@claim:sample-action` · `demo-390-first-screen.png` · `/?demo=1` passes. |
| F-1-16 | The controls section heading is explicit out of context. | `npm run test:copy` · `home-390.png` · cold home check passes. |
| F-1-17 | Paid copy explains saved command names in plain words. | `@claim:pro-aliases` · `home-390.png` · live home check passes. |
| F-1-18 | The site truthfully hands a returned token to the extension; only the popup restores Pro. | `@claim:pro-aliases` · `verify-live/license-return-390.png` · storage-free handoff passes. |
| F-1-19 | README consistently says “current page.” | `npm run test:copy` · n/a · deployed README source is in matched ZIP. |
| F-1-20 | Demo copy explains separation before naming its storage prefix. | `@claim:demo-isolation` · `demo-390.png` · live reset/isolation passes. |
| F-1-21 | README calls the artifact a Chrome extension ZIP. | `npm run test:copy` · `home-390.png` · download ZIP returns and matches local. |
| F-1-22 | A linked 180px Apple touch icon ships with the site. | `npm run test:package` · `home-390.png` · live asset bundle matches local. |
| F-1-23 | The enforced audit covers rendered routes, popup states, 404, and README text. | `npm run test:copy` (190 rows/184 extracted strings) · `home-390.png` · deployed text is byte-matched. |
| F-2-1 | Desktop Chrome/Chromium limits and all Load unpacked steps are explicit. | `@claim:desktop-chromium-only` · `home-390.png` · mobile cold home check passes. |
| F-2-2 | History state saves/restores scroll and moves focus to each route h1. | `browser Back and Forward restore route focus and scroll position` · `verify-live/home-390.png` · live history check passes. |
| F-2-3 | The Pro test uses popup fields, a recorded verification response, reload, and invocation. | `@claim:pro-aliases` · `home-390.png` · live ZIP matches tested build. |
| F-2-4 | The free-core test uses popup scan, normal action, and review rather than the site demo. | `@claim:core-free` · `home-390.png` · live ZIP matches tested build. |
| F-2-5 | Privacy/storage/verification tests drive real UI and observe requests/storage. | `@claim:page-data-local`, `@claim:extension-local-storage`, `@claim:license-verification` · `privacy-390.png` · live privacy route passes. |
| F-2-6 | Claims exercise links, labelled fields, typed fallback, named sensitive controls, and demo isolation. | `@claim:visible-labels`, `@claim:typed-command`, `@claim:destructive-review`, `@claim:demo-isolation` · `demo-390.png` · live demo passes. |
| F-2-7 | The first-screen price fact says “saved command names.” | `landing first screen presents exactly three privacy, offline, and price facts` · `home-390-first-screen.png` · cold home check passes. |
| F-2-8 | CI verifies every stored word count and every extracted copy string. | `npm run test:copy` · `home-390.png` · deployed build matches local. |
| F-2-9 | Checkout action names the hosted destination and Dodo disclosure. | `@claim:pro-aliases` · `home-390.png` · live link check passes. |
| F-2-10 | Speech copy explains browser-local availability and typed fallback. | `@claim:on-device-speech`, `@claim:typed-command` · `home-390.png` · live home check passes. |
| F-3-1 | The website no longer pretends to activate Pro; it provides a focused token handoff and popup steps. | `@claim:pro-aliases` · `verify-live/license-return-390.png` · live handoff check passes. |
| F-3-2 | Checkout tokens do not enter site local/session storage, cookies, IndexedDB, or Cache Storage. | `@claim:extension-local-storage` · `verify-live/license-return-390.png` · live storage check passes. |
| F-3-3 | Platform support is a listed, packaged-extension and mobile-site claim. | `@claim:desktop-chromium-only` · `home-390-first-screen.png` · cold home check passes. |
| F-4-1 | A single conservative policy now reviews cancel subscription, unsubscribe, archive, deactivate, close account, and comparable account/plan-ending labels at collection and activation. It is documented on home, Privacy, and README. | `@claim:destructive-review` proves each label does not fire before review and does fire after confirmation through the packaged popup · `verify-live/home-390.png` · `live-cold-recheck.json` confirms deployed wording; `verify-live` confirms the live ZIP is the tested artifact. |

## Result

All 37 reviewed findings now have an implemented behavior and a reproducible test or direct live check. No TODO, stub, deferred minor item, or known gap remains.
