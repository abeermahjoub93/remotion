import { Composition, Still } from "remotion";
import { Scene } from "./Scene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Post45"
        component={Scene}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{ layout: "4x5" as const, freezeAt: null }}
      />
      <Composition
        id="Reel916"
        component={Scene}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ layout: "9x16" as const, freezeAt: null }}
      />
      {/* static reproduction of reference/design-C.html */}
      <Still
        id="FinalFrame"
        component={Scene}
        width={1080}
        height={1350}
        defaultProps={{ layout: "4x5" as const, freezeAt: 359 }}
      />
    </>
  );
};
