# Adversarial first-read review 6 — FAIL

**Product:** Speak Page Actions

**Candidate:** `a82778bbddc635d9643ce6d3a8ce372b0b465e3a`

**Live URL:** <https://speak-page-actions.sociobot.in>

**Reviewed:** 2026-08-29 UTC in fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The first screen is clear, the demo is available in one click, all
19 declared commands exit successfully from a clean clone, and the deployed
build matches the candidate. Two blocking claim defects remain. The absolute
financial-page exclusion is false for a bank page without the implementation's
small set of financial keywords. The claim that the website does not store
license tokens is broader than its test: the checkout return sends the token
to the site in the request URL, while the test checks only browser storage.

There are **2 blocking findings**. PASS requires zero findings and no untested
claim.

## Cold first read

No scrolling or interaction occurred before these answers were recorded.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | It lets someone say or type the name of a visible browser control. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. The action, its result, desktop restriction, and all three facts are visible. |
| 1440×900 | It lets someone operate visible page controls by speech or typing, with review before named sensitive actions. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. |

The exact text supplying the answers is “Browser controls you can use by
voice,” “For people with limited vision or hand mobility, say or type a visible
control’s name,” and “Try it with sample data.” The phone page loaded without a
console error and requested only same-origin site assets.

## Findings

### Blocking

#### F-6-1 — The extension operates a banking page despite its absolute exclusion claim

- **Quote/location:** Landing and README: **“It does not operate banking or
  financial pages.”** Privacy: **“The extension does not operate banking or
  financial pages.”** Claim `financial-page-exclusion` promises the same
  outcome.
- **Evidence:** `src/lib/page-agent.ts:17-20,71-86` decides that a page is
  financial from a short hostname regex and visible keyword list. The declared
  test uses a fixture whose h1 is **“Bank account transfer”** and whose button
  is **“Transfer money,”** so both inputs contain the exact test keywords. In a
  fresh Chromium page routed at
  `https://secure.chase.com/web/auth/` with the realistic generic title
  **“Sign in | Chase,”** h1 **“Welcome back,”** labelled Username and Password
  fields, and **“Sign in,”** the shipped page-agent logic returned Username and
  Sign in as usable actions. Activating Sign in returned
  `{"ok":true,"message":"Used Sign in."}`. `secure.chase.com` does not match
  the regex, and the generic sign-in copy contains no listed keyword.
- **Why this blocks:** The public wording is universal. The only test proves
  one deliberately obvious fixture, not the promised class of banking or
  financial pages. A visitor relying on the stated safety boundary can operate
  a bank page.
- **Concrete fix:** Do not make an absolute detection claim that a local
  heuristic cannot guarantee. Replace it with **“Do not use this extension on
  banking or financial pages.”** If automatic blocking remains, describe its
  exact limit, for example **“It blocks a page when its address or visible
  controls contain a recognised financial term.”** Update `claims.json` and
  add branded-domain, generic-login, false-positive, and post-login fixtures.
  If the absolute promise must remain, implement a maintained, independently
  testable financial-origin policy that fails closed.

#### F-6-2 — The “website does not store license tokens” claim is not proved at the boundary where the site receives the token

- **Quote/location:** README and `/privacy`: **“The website does not store
  license tokens.”** Claim `extension-local-storage` repeats that sentence.
- **Evidence:** A fresh live visit to
  `/?license=review-6-private-token` made the initial request
  `https://speak-page-actions.sociobot.in/?license=review-6-private-token`.
  Client code then removed the query from browser history and displayed the
  token. The declared test checks localStorage, sessionStorage, cookies,
  IndexedDB, and Cache Storage. It does not and cannot inspect host/CDN access
  logs or any server-side retention after the token has been sent in the
  request URL.
- **Why this blocks:** The broad privacy sentence is not established by its
  registered sandbox. The current implementation exposes the token to the
  website origin before the browser-only assertions run, so “does not store”
  depends on infrastructure outside the repository and outside the test.
