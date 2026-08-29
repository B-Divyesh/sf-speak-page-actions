# Independent verification 11 — FAIL

**Candidate:** `b97b4a47b4ae64ce32de37d47dac6e8b7f546475`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC from the clean candidate checkout  
**Verdict:** **FAIL — do not accept or release this candidate.**

The declared claims, clean build, deployed artifact identity, accessibility,
privacy, offline, and performance gates pass. Independent packaged-extension
testing found a release-blocking action-identity collision: after a normal
dynamic DOM update, choosing and confirming **Save draft** can run **Delete
account**. The confirmation names the safe control, not the control that runs.

## Mandatory first checks

### Claim registry

`.factory/claims.json` exists and declares 19 claims. After the clean
`npm ci`, I ran every registered `test` command separately through the demo or
packaged extension entry point. All 19 exited 0:

`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`,
`destructive-review`, `financial-page-exclusion`, `undo-local-delete`,
`visible-labels`, `password-exclusion`, `push-to-talk`, `pro-aliases`,
`core-free`, `page-data-local`, `extension-local-storage`,
`license-verification`, and `desktop-chromium-only`.

Each exact command also ran 16 Vitest assertions and its one tagged Playwright
test. Logs are `/tmp/speak-page-actions-installed-claim-<id>.log`; the result
index is `/tmp/speak-claims-installed-summary.txt`. The full run passed 16
Vitest assertions and 35 Playwright tests. No separate unlisted product claim
was found in the live page or README.

### Cold first read

The live first viewport passes the required first-read test:

- What it does: **“say or type a visible control's name.”**
- Who it serves: **“people with limited vision or hand mobility.”**
- What to click first: **Try it with sample data**.
- The adjacent copy says it opens four sample controls without changing a real
  page. One click opens `/?demo=1` with the persistent demo banner, four seeded
  controls, Reset demo, and Start for real.

The complete required content is visible at 390×844. Cold evidence is
`/tmp/speak-first-read.png`; `test-results/verify-live-11/home-390.png` records
the phone view.

## Findings by severity

### Critical — a dynamic-page ID collision runs a different destructive action under a safe confirmation

The injected agent derives IDs from a control's current DOM index and writes
them into the page as `data-spa-id` at
`src/lib/page-agent.ts:81-86`. On later scans it keeps old IDs without checking
uniqueness. A newly inserted control can therefore receive an ID already held
by an existing control. Activation uses `document.querySelector` and takes the
first matching element at `src/lib/page-agent.ts:101`.

I reproduced this end to end with the candidate's built extension:

1. A page initially contained `<button id="safe">Save draft</button>`. The
   first scan assigned it `spa-0`.
2. The page inserted `<button id="danger">Delete account</button>` before the
   original control, then the popup rescanned.
3. Both controls now had `data-spa-id="spa-0"`. The popup visibly listed
   **Delete account — review** and **Save draft** as separate actions.
4. I chose **Save draft**. The agent resolved `spa-0` to **Delete account** and
   requested review. The popup nevertheless displayed
   `“Save draft” may change or send something` and its confirmation button was
   **Save draft**.
5. I confirmed **Save draft**. The page's Delete account handler ran and wrote
   `DANGER`; the Save draft handler did not run.

Exact captured evidence is `/tmp/speak-dynamic-id-collision.json`. This breaks
the product's central safety contract, defeats a review whose named target is
supposed to be inspectable, and can execute an irreversible action different
from the user's spoken or clicked choice.

IDs must be extension-owned and collision-free rather than derived from DOM
position or trusted from page attributes. Activation must also validate the
expected element identity and label. If revalidation discovers a changed
target, it must fail and require a rescan; the popup must never build a review
from a different stale action object.

### High — unlabelled fields are presented as visible labelled controls

The public product and registered `visible-labels` claim say the extension
lists labelled fields. In `src/lib/page-agent.ts:33-39`, `labelFor` falls back
to an input's `name` attribute. That attribute is neither a visible label nor
an accessible name.

Using the packaged extension on a page with a bare
`<input name="internalTrackingId">`, a placeholder-only input, and a Save
button produced three actions:

```text
internalTrackingId field
Visible hint field
Save button
```

The first input had no `label`, `aria-label`, or other accessible name. Evidence
is `/tmp/speak-unlabelled-field.json`. This violates the core visible/labelled
scope and gives the target user a control name that does not exist on the page.
Remove the `name` fallback and require an accessible label; placeholder-only
fields should also be treated consistently with the repository's stated form
accessibility rule.

### Medium — a speech start exception leaves a false active-microphone state

The popup supports the local-processing property, but `recognition.start()`
can still throw synchronously when a language pack or local recognizer is not
available. The catch at `src/entrypoints/popup/main.ts:127` changes only the
internal boolean. It does not restore the button, `aria-pressed`, label, or
status.

With a packaged-extension recognizer whose `processLocally` property exists
and whose `start()` throws `NotSupportedError`, the resulting UI was:

```json
{
  "status": "Listening. Release when you finish the action label.",
  "talk": "● Listening… release to stop",
  "ariaPressed": "true",
  "ariaLabel": "Listening. Release to stop."
}
```

