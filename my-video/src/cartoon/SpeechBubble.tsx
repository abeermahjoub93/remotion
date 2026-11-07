import { Audio } from "@remotion/media";
import { Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, C, EN, clamp } from "../brand";

// How long the character "speaks" a line: words appear one by one, babble plays meanwhile.
export const talkFrames = (ar: string) => Math.min(70, 10 + ar.split(" ").length * 6);

// Speech bubble for the character: Arabic line typed word by word, English under it,
// tail pointing down at the speaker. Plays the cartoon voice while the words appear.
export const SpeechBubble: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly ar: string;
  readonly en: string;
  readonly tailX: number; // tail position, 0..1 along the bubble
  readonly top: number;
  readonly arSize: number;
}> = ({ from, to, ar, en, tailX, top, arSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from - 1 || frame > to + 8) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6 } });
  const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
  const words = ar.split(" ");
  const talk = talkFrames(ar);
  const shown = Math.ceil(interpolate(frame, [from + 2, from + 2 + talk], [0, words.length], clamp));
  const enIn = interpolate(frame, [from + talk * 0.6, from + talk * 0.6 + 10], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        opacity: Math.min(1, s * 1.4) * out,
        scale: `${0.6 + 0.4 * s}`,
        transformOrigin: `${tailX * 100}% 120%`,
      }}
    >
      <div
        style={{
          position: "relative",
          background: C.white,
          borderRadius: 40,
          padding: "30px 40px 26px",
          boxShadow: "0 18px 44px rgba(0,0,0,0.14)",
          border: `4px solid ${C.green}`,
          textAlign: "center",
        }}
      >
        <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: arSize, lineHeight: 1.45, color: C.ink }}>
          {words.map((w, i) => (
            <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>
              {w}{" "}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: EN, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: C.slate, opacity: enIn }}>
          {en}
        </div>
        {/* tail */}
        <div
          style={{
            position: "absolute",
            left: `${tailX * 100}%`,
            bottom: -26,
            width: 46,
            height: 46,
            translate: "-50% 0px",
            rotate: "45deg",
            background: C.white,
            borderRight: `4px solid ${C.green}`,
            borderBottom: `4px solid ${C.green}`,
            borderBottomRightRadius: 8,
          }}
        />
      </div>
      <Sequence from={from + 2} durationInFrames={talk} name="voice" layout="none">
        <Audio src={staticFile("sfx/babble.wav")} volume={0.55} trimBefore={(from * 7) % 120} />
      </Sequence>
    </div>
  );
};
