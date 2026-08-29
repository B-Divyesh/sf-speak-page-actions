# Polish 6 — cumulative zero-finding closure

**Repair commits:** `8f6f714a33c960f9051526471f5b3b1a82bf2bcd`, `fdce4ce29e1a88494a883a6e6e263de8c450d769`  
**Final deployment:** Azure Static Web Apps `6a8d18c2-0674-45fa-8f91-c732b1904fce`  
**Live URL:** <https://speak-page-actions.sociobot.in>

The final clean clone was `/tmp/speak-page-actions-polish-6-final-clean.aYMUxi/repo` at `fdce4ce`. It passed `CI=1 npm test` (16 Vitest assertions and 38 Playwright tests) and every one of the 19 exact commands in `.factory/claims.json`. Independent claim logs are in `/tmp/speak-page-actions-polish-6-final-claims.VmLpc7/`. Live evidence is in `test-results/polish-6/verify-live-final/`, `test-results/polish-6/verify-url-final/`, `test-results/polish-6/live-license-handoff-final-390.png`, and `test-results/polish-6/live-privacy-final-390.png`.

## Review 1

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-1-1 | Browser submit semantics and all named sensitive controls require review before activation. | `@claim:destructive-review` · `verify-live-final/home-390.png` · live ZIP contents match the tested package. |
| F-1-2 | The speak control supports pointer, Space, Enter, and cancellation with correct pressed state. | `@claim:push-to-talk` · `verify-live-final/home-390.png` · live ZIP contents match. |
| F-1-3 | The demo starts with four controls and a seeded result inside the phone viewport. | `@claim:sample-action` · `verify-live-final/demo-390.png` · live `/?demo=1` passes. |
| F-1-4 | Reset and Start for real clear only `demo:spa:` data; Start opens installation. | `@claim:demo-isolation` · `verify-live-final/demo-390.png` · live demo reset and exit pass. |
| F-1-5 | Pro restore, command-name save, reload, and use run through the packaged popup. | `@claim:pro-aliases` · `verify-live-final/license-return-390.png` · live checkout and ZIP checks pass. |
| F-1-6 | Free normal actions and sensitive review run from the packaged popup without paid state. | `@claim:core-free` · `verify-live-final/home-390.png` · live ZIP matches. |
| F-1-7 | Command names and license data use extension-local storage; sync remains empty. | `@claim:extension-local-storage` · `live-license-handoff-final-390.png` · live Privacy and handoff checks pass. |
| F-1-8 | Full popup flows make no external page-label, transcript, or history request. | `@claim:page-data-local` · `verify-live-final/home-390.png` · live request checks pass. |
| F-1-9 | Privacy names the explicit Sociobot verification request and the test observes only it. | `@claim:license-verification` · `live-privacy-final-390.png` · live Privacy passes. |
| F-1-10 | Unsupported merchant and refund assertions remain absent from Terms. | copy and route suite · `verify-live-final/404-390.png` · live `/terms` returns 200. |
| F-1-11 | Each real route updates title, description, canonical, Open Graph, and Twitter values. | route metadata browser test · `verify-live-final/home-390.png` · live `/`, `/demo`, `/privacy`, and `/terms` pass. |
| F-1-12 | The full sample action and its explanation fit inside the 390×844 first viewport. | first-screen browser test · `verify-live-final/home-390.png` · cold live home check passes. |
| F-1-13 | The pinned toolchain has no audit findings. | final clean-clone `npm audit --audit-level=low` · `verify-live-final/home-390.png` · live ZIP matches audited build. |
| F-1-14 | Public copy consistently uses “visible control” and “command.” | `npm run test:copy` · `verify-live-final/home-390.png` · cold live copy rechecked. |
| F-1-15 | The demo action names four controls and says it does not alter a real page. | `@claim:sample-action` · `verify-live-final/demo-390.png` · live landing and demo pass. |
| F-1-16 | The controls section has a standalone, descriptive heading. | accessibility and copy suite · `verify-live-final/home-390.png` · live heading outline passes. |
| F-1-17 | The paid feature is explained as saved command names. | `@claim:pro-aliases` · `verify-live-final/home-390.png` · live pricing copy passes. |
| F-1-18 | The site truthfully hands returned tokens to the extension; only the popup restores Pro. | `@claim:pro-aliases` · `verify-live-final/license-return-390.png` · live handoff passes. |
| F-1-19 | Site and README use “current page” consistently. | `npm run test:copy` · `verify-live-final/home-390.png` · live copy rechecked. |
| F-1-20 | Demo documentation explains the storage outcome before the verification prefix. | `@claim:demo-isolation` · `verify-live-final/demo-390.png` · live reset isolation passes. |
| F-1-21 | Documentation calls the artifact a Chrome extension ZIP. | copy and package tests · `verify-live-final/home-390.png` · live download contents match. |
| F-1-22 | The linked 180px Apple touch icon ships with the static site. | `npm run test:package` · `verify-live-final/404-390.png` · live asset check passes. |
| F-1-23 | The copy audit covers rendered routes, popup states, legal pages, 404, and README. | `npm run test:copy` · `verify-live-final/home-390.png` · live copy rechecked. |