- **Concrete fix:** Return the token in a URL fragment or another client-only
  handoff so it is absent from the HTTP request, then assert from the request
  log that no URL contains it. Otherwise narrow the public sentence and claim
  to **“The page does not save a returned license token in browser storage,”**
  document that the query reaches the host, and test only that narrower claim.

## Copy audit

Count rule: whitespace-delimited tokens. Punctuation, hyphenated words, URLs,
paths, and `$12` count as one word. The tables include every unique rendered
landing-page string, including headings, controls, facts, alt text, footer, and
conditional checkout-return text, plus every README sentence and heading. No
entry exceeds 22 words and no banned marketing adjective appears. The only
copy flags are the unsupported claims above.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Speak Page Actions home | 4 | — |
| Speak Page Actions | 3 | — |
| Main navigation | 2 | — |
| Demo | 1 | — |
| Desktop download | 2 | — |
| Privacy | 1 | — |
| Browser controls you can use by voice | 7 | — |
| Speak the action you need | 5 | — |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 | — |
| Try it with sample data | 5 | — |
| Opens four sample controls without changing a real page. | 9 | — |
| Desktop Chrome and Chromium only. | 5 | — |
| Mobile browsers can run the demo but cannot install this extension. | 11 | — |
| Page labels stay in your browser | 6 | — |
| Works offline after the first visit | 6 | — |
| Core actions are free; saved command names cost $12 once | 10 | — |
| Product facts | 2 | — |
| A printed browser page with a sound wave becoming a pointer. | 11 | — |
| Original generated artwork, made for Speak Page Actions. | 8 | — |
| What the extension shows | 4 | — |
| Visible controls listed by the extension | 6 | — |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 | — |
| button Save address | 3 | — |
| link Review order | 3 | — |
| review Delete saved draft | 4 | — |
| How Speak Page Actions works | 5 | — |
| Open the extension. | 3 | — |
| It scans the current page only. | 6 | — |
| Hold to speak. | 3 | — |
| Speak when your browser can process speech on this device, or type the visible control name. | 16 | — |
| Review sensitive actions. | 3 | — |
| It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. | 18 | — |
| What it does not do | 5 | — |
| It does not listen in the background. | 7 | — |
| It never lists password fields. | 5 | — |
| It does not operate banking or financial pages. | 8 | F-6-1 |
| Install on desktop Chrome or Chromium | 6 | — |
| Mobile browsers cannot install this extension. | 6 | — |
| You can still use the demo on this device. | 9 | — |
| Download and unzip the extension ZIP. | 6 | — |
| Open chrome://extensions on desktop Chrome or Chromium. | 7 | — |
| Turn on Developer mode. | 4 | — |
| Choose Load unpacked. | 3 | — |
| Select the unzipped extension folder. | 5 | — |
| Download the desktop extension ZIP | 5 | — |
| One-time Pro license | 3 | — |
| Save your own command names | 5 | — |
| Pro costs $12 once. | 4 | — |
| Save a short name for a visible control. | 8 | — |
| Core page actions and safety checks are free. | 8 | — |
| Buy Pro in hosted checkout — $12 once | 8 | — |
| Opens Dodo’s checkout in this tab. | 6 | — |
| Open the extension to restore Pro | 6 | — |
| The website cannot turn on Pro inside your installed extension. | 10 | — |
| Open the extension on a normal page. | 7 | — |
| Open Restore Pro and save command names. | 7 | — |
| Paste your token and choose Restore Pro. | 7 | — |
| Move your license to the extension | 6 | — |
| License token returned by checkout | 5 | — |
| Copy license token | 3 | — |
| Copy this token, then paste it in the extension. | 9 | — |
| License token copied. | 3 | — |
| Paste it in the extension. | 5 | — |
| Copy the selected token, then paste it in the extension. | 10 | — |
| Footer navigation | 2 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| Speak visible page actions with review before sensitive clicks. | 9 | — |
| v1.0.0 · Original generated illustration disclosed above. | 7 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Speak Page Actions | 3 | — |
| Speak visible browser controls on an ordinary page. | 8 | — |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | — |
| The extension scans only the current page after you open it. | 11 | — |
| Hold the speak button and say a visible control name, such as “click save address.” | 15 | — |
| Hold Space or Enter to speak; release the key to stop. | 11 | — |
| It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. | 18 | — |
| Password fields are never listed. | 5 | — |
| It does not operate banking or financial pages. | 8 | F-6-1 |
| Try four sample controls at the one-click demo. | 8 | — |
| Sample changes use separate browser storage and do not change extension settings. | 12 | — |
| Keys start with demo:spa: for verification. | 6 | — |
| Run locally | 2 | — |
| Install on desktop Chrome or Chromium only. | 7 | — |
| Download and unzip the packaged ZIP, open chrome://extensions, turn on Developer mode, choose Load unpacked, then select the unzipped folder. | 20 | — |
| Mobile browsers can use the demo but cannot install this extension. | 11 | — |
| npm run build:site is the static deployment command. | 8 | — |
| It writes the site to dist/site/ and includes the downloadable extension at dist/site/downloads/speak-page-actions.zip. | 13 | — |
| Privacy and limits | 3 | — |
| It does not capture background microphone audio. | 7 | — |
| Spoken commands work only when your browser can process speech on this device. | 13 | — |
| You can type the same command when speech is unavailable. | 10 | — |
| The public site works offline after its first visit. | 9 | — |
| See Privacy and Terms. | 4 | — |
| Restore Pro | 2 | — |
| Open the extension on a normal page. | 7 | — |
| Open Restore Pro and save command names. | 7 | — |
| Paste your license token, then choose Restore Pro. | 8 | — |
| The website does not store license tokens. | 7 | F-6-2 |
| License | 1 | — |
| MIT. | 1 | — |
| The optional Pro license costs $12 once and saves your own command names. | 13 | — |
| Core accessibility actions and safety checks are free. | 8 | — |

