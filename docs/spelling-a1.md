# Μαθαίνω! — Ορθογραφία Α΄ Δημοτικού (v0.6.50)

## Scope and educational basis

This is a **first playable module**, not a claim to implement every first-grade grammar or spelling topic. It follows the general sequence of Greek first-grade literacy: recognize letters, combine them into words, and practice writing words with correct vowels and accents. Reference texts are the Greek Ministry's first-grade language digital-book metadata at https://old.ebooks.edu.gr/new/tautotita.php?course=DSDIM-A110 and the 2026 digital textbook collection at https://ebooksdl.cti.gr/handle/20.500.14040/510 . All in-app text, exercises, choices and drawings are original, with no third-party educational material copied.

## Learning activities

The **Ορθογραφία Α΄** subject on the child's home screen offers three modes with **20 pictured words** in three selectable groups:

1. **Οι πρώτες λέξεις**: παπί, γάτα, μήλο, νερό, γάλα, ήλιος (6).
2. **Προσέχω τον τόνο**: σπίτι, σκύλος, δέντρο, καπέλο, ψωμί, βιβλίο (6).
3. **Πιο προχωρημένες λέξεις**: ψάρι, μπάλα, πουλί, λουλούδι, μπανάνα, τρένο, καράβι, αμάξι (8).

A mixed lesson selects eight shuffled words from all 20, and each specific group presents its own six or eight words. Each word has an original educational SVG picture from `curriculum-art.js`.

Each group can be studied in three ways:

- **Βάζω γράμματα**: arrange a shuffled set of Greek letter tiles into a word, including repeated letters and accented vowels. Tap a slot or use Undo to correct it.
- **Συμπληρώνω**: pick one missing character from four distractors; missing characters mix consonants, unstressed vowels, and accented vowels in a 6/4/10 balance across the full 20-word bank. The dedicated tone-focused unit practices accents deliberately.
- **Γράφω μόνος μου**: type a full word in the device's Greek keyboard, with autocomplete/autocorrection and spellcheck disabled.

Accents are part of the canonical correct answer. Answers with the correct letters but missing/wrong accents receive the focused feedback: **"Τα γράμματα είναι σωστά. Πρόσεξε τον τόνο και δοκίμασε ξανά."** Case and unnecessary spaces are ignored. After a correct answer the child sees the canonical spelling, moves to the next word, and finishes the lesson without grades, timers or streaks. Repeating the unit is allowed.

Optional help: **Άκουσε τη λέξη** uses the on-device Greek speech synthesis if supported; unsupported/no-Greek-voice devices get a clear fallback. **Μικρή βοήθεια** reveals only the first letter and length. **Δες τη λέξη** reveals and hides the full target word.

## Parent configuration and progress

- Parent settings now contain **Ορθογραφία Α΄ Δημοτικού** as a separate allow/deny checkbox.
- Existing A΄/B΄ profiles show the new lesson by default until the parent explicitly saves a choice; other grades are not enabled by default. A parent may enable it for any grade.
- The setting is recorded in the existing `children.allowed_subjects` array plus `children.settings.spellingConfigured`; no schema changes, migrations, new providers, or costs. The original permissions remain unchanged.
- Per-attempt history uses the existing family-RLS-protected `answer_events` table (`subject='spelling'`) with original answer, correct word, whether correct, mode, group and attempt count. Parent reports display **Ορθογραφία Α΄**.
- No unauthenticated content screen is shown. Parent PIN, authentication, other lessons and the whole 25% illustrated-workbook identity remain unchanged.

## Files and validation

- `spelling-a1.js`: original lesson bank and UI state machines; integration with existing subject/topic/study/practice hooks, parental grade gating and answer-event logger.
- `spelling-a1.css`: accessible light/dark 25% workbook styling for tiles, word entry, feedback, mobile width, progress and hints.
- `index.html`: new subject card, parent checkbox, lesson UI, parent setting mapping and reporting label.
- `sw.js`: caches new modules offline for v0.6.50.

Verified with source review and mocked interaction: original artwork IDs, unique IDs, JS parsing, 20 valid accented spellings, shuffle with duplicates, tile answer checking, missing-letter selection, typed-word with missing accent and correction, parent grade permissions, reporting event shape, the existing Supabase `answer_events` column schema and enabled RLS. Browser-rendered iPad screenshots, speech audio on a real device, complete sign-in/PIN/parent-save flow, and offline install/reload remain **unverified**; do not describe them as tested.

If a child has not yet learned a given letter or sound, use only the relevant lower-difficulty group or a parent's guidance. A future content pass should add per-letter progression based on the exact school curriculum edition and child readiness, not assume every first-grader knows the same letters in November.
