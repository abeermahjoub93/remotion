import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, Header, Mark, clamp, easeOut, useEnter } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "./QrCode";

// "A QR code can hide where you're going."
export const QrHookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The opener ends on a full SX-green frame; peel that green away diagonally.
  const wipe = interpolate(frame, [0, 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.6, 0, 0.3, 1),
  });

  const title = useEnter(14);
  const qr = interpolate(frame, [24, 60], [0, 1], clamp);
  const qrIn = useEnter(22, 13);
  const scanY = interpolate(frame % 50, [0, 50], [0, 1]);
  const path = interpolate(frame, [70, 100], [0, 1], { ...clamp, easing: easeOut });
  const dest = useEnter(96, 12);

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <Background />
      <Header start={10} />

      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          textAlign: "center",
          opacity: title,
          translate: `0px ${(1 - title) * 50}px`,
          isolation: "isolate",
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 82, lineHeight: 1.45, color: C.ink }}>
          الـ QR يخفي عنك
          <br />
          <Mark progress={interpolate(frame, [30, 44], [0, 1], clamp)}>المكان اللي رايح له.</Mark>
        </div>
        <div style={{ marginTop: 12, fontFamily: EN, fontWeight: 500, fontSize: 42, color: C.slate }}>
          A QR code can hide where you’re going.
        </div>
      </div>

      {/* QR with scanning frame */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 540 - 250,
          width: 500,
          height: 500,
          scale: `${qrIn}`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: C.white, boxShadow: "0 30px 70px rgba(0,0,0,0.14)" }} />
        <div style={{ position: "absolute", inset: 40 }}>
          <QrCode size={420} reveal={qr} />
        </div>
        {/* viewfinder corners */}
        {[
          { left: -18, top: -18, b: "borderLeft", c: "borderTop" },
          { right: -18, top: -18, b: "borderRight", c: "borderTop" },
          { left: -18, bottom: -18, b: "borderLeft", c: "borderBottom" },
          { right: -18, bottom: -18, b: "borderRight", c: "borderBottom" },
        ].map(({ b, c, ...pos }) => (
          <div
            key={`${b}${c}`}
            style={{
              position: "absolute",
              ...pos,
              width: 90,
              height: 90,
              [b]: `10px solid ${C.green}`,
              [c]: `10px solid ${C.green}`,
              borderRadius: 10,
            }}
          />
        ))}
        {frame > 30 && frame < 100 ? (
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 30 + scanY * 440,
              height: 6,
              borderRadius: 3,
              background: C.green,
              boxShadow: `0 0 24px 6px rgba(0,107,53,0.45)`,
            }}
          />
        ) : null}
      </div>

      {/* hidden destination */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={540}
          y1={1230}
          x2={540}
          y2={1230 + 130 * path}
          stroke={C.green}
          strokeWidth={6}
          strokeDasharray="14 12"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: dest,
          scale: `${0.7 + 0.3 * dest}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: C.ink,
            color: C.white,
            borderRadius: 24,
            padding: "22px 36px",
            boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
          }}
        >
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={2} strokeLinecap="round">
            <circle cx={12} cy={12} r={9} />
            <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
          </svg>
          <span style={{ fontFamily: EN, fontWeight: 600, fontSize: 40, filter: "blur(7px)" }}>https://xxxxxx.xx/xxxx</span>
          <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 56, color: C.gold }}>؟</span>
        </div>
      </div>

      {/* green panel from the opener, sliding off along the same diagonal */}
      <AbsoluteFill
        style={{
          background: C.green,
          clipPath: `polygon(0 -60%, 100% -60%, 100% ${120 - wipe * 165}%, 0 ${140 - wipe * 165}%)`,
        }}
      />

      <Sfx name="whoosh" at={0} volume={0.6} />
      <Sfx name="pop" at={14} volume={0.5} />
      <Sfx name="swish" at={30} volume={0.45} />
      <Sfx name="scan" at={34} volume={0.5} />
      <Sfx name="scan" at={84} volume={0.4} />
      <Sfx name="swish" at={70} volume={0.4} />
      <Sfx name="glitch" at={98} volume={0.45} />
      <Sfx name="thud" at={100} volume={0.7} />
    </AbsoluteFill>
  );
};
