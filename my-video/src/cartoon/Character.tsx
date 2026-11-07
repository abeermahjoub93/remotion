import type React from "react";

// Vector rig of the SecureLogX character, drawn from the character sheet:
// round green hood, big white face, two black eyes, soft vinyl-toy body.
// Everything is driven by props so scenes can animate it frame by frame.

export type Mood = "neutral" | "happy" | "worried" | "surprised";
export type Hold = "none" | "phone" | "magnifier" | "shield";

export type Rig = {
  // arm angles in degrees, 0 = hanging down, positive = raised outward
  readonly armL: number;
  readonly armR: number;
  // leg swing in degrees (walk cycle)
  readonly legL: number;
  readonly legR: number;
  // head tilt in degrees
  readonly tilt: number;
  // 0 = closed, 1 = wide open (talking)
  readonly mouth: number;
  // 0 = open eyes, 1 = closed
  readonly blink: number;
  // pupil offset, -1..1
  readonly lookX: number;
  readonly lookY: number;
  readonly mood: Mood;
  readonly hold: Hold;
  // what the right hand holds
  readonly squash: number;
};

export const REST: Rig = {
  armL: 8,
  armR: 8,
  legL: 0,
  legR: 0,
  tilt: 0,
  mouth: 0,
  blink: 0,
  lookX: 0,
  lookY: 0,
  mood: "neutral",
  hold: "none",
  squash: 0,
};

// periodic blink: closed for a few frames every ~3 s
export const blinkAt = (frame: number, offset = 0) => {
  const t = (frame + offset) % 97;
  return t < 2 ? t / 2 : t < 5 ? 1 - (t - 2) / 3 : 0;
};

// mouth flaps while a line is being spoken
export const mouthAt = (frame: number, lines: readonly (readonly [number, number])[]) => {
  const speaking = lines.some(([a, b]) => frame >= a && frame < b);
  if (!speaking) return 0;
  const v = Math.abs(Math.sin(frame * 0.95)) * 0.7 + Math.abs(Math.sin(frame * 0.33)) * 0.3;
  return Math.min(1, v);
};

// walk cycle leg angles
export const walkLegs = (frame: number, on: boolean) =>
  on ? { legL: Math.sin(frame * 0.5) * 22, legR: -Math.sin(frame * 0.5) * 22 } : { legL: 0, legR: 0 };

const G1 = "#2a9a46";
const G2 = "#0f6b2c";
const G3 = "#0a4f20";

const Arm: React.FC<{ readonly side: "L" | "R"; readonly angle: number; readonly hold: Hold }> = ({ side, angle, hold }) => {
  const x = side === "L" ? 118 : 282;
  const rot = side === "L" ? angle : -angle;
  return (
    <g transform={`translate(${x} 352) rotate(${rot})`}>
      <rect x={-27} y={-6} width={54} height={108} rx={27} fill="url(#body)" />
      <circle cx={0} cy={110} r={31} fill="url(#hand)" />
      {/* thumb */}
      <circle cx={side === "L" ? 22 : -22} cy={96} r={12} fill={G1} />
      {side === "R" && hold === "phone" ? (
        <g transform="translate(-6 98) rotate(180)">
          <rect x={-30} y={-58} width={60} height={104} rx={12} fill="#1d1d1d" />
          <rect x={-24} y={-50} width={48} height={86} rx={7} fill="#3c6" opacity={0.85} />
          <rect x={-14} y={-38} width={28} height={28} rx={3} fill="#fff" />
        </g>
      ) : null}
      {side === "R" && hold === "magnifier" ? (
        <g transform="translate(0 118) rotate(180)">
          <rect x={-8} y={-10} width={16} height={70} rx={8} fill="#222" />
          <circle cx={0} cy={-56} r={50} fill="rgba(200,235,255,0.35)" stroke="#222" strokeWidth={12} />
          <path d="M-22 -78 a30 30 0 0 1 26 -8" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      ) : null}
    </g>
  );
};

const Leg: React.FC<{ readonly side: "L" | "R"; readonly angle: number }> = ({ side, angle }) => (
  <g transform={`translate(${side === "L" ? 162 : 238} 468) rotate(${angle})`}>
    <rect x={-30} y={-10} width={60} height={112} rx={30} fill="url(#body)" />
    <ellipse cx={side === "L" ? -6 : 6} cy={108} rx={42} ry={25} fill="url(#hand)" />
  </g>
);

