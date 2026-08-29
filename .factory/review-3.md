# Adversarial first-read review 3 — FAIL

**Product:** Speak Page Actions  
**Candidate:** `9a058e9c93fdf909cefdc01e1c40189bcddd475c`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Reviewed:** 2026-08-29, fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The product is clear and tryable on first read. The live demo is immediate, realistic, isolated, resettable, and same-origin. All 17 declared claim commands pass from a clean clone. However, the public license-recovery flow cannot activate Pro in the extension and its privacy statement is false for that flow. There are **two blocking findings and one minor finding**. PASS requires zero findings.

## Cold first read

No scrolling or interaction occurred before these answers.

| Viewport | What this does | Who it is for | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Lets a person say or type the name of a visible browser control. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. The full action and its outcome are visible: the button ends at y=438 and its explanation at y=509. |
| 1440×900 | Lets a person use visible browser controls by voice or typing, with review before sensitive actions. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. |

The exact first-screen copy that succeeds is “Speak the action you need,” “For people with limited vision or hand mobility, say or type a visible control’s name,” and “Try it with sample data.”

## Findings

### Blocking

#### F-3-1 — The public “Restore a license” path cannot restore Pro in the extension

- **Quote/location:** Landing button **“Restore a license”** and its success status **“Your pro license is active.”** The extension’s paid feature is “Save your own command names (Pro).”
- **Evidence:** On the live landing page, the form uses ordinary site `localStorage` (`sb_license:speak-page-actions` and `spa:license-verdict`). The live page has no `chrome.storage` API. The packaged extension uses separate `browser.storage.local` keys in `src/entrypoints/popup/main.ts`. A website cannot write that extension storage. The declared `@claim:pro-aliases` test opens the landing form but does not submit it; it separately enters a token in the packaged popup.
- **Why this fails:** A buyer who follows the public recovery action can see a success state on the website but still has no active Pro state in the extension, where saved command names are used. The label also says a result occurs when clicking only reveals a form. This is neither end-to-end nor an honest first-time instruction.
- **Concrete fix:** Remove the website recovery form and replace it with **“Open the extension to restore Pro”**, followed by the exact popup steps; or implement a deliberately user-mediated handoff that the extension can consume. Do not show “Your pro license is active” on the site unless the extension has actually received it. Add an end-to-end test from the public recovery route through an extension reload and a saved command name, or test that the site no longer stores a license token.

#### F-3-2 — The Privacy page makes a false storage claim for the public license flow

- **Quote/location:** `/privacy`: **“Aliases and saved license data stay in browser-local extension storage.”** Landing restore status: **“License saved on this device.”**
- **Evidence:** A fresh live context submitted the harmless token `review-3-probe`. It created the site-origin localStorage keys `sb_license:speak-page-actions` and `spa:license-verdict`; `chrome.storage` was unavailable in that page. `src/site/main.ts` performs those writes. `@claim:extension-local-storage` verifies only data saved through the popup, so it does not prove the broader Privacy sentence.
- **Why this fails:** The stated storage boundary matters to a buyer entering a license token. It says all saved license data is extension-local, while the advertised website form stores a copy in ordinary website storage.
- **Concrete fix:** Prefer removing the site storage path as in F-3-1. If it remains, rewrite the privacy copy to name both stores and their purpose, retention, and removal method. Extend `@claim:extension-local-storage` (or add a dedicated claim) to exercise every public license form and assert the documented storage boundary.

### Minor

#### F-3-3 — Desktop/mobile compatibility statements are unlisted claims

- **Quote/location:** Landing: **“Desktop Chrome and Chromium only.”** and **“Mobile browsers can run the demo but cannot install this extension.”** README repeats both statements.
- **Evidence:** `.factory/claims.json` has no entry for platform support or the mobile-install limit. The general package and accessibility tests do not constitute a tagged, clean-sandbox claim test for these visitor-facing statements.
- **Why this fails:** These are useful and likely true scope boundaries, but a visitor may rely on them before downloading. The claims contract requires a listed observable test for every such public statement.
- **Concrete fix:** Add a `desktop-chromium-only` claim whose test verifies the packaged MV3 artifact, desktop installation route, and the phone disclosure; or narrow/remove the statements if that support contract cannot be tested.