Headings name their sections, and the landing buttons use result-oriented
verbs. Terminology is otherwise consistent: visible control, command, demo,
review, extension, and command name.

## Demo and sandbox

- One click from `/` opens `/?demo=1` with the persistent **“Demo — sample
  data, nothing is saved”** banner, **Reset demo**, **Start for real**, all four
  sample checkout controls, and **“Found four visible controls on Sample
  checkout.”** in the 390×844 first viewport.
- Using **Save address** returns **“Used Save address.”** and writes only
  `demo:spa:sample`. A pre-existing `real:setting=sentinel` remains unchanged.
- Reset removes the demo key, restores the four controls, and leaves the real
  sentinel unchanged. The full observed demo request log is same-origin.
- The registered offline check reloads `/demo` after the browser context is
  set offline. No CLI or library sandbox applies to this browser extension.

## Declared claims

A clean clone was created under `/tmp/tmp.Bw3lQFCgz3/repo`; `npm ci` installed
176 packages with zero audit vulnerabilities. Every exact `test` value in
`.factory/claims.json` was run separately.

| Claim | Exact command | Result | Evidence assessment |
| --- | --- | --- | --- |
| `sample-action` | `npm test -- --grep @claim:sample-action` | PASS | One click, four controls, seeded result. |
| `demo-local` | `npm test -- --grep @claim:demo-local` | PASS | Same-origin requests and demo-prefixed writes. |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS | Real sentinels survive use and reset. |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS | Demo reloads offline after first visit. |
| `active-tab-only` | `npm test -- --grep @claim:active-tab-only` | PASS | Package permission and injection boundary. |
| `on-device-speech` | `npm test -- --grep @claim:on-device-speech` | PASS | Unsupported local recognition falls back to typing. |
| `typed-command` | `npm test -- --grep @claim:typed-command` | PASS | Packaged popup runs a typed command. |
| `destructive-review` | `npm test -- --grep @claim:destructive-review` | PASS | All documented sensitive labels require named review. |
| `financial-page-exclusion` | `npm test -- --grep @claim:financial-page-exclusion` | PASS | Fixture is too narrow; independent boundary fails in F-6-1. |
| `undo-local-delete` | `npm test -- --grep @claim:undo-local-delete` | PASS | Removed local item is restored. |
| `visible-labels` | `npm test -- --grep @claim:visible-labels` | PASS | Visible labelled button, link, and field boundaries. |
| `password-exclusion` | `npm test -- --grep @claim:password-exclusion` | PASS | Password field is absent. |
| `push-to-talk` | `npm test -- --grep @claim:push-to-talk` | PASS | Pointer, Space, and Enter holds are exercised. |
| `pro-aliases` | `npm test -- --grep @claim:pro-aliases` | PASS | Restore, save, reload, and use run through the popup. |
| `core-free` | `npm test -- --grep @claim:core-free` | PASS | Free normal action and review run with empty paid state. |
| `page-data-local` | `npm test -- --grep @claim:page-data-local` | PASS | Complete extension request log has no page-data request. |
| `extension-local-storage` | `npm test -- --grep @claim:extension-local-storage` | PASS | Browser stores pass; the broader website boundary is F-6-2. |
| `license-verification` | `npm test -- --grep @claim:license-verification` | PASS | Only the encoded Sociobot verification request appears. |
| `desktop-chromium-only` | `npm test -- --grep @claim:desktop-chromium-only` | PASS | MV3 package, popup, phone disclosure, and install steps. |

