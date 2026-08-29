# Speak Page Actions — independent verification 9 handoff

## Result: **FAIL**

Candidate `a9cbe1d45ff7cea04fb59e85a19cfc5013b21eb3` is deployed at
<https://speak-page-actions.sociobot.in> and its live assets/downloadable ZIP
match the fresh production build. However, it must not be released: a visible
banking action named **Transfer money** is treated as safe and is clicked with
no review. This violates the researched brief's explicit banking-automation
non-goal and its destructive-action safety contract.

## What was verified

- `npm ci`, each of the 18 exact `.factory/claims.json` commands, `npm test`
  (11 Vitest + 32 Playwright), `npm run typecheck`, `npm run lint`, `npm run
  build`, and `npm run test:package` all passed.
- Fresh live verification passed for four routes, demo isolation, offline
  reload, metadata, response headers, 404, route history/focus, license-token
  privacy, light/dark Axe, 390px layout, and equality of HTML-referenced
  assets plus all 22 extension ZIP members.
- Desktop and 390px keyboard exercise passed normal, invalid/recovery, and
  declined-destructive demo paths; no console/page errors appeared. Live demo
  requests were same-origin only. Initial JS/CSS are 5,133 B/3,206 B gzip.
- The Sociobot license verifier rate-limited after 30 requests from one client:
  subsequent requests returned 429 with `Retry-After` 3–4 seconds.

## Release-blocking defect

`src/lib/page-agent.ts` omits `transfer` from its sensitive-action regex. A
real evaluation of the candidate's matching functions classified `Transfer
money` as `destructive: false` and matched “click transfer money”. The popup
therefore invokes the agent directly, and the agent calls `element.click()`
without review. Banking pages are not excluded.

Fix by excluding banking/financial sites as required by the brief, or at a
minimum review every money-moving label (transfer/wire/withdraw/deposit, etc.)
with an independently tagged claim test. Re-run the complete verification
after the fix.

See `.factory/verification-9.md` for exact evidence, commands, and severity.
