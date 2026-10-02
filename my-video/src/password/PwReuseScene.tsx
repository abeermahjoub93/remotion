import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AR,
  Background,
  C,
  Caption,
  EN,
  EN_HEAD,
  Header,
  clamp,
  easeOut,
  enterAt,
} from "../brand";
import { Sfx } from "../Sfx";

const HUB = { x: 540, y: 1000 };
const BREACH = 170; // the shopping site leaks
const TO_HUB = BREACH + 24; // the leaked password reaches the shared password
const SPREAD = [TO_HUB + 20, TO_HUB + 44, TO_HUB + 68, TO_HUB + 92];
const MULTIPLY = TO_HUB + 124;

const stroke = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Account icons: 2px line icons, rounded caps (Brand Guidelines, section 7)
const ICONS: Record<string, (c: string) => React.ReactNode> = {
  shop: (c) => (
    <>
      <path {...stroke} stroke={c} d="M5 8h14l-1 12H6z" />
      <path {...stroke} stroke={c} d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  mail: (c) => (
    <>
      <rect {...stroke} stroke={c} x={3} y={5} width={18} height={14} rx={2} />
      <path {...stroke} stroke={c} d="M3 7l9 6 9-6" />
    </>
  ),
  bank: (c) => (
    <>
      <path {...stroke} stroke={c} d="M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18" />
    </>
  ),
  work: (c) => (
    <>
      <rect {...stroke} stroke={c} x={3} y={7} width={18} height={13} rx={2} />
      <path {...stroke} stroke={c} d="M9 7V5h6v2M3 12h18" />
    </>
  ),
  social: (c) => (
    <path {...stroke} stroke={c} d="M4 5h16v11H9l-5 4z" />
  ),
};

// Shopping first (the breach origin), then the accounts it spreads to, in order
const ACCOUNTS = [
  { key: "shop", ar: "التسوق", en: "Shopping", x: 198, y: 860, hit: BREACH },
  { key: "mail", ar: "البريد", en: "Email", x: 540, y: 650, hit: SPREAD[0] },
  { key: "bank", ar: "البنك", en: "Bank", x: 882, y: 860, hit: SPREAD[1] },
  { key: "work", ar: "العمل", en: "Work", x: 752, y: 1260, hit: SPREAD[2] },
  { key: "social", ar: "التواصل", en: "Social", x: 328, y: 1260, hit: SPREAD[3] },
];

// "The problem isn't only a weak password. Reusing the same password across accounts multiplies the risk."
export const PwReuseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hub = enterAt(frame, fps, 40, 12);
  const hubHit = frame >= TO_HUB;
  const exposed = ACCOUNTS.filter((a) => frame >= a.hit).length;
  const counter = enterAt(frame, fps, BREACH + 6, 12);
  const multiply = enterAt(frame, fps, MULTIPLY, 10);

  return (
    <AbsoluteFill>
      <Background />
      <Header />

      <Caption
        start={4}
        end={100}
        top={210}
        arSize={58}
        ar="المشكلة مو بس كلمة مرور ضعيفة."
        en="The problem isn’t only a weak password."
      />
      <Caption
        start={104}
        top={200}
        arSize={50}
        ar={
          <>
            إعادة استخدام نفس الكلمة في أكثر من حساب{" "}
            <span style={{ color: C.critical }}>تضاعف الخطر</span>
          </>
        }
        en="Reusing the same password across accounts multiplies the risk."
      />

      {/* connection lines */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {ACCOUNTS.map((a, i) => {
          const draw = interpolate(frame, [56 + i * 8, 76 + i * 8], [0, 1], {
            ...clamp,
            easing: easeOut,
          });
          // red travels hub → account (or account → hub for the breach origin)
          const isOrigin = i === 0;
          const red = isOrigin
            ? interpolate(frame, [BREACH + 6, TO_HUB], [0, 1], clamp)
            : interpolate(frame, [a.hit - 18, a.hit], [0, 1], clamp);
          const from = isOrigin ? a : HUB;
          const to = isOrigin ? HUB : a;
          const px = from.x + (to.x - from.x) * red;
          const py = from.y + (to.y - from.y) * red;
          return (
            <g key={a.key}>
              <line
                x1={HUB.x}
                y1={HUB.y}
                x2={HUB.x + (a.x - HUB.x) * draw}
                y2={HUB.y + (a.y - HUB.y) * draw}
                stroke={C.green}
                strokeOpacity={0.35}
                strokeWidth={5}
                strokeDasharray="12 12"
              />
              <line
                x1={from.x}
                y1={from.y}
                x2={px}
                y2={py}
                stroke={C.critical}
                strokeWidth={7}
                strokeLinecap="round"
                opacity={red > 0 ? 1 : 0}
              />
              {red > 0 && red < 1 ? (
                <circle cx={px} cy={py} r={16} fill={C.critical} stroke={C.white} strokeWidth={5} />
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* the shared password */}
      <div
        style={{
          position: "absolute",
          left: HUB.x,
          top: HUB.y,
          translate: "-50% -50%",
          scale: `${hub * (hubHit ? 1 + 0.06 * Math.sin(frame / 3) : 1)}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          background: hubHit ? C.critical : C.green,
          color: C.white,
          borderRadius: 30,
          padding: "22px 34px",
          boxShadow: hubHit
            ? "0 0 0 14px rgba(180,35,24,0.15), 0 20px 50px rgba(180,35,24,0.35)"
            : "0 20px 50px rgba(0,77,38,0.35)",
        }}
      >
        <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={8} cy={15} r={4} />
          <path d="M11 12l9-9M16 7l3 3M18 5l2 2" />
        </svg>
        <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 44 }}>Riyadh@2024</div>
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 700, fontSize: 26, opacity: 0.9 }}>
          {hubHit ? "مسرّبة · Leaked" : "نفس الكلمة · Same password"}
        </div>
      </div>

      {/* accounts */}
      {ACCOUNTS.map((a, i) => {
        const s = enterAt(frame, fps, 60 + i * 8, 11);
        const hit = frame >= a.hit;
        const hs = enterAt(frame, fps, a.hit, 9);
        const color = hit ? C.critical : C.green;
        return (
          <div
            key={a.key}
            style={{
              position: "absolute",
              left: a.x,
              top: a.y,
              translate: "-50% -50%",
              width: 228,
              padding: "22px 0 18px",
              borderRadius: 28,
              background: C.white,
              border: `4px solid ${hit ? C.critical : C.white}`,
              boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              scale: `${s * (hit ? 1 + 0.12 * (1 - hs) : 1)}`,
              rotate: hit ? `${Math.sin((frame - a.hit) * 1.4) * 5 * (1 - hs)}deg` : "0deg",
            }}
          >
            <svg width={60} height={60} viewBox="0 0 24 24">
              {ICONS[a.key](color)}
            </svg>
            <div style={{ marginTop: 6, direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 36, color: C.ink }}>
              {a.ar}
            </div>
            <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 24, color: C.slate }}>{a.en}</div>
            {/* lock badge */}
            <div
              style={{
                position: "absolute",
                top: -22,
                right: -18,
                width: 60,
                height: 60,
                borderRadius: 99,
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `4px solid ${C.white}`,
              }}
            >
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.4} strokeLinecap="round">
                <rect x={5} y={11} width={14} height={10} rx={2} />
                <path d={hit ? "M8 11V7a4 4 0 0 1 7.5-2" : "M8 11V8a4 4 0 0 1 8 0v3"} />
              </svg>
            </div>
            {i === 0 && hit ? (
              <div
                style={{
                  position: "absolute",
                  bottom: -34,
                  background: C.critical,
                  color: C.white,
                  borderRadius: 999,
                  padding: "6px 18px",
                  direction: "rtl",
                  fontFamily: AR,
                  fontWeight: 800,
                  fontSize: 24,
                  whiteSpace: "nowrap",
                  scale: `${hs}`,
                }}
              >
                تسريب · Breach
              </div>
            ) : null}
          </div>
        );
      })}

      {/* exposed counter */}
      <div
        style={{
          position: "absolute",
          top: 1420,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: counter,
          translate: `0px ${(1 - counter) * 40}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            direction: "rtl",
            background: C.ink,
            borderRadius: 30,
            padding: "22px 40px",
          }}
        >
          <div style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 92, color: C.critical, lineHeight: 1 }}>
            {exposed}
            <span style={{ color: C.gold, fontSize: 56 }}> / 5</span>
          </div>
          <div>
            <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 40, color: C.white }}>حسابات مكشوفة</div>
            <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 28, color: C.gold }}>
              Accounts exposed by one leak
            </div>
          </div>
        </div>
      </div>

      {/* ×5 */}
      <div
        style={{
          position: "absolute",
          top: 1590,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: multiply,
          scale: `${0.5 + 0.5 * multiply}`,
          direction: "rtl",
          fontFamily: AR,
          fontWeight: 800,
          fontSize: 56,
          color: C.critical,
        }}
      >
        تسريب واحد = خطر <span style={{ unicodeBidi: "isolate", direction: "ltr" }}>×5</span>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="pop" at={40} volume={0.5} />
      <Sfx name="pop" at={60} volume={0.35} />
      <Sfx name="pop" at={68} volume={0.35} />
      <Sfx name="pop" at={76} volume={0.35} />
      <Sfx name="pop" at={84} volume={0.35} />
      <Sfx name="pop" at={92} volume={0.35} />
      <Sfx name="swish" at={100} volume={0.4} />
      <Sfx name="glitch" at={BREACH - 2} volume={0.6} />
      <Sfx name="alert" at={BREACH} volume={0.6} />
      <Sfx name="scan" at={BREACH + 6} volume={0.6} />
      <Sfx name="thud" at={TO_HUB} />
      <Sfx name="stamp" at={SPREAD[0]} volume={0.6} />
      <Sfx name="stamp" at={SPREAD[1]} volume={0.6} />
      <Sfx name="stamp" at={SPREAD[2]} volume={0.6} />
      <Sfx name="stamp" at={SPREAD[3]} volume={0.6} />
      <Sfx name="riser" at={MULTIPLY - 30} volume={0.4} />
      <Sfx name="thud" at={MULTIPLY} />
    </AbsoluteFill>
  );
};
