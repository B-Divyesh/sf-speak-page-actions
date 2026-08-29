# Adversarial first-read review 4 — FAIL

**Product:** Speak Page Actions  
**Candidate:** `e372ed1c7246f0b45fc79811c00fb9d6180d54bb`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Reviewed:** 2026-08-29, fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The first screen is clear, the one-click demo is immediate and isolated, and all 18 declared claim commands pass independently from a clean clone. One blocking safety defect remains: several ordinary destructive controls run without review, despite the product and claim registry promising review for other sensitive controls.

There is **one blocking finding**. PASS requires zero findings.

## Cold first read

No scrolling or interaction occurred before these answers.

| Viewport | What this does | Who it is for | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Lets a person say or type the name of a visible browser control. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. The button ends at y=438 and its outcome ends at y=509. |
| 1440×900 | Lets a person operate visible browser controls by voice or typing, with review before named sensitive actions. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. |

The first screen succeeds through “Speak the action you need,” “For people with limited vision or hand mobility, say or type a visible control’s name,” and “Opens four sample controls without changing a real page.”

## Findings

### Blocking

#### F-4-1 — Common destructive controls bypass review

- **Quote/location:** Landing step: “Review sensitive actions.” Claim `destructive-review`: “Submit, delete, and other sensitive controls require review.” `src/lib/page-agent.ts:12` limits its matcher to `delete|remove|discard|destroy|publish|send|submit|pay|purchase|place order|sign out`.
- **Evidence:** The shipped predicate returns false for **Cancel subscription**, **Unsubscribe**, **Archive conversation**, and **Deactivate account**. The collector marks each `destructive: false`, and `SPA_ACTIVATE` clicks it immediately because it uses the same predicate at `src/lib/page-agent.ts:64`. The independently passing tagged test covers submit, delete, publish, send, and pay only.
- **Why this fails:** Cancelling a subscription or deactivating an account is an ordinary destructive action. A visitor relying on the review safeguard can cause that action with a spoken or typed command and receive no confirmation. This fails the brief’s confirmation requirement and leaves the broad “other sensitive controls” claim incompletely tested.
- **Concrete fix:** Define and document a conservative sensitive-action policy that includes `cancel subscription`, `unsubscribe`, `archive`, `deactivate`, `close account`, and comparable irreversible labels. Use it at collection and activation. Extend `@claim:destructive-review` with those controls; assert no action event occurs until review is confirmed, then assert the confirmed action runs.

## Copy audit

Count rule: whitespace-delimited tokens. Punctuation, hyphenated forms, URLs, paths, and `$12` count as one word. No landing or README sentence exceeds 22 words. The one flagged statement is the broad safety promise in F-4-1; no banned plain-words term, inconsistent product term, mood heading, or non-result-naming product button was found.

### Landing-page sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 | — |
| Opens four sample controls without changing a real page. | 9 | — |
| Desktop Chrome and Chromium only. | 5 | — |
| Mobile browsers can run the demo but cannot install this extension. | 11 | — |
| Page labels stay in your browser | 6 | — |
| Works offline after the first visit | 6 | — |
| Core actions are free; saved command names cost $12 once | 10 | — |
| A printed browser page with a sound wave becoming a pointer. | 11 | — |
| Original generated artwork, made for Speak Page Actions. | 8 | — |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 | — |
| Open the extension. | 3 | — |
| It scans the current page only. | 6 | — |
| Hold to speak. | 3 | — |
| Speak when your browser can process speech on this device, or type the visible control name. | 16 | — |
| Review sensitive actions. | 3 | F-4-1 |
| It asks before actions that submit, delete, publish, send, or pay. | 11 | F-4-1 |
| It does not listen in the background. | 7 | — |
| It never lists password fields. | 5 | — |
| Mobile browsers cannot install this extension. | 6 | — |
| You can still use the demo on this device. | 9 | — |
| Download and unzip the extension ZIP. | 6 | — |
| Open chrome://extensions on desktop Chrome or Chromium. | 7 | — |
| Turn on Developer mode. | 4 | — |
| Choose Load unpacked. | 3 | — |
| Select the unzipped extension folder. | 5 | — |
| Pro costs $12 once. | 4 | — |
| Save a short name for a visible control. | 8 | — |
| Core page actions and safety checks are free. | 8 | — |
| Opens Dodo’s checkout in this tab. | 6 | — |
| The website cannot turn on Pro inside your installed extension. | 10 | — |
| Open the extension on a normal page. | 7 | — |
| Open Restore Pro and save command names. | 7 | — |
| Paste your token and choose Restore Pro. | 7 | — |
| Speak visible page actions with review before sensitive clicks. | 9 | F-4-1 |
| v1.0.0 · Original generated illustration disclosed above. | 7 | — |