The exact commands all exit zero. F-6-1 and F-6-2 explain why two tests do not
establish the full public wording.

## Earlier finding recheck

Every earlier review, all five polish records, and the handoff were read. The
live deployment matches the current build, so code and live conclusions refer
to the same product.

| Earlier finding | Current live/code confirmation |
| --- | --- |
| F-1-1 | Fixed: implicit, explicit, and image submits require review. |
| F-1-2 | Fixed: pointer, Space, Enter, cancellation, and state are exercised in the popup. |
| F-1-3 | Fixed: four controls and the seeded result are in the first phone viewport. |
| F-1-4 | Fixed: Reset and Start remove only demo keys; Start opens installation. |
| F-1-5 | Fixed: Pro restore, save, reload, and command use run through the packaged popup. |
| F-1-6 | Fixed: free core actions and review run through the packaged popup with empty storage. |
| F-1-7 | Fixed: license and command names are created in extension-local storage; sync remains empty. |
| F-1-8 | Fixed: the complete packaged flow records no external page-data request. |
| F-1-9 | Fixed: Privacy names the explicit Sociobot verification request. |
| F-1-10 | Fixed: merchant/refund assertions remain absent. |
| F-1-11 | Fixed: route title, description, canonical, Open Graph, and Twitter values update. |
| F-1-12 | Fixed: the full CTA and adjacent result fit at 390×844. |
| F-1-13 | Fixed: clean-clone npm audit reports zero vulnerabilities. |
| F-1-14 | Fixed: landing and README use visible control and command without the former jargon. |
| F-1-15 | Fixed: the sample sentence names four controls and no real-page change. |
| F-1-16 | Fixed: the preview heading names visible controls. |
| F-1-17 | Fixed: the paid feature is called saved command names and is explained. |
| F-1-18 | Fixed: only the extension restores Pro; the site gives explicit handoff steps. |
| F-1-19 | Fixed: README consistently says current page. |
| F-1-20 | Fixed: README explains storage separation before its verification prefix. |
| F-1-21 | Fixed: README calls the artifact a Chrome extension ZIP. |
| F-1-22 | Fixed: the linked Apple touch icon is 180×180. |
| F-1-23 | Fixed: the enforced audit reports 198 rows covering 188 extracted strings. |
| F-2-1 | Fixed: phone copy and README state desktop-only support and all unpacked-install steps. |
| F-2-2 | Fixed: Back/Forward restores route, h1 focus, and saved scroll. |
| F-2-3 | Fixed: Pro evidence no longer pre-seeds storage outside the product flow. |
| F-2-4 | Fixed: free-core evidence no longer bypasses the package. |
| F-2-5 | Fixed for the reported browser/extension stores and request flows; F-6-2 identifies the separate server-visible URL gap. |
| F-2-6 | Fixed for the named control kinds, sensitive labels, typed fallback, and demo isolation. |
| F-2-7 | Fixed: the price fact says saved command names. |
| F-2-8 | Fixed: CI checks copy presence and stored counts. |
| F-2-9 | Fixed: the checkout action and adjacent copy identify hosted Dodo checkout. |
| F-2-10 | Fixed: speech availability and typed fallback use plain language. |
| F-3-1 | Fixed: the website no longer claims to activate Pro; the popup performs restore. |
| F-3-2 | Fixed as originally reported: checkout tokens do not enter browser storage or Cache Storage. F-6-2 concerns the broader server-visible request. |
| F-3-3 | Fixed: platform support has a registered package-and-phone test. |
| F-4-1 | Fixed: all documented account-, subscription-, record-, and money-ending labels use the review policy. |
| F-5-1 | Fixed: the confirmation button uses the pending control's exact label and resets after close. |
| F-5-2 | Fixed: live verification compares sorted ZIP member contents, not archive metadata. |

