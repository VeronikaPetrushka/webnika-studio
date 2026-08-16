# NEON
### Creative direction for WebNika Studio

> **Scattered ideas, given form.**

---

## 1. The idea

Most developer portfolios argue *"I am good at this."* The proof is a grid of screenshots, and the visitor is asked to take the rest on faith.

This site makes a different argument. It **performs the service instead of describing it.**

Two facts about Veronika drove the whole direction:

1. She works in **Warsaw** — a city with a real, documented heritage of hand-bent gas-discharge neon signage.
2. She has a **Data Science degree** before the web work — structure underneath the craft.

A neon sign is *scattered gas given a single unmistakable shape by a person with a torch.* That is, precisely and unglamorously, what a client is buying: a scattered business idea, given one unmistakable shape by a person who knows how to bend it.

So the site is built around one object made of four thousand loose particles that spends eleven chapters resolving into a finished interface. **The visitor watches chaos become structure while reading about chaos becoming structure.** Nothing is added and nothing is removed — the same particles re-order.

That is the entire concept. Every decision below serves it.

---

## 2. What this direction deliberately avoids

The original site was competent but wore the current defaults: warm cream background, coral accent, big serif headline, three-column feature cards, testimonial slider, pricing table.

Explicitly rejected:

| Rejected | Why | Instead |
|---|---|---|
| Cream `#F4F1EA` + terracotta | The house style of every AI-generated site in 2025–26 | Cool ink `#0B0E14`, cold light theme |
| Display serif headline | Signals "tasteful" without saying anything | Variable-width grotesque using its **width axis** |
| Three feature cards | Zero information hierarchy — everything equally important | Expanding dossier **rows** with real depth |
| Screenshot grid | Static images of live things | Live `iframe`s of the actual deployed sites |
| Generic section reveals | Decoration | Reveals tied to the object's morph state |

The light theme is a **cool grey-blue "daylight spec sheet"** — not warm cream. This matters. It is the single most common tell, and reversing it costs nothing.

---

## 3. Colour — a two-tube system

Colour encodes meaning here. It is not a palette, it is a **rule**, and the same rule drives the particles in the 3D scene.

```
TUBE AMBER   #FF7A1A   hot · unresolved · human · the idea
ARGON ICE    #5FE0FF   cold · resolved · systematic · the build
```

Every particle is amber when far from its target and ice when it arrives. Every headline marks one word amber (the problem) and one ice (the resolution). Pricing gauges fill from amber to ice as commitment increases. **A visitor never consciously decodes this, but by chapter four the two colours mean something to them.**

**Base (dark, default):**

```
Vistula Ink    #0B0E14   the stage — wet asphalt at night
Praga Slate    #10151F   raised plates
Tube Steel     #171E2B   borders, inset frames
Cold Bone      #E8EAEE   type
```

**Light theme** inverts to `#E6E8EC` ground with a deepened accent `#D95A06` and `#12718F` — the same rule, read at noon.

---

## 4. Typography — three faces, three jobs, no overlap

**Archivo** (variable) — display *and* body. The point of choosing it is the **width axis**, which almost nobody uses.

- `wdth 118` — statements. Compressed, signage-like, physically resembling a bent tube.
- `wdth 100` — reading.

Same family, two personalities. The headlines look *engineered* rather than merely *large*.

**Instrument Serif, italic** — used for **exactly one word per headline.** Not a paragraph, not a subhead. One word. The human voice inside the systematic sentence:

> Scattered ideas, *given form.*

**JetBrains Mono** — every readout, index number, chapter marker, spec label. **Never above 0.8rem.** It is instrumentation, not text.

On dark backgrounds display type carries a faint amber/ice `text-shadow` fringe — the chromatic bleed of real gas discharge. Removed entirely in light theme, where tubes don't glow.

---

## 5. Sitemap — eleven chapters, one page

A single scroll, numbered like a document, so the visitor always knows their position.

```
01  TOP           The Object            hero — chaos, the promise
02  PREMISE       diptych               why most small-business sites fail
03  CAPABILITIES  expanding dossier     what is actually on offer
04  WORK          live rail             ten real, deployed sites
05  METHOD        sticky spine          how the work runs, week by week
06  PRICING       three tube gauges     Light / Basic / Pro + fit finder
07  CARE          rows                  what happens after launch
08  STUDIO        portrait              who is behind this
09  SIGNALS       testimony             proof from clients
10  FAQ           accordion             the objections, answered
11  LAUNCH        portal                the ask
```

