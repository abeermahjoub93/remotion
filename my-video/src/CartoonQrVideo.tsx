import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Character, REST, blinkAt } from "./cartoon/Character";
import { CtAskScene } from "./cartoon/CtAskScene";
import { CtCtaScene } from "./cartoon/CtCtaScene";
import { CtDoorScene } from "./cartoon/CtDoorScene";
import { CtHelloScene } from "./cartoon/CtHelloScene";
import { CtHookScene } from "./cartoon/CtHookScene";
import { CtRouteScene } from "./cartoon/CtRouteScene";
import { LogoIntroScene } from "./qr/LogoIntroScene";
import { OutroScene } from "./scenes/OutroScene";

const OutroWithHost: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OutroScene mark="sx" />
      {frame >= 56 ? (
        <Character
          x={540}
          y={1720}
          scale={0.42}
          rig={{ ...REST, armR: 150 + Math.sin(frame * 0.45) * 22, mood: "happy", blink: blinkAt(frame), squash: Math.max(0, 0.1 - (frame - 56) * 0.01) }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// The QR episode as a cartoon, hosted and explained by the SecureLogX character
export const CartoonQrVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Logo intro" durationInFrames={100} premountFor={fps}>
        <LogoIntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Hello" durationInFrames={150} premountFor={fps}>
        <CtHelloScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 14 })} />
      <TransitionSeries.Sequence name="Hook" durationInFrames={190} premountFor={fps}>
        <CtHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 14 })} />
      <TransitionSeries.Sequence name="Route" durationInFrames={220} premountFor={fps}>
        <CtRouteScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 14 })} />
      <TransitionSeries.Sequence name="Ask" durationInFrames={400} premountFor={fps}>
        <CtAskScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 14 })} />
      <TransitionSeries.Sequence name="Doorway" durationInFrames={196} premountFor={fps}>
        <CtDoorScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 14 })} />
      <TransitionSeries.Sequence name="CTA" durationInFrames={220} premountFor={fps}>
        <CtCtaScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 14 })} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={140} premountFor={fps}>
        <OutroWithHost />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
