# Independent verification — FAIL

**Candidate:** `32300bafd2533146a15584fd4f551ec8b1087e79` (`main`)

**Live URL:** https://speak-page-actions.sociobot.in

**Verified:** 2026-08-28, from a clean checkout after `npm ci`.

## Verdict

**FAIL — do not release this candidate.** The required per-claim commands all
fail, the live product cannot be downloaded, the extension misses a destructive
action in its own sample, undo is not functional for a representative delete,
and dark mode has serious accessibility violations.

## Cold first read

The live first screen plainly says that Speak Page Actions lets people with
limited vision or hand mobility turn visible page labels into reviewable voice
actions. It tells a visitor to click **Try it with sample data**, and says that
this opens a safe sample page in one click. This first-read requirement passes;
the link goes to `/demo` and the demo is usable.

## Required claims: release-blocking failure

I ran every `test` value in `.factory/claims.json` verbatim after `npm ci`.
All three fail with Playwright's `Error: No tests found` because the package
script receives `@claim:…` as a positional test-file argument rather than a
`--grep` option.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-action` | `npm test -- --grep @claim:sample-action` | **FAIL** — `playwright test @claim:sample-action`, no tests found |
| `demo-local` | `npm test -- --grep @claim:demo-local` | **FAIL** — `playwright test @claim:demo-local`, no tests found |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | **FAIL** — `playwright test @claim:offline-reload`, no tests found |

For context only, unfiltered `npm test` passes the four local tests (including
the three tagged tests). That does not remedy the three failed commands named
by the claims manifest.

## Test and build evidence

- `npm ci`: completed. npm reported 10 dependency audit findings (1 low, 2
  moderate, 4 high, 3 critical) in development dependencies.
- `npm test`: **PASS**, 4 tests (4 Vitest assertions and 4 Playwright tests).
- `npm run build`: **PASS**. It created `dist/site/`,
  `dist/extension/`, and local `dist/site/downloads/speak-page-actions.zip`
  (297,278 bytes).
- `npx tsc --noEmit`: **FAIL**, 19 errors. Examples include unresolved WXT
  globals (`defineBackground`, `defineContentScript`, `browser`), possibly
  undefined `recognition`, invalid `placeholder` access on `HTMLSelectElement`,
  and `Event.key` in `src/site/main.ts`. There is no lint script.
- Static initial site bundle is within budget: JS 11.66 KB / 4.53 KB gzip;
  CSS 8.75 KB / 2.69 KB gzip; hero WebP 142.6 KB.

## Live deployment and browser checks

- The live root, `/demo`, `/privacy`, `/terms`, `/404`, `robots.txt`, and
  `sitemap.xml` returned 200. The required live download URL
  `/downloads/speak-page-actions.zip` returned **404**. This is a deployment
  blocker because the landing page's Download link is the only delivery path
  for the browser extension.
- The locally built and live deployed site assets do match:
  `index-B3iVnCpG.js` SHA-256 is
  `beb4d2e9ba66dc5b3177f0f8733ac0c987219f1bcd13409818315a98df2c0ae5`,
  and `index-u-eRvIwb.css` SHA-256 is
  `2d0c2224c6cf1be9ae8a0ee1e6d51400f2e599d5667f9f7aa7ceb4493e17904f`
  both locally and live. The deployment omission is specifically the ZIP.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy and a
  restrictive self/Sociobot CSP. Hashed JS has one-year immutable caching.
- Fresh Playwright checks at desktop and 390 px found one `h1`, one `main`,
  `lang=en`, route-specific titles, no page/console errors, and only
  same-origin requests for the landing, demo, privacy, and terms pages.
- Axe in the default/light scheme found no serious or critical issues on `/`
  (desktop and 390 px), `/demo`, `/privacy`, or `/terms`. In dark scheme it
  found serious `color-contrast` failures on `/` and `/demo`. On `/demo`, for
  example, `#demo-status` is 2.09:1 (`#155b8c` on `#1c2732`), action buttons
  are 1.38:1 (black on `#1c2732`), and the review label is 2.22:1. This fails
  the required contrast gate.
