import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  AR,
  Background,
  C,
  EN,
  EN_HEAD,
  Header,
  ShieldIcon,
  clamp,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

const Step: React.FC<{
  readonly n: string;
  readonly ar: string;
  readonly en: string;
  readonly at: number;
  readonly icon: React.ReactNode;
}> = ({ n, ar, en, at, icon }) => {
  const frame = useCurrentFrame();
  const s = useEnter(at, 13);
  const active = interpolate(frame, [at, at + 10, at + 34, at + 44], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        width: 900,
        display: "flex",
        alignItems: "center",
        gap: 28,
        direction: "rtl",
        background: C.white,
        borderRadius: 30,
        padding: "28px 34px",
        boxShadow: `0 14px 36px rgba(0,0,0,0.08), 0 0 0 ${active * 5}px ${C.green}`,
        opacity: s,
        translate: `0px ${(1 - s) * 60}px`,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 24,
          background: C.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 60, color: C.ink }}>
          {ar}
        </div>
        <div
          style={{
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 34,
            color: C.slate,
            direction: "ltr",
            textAlign: "right",
          }}
        >
          {en}
        </div>
      </div>
      <div
        style={{
          fontFamily: EN_HEAD,
          fontWeight: 700,
          fontSize: 72,
          color: C.gold,
        }}
      >
        {n}
      </div>
    </div>
  );
};

const stroke = { stroke: C.white, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

// "Pause. Verify through a trusted channel. Then decide. Protect Yourself Digitally."
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useEnter(4);
  const final = useEnter(150, 12);

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: title,
          translate: `0px ${(1 - title) * 30}px`,
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 84, color: C.green }}>
          قبل ما تضغط
        </div>
        <div style={{ fontFamily: EN_HEAD, fontWeight: 600, fontSize: 40, letterSpacing: "0.08em", color: C.slate }}>
          BEFORE YOU CLICK
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 560,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          opacity: interpolate(frame, [140, 152], [1, 0.5], clamp),
        }}
      >
        <Step
          n="01"
          ar="وقف."
          en="Pause."
          at={24}
          icon={
            <svg width={52} height={52} viewBox="0 0 24 24">
              <rect x={6} y={5} width={4} height={14} rx={1.2} fill={C.white} />
              <rect x={14} y={5} width={4} height={14} rx={1.2} fill={C.white} />
            </svg>
          }
        />
        <Step
          n="02"
          ar="تحقق من قناة موثوقة."
          en="Verify through a trusted channel."
          at={62}
          icon={
            <svg width={52} height={52} viewBox="0 0 24 24">
              <path {...stroke} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
          }
        />
        <Step
          n="03"
          ar="بعدين قرر."
          en="Then decide."
          at={100}
          icon={
            <svg width={52} height={52} viewBox="0 0 24 24">
              <path {...stroke} strokeWidth={2.8} d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          }
        />
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
        <div
          style={{
            marginTop: 22,
            fontFamily: EN_HEAD,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.12em",
            color: C.green,
          }}
        >
          PROTECT YOURSELF DIGITALLY
        </div>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="click" at={24} volume={0.6} />
      <Sfx name="pop" at={26} volume={0.4} />
      <Sfx name="click" at={62} volume={0.6} />
      <Sfx name="pop" at={64} volume={0.4} />
      <Sfx name="click" at={100} volume={0.6} />
      <Sfx name="pop" at={102} volume={0.4} />
      <Sfx name="riser" at={118} volume={0.5} />
      <Sfx name="ding" at={150} volume={0.7} />
    </AbsoluteFill>
  );
};
