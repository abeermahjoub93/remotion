import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AR,
  Background,
  C,
  EN,
  Header,
  Mark,
  clamp,
  enterAt,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

const PASSWORD = "Riyadh@2024";
const TYPE_START = 46;
const VERDICT = 140;

const RULES = [
  { ar: "حرف كبير", en: "Uppercase", at: 92 },
  { ar: "رقم", en: "Number", at: 102 },
  { ar: "رمز", en: "Symbol", at: 112 },
];

// "Your password may be easier to guess than you think."
export const PwHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The intro clip ends on a full SX-green frame; peel that green away diagonally.
  const wipe = interpolate(frame, [0, 20], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.6, 0, 0.3, 1),
  });

  const title = useEnter(14);
  const field = useEnter(34);
  const typed = Math.floor(
    interpolate(frame, [TYPE_START, TYPE_START + 36], [0, PASSWORD.length], clamp),
  );
  const reveal = frame >= 76; // eye toggled: show the plain text
  const fake = interpolate(frame, [92, 122], [0, 0.82], clamp); // looks "strong"
  const bad = frame >= VERDICT;
  const meter = bad
    ? interpolate(frame, [VERDICT, VERDICT + 8], [0.82, 0.18], clamp)
    : fake;
  const shake = frame > VERDICT && frame < VERDICT + 14 ? Math.sin(frame * 2.6) * 10 : 0;
  const verdict = useEnter(VERDICT + 4, 11);

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <Background />
      <Header start={10} />

      <div
        style={{
          position: "absolute",
          top: 330,
          left: 70,
          right: 70,
          textAlign: "center",
          opacity: title,
          translate: `0px ${(1 - title) * 50}px`,
          isolation: "isolate",
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1.45,
            color: C.ink,
          }}
        >
          كلمة مرورك ممكن تكون
          <br />
          <Mark
            color={bad ? C.critical : C.green}
            progress={interpolate(frame, [24, 38], [0, 1], clamp)}
          >
            أسهل مما تتوقع.
          </Mark>
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 42,
            color: C.slate,
          }}
        >
          Your password may be easier to guess than you think.
        </div>
      </div>

      {/* password field */}
      <div
        style={{
          position: "absolute",
          top: 900,
          left: 110,
          right: 110,
          opacity: field,
          translate: `${shake}px ${(1 - field) * 80}px`,
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 700,
            fontSize: 32,
            color: C.slate,
            marginBottom: 14,
          }}
        >
          كلمة المرور
        </div>
        <div
          style={{
            height: 128,
            borderRadius: 26,
            background: C.white,
            border: `4px solid ${bad ? C.critical : C.green}`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            padding: "0 36px",
            gap: 20,
          }}
        >
          <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={C.slate} strokeWidth={2} strokeLinecap="round">
            <rect x={5} y={11} width={14} height={10} rx={2} />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <div
            style={{
              flex: 1,
              fontFamily: EN,
              fontWeight: 600,
              fontSize: 58,
              letterSpacing: reveal ? "0.04em" : "0.25em",
              color: C.ink,
            }}
          >
            {reveal ? PASSWORD.slice(0, typed) : "•".repeat(typed)}
            <span
              style={{
                opacity: frame < 90 && Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                color: C.green,
              }}
            >
              |
            </span>
          </div>
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={reveal ? C.green : C.slate} strokeWidth={2} strokeLinecap="round">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx={12} cy={12} r={3} />
          </svg>
        </div>

        {/* strength meter */}
        <div
          style={{
            marginTop: 26,
            height: 18,
            borderRadius: 9,
            background: C.mist,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${meter * 100}%`,
              height: "100%",
              borderRadius: 9,
              background: bad ? C.critical : C.compliant,
            }}
          />
        </div>

        {/* rule checklist */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            gap: 20,
            direction: "rtl",
          }}
        >
          {RULES.map((r) => {
            const s = enterAt(frame, fps, r.at, 10);
            return (
              <div
                key={r.en}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: C.white,
                  border: `2px solid ${C.mist}`,
                  opacity: s * (bad ? 0.45 : 1),
                  scale: `${0.7 + 0.3 * s}`,
                  fontFamily: AR,
                  fontWeight: 700,
                  fontSize: 30,
                  color: C.ink,
                }}
              >
                <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                  <circle cx={12} cy={12} r={11} fill={C.compliant} />
                  <path d="M7 12.5l3.2 3.2L17 9" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {r.ar}
                <span style={{ fontFamily: EN, fontWeight: 500, fontSize: 24, color: C.slate }}>
                  {r.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* verdict */}
      <div
        style={{
          position: "absolute",
          top: 1430,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: bad ? verdict : 0,
          scale: `${0.6 + 0.4 * verdict}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            direction: "rtl",
            background: C.critical,
            color: C.white,
            borderRadius: 26,
            padding: "24px 40px",
            boxShadow: "0 18px 40px rgba(180,35,24,0.3)",
          }}
        >
          <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l10 18H2z" />
            <path d="M12 10v5M12 18h.01" />
          </svg>
          <div>
            <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 50 }}>
              نمط متوقَّع وسهل التخمين
            </div>
            <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 30, opacity: 0.9 }}>
              City + @ + year: a predictable pattern
            </div>
          </div>
        </div>
      </div>

      {/* green panel from the intro, sliding off along the same diagonal */}
      <AbsoluteFill
        style={{
          background: C.green,
          clipPath: `polygon(0 -60%, 100% -60%, 100% ${
            120 - wipe * 165
          }%, 0 ${140 - wipe * 165}%)`,
        }}
      />

      <Sfx name="whoosh" at={0} volume={0.6} />
      <Sfx name="pop" at={12} volume={0.5} />
      <Sfx name="swish" at={26} volume={0.5} />
      <Sfx name="pop" at={36} volume={0.4} />
      <Sfx name="typing" at={TYPE_START} volume={0.7} />
      <Sfx name="click" at={76} volume={0.5} />
      <Sfx name="pop" at={92} volume={0.45} />
      <Sfx name="pop" at={102} volume={0.45} />
      <Sfx name="pop" at={112} volume={0.45} />
      <Sfx name="glitch" at={VERDICT} volume={0.6} />
      <Sfx name="alert" at={VERDICT + 2} volume={0.55} />
    </AbsoluteFill>
  );
};
