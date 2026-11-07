import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, Header, clamp, enterAt } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "../qr/QrCode";
import { Character, REST, blinkAt, mouthAt, walkLegs } from "./Character";
import { speaking, type Line } from "./lines";
import { SpeechBubble } from "./SpeechBubble";

const LINES: Line[] = [
  { from: 52, to: 150, ar: "هلا! خلني أوريك شي عن رموز QR.", en: "Hi! Let me show you something about QR codes." },
];

// The host walks in and says hello
export const CtHelloScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: Easing.bezier(0.6, 0, 0.3, 1) });
  const walking = frame < 44;
  const x = interpolate(frame, [4, 44], [1350, 540], { ...clamp, easing: Easing.out(Easing.quad) });
  const waving = frame >= 48;
  const qr = enterAt(frame, fps, 74, 9);

  return (
    <AbsoluteFill>
      <Background />
      <Header start={10} />

      <div style={{ position: "absolute", top: 300, left: 540 - 200, translate: `0px ${(1 - qr) * -500}px`, opacity: frame < 74 ? 0 : 1, rotate: `${(1 - qr) * 20}deg` }}>
        <div style={{ padding: 22, borderRadius: 34, background: C.white, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}>
          <QrCode size={356} />
        </div>
        <div style={{ position: "absolute", top: -26, right: -26, background: C.green, color: C.white, borderRadius: 999, padding: "10px 26px", fontFamily: AR, fontWeight: 800, fontSize: 40 }}>QR</div>
      </div>

      <SpeechBubble {...LINES[0]} tailX={0.5} top={850} arSize={54} />

      <Character
        x={x}
        y={1690}
        scale={0.9}
        rig={{
          ...REST,
          ...walkLegs(frame, walking),
          armL: walking ? 8 + Math.sin(frame * 0.5) * 18 : 10,
          armR: waving ? 150 + Math.sin(frame * 0.45) * 22 : walking ? 8 - Math.sin(frame * 0.5) * 18 : 10,
          tilt: walking ? Math.sin(frame * 0.5) * 3 : Math.sin(frame / 14) * 3,
          mood: waving ? "happy" : "neutral",
          mouth: mouthAt(frame, speaking(LINES)),
          blink: blinkAt(frame, 20),
          squash: walking ? Math.abs(Math.sin(frame * 0.5)) * 0.04 : interpolate(frame, [44, 48, 54], [0, 0.08, 0], clamp),
        }}
      />

      <AbsoluteFill style={{ background: C.green, clipPath: `polygon(0 -60%, 100% -60%, 100% ${120 - wipe * 165}%, 0 ${140 - wipe * 165}%)` }} />

      <Sfx name="whoosh" at={0} volume={0.6} />
      <Sfx name="tick" at={10} volume={0.25} />
      <Sfx name="tick" at={18} volume={0.25} />
      <Sfx name="tick" at={26} volume={0.25} />
      <Sfx name="tick" at={34} volume={0.25} />
      <Sfx name="pop" at={46} volume={0.5} />
      <Sfx name="whoosh" at={70} volume={0.4} />
      <Sfx name="thud" at={80} volume={0.6} />
    </AbsoluteFill>
  );
};
