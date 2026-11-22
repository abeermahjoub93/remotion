// Final resting values, copied from reference/design-C.html (v2: green background,
// real MUNTABIQ dashboard). Do not estimate. The animation interpolates towards these;
// from frame 330 everything sits here exactly.

export const CANVAS = { w: 1080, h: 1350 } as const;

export const COLORS = {
  charcoal: "#262626",
  background: "#06572D", // Royal Green panel
  green: "#087D40", // St. Patrick's Green
  royal: "#06572D", // Royal Green
  highlight: "#0aa354", // base border only
  frapp: "#CCB58B", // "قبل / بعد" tag only
  white: "#FFFFFF",
} as const;

// brand-pattern-green-blur.png, tile image 1300 × 1401 px
export const PATTERN = { file: "brand-pattern-green-blur.png", tileWidth: 1300, tileHeight: 1401, opacity: 0.3, x: 0, y: 0 } as const;

export const GLOW = { left: 140, top: 450, width: 800, height: 400, color: "10,163,84", alpha: 0.6 } as const;

// .stack: left 240, top 500, 600 × 300, rotateX(58deg) rotateZ(45deg), no perspective
export const STACK = { left: 240, top: 500, width: 600, height: 300, rotateX: 58, rotateZ: 45, edgeZ: -14, scale: 1 } as const;

// the base plane shows the real MUNTABIQ dashboard (object-fit: cover)
export const DASHBOARD = { file: "muntabiq-dashboard.png" } as const;


// 10 sheets, bottom → top: tidy positions they ease into before merging into the
// dashboard (from design C v1). In the final frame they have merged: opacity 0.
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

// "10" label: only during the mess (gone by the final frame)
export const LABEL_10 = { left: 72, top: 250, width: 190, pointer: "268,318 300,318 333,285" } as const;
export const LABEL_1 = { left: 818, top: 470, width: 190, pointer: "760,654 800,614 812,614" } as const;
export const LABEL_TYPE = { numSize: 120, txtSize: 30, txtGap: 4 } as const;

export const HEADLINE = { right: 72, top: 930, fontSize: 76, lineHeight: 1.25 } as const;
export const RULE = { right: 72, top: 1132, width: 180, height: 6, color: "#FFFFFF" } as const;
export const SUB = { right: 72, top: 1162, fontSize: 30, lineHeight: 1.4 } as const;
export const BYLINE = { right: 72, bottom: 64, gap: 16, fontSize: 22, wordmarkHeight: 24 } as const;
export const CORNER = { size: 150 } as const;

// 9:16: content block shifted so it sits inside the safe area (top 250, bottom 340 clear)
export const REEL = { w: 1080, h: 1920, contentOffsetY: 240 } as const;
