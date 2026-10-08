import { Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { staticFile, useVideoConfig } from "remotion";
import { PwChallengeScene } from "./password/PwChallengeScene";
import { PwCtaScene } from "./password/PwCtaScene";
import { PwFixScene } from "./password/PwFixScene";
import { PwHookScene } from "./password/PwHookScene";
import { PwRehookScene } from "./password/PwRehookScene";
import { PwReuseScene } from "./password/PwReuseScene";
import { OutroScene } from "./scenes/OutroScene";

export const PasswordVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {/* Series intro, used as-is (ends on full SX green) */}
      <TransitionSeries.Sequence name="Intro" durationInFrames={88} premountFor={fps}>
        <Video src={staticFile("intro.mp4")} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Hook" durationInFrames={210} premountFor={fps}>
        <PwHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Reuse chain" durationInFrames={390} premountFor={fps}>
        <PwReuseScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Re-hook" durationInFrames={150} premountFor={fps}>
        <PwRehookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Focus on" durationInFrames={240} premountFor={fps}>
        <PwFixScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={210} premountFor={fps}>
        <PwCtaScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Challenge + poll" durationInFrames={240} premountFor={fps}>
        <PwChallengeScene />
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