export const Character: React.FC<{
  readonly rig: Rig;
  readonly x: number; // centre of the feet
  readonly y: number; // ground line
  readonly scale: number;
  readonly flip?: boolean;
  readonly glow?: boolean;
}> = ({ rig, x, y, scale, flip, glow }) => {
  const w = 400 * scale;
  const h = 640 * scale;
  const eyeRy = Math.max(1.5, 25 * (1 - rig.blink) * (rig.mood === "surprised" ? 1.2 : 1));
  const px = rig.lookX * 7;
  const py = rig.lookY * 7;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 400 640"
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h,
        overflow: "visible",
        scale: flip ? "-1 1" : undefined,
        filter: glow ? "drop-shadow(0 0 24px rgba(255,255,255,0.3))" : undefined,
      }}
    >
      <defs>
        <radialGradient id="head" cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#3fb85c" />
          <stop offset="0.55" stopColor={G1} />
          <stop offset="1" stopColor={G3} />
        </radialGradient>
        <radialGradient id="body" cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#35ad52" />
          <stop offset="0.6" stopColor={G2} />
          <stop offset="1" stopColor={G3} />
        </radialGradient>
        <radialGradient id="hand" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#3fb85c" />
          <stop offset="1" stopColor={G2} />
        </radialGradient>
        <radialGradient id="face" cx="45%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.8" stopColor="#f1f4f2" />
          <stop offset="1" stopColor="#d9e2dc" />
        </radialGradient>
      </defs>

      <ellipse cx={200} cy={630} rx={120} ry={14} fill="rgba(0,0,0,0.16)" />

      {/* squash & stretch from the feet */}
      <g transform={`translate(200 630) scale(${1 + rig.squash} ${1 - rig.squash}) translate(-200 -630)`}>
        <Leg side="L" angle={rig.legL} />
        <Leg side="R" angle={rig.legR} />
        <ellipse cx={200} cy={400} rx={108} ry={118} fill="url(#body)" />
        <Arm side="L" angle={rig.armL} hold={rig.hold} />

        {/* head */}
        <g transform={`rotate(${rig.tilt} 200 300)`}>
          <circle cx={200} cy={175} r={158} fill="url(#head)" />
          <ellipse cx={200} cy={200} rx={122} ry={112} fill="url(#face)" />
          <ellipse cx={142} cy={66} rx={54} ry={24} fill="#fff" opacity={0.18} transform="rotate(-28 142 66)" />

          {rig.mood === "happy" ? (
            <>
              <path d={`M${146 + px} ${192} q14 -18 28 0`} stroke="#111" strokeWidth={7} fill="none" strokeLinecap="round" />
              <path d={`M${226 + px} ${192} q14 -18 28 0`} stroke="#111" strokeWidth={7} fill="none" strokeLinecap="round" />
            </>
          ) : (
            [156, 244].map((ex) => (
              <g key={ex}>
                <ellipse cx={ex + px} cy={194 + py} rx={18} ry={eyeRy} fill="#111" />
                {rig.blink < 0.5 ? (
                  <>
                    <circle cx={ex + px - 6} cy={184 + py} r={5.5} fill="#fff" />
                    <path d={`M${ex + px - 9} ${208 + py} q9 7 18 0`} stroke="#3fd16b" strokeWidth={3} fill="none" strokeLinecap="round" />
                  </>
                ) : null}
              </g>
            ))
          )}

          {rig.mood === "worried" ? (
            <>
              <path d="M132 162 L176 146" stroke="#2b2b2b" strokeWidth={6} strokeLinecap="round" />
              <path d="M268 162 L224 146" stroke="#2b2b2b" strokeWidth={6} strokeLinecap="round" />
              <path d="M300 120 q8 14 0 20 q-8 -6 0 -20" fill="#7cc8ff" />
            </>
          ) : null}

          {/* mouth */}
          {rig.mouth > 0.05 ? (
            <g>
              <ellipse cx={200} cy={258} rx={18 + rig.mouth * 6} ry={3 + rig.mouth * 18} fill="#3b1416" />
              <ellipse cx={200} cy={265 + rig.mouth * 7} rx={9 + rig.mouth * 3} ry={2 + rig.mouth * 5} fill="#e0707a" opacity={rig.mouth > 0.35 ? 1 : 0} />
            </g>
          ) : rig.mood === "happy" ? (
            <path d="M184 244 q16 16 32 0" stroke="#3b1416" strokeWidth={6} fill="none" strokeLinecap="round" />
          ) : rig.mood === "worried" ? (
            <path d="M186 254 q14 -10 28 0" stroke="#3b1416" strokeWidth={5} fill="none" strokeLinecap="round" />
          ) : rig.mood === "surprised" ? (
            <ellipse cx={200} cy={252} rx={10} ry={13} fill="#3b1416" />
          ) : null}
        </g>

        <Arm side="R" angle={rig.armR} hold={rig.hold} />
        {rig.hold === "shield" ? (
          <g transform="translate(262 430)">
            <path d="M0 -120 L82 -92 V-34 C82 12 48 44 0 60 C-48 44 -82 12 -82 -34 V-92 Z" fill="#1f8a3a" stroke="#cfe9d6" strokeWidth={10} />
            <rect x={-26} y={-44} width={52} height={42} rx={8} fill="#d8ffe4" />
            <path d="M-15 -44 v-12 a15 15 0 0 1 30 0 v12" stroke="#d8ffe4" strokeWidth={9} fill="none" />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
