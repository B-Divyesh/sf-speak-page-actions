# Speak Page Actions

Speak visible buttons, links, and fields on an ordinary browser page. It is for people with limited vision or hand mobility who want a short, reviewable set of page actions.

The extension scans the active tab when you open it. Hold the speak button and say a visible label, such as “click save address.” It asks before labels that may publish, submit, delete, pay, or send. Password fields are never listed.

Try the safe sample at [the demo route](https://speak-page-actions.sociobot.in/demo). It uses the `demo:spa:` browser-storage namespace and does not touch extension settings.

## Run locally

```sh
npm ci
npm run dev              # Chromium extension development mode
npm run dev:site         # static site at the shown local URL
npm test
npm run lint
npm run build            # extension in dist/extension and site in dist/site
npm run test:package     # verify the downloadable MV3 consumer archive
```

Load the unpacked `./.output/chrome-mv3` directory from `chrome://extensions` while running `npm run dev`, or use the packaged `dist/site/downloads/speak-page-actions.zip` after a build.

`npm run build:site` is the static deployment command. It writes the site to `dist/site/` and includes the downloadable extension at `dist/site/downloads/speak-page-actions.zip`.

## Privacy and limits

The extension scans only the active page after you open it. It does not capture background microphone audio. Spoken commands run only when the browser offers on-device processing; typing the same command remains available. The public site works offline after its first visit. See [Privacy](https://speak-page-actions.sociobot.in/privacy) and [Terms](https://speak-page-actions.sociobot.in/terms).

## License

MIT. The optional pro license is a one-time $12 Sociobot license for saved local command aliases. Core accessibility actions and safety checks are free.
