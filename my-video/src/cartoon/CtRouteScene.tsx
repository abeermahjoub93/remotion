import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, Header, clamp, easeOut, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "../qr/QrCode";
import { Character, REST, blinkAt, mouthAt } from "./Character";
import { speaking, type Line } from "./lines";
import { SpeechBubble } from "./SpeechBubble";

const LINES: Line[] = [
  { from: 8, to: 104, ar: "رمز QR مجرد طريق لمكان آخر.", en: "A QR code is simply a route to another destination." },
  { from: 110, to: 216, ar: "قبل تسجيل الدخول أو الدفع، اسأل:", en: "Before logging in or paying, ask:" },
];

const Dest: React.FC<{ readonly ar: string; readonly en: string; readonly at: number; readonly x: number; readonly glow: boolean; readonly children: React.ReactNode }> = ({ ar, en, at, x, glow, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at, 11);
  return (
    <div style={{ position: "absolute", left: x, top: 600, width: 300, padding: "22px 0 18px", borderRadius: 28, background: C.white, boxShadow: `0 16px 40px rgba(0,0,0,0.10), 0 0 0 ${glow ? 5 : 0}px ${C.gold}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, scale: `${s}` }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
      </div>
      <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 38, color: C.ink }}>{ar}</div>
      <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 26, color: C.slate }}>{en}</div>
    </div>
  );
};

// "A QR code is simply a route to another destination. Before logging in or paying, ask:"
export const CtRouteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qr = enterAt(frame, fps, 4, 12);
  const route = interpolate(frame, [20, 50], [0, 1], { ...clamp, easing: easeOut });
  const dot = interpolate(frame, [36, 66], [0, 1], { ...clamp, easing: easeOut });
  const asking = frame >= LINES[1].from;

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div style={{ position: "absolute", top: 220, left: 540 - 140, scale: `${qr}` }}>
        <div style={{ padding: 18, borderRadius: 28, background: C.white, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
          <QrCode size={244} />
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[280, 800].map((x) => {
          const d = `M 540 505 L 540 545 Q ${x} 545 ${x} 600`;
          return (
            <g key={x}>
              <path d={d} fill="none" stroke={C.green} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${route} 1`} />
              <path d={d} fill="none" stroke={C.green} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 1" strokeDashoffset={-dot * 0.94} opacity={dot > 0 && dot < 1 ? 1 : 0} />
            </g>
          );
        })}
      </svg>
      <Dest ar="تسجيل دخول" en="Log in" at={54} x={650} glow={asking}>
        <rect x={5} y={11} width={14} height={10} rx={2} />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </Dest>
      <Dest ar="دفع" en="Payment" at={62} x={130} glow={asking}>
        <rect x={3} y={6} width={18} height={13} rx={2} />
        <path d="M3 10h18M7 15h4" />
      </Dest>

      <SpeechBubble {...LINES[0]} tailX={0.5} top={870} arSize={54} />
      <SpeechBubble {...LINES[1]} tailX={0.5} top={870} arSize={54} />

      <Character
        x={540}
        y={1690}
        scale={0.9}
        rig={{
          ...REST,
          armR: asking ? 10 : 150 + Math.sin(frame / 6) * 6,
          armL: asking ? 168 + Math.sin(frame / 5) * 4 : 12,
          lookY: asking ? 0 : -1,
          tilt: Math.sin(frame / 13) * 3,
          mood: asking ? "surprised" : "neutral",
          mouth: mouthAt(frame, speaking(LINES)),
          blink: blinkAt(frame, 70),
          squash: interpolate(frame, [LINES[1].from, LINES[1].from + 4, LINES[1].from + 10], [0, 0.08, 0], clamp),
        }}
      />

      <Sfx name="pop" at={4} volume={0.5} />
      <Sfx name="swish" at={22} volume={0.45} />
      <Sfx name="pop" at={54} volume={0.45} />
      <Sfx name="pop" at={62} volume={0.45} />
      <Sfx name="ding" at={LINES[1].from} volume={0.35} />
    </AbsoluteFill>
  );
};
