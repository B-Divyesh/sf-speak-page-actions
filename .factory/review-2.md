# Adversarial first-read review 2 — FAIL

**Product:** Speak Page Actions

**Candidate:** `23d6f893063f7deb2a1f644fd471ea6e8741a359`

**Live URL:** <https://speak-page-actions.sociobot.in>

**Reviewed:** 2026-08-29, fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The cold first screen is clear and the one-click demo is immediate,
realistic, isolated, resettable, and available offline. All 15 declared claim
commands exit successfully from a clean clone. PASS is still unavailable:
there are **8 blocking, 1 major, and 1 minor findings**. The real install path
is not usable or honest for a phone visitor, browser Back loses scroll state,
and several tests marked as claim evidence bypass the extension behavior they
claim to verify. Five findings from review 1 were only partly fixed.

## Cold first read

No scroll or interaction occurred before these answers were recorded.

| Viewport | What does this do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | It lets a person say or type the name of a visible browser control. | People with limited vision or hand mobility. | **Try it with sample data**. | All three answers and the adjacent explanation are visible. The absent desktop-only qualification is F-2-1. |
| 1440×900 | It lets a person use visible browser controls by voice or typing. | People with limited vision or hand mobility. | **Try it with sample data**. | All three answers are visible. |

The exact text that succeeds is “Browser controls you can use by voice,”
“For people with limited vision or hand mobility, say or type a visible
control’s name,” and “Try it with sample data.” The action ends at y=438 and
its explanation ends at y=509 on the 844px phone viewport. Screenshots:
`cold-live-phone-review-2.png` and `cold-live-desktop-review-2.png`.

## Findings

### Blocking

#### F-2-1 — The real install path omits desktop-only compatibility and required Chrome steps

- **Quote/location:** The responsive landing page offers **Download** on a
  phone. The install section says, “Download the ZIP, unzip it, then load the
  folder from Chrome’s Extensions page.” README line 21 likewise says to load
  the unpacked directory, without naming Developer mode or **Load unpacked**.
- **Evidence:** The shipped artifact is a Chrome MV3 extension. Chrome on
  Android and iOS does not provide the desktop Extensions page or load this
  unpacked package. On desktop, a first-time user must also enable Developer
  mode and choose **Load unpacked**, steps absent from the public instructions.
- **Why this fails:** A phone visitor is invited to download an unusable ZIP,
  while the intended nontechnical accessibility audience is not given enough
  instruction to complete the real job on desktop. The demo is tryable, but
  the product is not honestly end-to-end.
- **Concrete fix:** Put **Desktop Chrome and Chromium only** in the first
  screen or adjacent to Download. Replace the install sentence with numbered
  steps: download and unzip; open `chrome://extensions`; enable Developer
  mode; choose **Load unpacked**; select the unzipped folder. On unsupported
  phones, keep the demo action and label installation as a desktop task. Add a
  phone assertion for that disclosure and a clean-profile install smoke test.

#### F-2-2 — Browser Back restores the route but discards the prior scroll position

- **Quote/location:** SPA navigation in `src/site/main.ts:50-51`; the site
  structure requires back/forward to restore scroll and focus.
- **Evidence:** In fresh live Chromium at 390×844, the home page was scrolled
  to `scrollY=1915`; the footer Privacy link was used; browser Back returned to
  `/`, focused “Speak the action you need,” but left `scrollY=0`.
- **Why this fails:** A visitor who opens a legal page from the footer loses
  their place. The URL and focus update work, but the navigation state is only
  partly restored, so this is broken routing under the supplied rubric.
- **Concrete fix:** Save scroll coordinates in each history entry before
  `pushState`, set `history.scrollRestoration = 'manual'`, and restore them
  after rendering on `popstate` while retaining `focus({preventScroll:true})`.
  Add a Playwright test that leaves from the footer, goes back and forward, and
  asserts route, focus, and scroll position.

#### F-2-3 — The Pro command-name test still bypasses the product flow

- **Quote/location:** `tests/claims.spec.ts:209-238` for
  `@claim:pro-aliases`; claim: “A $12 one-time Pro license adds saved command
  names.” This reopens **F-1-5**.
