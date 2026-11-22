// All timing in frames (30 fps). Retime here.
export const T = {
  fps: 30,
  duration: 240, // 8 s

  bgIn: [0, 18], // 0.0–0.6 s background + pattern fade in
  dashIn: [18, 48], // 0.6–1.6 s blurred dashboard slides in (45°) and fades up
  tagIn: [60, 75], // 2.0–2.5 s
  headlineIn: [78, 96], // 2.6–3.2 s
  dateIn: [108, 123], // 3.6–4.1 s
  ruleDraw: [123, 135], // then the rule draws across, 400 ms
  // 4.1–8.0 s hold: only pattern drift and dashboard breathing

  slideDistance: 48, // px along each axis for the 45° slide-ins
  breathPeriod: 60, // frames; 7 s and 8 s are both whole periods, so the end loops cleanly
  breathAmplitude: 3, // ± px of blur
  patternDrift: 6, // px over the whole video, diagonal
} as const;
