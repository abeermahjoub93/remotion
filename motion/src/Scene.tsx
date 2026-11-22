import { Audio } from "@remotion/media";
import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  getStaticFiles,
  interpolate,
  interpolateColors,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AR, NUM, fontsReady } from "./fonts";
import {
  BYLINE,
  CANVAS,
  COLORS,
  CORNER,
  GLOW,
  HEADER_BAR,
  HEADLINE,
  LABEL_1,
  LABEL_10,
  LABEL_TYPE,
  LOGO,
  PATTERN,
  REEL,
  RULE,
  SHEETS,
  SHEET_GRID,
  STACK,
  SUB,
  TAG,
  TILE,
  TILES,
} from "./layout";

export type SceneProps = {
  readonly layout: "4x5" | "9x16";
  // render one frame as a still (FinalFrame); null = follow the timeline
  readonly freezeAt: number | null;
  // optional soft ambient track (a licensed file in public/), off by default
  readonly music?: string;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);
const ease = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: easeOut });
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const DROP_START = 30;
const DROP_EVERY = 8;
const MERGE = 120;
const SETTLE = 240; // sheets exactly at rest from here

const sheetGrid = `repeating-linear-gradient(90deg, rgba(255,255,255,${SHEET_GRID.lineOpacity}) 0 1px, transparent 1px ${SHEET_GRID.vStep}px), repeating-linear-gradient(0deg, rgba(255,255,255,${SHEET_GRID.lineOpacity}) 0 1px, transparent 1px ${SHEET_GRID.hStep}px)`;

const Label: React.FC<{
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly num: string;
  readonly txt: string;
  readonly p: number;
}> = ({ left, top, width, num, txt, p }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      textAlign: "right",
      direction: "rtl",
      color: COLORS.white,
      opacity: p,
      // 45° slide-in
      translate: `${-14 * (1 - p)}px ${-14 * (1 - p)}px`,
    }}
  >
    <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: LABEL_TYPE.numSize, lineHeight: 1, direction: "ltr" }}>{num}</div>
    <div style={{ marginTop: LABEL_TYPE.txtGap, fontFamily: AR, fontWeight: 700, fontSize: LABEL_TYPE.txtSize, lineHeight: 1.3 }}>{txt}</div>
  </div>
);

const Pointer: React.FC<{ readonly points: string; readonly p: number }> = ({ points, p }) => (
  <svg width={CANVAS.w} height={CANVAS.h} style={{ position: "absolute", left: 0, top: 0 }}>
    <polyline points={points} fill="none" stroke={COLORS.white} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
  </svg>
);

