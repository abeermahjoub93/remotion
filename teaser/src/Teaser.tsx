import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONTS, WORDMARK, fontsReady } from "./brand";
import { T } from "./timing";

export type Lang = "ar" | "en";
export type TeaserProps = {
  readonly lang: Lang;
  // countdown day shown in the tag ("باقي 6" / "D - 6")
  readonly day: number;
  // "frame": blurred dashboard in a cut-corner frame (Day 6)
  // "numeral": giant angular day number filled with the blurred dashboard (Day 1)
  readonly design: "frame" | "numeral";
  readonly width: number;
  readonly height: number;
};

const ease = Easing.out(Easing.cubic);
const progress = (
  f: number,
  [a, b]: readonly [number, number] | readonly number[],
) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// 45° diagonal slide-in from the bottom, on the reading-start side (right for AR, left for EN)
const slideIn = (p: number, lang: Lang, distance: number = T.slideDistance) => {
  const dx = (lang === "ar" ? 1 : -1) * distance * (1 - p);
  const dy = distance * (1 - p);
  return { opacity: p, translate: `${dx}px ${dy}px` };
};

const COPY = {
  ar: {
    tag: (day: number) => `باقي ${day}`,
    headline: "فيه شي جاي.",
    date: "29.11",
  },
  en: {
    tag: (day: number) => `D - ${day}`,
    headline: "Something is coming.",
    date: "29.11",
  },
} as const;

// Layout per format. Margins sit inside the 90% title-safe area (5% each side).
const layoutFor = (width: number, height: number) => {
  const square = width === height;
  return {
    margin: 72,
    logoWidth: 240,
    dash: square
      ? { width: 920, height: 456, top: 190, cut: 48 }
      : { width: 880, height: 436, top: 250, cut: 48 },
    textTop: square ? 730 : 850,
    tagSize: 30,
    headlineSize: square ? 84 : 88,
    dateSize: 56,
    ruleWidth: 150,
  };
};
type Layout = ReturnType<typeof layoutFor>;

const Pattern: React.FC<{ readonly f: number }> = ({ f }) => {
  const drift = interpolate(f, [0, T.duration], [0, T.patternDrift], {
    extrapolateRight: "clamp",
  });
  const tileW = 1300;
  const tileH = Math.round((tileW * 1337) / 1241);
  return (
    <AbsoluteFill
      style={{ opacity: 0.08 * progress(f, T.bgIn), filter: "blur(6px)" }}
    >
      {[0, 1].map((col) =>
        [0, 1].map((row) => (
          <Img
            key={`${col}-${row}`}
            src={staticFile("brand-pattern.png")}
            style={{
              position: "absolute",
              left: -40 + drift + col * tileW,
              top: -40 + drift + row * tileH,
              width: tileW,
              height: tileH,
            }}
          />
        )),
      )}
    </AbsoluteFill>
  );
};

const BlurredDashboard: React.FC<{
  readonly f: number;
  readonly lang: Lang;
  readonly L: Layout;
  readonly width: number;
}> = ({ f, lang, L, width }) => {
  // breathing: ±3 px around 40 px, a whole number of periods by 7 s and 8 s
  const blur =
    40 + T.breathAmplitude * Math.sin((2 * Math.PI * f) / T.breathPeriod);
  const p = progress(f, T.dashIn);
  const { width: w, height: h, top, cut } = L.dash;
  // AR slides in from bottom-right, EN from bottom-left
  const m = slideIn(p, lang, 90);
  return (
    <div
      style={{
        position: "absolute",
        left: (width - w) / 2,
        top,
        width: w,
        height: h,
        background: COLORS.royal,
        overflow: "hidden",
        // 45° cut corners (top-left and bottom-right)
        clipPath: `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`,
        ...m,
      }}
    >
      <Img
        src={staticFile("dashboard.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: "1.25",
          filter: `blur(${blur}px)`,
        }}
      />
      <AbsoluteFill style={{ background: COLORS.royal, opacity: 0.5 }} />
    </div>
  );
};