The left **chapter rail** is a vertical mono readout with a live percentage — an instrument panel, not navigation chrome. It appears after 60vh, so the hero is never cluttered.

---

## 6. The 3D world

### Technology, element by element

| Element | Built with | Why |
|---|---|---|
| **The Object** (particles) | **Three.js / WebGL**, custom GLSL | 4,096 points morphing per-vertex — impossible in DOM or SVG at this count |
| Morph interpolation | **GPU vertex shader** | Zero CPU cost; all five forms computed analytically from a seed |
| Bloom echo + reflection | Two extra `Points` draws, additive | Real bloom post-processing costs a framebuffer; this costs a draw call |
| Blueprint cage | `EdgesGeometry` wireframe | Fades in only near LATTICE — structure made literal |
| Camera | Scripted 7-keyframe path | Deterministic, scroll-locked, never disorienting |
| Vignette + grain | **CSS** | Static overlay; no reason to spend GPU |
| Fallback field | **CSS** keyframes | Works with WebGL disabled entirely |
| Tube dividers | **CSS** gradient + transform | Sub-pixel hairlines are crisper in CSS than WebGL |
| Section plates | **CSS** `backdrop-filter` | Frosted glass over the live scene |
| Portfolio previews | **Live `iframe`s** | These are real deployed sites — showing the actual thing beats a screenshot |
| Icons | **SVG** (lucide) | Crisp, tintable, tiny |
| Portrait | Static PNG + CSS filter | Grayscale → colour on reveal |

**No video anywhere.** A hero video would be 4–20MB for something the particles do better and interactively.

### The five forms

```
0  NEBULA    chaos, drifting, warm         chapters 01–02
1  HELIX     alignment begins              chapter 03
2  LATTICE   rigid structure, cage visible chapters 04–05
3  FACADE    a built interface plane       chapters 06–09
4  PORTAL    an opening, ice-cold          chapters 10–11
```

Morphs are **per-particle staggered** — each point carries a seed that delays its transition by up to 400ms. States therefore *cascade* like a wave rather than snapping. This one detail is most of the perceived quality.

### Interaction

- **Pointer magnetism** — particles lean toward the cursor. Amplitude `0.42` in the hero, `0.08` elsewhere, so it's playful at the top and calm while reading.
- **Click shockwave** — a radial pulse propagates outward from the click, in-shader.
- **Parallax breath** — a slow sine on the camera so the scene is never fully still.

### Performance

Four tiers, auto-detected from device memory, core count, and pointer type:

| Tier | Points | DPR | Extras |
|---|---|---|---|
| high | 4,096 | 1.75 | reflection + echo |
| mid | 1,728 | 1.4 | echo |
| low | 512 | 1.15 | capped 34fps |
| static | — | — | one frame at FACADE |

`prefers-reduced-motion` forces static. WebGL failure falls through to the CSS field. **Three draw calls total.** Three.js loads from CDN, so it adds nothing to the bundle.

---

## 7. Motion system

One `requestAnimationFrame` loop drives everything. Scroll handlers never touch layout properties — only `transform` and `opacity`.

### Timing scale

| Token | Duration | Use |
|---|---|---|
| micro | 140ms | button press, checkbox |
| hover | 280ms | link, card, icon |
| reveal | 900ms | element entering |
| chapter | 1400ms | morph between forms |

### Easing

```
--e-out    cubic-bezier(.22,1,.36,1)     things arriving
--e-inout  cubic-bezier(.65,0,.35,1)     things moving through
--e-soft   cubic-bezier(.33,1,.68,1)     hover, small state
--e-snap   cubic-bezier(.34,1.56,.64,1)  confirmation only
```

`--e-snap` overshoots. It is used **only** where a small physical "yes" is appropriate — never on entrances.

### The reveal vocabulary

Six variants, chosen per content type, never randomly: `lift` (default) · `left`/`right` (diptychs) · `scale` (media) · `tilt` (plates) · `mask` (headlines) · `blur` (quotes).

Headlines reveal **line by line** with a 90ms stagger under a clip mask, so the sentence assembles at reading speed.

### Loading

An **ignition sequence**, not a spinner: a mono counter to 100, then a clip-path wipe. It holds a minimum of 1.1s and resolves on `document.fonts.ready` + first WebGL frame, with a 3.2s hard ceiling. **Section reveals are gated behind it**, so the hero animates *after* the wipe rather than being missed underneath it.

### Cursor

Two-speed: a dot tracking exactly, a ring lagging ~120ms. Elements declare `data-cursor="view"` and the ring grows and takes a label. Fine pointers only — never on touch.