export const Scene: React.FC<SceneProps> = ({ layout, freezeAt, music }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = freezeAt ?? frame;

  // fonts must be loaded before any frame renders
  const [handle] = useState(() => delayRender("Loading Almarai + Barlow Condensed"));
  useEffect(() => {
    fontsReady().then(() => continueRender(handle));
  }, [handle]);

  const logoFile = getStaticFiles().find((s) => s.name === "muntabiq-logo.png");

  // 0–30: background, pattern, logo, tag
  const blackout = ease(f, 0, 20, 1, 0);
  const patternOpacity = ease(f, 0, 30, 0, PATTERN.opacity);
  const drift = interpolate(f, [0, 359], [16, 0], clamp); // ≤ 20 px over the video
  const logoP = ease(f, 0, 30, 0, 1);
  const tagP = ease(f, 6, 26, 0, 1);

  // the stack
  const push = interpolate(f, [0, 359], [0.97, STACK.scale], clamp);
  const merge = f >= SETTLE ? 1 : spring({ frame: f - MERGE, fps, config: { damping: 20, overshootClamping: true }, durationInFrames: 60 });
  const compress = f < 210 ? ease(f, 160, 205, 1, 0.12) : ease(f, 210, 238, 0.12, 1);
  const lit = ease(f, MERGE, 200, 0.4, 1);
  const glowP = ease(f, MERGE, 210, 0, 1);
  const landed = SHEETS.filter((_, i) => f >= DROP_START + i * DROP_EVERY + 12).length;

  // message
  const line1 = ease(f, 240, 258, 100, 0);
  const line2 = ease(f, 250, 268, 100, 0);
  const ruleP = ease(f, 254, 278, 0, 1);
  const subP = ease(f, 262, 286, 0, 1);
  const cornerP = ease(f, 300, 316, 0, 1);
  const bylineP = ease(f, 306, 326, 0, 1);

  const reel = layout === "9x16";

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal, overflow: "hidden" }}>
      {/* brand pattern, tiled at 1300 px wide (Img tiles so the renderer waits for them) */}
      <AbsoluteFill style={{ opacity: patternOpacity }}>
        {[0, 1].map((col) =>
          [0, 1].map((row) => (
            <Img
              key={`${col}-${row}`}
              src={staticFile("brand-pattern-blur.png")}
              style={{
                position: "absolute",
                left: PATTERN.x + drift + (col - (drift > 0 ? 1 : 0)) * PATTERN.tileWidth,
                top: PATTERN.y + row * PATTERN.tileHeight,
                width: PATTERN.tileWidth,
                height: PATTERN.tileHeight,
              }}
            />
          )),
        )}
      </AbsoluteFill>

      {/* content block: 1080 × 1350, re-centred inside the 9:16 safe area */}
      <div style={{ position: "absolute", left: 0, top: reel ? REEL.contentOffsetY : 0, width: CANVAS.w, height: CANVAS.h }}>
        {/* stack layer, with the slow camera push */}
        <div style={{ position: "absolute", inset: 0, scale: `${push}`, transformOrigin: `540px 700px` }}>
          <div
            style={{
              position: "absolute",
              left: GLOW.left,
              top: GLOW.top,
              width: GLOW.width,
              height: GLOW.height,
              background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(8,125,64,0.55), rgba(8,125,64,0) 70%)",
              opacity: glowP,
              scale: `${mix(0.6, 1, glowP)}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: STACK.left,
              top: STACK.top,
              width: STACK.size,
              height: STACK.size,
              transformStyle: "preserve-3d",
              transform: `rotateX(${STACK.rotateX}deg) rotateZ(${STACK.rotateZ}deg)`,
              opacity: ease(f, 0, 30, 0, 1),
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: STACK.size,
                height: STACK.size,
                boxSizing: "border-box",
                background: interpolateColors(lit, [0, 1], [COLORS.charcoal, COLORS.royal]),
                transform: `translateZ(${STACK.edgeZ}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: STACK.size,
                height: STACK.size,
                boxSizing: "border-box",
                background: interpolateColors(lit, [0, 1], [COLORS.charcoal, COLORS.green]),
                border: `2px solid ${interpolateColors(lit, [0, 1], [COLORS.charcoal, COLORS.highlight])}`,
              }}
            >
              <div style={{ position: "absolute", ...HEADER_BAR, background: COLORS.white, scale: `${ease(f, 132, 150, 0, 1)} 1`, transformOrigin: "right center" }} />
              {TILES.map((t, k) => {
                const a = 140 + k * 14;
                return (
                  <div key={k} style={{ position: "absolute", left: t.left, top: t.top, width: TILE.width, height: TILE.height, background: `rgba(255,255,255,${TILE.fill})`, opacity: ease(f, a, a + 14, 0, 1) }}>
                    <div
                      style={{
                        position: "absolute",
                        right: TILE.barRight,
                        bottom: TILE.barBottom,
                        width: t.bar,
                        height: TILE.barHeight,
                        background: COLORS.white,
                        scale: `${ease(f, a + 6, a + 26, 0, 1)} 1`,
                        transformOrigin: "right center",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {SHEETS.map((s, i) => {
              const d = DROP_START + i * DROP_EVERY;
              const land = f >= SETTLE ? 1 : spring({ frame: f - d, fps, config: { damping: 14 } });
              // scattered "mess" values (deterministic)
              const sr = (random(`seed-r-${i}`) * 2 - 1) * 25;
              const sx = (random(`seed-x-${i}`) * 2 - 1) * 70;
              const sy = (random(`seed-y-${i}`) * 2 - 1) * 70;
              const sz = 40 + i * 52;
              const x = mix(sx, s.x, merge);
              const y = mix(sy, s.y, merge);
              const r = mix(sr, s.r, merge);
              const z = mix(sz, s.z * compress, merge) + (1 - land) * 700;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: STACK.size,
                    height: STACK.size,
                    boxSizing: "border-box",
                    border: `2px solid rgba(255,255,255,${SHEET_GRID.borderOpacity})`,
                    backgroundImage: sheetGrid,
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${r}deg)`,
                    opacity: f < d ? 0 : s.o * Math.min(1, land * 3),
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* "قبل / بعد" tag (Frapp) */}
        <div
          style={{
            position: "absolute",
            left: TAG.left,
            top: TAG.top,
            padding: "8px 22px 10px 18px",
            background: COLORS.frapp,
            color: COLORS.charcoal,
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: TAG.fontSize,
            lineHeight: 1.2,
            clipPath: `polygon(0 0, 100% 0, 100% 100%, ${TAG.cut}px 100%, 0 calc(100% - ${TAG.cut}px))`,
            opacity: tagP,
          }}
        >
          قبل / بعد
        </div>

        {logoFile ? (
          <Img
            src={staticFile("muntabiq-logo.png")}
            style={{ position: "absolute", top: LOGO.top, right: LOGO.right, height: LOGO.height, width: "auto", opacity: logoP, translate: `${12 * (1 - logoP)}px 0px` }}
          />
        ) : null}

        <Label {...LABEL_10} num={String(Math.max(1, landed))} txt="جداول متفرقة" p={ease(f, 40, 52, 0, 1)} />
        <Pointer points={LABEL_10.pointer} p={ease(f, 44, 60, 0, 1)} />
        <Label {...LABEL_1} num="1" txt="شاشة وحدة" p={ease(f, 190, 204, 0, 1)} />
        <Pointer points={LABEL_1.pointer} p={ease(f, 194, 210, 0, 1)} />

        <div style={{ position: "absolute", right: HEADLINE.right, top: HEADLINE.top, direction: "rtl", textAlign: "right", color: COLORS.white, fontFamily: AR, fontWeight: 800, fontSize: HEADLINE.fontSize, lineHeight: HEADLINE.lineHeight }}>
          {/* right-to-left mask wipe, line by line */}
          <div style={{ clipPath: `inset(-30px -30px -30px ${line1}%)` }}>من 10 جداول</div>
          <div style={{ clipPath: `inset(-30px -30px -30px ${line2}%)` }}>إلى شاشة وحدة</div>
        </div>
        <div style={{ position: "absolute", right: RULE.right, top: RULE.top, width: RULE.width, height: RULE.height, background: COLORS.green, scale: `${ruleP} 1`, transformOrigin: "right center" }} />
        <div style={{ position: "absolute", right: SUB.right, top: SUB.top, direction: "rtl", textAlign: "right", color: COLORS.white, fontFamily: AR, fontWeight: 400, fontSize: SUB.fontSize, lineHeight: SUB.lineHeight, opacity: subP, translate: `0px ${16 * (1 - subP)}px` }}>
          الالتزام في عرض واحد مباشر، لكل القطاعات.
        </div>

        <div style={{ position: "absolute", right: BYLINE.right, bottom: BYLINE.bottom, display: "flex", flexDirection: "row", alignItems: "center", gap: BYLINE.gap, direction: "rtl", opacity: bylineP }}>
          <span style={{ color: COLORS.white, fontFamily: AR, fontWeight: 700, fontSize: BYLINE.fontSize, lineHeight: 1 }}>منصة من</span>
          <Img src={staticFile("securelogx-wordmark-white.png")} style={{ height: BYLINE.wordmarkHeight, width: "auto", display: "block" }} />
        </div>
      </div>

      {/* green 45° corner, bottom-left of the canvas */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: CORNER.size,
          height: CORNER.size,
          background: COLORS.green,
          clipPath: "polygon(0 0, 0 100%, 100% 100%)",
          translate: `${-CORNER.size * (1 - cornerP)}px ${CORNER.size * (1 - cornerP)}px`,
        }}
      />

      <AbsoluteFill style={{ backgroundColor: "#000", opacity: blackout }} />

      {music ? <Audio src={staticFile(music)} volume={0.25} /> : null}
    </AbsoluteFill>
  );
};
