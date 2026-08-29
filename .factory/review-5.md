# Adversarial first-read review 5 — FAIL

**Product:** Speak Page Actions  
**Candidate:** `e9d6367fc75734a6885dbd209091d711df56e1e7`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Reviewed:** 2026-08-29 UTC, fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The real job is clear on first read, the direct demo is immediate and
isolated, all 18 declared claim commands pass independently from a clean clone,
and the previously reported product defects are fixed. Two minor findings
remain: one confirmation button does not say what it will do, and the committed
live-verification command reports a false deployment mismatch for equivalent
ZIP archives. PASS requires zero findings.

## Cold first read

No scroll or interaction occurred before recording these answers.

| Viewport | What it does | Who it is for | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Lets a person say or type the name of a visible browser control. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. The full button, its result, desktop restriction, and three product facts are visible. |
| 1440×900 | Lets a person use visible browser controls by voice or typing, with review for sensitive actions. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. |

The exact first-screen text that supplies those answers is “Speak the action
you need,” “For people with limited vision or hand mobility, say or type a
visible control’s name,” and “Try it with sample data.” The phone loaded with
no console errors and only same-origin requests.

## Findings

### Minor

#### F-5-1 — The extension confirmation button does not name the result

- **Quote/location:** Packaged-extension review dialog button: **“Use action”**
  (`src/entrypoints/popup/index.html`).
- **Why this matters:** The dialog identifies a potentially sensitive control,
  such as “Delete saved draft,” but the final button is generic. A keyboard or
  screen-reader user must retain the earlier dialog text to know what pressing
  the button will do. This does not meet the result-naming button rule.
- **Concrete fix:** Set the confirm button from the pending control label, for
  example **“Delete saved draft”** or **“Publish changes”**, and restore its
  default when the dialog closes. Extend `@claim:destructive-review` to assert
  the label before confirmation.

#### F-5-2 — `verify:live` falsely fails when the deployed ZIP has equivalent contents

- **Quote/location:** `scripts/verify-live.mjs:168-170` compares the SHA-256
  of the complete deployed and newly built `speak-page-actions.zip` archives.
- **Evidence:** A fresh `BASE_URL=https://speak-page-actions.sociobot.in npm
  run verify:live` exited nonzero at line 170. The deployed ZIP hash was
  `037d372b…`, while the fresh local ZIP hash was `98cc146e…`. Both archives
  contain the same 22 entries and every uncompressed member has the same
  SHA-256; their only observed difference is ZIP entry timestamps (15:23 UTC
  deployed versus 16:03 UTC local).
- **Why this matters:** The command claimed as independent release evidence
  cannot currently distinguish a stale/tampered download from a reproducible
  build whose archive metadata changed. It can fail a valid release and masks
  the check it is intended to provide.
- **Concrete fix:** Make ZIP output reproducible (fixed entry timestamps and
  metadata) or, preferably, compare the sorted member names and uncompressed
  member hashes in `verify-live.mjs`. Keep a test that proves timestamp-only
  archive changes do not fail the deployed-artifact check.

## Demo and sandbox check

`/?demo=1` and the landing action both opened the demo in one click. At 390px,
the persistent **“Demo — sample data, nothing is saved”** banner, all four
sample controls, and the seeded “Found four visible controls on Sample
checkout.” result were available before input. Running **Save address** changed
only demo state; **Reset demo** removed it. Request logging recorded only
`https://speak-page-actions.sociobot.in` during the flow. The demo storage key
uses `demo:spa:` and real-setting sentinels were preserved by reset and exit.

## Claims and verification

From fresh clone `/tmp/speak-page-actions-review5-clean-b1b8ka`, `npm ci`,
`npm run build`, and each exact command in `.factory/claims.json` passed:

| Claim IDs | Result |
| --- | --- |
| `sample-action`, `demo-local`, `demo-isolation`, `offline-reload` | pass |
| `active-tab-only`, `on-device-speech`, `typed-command`, `destructive-review` | pass |
| `undo-local-delete`, `visible-labels`, `password-exclusion`, `push-to-talk` | pass |
| `pro-aliases`, `core-free`, `page-data-local`, `extension-local-storage` | pass |
| `license-verification`, `desktop-chromium-only` | pass |

