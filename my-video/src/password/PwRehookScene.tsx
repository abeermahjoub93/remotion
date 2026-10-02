import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, Header, Mark, clamp, enterAt, useEnter } from "../brand";
import { Sfx } from "../Sfx";

// copies of the same password stamping in around the headline
const COPIES = [
  { x: 90, y: 330, r: -8, at: 8 },
  { x: 600, y: 300, r: 6, at: 14 },
  { x: 160, y: 520, r: 4, at: 20 },
  { x: 640, y: 560, r: -5, at: 26 },
  { x: 70, y: 1420, r: 7, at: 32 },
  { x: 620, y: 1460, r: -7, at: 38 },
];

// "The bigger problem? Reuse."
export const PwRehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = useEnter(10);
  const a = useEnter(56, 10);

  return (
    <AbsoluteFill>
      <Background dark />
      <Header />

      {COPIES.map((c) => {
        const s = enterAt(frame, fps, c.at, 11);
        return (
          <div
            key={`${c.x}-${c.y}`}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              rotate: `${c.r}deg`,
              scale: `${interpolate(s, [0, 1], [1.8, 1])}`,
              opacity: s * interpolate(frame, [56, 70], [1, 0.35], clamp),
              background: "rgba(255,255,255,0.08)",
              border: `3px dashed ${C.gold}`,
              borderRadius: 20,
              padding: "16px 30px",
              fontFamily: EN,
              fontWeight: 600,
              fontSize: 46,
              color: C.white,
            }}
          >
            Riyadh@2024
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          top: 760,
          left: 60,
          right: 60,
          textAlign: "center",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 86,
            color: C.white,
            opacity: q,
            translate: `0px ${(1 - q) * 40}px`,
          }}
        >
          المشكلة الأكبر؟
        </div>
        <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 40, color: C.gold, opacity: q }}>
          The bigger problem?
        </div>
        <div
          style={{
            marginTop: 40,
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 100,
            lineHeight: 1.4,
            color: C.white,
            opacity: a,
            scale: `${0.6 + 0.4 * a}`,
          }}
        >
          <Mark color={C.gold} text={C.ink} progress={interpolate(frame, [62, 76], [0, 1], clamp)}>
            إعادة الاستخدام.
          </Mark>
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: EN,
            fontWeight: 600,
            fontSize: 54,
            color: C.white,
            opacity: a,
          }}
        >
          Reuse.
        </div>
      </div>

      {COPIES.map((c) => (
        <Sfx key={c.at} name="stamp" at={c.at} volume={0.35} />
      ))}
      <Sfx name="whoosh" at={6} volume={0.4} />
      <Sfx name="glitch" at={52} volume={0.5} />
      <Sfx name="thud" at={58} />
      <Sfx name="swish" at={62} volume={0.4} />
    </AbsoluteFill>
  );
};