const TextBlock: React.FC<{
  readonly f: number;
  readonly lang: Lang;
  readonly day: number;
  readonly L: Layout;
  readonly delay: number;
}> = ({ f: frame, lang, day, L, delay }) => {
  const f = frame - delay;
  const ar = lang === "ar";
  const copy = COPY[lang];
  const family = ar ? FONTS.ar : FONTS.en;
  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      style={{
        position: "absolute",
        top: L.textTop,
        left: L.margin,
        right: L.margin,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // flex-start follows dir: right edge for AR, left for EN
        textAlign: ar ? "right" : "left",
      }}
    >
      <div
        style={{
          fontFamily: family,
          fontWeight: 700,
          fontSize: L.tagSize,
          lineHeight: 1.3,
          color: COLORS.frapp,
          // Arabic letters must stay joined, so only the English tag is letter-spaced
          letterSpacing: ar ? 0 : "0.2em",
          wordSpacing: ar ? "0.15em" : undefined,
          ...slideIn(progress(f, T.tagIn), lang),
        }}
      >
        {copy.tag(day)}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: family,
          fontWeight: ar ? 800 : 700,
          fontSize: L.headlineSize,
          lineHeight: 1.25,
          color: COLORS.white,
          whiteSpace: "nowrap",
          ...slideIn(progress(f, T.headlineIn), lang),
        }}
      >
        {copy.headline}
      </div>
      <div style={{ marginTop: 22, ...slideIn(progress(f, T.dateIn), lang) }}>
        <div
          dir="ltr"
          style={{
            fontFamily: FONTS.en,
            fontWeight: 500,
            fontSize: L.dateSize,
            lineHeight: 1.1,
            color: COLORS.white,
          }}
        >
          {copy.date}
        </div>
        <div
          style={{
            marginTop: 12,
            width: L.ruleWidth,
            height: 3,
            background: COLORS.frapp,
            // draws across from the reading-start side
            scale: `${progress(f, T.ruleDraw)} 1`,
            transformOrigin: ar ? "right center" : "left center",
            marginLeft: ar ? "auto" : 0,
          }}
        />
      </div>
    </div>
  );
};

const Logo: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const w = Math.max(L.logoWidth, WORDMARK.minWidth);
  const h = w / WORDMARK.ratio;
  // clear space equal to its own height: top/right margins are well above h
  return (
    <Img
      src={staticFile(WORDMARK.file)}
      style={{
        position: "absolute",
        top: L.margin,
        right: L.margin,
        width: w,
        height: h,
      }}
    />
  );
};

export const Teaser: React.FC<TeaserProps> = ({
  lang,
  day,
  design,
  width,
  height,
}) => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading Almarai + Barlow"));
  useEffect(() => {
    fontsReady().then(() => continueRender(handle));
  }, [handle]);
  const L = layoutFor(width, height);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: design === "numeral" ? COLORS.royal : COLORS.charcoal,
        overflow: "hidden",
      }}
    >
      <Pattern f={f} />
      {design === "numeral" ? (
        <>
          <CountdownNumeral
            f={f}
            lang={lang}
            day={day}
            width={width}
            height={height}
          />
          <CharcoalPanel f={f} lang={lang} width={width} height={height} />
        </>
      ) : (
        <BlurredDashboard f={f} lang={lang} L={L} width={width} />
      )}
      <TextBlock
        f={f}
        lang={lang}
        day={day}
        L={
          design === "numeral"
            ? { ...L, textTop: numeralLayout(width, height).textTop }
            : L
        }
        delay={design === "numeral" ? T.countdownTextDelay : 0}
      />
      <Logo L={L} />
    </AbsoluteFill>
  );
};

// ---- Day 1 design: giant angular "1" filled with the blurred dashboard ----

const numeralLayout = (width: number, height: number) => {
  const square = width === height;
  return square
    ? { numH: 520, numTop: 150, panelTop: 760, cut: 180, textTop: 800 }
    : { numH: 620, numTop: 200, panelTop: 880, cut: 180, textTop: 930 };
};

// Countdown digits built like a segment display: straight segments with 45° pointed ends,
// on a 400 × 640 grid. Each digit is one clip-path (all its segments) over the blurred dashboard.
const SEG_T = 70; // segment thickness
const SEG_GAP = 8;
const GRID = { w: 400, h: 640 } as const;
const xL = SEG_T / 2;
const xR = GRID.w - SEG_T / 2;
const yT = SEG_T / 2;
const yM = GRID.h / 2;
const yB = GRID.h - SEG_T / 2;
const h = SEG_T / 2;
const horiz = (yc: number) =>
  `M ${xL + SEG_GAP} ${yc} L ${xL + SEG_GAP + h} ${yc - h} L ${xR - SEG_GAP - h} ${yc - h} L ${xR - SEG_GAP} ${yc} L ${xR - SEG_GAP - h} ${yc + h} L ${xL + SEG_GAP + h} ${yc + h} Z`;
