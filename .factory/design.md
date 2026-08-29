# Speak Page Actions visual system

## Direction

**Dithered / halftone print system.** The interface borrows from a high-contrast instruction card, not a listening assistant: named actions are inked labels, spoken words become visible marks, and a confirmation is a deliberate overprint. It makes the extension feel inspectable and page-scoped.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f7f0df` | warm paper background |
| `--ink` | `#17202a` | headings and body text |
| `--muted-ink` | `#46515c` | secondary text |
| `--oxide` | `#a92d24` | speak / destructive attention |
| `--oxide-ink` | `#ffffff` | text on oxide |
| `--cobalt` | `#155b8c` | links and focus |
| `--mint` | `#d9e9d5` | successful action / safe confirmation |
| `--amber` | `#f7cf6b` | review state |
| `--night` | `#111820` | dark treatment background |

The system has an explicit dark treatment. Both paper and night retain high contrast with their text colours.

## Type and spacing

Display text uses the local system serif stack, `Georgia, ui-serif, serif`, giving commands the weight of printed instruction cards. Interface copy uses `system-ui, sans-serif` for clear control labels. No remote fonts load. The scale is 12 / 14 / 16 / 20 / 28 / 48px. Spacing follows an 8px rhythm with a 24px compact panel gutter and 72px desktop section gaps.

## Shapes and interaction

Buttons are square-ish ink stamps with a 2px outline and a 3px offset shadow. Action labels have small dotted rule separators. Cards are used only for independent page actions. A halftone pattern sits behind headings and status glyphs; it is CSS, so it remains sharp and does not add image weight.

Every interactive target is at least 44 by 44 CSS pixels on the 390px site and extension popup. Compact text links keep their printed-label appearance while their hit areas expand around the ink.

The signature interaction is a single expanding ring from the push-to-talk control while speech is active. The ring stops immediately when listening stops. With reduced motion it becomes a static oxide outline; all other transitions are removed.

## Art plan and provenance

Hero art is an original generated editorial scene: an abstract browser sheet and a sound-wave pointer, made of cyan and oxide screen-print dots on warm paper. It contains no readable text, brands, people, or logos. It is used on the site and composed/cropped for social preview. It will be generated through `/opt/fleet/lib/gen-image.sh`, manually reviewed, optimised to WebP under 300 KB, and recorded here with its final prompt and generation date.

Prompt: `Editorial screen-print illustration, abstract browser page with labelled action bars and a single sound wave becoming a pointing cursor, warm ivory recycled paper, cobalt blue and brick oxide red ink, crisp halftone dots and offset print registration, flat poster composition, generous negative space, accessibility utility mood, no text, no letters, no watermark, no logos, no people, no brands`

Generated asset provenance: Azure AI Foundry factory image deployment, 2026-08-28, original product artwork. Generated imagery disclosure appears in the site footer.