---

## 8. The sections

**01 · Hero.** Type sits lower-left, not centred — the object needs the space and centred hero text is the most exhausted layout on the web. A four-column instrument rail across the bottom: years, projects, languages, response time. Facts as spec-sheet, not "stat cards."

**02 · Premise.** A before/after diptych. Left: what a bad site does. Right: what a considered one does. An arrow between them animates on reveal. The argument is made spatially before it is made in words.

**03 · Capabilities.** **Rows, not cards.** Each expands on hover (or tap) via `grid-template-rows: 0fr → 1fr`, revealing scope, deliverables, and timeline. Cards force every service to look equally important; rows let the visitor dig where they care.

**04 · Work.** A horizontal scroll-snap rail of **live iframes** at 0.5 scale — the ten real deployed sites, running. Loading is deferred: hover-triggered on desktop, `IntersectionObserver` on touch. The rail ends with a dashed "your project here" card that opens the enquiry form. It is the single strongest conversion moment on the page, because the visitor has just watched ten things actually work.

**05 · Method.** A sticky left column and a spine timeline whose nodes ignite as they enter. Runs while the object holds LATTICE — process and structure, same beat.

**06 · Pricing.** Three **tube gauges**. Light `$399` / Basic `$899` / Pro `from $1,699`, the middle one lit. Stacked on mobile — the original's cloned-card carousel had off-by-one scroll bugs and is gone. Below: four guarantees, then the **fit finder** — three questions that recommend a package and pre-fill the enquiry form. It converts browsing into a decision without a human in the loop.

**07 · Care.** Post-launch: `$99` one-time, `$79/mo`, `$790/yr`. Placed immediately after pricing because "what happens when it breaks" is the objection that kills small-business deals.

**08 · Studio.** The portrait, grayscale until revealed, inside an amber/ice inset tube frame. Everything else on the page is systematic; this is the one warm human moment, and it lands harder for being alone.

**09 · Signals.** Testimonials auto-advancing on 7.2s, a large serif quote mark. Kept short — proof, not a wall.

**10 · FAQ.** Sticky side heading with an accordion. Every objection answered plainly.

**11 · Launch.** The object reaches PORTAL. One large ask, the email in plain text, no form wall.

**Transitions.** Sections are frosted **plates floating over the live 3D world** — the object is never covered by a solid block, so the page reads as one continuous space rather than stacked slides. Every divider is a **tube**: a hairline carrying a travelling glow.

---

## 9. Conversion strategy

The page is engineered around one number: **a stranger deciding to email a developer they have never met.**

1. **Sticky command bar** — appears after 85vh, hides again at the end. Carries the 24-hour response promise. Persistent without being a popup.
2. **Fit finder** — three taps, a recommendation, form pre-filled. Removes the "which package?" hesitation that otherwise ends the visit.
3. **Live work rail** — proof by demonstration, positioned before pricing.
4. **Four guarantees** — fixed price, fixed timeline, source code ownership, post-launch support.
5. **Care section directly after pricing** — kills the abandonment objection at the moment it forms.
6. **Modal enquiry form** — budget select (qualifies the lead), honeypot, privacy note, real sending/success/error states, focus trap, body lock.
7. **24-hour response promise**, repeated three times in different registers.
8. **Multiple entry points** — header, hero, every section CTA, work rail end card, command bar, footer. Nine in total, all opening the same modal.

---

## 10. Accessibility & performance

- Full keyboard path, visible focus rings, skip link, focus-trapped modal
- Semantic landmarks; the canvas is `aria-hidden` throughout
- `prefers-reduced-motion` respected at every layer — CSS, JS, and shader
- Three.js CDN-loaded and non-blocking; the site is fully readable before it arrives
- No layout thrash: scroll writes only `transform` / `opacity`
- iframes deferred; images lazy
- Semantic HTML, JSON-LD `ProfessionalService`, per-language `og:locale`, sitemap, robots

---

## 11. Verification

Because this ships without a CI pipeline, two harnesses ride along:

```bash
npm run verify   # syntax, JSX balance, i18n parity, CSS coverage, icons, anchors
npm run smoke    # server-renders the whole tree in en/uk/pl
```

`verify` parses every embedded JSX expression individually and confirms all three languages share an identical 173-key shape. `smoke` renders the full component tree in Node and fails on React warnings or `undefined` leaking into markup.

---

*Direction, design, and build — WebNika Studio, Warsaw.*