## Copy audit

Count rule: whitespace-delimited tokens. Punctuation, hyphenated forms, URLs, paths, and `$12` count as one word. No listed sentence exceeds 22 words. The tables include all static landing and README sentences; conditional landing license statuses are listed separately.

### Landing-page sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 | — |
| Opens four sample controls without changing a real page. | 9 | — |
| Desktop Chrome and Chromium only. | 5 | F-3-3 |
| Mobile browsers can run the demo but cannot install this extension. | 11 | F-3-3 |
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
| Review sensitive actions. | 3 | — |
| It asks before actions that submit, delete, publish, send, or pay. | 11 | — |
| It does not listen in the background. | 7 | — |
| It never lists password fields. | 5 | — |
| Mobile browsers cannot install this extension. | 6 | F-3-3 |
| You can still use the demo on this device. | 9 | F-3-3 |
| Download and unzip the extension ZIP. | 6 | — |
| Open chrome://extensions on desktop Chrome or Chromium. | 6 | F-3-3 |
| Turn on Developer mode. | 4 | — |
| Choose Load unpacked. | 3 | — |
| Select the unzipped extension folder. | 5 | — |
| Pro costs $12 once. | 4 | — |
| Save a short name for a visible control. | 8 | — |
| Core page actions and safety checks are free. | 8 | — |
| Opens Dodo’s checkout in this tab. | 6 | — |
| Speak visible page actions with review before sensitive clicks. | 9 | — |

### Conditional landing license statuses

| Sentence | Words | Flag |
| --- | ---: | --- |
| Your pro license is active. | 5 | F-3-1 |
| License saved on this device. | 5 | F-3-2 |
| Checking it now. | 3 | — |
| This license is not active. | 5 | — |
| You can buy a new license. | 6 | — |
| Your cached pro license is active. | 6 | F-3-1 |
| It will be checked when you are online. | 8 | — |
| License saved. | 2 | F-3-2 |

### README sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Speak visible browser controls on an ordinary page. | 8 | — |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | — |
| The extension scans only the current page after you open it. | 11 | — |
| Hold the speak button and say a visible control name, such as “click save address.” | 15 | — |
| Hold Space or Enter to speak; release the key to stop. | 11 | — |
| It asks before controls that may publish, submit, delete, pay, or send. | 12 | — |
| Password fields are never listed. | 5 | — |
| Try four sample controls at the demo page. | 8 | — |
| Sample changes use separate browser storage and do not change extension settings. | 12 | — |
| Keys start with `demo:spa:` for verification. | 6 | — |
| Install on desktop Chrome or Chromium only. | 6 | F-3-3 |
| Download and unzip the packaged ZIP, open `chrome://extensions`, turn on Developer mode, choose Load unpacked, then select the unzipped folder. | 20 | F-3-3 |
| Mobile browsers can use the demo but cannot install this extension. | 11 | F-3-3 |
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

### Headings and controls

The headings are concrete and work as a screen-reader outline. No metaphor or marketing slogan was found. The primary action, download, checkout, and form-submit controls name their results. **Restore a license** is flagged in F-3-1: the click only opens a form and the form cannot restore Pro in the extension.

## Demo, privacy, claims, and structure

