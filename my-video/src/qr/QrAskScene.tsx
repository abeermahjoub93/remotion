import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Header, clamp, easeOut, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "./QrCode";

const Q = [16, 116, 216]; // who provided it, context, destination

const Question: React.FC<{
  readonly n: string;
  readonly ar: string;
  readonly en: string;
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ n, ar, en, at, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at, 13);
  const active = interpolate(frame, [at, at + 8, at + 92, at + 100], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        width: 920,
        direction: "rtl",
        background: C.white,
        borderRadius: 30,
        padding: "22px 30px",
        boxShadow: `0 14px 36px rgba(0,0,0,0.08), 0 0 0 ${active * 5}px ${C.green}`,
        opacity: s,
        translate: `${(1 - s) * -140}px 0px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 56, color: C.gold }}>{n}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 50, color: C.ink }}>{ar}</div>
          <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 30, color: C.slate, direction: "ltr", textAlign: "right" }}>{en}</div>
        </div>
      </div>
      <div style={{ marginTop: 14, opacity: interpolate(frame, [at + 30, at + 40], [0, 1], clamp) }}>{children}</div>
    </div>
  );
};

const Flag: React.FC<{ readonly children: React.ReactNode; readonly ltr?: boolean }> = ({ children, ltr }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: "rgba(180,35,24,0.08)",
      border: `2px solid ${C.critical}`,
      borderRadius: 16,
      padding: "10px 20px",
      fontFamily: ltr ? EN : AR,
      fontWeight: ltr ? 600 : 700,
      fontSize: 30,
      color: C.critical,
      direction: ltr ? "ltr" : "rtl",
    }}
  >
    {children}
  </div>
);

// "Ask: who provided it, does the context make sense and where did it actually take me?"
export const QrAskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sign = enterAt(frame, fps, 2, 13);
  const sticker = interpolate(frame, [Q[0] + 26, Q[0] + 36], [0, 1], { ...clamp, easing: easeOut });
  const peel = interpolate(frame, [Q[0] + 30, Q[0] + 50], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      <Background />
      <Header />

      {/* parking payment sign with a sticker stuck over the original QR */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 540 - 330,
          width: 660,
          height: 500,
          borderRadius: 30,
          background: C.ink,
          padding: 30,
          direction: "rtl",
          display: "flex",
          gap: 30,
          alignItems: "center",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          opacity: sign,
          scale: `${0.85 + 0.15 * sign}`,
        }}
      >
        <div style={{ flex: 1, color: C.white }}>
          <div style={{ width: 90, height: 90, borderRadius: 18, background: "#1f5fbf", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN_HEAD, fontWeight: 700, fontSize: 70 }}>
            P
          </div>
          <div style={{ marginTop: 20, fontFamily: AR, fontWeight: 800, fontSize: 44 }}>مواقف السيارات</div>
          <div style={{ marginTop: 6, fontFamily: AR, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>امسح الرمز للدفع</div>
        </div>
        <div style={{ position: "relative", width: 250, height: 250 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" }}>
            <QrCode size={250} />
          </div>
          {/* sticker */}
          <div
            style={{
              position: "absolute",
              inset: -6,
              rotate: "4deg",
              borderRadius: 14,
              background: C.white,
              padding: 14,
              boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
              clipPath: `polygon(0 0, 100% 0, 100% ${100 - 18 * peel}%, ${100 - 18 * peel}% 100%, 0 100%)`,
            }}
          >
            <QrCode size={234} color="#222" />
          </div>
          <div
            style={{
              position: "absolute",
              inset: -26,
              borderRadius: 26,
              border: `6px dashed ${C.critical}`,
              opacity: frame < Q[0] + 100 ? sticker : 0.35,
              scale: `${1.1 - 0.1 * sticker}`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 770,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Question n="01" ar="من وضع الرمز؟" en="Who provided it?" at={Q[0]}>
          <Flag>ملصق فوق الرمز الأصلي؟</Flag>
        </Question>
        <Question n="02" ar="هل السياق منطقي؟" en="Does the context make sense?" at={Q[1]}>
          <Flag>موقف سيارات يطلب كلمة مرور بريدك؟</Flag>
        </Question>
        <Question n="03" ar="وإلى أين أخذني فعلاً؟" en="Where did it actually take me?" at={Q[2]}>
          <Flag ltr>
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.critical} strokeWidth={2.2} strokeLinecap="round">
              <path d="M12 3l10 18H2z" />
              <path d="M12 10v5M12 18h.01" />
            </svg>
            parking-pay-riyadh.co/login
          </Flag>
        </Question>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="click" at={Q[0]} volume={0.6} />
      <Sfx name="scan" at={Q[0] + 26} volume={0.5} />
      <Sfx name="alert" at={Q[0] + 40} volume={0.3} />
      <Sfx name="click" at={Q[1]} volume={0.6} />
      <Sfx name="pop" at={Q[1] + 30} volume={0.5} />
      <Sfx name="alert" at={Q[1] + 34} volume={0.3} />
      <Sfx name="click" at={Q[2]} volume={0.6} />
      <Sfx name="typing" at={Q[2] + 26} volume={0.4} />
      <Sfx name="alert" at={Q[2] + 40} volume={0.35} />
    </AbsoluteFill>
  );
};
