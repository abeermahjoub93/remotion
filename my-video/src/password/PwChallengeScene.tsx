import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Header, clamp, enterAt, useEnter } from "../brand";
import { Sfx } from "../Sfx";

const POLL = 120;

const Check: React.FC<{ readonly ar: string; readonly en: string; readonly at: number }> = ({ ar, en, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at - 16, 13);
  const tick = enterAt(frame, fps, at, 10);
  return (
    <div
      style={{
        width: 880,
        display: "flex",
        alignItems: "center",
        gap: 26,
        direction: "rtl",
        background: C.white,
        borderRadius: 28,
        padding: "26px 34px",
        boxShadow: "0 14px 36px rgba(0,0,0,0.08)",
        opacity: s,
        translate: `0px ${(1 - s) * 50}px`,
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 18,
          border: `4px solid ${frame >= at ? C.compliant : C.mist}`,
          background: frame >= at ? C.compliant : C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={44} height={44} viewBox="0 0 24 24" style={{ scale: `${tick}` }}>
          <path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 52, color: C.ink }}>{ar}</div>
        <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 30, color: C.slate, direction: "ltr", textAlign: "right" }}>{en}</div>
      </div>
    </div>
  );
};

// X: "Today's challenge…"  ·  Instagram Stories poll: "Do you reuse a password across more than one account?"
export const PwChallengeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = useEnter(4);
  const out = interpolate(frame, [POLL - 10, POLL], [1, 0], clamp);
  const poll = useEnter(POLL + 4, 13);
  // the options pulse to invite a vote (no fake results)
  const pulse = (i: number) =>
    interpolate(frame, [POLL + 50 + i * 14, POLL + 56 + i * 14, POLL + 64 + i * 14], [1, 1.05, 1], clamp);

  return (
    <AbsoluteFill>
      <Background />
      <Header />

      {/* today's challenge */}
      <AbsoluteFill style={{ opacity: out, translate: `${(1 - out) * -200}px 0px` }}>
        <div style={{ position: "absolute", top: 300, left: 80, right: 80, textAlign: "center", opacity: title }}>
          <div
            style={{
              display: "inline-block",
              background: C.ink,
              color: C.gold,
              borderRadius: 999,
              padding: "10px 30px",
              fontFamily: EN_HEAD,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: "0.1em",
            }}
          >
            TODAY’S CHALLENGE
          </div>
          <div style={{ marginTop: 26, direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 92, color: C.green }}>
            تحدي اليوم
          </div>
          <div style={{ marginTop: 10, direction: "rtl", fontFamily: AR, fontWeight: 700, fontSize: 50, color: C.ink }}>
            اختر حساباً مهماً وتأكد أن:
          </div>
          <div style={{ marginTop: 8, fontFamily: EN, fontWeight: 500, fontSize: 34, color: C.slate }}>
            Choose one important account and confirm:
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 690,
            left: 80,
            right: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
          }}
        >
          <Check ar="كلمة مروره فريدة" en="Its password is unique" at={50} />
          <Check ar="MFA مفعّل" en="MFA is enabled" at={80} />
        </div>
      </AbsoluteFill>

      {/* Stories poll */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 120,
          right: 120,
          background: C.white,
          borderRadius: 40,
          padding: "50px 46px 46px",
          boxShadow: "0 30px 70px rgba(0,0,0,0.14)",
          direction: "rtl",
          textAlign: "center",
          opacity: poll,
          scale: `${0.8 + 0.2 * poll}`,
          rotate: `${(1 - poll) * 6}deg`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.green,
            color: C.white,
            borderRadius: 999,
            padding: "8px 26px",
            fontFamily: EN_HEAD,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "0.1em",
          }}
        >
          POLL · استطلاع
        </div>
        <div style={{ marginTop: 28, fontFamily: AR, fontWeight: 800, fontSize: 58, lineHeight: 1.45, color: C.ink }}>
          هل تستخدم نفس كلمة المرور في أكثر من حساب؟
        </div>
        <div style={{ marginTop: 14, fontFamily: EN, fontWeight: 500, fontSize: 32, color: C.slate, direction: "ltr" }}>
          Do you reuse a password across more than one account?
        </div>
        {[
          { ar: "نعم", en: "Yes" },
          { ar: "لا", en: "No" },
        ].map((o, i) => {
          const s = enterAt(frame, fps, POLL + 22 + i * 8, 12);
          return (
            <div
              key={o.en}
              style={{
                position: "relative",
                marginTop: i === 0 ? 40 : 20,
                height: 108,
                borderRadius: 24,
                border: `4px solid ${C.mist}`,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 34px",
                scale: `${s * pulse(i)}`,
              }}
            >
              <div style={{ position: "relative", fontFamily: AR, fontWeight: 800, fontSize: 48, color: C.ink }}>
                {o.ar} <span style={{ fontFamily: EN, fontWeight: 500, fontSize: 32, color: C.slate }}>· {o.en}</span>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 34, fontFamily: AR, fontWeight: 700, fontSize: 36, color: C.green }}>
          صوّت في الستوري · <span style={{ fontFamily: EN, fontWeight: 500 }}>Vote in our Stories</span>
        </div>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="pop" at={34} volume={0.4} />
      <Sfx name="click" at={50} volume={0.6} />
      <Sfx name="pop" at={64} volume={0.4} />
      <Sfx name="click" at={80} volume={0.6} />
      <Sfx name="success" at={84} volume={0.45} />
      <Sfx name="swish" at={POLL - 8} volume={0.5} />
      <Sfx name="notify" at={POLL + 6} volume={0.5} />
      <Sfx name="pop" at={POLL + 22} volume={0.4} />
      <Sfx name="pop" at={POLL + 30} volume={0.4} />
      <Sfx name="click" at={POLL + 52} volume={0.5} />
      <Sfx name="pop" at={POLL + 64} volume={0.35} />
    </AbsoluteFill>
  );
};