- **Demo:** Fresh live `/demo` at 390×844 showed the persistent banner, all four realistic checkout controls, and “Found four visible controls on Sample checkout.” before interaction. `Save address` produced “Used Save address.” and only `demo:spa:sample` appeared. Reset removed that key; Start for real removed it and opened `/#install`. The complete request log was same-origin.
- **Declared claims:** From a clean clone at `/tmp/speak-page-actions-review-3.uKNvFD`, every exact command in `.factory/claims.json` passed: `sample-action`, `demo-local`, `demo-isolation`, `offline-reload`, `active-tab-only`, `on-device-speech`, `typed-command`, `destructive-review`, `undo-local-delete`, `visible-labels`, `password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`, `page-data-local`, `extension-local-storage`, and `license-verification`.
- **Quality gates:** In that clone, `npm test` passed (5 Vitest and 30 Playwright tests), `npm run build`, `npm run test:package`, `npm run lint`, and `npm audit --audit-level=low` passed. The rebuilt asset names `index-tnEQbV6y.js` and `index-DpcHHDDY.css` match the live page.
- **Sandbox behavior:** The live demo made only product-origin requests and did not change real localStorage sentinels. Offline reload is covered by the declared clean-context test. No CLI or library playground applies to this browser-extension product.
- **Routes and metadata:** `/`, `/demo`, `/privacy`, and `/terms` had the expected route-specific title, one h1, main landmark, description, canonical, Open Graph/Twitter fields, favicon, and no console errors. Browser Back restored a 2391px home scroll position and focused the home h1; Forward restored the Privacy route. The styled unknown URL returned HTTP 404. `robots.txt`, `sitemap.xml`, the extension ZIP, route links, and hosted checkout resolved successfully. All visible phone targets were at least 44×44 CSS pixels.
- **Visual and leverage check:** The dithered print treatment is distinct and matches `.factory/design.md`; it is not a generic SaaS layout. The brief does not imply a further AI, import/export, or sync feature. No decorative AI feature or provider key was found.

## Earlier-history recheck

Every prior review and polish record was read. The table confirms the current live/code state rather than relying on its “fixed” labels.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Implicit and explicit submits are sensitive in `page-agent`; declared review test covers both. |
| F-1-2 | Popup handles pointer, Space, and Enter holds; declared test drives all three. |
| F-1-3 | Live phone demo shows four controls and seeded result above the first viewport. |
| F-1-4 | Live Reset/Start remove only `demo:spa:` keys and Start opens installation. |
| F-1-5 | Popup UI saves, reloads, and invokes a paid command name in the declared test. |
| F-1-6 | Packaged popup uses free normal and sensitive actions with empty paid state. |
| F-1-7 | Popup storage test confirms local keys and empty sync storage; F-3-2 identifies the separate website path. |
| F-1-8 | Complete packaged extension flow has no external page-data request. |
| F-1-9 | Privacy copy names the explicit Sociobot verification request. |
| F-1-10 | Unsupported merchant/refund assertions remain absent. |
| F-1-11 | Client routes update title, canonical, OG, and Twitter metadata. |
| F-1-12 | Demo action and explanation fit above the 390×844 fold. |
| F-1-13 | Clean-clone audit reports zero findings. |
| F-1-14 | Current copy consistently uses visible control and command. |
| F-1-15 | Demo copy names four controls and real-page isolation. |
| F-1-16 | “Visible controls listed by the extension” is an out-of-context heading. |
| F-1-17 | Saved command names are explained in landing, README, and popup. |
| F-1-18 | The former “Paste it” label is gone; F-3-1 covers the remaining recovery-flow defect. |
| F-1-19 | README consistently uses current page. |
| F-1-20 | Demo storage outcome and prefix are documented. |
| F-1-21 | README calls the archive a Chrome extension ZIP. |
| F-1-22 | A linked 180px Apple touch icon is present and package-tested. |
| F-1-23 | The repository audit is broader than before; this review supplies the required landing/README audit. |
| F-2-1 | Phone and README now plainly state desktop Chrome/Chromium installation steps. |
| F-2-2 | Live Back/Forward restored route, h1 focus, and scroll state. |
| F-2-3 | Pro evidence now uses the real popup form, recorded verification, reload, and action. |
| F-2-4 | Free-core evidence uses the packaged popup scan, action, and review. |
| F-2-5 | Extension privacy/storage/verification tests now drive real UI and record requests. |
| F-2-6 | Current declared tests cover links, fields, sensitive categories, typed fallback, and demo isolation. |
| F-2-7 | The first-screen fact now says “saved command names.” |
| F-2-8 | Current copy audit remains useful but omits some README sentences; the complete audit above rechecks them. |
| F-2-9 | Checkout control names the hosted destination and adjacent Dodo disclosure. |
| F-2-10 | Speech copy now explains local browser processing in plain language. |

## What would make this perfect

Make recovery a single truthful path that activates Pro where the feature lives, state the exact license-storage boundary, add the missing platform claim test, and rerun this complete cold-read review with zero findings.
