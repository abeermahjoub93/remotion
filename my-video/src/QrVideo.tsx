import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { LogoIntroScene } from "./qr/LogoIntroScene";
import { QrAskScene } from "./qr/QrAskScene";
import { QrCtaScene } from "./qr/QrCtaScene";
import { QrHookScene } from "./qr/QrHookScene";
import { QrRehookScene } from "./qr/QrRehookScene";
import { QrRouteScene } from "./qr/QrRouteScene";
import { OutroScene } from "./scenes/OutroScene";

export const QrVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {/* Motion-graphics opener with the official SX icon (ends on full SX green) */}
      <TransitionSeries.Sequence name="Logo intro" durationInFrames={100} premountFor={fps}>
        <LogoIntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Hook" durationInFrames={180} premountFor={fps}>
        <QrHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Route" durationInFrames={180} premountFor={fps}>
        <QrRouteScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Ask" durationInFrames={330} premountFor={fps}>
        <QrAskScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Re-hook" durationInFrames={150} premountFor={fps}>
        <QrRehookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={180} premountFor={fps}>
        <QrCtaScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Outro" durationInFrames={140} premountFor={fps}>
        <OutroScene mark="sx" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
