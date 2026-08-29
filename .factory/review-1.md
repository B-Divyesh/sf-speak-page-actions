# Adversarial first-read review 1 — FAIL

**Product:** Speak Page Actions  
**Candidate:** `c220b7a8f027a5ab8117fa9f058bdb31ceb602e5`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Reviewed:** 2026-08-29, fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The landing page is understandable, the public demo opens in one
click, all 13 declared claim commands pass, and the deployed assets match the
candidate. The product still has six blocking findings: an ordinary implicit
form-submit button bypasses review, the main speech control does nothing on
Enter, the phone demo hides its actual sample actions below the first screen,
leaving the demo neither clears demo state nor starts installation, and two
paid/free claims are not tested against the extension behavior they promise.

There are **23 findings: 6 blocking, 6 major, and 11 minor**. PASS requires zero.

## Cold first read

I did not scroll before recording these answers.

| Viewport | What does this do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | It lets someone speak a visible page label to use a browser control, with review for sensitive actions. | People with limited vision or hand mobility. | **Try it with sample data**; its label is readable at the bottom edge. | The three questions are answerable. The button is partly clipped and “Opens a safe sample page in one click” is below the fold; see F-1-12. |
| 1440×900 | It turns visible page labels into voice actions that can be reviewed. | People with limited vision or hand mobility. | **Try it with sample data**. | Pass. The action and explanation are fully visible. |

The exact first-screen text doing the work is “Speak the action you need” and
“For people with limited vision or hand mobility, it turns visible page labels
into reviewable voice actions.” This is clear enough to avoid a first-read
blocking finding, although “reviewable voice actions” is inconsistent jargon
(F-1-14).

## Findings

### Blocking

#### F-1-1 — Implicit form-submit buttons bypass the promised review

- **Quote/location:** Landing: “It asks before labels such as delete or
  publish.” README: “It asks before labels that may publish, submit, delete,
  pay, or send.” `src/lib/page-agent.ts:50` marks only a risky label or an
  explicit `type="submit"` attribute as destructive.
- **Evidence:** Running the shipped page agent against
  `<form><button>Save changes</button></form>` returned
  `{"label":"Save changes","kind":"button","destructive":false}`. In HTML,
  that button defaults to submit, so the extension can submit immediately
  without showing its review dialog. The declared destructive-review test uses
  only a button whose text starts with “Delete”; it does not cover submit
  semantics or the dialog.
- **Why this fails:** Review before submit is a core safety condition in the
  brief, not an edge feature. A visitor may rely on the explicit submit claim.
- **Concrete fix:** Treat `HTMLButtonElement.type === "submit"` and submit/image
  inputs as sensitive regardless of whether the `type` attribute is written.
  Add `@claim:destructive-review` cases for implicit and explicit submits and
  assert that no submit event or navigation occurs before confirmation.

#### F-1-2 — The main speech button is not operable with Enter

- **Quote/location:** Extension button “Hold to speak”; listeners at
  `src/entrypoints/popup/main.ts:59` handle pointer events and the Space key,
  but not Enter or `click`.
- **Evidence:** A native button fires `click` for Enter. This button has no
  click listener, and its key handlers only accept `' '`. The existing
  `@claim:push-to-talk` test searches built source for pointer-listener strings;
  it does not exercise keyboard behavior.
- **Why this fails:** The product is specifically for people with limited hand
  mobility. A standard button that silently fails on Enter violates the stated
  keyboard baseline.
- **Concrete fix:** Give Enter a documented start/stop interaction or expose a
  separate keyboard-operable toggle while keeping pointer push-to-talk. Test
  Space, Enter, pointer cancellation, `aria-pressed`, and recognition stop with
  a stub recognizer.

#### F-1-3 — The phone demo’s first screen does not show the sample actions

- **Quote/location:** `/demo` at 390×844 after one click. The screen shows the
  banner, headline, examples, input, **Run command**, and “Ready for a command.”
  The four actual sample actions begin below the viewport.
- **Evidence:** The first screenshot contains no visible “Save address,”
  “Shipping method,” “Review order,” or “Delete saved draft” action row. The
  “click save address” value is only placeholder text; no command has run.
- **Why this fails:** The required first demo screen must already show the
  product being used with realistic sample data. This screen shows setup, not
  a demonstrated result. A weak demo is explicitly blocking.
