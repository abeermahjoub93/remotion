import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Header, Mark, ShieldIcon, clamp, useEnter } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "./QrCode";

const CHECK = 50;

// "Verify before scanning or logging in. Protect Yourself Digitally."
export const QrCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useEnter(4);
  const qr = useEnter(16, 12);
  const ok = useEnter(CHECK, 9);
  const final = useEnter(108, 12);

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div style={{ position: "absolute", top: 290, left: 60, right: 60, textAlign: "center", opacity: title, translate: `0px ${(1 - title) * 30}px`, isolation: "isolate" }}>
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 80, lineHeight: 1.45, color: C.ink }}>
          <Mark progress={interpolate(frame, [12, 24], [0, 1], clamp)}>تحقق</Mark> قبل المسح
          <br />
          أو تسجيل الدخول.
        </div>
        <div style={{ marginTop: 10, fontFamily: EN, fontWeight: 500, fontSize: 42, color: C.slate }}>Verify before scanning or logging in.</div>
      </div>

      <div style={{ position: "absolute", top: 700, left: 540 - 190, width: 380, height: 380, scale: `${qr}` }}>
        <div style={{ position: "absolute", inset: 0, padding: 26, borderRadius: 32, background: C.white, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}>
          <div style={{ opacity: interpolate(frame, [CHECK, CHECK + 8], [1, 0.25], clamp) }}>
            <QrCode size={328} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            width: 200,
            height: 200,
            borderRadius: 999,
            background: C.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: `${ok}`,
            boxShadow: "0 18px 40px rgba(0,77,38,0.4)",
          }}
        >
          <svg width={110} height={110} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: final, scale: `${0.7 + 0.3 * final}` }}>
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
      <Sfx name="swish" at={12} volume={0.4} />
      <Sfx name="scan" at={20} volume={0.45} />
      <Sfx name="success" at={CHECK} volume={0.6} />
      <Sfx name="riser" at={78} volume={0.45} />
      <Sfx name="ding" at={108} volume={0.7} />
    </AbsoluteFill>
  );
};
