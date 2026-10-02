import { AbsoluteFill, useVideoConfig, interpolate, useCurrentFrame } from "remotion";
import {
  AR,
  Background,
  C,
  Cursor,
  EN,
  FlagIcon,
  Header,
  clamp,
  easeOut,
  enterAt,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

const OPTIONS = [
  { ar: "المرسل؟", en: "Sender", at: 26 },
  { ar: "الاستعجال؟", en: "Urgency", at: 34 },
  { ar: "الرابط؟", en: "Link", at: 42 },
];

// "Which clue makes you stop first: sender, urgency or link?"
export const EngageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = useEnter(4);
  const comment = useEnter(104);
  // cursor hovers over each option in turn
  const hoverIdx = frame < 60 ? -1 : frame < 74 ? 0 : frame < 88 ? 1 : frame < 104 ? 2 : -1;
  const cy = interpolate(frame, [52, 62, 74, 80, 88, 94], [1250, 760, 760, 940, 940, 1120], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <Background />
      <Header />
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: q,
          translate: `0px ${(1 - q) * 40}px`,
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 92, color: C.ink, lineHeight: 1.35 }}>
          أي علامة <span style={{ color: C.green }}>توقفك أول؟</span>
        </div>
        <div style={{ marginTop: 12, fontFamily: EN, fontWeight: 500, fontSize: 42, color: C.slate }}>
          Which clue makes you stop first?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 700,
          left: 140,
          right: 140,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {OPTIONS.map((o, i) => {
          const s = enterAt(frame, fps, o.at, 12);
          const on = hoverIdx === i;
          return (
            <div
              key={o.en}
              style={{
                height: 150,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 40px",
                direction: "rtl",
                borderRadius: 34,
                background: on ? C.green : C.white,
                color: on ? C.white : C.ink,
                border: `4px solid ${on ? C.green : C.mist}`,
                boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
                opacity: s,
                scale: `${(0.8 + 0.2 * s) * (on ? 1.03 : 1)}`,
              }}
            >
              <FlagIcon size={58} color={on ? C.white : C.critical} />
              <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 62 }}>{o.ar}</span>
              <span
                style={{
                  marginRight: "auto",
                  fontFamily: EN,
                  fontWeight: 500,
                  fontSize: 38,
                  color: on ? C.gold : C.slate,
                }}
              >
                {o.en}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 760,
          top: cy,
          opacity: interpolate(frame, [50, 56, 104, 110], [0, 1, 1, 0], clamp),
        }}
      >
        <Cursor size={84} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: comment,
          translate: `0px ${(1 - comment) * 40}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            direction: "rtl",
            background: C.ink,
            color: C.white,
            borderRadius: 999,
            padding: "24px 44px",
            fontFamily: AR,
            fontWeight: 700,
            fontSize: 46,
          }}
        >
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5h16v11H9l-5 4z"
              stroke={C.gold}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
          اكتب جوابك في التعليقات
          <span style={{ fontFamily: EN, fontWeight: 500, fontSize: 34, color: C.gold }}>
            Comment below
          </span>
        </div>
      </div>

      <Sfx name="whoosh" at={2} volume={0.45} />
      <Sfx name="pop" at={26} volume={0.5} />
      <Sfx name="pop" at={34} volume={0.5} />
      <Sfx name="pop" at={42} volume={0.5} />
      <Sfx name="click" at={62} volume={0.5} />
      <Sfx name="click" at={80} volume={0.5} />
      <Sfx name="click" at={94} volume={0.5} />
      <Sfx name="typing" at={106} volume={0.5} />
      <Sfx name="notify" at={110} volume={0.4} />
    </AbsoluteFill>
  );
};