### Landing headings and controls

| Copy | Words | Result |
| --- | ---: | --- |
| Browser controls you can use by voice | 7 | Concrete kicker. |
| Speak the action you need | 5 | One clear h1. |
| What the extension shows | 4 | Concrete section label. |
| Visible controls listed by the extension | 6 | Out-of-context h2. |
| How Speak Page Actions works | 5 | Concrete h2. |
| What it does not do | 5 | Concrete h2. |
| Install on desktop Chrome or Chromium | 6 | Concrete h2. |
| Save your own command names | 5 | Concrete h2. |
| Open the extension to restore Pro | 6 | Concrete h3. |
| Try it with sample data | 5 | Result-naming demo action. |
| Download the desktop extension ZIP | 5 | Result-naming download action. |
| Buy Pro in hosted checkout — $12 once | 8 | Names result and destination. |
| Copy license token | 3 | Result-naming action. |

### README sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Speak visible browser controls on an ordinary page. | 8 | — |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | — |
| The extension scans only the current page after you open it. | 11 | — |
| Hold the speak button and say a visible control name, such as “click save address.” | 15 | — |
| Hold Space or Enter to speak; release the key to stop. | 11 | — |
| It asks before controls that may publish, submit, delete, pay, or send. | 12 | F-4-1 |
| Password fields are never listed. | 5 | — |
| Try four sample controls at the one-click demo. | 8 | — |
| Sample changes use separate browser storage and do not change extension settings. | 12 | — |
| Keys start with `demo:spa:` for verification. | 6 | — |
| Install on desktop Chrome or Chromium only. | 7 | — |
| Download and unzip the packaged ZIP, open chrome://extensions, turn on Developer mode, choose Load unpacked, then select the unzipped folder. | 20 | — |
| Mobile browsers can use the demo but cannot install this extension. | 11 | — |
| `npm run build:site` is the static deployment command. | 8 | — |
| It writes the site to `dist/site/` and includes the downloadable extension at `dist/site/downloads/speak-page-actions.zip`. | 13 | — |
| The extension scans only the current page after you open it. | 11 | — |
| It does not capture background microphone audio. | 7 | — |
| Spoken commands work only when your browser can process speech on this device. | 13 | — |
| You can type the same command when speech is unavailable. | 10 | — |
| The public site works offline after its first visit. | 9 | — |
| See Privacy and Terms. | 4 | — |
| MIT. | 1 | — |
| The optional Pro license costs $12 once and saves your own command names. | 13 | — |
| Core accessibility actions and safety checks are free. | 8 | — |
| Open the extension on a normal page. | 7 | — |
| Open Restore Pro and save command names. | 7 | — |
| Paste your license token, then choose Restore Pro. | 8 | — |
| The website does not store license tokens. | 7 | — |

README headings — **Run locally**, **Privacy and limits**, **Restore Pro**, and **License** — are concrete. Its controls and links describe their destinations. Terminology remains consistent: **visible control**, **command**, **demo**, **review**, **extension**, and **command name**.

## Demo, claims, and structure

