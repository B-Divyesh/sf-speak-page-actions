# Polish 2 — cumulative adversarial closure

Repair commit: `1f4338b11dabebb40b244ed344ed457b8e40da2b`.
Live deployment: `4ea4e408-c488-40ae-9039-05cde62f112b`.
Live URL: <https://speak-page-actions.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Submit semantics and sensitive labels require review before activation. | `@claim:destructive-review` |
| F-1-2 | Pointer, Space, and Enter holds operate the speak control. | `@claim:push-to-talk` |
| F-1-3 | Demo opens with four controls and a seeded result in the phone viewport. | `@claim:sample-action`; `test-results/live-polish-2-demo-390.png` |
| F-1-4 | Reset and Start for real clear only `demo:spa:` keys; the latter opens installation. | `@claim:demo-isolation`; live `/demo` |
| F-1-5 | The packaged popup now saves, persists, and invokes a command name through its UI. | `@claim:pro-aliases` |
| F-1-6 | The packaged popup runs a free normal action and opens review for a sensitive action with no paid state. | `@claim:core-free` |
| F-1-7 | Local alias/license storage is saved through the popup and checked against empty sync storage. | `@claim:extension-local-storage` |
| F-1-8 | A complete extension flow records no external page-data request. | `@claim:page-data-local` |
| F-1-9 | Privacy copy makes only the tested Sociobot verification statement. | `@claim:license-verification` |
| F-1-10 | Unsupported merchant/refund wording remains removed. | Terms route, copy audit |
| F-1-11 | Client routes set title, description, canonical, Open Graph, and Twitter metadata. | `client routes set matching title, canonical, Open Graph, and Twitter metadata`; live route pass |
| F-1-12 | The first-screen action and explanation remain above the 390×844 fold. | `landing first screen presents exactly three privacy, offline, and price facts`; `test-results/live-polish-2-home-390.png` |
| F-1-13 | Dependency audit remains clean. | `npm audit --audit-level=low` |
| F-1-14 | Copy consistently uses visible control and command. | `.factory/copy-audit.md` |
| F-1-15 | Demo copy names four sample controls and its isolation. | `@claim:sample-action` |
| F-1-16 | The visible-controls section has an out-of-context heading. | route accessibility suite |
| F-1-17 | Paid command names are explained in plain language. | `@claim:pro-aliases`; copy audit |
| F-1-18 | License restore is named by its result. | `@claim:pro-aliases` |
| F-1-19 | Current-page wording remains consistent. | copy audit |
| F-1-20 | Demo storage namespace and outcome are documented. | `.factory/demo.md`; `@claim:demo-isolation` |
| F-1-21 | README describes the packaged Chrome extension ZIP. | README audit |
| F-1-22 | Product artwork icons remain packaged and linked. | `npm run test:package` |
| F-1-23 | The audit now includes public routes, popup, legal states, install, price, and README copy. | `.factory/copy-audit.md` |
| F-2-1 | Phone-facing download/install copy now says desktop Chrome/Chromium only and gives five Chrome steps. | `desktop installation steps are explicit and honest on a phone viewport`; live home check |
| F-2-2 | History entries save scroll positions; Back/Forward restore route, focus, and scroll. | `browser Back and Forward restore route focus and scroll position`; live check |
| F-2-3 | Alias evidence drives real popup fields, a recorded verification response, reload, typed command, and fixture action. | `@claim:pro-aliases` |
| F-2-4 | Free-core evidence drives the packaged popup scan, normal action, and review dialog. | `@claim:core-free` |
| F-2-5 | Privacy, storage, and verification evidence records requests and user-visible saves, not source strings. | `@claim:page-data-local`, `@claim:extension-local-storage`, `@claim:license-verification` |
| F-2-6 | Claims cover buttons, links, labelled fields, every named sensitive category, typed fallback, and demo isolation. | `.factory/claims.json`; matching tagged tests |
| F-2-7 | First-screen fact says “saved command names.” | mobile first-screen test; live home check |
| F-2-8 | Copy audit was replaced with current route, popup, legal, installation, checkout, and README text. | `.factory/copy-audit.md` |
| F-2-9 | Hosted checkout button and adjacent text disclose the Dodo destination. | `@claim:pro-aliases`; live home check |
| F-2-10 | Speech copy explains that the browser must process speech on this device, and typing remains available. | `@claim:on-device-speech`; `@claim:typed-command` |

## Live recheck

Fresh 390×844 Chromium checked `/`, `/?demo=1`, `/privacy`, and `/terms` on
the deployed domain. Each route had its required title and zero serious or
critical Axe findings. The demo banner, four initial controls, Reset/Start
path, desktop-only disclosure, above-fold primary action, route focus, and
scroll restoration passed. Evidence screenshots are in `test-results/` and
the live verifier report is `test-results/verify-live-2/verify.json`.
