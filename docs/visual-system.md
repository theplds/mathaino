# Μαθαίνω! — Visual System & SVG Asset Plan
Updated: 2 November 2026

## 1. Implementation specification

- Use **original SVG drawings**, not emoji, stock illustrations, remote images, or third-party icon fonts.
- Use existing small **line icons** for navigation, menus, player controls, subject tabs and avatars; use larger scene drawings where they help children learn a concept.
- Shapes: rounded, approximately 2–4 px dark navy outlines, pastel blue background, restrained orange/teal/cream accents; readable in light and dark interface themes.
- Study pages use **static** illustrations next to explanations. Activities use **gentle, purposeful animation** of the same drawing. Motion reinforces the actual concept, never merely decorates a page.
- No sounds, countdowns, streaks, lives, compulsory achievements, or artificial rewards.
- Text and drawings must remain comprehensible when animations are disabled. CSS respects the user's reduced-motion preference.
- Use responsive SVG viewBox coordinates and fluid widths. Essential content must also work on a phone at 320 px width.
- Provide descriptive Greek accessible labels to instructional drawings; mark decorative navigation icons as aria-hidden and keep descriptive text or button labels.
- SVG scenes and CSS must be precached for offline operation. Existing user profiles and access permissions remain intact.

### Architecture

Energy illustrations live in **energy-art.js** and their animation rules live in **energy-art.css**. The interface calls window.MathainoArt.draw(sceneId, compact), which generates a self-contained SVG. Compact versions are static; full versions animate. The existing index.html function lineIcon(name) provides small icons. Main app uses no external image CDN to render these scenes.

### Energy lesson interaction

1. Child opens the Energy FE1 study section and views seven static illustrated forms of energy.
2. Three workbook examples show fuel, a wound watch spring and a rolling ball as static drawings.
3. In **Γίνε ντετέκτιβ ενέργειας**, an animated scene accompanies a short situation.
4. Child identifies the appropriate form of energy. Wrong choices receive a gentle prompt to try again; correct choices receive an explanation.
5. Continue through nine examples. No timer or penalty. Activity must work with reduced motion.

## 2. SVG energy asset inventory

| Asset ID | Concept | Drawing | Animation |
| --- | --- | --- | --- |
| bread | Chemical | Bread on a plate | Gentle accent motion |
| circuit | Electrical | Battery, wire circuit, lamp | Dashes along connected wiring; bulb halo pulse |
| atom | Nuclear | Schematic nucleus and electrons | Slow schematic electron movement, not a literal atomic model |
| heat | Heat transfer | Steaming cup | Rising heat/steam lines |
| ball | Kinetic | Ball with ground line | Short rolling movement |
| bow | Potential | Taut bow and unlaunched arrow | Small tension movement, no arrow firing |
| sun | Light | Sun and rays | Gentle ray pulse |
| fuel | Chemical | Closed fuel canister | Stored-energy accent; no flame while stored |
| watch | Potential | Wound mechanical watch/spring | Small hand and spring motion |

SVGs are source-editable, bundled in-app, render offline, and share a 360 × 210 viewBox. Each has an appropriate Greek aria-label.

## 3. Screen-by-screen icon and asset map

| Screen | Artwork / icons | Rollout |
| --- | --- | --- |
| Header and general navigation | Book, settings, lock and reports-chart line drawings | Implemented |
| Child profile selection | Boy, girl, fox, bear and star line drawings | Implemented; legacy stored avatar emoji are converted before display |
| Subject buttons | Math multiply, addition plus, languages globe, reading book, Physics custom energy outline, History book | Implemented; Physics energy symbol is an original SVG line drawing |
| Reading picture-choice activity | Duck, ball, apple, cat, house, fish, water, sun line drawings | Implemented |
| History Δ — study | Geography, ship, travel line and arrival graphics | Existing SVG animation preserved |
| History Δ — activity | Colonization decision flow, with consistent line icons | Text decisions now emoji-free; optional illustrated situation cards later |
| History Δ — player | SVG play, pause, repeat, fullscreen and close symbols; seek bar | Implemented |
| History Ε — study | Written historical explanations | Existing content preserved |
| History Ε — interactive city | Inline SVG walls, waterworks, market, art and religious buildings | Existing city illustration preserved; button text emoji-free |
| Physics Ε — Energy study | Seven static illustrated forms and three workbook example pictures | Implemented |
| Physics Ε — Energy activity | Nine animated drawings corresponding to the energy scenarios | Implemented |
| Parent dashboard | Settings/lock/chart icons and line-drawn child avatars | Implemented |

