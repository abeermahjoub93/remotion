import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { AR, Background, C, EN, Header, clamp, easeOut, useEnter } from "../brand";
import { Sfx } from "../Sfx";

const SMS = 44;
const WHY = 112;

// "You received a verification code you didn't request. Why?"
export const OtpHookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The intro clip ends on a full SX-green frame; peel that green away diagonally.
  const wipe = interpolate(frame, [0, 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.6, 0, 0.3, 1),
  });

  const title = useEnter(14);
  const phone = useEnter(26, 14);
  const sms = useEnter(SMS, 12);
  const why = useEnter(WHY, 9);
  const buzz =
    frame >= SMS && frame < SMS + 18 ? Math.sin(frame * 3.2) * 7 : 0;

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <Background />
      <Header start={10} />

      <div
        style={{
          position: "absolute",
          top: 300,
          left: 70,
          right: 70,
          textAlign: "center",
          opacity: title,
          translate: `0px ${(1 - title) * 50}px`,
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1.4,
            color: C.ink,
          }}
        >
          جاك رمز تحقق
          <br />
          وأنت ما طلبته…{" "}
          <span
            style={{
              display: "inline-block",
              color: C.critical,
              scale: `${why}`,
              rotate: `${(1 - why) * -25}deg`,
            }}
          >
            ليش؟
          </span>
        </div>
        <div style={{ marginTop: 12, fontFamily: EN, fontWeight: 500, fontSize: 40, color: C.slate }}>
          You received a verification code you didn’t request. Why?
        </div>
      </div>

      {/* phone */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 540 - 280,
          width: 560,
          height: 900,
          borderRadius: 70,
          background: C.ink,
          padding: 18,
          boxShadow: "0 40px 90px rgba(0,0,0,0.25)",
          opacity: phone,
          translate: `${buzz}px ${(1 - phone) * 300}px`,
          rotate: `${buzz * 0.2}deg`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 54,
            overflow: "hidden",
            background: `linear-gradient(160deg, ${C.deepGreen}, ${C.green})`,
          }}
        >
          <div style={{ position: "absolute", top: 18, left: "50%", translate: "-50% 0", width: 150, height: 34, borderRadius: 20, background: C.ink }} />
          <div style={{ marginTop: 110, textAlign: "center", fontFamily: EN, fontWeight: 500, fontSize: 130, color: C.white, lineHeight: 1 }}>
            2:14
          </div>
          <div style={{ marginTop: 8, textAlign: "center", direction: "rtl", fontFamily: AR, fontWeight: 700, fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
            الثلاثاء، 14 أكتوبر
          </div>

          {/* SMS notification */}
          <div
            style={{
              position: "absolute",
              top: 360,
              left: 22,
              right: 22,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 30,
              padding: "22px 26px",
              direction: "rtl",
              opacity: sms,
              translate: `0px ${(1 - sms) * -120}px`,
              scale: `${0.9 + 0.1 * sms}`,
              boxShadow: frame >= WHY ? `0 0 0 6px ${C.critical}` : "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.slate }}>
              <span>الرسائل · Account-Verify</span>
              <span>الآن</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: AR, fontWeight: 400, fontSize: 30, lineHeight: 1.55, color: C.ink }}>
              رمز التحقق الخاص بك هو{" "}
              <b style={{ fontFamily: EN, fontWeight: 600, fontSize: 36, letterSpacing: "0.08em", direction: "ltr", unicodeBidi: "isolate" }}>
                482915
              </b>
              . لا تشاركه مع أي شخص.
            </div>
          </div>

          {/* "I didn't request this" */}
          <div
            style={{
              position: "absolute",
              top: 640,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(frame, [80, 90], [0, 1], clamp),
              translate: `0px ${interpolate(frame, [80, 92], [30, 0], { ...clamp, easing: easeOut })}px`,
            }}
          >
            <div
              style={{
                background: C.critical,
                color: C.white,
                borderRadius: 999,
                padding: "14px 28px",
                direction: "rtl",
                fontFamily: AR,
                fontWeight: 800,
                fontSize: 30,
              }}
            >
              ما طلبت أي رمز!
              <span style={{ fontFamily: EN, fontWeight: 500, fontSize: 24 }}> · I didn’t request it</span>
            </div>
          </div>
        </div>
      </div>

      {/* green panel from the intro, sliding off along the same diagonal */}
      <AbsoluteFill
        style={{
          background: C.green,
          clipPath: `polygon(0 -60%, 100% -60%, 100% ${120 - wipe * 165}%, 0 ${140 - wipe * 165}%)`,
        }}
      />

      <Sfx name="whoosh" at={0} volume={0.6} />
      <Sfx name="pop" at={14} volume={0.5} />
      <Sfx name="swish" at={26} volume={0.45} />
      <Sfx name="notify" at={SMS} volume={0.8} />
      <Sfx name="glitch" at={SMS + 2} volume={0.25} />
      <Sfx name="alert" at={80} volume={0.4} />
      <Sfx name="thud" at={WHY} />
    </AbsoluteFill>
  );
};
