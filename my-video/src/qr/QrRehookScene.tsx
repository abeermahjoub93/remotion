import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, Header, Mark, clamp, easeOut, useEnter } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "./QrCode";

const OPEN = 70;

// "The QR code isn't the destination. It's just the doorway."
export const QrRehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const door = useEnter(4, 13);
  const l1 = useEnter(16);
  const l2 = useEnter(OPEN + 10, 11);
  const open = interpolate(frame, [OPEN, OPEN + 22], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      <Background dark />
      <Header />

      <div style={{ position: "absolute", top: 270, left: 70, right: 70, textAlign: "center", opacity: l1, translate: `0px ${(1 - l1) * 40}px` }}>
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 78, color: C.white }}>الـ QR مو الوجهة…</div>
        <div style={{ marginTop: 10, fontFamily: EN, fontWeight: 500, fontSize: 40, color: C.gold }}>The QR code isn’t the destination.</div>
      </div>

      {/* doorway: the QR is the door; behind it, an unknown destination */}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 540 - 220,
          width: 440,
          height: 660,
          perspective: 1400,
          opacity: door,
          scale: `${0.85 + 0.15 * door}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -22,
            borderRadius: "30px 30px 0 0",
            border: `14px solid ${C.gold}`,
            borderBottom: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 45%, rgba(204,181,139,${0.5 * open}), rgba(0,0,0,0.55) 70%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 200,
            color: C.gold,
          }}
        >
          <span style={{ opacity: open, scale: `${0.6 + 0.4 * open}` }}>؟</span>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.white,
            borderRadius: 8,
            transformOrigin: "left center",
            rotate: `0 1 0 ${-78 * open}deg`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <QrCode size={300} />
          <div style={{ width: 28, height: 28, borderRadius: 99, background: C.gold, alignSelf: "flex-end", marginRight: 40 }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1360, left: 60, right: 60, textAlign: "center", isolation: "isolate", opacity: l2, scale: `${0.7 + 0.3 * l2}` }}>
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 100, color: C.white }}>
          هو{" "}
          <Mark color={C.gold} text={C.ink} progress={interpolate(frame, [OPEN + 18, OPEN + 32], [0, 1], clamp)}>
            الباب بس.
          </Mark>
        </div>
        <div style={{ marginTop: 14, fontFamily: EN, fontWeight: 600, fontSize: 48, color: C.white }}>It’s just the doorway.</div>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="pop" at={6} volume={0.4} />
      <Sfx name="riser" at={OPEN - 30} volume={0.35} />
      <Sfx name="swish" at={OPEN} volume={0.55} />
      <Sfx name="thud" at={OPEN + 12} />
      <Sfx name="glitch" at={OPEN + 16} volume={0.3} />
    </AbsoluteFill>
  );
};
