import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, Header, Mark, clamp, useEnter } from "../brand";
import { Sfx } from "../Sfx";

// "The code is not proof the caller is legitimate. It may be exactly what they need from you."
export const OtpRehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const call = useEnter(4, 13);
  const l1 = useEnter(40);
  const l2 = useEnter(92, 11);
  const ring = frame < 40 ? Math.sin(frame * 2.4) * 4 : 0;

  return (
    <AbsoluteFill>
      <Background dark />
      <Header />

      {/* incoming call */}
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: call * interpolate(frame, [86, 98], [1, 0.45], clamp),
          scale: `${0.8 + 0.2 * call}`,
          rotate: `${ring}deg`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            direction: "rtl",
            background: "rgba(255,255,255,0.1)",
            border: `2px solid rgba(255,255,255,0.25)`,
            borderRadius: 999,
            padding: "20px 36px 20px 22px",
          }}
        >
          <div style={{ width: 84, height: 84, borderRadius: 99, background: C.compliant, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${8 + Math.sin(frame / 3) * 6}px rgba(46,158,106,0.3)` }}>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 40, color: C.white }}>مكالمة واردة · «خدمة العملاء»</div>
            <div style={{ fontFamily: AR, fontSize: 30, color: C.gold }}>«عشان نتأكد إنه أنت، اقرأ لي الرمز»</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 600, left: 70, right: 70, textAlign: "center", isolation: "isolate" }}>
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.45,
            color: C.white,
            opacity: l1,
            translate: `0px ${(1 - l1) * 40}px`,
          }}
        >
          الرمز مو دليل إن
          <br />
          المتصل موثوق…
        </div>
        <div style={{ marginTop: 12, fontFamily: EN, fontWeight: 500, fontSize: 38, color: C.gold, opacity: l1 }}>
          The code is not proof the caller is legitimate.
        </div>

        <div
          style={{
            marginTop: 70,
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1.55,
            color: C.white,
            opacity: l2,
            scale: `${0.7 + 0.3 * l2}`,
          }}
        >
          ممكن يكون هو الشيء
          <br />
          <Mark color={C.gold} text={C.ink} progress={interpolate(frame, [100, 114], [0, 1], clamp)}>
            اللي يحتاجه منك.
          </Mark>
        </div>
        <div style={{ marginTop: 16, fontFamily: EN, fontWeight: 600, fontSize: 42, color: C.white, opacity: l2 }}>
          It may be exactly what they need from you.
        </div>
      </div>

      <Sfx name="notify" at={4} volume={0.5} />
      <Sfx name="notify" at={22} volume={0.4} />
      <Sfx name="swish" at={40} volume={0.4} />
      <Sfx name="glitch" at={88} volume={0.5} />
      <Sfx name="thud" at={94} />
      <Sfx name="swish" at={102} volume={0.4} />
    </AbsoluteFill>
  );
};
