# Polish 5 — cumulative zero-finding closure

**Repair commit:** `e47016144a46b39886c0dd805ec9756e26f4936d`<br>
**Deployment:** Azure Static Web Apps `b2ffc133-ff6f-491c-86d9-bb4caaa9202b`<br>
**Live URL:** <https://speak-page-actions.sociobot.in>

Evidence is under `test-results/polish-5/`; bare screenshot names use that
directory and `verify-live/*` uses its `verify-live/` child. The fresh clone was
`/tmp/speak-page-actions-polish-5-clean.et8TmZ` at the repair commit. Every one
of the 18 exact `.factory/claims.json` commands passed independently.

## Review 1

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-1-1 | Actual implicit/explicit submit semantics and sensitive labels block activation until review. | `@claim:destructive-review` · `test-results/polish-5/extension-confirmation.png` · live ZIP contents match the tested package. |
| F-1-2 | Pointer, Space, Enter, and pointer cancellation operate held speech with accurate state. | `@claim:push-to-talk` · `extension-confirmation.png` · live download member check passes. |
| F-1-3 | The demo starts with four controls and a seeded result inside the phone viewport. | `@claim:sample-action` · `verify-live/demo-390.png` · live `/?demo=1` passes. |
| F-1-4 | Reset and Start for real remove only `demo:spa:` keys; Start opens installation. | `@claim:demo-isolation`; demo reset/exit test · `verify-live/demo-390.png` · live `/?demo=1` passes. |
| F-1-5 | The popup restores Pro, saves/reloads a command name, then invokes its target. | `@claim:pro-aliases` · `verify-live/license-return-390.png` · checkout and live ZIP checks pass. |
| F-1-6 | Empty extension storage still permits a normal action and sensitive review. | `@claim:core-free` · `extension-confirmation.png` · live ZIP contents match. |
| F-1-7 | License data and command names are created in extension-local storage; sync stays empty. | `@claim:extension-local-storage` · `verify-live/license-return-390.png` · live `/privacy` passes. |
| F-1-8 | Complete popup flows emit no page-label, transcript, or history requests. | `@claim:page-data-local` · `verify-live/home-390.png` · live demo request log is same-origin. |
| F-1-9 | Privacy names the explicit Sociobot license check and the test observes only that request. | `@claim:license-verification` · `verify-live/license-return-390.png` · live `/privacy` passes. |
| F-1-10 | Unsupported merchant/refund promises remain absent. | full route/copy suite · `verify-live/404-390.png` · live `/terms` returns 200 with matching metadata. |
| F-1-11 | Each route sets matching title, description, canonical, Open Graph, and Twitter metadata. | route metadata test · `verify-live/home-390.png` · live `/`, `/demo`, `/privacy`, `/terms` pass. |
| F-1-12 | The full demo action and its explanation fit inside 390×844. | first-screen browser test · `verify-live/home-390.png` · cold live home assertion passes. |
| F-1-13 | WXT 0.21.4 remains free of known npm advisories. | clean-clone `npm audit --audit-level=low` · `verify-live/home-390.png` · deployed tested build matches. |
| F-1-14 | Public copy consistently uses “visible control” and “command.” | `npm run test:copy` · `verify-live/home-390.png` · cold live copy rechecked. |
| F-1-15 | Demo copy names four sample controls and says no real page changes. | `@claim:sample-action` · `verify-live/home-390.png` · live landing and demo pass. |
| F-1-16 | The preview heading names the controls listed by the extension. | copy/accessibility suite · `verify-live/home-390.png` · live heading outline passes. |
| F-1-17 | Paid aliases are explained as saved command names. | `@claim:pro-aliases` · `verify-live/home-390.png` · live pricing text passes. |
| F-1-18 | The site gives truthful extension restore steps; the popup action is Restore Pro. | `@claim:pro-aliases` · `verify-live/license-return-390.png` · live token handoff passes. |
| F-1-19 | Site and README consistently say “current page.” | `npm run test:copy` · `verify-live/home-390.png` · live wording rechecked. |
| F-1-20 | Demo documentation explains separation before its verification prefix. | `@claim:demo-isolation` · `verify-live/demo-390.png` · live reset/exit isolation passes. |
| F-1-21 | Documentation and UI call the artifact a Chrome extension ZIP. | copy/package tests · `verify-live/home-390.png` · live download returns matching contents. |
| F-1-22 | The linked Apple touch icon is 180×180 and packaged. | `npm run test:package` · `verify-live/404-390.png` · live icon/site asset check passes. |
| F-1-23 | The enforced audit covers all extracted route, popup, 404, state, and README copy. | `npm run test:copy` (190 rows/184 strings) · `verify-live/home-390.png` · deployed text bundle matches. |

