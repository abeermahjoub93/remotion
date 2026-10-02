import { AbsoluteFill, useVideoConfig, interpolate, useCurrentFrame } from "remotion";
import {
  AR,
  Background,
  C,
  EN,
  Header,
  Mark,
  clamp,
  easeOut,
  enterAt,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

const PINGS = [
  { ar: "اجتماع بعد 5 دقائق", x: 70, y: 300, r: -5, at: 6 },
  { ar: "12 رسالة جديدة", x: 560, y: 360, r: 4, at: 14 },
  { ar: "مكالمة فائتة", x: 110, y: 560, r: 3, at: 22 },
  { ar: "تذكير: التسليم اليوم", x: 520, y: 620, r: -4, at: 30 },
];

// "Often the problem isn't that you don't know. It's that you're rushed."
export const RehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = useEnter(24);
  const l2 = useEnter(92, 11);
  const shift = interpolate(frame, [86, 100], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const clockIn = useEnter(2);
  const spin = interpolate(frame, [0, 180], [0, 1], {
    easing: (t) => t * t,
  });

  return (
    <AbsoluteFill>
      <Background dark />
      <Header />

      {/* busy day: fast clock + notifications piling up */}
      <AbsoluteFill
        style={{
          opacity: 1 - shift * 0.75,
          scale: `${1 - shift * 0.08}`,
          filter: `blur(${shift * 6}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 540 - 130,
            top: 380,
            scale: `${clockIn}`,
          }}
        >
          <svg width={260} height={260} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={44} fill="none" stroke={C.gold} strokeWidth={5} />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <line
                key={i}
                x1={50}
                y1={11}
                x2={50}
                y2={16}
                stroke={C.gold}
                strokeWidth={2}
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
            <line
              x1={50}
              y1={50}
              x2={50}
              y2={28}
              stroke={C.white}
              strokeWidth={5}
              strokeLinecap="round"
              transform={`rotate(${spin * 1440} 50 50)`}
            />
            <line
              x1={50}
              y1={50}
              x2={50}
              y2={18}
              stroke={C.white}
              strokeWidth={3}
              strokeLinecap="round"
              transform={`rotate(${spin * 1440 * 12} 50 50)`}
            />
            <circle cx={50} cy={50} r={4} fill={C.gold} />
          </svg>
        </div>
        {PINGS.map((p) => {
          const s = enterAt(frame, fps, p.at, 12);
          return (
            <div
              key={p.ar}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                rotate: `${p.r}deg`,
                scale: `${s}`,
                opacity: s,
                direction: "rtl",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: C.white,
                borderRadius: 22,
                padding: "18px 26px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                fontFamily: AR,
                fontWeight: 700,
                fontSize: 32,
                color: C.ink,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 99,
                  background: C.critical,
                }}
              />
              {p.ar}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* line 1 */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: interpolate(shift, [0, 1], [930, 560]),
          textAlign: "center",
          opacity: l1,
          translate: `0px ${(1 - l1) * 40}px`,
          scale: `${1 - shift * 0.18}`,
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.45,
            color: C.white,
          }}
        >
          أغلب الوقت المشكلة
          <br />
          مو إنك ما تعرف…
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 40,
            color: C.gold,
          }}
        >
          Often the problem isn’t that you don’t know.
        </div>
      </div>

      {/* line 2 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 930,
          textAlign: "center",
          opacity: l2,
          scale: `${0.7 + 0.3 * l2}`,
          isolation: "isolate",
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1.5,
            color: C.white,
          }}
        >
          المشكلة إنك
          <br />
          <Mark
            color={C.gold}
            text={C.ink}
            progress={interpolate(frame, [100, 114], [0, 1], clamp)}
          >
            مستعجل.
          </Mark>
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: EN,
            fontWeight: 600,
            fontSize: 48,
            color: C.white,
          }}
        >
          It’s that you’re rushed.
        </div>
      </div>

      <Sfx name="clock-fast" at={0} volume={0.6} />
      <Sfx name="notify" at={6} volume={0.45} />
      <Sfx name="notify" at={14} volume={0.4} />
      <Sfx name="notify" at={22} volume={0.4} />
      <Sfx name="notify" at={30} volume={0.4} />
      <Sfx name="clock-fast" at={48} volume={0.5} />
      <Sfx name="glitch" at={86} volume={0.6} />
      <Sfx name="thud" at={94} />
      <Sfx name="swish" at={100} volume={0.4} />
    </AbsoluteFill>
  );
};