- **Concrete fix:** Put the four sample action rows above the command form on
  phone widths and seed a visible, reversible example result, such as “Found 4
  visible controls on Sample checkout.” Add a 390×844 assertion that at least
  the sample list and one completed result are inside the initial viewport.

#### F-1-4 — “Start for real” loops home and leaves demo state behind

- **Quote/location:** Demo banner link “Start for real,” `src/site/main.ts:25`.
- **Evidence:** After running “click save address,” the link navigated to `/`
  and left `demo:spa:sample` in localStorage. It did not open the extension
  download or installation instructions. **Reset demo** did remove the demo
  key and restore four actions, and pre-existing `spa:`/license sentinels were
  unchanged.
- **Why this fails:** Leaving demo mode must discard demo state or explicitly
  offer to keep it. “Start for real” also promises a start, but only restarts
  the landing page.
- **Concrete fix:** Clear all `demo:spa:` keys before leaving, then send the
  visitor to a short installation section or the extension download with the
  next browser step stated. Add an end-to-end assertion for destination and
  cleared demo keys while preserving real keys.

#### F-1-5 — The Pro-alias claim test verifies payment, not aliases

- **Quote/location:** Claim `pro-aliases`: “A $12 one-time Pro license adds
  local command aliases.” Landing: “It lets you save local aliases in the
  extension.”
- **Evidence:** The declared test at `tests/claims.spec.ts:167` checks the
  landing fact, restore form, hosted checkout, product ID, name, and price. It
  never opens the extension, saves an alias, confirms local storage, or uses
  the alias to run its target action.
- **Why this fails:** The payment path passes, but the feature a buyer receives
  remains untested. The review cannot leave a claim untested.
- **Concrete fix:** Use a recorded valid license-verification fixture, save an
  alias in the packaged extension, invoke it against a sample page, and assert
  the intended control runs and `spa:aliases` stays in extension-local storage.

#### F-1-6 — The free-core claim test exercises the website demo, not the extension

- **Quote/location:** Claim `core-free`: “Core page actions and safety checks
  stay free.”
- **Evidence:** The declared test at `tests/claims.spec.ts:182` runs the website
  demo’s “Save address” command with no landing-page license token. It never
  runs the packaged extension, its scan/action flow, or its review dialog.
- **Why this fails:** The separate demo implementation can pass even if the
  extension gates core actions. The promised product behavior is untested.
- **Concrete fix:** Launch the packaged extension with empty extension storage,
  scan a fixture page, run a normal action, and confirm a sensitive action can
  reach review without a license.

### Major

#### F-1-7 — Browser storage for settings and license tokens is an unlisted claim

- **Quote/location:** `/privacy`: “Settings and license tokens are stored in
  your browser.”
- **Why this fails:** No `claims.json` entry tests where these values are stored
  or that they are not synced/sent elsewhere.
- **Concrete fix:** Add a claim and packaged-extension test that records
  `browser.storage.local`, network requests, and sync storage during save and
  restore, or narrow the copy to the behavior that is tested.

#### F-1-8 — The no-browsing-history privacy claim is unlisted

- **Quote/location:** `/privacy`: “The product sends no page labels, spoken
  words, or browsing history to our servers.”
- **Why this fails:** `page-data-local` inspects the injected collector source;
  it does not observe the complete extension flow and does not cover browsing
  history. The on-device speech test also checks source strings rather than an
  outgoing-request log.
- **Concrete fix:** Split the sentence into independently testable claims. Run
  scan, typed command, on-device-recognition stub, review, and alias flows while
  recording extension requests; assert no page label, transcript, URL, or
  history is sent.

#### F-1-9 — The “only” network-request claim is unlisted

- **Quote/location:** `/privacy`: “Only a buyer’s license token may be checked
  with Sociobot.”
- **Why this fails:** “Only” describes every possible extension request, but no
  claim entry asserts that global boundary.
- **Concrete fix:** Add a request-log claim for the packaged extension and
  assert the sole allowed external request is the explicit license check, or
  rewrite: “When you restore Pro, the extension sends that license token to
  Sociobot for verification.”

#### F-1-10 — Merchant and refund statements are unlisted legal claims

- **Quote/location:** `/terms`: “Sociobot and Dodo are the merchant of record.
  Refunds and revoked licenses are handled through the checkout provider.”
- **Why this fails:** Visitors may rely on these statements when paying, but
  neither is represented in `claims.json`, and the checkout test proves only
  that a Dodo-hosted page opens with the expected product and price.
