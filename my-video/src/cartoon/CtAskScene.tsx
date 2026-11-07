import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Header, clamp, easeOut, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "../qr/QrCode";
import { Character, REST, blinkAt, mouthAt, type Mood } from "./Character";
import { speaking, type Line } from "./lines";
import { SpeechBubble } from "./SpeechBubble";

const LINES: Line[] = [
  { from: 8, to: 132, ar: "أول سؤال: من وضع الرمز؟ ممكن يكون ملصق فوق الأصلي.", en: "First: who provided it? It could be a sticker over the original." },
  { from: 138, to: 264, ar: "ثاني سؤال: هل السياق منطقي؟ موقف سيارات يطلب كلمة مرور بريدك؟", en: "Second: does the context make sense? A parking meter asking for your email password?" },
  { from: 270, to: 396, ar: "ثالث سؤال: وإلى أين أخذني فعلاً؟ شيك على الرابط قبل ما تكمل.", en: "Third: where did it actually take me? Check the link before you go on." },
];

const Chip: React.FC<{ readonly n: string; readonly ar: string; readonly at: number; readonly top: number }> = ({ n, ar, at, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at, 11);
  return (
    <div style={{ position: "absolute", top, left: 80, display: "flex", alignItems: "center", gap: 14, direction: "rtl", background: C.white, borderRadius: 999, padding: "10px 26px 10px 18px", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", border: `3px solid ${C.critical}`, opacity: s, scale: `${s}`, transformOrigin: "left center" }}>
      <span style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 34, color: C.gold }}>{n}</span>
      <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 34, color: C.ink }}>{ar}</span>
    </div>
  );
};

// "Ask: who provided it, does the context make sense and where did it actually take me?"
export const CtAskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sign = enterAt(frame, fps, 2, 12);
  const peel = interpolate(frame, [50, 70], [0, 1], { ...clamp, easing: easeOut });
  const q = LINES.reduce((acc, l, i) => (frame >= l.from ? i : acc), 0);
  const mood: Mood = q === 0 ? "neutral" : q === 1 ? "worried" : "surprised";
  const url = enterAt(frame, fps, 310, 11);
  const bob = Math.sin(frame / 8) * 6;

  return (
    <AbsoluteFill>
      <Background />
      <Header />

      {/* parking sign with a sticker over the original QR */}
      <div style={{ position: "absolute", top: 220, left: 80, width: 520, height: 340, borderRadius: 26, background: C.ink, padding: 24, direction: "rtl", display: "flex", gap: 22, alignItems: "center", boxShadow: "0 22px 50px rgba(0,0,0,0.2)", scale: `${sign}` }}>
        <div style={{ flex: 1, color: C.white }}>
          <div style={{ width: 70, height: 70, borderRadius: 14, background: "#1f5fbf", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN_HEAD, fontWeight: 700, fontSize: 54 }}>P</div>
          <div style={{ marginTop: 14, fontFamily: AR, fontWeight: 800, fontSize: 34 }}>مواقف السيارات</div>
          <div style={{ marginTop: 4, fontFamily: AR, fontSize: 24, color: "rgba(255,255,255,0.75)" }}>امسح الرمز للدفع</div>
        </div>
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <QrCode size={200} />
          <div style={{ position: "absolute", inset: -5, rotate: "4deg", borderRadius: 12, background: C.white, padding: 10, boxShadow: "0 6px 14px rgba(0,0,0,0.35)", clipPath: `polygon(0 0, 100% 0, 100% ${100 - 20 * peel}%, ${100 - 20 * peel}% 100%, 0 100%)` }}>
            <QrCode size={190} color="#222" />
          </div>
          <div style={{ position: "absolute", inset: -20, borderRadius: 22, border: `6px dashed ${C.critical}`, opacity: q === 0 ? peel : 0.3 }} />
        </div>
      </div>

      {/* phone preview with the real destination */}
      <div style={{ position: "absolute", top: 230, right: 70, width: 300, height: 520, borderRadius: 40, background: C.ink, padding: 12, opacity: url, translate: `${(1 - url) * 200}px ${bob * 0.4}px`, rotate: "5deg" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 30, background: C.white, padding: "40px 16px", direction: "ltr" }}>
          <div style={{ border: `3px solid ${C.critical}`, borderRadius: 12, padding: "8px 10px", fontFamily: EN, fontWeight: 600, fontSize: 18, color: C.critical, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
            parking-pay-riyadh.co/login
          </div>
          <div style={{ marginTop: 26, direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 26, color: C.ink }}>تسجيل الدخول</div>
          {[0, 1].map((i) => (
            <div key={i} style={{ marginTop: 16, height: 44, borderRadius: 10, border: `2px solid ${C.mist}` }} />
          ))}
          <div style={{ marginTop: 18, height: 50, borderRadius: 10, background: "#1f5fbf" }} />
        </div>
      </div>

      <Chip n="01" ar="من وضع الرمز؟" at={LINES[0].from + 4} top={600} />
      <Chip n="02" ar="هل السياق منطقي؟" at={LINES[1].from + 4} top={680} />
      <Chip n="03" ar="وإلى أين أخذني فعلاً؟" at={LINES[2].from + 4} top={760} />

      {LINES.map((l) => (
        <SpeechBubble key={l.from} {...l} tailX={0.25} top={850} arSize={46} />
      ))}

      <Character
        x={300}
        y={1690}
        scale={0.9}
        rig={{
          ...REST,
          hold: "magnifier",
          armR: 70 + Math.sin(frame / 7) * 10,
          armL: q === 1 ? 40 + Math.sin(frame / 4) * 6 : 12,
          lookX: 0.6,
          lookY: -1,
          tilt: 5 + Math.sin(frame / 12) * 3,
          mood,
          mouth: mouthAt(frame, speaking(LINES)),
          blink: blinkAt(frame, 10),
          squash: LINES.reduce((acc, l) => acc + interpolate(frame, [l.from, l.from + 4, l.from + 10], [0, 0.07, 0], clamp), 0),
        }}
      />

      <Sfx name="pop" at={2} volume={0.45} />
      <Sfx name="scan" at={50} volume={0.45} />
      <Sfx name="alert" at={64} volume={0.3} />
      <Sfx name="pop" at={LINES[1].from + 4} volume={0.45} />
      <Sfx name="alert" at={LINES[1].from + 40} volume={0.25} />
      <Sfx name="swish" at={306} volume={0.45} />
      <Sfx name="alert" at={318} volume={0.3} />
    </AbsoluteFill>
  );
};
