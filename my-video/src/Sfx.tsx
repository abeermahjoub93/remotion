import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

export type SfxName =
  | "alert"
  | "click"
  | "clock-fast"
  | "ding"
  | "glitch"
  | "notify"
  | "pop"
  | "riser"
  | "scan"
  | "stamp"
  | "success"
  | "swish"
  | "thud"
  | "tick"
  | "tock"
  | "typing"
  | "whoosh";

// One sound effect placed at a frame of the current scene
export const Sfx: React.FC<{
  readonly name: SfxName;
  readonly at: number;
  readonly volume?: number;
}> = ({ name, at, volume = 1 }) => (
  <Sequence from={at} name={`sfx: ${name}`} premountFor={30}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
