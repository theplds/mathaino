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
