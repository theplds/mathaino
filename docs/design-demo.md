# Μαθαίνω! — Independent v2 Design Demo

Live standalone route: `/mathaino/design-demo.html`

This prototype demonstrates a coherent design system **without changing the existing family app** or its authenticated user records. It contains **original code and educational content** and reuses only our own Mathaino SVG illustration libraries (`curriculum-art.js` and `energy-art.js`). It does not scrape, reproduce, download or import Akademio assets or lessons.

## Design language

- A calm deep-sea-teal navigation area instead of a nearly black interface; flexible white and dark learning surfaces.
- System fonts, large educational headings, muted background panels, high-contrast highlighted targets, clear learner progress and a single visually prominent action.
- Shared card, button, navigation and lesson-pattern components for Reading, History and Physics.
- Desktop sidebar + mobile off-canvas navigation; light/dark theme with only the preference stored on device.
- Consistent touch sizes, keyboard-focus outlines, accessible spoken-word fallback and reduced-motion behavior.
- No timers, streaks, ranking, purchase flow, user login or data capture.

## Actual interactive modules

1. **Reading — "Χτίζω τη λέξη"** for beginning Greek readers: 3 illustrated words (παπί, γάτα, μήλο), scrambled letter tiles, interactive answer slots, undo/remove-a-letter, explicit Check, immediate explanatory feedback, next/again, and optional device TTS. This is a mechanics demo, *not* yet a full curriculum.
2. **History — "Οι Έλληνες ταξιδεύουν"**: independently written three-stage ancient-Greek-colonies timeline, clickable stages, narrative explanations and a single choice question with gentle retry.
3. **Physics — "Η ενέργεια έχει πολλά πρόσωπα"**: 3 original energy-form examples (electrical circuit, food, rolling ball); visually reuse our in-app Physics lesson SVGs; three choices with conceptual feedback.

All activity content is illustrative and should be academically reviewed before replacing production curricula.

## Technical constraints and implementation

`design-demo.html`: semantic screens, navigation, readable descriptions. `design-demo.css`: reusable responsive design tokens, mobile layouts, dark theme. `design-demo.js`: the three interactive state machines, no external data calls.

Production `index.html`, parents' PIN, household and child settings, question logs, Supabase data and PWA are unchanged.

The demo loads the existing original SVGs from `curriculum-art.js?v=646` and `energy-art.js?v=637` with `energy-art.css?v=637`. It runs on GitHub Pages. It has no authentication and no sensitive personal details; the visible learner is a generic demo profile.

## Verification

- All 51 demo element IDs unique and all referenced IDs exist.
- All JavaScript files parse and CSS braces balance.
- Mock-DOM interaction tests passed: navigation to each lesson; Greek letter tiles `ΠΑΠΙ`, answer checking and step advance; History stage progression and correct answer; Physics circuit answer and progression; theme toggle.
- Actual rendered screenshots, hover/focus behavior, mobile responsiveness and text-to-speech have **not been verified on the user's device**. Review the hosted prototype in a browser and note any visual discrepancies.
- Existing app remains v0.6.47; this is a standalone design demonstration, not an unapproved whole-app replacement.

## Evaluation before a production rollout

Evaluate with both child and parent on actual devices. Look for clear navigation, readability, independent completion of a word, touch-target sizes, and suitability of word-building as supplementary reading practice. If accepted, migrate tokens/layout/components incrementally starting with the first-reading curriculum, rather than replacing the entire app in one risky change. Preserve all existing permissions, billing/household distinctions, grading and offline lessons.

## Design iteration 2 — 95% precise, 5% hand-rendered

The user approved a modest hand-drawn quality, **balanced but leaning subtle**: borders and SVG outlines should be very slightly imperfect, not childish scribbles. The change is deployed **only in the standalone demo**, so the actual child/parent learning app remains unchanged.

Files:
- `design-demo-handdrawn.css`: a separate theme layer applied with `html[data-sketch="on"]`. Organic asymmetric corner geometry on hero, lesson cards, subject cards, history timeline steps, buttons and word slots. Fine second ink outline on cards using an SVG noise/displacement filter (approximately 1.5 CSS/visual units). Brief decorative drawn underlines on section headings and reading instructions, tiny imperfect hero-decoration circles.
- `design-demo.html`: a single hidden SVG filter definition; explicit `data-sketch="on"` default and visual comparison switch in the header, with no new external assets.
- `design-demo.js`: a functional button toggles `data-sketch="on"/"off"`, `aria-pressed`, and the Greek label. Original mode is clean and straight; sketch mode is the default. The switch does not alter other preferences or child state.

Design limits:
- No hand-lettered display fonts or randomly positioned text, no rotation of interactive controls, no reduced readability, no changing answer-checking logic, no decorative emojis, no score/timer/streak.
- Artwork filter targets drawing contours only; text, layout, photos and instructional board lines remain sharp.
- CSS keeps the same component dimensions and uses `pointer-events:none` on sketch borders; keyboard focus remains unchanged.
- Respect reduced-motion settings and allow quick direct comparison.
- Browser support for SVG CSS filter references varies; asymmetric radii, dashed workbook slots and wavy decorative underlines remain graceful fallbacks if that effect is unsupported.

