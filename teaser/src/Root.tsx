import { Composition } from "remotion";
import { Teaser } from "./Teaser";
import { T } from "./timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teaser-D6-AR"
        component={Teaser}
        durationInFrames={T.duration}
        fps={T.fps}
        width={1080}
        height={1350}
        defaultProps={{ lang: "ar" as const, day: 6, design: "frame" as const, width: 1080, height: 1350 }}
      />
      <Composition
        id="Teaser-D6-AR-X"
        component={Teaser}
        durationInFrames={T.duration}
        fps={T.fps}
        width={1200}
        height={1200}
        defaultProps={{ lang: "ar" as const, day: 6, design: "frame" as const, width: 1200, height: 1200 }}
      />
      <Composition
        id="Teaser-D6-EN"
        component={Teaser}
        durationInFrames={T.duration}
        fps={T.fps}
        width={1080}
        height={1350}
        defaultProps={{ lang: "en" as const, day: 6, design: "frame" as const, width: 1080, height: 1350 }}
      />
      <Composition
        id="Teaser-D1-AR"
        component={Teaser}
        durationInFrames={T.duration}
        fps={T.fps}
        width={1080}
        height={1350}
        defaultProps={{ lang: "ar" as const, day: 1, design: "numeral" as const, width: 1080, height: 1350 }}
      />
      <Composition
        id="Teaser-D1-AR-X"
        component={Teaser}
        durationInFrames={T.duration}
        fps={T.fps}
        width={1200}
        height={1200}
        defaultProps={{ lang: "ar" as const, day: 1, design: "numeral" as const, width: 1200, height: 1200 }}
      />
      <Composition
        id="Teaser-D1-EN"
        component={Teaser}
        durationInFrames={T.duration}
        fps={T.fps}
        width={1080}
        height={1350}
        defaultProps={{ lang: "en" as const, day: 1, design: "numeral" as const, width: 1080, height: 1350 }}
      />
    </>
  );
};