- **Evidence:** The test opens the packaged popup, then writes
  `spa:aliases` and the license directly with `chrome.storage.local.set` at
  lines 224-226. It never fills “Your command name,” selects a visible
  control, clicks **Save command name**, receives a recorded valid
  verification response, closes/reopens the popup, or runs the saved name
  through `runCommand()`. It invokes imported `findAction()` and the injected
  page agent separately.
- **Why this fails:** The test remains green if the Pro form, verification
  call, save handler, or popup lookup is broken. The user-visible paid feature
  is still untested even though the previous closure report marks it fixed.
- **Concrete fix:** Open the real MV3 popup against a fixture tab, fulfill the
  Sociobot verification request with a recorded valid response, use the UI to
  save a name, reopen the popup, type that name, and assert the fixture control
  runs and only extension-local keys are written.

#### F-2-4 — The “core is free” test still bypasses the packaged extension

- **Quote/location:** `tests/claims.spec.ts:241-254` for
  `@claim:core-free`; claim: “Core page actions and safety checks are free.”
  This reopens **F-1-6**.
- **Evidence:** The test visits the landing page, replaces it with fixture
  HTML, installs the page-agent function directly, and sends synthetic
  messages. It never launches the extension, proves extension storage is
  empty, scans from the popup, or reaches the popup review dialog.
- **Why this fails:** A license gate or broken scan/action wiring in the
  packaged popup would not fail this test. The previous required fix was an
  extension-level flow, and that flow is still absent.
- **Concrete fix:** Launch the packaged extension with empty extension
  storage against a fixture tab. Use **Scan page**, run a normal control, open
  review for a sensitive control, and assert no license prompt or request
  occurs.

#### F-2-5 — Privacy and license claims are proved by string inspection, not request logs or real saves

- **Quote/location:** Privacy says, “The extension does not send page labels,
  spoken commands, or browsing history,” “Aliases and saved license data stay
  in browser-local extension storage,” and “When you restore Pro, it sends the
  license token to Sociobot for verification.” Tests are at
  `tests/claims.spec.ts:256-284`. This reopens **F-1-8**.
- **Evidence:** `@claim:page-data-local` searches function and bundle strings
  for `fetch`, `XMLHttpRequest`, and field names. `@claim:extension-local-storage`
  writes test data directly to `chrome.storage.local`. `@claim:license-verification`
  checks that URL and `encodeURIComponent` strings exist in the bundle. None
  records requests across a real extension scan, typed command, speech result,
  review, undo, license verification, and command-name save.
- **Why this fails:** These tests can pass when the relevant code is dead,
  when another request mechanism leaks page data, or when the actual UI saves
  elsewhere. The claims rubric explicitly requires a Playwright request log
  and observable outcomes for privacy claims.
- **Concrete fix:** Drive the packaged extension through the complete fixture
  flow while recording context, service-worker, and page requests. Assert no
  page label, transcript, or visited URL leaves the extension; assert the one
  explicit restore request contains only an encoded test token; and inspect
  storage created by the UI rather than pre-seeding it.

#### F-2-6 — Several public claim clauses are absent from, or wider than, their tagged tests

- **Quote/location:** Landing: “It lists buttons, links, and labelled fields”
  and “It asks before actions that submit, delete, publish, send, or pay.”
  README: “typing the same command remains available” and sample changes
  “never read or change extension settings.”
- **Evidence:** `@claim:visible-labels` tests one visible and one hidden
  button, but no link or labelled field. `@claim:destructive-review` tests only
  submit buttons, not delete, publish, send, or pay controls. The on-device
  test checks a fallback status but never types and runs a command. The demo
  claim starts with empty storage and cannot show that real settings were not
  read; the separate reset test proves only that sentinel values remain
  unchanged. The latter two clauses are not stated as claims in
  `.factory/claims.json`.
- **Why this fails:** Every command exits zero, but these observable promises
  remain untested. PASS requires no untested claim, not merely a matching test
  name.
- **Concrete fix:** Either narrow each public sentence to its tested outcome
  or extend the tagged tests with a link, labelled input/select, every named
  sensitive category, a typed fallback action, and instrumented real-setting
  access. Add explicit claim entries for typed fallback and demo isolation if
  those remain separate promises.