- **Concrete fix:** Confirm the actual merchant/refund responsibility, link the
  applicable policy, and add a contract test for the authoritative checkout
  text. If it cannot be tested, remove or qualify the statements.

#### F-1-11 — Social metadata remains the home-page metadata on other routes

- **Quote/location:** `/demo`, `/privacy`, and `/terms` all expose
  `og:title="Speak Page Actions — Speak visible page actions"` and the home
  description. Only `document.title`, description, and canonical are updated
  by `setMeta()` at `src/site/main.ts:12`. Twitter supplies only
  `twitter:card`.
- **Why this fails:** Shared previews for Privacy, Terms, and Demo describe the
  landing page instead of the route. The route metadata contract is incomplete.
- **Concrete fix:** Update OG title/description/image and Twitter
  title/description/image for every client route, and test direct deep links.
  Static route HTML is preferable for crawlers that do not execute JavaScript.

#### F-1-12 — The mobile first screen separates the action from its explanation

- **Quote/location:** 390×844 `/`: **Try it with sample data** starts at y=804
  and ends at y=850; the viewport ends at y=844. “Opens a safe sample page in
  one click” is entirely below the fold.
- **Why this fails:** The first-screen contract requires the primary action and
  what happens after clicking to appear together. A phone visitor sees a
  clipped control with no explanation.
- **Concrete fix:** Reduce or move the 390 px hero image so the full action and
  adjacent explanation fit above the fold; add a viewport regression test.

### Minor

#### F-1-13 — The previously disclosed dependency advisories remain

- **Quote/location:** Prior `.factory/handoff.md` known gap; fresh `npm audit`.
- **Evidence:** 10 development dependency findings remain: 1 low, 2 moderate,
  4 high, and 3 critical. They include `shell-quote`, `web-ext-run`, `tmp`, and
  `adm-zip`; no runtime dependency is shipped.
- **Concrete fix:** Update WXT and the affected toolchain, then rerun the build,
  extension package check, and audit. Document any advisory that cannot be
  removed and why it is unreachable in this repository.

#### F-1-14 — “Command layer” and “reviewable voice actions” are jargon and inconsistent terms

- **Quote/location:** Landing: “A small command layer for ordinary pages” and
  “it turns visible page labels into reviewable voice actions.” Elsewhere the
  same concepts are “visible actions,” “page actions,” “controls,” “commands,”
  and “labels.”
- **Why this fails:** A first-time reader must translate product terminology
  before understanding the concrete browser controls.
- **Concrete rewrite:** Kicker: **Browser controls you can use by voice**.
  Sentence: **For people with limited vision or hand mobility, it lets you say
  or type a visible control’s name.** Use “visible control” and “command”
  consistently afterward.

#### F-1-15 — “Safe sample” is vague where the copy can name the safeguard

- **Quote/location:** “Opens a safe sample page in one click.” README: “Try the
  safe sample at the demo route.”
- **Why this fails:** “Safe” is an adjective, not usable evidence.
- **Concrete rewrite:** **Opens four sample controls without changing a real
  page.** README: **Try four sample controls on the demo page.**

#### F-1-16 — “A short list you can check” does not name its section out of context

- **Quote/location:** Landing h2: “A short list you can check.”
- **Why this fails:** A screen-reader heading list does not say what is listed.
- **Concrete rewrite:** **Visible controls listed by the extension**.

#### F-1-17 — “Command aliases” is unexplained jargon

- **Quote/location:** “Core actions stay free; Pro aliases cost $12 once,”
  “Keep your own command aliases,” and README “saved local command aliases.”
- **Why this fails:** A visitor must infer that an alias is a shorter personal
  name for a visible action.
- **Concrete rewrite:** **Core actions stay free; save your own command names
  for $12 once.** Heading: **Save your own names for commands**.

#### F-1-18 — “Have a license? Paste it” does not name the button result

- **Quote/location:** Landing Pro button: “Have a license? Paste it.”
- **Why this fails:** Clicking does not paste anything; it reveals a form.
- **Concrete rewrite:** **Restore a license**.

#### F-1-19 — README alternates between “active tab” and “active page”

- **Quote/location:** README: “The extension scans the active tab when you open
  it,” then “The extension scans only the active page after you open it.”
- **Why this fails:** Two words describe the same scope, and “tab” is less
  consistent with the landing page.
- **Concrete rewrite:** Use **The extension scans only the current page after
  you open it.** in both places.

#### F-1-20 — README exposes storage implementation jargon before explaining the outcome

