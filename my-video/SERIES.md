# SecureLogX "حصّن نفسك رقمياً" video series — production rules

Follow these for every new episode, unless the user says otherwise.

## Format
- 1080×1920, 30 fps, vertical Reel/Story. Around 50–55 s.
- Start with the series intro, used as-is: `public/intro.mp4` (88 frames,
  cut from the original episode just as the screen turns fully green).
  The first scene peels that green panel away diagonally (see `PwHookScene`).
- End with `OutroScene` (logo, tagline أمن تقدر تقوّيه، والتزام تقدر تثبته, www.sx.sa).

## Brand (SecureLogX Brand Guidelines v1.0) — shared kit in `src/brand.tsx`
- Colours: SX Green #006B35, Deep Green #004D26 (dark scenes), Gold #CCB58B as
  accent only (never white text on gold), neutrals Ink/Slate/Mist/Paper.
  Status red #B42318 for warnings/red flags only.
- Fonts: Almarai (Arabic), Barlow (English body), Barlow Condensed (English labels).
- Paper background with faint grid + diagonal hatching; header pills
  (wordmark left, "حصّن نفسك رقمياً" right). Text out of the top/bottom 250 px.
- Spelling: SecureLogX / سيكيورلوغإكس; الالتزام (never الامتثال).

## Copy
- Every line bilingual: Arabic first (large, Almarai ExtraBold), English under it (smaller, Slate/Gold).
- Script sections map to scenes: Opening hook → Spoken script (interactive demo)
  → Mid-content re-hook (dark green scene) → CTA (ends with "حصّن نفسك رقمياً / Protect
  Yourself Digitally") → X copy / Stories poll as the engagement scene → Outro.
- LinkedIn notes are not part of the video.
- Use fictional names/domains in examples; never imitate a real organisation.
  Don't show fake poll results.

## Sound
- Sound effects only, no music. Effects are synthesized by `scripts/make-sfx.py`
  into `public/sfx/` and placed with `<Sfx name at volume />`.
- If a voiceover is supplied, time scenes to it and keep effects under it.

## Rendering in the cloud container
REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  npx remotion render <CompositionId> out/<name>.mp4 --codec=h264 --crf=18