#### F-2-7 — The first-screen price fact still uses “names” without a referent

- **Quote/location:** “Core actions are free; names cost $12 once.” This is a
  half-fix of **F-1-17**, which required “command aliases” to be explained as
  personal names for controls.
- **Why this fails:** On the first screen, “names” could refer to page labels,
  controls, or a user’s name. The paid fact is not understandable without
  scrolling to the Pro section.
- **Concrete rewrite:** **Core actions are free; saved command names cost $12
  once.**

#### F-2-8 — The repository copy audit is still incomplete and contains a wrong count

- **Quote/location:** `.factory/copy-audit.md:3-7` says it covers landing and
  README headings, labels, buttons, states, and sentences. This reopens
  **F-1-23**.
- **Evidence:** Its README table omits 15 sentences, including the speech,
  review, password, installation, build, privacy, offline, links, MIT, and
  free-core sentences. It omits landing navigation, most headings and buttons,
  all license status sentences, and the install/download controls. It counts
  the hero audience sentence as 16 words; under its own whitespace rule it is
  15.
- **Why this fails:** The prior finding was marked fixed without producing the
  claimed complete audit. Missing text concealed F-2-1, F-2-7, and F-2-10.
- **Concrete fix:** Replace the audit with the complete tables below, retain
  the stated whitespace rule, and fail CI when rendered/README text is absent
  or a stored count differs from the extractor.

### Major

#### F-2-9 — The paid action does not disclose that it leaves the site

- **Quote/location:** Landing button “Buy a $12 Pro license.” It resolves from
  `api.sociobot.in` to `checkout.dodopayments.com` in the same tab.
- **Why this fails:** The supplied site-structure rule requires external links
  to say so. A buyer is moved to a different host without advance notice.
- **Concrete rewrite:** **Buy Pro in hosted checkout — $12 once** and add
  visually available text such as **Opens Dodo’s checkout**. Test the label,
  destination, product, and price.

### Minor

#### F-2-10 — “On-device processing” and “push-to-talk” are unexplained jargon

- **Quote/location:** Landing: “Use on-device speech.” README: “Hold Space or
  Enter for the same push-to-talk action” and “when the browser offers
  on-device processing.”
- **Why this fails:** These implementation terms require translation for the
  nontechnical audience named on the first screen.
- **Concrete rewrite:** Landing: **Speak when your browser can process speech
  on this device, or type the control name.** README: **Hold Space or Enter to
  speak; release the key to stop. Spoken commands work only when your browser
  can process speech on this device.**

## Complete copy audit

Count rule: whitespace-delimited tokens; punctuation, hyphenated forms, URLs,
paths, and `$12` do not create extra words. Repeated text is listed once and
identified where relevant. No sentence exceeds 22 words and no banned
marketing adjective appears.

### Landing-page sentences and states

| Sentence | Words | Flag |
| --- | ---: | --- |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 | — |
| Opens four sample controls without changing a real page. | 9 | — |
| A printed browser page with a sound wave becoming a pointer. | 11 | — |
| Original generated artwork, made for Speak Page Actions. | 8 | — |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 | F-2-6 |
| Open the extension. | 3 | — |
| It scans the current page only. | 6 | — |
| Hold to speak. | 3 | — |
| Use on-device speech, or type the visible control name. | 9 | F-2-6, F-2-10 |
| Review sensitive actions. | 3 | — |
| It asks before actions that submit, delete, publish, send, or pay. | 11 | F-2-6 |
| It does not listen in the background. | 7 | — |
| It never lists password fields. | 5 | — |
| Download the ZIP, unzip it, then load the folder from Chrome’s Extensions page. | 13 | F-2-1 |
| Pro costs $12 once. | 4 | — |
| Save a short name for a visible control. | 8 | F-2-3 |
| Core page actions and safety checks are free. | 8 | F-2-4 |
| Speak visible page actions with review before sensitive clicks. | 9 | — |
| Your pro license is active. | 5 | F-2-5 |
| License saved on this device. | 5 | F-2-5 |
| Checking it now. | 3 | — |
| This license is not active. | 5 | — |
| You can buy a new license. | 6 | — |
| Your cached pro license is active. | 6 | F-2-5 |
| It will be checked when you are online. | 8 | F-2-5 |
| License saved. | 2 | F-2-5 |

