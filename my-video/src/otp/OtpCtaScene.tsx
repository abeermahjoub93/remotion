import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Header, ShieldIcon, clamp, useEnter } from "../brand";
import { Sfx } from "../Sfx";

const CODE = "482915";
const LOCK = 44;

// "Unexpected OTP? Don't share it. Protect Yourself Digitally."
export const OtpCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const q = useEnter(4);
  const no = useEnter(LOCK + 6, 10);
  const final = useEnter(110, 12);
  const hidden = Math.floor(interpolate(frame, [LOCK, LOCK + 18], [0, CODE.length], clamp));

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div style={{ position: "absolute", top: 320, left: 70, right: 70, textAlign: "center" }}>
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 88, color: C.ink, opacity: q, translate: `0px ${(1 - q) * 40}px` }}>
          OTP غير متوقع؟
        </div>
        <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 42, color: C.slate, opacity: q }}>Unexpected OTP?</div>
      </div>

      {/* the code gets locked away */}
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: useEnter(14, 12) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            background: C.white,
            borderRadius: 34,
            padding: "30px 46px",
            boxShadow: `0 24px 60px rgba(0,0,0,0.12), 0 0 0 ${frame >= LOCK ? 6 : 0}px ${C.green}`,
          }}
        >
          <svg width={70} height={70} viewBox="0 0 24 24" fill="none" stroke={frame >= LOCK ? C.green : C.slate} strokeWidth={2} strokeLinecap="round">
            <rect x={5} y={11} width={14} height={10} rx={2} />
            <path d={frame >= LOCK ? "M8 11V8a4 4 0 0 1 8 0v3" : "M8 11V7a4 4 0 0 1 7.5-2"} />
          </svg>
          <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 110, letterSpacing: "0.12em", color: C.ink }}>
            {"•".repeat(hidden) + CODE.slice(hidden)}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: no,
          scale: `${0.6 + 0.4 * no}`,
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 104, color: C.critical }}>لا تشاركه.</div>
        <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 48, color: C.ink }}>Don’t share it.</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1260,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: final,
          scale: `${0.7 + 0.3 * final}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: C.green,
            borderRadius: 999,
            padding: "26px 54px",
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 70,
            color: C.white,
            boxShadow: "0 20px 50px rgba(0,77,38,0.35)",
          }}
        >
          <ShieldIcon size={62} color={C.white} />
          حصّن نفسك رقمياً
        </div>
        <div style={{ marginTop: 22, fontFamily: EN_HEAD, fontWeight: 600, fontSize: 44, letterSpacing: "0.12em", color: C.green }}>
          PROTECT YOURSELF DIGITALLY
        </div>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="notify" at={14} volume={0.4} />
      <Sfx name="typing" at={LOCK} volume={0.45} />
      <Sfx name="click" at={LOCK} volume={0.6} />
      <Sfx name="thud" at={LOCK + 6} />
      <Sfx name="riser" at={80} volume={0.45} />
      <Sfx name="ding" at={110} volume={0.7} />
    </AbsoluteFill>
  );
};
