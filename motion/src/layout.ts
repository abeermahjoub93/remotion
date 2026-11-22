// Final resting values, copied from reference/design-C.html (do not estimate).
// The animation interpolates towards these; from frame 330 everything sits here exactly.

export const CANVAS = { w: 1080, h: 1350 } as const;

export const COLORS = {
  charcoal: "#262626",
  green: "#087D40", // St. Patrick's Green
  royal: "#06572D", // Royal Green
  highlight: "#0aa354", // base border only
  frapp: "#CCB58B", // "قبل / بعد" tag only
  white: "#FFFFFF",
} as const;

// tile image is 1300 × 1401 px
export const PATTERN = { tileWidth: 1300, tileHeight: 1401, opacity: 0.22, x: 0, y: 0 } as const;

export const GLOW = { left: 190, top: 560, width: 700, height: 400 } as const;

// .stack: left 370, top 530, 340 × 340, rotateX(58deg) rotateZ(45deg), no perspective
export const STACK = { left: 370, top: 530, size: 340, rotateX: 58, rotateZ: 45, edgeZ: -14, scale: 1 } as const;

export const HEADER_BAR = { left: 24, top: 24, width: 292, height: 26 } as const;

export const TILES = [
  { left: 24, top: 70, bar: 96 },
  { left: 178, top: 70, bar: 70 },
  { left: 24, top: 200, bar: 108 },
  { left: 178, top: 200, bar: 56 },
] as const;
export const TILE = { width: 138, height: 116, barRight: 14, barBottom: 16, barHeight: 14, fill: 0.12 } as const;

// 10 sheets, bottom → top: translate3d(x, y, z) rotateZ(r), opacity o
export const SHEETS = [
  { x: 0, y: 0, z: 24, r: 0, o: 0.94 },
  { x: 2, y: -2, z: 46, r: -0.6, o: 0.88 },
  { x: -3, y: 3, z: 70, r: 0.8, o: 0.82 },
  { x: 4, y: -4, z: 96, r: -1, o: 0.76 },
  { x: -5, y: 5, z: 124, r: 1.3, o: 0.7 },
  { x: 7, y: -6, z: 154, r: -1.6, o: 0.64 },
  { x: -8, y: 8, z: 186, r: 2, o: 0.58 },
  { x: 10, y: -9, z: 220, r: -2.3, o: 0.52 },
  { x: -12, y: 11, z: 256, r: 2.7, o: 0.46 },
  { x: 14, y: -13, z: 294, r: -3, o: 0.4 },
] as const;
export const SHEET_GRID = { vStep: 56, hStep: 113, lineOpacity: 0.22, borderOpacity: 0.85 } as const;

export const TAG = { left: 72, top: 84, fontSize: 26, cut: 14 } as const;
export const LOGO = { top: 64, right: 72, height: 80 } as const;

export const LABEL_10 = { left: 72, top: 330, width: 190, pointer: "270,400 302,400 336,434" } as const;
export const LABEL_1 = { left: 818, top: 560, width: 190, pointer: "786,700 834,652 852,652" } as const;
export const LABEL_TYPE = { numSize: 120, txtSize: 30, txtGap: 4 } as const;

export const HEADLINE = { right: 72, top: 930, fontSize: 76, lineHeight: 1.25 } as const;
export const RULE = { right: 72, top: 1132, width: 180, height: 6 } as const;
export const SUB = { right: 72, top: 1162, fontSize: 30, lineHeight: 1.4 } as const;
export const BYLINE = { right: 72, bottom: 64, gap: 16, fontSize: 22, wordmarkHeight: 24 } as const;
export const CORNER = { size: 150 } as const;

// 9:16: content block shifted so it sits inside the safe area (top 250, bottom 340 clear)
export const REEL = { w: 1080, h: 1920, contentOffsetY: 240 } as const;
