import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Mascot } from "./Mascot";
import { LogoIntroScene } from "./qr/LogoIntroScene";
import { QrAskScene } from "./qr/QrAskScene";
import { QrCtaScene } from "./qr/QrCtaScene";
import { QrHookScene } from "./qr/QrHookScene";
import { QrRehookScene } from "./qr/QrRehookScene";
import { QrRouteScene } from "./qr/QrRouteScene";
import { OutroScene } from "./scenes/OutroScene";

// The QR episode acted out by the SecureLogX character. Mascot frames are local to each scene.
export const QrMascotVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Logo intro" durationInFrames={100} premountFor={fps}>
        <AbsoluteFill>
          <LogoIntroScene />
          <Mascot x={540 - 176} y={1360} height={320} exitAt={66} glow={false} poses={[{ at: 46, pose: "hello" }]} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Hook" durationInFrames={180} premountFor={fps}>
        <AbsoluteFill>
          <QrHookScene />
          <Mascot
            x={-20}
            y={860}
            height={360}
            exitAt={null}
            glow={false}
            poses={[
              { at: 22, pose: "rushing" },
              { at: 42, pose: "thinking" },
              { at: 100, pose: "confused" },
            ]}
          />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Route" durationInFrames={180} premountFor={fps}>
        <AbsoluteFill>
          <QrRouteScene />
          <Mascot
            x={-50}
            y={540}
            height={380}
            exitAt={null}
            glow={false}
            poses={[
              { at: 14, pose: "explore" },
              { at: 108, pose: "idea" },
            ]}
          />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Ask" durationInFrames={330} premountFor={fps}>
        <AbsoluteFill>
          <QrAskScene signLeft={40} />
          <Mascot
            x={650}
            y={250}
            height={470}
            exitAt={null}
            glow={false}
            poses={[
              { at: 12, pose: "inspect" },
              { at: 120, pose: "confused" },
              { at: 220, pose: "worried" },
            ]}
          />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Re-hook" durationInFrames={150} premountFor={fps}>
        <AbsoluteFill>
          <QrRehookScene />
          <Mascot
            x={-20}
            y={960}
            height={300}
            exitAt={null}
            glow
            poses={[
              { at: 30, pose: "pointing" },
              { at: 96, pose: "idea" },
            ]}
          />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={180} premountFor={fps}>
        <AbsoluteFill>
          <QrCtaScene />
          <Mascot
            x={700}
            y={710}
            height={380}
            exitAt={null}
            glow={false}
            poses={[
              { at: 18, pose: "protect" },
              { at: 58, pose: "thumbs-up" },
              { at: 112, pose: "secure" },
            ]}
          />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence name="Outro" durationInFrames={140} premountFor={fps}>
        <AbsoluteFill>
          <OutroScene mark="sx" />
          <Mascot x={540 - 143} y={1450} height={260} exitAt={null} glow={false} poses={[{ at: 60, pose: "hello" }]} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
