# WebNika Studio

Custom web design and development — Warsaw.
Redesign codename **NEON**. Creative direction: [`CONCEPT.md`](./CONCEPT.md).

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run verify       # static checks — no bundler needed
npm run smoke        # server-renders the app in en / uk / pl
npm run build        # production bundle -> dist/
npm run preview      # serve dist/ locally
npm run check        # verify + build
```

Run `npm run verify && npm run smoke` before every deploy. Both are fast and
neither needs a browser.

---

## Structure

```
index.html              SEO, JSON-LD, fonts, pre-paint theme
src/
  main.jsx              app shell — theme, language, scroll driver, modal
  sections.jsx          the eleven chapters
  ui.jsx                primitives — Btn, Cursor, Loader, Rich, Lines, Ticker
  content.js            all copy, en / uk / pl  (single source of truth)
  lib/
    scene.js            the WebGL particle world
    motion.js           reveal / scroll / pointer / parallax hooks
  styles/
    tokens.css          design tokens        <- load order matters
    base.css            reset + type roles
    components.css      chrome and controls
    sections.css        per-chapter layout
scripts/
  verify.mjs            static verification
  smoke.mjs             server-render smoke test
  jsx-transform.mjs     minimal JSX transform (smoke test only)
tools/blender/          optional 3D asset pipeline — see below
public/assets/          favicons, portrait, social preview
```

---

## Editing copy

Everything lives in `src/content.js`. All three languages must keep an
**identical key shape** — `npm run verify` fails if they drift.

Copy supports a small markup dialect:

| Syntax | Renders as |
|---|---|
| `[[word]]` | amber mark |
| `((word))` | ice mark |
| `{{word}}` | italic serif — the human voice |
| `//` | hard line break |

Use `{{ }}` **once per headline**. It stops working the moment it is common.

---

## The 3D scene

`src/lib/scene.js` is self-contained and loads Three.js r128 from CDN at
runtime, so it adds nothing to the bundle.

Tuning lives at the top of the file: `FORMS`, `CAMERA_PATH`, and the quality
tiers in `detectQuality()`. Scroll progress maps to form via
`formFromProgress(p)`.

The five forms are computed analytically in the vertex shader — there are no
mesh assets to load, and nothing breaks if `tools/blender/` is ignored.

---

## Optional: Blender asset pipeline

`tools/blender/export_morph_targets.py` samples selected Blender meshes into
evenly distributed point clouds and writes them as morph targets the scene
can consume. This is an **upgrade path, not a dependency** — the site runs
fully without it.

Use it if you want a form built from real geometry (a monogram, a Warsaw
facade, a bent tube) instead of a mathematical one.

```bash
blender your.blend --background --python tools/blender/export_morph_targets.py -- \
  --count 4096 --out public/assets/forms.json
```

Or, with the Blender MCP addon running on `localhost:9876`, run it from the
text editor / Python console against the live session.

The exporter is standalone and tested only against Blender's own API — after
generating `forms.json`, wiring it into `scene.js` is a deliberate second
step (add a `THREE.BufferAttribute` for the sampled positions and blend it
against the analytic target in the vertex shader).

---

## Deploy

Vercel, zero config — `npm run build`, output `dist/`.

Update `hostname` in `vite.config.js` and the absolute URLs in `index.html`
(`og:image`, `canonical`, JSON-LD) if the domain changes.

---

## Contact form

Posts JSON to FormSubmit. The endpoint is in `src/content.js` under
`contact.endpoint`. Honeypot field is `_honey`.

---

## Browser support

Modern evergreen browsers. Degrades cleanly:
WebGL unavailable → CSS particle field · `backdrop-filter` unsupported →
solid plates · `prefers-reduced-motion` → single static frame, no reveals.
