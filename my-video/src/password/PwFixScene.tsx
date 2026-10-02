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

const Item: React.FC<{
  readonly n: string;
  readonly ar: string;
  readonly en: string;
  readonly at: number;
  readonly icon: React.ReactNode;
  readonly extra: React.ReactNode;
}> = ({ n, ar, en, at, icon, extra }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterAt(frame, fps, at, 13);
  const active = interpolate(frame, [at, at + 8, at + 34, at + 42], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        width: 920,
        display: "flex",
        alignItems: "center",
        gap: 26,
        direction: "rtl",
        background: C.white,
        borderRadius: 30,
        padding: "24px 32px",
        boxShadow: `0 14px 36px rgba(0,0,0,0.08), 0 0 0 ${active * 5}px ${C.green}`,
        opacity: s,
        translate: `${(1 - s) * -140}px 0px`,
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
        <svg width={54} height={54} viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 46, color: C.ink }}>{ar}</div>
        <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 32, color: C.slate, direction: "ltr", textAlign: "right" }}>
          {en}
        </div>
      </div>
      <div style={{ opacity: interpolate(frame, [at + 10, at + 20], [0, 1], clamp) }}>{extra}</div>
      <div style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 60, color: C.gold }}>{n}</div>
    </div>
  );
};

const Tag: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: EN,
      fontWeight: 600,
      fontSize: 22,
      color: C.green,
      background: "rgba(0,107,53,0.08)",
      borderRadius: 12,
      padding: "8px 14px",
      direction: "ltr",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

// "Focus on unique passwords, an appropriate password manager, MFA and recovery settings."
export const PwFixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useEnter(4);
  const code = Math.floor(interpolate(frame, [120, 150], [0, 6], clamp));
  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: title,
          translate: `0px ${(1 - title) * 30}px`,
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 80, color: C.green }}>
          ركّز على
        </div>
        <div style={{ fontFamily: EN_HEAD, fontWeight: 600, fontSize: 40, letterSpacing: "0.08em", color: C.slate }}>
          FOCUS ON
        </div>
        <div style={{ margin: "22px auto 0", width: 120, height: 4, background: C.gold, borderRadius: 2 }} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 560,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <Item
          n="01"
          ar="كلمات مرور فريدة"
          en="Unique passwords"
          at={22}
          icon={
            <>
              <circle {...line} cx={8} cy={15} r={4} />
              <path {...line} d="M11 12l9-9M16 7l3 3" />
            </>
          }
          extra={<Tag>A ≠ B ≠ C</Tag>}
        />
        <Item
          n="02"
          ar="مدير كلمات مرور مناسب"
          en="An appropriate password manager"
          at={62}
          icon={
            <>
              <rect {...line} x={3} y={4} width={18} height={16} rx={3} />
              <circle {...line} cx={12} cy={12} r={4} />
              <path {...line} d="M12 8v1M12 15v1M8 12h1M15 12h1" />
            </>
          }
          extra={null}
        />
        <Item
          n="03"
          ar="MFA"
          en="Multi-factor authentication"
          at={102}
          icon={
            <>
              <rect {...line} x={7} y={2} width={10} height={20} rx={2} />
              <path {...line} d="M11 18h2" />
            </>
          }
          extra={<Tag>{"482915".slice(0, code).padEnd(6, "•")}</Tag>}
        />
        <Item
          n="04"
          ar="إعدادات الاسترداد"
          en="Recovery settings"
          at={142}
          icon={
            <>
              <path {...line} d="M4 12a8 8 0 1 0 2.4-5.7" />
              <path {...line} d="M4 4v4h4" />
              <path {...line} d="M12 8v4l3 2" />
            </>
          }
          extra={<Tag>email · phone</Tag>}
        />
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="click" at={22} volume={0.6} />
      <Sfx name="pop" at={32} volume={0.4} />
      <Sfx name="click" at={62} volume={0.6} />
      <Sfx name="pop" at={72} volume={0.4} />
      <Sfx name="click" at={102} volume={0.6} />
      <Sfx name="typing" at={118} volume={0.4} />
      <Sfx name="click" at={142} volume={0.6} />
      <Sfx name="success" at={160} volume={0.5} />
    </AbsoluteFill>
  );
};