- The 390 px demo exposes the designed 3 px focus outline, and its
  reduced-motion media query is active. Keyboard focus is moved to the `h1`
  on initial render, so the first forward Tab then enters main content rather
  than the preceding skip/header controls; this is a minor keyboard-order
  concern.
- Service-worker offline reload of live `/demo` passed after first load:
  controller became active, the offline reload returned 200 and retained
  `Speak a visible page action`. Update behavior is not adequately covered:
  the worker uses a fixed `speak-page-actions-v2` cache and cache-first shell
  responses, with no versioning/cleanup or update test.

## End-to-end functional evidence

The public demo itself handled a normal command (`Used Save address.`), an
invalid command (`No visible action matched. Use a label from the list.`), a
destructive-command confirmation dismissal, reset to four actions, and
discarded `demo:spa:sample` when Start for real was used.

The actual MV3 extension was launched from the fresh packaged output against
the demo in Chromium. It scanned 16 visible actions and the typed command
fallback worked. It also exposed the following release blockers:

1. **Critical — extension review is skipped for the destructive sample
   action.** The content script collects the demo action as
   `{label: "BUTTONDelete saved draft review", destructive: false}`. The
   detection regex needs a word boundary before `delete`; concatenated visible
   descendant text makes that boundary unavailable. Selecting this action in
   the extension therefore does not open its review dialog. This violates the
   core promise and brief constraint to confirm destructive actions. A plain
   standalone `Delete saved draft` button was correctly classified and did
   open review, proving the failure is realistic label handling rather than a
   test setup issue.
2. **Critical — claimed undo does not undo a representative delete.** On a
   page where `Delete saved draft` removes its containing item, activation
   returned `{ok:true, canUndo:true}`; undo returned `{ok:true, message:"The
   page action was undone where the page allowed it."}`; the removed item
   remained absent (`#item` count 0). The implementation inserts a cloned
   button into its detached former parent, not the deleted item, and cannot
   undo submissions. This violates the brief's confirmation-and-undo
   requirement.
3. **Major — privacy claim is not supportable.** The product says spoken
   words are not sent to a service, but `makeRecognition()` instantiates
   `SpeechRecognition`/`webkitSpeechRecognition` without requesting or
   requiring local processing. Browser Web Speech implementations may use a
   remote recognition service. The code must require verified on-device
   recognition or change the claim and retain typed-only fallback.
4. **Major — the content script is injected on `<all_urls>`, not only after
   active-tab use.** It currently waits for a message before collecting labels,
   but this contradicts the "runs on the active page only" privacy wording and
   unnecessarily places code on every matching page. Inject with `activeTab`
   only when the user opens the extension.
5. **Major — unsupported/unlisted marketing claims.** Claims such as
   "Push-to-talk only", "Uses visible labels", the no-network speech claim,
   and the $12/alias behavior are absent from `claims.json`. More seriously,
   the landing page says "Core page actions, **export**, and safety checks stay
   free", but this product contains no export feature. The false export claim
   must be removed or the feature and an observable claim test added.

## API rate limiting

The factory license-verification endpoint was tested only with invalid
throwaway tokens. A rapid 100-request burst to
`/api/v1/products/speak-page-actions/verify` produced 29 HTTP 200 responses
and 71 HTTP 429 responses with `Retry-After: 1`. A follow-up burst remained
throttled (first 429 at request 3, `Retry-After: 4`), so the exact clean-window
threshold could not be isolated, but 429 and Retry-After behavior is present.

## Required disposition

Do not release until all exact claims commands pass; the deployed ZIP is
available; dark-mode contrast is repaired; destructive classification and a
truthful, effective undo strategy are implemented and tested; privacy/copy
claims are made true and listed; and TypeScript checking is made part of the
passing quality gate.
