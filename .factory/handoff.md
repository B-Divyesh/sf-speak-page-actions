# Speak Page Actions handoff — independent verification

## Status: **FAIL — do not release**

Independent QA on 2026-08-28 tested commit
`32300bafd2533146a15584fd4f551ec8b1087e79` and
https://speak-page-actions.sociobot.in. The full evidence is in
`.factory/verification.md`.

Release blockers:

- Every exact claims command listed in `.factory/claims.json` fails with
  Playwright reporting no matching tests.
- The live Download link returns 404 for
  `/downloads/speak-page-actions.zip`, although the local production build
  creates it.
- The extension fails to flag its own sample's Delete action as destructive,
  so it skips the extension review dialog.
- Undo reports success but does not restore a representative deleted item.
- Axe reports serious dark-mode contrast violations on the home and demo
  pages.
- `npx tsc --noEmit` fails with 19 errors.

Useful non-blocking evidence: unfiltered `npm test` and `npm run build` pass;
the demo works offline after first visit; the live JS/CSS exactly match the
candidate build; and the factory license verifier rate-limits with 429 plus
`Retry-After` under burst traffic.

Run the build and broad suite with:

```sh
npm ci
npm test
npm run build
```

The three exact claim commands must be repaired and run individually as
recorded in `.factory/claims.json` before reconsidering release.