No claim-like landing or README sentence lacks a matching registry entry. In
particular, local page-label handling, offline reload, free core actions,
saved command names, visible-control collection, typed fallback, speech
availability, review, password exclusion, demo isolation, and platform
support are all listed and tested. The deterministic, local-first brief does
not imply an AI feature, import/export, or sync feature.

`npm audit --audit-level=low`, `npm run lint`, `npm run build`, and `npm run
test:package` also passed. The live structural check confirmed titles,
descriptions, canonicals, one h1 and one main on `/`, `/demo`, `/privacy`, and
`/terms`; a designed HTTP 404; internal links; responsive 390px layout;
header/footer legal links; CSP response headers; and the deployed JS/CSS
assets matching the fresh build. Back/Forward manually restored route focus
and prior scroll position. The first immediate `verify:live` run also raced
the requestAnimationFrame focus update once; a direct replay confirmed the
heading was focused after navigation. F-5-2 is the repeatable verifier defect.

## Copy audit

Count rule: whitespace-delimited tokens. Punctuation, hyphenated words,
paths, URLs, and `$12` each count as one word. The tables list every unique
sentence or user-facing landing/README string; repeated footer text is counted
once. No listed sentence exceeds 22 words or uses a banned marketing term.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| Speak Page Actions home | 4 |
| Speak Page Actions | 3 |
| Main navigation | 2 |
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
| Product facts | 2 |
| A printed browser page with a sound wave becoming a pointer. | 11 |
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
| Footer navigation | 2 |
| Terms | 1 |
| Built by Param Factory | 4 |
| Speak visible page actions with review before sensitive clicks. | 9 |
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
| Try four sample controls at the one-click demo. | 8 |
| Sample changes use separate browser storage and do not change extension settings. | 12 |
| Keys start with demo:spa: for verification. | 6 |
| Run locally | 2 |
| Chromium extension development mode | 4 |
| static site at the shown local URL | 7 |
| extension in dist/extension and site in dist/site | 7 |
| check the downloadable Chrome extension ZIP | 6 |
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
| The website does not store license tokens. | 7 |
| License | 1 |
| MIT. | 1 |
| The optional Pro license costs $12 once and saves your own command names. | 13 |
| Core accessibility actions and safety checks are free. | 8 |

Terminology is consistent: **visible control** (a button, link, or labelled
field), **command** (spoken or typed instruction), **demo** (isolated try-out),
**review** (confirmation for a sensitive control), and **command name**
(personal shortcut). The single button exception is F-5-1.

## Earlier finding closure

Every earlier review and polish/handoff was read. The live site and source
confirm the following closure map; no earlier finding is reopened.

| Earlier IDs | Confirmation |
| --- | --- |
| F-1-1, F-4-1 | Actual submit semantics and all documented account/plan-ending labels require review in collection and activation; packaged-popup claim passes. |
| F-1-2 | Pointer, Space, Enter, and cancellation push-to-talk behavior is exercised in the packaged popup. |
| F-1-3, F-1-4 | Phone demo starts with four controls/result; Reset and Start for real preserve real storage and clear demo storage. |
| F-1-5, F-1-6, F-2-3, F-2-4 | Pro command names and free core flows are driven through the packaged popup, not seeded storage. |
| F-1-7 to F-1-10, F-2-5, F-2-6 | The privacy, storage, request, license, typed fallback, demo-isolation, and visible-control claims are registered and exercised. Unsupported legal promises were removed. |
| F-1-11, F-2-2 | Route metadata, canonical values, history scroll, and focus work in the deployed client routes. |
| F-1-12, F-2-1, F-2-7, F-3-3 | The mobile first screen explains the demo and desktop-only install path; install instructions and the exact paid item are explicit. |
| F-1-13 | Fresh clean-clone audit reports zero vulnerabilities. |
| F-1-14 to F-1-21, F-2-8 to F-2-10 | Current landing and README language uses the repaired plain terms, explains Dodo checkout, and has a complete enforced copy audit. |
| F-1-22 | A linked 180×180 Apple touch icon is packaged. |
| F-1-23 | The current audit covers 190 rows and 184 extracted strings with checked counts. |
| F-3-1, F-3-2 | The site only offers a focused copy handoff for a returned token; it does not store or activate the extension license. |

## What would make this perfect

Make the sensitive-action confirmation button name the exact action and make
the deployment verifier compare reproducible ZIP contents. Then rerun the full
clean-clone claim registry and live verifier without a false failure.