## Review 2

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-2-1 | Desktop Chrome/Chromium limits and every unpacked-install step are explicit. | `@claim:desktop-chromium-only` · `verify-live-final/home-390.png` · live mobile home passes. |
| F-2-2 | History restores route, scroll position, and new-h1 focus. | history browser test · `verify-live-final/home-390.png` · live history replay passes. |
| F-2-3 | Pro evidence uses the actual popup restore/save/reload/invoke path. | `@claim:pro-aliases` · `verify-live-final/license-return-390.png` · live ZIP matches. |
| F-2-4 | Free-core evidence uses popup scan, action, and review rather than the demo. | `@claim:core-free` · `verify-live-final/home-390.png` · live ZIP matches. |
| F-2-5 | Privacy tests use real UI-created storage and recorded requests. | privacy claim tests · `live-license-handoff-final-390.png` · live browser-storage check passes. |
| F-2-6 | Claims cover control kinds, typed fallback, all documented reviews, and demo isolation. | `npm run test:registry` plus claim tests · `verify-live-final/demo-390.png` · live demo passes. |
| F-2-7 | The first-screen price fact explains that the $12 feature is saved command names. | first-screen browser test · `verify-live-final/home-390.png` · cold live home passes. |
| F-2-8 | CI validates all stored word counts and extracted strings. | `npm run test:copy` · `verify-live-final/home-390.png` · live copy rechecked. |
| F-2-9 | The purchase action and adjacent text disclose the hosted Dodo checkout. | `@claim:pro-aliases` · `verify-live-final/home-390.png` · live checkout redirects to Dodo. |
| F-2-10 | Speech availability and typing fallback use plain language. | `@claim:on-device-speech`, `@claim:typed-command` · `verify-live-final/home-390.png` · live copy rechecked. |

## Reviews 3–5

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-3-1 | Website license return is a focused copy handoff; the popup has the real Restore Pro action. | `@claim:pro-aliases` · `verify-live-final/license-return-390.png` · live return passes. |
| F-3-2 | Returned tokens are scrubbed without website browser-storage writes. | `@claim:extension-local-storage` · `live-license-handoff-final-390.png` · live query and fragment checks pass. |
| F-3-3 | Platform support is a declared package-and-phone claim. | `@claim:desktop-chromium-only` · `verify-live-final/home-390.png` · live home/download pass. |
| F-4-1 | One conservative policy reviews submits and account-, subscription-, record-, and money-ending actions. | `@claim:destructive-review` · `verify-live-final/home-390.png` · live ZIP matches. |
| F-5-1 | Review confirmation uses the pending control’s exact label and resets on close. | `@claim:destructive-review` · `verify-live-final/home-390.png` · live ZIP matches. |
| F-5-2 | Live ZIP comparison uses member names, sizes, and hashes rather than archive timestamps. | `npm run test:zip-contents`, `npm run verify:live` · `verify-live-final/home-390.png` · 23-member live ZIP match passes. |

## Review 6

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-6-1 | Replaced the false absolute financial-page promise with an exact, conservative policy: block recognised finance terms in addresses, headings, or visible controls, plus any sign-in form; warn users not to use other financial pages. Generic branded sign-in, finance-host, finance-heading, false-positive, and post-login boundaries are exercised. | `@claim:financial-signal-block` · `live-privacy-final-390.png` · live Privacy wording and current ZIP check pass. |
| F-6-2 | Replaced the unsupported server-storage promise with the truthful browser-storage boundary. Query returns are scrubbed and never cached or stored; fragment handoffs are client-only, including a same-page hash change. | `@claim:extension-local-storage` · `live-license-handoff-final-390.png` · cold live query/fragment/same-page checks pass. |

## Final evidence

- Final clean clone: `fdce4ce29e1a88494a883a6e6e263de8c450d769`; `npm ci` and `npm audit --audit-level=low` reported zero vulnerabilities.
- Claims: `ALL_CLAIMS_PASS 19` from exact registry commands, each separately executed in the final clean clone.
- Quality: 16 Vitest assertions and 38 Playwright tests passed; `npm run lint`, `npm run build`, `npm run test:package`, and `npm run test:zip-contents` passed.
- Live: `npm run verify:live` passed every route, title/metadata, mobile demo, offline reload, focus/history, 404, headers, Axe sweep, and matching 23-member extension ZIP. `/opt/fleet/lib/verify-url.sh` passed with no console errors.
- Lighthouse against the production build: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.86 s, CLS 0, TBT 134 ms. Evidence: `test-results/polish-6/lighthouse/report.json`.

No finding, TODO, stub, or known product gap remains.
