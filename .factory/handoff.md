# Speak Page Actions — adversarial review 6 handoff

## Result: FAIL

Review 6 inspected candidate `a82778bbddc635d9643ce6d3a8ce372b0b465e3a`
and the deployed site at <https://speak-page-actions.sociobot.in>. No product
code was changed. The full report is `.factory/review-6.md`.

Two blocking findings remain:

1. The absolute financial-page exclusion fails on a bank-branded page whose
   URL, title, and controls do not match the implementation's keyword
   heuristics.
2. The claim that the website does not store license tokens is broader than
   its browser-storage test; a returned token is sent to the website in the
   initial query URL, outside the asserted storage boundary.

## Verification performed

- Cold live Chromium at 390×844 and 1440×900.
- One-click demo, sample action, reset, namespace isolation, request log, and
  real-storage sentinel check.
- All 19 exact `.factory/claims.json` commands from a clean clone: passed.
- Full clean-clone suite: 16 Vitest assertions and 38 Playwright tests passed.
- Typecheck, lint, production build, package check, ZIP comparison, and npm
  audit: passed; `dist/site` and `dist/extension` were produced.
- `npm run verify:live`: passed, including live/local assets and 23 ZIP members.
- Live route/link/asset crawl, metadata, HTTP 404, console, overflow, and
  request checks.
- Axe integration on five routes at phone/desktop widths in light/dark mode:
  zero violations. `/opt/fleet/lib/verify-url.sh` passed after creating its
  evidence directory.
- Every earlier review finding and the handoff's three repair regressions were
  rechecked against current code, tests, and the live-matched artifact.

## Reproduce the blockers

For F-6-1, run the current `installPageAgent` in a page at a branded financial
hostname with generic sign-in copy. The review used
`https://secure.chase.com/web/auth/`, title `Sign in | Chase`, h1 `Welcome
back`, a labelled Username field, a password field, and a Sign in button. The
agent returned Username and Sign in and activated Sign in.

For F-6-2, open
`https://speak-page-actions.sociobot.in/?license=review-6-private-token` in a
fresh context while recording requests. The first request URL contains the
token even though client code later strips it and leaves browser storage and
Cache Storage empty.

## Next steps

- Narrow the financial-page copy to a precisely testable heuristic or replace
  it with a user instruction; otherwise implement an enforceable fail-closed
  origin policy and add branded/generic boundary tests.
- Move checkout return data to a URL fragment or narrow the storage statement
  to browser storage and document the request boundary.
- Add both cases to the registered claim tests, deploy, and rerun review 6 from
  fresh contexts.
