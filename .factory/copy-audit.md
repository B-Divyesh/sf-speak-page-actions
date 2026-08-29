# Copy audit — polish 1

Count rule: whitespace-delimited words after Markdown markers are removed.
Hyphenated forms, URLs, paths, and `$12` count as one word. Scope: rendered
home, demo, Privacy, Terms, 404, extension popup, and README headings, labels,
buttons, error states, and body sentences. No audited sentence exceeds 22
words or uses a banned plain-words term.

## Public landing and demo copy

| Copy | Words | Result |
| --- | ---: | --- |
| Browser controls you can use by voice | 7 | pass |
| Speak the action you need | 5 | pass |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 16 | pass |
| Opens four sample controls without changing a real page. | 9 | pass |
| Page labels stay in your browser | 6 | claim: page-data-local |
| Works offline after the first visit | 6 | claim: offline-reload |
| Core actions are free; names cost $12 once | 8 | claim: core-free, pro-aliases |
| Visible controls listed by the extension | 6 | pass |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 | claim: visible-labels |
| It scans the current page only. | 6 | claim: active-tab-only |
| Use on-device speech, or type the visible control name. | 9 | claim: on-device-speech |
| It asks before actions that submit, delete, publish, send, or pay. | 11 | claim: destructive-review |
| It does not listen in the background. | 7 | pass |
| It never lists password fields. | 5 | claim: password-exclusion |
| Download the ZIP, unzip it, then load the folder from Chrome’s Extensions page. | 13 | pass |
| Pro costs $12 once. | 4 | claim: pro-aliases |
| Save a short name for a visible control. | 9 | claim: pro-aliases |
| Demo — sample data, nothing is saved | 7 | claim: demo-local |
| Found four visible controls on Sample checkout. | 7 | claim: sample-action |
| Sample changes use separate browser storage and never read or change extension settings. | 12 | pass |

## Legal, 404, and extension states

| Copy | Words | Result |
| --- | ---: | --- |
| The extension reads visible labels, roles, and control types on the current page after you open it. | 17 | pass |
| It does not read password fields. | 6 | claim: password-exclusion |
| Aliases and saved license data stay in browser-local extension storage. | 10 | claim: extension-local-storage |
| The extension does not send page labels, spoken commands, or browsing history. | 12 | claim: page-data-local |
| When you restore Pro, it sends the license token to Sociobot for verification. | 14 | claim: license-verification |
| The demo requests stay on this site. | 8 | claim: demo-local |
| Pro is a one-time $12 license for saved command names. | 10 | claim: pro-aliases |
| The address may have changed. Return home to learn about visible page actions. | 13 | pass |
| Hold Space or Enter with the keyboard. | 7 | claim: push-to-talk |
| Save a short name for a visible control. The name stays in this browser. | 14 | claim: pro-aliases, extension-local-storage |
| No visible action matched those words. Say or type the label shown below. | 13 | pass |
| The license could not be checked. Connect to the internet and try again. | 12 | pass |

## README and terminology

| Copy | Words | Result |
| --- | ---: | --- |
| Speak visible browser controls on an ordinary page. | 8 | pass |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | pass |
| The extension scans only the current page after you open it. | 11 | claim: active-tab-only |
| Try four sample controls at the demo page. | 8 | claim: sample-action |
| Sample changes use separate browser storage and never read or change extension settings. | 12 | pass |
| check the downloadable Chrome extension ZIP | 6 | pass |
| The optional Pro license costs $12 once and saves your own command names. | 13 | claim: pro-aliases |

| Concept | One term |
| --- | --- |
| Button, link, or field shown on a page | visible control |
| Spoken or typed instruction | command |
| Isolated try-out | demo |
| Question before a sensitive control | review |
| Browser add-on | extension |
| Personal shortcut for a control | command name |