const vert = (xc: number, y0: number, y1: number) =>
  `M ${xc} ${y0} L ${xc + h} ${y0 + h} L ${xc + h} ${y1 - h} L ${xc} ${y1} L ${xc - h} ${y1 - h} L ${xc - h} ${y0 + h} Z`;
const SEGMENTS = {
  a: horiz(yT),
  g: horiz(yM),
  d: horiz(yB),
  f: vert(xL, yT + SEG_GAP, yM - SEG_GAP),
  e: vert(xL, yM + SEG_GAP, yB - SEG_GAP),
  b: vert(xR, yT + SEG_GAP, yM - SEG_GAP),
  c: vert(xR, yM + SEG_GAP, yB - SEG_GAP),
} as const;
const DIGITS: Record<number, readonly (keyof typeof SEGMENTS)[]> = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "g", "c", "d"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "g", "e", "d", "c"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const Digit: React.FC<{
  readonly n: number;
  readonly f: number;
  readonly k: number;
  readonly lang: Lang;
  readonly p: number;
}> = ({ n, f, k, lang, p }) => {
  const blur =
    30 + T.breathAmplitude * Math.sin((2 * Math.PI * f) / T.breathPeriod);
  const path = DIGITS[n].map((seg) => SEGMENTS[seg]).join(" ");
  // centre the "1" (its segments sit on the right of the grid)
  const shift = n === 1 ? -(xR - GRID.w / 2) * k : 0;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        ...slideIn(p, lang, 60),
        marginLeft: shift,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.green,
          clipPath: `path('${path}')`,
          scale: `${k}`,
          transformOrigin: "0 0",
          width: GRID.w,
          height: GRID.h,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("dashboard.png")}
          style={{
            position: "absolute",
            left: -GRID.h * 0.4,
            top: 0,
            height: GRID.h,
            width: "auto",
            maxWidth: "none",
            scale: "1.3",
            filter: `blur(${blur / k}px)`,
          }}
        />
        <AbsoluteFill style={{ background: COLORS.royal, opacity: 0.35 }} />
      </div>
    </div>
  );
};

// Counts down T.countdown.from → day; each number slides in on a 45° diagonal and holds.
const CountdownNumeral: React.FC<{
  readonly f: number;
  readonly lang: Lang;
  readonly day: number;
  readonly width: number;
  readonly height: number;
}> = ({ f, lang, day, width, height }) => {
  const N = numeralLayout(width, height);
  const k = N.numH / GRID.h;
  const w = GRID.w * k;
  const { from, start, step } = T.countdown;
  const steps = Math.max(0, from - day);
  const i = Math.min(steps, Math.max(0, Math.floor((f - start) / step)));
  const n = from - i;
  const appear = start + i * step;
  const p = progress(f, [appear, appear + T.countdownSlide]);
  return (
    <div
      style={{
        position: "absolute",
        left: (width - w) / 2,
        top: N.numTop,
        width: w,
        height: N.numH,
      }}
    >
      {f >= start ? (
        <Digit key={n} n={n} f={f} k={k} lang={lang} p={p} />
      ) : null}
    </div>
  );
};

// Charcoal text panel with a 45° cut on the top corner opposite the reading start
const CharcoalPanel: React.FC<{
  readonly f: number;
  readonly lang: Lang;
  readonly width: number;
  readonly height: number;
}> = ({ f, lang, width, height }) => {
  const N = numeralLayout(width, height);
  const t = N.panelTop;
  const c = N.cut;
  const poly =
    lang === "ar"
      ? `0 ${t - c}px, ${c}px ${t}px, 100% ${t}px, 100% 100%, 0 100%`
      : `0 ${t}px, calc(100% - ${c}px) ${t}px, 100% ${t - c}px, 100% 100%, 0 100%`;
  return (
    <AbsoluteFill
      style={{
        background: COLORS.charcoal,
        clipPath: `polygon(${poly})`,
        ...slideIn(progress(f, [T.dashIn[0] + 6, T.dashIn[1]]), lang, 60),
      }}
    />
  );
};
