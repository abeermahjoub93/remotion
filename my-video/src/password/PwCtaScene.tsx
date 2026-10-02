import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  AR,
  Background,
  C,
  Cursor,
  EN,
  EN_HEAD,
  Header,
  Mark,
  ShieldIcon,
  clamp,
  easeOut,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

const NEW_PASSWORD = "k7#Qm-v2pX!r9w";
const CLICK = 64;

// "Change one reused password today. Protect Yourself Digitally."
export const PwCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useEnter(4);
  const card = useEnter(18, 13);
  const strike = interpolate(frame, [CLICK + 2, CLICK + 12], [0, 1], { ...clamp, easing: easeOut });
  const typed = Math.floor(interpolate(frame, [CLICK + 14, CLICK + 40], [0, NEW_PASSWORD.length], clamp));
  const done = frame >= CLICK + 42;
  const final = useEnter(150, 12);
  const press = frame >= CLICK && frame < CLICK + 6 ? 0.94 : 1;

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          textAlign: "center",
          opacity: title,
          translate: `0px ${(1 - title) * 30}px`,
          isolation: "isolate",
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 76, lineHeight: 1.45, color: C.ink }}>
          غيّر <Mark progress={interpolate(frame, [12, 24], [0, 1], clamp)}>اليوم</Mark> كلمة مرور
          <br />
          واحدة مكررة.
        </div>
        <div style={{ marginTop: 10, fontFamily: EN, fontWeight: 500, fontSize: 40, color: C.slate }}>
          Change one reused password today.
        </div>
      </div>

      {/* account settings card */}
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 110,
          right: 110,
          background: C.white,
          borderRadius: 36,
          padding: "34px 40px 40px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
          direction: "rtl",
          translate: `0px ${(1 - card) * 120}px`,
          opacity: interpolate(frame, [140, 152], [1, 0.4], clamp) * card,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 40, color: C.ink }}>البريد · كلمة المرور</div>
          <div
            style={{
              fontFamily: AR,
              fontWeight: 800,
              fontSize: 26,
              color: C.white,
              background: done ? C.compliant : C.critical,
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            {done ? "فريدة · Unique" : "مكررة · Reused"}
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            height: 112,
            borderRadius: 22,
            border: `4px solid ${done ? C.compliant : C.mist}`,
            display: "flex",
            alignItems: "center",
            padding: "0 30px",
            direction: "ltr",
            fontFamily: EN,
            fontWeight: 600,
            fontSize: 52,
            color: C.ink,
            position: "relative",
          }}
        >
          {typed === 0 ? (
            <span style={{ position: "relative", color: strike > 0.5 ? C.slate : C.ink }}>
              Riyadh@2024
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  top: "52%",
                  height: 6,
                  background: C.critical,
                  scale: `${strike} 1`,
                  transformOrigin: "left center",
                }}
              />
            </span>
          ) : (
            <span>
              {NEW_PASSWORD.slice(0, typed)}
              <span style={{ color: C.green, opacity: done ? 0 : 1 }}>|</span>
            </span>
          )}
        </div>

        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: C.green,
              color: C.white,
              borderRadius: 18,
              padding: "22px 50px",
              fontFamily: AR,
              fontWeight: 800,
              fontSize: 38,
              scale: `${press}`,
            }}
          >
            {done ? "تم التغيير ✓" : "إنشاء كلمة مرور فريدة"}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: interpolate(frame, [30, 58], [700, 470], { ...clamp, easing: easeOut }),
            top: interpolate(frame, [30, 58], [560, 330], { ...clamp, easing: easeOut }),
            opacity: interpolate(frame, [28, 34, 100, 108], [0, 1, 1, 0], clamp),
          }}
        >
          <Cursor size={80} />
        </div>
      </div>

      {/* sign-off */}
      <div
        style={{
          position: "absolute",
          top: 1330,
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
      <Sfx name="swish" at={14} volume={0.4} />
      <Sfx name="pop" at={20} volume={0.4} />
      <Sfx name="click" at={CLICK} volume={0.7} />
      <Sfx name="swish" at={CLICK + 4} volume={0.4} />
      <Sfx name="typing" at={CLICK + 14} volume={0.55} />
      <Sfx name="success" at={CLICK + 42} volume={0.6} />
      <Sfx name="riser" at={120} volume={0.45} />
      <Sfx name="ding" at={150} volume={0.7} />
    </AbsoluteFill>
  );
};
