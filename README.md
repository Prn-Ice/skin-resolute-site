# Skin Resolute

A static brand site for **Skin Resolute** — a certified aesthetician's studio offering honest, warm, science-backed skin care guidance.

Built as a multi-page HTML site with a custom design system, dual reading modes ("faithful" / "playful"), and embedded SVG logo generation.

## Pages

- **Index** (`index.html`) — Brand home, voice samples, featured series, beliefs
- **Acne Awareness Series** (`acne-awareness.html`)
- **Skin Types** (`skin-types.html`)
- **Bare-Face Method** (`bare-face-method.html`)
- **Study Helper** (`study-helper-v2.html`) — Revision desk for skin conditions, anatomy, and formulation
- **Voice** (`voice.html`) — About the founder, principles, and lexicon

## Assets

| File | Purpose |
|------|---------|
| `theme.css` | Design tokens, typography, layout system, components |
| `theme.js` | Mode toggle (faithful / playful) with localStorage persistence |
| `logo.js` | SVG wordmark generator (primary + cream variants) |
| `study-images/` | Study Helper illustration assets |

## Design system

- Two themes: **Faithful** (calm, sophisticated) and **Playful** (warm, vibrant)
- Fonts: Cormorant Garamond, Mulish, Caveat, Quicksand (Google Fonts)
- Light Naija Pidgin flavour in the brand voice
- No sponsored product rankings — genuine, independent guidance

## Development

The site is pure HTML/CSS/JS — no build step required. Open any `.html` file directly in a browser.

```bash
open index.html
```

## Deployment

Pushed to GitHub Pages via a GitHub Actions workflow (`.github/workflows/pages.yml`).
