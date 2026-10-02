import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, Logo, ShieldIcon, clamp, easeOut, useEnter } from "../brand";
import { Sfx } from "../Sfx";

// End card: tagline, website and handles (Brand Guidelines, section 2 and 10)
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shield = useEnter(4, 11);
  const logoReveal = interpolate(frame, [12, 30], [0, 100], { ...clamp, easing: easeOut });
  const tag = useEnter(30);
  const site = useEnter(44, 12);
  const social = useEnter(56);

  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ scale: `${shield}`, rotate: `${(1 - shield) * -30}deg` }}>
          <ShieldIcon size={170} />
        </div>
        <div style={{ marginTop: 44, clipPath: `inset(0 ${100 - logoReveal}% 0 0)` }}>
          <Logo width={780} />
        </div>
        <div
          style={{
            marginTop: 40,
            height: 6,
            borderRadius: 3,
            background: C.gold,
            width: interpolate(frame, [26, 40], [0, 120], { ...clamp, easing: easeOut }),
          }}
        />
        <div style={{ marginTop: 40, textAlign: "center", opacity: tag, translate: `0px ${(1 - tag) * 30}px` }}>
          <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 64, lineHeight: 1.45, color: C.green }}>
            أمن تقدر تقوّيه،
            <br />
            والتزام تقدر تثبته
          </div>
          <div style={{ marginTop: 12, fontFamily: EN, fontWeight: 500, fontSize: 36, color: C.slate }}>
            Security you can strengthen. Compliance you can prove.
          </div>
        </div>
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: C.green,
            color: C.white,
            borderRadius: 999,
            padding: "24px 60px",
            fontFamily: EN,
            fontWeight: 600,
            fontSize: 52,
            scale: `${site}`,
            boxShadow: "0 18px 40px rgba(0,77,38,0.3)",
          }}
        >
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2}>
            <circle cx={12} cy={12} r={9} />
            <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
          </svg>
          www.sx.sa
        </div>
        <div style={{ marginTop: 34, fontFamily: EN, fontSize: 36, color: C.slate, opacity: social }}>
          <b style={{ color: C.ink, fontWeight: 600 }}>@securelogx</b> · LinkedIn · X · Instagram
        </div>
        <div
          style={{
            marginTop: 26,
            background: C.white,
            borderRadius: 999,
            padding: "12px 30px",
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 700,
            fontSize: 32,
            color: C.green,
            opacity: social,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          #حصّن_نفسك_رقمياً
        </div>
      </div>
      <Sfx name="whoosh" at={2} volume={0.5} />
      <Sfx name="thud" at={6} volume={0.6} />
      <Sfx name="swish" at={14} volume={0.45} />
      <Sfx name="pop" at={44} volume={0.5} />
      <Sfx name="ding" at={46} volume={0.4} />
    </AbsoluteFill>
  );
};
