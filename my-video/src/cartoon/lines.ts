import { talkFrames } from "./SpeechBubble";

export type Line = {
  readonly from: number;
  readonly to: number;
  readonly ar: string;
  readonly en: string;
};

// frame ranges where the character's mouth moves for these lines
export const speaking = (lines: readonly Line[]) =>
  lines.map((l) => [l.from + 2, l.from + 2 + talkFrames(l.ar)] as const);
