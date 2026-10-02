import { Composition, Folder } from "remotion";
import { PhishingVideo } from "./PhishingVideo";
import { CoreMessageScene } from "./scenes/CoreMessageScene";
import { CtaScene } from "./scenes/CtaScene";
import { EngageScene } from "./scenes/EngageScene";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { PhishingTestScene } from "./scenes/PhishingTestScene";
import { RehookScene } from "./scenes/RehookScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhishingRedFlags"
        component={PhishingVideo}
        durationInFrames={1599}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Scenes">
        <Composition id="Hook" component={HookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="PhishingTest" component={PhishingTestScene} durationInFrames={585} fps={30} width={1080} height={1920} />
        <Composition id="Rehook" component={RehookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="CoreMessage" component={CoreMessageScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Cta" component={CtaScene} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Engage" component={EngageScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Outro" component={OutroScene} durationInFrames={140} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
