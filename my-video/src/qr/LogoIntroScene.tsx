import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AR, Background, C, EN_HEAD, Logo, clamp, easeOut, useEnter } from "../brand";
import { Sfx } from "../Sfx";

const ZOOM = 74; // the SX tile grows to fill the frame with SX green

// Motion-graphics opener built from the official SX app icon and wordmark
export const LogoIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tile = useEnter(4, 11);
  const word = interpolate(frame, [20, 40], [0, 100], { ...clamp, easing: easeOut });
  const rule = interpolate(frame, [34, 48], [0, 220], { ...clamp, easing: easeOut });
  const tag = useEnter(42);
  const lockupOut = interpolate(frame, [ZOOM - 8, ZOOM], [1, 0], clamp);
  const zoom = interpolate(frame, [ZOOM, ZOOM + 22], [1, 26], {
    ...clamp,
    easing: (t) => t * t * t,
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* wordmark, gold rule and campaign line */}
      <div
        style={{
          position: "absolute",
          top: 1050,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: lockupOut,
        }}
      >
        <div style={{ clipPath: `inset(0 ${100 - word}% 0 0)` }}>
          <Logo width={760} />
        </div>
        <div style={{ marginTop: 40, width: rule, height: 5, borderRadius: 3, background: C.gold }} />
        <div
          style={{
            marginTop: 36,
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 64,
            color: C.green,
            opacity: tag,
            translate: `0px ${(1 - tag) * 24}px`,
          }}
        >
          حصّن نفسك رقمياً
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: EN_HEAD,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: "0.2em",
            color: C.slate,
            opacity: tag,
          }}
        >
          PROTECT YOURSELF DIGITALLY
        </div>
      </div>

      {/* SX app icon: green rounded tile (radius 12% of width) */}
      <div
        style={{
          position: "absolute",
          left: 540 - 160,
          top: 640 - 160,
          width: 320,
          height: 320,
          borderRadius: 320 * 0.12,
          background: C.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: frame < ZOOM ? "0 30px 70px rgba(0,77,38,0.30)" : "none",
          scale: `${tile * zoom}`,
          rotate: `${(1 - tile) * -90}deg`,
        }}
      >
        <Img
          src={staticFile("img/sx-white.png")}
          style={{
            width: 220,
            opacity: interpolate(frame, [ZOOM, ZOOM + 6], [1, 0], clamp),
            clipPath: `inset(0 ${interpolate(frame, [8, 22], [100, 0], { ...clamp, easing: easeOut })}% 0 0)`,
          }}
        />
      </div>

      <Sfx name="riser" at={0} volume={0.35} />
      <Sfx name="thud" at={6} />
      <Sfx name="swish" at={12} volume={0.5} />
      <Sfx name="whoosh" at={22} volume={0.45} />
      <Sfx name="ding" at={44} volume={0.45} />
      <Sfx name="whoosh" at={ZOOM} volume={0.6} />
    </AbsoluteFill>
  );
};