## 4. Animation specification

- Primary goal: motion communicates energy, not excitement or reward.
- Short loops around 1–5 seconds; schematic atom motion intentionally slower.
- Ball moves while ground remains still; dash pattern moves through the circuit while the wire stays fixed; steam rises from the cup.
- A fuel canister must not animate as if it is already burning; a stretched bow must not fire itself while the scenario describes stored energy.
- Provide CSS media rule for prefers-reduced-motion: reduce to stop all scene animations. Static scenes remain fully legible.
- Study gallery uses static artwork by default. Animated illustrations appear only in the interactive activity.

## 5. Validation checklist

1. Study: seven SVG form cards plus fuel/watch/ball recap appear, with no emoji and no motion.
2. Activity: nine unique examples appear with the correct drawing and small animation.
3. All 10 Energy revision questions, answer explanations and retries still work.
4. Reduced motion: animated scenes become static, information unchanged.
5. Offline after app installation: energy-art.js and energy-art.css both load from cache.
6. Child profiles with previously saved emoji values display drawings, not emoji.
7. Reading picture question uses its matching line drawing and does not reveal the answer early.
8. History Δ ship and fullscreen map playback, History Ε city builder, parent PIN, reports and existing profiles are unaffected.
9. Test Chrome Android, Chrome Windows and narrow layouts. Check that touch targets and labels remain legible.
10. Do not treat successful commits as real-device testing.

## 6. Follow-on design tasks

- Add illustrated situation cards to the Greek-colonization adventure, without altering the existing map study mode.
- Offer an in-lesson Pause Motion option independent of OS settings.
- Consider a small standalone SVG preview catalogue for designers and parents.

## 7. Files

- index.html — screen routing, original small line icons, Energy lesson content and interactivity
- energy-art.js — nine original educational SVG scenes
- energy-art.css — animation rules, compact/static mode, reduced-motion support
- sw.js — offline cache including illustration and style files

All energy art is original vector source, not raster screenshots or external photo assets.

## 8. Profile pictures and parent navigation (v0.6.40)

- Six reusable **original educational-style illustrated avatars** are bundled: fox, bear, cat, owl, robot and astronaut. Existing legacy avatars (boy, girl, star) still render as original SVG drawings.
- `avatar-art.js` owns the original SVG artwork; `avatar-art.css` owns profile card layout, selectable picture gallery, and responsive/dark styles.
- A child can choose a picture in two locations: a separate **Αλλαγή εικόνας** button on their profile card, or a corresponding button on their own lesson home screen.
- Opening a child's learning experience remains a separate action; changing a picture never launches the lesson readiness exercises.
- Picture selection writes only `children.icon` through the current signed-in family session, filters by the existing child's UUID, requests the updated row, and verifies that one row was returned. Do **not** update age, grade, permissions, settings, or any other field through the child-facing picker.
- Save errors leave the previous picture and all other settings unchanged; choosing an existing picture does not perform an unnecessary database write.
- The parent dashboard has an explicit **Έξοδος από τις ρυθμίσεις** button in the header. It returns to the screen that opened the PIN prompt (e.g., child home or profile chooser), clears the parent-unlocked state, and will require the PIN again on re-entry.
- The dropdown in the parent editor is labelled **Επεξεργασία ρυθμίσεων παιδιού**, so it is not confused with navigation or changing who is learning.
- Existing profile avatars selected by children must appear correctly in the parent editor. The parent may still select an illustration in the protected settings.
- App assets are precached in the PWA service worker: both avatar JS and CSS must be available after the first successful load.

