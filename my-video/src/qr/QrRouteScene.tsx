import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, Caption, EN, Header, clamp, easeOut, enterAt, useEnter } from "../brand";
import { Sfx } from "../Sfx";
import { QrCode } from "./QrCode";

const ASK = 104;

const Dest: React.FC<{ readonly ar: string; readonly en: string; readonly at: number; readonly icon: React.ReactNode }> = ({ ar, en, at, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at, 12);
  return (
    <div
      style={{
        width: 380,
        padding: "30px 0 26px",
        borderRadius: 30,
        background: C.white,
        boxShadow: "0 18px 44px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: s,
        scale: `${0.7 + 0.3 * s}`,
      }}
    >
      <div style={{ width: 96, height: 96, borderRadius: 24, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 44, color: C.ink }}>{ar}</div>
      <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 30, color: C.slate }}>{en}</div>
    </div>
  );
};

// "A QR code is simply a route to another destination. Before logging in or paying, ask:"
export const QrRouteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const qr = useEnter(10, 12);
  const route = interpolate(frame, [24, 54], [0, 1], { ...clamp, easing: easeOut });
  const dot = interpolate(frame, [40, 70], [0, 1], { ...clamp, easing: easeOut });
  // simple fork: QR → split → two destinations
  const pts = [
    [540, 900],
    [540, 990],
  ];

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <Caption start={4} end={ASK} top={210} arSize={58} ar="رمز QR مجرد طريق لمكان آخر." en="A QR code is simply a route to another destination." />
      <Caption
        start={ASK + 4}
        top={210}
        arSize={58}
        ar={
          <>
            قبل <span style={{ color: C.green }}>تسجيل الدخول</span> أو <span style={{ color: C.green }}>الدفع</span>، اسأل:
          </>
        }
        en="Before logging in or paying, ask:"
      />

      <div style={{ position: "absolute", top: 560, left: 540 - 170, scale: `${qr}` }}>
        <div style={{ padding: 20, borderRadius: 30, background: C.white, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
          <QrCode size={300} />
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[290, 790].map((x) => {
          const d = `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} Q ${x} ${pts[1][1]} ${x} 1110`;
          return (
            <g key={x}>
              <path d={d} fill="none" stroke={C.green} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${route} 1`} />
              <path d={d} fill="none" stroke={C.green} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`0.04 1`} strokeDashoffset={-dot * 0.96} opacity={dot > 0 && dot < 1 ? 1 : 0} />
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", top: 1120, left: 80, right: 80, display: "flex", justifyContent: "space-between", direction: "rtl" }}>
        <Dest
          ar="تسجيل دخول"
          en="Log in"
          at={58}
          icon={
            <>
              <rect x={5} y={11} width={14} height={10} rx={2} />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </>
          }
        />
        <Dest
          ar="دفع"
          en="Payment"
          at={66}
          icon={
            <>
              <rect x={3} y={6} width={18} height={13} rx={2} />
              <path d="M3 10h18M7 15h4" />
            </>
          }
        />
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="pop" at={10} volume={0.5} />
      <Sfx name="swish" at={26} volume={0.45} />
      <Sfx name="pop" at={58} volume={0.45} />
      <Sfx name="pop" at={66} volume={0.45} />
      <Sfx name="swish" at={ASK} volume={0.45} />
      <Sfx name="tick" at={ASK + 10} volume={0.6} />
    </AbsoluteFill>
  );
};