## Review 2

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-2-1 | First screen and install section state desktop-only support and all unpacked-install steps. | `@claim:desktop-chromium-only` · `verify-live/home-390.png` · live mobile home passes. |
| F-2-2 | History entries retain scroll; Back/Forward restore the route and h1 focus. | Back/Forward browser test · `verify-live/home-390.png` · live history replay passes after focus waits. |
| F-2-3 | Pro proof drives the real popup restore, save, reload, and invocation flow. | `@claim:pro-aliases` · `verify-live/license-return-390.png` · live checkout and ZIP checks pass. |
| F-2-4 | Free-core proof drives the packaged popup, not the website demo. | `@claim:core-free` · `extension-confirmation.png` · live ZIP contents match. |
| F-2-5 | Privacy/storage tests use actual UI-created storage and recorded network requests. | three privacy claim tests · `verify-live/license-return-390.png` · live storage/request checks pass. |
| F-2-6 | Claims cover all advertised control kinds, sensitive categories, typed fallback, and demo isolation. | registry plus matching tagged tests · `verify-live/demo-390.png` · live demo and package checks pass. |
| F-2-7 | The first-screen price fact says “saved command names.” | first-screen browser test · `verify-live/home-390.png` · cold live wording passes. |
| F-2-8 | CI checks every audit count and extracted public string. | `npm run test:copy` · `verify-live/home-390.png` · deployed bundle matches. |
| F-2-9 | The purchase action names hosted checkout and identifies Dodo before navigation. | `@claim:pro-aliases` · `verify-live/home-390.png` · live checkout redirects to Dodo. |
| F-2-10 | Speech copy explains device availability and the typed alternative in plain words. | speech and typed-command claim tests · `verify-live/home-390.png` · live wording rechecked. |

## Review 3

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-3-1 | The website never claims to activate Pro; it provides a focused copy handoff to the popup. | `@claim:pro-aliases` · `verify-live/license-return-390.png` · live `/?license=cold-return-token` is scrubbed and focused. |
| F-3-2 | The site stores no returned token in local/session storage, cookies, IndexedDB, or Cache Storage. | `@claim:extension-local-storage` · `verify-live/license-return-390.png` · live storage audit passes. |
| F-3-3 | Desktop/mobile compatibility is registered and tested against the package and phone UI. | `@claim:desktop-chromium-only` · `verify-live/home-390.png` · live home/download checks pass. |

## Review 4

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-4-1 | One conservative policy covers submits and account-, subscription-, and record-ending labels in both classifiers. | `@claim:destructive-review`; unit matcher cases · `extension-confirmation.png` · live ZIP contents match. |

## Review 5

| Finding | Change made | Evidence: test · screenshot · live URL check |
| --- | --- | --- |
| F-5-1 | The review button now uses the exact pending control label and returns to “Confirm action” whenever the dialog closes. | `@claim:destructive-review` asserts every label and reset · `extension-confirmation.png` · live 22-member ZIP matches the tested release. |
| F-5-2 | `verify:live` compares sorted ZIP member names, sizes, and uncompressed SHA-256 values instead of archive bytes. A regression proves timestamp differences pass and changed payloads fail. | `npm run test:zip-contents`; `npm run verify:live` · `verify-live/home-390.png` · live download comparison passes with 22 members. |

## Final evidence

- Clean clone: `e47016144a46b39886c0dd805ec9756e26f4936d`; `npm ci` found 0 vulnerabilities.
- Claims: `ALL_CLAIMS_PASS 18`, with one independent command/log per claim.
- Full suite: 11 Vitest tests and 32 Playwright tests passed; light/dark route Axe checks found zero serious/critical issues.
- Release: typecheck, build, package check, copy audit, registry check, ZIP regression, and npm audit passed.
- Live verifier: `test-results/polish-5/verify-live/cold-check.json`; all routes, metadata, demo, privacy, focus/history, 404, offline, CSP, and release contents passed with zero console errors.
- Worker verifier: `test-results/polish-5/verify-url/verify.json`; HTTP 200 in 590 ms with valid title/lang/h1/main/alt/button checks.
- Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.5 s, CLS 0, TBT 20 ms.

No finding, TODO, stub, or known gap remains.
