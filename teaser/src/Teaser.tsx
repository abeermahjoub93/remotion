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
  readonly width: number;
  readonly height: number;
};

const ease = Easing.out(Easing.cubic);
const progress = (f: number, [a, b]: readonly [number, number] | readonly number[]) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// 45° diagonal slide-in from the bottom, on the reading-start side (right for AR, left for EN)
const slideIn = (p: number, lang: Lang, distance: number = T.slideDistance) => {
  const dx = (lang === "ar" ? 1 : -1) * distance * (1 - p);
  const dy = distance * (1 - p);
  return { opacity: p, translate: `${dx}px ${dy}px` };
};

const COPY = {
  ar: { tag: "باقي 6", headline: "فيه شي جاي.", date: "29.11" },
  en: { tag: "D - 6", headline: "Something is coming.", date: "29.11" },
} as const;

// Layout per format. Margins sit inside the 90% title-safe area (5% each side).
const layoutFor = (width: number, height: number) => {
  const square = width === height;
  return {
    margin: 72,
    logoWidth: 240,
    dash: square ? { width: 920, height: 456, top: 190, cut: 48 } : { width: 880, height: 436, top: 250, cut: 48 },
    textTop: square ? 730 : 850,
    tagSize: 30,
    headlineSize: square ? 84 : 88,
    dateSize: 56,
    ruleWidth: 150,
  };
};
type Layout = ReturnType<typeof layoutFor>;

const Pattern: React.FC<{ readonly f: number }> = ({ f }) => {
  const drift = interpolate(f, [0, T.duration], [0, T.patternDrift], { extrapolateRight: "clamp" });
  const tileW = 1300;
  const tileH = Math.round((tileW * 1337) / 1241);
  return (
    <AbsoluteFill style={{ opacity: 0.08 * progress(f, T.bgIn), filter: "blur(6px)" }}>
      {[0, 1].map((col) =>
        [0, 1].map((row) => (
          <Img
            key={`${col}-${row}`}
            src={staticFile("brand-pattern.png")}
            style={{ position: "absolute", left: -40 + drift + col * tileW, top: -40 + drift + row * tileH, width: tileW, height: tileH }}
          />
        )),
      )}
    </AbsoluteFill>
  );
};

const BlurredDashboard: React.FC<{ readonly f: number; readonly lang: Lang; readonly L: Layout; readonly width: number }> = ({ f, lang, L, width }) => {
  // breathing: ±3 px around 40 px, a whole number of periods by 7 s and 8 s
  const blur = 40 + T.breathAmplitude * Math.sin((2 * Math.PI * f) / T.breathPeriod);
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
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", scale: "1.25", filter: `blur(${blur}px)` }}
      />
      <AbsoluteFill style={{ background: COLORS.royal, opacity: 0.5 }} />
    </div>
  );
};

const TextBlock: React.FC<{ readonly f: number; readonly lang: Lang; readonly L: Layout }> = ({ f, lang, L }) => {
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
        {copy.tag}
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
        <div dir="ltr" style={{ fontFamily: FONTS.en, fontWeight: 500, fontSize: L.dateSize, lineHeight: 1.1, color: COLORS.white }}>
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
  return <Img src={staticFile(WORDMARK.file)} style={{ position: "absolute", top: L.margin, right: L.margin, width: w, height: h }} />;
};

export const Teaser: React.FC<TeaserProps> = ({ lang, width, height }) => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading Almarai + Barlow"));
  useEffect(() => {
    fontsReady().then(() => continueRender(handle));
  }, [handle]);
  const L = layoutFor(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal, overflow: "hidden" }}>
      <Pattern f={f} />
      <BlurredDashboard f={f} lang={lang} L={L} width={width} />
      <TextBlock f={f} lang={lang} L={L} />
      <Logo L={L} />
    </AbsoluteFill>
  );
};