### Landing headings, facts, links, buttons, labels, and fragments

| Text | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Speak Page Actions | 3 | — |
| Demo | 1 | — |
| Download | 1 | F-2-1 |
| Privacy | 1 | — |
| Browser controls you can use by voice | 7 | — |
| Speak the action you need | 5 | — |
| Try it with sample data | 5 | — |
| Page labels stay in your browser | 6 | F-2-5 |
| Works offline after the first visit | 6 | — |
| Core actions are free; names cost $12 once | 8 | F-2-7 |
| Product facts | 2 | — |
| What the extension shows | 4 | — |
| Visible controls listed by the extension | 6 | — |
| button Save address | 3 | — |
| link Review order | 3 | — |
| review Delete saved draft | 4 | — |
| How Speak Page Actions works | 5 | — |
| What it does not do | 5 | — |
| Install the extension | 3 | F-2-1 |
| Download the extension ZIP | 4 | F-2-1 |
| One-time Pro license | 3 | — |
| Save your own names for commands | 6 | — |
| Buy a $12 Pro license | 5 | F-2-9 |
| Restore a license | 3 | — |
| License token | 2 | — |
| Restore license | 2 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| v1.0.0 · Original generated illustration disclosed above. | 7 | — |

### README sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Speak visible browser controls on an ordinary page. | 8 | — |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | — |
| The extension scans only the current page after you open it. | 11 | — |
| Hold the speak button and say a visible control name, such as “click save address.” | 15 | — |
| Hold Space or Enter for the same push-to-talk action. | 9 | F-2-10 |
| It asks before controls that may publish, submit, delete, pay, or send. | 12 | F-2-6 |
| Password fields are never listed. | 5 | — |
| Try four sample controls at the demo page. | 8 | — |
| Sample changes use separate browser storage and never read or change extension settings. | 13 | F-2-6 |
| Keys start with `demo:spa:` for verification. | 6 | — |
| Load the unpacked `./.output/chrome-mv3` directory from `chrome://extensions` while running `npm run dev`, or use the packaged `dist/site/downloads/speak-page-actions.zip` after a build. | 20 | F-2-1 |
| `npm run build:site` is the static deployment command. | 8 | — |
| It writes the site to `dist/site/` and includes the downloadable extension at `dist/site/downloads/speak-page-actions.zip`. | 13 | — |
| The extension scans only the current page after you open it. | 11 | repeated; — |
| It does not capture background microphone audio. | 7 | — |
| Spoken commands run only when the browser offers on-device processing; typing the same command remains available. | 16 | F-2-6, F-2-10 |
| The public site works offline after its first visit. | 9 | — |
| See Privacy and Terms. | 4 | — |
| MIT. | 1 | — |
| The optional Pro license costs $12 once and saves your own command names. | 13 | F-2-3 |
| Core accessibility actions and safety checks are free. | 8 | F-2-4 |

### README headings and command comments

| Text | Words | Flag |
| --- | ---: | --- |
| Speak Page Actions | 3 | — |
| Run locally | 2 | — |
| Chromium extension development mode | 4 | — |
| static site at the shown local URL | 7 | — |
| extension in dist/extension and site in dist/site | 7 | — |
| check the downloadable Chrome extension ZIP | 6 | — |
| Privacy and limits | 3 | — |
| License | 1 | — |

## Demo, sandbox, privacy, and offline

- One click opens live `/demo` with the persistent “Demo — sample data,
  nothing is saved” banner, **Reset demo**, **Start for real**, four checkout
  controls, and “Found four visible controls on Sample checkout.” All four
  controls end above y=755 at 390×844. Screenshot:
  `live-demo-390-review-2.png`.
- “click save address” returns “Used Save address.” The demo writes only
  `demo:spa:sample`. Pre-existing `spa:real-sentinel` and
  `sb_license:speak-page-actions` values remain unchanged.
