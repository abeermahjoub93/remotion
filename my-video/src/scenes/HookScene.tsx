import { AbsoluteFill, useVideoConfig, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  AR,
  Background,
  C,
  Cursor,
  EN,
  FlagIcon,
  Header,
  Mark,
  clamp,
  easeOut,
  enterAt,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

// "Would you click this? You have five seconds to find three red flags."
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The intro clip ends on a full SX-green frame; peel that green away diagonally.
  const wipe = interpolate(frame, [0, 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.6, 0, 0.3, 1),
  });

  const linkIn = useEnter(10);
  const q1 = useEnter(16);
  const line1Out = interpolate(frame, [86, 96], [1, 0], clamp);
  const q2 = useEnter(96);
  const five = useEnter(108, 9);
  const three = useEnter(116, 9);

  // cursor drifts to the link, hovers, hesitates
  const cx = interpolate(frame, [22, 52], [760, 560], {
    ...clamp,
    easing: easeOut,
  });
  const cy = interpolate(frame, [22, 52], [1220, 1080], {
    ...clamp,
    easing: easeOut,
  });
  const jitter = frame > 56 && frame < 80 ? Math.sin(frame * 1.3) * 6 : 0;
  const hover = interpolate(frame, [50, 58], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <Background />
      <Header start={10} />

      {/* Line 1 */}
      <AbsoluteFill style={{ opacity: line1Out }}>
        <div
          style={{
            position: "absolute",
            top: 560,
            left: 80,
            right: 80,
            textAlign: "center",
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1.35,
            color: C.ink,
            opacity: q1,
            translate: `0px ${(1 - q1) * 50}px`,
            isolation: "isolate",
          }}
        >
          بتضغط على
          <br />
          <Mark progress={interpolate(frame, [26, 40], [0, 1], clamp)}>
            هذا الرابط؟
          </Mark>
        </div>
        <div
          style={{
            position: "absolute",
            top: 860,
            width: "100%",
            textAlign: "center",
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 44,
            color: C.slate,
            opacity: q1,
          }}
        >
          Would you click this?
        </div>

        {/* the link */}
        <div
          style={{
            position: "absolute",
            top: 1060,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            scale: `${0.6 + 0.4 * linkIn + hover * 0.04}`,
            opacity: linkIn,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: C.white,
              borderRadius: 999,
              padding: "26px 40px",
              boxShadow: `0 18px 50px rgba(0,0,0,0.12), 0 0 0 ${
                hover * 6
              }px rgba(0,107,53,0.18)`,
              fontFamily: EN,
              fontWeight: 600,
              fontSize: 40,
              color: "#1a56b3",
              textDecoration: "underline",
            }}
          >
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
              <path
                d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"
                stroke="#1a56b3"
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            </svg>
            verify-account-update.co/login
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: cx + jitter,
            top: cy,
            opacity: interpolate(frame, [20, 26], [0, 1], clamp),
          }}
        >
          <Cursor size={84} />
        </div>
      </AbsoluteFill>

      {/* Line 2 */}
      <AbsoluteFill style={{ opacity: q2 }}>
        <div
          style={{
            position: "absolute",
            top: 610,
            left: 70,
            right: 70,
            textAlign: "center",
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1.5,
            color: C.ink,
            translate: `0px ${(1 - q2) * 50}px`,
            isolation: "isolate",
          }}
        >
          عندك{" "}
          <span style={{ display: "inline-block", scale: `${five}` }}>
            <Mark>5 ثواني</Mark>
          </span>
          <br />
          تكتشف{" "}
          <span style={{ display: "inline-block", scale: `${three}` }}>
            <Mark color={C.critical}>3 علامات</Mark>
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 940,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.3,
            color: C.slate,
          }}
        >
          You have five seconds to find three red flags.
        </div>

        <div
          style={{
            position: "absolute",
            top: 1150,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 44,
          }}
        >
          {[0, 1, 2].map((i) => {
            const p = enterAt(frame, fps, 126 + i * 8, 10);
            return (
              <div
                key={i}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 40,
                  background: C.white,
                  border: `4px dashed ${C.mist}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: `${p}`,
                  rotate: `${(1 - p) * -20}deg`,
                }}
              >
                <FlagIcon size={96} color={C.critical} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* green panel from the intro, sliding off along the same diagonal */}
      <AbsoluteFill
        style={{
          background: C.green,
          clipPath: `polygon(0 -60%, 100% -60%, 100% ${
            120 - wipe * 165
          }%, 0 ${140 - wipe * 165}%)`,
        }}
      />

      <Sfx name="whoosh" at={0} volume={0.6} />
      <Sfx name="pop" at={12} volume={0.5} />
      <Sfx name="swish" at={26} volume={0.5} />
      <Sfx name="click" at={64} volume={0.5} />
      <Sfx name="whoosh" at={92} volume={0.5} />
      <Sfx name="thud" at={108} volume={0.7} />
      <Sfx name="thud" at={116} volume={0.7} />
      <Sfx name="pop" at={126} volume={0.6} />
      <Sfx name="pop" at={134} volume={0.6} />
      <Sfx name="pop" at={142} volume={0.6} />
    </AbsoluteFill>
  );
};
