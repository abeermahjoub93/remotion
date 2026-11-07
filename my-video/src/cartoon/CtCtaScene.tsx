import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN_HEAD, Header, ShieldIcon, clamp, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "../qr/QrCode";
import { Character, REST, blinkAt, mouthAt } from "./Character";
import { speaking, type Line } from "./lines";
import { SpeechBubble } from "./SpeechBubble";

const LINES: Line[] = [
  { from: 8, to: 132, ar: "تحقق قبل المسح أو تسجيل الدخول.", en: "Verify before scanning or logging in." },
  { from: 138, to: 214, ar: "حصّن نفسك رقمياً!", en: "Protect yourself digitally!" },
];
const CHECK = 64;
const CHEER = 138;

// "Verify before scanning or logging in. Protect Yourself Digitally."
export const CtCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qr = enterAt(frame, fps, 4, 12);
  const ok = enterAt(frame, fps, CHECK, 9);
  const pill = enterAt(frame, fps, CHEER + 4, 11);
  const cheering = frame >= CHEER;
  const jump = cheering ? Math.max(0, Math.sin((frame - CHEER) * 0.32)) * 60 * Math.max(0, 1 - (frame - CHEER) / 60) : 0;

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div style={{ position: "absolute", top: 230, left: 540 - 170, width: 340, height: 340, scale: `${qr}` }}>
        <div style={{ position: "absolute", inset: 0, padding: 24, borderRadius: 30, background: C.white, boxShadow: "0 22px 54px rgba(0,0,0,0.12)" }}>
          <div style={{ opacity: interpolate(frame, [CHECK, CHECK + 8], [1, 0.25], clamp) }}>
            <QrCode size={292} />
          </div>
        </div>
        <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", width: 180, height: 180, borderRadius: 999, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", scale: `${ok}`, boxShadow: "0 18px 40px rgba(0,77,38,0.4)" }}>
          <svg width={100} height={100} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </div>
      </div>

      <div style={{ position: "absolute", top: 620, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: pill, scale: `${0.7 + 0.3 * pill}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.green, borderRadius: 999, padding: "20px 46px", direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 60, color: C.white, boxShadow: "0 18px 44px rgba(0,77,38,0.35)" }}>
          <ShieldIcon size={52} color={C.white} />
          حصّن نفسك رقمياً
        </div>
        <div style={{ marginTop: 14, fontFamily: EN_HEAD, fontWeight: 600, fontSize: 36, letterSpacing: "0.12em", color: C.green }}>PROTECT YOURSELF DIGITALLY</div>
      </div>

      {LINES.map((l) => (
        <SpeechBubble key={l.from} {...l} tailX={0.5} top={870} arSize={54} />
      ))}

      <Character
        x={540}
        y={1690 - jump}
        scale={0.9}
        rig={{
          ...REST,
          hold: cheering ? "none" : "shield",
          armR: cheering ? 160 + Math.sin(frame / 3) * 8 : frame >= CHECK ? 45 : 40,
          armL: cheering ? 160 - Math.sin(frame / 3) * 8 : frame >= CHECK ? 150 : 12,
          lookY: cheering ? 0 : -0.8,
          tilt: Math.sin(frame / 12) * 3,
          mood: frame >= CHECK ? "happy" : "neutral",
          mouth: mouthAt(frame, speaking(LINES)),
          blink: blinkAt(frame, 30),
          squash: interpolate(frame, [CHEER, CHEER + 4, CHEER + 10], [0, 0.1, -0.05], clamp),
        }}
      />

      <Sfx name="pop" at={4} volume={0.45} />
      <Sfx name="scan" at={20} volume={0.4} />
      <Sfx name="success" at={CHECK} volume={0.6} />
      <Sfx name="riser" at={CHEER - 30} volume={0.4} />
      <Sfx name="ding" at={CHEER + 4} volume={0.7} />
      <Sfx name="whoosh" at={CHEER} volume={0.4} />
    </AbsoluteFill>
  );
};