- Reset removes the demo key and restores four controls. Start for real removes
  it, preserves real keys, opens `/#install`, and places the installation
  section at the top of the viewport.
- Before leaving demo mode, the live request log is same-origin. The existing
  real license is sent to `api.sociobot.in` only after Start for real renders
  the real landing route. The demo reloads offline after service-worker
  control. F-2-5 records the missing packaged-extension request-log evidence.

## Claims verification

A clean clone at `/tmp/speak-page-actions-review-2.zWFerP` was created from the
candidate. After `npm ci`, every exact `test` string in `.factory/claims.json`
was run separately with `CI=1`.

| Claim | Exact command | Exit result | Evidence assessment |
| --- | --- | --- | --- |
| `sample-action` | `npm test -- --grep @claim:sample-action` | PASS | Four controls and seeded result verified at phone size. |
| `demo-local` | `npm test -- --grep @claim:demo-local` | PASS | Same-origin requests and demo-prefixed writes verified; broader README clause is F-2-6. |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS | Demo reloads offline after service-worker control. |
| `active-tab-only` | `npm test -- --grep @claim:active-tab-only` | PASS | Package permission boundary verified. |
| `on-device-speech` | `npm test -- --grep @claim:on-device-speech` | PASS | Unsupported local speech falls back; typed outcome is untested in F-2-6. |
| `destructive-review` | `npm test -- --grep @claim:destructive-review` | PASS | Implicit/explicit submits verified; other named categories are untested in F-2-6. |
| `undo-local-delete` | `npm test -- --grep @claim:undo-local-delete` | PASS | Removed list item restored. |
| `visible-labels` | `npm test -- --grep @claim:visible-labels` | PASS | Visible/hidden buttons verified; links and fields are untested in F-2-6. |
| `password-exclusion` | `npm test -- --grep @claim:password-exclusion` | PASS | Password input omitted. |
| `push-to-talk` | `npm test -- --grep @claim:push-to-talk` | PASS | Pointer, Space, and Enter start/stop the stub recognizer. |
| `pro-aliases` | `npm test -- --grep @claim:pro-aliases` | PASS | Command exits zero but bypasses the UI; F-2-3. |
| `core-free` | `npm test -- --grep @claim:core-free` | PASS | Command exits zero but bypasses the package; F-2-4. |
| `page-data-local` | `npm test -- --grep @claim:page-data-local` | PASS | Static string inspection only; F-2-5. |
| `extension-local-storage` | `npm test -- --grep @claim:extension-local-storage` | PASS | Direct test write, not a product save; F-2-5. |
| `license-verification` | `npm test -- --grep @claim:license-verification` | PASS | Bundle strings, not an observed request; F-2-5. |

No exact command failed. F-2-3 through F-2-6 identify claims that remain
untested at the observable scope promised to visitors.

## History verification

The only earlier review and polish files are `.factory/review-1.md` and
`.factory/polish-1.md`; the handoff present at review start was verification 5.
The live HTML, JS, CSS, hero art, and service worker match the clean candidate
by SHA-256, so live and code conclusions below refer to the same build.

