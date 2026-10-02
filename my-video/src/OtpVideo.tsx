import { Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { staticFile, useVideoConfig } from "remotion";
import { OtpCtaScene } from "./otp/OtpCtaScene";
import { OtpDoScene } from "./otp/OtpDoScene";
import { OtpDontScene } from "./otp/OtpDontScene";
import { OtpHookScene } from "./otp/OtpHookScene";
import { OtpRehookScene } from "./otp/OtpRehookScene";
import { OutroScene } from "./scenes/OutroScene";

export const OtpVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {/* Series intro, used as-is (ends on full SX green) */}
      <TransitionSeries.Sequence name="Intro" durationInFrames={88} premountFor={fps}>
        <Video src={staticFile("intro.mp4")} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Hook" durationInFrames={180} premountFor={fps}>
        <OtpHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Don't share / approve" durationInFrames={300} premountFor={fps}>
        <OtpDontScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Re-hook" durationInFrames={180} premountFor={fps}>
        <OtpRehookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Instead" durationInFrames={270} premountFor={fps}>
        <OtpDoScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={180} premountFor={fps}>
        <OtpCtaScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Outro" durationInFrames={140} premountFor={fps}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
