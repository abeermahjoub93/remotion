import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, Header, clamp, easeOut, useEnter } from "../brand";
import { Sfx } from "../Sfx";

const Chip: React.FC<{
  readonly ar: string;
  readonly en: string;
  readonly at: number;
  readonly yes: boolean;
  readonly strikeAt?: number;
}> = ({ ar, en, at, yes, strikeAt = 0 }) => {
  const frame = useCurrentFrame();
  const s = useEnter(at, 12);
  const strike = yes
    ? 0
    : interpolate(frame, [strikeAt, strikeAt + 10], [0, 1], {
        ...clamp,
        easing: easeOut,
      });
  return (
    <div
      style={{
        position: "relative",
        width: 880,
        display: "flex",
        alignItems: "center",
        gap: 28,
        direction: "rtl",
        background: C.white,
        borderRadius: 28,
        padding: "26px 36px",
        boxShadow: "0 14px 36px rgba(0,0,0,0.08)",
        opacity: s,
        translate: `${(1 - s) * -120}px 0px`,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 20,
          flexShrink: 0,
          background: yes ? C.green : strike > 0.5 ? C.critical : C.mist,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
          {yes ? (
            <path d="M5 12.5l4.5 4.5L19 7" stroke={C.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M6 6l12 12M18 6L6 18" stroke={C.white} strokeWidth={3} strokeLinecap="round" />
          )}
        </svg>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 58, color: C.ink }}>
          {ar}
        </div>
        <div style={{ fontFamily: EN, fontWeight: 500, fontSize: 32, color: C.slate, direction: "ltr", textAlign: "right" }}>
          {en}
        </div>
        <div
          style={{
            position: "absolute",
            right: -10,
            top: "38%",
            height: 8,
            width: "calc(100% + 20px)",
            background: C.critical,
            borderRadius: 4,
            scale: `${strike} 1`,
            transformOrigin: "right center",
          }}
        />
      </div>
    </div>
  );
};

// "Phishing often works because people are busy or distracted, not because they are unintelligent."
export const CoreMessageScene: React.FC = () => {
  const t = useEnter(6);
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
          opacity: t,
          translate: `0px ${(1 - t) * 40}px`,
        }}
      >
        <div
          style={{
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 78,
            lineHeight: 1.4,
            color: C.green,
          }}
        >
          التصيّد ينجح كثيراً لأننا…
        </div>
        <div style={{ marginTop: 12, fontFamily: EN, fontWeight: 500, fontSize: 40, color: C.slate }}>
          Phishing often works because people are…
        </div>
        <div style={{ margin: "34px auto 0", width: 120, height: 4, background: C.gold, borderRadius: 2 }} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 680,
          left: 100,
          right: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <Chip ar="مستعجلين" en="Busy" at={28} yes />
        <Chip ar="مشتتين" en="Distracted" at={46} yes />
        <Chip ar="أغبياء" en="Unintelligent" at={70} yes={false} strikeAt={92} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: useEnter(100),
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 64, color: C.ink }}>
          مو لأننا أغبياء.
        </div>
        <div style={{ marginTop: 8, fontFamily: EN, fontWeight: 500, fontSize: 38, color: C.slate }}>
          Not because we’re unintelligent.
        </div>
      </div>

      <Sfx name="whoosh" at={4} volume={0.45} />
      <Sfx name="pop" at={28} volume={0.5} />
      <Sfx name="pop" at={46} volume={0.5} />
      <Sfx name="pop" at={70} volume={0.5} />
      <Sfx name="swish" at={90} volume={0.6} />
      <Sfx name="alert" at={94} volume={0.25} />
    </AbsoluteFill>
  );
};
