# Μαθαίνω! — Ενιαία εικονογραφική γλώσσα (v2)

## Purpose
Educational vocabulary images must communicate the depicted word on their own. A child should not need the answer choices to work out what the picture represents.

## Approved direction
- **Warm illustrated workbook**, borrowing from traditional printed picture dictionaries rather than toddler stickers.
- One central subject per vocabulary image, shown from its most recognizable angle.
- Full-body or three-quarter animal drawings instead of generic round faces.
- Gentle irregular contours with shared cocoa-brown ink (#70584B), cream paper (#FFF9EC), muted honey (#E7BA6C), coral (#EAA08A), sage (#A4C4A4), and soft blue (#A8CBD0).
- Consistent base framing, a common illustrated scale, no unrelated background props.
- Naturalistic distinguishing features: dog has snout, hanging ears, body, paws and tail; cat has triangular ears, whiskers and tail; bird has beak and wings; fish has fins; duck has broad bill.
- No cheerful human faces pasted onto inanimate objects; no emojis in picture-recognition tasks.
- Keep visual warmness separate from accuracy. Palette alone never certifies an image.

## Quality gate
1. Can a child identify the illustration without reading its label?
2. Could it reasonably be confused with any of the three incorrect choices?
3. Are object proportions, silhouette and direction recognizable?
4. Does it match the common color, line weight and composition?
5. Is it legible at the final 220–300px test size on a tablet?
6. Is it readable in dark and light modes and without full color?
7. Are the asset and its intended Greek label correct?
8. Does it use original art or appropriately licensed material?

No release is considered visually reviewed solely because syntax checks pass.

## Implementation
- Word artwork: warm-framed **original curriculum SVG drawings** are preferred for the 20 established words (restored in v0.6.55). The revised dog is the canonical full-body replacement.
- New vocabulary words fall back to local warm illustrations; these still require individual inspection.
- Subject cards use the same warm-framed original curriculum drawings.
- `art-audit.html` displays the collection for human review.
- `#pictureGate` must cap SVG width at 300px, not stretch illustrations across the screen.
- External recognition photos in the car exercise remain untouched.
- The history route and science experiment diagrams retain their instructional functionality.

## Release checklist
- Inspect all visual assets at the actual exercise size.
- Verify the source image corresponds to the expected Greek word.
- Verify `warm-art.js` loads before `curriculum-art.js`.
- Verify offline cache revision and script version match.
- Invite three children to name images with the answer buttons covered; document ambiguous concepts before expanding the lesson set.