Additional checks: Profile avatars persist after a logout/login; parent Exit returns to the origin screen; no child-facing avatar operation modifies `allowed_subjects`; allow retry after a failed write.

## 9. Curriculum dashboard and beginner reading illustrations (v0.6.41)

The subject menu is now a responsive grid of **eight fully drawn SVG subject cards** using the same consistent palette, rounded lines, and quiet, functional style as the Energy FE1 lesson. Unlike the previous icon-sized drawings, each illustration is large enough for a child to recognise the underlying subject. The eight subjects are mathematics tables, addition, beginner reading, English, French, History Δ΄, History Ε΄, and Physics Ε΄.

- `curriculum-art.js` provides `MathainoIllustrations.subject(id)` and `MathainoIllustrations.word(id)`, with the descriptions and titles for each card. The assets are SVG source, not images downloaded at runtime.
- `curriculum-art.css` defines the responsive subject-card grid, currently selected card styling, lesson selection panel, and responsive reading exercises. On 320–410 px phones cards remain in a two-column layout without horizontal scrolling; large tap targets and text remain visible.
- The lesson selection panel displays a context-specific description; it hides **number of questions** on lessons with fixed question counts (History and Physics) to avoid implying the user can adjust an ignored setting. When the lesson has only one unit, its title is shown as static text instead of a meaningless dropdown.
- The source-of-truth for which subjects appear is unchanged: existing per-child `allowed_subjects`, the Ε΄ Δημοτικού default behavior, and explicit parent settings. Selecting a card still runs the original `topics()` flow. Grade 5 Physics and History still open their existing lessons.
- Beginner reading activities, including the gate, study cards, and practice question images, now use **eight larger original educational SVGs** for duck, ball, apple, cat, house, fish, water, sun. The educational meaning is the same, but the images share the Physics aesthetic instead of displaying rudimentary line icons.
- Visual selection is conveyed through both a stronger outline and textual `επιλεγμένο` state, with `aria-pressed` on each subject button. The drawings are `aria-hidden` on subject cards because the text duplicates their subject information; exercise drawings keep descriptive labels.
- Both code and CSS files are bundled in the service-worker cache. The standalone `curriculum-preview.html` gallery displays both subject and reading sets for design inspection.
- Preserve all existing parent PIN behavior, personal icon choices, cloud permissions and billing/learning logs while changing presentation.

Test: choose each grade profile; verify only assigned subjects render; pick each subject and verify its illustration, description, unit and actions; test Physics Energy, both History grades, reading gate/study/exercise, phone viewport, dark mode, reduced-motion setting and offline behavior.

## 10. Illustrated History lesson introductions (v0.6.42)

The two History lessons now introduce their chapters using the same original vector drawings used on the subject cards, instead of unrelated or decorative intro pictures. History Δ΄ displays a compact ship-and-sea illustration alongside the educational description, and History Ε΄ displays a schematic walled-city illustration above its study/adventure controls.

Both introductory drawings come directly from the reusable `MathainoIllustrations.subject()` library, are static (study material does not need motion), and use `aria-hidden` when the accompanying Greek text already conveys the same information. The existing Greek colonies video-map player, History Ε΄ city activity, written study material, and quizzes are preserved.

The app and offline cache are updated together to v0.6.42. Visual review: `curriculum-preview.html` lists all eight subject cards and all eight reading pictures.

Remaining improvements: expand lesson-specific drawings for other grades once additional curriculum chapters are added; use the same line thickness, colors and accessibility across those future assets.

## 11. Early-reader welcome — Konstantinos / Β΄ Δημοτικού (v0.6.43)

Follow the agreed **two-slide** opening for second-grade and reading-only profiles. This is a welcoming warm-up, **not a spelling trap or mandatory assessment**.