- **Quote/location:** “It uses the `demo:spa:` browser-storage namespace and
  does not touch extension settings.”
- **Why this fails:** “Browser-storage namespace” is implementation language.
- **Concrete rewrite:** **Sample changes use separate browser storage and never
  read or change your extension settings. Keys start with `demo:spa:` for
  verification.**

#### F-1-21 — README uses “MV3 consumer archive” without defining it

- **Quote/location:** Command comment: “verify the downloadable MV3 consumer
  archive.”
- **Why this fails:** It obscures a simple package check.
- **Concrete rewrite:** **check the downloadable Chrome extension ZIP**.

#### F-1-22 — The Apple touch icon is not the required 180 px asset

- **Quote/location:** `src/site/index.html:10` links
  `/icons/icon.svg`; the only PNG is 128×128.
- **Why this fails:** The site-structure contract requires a 180 px
  `apple-touch-icon`.
- **Concrete fix:** Add a product-art-derived 180×180 PNG, link it, and assert
  its dimensions in the package test.

#### F-1-23 — The repository copy audit is incomplete and has wrong counts

- **Quote/location:** `.factory/copy-audit.md` omits README, headings, buttons,
  alt text, footer, and dynamic license states. It counts the 17-word hero
  sentence as 16, “It never lists password fields” as 6 instead of 5, and the
  9-word aliases sentence as 10.
- **Why this fails:** The recorded proof cannot detect several copy problems
  found in this review.
- **Concrete fix:** Regenerate it from rendered copy and README with the scope
  and counting rule stated, then make its flagged rows match the rewrites above.

## Copy audit

Count rule: words are whitespace-delimited after removing Markdown markers.
Hyphenated forms and paths without spaces count as one word. No sentence is
over the 22-word hard cap, and no banned plain-words term appears. `Flag` points
to the separate finding and rewrite above.

### Landing-page sentences, including dynamic license states

| Copy | Words | Flag |
| --- | ---: | --- |
| For people with limited vision or hand mobility, it turns visible page labels into reviewable voice actions. | 17 | F-1-14 |
| Opens a safe sample page in one click. | 8 | F-1-15 |
| Works offline after the first visit. | 6 | — |
| A printed browser page with a sound wave becoming a pointer. | 11 | — |
| Original generated artwork, made for Speak Page Actions. | 8 | — |
| It reads buttons, links, and labelled fields already visible on the current page. | 13 | F-1-14 |
| Open the extension. | 3 | — |
| It scans the active page only. | 6 | F-1-19 |
| Hold to speak. | 3 | — |
| Use on-device speech, or type a label you can review. | 10 | F-1-14 |
| Review sensitive actions. | 3 | — |
| It asks before labels such as delete or publish. | 9 | F-1-1 |
| It does not listen in the background. | 7 | — |
| It never lists password fields. | 5 | — |
| Pro costs $12 once. | 4 | — |
| It lets you save local aliases in the extension. | 9 | F-1-5, F-1-17 |
| Core page actions and safety checks stay free. | 8 | F-1-6 |
| Have a license? | 3 | F-1-18 |
| Paste it. | 2 | F-1-18 |
| Your pro license is active. | 5 | — |
| License saved on this device. | 5 | — |
| Checking it now. | 3 | — |
| This license is not active. | 5 | — |
| You can buy a new license. | 6 | — |
| Your cached pro license is active. | 6 | — |
| It will be checked when you are online. | 8 | — |
| License saved. | 2 | — |
| Speak visible page actions with review before sensitive clicks. | 9 | F-1-14 |

### Landing headings, labels, buttons, navigation, and fragments

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Speak Page Actions | 3 | — |
| Demo | 1 | — |
| Download | 1 | — |
| Privacy | 1 | — |
| A small command layer for ordinary pages | 7 | F-1-14 |
| Speak the action you need | 5 | — |
| Try it with sample data | 5 | F-1-12 |
| Page labels stay in your browser | 6 | — |
| Core actions stay free; Pro aliases cost $12 once | 9 | F-1-6, F-1-17 |
| Product facts | 2 | — |
| What the extension shows | 4 | — |
| A short list you can check | 6 | F-1-16 |
| button Save address | 3 | — |
| link Review order | 3 | — |
| review Delete saved draft | 4 | — |
| How Speak Page Actions works | 5 | — |
| What it does not do | 5 | — |
| One-time pro license | 3 | — |
| Keep your own command aliases | 5 | F-1-17 |
| Buy a $12 pro license | 5 | — |
| Have a license? Paste it | 5 | F-1-18 |
| License token | 2 | — |
| Restore license | 2 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| v1.0.0 · Original generated illustration disclosed above. | 7 | — |

