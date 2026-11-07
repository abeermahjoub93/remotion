import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, Header, clamp, easeOut, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "../qr/QrCode";
import { Character, REST, blinkAt, mouthAt } from "./Character";
import { speaking, type Line } from "./lines";
import { SpeechBubble } from "./SpeechBubble";

const LINES: Line[] = [
  { from: 8, to: 186, ar: "الـ QR يخفي عنك المكان اللي رايح له.", en: "A QR code can hide where you’re going." },
];
const HIDDEN = 96;

// "A QR code can hide where you're going."
export const CtHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qr = enterAt(frame, fps, 4, 12);
  const reveal = interpolate(frame, [10, 50], [0, 1], clamp);
  const scanY = interpolate(frame % 44, [0, 44], [0, 1]);
  const path = interpolate(frame, [HIDDEN - 20, HIDDEN], [0, 1], { ...clamp, easing: easeOut });
  const dest = enterAt(frame, fps, HIDDEN, 11);
  const worried = frame >= HIDDEN + 6;

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div style={{ position: "absolute", top: 250, left: 540 - 200, width: 400, height: 400, scale: `${qr}` }}>
        <div style={{ position: "absolute", inset: 0, padding: 30, borderRadius: 32, background: C.white, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}>
          <QrCode size={340} reveal={reveal} />
        </div>
        {frame < HIDDEN ? (
          <div style={{ position: "absolute", left: 24, right: 24, top: 24 + scanY * 350, height: 6, borderRadius: 3, background: C.green, boxShadow: "0 0 24px 6px rgba(0,107,53,0.45)" }} />
        ) : null}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={540} y1={660} x2={540} y2={660 + 50 * path} stroke={C.green} strokeWidth={6} strokeDasharray="12 10" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: dest, scale: `${0.7 + 0.3 * dest}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.ink, color: C.white, borderRadius: 22, padding: "16px 30px" }}>
          <span style={{ fontFamily: EN, fontWeight: 600, fontSize: 36, filter: "blur(6px)" }}>https://xxxxxx.xx/xxxx</span>
          <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 50, color: C.gold }}>؟</span>
        </div>
      </div>

      <SpeechBubble {...LINES[0]} tailX={0.72} top={860} arSize={54} />

      <Character
        x={760}
        y={1690}
        scale={0.9}
        rig={{
          ...REST,
          hold: "phone",
          armR: worried ? 40 : 75 + Math.sin(frame / 9) * 4,
          armL: worried ? 30 : 12,
          lookX: -0.7,
          lookY: -1,
          tilt: -6 + Math.sin(frame / 15) * 2,
          mood: worried ? "worried" : "neutral",
          mouth: mouthAt(frame, speaking(LINES)),
          blink: blinkAt(frame, 40),
          squash: interpolate(frame, [HIDDEN, HIDDEN + 4, HIDDEN + 10], [0, 0.07, 0], clamp),
        }}
      />

      <Sfx name="pop" at={4} volume={0.5} />
      <Sfx name="scan" at={14} volume={0.5} />
      <Sfx name="scan" at={58} volume={0.4} />
      <Sfx name="glitch" at={HIDDEN - 2} volume={0.45} />
      <Sfx name="alert" at={HIDDEN + 4} volume={0.3} />
    </AbsoluteFill>
  );
};
