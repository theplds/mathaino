# Μαθαίνω! · Chess, Fast Cars and external-course policy (v0.6.46)

## Σκάκι — original beginner movement lesson
An interactive board drawn in HTML and CSS with the established school-workbook palette. The board has exactly **64 squares**, coordinates, white pieces facing up, the dark a1 square and light h1 square.
Six independent practice scenarios teach moves of the rook (d4–d7), bishop (c1–f4), knight (g1–f3), queen (d1–h5), king (e1–f2), and pawn (e2–e4).
Children first tap the piece, then the target. Show legal movement locations, a gentle explanation and a Next button; no countdowns, penalties or streaks.
**Important limitation:** This is **not a complete chess game**. It teaches piece movement with a single piece and an empty board, without captures, attacks, check, castling or promotion. Do not claim it has full chess rules or can be played against an opponent.

## Γρήγορα αυτοκίνητα — brand recognition
Eight photos from Wikimedia Commons, with separate **real photos** (not generated drawings) and four unique brand-name choices per question. One photo per brand and a short caption after correctly identifying it. No countdown or penalty; retry and Skip are available.
Images load from Wikimedia Commons at quiz time, and the app gives an explicit clickable image source, author and licence credit. After first download, service worker can cache previously viewed photos for offline re-use; first access to a new photo requires Internet.

| Brand | Model | File title on Wikimedia Commons | Photographer | Licence |
|---|---|---|---|---|
| Ferrari | 458 Italia | 2012 Ferrari 458 Italia red.jpg | Calreyn88 | CC BY 4.0 |
| Lamborghini | Huracán Performante | Lamborghini Huracan Performante green.jpg | Calreyn88 | CC BY-SA 4.0 |
| Porsche | 911 GT3 RS | Porsche 911 GT3RS.jpg | Calreyn88 | CC0 |
| McLaren | 720S | McLaren 720s.jpg | Iorisrandombses5001 | CC0 |
| Bugatti | Chiron | Bugatti Chiron (95375).jpg | Calreyn88 | CC BY-SA 4.0 |
| Aston Martin | DB11 | Aston Martin DB11.jpg | Tokumeigakarinoaoshima | CC BY-SA 4.0 |
| Koenigsegg | Agera | Koenigsegg Agera 1.jpg | MrWalkr | CC BY-SA 4.0 |
| BMW | M4 | BMW M4.jpg | Calreyn88 | CC BY-SA 4.0 |

Verify each photo page before further reuse or alteration, and preserve the authors' attribution and links. The imagery remains the authors' work, not the app's intellectual property. Vehicle brands are used for factual identification, not as brand endorsements.

## Parent dashboard and routing
Both new lesson buttons appear alongside the existing grade-specific subjects. New parent settings checkboxes control Chess and Fast Cars **separately for each child**. For legacy family profiles, both are enabled by default until the parent explicitly saves their selections. The `extraSubjectsConfigured` flag is stored in the existing settings JSON for that child, and the chosen subjects in `allowed_subjects`. Other subjects, History, Physics, reading, profile picture permissions and PIN remain as before.

## akademio.gr — copyright and reuse evaluation
As of 3 November 2026, the literal domain **akademio.gr** could not be fetched from available browsers or DNS, and no verified publication terms or actual lesson material for this exact domain were accessible. Do not mistake it for `akadimos.gr`, `akademio.tr`, `akademio.sk` or other similar sites.
We can independently adopt general *pedagogical design patterns* (short explanations, interactive checkpoints, clear illustrations, self-directed lessons) without copying another platform's copyrightable content or assets.
Reusing its actual lesson text, activities, illustrations, video, or private downloads is **not authorized without an applicable licence or permission**. If a specific URL or licence document becomes available, assess it before embedding any content; link to publicly accessible lesson pages when permitted.
Alternative content base: original Greek lesson summaries built from curriculum objectives, public facts, and educational resources that expressly allow reuse, with source attribution.

## Next tests
- Log in with existing family; both extra subjects visible as defaults, toggle each in parent settings, save, reload and verify subject permissions persist.
- Enter Chess: six moves are legal on the simple instructional board; Back restores home.
- Enter Fast Cars: eight photo rounds, 4 unique options, one valid key, all source links and licences present. Simulate a failed image load and verify fallback source link.
- Phone viewport 320 px to desktop, dark/light modes, accessibility labels, offline previously cached photo, app version v0.6.46.
- Do not claim completion of a live mobile-device test until observed.

## Basic chess rule expansion — v0.6.47

Chess now has two tabs. **Βασικοί κανόνες** provides eight original child-friendly explanatory cards with mini 8×8 chessboard diagrams: starting positions/turns, captures, pawn forward movement and diagonal captures, check and escaping it, checkmate, stalemate, castling and pawn promotion. Every example uses correctly placed pieces and a clear Greek explanation. **Κινήσεις κομματιών** retains the prior six interactive piece-movement exercises.

After the eight explanatory cards, children can answer **seven short, untimed review questions**. Incorrect choices produce gentle retry guidance. Correct choices receive an explanation; quiz restarts from the beginning when completed. Study opens the illustrated rule cards; Practice opens the movement board. No timer, streaks, leaderboard or artificial scoring. This is a foundation to learn *about chess*, not an entire FIDE rules engine; no two-player playable chess, check-validating move generator or adversarial engine has been added.

The content is original Greek educational wording based on general chess rules. Normative reference: FIDE Laws of Chess (2023), https://handbook.fide.com/chapter/e012023 . Explanations are simplified for primary-school learners and do not purport to cover every special circumstance, for example en passant and formal tournament regulations.

**Akademio URL supplied by the user:** https://www.akademio.gr/el/dim-1/language/letters-a-t-p-o . The exact link was attempted but could not be fetched in this environment. Do not infer the lesson's specific appearance, exercises, terms or licensing. Ask for a short recording or screenshots of the public lesson, and for its terms/licence if the user wants to copy assets. General, uncopyrightable learning methods may be independently recreated; actual lesson media/text/code requires appropriate authorization.

Validation: 64 squares appear in each mini-board; all eight rule examples render; seven correct-answer checks work with retry and full reset; chess tabs switch; old movement exercises remain accessible; JS syntax and PWA cache checks pass. Live iPad and mobile browser validation remains outstanding.