| Earlier finding | Live/code result |
| --- | --- |
| F-1-1 implicit submit review | Fixed: implicit and explicit submits are classified and blocked until confirmation. |
| F-1-2 Enter on speech control | Fixed: packaged-popup test exercises Enter, Space, and pointer. |
| F-1-3 phone demo below fold | Fixed: all four controls end above y=755 at 390×844. |
| F-1-4 Start for real/demo cleanup | Fixed: demo keys clear; real sentinels remain; install section opens. |
| F-1-5 Pro behavior test | **Half-fixed; reopened as F-2-3.** Storage is still pre-seeded outside the product UI. |
| F-1-6 free-core test | **Half-fixed; reopened as F-2-4.** The packaged extension is not launched. |
| F-1-7 storage claim missing | Fixed as a registry entry; its observable proof is separately deficient in F-2-5. |
| F-1-8 page-data privacy coverage | **Half-fixed; reopened as F-2-5.** There is still no extension request log. |
| F-1-9 unbounded “only” wording | Fixed: copy names the explicit verification action. |
| F-1-10 merchant/refund claims | Fixed: unsupported sentences are removed. |
| F-1-11 route social metadata | Fixed: title, description, canonical, OG, and Twitter values update by route. |
| F-1-12 mobile hero clipping | Fixed: CTA and explanation are fully visible. |
| F-1-13 dependency advisories | Fixed: clean `npm ci`/`npm audit` reports zero vulnerabilities. |
| F-1-14 inconsistent jargon | Fixed for the main “visible control” and “command” concepts. |
| F-1-15 vague “safe sample” | Fixed with the concrete four-control/no-real-page sentence. |
| F-1-16 vague preview heading | Fixed: “Visible controls listed by the extension.” |
| F-1-17 unexplained aliases | **Half-fixed; reopened as F-2-7.** “names” has no first-screen referent. |
| F-1-18 misleading restore button | Fixed: “Restore a license.” |
| F-1-19 active tab/page terms | Fixed: “current page” is consistent. |
| F-1-20 README storage jargon | Fixed: the outcome precedes the verification key prefix. |
| F-1-21 “MV3 consumer archive” | Fixed: “Chrome extension ZIP.” |
| F-1-22 Apple touch icon | Fixed: linked PNG is 180×180. |
| F-1-23 incomplete copy audit | **Half-fixed; reopened as F-2-8.** Scope and one count remain wrong. |

The verification-5 handoff’s no-defect conclusion is rejected by the findings
above. Its positive build, demo, accessibility, asset-identity, and request
observations were independently reproduced.

## Structure, links, accessibility, and visual identity

Confirmed:

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown URL returns a
  designed page with HTTP 404. Every route has one h1, one main, ordered
  headings, consistent header/footer, Privacy and Terms links, and no 390px
  horizontal overflow.
- Route titles follow the required patterns and remain below 60 characters.
  Description, canonical, OG, Twitter, SVG favicon, 180px Apple icon, and the
  1200×630 product-art social image are present. `robots.txt` and `sitemap.xml`
  list the public routes.
- All destination links return 200 after redirects: home, demo, download,
  Privacy, Terms, and checkout. F-2-9 covers the missing external notice.
- Internal navigation focuses the new h1 and announces the title. F-2-2 is the
  Back scroll-state failure.
- Valid routes produce no console/page errors. `/opt/fleet/lib/verify-url.sh`
  passes the live home page. `npx @axe-core/cli` reports zero violations, and
  Playwright Axe reports none on all routes at 390px. Focus styles, 44px
  controls, reduced-motion rules, and dark contrast checks pass.
- The dithered instruction-card system, paper/cobalt/oxide palette, serif and
  system-type pairing, square ink controls, halftone field, and original art
  are distinct from a generic SaaS template and match `.factory/design.md`.
- Production JS is 12.92kB raw / 4.79kB gzip and CSS is 10.15kB raw / 2.96kB
  gzip. The 142.63kB hero is dimensioned, preventing layout shift.

## Quality gates

From the clean clone:

- All 15 exact claim commands: exit 0 individually.
- `CI=1 npm test`: 5 Vitest and 26 Playwright tests pass.
- `npm run typecheck`, `npm run lint`, `npm run build`, and
  `npm run test:package`: pass; `dist/site/` and `dist/extension/` are produced.
- `npm audit --audit-level=low`: zero vulnerabilities.
- Live/candidate SHA-256: exact match for root HTML, JS, CSS, hero art, and
  service worker.

## Missed leverage

No AI action is justified. The brief calls for deterministic, local,
push-to-talk control; sending page labels or speech to a model would weaken the
privacy boundary. Import, export, and sync are not implied. The obvious missing
continuation is usable desktop installation from a phone-discovered product,
already specified in F-2-1.

## What would make this perfect

Disclose desktop compatibility and provide a complete install path; preserve
scroll state through Back/Forward; replace claim-test shortcuts with real
packaged-extension flows and request logs; cover every clause named in public
copy; repair the first-screen price wording and copy audit; and mark the hosted
checkout as external. Then deploy and rerun this entire review from fresh phone
and desktop contexts. There is no PASS-adjacent exception: all ten findings
must be closed and every public claim must have observable sandbox evidence.
