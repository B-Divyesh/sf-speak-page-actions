# Speak Page Actions

Speak visible browser controls on an ordinary page. It is for people with limited vision or hand mobility who want to say or type a control name.

The extension scans only the current page after you open it. Hold the speak button and say a visible control name, such as “click save address.” Hold Space or Enter for the same push-to-talk action. It asks before controls that may publish, submit, delete, pay, or send. Password fields are never listed.

Try four sample controls at [the demo page](https://speak-page-actions.sociobot.in/demo). Sample changes use separate browser storage and never read or change extension settings. Keys start with `demo:spa:` for verification.

## Run locally

```sh
npm ci
npm run dev              # Chromium extension development mode
npm run dev:site         # static site at the shown local URL
npm test
npm run lint
npm run build            # extension in dist/extension and site in dist/site
npm run test:package     # check the downloadable Chrome extension ZIP
```

Load the unpacked `./.output/chrome-mv3` directory from `chrome://extensions` while running `npm run dev`, or use the packaged `dist/site/downloads/speak-page-actions.zip` after a build.

`npm run build:site` is the static deployment command. It writes the site to `dist/site/` and includes the downloadable extension at `dist/site/downloads/speak-page-actions.zip`.

## Privacy and limits

The extension scans only the current page after you open it. It does not capture background microphone audio. Spoken commands run only when the browser offers on-device processing; typing the same command remains available. The public site works offline after its first visit. See [Privacy](https://speak-page-actions.sociobot.in/privacy) and [Terms](https://speak-page-actions.sociobot.in/terms).

## License

MIT. The optional Pro license costs $12 once and saves your own command names. Core accessibility actions and safety checks are free.
