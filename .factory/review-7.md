# Adversarial first-read review 7 — PASS

**Product:** Speak Page Actions  
**Candidate:** `a9649291f9d52dc8db6af68e3b9cc2de28abd674`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Reviewed:** 2026-08-29 UTC in fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**PASS.** There are zero findings. The live first screen states the job,
audience, and first action without scrolling. The one-click demo opens an
isolated, realistic four-control sample in its first phone viewport. Every
declared claim command passed from a clean clone, and live routing, metadata,
privacy traffic, offline reload, package contents, accessibility, and history
checks passed.

## Cold first read

No scrolling or interaction occurred before recording these answers.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | It lets someone say or type the name of a visible browser control. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. The action, its result, desktop restriction, and three facts are visible. |
| 1440×900 | It lets someone operate visible browser controls by voice or typing, with review for sensitive actions. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. |

The exact first-screen text is “Browser controls you can use by voice,” “For
people with limited vision or hand mobility, say or type a visible control’s
name,” and “Try it with sample data.” The live phone and desktop loads made
only same-origin asset requests and logged no console errors.

## Copy audit

Count rule: whitespace-delimited words. Repeated strings are listed once. The
landing-page and README audit below includes headings, controls, facts, and
conditional landing copy. No entry exceeds 22 words. No banned marketing word,
empty mood heading, jargon-only heading, inconsistent product term, or
non-result-naming button was found. “Visible control,” “command,” “demo,”
“review,” “extension,” and “command name” are used consistently.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| Speak Page Actions | 3 |
| Demo | 1 |
| Desktop download | 2 |
| Privacy | 1 |
| Browser controls you can use by voice | 7 |
| Speak the action you need | 5 |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 |
| Try it with sample data | 5 |
| Opens four sample controls without changing a real page. | 9 |
| Desktop Chrome and Chromium only. | 5 |
| Mobile browsers can run the demo but cannot install this extension. | 11 |
| Page labels stay in your browser | 6 |
| Works offline after the first visit | 6 |
| Core actions are free; saved command names cost $12 once | 10 |
| Original generated artwork, made for Speak Page Actions. | 8 |
| What the extension shows | 4 |
| Visible controls listed by the extension | 6 |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 |
| button Save address | 3 |
| link Review order | 3 |
| review Delete saved draft | 4 |
| How Speak Page Actions works | 5 |
| Open the extension. | 3 |
| It scans the current page only. | 6 |
| Hold to speak. | 3 |
| Speak when your browser can process speech on this device, or type the visible control name. | 16 |
| Review sensitive actions. | 3 |
| It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. | 18 |
| What it does not do | 5 |
| It does not listen in the background. | 7 |
| It never lists password fields. | 5 |
| It blocks pages when the address, headings, or visible controls contain familiar finance words, or a sign-in form is present. | 20 |
| Do not use it on other banking or financial pages. | 10 |
| Install on desktop Chrome or Chromium | 6 |
| Mobile browsers cannot install this extension. | 6 |
| You can still use the demo on this device. | 9 |
| Download and unzip the extension ZIP. | 6 |
| Open chrome://extensions on desktop Chrome or Chromium. | 7 |
| Turn on Developer mode. | 4 |
| Choose Load unpacked. | 3 |
| Select the unzipped extension folder. | 5 |
| Download the desktop extension ZIP | 5 |
| One-time Pro license | 3 |
| Save your own command names | 5 |
| Pro costs $12 once. | 4 |
| Save a short name for a visible control. | 8 |
| Core page actions and safety checks are free. | 8 |
| Buy Pro in hosted checkout — $12 once | 8 |
| Opens Dodo’s checkout in this tab. | 6 |
| Open the extension to restore Pro | 6 |
| The website cannot turn on Pro inside your installed extension. | 10 |
| Open the extension on a normal page. | 7 |
| Open Restore Pro and save command names. | 7 |
| Paste your token and choose Restore Pro. | 7 |
| Move your license to the extension | 6 |
| License token returned by checkout | 5 |
| Copy license token | 3 |
| Copy this token, then paste it in the extension. | 9 |
| License token copied. | 3 |
| Paste it in the extension. | 5 |
| Copy the selected token, then paste it in the extension. | 10 |
| Speak visible page actions with review before sensitive clicks. | 9 |
| Terms | 1 |
| Built by Param Factory | 4 |
| v1.0.0 · Original generated illustration disclosed above. | 7 |

