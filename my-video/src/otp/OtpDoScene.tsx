import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Header, clamp, enterAt, useEnter } from "../brand";
import { Sfx } from "../Sfx";

const line = {
  fill: "none",
  stroke: C.white,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Step: React.FC<{
  readonly n: string;
  readonly ar: string;
  readonly en: string;
  readonly at: number;
  readonly icon: React.ReactNode;
  readonly children?: React.ReactNode;
}> = ({ n, ar, en, at, icon, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at, 13);
  const active = interpolate(frame, [at, at + 8, at + 50, at + 58], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        width: 920,
        direction: "rtl",
        background: C.white,
        borderRadius: 30,
        padding: "26px 32px",
        boxShadow: `0 14px 36px rgba(0,0,0,0.08), 0 0 0 ${active * 5}px ${C.green}`,
        opacity: s,
        translate: `${(1 - s) * -140}px 0px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 96, height: 96, borderRadius: 24, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={54} height={54} viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 46, lineHeight: 1.35, color: C.ink }}>{ar}</div>
          <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 30, color: C.slate, direction: "ltr", textAlign: "right" }}>{en}</div>
        </div>
        <div style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 60, color: C.gold }}>{n}</div>
      </div>
      {children ? (
        <div style={{ opacity: interpolate(frame, [at + 14, at + 24], [0, 1], clamp) }}>{children}</div>
      ) : null}
    </div>
  );
};

// "Access the account through the official channel, review activity and follow the service or
// organization's process if you suspect unauthorized access."
export const OtpDoScene: React.FC = () => {
  const title = useEnter(4);
  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div style={{ position: "absolute", top: 280, left: 80, right: 80, textAlign: "center", opacity: title, translate: `0px ${(1 - title) * 30}px` }}>
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 80, color: C.green }}>بدلاً من كذا</div>
        <div style={{ fontFamily: EN_HEAD, fontWeight: 600, fontSize: 40, letterSpacing: "0.08em", color: C.slate }}>INSTEAD</div>
        <div style={{ margin: "22px auto 0", width: 120, height: 4, background: C.gold, borderRadius: 2 }} />
      </div>

      <div style={{ position: "absolute", top: 540, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Step
          n="01"
          ar="ادخل للحساب من القناة الرسمية"
          en="Access the account through the official channel"
          at={22}
          icon={
            <>
              <rect {...line} x={7} y={2} width={10} height={20} rx={2} />
              <path {...line} d="M11 18h2" />
            </>
          }
        />
        <Step
          n="02"
          ar="راجع النشاط"
          en="Review activity"
          at={80}
          icon={
            <>
              <path {...line} d="M4 6h16M4 12h10M4 18h7" />
              <circle {...line} cx={17} cy={16} r={3} />
              <path {...line} d="M19.2 18.2L21 20" />
            </>
          }
        >
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(180,35,24,0.08)",
              border: `2px solid ${C.critical}`,
              borderRadius: 18,
              padding: "14px 22px",
              fontFamily: AR,
              fontWeight: 700,
              fontSize: 30,
              color: C.ink,
            }}
          >
            <span>
              <span style={{ color: C.critical }}>●</span> محاولة دخول · جهاز غير معروف
            </span>
            <span style={{ fontFamily: EN, fontWeight: 500, color: C.slate }}>2:13 AM</span>
          </div>
        </Step>
        <Step
          n="03"
          ar="اتبع إجراءات الخدمة أو المنشأة"
          en="Follow the service or organization’s process"
          at={150}
          icon={
            <>
              <path {...line} d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
              <path {...line} d="M8.5 12l2.5 2.5L16 9.5" />
            </>
          }
        >
          <div style={{ marginTop: 12, fontFamily: AR, fontWeight: 700, fontSize: 30, color: C.slate }}>
            إذا شكّيت بمحاولة دخول
            <span style={{ fontFamily: EN, fontWeight: 500, fontSize: 26 }}> · if you suspect unauthorized access</span>
          </div>
        </Step>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="click" at={22} volume={0.6} />
      <Sfx name="pop" at={32} volume={0.4} />
      <Sfx name="click" at={80} volume={0.6} />
      <Sfx name="scan" at={94} volume={0.45} />
      <Sfx name="alert" at={100} volume={0.25} />
      <Sfx name="click" at={150} volume={0.6} />
      <Sfx name="success" at={170} volume={0.5} />
    </AbsoluteFill>
  );
};
