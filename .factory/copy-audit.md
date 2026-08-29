# Copy audit — polish 2

Count rule: whitespace-delimited tokens. Punctuation, hyphenated forms, URLs,
paths, and `$12` count as one word. This audit covers rendered sentences,
headings, labels, buttons, links, facts, states, and README sentences. No
sentence exceeds 22 words or uses a banned plain-words term.

## Landing, demo, and routes

| Copy | Words | Evidence / claim |
| --- | ---: | --- |
| Skip to main content | 4 | keyboard |
| Speak Page Actions | 3 | wordmark |
| Demo | 1 | nav |
| Desktop download | 2 | nav |
| Privacy | 1 | nav |
| Browser controls you can use by voice | 7 | kicker |
| Speak the action you need | 5 | h1 |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 | audience |
| Try it with sample data | 5 | demo action |
| Opens four sample controls without changing a real page. | 9 | `sample-action` |
| Desktop Chrome and Chromium only. | 5 | install disclosure |
| Mobile browsers can run the demo but cannot install this extension. | 11 | install disclosure |
| Page labels stay in your browser | 6 | `page-data-local` |
| Works offline after the first visit | 6 | `offline-reload` |
| Core actions are free; saved command names cost $12 once | 10 | `core-free`, `pro-aliases` |
| What the extension shows | 4 | section kicker |
| Visible controls listed by the extension | 6 | h2 |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 | `visible-labels` |
| How Speak Page Actions works | 5 | h2 |
| Open the extension. | 3 | step |
| It scans the current page only. | 6 | `active-tab-only` |
| Hold to speak. | 3 | step |
| Speak when your browser can process speech on this device, or type the visible control name. | 16 | `on-device-speech`, `typed-command` |
| Review sensitive actions. | 3 | step |
| It asks before actions that submit, delete, publish, send, or pay. | 11 | `destructive-review` |
| What it does not do | 5 | h2 |
| It does not listen in the background. | 7 | limit |
| It never lists password fields. | 5 | `password-exclusion` |
| Install on desktop Chrome or Chromium | 6 | h2 |
| Mobile browsers cannot install this extension. You can still use the demo on this device. | 14 | install limit |
| Download and unzip the extension ZIP. | 6 | install step |
| Open chrome://extensions on desktop Chrome or Chromium. | 6 | install step |
| Turn on Developer mode. | 4 | install step |
| Choose Load unpacked. | 3 | install step |
| Select the unzipped extension folder. | 5 | install step |
| Download the desktop extension ZIP | 5 | download |
| One-time Pro license | 3 | price kicker |
| Save your own command names | 5 | h2 |
| Pro costs $12 once. | 4 | price |
| Save a short name for a visible control. | 8 | price |
| Core page actions and safety checks are free. | 8 | `core-free` |
| Buy Pro in hosted checkout — $12 once | 8 | external checkout |
| Opens Dodo’s checkout in this tab. | 6 | external disclosure |
| Restore a license | 3 | button |
| License token | 2 | label |
| Restore license | 2 | button |
| Demo — sample data, nothing is saved | 7 | `demo-local` |
| Reset demo | 2 | button |
| Start for real | 3 | button |
| Sample checkout page | 3 | kicker |
| Speak a visible control | 5 | demo h1 |
| Hold the mic in the extension, or test the same command below. | 12 | demo help |
| Visible controls on this page | 5 | demo h2 |
| Found four visible controls on Sample checkout. | 7 | `sample-action` |
| Type a command for the sample | 6 | label |
| Run command | 2 | button |
| Sample data stays separate | 4 | h2 |
| Reset restores four sample controls. | 5 | demo help |
| Sample changes use separate browser storage and do not change extension settings. | 12 | `demo-isolation` |
| Privacy for your current page | 6 | privacy h1 |
| Terms for Speak Page Actions | 5 | terms h1 |
| This page could not be found | 6 | 404 h1 |
| Return home | 2 | 404 button |

## Popup, legal states, and README

| Copy | Words | Evidence / claim |
| --- | ---: | --- |
| Scan page | 2 | popup button |
| Say a visible action | 5 | popup h1 |
| Hold Space or Enter with the keyboard. | 7 | `push-to-talk` |
| Hold to speak. Hold Space or Enter with the keyboard. | 10 | talk label |
| Or type the command | 5 | label |
| Run command | 2 | button |
| Visible actions | 2 | popup h2 |
| Undo last page action | 4 | button |
| Save your own command names (Pro) | 6 | disclosure |
| Your command name | 3 | label |
| Visible control | 2 | label |
| Pro license token | 3 | label |
| Save command name | 3 | button |
| Review before action | 3 | dialog kicker |
| Use this action? | 3 | dialog h2 |
| Cancel | 1 | button |
| Use action | 2 | button |
| The extension reads visible labels, roles, and control types on the current page after you open it. | 17 | privacy |
| Aliases and saved license data stay in browser-local extension storage. | 10 | `extension-local-storage` |
| The extension does not send page labels, spoken commands, or browsing history. | 12 | `page-data-local` |
| When you restore Pro, it sends the license token to Sociobot for verification. | 14 | `license-verification` |
| The demo requests stay on this site. | 7 | `demo-local` |
| Pro is a one-time $12 license for saved command names. | 10 | `pro-aliases` |
| Browser pages change often. | 4 | terms |
| The extension may not identify every control or undo actions after a page navigates. | 14 | terms |
| Speak visible browser controls on an ordinary page. | 8 | README |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | README |
| Hold Space or Enter to speak; release the key to stop. | 11 | README |
| Try four sample controls at the demo page. | 8 | README |
| Install on desktop Chrome or Chromium only. | 6 | README |
| Mobile browsers can use the demo but cannot install this extension. | 11 | README |
| Spoken commands work only when your browser can process speech on this device. | 13 | README |
| You can type the same command when speech is unavailable. | 10 | README |
| The public site works offline after its first visit. | 9 | README |
| The optional Pro license costs $12 once and saves your own command names. | 13 | README |

## Terminology

| Concept | One term |
| --- | --- |
| Button, link, or field shown on a page | visible control |
| Spoken or typed instruction | command |
| Isolated try-out | demo |
| Question before a sensitive control | review |
| Browser add-on | extension |
| Personal shortcut for a control | command name |