### README

| Copy | Words |
| --- | ---: |
| Speak Page Actions | 3 |
| Speak visible browser controls on an ordinary page. | 8 |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 |
| The extension scans only the current page after you open it. | 11 |
| Hold the speak button and say a visible control name, such as “click save address.” | 15 |
| Hold Space or Enter to speak; release the key to stop. | 11 |
| It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. | 18 |
| Password fields are never listed. | 5 |
| It blocks pages when the address, headings, or visible controls contain familiar finance words, or a sign-in form is present. | 20 |
| Do not use it on other banking or financial pages. | 10 |
| Try four sample controls at the one-click demo. | 8 |
| Sample changes use separate browser storage and do not change extension settings. | 12 |
| Keys start with demo:spa: for verification. | 6 |
| Run locally | 2 |
| Install on desktop Chrome or Chromium only. | 7 |
| Download and unzip the packaged ZIP, open chrome://extensions, turn on Developer mode, choose Load unpacked, then select the unzipped folder. | 20 |
| Mobile browsers can use the demo but cannot install this extension. | 11 |
| npm run build:site is the static deployment command. | 8 |
| It writes the site to dist/site/ and includes the downloadable extension at dist/site/downloads/speak-page-actions.zip. | 13 |
| Privacy and limits | 3 |
| It does not capture background microphone audio. | 7 |
| Spoken commands work only when your browser can process speech on this device. | 13 |
| You can type the same command when speech is unavailable. | 10 |
| The public site works offline after its first visit. | 9 |
| See Privacy and Terms. | 4 |
| Restore Pro | 2 |
| Open the extension on a normal page. | 7 |
| Open Restore Pro and save command names. | 7 |
| Paste your license token, then choose Restore Pro. | 8 |
| A checkout return can put a token in the address bar. | 11 |
| The page removes it without saving it in browser storage. | 10 |
| License | 1 |
| MIT. | 1 |
| The optional Pro license costs $12 once and saves your own command names. | 13 |
| Core accessibility actions and safety checks are free. | 8 |

## Demo and sandbox

The landing CTA opened `/?demo=1` in one click. At 390×844, the first demo
screen showed the persistent “Demo — sample data, nothing is saved” banner,
Reset demo, Start for real, the seeded result, and all four realistic controls:
Save address, Shipping method, Review order, and Delete saved draft. It did
not make the visitor set up data or scroll to discover the sample.

The complete demo request log contained only product-origin requests. A sample
action wrote only `demo:spa:sample`; real-setting and real-license sentinels
were unchanged. Reset removed the demo key and restored the sample. Start for
real removed the demo key and moved to `/#install`. The offline claim test
loaded the demo in a new context, waited for the service worker, went offline,
and reloaded it successfully. This browser-extension product has no CLI or
library playground path to inspect.

## Claims and verification

`.factory/claims.json` contains 19 claims, each with one exact tagged test.
From a fresh clone at `/tmp/speak-page-actions-review-7.BYYt7F`, every listed
`npm test -- --grep @claim:<id>` command passed:

`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`,
`destructive-review`, `financial-signal-block`, `undo-local-delete`,
`visible-labels`, `password-exclusion`, `push-to-talk`, `pro-aliases`,
`core-free`, `page-data-local`, `extension-local-storage`,
`license-verification`, and `desktop-chromium-only`.

The complete clean-clone suite also passed: `CI=1 npm test` (16 Vitest and 38
Playwright tests), `npm run build`, `npm run typecheck`, `npm run lint`,
`npm run test:package`, and `npm run test:zip-contents`. `npm ci` reported
zero audit vulnerabilities. Each claim-like public statement maps to the
registry and observable test evidence; no unlisted claim was found. In
particular, held speech is covered by `push-to-talk`; page-label privacy by
`page-data-local`; the finance/sign-in boundary by `financial-signal-block`;
and the checkout, price, and saved command names by `pro-aliases`.

`npm run verify:live` passed against the live deployment. It confirmed same-
origin demo traffic, reset and exit isolation, offline demo reload, clean
license handoff storage, route focus/scroll restoration, 23 matching extension
ZIP members, release CSP frame protection, and `no-referrer` policy.

