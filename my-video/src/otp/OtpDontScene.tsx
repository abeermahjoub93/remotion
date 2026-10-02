import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, Caption, Cursor, EN, Header, clamp, easeOut, enterAt } from "../brand";
import { Sfx } from "../Sfx";

const A = 24; // code request
const A_NO = 96;
const B = 150; // approval prompt
const B_NO = 222;

// Red "no" stamp across a card
const NoStamp: React.FC<{ readonly at: number; readonly ar: string; readonly en: string }> = ({ at, ar, en }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const s = interpolate(t, [0, 7], [2.2, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", borderRadius: 34, background: `rgba(247,247,245,${interpolate(t, [0, 6], [0, 0.6], clamp)})` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          direction: "rtl",
          border: `8px solid ${C.critical}`,
          borderRadius: 22,
          padding: "14px 30px",
          background: "rgba(255,255,255,0.92)",
          color: C.critical,
          rotate: "-6deg",
          scale: `${s}`,
          opacity: interpolate(t, [0, 3], [0, 1], clamp),
        }}
      >
        <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={C.critical} strokeWidth={2.6} strokeLinecap="round">
          <circle cx={12} cy={12} r={10} />
          <path d="M5 5l14 14" />
        </svg>
        <div>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 54 }}>{ar}</div>
          <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 30 }}>{en}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// "If an OTP or approval request arrives and you didn't initiate it, don't share the code or approve automatically."
export const OtpDontScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = enterAt(frame, fps, A, 13);
  const b = enterAt(frame, fps, B, 13);
  const typing = frame >= A + 12 && frame < A + 40;

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <Caption
        start={4}
        top={200}
        arSize={50}
        ar={
          <>
            إذا وصلك OTP أو طلب موافقة <span style={{ color: C.critical }}>ما بدأته أنت</span>:
          </>
        }
        en="If an OTP or approval request arrives and you didn’t initiate it:"
      />

      {/* A: someone asks for the code */}
      <div
        style={{
          position: "absolute",
          top: 590,
          left: 90,
          right: 90,
          background: C.white,
          borderRadius: 34,
          padding: "30px 34px",
          boxShadow: "0 18px 46px rgba(0,0,0,0.10)",
          direction: "rtl",
          opacity: a,
          translate: `${(1 - a) * 160}px 0px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 99, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={C.slate} strokeWidth={2} strokeLinecap="round">
              <circle cx={12} cy={8} r={4} />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 34, color: C.ink }}>«فريق الدعم»</div>
            <div style={{ fontFamily: EN, fontSize: 24, color: C.slate }}>+966 5X XXX XXXX</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
            background: "#eef1f4",
            borderRadius: "26px 26px 26px 8px",
            padding: "20px 26px",
            fontFamily: AR,
            fontSize: 36,
            lineHeight: 1.55,
            color: C.ink,
            minHeight: 60,
          }}
        >
          {typing ? (
            <span style={{ fontFamily: EN, fontSize: 44, letterSpacing: "0.2em", color: C.slate }}>
              {".".repeat(1 + (Math.floor(frame / 6) % 3))}
            </span>
          ) : (
            "وصلك رمز الحين؟ أرسله لي عشان نوقف العملية المشبوهة على حسابك."
          )}
        </div>
        <NoStamp at={A_NO} ar="لا تشارك الرمز" en="Don’t share the code" />
      </div>

      {/* B: push approval */}
      <div
        style={{
          position: "absolute",
          top: 990,
          left: 90,
          right: 90,
          background: C.white,
          borderRadius: 34,
          padding: "30px 34px",
          boxShadow: "0 18px 46px rgba(0,0,0,0.10)",
          direction: "rtl",
          opacity: b,
          translate: `${(1 - b) * -160}px 0px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.slate }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.slate} strokeWidth={2} strokeLinecap="round">
            <rect x={5} y={11} width={14} height={10} rx={2} />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          طلب تسجيل دخول
        </div>
        <div style={{ marginTop: 12, fontFamily: AR, fontWeight: 800, fontSize: 44, color: C.ink }}>
          هل تحاول تسجيل الدخول الآن؟
        </div>
        <div style={{ marginTop: 6, fontFamily: AR, fontSize: 28, color: C.slate }}>
          جهاز جديد · الرياض
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 20 }}>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              background: C.green,
              color: C.white,
              borderRadius: 18,
              padding: "20px 0",
              fontFamily: AR,
              fontWeight: 800,
              fontSize: 36,
            }}
          >
            موافقة
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              border: `3px solid ${C.mist}`,
              color: C.ink,
              borderRadius: 18,
              padding: "20px 0",
              fontFamily: AR,
              fontWeight: 800,
              fontSize: 36,
            }}
          >
            رفض
          </div>
        </div>
        {/* thumb drifting toward "approve" on autopilot */}
        <div
          style={{
            position: "absolute",
            left: interpolate(frame, [B + 20, B + 60], [40, 580], { ...clamp, easing: easeOut }),
            top: interpolate(frame, [B + 20, B + 60], [420, 236], { ...clamp, easing: easeOut }),
            opacity: interpolate(frame, [B + 18, B + 24, B_NO, B_NO + 4], [0, 1, 1, 0], clamp),
          }}
        >
          <Cursor size={76} />
        </div>
        <NoStamp at={B_NO} ar="لا توافق تلقائياً" en="Don’t approve automatically" />
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="swish" at={A} volume={0.45} />
      <Sfx name="typing" at={A + 12} volume={0.4} />
      <Sfx name="notify" at={A + 40} volume={0.55} />
      <Sfx name="stamp" at={A_NO + 4} />
      <Sfx name="alert" at={A_NO + 6} volume={0.35} />
      <Sfx name="swish" at={B} volume={0.45} />
      <Sfx name="notify" at={B + 8} volume={0.45} />
      <Sfx name="stamp" at={B_NO + 4} />
      <Sfx name="alert" at={B_NO + 6} volume={0.35} />
    </AbsoluteFill>
  );
};