1. First slide contains **only the current weekday in Greek as a single large word** (for example, «Κυριακή» on Sunday or «Δευτέρα» on Monday), followed by the large **«Εντάξει!»** button. No maths question, no misspelling choices, no instruction sentence, and no unnecessary distracting controls. Determine the weekday dynamically in the `Europe/Athens` time zone.
2. Second slide contains **one large, immediately recognizable original Physics-style SVG drawing** and exactly **four correctly spelled, simple Greek words**. The child matches the picture to its name. Use pictures and words `παπί`, `μπάλα`, `μήλο`, `γάτα`, `σπίτι`; the answer choices are familiar distinct words rather than incorrect versions of the same word. Reuse the existing `MathainoIllustrations.word()` artwork.
3. Show gentle optional feedback on selection. The **«Συνέχεια»** button is always available on the second slide, including before an answer is selected, so a child can proceed without being blocked. Back from the picture leads to the weekday.
4. The existing short mathematics entry question remains unchanged for older profiles. This update must never modify parental permissions, report logs, lessons, or the stored grade.
5. `#gate.gate-day.hidden` must have `display:none!important` in CSS, since the first screen is otherwise laid out with flex and could remain visible behind slide two.

Tests: Sunday -> «Κυριακή», Monday -> «Δευτέρα»; no answer buttons in slide one; slide two has four correctly spelled words and the matching SVG; Back returns to the day, and Continue opens the correct child home even without selecting an answer; older child still sees their existing initial question. CSS, SVG asset and PWA cache versions must be updated together.

## 12. Unambiguous reading illustrations — child's first picture gate (v0.6.44)

### Visual brief

The eight illustrations for early Greek reading are now redrawn from scratch with a consistent, simple **educational workbook** style matching the Physics FE1 visual language. These are intended to be recognized immediately by a seven-year-old before reading any of the proposed answers, **not stylized, abstract, iconographic puzzles**.

**Common rules:** A single large identifiable subject; no distracting objects, textual labels or visual clues containing the answer. Flat pastel fills, gently rounded, solid navy-blue #315a70 contours, roughly 3–4 SVG coordinate units stroke width; minimal interior details; stable centered composition and generous margins. The full background is opaque, and CSS—not the SVG background rectangle—handles rounded clipping so the dark theme cannot create black corner cut-outs. The same SVG is used at the child's gate, study flashcards and quiz.

| ID | Greek word | Non-negotiable identifying features |
| --- | --- | --- |
| `duck` | παπί | Side-view golden duckling, clearly separate **round head**, single eye, **orange flat beak**, long oval body, visible oval wing, feet, small blue water ripples; no floating head/wing impression |
| `ball` | μπάλα | Single genuinely round soccer ball with clearly visible center panel, external contour and simple line pattern |
| `apple` | μήλο | Red/pink apple silhouette with a recognizable inward top notch, green leaf and short stem |
| `cat` | γάτα | A **sitting cat** rather than a disembodied face: pointed ears, two eyes, whiskers, body, paws and curled tail |
| `house` | σπίτι | Freestanding simple house with a triangle roof, door and two windows; small ground line |
| `fish` | ψάρι | Side-view fish with smoothly curved body, distinct triangle tail, top/bottom fins, eye and a small amount of water |
| `water` | νερό | Clearly half-filled transparent **glass of water**, an unmistakable blue water line; no abstract teardrop |
| `sun` | ήλιος | Large circular yellow sun with long straight rays, no unnecessary facial features |

### Acceptance test and integration

Use `curriculum-preview.html` to compare the complete illustrated set as one family. Confirm silhouette recognition at 120–180 px, and zoom to gate size. The gate asks only `Διάλεξε τη λέξη` and gives four **correctly spelled real Greek words**. The current-day first slide and optional continuation remain unchanged. Test actual dark-mode gate background at the corners: the image background must be solid without transparent wedges. Confirm all `MathainoIllustrations.word()` entries keep their identifiers and Greek accessibility labels, so existing questions, subject permissions and reporting aren't disrupted. Ensure app and offline cache versions both advance to v0.6.44 and refresh `curriculum-art.js` assets.

Changes are deliberately confined to the illustrated assets and cache references; we are not changing spelling content, quiz logic or a child's learning permissions in this rollout.
