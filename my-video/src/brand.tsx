import type React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// SecureLogX Brand Guidelines v1.0 — section 5 (colour) and 6 (typography)
export const C = {
  green: "#006B35",
  greenLight: "#007B3D",
  deepGreen: "#004D26",
  gold: "#CCB58B",
  ink: "#1D1D1D",
  slate: "#5A5F66",
  mist: "#E4E4E4",
  paper: "#F7F7F5",
  white: "#FFFFFF",
  critical: "#B42318",
  compliant: "#2E9E6A",
};

export const AR = "Almarai";
export const EN = "Barlow";
export const EN_HEAD = "Barlow Condensed";

for (const w of ["300", "400", "700", "800"]) {
  loadFont({ family: AR, url: staticFile(`fonts/Almarai-${w}.ttf`), weight: w });
}
for (const w of ["400", "500", "600"]) {
  loadFont({ family: EN, url: staticFile(`fonts/Barlow-${w}.ttf`), weight: w });
}
for (const w of ["600", "700"]) {
  loadFont({
    family: EN_HEAD,
    url: staticFile(`fonts/BarlowCondensed-${w}.ttf`),
    weight: w,
  });
}

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// 0 → 1 spring that starts at `start`
export const enterAt = (
  frame: number,
  fps: number,
  start: number,
  damping = 14,
) => spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });

export const useEnter = (start: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return enterAt(frame, fps, start, damping);
};

// Paper background with the faint grid, diagonal hatching and soft green glow
// used in the existing SecureLogX awareness videos.
export const Background: React.FC<{ readonly dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const line = dark ? "rgba(255,255,255,0.05)" : "rgba(0,107,53,0.05)";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? C.deepGreen : C.paper,
        backgroundImage: [
          `radial-gradient(ellipse 70% 45% at 50% 42%, ${
            dark ? "rgba(0,123,61,0.55)" : "rgba(0,107,53,0.07)"
          }, transparent 70%)`,
          `linear-gradient(${line} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        ].join(","),
        backgroundSize: "100% 100%, 54px 54px, 54px 54px",
      }}
    >
      {/* diagonal hatching, top-left and bottom-right, drifting slowly */}
      {[
        { left: -260, top: -200 },
        { left: 620, top: 1500 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...p,
            width: 720,
            height: 620,
            opacity: dark ? 0.08 : 0.5,
            translate: `${interpolate(frame, [0, 600], [0, 40])}px 0px`,
            backgroundImage: `repeating-linear-gradient(115deg, ${
              dark ? "#fff" : "rgba(0,107,53,0.10)"
            } 0 2px, transparent 2px 34px)`,
            maskImage: "radial-gradient(closest-side, black, transparent)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const ShieldIcon: React.FC<{
  readonly size: number;
  readonly color?: string;
  readonly fill?: string;
}> = ({ size, color = C.green, fill = "none" }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <path
      d="M50 6 L90 20 V54 C90 82 72 100 50 109 C28 100 10 82 10 54 V20 Z"
      fill={fill}
      stroke={color}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <circle cx={50} cy={50} r={11} fill={fill === "none" ? color : C.white} />
    <path
      d="M44 56 L56 56 L59 80 L41 80 Z"
      fill={fill === "none" ? color : C.white}
    />
  </svg>
);

export const Logo: React.FC<{
  readonly width: number;
  readonly white?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ width, white, style }) => (
  <Img
    src={staticFile(white ? "img/logo-white.png" : "img/logo-green.png")}
    style={{ width, height: "auto", display: "block", ...style }}
  />
);

// Top bar: wordmark pill (left) and campaign pill (right), as in the series
export const Header: React.FC<{ readonly start?: number }> = ({ start = 0 }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [start, start + 14], [-40, 0], {
    ...clamp,
    easing: easeOut,
  });
  const o = interpolate(frame, [start, start + 10], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 72,
          translate: `0px ${y}px`,
          opacity: o,
          background: C.white,
          borderRadius: 999,
          padding: "16px 26px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
        }}
      >
        <Logo width={190} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 56,
          top: 72,
          translate: `0px ${y}px`,
          opacity: o,
          background: C.green,
          color: C.white,
          borderRadius: 999,
          padding: "13px 26px",
          fontFamily: AR,
          fontWeight: 700,
          fontSize: 28,
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 6px 20px rgba(0,77,38,0.25)",
        }}
      >
        <ShieldIcon size={24} color={C.white} />
        حصّن نفسك رقمياً
      </div>
    </>
  );
};

// Highlight chip inside an Arabic headline (white text on a coloured block)
export const Mark: React.FC<{
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly text?: string;
  readonly progress?: number;
}> = ({ children, color = C.green, text = C.white, progress = 1 }) => (
  <span
    style={{
      position: "relative",
      display: "inline-block",
      padding: "0 0.18em",
      margin: "0 0.06em",
      color: progress > 0.5 ? text : "inherit",
    }}
  >
    <span
      style={{
        position: "absolute",
        inset: "-0.02em 0 0.04em 0",
        background: color,
        borderRadius: 10,
        scale: `${progress} 1`,
        transformOrigin: "right center",
        zIndex: -1,
      }}
    />
    {children}
  </span>
);

// Bilingual caption card: Arabic line (Almarai) over an English line (Barlow)
export const Caption: React.FC<{
  readonly ar: React.ReactNode;
  readonly en: string;
  readonly start: number;
  readonly end?: number;
  readonly top?: number;
  readonly arSize?: number;
  readonly dark?: boolean;
}> = ({ ar, en, start, end = 99999, top = 1330, arSize = 62, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
  const out = interpolate(frame, [end - 8, end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(s, out),
        translate: `0px ${interpolate(s, [0, 1], [40, 0]) + (1 - out) * -20}px`,
      }}
    >
      <div
        style={{
          background: dark ? "rgba(0,0,0,0.25)" : C.white,
          border: dark ? `2px solid ${C.gold}` : "none",
          borderRadius: 28,
          padding: "30px 44px 26px",
          boxShadow: dark ? "none" : "0 16px 44px rgba(0,0,0,0.10)",
          textAlign: "center",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: arSize,
            lineHeight: 1.45,
            color: dark ? C.white : C.ink,
          }}
        >
          {ar}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 34,
            lineHeight: 1.3,
            color: dark ? C.gold : C.slate,
          }}
        >
          {en}
        </div>
      </div>
    </div>
  );
};

export const FlagIcon: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 21V4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    <path
      d="M5 4h11l-2 4 2 4H5"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </svg>
);

export const Cursor: React.FC<{ readonly size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.6 14 L18 14 Z"
      fill={C.ink}
      stroke={C.white}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