Regression verification: unique new switch ID, all JS and CSS files parse, no changes to authentication or Supabase, reading tiles/History/Physics interactions unchanged, switch visibly changes data attribute and its accessibility state. Review on actual iPad/browser before applying this system to production.

## Design iteration 3 — hand-rendered **interface**, not just illustration borders

User clarification: the previous styling pass focused too narrowly on subject and exercise visuals; the requested 95% precise / 5% hand-drawn character must be perceptible across the **entire interface**.

A separate, reversible `design-demo-interface.css?v=3` now extends the opt-in `html[data-sketch="on"]` treatment to:
- The **whole workspace**: barely visible workbook-style guide lines, lighter in dark mode
- The **sidebar**: softer layered petrol background, slightly asymmetric nav tabs, ink underline below section labels, an organic active-selection stroke, subtle hand-rendered lesson category dots, and a drawn separator above the footer
- The **top bar**: fine imperfect divider line, gently irregular profile badge, original line icon borders and a tactile theme/sketch switch
- **Navigation/buttons**: 1–3px geometric variation in corners, subtle tab-like shadowing; keyboard focus, click targets and layout stay unchanged
- **Progress bars and tags**: a faint hand-painted progress fill, softer asymmetric chips, reduced uniformity in subject labels
- **Exercise interface**: handwritten-workbook style for history navigation stages, answer boxes, lesson cards and one unobtrusive drawing mark on the picture area; familiar SVG artwork remains intact
- Existing v2 letter-tile and illustration-line refinements remain active

Design quality rule: the whole interface should feel illustrated by a person, not as though its elements have actually moved off grid. Never wobble text glyphs, distort a chessboard, rotate answer targets, create distracting decorations, or compromise legibility for children.

The **5% χειροποίητο** button controls both the original v2 border refinements and the new v3 system-wide UI treatment, keeping a one-tap straight-vs-sketch comparison. Neither CSS file loads in production index.html; the real family app, PIN, children's curricula, local answer logs and Supabase remain untouched.

Technical check: confirm CSS balanced, complete v3 CSS link in the demo HTML, all selectors are gated by `data-sketch="on"`, and reading/History/Physics flows + dark theme continue to work when comparing styles. Manually inspect 320px/mobile and desktop browsers before promoting the interface to production.

## Design iteration 4 — 15% hand-rendered across the entire interface

Michael requested stronger **15%**, not just stronger wobble on the icons. This remains the **independent design prototype**; the authenticated family app is not modified.

- New `design-demo-15percent.css` is layered after the existing v2/v3 sketch CSS, and all of its visual overrides are guarded by `html[data-sketch="on"]`. Compared to the earlier 5%, this now increases intentional handmade qualities in **sidebar**, **header**, **nav buttons**, **app-wide buttons**, **subject cards**, **progress bars**, **lesson panels**, **letter slots**, **letter tiles**, **answer choices**, **topic labels** and **illustrations**.
- Organic borders and asymmetric radii vary in a coherent system instead of each component being independently randomly skewed. Fine original sketch-style seams and decorative lines provide a genuine human-drawn look while reserving white space and hierarchy.
- The lightweight contour-distortion SVG filter is updated to `scale=3.3` with gently varied low-frequency displacement. It is only used on SVG drawing contours and translucent ink overlays, never on text glyphs or answer hit targets.
- Letter tile layout, child-readable type, keyboard focus visibility, responsive spacing, dark mode contrast, and all educational state machines are preserved.
- Comparison switch label and accessible state now read **15% χειροποίητο** when on and **Τέλεια ίσιο** when off. One tap removes all three opt-in sketch-style layers.
- New preview: `https://theplds.github.io/mathaino/design-demo.html?v=4`. Actual family app still uses the existing version and is not affected.

No rendering-based test on the user's mobile device is yet available; the style changes must be judged visually and on touch-size usability before production migration.

## Design iteration 5 — 25% hand-drawn across the entire interface

The user requested **25%** handmade. The demo now ships a fourth optional visual overlay, `design-demo-25percent.css?v=5`, after the 5%, whole-interface, and 15% CSS. This is intentionally more noticeable: workbook-like paper ruling, hand-cut sidebar tabs and ink seams, slightly uneven card and button borders, richer hand-drawn section underlines, irregular progress strips, organic lesson art framing, and tactile reading letter tiles.

Implementation details:
- `design-demo.html` loads the 25% CSS layer, identifies the mode as **25% χειροποίητο**, and changes the existing SVG contour displacement to scale 4.6 (from 3.3) with low-frequency noise.
- `design-demo.js?v=5` updates both visible label and accessibility label; its comparison switch continues to toggle **all** sketch overlays on/off in one action.
- All 25% CSS selectors are behind `html[data-sketch="on"]`, keeping the original straight layout recoverable.
- Text glyphs, alignment, answer hit areas, stored demo theme, lesson logic and existing app permissions remain unchanged. No new artwork or Akademio material is imported.
- Verified JS syntax, responsive/dark mode selectors, linked files, unique element IDs; mock interaction test passed word building, History, Physics, sketch off/on, and dark theme.
- Hosted URL: `https://theplds.github.io/mathaino/design-demo.html?v=5`.
- Note: structural and mocked interaction checks do not validate actual rendered quality on a real iPad. Visually assess before applying to the production family app.