- A fresh 390×844 context opened `/?demo=1` directly with the persistent banner, all four sample checkout controls, and its seeded result. **Save address** wrote only `demo:spa:sample`; Reset removed it; Start for real removed it and opened `/#install`. The complete observed demo request log was same-origin. Offline reload passed in the declared sandbox test.
- From clean clone `/tmp/speak-page-actions-review-4.C1zGhO`, all 18 exact registry commands passed independently: `sample-action`, `demo-local`, `demo-isolation`, `offline-reload`, `active-tab-only`, `on-device-speech`, `typed-command`, `destructive-review`, `undo-local-delete`, `visible-labels`, `password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`, `page-data-local`, `extension-local-storage`, `license-verification`, and `desktop-chromium-only`.
- `npm test` passed 5 Vitest and 32 Playwright tests. `npm run lint`, `npm run build`, `npm run test:package`, and `npm audit --audit-level=low` also passed.
- The live route check confirmed expected route-specific title, description, canonical, Open Graph/Twitter fields, one h1, main, favicon, and no console errors for `/`, `/demo`, `/privacy`, `/terms`, and the styled HTTP 404. Crawled internal links, `robots.txt`, `sitemap.xml`, and the ZIP returned 200; checkout returned its explicit Dodo redirect.
- `verify-url.sh` passed live home: HTTP 200 in 725 ms, no console errors, `lang=en`, one h1, main, no missing alt, and no unlabeled button. Live mobile Axe reported no serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and `/404`.
- The production ZIP requests only `activeTab`, `scripting`, `storage`, and the Sociobot verification origin. No missing AI, import/export, or sync feature is implied by this deterministic local-first tool; no decorative AI feature or provider key was found.

The registry covers the operational landing/README claims. Generated-art provenance is documented in `.factory/design.md`; it is not a visitor-operational product claim. F-4-1 is a too-broad listed claim whose tagged test does not exercise its promised class of controls.

## Earlier-history recheck

Every prior review, polish record, and handoff was read. The table confirms current code/live behaviour rather than accepting a “fixed” label.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Implicit, explicit, and image submits require confirmation before activation. |
| F-1-2 | Packaged popup handles pointer, Space, Enter, and cancellation. |
| F-1-3 | Phone demo shows four controls and a seeded result before interaction. |
| F-1-4 | Reset/Start clear only `demo:spa:`; Start opens installation. |
| F-1-5 | Popup restores Pro, saves/reloads/invokes a command name. |
| F-1-6 | Popup drives free normal action and sensitive review with empty paid state. |
| F-1-7 | Popup uses local extension storage and empty sync storage. |
| F-1-8 | Complete packaged flow records no external page-data request. |
| F-1-9 | Privacy names the explicit Sociobot verification request only. |
| F-1-10 | Unsupported merchant/refund wording is absent from Terms. |
| F-1-11 | Client routes update title, description, canonical, OG, and Twitter metadata. |
| F-1-12 | Demo action and its outcome fit above the 390×844 fold. |
| F-1-13 | Clean-clone audit reports zero vulnerabilities. |
| F-1-14 | Current copy uses visible control and command consistently. |
| F-1-15 | Demo copy names four controls and real-page isolation. |
| F-1-16 | Visible-controls heading works out of context. |
| F-1-17 | Saved command names are explained in landing, README, and popup. |
| F-1-18 | Site uses a truthful checkout-return handoff; popup performs Restore Pro. |
| F-1-19 | README consistently says current page. |
| F-1-20 | Demo storage outcome appears before its key prefix. |
| F-1-21 | README calls the artifact a Chrome extension ZIP. |
| F-1-22 | Linked 180px Apple touch icon is present and package-tested. |
| F-1-23 | Copy audit covers extracted routes, popup, 404, states, and README. |
| F-2-1 | Desktop Chrome/Chromium limits and installation steps are shown and claim-tested. |
| F-2-2 | Back/Forward restores route focus and saved scroll. |
| F-2-3 | Pro test drives real popup fields and recorded verification. |
| F-2-4 | Free-core test drives packaged popup UI rather than website demo. |
| F-2-5 | Privacy/storage tests record requests and user-created storage. |
| F-2-6 | Registry covers named controls, fields, fallback, and isolation; F-4-1 is its remaining sensitive-category gap. |
| F-2-7 | First-screen price fact names saved command names. |
| F-2-8 | Audit count and extracted-copy coverage pass. |
| F-2-9 | Hosted checkout and Dodo destination are disclosed before navigation. |
| F-2-10 | Speech copy explains browser-local availability and typed fallback. |
| F-3-1 | Website no longer claims it can activate extension Pro. |
| F-3-2 | Checkout token is scrubbed and absent from checked website storage/cache. |
| F-3-3 | Desktop/mobile support has a declared package-and-phone claim test. |

F-4-1 is a newly found safety gap, not a regression of a merely marked-fixed item.

## What would make this perfect

Apply the conservative sensitive-action policy in F-4-1, prove it through the real popup review flow, then rerun the clean-clone claims and this cold-read review. With that one safety gap closed, the product would be PASS-adjacent.