The handoff's three repair-6 regressions also remain fixed: private stable
action IDs and activation revalidation, labelled-field filtering, and recovery
from synchronous speech-start failure all have packaged-extension tests in the
38-test suite.

## Structure, links, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles,
  descriptions, canonicals, Open Graph/Twitter metadata, one h1, one main, and
  no console error or horizontal overflow. The title patterns meet the supplied
  route rule.
- A fresh unknown URL returns the designed 404 with HTTP 404, one h1, one main,
  matching metadata, consistent header/footer, and a Return home action.
- The crawl resolved every intentional link and asset: home, demo, download,
  Privacy, Terms, checkout, robots, sitemap, favicon, Apple icon, social image,
  and ZIP. Hosted checkout redirected to Dodo and returned 200.
- Back/Forward restored the prior home scroll position and focused the new h1.
  Reduced-motion, 44 px targets, skip-link order, and deep links pass the full
  suite.
- An independent Axe 4.11.0 sweep across five routes, light/dark themes, and
  phone/desktop viewports found zero violations. `verify-url.sh` returned 200,
  no console errors, `lang=en`, one h1/main, complete alt text, and no
  unlabelled button. The standalone Axe CLI could not pair its downloaded
  ChromeDriver 152 with the provided Chromium 145; the repository's Playwright
  Axe integration completed the same engine checks.
- The dithered instruction-card layout, paper/cobalt/oxide palette, halftone
  field, serif display type, square ink controls, and original product art are
  distinct from a generic SaaS template and match `.factory/design.md`.

## Quality gates

From the clean clone:

- `CI=1 npm test`: 16 Vitest assertions and 38 Playwright tests passed.
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:package`,
  and `npm run test:zip-contents`: passed.
- `npm audit --audit-level=low`: zero vulnerabilities.
- `npm run verify:live`: passed route, Axe, demo, history, offline, header,
  site-asset, and all 23 ZIP-member comparisons.
- Production site output is 14.26 kB JavaScript (5.16 kB gzip) and 11.29 kB
  CSS (3.20 kB gzip), within the stated budgets.

## Missed leverage

No AI step is justified. The core job is deterministic, page-local control;
sending page labels or speech to a model would weaken the privacy boundary.
The brief does not imply import, export, or sync, and no decorative AI feature
or embedded provider key is present.

## What would make this perfect

Make the financial-page wording match a guarantee the extension can actually
enforce, with branded-domain and generic-login boundary tests. Keep returned
license tokens out of HTTP request URLs, or narrow the privacy wording to the
browser stores that are actually tested. Then rerun every registered command,
the new adversarial fixtures, and the live request audit. Nothing else was
left as an unverified recommendation.
