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