### README sentences

| Copy | Words | Flag |
| --- | ---: | --- |
| Speak visible buttons, links, and fields on an ordinary browser page. | 11 | F-1-14 |
| It is for people with limited vision or hand mobility who want a short, reviewable set of page actions. | 19 | F-1-14 |
| The extension scans the active tab when you open it. | 10 | F-1-19 |
| Hold the speak button and say a visible label, such as “click save address.” | 14 | F-1-2, F-1-14 |
| It asks before labels that may publish, submit, delete, pay, or send. | 12 | F-1-1 |
| Password fields are never listed. | 5 | — |
| Try the safe sample at the demo route. | 8 | F-1-15 |
| It uses the `demo:spa:` browser-storage namespace and does not touch extension settings. | 12 | F-1-20 |
| Load the unpacked `./.output/chrome-mv3` directory from `chrome://extensions` while running `npm run dev`, or use the packaged `dist/site/downloads/speak-page-actions.zip` after a build. | 20 | — |
| `npm run build:site` is the static deployment command. | 8 | — |
| It writes the site to `dist/site/` and includes the downloadable extension at `dist/site/downloads/speak-page-actions.zip`. | 13 | — |
| The extension scans only the active page after you open it. | 11 | F-1-19 |
| It does not capture background microphone audio. | 7 | — |
| Spoken commands run only when the browser offers on-device processing; typing the same command remains available. | 16 | — |
| The public site works offline after its first visit. | 9 | — |
| See Privacy and Terms. | 4 | — |
| MIT. | 1 | — |
| The optional pro license is a one-time $12 Sociobot license for saved local command aliases. | 15 | F-1-5, F-1-17 |
| Core accessibility actions and safety checks are free. | 8 | F-1-6 |

### README headings and command comments

| Copy | Words | Flag |
| --- | ---: | --- |
| Speak Page Actions | 3 | — |
| Run locally | 2 | — |
| Chromium extension development mode | 4 | — |
| static site at the shown local URL | 7 | — |
| extension in dist/extension and site in dist/site | 7 | — |
| verify the downloadable MV3 consumer archive | 6 | F-1-21 |
| Privacy and limits | 3 | — |
| License | 1 | — |

## Claims verification

I cloned the candidate to `/tmp/speak-page-actions-review-qpJTFD`, ran `npm ci`,
then ran every exact `test` command from `.factory/claims.json` separately.

| Claim | Exact command result | Review note |
| --- | --- | --- |
| `sample-action` | PASS | The route opens in one click; initial phone presentation fails F-1-3. |
| `demo-local` | PASS | Full live demo request log was same-origin. Reset isolates real keys; leaving fails F-1-4. |
| `offline-reload` | PASS | Live `/demo` also reloaded offline with HTTP 200 and its h1. |
| `active-tab-only` | PASS | Package has `activeTab`, no content script, and no all-site host permission. |
| `on-device-speech` | PASS | Built code requires `processLocally` and retains typed fallback. |
| `destructive-review` | PASS | Delete-label fixture passes; implicit submits are absent and fail F-1-1. |
| `undo-local-delete` | PASS | Complete removed list item is restored in the fixture. |
| `visible-labels` | PASS | Visible labelled control included and `display:none` control excluded. |
| `password-exclusion` | PASS | Password input omitted. |
| `push-to-talk` | PASS | Source-string test passes; keyboard behavior fails F-1-2. |
| `pro-aliases` | PASS | Checkout reaches Dodo at $12; alias outcome remains untested in F-1-5. |
| `core-free` | PASS | Website demo passes; extension claim remains untested in F-1-6. |
| `page-data-local` | PASS | Injected page agent contains no `fetch`/XHR; broader privacy copy fails F-1-7–F-1-9. |

No declared command failed. The claim registry still does not cover the exact
privacy/legal sentences in F-1-7 through F-1-10, and two passing tests do not
exercise their promised extension outcomes.

## Demo, privacy, and offline evidence

- One click from `/` opens `/demo` with the persistent banner “Demo — sample
  data, nothing is saved,” four realistic checkout controls, **Reset demo**, and
  **Start for real**.
