import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./brand";
import { Sfx } from "./Sfx";

// Poses cut from the SecureLogX character sheet by scripts/cut-mascot.py
export type Pose =
  | "angry" | "announce" | "celebrate" | "coffee" | "confused" | "crying" | "dont-know"
  | "explore" | "furious" | "gift" | "hello" | "idea" | "inspect" | "laptop" | "launch"
  | "pointing" | "presenting" | "protect" | "reading" | "relax" | "rushing" | "sad"
  | "secure" | "solution" | "solve-problem" | "tablet" | "thanks" | "thinking"
  | "thumbs-up" | "tired" | "very-happy" | "world" | "worried" | "writing" | "yawning";

// The character, animated: springs in, bobs while idle, squashes on every pose change.
// `poses` lists which pose starts at which frame of the current scene; x/y place a
// box (1.1 × height wide) and each pose stands centred on its bottom edge.
export const Mascot: React.FC<{
  readonly poses: readonly { readonly at: number; readonly pose: Pose }[];
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly exitAt: number | null;
  readonly glow: boolean;
}> = ({ poses, x, y, height, exitAt, glow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = poses[0].at;
  const current = poses.reduce((acc, p, i) => (frame >= p.at ? i : acc), 0);
  const since = frame - poses[current].at;

  const enter = spring({ frame: frame - start, fps, config: { damping: 11, mass: 0.6 } });
  const exit = exitAt === null ? 1 : interpolate(frame, [exitAt, exitAt + 8], [1, 0], clamp);
  // squash & stretch right after each pose change
  const squash = current === 0 ? 0 : interpolate(since, [0, 4, 10], [0.14, -0.06, 0], clamp);
  const bob = Math.sin((frame - start) / 7) * 7;
  const sway =
    poses[current].pose === "hello"
      ? Math.sin(frame / 3.5) * 5
      : Math.sin((frame - start) / 11) * 1.8;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: height * 1.1,
        height,
        opacity: frame < start ? 0 : exit,
        translate: `0px ${bob + (1 - enter) * 160}px`,
        scale: `${enter * exit * (1 + squash)} ${enter * exit * (1 - squash)}`,
        rotate: `${sway}deg`,
        transformOrigin: "50% 100%",
        filter: glow
          ? "drop-shadow(0 0 22px rgba(255,255,255,0.35))"
          : "drop-shadow(0 22px 26px rgba(0,0,0,0.18))",
      }}
    >
      {poses.map((p, i) => (
        <Img
          key={p.pose + p.at}
          src={staticFile(`mascot/${p.pose}.png`)}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            translate: "-50% 0px",
            maxWidth: "none",
            height,
            width: "auto",
            display: "block",
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      {poses.slice(1).map((p) => (
        <Sfx key={p.at} name="pop" at={p.at} volume={0.35} />
      ))}
    </div>
  );
};