Evidence is `/tmp/speak-speech-start-throw.json`. The popup is not listening
and gives no typed-command recovery instruction. Restore the idle state and
announce that speech could not start.

## Clean build and repository gates

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 176 packages installed, 0 audit vulnerabilities |
| Every exact `.factory/claims.json` command | Pass; 19/19 individually |
| `CI=1 npm test` | Pass; 16 Vitest assertions, 35 Playwright tests |
| `npm run test:unit` | Pass; 16/16 |
| `CI=1 npm run test:claims` | Pass; 35/35 |
| `npm run test:copy` | Pass; 196 rows cover 188 extracted strings |
| `npm run test:registry` | Pass; 19 claims, one tagged test each |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass; produces `dist/site` and `dist/extension` |
| `npm run test:package` | Pass |
| `npm run test:zip-contents` | Pass |
| `npm run verify:live` | Pass; local/live site assets and all 23 ZIP members match |

The production site has 14,262 B JS (5,188 B gzip), 11,288 B CSS
(3,212 B gzip), and a 142,634 B hero image. The live extension ZIP is 342,423
bytes. These satisfy the 200 KB JS, 50 KB CSS, and 300 KB hero budgets.

## End-to-end, boundary, and recovery evidence

- A normal demo command returned `Used Save address.`.
- A 1,024-character unknown command returned `No visible action matched. Use
  a label from the list.` and the demo stayed usable.
- Dismissing review for Delete saved draft returned `The action was not
  used.`.
- The declared extension tests exercise typed commands, pointer/Space/Enter
  push-to-talk, all documented sensitive labels, financial-page exclusion,
  password exclusion, local delete undo, Pro aliases, invalid/offline license
  recovery, and page-action revalidation.
- Independent dynamic insertion, unlabelled-field, and speech-start exception
  cases produced the three findings above.
- The production manifest is MV3 with `activeTab`, `scripting`, and `storage`;
  it has no persistent content script or all-sites permission. There is no
  sign-in flow, library/CLI surface, or product backend to test.

## Accessibility and responsive behavior

Independent Axe scans covered `/`, `/demo`, `/privacy`, `/terms`, and the real
HTTP 404 at 1440×900 and 390×844, in light and dark mode. All 20 combinations
had zero serious/critical findings, one `h1`, one `main`, `lang=en`, no
horizontal overflow, and no active animation with reduced motion. The built
extension popup also had zero Axe violations in default, open-Pro, and review
dialog states.

The first Tab reaches the skip link with a computed
`rgb(21, 91, 140) solid 3px` outline. Continued Tab navigation covers the
header, demo banner, four actions, command input, Run command, and footer
without a trap; all interactive targets retain the 3 px focus treatment. The
native review dialog initially focuses Cancel, Escape closes it, and focus
returns to the invoking action. A 200% zoom smoke test had no horizontal
overflow. Valid routes produced no console or page errors. The intentional
404 navigation produced only Chromium's expected failed-document console
entry. Full results are `/tmp/speak-live-independent-qa.json` and
`/tmp/speak-popup-a11y.json`.

## Privacy, headers, offline, rate limit, and live identity

The complete live demo request log contained only
`https://speak-page-actions.sociobot.in`. Demo writes were confined to
`demo:spa:` storage. The declared extension privacy test covers scan, type,
local speech, review, activation, and undo with no external page-data request.
Checkout-return testing confirms the license token is scrubbed from the URL
and absent from site local/session storage, cookies, IndexedDB, and Cache
Storage.

Live HTML uses `Cache-Control: public, must-revalidate, max-age=30`; hashed JS
and CSS use one-year immutable caching. Responses include HSTS,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and a
self-only CSP whose response header contains `frame-ancestors 'none'`. No
third-party font or script loaded.

The service worker removed an injected old named cache and a controlled fresh
`/demo` reloaded offline with HTTP 200. Evidence is `/tmp/speak-pwa-11.json`.

From one client, invalid license-verification requests 1–30 returned 200;
request 31 and the next 14 returned **429**. The first 429 included
`Retry-After: 3`. Observed allowance: **30 requests**. Evidence is
`/tmp/speak-rate-limit-11.log`.

`npm run verify:live` confirms the live hashed JS/CSS and every downloaded ZIP
member match the candidate build. `/opt/fleet/lib/verify-url.sh` returned 200
in 891 ms with no errors and clean title/lang/h1/main/alt/button checks.
Lighthouse completed its JSON before Chromium crashed during teardown:
Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s,
LCP 1.5 s, CLS 0, TBT 150 ms, 152,814 B transfer. The completed report is
`/tmp/speak-lighthouse-11.json`; the nonzero teardown exit is recorded rather
than presented as a passing command.

## Disposition

Do not release candidate `b97b4a4`. Fix the critical target-identity problem,
remove unlabelled field fallbacks, and recover truthfully from synchronous
speech-start errors. Add regression tests that reproduce each case through
the packaged extension, then rerun every claim and this independent suite.