- “click save address” reports “Used Save address.” The destructive sample asks
  for confirmation. Reset removes `demo:spa:sample` and restores four controls.
- During landing, demo, command, reset, and exit, requests went only to
  `https://speak-page-actions.sociobot.in`. No analytics, remote fonts, or
  third-party scripts loaded.
- Real sentinel keys `sb_license:speak-page-actions` and
  `spa:license-verdict` survived demo use and reset unchanged.
- The demo writes only `demo:spa:sample`, but F-1-4 records that exit leaves it.
- After first load and service-worker control, live `/demo` reloaded offline
  with HTTP 200 and “Speak a visible page action.”

## History verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
I read the prior `.factory/handoff.md`, including its embedded earlier repair
handoff, and checked its material statements against live and candidate code.

| Prior handoff item | Independent result |
| --- | --- |
| Response-header CSP includes `frame-ancestors 'none'` | Confirmed live and in `staticwebapp.config.json`. |
| First screen has exactly three privacy/offline/price facts | Confirmed. |
| $12 checkout reaches the approved Dodo product | Confirmed HTTP 200 after redirect; declared test passed. |
| Touch targets and dark-mode contrast | Confirmed with Axe and geometry checks on four routes at 390 and 1440 in light and dark. |
| Real styled 404 | Confirmed unknown URL returns the designed document with HTTP 404. |
| Destructive delete classification and local-item undo | Confirmed by declared tests; F-1-1 is a different, uncovered submit case. |
| No always-on content script; local speech requirement | Confirmed in package and declared tests. |
| Live artifacts match candidate | Confirmed: live JS/CSS SHA-256 hashes match the clean build, and every extracted extension file matches. |
| No known blockers | Rejected by F-1-1 through F-1-6. |
| 10 development-tool advisories | Still present; F-1-13. |

## Site structure, routes, links, and accessibility

Confirmed passes:

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown URL returns the
  designed 404 with status 404.
- Every checked route has `lang=en`, one h1, one main landmark, a route-specific
  browser title, meta description, and canonical URL.
- Direct deep links work. Internal navigation moves focus to the new h1. Back
  returned from Privacy to Home, restored the previous bottom scroll position,
  and focused the Home h1.
- Every crawled internal link, the extension ZIP, and the hosted checkout
  returned 200 after redirects. There are no dead public links.
- Header/footer structure is consistent and includes Privacy and Terms.
- The 1200×630 OG image is real product art. The dithered instruction-card
  treatment, warm paper/cobalt/oxide palette, serif/system pairing, square ink
  controls, and original halftone illustration are visually distinct rather
  than a generic SaaS template.
- The landing follows the required information order: header, first screen,
  live preview, three steps, limits/privacy, paid tier, footer.
- `/opt/fleet/lib/verify-url.sh` passed in 585 ms with no console errors and
  valid title/lang/h1/main/alt/button names.
- Axe found zero violations on `/`, `/demo`, `/privacy`, and `/terms` at both
  viewports in light and dark. All visible site controls were at least 44×44
  CSS px. There was no 390 px horizontal overflow. Reduced-motion rules are
  present.
- Production site JS is 11.75 kB raw / 4.55 kB gzip, and CSS is 9.45 kB raw /
  2.83 kB gzip.

Exceptions are F-1-2, F-1-11, F-1-12, and F-1-22.

## Quality-gate results

- All 13 exact claim commands: PASS from the clean clone.
- `npm test`: PASS — 5 Vitest tests and 22 Playwright tests.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run build`: PASS; produced `dist/extension/` and `dist/site/`.
- `npm run test:package`: PASS.
- `npm audit`: 10 development dependency advisories; F-1-13.
- Live/candidate identity: JS and CSS hashes match; extracted extension files
  match.

## Missed leverage

No AI feature is warranted. The core job is deterministic, privacy-sensitive,
and intentionally local; model inference would add cost and privacy risk
without improving the requested small grammar. Import, export, and sync are
not implied by the brief. The obvious missing continuation is a real
demo-to-install path, already recorded in F-1-4.

## What would make this perfect

Resolve every finding above, especially submit detection, keyboard speech
operation, the mobile demo’s immediate proof, demo exit cleanup, and real
extension-level claim tests. Then regenerate the copy audit, add complete
route metadata and the 180 px icon, clear or formally disposition the audit
advisories, deploy, and rerun this entire review from fresh mobile and desktop
contexts. There is no smaller PASS condition because the required standard is
zero findings and no untested claim.
