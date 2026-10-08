import { Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { staticFile, useVideoConfig } from "remotion";
import { CoreMessageScene } from "./scenes/CoreMessageScene";
import { CtaScene } from "./scenes/CtaScene";
import { EngageScene } from "./scenes/EngageScene";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { PhishingTestScene } from "./scenes/PhishingTestScene";
import { RehookScene } from "./scenes/RehookScene";

export const PhishingVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {/* Series intro, used as-is from the previous episode (ends on full SX green) */}
      <TransitionSeries.Sequence name="Intro" durationInFrames={88} premountFor={fps}>
        <Video src={staticFile("intro.mp4")} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Hook" durationInFrames={180} premountFor={fps}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Phishing test" durationInFrames={585} premountFor={fps}>
        <PhishingTestScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Re-hook" durationInFrames={180} premountFor={fps}>
        <RehookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Core message" durationInFrames={150} premountFor={fps}>
        <CoreMessageScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={210} premountFor={fps}>
        <CtaScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Engage" durationInFrames={150} premountFor={fps}>
        <EngageScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Outro" durationInFrames={140} premountFor={fps}>
        <OutroScene mark="shield" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
