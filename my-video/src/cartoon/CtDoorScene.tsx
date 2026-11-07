import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, Header, clamp, easeOut, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "../qr/QrCode";
import { Character, REST, blinkAt, mouthAt } from "./Character";
import { speaking, type Line } from "./lines";
import { SpeechBubble } from "./SpeechBubble";

const LINES: Line[] = [
  { from: 8, to: 92, ar: "الـ QR مو الوجهة…", en: "The QR code isn’t the destination." },
  { from: 98, to: 192, ar: "هو الباب بس.", en: "It’s just the doorway." },
];
const OPEN = 98;

// "The QR code isn't the destination. It's just the doorway."
export const CtDoorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const door = enterAt(frame, fps, 2, 12);
  const open = interpolate(frame, [OPEN, OPEN + 20], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      <Background dark />
      <Header />

      <div style={{ position: "absolute", top: 230, left: 540 - 175 + 120, width: 350, height: 530, perspective: 1300, scale: `${door}` }}>
        <div style={{ position: "absolute", inset: -20, borderRadius: "26px 26px 0 0", border: `12px solid ${C.gold}`, borderBottom: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 45%, rgba(204,181,139,${0.5 * open}), rgba(0,0,0,0.55) 70%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: AR, fontWeight: 800, fontSize: 180, color: C.gold }}>
          <span style={{ opacity: open, scale: `${0.6 + 0.4 * open}` }}>؟</span>
        </div>
        <div style={{ position: "absolute", inset: 0, background: C.white, borderRadius: 8, transformOrigin: "left center", rotate: `0 1 0 ${-78 * open}deg`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}>
          <QrCode size={240} />
          <div style={{ width: 24, height: 24, borderRadius: 99, background: C.gold, alignSelf: "flex-end", marginRight: 30 }} />
        </div>
      </div>

      {LINES.map((l) => (
        <SpeechBubble key={l.from} {...l} tailX={0.3} top={860} arSize={60} />
      ))}

      <Character
        x={330}
        y={1690}
        scale={0.9}
        glow
        rig={{
          ...REST,
          armR: frame >= OPEN - 6 ? 140 + Math.sin(frame / 6) * 6 : 20,
          armL: frame >= OPEN ? 30 : 12,
          lookX: 0.7,
          lookY: -1,
          tilt: 6,
          mood: frame >= OPEN + 30 ? "happy" : frame >= OPEN ? "surprised" : "neutral",
          mouth: mouthAt(frame, speaking(LINES)),
          blink: blinkAt(frame, 55),
          squash: interpolate(frame, [OPEN, OPEN + 4, OPEN + 10], [0, 0.08, 0], clamp),
        }}
      />

      <Sfx name="whoosh" at={2} volume={0.4} />
      <Sfx name="riser" at={OPEN - 30} volume={0.35} />
      <Sfx name="swish" at={OPEN} volume={0.55} />
      <Sfx name="thud" at={OPEN + 10} />
    </AbsoluteFill>
  );
};
