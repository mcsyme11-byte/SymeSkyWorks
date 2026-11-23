<p align="center"><img src="../brand/patch/syme-skyworks-patch.png" width="110" alt="Syme Skyworks mission patch"></p>

# Syme Skyworks design guide

Syme Skyworks follows the shared "old money" look used across Malcolm Syme's projects (the portfolio, Flight Deck Suite, Hot Mic and NASA Data Projects): navy, brass and cream, serif type, thin brass rules, kept modern.

## Logo

The **Syme Skyworks mission patch** is the main logo (adopted November 17, 2026). Files and size rules are in [`brand/README.md`](../brand/README.md).

| Where | Version |
|---|---|
| Website hero | Full patch, 170–232 px |
| Website footer | Full patch, 84 px |
| Website top bar | Small mark, 34 px |
| Favicon, browser tab | Small mark (`favicon.svg`, `favicon.ico` 16/32/48) |
| Phone home screen | Mark on navy (`apple-touch-icon.png` 180 px, `icon-192/512.png`) |
| Share preview | Patch centred on navy (`og-image.jpg`, 1200 × 630) |
| Documents and print | Full patch PNG |

## Colour

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#141B26` | Page background |
| `--bg2` | `#0F1520` | Alternate sections, top bar |
| `--deep` | `#0C1119` | Footer, band, patch fill |
| `--card` | `#1A2333` | Cards and form |
| `--line` / `--line2` | `#2A3446` / `#3A465C` | Rules and borders |
| `--brass` | `#C0A062` | Accents, rules, patch ring |
| `--brass-bright` | `#E2C88E` | Highlights, figures, links |
| `--brass-dim` | `#7E6A45` | Quiet brass borders |
| `--ink` | `#EDE6D3` | Main text (cream) |
| `--ink2` | `#B4AFA2` | Body text |
| `--muted` | `#98A0AB` | Labels and captions |
| `--green` | `#8FB996` | Patch inner ring (current project) |

Blue (`#2E86C1`) from the old site is retired.

## Type

- One family: **Georgia** (falls back to Palatino, then any serif). No web fonts to download.
- Headings: regular weight, large; the main title fades from cream to brass.
- Labels ("eyebrows"): 11.5–13 px, uppercase, wide letter spacing, in brass or grey.
- Body: 17 px, line height 1.65.

## Layout

- Content width 1140 px; side gutter 16–40 px.
- Sections alternate `--bg` and `--bg2`, separated by 1 px rules.
- Cards: 10 px corners, 1 px border that turns brass on hover.
- Buttons: pill shape; primary is brass, secondary is outlined.
- Icons: original thin line drawings in brass inside a brass circle. No emoji.
- Works at phone (one column), tablet (two) and desktop (three).

## Seasonal services

- **Tabs** (pill style, brass when selected) switch between Snow Shoveling and Landscaping.
- **Map:** Leaflet with OpenStreetMap tiles, dimmed with a CSS filter to match the navy palette (CARTO's free tiles now need a paid key). The service area is a dashed brass ring (600 m) with a light brass fill. No pin or address on the owner's house. The map loads only when scrolled into view and doesn't zoom on scroll.
- **Pop-up:** a card in the bottom corner (bottom sheet on phones), not a page-blocking modal. It appears 3.5 s after load, once per visitor per season, and closes with ×, Esc or its button.
- **Form:** posts to the same Formspree endpoint; fields for the other service hide automatically.

## Motion and performance

- Animate only `transform` and `opacity`. No `backdrop-filter`, no custom cursor, no per-frame scroll handlers.
- Sections fade up once as they enter view; all motion stops when the visitor has "reduce motion" turned on.
- Photos load lazily from 720 px thumbnails; full size opens only in the gallery viewer.

## Credit line

Every page, document and app carries:

> © Malcolm Syme · mcsyme11@gmail.com
> Syme Skyworks™ and the Syme Skyworks mission patch are trademarks of Malcolm Syme.

## Public-site privacy

The site is public: no street address. Contact details are name, email, phone and service area only.

---

<p align="center">
  <img src="../brand/mark/syme-skyworks-mark.svg" width="36" alt="Syme Skyworks mark"><br>
  <sub>© 2026 Malcolm Syme · mcsyme11@gmail.com · All rights reserved.<br>
  Syme Skyworks™ and the Syme Skyworks mission patch are trademarks of Malcolm Syme.</sub>
</p>