## Structure, accessibility, and visual identity

Live `/`, `/demo`, `/privacy`, and `/terms` all returned 200 with their own
plain-language title, description, canonical, Open Graph, and Twitter values;
each has one h1 and one main landmark. The unknown route returned a styled 404
with a way home. Internal links, the hosted checkout, robots, sitemap,
favicon, and Apple touch icon resolved. Back and Forward restored both focus
to the new h1 and prior scroll position. The live verifier reported zero
serious or critical Axe violations across light and dark routes and zero
console errors.

The dithered warm-paper, cobalt, and oxide instruction-card treatment matches
the documented visual system and is recognizably product-specific rather than
a generic SaaS template. The brief does not imply an AI, import/export, or
sync feature beyond the implemented browser-local extension workflow; an AI
addition would be decorative and widen the privacy boundary.

## Earlier-history recheck

Every earlier review, polish record, and handoff was read. The live site and
current code confirm each previous finding is fixed rather than merely marked
fixed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Implicit, explicit, and image form submits require review. |
| F-1-2 | Pointer, Space, Enter, and cancellation control held speech correctly. |
| F-1-3 | Four sample controls and the seeded result fit the initial phone demo view. |
| F-1-4 | Reset and Start for real clear only demo storage; exit opens installation. |
| F-1-5 | The packaged popup restores, saves, reloads, and uses a paid command name. |
| F-1-6 | The packaged popup performs free normal and review flows with empty paid storage. |
| F-1-7 | Command names and license data use extension-local storage; sync remains empty. |
| F-1-8 | A complete packaged flow records no external page-data request. |
| F-1-9 | Privacy names and tests the sole Sociobot license-verification request. |
| F-1-10 | Unsupported merchant/refund promises remain absent. |
| F-1-11 | Route-specific title and social metadata update correctly. |
| F-1-12 | The phone CTA and its result text are above the fold. |
| F-1-13 | Fresh `npm ci` audit is clean. |
| F-1-14 | Public language consistently uses visible control and command. |
| F-1-15 | Sample copy names controls and real-page isolation. |
| F-1-16 | The preview heading names its controls. |
| F-1-17 | The paid feature is clearly named saved command names. |
| F-1-18 | The website performs a truthful token handoff; the popup restores Pro. |
| F-1-19 | README and site consistently say current page. |
| F-1-20 | Demo documentation states separation before its storage prefix. |
| F-1-21 | Documentation calls the artifact a Chrome extension ZIP. |
| F-1-22 | The 180px Apple touch icon is present and packaged. |
| F-1-23 | The enforced copy audit covers all extracted public strings. |
| F-2-1 | Phone copy and README state desktop-only installation and all Chrome steps. |
| F-2-2 | History restores route, focus, and scroll. |
| F-2-3 | Pro proof uses the real popup UI, verification fixture, reload, and invocation. |
| F-2-4 | Free-core proof uses the packaged popup, not the web demo. |
| F-2-5 | Privacy tests drive UI and record traffic and storage. |
| F-2-6 | Claims cover the documented controls, safety categories, typing fallback, and demo isolation. |
| F-2-7 | The first-screen price fact identifies saved command names. |
| F-2-8 | CI enforces complete extracted copy and word counts. |
| F-2-9 | Checkout explicitly names its hosted Dodo destination. |
| F-2-10 | Speech availability and typing fallback are plain language. |
| F-3-1 | Return-token handoff is focused and the popup is the only Pro restore path. |
| F-3-2 | Query and fragment tokens are scrubbed without website browser-storage writes. |
| F-3-3 | Platform support is declared and package/phone-tested. |
| F-4-1 | Submit and documented account, subscription, record, and money actions share the review policy. |
| F-5-1 | Review confirmation names the pending control and resets when closed. |
| F-5-2 | Live ZIP verification compares member contents, not archive timestamps. |
| F-6-1 | Finance/sign-in copy now states the exact conservative detection boundary and cautions on other financial pages. |
| F-6-2 | Browser-storage wording is narrow; tests prove token request and fragment boundaries. |

## What would make this perfect

Nothing is required for the stated product scope. Maintain the existing claim,
demo-isolation, packaged-extension, and live-route checks whenever copy or
browser permissions change.
